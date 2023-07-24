function initFacebookSDK() {
  return new Promise((resolve) => {
    window.fbAsyncInit = function () {
      console.log(process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID);
      FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID,
        xfbml: true,
        version: "v13.0",
      });
      resolve();
    };

    // Load the Facebook SDK asynchronously
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  });
}

export default initFacebookSDK;
