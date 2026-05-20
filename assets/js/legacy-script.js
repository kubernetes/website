//modal close button
(function(){
    //π.modalCloseButton = function(closingFunction){
    //	return π.button('pi-modal-close-button', null, null, closingFunction);
    //};
})();

// globals
var body;

function classOnCondition(element, className, condition) {
    if (condition)
        $(element).addClass(className);
    else
        $(element).removeClass(className);
}

function highestZ() {
    var Z = 1000;

    $("*").each(function(){
        var thisZ = $(this).css('z-index');

        if (thisZ != "auto" && thisZ > Z) Z = ++thisZ;
    });

    return Z;
}

function newDOMElement(tag, className, id){
    var el = document.createElement(tag);

    if (className) el.className = className;
    if (id) el.id = id;

    return el;
}

var kub = (function () {
    var html, header, quickstartButton, hero, encyclopedia, footer, headlineWrapper;

    $(document).ready(function () {
        html = $('html');
        body = $('body');
        header = $('header');
        quickstartButton = $('#quickstartButton');
        hero = $('#hero');
        encyclopedia = $('#encyclopedia');
        footer = $('footer');
        headlineWrapper = $('#headlineWrapper');

        resetTheView();
        setupMobileNavOffcanvasGuards();

        window.addEventListener('resize', resetTheView);
        window.addEventListener('scroll', resetTheView);

        document.onunload = function(){
            window.removeEventListener('resize', resetTheView);
            window.removeEventListener('scroll', resetTheView);
        };

        setInterval(setFooterType, 10);
    });

    function setupMobileNavOffcanvasGuards() {
        var bootstrapMdMinWidthQuery = '(min-width: 768px)';

        setupOffcanvasBreakpointGuard('k8s-mobile-main-nav', bootstrapMdMinWidthQuery);
    }

    function setupOffcanvasBreakpointGuard(offcanvasID, mediaQueryString) {
        var offcanvasElement = document.getElementById(offcanvasID);

        if (!offcanvasElement || !window.matchMedia) {
            return;
        }

        var breakpointQuery = window.matchMedia(mediaQueryString);

        function hideOffcanvas() {
            if (!breakpointQuery.matches || !window.bootstrap || !window.bootstrap.Offcanvas) {
                return;
            }

            var offcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasElement);

            if (offcanvas) {
                offcanvas.hide();
            }
        }

        hideOffcanvas();

        if (breakpointQuery.addEventListener) {
            breakpointQuery.addEventListener('change', hideOffcanvas);
        } else if (breakpointQuery.addListener) {
            breakpointQuery.addListener(hideOffcanvas);
        }
    }

    function setFooterType() {
        var windowHeight = window.innerHeight;
        var bodyHeight;

        switch (html[0].id) {
            case 'docs': {
                bodyHeight = hero.outerHeight() + encyclopedia.outerHeight();
                break;
            }

            case 'home':
            // case 'caseStudies':
                bodyHeight = windowHeight;
                break;
            case 'blog':
                bodyHeight = windowHeight;
            case 'caseStudies':
            case 'partners':
                bodyHeight = windowHeight * 2;
                break;

            default: {
                bodyHeight = hero.outerHeight() + $('#mainContent').outerHeight();
            }
        }

        var footerHeight = footer.outerHeight();
        classOnCondition(body, 'fixed', windowHeight - footerHeight > bodyHeight);
    }

    function resetTheView() {
        if (html.hasClass('open-toc')) {
            toggleToc();
        }

        if (html[0].id == 'home') {
            setHomeHeaderStyles();
        }
    }

    function setHomeHeaderStyles() {
        if (!quickstartButton[0]) {
            return;
        }
        var Y = window.pageYOffset;
        var quickstartBottom = quickstartButton[0].getBoundingClientRect().bottom;

        classOnCondition(html[0], 'y-enough', Y > quickstartBottom);
    }

    function showVideo() {
        $('body').css({overflow: 'hidden'});

        var videoPlayer = $("#videoPlayer");
        var videoIframe = videoPlayer.find("iframe")[0];
        videoIframe.src = videoIframe.getAttribute("data-url");
        videoPlayer.css({zIndex: highestZ()});
        videoPlayer.fadeIn(300);
        videoPlayer.click(function(){
            $('body').css({overflow: 'auto'});

            videoPlayer.fadeOut(300, function(){
                videoIframe.src = '';
            });
        });
    }

    function tocWasClicked(e) {
        var target = $(e.target);
        var docsToc = $("#docsToc");
        return (target[0] === docsToc[0] || target.parents("#docsToc").length > 0);
    }

    function listenForTocClick(e) {
        if (!tocWasClicked(e)) toggleToc();
    }

    function toggleToc() {
        html.toggleClass('open-toc');

        setTimeout(function () {
            if (html.hasClass('open-toc')) {
                window.addEventListener('click', listenForTocClick);
            } else {
                window.removeEventListener('click', listenForTocClick);
            }
        }, 100);
    }

    return {
        toggleToc: toggleToc,
        showVideo: showVideo
    };
})();


