// adorable little functions
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


 //modal close button
(function(){
	//π.modalCloseButton = function(closingFunction){
	//	return π.button('pi-modal-close-button', null, null, closingFunction);
	//};
})();


///********************************************************************
// π-pushmenu.js
// // TODO:  USAGE AND API REFERENCE
// ______________________________________________
// DEPENDENCIES:
//
// HAL.js
//
// ______________________________________________
// DATA ATTRIBUTES:
//
// side: ["left", "right"]
// ______________________________________________
// MARKUP AND DEFAULTS:
//
//	<div class="pi-pushmenu" id="myPushMenu">
//		 <ul>
//			 <li><a href="#">foo</a></li>
//			 <li><a href="#">bar</a></li>
//			 <li><a href="#">gronk</a></li>
//			 <li><a href="#">fleebles</a></li>
//			 <li><a href="#">sepulveda</a></li>
//		 </ul>
//	</div>
//
//elsewhere...
//
// <button onclick="π-pushmenu.show('myPushMenu')">show menu</button>
//
// ______________________________________________
// GENERATED HTML:
//
//
// ______________________________________________
// API
//
//
// ***************************************************************************************/
//
//π.pushmenu = (function(){
//	var allPushMenus = {};
//
//	function init(){
//		π('[data-auto-burger]').forEach(function(container){
//			var id = container.getAttribute('data-auto-burger');
//
//			var autoBurger = πd(id) || π.div('pi-pushmenu', id);
//			var ul = autoBurger.π1('ul') || π.ul();
//
//			container.π('a[href], button').forEach(function (obj) {
//				if (!booleanAttributeValue(obj, 'data-auto-burger-exclude', false)) {
//					var clone = obj.cloneNode(true);
//					clone.id = '';
//
//					if (clone.tagName == "BUTTON") {
//						var aTag = π.srcElement('a');
//						aTag.href = '';
//						aTag.innerHTML = clone.innerHTML;
//						aTag.onclick = clone.onclick;
//						clone = aTag;
//					}
//					ul.add(π.li(0, 0, clone));
//				}
//			});
//
//			autoBurger.add(ul);
//			π1('body').add(autoBurger);
//		});
//
//		π(".pi-pushmenu").forEach(function(el){
//			allPushMenus[el.id] = PushMenu(el);
//		});
//
//		π.setTriggers('pushmenu', π.pushmenu);
//	}
//
//	function show(objId) {
//		allPushMenus[objId].expose();
//	}
//
//	// TODO: dismiss on click?
//	// this works:
//
//	//π('.pi-pushmenu li a').forEach(function(a){
//	//	a.onclick = function(){
//	//		this.parent('.pi-pushmenu').π1('.pi-modal-close-button').click();
//	//		console.log("message");
//	//	};
//	//});
//
//
//	function PushMenu(el) {
//		var html = π1('html');
//		var body = π1('body');
//
//		var overlay = π.div("overlay");
//		var content = π.div('content', null, el.π1('*'));
//
//		var side = el.getAttribute("data-side") || "right";
//
//		var sled = π.div("sled");
//		sled.css(side, 0);
//
//		var topBar = π.div("top-bar");
//
//		topBar.fill(π.modalCloseButton(closeMe));
//		sled.fill([topBar, content]);
//
//		overlay.fill(sled);
//		el.fill(overlay);
//
//		sled.onclick = function(e){
//			e.stopPropagation();
//		};
//
//		overlay.onclick = closeMe;
//
//		π.listen(closeMe, 'resize');
//
//		function closeMe(e) {
//			var t = e.target;
//			if (t == sled || t == topBar) return;
//
//			el.killClass("on");
//			setTimeout(function(){
//				el.css({display: "none"});
//
//				body.killClass("overlay-on");
//			}, 300);
//		}
//
//		function exposeMe(){
//			body.addClass("overlay-on"); // in the default config, kills body scrolling
//
//			el.css({
//				display: "block",
//				zIndex: π.highestZ()
//			});
//			setTimeout(function(){
//				el.addClass("on");
//			}, 10);
//		}
//
//		return {
//			expose: exposeMe
//		};
//	}
//
//	//π.mods.push(init);
//
//	return {
//		show: show
//	};
//})();

// globals
var body;

//helper functions
function classOnCondition(element, className, condition) {
	if (condition)
		$(element).addClass(className);
	else
		$(element).removeClass(className);
}

function px(n){
	return n + 'px';
}

