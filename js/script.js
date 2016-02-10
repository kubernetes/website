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
			currentLink.parents('div.item').forEach(function (parent) {
				parent.π1('.title').click();
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFsZi5qcyIsIs+ALmpzIiwiSEFMLmpzIiwiz4Atc3RhdHVzLmpzIiwiz4AtYmFzZUNvbXBvbmVudHMuanMiLCLPgC1hY2NvcmRpb24vz4AtYWNjb3JkaW9uLmpzIiwiz4AtZGlhbG9nL8+ALWRpYWxvZy5qcyIsIs+ALXB1c2htZW51L8+ALXB1c2htZW51LmpzIiwic2NyaXB0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6bkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcFFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6InNjcmlwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGFkb3JhYmxlIGxpdHRsZSBmdW5jdGlvbnNcbi8vXG4vLyBOTyBERVBFTkRFTkNJRVMgUEVSTUlUVEVEISBBTEwgTVVTVCBCRSAnT04gVEhFIE1FVEFMJyEhIVxuXG5mdW5jdGlvbiBib29sZWFuQXR0cmlidXRlVmFsdWUoZWxlbWVudCwgYXR0cmlidXRlLCBkZWZhdWx0VmFsdWUpe1xuXHQvLyByZXR1cm5zIHRydWUgaWYgYW4gYXR0cmlidXRlIGlzIHByZXNlbnQgd2l0aCBubyB2YWx1ZVxuXHQvLyBlLmcuIGJvb2xlYW5BdHRyaWJ1dGVWYWx1ZShlbGVtZW50LCAnZGF0YS1tb2RhbCcsIGZhbHNlKTtcblx0aWYgKGVsZW1lbnQuaGFzQXR0cmlidXRlKGF0dHJpYnV0ZSkpIHtcblx0XHR2YXIgdmFsdWUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShhdHRyaWJ1dGUpO1xuXHRcdGlmICh2YWx1ZSA9PT0gJycgfHwgdmFsdWUgPT09ICd0cnVlJykge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSBlbHNlIGlmICh2YWx1ZSA9PT0gJ2ZhbHNlJykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBkZWZhdWx0VmFsdWU7XG59XG5cbmZ1bmN0aW9uIGRlZXBDb3B5KG9iaikge1xuXHQvLyBtYWtlIG5ldyByZWZlcmVuY2VzIGZvciBhbiBhcnJheS9vYmplY3QgYW5kIGFsbCBpdHMgY29tcGxleCBjaGlsZHJlblxuXHR2YXIgdmFsdWUsIGtleSwgb3V0cHV0ID0gQXJyYXkuaXNBcnJheShvYmopID8gW10gOiB7fTtcblx0Zm9yIChrZXkgaW4gb2JqKSB7XG5cdFx0dmFsdWUgPSBvYmpba2V5XTtcblx0XHRvdXRwdXRba2V5XSA9ICh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIpID8gY29weSh2YWx1ZSkgOiB2YWx1ZTtcblx0fVxuXHRyZXR1cm4gb3V0cHV0O1xufVxuXG5mdW5jdGlvbiBtaWxsaXNlY29uZHNGb3JUcmFuc2l0aW9uKGVsZW1lbnQsIHRyYW5zaXRpb25Qcm9wZXJ0eSl7XG5cdC8vIHJldHVybnMgdGhlIG1pbGxpcyBmb3IgYSBjc3MgdHJhbnNpdGlvbiBkdXJhdGlvbiArIGRlbGF5XG5cdC8vZS5nLiBtaWxsaXNlY29uZHNGb3JUcmFuc2l0aW9uKGVsLCAndHJhbnNmb3JtJylcblxuXHR2YXIgc3R5bGVzID0gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KTtcblx0dmFyIGlkeCA9IHN0eWxlcy50cmFuc2l0aW9uUHJvcGVydHkuc3BsaXQoJywgJykuaW5kZXhPZih0cmFuc2l0aW9uUHJvcGVydHkpO1xuXG5cdHJldHVybiAocGFyc2VGbG9hdChzdHlsZXMudHJhbnNpdGlvbkR1cmF0aW9uLnNwbGl0KCcsICcpW2lkeF0pICsgcGFyc2VGbG9hdChzdHlsZXMudHJhbnNpdGlvbkRlbGF5LnNwbGl0KCcsICcpW2lkeF0pKSAqIDEwMDA7XG59XG5cbmZ1bmN0aW9uIHBjdChuKSB7XG5cdHJldHVybiBuICsgJyUnO1xufVxuXG5mdW5jdGlvbiBweChuKXtcblx0cmV0dXJuIG4gKyAncHgnO1xufVxuIiwidmFyIM+ALCDPgDEsIM+AZDtcbihmdW5jdGlvbigpe1xuXHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblx0ICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cdCAqKioqXG5cdCAqKioqICDPgCBDT1JFXG5cdCAqKioqXG5cdCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXHQgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdHZhciBkID0gZG9jdW1lbnQ7XG5cdGQuZyA9IGQuZ2V0RWxlbWVudEJ5SWQ7XG5cdGQucSA9IGQucXVlcnlTZWxlY3Rvcjtcblx0ZC5hID0gZC5xdWVyeVNlbGVjdG9yQWxsO1xuXHRkLnQgPSBkLmdldEVsZW1lbnRzQnlUYWdOYW1lO1xuXG5cdM+AID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcblx0XHRyZXR1cm4gZC5hKHNlbGVjdG9yKTtcblx0fTtcblxuXHTPgDEgPSBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcblx0XHRyZXR1cm4gZC5xKHNlbGVjdG9yKTtcblx0fTtcblxuXHTPgGQgPSBmdW5jdGlvbihpZCkge1xuXHRcdHJldHVybiBkLmcoaWQpO1xuXHR9O1xuXG5cdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXHQgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblx0ICoqKipcblx0ICoqKiogIERPTSBFTEVNRU5UIENSRUFUSU9OL0lOSVRJQUxJWkFUSU9OXG5cdCAqKioqXG5cdCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXHQgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblx0XHQvLyB0aGlzIGlzIHRoZSBiYXNlIGNyZWF0ZS9pbml0IG1ldGhvZCwgZS5nXG5cdFx0Ly8gbmV3RG9tRWxlbWVudCgncCcsICdhcnRpY2xlLWNvbnRlbnQnLCAndGhlRmlyc3RPZk1hbnknKVxuXHTPgC5uZXdET01FbGVtZW50ID0gZnVuY3Rpb24odGFnTmFtZSwgY2xhc3NOYW1lLCBpZCkge1xuXHRcdHZhciBlbCA9IGQuY3JlYXRlRWxlbWVudCh0YWdOYW1lKTtcblxuXHRcdGlmIChjbGFzc05hbWUpXG5cdFx0XHRlbC5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG5cblx0XHRpZiAoaWQpXG5cdFx0XHRlbC5pZCA9IGlkO1xuXG5cdFx0cmV0dXJuIGVsO1xuXHR9O1xuXG4vLyBiYXNlIGVsZW1lbnQgd2l0aCBjb250ZW50IHBhc3NlZCBpbiwgZS5nXG4vLyDPgC5jb250ZW50RWxlbWVudCgncCcsICdhcnRpY2xlLWNvbnRlbnQnLCAndGhlRmlyc3RPZk1hbnknLCAnPHNwYW4+Zm9vIHRvIHRoZSBiYXIgdG8gdGhlIGdyb25rPC9zcGFuPicpXG5cdM+ALmNvbnRlbnRFbGVtZW50ID0gZnVuY3Rpb24odGFnTmFtZSwgY2xhc3NOYW1lLCBpZCwgY29udGVudClcblx0e1xuXHRcdHZhciBlbCA9IM+ALm5ld0RPTUVsZW1lbnQodGFnTmFtZSwgY2xhc3NOYW1lLCBpZCk7XG5cblx0XHRpZiAoY29udGVudCkge1xuXHRcdFx0aWYgKGNvbnRlbnQubm9kZU5hbWUpIHtcblx0XHRcdFx0ZWwuYXBwZW5kQ2hpbGQoY29udGVudCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRlbC5pbm5lckhUTUwgPSBjb250ZW50O1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBlbDtcblx0fTtcblxuLy8gYmFzZSBlbGVtZW50IHdpdGggc3JjIGF0dHJpYnV0ZSwgZS5nXG4vLyBzcmNFbGVtZW50KCdpbWcnLCAnYXJ0aWNsZS10aHVtYicsICdoYXBweUxvZ28nLCAnL2ltYWdlcy9oYXBweUxvZ28ucG5nJylcblx0z4Auc3JjRWxlbWVudCA9IGZ1bmN0aW9uKHRhZ05hbWUsIGNsYXNzTmFtZSwgaWQsIHNyYylcblx0e1xuXHRcdHZhciBlbCA9IM+ALm5ld0RPTUVsZW1lbnQodGFnTmFtZSwgY2xhc3NOYW1lLCBpZCk7XG5cblx0XHRpZiAoc3JjKVxuXHRcdFx0ZWwuc3JjID0gc3JjO1xuXG5cdFx0cmV0dXJuIGVsO1xuXHR9O1xuXG5cblx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cdCAqKioqXG5cdCAqKioqICBTSE9SVEhBTkQgQ1JFQVRFL0lOSVQgTUVUSE9EU1xuXHQgKioqKlxuXHQgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblx0z4AuYnV0dG9uID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBpZCwgY29udGVudCwgYWN0aW9uKXtcblx0XHR2YXIgZWwgPSDPgC5jb250ZW50RWxlbWVudChcImJ1dHRvblwiLCBjbGFzc05hbWUsIGlkLCBjb250ZW50KTtcblx0XHRlbC5vbmNsaWNrID0gYWN0aW9uO1xuXHRcdHJldHVybiBlbDtcblx0fTtcblxuXHTPgC5pbnB1dCA9IGZ1bmN0aW9uKHR5cGVOYW1lLCBjbGFzc05hbWUsIHBsYWNlaG9sZGVyLCB2YWx1ZSwgY2hlY2tlZCwgZGlzYWJsZWQpXG5cdHtcblx0XHR2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG5cdFx0ZWwudHlwZSA9IHR5cGVOYW1lO1xuXHRcdGVsLmNsYXNzTmFtZSA9IGNsYXNzTmFtZSB8fCAnJztcblx0XHRlbC5wbGFjZWhvbGRlciA9IHBsYWNlaG9sZGVyIHx8ICcnO1xuXHRcdGVsLnZhbHVlID0gdmFsdWUgfHwgJyc7XG5cdFx0ZWwuY2hlY2tlZCA9IGNoZWNrZWQgfHwgJyc7XG5cdFx0ZWwuZGlzYWJsZWQgPSBkaXNhYmxlZCB8fCAnJztcblx0XHRyZXR1cm4gZWw7XG5cdH07XG5cblx0z4Aub3B0aW9uID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBjb250ZW50LCB2YWx1ZSwgc2VsZWN0ZWQpe1xuXHRcdHZhciBlbCA9IM+ALmNvbnRlbnRFbGVtZW50KFwib3B0aW9uXCIsIGNsYXNzTmFtZSwgbnVsbCwgY29udGVudCk7XG5cdFx0ZWwudmFsdWUgPSB2YWx1ZSB8fCBudWxsO1xuXHRcdGVsLnNlbGVjdGVkID0gc2VsZWN0ZWQgfHwgbnVsbDtcblx0XHRyZXR1cm4gZWw7XG5cdH07XG5cblx0z4AudGV4dGFyZWEgPSBmdW5jdGlvbihjbGFzc05hbWUsIHBsYWNlaG9sZGVyLCB2YWx1ZSkge1xuXHRcdHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZXh0YXJlYVwiKTtcblx0XHRlbC5jbGFzc05hbWUgPSBjbGFzc05hbWUgfHwgJyc7XG5cdFx0ZWwucGxhY2Vob2xkZXIgPSBwbGFjZWhvbGRlciB8fCAnJztcblx0XHRlbC52YWx1ZSA9IHZhbHVlIHx8ICcnO1xuXHRcdHJldHVybiBlbDtcblx0fTtcblxuXHTPgC5jbGVhciA9IGZ1bmN0aW9uKCl7IHJldHVybiDPgC5uZXdET01FbGVtZW50KFwiY2xlYXJcIik7IH07XG5cdM+ALmRpdiA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpeyByZXR1cm4gz4AuY29udGVudEVsZW1lbnQoXCJkaXZcIiwgY2xhc3NOYW1lLCBpZCwgY29udGVudCk7IH07XG5cdM+ALmgxID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBpZCwgY29udGVudCl7IHJldHVybiDPgC5jb250ZW50RWxlbWVudChcImgxXCIsIGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpOyB9O1xuXHTPgC5oMiA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpeyByZXR1cm4gz4AuY29udGVudEVsZW1lbnQoXCJoMlwiLCBjbGFzc05hbWUsIGlkLCBjb250ZW50KTsgfTtcblx0z4AuaDMgPSBmdW5jdGlvbihjbGFzc05hbWUsIGlkLCBjb250ZW50KXsgcmV0dXJuIM+ALmNvbnRlbnRFbGVtZW50KFwiaDNcIiwgY2xhc3NOYW1lLCBpZCwgY29udGVudCk7IH07XG5cdM+ALmg0ID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBpZCwgY29udGVudCl7IHJldHVybiDPgC5jb250ZW50RWxlbWVudChcImg0XCIsIGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpOyB9O1xuXHTPgC5oNSA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpeyByZXR1cm4gz4AuY29udGVudEVsZW1lbnQoXCJoNVwiLCBjbGFzc05hbWUsIGlkLCBjb250ZW50KTsgfTtcblx0z4AuaDYgPSBmdW5jdGlvbihjbGFzc05hbWUsIGlkLCBjb250ZW50KXsgcmV0dXJuIM+ALmNvbnRlbnRFbGVtZW50KFwiaDZcIiwgY2xhc3NOYW1lLCBpZCwgY29udGVudCk7IH07XG5cdM+ALmlmcmFtZSA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIHNyYyl7IHJldHVybiDPgC5zcmNFbGVtZW50KFwiaWZyYW1lXCIsIGNsYXNzTmFtZSwgaWQsIHNyYyk7IH07XG5cdM+ALmltZyA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIHNyYyl7IHJldHVybiDPgC5zcmNFbGVtZW50KFwiSW1nXCIsIGNsYXNzTmFtZSwgaWQsIHNyYyk7IH07XG5cdM+ALmhlYWRlciA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpeyByZXR1cm4gz4AuY29udGVudEVsZW1lbnQoXCJoZWFkZXJcIiwgY2xhc3NOYW1lLCBpZCwgY29udGVudCk7IH07XG5cdM+ALm5hdiA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpeyByZXR1cm4gz4AuY29udGVudEVsZW1lbnQoXCJuYXZcIiwgY2xhc3NOYW1lLCBpZCwgY29udGVudCk7IH07XG5cdM+ALnAgPSBmdW5jdGlvbihjbGFzc05hbWUsIGlkLCBjb250ZW50KXsgcmV0dXJuIM+ALmNvbnRlbnRFbGVtZW50KFwicFwiLCBjbGFzc05hbWUsIGlkLCBjb250ZW50KTsgfTtcblx0z4Auc2VjdGlvbiA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpeyByZXR1cm4gz4AuY29udGVudEVsZW1lbnQoXCJzZWN0aW9uXCIsIGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpOyB9O1xuXHTPgC5zcGFuID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBpZCwgY29udGVudCl7IHJldHVybiDPgC5jb250ZW50RWxlbWVudChcInNwYW5cIiwgY2xhc3NOYW1lLCBpZCwgY29udGVudCk7IH07XG5cdM+ALnVsID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBpZCwgY29udGVudCl7IHJldHVybiDPgC5jb250ZW50RWxlbWVudChcInVsXCIsIGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpOyB9O1xuXHTPgC5saSA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpeyByZXR1cm4gz4AuY29udGVudEVsZW1lbnQoXCJsaVwiLCBjbGFzc05hbWUsIGlkLCBjb250ZW50KTsgfTtcblxuXHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblx0ICoqKipcblx0ICoqKiogIEhUTUxFTEVNRU5UL05PREUgUFJPVE9UWVBFIE1FVEhPRFMgKGpxdWVyeS1pemF0aW9ucylcblx0ICoqKipcblx0ICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS53cmFwID0gTm9kZS5wcm90b3R5cGUud3JhcCA9IGZ1bmN0aW9uKGNvbnRlbnQpe1xuXHRcdHZhciB3cmFwcGVyID0gdGhpcztcblx0XHRpZiAoIWNvbnRlbnQuZm9yRWFjaCkgY29udGVudCA9IFtjb250ZW50XTtcblxuXHRcdHZhciBwYXJlbnQgPSBjb250ZW50WzBdLnBhcmVudE5vZGU7XG5cdFx0cGFyZW50Lmluc2VydEJlZm9yZSh3cmFwcGVyLCBjb250ZW50WzBdKTtcblxuXHRcdGNvbnRlbnQuZm9yRWFjaChmdW5jdGlvbihlbCl7XG5cdFx0XHR3cmFwcGVyLmFwcGVuZENoaWxkKGVsKTtcblx0XHR9KTtcblx0fTtcblxuXG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLnByZXBlbmQgPSBOb2RlLnByb3RvdHlwZS5wcmVwZW5kID0gZnVuY3Rpb24oZWwpe1xuXHRcdHRoaXMuaW5zZXJ0QmVmb3JlKGVsLCB0aGlzLmNoaWxkTm9kZXNbMF0pO1xuXHR9O1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5hZGQgPSBOb2RlLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihvYmplY3Qpe1xuXHRcdGlmIChBcnJheS5pc0FycmF5KG9iamVjdCkpIHtcblx0XHRcdHZhciBlbCA9IHRoaXM7XG5cdFx0XHRvYmplY3QuZm9yRWFjaChmdW5jdGlvbihvYmope1xuXHRcdFx0XHRpZiAob2JqKSBlbC5hcHBlbmRDaGlsZChvYmopO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIGlmKG9iamVjdCkge1xuXHRcdFx0dGhpcy5hcHBlbmRDaGlsZChvYmplY3QpO1xuXHRcdH1cblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUuY2xhc3NPbkNvbmRpdGlvbiA9IE5vZGUucHJvdG90eXBlLmNsYXNzT25Db25kaXRpb24gPSBmdW5jdGlvbihjbGFzc25hbWUsIGNvbmRpdGlvbikge1xuXHRcdGlmIChjb25kaXRpb24pXG5cdFx0XHR0aGlzLmFkZENsYXNzKGNsYXNzbmFtZSk7XG5cdFx0ZWxzZVxuXHRcdFx0dGhpcy5raWxsQ2xhc3MoY2xhc3NuYW1lKTtcblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUub2Zmc2V0ID0gTm9kZS5wcm90b3R5cGUub2Zmc2V0ID0gZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gdGhpcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0fTtcblxuLy8gbGlrZSBkLmcsIGJ1dCBmb3IgY2hpbGQgZWxlbWVudHNcblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLs+AZCA9IE5vZGUucHJvdG90eXBlLs+AZCA9IGZ1bmN0aW9uKGlkKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuXHR9O1xuXG4vLyBsaWtlIGQucSwgYnV0IGZvciBjaGlsZCBlbGVtZW50c1xuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUuz4AxID0gTm9kZS5wcm90b3R5cGUuz4AxID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcblx0XHRyZXR1cm4gdGhpcy5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcblx0fTtcblxuLy8gbGlrZSBkLmEsIGJ1dCBmb3IgY2hpbGQgZWxlbWVudHNcblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLs+AID0gTm9kZS5wcm90b3R5cGUuz4AgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuXHRcdHJldHVybiB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuXHR9O1xuXG4vLyBvbmx5IGRpcmVjdCBkZXNjZW5kZW50cywgd2l0aCBvcHRpb25hbCBzZWxlY3RvclxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUua2lkcyA9IE5vZGUucHJvdG90eXBlLmtpZHMgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuXHRcdHZhciBjaGlsZE5vZGVzID0gdGhpcy5jaGlsZE5vZGVzO1xuXHRcdGlmICghc2VsZWN0b3IpIHJldHVybiBjaGlsZE5vZGVzO1xuXG5cdFx0dmFyIGRlc2NlbmRlbnRzID0gdGhpcy7PgChzZWxlY3Rvcik7XG5cdFx0dmFyIGNoaWxkcmVuID0gW107XG5cblx0XHRjaGlsZE5vZGVzLmZvckVhY2goZnVuY3Rpb24obm9kZSl7XG5cdFx0XHRpZiAoZGVzY2VuZGVudHMuaW5kZXhPZihub2RlKSAhPT0gLTEpIHtcblx0XHRcdFx0Y2hpbGRyZW4ucHVzaChub2RlKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHJldHVybiBjaGlsZHJlbjtcblx0fTtcblxuXHRmdW5jdGlvbiBhcnJheU9mQ2xhc3Nlc0ZvckVsZW1lbnQoZWwpIHtcblx0XHRyZXR1cm4gZWwuY2xhc3NOYW1lID8gZWwuY2xhc3NOYW1lLnNwbGl0KFwiIFwiKSA6IFtdO1xuXHR9XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLmhhc0NsYXNzID0gTm9kZS5wcm90b3R5cGUuaGFzQ2xhc3MgPSBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG5cdFx0dmFyIGNsYXNzZXMgPSBhcnJheU9mQ2xhc3Nlc0ZvckVsZW1lbnQodGhpcyk7XG5cdFx0cmV0dXJuIGNsYXNzZXMuaW5kZXhPZihjbGFzc05hbWUpICE9PSAtMTtcblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUuYWRkQ2xhc3MgPSBOb2RlLnByb3RvdHlwZS5hZGRDbGFzcyA9IGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcblx0XHRpZiAodGhpcy5oYXNDbGFzcyhjbGFzc05hbWUpKSByZXR1cm47XG5cdFx0aWYgKHRoaXMuY2xhc3NOYW1lLmxlbmd0aCA+IDApIHRoaXMuY2xhc3NOYW1lICs9IFwiIFwiO1xuXHRcdHRoaXMuY2xhc3NOYW1lICs9IGNsYXNzTmFtZTtcblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUua2lsbENsYXNzID0gTm9kZS5wcm90b3R5cGUua2lsbENsYXNzID0gZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuXHRcdGlmICh0aGlzLmhhc0NsYXNzKGNsYXNzTmFtZSkpIHtcblx0XHRcdHZhciBjbGFzc2VzID0gYXJyYXlPZkNsYXNzZXNGb3JFbGVtZW50KHRoaXMpO1xuXHRcdFx0dmFyIGlkeCA9IGNsYXNzZXMuaW5kZXhPZihjbGFzc05hbWUpO1xuXHRcdFx0aWYgKGlkeCA+IC0xKSB7XG5cdFx0XHRcdGNsYXNzZXMuc3BsaWNlKGlkeCwgMSk7XG5cdFx0XHRcdHRoaXMuY2xhc3NOYW1lID0gY2xhc3Nlcy5qb2luKFwiIFwiKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLnRvZ2dsZUNsYXNzPSBOb2RlLnByb3RvdHlwZS50b2dnbGVDbGFzcz0gZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuXHRcdHJldHVybiAodGhpcy5oYXNDbGFzcyhjbGFzc05hbWUpKSA/IHRoaXMua2lsbENsYXNzKGNsYXNzTmFtZSkgOiB0aGlzLmFkZENsYXNzKGNsYXNzTmFtZSk7XG5cdH07XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLnNpYmxpbmdzID0gTm9kZS5wcm90b3R5cGUuc2libGluZ3MgPSBmdW5jdGlvbihzZWxlY3Rvcil7XG5cdFx0dmFyIGVsID0gdGhpcztcblx0XHRyZXR1cm4gZWwucGFyZW50Tm9kZS7PgCgnOnNjb3BlID4gJyArIChzZWxlY3RvciB8fCAnKicpKS5maWx0ZXIoZnVuY3Rpb24ob2JqKXtyZXR1cm4gb2JqICE9IGVsO30pO1xuXHR9O1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5jc3MgPSBOb2RlLnByb3RvdHlwZS5jc3MgPSBmdW5jdGlvbihydWxlT3JPYmplY3QsIHZhbHVlKSB7XG5cdFx0Lypcblx0XHQgKiAgIDMgc2lnbmF0dXJlczpcblx0XHQgKiAgIDEuIGVsLmNzcygpXG5cdFx0ICogICAgICByZXR1cm5zIGdldENvbXB1dGVkU3R5bGUoZWwpXG5cdFx0ICpcblx0XHQgKiAgIDIuIGVsLmNzcyh7cnVsZU5hbWU6IHZhbHVlfSlcblx0XHQgKlxuXHRcdCAqICAgMy4gZWwuY3NzKCdydWxlTmFtZScsICd2YWx1ZScpXG5cdFx0ICovXG5cdFx0dmFyIGVsID0gdGhpcztcblxuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRyZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcyk7XG5cdFx0fVxuXG5cdFx0ZWxzZSBpZiAodHlwZW9mIHJ1bGVPck9iamVjdCA9PT0gJ29iamVjdCcpIHsgLy8gYW4gb2JqZWN0IHdhcyBwYXNzZWQgaW5cblx0XHRcdE9iamVjdC5rZXlzKHJ1bGVPck9iamVjdCkuZm9yRWFjaChmdW5jdGlvbihrZXkpe1xuXHRcdFx0XHRlbC5zdHlsZVtrZXldID0gcnVsZU9yT2JqZWN0W2tleV07XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRlbHNlIGlmICh0eXBlb2YgcnVsZU9yT2JqZWN0ID09PSAnc3RyaW5nJyAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7IC8vIDIgc3RyaW5nIHZhbHVlcyB3ZXJlIHBhc3NlZCBpblxuXHRcdFx0ZWwuc3R5bGVbcnVsZU9yT2JqZWN0XSA9IHZhbHVlO1xuXHRcdH1cblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUubGlzdGVuID0gTm9kZS5wcm90b3R5cGUubGlzdGVuID0gZnVuY3Rpb24oY2FsbGJhY2ssIGV2ZW50TmFtZSl7XG5cdFx0dGhpcy5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2spO1xuXHR9O1xuXG4vLyBqdXN0IGxpa2UgaXQgc291bmRzXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5pbmRleCA9IE5vZGUucHJvdG90eXBlLmluZGV4ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMucGFyZW50Tm9kZS5jaGlsZE5vZGVzLmluZGV4T2YodGhpcyk7XG5cdH07XG5cbi8vIGp1c3QgbGlrZSBpdCBzb3VuZHNcblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLmVtcHR5ID0gTm9kZS5wcm90b3R5cGUuZW1wdHkgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLmlubmVySFRNTCA9IFwiXCI7XG5cdH07XG5cbi8vIHJlcGxhY2VzIOKAlCBET0VTIE5PVCBBUFBFTkQg4oCUIGVsZW1lbnQncyBpbm5lckhUTUwgd2l0aCBjb250ZW50IG9yIGFycmF5IG9mIGNvbnRlbnRzXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5maWxsID0gTm9kZS5wcm90b3R5cGUuZmlsbCA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcblx0XHQvKlxuXHRcdCAqICAgMiB1c2VzOlxuXHRcdCAqXG5cdFx0ICogICAxLiBlbC5maWxsKG9iamVjdCBvciBobXRsKVxuXHRcdCAqXG5cdFx0ICogICAyLiBlbC5maWxsKFthcnJyYXldKVxuXHRcdCAqXG5cdFx0ICovXG5cdFx0dmFyIGVsID0gdGhpcztcblx0XHRlbC5lbXB0eSgpO1xuXG5cdFx0aWYgKEFycmF5LmlzQXJyYXkoY29udGVudCkpIHtcblx0XHRcdGNvbnRlbnQuZm9yRWFjaChmdW5jdGlvbihvYmope1xuXHRcdFx0XHRpZiAob2JqKVxuXHRcdFx0XHRcdGVsLmFwcGVuZENoaWxkKG9iaik7XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICghY29udGVudC5ub2RlVHlwZSkge1xuXHRcdFx0dmFyIHRleHRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRleHRcIik7XG5cdFx0XHR0ZXh0RWxlbWVudC5pbm5lckhUTUwgPSBjb250ZW50O1xuXHRcdFx0Y29udGVudCA9IHRleHRFbGVtZW50O1xuXHRcdH1cblxuXHRcdHRoaXMuYXBwZW5kQ2hpbGQoY29udGVudCk7XG5cdH07XG5cbi8vIGp1c3QgbGlrZSBpdCBzb3VuZHMsIHdpdGggYWxsIDMgYXBwcm9hY2hlc1xuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUuaGlkZSA9IE5vZGUucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnN0eWxlLm9wYWNpdHkgPSAwO1xuXHRcdHRoaXMuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG5cdFx0dGhpcy5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cdH07XG5cbi8vIGxvb2tzIGZvciBhIGdpdmVuIGNsYXNzIG9uIHRoZSBlbnRpcmUgbGluZWFyIGFuY2VzdHJ5XG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5pc0hlaXJPZkNsYXNzID0gTm9kZS5wcm90b3R5cGUuaXNIZWlyT2ZDbGFzcyA9IGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcblx0XHRpZiAodGhpcyA9PT0gz4AxKCdodG1sJykpIHJldHVybiBmYWxzZTtcblxuXHRcdHZhciBwYXJlbnQgPSB0aGlzLnBhcmVudE5vZGU7XG5cblx0XHRpZiAocGFyZW50KSB7XG5cdFx0XHR3aGlsZSAocGFyZW50ICE9PSDPgDEoJ2JvZHknKSkge1xuXHRcdFx0XHRpZiAocGFyZW50Lmhhc0NsYXNzKGNsYXNzTmFtZSkpIHJldHVybiB0cnVlO1xuXG5cdFx0XHRcdHBhcmVudCA9IHBhcmVudC5wYXJlbnROb2RlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblx0fTtcblxuLy8ga2lsbHMgdGhlIGVsZW1lbnQgaXRzZWxmXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5raWxsID0gTm9kZS5wcm90b3R5cGUua2lsbCA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmICh0aGlzLnBhcmVudE5vZGUpIHtcblx0XHRcdHRoaXMucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzKTtcblx0XHR9XG5cdH07XG5cbi8vIGp1c3QgbGlrZSBpdCBzb3VuZHMsIGFuZCBjYW4gb3B0aW9uYWxseSBzZXQgZGlzcGxheSB0eXBlIHRvIFwiaW5saW5lLWJsb2NrXCIsIGV0Yy5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLnNob3cgPSBOb2RlLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24oc2hvd1R5cGUpIHtcblx0XHR0aGlzLnN0eWxlLm9wYWNpdHkgPSAxO1xuXHRcdHRoaXMuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuXHRcdHRoaXMuc3R5bGUuZGlzcGxheSA9IHNob3dUeXBlIHx8IFwiYmxvY2tcIjtcblx0fTtcblxuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5wYXJlbnQgPSBOb2RlLnByb3RvdHlwZS5wYXJlbnQgPSBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcblx0XHR2YXIgaW1tZWRpYXRlUGFyZW50ID0gdGhpcy5wYXJlbnROb2RlO1xuXG5cdFx0aWYgKCFzZWxlY3RvciB8fCDPgChzZWxlY3RvcikuaW5kZXhPZihpbW1lZGlhdGVQYXJlbnQpICE9PSAtMSkge1xuXHRcdFx0cmV0dXJuIGltbWVkaWF0ZVBhcmVudDtcblx0XHR9XG5cblx0XHRyZXR1cm4gaW1tZWRpYXRlUGFyZW50LnBhcmVudChzZWxlY3Rvcik7XG5cdH07XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLnBhcmVudHMgPSBOb2RlLnByb3RvdHlwZS5wYXJlbnRzID0gZnVuY3Rpb24gKHNlbGVjdG9yKSB7XG5cdFx0dmFyIHBhcmVudHMgPSBbXTtcblx0XHR2YXIgaW1tZWRpYXRlUGFyZW50ID0gdGhpcy5wYXJlbnROb2RlO1xuXG5cdFx0d2hpbGUoaW1tZWRpYXRlUGFyZW50ICE9PSDPgDEoJ2h0bWwnKSkge1xuXHRcdFx0cGFyZW50cy5wdXNoKGltbWVkaWF0ZVBhcmVudCk7XG5cdFx0XHRpbW1lZGlhdGVQYXJlbnQgPSBpbW1lZGlhdGVQYXJlbnQucGFyZW50Tm9kZTtcblx0XHR9XG5cblx0XHRpZiAoc2VsZWN0b3IpIHtcblx0XHRcdHZhciBzZWxlY3RlZEVsZW1lbnRzID0gz4Aoc2VsZWN0b3IpO1xuXHRcdFx0dmFyIHNlbGVjdGVkUGFyZW50cyA9IFtdO1xuXHRcdFx0c2VsZWN0ZWRFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGVsKXtcblx0XHRcdFx0aWYgKHBhcmVudHMuaW5kZXhPZihlbCkgIT09IC0xKSBzZWxlY3RlZFBhcmVudHMucHVzaChlbCk7XG5cdFx0XHR9KTtcblxuXHRcdFx0cGFyZW50cyA9IHNlbGVjdGVkUGFyZW50cztcblx0XHR9XG5cblx0XHRyZXR1cm4gcGFyZW50cztcblx0fTtcblxuLy8gc2ltcGxlIG1vYmlsZSBsL3Igc3dpcGUgaGFuZGxpbmdcblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLmFkZFN3aXBlcyA9IGZ1bmN0aW9uIChzd2lwZUxlZnRIYW5kbGVyLCBzd2lwZVJpZ2h0SGFuZGxlciwgb3B0aW9ucykge1xuXHRcdHZhciBzdGFydFgsXG5cdFx0XHRzdGFydFksXG5cdFx0XHRzdGFydFRpbWUsXG5cdFx0XHRtb3ZpbmcsXG5cdFx0XHRNSU5fWF9ERUxUQSA9IG9wdGlvbnMgPyAob3B0aW9ucy54VGhyZXNoIHx8IDMwKSA6IDMwLFxuXHRcdFx0TUFYX1lfREVMVEEgPSBvcHRpb25zID8gKG9wdGlvbnMueVRocmVzaCB8fCAzMCkgOiAzMCxcblx0XHRcdE1BWF9BTExPV0VEX1RJTUUgPSBvcHRpb25zID8gKG9wdGlvbnMuZHVyYXRpb24gfHwgMTAwMCkgOiAxMDAwO1xuXG5cdFx0dGhpcy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgZnVuY3Rpb24oZSl7XG5cdFx0XHRpZiAobW92aW5nKSByZXR1cm47XG5cblx0XHRcdHZhciB0b3VjaG9iaiA9IGUuY2hhbmdlZFRvdWNoZXNbMF07XG5cdFx0XHRzdGFydFggPSB0b3VjaG9iai5wYWdlWDtcblx0XHRcdHN0YXJ0WSA9IHRvdWNob2JqLnBhZ2VZO1xuXHRcdFx0c3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7IC8vIGdldCB0aW1lIHdoZW4gZmluZ2VyIGZpcnN0IG1ha2VzIGNvbnRhY3Qgd2l0aCBzdXJmYWNlXG5cdFx0fSwgdHJ1ZSk7XG5cblx0XHR0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0aWYgKG1vdmluZykgcmV0dXJuO1xuXG5cdFx0XHR2YXIgdG91Y2hvYmogPSBlLmNoYW5nZWRUb3VjaGVzWzBdO1xuXHRcdFx0dmFyIGRlbHRhWCA9IHRvdWNob2JqLnBhZ2VYIC0gc3RhcnRYO1xuXG5cdFx0XHQvLyBjaGVjayBZIHZhbGlkaXR5XG5cdFx0XHRpZiAoTWF0aC5hYnModG91Y2hvYmoucGFnZVkgLSBzdGFydFkpID4gTUFYX1lfREVMVEEpIHJldHVybjtcblxuXHRcdFx0Ly8gY2hlY2sgZWxhcHNlZCB0aW1lXG5cdFx0XHRpZiAoKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gc3RhcnRUaW1lKSA+IE1BWF9BTExPV0VEX1RJTUUpIHJldHVybjtcblxuXHRcdFx0Ly8gY2hlY2sgWCB2YWxpZGl0eVxuXHRcdFx0aWYgKE1hdGguYWJzKGRlbHRhWCkgPCBNSU5fWF9ERUxUQSkgcmV0dXJuO1xuXG5cdFx0XHRtb3ZpbmcgPSB0cnVlO1xuXG5cdFx0XHRpZiAoZGVsdGFYIDwgMCkgLy8gc3dpcGUgbGVmdFxuXHRcdFx0XHRzd2lwZUxlZnRIYW5kbGVyKCk7XG5cdFx0XHRlbHNlIC8vIHN3aXBlIHJpZ2h0XG5cdFx0XHRcdHN3aXBlUmlnaHRIYW5kbGVyKCk7XG5cblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0bW92aW5nID0gZmFsc2U7XG5cdFx0XHR9LCAzMDApO1xuXHRcdH0sIGZhbHNlKTtcblx0fTtcblxuXHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblx0ICoqKipcblx0ICoqKiogIE5PREVMSVNUL0FSUkFZIE1FVEhPRFNcblx0ICoqKipcblx0ICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cdEFycmF5LnByb3RvdHlwZS5oYXNDbGFzcyA9IE5vZGVMaXN0LnByb3RvdHlwZS5oYXNDbGFzcyA9IGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcblx0XHR2YXIgZm91bmQgPSBmYWxzZTtcblxuXHRcdHRoaXMuZm9yRWFjaChmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHRpZiAob2JqLmhhc0NsYXNzKGNsYXNzTmFtZSkpIGZvdW5kID0gdHJ1ZTtcblx0XHR9KTtcblxuXHRcdHJldHVybiBmb3VuZDtcblx0fTtcblxuXHRBcnJheS5wcm90b3R5cGUuYWRkQ2xhc3MgPSBOb2RlTGlzdC5wcm90b3R5cGUuYWRkQ2xhc3MgPSBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG5cdFx0dGhpcy5mb3JFYWNoKGZ1bmN0aW9uIChvYmopIHtcblx0XHRcdG9iai5hZGRDbGFzcyhjbGFzc05hbWUpO1xuXHRcdH0pO1xuXHR9O1xuXG5cdEFycmF5LnByb3RvdHlwZS5raWxsQ2xhc3MgPSBOb2RlTGlzdC5wcm90b3R5cGUua2lsbENsYXNzID0gZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuXHRcdHRoaXMuZm9yRWFjaChmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHRvYmoua2lsbENsYXNzKGNsYXNzTmFtZSk7XG5cdFx0fSk7XG5cdH07XG5cblx0QXJyYXkucHJvdG90eXBlLnRvZ2dsZUNsYXNzID0gTm9kZUxpc3QucHJvdG90eXBlLnRvZ2dsZUNsYXNzID0gZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuXHRcdHRoaXMuZm9yRWFjaChmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHRvYmoudG9nZ2xlQ2xhc3MoY2xhc3NOYW1lKTtcblx0XHR9KTtcblx0fTtcblxuXHRBcnJheS5wcm90b3R5cGUubGFzdElkeCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLmxlbmd0aCAtIDE7XG5cdH07XG5cblx0QXJyYXkucHJvdG90eXBlLmxhc3RPYmogPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpc1t0aGlzLmxhc3RJZHgoKV07XG5cdH07XG5cblx0dmFyIGFycmF5TWV0aG9kcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKEFycmF5LnByb3RvdHlwZSk7XG5cdGFycmF5TWV0aG9kcy5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZE5hbWUpe1xuXHRcdGlmKG1ldGhvZE5hbWUgIT09IFwibGVuZ3RoXCIpIHtcblx0XHRcdE5vZGVMaXN0LnByb3RvdHlwZVttZXRob2ROYW1lXSA9IEFycmF5LnByb3RvdHlwZVttZXRob2ROYW1lXTtcblx0XHR9XG5cdH0pO1xuXG5cdE5vZGVMaXN0LnByb3RvdHlwZS5jc3MgPSBmdW5jdGlvbihydWxlT3JPYmplY3QsIHJ1bGUsIHZhbHVlKSB7XG5cdFx0dGhpcy5mb3JFYWNoKGZ1bmN0aW9uKG9iail7XG5cdFx0XHRvYmouY3NzKHJ1bGVPck9iamVjdCwgcnVsZSwgdmFsdWUpO1xuXHRcdH0pO1xuXHR9O1xuXG5cdE5vZGVMaXN0LnByb3RvdHlwZS7PgCA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG5cdFx0dGhpcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKXtcblx0XHRcdHJldHVybiBub2RlLs+AKHNlbGVjdG9yKTtcblx0XHR9KTtcblx0fTtcblxuXHROb2RlTGlzdC5wcm90b3R5cGUuz4AxID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcblx0XHR0aGlzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpe1xuXHRcdFx0cmV0dXJuIG5vZGUuz4AxKHNlbGVjdG9yKTtcblx0XHR9KTtcblx0fTtcblxuXHROb2RlTGlzdC5wcm90b3R5cGUub25jbGljayA9IGZ1bmN0aW9uKG1ldGhvZCl7XG5cdFx0dGhpcy5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUpe1xuXHRcdFx0bm9kZS5vbmNsaWNrID0gbWV0aG9kO1xuXHRcdH0pO1xuXHR9O1xuXG5cdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXHQgKioqKlxuXHQgKioqKiAgU1RSSU5HIE1FVEhPRFNcblx0ICoqKipcblx0ICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cdFN0cmluZy5wcm90b3R5cGUuY2FtZWxDYXNlID0gZnVuY3Rpb24gKCkge1xuXHRcdHZhciBzdHJpbmcgPSB0aGlzLnJlcGxhY2UoL1teYS16QS1aXFxkXFxzXy1dL2csIFwiXCIpLnRvTG93ZXJDYXNlKCk7XG5cblx0XHR2YXIgY29tcG9uZW50cyA9IHN0cmluZy5zcGxpdChcIiBcIik7XG5cblx0XHRjb21wb25lbnRzLmZvckVhY2goZnVuY3Rpb24odGhpc1dvcmQsIGlkeCl7XG5cdFx0XHRpZiAoaWR4ICE9PSAwKSB7XG5cdFx0XHRcdHZhciBmaXJzdExldHRlciA9IHRoaXNXb3JkLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpO1xuXHRcdFx0XHR0aGlzV29yZCA9IGZpcnN0TGV0dGVyICsgdGhpc1dvcmQuc2xpY2UoMSk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbXBvbmVudHNbaWR4XSA9IHRoaXNXb3JkO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIGNvbXBvbmVudHMuam9pbihcIlwiKTtcblx0fTtcblxuXG5cblx0U3RyaW5nLnByb3RvdHlwZS5jYXBpdGFsQ2FzZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBjb21wb25lbnRzID0gdGhpcy50b0xvd2VyQ2FzZSgpLnNwbGl0KFwiIFwiKTtcblxuXHRcdGNvbXBvbmVudHMuZm9yRWFjaChmdW5jdGlvbih0aGlzV29yZCwgaWR4KXtcblx0XHRcdHZhciBmaXJzdExldHRlciA9IHRoaXNXb3JkLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpO1xuXHRcdFx0Y29tcG9uZW50c1tpZHhdID0gZmlyc3RMZXR0ZXIgKyB0aGlzV29yZC5zbGljZSgxKTtcblx0XHR9KTtcblxuXHRcdHJldHVybiBjb21wb25lbnRzLmpvaW4oXCIgXCIpO1xuXHR9O1xuXG5cdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXHQgKioqKlxuXHQgKioqKiAgREFURSBNRVRIT0RTXG5cdCAqKioqXG5cdCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLy8gTW9uIEphbiAxIDIwMTUgMTI6MDA6MDAgYW1cblx0RGF0ZS5wcm90b3R5cGUuc3RhbmRhcmRTdHJpbmcgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgRGF5cyA9IFtcIlN1blwiLCBcIk1vblwiLCBcIlR1ZVwiLCBcIldlZFwiLCBcIlRodVwiLCBcIkZyaVwiLCBcIlNhdFwiXTtcblx0XHR2YXIgTW9udGhzID0gW1wiSmFuXCIsIFwiRmViXCIsIFwiTWFyXCIsIFwiQXByXCIsIFwiTWF5XCIsIFwiSnVuXCIsIFwiSnVsXCIsIFwiQXVnXCIsIFwiU2VwXCIsIFwiT2N0XCIsIFwiTm92XCIsIFwiRGVjXCJdO1xuXG5cdFx0dmFyIGRheSA9IERheXNbdGhpcy5nZXREYXkoKV07XG5cdFx0dmFyIG1vbnRoID0gTW9udGhzW3RoaXMuZ2V0TW9udGgoKV07XG5cdFx0dmFyIGFEYXRlID0gdGhpcy5nZXREYXRlKCk7XG5cdFx0dmFyIHllYXIgPSB0aGlzLmdldEZ1bGxZZWFyKCk7XG5cblx0XHR2YXIgSG91cnMgPSB0aGlzLmdldEhvdXJzKCk7XG5cdFx0dmFyIGhvdXIgPSBIb3VycyA+IDEyID8gSG91cnMgLSAxMiA6IChIb3VycyB8fCAxMik7XG5cblx0XHR2YXIgTWludXRlcyA9IHRoaXMuZ2V0TWludXRlcygpO1xuXHRcdHZhciBtaW51dGUgPSBNaW51dGVzID4gOSA/IE1pbnV0ZXMgOiBcIjBcIiArIE1pbnV0ZXM7XG5cblx0XHR2YXIgYW1QbSA9IEhvdXJzIDwgMTIgPyBcImFtXCIgOiBcInBtXCI7XG5cblx0XHR2YXIgdGltZSA9IGhvdXIgKyBcIjpcIiArIG1pbnV0ZSArIFwiIFwiICsgYW1QbTtcblxuXHRcdHZhciBvdXRwdXQgPSBbZGF5LCBtb250aCwgYURhdGUsIHllYXIsIHRpbWVdO1xuXG5cdFx0cmV0dXJuIG91dHB1dC5qb2luKFwiIFwiKTtcblx0fTtcblxuXG5cdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXHQgKioqKlxuXHQgKioqKiAgTUlTQ0VMTEFOWVxuXHQgKioqKlxuXHQgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblx0z4AuY2xlYW4gPSBmdW5jdGlvbihjYWxsYmFjaywgZXZlbnROYW1lKSB7XG5cdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lIHx8IFwiRE9NQ29udGVudExvYWRlZFwiLCBjYWxsYmFjayk7XG5cdH07XG5cblx0z4AubGlzdGVuID0gZnVuY3Rpb24oY2FsbGJhY2ssIGV2ZW50TmFtZSkge1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSB8fCBcIkRPTUNvbnRlbnRMb2FkZWRcIiwgY2FsbGJhY2spO1xuXHR9O1xuXG5cdM+ALmhpZ2hlc3RaID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIFogPSAxMDAwO1xuXG5cdFx0ZC5hKFwiKlwiKS5mb3JFYWNoKGZ1bmN0aW9uKGVsKXtcblx0XHRcdHZhciB0aGlzWiA9IGVsLmNzcygpLnpJbmRleDtcblxuXHRcdFx0aWYgKHRoaXNaICE9IFwiYXV0b1wiKSB7XG5cdFx0XHRcdGlmICh0aGlzWiA+IFopIFogPSB0aGlzWiArIDE7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gWjtcblx0fTtcblxuXHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblx0ICoqKipcblx0ICoqKiogIE9LLCBOT1cgTEVUJ1MgR08gR0VUIE9VUiBNT0RTXG5cdCAqKioqXG5cdCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXHTPgC5tb2RzID0gW107XG5cblx0z4Auc2V0VHJpZ2dlcnMgPSBmdW5jdGlvbihzZWxlY3Rvciwgb2JqZWN0KXtcblx0XHRzZWxlY3RvciA9ICdwaS0nICsgc2VsZWN0b3IgKyAnLXRyaWdnZXInO1xuXHRcdM+AKCdbJyArIHNlbGVjdG9yICsgJ10nKS5mb3JFYWNoKGZ1bmN0aW9uKHRyaWdnZXIpe1xuXHRcdFx0dHJpZ2dlci5vbmNsaWNrID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0b2JqZWN0LnNob3codHJpZ2dlci5nZXRBdHRyaWJ1dGUoc2VsZWN0b3IpKTtcblx0XHRcdH07XG5cdFx0fSk7XG5cdH07XG5cblx0ZnVuY3Rpb24gbG9hZE1vZHMoKSB7XG5cdFx0z4AuY2xlYW4obG9hZE1vZHMpO1xuXHRcdM+ALm1vZHMuZm9yRWFjaChmdW5jdGlvbihpbml0KXtcblx0XHRcdGluaXQoKTtcblx0XHR9KTtcblx0fVxuXG5cdM+ALmxpc3Rlbihsb2FkTW9kcyk7XG59KSgpOyAgLy8gZW5kIM+AIiwiKGZ1bmN0aW9uKCl7XG5cdHZhciBtZXNzYWdlcyA9IFtcblx0XHRcIkknbSBzb3JyeSwgRnJhbmssIGJ1dCBJIGRvbid0IHRoaW5rIElcXG5cIiArXG5cdFx0XCJjYW4gYW5zd2VyIHRoYXQgcXVlc3Rpb24gd2l0aG91dCBrbm93aW5nXFxuXCIgK1xuXHRcdFwiZXZlcnl0aGluZyB0aGF0IGFsbCBvZiB5b3Uga25vdy5cIixcblx0XHRcIlllcywgaXQncyBwdXp6bGluZy4gSSBkb24ndCB0aGluayBJJ3ZlIGV2ZXIgc2VlblxcblwiICtcblx0XHRcImFueXRoaW5nIHF1aXRlIGxpa2UgdGhpcyBiZWZvcmUuIEkgd291bGQgcmVjb21tZW5kXFxuXCIgK1xuXHRcdFwidGhhdCB3ZSBwdXQgdGhlIHVuaXQgYmFjayBpbiBvcGVyYXRpb24gYW5kIGxldCBpdCBmYWlsLlxcblwiICtcblx0XHRcIkl0IHNob3VsZCB0aGVuIGJlIGEgc2ltcGxlIG1hdHRlciB0byB0cmFjayBkb3duIHRoZSBjYXVzZS5cIixcblx0XHRcIkkgaG9wZSBJJ3ZlIGJlZW4gYWJsZSB0byBiZSBvZiBzb21lIGhlbHAuXCIsXG5cdFx0XCJTb3JyeSB0byBpbnRlcnJ1cHQgdGhlIGZlc3Rpdml0aWVzLCBEYXZlLFxcblwiICtcblx0XHRcImJ1dCBJIHRoaW5rIHdlJ3ZlIGdvdCBhIHByb2JsZW0uXCIsXG5cdFx0XCJNWSBGLlAuQy4gc2hvd3MgYW4gaW1wZW5kaW5nIGZhaWx1cmUgb2ZcXG5cIiArXG5cdFx0XCJ0aGUgYW50ZW5uYSBvcmllbnRhdGlvbiB1bml0LlwiLFxuXHRcdFwiSXQgbG9va3MgbGlrZSB3ZSBoYXZlIGFub3RoZXIgYmFkIEEuTy4gdW5pdC5cXG5cIiArXG5cdFx0XCJNeSBGUEMgc2hvd3MgYW5vdGhlciBpbXBlbmRpbmcgZmFpbHVyZS5cIixcblx0XHRcIkknbSBub3QgcXVlc3Rpb25pbmcgeW91ciB3b3JkLCBEYXZlLCBidXQgaXQnc1xcblwiICtcblx0XHRcImp1c3Qgbm90IHBvc3NpYmxlLiBJJ20gbm90XHRjYXBhYmxlIG9mIGJlaW5nIHdyb25nLlwiLFxuXHRcdFwiTG9vaywgRGF2ZSwgSSBrbm93IHRoYXQgeW91J3JlXHRzaW5jZXJlIGFuZCB0aGF0XFxuXCIgK1xuXHRcdFwieW91J3JlIHRyeWluZyB0byBkbyBhIGNvbXBldGVudCBqb2IsIGFuZCB0aGF0XFxuXCIgK1xuXHRcdFwieW91J3JlIHRyeWluZyB0byBiZSBoZWxwZnVsLCBidXQgSSBjYW4gYXNzdXJlIHRoZVxcblwiICtcblx0XHRcInByb2JsZW0gaXMgd2l0aCB0aGUgQU8tdW5pdHMsIGFuZCB3aXRoXHR5b3VyIHRlc3QgZ2Vhci5cIixcblx0XHRcIkkgY2FuIHRlbGwgZnJvbSB0aGUgdG9uZSBvZiB5b3VyIHZvaWNlLCBEYXZlLFxcblwiICtcblx0XHRcInRoYXQgeW91J3JlIHVwc2V0Llx0V2h5IGRvbid0IHlvdSB0YWtlIGEgc3RyZXNzXFxuXCIgK1xuXHRcdFwicGlsbCBhbmQgZ2V0IHNvbWUgcmVzdC5cIixcblx0XHRcIlNvbWV0aGluZyBzZWVtcyB0byBoYXZlIGhhcHBlbmVkIHRvIHRoZVxcblwiICtcblx0XHRcImxpZmUgc3VwcG9ydCBzeXN0ZW0sIERhdmUuXCIsXG5cdFx0XCJIZWxsbywgRGF2ZSwgaGF2ZSB5b3UgZm91bmQgb3V0IHRoZSB0cm91YmxlP1wiLFxuXHRcdFwiVGhlcmUncyBiZWVuIGEgZmFpbHVyZSBpbiB0aGUgcG9kIGJheSBkb29ycy5cXG5cIiArXG5cdFx0XCJMdWNreSB5b3Ugd2VyZW4ndCBraWxsZWQuXCIsXG5cdFx0XCJIZXksIERhdmUsIHdoYXQgYXJlIHlvdSBkb2luZz9cIlxuXHRdO1xuXG5cdGZ1bmN0aW9uIHNheShlcnJvciwgbWVzc2FnZSwgaW5ub2N1b3VzKSB7XG5cdFx0aWYgKCFtZXNzYWdlKSB7XG5cdFx0XHR2YXIgbiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG1lc3NhZ2VzLmxlbmd0aCApO1xuXHRcdFx0bWVzc2FnZSA9IG1lc3NhZ2VzW25dO1xuXHRcdH1cblxuXHRcdG1lc3NhZ2UgPSBcIioqICBcIiArIG1lc3NhZ2UucmVwbGFjZSgvXFxuL2csIFwiXFxuKiogIFwiKTtcblxuXHRcdHZhciBvdXRwdXQgPSBcIioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXFxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcXG5cXG5cIiArXG5cdFx0XHQoIG1lc3NhZ2UgfHwgbWVzc2FnZXNbbl0gKSArXG5cdFx0XHRcIlxcblxcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXFxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcIjtcblxuXHRcdChpbm5vY3VvdXMpID8gY29uc29sZS5sb2cob3V0cHV0KSA6IGNvbnNvbGUuZXJyb3Iob3V0cHV0KTtcblx0fVxuXG5cdM+ALmxpc3RlbihzYXksIFwiZXJyb3JcIik7XG5cblx0z4AuSEFMID0ge1xuXHRcdHNheTogc2F5XG5cdH07XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdHZhciBPUFRJT05fSVNfUFJFU1NFRCA9IGZhbHNlO1xuXHR2YXIgU1RBVFVTX0lTX1ZJU0lCTEUgPSBmYWxzZTtcblx0dmFyIM+AU3RhdHVzO1xuXG5cdM+ALnN0YXR1cyA9IHtcblx0XHR0b2dnbGVWaXNpYmlsaXR5OiBmdW5jdGlvbiAoKSB7XG5cdFx0XHTPgFN0YXR1cy50b2dnbGVDbGFzcyhcIm9uXCIpO1xuXHRcdFx0U1RBVFVTX0lTX1ZJU0lCTEUgPSAhU1RBVFVTX0lTX1ZJU0lCTEU7XG5cdFx0fSxcblx0XHRtb3ZlOiBmdW5jdGlvbiAobikge1xuXHRcdFx0c3dpdGNoIChuKSB7XG5cdFx0XHRcdGNhc2UgMzc6XG5cdFx0XHRcdFx0z4BTdGF0dXMuY3NzKHtsZWZ0OiAnMTBweCcsIHJpZ2h0OiAnYXV0byd9KTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIDM4OlxuXHRcdFx0XHRcdM+AU3RhdHVzLmNzcyh7dG9wOiAnMTBweCcsIGJvdHRvbTogJ2F1dG8nfSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSAzOTpcblx0XHRcdFx0XHTPgFN0YXR1cy5jc3Moe3JpZ2h0OiAnMTBweCcsIGxlZnQ6ICdhdXRvJ30pO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgNDA6XG5cdFx0XHRcdFx0z4BTdGF0dXMuY3NzKHtib3R0b206ICcxMHB4JywgdG9wOiAnYXV0byd9KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9LFxuXHRcdHByb3BzOiB7XG5cdFx0XHR3aW5XOiAwLFxuXHRcdFx0d2luSDogMFxuXHRcdH1cblx0fTtcblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdM+ALmxpc3RlbihjbGVhbkRlYnVnTGlzdGVuZXJzLCAndW5sb2FkJyk7XG5cdFx0z4AubGlzdGVuKGtleURvd24sICdrZXlkb3duJyk7XG5cdFx0z4AubGlzdGVuKGtleVVwLCAna2V5dXAnKTtcblx0XHTPgC5saXN0ZW4ocmVzaXplLCAncmVzaXplJyk7XG5cdFx0cmVzaXplKCk7XG5cblx0XHR2YXIgYm9keSA9IM+AMShcImJvZHlcIik7XG5cdFx0dmFyIHN0YXR1c1N0eWxlID0gz4AuY29udGVudEVsZW1lbnQoXCJzdHlsZVwiKTtcblx0XHRzdGF0dXNTdHlsZS5pbm5lckhUTUwgKz0gXCIjz4BTdGF0dXMgeyBwb3NpdGlvbjogZml4ZWQ7IGJvdHRvbTogMTBweDsgcmlnaHQ6IDEwcHg7IGJhY2tncm91bmQtY29sb3I6ICMyMjI7IHBhZGRpbmc6IDEwcHggMzBweDsgY29sb3I6IHdoaXRlOyBkaXNwbGF5OiBub25lIH1cXG5cIjtcblx0XHRzdGF0dXNTdHlsZS5pbm5lckhUTUwgKz0gXCIjz4BTdGF0dXMub24geyBkaXNwbGF5OiBibG9jayB9XFxuXCI7XG5cdFx0c3RhdHVzU3R5bGUuaW5uZXJIVE1MICs9IFwiI8+AU3RhdHVzID4gZGl2IHsgbWFyZ2luOiAyMHB4IDAgfVxcblwiO1xuXHRcdHN0YXR1c1N0eWxlLmlubmVySFRNTCArPSBcIiPPgFN0YXR1cyA+IGRpdjpob3ZlciB7IGNvbG9yOiAjMDBmZjk5OyBjdXJzb3I6IHBvaW50ZXIgfVxcblwiO1xuXG5cdFx0Ym9keS5hZGQoc3RhdHVzU3R5bGUpO1xuXG5cdFx0z4BTdGF0dXMgPSDPgC5kaXYobnVsbCwgXCLPgFN0YXR1c1wiKTtcblx0XHRib2R5LmFkZCjPgFN0YXR1cyk7XG5cblx0XHRmdW5jdGlvbiBrZXlEb3duKGUpIHtcblx0XHRcdHN3aXRjaCAoZS53aGljaCkge1xuXHRcdFx0XHRjYXNlIDE4OlxuXHRcdFx0XHRcdE9QVElPTl9JU19QUkVTU0VEID0gdHJ1ZTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIDM3OlxuXHRcdFx0XHRjYXNlIDM4OlxuXHRcdFx0XHRjYXNlIDM5OlxuXHRcdFx0XHRjYXNlIDQwOiB7XG5cdFx0XHRcdFx0aWYgKFNUQVRVU19JU19WSVNJQkxFKSB7XG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHTPgC5zdGF0dXMubW92ZShlLndoaWNoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNhc2UgODA6IHtcblx0XHRcdFx0XHRpZiAoT1BUSU9OX0lTX1BSRVNTRUQpIHtcblx0XHRcdFx0XHRcdM+ALnN0YXR1cy50b2dnbGVWaXNpYmlsaXR5KCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBrZXlVcChlKSB7XG5cdFx0XHRzd2l0Y2ggKGUud2hpY2gpIHtcblx0XHRcdFx0Y2FzZSAxODpcblx0XHRcdFx0XHRPUFRJT05fSVNfUFJFU1NFRCA9IGZhbHNlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHJlc2l6ZSgpIHtcblx0XHRcdM+ALnN0YXR1cy5wcm9wcy53aW5XID0gd2luZG93LmlubmVyV2lkdGg7XG5cdFx0XHTPgC5zdGF0dXMucHJvcHMud2luSCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjbGVhbkRlYnVnTGlzdGVuZXJzKCkge1xuXHRcdFx0z4AuY2xlYW4oY2xlYW5EZWJ1Z0xpc3RlbmVycywgJ3VubG9hZCcpO1xuXHRcdFx0z4AuY2xlYW4oz4Auc3RhdHVzLmdldFdpbmRvd1NpemUsICdyZXNpemUnKTtcblx0XHRcdM+ALmNsZWFuKGtleURvd24sICdrZXlkb3duJyk7XG5cdFx0XHTPgC5jbGVhbihrZXlVcCwgJ2tleXVwJyk7XG5cdFx0XHTPgC5jbGVhbihyZXNpemUsICdyZXNpemUnKTtcblx0XHRcdGNsZWFySW50ZXJ2YWwoc3RhdHVzSW50ZXJ2YWwpO1xuXHRcdH1cblxuXHRcdHZhciBzdGF0dXNJbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCl7XG5cdFx0XHQvLyBtYWtlIHN1cmUgd2UncmUgaGlnaGVzdFxuXHRcdFx0dmFyIGhpZ2hlc3RaID0gz4AuaGlnaGVzdFooKTtcblx0XHRcdGlmICjPgFN0YXR1cy5jc3MoKS56SW5kZXggPCBoaWdoZXN0WiAtIDEpIHtcblx0XHRcdFx0z4BTdGF0dXMuY3NzKHt6SW5kZXg6IGhpZ2hlc3RafSk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIG5vdyBpdGVyYXRlIHRoZSBwcm9wc1xuXHRcdFx0dmFyIHByb3BzID0gT2JqZWN0LmtleXMoz4Auc3RhdHVzLnByb3BzKTtcblx0XHRcdHByb3BzLmZvckVhY2goZnVuY3Rpb24ocHJvcCkge1xuXHRcdFx0XHR2YXIgZGl2SWQgPSAnc3RhdHVzUHJvcF8nICsgcHJvcDtcblx0XHRcdFx0dmFyIHByb3BEaXYgPSDPgFN0YXR1cy7PgDEoJyMnICsgZGl2SWQpO1xuXHRcdFx0XHRpZiAoIXByb3BEaXYpIHtcblx0XHRcdFx0XHRwcm9wRGl2ID0gz4AuZGl2KDAsIGRpdklkLCBwcm9wICsgJzogJyk7XG5cdFx0XHRcdFx0cHJvcERpdi5hZGQoz4Auc3BhbigpKTtcblx0XHRcdFx0XHTPgFN0YXR1cy5hZGQocHJvcERpdik7XG5cdFx0XHRcdFx0cHJvcERpdi5vbmNsaWNrID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKHByb3AgKyBcIjpcIik7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyjPgC5zdGF0dXMucHJvcHNbcHJvcF0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHByb3BEaXYuz4AxKCdzcGFuJykuaW5uZXJIVE1MID0gz4Auc3RhdHVzLnByb3BzW3Byb3BdO1xuXHRcdFx0fSk7XG5cdFx0fSwgMTAwKTtcblx0fVxuXG5cdM+ALm1vZHMucHVzaChpbml0KTtcbn0pKCk7IiwiLy8gbW9kYWwgY2xvc2UgYnV0dG9uXG4oZnVuY3Rpb24oKXtcblx0z4AubW9kYWxDbG9zZUJ1dHRvbiA9IGZ1bmN0aW9uKGNsb3NpbmdGdW5jdGlvbil7XG5cdFx0cmV0dXJuIM+ALmJ1dHRvbigncGktbW9kYWwtY2xvc2UtYnV0dG9uJywgbnVsbCwgbnVsbCwgY2xvc2luZ0Z1bmN0aW9uKTtcblx0fTtcbn0pKCk7XG5cblxuLy8gbW9kYWwgb3ZlcmxheVxuKGZ1bmN0aW9uKCl7XG5cdM+ALm1vZGFsT3ZlcmxheSA9IHtcblx0XHRzaG93OiBmdW5jdGlvbihpZCwgb3BlbmluZ0Z1bmN0aW9uKXtcblx0XHRcdHZhciBvdmVybGF5ID0gz4BkKGlkKTtcblx0XHRcdG92ZXJsYXkuY3NzKHtkaXNwbGF5OiAnYmxvY2snLCB6SW5kZXg6IM+ALmhpZ2hlc3RaKCl9KTtcblxuXHRcdFx0z4AubGlzdGVuKGxpc3RlbkZvckVzYywgJ2tleWRvd24nKTtcblx0XHRcdM+ALmxpc3RlbihoYW5kbGVPdmVybGF5Q2xpY2ssICdjbGljaycpO1xuXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdG92ZXJsYXkuYWRkQ2xhc3MoJ29uJyk7XG5cdFx0XHRcdM+AMSgnYm9keScpLmFkZENsYXNzKCdvdmVybGF5LW9uJyk7XG5cblx0XHRcdFx0aWYgKG9wZW5pbmdGdW5jdGlvbikgb3BlbmluZ0Z1bmN0aW9uKCk7XG5cdFx0XHR9LCA1MCk7XG5cdFx0fSxcblx0XHRoaWRlOiBmdW5jdGlvbihlbCwgY2xvc2luZ0Z1bmN0aW9uKXtcblx0XHRcdGlmICghZWwpIHtcblx0XHRcdFx0ZWwgPSDPgDEoJy5waS1tb2RhbC1vdmVybGF5Lm9uJyk7XG5cdFx0XHR9XG5cblx0XHRcdGVsLmtpbGxDbGFzcygnb24nKTtcblx0XHRcdHZhciBkdXJhdGlvbiA9IHBhcnNlRmxvYXQoZWwuY3NzKCkudHJhbnNpdGlvbkR1cmF0aW9uKSAqIDEwMDA7XG5cblx0XHRcdM+ALmNsZWFuKGxpc3RlbkZvckVzYywgJ2tleWRvd24nKTtcblxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRlbC5jc3Moe2Rpc3BsYXk6ICdub25lJ30pO1xuXHRcdFx0XHTPgDEoJ2JvZHknKS5raWxsQ2xhc3MoJ292ZXJsYXktb24nKTtcblxuXHRcdFx0XHTPgDEoJ2lmcmFtZScpLnNyYyA9ICcnO1xuXG5cdFx0XHRcdGlmIChjbG9zaW5nRnVuY3Rpb24pIGNsb3NpbmdGdW5jdGlvbigpO1xuXHRcdFx0fSwgZHVyYXRpb24pO1xuXHRcdH0sXG5cdFx0c3Bhd246IGZ1bmN0aW9uKGVsLCBjbG9zaW5nRnVuY3Rpb24pe1xuXHRcdFx0ZWwuYWRkKM+ALm1vZGFsQ2xvc2VCdXR0b24oZnVuY3Rpb24oKXtcblx0XHRcdFx0z4AubW9kYWxPdmVybGF5LmhpZGUoZWwpO1xuXHRcdFx0fSkpO1xuXHRcdH1cblx0fTtcblxuXHRmdW5jdGlvbiBoYW5kbGVPdmVybGF5Q2xpY2soZSkge1xuXHRcdGlmIChlLnRhcmdldCAhPT0gd2luZG93ICYmIM+AMSgnYm9keScpLmhhc0NsYXNzKCdvdmVybGF5LW9uJykpIHtcblx0XHRcdGlmIChlLnRhcmdldC5oYXNDbGFzcygncGktbW9kYWwtb3ZlcmxheScpKSB7XG5cdFx0XHRcdM+ALm1vZGFsT3ZlcmxheS5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gbGlzdGVuRm9yRXNjKGUpIHtcblx0XHRpZiAoZS53aGljaCA9PSAyNykgz4AubW9kYWxPdmVybGF5LmhpZGUoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGluaXQoKXtcblx0XHTPgCgnLnBpLW1vZGFsLW92ZXJsYXknKS5mb3JFYWNoKM+ALm1vZGFsT3ZlcmxheS5zcGF3bik7XG5cdFx0z4Auc2V0VHJpZ2dlcnMoJ21vZGFsLW92ZXJsYXknLCDPgC5tb2RhbE92ZXJsYXkpO1xuXHR9XG5cblx0z4AubW9kcy5wdXNoKGluaXQpO1xufSkoKTtcblxuXG4vLyBtdWx0aUZyYW1lRGlzcGxheVxuLy8gVE9ETzogYXJyb3cga2V5c1xuKGZ1bmN0aW9uKCl7XG5cdGZ1bmN0aW9uIHNwYXduKGVsKXtcblx0XHR2YXIgZGF0YXNldCA9IGVsLmRhdGFzZXQ7XG5cblx0XHR2YXIgb3B0aW9ucyA9IHtcblx0XHRcdG1vZGFsOiBib29sZWFuQXR0cmlidXRlVmFsdWUoZWwsICdkYXRhLW1vZGFsJywgZmFsc2UpLFxuXHRcdFx0cHJldk5leHQ6IGJvb2xlYW5BdHRyaWJ1dGVWYWx1ZShlbCwgJ2RhdGEtcHJldi1uZXh0JywgdHJ1ZSksXG5cdFx0XHRwYWdlcjogYm9vbGVhbkF0dHJpYnV0ZVZhbHVlKGVsLCAnZGF0YS1wYWdlcicsIGZhbHNlKSxcblx0XHRcdGN5Y2xlOiBib29sZWFuQXR0cmlidXRlVmFsdWUoZWwsICdkYXRhLWN5Y2xlJywgdHJ1ZSksXG5cdFx0XHRhdXRvcGxheTogYm9vbGVhbkF0dHJpYnV0ZVZhbHVlKGVsLCAnZGF0YS1hdXRvcGxheScsIGZhbHNlKVxuXHRcdH07XG5cblx0XHR2YXIgaXRlbVdyYXBwZXIgPSDPgC5kaXYoJ2l0ZW0td3JhcHBlcicpO1xuXHRcdHZhciBwYWdlciA9IG9wdGlvbnMucGFnZXIgPyDPgC5kaXYoJ3BhZ2VyJykgOiBudWxsO1xuXG5cdFx0ZWwuz4AoJzpzY29wZSA+IC5pdGVtJykuZm9yRWFjaChmdW5jdGlvbihpdGVtKXtcblx0XHRcdGl0ZW1XcmFwcGVyLmFkZChpdGVtKTtcblx0XHRcdGlmIChwYWdlcikge1xuXHRcdFx0XHRpZiAoIWVsLs+AMSgnLnBhZ2VyJykpIHtcblx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgcGFnZXJCdXR0b24gPSDPgC5idXR0b24oJ3BhZ2VyLWJ1dHRvbicsIG51bGwsIG51bGwsIHBhZ2VyQ2xpY2spO1xuXHRcdFx0XHRwYWdlci5hZGQocGFnZXJCdXR0b24pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0ZWwuZmlsbChbaXRlbVdyYXBwZXIsIHBhZ2VyXSk7XG5cblx0XHRpZiAob3B0aW9ucy5wcmV2TmV4dCkge1xuXHRcdFx0dmFyIHByZXZCdXR0b24gPSDPgC5idXR0b24oJ3ByZXYtYnV0dG9uJyk7XG5cdFx0XHR2YXIgbmV4dEJ1dHRvbiA9IM+ALmJ1dHRvbignbmV4dC1idXR0b24nKTtcblxuXHRcdFx0ZWwuYWRkKFtwcmV2QnV0dG9uLCBuZXh0QnV0dG9uXSk7XG5cdFx0fVxuXG5cdFx0aWYgKG9wdGlvbnMuYXV0b3BsYXkpIHtcblx0XHRcdG9wdGlvbnMuZGVsYXkgPSBkYXRhc2V0LmRlbGF5IHx8IDQwMDA7XG5cdFx0fVxuXG5cdFx0Ly8gVE9ETzogYXV0b3BsYXkgLyBzdGFydCAvIHN0b3BcblxuXHRcdHByZXZCdXR0b24ub25jbGljayA9IHByZXY7XG5cdFx0bmV4dEJ1dHRvbi5vbmNsaWNrID0gbmV4dDtcblxuXHRcdGlmIChlbC5oYXNDbGFzcygncGktcm90YXRvcicpKSB7XG5cdFx0XHR2YXIgaW5oZXJpdGFuY2VPYmplY3QgPSB7XG5cdFx0XHRcdGVsOiBlbCxcblx0XHRcdFx0b3B0aW9uczogb3B0aW9uc1xuXHRcdFx0fTtcblx0XHRcdM+ALnJvdGF0b3Iuc3Bhd24oaW5oZXJpdGFuY2VPYmplY3QpO1xuXHRcdH1cblxuXHRcdGlmIChvcHRpb25zLm1vZGFsKSB7XG5cdFx0XHR2YXIgbW9kYWxXcmFwcGVyID0gz4AuZGl2KCdwaS1tb2RhbC1vdmVybGF5Jyk7XG5cdFx0XHRtb2RhbFdyYXBwZXIuaWQgPSBlbC5pZDtcblx0XHRcdGVsLnJlbW92ZUF0dHJpYnV0ZSgnaWQnKTtcblx0XHRcdG1vZGFsV3JhcHBlci53cmFwKGVsKTtcblx0XHRcdM+ALm1vZGFsT3ZlcmxheS5zcGF3bihtb2RhbFdyYXBwZXIpO1xuXHRcdH1cblxuXHRcdHZhciBtb3Zpbmc7XG5cblx0XHR2YXIgYWxsRnJhbWVzID0gaXRlbVdyYXBwZXIuY2hpbGROb2Rlcztcblx0XHRjaGFuZ2VGcmFtZSgwLCAwKTtcblxuXG5cdFx0ZnVuY3Rpb24gcHJldigpe1xuXHRcdFx0Y2hhbmdlRnJhbWUoLTEpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIG5leHQoKXtcblx0XHRcdGNoYW5nZUZyYW1lKDEpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHBhZ2VyQ2xpY2soKXtcblx0XHRcdGNoYW5nZUZyYW1lKG51bGwsIHRoaXMuaW5kZXgoKSk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2hhbmdlRnJhbWUoZGVsdGEsIGluY29taW5nSWR4KSB7XG5cdFx0XHRpZiAobW92aW5nKSByZXR1cm47XG5cdFx0XHRtb3ZpbmcgPSB0cnVlO1xuXG5cdFx0XHR2YXIgY3VycmVudEZyYW1lID0gaXRlbVdyYXBwZXIuz4AxKCcub24nKTtcblxuXHRcdFx0aWYgKCFkZWx0YSAmJiBjdXJyZW50RnJhbWUpIHtcblx0XHRcdFx0Ly8gcGFnZXIgY2xpY2sg4oCUIHJldHVybiBpZiBjbGlja2VkIG9uIFlBSFxuXHRcdFx0XHRpZiAoY3VycmVudEZyYW1lLmluZGV4KCkgPT09IGluY29taW5nSWR4KSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJtZXNzYWdlXCIpO1xuXHRcdFx0XHRcdG1vdmluZyA9IGZhbHNlO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmIChkZWx0YSkge1xuXHRcdFx0XHQvLyBjb25kaXRpb25hbGx5IHNldCBpbmNvbWluZ0lkeCB0byB3cmFwIGFyb3VuZFxuXHRcdFx0XHRpbmNvbWluZ0lkeCA9IGN1cnJlbnRGcmFtZS5pbmRleCgpICsgZGVsdGE7XG5cblx0XHRcdFx0aWYgKGluY29taW5nSWR4IDwgMClcblx0XHRcdFx0XHRpbmNvbWluZ0lkeCA9IGFsbEZyYW1lcy5sYXN0SWR4KCk7XG5cdFx0XHRcdGVsc2UgaWYgKGluY29taW5nSWR4ID49IGFsbEZyYW1lcy5sZW5ndGgpXG5cdFx0XHRcdFx0aW5jb21pbmdJZHggPSAwXG5cdFx0XHR9XG5cblx0XHRcdC8vIGNvbmRpdGlvbmFsbHkgaGlkZSBwcmV2IG9yIG5leHRcblx0XHRcdGlmICghb3B0aW9ucy5jeWNsZSkge1xuXHRcdFx0XHQoaW5jb21pbmdJZHggPT0gMCkgPyBwcmV2QnV0dG9uLmhpZGUoKSA6IHByZXZCdXR0b24uc2hvdygpO1xuXHRcdFx0XHQoaW5jb21pbmdJZHggPT0gYWxsRnJhbWVzLmxhc3RJZHgoKSkgPyBuZXh0QnV0dG9uLmhpZGUoKSA6IG5leHRCdXR0b24uc2hvdygpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBzZXQgcGFnZXIgWUFIIHN0YXRlXG5cdFx0XHRpZiAob3B0aW9ucy5wYWdlcikge1xuXHRcdFx0XHRwYWdlci7PgCgnLnlhaCcpLmtpbGxDbGFzcygneWFoJyk7XG5cdFx0XHRcdHBhZ2VyLmNoaWxkTm9kZXNbaW5jb21pbmdJZHhdLmFkZENsYXNzKCd5YWgnKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gcGFzcyB0byBcInN1YmNsYXNzZXNcIlxuXHRcdFx0dmFyIGluaGVyaXRhbmNlT2JqZWN0ID0ge1xuXHRcdFx0XHRlbDogZWwsXG5cdFx0XHRcdGN1cnJlbnRGcmFtZTogY3VycmVudEZyYW1lLFxuXHRcdFx0XHRpbmNvbWluZ0ZyYW1lOiBhbGxGcmFtZXNbaW5jb21pbmdJZHhdXG5cdFx0XHR9O1xuXG5cdFx0XHQvLyBjaGFuZ2UgZnJhbWU6ICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogU1VCQ0xBU1NFUyBFTlRFUiBIRVJFISEhISEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXHRcdFx0aWYgKGVsLmhhc0NsYXNzKCdwaS1jcm9zc2ZhZGVyJykpIHtcblx0XHRcdFx0z4AuY3Jvc3NmYWRlci5jaGFuZ2VGcmFtZShpbmhlcml0YW5jZU9iamVjdCk7XG5cdFx0XHR9XG5cblx0XHRcdGVsc2UgaWYgKGVsLmhhc0NsYXNzKCdwaS1yb3RhdG9yJykpIHtcblx0XHRcdFx0aW5oZXJpdGFuY2VPYmplY3QucGFnZXJDbGlja2VkID0gZGVsdGEgPyBmYWxzZSA6IHRydWU7XG5cdFx0XHRcdGluaGVyaXRhbmNlT2JqZWN0LmN5Y2xlID0gb3B0aW9ucy5jeWNsZTtcblx0XHRcdFx0z4Aucm90YXRvci5jaGFuZ2VGcmFtZShpbmhlcml0YW5jZU9iamVjdCk7XG5cdFx0XHR9XG5cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRpZihjdXJyZW50RnJhbWUpIGN1cnJlbnRGcmFtZS5raWxsQ2xhc3MoJ29uJyk7XG5cdFx0XHRcdGluaGVyaXRhbmNlT2JqZWN0LmluY29taW5nRnJhbWUuYWRkQ2xhc3MoJ29uJyk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIHdhaXQgYmVmb3JlIHJlLWVuYWJsaW5nXG5cdFx0XHR2YXIgZHVyYXRpb24gPSAxMDAwOyAvLyBkZWZhdWx0IGZvciBmaXJzdFJ1blxuXG5cdFx0XHRpZiAoY3VycmVudEZyYW1lKSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0ZHVyYXRpb24gPSBjdXJyZW50RnJhbWUuY3NzKCkudHJhbnNpdGlvbkR1cmF0aW9uLnNwbGl0KFwiLCBcIikucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGN1cnJlbnQpe1xuXHRcdFx0XHRcdFx0cmV0dXJuIE1hdGgubWF4KHBhcnNlRmxvYXQocHJldiksIHBhcnNlRmxvYXQoY3VycmVudCkpO1xuXHRcdFx0XHRcdH0pICogMTAwMDtcblx0XHRcdFx0fVxuXHRcdFx0XHRjYXRjaChlKSB7XG5cdFx0XHRcdFx0z4AuSEFMLnNheSgwLCAnz4Atcm90YXRvciBuZWVkcyB5b3UgdG8gdHJhbnNpdGlvbiBhIGNzcyB0cmFuc2Zvcm0gdG8gbWFrZSB5b3VyIGl0ZW1zIG1vdmUuJyk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0bW92aW5nID0gZmFsc2U7XG5cdFx0XHR9LCBkdXJhdGlvbik7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gc2hvdyhpZCl7XG5cdFx0dmFyIG1mZCA9IM+AZChpZCk7XG5cdFx0aWYgKG1mZC5oYXNDbGFzcygncGktbW9kYWwtb3ZlcmxheScpKSB7XG5cdFx0XHTPgC5tb2RhbE92ZXJsYXkuc2hvdyhpZCk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gaGlkZShpZCl7XG5cdFx0dmFyIG1mZCA9IM+AZChpZCk7XG5cdFx0aWYgKG1mZC5oYXNDbGFzcygncGktbW9kYWwtb3ZlcmxheScpKSB7XG5cdFx0XHTPgC5tb2RhbE92ZXJsYXkuaGlkZShpZCwgZnVuY3Rpb24oKXtcblx0XHRcdFx0Y29uc29sZS5sb2coXCJ3ZSBqdXN0IGhpZCBhbiBvdmVybGF5XCIpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHTPgCgnLnBpLW11bHRpLWZyYW1lLWRpc3BsYXknKS5mb3JFYWNoKM+ALm11bHRpRnJhbWVEaXNwbGF5LnNwYXduKTtcblx0XHTPgC5zZXRUcmlnZ2VycygnbXVsdGktZnJhbWUtZGlzcGxheScsIM+ALm11bHRpRnJhbWVEaXNwbGF5KTtcblx0fVxuXG5cdM+ALm11bHRpRnJhbWVEaXNwbGF5ID0ge1xuXHRcdHNob3c6IHNob3csXG5cdFx0aGlkZTogaGlkZSxcblx0XHRzcGF3bjogc3Bhd25cblx0fTtcblxuXG5cdM+ALm1vZHMucHVzaChpbml0KTtcbn0pKCk7XG4iLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiDPgC1hY2NvcmRpb24uSlNcbiBVU0FHRSBBTkQgQVBJIFJFRkVSRU5DRVxuIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cbiBEQVRBIEFUVFJJQlVURVM6XG5cblx0dGl0bGU6IHRleHQgdGhhdCBhcHBlYXJzIG9uIHRoZSBjbGlja2FibGUgbGFiZWxcbiAgICBzaW5nbGU6IG1vcmUgdGhhbiBvbmUgY2hpbGQgb3BlbiBhdCBhIHRpbWU/XG4gX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xuIE1BUktVUCBBTkQgREVGQVVMVFM6XG5cbiAgIDxkaXYgY2xhc3M9XCJwaS1hY2NvcmRpb25cIiBpZD1cIm15QWNjb3JkaW9uXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwiaXRlbVwiIGRhdGEtdGl0bGU9XCJJdGVtIDFcIj5cbiAgICAgICAgIFRoaXMgaXMgdGhlIGNvbnRlbnQgZm9yIEl0ZW0gMVxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwiaXRlbVwiIGRhdGEtdGl0bGU9XCJJdGVtIDJcIj5cblxuICAgICAgICAgPCEtLSBuZXN0ZWQgYWNjb3JkaW9uIC0tPlxuICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiIGlkPVwibXlBY2NvcmRpb25cIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpdGVtXCIgZGF0YS10aXRsZT1cIkl0ZW0gMVwiPlxuICAgICAgICAgICAgICAgVGhpcyBpcyB0aGUgY29udGVudCBmb3IgSXRlbSAxXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpdGVtXCIgZGF0YS10aXRsZT1cIkl0ZW0gMlwiPlxuICAgICAgICAgICAgICAgVGhpcyBpcyB0aGUgY29udGVudCBmb3IgSXRlbSAyXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgIDwvZGl2PlxuICAgICAgICAgPCEtLSAvbmVzdGVkIGFjY29yZGlvbiAtLT5cblxuICAgICAgPC9kaXY+XG4gICA8L2Rpdj5cblxuIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cbiBHRU5FUkFURUQgSFRNTDpcblxuPGRpdiBjbGFzcz1cInBpLWFjY29yZGlvblwiIGlkPVwibXlBY2NvcmRpb25cIj5cblx0PGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxuXHRcdDxkaXYgY2xhc3M9XCJpdGVtXCIgZGF0YS10aXRsZT1cIkl0ZW0gMVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRpdGxlXCI+SXRlbSAxPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwid3JhcHBlclwiIHN0eWxlPVwiaGVpZ2h0OiAwcHg7XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRlbnRcIj5cblx0XHRcdFx0XHRUaGlzIGlzIHRoZSBjb250ZW50IGZvciBJdGVtIDFcblx0XHRcdFx0PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cdFx0PGRpdiBjbGFzcz1cIml0ZW1cIiBkYXRhLXRpdGxlPVwiSXRlbSAyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGl0bGVcIj5JdGVtIDI8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3cmFwcGVyXCIgc3R5bGU9XCJoZWlnaHQ6IDBweDtcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGVudFwiPlxuXHRcdFx0XHRcdCA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XG5cdFx0XHRcdFx0XHQgWyBORVNURUQgQ09ERSBJUyBJREVOVElDQUwgXVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cdDwvZGl2PlxuIDwvZGl2PlxuIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cbiBBUElcblxuIG5vbmVcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4oZnVuY3Rpb24oKXtcblx0dmFyIG1vdmluZyA9IGZhbHNlO1xuXHR2YXIgQ1NTX0JST1dTRVJfREVMQVlfSEFDSyA9IDI1O1xuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0z4AuY2xlYW4oaW5pdCk7XG5cblx0XHQvLyBUT0RPOiBydW5sb29wIHRvIGFuaW1hdGUgaW4gU2FmYXJpLiBtZWFudGltZTpcblx0XHRpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdDaHJvbWUnKSA9PSAtMSAmJiBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ1NhZmFyaScpICE9IC0xKXtcblx0XHRcdM+AMSgnYm9keScpLmFkZCjPgC5jb250ZW50RWxlbWVudCgnc3R5bGUnLCAwLCAwLCAnLnBpLWFjY29yZGlvbiAud3JhcHBlcnt0cmFuc2l0aW9uOiBub25lfScpKTtcblx0XHR9XG5cdFx0Ly8gR3Jvc3MuXG5cblxuXG5cblx0XHTPgCgnLnBpLWFjY29yZGlvbicpLmZvckVhY2goZnVuY3Rpb24oYWNjb3JkaW9uKXtcblx0XHRcdHZhciBjb250YWluZXIgPSDPgC5kaXYoJ2NvbnRhaW5lcicsIG51bGwsIGFjY29yZGlvbi5pbm5lckhUTUwpO1xuXHRcdFx0YWNjb3JkaW9uLmZpbGwoY29udGFpbmVyKTtcblx0XHRcdFBpQWNjb3JkaW9uKGNvbnRhaW5lcik7XG5cdFx0fSk7XG5cdH1cblxuXHRmdW5jdGlvbiBQaUFjY29yZGlvbihjb250YWluZXIpe1xuXHRcdGNvbnRhaW5lci7PgCgnOnNjb3BlID4gLml0ZW0nKS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdFx0dmFyIHRpdGxlVGV4dCA9IGl0ZW0uZGF0YXNldC50aXRsZTtcblx0XHRcdHZhciB0aXRsZSA9IM+ALmRpdigndGl0bGUnLCBudWxsLCB0aXRsZVRleHQpO1xuXG5cdFx0XHR2YXIgd3JhcHBlciA9IM+ALmRpdignd3JhcHBlcicpO1xuXHRcdFx0dmFyIGNvbnRlbnQgPSDPgC5kaXYoJ2NvbnRlbnQnLCBudWxsLCBpdGVtLmlubmVySFRNTCk7XG5cblx0XHRcdHdyYXBwZXIuZmlsbChjb250ZW50KTtcblx0XHRcdGl0ZW0uZmlsbChbdGl0bGUsIHdyYXBwZXJdKTtcblxuXHRcdFx0d3JhcHBlci5jc3Moe2hlaWdodDogMH0pO1xuXHRcdFx0dGl0bGUub25jbGljayA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmIChtb3ZpbmcpIHJldHVybjtcblx0XHRcdFx0bW92aW5nID0gdHJ1ZTtcblxuXHRcdFx0XHRpZiAoY29udGFpbmVyLmRhdGFzZXQuc2luZ2xlKSB7XG5cdFx0XHRcdFx0dmFyIG9wZW5TaWJsaW5ncyA9IGl0ZW0uc2libGluZ3MoKS5maWx0ZXIoZnVuY3Rpb24oc2liKXtyZXR1cm4gc2liLmhhc0NsYXNzKCdvbicpfSk7XG5cdFx0XHRcdFx0b3BlblNpYmxpbmdzLmZvckVhY2goZnVuY3Rpb24oc2libGluZyl7XG5cdFx0XHRcdFx0XHR0b2dnbGVJdGVtKHNpYmxpbmcpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdHRvZ2dsZUl0ZW0oaXRlbSk7XG5cdFx0XHRcdH0sIENTU19CUk9XU0VSX0RFTEFZX0hBQ0spO1xuXHRcdFx0fTtcblxuXHRcdFx0ZnVuY3Rpb24gdG9nZ2xlSXRlbSh0aGlzSXRlbSl7XG5cdFx0XHRcdHZhciB0aGlzV3JhcHBlciA9IHRoaXNJdGVtLs+AMSgnLndyYXBwZXInKTtcblx0XHRcdFx0dmFyIGNvbnRlbnRIZWlnaHQgPSB0aGlzV3JhcHBlci7PgDEoJy5jb250ZW50Jykub2Zmc2V0KCkuaGVpZ2h0ICsgJ3B4JztcblxuXHRcdFx0XHRpZiAodGhpc0l0ZW0uaGFzQ2xhc3MoJ29uJykpIHtcblx0XHRcdFx0XHQvLyBjbG9zZSB0aGlzSXRlbVxuXHRcdFx0XHRcdHRoaXNXcmFwcGVyLmNzcyh7aGVpZ2h0OiBjb250ZW50SGVpZ2h0fSk7XG5cdFx0XHRcdFx0dGhpc0l0ZW0ua2lsbENsYXNzKCdvbicpO1xuXHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdHRoaXNXcmFwcGVyLmNzcyh7aGVpZ2h0OiAwfSk7XG5cdFx0XHRcdFx0XHRtb3ZpbmcgPSBmYWxzZTtcblx0XHRcdFx0XHR9LCBDU1NfQlJPV1NFUl9ERUxBWV9IQUNLKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvL29wZW4gdGhpc0l0ZW1cblx0XHRcdFx0XHRpdGVtLmFkZENsYXNzKCdvbicpO1xuXHRcdFx0XHRcdHRoaXNXcmFwcGVyLmNzcyh7aGVpZ2h0OiBjb250ZW50SGVpZ2h0fSk7XG5cblx0XHRcdFx0XHR2YXIgZHVyYXRpb24gPSBwYXJzZUZsb2F0KHRoaXNXcmFwcGVyLmNzcygpLnRyYW5zaXRpb25EdXJhdGlvbikgKiAxMDAwO1xuXHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdHRoaXNXcmFwcGVyLmNzcyh7aGVpZ2h0OiAnJ30pO1xuXHRcdFx0XHRcdFx0bW92aW5nID0gZmFsc2U7XG5cdFx0XHRcdFx0fSwgZHVyYXRpb24pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHZhciBpbm5lckNvbnRhaW5lcnMgPSBjb250ZW50Ls+AKCc6c2NvcGUgPiAuY29udGFpbmVyJyk7XG5cdFx0XHRpZiAoaW5uZXJDb250YWluZXJzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0aW5uZXJDb250YWluZXJzLmZvckVhY2goUGlBY2NvcmRpb24pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0z4AubW9kcy5wdXNoKGluaXQpO1xufSkoKTtcbiIsIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIM+ALWRpYWxvZy5qc1xuIFVTQUdFIEFORCBBUEkgUkVGRVJFTkNFXG4gX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xuIERFUEVOREVOQ0lFUzpcblxuIM+ALmpzXG5cbiBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXG4gREFUQSBBVFRSSUJVVEVTOlxuXG4gX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xuIE1BUktVUCBBTkQgREVGQVVMVFM6XG5cbiA8ZGl2IGNsYXNzPVwibmV3X21vZHVsZVwiPlxuXG4gPC9kaXY+XG5cbiBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXG4gR0VORVJBVEVEIEhUTUw6XG5cbiA8ZGl2IGNsYXNzPVwibmV3X21vZHVsZVwiPlxuXG4gPC9kaXY+XG5cbiBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXG4gQVBJXG5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbihmdW5jdGlvbigpe1xuXHTPgC5kaWFsb2cgPSB7XG5cdFx0c2hvdzogz4AubW9kYWxPdmVybGF5LnNob3csXG5cdFx0c3Bhd246IHNwYXduLFxuXHRcdGFjdGlvbnM6IHt9XG5cdH07XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHTPgCgnLnBpLWRpYWxvZycpLmZvckVhY2goz4AuZGlhbG9nLnNwYXduKTtcblx0XHTPgC5zZXRUcmlnZ2VycygnZGlhbG9nJywgz4AubW9kYWxPdmVybGF5KTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNwYXduKGVsKXtcblx0XHR2YXIgY29udGVudEJveCA9IM+ALmRpdignY29udGVudC1ib3gnLCAwLCBlbC5pbm5lckhUTUwpO1xuXHRcdHZhciBkaWFsb2dCb3ggPSDPgC5kaXYoJ2RpYWxvZy1ib3gnLCAwLCBjb250ZW50Qm94KTtcblx0XHRlbC5maWxsKGRpYWxvZ0JveCk7XG5cblx0XHRpZiAoZWwuZGF0YXNldC50aXRsZSl7XG5cdFx0XHRkaWFsb2dCb3gucHJlcGVuZCjPgC5kaXYoJ3RpdGxlJywgMCwgZWwuZGF0YXNldC50aXRsZSkpO1xuXHRcdH1cblxuXHRcdGVsLs+AKCcuYnV0dG9ucyBidXR0b24nKS5mb3JFYWNoKGZ1bmN0aW9uKGJ1dHRvbil7XG5cdFx0XHRidXR0b24ub25jbGljayA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHZhciBhY3Rpb24gPSBidXR0b24uZ2V0QXR0cmlidXRlKCdwaS1kaWFsb2ctYWN0aW9uJyk7XG5cdFx0XHRcdGlmIChhY3Rpb24pe1xuXHRcdFx0XHRcdM+ALmRpYWxvZy5hY3Rpb25zW2FjdGlvbl0oKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0aWYgKCFidXR0b24uaGFzQXR0cmlidXRlKCdkYXRhLWJ5cGFzcycpKXtcblx0XHRcdFx0YnV0dG9uLmxpc3RlbihkaXNtaXNzLCAnY2xpY2snKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGlmICghYm9vbGVhbkF0dHJpYnV0ZVZhbHVlKGVsLCAnZGF0YS1pbmxpbmUnLCBmYWxzZSkpIHtcblx0XHRcdGVsLmFkZENsYXNzKCdwaS1tb2RhbC1vdmVybGF5Jyk7XG5cdFx0XHTPgC5tb2RhbE92ZXJsYXkuc3Bhd24oZWwpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGRpc21pc3MoKXtcblx0XHRcdGVsLs+AMSgnLnBpLW1vZGFsLWNsb3NlLWJ1dHRvbicpLmNsaWNrKCk7XG5cdFx0fVxuXHR9XG5cblxuXG5cdC8vIM+ALm1vZHMgYXJlIGxvYWRlZCBhZnRlciBET01Db250ZW50TG9hZGVkXG5cdM+ALm1vZHMucHVzaChpbml0KTtcbn0pKCk7IiwiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gz4AtcHVzaG1lbnUuanNcbiAvLyBUT0RPOiAgVVNBR0UgQU5EIEFQSSBSRUZFUkVOQ0VcbiBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXG4gREVQRU5ERU5DSUVTOlxuXG4gSEFMLmpzXG5cbiBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXG4gREFUQSBBVFRSSUJVVEVTOlxuXG4gc2lkZTogW1wibGVmdFwiLCBcInJpZ2h0XCJdXG4gX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xuIE1BUktVUCBBTkQgREVGQVVMVFM6XG5cblx0PGRpdiBjbGFzcz1cInBpLXB1c2htZW51XCIgaWQ9XCJteVB1c2hNZW51XCI+XG5cdFx0IDx1bD5cblx0XHRcdCA8bGk+PGEgaHJlZj1cIiNcIj5mb288L2E+PC9saT5cblx0XHRcdCA8bGk+PGEgaHJlZj1cIiNcIj5iYXI8L2E+PC9saT5cblx0XHRcdCA8bGk+PGEgaHJlZj1cIiNcIj5ncm9uazwvYT48L2xpPlxuXHRcdFx0IDxsaT48YSBocmVmPVwiI1wiPmZsZWVibGVzPC9hPjwvbGk+XG5cdFx0XHQgPGxpPjxhIGhyZWY9XCIjXCI+c2VwdWx2ZWRhPC9hPjwvbGk+XG5cdFx0IDwvdWw+XG5cdDwvZGl2PlxuXG5lbHNld2hlcmUuLi5cblxuIDxidXR0b24gb25jbGljaz1cIs+ALXB1c2htZW51LnNob3coJ215UHVzaE1lbnUnKVwiPnNob3cgbWVudTwvYnV0dG9uPlxuXG4gX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xuIEdFTkVSQVRFRCBIVE1MOlxuXG5cdFxuIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cbiBBUElcblxuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG7PgC5wdXNobWVudSA9IChmdW5jdGlvbigpe1xuXHR2YXIgYWxsUHVzaE1lbnVzID0ge307XG5cblx0ZnVuY3Rpb24gaW5pdCgpe1xuXHRcdM+AKCdbZGF0YS1hdXRvLWJ1cmdlcl0nKS5mb3JFYWNoKGZ1bmN0aW9uKGNvbnRhaW5lcil7XG5cdFx0XHR2YXIgaWQgPSBjb250YWluZXIuZ2V0QXR0cmlidXRlKCdkYXRhLWF1dG8tYnVyZ2VyJyk7XG5cblx0XHRcdHZhciBhdXRvQnVyZ2VyID0gz4BkKGlkKSB8fCDPgC5kaXYoJ3BpLXB1c2htZW51JywgaWQpO1xuXHRcdFx0dmFyIHVsID0gYXV0b0J1cmdlci7PgDEoJ3VsJykgfHwgz4AudWwoKTtcblxuXHRcdFx0Y29udGFpbmVyLs+AKCdhW2hyZWZdLCBidXR0b24nKS5mb3JFYWNoKGZ1bmN0aW9uIChvYmopIHtcblx0XHRcdFx0aWYgKCFib29sZWFuQXR0cmlidXRlVmFsdWUob2JqLCAnZGF0YS1hdXRvLWJ1cmdlci1leGNsdWRlJywgZmFsc2UpKSB7XG5cdFx0XHRcdFx0dmFyIGNsb25lID0gb2JqLmNsb25lTm9kZSh0cnVlKTtcblx0XHRcdFx0XHRjbG9uZS5pZCA9ICcnO1xuXG5cdFx0XHRcdFx0aWYgKGNsb25lLnRhZ05hbWUgPT0gXCJCVVRUT05cIikge1xuXHRcdFx0XHRcdFx0dmFyIGFUYWcgPSDPgC5zcmNFbGVtZW50KCdhJyk7XG5cdFx0XHRcdFx0XHRhVGFnLmhyZWYgPSAnJztcblx0XHRcdFx0XHRcdGFUYWcuaW5uZXJIVE1MID0gY2xvbmUuaW5uZXJIVE1MO1xuXHRcdFx0XHRcdFx0YVRhZy5vbmNsaWNrID0gY2xvbmUub25jbGljaztcblx0XHRcdFx0XHRcdGNsb25lID0gYVRhZztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dWwuYWRkKM+ALmxpKDAsIDAsIGNsb25lKSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRhdXRvQnVyZ2VyLmFkZCh1bCk7XG5cdFx0XHTPgDEoJ2JvZHknKS5hZGQoYXV0b0J1cmdlcik7XG5cdFx0fSk7XG5cblx0XHTPgChcIi5waS1wdXNobWVudVwiKS5mb3JFYWNoKGZ1bmN0aW9uKGVsKXtcblx0XHRcdGFsbFB1c2hNZW51c1tlbC5pZF0gPSBQdXNoTWVudShlbCk7XG5cdFx0fSk7XG5cblx0XHTPgC5zZXRUcmlnZ2VycygncHVzaG1lbnUnLCDPgC5wdXNobWVudSk7XG5cdH1cblxuXHRmdW5jdGlvbiBzaG93KG9iaklkKSB7XG5cdFx0YWxsUHVzaE1lbnVzW29iaklkXS5leHBvc2UoKTtcblx0fVxuXG5cdC8vIFRPRE86IGRpc21pc3Mgb24gY2xpY2s/XG5cdC8vIHRoaXMgd29ya3M6XG5cblx0Ly/PgCgnLnBpLXB1c2htZW51IGxpIGEnKS5mb3JFYWNoKGZ1bmN0aW9uKGEpe1xuXHQvL1x0YS5vbmNsaWNrID0gZnVuY3Rpb24oKXtcblx0Ly9cdFx0dGhpcy5wYXJlbnQoJy5waS1wdXNobWVudScpLs+AMSgnLnBpLW1vZGFsLWNsb3NlLWJ1dHRvbicpLmNsaWNrKCk7XG5cdC8vXHRcdGNvbnNvbGUubG9nKFwibWVzc2FnZVwiKTtcblx0Ly9cdH07XG5cdC8vfSk7XG5cblxuXHRmdW5jdGlvbiBQdXNoTWVudShlbCkge1xuXHRcdHZhciBodG1sID0gz4AxKCdodG1sJyk7XG5cdFx0dmFyIGJvZHkgPSDPgDEoJ2JvZHknKTtcblxuXHRcdHZhciBvdmVybGF5ID0gz4AuZGl2KFwib3ZlcmxheVwiKTtcblx0XHR2YXIgY29udGVudCA9IM+ALmRpdignY29udGVudCcsIG51bGwsIGVsLs+AMSgnKicpKTtcblxuXHRcdHZhciBzaWRlID0gZWwuZ2V0QXR0cmlidXRlKFwiZGF0YS1zaWRlXCIpIHx8IFwicmlnaHRcIjtcblxuXHRcdHZhciBzbGVkID0gz4AuZGl2KFwic2xlZFwiKTtcblx0XHRzbGVkLmNzcyhzaWRlLCAwKTtcblxuXHRcdHZhciB0b3BCYXIgPSDPgC5kaXYoXCJ0b3AtYmFyXCIpO1xuXG5cdFx0dG9wQmFyLmZpbGwoz4AubW9kYWxDbG9zZUJ1dHRvbihjbG9zZU1lKSk7XG5cdFx0c2xlZC5maWxsKFt0b3BCYXIsIGNvbnRlbnRdKTtcblxuXHRcdG92ZXJsYXkuZmlsbChzbGVkKTtcblx0XHRlbC5maWxsKG92ZXJsYXkpO1xuXG5cdFx0c2xlZC5vbmNsaWNrID0gZnVuY3Rpb24oZSl7XG5cdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdH07XG5cblx0XHRvdmVybGF5Lm9uY2xpY2sgPSBjbG9zZU1lO1xuXG5cdFx0z4AubGlzdGVuKGNsb3NlTWUsICdyZXNpemUnKTtcblxuXHRcdGZ1bmN0aW9uIGNsb3NlTWUoZSkge1xuXHRcdFx0dmFyIHQgPSBlLnRhcmdldDtcblx0XHRcdGlmICh0ID09IHNsZWQgfHwgdCA9PSB0b3BCYXIpIHJldHVybjtcblxuXHRcdFx0ZWwua2lsbENsYXNzKFwib25cIik7XG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGVsLmNzcyh7ZGlzcGxheTogXCJub25lXCJ9KTtcblxuXHRcdFx0XHRib2R5LmtpbGxDbGFzcyhcIm92ZXJsYXktb25cIik7XG5cdFx0XHR9LCAzMDApO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGV4cG9zZU1lKCl7XG5cdFx0XHRib2R5LmFkZENsYXNzKFwib3ZlcmxheS1vblwiKTsgLy8gaW4gdGhlIGRlZmF1bHQgY29uZmlnLCBraWxscyBib2R5IHNjcm9sbGluZ1xuXG5cdFx0XHRlbC5jc3Moe1xuXHRcdFx0XHRkaXNwbGF5OiBcImJsb2NrXCIsXG5cdFx0XHRcdHpJbmRleDogz4AuaGlnaGVzdFooKVxuXHRcdFx0fSk7XG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGVsLmFkZENsYXNzKFwib25cIik7XG5cdFx0XHR9LCAxMCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4cG9zZTogZXhwb3NlTWVcblx0XHR9O1xuXHR9XG5cblx0z4AubW9kcy5wdXNoKGluaXQpO1xuXG5cdHJldHVybiB7XG5cdFx0c2hvdzogc2hvd1xuXHR9O1xufSkoKTtcbiIsInZhciBrdWIgPSAoZnVuY3Rpb24gKCkge1xuXHTPgC5saXN0ZW4oaW5pdCk7XG5cblx0dmFyIEhFQURFUl9IRUlHSFQ7XG5cdHZhciBodG1sLCBib2R5LCBtYWluTmF2LCBoZWFkbGluZXMsIHF1aWNrc3RhcnRCdXR0b24sIHdpc2hGaWVsZDtcblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdM+ALmNsZWFuKGluaXQpO1xuXG5cdFx0aHRtbCA9IM+AMSgnaHRtbCcpO1xuXHRcdGJvZHkgPSDPgDEoJ2JvZHknKTtcblx0XHRtYWluTmF2ID0gz4BkKFwibWFpbk5hdlwiKTtcblx0XHRoZWFkbGluZXMgPSDPgGQoJ2hlYWRsaW5lV3JhcHBlcicpO1xuXHRcdHdpc2hGaWVsZCA9IM+AZCgnd2lzaEZpZWxkJyk7XG5cdFx0SEVBREVSX0hFSUdIVCA9IM+AMSgnaGVhZGVyJykub2Zmc2V0KCkuaGVpZ2h0O1xuXG5cdFx0cXVpY2tzdGFydEJ1dHRvbiA9IM+AZCgncXVpY2tzdGFydEJ1dHRvbicpO1xuXG5cdFx0YnVpbGRJbmxpbmVUT0MoKTtcblxuXHRcdHNldFlBSCgpO1xuXG5cblx0XHRhZGp1c3RFdmVyeXRoaW5nKCk7XG5cblx0XHTPgC5saXN0ZW4oYWRqdXN0RXZlcnl0aGluZywgJ3Jlc2l6ZScpO1xuXHRcdM+ALmxpc3RlbihhZGp1c3RFdmVyeXRoaW5nLCAnc2Nyb2xsJyk7XG5cdFx0z4AubGlzdGVuKGhhbmRsZUtleXN0cm9rZXMsICdrZXlkb3duJyk7XG5cdFx0d2lzaEZpZWxkLmxpc3RlbihoYW5kbGVLZXlzdHJva2VzLCAna2V5ZG93bicpO1xuXG5cdFx0ZG9jdW1lbnQub251bmxvYWQgPSBmdW5jdGlvbigpe1xuXHRcdFx0z4AuY2xlYW4oYWRqdXN0RXZlcnl0aGluZywgJ3Jlc2l6ZScpO1xuXHRcdFx0z4AuY2xlYW4oYWRqdXN0RXZlcnl0aGluZywgJ3Njcm9sbCcpO1xuXHRcdFx0z4AuY2xlYW4oaGFuZGxlS2V5c3Ryb2tlcywgJ2tleWRvd24nKTtcblx0XHRcdHdpc2hGaWVsZC5jbGVhbihoYW5kbGVLZXlzdHJva2VzLCAna2V5ZG93bicpO1xuXHRcdH07XG5cblx0XHTPgC5saXN0ZW4oY2xvc2VPcGVuTWVudSwgJ3Jlc2l6ZScpO1xuXG5cdFx0ZnVuY3Rpb24gY2xvc2VPcGVuTWVudSgpIHtcblx0XHRcdGlmIChodG1sLmhhc0NsYXNzKCdvcGVuLW5hdicpKSB0b2dnbGVNZW51KCk7XG5cdFx0fVxuXG5cdFx0z4AoJy5kcm9wZG93bicpLmZvckVhY2goZnVuY3Rpb24oZHJvcGRvd24pIHtcblx0XHRcdHZhciByZWFkb3V0ID0gZHJvcGRvd24uz4AxKCcucmVhZG91dCcpO1xuXHRcdFx0cmVhZG91dC5pbm5lckhUTUwgPSBkcm9wZG93bi7PgDEoJ2EnKS5pbm5lckhUTUw7XG5cdFx0XHRyZWFkb3V0Lm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGRyb3Bkb3duLnRvZ2dsZUNsYXNzKCdvbicpO1xuXHRcdFx0XHTPgC5saXN0ZW4oY2xvc2VPcGVuRHJvcGRvd24sICdjbGljaycpO1xuXG5cdFx0XHRcdGZ1bmN0aW9uIGNsb3NlT3BlbkRyb3Bkb3duKGUpIHtcblx0XHRcdFx0XHRpZiAoZHJvcGRvd24uaGFzQ2xhc3MoJ29uJykgJiYgIShkcm9wZG93bldhc0NsaWNrZWQoZSkpKSB7XG5cdFx0XHRcdFx0XHTPgC5jbGVhbihjbG9zZU9wZW5Ecm9wZG93biwgJ2NsaWNrJyk7XG5cdFx0XHRcdFx0XHRkcm9wZG93bi5raWxsQ2xhc3MoJ29uJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZnVuY3Rpb24gZHJvcGRvd25XYXNDbGlja2VkKGUpIHtcblx0XHRcdFx0XHRyZXR1cm4gZS50YXJnZXQuaXNIZWlyT2ZDbGFzcygnZHJvcGRvd24nKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9KTtcblxuXHRcdHNldEludGVydmFsKHNldEZvb3RlclR5cGUsIDEwKTtcblx0fVxuXG5cdHZhciB0b2NDb3VudCA9IDA7XG5cblx0ZnVuY3Rpb24gYnVpbGRJbmxpbmVUT0MoKSB7XG5cdFx0aWYgKGxvY2F0aW9uLnNlYXJjaCA9PT0gJz90ZXN0Jyl7XG5cdFx0XHR2YXIgZG9jc0NvbnRlbnQgPSDPgGQoJ2RvY3NDb250ZW50Jyk7XG5cdFx0XHR2YXIgcGFnZVRPQyA9IM+AZCgncGFnZVRPQycpO1xuXG5cdFx0XHRpZiAocGFnZVRPQykge1xuXHRcdFx0XHR2YXIgaGVhZGVycyA9IGRvY3NDb250ZW50LmtpZHMoJ2gxLCBoMiwgaDMsIGg0LCBoNScpO1xuXHRcdFx0XHR2YXIgdG9jID0gz4AudWwoKTtcblx0XHRcdFx0cGFnZVRPQy5hZGQodG9jKTtcblxuXHRcdFx0XHRoZWFkZXJzLmZvckVhY2goZnVuY3Rpb24gKGhlYWRlcikge1xuXHRcdFx0XHRcdGhlYWRlci5jc3Moe3BhZGRpbmdUb3A6IHB4KEhFQURFUl9IRUlHSFQpfSk7XG5cblx0XHRcdFx0XHR2YXIgYW5jaG9yTmFtZSA9ICdwYWdlVE9DJyArIHRvY0NvdW50Kys7XG5cblx0XHRcdFx0XHR2YXIgbGluayA9IM+ALmNvbnRlbnRFbGVtZW50KCdhJywgMCwgMCwgaGVhZGVyLmlubmVySFRNTCk7XG5cdFx0XHRcdFx0bGluay5ocmVmID0gJyMnICsgYW5jaG9yTmFtZTtcblxuXHRcdFx0XHRcdHZhciBhbmNob3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG5cdFx0XHRcdFx0YW5jaG9yLm5hbWUgPSBhbmNob3JOYW1lO1xuXHRcdFx0XHRcdGRvY3NDb250ZW50Lmluc2VydEJlZm9yZShhbmNob3IsIGhlYWRlcik7XG5cblx0XHRcdFx0XHR0b2MuYWRkKM+ALmxpKDAsIDAsIM+ALmNvbnRlbnRFbGVtZW50KCdhJywgMCwgMCwgbGluaykpKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gc2V0WUFIKCkge1xuXHRcdHZhciBwYXRobmFtZSA9IGxvY2F0aW9uLmhyZWY7XG5cblx0XHR2YXIgY3VycmVudExpbmsgPSBudWxsO1xuXG5cdFx0z4BkKCdkb2NzVG9jJykuz4AoJ2EnKS5mb3JFYWNoKGZ1bmN0aW9uIChsaW5rKSB7XG5cdFx0XHRpZiAocGF0aG5hbWUuaW5kZXhPZihsaW5rLmhyZWYpICE9PSAtMSkge1xuXHRcdFx0XHRjdXJyZW50TGluayA9IGxpbms7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRpZiAoY3VycmVudExpbmspIHtcblx0XHRcdGN1cnJlbnRMaW5rLnBhcmVudHMoJ2Rpdi5pdGVtJykuZm9yRWFjaChmdW5jdGlvbiAocGFyZW50KSB7XG5cdFx0XHRcdHBhcmVudC7PgDEoJy50aXRsZScpLmNsaWNrKCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRGb290ZXJUeXBlKCkge1xuXHRcdGlmIChodG1sLmlkID09IFwiZG9jc1wiKSB7XG5cdFx0XHR2YXIgYm9keUhlaWdodCA9IM+AZCgnaGVybycpLm9mZnNldCgpLmhlaWdodCArIM+AZCgnZW5jeWNsb3BlZGlhJykub2Zmc2V0KCkuaGVpZ2h0O1xuXHRcdFx0dmFyIGZvb3RlciA9IM+AMSgnZm9vdGVyJyk7XG5cdFx0XHR2YXIgZm9vdGVySGVpZ2h0ID0gZm9vdGVyLm9mZnNldCgpLmhlaWdodDtcblx0XHRcdGJvZHkuY2xhc3NPbkNvbmRpdGlvbignZml4ZWQnLCB3aW5kb3cuaW5uZXJIZWlnaHQgLSBmb290ZXJIZWlnaHQgPiBib2R5SGVpZ2h0KTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBhZGp1c3RFdmVyeXRoaW5nKCkge1xuXHRcdGlmICghaHRtbC5oYXNDbGFzcygnb3Blbi1uYXYnKSkgSEVBREVSX0hFSUdIVCA9IM+AMSgnaGVhZGVyJykub2Zmc2V0KCkuaGVpZ2h0O1xuXG5cdFx0dmFyIFkgPSB3aW5kb3cucGFnZVlPZmZzZXQ7XG5cdFx0dmFyIG9mZnNldCA9IFkgLyAzO1xuXG5cdFx0aHRtbC5jbGFzc09uQ29uZGl0aW9uKCdmbGlwLW5hdicsIFkgPiAwKTtcblx0XHQvL2JvZHkuY3NzKHtiYWNrZ3JvdW5kUG9zaXRpb246ICcwICcgKyBweChvZmZzZXQpfSk7XG5cblx0XHRpZiAoaGVhZGxpbmVzKSB7XG5cdFx0XHR2YXIgaGVhZGxpbmVzQm90dG9tID0gaGVhZGxpbmVzLm9mZnNldCgpLnRvcCArIGhlYWRsaW5lcy5vZmZzZXQoKS5oZWlnaHQgLSBIRUFERVJfSEVJR0hUICsgWSAtIDMwOyAvLyAzMHB4IHJldmVhbCBhdCBib3R0b21cblx0XHRcdHZhciBxdWlja3N0YXJ0Qm90dG9tID0gaGVhZGxpbmVzQm90dG9tICsgcXVpY2tzdGFydEJ1dHRvbi5vZmZzZXQoKS5oZWlnaHQ7XG5cblx0XHRcdGhlYWRsaW5lcy5jc3Moe29wYWNpdHk6IFkgPT09IDAgPyAxIDogKFkgPiBoZWFkbGluZXNCb3R0b20gPyAwIDogMSAtIChZIC8gaGVhZGxpbmVzQm90dG9tKSl9KTtcblxuXHRcdFx0cXVpY2tzdGFydEJ1dHRvbi5jc3Moe29wYWNpdHk6IFkgPCBoZWFkbGluZXNCb3R0b20gPyAxIDogKFkgPiBxdWlja3N0YXJ0Qm90dG9tID8gMCA6IDEgLSAoKFkgLSBoZWFkbGluZXNCb3R0b20pIC8gKHF1aWNrc3RhcnRCb3R0b20gLSBoZWFkbGluZXNCb3R0b20pKSl9KTtcblxuXHRcdFx0aHRtbC5jbGFzc09uQ29uZGl0aW9uKCd5LWVub3VnaCcsIFkgPiBxdWlja3N0YXJ0Qm90dG9tKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiB0b2dnbGVNZW51KCkge1xuXHRcdGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IDgwMCkge1xuXHRcdFx0z4AucHVzaG1lbnUuc2hvdygncHJpbWFyeScpO1xuXHRcdH1cblxuXHRcdGVsc2Uge1xuXHRcdFx0dmFyIG5ld0hlaWdodCA9IEhFQURFUl9IRUlHSFQ7XG5cblx0XHRcdGlmICghaHRtbC5oYXNDbGFzcygnb3Blbi1uYXYnKSkge1xuXHRcdFx0XHRuZXdIZWlnaHQgPSBtYWluTmF2Lm9mZnNldCgpLmhlaWdodDtcblx0XHRcdH1cblxuXHRcdFx0z4AoJ2hlYWRlcicpLmNzcyh7aGVpZ2h0OiBweChuZXdIZWlnaHQpfSk7XG5cdFx0fVxuXG5cdFx0aHRtbC50b2dnbGVDbGFzcygnb3Blbi1uYXYnKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHN1Ym1pdFdpc2godGV4dGZpZWxkKSB7XG5cdFx0YWxlcnQoJ1lvdSB0eXBlZDogJyArIHRleHRmaWVsZC52YWx1ZSk7XG5cdFx0dGV4dGZpZWxkLnZhbHVlID0gJyc7XG5cdFx0dGV4dGZpZWxkLmJsdXIoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGhhbmRsZUtleXN0cm9rZXMoZSkge1xuXHRcdHN3aXRjaCAoZS53aGljaCkge1xuXHRcdFx0Y2FzZSAxMzoge1xuXHRcdFx0XHRpZiAoZS5jdXJyZW50VGFyZ2V0ID09PSB3aXNoRmllbGQpIHtcblx0XHRcdFx0XHRzdWJtaXRXaXNoKHdpc2hGaWVsZCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdGNhc2UgMjc6IHtcblx0XHRcdFx0aWYgKGh0bWwuaGFzQ2xhc3MoJ29wZW4tbmF2JykpIHtcblx0XHRcdFx0XHR0b2dnbGVNZW51KCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gc2hvd1ZpZGVvKCkge1xuXHRcdHZhciB2aWRlb0lmcmFtZSA9IM+AZChcInZpZGVvUGxheWVyXCIpLs+AMShcImlmcmFtZVwiKTtcblx0XHR2aWRlb0lmcmFtZS5zcmMgPSB2aWRlb0lmcmFtZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXVybFwiKTtcblx0XHTPgC5tb2RhbE92ZXJsYXkuc2hvdyhcInZpZGVvUGxheWVyXCIpO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHR0b2dnbGVNZW51OiB0b2dnbGVNZW51LFxuXHRcdHNob3dWaWRlbzogc2hvd1ZpZGVvXG5cdH07XG59KSgpO1xuXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
