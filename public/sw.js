/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return (
      registry[uri] ||
      new Promise((resolve) => {
        if ("document" in self) {
          const script = document.createElement("script");
          script.src = uri;
          script.onload = resolve;
          document.head.appendChild(script);
        } else {
          nextDefineUri = uri;
          importScripts(uri);
          resolve();
        }
      }).then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri =
      nextDefineUri ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = (depUri) => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require,
    };
    registry[uri] = Promise.all(
      depsNames.map((depName) => specialDeps[depName] || require(depName))
    ).then((deps) => {
      factory(...deps);
      return exports;
    });
  };
}
define([
  "../../../../../Lahcen Laayouni/Desktop/Noteswap/client/node_modules/workbox-routing/registerRoute.mjs",
  "../../../../../Lahcen Laayouni/Desktop/Noteswap/client/node_modules/workbox-strategies/NetworkFirst.mjs",
  "../../../../../Lahcen Laayouni/Desktop/Noteswap/client/node_modules/workbox-strategies/NetworkOnly.mjs",
  "../../../../../Lahcen Laayouni/Desktop/Noteswap/client/node_modules/workbox-core/clientsClaim.mjs",
  "../../../../../Lahcen Laayouni/Desktop/Noteswap/client/node_modules/workbox-precaching/precacheAndRoute.mjs",
  "../../../../../Lahcen Laayouni/Desktop/Noteswap/client/node_modules/workbox-precaching/cleanupOutdatedCaches.mjs",
], function (
  registerRoute_mjs,
  NetworkFirst_mjs,
  NetworkOnly_mjs,
  clientsClaim_mjs,
  precacheAndRoute_mjs,
  cleanupOutdatedCaches_mjs
) {
  "use strict";

  importScripts();
  self.skipWaiting();
  clientsClaim_mjs.clientsClaim();

  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  precacheAndRoute_mjs.precacheAndRoute(
    [
      {
        url: "/_next/build-manifest.json",
        revision: "93989c55f877c6208860038295ebd320",
      },
      {
        url: "/_next/react-loadable-manifest.json",
        revision: "64c4190ce3545bc8024a0cad72f853f5",
      },
      {
        url: "/_next/server/middleware-build-manifest.js",
        revision: "cde6ed6a66e5704df03051e5573a09fd",
      },
      {
        url: "/_next/server/middleware-react-loadable-manifest.js",
        revision: "49c1ded49bbe7ebbe5d4125bd88b0273",
      },
      {
        url: "/_next/server/next-font-manifest.js",
        revision: "e258694de19faacf02bc479ce0e448bb",
      },
      {
        url: "/_next/server/next-font-manifest.json",
        revision: "c8573aa004774d292ee30bcd590d4337",
      },
      {
        url: "/_next/static/chunks/components_BookASession_index_js.js",
        revision: "a6f355c54fb756540bb2f55285753aaa",
      },
      {
        url: "/_next/static/chunks/node_modules_react-quill_lib_index_js.js",
        revision: "c6900d1b70045b058b43fd831c3bc465",
      },
      {
        url: "/_next/static/chunks/pages/404.js",
        revision: "acdb8e42e642bdcf4e2c94ece9b93bcd",
      },
      {
        url: "/_next/static/chunks/pages/_app.js",
        revision: "cd9078c66b612f89aeebc3d452729cbc",
      },
      {
        url: "/_next/static/chunks/pages/_error.js",
        revision: "655e0beb2cf532a786ca4d1470236920",
      },
      {
        url: "/_next/static/chunks/polyfills.js",
        revision: "837c0df77fd5009c9e46d446188ecfd0",
      },
      {
        url: "/_next/static/chunks/react-refresh.js",
        revision: "27ae59e69cda6c79795d811dedbd002a",
      },
      {
        url: "/_next/static/chunks/webpack.js",
        revision: "2b1093d60710b2057244e7a996569efd",
      },
      {
        url: "/_next/static/development/_buildManifest.js",
        revision: "8c8b0e89cfd509c83e58b3afa78c42f5",
      },
      {
        url: "/_next/static/development/_ssgManifest.js",
        revision: "abee47769bf307639ace4945f9cfd4ff",
      },
      {
        url: "/_next/static/media/KaTeX_AMS-Regular.1608a09b.woff",
        revision: "1608a09b",
      },
      {
        url: "/_next/static/media/KaTeX_AMS-Regular.4aafdb68.ttf",
        revision: "4aafdb68",
      },
      {
        url: "/_next/static/media/KaTeX_AMS-Regular.a79f1c31.woff2",
        revision: "a79f1c31",
      },
      {
        url: "/_next/static/media/KaTeX_Caligraphic-Bold.b6770918.woff",
        revision: "b6770918",
      },
      {
        url: "/_next/static/media/KaTeX_Caligraphic-Bold.cce5b8ec.ttf",
        revision: "cce5b8ec",
      },
      {
        url: "/_next/static/media/KaTeX_Caligraphic-Bold.ec17d132.woff2",
        revision: "ec17d132",
      },
      {
        url: "/_next/static/media/KaTeX_Caligraphic-Regular.07ef19e7.ttf",
        revision: "07ef19e7",
      },
      {
        url: "/_next/static/media/KaTeX_Caligraphic-Regular.55fac258.woff2",
        revision: "55fac258",
      },
      {
        url: "/_next/static/media/KaTeX_Caligraphic-Regular.dad44a7f.woff",
        revision: "dad44a7f",
      },
      {
        url: "/_next/static/media/KaTeX_Fraktur-Bold.9f256b85.woff",
        revision: "9f256b85",
      },
      {
        url: "/_next/static/media/KaTeX_Fraktur-Bold.b18f59e1.ttf",
        revision: "b18f59e1",
      },
      {
        url: "/_next/static/media/KaTeX_Fraktur-Bold.d42a5579.woff2",
        revision: "d42a5579",
      },
      {
        url: "/_next/static/media/KaTeX_Fraktur-Regular.7c187121.woff",
        revision: "7c187121",
      },
      {
        url: "/_next/static/media/KaTeX_Fraktur-Regular.d3c882a6.woff2",
        revision: "d3c882a6",
      },
      {
        url: "/_next/static/media/KaTeX_Fraktur-Regular.ed38e79f.ttf",
        revision: "ed38e79f",
      },
      {
        url: "/_next/static/media/KaTeX_Main-Bold.b74a1a8b.ttf",
        revision: "b74a1a8b",
      },
      {
        url: "/_next/static/media/KaTeX_Main-Bold.c3fb5ac2.woff2",
        revision: "c3fb5ac2",
      },
      {
        url: "/_next/static/media/KaTeX_Main-Bold.d181c465.woff",
        revision: "d181c465",
      },
      {
        url: "/_next/static/media/KaTeX_Main-BoldItalic.6f2bb1df.woff2",
        revision: "6f2bb1df",
      },
      {
        url: "/_next/static/media/KaTeX_Main-BoldItalic.70d8b0a5.ttf",
        revision: "70d8b0a5",
      },
      {
        url: "/_next/static/media/KaTeX_Main-BoldItalic.e3f82f9d.woff",
        revision: "e3f82f9d",
      },
      {
        url: "/_next/static/media/KaTeX_Main-Italic.47373d1e.ttf",
        revision: "47373d1e",
      },
      {
        url: "/_next/static/media/KaTeX_Main-Italic.8916142b.woff2",
        revision: "8916142b",
      },
      {
        url: "/_next/static/media/KaTeX_Main-Italic.9024d815.woff",
        revision: "9024d815",
      },
      {
        url: "/_next/static/media/KaTeX_Main-Regular.0462f03b.woff2",
        revision: "0462f03b",
      },
      {
        url: "/_next/static/media/KaTeX_Main-Regular.7f51fe03.woff",
        revision: "7f51fe03",
      },
      {
        url: "/_next/static/media/KaTeX_Main-Regular.b7f8fe9b.ttf",
        revision: "b7f8fe9b",
      },
      {
        url: "/_next/static/media/KaTeX_Math-BoldItalic.572d331f.woff2",
        revision: "572d331f",
      },
      {
        url: "/_next/static/media/KaTeX_Math-BoldItalic.a879cf83.ttf",
        revision: "a879cf83",
      },
      {
        url: "/_next/static/media/KaTeX_Math-BoldItalic.f1035d8d.woff",
        revision: "f1035d8d",
      },
      {
        url: "/_next/static/media/KaTeX_Math-Italic.5295ba48.woff",
        revision: "5295ba48",
      },
      {
        url: "/_next/static/media/KaTeX_Math-Italic.939bc644.ttf",
        revision: "939bc644",
      },
      {
        url: "/_next/static/media/KaTeX_Math-Italic.f28c23ac.woff2",
        revision: "f28c23ac",
      },
      {
        url: "/_next/static/media/KaTeX_SansSerif-Bold.8c5b5494.woff2",
        revision: "8c5b5494",
      },
      {
        url: "/_next/static/media/KaTeX_SansSerif-Bold.94e1e8dc.ttf",
        revision: "94e1e8dc",
      },
      {
        url: "/_next/static/media/KaTeX_SansSerif-Bold.bf59d231.woff",
        revision: "bf59d231",
      },
      {
        url: "/_next/static/media/KaTeX_SansSerif-Italic.3b1e59b3.woff2",
        revision: "3b1e59b3",
      },
      {
        url: "/_next/static/media/KaTeX_SansSerif-Italic.7c9bc82b.woff",
        revision: "7c9bc82b",
      },
      {
        url: "/_next/static/media/KaTeX_SansSerif-Italic.b4c20c84.ttf",
        revision: "b4c20c84",
      },
      {
        url: "/_next/static/media/KaTeX_SansSerif-Regular.74048478.woff",
        revision: "74048478",
      },
      {
        url: "/_next/static/media/KaTeX_SansSerif-Regular.ba21ed5f.woff2",
        revision: "ba21ed5f",
      },
      {
        url: "/_next/static/media/KaTeX_SansSerif-Regular.d4d7ba48.ttf",
        revision: "d4d7ba48",
      },
      {
        url: "/_next/static/media/KaTeX_Script-Regular.03e9641d.woff2",
        revision: "03e9641d",
      },
      {
        url: "/_next/static/media/KaTeX_Script-Regular.07505710.woff",
        revision: "07505710",
      },
      {
        url: "/_next/static/media/KaTeX_Script-Regular.fe9cbbe1.ttf",
        revision: "fe9cbbe1",
      },
      {
        url: "/_next/static/media/KaTeX_Size1-Regular.e1e279cb.woff",
        revision: "e1e279cb",
      },
      {
        url: "/_next/static/media/KaTeX_Size1-Regular.eae34984.woff2",
        revision: "eae34984",
      },
      {
        url: "/_next/static/media/KaTeX_Size1-Regular.fabc004a.ttf",
        revision: "fabc004a",
      },
      {
        url: "/_next/static/media/KaTeX_Size2-Regular.57727022.woff",
        revision: "57727022",
      },
      {
        url: "/_next/static/media/KaTeX_Size2-Regular.5916a24f.woff2",
        revision: "5916a24f",
      },
      {
        url: "/_next/static/media/KaTeX_Size2-Regular.d6b476ec.ttf",
        revision: "d6b476ec",
      },
      {
        url: "/_next/static/media/KaTeX_Size3-Regular.9acaf01c.woff",
        revision: "9acaf01c",
      },
      {
        url: "/_next/static/media/KaTeX_Size3-Regular.a144ef58.ttf",
        revision: "a144ef58",
      },
      {
        url: "/_next/static/media/KaTeX_Size3-Regular.b4230e7e.woff2",
        revision: "b4230e7e",
      },
      {
        url: "/_next/static/media/KaTeX_Size4-Regular.10d95fd3.woff2",
        revision: "10d95fd3",
      },
      {
        url: "/_next/static/media/KaTeX_Size4-Regular.7a996c9d.woff",
        revision: "7a996c9d",
      },
      {
        url: "/_next/static/media/KaTeX_Size4-Regular.fbccdabe.ttf",
        revision: "fbccdabe",
      },
      {
        url: "/_next/static/media/KaTeX_Typewriter-Regular.6258592b.woff",
        revision: "6258592b",
      },
      {
        url: "/_next/static/media/KaTeX_Typewriter-Regular.a8709e36.woff2",
        revision: "a8709e36",
      },
      {
        url: "/_next/static/media/KaTeX_Typewriter-Regular.d97aaf4a.ttf",
        revision: "d97aaf4a",
      },
      {
        url: "/_next/static/webpack/2d046b928fc7a58d.webpack.hot-update.json",
        revision: "development",
      },
      {
        url: "/_next/static/webpack/webpack.2d046b928fc7a58d.hot-update.js",
        revision: "development",
      },
    ],
    {
      ignoreURLParametersMatching: [/ts/],
    }
  );
  cleanupOutdatedCaches_mjs.cleanupOutdatedCaches();
  registerRoute_mjs.registerRoute(
    "/",
    new NetworkFirst_mjs.NetworkFirst({
      cacheName: "start-url",
      plugins: [
        {
          cacheWillUpdate: async ({ request, response, event, state }) => {
            if (response && response.type === "opaqueredirect") {
              return new Response(response.body, {
                status: 200,
                statusText: "OK",
                headers: response.headers,
              });
            }
            return response;
          },
        },
      ],
    }),
    "GET"
  );
  registerRoute_mjs.registerRoute(
    /.*/i,
    new NetworkOnly_mjs.NetworkOnly({
      cacheName: "dev",
      plugins: [],
    }),
    "GET"
  );
});
//# sourceMappingURL=sw.js.map