function newDOMElement(tag, className, id){
	var el = document.createElement(tag);

	if (className) el.className = className;
	if (id) el.id = id;

	return el;
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

			readout.html(dropdown.find('a')[0].innerHTML);
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
			π.pushmenu.show('primary');
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



// TODO: scrollintoview in-page TOC
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFsZi5qcyIsIs+ALWJhc2VDb21wb25lbnRzLmpzIiwiz4AtYWNjb3JkaW9uL8+ALWFjY29yZGlvbi5qcyIsIs+ALXB1c2htZW51L8+ALXB1c2htZW51LmpzIiwic2NyaXB0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoic2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gYWRvcmFibGUgbGl0dGxlIGZ1bmN0aW9uc1xuZnVuY3Rpb24gYm9vbGVhbkF0dHJpYnV0ZVZhbHVlKGVsZW1lbnQsIGF0dHJpYnV0ZSwgZGVmYXVsdFZhbHVlKXtcblx0Ly8gcmV0dXJucyB0cnVlIGlmIGFuIGF0dHJpYnV0ZSBpcyBwcmVzZW50IHdpdGggbm8gdmFsdWVcblx0Ly8gZS5nLiBib29sZWFuQXR0cmlidXRlVmFsdWUoZWxlbWVudCwgJ2RhdGEtbW9kYWwnLCBmYWxzZSk7XG5cdGlmIChlbGVtZW50Lmhhc0F0dHJpYnV0ZShhdHRyaWJ1dGUpKSB7XG5cdFx0dmFyIHZhbHVlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlKTtcblx0XHRpZiAodmFsdWUgPT09ICcnIHx8IHZhbHVlID09PSAndHJ1ZScpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0gZWxzZSBpZiAodmFsdWUgPT09ICdmYWxzZScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gZGVmYXVsdFZhbHVlO1xufVxuXG4iLCIgLy9tb2RhbCBjbG9zZSBidXR0b25cbihmdW5jdGlvbigpe1xuXHQvL8+ALm1vZGFsQ2xvc2VCdXR0b24gPSBmdW5jdGlvbihjbG9zaW5nRnVuY3Rpb24pe1xuXHQvL1x0cmV0dXJuIM+ALmJ1dHRvbigncGktbW9kYWwtY2xvc2UtYnV0dG9uJywgbnVsbCwgbnVsbCwgY2xvc2luZ0Z1bmN0aW9uKTtcblx0Ly99O1xufSkoKTtcbiIsIiIsIi8vLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyDPgC1wdXNobWVudS5qc1xuLy8gLy8gVE9ETzogIFVTQUdFIEFORCBBUEkgUkVGRVJFTkNFXG4vLyBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXG4vLyBERVBFTkRFTkNJRVM6XG4vL1xuLy8gSEFMLmpzXG4vL1xuLy8gX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xuLy8gREFUQSBBVFRSSUJVVEVTOlxuLy9cbi8vIHNpZGU6IFtcImxlZnRcIiwgXCJyaWdodFwiXVxuLy8gX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xuLy8gTUFSS1VQIEFORCBERUZBVUxUUzpcbi8vXG4vL1x0PGRpdiBjbGFzcz1cInBpLXB1c2htZW51XCIgaWQ9XCJteVB1c2hNZW51XCI+XG4vL1x0XHQgPHVsPlxuLy9cdFx0XHQgPGxpPjxhIGhyZWY9XCIjXCI+Zm9vPC9hPjwvbGk+XG4vL1x0XHRcdCA8bGk+PGEgaHJlZj1cIiNcIj5iYXI8L2E+PC9saT5cbi8vXHRcdFx0IDxsaT48YSBocmVmPVwiI1wiPmdyb25rPC9hPjwvbGk+XG4vL1x0XHRcdCA8bGk+PGEgaHJlZj1cIiNcIj5mbGVlYmxlczwvYT48L2xpPlxuLy9cdFx0XHQgPGxpPjxhIGhyZWY9XCIjXCI+c2VwdWx2ZWRhPC9hPjwvbGk+XG4vL1x0XHQgPC91bD5cbi8vXHQ8L2Rpdj5cbi8vXG4vL2Vsc2V3aGVyZS4uLlxuLy9cbi8vIDxidXR0b24gb25jbGljaz1cIs+ALXB1c2htZW51LnNob3coJ215UHVzaE1lbnUnKVwiPnNob3cgbWVudTwvYnV0dG9uPlxuLy9cbi8vIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cbi8vIEdFTkVSQVRFRCBIVE1MOlxuLy9cbi8vXG4vLyBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXG4vLyBBUElcbi8vXG4vL1xuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLy9cbi8vz4AucHVzaG1lbnUgPSAoZnVuY3Rpb24oKXtcbi8vXHR2YXIgYWxsUHVzaE1lbnVzID0ge307XG4vL1xuLy9cdGZ1bmN0aW9uIGluaXQoKXtcbi8vXHRcdM+AKCdbZGF0YS1hdXRvLWJ1cmdlcl0nKS5mb3JFYWNoKGZ1bmN0aW9uKGNvbnRhaW5lcil7XG4vL1x0XHRcdHZhciBpZCA9IGNvbnRhaW5lci5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXV0by1idXJnZXInKTtcbi8vXG4vL1x0XHRcdHZhciBhdXRvQnVyZ2VyID0gz4BkKGlkKSB8fCDPgC5kaXYoJ3BpLXB1c2htZW51JywgaWQpO1xuLy9cdFx0XHR2YXIgdWwgPSBhdXRvQnVyZ2VyLs+AMSgndWwnKSB8fCDPgC51bCgpO1xuLy9cbi8vXHRcdFx0Y29udGFpbmVyLs+AKCdhW2hyZWZdLCBidXR0b24nKS5mb3JFYWNoKGZ1bmN0aW9uIChvYmopIHtcbi8vXHRcdFx0XHRpZiAoIWJvb2xlYW5BdHRyaWJ1dGVWYWx1ZShvYmosICdkYXRhLWF1dG8tYnVyZ2VyLWV4Y2x1ZGUnLCBmYWxzZSkpIHtcbi8vXHRcdFx0XHRcdHZhciBjbG9uZSA9IG9iai5jbG9uZU5vZGUodHJ1ZSk7XG4vL1x0XHRcdFx0XHRjbG9uZS5pZCA9ICcnO1xuLy9cbi8vXHRcdFx0XHRcdGlmIChjbG9uZS50YWdOYW1lID09IFwiQlVUVE9OXCIpIHtcbi8vXHRcdFx0XHRcdFx0dmFyIGFUYWcgPSDPgC5zcmNFbGVtZW50KCdhJyk7XG4vL1x0XHRcdFx0XHRcdGFUYWcuaHJlZiA9ICcnO1xuLy9cdFx0XHRcdFx0XHRhVGFnLmlubmVySFRNTCA9IGNsb25lLmlubmVySFRNTDtcbi8vXHRcdFx0XHRcdFx0YVRhZy5vbmNsaWNrID0gY2xvbmUub25jbGljaztcbi8vXHRcdFx0XHRcdFx0Y2xvbmUgPSBhVGFnO1xuLy9cdFx0XHRcdFx0fVxuLy9cdFx0XHRcdFx0dWwuYWRkKM+ALmxpKDAsIDAsIGNsb25lKSk7XG4vL1x0XHRcdFx0fVxuLy9cdFx0XHR9KTtcbi8vXG4vL1x0XHRcdGF1dG9CdXJnZXIuYWRkKHVsKTtcbi8vXHRcdFx0z4AxKCdib2R5JykuYWRkKGF1dG9CdXJnZXIpO1xuLy9cdFx0fSk7XG4vL1xuLy9cdFx0z4AoXCIucGktcHVzaG1lbnVcIikuZm9yRWFjaChmdW5jdGlvbihlbCl7XG4vL1x0XHRcdGFsbFB1c2hNZW51c1tlbC5pZF0gPSBQdXNoTWVudShlbCk7XG4vL1x0XHR9KTtcbi8vXG4vL1x0XHTPgC5zZXRUcmlnZ2VycygncHVzaG1lbnUnLCDPgC5wdXNobWVudSk7XG4vL1x0fVxuLy9cbi8vXHRmdW5jdGlvbiBzaG93KG9iaklkKSB7XG4vL1x0XHRhbGxQdXNoTWVudXNbb2JqSWRdLmV4cG9zZSgpO1xuLy9cdH1cbi8vXG4vL1x0Ly8gVE9ETzogZGlzbWlzcyBvbiBjbGljaz9cbi8vXHQvLyB0aGlzIHdvcmtzOlxuLy9cbi8vXHQvL8+AKCcucGktcHVzaG1lbnUgbGkgYScpLmZvckVhY2goZnVuY3Rpb24oYSl7XG4vL1x0Ly9cdGEub25jbGljayA9IGZ1bmN0aW9uKCl7XG4vL1x0Ly9cdFx0dGhpcy5wYXJlbnQoJy5waS1wdXNobWVudScpLs+AMSgnLnBpLW1vZGFsLWNsb3NlLWJ1dHRvbicpLmNsaWNrKCk7XG4vL1x0Ly9cdFx0Y29uc29sZS5sb2coXCJtZXNzYWdlXCIpO1xuLy9cdC8vXHR9O1xuLy9cdC8vfSk7XG4vL1xuLy9cbi8vXHRmdW5jdGlvbiBQdXNoTWVudShlbCkge1xuLy9cdFx0dmFyIGh0bWwgPSDPgDEoJ2h0bWwnKTtcbi8vXHRcdHZhciBib2R5ID0gz4AxKCdib2R5Jyk7XG4vL1xuLy9cdFx0dmFyIG92ZXJsYXkgPSDPgC5kaXYoXCJvdmVybGF5XCIpO1xuLy9cdFx0dmFyIGNvbnRlbnQgPSDPgC5kaXYoJ2NvbnRlbnQnLCBudWxsLCBlbC7PgDEoJyonKSk7XG4vL1xuLy9cdFx0dmFyIHNpZGUgPSBlbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXNpZGVcIikgfHwgXCJyaWdodFwiO1xuLy9cbi8vXHRcdHZhciBzbGVkID0gz4AuZGl2KFwic2xlZFwiKTtcbi8vXHRcdHNsZWQuY3NzKHNpZGUsIDApO1xuLy9cbi8vXHRcdHZhciB0b3BCYXIgPSDPgC5kaXYoXCJ0b3AtYmFyXCIpO1xuLy9cbi8vXHRcdHRvcEJhci5maWxsKM+ALm1vZGFsQ2xvc2VCdXR0b24oY2xvc2VNZSkpO1xuLy9cdFx0c2xlZC5maWxsKFt0b3BCYXIsIGNvbnRlbnRdKTtcbi8vXG4vL1x0XHRvdmVybGF5LmZpbGwoc2xlZCk7XG4vL1x0XHRlbC5maWxsKG92ZXJsYXkpO1xuLy9cbi8vXHRcdHNsZWQub25jbGljayA9IGZ1bmN0aW9uKGUpe1xuLy9cdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuLy9cdFx0fTtcbi8vXG4vL1x0XHRvdmVybGF5Lm9uY2xpY2sgPSBjbG9zZU1lO1xuLy9cbi8vXHRcdM+ALmxpc3RlbihjbG9zZU1lLCAncmVzaXplJyk7XG4vL1xuLy9cdFx0ZnVuY3Rpb24gY2xvc2VNZShlKSB7XG4vL1x0XHRcdHZhciB0ID0gZS50YXJnZXQ7XG4vL1x0XHRcdGlmICh0ID09IHNsZWQgfHwgdCA9PSB0b3BCYXIpIHJldHVybjtcbi8vXG4vL1x0XHRcdGVsLmtpbGxDbGFzcyhcIm9uXCIpO1xuLy9cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4vL1x0XHRcdFx0ZWwuY3NzKHtkaXNwbGF5OiBcIm5vbmVcIn0pO1xuLy9cbi8vXHRcdFx0XHRib2R5LmtpbGxDbGFzcyhcIm92ZXJsYXktb25cIik7XG4vL1x0XHRcdH0sIDMwMCk7XG4vL1x0XHR9XG4vL1xuLy9cdFx0ZnVuY3Rpb24gZXhwb3NlTWUoKXtcbi8vXHRcdFx0Ym9keS5hZGRDbGFzcyhcIm92ZXJsYXktb25cIik7IC8vIGluIHRoZSBkZWZhdWx0IGNvbmZpZywga2lsbHMgYm9keSBzY3JvbGxpbmdcbi8vXG4vL1x0XHRcdGVsLmNzcyh7XG4vL1x0XHRcdFx0ZGlzcGxheTogXCJibG9ja1wiLFxuLy9cdFx0XHRcdHpJbmRleDogz4AuaGlnaGVzdFooKVxuLy9cdFx0XHR9KTtcbi8vXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuLy9cdFx0XHRcdGVsLmFkZENsYXNzKFwib25cIik7XG4vL1x0XHRcdH0sIDEwKTtcbi8vXHRcdH1cbi8vXG4vL1x0XHRyZXR1cm4ge1xuLy9cdFx0XHRleHBvc2U6IGV4cG9zZU1lXG4vL1x0XHR9O1xuLy9cdH1cbi8vXG4vL1x0Ly/PgC5tb2RzLnB1c2goaW5pdCk7XG4vL1xuLy9cdHJldHVybiB7XG4vL1x0XHRzaG93OiBzaG93XG4vL1x0fTtcbi8vfSkoKTtcbiIsIi8vIGdsb2JhbHNcbnZhciBib2R5O1xuXG4vL2hlbHBlciBmdW5jdGlvbnNcbmZ1bmN0aW9uIGNsYXNzT25Db25kaXRpb24oZWxlbWVudCwgY2xhc3NOYW1lLCBjb25kaXRpb24pIHtcblx0aWYgKGNvbmRpdGlvbilcblx0XHQkKGVsZW1lbnQpLmFkZENsYXNzKGNsYXNzTmFtZSk7XG5cdGVsc2Vcblx0XHQkKGVsZW1lbnQpLnJlbW92ZUNsYXNzKGNsYXNzTmFtZSk7XG59XG5cbmZ1bmN0aW9uIHB4KG4pe1xuXHRyZXR1cm4gbiArICdweCc7XG59XG5cbmZ1bmN0aW9uIG5ld0RPTUVsZW1lbnQodGFnLCBjbGFzc05hbWUsIGlkKXtcblx0dmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xuXG5cdGlmIChjbGFzc05hbWUpIGVsLmNsYXNzTmFtZSA9IGNsYXNzTmFtZTtcblx0aWYgKGlkKSBlbC5pZCA9IGlkO1xuXG5cdHJldHVybiBlbDtcbn1cblxuXG52YXIga3ViID0gKGZ1bmN0aW9uICgpIHtcblx0dmFyIEhFQURFUl9IRUlHSFQ7XG5cdHZhciBodG1sLCBoZWFkZXIsIG1haW5OYXYsIHF1aWNrc3RhcnRCdXR0b24sIGhlcm8sIGVuY3ljbG9wZWRpYSwgZm9vdGVyLCB3aXNoRmllbGQ7XG5cblx0JChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuXHRcdGh0bWwgPSAkKCdodG1sJyk7XG5cdFx0Ym9keSA9ICQoJ2JvZHknKTtcblx0XHRoZWFkZXIgPSAkKCdoZWFkZXInKTtcblx0XHRtYWluTmF2ID0gJCgnI21haW5OYXYnKTtcblx0XHR3aXNoRmllbGQgPSAkKCcjd2lzaEZpZWxkJyk7XG5cdFx0cXVpY2tzdGFydEJ1dHRvbiA9ICQoJyNxdWlja3N0YXJ0QnV0dG9uJyk7XG5cdFx0aGVybyA9ICQoJyNoZXJvJyk7XG5cdFx0ZW5jeWNsb3BlZGlhID0gJCgnI2VuY3ljbG9wZWRpYScpO1xuXHRcdGZvb3RlciA9ICQoJ2Zvb3RlcicpO1xuXHRcdEhFQURFUl9IRUlHSFQgPSBoZWFkZXIub3V0ZXJIZWlnaHQoKTtcblxuXHRcdHJlc2V0VGhlVmlldygpO1xuXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2V0VGhlVmlldyk7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHJlc2V0VGhlVmlldyk7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlzdHJva2VzKTtcblx0XHR3aXNoRmllbGRbMF0uYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleXN0cm9rZXMpO1xuXG5cdFx0ZG9jdW1lbnQub251bmxvYWQgPSBmdW5jdGlvbigpe1xuXHRcdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2V0VGhlVmlldyk7XG5cdFx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgcmVzZXRUaGVWaWV3KTtcblx0XHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5c3Ryb2tlcyk7XG5cdFx0XHR3aXNoRmllbGRbMF0ucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleXN0cm9rZXMpO1xuXHRcdH07XG5cblx0XHQkKCcuZHJvcGRvd24nKS5lYWNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBkcm9wZG93biA9ICQodGhpcyk7XG5cdFx0XHR2YXIgcmVhZG91dCA9IGRyb3Bkb3duLmZpbmQoJy5yZWFkb3V0Jyk7XG5cblx0XHRcdHJlYWRvdXQuaHRtbChkcm9wZG93bi5maW5kKCdhJylbMF0uaW5uZXJIVE1MKTtcblx0XHRcdHJlYWRvdXQuY2xpY2soZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRkcm9wZG93bi50b2dnbGVDbGFzcygnb24nKTtcblx0XHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VPcGVuRHJvcGRvd24pO1xuXG5cdFx0XHRcdGZ1bmN0aW9uIGNsb3NlT3BlbkRyb3Bkb3duKGUpIHtcblx0XHRcdFx0XHRpZiAoZHJvcGRvd24uaGFzQ2xhc3MoJ29uJykgJiYgIShkcm9wZG93bldhc0NsaWNrZWQoZSkpKSB7XG5cdFx0XHRcdFx0XHRkcm9wZG93bi5yZW1vdmVDbGFzcygnb24nKTtcblx0XHRcdFx0XHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlT3BlbkRyb3Bkb3duKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmdW5jdGlvbiBkcm9wZG93bldhc0NsaWNrZWQoZSkge1xuXHRcdFx0XHRcdHJldHVybiAkKGUudGFyZ2V0KS5wYXJlbnRzKCcuZHJvcGRvd24nKS5sZW5ndGg7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdFx0c2V0SW50ZXJ2YWwoc2V0Rm9vdGVyVHlwZSwgMTApO1xuXHR9KTtcblxuXHRmdW5jdGlvbiBzZXRGb290ZXJUeXBlKCkge1xuXHRcdGlmIChodG1sWzBdLmlkID09IFwiZG9jc1wiKSB7XG5cdFx0XHR2YXIgYm9keUhlaWdodCA9IGhlcm8ub3V0ZXJIZWlnaHQoKSArIGVuY3ljbG9wZWRpYS5vdXRlckhlaWdodCgpO1xuXHRcdFx0dmFyIGZvb3RlckhlaWdodCA9IGZvb3Rlci5vdXRlckhlaWdodCgpO1xuXG5cdFx0XHRjbGFzc09uQ29uZGl0aW9uKGJvZHksICdmaXhlZCcsIHdpbmRvdy5pbm5lckhlaWdodCAtIGZvb3RlckhlaWdodCA+IGJvZHlIZWlnaHQpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHJlc2V0VGhlVmlldygpIHtcblx0XHRpZiAoaHRtbC5oYXNDbGFzcygnb3Blbi1uYXYnKSkge1xuXHRcdFx0dG9nZ2xlTWVudSgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRIRUFERVJfSEVJR0hUID0gaGVhZGVyLm91dGVySGVpZ2h0KCk7XG5cdFx0fVxuXG5cdFx0Y2xhc3NPbkNvbmRpdGlvbihodG1sLCAnZmxpcC1uYXYnLCB3aW5kb3cucGFnZVlPZmZzZXQgPiAwKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHRvZ2dsZU1lbnUoKSB7XG5cdFx0aWYgKHdpbmRvdy5pbm5lcldpZHRoIDwgODAwKSB7XG5cdFx0XHTPgC5wdXNobWVudS5zaG93KCdwcmltYXJ5Jyk7XG5cdFx0fVxuXG5cdFx0ZWxzZSB7XG5cdFx0XHR2YXIgbmV3SGVpZ2h0ID0gSEVBREVSX0hFSUdIVDtcblxuXHRcdFx0aWYgKCFodG1sLmhhc0NsYXNzKCdvcGVuLW5hdicpKSB7XG5cdFx0XHRcdG5ld0hlaWdodCA9IG1haW5OYXYub3V0ZXJIZWlnaHQoKTtcblx0XHRcdH1cblxuXHRcdFx0aGVhZGVyLmNzcyh7aGVpZ2h0OiBweChuZXdIZWlnaHQpfSk7XG5cdFx0XHRodG1sLnRvZ2dsZUNsYXNzKCdvcGVuLW5hdicpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHN1Ym1pdFdpc2godGV4dGZpZWxkKSB7XG5cdFx0d2luZG93LmxvY2F0aW9uLnJlcGxhY2UoXCJodHRwczovL2dpdGh1Yi5jb20va3ViZXJuZXRlcy9rdWJlcm5ldGVzLmdpdGh1Yi5pby9pc3N1ZXMvbmV3P3RpdGxlPUklMjB3aXNoJTIwXCIgK1xuXHRcdFx0d2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgXCIlMjBcIiArIHRleHRmaWVsZC52YWx1ZSArIFwiJmJvZHk9SSUyMHdpc2glMjBcIiArXG5cdFx0XHR3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyBcIiUyMFwiICsgdGV4dGZpZWxkLnZhbHVlKTtcblxuXHRcdHRleHRmaWVsZC52YWx1ZSA9ICcnO1xuXHRcdHRleHRmaWVsZC5ibHVyKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBoYW5kbGVLZXlzdHJva2VzKGUpIHtcblx0XHRzd2l0Y2ggKGUud2hpY2gpIHtcblx0XHRcdGNhc2UgMTM6IHtcblx0XHRcdFx0aWYgKGUuY3VycmVudFRhcmdldCA9PT0gd2lzaEZpZWxkKSB7XG5cdFx0XHRcdFx0c3VibWl0V2lzaCh3aXNoRmllbGQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHRjYXNlIDI3OiB7XG5cdFx0XHRcdGlmIChodG1sLmhhc0NsYXNzKCdvcGVuLW5hdicpKSB7XG5cdFx0XHRcdFx0dG9nZ2xlTWVudSgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB7XG5cdFx0dG9nZ2xlTWVudTogdG9nZ2xlTWVudVxuXHR9O1xufSkoKTtcblxuXG4vLyBhY2NvcmRpb25cbihmdW5jdGlvbigpe1xuXHR2YXIgeWFoID0gdHJ1ZTtcblx0dmFyIG1vdmluZyA9IGZhbHNlO1xuXHR2YXIgQ1NTX0JST1dTRVJfSEFDS19ERUxBWSA9IDI1O1xuXG5cdCQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG5cdFx0Ly8gU2FmYXJpIGNob2tlcyBvbiB0aGUgYW5pbWF0aW9uIGhlcmUsIHNvLi4uXG5cdFx0aWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignQ2hyb21lJykgPT0gLTEgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdTYWZhcmknKSAhPSAtMSl7XG5cdFx0XHR2YXIgaGFja1N0eWxlID0gbmV3RE9NRWxlbWVudCgnc3R5bGUnKTtcblx0XHRcdGhhY2tTdHlsZS5pbm5lckhUTUwgPSAnLnBpLWFjY29yZGlvbiAud3JhcHBlcnt0cmFuc2l0aW9uOiBub25lfSc7XG5cdFx0XHRib2R5LmFwcGVuZChoYWNrU3R5bGUpO1xuXHRcdH1cblx0XHQvLyBHcm9zcy5cblxuXHRcdCQoJy5waS1hY2NvcmRpb24nKS5lYWNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBhY2NvcmRpb24gPSB0aGlzO1xuXHRcdFx0dmFyIGNvbnRlbnQgPSB0aGlzLmlubmVySFRNTDtcblx0XHRcdHZhciBjb250YWluZXIgPSBuZXdET01FbGVtZW50KCdkaXYnLCAnY29udGFpbmVyJyk7XG5cdFx0XHRjb250YWluZXIuaW5uZXJIVE1MID0gY29udGVudDtcblx0XHRcdCQoYWNjb3JkaW9uKS5lbXB0eSgpO1xuXHRcdFx0YWNjb3JkaW9uLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG5cdFx0XHRDb2xsYXBzZUJveCgkKGNvbnRhaW5lcikpO1xuXHRcdH0pO1xuXG5cdFx0c2V0WUFIKCk7XG5cblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdHlhaCA9IGZhbHNlO1xuXHRcdH0sIDUwMCk7XG5cdH0pO1xuXG5cdGZ1bmN0aW9uIENvbGxhcHNlQm94KGNvbnRhaW5lcil7XG5cdFx0Y29udGFpbmVyLmNoaWxkcmVuKCcuaXRlbScpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdC8vIGJ1aWxkIHRoZSBUT0MgRE9NXG5cdFx0XHQvLyB0aGUgYW5pbWF0ZWQgb3Blbi9jbG9zZSBpcyBlbmFibGVkIGJ5IGhhdmluZyBlYWNoIGl0ZW0ncyBjb250ZW50IGV4aXN0IGluIHRoZSBmbG93LCBhdCBpdHMgbmF0dXJhbCBoZWlnaHQsXG5cdFx0XHQvLyBlbmNsb3NlZCBpbiBhIHdyYXBwZXIgd2l0aCBoZWlnaHQgPSAwIHdoZW4gY2xvc2VkLCBhbmQgaGVpZ2h0ID0gY29udGVudEhlaWdodCB3aGVuIG9wZW4uXG5cdFx0XHR2YXIgaXRlbSA9IHRoaXM7XG5cblx0XHRcdC8vIG9ubHkgYWRkIGNvbnRlbnQgd3JhcHBlcnMgdG8gY29udGFpbmVycywgbm90IHRvIGxpbmtzXG5cdFx0XHR2YXIgaXNDb250YWluZXIgPSBpdGVtLnRhZ05hbWUgPT09ICdESVYnO1xuXG5cdFx0XHR2YXIgdGl0bGVUZXh0ID0gaXRlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKTtcblx0XHRcdHZhciB0aXRsZSA9IG5ld0RPTUVsZW1lbnQoJ2RpdicsICd0aXRsZScpO1xuXHRcdFx0dGl0bGUuaW5uZXJIVE1MID0gdGl0bGVUZXh0O1xuXG5cdFx0XHR2YXIgd3JhcHBlciwgY29udGVudDtcblxuXHRcdFx0aWYgKGlzQ29udGFpbmVyKSB7XG5cdFx0XHRcdHdyYXBwZXIgPSBuZXdET01FbGVtZW50KCdkaXYnLCAnd3JhcHBlcicpO1xuXHRcdFx0XHRjb250ZW50ID0gbmV3RE9NRWxlbWVudCgnZGl2JywgJ2NvbnRlbnQnKTtcblx0XHRcdFx0Y29udGVudC5pbm5lckhUTUwgPSBpdGVtLmlubmVySFRNTDtcblx0XHRcdFx0d3JhcHBlci5hcHBlbmRDaGlsZChjb250ZW50KTtcblx0XHRcdH1cblxuXHRcdFx0aXRlbS5pbm5lckhUTUwgPSAnJztcblx0XHRcdGl0ZW0uYXBwZW5kQ2hpbGQodGl0bGUpO1xuXG5cdFx0XHRpZiAod3JhcHBlcikge1xuXHRcdFx0XHRpdGVtLmFwcGVuZENoaWxkKHdyYXBwZXIpO1xuXHRcdFx0XHQkKHdyYXBwZXIpLmNzcyh7aGVpZ2h0OiAwfSk7XG5cdFx0XHR9XG5cblxuXHRcdFx0JCh0aXRsZSkuY2xpY2soZnVuY3Rpb24oKXtcblx0XHRcdFx0aWYgKCF5YWgpIHtcblx0XHRcdFx0XHRpZiAobW92aW5nKSByZXR1cm47XG5cdFx0XHRcdFx0bW92aW5nID0gdHJ1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChjb250YWluZXJbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLXNpbmdsZScpKSB7XG5cdFx0XHRcdFx0dmFyIG9wZW5TaWJsaW5ncyA9IGl0ZW0uc2libGluZ3MoKS5maWx0ZXIoZnVuY3Rpb24oc2liKXtyZXR1cm4gc2liLmhhc0NsYXNzKCdvbicpO30pO1xuXHRcdFx0XHRcdG9wZW5TaWJsaW5ncy5mb3JFYWNoKGZ1bmN0aW9uKHNpYmxpbmcpe1xuXHRcdFx0XHRcdFx0dG9nZ2xlSXRlbShzaWJsaW5nKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRpZiAoIWlzQ29udGFpbmVyKSB7XG5cdFx0XHRcdFx0XHRtb3ZpbmcgPSBmYWxzZTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dG9nZ2xlSXRlbShpdGVtKTtcblx0XHRcdFx0fSwgQ1NTX0JST1dTRVJfSEFDS19ERUxBWSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0ZnVuY3Rpb24gdG9nZ2xlSXRlbSh0aGlzSXRlbSl7XG5cdFx0XHRcdHZhciB0aGlzV3JhcHBlciA9ICQodGhpc0l0ZW0pLmZpbmQoJy53cmFwcGVyJykuZXEoMCk7XG5cblx0XHRcdFx0aWYgKCF0aGlzV3JhcHBlcikgcmV0dXJuO1xuXG5cdFx0XHRcdHZhciBjb250ZW50SGVpZ2h0ID0gdGhpc1dyYXBwZXIuZmluZCgnLmNvbnRlbnQnKS5lcSgwKS5pbm5lckhlaWdodCgpICsgJ3B4JztcblxuXHRcdFx0XHRpZiAoJCh0aGlzSXRlbSkuaGFzQ2xhc3MoJ29uJykpIHtcblx0XHRcdFx0XHR0aGlzV3JhcHBlci5jc3Moe2hlaWdodDogY29udGVudEhlaWdodH0pO1xuXHRcdFx0XHRcdCQodGhpc0l0ZW0pLnJlbW92ZUNsYXNzKCdvbicpO1xuXG5cdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0dGhpc1dyYXBwZXIuY3NzKHtoZWlnaHQ6IDB9KTtcblx0XHRcdFx0XHRcdG1vdmluZyA9IGZhbHNlO1xuXHRcdFx0XHRcdH0sIENTU19CUk9XU0VSX0hBQ0tfREVMQVkpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCQoaXRlbSkuYWRkQ2xhc3MoJ29uJyk7XG5cdFx0XHRcdFx0dGhpc1dyYXBwZXIuY3NzKHtoZWlnaHQ6IGNvbnRlbnRIZWlnaHR9KTtcblxuXHRcdFx0XHRcdHZhciBkdXJhdGlvbiA9IHBhcnNlRmxvYXQoZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzV3JhcHBlclswXSkudHJhbnNpdGlvbkR1cmF0aW9uKSAqIDEwMDA7XG5cblx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHR0aGlzV3JhcHBlci5jc3Moe2hlaWdodDogJyd9KTtcblx0XHRcdFx0XHRcdG1vdmluZyA9IGZhbHNlO1xuXHRcdFx0XHRcdH0sIGR1cmF0aW9uKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoY29udGVudCkge1xuXHRcdFx0XHR2YXIgaW5uZXJDb250YWluZXJzID0gJChjb250ZW50KS5jaGlsZHJlbignLmNvbnRhaW5lcicpO1xuXHRcdFx0XHRpZiAoaW5uZXJDb250YWluZXJzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRpbm5lckNvbnRhaW5lcnMuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0Q29sbGFwc2VCb3goJCh0aGlzKSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNldFlBSCgpIHtcblx0XHR2YXIgcGF0aG5hbWUgPSBsb2NhdGlvbi5ocmVmLnNwbGl0KCcjJylbMF07IC8vIG9uIHBhZ2UgbG9hZCwgbWFrZSBzdXJlIHRoZSBwYWdlIGlzIFlBSCBldmVuIGlmIHRoZXJlJ3MgYSBoYXNoXG5cdFx0dmFyIGN1cnJlbnRMaW5rcyA9IFtdO1xuXG5cdFx0JCgnLnBpLWFjY29yZGlvbiBhJykuZWFjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAocGF0aG5hbWUgPT09IHRoaXMuaHJlZikgY3VycmVudExpbmtzLnB1c2godGhpcyk7XG5cdFx0fSk7XG5cblx0XHRjdXJyZW50TGlua3MuZm9yRWFjaChmdW5jdGlvbiAoeWFoTGluaykge1xuXHRcdFx0JCh5YWhMaW5rKS5wYXJlbnRzKCcuaXRlbScpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdFx0JCh0aGlzKS5hZGRDbGFzcygnb24nKTtcblx0XHRcdFx0JCh0aGlzKS5maW5kKCcud3JhcHBlcicpLmVxKDApLmNzcyh7aGVpZ2h0OiAnYXV0byd9KTtcblx0XHRcdFx0JCh0aGlzKS5maW5kKCcuY29udGVudCcpLmVxKDApLmNzcyh7b3BhY2l0eTogMX0pO1xuXHRcdFx0fSk7XG5cblx0XHRcdCQoeWFoTGluaykuYWRkQ2xhc3MoJ3lhaCcpO1xuXHRcdFx0eWFoTGluay5vbmNsaWNrID0gZnVuY3Rpb24oZSl7ZS5wcmV2ZW50RGVmYXVsdCgpO307XG5cdFx0fSk7XG5cdH1cbn0pKCk7XG5cblxuXG4vLyBUT0RPOiBzY3JvbGxpbnRvdmlldyBpbi1wYWdlIFRPQyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
