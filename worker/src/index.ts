export interface Env {
	LINKS: KVNamespace;
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

				// Store in KV
				await env.LINKS.put(shortCode as string, parsedUrl.toString());

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

		// Handle Redirects
		if (request.method === 'GET' && url.pathname !== '/' && !url.pathname.startsWith('/api')) {
			const shortCode = url.pathname.slice(1); // Remove leading slash
			const targetUrl = await env.LINKS.get(shortCode);

			if (targetUrl) {
				// Update click counter asynchronously (not waiting for it to finish)
				// For simple demo, we just return redirect
				return Response.redirect(targetUrl, 302);
			}

			return new Response('Not Found', { status: 404 });
		}

		return new Response('URL Shortener API', { headers: corsHeaders });
	},
};
