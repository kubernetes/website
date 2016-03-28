function copyCode(elem){
	if (document.getElementById(elem)) {
		// create hidden text element, if it doesn't already exist
		var targetId = "_hiddenCopyText_";
			// must use a temporary form element for the selection and copy
			target = document.getElementById(targetId);
			if (!target) {
				var target = document.createElement("textarea");
				target.style.position = "absolute";
				target.style.left = "-9999px";
				target.style.top = "0";
				target.id = targetId;
				document.body.appendChild(target);
			}
			target.value = document.getElementById(elem).innerText;
		// select the content
		target.setSelectionRange(0, target.value.length);
		
		// copy the selection
		var succeed;
		try {
			succeed = document.execCommand("copy");
		} catch(e) {
			sweetAlert("Oh, no...","Sorry, your browser doesn't support document.execCommand('copy'), so we can't copy this code to your clipboard.");
			succeed = false;
		}
		if (succeed) sweetAlert("Copied to clipboard:",target.value);
		return succeed;
	} else {
		sweetAlert("Oops!",elem + " not found when trying to copy code");
		return false;
	}
}

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIs+ALWJhc2VDb21wb25lbnRzLmpzIiwic2NyaXB0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoic2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIC8vbW9kYWwgY2xvc2UgYnV0dG9uXG4oZnVuY3Rpb24oKXtcblx0Ly/PgC5tb2RhbENsb3NlQnV0dG9uID0gZnVuY3Rpb24oY2xvc2luZ0Z1bmN0aW9uKXtcblx0Ly9cdHJldHVybiDPgC5idXR0b24oJ3BpLW1vZGFsLWNsb3NlLWJ1dHRvbicsIG51bGwsIG51bGwsIGNsb3NpbmdGdW5jdGlvbik7XG5cdC8vfTtcbn0pKCk7XG4iLCIvLyBnbG9iYWxzXG52YXIgYm9keTtcblxuLy9oZWxwZXIgZnVuY3Rpb25zXG5mdW5jdGlvbiBib29sZWFuQXR0cmlidXRlVmFsdWUoZWxlbWVudCwgYXR0cmlidXRlLCBkZWZhdWx0VmFsdWUpe1xuXHQvLyByZXR1cm5zIHRydWUgaWYgYW4gYXR0cmlidXRlIGlzIHByZXNlbnQgd2l0aCBubyB2YWx1ZVxuXHQvLyBlLmcuIGJvb2xlYW5BdHRyaWJ1dGVWYWx1ZShlbGVtZW50LCAnZGF0YS1tb2RhbCcsIGZhbHNlKTtcblx0aWYgKGVsZW1lbnQuaGFzQXR0cmlidXRlKGF0dHJpYnV0ZSkpIHtcblx0XHR2YXIgdmFsdWUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShhdHRyaWJ1dGUpO1xuXHRcdGlmICh2YWx1ZSA9PT0gJycgfHwgdmFsdWUgPT09ICd0cnVlJykge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSBlbHNlIGlmICh2YWx1ZSA9PT0gJ2ZhbHNlJykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBkZWZhdWx0VmFsdWU7XG59XG5cbmZ1bmN0aW9uIGNsYXNzT25Db25kaXRpb24oZWxlbWVudCwgY2xhc3NOYW1lLCBjb25kaXRpb24pIHtcblx0aWYgKGNvbmRpdGlvbilcblx0XHQkKGVsZW1lbnQpLmFkZENsYXNzKGNsYXNzTmFtZSk7XG5cdGVsc2Vcblx0XHQkKGVsZW1lbnQpLnJlbW92ZUNsYXNzKGNsYXNzTmFtZSk7XG59XG5cbmZ1bmN0aW9uIGhpZ2hlc3RaKCkge1xuXHR2YXIgWiA9IDEwMDA7XG5cblx0JChcIipcIikuZWFjaChmdW5jdGlvbigpe1xuXHRcdHZhciB0aGlzWiA9ICQodGhpcykuY3NzKCd6LWluZGV4Jyk7XG5cblx0XHRpZiAodGhpc1ogIT0gXCJhdXRvXCIgJiYgdGhpc1ogPiBaKSBaID0gKyt0aGlzWjtcblx0fSk7XG5cblx0cmV0dXJuIFo7XG59XG5cbmZ1bmN0aW9uIG5ld0RPTUVsZW1lbnQodGFnLCBjbGFzc05hbWUsIGlkKXtcblx0dmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xuXG5cdGlmIChjbGFzc05hbWUpIGVsLmNsYXNzTmFtZSA9IGNsYXNzTmFtZTtcblx0aWYgKGlkKSBlbC5pZCA9IGlkO1xuXG5cdHJldHVybiBlbDtcbn1cblxuZnVuY3Rpb24gcHgobil7XG5cdHJldHVybiBuICsgJ3B4Jztcbn1cblxudmFyIGt1YiA9IChmdW5jdGlvbiAoKSB7XG5cdHZhciBIRUFERVJfSEVJR0hUO1xuXHR2YXIgaHRtbCwgaGVhZGVyLCBtYWluTmF2LCBxdWlja3N0YXJ0QnV0dG9uLCBoZXJvLCBlbmN5Y2xvcGVkaWEsIGZvb3Rlciwgd2lzaEZpZWxkLCBoZWFkbGluZVdyYXBwZXI7XG5cblx0JChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuXHRcdGh0bWwgPSAkKCdodG1sJyk7XG5cdFx0Ym9keSA9ICQoJ2JvZHknKTtcblx0XHRoZWFkZXIgPSAkKCdoZWFkZXInKTtcblx0XHRtYWluTmF2ID0gJCgnI21haW5OYXYnKTtcblx0XHR3aXNoRmllbGQgPSAkKCcjd2lzaEZpZWxkJyk7XG5cdFx0cXVpY2tzdGFydEJ1dHRvbiA9ICQoJyNxdWlja3N0YXJ0QnV0dG9uJyk7XG5cdFx0aGVybyA9ICQoJyNoZXJvJyk7XG5cdFx0ZW5jeWNsb3BlZGlhID0gJCgnI2VuY3ljbG9wZWRpYScpO1xuXHRcdGZvb3RlciA9ICQoJ2Zvb3RlcicpO1xuXHRcdGhlYWRsaW5lV3JhcHBlciA9ICQoJyNoZWFkbGluZVdyYXBwZXInKTtcblx0XHRIRUFERVJfSEVJR0hUID0gaGVhZGVyLm91dGVySGVpZ2h0KCk7XG5cblx0XHRyZXNldFRoZVZpZXcoKTtcblxuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNldFRoZVZpZXcpO1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCByZXNldFRoZVZpZXcpO1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5c3Ryb2tlcyk7XG5cdFx0d2lzaEZpZWxkWzBdLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlzdHJva2VzKTtcblxuXHRcdGRvY3VtZW50Lm9udW5sb2FkID0gZnVuY3Rpb24oKXtcblx0XHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNldFRoZVZpZXcpO1xuXHRcdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHJlc2V0VGhlVmlldyk7XG5cdFx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleXN0cm9rZXMpO1xuXHRcdFx0d2lzaEZpZWxkWzBdLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlzdHJva2VzKTtcblx0XHR9O1xuXG5cdFx0c2V0SW50ZXJ2YWwoc2V0Rm9vdGVyVHlwZSwgMTApO1xuXHR9KTtcblxuXHRmdW5jdGlvbiBzZXRGb290ZXJUeXBlKCkge1xuXHRcdHZhciB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cdFx0dmFyIGJvZHlIZWlnaHQ7XG5cblx0XHRzd2l0Y2ggKGh0bWxbMF0uaWQpIHtcblx0XHRcdGNhc2UgJ2RvY3MnOiB7XG5cdFx0XHRcdGJvZHlIZWlnaHQgPSBoZXJvLm91dGVySGVpZ2h0KCkgKyBlbmN5Y2xvcGVkaWEub3V0ZXJIZWlnaHQoKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdGNhc2UgJ2hvbWUnOlxuXHRcdFx0XHRib2R5SGVpZ2h0ID0gd2luZG93SGVpZ2h0O1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0ZGVmYXVsdDoge1xuXHRcdFx0XHRib2R5SGVpZ2h0ID0gaGVyby5vdXRlckhlaWdodCgpICsgJCgnI21haW5Db250ZW50Jykub3V0ZXJIZWlnaHQoKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR2YXIgZm9vdGVySGVpZ2h0ID0gZm9vdGVyLm91dGVySGVpZ2h0KCk7XG5cdFx0Y2xhc3NPbkNvbmRpdGlvbihib2R5LCAnZml4ZWQnLCB3aW5kb3dIZWlnaHQgLSBmb290ZXJIZWlnaHQgPiBib2R5SGVpZ2h0KTtcblx0fVxuXG5cdGZ1bmN0aW9uIHJlc2V0VGhlVmlldygpIHtcblx0XHRpZiAoaHRtbC5oYXNDbGFzcygnb3Blbi1uYXYnKSkge1xuXHRcdFx0dG9nZ2xlTWVudSgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRIRUFERVJfSEVJR0hUID0gaGVhZGVyLm91dGVySGVpZ2h0KCk7XG5cdFx0fVxuXG5cdFx0aWYgKGh0bWwuaGFzQ2xhc3MoJ29wZW4tdG9jJykpIHtcblx0XHRcdHRvZ2dsZVRvYygpO1xuXHRcdH1cblxuXHRcdGNsYXNzT25Db25kaXRpb24oaHRtbCwgJ2ZsaXAtbmF2Jywgd2luZG93LnBhZ2VZT2Zmc2V0ID4gMCk7XG5cblx0XHRpZiAoaHRtbFswXS5pZCA9PSAnaG9tZScpIHtcblx0XHRcdHNldEhvbWVIZWFkZXJTdHlsZXMoKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRIb21lSGVhZGVyU3R5bGVzKCkge1xuXHRcdHZhciBZID0gd2luZG93LnBhZ2VZT2Zmc2V0O1xuXHRcdHZhciBxdWlja3N0YXJ0Qm90dG9tID0gcXVpY2tzdGFydEJ1dHRvblswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5ib3R0b207XG5cblx0XHRjbGFzc09uQ29uZGl0aW9uKGh0bWxbMF0sICd5LWVub3VnaCcsIFkgPiBxdWlja3N0YXJ0Qm90dG9tKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHRvZ2dsZU1lbnUoKSB7XG5cdFx0aWYgKHdpbmRvdy5pbm5lcldpZHRoIDwgODAwKSB7XG5cdFx0XHRwdXNobWVudS5zaG93KCdwcmltYXJ5Jyk7XG5cdFx0fVxuXG5cdFx0ZWxzZSB7XG5cdFx0XHR2YXIgbmV3SGVpZ2h0ID0gSEVBREVSX0hFSUdIVDtcblxuXHRcdFx0aWYgKCFodG1sLmhhc0NsYXNzKCdvcGVuLW5hdicpKSB7XG5cdFx0XHRcdG5ld0hlaWdodCA9IG1haW5OYXYub3V0ZXJIZWlnaHQoKTtcblx0XHRcdH1cblxuXHRcdFx0aGVhZGVyLmNzcyh7aGVpZ2h0OiBweChuZXdIZWlnaHQpfSk7XG5cdFx0XHRodG1sLnRvZ2dsZUNsYXNzKCdvcGVuLW5hdicpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHN1Ym1pdFdpc2godGV4dGZpZWxkKSB7XG5cdFx0d2luZG93LmxvY2F0aW9uLnJlcGxhY2UoXCJodHRwczovL2dpdGh1Yi5jb20va3ViZXJuZXRlcy9rdWJlcm5ldGVzLmdpdGh1Yi5pby9pc3N1ZXMvbmV3P3RpdGxlPUklMjB3aXNoJTIwXCIgK1xuXHRcdFx0d2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgXCIlMjBcIiArIHRleHRmaWVsZC52YWx1ZSArIFwiJmJvZHk9SSUyMHdpc2glMjBcIiArXG5cdFx0XHR3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyBcIiUyMFwiICsgdGV4dGZpZWxkLnZhbHVlKTtcblxuXHRcdHRleHRmaWVsZC52YWx1ZSA9ICcnO1xuXHRcdHRleHRmaWVsZC5ibHVyKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBoYW5kbGVLZXlzdHJva2VzKGUpIHtcblx0XHRzd2l0Y2ggKGUud2hpY2gpIHtcblx0XHRcdGNhc2UgMTM6IHtcblx0XHRcdFx0aWYgKGUuY3VycmVudFRhcmdldCA9PT0gd2lzaEZpZWxkWzBdKSB7XG5cdFx0XHRcdFx0c3VibWl0V2lzaCh3aXNoRmllbGRbMF0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHRjYXNlIDI3OiB7XG5cdFx0XHRcdGlmIChodG1sLmhhc0NsYXNzKCdvcGVuLW5hdicpKSB7XG5cdFx0XHRcdFx0dG9nZ2xlTWVudSgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHNob3dWaWRlbygpIHtcblx0XHQkKCdib2R5JykuY3NzKHtvdmVyZmxvdzogJ2hpZGRlbid9KTtcblxuXHRcdHZhciB2aWRlb1BsYXllciA9ICQoXCIjdmlkZW9QbGF5ZXJcIik7XG5cdFx0dmFyIHZpZGVvSWZyYW1lID0gdmlkZW9QbGF5ZXIuZmluZChcImlmcmFtZVwiKVswXTtcblx0XHR2aWRlb0lmcmFtZS5zcmMgPSB2aWRlb0lmcmFtZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXVybFwiKTtcblx0XHR2aWRlb1BsYXllci5jc3Moe3pJbmRleDogaGlnaGVzdFooKX0pO1xuXHRcdHZpZGVvUGxheWVyLmZhZGVJbigzMDApO1xuXHRcdHZpZGVvUGxheWVyLmNsaWNrKGZ1bmN0aW9uKCl7XG5cdFx0XHQkKCdib2R5JykuY3NzKHtvdmVyZmxvdzogJ2F1dG8nfSk7XG5cblx0XHRcdHZpZGVvUGxheWVyLmZhZGVPdXQoMzAwLCBmdW5jdGlvbigpe1xuXHRcdFx0XHR2aWRlb0lmcmFtZS5zcmMgPSAnJztcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gdG9jV2FzQ2xpY2tlZChlKSB7XG5cdFx0dmFyIHRhcmdldCA9ICQoZS50YXJnZXQpO1xuXHRcdHZhciBkb2NzVG9jID0gJChcIiNkb2NzVG9jXCIpO1xuXHRcdHJldHVybiAodGFyZ2V0WzBdID09PSBkb2NzVG9jWzBdIHx8IHRhcmdldC5wYXJlbnRzKFwiI2RvY3NUb2NcIikubGVuZ3RoID4gMCk7XG5cdH1cblxuXHRmdW5jdGlvbiBsaXN0ZW5Gb3JUb2NDbGljayhlKSB7XG5cdFx0aWYgKCF0b2NXYXNDbGlja2VkKGUpKSB0b2dnbGVUb2MoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHRvZ2dsZVRvYygpIHtcblx0XHRodG1sLnRvZ2dsZUNsYXNzKCdvcGVuLXRvYycpO1xuXG5cdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAoaHRtbC5oYXNDbGFzcygnb3Blbi10b2MnKSkge1xuXHRcdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBsaXN0ZW5Gb3JUb2NDbGljayk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBsaXN0ZW5Gb3JUb2NDbGljayk7XG5cdFx0XHR9XG5cdFx0fSwgMTAwKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0dG9nZ2xlVG9jOiB0b2dnbGVUb2MsXG5cdFx0dG9nZ2xlTWVudTogdG9nZ2xlTWVudSxcblx0XHRzaG93VmlkZW86IHNob3dWaWRlb1xuXHR9O1xufSkoKTtcblxuXG4vLyBhY2NvcmRpb25cbihmdW5jdGlvbigpe1xuXHR2YXIgeWFoID0gdHJ1ZTtcblx0dmFyIG1vdmluZyA9IGZhbHNlO1xuXHR2YXIgQ1NTX0JST1dTRVJfSEFDS19ERUxBWSA9IDI1O1xuXG5cdCQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG5cdFx0Ly8gU2FmYXJpIGNob2tlcyBvbiB0aGUgYW5pbWF0aW9uIGhlcmUsIHNvLi4uXG5cdFx0aWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignQ2hyb21lJykgPT0gLTEgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdTYWZhcmknKSAhPSAtMSl7XG5cdFx0XHR2YXIgaGFja1N0eWxlID0gbmV3RE9NRWxlbWVudCgnc3R5bGUnKTtcblx0XHRcdGhhY2tTdHlsZS5pbm5lckhUTUwgPSAnLnBpLWFjY29yZGlvbiAud3JhcHBlcnt0cmFuc2l0aW9uOiBub25lfSc7XG5cdFx0XHRib2R5LmFwcGVuZChoYWNrU3R5bGUpO1xuXHRcdH1cblx0XHQvLyBHcm9zcy5cblxuXHRcdCQoJy5waS1hY2NvcmRpb24nKS5lYWNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBhY2NvcmRpb24gPSB0aGlzO1xuXHRcdFx0dmFyIGNvbnRlbnQgPSB0aGlzLmlubmVySFRNTDtcblx0XHRcdHZhciBjb250YWluZXIgPSBuZXdET01FbGVtZW50KCdkaXYnLCAnY29udGFpbmVyJyk7XG5cdFx0XHRjb250YWluZXIuaW5uZXJIVE1MID0gY29udGVudDtcblx0XHRcdCQoYWNjb3JkaW9uKS5lbXB0eSgpO1xuXHRcdFx0YWNjb3JkaW9uLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG5cdFx0XHRDb2xsYXBzZUJveCgkKGNvbnRhaW5lcikpO1xuXHRcdH0pO1xuXG5cdFx0c2V0WUFIKCk7XG5cblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdHlhaCA9IGZhbHNlO1xuXHRcdH0sIDUwMCk7XG5cdH0pO1xuXG5cdGZ1bmN0aW9uIENvbGxhcHNlQm94KGNvbnRhaW5lcil7XG5cdFx0Y29udGFpbmVyLmNoaWxkcmVuKCcuaXRlbScpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdC8vIGJ1aWxkIHRoZSBUT0MgRE9NXG5cdFx0XHQvLyB0aGUgYW5pbWF0ZWQgb3Blbi9jbG9zZSBpcyBlbmFibGVkIGJ5IGhhdmluZyBlYWNoIGl0ZW0ncyBjb250ZW50IGV4aXN0IGluIHRoZSBmbG93LCBhdCBpdHMgbmF0dXJhbCBoZWlnaHQsXG5cdFx0XHQvLyBlbmNsb3NlZCBpbiBhIHdyYXBwZXIgd2l0aCBoZWlnaHQgPSAwIHdoZW4gY2xvc2VkLCBhbmQgaGVpZ2h0ID0gY29udGVudEhlaWdodCB3aGVuIG9wZW4uXG5cdFx0XHR2YXIgaXRlbSA9IHRoaXM7XG5cblx0XHRcdC8vIG9ubHkgYWRkIGNvbnRlbnQgd3JhcHBlcnMgdG8gY29udGFpbmVycywgbm90IHRvIGxpbmtzXG5cdFx0XHR2YXIgaXNDb250YWluZXIgPSBpdGVtLnRhZ05hbWUgPT09ICdESVYnO1xuXG5cdFx0XHR2YXIgdGl0bGVUZXh0ID0gaXRlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKTtcblx0XHRcdHZhciB0aXRsZSA9IG5ld0RPTUVsZW1lbnQoJ2RpdicsICd0aXRsZScpO1xuXHRcdFx0dGl0bGUuaW5uZXJIVE1MID0gdGl0bGVUZXh0O1xuXG5cdFx0XHR2YXIgd3JhcHBlciwgY29udGVudDtcblxuXHRcdFx0aWYgKGlzQ29udGFpbmVyKSB7XG5cdFx0XHRcdHdyYXBwZXIgPSBuZXdET01FbGVtZW50KCdkaXYnLCAnd3JhcHBlcicpO1xuXHRcdFx0XHRjb250ZW50ID0gbmV3RE9NRWxlbWVudCgnZGl2JywgJ2NvbnRlbnQnKTtcblx0XHRcdFx0Y29udGVudC5pbm5lckhUTUwgPSBpdGVtLmlubmVySFRNTDtcblx0XHRcdFx0d3JhcHBlci5hcHBlbmRDaGlsZChjb250ZW50KTtcblx0XHRcdH1cblxuXHRcdFx0aXRlbS5pbm5lckhUTUwgPSAnJztcblx0XHRcdGl0ZW0uYXBwZW5kQ2hpbGQodGl0bGUpO1xuXG5cdFx0XHRpZiAod3JhcHBlcikge1xuXHRcdFx0XHRpdGVtLmFwcGVuZENoaWxkKHdyYXBwZXIpO1xuXHRcdFx0XHQkKHdyYXBwZXIpLmNzcyh7aGVpZ2h0OiAwfSk7XG5cdFx0XHR9XG5cblxuXHRcdFx0JCh0aXRsZSkuY2xpY2soZnVuY3Rpb24oKXtcblx0XHRcdFx0aWYgKCF5YWgpIHtcblx0XHRcdFx0XHRpZiAobW92aW5nKSByZXR1cm47XG5cdFx0XHRcdFx0bW92aW5nID0gdHJ1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChjb250YWluZXJbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLXNpbmdsZScpKSB7XG5cdFx0XHRcdFx0dmFyIG9wZW5TaWJsaW5ncyA9IGl0ZW0uc2libGluZ3MoKS5maWx0ZXIoZnVuY3Rpb24oc2liKXtyZXR1cm4gc2liLmhhc0NsYXNzKCdvbicpO30pO1xuXHRcdFx0XHRcdG9wZW5TaWJsaW5ncy5mb3JFYWNoKGZ1bmN0aW9uKHNpYmxpbmcpe1xuXHRcdFx0XHRcdFx0dG9nZ2xlSXRlbShzaWJsaW5nKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRpZiAoIWlzQ29udGFpbmVyKSB7XG5cdFx0XHRcdFx0XHRtb3ZpbmcgPSBmYWxzZTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dG9nZ2xlSXRlbShpdGVtKTtcblx0XHRcdFx0fSwgQ1NTX0JST1dTRVJfSEFDS19ERUxBWSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0ZnVuY3Rpb24gdG9nZ2xlSXRlbSh0aGlzSXRlbSl7XG5cdFx0XHRcdHZhciB0aGlzV3JhcHBlciA9ICQodGhpc0l0ZW0pLmZpbmQoJy53cmFwcGVyJykuZXEoMCk7XG5cblx0XHRcdFx0aWYgKCF0aGlzV3JhcHBlcikgcmV0dXJuO1xuXG5cdFx0XHRcdHZhciBjb250ZW50SGVpZ2h0ID0gdGhpc1dyYXBwZXIuZmluZCgnLmNvbnRlbnQnKS5lcSgwKS5pbm5lckhlaWdodCgpICsgJ3B4JztcblxuXHRcdFx0XHRpZiAoJCh0aGlzSXRlbSkuaGFzQ2xhc3MoJ29uJykpIHtcblx0XHRcdFx0XHR0aGlzV3JhcHBlci5jc3Moe2hlaWdodDogY29udGVudEhlaWdodH0pO1xuXHRcdFx0XHRcdCQodGhpc0l0ZW0pLnJlbW92ZUNsYXNzKCdvbicpO1xuXG5cdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0dGhpc1dyYXBwZXIuY3NzKHtoZWlnaHQ6IDB9KTtcblx0XHRcdFx0XHRcdG1vdmluZyA9IGZhbHNlO1xuXHRcdFx0XHRcdH0sIENTU19CUk9XU0VSX0hBQ0tfREVMQVkpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCQoaXRlbSkuYWRkQ2xhc3MoJ29uJyk7XG5cdFx0XHRcdFx0dGhpc1dyYXBwZXIuY3NzKHtoZWlnaHQ6IGNvbnRlbnRIZWlnaHR9KTtcblxuXHRcdFx0XHRcdHZhciBkdXJhdGlvbiA9IHBhcnNlRmxvYXQoZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzV3JhcHBlclswXSkudHJhbnNpdGlvbkR1cmF0aW9uKSAqIDEwMDA7XG5cblx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHR0aGlzV3JhcHBlci5jc3Moe2hlaWdodDogJyd9KTtcblx0XHRcdFx0XHRcdG1vdmluZyA9IGZhbHNlO1xuXHRcdFx0XHRcdH0sIGR1cmF0aW9uKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoY29udGVudCkge1xuXHRcdFx0XHR2YXIgaW5uZXJDb250YWluZXJzID0gJChjb250ZW50KS5jaGlsZHJlbignLmNvbnRhaW5lcicpO1xuXHRcdFx0XHRpZiAoaW5uZXJDb250YWluZXJzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRpbm5lckNvbnRhaW5lcnMuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0Q29sbGFwc2VCb3goJCh0aGlzKSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNldFlBSCgpIHtcblx0XHR2YXIgcGF0aG5hbWUgPSBsb2NhdGlvbi5ocmVmLnNwbGl0KCcjJylbMF07IC8vIG9uIHBhZ2UgbG9hZCwgbWFrZSBzdXJlIHRoZSBwYWdlIGlzIFlBSCBldmVuIGlmIHRoZXJlJ3MgYSBoYXNoXG5cdFx0dmFyIGN1cnJlbnRMaW5rcyA9IFtdO1xuXG5cdFx0JCgnLnBpLWFjY29yZGlvbiBhJykuZWFjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAocGF0aG5hbWUgPT09IHRoaXMuaHJlZikgY3VycmVudExpbmtzLnB1c2godGhpcyk7XG5cdFx0fSk7XG5cblx0XHRjdXJyZW50TGlua3MuZm9yRWFjaChmdW5jdGlvbiAoeWFoTGluaykge1xuXHRcdFx0JCh5YWhMaW5rKS5wYXJlbnRzKCcuaXRlbScpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdFx0JCh0aGlzKS5hZGRDbGFzcygnb24nKTtcblx0XHRcdFx0JCh0aGlzKS5maW5kKCcud3JhcHBlcicpLmVxKDApLmNzcyh7aGVpZ2h0OiAnYXV0byd9KTtcblx0XHRcdFx0JCh0aGlzKS5maW5kKCcuY29udGVudCcpLmVxKDApLmNzcyh7b3BhY2l0eTogMX0pO1xuXHRcdFx0fSk7XG5cblx0XHRcdCQoeWFoTGluaykuYWRkQ2xhc3MoJ3lhaCcpO1xuXHRcdFx0eWFoTGluay5vbmNsaWNrID0gZnVuY3Rpb24oZSl7ZS5wcmV2ZW50RGVmYXVsdCgpO307XG5cdFx0fSk7XG5cdH1cbn0pKCk7XG5cblxudmFyIHB1c2htZW51ID0gKGZ1bmN0aW9uKCl7XG5cdHZhciBhbGxQdXNoTWVudXMgPSB7fTtcblxuXHQkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuXHRcdCQoJ1tkYXRhLWF1dG8tYnVyZ2VyXScpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdHZhciBjb250YWluZXIgPSB0aGlzO1xuXHRcdFx0dmFyIGlkID0gY29udGFpbmVyLmdldEF0dHJpYnV0ZSgnZGF0YS1hdXRvLWJ1cmdlcicpO1xuXG5cdFx0XHR2YXIgYXV0b0J1cmdlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSB8fCBuZXdET01FbGVtZW50KCdkaXYnLCAncGktcHVzaG1lbnUnLCBpZCk7XG5cdFx0XHR2YXIgdWwgPSBhdXRvQnVyZ2VyLnF1ZXJ5U2VsZWN0b3IoJ3VsJykgfHwgbmV3RE9NRWxlbWVudCgndWwnKTtcblxuXHRcdFx0JChjb250YWluZXIpLmZpbmQoJ2FbaHJlZl0sIGJ1dHRvbicpLmVhY2goZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRpZiAoIWJvb2xlYW5BdHRyaWJ1dGVWYWx1ZSh0aGlzLCAnZGF0YS1hdXRvLWJ1cmdlci1leGNsdWRlJywgZmFsc2UpKSB7XG5cdFx0XHRcdFx0dmFyIGNsb25lID0gdGhpcy5jbG9uZU5vZGUodHJ1ZSk7XG5cdFx0XHRcdFx0Y2xvbmUuaWQgPSAnJztcblxuXHRcdFx0XHRcdGlmIChjbG9uZS50YWdOYW1lID09IFwiQlVUVE9OXCIpIHtcblx0XHRcdFx0XHRcdHZhciBhVGFnID0gbmV3RE9NRWxlbWVudCgnYScpO1xuXHRcdFx0XHRcdFx0YVRhZy5ocmVmID0gJyc7XG5cdFx0XHRcdFx0XHRhVGFnLmlubmVySFRNTCA9IGNsb25lLmlubmVySFRNTDtcblx0XHRcdFx0XHRcdGFUYWcub25jbGljayA9IGNsb25lLm9uY2xpY2s7XG5cdFx0XHRcdFx0XHRjbG9uZSA9IGFUYWc7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHZhciBsaSA9IG5ld0RPTUVsZW1lbnQoJ2xpJyk7XG5cdFx0XHRcdFx0bGkuYXBwZW5kQ2hpbGQoY2xvbmUpO1xuXHRcdFx0XHRcdHVsLmFwcGVuZENoaWxkKGxpKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdGF1dG9CdXJnZXIuYXBwZW5kQ2hpbGQodWwpO1xuXHRcdFx0Ym9keS5hcHBlbmQoYXV0b0J1cmdlcik7XG5cdFx0fSk7XG5cblx0XHQkKFwiLnBpLXB1c2htZW51XCIpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdGFsbFB1c2hNZW51c1t0aGlzLmlkXSA9IFB1c2hNZW51KHRoaXMpO1xuXHRcdH0pO1xuXHR9KTtcblxuXHRmdW5jdGlvbiBzaG93KG9iaklkKSB7XG5cdFx0YWxsUHVzaE1lbnVzW29iaklkXS5leHBvc2UoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIFB1c2hNZW51KGVsKSB7XG5cdFx0dmFyIGh0bWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdodG1sJyk7XG5cblx0XHR2YXIgb3ZlcmxheSA9IG5ld0RPTUVsZW1lbnQoJ2RpdicsICdvdmVybGF5Jyk7XG5cdFx0dmFyIGNvbnRlbnQgPSBuZXdET01FbGVtZW50KCdkaXYnLCAnY29udGVudCcpO1xuXHRcdGNvbnRlbnQuYXBwZW5kQ2hpbGQoZWwucXVlcnlTZWxlY3RvcignKicpKTtcblxuXHRcdHZhciBzaWRlID0gZWwuZ2V0QXR0cmlidXRlKFwiZGF0YS1zaWRlXCIpIHx8IFwicmlnaHRcIjtcblxuXHRcdHZhciBzbGVkID0gbmV3RE9NRWxlbWVudCgnZGl2JywgJ3NsZWQnKTtcblx0XHQkKHNsZWQpLmNzcyhzaWRlLCAwKTtcblxuXHRcdHNsZWQuYXBwZW5kQ2hpbGQoY29udGVudCk7XG5cblx0XHR2YXIgY2xvc2VCdXR0b24gPSBuZXdET01FbGVtZW50KCdidXR0b24nLCAncHVzaC1tZW51LWNsb3NlLWJ1dHRvbicpO1xuXHRcdGNsb3NlQnV0dG9uLm9uY2xpY2sgPSBjbG9zZU1lO1xuXG5cdFx0c2xlZC5hcHBlbmRDaGlsZChjbG9zZUJ1dHRvbik7XG5cblx0XHRvdmVybGF5LmFwcGVuZENoaWxkKHNsZWQpO1xuXHRcdGVsLmlubmVySFRNTCA9ICcnO1xuXHRcdGVsLmFwcGVuZENoaWxkKG92ZXJsYXkpO1xuXG5cdFx0c2xlZC5vbmNsaWNrID0gZnVuY3Rpb24oZSl7XG5cdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdH07XG5cblx0XHRvdmVybGF5Lm9uY2xpY2sgPSBjbG9zZU1lO1xuXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGNsb3NlTWUpO1xuXG5cdFx0ZnVuY3Rpb24gY2xvc2VNZShlKSB7XG5cdFx0XHRpZiAoZS50YXJnZXQgPT0gc2xlZCkgcmV0dXJuO1xuXG5cdFx0XHQkKGVsKS5yZW1vdmVDbGFzcygnb24nKTtcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0JChlbCkuY3NzKHtkaXNwbGF5OiAnbm9uZSd9KTtcblxuXHRcdFx0XHQkKGJvZHkpLnJlbW92ZUNsYXNzKCdvdmVybGF5LW9uJyk7XG5cdFx0XHR9LCAzMDApO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGV4cG9zZU1lKCl7XG5cdFx0XHQkKGJvZHkpLmFkZENsYXNzKCdvdmVybGF5LW9uJyk7IC8vIGluIHRoZSBkZWZhdWx0IGNvbmZpZywga2lsbHMgYm9keSBzY3JvbGxpbmdcblxuXHRcdFx0JChlbCkuY3NzKHtcblx0XHRcdFx0ZGlzcGxheTogJ2Jsb2NrJyxcblx0XHRcdFx0ekluZGV4OiBoaWdoZXN0WigpXG5cdFx0XHR9KTtcblxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHQkKGVsKS5hZGRDbGFzcygnb24nKTtcblx0XHRcdH0sIDEwKTtcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXhwb3NlOiBleHBvc2VNZVxuXHRcdH07XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdHNob3c6IHNob3dcblx0fTtcbn0pKCk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
