// ============================================
// CONTENTFUL API CLIENT
// Fetches content from Contentful CMS
// ============================================

const CONFIG = {
    spaceId: '45ihkzz5scen',
    accessToken: 'nyWM_AHb3y9zvW41dAdE3LrHKPDMXVJwVy-GDZcGEJc',
    previewToken: 'GtPCM7vaE1h8CbkJzTxH-UcFnmMnmeX_h2MgIht2d1M',
    baseUrl: 'https://cdn.contentful.com',
    previewUrl: 'https://preview.contentful.com',
};

// Use preview mode via URL param: ?preview=true
const isPreview = new URLSearchParams(window.location.search).get('preview') === 'true';

function getApiUrl() {
    return isPreview ? CONFIG.previewUrl : CONFIG.baseUrl;
}

function getToken() {
    return isPreview ? CONFIG.previewToken : CONFIG.accessToken;
}

// ============================================
// CACHE — sessionStorage-backed
// ============================================
const CACHE_PREFIX = 'cf_';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached(key) {
    try {
        const raw = sessionStorage.getItem(CACHE_PREFIX + key);
        if (!raw) return null;
        const { data, timestamp } = JSON.parse(raw);
        if (Date.now() - timestamp > CACHE_TTL) {
            sessionStorage.removeItem(CACHE_PREFIX + key);
            return null;
        }
        return data;
    } catch {
        return null;
    }
}

function setCache(key, data) {
    try {
        sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ data, timestamp: Date.now() }));
    } catch {
        // sessionStorage full — silently fail
    }
}

// ============================================
// API FETCHING
// ============================================

/**
 * Fetch entries of a given content type from Contentful.
 * Returns an array of simplified entry objects with resolved assets.
 */
