"use strict";

$(document).ready(function () {
  $(".burger").click(function () {
    $(this).toggleClass("burger-active");
    $(this).find($('.burger__line')).toggleClass('active');
  });
  $('.balance__select').change(function () {
    var iconUrl = $(this).find(':selected').attr('data-icon');
    $(this).css('background', "url('".concat(iconUrl, "')"));
  });
  var bottomArrow = $('.control-bottom');
  bottomArrow.click(function () {
    $([document.documentElement, document.body]).animate({
      scrollTop: $("#adventure").offset().top
    }, 1000);
  });
});