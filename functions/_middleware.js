// Cloudflare Pages Function: docs.tawi.ai/<path> redirects to tawi.ai/docs/<path>, so both addresses work and
// search engines see one copy. Every other host is served as built.
export async function onRequest({request, next}) {
  const url = new URL(request.url);
  if (url.hostname === 'docs.tawi.ai') {
    const rest = url.pathname === '/' ? '' : url.pathname.replace(/^\/docs(?=\/|$)/, '');
    return Response.redirect(`https://tawi.ai/docs${rest}${url.search}`, 301);
  }
  return next();
}
