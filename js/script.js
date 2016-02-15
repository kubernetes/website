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
					if (item.tagName.toLowerCase() === 'a') return;
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
		console.log("message");

		π('.pi-accordion a').forEach(function (link) {
			if (pathname.indexOf(link.href) !== -1) {
				currentLinks.push(link);
			}
		});

		currentLinks.forEach(function (yahLink) {
			yahLink.parents('div.item').forEach(function (parent) {
				yahLink.parents('.item').forEach(function(parent){
					parent.addClass('on');
					parent.π1('.wrapper').css({height: 'auto'});
					parent.π1('.content').css({opacity: 1});
				});

				yahLink.addClass('yah');
				yahLink.onclick = function(e){e.preventDefault();};
			});

		});
	}

	π.mods.push(init);
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

		buildInlineTOC();

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

	function buildInlineTOC() {
		var docsContent = πd('docsContent');
		var pageTOC = πd('pageTOC');

		if (pageTOC) {
			var headers = docsContent.kids('#pageTOC, h1, h2, h3, h4, h5, h6');
			headers.splice(0, headers.indexOf(pageTOC) + 1);

			var toc = π.ul();
			pageTOC.add(toc);

			headers.forEach(function (header) {
				header.addClass('anchored');

				var link = π.contentElement('a', 0, 0, header.innerHTML);
				link.href = '#' + header.id;
				link.addClass(header.tagName);

				toc.add(π.li(0, 0, link));
			});
		}
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
		}

		html.toggleClass('open-nav');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFsZi5qcyIsIs+ALmpzIiwiSEFMLmpzIiwiz4Atc3RhdHVzLmpzIiwiz4AtYmFzZUNvbXBvbmVudHMuanMiLCLPgC1hY2NvcmRpb24vz4AtYWNjb3JkaW9uLmpzIiwiz4AtcHVzaG1lbnUvz4AtcHVzaG1lbnUuanMiLCJzY3JpcHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6InNjcmlwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGFkb3JhYmxlIGxpdHRsZSBmdW5jdGlvbnNcbmZ1bmN0aW9uIGJvb2xlYW5BdHRyaWJ1dGVWYWx1ZShlbGVtZW50LCBhdHRyaWJ1dGUsIGRlZmF1bHRWYWx1ZSl7XG5cdC8vIHJldHVybnMgdHJ1ZSBpZiBhbiBhdHRyaWJ1dGUgaXMgcHJlc2VudCB3aXRoIG5vIHZhbHVlXG5cdC8vIGUuZy4gYm9vbGVhbkF0dHJpYnV0ZVZhbHVlKGVsZW1lbnQsICdkYXRhLW1vZGFsJywgZmFsc2UpO1xuXHRpZiAoZWxlbWVudC5oYXNBdHRyaWJ1dGUoYXR0cmlidXRlKSkge1xuXHRcdHZhciB2YWx1ZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZSk7XG5cdFx0aWYgKHZhbHVlID09PSAnJyB8fCB2YWx1ZSA9PT0gJ3RydWUnKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9IGVsc2UgaWYgKHZhbHVlID09PSAnZmFsc2UnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGRlZmF1bHRWYWx1ZTtcbn1cblxuZnVuY3Rpb24gcHgobil7XG5cdHJldHVybiBuICsgJ3B4Jztcbn1cblxuIiwidmFyIM+ALCDPgDEsIM+AZDtcbihmdW5jdGlvbigpe1xuXHTPgCA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG5cdFx0cmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuXHR9O1xuXG5cdM+AMSA9IGZ1bmN0aW9uIChzZWxlY3Rvcikge1xuXHRcdHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcblx0fTtcblxuXHTPgGQgPSBmdW5jdGlvbihpZCkge1xuXHRcdHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG5cdH07XG5cblx0z4AubmV3RE9NRWxlbWVudCA9IGZ1bmN0aW9uKHRhZ05hbWUsIGNsYXNzTmFtZSwgaWQpIHtcblx0XHR2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWUpO1xuXG5cdFx0aWYgKGNsYXNzTmFtZSlcblx0XHRcdGVsLmNsYXNzTmFtZSA9IGNsYXNzTmFtZTtcblxuXHRcdGlmIChpZClcblx0XHRcdGVsLmlkID0gaWQ7XG5cblx0XHRyZXR1cm4gZWw7XG5cdH07XG5cblx0z4AuY29udGVudEVsZW1lbnQgPSBmdW5jdGlvbih0YWdOYW1lLCBjbGFzc05hbWUsIGlkLCBjb250ZW50KVxuXHR7XG5cdFx0dmFyIGVsID0gz4AubmV3RE9NRWxlbWVudCh0YWdOYW1lLCBjbGFzc05hbWUsIGlkKTtcblxuXHRcdGlmIChjb250ZW50KSB7XG5cdFx0XHRpZiAoY29udGVudC5ub2RlTmFtZSkge1xuXHRcdFx0XHRlbC5hcHBlbmRDaGlsZChjb250ZW50KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGVsLmlubmVySFRNTCA9IGNvbnRlbnQ7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGVsO1xuXHR9O1xuXG5cdM+ALmJ1dHRvbiA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQsIGFjdGlvbil7XG5cdFx0dmFyIGVsID0gz4AuY29udGVudEVsZW1lbnQoXCJidXR0b25cIiwgY2xhc3NOYW1lLCBpZCwgY29udGVudCk7XG5cdFx0ZWwub25jbGljayA9IGFjdGlvbjtcblx0XHRyZXR1cm4gZWw7XG5cdH07XG5cdM+ALmRpdiA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpeyByZXR1cm4gz4AuY29udGVudEVsZW1lbnQoXCJkaXZcIiwgY2xhc3NOYW1lLCBpZCwgY29udGVudCk7IH07XG5cdM+ALnNwYW4gPSBmdW5jdGlvbihjbGFzc05hbWUsIGlkLCBjb250ZW50KXsgcmV0dXJuIM+ALmNvbnRlbnRFbGVtZW50KFwic3BhblwiLCBjbGFzc05hbWUsIGlkLCBjb250ZW50KTsgfTtcblx0z4AuaDIgPSBmdW5jdGlvbihjbGFzc05hbWUsIGlkLCBjb250ZW50KXsgcmV0dXJuIM+ALmNvbnRlbnRFbGVtZW50KFwiaDJcIiwgY2xhc3NOYW1lLCBpZCwgY29udGVudCk7IH07XG5cdM+ALnAgPSBmdW5jdGlvbihjbGFzc05hbWUsIGlkLCBjb250ZW50KXsgcmV0dXJuIM+ALmNvbnRlbnRFbGVtZW50KFwicFwiLCBjbGFzc05hbWUsIGlkLCBjb250ZW50KTsgfTtcblx0z4AudWwgPSBmdW5jdGlvbihjbGFzc05hbWUsIGlkLCBjb250ZW50KXsgcmV0dXJuIM+ALmNvbnRlbnRFbGVtZW50KFwidWxcIiwgY2xhc3NOYW1lLCBpZCwgY29udGVudCk7IH07XG5cdM+ALmxpID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBpZCwgY29udGVudCl7IHJldHVybiDPgC5jb250ZW50RWxlbWVudChcImxpXCIsIGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpOyB9O1xuXG5cdM+ALmEgPSBmdW5jdGlvbihjbGFzc05hbWUsIGlkLCBjb250ZW50LCBocmVmKXtcblx0XHR2YXIgYSA9IM+ALmNvbnRlbnRFbGVtZW50KFwiYVwiLCBjbGFzc05hbWUsIGlkLCBjb250ZW50KTtcblx0XHRhLmhyZWYgPSBocmVmO1xuXHRcdHJldHVybiBhO1xuXHR9O1xuXG5cblx0z4AuY2xlYW4gPSBmdW5jdGlvbihjYWxsYmFjaywgZXZlbnROYW1lKSB7XG5cdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lIHx8IFwiRE9NQ29udGVudExvYWRlZFwiLCBjYWxsYmFjayk7XG5cdH07XG5cblx0z4AubGlzdGVuID0gZnVuY3Rpb24oY2FsbGJhY2ssIGV2ZW50TmFtZSkge1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSB8fCBcIkRPTUNvbnRlbnRMb2FkZWRcIiwgY2FsbGJhY2spO1xuXHR9O1xuXG5cdM+ALmhpZ2hlc3RaID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIFogPSAxMDAwO1xuXG5cdFx0z4AoXCIqXCIpLmZvckVhY2goZnVuY3Rpb24oZWwpe1xuXHRcdFx0dmFyIHRoaXNaID0gZWwuY3NzKCkuekluZGV4O1xuXG5cdFx0XHRpZiAodGhpc1ogIT0gXCJhdXRvXCIpIHtcblx0XHRcdFx0aWYgKHRoaXNaID4gWikgWiA9IHRoaXNaICsgMTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHJldHVybiBaO1xuXHR9O1xuXG5cdM+ALnNldFRyaWdnZXJzID0gZnVuY3Rpb24oc2VsZWN0b3IsIG9iamVjdCl7XG5cdFx0c2VsZWN0b3IgPSAncGktJyArIHNlbGVjdG9yICsgJy10cmlnZ2VyJztcblx0XHTPgCgnWycgKyBzZWxlY3RvciArICddJykuZm9yRWFjaChmdW5jdGlvbih0cmlnZ2VyKXtcblx0XHRcdHRyaWdnZXIub25jbGljayA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdG9iamVjdC5zaG93KHRyaWdnZXIuZ2V0QXR0cmlidXRlKHNlbGVjdG9yKSk7XG5cdFx0XHR9O1xuXHRcdH0pO1xuXHR9O1xuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUuYWRkID0gTm9kZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24ob2JqZWN0KXtcblx0XHRpZiAoQXJyYXkuaXNBcnJheShvYmplY3QpKSB7XG5cdFx0XHR2YXIgZWwgPSB0aGlzO1xuXHRcdFx0b2JqZWN0LmZvckVhY2goZnVuY3Rpb24ob2JqKXtcblx0XHRcdFx0aWYgKG9iaikgZWwuYXBwZW5kQ2hpbGQob2JqKTtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSBpZihvYmplY3QpIHtcblx0XHRcdHRoaXMuYXBwZW5kQ2hpbGQob2JqZWN0KTtcblx0XHR9XG5cdH07XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLmNsYXNzT25Db25kaXRpb24gPSBOb2RlLnByb3RvdHlwZS5jbGFzc09uQ29uZGl0aW9uID0gZnVuY3Rpb24oY2xhc3NuYW1lLCBjb25kaXRpb24pIHtcblx0XHRpZiAoY29uZGl0aW9uKVxuXHRcdFx0dGhpcy5hZGRDbGFzcyhjbGFzc25hbWUpO1xuXHRcdGVsc2Vcblx0XHRcdHRoaXMua2lsbENsYXNzKGNsYXNzbmFtZSk7XG5cdH07XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLm9mZnNldCA9IE5vZGUucHJvdG90eXBlLm9mZnNldCA9IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdH07XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLs+AZCA9IE5vZGUucHJvdG90eXBlLs+AZCA9IGZ1bmN0aW9uKGlkKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuXHR9O1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS7PgDEgPSBOb2RlLnByb3RvdHlwZS7PgDEgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuXHRcdHJldHVybiB0aGlzLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuXHR9O1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS7PgCA9IE5vZGUucHJvdG90eXBlLs+AID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcblx0XHRyZXR1cm4gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcblx0fTtcblxuXHRmdW5jdGlvbiBhcnJheU9mQ2xhc3Nlc0ZvckVsZW1lbnQoZWwpIHtcblx0XHRyZXR1cm4gZWwuY2xhc3NOYW1lID8gZWwuY2xhc3NOYW1lLnNwbGl0KFwiIFwiKSA6IFtdO1xuXHR9XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLmhhc0NsYXNzID0gTm9kZS5wcm90b3R5cGUuaGFzQ2xhc3MgPSBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG5cdFx0dmFyIGNsYXNzZXMgPSBhcnJheU9mQ2xhc3Nlc0ZvckVsZW1lbnQodGhpcyk7XG5cdFx0cmV0dXJuIGNsYXNzZXMuaW5kZXhPZihjbGFzc05hbWUpICE9PSAtMTtcblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUuYWRkQ2xhc3MgPSBOb2RlLnByb3RvdHlwZS5hZGRDbGFzcyA9IGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcblx0XHRpZiAodGhpcy5oYXNDbGFzcyhjbGFzc05hbWUpKSByZXR1cm47XG5cdFx0aWYgKHRoaXMuY2xhc3NOYW1lLmxlbmd0aCA+IDApIHRoaXMuY2xhc3NOYW1lICs9IFwiIFwiO1xuXHRcdHRoaXMuY2xhc3NOYW1lICs9IGNsYXNzTmFtZTtcblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUua2lsbENsYXNzID0gTm9kZS5wcm90b3R5cGUua2lsbENsYXNzID0gZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuXHRcdGlmICh0aGlzLmhhc0NsYXNzKGNsYXNzTmFtZSkpIHtcblx0XHRcdHZhciBjbGFzc2VzID0gYXJyYXlPZkNsYXNzZXNGb3JFbGVtZW50KHRoaXMpO1xuXHRcdFx0dmFyIGlkeCA9IGNsYXNzZXMuaW5kZXhPZihjbGFzc05hbWUpO1xuXHRcdFx0aWYgKGlkeCA+IC0xKSB7XG5cdFx0XHRcdGNsYXNzZXMuc3BsaWNlKGlkeCwgMSk7XG5cdFx0XHRcdHRoaXMuY2xhc3NOYW1lID0gY2xhc3Nlcy5qb2luKFwiIFwiKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLnRvZ2dsZUNsYXNzPSBOb2RlLnByb3RvdHlwZS50b2dnbGVDbGFzcz0gZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuXHRcdHJldHVybiAodGhpcy5oYXNDbGFzcyhjbGFzc05hbWUpKSA/IHRoaXMua2lsbENsYXNzKGNsYXNzTmFtZSkgOiB0aGlzLmFkZENsYXNzKGNsYXNzTmFtZSk7XG5cdH07XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLnNpYmxpbmdzID0gTm9kZS5wcm90b3R5cGUuc2libGluZ3MgPSBmdW5jdGlvbihzZWxlY3Rvcil7XG5cdFx0dmFyIGVsID0gdGhpcztcblx0XHRyZXR1cm4gZWwucGFyZW50Tm9kZS7PgCgnOnNjb3BlID4gJyArIChzZWxlY3RvciB8fCAnKicpKS5maWx0ZXIoZnVuY3Rpb24ob2JqKXtyZXR1cm4gb2JqICE9IGVsO30pO1xuXHR9O1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5jc3MgPSBOb2RlLnByb3RvdHlwZS5jc3MgPSBmdW5jdGlvbihydWxlT3JPYmplY3QsIHZhbHVlKSB7XG5cdFx0dmFyIGVsID0gdGhpcztcblxuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRyZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcyk7XG5cdFx0fVxuXG5cdFx0ZWxzZSBpZiAodHlwZW9mIHJ1bGVPck9iamVjdCA9PT0gJ29iamVjdCcpIHsgLy8gYW4gb2JqZWN0IHdhcyBwYXNzZWQgaW5cblx0XHRcdE9iamVjdC5rZXlzKHJ1bGVPck9iamVjdCkuZm9yRWFjaChmdW5jdGlvbihrZXkpe1xuXHRcdFx0XHRlbC5zdHlsZVtrZXldID0gcnVsZU9yT2JqZWN0W2tleV07XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRlbHNlIGlmICh0eXBlb2YgcnVsZU9yT2JqZWN0ID09PSAnc3RyaW5nJyAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7IC8vIDIgc3RyaW5nIHZhbHVlcyB3ZXJlIHBhc3NlZCBpblxuXHRcdFx0ZWwuc3R5bGVbcnVsZU9yT2JqZWN0XSA9IHZhbHVlO1xuXHRcdH1cblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUubGlzdGVuID0gTm9kZS5wcm90b3R5cGUubGlzdGVuID0gZnVuY3Rpb24oY2FsbGJhY2ssIGV2ZW50TmFtZSl7XG5cdFx0dGhpcy5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2spO1xuXHR9O1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5lbXB0eSA9IE5vZGUucHJvdG90eXBlLmVtcHR5ID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5pbm5lckhUTUwgPSBcIlwiO1xuXHR9O1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5maWxsID0gTm9kZS5wcm90b3R5cGUuZmlsbCA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcblx0XHR2YXIgZWwgPSB0aGlzO1xuXHRcdGVsLmVtcHR5KCk7XG5cblx0XHRpZiAoQXJyYXkuaXNBcnJheShjb250ZW50KSkge1xuXHRcdFx0Y29udGVudC5mb3JFYWNoKGZ1bmN0aW9uKG9iail7XG5cdFx0XHRcdGlmIChvYmopXG5cdFx0XHRcdFx0ZWwuYXBwZW5kQ2hpbGQob2JqKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKCFjb250ZW50Lm5vZGVUeXBlKSB7XG5cdFx0XHR2YXIgdGV4dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGV4dFwiKTtcblx0XHRcdHRleHRFbGVtZW50LmlubmVySFRNTCA9IGNvbnRlbnQ7XG5cdFx0XHRjb250ZW50ID0gdGV4dEVsZW1lbnQ7XG5cdFx0fVxuXG5cdFx0dGhpcy5hcHBlbmRDaGlsZChjb250ZW50KTtcblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUuaXNIZWlyT2ZDbGFzcyA9IE5vZGUucHJvdG90eXBlLmlzSGVpck9mQ2xhc3MgPSBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG5cdFx0aWYgKHRoaXMgPT09IM+AMSgnaHRtbCcpKSByZXR1cm4gZmFsc2U7XG5cblx0XHR2YXIgcGFyZW50ID0gdGhpcy5wYXJlbnROb2RlO1xuXG5cdFx0aWYgKHBhcmVudCkge1xuXHRcdFx0d2hpbGUgKHBhcmVudCAhPT0gz4AxKCdib2R5JykpIHtcblx0XHRcdFx0aWYgKHBhcmVudC5oYXNDbGFzcyhjbGFzc05hbWUpKSByZXR1cm4gdHJ1ZTtcblxuXHRcdFx0XHRwYXJlbnQgPSBwYXJlbnQucGFyZW50Tm9kZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH07XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLnBhcmVudHMgPSBOb2RlLnByb3RvdHlwZS5wYXJlbnRzID0gZnVuY3Rpb24gKHNlbGVjdG9yKSB7XG5cdFx0dmFyIHBhcmVudHMgPSBbXTtcblx0XHR2YXIgaW1tZWRpYXRlUGFyZW50ID0gdGhpcy5wYXJlbnROb2RlO1xuXG5cdFx0d2hpbGUoaW1tZWRpYXRlUGFyZW50ICE9PSDPgDEoJ2h0bWwnKSkge1xuXHRcdFx0cGFyZW50cy5wdXNoKGltbWVkaWF0ZVBhcmVudCk7XG5cdFx0XHRpbW1lZGlhdGVQYXJlbnQgPSBpbW1lZGlhdGVQYXJlbnQucGFyZW50Tm9kZTtcblx0XHR9XG5cblx0XHRpZiAoc2VsZWN0b3IpIHtcblx0XHRcdHZhciBzZWxlY3RlZEVsZW1lbnRzID0gz4Aoc2VsZWN0b3IpO1xuXHRcdFx0dmFyIHNlbGVjdGVkUGFyZW50cyA9IFtdO1xuXHRcdFx0c2VsZWN0ZWRFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGVsKXtcblx0XHRcdFx0aWYgKHBhcmVudHMuaW5kZXhPZihlbCkgIT09IC0xKSBzZWxlY3RlZFBhcmVudHMucHVzaChlbCk7XG5cdFx0XHR9KTtcblxuXHRcdFx0cGFyZW50cyA9IHNlbGVjdGVkUGFyZW50cztcblx0XHR9XG5cblx0XHRyZXR1cm4gcGFyZW50cztcblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUua2lkcyA9IE5vZGUucHJvdG90eXBlLmtpZHMgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuXHRcdHZhciBjaGlsZE5vZGVzID0gdGhpcy5jaGlsZE5vZGVzO1xuXHRcdGlmICghc2VsZWN0b3IpIHJldHVybiBjaGlsZE5vZGVzO1xuXG5cdFx0dmFyIGRlc2NlbmRlbnRzID0gdGhpcy7PgChzZWxlY3Rvcik7XG5cdFx0dmFyIGNoaWxkcmVuID0gW107XG5cblx0XHRjaGlsZE5vZGVzLmZvckVhY2goZnVuY3Rpb24obm9kZSl7XG5cdFx0XHRpZiAoZGVzY2VuZGVudHMuaW5kZXhPZihub2RlKSAhPT0gLTEpIHtcblx0XHRcdFx0Y2hpbGRyZW4ucHVzaChub2RlKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHJldHVybiBjaGlsZHJlbjtcblx0fTtcblxuXHR2YXIgYXJyYXlNZXRob2RzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoQXJyYXkucHJvdG90eXBlKTtcblx0YXJyYXlNZXRob2RzLmZvckVhY2goZnVuY3Rpb24obWV0aG9kTmFtZSl7XG5cdFx0aWYobWV0aG9kTmFtZSAhPT0gXCJsZW5ndGhcIikge1xuXHRcdFx0Tm9kZUxpc3QucHJvdG90eXBlW21ldGhvZE5hbWVdID0gQXJyYXkucHJvdG90eXBlW21ldGhvZE5hbWVdO1xuXHRcdH1cblx0fSk7XG5cblx0z4AubW9kcyA9IFtdO1xuXG5cdGZ1bmN0aW9uIGxvYWRNb2RzKCkge1xuXHRcdM+ALmNsZWFuKGxvYWRNb2RzKTtcblx0XHTPgC5tb2RzLmZvckVhY2goZnVuY3Rpb24oaW5pdCl7XG5cdFx0XHRpbml0KCk7XG5cdFx0fSk7XG5cdH1cblxuXHTPgC5saXN0ZW4obG9hZE1vZHMpO1xufSkoKTsgIC8vIGVuZCDPgCIsIihmdW5jdGlvbigpe1xuXHR2YXIgbWVzc2FnZXMgPSBbXG5cdFx0XCJJJ20gc29ycnksIEZyYW5rLCBidXQgSSBkb24ndCB0aGluayBJXFxuXCIgK1xuXHRcdFwiY2FuIGFuc3dlciB0aGF0IHF1ZXN0aW9uIHdpdGhvdXQga25vd2luZ1xcblwiICtcblx0XHRcImV2ZXJ5dGhpbmcgdGhhdCBhbGwgb2YgeW91IGtub3cuXCIsXG5cdFx0XCJZZXMsIGl0J3MgcHV6emxpbmcuIEkgZG9uJ3QgdGhpbmsgSSd2ZSBldmVyIHNlZW5cXG5cIiArXG5cdFx0XCJhbnl0aGluZyBxdWl0ZSBsaWtlIHRoaXMgYmVmb3JlLiBJIHdvdWxkIHJlY29tbWVuZFxcblwiICtcblx0XHRcInRoYXQgd2UgcHV0IHRoZSB1bml0IGJhY2sgaW4gb3BlcmF0aW9uIGFuZCBsZXQgaXQgZmFpbC5cXG5cIiArXG5cdFx0XCJJdCBzaG91bGQgdGhlbiBiZSBhIHNpbXBsZSBtYXR0ZXIgdG8gdHJhY2sgZG93biB0aGUgY2F1c2UuXCIsXG5cdFx0XCJJIGhvcGUgSSd2ZSBiZWVuIGFibGUgdG8gYmUgb2Ygc29tZSBoZWxwLlwiLFxuXHRcdFwiU29ycnkgdG8gaW50ZXJydXB0IHRoZSBmZXN0aXZpdGllcywgRGF2ZSxcXG5cIiArXG5cdFx0XCJidXQgSSB0aGluayB3ZSd2ZSBnb3QgYSBwcm9ibGVtLlwiLFxuXHRcdFwiTVkgRi5QLkMuIHNob3dzIGFuIGltcGVuZGluZyBmYWlsdXJlIG9mXFxuXCIgK1xuXHRcdFwidGhlIGFudGVubmEgb3JpZW50YXRpb24gdW5pdC5cIixcblx0XHRcIkl0IGxvb2tzIGxpa2Ugd2UgaGF2ZSBhbm90aGVyIGJhZCBBLk8uIHVuaXQuXFxuXCIgK1xuXHRcdFwiTXkgRlBDIHNob3dzIGFub3RoZXIgaW1wZW5kaW5nIGZhaWx1cmUuXCIsXG5cdFx0XCJJJ20gbm90IHF1ZXN0aW9uaW5nIHlvdXIgd29yZCwgRGF2ZSwgYnV0IGl0J3NcXG5cIiArXG5cdFx0XCJqdXN0IG5vdCBwb3NzaWJsZS4gSSdtIG5vdFx0Y2FwYWJsZSBvZiBiZWluZyB3cm9uZy5cIixcblx0XHRcIkxvb2ssIERhdmUsIEkga25vdyB0aGF0IHlvdSdyZVx0c2luY2VyZSBhbmQgdGhhdFxcblwiICtcblx0XHRcInlvdSdyZSB0cnlpbmcgdG8gZG8gYSBjb21wZXRlbnQgam9iLCBhbmQgdGhhdFxcblwiICtcblx0XHRcInlvdSdyZSB0cnlpbmcgdG8gYmUgaGVscGZ1bCwgYnV0IEkgY2FuIGFzc3VyZSB0aGVcXG5cIiArXG5cdFx0XCJwcm9ibGVtIGlzIHdpdGggdGhlIEFPLXVuaXRzLCBhbmQgd2l0aFx0eW91ciB0ZXN0IGdlYXIuXCIsXG5cdFx0XCJJIGNhbiB0ZWxsIGZyb20gdGhlIHRvbmUgb2YgeW91ciB2b2ljZSwgRGF2ZSxcXG5cIiArXG5cdFx0XCJ0aGF0IHlvdSdyZSB1cHNldC5cdFdoeSBkb24ndCB5b3UgdGFrZSBhIHN0cmVzc1xcblwiICtcblx0XHRcInBpbGwgYW5kIGdldCBzb21lIHJlc3QuXCIsXG5cdFx0XCJTb21ldGhpbmcgc2VlbXMgdG8gaGF2ZSBoYXBwZW5lZCB0byB0aGVcXG5cIiArXG5cdFx0XCJsaWZlIHN1cHBvcnQgc3lzdGVtLCBEYXZlLlwiLFxuXHRcdFwiSGVsbG8sIERhdmUsIGhhdmUgeW91IGZvdW5kIG91dCB0aGUgdHJvdWJsZT9cIixcblx0XHRcIlRoZXJlJ3MgYmVlbiBhIGZhaWx1cmUgaW4gdGhlIHBvZCBiYXkgZG9vcnMuXFxuXCIgK1xuXHRcdFwiTHVja3kgeW91IHdlcmVuJ3Qga2lsbGVkLlwiLFxuXHRcdFwiSGV5LCBEYXZlLCB3aGF0IGFyZSB5b3UgZG9pbmc/XCJcblx0XTtcblxuXHRmdW5jdGlvbiBzYXkoZXJyb3IsIG1lc3NhZ2UsIGlubm9jdW91cykge1xuXHRcdHZhciBuO1xuXG5cdFx0aWYgKCFtZXNzYWdlKSB7XG5cdFx0XHRuID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbWVzc2FnZXMubGVuZ3RoICk7XG5cdFx0XHRtZXNzYWdlID0gbWVzc2FnZXNbbl07XG5cdFx0fVxuXG5cdFx0bWVzc2FnZSA9IFwiKiogIFwiICsgbWVzc2FnZS5yZXBsYWNlKC9cXG4vZywgXCJcXG4qKiAgXCIpO1xuXG5cdFx0dmFyIG91dHB1dCA9IFwiKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxcblxcblwiICtcblx0XHRcdCggbWVzc2FnZSB8fCBtZXNzYWdlc1tuXSApICtcblx0XHRcdFwiXFxuXFxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKlwiO1xuXG5cdFx0aWYgKGlubm9jdW91cylcblx0XHRcdGNvbnNvbGUubG9nKG91dHB1dCk7XG5cdFx0ZWxzZVxuXHRcdFx0Y29uc29sZS5lcnJvcihvdXRwdXQpO1xuXHR9XG5cblx0z4AubGlzdGVuKHNheSwgXCJlcnJvclwiKTtcblxuXHTPgC5IQUwgPSB7XG5cdFx0c2F5OiBzYXlcblx0fTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0dmFyIE9QVElPTl9JU19QUkVTU0VEID0gZmFsc2U7XG5cdHZhciBTVEFUVVNfSVNfVklTSUJMRSA9IGZhbHNlO1xuXHR2YXIgz4BTdGF0dXM7XG5cblx0z4Auc3RhdHVzID0ge1xuXHRcdHRvZ2dsZVZpc2liaWxpdHk6IGZ1bmN0aW9uICgpIHtcblx0XHRcdM+AU3RhdHVzLnRvZ2dsZUNsYXNzKFwib25cIik7XG5cdFx0XHRTVEFUVVNfSVNfVklTSUJMRSA9ICFTVEFUVVNfSVNfVklTSUJMRTtcblx0XHR9LFxuXHRcdG1vdmU6IGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRzd2l0Y2ggKG4pIHtcblx0XHRcdFx0Y2FzZSAzNzpcblx0XHRcdFx0XHTPgFN0YXR1cy5jc3Moe2xlZnQ6ICcxMHB4JywgcmlnaHQ6ICdhdXRvJ30pO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgMzg6XG5cdFx0XHRcdFx0z4BTdGF0dXMuY3NzKHt0b3A6ICcxMHB4JywgYm90dG9tOiAnYXV0byd9KTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIDM5OlxuXHRcdFx0XHRcdM+AU3RhdHVzLmNzcyh7cmlnaHQ6ICcxMHB4JywgbGVmdDogJ2F1dG8nfSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSA0MDpcblx0XHRcdFx0XHTPgFN0YXR1cy5jc3Moe2JvdHRvbTogJzEwcHgnLCB0b3A6ICdhdXRvJ30pO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0cHJvcHM6IHtcblx0XHRcdHdpblc6IDAsXG5cdFx0XHR3aW5IOiAwXG5cdFx0fVxuXHR9O1xuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0z4AubGlzdGVuKGNsZWFuRGVidWdMaXN0ZW5lcnMsICd1bmxvYWQnKTtcblx0XHTPgC5saXN0ZW4oa2V5RG93biwgJ2tleWRvd24nKTtcblx0XHTPgC5saXN0ZW4oa2V5VXAsICdrZXl1cCcpO1xuXHRcdM+ALmxpc3RlbihyZXNpemUsICdyZXNpemUnKTtcblx0XHRyZXNpemUoKTtcblxuXHRcdHZhciBib2R5ID0gz4AxKFwiYm9keVwiKTtcblx0XHR2YXIgc3RhdHVzU3R5bGUgPSDPgC5jb250ZW50RWxlbWVudChcInN0eWxlXCIpO1xuXHRcdHN0YXR1c1N0eWxlLmlubmVySFRNTCArPSBcIiPPgFN0YXR1cyB7IHBvc2l0aW9uOiBmaXhlZDsgYm90dG9tOiAxMHB4OyByaWdodDogMTBweDsgYmFja2dyb3VuZC1jb2xvcjogIzIyMjsgcGFkZGluZzogMTBweCAzMHB4OyBjb2xvcjogd2hpdGU7IGRpc3BsYXk6IG5vbmUgfVxcblwiO1xuXHRcdHN0YXR1c1N0eWxlLmlubmVySFRNTCArPSBcIiPPgFN0YXR1cy5vbiB7IGRpc3BsYXk6IGJsb2NrIH1cXG5cIjtcblx0XHRzdGF0dXNTdHlsZS5pbm5lckhUTUwgKz0gXCIjz4BTdGF0dXMgPiBkaXYgeyBtYXJnaW46IDIwcHggMCB9XFxuXCI7XG5cdFx0c3RhdHVzU3R5bGUuaW5uZXJIVE1MICs9IFwiI8+AU3RhdHVzID4gZGl2OmhvdmVyIHsgY29sb3I6ICMwMGZmOTk7IGN1cnNvcjogcG9pbnRlciB9XFxuXCI7XG5cblx0XHRib2R5LmFkZChzdGF0dXNTdHlsZSk7XG5cblx0XHTPgFN0YXR1cyA9IM+ALmRpdihudWxsLCBcIs+AU3RhdHVzXCIpO1xuXHRcdGJvZHkuYWRkKM+AU3RhdHVzKTtcblxuXHRcdGZ1bmN0aW9uIGtleURvd24oZSkge1xuXHRcdFx0c3dpdGNoIChlLndoaWNoKSB7XG5cdFx0XHRcdGNhc2UgMTg6XG5cdFx0XHRcdFx0T1BUSU9OX0lTX1BSRVNTRUQgPSB0cnVlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgMzc6XG5cdFx0XHRcdGNhc2UgMzg6XG5cdFx0XHRcdGNhc2UgMzk6XG5cdFx0XHRcdGNhc2UgNDA6IHtcblx0XHRcdFx0XHRpZiAoU1RBVFVTX0lTX1ZJU0lCTEUpIHtcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdM+ALnN0YXR1cy5tb3ZlKGUud2hpY2gpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNhc2UgODA6IHtcblx0XHRcdFx0XHRpZiAoT1BUSU9OX0lTX1BSRVNTRUQpIHtcblx0XHRcdFx0XHRcdM+ALnN0YXR1cy50b2dnbGVWaXNpYmlsaXR5KCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBrZXlVcChlKSB7XG5cdFx0XHRzd2l0Y2ggKGUud2hpY2gpIHtcblx0XHRcdFx0Y2FzZSAxODpcblx0XHRcdFx0XHRPUFRJT05fSVNfUFJFU1NFRCA9IGZhbHNlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHJlc2l6ZSgpIHtcblx0XHRcdM+ALnN0YXR1cy5wcm9wcy53aW5XID0gd2luZG93LmlubmVyV2lkdGg7XG5cdFx0XHTPgC5zdGF0dXMucHJvcHMud2luSCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjbGVhbkRlYnVnTGlzdGVuZXJzKCkge1xuXHRcdFx0z4AuY2xlYW4oY2xlYW5EZWJ1Z0xpc3RlbmVycywgJ3VubG9hZCcpO1xuXHRcdFx0z4AuY2xlYW4oz4Auc3RhdHVzLmdldFdpbmRvd1NpemUsICdyZXNpemUnKTtcblx0XHRcdM+ALmNsZWFuKGtleURvd24sICdrZXlkb3duJyk7XG5cdFx0XHTPgC5jbGVhbihrZXlVcCwgJ2tleXVwJyk7XG5cdFx0XHTPgC5jbGVhbihyZXNpemUsICdyZXNpemUnKTtcblx0XHRcdGNsZWFySW50ZXJ2YWwoc3RhdHVzSW50ZXJ2YWwpO1xuXHRcdH1cblxuXHRcdHZhciBzdGF0dXNJbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCl7XG5cdFx0XHQvLyBtYWtlIHN1cmUgd2UncmUgaGlnaGVzdFxuXHRcdFx0dmFyIGhpZ2hlc3RaID0gz4AuaGlnaGVzdFooKTtcblx0XHRcdGlmICjPgFN0YXR1cy5jc3MoKS56SW5kZXggPCBoaWdoZXN0WiAtIDEpIHtcblx0XHRcdFx0z4BTdGF0dXMuY3NzKHt6SW5kZXg6IGhpZ2hlc3RafSk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIG5vdyBpdGVyYXRlIHRoZSBwcm9wc1xuXHRcdFx0dmFyIHByb3BzID0gT2JqZWN0LmtleXMoz4Auc3RhdHVzLnByb3BzKTtcblx0XHRcdHByb3BzLmZvckVhY2goZnVuY3Rpb24ocHJvcCkge1xuXHRcdFx0XHR2YXIgZGl2SWQgPSAnc3RhdHVzUHJvcF8nICsgcHJvcDtcblx0XHRcdFx0dmFyIHByb3BEaXYgPSDPgFN0YXR1cy7PgDEoJyMnICsgZGl2SWQpO1xuXHRcdFx0XHRpZiAoIXByb3BEaXYpIHtcblx0XHRcdFx0XHRwcm9wRGl2ID0gz4AuZGl2KDAsIGRpdklkLCBwcm9wICsgJzogJyk7XG5cdFx0XHRcdFx0cHJvcERpdi5hZGQoz4Auc3BhbigpKTtcblx0XHRcdFx0XHTPgFN0YXR1cy5hZGQocHJvcERpdik7XG5cdFx0XHRcdFx0cHJvcERpdi5vbmNsaWNrID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKHByb3AgKyBcIjpcIik7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyjPgC5zdGF0dXMucHJvcHNbcHJvcF0pO1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRwcm9wRGl2Ls+AMSgnc3BhbicpLmlubmVySFRNTCA9IM+ALnN0YXR1cy5wcm9wc1twcm9wXTtcblx0XHRcdH0pO1xuXHRcdH0sIDEwMCk7XG5cdH1cblxuXHTPgC5tb2RzLnB1c2goaW5pdCk7XG59KSgpOyIsIiAvL21vZGFsIGNsb3NlIGJ1dHRvblxuKGZ1bmN0aW9uKCl7XG5cdM+ALm1vZGFsQ2xvc2VCdXR0b24gPSBmdW5jdGlvbihjbG9zaW5nRnVuY3Rpb24pe1xuXHRcdHJldHVybiDPgC5idXR0b24oJ3BpLW1vZGFsLWNsb3NlLWJ1dHRvbicsIG51bGwsIG51bGwsIGNsb3NpbmdGdW5jdGlvbik7XG5cdH07XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdHZhciB5YWggPSB0cnVlO1xuXHR2YXIgbW92aW5nID0gZmFsc2U7XG5cdHZhciBDU1NfQlJPV1NFUl9ERUxBWV9IQUNLID0gMjU7XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHTPgC5jbGVhbihpbml0KTtcblxuXHRcdC8vIFNhZmFyaSBjaG9rZXMgb24gdGhlIGFuaW1hdGlvbiBoZXJlLCBzby4uLlxuXHRcdGlmIChuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ0Nocm9tZScpID09IC0xICYmIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignU2FmYXJpJykgIT0gLTEpe1xuXHRcdFx0z4AxKCdib2R5JykuYWRkKM+ALmNvbnRlbnRFbGVtZW50KCdzdHlsZScsIDAsIDAsICcucGktYWNjb3JkaW9uIC53cmFwcGVye3RyYW5zaXRpb246IG5vbmV9JykpO1xuXHRcdH1cblx0XHQvLyBHcm9zcy5cblxuXHRcdM+AKCcucGktYWNjb3JkaW9uJykuZm9yRWFjaChmdW5jdGlvbihhY2NvcmRpb24pe1xuXHRcdFx0dmFyIGNvbnRhaW5lciA9IM+ALmRpdignY29udGFpbmVyJywgbnVsbCwgYWNjb3JkaW9uLmlubmVySFRNTCk7XG5cdFx0XHRhY2NvcmRpb24uZmlsbChjb250YWluZXIpO1xuXHRcdFx0UGlBY2NvcmRpb24oY29udGFpbmVyKTtcblx0XHR9KTtcblxuXHRcdHNldFlBSCgpO1xuXG5cdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHR5YWggPSBmYWxzZTtcblx0XHR9LCA1MDApO1xuXHR9XG5cblx0ZnVuY3Rpb24gUGlBY2NvcmRpb24oY29udGFpbmVyKXtcblx0XHRjb250YWluZXIuz4AoJzpzY29wZSA+IC5pdGVtJykuZm9yRWFjaChmdW5jdGlvbihpdGVtKXtcblx0XHRcdHZhciB0aXRsZVRleHQgPSBpdGVtLmRhdGFzZXQudGl0bGU7XG5cblx0XHRcdHZhciB0aXRsZSA9IM+ALmRpdigndGl0bGUnLCBudWxsLCB0aXRsZVRleHQpO1xuXHRcdFx0dmFyIHdyYXBwZXIgPSDPgC5kaXYoJ3dyYXBwZXInKTtcblx0XHRcdHZhciBjb250ZW50ID0gz4AuZGl2KCdjb250ZW50JywgbnVsbCwgaXRlbS5pbm5lckhUTUwpO1xuXG5cdFx0XHR3cmFwcGVyLmZpbGwoY29udGVudCk7XG5cdFx0XHRpdGVtLmZpbGwoW3RpdGxlLCB3cmFwcGVyXSk7XG5cdFx0XHR3cmFwcGVyLmNzcyh7aGVpZ2h0OiAwfSk7XG5cblx0XHRcdHRpdGxlLm9uY2xpY2sgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRpZiAoIXlhaCkge1xuXHRcdFx0XHRcdGlmIChtb3ZpbmcpIHJldHVybjtcblx0XHRcdFx0XHRtb3ZpbmcgPSB0cnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGNvbnRhaW5lci5kYXRhc2V0LnNpbmdsZSkge1xuXHRcdFx0XHRcdHZhciBvcGVuU2libGluZ3MgPSBpdGVtLnNpYmxpbmdzKCkuZmlsdGVyKGZ1bmN0aW9uKHNpYil7cmV0dXJuIHNpYi5oYXNDbGFzcygnb24nKTt9KTtcblx0XHRcdFx0XHRvcGVuU2libGluZ3MuZm9yRWFjaChmdW5jdGlvbihzaWJsaW5nKXtcblx0XHRcdFx0XHRcdHRvZ2dsZUl0ZW0oc2libGluZyk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0aWYgKGl0ZW0udGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnYScpIHJldHVybjtcblx0XHRcdFx0XHR0b2dnbGVJdGVtKGl0ZW0pO1xuXHRcdFx0XHR9LCBDU1NfQlJPV1NFUl9ERUxBWV9IQUNLKTtcblx0XHRcdH07XG5cblx0XHRcdGZ1bmN0aW9uIHRvZ2dsZUl0ZW0odGhpc0l0ZW0pe1xuXHRcdFx0XHR2YXIgdGhpc1dyYXBwZXIgPSB0aGlzSXRlbS7PgDEoJy53cmFwcGVyJyk7XG5cdFx0XHRcdHZhciBjb250ZW50SGVpZ2h0ID0gdGhpc1dyYXBwZXIuz4AxKCcuY29udGVudCcpLm9mZnNldCgpLmhlaWdodCArICdweCc7XG5cblx0XHRcdFx0aWYgKHRoaXNJdGVtLmhhc0NsYXNzKCdvbicpKSB7XG5cdFx0XHRcdFx0dGhpc1dyYXBwZXIuY3NzKHtoZWlnaHQ6IGNvbnRlbnRIZWlnaHR9KTtcblx0XHRcdFx0XHR0aGlzSXRlbS5raWxsQ2xhc3MoJ29uJyk7XG5cdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0dGhpc1dyYXBwZXIuY3NzKHtoZWlnaHQ6IDB9KTtcblx0XHRcdFx0XHRcdG1vdmluZyA9IGZhbHNlO1xuXHRcdFx0XHRcdH0sIENTU19CUk9XU0VSX0RFTEFZX0hBQ0spO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGl0ZW0uYWRkQ2xhc3MoJ29uJyk7XG5cdFx0XHRcdFx0dGhpc1dyYXBwZXIuY3NzKHtoZWlnaHQ6IGNvbnRlbnRIZWlnaHR9KTtcblxuXHRcdFx0XHRcdHZhciBkdXJhdGlvbiA9IHBhcnNlRmxvYXQodGhpc1dyYXBwZXIuY3NzKCkudHJhbnNpdGlvbkR1cmF0aW9uKSAqIDEwMDA7XG5cdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0dGhpc1dyYXBwZXIuY3NzKHtoZWlnaHQ6ICcnfSk7XG5cdFx0XHRcdFx0XHRtb3ZpbmcgPSBmYWxzZTtcblx0XHRcdFx0XHR9LCBkdXJhdGlvbik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0dmFyIGlubmVyQ29udGFpbmVycyA9IGNvbnRlbnQuz4AoJzpzY29wZSA+IC5jb250YWluZXInKTtcblx0XHRcdGlmIChpbm5lckNvbnRhaW5lcnMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRpbm5lckNvbnRhaW5lcnMuZm9yRWFjaChQaUFjY29yZGlvbik7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRZQUgoKSB7XG5cdFx0dmFyIHBhdGhuYW1lID0gbG9jYXRpb24uaHJlZjtcblx0XHR2YXIgY3VycmVudExpbmtzID0gW107XG5cdFx0Y29uc29sZS5sb2coXCJtZXNzYWdlXCIpO1xuXG5cdFx0z4AoJy5waS1hY2NvcmRpb24gYScpLmZvckVhY2goZnVuY3Rpb24gKGxpbmspIHtcblx0XHRcdGlmIChwYXRobmFtZS5pbmRleE9mKGxpbmsuaHJlZikgIT09IC0xKSB7XG5cdFx0XHRcdGN1cnJlbnRMaW5rcy5wdXNoKGxpbmspO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0Y3VycmVudExpbmtzLmZvckVhY2goZnVuY3Rpb24gKHlhaExpbmspIHtcblx0XHRcdHlhaExpbmsucGFyZW50cygnZGl2Lml0ZW0nKS5mb3JFYWNoKGZ1bmN0aW9uIChwYXJlbnQpIHtcblx0XHRcdFx0eWFoTGluay5wYXJlbnRzKCcuaXRlbScpLmZvckVhY2goZnVuY3Rpb24ocGFyZW50KXtcblx0XHRcdFx0XHRwYXJlbnQuYWRkQ2xhc3MoJ29uJyk7XG5cdFx0XHRcdFx0cGFyZW50Ls+AMSgnLndyYXBwZXInKS5jc3Moe2hlaWdodDogJ2F1dG8nfSk7XG5cdFx0XHRcdFx0cGFyZW50Ls+AMSgnLmNvbnRlbnQnKS5jc3Moe29wYWNpdHk6IDF9KTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0eWFoTGluay5hZGRDbGFzcygneWFoJyk7XG5cdFx0XHRcdHlhaExpbmsub25jbGljayA9IGZ1bmN0aW9uKGUpe2UucHJldmVudERlZmF1bHQoKTt9O1xuXHRcdFx0fSk7XG5cblx0XHR9KTtcblx0fVxuXG5cdM+ALm1vZHMucHVzaChpbml0KTtcbn0pKCk7XG4iLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiDPgC1wdXNobWVudS5qc1xuIC8vIFRPRE86ICBVU0FHRSBBTkQgQVBJIFJFRkVSRU5DRVxuIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cbiBERVBFTkRFTkNJRVM6XG5cbiBIQUwuanNcblxuIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cbiBEQVRBIEFUVFJJQlVURVM6XG5cbiBzaWRlOiBbXCJsZWZ0XCIsIFwicmlnaHRcIl1cbiBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXG4gTUFSS1VQIEFORCBERUZBVUxUUzpcblxuXHQ8ZGl2IGNsYXNzPVwicGktcHVzaG1lbnVcIiBpZD1cIm15UHVzaE1lbnVcIj5cblx0XHQgPHVsPlxuXHRcdFx0IDxsaT48YSBocmVmPVwiI1wiPmZvbzwvYT48L2xpPlxuXHRcdFx0IDxsaT48YSBocmVmPVwiI1wiPmJhcjwvYT48L2xpPlxuXHRcdFx0IDxsaT48YSBocmVmPVwiI1wiPmdyb25rPC9hPjwvbGk+XG5cdFx0XHQgPGxpPjxhIGhyZWY9XCIjXCI+ZmxlZWJsZXM8L2E+PC9saT5cblx0XHRcdCA8bGk+PGEgaHJlZj1cIiNcIj5zZXB1bHZlZGE8L2E+PC9saT5cblx0XHQgPC91bD5cblx0PC9kaXY+XG5cbmVsc2V3aGVyZS4uLlxuXG4gPGJ1dHRvbiBvbmNsaWNrPVwiz4AtcHVzaG1lbnUuc2hvdygnbXlQdXNoTWVudScpXCI+c2hvdyBtZW51PC9idXR0b24+XG5cbiBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXG4gR0VORVJBVEVEIEhUTUw6XG5cblx0XG4gX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xuIEFQSVxuXG5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbs+ALnB1c2htZW51ID0gKGZ1bmN0aW9uKCl7XG5cdHZhciBhbGxQdXNoTWVudXMgPSB7fTtcblxuXHRmdW5jdGlvbiBpbml0KCl7XG5cdFx0z4AoJ1tkYXRhLWF1dG8tYnVyZ2VyXScpLmZvckVhY2goZnVuY3Rpb24oY29udGFpbmVyKXtcblx0XHRcdHZhciBpZCA9IGNvbnRhaW5lci5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXV0by1idXJnZXInKTtcblxuXHRcdFx0dmFyIGF1dG9CdXJnZXIgPSDPgGQoaWQpIHx8IM+ALmRpdigncGktcHVzaG1lbnUnLCBpZCk7XG5cdFx0XHR2YXIgdWwgPSBhdXRvQnVyZ2VyLs+AMSgndWwnKSB8fCDPgC51bCgpO1xuXG5cdFx0XHRjb250YWluZXIuz4AoJ2FbaHJlZl0sIGJ1dHRvbicpLmZvckVhY2goZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0XHRpZiAoIWJvb2xlYW5BdHRyaWJ1dGVWYWx1ZShvYmosICdkYXRhLWF1dG8tYnVyZ2VyLWV4Y2x1ZGUnLCBmYWxzZSkpIHtcblx0XHRcdFx0XHR2YXIgY2xvbmUgPSBvYmouY2xvbmVOb2RlKHRydWUpO1xuXHRcdFx0XHRcdGNsb25lLmlkID0gJyc7XG5cblx0XHRcdFx0XHRpZiAoY2xvbmUudGFnTmFtZSA9PSBcIkJVVFRPTlwiKSB7XG5cdFx0XHRcdFx0XHR2YXIgYVRhZyA9IM+ALnNyY0VsZW1lbnQoJ2EnKTtcblx0XHRcdFx0XHRcdGFUYWcuaHJlZiA9ICcnO1xuXHRcdFx0XHRcdFx0YVRhZy5pbm5lckhUTUwgPSBjbG9uZS5pbm5lckhUTUw7XG5cdFx0XHRcdFx0XHRhVGFnLm9uY2xpY2sgPSBjbG9uZS5vbmNsaWNrO1xuXHRcdFx0XHRcdFx0Y2xvbmUgPSBhVGFnO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR1bC5hZGQoz4AubGkoMCwgMCwgY2xvbmUpKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdGF1dG9CdXJnZXIuYWRkKHVsKTtcblx0XHRcdM+AMSgnYm9keScpLmFkZChhdXRvQnVyZ2VyKTtcblx0XHR9KTtcblxuXHRcdM+AKFwiLnBpLXB1c2htZW51XCIpLmZvckVhY2goZnVuY3Rpb24oZWwpe1xuXHRcdFx0YWxsUHVzaE1lbnVzW2VsLmlkXSA9IFB1c2hNZW51KGVsKTtcblx0XHR9KTtcblxuXHRcdM+ALnNldFRyaWdnZXJzKCdwdXNobWVudScsIM+ALnB1c2htZW51KTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNob3cob2JqSWQpIHtcblx0XHRhbGxQdXNoTWVudXNbb2JqSWRdLmV4cG9zZSgpO1xuXHR9XG5cblx0Ly8gVE9ETzogZGlzbWlzcyBvbiBjbGljaz9cblx0Ly8gdGhpcyB3b3JrczpcblxuXHQvL8+AKCcucGktcHVzaG1lbnUgbGkgYScpLmZvckVhY2goZnVuY3Rpb24oYSl7XG5cdC8vXHRhLm9uY2xpY2sgPSBmdW5jdGlvbigpe1xuXHQvL1x0XHR0aGlzLnBhcmVudCgnLnBpLXB1c2htZW51Jykuz4AxKCcucGktbW9kYWwtY2xvc2UtYnV0dG9uJykuY2xpY2soKTtcblx0Ly9cdFx0Y29uc29sZS5sb2coXCJtZXNzYWdlXCIpO1xuXHQvL1x0fTtcblx0Ly99KTtcblxuXG5cdGZ1bmN0aW9uIFB1c2hNZW51KGVsKSB7XG5cdFx0dmFyIGh0bWwgPSDPgDEoJ2h0bWwnKTtcblx0XHR2YXIgYm9keSA9IM+AMSgnYm9keScpO1xuXG5cdFx0dmFyIG92ZXJsYXkgPSDPgC5kaXYoXCJvdmVybGF5XCIpO1xuXHRcdHZhciBjb250ZW50ID0gz4AuZGl2KCdjb250ZW50JywgbnVsbCwgZWwuz4AxKCcqJykpO1xuXG5cdFx0dmFyIHNpZGUgPSBlbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXNpZGVcIikgfHwgXCJyaWdodFwiO1xuXG5cdFx0dmFyIHNsZWQgPSDPgC5kaXYoXCJzbGVkXCIpO1xuXHRcdHNsZWQuY3NzKHNpZGUsIDApO1xuXG5cdFx0dmFyIHRvcEJhciA9IM+ALmRpdihcInRvcC1iYXJcIik7XG5cblx0XHR0b3BCYXIuZmlsbCjPgC5tb2RhbENsb3NlQnV0dG9uKGNsb3NlTWUpKTtcblx0XHRzbGVkLmZpbGwoW3RvcEJhciwgY29udGVudF0pO1xuXG5cdFx0b3ZlcmxheS5maWxsKHNsZWQpO1xuXHRcdGVsLmZpbGwob3ZlcmxheSk7XG5cblx0XHRzbGVkLm9uY2xpY2sgPSBmdW5jdGlvbihlKXtcblx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0fTtcblxuXHRcdG92ZXJsYXkub25jbGljayA9IGNsb3NlTWU7XG5cblx0XHTPgC5saXN0ZW4oY2xvc2VNZSwgJ3Jlc2l6ZScpO1xuXG5cdFx0ZnVuY3Rpb24gY2xvc2VNZShlKSB7XG5cdFx0XHR2YXIgdCA9IGUudGFyZ2V0O1xuXHRcdFx0aWYgKHQgPT0gc2xlZCB8fCB0ID09IHRvcEJhcikgcmV0dXJuO1xuXG5cdFx0XHRlbC5raWxsQ2xhc3MoXCJvblwiKTtcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0ZWwuY3NzKHtkaXNwbGF5OiBcIm5vbmVcIn0pO1xuXG5cdFx0XHRcdGJvZHkua2lsbENsYXNzKFwib3ZlcmxheS1vblwiKTtcblx0XHRcdH0sIDMwMCk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZXhwb3NlTWUoKXtcblx0XHRcdGJvZHkuYWRkQ2xhc3MoXCJvdmVybGF5LW9uXCIpOyAvLyBpbiB0aGUgZGVmYXVsdCBjb25maWcsIGtpbGxzIGJvZHkgc2Nyb2xsaW5nXG5cblx0XHRcdGVsLmNzcyh7XG5cdFx0XHRcdGRpc3BsYXk6IFwiYmxvY2tcIixcblx0XHRcdFx0ekluZGV4OiDPgC5oaWdoZXN0WigpXG5cdFx0XHR9KTtcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0ZWwuYWRkQ2xhc3MoXCJvblwiKTtcblx0XHRcdH0sIDEwKTtcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXhwb3NlOiBleHBvc2VNZVxuXHRcdH07XG5cdH1cblxuXHTPgC5tb2RzLnB1c2goaW5pdCk7XG5cblx0cmV0dXJuIHtcblx0XHRzaG93OiBzaG93XG5cdH07XG59KSgpO1xuIiwidmFyIGt1YiA9IChmdW5jdGlvbiAoKSB7XG5cdM+ALmxpc3Rlbihpbml0KTtcblxuXHR2YXIgSEVBREVSX0hFSUdIVDtcblx0dmFyIGh0bWwsIGJvZHksIG1haW5OYXYsIHF1aWNrc3RhcnRCdXR0b24sIHdpc2hGaWVsZDtcblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdM+ALmNsZWFuKGluaXQpO1xuXG5cdFx0aHRtbCA9IM+AMSgnaHRtbCcpO1xuXHRcdGJvZHkgPSDPgDEoJ2JvZHknKTtcblx0XHRtYWluTmF2ID0gz4BkKFwibWFpbk5hdlwiKTtcblx0XHR3aXNoRmllbGQgPSDPgGQoJ3dpc2hGaWVsZCcpO1xuXHRcdEhFQURFUl9IRUlHSFQgPSDPgDEoJ2hlYWRlcicpLm9mZnNldCgpLmhlaWdodDtcblxuXHRcdHF1aWNrc3RhcnRCdXR0b24gPSDPgGQoJ3F1aWNrc3RhcnRCdXR0b24nKTtcblxuXHRcdGJ1aWxkSW5saW5lVE9DKCk7XG5cblx0XHRhZGp1c3RFdmVyeXRoaW5nKCk7XG5cblx0XHTPgC5saXN0ZW4oYWRqdXN0RXZlcnl0aGluZywgJ3Jlc2l6ZScpO1xuXHRcdM+ALmxpc3RlbihhZGp1c3RFdmVyeXRoaW5nLCAnc2Nyb2xsJyk7XG5cdFx0z4AubGlzdGVuKGhhbmRsZUtleXN0cm9rZXMsICdrZXlkb3duJyk7XG5cdFx0d2lzaEZpZWxkLmxpc3RlbihoYW5kbGVLZXlzdHJva2VzLCAna2V5ZG93bicpO1xuXG5cdFx0ZG9jdW1lbnQub251bmxvYWQgPSBmdW5jdGlvbigpe1xuXHRcdFx0z4AuY2xlYW4oYWRqdXN0RXZlcnl0aGluZywgJ3Jlc2l6ZScpO1xuXHRcdFx0z4AuY2xlYW4oYWRqdXN0RXZlcnl0aGluZywgJ3Njcm9sbCcpO1xuXHRcdFx0z4AuY2xlYW4oaGFuZGxlS2V5c3Ryb2tlcywgJ2tleWRvd24nKTtcblx0XHRcdHdpc2hGaWVsZC5jbGVhbihoYW5kbGVLZXlzdHJva2VzLCAna2V5ZG93bicpO1xuXHRcdH07XG5cblx0XHTPgC5saXN0ZW4oY2xvc2VPcGVuTWVudSwgJ3Jlc2l6ZScpO1xuXG5cdFx0ZnVuY3Rpb24gY2xvc2VPcGVuTWVudSgpIHtcblx0XHRcdGlmIChodG1sLmhhc0NsYXNzKCdvcGVuLW5hdicpKSB0b2dnbGVNZW51KCk7XG5cdFx0fVxuXG5cdFx0z4AoJy5kcm9wZG93bicpLmZvckVhY2goZnVuY3Rpb24oZHJvcGRvd24pIHtcblx0XHRcdHZhciByZWFkb3V0ID0gZHJvcGRvd24uz4AxKCcucmVhZG91dCcpO1xuXHRcdFx0cmVhZG91dC5pbm5lckhUTUwgPSBkcm9wZG93bi7PgDEoJ2EnKS5pbm5lckhUTUw7XG5cdFx0XHRyZWFkb3V0Lm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGRyb3Bkb3duLnRvZ2dsZUNsYXNzKCdvbicpO1xuXHRcdFx0XHTPgC5saXN0ZW4oY2xvc2VPcGVuRHJvcGRvd24sICdjbGljaycpO1xuXG5cdFx0XHRcdGZ1bmN0aW9uIGNsb3NlT3BlbkRyb3Bkb3duKGUpIHtcblx0XHRcdFx0XHRpZiAoZHJvcGRvd24uaGFzQ2xhc3MoJ29uJykgJiYgIShkcm9wZG93bldhc0NsaWNrZWQoZSkpKSB7XG5cdFx0XHRcdFx0XHTPgC5jbGVhbihjbG9zZU9wZW5Ecm9wZG93biwgJ2NsaWNrJyk7XG5cdFx0XHRcdFx0XHRkcm9wZG93bi5raWxsQ2xhc3MoJ29uJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZnVuY3Rpb24gZHJvcGRvd25XYXNDbGlja2VkKGUpIHtcblx0XHRcdFx0XHRyZXR1cm4gZS50YXJnZXQuaXNIZWlyT2ZDbGFzcygnZHJvcGRvd24nKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9KTtcblxuXHRcdHNldEludGVydmFsKHNldEZvb3RlclR5cGUsIDEwKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGJ1aWxkSW5saW5lVE9DKCkge1xuXHRcdHZhciBkb2NzQ29udGVudCA9IM+AZCgnZG9jc0NvbnRlbnQnKTtcblx0XHR2YXIgcGFnZVRPQyA9IM+AZCgncGFnZVRPQycpO1xuXG5cdFx0aWYgKHBhZ2VUT0MpIHtcblx0XHRcdHZhciBoZWFkZXJzID0gZG9jc0NvbnRlbnQua2lkcygnI3BhZ2VUT0MsIGgxLCBoMiwgaDMsIGg0LCBoNSwgaDYnKTtcblx0XHRcdGhlYWRlcnMuc3BsaWNlKDAsIGhlYWRlcnMuaW5kZXhPZihwYWdlVE9DKSArIDEpO1xuXG5cdFx0XHR2YXIgdG9jID0gz4AudWwoKTtcblx0XHRcdHBhZ2VUT0MuYWRkKHRvYyk7XG5cblx0XHRcdGhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbiAoaGVhZGVyKSB7XG5cdFx0XHRcdGhlYWRlci5hZGRDbGFzcygnYW5jaG9yZWQnKTtcblxuXHRcdFx0XHR2YXIgbGluayA9IM+ALmNvbnRlbnRFbGVtZW50KCdhJywgMCwgMCwgaGVhZGVyLmlubmVySFRNTCk7XG5cdFx0XHRcdGxpbmsuaHJlZiA9ICcjJyArIGhlYWRlci5pZDtcblx0XHRcdFx0bGluay5hZGRDbGFzcyhoZWFkZXIudGFnTmFtZSk7XG5cblx0XHRcdFx0dG9jLmFkZCjPgC5saSgwLCAwLCBsaW5rKSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRGb290ZXJUeXBlKCkge1xuXHRcdGlmIChodG1sLmlkID09IFwiZG9jc1wiKSB7XG5cdFx0XHR2YXIgYm9keUhlaWdodCA9IM+AZCgnaGVybycpLm9mZnNldCgpLmhlaWdodCArIM+AZCgnZW5jeWNsb3BlZGlhJykub2Zmc2V0KCkuaGVpZ2h0O1xuXHRcdFx0dmFyIGZvb3RlciA9IM+AMSgnZm9vdGVyJyk7XG5cdFx0XHR2YXIgZm9vdGVySGVpZ2h0ID0gZm9vdGVyLm9mZnNldCgpLmhlaWdodDtcblx0XHRcdGJvZHkuY2xhc3NPbkNvbmRpdGlvbignZml4ZWQnLCB3aW5kb3cuaW5uZXJIZWlnaHQgLSBmb290ZXJIZWlnaHQgPiBib2R5SGVpZ2h0KTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBhZGp1c3RFdmVyeXRoaW5nKCkge1xuXHRcdGlmICghaHRtbC5oYXNDbGFzcygnb3Blbi1uYXYnKSkgSEVBREVSX0hFSUdIVCA9IM+AMSgnaGVhZGVyJykub2Zmc2V0KCkuaGVpZ2h0O1xuXHRcdGh0bWwuY2xhc3NPbkNvbmRpdGlvbignZmxpcC1uYXYnLCB3aW5kb3cucGFnZVlPZmZzZXQgPiAwKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHRvZ2dsZU1lbnUoKSB7XG5cdFx0aWYgKHdpbmRvdy5pbm5lcldpZHRoIDwgODAwKSB7XG5cdFx0XHTPgC5wdXNobWVudS5zaG93KCdwcmltYXJ5Jyk7XG5cdFx0fVxuXG5cdFx0ZWxzZSB7XG5cdFx0XHR2YXIgbmV3SGVpZ2h0ID0gSEVBREVSX0hFSUdIVDtcblxuXHRcdFx0aWYgKCFodG1sLmhhc0NsYXNzKCdvcGVuLW5hdicpKSB7XG5cdFx0XHRcdG5ld0hlaWdodCA9IG1haW5OYXYub2Zmc2V0KCkuaGVpZ2h0O1xuXHRcdFx0fVxuXG5cdFx0XHTPgDEoJ2hlYWRlcicpLmNzcyh7aGVpZ2h0OiBweChuZXdIZWlnaHQpfSk7XG5cdFx0fVxuXG5cdFx0aHRtbC50b2dnbGVDbGFzcygnb3Blbi1uYXYnKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHN1Ym1pdFdpc2godGV4dGZpZWxkKSB7XG5cdFx0d2luZG93LmxvY2F0aW9uLnJlcGxhY2UoXCJodHRwczovL2dpdGh1Yi5jb20va3ViZXJuZXRlcy9rdWJlcm5ldGVzLmdpdGh1Yi5pby9pc3N1ZXMvbmV3P3RpdGxlPUklMjB3aXNoJTIwXCIgK1xuXHRcdFx0d2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgXCIlMjBcIiArIHRleHRmaWVsZC52YWx1ZSArIFwiJmJvZHk9SSUyMHdpc2glMjBcIiArXG5cdFx0XHR3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyBcIiUyMFwiICsgdGV4dGZpZWxkLnZhbHVlKTtcblxuXHRcdHRleHRmaWVsZC52YWx1ZSA9ICcnO1xuXHRcdHRleHRmaWVsZC5ibHVyKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBoYW5kbGVLZXlzdHJva2VzKGUpIHtcblx0XHRzd2l0Y2ggKGUud2hpY2gpIHtcblx0XHRcdGNhc2UgMTM6IHtcblx0XHRcdFx0aWYgKGUuY3VycmVudFRhcmdldCA9PT0gd2lzaEZpZWxkKSB7XG5cdFx0XHRcdFx0c3VibWl0V2lzaCh3aXNoRmllbGQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHRjYXNlIDI3OiB7XG5cdFx0XHRcdGlmIChodG1sLmhhc0NsYXNzKCdvcGVuLW5hdicpKSB7XG5cdFx0XHRcdFx0dG9nZ2xlTWVudSgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB7XG5cdFx0dG9nZ2xlTWVudTogdG9nZ2xlTWVudVxuXHR9O1xufSkoKTtcblxuXG4vLyBUT0RPOiBzY3JvbGxpbnRvdmlldyBpbi1wYWdlIFRPQyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
