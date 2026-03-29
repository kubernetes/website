$(document).ready(async function () {
  await switchLogoOnResize();
  flipNavColor()
  initMobileDrawer();

  window.addEventListener('resize', switchLogoOnResize);
  window.addEventListener('scroll', flipNavColor);
  window.addEventListener('resize', collapseDrawerOnDesktop);

  document.onunload = function () {
    window.removeEventListener('resize', switchLogoOnResize);
    window.removeEventListener('scroll', flipNavColor);
    window.removeEventListener('resize', collapseDrawerOnDesktop);
    $("#main_navbar").off('show.bs.collapse shown.bs.collapse hide.bs.collapse hidden.bs.collapse');
    $('body').removeClass('td-navbar-drawer-opening td-navbar-drawer-open td-navbar-drawer-closing');
  };
});

// By default, the longer logo with text is shown. If the screen is resized, a check is carried out to see
// which logo is presently shown. THe logo with the text has a group element with the id "its-pronounced",
// which is not present in the logo only SVG. This helps us prevent fetch calls for any resize event, ensuring
// that a logo is only fetched when the current logo is the wrong one.
async function switchLogoOnResize() {
  // No-op if the navbar logo is disabled via hugo params
  {{- if ne .ui.navbar_logo false }}
  const logoSpan = $("nav .navbar-brand__logo");
  const breakpointMd = getBreakpointMd();
  let svg

  if (window.innerWidth < breakpointMd) {
    if ($("nav .navbar-brand__logo svg g#its-pronounced").length !== 0) {
      const logo = await fetch("/images/kubernetes-icon-color.svg")
      if (!logo.ok) {
        throw new Error(`Response status: ${logo.status}`)
      }
      svg = await logo.text()
    }
  } else {
    if ($("nav .navbar-brand__logo svg g#its-pronounced").length === 0) {
      const logo = await fetch("/images/kubernetes-horizontal-white-text.svg")
      if (!logo.ok) {
        throw new Error(`Response status: ${logo.status}`)
      }
      svg = await logo.text()
    }
  }

  $(logoSpan).html(svg)
  {{ end -}}
}

function initMobileDrawer() {
  const drawer = $("#main_navbar");
  if (!drawer.length) {
    return;
  }

  drawer.on('show.bs.collapse', function (event) {
    if (event.target !== this) {
      return;
    }

    $('body')
      .removeClass('td-navbar-drawer-closing')
      .addClass('td-navbar-drawer-opening td-navbar-drawer-open');
  });

  drawer.on('shown.bs.collapse', function (event) {
    if (event.target !== this) {
      return;
    }

    $('body')
      .removeClass('td-navbar-drawer-opening td-navbar-drawer-closing')
      .addClass('td-navbar-drawer-open');
  });

  drawer.on('hide.bs.collapse', function (event) {
    if (event.target !== this) {
      return;
    }

    $('body')
      .removeClass('td-navbar-drawer-opening td-navbar-drawer-open')
      .addClass('td-navbar-drawer-closing');
  });

  drawer.on('hidden.bs.collapse', function (event) {
    if (event.target !== this) {
      return;
    }

    $('body').removeClass('td-navbar-drawer-opening td-navbar-drawer-open td-navbar-drawer-closing');
  });
}

function collapseDrawerOnDesktop() {
  const drawer = $("#main_navbar");
  if (!drawer.length) {
    return;
  }

  if (window.innerWidth >= getBreakpointMd() && drawer.hasClass('show')) {
    drawer.collapse('hide');
  }
}

function getBreakpointMd() {
  const breakpointMd = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--breakpoint-md').trim(), 10);
  return Number.isNaN(breakpointMd) ? 768 : breakpointMd;
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
