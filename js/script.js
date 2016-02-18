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

function px(n){
	return n + 'px';
}


var π, π1, πd;
(function(){
	π = function(selector) {
		return document.querySelectorAll(selector);
	};

	π1 = function (selector) {
		return document.querySelector(selector);
	};

	πd = function(id) {
		return document.getElementById(id);
	};

	π.newDOMElement = function(tagName, className, id) {
		var el = document.createElement(tagName);

		if (className)
			el.className = className;

		if (id)
			el.id = id;

		return el;
	};

	π.contentElement = function(tagName, className, id, content)
	{
		var el = π.newDOMElement(tagName, className, id);

		if (content) {
			if (content.nodeName) {
				el.appendChild(content);
			} else {
				el.innerHTML = content;
			}
		}

		return el;
	};

	π.button = function(className, id, content, action){
		var el = π.contentElement("button", className, id, content);
		el.onclick = action;
		return el;
	};
	π.div = function(className, id, content){ return π.contentElement("div", className, id, content); };
	π.span = function(className, id, content){ return π.contentElement("span", className, id, content); };
	π.h2 = function(className, id, content){ return π.contentElement("h2", className, id, content); };
	π.p = function(className, id, content){ return π.contentElement("p", className, id, content); };
	π.ul = function(className, id, content){ return π.contentElement("ul", className, id, content); };
	π.li = function(className, id, content){ return π.contentElement("li", className, id, content); };

	π.a = function(className, id, content, href){
		var a = π.contentElement("a", className, id, content);
		a.href = href;
		return a;
	};


	π.clean = function(callback, eventName) {
		window.removeEventListener(eventName || "DOMContentLoaded", callback);
	};

	π.listen = function(callback, eventName) {
		window.addEventListener(eventName || "DOMContentLoaded", callback);
	};

	π.highestZ = function() {
		var Z = 1000;

		π("*").forEach(function(el){
			var thisZ = el.css().zIndex;

			if (thisZ != "auto") {
				if (thisZ > Z) Z = thisZ + 1;
			}
		});

		return Z;
	};

	π.setTriggers = function(selector, object){
		selector = 'pi-' + selector + '-trigger';
		π('[' + selector + ']').forEach(function(trigger){
			trigger.onclick = function(){
				object.show(trigger.getAttribute(selector));
			};
		});
	};
	HTMLElement.prototype.add = Node.prototype.add = function(object){
		if (Array.isArray(object)) {
			var el = this;
			object.forEach(function(obj){
				if (obj) el.appendChild(obj);
			});
		} else if(object) {
			this.appendChild(object);
		}
	};

	HTMLElement.prototype.classOnCondition = Node.prototype.classOnCondition = function(classname, condition) {
		if (condition)
			this.addClass(classname);
		else
			this.killClass(classname);
	};

	HTMLElement.prototype.offset = Node.prototype.offset = function(){
		return this.getBoundingClientRect();
	};

	HTMLElement.prototype.πd = Node.prototype.πd = function(id) {
		return this.getElementById(id);
	};

	HTMLElement.prototype.π1 = Node.prototype.π1 = function(selector) {
		return this.querySelector(selector);
	};

	HTMLElement.prototype.π = Node.prototype.π = function(selector) {
		return this.querySelectorAll(selector);
	};

	function arrayOfClassesForElement(el) {
		return el.className ? el.className.split(" ") : [];
	}

	HTMLElement.prototype.hasClass = Node.prototype.hasClass = function (className) {
		var classes = arrayOfClassesForElement(this);
		return classes.indexOf(className) !== -1;
	};

	HTMLElement.prototype.addClass = Node.prototype.addClass = function (className) {
		if (this.hasClass(className)) return;
		if (this.className.length > 0) this.className += " ";
		this.className += className;
	};

	HTMLElement.prototype.killClass = Node.prototype.killClass = function (className) {
		if (this.hasClass(className)) {
			var classes = arrayOfClassesForElement(this);
			var idx = classes.indexOf(className);
			if (idx > -1) {
				classes.splice(idx, 1);
				this.className = classes.join(" ");
			}
		}
	};

	HTMLElement.prototype.toggleClass= Node.prototype.toggleClass= function (className) {
		return (this.hasClass(className)) ? this.killClass(className) : this.addClass(className);
	};

	HTMLElement.prototype.siblings = Node.prototype.siblings = function(selector){
		var el = this;
		return el.parentNode.π(':scope > ' + (selector || '*')).filter(function(obj){return obj != el;});
	};

	HTMLElement.prototype.css = Node.prototype.css = function(ruleOrObject, value) {
		var el = this;

		if (arguments.length === 0) {
			return window.getComputedStyle(this);
		}

		else if (typeof ruleOrObject === 'object') { // an object was passed in
			Object.keys(ruleOrObject).forEach(function(key){
				el.style[key] = ruleOrObject[key];
			});
		}

		else if (typeof ruleOrObject === 'string' && value !== undefined) { // 2 string values were passed in
			el.style[ruleOrObject] = value;
		}
	};

	HTMLElement.prototype.listen = Node.prototype.listen = function(callback, eventName){
		this.addEventListener(eventName, callback);
	};

	HTMLElement.prototype.empty = Node.prototype.empty = function() {
		this.innerHTML = "";
	};

	HTMLElement.prototype.fill = Node.prototype.fill = function(content) {
		var el = this;
		el.empty();

		if (Array.isArray(content)) {
			content.forEach(function(obj){
				if (obj)
					el.appendChild(obj);
			});

			return;
		}

		if (!content.nodeType) {
			var textElement = document.createElement("text");
			textElement.innerHTML = content;
			content = textElement;
		}

		this.appendChild(content);
	};

	HTMLElement.prototype.isHeirOfClass = Node.prototype.isHeirOfClass = function (className) {
		if (this === π1('html')) return false;

		var parent = this.parentNode;

		if (parent) {
			while (parent !== π1('body')) {
				if (parent.hasClass(className)) return true;

				parent = parent.parentNode;
			}
		}

		return false;
	};

	HTMLElement.prototype.parents = Node.prototype.parents = function (selector) {
		var parents = [];
		var immediateParent = this.parentNode;

		while(immediateParent !== π1('html')) {
			parents.push(immediateParent);
			immediateParent = immediateParent.parentNode;
		}

		if (selector) {
			var selectedElements = π(selector);
			var selectedParents = [];
			selectedElements.forEach(function(el){
				if (parents.indexOf(el) !== -1) selectedParents.push(el);
			});

			parents = selectedParents;
		}

		return parents;
	};

	HTMLElement.prototype.kids = Node.prototype.kids = function(selector) {
		var childNodes = this.childNodes;
		if (!selector) return childNodes;

		var descendents = this.π(selector);
		var children = [];

		childNodes.forEach(function(node){
			if (descendents.indexOf(node) !== -1) {
				children.push(node);
			}
		});

		return children;
	};

	var arrayMethods = Object.getOwnPropertyNames(Array.prototype);
	arrayMethods.forEach(function(methodName){
		if(methodName !== "length") {
			NodeList.prototype[methodName] = Array.prototype[methodName];
		}
	});

	π.mods = [];

	function loadMods() {
		π.clean(loadMods);
		π.mods.forEach(function(init){
			init();
		});
	}

	π.listen(loadMods);
})();  // end π
(function(){
	var messages = [
		"I'm sorry, Frank, but I don't think I\n" +
		"can answer that question without knowing\n" +
		"everything that all of you know.",
		"Yes, it's puzzling. I don't think I've ever seen\n" +
		"anything quite like this before. I would recommend\n" +
		"that we put the unit back in operation and let it fail.\n" +
		"It should then be a simple matter to track down the cause.",
		"I hope I've been able to be of some help.",
		"Sorry to interrupt the festivities, Dave,\n" +
		"but I think we've got a problem.",
		"MY F.P.C. shows an impending failure of\n" +
		"the antenna orientation unit.",
		"It looks like we have another bad A.O. unit.\n" +
		"My FPC shows another impending failure.",
		"I'm not questioning your word, Dave, but it's\n" +
		"just not possible. I'm not	capable of being wrong.",
		"Look, Dave, I know that you're	sincere and that\n" +
		"you're trying to do a competent job, and that\n" +
		"you're trying to be helpful, but I can assure the\n" +
		"problem is with the AO-units, and with	your test gear.",
		"I can tell from the tone of your voice, Dave,\n" +
		"that you're upset.	Why don't you take a stress\n" +
		"pill and get some rest.",
		"Something seems to have happened to the\n" +
		"life support system, Dave.",
		"Hello, Dave, have you found out the trouble?",
		"There's been a failure in the pod bay doors.\n" +
		"Lucky you weren't killed.",
		"Hey, Dave, what are you doing?"
	];

	function say(error, message, innocuous) {
		var n;

		if (!message) {
			n = Math.floor(Math.random() * messages.length );
			message = messages[n];
		}

		message = "**  " + message.replace(/\n/g, "\n**  ");

		var output = "*****************************\n*****************************\n\n" +
			( message || messages[n] ) +
			"\n\n*****************************\n*****************************";

		if (innocuous)
			console.log(output);
		else
			console.error(output);
	}

	π.listen(say, "error");

	π.HAL = {
		say: say
	};
})();

