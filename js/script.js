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

			var wrapper;

			if (isContainer) {
				var wrapper = newDOMElement('div', 'wrapper');
				var content = newDOMElement('div', 'content');
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

			var innerContainers = $(content).children('.container');
			if (innerContainers.length > 0) {
				innerContainers.each(function(){
					CollapseBox($(this));
				});
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFsZi5qcyIsIs+ALmpzIiwiz4AtYmFzZUNvbXBvbmVudHMuanMiLCLPgC1hY2NvcmRpb24vz4AtYWNjb3JkaW9uLmpzIiwiz4AtcHVzaG1lbnUvz4AtcHVzaG1lbnUuanMiLCJzY3JpcHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeFJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoic2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gYWRvcmFibGUgbGl0dGxlIGZ1bmN0aW9uc1xuZnVuY3Rpb24gYm9vbGVhbkF0dHJpYnV0ZVZhbHVlKGVsZW1lbnQsIGF0dHJpYnV0ZSwgZGVmYXVsdFZhbHVlKXtcblx0Ly8gcmV0dXJucyB0cnVlIGlmIGFuIGF0dHJpYnV0ZSBpcyBwcmVzZW50IHdpdGggbm8gdmFsdWVcblx0Ly8gZS5nLiBib29sZWFuQXR0cmlidXRlVmFsdWUoZWxlbWVudCwgJ2RhdGEtbW9kYWwnLCBmYWxzZSk7XG5cdGlmIChlbGVtZW50Lmhhc0F0dHJpYnV0ZShhdHRyaWJ1dGUpKSB7XG5cdFx0dmFyIHZhbHVlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlKTtcblx0XHRpZiAodmFsdWUgPT09ICcnIHx8IHZhbHVlID09PSAndHJ1ZScpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0gZWxzZSBpZiAodmFsdWUgPT09ICdmYWxzZScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gZGVmYXVsdFZhbHVlO1xufVxuXG4iLCJ2YXIgz4AsIM+AMSwgz4BkO1xuKGZ1bmN0aW9uKCl7XG5cdHJldHVybjtcblx0Ly9cblx0Ly/PgCA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG5cdC8vXHRyZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG5cdC8vfTtcblx0Ly9cblx0Ly/PgDEgPSBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcblx0Ly9cdHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcblx0Ly99O1xuXHQvL1xuXHQvL8+AZCA9IGZ1bmN0aW9uKGlkKSB7XG5cdC8vXHRyZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuXHQvL307XG5cdC8vXG5cdC8vz4AubmV3RE9NRWxlbWVudCA9IGZ1bmN0aW9uKHRhZ05hbWUsIGNsYXNzTmFtZSwgaWQpIHtcblx0Ly9cdHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZSk7XG5cdC8vXG5cdC8vXHRpZiAoY2xhc3NOYW1lKVxuXHQvL1x0XHRlbC5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG5cdC8vXG5cdC8vXHRpZiAoaWQpXG5cdC8vXHRcdGVsLmlkID0gaWQ7XG5cdC8vXG5cdC8vXHRyZXR1cm4gZWw7XG5cdC8vfTtcblx0Ly9cblx0Ly/PgC5jb250ZW50RWxlbWVudCA9IGZ1bmN0aW9uKHRhZ05hbWUsIGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpXG5cdC8ve1xuXHQvL1x0dmFyIGVsID0gz4AubmV3RE9NRWxlbWVudCh0YWdOYW1lLCBjbGFzc05hbWUsIGlkKTtcblx0Ly9cblx0Ly9cdGlmIChjb250ZW50KSB7XG5cdC8vXHRcdGlmIChjb250ZW50Lm5vZGVOYW1lKSB7XG5cdC8vXHRcdFx0ZWwuYXBwZW5kQ2hpbGQoY29udGVudCk7XG5cdC8vXHRcdH0gZWxzZSB7XG5cdC8vXHRcdFx0ZWwuaW5uZXJIVE1MID0gY29udGVudDtcblx0Ly9cdFx0fVxuXHQvL1x0fVxuXHQvL1xuXHQvL1x0cmV0dXJuIGVsO1xuXHQvL307XG5cdC8vXG5cdC8vz4AuYnV0dG9uID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBpZCwgY29udGVudCwgYWN0aW9uKXtcblx0Ly9cdHZhciBlbCA9IM+ALmNvbnRlbnRFbGVtZW50KFwiYnV0dG9uXCIsIGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpO1xuXHQvL1x0ZWwub25jbGljayA9IGFjdGlvbjtcblx0Ly9cdHJldHVybiBlbDtcblx0Ly99O1xuXHQvL8+ALmRpdiA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpeyByZXR1cm4gz4AuY29udGVudEVsZW1lbnQoXCJkaXZcIiwgY2xhc3NOYW1lLCBpZCwgY29udGVudCk7IH07XG5cdC8vz4Auc3BhbiA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpeyByZXR1cm4gz4AuY29udGVudEVsZW1lbnQoXCJzcGFuXCIsIGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpOyB9O1xuXHQvL8+ALmgyID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBpZCwgY29udGVudCl7IHJldHVybiDPgC5jb250ZW50RWxlbWVudChcImgyXCIsIGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpOyB9O1xuXHQvL8+ALnAgPSBmdW5jdGlvbihjbGFzc05hbWUsIGlkLCBjb250ZW50KXsgcmV0dXJuIM+ALmNvbnRlbnRFbGVtZW50KFwicFwiLCBjbGFzc05hbWUsIGlkLCBjb250ZW50KTsgfTtcblx0Ly/PgC51bCA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpeyByZXR1cm4gz4AuY29udGVudEVsZW1lbnQoXCJ1bFwiLCBjbGFzc05hbWUsIGlkLCBjb250ZW50KTsgfTtcblx0Ly/PgC5saSA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpeyByZXR1cm4gz4AuY29udGVudEVsZW1lbnQoXCJsaVwiLCBjbGFzc05hbWUsIGlkLCBjb250ZW50KTsgfTtcblx0Ly9cblx0Ly/PgC5hID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBpZCwgY29udGVudCwgaHJlZil7XG5cdC8vXHR2YXIgYSA9IM+ALmNvbnRlbnRFbGVtZW50KFwiYVwiLCBjbGFzc05hbWUsIGlkLCBjb250ZW50KTtcblx0Ly9cdGEuaHJlZiA9IGhyZWY7XG5cdC8vXHRyZXR1cm4gYTtcblx0Ly99O1xuXHQvL1xuXHQvL1xuXHQvL8+ALmNsZWFuID0gZnVuY3Rpb24oY2FsbGJhY2ssIGV2ZW50TmFtZSkge1xuXHQvL1x0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lIHx8IFwiRE9NQ29udGVudExvYWRlZFwiLCBjYWxsYmFjayk7XG5cdC8vfTtcblx0Ly9cblx0Ly/PgC5saXN0ZW4gPSBmdW5jdGlvbihjYWxsYmFjaywgZXZlbnROYW1lKSB7XG5cdC8vXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUgfHwgXCJET01Db250ZW50TG9hZGVkXCIsIGNhbGxiYWNrKTtcblx0Ly99O1xuXHQvL1xuXHQvL8+ALmhpZ2hlc3RaID0gZnVuY3Rpb24oKSB7XG5cdC8vXHR2YXIgWiA9IDEwMDA7XG5cdC8vXG5cdC8vXHTPgChcIipcIikuZm9yRWFjaChmdW5jdGlvbihlbCl7XG5cdC8vXHRcdHZhciB0aGlzWiA9IGVsLmNzcygpLnpJbmRleDtcblx0Ly9cblx0Ly9cdFx0aWYgKHRoaXNaICE9IFwiYXV0b1wiKSB7XG5cdC8vXHRcdFx0aWYgKHRoaXNaID4gWikgWiA9IHRoaXNaICsgMTtcblx0Ly9cdFx0fVxuXHQvL1x0fSk7XG5cdC8vXG5cdC8vXHRyZXR1cm4gWjtcblx0Ly99O1xuXHQvL1xuXHQvL8+ALnNldFRyaWdnZXJzID0gZnVuY3Rpb24oc2VsZWN0b3IsIG9iamVjdCl7XG5cdC8vXHRzZWxlY3RvciA9ICdwaS0nICsgc2VsZWN0b3IgKyAnLXRyaWdnZXInO1xuXHQvL1x0z4AoJ1snICsgc2VsZWN0b3IgKyAnXScpLmZvckVhY2goZnVuY3Rpb24odHJpZ2dlcil7XG5cdC8vXHRcdHRyaWdnZXIub25jbGljayA9IGZ1bmN0aW9uKCl7XG5cdC8vXHRcdFx0b2JqZWN0LnNob3codHJpZ2dlci5nZXRBdHRyaWJ1dGUoc2VsZWN0b3IpKTtcblx0Ly9cdFx0fTtcblx0Ly9cdH0pO1xuXHQvL307XG5cdC8vSFRNTEVsZW1lbnQucHJvdG90eXBlLmFkZCA9IE5vZGUucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKG9iamVjdCl7XG5cdC8vXHRpZiAoQXJyYXkuaXNBcnJheShvYmplY3QpKSB7XG5cdC8vXHRcdHZhciBlbCA9IHRoaXM7XG5cdC8vXHRcdG9iamVjdC5mb3JFYWNoKGZ1bmN0aW9uKG9iail7XG5cdC8vXHRcdFx0aWYgKG9iaikgZWwuYXBwZW5kQ2hpbGQob2JqKTtcblx0Ly9cdFx0fSk7XG5cdC8vXHR9IGVsc2UgaWYob2JqZWN0KSB7XG5cdC8vXHRcdHRoaXMuYXBwZW5kQ2hpbGQob2JqZWN0KTtcblx0Ly9cdH1cblx0Ly99O1xuXHQvL1xuXHQvL0hUTUxFbGVtZW50LnByb3RvdHlwZS5jbGFzc09uQ29uZGl0aW9uID0gTm9kZS5wcm90b3R5cGUuY2xhc3NPbkNvbmRpdGlvbiA9IGZ1bmN0aW9uKGNsYXNzbmFtZSwgY29uZGl0aW9uKSB7XG5cdC8vXHRpZiAoY29uZGl0aW9uKVxuXHQvL1x0XHR0aGlzLmFkZENsYXNzKGNsYXNzbmFtZSk7XG5cdC8vXHRlbHNlXG5cdC8vXHRcdHRoaXMua2lsbENsYXNzKGNsYXNzbmFtZSk7XG5cdC8vfTtcblx0Ly9cblx0Ly9IVE1MRWxlbWVudC5wcm90b3R5cGUub2Zmc2V0ID0gTm9kZS5wcm90b3R5cGUub2Zmc2V0ID0gZnVuY3Rpb24oKXtcblx0Ly9cdHJldHVybiB0aGlzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHQvL307XG5cdC8vXG5cdC8vSFRNTEVsZW1lbnQucHJvdG90eXBlLs+AZCA9IE5vZGUucHJvdG90eXBlLs+AZCA9IGZ1bmN0aW9uKGlkKSB7XG5cdC8vXHRyZXR1cm4gdGhpcy5nZXRFbGVtZW50QnlJZChpZCk7XG5cdC8vfTtcblx0Ly9cblx0Ly9IVE1MRWxlbWVudC5wcm90b3R5cGUuz4AxID0gTm9kZS5wcm90b3R5cGUuz4AxID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcblx0Ly9cdHJldHVybiB0aGlzLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuXHQvL307XG5cdC8vXG5cdC8vSFRNTEVsZW1lbnQucHJvdG90eXBlLs+AID0gTm9kZS5wcm90b3R5cGUuz4AgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuXHQvL1x0cmV0dXJuIHRoaXMucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG5cdC8vfTtcblx0Ly9cblx0Ly9mdW5jdGlvbiBhcnJheU9mQ2xhc3Nlc0ZvckVsZW1lbnQoZWwpIHtcblx0Ly9cdHJldHVybiBlbC5jbGFzc05hbWUgPyBlbC5jbGFzc05hbWUuc3BsaXQoXCIgXCIpIDogW107XG5cdC8vfVxuXHQvL1xuXHQvL0hUTUxFbGVtZW50LnByb3RvdHlwZS5oYXNDbGFzcyA9IE5vZGUucHJvdG90eXBlLmhhc0NsYXNzID0gZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuXHQvL1x0dmFyIGNsYXNzZXMgPSBhcnJheU9mQ2xhc3Nlc0ZvckVsZW1lbnQodGhpcyk7XG5cdC8vXHRyZXR1cm4gY2xhc3Nlcy5pbmRleE9mKGNsYXNzTmFtZSkgIT09IC0xO1xuXHQvL307XG5cdC8vXG5cdC8vSFRNTEVsZW1lbnQucHJvdG90eXBlLmFkZENsYXNzID0gTm9kZS5wcm90b3R5cGUuYWRkQ2xhc3MgPSBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG5cdC8vXHRpZiAodGhpcy5oYXNDbGFzcyhjbGFzc05hbWUpKSByZXR1cm47XG5cdC8vXHRpZiAodGhpcy5jbGFzc05hbWUubGVuZ3RoID4gMCkgdGhpcy5jbGFzc05hbWUgKz0gXCIgXCI7XG5cdC8vXHR0aGlzLmNsYXNzTmFtZSArPSBjbGFzc05hbWU7XG5cdC8vfTtcblx0Ly9cblx0Ly9IVE1MRWxlbWVudC5wcm90b3R5cGUua2lsbENsYXNzID0gTm9kZS5wcm90b3R5cGUua2lsbENsYXNzID0gZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuXHQvL1x0aWYgKHRoaXMuaGFzQ2xhc3MoY2xhc3NOYW1lKSkge1xuXHQvL1x0XHR2YXIgY2xhc3NlcyA9IGFycmF5T2ZDbGFzc2VzRm9yRWxlbWVudCh0aGlzKTtcblx0Ly9cdFx0dmFyIGlkeCA9IGNsYXNzZXMuaW5kZXhPZihjbGFzc05hbWUpO1xuXHQvL1x0XHRpZiAoaWR4ID4gLTEpIHtcblx0Ly9cdFx0XHRjbGFzc2VzLnNwbGljZShpZHgsIDEpO1xuXHQvL1x0XHRcdHRoaXMuY2xhc3NOYW1lID0gY2xhc3Nlcy5qb2luKFwiIFwiKTtcblx0Ly9cdFx0fVxuXHQvL1x0fVxuXHQvL307XG5cdC8vXG5cdC8vSFRNTEVsZW1lbnQucHJvdG90eXBlLnRvZ2dsZUNsYXNzPSBOb2RlLnByb3RvdHlwZS50b2dnbGVDbGFzcz0gZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuXHQvL1x0cmV0dXJuICh0aGlzLmhhc0NsYXNzKGNsYXNzTmFtZSkpID8gdGhpcy5raWxsQ2xhc3MoY2xhc3NOYW1lKSA6IHRoaXMuYWRkQ2xhc3MoY2xhc3NOYW1lKTtcblx0Ly99O1xuXHQvL1xuXHQvL0hUTUxFbGVtZW50LnByb3RvdHlwZS5zaWJsaW5ncyA9IE5vZGUucHJvdG90eXBlLnNpYmxpbmdzID0gZnVuY3Rpb24oc2VsZWN0b3Ipe1xuXHQvL1x0dmFyIGVsID0gdGhpcztcblx0Ly9cdHJldHVybiBlbC5wYXJlbnROb2RlLs+AKCc6c2NvcGUgPiAnICsgKHNlbGVjdG9yIHx8ICcqJykpLmZpbHRlcihmdW5jdGlvbihvYmope3JldHVybiBvYmogIT0gZWw7fSk7XG5cdC8vfTtcblx0Ly9cblx0Ly9IVE1MRWxlbWVudC5wcm90b3R5cGUuY3NzID0gTm9kZS5wcm90b3R5cGUuY3NzID0gZnVuY3Rpb24ocnVsZU9yT2JqZWN0LCB2YWx1ZSkge1xuXHQvL1x0dmFyIGVsID0gdGhpcztcblx0Ly9cblx0Ly9cdGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG5cdC8vXHRcdHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzKTtcblx0Ly9cdH1cblx0Ly9cblx0Ly9cdGVsc2UgaWYgKHR5cGVvZiBydWxlT3JPYmplY3QgPT09ICdvYmplY3QnKSB7IC8vIGFuIG9iamVjdCB3YXMgcGFzc2VkIGluXG5cdC8vXHRcdE9iamVjdC5rZXlzKHJ1bGVPck9iamVjdCkuZm9yRWFjaChmdW5jdGlvbihrZXkpe1xuXHQvL1x0XHRcdGVsLnN0eWxlW2tleV0gPSBydWxlT3JPYmplY3Rba2V5XTtcblx0Ly9cdFx0fSk7XG5cdC8vXHR9XG5cdC8vXG5cdC8vXHRlbHNlIGlmICh0eXBlb2YgcnVsZU9yT2JqZWN0ID09PSAnc3RyaW5nJyAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7IC8vIDIgc3RyaW5nIHZhbHVlcyB3ZXJlIHBhc3NlZCBpblxuXHQvL1x0XHRlbC5zdHlsZVtydWxlT3JPYmplY3RdID0gdmFsdWU7XG5cdC8vXHR9XG5cdC8vfTtcblx0Ly9cblx0Ly9IVE1MRWxlbWVudC5wcm90b3R5cGUubGlzdGVuID0gTm9kZS5wcm90b3R5cGUubGlzdGVuID0gZnVuY3Rpb24oY2FsbGJhY2ssIGV2ZW50TmFtZSl7XG5cdC8vXHR0aGlzLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjayk7XG5cdC8vfTtcblx0Ly9cblx0Ly9IVE1MRWxlbWVudC5wcm90b3R5cGUuZW1wdHkgPSBOb2RlLnByb3RvdHlwZS5lbXB0eSA9IGZ1bmN0aW9uKCkge1xuXHQvL1x0dGhpcy5pbm5lckhUTUwgPSBcIlwiO1xuXHQvL307XG5cdC8vXG5cdC8vSFRNTEVsZW1lbnQucHJvdG90eXBlLmZpbGwgPSBOb2RlLnByb3RvdHlwZS5maWxsID0gZnVuY3Rpb24oY29udGVudCkge1xuXHQvL1x0dmFyIGVsID0gdGhpcztcblx0Ly9cdGVsLmVtcHR5KCk7XG5cdC8vXG5cdC8vXHRpZiAoQXJyYXkuaXNBcnJheShjb250ZW50KSkge1xuXHQvL1x0XHRjb250ZW50LmZvckVhY2goZnVuY3Rpb24ob2JqKXtcblx0Ly9cdFx0XHRpZiAob2JqKVxuXHQvL1x0XHRcdFx0ZWwuYXBwZW5kQ2hpbGQob2JqKTtcblx0Ly9cdFx0fSk7XG5cdC8vXG5cdC8vXHRcdHJldHVybjtcblx0Ly9cdH1cblx0Ly9cblx0Ly9cdGlmICghY29udGVudC5ub2RlVHlwZSkge1xuXHQvL1x0XHR2YXIgdGV4dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGV4dFwiKTtcblx0Ly9cdFx0dGV4dEVsZW1lbnQuaW5uZXJIVE1MID0gY29udGVudDtcblx0Ly9cdFx0Y29udGVudCA9IHRleHRFbGVtZW50O1xuXHQvL1x0fVxuXHQvL1xuXHQvL1x0dGhpcy5hcHBlbmRDaGlsZChjb250ZW50KTtcblx0Ly99O1xuXHQvL1xuXHQvL0hUTUxFbGVtZW50LnByb3RvdHlwZS5pc0hlaXJPZkNsYXNzID0gTm9kZS5wcm90b3R5cGUuaXNIZWlyT2ZDbGFzcyA9IGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcblx0Ly9cdGlmICh0aGlzID09PSDPgDEoJ2h0bWwnKSkgcmV0dXJuIGZhbHNlO1xuXHQvL1xuXHQvL1x0dmFyIHBhcmVudCA9IHRoaXMucGFyZW50Tm9kZTtcblx0Ly9cblx0Ly9cdGlmIChwYXJlbnQpIHtcblx0Ly9cdFx0d2hpbGUgKHBhcmVudCAhPT0gz4AxKCdib2R5JykpIHtcblx0Ly9cdFx0XHRpZiAocGFyZW50Lmhhc0NsYXNzKGNsYXNzTmFtZSkpIHJldHVybiB0cnVlO1xuXHQvL1xuXHQvL1x0XHRcdHBhcmVudCA9IHBhcmVudC5wYXJlbnROb2RlO1xuXHQvL1x0XHR9XG5cdC8vXHR9XG5cdC8vXG5cdC8vXHRyZXR1cm4gZmFsc2U7XG5cdC8vfTtcblx0Ly9cblx0Ly9IVE1MRWxlbWVudC5wcm90b3R5cGUucGFyZW50cyA9IE5vZGUucHJvdG90eXBlLnBhcmVudHMgPSBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcblx0Ly9cdHZhciBwYXJlbnRzID0gW107XG5cdC8vXHR2YXIgaW1tZWRpYXRlUGFyZW50ID0gdGhpcy5wYXJlbnROb2RlO1xuXHQvL1xuXHQvL1x0d2hpbGUoaW1tZWRpYXRlUGFyZW50ICE9PSDPgDEoJ2h0bWwnKSkge1xuXHQvL1x0XHRwYXJlbnRzLnB1c2goaW1tZWRpYXRlUGFyZW50KTtcblx0Ly9cdFx0aW1tZWRpYXRlUGFyZW50ID0gaW1tZWRpYXRlUGFyZW50LnBhcmVudE5vZGU7XG5cdC8vXHR9XG5cdC8vXG5cdC8vXHRpZiAoc2VsZWN0b3IpIHtcblx0Ly9cdFx0dmFyIHNlbGVjdGVkRWxlbWVudHMgPSDPgChzZWxlY3Rvcik7XG5cdC8vXHRcdHZhciBzZWxlY3RlZFBhcmVudHMgPSBbXTtcblx0Ly9cdFx0c2VsZWN0ZWRFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGVsKXtcblx0Ly9cdFx0XHRpZiAocGFyZW50cy5pbmRleE9mKGVsKSAhPT0gLTEpIHNlbGVjdGVkUGFyZW50cy5wdXNoKGVsKTtcblx0Ly9cdFx0fSk7XG5cdC8vXG5cdC8vXHRcdHBhcmVudHMgPSBzZWxlY3RlZFBhcmVudHM7XG5cdC8vXHR9XG5cdC8vXG5cdC8vXHRyZXR1cm4gcGFyZW50cztcblx0Ly99O1xuXHQvL1xuXHQvL0hUTUxFbGVtZW50LnByb3RvdHlwZS5raWRzID0gTm9kZS5wcm90b3R5cGUua2lkcyA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG5cdC8vXHR2YXIgY2hpbGROb2RlcyA9IHRoaXMuY2hpbGROb2Rlcztcblx0Ly9cdGlmICghc2VsZWN0b3IpIHJldHVybiBjaGlsZE5vZGVzO1xuXHQvL1xuXHQvL1x0dmFyIGRlc2NlbmRlbnRzID0gdGhpcy7PgChzZWxlY3Rvcik7XG5cdC8vXHR2YXIgY2hpbGRyZW4gPSBbXTtcblx0Ly9cblx0Ly9cdGNoaWxkTm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKXtcblx0Ly9cdFx0aWYgKGRlc2NlbmRlbnRzLmluZGV4T2Yobm9kZSkgIT09IC0xKSB7XG5cdC8vXHRcdFx0Y2hpbGRyZW4ucHVzaChub2RlKTtcblx0Ly9cdFx0fVxuXHQvL1x0fSk7XG5cdC8vXG5cdC8vXHRyZXR1cm4gY2hpbGRyZW47XG5cdC8vfTtcblx0Ly9cblx0Ly92YXIgYXJyYXlNZXRob2RzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoQXJyYXkucHJvdG90eXBlKTtcblx0Ly9hcnJheU1ldGhvZHMuZm9yRWFjaChmdW5jdGlvbihtZXRob2ROYW1lKXtcblx0Ly9cdGlmKG1ldGhvZE5hbWUgIT09IFwibGVuZ3RoXCIpIHtcblx0Ly9cdFx0Tm9kZUxpc3QucHJvdG90eXBlW21ldGhvZE5hbWVdID0gQXJyYXkucHJvdG90eXBlW21ldGhvZE5hbWVdO1xuXHQvL1x0fVxuXHQvL30pO1xuXHQvL1xuXHQvL8+ALm1vZHMgPSBbXTtcblx0Ly9cblx0Ly9mdW5jdGlvbiBsb2FkTW9kcygpIHtcblx0Ly9cdM+ALmNsZWFuKGxvYWRNb2RzKTtcblx0Ly9cdM+ALm1vZHMuZm9yRWFjaChmdW5jdGlvbihpbml0KXtcblx0Ly9cdFx0aW5pdCgpO1xuXHQvL1x0fSk7XG5cdC8vfVxuXHQvL1xuXHQvL8+ALmxpc3Rlbihsb2FkTW9kcyk7XG59KSgpOyAgLy8gZW5kIM+AIiwiIC8vbW9kYWwgY2xvc2UgYnV0dG9uXG4oZnVuY3Rpb24oKXtcblx0Ly/PgC5tb2RhbENsb3NlQnV0dG9uID0gZnVuY3Rpb24oY2xvc2luZ0Z1bmN0aW9uKXtcblx0Ly9cdHJldHVybiDPgC5idXR0b24oJ3BpLW1vZGFsLWNsb3NlLWJ1dHRvbicsIG51bGwsIG51bGwsIGNsb3NpbmdGdW5jdGlvbik7XG5cdC8vfTtcbn0pKCk7XG4iLCIiLCIvLy8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gz4AtcHVzaG1lbnUuanNcbi8vIC8vIFRPRE86ICBVU0FHRSBBTkQgQVBJIFJFRkVSRU5DRVxuLy8gX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xuLy8gREVQRU5ERU5DSUVTOlxuLy9cbi8vIEhBTC5qc1xuLy9cbi8vIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cbi8vIERBVEEgQVRUUklCVVRFUzpcbi8vXG4vLyBzaWRlOiBbXCJsZWZ0XCIsIFwicmlnaHRcIl1cbi8vIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cbi8vIE1BUktVUCBBTkQgREVGQVVMVFM6XG4vL1xuLy9cdDxkaXYgY2xhc3M9XCJwaS1wdXNobWVudVwiIGlkPVwibXlQdXNoTWVudVwiPlxuLy9cdFx0IDx1bD5cbi8vXHRcdFx0IDxsaT48YSBocmVmPVwiI1wiPmZvbzwvYT48L2xpPlxuLy9cdFx0XHQgPGxpPjxhIGhyZWY9XCIjXCI+YmFyPC9hPjwvbGk+XG4vL1x0XHRcdCA8bGk+PGEgaHJlZj1cIiNcIj5ncm9uazwvYT48L2xpPlxuLy9cdFx0XHQgPGxpPjxhIGhyZWY9XCIjXCI+ZmxlZWJsZXM8L2E+PC9saT5cbi8vXHRcdFx0IDxsaT48YSBocmVmPVwiI1wiPnNlcHVsdmVkYTwvYT48L2xpPlxuLy9cdFx0IDwvdWw+XG4vL1x0PC9kaXY+XG4vL1xuLy9lbHNld2hlcmUuLi5cbi8vXG4vLyA8YnV0dG9uIG9uY2xpY2s9XCLPgC1wdXNobWVudS5zaG93KCdteVB1c2hNZW51JylcIj5zaG93IG1lbnU8L2J1dHRvbj5cbi8vXG4vLyBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXG4vLyBHRU5FUkFURUQgSFRNTDpcbi8vXG4vL1xuLy8gX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xuLy8gQVBJXG4vL1xuLy9cbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8vXG4vL8+ALnB1c2htZW51ID0gKGZ1bmN0aW9uKCl7XG4vL1x0dmFyIGFsbFB1c2hNZW51cyA9IHt9O1xuLy9cbi8vXHRmdW5jdGlvbiBpbml0KCl7XG4vL1x0XHTPgCgnW2RhdGEtYXV0by1idXJnZXJdJykuZm9yRWFjaChmdW5jdGlvbihjb250YWluZXIpe1xuLy9cdFx0XHR2YXIgaWQgPSBjb250YWluZXIuZ2V0QXR0cmlidXRlKCdkYXRhLWF1dG8tYnVyZ2VyJyk7XG4vL1xuLy9cdFx0XHR2YXIgYXV0b0J1cmdlciA9IM+AZChpZCkgfHwgz4AuZGl2KCdwaS1wdXNobWVudScsIGlkKTtcbi8vXHRcdFx0dmFyIHVsID0gYXV0b0J1cmdlci7PgDEoJ3VsJykgfHwgz4AudWwoKTtcbi8vXG4vL1x0XHRcdGNvbnRhaW5lci7PgCgnYVtocmVmXSwgYnV0dG9uJykuZm9yRWFjaChmdW5jdGlvbiAob2JqKSB7XG4vL1x0XHRcdFx0aWYgKCFib29sZWFuQXR0cmlidXRlVmFsdWUob2JqLCAnZGF0YS1hdXRvLWJ1cmdlci1leGNsdWRlJywgZmFsc2UpKSB7XG4vL1x0XHRcdFx0XHR2YXIgY2xvbmUgPSBvYmouY2xvbmVOb2RlKHRydWUpO1xuLy9cdFx0XHRcdFx0Y2xvbmUuaWQgPSAnJztcbi8vXG4vL1x0XHRcdFx0XHRpZiAoY2xvbmUudGFnTmFtZSA9PSBcIkJVVFRPTlwiKSB7XG4vL1x0XHRcdFx0XHRcdHZhciBhVGFnID0gz4Auc3JjRWxlbWVudCgnYScpO1xuLy9cdFx0XHRcdFx0XHRhVGFnLmhyZWYgPSAnJztcbi8vXHRcdFx0XHRcdFx0YVRhZy5pbm5lckhUTUwgPSBjbG9uZS5pbm5lckhUTUw7XG4vL1x0XHRcdFx0XHRcdGFUYWcub25jbGljayA9IGNsb25lLm9uY2xpY2s7XG4vL1x0XHRcdFx0XHRcdGNsb25lID0gYVRhZztcbi8vXHRcdFx0XHRcdH1cbi8vXHRcdFx0XHRcdHVsLmFkZCjPgC5saSgwLCAwLCBjbG9uZSkpO1xuLy9cdFx0XHRcdH1cbi8vXHRcdFx0fSk7XG4vL1xuLy9cdFx0XHRhdXRvQnVyZ2VyLmFkZCh1bCk7XG4vL1x0XHRcdM+AMSgnYm9keScpLmFkZChhdXRvQnVyZ2VyKTtcbi8vXHRcdH0pO1xuLy9cbi8vXHRcdM+AKFwiLnBpLXB1c2htZW51XCIpLmZvckVhY2goZnVuY3Rpb24oZWwpe1xuLy9cdFx0XHRhbGxQdXNoTWVudXNbZWwuaWRdID0gUHVzaE1lbnUoZWwpO1xuLy9cdFx0fSk7XG4vL1xuLy9cdFx0z4Auc2V0VHJpZ2dlcnMoJ3B1c2htZW51Jywgz4AucHVzaG1lbnUpO1xuLy9cdH1cbi8vXG4vL1x0ZnVuY3Rpb24gc2hvdyhvYmpJZCkge1xuLy9cdFx0YWxsUHVzaE1lbnVzW29iaklkXS5leHBvc2UoKTtcbi8vXHR9XG4vL1xuLy9cdC8vIFRPRE86IGRpc21pc3Mgb24gY2xpY2s/XG4vL1x0Ly8gdGhpcyB3b3Jrczpcbi8vXG4vL1x0Ly/PgCgnLnBpLXB1c2htZW51IGxpIGEnKS5mb3JFYWNoKGZ1bmN0aW9uKGEpe1xuLy9cdC8vXHRhLm9uY2xpY2sgPSBmdW5jdGlvbigpe1xuLy9cdC8vXHRcdHRoaXMucGFyZW50KCcucGktcHVzaG1lbnUnKS7PgDEoJy5waS1tb2RhbC1jbG9zZS1idXR0b24nKS5jbGljaygpO1xuLy9cdC8vXHRcdGNvbnNvbGUubG9nKFwibWVzc2FnZVwiKTtcbi8vXHQvL1x0fTtcbi8vXHQvL30pO1xuLy9cbi8vXG4vL1x0ZnVuY3Rpb24gUHVzaE1lbnUoZWwpIHtcbi8vXHRcdHZhciBodG1sID0gz4AxKCdodG1sJyk7XG4vL1x0XHR2YXIgYm9keSA9IM+AMSgnYm9keScpO1xuLy9cbi8vXHRcdHZhciBvdmVybGF5ID0gz4AuZGl2KFwib3ZlcmxheVwiKTtcbi8vXHRcdHZhciBjb250ZW50ID0gz4AuZGl2KCdjb250ZW50JywgbnVsbCwgZWwuz4AxKCcqJykpO1xuLy9cbi8vXHRcdHZhciBzaWRlID0gZWwuZ2V0QXR0cmlidXRlKFwiZGF0YS1zaWRlXCIpIHx8IFwicmlnaHRcIjtcbi8vXG4vL1x0XHR2YXIgc2xlZCA9IM+ALmRpdihcInNsZWRcIik7XG4vL1x0XHRzbGVkLmNzcyhzaWRlLCAwKTtcbi8vXG4vL1x0XHR2YXIgdG9wQmFyID0gz4AuZGl2KFwidG9wLWJhclwiKTtcbi8vXG4vL1x0XHR0b3BCYXIuZmlsbCjPgC5tb2RhbENsb3NlQnV0dG9uKGNsb3NlTWUpKTtcbi8vXHRcdHNsZWQuZmlsbChbdG9wQmFyLCBjb250ZW50XSk7XG4vL1xuLy9cdFx0b3ZlcmxheS5maWxsKHNsZWQpO1xuLy9cdFx0ZWwuZmlsbChvdmVybGF5KTtcbi8vXG4vL1x0XHRzbGVkLm9uY2xpY2sgPSBmdW5jdGlvbihlKXtcbi8vXHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcbi8vXHRcdH07XG4vL1xuLy9cdFx0b3ZlcmxheS5vbmNsaWNrID0gY2xvc2VNZTtcbi8vXG4vL1x0XHTPgC5saXN0ZW4oY2xvc2VNZSwgJ3Jlc2l6ZScpO1xuLy9cbi8vXHRcdGZ1bmN0aW9uIGNsb3NlTWUoZSkge1xuLy9cdFx0XHR2YXIgdCA9IGUudGFyZ2V0O1xuLy9cdFx0XHRpZiAodCA9PSBzbGVkIHx8IHQgPT0gdG9wQmFyKSByZXR1cm47XG4vL1xuLy9cdFx0XHRlbC5raWxsQ2xhc3MoXCJvblwiKTtcbi8vXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuLy9cdFx0XHRcdGVsLmNzcyh7ZGlzcGxheTogXCJub25lXCJ9KTtcbi8vXG4vL1x0XHRcdFx0Ym9keS5raWxsQ2xhc3MoXCJvdmVybGF5LW9uXCIpO1xuLy9cdFx0XHR9LCAzMDApO1xuLy9cdFx0fVxuLy9cbi8vXHRcdGZ1bmN0aW9uIGV4cG9zZU1lKCl7XG4vL1x0XHRcdGJvZHkuYWRkQ2xhc3MoXCJvdmVybGF5LW9uXCIpOyAvLyBpbiB0aGUgZGVmYXVsdCBjb25maWcsIGtpbGxzIGJvZHkgc2Nyb2xsaW5nXG4vL1xuLy9cdFx0XHRlbC5jc3Moe1xuLy9cdFx0XHRcdGRpc3BsYXk6IFwiYmxvY2tcIixcbi8vXHRcdFx0XHR6SW5kZXg6IM+ALmhpZ2hlc3RaKClcbi8vXHRcdFx0fSk7XG4vL1x0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbi8vXHRcdFx0XHRlbC5hZGRDbGFzcyhcIm9uXCIpO1xuLy9cdFx0XHR9LCAxMCk7XG4vL1x0XHR9XG4vL1xuLy9cdFx0cmV0dXJuIHtcbi8vXHRcdFx0ZXhwb3NlOiBleHBvc2VNZVxuLy9cdFx0fTtcbi8vXHR9XG4vL1xuLy9cdC8vz4AubW9kcy5wdXNoKGluaXQpO1xuLy9cbi8vXHRyZXR1cm4ge1xuLy9cdFx0c2hvdzogc2hvd1xuLy9cdH07XG4vL30pKCk7XG4iLCIvLyBnbG9iYWxzXG52YXIgYm9keTtcblxuLy9oZWxwZXIgZnVuY3Rpb25zXG5mdW5jdGlvbiBjbGFzc09uQ29uZGl0aW9uKGVsZW1lbnQsIGNsYXNzTmFtZSwgY29uZGl0aW9uKSB7XG5cdGlmIChjb25kaXRpb24pXG5cdFx0JChlbGVtZW50KS5hZGRDbGFzcyhjbGFzc05hbWUpO1xuXHRlbHNlXG5cdFx0JChlbGVtZW50KS5yZW1vdmVDbGFzcyhjbGFzc05hbWUpO1xufVxuXG5mdW5jdGlvbiBweChuKXtcblx0cmV0dXJuIG4gKyAncHgnO1xufVxuXG5mdW5jdGlvbiBuZXdET01FbGVtZW50KHRhZywgY2xhc3NOYW1lLCBpZCl7XG5cdHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcblxuXHRpZiAoY2xhc3NOYW1lKSBlbC5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG5cdGlmIChpZCkgZWwuaWQgPSBpZDtcblxuXHRyZXR1cm4gZWw7XG59XG5cblxudmFyIGt1YiA9IChmdW5jdGlvbiAoKSB7XG5cdHZhciBIRUFERVJfSEVJR0hUO1xuXHR2YXIgaHRtbCwgaGVhZGVyLCBtYWluTmF2LCBxdWlja3N0YXJ0QnV0dG9uLCBoZXJvLCBlbmN5Y2xvcGVkaWEsIGZvb3Rlciwgd2lzaEZpZWxkO1xuXG5cdCQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcblx0XHRodG1sID0gJCgnaHRtbCcpO1xuXHRcdGJvZHkgPSAkKCdib2R5Jyk7XG5cdFx0aGVhZGVyID0gJCgnaGVhZGVyJyk7XG5cdFx0bWFpbk5hdiA9ICQoJyNtYWluTmF2Jyk7XG5cdFx0d2lzaEZpZWxkID0gJCgnI3dpc2hGaWVsZCcpO1xuXHRcdHF1aWNrc3RhcnRCdXR0b24gPSAkKCcjcXVpY2tzdGFydEJ1dHRvbicpO1xuXHRcdGhlcm8gPSAkKCcjaGVybycpO1xuXHRcdGVuY3ljbG9wZWRpYSA9ICQoJyNlbmN5Y2xvcGVkaWEnKTtcblx0XHRmb290ZXIgPSAkKCdmb290ZXInKTtcblx0XHRIRUFERVJfSEVJR0hUID0gaGVhZGVyLm91dGVySGVpZ2h0KCk7XG5cblx0XHRyZXNldFRoZVZpZXcoKTtcblxuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNldFRoZVZpZXcpO1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCByZXNldFRoZVZpZXcpO1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5c3Ryb2tlcyk7XG5cdFx0d2lzaEZpZWxkWzBdLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlzdHJva2VzKTtcblxuXHRcdGRvY3VtZW50Lm9udW5sb2FkID0gZnVuY3Rpb24oKXtcblx0XHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNldFRoZVZpZXcpO1xuXHRcdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHJlc2V0VGhlVmlldyk7XG5cdFx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleXN0cm9rZXMpO1xuXHRcdFx0d2lzaEZpZWxkWzBdLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlzdHJva2VzKTtcblx0XHR9O1xuXG5cdFx0JCgnLmRyb3Bkb3duJykuZWFjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgZHJvcGRvd24gPSAkKHRoaXMpO1xuXHRcdFx0dmFyIHJlYWRvdXQgPSBkcm9wZG93bi5maW5kKCcucmVhZG91dCcpO1xuXG5cdFx0XHRyZWFkb3V0Lmh0bWwoZHJvcGRvd24uZmluZCgnYScpWzBdLmlubmVySFRNTCk7XG5cdFx0XHRyZWFkb3V0LmNsaWNrKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0ZHJvcGRvd24udG9nZ2xlQ2xhc3MoJ29uJyk7XG5cdFx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlT3BlbkRyb3Bkb3duKTtcblxuXHRcdFx0XHRmdW5jdGlvbiBjbG9zZU9wZW5Ecm9wZG93bihlKSB7XG5cdFx0XHRcdFx0aWYgKGRyb3Bkb3duLmhhc0NsYXNzKCdvbicpICYmICEoZHJvcGRvd25XYXNDbGlja2VkKGUpKSkge1xuXHRcdFx0XHRcdFx0ZHJvcGRvd24ucmVtb3ZlQ2xhc3MoJ29uJyk7XG5cdFx0XHRcdFx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZU9wZW5Ecm9wZG93bik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZnVuY3Rpb24gZHJvcGRvd25XYXNDbGlja2VkKGUpIHtcblx0XHRcdFx0XHRyZXR1cm4gJChlLnRhcmdldCkucGFyZW50cygnLmRyb3Bkb3duJykubGVuZ3RoO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdHNldEludGVydmFsKHNldEZvb3RlclR5cGUsIDEwKTtcblx0fSk7XG5cblx0ZnVuY3Rpb24gc2V0Rm9vdGVyVHlwZSgpIHtcblx0XHRpZiAoaHRtbFswXS5pZCA9PSBcImRvY3NcIikge1xuXHRcdFx0dmFyIGJvZHlIZWlnaHQgPSBoZXJvLm91dGVySGVpZ2h0KCkgKyBlbmN5Y2xvcGVkaWEub3V0ZXJIZWlnaHQoKTtcblx0XHRcdHZhciBmb290ZXJIZWlnaHQgPSBmb290ZXIub3V0ZXJIZWlnaHQoKTtcblxuXHRcdFx0Y2xhc3NPbkNvbmRpdGlvbihib2R5LCAnZml4ZWQnLCB3aW5kb3cuaW5uZXJIZWlnaHQgLSBmb290ZXJIZWlnaHQgPiBib2R5SGVpZ2h0KTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiByZXNldFRoZVZpZXcoKSB7XG5cdFx0aWYgKGh0bWwuaGFzQ2xhc3MoJ29wZW4tbmF2JykpIHtcblx0XHRcdHRvZ2dsZU1lbnUoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0SEVBREVSX0hFSUdIVCA9IGhlYWRlci5vdXRlckhlaWdodCgpO1xuXHRcdH1cblxuXHRcdGNsYXNzT25Db25kaXRpb24oaHRtbCwgJ2ZsaXAtbmF2Jywgd2luZG93LnBhZ2VZT2Zmc2V0ID4gMCk7XG5cdH1cblxuXHRmdW5jdGlvbiB0b2dnbGVNZW51KCkge1xuXHRcdGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IDgwMCkge1xuXHRcdFx0z4AucHVzaG1lbnUuc2hvdygncHJpbWFyeScpO1xuXHRcdH1cblxuXHRcdGVsc2Uge1xuXHRcdFx0dmFyIG5ld0hlaWdodCA9IEhFQURFUl9IRUlHSFQ7XG5cblx0XHRcdGlmICghaHRtbC5oYXNDbGFzcygnb3Blbi1uYXYnKSkge1xuXHRcdFx0XHRuZXdIZWlnaHQgPSBtYWluTmF2Lm91dGVySGVpZ2h0KCk7XG5cdFx0XHR9XG5cblx0XHRcdGhlYWRlci5jc3Moe2hlaWdodDogcHgobmV3SGVpZ2h0KX0pO1xuXHRcdFx0aHRtbC50b2dnbGVDbGFzcygnb3Blbi1uYXYnKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBzdWJtaXRXaXNoKHRleHRmaWVsZCkge1xuXHRcdHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKFwiaHR0cHM6Ly9naXRodWIuY29tL2t1YmVybmV0ZXMva3ViZXJuZXRlcy5naXRodWIuaW8vaXNzdWVzL25ldz90aXRsZT1JJTIwd2lzaCUyMFwiICtcblx0XHRcdHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArIFwiJTIwXCIgKyB0ZXh0ZmllbGQudmFsdWUgKyBcIiZib2R5PUklMjB3aXNoJTIwXCIgK1xuXHRcdFx0d2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgXCIlMjBcIiArIHRleHRmaWVsZC52YWx1ZSk7XG5cblx0XHR0ZXh0ZmllbGQudmFsdWUgPSAnJztcblx0XHR0ZXh0ZmllbGQuYmx1cigpO1xuXHR9XG5cblx0ZnVuY3Rpb24gaGFuZGxlS2V5c3Ryb2tlcyhlKSB7XG5cdFx0c3dpdGNoIChlLndoaWNoKSB7XG5cdFx0XHRjYXNlIDEzOiB7XG5cdFx0XHRcdGlmIChlLmN1cnJlbnRUYXJnZXQgPT09IHdpc2hGaWVsZCkge1xuXHRcdFx0XHRcdHN1Ym1pdFdpc2god2lzaEZpZWxkKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblxuXHRcdFx0Y2FzZSAyNzoge1xuXHRcdFx0XHRpZiAoaHRtbC5oYXNDbGFzcygnb3Blbi1uYXYnKSkge1xuXHRcdFx0XHRcdHRvZ2dsZU1lbnUoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdHRvZ2dsZU1lbnU6IHRvZ2dsZU1lbnVcblx0fTtcbn0pKCk7XG5cblxuLy8gYWNjb3JkaW9uXG4oZnVuY3Rpb24oKXtcblx0dmFyIHlhaCA9IHRydWU7XG5cdHZhciBtb3ZpbmcgPSBmYWxzZTtcblx0dmFyIENTU19CUk9XU0VSX0hBQ0tfREVMQVkgPSAyNTtcblxuXHQkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuXHRcdC8vIFNhZmFyaSBjaG9rZXMgb24gdGhlIGFuaW1hdGlvbiBoZXJlLCBzby4uLlxuXHRcdGlmIChuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ0Nocm9tZScpID09IC0xICYmIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignU2FmYXJpJykgIT0gLTEpe1xuXHRcdFx0dmFyIGhhY2tTdHlsZSA9IG5ld0RPTUVsZW1lbnQoJ3N0eWxlJyk7XG5cdFx0XHRoYWNrU3R5bGUuaW5uZXJIVE1MID0gJy5waS1hY2NvcmRpb24gLndyYXBwZXJ7dHJhbnNpdGlvbjogbm9uZX0nO1xuXHRcdFx0Ym9keS5hcHBlbmQoaGFja1N0eWxlKTtcblx0XHR9XG5cdFx0Ly8gR3Jvc3MuXG5cblx0XHQkKCcucGktYWNjb3JkaW9uJykuZWFjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgYWNjb3JkaW9uID0gdGhpcztcblx0XHRcdHZhciBjb250ZW50ID0gdGhpcy5pbm5lckhUTUw7XG5cdFx0XHR2YXIgY29udGFpbmVyID0gbmV3RE9NRWxlbWVudCgnZGl2JywgJ2NvbnRhaW5lcicpO1xuXHRcdFx0Y29udGFpbmVyLmlubmVySFRNTCA9IGNvbnRlbnQ7XG5cdFx0XHQkKGFjY29yZGlvbikuZW1wdHkoKTtcblx0XHRcdGFjY29yZGlvbi5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuXHRcdFx0Q29sbGFwc2VCb3goJChjb250YWluZXIpKTtcblx0XHR9KTtcblxuXHRcdHNldFlBSCgpO1xuXG5cdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHR5YWggPSBmYWxzZTtcblx0XHR9LCA1MDApO1xuXHR9KTtcblxuXHRmdW5jdGlvbiBDb2xsYXBzZUJveChjb250YWluZXIpe1xuXHRcdGNvbnRhaW5lci5jaGlsZHJlbignLml0ZW0nKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHQvLyBidWlsZCB0aGUgVE9DIERPTVxuXHRcdFx0Ly8gdGhlIGFuaW1hdGVkIG9wZW4vY2xvc2UgaXMgZW5hYmxlZCBieSBoYXZpbmcgZWFjaCBpdGVtJ3MgY29udGVudCBleGlzdCBpbiB0aGUgZmxvdywgYXQgaXRzIG5hdHVyYWwgaGVpZ2h0LFxuXHRcdFx0Ly8gZW5jbG9zZWQgaW4gYSB3cmFwcGVyIHdpdGggaGVpZ2h0ID0gMCB3aGVuIGNsb3NlZCwgYW5kIGhlaWdodCA9IGNvbnRlbnRIZWlnaHQgd2hlbiBvcGVuLlxuXHRcdFx0dmFyIGl0ZW0gPSB0aGlzO1xuXG5cdFx0XHQvLyBvbmx5IGFkZCBjb250ZW50IHdyYXBwZXJzIHRvIGNvbnRhaW5lcnMsIG5vdCB0byBsaW5rc1xuXHRcdFx0dmFyIGlzQ29udGFpbmVyID0gaXRlbS50YWdOYW1lID09PSAnRElWJztcblxuXHRcdFx0dmFyIHRpdGxlVGV4dCA9IGl0ZW0uZ2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJyk7XG5cdFx0XHR2YXIgdGl0bGUgPSBuZXdET01FbGVtZW50KCdkaXYnLCAndGl0bGUnKTtcblx0XHRcdHRpdGxlLmlubmVySFRNTCA9IHRpdGxlVGV4dDtcblxuXHRcdFx0dmFyIHdyYXBwZXI7XG5cblx0XHRcdGlmIChpc0NvbnRhaW5lcikge1xuXHRcdFx0XHR2YXIgd3JhcHBlciA9IG5ld0RPTUVsZW1lbnQoJ2RpdicsICd3cmFwcGVyJyk7XG5cdFx0XHRcdHZhciBjb250ZW50ID0gbmV3RE9NRWxlbWVudCgnZGl2JywgJ2NvbnRlbnQnKTtcblx0XHRcdFx0Y29udGVudC5pbm5lckhUTUwgPSBpdGVtLmlubmVySFRNTDtcblx0XHRcdFx0d3JhcHBlci5hcHBlbmRDaGlsZChjb250ZW50KTtcblx0XHRcdH1cblxuXHRcdFx0aXRlbS5pbm5lckhUTUwgPSAnJztcblx0XHRcdGl0ZW0uYXBwZW5kQ2hpbGQodGl0bGUpO1xuXG5cdFx0XHRpZiAod3JhcHBlcikge1xuXHRcdFx0XHRpdGVtLmFwcGVuZENoaWxkKHdyYXBwZXIpO1xuXHRcdFx0XHQkKHdyYXBwZXIpLmNzcyh7aGVpZ2h0OiAwfSk7XG5cdFx0XHR9XG5cblxuXHRcdFx0JCh0aXRsZSkuY2xpY2soZnVuY3Rpb24oKXtcblx0XHRcdFx0aWYgKCF5YWgpIHtcblx0XHRcdFx0XHRpZiAobW92aW5nKSByZXR1cm47XG5cdFx0XHRcdFx0bW92aW5nID0gdHJ1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChjb250YWluZXJbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLXNpbmdsZScpKSB7XG5cdFx0XHRcdFx0dmFyIG9wZW5TaWJsaW5ncyA9IGl0ZW0uc2libGluZ3MoKS5maWx0ZXIoZnVuY3Rpb24oc2liKXtyZXR1cm4gc2liLmhhc0NsYXNzKCdvbicpO30pO1xuXHRcdFx0XHRcdG9wZW5TaWJsaW5ncy5mb3JFYWNoKGZ1bmN0aW9uKHNpYmxpbmcpe1xuXHRcdFx0XHRcdFx0dG9nZ2xlSXRlbShzaWJsaW5nKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRpZiAoIWlzQ29udGFpbmVyKSB7XG5cdFx0XHRcdFx0XHRtb3ZpbmcgPSBmYWxzZTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dG9nZ2xlSXRlbShpdGVtKTtcblx0XHRcdFx0fSwgQ1NTX0JST1dTRVJfSEFDS19ERUxBWSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0ZnVuY3Rpb24gdG9nZ2xlSXRlbSh0aGlzSXRlbSl7XG5cdFx0XHRcdHZhciB0aGlzV3JhcHBlciA9ICQodGhpc0l0ZW0pLmZpbmQoJy53cmFwcGVyJykuZXEoMCk7XG5cblx0XHRcdFx0aWYgKCF0aGlzV3JhcHBlcikgcmV0dXJuO1xuXG5cdFx0XHRcdHZhciBjb250ZW50SGVpZ2h0ID0gdGhpc1dyYXBwZXIuZmluZCgnLmNvbnRlbnQnKS5lcSgwKS5pbm5lckhlaWdodCgpICsgJ3B4JztcblxuXHRcdFx0XHRpZiAoJCh0aGlzSXRlbSkuaGFzQ2xhc3MoJ29uJykpIHtcblx0XHRcdFx0XHR0aGlzV3JhcHBlci5jc3Moe2hlaWdodDogY29udGVudEhlaWdodH0pO1xuXHRcdFx0XHRcdCQodGhpc0l0ZW0pLnJlbW92ZUNsYXNzKCdvbicpO1xuXG5cdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0dGhpc1dyYXBwZXIuY3NzKHtoZWlnaHQ6IDB9KTtcblx0XHRcdFx0XHRcdG1vdmluZyA9IGZhbHNlO1xuXHRcdFx0XHRcdH0sIENTU19CUk9XU0VSX0hBQ0tfREVMQVkpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCQoaXRlbSkuYWRkQ2xhc3MoJ29uJyk7XG5cdFx0XHRcdFx0dGhpc1dyYXBwZXIuY3NzKHtoZWlnaHQ6IGNvbnRlbnRIZWlnaHR9KTtcblxuXHRcdFx0XHRcdHZhciBkdXJhdGlvbiA9IHBhcnNlRmxvYXQoZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzV3JhcHBlclswXSkudHJhbnNpdGlvbkR1cmF0aW9uKSAqIDEwMDA7XG5cblx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHR0aGlzV3JhcHBlci5jc3Moe2hlaWdodDogJyd9KTtcblx0XHRcdFx0XHRcdG1vdmluZyA9IGZhbHNlO1xuXHRcdFx0XHRcdH0sIGR1cmF0aW9uKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHR2YXIgaW5uZXJDb250YWluZXJzID0gJChjb250ZW50KS5jaGlsZHJlbignLmNvbnRhaW5lcicpO1xuXHRcdFx0aWYgKGlubmVyQ29udGFpbmVycy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdGlubmVyQ29udGFpbmVycy5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0Q29sbGFwc2VCb3goJCh0aGlzKSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2V0WUFIKCkge1xuXHRcdHZhciBwYXRobmFtZSA9IGxvY2F0aW9uLmhyZWYuc3BsaXQoJyMnKVswXTsgLy8gb24gcGFnZSBsb2FkLCBtYWtlIHN1cmUgdGhlIHBhZ2UgaXMgWUFIIGV2ZW4gaWYgdGhlcmUncyBhIGhhc2hcblx0XHR2YXIgY3VycmVudExpbmtzID0gW107XG5cblx0XHQkKCcucGktYWNjb3JkaW9uIGEnKS5lYWNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmIChwYXRobmFtZSA9PT0gdGhpcy5ocmVmKSBjdXJyZW50TGlua3MucHVzaCh0aGlzKTtcblx0XHR9KTtcblxuXHRcdGN1cnJlbnRMaW5rcy5mb3JFYWNoKGZ1bmN0aW9uICh5YWhMaW5rKSB7XG5cdFx0XHQkKHlhaExpbmspLnBhcmVudHMoJy5pdGVtJykuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0XHRjb25zb2xlLmxvZyh0aGlzKTtcblx0XHRcdFx0JCh0aGlzKS5hZGRDbGFzcygnb24nKTtcblx0XHRcdFx0JCh0aGlzKS5maW5kKCcud3JhcHBlcicpLmVxKDApLmNzcyh7aGVpZ2h0OiAnYXV0byd9KTtcblx0XHRcdFx0JCh0aGlzKS5maW5kKCcuY29udGVudCcpLmVxKDApLmNzcyh7b3BhY2l0eTogMX0pO1xuXHRcdFx0fSk7XG5cblx0XHRcdCQoeWFoTGluaykuYWRkQ2xhc3MoJ3lhaCcpO1xuXHRcdFx0eWFoTGluay5vbmNsaWNrID0gZnVuY3Rpb24oZSl7ZS5wcmV2ZW50RGVmYXVsdCgpO307XG5cdFx0fSk7XG5cdH1cblxuXHQvL8+ALm1vZHMucHVzaChpbml0KTtcbn0pKCk7XG5cblxuXG4vLyBUT0RPOiBzY3JvbGxpbnRvdmlldyBpbi1wYWdlIFRPQyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
