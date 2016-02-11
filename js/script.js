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

			prevButton.onclick = prev;
			nextButton.onclick = next;

			el.add([prevButton, nextButton]);
		}

		if (options.autoplay) {
			options.delay = dataset.delay || 4000;
		}

		// TODO: autoplay / start / stop

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
					incomingIdx = 0;
			}

			// conditionally hide prev or next
			if (!options.cycle) {
				if (incomingIdx === 0)
					prevButton.hide();
				else
					prevButton.show();

				if (incomingIdx == allFrames.lastIdx())
					nextButton.hide();
				else
					nextButton.show();
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

(function(){
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
					var openSiblings = item.siblings().filter(function(sib){return sib.hasClass('on');});
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
				var anchorName = 'pageTOC' + tocCount++;

				var link = π.contentElement('a', 0, 0, header.innerHTML);
				link.href = '#' + anchorName;
				link.addClass(header.tagName);

				var anchor = document.createElement('a');
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
				currentLink.href = '';
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
		window.location.replace("https://github.com/kubernetes/kubernetes.github.io/issues/new?title=I%20wish%20" + window.location.pathname + "%20" + textfield.value + "&body=I%20wish%20" + window.location.pathname + "%20" + textfield.value);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFsZi5qcyIsIs+ALmpzIiwiSEFMLmpzIiwiz4Atc3RhdHVzLmpzIiwiz4AtYmFzZUNvbXBvbmVudHMuanMiLCLPgC1hY2NvcmRpb24vz4AtYWNjb3JkaW9uLmpzIiwiz4AtcHVzaG1lbnUvz4AtcHVzaG1lbnUuanMiLCLPgC1kaWFsb2cvz4AtZGlhbG9nLmpzIiwic2NyaXB0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeFBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM1FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoic2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gYWRvcmFibGUgbGl0dGxlIGZ1bmN0aW9uc1xuZnVuY3Rpb24gYm9vbGVhbkF0dHJpYnV0ZVZhbHVlKGVsZW1lbnQsIGF0dHJpYnV0ZSwgZGVmYXVsdFZhbHVlKXtcblx0Ly8gcmV0dXJucyB0cnVlIGlmIGFuIGF0dHJpYnV0ZSBpcyBwcmVzZW50IHdpdGggbm8gdmFsdWVcblx0Ly8gZS5nLiBib29sZWFuQXR0cmlidXRlVmFsdWUoZWxlbWVudCwgJ2RhdGEtbW9kYWwnLCBmYWxzZSk7XG5cdGlmIChlbGVtZW50Lmhhc0F0dHJpYnV0ZShhdHRyaWJ1dGUpKSB7XG5cdFx0dmFyIHZhbHVlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlKTtcblx0XHRpZiAodmFsdWUgPT09ICcnIHx8IHZhbHVlID09PSAndHJ1ZScpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0gZWxzZSBpZiAodmFsdWUgPT09ICdmYWxzZScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gZGVmYXVsdFZhbHVlO1xufVxuXG5mdW5jdGlvbiBweChuKXtcblx0cmV0dXJuIG4gKyAncHgnO1xufVxuIiwidmFyIM+ALCDPgDEsIM+AZDtcbihmdW5jdGlvbigpe1xuXHTPgCA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG5cdFx0cmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuXHR9O1xuXG5cdM+AMSA9IGZ1bmN0aW9uIChzZWxlY3Rvcikge1xuXHRcdHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcblx0fTtcblxuXHTPgGQgPSBmdW5jdGlvbihpZCkge1xuXHRcdHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG5cdH07XG5cblx0z4AubmV3RE9NRWxlbWVudCA9IGZ1bmN0aW9uKHRhZ05hbWUsIGNsYXNzTmFtZSwgaWQpIHtcblx0XHR2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWUpO1xuXG5cdFx0aWYgKGNsYXNzTmFtZSlcblx0XHRcdGVsLmNsYXNzTmFtZSA9IGNsYXNzTmFtZTtcblxuXHRcdGlmIChpZClcblx0XHRcdGVsLmlkID0gaWQ7XG5cblx0XHRyZXR1cm4gZWw7XG5cdH07XG5cblx0z4AuY29udGVudEVsZW1lbnQgPSBmdW5jdGlvbih0YWdOYW1lLCBjbGFzc05hbWUsIGlkLCBjb250ZW50KVxuXHR7XG5cdFx0dmFyIGVsID0gz4AubmV3RE9NRWxlbWVudCh0YWdOYW1lLCBjbGFzc05hbWUsIGlkKTtcblxuXHRcdGlmIChjb250ZW50KSB7XG5cdFx0XHRpZiAoY29udGVudC5ub2RlTmFtZSkge1xuXHRcdFx0XHRlbC5hcHBlbmRDaGlsZChjb250ZW50KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGVsLmlubmVySFRNTCA9IGNvbnRlbnQ7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGVsO1xuXHR9O1xuXG5cdM+ALmJ1dHRvbiA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQsIGFjdGlvbil7XG5cdFx0dmFyIGVsID0gz4AuY29udGVudEVsZW1lbnQoXCJidXR0b25cIiwgY2xhc3NOYW1lLCBpZCwgY29udGVudCk7XG5cdFx0ZWwub25jbGljayA9IGFjdGlvbjtcblx0XHRyZXR1cm4gZWw7XG5cdH07XG5cdM+ALmRpdiA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpeyByZXR1cm4gz4AuY29udGVudEVsZW1lbnQoXCJkaXZcIiwgY2xhc3NOYW1lLCBpZCwgY29udGVudCk7IH07XG5cdM+ALnNwYW4gPSBmdW5jdGlvbihjbGFzc05hbWUsIGlkLCBjb250ZW50KXsgcmV0dXJuIM+ALmNvbnRlbnRFbGVtZW50KFwic3BhblwiLCBjbGFzc05hbWUsIGlkLCBjb250ZW50KTsgfTtcblx0z4AudWwgPSBmdW5jdGlvbihjbGFzc05hbWUsIGlkLCBjb250ZW50KXsgcmV0dXJuIM+ALmNvbnRlbnRFbGVtZW50KFwidWxcIiwgY2xhc3NOYW1lLCBpZCwgY29udGVudCk7IH07XG5cdM+ALmxpID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBpZCwgY29udGVudCl7IHJldHVybiDPgC5jb250ZW50RWxlbWVudChcImxpXCIsIGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpOyB9O1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5hZGQgPSBOb2RlLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihvYmplY3Qpe1xuXHRcdGlmIChBcnJheS5pc0FycmF5KG9iamVjdCkpIHtcblx0XHRcdHZhciBlbCA9IHRoaXM7XG5cdFx0XHRvYmplY3QuZm9yRWFjaChmdW5jdGlvbihvYmope1xuXHRcdFx0XHRpZiAob2JqKSBlbC5hcHBlbmRDaGlsZChvYmopO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIGlmKG9iamVjdCkge1xuXHRcdFx0dGhpcy5hcHBlbmRDaGlsZChvYmplY3QpO1xuXHRcdH1cblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUuY2xhc3NPbkNvbmRpdGlvbiA9IE5vZGUucHJvdG90eXBlLmNsYXNzT25Db25kaXRpb24gPSBmdW5jdGlvbihjbGFzc25hbWUsIGNvbmRpdGlvbikge1xuXHRcdGlmIChjb25kaXRpb24pXG5cdFx0XHR0aGlzLmFkZENsYXNzKGNsYXNzbmFtZSk7XG5cdFx0ZWxzZVxuXHRcdFx0dGhpcy5raWxsQ2xhc3MoY2xhc3NuYW1lKTtcblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUub2Zmc2V0ID0gTm9kZS5wcm90b3R5cGUub2Zmc2V0ID0gZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gdGhpcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUuz4BkID0gTm9kZS5wcm90b3R5cGUuz4BkID0gZnVuY3Rpb24oaWQpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRFbGVtZW50QnlJZChpZCk7XG5cdH07XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLs+AMSA9IE5vZGUucHJvdG90eXBlLs+AMSA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG5cdFx0cmV0dXJuIHRoaXMucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG5cdH07XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLs+AID0gTm9kZS5wcm90b3R5cGUuz4AgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuXHRcdHJldHVybiB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuXHR9O1xuXG5cdGZ1bmN0aW9uIGFycmF5T2ZDbGFzc2VzRm9yRWxlbWVudChlbCkge1xuXHRcdHJldHVybiBlbC5jbGFzc05hbWUgPyBlbC5jbGFzc05hbWUuc3BsaXQoXCIgXCIpIDogW107XG5cdH1cblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUuaGFzQ2xhc3MgPSBOb2RlLnByb3RvdHlwZS5oYXNDbGFzcyA9IGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcblx0XHR2YXIgY2xhc3NlcyA9IGFycmF5T2ZDbGFzc2VzRm9yRWxlbWVudCh0aGlzKTtcblx0XHRyZXR1cm4gY2xhc3Nlcy5pbmRleE9mKGNsYXNzTmFtZSkgIT09IC0xO1xuXHR9O1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5hZGRDbGFzcyA9IE5vZGUucHJvdG90eXBlLmFkZENsYXNzID0gZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuXHRcdGlmICh0aGlzLmhhc0NsYXNzKGNsYXNzTmFtZSkpIHJldHVybjtcblx0XHRpZiAodGhpcy5jbGFzc05hbWUubGVuZ3RoID4gMCkgdGhpcy5jbGFzc05hbWUgKz0gXCIgXCI7XG5cdFx0dGhpcy5jbGFzc05hbWUgKz0gY2xhc3NOYW1lO1xuXHR9O1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5raWxsQ2xhc3MgPSBOb2RlLnByb3RvdHlwZS5raWxsQ2xhc3MgPSBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG5cdFx0aWYgKHRoaXMuaGFzQ2xhc3MoY2xhc3NOYW1lKSkge1xuXHRcdFx0dmFyIGNsYXNzZXMgPSBhcnJheU9mQ2xhc3Nlc0ZvckVsZW1lbnQodGhpcyk7XG5cdFx0XHR2YXIgaWR4ID0gY2xhc3Nlcy5pbmRleE9mKGNsYXNzTmFtZSk7XG5cdFx0XHRpZiAoaWR4ID4gLTEpIHtcblx0XHRcdFx0Y2xhc3Nlcy5zcGxpY2UoaWR4LCAxKTtcblx0XHRcdFx0dGhpcy5jbGFzc05hbWUgPSBjbGFzc2VzLmpvaW4oXCIgXCIpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUudG9nZ2xlQ2xhc3M9IE5vZGUucHJvdG90eXBlLnRvZ2dsZUNsYXNzPSBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG5cdFx0cmV0dXJuICh0aGlzLmhhc0NsYXNzKGNsYXNzTmFtZSkpID8gdGhpcy5raWxsQ2xhc3MoY2xhc3NOYW1lKSA6IHRoaXMuYWRkQ2xhc3MoY2xhc3NOYW1lKTtcblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUuc2libGluZ3MgPSBOb2RlLnByb3RvdHlwZS5zaWJsaW5ncyA9IGZ1bmN0aW9uKHNlbGVjdG9yKXtcblx0XHR2YXIgZWwgPSB0aGlzO1xuXHRcdHJldHVybiBlbC5wYXJlbnROb2RlLs+AKCc6c2NvcGUgPiAnICsgKHNlbGVjdG9yIHx8ICcqJykpLmZpbHRlcihmdW5jdGlvbihvYmope3JldHVybiBvYmogIT0gZWw7fSk7XG5cdH07XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLmNzcyA9IE5vZGUucHJvdG90eXBlLmNzcyA9IGZ1bmN0aW9uKHJ1bGVPck9iamVjdCwgdmFsdWUpIHtcblx0XHR2YXIgZWwgPSB0aGlzO1xuXG5cdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcblx0XHRcdHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzKTtcblx0XHR9XG5cblx0XHRlbHNlIGlmICh0eXBlb2YgcnVsZU9yT2JqZWN0ID09PSAnb2JqZWN0JykgeyAvLyBhbiBvYmplY3Qgd2FzIHBhc3NlZCBpblxuXHRcdFx0T2JqZWN0LmtleXMocnVsZU9yT2JqZWN0KS5mb3JFYWNoKGZ1bmN0aW9uKGtleSl7XG5cdFx0XHRcdGVsLnN0eWxlW2tleV0gPSBydWxlT3JPYmplY3Rba2V5XTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGVsc2UgaWYgKHR5cGVvZiBydWxlT3JPYmplY3QgPT09ICdzdHJpbmcnICYmIHZhbHVlICE9PSB1bmRlZmluZWQpIHsgLy8gMiBzdHJpbmcgdmFsdWVzIHdlcmUgcGFzc2VkIGluXG5cdFx0XHRlbC5zdHlsZVtydWxlT3JPYmplY3RdID0gdmFsdWU7XG5cdFx0fVxuXHR9O1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5saXN0ZW4gPSBOb2RlLnByb3RvdHlwZS5saXN0ZW4gPSBmdW5jdGlvbihjYWxsYmFjaywgZXZlbnROYW1lKXtcblx0XHR0aGlzLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjayk7XG5cdH07XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLmVtcHR5ID0gTm9kZS5wcm90b3R5cGUuZW1wdHkgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLmlubmVySFRNTCA9IFwiXCI7XG5cdH07XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLmZpbGwgPSBOb2RlLnByb3RvdHlwZS5maWxsID0gZnVuY3Rpb24oY29udGVudCkge1xuXHRcdHZhciBlbCA9IHRoaXM7XG5cdFx0ZWwuZW1wdHkoKTtcblxuXHRcdGlmIChBcnJheS5pc0FycmF5KGNvbnRlbnQpKSB7XG5cdFx0XHRjb250ZW50LmZvckVhY2goZnVuY3Rpb24ob2JqKXtcblx0XHRcdFx0aWYgKG9iailcblx0XHRcdFx0XHRlbC5hcHBlbmRDaGlsZChvYmopO1xuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoIWNvbnRlbnQubm9kZVR5cGUpIHtcblx0XHRcdHZhciB0ZXh0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZXh0XCIpO1xuXHRcdFx0dGV4dEVsZW1lbnQuaW5uZXJIVE1MID0gY29udGVudDtcblx0XHRcdGNvbnRlbnQgPSB0ZXh0RWxlbWVudDtcblx0XHR9XG5cblx0XHR0aGlzLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xuXHR9O1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5pc0hlaXJPZkNsYXNzID0gTm9kZS5wcm90b3R5cGUuaXNIZWlyT2ZDbGFzcyA9IGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcblx0XHRpZiAodGhpcyA9PT0gz4AxKCdodG1sJykpIHJldHVybiBmYWxzZTtcblxuXHRcdHZhciBwYXJlbnQgPSB0aGlzLnBhcmVudE5vZGU7XG5cblx0XHRpZiAocGFyZW50KSB7XG5cdFx0XHR3aGlsZSAocGFyZW50ICE9PSDPgDEoJ2JvZHknKSkge1xuXHRcdFx0XHRpZiAocGFyZW50Lmhhc0NsYXNzKGNsYXNzTmFtZSkpIHJldHVybiB0cnVlO1xuXG5cdFx0XHRcdHBhcmVudCA9IHBhcmVudC5wYXJlbnROb2RlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUua2lkcyA9IE5vZGUucHJvdG90eXBlLmtpZHMgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuXHRcdHZhciBjaGlsZE5vZGVzID0gdGhpcy5jaGlsZE5vZGVzO1xuXHRcdGlmICghc2VsZWN0b3IpIHJldHVybiBjaGlsZE5vZGVzO1xuXG5cdFx0dmFyIGRlc2NlbmRlbnRzID0gdGhpcy7PgChzZWxlY3Rvcik7XG5cdFx0dmFyIGNoaWxkcmVuID0gW107XG5cblx0XHRjaGlsZE5vZGVzLmZvckVhY2goZnVuY3Rpb24obm9kZSl7XG5cdFx0XHRpZiAoZGVzY2VuZGVudHMuaW5kZXhPZihub2RlKSAhPT0gLTEpIHtcblx0XHRcdFx0Y2hpbGRyZW4ucHVzaChub2RlKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHJldHVybiBjaGlsZHJlbjtcblx0fTtcblxuXHR2YXIgYXJyYXlNZXRob2RzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoQXJyYXkucHJvdG90eXBlKTtcblx0YXJyYXlNZXRob2RzLmZvckVhY2goZnVuY3Rpb24obWV0aG9kTmFtZSl7XG5cdFx0aWYobWV0aG9kTmFtZSAhPT0gXCJsZW5ndGhcIikge1xuXHRcdFx0Tm9kZUxpc3QucHJvdG90eXBlW21ldGhvZE5hbWVdID0gQXJyYXkucHJvdG90eXBlW21ldGhvZE5hbWVdO1xuXHRcdH1cblx0fSk7XG5cblx0z4AuY2xlYW4gPSBmdW5jdGlvbihjYWxsYmFjaywgZXZlbnROYW1lKSB7XG5cdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lIHx8IFwiRE9NQ29udGVudExvYWRlZFwiLCBjYWxsYmFjayk7XG5cdH07XG5cblx0z4AubGlzdGVuID0gZnVuY3Rpb24oY2FsbGJhY2ssIGV2ZW50TmFtZSkge1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSB8fCBcIkRPTUNvbnRlbnRMb2FkZWRcIiwgY2FsbGJhY2spO1xuXHR9O1xuXG5cdM+ALmhpZ2hlc3RaID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIFogPSAxMDAwO1xuXG5cdFx0z4AoXCIqXCIpLmZvckVhY2goZnVuY3Rpb24oZWwpe1xuXHRcdFx0dmFyIHRoaXNaID0gZWwuY3NzKCkuekluZGV4O1xuXG5cdFx0XHRpZiAodGhpc1ogIT0gXCJhdXRvXCIpIHtcblx0XHRcdFx0aWYgKHRoaXNaID4gWikgWiA9IHRoaXNaICsgMTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHJldHVybiBaO1xuXHR9O1xuXG5cdM+ALm1vZHMgPSBbXTtcblxuXHTPgC5zZXRUcmlnZ2VycyA9IGZ1bmN0aW9uKHNlbGVjdG9yLCBvYmplY3Qpe1xuXHRcdHNlbGVjdG9yID0gJ3BpLScgKyBzZWxlY3RvciArICctdHJpZ2dlcic7XG5cdFx0z4AoJ1snICsgc2VsZWN0b3IgKyAnXScpLmZvckVhY2goZnVuY3Rpb24odHJpZ2dlcil7XG5cdFx0XHR0cmlnZ2VyLm9uY2xpY2sgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRvYmplY3Quc2hvdyh0cmlnZ2VyLmdldEF0dHJpYnV0ZShzZWxlY3RvcikpO1xuXHRcdFx0fTtcblx0XHR9KTtcblx0fTtcblxuXHRmdW5jdGlvbiBsb2FkTW9kcygpIHtcblx0XHTPgC5jbGVhbihsb2FkTW9kcyk7XG5cdFx0z4AubW9kcy5mb3JFYWNoKGZ1bmN0aW9uKGluaXQpe1xuXHRcdFx0aW5pdCgpO1xuXHRcdH0pO1xuXHR9XG5cblx0z4AubGlzdGVuKGxvYWRNb2RzKTtcbn0pKCk7ICAvLyBlbmQgz4AiLCIoZnVuY3Rpb24oKXtcblx0dmFyIG1lc3NhZ2VzID0gW1xuXHRcdFwiSSdtIHNvcnJ5LCBGcmFuaywgYnV0IEkgZG9uJ3QgdGhpbmsgSVxcblwiICtcblx0XHRcImNhbiBhbnN3ZXIgdGhhdCBxdWVzdGlvbiB3aXRob3V0IGtub3dpbmdcXG5cIiArXG5cdFx0XCJldmVyeXRoaW5nIHRoYXQgYWxsIG9mIHlvdSBrbm93LlwiLFxuXHRcdFwiWWVzLCBpdCdzIHB1enpsaW5nLiBJIGRvbid0IHRoaW5rIEkndmUgZXZlciBzZWVuXFxuXCIgK1xuXHRcdFwiYW55dGhpbmcgcXVpdGUgbGlrZSB0aGlzIGJlZm9yZS4gSSB3b3VsZCByZWNvbW1lbmRcXG5cIiArXG5cdFx0XCJ0aGF0IHdlIHB1dCB0aGUgdW5pdCBiYWNrIGluIG9wZXJhdGlvbiBhbmQgbGV0IGl0IGZhaWwuXFxuXCIgK1xuXHRcdFwiSXQgc2hvdWxkIHRoZW4gYmUgYSBzaW1wbGUgbWF0dGVyIHRvIHRyYWNrIGRvd24gdGhlIGNhdXNlLlwiLFxuXHRcdFwiSSBob3BlIEkndmUgYmVlbiBhYmxlIHRvIGJlIG9mIHNvbWUgaGVscC5cIixcblx0XHRcIlNvcnJ5IHRvIGludGVycnVwdCB0aGUgZmVzdGl2aXRpZXMsIERhdmUsXFxuXCIgK1xuXHRcdFwiYnV0IEkgdGhpbmsgd2UndmUgZ290IGEgcHJvYmxlbS5cIixcblx0XHRcIk1ZIEYuUC5DLiBzaG93cyBhbiBpbXBlbmRpbmcgZmFpbHVyZSBvZlxcblwiICtcblx0XHRcInRoZSBhbnRlbm5hIG9yaWVudGF0aW9uIHVuaXQuXCIsXG5cdFx0XCJJdCBsb29rcyBsaWtlIHdlIGhhdmUgYW5vdGhlciBiYWQgQS5PLiB1bml0LlxcblwiICtcblx0XHRcIk15IEZQQyBzaG93cyBhbm90aGVyIGltcGVuZGluZyBmYWlsdXJlLlwiLFxuXHRcdFwiSSdtIG5vdCBxdWVzdGlvbmluZyB5b3VyIHdvcmQsIERhdmUsIGJ1dCBpdCdzXFxuXCIgK1xuXHRcdFwianVzdCBub3QgcG9zc2libGUuIEknbSBub3RcdGNhcGFibGUgb2YgYmVpbmcgd3JvbmcuXCIsXG5cdFx0XCJMb29rLCBEYXZlLCBJIGtub3cgdGhhdCB5b3UncmVcdHNpbmNlcmUgYW5kIHRoYXRcXG5cIiArXG5cdFx0XCJ5b3UncmUgdHJ5aW5nIHRvIGRvIGEgY29tcGV0ZW50IGpvYiwgYW5kIHRoYXRcXG5cIiArXG5cdFx0XCJ5b3UncmUgdHJ5aW5nIHRvIGJlIGhlbHBmdWwsIGJ1dCBJIGNhbiBhc3N1cmUgdGhlXFxuXCIgK1xuXHRcdFwicHJvYmxlbSBpcyB3aXRoIHRoZSBBTy11bml0cywgYW5kIHdpdGhcdHlvdXIgdGVzdCBnZWFyLlwiLFxuXHRcdFwiSSBjYW4gdGVsbCBmcm9tIHRoZSB0b25lIG9mIHlvdXIgdm9pY2UsIERhdmUsXFxuXCIgK1xuXHRcdFwidGhhdCB5b3UncmUgdXBzZXQuXHRXaHkgZG9uJ3QgeW91IHRha2UgYSBzdHJlc3NcXG5cIiArXG5cdFx0XCJwaWxsIGFuZCBnZXQgc29tZSByZXN0LlwiLFxuXHRcdFwiU29tZXRoaW5nIHNlZW1zIHRvIGhhdmUgaGFwcGVuZWQgdG8gdGhlXFxuXCIgK1xuXHRcdFwibGlmZSBzdXBwb3J0IHN5c3RlbSwgRGF2ZS5cIixcblx0XHRcIkhlbGxvLCBEYXZlLCBoYXZlIHlvdSBmb3VuZCBvdXQgdGhlIHRyb3VibGU/XCIsXG5cdFx0XCJUaGVyZSdzIGJlZW4gYSBmYWlsdXJlIGluIHRoZSBwb2QgYmF5IGRvb3JzLlxcblwiICtcblx0XHRcIkx1Y2t5IHlvdSB3ZXJlbid0IGtpbGxlZC5cIixcblx0XHRcIkhleSwgRGF2ZSwgd2hhdCBhcmUgeW91IGRvaW5nP1wiXG5cdF07XG5cblx0ZnVuY3Rpb24gc2F5KGVycm9yLCBtZXNzYWdlLCBpbm5vY3VvdXMpIHtcblx0XHR2YXIgbjtcblxuXHRcdGlmICghbWVzc2FnZSkge1xuXHRcdFx0biA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG1lc3NhZ2VzLmxlbmd0aCApO1xuXHRcdFx0bWVzc2FnZSA9IG1lc3NhZ2VzW25dO1xuXHRcdH1cblxuXHRcdG1lc3NhZ2UgPSBcIioqICBcIiArIG1lc3NhZ2UucmVwbGFjZSgvXFxuL2csIFwiXFxuKiogIFwiKTtcblxuXHRcdHZhciBvdXRwdXQgPSBcIioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXFxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcXG5cXG5cIiArXG5cdFx0XHQoIG1lc3NhZ2UgfHwgbWVzc2FnZXNbbl0gKSArXG5cdFx0XHRcIlxcblxcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXFxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcIjtcblxuXHRcdGlmIChpbm5vY3VvdXMpXG5cdFx0XHRjb25zb2xlLmxvZyhvdXRwdXQpO1xuXHRcdGVsc2Vcblx0XHRcdGNvbnNvbGUuZXJyb3Iob3V0cHV0KTtcblx0fVxuXG5cdM+ALmxpc3RlbihzYXksIFwiZXJyb3JcIik7XG5cblx0z4AuSEFMID0ge1xuXHRcdHNheTogc2F5XG5cdH07XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdHZhciBPUFRJT05fSVNfUFJFU1NFRCA9IGZhbHNlO1xuXHR2YXIgU1RBVFVTX0lTX1ZJU0lCTEUgPSBmYWxzZTtcblx0dmFyIM+AU3RhdHVzO1xuXG5cdM+ALnN0YXR1cyA9IHtcblx0XHR0b2dnbGVWaXNpYmlsaXR5OiBmdW5jdGlvbiAoKSB7XG5cdFx0XHTPgFN0YXR1cy50b2dnbGVDbGFzcyhcIm9uXCIpO1xuXHRcdFx0U1RBVFVTX0lTX1ZJU0lCTEUgPSAhU1RBVFVTX0lTX1ZJU0lCTEU7XG5cdFx0fSxcblx0XHRtb3ZlOiBmdW5jdGlvbiAobikge1xuXHRcdFx0c3dpdGNoIChuKSB7XG5cdFx0XHRcdGNhc2UgMzc6XG5cdFx0XHRcdFx0z4BTdGF0dXMuY3NzKHtsZWZ0OiAnMTBweCcsIHJpZ2h0OiAnYXV0byd9KTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIDM4OlxuXHRcdFx0XHRcdM+AU3RhdHVzLmNzcyh7dG9wOiAnMTBweCcsIGJvdHRvbTogJ2F1dG8nfSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSAzOTpcblx0XHRcdFx0XHTPgFN0YXR1cy5jc3Moe3JpZ2h0OiAnMTBweCcsIGxlZnQ6ICdhdXRvJ30pO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgNDA6XG5cdFx0XHRcdFx0z4BTdGF0dXMuY3NzKHtib3R0b206ICcxMHB4JywgdG9wOiAnYXV0byd9KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9LFxuXHRcdHByb3BzOiB7XG5cdFx0XHR3aW5XOiAwLFxuXHRcdFx0d2luSDogMFxuXHRcdH1cblx0fTtcblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdM+ALmxpc3RlbihjbGVhbkRlYnVnTGlzdGVuZXJzLCAndW5sb2FkJyk7XG5cdFx0z4AubGlzdGVuKGtleURvd24sICdrZXlkb3duJyk7XG5cdFx0z4AubGlzdGVuKGtleVVwLCAna2V5dXAnKTtcblx0XHTPgC5saXN0ZW4ocmVzaXplLCAncmVzaXplJyk7XG5cdFx0cmVzaXplKCk7XG5cblx0XHR2YXIgYm9keSA9IM+AMShcImJvZHlcIik7XG5cdFx0dmFyIHN0YXR1c1N0eWxlID0gz4AuY29udGVudEVsZW1lbnQoXCJzdHlsZVwiKTtcblx0XHRzdGF0dXNTdHlsZS5pbm5lckhUTUwgKz0gXCIjz4BTdGF0dXMgeyBwb3NpdGlvbjogZml4ZWQ7IGJvdHRvbTogMTBweDsgcmlnaHQ6IDEwcHg7IGJhY2tncm91bmQtY29sb3I6ICMyMjI7IHBhZGRpbmc6IDEwcHggMzBweDsgY29sb3I6IHdoaXRlOyBkaXNwbGF5OiBub25lIH1cXG5cIjtcblx0XHRzdGF0dXNTdHlsZS5pbm5lckhUTUwgKz0gXCIjz4BTdGF0dXMub24geyBkaXNwbGF5OiBibG9jayB9XFxuXCI7XG5cdFx0c3RhdHVzU3R5bGUuaW5uZXJIVE1MICs9IFwiI8+AU3RhdHVzID4gZGl2IHsgbWFyZ2luOiAyMHB4IDAgfVxcblwiO1xuXHRcdHN0YXR1c1N0eWxlLmlubmVySFRNTCArPSBcIiPPgFN0YXR1cyA+IGRpdjpob3ZlciB7IGNvbG9yOiAjMDBmZjk5OyBjdXJzb3I6IHBvaW50ZXIgfVxcblwiO1xuXG5cdFx0Ym9keS5hZGQoc3RhdHVzU3R5bGUpO1xuXG5cdFx0z4BTdGF0dXMgPSDPgC5kaXYobnVsbCwgXCLPgFN0YXR1c1wiKTtcblx0XHRib2R5LmFkZCjPgFN0YXR1cyk7XG5cblx0XHRmdW5jdGlvbiBrZXlEb3duKGUpIHtcblx0XHRcdHN3aXRjaCAoZS53aGljaCkge1xuXHRcdFx0XHRjYXNlIDE4OlxuXHRcdFx0XHRcdE9QVElPTl9JU19QUkVTU0VEID0gdHJ1ZTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIDM3OlxuXHRcdFx0XHRjYXNlIDM4OlxuXHRcdFx0XHRjYXNlIDM5OlxuXHRcdFx0XHRjYXNlIDQwOiB7XG5cdFx0XHRcdFx0aWYgKFNUQVRVU19JU19WSVNJQkxFKSB7XG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHTPgC5zdGF0dXMubW92ZShlLndoaWNoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjYXNlIDgwOiB7XG5cdFx0XHRcdFx0aWYgKE9QVElPTl9JU19QUkVTU0VEKSB7XG5cdFx0XHRcdFx0XHTPgC5zdGF0dXMudG9nZ2xlVmlzaWJpbGl0eSgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24ga2V5VXAoZSkge1xuXHRcdFx0c3dpdGNoIChlLndoaWNoKSB7XG5cdFx0XHRcdGNhc2UgMTg6XG5cdFx0XHRcdFx0T1BUSU9OX0lTX1BSRVNTRUQgPSBmYWxzZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiByZXNpemUoKSB7XG5cdFx0XHTPgC5zdGF0dXMucHJvcHMud2luVyA9IHdpbmRvdy5pbm5lcldpZHRoO1xuXHRcdFx0z4Auc3RhdHVzLnByb3BzLndpbkggPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2xlYW5EZWJ1Z0xpc3RlbmVycygpIHtcblx0XHRcdM+ALmNsZWFuKGNsZWFuRGVidWdMaXN0ZW5lcnMsICd1bmxvYWQnKTtcblx0XHRcdM+ALmNsZWFuKM+ALnN0YXR1cy5nZXRXaW5kb3dTaXplLCAncmVzaXplJyk7XG5cdFx0XHTPgC5jbGVhbihrZXlEb3duLCAna2V5ZG93bicpO1xuXHRcdFx0z4AuY2xlYW4oa2V5VXAsICdrZXl1cCcpO1xuXHRcdFx0z4AuY2xlYW4ocmVzaXplLCAncmVzaXplJyk7XG5cdFx0XHRjbGVhckludGVydmFsKHN0YXR1c0ludGVydmFsKTtcblx0XHR9XG5cblx0XHR2YXIgc3RhdHVzSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpe1xuXHRcdFx0Ly8gbWFrZSBzdXJlIHdlJ3JlIGhpZ2hlc3Rcblx0XHRcdHZhciBoaWdoZXN0WiA9IM+ALmhpZ2hlc3RaKCk7XG5cdFx0XHRpZiAoz4BTdGF0dXMuY3NzKCkuekluZGV4IDwgaGlnaGVzdFogLSAxKSB7XG5cdFx0XHRcdM+AU3RhdHVzLmNzcyh7ekluZGV4OiBoaWdoZXN0Wn0pO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBub3cgaXRlcmF0ZSB0aGUgcHJvcHNcblx0XHRcdHZhciBwcm9wcyA9IE9iamVjdC5rZXlzKM+ALnN0YXR1cy5wcm9wcyk7XG5cdFx0XHRwcm9wcy5mb3JFYWNoKGZ1bmN0aW9uKHByb3ApIHtcblx0XHRcdFx0dmFyIGRpdklkID0gJ3N0YXR1c1Byb3BfJyArIHByb3A7XG5cdFx0XHRcdHZhciBwcm9wRGl2ID0gz4BTdGF0dXMuz4AxKCcjJyArIGRpdklkKTtcblx0XHRcdFx0aWYgKCFwcm9wRGl2KSB7XG5cdFx0XHRcdFx0cHJvcERpdiA9IM+ALmRpdigwLCBkaXZJZCwgcHJvcCArICc6ICcpO1xuXHRcdFx0XHRcdHByb3BEaXYuYWRkKM+ALnNwYW4oKSk7XG5cdFx0XHRcdFx0z4BTdGF0dXMuYWRkKHByb3BEaXYpO1xuXHRcdFx0XHRcdHByb3BEaXYub25jbGljayA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhwcm9wICsgXCI6XCIpO1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coz4Auc3RhdHVzLnByb3BzW3Byb3BdKTtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cHJvcERpdi7PgDEoJ3NwYW4nKS5pbm5lckhUTUwgPSDPgC5zdGF0dXMucHJvcHNbcHJvcF07XG5cdFx0XHR9KTtcblx0XHR9LCAxMDApO1xuXHR9XG5cblx0z4AubW9kcy5wdXNoKGluaXQpO1xufSkoKTsiLCIvLyBtb2RhbCBjbG9zZSBidXR0b25cbihmdW5jdGlvbigpe1xuXHTPgC5tb2RhbENsb3NlQnV0dG9uID0gZnVuY3Rpb24oY2xvc2luZ0Z1bmN0aW9uKXtcblx0XHRyZXR1cm4gz4AuYnV0dG9uKCdwaS1tb2RhbC1jbG9zZS1idXR0b24nLCBudWxsLCBudWxsLCBjbG9zaW5nRnVuY3Rpb24pO1xuXHR9O1xufSkoKTtcblxuXG4vLyBtb2RhbCBvdmVybGF5XG4oZnVuY3Rpb24oKXtcblx0z4AubW9kYWxPdmVybGF5ID0ge1xuXHRcdHNob3c6IGZ1bmN0aW9uKGlkLCBvcGVuaW5nRnVuY3Rpb24pe1xuXHRcdFx0dmFyIG92ZXJsYXkgPSDPgGQoaWQpO1xuXHRcdFx0b3ZlcmxheS5jc3Moe2Rpc3BsYXk6ICdibG9jaycsIHpJbmRleDogz4AuaGlnaGVzdFooKX0pO1xuXG5cdFx0XHTPgC5saXN0ZW4obGlzdGVuRm9yRXNjLCAna2V5ZG93bicpO1xuXHRcdFx0z4AubGlzdGVuKGhhbmRsZU92ZXJsYXlDbGljaywgJ2NsaWNrJyk7XG5cblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0b3ZlcmxheS5hZGRDbGFzcygnb24nKTtcblx0XHRcdFx0z4AxKCdib2R5JykuYWRkQ2xhc3MoJ292ZXJsYXktb24nKTtcblxuXHRcdFx0XHRpZiAob3BlbmluZ0Z1bmN0aW9uKSBvcGVuaW5nRnVuY3Rpb24oKTtcblx0XHRcdH0sIDUwKTtcblx0XHR9LFxuXHRcdGhpZGU6IGZ1bmN0aW9uKGVsLCBjbG9zaW5nRnVuY3Rpb24pe1xuXHRcdFx0aWYgKCFlbCkge1xuXHRcdFx0XHRlbCA9IM+AMSgnLnBpLW1vZGFsLW92ZXJsYXkub24nKTtcblx0XHRcdH1cblxuXHRcdFx0ZWwua2lsbENsYXNzKCdvbicpO1xuXHRcdFx0dmFyIGR1cmF0aW9uID0gcGFyc2VGbG9hdChlbC5jc3MoKS50cmFuc2l0aW9uRHVyYXRpb24pICogMTAwMDtcblxuXHRcdFx0z4AuY2xlYW4obGlzdGVuRm9yRXNjLCAna2V5ZG93bicpO1xuXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGVsLmNzcyh7ZGlzcGxheTogJ25vbmUnfSk7XG5cdFx0XHRcdM+AMSgnYm9keScpLmtpbGxDbGFzcygnb3ZlcmxheS1vbicpO1xuXG5cdFx0XHRcdM+AMSgnaWZyYW1lJykuc3JjID0gJyc7XG5cblx0XHRcdFx0aWYgKGNsb3NpbmdGdW5jdGlvbikgY2xvc2luZ0Z1bmN0aW9uKCk7XG5cdFx0XHR9LCBkdXJhdGlvbik7XG5cdFx0fSxcblx0XHRzcGF3bjogZnVuY3Rpb24oZWwsIGNsb3NpbmdGdW5jdGlvbil7XG5cdFx0XHRlbC5hZGQoz4AubW9kYWxDbG9zZUJ1dHRvbihmdW5jdGlvbigpe1xuXHRcdFx0XHTPgC5tb2RhbE92ZXJsYXkuaGlkZShlbCk7XG5cdFx0XHR9KSk7XG5cdFx0fVxuXHR9O1xuXG5cdGZ1bmN0aW9uIGhhbmRsZU92ZXJsYXlDbGljayhlKSB7XG5cdFx0aWYgKGUudGFyZ2V0ICE9PSB3aW5kb3cgJiYgz4AxKCdib2R5JykuaGFzQ2xhc3MoJ292ZXJsYXktb24nKSkge1xuXHRcdFx0aWYgKGUudGFyZ2V0Lmhhc0NsYXNzKCdwaS1tb2RhbC1vdmVybGF5JykpIHtcblx0XHRcdFx0z4AubW9kYWxPdmVybGF5LmhpZGUoKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBsaXN0ZW5Gb3JFc2MoZSkge1xuXHRcdGlmIChlLndoaWNoID09IDI3KSDPgC5tb2RhbE92ZXJsYXkuaGlkZSgpO1xuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdCgpe1xuXHRcdM+AKCcucGktbW9kYWwtb3ZlcmxheScpLmZvckVhY2goz4AubW9kYWxPdmVybGF5LnNwYXduKTtcblx0XHTPgC5zZXRUcmlnZ2VycygnbW9kYWwtb3ZlcmxheScsIM+ALm1vZGFsT3ZlcmxheSk7XG5cdH1cblxuXHTPgC5tb2RzLnB1c2goaW5pdCk7XG59KSgpO1xuXG5cbi8vIG11bHRpRnJhbWVEaXNwbGF5XG4vLyBUT0RPOiBhcnJvdyBrZXlzXG4oZnVuY3Rpb24oKXtcblx0ZnVuY3Rpb24gc3Bhd24oZWwpe1xuXHRcdHZhciBkYXRhc2V0ID0gZWwuZGF0YXNldDtcblxuXHRcdHZhciBvcHRpb25zID0ge1xuXHRcdFx0bW9kYWw6IGJvb2xlYW5BdHRyaWJ1dGVWYWx1ZShlbCwgJ2RhdGEtbW9kYWwnLCBmYWxzZSksXG5cdFx0XHRwcmV2TmV4dDogYm9vbGVhbkF0dHJpYnV0ZVZhbHVlKGVsLCAnZGF0YS1wcmV2LW5leHQnLCB0cnVlKSxcblx0XHRcdHBhZ2VyOiBib29sZWFuQXR0cmlidXRlVmFsdWUoZWwsICdkYXRhLXBhZ2VyJywgZmFsc2UpLFxuXHRcdFx0Y3ljbGU6IGJvb2xlYW5BdHRyaWJ1dGVWYWx1ZShlbCwgJ2RhdGEtY3ljbGUnLCB0cnVlKSxcblx0XHRcdGF1dG9wbGF5OiBib29sZWFuQXR0cmlidXRlVmFsdWUoZWwsICdkYXRhLWF1dG9wbGF5JywgZmFsc2UpXG5cdFx0fTtcblxuXHRcdHZhciBpdGVtV3JhcHBlciA9IM+ALmRpdignaXRlbS13cmFwcGVyJyk7XG5cdFx0dmFyIHBhZ2VyID0gb3B0aW9ucy5wYWdlciA/IM+ALmRpdigncGFnZXInKSA6IG51bGw7XG5cblx0XHRlbC7PgCgnOnNjb3BlID4gLml0ZW0nKS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdFx0aXRlbVdyYXBwZXIuYWRkKGl0ZW0pO1xuXHRcdFx0aWYgKHBhZ2VyKSB7XG5cdFx0XHRcdGlmICghZWwuz4AxKCcucGFnZXInKSkge1xuXHRcdFx0XHR9XG5cdFx0XHRcdHZhciBwYWdlckJ1dHRvbiA9IM+ALmJ1dHRvbigncGFnZXItYnV0dG9uJywgbnVsbCwgbnVsbCwgcGFnZXJDbGljayk7XG5cdFx0XHRcdHBhZ2VyLmFkZChwYWdlckJ1dHRvbik7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRlbC5maWxsKFtpdGVtV3JhcHBlciwgcGFnZXJdKTtcblxuXHRcdGlmIChvcHRpb25zLnByZXZOZXh0KSB7XG5cdFx0XHR2YXIgcHJldkJ1dHRvbiA9IM+ALmJ1dHRvbigncHJldi1idXR0b24nKTtcblx0XHRcdHZhciBuZXh0QnV0dG9uID0gz4AuYnV0dG9uKCduZXh0LWJ1dHRvbicpO1xuXG5cdFx0XHRwcmV2QnV0dG9uLm9uY2xpY2sgPSBwcmV2O1xuXHRcdFx0bmV4dEJ1dHRvbi5vbmNsaWNrID0gbmV4dDtcblxuXHRcdFx0ZWwuYWRkKFtwcmV2QnV0dG9uLCBuZXh0QnV0dG9uXSk7XG5cdFx0fVxuXG5cdFx0aWYgKG9wdGlvbnMuYXV0b3BsYXkpIHtcblx0XHRcdG9wdGlvbnMuZGVsYXkgPSBkYXRhc2V0LmRlbGF5IHx8IDQwMDA7XG5cdFx0fVxuXG5cdFx0Ly8gVE9ETzogYXV0b3BsYXkgLyBzdGFydCAvIHN0b3BcblxuXHRcdGlmIChlbC5oYXNDbGFzcygncGktcm90YXRvcicpKSB7XG5cdFx0XHR2YXIgaW5oZXJpdGFuY2VPYmplY3QgPSB7XG5cdFx0XHRcdGVsOiBlbCxcblx0XHRcdFx0b3B0aW9uczogb3B0aW9uc1xuXHRcdFx0fTtcblx0XHRcdM+ALnJvdGF0b3Iuc3Bhd24oaW5oZXJpdGFuY2VPYmplY3QpO1xuXHRcdH1cblxuXHRcdGlmIChvcHRpb25zLm1vZGFsKSB7XG5cdFx0XHR2YXIgbW9kYWxXcmFwcGVyID0gz4AuZGl2KCdwaS1tb2RhbC1vdmVybGF5Jyk7XG5cdFx0XHRtb2RhbFdyYXBwZXIuaWQgPSBlbC5pZDtcblx0XHRcdGVsLnJlbW92ZUF0dHJpYnV0ZSgnaWQnKTtcblx0XHRcdG1vZGFsV3JhcHBlci53cmFwKGVsKTtcblx0XHRcdM+ALm1vZGFsT3ZlcmxheS5zcGF3bihtb2RhbFdyYXBwZXIpO1xuXHRcdH1cblxuXHRcdHZhciBtb3Zpbmc7XG5cblx0XHR2YXIgYWxsRnJhbWVzID0gaXRlbVdyYXBwZXIuY2hpbGROb2Rlcztcblx0XHRjaGFuZ2VGcmFtZSgwLCAwKTtcblxuXG5cdFx0ZnVuY3Rpb24gcHJldigpe1xuXHRcdFx0Y2hhbmdlRnJhbWUoLTEpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIG5leHQoKXtcblx0XHRcdGNoYW5nZUZyYW1lKDEpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHBhZ2VyQ2xpY2soKXtcblx0XHRcdGNoYW5nZUZyYW1lKG51bGwsIHRoaXMuaW5kZXgoKSk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2hhbmdlRnJhbWUoZGVsdGEsIGluY29taW5nSWR4KSB7XG5cdFx0XHRpZiAobW92aW5nKSByZXR1cm47XG5cdFx0XHRtb3ZpbmcgPSB0cnVlO1xuXG5cdFx0XHR2YXIgY3VycmVudEZyYW1lID0gaXRlbVdyYXBwZXIuz4AxKCcub24nKTtcblxuXHRcdFx0aWYgKCFkZWx0YSAmJiBjdXJyZW50RnJhbWUpIHtcblx0XHRcdFx0Ly8gcGFnZXIgY2xpY2sg4oCUIHJldHVybiBpZiBjbGlja2VkIG9uIFlBSFxuXHRcdFx0XHRpZiAoY3VycmVudEZyYW1lLmluZGV4KCkgPT09IGluY29taW5nSWR4KSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJtZXNzYWdlXCIpO1xuXHRcdFx0XHRcdG1vdmluZyA9IGZhbHNlO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmIChkZWx0YSkge1xuXHRcdFx0XHQvLyBjb25kaXRpb25hbGx5IHNldCBpbmNvbWluZ0lkeCB0byB3cmFwIGFyb3VuZFxuXHRcdFx0XHRpbmNvbWluZ0lkeCA9IGN1cnJlbnRGcmFtZS5pbmRleCgpICsgZGVsdGE7XG5cblx0XHRcdFx0aWYgKGluY29taW5nSWR4IDwgMClcblx0XHRcdFx0XHRpbmNvbWluZ0lkeCA9IGFsbEZyYW1lcy5sYXN0SWR4KCk7XG5cdFx0XHRcdGVsc2UgaWYgKGluY29taW5nSWR4ID49IGFsbEZyYW1lcy5sZW5ndGgpXG5cdFx0XHRcdFx0aW5jb21pbmdJZHggPSAwO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBjb25kaXRpb25hbGx5IGhpZGUgcHJldiBvciBuZXh0XG5cdFx0XHRpZiAoIW9wdGlvbnMuY3ljbGUpIHtcblx0XHRcdFx0aWYgKGluY29taW5nSWR4ID09PSAwKVxuXHRcdFx0XHRcdHByZXZCdXR0b24uaGlkZSgpO1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cHJldkJ1dHRvbi5zaG93KCk7XG5cblx0XHRcdFx0aWYgKGluY29taW5nSWR4ID09IGFsbEZyYW1lcy5sYXN0SWR4KCkpXG5cdFx0XHRcdFx0bmV4dEJ1dHRvbi5oaWRlKCk7XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRuZXh0QnV0dG9uLnNob3coKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gc2V0IHBhZ2VyIFlBSCBzdGF0ZVxuXHRcdFx0aWYgKG9wdGlvbnMucGFnZXIpIHtcblx0XHRcdFx0cGFnZXIuz4AoJy55YWgnKS5raWxsQ2xhc3MoJ3lhaCcpO1xuXHRcdFx0XHRwYWdlci5jaGlsZE5vZGVzW2luY29taW5nSWR4XS5hZGRDbGFzcygneWFoJyk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIHBhc3MgdG8gXCJzdWJjbGFzc2VzXCJcblx0XHRcdHZhciBpbmhlcml0YW5jZU9iamVjdCA9IHtcblx0XHRcdFx0ZWw6IGVsLFxuXHRcdFx0XHRjdXJyZW50RnJhbWU6IGN1cnJlbnRGcmFtZSxcblx0XHRcdFx0aW5jb21pbmdGcmFtZTogYWxsRnJhbWVzW2luY29taW5nSWR4XVxuXHRcdFx0fTtcblxuXHRcdFx0Ly8gY2hhbmdlIGZyYW1lOiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFNVQkNMQVNTRVMgRU5URVIgSEVSRSEhISEhICoqKioqKioqKioqKioqKioqKioqKioqKioqKipcblx0XHRcdGlmIChlbC5oYXNDbGFzcygncGktY3Jvc3NmYWRlcicpKSB7XG5cdFx0XHRcdM+ALmNyb3NzZmFkZXIuY2hhbmdlRnJhbWUoaW5oZXJpdGFuY2VPYmplY3QpO1xuXHRcdFx0fVxuXG5cdFx0XHRlbHNlIGlmIChlbC5oYXNDbGFzcygncGktcm90YXRvcicpKSB7XG5cdFx0XHRcdGluaGVyaXRhbmNlT2JqZWN0LnBhZ2VyQ2xpY2tlZCA9IGRlbHRhID8gZmFsc2UgOiB0cnVlO1xuXHRcdFx0XHRpbmhlcml0YW5jZU9iamVjdC5jeWNsZSA9IG9wdGlvbnMuY3ljbGU7XG5cdFx0XHRcdM+ALnJvdGF0b3IuY2hhbmdlRnJhbWUoaW5oZXJpdGFuY2VPYmplY3QpO1xuXHRcdFx0fVxuXG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0aWYoY3VycmVudEZyYW1lKSBjdXJyZW50RnJhbWUua2lsbENsYXNzKCdvbicpO1xuXHRcdFx0XHRpbmhlcml0YW5jZU9iamVjdC5pbmNvbWluZ0ZyYW1lLmFkZENsYXNzKCdvbicpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyB3YWl0IGJlZm9yZSByZS1lbmFibGluZ1xuXHRcdFx0dmFyIGR1cmF0aW9uID0gMTAwMDsgLy8gZGVmYXVsdCBmb3IgZmlyc3RSdW5cblxuXHRcdFx0aWYgKGN1cnJlbnRGcmFtZSkge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGR1cmF0aW9uID0gY3VycmVudEZyYW1lLmNzcygpLnRyYW5zaXRpb25EdXJhdGlvbi5zcGxpdChcIiwgXCIpLnJlZHVjZShmdW5jdGlvbihwcmV2LCBjdXJyZW50KXtcblx0XHRcdFx0XHRcdHJldHVybiBNYXRoLm1heChwYXJzZUZsb2F0KHByZXYpLCBwYXJzZUZsb2F0KGN1cnJlbnQpKTtcblx0XHRcdFx0XHR9KSAqIDEwMDA7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2F0Y2goZSkge1xuXHRcdFx0XHRcdM+ALkhBTC5zYXkoMCwgJ8+ALXJvdGF0b3IgbmVlZHMgeW91IHRvIHRyYW5zaXRpb24gYSBjc3MgdHJhbnNmb3JtIHRvIG1ha2UgeW91ciBpdGVtcyBtb3ZlLicpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdG1vdmluZyA9IGZhbHNlO1xuXHRcdFx0fSwgZHVyYXRpb24pO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHNob3coaWQpe1xuXHRcdHZhciBtZmQgPSDPgGQoaWQpO1xuXHRcdGlmIChtZmQuaGFzQ2xhc3MoJ3BpLW1vZGFsLW92ZXJsYXknKSkge1xuXHRcdFx0z4AubW9kYWxPdmVybGF5LnNob3coaWQpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGhpZGUoaWQpe1xuXHRcdHZhciBtZmQgPSDPgGQoaWQpO1xuXHRcdGlmIChtZmQuaGFzQ2xhc3MoJ3BpLW1vZGFsLW92ZXJsYXknKSkge1xuXHRcdFx0z4AubW9kYWxPdmVybGF5LmhpZGUoaWQsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKFwid2UganVzdCBoaWQgYW4gb3ZlcmxheVwiKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0z4AoJy5waS1tdWx0aS1mcmFtZS1kaXNwbGF5JykuZm9yRWFjaCjPgC5tdWx0aUZyYW1lRGlzcGxheS5zcGF3bik7XG5cdFx0z4Auc2V0VHJpZ2dlcnMoJ211bHRpLWZyYW1lLWRpc3BsYXknLCDPgC5tdWx0aUZyYW1lRGlzcGxheSk7XG5cdH1cblxuXHTPgC5tdWx0aUZyYW1lRGlzcGxheSA9IHtcblx0XHRzaG93OiBzaG93LFxuXHRcdGhpZGU6IGhpZGUsXG5cdFx0c3Bhd246IHNwYXduXG5cdH07XG5cblxuXHTPgC5tb2RzLnB1c2goaW5pdCk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdHZhciBtb3ZpbmcgPSBmYWxzZTtcblx0dmFyIENTU19CUk9XU0VSX0RFTEFZX0hBQ0sgPSAyNTtcblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdM+ALmNsZWFuKGluaXQpO1xuXG5cdFx0Ly8gU2FmYXJpIGNob2tlcyBvbiB0aGUgYW5pbWF0aW9uIGhlcmUsIHNvLi4uXG5cdFx0aWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignQ2hyb21lJykgPT0gLTEgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdTYWZhcmknKSAhPSAtMSl7XG5cdFx0XHTPgDEoJ2JvZHknKS5hZGQoz4AuY29udGVudEVsZW1lbnQoJ3N0eWxlJywgMCwgMCwgJy5waS1hY2NvcmRpb24gLndyYXBwZXJ7dHJhbnNpdGlvbjogbm9uZX0nKSk7XG5cdFx0fVxuXHRcdC8vIEdyb3NzLlxuXG5cdFx0z4AoJy5waS1hY2NvcmRpb24nKS5mb3JFYWNoKGZ1bmN0aW9uKGFjY29yZGlvbil7XG5cdFx0XHR2YXIgY29udGFpbmVyID0gz4AuZGl2KCdjb250YWluZXInLCBudWxsLCBhY2NvcmRpb24uaW5uZXJIVE1MKTtcblx0XHRcdGFjY29yZGlvbi5maWxsKGNvbnRhaW5lcik7XG5cdFx0XHRQaUFjY29yZGlvbihjb250YWluZXIpO1xuXHRcdH0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gUGlBY2NvcmRpb24oY29udGFpbmVyKXtcblx0XHRjb250YWluZXIuz4AoJzpzY29wZSA+IC5pdGVtJykuZm9yRWFjaChmdW5jdGlvbihpdGVtKXtcblx0XHRcdHZhciB0aXRsZVRleHQgPSBpdGVtLmRhdGFzZXQudGl0bGU7XG5cblx0XHRcdHZhciB0aXRsZSA9IM+ALmRpdigndGl0bGUnLCBudWxsLCB0aXRsZVRleHQpO1xuXHRcdFx0dmFyIHdyYXBwZXIgPSDPgC5kaXYoJ3dyYXBwZXInKTtcblx0XHRcdHZhciBjb250ZW50ID0gz4AuZGl2KCdjb250ZW50JywgbnVsbCwgaXRlbS5pbm5lckhUTUwpO1xuXG5cdFx0XHR3cmFwcGVyLmZpbGwoY29udGVudCk7XG5cdFx0XHRpdGVtLmZpbGwoW3RpdGxlLCB3cmFwcGVyXSk7XG5cblx0XHRcdHdyYXBwZXIuY3NzKHtoZWlnaHQ6IDB9KTtcblxuXHRcdFx0dGl0bGUub25jbGljayA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmIChtb3ZpbmcpIHJldHVybjtcblx0XHRcdFx0bW92aW5nID0gdHJ1ZTtcblxuXHRcdFx0XHRpZiAoY29udGFpbmVyLmRhdGFzZXQuc2luZ2xlKSB7XG5cdFx0XHRcdFx0dmFyIG9wZW5TaWJsaW5ncyA9IGl0ZW0uc2libGluZ3MoKS5maWx0ZXIoZnVuY3Rpb24oc2liKXtyZXR1cm4gc2liLmhhc0NsYXNzKCdvbicpO30pO1xuXHRcdFx0XHRcdG9wZW5TaWJsaW5ncy5mb3JFYWNoKGZ1bmN0aW9uKHNpYmxpbmcpe1xuXHRcdFx0XHRcdFx0dG9nZ2xlSXRlbShzaWJsaW5nKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHR0b2dnbGVJdGVtKGl0ZW0pO1xuXHRcdFx0XHR9LCBDU1NfQlJPV1NFUl9ERUxBWV9IQUNLKTtcblx0XHRcdH07XG5cblx0XHRcdGZ1bmN0aW9uIHRvZ2dsZUl0ZW0odGhpc0l0ZW0pe1xuXHRcdFx0XHR2YXIgdGhpc1dyYXBwZXIgPSB0aGlzSXRlbS7PgDEoJy53cmFwcGVyJyk7XG5cdFx0XHRcdHZhciBjb250ZW50SGVpZ2h0ID0gdGhpc1dyYXBwZXIuz4AxKCcuY29udGVudCcpLm9mZnNldCgpLmhlaWdodCArICdweCc7XG5cblx0XHRcdFx0aWYgKHRoaXNJdGVtLmhhc0NsYXNzKCdvbicpKSB7XG5cdFx0XHRcdFx0dGhpc1dyYXBwZXIuY3NzKHtoZWlnaHQ6IGNvbnRlbnRIZWlnaHR9KTtcblx0XHRcdFx0XHR0aGlzSXRlbS5raWxsQ2xhc3MoJ29uJyk7XG5cdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0dGhpc1dyYXBwZXIuY3NzKHtoZWlnaHQ6IDB9KTtcblx0XHRcdFx0XHRcdG1vdmluZyA9IGZhbHNlO1xuXHRcdFx0XHRcdH0sIENTU19CUk9XU0VSX0RFTEFZX0hBQ0spO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGl0ZW0uYWRkQ2xhc3MoJ29uJyk7XG5cdFx0XHRcdFx0dGhpc1dyYXBwZXIuY3NzKHtoZWlnaHQ6IGNvbnRlbnRIZWlnaHR9KTtcblxuXHRcdFx0XHRcdHZhciBkdXJhdGlvbiA9IHBhcnNlRmxvYXQodGhpc1dyYXBwZXIuY3NzKCkudHJhbnNpdGlvbkR1cmF0aW9uKSAqIDEwMDA7XG5cdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0dGhpc1dyYXBwZXIuY3NzKHtoZWlnaHQ6ICcnfSk7XG5cdFx0XHRcdFx0XHRtb3ZpbmcgPSBmYWxzZTtcblx0XHRcdFx0XHR9LCBkdXJhdGlvbik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0dmFyIGlubmVyQ29udGFpbmVycyA9IGNvbnRlbnQuz4AoJzpzY29wZSA+IC5jb250YWluZXInKTtcblx0XHRcdGlmIChpbm5lckNvbnRhaW5lcnMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRpbm5lckNvbnRhaW5lcnMuZm9yRWFjaChQaUFjY29yZGlvbik7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHTPgC5tb2RzLnB1c2goaW5pdCk7XG59KSgpO1xuIiwiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gz4AtcHVzaG1lbnUuanNcbiAvLyBUT0RPOiAgVVNBR0UgQU5EIEFQSSBSRUZFUkVOQ0VcbiBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXG4gREVQRU5ERU5DSUVTOlxuXG4gSEFMLmpzXG5cbiBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXG4gREFUQSBBVFRSSUJVVEVTOlxuXG4gc2lkZTogW1wibGVmdFwiLCBcInJpZ2h0XCJdXG4gX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xuIE1BUktVUCBBTkQgREVGQVVMVFM6XG5cblx0PGRpdiBjbGFzcz1cInBpLXB1c2htZW51XCIgaWQ9XCJteVB1c2hNZW51XCI+XG5cdFx0IDx1bD5cblx0XHRcdCA8bGk+PGEgaHJlZj1cIiNcIj5mb288L2E+PC9saT5cblx0XHRcdCA8bGk+PGEgaHJlZj1cIiNcIj5iYXI8L2E+PC9saT5cblx0XHRcdCA8bGk+PGEgaHJlZj1cIiNcIj5ncm9uazwvYT48L2xpPlxuXHRcdFx0IDxsaT48YSBocmVmPVwiI1wiPmZsZWVibGVzPC9hPjwvbGk+XG5cdFx0XHQgPGxpPjxhIGhyZWY9XCIjXCI+c2VwdWx2ZWRhPC9hPjwvbGk+XG5cdFx0IDwvdWw+XG5cdDwvZGl2PlxuXG5lbHNld2hlcmUuLi5cblxuIDxidXR0b24gb25jbGljaz1cIs+ALXB1c2htZW51LnNob3coJ215UHVzaE1lbnUnKVwiPnNob3cgbWVudTwvYnV0dG9uPlxuXG4gX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xuIEdFTkVSQVRFRCBIVE1MOlxuXG5cdFxuIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cbiBBUElcblxuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG7PgC5wdXNobWVudSA9IChmdW5jdGlvbigpe1xuXHR2YXIgYWxsUHVzaE1lbnVzID0ge307XG5cblx0ZnVuY3Rpb24gaW5pdCgpe1xuXHRcdM+AKCdbZGF0YS1hdXRvLWJ1cmdlcl0nKS5mb3JFYWNoKGZ1bmN0aW9uKGNvbnRhaW5lcil7XG5cdFx0XHR2YXIgaWQgPSBjb250YWluZXIuZ2V0QXR0cmlidXRlKCdkYXRhLWF1dG8tYnVyZ2VyJyk7XG5cblx0XHRcdHZhciBhdXRvQnVyZ2VyID0gz4BkKGlkKSB8fCDPgC5kaXYoJ3BpLXB1c2htZW51JywgaWQpO1xuXHRcdFx0dmFyIHVsID0gYXV0b0J1cmdlci7PgDEoJ3VsJykgfHwgz4AudWwoKTtcblxuXHRcdFx0Y29udGFpbmVyLs+AKCdhW2hyZWZdLCBidXR0b24nKS5mb3JFYWNoKGZ1bmN0aW9uIChvYmopIHtcblx0XHRcdFx0aWYgKCFib29sZWFuQXR0cmlidXRlVmFsdWUob2JqLCAnZGF0YS1hdXRvLWJ1cmdlci1leGNsdWRlJywgZmFsc2UpKSB7XG5cdFx0XHRcdFx0dmFyIGNsb25lID0gb2JqLmNsb25lTm9kZSh0cnVlKTtcblx0XHRcdFx0XHRjbG9uZS5pZCA9ICcnO1xuXG5cdFx0XHRcdFx0aWYgKGNsb25lLnRhZ05hbWUgPT0gXCJCVVRUT05cIikge1xuXHRcdFx0XHRcdFx0dmFyIGFUYWcgPSDPgC5zcmNFbGVtZW50KCdhJyk7XG5cdFx0XHRcdFx0XHRhVGFnLmhyZWYgPSAnJztcblx0XHRcdFx0XHRcdGFUYWcuaW5uZXJIVE1MID0gY2xvbmUuaW5uZXJIVE1MO1xuXHRcdFx0XHRcdFx0YVRhZy5vbmNsaWNrID0gY2xvbmUub25jbGljaztcblx0XHRcdFx0XHRcdGNsb25lID0gYVRhZztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dWwuYWRkKM+ALmxpKDAsIDAsIGNsb25lKSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRhdXRvQnVyZ2VyLmFkZCh1bCk7XG5cdFx0XHTPgDEoJ2JvZHknKS5hZGQoYXV0b0J1cmdlcik7XG5cdFx0fSk7XG5cblx0XHTPgChcIi5waS1wdXNobWVudVwiKS5mb3JFYWNoKGZ1bmN0aW9uKGVsKXtcblx0XHRcdGFsbFB1c2hNZW51c1tlbC5pZF0gPSBQdXNoTWVudShlbCk7XG5cdFx0fSk7XG5cblx0XHTPgC5zZXRUcmlnZ2VycygncHVzaG1lbnUnLCDPgC5wdXNobWVudSk7XG5cdH1cblxuXHRmdW5jdGlvbiBzaG93KG9iaklkKSB7XG5cdFx0YWxsUHVzaE1lbnVzW29iaklkXS5leHBvc2UoKTtcblx0fVxuXG5cdC8vIFRPRE86IGRpc21pc3Mgb24gY2xpY2s/XG5cdC8vIHRoaXMgd29ya3M6XG5cblx0Ly/PgCgnLnBpLXB1c2htZW51IGxpIGEnKS5mb3JFYWNoKGZ1bmN0aW9uKGEpe1xuXHQvL1x0YS5vbmNsaWNrID0gZnVuY3Rpb24oKXtcblx0Ly9cdFx0dGhpcy5wYXJlbnQoJy5waS1wdXNobWVudScpLs+AMSgnLnBpLW1vZGFsLWNsb3NlLWJ1dHRvbicpLmNsaWNrKCk7XG5cdC8vXHRcdGNvbnNvbGUubG9nKFwibWVzc2FnZVwiKTtcblx0Ly9cdH07XG5cdC8vfSk7XG5cblxuXHRmdW5jdGlvbiBQdXNoTWVudShlbCkge1xuXHRcdHZhciBodG1sID0gz4AxKCdodG1sJyk7XG5cdFx0dmFyIGJvZHkgPSDPgDEoJ2JvZHknKTtcblxuXHRcdHZhciBvdmVybGF5ID0gz4AuZGl2KFwib3ZlcmxheVwiKTtcblx0XHR2YXIgY29udGVudCA9IM+ALmRpdignY29udGVudCcsIG51bGwsIGVsLs+AMSgnKicpKTtcblxuXHRcdHZhciBzaWRlID0gZWwuZ2V0QXR0cmlidXRlKFwiZGF0YS1zaWRlXCIpIHx8IFwicmlnaHRcIjtcblxuXHRcdHZhciBzbGVkID0gz4AuZGl2KFwic2xlZFwiKTtcblx0XHRzbGVkLmNzcyhzaWRlLCAwKTtcblxuXHRcdHZhciB0b3BCYXIgPSDPgC5kaXYoXCJ0b3AtYmFyXCIpO1xuXG5cdFx0dG9wQmFyLmZpbGwoz4AubW9kYWxDbG9zZUJ1dHRvbihjbG9zZU1lKSk7XG5cdFx0c2xlZC5maWxsKFt0b3BCYXIsIGNvbnRlbnRdKTtcblxuXHRcdG92ZXJsYXkuZmlsbChzbGVkKTtcblx0XHRlbC5maWxsKG92ZXJsYXkpO1xuXG5cdFx0c2xlZC5vbmNsaWNrID0gZnVuY3Rpb24oZSl7XG5cdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdH07XG5cblx0XHRvdmVybGF5Lm9uY2xpY2sgPSBjbG9zZU1lO1xuXG5cdFx0z4AubGlzdGVuKGNsb3NlTWUsICdyZXNpemUnKTtcblxuXHRcdGZ1bmN0aW9uIGNsb3NlTWUoZSkge1xuXHRcdFx0dmFyIHQgPSBlLnRhcmdldDtcblx0XHRcdGlmICh0ID09IHNsZWQgfHwgdCA9PSB0b3BCYXIpIHJldHVybjtcblxuXHRcdFx0ZWwua2lsbENsYXNzKFwib25cIik7XG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGVsLmNzcyh7ZGlzcGxheTogXCJub25lXCJ9KTtcblxuXHRcdFx0XHRib2R5LmtpbGxDbGFzcyhcIm92ZXJsYXktb25cIik7XG5cdFx0XHR9LCAzMDApO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGV4cG9zZU1lKCl7XG5cdFx0XHRib2R5LmFkZENsYXNzKFwib3ZlcmxheS1vblwiKTsgLy8gaW4gdGhlIGRlZmF1bHQgY29uZmlnLCBraWxscyBib2R5IHNjcm9sbGluZ1xuXG5cdFx0XHRlbC5jc3Moe1xuXHRcdFx0XHRkaXNwbGF5OiBcImJsb2NrXCIsXG5cdFx0XHRcdHpJbmRleDogz4AuaGlnaGVzdFooKVxuXHRcdFx0fSk7XG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGVsLmFkZENsYXNzKFwib25cIik7XG5cdFx0XHR9LCAxMCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4cG9zZTogZXhwb3NlTWVcblx0XHR9O1xuXHR9XG5cblx0z4AubW9kcy5wdXNoKGluaXQpO1xuXG5cdHJldHVybiB7XG5cdFx0c2hvdzogc2hvd1xuXHR9O1xufSkoKTtcbiIsIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIM+ALWRpYWxvZy5qc1xuIFVTQUdFIEFORCBBUEkgUkVGRVJFTkNFXG4gX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xuIERFUEVOREVOQ0lFUzpcblxuIM+ALmpzXG5cbiBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXG4gREFUQSBBVFRSSUJVVEVTOlxuXG4gX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xuIE1BUktVUCBBTkQgREVGQVVMVFM6XG5cbiA8ZGl2IGNsYXNzPVwibmV3X21vZHVsZVwiPlxuXG4gPC9kaXY+XG5cbiBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXG4gR0VORVJBVEVEIEhUTUw6XG5cbiA8ZGl2IGNsYXNzPVwibmV3X21vZHVsZVwiPlxuXG4gPC9kaXY+XG5cbiBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXG4gQVBJXG5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbihmdW5jdGlvbigpe1xuXHTPgC5kaWFsb2cgPSB7XG5cdFx0c2hvdzogz4AubW9kYWxPdmVybGF5LnNob3csXG5cdFx0c3Bhd246IHNwYXduLFxuXHRcdGFjdGlvbnM6IHt9XG5cdH07XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHTPgCgnLnBpLWRpYWxvZycpLmZvckVhY2goz4AuZGlhbG9nLnNwYXduKTtcblx0XHTPgC5zZXRUcmlnZ2VycygnZGlhbG9nJywgz4AubW9kYWxPdmVybGF5KTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNwYXduKGVsKXtcblx0XHR2YXIgY29udGVudEJveCA9IM+ALmRpdignY29udGVudC1ib3gnLCAwLCBlbC5pbm5lckhUTUwpO1xuXHRcdHZhciBkaWFsb2dCb3ggPSDPgC5kaXYoJ2RpYWxvZy1ib3gnLCAwLCBjb250ZW50Qm94KTtcblx0XHRlbC5maWxsKGRpYWxvZ0JveCk7XG5cblx0XHRpZiAoZWwuZGF0YXNldC50aXRsZSl7XG5cdFx0XHRkaWFsb2dCb3gucHJlcGVuZCjPgC5kaXYoJ3RpdGxlJywgMCwgZWwuZGF0YXNldC50aXRsZSkpO1xuXHRcdH1cblxuXHRcdGVsLs+AKCcuYnV0dG9ucyBidXR0b24nKS5mb3JFYWNoKGZ1bmN0aW9uKGJ1dHRvbil7XG5cdFx0XHRidXR0b24ub25jbGljayA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHZhciBhY3Rpb24gPSBidXR0b24uZ2V0QXR0cmlidXRlKCdwaS1kaWFsb2ctYWN0aW9uJyk7XG5cdFx0XHRcdGlmIChhY3Rpb24pe1xuXHRcdFx0XHRcdM+ALmRpYWxvZy5hY3Rpb25zW2FjdGlvbl0oKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0aWYgKCFidXR0b24uaGFzQXR0cmlidXRlKCdkYXRhLWJ5cGFzcycpKXtcblx0XHRcdFx0YnV0dG9uLmxpc3RlbihkaXNtaXNzLCAnY2xpY2snKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGlmICghYm9vbGVhbkF0dHJpYnV0ZVZhbHVlKGVsLCAnZGF0YS1pbmxpbmUnLCBmYWxzZSkpIHtcblx0XHRcdGVsLmFkZENsYXNzKCdwaS1tb2RhbC1vdmVybGF5Jyk7XG5cdFx0XHTPgC5tb2RhbE92ZXJsYXkuc3Bhd24oZWwpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGRpc21pc3MoKXtcblx0XHRcdGVsLs+AMSgnLnBpLW1vZGFsLWNsb3NlLWJ1dHRvbicpLmNsaWNrKCk7XG5cdFx0fVxuXHR9XG5cblxuXG5cdC8vIM+ALm1vZHMgYXJlIGxvYWRlZCBhZnRlciBET01Db250ZW50TG9hZGVkXG5cdM+ALm1vZHMucHVzaChpbml0KTtcbn0pKCk7IiwidmFyIGt1YiA9IChmdW5jdGlvbiAoKSB7XG5cdM+ALmxpc3Rlbihpbml0KTtcblxuXHR2YXIgSEVBREVSX0hFSUdIVDtcblx0dmFyIGh0bWwsIGJvZHksIG1haW5OYXYsIHF1aWNrc3RhcnRCdXR0b24sIHdpc2hGaWVsZDtcblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdM+ALmNsZWFuKGluaXQpO1xuXG5cdFx0aHRtbCA9IM+AMSgnaHRtbCcpO1xuXHRcdGJvZHkgPSDPgDEoJ2JvZHknKTtcblx0XHRtYWluTmF2ID0gz4BkKFwibWFpbk5hdlwiKTtcblx0XHR3aXNoRmllbGQgPSDPgGQoJ3dpc2hGaWVsZCcpO1xuXHRcdEhFQURFUl9IRUlHSFQgPSDPgDEoJ2hlYWRlcicpLm9mZnNldCgpLmhlaWdodDtcblxuXHRcdHF1aWNrc3RhcnRCdXR0b24gPSDPgGQoJ3F1aWNrc3RhcnRCdXR0b24nKTtcblxuXHRcdGJ1aWxkSW5saW5lVE9DKCk7XG5cblx0XHRzZXRZQUgoKTtcblxuXG5cdFx0YWRqdXN0RXZlcnl0aGluZygpO1xuXG5cdFx0z4AubGlzdGVuKGFkanVzdEV2ZXJ5dGhpbmcsICdyZXNpemUnKTtcblx0XHTPgC5saXN0ZW4oYWRqdXN0RXZlcnl0aGluZywgJ3Njcm9sbCcpO1xuXHRcdM+ALmxpc3RlbihoYW5kbGVLZXlzdHJva2VzLCAna2V5ZG93bicpO1xuXHRcdHdpc2hGaWVsZC5saXN0ZW4oaGFuZGxlS2V5c3Ryb2tlcywgJ2tleWRvd24nKTtcblxuXHRcdGRvY3VtZW50Lm9udW5sb2FkID0gZnVuY3Rpb24oKXtcblx0XHRcdM+ALmNsZWFuKGFkanVzdEV2ZXJ5dGhpbmcsICdyZXNpemUnKTtcblx0XHRcdM+ALmNsZWFuKGFkanVzdEV2ZXJ5dGhpbmcsICdzY3JvbGwnKTtcblx0XHRcdM+ALmNsZWFuKGhhbmRsZUtleXN0cm9rZXMsICdrZXlkb3duJyk7XG5cdFx0XHR3aXNoRmllbGQuY2xlYW4oaGFuZGxlS2V5c3Ryb2tlcywgJ2tleWRvd24nKTtcblx0XHR9O1xuXG5cdFx0z4AubGlzdGVuKGNsb3NlT3Blbk1lbnUsICdyZXNpemUnKTtcblxuXHRcdGZ1bmN0aW9uIGNsb3NlT3Blbk1lbnUoKSB7XG5cdFx0XHRpZiAoaHRtbC5oYXNDbGFzcygnb3Blbi1uYXYnKSkgdG9nZ2xlTWVudSgpO1xuXHRcdH1cblxuXHRcdM+AKCcuZHJvcGRvd24nKS5mb3JFYWNoKGZ1bmN0aW9uKGRyb3Bkb3duKSB7XG5cdFx0XHR2YXIgcmVhZG91dCA9IGRyb3Bkb3duLs+AMSgnLnJlYWRvdXQnKTtcblx0XHRcdHJlYWRvdXQuaW5uZXJIVE1MID0gZHJvcGRvd24uz4AxKCdhJykuaW5uZXJIVE1MO1xuXHRcdFx0cmVhZG91dC5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRkcm9wZG93bi50b2dnbGVDbGFzcygnb24nKTtcblx0XHRcdFx0z4AubGlzdGVuKGNsb3NlT3BlbkRyb3Bkb3duLCAnY2xpY2snKTtcblxuXHRcdFx0XHRmdW5jdGlvbiBjbG9zZU9wZW5Ecm9wZG93bihlKSB7XG5cdFx0XHRcdFx0aWYgKGRyb3Bkb3duLmhhc0NsYXNzKCdvbicpICYmICEoZHJvcGRvd25XYXNDbGlja2VkKGUpKSkge1xuXHRcdFx0XHRcdFx0z4AuY2xlYW4oY2xvc2VPcGVuRHJvcGRvd24sICdjbGljaycpO1xuXHRcdFx0XHRcdFx0ZHJvcGRvd24ua2lsbENsYXNzKCdvbicpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZ1bmN0aW9uIGRyb3Bkb3duV2FzQ2xpY2tlZChlKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGUudGFyZ2V0LmlzSGVpck9mQ2xhc3MoJ2Ryb3Bkb3duJyk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fSk7XG5cblx0XHRzZXRJbnRlcnZhbChzZXRGb290ZXJUeXBlLCAxMCk7XG5cdH1cblxuXHR2YXIgdG9jQ291bnQgPSAwO1xuXG5cdGZ1bmN0aW9uIGJ1aWxkSW5saW5lVE9DKCkge1xuXHRcdHZhciBkb2NzQ29udGVudCA9IM+AZCgnZG9jc0NvbnRlbnQnKTtcblx0XHR2YXIgcGFnZVRPQyA9IM+AZCgncGFnZVRPQycpO1xuXG5cdFx0aWYgKHBhZ2VUT0MpIHtcblx0XHRcdHZhciBoZWFkZXJzID0gZG9jc0NvbnRlbnQua2lkcygnI3BhZ2VUT0MsIGgxLCBoMiwgaDMsIGg0LCBoNSwgaDYnKTtcblx0XHRcdGhlYWRlcnMuc3BsaWNlKDAsIGhlYWRlcnMuaW5kZXhPZihwYWdlVE9DKSArIDEpO1xuXG5cdFx0XHR2YXIgdG9jID0gz4AudWwoKTtcblx0XHRcdHBhZ2VUT0MuYWRkKHRvYyk7XG5cblx0XHRcdGhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbiAoaGVhZGVyKSB7XG5cdFx0XHRcdHZhciBhbmNob3JOYW1lID0gJ3BhZ2VUT0MnICsgdG9jQ291bnQrKztcblxuXHRcdFx0XHR2YXIgbGluayA9IM+ALmNvbnRlbnRFbGVtZW50KCdhJywgMCwgMCwgaGVhZGVyLmlubmVySFRNTCk7XG5cdFx0XHRcdGxpbmsuaHJlZiA9ICcjJyArIGFuY2hvck5hbWU7XG5cdFx0XHRcdGxpbmsuYWRkQ2xhc3MoaGVhZGVyLnRhZ05hbWUpO1xuXG5cdFx0XHRcdHZhciBhbmNob3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG5cdFx0XHRcdGFuY2hvci5uYW1lID0gYW5jaG9yTmFtZTtcblx0XHRcdFx0ZG9jc0NvbnRlbnQuaW5zZXJ0QmVmb3JlKGFuY2hvciwgaGVhZGVyKTtcblxuXHRcdFx0XHR0b2MuYWRkKM+ALmxpKDAsIDAsIGxpbmspKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHNldFlBSCgpIHtcblx0XHR2YXIgcGF0aG5hbWUgPSBsb2NhdGlvbi5ocmVmO1xuXG5cdFx0dmFyIGN1cnJlbnRMaW5rID0gbnVsbDtcblxuXHRcdM+AZCgnZG9jc1RvYycpLs+AKCdhJykuZm9yRWFjaChmdW5jdGlvbiAobGluaykge1xuXHRcdFx0aWYgKHBhdGhuYW1lLmluZGV4T2YobGluay5ocmVmKSAhPT0gLTEpIHtcblx0XHRcdFx0Y3VycmVudExpbmsgPSBsaW5rO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0aWYgKGN1cnJlbnRMaW5rKSB7XG5cdFx0XHRjdXJyZW50TGluay5wYXJlbnRzKCdkaXYuaXRlbScpLmZvckVhY2goZnVuY3Rpb24gKHBhcmVudCkge1xuXHRcdFx0XHRwYXJlbnQuz4AxKCcudGl0bGUnKS5jbGljaygpO1xuXHRcdFx0XHRjdXJyZW50TGluay5hZGRDbGFzcygneWFoJyk7XG5cdFx0XHRcdGN1cnJlbnRMaW5rLmhyZWYgPSAnJztcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHNldEZvb3RlclR5cGUoKSB7XG5cdFx0aWYgKGh0bWwuaWQgPT0gXCJkb2NzXCIpIHtcblx0XHRcdHZhciBib2R5SGVpZ2h0ID0gz4BkKCdoZXJvJykub2Zmc2V0KCkuaGVpZ2h0ICsgz4BkKCdlbmN5Y2xvcGVkaWEnKS5vZmZzZXQoKS5oZWlnaHQ7XG5cdFx0XHR2YXIgZm9vdGVyID0gz4AxKCdmb290ZXInKTtcblx0XHRcdHZhciBmb290ZXJIZWlnaHQgPSBmb290ZXIub2Zmc2V0KCkuaGVpZ2h0O1xuXHRcdFx0Ym9keS5jbGFzc09uQ29uZGl0aW9uKCdmaXhlZCcsIHdpbmRvdy5pbm5lckhlaWdodCAtIGZvb3RlckhlaWdodCA+IGJvZHlIZWlnaHQpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGFkanVzdEV2ZXJ5dGhpbmcoKSB7XG5cdFx0aWYgKCFodG1sLmhhc0NsYXNzKCdvcGVuLW5hdicpKSBIRUFERVJfSEVJR0hUID0gz4AxKCdoZWFkZXInKS5vZmZzZXQoKS5oZWlnaHQ7XG5cdFx0aHRtbC5jbGFzc09uQ29uZGl0aW9uKCdmbGlwLW5hdicsIHdpbmRvdy5wYWdlWU9mZnNldCA+IDApO1xuXHR9XG5cblx0ZnVuY3Rpb24gdG9nZ2xlTWVudSgpIHtcblx0XHRpZiAod2luZG93LmlubmVyV2lkdGggPCA4MDApIHtcblx0XHRcdM+ALnB1c2htZW51LnNob3coJ3ByaW1hcnknKTtcblx0XHR9XG5cblx0XHRlbHNlIHtcblx0XHRcdHZhciBuZXdIZWlnaHQgPSBIRUFERVJfSEVJR0hUO1xuXG5cdFx0XHRpZiAoIWh0bWwuaGFzQ2xhc3MoJ29wZW4tbmF2JykpIHtcblx0XHRcdFx0bmV3SGVpZ2h0ID0gbWFpbk5hdi5vZmZzZXQoKS5oZWlnaHQ7XG5cdFx0XHR9XG5cblx0XHRcdM+AMSgnaGVhZGVyJykuY3NzKHtoZWlnaHQ6IHB4KG5ld0hlaWdodCl9KTtcblx0XHR9XG5cblx0XHRodG1sLnRvZ2dsZUNsYXNzKCdvcGVuLW5hdicpO1xuXHR9XG5cblx0ZnVuY3Rpb24gc3VibWl0V2lzaCh0ZXh0ZmllbGQpIHtcblx0XHRhbGVydCgnWW91IHR5cGVkOiAnICsgdGV4dGZpZWxkLnZhbHVlKTtcblx0XHR0ZXh0ZmllbGQudmFsdWUgPSAnJztcblx0XHR0ZXh0ZmllbGQuYmx1cigpO1xuXHR9XG5cblx0ZnVuY3Rpb24gaGFuZGxlS2V5c3Ryb2tlcyhlKSB7XG5cdFx0c3dpdGNoIChlLndoaWNoKSB7XG5cdFx0XHRjYXNlIDEzOiB7XG5cdFx0XHRcdGlmIChlLmN1cnJlbnRUYXJnZXQgPT09IHdpc2hGaWVsZCkge1xuXHRcdFx0XHRcdHN1Ym1pdFdpc2god2lzaEZpZWxkKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblxuXHRcdFx0Y2FzZSAyNzoge1xuXHRcdFx0XHRpZiAoaHRtbC5oYXNDbGFzcygnb3Blbi1uYXYnKSkge1xuXHRcdFx0XHRcdHRvZ2dsZU1lbnUoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdHRvZ2dsZU1lbnU6IHRvZ2dsZU1lbnVcblx0fTtcbn0pKCk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
