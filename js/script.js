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

		$('.dropdown').each(function () {
			var dropdown = $(this);
			var readout = dropdown.find('.readout');

			dropdown.find('a').each(function(){
				if (location.href.indexOf(this.href) != -1) {
					readout.html($(this).html());
				}
			});

			readout.click(function () {
				dropdown.toggleClass('on');
				window.addEventListener('click', closeOpenDropdown);

				function closeOpenDropdown(e) {
					if (dropdown.hasClass('on') && !(dropdownWasClicked(e))) {
						dropdown.removeClass('on');
						window.removeEventListener('click', closeOpenDropdown);
					}
				}

				function dropdownWasClicked(e) {
					return $(e.target).parents('.dropdown').length;
				}
			});
		});

		setInterval(setFooterType, 10);
	});

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

	return {
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

		var topBar = newDOMElement('div', 'top-bar');
		// TODO: add modal close button to topBar
		//topBar.fill(π.modalCloseButton(closeMe));

		sled.appendChild(topBar);
		sled.appendChild(content);

		overlay.appendChild(sled);
		el.innerHTML = '';
		el.appendChild(overlay);

		sled.onclick = function(e){
			e.stopPropagation();
		};

		overlay.onclick = closeMe;

		window.addEventListener('resize', closeMe);

		function closeMe(e) {
			var t = e.target;
			if (t == sled || t == topBar) return;

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIs+ALWJhc2VDb21wb25lbnRzLmpzIiwic2NyaXB0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJzY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgLy9tb2RhbCBjbG9zZSBidXR0b25cbihmdW5jdGlvbigpe1xuXHQvL8+ALm1vZGFsQ2xvc2VCdXR0b24gPSBmdW5jdGlvbihjbG9zaW5nRnVuY3Rpb24pe1xuXHQvL1x0cmV0dXJuIM+ALmJ1dHRvbigncGktbW9kYWwtY2xvc2UtYnV0dG9uJywgbnVsbCwgbnVsbCwgY2xvc2luZ0Z1bmN0aW9uKTtcblx0Ly99O1xufSkoKTtcbiIsIi8vIGdsb2JhbHNcbnZhciBib2R5O1xuXG4vL2hlbHBlciBmdW5jdGlvbnNcbmZ1bmN0aW9uIGJvb2xlYW5BdHRyaWJ1dGVWYWx1ZShlbGVtZW50LCBhdHRyaWJ1dGUsIGRlZmF1bHRWYWx1ZSl7XG5cdC8vIHJldHVybnMgdHJ1ZSBpZiBhbiBhdHRyaWJ1dGUgaXMgcHJlc2VudCB3aXRoIG5vIHZhbHVlXG5cdC8vIGUuZy4gYm9vbGVhbkF0dHJpYnV0ZVZhbHVlKGVsZW1lbnQsICdkYXRhLW1vZGFsJywgZmFsc2UpO1xuXHRpZiAoZWxlbWVudC5oYXNBdHRyaWJ1dGUoYXR0cmlidXRlKSkge1xuXHRcdHZhciB2YWx1ZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZSk7XG5cdFx0aWYgKHZhbHVlID09PSAnJyB8fCB2YWx1ZSA9PT0gJ3RydWUnKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9IGVsc2UgaWYgKHZhbHVlID09PSAnZmFsc2UnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGRlZmF1bHRWYWx1ZTtcbn1cblxuZnVuY3Rpb24gY2xhc3NPbkNvbmRpdGlvbihlbGVtZW50LCBjbGFzc05hbWUsIGNvbmRpdGlvbikge1xuXHRpZiAoY29uZGl0aW9uKVxuXHRcdCQoZWxlbWVudCkuYWRkQ2xhc3MoY2xhc3NOYW1lKTtcblx0ZWxzZVxuXHRcdCQoZWxlbWVudCkucmVtb3ZlQ2xhc3MoY2xhc3NOYW1lKTtcbn1cblxuZnVuY3Rpb24gaGlnaGVzdFooKSB7XG5cdHZhciBaID0gMTAwMDtcblxuXHQkKFwiKlwiKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0dmFyIHRoaXNaID0gJCh0aGlzKS5jc3MoJ3otaW5kZXgnKTtcblxuXHRcdGlmICh0aGlzWiAhPSBcImF1dG9cIiAmJiB0aGlzWiA+IFopIFogPSArK3RoaXNaO1xuXHR9KTtcblxuXHRyZXR1cm4gWjtcbn1cblxuZnVuY3Rpb24gbmV3RE9NRWxlbWVudCh0YWcsIGNsYXNzTmFtZSwgaWQpe1xuXHR2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG5cblx0aWYgKGNsYXNzTmFtZSkgZWwuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuXHRpZiAoaWQpIGVsLmlkID0gaWQ7XG5cblx0cmV0dXJuIGVsO1xufVxuXG5mdW5jdGlvbiBweChuKXtcblx0cmV0dXJuIG4gKyAncHgnO1xufVxuXG52YXIga3ViID0gKGZ1bmN0aW9uICgpIHtcblx0dmFyIEhFQURFUl9IRUlHSFQ7XG5cdHZhciBodG1sLCBoZWFkZXIsIG1haW5OYXYsIHF1aWNrc3RhcnRCdXR0b24sIGhlcm8sIGVuY3ljbG9wZWRpYSwgZm9vdGVyLCB3aXNoRmllbGQsIGhlYWRsaW5lV3JhcHBlcjtcblxuXHQkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG5cdFx0aHRtbCA9ICQoJ2h0bWwnKTtcblx0XHRib2R5ID0gJCgnYm9keScpO1xuXHRcdGhlYWRlciA9ICQoJ2hlYWRlcicpO1xuXHRcdG1haW5OYXYgPSAkKCcjbWFpbk5hdicpO1xuXHRcdHdpc2hGaWVsZCA9ICQoJyN3aXNoRmllbGQnKTtcblx0XHRxdWlja3N0YXJ0QnV0dG9uID0gJCgnI3F1aWNrc3RhcnRCdXR0b24nKTtcblx0XHRoZXJvID0gJCgnI2hlcm8nKTtcblx0XHRlbmN5Y2xvcGVkaWEgPSAkKCcjZW5jeWNsb3BlZGlhJyk7XG5cdFx0Zm9vdGVyID0gJCgnZm9vdGVyJyk7XG5cdFx0aGVhZGxpbmVXcmFwcGVyID0gJCgnI2hlYWRsaW5lV3JhcHBlcicpO1xuXHRcdEhFQURFUl9IRUlHSFQgPSBoZWFkZXIub3V0ZXJIZWlnaHQoKTtcblxuXHRcdHJlc2V0VGhlVmlldygpO1xuXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2V0VGhlVmlldyk7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHJlc2V0VGhlVmlldyk7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlzdHJva2VzKTtcblx0XHR3aXNoRmllbGRbMF0uYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleXN0cm9rZXMpO1xuXG5cdFx0ZG9jdW1lbnQub251bmxvYWQgPSBmdW5jdGlvbigpe1xuXHRcdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2V0VGhlVmlldyk7XG5cdFx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgcmVzZXRUaGVWaWV3KTtcblx0XHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5c3Ryb2tlcyk7XG5cdFx0XHR3aXNoRmllbGRbMF0ucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleXN0cm9rZXMpO1xuXHRcdH07XG5cblx0XHQkKCcuZHJvcGRvd24nKS5lYWNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBkcm9wZG93biA9ICQodGhpcyk7XG5cdFx0XHR2YXIgcmVhZG91dCA9IGRyb3Bkb3duLmZpbmQoJy5yZWFkb3V0Jyk7XG5cblx0XHRcdGRyb3Bkb3duLmZpbmQoJ2EnKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmIChsb2NhdGlvbi5ocmVmLmluZGV4T2YodGhpcy5ocmVmKSAhPSAtMSkge1xuXHRcdFx0XHRcdHJlYWRvdXQuaHRtbCgkKHRoaXMpLmh0bWwoKSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRyZWFkb3V0LmNsaWNrKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0ZHJvcGRvd24udG9nZ2xlQ2xhc3MoJ29uJyk7XG5cdFx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlT3BlbkRyb3Bkb3duKTtcblxuXHRcdFx0XHRmdW5jdGlvbiBjbG9zZU9wZW5Ecm9wZG93bihlKSB7XG5cdFx0XHRcdFx0aWYgKGRyb3Bkb3duLmhhc0NsYXNzKCdvbicpICYmICEoZHJvcGRvd25XYXNDbGlja2VkKGUpKSkge1xuXHRcdFx0XHRcdFx0ZHJvcGRvd24ucmVtb3ZlQ2xhc3MoJ29uJyk7XG5cdFx0XHRcdFx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZU9wZW5Ecm9wZG93bik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZnVuY3Rpb24gZHJvcGRvd25XYXNDbGlja2VkKGUpIHtcblx0XHRcdFx0XHRyZXR1cm4gJChlLnRhcmdldCkucGFyZW50cygnLmRyb3Bkb3duJykubGVuZ3RoO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdHNldEludGVydmFsKHNldEZvb3RlclR5cGUsIDEwKTtcblx0fSk7XG5cblx0ZnVuY3Rpb24gc2V0Rm9vdGVyVHlwZSgpIHtcblx0XHR2YXIgd2luZG93SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXHRcdHZhciBib2R5SGVpZ2h0O1xuXG5cdFx0c3dpdGNoIChodG1sWzBdLmlkKSB7XG5cdFx0XHRjYXNlICdkb2NzJzoge1xuXHRcdFx0XHRib2R5SGVpZ2h0ID0gaGVyby5vdXRlckhlaWdodCgpICsgZW5jeWNsb3BlZGlhLm91dGVySGVpZ2h0KCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHRjYXNlICdob21lJzpcblx0XHRcdFx0Ym9keUhlaWdodCA9IHdpbmRvd0hlaWdodDtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGRlZmF1bHQ6IHtcblx0XHRcdFx0Ym9keUhlaWdodCA9IGhlcm8ub3V0ZXJIZWlnaHQoKSArICQoJyNtYWluQ29udGVudCcpLm91dGVySGVpZ2h0KCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dmFyIGZvb3RlckhlaWdodCA9IGZvb3Rlci5vdXRlckhlaWdodCgpO1xuXHRcdGNsYXNzT25Db25kaXRpb24oYm9keSwgJ2ZpeGVkJywgd2luZG93SGVpZ2h0IC0gZm9vdGVySGVpZ2h0ID4gYm9keUhlaWdodCk7XG5cdH1cblxuXHRmdW5jdGlvbiByZXNldFRoZVZpZXcoKSB7XG5cdFx0aWYgKGh0bWwuaGFzQ2xhc3MoJ29wZW4tbmF2JykpIHtcblx0XHRcdHRvZ2dsZU1lbnUoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0SEVBREVSX0hFSUdIVCA9IGhlYWRlci5vdXRlckhlaWdodCgpO1xuXHRcdH1cblxuXHRcdGNsYXNzT25Db25kaXRpb24oaHRtbCwgJ2ZsaXAtbmF2Jywgd2luZG93LnBhZ2VZT2Zmc2V0ID4gMCk7XG5cblx0XHRpZiAoaHRtbFswXS5pZCA9PSAnaG9tZScpIHtcblx0XHRcdHNldEhvbWVIZWFkZXJTdHlsZXMoKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRIb21lSGVhZGVyU3R5bGVzKCkge1xuXHRcdHZhciBZID0gd2luZG93LnBhZ2VZT2Zmc2V0O1xuXHRcdHZhciBxdWlja3N0YXJ0Qm90dG9tID0gcXVpY2tzdGFydEJ1dHRvblswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5ib3R0b207XG5cblx0XHRjbGFzc09uQ29uZGl0aW9uKGh0bWxbMF0sICd5LWVub3VnaCcsIFkgPiBxdWlja3N0YXJ0Qm90dG9tKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHRvZ2dsZU1lbnUoKSB7XG5cdFx0aWYgKHdpbmRvdy5pbm5lcldpZHRoIDwgODAwKSB7XG5cdFx0XHRwdXNobWVudS5zaG93KCdwcmltYXJ5Jyk7XG5cdFx0fVxuXG5cdFx0ZWxzZSB7XG5cdFx0XHR2YXIgbmV3SGVpZ2h0ID0gSEVBREVSX0hFSUdIVDtcblxuXHRcdFx0aWYgKCFodG1sLmhhc0NsYXNzKCdvcGVuLW5hdicpKSB7XG5cdFx0XHRcdG5ld0hlaWdodCA9IG1haW5OYXYub3V0ZXJIZWlnaHQoKTtcblx0XHRcdH1cblxuXHRcdFx0aGVhZGVyLmNzcyh7aGVpZ2h0OiBweChuZXdIZWlnaHQpfSk7XG5cdFx0XHRodG1sLnRvZ2dsZUNsYXNzKCdvcGVuLW5hdicpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHN1Ym1pdFdpc2godGV4dGZpZWxkKSB7XG5cdFx0d2luZG93LmxvY2F0aW9uLnJlcGxhY2UoXCJodHRwczovL2dpdGh1Yi5jb20va3ViZXJuZXRlcy9rdWJlcm5ldGVzLmdpdGh1Yi5pby9pc3N1ZXMvbmV3P3RpdGxlPUklMjB3aXNoJTIwXCIgK1xuXHRcdFx0d2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgXCIlMjBcIiArIHRleHRmaWVsZC52YWx1ZSArIFwiJmJvZHk9SSUyMHdpc2glMjBcIiArXG5cdFx0XHR3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyBcIiUyMFwiICsgdGV4dGZpZWxkLnZhbHVlKTtcblxuXHRcdHRleHRmaWVsZC52YWx1ZSA9ICcnO1xuXHRcdHRleHRmaWVsZC5ibHVyKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBoYW5kbGVLZXlzdHJva2VzKGUpIHtcblx0XHRzd2l0Y2ggKGUud2hpY2gpIHtcblx0XHRcdGNhc2UgMTM6IHtcblx0XHRcdFx0aWYgKGUuY3VycmVudFRhcmdldCA9PT0gd2lzaEZpZWxkWzBdKSB7XG5cdFx0XHRcdFx0c3VibWl0V2lzaCh3aXNoRmllbGRbMF0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHRjYXNlIDI3OiB7XG5cdFx0XHRcdGlmIChodG1sLmhhc0NsYXNzKCdvcGVuLW5hdicpKSB7XG5cdFx0XHRcdFx0dG9nZ2xlTWVudSgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHNob3dWaWRlbygpIHtcblx0XHQkKCdib2R5JykuY3NzKHtvdmVyZmxvdzogJ2hpZGRlbid9KTtcblxuXHRcdHZhciB2aWRlb1BsYXllciA9ICQoXCIjdmlkZW9QbGF5ZXJcIik7XG5cdFx0dmFyIHZpZGVvSWZyYW1lID0gdmlkZW9QbGF5ZXIuZmluZChcImlmcmFtZVwiKVswXTtcblx0XHR2aWRlb0lmcmFtZS5zcmMgPSB2aWRlb0lmcmFtZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXVybFwiKTtcblx0XHR2aWRlb1BsYXllci5jc3Moe3pJbmRleDogaGlnaGVzdFooKX0pO1xuXHRcdHZpZGVvUGxheWVyLmZhZGVJbigzMDApO1xuXHRcdHZpZGVvUGxheWVyLmNsaWNrKGZ1bmN0aW9uKCl7XG5cdFx0XHQkKCdib2R5JykuY3NzKHtvdmVyZmxvdzogJ2F1dG8nfSk7XG5cblx0XHRcdHZpZGVvUGxheWVyLmZhZGVPdXQoMzAwLCBmdW5jdGlvbigpe1xuXHRcdFx0XHR2aWRlb0lmcmFtZS5zcmMgPSAnJztcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHR0b2dnbGVNZW51OiB0b2dnbGVNZW51LFxuXHRcdHNob3dWaWRlbzogc2hvd1ZpZGVvXG5cdH07XG59KSgpO1xuXG5cbi8vIGFjY29yZGlvblxuKGZ1bmN0aW9uKCl7XG5cdHZhciB5YWggPSB0cnVlO1xuXHR2YXIgbW92aW5nID0gZmFsc2U7XG5cdHZhciBDU1NfQlJPV1NFUl9IQUNLX0RFTEFZID0gMjU7XG5cblx0JChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcblx0XHQvLyBTYWZhcmkgY2hva2VzIG9uIHRoZSBhbmltYXRpb24gaGVyZSwgc28uLi5cblx0XHRpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdDaHJvbWUnKSA9PSAtMSAmJiBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ1NhZmFyaScpICE9IC0xKXtcblx0XHRcdHZhciBoYWNrU3R5bGUgPSBuZXdET01FbGVtZW50KCdzdHlsZScpO1xuXHRcdFx0aGFja1N0eWxlLmlubmVySFRNTCA9ICcucGktYWNjb3JkaW9uIC53cmFwcGVye3RyYW5zaXRpb246IG5vbmV9Jztcblx0XHRcdGJvZHkuYXBwZW5kKGhhY2tTdHlsZSk7XG5cdFx0fVxuXHRcdC8vIEdyb3NzLlxuXG5cdFx0JCgnLnBpLWFjY29yZGlvbicpLmVhY2goZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIGFjY29yZGlvbiA9IHRoaXM7XG5cdFx0XHR2YXIgY29udGVudCA9IHRoaXMuaW5uZXJIVE1MO1xuXHRcdFx0dmFyIGNvbnRhaW5lciA9IG5ld0RPTUVsZW1lbnQoJ2RpdicsICdjb250YWluZXInKTtcblx0XHRcdGNvbnRhaW5lci5pbm5lckhUTUwgPSBjb250ZW50O1xuXHRcdFx0JChhY2NvcmRpb24pLmVtcHR5KCk7XG5cdFx0XHRhY2NvcmRpb24uYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcblx0XHRcdENvbGxhcHNlQm94KCQoY29udGFpbmVyKSk7XG5cdFx0fSk7XG5cblx0XHRzZXRZQUgoKTtcblxuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0eWFoID0gZmFsc2U7XG5cdFx0fSwgNTAwKTtcblx0fSk7XG5cblx0ZnVuY3Rpb24gQ29sbGFwc2VCb3goY29udGFpbmVyKXtcblx0XHRjb250YWluZXIuY2hpbGRyZW4oJy5pdGVtJykuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0Ly8gYnVpbGQgdGhlIFRPQyBET01cblx0XHRcdC8vIHRoZSBhbmltYXRlZCBvcGVuL2Nsb3NlIGlzIGVuYWJsZWQgYnkgaGF2aW5nIGVhY2ggaXRlbSdzIGNvbnRlbnQgZXhpc3QgaW4gdGhlIGZsb3csIGF0IGl0cyBuYXR1cmFsIGhlaWdodCxcblx0XHRcdC8vIGVuY2xvc2VkIGluIGEgd3JhcHBlciB3aXRoIGhlaWdodCA9IDAgd2hlbiBjbG9zZWQsIGFuZCBoZWlnaHQgPSBjb250ZW50SGVpZ2h0IHdoZW4gb3Blbi5cblx0XHRcdHZhciBpdGVtID0gdGhpcztcblxuXHRcdFx0Ly8gb25seSBhZGQgY29udGVudCB3cmFwcGVycyB0byBjb250YWluZXJzLCBub3QgdG8gbGlua3Ncblx0XHRcdHZhciBpc0NvbnRhaW5lciA9IGl0ZW0udGFnTmFtZSA9PT0gJ0RJVic7XG5cblx0XHRcdHZhciB0aXRsZVRleHQgPSBpdGVtLmdldEF0dHJpYnV0ZSgnZGF0YS10aXRsZScpO1xuXHRcdFx0dmFyIHRpdGxlID0gbmV3RE9NRWxlbWVudCgnZGl2JywgJ3RpdGxlJyk7XG5cdFx0XHR0aXRsZS5pbm5lckhUTUwgPSB0aXRsZVRleHQ7XG5cblx0XHRcdHZhciB3cmFwcGVyLCBjb250ZW50O1xuXG5cdFx0XHRpZiAoaXNDb250YWluZXIpIHtcblx0XHRcdFx0d3JhcHBlciA9IG5ld0RPTUVsZW1lbnQoJ2RpdicsICd3cmFwcGVyJyk7XG5cdFx0XHRcdGNvbnRlbnQgPSBuZXdET01FbGVtZW50KCdkaXYnLCAnY29udGVudCcpO1xuXHRcdFx0XHRjb250ZW50LmlubmVySFRNTCA9IGl0ZW0uaW5uZXJIVE1MO1xuXHRcdFx0XHR3cmFwcGVyLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xuXHRcdFx0fVxuXG5cdFx0XHRpdGVtLmlubmVySFRNTCA9ICcnO1xuXHRcdFx0aXRlbS5hcHBlbmRDaGlsZCh0aXRsZSk7XG5cblx0XHRcdGlmICh3cmFwcGVyKSB7XG5cdFx0XHRcdGl0ZW0uYXBwZW5kQ2hpbGQod3JhcHBlcik7XG5cdFx0XHRcdCQod3JhcHBlcikuY3NzKHtoZWlnaHQ6IDB9KTtcblx0XHRcdH1cblxuXG5cdFx0XHQkKHRpdGxlKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdFx0XHRpZiAoIXlhaCkge1xuXHRcdFx0XHRcdGlmIChtb3ZpbmcpIHJldHVybjtcblx0XHRcdFx0XHRtb3ZpbmcgPSB0cnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGNvbnRhaW5lclswXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2luZ2xlJykpIHtcblx0XHRcdFx0XHR2YXIgb3BlblNpYmxpbmdzID0gaXRlbS5zaWJsaW5ncygpLmZpbHRlcihmdW5jdGlvbihzaWIpe3JldHVybiBzaWIuaGFzQ2xhc3MoJ29uJyk7fSk7XG5cdFx0XHRcdFx0b3BlblNpYmxpbmdzLmZvckVhY2goZnVuY3Rpb24oc2libGluZyl7XG5cdFx0XHRcdFx0XHR0b2dnbGVJdGVtKHNpYmxpbmcpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdGlmICghaXNDb250YWluZXIpIHtcblx0XHRcdFx0XHRcdG1vdmluZyA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0b2dnbGVJdGVtKGl0ZW0pO1xuXHRcdFx0XHR9LCBDU1NfQlJPV1NFUl9IQUNLX0RFTEFZKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRmdW5jdGlvbiB0b2dnbGVJdGVtKHRoaXNJdGVtKXtcblx0XHRcdFx0dmFyIHRoaXNXcmFwcGVyID0gJCh0aGlzSXRlbSkuZmluZCgnLndyYXBwZXInKS5lcSgwKTtcblxuXHRcdFx0XHRpZiAoIXRoaXNXcmFwcGVyKSByZXR1cm47XG5cblx0XHRcdFx0dmFyIGNvbnRlbnRIZWlnaHQgPSB0aGlzV3JhcHBlci5maW5kKCcuY29udGVudCcpLmVxKDApLmlubmVySGVpZ2h0KCkgKyAncHgnO1xuXG5cdFx0XHRcdGlmICgkKHRoaXNJdGVtKS5oYXNDbGFzcygnb24nKSkge1xuXHRcdFx0XHRcdHRoaXNXcmFwcGVyLmNzcyh7aGVpZ2h0OiBjb250ZW50SGVpZ2h0fSk7XG5cdFx0XHRcdFx0JCh0aGlzSXRlbSkucmVtb3ZlQ2xhc3MoJ29uJyk7XG5cblx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHR0aGlzV3JhcHBlci5jc3Moe2hlaWdodDogMH0pO1xuXHRcdFx0XHRcdFx0bW92aW5nID0gZmFsc2U7XG5cdFx0XHRcdFx0fSwgQ1NTX0JST1dTRVJfSEFDS19ERUxBWSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JChpdGVtKS5hZGRDbGFzcygnb24nKTtcblx0XHRcdFx0XHR0aGlzV3JhcHBlci5jc3Moe2hlaWdodDogY29udGVudEhlaWdodH0pO1xuXG5cdFx0XHRcdFx0dmFyIGR1cmF0aW9uID0gcGFyc2VGbG9hdChnZXRDb21wdXRlZFN0eWxlKHRoaXNXcmFwcGVyWzBdKS50cmFuc2l0aW9uRHVyYXRpb24pICogMTAwMDtcblxuXHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdHRoaXNXcmFwcGVyLmNzcyh7aGVpZ2h0OiAnJ30pO1xuXHRcdFx0XHRcdFx0bW92aW5nID0gZmFsc2U7XG5cdFx0XHRcdFx0fSwgZHVyYXRpb24pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmIChjb250ZW50KSB7XG5cdFx0XHRcdHZhciBpbm5lckNvbnRhaW5lcnMgPSAkKGNvbnRlbnQpLmNoaWxkcmVuKCcuY29udGFpbmVyJyk7XG5cdFx0XHRcdGlmIChpbm5lckNvbnRhaW5lcnMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdGlubmVyQ29udGFpbmVycy5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRDb2xsYXBzZUJveCgkKHRoaXMpKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2V0WUFIKCkge1xuXHRcdHZhciBwYXRobmFtZSA9IGxvY2F0aW9uLmhyZWYuc3BsaXQoJyMnKVswXTsgLy8gb24gcGFnZSBsb2FkLCBtYWtlIHN1cmUgdGhlIHBhZ2UgaXMgWUFIIGV2ZW4gaWYgdGhlcmUncyBhIGhhc2hcblx0XHR2YXIgY3VycmVudExpbmtzID0gW107XG5cblx0XHQkKCcucGktYWNjb3JkaW9uIGEnKS5lYWNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmIChwYXRobmFtZSA9PT0gdGhpcy5ocmVmKSBjdXJyZW50TGlua3MucHVzaCh0aGlzKTtcblx0XHR9KTtcblxuXHRcdGN1cnJlbnRMaW5rcy5mb3JFYWNoKGZ1bmN0aW9uICh5YWhMaW5rKSB7XG5cdFx0XHQkKHlhaExpbmspLnBhcmVudHMoJy5pdGVtJykuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0XHQkKHRoaXMpLmFkZENsYXNzKCdvbicpO1xuXHRcdFx0XHQkKHRoaXMpLmZpbmQoJy53cmFwcGVyJykuZXEoMCkuY3NzKHtoZWlnaHQ6ICdhdXRvJ30pO1xuXHRcdFx0XHQkKHRoaXMpLmZpbmQoJy5jb250ZW50JykuZXEoMCkuY3NzKHtvcGFjaXR5OiAxfSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0JCh5YWhMaW5rKS5hZGRDbGFzcygneWFoJyk7XG5cdFx0XHR5YWhMaW5rLm9uY2xpY2sgPSBmdW5jdGlvbihlKXtlLnByZXZlbnREZWZhdWx0KCk7fTtcblx0XHR9KTtcblx0fVxufSkoKTtcblxuXG52YXIgcHVzaG1lbnUgPSAoZnVuY3Rpb24oKXtcblx0dmFyIGFsbFB1c2hNZW51cyA9IHt9O1xuXG5cdCQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG5cdFx0JCgnW2RhdGEtYXV0by1idXJnZXJdJykuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0dmFyIGNvbnRhaW5lciA9IHRoaXM7XG5cdFx0XHR2YXIgaWQgPSBjb250YWluZXIuZ2V0QXR0cmlidXRlKCdkYXRhLWF1dG8tYnVyZ2VyJyk7XG5cblx0XHRcdHZhciBhdXRvQnVyZ2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpIHx8IG5ld0RPTUVsZW1lbnQoJ2RpdicsICdwaS1wdXNobWVudScsIGlkKTtcblx0XHRcdHZhciB1bCA9IGF1dG9CdXJnZXIucXVlcnlTZWxlY3RvcigndWwnKSB8fCBuZXdET01FbGVtZW50KCd1bCcpO1xuXG5cdFx0XHQkKGNvbnRhaW5lcikuZmluZCgnYVtocmVmXSwgYnV0dG9uJykuZWFjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGlmICghYm9vbGVhbkF0dHJpYnV0ZVZhbHVlKHRoaXMsICdkYXRhLWF1dG8tYnVyZ2VyLWV4Y2x1ZGUnLCBmYWxzZSkpIHtcblx0XHRcdFx0XHR2YXIgY2xvbmUgPSB0aGlzLmNsb25lTm9kZSh0cnVlKTtcblx0XHRcdFx0XHRjbG9uZS5pZCA9ICcnO1xuXG5cdFx0XHRcdFx0aWYgKGNsb25lLnRhZ05hbWUgPT0gXCJCVVRUT05cIikge1xuXHRcdFx0XHRcdFx0dmFyIGFUYWcgPSBuZXdET01FbGVtZW50KCdhJyk7XG5cdFx0XHRcdFx0XHRhVGFnLmhyZWYgPSAnJztcblx0XHRcdFx0XHRcdGFUYWcuaW5uZXJIVE1MID0gY2xvbmUuaW5uZXJIVE1MO1xuXHRcdFx0XHRcdFx0YVRhZy5vbmNsaWNrID0gY2xvbmUub25jbGljaztcblx0XHRcdFx0XHRcdGNsb25lID0gYVRhZztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dmFyIGxpID0gbmV3RE9NRWxlbWVudCgnbGknKTtcblx0XHRcdFx0XHRsaS5hcHBlbmRDaGlsZChjbG9uZSk7XG5cdFx0XHRcdFx0dWwuYXBwZW5kQ2hpbGQobGkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0YXV0b0J1cmdlci5hcHBlbmRDaGlsZCh1bCk7XG5cdFx0XHRib2R5LmFwcGVuZChhdXRvQnVyZ2VyKTtcblx0XHR9KTtcblxuXHRcdCQoXCIucGktcHVzaG1lbnVcIikuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0YWxsUHVzaE1lbnVzW3RoaXMuaWRdID0gUHVzaE1lbnUodGhpcyk7XG5cdFx0fSk7XG5cdH0pO1xuXG5cdGZ1bmN0aW9uIHNob3cob2JqSWQpIHtcblx0XHRhbGxQdXNoTWVudXNbb2JqSWRdLmV4cG9zZSgpO1xuXHR9XG5cblx0ZnVuY3Rpb24gUHVzaE1lbnUoZWwpIHtcblx0XHR2YXIgaHRtbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2h0bWwnKTtcblxuXHRcdHZhciBvdmVybGF5ID0gbmV3RE9NRWxlbWVudCgnZGl2JywgJ292ZXJsYXknKTtcblx0XHR2YXIgY29udGVudCA9IG5ld0RPTUVsZW1lbnQoJ2RpdicsICdjb250ZW50Jyk7XG5cdFx0Y29udGVudC5hcHBlbmRDaGlsZChlbC5xdWVyeVNlbGVjdG9yKCcqJykpO1xuXG5cdFx0dmFyIHNpZGUgPSBlbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXNpZGVcIikgfHwgXCJyaWdodFwiO1xuXG5cdFx0dmFyIHNsZWQgPSBuZXdET01FbGVtZW50KCdkaXYnLCAnc2xlZCcpO1xuXHRcdCQoc2xlZCkuY3NzKHNpZGUsIDApO1xuXG5cdFx0dmFyIHRvcEJhciA9IG5ld0RPTUVsZW1lbnQoJ2RpdicsICd0b3AtYmFyJyk7XG5cdFx0Ly8gVE9ETzogYWRkIG1vZGFsIGNsb3NlIGJ1dHRvbiB0byB0b3BCYXJcblx0XHQvL3RvcEJhci5maWxsKM+ALm1vZGFsQ2xvc2VCdXR0b24oY2xvc2VNZSkpO1xuXG5cdFx0c2xlZC5hcHBlbmRDaGlsZCh0b3BCYXIpO1xuXHRcdHNsZWQuYXBwZW5kQ2hpbGQoY29udGVudCk7XG5cblx0XHRvdmVybGF5LmFwcGVuZENoaWxkKHNsZWQpO1xuXHRcdGVsLmlubmVySFRNTCA9ICcnO1xuXHRcdGVsLmFwcGVuZENoaWxkKG92ZXJsYXkpO1xuXG5cdFx0c2xlZC5vbmNsaWNrID0gZnVuY3Rpb24oZSl7XG5cdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdH07XG5cblx0XHRvdmVybGF5Lm9uY2xpY2sgPSBjbG9zZU1lO1xuXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGNsb3NlTWUpO1xuXG5cdFx0ZnVuY3Rpb24gY2xvc2VNZShlKSB7XG5cdFx0XHR2YXIgdCA9IGUudGFyZ2V0O1xuXHRcdFx0aWYgKHQgPT0gc2xlZCB8fCB0ID09IHRvcEJhcikgcmV0dXJuO1xuXG5cdFx0XHQkKGVsKS5yZW1vdmVDbGFzcygnb24nKTtcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0JChlbCkuY3NzKHtkaXNwbGF5OiAnbm9uZSd9KTtcblxuXHRcdFx0XHQkKGJvZHkpLnJlbW92ZUNsYXNzKCdvdmVybGF5LW9uJyk7XG5cdFx0XHR9LCAzMDApO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGV4cG9zZU1lKCl7XG5cdFx0XHQkKGJvZHkpLmFkZENsYXNzKCdvdmVybGF5LW9uJyk7IC8vIGluIHRoZSBkZWZhdWx0IGNvbmZpZywga2lsbHMgYm9keSBzY3JvbGxpbmdcblxuXHRcdFx0JChlbCkuY3NzKHtcblx0XHRcdFx0ZGlzcGxheTogJ2Jsb2NrJyxcblx0XHRcdFx0ekluZGV4OiBoaWdoZXN0WigpXG5cdFx0XHR9KTtcblxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHQkKGVsKS5hZGRDbGFzcygnb24nKTtcblx0XHRcdH0sIDEwKTtcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXhwb3NlOiBleHBvc2VNZVxuXHRcdH07XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdHNob3c6IHNob3dcblx0fTtcbn0pKCk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
