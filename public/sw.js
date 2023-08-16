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
    return registry[uri] || (
      
        new Promise(resolve => {
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
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-bfa558ca'], (function (workbox) { 'use strict';

  importScripts();
  self.skipWaiting();
  workbox.clientsClaim();

  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "/_next/build-manifest.json",
    "revision": "d322f246c2561a942e6b8fd8ea8b933b"
  }, {
    "url": "/_next/react-loadable-manifest.json",
    "revision": "9ea365a6ec4eeea810b14833f3088317"
  }, {
    "url": "/_next/server/middleware-build-manifest.js",
    "revision": "e9634c0218ea9b765cc1ff2bfab2e181"
  }, {
    "url": "/_next/server/middleware-react-loadable-manifest.js",
    "revision": "611bae50e8a84b98573ca46f21471261"
  }, {
    "url": "/_next/server/next-font-manifest.js",
    "revision": "e258694de19faacf02bc479ce0e448bb"
  }, {
    "url": "/_next/server/next-font-manifest.json",
    "revision": "c8573aa004774d292ee30bcd590d4337"
  }, {
    "url": "/_next/static/chunks/components_BookASession_index_js.js",
    "revision": "a6f355c54fb756540bb2f55285753aaa"
  }, {
    "url": "/_next/static/chunks/pages/404.js",
    "revision": "acdb8e42e642bdcf4e2c94ece9b93bcd"
  }, {
    "url": "/_next/static/chunks/pages/_app.js",
    "revision": "cd9078c66b612f89aeebc3d452729cbc"
  }, {
    "url": "/_next/static/chunks/pages/_error.js",
    "revision": "655e0beb2cf532a786ca4d1470236920"
  }, {
    "url": "/_next/static/chunks/pages/detect_ai.js",
    "revision": "15f24bc71622991970c0926908752e99"
  }, {
    "url": "/_next/static/chunks/polyfills.js",
    "revision": "837c0df77fd5009c9e46d446188ecfd0"
  }, {
    "url": "/_next/static/chunks/react-refresh.js",
    "revision": "27ae59e69cda6c79795d811dedbd002a"
  }, {
    "url": "/_next/static/chunks/webpack.js",
    "revision": "abca6285505a05c7e7deb4808a1c5333"
  }, {
    "url": "/_next/static/development/_buildManifest.js",
    "revision": "787408f50583016d5ad489e9ddecbff0"
  }, {
    "url": "/_next/static/development/_ssgManifest.js",
    "revision": "abee47769bf307639ace4945f9cfd4ff"
  }, {
    "url": "/_next/static/webpack/54f15b37a76a6c31.webpack.hot-update.json",
    "revision": "development"
  }, {
    "url": "/_next/static/webpack/webpack.54f15b37a76a6c31.hot-update.js",
    "revision": "development"
  }], {
    "ignoreURLParametersMatching": [/ts/]
  });
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute("/", new workbox.NetworkFirst({
    "cacheName": "start-url",
    plugins: [{
      cacheWillUpdate: async ({
        request,
        response,
        event,
        state
      }) => {
        if (response && response.type === 'opaqueredirect') {
          return new Response(response.body, {
            status: 200,
            statusText: 'OK',
            headers: response.headers
          });
        }
        return response;
      }
    }]
  }), 'GET');
  workbox.registerRoute(/.*/i, new workbox.NetworkOnly({
    "cacheName": "dev",
    plugins: []
  }), 'GET');

}));
//# sourceMappingURL=sw.js.map
