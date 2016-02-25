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


var π, π1, πd;
(function(){
	return;
	//
	//π = function(selector) {
	//	return document.querySelectorAll(selector);
	//};
	//
	//π1 = function (selector) {
	//	return document.querySelector(selector);
	//};
	//
	//πd = function(id) {
	//	return document.getElementById(id);
	//};
	//
	//π.newDOMElement = function(tagName, className, id) {
	//	var el = document.createElement(tagName);
	//
	//	if (className)
	//		el.className = className;
	//
	//	if (id)
	//		el.id = id;
	//
	//	return el;
	//};
	//
	//π.contentElement = function(tagName, className, id, content)
	//{
	//	var el = π.newDOMElement(tagName, className, id);
	//
	//	if (content) {
	//		if (content.nodeName) {
	//			el.appendChild(content);
	//		} else {
	//			el.innerHTML = content;
	//		}
	//	}
	//
	//	return el;
	//};
	//
	//π.button = function(className, id, content, action){
	//	var el = π.contentElement("button", className, id, content);
	//	el.onclick = action;
	//	return el;
	//};
	//π.div = function(className, id, content){ return π.contentElement("div", className, id, content); };
	//π.span = function(className, id, content){ return π.contentElement("span", className, id, content); };
	//π.h2 = function(className, id, content){ return π.contentElement("h2", className, id, content); };
	//π.p = function(className, id, content){ return π.contentElement("p", className, id, content); };
	//π.ul = function(className, id, content){ return π.contentElement("ul", className, id, content); };
	//π.li = function(className, id, content){ return π.contentElement("li", className, id, content); };
	//
	//π.a = function(className, id, content, href){
	//	var a = π.contentElement("a", className, id, content);
	//	a.href = href;
	//	return a;
	//};
	//
	//
	//π.clean = function(callback, eventName) {
	//	window.removeEventListener(eventName || "DOMContentLoaded", callback);
	//};
	//
	//π.listen = function(callback, eventName) {
	//	window.addEventListener(eventName || "DOMContentLoaded", callback);
	//};
	//
	//π.highestZ = function() {
	//	var Z = 1000;
	//
	//	π("*").forEach(function(el){
	//		var thisZ = el.css().zIndex;
	//
	//		if (thisZ != "auto") {
	//			if (thisZ > Z) Z = thisZ + 1;
	//		}
	//	});
	//
	//	return Z;
	//};
	//
	//π.setTriggers = function(selector, object){
	//	selector = 'pi-' + selector + '-trigger';
	//	π('[' + selector + ']').forEach(function(trigger){
	//		trigger.onclick = function(){
	//			object.show(trigger.getAttribute(selector));
	//		};
	//	});
	//};
	//HTMLElement.prototype.add = Node.prototype.add = function(object){
	//	if (Array.isArray(object)) {
	//		var el = this;
	//		object.forEach(function(obj){
	//			if (obj) el.appendChild(obj);
	//		});
	//	} else if(object) {
	//		this.appendChild(object);
	//	}
	//};
	//
	//HTMLElement.prototype.classOnCondition = Node.prototype.classOnCondition = function(classname, condition) {
	//	if (condition)
	//		this.addClass(classname);
	//	else
	//		this.killClass(classname);
	//};
	//
	//HTMLElement.prototype.offset = Node.prototype.offset = function(){
	//	return this.getBoundingClientRect();
	//};
	//
	//HTMLElement.prototype.πd = Node.prototype.πd = function(id) {
	//	return this.getElementById(id);
	//};
	//
	//HTMLElement.prototype.π1 = Node.prototype.π1 = function(selector) {
	//	return this.querySelector(selector);
	//};
	//
	//HTMLElement.prototype.π = Node.prototype.π = function(selector) {
	//	return this.querySelectorAll(selector);
	//};
	//
	//function arrayOfClassesForElement(el) {
	//	return el.className ? el.className.split(" ") : [];
	//}
	//
	//HTMLElement.prototype.hasClass = Node.prototype.hasClass = function (className) {
	//	var classes = arrayOfClassesForElement(this);
	//	return classes.indexOf(className) !== -1;
	//};
	//
	//HTMLElement.prototype.addClass = Node.prototype.addClass = function (className) {
	//	if (this.hasClass(className)) return;
	//	if (this.className.length > 0) this.className += " ";
	//	this.className += className;
	//};
	//
	//HTMLElement.prototype.killClass = Node.prototype.killClass = function (className) {
	//	if (this.hasClass(className)) {
	//		var classes = arrayOfClassesForElement(this);
	//		var idx = classes.indexOf(className);
	//		if (idx > -1) {
	//			classes.splice(idx, 1);
	//			this.className = classes.join(" ");
	//		}
	//	}
	//};
	//
	//HTMLElement.prototype.toggleClass= Node.prototype.toggleClass= function (className) {
	//	return (this.hasClass(className)) ? this.killClass(className) : this.addClass(className);
	//};
	//
	//HTMLElement.prototype.siblings = Node.prototype.siblings = function(selector){
	//	var el = this;
	//	return el.parentNode.π(':scope > ' + (selector || '*')).filter(function(obj){return obj != el;});
	//};
	//
	//HTMLElement.prototype.css = Node.prototype.css = function(ruleOrObject, value) {
	//	var el = this;
	//
	//	if (arguments.length === 0) {
	//		return window.getComputedStyle(this);
	//	}
	//
	//	else if (typeof ruleOrObject === 'object') { // an object was passed in
	//		Object.keys(ruleOrObject).forEach(function(key){
	//			el.style[key] = ruleOrObject[key];
	//		});
	//	}
	//
	//	else if (typeof ruleOrObject === 'string' && value !== undefined) { // 2 string values were passed in
	//		el.style[ruleOrObject] = value;
	//	}
	//};
	//
	//HTMLElement.prototype.listen = Node.prototype.listen = function(callback, eventName){
	//	this.addEventListener(eventName, callback);
	//};
	//
	//HTMLElement.prototype.empty = Node.prototype.empty = function() {
	//	this.innerHTML = "";
	//};
	//
	//HTMLElement.prototype.fill = Node.prototype.fill = function(content) {
	//	var el = this;
	//	el.empty();
	//
	//	if (Array.isArray(content)) {
	//		content.forEach(function(obj){
	//			if (obj)
	//				el.appendChild(obj);
	//		});
	//
	//		return;
	//	}
	//
	//	if (!content.nodeType) {
	//		var textElement = document.createElement("text");
	//		textElement.innerHTML = content;
	//		content = textElement;
	//	}
	//
	//	this.appendChild(content);
	//};
	//
	//HTMLElement.prototype.isHeirOfClass = Node.prototype.isHeirOfClass = function (className) {
	//	if (this === π1('html')) return false;
	//
	//	var parent = this.parentNode;
	//
	//	if (parent) {
	//		while (parent !== π1('body')) {
	//			if (parent.hasClass(className)) return true;
	//
	//			parent = parent.parentNode;
	//		}
	//	}
	//
	//	return false;
	//};
	//
	//HTMLElement.prototype.parents = Node.prototype.parents = function (selector) {
	//	var parents = [];
	//	var immediateParent = this.parentNode;
	//
	//	while(immediateParent !== π1('html')) {
	//		parents.push(immediateParent);
	//		immediateParent = immediateParent.parentNode;
	//	}
	//
	//	if (selector) {
	//		var selectedElements = π(selector);
	//		var selectedParents = [];
	//		selectedElements.forEach(function(el){
	//			if (parents.indexOf(el) !== -1) selectedParents.push(el);
	//		});
	//
	//		parents = selectedParents;
	//	}
	//
	//	return parents;
	//};
	//
	//HTMLElement.prototype.kids = Node.prototype.kids = function(selector) {
	//	var childNodes = this.childNodes;
	//	if (!selector) return childNodes;
	//
	//	var descendents = this.π(selector);
	//	var children = [];
	//
	//	childNodes.forEach(function(node){
	//		if (descendents.indexOf(node) !== -1) {
	//			children.push(node);
	//		}
	//	});
	//
	//	return children;
	//};
	//
	//var arrayMethods = Object.getOwnPropertyNames(Array.prototype);
	//arrayMethods.forEach(function(methodName){
	//	if(methodName !== "length") {
	//		NodeList.prototype[methodName] = Array.prototype[methodName];
	//	}
	//});
	//
	//π.mods = [];
	//
	//function loadMods() {
	//	π.clean(loadMods);
	//	π.mods.forEach(function(init){
	//		init();
	//	});
	//}
	//
	//π.listen(loadMods);
})();  // end π
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
				console.log(this);
				$(this).addClass('on');
				$(this).find('.wrapper').eq(0).css({height: 'auto'});
				$(this).find('.content').eq(0).css({opacity: 1});
			});

			$(yahLink).addClass('yah');
			yahLink.onclick = function(e){e.preventDefault();};
		});
	}

	//π.mods.push(init);
})();



