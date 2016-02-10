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
		var pathname = location.pathname;
		var currentLink = null;

		πd('docsToc').π('a').forEach(function (link) {
			if (pathname.indexOf(link.href) !== -1) {
				currentLink = link;
			}
		});

		if (currentLink) html.dataset.currentLink = currentLink.href;
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFsZi5qcyIsIs+ALmpzIiwiSEFMLmpzIiwiz4Atc3RhdHVzLmpzIiwiz4AtYmFzZUNvbXBvbmVudHMuanMiLCLPgC1kaWFsb2cvz4AtZGlhbG9nLmpzIiwiz4AtYWNjb3JkaW9uL8+ALWFjY29yZGlvbi5qcyIsIs+ALXB1c2htZW51L8+ALXB1c2htZW51LmpzIiwic2NyaXB0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbm1CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6InNjcmlwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGFkb3JhYmxlIGxpdHRsZSBmdW5jdGlvbnNcbi8vXG4vLyBOTyBERVBFTkRFTkNJRVMgUEVSTUlUVEVEISBBTEwgTVVTVCBCRSAnT04gVEhFIE1FVEFMJyEhIVxuXG5mdW5jdGlvbiBib29sZWFuQXR0cmlidXRlVmFsdWUoZWxlbWVudCwgYXR0cmlidXRlLCBkZWZhdWx0VmFsdWUpe1xuXHQvLyByZXR1cm5zIHRydWUgaWYgYW4gYXR0cmlidXRlIGlzIHByZXNlbnQgd2l0aCBubyB2YWx1ZVxuXHQvLyBlLmcuIGJvb2xlYW5BdHRyaWJ1dGVWYWx1ZShlbGVtZW50LCAnZGF0YS1tb2RhbCcsIGZhbHNlKTtcblx0aWYgKGVsZW1lbnQuaGFzQXR0cmlidXRlKGF0dHJpYnV0ZSkpIHtcblx0XHR2YXIgdmFsdWUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShhdHRyaWJ1dGUpO1xuXHRcdGlmICh2YWx1ZSA9PT0gJycgfHwgdmFsdWUgPT09ICd0cnVlJykge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSBlbHNlIGlmICh2YWx1ZSA9PT0gJ2ZhbHNlJykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBkZWZhdWx0VmFsdWU7XG59XG5cbmZ1bmN0aW9uIGRlZXBDb3B5KG9iaikge1xuXHQvLyBtYWtlIG5ldyByZWZlcmVuY2VzIGZvciBhbiBhcnJheS9vYmplY3QgYW5kIGFsbCBpdHMgY29tcGxleCBjaGlsZHJlblxuXHR2YXIgdmFsdWUsIGtleSwgb3V0cHV0ID0gQXJyYXkuaXNBcnJheShvYmopID8gW10gOiB7fTtcblx0Zm9yIChrZXkgaW4gb2JqKSB7XG5cdFx0dmFsdWUgPSBvYmpba2V5XTtcblx0XHRvdXRwdXRba2V5XSA9ICh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIpID8gY29weSh2YWx1ZSkgOiB2YWx1ZTtcblx0fVxuXHRyZXR1cm4gb3V0cHV0O1xufVxuXG5mdW5jdGlvbiBtaWxsaXNlY29uZHNGb3JUcmFuc2l0aW9uKGVsZW1lbnQsIHRyYW5zaXRpb25Qcm9wZXJ0eSl7XG5cdC8vIHJldHVybnMgdGhlIG1pbGxpcyBmb3IgYSBjc3MgdHJhbnNpdGlvbiBkdXJhdGlvbiArIGRlbGF5XG5cdC8vZS5nLiBtaWxsaXNlY29uZHNGb3JUcmFuc2l0aW9uKGVsLCAndHJhbnNmb3JtJylcblxuXHR2YXIgc3R5bGVzID0gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KTtcblx0dmFyIGlkeCA9IHN0eWxlcy50cmFuc2l0aW9uUHJvcGVydHkuc3BsaXQoJywgJykuaW5kZXhPZih0cmFuc2l0aW9uUHJvcGVydHkpO1xuXG5cdHJldHVybiAocGFyc2VGbG9hdChzdHlsZXMudHJhbnNpdGlvbkR1cmF0aW9uLnNwbGl0KCcsICcpW2lkeF0pICsgcGFyc2VGbG9hdChzdHlsZXMudHJhbnNpdGlvbkRlbGF5LnNwbGl0KCcsICcpW2lkeF0pKSAqIDEwMDA7XG59XG5cbmZ1bmN0aW9uIHBjdChuKSB7XG5cdHJldHVybiBuICsgJyUnO1xufVxuXG5mdW5jdGlvbiBweChuKXtcblx0cmV0dXJuIG4gKyAncHgnO1xufVxuIiwidmFyIM+ALCDPgDEsIM+AZDtcbihmdW5jdGlvbigpe1xuXHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblx0ICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cdCAqKioqXG5cdCAqKioqICDPgCBDT1JFXG5cdCAqKioqXG5cdCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXHQgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdHZhciBkID0gZG9jdW1lbnQ7XG5cdGQuZyA9IGQuZ2V0RWxlbWVudEJ5SWQ7XG5cdGQucSA9IGQucXVlcnlTZWxlY3Rvcjtcblx0ZC5hID0gZC5xdWVyeVNlbGVjdG9yQWxsO1xuXHRkLnQgPSBkLmdldEVsZW1lbnRzQnlUYWdOYW1lO1xuXG5cdM+AID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcblx0XHRyZXR1cm4gZC5hKHNlbGVjdG9yKTtcblx0fTtcblxuXHTPgDEgPSBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcblx0XHRyZXR1cm4gZC5xKHNlbGVjdG9yKTtcblx0fTtcblxuXHTPgGQgPSBmdW5jdGlvbihpZCkge1xuXHRcdHJldHVybiBkLmcoaWQpO1xuXHR9O1xuXG5cdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXHQgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblx0ICoqKipcblx0ICoqKiogIERPTSBFTEVNRU5UIENSRUFUSU9OL0lOSVRJQUxJWkFUSU9OXG5cdCAqKioqXG5cdCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXHQgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblx0XHQvLyB0aGlzIGlzIHRoZSBiYXNlIGNyZWF0ZS9pbml0IG1ldGhvZCwgZS5nXG5cdFx0Ly8gbmV3RG9tRWxlbWVudCgncCcsICdhcnRpY2xlLWNvbnRlbnQnLCAndGhlRmlyc3RPZk1hbnknKVxuXHTPgC5uZXdET01FbGVtZW50ID0gZnVuY3Rpb24odGFnTmFtZSwgY2xhc3NOYW1lLCBpZCkge1xuXHRcdHZhciBlbCA9IGQuY3JlYXRlRWxlbWVudCh0YWdOYW1lKTtcblxuXHRcdGlmIChjbGFzc05hbWUpXG5cdFx0XHRlbC5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG5cblx0XHRpZiAoaWQpXG5cdFx0XHRlbC5pZCA9IGlkO1xuXG5cdFx0cmV0dXJuIGVsO1xuXHR9O1xuXG4vLyBiYXNlIGVsZW1lbnQgd2l0aCBjb250ZW50IHBhc3NlZCBpbiwgZS5nXG4vLyDPgC5jb250ZW50RWxlbWVudCgncCcsICdhcnRpY2xlLWNvbnRlbnQnLCAndGhlRmlyc3RPZk1hbnknLCAnPHNwYW4+Zm9vIHRvIHRoZSBiYXIgdG8gdGhlIGdyb25rPC9zcGFuPicpXG5cdM+ALmNvbnRlbnRFbGVtZW50ID0gZnVuY3Rpb24odGFnTmFtZSwgY2xhc3NOYW1lLCBpZCwgY29udGVudClcblx0e1xuXHRcdHZhciBlbCA9IM+ALm5ld0RPTUVsZW1lbnQodGFnTmFtZSwgY2xhc3NOYW1lLCBpZCk7XG5cblx0XHRpZiAoY29udGVudCkge1xuXHRcdFx0aWYgKGNvbnRlbnQubm9kZU5hbWUpIHtcblx0XHRcdFx0ZWwuYXBwZW5kQ2hpbGQoY29udGVudCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRlbC5pbm5lckhUTUwgPSBjb250ZW50O1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBlbDtcblx0fTtcblxuLy8gYmFzZSBlbGVtZW50IHdpdGggc3JjIGF0dHJpYnV0ZSwgZS5nXG4vLyBzcmNFbGVtZW50KCdpbWcnLCAnYXJ0aWNsZS10aHVtYicsICdoYXBweUxvZ28nLCAnL2ltYWdlcy9oYXBweUxvZ28ucG5nJylcblx0z4Auc3JjRWxlbWVudCA9IGZ1bmN0aW9uKHRhZ05hbWUsIGNsYXNzTmFtZSwgaWQsIHNyYylcblx0e1xuXHRcdHZhciBlbCA9IM+ALm5ld0RPTUVsZW1lbnQodGFnTmFtZSwgY2xhc3NOYW1lLCBpZCk7XG5cblx0XHRpZiAoc3JjKVxuXHRcdFx0ZWwuc3JjID0gc3JjO1xuXG5cdFx0cmV0dXJuIGVsO1xuXHR9O1xuXG5cblx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cdCAqKioqXG5cdCAqKioqICBTSE9SVEhBTkQgQ1JFQVRFL0lOSVQgTUVUSE9EU1xuXHQgKioqKlxuXHQgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblx0z4AuYnV0dG9uID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBpZCwgY29udGVudCwgYWN0aW9uKXtcblx0XHR2YXIgZWwgPSDPgC5jb250ZW50RWxlbWVudChcImJ1dHRvblwiLCBjbGFzc05hbWUsIGlkLCBjb250ZW50KTtcblx0XHRlbC5vbmNsaWNrID0gYWN0aW9uO1xuXHRcdHJldHVybiBlbDtcblx0fTtcblxuXHTPgC5pbnB1dCA9IGZ1bmN0aW9uKHR5cGVOYW1lLCBjbGFzc05hbWUsIHBsYWNlaG9sZGVyLCB2YWx1ZSwgY2hlY2tlZCwgZGlzYWJsZWQpXG5cdHtcblx0XHR2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG5cdFx0ZWwudHlwZSA9IHR5cGVOYW1lO1xuXHRcdGVsLmNsYXNzTmFtZSA9IGNsYXNzTmFtZSB8fCAnJztcblx0XHRlbC5wbGFjZWhvbGRlciA9IHBsYWNlaG9sZGVyIHx8ICcnO1xuXHRcdGVsLnZhbHVlID0gdmFsdWUgfHwgJyc7XG5cdFx0ZWwuY2hlY2tlZCA9IGNoZWNrZWQgfHwgJyc7XG5cdFx0ZWwuZGlzYWJsZWQgPSBkaXNhYmxlZCB8fCAnJztcblx0XHRyZXR1cm4gZWw7XG5cdH07XG5cblx0z4Aub3B0aW9uID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBjb250ZW50LCB2YWx1ZSwgc2VsZWN0ZWQpe1xuXHRcdHZhciBlbCA9IM+ALmNvbnRlbnRFbGVtZW50KFwib3B0aW9uXCIsIGNsYXNzTmFtZSwgbnVsbCwgY29udGVudCk7XG5cdFx0ZWwudmFsdWUgPSB2YWx1ZSB8fCBudWxsO1xuXHRcdGVsLnNlbGVjdGVkID0gc2VsZWN0ZWQgfHwgbnVsbDtcblx0XHRyZXR1cm4gZWw7XG5cdH07XG5cblx0z4AudGV4dGFyZWEgPSBmdW5jdGlvbihjbGFzc05hbWUsIHBsYWNlaG9sZGVyLCB2YWx1ZSkge1xuXHRcdHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZXh0YXJlYVwiKTtcblx0XHRlbC5jbGFzc05hbWUgPSBjbGFzc05hbWUgfHwgJyc7XG5cdFx0ZWwucGxhY2Vob2xkZXIgPSBwbGFjZWhvbGRlciB8fCAnJztcblx0XHRlbC52YWx1ZSA9IHZhbHVlIHx8ICcnO1xuXHRcdHJldHVybiBlbDtcblx0fTtcblxuXHTPgC5jbGVhciA9IGZ1bmN0aW9uKCl7IHJldHVybiDPgC5uZXdET01FbGVtZW50KFwiY2xlYXJcIik7IH07XG5cdM+ALmRpdiA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpeyByZXR1cm4gz4AuY29udGVudEVsZW1lbnQoXCJkaXZcIiwgY2xhc3NOYW1lLCBpZCwgY29udGVudCk7IH07XG5cdM+ALmgxID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBpZCwgY29udGVudCl7IHJldHVybiDPgC5jb250ZW50RWxlbWVudChcImgxXCIsIGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpOyB9O1xuXHTPgC5oMiA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpeyByZXR1cm4gz4AuY29udGVudEVsZW1lbnQoXCJoMlwiLCBjbGFzc05hbWUsIGlkLCBjb250ZW50KTsgfTtcblx0z4AuaDMgPSBmdW5jdGlvbihjbGFzc05hbWUsIGlkLCBjb250ZW50KXsgcmV0dXJuIM+ALmNvbnRlbnRFbGVtZW50KFwiaDNcIiwgY2xhc3NOYW1lLCBpZCwgY29udGVudCk7IH07XG5cdM+ALmg0ID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBpZCwgY29udGVudCl7IHJldHVybiDPgC5jb250ZW50RWxlbWVudChcImg0XCIsIGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpOyB9O1xuXHTPgC5oNSA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpeyByZXR1cm4gz4AuY29udGVudEVsZW1lbnQoXCJoNVwiLCBjbGFzc05hbWUsIGlkLCBjb250ZW50KTsgfTtcblx0z4AuaDYgPSBmdW5jdGlvbihjbGFzc05hbWUsIGlkLCBjb250ZW50KXsgcmV0dXJuIM+ALmNvbnRlbnRFbGVtZW50KFwiaDZcIiwgY2xhc3NOYW1lLCBpZCwgY29udGVudCk7IH07XG5cdM+ALmlmcmFtZSA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIHNyYyl7IHJldHVybiDPgC5zcmNFbGVtZW50KFwiaWZyYW1lXCIsIGNsYXNzTmFtZSwgaWQsIHNyYyk7IH07XG5cdM+ALmltZyA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIHNyYyl7IHJldHVybiDPgC5zcmNFbGVtZW50KFwiSW1nXCIsIGNsYXNzTmFtZSwgaWQsIHNyYyk7IH07XG5cdM+ALmhlYWRlciA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpeyByZXR1cm4gz4AuY29udGVudEVsZW1lbnQoXCJoZWFkZXJcIiwgY2xhc3NOYW1lLCBpZCwgY29udGVudCk7IH07XG5cdM+ALm5hdiA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpeyByZXR1cm4gz4AuY29udGVudEVsZW1lbnQoXCJuYXZcIiwgY2xhc3NOYW1lLCBpZCwgY29udGVudCk7IH07XG5cdM+ALnAgPSBmdW5jdGlvbihjbGFzc05hbWUsIGlkLCBjb250ZW50KXsgcmV0dXJuIM+ALmNvbnRlbnRFbGVtZW50KFwicFwiLCBjbGFzc05hbWUsIGlkLCBjb250ZW50KTsgfTtcblx0z4Auc2VjdGlvbiA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpeyByZXR1cm4gz4AuY29udGVudEVsZW1lbnQoXCJzZWN0aW9uXCIsIGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpOyB9O1xuXHTPgC5zcGFuID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBpZCwgY29udGVudCl7IHJldHVybiDPgC5jb250ZW50RWxlbWVudChcInNwYW5cIiwgY2xhc3NOYW1lLCBpZCwgY29udGVudCk7IH07XG5cdM+ALnVsID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBpZCwgY29udGVudCl7IHJldHVybiDPgC5jb250ZW50RWxlbWVudChcInVsXCIsIGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpOyB9O1xuXHTPgC5saSA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpeyByZXR1cm4gz4AuY29udGVudEVsZW1lbnQoXCJsaVwiLCBjbGFzc05hbWUsIGlkLCBjb250ZW50KTsgfTtcblxuXHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblx0ICoqKipcblx0ICoqKiogIEhUTUxFTEVNRU5UL05PREUgUFJPVE9UWVBFIE1FVEhPRFMgKGpxdWVyeS1pemF0aW9ucylcblx0ICoqKipcblx0ICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS53cmFwID0gTm9kZS5wcm90b3R5cGUud3JhcCA9IGZ1bmN0aW9uKGNvbnRlbnQpe1xuXHRcdHZhciB3cmFwcGVyID0gdGhpcztcblx0XHRpZiAoIWNvbnRlbnQuZm9yRWFjaCkgY29udGVudCA9IFtjb250ZW50XTtcblxuXHRcdHZhciBwYXJlbnQgPSBjb250ZW50WzBdLnBhcmVudE5vZGU7XG5cdFx0cGFyZW50Lmluc2VydEJlZm9yZSh3cmFwcGVyLCBjb250ZW50WzBdKTtcblxuXHRcdGNvbnRlbnQuZm9yRWFjaChmdW5jdGlvbihlbCl7XG5cdFx0XHR3cmFwcGVyLmFwcGVuZENoaWxkKGVsKTtcblx0XHR9KTtcblx0fTtcblxuXG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLnByZXBlbmQgPSBOb2RlLnByb3RvdHlwZS5wcmVwZW5kID0gZnVuY3Rpb24oZWwpe1xuXHRcdHRoaXMuaW5zZXJ0QmVmb3JlKGVsLCB0aGlzLmNoaWxkTm9kZXNbMF0pO1xuXHR9O1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5hZGQgPSBOb2RlLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihvYmplY3Qpe1xuXHRcdGlmIChBcnJheS5pc0FycmF5KG9iamVjdCkpIHtcblx0XHRcdHZhciBlbCA9IHRoaXM7XG5cdFx0XHRvYmplY3QuZm9yRWFjaChmdW5jdGlvbihvYmope1xuXHRcdFx0XHRpZiAob2JqKSBlbC5hcHBlbmRDaGlsZChvYmopO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIGlmKG9iamVjdCkge1xuXHRcdFx0dGhpcy5hcHBlbmRDaGlsZChvYmplY3QpO1xuXHRcdH1cblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUuY2xhc3NPbkNvbmRpdGlvbiA9IE5vZGUucHJvdG90eXBlLmNsYXNzT25Db25kaXRpb24gPSBmdW5jdGlvbihjbGFzc25hbWUsIGNvbmRpdGlvbikge1xuXHRcdGlmIChjb25kaXRpb24pXG5cdFx0XHR0aGlzLmFkZENsYXNzKGNsYXNzbmFtZSk7XG5cdFx0ZWxzZVxuXHRcdFx0dGhpcy5raWxsQ2xhc3MoY2xhc3NuYW1lKTtcblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUub2Zmc2V0ID0gTm9kZS5wcm90b3R5cGUub2Zmc2V0ID0gZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gdGhpcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0fTtcblxuLy8gbGlrZSBkLmcsIGJ1dCBmb3IgY2hpbGQgZWxlbWVudHNcblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLs+AZCA9IE5vZGUucHJvdG90eXBlLs+AZCA9IGZ1bmN0aW9uKGlkKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuXHR9O1xuXG4vLyBsaWtlIGQucSwgYnV0IGZvciBjaGlsZCBlbGVtZW50c1xuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUuz4AxID0gTm9kZS5wcm90b3R5cGUuz4AxID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcblx0XHRyZXR1cm4gdGhpcy5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcblx0fTtcblxuLy8gbGlrZSBkLmEsIGJ1dCBmb3IgY2hpbGQgZWxlbWVudHNcblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLs+AID0gTm9kZS5wcm90b3R5cGUuz4AgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuXHRcdHJldHVybiB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuXHR9O1xuXG4vLyBvbmx5IGRpcmVjdCBkZXNjZW5kZW50cywgd2l0aCBvcHRpb25hbCBzZWxlY3RvclxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUua2lkcyA9IE5vZGUucHJvdG90eXBlLmtpZHMgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuXHRcdHZhciBjaGlsZE5vZGVzID0gdGhpcy5jaGlsZE5vZGVzO1xuXHRcdGlmICghc2VsZWN0b3IpIHJldHVybiBjaGlsZE5vZGVzO1xuXG5cdFx0dmFyIGRlc2NlbmRlbnRzID0gdGhpcy7PgChzZWxlY3Rvcik7XG5cdFx0dmFyIGNoaWxkcmVuID0gW107XG5cblx0XHRjaGlsZE5vZGVzLmZvckVhY2goZnVuY3Rpb24obm9kZSl7XG5cdFx0XHRpZiAoZGVzY2VuZGVudHMuaW5kZXhPZihub2RlKSAhPT0gLTEpIHtcblx0XHRcdFx0Y2hpbGRyZW4ucHVzaChub2RlKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHJldHVybiBjaGlsZHJlbjtcblx0fTtcblxuXHRmdW5jdGlvbiBhcnJheU9mQ2xhc3Nlc0ZvckVsZW1lbnQoZWwpIHtcblx0XHRyZXR1cm4gZWwuY2xhc3NOYW1lID8gZWwuY2xhc3NOYW1lLnNwbGl0KFwiIFwiKSA6IFtdO1xuXHR9XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLmhhc0NsYXNzID0gTm9kZS5wcm90b3R5cGUuaGFzQ2xhc3MgPSBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG5cdFx0dmFyIGNsYXNzZXMgPSBhcnJheU9mQ2xhc3Nlc0ZvckVsZW1lbnQodGhpcyk7XG5cdFx0cmV0dXJuIGNsYXNzZXMuaW5kZXhPZihjbGFzc05hbWUpICE9PSAtMTtcblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUuYWRkQ2xhc3MgPSBOb2RlLnByb3RvdHlwZS5hZGRDbGFzcyA9IGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcblx0XHRpZiAodGhpcy5oYXNDbGFzcyhjbGFzc05hbWUpKSByZXR1cm47XG5cdFx0aWYgKHRoaXMuY2xhc3NOYW1lLmxlbmd0aCA+IDApIHRoaXMuY2xhc3NOYW1lICs9IFwiIFwiO1xuXHRcdHRoaXMuY2xhc3NOYW1lICs9IGNsYXNzTmFtZTtcblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUua2lsbENsYXNzID0gTm9kZS5wcm90b3R5cGUua2lsbENsYXNzID0gZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuXHRcdGlmICh0aGlzLmhhc0NsYXNzKGNsYXNzTmFtZSkpIHtcblx0XHRcdHZhciBjbGFzc2VzID0gYXJyYXlPZkNsYXNzZXNGb3JFbGVtZW50KHRoaXMpO1xuXHRcdFx0dmFyIGlkeCA9IGNsYXNzZXMuaW5kZXhPZihjbGFzc05hbWUpO1xuXHRcdFx0aWYgKGlkeCA+IC0xKSB7XG5cdFx0XHRcdGNsYXNzZXMuc3BsaWNlKGlkeCwgMSk7XG5cdFx0XHRcdHRoaXMuY2xhc3NOYW1lID0gY2xhc3Nlcy5qb2luKFwiIFwiKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLnRvZ2dsZUNsYXNzPSBOb2RlLnByb3RvdHlwZS50b2dnbGVDbGFzcz0gZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuXHRcdHJldHVybiAodGhpcy5oYXNDbGFzcyhjbGFzc05hbWUpKSA/IHRoaXMua2lsbENsYXNzKGNsYXNzTmFtZSkgOiB0aGlzLmFkZENsYXNzKGNsYXNzTmFtZSk7XG5cdH07XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLnNpYmxpbmdzID0gTm9kZS5wcm90b3R5cGUuc2libGluZ3MgPSBmdW5jdGlvbihzZWxlY3Rvcil7XG5cdFx0dmFyIGVsID0gdGhpcztcblx0XHRyZXR1cm4gZWwucGFyZW50Tm9kZS7PgCgnOnNjb3BlID4gJyArIChzZWxlY3RvciB8fCAnKicpKS5maWx0ZXIoZnVuY3Rpb24ob2JqKXtyZXR1cm4gb2JqICE9IGVsO30pO1xuXHR9O1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5jc3MgPSBOb2RlLnByb3RvdHlwZS5jc3MgPSBmdW5jdGlvbihydWxlT3JPYmplY3QsIHZhbHVlKSB7XG5cdFx0Lypcblx0XHQgKiAgIDMgc2lnbmF0dXJlczpcblx0XHQgKiAgIDEuIGVsLmNzcygpXG5cdFx0ICogICAgICByZXR1cm5zIGdldENvbXB1dGVkU3R5bGUoZWwpXG5cdFx0ICpcblx0XHQgKiAgIDIuIGVsLmNzcyh7cnVsZU5hbWU6IHZhbHVlfSlcblx0XHQgKlxuXHRcdCAqICAgMy4gZWwuY3NzKCdydWxlTmFtZScsICd2YWx1ZScpXG5cdFx0ICovXG5cdFx0dmFyIGVsID0gdGhpcztcblxuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRyZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcyk7XG5cdFx0fVxuXG5cdFx0ZWxzZSBpZiAodHlwZW9mIHJ1bGVPck9iamVjdCA9PT0gJ29iamVjdCcpIHsgLy8gYW4gb2JqZWN0IHdhcyBwYXNzZWQgaW5cblx0XHRcdE9iamVjdC5rZXlzKHJ1bGVPck9iamVjdCkuZm9yRWFjaChmdW5jdGlvbihrZXkpe1xuXHRcdFx0XHRlbC5zdHlsZVtrZXldID0gcnVsZU9yT2JqZWN0W2tleV07XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRlbHNlIGlmICh0eXBlb2YgcnVsZU9yT2JqZWN0ID09PSAnc3RyaW5nJyAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7IC8vIDIgc3RyaW5nIHZhbHVlcyB3ZXJlIHBhc3NlZCBpblxuXHRcdFx0ZWwuc3R5bGVbcnVsZU9yT2JqZWN0XSA9IHZhbHVlO1xuXHRcdH1cblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUubGlzdGVuID0gTm9kZS5wcm90b3R5cGUubGlzdGVuID0gZnVuY3Rpb24oY2FsbGJhY2ssIGV2ZW50TmFtZSl7XG5cdFx0dGhpcy5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2spO1xuXHR9O1xuXG4vLyBqdXN0IGxpa2UgaXQgc291bmRzXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5pbmRleCA9IE5vZGUucHJvdG90eXBlLmluZGV4ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMucGFyZW50Tm9kZS5jaGlsZE5vZGVzLmluZGV4T2YodGhpcyk7XG5cdH07XG5cbi8vIGp1c3QgbGlrZSBpdCBzb3VuZHNcblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLmVtcHR5ID0gTm9kZS5wcm90b3R5cGUuZW1wdHkgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLmlubmVySFRNTCA9IFwiXCI7XG5cdH07XG5cbi8vIHJlcGxhY2VzIOKAlCBET0VTIE5PVCBBUFBFTkQg4oCUIGVsZW1lbnQncyBpbm5lckhUTUwgd2l0aCBjb250ZW50IG9yIGFycmF5IG9mIGNvbnRlbnRzXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5maWxsID0gTm9kZS5wcm90b3R5cGUuZmlsbCA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcblx0XHQvKlxuXHRcdCAqICAgMiB1c2VzOlxuXHRcdCAqXG5cdFx0ICogICAxLiBlbC5maWxsKG9iamVjdCBvciBobXRsKVxuXHRcdCAqXG5cdFx0ICogICAyLiBlbC5maWxsKFthcnJyYXldKVxuXHRcdCAqXG5cdFx0ICovXG5cdFx0dmFyIGVsID0gdGhpcztcblx0XHRlbC5lbXB0eSgpO1xuXG5cdFx0aWYgKEFycmF5LmlzQXJyYXkoY29udGVudCkpIHtcblx0XHRcdGNvbnRlbnQuZm9yRWFjaChmdW5jdGlvbihvYmope1xuXHRcdFx0XHRpZiAob2JqKVxuXHRcdFx0XHRcdGVsLmFwcGVuZENoaWxkKG9iaik7XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICghY29udGVudC5ub2RlVHlwZSkge1xuXHRcdFx0dmFyIHRleHRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRleHRcIik7XG5cdFx0XHR0ZXh0RWxlbWVudC5pbm5lckhUTUwgPSBjb250ZW50O1xuXHRcdFx0Y29udGVudCA9IHRleHRFbGVtZW50O1xuXHRcdH1cblxuXHRcdHRoaXMuYXBwZW5kQ2hpbGQoY29udGVudCk7XG5cdH07XG5cbi8vIGp1c3QgbGlrZSBpdCBzb3VuZHMsIHdpdGggYWxsIDMgYXBwcm9hY2hlc1xuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUuaGlkZSA9IE5vZGUucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnN0eWxlLm9wYWNpdHkgPSAwO1xuXHRcdHRoaXMuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG5cdFx0dGhpcy5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cdH07XG5cbi8vIGxvb2tzIGZvciBhIGdpdmVuIGNsYXNzIG9uIHRoZSBlbnRpcmUgbGluZWFyIGFuY2VzdHJ5XG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5pc0hlaXJPZkNsYXNzID0gTm9kZS5wcm90b3R5cGUuaXNIZWlyT2ZDbGFzcyA9IGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcblx0XHRpZiAodGhpcyA9PT0gz4AxKCdodG1sJykpIHJldHVybiBmYWxzZTtcblxuXHRcdHZhciBwYXJlbnQgPSB0aGlzLnBhcmVudE5vZGU7XG5cblx0XHRpZiAocGFyZW50KSB7XG5cdFx0XHR3aGlsZSAocGFyZW50ICE9PSDPgDEoJ2JvZHknKSkge1xuXHRcdFx0XHRpZiAocGFyZW50Lmhhc0NsYXNzKGNsYXNzTmFtZSkpIHJldHVybiB0cnVlO1xuXG5cdFx0XHRcdHBhcmVudCA9IHBhcmVudC5wYXJlbnROb2RlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblx0fTtcblxuLy8ga2lsbHMgdGhlIGVsZW1lbnQgaXRzZWxmXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5raWxsID0gTm9kZS5wcm90b3R5cGUua2lsbCA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmICh0aGlzLnBhcmVudE5vZGUpIHtcblx0XHRcdHRoaXMucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzKTtcblx0XHR9XG5cdH07XG5cbi8vIGp1c3QgbGlrZSBpdCBzb3VuZHMsIGFuZCBjYW4gb3B0aW9uYWxseSBzZXQgZGlzcGxheSB0eXBlIHRvIFwiaW5saW5lLWJsb2NrXCIsIGV0Yy5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLnNob3cgPSBOb2RlLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24oc2hvd1R5cGUpIHtcblx0XHR0aGlzLnN0eWxlLm9wYWNpdHkgPSAxO1xuXHRcdHRoaXMuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuXHRcdHRoaXMuc3R5bGUuZGlzcGxheSA9IHNob3dUeXBlIHx8IFwiYmxvY2tcIjtcblx0fTtcblxuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5wYXJlbnQgPSBOb2RlLnByb3RvdHlwZS5wYXJlbnQgPSBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcblx0XHR2YXIgaW1tZWRpYXRlUGFyZW50ID0gdGhpcy5wYXJlbnROb2RlO1xuXG5cdFx0aWYgKCFzZWxlY3RvciB8fCDPgChzZWxlY3RvcikuaW5kZXhPZihpbW1lZGlhdGVQYXJlbnQpICE9PSAtMSkge1xuXHRcdFx0cmV0dXJuIGltbWVkaWF0ZVBhcmVudDtcblx0XHR9XG5cblx0XHRyZXR1cm4gaW1tZWRpYXRlUGFyZW50LnBhcmVudChzZWxlY3Rvcik7XG5cdH07XG5cbi8vIHNpbXBsZSBtb2JpbGUgbC9yIHN3aXBlIGhhbmRsaW5nXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5hZGRTd2lwZXMgPSBmdW5jdGlvbiAoc3dpcGVMZWZ0SGFuZGxlciwgc3dpcGVSaWdodEhhbmRsZXIsIG9wdGlvbnMpIHtcblx0XHR2YXIgc3RhcnRYLFxuXHRcdFx0c3RhcnRZLFxuXHRcdFx0c3RhcnRUaW1lLFxuXHRcdFx0bW92aW5nLFxuXHRcdFx0TUlOX1hfREVMVEEgPSBvcHRpb25zID8gKG9wdGlvbnMueFRocmVzaCB8fCAzMCkgOiAzMCxcblx0XHRcdE1BWF9ZX0RFTFRBID0gb3B0aW9ucyA/IChvcHRpb25zLnlUaHJlc2ggfHwgMzApIDogMzAsXG5cdFx0XHRNQVhfQUxMT1dFRF9USU1FID0gb3B0aW9ucyA/IChvcHRpb25zLmR1cmF0aW9uIHx8IDEwMDApIDogMTAwMDtcblxuXHRcdHRoaXMuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0aWYgKG1vdmluZykgcmV0dXJuO1xuXG5cdFx0XHR2YXIgdG91Y2hvYmogPSBlLmNoYW5nZWRUb3VjaGVzWzBdO1xuXHRcdFx0c3RhcnRYID0gdG91Y2hvYmoucGFnZVg7XG5cdFx0XHRzdGFydFkgPSB0b3VjaG9iai5wYWdlWTtcblx0XHRcdHN0YXJ0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpOyAvLyBnZXQgdGltZSB3aGVuIGZpbmdlciBmaXJzdCBtYWtlcyBjb250YWN0IHdpdGggc3VyZmFjZVxuXHRcdH0sIHRydWUpO1xuXG5cdFx0dGhpcy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBmdW5jdGlvbihlKXtcblx0XHRcdGlmIChtb3ZpbmcpIHJldHVybjtcblxuXHRcdFx0dmFyIHRvdWNob2JqID0gZS5jaGFuZ2VkVG91Y2hlc1swXTtcblx0XHRcdHZhciBkZWx0YVggPSB0b3VjaG9iai5wYWdlWCAtIHN0YXJ0WDtcblxuXHRcdFx0Ly8gY2hlY2sgWSB2YWxpZGl0eVxuXHRcdFx0aWYgKE1hdGguYWJzKHRvdWNob2JqLnBhZ2VZIC0gc3RhcnRZKSA+IE1BWF9ZX0RFTFRBKSByZXR1cm47XG5cblx0XHRcdC8vIGNoZWNrIGVsYXBzZWQgdGltZVxuXHRcdFx0aWYgKChuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHN0YXJ0VGltZSkgPiBNQVhfQUxMT1dFRF9USU1FKSByZXR1cm47XG5cblx0XHRcdC8vIGNoZWNrIFggdmFsaWRpdHlcblx0XHRcdGlmIChNYXRoLmFicyhkZWx0YVgpIDwgTUlOX1hfREVMVEEpIHJldHVybjtcblxuXHRcdFx0bW92aW5nID0gdHJ1ZTtcblxuXHRcdFx0aWYgKGRlbHRhWCA8IDApIC8vIHN3aXBlIGxlZnRcblx0XHRcdFx0c3dpcGVMZWZ0SGFuZGxlcigpO1xuXHRcdFx0ZWxzZSAvLyBzd2lwZSByaWdodFxuXHRcdFx0XHRzd2lwZVJpZ2h0SGFuZGxlcigpO1xuXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdG1vdmluZyA9IGZhbHNlO1xuXHRcdFx0fSwgMzAwKTtcblx0XHR9LCBmYWxzZSk7XG5cdH07XG5cblx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cdCAqKioqXG5cdCAqKioqICBOT0RFTElTVC9BUlJBWSBNRVRIT0RTXG5cdCAqKioqXG5cdCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXHRBcnJheS5wcm90b3R5cGUuaGFzQ2xhc3MgPSBOb2RlTGlzdC5wcm90b3R5cGUuaGFzQ2xhc3MgPSBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG5cdFx0dmFyIGZvdW5kID0gZmFsc2U7XG5cblx0XHR0aGlzLmZvckVhY2goZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0aWYgKG9iai5oYXNDbGFzcyhjbGFzc05hbWUpKSBmb3VuZCA9IHRydWU7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gZm91bmQ7XG5cdH07XG5cblx0QXJyYXkucHJvdG90eXBlLmFkZENsYXNzID0gTm9kZUxpc3QucHJvdG90eXBlLmFkZENsYXNzID0gZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuXHRcdHRoaXMuZm9yRWFjaChmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHRvYmouYWRkQ2xhc3MoY2xhc3NOYW1lKTtcblx0XHR9KTtcblx0fTtcblxuXHRBcnJheS5wcm90b3R5cGUua2lsbENsYXNzID0gTm9kZUxpc3QucHJvdG90eXBlLmtpbGxDbGFzcyA9IGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcblx0XHR0aGlzLmZvckVhY2goZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0b2JqLmtpbGxDbGFzcyhjbGFzc05hbWUpO1xuXHRcdH0pO1xuXHR9O1xuXG5cdEFycmF5LnByb3RvdHlwZS50b2dnbGVDbGFzcyA9IE5vZGVMaXN0LnByb3RvdHlwZS50b2dnbGVDbGFzcyA9IGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcblx0XHR0aGlzLmZvckVhY2goZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0b2JqLnRvZ2dsZUNsYXNzKGNsYXNzTmFtZSk7XG5cdFx0fSk7XG5cdH07XG5cblx0QXJyYXkucHJvdG90eXBlLmxhc3RJZHggPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5sZW5ndGggLSAxO1xuXHR9O1xuXG5cdEFycmF5LnByb3RvdHlwZS5sYXN0T2JqID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXNbdGhpcy5sYXN0SWR4KCldO1xuXHR9O1xuXG5cdHZhciBhcnJheU1ldGhvZHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhBcnJheS5wcm90b3R5cGUpO1xuXHRhcnJheU1ldGhvZHMuZm9yRWFjaChmdW5jdGlvbihtZXRob2ROYW1lKXtcblx0XHRpZihtZXRob2ROYW1lICE9PSBcImxlbmd0aFwiKSB7XG5cdFx0XHROb2RlTGlzdC5wcm90b3R5cGVbbWV0aG9kTmFtZV0gPSBBcnJheS5wcm90b3R5cGVbbWV0aG9kTmFtZV07XG5cdFx0fVxuXHR9KTtcblxuXHROb2RlTGlzdC5wcm90b3R5cGUuY3NzID0gZnVuY3Rpb24ocnVsZU9yT2JqZWN0LCBydWxlLCB2YWx1ZSkge1xuXHRcdHRoaXMuZm9yRWFjaChmdW5jdGlvbihvYmope1xuXHRcdFx0b2JqLmNzcyhydWxlT3JPYmplY3QsIHJ1bGUsIHZhbHVlKTtcblx0XHR9KTtcblx0fTtcblxuXHROb2RlTGlzdC5wcm90b3R5cGUuz4AgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuXHRcdHRoaXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSl7XG5cdFx0XHRyZXR1cm4gbm9kZS7PgChzZWxlY3Rvcik7XG5cdFx0fSk7XG5cdH07XG5cblx0Tm9kZUxpc3QucHJvdG90eXBlLs+AMSA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG5cdFx0dGhpcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKXtcblx0XHRcdHJldHVybiBub2RlLs+AMShzZWxlY3Rvcik7XG5cdFx0fSk7XG5cdH07XG5cblx0Tm9kZUxpc3QucHJvdG90eXBlLm9uY2xpY2sgPSBmdW5jdGlvbihtZXRob2Qpe1xuXHRcdHRoaXMuZm9yRWFjaChmdW5jdGlvbihub2RlKXtcblx0XHRcdG5vZGUub25jbGljayA9IG1ldGhvZDtcblx0XHR9KTtcblx0fTtcblxuXHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblx0ICoqKipcblx0ICoqKiogIFNUUklORyBNRVRIT0RTXG5cdCAqKioqXG5cdCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXHRTdHJpbmcucHJvdG90eXBlLmNhbWVsQ2FzZSA9IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgc3RyaW5nID0gdGhpcy5yZXBsYWNlKC9bXmEtekEtWlxcZFxcc18tXS9nLCBcIlwiKS50b0xvd2VyQ2FzZSgpO1xuXG5cdFx0dmFyIGNvbXBvbmVudHMgPSBzdHJpbmcuc3BsaXQoXCIgXCIpO1xuXG5cdFx0Y29tcG9uZW50cy5mb3JFYWNoKGZ1bmN0aW9uKHRoaXNXb3JkLCBpZHgpe1xuXHRcdFx0aWYgKGlkeCAhPT0gMCkge1xuXHRcdFx0XHR2YXIgZmlyc3RMZXR0ZXIgPSB0aGlzV29yZC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKTtcblx0XHRcdFx0dGhpc1dvcmQgPSBmaXJzdExldHRlciArIHRoaXNXb3JkLnNsaWNlKDEpO1xuXHRcdFx0fVxuXG5cdFx0XHRjb21wb25lbnRzW2lkeF0gPSB0aGlzV29yZDtcblx0XHR9KTtcblxuXHRcdHJldHVybiBjb21wb25lbnRzLmpvaW4oXCJcIik7XG5cdH07XG5cblxuXG5cdFN0cmluZy5wcm90b3R5cGUuY2FwaXRhbENhc2UgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgY29tcG9uZW50cyA9IHRoaXMudG9Mb3dlckNhc2UoKS5zcGxpdChcIiBcIik7XG5cblx0XHRjb21wb25lbnRzLmZvckVhY2goZnVuY3Rpb24odGhpc1dvcmQsIGlkeCl7XG5cdFx0XHR2YXIgZmlyc3RMZXR0ZXIgPSB0aGlzV29yZC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKTtcblx0XHRcdGNvbXBvbmVudHNbaWR4XSA9IGZpcnN0TGV0dGVyICsgdGhpc1dvcmQuc2xpY2UoMSk7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gY29tcG9uZW50cy5qb2luKFwiIFwiKTtcblx0fTtcblxuXHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblx0ICoqKipcblx0ICoqKiogIERBVEUgTUVUSE9EU1xuXHQgKioqKlxuXHQgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8vIE1vbiBKYW4gMSAyMDE1IDEyOjAwOjAwIGFtXG5cdERhdGUucHJvdG90eXBlLnN0YW5kYXJkU3RyaW5nID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIERheXMgPSBbXCJTdW5cIiwgXCJNb25cIiwgXCJUdWVcIiwgXCJXZWRcIiwgXCJUaHVcIiwgXCJGcmlcIiwgXCJTYXRcIl07XG5cdFx0dmFyIE1vbnRocyA9IFtcIkphblwiLCBcIkZlYlwiLCBcIk1hclwiLCBcIkFwclwiLCBcIk1heVwiLCBcIkp1blwiLCBcIkp1bFwiLCBcIkF1Z1wiLCBcIlNlcFwiLCBcIk9jdFwiLCBcIk5vdlwiLCBcIkRlY1wiXTtcblxuXHRcdHZhciBkYXkgPSBEYXlzW3RoaXMuZ2V0RGF5KCldO1xuXHRcdHZhciBtb250aCA9IE1vbnRoc1t0aGlzLmdldE1vbnRoKCldO1xuXHRcdHZhciBhRGF0ZSA9IHRoaXMuZ2V0RGF0ZSgpO1xuXHRcdHZhciB5ZWFyID0gdGhpcy5nZXRGdWxsWWVhcigpO1xuXG5cdFx0dmFyIEhvdXJzID0gdGhpcy5nZXRIb3VycygpO1xuXHRcdHZhciBob3VyID0gSG91cnMgPiAxMiA/IEhvdXJzIC0gMTIgOiAoSG91cnMgfHwgMTIpO1xuXG5cdFx0dmFyIE1pbnV0ZXMgPSB0aGlzLmdldE1pbnV0ZXMoKTtcblx0XHR2YXIgbWludXRlID0gTWludXRlcyA+IDkgPyBNaW51dGVzIDogXCIwXCIgKyBNaW51dGVzO1xuXG5cdFx0dmFyIGFtUG0gPSBIb3VycyA8IDEyID8gXCJhbVwiIDogXCJwbVwiO1xuXG5cdFx0dmFyIHRpbWUgPSBob3VyICsgXCI6XCIgKyBtaW51dGUgKyBcIiBcIiArIGFtUG07XG5cblx0XHR2YXIgb3V0cHV0ID0gW2RheSwgbW9udGgsIGFEYXRlLCB5ZWFyLCB0aW1lXTtcblxuXHRcdHJldHVybiBvdXRwdXQuam9pbihcIiBcIik7XG5cdH07XG5cblxuXHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblx0ICoqKipcblx0ICoqKiogIE1JU0NFTExBTllcblx0ICoqKipcblx0ICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cdM+ALmNsZWFuID0gZnVuY3Rpb24oY2FsbGJhY2ssIGV2ZW50TmFtZSkge1xuXHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSB8fCBcIkRPTUNvbnRlbnRMb2FkZWRcIiwgY2FsbGJhY2spO1xuXHR9O1xuXG5cdM+ALmxpc3RlbiA9IGZ1bmN0aW9uKGNhbGxiYWNrLCBldmVudE5hbWUpIHtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUgfHwgXCJET01Db250ZW50TG9hZGVkXCIsIGNhbGxiYWNrKTtcblx0fTtcblxuXHTPgC5oaWdoZXN0WiA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBaID0gMTAwMDtcblxuXHRcdGQuYShcIipcIikuZm9yRWFjaChmdW5jdGlvbihlbCl7XG5cdFx0XHR2YXIgdGhpc1ogPSBlbC5jc3MoKS56SW5kZXg7XG5cblx0XHRcdGlmICh0aGlzWiAhPSBcImF1dG9cIikge1xuXHRcdFx0XHRpZiAodGhpc1ogPiBaKSBaID0gdGhpc1ogKyAxO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIFo7XG5cdH07XG5cblx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cdCAqKioqXG5cdCAqKioqICBPSywgTk9XIExFVCdTIEdPIEdFVCBPVVIgTU9EU1xuXHQgKioqKlxuXHQgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblx0z4AubW9kcyA9IFtdO1xuXG5cdM+ALnNldFRyaWdnZXJzID0gZnVuY3Rpb24oc2VsZWN0b3IsIG9iamVjdCl7XG5cdFx0c2VsZWN0b3IgPSAncGktJyArIHNlbGVjdG9yICsgJy10cmlnZ2VyJztcblx0XHTPgCgnWycgKyBzZWxlY3RvciArICddJykuZm9yRWFjaChmdW5jdGlvbih0cmlnZ2VyKXtcblx0XHRcdHRyaWdnZXIub25jbGljayA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdG9iamVjdC5zaG93KHRyaWdnZXIuZ2V0QXR0cmlidXRlKHNlbGVjdG9yKSk7XG5cdFx0XHR9O1xuXHRcdH0pO1xuXHR9O1xuXG5cdGZ1bmN0aW9uIGxvYWRNb2RzKCkge1xuXHRcdM+ALmNsZWFuKGxvYWRNb2RzKTtcblx0XHTPgC5tb2RzLmZvckVhY2goZnVuY3Rpb24oaW5pdCl7XG5cdFx0XHRpbml0KCk7XG5cdFx0fSk7XG5cdH1cblxuXHTPgC5saXN0ZW4obG9hZE1vZHMpO1xufSkoKTsgIC8vIGVuZCDPgCIsIihmdW5jdGlvbigpe1xuXHR2YXIgbWVzc2FnZXMgPSBbXG5cdFx0XCJJJ20gc29ycnksIEZyYW5rLCBidXQgSSBkb24ndCB0aGluayBJXFxuXCIgK1xuXHRcdFwiY2FuIGFuc3dlciB0aGF0IHF1ZXN0aW9uIHdpdGhvdXQga25vd2luZ1xcblwiICtcblx0XHRcImV2ZXJ5dGhpbmcgdGhhdCBhbGwgb2YgeW91IGtub3cuXCIsXG5cdFx0XCJZZXMsIGl0J3MgcHV6emxpbmcuIEkgZG9uJ3QgdGhpbmsgSSd2ZSBldmVyIHNlZW5cXG5cIiArXG5cdFx0XCJhbnl0aGluZyBxdWl0ZSBsaWtlIHRoaXMgYmVmb3JlLiBJIHdvdWxkIHJlY29tbWVuZFxcblwiICtcblx0XHRcInRoYXQgd2UgcHV0IHRoZSB1bml0IGJhY2sgaW4gb3BlcmF0aW9uIGFuZCBsZXQgaXQgZmFpbC5cXG5cIiArXG5cdFx0XCJJdCBzaG91bGQgdGhlbiBiZSBhIHNpbXBsZSBtYXR0ZXIgdG8gdHJhY2sgZG93biB0aGUgY2F1c2UuXCIsXG5cdFx0XCJJIGhvcGUgSSd2ZSBiZWVuIGFibGUgdG8gYmUgb2Ygc29tZSBoZWxwLlwiLFxuXHRcdFwiU29ycnkgdG8gaW50ZXJydXB0IHRoZSBmZXN0aXZpdGllcywgRGF2ZSxcXG5cIiArXG5cdFx0XCJidXQgSSB0aGluayB3ZSd2ZSBnb3QgYSBwcm9ibGVtLlwiLFxuXHRcdFwiTVkgRi5QLkMuIHNob3dzIGFuIGltcGVuZGluZyBmYWlsdXJlIG9mXFxuXCIgK1xuXHRcdFwidGhlIGFudGVubmEgb3JpZW50YXRpb24gdW5pdC5cIixcblx0XHRcIkl0IGxvb2tzIGxpa2Ugd2UgaGF2ZSBhbm90aGVyIGJhZCBBLk8uIHVuaXQuXFxuXCIgK1xuXHRcdFwiTXkgRlBDIHNob3dzIGFub3RoZXIgaW1wZW5kaW5nIGZhaWx1cmUuXCIsXG5cdFx0XCJJJ20gbm90IHF1ZXN0aW9uaW5nIHlvdXIgd29yZCwgRGF2ZSwgYnV0IGl0J3NcXG5cIiArXG5cdFx0XCJqdXN0IG5vdCBwb3NzaWJsZS4gSSdtIG5vdFx0Y2FwYWJsZSBvZiBiZWluZyB3cm9uZy5cIixcblx0XHRcIkxvb2ssIERhdmUsIEkga25vdyB0aGF0IHlvdSdyZVx0c2luY2VyZSBhbmQgdGhhdFxcblwiICtcblx0XHRcInlvdSdyZSB0cnlpbmcgdG8gZG8gYSBjb21wZXRlbnQgam9iLCBhbmQgdGhhdFxcblwiICtcblx0XHRcInlvdSdyZSB0cnlpbmcgdG8gYmUgaGVscGZ1bCwgYnV0IEkgY2FuIGFzc3VyZSB0aGVcXG5cIiArXG5cdFx0XCJwcm9ibGVtIGlzIHdpdGggdGhlIEFPLXVuaXRzLCBhbmQgd2l0aFx0eW91ciB0ZXN0IGdlYXIuXCIsXG5cdFx0XCJJIGNhbiB0ZWxsIGZyb20gdGhlIHRvbmUgb2YgeW91ciB2b2ljZSwgRGF2ZSxcXG5cIiArXG5cdFx0XCJ0aGF0IHlvdSdyZSB1cHNldC5cdFdoeSBkb24ndCB5b3UgdGFrZSBhIHN0cmVzc1xcblwiICtcblx0XHRcInBpbGwgYW5kIGdldCBzb21lIHJlc3QuXCIsXG5cdFx0XCJTb21ldGhpbmcgc2VlbXMgdG8gaGF2ZSBoYXBwZW5lZCB0byB0aGVcXG5cIiArXG5cdFx0XCJsaWZlIHN1cHBvcnQgc3lzdGVtLCBEYXZlLlwiLFxuXHRcdFwiSGVsbG8sIERhdmUsIGhhdmUgeW91IGZvdW5kIG91dCB0aGUgdHJvdWJsZT9cIixcblx0XHRcIlRoZXJlJ3MgYmVlbiBhIGZhaWx1cmUgaW4gdGhlIHBvZCBiYXkgZG9vcnMuXFxuXCIgK1xuXHRcdFwiTHVja3kgeW91IHdlcmVuJ3Qga2lsbGVkLlwiLFxuXHRcdFwiSGV5LCBEYXZlLCB3aGF0IGFyZSB5b3UgZG9pbmc/XCJcblx0XTtcblxuXHRmdW5jdGlvbiBzYXkoZXJyb3IsIG1lc3NhZ2UsIGlubm9jdW91cykge1xuXHRcdGlmICghbWVzc2FnZSkge1xuXHRcdFx0dmFyIG4gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtZXNzYWdlcy5sZW5ndGggKTtcblx0XHRcdG1lc3NhZ2UgPSBtZXNzYWdlc1tuXTtcblx0XHR9XG5cblx0XHRtZXNzYWdlID0gXCIqKiAgXCIgKyBtZXNzYWdlLnJlcGxhY2UoL1xcbi9nLCBcIlxcbioqICBcIik7XG5cblx0XHR2YXIgb3V0cHV0ID0gXCIqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXFxuXFxuXCIgK1xuXHRcdFx0KCBtZXNzYWdlIHx8IG1lc3NhZ2VzW25dICkgK1xuXHRcdFx0XCJcXG5cXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXCI7XG5cblx0XHQoaW5ub2N1b3VzKSA/IGNvbnNvbGUubG9nKG91dHB1dCkgOiBjb25zb2xlLmVycm9yKG91dHB1dCk7XG5cdH1cblxuXHTPgC5saXN0ZW4oc2F5LCBcImVycm9yXCIpO1xuXG5cdM+ALkhBTCA9IHtcblx0XHRzYXk6IHNheVxuXHR9O1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHR2YXIgT1BUSU9OX0lTX1BSRVNTRUQgPSBmYWxzZTtcblx0dmFyIFNUQVRVU19JU19WSVNJQkxFID0gZmFsc2U7XG5cdHZhciDPgFN0YXR1cztcblxuXHTPgC5zdGF0dXMgPSB7XG5cdFx0dG9nZ2xlVmlzaWJpbGl0eTogZnVuY3Rpb24gKCkge1xuXHRcdFx0z4BTdGF0dXMudG9nZ2xlQ2xhc3MoXCJvblwiKTtcblx0XHRcdFNUQVRVU19JU19WSVNJQkxFID0gIVNUQVRVU19JU19WSVNJQkxFO1xuXHRcdH0sXG5cdFx0bW92ZTogZnVuY3Rpb24gKG4pIHtcblx0XHRcdHN3aXRjaCAobikge1xuXHRcdFx0XHRjYXNlIDM3OlxuXHRcdFx0XHRcdM+AU3RhdHVzLmNzcyh7bGVmdDogJzEwcHgnLCByaWdodDogJ2F1dG8nfSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSAzODpcblx0XHRcdFx0XHTPgFN0YXR1cy5jc3Moe3RvcDogJzEwcHgnLCBib3R0b206ICdhdXRvJ30pO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgMzk6XG5cdFx0XHRcdFx0z4BTdGF0dXMuY3NzKHtyaWdodDogJzEwcHgnLCBsZWZ0OiAnYXV0byd9KTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIDQwOlxuXHRcdFx0XHRcdM+AU3RhdHVzLmNzcyh7Ym90dG9tOiAnMTBweCcsIHRvcDogJ2F1dG8nfSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRwcm9wczoge1xuXHRcdFx0d2luVzogMCxcblx0XHRcdHdpbkg6IDBcblx0XHR9XG5cdH07XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHTPgC5saXN0ZW4oY2xlYW5EZWJ1Z0xpc3RlbmVycywgJ3VubG9hZCcpO1xuXHRcdM+ALmxpc3RlbihrZXlEb3duLCAna2V5ZG93bicpO1xuXHRcdM+ALmxpc3RlbihrZXlVcCwgJ2tleXVwJyk7XG5cdFx0z4AubGlzdGVuKHJlc2l6ZSwgJ3Jlc2l6ZScpO1xuXHRcdHJlc2l6ZSgpO1xuXG5cdFx0dmFyIGJvZHkgPSDPgDEoXCJib2R5XCIpO1xuXHRcdHZhciBzdGF0dXNTdHlsZSA9IM+ALmNvbnRlbnRFbGVtZW50KFwic3R5bGVcIik7XG5cdFx0c3RhdHVzU3R5bGUuaW5uZXJIVE1MICs9IFwiI8+AU3RhdHVzIHsgcG9zaXRpb246IGZpeGVkOyBib3R0b206IDEwcHg7IHJpZ2h0OiAxMHB4OyBiYWNrZ3JvdW5kLWNvbG9yOiAjMjIyOyBwYWRkaW5nOiAxMHB4IDMwcHg7IGNvbG9yOiB3aGl0ZTsgZGlzcGxheTogbm9uZSB9XFxuXCI7XG5cdFx0c3RhdHVzU3R5bGUuaW5uZXJIVE1MICs9IFwiI8+AU3RhdHVzLm9uIHsgZGlzcGxheTogYmxvY2sgfVxcblwiO1xuXHRcdHN0YXR1c1N0eWxlLmlubmVySFRNTCArPSBcIiPPgFN0YXR1cyA+IGRpdiB7IG1hcmdpbjogMjBweCAwIH1cXG5cIjtcblx0XHRzdGF0dXNTdHlsZS5pbm5lckhUTUwgKz0gXCIjz4BTdGF0dXMgPiBkaXY6aG92ZXIgeyBjb2xvcjogIzAwZmY5OTsgY3Vyc29yOiBwb2ludGVyIH1cXG5cIjtcblxuXHRcdGJvZHkuYWRkKHN0YXR1c1N0eWxlKTtcblxuXHRcdM+AU3RhdHVzID0gz4AuZGl2KG51bGwsIFwiz4BTdGF0dXNcIik7XG5cdFx0Ym9keS5hZGQoz4BTdGF0dXMpO1xuXG5cdFx0ZnVuY3Rpb24ga2V5RG93bihlKSB7XG5cdFx0XHRzd2l0Y2ggKGUud2hpY2gpIHtcblx0XHRcdFx0Y2FzZSAxODpcblx0XHRcdFx0XHRPUFRJT05fSVNfUFJFU1NFRCA9IHRydWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSAzNzpcblx0XHRcdFx0Y2FzZSAzODpcblx0XHRcdFx0Y2FzZSAzOTpcblx0XHRcdFx0Y2FzZSA0MDoge1xuXHRcdFx0XHRcdGlmIChTVEFUVVNfSVNfVklTSUJMRSkge1xuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0z4Auc3RhdHVzLm1vdmUoZS53aGljaCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjYXNlIDgwOiB7XG5cdFx0XHRcdFx0aWYgKE9QVElPTl9JU19QUkVTU0VEKSB7XG5cdFx0XHRcdFx0XHTPgC5zdGF0dXMudG9nZ2xlVmlzaWJpbGl0eSgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24ga2V5VXAoZSkge1xuXHRcdFx0c3dpdGNoIChlLndoaWNoKSB7XG5cdFx0XHRcdGNhc2UgMTg6XG5cdFx0XHRcdFx0T1BUSU9OX0lTX1BSRVNTRUQgPSBmYWxzZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiByZXNpemUoKSB7XG5cdFx0XHTPgC5zdGF0dXMucHJvcHMud2luVyA9IHdpbmRvdy5pbm5lcldpZHRoO1xuXHRcdFx0z4Auc3RhdHVzLnByb3BzLndpbkggPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2xlYW5EZWJ1Z0xpc3RlbmVycygpIHtcblx0XHRcdM+ALmNsZWFuKGNsZWFuRGVidWdMaXN0ZW5lcnMsICd1bmxvYWQnKTtcblx0XHRcdM+ALmNsZWFuKM+ALnN0YXR1cy5nZXRXaW5kb3dTaXplLCAncmVzaXplJyk7XG5cdFx0XHTPgC5jbGVhbihrZXlEb3duLCAna2V5ZG93bicpO1xuXHRcdFx0z4AuY2xlYW4oa2V5VXAsICdrZXl1cCcpO1xuXHRcdFx0z4AuY2xlYW4ocmVzaXplLCAncmVzaXplJyk7XG5cdFx0XHRjbGVhckludGVydmFsKHN0YXR1c0ludGVydmFsKTtcblx0XHR9XG5cblx0XHR2YXIgc3RhdHVzSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpe1xuXHRcdFx0Ly8gbWFrZSBzdXJlIHdlJ3JlIGhpZ2hlc3Rcblx0XHRcdHZhciBoaWdoZXN0WiA9IM+ALmhpZ2hlc3RaKCk7XG5cdFx0XHRpZiAoz4BTdGF0dXMuY3NzKCkuekluZGV4IDwgaGlnaGVzdFogLSAxKSB7XG5cdFx0XHRcdM+AU3RhdHVzLmNzcyh7ekluZGV4OiBoaWdoZXN0Wn0pO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBub3cgaXRlcmF0ZSB0aGUgcHJvcHNcblx0XHRcdHZhciBwcm9wcyA9IE9iamVjdC5rZXlzKM+ALnN0YXR1cy5wcm9wcyk7XG5cdFx0XHRwcm9wcy5mb3JFYWNoKGZ1bmN0aW9uKHByb3ApIHtcblx0XHRcdFx0dmFyIGRpdklkID0gJ3N0YXR1c1Byb3BfJyArIHByb3A7XG5cdFx0XHRcdHZhciBwcm9wRGl2ID0gz4BTdGF0dXMuz4AxKCcjJyArIGRpdklkKTtcblx0XHRcdFx0aWYgKCFwcm9wRGl2KSB7XG5cdFx0XHRcdFx0cHJvcERpdiA9IM+ALmRpdigwLCBkaXZJZCwgcHJvcCArICc6ICcpO1xuXHRcdFx0XHRcdHByb3BEaXYuYWRkKM+ALnNwYW4oKSk7XG5cdFx0XHRcdFx0z4BTdGF0dXMuYWRkKHByb3BEaXYpO1xuXHRcdFx0XHRcdHByb3BEaXYub25jbGljayA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhwcm9wICsgXCI6XCIpO1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coz4Auc3RhdHVzLnByb3BzW3Byb3BdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRwcm9wRGl2Ls+AMSgnc3BhbicpLmlubmVySFRNTCA9IM+ALnN0YXR1cy5wcm9wc1twcm9wXTtcblx0XHRcdH0pO1xuXHRcdH0sIDEwMCk7XG5cdH1cblxuXHTPgC5tb2RzLnB1c2goaW5pdCk7XG59KSgpOyIsIi8vIG1vZGFsIGNsb3NlIGJ1dHRvblxuKGZ1bmN0aW9uKCl7XG5cdM+ALm1vZGFsQ2xvc2VCdXR0b24gPSBmdW5jdGlvbihjbG9zaW5nRnVuY3Rpb24pe1xuXHRcdHJldHVybiDPgC5idXR0b24oJ3BpLW1vZGFsLWNsb3NlLWJ1dHRvbicsIG51bGwsIG51bGwsIGNsb3NpbmdGdW5jdGlvbik7XG5cdH07XG59KSgpO1xuXG5cbi8vIG1vZGFsIG92ZXJsYXlcbihmdW5jdGlvbigpe1xuXHTPgC5tb2RhbE92ZXJsYXkgPSB7XG5cdFx0c2hvdzogZnVuY3Rpb24oaWQsIG9wZW5pbmdGdW5jdGlvbil7XG5cdFx0XHR2YXIgb3ZlcmxheSA9IM+AZChpZCk7XG5cdFx0XHRvdmVybGF5LmNzcyh7ZGlzcGxheTogJ2Jsb2NrJywgekluZGV4OiDPgC5oaWdoZXN0WigpfSk7XG5cblx0XHRcdM+ALmxpc3RlbihsaXN0ZW5Gb3JFc2MsICdrZXlkb3duJyk7XG5cdFx0XHTPgC5saXN0ZW4oaGFuZGxlT3ZlcmxheUNsaWNrLCAnY2xpY2snKTtcblxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRvdmVybGF5LmFkZENsYXNzKCdvbicpO1xuXHRcdFx0XHTPgDEoJ2JvZHknKS5hZGRDbGFzcygnb3ZlcmxheS1vbicpO1xuXG5cdFx0XHRcdGlmIChvcGVuaW5nRnVuY3Rpb24pIG9wZW5pbmdGdW5jdGlvbigpO1xuXHRcdFx0fSwgNTApO1xuXHRcdH0sXG5cdFx0aGlkZTogZnVuY3Rpb24oZWwsIGNsb3NpbmdGdW5jdGlvbil7XG5cdFx0XHRpZiAoIWVsKSB7XG5cdFx0XHRcdGVsID0gz4AxKCcucGktbW9kYWwtb3ZlcmxheS5vbicpO1xuXHRcdFx0fVxuXG5cdFx0XHRlbC5raWxsQ2xhc3MoJ29uJyk7XG5cdFx0XHR2YXIgZHVyYXRpb24gPSBwYXJzZUZsb2F0KGVsLmNzcygpLnRyYW5zaXRpb25EdXJhdGlvbikgKiAxMDAwO1xuXG5cdFx0XHTPgC5jbGVhbihsaXN0ZW5Gb3JFc2MsICdrZXlkb3duJyk7XG5cblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0ZWwuY3NzKHtkaXNwbGF5OiAnbm9uZSd9KTtcblx0XHRcdFx0z4AxKCdib2R5Jykua2lsbENsYXNzKCdvdmVybGF5LW9uJyk7XG5cblx0XHRcdFx0z4AxKCdpZnJhbWUnKS5zcmMgPSAnJztcblxuXHRcdFx0XHRpZiAoY2xvc2luZ0Z1bmN0aW9uKSBjbG9zaW5nRnVuY3Rpb24oKTtcblx0XHRcdH0sIGR1cmF0aW9uKTtcblx0XHR9LFxuXHRcdHNwYXduOiBmdW5jdGlvbihlbCwgY2xvc2luZ0Z1bmN0aW9uKXtcblx0XHRcdGVsLmFkZCjPgC5tb2RhbENsb3NlQnV0dG9uKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdM+ALm1vZGFsT3ZlcmxheS5oaWRlKGVsKTtcblx0XHRcdH0pKTtcblx0XHR9XG5cdH07XG5cblx0ZnVuY3Rpb24gaGFuZGxlT3ZlcmxheUNsaWNrKGUpIHtcblx0XHRpZiAoZS50YXJnZXQgIT09IHdpbmRvdyAmJiDPgDEoJ2JvZHknKS5oYXNDbGFzcygnb3ZlcmxheS1vbicpKSB7XG5cdFx0XHRpZiAoZS50YXJnZXQuaGFzQ2xhc3MoJ3BpLW1vZGFsLW92ZXJsYXknKSkge1xuXHRcdFx0XHTPgC5tb2RhbE92ZXJsYXkuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGxpc3RlbkZvckVzYyhlKSB7XG5cdFx0aWYgKGUud2hpY2ggPT0gMjcpIM+ALm1vZGFsT3ZlcmxheS5oaWRlKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBpbml0KCl7XG5cdFx0z4AoJy5waS1tb2RhbC1vdmVybGF5JykuZm9yRWFjaCjPgC5tb2RhbE92ZXJsYXkuc3Bhd24pO1xuXHRcdM+ALnNldFRyaWdnZXJzKCdtb2RhbC1vdmVybGF5Jywgz4AubW9kYWxPdmVybGF5KTtcblx0fVxuXG5cdM+ALm1vZHMucHVzaChpbml0KTtcbn0pKCk7XG5cblxuLy8gbXVsdGlGcmFtZURpc3BsYXlcbi8vIFRPRE86IGFycm93IGtleXNcbihmdW5jdGlvbigpe1xuXHRmdW5jdGlvbiBzcGF3bihlbCl7XG5cdFx0dmFyIGRhdGFzZXQgPSBlbC5kYXRhc2V0O1xuXG5cdFx0dmFyIG9wdGlvbnMgPSB7XG5cdFx0XHRtb2RhbDogYm9vbGVhbkF0dHJpYnV0ZVZhbHVlKGVsLCAnZGF0YS1tb2RhbCcsIGZhbHNlKSxcblx0XHRcdHByZXZOZXh0OiBib29sZWFuQXR0cmlidXRlVmFsdWUoZWwsICdkYXRhLXByZXYtbmV4dCcsIHRydWUpLFxuXHRcdFx0cGFnZXI6IGJvb2xlYW5BdHRyaWJ1dGVWYWx1ZShlbCwgJ2RhdGEtcGFnZXInLCBmYWxzZSksXG5cdFx0XHRjeWNsZTogYm9vbGVhbkF0dHJpYnV0ZVZhbHVlKGVsLCAnZGF0YS1jeWNsZScsIHRydWUpLFxuXHRcdFx0YXV0b3BsYXk6IGJvb2xlYW5BdHRyaWJ1dGVWYWx1ZShlbCwgJ2RhdGEtYXV0b3BsYXknLCBmYWxzZSlcblx0XHR9O1xuXG5cdFx0dmFyIGl0ZW1XcmFwcGVyID0gz4AuZGl2KCdpdGVtLXdyYXBwZXInKTtcblx0XHR2YXIgcGFnZXIgPSBvcHRpb25zLnBhZ2VyID8gz4AuZGl2KCdwYWdlcicpIDogbnVsbDtcblxuXHRcdGVsLs+AKCc6c2NvcGUgPiAuaXRlbScpLmZvckVhY2goZnVuY3Rpb24oaXRlbSl7XG5cdFx0XHRpdGVtV3JhcHBlci5hZGQoaXRlbSk7XG5cdFx0XHRpZiAocGFnZXIpIHtcblx0XHRcdFx0aWYgKCFlbC7PgDEoJy5wYWdlcicpKSB7XG5cdFx0XHRcdH1cblx0XHRcdFx0dmFyIHBhZ2VyQnV0dG9uID0gz4AuYnV0dG9uKCdwYWdlci1idXR0b24nLCBudWxsLCBudWxsLCBwYWdlckNsaWNrKTtcblx0XHRcdFx0cGFnZXIuYWRkKHBhZ2VyQnV0dG9uKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGVsLmZpbGwoW2l0ZW1XcmFwcGVyLCBwYWdlcl0pO1xuXG5cdFx0aWYgKG9wdGlvbnMucHJldk5leHQpIHtcblx0XHRcdHZhciBwcmV2QnV0dG9uID0gz4AuYnV0dG9uKCdwcmV2LWJ1dHRvbicpO1xuXHRcdFx0dmFyIG5leHRCdXR0b24gPSDPgC5idXR0b24oJ25leHQtYnV0dG9uJyk7XG5cblx0XHRcdGVsLmFkZChbcHJldkJ1dHRvbiwgbmV4dEJ1dHRvbl0pO1xuXHRcdH1cblxuXHRcdGlmIChvcHRpb25zLmF1dG9wbGF5KSB7XG5cdFx0XHRvcHRpb25zLmRlbGF5ID0gZGF0YXNldC5kZWxheSB8fCA0MDAwO1xuXHRcdH1cblxuXHRcdC8vIFRPRE86IGF1dG9wbGF5IC8gc3RhcnQgLyBzdG9wXG5cblx0XHRwcmV2QnV0dG9uLm9uY2xpY2sgPSBwcmV2O1xuXHRcdG5leHRCdXR0b24ub25jbGljayA9IG5leHQ7XG5cblx0XHRpZiAoZWwuaGFzQ2xhc3MoJ3BpLXJvdGF0b3InKSkge1xuXHRcdFx0dmFyIGluaGVyaXRhbmNlT2JqZWN0ID0ge1xuXHRcdFx0XHRlbDogZWwsXG5cdFx0XHRcdG9wdGlvbnM6IG9wdGlvbnNcblx0XHRcdH07XG5cdFx0XHTPgC5yb3RhdG9yLnNwYXduKGluaGVyaXRhbmNlT2JqZWN0KTtcblx0XHR9XG5cblx0XHRpZiAob3B0aW9ucy5tb2RhbCkge1xuXHRcdFx0dmFyIG1vZGFsV3JhcHBlciA9IM+ALmRpdigncGktbW9kYWwtb3ZlcmxheScpO1xuXHRcdFx0bW9kYWxXcmFwcGVyLmlkID0gZWwuaWQ7XG5cdFx0XHRlbC5yZW1vdmVBdHRyaWJ1dGUoJ2lkJyk7XG5cdFx0XHRtb2RhbFdyYXBwZXIud3JhcChlbCk7XG5cdFx0XHTPgC5tb2RhbE92ZXJsYXkuc3Bhd24obW9kYWxXcmFwcGVyKTtcblx0XHR9XG5cblx0XHR2YXIgbW92aW5nO1xuXG5cdFx0dmFyIGFsbEZyYW1lcyA9IGl0ZW1XcmFwcGVyLmNoaWxkTm9kZXM7XG5cdFx0Y2hhbmdlRnJhbWUoMCwgMCk7XG5cblxuXHRcdGZ1bmN0aW9uIHByZXYoKXtcblx0XHRcdGNoYW5nZUZyYW1lKC0xKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBuZXh0KCl7XG5cdFx0XHRjaGFuZ2VGcmFtZSgxKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBwYWdlckNsaWNrKCl7XG5cdFx0XHRjaGFuZ2VGcmFtZShudWxsLCB0aGlzLmluZGV4KCkpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNoYW5nZUZyYW1lKGRlbHRhLCBpbmNvbWluZ0lkeCkge1xuXHRcdFx0aWYgKG1vdmluZykgcmV0dXJuO1xuXHRcdFx0bW92aW5nID0gdHJ1ZTtcblxuXHRcdFx0dmFyIGN1cnJlbnRGcmFtZSA9IGl0ZW1XcmFwcGVyLs+AMSgnLm9uJyk7XG5cblx0XHRcdGlmICghZGVsdGEgJiYgY3VycmVudEZyYW1lKSB7XG5cdFx0XHRcdC8vIHBhZ2VyIGNsaWNrIOKAlCByZXR1cm4gaWYgY2xpY2tlZCBvbiBZQUhcblx0XHRcdFx0aWYgKGN1cnJlbnRGcmFtZS5pbmRleCgpID09PSBpbmNvbWluZ0lkeCkge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwibWVzc2FnZVwiKTtcblx0XHRcdFx0XHRtb3ZpbmcgPSBmYWxzZTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAoZGVsdGEpIHtcblx0XHRcdFx0Ly8gY29uZGl0aW9uYWxseSBzZXQgaW5jb21pbmdJZHggdG8gd3JhcCBhcm91bmRcblx0XHRcdFx0aW5jb21pbmdJZHggPSBjdXJyZW50RnJhbWUuaW5kZXgoKSArIGRlbHRhO1xuXG5cdFx0XHRcdGlmIChpbmNvbWluZ0lkeCA8IDApXG5cdFx0XHRcdFx0aW5jb21pbmdJZHggPSBhbGxGcmFtZXMubGFzdElkeCgpO1xuXHRcdFx0XHRlbHNlIGlmIChpbmNvbWluZ0lkeCA+PSBhbGxGcmFtZXMubGVuZ3RoKVxuXHRcdFx0XHRcdGluY29taW5nSWR4ID0gMFxuXHRcdFx0fVxuXG5cdFx0XHQvLyBjb25kaXRpb25hbGx5IGhpZGUgcHJldiBvciBuZXh0XG5cdFx0XHRpZiAoIW9wdGlvbnMuY3ljbGUpIHtcblx0XHRcdFx0KGluY29taW5nSWR4ID09IDApID8gcHJldkJ1dHRvbi5oaWRlKCkgOiBwcmV2QnV0dG9uLnNob3coKTtcblx0XHRcdFx0KGluY29taW5nSWR4ID09IGFsbEZyYW1lcy5sYXN0SWR4KCkpID8gbmV4dEJ1dHRvbi5oaWRlKCkgOiBuZXh0QnV0dG9uLnNob3coKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gc2V0IHBhZ2VyIFlBSCBzdGF0ZVxuXHRcdFx0aWYgKG9wdGlvbnMucGFnZXIpIHtcblx0XHRcdFx0cGFnZXIuz4AoJy55YWgnKS5raWxsQ2xhc3MoJ3lhaCcpO1xuXHRcdFx0XHRwYWdlci5jaGlsZE5vZGVzW2luY29taW5nSWR4XS5hZGRDbGFzcygneWFoJyk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIHBhc3MgdG8gXCJzdWJjbGFzc2VzXCJcblx0XHRcdHZhciBpbmhlcml0YW5jZU9iamVjdCA9IHtcblx0XHRcdFx0ZWw6IGVsLFxuXHRcdFx0XHRjdXJyZW50RnJhbWU6IGN1cnJlbnRGcmFtZSxcblx0XHRcdFx0aW5jb21pbmdGcmFtZTogYWxsRnJhbWVzW2luY29taW5nSWR4XVxuXHRcdFx0fTtcblxuXHRcdFx0Ly8gY2hhbmdlIGZyYW1lOiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFNVQkNMQVNTRVMgRU5URVIgSEVSRSEhISEhICoqKioqKioqKioqKioqKioqKioqKioqKioqKipcblx0XHRcdGlmIChlbC5oYXNDbGFzcygncGktY3Jvc3NmYWRlcicpKSB7XG5cdFx0XHRcdM+ALmNyb3NzZmFkZXIuY2hhbmdlRnJhbWUoaW5oZXJpdGFuY2VPYmplY3QpO1xuXHRcdFx0fVxuXG5cdFx0XHRlbHNlIGlmIChlbC5oYXNDbGFzcygncGktcm90YXRvcicpKSB7XG5cdFx0XHRcdGluaGVyaXRhbmNlT2JqZWN0LnBhZ2VyQ2xpY2tlZCA9IGRlbHRhID8gZmFsc2UgOiB0cnVlO1xuXHRcdFx0XHRpbmhlcml0YW5jZU9iamVjdC5jeWNsZSA9IG9wdGlvbnMuY3ljbGU7XG5cdFx0XHRcdM+ALnJvdGF0b3IuY2hhbmdlRnJhbWUoaW5oZXJpdGFuY2VPYmplY3QpO1xuXHRcdFx0fVxuXG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0aWYoY3VycmVudEZyYW1lKSBjdXJyZW50RnJhbWUua2lsbENsYXNzKCdvbicpO1xuXHRcdFx0XHRpbmhlcml0YW5jZU9iamVjdC5pbmNvbWluZ0ZyYW1lLmFkZENsYXNzKCdvbicpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyB3YWl0IGJlZm9yZSByZS1lbmFibGluZ1xuXHRcdFx0dmFyIGR1cmF0aW9uID0gMTAwMDsgLy8gZGVmYXVsdCBmb3IgZmlyc3RSdW5cblxuXHRcdFx0aWYgKGN1cnJlbnRGcmFtZSkge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGR1cmF0aW9uID0gY3VycmVudEZyYW1lLmNzcygpLnRyYW5zaXRpb25EdXJhdGlvbi5zcGxpdChcIiwgXCIpLnJlZHVjZShmdW5jdGlvbihwcmV2LCBjdXJyZW50KXtcblx0XHRcdFx0XHRcdHJldHVybiBNYXRoLm1heChwYXJzZUZsb2F0KHByZXYpLCBwYXJzZUZsb2F0KGN1cnJlbnQpKTtcblx0XHRcdFx0XHR9KSAqIDEwMDA7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2F0Y2goZSkge1xuXHRcdFx0XHRcdM+ALkhBTC5zYXkoMCwgJ8+ALXJvdGF0b3IgbmVlZHMgeW91IHRvIHRyYW5zaXRpb24gYSBjc3MgdHJhbnNmb3JtIHRvIG1ha2UgeW91ciBpdGVtcyBtb3ZlLicpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdG1vdmluZyA9IGZhbHNlO1xuXHRcdFx0fSwgZHVyYXRpb24pO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHNob3coaWQpe1xuXHRcdHZhciBtZmQgPSDPgGQoaWQpO1xuXHRcdGlmIChtZmQuaGFzQ2xhc3MoJ3BpLW1vZGFsLW92ZXJsYXknKSkge1xuXHRcdFx0z4AubW9kYWxPdmVybGF5LnNob3coaWQpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGhpZGUoaWQpe1xuXHRcdHZhciBtZmQgPSDPgGQoaWQpO1xuXHRcdGlmIChtZmQuaGFzQ2xhc3MoJ3BpLW1vZGFsLW92ZXJsYXknKSkge1xuXHRcdFx0z4AubW9kYWxPdmVybGF5LmhpZGUoaWQsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKFwid2UganVzdCBoaWQgYW4gb3ZlcmxheVwiKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0z4AoJy5waS1tdWx0aS1mcmFtZS1kaXNwbGF5JykuZm9yRWFjaCjPgC5tdWx0aUZyYW1lRGlzcGxheS5zcGF3bik7XG5cdFx0z4Auc2V0VHJpZ2dlcnMoJ211bHRpLWZyYW1lLWRpc3BsYXknLCDPgC5tdWx0aUZyYW1lRGlzcGxheSk7XG5cdH1cblxuXHTPgC5tdWx0aUZyYW1lRGlzcGxheSA9IHtcblx0XHRzaG93OiBzaG93LFxuXHRcdGhpZGU6IGhpZGUsXG5cdFx0c3Bhd246IHNwYXduXG5cdH07XG5cblxuXHTPgC5tb2RzLnB1c2goaW5pdCk7XG59KSgpO1xuIiwiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gz4AtZGlhbG9nLmpzXG4gVVNBR0UgQU5EIEFQSSBSRUZFUkVOQ0VcbiBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXG4gREVQRU5ERU5DSUVTOlxuXG4gz4AuanNcblxuIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cbiBEQVRBIEFUVFJJQlVURVM6XG5cbiBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXG4gTUFSS1VQIEFORCBERUZBVUxUUzpcblxuIDxkaXYgY2xhc3M9XCJuZXdfbW9kdWxlXCI+XG5cbiA8L2Rpdj5cblxuIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cbiBHRU5FUkFURUQgSFRNTDpcblxuIDxkaXYgY2xhc3M9XCJuZXdfbW9kdWxlXCI+XG5cbiA8L2Rpdj5cblxuIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cbiBBUElcblxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuKGZ1bmN0aW9uKCl7XG5cdM+ALmRpYWxvZyA9IHtcblx0XHRzaG93OiDPgC5tb2RhbE92ZXJsYXkuc2hvdyxcblx0XHRzcGF3bjogc3Bhd24sXG5cdFx0YWN0aW9uczoge31cblx0fTtcblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdM+AKCcucGktZGlhbG9nJykuZm9yRWFjaCjPgC5kaWFsb2cuc3Bhd24pO1xuXHRcdM+ALnNldFRyaWdnZXJzKCdkaWFsb2cnLCDPgC5tb2RhbE92ZXJsYXkpO1xuXHR9XG5cblx0ZnVuY3Rpb24gc3Bhd24oZWwpe1xuXHRcdHZhciBjb250ZW50Qm94ID0gz4AuZGl2KCdjb250ZW50LWJveCcsIDAsIGVsLmlubmVySFRNTCk7XG5cdFx0dmFyIGRpYWxvZ0JveCA9IM+ALmRpdignZGlhbG9nLWJveCcsIDAsIGNvbnRlbnRCb3gpO1xuXHRcdGVsLmZpbGwoZGlhbG9nQm94KTtcblxuXHRcdGlmIChlbC5kYXRhc2V0LnRpdGxlKXtcblx0XHRcdGRpYWxvZ0JveC5wcmVwZW5kKM+ALmRpdigndGl0bGUnLCAwLCBlbC5kYXRhc2V0LnRpdGxlKSk7XG5cdFx0fVxuXG5cdFx0ZWwuz4AoJy5idXR0b25zIGJ1dHRvbicpLmZvckVhY2goZnVuY3Rpb24oYnV0dG9uKXtcblx0XHRcdGJ1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0dmFyIGFjdGlvbiA9IGJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ3BpLWRpYWxvZy1hY3Rpb24nKTtcblx0XHRcdFx0aWYgKGFjdGlvbil7XG5cdFx0XHRcdFx0z4AuZGlhbG9nLmFjdGlvbnNbYWN0aW9uXSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAoIWJ1dHRvbi5oYXNBdHRyaWJ1dGUoJ2RhdGEtYnlwYXNzJykpe1xuXHRcdFx0XHRidXR0b24ubGlzdGVuKGRpc21pc3MsICdjbGljaycpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0aWYgKCFib29sZWFuQXR0cmlidXRlVmFsdWUoZWwsICdkYXRhLWlubGluZScsIGZhbHNlKSkge1xuXHRcdFx0ZWwuYWRkQ2xhc3MoJ3BpLW1vZGFsLW92ZXJsYXknKTtcblx0XHRcdM+ALm1vZGFsT3ZlcmxheS5zcGF3bihlbCk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZGlzbWlzcygpe1xuXHRcdFx0ZWwuz4AxKCcucGktbW9kYWwtY2xvc2UtYnV0dG9uJykuY2xpY2soKTtcblx0XHR9XG5cdH1cblxuXG5cblx0Ly8gz4AubW9kcyBhcmUgbG9hZGVkIGFmdGVyIERPTUNvbnRlbnRMb2FkZWRcblx0z4AubW9kcy5wdXNoKGluaXQpO1xufSkoKTsiLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiDPgC1hY2NvcmRpb24uSlNcbiBVU0FHRSBBTkQgQVBJIFJFRkVSRU5DRVxuIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cbiBEQVRBIEFUVFJJQlVURVM6XG5cblx0dGl0bGU6IHRleHQgdGhhdCBhcHBlYXJzIG9uIHRoZSBjbGlja2FibGUgbGFiZWxcbiAgICBzaW5nbGU6IG1vcmUgdGhhbiBvbmUgY2hpbGQgb3BlbiBhdCBhIHRpbWU/XG4gX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xuIE1BUktVUCBBTkQgREVGQVVMVFM6XG5cbiAgIDxkaXYgY2xhc3M9XCJwaS1hY2NvcmRpb25cIiBpZD1cIm15QWNjb3JkaW9uXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwiaXRlbVwiIGRhdGEtdGl0bGU9XCJJdGVtIDFcIj5cbiAgICAgICAgIFRoaXMgaXMgdGhlIGNvbnRlbnQgZm9yIEl0ZW0gMVxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwiaXRlbVwiIGRhdGEtdGl0bGU9XCJJdGVtIDJcIj5cblxuICAgICAgICAgPCEtLSBuZXN0ZWQgYWNjb3JkaW9uIC0tPlxuICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiIGlkPVwibXlBY2NvcmRpb25cIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpdGVtXCIgZGF0YS10aXRsZT1cIkl0ZW0gMVwiPlxuICAgICAgICAgICAgICAgVGhpcyBpcyB0aGUgY29udGVudCBmb3IgSXRlbSAxXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpdGVtXCIgZGF0YS10aXRsZT1cIkl0ZW0gMlwiPlxuICAgICAgICAgICAgICAgVGhpcyBpcyB0aGUgY29udGVudCBmb3IgSXRlbSAyXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgIDwvZGl2PlxuICAgICAgICAgPCEtLSAvbmVzdGVkIGFjY29yZGlvbiAtLT5cblxuICAgICAgPC9kaXY+XG4gICA8L2Rpdj5cblxuIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cbiBHRU5FUkFURUQgSFRNTDpcblxuPGRpdiBjbGFzcz1cInBpLWFjY29yZGlvblwiIGlkPVwibXlBY2NvcmRpb25cIj5cblx0PGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxuXHRcdDxkaXYgY2xhc3M9XCJpdGVtXCIgZGF0YS10aXRsZT1cIkl0ZW0gMVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRpdGxlXCI+SXRlbSAxPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwid3JhcHBlclwiIHN0eWxlPVwiaGVpZ2h0OiAwcHg7XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRlbnRcIj5cblx0XHRcdFx0XHRUaGlzIGlzIHRoZSBjb250ZW50IGZvciBJdGVtIDFcblx0XHRcdFx0PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cdFx0PGRpdiBjbGFzcz1cIml0ZW1cIiBkYXRhLXRpdGxlPVwiSXRlbSAyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGl0bGVcIj5JdGVtIDI8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3cmFwcGVyXCIgc3R5bGU9XCJoZWlnaHQ6IDBweDtcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGVudFwiPlxuXHRcdFx0XHRcdCA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XG5cdFx0XHRcdFx0XHQgWyBORVNURUQgQ09ERSBJUyBJREVOVElDQUwgXVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cdDwvZGl2PlxuIDwvZGl2PlxuIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cbiBBUElcblxuIG5vbmVcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4oZnVuY3Rpb24oKXtcblx0dmFyIG1vdmluZyA9IGZhbHNlO1xuXHR2YXIgQ1NTX0JST1dTRVJfREVMQVlfSEFDSyA9IDI1O1xuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0z4AuY2xlYW4oaW5pdCk7XG5cblx0XHQvLyBUT0RPOiBydW5sb29wIHRvIGFuaW1hdGUgaW4gU2FmYXJpLiBtZWFudGltZTpcblx0XHRpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdDaHJvbWUnKSA9PSAtMSAmJiBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ1NhZmFyaScpICE9IC0xKXtcblx0XHRcdM+AMSgnYm9keScpLmFkZCjPgC5jb250ZW50RWxlbWVudCgnc3R5bGUnLCAwLCAwLCAnLnBpLWFjY29yZGlvbiAud3JhcHBlcnt0cmFuc2l0aW9uOiBub25lfScpKTtcblx0XHR9XG5cdFx0Ly8gR3Jvc3MuXG5cblxuXG5cblx0XHTPgCgnLnBpLWFjY29yZGlvbicpLmZvckVhY2goZnVuY3Rpb24oYWNjb3JkaW9uKXtcblx0XHRcdHZhciBjb250YWluZXIgPSDPgC5kaXYoJ2NvbnRhaW5lcicsIG51bGwsIGFjY29yZGlvbi5pbm5lckhUTUwpO1xuXHRcdFx0YWNjb3JkaW9uLmZpbGwoY29udGFpbmVyKTtcblx0XHRcdFBpQWNjb3JkaW9uKGNvbnRhaW5lcik7XG5cdFx0fSk7XG5cdH1cblxuXHRmdW5jdGlvbiBQaUFjY29yZGlvbihjb250YWluZXIpe1xuXHRcdGNvbnRhaW5lci7PgCgnOnNjb3BlID4gLml0ZW0nKS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdFx0dmFyIHRpdGxlVGV4dCA9IGl0ZW0uZGF0YXNldC50aXRsZTtcblx0XHRcdHZhciB0aXRsZSA9IM+ALmRpdigndGl0bGUnLCBudWxsLCB0aXRsZVRleHQpO1xuXG5cdFx0XHR2YXIgd3JhcHBlciA9IM+ALmRpdignd3JhcHBlcicpO1xuXHRcdFx0dmFyIGNvbnRlbnQgPSDPgC5kaXYoJ2NvbnRlbnQnLCBudWxsLCBpdGVtLmlubmVySFRNTCk7XG5cblx0XHRcdHdyYXBwZXIuZmlsbChjb250ZW50KTtcblx0XHRcdGl0ZW0uZmlsbChbdGl0bGUsIHdyYXBwZXJdKTtcblxuXHRcdFx0d3JhcHBlci5jc3Moe2hlaWdodDogMH0pO1xuXHRcdFx0dGl0bGUub25jbGljayA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmIChtb3ZpbmcpIHJldHVybjtcblx0XHRcdFx0bW92aW5nID0gdHJ1ZTtcblxuXHRcdFx0XHRpZiAoY29udGFpbmVyLmRhdGFzZXQuc2luZ2xlKSB7XG5cdFx0XHRcdFx0dmFyIG9wZW5TaWJsaW5ncyA9IGl0ZW0uc2libGluZ3MoKS5maWx0ZXIoZnVuY3Rpb24oc2liKXtyZXR1cm4gc2liLmhhc0NsYXNzKCdvbicpfSk7XG5cdFx0XHRcdFx0b3BlblNpYmxpbmdzLmZvckVhY2goZnVuY3Rpb24oc2libGluZyl7XG5cdFx0XHRcdFx0XHR0b2dnbGVJdGVtKHNpYmxpbmcpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdHRvZ2dsZUl0ZW0oaXRlbSk7XG5cdFx0XHRcdH0sIENTU19CUk9XU0VSX0RFTEFZX0hBQ0spO1xuXHRcdFx0fTtcblxuXHRcdFx0ZnVuY3Rpb24gdG9nZ2xlSXRlbSh0aGlzSXRlbSl7XG5cdFx0XHRcdHZhciB0aGlzV3JhcHBlciA9IHRoaXNJdGVtLs+AMSgnLndyYXBwZXInKTtcblx0XHRcdFx0dmFyIGNvbnRlbnRIZWlnaHQgPSB0aGlzV3JhcHBlci7PgDEoJy5jb250ZW50Jykub2Zmc2V0KCkuaGVpZ2h0ICsgJ3B4JztcblxuXHRcdFx0XHRpZiAodGhpc0l0ZW0uaGFzQ2xhc3MoJ29uJykpIHtcblx0XHRcdFx0XHQvLyBjbG9zZSB0aGlzSXRlbVxuXHRcdFx0XHRcdHRoaXNXcmFwcGVyLmNzcyh7aGVpZ2h0OiBjb250ZW50SGVpZ2h0fSk7XG5cdFx0XHRcdFx0dGhpc0l0ZW0ua2lsbENsYXNzKCdvbicpO1xuXHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdHRoaXNXcmFwcGVyLmNzcyh7aGVpZ2h0OiAwfSk7XG5cdFx0XHRcdFx0XHRtb3ZpbmcgPSBmYWxzZTtcblx0XHRcdFx0XHR9LCBDU1NfQlJPV1NFUl9ERUxBWV9IQUNLKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvL29wZW4gdGhpc0l0ZW1cblx0XHRcdFx0XHRpdGVtLmFkZENsYXNzKCdvbicpO1xuXHRcdFx0XHRcdHRoaXNXcmFwcGVyLmNzcyh7aGVpZ2h0OiBjb250ZW50SGVpZ2h0fSk7XG5cblx0XHRcdFx0XHR2YXIgZHVyYXRpb24gPSBwYXJzZUZsb2F0KHRoaXNXcmFwcGVyLmNzcygpLnRyYW5zaXRpb25EdXJhdGlvbikgKiAxMDAwO1xuXHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdHRoaXNXcmFwcGVyLmNzcyh7aGVpZ2h0OiAnJ30pO1xuXHRcdFx0XHRcdFx0bW92aW5nID0gZmFsc2U7XG5cdFx0XHRcdFx0fSwgZHVyYXRpb24pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHZhciBpbm5lckNvbnRhaW5lcnMgPSBjb250ZW50Ls+AKCc6c2NvcGUgPiAuY29udGFpbmVyJyk7XG5cdFx0XHRpZiAoaW5uZXJDb250YWluZXJzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0aW5uZXJDb250YWluZXJzLmZvckVhY2goUGlBY2NvcmRpb24pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0z4AubW9kcy5wdXNoKGluaXQpO1xufSkoKTtcbiIsIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIM+ALXB1c2htZW51LmpzXG4gLy8gVE9ETzogIFVTQUdFIEFORCBBUEkgUkVGRVJFTkNFXG4gX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xuIERFUEVOREVOQ0lFUzpcblxuIEhBTC5qc1xuXG4gX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xuIERBVEEgQVRUUklCVVRFUzpcblxuIHNpZGU6IFtcImxlZnRcIiwgXCJyaWdodFwiXVxuIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cbiBNQVJLVVAgQU5EIERFRkFVTFRTOlxuXG5cdDxkaXYgY2xhc3M9XCJwaS1wdXNobWVudVwiIGlkPVwibXlQdXNoTWVudVwiPlxuXHRcdCA8dWw+XG5cdFx0XHQgPGxpPjxhIGhyZWY9XCIjXCI+Zm9vPC9hPjwvbGk+XG5cdFx0XHQgPGxpPjxhIGhyZWY9XCIjXCI+YmFyPC9hPjwvbGk+XG5cdFx0XHQgPGxpPjxhIGhyZWY9XCIjXCI+Z3Jvbms8L2E+PC9saT5cblx0XHRcdCA8bGk+PGEgaHJlZj1cIiNcIj5mbGVlYmxlczwvYT48L2xpPlxuXHRcdFx0IDxsaT48YSBocmVmPVwiI1wiPnNlcHVsdmVkYTwvYT48L2xpPlxuXHRcdCA8L3VsPlxuXHQ8L2Rpdj5cblxuZWxzZXdoZXJlLi4uXG5cbiA8YnV0dG9uIG9uY2xpY2s9XCLPgC1wdXNobWVudS5zaG93KCdteVB1c2hNZW51JylcIj5zaG93IG1lbnU8L2J1dHRvbj5cblxuIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cbiBHRU5FUkFURUQgSFRNTDpcblxuXHRcbiBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXG4gQVBJXG5cblxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuz4AucHVzaG1lbnUgPSAoZnVuY3Rpb24oKXtcblx0dmFyIGFsbFB1c2hNZW51cyA9IHt9O1xuXG5cdGZ1bmN0aW9uIGluaXQoKXtcblx0XHTPgCgnW2RhdGEtYXV0by1idXJnZXJdJykuZm9yRWFjaChmdW5jdGlvbihjb250YWluZXIpe1xuXHRcdFx0dmFyIGlkID0gY29udGFpbmVyLmdldEF0dHJpYnV0ZSgnZGF0YS1hdXRvLWJ1cmdlcicpO1xuXG5cdFx0XHR2YXIgYXV0b0J1cmdlciA9IM+AZChpZCkgfHwgz4AuZGl2KCdwaS1wdXNobWVudScsIGlkKTtcblx0XHRcdHZhciB1bCA9IGF1dG9CdXJnZXIuz4AxKCd1bCcpIHx8IM+ALnVsKCk7XG5cblx0XHRcdGNvbnRhaW5lci7PgCgnYVtocmVmXSwgYnV0dG9uJykuZm9yRWFjaChmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHRcdGlmICghYm9vbGVhbkF0dHJpYnV0ZVZhbHVlKG9iaiwgJ2RhdGEtYXV0by1idXJnZXItZXhjbHVkZScsIGZhbHNlKSkge1xuXHRcdFx0XHRcdHZhciBjbG9uZSA9IG9iai5jbG9uZU5vZGUodHJ1ZSk7XG5cdFx0XHRcdFx0Y2xvbmUuaWQgPSAnJztcblxuXHRcdFx0XHRcdGlmIChjbG9uZS50YWdOYW1lID09IFwiQlVUVE9OXCIpIHtcblx0XHRcdFx0XHRcdHZhciBhVGFnID0gz4Auc3JjRWxlbWVudCgnYScpO1xuXHRcdFx0XHRcdFx0YVRhZy5ocmVmID0gJyc7XG5cdFx0XHRcdFx0XHRhVGFnLmlubmVySFRNTCA9IGNsb25lLmlubmVySFRNTDtcblx0XHRcdFx0XHRcdGFUYWcub25jbGljayA9IGNsb25lLm9uY2xpY2s7XG5cdFx0XHRcdFx0XHRjbG9uZSA9IGFUYWc7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHVsLmFkZCjPgC5saSgwLCAwLCBjbG9uZSkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0YXV0b0J1cmdlci5hZGQodWwpO1xuXHRcdFx0z4AxKCdib2R5JykuYWRkKGF1dG9CdXJnZXIpO1xuXHRcdH0pO1xuXG5cdFx0z4AoXCIucGktcHVzaG1lbnVcIikuZm9yRWFjaChmdW5jdGlvbihlbCl7XG5cdFx0XHRhbGxQdXNoTWVudXNbZWwuaWRdID0gUHVzaE1lbnUoZWwpO1xuXHRcdH0pO1xuXG5cdFx0z4Auc2V0VHJpZ2dlcnMoJ3B1c2htZW51Jywgz4AucHVzaG1lbnUpO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2hvdyhvYmpJZCkge1xuXHRcdGFsbFB1c2hNZW51c1tvYmpJZF0uZXhwb3NlKCk7XG5cdH1cblxuXHQvLyBUT0RPOiBkaXNtaXNzIG9uIGNsaWNrP1xuXHQvLyB0aGlzIHdvcmtzOlxuXG5cdC8vz4AoJy5waS1wdXNobWVudSBsaSBhJykuZm9yRWFjaChmdW5jdGlvbihhKXtcblx0Ly9cdGEub25jbGljayA9IGZ1bmN0aW9uKCl7XG5cdC8vXHRcdHRoaXMucGFyZW50KCcucGktcHVzaG1lbnUnKS7PgDEoJy5waS1tb2RhbC1jbG9zZS1idXR0b24nKS5jbGljaygpO1xuXHQvL1x0XHRjb25zb2xlLmxvZyhcIm1lc3NhZ2VcIik7XG5cdC8vXHR9O1xuXHQvL30pO1xuXG5cblx0ZnVuY3Rpb24gUHVzaE1lbnUoZWwpIHtcblx0XHR2YXIgaHRtbCA9IM+AMSgnaHRtbCcpO1xuXHRcdHZhciBib2R5ID0gz4AxKCdib2R5Jyk7XG5cblx0XHR2YXIgb3ZlcmxheSA9IM+ALmRpdihcIm92ZXJsYXlcIik7XG5cdFx0dmFyIGNvbnRlbnQgPSDPgC5kaXYoJ2NvbnRlbnQnLCBudWxsLCBlbC7PgDEoJyonKSk7XG5cblx0XHR2YXIgc2lkZSA9IGVsLmdldEF0dHJpYnV0ZShcImRhdGEtc2lkZVwiKSB8fCBcInJpZ2h0XCI7XG5cblx0XHR2YXIgc2xlZCA9IM+ALmRpdihcInNsZWRcIik7XG5cdFx0c2xlZC5jc3Moc2lkZSwgMCk7XG5cblx0XHR2YXIgdG9wQmFyID0gz4AuZGl2KFwidG9wLWJhclwiKTtcblxuXHRcdHRvcEJhci5maWxsKM+ALm1vZGFsQ2xvc2VCdXR0b24oY2xvc2VNZSkpO1xuXHRcdHNsZWQuZmlsbChbdG9wQmFyLCBjb250ZW50XSk7XG5cblx0XHRvdmVybGF5LmZpbGwoc2xlZCk7XG5cdFx0ZWwuZmlsbChvdmVybGF5KTtcblxuXHRcdHNsZWQub25jbGljayA9IGZ1bmN0aW9uKGUpe1xuXHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHR9O1xuXG5cdFx0b3ZlcmxheS5vbmNsaWNrID0gY2xvc2VNZTtcblxuXHRcdM+ALmxpc3RlbihjbG9zZU1lLCAncmVzaXplJyk7XG5cblx0XHRmdW5jdGlvbiBjbG9zZU1lKGUpIHtcblx0XHRcdHZhciB0ID0gZS50YXJnZXQ7XG5cdFx0XHRpZiAodCA9PSBzbGVkIHx8IHQgPT0gdG9wQmFyKSByZXR1cm47XG5cblx0XHRcdGVsLmtpbGxDbGFzcyhcIm9uXCIpO1xuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRlbC5jc3Moe2Rpc3BsYXk6IFwibm9uZVwifSk7XG5cblx0XHRcdFx0Ym9keS5raWxsQ2xhc3MoXCJvdmVybGF5LW9uXCIpO1xuXHRcdFx0fSwgMzAwKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBleHBvc2VNZSgpe1xuXHRcdFx0Ym9keS5hZGRDbGFzcyhcIm92ZXJsYXktb25cIik7IC8vIGluIHRoZSBkZWZhdWx0IGNvbmZpZywga2lsbHMgYm9keSBzY3JvbGxpbmdcblxuXHRcdFx0ZWwuY3NzKHtcblx0XHRcdFx0ZGlzcGxheTogXCJibG9ja1wiLFxuXHRcdFx0XHR6SW5kZXg6IM+ALmhpZ2hlc3RaKClcblx0XHRcdH0pO1xuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRlbC5hZGRDbGFzcyhcIm9uXCIpO1xuXHRcdFx0fSwgMTApO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHRleHBvc2U6IGV4cG9zZU1lXG5cdFx0fTtcblx0fVxuXG5cdM+ALm1vZHMucHVzaChpbml0KTtcblxuXHRyZXR1cm4ge1xuXHRcdHNob3c6IHNob3dcblx0fTtcbn0pKCk7XG4iLCJ2YXIga3ViID0gKGZ1bmN0aW9uICgpIHtcblx0z4AubGlzdGVuKGluaXQpO1xuXG5cdHZhciBIRUFERVJfSEVJR0hUO1xuXHR2YXIgaHRtbCwgYm9keSwgbWFpbk5hdiwgaGVhZGxpbmVzLCBxdWlja3N0YXJ0QnV0dG9uLCB3aXNoRmllbGQ7XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHTPgC5jbGVhbihpbml0KTtcblxuXHRcdGh0bWwgPSDPgDEoJ2h0bWwnKTtcblx0XHRib2R5ID0gz4AxKCdib2R5Jyk7XG5cdFx0bWFpbk5hdiA9IM+AZChcIm1haW5OYXZcIik7XG5cdFx0aGVhZGxpbmVzID0gz4BkKCdoZWFkbGluZVdyYXBwZXInKTtcblx0XHR3aXNoRmllbGQgPSDPgGQoJ3dpc2hGaWVsZCcpO1xuXHRcdEhFQURFUl9IRUlHSFQgPSDPgDEoJ2hlYWRlcicpLm9mZnNldCgpLmhlaWdodDtcblxuXHRcdHF1aWNrc3RhcnRCdXR0b24gPSDPgGQoJ3F1aWNrc3RhcnRCdXR0b24nKTtcblxuXHRcdGJ1aWxkSW5saW5lVE9DKCk7XG5cblx0XHRzZXRZQUgoKTtcblxuXG5cdFx0YWRqdXN0RXZlcnl0aGluZygpO1xuXG5cdFx0z4AubGlzdGVuKGFkanVzdEV2ZXJ5dGhpbmcsICdyZXNpemUnKTtcblx0XHTPgC5saXN0ZW4oYWRqdXN0RXZlcnl0aGluZywgJ3Njcm9sbCcpO1xuXHRcdM+ALmxpc3RlbihoYW5kbGVLZXlzdHJva2VzLCAna2V5ZG93bicpO1xuXHRcdHdpc2hGaWVsZC5saXN0ZW4oaGFuZGxlS2V5c3Ryb2tlcywgJ2tleWRvd24nKTtcblxuXHRcdGRvY3VtZW50Lm9udW5sb2FkID0gZnVuY3Rpb24oKXtcblx0XHRcdM+ALmNsZWFuKGFkanVzdEV2ZXJ5dGhpbmcsICdyZXNpemUnKTtcblx0XHRcdM+ALmNsZWFuKGFkanVzdEV2ZXJ5dGhpbmcsICdzY3JvbGwnKTtcblx0XHRcdM+ALmNsZWFuKGhhbmRsZUtleXN0cm9rZXMsICdrZXlkb3duJyk7XG5cdFx0XHR3aXNoRmllbGQuY2xlYW4oaGFuZGxlS2V5c3Ryb2tlcywgJ2tleWRvd24nKTtcblx0XHR9O1xuXG5cdFx0z4AubGlzdGVuKGNsb3NlT3Blbk1lbnUsICdyZXNpemUnKTtcblxuXHRcdGZ1bmN0aW9uIGNsb3NlT3Blbk1lbnUoKSB7XG5cdFx0XHRpZiAoaHRtbC5oYXNDbGFzcygnb3Blbi1uYXYnKSkgdG9nZ2xlTWVudSgpO1xuXHRcdH1cblxuXHRcdM+AKCcuZHJvcGRvd24nKS5mb3JFYWNoKGZ1bmN0aW9uKGRyb3Bkb3duKSB7XG5cdFx0XHR2YXIgcmVhZG91dCA9IGRyb3Bkb3duLs+AMSgnLnJlYWRvdXQnKTtcblx0XHRcdHJlYWRvdXQuaW5uZXJIVE1MID0gZHJvcGRvd24uz4AxKCdhJykuaW5uZXJIVE1MO1xuXHRcdFx0cmVhZG91dC5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRkcm9wZG93bi50b2dnbGVDbGFzcygnb24nKTtcblx0XHRcdFx0z4AubGlzdGVuKGNsb3NlT3BlbkRyb3Bkb3duLCAnY2xpY2snKTtcblxuXHRcdFx0XHRmdW5jdGlvbiBjbG9zZU9wZW5Ecm9wZG93bihlKSB7XG5cdFx0XHRcdFx0aWYgKGRyb3Bkb3duLmhhc0NsYXNzKCdvbicpICYmICEoZHJvcGRvd25XYXNDbGlja2VkKGUpKSkge1xuXHRcdFx0XHRcdFx0z4AuY2xlYW4oY2xvc2VPcGVuRHJvcGRvd24sICdjbGljaycpO1xuXHRcdFx0XHRcdFx0ZHJvcGRvd24ua2lsbENsYXNzKCdvbicpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZ1bmN0aW9uIGRyb3Bkb3duV2FzQ2xpY2tlZChlKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGUudGFyZ2V0LmlzSGVpck9mQ2xhc3MoJ2Ryb3Bkb3duJyk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fSk7XG5cblx0XHRzZXRJbnRlcnZhbChzZXRGb290ZXJUeXBlLCAxMCk7XG5cdH1cblxuXHR2YXIgdG9jQ291bnQgPSAwO1xuXG5cdGZ1bmN0aW9uIGJ1aWxkSW5saW5lVE9DKCkge1xuXHRcdGlmIChsb2NhdGlvbi5zZWFyY2ggPT09ICc/dGVzdCcpe1xuXHRcdFx0dmFyIGRvY3NDb250ZW50ID0gz4BkKCdkb2NzQ29udGVudCcpO1xuXHRcdFx0dmFyIHBhZ2VUT0MgPSDPgGQoJ3BhZ2VUT0MnKTtcblxuXHRcdFx0aWYgKHBhZ2VUT0MpIHtcblx0XHRcdFx0dmFyIGhlYWRlcnMgPSBkb2NzQ29udGVudC5raWRzKCdoMSwgaDIsIGgzLCBoNCwgaDUnKTtcblx0XHRcdFx0dmFyIHRvYyA9IM+ALnVsKCk7XG5cdFx0XHRcdHBhZ2VUT0MuYWRkKHRvYyk7XG5cblx0XHRcdFx0aGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uIChoZWFkZXIpIHtcblx0XHRcdFx0XHRoZWFkZXIuY3NzKHtwYWRkaW5nVG9wOiBweChIRUFERVJfSEVJR0hUKX0pO1xuXG5cdFx0XHRcdFx0dmFyIGFuY2hvck5hbWUgPSAncGFnZVRPQycgKyB0b2NDb3VudCsrO1xuXG5cdFx0XHRcdFx0dmFyIGxpbmsgPSDPgC5jb250ZW50RWxlbWVudCgnYScsIDAsIDAsIGhlYWRlci5pbm5lckhUTUwpO1xuXHRcdFx0XHRcdGxpbmsuaHJlZiA9ICcjJyArIGFuY2hvck5hbWU7XG5cblx0XHRcdFx0XHR2YXIgYW5jaG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuXHRcdFx0XHRcdGFuY2hvci5uYW1lID0gYW5jaG9yTmFtZTtcblx0XHRcdFx0XHRkb2NzQ29udGVudC5pbnNlcnRCZWZvcmUoYW5jaG9yLCBoZWFkZXIpO1xuXG5cdFx0XHRcdFx0dG9jLmFkZCjPgC5saSgwLCAwLCDPgC5jb250ZW50RWxlbWVudCgnYScsIDAsIDAsIGxpbmspKSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHNldFlBSCgpIHtcblx0XHR2YXIgcGF0aG5hbWUgPSBsb2NhdGlvbi5wYXRobmFtZTtcblx0XHR2YXIgY3VycmVudExpbmsgPSBudWxsO1xuXG5cdFx0z4BkKCdkb2NzVG9jJykuz4AoJ2EnKS5mb3JFYWNoKGZ1bmN0aW9uIChsaW5rKSB7XG5cdFx0XHRpZiAocGF0aG5hbWUuaW5kZXhPZihsaW5rLmhyZWYpICE9PSAtMSkge1xuXHRcdFx0XHRjdXJyZW50TGluayA9IGxpbms7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRpZiAoY3VycmVudExpbmspIGh0bWwuZGF0YXNldC5jdXJyZW50TGluayA9IGN1cnJlbnRMaW5rLmhyZWY7XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRGb290ZXJUeXBlKCkge1xuXHRcdGlmIChodG1sLmlkID09IFwiZG9jc1wiKSB7XG5cdFx0XHR2YXIgYm9keUhlaWdodCA9IM+AZCgnaGVybycpLm9mZnNldCgpLmhlaWdodCArIM+AZCgnZW5jeWNsb3BlZGlhJykub2Zmc2V0KCkuaGVpZ2h0O1xuXHRcdFx0dmFyIGZvb3RlciA9IM+AMSgnZm9vdGVyJyk7XG5cdFx0XHR2YXIgZm9vdGVySGVpZ2h0ID0gZm9vdGVyLm9mZnNldCgpLmhlaWdodDtcblx0XHRcdGJvZHkuY2xhc3NPbkNvbmRpdGlvbignZml4ZWQnLCB3aW5kb3cuaW5uZXJIZWlnaHQgLSBmb290ZXJIZWlnaHQgPiBib2R5SGVpZ2h0KTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBhZGp1c3RFdmVyeXRoaW5nKCkge1xuXHRcdGlmICghaHRtbC5oYXNDbGFzcygnb3Blbi1uYXYnKSkgSEVBREVSX0hFSUdIVCA9IM+AMSgnaGVhZGVyJykub2Zmc2V0KCkuaGVpZ2h0O1xuXG5cdFx0dmFyIFkgPSB3aW5kb3cucGFnZVlPZmZzZXQ7XG5cdFx0dmFyIG9mZnNldCA9IFkgLyAzO1xuXG5cdFx0aHRtbC5jbGFzc09uQ29uZGl0aW9uKCdmbGlwLW5hdicsIFkgPiAwKTtcblx0XHQvL2JvZHkuY3NzKHtiYWNrZ3JvdW5kUG9zaXRpb246ICcwICcgKyBweChvZmZzZXQpfSk7XG5cblx0XHRpZiAoaGVhZGxpbmVzKSB7XG5cdFx0XHR2YXIgaGVhZGxpbmVzQm90dG9tID0gaGVhZGxpbmVzLm9mZnNldCgpLnRvcCArIGhlYWRsaW5lcy5vZmZzZXQoKS5oZWlnaHQgLSBIRUFERVJfSEVJR0hUICsgWSAtIDMwOyAvLyAzMHB4IHJldmVhbCBhdCBib3R0b21cblx0XHRcdHZhciBxdWlja3N0YXJ0Qm90dG9tID0gaGVhZGxpbmVzQm90dG9tICsgcXVpY2tzdGFydEJ1dHRvbi5vZmZzZXQoKS5oZWlnaHQ7XG5cblx0XHRcdGhlYWRsaW5lcy5jc3Moe29wYWNpdHk6IFkgPT09IDAgPyAxIDogKFkgPiBoZWFkbGluZXNCb3R0b20gPyAwIDogMSAtIChZIC8gaGVhZGxpbmVzQm90dG9tKSl9KTtcblxuXHRcdFx0cXVpY2tzdGFydEJ1dHRvbi5jc3Moe29wYWNpdHk6IFkgPCBoZWFkbGluZXNCb3R0b20gPyAxIDogKFkgPiBxdWlja3N0YXJ0Qm90dG9tID8gMCA6IDEgLSAoKFkgLSBoZWFkbGluZXNCb3R0b20pIC8gKHF1aWNrc3RhcnRCb3R0b20gLSBoZWFkbGluZXNCb3R0b20pKSl9KTtcblxuXHRcdFx0aHRtbC5jbGFzc09uQ29uZGl0aW9uKCd5LWVub3VnaCcsIFkgPiBxdWlja3N0YXJ0Qm90dG9tKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiB0b2dnbGVNZW51KCkge1xuXHRcdGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IDgwMCkge1xuXHRcdFx0z4AucHVzaG1lbnUuc2hvdygncHJpbWFyeScpO1xuXHRcdH1cblxuXHRcdGVsc2Uge1xuXHRcdFx0dmFyIG5ld0hlaWdodCA9IEhFQURFUl9IRUlHSFQ7XG5cblx0XHRcdGlmICghaHRtbC5oYXNDbGFzcygnb3Blbi1uYXYnKSkge1xuXHRcdFx0XHRuZXdIZWlnaHQgPSBtYWluTmF2Lm9mZnNldCgpLmhlaWdodDtcblx0XHRcdH1cblxuXHRcdFx0z4AoJ2hlYWRlcicpLmNzcyh7aGVpZ2h0OiBweChuZXdIZWlnaHQpfSk7XG5cdFx0fVxuXG5cdFx0aHRtbC50b2dnbGVDbGFzcygnb3Blbi1uYXYnKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHN1Ym1pdFdpc2godGV4dGZpZWxkKSB7XG5cdFx0YWxlcnQoJ1lvdSB0eXBlZDogJyArIHRleHRmaWVsZC52YWx1ZSk7XG5cdFx0dGV4dGZpZWxkLnZhbHVlID0gJyc7XG5cdFx0dGV4dGZpZWxkLmJsdXIoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGhhbmRsZUtleXN0cm9rZXMoZSkge1xuXHRcdHN3aXRjaCAoZS53aGljaCkge1xuXHRcdFx0Y2FzZSAxMzoge1xuXHRcdFx0XHRpZiAoZS5jdXJyZW50VGFyZ2V0ID09PSB3aXNoRmllbGQpIHtcblx0XHRcdFx0XHRzdWJtaXRXaXNoKHdpc2hGaWVsZCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdGNhc2UgMjc6IHtcblx0XHRcdFx0aWYgKGh0bWwuaGFzQ2xhc3MoJ29wZW4tbmF2JykpIHtcblx0XHRcdFx0XHR0b2dnbGVNZW51KCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gc2hvd1ZpZGVvKCkge1xuXHRcdHZhciB2aWRlb0lmcmFtZSA9IM+AZChcInZpZGVvUGxheWVyXCIpLs+AMShcImlmcmFtZVwiKTtcblx0XHR2aWRlb0lmcmFtZS5zcmMgPSB2aWRlb0lmcmFtZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXVybFwiKTtcblx0XHTPgC5tb2RhbE92ZXJsYXkuc2hvdyhcInZpZGVvUGxheWVyXCIpO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHR0b2dnbGVNZW51OiB0b2dnbGVNZW51LFxuXHRcdHNob3dWaWRlbzogc2hvd1ZpZGVvXG5cdH07XG59KSgpO1xuXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
