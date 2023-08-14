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
    "revision": "54ec412eea634498bd9906c8f56aeebc"
  }, {
    "url": "/_next/react-loadable-manifest.json",
    "revision": "7c87e8c74f7889a4cb4f5715952e9adf"
  }, {
    "url": "/_next/server/middleware-build-manifest.js",
    "revision": "e6eca957a8399edbfa97799171db1130"
  }, {
    "url": "/_next/server/middleware-react-loadable-manifest.js",
    "revision": "c542cbeea08622f2092a19c202da7834"
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
    "url": "/_next/static/chunks/components_Footer_index_js.js",
    "revision": "3fa3f6f4cc0405cff6ee9e8e3e4f871f"
  }, {
    "url": "/_next/static/chunks/pages/_app.js",
    "revision": "cd9078c66b612f89aeebc3d452729cbc"
  }, {
    "url": "/_next/static/chunks/pages/_error.js",
    "revision": "655e0beb2cf532a786ca4d1470236920"
  }, {
    "url": "/_next/static/chunks/pages/boring/privacy-policy.js",
    "revision": "24dc7711b9f8ca19def59c389d0ba3ea"
  }, {
    "url": "/_next/static/chunks/polyfills.js",
    "revision": "837c0df77fd5009c9e46d446188ecfd0"
  }, {
    "url": "/_next/static/chunks/react-refresh.js",
    "revision": "27ae59e69cda6c79795d811dedbd002a"
  }, {
    "url": "/_next/static/chunks/webpack.js",
    "revision": "891bbf6c64561d1febdc6e6bcb237916"
  }, {
    "url": "/_next/static/development/_buildManifest.js",
    "revision": "b533666ab364bbe5a3995cc872e629b3"
  }, {
    "url": "/_next/static/development/_ssgManifest.js",
    "revision": "abee47769bf307639ace4945f9cfd4ff"
  }, {
    "url": "/_next/static/webpack/e136e64649559d02.webpack.hot-update.json",
    "revision": "development"
  }, {
    "url": "/_next/static/webpack/pages/boring/privacy-policy.e136e64649559d02.hot-update.js",
    "revision": "development"
  }, {
    "url": "/_next/static/webpack/webpack.e136e64649559d02.hot-update.js",
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
