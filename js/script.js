 //modal close button
(function(){
	//π.modalCloseButton = function(closingFunction){
	//	return π.button('pi-modal-close-button', null, null, closingFunction);
	//};
})();

// globals
var body;

//helper functions
function booleanAttributeValue(element, attribute, defaultValue){
	// returns true if an attribute is present with no value
	// e.g. booleanAttributeValue(element, 'data-modal', false);
	if (element.hasAttribute(attribute)) {
		var value = element.getAttribute(attribute);
		if (value === '' || value === 'true') {
			return true;
		} else if (value === 'false') {
			return false;
		}
	}

	return defaultValue;
}

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

function px(n){
	return n + 'px';
}

var kub = (function () {
	var HEADER_HEIGHT;
	var html, header, mainNav, quickstartButton, hero, encyclopedia, footer, wishField, headlineWrapper;

	$(document).ready(function () {
		html = $('html');
		body = $('body');
		header = $('header');
		mainNav = $('#mainNav');
		wishField = $('#wishField');
		quickstartButton = $('#quickstartButton');
		hero = $('#hero');
		encyclopedia = $('#encyclopedia');
		footer = $('footer');
		headlineWrapper = $('#headlineWrapper');
		HEADER_HEIGHT = header.outerHeight();

		resetTheView();

		window.addEventListener('resize', resetTheView);
		window.addEventListener('scroll', resetTheView);
		window.addEventListener('keydown', handleKeystrokes);
		wishField[0].addEventListener('keydown', handleKeystrokes);

		document.onunload = function(){
			window.removeEventListener('resize', resetTheView);
			window.removeEventListener('scroll', resetTheView);
			window.removeEventListener('keydown', handleKeystrokes);
			wishField[0].removeEventListener('keydown', handleKeystrokes);
		};

		setInterval(setFooterType, 10);

		initAnchorScrolling();
	});

	var anchorTopMargin = 90;
	
	function initAnchorScrolling() {
		anchorTopMargin = HEADER_HEIGHT + 10;
		
		console.log("anchorTopMargin", anchorTopMargin);
		
		$('a[href*="#"]').each(function() {
			if (this.href.indexOf("!") != -1) return;
				
			var url = $(this).attr('href').replace(/\/$/, "");
			var name = (url.indexOf("#") !== -1) ? url.substring(url.indexOf("#")+1): url.match(/([^\/]*)\/*$/)[1];
			
			if (name.indexOf("/") != -1) return;
			
			if(typeof($("a[name='"+name+"']").offset()) !== "undefined" || $('#'+name).length) {
				$(this).click(function(e) {
					e.preventDefault();
					scrollToAnchor(name);
				});
			}
		});
	}
	
	function scrollToAnchor(name) {
		var elem = (!$('#'+name).length) ? $("a[name='"+ name +"']"): $('#'+name);
		if(typeof(elem.offset()) !== "undefined") {
			var theTop = elem.offset().top - anchorTopMargin;
			$('html, body').stop().animate({ scrollTop:theTop }, 250, 'easeOutCubic', function() {
				window.location.hash = name;
			});
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
				bodyHeight = windowHeight;
				break;

			default: {
				bodyHeight = hero.outerHeight() + $('#mainContent').outerHeight();
			}
		}

		var footerHeight = footer.outerHeight();
		classOnCondition(body, 'fixed', windowHeight - footerHeight > bodyHeight);
	}

	function resetTheView() {
		if (html.hasClass('open-nav')) {
			toggleMenu();
		} else {
			HEADER_HEIGHT = header.outerHeight();
		}

		if (html.hasClass('open-toc')) {
			toggleToc();
		}

		classOnCondition(html, 'flip-nav', window.pageYOffset > 0);

		if (html[0].id == 'home') {
			setHomeHeaderStyles();
		}
	}

	function setHomeHeaderStyles() {
		var Y = window.pageYOffset;
		var quickstartBottom = quickstartButton[0].getBoundingClientRect().bottom;

		classOnCondition(html[0], 'y-enough', Y > quickstartBottom);
	}

	function toggleMenu() {
		if (window.innerWidth < 800) {
			pushmenu.show('primary');
		}

		else {
			var newHeight = HEADER_HEIGHT;

			if (!html.hasClass('open-nav')) {
				newHeight = mainNav.outerHeight();
			}

			header.css({height: px(newHeight)});
			html.toggleClass('open-nav');
		}
	}

	function submitWish(textfield) {
		window.location.replace("https://github.com/kubernetes/kubernetes.github.io/issues/new?title=I%20wish%20" +
			window.location.pathname + "%20" + textfield.value + "&body=I%20wish%20" +
			window.location.pathname + "%20" + textfield.value);

		textfield.value = '';
		textfield.blur();
	}

	function handleKeystrokes(e) {
		switch (e.which) {
			case 13: {
				if (e.currentTarget === wishField[0]) {
					submitWish(wishField[0]);
				}
				break;
			}

			case 27: {
				if (html.hasClass('open-nav')) {
					toggleMenu();
				}
				break;
			}
		}
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
		toggleMenu: toggleMenu,
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


var pushmenu = (function(){
	var allPushMenus = {};

	$(document).ready(function(){
		$('[data-auto-burger]').each(function(){
			var container = this;
			var id = container.getAttribute('data-auto-burger');

			var autoBurger = document.getElementById(id) || newDOMElement('div', 'pi-pushmenu', id);
			var ul = autoBurger.querySelector('ul') || newDOMElement('ul');

			$(container).find('a[href], button').each(function () {
				if (!booleanAttributeValue(this, 'data-auto-burger-exclude', false)) {
					var clone = this.cloneNode(true);
					clone.id = '';

					if (clone.tagName == "BUTTON") {
						var aTag = newDOMElement('a');
						aTag.href = '';
						aTag.innerHTML = clone.innerHTML;
						aTag.onclick = clone.onclick;
						clone = aTag;
					}
					var li = newDOMElement('li');
					li.appendChild(clone);
					ul.appendChild(li);
				}
			});

			autoBurger.appendChild(ul);
			body.append(autoBurger);
		});

		$(".pi-pushmenu").each(function(){
			allPushMenus[this.id] = PushMenu(this);
		});
	});

	function show(objId) {
		allPushMenus[objId].expose();
	}

	function PushMenu(el) {
		var html = document.querySelector('html');

		var overlay = newDOMElement('div', 'overlay');
		var content = newDOMElement('div', 'content');
		content.appendChild(el.querySelector('*'));

		var side = el.getAttribute("data-side") || "right";

		var sled = newDOMElement('div', 'sled');
		$(sled).css(side, 0);

		sled.appendChild(content);

		var closeButton = newDOMElement('button', 'push-menu-close-button');
		closeButton.onclick = closeMe;

		sled.appendChild(closeButton);

		overlay.appendChild(sled);
		el.innerHTML = '';
		el.appendChild(overlay);

		sled.onclick = function(e){
			e.stopPropagation();
		};

		overlay.onclick = closeMe;

		window.addEventListener('resize', closeMe);

		function closeMe(e) {
			if (e.target == sled) return;

			$(el).removeClass('on');
			setTimeout(function(){
				$(el).css({display: 'none'});

				$(body).removeClass('overlay-on');
			}, 300);
		}

		function exposeMe(){
			$(body).addClass('overlay-on'); // in the default config, kills body scrolling

			$(el).css({
				display: 'block',
				zIndex: highestZ()
			});

			setTimeout(function(){
				$(el).addClass('on');
			}, 10);
		}

		return {
			expose: exposeMe
		};
	}

	return {
		show: show
	};
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIs+ALWJhc2VDb21wb25lbnRzLmpzIiwic2NyaXB0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJzY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgLy9tb2RhbCBjbG9zZSBidXR0b25cbihmdW5jdGlvbigpe1xuXHQvL8+ALm1vZGFsQ2xvc2VCdXR0b24gPSBmdW5jdGlvbihjbG9zaW5nRnVuY3Rpb24pe1xuXHQvL1x0cmV0dXJuIM+ALmJ1dHRvbigncGktbW9kYWwtY2xvc2UtYnV0dG9uJywgbnVsbCwgbnVsbCwgY2xvc2luZ0Z1bmN0aW9uKTtcblx0Ly99O1xufSkoKTtcbiIsIi8vIGdsb2JhbHNcbnZhciBib2R5O1xuXG4vL2hlbHBlciBmdW5jdGlvbnNcbmZ1bmN0aW9uIGJvb2xlYW5BdHRyaWJ1dGVWYWx1ZShlbGVtZW50LCBhdHRyaWJ1dGUsIGRlZmF1bHRWYWx1ZSl7XG5cdC8vIHJldHVybnMgdHJ1ZSBpZiBhbiBhdHRyaWJ1dGUgaXMgcHJlc2VudCB3aXRoIG5vIHZhbHVlXG5cdC8vIGUuZy4gYm9vbGVhbkF0dHJpYnV0ZVZhbHVlKGVsZW1lbnQsICdkYXRhLW1vZGFsJywgZmFsc2UpO1xuXHRpZiAoZWxlbWVudC5oYXNBdHRyaWJ1dGUoYXR0cmlidXRlKSkge1xuXHRcdHZhciB2YWx1ZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZSk7XG5cdFx0aWYgKHZhbHVlID09PSAnJyB8fCB2YWx1ZSA9PT0gJ3RydWUnKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9IGVsc2UgaWYgKHZhbHVlID09PSAnZmFsc2UnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGRlZmF1bHRWYWx1ZTtcbn1cblxuZnVuY3Rpb24gY2xhc3NPbkNvbmRpdGlvbihlbGVtZW50LCBjbGFzc05hbWUsIGNvbmRpdGlvbikge1xuXHRpZiAoY29uZGl0aW9uKVxuXHRcdCQoZWxlbWVudCkuYWRkQ2xhc3MoY2xhc3NOYW1lKTtcblx0ZWxzZVxuXHRcdCQoZWxlbWVudCkucmVtb3ZlQ2xhc3MoY2xhc3NOYW1lKTtcbn1cblxuZnVuY3Rpb24gaGlnaGVzdFooKSB7XG5cdHZhciBaID0gMTAwMDtcblxuXHQkKFwiKlwiKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0dmFyIHRoaXNaID0gJCh0aGlzKS5jc3MoJ3otaW5kZXgnKTtcblxuXHRcdGlmICh0aGlzWiAhPSBcImF1dG9cIiAmJiB0aGlzWiA+IFopIFogPSArK3RoaXNaO1xuXHR9KTtcblxuXHRyZXR1cm4gWjtcbn1cblxuZnVuY3Rpb24gbmV3RE9NRWxlbWVudCh0YWcsIGNsYXNzTmFtZSwgaWQpe1xuXHR2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG5cblx0aWYgKGNsYXNzTmFtZSkgZWwuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuXHRpZiAoaWQpIGVsLmlkID0gaWQ7XG5cblx0cmV0dXJuIGVsO1xufVxuXG5mdW5jdGlvbiBweChuKXtcblx0cmV0dXJuIG4gKyAncHgnO1xufVxuXG52YXIga3ViID0gKGZ1bmN0aW9uICgpIHtcblx0dmFyIEhFQURFUl9IRUlHSFQ7XG5cdHZhciBodG1sLCBoZWFkZXIsIG1haW5OYXYsIHF1aWNrc3RhcnRCdXR0b24sIGhlcm8sIGVuY3ljbG9wZWRpYSwgZm9vdGVyLCB3aXNoRmllbGQsIGhlYWRsaW5lV3JhcHBlcjtcblxuXHQkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG5cdFx0aHRtbCA9ICQoJ2h0bWwnKTtcblx0XHRib2R5ID0gJCgnYm9keScpO1xuXHRcdGhlYWRlciA9ICQoJ2hlYWRlcicpO1xuXHRcdG1haW5OYXYgPSAkKCcjbWFpbk5hdicpO1xuXHRcdHdpc2hGaWVsZCA9ICQoJyN3aXNoRmllbGQnKTtcblx0XHRxdWlja3N0YXJ0QnV0dG9uID0gJCgnI3F1aWNrc3RhcnRCdXR0b24nKTtcblx0XHRoZXJvID0gJCgnI2hlcm8nKTtcblx0XHRlbmN5Y2xvcGVkaWEgPSAkKCcjZW5jeWNsb3BlZGlhJyk7XG5cdFx0Zm9vdGVyID0gJCgnZm9vdGVyJyk7XG5cdFx0aGVhZGxpbmVXcmFwcGVyID0gJCgnI2hlYWRsaW5lV3JhcHBlcicpO1xuXHRcdEhFQURFUl9IRUlHSFQgPSBoZWFkZXIub3V0ZXJIZWlnaHQoKTtcblxuXHRcdHJlc2V0VGhlVmlldygpO1xuXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2V0VGhlVmlldyk7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHJlc2V0VGhlVmlldyk7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlzdHJva2VzKTtcblx0XHR3aXNoRmllbGRbMF0uYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleXN0cm9rZXMpO1xuXG5cdFx0ZG9jdW1lbnQub251bmxvYWQgPSBmdW5jdGlvbigpe1xuXHRcdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2V0VGhlVmlldyk7XG5cdFx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgcmVzZXRUaGVWaWV3KTtcblx0XHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5c3Ryb2tlcyk7XG5cdFx0XHR3aXNoRmllbGRbMF0ucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleXN0cm9rZXMpO1xuXHRcdH07XG5cblx0XHRzZXRJbnRlcnZhbChzZXRGb290ZXJUeXBlLCAxMCk7XG5cblx0XHRpbml0QW5jaG9yU2Nyb2xsaW5nKCk7XG5cdH0pO1xuXG5cdHZhciBhbmNob3JUb3BNYXJnaW4gPSA5MDtcblx0XG5cdGZ1bmN0aW9uIGluaXRBbmNob3JTY3JvbGxpbmcoKSB7XG5cdFx0YW5jaG9yVG9wTWFyZ2luID0gSEVBREVSX0hFSUdIVCArIDEwO1xuXHRcdFxuXHRcdGNvbnNvbGUubG9nKFwiYW5jaG9yVG9wTWFyZ2luXCIsIGFuY2hvclRvcE1hcmdpbik7XG5cdFx0XG5cdFx0JCgnYVtocmVmKj1cIiNcIl0nKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKHRoaXMuaHJlZi5pbmRleE9mKFwiIVwiKSAhPSAtMSkgcmV0dXJuO1xuXHRcdFx0XHRcblx0XHRcdHZhciB1cmwgPSAkKHRoaXMpLmF0dHIoJ2hyZWYnKS5yZXBsYWNlKC9cXC8kLywgXCJcIik7XG5cdFx0XHR2YXIgbmFtZSA9ICh1cmwuaW5kZXhPZihcIiNcIikgIT09IC0xKSA/IHVybC5zdWJzdHJpbmcodXJsLmluZGV4T2YoXCIjXCIpKzEpOiB1cmwubWF0Y2goLyhbXlxcL10qKVxcLyokLylbMV07XG5cdFx0XHRcblx0XHRcdGlmIChuYW1lLmluZGV4T2YoXCIvXCIpICE9IC0xKSByZXR1cm47XG5cdFx0XHRcblx0XHRcdGlmKHR5cGVvZigkKFwiYVtuYW1lPSdcIituYW1lK1wiJ11cIikub2Zmc2V0KCkpICE9PSBcInVuZGVmaW5lZFwiIHx8ICQoJyMnK25hbWUpLmxlbmd0aCkge1xuXHRcdFx0XHQkKHRoaXMpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0c2Nyb2xsVG9BbmNob3IobmFtZSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBzY3JvbGxUb0FuY2hvcihuYW1lKSB7XG5cdFx0dmFyIGVsZW0gPSAoISQoJyMnK25hbWUpLmxlbmd0aCkgPyAkKFwiYVtuYW1lPSdcIisgbmFtZSArXCInXVwiKTogJCgnIycrbmFtZSk7XG5cdFx0aWYodHlwZW9mKGVsZW0ub2Zmc2V0KCkpICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHR2YXIgdGhlVG9wID0gZWxlbS5vZmZzZXQoKS50b3AgLSBhbmNob3JUb3BNYXJnaW47XG5cdFx0XHQkKCdodG1sLCBib2R5Jykuc3RvcCgpLmFuaW1hdGUoeyBzY3JvbGxUb3A6dGhlVG9wIH0sIDI1MCwgJ2Vhc2VPdXRDdWJpYycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaGFzaCA9IG5hbWU7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblx0XG5cblx0ZnVuY3Rpb24gc2V0Rm9vdGVyVHlwZSgpIHtcblx0XHR2YXIgd2luZG93SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXHRcdHZhciBib2R5SGVpZ2h0O1xuXG5cdFx0c3dpdGNoIChodG1sWzBdLmlkKSB7XG5cdFx0XHRjYXNlICdkb2NzJzoge1xuXHRcdFx0XHRib2R5SGVpZ2h0ID0gaGVyby5vdXRlckhlaWdodCgpICsgZW5jeWNsb3BlZGlhLm91dGVySGVpZ2h0KCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHRjYXNlICdob21lJzpcblx0XHRcdFx0Ym9keUhlaWdodCA9IHdpbmRvd0hlaWdodDtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGRlZmF1bHQ6IHtcblx0XHRcdFx0Ym9keUhlaWdodCA9IGhlcm8ub3V0ZXJIZWlnaHQoKSArICQoJyNtYWluQ29udGVudCcpLm91dGVySGVpZ2h0KCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dmFyIGZvb3RlckhlaWdodCA9IGZvb3Rlci5vdXRlckhlaWdodCgpO1xuXHRcdGNsYXNzT25Db25kaXRpb24oYm9keSwgJ2ZpeGVkJywgd2luZG93SGVpZ2h0IC0gZm9vdGVySGVpZ2h0ID4gYm9keUhlaWdodCk7XG5cdH1cblxuXHRmdW5jdGlvbiByZXNldFRoZVZpZXcoKSB7XG5cdFx0aWYgKGh0bWwuaGFzQ2xhc3MoJ29wZW4tbmF2JykpIHtcblx0XHRcdHRvZ2dsZU1lbnUoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0SEVBREVSX0hFSUdIVCA9IGhlYWRlci5vdXRlckhlaWdodCgpO1xuXHRcdH1cblxuXHRcdGlmIChodG1sLmhhc0NsYXNzKCdvcGVuLXRvYycpKSB7XG5cdFx0XHR0b2dnbGVUb2MoKTtcblx0XHR9XG5cblx0XHRjbGFzc09uQ29uZGl0aW9uKGh0bWwsICdmbGlwLW5hdicsIHdpbmRvdy5wYWdlWU9mZnNldCA+IDApO1xuXG5cdFx0aWYgKGh0bWxbMF0uaWQgPT0gJ2hvbWUnKSB7XG5cdFx0XHRzZXRIb21lSGVhZGVyU3R5bGVzKCk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gc2V0SG9tZUhlYWRlclN0eWxlcygpIHtcblx0XHR2YXIgWSA9IHdpbmRvdy5wYWdlWU9mZnNldDtcblx0XHR2YXIgcXVpY2tzdGFydEJvdHRvbSA9IHF1aWNrc3RhcnRCdXR0b25bMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuYm90dG9tO1xuXG5cdFx0Y2xhc3NPbkNvbmRpdGlvbihodG1sWzBdLCAneS1lbm91Z2gnLCBZID4gcXVpY2tzdGFydEJvdHRvbSk7XG5cdH1cblxuXHRmdW5jdGlvbiB0b2dnbGVNZW51KCkge1xuXHRcdGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IDgwMCkge1xuXHRcdFx0cHVzaG1lbnUuc2hvdygncHJpbWFyeScpO1xuXHRcdH1cblxuXHRcdGVsc2Uge1xuXHRcdFx0dmFyIG5ld0hlaWdodCA9IEhFQURFUl9IRUlHSFQ7XG5cblx0XHRcdGlmICghaHRtbC5oYXNDbGFzcygnb3Blbi1uYXYnKSkge1xuXHRcdFx0XHRuZXdIZWlnaHQgPSBtYWluTmF2Lm91dGVySGVpZ2h0KCk7XG5cdFx0XHR9XG5cblx0XHRcdGhlYWRlci5jc3Moe2hlaWdodDogcHgobmV3SGVpZ2h0KX0pO1xuXHRcdFx0aHRtbC50b2dnbGVDbGFzcygnb3Blbi1uYXYnKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBzdWJtaXRXaXNoKHRleHRmaWVsZCkge1xuXHRcdHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKFwiaHR0cHM6Ly9naXRodWIuY29tL2t1YmVybmV0ZXMva3ViZXJuZXRlcy5naXRodWIuaW8vaXNzdWVzL25ldz90aXRsZT1JJTIwd2lzaCUyMFwiICtcblx0XHRcdHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArIFwiJTIwXCIgKyB0ZXh0ZmllbGQudmFsdWUgKyBcIiZib2R5PUklMjB3aXNoJTIwXCIgK1xuXHRcdFx0d2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgXCIlMjBcIiArIHRleHRmaWVsZC52YWx1ZSk7XG5cblx0XHR0ZXh0ZmllbGQudmFsdWUgPSAnJztcblx0XHR0ZXh0ZmllbGQuYmx1cigpO1xuXHR9XG5cblx0ZnVuY3Rpb24gaGFuZGxlS2V5c3Ryb2tlcyhlKSB7XG5cdFx0c3dpdGNoIChlLndoaWNoKSB7XG5cdFx0XHRjYXNlIDEzOiB7XG5cdFx0XHRcdGlmIChlLmN1cnJlbnRUYXJnZXQgPT09IHdpc2hGaWVsZFswXSkge1xuXHRcdFx0XHRcdHN1Ym1pdFdpc2god2lzaEZpZWxkWzBdKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblxuXHRcdFx0Y2FzZSAyNzoge1xuXHRcdFx0XHRpZiAoaHRtbC5oYXNDbGFzcygnb3Blbi1uYXYnKSkge1xuXHRcdFx0XHRcdHRvZ2dsZU1lbnUoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBzaG93VmlkZW8oKSB7XG5cdFx0JCgnYm9keScpLmNzcyh7b3ZlcmZsb3c6ICdoaWRkZW4nfSk7XG5cblx0XHR2YXIgdmlkZW9QbGF5ZXIgPSAkKFwiI3ZpZGVvUGxheWVyXCIpO1xuXHRcdHZhciB2aWRlb0lmcmFtZSA9IHZpZGVvUGxheWVyLmZpbmQoXCJpZnJhbWVcIilbMF07XG5cdFx0dmlkZW9JZnJhbWUuc3JjID0gdmlkZW9JZnJhbWUuZ2V0QXR0cmlidXRlKFwiZGF0YS11cmxcIik7XG5cdFx0dmlkZW9QbGF5ZXIuY3NzKHt6SW5kZXg6IGhpZ2hlc3RaKCl9KTtcblx0XHR2aWRlb1BsYXllci5mYWRlSW4oMzAwKTtcblx0XHR2aWRlb1BsYXllci5jbGljayhmdW5jdGlvbigpe1xuXHRcdFx0JCgnYm9keScpLmNzcyh7b3ZlcmZsb3c6ICdhdXRvJ30pO1xuXG5cdFx0XHR2aWRlb1BsYXllci5mYWRlT3V0KDMwMCwgZnVuY3Rpb24oKXtcblx0XHRcdFx0dmlkZW9JZnJhbWUuc3JjID0gJyc7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIHRvY1dhc0NsaWNrZWQoZSkge1xuXHRcdHZhciB0YXJnZXQgPSAkKGUudGFyZ2V0KTtcblx0XHR2YXIgZG9jc1RvYyA9ICQoXCIjZG9jc1RvY1wiKTtcblx0XHRyZXR1cm4gKHRhcmdldFswXSA9PT0gZG9jc1RvY1swXSB8fCB0YXJnZXQucGFyZW50cyhcIiNkb2NzVG9jXCIpLmxlbmd0aCA+IDApO1xuXHR9XG5cblx0ZnVuY3Rpb24gbGlzdGVuRm9yVG9jQ2xpY2soZSkge1xuXHRcdGlmICghdG9jV2FzQ2xpY2tlZChlKSkgdG9nZ2xlVG9jKCk7XG5cdH1cblxuXHRmdW5jdGlvbiB0b2dnbGVUb2MoKSB7XG5cdFx0aHRtbC50b2dnbGVDbGFzcygnb3Blbi10b2MnKTtcblxuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0aWYgKGh0bWwuaGFzQ2xhc3MoJ29wZW4tdG9jJykpIHtcblx0XHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgbGlzdGVuRm9yVG9jQ2xpY2spO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgbGlzdGVuRm9yVG9jQ2xpY2spO1xuXHRcdFx0fVxuXHRcdH0sIDEwMCk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdHRvZ2dsZVRvYzogdG9nZ2xlVG9jLFxuXHRcdHRvZ2dsZU1lbnU6IHRvZ2dsZU1lbnUsXG5cdFx0c2hvd1ZpZGVvOiBzaG93VmlkZW9cblx0fTtcbn0pKCk7XG5cblxuLy8gYWNjb3JkaW9uXG4oZnVuY3Rpb24oKXtcblx0dmFyIHlhaCA9IHRydWU7XG5cdHZhciBtb3ZpbmcgPSBmYWxzZTtcblx0dmFyIENTU19CUk9XU0VSX0hBQ0tfREVMQVkgPSAyNTtcblxuXHQkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuXHRcdC8vIFNhZmFyaSBjaG9rZXMgb24gdGhlIGFuaW1hdGlvbiBoZXJlLCBzby4uLlxuXHRcdGlmIChuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ0Nocm9tZScpID09IC0xICYmIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignU2FmYXJpJykgIT0gLTEpe1xuXHRcdFx0dmFyIGhhY2tTdHlsZSA9IG5ld0RPTUVsZW1lbnQoJ3N0eWxlJyk7XG5cdFx0XHRoYWNrU3R5bGUuaW5uZXJIVE1MID0gJy5waS1hY2NvcmRpb24gLndyYXBwZXJ7dHJhbnNpdGlvbjogbm9uZX0nO1xuXHRcdFx0Ym9keS5hcHBlbmQoaGFja1N0eWxlKTtcblx0XHR9XG5cdFx0Ly8gR3Jvc3MuXG5cblx0XHQkKCcucGktYWNjb3JkaW9uJykuZWFjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgYWNjb3JkaW9uID0gdGhpcztcblx0XHRcdHZhciBjb250ZW50ID0gdGhpcy5pbm5lckhUTUw7XG5cdFx0XHR2YXIgY29udGFpbmVyID0gbmV3RE9NRWxlbWVudCgnZGl2JywgJ2NvbnRhaW5lcicpO1xuXHRcdFx0Y29udGFpbmVyLmlubmVySFRNTCA9IGNvbnRlbnQ7XG5cdFx0XHQkKGFjY29yZGlvbikuZW1wdHkoKTtcblx0XHRcdGFjY29yZGlvbi5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuXHRcdFx0Q29sbGFwc2VCb3goJChjb250YWluZXIpKTtcblx0XHR9KTtcblxuXHRcdHNldFlBSCgpO1xuXG5cdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHR5YWggPSBmYWxzZTtcblx0XHR9LCA1MDApO1xuXHR9KTtcblxuXHRmdW5jdGlvbiBDb2xsYXBzZUJveChjb250YWluZXIpe1xuXHRcdGNvbnRhaW5lci5jaGlsZHJlbignLml0ZW0nKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHQvLyBidWlsZCB0aGUgVE9DIERPTVxuXHRcdFx0Ly8gdGhlIGFuaW1hdGVkIG9wZW4vY2xvc2UgaXMgZW5hYmxlZCBieSBoYXZpbmcgZWFjaCBpdGVtJ3MgY29udGVudCBleGlzdCBpbiB0aGUgZmxvdywgYXQgaXRzIG5hdHVyYWwgaGVpZ2h0LFxuXHRcdFx0Ly8gZW5jbG9zZWQgaW4gYSB3cmFwcGVyIHdpdGggaGVpZ2h0ID0gMCB3aGVuIGNsb3NlZCwgYW5kIGhlaWdodCA9IGNvbnRlbnRIZWlnaHQgd2hlbiBvcGVuLlxuXHRcdFx0dmFyIGl0ZW0gPSB0aGlzO1xuXG5cdFx0XHQvLyBvbmx5IGFkZCBjb250ZW50IHdyYXBwZXJzIHRvIGNvbnRhaW5lcnMsIG5vdCB0byBsaW5rc1xuXHRcdFx0dmFyIGlzQ29udGFpbmVyID0gaXRlbS50YWdOYW1lID09PSAnRElWJztcblxuXHRcdFx0dmFyIHRpdGxlVGV4dCA9IGl0ZW0uZ2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJyk7XG5cdFx0XHR2YXIgdGl0bGUgPSBuZXdET01FbGVtZW50KCdkaXYnLCAndGl0bGUnKTtcblx0XHRcdHRpdGxlLmlubmVySFRNTCA9IHRpdGxlVGV4dDtcblxuXHRcdFx0dmFyIHdyYXBwZXIsIGNvbnRlbnQ7XG5cblx0XHRcdGlmIChpc0NvbnRhaW5lcikge1xuXHRcdFx0XHR3cmFwcGVyID0gbmV3RE9NRWxlbWVudCgnZGl2JywgJ3dyYXBwZXInKTtcblx0XHRcdFx0Y29udGVudCA9IG5ld0RPTUVsZW1lbnQoJ2RpdicsICdjb250ZW50Jyk7XG5cdFx0XHRcdGNvbnRlbnQuaW5uZXJIVE1MID0gaXRlbS5pbm5lckhUTUw7XG5cdFx0XHRcdHdyYXBwZXIuYXBwZW5kQ2hpbGQoY29udGVudCk7XG5cdFx0XHR9XG5cblx0XHRcdGl0ZW0uaW5uZXJIVE1MID0gJyc7XG5cdFx0XHRpdGVtLmFwcGVuZENoaWxkKHRpdGxlKTtcblxuXHRcdFx0aWYgKHdyYXBwZXIpIHtcblx0XHRcdFx0aXRlbS5hcHBlbmRDaGlsZCh3cmFwcGVyKTtcblx0XHRcdFx0JCh3cmFwcGVyKS5jc3Moe2hlaWdodDogMH0pO1xuXHRcdFx0fVxuXG5cblx0XHRcdCQodGl0bGUpLmNsaWNrKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmICgheWFoKSB7XG5cdFx0XHRcdFx0aWYgKG1vdmluZykgcmV0dXJuO1xuXHRcdFx0XHRcdG1vdmluZyA9IHRydWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoY29udGFpbmVyWzBdLmdldEF0dHJpYnV0ZSgnZGF0YS1zaW5nbGUnKSkge1xuXHRcdFx0XHRcdHZhciBvcGVuU2libGluZ3MgPSBpdGVtLnNpYmxpbmdzKCkuZmlsdGVyKGZ1bmN0aW9uKHNpYil7cmV0dXJuIHNpYi5oYXNDbGFzcygnb24nKTt9KTtcblx0XHRcdFx0XHRvcGVuU2libGluZ3MuZm9yRWFjaChmdW5jdGlvbihzaWJsaW5nKXtcblx0XHRcdFx0XHRcdHRvZ2dsZUl0ZW0oc2libGluZyk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0aWYgKCFpc0NvbnRhaW5lcikge1xuXHRcdFx0XHRcdFx0bW92aW5nID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRvZ2dsZUl0ZW0oaXRlbSk7XG5cdFx0XHRcdH0sIENTU19CUk9XU0VSX0hBQ0tfREVMQVkpO1xuXHRcdFx0fSk7XG5cblx0XHRcdGZ1bmN0aW9uIHRvZ2dsZUl0ZW0odGhpc0l0ZW0pe1xuXHRcdFx0XHR2YXIgdGhpc1dyYXBwZXIgPSAkKHRoaXNJdGVtKS5maW5kKCcud3JhcHBlcicpLmVxKDApO1xuXG5cdFx0XHRcdGlmICghdGhpc1dyYXBwZXIpIHJldHVybjtcblxuXHRcdFx0XHR2YXIgY29udGVudEhlaWdodCA9IHRoaXNXcmFwcGVyLmZpbmQoJy5jb250ZW50JykuZXEoMCkuaW5uZXJIZWlnaHQoKSArICdweCc7XG5cblx0XHRcdFx0aWYgKCQodGhpc0l0ZW0pLmhhc0NsYXNzKCdvbicpKSB7XG5cdFx0XHRcdFx0dGhpc1dyYXBwZXIuY3NzKHtoZWlnaHQ6IGNvbnRlbnRIZWlnaHR9KTtcblx0XHRcdFx0XHQkKHRoaXNJdGVtKS5yZW1vdmVDbGFzcygnb24nKTtcblxuXHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdHRoaXNXcmFwcGVyLmNzcyh7aGVpZ2h0OiAwfSk7XG5cdFx0XHRcdFx0XHRtb3ZpbmcgPSBmYWxzZTtcblx0XHRcdFx0XHR9LCBDU1NfQlJPV1NFUl9IQUNLX0RFTEFZKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkKGl0ZW0pLmFkZENsYXNzKCdvbicpO1xuXHRcdFx0XHRcdHRoaXNXcmFwcGVyLmNzcyh7aGVpZ2h0OiBjb250ZW50SGVpZ2h0fSk7XG5cblx0XHRcdFx0XHR2YXIgZHVyYXRpb24gPSBwYXJzZUZsb2F0KGdldENvbXB1dGVkU3R5bGUodGhpc1dyYXBwZXJbMF0pLnRyYW5zaXRpb25EdXJhdGlvbikgKiAxMDAwO1xuXG5cdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0dGhpc1dyYXBwZXIuY3NzKHtoZWlnaHQ6ICcnfSk7XG5cdFx0XHRcdFx0XHRtb3ZpbmcgPSBmYWxzZTtcblx0XHRcdFx0XHR9LCBkdXJhdGlvbik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKGNvbnRlbnQpIHtcblx0XHRcdFx0dmFyIGlubmVyQ29udGFpbmVycyA9ICQoY29udGVudCkuY2hpbGRyZW4oJy5jb250YWluZXInKTtcblx0XHRcdFx0aWYgKGlubmVyQ29udGFpbmVycy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0aW5uZXJDb250YWluZXJzLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdENvbGxhcHNlQm94KCQodGhpcykpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRZQUgoKSB7XG5cdFx0dmFyIHBhdGhuYW1lID0gbG9jYXRpb24uaHJlZi5zcGxpdCgnIycpWzBdOyAvLyBvbiBwYWdlIGxvYWQsIG1ha2Ugc3VyZSB0aGUgcGFnZSBpcyBZQUggZXZlbiBpZiB0aGVyZSdzIGEgaGFzaFxuXHRcdHZhciBjdXJyZW50TGlua3MgPSBbXTtcblxuXHRcdCQoJy5waS1hY2NvcmRpb24gYScpLmVhY2goZnVuY3Rpb24gKCkge1xuXHRcdFx0aWYgKHBhdGhuYW1lID09PSB0aGlzLmhyZWYpIGN1cnJlbnRMaW5rcy5wdXNoKHRoaXMpO1xuXHRcdH0pO1xuXG5cdFx0Y3VycmVudExpbmtzLmZvckVhY2goZnVuY3Rpb24gKHlhaExpbmspIHtcblx0XHRcdCQoeWFoTGluaykucGFyZW50cygnLml0ZW0nKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdCQodGhpcykuYWRkQ2xhc3MoJ29uJyk7XG5cdFx0XHRcdCQodGhpcykuZmluZCgnLndyYXBwZXInKS5lcSgwKS5jc3Moe2hlaWdodDogJ2F1dG8nfSk7XG5cdFx0XHRcdCQodGhpcykuZmluZCgnLmNvbnRlbnQnKS5lcSgwKS5jc3Moe29wYWNpdHk6IDF9KTtcblx0XHRcdH0pO1xuXG5cdFx0XHQkKHlhaExpbmspLmFkZENsYXNzKCd5YWgnKTtcblx0XHRcdHlhaExpbmsub25jbGljayA9IGZ1bmN0aW9uKGUpe2UucHJldmVudERlZmF1bHQoKTt9O1xuXHRcdH0pO1xuXHR9XG59KSgpO1xuXG5cbnZhciBwdXNobWVudSA9IChmdW5jdGlvbigpe1xuXHR2YXIgYWxsUHVzaE1lbnVzID0ge307XG5cblx0JChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcblx0XHQkKCdbZGF0YS1hdXRvLWJ1cmdlcl0nKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgY29udGFpbmVyID0gdGhpcztcblx0XHRcdHZhciBpZCA9IGNvbnRhaW5lci5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXV0by1idXJnZXInKTtcblxuXHRcdFx0dmFyIGF1dG9CdXJnZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkgfHwgbmV3RE9NRWxlbWVudCgnZGl2JywgJ3BpLXB1c2htZW51JywgaWQpO1xuXHRcdFx0dmFyIHVsID0gYXV0b0J1cmdlci5xdWVyeVNlbGVjdG9yKCd1bCcpIHx8IG5ld0RPTUVsZW1lbnQoJ3VsJyk7XG5cblx0XHRcdCQoY29udGFpbmVyKS5maW5kKCdhW2hyZWZdLCBidXR0b24nKS5lYWNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0aWYgKCFib29sZWFuQXR0cmlidXRlVmFsdWUodGhpcywgJ2RhdGEtYXV0by1idXJnZXItZXhjbHVkZScsIGZhbHNlKSkge1xuXHRcdFx0XHRcdHZhciBjbG9uZSA9IHRoaXMuY2xvbmVOb2RlKHRydWUpO1xuXHRcdFx0XHRcdGNsb25lLmlkID0gJyc7XG5cblx0XHRcdFx0XHRpZiAoY2xvbmUudGFnTmFtZSA9PSBcIkJVVFRPTlwiKSB7XG5cdFx0XHRcdFx0XHR2YXIgYVRhZyA9IG5ld0RPTUVsZW1lbnQoJ2EnKTtcblx0XHRcdFx0XHRcdGFUYWcuaHJlZiA9ICcnO1xuXHRcdFx0XHRcdFx0YVRhZy5pbm5lckhUTUwgPSBjbG9uZS5pbm5lckhUTUw7XG5cdFx0XHRcdFx0XHRhVGFnLm9uY2xpY2sgPSBjbG9uZS5vbmNsaWNrO1xuXHRcdFx0XHRcdFx0Y2xvbmUgPSBhVGFnO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR2YXIgbGkgPSBuZXdET01FbGVtZW50KCdsaScpO1xuXHRcdFx0XHRcdGxpLmFwcGVuZENoaWxkKGNsb25lKTtcblx0XHRcdFx0XHR1bC5hcHBlbmRDaGlsZChsaSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRhdXRvQnVyZ2VyLmFwcGVuZENoaWxkKHVsKTtcblx0XHRcdGJvZHkuYXBwZW5kKGF1dG9CdXJnZXIpO1xuXHRcdH0pO1xuXG5cdFx0JChcIi5waS1wdXNobWVudVwiKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRhbGxQdXNoTWVudXNbdGhpcy5pZF0gPSBQdXNoTWVudSh0aGlzKTtcblx0XHR9KTtcblx0fSk7XG5cblx0ZnVuY3Rpb24gc2hvdyhvYmpJZCkge1xuXHRcdGFsbFB1c2hNZW51c1tvYmpJZF0uZXhwb3NlKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBQdXNoTWVudShlbCkge1xuXHRcdHZhciBodG1sID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaHRtbCcpO1xuXG5cdFx0dmFyIG92ZXJsYXkgPSBuZXdET01FbGVtZW50KCdkaXYnLCAnb3ZlcmxheScpO1xuXHRcdHZhciBjb250ZW50ID0gbmV3RE9NRWxlbWVudCgnZGl2JywgJ2NvbnRlbnQnKTtcblx0XHRjb250ZW50LmFwcGVuZENoaWxkKGVsLnF1ZXJ5U2VsZWN0b3IoJyonKSk7XG5cblx0XHR2YXIgc2lkZSA9IGVsLmdldEF0dHJpYnV0ZShcImRhdGEtc2lkZVwiKSB8fCBcInJpZ2h0XCI7XG5cblx0XHR2YXIgc2xlZCA9IG5ld0RPTUVsZW1lbnQoJ2RpdicsICdzbGVkJyk7XG5cdFx0JChzbGVkKS5jc3Moc2lkZSwgMCk7XG5cblx0XHRzbGVkLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xuXG5cdFx0dmFyIGNsb3NlQnV0dG9uID0gbmV3RE9NRWxlbWVudCgnYnV0dG9uJywgJ3B1c2gtbWVudS1jbG9zZS1idXR0b24nKTtcblx0XHRjbG9zZUJ1dHRvbi5vbmNsaWNrID0gY2xvc2VNZTtcblxuXHRcdHNsZWQuYXBwZW5kQ2hpbGQoY2xvc2VCdXR0b24pO1xuXG5cdFx0b3ZlcmxheS5hcHBlbmRDaGlsZChzbGVkKTtcblx0XHRlbC5pbm5lckhUTUwgPSAnJztcblx0XHRlbC5hcHBlbmRDaGlsZChvdmVybGF5KTtcblxuXHRcdHNsZWQub25jbGljayA9IGZ1bmN0aW9uKGUpe1xuXHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHR9O1xuXG5cdFx0b3ZlcmxheS5vbmNsaWNrID0gY2xvc2VNZTtcblxuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBjbG9zZU1lKTtcblxuXHRcdGZ1bmN0aW9uIGNsb3NlTWUoZSkge1xuXHRcdFx0aWYgKGUudGFyZ2V0ID09IHNsZWQpIHJldHVybjtcblxuXHRcdFx0JChlbCkucmVtb3ZlQ2xhc3MoJ29uJyk7XG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdCQoZWwpLmNzcyh7ZGlzcGxheTogJ25vbmUnfSk7XG5cblx0XHRcdFx0JChib2R5KS5yZW1vdmVDbGFzcygnb3ZlcmxheS1vbicpO1xuXHRcdFx0fSwgMzAwKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBleHBvc2VNZSgpe1xuXHRcdFx0JChib2R5KS5hZGRDbGFzcygnb3ZlcmxheS1vbicpOyAvLyBpbiB0aGUgZGVmYXVsdCBjb25maWcsIGtpbGxzIGJvZHkgc2Nyb2xsaW5nXG5cblx0XHRcdCQoZWwpLmNzcyh7XG5cdFx0XHRcdGRpc3BsYXk6ICdibG9jaycsXG5cdFx0XHRcdHpJbmRleDogaGlnaGVzdFooKVxuXHRcdFx0fSk7XG5cblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0JChlbCkuYWRkQ2xhc3MoJ29uJyk7XG5cdFx0XHR9LCAxMCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4cG9zZTogZXhwb3NlTWVcblx0XHR9O1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRzaG93OiBzaG93XG5cdH07XG59KSgpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
