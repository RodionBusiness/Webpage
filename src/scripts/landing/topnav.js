$(function () {
  $('nav.left-nav .top-level>li').hover(
    function () {
      $(this).find('.sub-nav').addClass('active');
    }, function () {
      $(this).find('.sub-nav').find('li').removeClass('active');
      $(this).find('.sub-nav').removeClass('active');
      $(this).find('.description_wrap').removeClass('go');
      $('.description').removeClass('active');
    }
  );

  var descriptionLink;

  $('nav.left-nav .sub-nav li a[data-control]').hover(function () {
    $(this).parent('li').siblings('li').removeClass('active');
    $(this).parent('li').addClass('active');
    $('#' + descriptionLink + '').removeClass('active');
    descriptionLink = $(this).attr('data-control');
    $('#' + descriptionLink + '').addClass('active').parents('.description_wrap').addClass('go');
    $('#' + descriptionLink + '').addClass('active');
  });
});
