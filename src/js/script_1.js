window.onload = () => {
  console.log(123);
  let preloader = $('.preloader');
  let body = $('body');

  setTimeout(() => {
    preloader.fadeOut();
    body.css('overflow-y', 'auto')
  }, 1000);
}
$(document).ready(function () {
  $(".burger").click(function () { 
    $(this).toggleClass("burger-active");
    $(this).find($('.burger__line')).toggleClass('active')
  });
  $('.balance__select').change(function () { 
    const iconUrl = $(this).find(':selected').attr('data-icon'); 
    $(this).css('background', `url('${iconUrl}')`); 
  });
  let bottomArrow = $('.control-bottom')

  bottomArrow.click(function() {
    $([document.documentElement, document.body]).animate({
        scrollTop: $("#adventure").offset().top
    }, 1000);
  })

});
