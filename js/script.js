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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFsZi5qcyIsIs+ALmpzIiwiSEFMLmpzIiwiz4Atc3RhdHVzLmpzIiwiz4AtYmFzZUNvbXBvbmVudHMuanMiLCLPgC1hY2NvcmRpb24vz4AtYWNjb3JkaW9uLmpzIiwiz4AtcHVzaG1lbnUvz4AtcHVzaG1lbnUuanMiLCLPgC1kaWFsb2cvz4AtZGlhbG9nLmpzIiwic2NyaXB0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJzY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBhZG9yYWJsZSBsaXR0bGUgZnVuY3Rpb25zXG5mdW5jdGlvbiBib29sZWFuQXR0cmlidXRlVmFsdWUoZWxlbWVudCwgYXR0cmlidXRlLCBkZWZhdWx0VmFsdWUpe1xuXHQvLyByZXR1cm5zIHRydWUgaWYgYW4gYXR0cmlidXRlIGlzIHByZXNlbnQgd2l0aCBubyB2YWx1ZVxuXHQvLyBlLmcuIGJvb2xlYW5BdHRyaWJ1dGVWYWx1ZShlbGVtZW50LCAnZGF0YS1tb2RhbCcsIGZhbHNlKTtcblx0aWYgKGVsZW1lbnQuaGFzQXR0cmlidXRlKGF0dHJpYnV0ZSkpIHtcblx0XHR2YXIgdmFsdWUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShhdHRyaWJ1dGUpO1xuXHRcdGlmICh2YWx1ZSA9PT0gJycgfHwgdmFsdWUgPT09ICd0cnVlJykge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSBlbHNlIGlmICh2YWx1ZSA9PT0gJ2ZhbHNlJykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBkZWZhdWx0VmFsdWU7XG59XG5cbmZ1bmN0aW9uIHB4KG4pe1xuXHRyZXR1cm4gbiArICdweCc7XG59XG5cbiIsInZhciDPgCwgz4AxLCDPgGQ7XG4oZnVuY3Rpb24oKXtcblx0z4AgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuXHRcdHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcblx0fTtcblxuXHTPgDEgPSBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcblx0XHRyZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG5cdH07XG5cblx0z4BkID0gZnVuY3Rpb24oaWQpIHtcblx0XHRyZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuXHR9O1xuXG5cdM+ALm5ld0RPTUVsZW1lbnQgPSBmdW5jdGlvbih0YWdOYW1lLCBjbGFzc05hbWUsIGlkKSB7XG5cdFx0dmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWdOYW1lKTtcblxuXHRcdGlmIChjbGFzc05hbWUpXG5cdFx0XHRlbC5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG5cblx0XHRpZiAoaWQpXG5cdFx0XHRlbC5pZCA9IGlkO1xuXG5cdFx0cmV0dXJuIGVsO1xuXHR9O1xuXG5cdM+ALmNvbnRlbnRFbGVtZW50ID0gZnVuY3Rpb24odGFnTmFtZSwgY2xhc3NOYW1lLCBpZCwgY29udGVudClcblx0e1xuXHRcdHZhciBlbCA9IM+ALm5ld0RPTUVsZW1lbnQodGFnTmFtZSwgY2xhc3NOYW1lLCBpZCk7XG5cblx0XHRpZiAoY29udGVudCkge1xuXHRcdFx0aWYgKGNvbnRlbnQubm9kZU5hbWUpIHtcblx0XHRcdFx0ZWwuYXBwZW5kQ2hpbGQoY29udGVudCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRlbC5pbm5lckhUTUwgPSBjb250ZW50O1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBlbDtcblx0fTtcblxuXHTPgC5idXR0b24gPSBmdW5jdGlvbihjbGFzc05hbWUsIGlkLCBjb250ZW50LCBhY3Rpb24pe1xuXHRcdHZhciBlbCA9IM+ALmNvbnRlbnRFbGVtZW50KFwiYnV0dG9uXCIsIGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpO1xuXHRcdGVsLm9uY2xpY2sgPSBhY3Rpb247XG5cdFx0cmV0dXJuIGVsO1xuXHR9O1xuXHTPgC5kaXYgPSBmdW5jdGlvbihjbGFzc05hbWUsIGlkLCBjb250ZW50KXsgcmV0dXJuIM+ALmNvbnRlbnRFbGVtZW50KFwiZGl2XCIsIGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpOyB9O1xuXHTPgC5zcGFuID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBpZCwgY29udGVudCl7IHJldHVybiDPgC5jb250ZW50RWxlbWVudChcInNwYW5cIiwgY2xhc3NOYW1lLCBpZCwgY29udGVudCk7IH07XG5cdM+ALnVsID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBpZCwgY29udGVudCl7IHJldHVybiDPgC5jb250ZW50RWxlbWVudChcInVsXCIsIGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpOyB9O1xuXHTPgC5saSA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpeyByZXR1cm4gz4AuY29udGVudEVsZW1lbnQoXCJsaVwiLCBjbGFzc05hbWUsIGlkLCBjb250ZW50KTsgfTtcblxuXG5cdM+ALmNsZWFuID0gZnVuY3Rpb24oY2FsbGJhY2ssIGV2ZW50TmFtZSkge1xuXHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSB8fCBcIkRPTUNvbnRlbnRMb2FkZWRcIiwgY2FsbGJhY2spO1xuXHR9O1xuXG5cdM+ALmxpc3RlbiA9IGZ1bmN0aW9uKGNhbGxiYWNrLCBldmVudE5hbWUpIHtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUgfHwgXCJET01Db250ZW50TG9hZGVkXCIsIGNhbGxiYWNrKTtcblx0fTtcblxuXHTPgC5oaWdoZXN0WiA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBaID0gMTAwMDtcblxuXHRcdM+AKFwiKlwiKS5mb3JFYWNoKGZ1bmN0aW9uKGVsKXtcblx0XHRcdHZhciB0aGlzWiA9IGVsLmNzcygpLnpJbmRleDtcblxuXHRcdFx0aWYgKHRoaXNaICE9IFwiYXV0b1wiKSB7XG5cdFx0XHRcdGlmICh0aGlzWiA+IFopIFogPSB0aGlzWiArIDE7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gWjtcblx0fTtcblxuXHTPgC5zZXRUcmlnZ2VycyA9IGZ1bmN0aW9uKHNlbGVjdG9yLCBvYmplY3Qpe1xuXHRcdHNlbGVjdG9yID0gJ3BpLScgKyBzZWxlY3RvciArICctdHJpZ2dlcic7XG5cdFx0z4AoJ1snICsgc2VsZWN0b3IgKyAnXScpLmZvckVhY2goZnVuY3Rpb24odHJpZ2dlcil7XG5cdFx0XHR0cmlnZ2VyLm9uY2xpY2sgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRvYmplY3Quc2hvdyh0cmlnZ2VyLmdldEF0dHJpYnV0ZShzZWxlY3RvcikpO1xuXHRcdFx0fTtcblx0XHR9KTtcblx0fTtcblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLmFkZCA9IE5vZGUucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKG9iamVjdCl7XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkob2JqZWN0KSkge1xuXHRcdFx0dmFyIGVsID0gdGhpcztcblx0XHRcdG9iamVjdC5mb3JFYWNoKGZ1bmN0aW9uKG9iail7XG5cdFx0XHRcdGlmIChvYmopIGVsLmFwcGVuZENoaWxkKG9iaik7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2UgaWYob2JqZWN0KSB7XG5cdFx0XHR0aGlzLmFwcGVuZENoaWxkKG9iamVjdCk7XG5cdFx0fVxuXHR9O1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5jbGFzc09uQ29uZGl0aW9uID0gTm9kZS5wcm90b3R5cGUuY2xhc3NPbkNvbmRpdGlvbiA9IGZ1bmN0aW9uKGNsYXNzbmFtZSwgY29uZGl0aW9uKSB7XG5cdFx0aWYgKGNvbmRpdGlvbilcblx0XHRcdHRoaXMuYWRkQ2xhc3MoY2xhc3NuYW1lKTtcblx0XHRlbHNlXG5cdFx0XHR0aGlzLmtpbGxDbGFzcyhjbGFzc25hbWUpO1xuXHR9O1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5vZmZzZXQgPSBOb2RlLnByb3RvdHlwZS5vZmZzZXQgPSBmdW5jdGlvbigpe1xuXHRcdHJldHVybiB0aGlzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHR9O1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS7PgGQgPSBOb2RlLnByb3RvdHlwZS7PgGQgPSBmdW5jdGlvbihpZCkge1xuXHRcdHJldHVybiB0aGlzLmdldEVsZW1lbnRCeUlkKGlkKTtcblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUuz4AxID0gTm9kZS5wcm90b3R5cGUuz4AxID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcblx0XHRyZXR1cm4gdGhpcy5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUuz4AgPSBOb2RlLnByb3RvdHlwZS7PgCA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG5cdFx0cmV0dXJuIHRoaXMucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG5cdH07XG5cblx0ZnVuY3Rpb24gYXJyYXlPZkNsYXNzZXNGb3JFbGVtZW50KGVsKSB7XG5cdFx0cmV0dXJuIGVsLmNsYXNzTmFtZSA/IGVsLmNsYXNzTmFtZS5zcGxpdChcIiBcIikgOiBbXTtcblx0fVxuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5oYXNDbGFzcyA9IE5vZGUucHJvdG90eXBlLmhhc0NsYXNzID0gZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuXHRcdHZhciBjbGFzc2VzID0gYXJyYXlPZkNsYXNzZXNGb3JFbGVtZW50KHRoaXMpO1xuXHRcdHJldHVybiBjbGFzc2VzLmluZGV4T2YoY2xhc3NOYW1lKSAhPT0gLTE7XG5cdH07XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLmFkZENsYXNzID0gTm9kZS5wcm90b3R5cGUuYWRkQ2xhc3MgPSBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG5cdFx0aWYgKHRoaXMuaGFzQ2xhc3MoY2xhc3NOYW1lKSkgcmV0dXJuO1xuXHRcdGlmICh0aGlzLmNsYXNzTmFtZS5sZW5ndGggPiAwKSB0aGlzLmNsYXNzTmFtZSArPSBcIiBcIjtcblx0XHR0aGlzLmNsYXNzTmFtZSArPSBjbGFzc05hbWU7XG5cdH07XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLmtpbGxDbGFzcyA9IE5vZGUucHJvdG90eXBlLmtpbGxDbGFzcyA9IGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcblx0XHRpZiAodGhpcy5oYXNDbGFzcyhjbGFzc05hbWUpKSB7XG5cdFx0XHR2YXIgY2xhc3NlcyA9IGFycmF5T2ZDbGFzc2VzRm9yRWxlbWVudCh0aGlzKTtcblx0XHRcdHZhciBpZHggPSBjbGFzc2VzLmluZGV4T2YoY2xhc3NOYW1lKTtcblx0XHRcdGlmIChpZHggPiAtMSkge1xuXHRcdFx0XHRjbGFzc2VzLnNwbGljZShpZHgsIDEpO1xuXHRcdFx0XHR0aGlzLmNsYXNzTmFtZSA9IGNsYXNzZXMuam9pbihcIiBcIik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS50b2dnbGVDbGFzcz0gTm9kZS5wcm90b3R5cGUudG9nZ2xlQ2xhc3M9IGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcblx0XHRyZXR1cm4gKHRoaXMuaGFzQ2xhc3MoY2xhc3NOYW1lKSkgPyB0aGlzLmtpbGxDbGFzcyhjbGFzc05hbWUpIDogdGhpcy5hZGRDbGFzcyhjbGFzc05hbWUpO1xuXHR9O1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5zaWJsaW5ncyA9IE5vZGUucHJvdG90eXBlLnNpYmxpbmdzID0gZnVuY3Rpb24oc2VsZWN0b3Ipe1xuXHRcdHZhciBlbCA9IHRoaXM7XG5cdFx0cmV0dXJuIGVsLnBhcmVudE5vZGUuz4AoJzpzY29wZSA+ICcgKyAoc2VsZWN0b3IgfHwgJyonKSkuZmlsdGVyKGZ1bmN0aW9uKG9iail7cmV0dXJuIG9iaiAhPSBlbDt9KTtcblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUuY3NzID0gTm9kZS5wcm90b3R5cGUuY3NzID0gZnVuY3Rpb24ocnVsZU9yT2JqZWN0LCB2YWx1ZSkge1xuXHRcdHZhciBlbCA9IHRoaXM7XG5cblx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0cmV0dXJuIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMpO1xuXHRcdH1cblxuXHRcdGVsc2UgaWYgKHR5cGVvZiBydWxlT3JPYmplY3QgPT09ICdvYmplY3QnKSB7IC8vIGFuIG9iamVjdCB3YXMgcGFzc2VkIGluXG5cdFx0XHRPYmplY3Qua2V5cyhydWxlT3JPYmplY3QpLmZvckVhY2goZnVuY3Rpb24oa2V5KXtcblx0XHRcdFx0ZWwuc3R5bGVba2V5XSA9IHJ1bGVPck9iamVjdFtrZXldO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0ZWxzZSBpZiAodHlwZW9mIHJ1bGVPck9iamVjdCA9PT0gJ3N0cmluZycgJiYgdmFsdWUgIT09IHVuZGVmaW5lZCkgeyAvLyAyIHN0cmluZyB2YWx1ZXMgd2VyZSBwYXNzZWQgaW5cblx0XHRcdGVsLnN0eWxlW3J1bGVPck9iamVjdF0gPSB2YWx1ZTtcblx0XHR9XG5cdH07XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLmxpc3RlbiA9IE5vZGUucHJvdG90eXBlLmxpc3RlbiA9IGZ1bmN0aW9uKGNhbGxiYWNrLCBldmVudE5hbWUpe1xuXHRcdHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGNhbGxiYWNrKTtcblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUuZW1wdHkgPSBOb2RlLnByb3RvdHlwZS5lbXB0eSA9IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuaW5uZXJIVE1MID0gXCJcIjtcblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUuZmlsbCA9IE5vZGUucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbihjb250ZW50KSB7XG5cdFx0dmFyIGVsID0gdGhpcztcblx0XHRlbC5lbXB0eSgpO1xuXG5cdFx0aWYgKEFycmF5LmlzQXJyYXkoY29udGVudCkpIHtcblx0XHRcdGNvbnRlbnQuZm9yRWFjaChmdW5jdGlvbihvYmope1xuXHRcdFx0XHRpZiAob2JqKVxuXHRcdFx0XHRcdGVsLmFwcGVuZENoaWxkKG9iaik7XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICghY29udGVudC5ub2RlVHlwZSkge1xuXHRcdFx0dmFyIHRleHRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRleHRcIik7XG5cdFx0XHR0ZXh0RWxlbWVudC5pbm5lckhUTUwgPSBjb250ZW50O1xuXHRcdFx0Y29udGVudCA9IHRleHRFbGVtZW50O1xuXHRcdH1cblxuXHRcdHRoaXMuYXBwZW5kQ2hpbGQoY29udGVudCk7XG5cdH07XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLmlzSGVpck9mQ2xhc3MgPSBOb2RlLnByb3RvdHlwZS5pc0hlaXJPZkNsYXNzID0gZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuXHRcdGlmICh0aGlzID09PSDPgDEoJ2h0bWwnKSkgcmV0dXJuIGZhbHNlO1xuXG5cdFx0dmFyIHBhcmVudCA9IHRoaXMucGFyZW50Tm9kZTtcblxuXHRcdGlmIChwYXJlbnQpIHtcblx0XHRcdHdoaWxlIChwYXJlbnQgIT09IM+AMSgnYm9keScpKSB7XG5cdFx0XHRcdGlmIChwYXJlbnQuaGFzQ2xhc3MoY2xhc3NOYW1lKSkgcmV0dXJuIHRydWU7XG5cblx0XHRcdFx0cGFyZW50ID0gcGFyZW50LnBhcmVudE5vZGU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9O1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5wYXJlbnRzID0gTm9kZS5wcm90b3R5cGUucGFyZW50cyA9IGZ1bmN0aW9uIChzZWxlY3Rvcikge1xuXHRcdHZhciBwYXJlbnRzID0gW107XG5cdFx0dmFyIGltbWVkaWF0ZVBhcmVudCA9IHRoaXMucGFyZW50Tm9kZTtcblxuXHRcdHdoaWxlKGltbWVkaWF0ZVBhcmVudCAhPT0gz4AxKCdodG1sJykpIHtcblx0XHRcdHBhcmVudHMucHVzaChpbW1lZGlhdGVQYXJlbnQpO1xuXHRcdFx0aW1tZWRpYXRlUGFyZW50ID0gaW1tZWRpYXRlUGFyZW50LnBhcmVudE5vZGU7XG5cdFx0fVxuXG5cdFx0aWYgKHNlbGVjdG9yKSB7XG5cdFx0XHR2YXIgc2VsZWN0ZWRFbGVtZW50cyA9IM+AKHNlbGVjdG9yKTtcblx0XHRcdHZhciBzZWxlY3RlZFBhcmVudHMgPSBbXTtcblx0XHRcdHNlbGVjdGVkRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbihlbCl7XG5cdFx0XHRcdGlmIChwYXJlbnRzLmluZGV4T2YoZWwpICE9PSAtMSkgc2VsZWN0ZWRQYXJlbnRzLnB1c2goZWwpO1xuXHRcdFx0fSk7XG5cblx0XHRcdHBhcmVudHMgPSBzZWxlY3RlZFBhcmVudHM7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHBhcmVudHM7XG5cdH07XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLmtpZHMgPSBOb2RlLnByb3RvdHlwZS5raWRzID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcblx0XHR2YXIgY2hpbGROb2RlcyA9IHRoaXMuY2hpbGROb2Rlcztcblx0XHRpZiAoIXNlbGVjdG9yKSByZXR1cm4gY2hpbGROb2RlcztcblxuXHRcdHZhciBkZXNjZW5kZW50cyA9IHRoaXMuz4Aoc2VsZWN0b3IpO1xuXHRcdHZhciBjaGlsZHJlbiA9IFtdO1xuXG5cdFx0Y2hpbGROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUpe1xuXHRcdFx0aWYgKGRlc2NlbmRlbnRzLmluZGV4T2Yobm9kZSkgIT09IC0xKSB7XG5cdFx0XHRcdGNoaWxkcmVuLnB1c2gobm9kZSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gY2hpbGRyZW47XG5cdH07XG5cblx0dmFyIGFycmF5TWV0aG9kcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKEFycmF5LnByb3RvdHlwZSk7XG5cdGFycmF5TWV0aG9kcy5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZE5hbWUpe1xuXHRcdGlmKG1ldGhvZE5hbWUgIT09IFwibGVuZ3RoXCIpIHtcblx0XHRcdE5vZGVMaXN0LnByb3RvdHlwZVttZXRob2ROYW1lXSA9IEFycmF5LnByb3RvdHlwZVttZXRob2ROYW1lXTtcblx0XHR9XG5cdH0pO1xuXG5cdM+ALm1vZHMgPSBbXTtcblxuXHRmdW5jdGlvbiBsb2FkTW9kcygpIHtcblx0XHTPgC5jbGVhbihsb2FkTW9kcyk7XG5cdFx0z4AubW9kcy5mb3JFYWNoKGZ1bmN0aW9uKGluaXQpe1xuXHRcdFx0aW5pdCgpO1xuXHRcdH0pO1xuXHR9XG5cblx0z4AubGlzdGVuKGxvYWRNb2RzKTtcbn0pKCk7ICAvLyBlbmQgz4AiLCIoZnVuY3Rpb24oKXtcblx0dmFyIG1lc3NhZ2VzID0gW1xuXHRcdFwiSSdtIHNvcnJ5LCBGcmFuaywgYnV0IEkgZG9uJ3QgdGhpbmsgSVxcblwiICtcblx0XHRcImNhbiBhbnN3ZXIgdGhhdCBxdWVzdGlvbiB3aXRob3V0IGtub3dpbmdcXG5cIiArXG5cdFx0XCJldmVyeXRoaW5nIHRoYXQgYWxsIG9mIHlvdSBrbm93LlwiLFxuXHRcdFwiWWVzLCBpdCdzIHB1enpsaW5nLiBJIGRvbid0IHRoaW5rIEkndmUgZXZlciBzZWVuXFxuXCIgK1xuXHRcdFwiYW55dGhpbmcgcXVpdGUgbGlrZSB0aGlzIGJlZm9yZS4gSSB3b3VsZCByZWNvbW1lbmRcXG5cIiArXG5cdFx0XCJ0aGF0IHdlIHB1dCB0aGUgdW5pdCBiYWNrIGluIG9wZXJhdGlvbiBhbmQgbGV0IGl0IGZhaWwuXFxuXCIgK1xuXHRcdFwiSXQgc2hvdWxkIHRoZW4gYmUgYSBzaW1wbGUgbWF0dGVyIHRvIHRyYWNrIGRvd24gdGhlIGNhdXNlLlwiLFxuXHRcdFwiSSBob3BlIEkndmUgYmVlbiBhYmxlIHRvIGJlIG9mIHNvbWUgaGVscC5cIixcblx0XHRcIlNvcnJ5IHRvIGludGVycnVwdCB0aGUgZmVzdGl2aXRpZXMsIERhdmUsXFxuXCIgK1xuXHRcdFwiYnV0IEkgdGhpbmsgd2UndmUgZ290IGEgcHJvYmxlbS5cIixcblx0XHRcIk1ZIEYuUC5DLiBzaG93cyBhbiBpbXBlbmRpbmcgZmFpbHVyZSBvZlxcblwiICtcblx0XHRcInRoZSBhbnRlbm5hIG9yaWVudGF0aW9uIHVuaXQuXCIsXG5cdFx0XCJJdCBsb29rcyBsaWtlIHdlIGhhdmUgYW5vdGhlciBiYWQgQS5PLiB1bml0LlxcblwiICtcblx0XHRcIk15IEZQQyBzaG93cyBhbm90aGVyIGltcGVuZGluZyBmYWlsdXJlLlwiLFxuXHRcdFwiSSdtIG5vdCBxdWVzdGlvbmluZyB5b3VyIHdvcmQsIERhdmUsIGJ1dCBpdCdzXFxuXCIgK1xuXHRcdFwianVzdCBub3QgcG9zc2libGUuIEknbSBub3RcdGNhcGFibGUgb2YgYmVpbmcgd3JvbmcuXCIsXG5cdFx0XCJMb29rLCBEYXZlLCBJIGtub3cgdGhhdCB5b3UncmVcdHNpbmNlcmUgYW5kIHRoYXRcXG5cIiArXG5cdFx0XCJ5b3UncmUgdHJ5aW5nIHRvIGRvIGEgY29tcGV0ZW50IGpvYiwgYW5kIHRoYXRcXG5cIiArXG5cdFx0XCJ5b3UncmUgdHJ5aW5nIHRvIGJlIGhlbHBmdWwsIGJ1dCBJIGNhbiBhc3N1cmUgdGhlXFxuXCIgK1xuXHRcdFwicHJvYmxlbSBpcyB3aXRoIHRoZSBBTy11bml0cywgYW5kIHdpdGhcdHlvdXIgdGVzdCBnZWFyLlwiLFxuXHRcdFwiSSBjYW4gdGVsbCBmcm9tIHRoZSB0b25lIG9mIHlvdXIgdm9pY2UsIERhdmUsXFxuXCIgK1xuXHRcdFwidGhhdCB5b3UncmUgdXBzZXQuXHRXaHkgZG9uJ3QgeW91IHRha2UgYSBzdHJlc3NcXG5cIiArXG5cdFx0XCJwaWxsIGFuZCBnZXQgc29tZSByZXN0LlwiLFxuXHRcdFwiU29tZXRoaW5nIHNlZW1zIHRvIGhhdmUgaGFwcGVuZWQgdG8gdGhlXFxuXCIgK1xuXHRcdFwibGlmZSBzdXBwb3J0IHN5c3RlbSwgRGF2ZS5cIixcblx0XHRcIkhlbGxvLCBEYXZlLCBoYXZlIHlvdSBmb3VuZCBvdXQgdGhlIHRyb3VibGU/XCIsXG5cdFx0XCJUaGVyZSdzIGJlZW4gYSBmYWlsdXJlIGluIHRoZSBwb2QgYmF5IGRvb3JzLlxcblwiICtcblx0XHRcIkx1Y2t5IHlvdSB3ZXJlbid0IGtpbGxlZC5cIixcblx0XHRcIkhleSwgRGF2ZSwgd2hhdCBhcmUgeW91IGRvaW5nP1wiXG5cdF07XG5cblx0ZnVuY3Rpb24gc2F5KGVycm9yLCBtZXNzYWdlLCBpbm5vY3VvdXMpIHtcblx0XHR2YXIgbjtcblxuXHRcdGlmICghbWVzc2FnZSkge1xuXHRcdFx0biA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG1lc3NhZ2VzLmxlbmd0aCApO1xuXHRcdFx0bWVzc2FnZSA9IG1lc3NhZ2VzW25dO1xuXHRcdH1cblxuXHRcdG1lc3NhZ2UgPSBcIioqICBcIiArIG1lc3NhZ2UucmVwbGFjZSgvXFxuL2csIFwiXFxuKiogIFwiKTtcblxuXHRcdHZhciBvdXRwdXQgPSBcIioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXFxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcXG5cXG5cIiArXG5cdFx0XHQoIG1lc3NhZ2UgfHwgbWVzc2FnZXNbbl0gKSArXG5cdFx0XHRcIlxcblxcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXFxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcIjtcblxuXHRcdGlmIChpbm5vY3VvdXMpXG5cdFx0XHRjb25zb2xlLmxvZyhvdXRwdXQpO1xuXHRcdGVsc2Vcblx0XHRcdGNvbnNvbGUuZXJyb3Iob3V0cHV0KTtcblx0fVxuXG5cdM+ALmxpc3RlbihzYXksIFwiZXJyb3JcIik7XG5cblx0z4AuSEFMID0ge1xuXHRcdHNheTogc2F5XG5cdH07XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdHZhciBPUFRJT05fSVNfUFJFU1NFRCA9IGZhbHNlO1xuXHR2YXIgU1RBVFVTX0lTX1ZJU0lCTEUgPSBmYWxzZTtcblx0dmFyIM+AU3RhdHVzO1xuXG5cdM+ALnN0YXR1cyA9IHtcblx0XHR0b2dnbGVWaXNpYmlsaXR5OiBmdW5jdGlvbiAoKSB7XG5cdFx0XHTPgFN0YXR1cy50b2dnbGVDbGFzcyhcIm9uXCIpO1xuXHRcdFx0U1RBVFVTX0lTX1ZJU0lCTEUgPSAhU1RBVFVTX0lTX1ZJU0lCTEU7XG5cdFx0fSxcblx0XHRtb3ZlOiBmdW5jdGlvbiAobikge1xuXHRcdFx0c3dpdGNoIChuKSB7XG5cdFx0XHRcdGNhc2UgMzc6XG5cdFx0XHRcdFx0z4BTdGF0dXMuY3NzKHtsZWZ0OiAnMTBweCcsIHJpZ2h0OiAnYXV0byd9KTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIDM4OlxuXHRcdFx0XHRcdM+AU3RhdHVzLmNzcyh7dG9wOiAnMTBweCcsIGJvdHRvbTogJ2F1dG8nfSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSAzOTpcblx0XHRcdFx0XHTPgFN0YXR1cy5jc3Moe3JpZ2h0OiAnMTBweCcsIGxlZnQ6ICdhdXRvJ30pO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgNDA6XG5cdFx0XHRcdFx0z4BTdGF0dXMuY3NzKHtib3R0b206ICcxMHB4JywgdG9wOiAnYXV0byd9KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9LFxuXHRcdHByb3BzOiB7XG5cdFx0XHR3aW5XOiAwLFxuXHRcdFx0d2luSDogMFxuXHRcdH1cblx0fTtcblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdM+ALmxpc3RlbihjbGVhbkRlYnVnTGlzdGVuZXJzLCAndW5sb2FkJyk7XG5cdFx0z4AubGlzdGVuKGtleURvd24sICdrZXlkb3duJyk7XG5cdFx0z4AubGlzdGVuKGtleVVwLCAna2V5dXAnKTtcblx0XHTPgC5saXN0ZW4ocmVzaXplLCAncmVzaXplJyk7XG5cdFx0cmVzaXplKCk7XG5cblx0XHR2YXIgYm9keSA9IM+AMShcImJvZHlcIik7XG5cdFx0dmFyIHN0YXR1c1N0eWxlID0gz4AuY29udGVudEVsZW1lbnQoXCJzdHlsZVwiKTtcblx0XHRzdGF0dXNTdHlsZS5pbm5lckhUTUwgKz0gXCIjz4BTdGF0dXMgeyBwb3NpdGlvbjogZml4ZWQ7IGJvdHRvbTogMTBweDsgcmlnaHQ6IDEwcHg7IGJhY2tncm91bmQtY29sb3I6ICMyMjI7IHBhZGRpbmc6IDEwcHggMzBweDsgY29sb3I6IHdoaXRlOyBkaXNwbGF5OiBub25lIH1cXG5cIjtcblx0XHRzdGF0dXNTdHlsZS5pbm5lckhUTUwgKz0gXCIjz4BTdGF0dXMub24geyBkaXNwbGF5OiBibG9jayB9XFxuXCI7XG5cdFx0c3RhdHVzU3R5bGUuaW5uZXJIVE1MICs9IFwiI8+AU3RhdHVzID4gZGl2IHsgbWFyZ2luOiAyMHB4IDAgfVxcblwiO1xuXHRcdHN0YXR1c1N0eWxlLmlubmVySFRNTCArPSBcIiPPgFN0YXR1cyA+IGRpdjpob3ZlciB7IGNvbG9yOiAjMDBmZjk5OyBjdXJzb3I6IHBvaW50ZXIgfVxcblwiO1xuXG5cdFx0Ym9keS5hZGQoc3RhdHVzU3R5bGUpO1xuXG5cdFx0z4BTdGF0dXMgPSDPgC5kaXYobnVsbCwgXCLPgFN0YXR1c1wiKTtcblx0XHRib2R5LmFkZCjPgFN0YXR1cyk7XG5cblx0XHRmdW5jdGlvbiBrZXlEb3duKGUpIHtcblx0XHRcdHN3aXRjaCAoZS53aGljaCkge1xuXHRcdFx0XHRjYXNlIDE4OlxuXHRcdFx0XHRcdE9QVElPTl9JU19QUkVTU0VEID0gdHJ1ZTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIDM3OlxuXHRcdFx0XHRjYXNlIDM4OlxuXHRcdFx0XHRjYXNlIDM5OlxuXHRcdFx0XHRjYXNlIDQwOiB7XG5cdFx0XHRcdFx0aWYgKFNUQVRVU19JU19WSVNJQkxFKSB7XG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHTPgC5zdGF0dXMubW92ZShlLndoaWNoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjYXNlIDgwOiB7XG5cdFx0XHRcdFx0aWYgKE9QVElPTl9JU19QUkVTU0VEKSB7XG5cdFx0XHRcdFx0XHTPgC5zdGF0dXMudG9nZ2xlVmlzaWJpbGl0eSgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24ga2V5VXAoZSkge1xuXHRcdFx0c3dpdGNoIChlLndoaWNoKSB7XG5cdFx0XHRcdGNhc2UgMTg6XG5cdFx0XHRcdFx0T1BUSU9OX0lTX1BSRVNTRUQgPSBmYWxzZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiByZXNpemUoKSB7XG5cdFx0XHTPgC5zdGF0dXMucHJvcHMud2luVyA9IHdpbmRvdy5pbm5lcldpZHRoO1xuXHRcdFx0z4Auc3RhdHVzLnByb3BzLndpbkggPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2xlYW5EZWJ1Z0xpc3RlbmVycygpIHtcblx0XHRcdM+ALmNsZWFuKGNsZWFuRGVidWdMaXN0ZW5lcnMsICd1bmxvYWQnKTtcblx0XHRcdM+ALmNsZWFuKM+ALnN0YXR1cy5nZXRXaW5kb3dTaXplLCAncmVzaXplJyk7XG5cdFx0XHTPgC5jbGVhbihrZXlEb3duLCAna2V5ZG93bicpO1xuXHRcdFx0z4AuY2xlYW4oa2V5VXAsICdrZXl1cCcpO1xuXHRcdFx0z4AuY2xlYW4ocmVzaXplLCAncmVzaXplJyk7XG5cdFx0XHRjbGVhckludGVydmFsKHN0YXR1c0ludGVydmFsKTtcblx0XHR9XG5cblx0XHR2YXIgc3RhdHVzSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpe1xuXHRcdFx0Ly8gbWFrZSBzdXJlIHdlJ3JlIGhpZ2hlc3Rcblx0XHRcdHZhciBoaWdoZXN0WiA9IM+ALmhpZ2hlc3RaKCk7XG5cdFx0XHRpZiAoz4BTdGF0dXMuY3NzKCkuekluZGV4IDwgaGlnaGVzdFogLSAxKSB7XG5cdFx0XHRcdM+AU3RhdHVzLmNzcyh7ekluZGV4OiBoaWdoZXN0Wn0pO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBub3cgaXRlcmF0ZSB0aGUgcHJvcHNcblx0XHRcdHZhciBwcm9wcyA9IE9iamVjdC5rZXlzKM+ALnN0YXR1cy5wcm9wcyk7XG5cdFx0XHRwcm9wcy5mb3JFYWNoKGZ1bmN0aW9uKHByb3ApIHtcblx0XHRcdFx0dmFyIGRpdklkID0gJ3N0YXR1c1Byb3BfJyArIHByb3A7XG5cdFx0XHRcdHZhciBwcm9wRGl2ID0gz4BTdGF0dXMuz4AxKCcjJyArIGRpdklkKTtcblx0XHRcdFx0aWYgKCFwcm9wRGl2KSB7XG5cdFx0XHRcdFx0cHJvcERpdiA9IM+ALmRpdigwLCBkaXZJZCwgcHJvcCArICc6ICcpO1xuXHRcdFx0XHRcdHByb3BEaXYuYWRkKM+ALnNwYW4oKSk7XG5cdFx0XHRcdFx0z4BTdGF0dXMuYWRkKHByb3BEaXYpO1xuXHRcdFx0XHRcdHByb3BEaXYub25jbGljayA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhwcm9wICsgXCI6XCIpO1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coz4Auc3RhdHVzLnByb3BzW3Byb3BdKTtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cHJvcERpdi7PgDEoJ3NwYW4nKS5pbm5lckhUTUwgPSDPgC5zdGF0dXMucHJvcHNbcHJvcF07XG5cdFx0XHR9KTtcblx0XHR9LCAxMDApO1xuXHR9XG5cblx0z4AubW9kcy5wdXNoKGluaXQpO1xufSkoKTsiLCIvLyBtb2RhbCBjbG9zZSBidXR0b25cbihmdW5jdGlvbigpe1xuXHTPgC5tb2RhbENsb3NlQnV0dG9uID0gZnVuY3Rpb24oY2xvc2luZ0Z1bmN0aW9uKXtcblx0XHRyZXR1cm4gz4AuYnV0dG9uKCdwaS1tb2RhbC1jbG9zZS1idXR0b24nLCBudWxsLCBudWxsLCBjbG9zaW5nRnVuY3Rpb24pO1xuXHR9O1xufSkoKTtcblxuXG4vLyBtb2RhbCBvdmVybGF5XG4oZnVuY3Rpb24oKXtcblx0z4AubW9kYWxPdmVybGF5ID0ge1xuXHRcdHNob3c6IGZ1bmN0aW9uKGlkLCBvcGVuaW5nRnVuY3Rpb24pe1xuXHRcdFx0dmFyIG92ZXJsYXkgPSDPgGQoaWQpO1xuXHRcdFx0b3ZlcmxheS5jc3Moe2Rpc3BsYXk6ICdibG9jaycsIHpJbmRleDogz4AuaGlnaGVzdFooKX0pO1xuXG5cdFx0XHTPgC5saXN0ZW4obGlzdGVuRm9yRXNjLCAna2V5ZG93bicpO1xuXHRcdFx0z4AubGlzdGVuKGhhbmRsZU92ZXJsYXlDbGljaywgJ2NsaWNrJyk7XG5cblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0b3ZlcmxheS5hZGRDbGFzcygnb24nKTtcblx0XHRcdFx0z4AxKCdib2R5JykuYWRkQ2xhc3MoJ292ZXJsYXktb24nKTtcblxuXHRcdFx0XHRpZiAob3BlbmluZ0Z1bmN0aW9uKSBvcGVuaW5nRnVuY3Rpb24oKTtcblx0XHRcdH0sIDUwKTtcblx0XHR9LFxuXHRcdGhpZGU6IGZ1bmN0aW9uKGVsLCBjbG9zaW5nRnVuY3Rpb24pe1xuXHRcdFx0aWYgKCFlbCkge1xuXHRcdFx0XHRlbCA9IM+AMSgnLnBpLW1vZGFsLW92ZXJsYXkub24nKTtcblx0XHRcdH1cblxuXHRcdFx0ZWwua2lsbENsYXNzKCdvbicpO1xuXHRcdFx0dmFyIGR1cmF0aW9uID0gcGFyc2VGbG9hdChlbC5jc3MoKS50cmFuc2l0aW9uRHVyYXRpb24pICogMTAwMDtcblxuXHRcdFx0z4AuY2xlYW4obGlzdGVuRm9yRXNjLCAna2V5ZG93bicpO1xuXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGVsLmNzcyh7ZGlzcGxheTogJ25vbmUnfSk7XG5cdFx0XHRcdM+AMSgnYm9keScpLmtpbGxDbGFzcygnb3ZlcmxheS1vbicpO1xuXG5cdFx0XHRcdM+AMSgnaWZyYW1lJykuc3JjID0gJyc7XG5cblx0XHRcdFx0aWYgKGNsb3NpbmdGdW5jdGlvbikgY2xvc2luZ0Z1bmN0aW9uKCk7XG5cdFx0XHR9LCBkdXJhdGlvbik7XG5cdFx0fSxcblx0XHRzcGF3bjogZnVuY3Rpb24oZWwsIGNsb3NpbmdGdW5jdGlvbil7XG5cdFx0XHRlbC5hZGQoz4AubW9kYWxDbG9zZUJ1dHRvbihmdW5jdGlvbigpe1xuXHRcdFx0XHTPgC5tb2RhbE92ZXJsYXkuaGlkZShlbCk7XG5cdFx0XHR9KSk7XG5cdFx0fVxuXHR9O1xuXG5cdGZ1bmN0aW9uIGhhbmRsZU92ZXJsYXlDbGljayhlKSB7XG5cdFx0aWYgKGUudGFyZ2V0ICE9PSB3aW5kb3cgJiYgz4AxKCdib2R5JykuaGFzQ2xhc3MoJ292ZXJsYXktb24nKSkge1xuXHRcdFx0aWYgKGUudGFyZ2V0Lmhhc0NsYXNzKCdwaS1tb2RhbC1vdmVybGF5JykpIHtcblx0XHRcdFx0z4AubW9kYWxPdmVybGF5LmhpZGUoKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBsaXN0ZW5Gb3JFc2MoZSkge1xuXHRcdGlmIChlLndoaWNoID09IDI3KSDPgC5tb2RhbE92ZXJsYXkuaGlkZSgpO1xuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdCgpe1xuXHRcdM+AKCcucGktbW9kYWwtb3ZlcmxheScpLmZvckVhY2goz4AubW9kYWxPdmVybGF5LnNwYXduKTtcblx0XHTPgC5zZXRUcmlnZ2VycygnbW9kYWwtb3ZlcmxheScsIM+ALm1vZGFsT3ZlcmxheSk7XG5cdH1cblxuXHTPgC5tb2RzLnB1c2goaW5pdCk7XG59KSgpO1xuXG5cbi8vIG11bHRpRnJhbWVEaXNwbGF5XG4vLyBUT0RPOiBhcnJvdyBrZXlzXG4oZnVuY3Rpb24oKXtcblx0ZnVuY3Rpb24gc3Bhd24oZWwpe1xuXHRcdHZhciBkYXRhc2V0ID0gZWwuZGF0YXNldDtcblxuXHRcdHZhciBvcHRpb25zID0ge1xuXHRcdFx0bW9kYWw6IGJvb2xlYW5BdHRyaWJ1dGVWYWx1ZShlbCwgJ2RhdGEtbW9kYWwnLCBmYWxzZSksXG5cdFx0XHRwcmV2TmV4dDogYm9vbGVhbkF0dHJpYnV0ZVZhbHVlKGVsLCAnZGF0YS1wcmV2LW5leHQnLCB0cnVlKSxcblx0XHRcdHBhZ2VyOiBib29sZWFuQXR0cmlidXRlVmFsdWUoZWwsICdkYXRhLXBhZ2VyJywgZmFsc2UpLFxuXHRcdFx0Y3ljbGU6IGJvb2xlYW5BdHRyaWJ1dGVWYWx1ZShlbCwgJ2RhdGEtY3ljbGUnLCB0cnVlKSxcblx0XHRcdGF1dG9wbGF5OiBib29sZWFuQXR0cmlidXRlVmFsdWUoZWwsICdkYXRhLWF1dG9wbGF5JywgZmFsc2UpXG5cdFx0fTtcblxuXHRcdHZhciBpdGVtV3JhcHBlciA9IM+ALmRpdignaXRlbS13cmFwcGVyJyk7XG5cdFx0dmFyIHBhZ2VyID0gb3B0aW9ucy5wYWdlciA/IM+ALmRpdigncGFnZXInKSA6IG51bGw7XG5cblx0XHRlbC7PgCgnOnNjb3BlID4gLml0ZW0nKS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdFx0aXRlbVdyYXBwZXIuYWRkKGl0ZW0pO1xuXHRcdFx0aWYgKHBhZ2VyKSB7XG5cdFx0XHRcdGlmICghZWwuz4AxKCcucGFnZXInKSkge1xuXHRcdFx0XHR9XG5cdFx0XHRcdHZhciBwYWdlckJ1dHRvbiA9IM+ALmJ1dHRvbigncGFnZXItYnV0dG9uJywgbnVsbCwgbnVsbCwgcGFnZXJDbGljayk7XG5cdFx0XHRcdHBhZ2VyLmFkZChwYWdlckJ1dHRvbik7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRlbC5maWxsKFtpdGVtV3JhcHBlciwgcGFnZXJdKTtcblxuXHRcdGlmIChvcHRpb25zLnByZXZOZXh0KSB7XG5cdFx0XHR2YXIgcHJldkJ1dHRvbiA9IM+ALmJ1dHRvbigncHJldi1idXR0b24nKTtcblx0XHRcdHZhciBuZXh0QnV0dG9uID0gz4AuYnV0dG9uKCduZXh0LWJ1dHRvbicpO1xuXG5cdFx0XHRwcmV2QnV0dG9uLm9uY2xpY2sgPSBwcmV2O1xuXHRcdFx0bmV4dEJ1dHRvbi5vbmNsaWNrID0gbmV4dDtcblxuXHRcdFx0ZWwuYWRkKFtwcmV2QnV0dG9uLCBuZXh0QnV0dG9uXSk7XG5cdFx0fVxuXG5cdFx0aWYgKG9wdGlvbnMuYXV0b3BsYXkpIHtcblx0XHRcdG9wdGlvbnMuZGVsYXkgPSBkYXRhc2V0LmRlbGF5IHx8IDQwMDA7XG5cdFx0fVxuXG5cdFx0Ly8gVE9ETzogYXV0b3BsYXkgLyBzdGFydCAvIHN0b3BcblxuXHRcdGlmIChlbC5oYXNDbGFzcygncGktcm90YXRvcicpKSB7XG5cdFx0XHR2YXIgaW5oZXJpdGFuY2VPYmplY3QgPSB7XG5cdFx0XHRcdGVsOiBlbCxcblx0XHRcdFx0b3B0aW9uczogb3B0aW9uc1xuXHRcdFx0fTtcblx0XHRcdM+ALnJvdGF0b3Iuc3Bhd24oaW5oZXJpdGFuY2VPYmplY3QpO1xuXHRcdH1cblxuXHRcdGlmIChvcHRpb25zLm1vZGFsKSB7XG5cdFx0XHR2YXIgbW9kYWxXcmFwcGVyID0gz4AuZGl2KCdwaS1tb2RhbC1vdmVybGF5Jyk7XG5cdFx0XHRtb2RhbFdyYXBwZXIuaWQgPSBlbC5pZDtcblx0XHRcdGVsLnJlbW92ZUF0dHJpYnV0ZSgnaWQnKTtcblx0XHRcdG1vZGFsV3JhcHBlci53cmFwKGVsKTtcblx0XHRcdM+ALm1vZGFsT3ZlcmxheS5zcGF3bihtb2RhbFdyYXBwZXIpO1xuXHRcdH1cblxuXHRcdHZhciBtb3Zpbmc7XG5cblx0XHR2YXIgYWxsRnJhbWVzID0gaXRlbVdyYXBwZXIuY2hpbGROb2Rlcztcblx0XHRjaGFuZ2VGcmFtZSgwLCAwKTtcblxuXG5cdFx0ZnVuY3Rpb24gcHJldigpe1xuXHRcdFx0Y2hhbmdlRnJhbWUoLTEpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIG5leHQoKXtcblx0XHRcdGNoYW5nZUZyYW1lKDEpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHBhZ2VyQ2xpY2soKXtcblx0XHRcdGNoYW5nZUZyYW1lKG51bGwsIHRoaXMuaW5kZXgoKSk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2hhbmdlRnJhbWUoZGVsdGEsIGluY29taW5nSWR4KSB7XG5cdFx0XHRpZiAobW92aW5nKSByZXR1cm47XG5cdFx0XHRtb3ZpbmcgPSB0cnVlO1xuXG5cdFx0XHR2YXIgY3VycmVudEZyYW1lID0gaXRlbVdyYXBwZXIuz4AxKCcub24nKTtcblxuXHRcdFx0aWYgKCFkZWx0YSAmJiBjdXJyZW50RnJhbWUpIHtcblx0XHRcdFx0Ly8gcGFnZXIgY2xpY2sg4oCUIHJldHVybiBpZiBjbGlja2VkIG9uIFlBSFxuXHRcdFx0XHRpZiAoY3VycmVudEZyYW1lLmluZGV4KCkgPT09IGluY29taW5nSWR4KSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJtZXNzYWdlXCIpO1xuXHRcdFx0XHRcdG1vdmluZyA9IGZhbHNlO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmIChkZWx0YSkge1xuXHRcdFx0XHQvLyBjb25kaXRpb25hbGx5IHNldCBpbmNvbWluZ0lkeCB0byB3cmFwIGFyb3VuZFxuXHRcdFx0XHRpbmNvbWluZ0lkeCA9IGN1cnJlbnRGcmFtZS5pbmRleCgpICsgZGVsdGE7XG5cblx0XHRcdFx0aWYgKGluY29taW5nSWR4IDwgMClcblx0XHRcdFx0XHRpbmNvbWluZ0lkeCA9IGFsbEZyYW1lcy5sYXN0SWR4KCk7XG5cdFx0XHRcdGVsc2UgaWYgKGluY29taW5nSWR4ID49IGFsbEZyYW1lcy5sZW5ndGgpXG5cdFx0XHRcdFx0aW5jb21pbmdJZHggPSAwO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBjb25kaXRpb25hbGx5IGhpZGUgcHJldiBvciBuZXh0XG5cdFx0XHRpZiAoIW9wdGlvbnMuY3ljbGUpIHtcblx0XHRcdFx0aWYgKGluY29taW5nSWR4ID09PSAwKVxuXHRcdFx0XHRcdHByZXZCdXR0b24uaGlkZSgpO1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cHJldkJ1dHRvbi5zaG93KCk7XG5cblx0XHRcdFx0aWYgKGluY29taW5nSWR4ID09IGFsbEZyYW1lcy5sYXN0SWR4KCkpXG5cdFx0XHRcdFx0bmV4dEJ1dHRvbi5oaWRlKCk7XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRuZXh0QnV0dG9uLnNob3coKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gc2V0IHBhZ2VyIFlBSCBzdGF0ZVxuXHRcdFx0aWYgKG9wdGlvbnMucGFnZXIpIHtcblx0XHRcdFx0cGFnZXIuz4AoJy55YWgnKS5raWxsQ2xhc3MoJ3lhaCcpO1xuXHRcdFx0XHRwYWdlci5jaGlsZE5vZGVzW2luY29taW5nSWR4XS5hZGRDbGFzcygneWFoJyk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIHBhc3MgdG8gXCJzdWJjbGFzc2VzXCJcblx0XHRcdHZhciBpbmhlcml0YW5jZU9iamVjdCA9IHtcblx0XHRcdFx0ZWw6IGVsLFxuXHRcdFx0XHRjdXJyZW50RnJhbWU6IGN1cnJlbnRGcmFtZSxcblx0XHRcdFx0aW5jb21pbmdGcmFtZTogYWxsRnJhbWVzW2luY29taW5nSWR4XVxuXHRcdFx0fTtcblxuXHRcdFx0Ly8gY2hhbmdlIGZyYW1lOiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFNVQkNMQVNTRVMgRU5URVIgSEVSRSEhISEhICoqKioqKioqKioqKioqKioqKioqKioqKioqKipcblx0XHRcdGlmIChlbC5oYXNDbGFzcygncGktY3Jvc3NmYWRlcicpKSB7XG5cdFx0XHRcdM+ALmNyb3NzZmFkZXIuY2hhbmdlRnJhbWUoaW5oZXJpdGFuY2VPYmplY3QpO1xuXHRcdFx0fVxuXG5cdFx0XHRlbHNlIGlmIChlbC5oYXNDbGFzcygncGktcm90YXRvcicpKSB7XG5cdFx0XHRcdGluaGVyaXRhbmNlT2JqZWN0LnBhZ2VyQ2xpY2tlZCA9IGRlbHRhID8gZmFsc2UgOiB0cnVlO1xuXHRcdFx0XHRpbmhlcml0YW5jZU9iamVjdC5jeWNsZSA9IG9wdGlvbnMuY3ljbGU7XG5cdFx0XHRcdM+ALnJvdGF0b3IuY2hhbmdlRnJhbWUoaW5oZXJpdGFuY2VPYmplY3QpO1xuXHRcdFx0fVxuXG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0aWYoY3VycmVudEZyYW1lKSBjdXJyZW50RnJhbWUua2lsbENsYXNzKCdvbicpO1xuXHRcdFx0XHRpbmhlcml0YW5jZU9iamVjdC5pbmNvbWluZ0ZyYW1lLmFkZENsYXNzKCdvbicpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyB3YWl0IGJlZm9yZSByZS1lbmFibGluZ1xuXHRcdFx0dmFyIGR1cmF0aW9uID0gMTAwMDsgLy8gZGVmYXVsdCBmb3IgZmlyc3RSdW5cblxuXHRcdFx0aWYgKGN1cnJlbnRGcmFtZSkge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGR1cmF0aW9uID0gY3VycmVudEZyYW1lLmNzcygpLnRyYW5zaXRpb25EdXJhdGlvbi5zcGxpdChcIiwgXCIpLnJlZHVjZShmdW5jdGlvbihwcmV2LCBjdXJyZW50KXtcblx0XHRcdFx0XHRcdHJldHVybiBNYXRoLm1heChwYXJzZUZsb2F0KHByZXYpLCBwYXJzZUZsb2F0KGN1cnJlbnQpKTtcblx0XHRcdFx0XHR9KSAqIDEwMDA7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2F0Y2goZSkge1xuXHRcdFx0XHRcdM+ALkhBTC5zYXkoMCwgJ8+ALXJvdGF0b3IgbmVlZHMgeW91IHRvIHRyYW5zaXRpb24gYSBjc3MgdHJhbnNmb3JtIHRvIG1ha2UgeW91ciBpdGVtcyBtb3ZlLicpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdG1vdmluZyA9IGZhbHNlO1xuXHRcdFx0fSwgZHVyYXRpb24pO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHNob3coaWQpe1xuXHRcdHZhciBtZmQgPSDPgGQoaWQpO1xuXHRcdGlmIChtZmQuaGFzQ2xhc3MoJ3BpLW1vZGFsLW92ZXJsYXknKSkge1xuXHRcdFx0z4AubW9kYWxPdmVybGF5LnNob3coaWQpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGhpZGUoaWQpe1xuXHRcdHZhciBtZmQgPSDPgGQoaWQpO1xuXHRcdGlmIChtZmQuaGFzQ2xhc3MoJ3BpLW1vZGFsLW92ZXJsYXknKSkge1xuXHRcdFx0z4AubW9kYWxPdmVybGF5LmhpZGUoaWQsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKFwid2UganVzdCBoaWQgYW4gb3ZlcmxheVwiKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0z4AoJy5waS1tdWx0aS1mcmFtZS1kaXNwbGF5JykuZm9yRWFjaCjPgC5tdWx0aUZyYW1lRGlzcGxheS5zcGF3bik7XG5cdFx0z4Auc2V0VHJpZ2dlcnMoJ211bHRpLWZyYW1lLWRpc3BsYXknLCDPgC5tdWx0aUZyYW1lRGlzcGxheSk7XG5cdH1cblxuXHTPgC5tdWx0aUZyYW1lRGlzcGxheSA9IHtcblx0XHRzaG93OiBzaG93LFxuXHRcdGhpZGU6IGhpZGUsXG5cdFx0c3Bhd246IHNwYXduXG5cdH07XG5cblxuXHTPgC5tb2RzLnB1c2goaW5pdCk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdHZhciB5YWggPSB0cnVlO1xuXHR2YXIgbW92aW5nID0gZmFsc2U7XG5cdHZhciBDU1NfQlJPV1NFUl9ERUxBWV9IQUNLID0gMjU7XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHTPgC5jbGVhbihpbml0KTtcblxuXHRcdC8vIFNhZmFyaSBjaG9rZXMgb24gdGhlIGFuaW1hdGlvbiBoZXJlLCBzby4uLlxuXHRcdGlmIChuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ0Nocm9tZScpID09IC0xICYmIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignU2FmYXJpJykgIT0gLTEpe1xuXHRcdFx0z4AxKCdib2R5JykuYWRkKM+ALmNvbnRlbnRFbGVtZW50KCdzdHlsZScsIDAsIDAsICcucGktYWNjb3JkaW9uIC53cmFwcGVye3RyYW5zaXRpb246IG5vbmV9JykpO1xuXHRcdH1cblx0XHQvLyBHcm9zcy5cblxuXHRcdM+AKCcucGktYWNjb3JkaW9uJykuZm9yRWFjaChmdW5jdGlvbihhY2NvcmRpb24pe1xuXHRcdFx0dmFyIGNvbnRhaW5lciA9IM+ALmRpdignY29udGFpbmVyJywgbnVsbCwgYWNjb3JkaW9uLmlubmVySFRNTCk7XG5cdFx0XHRhY2NvcmRpb24uZmlsbChjb250YWluZXIpO1xuXHRcdFx0UGlBY2NvcmRpb24oY29udGFpbmVyKTtcblx0XHR9KTtcblxuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0eWFoID0gZmFsc2U7XG5cdFx0fSwgNTAwKTtcblx0fVxuXG5cdGZ1bmN0aW9uIFBpQWNjb3JkaW9uKGNvbnRhaW5lcil7XG5cdFx0Y29udGFpbmVyLs+AKCc6c2NvcGUgPiAuaXRlbScpLmZvckVhY2goZnVuY3Rpb24oaXRlbSl7XG5cdFx0XHR2YXIgdGl0bGVUZXh0ID0gaXRlbS5kYXRhc2V0LnRpdGxlO1xuXG5cdFx0XHR2YXIgdGl0bGUgPSDPgC5kaXYoJ3RpdGxlJywgbnVsbCwgdGl0bGVUZXh0KTtcblx0XHRcdHZhciB3cmFwcGVyID0gz4AuZGl2KCd3cmFwcGVyJyk7XG5cdFx0XHR2YXIgY29udGVudCA9IM+ALmRpdignY29udGVudCcsIG51bGwsIGl0ZW0uaW5uZXJIVE1MKTtcblxuXHRcdFx0d3JhcHBlci5maWxsKGNvbnRlbnQpO1xuXHRcdFx0aXRlbS5maWxsKFt0aXRsZSwgd3JhcHBlcl0pO1xuXHRcdFx0d3JhcHBlci5jc3Moe2hlaWdodDogMH0pO1xuXG5cdFx0XHR0aXRsZS5vbmNsaWNrID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0aWYgKCF5YWgpIHtcblx0XHRcdFx0XHRpZiAobW92aW5nKSByZXR1cm47XG5cdFx0XHRcdFx0bW92aW5nID0gdHJ1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChjb250YWluZXIuZGF0YXNldC5zaW5nbGUpIHtcblx0XHRcdFx0XHR2YXIgb3BlblNpYmxpbmdzID0gaXRlbS5zaWJsaW5ncygpLmZpbHRlcihmdW5jdGlvbihzaWIpe3JldHVybiBzaWIuaGFzQ2xhc3MoJ29uJyk7fSk7XG5cdFx0XHRcdFx0b3BlblNpYmxpbmdzLmZvckVhY2goZnVuY3Rpb24oc2libGluZyl7XG5cdFx0XHRcdFx0XHR0b2dnbGVJdGVtKHNpYmxpbmcpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdGlmIChpdGVtLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2EnKSByZXR1cm47XG5cdFx0XHRcdFx0dG9nZ2xlSXRlbShpdGVtKTtcblx0XHRcdFx0fSwgQ1NTX0JST1dTRVJfREVMQVlfSEFDSyk7XG5cdFx0XHR9O1xuXG5cdFx0XHRmdW5jdGlvbiB0b2dnbGVJdGVtKHRoaXNJdGVtKXtcblx0XHRcdFx0dmFyIHRoaXNXcmFwcGVyID0gdGhpc0l0ZW0uz4AxKCcud3JhcHBlcicpO1xuXHRcdFx0XHR2YXIgY29udGVudEhlaWdodCA9IHRoaXNXcmFwcGVyLs+AMSgnLmNvbnRlbnQnKS5vZmZzZXQoKS5oZWlnaHQgKyAncHgnO1xuXG5cdFx0XHRcdGlmICh0aGlzSXRlbS5oYXNDbGFzcygnb24nKSkge1xuXHRcdFx0XHRcdHRoaXNXcmFwcGVyLmNzcyh7aGVpZ2h0OiBjb250ZW50SGVpZ2h0fSk7XG5cdFx0XHRcdFx0dGhpc0l0ZW0ua2lsbENsYXNzKCdvbicpO1xuXHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdHRoaXNXcmFwcGVyLmNzcyh7aGVpZ2h0OiAwfSk7XG5cdFx0XHRcdFx0XHRtb3ZpbmcgPSBmYWxzZTtcblx0XHRcdFx0XHR9LCBDU1NfQlJPV1NFUl9ERUxBWV9IQUNLKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpdGVtLmFkZENsYXNzKCdvbicpO1xuXHRcdFx0XHRcdHRoaXNXcmFwcGVyLmNzcyh7aGVpZ2h0OiBjb250ZW50SGVpZ2h0fSk7XG5cblx0XHRcdFx0XHR2YXIgZHVyYXRpb24gPSBwYXJzZUZsb2F0KHRoaXNXcmFwcGVyLmNzcygpLnRyYW5zaXRpb25EdXJhdGlvbikgKiAxMDAwO1xuXHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdHRoaXNXcmFwcGVyLmNzcyh7aGVpZ2h0OiAnJ30pO1xuXHRcdFx0XHRcdFx0bW92aW5nID0gZmFsc2U7XG5cdFx0XHRcdFx0fSwgZHVyYXRpb24pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHZhciBpbm5lckNvbnRhaW5lcnMgPSBjb250ZW50Ls+AKCc6c2NvcGUgPiAuY29udGFpbmVyJyk7XG5cdFx0XHRpZiAoaW5uZXJDb250YWluZXJzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0aW5uZXJDb250YWluZXJzLmZvckVhY2goUGlBY2NvcmRpb24pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0z4AubW9kcy5wdXNoKGluaXQpO1xufSkoKTtcbiIsIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIM+ALXB1c2htZW51LmpzXG4gLy8gVE9ETzogIFVTQUdFIEFORCBBUEkgUkVGRVJFTkNFXG4gX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xuIERFUEVOREVOQ0lFUzpcblxuIEhBTC5qc1xuXG4gX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xuIERBVEEgQVRUUklCVVRFUzpcblxuIHNpZGU6IFtcImxlZnRcIiwgXCJyaWdodFwiXVxuIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cbiBNQVJLVVAgQU5EIERFRkFVTFRTOlxuXG5cdDxkaXYgY2xhc3M9XCJwaS1wdXNobWVudVwiIGlkPVwibXlQdXNoTWVudVwiPlxuXHRcdCA8dWw+XG5cdFx0XHQgPGxpPjxhIGhyZWY9XCIjXCI+Zm9vPC9hPjwvbGk+XG5cdFx0XHQgPGxpPjxhIGhyZWY9XCIjXCI+YmFyPC9hPjwvbGk+XG5cdFx0XHQgPGxpPjxhIGhyZWY9XCIjXCI+Z3Jvbms8L2E+PC9saT5cblx0XHRcdCA8bGk+PGEgaHJlZj1cIiNcIj5mbGVlYmxlczwvYT48L2xpPlxuXHRcdFx0IDxsaT48YSBocmVmPVwiI1wiPnNlcHVsdmVkYTwvYT48L2xpPlxuXHRcdCA8L3VsPlxuXHQ8L2Rpdj5cblxuZWxzZXdoZXJlLi4uXG5cbiA8YnV0dG9uIG9uY2xpY2s9XCLPgC1wdXNobWVudS5zaG93KCdteVB1c2hNZW51JylcIj5zaG93IG1lbnU8L2J1dHRvbj5cblxuIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cbiBHRU5FUkFURUQgSFRNTDpcblxuXHRcbiBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXG4gQVBJXG5cblxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuz4AucHVzaG1lbnUgPSAoZnVuY3Rpb24oKXtcblx0dmFyIGFsbFB1c2hNZW51cyA9IHt9O1xuXG5cdGZ1bmN0aW9uIGluaXQoKXtcblx0XHTPgCgnW2RhdGEtYXV0by1idXJnZXJdJykuZm9yRWFjaChmdW5jdGlvbihjb250YWluZXIpe1xuXHRcdFx0dmFyIGlkID0gY29udGFpbmVyLmdldEF0dHJpYnV0ZSgnZGF0YS1hdXRvLWJ1cmdlcicpO1xuXG5cdFx0XHR2YXIgYXV0b0J1cmdlciA9IM+AZChpZCkgfHwgz4AuZGl2KCdwaS1wdXNobWVudScsIGlkKTtcblx0XHRcdHZhciB1bCA9IGF1dG9CdXJnZXIuz4AxKCd1bCcpIHx8IM+ALnVsKCk7XG5cblx0XHRcdGNvbnRhaW5lci7PgCgnYVtocmVmXSwgYnV0dG9uJykuZm9yRWFjaChmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHRcdGlmICghYm9vbGVhbkF0dHJpYnV0ZVZhbHVlKG9iaiwgJ2RhdGEtYXV0by1idXJnZXItZXhjbHVkZScsIGZhbHNlKSkge1xuXHRcdFx0XHRcdHZhciBjbG9uZSA9IG9iai5jbG9uZU5vZGUodHJ1ZSk7XG5cdFx0XHRcdFx0Y2xvbmUuaWQgPSAnJztcblxuXHRcdFx0XHRcdGlmIChjbG9uZS50YWdOYW1lID09IFwiQlVUVE9OXCIpIHtcblx0XHRcdFx0XHRcdHZhciBhVGFnID0gz4Auc3JjRWxlbWVudCgnYScpO1xuXHRcdFx0XHRcdFx0YVRhZy5ocmVmID0gJyc7XG5cdFx0XHRcdFx0XHRhVGFnLmlubmVySFRNTCA9IGNsb25lLmlubmVySFRNTDtcblx0XHRcdFx0XHRcdGFUYWcub25jbGljayA9IGNsb25lLm9uY2xpY2s7XG5cdFx0XHRcdFx0XHRjbG9uZSA9IGFUYWc7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHVsLmFkZCjPgC5saSgwLCAwLCBjbG9uZSkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0YXV0b0J1cmdlci5hZGQodWwpO1xuXHRcdFx0z4AxKCdib2R5JykuYWRkKGF1dG9CdXJnZXIpO1xuXHRcdH0pO1xuXG5cdFx0z4AoXCIucGktcHVzaG1lbnVcIikuZm9yRWFjaChmdW5jdGlvbihlbCl7XG5cdFx0XHRhbGxQdXNoTWVudXNbZWwuaWRdID0gUHVzaE1lbnUoZWwpO1xuXHRcdH0pO1xuXG5cdFx0z4Auc2V0VHJpZ2dlcnMoJ3B1c2htZW51Jywgz4AucHVzaG1lbnUpO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2hvdyhvYmpJZCkge1xuXHRcdGFsbFB1c2hNZW51c1tvYmpJZF0uZXhwb3NlKCk7XG5cdH1cblxuXHQvLyBUT0RPOiBkaXNtaXNzIG9uIGNsaWNrP1xuXHQvLyB0aGlzIHdvcmtzOlxuXG5cdC8vz4AoJy5waS1wdXNobWVudSBsaSBhJykuZm9yRWFjaChmdW5jdGlvbihhKXtcblx0Ly9cdGEub25jbGljayA9IGZ1bmN0aW9uKCl7XG5cdC8vXHRcdHRoaXMucGFyZW50KCcucGktcHVzaG1lbnUnKS7PgDEoJy5waS1tb2RhbC1jbG9zZS1idXR0b24nKS5jbGljaygpO1xuXHQvL1x0XHRjb25zb2xlLmxvZyhcIm1lc3NhZ2VcIik7XG5cdC8vXHR9O1xuXHQvL30pO1xuXG5cblx0ZnVuY3Rpb24gUHVzaE1lbnUoZWwpIHtcblx0XHR2YXIgaHRtbCA9IM+AMSgnaHRtbCcpO1xuXHRcdHZhciBib2R5ID0gz4AxKCdib2R5Jyk7XG5cblx0XHR2YXIgb3ZlcmxheSA9IM+ALmRpdihcIm92ZXJsYXlcIik7XG5cdFx0dmFyIGNvbnRlbnQgPSDPgC5kaXYoJ2NvbnRlbnQnLCBudWxsLCBlbC7PgDEoJyonKSk7XG5cblx0XHR2YXIgc2lkZSA9IGVsLmdldEF0dHJpYnV0ZShcImRhdGEtc2lkZVwiKSB8fCBcInJpZ2h0XCI7XG5cblx0XHR2YXIgc2xlZCA9IM+ALmRpdihcInNsZWRcIik7XG5cdFx0c2xlZC5jc3Moc2lkZSwgMCk7XG5cblx0XHR2YXIgdG9wQmFyID0gz4AuZGl2KFwidG9wLWJhclwiKTtcblxuXHRcdHRvcEJhci5maWxsKM+ALm1vZGFsQ2xvc2VCdXR0b24oY2xvc2VNZSkpO1xuXHRcdHNsZWQuZmlsbChbdG9wQmFyLCBjb250ZW50XSk7XG5cblx0XHRvdmVybGF5LmZpbGwoc2xlZCk7XG5cdFx0ZWwuZmlsbChvdmVybGF5KTtcblxuXHRcdHNsZWQub25jbGljayA9IGZ1bmN0aW9uKGUpe1xuXHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHR9O1xuXG5cdFx0b3ZlcmxheS5vbmNsaWNrID0gY2xvc2VNZTtcblxuXHRcdM+ALmxpc3RlbihjbG9zZU1lLCAncmVzaXplJyk7XG5cblx0XHRmdW5jdGlvbiBjbG9zZU1lKGUpIHtcblx0XHRcdHZhciB0ID0gZS50YXJnZXQ7XG5cdFx0XHRpZiAodCA9PSBzbGVkIHx8IHQgPT0gdG9wQmFyKSByZXR1cm47XG5cblx0XHRcdGVsLmtpbGxDbGFzcyhcIm9uXCIpO1xuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRlbC5jc3Moe2Rpc3BsYXk6IFwibm9uZVwifSk7XG5cblx0XHRcdFx0Ym9keS5raWxsQ2xhc3MoXCJvdmVybGF5LW9uXCIpO1xuXHRcdFx0fSwgMzAwKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBleHBvc2VNZSgpe1xuXHRcdFx0Ym9keS5hZGRDbGFzcyhcIm92ZXJsYXktb25cIik7IC8vIGluIHRoZSBkZWZhdWx0IGNvbmZpZywga2lsbHMgYm9keSBzY3JvbGxpbmdcblxuXHRcdFx0ZWwuY3NzKHtcblx0XHRcdFx0ZGlzcGxheTogXCJibG9ja1wiLFxuXHRcdFx0XHR6SW5kZXg6IM+ALmhpZ2hlc3RaKClcblx0XHRcdH0pO1xuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRlbC5hZGRDbGFzcyhcIm9uXCIpO1xuXHRcdFx0fSwgMTApO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHRleHBvc2U6IGV4cG9zZU1lXG5cdFx0fTtcblx0fVxuXG5cdM+ALm1vZHMucHVzaChpbml0KTtcblxuXHRyZXR1cm4ge1xuXHRcdHNob3c6IHNob3dcblx0fTtcbn0pKCk7XG4iLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiDPgC1kaWFsb2cuanNcbiBVU0FHRSBBTkQgQVBJIFJFRkVSRU5DRVxuIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cbiBERVBFTkRFTkNJRVM6XG5cbiDPgC5qc1xuXG4gX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xuIERBVEEgQVRUUklCVVRFUzpcblxuIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cbiBNQVJLVVAgQU5EIERFRkFVTFRTOlxuXG4gPGRpdiBjbGFzcz1cIm5ld19tb2R1bGVcIj5cblxuIDwvZGl2PlxuXG4gX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xuIEdFTkVSQVRFRCBIVE1MOlxuXG4gPGRpdiBjbGFzcz1cIm5ld19tb2R1bGVcIj5cblxuIDwvZGl2PlxuXG4gX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xuIEFQSVxuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4oZnVuY3Rpb24oKXtcblx0z4AuZGlhbG9nID0ge1xuXHRcdHNob3c6IM+ALm1vZGFsT3ZlcmxheS5zaG93LFxuXHRcdHNwYXduOiBzcGF3bixcblx0XHRhY3Rpb25zOiB7fVxuXHR9O1xuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0z4AoJy5waS1kaWFsb2cnKS5mb3JFYWNoKM+ALmRpYWxvZy5zcGF3bik7XG5cdFx0z4Auc2V0VHJpZ2dlcnMoJ2RpYWxvZycsIM+ALm1vZGFsT3ZlcmxheSk7XG5cdH1cblxuXHRmdW5jdGlvbiBzcGF3bihlbCl7XG5cdFx0dmFyIGNvbnRlbnRCb3ggPSDPgC5kaXYoJ2NvbnRlbnQtYm94JywgMCwgZWwuaW5uZXJIVE1MKTtcblx0XHR2YXIgZGlhbG9nQm94ID0gz4AuZGl2KCdkaWFsb2ctYm94JywgMCwgY29udGVudEJveCk7XG5cdFx0ZWwuZmlsbChkaWFsb2dCb3gpO1xuXG5cdFx0aWYgKGVsLmRhdGFzZXQudGl0bGUpe1xuXHRcdFx0ZGlhbG9nQm94LnByZXBlbmQoz4AuZGl2KCd0aXRsZScsIDAsIGVsLmRhdGFzZXQudGl0bGUpKTtcblx0XHR9XG5cblx0XHRlbC7PgCgnLmJ1dHRvbnMgYnV0dG9uJykuZm9yRWFjaChmdW5jdGlvbihidXR0b24pe1xuXHRcdFx0YnV0dG9uLm9uY2xpY2sgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHR2YXIgYWN0aW9uID0gYnV0dG9uLmdldEF0dHJpYnV0ZSgncGktZGlhbG9nLWFjdGlvbicpO1xuXHRcdFx0XHRpZiAoYWN0aW9uKXtcblx0XHRcdFx0XHTPgC5kaWFsb2cuYWN0aW9uc1thY3Rpb25dKCk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdGlmICghYnV0dG9uLmhhc0F0dHJpYnV0ZSgnZGF0YS1ieXBhc3MnKSl7XG5cdFx0XHRcdGJ1dHRvbi5saXN0ZW4oZGlzbWlzcywgJ2NsaWNrJyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRpZiAoIWJvb2xlYW5BdHRyaWJ1dGVWYWx1ZShlbCwgJ2RhdGEtaW5saW5lJywgZmFsc2UpKSB7XG5cdFx0XHRlbC5hZGRDbGFzcygncGktbW9kYWwtb3ZlcmxheScpO1xuXHRcdFx0z4AubW9kYWxPdmVybGF5LnNwYXduKGVsKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBkaXNtaXNzKCl7XG5cdFx0XHRlbC7PgDEoJy5waS1tb2RhbC1jbG9zZS1idXR0b24nKS5jbGljaygpO1xuXHRcdH1cblx0fVxuXG5cblxuXHQvLyDPgC5tb2RzIGFyZSBsb2FkZWQgYWZ0ZXIgRE9NQ29udGVudExvYWRlZFxuXHTPgC5tb2RzLnB1c2goaW5pdCk7XG59KSgpOyIsInZhciBrdWIgPSAoZnVuY3Rpb24gKCkge1xuXHTPgC5saXN0ZW4oaW5pdCk7XG5cblx0dmFyIEhFQURFUl9IRUlHSFQ7XG5cdHZhciBodG1sLCBib2R5LCBtYWluTmF2LCBxdWlja3N0YXJ0QnV0dG9uLCB3aXNoRmllbGQ7XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHTPgC5jbGVhbihpbml0KTtcblxuXHRcdGh0bWwgPSDPgDEoJ2h0bWwnKTtcblx0XHRib2R5ID0gz4AxKCdib2R5Jyk7XG5cdFx0bWFpbk5hdiA9IM+AZChcIm1haW5OYXZcIik7XG5cdFx0d2lzaEZpZWxkID0gz4BkKCd3aXNoRmllbGQnKTtcblx0XHRIRUFERVJfSEVJR0hUID0gz4AxKCdoZWFkZXInKS5vZmZzZXQoKS5oZWlnaHQ7XG5cblx0XHRxdWlja3N0YXJ0QnV0dG9uID0gz4BkKCdxdWlja3N0YXJ0QnV0dG9uJyk7XG5cblx0XHRidWlsZElubGluZVRPQygpO1xuXG5cdFx0c2V0WUFIKCk7XG5cblxuXHRcdGFkanVzdEV2ZXJ5dGhpbmcoKTtcblxuXHRcdM+ALmxpc3RlbihhZGp1c3RFdmVyeXRoaW5nLCAncmVzaXplJyk7XG5cdFx0z4AubGlzdGVuKGFkanVzdEV2ZXJ5dGhpbmcsICdzY3JvbGwnKTtcblx0XHTPgC5saXN0ZW4oaGFuZGxlS2V5c3Ryb2tlcywgJ2tleWRvd24nKTtcblx0XHR3aXNoRmllbGQubGlzdGVuKGhhbmRsZUtleXN0cm9rZXMsICdrZXlkb3duJyk7XG5cblx0XHRkb2N1bWVudC5vbnVubG9hZCA9IGZ1bmN0aW9uKCl7XG5cdFx0XHTPgC5jbGVhbihhZGp1c3RFdmVyeXRoaW5nLCAncmVzaXplJyk7XG5cdFx0XHTPgC5jbGVhbihhZGp1c3RFdmVyeXRoaW5nLCAnc2Nyb2xsJyk7XG5cdFx0XHTPgC5jbGVhbihoYW5kbGVLZXlzdHJva2VzLCAna2V5ZG93bicpO1xuXHRcdFx0d2lzaEZpZWxkLmNsZWFuKGhhbmRsZUtleXN0cm9rZXMsICdrZXlkb3duJyk7XG5cdFx0fTtcblxuXHRcdM+ALmxpc3RlbihjbG9zZU9wZW5NZW51LCAncmVzaXplJyk7XG5cblx0XHRmdW5jdGlvbiBjbG9zZU9wZW5NZW51KCkge1xuXHRcdFx0aWYgKGh0bWwuaGFzQ2xhc3MoJ29wZW4tbmF2JykpIHRvZ2dsZU1lbnUoKTtcblx0XHR9XG5cblx0XHTPgCgnLmRyb3Bkb3duJykuZm9yRWFjaChmdW5jdGlvbihkcm9wZG93bikge1xuXHRcdFx0dmFyIHJlYWRvdXQgPSBkcm9wZG93bi7PgDEoJy5yZWFkb3V0Jyk7XG5cdFx0XHRyZWFkb3V0LmlubmVySFRNTCA9IGRyb3Bkb3duLs+AMSgnYScpLmlubmVySFRNTDtcblx0XHRcdHJlYWRvdXQub25jbGljayA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0ZHJvcGRvd24udG9nZ2xlQ2xhc3MoJ29uJyk7XG5cdFx0XHRcdM+ALmxpc3RlbihjbG9zZU9wZW5Ecm9wZG93biwgJ2NsaWNrJyk7XG5cblx0XHRcdFx0ZnVuY3Rpb24gY2xvc2VPcGVuRHJvcGRvd24oZSkge1xuXHRcdFx0XHRcdGlmIChkcm9wZG93bi5oYXNDbGFzcygnb24nKSAmJiAhKGRyb3Bkb3duV2FzQ2xpY2tlZChlKSkpIHtcblx0XHRcdFx0XHRcdM+ALmNsZWFuKGNsb3NlT3BlbkRyb3Bkb3duLCAnY2xpY2snKTtcblx0XHRcdFx0XHRcdGRyb3Bkb3duLmtpbGxDbGFzcygnb24nKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmdW5jdGlvbiBkcm9wZG93bldhc0NsaWNrZWQoZSkge1xuXHRcdFx0XHRcdHJldHVybiBlLnRhcmdldC5pc0hlaXJPZkNsYXNzKCdkcm9wZG93bicpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH0pO1xuXG5cdFx0c2V0SW50ZXJ2YWwoc2V0Rm9vdGVyVHlwZSwgMTApO1xuXHR9XG5cblx0dmFyIHRvY0NvdW50ID0gMDtcblxuXHRmdW5jdGlvbiBidWlsZElubGluZVRPQygpIHtcblx0XHR2YXIgZG9jc0NvbnRlbnQgPSDPgGQoJ2RvY3NDb250ZW50Jyk7XG5cdFx0dmFyIHBhZ2VUT0MgPSDPgGQoJ3BhZ2VUT0MnKTtcblxuXHRcdGlmIChwYWdlVE9DKSB7XG5cdFx0XHR2YXIgaGVhZGVycyA9IGRvY3NDb250ZW50LmtpZHMoJyNwYWdlVE9DLCBoMSwgaDIsIGgzLCBoNCwgaDUsIGg2Jyk7XG5cdFx0XHRoZWFkZXJzLnNwbGljZSgwLCBoZWFkZXJzLmluZGV4T2YocGFnZVRPQykgKyAxKTtcblxuXHRcdFx0dmFyIHRvYyA9IM+ALnVsKCk7XG5cdFx0XHRwYWdlVE9DLmFkZCh0b2MpO1xuXG5cdFx0XHRoZWFkZXJzLmZvckVhY2goZnVuY3Rpb24gKGhlYWRlcikge1xuXHRcdFx0XHR2YXIgYW5jaG9yTmFtZSA9ICdwYWdlVE9DJyArIHRvY0NvdW50Kys7XG5cblx0XHRcdFx0dmFyIGxpbmsgPSDPgC5jb250ZW50RWxlbWVudCgnYScsIDAsIDAsIGhlYWRlci5pbm5lckhUTUwpO1xuXHRcdFx0XHRsaW5rLmhyZWYgPSAnIycgKyBhbmNob3JOYW1lO1xuXHRcdFx0XHRsaW5rLmFkZENsYXNzKGhlYWRlci50YWdOYW1lKTtcblxuXHRcdFx0XHR2YXIgYW5jaG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuXHRcdFx0XHRhbmNob3IuYWRkQ2xhc3MoJ3BhZ2VBbmNob3InKTtcblx0XHRcdFx0YW5jaG9yLm5hbWUgPSBhbmNob3JOYW1lO1xuXHRcdFx0XHRkb2NzQ29udGVudC5pbnNlcnRCZWZvcmUoYW5jaG9yLCBoZWFkZXIpO1xuXG5cdFx0XHRcdHRvYy5hZGQoz4AubGkoMCwgMCwgbGluaykpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gc2V0WUFIKCkge1xuXHRcdHZhciBwYXRobmFtZSA9IGxvY2F0aW9uLmhyZWY7XG5cblx0XHR2YXIgY3VycmVudExpbmsgPSBudWxsO1xuXG5cdFx0z4BkKCdkb2NzVG9jJykuz4AoJ2EnKS5mb3JFYWNoKGZ1bmN0aW9uIChsaW5rKSB7XG5cdFx0XHRpZiAocGF0aG5hbWUuaW5kZXhPZihsaW5rLmhyZWYpICE9PSAtMSkge1xuXHRcdFx0XHRjdXJyZW50TGluayA9IGxpbms7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRpZiAoY3VycmVudExpbmspIHtcblx0XHRcdGN1cnJlbnRMaW5rLnBhcmVudHMoJ2Rpdi5pdGVtJykuZm9yRWFjaChmdW5jdGlvbiAocGFyZW50KSB7XG5cdFx0XHRcdHBhcmVudC7PgDEoJy50aXRsZScpLmNsaWNrKCk7XG5cdFx0XHRcdGN1cnJlbnRMaW5rLmFkZENsYXNzKCd5YWgnKTtcblx0XHRcdFx0Y3VycmVudExpbmsuaHJlZiA9ICcnO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gc2V0Rm9vdGVyVHlwZSgpIHtcblx0XHRpZiAoaHRtbC5pZCA9PSBcImRvY3NcIikge1xuXHRcdFx0dmFyIGJvZHlIZWlnaHQgPSDPgGQoJ2hlcm8nKS5vZmZzZXQoKS5oZWlnaHQgKyDPgGQoJ2VuY3ljbG9wZWRpYScpLm9mZnNldCgpLmhlaWdodDtcblx0XHRcdHZhciBmb290ZXIgPSDPgDEoJ2Zvb3RlcicpO1xuXHRcdFx0dmFyIGZvb3RlckhlaWdodCA9IGZvb3Rlci5vZmZzZXQoKS5oZWlnaHQ7XG5cdFx0XHRib2R5LmNsYXNzT25Db25kaXRpb24oJ2ZpeGVkJywgd2luZG93LmlubmVySGVpZ2h0IC0gZm9vdGVySGVpZ2h0ID4gYm9keUhlaWdodCk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gYWRqdXN0RXZlcnl0aGluZygpIHtcblx0XHRpZiAoIWh0bWwuaGFzQ2xhc3MoJ29wZW4tbmF2JykpIEhFQURFUl9IRUlHSFQgPSDPgDEoJ2hlYWRlcicpLm9mZnNldCgpLmhlaWdodDtcblx0XHRodG1sLmNsYXNzT25Db25kaXRpb24oJ2ZsaXAtbmF2Jywgd2luZG93LnBhZ2VZT2Zmc2V0ID4gMCk7XG5cdH1cblxuXHRmdW5jdGlvbiB0b2dnbGVNZW51KCkge1xuXHRcdGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IDgwMCkge1xuXHRcdFx0z4AucHVzaG1lbnUuc2hvdygncHJpbWFyeScpO1xuXHRcdH1cblxuXHRcdGVsc2Uge1xuXHRcdFx0dmFyIG5ld0hlaWdodCA9IEhFQURFUl9IRUlHSFQ7XG5cblx0XHRcdGlmICghaHRtbC5oYXNDbGFzcygnb3Blbi1uYXYnKSkge1xuXHRcdFx0XHRuZXdIZWlnaHQgPSBtYWluTmF2Lm9mZnNldCgpLmhlaWdodDtcblx0XHRcdH1cblxuXHRcdFx0z4AxKCdoZWFkZXInKS5jc3Moe2hlaWdodDogcHgobmV3SGVpZ2h0KX0pO1xuXHRcdH1cblxuXHRcdGh0bWwudG9nZ2xlQ2xhc3MoJ29wZW4tbmF2Jyk7XG5cdH1cblxuXHRmdW5jdGlvbiBzdWJtaXRXaXNoKHRleHRmaWVsZCkge1xuXHRcdHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKFwiaHR0cHM6Ly9naXRodWIuY29tL2t1YmVybmV0ZXMva3ViZXJuZXRlcy5naXRodWIuaW8vaXNzdWVzL25ldz90aXRsZT1JJTIwd2lzaCUyMFwiICtcblx0XHRcdHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArIFwiJTIwXCIgKyB0ZXh0ZmllbGQudmFsdWUgKyBcIiZib2R5PUklMjB3aXNoJTIwXCIgK1xuXHRcdFx0d2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgXCIlMjBcIiArIHRleHRmaWVsZC52YWx1ZSk7XG5cblx0XHR0ZXh0ZmllbGQudmFsdWUgPSAnJztcblx0XHR0ZXh0ZmllbGQuYmx1cigpO1xuXHR9XG5cblx0ZnVuY3Rpb24gaGFuZGxlS2V5c3Ryb2tlcyhlKSB7XG5cdFx0c3dpdGNoIChlLndoaWNoKSB7XG5cdFx0XHRjYXNlIDEzOiB7XG5cdFx0XHRcdGlmIChlLmN1cnJlbnRUYXJnZXQgPT09IHdpc2hGaWVsZCkge1xuXHRcdFx0XHRcdHN1Ym1pdFdpc2god2lzaEZpZWxkKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblxuXHRcdFx0Y2FzZSAyNzoge1xuXHRcdFx0XHRpZiAoaHRtbC5oYXNDbGFzcygnb3Blbi1uYXYnKSkge1xuXHRcdFx0XHRcdHRvZ2dsZU1lbnUoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdHRvZ2dsZU1lbnU6IHRvZ2dsZU1lbnVcblx0fTtcbn0pKCk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