// accordion
(function(){
    var yah = true;
    var moving = false;
    var CSS_BROWSER_HACK_DELAY = 25;

    $(document).ready(function(){
        // Safari chokes on the animation here, so...
        if (navigator.userAgent.indexOf('Chrome') == -1 && navigator.userAgent.indexOf('Safari') != -1){
            var hackStyle = newDOMElement('style');
            hackStyle.innerHTML = '.pi-accordion .wrapper{transition: none}';
            body.append(hackStyle);
        }
        // Gross.

        $('.pi-accordion').each(function () {
            var accordion = this;
            var content = this.innerHTML;
            var container = newDOMElement('div', 'container');
            container.innerHTML = content;
            $(accordion).empty();
            accordion.appendChild(container);
            CollapseBox($(container));
        });

        setYAH();

        setTimeout(function () {
            yah = false;
        }, 500);
    });

    function CollapseBox(container){
        container.children('.item').each(function(){
            // build the TOC DOM
            // the animated open/close is enabled by having each item's content exist in the flow, at its natural height,
            // enclosed in a wrapper with height = 0 when closed, and height = contentHeight when open.
            var item = this;

            // only add content wrappers to containers, not to links
            var isContainer = item.tagName === 'DIV';

            var titleText = item.getAttribute('data-title');
            var title = newDOMElement('div', 'title');
            title.innerHTML = titleText;

            var wrapper, content;

            if (isContainer) {
                wrapper = newDOMElement('div', 'wrapper');
                content = newDOMElement('div', 'content');
                content.innerHTML = item.innerHTML;
                wrapper.appendChild(content);
            }

            item.innerHTML = '';
            item.appendChild(title);

            if (wrapper) {
                item.appendChild(wrapper);
                $(wrapper).css({height: 0});
            }


            $(title).click(function(){
                if (!yah) {
                    if (moving) return;
                    moving = true;
                }

                if (container[0].getAttribute('data-single')) {
                    var openSiblings = item.siblings().filter(function(sib){return sib.hasClass('on');});
                    openSiblings.forEach(function(sibling){
                        toggleItem(sibling);
                    });
                }

                setTimeout(function(){
                    if (!isContainer) {
                        moving = false;
                        return;
                    }
                    toggleItem(item);
                }, CSS_BROWSER_HACK_DELAY);
            });

            function toggleItem(thisItem){
                var thisWrapper = $(thisItem).find('.wrapper').eq(0);

                if (!thisWrapper) return;

                var contentHeight = thisWrapper.find('.content').eq(0).innerHeight() + 'px';

                if ($(thisItem).hasClass('on')) {
                    thisWrapper.css({height: contentHeight});
                    $(thisItem).removeClass('on');

                    setTimeout(function(){
                        thisWrapper.css({height: 0});
                        moving = false;
                    }, CSS_BROWSER_HACK_DELAY);
                } else {
                    $(item).addClass('on');
                    thisWrapper.css({height: contentHeight});

                    var duration = parseFloat(getComputedStyle(thisWrapper[0]).transitionDuration) * 1000;

                    setTimeout(function(){
                        thisWrapper.css({height: ''});
                        moving = false;
                    }, duration);
                }
            }

            if (content) {
                var innerContainers = $(content).children('.container');
                if (innerContainers.length > 0) {
                    innerContainers.each(function(){
                        CollapseBox($(this));
                    });
                }
            }
        });
    }

    function setYAH() {
        var pathname = location.href.split('#')[0]; // on page load, make sure the page is YAH even if there's a hash
        var currentLinks = [];

        $('.pi-accordion a').each(function () {
            if (pathname === this.href) currentLinks.push(this);
        });

        currentLinks.forEach(function (yahLink) {
            $(yahLink).parents('.item').each(function(){
                $(this).addClass('on');
                $(this).find('.wrapper').eq(0).css({height: 'auto'});
                $(this).find('.content').eq(0).css({opacity: 1});
            });

            $(yahLink).addClass('yah');
            yahLink.onclick = function(e){e.preventDefault();};
        });
    }
})();


$(function() {
    // If vendor strip doesn't exist add className
    if ( !$('#vendorStrip').length > 0 ) {
        $('.header-hero').addClass('bot-bar');
    }

    // If is not homepage add class to hero section
    if (!$('.td-home').length > 0 ) {
        $('.header-hero').addClass('no-sub');
    }
});
