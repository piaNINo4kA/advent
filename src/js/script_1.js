$(document).ready(function () {
  $(".burger").click(function () { 
    $(this).toggleClass("burger-active");
    $(this).find($('.burger__line')).toggleClass('active')
  });
});
