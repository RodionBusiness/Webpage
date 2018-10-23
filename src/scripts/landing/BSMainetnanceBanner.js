$(function () {
  var PING_TIMEOUT = 1000 * 10; // seconds between ping requests
  var DISMISS_TIME_MS = 1000 * 60 * 5;
  var STORE_KEY_DISMISSED = 'BSMainetnanceBanner.dismissed';
  var STORE_KEY_SHOWN = 'BSMainetnanceBanner.shown';

  function BSMainetnanceBanner (host) {
    var _host = host || '/';

    this.url = '' + _host + 'health';

    this.getBanner()
      .hide()
      .removeClass('hidden')
      .find('.maintenance-banner-dismiss').click(this.dismiss.bind(this));

    if (this.isShowed()) {
      this.show();
    }
  }

  BSMainetnanceBanner.init = function init (host) {
    var mb = new BSMainetnanceBanner(host);
    mb.loop();
  };

  BSMainetnanceBanner.prototype.isShowed = function () {
    return Boolean(window.sessionStorage.getItem(STORE_KEY_SHOWN));
  };

  BSMainetnanceBanner.prototype.getBanner = function getBanner () {
    return $('.maintenance-banner');
  };

  BSMainetnanceBanner.prototype.loop = function loop () {
    var self = this;

    self.ping()
      .then(function () {
        if (self.isShowed()) {
          self.hide();
        }
      })
      .catch(function () {
        if (!self.isShowed() && !self.dismissed()) {
          self.show();
        }
      })
      .then(
        setTimeout(
          self.loop.bind(self, null),
          PING_TIMEOUT
        )
      );
  };

  BSMainetnanceBanner.prototype.dismissed = function dismissed () {
    var dismissDate = window.sessionStorage.getItem(STORE_KEY_DISMISSED);

    if (!dismissDate) {
      return false;
    }

    try {
      var date = new Date(dismissDate);
      return (Date.now() - date.getTime()) < DISMISS_TIME_MS;
    } catch (e) {
      return false;
    }
  };

  BSMainetnanceBanner.prototype.ping = function ping () {
    var self = this;

    return new Promise(function (resolve, reject) {
      $.ajax({
        url: self.url,
        timeout: PING_TIMEOUT - 20,
        error: function onError (xmlHttpRequest, textStatus, errorThrown) {
          if (xmlHttpRequest.readyState === 0) {
            resolve({
              app_status: 'network_unavailable',
              services_count: -1
            });
          } else {
            reject(xmlHttpRequest);
          }
        },
        success: function success (data) {
          switch (data.app_status) {
            case 'ready': resolve(data); break;
            default: reject(data); break;
          }
        }
      });
    });
  };

  BSMainetnanceBanner.prototype.hide = function hide () {
    window.sessionStorage.removeItem(STORE_KEY_SHOWN);
    this.getBanner().slideUp();
  };

  BSMainetnanceBanner.prototype.show = function open () {
    if (!this.dismissed()) {
      window.sessionStorage.setItem(STORE_KEY_SHOWN, true);
      this.getBanner().slideDown();
    }
  };

  BSMainetnanceBanner.prototype.dismiss = function dismiss () {
    window.sessionStorage.setItem(STORE_KEY_DISMISSED, (new Date()).toISOString());
    this.hide();
  };

  (window.bs ? window.bs : (window.bs = {})).BSMainetnanceBanner = BSMainetnanceBanner;
});
