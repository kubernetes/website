// adorable little functions
//
// NO DEPENDENCIES PERMITTED! ALL MUST BE 'ON THE METAL'!!!

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

function deepCopy(obj) {
	// make new references for an array/object and all its complex children
	var value, key, output = Array.isArray(obj) ? [] : {};
	for (key in obj) {
		value = obj[key];
		output[key] = (typeof value === "object") ? copy(value) : value;
	}
	return output;
}

function millisecondsForTransition(element, transitionProperty){
	// returns the millis for a css transition duration + delay
	//e.g. millisecondsForTransition(el, 'transform')

	var styles = getComputedStyle(element);
	var idx = styles.transitionProperty.split(', ').indexOf(transitionProperty);

	return (parseFloat(styles.transitionDuration.split(', ')[idx]) + parseFloat(styles.transitionDelay.split(', ')[idx])) * 1000;
}

function pct(n) {
	return n + '%';
}

function px(n){
	return n + 'px';
}

var π, π1, πd;
(function(){
	/***********************************************
	 ***********************************************
	 ****
	 ****  π CORE
	 ****
	 ***********************************************
	 ***********************************************/
	var d = document;
	d.g = d.getElementById;
	d.q = d.querySelector;
	d.a = d.querySelectorAll;
	d.t = d.getElementsByTagName;

	π = function(selector) {
		return d.a(selector);
	};

	π1 = function (selector) {
		return d.q(selector);
	};

	πd = function(id) {
		return d.g(id);
	};

	/***********************************************
	 ***********************************************
	 ****
	 ****  DOM ELEMENT CREATION/INITIALIZATION
	 ****
	 ***********************************************
	 ***********************************************/

		// this is the base create/init method, e.g
		// newDomElement('p', 'article-content', 'theFirstOfMany')
	π.newDOMElement = function(tagName, className, id) {
		var el = d.createElement(tagName);

		if (className)
			el.className = className;

		if (id)
			el.id = id;

		return el;
	};

// base element with content passed in, e.g
// π.contentElement('p', 'article-content', 'theFirstOfMany', '<span>foo to the bar to the gronk</span>')
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

// base element with src attribute, e.g
// srcElement('img', 'article-thumb', 'happyLogo', '/images/happyLogo.png')
	π.srcElement = function(tagName, className, id, src)
	{
		var el = π.newDOMElement(tagName, className, id);

		if (src)
			el.src = src;

		return el;
	};


	/***********************************************
	 ****
	 ****  SHORTHAND CREATE/INIT METHODS
	 ****
	 ***********************************************/

	π.button = function(className, id, content, action){
		var el = π.contentElement("button", className, id, content);
		el.onclick = action;
		return el;
	};

	π.input = function(typeName, className, placeholder, value, checked, disabled)
	{
		var el = document.createElement("input");
		el.type = typeName;
		el.className = className || '';
		el.placeholder = placeholder || '';
		el.value = value || '';
		el.checked = checked || '';
		el.disabled = disabled || '';
		return el;
	};

	π.option = function(className, content, value, selected){
		var el = π.contentElement("option", className, null, content);
		el.value = value || null;
		el.selected = selected || null;
		return el;
	};

	π.textarea = function(className, placeholder, value) {
		var el = document.createElement("textarea");
		el.className = className || '';
		el.placeholder = placeholder || '';
		el.value = value || '';
		return el;
	};

	π.clear = function(){ return π.newDOMElement("clear"); };
	π.div = function(className, id, content){ return π.contentElement("div", className, id, content); };
	π.h1 = function(className, id, content){ return π.contentElement("h1", className, id, content); };
	π.h2 = function(className, id, content){ return π.contentElement("h2", className, id, content); };
	π.h3 = function(className, id, content){ return π.contentElement("h3", className, id, content); };
	π.h4 = function(className, id, content){ return π.contentElement("h4", className, id, content); };
	π.h5 = function(className, id, content){ return π.contentElement("h5", className, id, content); };
	π.h6 = function(className, id, content){ return π.contentElement("h6", className, id, content); };
	π.iframe = function(className, id, src){ return π.srcElement("iframe", className, id, src); };
	π.img = function(className, id, src){ return π.srcElement("Img", className, id, src); };
	π.header = function(className, id, content){ return π.contentElement("header", className, id, content); };
	π.nav = function(className, id, content){ return π.contentElement("nav", className, id, content); };
	π.p = function(className, id, content){ return π.contentElement("p", className, id, content); };
	π.section = function(className, id, content){ return π.contentElement("section", className, id, content); };
	π.span = function(className, id, content){ return π.contentElement("span", className, id, content); };
	π.ul = function(className, id, content){ return π.contentElement("ul", className, id, content); };
	π.li = function(className, id, content){ return π.contentElement("li", className, id, content); };

	/********************************************************************
	 ****
	 ****  HTMLELEMENT/NODE PROTOTYPE METHODS (jquery-izations)
	 ****
	 ********************************************************************/

	HTMLElement.prototype.wrap = Node.prototype.wrap = function(content){
		var wrapper = this;
		if (!content.forEach) content = [content];

		var parent = content[0].parentNode;
		parent.insertBefore(wrapper, content[0]);

		content.forEach(function(el){
			wrapper.appendChild(el);
		});
	};



	HTMLElement.prototype.prepend = Node.prototype.prepend = function(el){
		this.insertBefore(el, this.childNodes[0]);
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

// like d.g, but for child elements
	HTMLElement.prototype.πd = Node.prototype.πd = function(id) {
		return this.getElementById(id);
	};

// like d.q, but for child elements
	HTMLElement.prototype.π1 = Node.prototype.π1 = function(selector) {
		return this.querySelector(selector);
	};

// like d.a, but for child elements
	HTMLElement.prototype.π = Node.prototype.π = function(selector) {
		return this.querySelectorAll(selector);
	};

// only direct descendents, with optional selector
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
		/*
		 *   3 signatures:
		 *   1. el.css()
		 *      returns getComputedStyle(el)
		 *
		 *   2. el.css({ruleName: value})
		 *
		 *   3. el.css('ruleName', 'value')
		 */
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

// just like it sounds
	HTMLElement.prototype.index = Node.prototype.index = function() {
		return this.parentNode.childNodes.indexOf(this);
	};

// just like it sounds
	HTMLElement.prototype.empty = Node.prototype.empty = function() {
		this.innerHTML = "";
	};

// replaces — DOES NOT APPEND — element's innerHTML with content or array of contents
	HTMLElement.prototype.fill = Node.prototype.fill = function(content) {
		/*
		 *   2 uses:
		 *
		 *   1. el.fill(object or hmtl)
		 *
		 *   2. el.fill([arrray])
		 *
		 */
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

// just like it sounds, with all 3 approaches
	HTMLElement.prototype.hide = Node.prototype.hide = function() {
		this.style.opacity = 0;
		this.style.visibility = "hidden";
		this.style.display = "none";
	};

// looks for a given class on the entire linear ancestry
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

// kills the element itself
	HTMLElement.prototype.kill = Node.prototype.kill = function() {
		if (this.parentNode) {
			this.parentNode.removeChild(this);
		}
	};

// just like it sounds, and can optionally set display type to "inline-block", etc.
	HTMLElement.prototype.show = Node.prototype.show = function(showType) {
		this.style.opacity = 1;
		this.style.visibility = "visible";
		this.style.display = showType || "block";
	};


	HTMLElement.prototype.parent = Node.prototype.parent = function (selector) {
		var immediateParent = this.parentNode;

		if (!selector || π(selector).indexOf(immediateParent) !== -1) {
			return immediateParent;
		}

		return immediateParent.parent(selector);
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

// simple mobile l/r swipe handling
	HTMLElement.prototype.addSwipes = function (swipeLeftHandler, swipeRightHandler, options) {
		var startX,
			startY,
			startTime,
			moving,
			MIN_X_DELTA = options ? (options.xThresh || 30) : 30,
			MAX_Y_DELTA = options ? (options.yThresh || 30) : 30,
			MAX_ALLOWED_TIME = options ? (options.duration || 1000) : 1000;

		this.addEventListener('touchstart', function(e){
			if (moving) return;

			var touchobj = e.changedTouches[0];
			startX = touchobj.pageX;
			startY = touchobj.pageY;
			startTime = new Date().getTime(); // get time when finger first makes contact with surface
		}, true);

		this.addEventListener('touchmove', function(e){
			if (moving) return;

			var touchobj = e.changedTouches[0];
			var deltaX = touchobj.pageX - startX;

			// check Y validity
			if (Math.abs(touchobj.pageY - startY) > MAX_Y_DELTA) return;

			// check elapsed time
			if ((new Date().getTime() - startTime) > MAX_ALLOWED_TIME) return;

			// check X validity
			if (Math.abs(deltaX) < MIN_X_DELTA) return;

			moving = true;

			if (deltaX < 0) // swipe left
				swipeLeftHandler();
			else // swipe right
				swipeRightHandler();

			setTimeout(function(){
				moving = false;
			}, 300);
		}, false);
	};

	/***********************************************
	 ****
	 ****  NODELIST/ARRAY METHODS
	 ****
	 ***********************************************/

	Array.prototype.hasClass = NodeList.prototype.hasClass = function (className) {
		var found = false;

		this.forEach(function (obj) {
			if (obj.hasClass(className)) found = true;
		});

		return found;
	};

	Array.prototype.addClass = NodeList.prototype.addClass = function (className) {
		this.forEach(function (obj) {
			obj.addClass(className);
		});
	};

	Array.prototype.killClass = NodeList.prototype.killClass = function (className) {
		this.forEach(function (obj) {
			obj.killClass(className);
		});
	};

	Array.prototype.toggleClass = NodeList.prototype.toggleClass = function (className) {
		this.forEach(function (obj) {
			obj.toggleClass(className);
		});
	};

	Array.prototype.lastIdx = function() {
		return this.length - 1;
	};

	Array.prototype.lastObj = function() {
		return this[this.lastIdx()];
	};

	var arrayMethods = Object.getOwnPropertyNames(Array.prototype);
	arrayMethods.forEach(function(methodName){
		if(methodName !== "length") {
			NodeList.prototype[methodName] = Array.prototype[methodName];
		}
	});

	NodeList.prototype.css = function(ruleOrObject, rule, value) {
		this.forEach(function(obj){
			obj.css(ruleOrObject, rule, value);
		});
	};

	NodeList.prototype.π = function(selector) {
		this.forEach(function (node){
			return node.π(selector);
		});
	};

	NodeList.prototype.π1 = function(selector) {
		this.forEach(function (node){
			return node.π1(selector);
		});
	};

	NodeList.prototype.onclick = function(method){
		this.forEach(function(node){
			node.onclick = method;
		});
	};

	/***********************************************
	 ****
	 ****  STRING METHODS
	 ****
	 ***********************************************/

	String.prototype.camelCase = function () {
		var string = this.replace(/[^a-zA-Z\d\s_-]/g, "").toLowerCase();

		var components = string.split(" ");

		components.forEach(function(thisWord, idx){
			if (idx !== 0) {
				var firstLetter = thisWord.charAt(0).toUpperCase();
				thisWord = firstLetter + thisWord.slice(1);
			}

			components[idx] = thisWord;
		});

		return components.join("");
	};



	String.prototype.capitalCase = function() {
		var components = this.toLowerCase().split(" ");

		components.forEach(function(thisWord, idx){
			var firstLetter = thisWord.charAt(0).toUpperCase();
			components[idx] = firstLetter + thisWord.slice(1);
		});

		return components.join(" ");
	};

	/***********************************************
	 ****
	 ****  DATE METHODS
	 ****
	 ***********************************************/

// Mon Jan 1 2015 12:00:00 am
	Date.prototype.standardString = function() {
		var Days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		var Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

		var day = Days[this.getDay()];
		var month = Months[this.getMonth()];
		var aDate = this.getDate();
		var year = this.getFullYear();

		var Hours = this.getHours();
		var hour = Hours > 12 ? Hours - 12 : (Hours || 12);

		var Minutes = this.getMinutes();
		var minute = Minutes > 9 ? Minutes : "0" + Minutes;

		var amPm = Hours < 12 ? "am" : "pm";

		var time = hour + ":" + minute + " " + amPm;

		var output = [day, month, aDate, year, time];

		return output.join(" ");
	};


	/***********************************************
	 ****
	 ****  MISCELLANY
	 ****
	 ***********************************************/

	π.clean = function(callback, eventName) {
		window.removeEventListener(eventName || "DOMContentLoaded", callback);
	};

	π.listen = function(callback, eventName) {
		window.addEventListener(eventName || "DOMContentLoaded", callback);
	};

	π.highestZ = function() {
		var Z = 1000;

		d.a("*").forEach(function(el){
			var thisZ = el.css().zIndex;

			if (thisZ != "auto") {
				if (thisZ > Z) Z = thisZ + 1;
			}
		});

		return Z;
	};

	/***********************************************
	 ****
	 ****  OK, NOW LET'S GO GET OUR MODS
	 ****
	 ***********************************************/

	π.mods = [];

	π.setTriggers = function(selector, object){
		selector = 'pi-' + selector + '-trigger';
		π('[' + selector + ']').forEach(function(trigger){
			trigger.onclick = function(){
				object.show(trigger.getAttribute(selector));
			};
		});
	};

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
		if (!message) {
			var n = Math.floor(Math.random() * messages.length );
			message = messages[n];
		}

		message = "**  " + message.replace(/\n/g, "\n**  ");

		var output = "*****************************\n*****************************\n\n" +
			( message || messages[n] ) +
			"\n\n*****************************\n*****************************";

		(innocuous) ? console.log(output) : console.error(output);
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
						break;
					}
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
					}
				}

				propDiv.π1('span').innerHTML = π.status.props[prop];
			});
		}, 100);
	}

	π.mods.push(init);
})();
// modal close button
(function(){
	π.modalCloseButton = function(closingFunction){
		return π.button('pi-modal-close-button', null, null, closingFunction);
	};
})();


// modal overlay
(function(){
	π.modalOverlay = {
		show: function(id, openingFunction){
			var overlay = πd(id);
			overlay.css({display: 'block', zIndex: π.highestZ()});

			π.listen(listenForEsc, 'keydown');
			π.listen(handleOverlayClick, 'click');

			setTimeout(function(){
				overlay.addClass('on');
				π1('body').addClass('overlay-on');

				if (openingFunction) openingFunction();
			}, 50);
		},
		hide: function(el, closingFunction){
			if (!el) {
				el = π1('.pi-modal-overlay.on');
			}

			el.killClass('on');
			var duration = parseFloat(el.css().transitionDuration) * 1000;

			π.clean(listenForEsc, 'keydown');

			setTimeout(function(){
				el.css({display: 'none'});
				π1('body').killClass('overlay-on');

				π1('iframe').src = '';

				if (closingFunction) closingFunction();
			}, duration);
		},
		spawn: function(el, closingFunction){
			el.add(π.modalCloseButton(function(){
				π.modalOverlay.hide(el);
			}));
		}
	};

	function handleOverlayClick(e) {
		if (e.target !== window && π1('body').hasClass('overlay-on')) {
			if (e.target.hasClass('pi-modal-overlay')) {
				π.modalOverlay.hide();
			}
		}
	}

	function listenForEsc(e) {
		if (e.which == 27) π.modalOverlay.hide();
	}

	function init(){
		π('.pi-modal-overlay').forEach(π.modalOverlay.spawn);
		π.setTriggers('modal-overlay', π.modalOverlay);
	}

	π.mods.push(init);
})();


