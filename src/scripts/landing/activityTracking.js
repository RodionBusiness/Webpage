bs.activityTracking = (function (window, $) {
  var trackClass = 'js-track-activity';
  var eventAttributes = {
    id: 'hs-id'
  };
  var trackSelector = '.' + trackClass;

  function getEventObject ($el) {
    var data = {};

    Object.keys(eventAttributes).forEach(function (prop) {
      var value = $el.attr(eventAttributes[prop]);
      if (value) {
        data[prop] = value;
      }
    });

    return data;
  }

  function track (data) {
    if (!window._hsq) {
      console.warn('Hubspot tracking is not defined. The activity was not sent.');
      return;
    }

    window._hsq.push(['trackEvent', data]);
  }

  function eventHandler (event) {
    if (event.which != 3) {
      track(getEventObject($(event.target)));
    }
  }

  function init () {
    $('body').on('mousedown', trackSelector, eventHandler);
  }

  return {
    init: init,
    track: track
  };
})(window, $);