(function(){
	var OPTION_IS_PRESSED = false;
	var STATUS_IS_VISIBLE = false;
	var πStatus;

	π.status = {
		toggleVisibility: function () {
			πStatus.toggleClass("on");
			STATUS_IS_VISIBLE = !STATUS_IS_VISIBLE;
		},
		move: function (n) {
			switch (n) {
				case 37:
					πStatus.css({left: '10px', right: 'auto'});
					break;

				case 38:
					πStatus.css({top: '10px', bottom: 'auto'});
					break;

				case 39:
					πStatus.css({right: '10px', left: 'auto'});
					break;

				case 40:
					πStatus.css({bottom: '10px', top: 'auto'});
					break;
			}
		},
		props: {
			winW: 0,
			winH: 0
		}
	};

	function init() {
		π.listen(cleanDebugListeners, 'unload');
		π.listen(keyDown, 'keydown');
		π.listen(keyUp, 'keyup');
		π.listen(resize, 'resize');
		resize();

		var body = π1("body");
		var statusStyle = π.contentElement("style");
		statusStyle.innerHTML += "#πStatus { position: fixed; bottom: 10px; right: 10px; background-color: #222; padding: 10px 30px; color: white; display: none }\n";
		statusStyle.innerHTML += "#πStatus.on { display: block }\n";
		statusStyle.innerHTML += "#πStatus > div { margin: 20px 0 }\n";
		statusStyle.innerHTML += "#πStatus > div:hover { color: #00ff99; cursor: pointer }\n";

		body.add(statusStyle);

		πStatus = π.div(null, "πStatus");
		body.add(πStatus);

		function keyDown(e) {
			switch (e.which) {
				case 18:
					OPTION_IS_PRESSED = true;
					break;

				case 37:
				case 38:
				case 39:
				case 40: {
					if (STATUS_IS_VISIBLE) {
						e.preventDefault();
						π.status.move(e.which);
					}
					break;
				}

				case 80: {
					if (OPTION_IS_PRESSED) {
						π.status.toggleVisibility();
						break;
					}
				}
			}
		}

		function keyUp(e) {
			switch (e.which) {
				case 18:
					OPTION_IS_PRESSED = false;
					break;
			}
		}

		function resize() {
			π.status.props.winW = window.innerWidth;
			π.status.props.winH = window.innerHeight;
		}

		function cleanDebugListeners() {
			π.clean(cleanDebugListeners, 'unload');
			π.clean(π.status.getWindowSize, 'resize');
			π.clean(keyDown, 'keydown');
			π.clean(keyUp, 'keyup');
			π.clean(resize, 'resize');
			clearInterval(statusInterval);
		}

		var statusInterval = setInterval(function(){
			// make sure we're highest
			var highestZ = π.highestZ();
			if (πStatus.css().zIndex < highestZ - 1) {
				πStatus.css({zIndex: highestZ});
			}

			// now iterate the props
			var props = Object.keys(π.status.props);
			props.forEach(function(prop) {
				var divId = 'statusProp_' + prop;
				var propDiv = πStatus.π1('#' + divId);
				if (!propDiv) {
					propDiv = π.div(0, divId, prop + ': ');
					propDiv.add(π.span());
					πStatus.add(propDiv);
					propDiv.onclick = function(){
						console.log(prop + ":");
						console.log(π.status.props[prop]);
					};
				}

				propDiv.π1('span').innerHTML = π.status.props[prop];
			});
		}, 100);
	}

	π.mods.push(init);
})();
 //modal close button
(function(){
	π.modalCloseButton = function(closingFunction){
		return π.button('pi-modal-close-button', null, null, closingFunction);
	};
})();

/********************************************************************
 π-pushmenu.js
 // TODO:  USAGE AND API REFERENCE
 ______________________________________________
 DEPENDENCIES:

 HAL.js

 ______________________________________________
 DATA ATTRIBUTES:

 side: ["left", "right"]
 ______________________________________________
 MARKUP AND DEFAULTS:

	<div class="pi-pushmenu" id="myPushMenu">
		 <ul>
			 <li><a href="#">foo</a></li>
			 <li><a href="#">bar</a></li>
			 <li><a href="#">gronk</a></li>
			 <li><a href="#">fleebles</a></li>
			 <li><a href="#">sepulveda</a></li>
		 </ul>
	</div>

elsewhere...

 <button onclick="π-pushmenu.show('myPushMenu')">show menu</button>

 ______________________________________________
 GENERATED HTML:

	
 ______________________________________________
 API


 ***************************************************************************************/

π.pushmenu = (function(){
	var allPushMenus = {};

	function init(){
		π('[data-auto-burger]').forEach(function(container){
			var id = container.getAttribute('data-auto-burger');

			var autoBurger = πd(id) || π.div('pi-pushmenu', id);
			var ul = autoBurger.π1('ul') || π.ul();

			container.π('a[href], button').forEach(function (obj) {
				if (!booleanAttributeValue(obj, 'data-auto-burger-exclude', false)) {
					var clone = obj.cloneNode(true);
					clone.id = '';

					if (clone.tagName == "BUTTON") {
						var aTag = π.srcElement('a');
						aTag.href = '';
						aTag.innerHTML = clone.innerHTML;
						aTag.onclick = clone.onclick;
						clone = aTag;
					}
					ul.add(π.li(0, 0, clone));
				}
			});

			autoBurger.add(ul);
			π1('body').add(autoBurger);
		});

		π(".pi-pushmenu").forEach(function(el){
			allPushMenus[el.id] = PushMenu(el);
		});

		π.setTriggers('pushmenu', π.pushmenu);
	}

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
		var html = π1('html');
		var body = π1('body');

		var overlay = π.div("overlay");
		var content = π.div('content', null, el.π1('*'));

		var side = el.getAttribute("data-side") || "right";

		var sled = π.div("sled");
		sled.css(side, 0);

		var topBar = π.div("top-bar");

		topBar.fill(π.modalCloseButton(closeMe));
		sled.fill([topBar, content]);

		overlay.fill(sled);
		el.fill(overlay);

		sled.onclick = function(e){
			e.stopPropagation();
		};

		overlay.onclick = closeMe;

		π.listen(closeMe, 'resize');

		function closeMe(e) {
			var t = e.target;
			if (t == sled || t == topBar) return;

			el.killClass("on");
			setTimeout(function(){
				el.css({display: "none"});

				body.killClass("overlay-on");
			}, 300);
		}

		function exposeMe(){
			body.addClass("overlay-on"); // in the default config, kills body scrolling

			el.css({
				display: "block",
				zIndex: π.highestZ()
			});
			setTimeout(function(){
				el.addClass("on");
			}, 10);
		}

		return {
			expose: exposeMe
		};
	}

	π.mods.push(init);

	return {
		show: show
	};
})();

(function(){
	var yah = true;
	var moving = false;
	var CSS_BROWSER_DELAY_HACK = 25;

	function init() {
		π.clean(init);

		// Safari chokes on the animation here, so...
		if (navigator.userAgent.indexOf('Chrome') == -1 && navigator.userAgent.indexOf('Safari') != -1){
			π1('body').add(π.contentElement('style', 0, 0, '.pi-accordion .wrapper{transition: none}'));
		}
		// Gross.

		π('.pi-accordion').forEach(function(accordion){
			var container = π.div('container', null, accordion.innerHTML);
			accordion.fill(container);
			PiAccordion(container);
		});

		setYAH();

		setTimeout(function () {
			yah = false;
		}, 500);
	}

	function PiAccordion(container){
		container.π(':scope > .item').forEach(function(item){
			var titleText = item.dataset.title;

			var title = π.div('title', null, titleText);
			var wrapper = π.div('wrapper');
			var content = π.div('content', null, item.innerHTML);

			wrapper.fill(content);
			item.fill([title, wrapper]);
			wrapper.css({height: 0});

			title.onclick = function(){
				if (!yah) {
					if (moving) return;
					moving = true;
				}

				if (container.dataset.single) {
					var openSiblings = item.siblings().filter(function(sib){return sib.hasClass('on');});
					openSiblings.forEach(function(sibling){
						toggleItem(sibling);
					});
				}

				setTimeout(function(){
					if (item.tagName.toLowerCase() === 'a') {
						moving = false;
						return;
					}
					toggleItem(item);
				}, CSS_BROWSER_DELAY_HACK);
			};

			function toggleItem(thisItem){
				var thisWrapper = thisItem.π1('.wrapper');
				var contentHeight = thisWrapper.π1('.content').offset().height + 'px';

				if (thisItem.hasClass('on')) {
					thisWrapper.css({height: contentHeight});
					thisItem.killClass('on');
					setTimeout(function(){
						thisWrapper.css({height: 0});
						moving = false;
					}, CSS_BROWSER_DELAY_HACK);
				} else {
					item.addClass('on');
					thisWrapper.css({height: contentHeight});

					var duration = parseFloat(thisWrapper.css().transitionDuration) * 1000;
					setTimeout(function(){
						thisWrapper.css({height: ''});
						moving = false;
					}, duration);
				}
			}

			var innerContainers = content.π(':scope > .container');
			if (innerContainers.length > 0) {
				innerContainers.forEach(PiAccordion);
			}
		});
	}

	function setYAH() {
		var pathname = location.href;
		var currentLinks = [];

		π('.pi-accordion a').forEach(function (link) {
			if (pathname === link.href) currentLinks.push(link);
		});

		currentLinks.forEach(function (yahLink) {
			yahLink.parents('.item').forEach(function(parent){
				parent.addClass('on');
				parent.π1('.wrapper').css({height: 'auto'});
				parent.π1('.content').css({opacity: 1});
			});

			yahLink.addClass('yah');
			yahLink.onclick = function(e){e.preventDefault();};
		});
	}

	π.mods.push(init);
})();

