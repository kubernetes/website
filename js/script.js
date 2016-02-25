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
	var html, header, mainNav, quickstartButton, hero, encyclopedia, footer, wishField;

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
				if (e.currentTarget === wishField) {
					submitWish(wishField);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIs+ALWJhc2VDb21wb25lbnRzLmpzIiwic2NyaXB0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJzY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgLy9tb2RhbCBjbG9zZSBidXR0b25cbihmdW5jdGlvbigpe1xuXHQvL8+ALm1vZGFsQ2xvc2VCdXR0b24gPSBmdW5jdGlvbihjbG9zaW5nRnVuY3Rpb24pe1xuXHQvL1x0cmV0dXJuIM+ALmJ1dHRvbigncGktbW9kYWwtY2xvc2UtYnV0dG9uJywgbnVsbCwgbnVsbCwgY2xvc2luZ0Z1bmN0aW9uKTtcblx0Ly99O1xufSkoKTtcbiIsIi8vIGdsb2JhbHNcbnZhciBib2R5O1xuXG4vL2hlbHBlciBmdW5jdGlvbnNcbmZ1bmN0aW9uIGJvb2xlYW5BdHRyaWJ1dGVWYWx1ZShlbGVtZW50LCBhdHRyaWJ1dGUsIGRlZmF1bHRWYWx1ZSl7XG5cdC8vIHJldHVybnMgdHJ1ZSBpZiBhbiBhdHRyaWJ1dGUgaXMgcHJlc2VudCB3aXRoIG5vIHZhbHVlXG5cdC8vIGUuZy4gYm9vbGVhbkF0dHJpYnV0ZVZhbHVlKGVsZW1lbnQsICdkYXRhLW1vZGFsJywgZmFsc2UpO1xuXHRpZiAoZWxlbWVudC5oYXNBdHRyaWJ1dGUoYXR0cmlidXRlKSkge1xuXHRcdHZhciB2YWx1ZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZSk7XG5cdFx0aWYgKHZhbHVlID09PSAnJyB8fCB2YWx1ZSA9PT0gJ3RydWUnKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9IGVsc2UgaWYgKHZhbHVlID09PSAnZmFsc2UnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGRlZmF1bHRWYWx1ZTtcbn1cblxuZnVuY3Rpb24gY2xhc3NPbkNvbmRpdGlvbihlbGVtZW50LCBjbGFzc05hbWUsIGNvbmRpdGlvbikge1xuXHRpZiAoY29uZGl0aW9uKVxuXHRcdCQoZWxlbWVudCkuYWRkQ2xhc3MoY2xhc3NOYW1lKTtcblx0ZWxzZVxuXHRcdCQoZWxlbWVudCkucmVtb3ZlQ2xhc3MoY2xhc3NOYW1lKTtcbn1cblxuZnVuY3Rpb24gbmV3RE9NRWxlbWVudCh0YWcsIGNsYXNzTmFtZSwgaWQpe1xuXHR2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG5cblx0aWYgKGNsYXNzTmFtZSkgZWwuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuXHRpZiAoaWQpIGVsLmlkID0gaWQ7XG5cblx0cmV0dXJuIGVsO1xufVxuXG5mdW5jdGlvbiBweChuKXtcblx0cmV0dXJuIG4gKyAncHgnO1xufVxuXG52YXIga3ViID0gKGZ1bmN0aW9uICgpIHtcblx0dmFyIEhFQURFUl9IRUlHSFQ7XG5cdHZhciBodG1sLCBoZWFkZXIsIG1haW5OYXYsIHF1aWNrc3RhcnRCdXR0b24sIGhlcm8sIGVuY3ljbG9wZWRpYSwgZm9vdGVyLCB3aXNoRmllbGQ7XG5cblx0JChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuXHRcdGh0bWwgPSAkKCdodG1sJyk7XG5cdFx0Ym9keSA9ICQoJ2JvZHknKTtcblx0XHRoZWFkZXIgPSAkKCdoZWFkZXInKTtcblx0XHRtYWluTmF2ID0gJCgnI21haW5OYXYnKTtcblx0XHR3aXNoRmllbGQgPSAkKCcjd2lzaEZpZWxkJyk7XG5cdFx0cXVpY2tzdGFydEJ1dHRvbiA9ICQoJyNxdWlja3N0YXJ0QnV0dG9uJyk7XG5cdFx0aGVybyA9ICQoJyNoZXJvJyk7XG5cdFx0ZW5jeWNsb3BlZGlhID0gJCgnI2VuY3ljbG9wZWRpYScpO1xuXHRcdGZvb3RlciA9ICQoJ2Zvb3RlcicpO1xuXHRcdEhFQURFUl9IRUlHSFQgPSBoZWFkZXIub3V0ZXJIZWlnaHQoKTtcblxuXHRcdHJlc2V0VGhlVmlldygpO1xuXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2V0VGhlVmlldyk7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHJlc2V0VGhlVmlldyk7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlzdHJva2VzKTtcblx0XHR3aXNoRmllbGRbMF0uYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleXN0cm9rZXMpO1xuXG5cdFx0ZG9jdW1lbnQub251bmxvYWQgPSBmdW5jdGlvbigpe1xuXHRcdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2V0VGhlVmlldyk7XG5cdFx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgcmVzZXRUaGVWaWV3KTtcblx0XHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5c3Ryb2tlcyk7XG5cdFx0XHR3aXNoRmllbGRbMF0ucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleXN0cm9rZXMpO1xuXHRcdH07XG5cblx0XHQkKCcuZHJvcGRvd24nKS5lYWNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBkcm9wZG93biA9ICQodGhpcyk7XG5cdFx0XHR2YXIgcmVhZG91dCA9IGRyb3Bkb3duLmZpbmQoJy5yZWFkb3V0Jyk7XG5cblx0XHRcdGRyb3Bkb3duLmZpbmQoJ2EnKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmIChsb2NhdGlvbi5ocmVmLmluZGV4T2YodGhpcy5ocmVmKSAhPSAtMSkge1xuXHRcdFx0XHRcdHJlYWRvdXQuaHRtbCgkKHRoaXMpLmh0bWwoKSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRyZWFkb3V0LmNsaWNrKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0ZHJvcGRvd24udG9nZ2xlQ2xhc3MoJ29uJyk7XG5cdFx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlT3BlbkRyb3Bkb3duKTtcblxuXHRcdFx0XHRmdW5jdGlvbiBjbG9zZU9wZW5Ecm9wZG93bihlKSB7XG5cdFx0XHRcdFx0aWYgKGRyb3Bkb3duLmhhc0NsYXNzKCdvbicpICYmICEoZHJvcGRvd25XYXNDbGlja2VkKGUpKSkge1xuXHRcdFx0XHRcdFx0ZHJvcGRvd24ucmVtb3ZlQ2xhc3MoJ29uJyk7XG5cdFx0XHRcdFx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZU9wZW5Ecm9wZG93bik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZnVuY3Rpb24gZHJvcGRvd25XYXNDbGlja2VkKGUpIHtcblx0XHRcdFx0XHRyZXR1cm4gJChlLnRhcmdldCkucGFyZW50cygnLmRyb3Bkb3duJykubGVuZ3RoO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdHNldEludGVydmFsKHNldEZvb3RlclR5cGUsIDEwKTtcblx0fSk7XG5cblx0ZnVuY3Rpb24gc2V0Rm9vdGVyVHlwZSgpIHtcblx0XHRpZiAoaHRtbFswXS5pZCA9PSBcImRvY3NcIikge1xuXHRcdFx0dmFyIGJvZHlIZWlnaHQgPSBoZXJvLm91dGVySGVpZ2h0KCkgKyBlbmN5Y2xvcGVkaWEub3V0ZXJIZWlnaHQoKTtcblx0XHRcdHZhciBmb290ZXJIZWlnaHQgPSBmb290ZXIub3V0ZXJIZWlnaHQoKTtcblxuXHRcdFx0Y2xhc3NPbkNvbmRpdGlvbihib2R5LCAnZml4ZWQnLCB3aW5kb3cuaW5uZXJIZWlnaHQgLSBmb290ZXJIZWlnaHQgPiBib2R5SGVpZ2h0KTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiByZXNldFRoZVZpZXcoKSB7XG5cdFx0aWYgKGh0bWwuaGFzQ2xhc3MoJ29wZW4tbmF2JykpIHtcblx0XHRcdHRvZ2dsZU1lbnUoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0SEVBREVSX0hFSUdIVCA9IGhlYWRlci5vdXRlckhlaWdodCgpO1xuXHRcdH1cblxuXHRcdGNsYXNzT25Db25kaXRpb24oaHRtbCwgJ2ZsaXAtbmF2Jywgd2luZG93LnBhZ2VZT2Zmc2V0ID4gMCk7XG5cdH1cblxuXHRmdW5jdGlvbiB0b2dnbGVNZW51KCkge1xuXHRcdGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IDgwMCkge1xuXHRcdFx0cHVzaG1lbnUuc2hvdygncHJpbWFyeScpO1xuXHRcdH1cblxuXHRcdGVsc2Uge1xuXHRcdFx0dmFyIG5ld0hlaWdodCA9IEhFQURFUl9IRUlHSFQ7XG5cblx0XHRcdGlmICghaHRtbC5oYXNDbGFzcygnb3Blbi1uYXYnKSkge1xuXHRcdFx0XHRuZXdIZWlnaHQgPSBtYWluTmF2Lm91dGVySGVpZ2h0KCk7XG5cdFx0XHR9XG5cblx0XHRcdGhlYWRlci5jc3Moe2hlaWdodDogcHgobmV3SGVpZ2h0KX0pO1xuXHRcdFx0aHRtbC50b2dnbGVDbGFzcygnb3Blbi1uYXYnKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBzdWJtaXRXaXNoKHRleHRmaWVsZCkge1xuXHRcdHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKFwiaHR0cHM6Ly9naXRodWIuY29tL2t1YmVybmV0ZXMva3ViZXJuZXRlcy5naXRodWIuaW8vaXNzdWVzL25ldz90aXRsZT1JJTIwd2lzaCUyMFwiICtcblx0XHRcdHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArIFwiJTIwXCIgKyB0ZXh0ZmllbGQudmFsdWUgKyBcIiZib2R5PUklMjB3aXNoJTIwXCIgK1xuXHRcdFx0d2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgXCIlMjBcIiArIHRleHRmaWVsZC52YWx1ZSk7XG5cblx0XHR0ZXh0ZmllbGQudmFsdWUgPSAnJztcblx0XHR0ZXh0ZmllbGQuYmx1cigpO1xuXHR9XG5cblx0ZnVuY3Rpb24gaGFuZGxlS2V5c3Ryb2tlcyhlKSB7XG5cdFx0c3dpdGNoIChlLndoaWNoKSB7XG5cdFx0XHRjYXNlIDEzOiB7XG5cdFx0XHRcdGlmIChlLmN1cnJlbnRUYXJnZXQgPT09IHdpc2hGaWVsZCkge1xuXHRcdFx0XHRcdHN1Ym1pdFdpc2god2lzaEZpZWxkKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblxuXHRcdFx0Y2FzZSAyNzoge1xuXHRcdFx0XHRpZiAoaHRtbC5oYXNDbGFzcygnb3Blbi1uYXYnKSkge1xuXHRcdFx0XHRcdHRvZ2dsZU1lbnUoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdHRvZ2dsZU1lbnU6IHRvZ2dsZU1lbnVcblx0fTtcbn0pKCk7XG5cblxuLy8gYWNjb3JkaW9uXG4oZnVuY3Rpb24oKXtcblx0dmFyIHlhaCA9IHRydWU7XG5cdHZhciBtb3ZpbmcgPSBmYWxzZTtcblx0dmFyIENTU19CUk9XU0VSX0hBQ0tfREVMQVkgPSAyNTtcblxuXHQkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuXHRcdC8vIFNhZmFyaSBjaG9rZXMgb24gdGhlIGFuaW1hdGlvbiBoZXJlLCBzby4uLlxuXHRcdGlmIChuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ0Nocm9tZScpID09IC0xICYmIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignU2FmYXJpJykgIT0gLTEpe1xuXHRcdFx0dmFyIGhhY2tTdHlsZSA9IG5ld0RPTUVsZW1lbnQoJ3N0eWxlJyk7XG5cdFx0XHRoYWNrU3R5bGUuaW5uZXJIVE1MID0gJy5waS1hY2NvcmRpb24gLndyYXBwZXJ7dHJhbnNpdGlvbjogbm9uZX0nO1xuXHRcdFx0Ym9keS5hcHBlbmQoaGFja1N0eWxlKTtcblx0XHR9XG5cdFx0Ly8gR3Jvc3MuXG5cblx0XHQkKCcucGktYWNjb3JkaW9uJykuZWFjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgYWNjb3JkaW9uID0gdGhpcztcblx0XHRcdHZhciBjb250ZW50ID0gdGhpcy5pbm5lckhUTUw7XG5cdFx0XHR2YXIgY29udGFpbmVyID0gbmV3RE9NRWxlbWVudCgnZGl2JywgJ2NvbnRhaW5lcicpO1xuXHRcdFx0Y29udGFpbmVyLmlubmVySFRNTCA9IGNvbnRlbnQ7XG5cdFx0XHQkKGFjY29yZGlvbikuZW1wdHkoKTtcblx0XHRcdGFjY29yZGlvbi5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuXHRcdFx0Q29sbGFwc2VCb3goJChjb250YWluZXIpKTtcblx0XHR9KTtcblxuXHRcdHNldFlBSCgpO1xuXG5cdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHR5YWggPSBmYWxzZTtcblx0XHR9LCA1MDApO1xuXHR9KTtcblxuXHRmdW5jdGlvbiBDb2xsYXBzZUJveChjb250YWluZXIpe1xuXHRcdGNvbnRhaW5lci5jaGlsZHJlbignLml0ZW0nKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHQvLyBidWlsZCB0aGUgVE9DIERPTVxuXHRcdFx0Ly8gdGhlIGFuaW1hdGVkIG9wZW4vY2xvc2UgaXMgZW5hYmxlZCBieSBoYXZpbmcgZWFjaCBpdGVtJ3MgY29udGVudCBleGlzdCBpbiB0aGUgZmxvdywgYXQgaXRzIG5hdHVyYWwgaGVpZ2h0LFxuXHRcdFx0Ly8gZW5jbG9zZWQgaW4gYSB3cmFwcGVyIHdpdGggaGVpZ2h0ID0gMCB3aGVuIGNsb3NlZCwgYW5kIGhlaWdodCA9IGNvbnRlbnRIZWlnaHQgd2hlbiBvcGVuLlxuXHRcdFx0dmFyIGl0ZW0gPSB0aGlzO1xuXG5cdFx0XHQvLyBvbmx5IGFkZCBjb250ZW50IHdyYXBwZXJzIHRvIGNvbnRhaW5lcnMsIG5vdCB0byBsaW5rc1xuXHRcdFx0dmFyIGlzQ29udGFpbmVyID0gaXRlbS50YWdOYW1lID09PSAnRElWJztcblxuXHRcdFx0dmFyIHRpdGxlVGV4dCA9IGl0ZW0uZ2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJyk7XG5cdFx0XHR2YXIgdGl0bGUgPSBuZXdET01FbGVtZW50KCdkaXYnLCAndGl0bGUnKTtcblx0XHRcdHRpdGxlLmlubmVySFRNTCA9IHRpdGxlVGV4dDtcblxuXHRcdFx0dmFyIHdyYXBwZXIsIGNvbnRlbnQ7XG5cblx0XHRcdGlmIChpc0NvbnRhaW5lcikge1xuXHRcdFx0XHR3cmFwcGVyID0gbmV3RE9NRWxlbWVudCgnZGl2JywgJ3dyYXBwZXInKTtcblx0XHRcdFx0Y29udGVudCA9IG5ld0RPTUVsZW1lbnQoJ2RpdicsICdjb250ZW50Jyk7XG5cdFx0XHRcdGNvbnRlbnQuaW5uZXJIVE1MID0gaXRlbS5pbm5lckhUTUw7XG5cdFx0XHRcdHdyYXBwZXIuYXBwZW5kQ2hpbGQoY29udGVudCk7XG5cdFx0XHR9XG5cblx0XHRcdGl0ZW0uaW5uZXJIVE1MID0gJyc7XG5cdFx0XHRpdGVtLmFwcGVuZENoaWxkKHRpdGxlKTtcblxuXHRcdFx0aWYgKHdyYXBwZXIpIHtcblx0XHRcdFx0aXRlbS5hcHBlbmRDaGlsZCh3cmFwcGVyKTtcblx0XHRcdFx0JCh3cmFwcGVyKS5jc3Moe2hlaWdodDogMH0pO1xuXHRcdFx0fVxuXG5cblx0XHRcdCQodGl0bGUpLmNsaWNrKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmICgheWFoKSB7XG5cdFx0XHRcdFx0aWYgKG1vdmluZykgcmV0dXJuO1xuXHRcdFx0XHRcdG1vdmluZyA9IHRydWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoY29udGFpbmVyWzBdLmdldEF0dHJpYnV0ZSgnZGF0YS1zaW5nbGUnKSkge1xuXHRcdFx0XHRcdHZhciBvcGVuU2libGluZ3MgPSBpdGVtLnNpYmxpbmdzKCkuZmlsdGVyKGZ1bmN0aW9uKHNpYil7cmV0dXJuIHNpYi5oYXNDbGFzcygnb24nKTt9KTtcblx0XHRcdFx0XHRvcGVuU2libGluZ3MuZm9yRWFjaChmdW5jdGlvbihzaWJsaW5nKXtcblx0XHRcdFx0XHRcdHRvZ2dsZUl0ZW0oc2libGluZyk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0aWYgKCFpc0NvbnRhaW5lcikge1xuXHRcdFx0XHRcdFx0bW92aW5nID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRvZ2dsZUl0ZW0oaXRlbSk7XG5cdFx0XHRcdH0sIENTU19CUk9XU0VSX0hBQ0tfREVMQVkpO1xuXHRcdFx0fSk7XG5cblx0XHRcdGZ1bmN0aW9uIHRvZ2dsZUl0ZW0odGhpc0l0ZW0pe1xuXHRcdFx0XHR2YXIgdGhpc1dyYXBwZXIgPSAkKHRoaXNJdGVtKS5maW5kKCcud3JhcHBlcicpLmVxKDApO1xuXG5cdFx0XHRcdGlmICghdGhpc1dyYXBwZXIpIHJldHVybjtcblxuXHRcdFx0XHR2YXIgY29udGVudEhlaWdodCA9IHRoaXNXcmFwcGVyLmZpbmQoJy5jb250ZW50JykuZXEoMCkuaW5uZXJIZWlnaHQoKSArICdweCc7XG5cblx0XHRcdFx0aWYgKCQodGhpc0l0ZW0pLmhhc0NsYXNzKCdvbicpKSB7XG5cdFx0XHRcdFx0dGhpc1dyYXBwZXIuY3NzKHtoZWlnaHQ6IGNvbnRlbnRIZWlnaHR9KTtcblx0XHRcdFx0XHQkKHRoaXNJdGVtKS5yZW1vdmVDbGFzcygnb24nKTtcblxuXHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdHRoaXNXcmFwcGVyLmNzcyh7aGVpZ2h0OiAwfSk7XG5cdFx0XHRcdFx0XHRtb3ZpbmcgPSBmYWxzZTtcblx0XHRcdFx0XHR9LCBDU1NfQlJPV1NFUl9IQUNLX0RFTEFZKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkKGl0ZW0pLmFkZENsYXNzKCdvbicpO1xuXHRcdFx0XHRcdHRoaXNXcmFwcGVyLmNzcyh7aGVpZ2h0OiBjb250ZW50SGVpZ2h0fSk7XG5cblx0XHRcdFx0XHR2YXIgZHVyYXRpb24gPSBwYXJzZUZsb2F0KGdldENvbXB1dGVkU3R5bGUodGhpc1dyYXBwZXJbMF0pLnRyYW5zaXRpb25EdXJhdGlvbikgKiAxMDAwO1xuXG5cdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0dGhpc1dyYXBwZXIuY3NzKHtoZWlnaHQ6ICcnfSk7XG5cdFx0XHRcdFx0XHRtb3ZpbmcgPSBmYWxzZTtcblx0XHRcdFx0XHR9LCBkdXJhdGlvbik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKGNvbnRlbnQpIHtcblx0XHRcdFx0dmFyIGlubmVyQ29udGFpbmVycyA9ICQoY29udGVudCkuY2hpbGRyZW4oJy5jb250YWluZXInKTtcblx0XHRcdFx0aWYgKGlubmVyQ29udGFpbmVycy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0aW5uZXJDb250YWluZXJzLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdENvbGxhcHNlQm94KCQodGhpcykpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRZQUgoKSB7XG5cdFx0dmFyIHBhdGhuYW1lID0gbG9jYXRpb24uaHJlZi5zcGxpdCgnIycpWzBdOyAvLyBvbiBwYWdlIGxvYWQsIG1ha2Ugc3VyZSB0aGUgcGFnZSBpcyBZQUggZXZlbiBpZiB0aGVyZSdzIGEgaGFzaFxuXHRcdHZhciBjdXJyZW50TGlua3MgPSBbXTtcblxuXHRcdCQoJy5waS1hY2NvcmRpb24gYScpLmVhY2goZnVuY3Rpb24gKCkge1xuXHRcdFx0aWYgKHBhdGhuYW1lID09PSB0aGlzLmhyZWYpIGN1cnJlbnRMaW5rcy5wdXNoKHRoaXMpO1xuXHRcdH0pO1xuXG5cdFx0Y3VycmVudExpbmtzLmZvckVhY2goZnVuY3Rpb24gKHlhaExpbmspIHtcblx0XHRcdCQoeWFoTGluaykucGFyZW50cygnLml0ZW0nKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdCQodGhpcykuYWRkQ2xhc3MoJ29uJyk7XG5cdFx0XHRcdCQodGhpcykuZmluZCgnLndyYXBwZXInKS5lcSgwKS5jc3Moe2hlaWdodDogJ2F1dG8nfSk7XG5cdFx0XHRcdCQodGhpcykuZmluZCgnLmNvbnRlbnQnKS5lcSgwKS5jc3Moe29wYWNpdHk6IDF9KTtcblx0XHRcdH0pO1xuXG5cdFx0XHQkKHlhaExpbmspLmFkZENsYXNzKCd5YWgnKTtcblx0XHRcdHlhaExpbmsub25jbGljayA9IGZ1bmN0aW9uKGUpe2UucHJldmVudERlZmF1bHQoKTt9O1xuXHRcdH0pO1xuXHR9XG59KSgpO1xuXG5cbnZhciBwdXNobWVudSA9IChmdW5jdGlvbigpe1xuXHR2YXIgYWxsUHVzaE1lbnVzID0ge307XG5cblx0JChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcblx0XHQkKCdbZGF0YS1hdXRvLWJ1cmdlcl0nKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgY29udGFpbmVyID0gdGhpcztcblx0XHRcdHZhciBpZCA9IGNvbnRhaW5lci5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXV0by1idXJnZXInKTtcblxuXHRcdFx0dmFyIGF1dG9CdXJnZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkgfHwgbmV3RE9NRWxlbWVudCgnZGl2JywgJ3BpLXB1c2htZW51JywgaWQpO1xuXHRcdFx0dmFyIHVsID0gYXV0b0J1cmdlci5xdWVyeVNlbGVjdG9yKCd1bCcpIHx8IG5ld0RPTUVsZW1lbnQoJ3VsJyk7XG5cblx0XHRcdCQoY29udGFpbmVyKS5maW5kKCdhW2hyZWZdLCBidXR0b24nKS5lYWNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0aWYgKCFib29sZWFuQXR0cmlidXRlVmFsdWUodGhpcywgJ2RhdGEtYXV0by1idXJnZXItZXhjbHVkZScsIGZhbHNlKSkge1xuXHRcdFx0XHRcdHZhciBjbG9uZSA9IHRoaXMuY2xvbmVOb2RlKHRydWUpO1xuXHRcdFx0XHRcdGNsb25lLmlkID0gJyc7XG5cblx0XHRcdFx0XHRpZiAoY2xvbmUudGFnTmFtZSA9PSBcIkJVVFRPTlwiKSB7XG5cdFx0XHRcdFx0XHR2YXIgYVRhZyA9IG5ld0RPTUVsZW1lbnQoJ2EnKTtcblx0XHRcdFx0XHRcdGFUYWcuaHJlZiA9ICcnO1xuXHRcdFx0XHRcdFx0YVRhZy5pbm5lckhUTUwgPSBjbG9uZS5pbm5lckhUTUw7XG5cdFx0XHRcdFx0XHRhVGFnLm9uY2xpY2sgPSBjbG9uZS5vbmNsaWNrO1xuXHRcdFx0XHRcdFx0Y2xvbmUgPSBhVGFnO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR2YXIgbGkgPSBuZXdET01FbGVtZW50KCdsaScpO1xuXHRcdFx0XHRcdGxpLmFwcGVuZENoaWxkKGNsb25lKTtcblx0XHRcdFx0XHR1bC5hcHBlbmRDaGlsZChsaSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRhdXRvQnVyZ2VyLmFwcGVuZENoaWxkKHVsKTtcblx0XHRcdGJvZHkuYXBwZW5kKGF1dG9CdXJnZXIpO1xuXHRcdH0pO1xuXG5cdFx0JChcIi5waS1wdXNobWVudVwiKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRhbGxQdXNoTWVudXNbdGhpcy5pZF0gPSBQdXNoTWVudSh0aGlzKTtcblx0XHR9KTtcblx0fSk7XG5cblx0ZnVuY3Rpb24gc2hvdyhvYmpJZCkge1xuXHRcdGFsbFB1c2hNZW51c1tvYmpJZF0uZXhwb3NlKCk7XG5cdH1cblxuXHQvLyBUT0RPOiBkaXNtaXNzIG9uIGNsaWNrP1xuXHQvLyB0aGlzIHdvcmtzOlxuXG5cdC8vz4AoJy5waS1wdXNobWVudSBsaSBhJykuZm9yRWFjaChmdW5jdGlvbihhKXtcblx0Ly9cdGEub25jbGljayA9IGZ1bmN0aW9uKCl7XG5cdC8vXHRcdHRoaXMucGFyZW50KCcucGktcHVzaG1lbnUnKS7PgDEoJy5waS1tb2RhbC1jbG9zZS1idXR0b24nKS5jbGljaygpO1xuXHQvL1x0XHRjb25zb2xlLmxvZyhcIm1lc3NhZ2VcIik7XG5cdC8vXHR9O1xuXHQvL30pO1xuXG5cblx0ZnVuY3Rpb24gUHVzaE1lbnUoZWwpIHtcblx0XHR2YXIgaHRtbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2h0bWwnKTtcblxuXHRcdHZhciBvdmVybGF5ID0gbmV3RE9NRWxlbWVudCgnZGl2JywgJ292ZXJsYXknKTtcblx0XHR2YXIgY29udGVudCA9IG5ld0RPTUVsZW1lbnQoJ2RpdicsICdjb250ZW50Jyk7XG5cdFx0Y29udGVudC5hcHBlbmRDaGlsZChlbC5xdWVyeVNlbGVjdG9yKCcqJykpO1xuXG5cdFx0dmFyIHNpZGUgPSBlbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXNpZGVcIikgfHwgXCJyaWdodFwiO1xuXG5cdFx0dmFyIHNsZWQgPSBuZXdET01FbGVtZW50KCdkaXYnLCAnc2xlZCcpO1xuXHRcdCQoc2xlZCkuY3NzKHNpZGUsIDApO1xuXG5cdFx0dmFyIHRvcEJhciA9IG5ld0RPTUVsZW1lbnQoJ2RpdicsICd0b3AtYmFyJyk7XG5cdFx0Ly8gVE9ETzogYWRkIG1vZGFsIGNsb3NlIGJ1dHRvbiB0byB0b3BCYXJcblx0XHQvL3RvcEJhci5maWxsKM+ALm1vZGFsQ2xvc2VCdXR0b24oY2xvc2VNZSkpO1xuXG5cdFx0c2xlZC5hcHBlbmRDaGlsZCh0b3BCYXIpO1xuXHRcdHNsZWQuYXBwZW5kQ2hpbGQoY29udGVudCk7XG5cblx0XHRvdmVybGF5LmFwcGVuZENoaWxkKHNsZWQpO1xuXHRcdGVsLmlubmVySFRNTCA9ICcnO1xuXHRcdGVsLmFwcGVuZENoaWxkKG92ZXJsYXkpO1xuXG5cdFx0c2xlZC5vbmNsaWNrID0gZnVuY3Rpb24oZSl7XG5cdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdH07XG5cblx0XHRvdmVybGF5Lm9uY2xpY2sgPSBjbG9zZU1lO1xuXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGNsb3NlTWUpO1xuXG5cdFx0ZnVuY3Rpb24gY2xvc2VNZShlKSB7XG5cdFx0XHR2YXIgdCA9IGUudGFyZ2V0O1xuXHRcdFx0aWYgKHQgPT0gc2xlZCB8fCB0ID09IHRvcEJhcikgcmV0dXJuO1xuXG5cdFx0XHQkKGVsKS5yZW1vdmVDbGFzcygnb24nKTtcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0JChlbCkuY3NzKHtkaXNwbGF5OiAnbm9uZSd9KTtcblxuXHRcdFx0XHQkKGJvZHkpLnJlbW92ZUNsYXNzKCdvdmVybGF5LW9uJyk7XG5cdFx0XHR9LCAzMDApO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGV4cG9zZU1lKCl7XG5cdFx0XHQkKGJvZHkpLmFkZENsYXNzKCdvdmVybGF5LW9uJyk7IC8vIGluIHRoZSBkZWZhdWx0IGNvbmZpZywga2lsbHMgYm9keSBzY3JvbGxpbmdcblxuXHRcdFx0JChlbCkuY3NzKHtcblx0XHRcdFx0ZGlzcGxheTogJ2Jsb2NrJyxcblx0XHRcdFx0ekluZGV4OiA5OTk5OTk5OTlcblx0XHRcdH0pO1xuXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdCQoZWwpLmFkZENsYXNzKCdvbicpO1xuXHRcdFx0fSwgMTApO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHRleHBvc2U6IGV4cG9zZU1lXG5cdFx0fTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0c2hvdzogc2hvd1xuXHR9O1xufSkoKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
