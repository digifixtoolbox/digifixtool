import '@astrojs/internal-helpers/path';
import 'cookie';
import 'kleur/colors';
import 'es-module-lexer';
import 'html-escaper';
import 'clsx';
import { N as NOOP_MIDDLEWARE_HEADER, d as decodeKey } from './chunks/astro/server_Dw9fQcLJ.mjs';

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

const codeToStatusMap = {
  // Implemented from tRPC error code table
  // https://trpc.io/docs/server/error-handling#error-codes
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TIMEOUT: 405,
  CONFLICT: 409,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_CONTENT: 422,
  TOO_MANY_REQUESTS: 429,
  CLIENT_CLOSED_REQUEST: 499,
  INTERNAL_SERVER_ERROR: 500
};
Object.entries(codeToStatusMap).reduce(
  // reverse the key-value pairs
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/urbansound/Downloads/digifixtool/","adapterName":"","routes":[{"file":"file:///Users/urbansound/Downloads/digifixtool/dist/about/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/about","isIndex":false,"type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///Users/urbansound/Downloads/digifixtool/dist/contact/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/contact","isIndex":false,"type":"page","pattern":"^\\/contact\\/?$","segments":[[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contact.astro","pathname":"/contact","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///Users/urbansound/Downloads/digifixtool/dist/privacy/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/privacy","isIndex":false,"type":"page","pattern":"^\\/privacy\\/?$","segments":[[{"content":"privacy","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/privacy.astro","pathname":"/privacy","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///Users/urbansound/Downloads/digifixtool/dist/tools/compress-image/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/tools/compress-image","isIndex":false,"type":"page","pattern":"^\\/tools\\/compress-image\\/?$","segments":[[{"content":"tools","dynamic":false,"spread":false}],[{"content":"compress-image","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/tools/compress-image.astro","pathname":"/tools/compress-image","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///Users/urbansound/Downloads/digifixtool/dist/tools/convert-image/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/tools/convert-image","isIndex":false,"type":"page","pattern":"^\\/tools\\/convert-image\\/?$","segments":[[{"content":"tools","dynamic":false,"spread":false}],[{"content":"convert-image","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/tools/convert-image.astro","pathname":"/tools/convert-image","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///Users/urbansound/Downloads/digifixtool/dist/tools/image-info/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/tools/image-info","isIndex":false,"type":"page","pattern":"^\\/tools\\/image-info\\/?$","segments":[[{"content":"tools","dynamic":false,"spread":false}],[{"content":"image-info","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/tools/image-info.astro","pathname":"/tools/image-info","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///Users/urbansound/Downloads/digifixtool/dist/tools/images-to-pdf/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/tools/images-to-pdf","isIndex":false,"type":"page","pattern":"^\\/tools\\/images-to-pdf\\/?$","segments":[[{"content":"tools","dynamic":false,"spread":false}],[{"content":"images-to-pdf","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/tools/images-to-pdf.astro","pathname":"/tools/images-to-pdf","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///Users/urbansound/Downloads/digifixtool/dist/tools/qr-code/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/tools/qr-code","isIndex":false,"type":"page","pattern":"^\\/tools\\/qr-code\\/?$","segments":[[{"content":"tools","dynamic":false,"spread":false}],[{"content":"qr-code","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/tools/qr-code.astro","pathname":"/tools/qr-code","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///Users/urbansound/Downloads/digifixtool/dist/tools/resize-image/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/tools/resize-image","isIndex":false,"type":"page","pattern":"^\\/tools\\/resize-image\\/?$","segments":[[{"content":"tools","dynamic":false,"spread":false}],[{"content":"resize-image","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/tools/resize-image.astro","pathname":"/tools/resize-image","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///Users/urbansound/Downloads/digifixtool/dist/tools/social-sizes/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/tools/social-sizes","isIndex":false,"type":"page","pattern":"^\\/tools\\/social-sizes\\/?$","segments":[[{"content":"tools","dynamic":false,"spread":false}],[{"content":"social-sizes","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/tools/social-sizes.astro","pathname":"/tools/social-sizes","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///Users/urbansound/Downloads/digifixtool/dist/tools/text-diff/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/tools/text-diff","isIndex":false,"type":"page","pattern":"^\\/tools\\/text-diff\\/?$","segments":[[{"content":"tools","dynamic":false,"spread":false}],[{"content":"text-diff","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/tools/text-diff.astro","pathname":"/tools/text-diff","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///Users/urbansound/Downloads/digifixtool/dist/tools/word-count/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/tools/word-count","isIndex":false,"type":"page","pattern":"^\\/tools\\/word-count\\/?$","segments":[[{"content":"tools","dynamic":false,"spread":false}],[{"content":"word-count","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/tools/word-count.astro","pathname":"/tools/word-count","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///Users/urbansound/Downloads/digifixtool/dist/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"site":"https://www.pixmidas.com","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(o,t)=>{let i=async()=>{await(await o())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astro-page:src/pages/about@_@astro":"pages/about.astro.mjs","\u0000@astro-page:src/pages/contact@_@astro":"pages/contact.astro.mjs","\u0000@astro-page:src/pages/privacy@_@astro":"pages/privacy.astro.mjs","\u0000@astro-page:src/pages/tools/compress-image@_@astro":"pages/tools/compress-image.astro.mjs","\u0000@astro-page:src/pages/tools/convert-image@_@astro":"pages/tools/convert-image.astro.mjs","\u0000@astro-page:src/pages/tools/image-info@_@astro":"pages/tools/image-info.astro.mjs","\u0000@astro-page:src/pages/tools/images-to-pdf@_@astro":"pages/tools/images-to-pdf.astro.mjs","\u0000@astro-page:src/pages/tools/qr-code@_@astro":"pages/tools/qr-code.astro.mjs","\u0000@astro-page:src/pages/tools/resize-image@_@astro":"pages/tools/resize-image.astro.mjs","\u0000@astro-page:src/pages/tools/social-sizes@_@astro":"pages/tools/social-sizes.astro.mjs","\u0000@astro-page:src/pages/tools/text-diff@_@astro":"pages/tools/text-diff.astro.mjs","\u0000@astro-page:src/pages/tools/word-count@_@astro":"pages/tools/word-count.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-manifest":"manifest_4vDbZX1G.mjs","/Users/urbansound/Downloads/digifixtool/src/components/ImageCompressor.jsx":"_astro/ImageCompressor.CLV6h0lj.js","/Users/urbansound/Downloads/digifixtool/src/components/ImageConverter.jsx":"_astro/ImageConverter.8GzdoSMG.js","/Users/urbansound/Downloads/digifixtool/src/components/ImageResizer.jsx":"_astro/ImageResizer.DPileswQ.js","/Users/urbansound/Downloads/digifixtool/src/components/ImageInfo.jsx":"_astro/ImageInfo.DjK-p-BD.js","/Users/urbansound/Downloads/digifixtool/src/components/SocialSizes.jsx":"_astro/SocialSizes.WH2EjrGR.js","/Users/urbansound/Downloads/digifixtool/src/components/QRGenerator.jsx":"_astro/QRGenerator.De_LX-No.js","/Users/urbansound/Downloads/digifixtool/src/components/TextDiff.jsx":"_astro/TextDiff.Cru7Wux0.js","/Users/urbansound/Downloads/digifixtool/src/components/WordCounter.jsx":"_astro/WordCounter.Bk349ZTj.js","/Users/urbansound/Downloads/digifixtool/src/components/ImagesToPDF.jsx":"_astro/ImagesToPDF.B17ishjK.js","/Users/urbansound/Downloads/digifixtool/src/components/PromoBanner.jsx":"_astro/PromoBanner.D_uCdWSP.js","@astrojs/react/client.js":"_astro/client.DrE9CFQR.js","/astro/hoisted.js?q=0":"_astro/hoisted.hLh2XR6N.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/file:///Users/urbansound/Downloads/digifixtool/dist/about/index.html","/file:///Users/urbansound/Downloads/digifixtool/dist/contact/index.html","/file:///Users/urbansound/Downloads/digifixtool/dist/privacy/index.html","/file:///Users/urbansound/Downloads/digifixtool/dist/tools/compress-image/index.html","/file:///Users/urbansound/Downloads/digifixtool/dist/tools/convert-image/index.html","/file:///Users/urbansound/Downloads/digifixtool/dist/tools/image-info/index.html","/file:///Users/urbansound/Downloads/digifixtool/dist/tools/images-to-pdf/index.html","/file:///Users/urbansound/Downloads/digifixtool/dist/tools/qr-code/index.html","/file:///Users/urbansound/Downloads/digifixtool/dist/tools/resize-image/index.html","/file:///Users/urbansound/Downloads/digifixtool/dist/tools/social-sizes/index.html","/file:///Users/urbansound/Downloads/digifixtool/dist/tools/text-diff/index.html","/file:///Users/urbansound/Downloads/digifixtool/dist/tools/word-count/index.html","/file:///Users/urbansound/Downloads/digifixtool/dist/index.html"],"buildFormat":"directory","checkOrigin":false,"serverIslandNameMap":[],"key":"YgvYdsPPPmVHo/n0pgx3fg+bTUMuBYR3SqpAnASgs3w=","experimentalEnvGetSecretEnabled":false});

export { manifest };
