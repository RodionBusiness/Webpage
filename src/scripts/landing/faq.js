$(function () {
  /* faq page navigation */

  var faqsCategoriesContainer = $('.faq-categories');
  var faqsCategories = faqsCategoriesContainer.find('a');

  // select a faq section
  faqsCategories.on('click', function (event) {
    event.preventDefault();
    var selectedItem = $(this);
    var selectedHref = $(this).attr('href');
    var prevActiveCategory = $('.faq-item.active');
    var activeCategory = $('#' + selectedHref);

    faqsCategories.removeClass('selected');
    selectedItem.addClass('selected');
    prevActiveCategory.removeClass('active');
    activeCategory.addClass('active');
  });
});
