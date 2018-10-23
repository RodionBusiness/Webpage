// TODO: Replace .fixed_text with flexbox layout
$(function () {
  var equalHeight = function () {
    var height = 0;
    $('.fixed_text').each(function () {
      if ($(this).height() > height) {
        height = $(this).height();
      }
    });
    $('.fixed_text').each(function () {
      $(this).height(height);
    });
  };

  if ($('.fixed_text').length > 0) {
    equalHeight();
  }

  /* resize */
  $(window).resize(function () {
    if ($('.fixed_text').length > 0) {
      equalHeight();
    }
  });
});
