$(document).ready(function () {
  switchLogoOnScroll();
  flipNavColor()

  window.addEventListener('resize', switchLogoOnScroll);
  window.addEventListener('scroll', switchLogoOnScroll);
  window.addEventListener('scroll', flipNavColor);

  document.onunload = function(){
    window.removeEventListener('resize', switchLogoOnScroll);
    window.removeEventListener('scroll', switchLogoOnScroll);
    window.removeEventListener('scroll', flipNavColor);
  };
});

function switchLogoOnScroll() {
  // No-op if the navbar logo is disabled via hugo params
  {{- if ne .ui.navbar_logo false }}
  const logoSpan = $(".navbar-brand__logo");
  const breakpointMd = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--breakpoint-md').trim());
  let svg;

  if (window.innerWidth < breakpointMd) {
    {{ with resources.Get "/images/kubernetes-icon-color.svg" -}}
    svg = '{{ ( . | minify).Content | safeHTML -}}';
    {{ end -}}
  } else {
    if (window.scrollY > 0) {
      {{ with resources.Get "/images/kubernetes-horizontal-all-blue-color.svg" -}}
      svg = '{{ ( . | minify).Content | safeHTML -}}';
      {{ end -}}
    } else {
      {{ with resources.Get "/images/kubernetes-horizontal-white-text.svg" -}}
      svg = '{{ ( . | minify).Content | safeHTML -}}';
      {{ end -}}
    }
  }

  $(logoSpan).html(svg)
  {{ end -}}
}

// Copied over from Docsy's assets/js/base.js
function flipNavColor() {
  const threshold = Math.ceil($('.js-navbar-scroll').outerHeight());
  const promoOffset = threshold;
  const navbarOffset = $('.js-navbar-scroll').offset().top;

  if ((promoOffset - navbarOffset) < threshold) {
    $('.js-navbar-scroll').addClass('navbar-bg-onscroll');
  } else {
    $('.js-navbar-scroll').removeClass('navbar-bg-onscroll');
    $('.js-navbar-scroll').addClass('navbar-bg-onscroll--fade');
  }
}
