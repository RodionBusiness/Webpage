// Landing as App entrypoint
window.bs = window.bs || {};

require('./landing/topnav');
require('./landing/activityTracking');
require('./landing/faq');
require('./landing/equalHeight');
require('./landing/photoswipe');
require('./landing/refreshMarketData');
require('./landing/BSMainetnanceBanner');

/**
 * Landing initialization
 */
$(function () {
  window.bs.activityTracking.init();
  window.bs.BSMainetnanceBanner.init();

  /**
   * Docs and demo:
   * https://www.jqueryscript.net/demo/Simple-Cookie-Disclaimer-Bar-Modal-Plugin-with-jQuery-Cookie-Disclaimer/
   */
  // $('body').cookieDisclaimer({
  //   style: 'dark',
  //   text: 'Try this demo cookie disclaimer bar'
  //   // policyBtn: {
  //   //   active: true,
  //   //   text: 'Cookie Policy',
  //   //   link: 'demo-policy-example.html'
  //   // }
  // });
});
