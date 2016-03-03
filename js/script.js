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
		if (html[0].id == "docs") {
			var bodyHeight = hero.outerHeight() + encyclopedia.outerHeight();
			var footerHeight = footer.outerHeight();

			classOnCondition(body, 'fixed', window.innerHeight - footerHeight > bodyHeight);
		}
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

	return {
		toggleMenu: toggleMenu
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

	// TODO: dismiss on click?
	// this works:

	//π('.pi-pushmenu li a').forEach(function(a){
	//	a.onclick = function(){
	//		this.parent('.pi-pushmenu').π1('.pi-modal-close-button').click();
	//		console.log("message");
	//	};
	//});


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
				zIndex: 999999999
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIs+ALWJhc2VDb21wb25lbnRzLmpzIiwic2NyaXB0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJzY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgLy9tb2RhbCBjbG9zZSBidXR0b25cbihmdW5jdGlvbigpe1xuXHQvL8+ALm1vZGFsQ2xvc2VCdXR0b24gPSBmdW5jdGlvbihjbG9zaW5nRnVuY3Rpb24pe1xuXHQvL1x0cmV0dXJuIM+ALmJ1dHRvbigncGktbW9kYWwtY2xvc2UtYnV0dG9uJywgbnVsbCwgbnVsbCwgY2xvc2luZ0Z1bmN0aW9uKTtcblx0Ly99O1xufSkoKTtcbiIsIi8vIGdsb2JhbHNcbnZhciBib2R5O1xuXG4vL2hlbHBlciBmdW5jdGlvbnNcbmZ1bmN0aW9uIGJvb2xlYW5BdHRyaWJ1dGVWYWx1ZShlbGVtZW50LCBhdHRyaWJ1dGUsIGRlZmF1bHRWYWx1ZSl7XG5cdC8vIHJldHVybnMgdHJ1ZSBpZiBhbiBhdHRyaWJ1dGUgaXMgcHJlc2VudCB3aXRoIG5vIHZhbHVlXG5cdC8vIGUuZy4gYm9vbGVhbkF0dHJpYnV0ZVZhbHVlKGVsZW1lbnQsICdkYXRhLW1vZGFsJywgZmFsc2UpO1xuXHRpZiAoZWxlbWVudC5oYXNBdHRyaWJ1dGUoYXR0cmlidXRlKSkge1xuXHRcdHZhciB2YWx1ZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZSk7XG5cdFx0aWYgKHZhbHVlID09PSAnJyB8fCB2YWx1ZSA9PT0gJ3RydWUnKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9IGVsc2UgaWYgKHZhbHVlID09PSAnZmFsc2UnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGRlZmF1bHRWYWx1ZTtcbn1cblxuZnVuY3Rpb24gY2xhc3NPbkNvbmRpdGlvbihlbGVtZW50LCBjbGFzc05hbWUsIGNvbmRpdGlvbikge1xuXHRpZiAoY29uZGl0aW9uKVxuXHRcdCQoZWxlbWVudCkuYWRkQ2xhc3MoY2xhc3NOYW1lKTtcblx0ZWxzZVxuXHRcdCQoZWxlbWVudCkucmVtb3ZlQ2xhc3MoY2xhc3NOYW1lKTtcbn1cblxuZnVuY3Rpb24gbmV3RE9NRWxlbWVudCh0YWcsIGNsYXNzTmFtZSwgaWQpe1xuXHR2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG5cblx0aWYgKGNsYXNzTmFtZSkgZWwuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuXHRpZiAoaWQpIGVsLmlkID0gaWQ7XG5cblx0cmV0dXJuIGVsO1xufVxuXG5mdW5jdGlvbiBweChuKXtcblx0cmV0dXJuIG4gKyAncHgnO1xufVxuXG52YXIga3ViID0gKGZ1bmN0aW9uICgpIHtcblx0dmFyIEhFQURFUl9IRUlHSFQ7XG5cdHZhciBodG1sLCBoZWFkZXIsIG1haW5OYXYsIHF1aWNrc3RhcnRCdXR0b24sIGhlcm8sIGVuY3ljbG9wZWRpYSwgZm9vdGVyLCB3aXNoRmllbGQsIGhlYWRsaW5lV3JhcHBlcjtcblxuXHQkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG5cdFx0aHRtbCA9ICQoJ2h0bWwnKTtcblx0XHRib2R5ID0gJCgnYm9keScpO1xuXHRcdGhlYWRlciA9ICQoJ2hlYWRlcicpO1xuXHRcdG1haW5OYXYgPSAkKCcjbWFpbk5hdicpO1xuXHRcdHdpc2hGaWVsZCA9ICQoJyN3aXNoRmllbGQnKTtcblx0XHRxdWlja3N0YXJ0QnV0dG9uID0gJCgnI3F1aWNrc3RhcnRCdXR0b24nKTtcblx0XHRoZXJvID0gJCgnI2hlcm8nKTtcblx0XHRlbmN5Y2xvcGVkaWEgPSAkKCcjZW5jeWNsb3BlZGlhJyk7XG5cdFx0Zm9vdGVyID0gJCgnZm9vdGVyJyk7XG5cdFx0aGVhZGxpbmVXcmFwcGVyID0gJCgnI2hlYWRsaW5lV3JhcHBlcicpO1xuXHRcdEhFQURFUl9IRUlHSFQgPSBoZWFkZXIub3V0ZXJIZWlnaHQoKTtcblxuXHRcdHJlc2V0VGhlVmlldygpO1xuXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2V0VGhlVmlldyk7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHJlc2V0VGhlVmlldyk7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlzdHJva2VzKTtcblx0XHR3aXNoRmllbGRbMF0uYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleXN0cm9rZXMpO1xuXG5cdFx0ZG9jdW1lbnQub251bmxvYWQgPSBmdW5jdGlvbigpe1xuXHRcdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2V0VGhlVmlldyk7XG5cdFx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgcmVzZXRUaGVWaWV3KTtcblx0XHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5c3Ryb2tlcyk7XG5cdFx0XHR3aXNoRmllbGRbMF0ucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleXN0cm9rZXMpO1xuXHRcdH07XG5cblx0XHQkKCcuZHJvcGRvd24nKS5lYWNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBkcm9wZG93biA9ICQodGhpcyk7XG5cdFx0XHR2YXIgcmVhZG91dCA9IGRyb3Bkb3duLmZpbmQoJy5yZWFkb3V0Jyk7XG5cblx0XHRcdGRyb3Bkb3duLmZpbmQoJ2EnKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmIChsb2NhdGlvbi5ocmVmLmluZGV4T2YodGhpcy5ocmVmKSAhPSAtMSkge1xuXHRcdFx0XHRcdHJlYWRvdXQuaHRtbCgkKHRoaXMpLmh0bWwoKSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRyZWFkb3V0LmNsaWNrKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0ZHJvcGRvd24udG9nZ2xlQ2xhc3MoJ29uJyk7XG5cdFx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlT3BlbkRyb3Bkb3duKTtcblxuXHRcdFx0XHRmdW5jdGlvbiBjbG9zZU9wZW5Ecm9wZG93bihlKSB7XG5cdFx0XHRcdFx0aWYgKGRyb3Bkb3duLmhhc0NsYXNzKCdvbicpICYmICEoZHJvcGRvd25XYXNDbGlja2VkKGUpKSkge1xuXHRcdFx0XHRcdFx0ZHJvcGRvd24ucmVtb3ZlQ2xhc3MoJ29uJyk7XG5cdFx0XHRcdFx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZU9wZW5Ecm9wZG93bik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZnVuY3Rpb24gZHJvcGRvd25XYXNDbGlja2VkKGUpIHtcblx0XHRcdFx0XHRyZXR1cm4gJChlLnRhcmdldCkucGFyZW50cygnLmRyb3Bkb3duJykubGVuZ3RoO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdHNldEludGVydmFsKHNldEZvb3RlclR5cGUsIDEwKTtcblx0fSk7XG5cblx0ZnVuY3Rpb24gc2V0Rm9vdGVyVHlwZSgpIHtcblx0XHRpZiAoaHRtbFswXS5pZCA9PSBcImRvY3NcIikge1xuXHRcdFx0dmFyIGJvZHlIZWlnaHQgPSBoZXJvLm91dGVySGVpZ2h0KCkgKyBlbmN5Y2xvcGVkaWEub3V0ZXJIZWlnaHQoKTtcblx0XHRcdHZhciBmb290ZXJIZWlnaHQgPSBmb290ZXIub3V0ZXJIZWlnaHQoKTtcblxuXHRcdFx0Y2xhc3NPbkNvbmRpdGlvbihib2R5LCAnZml4ZWQnLCB3aW5kb3cuaW5uZXJIZWlnaHQgLSBmb290ZXJIZWlnaHQgPiBib2R5SGVpZ2h0KTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiByZXNldFRoZVZpZXcoKSB7XG5cdFx0aWYgKGh0bWwuaGFzQ2xhc3MoJ29wZW4tbmF2JykpIHtcblx0XHRcdHRvZ2dsZU1lbnUoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0SEVBREVSX0hFSUdIVCA9IGhlYWRlci5vdXRlckhlaWdodCgpO1xuXHRcdH1cblxuXHRcdGNsYXNzT25Db25kaXRpb24oaHRtbCwgJ2ZsaXAtbmF2Jywgd2luZG93LnBhZ2VZT2Zmc2V0ID4gMCk7XG5cblx0XHRpZiAoaHRtbFswXS5pZCA9PSAnaG9tZScpIHtcblx0XHRcdHNldEhvbWVIZWFkZXJTdHlsZXMoKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRIb21lSGVhZGVyU3R5bGVzKCkge1xuXHRcdHZhciBZID0gd2luZG93LnBhZ2VZT2Zmc2V0O1xuXHRcdHZhciBxdWlja3N0YXJ0Qm90dG9tID0gcXVpY2tzdGFydEJ1dHRvblswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5ib3R0b207XG5cblx0XHRjbGFzc09uQ29uZGl0aW9uKGh0bWxbMF0sICd5LWVub3VnaCcsIFkgPiBxdWlja3N0YXJ0Qm90dG9tKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHRvZ2dsZU1lbnUoKSB7XG5cdFx0aWYgKHdpbmRvdy5pbm5lcldpZHRoIDwgODAwKSB7XG5cdFx0XHRwdXNobWVudS5zaG93KCdwcmltYXJ5Jyk7XG5cdFx0fVxuXG5cdFx0ZWxzZSB7XG5cdFx0XHR2YXIgbmV3SGVpZ2h0ID0gSEVBREVSX0hFSUdIVDtcblxuXHRcdFx0aWYgKCFodG1sLmhhc0NsYXNzKCdvcGVuLW5hdicpKSB7XG5cdFx0XHRcdG5ld0hlaWdodCA9IG1haW5OYXYub3V0ZXJIZWlnaHQoKTtcblx0XHRcdH1cblxuXHRcdFx0aGVhZGVyLmNzcyh7aGVpZ2h0OiBweChuZXdIZWlnaHQpfSk7XG5cdFx0XHRodG1sLnRvZ2dsZUNsYXNzKCdvcGVuLW5hdicpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHN1Ym1pdFdpc2godGV4dGZpZWxkKSB7XG5cdFx0d2luZG93LmxvY2F0aW9uLnJlcGxhY2UoXCJodHRwczovL2dpdGh1Yi5jb20va3ViZXJuZXRlcy9rdWJlcm5ldGVzLmdpdGh1Yi5pby9pc3N1ZXMvbmV3P3RpdGxlPUklMjB3aXNoJTIwXCIgK1xuXHRcdFx0d2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgXCIlMjBcIiArIHRleHRmaWVsZC52YWx1ZSArIFwiJmJvZHk9SSUyMHdpc2glMjBcIiArXG5cdFx0XHR3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyBcIiUyMFwiICsgdGV4dGZpZWxkLnZhbHVlKTtcblxuXHRcdHRleHRmaWVsZC52YWx1ZSA9ICcnO1xuXHRcdHRleHRmaWVsZC5ibHVyKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBoYW5kbGVLZXlzdHJva2VzKGUpIHtcblx0XHRzd2l0Y2ggKGUud2hpY2gpIHtcblx0XHRcdGNhc2UgMTM6IHtcblx0XHRcdFx0aWYgKGUuY3VycmVudFRhcmdldCA9PT0gd2lzaEZpZWxkWzBdKSB7XG5cdFx0XHRcdFx0c3VibWl0V2lzaCh3aXNoRmllbGRbMF0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHRjYXNlIDI3OiB7XG5cdFx0XHRcdGlmIChodG1sLmhhc0NsYXNzKCdvcGVuLW5hdicpKSB7XG5cdFx0XHRcdFx0dG9nZ2xlTWVudSgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB7XG5cdFx0dG9nZ2xlTWVudTogdG9nZ2xlTWVudVxuXHR9O1xufSkoKTtcblxuXG4vLyBhY2NvcmRpb25cbihmdW5jdGlvbigpe1xuXHR2YXIgeWFoID0gdHJ1ZTtcblx0dmFyIG1vdmluZyA9IGZhbHNlO1xuXHR2YXIgQ1NTX0JST1dTRVJfSEFDS19ERUxBWSA9IDI1O1xuXG5cdCQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG5cdFx0Ly8gU2FmYXJpIGNob2tlcyBvbiB0aGUgYW5pbWF0aW9uIGhlcmUsIHNvLi4uXG5cdFx0aWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignQ2hyb21lJykgPT0gLTEgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdTYWZhcmknKSAhPSAtMSl7XG5cdFx0XHR2YXIgaGFja1N0eWxlID0gbmV3RE9NRWxlbWVudCgnc3R5bGUnKTtcblx0XHRcdGhhY2tTdHlsZS5pbm5lckhUTUwgPSAnLnBpLWFjY29yZGlvbiAud3JhcHBlcnt0cmFuc2l0aW9uOiBub25lfSc7XG5cdFx0XHRib2R5LmFwcGVuZChoYWNrU3R5bGUpO1xuXHRcdH1cblx0XHQvLyBHcm9zcy5cblxuXHRcdCQoJy5waS1hY2NvcmRpb24nKS5lYWNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBhY2NvcmRpb24gPSB0aGlzO1xuXHRcdFx0dmFyIGNvbnRlbnQgPSB0aGlzLmlubmVySFRNTDtcblx0XHRcdHZhciBjb250YWluZXIgPSBuZXdET01FbGVtZW50KCdkaXYnLCAnY29udGFpbmVyJyk7XG5cdFx0XHRjb250YWluZXIuaW5uZXJIVE1MID0gY29udGVudDtcblx0XHRcdCQoYWNjb3JkaW9uKS5lbXB0eSgpO1xuXHRcdFx0YWNjb3JkaW9uLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG5cdFx0XHRDb2xsYXBzZUJveCgkKGNvbnRhaW5lcikpO1xuXHRcdH0pO1xuXG5cdFx0c2V0WUFIKCk7XG5cblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdHlhaCA9IGZhbHNlO1xuXHRcdH0sIDUwMCk7XG5cdH0pO1xuXG5cdGZ1bmN0aW9uIENvbGxhcHNlQm94KGNvbnRhaW5lcil7XG5cdFx0Y29udGFpbmVyLmNoaWxkcmVuKCcuaXRlbScpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdC8vIGJ1aWxkIHRoZSBUT0MgRE9NXG5cdFx0XHQvLyB0aGUgYW5pbWF0ZWQgb3Blbi9jbG9zZSBpcyBlbmFibGVkIGJ5IGhhdmluZyBlYWNoIGl0ZW0ncyBjb250ZW50IGV4aXN0IGluIHRoZSBmbG93LCBhdCBpdHMgbmF0dXJhbCBoZWlnaHQsXG5cdFx0XHQvLyBlbmNsb3NlZCBpbiBhIHdyYXBwZXIgd2l0aCBoZWlnaHQgPSAwIHdoZW4gY2xvc2VkLCBhbmQgaGVpZ2h0ID0gY29udGVudEhlaWdodCB3aGVuIG9wZW4uXG5cdFx0XHR2YXIgaXRlbSA9IHRoaXM7XG5cblx0XHRcdC8vIG9ubHkgYWRkIGNvbnRlbnQgd3JhcHBlcnMgdG8gY29udGFpbmVycywgbm90IHRvIGxpbmtzXG5cdFx0XHR2YXIgaXNDb250YWluZXIgPSBpdGVtLnRhZ05hbWUgPT09ICdESVYnO1xuXG5cdFx0XHR2YXIgdGl0bGVUZXh0ID0gaXRlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKTtcblx0XHRcdHZhciB0aXRsZSA9IG5ld0RPTUVsZW1lbnQoJ2RpdicsICd0aXRsZScpO1xuXHRcdFx0dGl0bGUuaW5uZXJIVE1MID0gdGl0bGVUZXh0O1xuXG5cdFx0XHR2YXIgd3JhcHBlciwgY29udGVudDtcblxuXHRcdFx0aWYgKGlzQ29udGFpbmVyKSB7XG5cdFx0XHRcdHdyYXBwZXIgPSBuZXdET01FbGVtZW50KCdkaXYnLCAnd3JhcHBlcicpO1xuXHRcdFx0XHRjb250ZW50ID0gbmV3RE9NRWxlbWVudCgnZGl2JywgJ2NvbnRlbnQnKTtcblx0XHRcdFx0Y29udGVudC5pbm5lckhUTUwgPSBpdGVtLmlubmVySFRNTDtcblx0XHRcdFx0d3JhcHBlci5hcHBlbmRDaGlsZChjb250ZW50KTtcblx0XHRcdH1cblxuXHRcdFx0aXRlbS5pbm5lckhUTUwgPSAnJztcblx0XHRcdGl0ZW0uYXBwZW5kQ2hpbGQodGl0bGUpO1xuXG5cdFx0XHRpZiAod3JhcHBlcikge1xuXHRcdFx0XHRpdGVtLmFwcGVuZENoaWxkKHdyYXBwZXIpO1xuXHRcdFx0XHQkKHdyYXBwZXIpLmNzcyh7aGVpZ2h0OiAwfSk7XG5cdFx0XHR9XG5cblxuXHRcdFx0JCh0aXRsZSkuY2xpY2soZnVuY3Rpb24oKXtcblx0XHRcdFx0aWYgKCF5YWgpIHtcblx0XHRcdFx0XHRpZiAobW92aW5nKSByZXR1cm47XG5cdFx0XHRcdFx0bW92aW5nID0gdHJ1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChjb250YWluZXJbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLXNpbmdsZScpKSB7XG5cdFx0XHRcdFx0dmFyIG9wZW5TaWJsaW5ncyA9IGl0ZW0uc2libGluZ3MoKS5maWx0ZXIoZnVuY3Rpb24oc2liKXtyZXR1cm4gc2liLmhhc0NsYXNzKCdvbicpO30pO1xuXHRcdFx0XHRcdG9wZW5TaWJsaW5ncy5mb3JFYWNoKGZ1bmN0aW9uKHNpYmxpbmcpe1xuXHRcdFx0XHRcdFx0dG9nZ2xlSXRlbShzaWJsaW5nKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRpZiAoIWlzQ29udGFpbmVyKSB7XG5cdFx0XHRcdFx0XHRtb3ZpbmcgPSBmYWxzZTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dG9nZ2xlSXRlbShpdGVtKTtcblx0XHRcdFx0fSwgQ1NTX0JST1dTRVJfSEFDS19ERUxBWSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0ZnVuY3Rpb24gdG9nZ2xlSXRlbSh0aGlzSXRlbSl7XG5cdFx0XHRcdHZhciB0aGlzV3JhcHBlciA9ICQodGhpc0l0ZW0pLmZpbmQoJy53cmFwcGVyJykuZXEoMCk7XG5cblx0XHRcdFx0aWYgKCF0aGlzV3JhcHBlcikgcmV0dXJuO1xuXG5cdFx0XHRcdHZhciBjb250ZW50SGVpZ2h0ID0gdGhpc1dyYXBwZXIuZmluZCgnLmNvbnRlbnQnKS5lcSgwKS5pbm5lckhlaWdodCgpICsgJ3B4JztcblxuXHRcdFx0XHRpZiAoJCh0aGlzSXRlbSkuaGFzQ2xhc3MoJ29uJykpIHtcblx0XHRcdFx0XHR0aGlzV3JhcHBlci5jc3Moe2hlaWdodDogY29udGVudEhlaWdodH0pO1xuXHRcdFx0XHRcdCQodGhpc0l0ZW0pLnJlbW92ZUNsYXNzKCdvbicpO1xuXG5cdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0dGhpc1dyYXBwZXIuY3NzKHtoZWlnaHQ6IDB9KTtcblx0XHRcdFx0XHRcdG1vdmluZyA9IGZhbHNlO1xuXHRcdFx0XHRcdH0sIENTU19CUk9XU0VSX0hBQ0tfREVMQVkpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCQoaXRlbSkuYWRkQ2xhc3MoJ29uJyk7XG5cdFx0XHRcdFx0dGhpc1dyYXBwZXIuY3NzKHtoZWlnaHQ6IGNvbnRlbnRIZWlnaHR9KTtcblxuXHRcdFx0XHRcdHZhciBkdXJhdGlvbiA9IHBhcnNlRmxvYXQoZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzV3JhcHBlclswXSkudHJhbnNpdGlvbkR1cmF0aW9uKSAqIDEwMDA7XG5cblx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHR0aGlzV3JhcHBlci5jc3Moe2hlaWdodDogJyd9KTtcblx0XHRcdFx0XHRcdG1vdmluZyA9IGZhbHNlO1xuXHRcdFx0XHRcdH0sIGR1cmF0aW9uKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoY29udGVudCkge1xuXHRcdFx0XHR2YXIgaW5uZXJDb250YWluZXJzID0gJChjb250ZW50KS5jaGlsZHJlbignLmNvbnRhaW5lcicpO1xuXHRcdFx0XHRpZiAoaW5uZXJDb250YWluZXJzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRpbm5lckNvbnRhaW5lcnMuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0Q29sbGFwc2VCb3goJCh0aGlzKSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNldFlBSCgpIHtcblx0XHR2YXIgcGF0aG5hbWUgPSBsb2NhdGlvbi5ocmVmLnNwbGl0KCcjJylbMF07IC8vIG9uIHBhZ2UgbG9hZCwgbWFrZSBzdXJlIHRoZSBwYWdlIGlzIFlBSCBldmVuIGlmIHRoZXJlJ3MgYSBoYXNoXG5cdFx0dmFyIGN1cnJlbnRMaW5rcyA9IFtdO1xuXG5cdFx0JCgnLnBpLWFjY29yZGlvbiBhJykuZWFjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAocGF0aG5hbWUgPT09IHRoaXMuaHJlZikgY3VycmVudExpbmtzLnB1c2godGhpcyk7XG5cdFx0fSk7XG5cblx0XHRjdXJyZW50TGlua3MuZm9yRWFjaChmdW5jdGlvbiAoeWFoTGluaykge1xuXHRcdFx0JCh5YWhMaW5rKS5wYXJlbnRzKCcuaXRlbScpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdFx0JCh0aGlzKS5hZGRDbGFzcygnb24nKTtcblx0XHRcdFx0JCh0aGlzKS5maW5kKCcud3JhcHBlcicpLmVxKDApLmNzcyh7aGVpZ2h0OiAnYXV0byd9KTtcblx0XHRcdFx0JCh0aGlzKS5maW5kKCcuY29udGVudCcpLmVxKDApLmNzcyh7b3BhY2l0eTogMX0pO1xuXHRcdFx0fSk7XG5cblx0XHRcdCQoeWFoTGluaykuYWRkQ2xhc3MoJ3lhaCcpO1xuXHRcdFx0eWFoTGluay5vbmNsaWNrID0gZnVuY3Rpb24oZSl7ZS5wcmV2ZW50RGVmYXVsdCgpO307XG5cdFx0fSk7XG5cdH1cbn0pKCk7XG5cblxudmFyIHB1c2htZW51ID0gKGZ1bmN0aW9uKCl7XG5cdHZhciBhbGxQdXNoTWVudXMgPSB7fTtcblxuXHQkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuXHRcdCQoJ1tkYXRhLWF1dG8tYnVyZ2VyXScpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdHZhciBjb250YWluZXIgPSB0aGlzO1xuXHRcdFx0dmFyIGlkID0gY29udGFpbmVyLmdldEF0dHJpYnV0ZSgnZGF0YS1hdXRvLWJ1cmdlcicpO1xuXG5cdFx0XHR2YXIgYXV0b0J1cmdlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSB8fCBuZXdET01FbGVtZW50KCdkaXYnLCAncGktcHVzaG1lbnUnLCBpZCk7XG5cdFx0XHR2YXIgdWwgPSBhdXRvQnVyZ2VyLnF1ZXJ5U2VsZWN0b3IoJ3VsJykgfHwgbmV3RE9NRWxlbWVudCgndWwnKTtcblxuXHRcdFx0JChjb250YWluZXIpLmZpbmQoJ2FbaHJlZl0sIGJ1dHRvbicpLmVhY2goZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRpZiAoIWJvb2xlYW5BdHRyaWJ1dGVWYWx1ZSh0aGlzLCAnZGF0YS1hdXRvLWJ1cmdlci1leGNsdWRlJywgZmFsc2UpKSB7XG5cdFx0XHRcdFx0dmFyIGNsb25lID0gdGhpcy5jbG9uZU5vZGUodHJ1ZSk7XG5cdFx0XHRcdFx0Y2xvbmUuaWQgPSAnJztcblxuXHRcdFx0XHRcdGlmIChjbG9uZS50YWdOYW1lID09IFwiQlVUVE9OXCIpIHtcblx0XHRcdFx0XHRcdHZhciBhVGFnID0gbmV3RE9NRWxlbWVudCgnYScpO1xuXHRcdFx0XHRcdFx0YVRhZy5ocmVmID0gJyc7XG5cdFx0XHRcdFx0XHRhVGFnLmlubmVySFRNTCA9IGNsb25lLmlubmVySFRNTDtcblx0XHRcdFx0XHRcdGFUYWcub25jbGljayA9IGNsb25lLm9uY2xpY2s7XG5cdFx0XHRcdFx0XHRjbG9uZSA9IGFUYWc7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHZhciBsaSA9IG5ld0RPTUVsZW1lbnQoJ2xpJyk7XG5cdFx0XHRcdFx0bGkuYXBwZW5kQ2hpbGQoY2xvbmUpO1xuXHRcdFx0XHRcdHVsLmFwcGVuZENoaWxkKGxpKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdGF1dG9CdXJnZXIuYXBwZW5kQ2hpbGQodWwpO1xuXHRcdFx0Ym9keS5hcHBlbmQoYXV0b0J1cmdlcik7XG5cdFx0fSk7XG5cblx0XHQkKFwiLnBpLXB1c2htZW51XCIpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdGFsbFB1c2hNZW51c1t0aGlzLmlkXSA9IFB1c2hNZW51KHRoaXMpO1xuXHRcdH0pO1xuXHR9KTtcblxuXHRmdW5jdGlvbiBzaG93KG9iaklkKSB7XG5cdFx0YWxsUHVzaE1lbnVzW29iaklkXS5leHBvc2UoKTtcblx0fVxuXG5cdC8vIFRPRE86IGRpc21pc3Mgb24gY2xpY2s/XG5cdC8vIHRoaXMgd29ya3M6XG5cblx0Ly/PgCgnLnBpLXB1c2htZW51IGxpIGEnKS5mb3JFYWNoKGZ1bmN0aW9uKGEpe1xuXHQvL1x0YS5vbmNsaWNrID0gZnVuY3Rpb24oKXtcblx0Ly9cdFx0dGhpcy5wYXJlbnQoJy5waS1wdXNobWVudScpLs+AMSgnLnBpLW1vZGFsLWNsb3NlLWJ1dHRvbicpLmNsaWNrKCk7XG5cdC8vXHRcdGNvbnNvbGUubG9nKFwibWVzc2FnZVwiKTtcblx0Ly9cdH07XG5cdC8vfSk7XG5cblxuXHRmdW5jdGlvbiBQdXNoTWVudShlbCkge1xuXHRcdHZhciBodG1sID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaHRtbCcpO1xuXG5cdFx0dmFyIG92ZXJsYXkgPSBuZXdET01FbGVtZW50KCdkaXYnLCAnb3ZlcmxheScpO1xuXHRcdHZhciBjb250ZW50ID0gbmV3RE9NRWxlbWVudCgnZGl2JywgJ2NvbnRlbnQnKTtcblx0XHRjb250ZW50LmFwcGVuZENoaWxkKGVsLnF1ZXJ5U2VsZWN0b3IoJyonKSk7XG5cblx0XHR2YXIgc2lkZSA9IGVsLmdldEF0dHJpYnV0ZShcImRhdGEtc2lkZVwiKSB8fCBcInJpZ2h0XCI7XG5cblx0XHR2YXIgc2xlZCA9IG5ld0RPTUVsZW1lbnQoJ2RpdicsICdzbGVkJyk7XG5cdFx0JChzbGVkKS5jc3Moc2lkZSwgMCk7XG5cblx0XHR2YXIgdG9wQmFyID0gbmV3RE9NRWxlbWVudCgnZGl2JywgJ3RvcC1iYXInKTtcblx0XHQvLyBUT0RPOiBhZGQgbW9kYWwgY2xvc2UgYnV0dG9uIHRvIHRvcEJhclxuXHRcdC8vdG9wQmFyLmZpbGwoz4AubW9kYWxDbG9zZUJ1dHRvbihjbG9zZU1lKSk7XG5cblx0XHRzbGVkLmFwcGVuZENoaWxkKHRvcEJhcik7XG5cdFx0c2xlZC5hcHBlbmRDaGlsZChjb250ZW50KTtcblxuXHRcdG92ZXJsYXkuYXBwZW5kQ2hpbGQoc2xlZCk7XG5cdFx0ZWwuaW5uZXJIVE1MID0gJyc7XG5cdFx0ZWwuYXBwZW5kQ2hpbGQob3ZlcmxheSk7XG5cblx0XHRzbGVkLm9uY2xpY2sgPSBmdW5jdGlvbihlKXtcblx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0fTtcblxuXHRcdG92ZXJsYXkub25jbGljayA9IGNsb3NlTWU7XG5cblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgY2xvc2VNZSk7XG5cblx0XHRmdW5jdGlvbiBjbG9zZU1lKGUpIHtcblx0XHRcdHZhciB0ID0gZS50YXJnZXQ7XG5cdFx0XHRpZiAodCA9PSBzbGVkIHx8IHQgPT0gdG9wQmFyKSByZXR1cm47XG5cblx0XHRcdCQoZWwpLnJlbW92ZUNsYXNzKCdvbicpO1xuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHQkKGVsKS5jc3Moe2Rpc3BsYXk6ICdub25lJ30pO1xuXG5cdFx0XHRcdCQoYm9keSkucmVtb3ZlQ2xhc3MoJ292ZXJsYXktb24nKTtcblx0XHRcdH0sIDMwMCk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZXhwb3NlTWUoKXtcblx0XHRcdCQoYm9keSkuYWRkQ2xhc3MoJ292ZXJsYXktb24nKTsgLy8gaW4gdGhlIGRlZmF1bHQgY29uZmlnLCBraWxscyBib2R5IHNjcm9sbGluZ1xuXG5cdFx0XHQkKGVsKS5jc3Moe1xuXHRcdFx0XHRkaXNwbGF5OiAnYmxvY2snLFxuXHRcdFx0XHR6SW5kZXg6IDk5OTk5OTk5OVxuXHRcdFx0fSk7XG5cblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0JChlbCkuYWRkQ2xhc3MoJ29uJyk7XG5cdFx0XHR9LCAxMCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4cG9zZTogZXhwb3NlTWVcblx0XHR9O1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRzaG93OiBzaG93XG5cdH07XG59KSgpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
