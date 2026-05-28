import jwt from '@tsndr/cloudflare-worker-jwt';

export interface Env {
	LINKS: KVNamespace;
	SUPABASE_JWT_SECRET: string;
}

// Very basic nanoid equivalent since nanoid is ESM only and might be tricky in pure workers sometimes, 
// but we can use crypto.getRandomValues. Actually, let's just implement a simple 6-char generator.
function generateId(length = 6) {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		// Handle CORS preflight requests
		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders });
		}

		// Helper to verify JWT
		const verifyAuth = async (req: Request, secret: string) => {
			const authHeader = req.headers.get('Authorization');
			if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
			
			const token = authHeader.split(' ')[1];
			try {
				const isValid = await jwt.verify(token, secret);
				if (!isValid) return null;
				const { payload } = jwt.decode(token);
				return payload.sub; // The user ID
			} catch (e) {
				return null;
			}
		};

		if (url.pathname === '/api/shorten' && request.method === 'POST') {
			try {
				const { url: targetUrl, alias } = await request.json<{ url: string; alias?: string }>();

				// Validate URL
				let parsedUrl;
				try {
					parsedUrl = new URL(targetUrl);
					if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
						throw new Error('Invalid protocol');
					}
				} catch (e) {
					return new Response(JSON.stringify({ error: 'Invalid URL' }), {
						status: 400,
						headers: { 'Content-Type': 'application/json', ...corsHeaders },
					});
				}

				let shortCode = alias;
				if (alias) {
					// Check if alias exists
					const existing = await env.LINKS.get(alias);
					if (existing) {
						return new Response(JSON.stringify({ error: 'Alias already taken' }), {
							status: 409,
							headers: { 'Content-Type': 'application/json', ...corsHeaders },
						});
					}
				} else {
					// Generate random code, checking for collisions
					for (let i = 0; i < 3; i++) {
						shortCode = generateId();
						const existing = await env.LINKS.get(shortCode);
						if (!existing) break;
					}
				}

				// Check auth
				const userId = await verifyAuth(request, env.SUPABASE_JWT_SECRET);
				const createdAt = new Date().toISOString();
				const linkData = { targetUrl: parsedUrl.toString(), createdAt, clicks: 0, userId };

				// Store in KV with a 3-day expiration (259200 seconds) by default for free tier (if anonymous)
				// If authenticated, maybe don't expire, or expire later? We'll keep it simple and omit expiration for logged in users
				const putOptions = userId ? {} : { expirationTtl: 259200 };
				
				await env.LINKS.put(shortCode as string, JSON.stringify(linkData), putOptions);

				// If logged in, add to the user's list of links
				if (userId) {
					const userLinksKey = `user_links:${userId}`;
					const existingLinksStr = await env.LINKS.get(userLinksKey);
					const existingLinks = existingLinksStr ? JSON.parse(existingLinksStr) : [];
					
					// Prepend the new link
					existingLinks.unshift({
						shortCode,
						targetUrl: parsedUrl.toString(),
						createdAt,
						clicks: 0
					});
					
					await env.LINKS.put(userLinksKey, JSON.stringify(existingLinks));
				}

				return new Response(JSON.stringify({ shortCode, shortUrl: `${url.origin}/${shortCode}` }), {
					headers: { 'Content-Type': 'application/json', ...corsHeaders },
				});
			} catch (e) {
				return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
					status: 500,
					headers: { 'Content-Type': 'application/json', ...corsHeaders },
				});
			}
		}

		// Get User Links
		if (url.pathname === '/api/links' && request.method === 'GET') {
			try {
				const userId = await verifyAuth(request, env.SUPABASE_JWT_SECRET);
				if (!userId) {
					return new Response(JSON.stringify({ error: 'Unauthorized' }), {
						status: 401,
						headers: { 'Content-Type': 'application/json', ...corsHeaders },
					});
				}

				const userLinksKey = `user_links:${userId}`;
				const linksStr = await env.LINKS.get(userLinksKey);
				const links = linksStr ? JSON.parse(linksStr) : [];

				return new Response(JSON.stringify(links), {
					headers: { 'Content-Type': 'application/json', ...corsHeaders },
				});
			} catch (e) {
				return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
					status: 500,
					headers: { 'Content-Type': 'application/json', ...corsHeaders },
				});
			}
		}

		// Handle Redirects
		if (request.method === 'GET' && url.pathname !== '/' && !url.pathname.startsWith('/api')) {
			const shortCode = url.pathname.slice(1); // Remove leading slash
			const linkDataStr = await env.LINKS.get(shortCode);

			if (linkDataStr) {
				// Handle legacy string values vs new JSON object values
				let targetUrl = '';
				try {
					const linkData = JSON.parse(linkDataStr);
					targetUrl = linkData.targetUrl;
				} catch {
					targetUrl = linkDataStr; // Fallback for legacy links that are just raw strings
				}

				// Update click counter asynchronously (not waiting for it to finish)
				// For simple demo, we just return redirect
				return Response.redirect(targetUrl, 302);
			}

			return new Response('Not Found', { status: 404 });
		}

		return new Response('URL Shortener API', { headers: corsHeaders });
	},
};
