jQuery(function($) {
  // tocItems are headings in the main content area that have a representation in the TOC
  // (not all headings are present in the TOC).
  let tocItems = $('#page-content-wrapper .toc-item');

  function getCurrentlyVisibleSection(scrollPosition) {
    // Walk the list from the bottom up and check;
    // each TOC item is the immediate child of a <div> that
    // carries the TOC item's ID.
    for (let i = tocItems.length - 1; i >= 0; --i) {
      let item = $(tocItems.get(i));
      let offsetTop = item.offset().top - 50;

      if (scrollPosition >= offsetTop) {
        return item.parent().attr('id');
      }
    }

    return null;
  }

  function updateNavigationState(visibleSection) {
    let selectedLink = $('#navigation a.selected');
    let selectedSection = selectedLink.length === 0 ? null : selectedLink.attr('href').replace(/#/, '');

    // nothing to do :)
    if (visibleSection === selectedSection) {
      return;
    }

    // un-select whatever was previously selected
    if (selectedLink.length > 0) {
      selectedLink.removeClass('selected');
    }

    if (visibleSection !== null) {
      // show the leaf node in the navigation for the activeSection, plus
      // all nodes that lead to it (in a->b->c->d, if c is active, show
      // b and c because a is always shown already).
      let activeSectionLink = '#' + visibleSection;
      let link = $('#navigation a[href="' + activeSectionLink + '"]');
      let listItem = link.parent();

      link.addClass('selected');

      while (listItem.data('level') > 1) {
        let ul = listItem.parent();
        ul.show('fast');
        listItem = ul.parent();
      }

      // expand the currently selected item, i.e. do not just show the
      // parent path, but also the immediate child <ul>
      link.parent().children('ul').show('fast');
    }

    // collapse all sub tree that are not required to show the currently
    // selected section (i.e. has no .selected in its children, is not
    // the direct descendant of the currently selected item (which we
    // just expanded) and is not the top level).
    $('#navigation ul:visible').each(function() {
      let list = $(this);
      if (list.find('.selected').length > 0) {
        return;
      }

      let listItem = list.parent();
      if (listItem.data('level') <= 1) {
        return;
      }

      let link = listItem.children('a');
      if (link.hasClass('selected')) {
        return;
      }

      list.hide('fast');
    });
  }

  let navScrollTimeout;
  function scrollToNav(currentSection) {
    // debounce to prevent too many scrolls in the sidebar
    if (navScrollTimeout) {
      clearTimeout(navScrollTimeout);
    }

    navScrollTimeout = setTimeout(function() {
      let navNode = $('#navigation a[href="#' + currentSection + '"]');
      $('#sidebar-wrapper').scrollTo(navNode, {duration: 'fast', axis: 'y', over: {top: -1}});
    }, 200);
  }

  function repaint() {
    let scrollPosition = $(window).scrollTop();
    let currentSection = getCurrentlyVisibleSection(scrollPosition);
    updateNavigationState(currentSection);
    scrollToNav(currentSection);
  }

  // update navigation whenever scrolling happens
  $(window).on('scroll', repaint);

  // perform an initial update on the navigation
  repaint();
});

/* handle dark/light mode */
jQuery(function($) {
  let button = $('.switch-theme');
  button.show();

  button.on('click', function() {
    $('body').toggleClass('theme-dark');
  });

  // enable dark mode if desired by the user agent
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    $('body').toggleClass('theme-dark');
  }

  $('body').toggleClass('theme-auto');
});