// TODO: scrollintoview in-page TOC
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFsZi5qcyIsIs+ALmpzIiwiz4AtYmFzZUNvbXBvbmVudHMuanMiLCLPgC1hY2NvcmRpb24vz4AtYWNjb3JkaW9uLmpzIiwiz4AtcHVzaG1lbnUvz4AtcHVzaG1lbnUuanMiLCJzY3JpcHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeFJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6InNjcmlwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGFkb3JhYmxlIGxpdHRsZSBmdW5jdGlvbnNcbmZ1bmN0aW9uIGJvb2xlYW5BdHRyaWJ1dGVWYWx1ZShlbGVtZW50LCBhdHRyaWJ1dGUsIGRlZmF1bHRWYWx1ZSl7XG5cdC8vIHJldHVybnMgdHJ1ZSBpZiBhbiBhdHRyaWJ1dGUgaXMgcHJlc2VudCB3aXRoIG5vIHZhbHVlXG5cdC8vIGUuZy4gYm9vbGVhbkF0dHJpYnV0ZVZhbHVlKGVsZW1lbnQsICdkYXRhLW1vZGFsJywgZmFsc2UpO1xuXHRpZiAoZWxlbWVudC5oYXNBdHRyaWJ1dGUoYXR0cmlidXRlKSkge1xuXHRcdHZhciB2YWx1ZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZSk7XG5cdFx0aWYgKHZhbHVlID09PSAnJyB8fCB2YWx1ZSA9PT0gJ3RydWUnKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9IGVsc2UgaWYgKHZhbHVlID09PSAnZmFsc2UnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGRlZmF1bHRWYWx1ZTtcbn1cblxuIiwidmFyIM+ALCDPgDEsIM+AZDtcbihmdW5jdGlvbigpe1xuXHRyZXR1cm47XG5cdC8vXG5cdC8vz4AgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuXHQvL1x0cmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuXHQvL307XG5cdC8vXG5cdC8vz4AxID0gZnVuY3Rpb24gKHNlbGVjdG9yKSB7XG5cdC8vXHRyZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG5cdC8vfTtcblx0Ly9cblx0Ly/PgGQgPSBmdW5jdGlvbihpZCkge1xuXHQvL1x0cmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcblx0Ly99O1xuXHQvL1xuXHQvL8+ALm5ld0RPTUVsZW1lbnQgPSBmdW5jdGlvbih0YWdOYW1lLCBjbGFzc05hbWUsIGlkKSB7XG5cdC8vXHR2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWUpO1xuXHQvL1xuXHQvL1x0aWYgKGNsYXNzTmFtZSlcblx0Ly9cdFx0ZWwuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuXHQvL1xuXHQvL1x0aWYgKGlkKVxuXHQvL1x0XHRlbC5pZCA9IGlkO1xuXHQvL1xuXHQvL1x0cmV0dXJuIGVsO1xuXHQvL307XG5cdC8vXG5cdC8vz4AuY29udGVudEVsZW1lbnQgPSBmdW5jdGlvbih0YWdOYW1lLCBjbGFzc05hbWUsIGlkLCBjb250ZW50KVxuXHQvL3tcblx0Ly9cdHZhciBlbCA9IM+ALm5ld0RPTUVsZW1lbnQodGFnTmFtZSwgY2xhc3NOYW1lLCBpZCk7XG5cdC8vXG5cdC8vXHRpZiAoY29udGVudCkge1xuXHQvL1x0XHRpZiAoY29udGVudC5ub2RlTmFtZSkge1xuXHQvL1x0XHRcdGVsLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xuXHQvL1x0XHR9IGVsc2Uge1xuXHQvL1x0XHRcdGVsLmlubmVySFRNTCA9IGNvbnRlbnQ7XG5cdC8vXHRcdH1cblx0Ly9cdH1cblx0Ly9cblx0Ly9cdHJldHVybiBlbDtcblx0Ly99O1xuXHQvL1xuXHQvL8+ALmJ1dHRvbiA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQsIGFjdGlvbil7XG5cdC8vXHR2YXIgZWwgPSDPgC5jb250ZW50RWxlbWVudChcImJ1dHRvblwiLCBjbGFzc05hbWUsIGlkLCBjb250ZW50KTtcblx0Ly9cdGVsLm9uY2xpY2sgPSBhY3Rpb247XG5cdC8vXHRyZXR1cm4gZWw7XG5cdC8vfTtcblx0Ly/PgC5kaXYgPSBmdW5jdGlvbihjbGFzc05hbWUsIGlkLCBjb250ZW50KXsgcmV0dXJuIM+ALmNvbnRlbnRFbGVtZW50KFwiZGl2XCIsIGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpOyB9O1xuXHQvL8+ALnNwYW4gPSBmdW5jdGlvbihjbGFzc05hbWUsIGlkLCBjb250ZW50KXsgcmV0dXJuIM+ALmNvbnRlbnRFbGVtZW50KFwic3BhblwiLCBjbGFzc05hbWUsIGlkLCBjb250ZW50KTsgfTtcblx0Ly/PgC5oMiA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpeyByZXR1cm4gz4AuY29udGVudEVsZW1lbnQoXCJoMlwiLCBjbGFzc05hbWUsIGlkLCBjb250ZW50KTsgfTtcblx0Ly/PgC5wID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBpZCwgY29udGVudCl7IHJldHVybiDPgC5jb250ZW50RWxlbWVudChcInBcIiwgY2xhc3NOYW1lLCBpZCwgY29udGVudCk7IH07XG5cdC8vz4AudWwgPSBmdW5jdGlvbihjbGFzc05hbWUsIGlkLCBjb250ZW50KXsgcmV0dXJuIM+ALmNvbnRlbnRFbGVtZW50KFwidWxcIiwgY2xhc3NOYW1lLCBpZCwgY29udGVudCk7IH07XG5cdC8vz4AubGkgPSBmdW5jdGlvbihjbGFzc05hbWUsIGlkLCBjb250ZW50KXsgcmV0dXJuIM+ALmNvbnRlbnRFbGVtZW50KFwibGlcIiwgY2xhc3NOYW1lLCBpZCwgY29udGVudCk7IH07XG5cdC8vXG5cdC8vz4AuYSA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQsIGhyZWYpe1xuXHQvL1x0dmFyIGEgPSDPgC5jb250ZW50RWxlbWVudChcImFcIiwgY2xhc3NOYW1lLCBpZCwgY29udGVudCk7XG5cdC8vXHRhLmhyZWYgPSBocmVmO1xuXHQvL1x0cmV0dXJuIGE7XG5cdC8vfTtcblx0Ly9cblx0Ly9cblx0Ly/PgC5jbGVhbiA9IGZ1bmN0aW9uKGNhbGxiYWNrLCBldmVudE5hbWUpIHtcblx0Ly9cdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSB8fCBcIkRPTUNvbnRlbnRMb2FkZWRcIiwgY2FsbGJhY2spO1xuXHQvL307XG5cdC8vXG5cdC8vz4AubGlzdGVuID0gZnVuY3Rpb24oY2FsbGJhY2ssIGV2ZW50TmFtZSkge1xuXHQvL1x0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lIHx8IFwiRE9NQ29udGVudExvYWRlZFwiLCBjYWxsYmFjayk7XG5cdC8vfTtcblx0Ly9cblx0Ly/PgC5oaWdoZXN0WiA9IGZ1bmN0aW9uKCkge1xuXHQvL1x0dmFyIFogPSAxMDAwO1xuXHQvL1xuXHQvL1x0z4AoXCIqXCIpLmZvckVhY2goZnVuY3Rpb24oZWwpe1xuXHQvL1x0XHR2YXIgdGhpc1ogPSBlbC5jc3MoKS56SW5kZXg7XG5cdC8vXG5cdC8vXHRcdGlmICh0aGlzWiAhPSBcImF1dG9cIikge1xuXHQvL1x0XHRcdGlmICh0aGlzWiA+IFopIFogPSB0aGlzWiArIDE7XG5cdC8vXHRcdH1cblx0Ly9cdH0pO1xuXHQvL1xuXHQvL1x0cmV0dXJuIFo7XG5cdC8vfTtcblx0Ly9cblx0Ly/PgC5zZXRUcmlnZ2VycyA9IGZ1bmN0aW9uKHNlbGVjdG9yLCBvYmplY3Qpe1xuXHQvL1x0c2VsZWN0b3IgPSAncGktJyArIHNlbGVjdG9yICsgJy10cmlnZ2VyJztcblx0Ly9cdM+AKCdbJyArIHNlbGVjdG9yICsgJ10nKS5mb3JFYWNoKGZ1bmN0aW9uKHRyaWdnZXIpe1xuXHQvL1x0XHR0cmlnZ2VyLm9uY2xpY2sgPSBmdW5jdGlvbigpe1xuXHQvL1x0XHRcdG9iamVjdC5zaG93KHRyaWdnZXIuZ2V0QXR0cmlidXRlKHNlbGVjdG9yKSk7XG5cdC8vXHRcdH07XG5cdC8vXHR9KTtcblx0Ly99O1xuXHQvL0hUTUxFbGVtZW50LnByb3RvdHlwZS5hZGQgPSBOb2RlLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihvYmplY3Qpe1xuXHQvL1x0aWYgKEFycmF5LmlzQXJyYXkob2JqZWN0KSkge1xuXHQvL1x0XHR2YXIgZWwgPSB0aGlzO1xuXHQvL1x0XHRvYmplY3QuZm9yRWFjaChmdW5jdGlvbihvYmope1xuXHQvL1x0XHRcdGlmIChvYmopIGVsLmFwcGVuZENoaWxkKG9iaik7XG5cdC8vXHRcdH0pO1xuXHQvL1x0fSBlbHNlIGlmKG9iamVjdCkge1xuXHQvL1x0XHR0aGlzLmFwcGVuZENoaWxkKG9iamVjdCk7XG5cdC8vXHR9XG5cdC8vfTtcblx0Ly9cblx0Ly9IVE1MRWxlbWVudC5wcm90b3R5cGUuY2xhc3NPbkNvbmRpdGlvbiA9IE5vZGUucHJvdG90eXBlLmNsYXNzT25Db25kaXRpb24gPSBmdW5jdGlvbihjbGFzc25hbWUsIGNvbmRpdGlvbikge1xuXHQvL1x0aWYgKGNvbmRpdGlvbilcblx0Ly9cdFx0dGhpcy5hZGRDbGFzcyhjbGFzc25hbWUpO1xuXHQvL1x0ZWxzZVxuXHQvL1x0XHR0aGlzLmtpbGxDbGFzcyhjbGFzc25hbWUpO1xuXHQvL307XG5cdC8vXG5cdC8vSFRNTEVsZW1lbnQucHJvdG90eXBlLm9mZnNldCA9IE5vZGUucHJvdG90eXBlLm9mZnNldCA9IGZ1bmN0aW9uKCl7XG5cdC8vXHRyZXR1cm4gdGhpcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0Ly99O1xuXHQvL1xuXHQvL0hUTUxFbGVtZW50LnByb3RvdHlwZS7PgGQgPSBOb2RlLnByb3RvdHlwZS7PgGQgPSBmdW5jdGlvbihpZCkge1xuXHQvL1x0cmV0dXJuIHRoaXMuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuXHQvL307XG5cdC8vXG5cdC8vSFRNTEVsZW1lbnQucHJvdG90eXBlLs+AMSA9IE5vZGUucHJvdG90eXBlLs+AMSA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG5cdC8vXHRyZXR1cm4gdGhpcy5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcblx0Ly99O1xuXHQvL1xuXHQvL0hUTUxFbGVtZW50LnByb3RvdHlwZS7PgCA9IE5vZGUucHJvdG90eXBlLs+AID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcblx0Ly9cdHJldHVybiB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuXHQvL307XG5cdC8vXG5cdC8vZnVuY3Rpb24gYXJyYXlPZkNsYXNzZXNGb3JFbGVtZW50KGVsKSB7XG5cdC8vXHRyZXR1cm4gZWwuY2xhc3NOYW1lID8gZWwuY2xhc3NOYW1lLnNwbGl0KFwiIFwiKSA6IFtdO1xuXHQvL31cblx0Ly9cblx0Ly9IVE1MRWxlbWVudC5wcm90b3R5cGUuaGFzQ2xhc3MgPSBOb2RlLnByb3RvdHlwZS5oYXNDbGFzcyA9IGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcblx0Ly9cdHZhciBjbGFzc2VzID0gYXJyYXlPZkNsYXNzZXNGb3JFbGVtZW50KHRoaXMpO1xuXHQvL1x0cmV0dXJuIGNsYXNzZXMuaW5kZXhPZihjbGFzc05hbWUpICE9PSAtMTtcblx0Ly99O1xuXHQvL1xuXHQvL0hUTUxFbGVtZW50LnByb3RvdHlwZS5hZGRDbGFzcyA9IE5vZGUucHJvdG90eXBlLmFkZENsYXNzID0gZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuXHQvL1x0aWYgKHRoaXMuaGFzQ2xhc3MoY2xhc3NOYW1lKSkgcmV0dXJuO1xuXHQvL1x0aWYgKHRoaXMuY2xhc3NOYW1lLmxlbmd0aCA+IDApIHRoaXMuY2xhc3NOYW1lICs9IFwiIFwiO1xuXHQvL1x0dGhpcy5jbGFzc05hbWUgKz0gY2xhc3NOYW1lO1xuXHQvL307XG5cdC8vXG5cdC8vSFRNTEVsZW1lbnQucHJvdG90eXBlLmtpbGxDbGFzcyA9IE5vZGUucHJvdG90eXBlLmtpbGxDbGFzcyA9IGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcblx0Ly9cdGlmICh0aGlzLmhhc0NsYXNzKGNsYXNzTmFtZSkpIHtcblx0Ly9cdFx0dmFyIGNsYXNzZXMgPSBhcnJheU9mQ2xhc3Nlc0ZvckVsZW1lbnQodGhpcyk7XG5cdC8vXHRcdHZhciBpZHggPSBjbGFzc2VzLmluZGV4T2YoY2xhc3NOYW1lKTtcblx0Ly9cdFx0aWYgKGlkeCA+IC0xKSB7XG5cdC8vXHRcdFx0Y2xhc3Nlcy5zcGxpY2UoaWR4LCAxKTtcblx0Ly9cdFx0XHR0aGlzLmNsYXNzTmFtZSA9IGNsYXNzZXMuam9pbihcIiBcIik7XG5cdC8vXHRcdH1cblx0Ly9cdH1cblx0Ly99O1xuXHQvL1xuXHQvL0hUTUxFbGVtZW50LnByb3RvdHlwZS50b2dnbGVDbGFzcz0gTm9kZS5wcm90b3R5cGUudG9nZ2xlQ2xhc3M9IGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcblx0Ly9cdHJldHVybiAodGhpcy5oYXNDbGFzcyhjbGFzc05hbWUpKSA/IHRoaXMua2lsbENsYXNzKGNsYXNzTmFtZSkgOiB0aGlzLmFkZENsYXNzKGNsYXNzTmFtZSk7XG5cdC8vfTtcblx0Ly9cblx0Ly9IVE1MRWxlbWVudC5wcm90b3R5cGUuc2libGluZ3MgPSBOb2RlLnByb3RvdHlwZS5zaWJsaW5ncyA9IGZ1bmN0aW9uKHNlbGVjdG9yKXtcblx0Ly9cdHZhciBlbCA9IHRoaXM7XG5cdC8vXHRyZXR1cm4gZWwucGFyZW50Tm9kZS7PgCgnOnNjb3BlID4gJyArIChzZWxlY3RvciB8fCAnKicpKS5maWx0ZXIoZnVuY3Rpb24ob2JqKXtyZXR1cm4gb2JqICE9IGVsO30pO1xuXHQvL307XG5cdC8vXG5cdC8vSFRNTEVsZW1lbnQucHJvdG90eXBlLmNzcyA9IE5vZGUucHJvdG90eXBlLmNzcyA9IGZ1bmN0aW9uKHJ1bGVPck9iamVjdCwgdmFsdWUpIHtcblx0Ly9cdHZhciBlbCA9IHRoaXM7XG5cdC8vXG5cdC8vXHRpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuXHQvL1x0XHRyZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcyk7XG5cdC8vXHR9XG5cdC8vXG5cdC8vXHRlbHNlIGlmICh0eXBlb2YgcnVsZU9yT2JqZWN0ID09PSAnb2JqZWN0JykgeyAvLyBhbiBvYmplY3Qgd2FzIHBhc3NlZCBpblxuXHQvL1x0XHRPYmplY3Qua2V5cyhydWxlT3JPYmplY3QpLmZvckVhY2goZnVuY3Rpb24oa2V5KXtcblx0Ly9cdFx0XHRlbC5zdHlsZVtrZXldID0gcnVsZU9yT2JqZWN0W2tleV07XG5cdC8vXHRcdH0pO1xuXHQvL1x0fVxuXHQvL1xuXHQvL1x0ZWxzZSBpZiAodHlwZW9mIHJ1bGVPck9iamVjdCA9PT0gJ3N0cmluZycgJiYgdmFsdWUgIT09IHVuZGVmaW5lZCkgeyAvLyAyIHN0cmluZyB2YWx1ZXMgd2VyZSBwYXNzZWQgaW5cblx0Ly9cdFx0ZWwuc3R5bGVbcnVsZU9yT2JqZWN0XSA9IHZhbHVlO1xuXHQvL1x0fVxuXHQvL307XG5cdC8vXG5cdC8vSFRNTEVsZW1lbnQucHJvdG90eXBlLmxpc3RlbiA9IE5vZGUucHJvdG90eXBlLmxpc3RlbiA9IGZ1bmN0aW9uKGNhbGxiYWNrLCBldmVudE5hbWUpe1xuXHQvL1x0dGhpcy5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2spO1xuXHQvL307XG5cdC8vXG5cdC8vSFRNTEVsZW1lbnQucHJvdG90eXBlLmVtcHR5ID0gTm9kZS5wcm90b3R5cGUuZW1wdHkgPSBmdW5jdGlvbigpIHtcblx0Ly9cdHRoaXMuaW5uZXJIVE1MID0gXCJcIjtcblx0Ly99O1xuXHQvL1xuXHQvL0hUTUxFbGVtZW50LnByb3RvdHlwZS5maWxsID0gTm9kZS5wcm90b3R5cGUuZmlsbCA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcblx0Ly9cdHZhciBlbCA9IHRoaXM7XG5cdC8vXHRlbC5lbXB0eSgpO1xuXHQvL1xuXHQvL1x0aWYgKEFycmF5LmlzQXJyYXkoY29udGVudCkpIHtcblx0Ly9cdFx0Y29udGVudC5mb3JFYWNoKGZ1bmN0aW9uKG9iail7XG5cdC8vXHRcdFx0aWYgKG9iailcblx0Ly9cdFx0XHRcdGVsLmFwcGVuZENoaWxkKG9iaik7XG5cdC8vXHRcdH0pO1xuXHQvL1xuXHQvL1x0XHRyZXR1cm47XG5cdC8vXHR9XG5cdC8vXG5cdC8vXHRpZiAoIWNvbnRlbnQubm9kZVR5cGUpIHtcblx0Ly9cdFx0dmFyIHRleHRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRleHRcIik7XG5cdC8vXHRcdHRleHRFbGVtZW50LmlubmVySFRNTCA9IGNvbnRlbnQ7XG5cdC8vXHRcdGNvbnRlbnQgPSB0ZXh0RWxlbWVudDtcblx0Ly9cdH1cblx0Ly9cblx0Ly9cdHRoaXMuYXBwZW5kQ2hpbGQoY29udGVudCk7XG5cdC8vfTtcblx0Ly9cblx0Ly9IVE1MRWxlbWVudC5wcm90b3R5cGUuaXNIZWlyT2ZDbGFzcyA9IE5vZGUucHJvdG90eXBlLmlzSGVpck9mQ2xhc3MgPSBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG5cdC8vXHRpZiAodGhpcyA9PT0gz4AxKCdodG1sJykpIHJldHVybiBmYWxzZTtcblx0Ly9cblx0Ly9cdHZhciBwYXJlbnQgPSB0aGlzLnBhcmVudE5vZGU7XG5cdC8vXG5cdC8vXHRpZiAocGFyZW50KSB7XG5cdC8vXHRcdHdoaWxlIChwYXJlbnQgIT09IM+AMSgnYm9keScpKSB7XG5cdC8vXHRcdFx0aWYgKHBhcmVudC5oYXNDbGFzcyhjbGFzc05hbWUpKSByZXR1cm4gdHJ1ZTtcblx0Ly9cblx0Ly9cdFx0XHRwYXJlbnQgPSBwYXJlbnQucGFyZW50Tm9kZTtcblx0Ly9cdFx0fVxuXHQvL1x0fVxuXHQvL1xuXHQvL1x0cmV0dXJuIGZhbHNlO1xuXHQvL307XG5cdC8vXG5cdC8vSFRNTEVsZW1lbnQucHJvdG90eXBlLnBhcmVudHMgPSBOb2RlLnByb3RvdHlwZS5wYXJlbnRzID0gZnVuY3Rpb24gKHNlbGVjdG9yKSB7XG5cdC8vXHR2YXIgcGFyZW50cyA9IFtdO1xuXHQvL1x0dmFyIGltbWVkaWF0ZVBhcmVudCA9IHRoaXMucGFyZW50Tm9kZTtcblx0Ly9cblx0Ly9cdHdoaWxlKGltbWVkaWF0ZVBhcmVudCAhPT0gz4AxKCdodG1sJykpIHtcblx0Ly9cdFx0cGFyZW50cy5wdXNoKGltbWVkaWF0ZVBhcmVudCk7XG5cdC8vXHRcdGltbWVkaWF0ZVBhcmVudCA9IGltbWVkaWF0ZVBhcmVudC5wYXJlbnROb2RlO1xuXHQvL1x0fVxuXHQvL1xuXHQvL1x0aWYgKHNlbGVjdG9yKSB7XG5cdC8vXHRcdHZhciBzZWxlY3RlZEVsZW1lbnRzID0gz4Aoc2VsZWN0b3IpO1xuXHQvL1x0XHR2YXIgc2VsZWN0ZWRQYXJlbnRzID0gW107XG5cdC8vXHRcdHNlbGVjdGVkRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbihlbCl7XG5cdC8vXHRcdFx0aWYgKHBhcmVudHMuaW5kZXhPZihlbCkgIT09IC0xKSBzZWxlY3RlZFBhcmVudHMucHVzaChlbCk7XG5cdC8vXHRcdH0pO1xuXHQvL1xuXHQvL1x0XHRwYXJlbnRzID0gc2VsZWN0ZWRQYXJlbnRzO1xuXHQvL1x0fVxuXHQvL1xuXHQvL1x0cmV0dXJuIHBhcmVudHM7XG5cdC8vfTtcblx0Ly9cblx0Ly9IVE1MRWxlbWVudC5wcm90b3R5cGUua2lkcyA9IE5vZGUucHJvdG90eXBlLmtpZHMgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuXHQvL1x0dmFyIGNoaWxkTm9kZXMgPSB0aGlzLmNoaWxkTm9kZXM7XG5cdC8vXHRpZiAoIXNlbGVjdG9yKSByZXR1cm4gY2hpbGROb2Rlcztcblx0Ly9cblx0Ly9cdHZhciBkZXNjZW5kZW50cyA9IHRoaXMuz4Aoc2VsZWN0b3IpO1xuXHQvL1x0dmFyIGNoaWxkcmVuID0gW107XG5cdC8vXG5cdC8vXHRjaGlsZE5vZGVzLmZvckVhY2goZnVuY3Rpb24obm9kZSl7XG5cdC8vXHRcdGlmIChkZXNjZW5kZW50cy5pbmRleE9mKG5vZGUpICE9PSAtMSkge1xuXHQvL1x0XHRcdGNoaWxkcmVuLnB1c2gobm9kZSk7XG5cdC8vXHRcdH1cblx0Ly9cdH0pO1xuXHQvL1xuXHQvL1x0cmV0dXJuIGNoaWxkcmVuO1xuXHQvL307XG5cdC8vXG5cdC8vdmFyIGFycmF5TWV0aG9kcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKEFycmF5LnByb3RvdHlwZSk7XG5cdC8vYXJyYXlNZXRob2RzLmZvckVhY2goZnVuY3Rpb24obWV0aG9kTmFtZSl7XG5cdC8vXHRpZihtZXRob2ROYW1lICE9PSBcImxlbmd0aFwiKSB7XG5cdC8vXHRcdE5vZGVMaXN0LnByb3RvdHlwZVttZXRob2ROYW1lXSA9IEFycmF5LnByb3RvdHlwZVttZXRob2ROYW1lXTtcblx0Ly9cdH1cblx0Ly99KTtcblx0Ly9cblx0Ly/PgC5tb2RzID0gW107XG5cdC8vXG5cdC8vZnVuY3Rpb24gbG9hZE1vZHMoKSB7XG5cdC8vXHTPgC5jbGVhbihsb2FkTW9kcyk7XG5cdC8vXHTPgC5tb2RzLmZvckVhY2goZnVuY3Rpb24oaW5pdCl7XG5cdC8vXHRcdGluaXQoKTtcblx0Ly9cdH0pO1xuXHQvL31cblx0Ly9cblx0Ly/PgC5saXN0ZW4obG9hZE1vZHMpO1xufSkoKTsgIC8vIGVuZCDPgCIsIiAvL21vZGFsIGNsb3NlIGJ1dHRvblxuKGZ1bmN0aW9uKCl7XG5cdC8vz4AubW9kYWxDbG9zZUJ1dHRvbiA9IGZ1bmN0aW9uKGNsb3NpbmdGdW5jdGlvbil7XG5cdC8vXHRyZXR1cm4gz4AuYnV0dG9uKCdwaS1tb2RhbC1jbG9zZS1idXR0b24nLCBudWxsLCBudWxsLCBjbG9zaW5nRnVuY3Rpb24pO1xuXHQvL307XG59KSgpO1xuIiwiIiwiLy8vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIM+ALXB1c2htZW51LmpzXG4vLyAvLyBUT0RPOiAgVVNBR0UgQU5EIEFQSSBSRUZFUkVOQ0Vcbi8vIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cbi8vIERFUEVOREVOQ0lFUzpcbi8vXG4vLyBIQUwuanNcbi8vXG4vLyBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXG4vLyBEQVRBIEFUVFJJQlVURVM6XG4vL1xuLy8gc2lkZTogW1wibGVmdFwiLCBcInJpZ2h0XCJdXG4vLyBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXG4vLyBNQVJLVVAgQU5EIERFRkFVTFRTOlxuLy9cbi8vXHQ8ZGl2IGNsYXNzPVwicGktcHVzaG1lbnVcIiBpZD1cIm15UHVzaE1lbnVcIj5cbi8vXHRcdCA8dWw+XG4vL1x0XHRcdCA8bGk+PGEgaHJlZj1cIiNcIj5mb288L2E+PC9saT5cbi8vXHRcdFx0IDxsaT48YSBocmVmPVwiI1wiPmJhcjwvYT48L2xpPlxuLy9cdFx0XHQgPGxpPjxhIGhyZWY9XCIjXCI+Z3Jvbms8L2E+PC9saT5cbi8vXHRcdFx0IDxsaT48YSBocmVmPVwiI1wiPmZsZWVibGVzPC9hPjwvbGk+XG4vL1x0XHRcdCA8bGk+PGEgaHJlZj1cIiNcIj5zZXB1bHZlZGE8L2E+PC9saT5cbi8vXHRcdCA8L3VsPlxuLy9cdDwvZGl2PlxuLy9cbi8vZWxzZXdoZXJlLi4uXG4vL1xuLy8gPGJ1dHRvbiBvbmNsaWNrPVwiz4AtcHVzaG1lbnUuc2hvdygnbXlQdXNoTWVudScpXCI+c2hvdyBtZW51PC9idXR0b24+XG4vL1xuLy8gX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xuLy8gR0VORVJBVEVEIEhUTUw6XG4vL1xuLy9cbi8vIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cbi8vIEFQSVxuLy9cbi8vXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vL1xuLy/PgC5wdXNobWVudSA9IChmdW5jdGlvbigpe1xuLy9cdHZhciBhbGxQdXNoTWVudXMgPSB7fTtcbi8vXG4vL1x0ZnVuY3Rpb24gaW5pdCgpe1xuLy9cdFx0z4AoJ1tkYXRhLWF1dG8tYnVyZ2VyXScpLmZvckVhY2goZnVuY3Rpb24oY29udGFpbmVyKXtcbi8vXHRcdFx0dmFyIGlkID0gY29udGFpbmVyLmdldEF0dHJpYnV0ZSgnZGF0YS1hdXRvLWJ1cmdlcicpO1xuLy9cbi8vXHRcdFx0dmFyIGF1dG9CdXJnZXIgPSDPgGQoaWQpIHx8IM+ALmRpdigncGktcHVzaG1lbnUnLCBpZCk7XG4vL1x0XHRcdHZhciB1bCA9IGF1dG9CdXJnZXIuz4AxKCd1bCcpIHx8IM+ALnVsKCk7XG4vL1xuLy9cdFx0XHRjb250YWluZXIuz4AoJ2FbaHJlZl0sIGJ1dHRvbicpLmZvckVhY2goZnVuY3Rpb24gKG9iaikge1xuLy9cdFx0XHRcdGlmICghYm9vbGVhbkF0dHJpYnV0ZVZhbHVlKG9iaiwgJ2RhdGEtYXV0by1idXJnZXItZXhjbHVkZScsIGZhbHNlKSkge1xuLy9cdFx0XHRcdFx0dmFyIGNsb25lID0gb2JqLmNsb25lTm9kZSh0cnVlKTtcbi8vXHRcdFx0XHRcdGNsb25lLmlkID0gJyc7XG4vL1xuLy9cdFx0XHRcdFx0aWYgKGNsb25lLnRhZ05hbWUgPT0gXCJCVVRUT05cIikge1xuLy9cdFx0XHRcdFx0XHR2YXIgYVRhZyA9IM+ALnNyY0VsZW1lbnQoJ2EnKTtcbi8vXHRcdFx0XHRcdFx0YVRhZy5ocmVmID0gJyc7XG4vL1x0XHRcdFx0XHRcdGFUYWcuaW5uZXJIVE1MID0gY2xvbmUuaW5uZXJIVE1MO1xuLy9cdFx0XHRcdFx0XHRhVGFnLm9uY2xpY2sgPSBjbG9uZS5vbmNsaWNrO1xuLy9cdFx0XHRcdFx0XHRjbG9uZSA9IGFUYWc7XG4vL1x0XHRcdFx0XHR9XG4vL1x0XHRcdFx0XHR1bC5hZGQoz4AubGkoMCwgMCwgY2xvbmUpKTtcbi8vXHRcdFx0XHR9XG4vL1x0XHRcdH0pO1xuLy9cbi8vXHRcdFx0YXV0b0J1cmdlci5hZGQodWwpO1xuLy9cdFx0XHTPgDEoJ2JvZHknKS5hZGQoYXV0b0J1cmdlcik7XG4vL1x0XHR9KTtcbi8vXG4vL1x0XHTPgChcIi5waS1wdXNobWVudVwiKS5mb3JFYWNoKGZ1bmN0aW9uKGVsKXtcbi8vXHRcdFx0YWxsUHVzaE1lbnVzW2VsLmlkXSA9IFB1c2hNZW51KGVsKTtcbi8vXHRcdH0pO1xuLy9cbi8vXHRcdM+ALnNldFRyaWdnZXJzKCdwdXNobWVudScsIM+ALnB1c2htZW51KTtcbi8vXHR9XG4vL1xuLy9cdGZ1bmN0aW9uIHNob3cob2JqSWQpIHtcbi8vXHRcdGFsbFB1c2hNZW51c1tvYmpJZF0uZXhwb3NlKCk7XG4vL1x0fVxuLy9cbi8vXHQvLyBUT0RPOiBkaXNtaXNzIG9uIGNsaWNrP1xuLy9cdC8vIHRoaXMgd29ya3M6XG4vL1xuLy9cdC8vz4AoJy5waS1wdXNobWVudSBsaSBhJykuZm9yRWFjaChmdW5jdGlvbihhKXtcbi8vXHQvL1x0YS5vbmNsaWNrID0gZnVuY3Rpb24oKXtcbi8vXHQvL1x0XHR0aGlzLnBhcmVudCgnLnBpLXB1c2htZW51Jykuz4AxKCcucGktbW9kYWwtY2xvc2UtYnV0dG9uJykuY2xpY2soKTtcbi8vXHQvL1x0XHRjb25zb2xlLmxvZyhcIm1lc3NhZ2VcIik7XG4vL1x0Ly9cdH07XG4vL1x0Ly99KTtcbi8vXG4vL1xuLy9cdGZ1bmN0aW9uIFB1c2hNZW51KGVsKSB7XG4vL1x0XHR2YXIgaHRtbCA9IM+AMSgnaHRtbCcpO1xuLy9cdFx0dmFyIGJvZHkgPSDPgDEoJ2JvZHknKTtcbi8vXG4vL1x0XHR2YXIgb3ZlcmxheSA9IM+ALmRpdihcIm92ZXJsYXlcIik7XG4vL1x0XHR2YXIgY29udGVudCA9IM+ALmRpdignY29udGVudCcsIG51bGwsIGVsLs+AMSgnKicpKTtcbi8vXG4vL1x0XHR2YXIgc2lkZSA9IGVsLmdldEF0dHJpYnV0ZShcImRhdGEtc2lkZVwiKSB8fCBcInJpZ2h0XCI7XG4vL1xuLy9cdFx0dmFyIHNsZWQgPSDPgC5kaXYoXCJzbGVkXCIpO1xuLy9cdFx0c2xlZC5jc3Moc2lkZSwgMCk7XG4vL1xuLy9cdFx0dmFyIHRvcEJhciA9IM+ALmRpdihcInRvcC1iYXJcIik7XG4vL1xuLy9cdFx0dG9wQmFyLmZpbGwoz4AubW9kYWxDbG9zZUJ1dHRvbihjbG9zZU1lKSk7XG4vL1x0XHRzbGVkLmZpbGwoW3RvcEJhciwgY29udGVudF0pO1xuLy9cbi8vXHRcdG92ZXJsYXkuZmlsbChzbGVkKTtcbi8vXHRcdGVsLmZpbGwob3ZlcmxheSk7XG4vL1xuLy9cdFx0c2xlZC5vbmNsaWNrID0gZnVuY3Rpb24oZSl7XG4vL1x0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4vL1x0XHR9O1xuLy9cbi8vXHRcdG92ZXJsYXkub25jbGljayA9IGNsb3NlTWU7XG4vL1xuLy9cdFx0z4AubGlzdGVuKGNsb3NlTWUsICdyZXNpemUnKTtcbi8vXG4vL1x0XHRmdW5jdGlvbiBjbG9zZU1lKGUpIHtcbi8vXHRcdFx0dmFyIHQgPSBlLnRhcmdldDtcbi8vXHRcdFx0aWYgKHQgPT0gc2xlZCB8fCB0ID09IHRvcEJhcikgcmV0dXJuO1xuLy9cbi8vXHRcdFx0ZWwua2lsbENsYXNzKFwib25cIik7XG4vL1x0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbi8vXHRcdFx0XHRlbC5jc3Moe2Rpc3BsYXk6IFwibm9uZVwifSk7XG4vL1xuLy9cdFx0XHRcdGJvZHkua2lsbENsYXNzKFwib3ZlcmxheS1vblwiKTtcbi8vXHRcdFx0fSwgMzAwKTtcbi8vXHRcdH1cbi8vXG4vL1x0XHRmdW5jdGlvbiBleHBvc2VNZSgpe1xuLy9cdFx0XHRib2R5LmFkZENsYXNzKFwib3ZlcmxheS1vblwiKTsgLy8gaW4gdGhlIGRlZmF1bHQgY29uZmlnLCBraWxscyBib2R5IHNjcm9sbGluZ1xuLy9cbi8vXHRcdFx0ZWwuY3NzKHtcbi8vXHRcdFx0XHRkaXNwbGF5OiBcImJsb2NrXCIsXG4vL1x0XHRcdFx0ekluZGV4OiDPgC5oaWdoZXN0WigpXG4vL1x0XHRcdH0pO1xuLy9cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4vL1x0XHRcdFx0ZWwuYWRkQ2xhc3MoXCJvblwiKTtcbi8vXHRcdFx0fSwgMTApO1xuLy9cdFx0fVxuLy9cbi8vXHRcdHJldHVybiB7XG4vL1x0XHRcdGV4cG9zZTogZXhwb3NlTWVcbi8vXHRcdH07XG4vL1x0fVxuLy9cbi8vXHQvL8+ALm1vZHMucHVzaChpbml0KTtcbi8vXG4vL1x0cmV0dXJuIHtcbi8vXHRcdHNob3c6IHNob3dcbi8vXHR9O1xuLy99KSgpO1xuIiwiLy8gZ2xvYmFsc1xudmFyIGJvZHk7XG5cbi8vaGVscGVyIGZ1bmN0aW9uc1xuZnVuY3Rpb24gY2xhc3NPbkNvbmRpdGlvbihlbGVtZW50LCBjbGFzc05hbWUsIGNvbmRpdGlvbikge1xuXHRpZiAoY29uZGl0aW9uKVxuXHRcdCQoZWxlbWVudCkuYWRkQ2xhc3MoY2xhc3NOYW1lKTtcblx0ZWxzZVxuXHRcdCQoZWxlbWVudCkucmVtb3ZlQ2xhc3MoY2xhc3NOYW1lKTtcbn1cblxuZnVuY3Rpb24gcHgobil7XG5cdHJldHVybiBuICsgJ3B4Jztcbn1cblxuZnVuY3Rpb24gbmV3RE9NRWxlbWVudCh0YWcsIGNsYXNzTmFtZSwgaWQpe1xuXHR2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG5cblx0aWYgKGNsYXNzTmFtZSkgZWwuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuXHRpZiAoaWQpIGVsLmlkID0gaWQ7XG5cblx0cmV0dXJuIGVsO1xufVxuXG5cbnZhciBrdWIgPSAoZnVuY3Rpb24gKCkge1xuXHR2YXIgSEVBREVSX0hFSUdIVDtcblx0dmFyIGh0bWwsIGhlYWRlciwgbWFpbk5hdiwgcXVpY2tzdGFydEJ1dHRvbiwgaGVybywgZW5jeWNsb3BlZGlhLCBmb290ZXIsIHdpc2hGaWVsZDtcblxuXHQkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG5cdFx0aHRtbCA9ICQoJ2h0bWwnKTtcblx0XHRib2R5ID0gJCgnYm9keScpO1xuXHRcdGhlYWRlciA9ICQoJ2hlYWRlcicpO1xuXHRcdG1haW5OYXYgPSAkKCcjbWFpbk5hdicpO1xuXHRcdHdpc2hGaWVsZCA9ICQoJyN3aXNoRmllbGQnKTtcblx0XHRxdWlja3N0YXJ0QnV0dG9uID0gJCgnI3F1aWNrc3RhcnRCdXR0b24nKTtcblx0XHRoZXJvID0gJCgnI2hlcm8nKTtcblx0XHRlbmN5Y2xvcGVkaWEgPSAkKCcjZW5jeWNsb3BlZGlhJyk7XG5cdFx0Zm9vdGVyID0gJCgnZm9vdGVyJyk7XG5cdFx0SEVBREVSX0hFSUdIVCA9IGhlYWRlci5vdXRlckhlaWdodCgpO1xuXG5cdFx0cmVzZXRUaGVWaWV3KCk7XG5cblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcmVzZXRUaGVWaWV3KTtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgcmVzZXRUaGVWaWV3KTtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleXN0cm9rZXMpO1xuXHRcdHdpc2hGaWVsZFswXS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5c3Ryb2tlcyk7XG5cblx0XHRkb2N1bWVudC5vbnVubG9hZCA9IGZ1bmN0aW9uKCl7XG5cdFx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcmVzZXRUaGVWaWV3KTtcblx0XHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCByZXNldFRoZVZpZXcpO1xuXHRcdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlzdHJva2VzKTtcblx0XHRcdHdpc2hGaWVsZFswXS5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5c3Ryb2tlcyk7XG5cdFx0fTtcblxuXHRcdCQoJy5kcm9wZG93bicpLmVhY2goZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIGRyb3Bkb3duID0gJCh0aGlzKTtcblx0XHRcdHZhciByZWFkb3V0ID0gZHJvcGRvd24uZmluZCgnLnJlYWRvdXQnKTtcblxuXHRcdFx0cmVhZG91dC5odG1sKGRyb3Bkb3duLmZpbmQoJ2EnKVswXS5pbm5lckhUTUwpO1xuXHRcdFx0cmVhZG91dC5jbGljayhmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGRyb3Bkb3duLnRvZ2dsZUNsYXNzKCdvbicpO1xuXHRcdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZU9wZW5Ecm9wZG93bik7XG5cblx0XHRcdFx0ZnVuY3Rpb24gY2xvc2VPcGVuRHJvcGRvd24oZSkge1xuXHRcdFx0XHRcdGlmIChkcm9wZG93bi5oYXNDbGFzcygnb24nKSAmJiAhKGRyb3Bkb3duV2FzQ2xpY2tlZChlKSkpIHtcblx0XHRcdFx0XHRcdGRyb3Bkb3duLnJlbW92ZUNsYXNzKCdvbicpO1xuXHRcdFx0XHRcdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VPcGVuRHJvcGRvd24pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZ1bmN0aW9uIGRyb3Bkb3duV2FzQ2xpY2tlZChlKSB7XG5cdFx0XHRcdFx0cmV0dXJuICQoZS50YXJnZXQpLnBhcmVudHMoJy5kcm9wZG93bicpLmxlbmd0aDtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHRzZXRJbnRlcnZhbChzZXRGb290ZXJUeXBlLCAxMCk7XG5cdH0pO1xuXG5cdGZ1bmN0aW9uIHNldEZvb3RlclR5cGUoKSB7XG5cdFx0aWYgKGh0bWxbMF0uaWQgPT0gXCJkb2NzXCIpIHtcblx0XHRcdHZhciBib2R5SGVpZ2h0ID0gaGVyby5vdXRlckhlaWdodCgpICsgZW5jeWNsb3BlZGlhLm91dGVySGVpZ2h0KCk7XG5cdFx0XHR2YXIgZm9vdGVySGVpZ2h0ID0gZm9vdGVyLm91dGVySGVpZ2h0KCk7XG5cblx0XHRcdGNsYXNzT25Db25kaXRpb24oYm9keSwgJ2ZpeGVkJywgd2luZG93LmlubmVySGVpZ2h0IC0gZm9vdGVySGVpZ2h0ID4gYm9keUhlaWdodCk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gcmVzZXRUaGVWaWV3KCkge1xuXHRcdGlmIChodG1sLmhhc0NsYXNzKCdvcGVuLW5hdicpKSB7XG5cdFx0XHR0b2dnbGVNZW51KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdEhFQURFUl9IRUlHSFQgPSBoZWFkZXIub3V0ZXJIZWlnaHQoKTtcblx0XHR9XG5cblx0XHRjbGFzc09uQ29uZGl0aW9uKGh0bWwsICdmbGlwLW5hdicsIHdpbmRvdy5wYWdlWU9mZnNldCA+IDApO1xuXHR9XG5cblx0ZnVuY3Rpb24gdG9nZ2xlTWVudSgpIHtcblx0XHRpZiAod2luZG93LmlubmVyV2lkdGggPCA4MDApIHtcblx0XHRcdM+ALnB1c2htZW51LnNob3coJ3ByaW1hcnknKTtcblx0XHR9XG5cblx0XHRlbHNlIHtcblx0XHRcdHZhciBuZXdIZWlnaHQgPSBIRUFERVJfSEVJR0hUO1xuXG5cdFx0XHRpZiAoIWh0bWwuaGFzQ2xhc3MoJ29wZW4tbmF2JykpIHtcblx0XHRcdFx0bmV3SGVpZ2h0ID0gbWFpbk5hdi5vdXRlckhlaWdodCgpO1xuXHRcdFx0fVxuXG5cdFx0XHRoZWFkZXIuY3NzKHtoZWlnaHQ6IHB4KG5ld0hlaWdodCl9KTtcblx0XHRcdGh0bWwudG9nZ2xlQ2xhc3MoJ29wZW4tbmF2Jyk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gc3VibWl0V2lzaCh0ZXh0ZmllbGQpIHtcblx0XHR3aW5kb3cubG9jYXRpb24ucmVwbGFjZShcImh0dHBzOi8vZ2l0aHViLmNvbS9rdWJlcm5ldGVzL2t1YmVybmV0ZXMuZ2l0aHViLmlvL2lzc3Vlcy9uZXc/dGl0bGU9SSUyMHdpc2glMjBcIiArXG5cdFx0XHR3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyBcIiUyMFwiICsgdGV4dGZpZWxkLnZhbHVlICsgXCImYm9keT1JJTIwd2lzaCUyMFwiICtcblx0XHRcdHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArIFwiJTIwXCIgKyB0ZXh0ZmllbGQudmFsdWUpO1xuXG5cdFx0dGV4dGZpZWxkLnZhbHVlID0gJyc7XG5cdFx0dGV4dGZpZWxkLmJsdXIoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGhhbmRsZUtleXN0cm9rZXMoZSkge1xuXHRcdHN3aXRjaCAoZS53aGljaCkge1xuXHRcdFx0Y2FzZSAxMzoge1xuXHRcdFx0XHRpZiAoZS5jdXJyZW50VGFyZ2V0ID09PSB3aXNoRmllbGQpIHtcblx0XHRcdFx0XHRzdWJtaXRXaXNoKHdpc2hGaWVsZCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdGNhc2UgMjc6IHtcblx0XHRcdFx0aWYgKGh0bWwuaGFzQ2xhc3MoJ29wZW4tbmF2JykpIHtcblx0XHRcdFx0XHR0b2dnbGVNZW51KCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHtcblx0XHR0b2dnbGVNZW51OiB0b2dnbGVNZW51XG5cdH07XG59KSgpO1xuXG5cbi8vIGFjY29yZGlvblxuKGZ1bmN0aW9uKCl7XG5cdHZhciB5YWggPSB0cnVlO1xuXHR2YXIgbW92aW5nID0gZmFsc2U7XG5cdHZhciBDU1NfQlJPV1NFUl9IQUNLX0RFTEFZID0gMjU7XG5cblx0JChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcblx0XHQvLyBTYWZhcmkgY2hva2VzIG9uIHRoZSBhbmltYXRpb24gaGVyZSwgc28uLi5cblx0XHRpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdDaHJvbWUnKSA9PSAtMSAmJiBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ1NhZmFyaScpICE9IC0xKXtcblx0XHRcdHZhciBoYWNrU3R5bGUgPSBuZXdET01FbGVtZW50KCdzdHlsZScpO1xuXHRcdFx0aGFja1N0eWxlLmlubmVySFRNTCA9ICcucGktYWNjb3JkaW9uIC53cmFwcGVye3RyYW5zaXRpb246IG5vbmV9Jztcblx0XHRcdGJvZHkuYXBwZW5kKGhhY2tTdHlsZSk7XG5cdFx0fVxuXHRcdC8vIEdyb3NzLlxuXG5cdFx0JCgnLnBpLWFjY29yZGlvbicpLmVhY2goZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIGFjY29yZGlvbiA9IHRoaXM7XG5cdFx0XHR2YXIgY29udGVudCA9IHRoaXMuaW5uZXJIVE1MO1xuXHRcdFx0dmFyIGNvbnRhaW5lciA9IG5ld0RPTUVsZW1lbnQoJ2RpdicsICdjb250YWluZXInKTtcblx0XHRcdGNvbnRhaW5lci5pbm5lckhUTUwgPSBjb250ZW50O1xuXHRcdFx0JChhY2NvcmRpb24pLmVtcHR5KCk7XG5cdFx0XHRhY2NvcmRpb24uYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcblx0XHRcdENvbGxhcHNlQm94KCQoY29udGFpbmVyKSk7XG5cdFx0fSk7XG5cblx0XHRzZXRZQUgoKTtcblxuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0eWFoID0gZmFsc2U7XG5cdFx0fSwgNTAwKTtcblx0fSk7XG5cblx0ZnVuY3Rpb24gQ29sbGFwc2VCb3goY29udGFpbmVyKXtcblx0XHRjb250YWluZXIuY2hpbGRyZW4oJy5pdGVtJykuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0Ly8gYnVpbGQgdGhlIFRPQyBET01cblx0XHRcdC8vIHRoZSBhbmltYXRlZCBvcGVuL2Nsb3NlIGlzIGVuYWJsZWQgYnkgaGF2aW5nIGVhY2ggaXRlbSdzIGNvbnRlbnQgZXhpc3QgaW4gdGhlIGZsb3csIGF0IGl0cyBuYXR1cmFsIGhlaWdodCxcblx0XHRcdC8vIGVuY2xvc2VkIGluIGEgd3JhcHBlciB3aXRoIGhlaWdodCA9IDAgd2hlbiBjbG9zZWQsIGFuZCBoZWlnaHQgPSBjb250ZW50SGVpZ2h0IHdoZW4gb3Blbi5cblx0XHRcdHZhciBpdGVtID0gdGhpcztcblxuXHRcdFx0Ly8gb25seSBhZGQgY29udGVudCB3cmFwcGVycyB0byBjb250YWluZXJzLCBub3QgdG8gbGlua3Ncblx0XHRcdHZhciBpc0NvbnRhaW5lciA9IGl0ZW0udGFnTmFtZSA9PT0gJ0RJVic7XG5cblx0XHRcdHZhciB0aXRsZVRleHQgPSBpdGVtLmdldEF0dHJpYnV0ZSgnZGF0YS10aXRsZScpO1xuXHRcdFx0dmFyIHRpdGxlID0gbmV3RE9NRWxlbWVudCgnZGl2JywgJ3RpdGxlJyk7XG5cdFx0XHR0aXRsZS5pbm5lckhUTUwgPSB0aXRsZVRleHQ7XG5cblx0XHRcdHZhciB3cmFwcGVyLCBjb250ZW50O1xuXG5cdFx0XHRpZiAoaXNDb250YWluZXIpIHtcblx0XHRcdFx0d3JhcHBlciA9IG5ld0RPTUVsZW1lbnQoJ2RpdicsICd3cmFwcGVyJyk7XG5cdFx0XHRcdGNvbnRlbnQgPSBuZXdET01FbGVtZW50KCdkaXYnLCAnY29udGVudCcpO1xuXHRcdFx0XHRjb250ZW50LmlubmVySFRNTCA9IGl0ZW0uaW5uZXJIVE1MO1xuXHRcdFx0XHR3cmFwcGVyLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xuXHRcdFx0fVxuXG5cdFx0XHRpdGVtLmlubmVySFRNTCA9ICcnO1xuXHRcdFx0aXRlbS5hcHBlbmRDaGlsZCh0aXRsZSk7XG5cblx0XHRcdGlmICh3cmFwcGVyKSB7XG5cdFx0XHRcdGl0ZW0uYXBwZW5kQ2hpbGQod3JhcHBlcik7XG5cdFx0XHRcdCQod3JhcHBlcikuY3NzKHtoZWlnaHQ6IDB9KTtcblx0XHRcdH1cblxuXG5cdFx0XHQkKHRpdGxlKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdFx0XHRpZiAoIXlhaCkge1xuXHRcdFx0XHRcdGlmIChtb3ZpbmcpIHJldHVybjtcblx0XHRcdFx0XHRtb3ZpbmcgPSB0cnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGNvbnRhaW5lclswXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2luZ2xlJykpIHtcblx0XHRcdFx0XHR2YXIgb3BlblNpYmxpbmdzID0gaXRlbS5zaWJsaW5ncygpLmZpbHRlcihmdW5jdGlvbihzaWIpe3JldHVybiBzaWIuaGFzQ2xhc3MoJ29uJyk7fSk7XG5cdFx0XHRcdFx0b3BlblNpYmxpbmdzLmZvckVhY2goZnVuY3Rpb24oc2libGluZyl7XG5cdFx0XHRcdFx0XHR0b2dnbGVJdGVtKHNpYmxpbmcpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdGlmICghaXNDb250YWluZXIpIHtcblx0XHRcdFx0XHRcdG1vdmluZyA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0b2dnbGVJdGVtKGl0ZW0pO1xuXHRcdFx0XHR9LCBDU1NfQlJPV1NFUl9IQUNLX0RFTEFZKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRmdW5jdGlvbiB0b2dnbGVJdGVtKHRoaXNJdGVtKXtcblx0XHRcdFx0dmFyIHRoaXNXcmFwcGVyID0gJCh0aGlzSXRlbSkuZmluZCgnLndyYXBwZXInKS5lcSgwKTtcblxuXHRcdFx0XHRpZiAoIXRoaXNXcmFwcGVyKSByZXR1cm47XG5cblx0XHRcdFx0dmFyIGNvbnRlbnRIZWlnaHQgPSB0aGlzV3JhcHBlci5maW5kKCcuY29udGVudCcpLmVxKDApLmlubmVySGVpZ2h0KCkgKyAncHgnO1xuXG5cdFx0XHRcdGlmICgkKHRoaXNJdGVtKS5oYXNDbGFzcygnb24nKSkge1xuXHRcdFx0XHRcdHRoaXNXcmFwcGVyLmNzcyh7aGVpZ2h0OiBjb250ZW50SGVpZ2h0fSk7XG5cdFx0XHRcdFx0JCh0aGlzSXRlbSkucmVtb3ZlQ2xhc3MoJ29uJyk7XG5cblx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHR0aGlzV3JhcHBlci5jc3Moe2hlaWdodDogMH0pO1xuXHRcdFx0XHRcdFx0bW92aW5nID0gZmFsc2U7XG5cdFx0XHRcdFx0fSwgQ1NTX0JST1dTRVJfSEFDS19ERUxBWSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JChpdGVtKS5hZGRDbGFzcygnb24nKTtcblx0XHRcdFx0XHR0aGlzV3JhcHBlci5jc3Moe2hlaWdodDogY29udGVudEhlaWdodH0pO1xuXG5cdFx0XHRcdFx0dmFyIGR1cmF0aW9uID0gcGFyc2VGbG9hdChnZXRDb21wdXRlZFN0eWxlKHRoaXNXcmFwcGVyWzBdKS50cmFuc2l0aW9uRHVyYXRpb24pICogMTAwMDtcblxuXHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdHRoaXNXcmFwcGVyLmNzcyh7aGVpZ2h0OiAnJ30pO1xuXHRcdFx0XHRcdFx0bW92aW5nID0gZmFsc2U7XG5cdFx0XHRcdFx0fSwgZHVyYXRpb24pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmIChjb250ZW50KSB7XG5cdFx0XHRcdHZhciBpbm5lckNvbnRhaW5lcnMgPSAkKGNvbnRlbnQpLmNoaWxkcmVuKCcuY29udGFpbmVyJyk7XG5cdFx0XHRcdGlmIChpbm5lckNvbnRhaW5lcnMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdGlubmVyQ29udGFpbmVycy5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRDb2xsYXBzZUJveCgkKHRoaXMpKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2V0WUFIKCkge1xuXHRcdHZhciBwYXRobmFtZSA9IGxvY2F0aW9uLmhyZWYuc3BsaXQoJyMnKVswXTsgLy8gb24gcGFnZSBsb2FkLCBtYWtlIHN1cmUgdGhlIHBhZ2UgaXMgWUFIIGV2ZW4gaWYgdGhlcmUncyBhIGhhc2hcblx0XHR2YXIgY3VycmVudExpbmtzID0gW107XG5cblx0XHQkKCcucGktYWNjb3JkaW9uIGEnKS5lYWNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmIChwYXRobmFtZSA9PT0gdGhpcy5ocmVmKSBjdXJyZW50TGlua3MucHVzaCh0aGlzKTtcblx0XHR9KTtcblxuXHRcdGN1cnJlbnRMaW5rcy5mb3JFYWNoKGZ1bmN0aW9uICh5YWhMaW5rKSB7XG5cdFx0XHQkKHlhaExpbmspLnBhcmVudHMoJy5pdGVtJykuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0XHRjb25zb2xlLmxvZyh0aGlzKTtcblx0XHRcdFx0JCh0aGlzKS5hZGRDbGFzcygnb24nKTtcblx0XHRcdFx0JCh0aGlzKS5maW5kKCcud3JhcHBlcicpLmVxKDApLmNzcyh7aGVpZ2h0OiAnYXV0byd9KTtcblx0XHRcdFx0JCh0aGlzKS5maW5kKCcuY29udGVudCcpLmVxKDApLmNzcyh7b3BhY2l0eTogMX0pO1xuXHRcdFx0fSk7XG5cblx0XHRcdCQoeWFoTGluaykuYWRkQ2xhc3MoJ3lhaCcpO1xuXHRcdFx0eWFoTGluay5vbmNsaWNrID0gZnVuY3Rpb24oZSl7ZS5wcmV2ZW50RGVmYXVsdCgpO307XG5cdFx0fSk7XG5cdH1cblxuXHQvL8+ALm1vZHMucHVzaChpbml0KTtcbn0pKCk7XG5cblxuXG4vLyBUT0RPOiBzY3JvbGxpbnRvdmlldyBpbi1wYWdlIFRPQyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