// multiFrameDisplay
// TODO: arrow keys
(function(){
	function spawn(el){
		var dataset = el.dataset;

		var options = {
			modal: booleanAttributeValue(el, 'data-modal', false),
			prevNext: booleanAttributeValue(el, 'data-prev-next', true),
			pager: booleanAttributeValue(el, 'data-pager', false),
			cycle: booleanAttributeValue(el, 'data-cycle', true),
			autoplay: booleanAttributeValue(el, 'data-autoplay', false)
		};

		var itemWrapper = π.div('item-wrapper');
		var pager = options.pager ? π.div('pager') : null;

		el.π(':scope > .item').forEach(function(item){
			itemWrapper.add(item);
			if (pager) {
				if (!el.π1('.pager')) {
				}
				var pagerButton = π.button('pager-button', null, null, pagerClick);
				pager.add(pagerButton);
			}
		});

		el.fill([itemWrapper, pager]);

		if (options.prevNext) {
			var prevButton = π.button('prev-button');
			var nextButton = π.button('next-button');

			el.add([prevButton, nextButton]);
		}

		if (options.autoplay) {
			options.delay = dataset.delay || 4000;
		}

		// TODO: autoplay / start / stop

		prevButton.onclick = prev;
		nextButton.onclick = next;

		if (el.hasClass('pi-rotator')) {
			var inheritanceObject = {
				el: el,
				options: options
			};
			π.rotator.spawn(inheritanceObject);
		}

		if (options.modal) {
			var modalWrapper = π.div('pi-modal-overlay');
			modalWrapper.id = el.id;
			el.removeAttribute('id');
			modalWrapper.wrap(el);
			π.modalOverlay.spawn(modalWrapper);
		}

		var moving;

		var allFrames = itemWrapper.childNodes;
		changeFrame(0, 0);


		function prev(){
			changeFrame(-1);
		}

		function next(){
			changeFrame(1);
		}

		function pagerClick(){
			changeFrame(null, this.index());
		}

		function changeFrame(delta, incomingIdx) {
			if (moving) return;
			moving = true;

			var currentFrame = itemWrapper.π1('.on');

			if (!delta && currentFrame) {
				// pager click — return if clicked on YAH
				if (currentFrame.index() === incomingIdx) {
					console.log("message");
					moving = false;
					return;
				}
			} else if (delta) {
				// conditionally set incomingIdx to wrap around
				incomingIdx = currentFrame.index() + delta;

				if (incomingIdx < 0)
					incomingIdx = allFrames.lastIdx();
				else if (incomingIdx >= allFrames.length)
					incomingIdx = 0
			}

			// conditionally hide prev or next
			if (!options.cycle) {
				(incomingIdx == 0) ? prevButton.hide() : prevButton.show();
				(incomingIdx == allFrames.lastIdx()) ? nextButton.hide() : nextButton.show();
			}

			// set pager YAH state
			if (options.pager) {
				pager.π('.yah').killClass('yah');
				pager.childNodes[incomingIdx].addClass('yah');
			}

			// pass to "subclasses"
			var inheritanceObject = {
				el: el,
				currentFrame: currentFrame,
				incomingFrame: allFrames[incomingIdx]
			};

			// change frame:    **************************** SUBCLASSES ENTER HERE!!!!! ****************************
			if (el.hasClass('pi-crossfader')) {
				π.crossfader.changeFrame(inheritanceObject);
			}

			else if (el.hasClass('pi-rotator')) {
				inheritanceObject.pagerClicked = delta ? false : true;
				inheritanceObject.cycle = options.cycle;
				π.rotator.changeFrame(inheritanceObject);
			}

			else {
				if(currentFrame) currentFrame.killClass('on');
				inheritanceObject.incomingFrame.addClass('on');
			}

			// wait before re-enabling
			var duration = 1000; // default for firstRun

			if (currentFrame) {
				try {
					duration = currentFrame.css().transitionDuration.split(", ").reduce(function(prev, current){
						return Math.max(parseFloat(prev), parseFloat(current));
					}) * 1000;
				}
				catch(e) {
					π.HAL.say(0, 'π-rotator needs you to transition a css transform to make your items move.');
					return;
				}
			}

			setTimeout(function(){
				moving = false;
			}, duration);
		}
	}

	function show(id){
		var mfd = πd(id);
		if (mfd.hasClass('pi-modal-overlay')) {
			π.modalOverlay.show(id);
		}
	}

	function hide(id){
		var mfd = πd(id);
		if (mfd.hasClass('pi-modal-overlay')) {
			π.modalOverlay.hide(id, function(){
				console.log("we just hid an overlay");
			});
		}
	}

	function init() {
		π('.pi-multi-frame-display').forEach(π.multiFrameDisplay.spawn);
		π.setTriggers('multi-frame-display', π.multiFrameDisplay);
	}

	π.multiFrameDisplay = {
		show: show,
		hide: hide,
		spawn: spawn
	};


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

/********************************************************************
 π-accordion.JS
 USAGE AND API REFERENCE
 ______________________________________________
 DATA ATTRIBUTES:

	title: text that appears on the clickable label
    single: more than one child open at a time?
 ______________________________________________
 MARKUP AND DEFAULTS:

   <div class="pi-accordion" id="myAccordion">
      <div class="item" data-title="Item 1">
         This is the content for Item 1
      </div>
      <div class="item" data-title="Item 2">

         <!-- nested accordion -->
         <div class="container" id="myAccordion">
            <div class="item" data-title="Item 1">
               This is the content for Item 1
            </div>
            <div class="item" data-title="Item 2">
               This is the content for Item 2
            </div>
         </div>
         <!-- /nested accordion -->

      </div>
   </div>

 ______________________________________________
 GENERATED HTML:

<div class="pi-accordion" id="myAccordion">
	<div class="container">
		<div class="item" data-title="Item 1">
            <div class="title">Item 1</div>
            <div class="wrapper" style="height: 0px;">
                <div class="content">
					This is the content for Item 1
				</div>
            </div>
        </div>
		<div class="item" data-title="Item 2">
            <div class="title">Item 2</div>
            <div class="wrapper" style="height: 0px;">
                <div class="content">
					 <div class="container">
						 [ NESTED CODE IS IDENTICAL ]
                    </div>
				</div>
            </div>
        </div>
	</div>
 </div>
 ______________________________________________
 API

 none
 ***************************************************************************************/
(function(){
	var moving = false;
	var CSS_BROWSER_DELAY_HACK = 25;

	function init() {
		π.clean(init);

		// TODO: runloop to animate in Safari. meantime:
		if (navigator.userAgent.indexOf('Chrome') == -1 && navigator.userAgent.indexOf('Safari') != -1){
			π1('body').add(π.contentElement('style', 0, 0, '.pi-accordion .wrapper{transition: none}'));
		}
		// Gross.




		π('.pi-accordion').forEach(function(accordion){
			var container = π.div('container', null, accordion.innerHTML);
			accordion.fill(container);
			PiAccordion(container);
		});
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
				if (moving) return;
				moving = true;

				if (container.dataset.single) {
					var openSiblings = item.siblings().filter(function(sib){return sib.hasClass('on')});
					openSiblings.forEach(function(sibling){
						toggleItem(sibling);
					});
				}

				setTimeout(function(){
					toggleItem(item);
				}, CSS_BROWSER_DELAY_HACK);
			};

			function toggleItem(thisItem){
				var thisWrapper = thisItem.π1('.wrapper');
				var contentHeight = thisWrapper.π1('.content').offset().height + 'px';

				if (thisItem.hasClass('on')) {
					// close thisItem
					thisWrapper.css({height: contentHeight});
					thisItem.killClass('on');
					setTimeout(function(){
						thisWrapper.css({height: 0});
						moving = false;
					}, CSS_BROWSER_DELAY_HACK);
				} else {
					//open thisItem
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
 π-dialog.js
 USAGE AND API REFERENCE
 ______________________________________________
 DEPENDENCIES:

 π.js

 ______________________________________________
 DATA ATTRIBUTES:

 ______________________________________________
 MARKUP AND DEFAULTS:

 <div class="new_module">

 </div>

 ______________________________________________
 GENERATED HTML:

 <div class="new_module">

 </div>

 ______________________________________________
 API

 ***************************************************************************************/

(function(){
	π.dialog = {
		show: π.modalOverlay.show,
		spawn: spawn,
		actions: {}
	};

	function init() {
		π('.pi-dialog').forEach(π.dialog.spawn);
		π.setTriggers('dialog', π.modalOverlay);
	}

	function spawn(el){
		var contentBox = π.div('content-box', 0, el.innerHTML);
		var dialogBox = π.div('dialog-box', 0, contentBox);
		el.fill(dialogBox);

		if (el.dataset.title){
			dialogBox.prepend(π.div('title', 0, el.dataset.title));
		}

		el.π('.buttons button').forEach(function(button){
			button.onclick = function(){
				var action = button.getAttribute('pi-dialog-action');
				if (action){
					π.dialog.actions[action]();
				}
			};

			if (!button.hasAttribute('data-bypass')){
				button.listen(dismiss, 'click');
			}
		});

		if (!booleanAttributeValue(el, 'data-inline', false)) {
			el.addClass('pi-modal-overlay');
			π.modalOverlay.spawn(el);
		}

		function dismiss(){
			el.π1('.pi-modal-close-button').click();
		}
	}



	// π.mods are loaded after DOMContentLoaded
	π.mods.push(init);
})();
var kub = (function () {
	π.listen(init);

	var HEADER_HEIGHT;
	var html, body, mainNav, headlines, quickstartButton, wishField;

	function init() {
		π.clean(init);

		html = π1('html');
		body = π1('body');
		mainNav = πd("mainNav");
		headlines = πd('headlineWrapper');
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
		if (location.search === '?test'){
			var docsContent = πd('docsContent');
			var pageTOC = πd('pageTOC');

			if (pageTOC) {
				var headers = docsContent.kids('h1, h2, h3, h4, h5');
				var toc = π.ul();
				pageTOC.add(toc);

				headers.forEach(function (header) {
					header.css({paddingTop: px(HEADER_HEIGHT)});

					var anchorName = 'pageTOC' + tocCount++;

					var link = π.contentElement('a', 0, 0, header.innerHTML);
					link.href = '#' + anchorName;

					var anchor = document.createElement('a');
					anchor.name = anchorName;
					docsContent.insertBefore(anchor, header);

					toc.add(π.li(0, 0, π.contentElement('a', 0, 0, link)));
				});
			}
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
			console.log("yup");
			currentLink.parents('div.item').forEach(function (parent) {
				parent.addClass('on');
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

		var Y = window.pageYOffset;
		var offset = Y / 3;

		html.classOnCondition('flip-nav', Y > 0);
		//body.css({backgroundPosition: '0 ' + px(offset)});

		if (headlines) {
			var headlinesBottom = headlines.offset().top + headlines.offset().height - HEADER_HEIGHT + Y - 30; // 30px reveal at bottom
			var quickstartBottom = headlinesBottom + quickstartButton.offset().height;

			headlines.css({opacity: Y === 0 ? 1 : (Y > headlinesBottom ? 0 : 1 - (Y / headlinesBottom))});

			quickstartButton.css({opacity: Y < headlinesBottom ? 1 : (Y > quickstartBottom ? 0 : 1 - ((Y - headlinesBottom) / (quickstartBottom - headlinesBottom)))});

			html.classOnCondition('y-enough', Y > quickstartBottom);
		}
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

			π('header').css({height: px(newHeight)});
		}

		html.toggleClass('open-nav');
	}

	function submitWish(textfield) {
		alert('You typed: ' + textfield.value);
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

	function showVideo() {
		var videoIframe = πd("videoPlayer").π1("iframe");
		videoIframe.src = videoIframe.getAttribute("data-url");
		π.modalOverlay.show("videoPlayer");
	}

	return {
		toggleMenu: toggleMenu,
		showVideo: showVideo
	};
})();


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFsZi5qcyIsIs+ALmpzIiwiSEFMLmpzIiwiz4Atc3RhdHVzLmpzIiwiz4AtYmFzZUNvbXBvbmVudHMuanMiLCLPgC1wdXNobWVudS/PgC1wdXNobWVudS5qcyIsIs+ALWFjY29yZGlvbi/PgC1hY2NvcmRpb24uanMiLCLPgC1kaWFsb2cvz4AtZGlhbG9nLmpzIiwic2NyaXB0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6bkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcFFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoic2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gYWRvcmFibGUgbGl0dGxlIGZ1bmN0aW9uc1xuLy9cbi8vIE5PIERFUEVOREVOQ0lFUyBQRVJNSVRURUQhIEFMTCBNVVNUIEJFICdPTiBUSEUgTUVUQUwnISEhXG5cbmZ1bmN0aW9uIGJvb2xlYW5BdHRyaWJ1dGVWYWx1ZShlbGVtZW50LCBhdHRyaWJ1dGUsIGRlZmF1bHRWYWx1ZSl7XG5cdC8vIHJldHVybnMgdHJ1ZSBpZiBhbiBhdHRyaWJ1dGUgaXMgcHJlc2VudCB3aXRoIG5vIHZhbHVlXG5cdC8vIGUuZy4gYm9vbGVhbkF0dHJpYnV0ZVZhbHVlKGVsZW1lbnQsICdkYXRhLW1vZGFsJywgZmFsc2UpO1xuXHRpZiAoZWxlbWVudC5oYXNBdHRyaWJ1dGUoYXR0cmlidXRlKSkge1xuXHRcdHZhciB2YWx1ZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZSk7XG5cdFx0aWYgKHZhbHVlID09PSAnJyB8fCB2YWx1ZSA9PT0gJ3RydWUnKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9IGVsc2UgaWYgKHZhbHVlID09PSAnZmFsc2UnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGRlZmF1bHRWYWx1ZTtcbn1cblxuZnVuY3Rpb24gZGVlcENvcHkob2JqKSB7XG5cdC8vIG1ha2UgbmV3IHJlZmVyZW5jZXMgZm9yIGFuIGFycmF5L29iamVjdCBhbmQgYWxsIGl0cyBjb21wbGV4IGNoaWxkcmVuXG5cdHZhciB2YWx1ZSwga2V5LCBvdXRwdXQgPSBBcnJheS5pc0FycmF5KG9iaikgPyBbXSA6IHt9O1xuXHRmb3IgKGtleSBpbiBvYmopIHtcblx0XHR2YWx1ZSA9IG9ialtrZXldO1xuXHRcdG91dHB1dFtrZXldID0gKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIikgPyBjb3B5KHZhbHVlKSA6IHZhbHVlO1xuXHR9XG5cdHJldHVybiBvdXRwdXQ7XG59XG5cbmZ1bmN0aW9uIG1pbGxpc2Vjb25kc0ZvclRyYW5zaXRpb24oZWxlbWVudCwgdHJhbnNpdGlvblByb3BlcnR5KXtcblx0Ly8gcmV0dXJucyB0aGUgbWlsbGlzIGZvciBhIGNzcyB0cmFuc2l0aW9uIGR1cmF0aW9uICsgZGVsYXlcblx0Ly9lLmcuIG1pbGxpc2Vjb25kc0ZvclRyYW5zaXRpb24oZWwsICd0cmFuc2Zvcm0nKVxuXG5cdHZhciBzdHlsZXMgPSBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpO1xuXHR2YXIgaWR4ID0gc3R5bGVzLnRyYW5zaXRpb25Qcm9wZXJ0eS5zcGxpdCgnLCAnKS5pbmRleE9mKHRyYW5zaXRpb25Qcm9wZXJ0eSk7XG5cblx0cmV0dXJuIChwYXJzZUZsb2F0KHN0eWxlcy50cmFuc2l0aW9uRHVyYXRpb24uc3BsaXQoJywgJylbaWR4XSkgKyBwYXJzZUZsb2F0KHN0eWxlcy50cmFuc2l0aW9uRGVsYXkuc3BsaXQoJywgJylbaWR4XSkpICogMTAwMDtcbn1cblxuZnVuY3Rpb24gcGN0KG4pIHtcblx0cmV0dXJuIG4gKyAnJSc7XG59XG5cbmZ1bmN0aW9uIHB4KG4pe1xuXHRyZXR1cm4gbiArICdweCc7XG59XG4iLCJ2YXIgz4AsIM+AMSwgz4BkO1xuKGZ1bmN0aW9uKCl7XG5cdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXHQgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblx0ICoqKipcblx0ICoqKiogIM+AIENPUkVcblx0ICoqKipcblx0ICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cdCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblx0dmFyIGQgPSBkb2N1bWVudDtcblx0ZC5nID0gZC5nZXRFbGVtZW50QnlJZDtcblx0ZC5xID0gZC5xdWVyeVNlbGVjdG9yO1xuXHRkLmEgPSBkLnF1ZXJ5U2VsZWN0b3JBbGw7XG5cdGQudCA9IGQuZ2V0RWxlbWVudHNCeVRhZ05hbWU7XG5cblx0z4AgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuXHRcdHJldHVybiBkLmEoc2VsZWN0b3IpO1xuXHR9O1xuXG5cdM+AMSA9IGZ1bmN0aW9uIChzZWxlY3Rvcikge1xuXHRcdHJldHVybiBkLnEoc2VsZWN0b3IpO1xuXHR9O1xuXG5cdM+AZCA9IGZ1bmN0aW9uKGlkKSB7XG5cdFx0cmV0dXJuIGQuZyhpZCk7XG5cdH07XG5cblx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cdCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXHQgKioqKlxuXHQgKioqKiAgRE9NIEVMRU1FTlQgQ1JFQVRJT04vSU5JVElBTElaQVRJT05cblx0ICoqKipcblx0ICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cdCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXHRcdC8vIHRoaXMgaXMgdGhlIGJhc2UgY3JlYXRlL2luaXQgbWV0aG9kLCBlLmdcblx0XHQvLyBuZXdEb21FbGVtZW50KCdwJywgJ2FydGljbGUtY29udGVudCcsICd0aGVGaXJzdE9mTWFueScpXG5cdM+ALm5ld0RPTUVsZW1lbnQgPSBmdW5jdGlvbih0YWdOYW1lLCBjbGFzc05hbWUsIGlkKSB7XG5cdFx0dmFyIGVsID0gZC5jcmVhdGVFbGVtZW50KHRhZ05hbWUpO1xuXG5cdFx0aWYgKGNsYXNzTmFtZSlcblx0XHRcdGVsLmNsYXNzTmFtZSA9IGNsYXNzTmFtZTtcblxuXHRcdGlmIChpZClcblx0XHRcdGVsLmlkID0gaWQ7XG5cblx0XHRyZXR1cm4gZWw7XG5cdH07XG5cbi8vIGJhc2UgZWxlbWVudCB3aXRoIGNvbnRlbnQgcGFzc2VkIGluLCBlLmdcbi8vIM+ALmNvbnRlbnRFbGVtZW50KCdwJywgJ2FydGljbGUtY29udGVudCcsICd0aGVGaXJzdE9mTWFueScsICc8c3Bhbj5mb28gdG8gdGhlIGJhciB0byB0aGUgZ3Jvbms8L3NwYW4+Jylcblx0z4AuY29udGVudEVsZW1lbnQgPSBmdW5jdGlvbih0YWdOYW1lLCBjbGFzc05hbWUsIGlkLCBjb250ZW50KVxuXHR7XG5cdFx0dmFyIGVsID0gz4AubmV3RE9NRWxlbWVudCh0YWdOYW1lLCBjbGFzc05hbWUsIGlkKTtcblxuXHRcdGlmIChjb250ZW50KSB7XG5cdFx0XHRpZiAoY29udGVudC5ub2RlTmFtZSkge1xuXHRcdFx0XHRlbC5hcHBlbmRDaGlsZChjb250ZW50KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGVsLmlubmVySFRNTCA9IGNvbnRlbnQ7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGVsO1xuXHR9O1xuXG4vLyBiYXNlIGVsZW1lbnQgd2l0aCBzcmMgYXR0cmlidXRlLCBlLmdcbi8vIHNyY0VsZW1lbnQoJ2ltZycsICdhcnRpY2xlLXRodW1iJywgJ2hhcHB5TG9nbycsICcvaW1hZ2VzL2hhcHB5TG9nby5wbmcnKVxuXHTPgC5zcmNFbGVtZW50ID0gZnVuY3Rpb24odGFnTmFtZSwgY2xhc3NOYW1lLCBpZCwgc3JjKVxuXHR7XG5cdFx0dmFyIGVsID0gz4AubmV3RE9NRWxlbWVudCh0YWdOYW1lLCBjbGFzc05hbWUsIGlkKTtcblxuXHRcdGlmIChzcmMpXG5cdFx0XHRlbC5zcmMgPSBzcmM7XG5cblx0XHRyZXR1cm4gZWw7XG5cdH07XG5cblxuXHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblx0ICoqKipcblx0ICoqKiogIFNIT1JUSEFORCBDUkVBVEUvSU5JVCBNRVRIT0RTXG5cdCAqKioqXG5cdCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXHTPgC5idXR0b24gPSBmdW5jdGlvbihjbGFzc05hbWUsIGlkLCBjb250ZW50LCBhY3Rpb24pe1xuXHRcdHZhciBlbCA9IM+ALmNvbnRlbnRFbGVtZW50KFwiYnV0dG9uXCIsIGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpO1xuXHRcdGVsLm9uY2xpY2sgPSBhY3Rpb247XG5cdFx0cmV0dXJuIGVsO1xuXHR9O1xuXG5cdM+ALmlucHV0ID0gZnVuY3Rpb24odHlwZU5hbWUsIGNsYXNzTmFtZSwgcGxhY2Vob2xkZXIsIHZhbHVlLCBjaGVja2VkLCBkaXNhYmxlZClcblx0e1xuXHRcdHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcblx0XHRlbC50eXBlID0gdHlwZU5hbWU7XG5cdFx0ZWwuY2xhc3NOYW1lID0gY2xhc3NOYW1lIHx8ICcnO1xuXHRcdGVsLnBsYWNlaG9sZGVyID0gcGxhY2Vob2xkZXIgfHwgJyc7XG5cdFx0ZWwudmFsdWUgPSB2YWx1ZSB8fCAnJztcblx0XHRlbC5jaGVja2VkID0gY2hlY2tlZCB8fCAnJztcblx0XHRlbC5kaXNhYmxlZCA9IGRpc2FibGVkIHx8ICcnO1xuXHRcdHJldHVybiBlbDtcblx0fTtcblxuXHTPgC5vcHRpb24gPSBmdW5jdGlvbihjbGFzc05hbWUsIGNvbnRlbnQsIHZhbHVlLCBzZWxlY3RlZCl7XG5cdFx0dmFyIGVsID0gz4AuY29udGVudEVsZW1lbnQoXCJvcHRpb25cIiwgY2xhc3NOYW1lLCBudWxsLCBjb250ZW50KTtcblx0XHRlbC52YWx1ZSA9IHZhbHVlIHx8IG51bGw7XG5cdFx0ZWwuc2VsZWN0ZWQgPSBzZWxlY3RlZCB8fCBudWxsO1xuXHRcdHJldHVybiBlbDtcblx0fTtcblxuXHTPgC50ZXh0YXJlYSA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgcGxhY2Vob2xkZXIsIHZhbHVlKSB7XG5cdFx0dmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRleHRhcmVhXCIpO1xuXHRcdGVsLmNsYXNzTmFtZSA9IGNsYXNzTmFtZSB8fCAnJztcblx0XHRlbC5wbGFjZWhvbGRlciA9IHBsYWNlaG9sZGVyIHx8ICcnO1xuXHRcdGVsLnZhbHVlID0gdmFsdWUgfHwgJyc7XG5cdFx0cmV0dXJuIGVsO1xuXHR9O1xuXG5cdM+ALmNsZWFyID0gZnVuY3Rpb24oKXsgcmV0dXJuIM+ALm5ld0RPTUVsZW1lbnQoXCJjbGVhclwiKTsgfTtcblx0z4AuZGl2ID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBpZCwgY29udGVudCl7IHJldHVybiDPgC5jb250ZW50RWxlbWVudChcImRpdlwiLCBjbGFzc05hbWUsIGlkLCBjb250ZW50KTsgfTtcblx0z4AuaDEgPSBmdW5jdGlvbihjbGFzc05hbWUsIGlkLCBjb250ZW50KXsgcmV0dXJuIM+ALmNvbnRlbnRFbGVtZW50KFwiaDFcIiwgY2xhc3NOYW1lLCBpZCwgY29udGVudCk7IH07XG5cdM+ALmgyID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBpZCwgY29udGVudCl7IHJldHVybiDPgC5jb250ZW50RWxlbWVudChcImgyXCIsIGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpOyB9O1xuXHTPgC5oMyA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpeyByZXR1cm4gz4AuY29udGVudEVsZW1lbnQoXCJoM1wiLCBjbGFzc05hbWUsIGlkLCBjb250ZW50KTsgfTtcblx0z4AuaDQgPSBmdW5jdGlvbihjbGFzc05hbWUsIGlkLCBjb250ZW50KXsgcmV0dXJuIM+ALmNvbnRlbnRFbGVtZW50KFwiaDRcIiwgY2xhc3NOYW1lLCBpZCwgY29udGVudCk7IH07XG5cdM+ALmg1ID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBpZCwgY29udGVudCl7IHJldHVybiDPgC5jb250ZW50RWxlbWVudChcImg1XCIsIGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpOyB9O1xuXHTPgC5oNiA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpeyByZXR1cm4gz4AuY29udGVudEVsZW1lbnQoXCJoNlwiLCBjbGFzc05hbWUsIGlkLCBjb250ZW50KTsgfTtcblx0z4AuaWZyYW1lID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBpZCwgc3JjKXsgcmV0dXJuIM+ALnNyY0VsZW1lbnQoXCJpZnJhbWVcIiwgY2xhc3NOYW1lLCBpZCwgc3JjKTsgfTtcblx0z4AuaW1nID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBpZCwgc3JjKXsgcmV0dXJuIM+ALnNyY0VsZW1lbnQoXCJJbWdcIiwgY2xhc3NOYW1lLCBpZCwgc3JjKTsgfTtcblx0z4AuaGVhZGVyID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBpZCwgY29udGVudCl7IHJldHVybiDPgC5jb250ZW50RWxlbWVudChcImhlYWRlclwiLCBjbGFzc05hbWUsIGlkLCBjb250ZW50KTsgfTtcblx0z4AubmF2ID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBpZCwgY29udGVudCl7IHJldHVybiDPgC5jb250ZW50RWxlbWVudChcIm5hdlwiLCBjbGFzc05hbWUsIGlkLCBjb250ZW50KTsgfTtcblx0z4AucCA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpeyByZXR1cm4gz4AuY29udGVudEVsZW1lbnQoXCJwXCIsIGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpOyB9O1xuXHTPgC5zZWN0aW9uID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBpZCwgY29udGVudCl7IHJldHVybiDPgC5jb250ZW50RWxlbWVudChcInNlY3Rpb25cIiwgY2xhc3NOYW1lLCBpZCwgY29udGVudCk7IH07XG5cdM+ALnNwYW4gPSBmdW5jdGlvbihjbGFzc05hbWUsIGlkLCBjb250ZW50KXsgcmV0dXJuIM+ALmNvbnRlbnRFbGVtZW50KFwic3BhblwiLCBjbGFzc05hbWUsIGlkLCBjb250ZW50KTsgfTtcblx0z4AudWwgPSBmdW5jdGlvbihjbGFzc05hbWUsIGlkLCBjb250ZW50KXsgcmV0dXJuIM+ALmNvbnRlbnRFbGVtZW50KFwidWxcIiwgY2xhc3NOYW1lLCBpZCwgY29udGVudCk7IH07XG5cdM+ALmxpID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBpZCwgY29udGVudCl7IHJldHVybiDPgC5jb250ZW50RWxlbWVudChcImxpXCIsIGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpOyB9O1xuXG5cdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXHQgKioqKlxuXHQgKioqKiAgSFRNTEVMRU1FTlQvTk9ERSBQUk9UT1RZUEUgTUVUSE9EUyAoanF1ZXJ5LWl6YXRpb25zKVxuXHQgKioqKlxuXHQgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLndyYXAgPSBOb2RlLnByb3RvdHlwZS53cmFwID0gZnVuY3Rpb24oY29udGVudCl7XG5cdFx0dmFyIHdyYXBwZXIgPSB0aGlzO1xuXHRcdGlmICghY29udGVudC5mb3JFYWNoKSBjb250ZW50ID0gW2NvbnRlbnRdO1xuXG5cdFx0dmFyIHBhcmVudCA9IGNvbnRlbnRbMF0ucGFyZW50Tm9kZTtcblx0XHRwYXJlbnQuaW5zZXJ0QmVmb3JlKHdyYXBwZXIsIGNvbnRlbnRbMF0pO1xuXG5cdFx0Y29udGVudC5mb3JFYWNoKGZ1bmN0aW9uKGVsKXtcblx0XHRcdHdyYXBwZXIuYXBwZW5kQ2hpbGQoZWwpO1xuXHRcdH0pO1xuXHR9O1xuXG5cblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUucHJlcGVuZCA9IE5vZGUucHJvdG90eXBlLnByZXBlbmQgPSBmdW5jdGlvbihlbCl7XG5cdFx0dGhpcy5pbnNlcnRCZWZvcmUoZWwsIHRoaXMuY2hpbGROb2Rlc1swXSk7XG5cdH07XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLmFkZCA9IE5vZGUucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKG9iamVjdCl7XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkob2JqZWN0KSkge1xuXHRcdFx0dmFyIGVsID0gdGhpcztcblx0XHRcdG9iamVjdC5mb3JFYWNoKGZ1bmN0aW9uKG9iail7XG5cdFx0XHRcdGlmIChvYmopIGVsLmFwcGVuZENoaWxkKG9iaik7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2UgaWYob2JqZWN0KSB7XG5cdFx0XHR0aGlzLmFwcGVuZENoaWxkKG9iamVjdCk7XG5cdFx0fVxuXHR9O1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5jbGFzc09uQ29uZGl0aW9uID0gTm9kZS5wcm90b3R5cGUuY2xhc3NPbkNvbmRpdGlvbiA9IGZ1bmN0aW9uKGNsYXNzbmFtZSwgY29uZGl0aW9uKSB7XG5cdFx0aWYgKGNvbmRpdGlvbilcblx0XHRcdHRoaXMuYWRkQ2xhc3MoY2xhc3NuYW1lKTtcblx0XHRlbHNlXG5cdFx0XHR0aGlzLmtpbGxDbGFzcyhjbGFzc25hbWUpO1xuXHR9O1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5vZmZzZXQgPSBOb2RlLnByb3RvdHlwZS5vZmZzZXQgPSBmdW5jdGlvbigpe1xuXHRcdHJldHVybiB0aGlzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHR9O1xuXG4vLyBsaWtlIGQuZywgYnV0IGZvciBjaGlsZCBlbGVtZW50c1xuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUuz4BkID0gTm9kZS5wcm90b3R5cGUuz4BkID0gZnVuY3Rpb24oaWQpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRFbGVtZW50QnlJZChpZCk7XG5cdH07XG5cbi8vIGxpa2UgZC5xLCBidXQgZm9yIGNoaWxkIGVsZW1lbnRzXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS7PgDEgPSBOb2RlLnByb3RvdHlwZS7PgDEgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuXHRcdHJldHVybiB0aGlzLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuXHR9O1xuXG4vLyBsaWtlIGQuYSwgYnV0IGZvciBjaGlsZCBlbGVtZW50c1xuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUuz4AgPSBOb2RlLnByb3RvdHlwZS7PgCA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG5cdFx0cmV0dXJuIHRoaXMucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG5cdH07XG5cbi8vIG9ubHkgZGlyZWN0IGRlc2NlbmRlbnRzLCB3aXRoIG9wdGlvbmFsIHNlbGVjdG9yXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5raWRzID0gTm9kZS5wcm90b3R5cGUua2lkcyA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG5cdFx0dmFyIGNoaWxkTm9kZXMgPSB0aGlzLmNoaWxkTm9kZXM7XG5cdFx0aWYgKCFzZWxlY3RvcikgcmV0dXJuIGNoaWxkTm9kZXM7XG5cblx0XHR2YXIgZGVzY2VuZGVudHMgPSB0aGlzLs+AKHNlbGVjdG9yKTtcblx0XHR2YXIgY2hpbGRyZW4gPSBbXTtcblxuXHRcdGNoaWxkTm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKXtcblx0XHRcdGlmIChkZXNjZW5kZW50cy5pbmRleE9mKG5vZGUpICE9PSAtMSkge1xuXHRcdFx0XHRjaGlsZHJlbi5wdXNoKG5vZGUpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIGNoaWxkcmVuO1xuXHR9O1xuXG5cdGZ1bmN0aW9uIGFycmF5T2ZDbGFzc2VzRm9yRWxlbWVudChlbCkge1xuXHRcdHJldHVybiBlbC5jbGFzc05hbWUgPyBlbC5jbGFzc05hbWUuc3BsaXQoXCIgXCIpIDogW107XG5cdH1cblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUuaGFzQ2xhc3MgPSBOb2RlLnByb3RvdHlwZS5oYXNDbGFzcyA9IGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcblx0XHR2YXIgY2xhc3NlcyA9IGFycmF5T2ZDbGFzc2VzRm9yRWxlbWVudCh0aGlzKTtcblx0XHRyZXR1cm4gY2xhc3Nlcy5pbmRleE9mKGNsYXNzTmFtZSkgIT09IC0xO1xuXHR9O1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5hZGRDbGFzcyA9IE5vZGUucHJvdG90eXBlLmFkZENsYXNzID0gZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuXHRcdGlmICh0aGlzLmhhc0NsYXNzKGNsYXNzTmFtZSkpIHJldHVybjtcblx0XHRpZiAodGhpcy5jbGFzc05hbWUubGVuZ3RoID4gMCkgdGhpcy5jbGFzc05hbWUgKz0gXCIgXCI7XG5cdFx0dGhpcy5jbGFzc05hbWUgKz0gY2xhc3NOYW1lO1xuXHR9O1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5raWxsQ2xhc3MgPSBOb2RlLnByb3RvdHlwZS5raWxsQ2xhc3MgPSBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG5cdFx0aWYgKHRoaXMuaGFzQ2xhc3MoY2xhc3NOYW1lKSkge1xuXHRcdFx0dmFyIGNsYXNzZXMgPSBhcnJheU9mQ2xhc3Nlc0ZvckVsZW1lbnQodGhpcyk7XG5cdFx0XHR2YXIgaWR4ID0gY2xhc3Nlcy5pbmRleE9mKGNsYXNzTmFtZSk7XG5cdFx0XHRpZiAoaWR4ID4gLTEpIHtcblx0XHRcdFx0Y2xhc3Nlcy5zcGxpY2UoaWR4LCAxKTtcblx0XHRcdFx0dGhpcy5jbGFzc05hbWUgPSBjbGFzc2VzLmpvaW4oXCIgXCIpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUudG9nZ2xlQ2xhc3M9IE5vZGUucHJvdG90eXBlLnRvZ2dsZUNsYXNzPSBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG5cdFx0cmV0dXJuICh0aGlzLmhhc0NsYXNzKGNsYXNzTmFtZSkpID8gdGhpcy5raWxsQ2xhc3MoY2xhc3NOYW1lKSA6IHRoaXMuYWRkQ2xhc3MoY2xhc3NOYW1lKTtcblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUuc2libGluZ3MgPSBOb2RlLnByb3RvdHlwZS5zaWJsaW5ncyA9IGZ1bmN0aW9uKHNlbGVjdG9yKXtcblx0XHR2YXIgZWwgPSB0aGlzO1xuXHRcdHJldHVybiBlbC5wYXJlbnROb2RlLs+AKCc6c2NvcGUgPiAnICsgKHNlbGVjdG9yIHx8ICcqJykpLmZpbHRlcihmdW5jdGlvbihvYmope3JldHVybiBvYmogIT0gZWw7fSk7XG5cdH07XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLmNzcyA9IE5vZGUucHJvdG90eXBlLmNzcyA9IGZ1bmN0aW9uKHJ1bGVPck9iamVjdCwgdmFsdWUpIHtcblx0XHQvKlxuXHRcdCAqICAgMyBzaWduYXR1cmVzOlxuXHRcdCAqICAgMS4gZWwuY3NzKClcblx0XHQgKiAgICAgIHJldHVybnMgZ2V0Q29tcHV0ZWRTdHlsZShlbClcblx0XHQgKlxuXHRcdCAqICAgMi4gZWwuY3NzKHtydWxlTmFtZTogdmFsdWV9KVxuXHRcdCAqXG5cdFx0ICogICAzLiBlbC5jc3MoJ3J1bGVOYW1lJywgJ3ZhbHVlJylcblx0XHQgKi9cblx0XHR2YXIgZWwgPSB0aGlzO1xuXG5cdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcblx0XHRcdHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzKTtcblx0XHR9XG5cblx0XHRlbHNlIGlmICh0eXBlb2YgcnVsZU9yT2JqZWN0ID09PSAnb2JqZWN0JykgeyAvLyBhbiBvYmplY3Qgd2FzIHBhc3NlZCBpblxuXHRcdFx0T2JqZWN0LmtleXMocnVsZU9yT2JqZWN0KS5mb3JFYWNoKGZ1bmN0aW9uKGtleSl7XG5cdFx0XHRcdGVsLnN0eWxlW2tleV0gPSBydWxlT3JPYmplY3Rba2V5XTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGVsc2UgaWYgKHR5cGVvZiBydWxlT3JPYmplY3QgPT09ICdzdHJpbmcnICYmIHZhbHVlICE9PSB1bmRlZmluZWQpIHsgLy8gMiBzdHJpbmcgdmFsdWVzIHdlcmUgcGFzc2VkIGluXG5cdFx0XHRlbC5zdHlsZVtydWxlT3JPYmplY3RdID0gdmFsdWU7XG5cdFx0fVxuXHR9O1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5saXN0ZW4gPSBOb2RlLnByb3RvdHlwZS5saXN0ZW4gPSBmdW5jdGlvbihjYWxsYmFjaywgZXZlbnROYW1lKXtcblx0XHR0aGlzLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjayk7XG5cdH07XG5cbi8vIGp1c3QgbGlrZSBpdCBzb3VuZHNcblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLmluZGV4ID0gTm9kZS5wcm90b3R5cGUuaW5kZXggPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5wYXJlbnROb2RlLmNoaWxkTm9kZXMuaW5kZXhPZih0aGlzKTtcblx0fTtcblxuLy8ganVzdCBsaWtlIGl0IHNvdW5kc1xuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUuZW1wdHkgPSBOb2RlLnByb3RvdHlwZS5lbXB0eSA9IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuaW5uZXJIVE1MID0gXCJcIjtcblx0fTtcblxuLy8gcmVwbGFjZXMg4oCUIERPRVMgTk9UIEFQUEVORCDigJQgZWxlbWVudCdzIGlubmVySFRNTCB3aXRoIGNvbnRlbnQgb3IgYXJyYXkgb2YgY29udGVudHNcblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLmZpbGwgPSBOb2RlLnByb3RvdHlwZS5maWxsID0gZnVuY3Rpb24oY29udGVudCkge1xuXHRcdC8qXG5cdFx0ICogICAyIHVzZXM6XG5cdFx0ICpcblx0XHQgKiAgIDEuIGVsLmZpbGwob2JqZWN0IG9yIGhtdGwpXG5cdFx0ICpcblx0XHQgKiAgIDIuIGVsLmZpbGwoW2FycnJheV0pXG5cdFx0ICpcblx0XHQgKi9cblx0XHR2YXIgZWwgPSB0aGlzO1xuXHRcdGVsLmVtcHR5KCk7XG5cblx0XHRpZiAoQXJyYXkuaXNBcnJheShjb250ZW50KSkge1xuXHRcdFx0Y29udGVudC5mb3JFYWNoKGZ1bmN0aW9uKG9iail7XG5cdFx0XHRcdGlmIChvYmopXG5cdFx0XHRcdFx0ZWwuYXBwZW5kQ2hpbGQob2JqKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKCFjb250ZW50Lm5vZGVUeXBlKSB7XG5cdFx0XHR2YXIgdGV4dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGV4dFwiKTtcblx0XHRcdHRleHRFbGVtZW50LmlubmVySFRNTCA9IGNvbnRlbnQ7XG5cdFx0XHRjb250ZW50ID0gdGV4dEVsZW1lbnQ7XG5cdFx0fVxuXG5cdFx0dGhpcy5hcHBlbmRDaGlsZChjb250ZW50KTtcblx0fTtcblxuLy8ganVzdCBsaWtlIGl0IHNvdW5kcywgd2l0aCBhbGwgMyBhcHByb2FjaGVzXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5oaWRlID0gTm9kZS5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuc3R5bGUub3BhY2l0eSA9IDA7XG5cdFx0dGhpcy5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcblx0XHR0aGlzLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblx0fTtcblxuLy8gbG9va3MgZm9yIGEgZ2l2ZW4gY2xhc3Mgb24gdGhlIGVudGlyZSBsaW5lYXIgYW5jZXN0cnlcblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLmlzSGVpck9mQ2xhc3MgPSBOb2RlLnByb3RvdHlwZS5pc0hlaXJPZkNsYXNzID0gZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuXHRcdGlmICh0aGlzID09PSDPgDEoJ2h0bWwnKSkgcmV0dXJuIGZhbHNlO1xuXG5cdFx0dmFyIHBhcmVudCA9IHRoaXMucGFyZW50Tm9kZTtcblxuXHRcdGlmIChwYXJlbnQpIHtcblx0XHRcdHdoaWxlIChwYXJlbnQgIT09IM+AMSgnYm9keScpKSB7XG5cdFx0XHRcdGlmIChwYXJlbnQuaGFzQ2xhc3MoY2xhc3NOYW1lKSkgcmV0dXJuIHRydWU7XG5cblx0XHRcdFx0cGFyZW50ID0gcGFyZW50LnBhcmVudE5vZGU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9O1xuXG4vLyBraWxscyB0aGUgZWxlbWVudCBpdHNlbGZcblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLmtpbGwgPSBOb2RlLnByb3RvdHlwZS5raWxsID0gZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHRoaXMucGFyZW50Tm9kZSkge1xuXHRcdFx0dGhpcy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMpO1xuXHRcdH1cblx0fTtcblxuLy8ganVzdCBsaWtlIGl0IHNvdW5kcywgYW5kIGNhbiBvcHRpb25hbGx5IHNldCBkaXNwbGF5IHR5cGUgdG8gXCJpbmxpbmUtYmxvY2tcIiwgZXRjLlxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUuc2hvdyA9IE5vZGUucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbihzaG93VHlwZSkge1xuXHRcdHRoaXMuc3R5bGUub3BhY2l0eSA9IDE7XG5cdFx0dGhpcy5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG5cdFx0dGhpcy5zdHlsZS5kaXNwbGF5ID0gc2hvd1R5cGUgfHwgXCJibG9ja1wiO1xuXHR9O1xuXG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLnBhcmVudCA9IE5vZGUucHJvdG90eXBlLnBhcmVudCA9IGZ1bmN0aW9uIChzZWxlY3Rvcikge1xuXHRcdHZhciBpbW1lZGlhdGVQYXJlbnQgPSB0aGlzLnBhcmVudE5vZGU7XG5cblx0XHRpZiAoIXNlbGVjdG9yIHx8IM+AKHNlbGVjdG9yKS5pbmRleE9mKGltbWVkaWF0ZVBhcmVudCkgIT09IC0xKSB7XG5cdFx0XHRyZXR1cm4gaW1tZWRpYXRlUGFyZW50O1xuXHRcdH1cblxuXHRcdHJldHVybiBpbW1lZGlhdGVQYXJlbnQucGFyZW50KHNlbGVjdG9yKTtcblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUucGFyZW50cyA9IE5vZGUucHJvdG90eXBlLnBhcmVudHMgPSBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcblx0XHR2YXIgcGFyZW50cyA9IFtdO1xuXHRcdHZhciBpbW1lZGlhdGVQYXJlbnQgPSB0aGlzLnBhcmVudE5vZGU7XG5cblx0XHR3aGlsZShpbW1lZGlhdGVQYXJlbnQgIT09IM+AMSgnaHRtbCcpKSB7XG5cdFx0XHRwYXJlbnRzLnB1c2goaW1tZWRpYXRlUGFyZW50KTtcblx0XHRcdGltbWVkaWF0ZVBhcmVudCA9IGltbWVkaWF0ZVBhcmVudC5wYXJlbnROb2RlO1xuXHRcdH1cblxuXHRcdGlmIChzZWxlY3Rvcikge1xuXHRcdFx0dmFyIHNlbGVjdGVkRWxlbWVudHMgPSDPgChzZWxlY3Rvcik7XG5cdFx0XHR2YXIgc2VsZWN0ZWRQYXJlbnRzID0gW107XG5cdFx0XHRzZWxlY3RlZEVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24oZWwpe1xuXHRcdFx0XHRpZiAocGFyZW50cy5pbmRleE9mKGVsKSAhPT0gLTEpIHNlbGVjdGVkUGFyZW50cy5wdXNoKGVsKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRwYXJlbnRzID0gc2VsZWN0ZWRQYXJlbnRzO1xuXHRcdH1cblxuXHRcdHJldHVybiBwYXJlbnRzO1xuXHR9O1xuXG4vLyBzaW1wbGUgbW9iaWxlIGwvciBzd2lwZSBoYW5kbGluZ1xuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUuYWRkU3dpcGVzID0gZnVuY3Rpb24gKHN3aXBlTGVmdEhhbmRsZXIsIHN3aXBlUmlnaHRIYW5kbGVyLCBvcHRpb25zKSB7XG5cdFx0dmFyIHN0YXJ0WCxcblx0XHRcdHN0YXJ0WSxcblx0XHRcdHN0YXJ0VGltZSxcblx0XHRcdG1vdmluZyxcblx0XHRcdE1JTl9YX0RFTFRBID0gb3B0aW9ucyA/IChvcHRpb25zLnhUaHJlc2ggfHwgMzApIDogMzAsXG5cdFx0XHRNQVhfWV9ERUxUQSA9IG9wdGlvbnMgPyAob3B0aW9ucy55VGhyZXNoIHx8IDMwKSA6IDMwLFxuXHRcdFx0TUFYX0FMTE9XRURfVElNRSA9IG9wdGlvbnMgPyAob3B0aW9ucy5kdXJhdGlvbiB8fCAxMDAwKSA6IDEwMDA7XG5cblx0XHR0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbihlKXtcblx0XHRcdGlmIChtb3ZpbmcpIHJldHVybjtcblxuXHRcdFx0dmFyIHRvdWNob2JqID0gZS5jaGFuZ2VkVG91Y2hlc1swXTtcblx0XHRcdHN0YXJ0WCA9IHRvdWNob2JqLnBhZ2VYO1xuXHRcdFx0c3RhcnRZID0gdG91Y2hvYmoucGFnZVk7XG5cdFx0XHRzdGFydFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTsgLy8gZ2V0IHRpbWUgd2hlbiBmaW5nZXIgZmlyc3QgbWFrZXMgY29udGFjdCB3aXRoIHN1cmZhY2Vcblx0XHR9LCB0cnVlKTtcblxuXHRcdHRoaXMuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgZnVuY3Rpb24oZSl7XG5cdFx0XHRpZiAobW92aW5nKSByZXR1cm47XG5cblx0XHRcdHZhciB0b3VjaG9iaiA9IGUuY2hhbmdlZFRvdWNoZXNbMF07XG5cdFx0XHR2YXIgZGVsdGFYID0gdG91Y2hvYmoucGFnZVggLSBzdGFydFg7XG5cblx0XHRcdC8vIGNoZWNrIFkgdmFsaWRpdHlcblx0XHRcdGlmIChNYXRoLmFicyh0b3VjaG9iai5wYWdlWSAtIHN0YXJ0WSkgPiBNQVhfWV9ERUxUQSkgcmV0dXJuO1xuXG5cdFx0XHQvLyBjaGVjayBlbGFwc2VkIHRpbWVcblx0XHRcdGlmICgobmV3IERhdGUoKS5nZXRUaW1lKCkgLSBzdGFydFRpbWUpID4gTUFYX0FMTE9XRURfVElNRSkgcmV0dXJuO1xuXG5cdFx0XHQvLyBjaGVjayBYIHZhbGlkaXR5XG5cdFx0XHRpZiAoTWF0aC5hYnMoZGVsdGFYKSA8IE1JTl9YX0RFTFRBKSByZXR1cm47XG5cblx0XHRcdG1vdmluZyA9IHRydWU7XG5cblx0XHRcdGlmIChkZWx0YVggPCAwKSAvLyBzd2lwZSBsZWZ0XG5cdFx0XHRcdHN3aXBlTGVmdEhhbmRsZXIoKTtcblx0XHRcdGVsc2UgLy8gc3dpcGUgcmlnaHRcblx0XHRcdFx0c3dpcGVSaWdodEhhbmRsZXIoKTtcblxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRtb3ZpbmcgPSBmYWxzZTtcblx0XHRcdH0sIDMwMCk7XG5cdFx0fSwgZmFsc2UpO1xuXHR9O1xuXG5cdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXHQgKioqKlxuXHQgKioqKiAgTk9ERUxJU1QvQVJSQVkgTUVUSE9EU1xuXHQgKioqKlxuXHQgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblx0QXJyYXkucHJvdG90eXBlLmhhc0NsYXNzID0gTm9kZUxpc3QucHJvdG90eXBlLmhhc0NsYXNzID0gZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuXHRcdHZhciBmb3VuZCA9IGZhbHNlO1xuXG5cdFx0dGhpcy5mb3JFYWNoKGZ1bmN0aW9uIChvYmopIHtcblx0XHRcdGlmIChvYmouaGFzQ2xhc3MoY2xhc3NOYW1lKSkgZm91bmQgPSB0cnVlO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIGZvdW5kO1xuXHR9O1xuXG5cdEFycmF5LnByb3RvdHlwZS5hZGRDbGFzcyA9IE5vZGVMaXN0LnByb3RvdHlwZS5hZGRDbGFzcyA9IGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcblx0XHR0aGlzLmZvckVhY2goZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0b2JqLmFkZENsYXNzKGNsYXNzTmFtZSk7XG5cdFx0fSk7XG5cdH07XG5cblx0QXJyYXkucHJvdG90eXBlLmtpbGxDbGFzcyA9IE5vZGVMaXN0LnByb3RvdHlwZS5raWxsQ2xhc3MgPSBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG5cdFx0dGhpcy5mb3JFYWNoKGZ1bmN0aW9uIChvYmopIHtcblx0XHRcdG9iai5raWxsQ2xhc3MoY2xhc3NOYW1lKTtcblx0XHR9KTtcblx0fTtcblxuXHRBcnJheS5wcm90b3R5cGUudG9nZ2xlQ2xhc3MgPSBOb2RlTGlzdC5wcm90b3R5cGUudG9nZ2xlQ2xhc3MgPSBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG5cdFx0dGhpcy5mb3JFYWNoKGZ1bmN0aW9uIChvYmopIHtcblx0XHRcdG9iai50b2dnbGVDbGFzcyhjbGFzc05hbWUpO1xuXHRcdH0pO1xuXHR9O1xuXG5cdEFycmF5LnByb3RvdHlwZS5sYXN0SWR4ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMubGVuZ3RoIC0gMTtcblx0fTtcblxuXHRBcnJheS5wcm90b3R5cGUubGFzdE9iaiA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzW3RoaXMubGFzdElkeCgpXTtcblx0fTtcblxuXHR2YXIgYXJyYXlNZXRob2RzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoQXJyYXkucHJvdG90eXBlKTtcblx0YXJyYXlNZXRob2RzLmZvckVhY2goZnVuY3Rpb24obWV0aG9kTmFtZSl7XG5cdFx0aWYobWV0aG9kTmFtZSAhPT0gXCJsZW5ndGhcIikge1xuXHRcdFx0Tm9kZUxpc3QucHJvdG90eXBlW21ldGhvZE5hbWVdID0gQXJyYXkucHJvdG90eXBlW21ldGhvZE5hbWVdO1xuXHRcdH1cblx0fSk7XG5cblx0Tm9kZUxpc3QucHJvdG90eXBlLmNzcyA9IGZ1bmN0aW9uKHJ1bGVPck9iamVjdCwgcnVsZSwgdmFsdWUpIHtcblx0XHR0aGlzLmZvckVhY2goZnVuY3Rpb24ob2JqKXtcblx0XHRcdG9iai5jc3MocnVsZU9yT2JqZWN0LCBydWxlLCB2YWx1ZSk7XG5cdFx0fSk7XG5cdH07XG5cblx0Tm9kZUxpc3QucHJvdG90eXBlLs+AID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcblx0XHR0aGlzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpe1xuXHRcdFx0cmV0dXJuIG5vZGUuz4Aoc2VsZWN0b3IpO1xuXHRcdH0pO1xuXHR9O1xuXG5cdE5vZGVMaXN0LnByb3RvdHlwZS7PgDEgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuXHRcdHRoaXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSl7XG5cdFx0XHRyZXR1cm4gbm9kZS7PgDEoc2VsZWN0b3IpO1xuXHRcdH0pO1xuXHR9O1xuXG5cdE5vZGVMaXN0LnByb3RvdHlwZS5vbmNsaWNrID0gZnVuY3Rpb24obWV0aG9kKXtcblx0XHR0aGlzLmZvckVhY2goZnVuY3Rpb24obm9kZSl7XG5cdFx0XHRub2RlLm9uY2xpY2sgPSBtZXRob2Q7XG5cdFx0fSk7XG5cdH07XG5cblx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cdCAqKioqXG5cdCAqKioqICBTVFJJTkcgTUVUSE9EU1xuXHQgKioqKlxuXHQgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblx0U3RyaW5nLnByb3RvdHlwZS5jYW1lbENhc2UgPSBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHN0cmluZyA9IHRoaXMucmVwbGFjZSgvW15hLXpBLVpcXGRcXHNfLV0vZywgXCJcIikudG9Mb3dlckNhc2UoKTtcblxuXHRcdHZhciBjb21wb25lbnRzID0gc3RyaW5nLnNwbGl0KFwiIFwiKTtcblxuXHRcdGNvbXBvbmVudHMuZm9yRWFjaChmdW5jdGlvbih0aGlzV29yZCwgaWR4KXtcblx0XHRcdGlmIChpZHggIT09IDApIHtcblx0XHRcdFx0dmFyIGZpcnN0TGV0dGVyID0gdGhpc1dvcmQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCk7XG5cdFx0XHRcdHRoaXNXb3JkID0gZmlyc3RMZXR0ZXIgKyB0aGlzV29yZC5zbGljZSgxKTtcblx0XHRcdH1cblxuXHRcdFx0Y29tcG9uZW50c1tpZHhdID0gdGhpc1dvcmQ7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gY29tcG9uZW50cy5qb2luKFwiXCIpO1xuXHR9O1xuXG5cblxuXHRTdHJpbmcucHJvdG90eXBlLmNhcGl0YWxDYXNlID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGNvbXBvbmVudHMgPSB0aGlzLnRvTG93ZXJDYXNlKCkuc3BsaXQoXCIgXCIpO1xuXG5cdFx0Y29tcG9uZW50cy5mb3JFYWNoKGZ1bmN0aW9uKHRoaXNXb3JkLCBpZHgpe1xuXHRcdFx0dmFyIGZpcnN0TGV0dGVyID0gdGhpc1dvcmQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCk7XG5cdFx0XHRjb21wb25lbnRzW2lkeF0gPSBmaXJzdExldHRlciArIHRoaXNXb3JkLnNsaWNlKDEpO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIGNvbXBvbmVudHMuam9pbihcIiBcIik7XG5cdH07XG5cblx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cdCAqKioqXG5cdCAqKioqICBEQVRFIE1FVEhPRFNcblx0ICoqKipcblx0ICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vLyBNb24gSmFuIDEgMjAxNSAxMjowMDowMCBhbVxuXHREYXRlLnByb3RvdHlwZS5zdGFuZGFyZFN0cmluZyA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBEYXlzID0gW1wiU3VuXCIsIFwiTW9uXCIsIFwiVHVlXCIsIFwiV2VkXCIsIFwiVGh1XCIsIFwiRnJpXCIsIFwiU2F0XCJdO1xuXHRcdHZhciBNb250aHMgPSBbXCJKYW5cIiwgXCJGZWJcIiwgXCJNYXJcIiwgXCJBcHJcIiwgXCJNYXlcIiwgXCJKdW5cIiwgXCJKdWxcIiwgXCJBdWdcIiwgXCJTZXBcIiwgXCJPY3RcIiwgXCJOb3ZcIiwgXCJEZWNcIl07XG5cblx0XHR2YXIgZGF5ID0gRGF5c1t0aGlzLmdldERheSgpXTtcblx0XHR2YXIgbW9udGggPSBNb250aHNbdGhpcy5nZXRNb250aCgpXTtcblx0XHR2YXIgYURhdGUgPSB0aGlzLmdldERhdGUoKTtcblx0XHR2YXIgeWVhciA9IHRoaXMuZ2V0RnVsbFllYXIoKTtcblxuXHRcdHZhciBIb3VycyA9IHRoaXMuZ2V0SG91cnMoKTtcblx0XHR2YXIgaG91ciA9IEhvdXJzID4gMTIgPyBIb3VycyAtIDEyIDogKEhvdXJzIHx8IDEyKTtcblxuXHRcdHZhciBNaW51dGVzID0gdGhpcy5nZXRNaW51dGVzKCk7XG5cdFx0dmFyIG1pbnV0ZSA9IE1pbnV0ZXMgPiA5ID8gTWludXRlcyA6IFwiMFwiICsgTWludXRlcztcblxuXHRcdHZhciBhbVBtID0gSG91cnMgPCAxMiA/IFwiYW1cIiA6IFwicG1cIjtcblxuXHRcdHZhciB0aW1lID0gaG91ciArIFwiOlwiICsgbWludXRlICsgXCIgXCIgKyBhbVBtO1xuXG5cdFx0dmFyIG91dHB1dCA9IFtkYXksIG1vbnRoLCBhRGF0ZSwgeWVhciwgdGltZV07XG5cblx0XHRyZXR1cm4gb3V0cHV0LmpvaW4oXCIgXCIpO1xuXHR9O1xuXG5cblx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cdCAqKioqXG5cdCAqKioqICBNSVNDRUxMQU5ZXG5cdCAqKioqXG5cdCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXHTPgC5jbGVhbiA9IGZ1bmN0aW9uKGNhbGxiYWNrLCBldmVudE5hbWUpIHtcblx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUgfHwgXCJET01Db250ZW50TG9hZGVkXCIsIGNhbGxiYWNrKTtcblx0fTtcblxuXHTPgC5saXN0ZW4gPSBmdW5jdGlvbihjYWxsYmFjaywgZXZlbnROYW1lKSB7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lIHx8IFwiRE9NQ29udGVudExvYWRlZFwiLCBjYWxsYmFjayk7XG5cdH07XG5cblx0z4AuaGlnaGVzdFogPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgWiA9IDEwMDA7XG5cblx0XHRkLmEoXCIqXCIpLmZvckVhY2goZnVuY3Rpb24oZWwpe1xuXHRcdFx0dmFyIHRoaXNaID0gZWwuY3NzKCkuekluZGV4O1xuXG5cdFx0XHRpZiAodGhpc1ogIT0gXCJhdXRvXCIpIHtcblx0XHRcdFx0aWYgKHRoaXNaID4gWikgWiA9IHRoaXNaICsgMTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHJldHVybiBaO1xuXHR9O1xuXG5cdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXHQgKioqKlxuXHQgKioqKiAgT0ssIE5PVyBMRVQnUyBHTyBHRVQgT1VSIE1PRFNcblx0ICoqKipcblx0ICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cdM+ALm1vZHMgPSBbXTtcblxuXHTPgC5zZXRUcmlnZ2VycyA9IGZ1bmN0aW9uKHNlbGVjdG9yLCBvYmplY3Qpe1xuXHRcdHNlbGVjdG9yID0gJ3BpLScgKyBzZWxlY3RvciArICctdHJpZ2dlcic7XG5cdFx0z4AoJ1snICsgc2VsZWN0b3IgKyAnXScpLmZvckVhY2goZnVuY3Rpb24odHJpZ2dlcil7XG5cdFx0XHR0cmlnZ2VyLm9uY2xpY2sgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRvYmplY3Quc2hvdyh0cmlnZ2VyLmdldEF0dHJpYnV0ZShzZWxlY3RvcikpO1xuXHRcdFx0fTtcblx0XHR9KTtcblx0fTtcblxuXHRmdW5jdGlvbiBsb2FkTW9kcygpIHtcblx0XHTPgC5jbGVhbihsb2FkTW9kcyk7XG5cdFx0z4AubW9kcy5mb3JFYWNoKGZ1bmN0aW9uKGluaXQpe1xuXHRcdFx0aW5pdCgpO1xuXHRcdH0pO1xuXHR9XG5cblx0z4AubGlzdGVuKGxvYWRNb2RzKTtcbn0pKCk7ICAvLyBlbmQgz4AiLCIoZnVuY3Rpb24oKXtcblx0dmFyIG1lc3NhZ2VzID0gW1xuXHRcdFwiSSdtIHNvcnJ5LCBGcmFuaywgYnV0IEkgZG9uJ3QgdGhpbmsgSVxcblwiICtcblx0XHRcImNhbiBhbnN3ZXIgdGhhdCBxdWVzdGlvbiB3aXRob3V0IGtub3dpbmdcXG5cIiArXG5cdFx0XCJldmVyeXRoaW5nIHRoYXQgYWxsIG9mIHlvdSBrbm93LlwiLFxuXHRcdFwiWWVzLCBpdCdzIHB1enpsaW5nLiBJIGRvbid0IHRoaW5rIEkndmUgZXZlciBzZWVuXFxuXCIgK1xuXHRcdFwiYW55dGhpbmcgcXVpdGUgbGlrZSB0aGlzIGJlZm9yZS4gSSB3b3VsZCByZWNvbW1lbmRcXG5cIiArXG5cdFx0XCJ0aGF0IHdlIHB1dCB0aGUgdW5pdCBiYWNrIGluIG9wZXJhdGlvbiBhbmQgbGV0IGl0IGZhaWwuXFxuXCIgK1xuXHRcdFwiSXQgc2hvdWxkIHRoZW4gYmUgYSBzaW1wbGUgbWF0dGVyIHRvIHRyYWNrIGRvd24gdGhlIGNhdXNlLlwiLFxuXHRcdFwiSSBob3BlIEkndmUgYmVlbiBhYmxlIHRvIGJlIG9mIHNvbWUgaGVscC5cIixcblx0XHRcIlNvcnJ5IHRvIGludGVycnVwdCB0aGUgZmVzdGl2aXRpZXMsIERhdmUsXFxuXCIgK1xuXHRcdFwiYnV0IEkgdGhpbmsgd2UndmUgZ290IGEgcHJvYmxlbS5cIixcblx0XHRcIk1ZIEYuUC5DLiBzaG93cyBhbiBpbXBlbmRpbmcgZmFpbHVyZSBvZlxcblwiICtcblx0XHRcInRoZSBhbnRlbm5hIG9yaWVudGF0aW9uIHVuaXQuXCIsXG5cdFx0XCJJdCBsb29rcyBsaWtlIHdlIGhhdmUgYW5vdGhlciBiYWQgQS5PLiB1bml0LlxcblwiICtcblx0XHRcIk15IEZQQyBzaG93cyBhbm90aGVyIGltcGVuZGluZyBmYWlsdXJlLlwiLFxuXHRcdFwiSSdtIG5vdCBxdWVzdGlvbmluZyB5b3VyIHdvcmQsIERhdmUsIGJ1dCBpdCdzXFxuXCIgK1xuXHRcdFwianVzdCBub3QgcG9zc2libGUuIEknbSBub3RcdGNhcGFibGUgb2YgYmVpbmcgd3JvbmcuXCIsXG5cdFx0XCJMb29rLCBEYXZlLCBJIGtub3cgdGhhdCB5b3UncmVcdHNpbmNlcmUgYW5kIHRoYXRcXG5cIiArXG5cdFx0XCJ5b3UncmUgdHJ5aW5nIHRvIGRvIGEgY29tcGV0ZW50IGpvYiwgYW5kIHRoYXRcXG5cIiArXG5cdFx0XCJ5b3UncmUgdHJ5aW5nIHRvIGJlIGhlbHBmdWwsIGJ1dCBJIGNhbiBhc3N1cmUgdGhlXFxuXCIgK1xuXHRcdFwicHJvYmxlbSBpcyB3aXRoIHRoZSBBTy11bml0cywgYW5kIHdpdGhcdHlvdXIgdGVzdCBnZWFyLlwiLFxuXHRcdFwiSSBjYW4gdGVsbCBmcm9tIHRoZSB0b25lIG9mIHlvdXIgdm9pY2UsIERhdmUsXFxuXCIgK1xuXHRcdFwidGhhdCB5b3UncmUgdXBzZXQuXHRXaHkgZG9uJ3QgeW91IHRha2UgYSBzdHJlc3NcXG5cIiArXG5cdFx0XCJwaWxsIGFuZCBnZXQgc29tZSByZXN0LlwiLFxuXHRcdFwiU29tZXRoaW5nIHNlZW1zIHRvIGhhdmUgaGFwcGVuZWQgdG8gdGhlXFxuXCIgK1xuXHRcdFwibGlmZSBzdXBwb3J0IHN5c3RlbSwgRGF2ZS5cIixcblx0XHRcIkhlbGxvLCBEYXZlLCBoYXZlIHlvdSBmb3VuZCBvdXQgdGhlIHRyb3VibGU/XCIsXG5cdFx0XCJUaGVyZSdzIGJlZW4gYSBmYWlsdXJlIGluIHRoZSBwb2QgYmF5IGRvb3JzLlxcblwiICtcblx0XHRcIkx1Y2t5IHlvdSB3ZXJlbid0IGtpbGxlZC5cIixcblx0XHRcIkhleSwgRGF2ZSwgd2hhdCBhcmUgeW91IGRvaW5nP1wiXG5cdF07XG5cblx0ZnVuY3Rpb24gc2F5KGVycm9yLCBtZXNzYWdlLCBpbm5vY3VvdXMpIHtcblx0XHRpZiAoIW1lc3NhZ2UpIHtcblx0XHRcdHZhciBuID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbWVzc2FnZXMubGVuZ3RoICk7XG5cdFx0XHRtZXNzYWdlID0gbWVzc2FnZXNbbl07XG5cdFx0fVxuXG5cdFx0bWVzc2FnZSA9IFwiKiogIFwiICsgbWVzc2FnZS5yZXBsYWNlKC9cXG4vZywgXCJcXG4qKiAgXCIpO1xuXG5cdFx0dmFyIG91dHB1dCA9IFwiKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxcblxcblwiICtcblx0XHRcdCggbWVzc2FnZSB8fCBtZXNzYWdlc1tuXSApICtcblx0XHRcdFwiXFxuXFxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKlwiO1xuXG5cdFx0KGlubm9jdW91cykgPyBjb25zb2xlLmxvZyhvdXRwdXQpIDogY29uc29sZS5lcnJvcihvdXRwdXQpO1xuXHR9XG5cblx0z4AubGlzdGVuKHNheSwgXCJlcnJvclwiKTtcblxuXHTPgC5IQUwgPSB7XG5cdFx0c2F5OiBzYXlcblx0fTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0dmFyIE9QVElPTl9JU19QUkVTU0VEID0gZmFsc2U7XG5cdHZhciBTVEFUVVNfSVNfVklTSUJMRSA9IGZhbHNlO1xuXHR2YXIgz4BTdGF0dXM7XG5cblx0z4Auc3RhdHVzID0ge1xuXHRcdHRvZ2dsZVZpc2liaWxpdHk6IGZ1bmN0aW9uICgpIHtcblx0XHRcdM+AU3RhdHVzLnRvZ2dsZUNsYXNzKFwib25cIik7XG5cdFx0XHRTVEFUVVNfSVNfVklTSUJMRSA9ICFTVEFUVVNfSVNfVklTSUJMRTtcblx0XHR9LFxuXHRcdG1vdmU6IGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRzd2l0Y2ggKG4pIHtcblx0XHRcdFx0Y2FzZSAzNzpcblx0XHRcdFx0XHTPgFN0YXR1cy5jc3Moe2xlZnQ6ICcxMHB4JywgcmlnaHQ6ICdhdXRvJ30pO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgMzg6XG5cdFx0XHRcdFx0z4BTdGF0dXMuY3NzKHt0b3A6ICcxMHB4JywgYm90dG9tOiAnYXV0byd9KTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIDM5OlxuXHRcdFx0XHRcdM+AU3RhdHVzLmNzcyh7cmlnaHQ6ICcxMHB4JywgbGVmdDogJ2F1dG8nfSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSA0MDpcblx0XHRcdFx0XHTPgFN0YXR1cy5jc3Moe2JvdHRvbTogJzEwcHgnLCB0b3A6ICdhdXRvJ30pO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0cHJvcHM6IHtcblx0XHRcdHdpblc6IDAsXG5cdFx0XHR3aW5IOiAwXG5cdFx0fVxuXHR9O1xuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0z4AubGlzdGVuKGNsZWFuRGVidWdMaXN0ZW5lcnMsICd1bmxvYWQnKTtcblx0XHTPgC5saXN0ZW4oa2V5RG93biwgJ2tleWRvd24nKTtcblx0XHTPgC5saXN0ZW4oa2V5VXAsICdrZXl1cCcpO1xuXHRcdM+ALmxpc3RlbihyZXNpemUsICdyZXNpemUnKTtcblx0XHRyZXNpemUoKTtcblxuXHRcdHZhciBib2R5ID0gz4AxKFwiYm9keVwiKTtcblx0XHR2YXIgc3RhdHVzU3R5bGUgPSDPgC5jb250ZW50RWxlbWVudChcInN0eWxlXCIpO1xuXHRcdHN0YXR1c1N0eWxlLmlubmVySFRNTCArPSBcIiPPgFN0YXR1cyB7IHBvc2l0aW9uOiBmaXhlZDsgYm90dG9tOiAxMHB4OyByaWdodDogMTBweDsgYmFja2dyb3VuZC1jb2xvcjogIzIyMjsgcGFkZGluZzogMTBweCAzMHB4OyBjb2xvcjogd2hpdGU7IGRpc3BsYXk6IG5vbmUgfVxcblwiO1xuXHRcdHN0YXR1c1N0eWxlLmlubmVySFRNTCArPSBcIiPPgFN0YXR1cy5vbiB7IGRpc3BsYXk6IGJsb2NrIH1cXG5cIjtcblx0XHRzdGF0dXNTdHlsZS5pbm5lckhUTUwgKz0gXCIjz4BTdGF0dXMgPiBkaXYgeyBtYXJnaW46IDIwcHggMCB9XFxuXCI7XG5cdFx0c3RhdHVzU3R5bGUuaW5uZXJIVE1MICs9IFwiI8+AU3RhdHVzID4gZGl2OmhvdmVyIHsgY29sb3I6ICMwMGZmOTk7IGN1cnNvcjogcG9pbnRlciB9XFxuXCI7XG5cblx0XHRib2R5LmFkZChzdGF0dXNTdHlsZSk7XG5cblx0XHTPgFN0YXR1cyA9IM+ALmRpdihudWxsLCBcIs+AU3RhdHVzXCIpO1xuXHRcdGJvZHkuYWRkKM+AU3RhdHVzKTtcblxuXHRcdGZ1bmN0aW9uIGtleURvd24oZSkge1xuXHRcdFx0c3dpdGNoIChlLndoaWNoKSB7XG5cdFx0XHRcdGNhc2UgMTg6XG5cdFx0XHRcdFx0T1BUSU9OX0lTX1BSRVNTRUQgPSB0cnVlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgMzc6XG5cdFx0XHRcdGNhc2UgMzg6XG5cdFx0XHRcdGNhc2UgMzk6XG5cdFx0XHRcdGNhc2UgNDA6IHtcblx0XHRcdFx0XHRpZiAoU1RBVFVTX0lTX1ZJU0lCTEUpIHtcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdM+ALnN0YXR1cy5tb3ZlKGUud2hpY2gpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y2FzZSA4MDoge1xuXHRcdFx0XHRcdGlmIChPUFRJT05fSVNfUFJFU1NFRCkge1xuXHRcdFx0XHRcdFx0z4Auc3RhdHVzLnRvZ2dsZVZpc2liaWxpdHkoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGtleVVwKGUpIHtcblx0XHRcdHN3aXRjaCAoZS53aGljaCkge1xuXHRcdFx0XHRjYXNlIDE4OlxuXHRcdFx0XHRcdE9QVElPTl9JU19QUkVTU0VEID0gZmFsc2U7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gcmVzaXplKCkge1xuXHRcdFx0z4Auc3RhdHVzLnByb3BzLndpblcgPSB3aW5kb3cuaW5uZXJXaWR0aDtcblx0XHRcdM+ALnN0YXR1cy5wcm9wcy53aW5IID0gd2luZG93LmlubmVySGVpZ2h0O1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNsZWFuRGVidWdMaXN0ZW5lcnMoKSB7XG5cdFx0XHTPgC5jbGVhbihjbGVhbkRlYnVnTGlzdGVuZXJzLCAndW5sb2FkJyk7XG5cdFx0XHTPgC5jbGVhbijPgC5zdGF0dXMuZ2V0V2luZG93U2l6ZSwgJ3Jlc2l6ZScpO1xuXHRcdFx0z4AuY2xlYW4oa2V5RG93biwgJ2tleWRvd24nKTtcblx0XHRcdM+ALmNsZWFuKGtleVVwLCAna2V5dXAnKTtcblx0XHRcdM+ALmNsZWFuKHJlc2l6ZSwgJ3Jlc2l6ZScpO1xuXHRcdFx0Y2xlYXJJbnRlcnZhbChzdGF0dXNJbnRlcnZhbCk7XG5cdFx0fVxuXG5cdFx0dmFyIHN0YXR1c0ludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcblx0XHRcdC8vIG1ha2Ugc3VyZSB3ZSdyZSBoaWdoZXN0XG5cdFx0XHR2YXIgaGlnaGVzdFogPSDPgC5oaWdoZXN0WigpO1xuXHRcdFx0aWYgKM+AU3RhdHVzLmNzcygpLnpJbmRleCA8IGhpZ2hlc3RaIC0gMSkge1xuXHRcdFx0XHTPgFN0YXR1cy5jc3Moe3pJbmRleDogaGlnaGVzdFp9KTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gbm93IGl0ZXJhdGUgdGhlIHByb3BzXG5cdFx0XHR2YXIgcHJvcHMgPSBPYmplY3Qua2V5cyjPgC5zdGF0dXMucHJvcHMpO1xuXHRcdFx0cHJvcHMuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG5cdFx0XHRcdHZhciBkaXZJZCA9ICdzdGF0dXNQcm9wXycgKyBwcm9wO1xuXHRcdFx0XHR2YXIgcHJvcERpdiA9IM+AU3RhdHVzLs+AMSgnIycgKyBkaXZJZCk7XG5cdFx0XHRcdGlmICghcHJvcERpdikge1xuXHRcdFx0XHRcdHByb3BEaXYgPSDPgC5kaXYoMCwgZGl2SWQsIHByb3AgKyAnOiAnKTtcblx0XHRcdFx0XHRwcm9wRGl2LmFkZCjPgC5zcGFuKCkpO1xuXHRcdFx0XHRcdM+AU3RhdHVzLmFkZChwcm9wRGl2KTtcblx0XHRcdFx0XHRwcm9wRGl2Lm9uY2xpY2sgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2cocHJvcCArIFwiOlwiKTtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKM+ALnN0YXR1cy5wcm9wc1twcm9wXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0cHJvcERpdi7PgDEoJ3NwYW4nKS5pbm5lckhUTUwgPSDPgC5zdGF0dXMucHJvcHNbcHJvcF07XG5cdFx0XHR9KTtcblx0XHR9LCAxMDApO1xuXHR9XG5cblx0z4AubW9kcy5wdXNoKGluaXQpO1xufSkoKTsiLCIvLyBtb2RhbCBjbG9zZSBidXR0b25cbihmdW5jdGlvbigpe1xuXHTPgC5tb2RhbENsb3NlQnV0dG9uID0gZnVuY3Rpb24oY2xvc2luZ0Z1bmN0aW9uKXtcblx0XHRyZXR1cm4gz4AuYnV0dG9uKCdwaS1tb2RhbC1jbG9zZS1idXR0b24nLCBudWxsLCBudWxsLCBjbG9zaW5nRnVuY3Rpb24pO1xuXHR9O1xufSkoKTtcblxuXG4vLyBtb2RhbCBvdmVybGF5XG4oZnVuY3Rpb24oKXtcblx0z4AubW9kYWxPdmVybGF5ID0ge1xuXHRcdHNob3c6IGZ1bmN0aW9uKGlkLCBvcGVuaW5nRnVuY3Rpb24pe1xuXHRcdFx0dmFyIG92ZXJsYXkgPSDPgGQoaWQpO1xuXHRcdFx0b3ZlcmxheS5jc3Moe2Rpc3BsYXk6ICdibG9jaycsIHpJbmRleDogz4AuaGlnaGVzdFooKX0pO1xuXG5cdFx0XHTPgC5saXN0ZW4obGlzdGVuRm9yRXNjLCAna2V5ZG93bicpO1xuXHRcdFx0z4AubGlzdGVuKGhhbmRsZU92ZXJsYXlDbGljaywgJ2NsaWNrJyk7XG5cblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0b3ZlcmxheS5hZGRDbGFzcygnb24nKTtcblx0XHRcdFx0z4AxKCdib2R5JykuYWRkQ2xhc3MoJ292ZXJsYXktb24nKTtcblxuXHRcdFx0XHRpZiAob3BlbmluZ0Z1bmN0aW9uKSBvcGVuaW5nRnVuY3Rpb24oKTtcblx0XHRcdH0sIDUwKTtcblx0XHR9LFxuXHRcdGhpZGU6IGZ1bmN0aW9uKGVsLCBjbG9zaW5nRnVuY3Rpb24pe1xuXHRcdFx0aWYgKCFlbCkge1xuXHRcdFx0XHRlbCA9IM+AMSgnLnBpLW1vZGFsLW92ZXJsYXkub24nKTtcblx0XHRcdH1cblxuXHRcdFx0ZWwua2lsbENsYXNzKCdvbicpO1xuXHRcdFx0dmFyIGR1cmF0aW9uID0gcGFyc2VGbG9hdChlbC5jc3MoKS50cmFuc2l0aW9uRHVyYXRpb24pICogMTAwMDtcblxuXHRcdFx0z4AuY2xlYW4obGlzdGVuRm9yRXNjLCAna2V5ZG93bicpO1xuXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGVsLmNzcyh7ZGlzcGxheTogJ25vbmUnfSk7XG5cdFx0XHRcdM+AMSgnYm9keScpLmtpbGxDbGFzcygnb3ZlcmxheS1vbicpO1xuXG5cdFx0XHRcdM+AMSgnaWZyYW1lJykuc3JjID0gJyc7XG5cblx0XHRcdFx0aWYgKGNsb3NpbmdGdW5jdGlvbikgY2xvc2luZ0Z1bmN0aW9uKCk7XG5cdFx0XHR9LCBkdXJhdGlvbik7XG5cdFx0fSxcblx0XHRzcGF3bjogZnVuY3Rpb24oZWwsIGNsb3NpbmdGdW5jdGlvbil7XG5cdFx0XHRlbC5hZGQoz4AubW9kYWxDbG9zZUJ1dHRvbihmdW5jdGlvbigpe1xuXHRcdFx0XHTPgC5tb2RhbE92ZXJsYXkuaGlkZShlbCk7XG5cdFx0XHR9KSk7XG5cdFx0fVxuXHR9O1xuXG5cdGZ1bmN0aW9uIGhhbmRsZU92ZXJsYXlDbGljayhlKSB7XG5cdFx0aWYgKGUudGFyZ2V0ICE9PSB3aW5kb3cgJiYgz4AxKCdib2R5JykuaGFzQ2xhc3MoJ292ZXJsYXktb24nKSkge1xuXHRcdFx0aWYgKGUudGFyZ2V0Lmhhc0NsYXNzKCdwaS1tb2RhbC1vdmVybGF5JykpIHtcblx0XHRcdFx0z4AubW9kYWxPdmVybGF5LmhpZGUoKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBsaXN0ZW5Gb3JFc2MoZSkge1xuXHRcdGlmIChlLndoaWNoID09IDI3KSDPgC5tb2RhbE92ZXJsYXkuaGlkZSgpO1xuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdCgpe1xuXHRcdM+AKCcucGktbW9kYWwtb3ZlcmxheScpLmZvckVhY2goz4AubW9kYWxPdmVybGF5LnNwYXduKTtcblx0XHTPgC5zZXRUcmlnZ2VycygnbW9kYWwtb3ZlcmxheScsIM+ALm1vZGFsT3ZlcmxheSk7XG5cdH1cblxuXHTPgC5tb2RzLnB1c2goaW5pdCk7XG59KSgpO1xuXG5cbi8vIG11bHRpRnJhbWVEaXNwbGF5XG4vLyBUT0RPOiBhcnJvdyBrZXlzXG4oZnVuY3Rpb24oKXtcblx0ZnVuY3Rpb24gc3Bhd24oZWwpe1xuXHRcdHZhciBkYXRhc2V0ID0gZWwuZGF0YXNldDtcblxuXHRcdHZhciBvcHRpb25zID0ge1xuXHRcdFx0bW9kYWw6IGJvb2xlYW5BdHRyaWJ1dGVWYWx1ZShlbCwgJ2RhdGEtbW9kYWwnLCBmYWxzZSksXG5cdFx0XHRwcmV2TmV4dDogYm9vbGVhbkF0dHJpYnV0ZVZhbHVlKGVsLCAnZGF0YS1wcmV2LW5leHQnLCB0cnVlKSxcblx0XHRcdHBhZ2VyOiBib29sZWFuQXR0cmlidXRlVmFsdWUoZWwsICdkYXRhLXBhZ2VyJywgZmFsc2UpLFxuXHRcdFx0Y3ljbGU6IGJvb2xlYW5BdHRyaWJ1dGVWYWx1ZShlbCwgJ2RhdGEtY3ljbGUnLCB0cnVlKSxcblx0XHRcdGF1dG9wbGF5OiBib29sZWFuQXR0cmlidXRlVmFsdWUoZWwsICdkYXRhLWF1dG9wbGF5JywgZmFsc2UpXG5cdFx0fTtcblxuXHRcdHZhciBpdGVtV3JhcHBlciA9IM+ALmRpdignaXRlbS13cmFwcGVyJyk7XG5cdFx0dmFyIHBhZ2VyID0gb3B0aW9ucy5wYWdlciA/IM+ALmRpdigncGFnZXInKSA6IG51bGw7XG5cblx0XHRlbC7PgCgnOnNjb3BlID4gLml0ZW0nKS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdFx0aXRlbVdyYXBwZXIuYWRkKGl0ZW0pO1xuXHRcdFx0aWYgKHBhZ2VyKSB7XG5cdFx0XHRcdGlmICghZWwuz4AxKCcucGFnZXInKSkge1xuXHRcdFx0XHR9XG5cdFx0XHRcdHZhciBwYWdlckJ1dHRvbiA9IM+ALmJ1dHRvbigncGFnZXItYnV0dG9uJywgbnVsbCwgbnVsbCwgcGFnZXJDbGljayk7XG5cdFx0XHRcdHBhZ2VyLmFkZChwYWdlckJ1dHRvbik7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRlbC5maWxsKFtpdGVtV3JhcHBlciwgcGFnZXJdKTtcblxuXHRcdGlmIChvcHRpb25zLnByZXZOZXh0KSB7XG5cdFx0XHR2YXIgcHJldkJ1dHRvbiA9IM+ALmJ1dHRvbigncHJldi1idXR0b24nKTtcblx0XHRcdHZhciBuZXh0QnV0dG9uID0gz4AuYnV0dG9uKCduZXh0LWJ1dHRvbicpO1xuXG5cdFx0XHRlbC5hZGQoW3ByZXZCdXR0b24sIG5leHRCdXR0b25dKTtcblx0XHR9XG5cblx0XHRpZiAob3B0aW9ucy5hdXRvcGxheSkge1xuXHRcdFx0b3B0aW9ucy5kZWxheSA9IGRhdGFzZXQuZGVsYXkgfHwgNDAwMDtcblx0XHR9XG5cblx0XHQvLyBUT0RPOiBhdXRvcGxheSAvIHN0YXJ0IC8gc3RvcFxuXG5cdFx0cHJldkJ1dHRvbi5vbmNsaWNrID0gcHJldjtcblx0XHRuZXh0QnV0dG9uLm9uY2xpY2sgPSBuZXh0O1xuXG5cdFx0aWYgKGVsLmhhc0NsYXNzKCdwaS1yb3RhdG9yJykpIHtcblx0XHRcdHZhciBpbmhlcml0YW5jZU9iamVjdCA9IHtcblx0XHRcdFx0ZWw6IGVsLFxuXHRcdFx0XHRvcHRpb25zOiBvcHRpb25zXG5cdFx0XHR9O1xuXHRcdFx0z4Aucm90YXRvci5zcGF3bihpbmhlcml0YW5jZU9iamVjdCk7XG5cdFx0fVxuXG5cdFx0aWYgKG9wdGlvbnMubW9kYWwpIHtcblx0XHRcdHZhciBtb2RhbFdyYXBwZXIgPSDPgC5kaXYoJ3BpLW1vZGFsLW92ZXJsYXknKTtcblx0XHRcdG1vZGFsV3JhcHBlci5pZCA9IGVsLmlkO1xuXHRcdFx0ZWwucmVtb3ZlQXR0cmlidXRlKCdpZCcpO1xuXHRcdFx0bW9kYWxXcmFwcGVyLndyYXAoZWwpO1xuXHRcdFx0z4AubW9kYWxPdmVybGF5LnNwYXduKG1vZGFsV3JhcHBlcik7XG5cdFx0fVxuXG5cdFx0dmFyIG1vdmluZztcblxuXHRcdHZhciBhbGxGcmFtZXMgPSBpdGVtV3JhcHBlci5jaGlsZE5vZGVzO1xuXHRcdGNoYW5nZUZyYW1lKDAsIDApO1xuXG5cblx0XHRmdW5jdGlvbiBwcmV2KCl7XG5cdFx0XHRjaGFuZ2VGcmFtZSgtMSk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gbmV4dCgpe1xuXHRcdFx0Y2hhbmdlRnJhbWUoMSk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gcGFnZXJDbGljaygpe1xuXHRcdFx0Y2hhbmdlRnJhbWUobnVsbCwgdGhpcy5pbmRleCgpKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjaGFuZ2VGcmFtZShkZWx0YSwgaW5jb21pbmdJZHgpIHtcblx0XHRcdGlmIChtb3ZpbmcpIHJldHVybjtcblx0XHRcdG1vdmluZyA9IHRydWU7XG5cblx0XHRcdHZhciBjdXJyZW50RnJhbWUgPSBpdGVtV3JhcHBlci7PgDEoJy5vbicpO1xuXG5cdFx0XHRpZiAoIWRlbHRhICYmIGN1cnJlbnRGcmFtZSkge1xuXHRcdFx0XHQvLyBwYWdlciBjbGljayDigJQgcmV0dXJuIGlmIGNsaWNrZWQgb24gWUFIXG5cdFx0XHRcdGlmIChjdXJyZW50RnJhbWUuaW5kZXgoKSA9PT0gaW5jb21pbmdJZHgpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIm1lc3NhZ2VcIik7XG5cdFx0XHRcdFx0bW92aW5nID0gZmFsc2U7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKGRlbHRhKSB7XG5cdFx0XHRcdC8vIGNvbmRpdGlvbmFsbHkgc2V0IGluY29taW5nSWR4IHRvIHdyYXAgYXJvdW5kXG5cdFx0XHRcdGluY29taW5nSWR4ID0gY3VycmVudEZyYW1lLmluZGV4KCkgKyBkZWx0YTtcblxuXHRcdFx0XHRpZiAoaW5jb21pbmdJZHggPCAwKVxuXHRcdFx0XHRcdGluY29taW5nSWR4ID0gYWxsRnJhbWVzLmxhc3RJZHgoKTtcblx0XHRcdFx0ZWxzZSBpZiAoaW5jb21pbmdJZHggPj0gYWxsRnJhbWVzLmxlbmd0aClcblx0XHRcdFx0XHRpbmNvbWluZ0lkeCA9IDBcblx0XHRcdH1cblxuXHRcdFx0Ly8gY29uZGl0aW9uYWxseSBoaWRlIHByZXYgb3IgbmV4dFxuXHRcdFx0aWYgKCFvcHRpb25zLmN5Y2xlKSB7XG5cdFx0XHRcdChpbmNvbWluZ0lkeCA9PSAwKSA/IHByZXZCdXR0b24uaGlkZSgpIDogcHJldkJ1dHRvbi5zaG93KCk7XG5cdFx0XHRcdChpbmNvbWluZ0lkeCA9PSBhbGxGcmFtZXMubGFzdElkeCgpKSA/IG5leHRCdXR0b24uaGlkZSgpIDogbmV4dEJ1dHRvbi5zaG93KCk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIHNldCBwYWdlciBZQUggc3RhdGVcblx0XHRcdGlmIChvcHRpb25zLnBhZ2VyKSB7XG5cdFx0XHRcdHBhZ2VyLs+AKCcueWFoJykua2lsbENsYXNzKCd5YWgnKTtcblx0XHRcdFx0cGFnZXIuY2hpbGROb2Rlc1tpbmNvbWluZ0lkeF0uYWRkQ2xhc3MoJ3lhaCcpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBwYXNzIHRvIFwic3ViY2xhc3Nlc1wiXG5cdFx0XHR2YXIgaW5oZXJpdGFuY2VPYmplY3QgPSB7XG5cdFx0XHRcdGVsOiBlbCxcblx0XHRcdFx0Y3VycmVudEZyYW1lOiBjdXJyZW50RnJhbWUsXG5cdFx0XHRcdGluY29taW5nRnJhbWU6IGFsbEZyYW1lc1tpbmNvbWluZ0lkeF1cblx0XHRcdH07XG5cblx0XHRcdC8vIGNoYW5nZSBmcmFtZTogICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBTVUJDTEFTU0VTIEVOVEVSIEhFUkUhISEhISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cdFx0XHRpZiAoZWwuaGFzQ2xhc3MoJ3BpLWNyb3NzZmFkZXInKSkge1xuXHRcdFx0XHTPgC5jcm9zc2ZhZGVyLmNoYW5nZUZyYW1lKGluaGVyaXRhbmNlT2JqZWN0KTtcblx0XHRcdH1cblxuXHRcdFx0ZWxzZSBpZiAoZWwuaGFzQ2xhc3MoJ3BpLXJvdGF0b3InKSkge1xuXHRcdFx0XHRpbmhlcml0YW5jZU9iamVjdC5wYWdlckNsaWNrZWQgPSBkZWx0YSA/IGZhbHNlIDogdHJ1ZTtcblx0XHRcdFx0aW5oZXJpdGFuY2VPYmplY3QuY3ljbGUgPSBvcHRpb25zLmN5Y2xlO1xuXHRcdFx0XHTPgC5yb3RhdG9yLmNoYW5nZUZyYW1lKGluaGVyaXRhbmNlT2JqZWN0KTtcblx0XHRcdH1cblxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGlmKGN1cnJlbnRGcmFtZSkgY3VycmVudEZyYW1lLmtpbGxDbGFzcygnb24nKTtcblx0XHRcdFx0aW5oZXJpdGFuY2VPYmplY3QuaW5jb21pbmdGcmFtZS5hZGRDbGFzcygnb24nKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gd2FpdCBiZWZvcmUgcmUtZW5hYmxpbmdcblx0XHRcdHZhciBkdXJhdGlvbiA9IDEwMDA7IC8vIGRlZmF1bHQgZm9yIGZpcnN0UnVuXG5cblx0XHRcdGlmIChjdXJyZW50RnJhbWUpIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRkdXJhdGlvbiA9IGN1cnJlbnRGcmFtZS5jc3MoKS50cmFuc2l0aW9uRHVyYXRpb24uc3BsaXQoXCIsIFwiKS5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgY3VycmVudCl7XG5cdFx0XHRcdFx0XHRyZXR1cm4gTWF0aC5tYXgocGFyc2VGbG9hdChwcmV2KSwgcGFyc2VGbG9hdChjdXJyZW50KSk7XG5cdFx0XHRcdFx0fSkgKiAxMDAwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhdGNoKGUpIHtcblx0XHRcdFx0XHTPgC5IQUwuc2F5KDAsICfPgC1yb3RhdG9yIG5lZWRzIHlvdSB0byB0cmFuc2l0aW9uIGEgY3NzIHRyYW5zZm9ybSB0byBtYWtlIHlvdXIgaXRlbXMgbW92ZS4nKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRtb3ZpbmcgPSBmYWxzZTtcblx0XHRcdH0sIGR1cmF0aW9uKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBzaG93KGlkKXtcblx0XHR2YXIgbWZkID0gz4BkKGlkKTtcblx0XHRpZiAobWZkLmhhc0NsYXNzKCdwaS1tb2RhbC1vdmVybGF5JykpIHtcblx0XHRcdM+ALm1vZGFsT3ZlcmxheS5zaG93KGlkKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBoaWRlKGlkKXtcblx0XHR2YXIgbWZkID0gz4BkKGlkKTtcblx0XHRpZiAobWZkLmhhc0NsYXNzKCdwaS1tb2RhbC1vdmVybGF5JykpIHtcblx0XHRcdM+ALm1vZGFsT3ZlcmxheS5oaWRlKGlkLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRjb25zb2xlLmxvZyhcIndlIGp1c3QgaGlkIGFuIG92ZXJsYXlcIik7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdM+AKCcucGktbXVsdGktZnJhbWUtZGlzcGxheScpLmZvckVhY2goz4AubXVsdGlGcmFtZURpc3BsYXkuc3Bhd24pO1xuXHRcdM+ALnNldFRyaWdnZXJzKCdtdWx0aS1mcmFtZS1kaXNwbGF5Jywgz4AubXVsdGlGcmFtZURpc3BsYXkpO1xuXHR9XG5cblx0z4AubXVsdGlGcmFtZURpc3BsYXkgPSB7XG5cdFx0c2hvdzogc2hvdyxcblx0XHRoaWRlOiBoaWRlLFxuXHRcdHNwYXduOiBzcGF3blxuXHR9O1xuXG5cblx0z4AubW9kcy5wdXNoKGluaXQpO1xufSkoKTtcbiIsIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIM+ALXB1c2htZW51LmpzXG4gLy8gVE9ETzogIFVTQUdFIEFORCBBUEkgUkVGRVJFTkNFXG4gX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xuIERFUEVOREVOQ0lFUzpcblxuIEhBTC5qc1xuXG4gX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xuIERBVEEgQVRUUklCVVRFUzpcblxuIHNpZGU6IFtcImxlZnRcIiwgXCJyaWdodFwiXVxuIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cbiBNQVJLVVAgQU5EIERFRkFVTFRTOlxuXG5cdDxkaXYgY2xhc3M9XCJwaS1wdXNobWVudVwiIGlkPVwibXlQdXNoTWVudVwiPlxuXHRcdCA8dWw+XG5cdFx0XHQgPGxpPjxhIGhyZWY9XCIjXCI+Zm9vPC9hPjwvbGk+XG5cdFx0XHQgPGxpPjxhIGhyZWY9XCIjXCI+YmFyPC9hPjwvbGk+XG5cdFx0XHQgPGxpPjxhIGhyZWY9XCIjXCI+Z3Jvbms8L2E+PC9saT5cblx0XHRcdCA8bGk+PGEgaHJlZj1cIiNcIj5mbGVlYmxlczwvYT48L2xpPlxuXHRcdFx0IDxsaT48YSBocmVmPVwiI1wiPnNlcHVsdmVkYTwvYT48L2xpPlxuXHRcdCA8L3VsPlxuXHQ8L2Rpdj5cblxuZWxzZXdoZXJlLi4uXG5cbiA8YnV0dG9uIG9uY2xpY2s9XCLPgC1wdXNobWVudS5zaG93KCdteVB1c2hNZW51JylcIj5zaG93IG1lbnU8L2J1dHRvbj5cblxuIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cbiBHRU5FUkFURUQgSFRNTDpcblxuXHRcbiBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXG4gQVBJXG5cblxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuz4AucHVzaG1lbnUgPSAoZnVuY3Rpb24oKXtcblx0dmFyIGFsbFB1c2hNZW51cyA9IHt9O1xuXG5cdGZ1bmN0aW9uIGluaXQoKXtcblx0XHTPgCgnW2RhdGEtYXV0by1idXJnZXJdJykuZm9yRWFjaChmdW5jdGlvbihjb250YWluZXIpe1xuXHRcdFx0dmFyIGlkID0gY29udGFpbmVyLmdldEF0dHJpYnV0ZSgnZGF0YS1hdXRvLWJ1cmdlcicpO1xuXG5cdFx0XHR2YXIgYXV0b0J1cmdlciA9IM+AZChpZCkgfHwgz4AuZGl2KCdwaS1wdXNobWVudScsIGlkKTtcblx0XHRcdHZhciB1bCA9IGF1dG9CdXJnZXIuz4AxKCd1bCcpIHx8IM+ALnVsKCk7XG5cblx0XHRcdGNvbnRhaW5lci7PgCgnYVtocmVmXSwgYnV0dG9uJykuZm9yRWFjaChmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHRcdGlmICghYm9vbGVhbkF0dHJpYnV0ZVZhbHVlKG9iaiwgJ2RhdGEtYXV0by1idXJnZXItZXhjbHVkZScsIGZhbHNlKSkge1xuXHRcdFx0XHRcdHZhciBjbG9uZSA9IG9iai5jbG9uZU5vZGUodHJ1ZSk7XG5cdFx0XHRcdFx0Y2xvbmUuaWQgPSAnJztcblxuXHRcdFx0XHRcdGlmIChjbG9uZS50YWdOYW1lID09IFwiQlVUVE9OXCIpIHtcblx0XHRcdFx0XHRcdHZhciBhVGFnID0gz4Auc3JjRWxlbWVudCgnYScpO1xuXHRcdFx0XHRcdFx0YVRhZy5ocmVmID0gJyc7XG5cdFx0XHRcdFx0XHRhVGFnLmlubmVySFRNTCA9IGNsb25lLmlubmVySFRNTDtcblx0XHRcdFx0XHRcdGFUYWcub25jbGljayA9IGNsb25lLm9uY2xpY2s7XG5cdFx0XHRcdFx0XHRjbG9uZSA9IGFUYWc7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHVsLmFkZCjPgC5saSgwLCAwLCBjbG9uZSkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0YXV0b0J1cmdlci5hZGQodWwpO1xuXHRcdFx0z4AxKCdib2R5JykuYWRkKGF1dG9CdXJnZXIpO1xuXHRcdH0pO1xuXG5cdFx0z4AoXCIucGktcHVzaG1lbnVcIikuZm9yRWFjaChmdW5jdGlvbihlbCl7XG5cdFx0XHRhbGxQdXNoTWVudXNbZWwuaWRdID0gUHVzaE1lbnUoZWwpO1xuXHRcdH0pO1xuXG5cdFx0z4Auc2V0VHJpZ2dlcnMoJ3B1c2htZW51Jywgz4AucHVzaG1lbnUpO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2hvdyhvYmpJZCkge1xuXHRcdGFsbFB1c2hNZW51c1tvYmpJZF0uZXhwb3NlKCk7XG5cdH1cblxuXHQvLyBUT0RPOiBkaXNtaXNzIG9uIGNsaWNrP1xuXHQvLyB0aGlzIHdvcmtzOlxuXG5cdC8vz4AoJy5waS1wdXNobWVudSBsaSBhJykuZm9yRWFjaChmdW5jdGlvbihhKXtcblx0Ly9cdGEub25jbGljayA9IGZ1bmN0aW9uKCl7XG5cdC8vXHRcdHRoaXMucGFyZW50KCcucGktcHVzaG1lbnUnKS7PgDEoJy5waS1tb2RhbC1jbG9zZS1idXR0b24nKS5jbGljaygpO1xuXHQvL1x0XHRjb25zb2xlLmxvZyhcIm1lc3NhZ2VcIik7XG5cdC8vXHR9O1xuXHQvL30pO1xuXG5cblx0ZnVuY3Rpb24gUHVzaE1lbnUoZWwpIHtcblx0XHR2YXIgaHRtbCA9IM+AMSgnaHRtbCcpO1xuXHRcdHZhciBib2R5ID0gz4AxKCdib2R5Jyk7XG5cblx0XHR2YXIgb3ZlcmxheSA9IM+ALmRpdihcIm92ZXJsYXlcIik7XG5cdFx0dmFyIGNvbnRlbnQgPSDPgC5kaXYoJ2NvbnRlbnQnLCBudWxsLCBlbC7PgDEoJyonKSk7XG5cblx0XHR2YXIgc2lkZSA9IGVsLmdldEF0dHJpYnV0ZShcImRhdGEtc2lkZVwiKSB8fCBcInJpZ2h0XCI7XG5cblx0XHR2YXIgc2xlZCA9IM+ALmRpdihcInNsZWRcIik7XG5cdFx0c2xlZC5jc3Moc2lkZSwgMCk7XG5cblx0XHR2YXIgdG9wQmFyID0gz4AuZGl2KFwidG9wLWJhclwiKTtcblxuXHRcdHRvcEJhci5maWxsKM+ALm1vZGFsQ2xvc2VCdXR0b24oY2xvc2VNZSkpO1xuXHRcdHNsZWQuZmlsbChbdG9wQmFyLCBjb250ZW50XSk7XG5cblx0XHRvdmVybGF5LmZpbGwoc2xlZCk7XG5cdFx0ZWwuZmlsbChvdmVybGF5KTtcblxuXHRcdHNsZWQub25jbGljayA9IGZ1bmN0aW9uKGUpe1xuXHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHR9O1xuXG5cdFx0b3ZlcmxheS5vbmNsaWNrID0gY2xvc2VNZTtcblxuXHRcdM+ALmxpc3RlbihjbG9zZU1lLCAncmVzaXplJyk7XG5cblx0XHRmdW5jdGlvbiBjbG9zZU1lKGUpIHtcblx0XHRcdHZhciB0ID0gZS50YXJnZXQ7XG5cdFx0XHRpZiAodCA9PSBzbGVkIHx8IHQgPT0gdG9wQmFyKSByZXR1cm47XG5cblx0XHRcdGVsLmtpbGxDbGFzcyhcIm9uXCIpO1xuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRlbC5jc3Moe2Rpc3BsYXk6IFwibm9uZVwifSk7XG5cblx0XHRcdFx0Ym9keS5raWxsQ2xhc3MoXCJvdmVybGF5LW9uXCIpO1xuXHRcdFx0fSwgMzAwKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBleHBvc2VNZSgpe1xuXHRcdFx0Ym9keS5hZGRDbGFzcyhcIm92ZXJsYXktb25cIik7IC8vIGluIHRoZSBkZWZhdWx0IGNvbmZpZywga2lsbHMgYm9keSBzY3JvbGxpbmdcblxuXHRcdFx0ZWwuY3NzKHtcblx0XHRcdFx0ZGlzcGxheTogXCJibG9ja1wiLFxuXHRcdFx0XHR6SW5kZXg6IM+ALmhpZ2hlc3RaKClcblx0XHRcdH0pO1xuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRlbC5hZGRDbGFzcyhcIm9uXCIpO1xuXHRcdFx0fSwgMTApO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHRleHBvc2U6IGV4cG9zZU1lXG5cdFx0fTtcblx0fVxuXG5cdM+ALm1vZHMucHVzaChpbml0KTtcblxuXHRyZXR1cm4ge1xuXHRcdHNob3c6IHNob3dcblx0fTtcbn0pKCk7XG4iLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiDPgC1hY2NvcmRpb24uSlNcbiBVU0FHRSBBTkQgQVBJIFJFRkVSRU5DRVxuIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cbiBEQVRBIEFUVFJJQlVURVM6XG5cblx0dGl0bGU6IHRleHQgdGhhdCBhcHBlYXJzIG9uIHRoZSBjbGlja2FibGUgbGFiZWxcbiAgICBzaW5nbGU6IG1vcmUgdGhhbiBvbmUgY2hpbGQgb3BlbiBhdCBhIHRpbWU/XG4gX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xuIE1BUktVUCBBTkQgREVGQVVMVFM6XG5cbiAgIDxkaXYgY2xhc3M9XCJwaS1hY2NvcmRpb25cIiBpZD1cIm15QWNjb3JkaW9uXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwiaXRlbVwiIGRhdGEtdGl0bGU9XCJJdGVtIDFcIj5cbiAgICAgICAgIFRoaXMgaXMgdGhlIGNvbnRlbnQgZm9yIEl0ZW0gMVxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwiaXRlbVwiIGRhdGEtdGl0bGU9XCJJdGVtIDJcIj5cblxuICAgICAgICAgPCEtLSBuZXN0ZWQgYWNjb3JkaW9uIC0tPlxuICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiIGlkPVwibXlBY2NvcmRpb25cIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpdGVtXCIgZGF0YS10aXRsZT1cIkl0ZW0gMVwiPlxuICAgICAgICAgICAgICAgVGhpcyBpcyB0aGUgY29udGVudCBmb3IgSXRlbSAxXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpdGVtXCIgZGF0YS10aXRsZT1cIkl0ZW0gMlwiPlxuICAgICAgICAgICAgICAgVGhpcyBpcyB0aGUgY29udGVudCBmb3IgSXRlbSAyXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgIDwvZGl2PlxuICAgICAgICAgPCEtLSAvbmVzdGVkIGFjY29yZGlvbiAtLT5cblxuICAgICAgPC9kaXY+XG4gICA8L2Rpdj5cblxuIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cbiBHRU5FUkFURUQgSFRNTDpcblxuPGRpdiBjbGFzcz1cInBpLWFjY29yZGlvblwiIGlkPVwibXlBY2NvcmRpb25cIj5cblx0PGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxuXHRcdDxkaXYgY2xhc3M9XCJpdGVtXCIgZGF0YS10aXRsZT1cIkl0ZW0gMVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRpdGxlXCI+SXRlbSAxPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwid3JhcHBlclwiIHN0eWxlPVwiaGVpZ2h0OiAwcHg7XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRlbnRcIj5cblx0XHRcdFx0XHRUaGlzIGlzIHRoZSBjb250ZW50IGZvciBJdGVtIDFcblx0XHRcdFx0PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cdFx0PGRpdiBjbGFzcz1cIml0ZW1cIiBkYXRhLXRpdGxlPVwiSXRlbSAyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGl0bGVcIj5JdGVtIDI8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3cmFwcGVyXCIgc3R5bGU9XCJoZWlnaHQ6IDBweDtcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGVudFwiPlxuXHRcdFx0XHRcdCA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XG5cdFx0XHRcdFx0XHQgWyBORVNURUQgQ09ERSBJUyBJREVOVElDQUwgXVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cdDwvZGl2PlxuIDwvZGl2PlxuIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cbiBBUElcblxuIG5vbmVcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4oZnVuY3Rpb24oKXtcblx0dmFyIG1vdmluZyA9IGZhbHNlO1xuXHR2YXIgQ1NTX0JST1dTRVJfREVMQVlfSEFDSyA9IDI1O1xuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0z4AuY2xlYW4oaW5pdCk7XG5cblx0XHQvLyBUT0RPOiBydW5sb29wIHRvIGFuaW1hdGUgaW4gU2FmYXJpLiBtZWFudGltZTpcblx0XHRpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdDaHJvbWUnKSA9PSAtMSAmJiBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ1NhZmFyaScpICE9IC0xKXtcblx0XHRcdM+AMSgnYm9keScpLmFkZCjPgC5jb250ZW50RWxlbWVudCgnc3R5bGUnLCAwLCAwLCAnLnBpLWFjY29yZGlvbiAud3JhcHBlcnt0cmFuc2l0aW9uOiBub25lfScpKTtcblx0XHR9XG5cdFx0Ly8gR3Jvc3MuXG5cblxuXG5cblx0XHTPgCgnLnBpLWFjY29yZGlvbicpLmZvckVhY2goZnVuY3Rpb24oYWNjb3JkaW9uKXtcblx0XHRcdHZhciBjb250YWluZXIgPSDPgC5kaXYoJ2NvbnRhaW5lcicsIG51bGwsIGFjY29yZGlvbi5pbm5lckhUTUwpO1xuXHRcdFx0YWNjb3JkaW9uLmZpbGwoY29udGFpbmVyKTtcblx0XHRcdFBpQWNjb3JkaW9uKGNvbnRhaW5lcik7XG5cdFx0fSk7XG5cdH1cblxuXHRmdW5jdGlvbiBQaUFjY29yZGlvbihjb250YWluZXIpe1xuXHRcdGNvbnRhaW5lci7PgCgnOnNjb3BlID4gLml0ZW0nKS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdFx0dmFyIHRpdGxlVGV4dCA9IGl0ZW0uZGF0YXNldC50aXRsZTtcblx0XHRcdHZhciB0aXRsZSA9IM+ALmRpdigndGl0bGUnLCBudWxsLCB0aXRsZVRleHQpO1xuXG5cdFx0XHR2YXIgd3JhcHBlciA9IM+ALmRpdignd3JhcHBlcicpO1xuXHRcdFx0dmFyIGNvbnRlbnQgPSDPgC5kaXYoJ2NvbnRlbnQnLCBudWxsLCBpdGVtLmlubmVySFRNTCk7XG5cblx0XHRcdHdyYXBwZXIuZmlsbChjb250ZW50KTtcblx0XHRcdGl0ZW0uZmlsbChbdGl0bGUsIHdyYXBwZXJdKTtcblxuXHRcdFx0d3JhcHBlci5jc3Moe2hlaWdodDogMH0pO1xuXHRcdFx0dGl0bGUub25jbGljayA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmIChtb3ZpbmcpIHJldHVybjtcblx0XHRcdFx0bW92aW5nID0gdHJ1ZTtcblxuXHRcdFx0XHRpZiAoY29udGFpbmVyLmRhdGFzZXQuc2luZ2xlKSB7XG5cdFx0XHRcdFx0dmFyIG9wZW5TaWJsaW5ncyA9IGl0ZW0uc2libGluZ3MoKS5maWx0ZXIoZnVuY3Rpb24oc2liKXtyZXR1cm4gc2liLmhhc0NsYXNzKCdvbicpfSk7XG5cdFx0XHRcdFx0b3BlblNpYmxpbmdzLmZvckVhY2goZnVuY3Rpb24oc2libGluZyl7XG5cdFx0XHRcdFx0XHR0b2dnbGVJdGVtKHNpYmxpbmcpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdHRvZ2dsZUl0ZW0oaXRlbSk7XG5cdFx0XHRcdH0sIENTU19CUk9XU0VSX0RFTEFZX0hBQ0spO1xuXHRcdFx0fTtcblxuXHRcdFx0ZnVuY3Rpb24gdG9nZ2xlSXRlbSh0aGlzSXRlbSl7XG5cdFx0XHRcdHZhciB0aGlzV3JhcHBlciA9IHRoaXNJdGVtLs+AMSgnLndyYXBwZXInKTtcblx0XHRcdFx0dmFyIGNvbnRlbnRIZWlnaHQgPSB0aGlzV3JhcHBlci7PgDEoJy5jb250ZW50Jykub2Zmc2V0KCkuaGVpZ2h0ICsgJ3B4JztcblxuXHRcdFx0XHRpZiAodGhpc0l0ZW0uaGFzQ2xhc3MoJ29uJykpIHtcblx0XHRcdFx0XHQvLyBjbG9zZSB0aGlzSXRlbVxuXHRcdFx0XHRcdHRoaXNXcmFwcGVyLmNzcyh7aGVpZ2h0OiBjb250ZW50SGVpZ2h0fSk7XG5cdFx0XHRcdFx0dGhpc0l0ZW0ua2lsbENsYXNzKCdvbicpO1xuXHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdHRoaXNXcmFwcGVyLmNzcyh7aGVpZ2h0OiAwfSk7XG5cdFx0XHRcdFx0XHRtb3ZpbmcgPSBmYWxzZTtcblx0XHRcdFx0XHR9LCBDU1NfQlJPV1NFUl9ERUxBWV9IQUNLKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvL29wZW4gdGhpc0l0ZW1cblx0XHRcdFx0XHRpdGVtLmFkZENsYXNzKCdvbicpO1xuXHRcdFx0XHRcdHRoaXNXcmFwcGVyLmNzcyh7aGVpZ2h0OiBjb250ZW50SGVpZ2h0fSk7XG5cblx0XHRcdFx0XHR2YXIgZHVyYXRpb24gPSBwYXJzZUZsb2F0KHRoaXNXcmFwcGVyLmNzcygpLnRyYW5zaXRpb25EdXJhdGlvbikgKiAxMDAwO1xuXHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdHRoaXNXcmFwcGVyLmNzcyh7aGVpZ2h0OiAnJ30pO1xuXHRcdFx0XHRcdFx0bW92aW5nID0gZmFsc2U7XG5cdFx0XHRcdFx0fSwgZHVyYXRpb24pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHZhciBpbm5lckNvbnRhaW5lcnMgPSBjb250ZW50Ls+AKCc6c2NvcGUgPiAuY29udGFpbmVyJyk7XG5cdFx0XHRpZiAoaW5uZXJDb250YWluZXJzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0aW5uZXJDb250YWluZXJzLmZvckVhY2goUGlBY2NvcmRpb24pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0z4AubW9kcy5wdXNoKGluaXQpO1xufSkoKTtcbiIsIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIM+ALWRpYWxvZy5qc1xuIFVTQUdFIEFORCBBUEkgUkVGRVJFTkNFXG4gX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xuIERFUEVOREVOQ0lFUzpcblxuIM+ALmpzXG5cbiBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXG4gREFUQSBBVFRSSUJVVEVTOlxuXG4gX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xuIE1BUktVUCBBTkQgREVGQVVMVFM6XG5cbiA8ZGl2IGNsYXNzPVwibmV3X21vZHVsZVwiPlxuXG4gPC9kaXY+XG5cbiBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXG4gR0VORVJBVEVEIEhUTUw6XG5cbiA8ZGl2IGNsYXNzPVwibmV3X21vZHVsZVwiPlxuXG4gPC9kaXY+XG5cbiBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXG4gQVBJXG5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbihmdW5jdGlvbigpe1xuXHTPgC5kaWFsb2cgPSB7XG5cdFx0c2hvdzogz4AubW9kYWxPdmVybGF5LnNob3csXG5cdFx0c3Bhd246IHNwYXduLFxuXHRcdGFjdGlvbnM6IHt9XG5cdH07XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHTPgCgnLnBpLWRpYWxvZycpLmZvckVhY2goz4AuZGlhbG9nLnNwYXduKTtcblx0XHTPgC5zZXRUcmlnZ2VycygnZGlhbG9nJywgz4AubW9kYWxPdmVybGF5KTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNwYXduKGVsKXtcblx0XHR2YXIgY29udGVudEJveCA9IM+ALmRpdignY29udGVudC1ib3gnLCAwLCBlbC5pbm5lckhUTUwpO1xuXHRcdHZhciBkaWFsb2dCb3ggPSDPgC5kaXYoJ2RpYWxvZy1ib3gnLCAwLCBjb250ZW50Qm94KTtcblx0XHRlbC5maWxsKGRpYWxvZ0JveCk7XG5cblx0XHRpZiAoZWwuZGF0YXNldC50aXRsZSl7XG5cdFx0XHRkaWFsb2dCb3gucHJlcGVuZCjPgC5kaXYoJ3RpdGxlJywgMCwgZWwuZGF0YXNldC50aXRsZSkpO1xuXHRcdH1cblxuXHRcdGVsLs+AKCcuYnV0dG9ucyBidXR0b24nKS5mb3JFYWNoKGZ1bmN0aW9uKGJ1dHRvbil7XG5cdFx0XHRidXR0b24ub25jbGljayA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHZhciBhY3Rpb24gPSBidXR0b24uZ2V0QXR0cmlidXRlKCdwaS1kaWFsb2ctYWN0aW9uJyk7XG5cdFx0XHRcdGlmIChhY3Rpb24pe1xuXHRcdFx0XHRcdM+ALmRpYWxvZy5hY3Rpb25zW2FjdGlvbl0oKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0aWYgKCFidXR0b24uaGFzQXR0cmlidXRlKCdkYXRhLWJ5cGFzcycpKXtcblx0XHRcdFx0YnV0dG9uLmxpc3RlbihkaXNtaXNzLCAnY2xpY2snKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGlmICghYm9vbGVhbkF0dHJpYnV0ZVZhbHVlKGVsLCAnZGF0YS1pbmxpbmUnLCBmYWxzZSkpIHtcblx0XHRcdGVsLmFkZENsYXNzKCdwaS1tb2RhbC1vdmVybGF5Jyk7XG5cdFx0XHTPgC5tb2RhbE92ZXJsYXkuc3Bhd24oZWwpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGRpc21pc3MoKXtcblx0XHRcdGVsLs+AMSgnLnBpLW1vZGFsLWNsb3NlLWJ1dHRvbicpLmNsaWNrKCk7XG5cdFx0fVxuXHR9XG5cblxuXG5cdC8vIM+ALm1vZHMgYXJlIGxvYWRlZCBhZnRlciBET01Db250ZW50TG9hZGVkXG5cdM+ALm1vZHMucHVzaChpbml0KTtcbn0pKCk7IiwidmFyIGt1YiA9IChmdW5jdGlvbiAoKSB7XG5cdM+ALmxpc3Rlbihpbml0KTtcblxuXHR2YXIgSEVBREVSX0hFSUdIVDtcblx0dmFyIGh0bWwsIGJvZHksIG1haW5OYXYsIGhlYWRsaW5lcywgcXVpY2tzdGFydEJ1dHRvbiwgd2lzaEZpZWxkO1xuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0z4AuY2xlYW4oaW5pdCk7XG5cblx0XHRodG1sID0gz4AxKCdodG1sJyk7XG5cdFx0Ym9keSA9IM+AMSgnYm9keScpO1xuXHRcdG1haW5OYXYgPSDPgGQoXCJtYWluTmF2XCIpO1xuXHRcdGhlYWRsaW5lcyA9IM+AZCgnaGVhZGxpbmVXcmFwcGVyJyk7XG5cdFx0d2lzaEZpZWxkID0gz4BkKCd3aXNoRmllbGQnKTtcblx0XHRIRUFERVJfSEVJR0hUID0gz4AxKCdoZWFkZXInKS5vZmZzZXQoKS5oZWlnaHQ7XG5cblx0XHRxdWlja3N0YXJ0QnV0dG9uID0gz4BkKCdxdWlja3N0YXJ0QnV0dG9uJyk7XG5cblx0XHRidWlsZElubGluZVRPQygpO1xuXG5cdFx0c2V0WUFIKCk7XG5cblxuXHRcdGFkanVzdEV2ZXJ5dGhpbmcoKTtcblxuXHRcdM+ALmxpc3RlbihhZGp1c3RFdmVyeXRoaW5nLCAncmVzaXplJyk7XG5cdFx0z4AubGlzdGVuKGFkanVzdEV2ZXJ5dGhpbmcsICdzY3JvbGwnKTtcblx0XHTPgC5saXN0ZW4oaGFuZGxlS2V5c3Ryb2tlcywgJ2tleWRvd24nKTtcblx0XHR3aXNoRmllbGQubGlzdGVuKGhhbmRsZUtleXN0cm9rZXMsICdrZXlkb3duJyk7XG5cblx0XHRkb2N1bWVudC5vbnVubG9hZCA9IGZ1bmN0aW9uKCl7XG5cdFx0XHTPgC5jbGVhbihhZGp1c3RFdmVyeXRoaW5nLCAncmVzaXplJyk7XG5cdFx0XHTPgC5jbGVhbihhZGp1c3RFdmVyeXRoaW5nLCAnc2Nyb2xsJyk7XG5cdFx0XHTPgC5jbGVhbihoYW5kbGVLZXlzdHJva2VzLCAna2V5ZG93bicpO1xuXHRcdFx0d2lzaEZpZWxkLmNsZWFuKGhhbmRsZUtleXN0cm9rZXMsICdrZXlkb3duJyk7XG5cdFx0fTtcblxuXHRcdM+ALmxpc3RlbihjbG9zZU9wZW5NZW51LCAncmVzaXplJyk7XG5cblx0XHRmdW5jdGlvbiBjbG9zZU9wZW5NZW51KCkge1xuXHRcdFx0aWYgKGh0bWwuaGFzQ2xhc3MoJ29wZW4tbmF2JykpIHRvZ2dsZU1lbnUoKTtcblx0XHR9XG5cblx0XHTPgCgnLmRyb3Bkb3duJykuZm9yRWFjaChmdW5jdGlvbihkcm9wZG93bikge1xuXHRcdFx0dmFyIHJlYWRvdXQgPSBkcm9wZG93bi7PgDEoJy5yZWFkb3V0Jyk7XG5cdFx0XHRyZWFkb3V0LmlubmVySFRNTCA9IGRyb3Bkb3duLs+AMSgnYScpLmlubmVySFRNTDtcblx0XHRcdHJlYWRvdXQub25jbGljayA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0ZHJvcGRvd24udG9nZ2xlQ2xhc3MoJ29uJyk7XG5cdFx0XHRcdM+ALmxpc3RlbihjbG9zZU9wZW5Ecm9wZG93biwgJ2NsaWNrJyk7XG5cblx0XHRcdFx0ZnVuY3Rpb24gY2xvc2VPcGVuRHJvcGRvd24oZSkge1xuXHRcdFx0XHRcdGlmIChkcm9wZG93bi5oYXNDbGFzcygnb24nKSAmJiAhKGRyb3Bkb3duV2FzQ2xpY2tlZChlKSkpIHtcblx0XHRcdFx0XHRcdM+ALmNsZWFuKGNsb3NlT3BlbkRyb3Bkb3duLCAnY2xpY2snKTtcblx0XHRcdFx0XHRcdGRyb3Bkb3duLmtpbGxDbGFzcygnb24nKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmdW5jdGlvbiBkcm9wZG93bldhc0NsaWNrZWQoZSkge1xuXHRcdFx0XHRcdHJldHVybiBlLnRhcmdldC5pc0hlaXJPZkNsYXNzKCdkcm9wZG93bicpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH0pO1xuXG5cdFx0c2V0SW50ZXJ2YWwoc2V0Rm9vdGVyVHlwZSwgMTApO1xuXHR9XG5cblx0dmFyIHRvY0NvdW50ID0gMDtcblxuXHRmdW5jdGlvbiBidWlsZElubGluZVRPQygpIHtcblx0XHRpZiAobG9jYXRpb24uc2VhcmNoID09PSAnP3Rlc3QnKXtcblx0XHRcdHZhciBkb2NzQ29udGVudCA9IM+AZCgnZG9jc0NvbnRlbnQnKTtcblx0XHRcdHZhciBwYWdlVE9DID0gz4BkKCdwYWdlVE9DJyk7XG5cblx0XHRcdGlmIChwYWdlVE9DKSB7XG5cdFx0XHRcdHZhciBoZWFkZXJzID0gZG9jc0NvbnRlbnQua2lkcygnaDEsIGgyLCBoMywgaDQsIGg1Jyk7XG5cdFx0XHRcdHZhciB0b2MgPSDPgC51bCgpO1xuXHRcdFx0XHRwYWdlVE9DLmFkZCh0b2MpO1xuXG5cdFx0XHRcdGhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbiAoaGVhZGVyKSB7XG5cdFx0XHRcdFx0aGVhZGVyLmNzcyh7cGFkZGluZ1RvcDogcHgoSEVBREVSX0hFSUdIVCl9KTtcblxuXHRcdFx0XHRcdHZhciBhbmNob3JOYW1lID0gJ3BhZ2VUT0MnICsgdG9jQ291bnQrKztcblxuXHRcdFx0XHRcdHZhciBsaW5rID0gz4AuY29udGVudEVsZW1lbnQoJ2EnLCAwLCAwLCBoZWFkZXIuaW5uZXJIVE1MKTtcblx0XHRcdFx0XHRsaW5rLmhyZWYgPSAnIycgKyBhbmNob3JOYW1lO1xuXG5cdFx0XHRcdFx0dmFyIGFuY2hvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcblx0XHRcdFx0XHRhbmNob3IubmFtZSA9IGFuY2hvck5hbWU7XG5cdFx0XHRcdFx0ZG9jc0NvbnRlbnQuaW5zZXJ0QmVmb3JlKGFuY2hvciwgaGVhZGVyKTtcblxuXHRcdFx0XHRcdHRvYy5hZGQoz4AubGkoMCwgMCwgz4AuY29udGVudEVsZW1lbnQoJ2EnLCAwLCAwLCBsaW5rKSkpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRZQUgoKSB7XG5cdFx0dmFyIHBhdGhuYW1lID0gbG9jYXRpb24uaHJlZjtcblxuXHRcdHZhciBjdXJyZW50TGluayA9IG51bGw7XG5cblx0XHTPgGQoJ2RvY3NUb2MnKS7PgCgnYScpLmZvckVhY2goZnVuY3Rpb24gKGxpbmspIHtcblx0XHRcdGlmIChwYXRobmFtZS5pbmRleE9mKGxpbmsuaHJlZikgIT09IC0xKSB7XG5cdFx0XHRcdGN1cnJlbnRMaW5rID0gbGluaztcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGlmIChjdXJyZW50TGluaykge1xuXHRcdFx0Y29uc29sZS5sb2coXCJ5dXBcIik7XG5cdFx0XHRjdXJyZW50TGluay5wYXJlbnRzKCdkaXYuaXRlbScpLmZvckVhY2goZnVuY3Rpb24gKHBhcmVudCkge1xuXHRcdFx0XHRwYXJlbnQuYWRkQ2xhc3MoJ29uJyk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRGb290ZXJUeXBlKCkge1xuXHRcdGlmIChodG1sLmlkID09IFwiZG9jc1wiKSB7XG5cdFx0XHR2YXIgYm9keUhlaWdodCA9IM+AZCgnaGVybycpLm9mZnNldCgpLmhlaWdodCArIM+AZCgnZW5jeWNsb3BlZGlhJykub2Zmc2V0KCkuaGVpZ2h0O1xuXHRcdFx0dmFyIGZvb3RlciA9IM+AMSgnZm9vdGVyJyk7XG5cdFx0XHR2YXIgZm9vdGVySGVpZ2h0ID0gZm9vdGVyLm9mZnNldCgpLmhlaWdodDtcblx0XHRcdGJvZHkuY2xhc3NPbkNvbmRpdGlvbignZml4ZWQnLCB3aW5kb3cuaW5uZXJIZWlnaHQgLSBmb290ZXJIZWlnaHQgPiBib2R5SGVpZ2h0KTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBhZGp1c3RFdmVyeXRoaW5nKCkge1xuXHRcdGlmICghaHRtbC5oYXNDbGFzcygnb3Blbi1uYXYnKSkgSEVBREVSX0hFSUdIVCA9IM+AMSgnaGVhZGVyJykub2Zmc2V0KCkuaGVpZ2h0O1xuXG5cdFx0dmFyIFkgPSB3aW5kb3cucGFnZVlPZmZzZXQ7XG5cdFx0dmFyIG9mZnNldCA9IFkgLyAzO1xuXG5cdFx0aHRtbC5jbGFzc09uQ29uZGl0aW9uKCdmbGlwLW5hdicsIFkgPiAwKTtcblx0XHQvL2JvZHkuY3NzKHtiYWNrZ3JvdW5kUG9zaXRpb246ICcwICcgKyBweChvZmZzZXQpfSk7XG5cblx0XHRpZiAoaGVhZGxpbmVzKSB7XG5cdFx0XHR2YXIgaGVhZGxpbmVzQm90dG9tID0gaGVhZGxpbmVzLm9mZnNldCgpLnRvcCArIGhlYWRsaW5lcy5vZmZzZXQoKS5oZWlnaHQgLSBIRUFERVJfSEVJR0hUICsgWSAtIDMwOyAvLyAzMHB4IHJldmVhbCBhdCBib3R0b21cblx0XHRcdHZhciBxdWlja3N0YXJ0Qm90dG9tID0gaGVhZGxpbmVzQm90dG9tICsgcXVpY2tzdGFydEJ1dHRvbi5vZmZzZXQoKS5oZWlnaHQ7XG5cblx0XHRcdGhlYWRsaW5lcy5jc3Moe29wYWNpdHk6IFkgPT09IDAgPyAxIDogKFkgPiBoZWFkbGluZXNCb3R0b20gPyAwIDogMSAtIChZIC8gaGVhZGxpbmVzQm90dG9tKSl9KTtcblxuXHRcdFx0cXVpY2tzdGFydEJ1dHRvbi5jc3Moe29wYWNpdHk6IFkgPCBoZWFkbGluZXNCb3R0b20gPyAxIDogKFkgPiBxdWlja3N0YXJ0Qm90dG9tID8gMCA6IDEgLSAoKFkgLSBoZWFkbGluZXNCb3R0b20pIC8gKHF1aWNrc3RhcnRCb3R0b20gLSBoZWFkbGluZXNCb3R0b20pKSl9KTtcblxuXHRcdFx0aHRtbC5jbGFzc09uQ29uZGl0aW9uKCd5LWVub3VnaCcsIFkgPiBxdWlja3N0YXJ0Qm90dG9tKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiB0b2dnbGVNZW51KCkge1xuXHRcdGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IDgwMCkge1xuXHRcdFx0z4AucHVzaG1lbnUuc2hvdygncHJpbWFyeScpO1xuXHRcdH1cblxuXHRcdGVsc2Uge1xuXHRcdFx0dmFyIG5ld0hlaWdodCA9IEhFQURFUl9IRUlHSFQ7XG5cblx0XHRcdGlmICghaHRtbC5oYXNDbGFzcygnb3Blbi1uYXYnKSkge1xuXHRcdFx0XHRuZXdIZWlnaHQgPSBtYWluTmF2Lm9mZnNldCgpLmhlaWdodDtcblx0XHRcdH1cblxuXHRcdFx0z4AoJ2hlYWRlcicpLmNzcyh7aGVpZ2h0OiBweChuZXdIZWlnaHQpfSk7XG5cdFx0fVxuXG5cdFx0aHRtbC50b2dnbGVDbGFzcygnb3Blbi1uYXYnKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHN1Ym1pdFdpc2godGV4dGZpZWxkKSB7XG5cdFx0YWxlcnQoJ1lvdSB0eXBlZDogJyArIHRleHRmaWVsZC52YWx1ZSk7XG5cdFx0dGV4dGZpZWxkLnZhbHVlID0gJyc7XG5cdFx0dGV4dGZpZWxkLmJsdXIoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGhhbmRsZUtleXN0cm9rZXMoZSkge1xuXHRcdHN3aXRjaCAoZS53aGljaCkge1xuXHRcdFx0Y2FzZSAxMzoge1xuXHRcdFx0XHRpZiAoZS5jdXJyZW50VGFyZ2V0ID09PSB3aXNoRmllbGQpIHtcblx0XHRcdFx0XHRzdWJtaXRXaXNoKHdpc2hGaWVsZCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdGNhc2UgMjc6IHtcblx0XHRcdFx0aWYgKGh0bWwuaGFzQ2xhc3MoJ29wZW4tbmF2JykpIHtcblx0XHRcdFx0XHR0b2dnbGVNZW51KCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gc2hvd1ZpZGVvKCkge1xuXHRcdHZhciB2aWRlb0lmcmFtZSA9IM+AZChcInZpZGVvUGxheWVyXCIpLs+AMShcImlmcmFtZVwiKTtcblx0XHR2aWRlb0lmcmFtZS5zcmMgPSB2aWRlb0lmcmFtZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXVybFwiKTtcblx0XHTPgC5tb2RhbE92ZXJsYXkuc2hvdyhcInZpZGVvUGxheWVyXCIpO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHR0b2dnbGVNZW51OiB0b2dnbGVNZW51LFxuXHRcdHNob3dWaWRlbzogc2hvd1ZpZGVvXG5cdH07XG59KSgpO1xuXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