export async function fetchEntries(contentType, options = {}) {
    const cacheKey = `entries_${contentType}_${JSON.stringify(options)}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    const params = new URLSearchParams({
        access_token: getToken(),
        content_type: contentType,
        include: '2', // resolve 2 levels of linked assets/entries
        ...options,
    });

    // Add ordering by 'order' field if it exists
    if (!options.order) {
        params.set('order', 'fields.order');
    }

    try {
        const response = await fetch(
            `${getApiUrl()}/spaces/${CONFIG.spaceId}/environments/master/entries?${params}`
        );

        if (!response.ok) {
            console.warn(`Contentful API error: ${response.status} for ${contentType}`);
            return null;
        }

        const json = await response.json();
        const resolved = resolveResponse(json);
        setCache(cacheKey, resolved);
        return resolved;
    } catch (error) {
        console.warn('Contentful fetch failed:', error);
        return null;
    }
}

/**
 * Fetch a single entry by content type (for singletons like Site Settings).
 */
export async function fetchSingleEntry(contentType) {
    const entries = await fetchEntries(contentType, { limit: '1' });
    return entries && entries.length > 0 ? entries[0] : null;
}

// ============================================
// RESPONSE RESOLVER
// Flattens Contentful's nested response format
// ============================================

function resolveResponse(json) {
    const { items, includes } = json;
    const assetMap = {};
    const entryMap = {};

    // Build lookup maps for linked assets and entries
    if (includes?.Asset) {
        includes.Asset.forEach((asset) => {
            assetMap[asset.sys.id] = {
                url: asset.fields.file?.url ? `https:${asset.fields.file.url}` : null,
                title: asset.fields.title || '',
                description: asset.fields.description || '',
                contentType: asset.fields.file?.contentType || '',
                width: asset.fields.file?.details?.image?.width,
                height: asset.fields.file?.details?.image?.height,
            };
        });
    }

    if (includes?.Entry) {
        includes.Entry.forEach((entry) => {
            entryMap[entry.sys.id] = flattenFields(entry.fields);
        });
    }

    // Flatten each item
    return items.map((item) => {
        const fields = flattenFields(item.fields);

        // Resolve linked assets in fields
        for (const [key, value] of Object.entries(item.fields)) {
            if (value?.sys?.type === 'Link' && value.sys.linkType === 'Asset') {
                fields[key] = assetMap[value.sys.id] || null;
            }
            if (value?.sys?.type === 'Link' && value.sys.linkType === 'Entry') {
                fields[key] = entryMap[value.sys.id] || null;
            }
            // Handle arrays of links
            if (Array.isArray(value)) {
                fields[key] = value.map((v) => {
                    if (v?.sys?.type === 'Link' && v.sys.linkType === 'Asset') {
                        return assetMap[v.sys.id] || null;
                    }
                    if (v?.sys?.type === 'Link' && v.sys.linkType === 'Entry') {
                        return entryMap[v.sys.id] || null;
                    }
                    return v;
                });
            }
        }

        fields._id = item.sys.id;
        fields._contentType = item.sys.contentType?.sys?.id;
        return fields;
    });
}

function flattenFields(fields) {
    const result = {};
    for (const [key, value] of Object.entries(fields)) {
        result[key] = value;
    }
    return result;
}

// ============================================
// RICH TEXT RENDERER
// Converts Contentful Rich Text JSON to HTML
// ============================================

const BLOCK_TAGS = {
    'heading-1': 'h1',
    'heading-2': 'h2',
    'heading-3': 'h3',
    'heading-4': 'h4',
    'heading-5': 'h5',
    'heading-6': 'h6',
    'paragraph': 'p',
    'blockquote': 'blockquote',
    'unordered-list': 'ul',
    'ordered-list': 'ol',
    'list-item': 'li',
    'hr': 'hr',
};

const INLINE_TAGS = {
    'bold': 'strong',
    'italic': 'em',
    'underline': 'u',
    'code': 'code',
};

export function renderRichText(richTextDocument) {
    if (!richTextDocument || !richTextDocument.content) return '';
    return richTextDocument.content.map(renderNode).join('');
}

function renderNode(node) {
    // Text node
    if (node.nodeType === 'text') {
        let text = escapeHtml(node.value);
        if (node.marks) {
            node.marks.forEach((mark) => {
                const tag = INLINE_TAGS[mark.type];
                if (tag) {
                    text = `<${tag}>${text}</${tag}>`;
                }
            });
        }
        return text;
    }

    // Hyperlink
    if (node.nodeType === 'hyperlink') {
        const children = node.content.map(renderNode).join('');
        return `<a href="${escapeHtml(node.data.uri)}" target="_blank" rel="noopener">${children}</a>`;
    }

    // Embedded Asset (images, GIFs)
    if (node.nodeType === 'embedded-asset-block') {
        const asset = node.data?.target;
        if (asset?.fields?.file) {
            const url = `https:${asset.fields.file.url}`;
            const alt = asset.fields.title || asset.fields.description || '';
            const contentType = asset.fields.file.contentType || '';

            if (contentType.startsWith('image/')) {
                return `<div class="rich-media"><img src="${url}" alt="${escapeHtml(alt)}" loading="lazy" /></div>`;
            }
            if (contentType.startsWith('video/')) {
                return `<div class="rich-media"><video src="${url}" controls></video></div>`;
            }
        }
        return '';
    }

    // Embedded Entry (could be a YouTube embed or custom component)
    if (node.nodeType === 'embedded-entry-block') {
        const entry = node.data?.target;
        if (entry?.fields?.youtubeUrl) {
            return renderYouTubeEmbed(entry.fields.youtubeUrl);
        }
        return '';
    }

    // Block-level node
    const tag = BLOCK_TAGS[node.nodeType];
    if (tag) {
        if (node.nodeType === 'hr') return '<hr />';
        const children = node.content ? node.content.map(renderNode).join('') : '';
        return `<${tag}>${children}</${tag}>`;
    }

    // Fallback: render children
    if (node.content) {
        return node.content.map(renderNode).join('');
    }

    return '';
}

function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// ============================================
// YOUTUBE EMBED HELPER
// ============================================

/**
 * Extract YouTube video ID from various URL formats.
 */
export function getYouTubeId(url) {
    if (!url) return null;
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

/**
 * Render a responsive YouTube embed iframe.
 */
export function renderYouTubeEmbed(url) {
    const videoId = getYouTubeId(url);
    if (!videoId) return '';
    return `
    <div class="youtube-embed">
      <iframe
        src="https://www.youtube-nocookie.com/embed/${videoId}"
        title="YouTube video"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
  `;
}

// ============================================
// FULL DATA LOADER
// Fetches all content types and shapes them
// into the same structure as SITE_DATA
// ============================================

export async function loadSiteData() {
    try {
        const [settings, stats, pillars, projects, clusters, experience, techStack] = await Promise.all([
            fetchSingleEntry('siteSettings'),
            fetchEntries('stat'),
            fetchEntries('pillar'),
            fetchEntries('project'),
            fetchEntries('cluster'),
            fetchEntries('experience'),
            fetchEntries('techCategory'),
        ]);

        // If we got nothing at all, return null to trigger fallback
        if (!settings && !pillars && !projects) {
            return null;
        }

        return {
            name: settings?.name || 'Mahmoud Ramdane',
            initials: settings?.initials || 'MR',
            eyebrow: settings?.eyebrow || 'Developer · Designer · Builder',
            title: settings?.title || '',
            subtitle: settings?.subtitle || '',
            location: settings?.location || '',
            email: settings?.email || '',
            instagram: settings?.instagramUrl || 'https://www.instagram.com/mahmoud.ramdane',
            linkedin: settings?.linkedinUrl || 'https://www.linkedin.com/in/mahmoudramdane/',

            stats: stats
                ? stats.map((s) => ({ label: s.label, value: s.value }))
                : [],

            pillars: pillars
                ? pillars.map((p) => ({
                    icon: p.icon || '⚡',
                    title: p.title,
                    tagline: p.tagline || '',
                    description: p.description || '',
                    keywords: p.keywords || [],
                }))
                : [],

            clusters: clusters
                ? clusters.map((c) => ({
                    name: c.name,
                    color: c.color || 'var(--color-accent-1)',
                    projects: c.projectNames || [],
                }))
                : [],

            projects: projects
                ? projects.map((p) => ({
                    title: p.title,
                    subtitle: p.subtitle || '',
                    description: p.description || null, // Rich text JSON
                    tags: p.tags || [],
                    year: p.year || '',
                    featured: p.featured || false,
                    media: p.media || null, // Resolved asset
                    youtubeUrl: p.youtubeUrl || null,
                }))
                : [],

            experience: experience
                ? experience.map((e) => ({
                    date: e.dateRange,
                    role: e.role,
                    org: e.organization || '',
                    description: e.description || '',
                }))
                : [],

            techStack: techStack
                ? techStack.map((t) => ({
                    category: t.category,
                    color: t.color || 'var(--color-accent-1)',
                    items: t.items || [],
                }))
                : [],
        };
    } catch (error) {
        console.warn('Failed to load site data from Contentful:', error);
        return null;
    }
}
