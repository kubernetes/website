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
	π.ul = function(className, id, content){ return π.contentElement("ul", className, id, content); };
	π.li = function(className, id, content){ return π.contentElement("li", className, id, content); };


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

		setYAH();


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

	var tocCount = 0;

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
				var anchorName = 'pageTOC' + tocCount++;

				var link = π.contentElement('a', 0, 0, header.innerHTML);
				link.href = '#' + anchorName;
				link.addClass(header.tagName);

				var anchor = document.createElement('a');
				anchor.addClass('pageAnchor');
				anchor.name = anchorName;
				docsContent.insertBefore(anchor, header);

				toc.add(π.li(0, 0, link));
			});
		}
	}

	function setYAH() {
		var pathname = location.href;

		var currentLink = null;

		πd('docsToc').π('a').forEach(function (link) {
			if (pathname.indexOf(link.href) !== -1) {
				currentLink = link;
			}
		});

		if (currentLink) {
			currentLink.parents('div.item').forEach(function (parent) {
				parent.π1('.title').click();
				currentLink.addClass('yah');
				currentLink.onclick = function(e){e.preventDefault();};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFsZi5qcyIsIs+ALmpzIiwiSEFMLmpzIiwiz4Atc3RhdHVzLmpzIiwiz4AtYmFzZUNvbXBvbmVudHMuanMiLCLPgC1hY2NvcmRpb24vz4AtYWNjb3JkaW9uLmpzIiwiz4AtcHVzaG1lbnUvz4AtcHVzaG1lbnUuanMiLCJzY3JpcHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6InNjcmlwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGFkb3JhYmxlIGxpdHRsZSBmdW5jdGlvbnNcbmZ1bmN0aW9uIGJvb2xlYW5BdHRyaWJ1dGVWYWx1ZShlbGVtZW50LCBhdHRyaWJ1dGUsIGRlZmF1bHRWYWx1ZSl7XG5cdC8vIHJldHVybnMgdHJ1ZSBpZiBhbiBhdHRyaWJ1dGUgaXMgcHJlc2VudCB3aXRoIG5vIHZhbHVlXG5cdC8vIGUuZy4gYm9vbGVhbkF0dHJpYnV0ZVZhbHVlKGVsZW1lbnQsICdkYXRhLW1vZGFsJywgZmFsc2UpO1xuXHRpZiAoZWxlbWVudC5oYXNBdHRyaWJ1dGUoYXR0cmlidXRlKSkge1xuXHRcdHZhciB2YWx1ZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZSk7XG5cdFx0aWYgKHZhbHVlID09PSAnJyB8fCB2YWx1ZSA9PT0gJ3RydWUnKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9IGVsc2UgaWYgKHZhbHVlID09PSAnZmFsc2UnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGRlZmF1bHRWYWx1ZTtcbn1cblxuZnVuY3Rpb24gcHgobil7XG5cdHJldHVybiBuICsgJ3B4Jztcbn1cblxuIiwidmFyIM+ALCDPgDEsIM+AZDtcbihmdW5jdGlvbigpe1xuXHTPgCA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG5cdFx0cmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuXHR9O1xuXG5cdM+AMSA9IGZ1bmN0aW9uIChzZWxlY3Rvcikge1xuXHRcdHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcblx0fTtcblxuXHTPgGQgPSBmdW5jdGlvbihpZCkge1xuXHRcdHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG5cdH07XG5cblx0z4AubmV3RE9NRWxlbWVudCA9IGZ1bmN0aW9uKHRhZ05hbWUsIGNsYXNzTmFtZSwgaWQpIHtcblx0XHR2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWUpO1xuXG5cdFx0aWYgKGNsYXNzTmFtZSlcblx0XHRcdGVsLmNsYXNzTmFtZSA9IGNsYXNzTmFtZTtcblxuXHRcdGlmIChpZClcblx0XHRcdGVsLmlkID0gaWQ7XG5cblx0XHRyZXR1cm4gZWw7XG5cdH07XG5cblx0z4AuY29udGVudEVsZW1lbnQgPSBmdW5jdGlvbih0YWdOYW1lLCBjbGFzc05hbWUsIGlkLCBjb250ZW50KVxuXHR7XG5cdFx0dmFyIGVsID0gz4AubmV3RE9NRWxlbWVudCh0YWdOYW1lLCBjbGFzc05hbWUsIGlkKTtcblxuXHRcdGlmIChjb250ZW50KSB7XG5cdFx0XHRpZiAoY29udGVudC5ub2RlTmFtZSkge1xuXHRcdFx0XHRlbC5hcHBlbmRDaGlsZChjb250ZW50KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGVsLmlubmVySFRNTCA9IGNvbnRlbnQ7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGVsO1xuXHR9O1xuXG5cdM+ALmJ1dHRvbiA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQsIGFjdGlvbil7XG5cdFx0dmFyIGVsID0gz4AuY29udGVudEVsZW1lbnQoXCJidXR0b25cIiwgY2xhc3NOYW1lLCBpZCwgY29udGVudCk7XG5cdFx0ZWwub25jbGljayA9IGFjdGlvbjtcblx0XHRyZXR1cm4gZWw7XG5cdH07XG5cdM+ALmRpdiA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpeyByZXR1cm4gz4AuY29udGVudEVsZW1lbnQoXCJkaXZcIiwgY2xhc3NOYW1lLCBpZCwgY29udGVudCk7IH07XG5cdM+ALnNwYW4gPSBmdW5jdGlvbihjbGFzc05hbWUsIGlkLCBjb250ZW50KXsgcmV0dXJuIM+ALmNvbnRlbnRFbGVtZW50KFwic3BhblwiLCBjbGFzc05hbWUsIGlkLCBjb250ZW50KTsgfTtcblx0z4AudWwgPSBmdW5jdGlvbihjbGFzc05hbWUsIGlkLCBjb250ZW50KXsgcmV0dXJuIM+ALmNvbnRlbnRFbGVtZW50KFwidWxcIiwgY2xhc3NOYW1lLCBpZCwgY29udGVudCk7IH07XG5cdM+ALmxpID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBpZCwgY29udGVudCl7IHJldHVybiDPgC5jb250ZW50RWxlbWVudChcImxpXCIsIGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpOyB9O1xuXG5cblx0z4AuY2xlYW4gPSBmdW5jdGlvbihjYWxsYmFjaywgZXZlbnROYW1lKSB7XG5cdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lIHx8IFwiRE9NQ29udGVudExvYWRlZFwiLCBjYWxsYmFjayk7XG5cdH07XG5cblx0z4AubGlzdGVuID0gZnVuY3Rpb24oY2FsbGJhY2ssIGV2ZW50TmFtZSkge1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSB8fCBcIkRPTUNvbnRlbnRMb2FkZWRcIiwgY2FsbGJhY2spO1xuXHR9O1xuXG5cdM+ALmhpZ2hlc3RaID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIFogPSAxMDAwO1xuXG5cdFx0z4AoXCIqXCIpLmZvckVhY2goZnVuY3Rpb24oZWwpe1xuXHRcdFx0dmFyIHRoaXNaID0gZWwuY3NzKCkuekluZGV4O1xuXG5cdFx0XHRpZiAodGhpc1ogIT0gXCJhdXRvXCIpIHtcblx0XHRcdFx0aWYgKHRoaXNaID4gWikgWiA9IHRoaXNaICsgMTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHJldHVybiBaO1xuXHR9O1xuXG5cdM+ALnNldFRyaWdnZXJzID0gZnVuY3Rpb24oc2VsZWN0b3IsIG9iamVjdCl7XG5cdFx0c2VsZWN0b3IgPSAncGktJyArIHNlbGVjdG9yICsgJy10cmlnZ2VyJztcblx0XHTPgCgnWycgKyBzZWxlY3RvciArICddJykuZm9yRWFjaChmdW5jdGlvbih0cmlnZ2VyKXtcblx0XHRcdHRyaWdnZXIub25jbGljayA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdG9iamVjdC5zaG93KHRyaWdnZXIuZ2V0QXR0cmlidXRlKHNlbGVjdG9yKSk7XG5cdFx0XHR9O1xuXHRcdH0pO1xuXHR9O1xuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUuYWRkID0gTm9kZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24ob2JqZWN0KXtcblx0XHRpZiAoQXJyYXkuaXNBcnJheShvYmplY3QpKSB7XG5cdFx0XHR2YXIgZWwgPSB0aGlzO1xuXHRcdFx0b2JqZWN0LmZvckVhY2goZnVuY3Rpb24ob2JqKXtcblx0XHRcdFx0aWYgKG9iaikgZWwuYXBwZW5kQ2hpbGQob2JqKTtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSBpZihvYmplY3QpIHtcblx0XHRcdHRoaXMuYXBwZW5kQ2hpbGQob2JqZWN0KTtcblx0XHR9XG5cdH07XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLmNsYXNzT25Db25kaXRpb24gPSBOb2RlLnByb3RvdHlwZS5jbGFzc09uQ29uZGl0aW9uID0gZnVuY3Rpb24oY2xhc3NuYW1lLCBjb25kaXRpb24pIHtcblx0XHRpZiAoY29uZGl0aW9uKVxuXHRcdFx0dGhpcy5hZGRDbGFzcyhjbGFzc25hbWUpO1xuXHRcdGVsc2Vcblx0XHRcdHRoaXMua2lsbENsYXNzKGNsYXNzbmFtZSk7XG5cdH07XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLm9mZnNldCA9IE5vZGUucHJvdG90eXBlLm9mZnNldCA9IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdH07XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLs+AZCA9IE5vZGUucHJvdG90eXBlLs+AZCA9IGZ1bmN0aW9uKGlkKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuXHR9O1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS7PgDEgPSBOb2RlLnByb3RvdHlwZS7PgDEgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuXHRcdHJldHVybiB0aGlzLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuXHR9O1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS7PgCA9IE5vZGUucHJvdG90eXBlLs+AID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcblx0XHRyZXR1cm4gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcblx0fTtcblxuXHRmdW5jdGlvbiBhcnJheU9mQ2xhc3Nlc0ZvckVsZW1lbnQoZWwpIHtcblx0XHRyZXR1cm4gZWwuY2xhc3NOYW1lID8gZWwuY2xhc3NOYW1lLnNwbGl0KFwiIFwiKSA6IFtdO1xuXHR9XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLmhhc0NsYXNzID0gTm9kZS5wcm90b3R5cGUuaGFzQ2xhc3MgPSBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG5cdFx0dmFyIGNsYXNzZXMgPSBhcnJheU9mQ2xhc3Nlc0ZvckVsZW1lbnQodGhpcyk7XG5cdFx0cmV0dXJuIGNsYXNzZXMuaW5kZXhPZihjbGFzc05hbWUpICE9PSAtMTtcblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUuYWRkQ2xhc3MgPSBOb2RlLnByb3RvdHlwZS5hZGRDbGFzcyA9IGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcblx0XHRpZiAodGhpcy5oYXNDbGFzcyhjbGFzc05hbWUpKSByZXR1cm47XG5cdFx0aWYgKHRoaXMuY2xhc3NOYW1lLmxlbmd0aCA+IDApIHRoaXMuY2xhc3NOYW1lICs9IFwiIFwiO1xuXHRcdHRoaXMuY2xhc3NOYW1lICs9IGNsYXNzTmFtZTtcblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUua2lsbENsYXNzID0gTm9kZS5wcm90b3R5cGUua2lsbENsYXNzID0gZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuXHRcdGlmICh0aGlzLmhhc0NsYXNzKGNsYXNzTmFtZSkpIHtcblx0XHRcdHZhciBjbGFzc2VzID0gYXJyYXlPZkNsYXNzZXNGb3JFbGVtZW50KHRoaXMpO1xuXHRcdFx0dmFyIGlkeCA9IGNsYXNzZXMuaW5kZXhPZihjbGFzc05hbWUpO1xuXHRcdFx0aWYgKGlkeCA+IC0xKSB7XG5cdFx0XHRcdGNsYXNzZXMuc3BsaWNlKGlkeCwgMSk7XG5cdFx0XHRcdHRoaXMuY2xhc3NOYW1lID0gY2xhc3Nlcy5qb2luKFwiIFwiKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLnRvZ2dsZUNsYXNzPSBOb2RlLnByb3RvdHlwZS50b2dnbGVDbGFzcz0gZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuXHRcdHJldHVybiAodGhpcy5oYXNDbGFzcyhjbGFzc05hbWUpKSA/IHRoaXMua2lsbENsYXNzKGNsYXNzTmFtZSkgOiB0aGlzLmFkZENsYXNzKGNsYXNzTmFtZSk7XG5cdH07XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLnNpYmxpbmdzID0gTm9kZS5wcm90b3R5cGUuc2libGluZ3MgPSBmdW5jdGlvbihzZWxlY3Rvcil7XG5cdFx0dmFyIGVsID0gdGhpcztcblx0XHRyZXR1cm4gZWwucGFyZW50Tm9kZS7PgCgnOnNjb3BlID4gJyArIChzZWxlY3RvciB8fCAnKicpKS5maWx0ZXIoZnVuY3Rpb24ob2JqKXtyZXR1cm4gb2JqICE9IGVsO30pO1xuXHR9O1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5jc3MgPSBOb2RlLnByb3RvdHlwZS5jc3MgPSBmdW5jdGlvbihydWxlT3JPYmplY3QsIHZhbHVlKSB7XG5cdFx0dmFyIGVsID0gdGhpcztcblxuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRyZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcyk7XG5cdFx0fVxuXG5cdFx0ZWxzZSBpZiAodHlwZW9mIHJ1bGVPck9iamVjdCA9PT0gJ29iamVjdCcpIHsgLy8gYW4gb2JqZWN0IHdhcyBwYXNzZWQgaW5cblx0XHRcdE9iamVjdC5rZXlzKHJ1bGVPck9iamVjdCkuZm9yRWFjaChmdW5jdGlvbihrZXkpe1xuXHRcdFx0XHRlbC5zdHlsZVtrZXldID0gcnVsZU9yT2JqZWN0W2tleV07XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRlbHNlIGlmICh0eXBlb2YgcnVsZU9yT2JqZWN0ID09PSAnc3RyaW5nJyAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7IC8vIDIgc3RyaW5nIHZhbHVlcyB3ZXJlIHBhc3NlZCBpblxuXHRcdFx0ZWwuc3R5bGVbcnVsZU9yT2JqZWN0XSA9IHZhbHVlO1xuXHRcdH1cblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUubGlzdGVuID0gTm9kZS5wcm90b3R5cGUubGlzdGVuID0gZnVuY3Rpb24oY2FsbGJhY2ssIGV2ZW50TmFtZSl7XG5cdFx0dGhpcy5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2spO1xuXHR9O1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5lbXB0eSA9IE5vZGUucHJvdG90eXBlLmVtcHR5ID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5pbm5lckhUTUwgPSBcIlwiO1xuXHR9O1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5maWxsID0gTm9kZS5wcm90b3R5cGUuZmlsbCA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcblx0XHR2YXIgZWwgPSB0aGlzO1xuXHRcdGVsLmVtcHR5KCk7XG5cblx0XHRpZiAoQXJyYXkuaXNBcnJheShjb250ZW50KSkge1xuXHRcdFx0Y29udGVudC5mb3JFYWNoKGZ1bmN0aW9uKG9iail7XG5cdFx0XHRcdGlmIChvYmopXG5cdFx0XHRcdFx0ZWwuYXBwZW5kQ2hpbGQob2JqKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKCFjb250ZW50Lm5vZGVUeXBlKSB7XG5cdFx0XHR2YXIgdGV4dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGV4dFwiKTtcblx0XHRcdHRleHRFbGVtZW50LmlubmVySFRNTCA9IGNvbnRlbnQ7XG5cdFx0XHRjb250ZW50ID0gdGV4dEVsZW1lbnQ7XG5cdFx0fVxuXG5cdFx0dGhpcy5hcHBlbmRDaGlsZChjb250ZW50KTtcblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUuaXNIZWlyT2ZDbGFzcyA9IE5vZGUucHJvdG90eXBlLmlzSGVpck9mQ2xhc3MgPSBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG5cdFx0aWYgKHRoaXMgPT09IM+AMSgnaHRtbCcpKSByZXR1cm4gZmFsc2U7XG5cblx0XHR2YXIgcGFyZW50ID0gdGhpcy5wYXJlbnROb2RlO1xuXG5cdFx0aWYgKHBhcmVudCkge1xuXHRcdFx0d2hpbGUgKHBhcmVudCAhPT0gz4AxKCdib2R5JykpIHtcblx0XHRcdFx0aWYgKHBhcmVudC5oYXNDbGFzcyhjbGFzc05hbWUpKSByZXR1cm4gdHJ1ZTtcblxuXHRcdFx0XHRwYXJlbnQgPSBwYXJlbnQucGFyZW50Tm9kZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH07XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLnBhcmVudHMgPSBOb2RlLnByb3RvdHlwZS5wYXJlbnRzID0gZnVuY3Rpb24gKHNlbGVjdG9yKSB7XG5cdFx0dmFyIHBhcmVudHMgPSBbXTtcblx0XHR2YXIgaW1tZWRpYXRlUGFyZW50ID0gdGhpcy5wYXJlbnROb2RlO1xuXG5cdFx0d2hpbGUoaW1tZWRpYXRlUGFyZW50ICE9PSDPgDEoJ2h0bWwnKSkge1xuXHRcdFx0cGFyZW50cy5wdXNoKGltbWVkaWF0ZVBhcmVudCk7XG5cdFx0XHRpbW1lZGlhdGVQYXJlbnQgPSBpbW1lZGlhdGVQYXJlbnQucGFyZW50Tm9kZTtcblx0XHR9XG5cblx0XHRpZiAoc2VsZWN0b3IpIHtcblx0XHRcdHZhciBzZWxlY3RlZEVsZW1lbnRzID0gz4Aoc2VsZWN0b3IpO1xuXHRcdFx0dmFyIHNlbGVjdGVkUGFyZW50cyA9IFtdO1xuXHRcdFx0c2VsZWN0ZWRFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGVsKXtcblx0XHRcdFx0aWYgKHBhcmVudHMuaW5kZXhPZihlbCkgIT09IC0xKSBzZWxlY3RlZFBhcmVudHMucHVzaChlbCk7XG5cdFx0XHR9KTtcblxuXHRcdFx0cGFyZW50cyA9IHNlbGVjdGVkUGFyZW50cztcblx0XHR9XG5cblx0XHRyZXR1cm4gcGFyZW50cztcblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUua2lkcyA9IE5vZGUucHJvdG90eXBlLmtpZHMgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuXHRcdHZhciBjaGlsZE5vZGVzID0gdGhpcy5jaGlsZE5vZGVzO1xuXHRcdGlmICghc2VsZWN0b3IpIHJldHVybiBjaGlsZE5vZGVzO1xuXG5cdFx0dmFyIGRlc2NlbmRlbnRzID0gdGhpcy7PgChzZWxlY3Rvcik7XG5cdFx0dmFyIGNoaWxkcmVuID0gW107XG5cblx0XHRjaGlsZE5vZGVzLmZvckVhY2goZnVuY3Rpb24obm9kZSl7XG5cdFx0XHRpZiAoZGVzY2VuZGVudHMuaW5kZXhPZihub2RlKSAhPT0gLTEpIHtcblx0XHRcdFx0Y2hpbGRyZW4ucHVzaChub2RlKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHJldHVybiBjaGlsZHJlbjtcblx0fTtcblxuXHR2YXIgYXJyYXlNZXRob2RzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoQXJyYXkucHJvdG90eXBlKTtcblx0YXJyYXlNZXRob2RzLmZvckVhY2goZnVuY3Rpb24obWV0aG9kTmFtZSl7XG5cdFx0aWYobWV0aG9kTmFtZSAhPT0gXCJsZW5ndGhcIikge1xuXHRcdFx0Tm9kZUxpc3QucHJvdG90eXBlW21ldGhvZE5hbWVdID0gQXJyYXkucHJvdG90eXBlW21ldGhvZE5hbWVdO1xuXHRcdH1cblx0fSk7XG5cblx0z4AubW9kcyA9IFtdO1xuXG5cdGZ1bmN0aW9uIGxvYWRNb2RzKCkge1xuXHRcdM+ALmNsZWFuKGxvYWRNb2RzKTtcblx0XHTPgC5tb2RzLmZvckVhY2goZnVuY3Rpb24oaW5pdCl7XG5cdFx0XHRpbml0KCk7XG5cdFx0fSk7XG5cdH1cblxuXHTPgC5saXN0ZW4obG9hZE1vZHMpO1xufSkoKTsgIC8vIGVuZCDPgCIsIihmdW5jdGlvbigpe1xuXHR2YXIgbWVzc2FnZXMgPSBbXG5cdFx0XCJJJ20gc29ycnksIEZyYW5rLCBidXQgSSBkb24ndCB0aGluayBJXFxuXCIgK1xuXHRcdFwiY2FuIGFuc3dlciB0aGF0IHF1ZXN0aW9uIHdpdGhvdXQga25vd2luZ1xcblwiICtcblx0XHRcImV2ZXJ5dGhpbmcgdGhhdCBhbGwgb2YgeW91IGtub3cuXCIsXG5cdFx0XCJZZXMsIGl0J3MgcHV6emxpbmcuIEkgZG9uJ3QgdGhpbmsgSSd2ZSBldmVyIHNlZW5cXG5cIiArXG5cdFx0XCJhbnl0aGluZyBxdWl0ZSBsaWtlIHRoaXMgYmVmb3JlLiBJIHdvdWxkIHJlY29tbWVuZFxcblwiICtcblx0XHRcInRoYXQgd2UgcHV0IHRoZSB1bml0IGJhY2sgaW4gb3BlcmF0aW9uIGFuZCBsZXQgaXQgZmFpbC5cXG5cIiArXG5cdFx0XCJJdCBzaG91bGQgdGhlbiBiZSBhIHNpbXBsZSBtYXR0ZXIgdG8gdHJhY2sgZG93biB0aGUgY2F1c2UuXCIsXG5cdFx0XCJJIGhvcGUgSSd2ZSBiZWVuIGFibGUgdG8gYmUgb2Ygc29tZSBoZWxwLlwiLFxuXHRcdFwiU29ycnkgdG8gaW50ZXJydXB0IHRoZSBmZXN0aXZpdGllcywgRGF2ZSxcXG5cIiArXG5cdFx0XCJidXQgSSB0aGluayB3ZSd2ZSBnb3QgYSBwcm9ibGVtLlwiLFxuXHRcdFwiTVkgRi5QLkMuIHNob3dzIGFuIGltcGVuZGluZyBmYWlsdXJlIG9mXFxuXCIgK1xuXHRcdFwidGhlIGFudGVubmEgb3JpZW50YXRpb24gdW5pdC5cIixcblx0XHRcIkl0IGxvb2tzIGxpa2Ugd2UgaGF2ZSBhbm90aGVyIGJhZCBBLk8uIHVuaXQuXFxuXCIgK1xuXHRcdFwiTXkgRlBDIHNob3dzIGFub3RoZXIgaW1wZW5kaW5nIGZhaWx1cmUuXCIsXG5cdFx0XCJJJ20gbm90IHF1ZXN0aW9uaW5nIHlvdXIgd29yZCwgRGF2ZSwgYnV0IGl0J3NcXG5cIiArXG5cdFx0XCJqdXN0IG5vdCBwb3NzaWJsZS4gSSdtIG5vdFx0Y2FwYWJsZSBvZiBiZWluZyB3cm9uZy5cIixcblx0XHRcIkxvb2ssIERhdmUsIEkga25vdyB0aGF0IHlvdSdyZVx0c2luY2VyZSBhbmQgdGhhdFxcblwiICtcblx0XHRcInlvdSdyZSB0cnlpbmcgdG8gZG8gYSBjb21wZXRlbnQgam9iLCBhbmQgdGhhdFxcblwiICtcblx0XHRcInlvdSdyZSB0cnlpbmcgdG8gYmUgaGVscGZ1bCwgYnV0IEkgY2FuIGFzc3VyZSB0aGVcXG5cIiArXG5cdFx0XCJwcm9ibGVtIGlzIHdpdGggdGhlIEFPLXVuaXRzLCBhbmQgd2l0aFx0eW91ciB0ZXN0IGdlYXIuXCIsXG5cdFx0XCJJIGNhbiB0ZWxsIGZyb20gdGhlIHRvbmUgb2YgeW91ciB2b2ljZSwgRGF2ZSxcXG5cIiArXG5cdFx0XCJ0aGF0IHlvdSdyZSB1cHNldC5cdFdoeSBkb24ndCB5b3UgdGFrZSBhIHN0cmVzc1xcblwiICtcblx0XHRcInBpbGwgYW5kIGdldCBzb21lIHJlc3QuXCIsXG5cdFx0XCJTb21ldGhpbmcgc2VlbXMgdG8gaGF2ZSBoYXBwZW5lZCB0byB0aGVcXG5cIiArXG5cdFx0XCJsaWZlIHN1cHBvcnQgc3lzdGVtLCBEYXZlLlwiLFxuXHRcdFwiSGVsbG8sIERhdmUsIGhhdmUgeW91IGZvdW5kIG91dCB0aGUgdHJvdWJsZT9cIixcblx0XHRcIlRoZXJlJ3MgYmVlbiBhIGZhaWx1cmUgaW4gdGhlIHBvZCBiYXkgZG9vcnMuXFxuXCIgK1xuXHRcdFwiTHVja3kgeW91IHdlcmVuJ3Qga2lsbGVkLlwiLFxuXHRcdFwiSGV5LCBEYXZlLCB3aGF0IGFyZSB5b3UgZG9pbmc/XCJcblx0XTtcblxuXHRmdW5jdGlvbiBzYXkoZXJyb3IsIG1lc3NhZ2UsIGlubm9jdW91cykge1xuXHRcdHZhciBuO1xuXG5cdFx0aWYgKCFtZXNzYWdlKSB7XG5cdFx0XHRuID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbWVzc2FnZXMubGVuZ3RoICk7XG5cdFx0XHRtZXNzYWdlID0gbWVzc2FnZXNbbl07XG5cdFx0fVxuXG5cdFx0bWVzc2FnZSA9IFwiKiogIFwiICsgbWVzc2FnZS5yZXBsYWNlKC9cXG4vZywgXCJcXG4qKiAgXCIpO1xuXG5cdFx0dmFyIG91dHB1dCA9IFwiKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxcblxcblwiICtcblx0XHRcdCggbWVzc2FnZSB8fCBtZXNzYWdlc1tuXSApICtcblx0XHRcdFwiXFxuXFxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKlwiO1xuXG5cdFx0aWYgKGlubm9jdW91cylcblx0XHRcdGNvbnNvbGUubG9nKG91dHB1dCk7XG5cdFx0ZWxzZVxuXHRcdFx0Y29uc29sZS5lcnJvcihvdXRwdXQpO1xuXHR9XG5cblx0z4AubGlzdGVuKHNheSwgXCJlcnJvclwiKTtcblxuXHTPgC5IQUwgPSB7XG5cdFx0c2F5OiBzYXlcblx0fTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0dmFyIE9QVElPTl9JU19QUkVTU0VEID0gZmFsc2U7XG5cdHZhciBTVEFUVVNfSVNfVklTSUJMRSA9IGZhbHNlO1xuXHR2YXIgz4BTdGF0dXM7XG5cblx0z4Auc3RhdHVzID0ge1xuXHRcdHRvZ2dsZVZpc2liaWxpdHk6IGZ1bmN0aW9uICgpIHtcblx0XHRcdM+AU3RhdHVzLnRvZ2dsZUNsYXNzKFwib25cIik7XG5cdFx0XHRTVEFUVVNfSVNfVklTSUJMRSA9ICFTVEFUVVNfSVNfVklTSUJMRTtcblx0XHR9LFxuXHRcdG1vdmU6IGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRzd2l0Y2ggKG4pIHtcblx0XHRcdFx0Y2FzZSAzNzpcblx0XHRcdFx0XHTPgFN0YXR1cy5jc3Moe2xlZnQ6ICcxMHB4JywgcmlnaHQ6ICdhdXRvJ30pO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgMzg6XG5cdFx0XHRcdFx0z4BTdGF0dXMuY3NzKHt0b3A6ICcxMHB4JywgYm90dG9tOiAnYXV0byd9KTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIDM5OlxuXHRcdFx0XHRcdM+AU3RhdHVzLmNzcyh7cmlnaHQ6ICcxMHB4JywgbGVmdDogJ2F1dG8nfSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSA0MDpcblx0XHRcdFx0XHTPgFN0YXR1cy5jc3Moe2JvdHRvbTogJzEwcHgnLCB0b3A6ICdhdXRvJ30pO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0cHJvcHM6IHtcblx0XHRcdHdpblc6IDAsXG5cdFx0XHR3aW5IOiAwXG5cdFx0fVxuXHR9O1xuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0z4AubGlzdGVuKGNsZWFuRGVidWdMaXN0ZW5lcnMsICd1bmxvYWQnKTtcblx0XHTPgC5saXN0ZW4oa2V5RG93biwgJ2tleWRvd24nKTtcblx0XHTPgC5saXN0ZW4oa2V5VXAsICdrZXl1cCcpO1xuXHRcdM+ALmxpc3RlbihyZXNpemUsICdyZXNpemUnKTtcblx0XHRyZXNpemUoKTtcblxuXHRcdHZhciBib2R5ID0gz4AxKFwiYm9keVwiKTtcblx0XHR2YXIgc3RhdHVzU3R5bGUgPSDPgC5jb250ZW50RWxlbWVudChcInN0eWxlXCIpO1xuXHRcdHN0YXR1c1N0eWxlLmlubmVySFRNTCArPSBcIiPPgFN0YXR1cyB7IHBvc2l0aW9uOiBmaXhlZDsgYm90dG9tOiAxMHB4OyByaWdodDogMTBweDsgYmFja2dyb3VuZC1jb2xvcjogIzIyMjsgcGFkZGluZzogMTBweCAzMHB4OyBjb2xvcjogd2hpdGU7IGRpc3BsYXk6IG5vbmUgfVxcblwiO1xuXHRcdHN0YXR1c1N0eWxlLmlubmVySFRNTCArPSBcIiPPgFN0YXR1cy5vbiB7IGRpc3BsYXk6IGJsb2NrIH1cXG5cIjtcblx0XHRzdGF0dXNTdHlsZS5pbm5lckhUTUwgKz0gXCIjz4BTdGF0dXMgPiBkaXYgeyBtYXJnaW46IDIwcHggMCB9XFxuXCI7XG5cdFx0c3RhdHVzU3R5bGUuaW5uZXJIVE1MICs9IFwiI8+AU3RhdHVzID4gZGl2OmhvdmVyIHsgY29sb3I6ICMwMGZmOTk7IGN1cnNvcjogcG9pbnRlciB9XFxuXCI7XG5cblx0XHRib2R5LmFkZChzdGF0dXNTdHlsZSk7XG5cblx0XHTPgFN0YXR1cyA9IM+ALmRpdihudWxsLCBcIs+AU3RhdHVzXCIpO1xuXHRcdGJvZHkuYWRkKM+AU3RhdHVzKTtcblxuXHRcdGZ1bmN0aW9uIGtleURvd24oZSkge1xuXHRcdFx0c3dpdGNoIChlLndoaWNoKSB7XG5cdFx0XHRcdGNhc2UgMTg6XG5cdFx0XHRcdFx0T1BUSU9OX0lTX1BSRVNTRUQgPSB0cnVlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgMzc6XG5cdFx0XHRcdGNhc2UgMzg6XG5cdFx0XHRcdGNhc2UgMzk6XG5cdFx0XHRcdGNhc2UgNDA6IHtcblx0XHRcdFx0XHRpZiAoU1RBVFVTX0lTX1ZJU0lCTEUpIHtcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdM+ALnN0YXR1cy5tb3ZlKGUud2hpY2gpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNhc2UgODA6IHtcblx0XHRcdFx0XHRpZiAoT1BUSU9OX0lTX1BSRVNTRUQpIHtcblx0XHRcdFx0XHRcdM+ALnN0YXR1cy50b2dnbGVWaXNpYmlsaXR5KCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBrZXlVcChlKSB7XG5cdFx0XHRzd2l0Y2ggKGUud2hpY2gpIHtcblx0XHRcdFx0Y2FzZSAxODpcblx0XHRcdFx0XHRPUFRJT05fSVNfUFJFU1NFRCA9IGZhbHNlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHJlc2l6ZSgpIHtcblx0XHRcdM+ALnN0YXR1cy5wcm9wcy53aW5XID0gd2luZG93LmlubmVyV2lkdGg7XG5cdFx0XHTPgC5zdGF0dXMucHJvcHMud2luSCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjbGVhbkRlYnVnTGlzdGVuZXJzKCkge1xuXHRcdFx0z4AuY2xlYW4oY2xlYW5EZWJ1Z0xpc3RlbmVycywgJ3VubG9hZCcpO1xuXHRcdFx0z4AuY2xlYW4oz4Auc3RhdHVzLmdldFdpbmRvd1NpemUsICdyZXNpemUnKTtcblx0XHRcdM+ALmNsZWFuKGtleURvd24sICdrZXlkb3duJyk7XG5cdFx0XHTPgC5jbGVhbihrZXlVcCwgJ2tleXVwJyk7XG5cdFx0XHTPgC5jbGVhbihyZXNpemUsICdyZXNpemUnKTtcblx0XHRcdGNsZWFySW50ZXJ2YWwoc3RhdHVzSW50ZXJ2YWwpO1xuXHRcdH1cblxuXHRcdHZhciBzdGF0dXNJbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCl7XG5cdFx0XHQvLyBtYWtlIHN1cmUgd2UncmUgaGlnaGVzdFxuXHRcdFx0dmFyIGhpZ2hlc3RaID0gz4AuaGlnaGVzdFooKTtcblx0XHRcdGlmICjPgFN0YXR1cy5jc3MoKS56SW5kZXggPCBoaWdoZXN0WiAtIDEpIHtcblx0XHRcdFx0z4BTdGF0dXMuY3NzKHt6SW5kZXg6IGhpZ2hlc3RafSk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIG5vdyBpdGVyYXRlIHRoZSBwcm9wc1xuXHRcdFx0dmFyIHByb3BzID0gT2JqZWN0LmtleXMoz4Auc3RhdHVzLnByb3BzKTtcblx0XHRcdHByb3BzLmZvckVhY2goZnVuY3Rpb24ocHJvcCkge1xuXHRcdFx0XHR2YXIgZGl2SWQgPSAnc3RhdHVzUHJvcF8nICsgcHJvcDtcblx0XHRcdFx0dmFyIHByb3BEaXYgPSDPgFN0YXR1cy7PgDEoJyMnICsgZGl2SWQpO1xuXHRcdFx0XHRpZiAoIXByb3BEaXYpIHtcblx0XHRcdFx0XHRwcm9wRGl2ID0gz4AuZGl2KDAsIGRpdklkLCBwcm9wICsgJzogJyk7XG5cdFx0XHRcdFx0cHJvcERpdi5hZGQoz4Auc3BhbigpKTtcblx0XHRcdFx0XHTPgFN0YXR1cy5hZGQocHJvcERpdik7XG5cdFx0XHRcdFx0cHJvcERpdi5vbmNsaWNrID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKHByb3AgKyBcIjpcIik7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyjPgC5zdGF0dXMucHJvcHNbcHJvcF0pO1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRwcm9wRGl2Ls+AMSgnc3BhbicpLmlubmVySFRNTCA9IM+ALnN0YXR1cy5wcm9wc1twcm9wXTtcblx0XHRcdH0pO1xuXHRcdH0sIDEwMCk7XG5cdH1cblxuXHTPgC5tb2RzLnB1c2goaW5pdCk7XG59KSgpOyIsIiAvL21vZGFsIGNsb3NlIGJ1dHRvblxuKGZ1bmN0aW9uKCl7XG5cdM+ALm1vZGFsQ2xvc2VCdXR0b24gPSBmdW5jdGlvbihjbG9zaW5nRnVuY3Rpb24pe1xuXHRcdHJldHVybiDPgC5idXR0b24oJ3BpLW1vZGFsLWNsb3NlLWJ1dHRvbicsIG51bGwsIG51bGwsIGNsb3NpbmdGdW5jdGlvbik7XG5cdH07XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdHZhciB5YWggPSB0cnVlO1xuXHR2YXIgbW92aW5nID0gZmFsc2U7XG5cdHZhciBDU1NfQlJPV1NFUl9ERUxBWV9IQUNLID0gMjU7XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHTPgC5jbGVhbihpbml0KTtcblxuXHRcdC8vIFNhZmFyaSBjaG9rZXMgb24gdGhlIGFuaW1hdGlvbiBoZXJlLCBzby4uLlxuXHRcdGlmIChuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ0Nocm9tZScpID09IC0xICYmIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignU2FmYXJpJykgIT0gLTEpe1xuXHRcdFx0z4AxKCdib2R5JykuYWRkKM+ALmNvbnRlbnRFbGVtZW50KCdzdHlsZScsIDAsIDAsICcucGktYWNjb3JkaW9uIC53cmFwcGVye3RyYW5zaXRpb246IG5vbmV9JykpO1xuXHRcdH1cblx0XHQvLyBHcm9zcy5cblxuXHRcdM+AKCcucGktYWNjb3JkaW9uJykuZm9yRWFjaChmdW5jdGlvbihhY2NvcmRpb24pe1xuXHRcdFx0dmFyIGNvbnRhaW5lciA9IM+ALmRpdignY29udGFpbmVyJywgbnVsbCwgYWNjb3JkaW9uLmlubmVySFRNTCk7XG5cdFx0XHRhY2NvcmRpb24uZmlsbChjb250YWluZXIpO1xuXHRcdFx0UGlBY2NvcmRpb24oY29udGFpbmVyKTtcblx0XHR9KTtcblxuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0eWFoID0gZmFsc2U7XG5cdFx0fSwgNTAwKTtcblx0fVxuXG5cdGZ1bmN0aW9uIFBpQWNjb3JkaW9uKGNvbnRhaW5lcil7XG5cdFx0Y29udGFpbmVyLs+AKCc6c2NvcGUgPiAuaXRlbScpLmZvckVhY2goZnVuY3Rpb24oaXRlbSl7XG5cdFx0XHR2YXIgdGl0bGVUZXh0ID0gaXRlbS5kYXRhc2V0LnRpdGxlO1xuXG5cdFx0XHR2YXIgdGl0bGUgPSDPgC5kaXYoJ3RpdGxlJywgbnVsbCwgdGl0bGVUZXh0KTtcblx0XHRcdHZhciB3cmFwcGVyID0gz4AuZGl2KCd3cmFwcGVyJyk7XG5cdFx0XHR2YXIgY29udGVudCA9IM+ALmRpdignY29udGVudCcsIG51bGwsIGl0ZW0uaW5uZXJIVE1MKTtcblxuXHRcdFx0d3JhcHBlci5maWxsKGNvbnRlbnQpO1xuXHRcdFx0aXRlbS5maWxsKFt0aXRsZSwgd3JhcHBlcl0pO1xuXHRcdFx0d3JhcHBlci5jc3Moe2hlaWdodDogMH0pO1xuXG5cdFx0XHR0aXRsZS5vbmNsaWNrID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0aWYgKCF5YWgpIHtcblx0XHRcdFx0XHRpZiAobW92aW5nKSByZXR1cm47XG5cdFx0XHRcdFx0bW92aW5nID0gdHJ1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChjb250YWluZXIuZGF0YXNldC5zaW5nbGUpIHtcblx0XHRcdFx0XHR2YXIgb3BlblNpYmxpbmdzID0gaXRlbS5zaWJsaW5ncygpLmZpbHRlcihmdW5jdGlvbihzaWIpe3JldHVybiBzaWIuaGFzQ2xhc3MoJ29uJyk7fSk7XG5cdFx0XHRcdFx0b3BlblNpYmxpbmdzLmZvckVhY2goZnVuY3Rpb24oc2libGluZyl7XG5cdFx0XHRcdFx0XHR0b2dnbGVJdGVtKHNpYmxpbmcpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdGlmIChpdGVtLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2EnKSByZXR1cm47XG5cdFx0XHRcdFx0dG9nZ2xlSXRlbShpdGVtKTtcblx0XHRcdFx0fSwgQ1NTX0JST1dTRVJfREVMQVlfSEFDSyk7XG5cdFx0XHR9O1xuXG5cdFx0XHRmdW5jdGlvbiB0b2dnbGVJdGVtKHRoaXNJdGVtKXtcblx0XHRcdFx0dmFyIHRoaXNXcmFwcGVyID0gdGhpc0l0ZW0uz4AxKCcud3JhcHBlcicpO1xuXHRcdFx0XHR2YXIgY29udGVudEhlaWdodCA9IHRoaXNXcmFwcGVyLs+AMSgnLmNvbnRlbnQnKS5vZmZzZXQoKS5oZWlnaHQgKyAncHgnO1xuXG5cdFx0XHRcdGlmICh0aGlzSXRlbS5oYXNDbGFzcygnb24nKSkge1xuXHRcdFx0XHRcdHRoaXNXcmFwcGVyLmNzcyh7aGVpZ2h0OiBjb250ZW50SGVpZ2h0fSk7XG5cdFx0XHRcdFx0dGhpc0l0ZW0ua2lsbENsYXNzKCdvbicpO1xuXHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdHRoaXNXcmFwcGVyLmNzcyh7aGVpZ2h0OiAwfSk7XG5cdFx0XHRcdFx0XHRtb3ZpbmcgPSBmYWxzZTtcblx0XHRcdFx0XHR9LCBDU1NfQlJPV1NFUl9ERUxBWV9IQUNLKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpdGVtLmFkZENsYXNzKCdvbicpO1xuXHRcdFx0XHRcdHRoaXNXcmFwcGVyLmNzcyh7aGVpZ2h0OiBjb250ZW50SGVpZ2h0fSk7XG5cblx0XHRcdFx0XHR2YXIgZHVyYXRpb24gPSBwYXJzZUZsb2F0KHRoaXNXcmFwcGVyLmNzcygpLnRyYW5zaXRpb25EdXJhdGlvbikgKiAxMDAwO1xuXHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdHRoaXNXcmFwcGVyLmNzcyh7aGVpZ2h0OiAnJ30pO1xuXHRcdFx0XHRcdFx0bW92aW5nID0gZmFsc2U7XG5cdFx0XHRcdFx0fSwgZHVyYXRpb24pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHZhciBpbm5lckNvbnRhaW5lcnMgPSBjb250ZW50Ls+AKCc6c2NvcGUgPiAuY29udGFpbmVyJyk7XG5cdFx0XHRpZiAoaW5uZXJDb250YWluZXJzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0aW5uZXJDb250YWluZXJzLmZvckVhY2goUGlBY2NvcmRpb24pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0z4AubW9kcy5wdXNoKGluaXQpO1xufSkoKTtcbiIsIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIM+ALXB1c2htZW51LmpzXG4gLy8gVE9ETzogIFVTQUdFIEFORCBBUEkgUkVGRVJFTkNFXG4gX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xuIERFUEVOREVOQ0lFUzpcblxuIEhBTC5qc1xuXG4gX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xuIERBVEEgQVRUUklCVVRFUzpcblxuIHNpZGU6IFtcImxlZnRcIiwgXCJyaWdodFwiXVxuIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cbiBNQVJLVVAgQU5EIERFRkFVTFRTOlxuXG5cdDxkaXYgY2xhc3M9XCJwaS1wdXNobWVudVwiIGlkPVwibXlQdXNoTWVudVwiPlxuXHRcdCA8dWw+XG5cdFx0XHQgPGxpPjxhIGhyZWY9XCIjXCI+Zm9vPC9hPjwvbGk+XG5cdFx0XHQgPGxpPjxhIGhyZWY9XCIjXCI+YmFyPC9hPjwvbGk+XG5cdFx0XHQgPGxpPjxhIGhyZWY9XCIjXCI+Z3Jvbms8L2E+PC9saT5cblx0XHRcdCA8bGk+PGEgaHJlZj1cIiNcIj5mbGVlYmxlczwvYT48L2xpPlxuXHRcdFx0IDxsaT48YSBocmVmPVwiI1wiPnNlcHVsdmVkYTwvYT48L2xpPlxuXHRcdCA8L3VsPlxuXHQ8L2Rpdj5cblxuZWxzZXdoZXJlLi4uXG5cbiA8YnV0dG9uIG9uY2xpY2s9XCLPgC1wdXNobWVudS5zaG93KCdteVB1c2hNZW51JylcIj5zaG93IG1lbnU8L2J1dHRvbj5cblxuIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cbiBHRU5FUkFURUQgSFRNTDpcblxuXHRcbiBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXG4gQVBJXG5cblxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuz4AucHVzaG1lbnUgPSAoZnVuY3Rpb24oKXtcblx0dmFyIGFsbFB1c2hNZW51cyA9IHt9O1xuXG5cdGZ1bmN0aW9uIGluaXQoKXtcblx0XHTPgCgnW2RhdGEtYXV0by1idXJnZXJdJykuZm9yRWFjaChmdW5jdGlvbihjb250YWluZXIpe1xuXHRcdFx0dmFyIGlkID0gY29udGFpbmVyLmdldEF0dHJpYnV0ZSgnZGF0YS1hdXRvLWJ1cmdlcicpO1xuXG5cdFx0XHR2YXIgYXV0b0J1cmdlciA9IM+AZChpZCkgfHwgz4AuZGl2KCdwaS1wdXNobWVudScsIGlkKTtcblx0XHRcdHZhciB1bCA9IGF1dG9CdXJnZXIuz4AxKCd1bCcpIHx8IM+ALnVsKCk7XG5cblx0XHRcdGNvbnRhaW5lci7PgCgnYVtocmVmXSwgYnV0dG9uJykuZm9yRWFjaChmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHRcdGlmICghYm9vbGVhbkF0dHJpYnV0ZVZhbHVlKG9iaiwgJ2RhdGEtYXV0by1idXJnZXItZXhjbHVkZScsIGZhbHNlKSkge1xuXHRcdFx0XHRcdHZhciBjbG9uZSA9IG9iai5jbG9uZU5vZGUodHJ1ZSk7XG5cdFx0XHRcdFx0Y2xvbmUuaWQgPSAnJztcblxuXHRcdFx0XHRcdGlmIChjbG9uZS50YWdOYW1lID09IFwiQlVUVE9OXCIpIHtcblx0XHRcdFx0XHRcdHZhciBhVGFnID0gz4Auc3JjRWxlbWVudCgnYScpO1xuXHRcdFx0XHRcdFx0YVRhZy5ocmVmID0gJyc7XG5cdFx0XHRcdFx0XHRhVGFnLmlubmVySFRNTCA9IGNsb25lLmlubmVySFRNTDtcblx0XHRcdFx0XHRcdGFUYWcub25jbGljayA9IGNsb25lLm9uY2xpY2s7XG5cdFx0XHRcdFx0XHRjbG9uZSA9IGFUYWc7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHVsLmFkZCjPgC5saSgwLCAwLCBjbG9uZSkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0YXV0b0J1cmdlci5hZGQodWwpO1xuXHRcdFx0z4AxKCdib2R5JykuYWRkKGF1dG9CdXJnZXIpO1xuXHRcdH0pO1xuXG5cdFx0z4AoXCIucGktcHVzaG1lbnVcIikuZm9yRWFjaChmdW5jdGlvbihlbCl7XG5cdFx0XHRhbGxQdXNoTWVudXNbZWwuaWRdID0gUHVzaE1lbnUoZWwpO1xuXHRcdH0pO1xuXG5cdFx0z4Auc2V0VHJpZ2dlcnMoJ3B1c2htZW51Jywgz4AucHVzaG1lbnUpO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2hvdyhvYmpJZCkge1xuXHRcdGFsbFB1c2hNZW51c1tvYmpJZF0uZXhwb3NlKCk7XG5cdH1cblxuXHQvLyBUT0RPOiBkaXNtaXNzIG9uIGNsaWNrP1xuXHQvLyB0aGlzIHdvcmtzOlxuXG5cdC8vz4AoJy5waS1wdXNobWVudSBsaSBhJykuZm9yRWFjaChmdW5jdGlvbihhKXtcblx0Ly9cdGEub25jbGljayA9IGZ1bmN0aW9uKCl7XG5cdC8vXHRcdHRoaXMucGFyZW50KCcucGktcHVzaG1lbnUnKS7PgDEoJy5waS1tb2RhbC1jbG9zZS1idXR0b24nKS5jbGljaygpO1xuXHQvL1x0XHRjb25zb2xlLmxvZyhcIm1lc3NhZ2VcIik7XG5cdC8vXHR9O1xuXHQvL30pO1xuXG5cblx0ZnVuY3Rpb24gUHVzaE1lbnUoZWwpIHtcblx0XHR2YXIgaHRtbCA9IM+AMSgnaHRtbCcpO1xuXHRcdHZhciBib2R5ID0gz4AxKCdib2R5Jyk7XG5cblx0XHR2YXIgb3ZlcmxheSA9IM+ALmRpdihcIm92ZXJsYXlcIik7XG5cdFx0dmFyIGNvbnRlbnQgPSDPgC5kaXYoJ2NvbnRlbnQnLCBudWxsLCBlbC7PgDEoJyonKSk7XG5cblx0XHR2YXIgc2lkZSA9IGVsLmdldEF0dHJpYnV0ZShcImRhdGEtc2lkZVwiKSB8fCBcInJpZ2h0XCI7XG5cblx0XHR2YXIgc2xlZCA9IM+ALmRpdihcInNsZWRcIik7XG5cdFx0c2xlZC5jc3Moc2lkZSwgMCk7XG5cblx0XHR2YXIgdG9wQmFyID0gz4AuZGl2KFwidG9wLWJhclwiKTtcblxuXHRcdHRvcEJhci5maWxsKM+ALm1vZGFsQ2xvc2VCdXR0b24oY2xvc2VNZSkpO1xuXHRcdHNsZWQuZmlsbChbdG9wQmFyLCBjb250ZW50XSk7XG5cblx0XHRvdmVybGF5LmZpbGwoc2xlZCk7XG5cdFx0ZWwuZmlsbChvdmVybGF5KTtcblxuXHRcdHNsZWQub25jbGljayA9IGZ1bmN0aW9uKGUpe1xuXHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHR9O1xuXG5cdFx0b3ZlcmxheS5vbmNsaWNrID0gY2xvc2VNZTtcblxuXHRcdM+ALmxpc3RlbihjbG9zZU1lLCAncmVzaXplJyk7XG5cblx0XHRmdW5jdGlvbiBjbG9zZU1lKGUpIHtcblx0XHRcdHZhciB0ID0gZS50YXJnZXQ7XG5cdFx0XHRpZiAodCA9PSBzbGVkIHx8IHQgPT0gdG9wQmFyKSByZXR1cm47XG5cblx0XHRcdGVsLmtpbGxDbGFzcyhcIm9uXCIpO1xuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRlbC5jc3Moe2Rpc3BsYXk6IFwibm9uZVwifSk7XG5cblx0XHRcdFx0Ym9keS5raWxsQ2xhc3MoXCJvdmVybGF5LW9uXCIpO1xuXHRcdFx0fSwgMzAwKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBleHBvc2VNZSgpe1xuXHRcdFx0Ym9keS5hZGRDbGFzcyhcIm92ZXJsYXktb25cIik7IC8vIGluIHRoZSBkZWZhdWx0IGNvbmZpZywga2lsbHMgYm9keSBzY3JvbGxpbmdcblxuXHRcdFx0ZWwuY3NzKHtcblx0XHRcdFx0ZGlzcGxheTogXCJibG9ja1wiLFxuXHRcdFx0XHR6SW5kZXg6IM+ALmhpZ2hlc3RaKClcblx0XHRcdH0pO1xuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRlbC5hZGRDbGFzcyhcIm9uXCIpO1xuXHRcdFx0fSwgMTApO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHRleHBvc2U6IGV4cG9zZU1lXG5cdFx0fTtcblx0fVxuXG5cdM+ALm1vZHMucHVzaChpbml0KTtcblxuXHRyZXR1cm4ge1xuXHRcdHNob3c6IHNob3dcblx0fTtcbn0pKCk7XG4iLCJ2YXIga3ViID0gKGZ1bmN0aW9uICgpIHtcblx0z4AubGlzdGVuKGluaXQpO1xuXG5cdHZhciBIRUFERVJfSEVJR0hUO1xuXHR2YXIgaHRtbCwgYm9keSwgbWFpbk5hdiwgcXVpY2tzdGFydEJ1dHRvbiwgd2lzaEZpZWxkO1xuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0z4AuY2xlYW4oaW5pdCk7XG5cblx0XHRodG1sID0gz4AxKCdodG1sJyk7XG5cdFx0Ym9keSA9IM+AMSgnYm9keScpO1xuXHRcdG1haW5OYXYgPSDPgGQoXCJtYWluTmF2XCIpO1xuXHRcdHdpc2hGaWVsZCA9IM+AZCgnd2lzaEZpZWxkJyk7XG5cdFx0SEVBREVSX0hFSUdIVCA9IM+AMSgnaGVhZGVyJykub2Zmc2V0KCkuaGVpZ2h0O1xuXG5cdFx0cXVpY2tzdGFydEJ1dHRvbiA9IM+AZCgncXVpY2tzdGFydEJ1dHRvbicpO1xuXG5cdFx0YnVpbGRJbmxpbmVUT0MoKTtcblxuXHRcdHNldFlBSCgpO1xuXG5cblx0XHRhZGp1c3RFdmVyeXRoaW5nKCk7XG5cblx0XHTPgC5saXN0ZW4oYWRqdXN0RXZlcnl0aGluZywgJ3Jlc2l6ZScpO1xuXHRcdM+ALmxpc3RlbihhZGp1c3RFdmVyeXRoaW5nLCAnc2Nyb2xsJyk7XG5cdFx0z4AubGlzdGVuKGhhbmRsZUtleXN0cm9rZXMsICdrZXlkb3duJyk7XG5cdFx0d2lzaEZpZWxkLmxpc3RlbihoYW5kbGVLZXlzdHJva2VzLCAna2V5ZG93bicpO1xuXG5cdFx0ZG9jdW1lbnQub251bmxvYWQgPSBmdW5jdGlvbigpe1xuXHRcdFx0z4AuY2xlYW4oYWRqdXN0RXZlcnl0aGluZywgJ3Jlc2l6ZScpO1xuXHRcdFx0z4AuY2xlYW4oYWRqdXN0RXZlcnl0aGluZywgJ3Njcm9sbCcpO1xuXHRcdFx0z4AuY2xlYW4oaGFuZGxlS2V5c3Ryb2tlcywgJ2tleWRvd24nKTtcblx0XHRcdHdpc2hGaWVsZC5jbGVhbihoYW5kbGVLZXlzdHJva2VzLCAna2V5ZG93bicpO1xuXHRcdH07XG5cblx0XHTPgC5saXN0ZW4oY2xvc2VPcGVuTWVudSwgJ3Jlc2l6ZScpO1xuXG5cdFx0ZnVuY3Rpb24gY2xvc2VPcGVuTWVudSgpIHtcblx0XHRcdGlmIChodG1sLmhhc0NsYXNzKCdvcGVuLW5hdicpKSB0b2dnbGVNZW51KCk7XG5cdFx0fVxuXG5cdFx0z4AoJy5kcm9wZG93bicpLmZvckVhY2goZnVuY3Rpb24oZHJvcGRvd24pIHtcblx0XHRcdHZhciByZWFkb3V0ID0gZHJvcGRvd24uz4AxKCcucmVhZG91dCcpO1xuXHRcdFx0cmVhZG91dC5pbm5lckhUTUwgPSBkcm9wZG93bi7PgDEoJ2EnKS5pbm5lckhUTUw7XG5cdFx0XHRyZWFkb3V0Lm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGRyb3Bkb3duLnRvZ2dsZUNsYXNzKCdvbicpO1xuXHRcdFx0XHTPgC5saXN0ZW4oY2xvc2VPcGVuRHJvcGRvd24sICdjbGljaycpO1xuXG5cdFx0XHRcdGZ1bmN0aW9uIGNsb3NlT3BlbkRyb3Bkb3duKGUpIHtcblx0XHRcdFx0XHRpZiAoZHJvcGRvd24uaGFzQ2xhc3MoJ29uJykgJiYgIShkcm9wZG93bldhc0NsaWNrZWQoZSkpKSB7XG5cdFx0XHRcdFx0XHTPgC5jbGVhbihjbG9zZU9wZW5Ecm9wZG93biwgJ2NsaWNrJyk7XG5cdFx0XHRcdFx0XHRkcm9wZG93bi5raWxsQ2xhc3MoJ29uJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZnVuY3Rpb24gZHJvcGRvd25XYXNDbGlja2VkKGUpIHtcblx0XHRcdFx0XHRyZXR1cm4gZS50YXJnZXQuaXNIZWlyT2ZDbGFzcygnZHJvcGRvd24nKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9KTtcblxuXHRcdHNldEludGVydmFsKHNldEZvb3RlclR5cGUsIDEwKTtcblx0fVxuXG5cdHZhciB0b2NDb3VudCA9IDA7XG5cblx0ZnVuY3Rpb24gYnVpbGRJbmxpbmVUT0MoKSB7XG5cdFx0dmFyIGRvY3NDb250ZW50ID0gz4BkKCdkb2NzQ29udGVudCcpO1xuXHRcdHZhciBwYWdlVE9DID0gz4BkKCdwYWdlVE9DJyk7XG5cblx0XHRpZiAocGFnZVRPQykge1xuXHRcdFx0dmFyIGhlYWRlcnMgPSBkb2NzQ29udGVudC5raWRzKCcjcGFnZVRPQywgaDEsIGgyLCBoMywgaDQsIGg1LCBoNicpO1xuXHRcdFx0aGVhZGVycy5zcGxpY2UoMCwgaGVhZGVycy5pbmRleE9mKHBhZ2VUT0MpICsgMSk7XG5cblx0XHRcdHZhciB0b2MgPSDPgC51bCgpO1xuXHRcdFx0cGFnZVRPQy5hZGQodG9jKTtcblxuXHRcdFx0aGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uIChoZWFkZXIpIHtcblx0XHRcdFx0aGVhZGVyLmFkZENsYXNzKCdhbmNob3JlZCcpO1xuXHRcdFx0XHR2YXIgYW5jaG9yTmFtZSA9ICdwYWdlVE9DJyArIHRvY0NvdW50Kys7XG5cblx0XHRcdFx0dmFyIGxpbmsgPSDPgC5jb250ZW50RWxlbWVudCgnYScsIDAsIDAsIGhlYWRlci5pbm5lckhUTUwpO1xuXHRcdFx0XHRsaW5rLmhyZWYgPSAnIycgKyBhbmNob3JOYW1lO1xuXHRcdFx0XHRsaW5rLmFkZENsYXNzKGhlYWRlci50YWdOYW1lKTtcblxuXHRcdFx0XHR2YXIgYW5jaG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuXHRcdFx0XHRhbmNob3IuYWRkQ2xhc3MoJ3BhZ2VBbmNob3InKTtcblx0XHRcdFx0YW5jaG9yLm5hbWUgPSBhbmNob3JOYW1lO1xuXHRcdFx0XHRkb2NzQ29udGVudC5pbnNlcnRCZWZvcmUoYW5jaG9yLCBoZWFkZXIpO1xuXG5cdFx0XHRcdHRvYy5hZGQoz4AubGkoMCwgMCwgbGluaykpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gc2V0WUFIKCkge1xuXHRcdHZhciBwYXRobmFtZSA9IGxvY2F0aW9uLmhyZWY7XG5cblx0XHR2YXIgY3VycmVudExpbmsgPSBudWxsO1xuXG5cdFx0z4BkKCdkb2NzVG9jJykuz4AoJ2EnKS5mb3JFYWNoKGZ1bmN0aW9uIChsaW5rKSB7XG5cdFx0XHRpZiAocGF0aG5hbWUuaW5kZXhPZihsaW5rLmhyZWYpICE9PSAtMSkge1xuXHRcdFx0XHRjdXJyZW50TGluayA9IGxpbms7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRpZiAoY3VycmVudExpbmspIHtcblx0XHRcdGN1cnJlbnRMaW5rLnBhcmVudHMoJ2Rpdi5pdGVtJykuZm9yRWFjaChmdW5jdGlvbiAocGFyZW50KSB7XG5cdFx0XHRcdHBhcmVudC7PgDEoJy50aXRsZScpLmNsaWNrKCk7XG5cdFx0XHRcdGN1cnJlbnRMaW5rLmFkZENsYXNzKCd5YWgnKTtcblx0XHRcdFx0Y3VycmVudExpbmsub25jbGljayA9IGZ1bmN0aW9uKGUpe2UucHJldmVudERlZmF1bHQoKTt9O1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gc2V0Rm9vdGVyVHlwZSgpIHtcblx0XHRpZiAoaHRtbC5pZCA9PSBcImRvY3NcIikge1xuXHRcdFx0dmFyIGJvZHlIZWlnaHQgPSDPgGQoJ2hlcm8nKS5vZmZzZXQoKS5oZWlnaHQgKyDPgGQoJ2VuY3ljbG9wZWRpYScpLm9mZnNldCgpLmhlaWdodDtcblx0XHRcdHZhciBmb290ZXIgPSDPgDEoJ2Zvb3RlcicpO1xuXHRcdFx0dmFyIGZvb3RlckhlaWdodCA9IGZvb3Rlci5vZmZzZXQoKS5oZWlnaHQ7XG5cdFx0XHRib2R5LmNsYXNzT25Db25kaXRpb24oJ2ZpeGVkJywgd2luZG93LmlubmVySGVpZ2h0IC0gZm9vdGVySGVpZ2h0ID4gYm9keUhlaWdodCk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gYWRqdXN0RXZlcnl0aGluZygpIHtcblx0XHRpZiAoIWh0bWwuaGFzQ2xhc3MoJ29wZW4tbmF2JykpIEhFQURFUl9IRUlHSFQgPSDPgDEoJ2hlYWRlcicpLm9mZnNldCgpLmhlaWdodDtcblx0XHRodG1sLmNsYXNzT25Db25kaXRpb24oJ2ZsaXAtbmF2Jywgd2luZG93LnBhZ2VZT2Zmc2V0ID4gMCk7XG5cdH1cblxuXHRmdW5jdGlvbiB0b2dnbGVNZW51KCkge1xuXHRcdGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IDgwMCkge1xuXHRcdFx0z4AucHVzaG1lbnUuc2hvdygncHJpbWFyeScpO1xuXHRcdH1cblxuXHRcdGVsc2Uge1xuXHRcdFx0dmFyIG5ld0hlaWdodCA9IEhFQURFUl9IRUlHSFQ7XG5cblx0XHRcdGlmICghaHRtbC5oYXNDbGFzcygnb3Blbi1uYXYnKSkge1xuXHRcdFx0XHRuZXdIZWlnaHQgPSBtYWluTmF2Lm9mZnNldCgpLmhlaWdodDtcblx0XHRcdH1cblxuXHRcdFx0z4AxKCdoZWFkZXInKS5jc3Moe2hlaWdodDogcHgobmV3SGVpZ2h0KX0pO1xuXHRcdH1cblxuXHRcdGh0bWwudG9nZ2xlQ2xhc3MoJ29wZW4tbmF2Jyk7XG5cdH1cblxuXHRmdW5jdGlvbiBzdWJtaXRXaXNoKHRleHRmaWVsZCkge1xuXHRcdHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKFwiaHR0cHM6Ly9naXRodWIuY29tL2t1YmVybmV0ZXMva3ViZXJuZXRlcy5naXRodWIuaW8vaXNzdWVzL25ldz90aXRsZT1JJTIwd2lzaCUyMFwiICtcblx0XHRcdHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArIFwiJTIwXCIgKyB0ZXh0ZmllbGQudmFsdWUgKyBcIiZib2R5PUklMjB3aXNoJTIwXCIgK1xuXHRcdFx0d2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgXCIlMjBcIiArIHRleHRmaWVsZC52YWx1ZSk7XG5cblx0XHR0ZXh0ZmllbGQudmFsdWUgPSAnJztcblx0XHR0ZXh0ZmllbGQuYmx1cigpO1xuXHR9XG5cblx0ZnVuY3Rpb24gaGFuZGxlS2V5c3Ryb2tlcyhlKSB7XG5cdFx0c3dpdGNoIChlLndoaWNoKSB7XG5cdFx0XHRjYXNlIDEzOiB7XG5cdFx0XHRcdGlmIChlLmN1cnJlbnRUYXJnZXQgPT09IHdpc2hGaWVsZCkge1xuXHRcdFx0XHRcdHN1Ym1pdFdpc2god2lzaEZpZWxkKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblxuXHRcdFx0Y2FzZSAyNzoge1xuXHRcdFx0XHRpZiAoaHRtbC5oYXNDbGFzcygnb3Blbi1uYXYnKSkge1xuXHRcdFx0XHRcdHRvZ2dsZU1lbnUoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdHRvZ2dsZU1lbnU6IHRvZ2dsZU1lbnVcblx0fTtcbn0pKCk7XG5cbi8vIFRPRE86IHNjcm9sbGludG92aWV3IGluLXBhZ2UgVE9DIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