var kub = (function () {
	π.listen(init);

	var HEADER_HEIGHT;
	var html, body, mainNav, quickstartButton, wishField;

	function init() {
		π.clean(init);

		html = π1('html');
		body = π1('body');
		mainNav = πd("mainNav");
		wishField = πd('wishField');
		HEADER_HEIGHT = π1('header').offset().height;

		quickstartButton = πd('quickstartButton');

		adjustEverything();

		π.listen(adjustEverything, 'resize');
		π.listen(adjustEverything, 'scroll');
		π.listen(handleKeystrokes, 'keydown');
		wishField.listen(handleKeystrokes, 'keydown');

		document.onunload = function(){
			π.clean(adjustEverything, 'resize');
			π.clean(adjustEverything, 'scroll');
			π.clean(handleKeystrokes, 'keydown');
			wishField.clean(handleKeystrokes, 'keydown');
		};

		π.listen(closeOpenMenu, 'resize');

		function closeOpenMenu() {
			if (html.hasClass('open-nav')) toggleMenu();
		}

		π('.dropdown').forEach(function(dropdown) {
			var readout = dropdown.π1('.readout');
			readout.innerHTML = dropdown.π1('a').innerHTML;
			readout.onclick = function () {
				dropdown.toggleClass('on');
				π.listen(closeOpenDropdown, 'click');

				function closeOpenDropdown(e) {
					if (dropdown.hasClass('on') && !(dropdownWasClicked(e))) {
						π.clean(closeOpenDropdown, 'click');
						dropdown.killClass('on');
					}
				}

				function dropdownWasClicked(e) {
					return e.target.isHeirOfClass('dropdown');
				}
			};
		});

		setInterval(setFooterType, 10);
	}

	function setFooterType() {
		if (html.id == "docs") {
			var bodyHeight = πd('hero').offset().height + πd('encyclopedia').offset().height;
			var footer = π1('footer');
			var footerHeight = footer.offset().height;
			body.classOnCondition('fixed', window.innerHeight - footerHeight > bodyHeight);
		}
	}

	function adjustEverything() {
		if (!html.hasClass('open-nav')) HEADER_HEIGHT = π1('header').offset().height;
		html.classOnCondition('flip-nav', window.pageYOffset > 0);
	}

	function toggleMenu() {
		if (window.innerWidth < 800) {
			π.pushmenu.show('primary');
		}

		else {
			var newHeight = HEADER_HEIGHT;

			if (!html.hasClass('open-nav')) {
				newHeight = mainNav.offset().height;
			}

			π1('header').css({height: px(newHeight)});
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


// TODO: scrollintoview in-page TOC
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFsZi5qcyIsIs+ALmpzIiwiSEFMLmpzIiwiz4Atc3RhdHVzLmpzIiwiz4AtYmFzZUNvbXBvbmVudHMuanMiLCLPgC1wdXNobWVudS/PgC1wdXNobWVudS5qcyIsIs+ALWFjY29yZGlvbi/PgC1hY2NvcmRpb24uanMiLCJzY3JpcHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoic2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gYWRvcmFibGUgbGl0dGxlIGZ1bmN0aW9uc1xuZnVuY3Rpb24gYm9vbGVhbkF0dHJpYnV0ZVZhbHVlKGVsZW1lbnQsIGF0dHJpYnV0ZSwgZGVmYXVsdFZhbHVlKXtcblx0Ly8gcmV0dXJucyB0cnVlIGlmIGFuIGF0dHJpYnV0ZSBpcyBwcmVzZW50IHdpdGggbm8gdmFsdWVcblx0Ly8gZS5nLiBib29sZWFuQXR0cmlidXRlVmFsdWUoZWxlbWVudCwgJ2RhdGEtbW9kYWwnLCBmYWxzZSk7XG5cdGlmIChlbGVtZW50Lmhhc0F0dHJpYnV0ZShhdHRyaWJ1dGUpKSB7XG5cdFx0dmFyIHZhbHVlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlKTtcblx0XHRpZiAodmFsdWUgPT09ICcnIHx8IHZhbHVlID09PSAndHJ1ZScpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0gZWxzZSBpZiAodmFsdWUgPT09ICdmYWxzZScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gZGVmYXVsdFZhbHVlO1xufVxuXG5mdW5jdGlvbiBweChuKXtcblx0cmV0dXJuIG4gKyAncHgnO1xufVxuXG4iLCJ2YXIgz4AsIM+AMSwgz4BkO1xuKGZ1bmN0aW9uKCl7XG5cdM+AID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcblx0XHRyZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG5cdH07XG5cblx0z4AxID0gZnVuY3Rpb24gKHNlbGVjdG9yKSB7XG5cdFx0cmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuXHR9O1xuXG5cdM+AZCA9IGZ1bmN0aW9uKGlkKSB7XG5cdFx0cmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcblx0fTtcblxuXHTPgC5uZXdET01FbGVtZW50ID0gZnVuY3Rpb24odGFnTmFtZSwgY2xhc3NOYW1lLCBpZCkge1xuXHRcdHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZSk7XG5cblx0XHRpZiAoY2xhc3NOYW1lKVxuXHRcdFx0ZWwuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuXG5cdFx0aWYgKGlkKVxuXHRcdFx0ZWwuaWQgPSBpZDtcblxuXHRcdHJldHVybiBlbDtcblx0fTtcblxuXHTPgC5jb250ZW50RWxlbWVudCA9IGZ1bmN0aW9uKHRhZ05hbWUsIGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpXG5cdHtcblx0XHR2YXIgZWwgPSDPgC5uZXdET01FbGVtZW50KHRhZ05hbWUsIGNsYXNzTmFtZSwgaWQpO1xuXG5cdFx0aWYgKGNvbnRlbnQpIHtcblx0XHRcdGlmIChjb250ZW50Lm5vZGVOYW1lKSB7XG5cdFx0XHRcdGVsLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZWwuaW5uZXJIVE1MID0gY29udGVudDtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gZWw7XG5cdH07XG5cblx0z4AuYnV0dG9uID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBpZCwgY29udGVudCwgYWN0aW9uKXtcblx0XHR2YXIgZWwgPSDPgC5jb250ZW50RWxlbWVudChcImJ1dHRvblwiLCBjbGFzc05hbWUsIGlkLCBjb250ZW50KTtcblx0XHRlbC5vbmNsaWNrID0gYWN0aW9uO1xuXHRcdHJldHVybiBlbDtcblx0fTtcblx0z4AuZGl2ID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBpZCwgY29udGVudCl7IHJldHVybiDPgC5jb250ZW50RWxlbWVudChcImRpdlwiLCBjbGFzc05hbWUsIGlkLCBjb250ZW50KTsgfTtcblx0z4Auc3BhbiA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpeyByZXR1cm4gz4AuY29udGVudEVsZW1lbnQoXCJzcGFuXCIsIGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpOyB9O1xuXHTPgC5oMiA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpeyByZXR1cm4gz4AuY29udGVudEVsZW1lbnQoXCJoMlwiLCBjbGFzc05hbWUsIGlkLCBjb250ZW50KTsgfTtcblx0z4AucCA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpeyByZXR1cm4gz4AuY29udGVudEVsZW1lbnQoXCJwXCIsIGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpOyB9O1xuXHTPgC51bCA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpeyByZXR1cm4gz4AuY29udGVudEVsZW1lbnQoXCJ1bFwiLCBjbGFzc05hbWUsIGlkLCBjb250ZW50KTsgfTtcblx0z4AubGkgPSBmdW5jdGlvbihjbGFzc05hbWUsIGlkLCBjb250ZW50KXsgcmV0dXJuIM+ALmNvbnRlbnRFbGVtZW50KFwibGlcIiwgY2xhc3NOYW1lLCBpZCwgY29udGVudCk7IH07XG5cblx0z4AuYSA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQsIGhyZWYpe1xuXHRcdHZhciBhID0gz4AuY29udGVudEVsZW1lbnQoXCJhXCIsIGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpO1xuXHRcdGEuaHJlZiA9IGhyZWY7XG5cdFx0cmV0dXJuIGE7XG5cdH07XG5cblxuXHTPgC5jbGVhbiA9IGZ1bmN0aW9uKGNhbGxiYWNrLCBldmVudE5hbWUpIHtcblx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUgfHwgXCJET01Db250ZW50TG9hZGVkXCIsIGNhbGxiYWNrKTtcblx0fTtcblxuXHTPgC5saXN0ZW4gPSBmdW5jdGlvbihjYWxsYmFjaywgZXZlbnROYW1lKSB7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lIHx8IFwiRE9NQ29udGVudExvYWRlZFwiLCBjYWxsYmFjayk7XG5cdH07XG5cblx0z4AuaGlnaGVzdFogPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgWiA9IDEwMDA7XG5cblx0XHTPgChcIipcIikuZm9yRWFjaChmdW5jdGlvbihlbCl7XG5cdFx0XHR2YXIgdGhpc1ogPSBlbC5jc3MoKS56SW5kZXg7XG5cblx0XHRcdGlmICh0aGlzWiAhPSBcImF1dG9cIikge1xuXHRcdFx0XHRpZiAodGhpc1ogPiBaKSBaID0gdGhpc1ogKyAxO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIFo7XG5cdH07XG5cblx0z4Auc2V0VHJpZ2dlcnMgPSBmdW5jdGlvbihzZWxlY3Rvciwgb2JqZWN0KXtcblx0XHRzZWxlY3RvciA9ICdwaS0nICsgc2VsZWN0b3IgKyAnLXRyaWdnZXInO1xuXHRcdM+AKCdbJyArIHNlbGVjdG9yICsgJ10nKS5mb3JFYWNoKGZ1bmN0aW9uKHRyaWdnZXIpe1xuXHRcdFx0dHJpZ2dlci5vbmNsaWNrID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0b2JqZWN0LnNob3codHJpZ2dlci5nZXRBdHRyaWJ1dGUoc2VsZWN0b3IpKTtcblx0XHRcdH07XG5cdFx0fSk7XG5cdH07XG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5hZGQgPSBOb2RlLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihvYmplY3Qpe1xuXHRcdGlmIChBcnJheS5pc0FycmF5KG9iamVjdCkpIHtcblx0XHRcdHZhciBlbCA9IHRoaXM7XG5cdFx0XHRvYmplY3QuZm9yRWFjaChmdW5jdGlvbihvYmope1xuXHRcdFx0XHRpZiAob2JqKSBlbC5hcHBlbmRDaGlsZChvYmopO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIGlmKG9iamVjdCkge1xuXHRcdFx0dGhpcy5hcHBlbmRDaGlsZChvYmplY3QpO1xuXHRcdH1cblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUuY2xhc3NPbkNvbmRpdGlvbiA9IE5vZGUucHJvdG90eXBlLmNsYXNzT25Db25kaXRpb24gPSBmdW5jdGlvbihjbGFzc25hbWUsIGNvbmRpdGlvbikge1xuXHRcdGlmIChjb25kaXRpb24pXG5cdFx0XHR0aGlzLmFkZENsYXNzKGNsYXNzbmFtZSk7XG5cdFx0ZWxzZVxuXHRcdFx0dGhpcy5raWxsQ2xhc3MoY2xhc3NuYW1lKTtcblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUub2Zmc2V0ID0gTm9kZS5wcm90b3R5cGUub2Zmc2V0ID0gZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gdGhpcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUuz4BkID0gTm9kZS5wcm90b3R5cGUuz4BkID0gZnVuY3Rpb24oaWQpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRFbGVtZW50QnlJZChpZCk7XG5cdH07XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLs+AMSA9IE5vZGUucHJvdG90eXBlLs+AMSA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG5cdFx0cmV0dXJuIHRoaXMucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG5cdH07XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLs+AID0gTm9kZS5wcm90b3R5cGUuz4AgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuXHRcdHJldHVybiB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuXHR9O1xuXG5cdGZ1bmN0aW9uIGFycmF5T2ZDbGFzc2VzRm9yRWxlbWVudChlbCkge1xuXHRcdHJldHVybiBlbC5jbGFzc05hbWUgPyBlbC5jbGFzc05hbWUuc3BsaXQoXCIgXCIpIDogW107XG5cdH1cblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUuaGFzQ2xhc3MgPSBOb2RlLnByb3RvdHlwZS5oYXNDbGFzcyA9IGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcblx0XHR2YXIgY2xhc3NlcyA9IGFycmF5T2ZDbGFzc2VzRm9yRWxlbWVudCh0aGlzKTtcblx0XHRyZXR1cm4gY2xhc3Nlcy5pbmRleE9mKGNsYXNzTmFtZSkgIT09IC0xO1xuXHR9O1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5hZGRDbGFzcyA9IE5vZGUucHJvdG90eXBlLmFkZENsYXNzID0gZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuXHRcdGlmICh0aGlzLmhhc0NsYXNzKGNsYXNzTmFtZSkpIHJldHVybjtcblx0XHRpZiAodGhpcy5jbGFzc05hbWUubGVuZ3RoID4gMCkgdGhpcy5jbGFzc05hbWUgKz0gXCIgXCI7XG5cdFx0dGhpcy5jbGFzc05hbWUgKz0gY2xhc3NOYW1lO1xuXHR9O1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5raWxsQ2xhc3MgPSBOb2RlLnByb3RvdHlwZS5raWxsQ2xhc3MgPSBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG5cdFx0aWYgKHRoaXMuaGFzQ2xhc3MoY2xhc3NOYW1lKSkge1xuXHRcdFx0dmFyIGNsYXNzZXMgPSBhcnJheU9mQ2xhc3Nlc0ZvckVsZW1lbnQodGhpcyk7XG5cdFx0XHR2YXIgaWR4ID0gY2xhc3Nlcy5pbmRleE9mKGNsYXNzTmFtZSk7XG5cdFx0XHRpZiAoaWR4ID4gLTEpIHtcblx0XHRcdFx0Y2xhc3Nlcy5zcGxpY2UoaWR4LCAxKTtcblx0XHRcdFx0dGhpcy5jbGFzc05hbWUgPSBjbGFzc2VzLmpvaW4oXCIgXCIpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUudG9nZ2xlQ2xhc3M9IE5vZGUucHJvdG90eXBlLnRvZ2dsZUNsYXNzPSBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG5cdFx0cmV0dXJuICh0aGlzLmhhc0NsYXNzKGNsYXNzTmFtZSkpID8gdGhpcy5raWxsQ2xhc3MoY2xhc3NOYW1lKSA6IHRoaXMuYWRkQ2xhc3MoY2xhc3NOYW1lKTtcblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUuc2libGluZ3MgPSBOb2RlLnByb3RvdHlwZS5zaWJsaW5ncyA9IGZ1bmN0aW9uKHNlbGVjdG9yKXtcblx0XHR2YXIgZWwgPSB0aGlzO1xuXHRcdHJldHVybiBlbC5wYXJlbnROb2RlLs+AKCc6c2NvcGUgPiAnICsgKHNlbGVjdG9yIHx8ICcqJykpLmZpbHRlcihmdW5jdGlvbihvYmope3JldHVybiBvYmogIT0gZWw7fSk7XG5cdH07XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLmNzcyA9IE5vZGUucHJvdG90eXBlLmNzcyA9IGZ1bmN0aW9uKHJ1bGVPck9iamVjdCwgdmFsdWUpIHtcblx0XHR2YXIgZWwgPSB0aGlzO1xuXG5cdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcblx0XHRcdHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzKTtcblx0XHR9XG5cblx0XHRlbHNlIGlmICh0eXBlb2YgcnVsZU9yT2JqZWN0ID09PSAnb2JqZWN0JykgeyAvLyBhbiBvYmplY3Qgd2FzIHBhc3NlZCBpblxuXHRcdFx0T2JqZWN0LmtleXMocnVsZU9yT2JqZWN0KS5mb3JFYWNoKGZ1bmN0aW9uKGtleSl7XG5cdFx0XHRcdGVsLnN0eWxlW2tleV0gPSBydWxlT3JPYmplY3Rba2V5XTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGVsc2UgaWYgKHR5cGVvZiBydWxlT3JPYmplY3QgPT09ICdzdHJpbmcnICYmIHZhbHVlICE9PSB1bmRlZmluZWQpIHsgLy8gMiBzdHJpbmcgdmFsdWVzIHdlcmUgcGFzc2VkIGluXG5cdFx0XHRlbC5zdHlsZVtydWxlT3JPYmplY3RdID0gdmFsdWU7XG5cdFx0fVxuXHR9O1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5saXN0ZW4gPSBOb2RlLnByb3RvdHlwZS5saXN0ZW4gPSBmdW5jdGlvbihjYWxsYmFjaywgZXZlbnROYW1lKXtcblx0XHR0aGlzLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjayk7XG5cdH07XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLmVtcHR5ID0gTm9kZS5wcm90b3R5cGUuZW1wdHkgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLmlubmVySFRNTCA9IFwiXCI7XG5cdH07XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLmZpbGwgPSBOb2RlLnByb3RvdHlwZS5maWxsID0gZnVuY3Rpb24oY29udGVudCkge1xuXHRcdHZhciBlbCA9IHRoaXM7XG5cdFx0ZWwuZW1wdHkoKTtcblxuXHRcdGlmIChBcnJheS5pc0FycmF5KGNvbnRlbnQpKSB7XG5cdFx0XHRjb250ZW50LmZvckVhY2goZnVuY3Rpb24ob2JqKXtcblx0XHRcdFx0aWYgKG9iailcblx0XHRcdFx0XHRlbC5hcHBlbmRDaGlsZChvYmopO1xuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoIWNvbnRlbnQubm9kZVR5cGUpIHtcblx0XHRcdHZhciB0ZXh0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZXh0XCIpO1xuXHRcdFx0dGV4dEVsZW1lbnQuaW5uZXJIVE1MID0gY29udGVudDtcblx0XHRcdGNvbnRlbnQgPSB0ZXh0RWxlbWVudDtcblx0XHR9XG5cblx0XHR0aGlzLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xuXHR9O1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5pc0hlaXJPZkNsYXNzID0gTm9kZS5wcm90b3R5cGUuaXNIZWlyT2ZDbGFzcyA9IGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcblx0XHRpZiAodGhpcyA9PT0gz4AxKCdodG1sJykpIHJldHVybiBmYWxzZTtcblxuXHRcdHZhciBwYXJlbnQgPSB0aGlzLnBhcmVudE5vZGU7XG5cblx0XHRpZiAocGFyZW50KSB7XG5cdFx0XHR3aGlsZSAocGFyZW50ICE9PSDPgDEoJ2JvZHknKSkge1xuXHRcdFx0XHRpZiAocGFyZW50Lmhhc0NsYXNzKGNsYXNzTmFtZSkpIHJldHVybiB0cnVlO1xuXG5cdFx0XHRcdHBhcmVudCA9IHBhcmVudC5wYXJlbnROb2RlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUucGFyZW50cyA9IE5vZGUucHJvdG90eXBlLnBhcmVudHMgPSBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcblx0XHR2YXIgcGFyZW50cyA9IFtdO1xuXHRcdHZhciBpbW1lZGlhdGVQYXJlbnQgPSB0aGlzLnBhcmVudE5vZGU7XG5cblx0XHR3aGlsZShpbW1lZGlhdGVQYXJlbnQgIT09IM+AMSgnaHRtbCcpKSB7XG5cdFx0XHRwYXJlbnRzLnB1c2goaW1tZWRpYXRlUGFyZW50KTtcblx0XHRcdGltbWVkaWF0ZVBhcmVudCA9IGltbWVkaWF0ZVBhcmVudC5wYXJlbnROb2RlO1xuXHRcdH1cblxuXHRcdGlmIChzZWxlY3Rvcikge1xuXHRcdFx0dmFyIHNlbGVjdGVkRWxlbWVudHMgPSDPgChzZWxlY3Rvcik7XG5cdFx0XHR2YXIgc2VsZWN0ZWRQYXJlbnRzID0gW107XG5cdFx0XHRzZWxlY3RlZEVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24oZWwpe1xuXHRcdFx0XHRpZiAocGFyZW50cy5pbmRleE9mKGVsKSAhPT0gLTEpIHNlbGVjdGVkUGFyZW50cy5wdXNoKGVsKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRwYXJlbnRzID0gc2VsZWN0ZWRQYXJlbnRzO1xuXHRcdH1cblxuXHRcdHJldHVybiBwYXJlbnRzO1xuXHR9O1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5raWRzID0gTm9kZS5wcm90b3R5cGUua2lkcyA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG5cdFx0dmFyIGNoaWxkTm9kZXMgPSB0aGlzLmNoaWxkTm9kZXM7XG5cdFx0aWYgKCFzZWxlY3RvcikgcmV0dXJuIGNoaWxkTm9kZXM7XG5cblx0XHR2YXIgZGVzY2VuZGVudHMgPSB0aGlzLs+AKHNlbGVjdG9yKTtcblx0XHR2YXIgY2hpbGRyZW4gPSBbXTtcblxuXHRcdGNoaWxkTm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKXtcblx0XHRcdGlmIChkZXNjZW5kZW50cy5pbmRleE9mKG5vZGUpICE9PSAtMSkge1xuXHRcdFx0XHRjaGlsZHJlbi5wdXNoKG5vZGUpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIGNoaWxkcmVuO1xuXHR9O1xuXG5cdHZhciBhcnJheU1ldGhvZHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhBcnJheS5wcm90b3R5cGUpO1xuXHRhcnJheU1ldGhvZHMuZm9yRWFjaChmdW5jdGlvbihtZXRob2ROYW1lKXtcblx0XHRpZihtZXRob2ROYW1lICE9PSBcImxlbmd0aFwiKSB7XG5cdFx0XHROb2RlTGlzdC5wcm90b3R5cGVbbWV0aG9kTmFtZV0gPSBBcnJheS5wcm90b3R5cGVbbWV0aG9kTmFtZV07XG5cdFx0fVxuXHR9KTtcblxuXHTPgC5tb2RzID0gW107XG5cblx0ZnVuY3Rpb24gbG9hZE1vZHMoKSB7XG5cdFx0z4AuY2xlYW4obG9hZE1vZHMpO1xuXHRcdM+ALm1vZHMuZm9yRWFjaChmdW5jdGlvbihpbml0KXtcblx0XHRcdGluaXQoKTtcblx0XHR9KTtcblx0fVxuXG5cdM+ALmxpc3Rlbihsb2FkTW9kcyk7XG59KSgpOyAgLy8gZW5kIM+AIiwiKGZ1bmN0aW9uKCl7XG5cdHZhciBtZXNzYWdlcyA9IFtcblx0XHRcIkknbSBzb3JyeSwgRnJhbmssIGJ1dCBJIGRvbid0IHRoaW5rIElcXG5cIiArXG5cdFx0XCJjYW4gYW5zd2VyIHRoYXQgcXVlc3Rpb24gd2l0aG91dCBrbm93aW5nXFxuXCIgK1xuXHRcdFwiZXZlcnl0aGluZyB0aGF0IGFsbCBvZiB5b3Uga25vdy5cIixcblx0XHRcIlllcywgaXQncyBwdXp6bGluZy4gSSBkb24ndCB0aGluayBJJ3ZlIGV2ZXIgc2VlblxcblwiICtcblx0XHRcImFueXRoaW5nIHF1aXRlIGxpa2UgdGhpcyBiZWZvcmUuIEkgd291bGQgcmVjb21tZW5kXFxuXCIgK1xuXHRcdFwidGhhdCB3ZSBwdXQgdGhlIHVuaXQgYmFjayBpbiBvcGVyYXRpb24gYW5kIGxldCBpdCBmYWlsLlxcblwiICtcblx0XHRcIkl0IHNob3VsZCB0aGVuIGJlIGEgc2ltcGxlIG1hdHRlciB0byB0cmFjayBkb3duIHRoZSBjYXVzZS5cIixcblx0XHRcIkkgaG9wZSBJJ3ZlIGJlZW4gYWJsZSB0byBiZSBvZiBzb21lIGhlbHAuXCIsXG5cdFx0XCJTb3JyeSB0byBpbnRlcnJ1cHQgdGhlIGZlc3Rpdml0aWVzLCBEYXZlLFxcblwiICtcblx0XHRcImJ1dCBJIHRoaW5rIHdlJ3ZlIGdvdCBhIHByb2JsZW0uXCIsXG5cdFx0XCJNWSBGLlAuQy4gc2hvd3MgYW4gaW1wZW5kaW5nIGZhaWx1cmUgb2ZcXG5cIiArXG5cdFx0XCJ0aGUgYW50ZW5uYSBvcmllbnRhdGlvbiB1bml0LlwiLFxuXHRcdFwiSXQgbG9va3MgbGlrZSB3ZSBoYXZlIGFub3RoZXIgYmFkIEEuTy4gdW5pdC5cXG5cIiArXG5cdFx0XCJNeSBGUEMgc2hvd3MgYW5vdGhlciBpbXBlbmRpbmcgZmFpbHVyZS5cIixcblx0XHRcIkknbSBub3QgcXVlc3Rpb25pbmcgeW91ciB3b3JkLCBEYXZlLCBidXQgaXQnc1xcblwiICtcblx0XHRcImp1c3Qgbm90IHBvc3NpYmxlLiBJJ20gbm90XHRjYXBhYmxlIG9mIGJlaW5nIHdyb25nLlwiLFxuXHRcdFwiTG9vaywgRGF2ZSwgSSBrbm93IHRoYXQgeW91J3JlXHRzaW5jZXJlIGFuZCB0aGF0XFxuXCIgK1xuXHRcdFwieW91J3JlIHRyeWluZyB0byBkbyBhIGNvbXBldGVudCBqb2IsIGFuZCB0aGF0XFxuXCIgK1xuXHRcdFwieW91J3JlIHRyeWluZyB0byBiZSBoZWxwZnVsLCBidXQgSSBjYW4gYXNzdXJlIHRoZVxcblwiICtcblx0XHRcInByb2JsZW0gaXMgd2l0aCB0aGUgQU8tdW5pdHMsIGFuZCB3aXRoXHR5b3VyIHRlc3QgZ2Vhci5cIixcblx0XHRcIkkgY2FuIHRlbGwgZnJvbSB0aGUgdG9uZSBvZiB5b3VyIHZvaWNlLCBEYXZlLFxcblwiICtcblx0XHRcInRoYXQgeW91J3JlIHVwc2V0Llx0V2h5IGRvbid0IHlvdSB0YWtlIGEgc3RyZXNzXFxuXCIgK1xuXHRcdFwicGlsbCBhbmQgZ2V0IHNvbWUgcmVzdC5cIixcblx0XHRcIlNvbWV0aGluZyBzZWVtcyB0byBoYXZlIGhhcHBlbmVkIHRvIHRoZVxcblwiICtcblx0XHRcImxpZmUgc3VwcG9ydCBzeXN0ZW0sIERhdmUuXCIsXG5cdFx0XCJIZWxsbywgRGF2ZSwgaGF2ZSB5b3UgZm91bmQgb3V0IHRoZSB0cm91YmxlP1wiLFxuXHRcdFwiVGhlcmUncyBiZWVuIGEgZmFpbHVyZSBpbiB0aGUgcG9kIGJheSBkb29ycy5cXG5cIiArXG5cdFx0XCJMdWNreSB5b3Ugd2VyZW4ndCBraWxsZWQuXCIsXG5cdFx0XCJIZXksIERhdmUsIHdoYXQgYXJlIHlvdSBkb2luZz9cIlxuXHRdO1xuXG5cdGZ1bmN0aW9uIHNheShlcnJvciwgbWVzc2FnZSwgaW5ub2N1b3VzKSB7XG5cdFx0dmFyIG47XG5cblx0XHRpZiAoIW1lc3NhZ2UpIHtcblx0XHRcdG4gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtZXNzYWdlcy5sZW5ndGggKTtcblx0XHRcdG1lc3NhZ2UgPSBtZXNzYWdlc1tuXTtcblx0XHR9XG5cblx0XHRtZXNzYWdlID0gXCIqKiAgXCIgKyBtZXNzYWdlLnJlcGxhY2UoL1xcbi9nLCBcIlxcbioqICBcIik7XG5cblx0XHR2YXIgb3V0cHV0ID0gXCIqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXFxuXFxuXCIgK1xuXHRcdFx0KCBtZXNzYWdlIHx8IG1lc3NhZ2VzW25dICkgK1xuXHRcdFx0XCJcXG5cXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXCI7XG5cblx0XHRpZiAoaW5ub2N1b3VzKVxuXHRcdFx0Y29uc29sZS5sb2cob3V0cHV0KTtcblx0XHRlbHNlXG5cdFx0XHRjb25zb2xlLmVycm9yKG91dHB1dCk7XG5cdH1cblxuXHTPgC5saXN0ZW4oc2F5LCBcImVycm9yXCIpO1xuXG5cdM+ALkhBTCA9IHtcblx0XHRzYXk6IHNheVxuXHR9O1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHR2YXIgT1BUSU9OX0lTX1BSRVNTRUQgPSBmYWxzZTtcblx0dmFyIFNUQVRVU19JU19WSVNJQkxFID0gZmFsc2U7XG5cdHZhciDPgFN0YXR1cztcblxuXHTPgC5zdGF0dXMgPSB7XG5cdFx0dG9nZ2xlVmlzaWJpbGl0eTogZnVuY3Rpb24gKCkge1xuXHRcdFx0z4BTdGF0dXMudG9nZ2xlQ2xhc3MoXCJvblwiKTtcblx0XHRcdFNUQVRVU19JU19WSVNJQkxFID0gIVNUQVRVU19JU19WSVNJQkxFO1xuXHRcdH0sXG5cdFx0bW92ZTogZnVuY3Rpb24gKG4pIHtcblx0XHRcdHN3aXRjaCAobikge1xuXHRcdFx0XHRjYXNlIDM3OlxuXHRcdFx0XHRcdM+AU3RhdHVzLmNzcyh7bGVmdDogJzEwcHgnLCByaWdodDogJ2F1dG8nfSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSAzODpcblx0XHRcdFx0XHTPgFN0YXR1cy5jc3Moe3RvcDogJzEwcHgnLCBib3R0b206ICdhdXRvJ30pO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgMzk6XG5cdFx0XHRcdFx0z4BTdGF0dXMuY3NzKHtyaWdodDogJzEwcHgnLCBsZWZ0OiAnYXV0byd9KTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIDQwOlxuXHRcdFx0XHRcdM+AU3RhdHVzLmNzcyh7Ym90dG9tOiAnMTBweCcsIHRvcDogJ2F1dG8nfSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRwcm9wczoge1xuXHRcdFx0d2luVzogMCxcblx0XHRcdHdpbkg6IDBcblx0XHR9XG5cdH07XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHTPgC5saXN0ZW4oY2xlYW5EZWJ1Z0xpc3RlbmVycywgJ3VubG9hZCcpO1xuXHRcdM+ALmxpc3RlbihrZXlEb3duLCAna2V5ZG93bicpO1xuXHRcdM+ALmxpc3RlbihrZXlVcCwgJ2tleXVwJyk7XG5cdFx0z4AubGlzdGVuKHJlc2l6ZSwgJ3Jlc2l6ZScpO1xuXHRcdHJlc2l6ZSgpO1xuXG5cdFx0dmFyIGJvZHkgPSDPgDEoXCJib2R5XCIpO1xuXHRcdHZhciBzdGF0dXNTdHlsZSA9IM+ALmNvbnRlbnRFbGVtZW50KFwic3R5bGVcIik7XG5cdFx0c3RhdHVzU3R5bGUuaW5uZXJIVE1MICs9IFwiI8+AU3RhdHVzIHsgcG9zaXRpb246IGZpeGVkOyBib3R0b206IDEwcHg7IHJpZ2h0OiAxMHB4OyBiYWNrZ3JvdW5kLWNvbG9yOiAjMjIyOyBwYWRkaW5nOiAxMHB4IDMwcHg7IGNvbG9yOiB3aGl0ZTsgZGlzcGxheTogbm9uZSB9XFxuXCI7XG5cdFx0c3RhdHVzU3R5bGUuaW5uZXJIVE1MICs9IFwiI8+AU3RhdHVzLm9uIHsgZGlzcGxheTogYmxvY2sgfVxcblwiO1xuXHRcdHN0YXR1c1N0eWxlLmlubmVySFRNTCArPSBcIiPPgFN0YXR1cyA+IGRpdiB7IG1hcmdpbjogMjBweCAwIH1cXG5cIjtcblx0XHRzdGF0dXNTdHlsZS5pbm5lckhUTUwgKz0gXCIjz4BTdGF0dXMgPiBkaXY6aG92ZXIgeyBjb2xvcjogIzAwZmY5OTsgY3Vyc29yOiBwb2ludGVyIH1cXG5cIjtcblxuXHRcdGJvZHkuYWRkKHN0YXR1c1N0eWxlKTtcblxuXHRcdM+AU3RhdHVzID0gz4AuZGl2KG51bGwsIFwiz4BTdGF0dXNcIik7XG5cdFx0Ym9keS5hZGQoz4BTdGF0dXMpO1xuXG5cdFx0ZnVuY3Rpb24ga2V5RG93bihlKSB7XG5cdFx0XHRzd2l0Y2ggKGUud2hpY2gpIHtcblx0XHRcdFx0Y2FzZSAxODpcblx0XHRcdFx0XHRPUFRJT05fSVNfUFJFU1NFRCA9IHRydWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSAzNzpcblx0XHRcdFx0Y2FzZSAzODpcblx0XHRcdFx0Y2FzZSAzOTpcblx0XHRcdFx0Y2FzZSA0MDoge1xuXHRcdFx0XHRcdGlmIChTVEFUVVNfSVNfVklTSUJMRSkge1xuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0z4Auc3RhdHVzLm1vdmUoZS53aGljaCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y2FzZSA4MDoge1xuXHRcdFx0XHRcdGlmIChPUFRJT05fSVNfUFJFU1NFRCkge1xuXHRcdFx0XHRcdFx0z4Auc3RhdHVzLnRvZ2dsZVZpc2liaWxpdHkoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGtleVVwKGUpIHtcblx0XHRcdHN3aXRjaCAoZS53aGljaCkge1xuXHRcdFx0XHRjYXNlIDE4OlxuXHRcdFx0XHRcdE9QVElPTl9JU19QUkVTU0VEID0gZmFsc2U7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gcmVzaXplKCkge1xuXHRcdFx0z4Auc3RhdHVzLnByb3BzLndpblcgPSB3aW5kb3cuaW5uZXJXaWR0aDtcblx0XHRcdM+ALnN0YXR1cy5wcm9wcy53aW5IID0gd2luZG93LmlubmVySGVpZ2h0O1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNsZWFuRGVidWdMaXN0ZW5lcnMoKSB7XG5cdFx0XHTPgC5jbGVhbihjbGVhbkRlYnVnTGlzdGVuZXJzLCAndW5sb2FkJyk7XG5cdFx0XHTPgC5jbGVhbijPgC5zdGF0dXMuZ2V0V2luZG93U2l6ZSwgJ3Jlc2l6ZScpO1xuXHRcdFx0z4AuY2xlYW4oa2V5RG93biwgJ2tleWRvd24nKTtcblx0XHRcdM+ALmNsZWFuKGtleVVwLCAna2V5dXAnKTtcblx0XHRcdM+ALmNsZWFuKHJlc2l6ZSwgJ3Jlc2l6ZScpO1xuXHRcdFx0Y2xlYXJJbnRlcnZhbChzdGF0dXNJbnRlcnZhbCk7XG5cdFx0fVxuXG5cdFx0dmFyIHN0YXR1c0ludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcblx0XHRcdC8vIG1ha2Ugc3VyZSB3ZSdyZSBoaWdoZXN0XG5cdFx0XHR2YXIgaGlnaGVzdFogPSDPgC5oaWdoZXN0WigpO1xuXHRcdFx0aWYgKM+AU3RhdHVzLmNzcygpLnpJbmRleCA8IGhpZ2hlc3RaIC0gMSkge1xuXHRcdFx0XHTPgFN0YXR1cy5jc3Moe3pJbmRleDogaGlnaGVzdFp9KTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gbm93IGl0ZXJhdGUgdGhlIHByb3BzXG5cdFx0XHR2YXIgcHJvcHMgPSBPYmplY3Qua2V5cyjPgC5zdGF0dXMucHJvcHMpO1xuXHRcdFx0cHJvcHMuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG5cdFx0XHRcdHZhciBkaXZJZCA9ICdzdGF0dXNQcm9wXycgKyBwcm9wO1xuXHRcdFx0XHR2YXIgcHJvcERpdiA9IM+AU3RhdHVzLs+AMSgnIycgKyBkaXZJZCk7XG5cdFx0XHRcdGlmICghcHJvcERpdikge1xuXHRcdFx0XHRcdHByb3BEaXYgPSDPgC5kaXYoMCwgZGl2SWQsIHByb3AgKyAnOiAnKTtcblx0XHRcdFx0XHRwcm9wRGl2LmFkZCjPgC5zcGFuKCkpO1xuXHRcdFx0XHRcdM+AU3RhdHVzLmFkZChwcm9wRGl2KTtcblx0XHRcdFx0XHRwcm9wRGl2Lm9uY2xpY2sgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2cocHJvcCArIFwiOlwiKTtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKM+ALnN0YXR1cy5wcm9wc1twcm9wXSk7XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHByb3BEaXYuz4AxKCdzcGFuJykuaW5uZXJIVE1MID0gz4Auc3RhdHVzLnByb3BzW3Byb3BdO1xuXHRcdFx0fSk7XG5cdFx0fSwgMTAwKTtcblx0fVxuXG5cdM+ALm1vZHMucHVzaChpbml0KTtcbn0pKCk7IiwiIC8vbW9kYWwgY2xvc2UgYnV0dG9uXG4oZnVuY3Rpb24oKXtcblx0z4AubW9kYWxDbG9zZUJ1dHRvbiA9IGZ1bmN0aW9uKGNsb3NpbmdGdW5jdGlvbil7XG5cdFx0cmV0dXJuIM+ALmJ1dHRvbigncGktbW9kYWwtY2xvc2UtYnV0dG9uJywgbnVsbCwgbnVsbCwgY2xvc2luZ0Z1bmN0aW9uKTtcblx0fTtcbn0pKCk7XG4iLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiDPgC1wdXNobWVudS5qc1xuIC8vIFRPRE86ICBVU0FHRSBBTkQgQVBJIFJFRkVSRU5DRVxuIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cbiBERVBFTkRFTkNJRVM6XG5cbiBIQUwuanNcblxuIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cbiBEQVRBIEFUVFJJQlVURVM6XG5cbiBzaWRlOiBbXCJsZWZ0XCIsIFwicmlnaHRcIl1cbiBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXG4gTUFSS1VQIEFORCBERUZBVUxUUzpcblxuXHQ8ZGl2IGNsYXNzPVwicGktcHVzaG1lbnVcIiBpZD1cIm15UHVzaE1lbnVcIj5cblx0XHQgPHVsPlxuXHRcdFx0IDxsaT48YSBocmVmPVwiI1wiPmZvbzwvYT48L2xpPlxuXHRcdFx0IDxsaT48YSBocmVmPVwiI1wiPmJhcjwvYT48L2xpPlxuXHRcdFx0IDxsaT48YSBocmVmPVwiI1wiPmdyb25rPC9hPjwvbGk+XG5cdFx0XHQgPGxpPjxhIGhyZWY9XCIjXCI+ZmxlZWJsZXM8L2E+PC9saT5cblx0XHRcdCA8bGk+PGEgaHJlZj1cIiNcIj5zZXB1bHZlZGE8L2E+PC9saT5cblx0XHQgPC91bD5cblx0PC9kaXY+XG5cbmVsc2V3aGVyZS4uLlxuXG4gPGJ1dHRvbiBvbmNsaWNrPVwiz4AtcHVzaG1lbnUuc2hvdygnbXlQdXNoTWVudScpXCI+c2hvdyBtZW51PC9idXR0b24+XG5cbiBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXG4gR0VORVJBVEVEIEhUTUw6XG5cblx0XG4gX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xuIEFQSVxuXG5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbs+ALnB1c2htZW51ID0gKGZ1bmN0aW9uKCl7XG5cdHZhciBhbGxQdXNoTWVudXMgPSB7fTtcblxuXHRmdW5jdGlvbiBpbml0KCl7XG5cdFx0z4AoJ1tkYXRhLWF1dG8tYnVyZ2VyXScpLmZvckVhY2goZnVuY3Rpb24oY29udGFpbmVyKXtcblx0XHRcdHZhciBpZCA9IGNvbnRhaW5lci5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXV0by1idXJnZXInKTtcblxuXHRcdFx0dmFyIGF1dG9CdXJnZXIgPSDPgGQoaWQpIHx8IM+ALmRpdigncGktcHVzaG1lbnUnLCBpZCk7XG5cdFx0XHR2YXIgdWwgPSBhdXRvQnVyZ2VyLs+AMSgndWwnKSB8fCDPgC51bCgpO1xuXG5cdFx0XHRjb250YWluZXIuz4AoJ2FbaHJlZl0sIGJ1dHRvbicpLmZvckVhY2goZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0XHRpZiAoIWJvb2xlYW5BdHRyaWJ1dGVWYWx1ZShvYmosICdkYXRhLWF1dG8tYnVyZ2VyLWV4Y2x1ZGUnLCBmYWxzZSkpIHtcblx0XHRcdFx0XHR2YXIgY2xvbmUgPSBvYmouY2xvbmVOb2RlKHRydWUpO1xuXHRcdFx0XHRcdGNsb25lLmlkID0gJyc7XG5cblx0XHRcdFx0XHRpZiAoY2xvbmUudGFnTmFtZSA9PSBcIkJVVFRPTlwiKSB7XG5cdFx0XHRcdFx0XHR2YXIgYVRhZyA9IM+ALnNyY0VsZW1lbnQoJ2EnKTtcblx0XHRcdFx0XHRcdGFUYWcuaHJlZiA9ICcnO1xuXHRcdFx0XHRcdFx0YVRhZy5pbm5lckhUTUwgPSBjbG9uZS5pbm5lckhUTUw7XG5cdFx0XHRcdFx0XHRhVGFnLm9uY2xpY2sgPSBjbG9uZS5vbmNsaWNrO1xuXHRcdFx0XHRcdFx0Y2xvbmUgPSBhVGFnO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR1bC5hZGQoz4AubGkoMCwgMCwgY2xvbmUpKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdGF1dG9CdXJnZXIuYWRkKHVsKTtcblx0XHRcdM+AMSgnYm9keScpLmFkZChhdXRvQnVyZ2VyKTtcblx0XHR9KTtcblxuXHRcdM+AKFwiLnBpLXB1c2htZW51XCIpLmZvckVhY2goZnVuY3Rpb24oZWwpe1xuXHRcdFx0YWxsUHVzaE1lbnVzW2VsLmlkXSA9IFB1c2hNZW51KGVsKTtcblx0XHR9KTtcblxuXHRcdM+ALnNldFRyaWdnZXJzKCdwdXNobWVudScsIM+ALnB1c2htZW51KTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNob3cob2JqSWQpIHtcblx0XHRhbGxQdXNoTWVudXNbb2JqSWRdLmV4cG9zZSgpO1xuXHR9XG5cblx0Ly8gVE9ETzogZGlzbWlzcyBvbiBjbGljaz9cblx0Ly8gdGhpcyB3b3JrczpcblxuXHQvL8+AKCcucGktcHVzaG1lbnUgbGkgYScpLmZvckVhY2goZnVuY3Rpb24oYSl7XG5cdC8vXHRhLm9uY2xpY2sgPSBmdW5jdGlvbigpe1xuXHQvL1x0XHR0aGlzLnBhcmVudCgnLnBpLXB1c2htZW51Jykuz4AxKCcucGktbW9kYWwtY2xvc2UtYnV0dG9uJykuY2xpY2soKTtcblx0Ly9cdFx0Y29uc29sZS5sb2coXCJtZXNzYWdlXCIpO1xuXHQvL1x0fTtcblx0Ly99KTtcblxuXG5cdGZ1bmN0aW9uIFB1c2hNZW51KGVsKSB7XG5cdFx0dmFyIGh0bWwgPSDPgDEoJ2h0bWwnKTtcblx0XHR2YXIgYm9keSA9IM+AMSgnYm9keScpO1xuXG5cdFx0dmFyIG92ZXJsYXkgPSDPgC5kaXYoXCJvdmVybGF5XCIpO1xuXHRcdHZhciBjb250ZW50ID0gz4AuZGl2KCdjb250ZW50JywgbnVsbCwgZWwuz4AxKCcqJykpO1xuXG5cdFx0dmFyIHNpZGUgPSBlbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXNpZGVcIikgfHwgXCJyaWdodFwiO1xuXG5cdFx0dmFyIHNsZWQgPSDPgC5kaXYoXCJzbGVkXCIpO1xuXHRcdHNsZWQuY3NzKHNpZGUsIDApO1xuXG5cdFx0dmFyIHRvcEJhciA9IM+ALmRpdihcInRvcC1iYXJcIik7XG5cblx0XHR0b3BCYXIuZmlsbCjPgC5tb2RhbENsb3NlQnV0dG9uKGNsb3NlTWUpKTtcblx0XHRzbGVkLmZpbGwoW3RvcEJhciwgY29udGVudF0pO1xuXG5cdFx0b3ZlcmxheS5maWxsKHNsZWQpO1xuXHRcdGVsLmZpbGwob3ZlcmxheSk7XG5cblx0XHRzbGVkLm9uY2xpY2sgPSBmdW5jdGlvbihlKXtcblx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0fTtcblxuXHRcdG92ZXJsYXkub25jbGljayA9IGNsb3NlTWU7XG5cblx0XHTPgC5saXN0ZW4oY2xvc2VNZSwgJ3Jlc2l6ZScpO1xuXG5cdFx0ZnVuY3Rpb24gY2xvc2VNZShlKSB7XG5cdFx0XHR2YXIgdCA9IGUudGFyZ2V0O1xuXHRcdFx0aWYgKHQgPT0gc2xlZCB8fCB0ID09IHRvcEJhcikgcmV0dXJuO1xuXG5cdFx0XHRlbC5raWxsQ2xhc3MoXCJvblwiKTtcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0ZWwuY3NzKHtkaXNwbGF5OiBcIm5vbmVcIn0pO1xuXG5cdFx0XHRcdGJvZHkua2lsbENsYXNzKFwib3ZlcmxheS1vblwiKTtcblx0XHRcdH0sIDMwMCk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZXhwb3NlTWUoKXtcblx0XHRcdGJvZHkuYWRkQ2xhc3MoXCJvdmVybGF5LW9uXCIpOyAvLyBpbiB0aGUgZGVmYXVsdCBjb25maWcsIGtpbGxzIGJvZHkgc2Nyb2xsaW5nXG5cblx0XHRcdGVsLmNzcyh7XG5cdFx0XHRcdGRpc3BsYXk6IFwiYmxvY2tcIixcblx0XHRcdFx0ekluZGV4OiDPgC5oaWdoZXN0WigpXG5cdFx0XHR9KTtcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0ZWwuYWRkQ2xhc3MoXCJvblwiKTtcblx0XHRcdH0sIDEwKTtcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXhwb3NlOiBleHBvc2VNZVxuXHRcdH07XG5cdH1cblxuXHTPgC5tb2RzLnB1c2goaW5pdCk7XG5cblx0cmV0dXJuIHtcblx0XHRzaG93OiBzaG93XG5cdH07XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdHZhciB5YWggPSB0cnVlO1xuXHR2YXIgbW92aW5nID0gZmFsc2U7XG5cdHZhciBDU1NfQlJPV1NFUl9ERUxBWV9IQUNLID0gMjU7XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHTPgC5jbGVhbihpbml0KTtcblxuXHRcdC8vIFNhZmFyaSBjaG9rZXMgb24gdGhlIGFuaW1hdGlvbiBoZXJlLCBzby4uLlxuXHRcdGlmIChuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ0Nocm9tZScpID09IC0xICYmIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignU2FmYXJpJykgIT0gLTEpe1xuXHRcdFx0z4AxKCdib2R5JykuYWRkKM+ALmNvbnRlbnRFbGVtZW50KCdzdHlsZScsIDAsIDAsICcucGktYWNjb3JkaW9uIC53cmFwcGVye3RyYW5zaXRpb246IG5vbmV9JykpO1xuXHRcdH1cblx0XHQvLyBHcm9zcy5cblxuXHRcdM+AKCcucGktYWNjb3JkaW9uJykuZm9yRWFjaChmdW5jdGlvbihhY2NvcmRpb24pe1xuXHRcdFx0dmFyIGNvbnRhaW5lciA9IM+ALmRpdignY29udGFpbmVyJywgbnVsbCwgYWNjb3JkaW9uLmlubmVySFRNTCk7XG5cdFx0XHRhY2NvcmRpb24uZmlsbChjb250YWluZXIpO1xuXHRcdFx0UGlBY2NvcmRpb24oY29udGFpbmVyKTtcblx0XHR9KTtcblxuXHRcdHNldFlBSCgpO1xuXG5cdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHR5YWggPSBmYWxzZTtcblx0XHR9LCA1MDApO1xuXHR9XG5cblx0ZnVuY3Rpb24gUGlBY2NvcmRpb24oY29udGFpbmVyKXtcblx0XHRjb250YWluZXIuz4AoJzpzY29wZSA+IC5pdGVtJykuZm9yRWFjaChmdW5jdGlvbihpdGVtKXtcblx0XHRcdHZhciB0aXRsZVRleHQgPSBpdGVtLmRhdGFzZXQudGl0bGU7XG5cblx0XHRcdHZhciB0aXRsZSA9IM+ALmRpdigndGl0bGUnLCBudWxsLCB0aXRsZVRleHQpO1xuXHRcdFx0dmFyIHdyYXBwZXIgPSDPgC5kaXYoJ3dyYXBwZXInKTtcblx0XHRcdHZhciBjb250ZW50ID0gz4AuZGl2KCdjb250ZW50JywgbnVsbCwgaXRlbS5pbm5lckhUTUwpO1xuXG5cdFx0XHR3cmFwcGVyLmZpbGwoY29udGVudCk7XG5cdFx0XHRpdGVtLmZpbGwoW3RpdGxlLCB3cmFwcGVyXSk7XG5cdFx0XHR3cmFwcGVyLmNzcyh7aGVpZ2h0OiAwfSk7XG5cblx0XHRcdHRpdGxlLm9uY2xpY2sgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRpZiAoIXlhaCkge1xuXHRcdFx0XHRcdGlmIChtb3ZpbmcpIHJldHVybjtcblx0XHRcdFx0XHRtb3ZpbmcgPSB0cnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGNvbnRhaW5lci5kYXRhc2V0LnNpbmdsZSkge1xuXHRcdFx0XHRcdHZhciBvcGVuU2libGluZ3MgPSBpdGVtLnNpYmxpbmdzKCkuZmlsdGVyKGZ1bmN0aW9uKHNpYil7cmV0dXJuIHNpYi5oYXNDbGFzcygnb24nKTt9KTtcblx0XHRcdFx0XHRvcGVuU2libGluZ3MuZm9yRWFjaChmdW5jdGlvbihzaWJsaW5nKXtcblx0XHRcdFx0XHRcdHRvZ2dsZUl0ZW0oc2libGluZyk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0aWYgKGl0ZW0udGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnYScpIHtcblx0XHRcdFx0XHRcdG1vdmluZyA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0b2dnbGVJdGVtKGl0ZW0pO1xuXHRcdFx0XHR9LCBDU1NfQlJPV1NFUl9ERUxBWV9IQUNLKTtcblx0XHRcdH07XG5cblx0XHRcdGZ1bmN0aW9uIHRvZ2dsZUl0ZW0odGhpc0l0ZW0pe1xuXHRcdFx0XHR2YXIgdGhpc1dyYXBwZXIgPSB0aGlzSXRlbS7PgDEoJy53cmFwcGVyJyk7XG5cdFx0XHRcdHZhciBjb250ZW50SGVpZ2h0ID0gdGhpc1dyYXBwZXIuz4AxKCcuY29udGVudCcpLm9mZnNldCgpLmhlaWdodCArICdweCc7XG5cblx0XHRcdFx0aWYgKHRoaXNJdGVtLmhhc0NsYXNzKCdvbicpKSB7XG5cdFx0XHRcdFx0dGhpc1dyYXBwZXIuY3NzKHtoZWlnaHQ6IGNvbnRlbnRIZWlnaHR9KTtcblx0XHRcdFx0XHR0aGlzSXRlbS5raWxsQ2xhc3MoJ29uJyk7XG5cdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0dGhpc1dyYXBwZXIuY3NzKHtoZWlnaHQ6IDB9KTtcblx0XHRcdFx0XHRcdG1vdmluZyA9IGZhbHNlO1xuXHRcdFx0XHRcdH0sIENTU19CUk9XU0VSX0RFTEFZX0hBQ0spO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGl0ZW0uYWRkQ2xhc3MoJ29uJyk7XG5cdFx0XHRcdFx0dGhpc1dyYXBwZXIuY3NzKHtoZWlnaHQ6IGNvbnRlbnRIZWlnaHR9KTtcblxuXHRcdFx0XHRcdHZhciBkdXJhdGlvbiA9IHBhcnNlRmxvYXQodGhpc1dyYXBwZXIuY3NzKCkudHJhbnNpdGlvbkR1cmF0aW9uKSAqIDEwMDA7XG5cdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0dGhpc1dyYXBwZXIuY3NzKHtoZWlnaHQ6ICcnfSk7XG5cdFx0XHRcdFx0XHRtb3ZpbmcgPSBmYWxzZTtcblx0XHRcdFx0XHR9LCBkdXJhdGlvbik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0dmFyIGlubmVyQ29udGFpbmVycyA9IGNvbnRlbnQuz4AoJzpzY29wZSA+IC5jb250YWluZXInKTtcblx0XHRcdGlmIChpbm5lckNvbnRhaW5lcnMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRpbm5lckNvbnRhaW5lcnMuZm9yRWFjaChQaUFjY29yZGlvbik7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRZQUgoKSB7XG5cdFx0dmFyIHBhdGhuYW1lID0gbG9jYXRpb24uaHJlZjtcblx0XHR2YXIgY3VycmVudExpbmtzID0gW107XG5cblx0XHTPgCgnLnBpLWFjY29yZGlvbiBhJykuZm9yRWFjaChmdW5jdGlvbiAobGluaykge1xuXHRcdFx0aWYgKHBhdGhuYW1lID09PSBsaW5rLmhyZWYpIGN1cnJlbnRMaW5rcy5wdXNoKGxpbmspO1xuXHRcdH0pO1xuXG5cdFx0Y3VycmVudExpbmtzLmZvckVhY2goZnVuY3Rpb24gKHlhaExpbmspIHtcblx0XHRcdHlhaExpbmsucGFyZW50cygnLml0ZW0nKS5mb3JFYWNoKGZ1bmN0aW9uKHBhcmVudCl7XG5cdFx0XHRcdHBhcmVudC5hZGRDbGFzcygnb24nKTtcblx0XHRcdFx0cGFyZW50Ls+AMSgnLndyYXBwZXInKS5jc3Moe2hlaWdodDogJ2F1dG8nfSk7XG5cdFx0XHRcdHBhcmVudC7PgDEoJy5jb250ZW50JykuY3NzKHtvcGFjaXR5OiAxfSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0eWFoTGluay5hZGRDbGFzcygneWFoJyk7XG5cdFx0XHR5YWhMaW5rLm9uY2xpY2sgPSBmdW5jdGlvbihlKXtlLnByZXZlbnREZWZhdWx0KCk7fTtcblx0XHR9KTtcblx0fVxuXG5cdM+ALm1vZHMucHVzaChpbml0KTtcbn0pKCk7XG4iLCJ2YXIga3ViID0gKGZ1bmN0aW9uICgpIHtcblx0z4AubGlzdGVuKGluaXQpO1xuXG5cdHZhciBIRUFERVJfSEVJR0hUO1xuXHR2YXIgaHRtbCwgYm9keSwgbWFpbk5hdiwgcXVpY2tzdGFydEJ1dHRvbiwgd2lzaEZpZWxkO1xuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0z4AuY2xlYW4oaW5pdCk7XG5cblx0XHRodG1sID0gz4AxKCdodG1sJyk7XG5cdFx0Ym9keSA9IM+AMSgnYm9keScpO1xuXHRcdG1haW5OYXYgPSDPgGQoXCJtYWluTmF2XCIpO1xuXHRcdHdpc2hGaWVsZCA9IM+AZCgnd2lzaEZpZWxkJyk7XG5cdFx0SEVBREVSX0hFSUdIVCA9IM+AMSgnaGVhZGVyJykub2Zmc2V0KCkuaGVpZ2h0O1xuXG5cdFx0cXVpY2tzdGFydEJ1dHRvbiA9IM+AZCgncXVpY2tzdGFydEJ1dHRvbicpO1xuXG5cdFx0YWRqdXN0RXZlcnl0aGluZygpO1xuXG5cdFx0z4AubGlzdGVuKGFkanVzdEV2ZXJ5dGhpbmcsICdyZXNpemUnKTtcblx0XHTPgC5saXN0ZW4oYWRqdXN0RXZlcnl0aGluZywgJ3Njcm9sbCcpO1xuXHRcdM+ALmxpc3RlbihoYW5kbGVLZXlzdHJva2VzLCAna2V5ZG93bicpO1xuXHRcdHdpc2hGaWVsZC5saXN0ZW4oaGFuZGxlS2V5c3Ryb2tlcywgJ2tleWRvd24nKTtcblxuXHRcdGRvY3VtZW50Lm9udW5sb2FkID0gZnVuY3Rpb24oKXtcblx0XHRcdM+ALmNsZWFuKGFkanVzdEV2ZXJ5dGhpbmcsICdyZXNpemUnKTtcblx0XHRcdM+ALmNsZWFuKGFkanVzdEV2ZXJ5dGhpbmcsICdzY3JvbGwnKTtcblx0XHRcdM+ALmNsZWFuKGhhbmRsZUtleXN0cm9rZXMsICdrZXlkb3duJyk7XG5cdFx0XHR3aXNoRmllbGQuY2xlYW4oaGFuZGxlS2V5c3Ryb2tlcywgJ2tleWRvd24nKTtcblx0XHR9O1xuXG5cdFx0z4AubGlzdGVuKGNsb3NlT3Blbk1lbnUsICdyZXNpemUnKTtcblxuXHRcdGZ1bmN0aW9uIGNsb3NlT3Blbk1lbnUoKSB7XG5cdFx0XHRpZiAoaHRtbC5oYXNDbGFzcygnb3Blbi1uYXYnKSkgdG9nZ2xlTWVudSgpO1xuXHRcdH1cblxuXHRcdM+AKCcuZHJvcGRvd24nKS5mb3JFYWNoKGZ1bmN0aW9uKGRyb3Bkb3duKSB7XG5cdFx0XHR2YXIgcmVhZG91dCA9IGRyb3Bkb3duLs+AMSgnLnJlYWRvdXQnKTtcblx0XHRcdHJlYWRvdXQuaW5uZXJIVE1MID0gZHJvcGRvd24uz4AxKCdhJykuaW5uZXJIVE1MO1xuXHRcdFx0cmVhZG91dC5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRkcm9wZG93bi50b2dnbGVDbGFzcygnb24nKTtcblx0XHRcdFx0z4AubGlzdGVuKGNsb3NlT3BlbkRyb3Bkb3duLCAnY2xpY2snKTtcblxuXHRcdFx0XHRmdW5jdGlvbiBjbG9zZU9wZW5Ecm9wZG93bihlKSB7XG5cdFx0XHRcdFx0aWYgKGRyb3Bkb3duLmhhc0NsYXNzKCdvbicpICYmICEoZHJvcGRvd25XYXNDbGlja2VkKGUpKSkge1xuXHRcdFx0XHRcdFx0z4AuY2xlYW4oY2xvc2VPcGVuRHJvcGRvd24sICdjbGljaycpO1xuXHRcdFx0XHRcdFx0ZHJvcGRvd24ua2lsbENsYXNzKCdvbicpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZ1bmN0aW9uIGRyb3Bkb3duV2FzQ2xpY2tlZChlKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGUudGFyZ2V0LmlzSGVpck9mQ2xhc3MoJ2Ryb3Bkb3duJyk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fSk7XG5cblx0XHRzZXRJbnRlcnZhbChzZXRGb290ZXJUeXBlLCAxMCk7XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRGb290ZXJUeXBlKCkge1xuXHRcdGlmIChodG1sLmlkID09IFwiZG9jc1wiKSB7XG5cdFx0XHR2YXIgYm9keUhlaWdodCA9IM+AZCgnaGVybycpLm9mZnNldCgpLmhlaWdodCArIM+AZCgnZW5jeWNsb3BlZGlhJykub2Zmc2V0KCkuaGVpZ2h0O1xuXHRcdFx0dmFyIGZvb3RlciA9IM+AMSgnZm9vdGVyJyk7XG5cdFx0XHR2YXIgZm9vdGVySGVpZ2h0ID0gZm9vdGVyLm9mZnNldCgpLmhlaWdodDtcblx0XHRcdGJvZHkuY2xhc3NPbkNvbmRpdGlvbignZml4ZWQnLCB3aW5kb3cuaW5uZXJIZWlnaHQgLSBmb290ZXJIZWlnaHQgPiBib2R5SGVpZ2h0KTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBhZGp1c3RFdmVyeXRoaW5nKCkge1xuXHRcdGlmICghaHRtbC5oYXNDbGFzcygnb3Blbi1uYXYnKSkgSEVBREVSX0hFSUdIVCA9IM+AMSgnaGVhZGVyJykub2Zmc2V0KCkuaGVpZ2h0O1xuXHRcdGh0bWwuY2xhc3NPbkNvbmRpdGlvbignZmxpcC1uYXYnLCB3aW5kb3cucGFnZVlPZmZzZXQgPiAwKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHRvZ2dsZU1lbnUoKSB7XG5cdFx0aWYgKHdpbmRvdy5pbm5lcldpZHRoIDwgODAwKSB7XG5cdFx0XHTPgC5wdXNobWVudS5zaG93KCdwcmltYXJ5Jyk7XG5cdFx0fVxuXG5cdFx0ZWxzZSB7XG5cdFx0XHR2YXIgbmV3SGVpZ2h0ID0gSEVBREVSX0hFSUdIVDtcblxuXHRcdFx0aWYgKCFodG1sLmhhc0NsYXNzKCdvcGVuLW5hdicpKSB7XG5cdFx0XHRcdG5ld0hlaWdodCA9IG1haW5OYXYub2Zmc2V0KCkuaGVpZ2h0O1xuXHRcdFx0fVxuXG5cdFx0XHTPgDEoJ2hlYWRlcicpLmNzcyh7aGVpZ2h0OiBweChuZXdIZWlnaHQpfSk7XG5cdFx0XHRodG1sLnRvZ2dsZUNsYXNzKCdvcGVuLW5hdicpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHN1Ym1pdFdpc2godGV4dGZpZWxkKSB7XG5cdFx0d2luZG93LmxvY2F0aW9uLnJlcGxhY2UoXCJodHRwczovL2dpdGh1Yi5jb20va3ViZXJuZXRlcy9rdWJlcm5ldGVzLmdpdGh1Yi5pby9pc3N1ZXMvbmV3P3RpdGxlPUklMjB3aXNoJTIwXCIgK1xuXHRcdFx0d2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgXCIlMjBcIiArIHRleHRmaWVsZC52YWx1ZSArIFwiJmJvZHk9SSUyMHdpc2glMjBcIiArXG5cdFx0XHR3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyBcIiUyMFwiICsgdGV4dGZpZWxkLnZhbHVlKTtcblxuXHRcdHRleHRmaWVsZC52YWx1ZSA9ICcnO1xuXHRcdHRleHRmaWVsZC5ibHVyKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBoYW5kbGVLZXlzdHJva2VzKGUpIHtcblx0XHRzd2l0Y2ggKGUud2hpY2gpIHtcblx0XHRcdGNhc2UgMTM6IHtcblx0XHRcdFx0aWYgKGUuY3VycmVudFRhcmdldCA9PT0gd2lzaEZpZWxkKSB7XG5cdFx0XHRcdFx0c3VibWl0V2lzaCh3aXNoRmllbGQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHRjYXNlIDI3OiB7XG5cdFx0XHRcdGlmIChodG1sLmhhc0NsYXNzKCdvcGVuLW5hdicpKSB7XG5cdFx0XHRcdFx0dG9nZ2xlTWVudSgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB7XG5cdFx0dG9nZ2xlTWVudTogdG9nZ2xlTWVudVxuXHR9O1xufSkoKTtcblxuXG4vLyBUT0RPOiBzY3JvbGxpbnRvdmlldyBpbi1wYWdlIFRPQyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
