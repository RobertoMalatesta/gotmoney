'use strict';

//GOOGLE
var Google = {auth2: null}; // The Sign-In object.
function onLoadGoogleClient() {
  'use strict';
  gapi.load('auth2', function() {
    Google.auth2 = gapi.auth2.init();
  });
}

//GOOGLE ANALYTICS
(function(i, s, o, g, r, a, m) {
  'use strict';
  i['GoogleAnalyticsObject'] = r;
  i[r] = i[r] || function() {
    (i[r].q = i[r].q || []).push(arguments);
  }, i[r].l = 1 * new Date();
  a = s.createElement(o), m = s.getElementsByTagName(o)[0];
  a.async = 1;
  a.src = g;
  m.parentNode.insertBefore(a, m);
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
ga('create', 'UA-11465363-7', 'auto');
ga('send', 'pageview');


//Facebook SDK
window.fbAsyncInit = function() {
  'use strict';
  FB.init({
    //appId: '182002078627839', //PRD
    appId: '542787052549338', //DEV
    xfbml: true,
    version: 'v2.9'
  });
};
