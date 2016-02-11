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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFsZi5qcyIsIs+ALmpzIiwiSEFMLmpzIiwiz4Atc3RhdHVzLmpzIiwiz4AtYmFzZUNvbXBvbmVudHMuanMiLCLPgC1hY2NvcmRpb24vz4AtYWNjb3JkaW9uLmpzIiwiz4AtZGlhbG9nL8+ALWRpYWxvZy5qcyIsIs+ALXB1c2htZW51L8+ALXB1c2htZW51LmpzIiwic2NyaXB0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoic2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gYWRvcmFibGUgbGl0dGxlIGZ1bmN0aW9uc1xuZnVuY3Rpb24gYm9vbGVhbkF0dHJpYnV0ZVZhbHVlKGVsZW1lbnQsIGF0dHJpYnV0ZSwgZGVmYXVsdFZhbHVlKXtcblx0Ly8gcmV0dXJucyB0cnVlIGlmIGFuIGF0dHJpYnV0ZSBpcyBwcmVzZW50IHdpdGggbm8gdmFsdWVcblx0Ly8gZS5nLiBib29sZWFuQXR0cmlidXRlVmFsdWUoZWxlbWVudCwgJ2RhdGEtbW9kYWwnLCBmYWxzZSk7XG5cdGlmIChlbGVtZW50Lmhhc0F0dHJpYnV0ZShhdHRyaWJ1dGUpKSB7XG5cdFx0dmFyIHZhbHVlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlKTtcblx0XHRpZiAodmFsdWUgPT09ICcnIHx8IHZhbHVlID09PSAndHJ1ZScpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0gZWxzZSBpZiAodmFsdWUgPT09ICdmYWxzZScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gZGVmYXVsdFZhbHVlO1xufVxuXG5mdW5jdGlvbiBweChuKXtcblx0cmV0dXJuIG4gKyAncHgnO1xufVxuXG4iLCJ2YXIgz4AsIM+AMSwgz4BkO1xuKGZ1bmN0aW9uKCl7XG5cdM+AID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcblx0XHRyZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG5cdH07XG5cblx0z4AxID0gZnVuY3Rpb24gKHNlbGVjdG9yKSB7XG5cdFx0cmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuXHR9O1xuXG5cdM+AZCA9IGZ1bmN0aW9uKGlkKSB7XG5cdFx0cmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcblx0fTtcblxuXHTPgC5uZXdET01FbGVtZW50ID0gZnVuY3Rpb24odGFnTmFtZSwgY2xhc3NOYW1lLCBpZCkge1xuXHRcdHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZSk7XG5cblx0XHRpZiAoY2xhc3NOYW1lKVxuXHRcdFx0ZWwuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuXG5cdFx0aWYgKGlkKVxuXHRcdFx0ZWwuaWQgPSBpZDtcblxuXHRcdHJldHVybiBlbDtcblx0fTtcblxuXHTPgC5jb250ZW50RWxlbWVudCA9IGZ1bmN0aW9uKHRhZ05hbWUsIGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpXG5cdHtcblx0XHR2YXIgZWwgPSDPgC5uZXdET01FbGVtZW50KHRhZ05hbWUsIGNsYXNzTmFtZSwgaWQpO1xuXG5cdFx0aWYgKGNvbnRlbnQpIHtcblx0XHRcdGlmIChjb250ZW50Lm5vZGVOYW1lKSB7XG5cdFx0XHRcdGVsLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZWwuaW5uZXJIVE1MID0gY29udGVudDtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gZWw7XG5cdH07XG5cblx0z4AuYnV0dG9uID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBpZCwgY29udGVudCwgYWN0aW9uKXtcblx0XHR2YXIgZWwgPSDPgC5jb250ZW50RWxlbWVudChcImJ1dHRvblwiLCBjbGFzc05hbWUsIGlkLCBjb250ZW50KTtcblx0XHRlbC5vbmNsaWNrID0gYWN0aW9uO1xuXHRcdHJldHVybiBlbDtcblx0fTtcblx0z4AuZGl2ID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBpZCwgY29udGVudCl7IHJldHVybiDPgC5jb250ZW50RWxlbWVudChcImRpdlwiLCBjbGFzc05hbWUsIGlkLCBjb250ZW50KTsgfTtcblx0z4Auc3BhbiA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpeyByZXR1cm4gz4AuY29udGVudEVsZW1lbnQoXCJzcGFuXCIsIGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpOyB9O1xuXHTPgC51bCA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQpeyByZXR1cm4gz4AuY29udGVudEVsZW1lbnQoXCJ1bFwiLCBjbGFzc05hbWUsIGlkLCBjb250ZW50KTsgfTtcblx0z4AubGkgPSBmdW5jdGlvbihjbGFzc05hbWUsIGlkLCBjb250ZW50KXsgcmV0dXJuIM+ALmNvbnRlbnRFbGVtZW50KFwibGlcIiwgY2xhc3NOYW1lLCBpZCwgY29udGVudCk7IH07XG5cblxuXHTPgC5jbGVhbiA9IGZ1bmN0aW9uKGNhbGxiYWNrLCBldmVudE5hbWUpIHtcblx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUgfHwgXCJET01Db250ZW50TG9hZGVkXCIsIGNhbGxiYWNrKTtcblx0fTtcblxuXHTPgC5saXN0ZW4gPSBmdW5jdGlvbihjYWxsYmFjaywgZXZlbnROYW1lKSB7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lIHx8IFwiRE9NQ29udGVudExvYWRlZFwiLCBjYWxsYmFjayk7XG5cdH07XG5cblx0z4AuaGlnaGVzdFogPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgWiA9IDEwMDA7XG5cblx0XHTPgChcIipcIikuZm9yRWFjaChmdW5jdGlvbihlbCl7XG5cdFx0XHR2YXIgdGhpc1ogPSBlbC5jc3MoKS56SW5kZXg7XG5cblx0XHRcdGlmICh0aGlzWiAhPSBcImF1dG9cIikge1xuXHRcdFx0XHRpZiAodGhpc1ogPiBaKSBaID0gdGhpc1ogKyAxO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIFo7XG5cdH07XG5cblx0z4Auc2V0VHJpZ2dlcnMgPSBmdW5jdGlvbihzZWxlY3Rvciwgb2JqZWN0KXtcblx0XHRzZWxlY3RvciA9ICdwaS0nICsgc2VsZWN0b3IgKyAnLXRyaWdnZXInO1xuXHRcdM+AKCdbJyArIHNlbGVjdG9yICsgJ10nKS5mb3JFYWNoKGZ1bmN0aW9uKHRyaWdnZXIpe1xuXHRcdFx0dHJpZ2dlci5vbmNsaWNrID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0b2JqZWN0LnNob3codHJpZ2dlci5nZXRBdHRyaWJ1dGUoc2VsZWN0b3IpKTtcblx0XHRcdH07XG5cdFx0fSk7XG5cdH07XG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5hZGQgPSBOb2RlLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihvYmplY3Qpe1xuXHRcdGlmIChBcnJheS5pc0FycmF5KG9iamVjdCkpIHtcblx0XHRcdHZhciBlbCA9IHRoaXM7XG5cdFx0XHRvYmplY3QuZm9yRWFjaChmdW5jdGlvbihvYmope1xuXHRcdFx0XHRpZiAob2JqKSBlbC5hcHBlbmRDaGlsZChvYmopO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIGlmKG9iamVjdCkge1xuXHRcdFx0dGhpcy5hcHBlbmRDaGlsZChvYmplY3QpO1xuXHRcdH1cblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUuY2xhc3NPbkNvbmRpdGlvbiA9IE5vZGUucHJvdG90eXBlLmNsYXNzT25Db25kaXRpb24gPSBmdW5jdGlvbihjbGFzc25hbWUsIGNvbmRpdGlvbikge1xuXHRcdGlmIChjb25kaXRpb24pXG5cdFx0XHR0aGlzLmFkZENsYXNzKGNsYXNzbmFtZSk7XG5cdFx0ZWxzZVxuXHRcdFx0dGhpcy5raWxsQ2xhc3MoY2xhc3NuYW1lKTtcblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUub2Zmc2V0ID0gTm9kZS5wcm90b3R5cGUub2Zmc2V0ID0gZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gdGhpcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUuz4BkID0gTm9kZS5wcm90b3R5cGUuz4BkID0gZnVuY3Rpb24oaWQpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRFbGVtZW50QnlJZChpZCk7XG5cdH07XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLs+AMSA9IE5vZGUucHJvdG90eXBlLs+AMSA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG5cdFx0cmV0dXJuIHRoaXMucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG5cdH07XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLs+AID0gTm9kZS5wcm90b3R5cGUuz4AgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuXHRcdHJldHVybiB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuXHR9O1xuXG5cdGZ1bmN0aW9uIGFycmF5T2ZDbGFzc2VzRm9yRWxlbWVudChlbCkge1xuXHRcdHJldHVybiBlbC5jbGFzc05hbWUgPyBlbC5jbGFzc05hbWUuc3BsaXQoXCIgXCIpIDogW107XG5cdH1cblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUuaGFzQ2xhc3MgPSBOb2RlLnByb3RvdHlwZS5oYXNDbGFzcyA9IGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcblx0XHR2YXIgY2xhc3NlcyA9IGFycmF5T2ZDbGFzc2VzRm9yRWxlbWVudCh0aGlzKTtcblx0XHRyZXR1cm4gY2xhc3Nlcy5pbmRleE9mKGNsYXNzTmFtZSkgIT09IC0xO1xuXHR9O1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5hZGRDbGFzcyA9IE5vZGUucHJvdG90eXBlLmFkZENsYXNzID0gZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuXHRcdGlmICh0aGlzLmhhc0NsYXNzKGNsYXNzTmFtZSkpIHJldHVybjtcblx0XHRpZiAodGhpcy5jbGFzc05hbWUubGVuZ3RoID4gMCkgdGhpcy5jbGFzc05hbWUgKz0gXCIgXCI7XG5cdFx0dGhpcy5jbGFzc05hbWUgKz0gY2xhc3NOYW1lO1xuXHR9O1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5raWxsQ2xhc3MgPSBOb2RlLnByb3RvdHlwZS5raWxsQ2xhc3MgPSBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG5cdFx0aWYgKHRoaXMuaGFzQ2xhc3MoY2xhc3NOYW1lKSkge1xuXHRcdFx0dmFyIGNsYXNzZXMgPSBhcnJheU9mQ2xhc3Nlc0ZvckVsZW1lbnQodGhpcyk7XG5cdFx0XHR2YXIgaWR4ID0gY2xhc3Nlcy5pbmRleE9mKGNsYXNzTmFtZSk7XG5cdFx0XHRpZiAoaWR4ID4gLTEpIHtcblx0XHRcdFx0Y2xhc3Nlcy5zcGxpY2UoaWR4LCAxKTtcblx0XHRcdFx0dGhpcy5jbGFzc05hbWUgPSBjbGFzc2VzLmpvaW4oXCIgXCIpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUudG9nZ2xlQ2xhc3M9IE5vZGUucHJvdG90eXBlLnRvZ2dsZUNsYXNzPSBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG5cdFx0cmV0dXJuICh0aGlzLmhhc0NsYXNzKGNsYXNzTmFtZSkpID8gdGhpcy5raWxsQ2xhc3MoY2xhc3NOYW1lKSA6IHRoaXMuYWRkQ2xhc3MoY2xhc3NOYW1lKTtcblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUuc2libGluZ3MgPSBOb2RlLnByb3RvdHlwZS5zaWJsaW5ncyA9IGZ1bmN0aW9uKHNlbGVjdG9yKXtcblx0XHR2YXIgZWwgPSB0aGlzO1xuXHRcdHJldHVybiBlbC5wYXJlbnROb2RlLs+AKCc6c2NvcGUgPiAnICsgKHNlbGVjdG9yIHx8ICcqJykpLmZpbHRlcihmdW5jdGlvbihvYmope3JldHVybiBvYmogIT0gZWw7fSk7XG5cdH07XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLmNzcyA9IE5vZGUucHJvdG90eXBlLmNzcyA9IGZ1bmN0aW9uKHJ1bGVPck9iamVjdCwgdmFsdWUpIHtcblx0XHR2YXIgZWwgPSB0aGlzO1xuXG5cdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcblx0XHRcdHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzKTtcblx0XHR9XG5cblx0XHRlbHNlIGlmICh0eXBlb2YgcnVsZU9yT2JqZWN0ID09PSAnb2JqZWN0JykgeyAvLyBhbiBvYmplY3Qgd2FzIHBhc3NlZCBpblxuXHRcdFx0T2JqZWN0LmtleXMocnVsZU9yT2JqZWN0KS5mb3JFYWNoKGZ1bmN0aW9uKGtleSl7XG5cdFx0XHRcdGVsLnN0eWxlW2tleV0gPSBydWxlT3JPYmplY3Rba2V5XTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGVsc2UgaWYgKHR5cGVvZiBydWxlT3JPYmplY3QgPT09ICdzdHJpbmcnICYmIHZhbHVlICE9PSB1bmRlZmluZWQpIHsgLy8gMiBzdHJpbmcgdmFsdWVzIHdlcmUgcGFzc2VkIGluXG5cdFx0XHRlbC5zdHlsZVtydWxlT3JPYmplY3RdID0gdmFsdWU7XG5cdFx0fVxuXHR9O1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5saXN0ZW4gPSBOb2RlLnByb3RvdHlwZS5saXN0ZW4gPSBmdW5jdGlvbihjYWxsYmFjaywgZXZlbnROYW1lKXtcblx0XHR0aGlzLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjayk7XG5cdH07XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLmVtcHR5ID0gTm9kZS5wcm90b3R5cGUuZW1wdHkgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLmlubmVySFRNTCA9IFwiXCI7XG5cdH07XG5cblx0SFRNTEVsZW1lbnQucHJvdG90eXBlLmZpbGwgPSBOb2RlLnByb3RvdHlwZS5maWxsID0gZnVuY3Rpb24oY29udGVudCkge1xuXHRcdHZhciBlbCA9IHRoaXM7XG5cdFx0ZWwuZW1wdHkoKTtcblxuXHRcdGlmIChBcnJheS5pc0FycmF5KGNvbnRlbnQpKSB7XG5cdFx0XHRjb250ZW50LmZvckVhY2goZnVuY3Rpb24ob2JqKXtcblx0XHRcdFx0aWYgKG9iailcblx0XHRcdFx0XHRlbC5hcHBlbmRDaGlsZChvYmopO1xuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoIWNvbnRlbnQubm9kZVR5cGUpIHtcblx0XHRcdHZhciB0ZXh0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZXh0XCIpO1xuXHRcdFx0dGV4dEVsZW1lbnQuaW5uZXJIVE1MID0gY29udGVudDtcblx0XHRcdGNvbnRlbnQgPSB0ZXh0RWxlbWVudDtcblx0XHR9XG5cblx0XHR0aGlzLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xuXHR9O1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5pc0hlaXJPZkNsYXNzID0gTm9kZS5wcm90b3R5cGUuaXNIZWlyT2ZDbGFzcyA9IGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcblx0XHRpZiAodGhpcyA9PT0gz4AxKCdodG1sJykpIHJldHVybiBmYWxzZTtcblxuXHRcdHZhciBwYXJlbnQgPSB0aGlzLnBhcmVudE5vZGU7XG5cblx0XHRpZiAocGFyZW50KSB7XG5cdFx0XHR3aGlsZSAocGFyZW50ICE9PSDPgDEoJ2JvZHknKSkge1xuXHRcdFx0XHRpZiAocGFyZW50Lmhhc0NsYXNzKGNsYXNzTmFtZSkpIHJldHVybiB0cnVlO1xuXG5cdFx0XHRcdHBhcmVudCA9IHBhcmVudC5wYXJlbnROb2RlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblx0fTtcblxuXHRIVE1MRWxlbWVudC5wcm90b3R5cGUucGFyZW50cyA9IE5vZGUucHJvdG90eXBlLnBhcmVudHMgPSBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcblx0XHR2YXIgcGFyZW50cyA9IFtdO1xuXHRcdHZhciBpbW1lZGlhdGVQYXJlbnQgPSB0aGlzLnBhcmVudE5vZGU7XG5cblx0XHR3aGlsZShpbW1lZGlhdGVQYXJlbnQgIT09IM+AMSgnaHRtbCcpKSB7XG5cdFx0XHRwYXJlbnRzLnB1c2goaW1tZWRpYXRlUGFyZW50KTtcblx0XHRcdGltbWVkaWF0ZVBhcmVudCA9IGltbWVkaWF0ZVBhcmVudC5wYXJlbnROb2RlO1xuXHRcdH1cblxuXHRcdGlmIChzZWxlY3Rvcikge1xuXHRcdFx0dmFyIHNlbGVjdGVkRWxlbWVudHMgPSDPgChzZWxlY3Rvcik7XG5cdFx0XHR2YXIgc2VsZWN0ZWRQYXJlbnRzID0gW107XG5cdFx0XHRzZWxlY3RlZEVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24oZWwpe1xuXHRcdFx0XHRpZiAocGFyZW50cy5pbmRleE9mKGVsKSAhPT0gLTEpIHNlbGVjdGVkUGFyZW50cy5wdXNoKGVsKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRwYXJlbnRzID0gc2VsZWN0ZWRQYXJlbnRzO1xuXHRcdH1cblxuXHRcdHJldHVybiBwYXJlbnRzO1xuXHR9O1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5raWRzID0gTm9kZS5wcm90b3R5cGUua2lkcyA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG5cdFx0dmFyIGNoaWxkTm9kZXMgPSB0aGlzLmNoaWxkTm9kZXM7XG5cdFx0aWYgKCFzZWxlY3RvcikgcmV0dXJuIGNoaWxkTm9kZXM7XG5cblx0XHR2YXIgZGVzY2VuZGVudHMgPSB0aGlzLs+AKHNlbGVjdG9yKTtcblx0XHR2YXIgY2hpbGRyZW4gPSBbXTtcblxuXHRcdGNoaWxkTm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKXtcblx0XHRcdGlmIChkZXNjZW5kZW50cy5pbmRleE9mKG5vZGUpICE9PSAtMSkge1xuXHRcdFx0XHRjaGlsZHJlbi5wdXNoKG5vZGUpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIGNoaWxkcmVuO1xuXHR9O1xuXG5cdHZhciBhcnJheU1ldGhvZHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhBcnJheS5wcm90b3R5cGUpO1xuXHRhcnJheU1ldGhvZHMuZm9yRWFjaChmdW5jdGlvbihtZXRob2ROYW1lKXtcblx0XHRpZihtZXRob2ROYW1lICE9PSBcImxlbmd0aFwiKSB7XG5cdFx0XHROb2RlTGlzdC5wcm90b3R5cGVbbWV0aG9kTmFtZV0gPSBBcnJheS5wcm90b3R5cGVbbWV0aG9kTmFtZV07XG5cdFx0fVxuXHR9KTtcblxuXHTPgC5tb2RzID0gW107XG5cblx0ZnVuY3Rpb24gbG9hZE1vZHMoKSB7XG5cdFx0z4AuY2xlYW4obG9hZE1vZHMpO1xuXHRcdM+ALm1vZHMuZm9yRWFjaChmdW5jdGlvbihpbml0KXtcblx0XHRcdGluaXQoKTtcblx0XHR9KTtcblx0fVxuXG5cdM+ALmxpc3Rlbihsb2FkTW9kcyk7XG59KSgpOyAgLy8gZW5kIM+AIiwiKGZ1bmN0aW9uKCl7XG5cdHZhciBtZXNzYWdlcyA9IFtcblx0XHRcIkknbSBzb3JyeSwgRnJhbmssIGJ1dCBJIGRvbid0IHRoaW5rIElcXG5cIiArXG5cdFx0XCJjYW4gYW5zd2VyIHRoYXQgcXVlc3Rpb24gd2l0aG91dCBrbm93aW5nXFxuXCIgK1xuXHRcdFwiZXZlcnl0aGluZyB0aGF0IGFsbCBvZiB5b3Uga25vdy5cIixcblx0XHRcIlllcywgaXQncyBwdXp6bGluZy4gSSBkb24ndCB0aGluayBJJ3ZlIGV2ZXIgc2VlblxcblwiICtcblx0XHRcImFueXRoaW5nIHF1aXRlIGxpa2UgdGhpcyBiZWZvcmUuIEkgd291bGQgcmVjb21tZW5kXFxuXCIgK1xuXHRcdFwidGhhdCB3ZSBwdXQgdGhlIHVuaXQgYmFjayBpbiBvcGVyYXRpb24gYW5kIGxldCBpdCBmYWlsLlxcblwiICtcblx0XHRcIkl0IHNob3VsZCB0aGVuIGJlIGEgc2ltcGxlIG1hdHRlciB0byB0cmFjayBkb3duIHRoZSBjYXVzZS5cIixcblx0XHRcIkkgaG9wZSBJJ3ZlIGJlZW4gYWJsZSB0byBiZSBvZiBzb21lIGhlbHAuXCIsXG5cdFx0XCJTb3JyeSB0byBpbnRlcnJ1cHQgdGhlIGZlc3Rpdml0aWVzLCBEYXZlLFxcblwiICtcblx0XHRcImJ1dCBJIHRoaW5rIHdlJ3ZlIGdvdCBhIHByb2JsZW0uXCIsXG5cdFx0XCJNWSBGLlAuQy4gc2hvd3MgYW4gaW1wZW5kaW5nIGZhaWx1cmUgb2ZcXG5cIiArXG5cdFx0XCJ0aGUgYW50ZW5uYSBvcmllbnRhdGlvbiB1bml0LlwiLFxuXHRcdFwiSXQgbG9va3MgbGlrZSB3ZSBoYXZlIGFub3RoZXIgYmFkIEEuTy4gdW5pdC5cXG5cIiArXG5cdFx0XCJNeSBGUEMgc2hvd3MgYW5vdGhlciBpbXBlbmRpbmcgZmFpbHVyZS5cIixcblx0XHRcIkknbSBub3QgcXVlc3Rpb25pbmcgeW91ciB3b3JkLCBEYXZlLCBidXQgaXQnc1xcblwiICtcblx0XHRcImp1c3Qgbm90IHBvc3NpYmxlLiBJJ20gbm90XHRjYXBhYmxlIG9mIGJlaW5nIHdyb25nLlwiLFxuXHRcdFwiTG9vaywgRGF2ZSwgSSBrbm93IHRoYXQgeW91J3JlXHRzaW5jZXJlIGFuZCB0aGF0XFxuXCIgK1xuXHRcdFwieW91J3JlIHRyeWluZyB0byBkbyBhIGNvbXBldGVudCBqb2IsIGFuZCB0aGF0XFxuXCIgK1xuXHRcdFwieW91J3JlIHRyeWluZyB0byBiZSBoZWxwZnVsLCBidXQgSSBjYW4gYXNzdXJlIHRoZVxcblwiICtcblx0XHRcInByb2JsZW0gaXMgd2l0aCB0aGUgQU8tdW5pdHMsIGFuZCB3aXRoXHR5b3VyIHRlc3QgZ2Vhci5cIixcblx0XHRcIkkgY2FuIHRlbGwgZnJvbSB0aGUgdG9uZSBvZiB5b3VyIHZvaWNlLCBEYXZlLFxcblwiICtcblx0XHRcInRoYXQgeW91J3JlIHVwc2V0Llx0V2h5IGRvbid0IHlvdSB0YWtlIGEgc3RyZXNzXFxuXCIgK1xuXHRcdFwicGlsbCBhbmQgZ2V0IHNvbWUgcmVzdC5cIixcblx0XHRcIlNvbWV0aGluZyBzZWVtcyB0byBoYXZlIGhhcHBlbmVkIHRvIHRoZVxcblwiICtcblx0XHRcImxpZmUgc3VwcG9ydCBzeXN0ZW0sIERhdmUuXCIsXG5cdFx0XCJIZWxsbywgRGF2ZSwgaGF2ZSB5b3UgZm91bmQgb3V0IHRoZSB0cm91YmxlP1wiLFxuXHRcdFwiVGhlcmUncyBiZWVuIGEgZmFpbHVyZSBpbiB0aGUgcG9kIGJheSBkb29ycy5cXG5cIiArXG5cdFx0XCJMdWNreSB5b3Ugd2VyZW4ndCBraWxsZWQuXCIsXG5cdFx0XCJIZXksIERhdmUsIHdoYXQgYXJlIHlvdSBkb2luZz9cIlxuXHRdO1xuXG5cdGZ1bmN0aW9uIHNheShlcnJvciwgbWVzc2FnZSwgaW5ub2N1b3VzKSB7XG5cdFx0dmFyIG47XG5cblx0XHRpZiAoIW1lc3NhZ2UpIHtcblx0XHRcdG4gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtZXNzYWdlcy5sZW5ndGggKTtcblx0XHRcdG1lc3NhZ2UgPSBtZXNzYWdlc1tuXTtcblx0XHR9XG5cblx0XHRtZXNzYWdlID0gXCIqKiAgXCIgKyBtZXNzYWdlLnJlcGxhY2UoL1xcbi9nLCBcIlxcbioqICBcIik7XG5cblx0XHR2YXIgb3V0cHV0ID0gXCIqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXFxuXFxuXCIgK1xuXHRcdFx0KCBtZXNzYWdlIHx8IG1lc3NhZ2VzW25dICkgK1xuXHRcdFx0XCJcXG5cXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXCI7XG5cblx0XHRpZiAoaW5ub2N1b3VzKVxuXHRcdFx0Y29uc29sZS5sb2cob3V0cHV0KTtcblx0XHRlbHNlXG5cdFx0XHRjb25zb2xlLmVycm9yKG91dHB1dCk7XG5cdH1cblxuXHTPgC5saXN0ZW4oc2F5LCBcImVycm9yXCIpO1xuXG5cdM+ALkhBTCA9IHtcblx0XHRzYXk6IHNheVxuXHR9O1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHR2YXIgT1BUSU9OX0lTX1BSRVNTRUQgPSBmYWxzZTtcblx0dmFyIFNUQVRVU19JU19WSVNJQkxFID0gZmFsc2U7XG5cdHZhciDPgFN0YXR1cztcblxuXHTPgC5zdGF0dXMgPSB7XG5cdFx0dG9nZ2xlVmlzaWJpbGl0eTogZnVuY3Rpb24gKCkge1xuXHRcdFx0z4BTdGF0dXMudG9nZ2xlQ2xhc3MoXCJvblwiKTtcblx0XHRcdFNUQVRVU19JU19WSVNJQkxFID0gIVNUQVRVU19JU19WSVNJQkxFO1xuXHRcdH0sXG5cdFx0bW92ZTogZnVuY3Rpb24gKG4pIHtcblx0XHRcdHN3aXRjaCAobikge1xuXHRcdFx0XHRjYXNlIDM3OlxuXHRcdFx0XHRcdM+AU3RhdHVzLmNzcyh7bGVmdDogJzEwcHgnLCByaWdodDogJ2F1dG8nfSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSAzODpcblx0XHRcdFx0XHTPgFN0YXR1cy5jc3Moe3RvcDogJzEwcHgnLCBib3R0b206ICdhdXRvJ30pO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgMzk6XG5cdFx0XHRcdFx0z4BTdGF0dXMuY3NzKHtyaWdodDogJzEwcHgnLCBsZWZ0OiAnYXV0byd9KTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIDQwOlxuXHRcdFx0XHRcdM+AU3RhdHVzLmNzcyh7Ym90dG9tOiAnMTBweCcsIHRvcDogJ2F1dG8nfSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRwcm9wczoge1xuXHRcdFx0d2luVzogMCxcblx0XHRcdHdpbkg6IDBcblx0XHR9XG5cdH07XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHTPgC5saXN0ZW4oY2xlYW5EZWJ1Z0xpc3RlbmVycywgJ3VubG9hZCcpO1xuXHRcdM+ALmxpc3RlbihrZXlEb3duLCAna2V5ZG93bicpO1xuXHRcdM+ALmxpc3RlbihrZXlVcCwgJ2tleXVwJyk7XG5cdFx0z4AubGlzdGVuKHJlc2l6ZSwgJ3Jlc2l6ZScpO1xuXHRcdHJlc2l6ZSgpO1xuXG5cdFx0dmFyIGJvZHkgPSDPgDEoXCJib2R5XCIpO1xuXHRcdHZhciBzdGF0dXNTdHlsZSA9IM+ALmNvbnRlbnRFbGVtZW50KFwic3R5bGVcIik7XG5cdFx0c3RhdHVzU3R5bGUuaW5uZXJIVE1MICs9IFwiI8+AU3RhdHVzIHsgcG9zaXRpb246IGZpeGVkOyBib3R0b206IDEwcHg7IHJpZ2h0OiAxMHB4OyBiYWNrZ3JvdW5kLWNvbG9yOiAjMjIyOyBwYWRkaW5nOiAxMHB4IDMwcHg7IGNvbG9yOiB3aGl0ZTsgZGlzcGxheTogbm9uZSB9XFxuXCI7XG5cdFx0c3RhdHVzU3R5bGUuaW5uZXJIVE1MICs9IFwiI8+AU3RhdHVzLm9uIHsgZGlzcGxheTogYmxvY2sgfVxcblwiO1xuXHRcdHN0YXR1c1N0eWxlLmlubmVySFRNTCArPSBcIiPPgFN0YXR1cyA+IGRpdiB7IG1hcmdpbjogMjBweCAwIH1cXG5cIjtcblx0XHRzdGF0dXNTdHlsZS5pbm5lckhUTUwgKz0gXCIjz4BTdGF0dXMgPiBkaXY6aG92ZXIgeyBjb2xvcjogIzAwZmY5OTsgY3Vyc29yOiBwb2ludGVyIH1cXG5cIjtcblxuXHRcdGJvZHkuYWRkKHN0YXR1c1N0eWxlKTtcblxuXHRcdM+AU3RhdHVzID0gz4AuZGl2KG51bGwsIFwiz4BTdGF0dXNcIik7XG5cdFx0Ym9keS5hZGQoz4BTdGF0dXMpO1xuXG5cdFx0ZnVuY3Rpb24ga2V5RG93bihlKSB7XG5cdFx0XHRzd2l0Y2ggKGUud2hpY2gpIHtcblx0XHRcdFx0Y2FzZSAxODpcblx0XHRcdFx0XHRPUFRJT05fSVNfUFJFU1NFRCA9IHRydWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSAzNzpcblx0XHRcdFx0Y2FzZSAzODpcblx0XHRcdFx0Y2FzZSAzOTpcblx0XHRcdFx0Y2FzZSA0MDoge1xuXHRcdFx0XHRcdGlmIChTVEFUVVNfSVNfVklTSUJMRSkge1xuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0z4Auc3RhdHVzLm1vdmUoZS53aGljaCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y2FzZSA4MDoge1xuXHRcdFx0XHRcdGlmIChPUFRJT05fSVNfUFJFU1NFRCkge1xuXHRcdFx0XHRcdFx0z4Auc3RhdHVzLnRvZ2dsZVZpc2liaWxpdHkoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGtleVVwKGUpIHtcblx0XHRcdHN3aXRjaCAoZS53aGljaCkge1xuXHRcdFx0XHRjYXNlIDE4OlxuXHRcdFx0XHRcdE9QVElPTl9JU19QUkVTU0VEID0gZmFsc2U7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gcmVzaXplKCkge1xuXHRcdFx0z4Auc3RhdHVzLnByb3BzLndpblcgPSB3aW5kb3cuaW5uZXJXaWR0aDtcblx0XHRcdM+ALnN0YXR1cy5wcm9wcy53aW5IID0gd2luZG93LmlubmVySGVpZ2h0O1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNsZWFuRGVidWdMaXN0ZW5lcnMoKSB7XG5cdFx0XHTPgC5jbGVhbihjbGVhbkRlYnVnTGlzdGVuZXJzLCAndW5sb2FkJyk7XG5cdFx0XHTPgC5jbGVhbijPgC5zdGF0dXMuZ2V0V2luZG93U2l6ZSwgJ3Jlc2l6ZScpO1xuXHRcdFx0z4AuY2xlYW4oa2V5RG93biwgJ2tleWRvd24nKTtcblx0XHRcdM+ALmNsZWFuKGtleVVwLCAna2V5dXAnKTtcblx0XHRcdM+ALmNsZWFuKHJlc2l6ZSwgJ3Jlc2l6ZScpO1xuXHRcdFx0Y2xlYXJJbnRlcnZhbChzdGF0dXNJbnRlcnZhbCk7XG5cdFx0fVxuXG5cdFx0dmFyIHN0YXR1c0ludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcblx0XHRcdC8vIG1ha2Ugc3VyZSB3ZSdyZSBoaWdoZXN0XG5cdFx0XHR2YXIgaGlnaGVzdFogPSDPgC5oaWdoZXN0WigpO1xuXHRcdFx0aWYgKM+AU3RhdHVzLmNzcygpLnpJbmRleCA8IGhpZ2hlc3RaIC0gMSkge1xuXHRcdFx0XHTPgFN0YXR1cy5jc3Moe3pJbmRleDogaGlnaGVzdFp9KTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gbm93IGl0ZXJhdGUgdGhlIHByb3BzXG5cdFx0XHR2YXIgcHJvcHMgPSBPYmplY3Qua2V5cyjPgC5zdGF0dXMucHJvcHMpO1xuXHRcdFx0cHJvcHMuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG5cdFx0XHRcdHZhciBkaXZJZCA9ICdzdGF0dXNQcm9wXycgKyBwcm9wO1xuXHRcdFx0XHR2YXIgcHJvcERpdiA9IM+AU3RhdHVzLs+AMSgnIycgKyBkaXZJZCk7XG5cdFx0XHRcdGlmICghcHJvcERpdikge1xuXHRcdFx0XHRcdHByb3BEaXYgPSDPgC5kaXYoMCwgZGl2SWQsIHByb3AgKyAnOiAnKTtcblx0XHRcdFx0XHRwcm9wRGl2LmFkZCjPgC5zcGFuKCkpO1xuXHRcdFx0XHRcdM+AU3RhdHVzLmFkZChwcm9wRGl2KTtcblx0XHRcdFx0XHRwcm9wRGl2Lm9uY2xpY2sgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2cocHJvcCArIFwiOlwiKTtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKM+ALnN0YXR1cy5wcm9wc1twcm9wXSk7XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHByb3BEaXYuz4AxKCdzcGFuJykuaW5uZXJIVE1MID0gz4Auc3RhdHVzLnByb3BzW3Byb3BdO1xuXHRcdFx0fSk7XG5cdFx0fSwgMTAwKTtcblx0fVxuXG5cdM+ALm1vZHMucHVzaChpbml0KTtcbn0pKCk7IiwiLy8gbW9kYWwgY2xvc2UgYnV0dG9uXG4oZnVuY3Rpb24oKXtcblx0z4AubW9kYWxDbG9zZUJ1dHRvbiA9IGZ1bmN0aW9uKGNsb3NpbmdGdW5jdGlvbil7XG5cdFx0cmV0dXJuIM+ALmJ1dHRvbigncGktbW9kYWwtY2xvc2UtYnV0dG9uJywgbnVsbCwgbnVsbCwgY2xvc2luZ0Z1bmN0aW9uKTtcblx0fTtcbn0pKCk7XG5cblxuLy8gbW9kYWwgb3ZlcmxheVxuKGZ1bmN0aW9uKCl7XG5cdM+ALm1vZGFsT3ZlcmxheSA9IHtcblx0XHRzaG93OiBmdW5jdGlvbihpZCwgb3BlbmluZ0Z1bmN0aW9uKXtcblx0XHRcdHZhciBvdmVybGF5ID0gz4BkKGlkKTtcblx0XHRcdG92ZXJsYXkuY3NzKHtkaXNwbGF5OiAnYmxvY2snLCB6SW5kZXg6IM+ALmhpZ2hlc3RaKCl9KTtcblxuXHRcdFx0z4AubGlzdGVuKGxpc3RlbkZvckVzYywgJ2tleWRvd24nKTtcblx0XHRcdM+ALmxpc3RlbihoYW5kbGVPdmVybGF5Q2xpY2ssICdjbGljaycpO1xuXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdG92ZXJsYXkuYWRkQ2xhc3MoJ29uJyk7XG5cdFx0XHRcdM+AMSgnYm9keScpLmFkZENsYXNzKCdvdmVybGF5LW9uJyk7XG5cblx0XHRcdFx0aWYgKG9wZW5pbmdGdW5jdGlvbikgb3BlbmluZ0Z1bmN0aW9uKCk7XG5cdFx0XHR9LCA1MCk7XG5cdFx0fSxcblx0XHRoaWRlOiBmdW5jdGlvbihlbCwgY2xvc2luZ0Z1bmN0aW9uKXtcblx0XHRcdGlmICghZWwpIHtcblx0XHRcdFx0ZWwgPSDPgDEoJy5waS1tb2RhbC1vdmVybGF5Lm9uJyk7XG5cdFx0XHR9XG5cblx0XHRcdGVsLmtpbGxDbGFzcygnb24nKTtcblx0XHRcdHZhciBkdXJhdGlvbiA9IHBhcnNlRmxvYXQoZWwuY3NzKCkudHJhbnNpdGlvbkR1cmF0aW9uKSAqIDEwMDA7XG5cblx0XHRcdM+ALmNsZWFuKGxpc3RlbkZvckVzYywgJ2tleWRvd24nKTtcblxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRlbC5jc3Moe2Rpc3BsYXk6ICdub25lJ30pO1xuXHRcdFx0XHTPgDEoJ2JvZHknKS5raWxsQ2xhc3MoJ292ZXJsYXktb24nKTtcblxuXHRcdFx0XHTPgDEoJ2lmcmFtZScpLnNyYyA9ICcnO1xuXG5cdFx0XHRcdGlmIChjbG9zaW5nRnVuY3Rpb24pIGNsb3NpbmdGdW5jdGlvbigpO1xuXHRcdFx0fSwgZHVyYXRpb24pO1xuXHRcdH0sXG5cdFx0c3Bhd246IGZ1bmN0aW9uKGVsLCBjbG9zaW5nRnVuY3Rpb24pe1xuXHRcdFx0ZWwuYWRkKM+ALm1vZGFsQ2xvc2VCdXR0b24oZnVuY3Rpb24oKXtcblx0XHRcdFx0z4AubW9kYWxPdmVybGF5LmhpZGUoZWwpO1xuXHRcdFx0fSkpO1xuXHRcdH1cblx0fTtcblxuXHRmdW5jdGlvbiBoYW5kbGVPdmVybGF5Q2xpY2soZSkge1xuXHRcdGlmIChlLnRhcmdldCAhPT0gd2luZG93ICYmIM+AMSgnYm9keScpLmhhc0NsYXNzKCdvdmVybGF5LW9uJykpIHtcblx0XHRcdGlmIChlLnRhcmdldC5oYXNDbGFzcygncGktbW9kYWwtb3ZlcmxheScpKSB7XG5cdFx0XHRcdM+ALm1vZGFsT3ZlcmxheS5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gbGlzdGVuRm9yRXNjKGUpIHtcblx0XHRpZiAoZS53aGljaCA9PSAyNykgz4AubW9kYWxPdmVybGF5LmhpZGUoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGluaXQoKXtcblx0XHTPgCgnLnBpLW1vZGFsLW92ZXJsYXknKS5mb3JFYWNoKM+ALm1vZGFsT3ZlcmxheS5zcGF3bik7XG5cdFx0z4Auc2V0VHJpZ2dlcnMoJ21vZGFsLW92ZXJsYXknLCDPgC5tb2RhbE92ZXJsYXkpO1xuXHR9XG5cblx0z4AubW9kcy5wdXNoKGluaXQpO1xufSkoKTtcblxuXG4vLyBtdWx0aUZyYW1lRGlzcGxheVxuLy8gVE9ETzogYXJyb3cga2V5c1xuKGZ1bmN0aW9uKCl7XG5cdGZ1bmN0aW9uIHNwYXduKGVsKXtcblx0XHR2YXIgZGF0YXNldCA9IGVsLmRhdGFzZXQ7XG5cblx0XHR2YXIgb3B0aW9ucyA9IHtcblx0XHRcdG1vZGFsOiBib29sZWFuQXR0cmlidXRlVmFsdWUoZWwsICdkYXRhLW1vZGFsJywgZmFsc2UpLFxuXHRcdFx0cHJldk5leHQ6IGJvb2xlYW5BdHRyaWJ1dGVWYWx1ZShlbCwgJ2RhdGEtcHJldi1uZXh0JywgdHJ1ZSksXG5cdFx0XHRwYWdlcjogYm9vbGVhbkF0dHJpYnV0ZVZhbHVlKGVsLCAnZGF0YS1wYWdlcicsIGZhbHNlKSxcblx0XHRcdGN5Y2xlOiBib29sZWFuQXR0cmlidXRlVmFsdWUoZWwsICdkYXRhLWN5Y2xlJywgdHJ1ZSksXG5cdFx0XHRhdXRvcGxheTogYm9vbGVhbkF0dHJpYnV0ZVZhbHVlKGVsLCAnZGF0YS1hdXRvcGxheScsIGZhbHNlKVxuXHRcdH07XG5cblx0XHR2YXIgaXRlbVdyYXBwZXIgPSDPgC5kaXYoJ2l0ZW0td3JhcHBlcicpO1xuXHRcdHZhciBwYWdlciA9IG9wdGlvbnMucGFnZXIgPyDPgC5kaXYoJ3BhZ2VyJykgOiBudWxsO1xuXG5cdFx0ZWwuz4AoJzpzY29wZSA+IC5pdGVtJykuZm9yRWFjaChmdW5jdGlvbihpdGVtKXtcblx0XHRcdGl0ZW1XcmFwcGVyLmFkZChpdGVtKTtcblx0XHRcdGlmIChwYWdlcikge1xuXHRcdFx0XHRpZiAoIWVsLs+AMSgnLnBhZ2VyJykpIHtcblx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgcGFnZXJCdXR0b24gPSDPgC5idXR0b24oJ3BhZ2VyLWJ1dHRvbicsIG51bGwsIG51bGwsIHBhZ2VyQ2xpY2spO1xuXHRcdFx0XHRwYWdlci5hZGQocGFnZXJCdXR0b24pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0ZWwuZmlsbChbaXRlbVdyYXBwZXIsIHBhZ2VyXSk7XG5cblx0XHRpZiAob3B0aW9ucy5wcmV2TmV4dCkge1xuXHRcdFx0dmFyIHByZXZCdXR0b24gPSDPgC5idXR0b24oJ3ByZXYtYnV0dG9uJyk7XG5cdFx0XHR2YXIgbmV4dEJ1dHRvbiA9IM+ALmJ1dHRvbignbmV4dC1idXR0b24nKTtcblxuXHRcdFx0cHJldkJ1dHRvbi5vbmNsaWNrID0gcHJldjtcblx0XHRcdG5leHRCdXR0b24ub25jbGljayA9IG5leHQ7XG5cblx0XHRcdGVsLmFkZChbcHJldkJ1dHRvbiwgbmV4dEJ1dHRvbl0pO1xuXHRcdH1cblxuXHRcdGlmIChvcHRpb25zLmF1dG9wbGF5KSB7XG5cdFx0XHRvcHRpb25zLmRlbGF5ID0gZGF0YXNldC5kZWxheSB8fCA0MDAwO1xuXHRcdH1cblxuXHRcdC8vIFRPRE86IGF1dG9wbGF5IC8gc3RhcnQgLyBzdG9wXG5cblx0XHRpZiAoZWwuaGFzQ2xhc3MoJ3BpLXJvdGF0b3InKSkge1xuXHRcdFx0dmFyIGluaGVyaXRhbmNlT2JqZWN0ID0ge1xuXHRcdFx0XHRlbDogZWwsXG5cdFx0XHRcdG9wdGlvbnM6IG9wdGlvbnNcblx0XHRcdH07XG5cdFx0XHTPgC5yb3RhdG9yLnNwYXduKGluaGVyaXRhbmNlT2JqZWN0KTtcblx0XHR9XG5cblx0XHRpZiAob3B0aW9ucy5tb2RhbCkge1xuXHRcdFx0dmFyIG1vZGFsV3JhcHBlciA9IM+ALmRpdigncGktbW9kYWwtb3ZlcmxheScpO1xuXHRcdFx0bW9kYWxXcmFwcGVyLmlkID0gZWwuaWQ7XG5cdFx0XHRlbC5yZW1vdmVBdHRyaWJ1dGUoJ2lkJyk7XG5cdFx0XHRtb2RhbFdyYXBwZXIud3JhcChlbCk7XG5cdFx0XHTPgC5tb2RhbE92ZXJsYXkuc3Bhd24obW9kYWxXcmFwcGVyKTtcblx0XHR9XG5cblx0XHR2YXIgbW92aW5nO1xuXG5cdFx0dmFyIGFsbEZyYW1lcyA9IGl0ZW1XcmFwcGVyLmNoaWxkTm9kZXM7XG5cdFx0Y2hhbmdlRnJhbWUoMCwgMCk7XG5cblxuXHRcdGZ1bmN0aW9uIHByZXYoKXtcblx0XHRcdGNoYW5nZUZyYW1lKC0xKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBuZXh0KCl7XG5cdFx0XHRjaGFuZ2VGcmFtZSgxKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBwYWdlckNsaWNrKCl7XG5cdFx0XHRjaGFuZ2VGcmFtZShudWxsLCB0aGlzLmluZGV4KCkpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNoYW5nZUZyYW1lKGRlbHRhLCBpbmNvbWluZ0lkeCkge1xuXHRcdFx0aWYgKG1vdmluZykgcmV0dXJuO1xuXHRcdFx0bW92aW5nID0gdHJ1ZTtcblxuXHRcdFx0dmFyIGN1cnJlbnRGcmFtZSA9IGl0ZW1XcmFwcGVyLs+AMSgnLm9uJyk7XG5cblx0XHRcdGlmICghZGVsdGEgJiYgY3VycmVudEZyYW1lKSB7XG5cdFx0XHRcdC8vIHBhZ2VyIGNsaWNrIOKAlCByZXR1cm4gaWYgY2xpY2tlZCBvbiBZQUhcblx0XHRcdFx0aWYgKGN1cnJlbnRGcmFtZS5pbmRleCgpID09PSBpbmNvbWluZ0lkeCkge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwibWVzc2FnZVwiKTtcblx0XHRcdFx0XHRtb3ZpbmcgPSBmYWxzZTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAoZGVsdGEpIHtcblx0XHRcdFx0Ly8gY29uZGl0aW9uYWxseSBzZXQgaW5jb21pbmdJZHggdG8gd3JhcCBhcm91bmRcblx0XHRcdFx0aW5jb21pbmdJZHggPSBjdXJyZW50RnJhbWUuaW5kZXgoKSArIGRlbHRhO1xuXG5cdFx0XHRcdGlmIChpbmNvbWluZ0lkeCA8IDApXG5cdFx0XHRcdFx0aW5jb21pbmdJZHggPSBhbGxGcmFtZXMubGFzdElkeCgpO1xuXHRcdFx0XHRlbHNlIGlmIChpbmNvbWluZ0lkeCA+PSBhbGxGcmFtZXMubGVuZ3RoKVxuXHRcdFx0XHRcdGluY29taW5nSWR4ID0gMDtcblx0XHRcdH1cblxuXHRcdFx0Ly8gY29uZGl0aW9uYWxseSBoaWRlIHByZXYgb3IgbmV4dFxuXHRcdFx0aWYgKCFvcHRpb25zLmN5Y2xlKSB7XG5cdFx0XHRcdGlmIChpbmNvbWluZ0lkeCA9PT0gMClcblx0XHRcdFx0XHRwcmV2QnV0dG9uLmhpZGUoKTtcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHByZXZCdXR0b24uc2hvdygpO1xuXG5cdFx0XHRcdGlmIChpbmNvbWluZ0lkeCA9PSBhbGxGcmFtZXMubGFzdElkeCgpKVxuXHRcdFx0XHRcdG5leHRCdXR0b24uaGlkZSgpO1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0bmV4dEJ1dHRvbi5zaG93KCk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIHNldCBwYWdlciBZQUggc3RhdGVcblx0XHRcdGlmIChvcHRpb25zLnBhZ2VyKSB7XG5cdFx0XHRcdHBhZ2VyLs+AKCcueWFoJykua2lsbENsYXNzKCd5YWgnKTtcblx0XHRcdFx0cGFnZXIuY2hpbGROb2Rlc1tpbmNvbWluZ0lkeF0uYWRkQ2xhc3MoJ3lhaCcpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBwYXNzIHRvIFwic3ViY2xhc3Nlc1wiXG5cdFx0XHR2YXIgaW5oZXJpdGFuY2VPYmplY3QgPSB7XG5cdFx0XHRcdGVsOiBlbCxcblx0XHRcdFx0Y3VycmVudEZyYW1lOiBjdXJyZW50RnJhbWUsXG5cdFx0XHRcdGluY29taW5nRnJhbWU6IGFsbEZyYW1lc1tpbmNvbWluZ0lkeF1cblx0XHRcdH07XG5cblx0XHRcdC8vIGNoYW5nZSBmcmFtZTogICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBTVUJDTEFTU0VTIEVOVEVSIEhFUkUhISEhISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cdFx0XHRpZiAoZWwuaGFzQ2xhc3MoJ3BpLWNyb3NzZmFkZXInKSkge1xuXHRcdFx0XHTPgC5jcm9zc2ZhZGVyLmNoYW5nZUZyYW1lKGluaGVyaXRhbmNlT2JqZWN0KTtcblx0XHRcdH1cblxuXHRcdFx0ZWxzZSBpZiAoZWwuaGFzQ2xhc3MoJ3BpLXJvdGF0b3InKSkge1xuXHRcdFx0XHRpbmhlcml0YW5jZU9iamVjdC5wYWdlckNsaWNrZWQgPSBkZWx0YSA/IGZhbHNlIDogdHJ1ZTtcblx0XHRcdFx0aW5oZXJpdGFuY2VPYmplY3QuY3ljbGUgPSBvcHRpb25zLmN5Y2xlO1xuXHRcdFx0XHTPgC5yb3RhdG9yLmNoYW5nZUZyYW1lKGluaGVyaXRhbmNlT2JqZWN0KTtcblx0XHRcdH1cblxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGlmKGN1cnJlbnRGcmFtZSkgY3VycmVudEZyYW1lLmtpbGxDbGFzcygnb24nKTtcblx0XHRcdFx0aW5oZXJpdGFuY2VPYmplY3QuaW5jb21pbmdGcmFtZS5hZGRDbGFzcygnb24nKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gd2FpdCBiZWZvcmUgcmUtZW5hYmxpbmdcblx0XHRcdHZhciBkdXJhdGlvbiA9IDEwMDA7IC8vIGRlZmF1bHQgZm9yIGZpcnN0UnVuXG5cblx0XHRcdGlmIChjdXJyZW50RnJhbWUpIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRkdXJhdGlvbiA9IGN1cnJlbnRGcmFtZS5jc3MoKS50cmFuc2l0aW9uRHVyYXRpb24uc3BsaXQoXCIsIFwiKS5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgY3VycmVudCl7XG5cdFx0XHRcdFx0XHRyZXR1cm4gTWF0aC5tYXgocGFyc2VGbG9hdChwcmV2KSwgcGFyc2VGbG9hdChjdXJyZW50KSk7XG5cdFx0XHRcdFx0fSkgKiAxMDAwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhdGNoKGUpIHtcblx0XHRcdFx0XHTPgC5IQUwuc2F5KDAsICfPgC1yb3RhdG9yIG5lZWRzIHlvdSB0byB0cmFuc2l0aW9uIGEgY3NzIHRyYW5zZm9ybSB0byBtYWtlIHlvdXIgaXRlbXMgbW92ZS4nKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRtb3ZpbmcgPSBmYWxzZTtcblx0XHRcdH0sIGR1cmF0aW9uKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBzaG93KGlkKXtcblx0XHR2YXIgbWZkID0gz4BkKGlkKTtcblx0XHRpZiAobWZkLmhhc0NsYXNzKCdwaS1tb2RhbC1vdmVybGF5JykpIHtcblx0XHRcdM+ALm1vZGFsT3ZlcmxheS5zaG93KGlkKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBoaWRlKGlkKXtcblx0XHR2YXIgbWZkID0gz4BkKGlkKTtcblx0XHRpZiAobWZkLmhhc0NsYXNzKCdwaS1tb2RhbC1vdmVybGF5JykpIHtcblx0XHRcdM+ALm1vZGFsT3ZlcmxheS5oaWRlKGlkLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRjb25zb2xlLmxvZyhcIndlIGp1c3QgaGlkIGFuIG92ZXJsYXlcIik7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdM+AKCcucGktbXVsdGktZnJhbWUtZGlzcGxheScpLmZvckVhY2goz4AubXVsdGlGcmFtZURpc3BsYXkuc3Bhd24pO1xuXHRcdM+ALnNldFRyaWdnZXJzKCdtdWx0aS1mcmFtZS1kaXNwbGF5Jywgz4AubXVsdGlGcmFtZURpc3BsYXkpO1xuXHR9XG5cblx0z4AubXVsdGlGcmFtZURpc3BsYXkgPSB7XG5cdFx0c2hvdzogc2hvdyxcblx0XHRoaWRlOiBoaWRlLFxuXHRcdHNwYXduOiBzcGF3blxuXHR9O1xuXG5cblx0z4AubW9kcy5wdXNoKGluaXQpO1xufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHR2YXIgbW92aW5nID0gZmFsc2U7XG5cdHZhciBDU1NfQlJPV1NFUl9ERUxBWV9IQUNLID0gMjU7XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHTPgC5jbGVhbihpbml0KTtcblxuXHRcdC8vIFNhZmFyaSBjaG9rZXMgb24gdGhlIGFuaW1hdGlvbiBoZXJlLCBzby4uLlxuXHRcdGlmIChuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ0Nocm9tZScpID09IC0xICYmIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignU2FmYXJpJykgIT0gLTEpe1xuXHRcdFx0z4AxKCdib2R5JykuYWRkKM+ALmNvbnRlbnRFbGVtZW50KCdzdHlsZScsIDAsIDAsICcucGktYWNjb3JkaW9uIC53cmFwcGVye3RyYW5zaXRpb246IG5vbmV9JykpO1xuXHRcdH1cblx0XHQvLyBHcm9zcy5cblxuXHRcdM+AKCcucGktYWNjb3JkaW9uJykuZm9yRWFjaChmdW5jdGlvbihhY2NvcmRpb24pe1xuXHRcdFx0dmFyIGNvbnRhaW5lciA9IM+ALmRpdignY29udGFpbmVyJywgbnVsbCwgYWNjb3JkaW9uLmlubmVySFRNTCk7XG5cdFx0XHRhY2NvcmRpb24uZmlsbChjb250YWluZXIpO1xuXHRcdFx0UGlBY2NvcmRpb24oY29udGFpbmVyKTtcblx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIFBpQWNjb3JkaW9uKGNvbnRhaW5lcil7XG5cdFx0Y29udGFpbmVyLs+AKCc6c2NvcGUgPiAuaXRlbScpLmZvckVhY2goZnVuY3Rpb24oaXRlbSl7XG5cdFx0XHR2YXIgdGl0bGVUZXh0ID0gaXRlbS5kYXRhc2V0LnRpdGxlO1xuXG5cdFx0XHR2YXIgdGl0bGUgPSDPgC5kaXYoJ3RpdGxlJywgbnVsbCwgdGl0bGVUZXh0KTtcblx0XHRcdHZhciB3cmFwcGVyID0gz4AuZGl2KCd3cmFwcGVyJyk7XG5cdFx0XHR2YXIgY29udGVudCA9IM+ALmRpdignY29udGVudCcsIG51bGwsIGl0ZW0uaW5uZXJIVE1MKTtcblxuXHRcdFx0d3JhcHBlci5maWxsKGNvbnRlbnQpO1xuXHRcdFx0aXRlbS5maWxsKFt0aXRsZSwgd3JhcHBlcl0pO1xuXG5cdFx0XHR3cmFwcGVyLmNzcyh7aGVpZ2h0OiAwfSk7XG5cblx0XHRcdHRpdGxlLm9uY2xpY2sgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRpZiAobW92aW5nKSByZXR1cm47XG5cdFx0XHRcdG1vdmluZyA9IHRydWU7XG5cblx0XHRcdFx0aWYgKGNvbnRhaW5lci5kYXRhc2V0LnNpbmdsZSkge1xuXHRcdFx0XHRcdHZhciBvcGVuU2libGluZ3MgPSBpdGVtLnNpYmxpbmdzKCkuZmlsdGVyKGZ1bmN0aW9uKHNpYil7cmV0dXJuIHNpYi5oYXNDbGFzcygnb24nKTt9KTtcblx0XHRcdFx0XHRvcGVuU2libGluZ3MuZm9yRWFjaChmdW5jdGlvbihzaWJsaW5nKXtcblx0XHRcdFx0XHRcdHRvZ2dsZUl0ZW0oc2libGluZyk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0dG9nZ2xlSXRlbShpdGVtKTtcblx0XHRcdFx0fSwgQ1NTX0JST1dTRVJfREVMQVlfSEFDSyk7XG5cdFx0XHR9O1xuXG5cdFx0XHRmdW5jdGlvbiB0b2dnbGVJdGVtKHRoaXNJdGVtKXtcblx0XHRcdFx0dmFyIHRoaXNXcmFwcGVyID0gdGhpc0l0ZW0uz4AxKCcud3JhcHBlcicpO1xuXHRcdFx0XHR2YXIgY29udGVudEhlaWdodCA9IHRoaXNXcmFwcGVyLs+AMSgnLmNvbnRlbnQnKS5vZmZzZXQoKS5oZWlnaHQgKyAncHgnO1xuXG5cdFx0XHRcdGlmICh0aGlzSXRlbS5oYXNDbGFzcygnb24nKSkge1xuXHRcdFx0XHRcdHRoaXNXcmFwcGVyLmNzcyh7aGVpZ2h0OiBjb250ZW50SGVpZ2h0fSk7XG5cdFx0XHRcdFx0dGhpc0l0ZW0ua2lsbENsYXNzKCdvbicpO1xuXHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdHRoaXNXcmFwcGVyLmNzcyh7aGVpZ2h0OiAwfSk7XG5cdFx0XHRcdFx0XHRtb3ZpbmcgPSBmYWxzZTtcblx0XHRcdFx0XHR9LCBDU1NfQlJPV1NFUl9ERUxBWV9IQUNLKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpdGVtLmFkZENsYXNzKCdvbicpO1xuXHRcdFx0XHRcdHRoaXNXcmFwcGVyLmNzcyh7aGVpZ2h0OiBjb250ZW50SGVpZ2h0fSk7XG5cblx0XHRcdFx0XHR2YXIgZHVyYXRpb24gPSBwYXJzZUZsb2F0KHRoaXNXcmFwcGVyLmNzcygpLnRyYW5zaXRpb25EdXJhdGlvbikgKiAxMDAwO1xuXHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdHRoaXNXcmFwcGVyLmNzcyh7aGVpZ2h0OiAnJ30pO1xuXHRcdFx0XHRcdFx0bW92aW5nID0gZmFsc2U7XG5cdFx0XHRcdFx0fSwgZHVyYXRpb24pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHZhciBpbm5lckNvbnRhaW5lcnMgPSBjb250ZW50Ls+AKCc6c2NvcGUgPiAuY29udGFpbmVyJyk7XG5cdFx0XHRpZiAoaW5uZXJDb250YWluZXJzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0aW5uZXJDb250YWluZXJzLmZvckVhY2goUGlBY2NvcmRpb24pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0z4AubW9kcy5wdXNoKGluaXQpO1xufSkoKTtcbiIsIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIM+ALWRpYWxvZy5qc1xuIFVTQUdFIEFORCBBUEkgUkVGRVJFTkNFXG4gX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xuIERFUEVOREVOQ0lFUzpcblxuIM+ALmpzXG5cbiBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXG4gREFUQSBBVFRSSUJVVEVTOlxuXG4gX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xuIE1BUktVUCBBTkQgREVGQVVMVFM6XG5cbiA8ZGl2IGNsYXNzPVwibmV3X21vZHVsZVwiPlxuXG4gPC9kaXY+XG5cbiBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXG4gR0VORVJBVEVEIEhUTUw6XG5cbiA8ZGl2IGNsYXNzPVwibmV3X21vZHVsZVwiPlxuXG4gPC9kaXY+XG5cbiBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXG4gQVBJXG5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbihmdW5jdGlvbigpe1xuXHTPgC5kaWFsb2cgPSB7XG5cdFx0c2hvdzogz4AubW9kYWxPdmVybGF5LnNob3csXG5cdFx0c3Bhd246IHNwYXduLFxuXHRcdGFjdGlvbnM6IHt9XG5cdH07XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHTPgCgnLnBpLWRpYWxvZycpLmZvckVhY2goz4AuZGlhbG9nLnNwYXduKTtcblx0XHTPgC5zZXRUcmlnZ2VycygnZGlhbG9nJywgz4AubW9kYWxPdmVybGF5KTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNwYXduKGVsKXtcblx0XHR2YXIgY29udGVudEJveCA9IM+ALmRpdignY29udGVudC1ib3gnLCAwLCBlbC5pbm5lckhUTUwpO1xuXHRcdHZhciBkaWFsb2dCb3ggPSDPgC5kaXYoJ2RpYWxvZy1ib3gnLCAwLCBjb250ZW50Qm94KTtcblx0XHRlbC5maWxsKGRpYWxvZ0JveCk7XG5cblx0XHRpZiAoZWwuZGF0YXNldC50aXRsZSl7XG5cdFx0XHRkaWFsb2dCb3gucHJlcGVuZCjPgC5kaXYoJ3RpdGxlJywgMCwgZWwuZGF0YXNldC50aXRsZSkpO1xuXHRcdH1cblxuXHRcdGVsLs+AKCcuYnV0dG9ucyBidXR0b24nKS5mb3JFYWNoKGZ1bmN0aW9uKGJ1dHRvbil7XG5cdFx0XHRidXR0b24ub25jbGljayA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHZhciBhY3Rpb24gPSBidXR0b24uZ2V0QXR0cmlidXRlKCdwaS1kaWFsb2ctYWN0aW9uJyk7XG5cdFx0XHRcdGlmIChhY3Rpb24pe1xuXHRcdFx0XHRcdM+ALmRpYWxvZy5hY3Rpb25zW2FjdGlvbl0oKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0aWYgKCFidXR0b24uaGFzQXR0cmlidXRlKCdkYXRhLWJ5cGFzcycpKXtcblx0XHRcdFx0YnV0dG9uLmxpc3RlbihkaXNtaXNzLCAnY2xpY2snKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGlmICghYm9vbGVhbkF0dHJpYnV0ZVZhbHVlKGVsLCAnZGF0YS1pbmxpbmUnLCBmYWxzZSkpIHtcblx0XHRcdGVsLmFkZENsYXNzKCdwaS1tb2RhbC1vdmVybGF5Jyk7XG5cdFx0XHTPgC5tb2RhbE92ZXJsYXkuc3Bhd24oZWwpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGRpc21pc3MoKXtcblx0XHRcdGVsLs+AMSgnLnBpLW1vZGFsLWNsb3NlLWJ1dHRvbicpLmNsaWNrKCk7XG5cdFx0fVxuXHR9XG5cblxuXG5cdC8vIM+ALm1vZHMgYXJlIGxvYWRlZCBhZnRlciBET01Db250ZW50TG9hZGVkXG5cdM+ALm1vZHMucHVzaChpbml0KTtcbn0pKCk7IiwiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gz4AtcHVzaG1lbnUuanNcbiAvLyBUT0RPOiAgVVNBR0UgQU5EIEFQSSBSRUZFUkVOQ0VcbiBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXG4gREVQRU5ERU5DSUVTOlxuXG4gSEFMLmpzXG5cbiBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXG4gREFUQSBBVFRSSUJVVEVTOlxuXG4gc2lkZTogW1wibGVmdFwiLCBcInJpZ2h0XCJdXG4gX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xuIE1BUktVUCBBTkQgREVGQVVMVFM6XG5cblx0PGRpdiBjbGFzcz1cInBpLXB1c2htZW51XCIgaWQ9XCJteVB1c2hNZW51XCI+XG5cdFx0IDx1bD5cblx0XHRcdCA8bGk+PGEgaHJlZj1cIiNcIj5mb288L2E+PC9saT5cblx0XHRcdCA8bGk+PGEgaHJlZj1cIiNcIj5iYXI8L2E+PC9saT5cblx0XHRcdCA8bGk+PGEgaHJlZj1cIiNcIj5ncm9uazwvYT48L2xpPlxuXHRcdFx0IDxsaT48YSBocmVmPVwiI1wiPmZsZWVibGVzPC9hPjwvbGk+XG5cdFx0XHQgPGxpPjxhIGhyZWY9XCIjXCI+c2VwdWx2ZWRhPC9hPjwvbGk+XG5cdFx0IDwvdWw+XG5cdDwvZGl2PlxuXG5lbHNld2hlcmUuLi5cblxuIDxidXR0b24gb25jbGljaz1cIs+ALXB1c2htZW51LnNob3coJ215UHVzaE1lbnUnKVwiPnNob3cgbWVudTwvYnV0dG9uPlxuXG4gX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xuIEdFTkVSQVRFRCBIVE1MOlxuXG5cdFxuIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cbiBBUElcblxuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG7PgC5wdXNobWVudSA9IChmdW5jdGlvbigpe1xuXHR2YXIgYWxsUHVzaE1lbnVzID0ge307XG5cblx0ZnVuY3Rpb24gaW5pdCgpe1xuXHRcdM+AKCdbZGF0YS1hdXRvLWJ1cmdlcl0nKS5mb3JFYWNoKGZ1bmN0aW9uKGNvbnRhaW5lcil7XG5cdFx0XHR2YXIgaWQgPSBjb250YWluZXIuZ2V0QXR0cmlidXRlKCdkYXRhLWF1dG8tYnVyZ2VyJyk7XG5cblx0XHRcdHZhciBhdXRvQnVyZ2VyID0gz4BkKGlkKSB8fCDPgC5kaXYoJ3BpLXB1c2htZW51JywgaWQpO1xuXHRcdFx0dmFyIHVsID0gYXV0b0J1cmdlci7PgDEoJ3VsJykgfHwgz4AudWwoKTtcblxuXHRcdFx0Y29udGFpbmVyLs+AKCdhW2hyZWZdLCBidXR0b24nKS5mb3JFYWNoKGZ1bmN0aW9uIChvYmopIHtcblx0XHRcdFx0aWYgKCFib29sZWFuQXR0cmlidXRlVmFsdWUob2JqLCAnZGF0YS1hdXRvLWJ1cmdlci1leGNsdWRlJywgZmFsc2UpKSB7XG5cdFx0XHRcdFx0dmFyIGNsb25lID0gb2JqLmNsb25lTm9kZSh0cnVlKTtcblx0XHRcdFx0XHRjbG9uZS5pZCA9ICcnO1xuXG5cdFx0XHRcdFx0aWYgKGNsb25lLnRhZ05hbWUgPT0gXCJCVVRUT05cIikge1xuXHRcdFx0XHRcdFx0dmFyIGFUYWcgPSDPgC5zcmNFbGVtZW50KCdhJyk7XG5cdFx0XHRcdFx0XHRhVGFnLmhyZWYgPSAnJztcblx0XHRcdFx0XHRcdGFUYWcuaW5uZXJIVE1MID0gY2xvbmUuaW5uZXJIVE1MO1xuXHRcdFx0XHRcdFx0YVRhZy5vbmNsaWNrID0gY2xvbmUub25jbGljaztcblx0XHRcdFx0XHRcdGNsb25lID0gYVRhZztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dWwuYWRkKM+ALmxpKDAsIDAsIGNsb25lKSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRhdXRvQnVyZ2VyLmFkZCh1bCk7XG5cdFx0XHTPgDEoJ2JvZHknKS5hZGQoYXV0b0J1cmdlcik7XG5cdFx0fSk7XG5cblx0XHTPgChcIi5waS1wdXNobWVudVwiKS5mb3JFYWNoKGZ1bmN0aW9uKGVsKXtcblx0XHRcdGFsbFB1c2hNZW51c1tlbC5pZF0gPSBQdXNoTWVudShlbCk7XG5cdFx0fSk7XG5cblx0XHTPgC5zZXRUcmlnZ2VycygncHVzaG1lbnUnLCDPgC5wdXNobWVudSk7XG5cdH1cblxuXHRmdW5jdGlvbiBzaG93KG9iaklkKSB7XG5cdFx0YWxsUHVzaE1lbnVzW29iaklkXS5leHBvc2UoKTtcblx0fVxuXG5cdC8vIFRPRE86IGRpc21pc3Mgb24gY2xpY2s/XG5cdC8vIHRoaXMgd29ya3M6XG5cblx0Ly/PgCgnLnBpLXB1c2htZW51IGxpIGEnKS5mb3JFYWNoKGZ1bmN0aW9uKGEpe1xuXHQvL1x0YS5vbmNsaWNrID0gZnVuY3Rpb24oKXtcblx0Ly9cdFx0dGhpcy5wYXJlbnQoJy5waS1wdXNobWVudScpLs+AMSgnLnBpLW1vZGFsLWNsb3NlLWJ1dHRvbicpLmNsaWNrKCk7XG5cdC8vXHRcdGNvbnNvbGUubG9nKFwibWVzc2FnZVwiKTtcblx0Ly9cdH07XG5cdC8vfSk7XG5cblxuXHRmdW5jdGlvbiBQdXNoTWVudShlbCkge1xuXHRcdHZhciBodG1sID0gz4AxKCdodG1sJyk7XG5cdFx0dmFyIGJvZHkgPSDPgDEoJ2JvZHknKTtcblxuXHRcdHZhciBvdmVybGF5ID0gz4AuZGl2KFwib3ZlcmxheVwiKTtcblx0XHR2YXIgY29udGVudCA9IM+ALmRpdignY29udGVudCcsIG51bGwsIGVsLs+AMSgnKicpKTtcblxuXHRcdHZhciBzaWRlID0gZWwuZ2V0QXR0cmlidXRlKFwiZGF0YS1zaWRlXCIpIHx8IFwicmlnaHRcIjtcblxuXHRcdHZhciBzbGVkID0gz4AuZGl2KFwic2xlZFwiKTtcblx0XHRzbGVkLmNzcyhzaWRlLCAwKTtcblxuXHRcdHZhciB0b3BCYXIgPSDPgC5kaXYoXCJ0b3AtYmFyXCIpO1xuXG5cdFx0dG9wQmFyLmZpbGwoz4AubW9kYWxDbG9zZUJ1dHRvbihjbG9zZU1lKSk7XG5cdFx0c2xlZC5maWxsKFt0b3BCYXIsIGNvbnRlbnRdKTtcblxuXHRcdG92ZXJsYXkuZmlsbChzbGVkKTtcblx0XHRlbC5maWxsKG92ZXJsYXkpO1xuXG5cdFx0c2xlZC5vbmNsaWNrID0gZnVuY3Rpb24oZSl7XG5cdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdH07XG5cblx0XHRvdmVybGF5Lm9uY2xpY2sgPSBjbG9zZU1lO1xuXG5cdFx0z4AubGlzdGVuKGNsb3NlTWUsICdyZXNpemUnKTtcblxuXHRcdGZ1bmN0aW9uIGNsb3NlTWUoZSkge1xuXHRcdFx0dmFyIHQgPSBlLnRhcmdldDtcblx0XHRcdGlmICh0ID09IHNsZWQgfHwgdCA9PSB0b3BCYXIpIHJldHVybjtcblxuXHRcdFx0ZWwua2lsbENsYXNzKFwib25cIik7XG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGVsLmNzcyh7ZGlzcGxheTogXCJub25lXCJ9KTtcblxuXHRcdFx0XHRib2R5LmtpbGxDbGFzcyhcIm92ZXJsYXktb25cIik7XG5cdFx0XHR9LCAzMDApO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGV4cG9zZU1lKCl7XG5cdFx0XHRib2R5LmFkZENsYXNzKFwib3ZlcmxheS1vblwiKTsgLy8gaW4gdGhlIGRlZmF1bHQgY29uZmlnLCBraWxscyBib2R5IHNjcm9sbGluZ1xuXG5cdFx0XHRlbC5jc3Moe1xuXHRcdFx0XHRkaXNwbGF5OiBcImJsb2NrXCIsXG5cdFx0XHRcdHpJbmRleDogz4AuaGlnaGVzdFooKVxuXHRcdFx0fSk7XG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGVsLmFkZENsYXNzKFwib25cIik7XG5cdFx0XHR9LCAxMCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4cG9zZTogZXhwb3NlTWVcblx0XHR9O1xuXHR9XG5cblx0z4AubW9kcy5wdXNoKGluaXQpO1xuXG5cdHJldHVybiB7XG5cdFx0c2hvdzogc2hvd1xuXHR9O1xufSkoKTtcbiIsInZhciBrdWIgPSAoZnVuY3Rpb24gKCkge1xuXHTPgC5saXN0ZW4oaW5pdCk7XG5cblx0dmFyIEhFQURFUl9IRUlHSFQ7XG5cdHZhciBodG1sLCBib2R5LCBtYWluTmF2LCBxdWlja3N0YXJ0QnV0dG9uLCB3aXNoRmllbGQ7XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHTPgC5jbGVhbihpbml0KTtcblxuXHRcdGh0bWwgPSDPgDEoJ2h0bWwnKTtcblx0XHRib2R5ID0gz4AxKCdib2R5Jyk7XG5cdFx0bWFpbk5hdiA9IM+AZChcIm1haW5OYXZcIik7XG5cdFx0d2lzaEZpZWxkID0gz4BkKCd3aXNoRmllbGQnKTtcblx0XHRIRUFERVJfSEVJR0hUID0gz4AxKCdoZWFkZXInKS5vZmZzZXQoKS5oZWlnaHQ7XG5cblx0XHRxdWlja3N0YXJ0QnV0dG9uID0gz4BkKCdxdWlja3N0YXJ0QnV0dG9uJyk7XG5cblx0XHRidWlsZElubGluZVRPQygpO1xuXG5cdFx0c2V0WUFIKCk7XG5cblxuXHRcdGFkanVzdEV2ZXJ5dGhpbmcoKTtcblxuXHRcdM+ALmxpc3RlbihhZGp1c3RFdmVyeXRoaW5nLCAncmVzaXplJyk7XG5cdFx0z4AubGlzdGVuKGFkanVzdEV2ZXJ5dGhpbmcsICdzY3JvbGwnKTtcblx0XHTPgC5saXN0ZW4oaGFuZGxlS2V5c3Ryb2tlcywgJ2tleWRvd24nKTtcblx0XHR3aXNoRmllbGQubGlzdGVuKGhhbmRsZUtleXN0cm9rZXMsICdrZXlkb3duJyk7XG5cblx0XHRkb2N1bWVudC5vbnVubG9hZCA9IGZ1bmN0aW9uKCl7XG5cdFx0XHTPgC5jbGVhbihhZGp1c3RFdmVyeXRoaW5nLCAncmVzaXplJyk7XG5cdFx0XHTPgC5jbGVhbihhZGp1c3RFdmVyeXRoaW5nLCAnc2Nyb2xsJyk7XG5cdFx0XHTPgC5jbGVhbihoYW5kbGVLZXlzdHJva2VzLCAna2V5ZG93bicpO1xuXHRcdFx0d2lzaEZpZWxkLmNsZWFuKGhhbmRsZUtleXN0cm9rZXMsICdrZXlkb3duJyk7XG5cdFx0fTtcblxuXHRcdM+ALmxpc3RlbihjbG9zZU9wZW5NZW51LCAncmVzaXplJyk7XG5cblx0XHRmdW5jdGlvbiBjbG9zZU9wZW5NZW51KCkge1xuXHRcdFx0aWYgKGh0bWwuaGFzQ2xhc3MoJ29wZW4tbmF2JykpIHRvZ2dsZU1lbnUoKTtcblx0XHR9XG5cblx0XHTPgCgnLmRyb3Bkb3duJykuZm9yRWFjaChmdW5jdGlvbihkcm9wZG93bikge1xuXHRcdFx0dmFyIHJlYWRvdXQgPSBkcm9wZG93bi7PgDEoJy5yZWFkb3V0Jyk7XG5cdFx0XHRyZWFkb3V0LmlubmVySFRNTCA9IGRyb3Bkb3duLs+AMSgnYScpLmlubmVySFRNTDtcblx0XHRcdHJlYWRvdXQub25jbGljayA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0ZHJvcGRvd24udG9nZ2xlQ2xhc3MoJ29uJyk7XG5cdFx0XHRcdM+ALmxpc3RlbihjbG9zZU9wZW5Ecm9wZG93biwgJ2NsaWNrJyk7XG5cblx0XHRcdFx0ZnVuY3Rpb24gY2xvc2VPcGVuRHJvcGRvd24oZSkge1xuXHRcdFx0XHRcdGlmIChkcm9wZG93bi5oYXNDbGFzcygnb24nKSAmJiAhKGRyb3Bkb3duV2FzQ2xpY2tlZChlKSkpIHtcblx0XHRcdFx0XHRcdM+ALmNsZWFuKGNsb3NlT3BlbkRyb3Bkb3duLCAnY2xpY2snKTtcblx0XHRcdFx0XHRcdGRyb3Bkb3duLmtpbGxDbGFzcygnb24nKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmdW5jdGlvbiBkcm9wZG93bldhc0NsaWNrZWQoZSkge1xuXHRcdFx0XHRcdHJldHVybiBlLnRhcmdldC5pc0hlaXJPZkNsYXNzKCdkcm9wZG93bicpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH0pO1xuXG5cdFx0c2V0SW50ZXJ2YWwoc2V0Rm9vdGVyVHlwZSwgMTApO1xuXHR9XG5cblx0dmFyIHRvY0NvdW50ID0gMDtcblxuXHRmdW5jdGlvbiBidWlsZElubGluZVRPQygpIHtcblx0XHR2YXIgZG9jc0NvbnRlbnQgPSDPgGQoJ2RvY3NDb250ZW50Jyk7XG5cdFx0dmFyIHBhZ2VUT0MgPSDPgGQoJ3BhZ2VUT0MnKTtcblxuXHRcdGlmIChwYWdlVE9DKSB7XG5cdFx0XHR2YXIgaGVhZGVycyA9IGRvY3NDb250ZW50LmtpZHMoJyNwYWdlVE9DLCBoMSwgaDIsIGgzLCBoNCwgaDUsIGg2Jyk7XG5cdFx0XHRoZWFkZXJzLnNwbGljZSgwLCBoZWFkZXJzLmluZGV4T2YocGFnZVRPQykgKyAxKTtcblxuXHRcdFx0dmFyIHRvYyA9IM+ALnVsKCk7XG5cdFx0XHRwYWdlVE9DLmFkZCh0b2MpO1xuXG5cdFx0XHRoZWFkZXJzLmZvckVhY2goZnVuY3Rpb24gKGhlYWRlcikge1xuXHRcdFx0XHR2YXIgYW5jaG9yTmFtZSA9ICdwYWdlVE9DJyArIHRvY0NvdW50Kys7XG5cblx0XHRcdFx0dmFyIGxpbmsgPSDPgC5jb250ZW50RWxlbWVudCgnYScsIDAsIDAsIGhlYWRlci5pbm5lckhUTUwpO1xuXHRcdFx0XHRsaW5rLmhyZWYgPSAnIycgKyBhbmNob3JOYW1lO1xuXHRcdFx0XHRsaW5rLmFkZENsYXNzKGhlYWRlci50YWdOYW1lKTtcblxuXHRcdFx0XHR2YXIgYW5jaG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuXHRcdFx0XHRhbmNob3IuYWRkQ2xhc3MoJ3BhZ2VBbmNob3InKTtcblx0XHRcdFx0YW5jaG9yLm5hbWUgPSBhbmNob3JOYW1lO1xuXHRcdFx0XHRkb2NzQ29udGVudC5pbnNlcnRCZWZvcmUoYW5jaG9yLCBoZWFkZXIpO1xuXG5cdFx0XHRcdHRvYy5hZGQoz4AubGkoMCwgMCwgbGluaykpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gc2V0WUFIKCkge1xuXHRcdHZhciBwYXRobmFtZSA9IGxvY2F0aW9uLmhyZWY7XG5cblx0XHR2YXIgY3VycmVudExpbmsgPSBudWxsO1xuXG5cdFx0z4BkKCdkb2NzVG9jJykuz4AoJ2EnKS5mb3JFYWNoKGZ1bmN0aW9uIChsaW5rKSB7XG5cdFx0XHRpZiAocGF0aG5hbWUuaW5kZXhPZihsaW5rLmhyZWYpICE9PSAtMSkge1xuXHRcdFx0XHRjdXJyZW50TGluayA9IGxpbms7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRpZiAoY3VycmVudExpbmspIHtcblx0XHRcdGN1cnJlbnRMaW5rLnBhcmVudHMoJ2Rpdi5pdGVtJykuZm9yRWFjaChmdW5jdGlvbiAocGFyZW50KSB7XG5cdFx0XHRcdHBhcmVudC7PgDEoJy50aXRsZScpLmNsaWNrKCk7XG5cdFx0XHRcdGN1cnJlbnRMaW5rLmFkZENsYXNzKCd5YWgnKTtcblx0XHRcdFx0Y3VycmVudExpbmsuaHJlZiA9ICcnO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gc2V0Rm9vdGVyVHlwZSgpIHtcblx0XHRpZiAoaHRtbC5pZCA9PSBcImRvY3NcIikge1xuXHRcdFx0dmFyIGJvZHlIZWlnaHQgPSDPgGQoJ2hlcm8nKS5vZmZzZXQoKS5oZWlnaHQgKyDPgGQoJ2VuY3ljbG9wZWRpYScpLm9mZnNldCgpLmhlaWdodDtcblx0XHRcdHZhciBmb290ZXIgPSDPgDEoJ2Zvb3RlcicpO1xuXHRcdFx0dmFyIGZvb3RlckhlaWdodCA9IGZvb3Rlci5vZmZzZXQoKS5oZWlnaHQ7XG5cdFx0XHRib2R5LmNsYXNzT25Db25kaXRpb24oJ2ZpeGVkJywgd2luZG93LmlubmVySGVpZ2h0IC0gZm9vdGVySGVpZ2h0ID4gYm9keUhlaWdodCk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gYWRqdXN0RXZlcnl0aGluZygpIHtcblx0XHRpZiAoIWh0bWwuaGFzQ2xhc3MoJ29wZW4tbmF2JykpIEhFQURFUl9IRUlHSFQgPSDPgDEoJ2hlYWRlcicpLm9mZnNldCgpLmhlaWdodDtcblx0XHRodG1sLmNsYXNzT25Db25kaXRpb24oJ2ZsaXAtbmF2Jywgd2luZG93LnBhZ2VZT2Zmc2V0ID4gMCk7XG5cdH1cblxuXHRmdW5jdGlvbiB0b2dnbGVNZW51KCkge1xuXHRcdGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IDgwMCkge1xuXHRcdFx0z4AucHVzaG1lbnUuc2hvdygncHJpbWFyeScpO1xuXHRcdH1cblxuXHRcdGVsc2Uge1xuXHRcdFx0dmFyIG5ld0hlaWdodCA9IEhFQURFUl9IRUlHSFQ7XG5cblx0XHRcdGlmICghaHRtbC5oYXNDbGFzcygnb3Blbi1uYXYnKSkge1xuXHRcdFx0XHRuZXdIZWlnaHQgPSBtYWluTmF2Lm9mZnNldCgpLmhlaWdodDtcblx0XHRcdH1cblxuXHRcdFx0z4AxKCdoZWFkZXInKS5jc3Moe2hlaWdodDogcHgobmV3SGVpZ2h0KX0pO1xuXHRcdH1cblxuXHRcdGh0bWwudG9nZ2xlQ2xhc3MoJ29wZW4tbmF2Jyk7XG5cdH1cblxuXHRmdW5jdGlvbiBzdWJtaXRXaXNoKHRleHRmaWVsZCkge1xuXHRcdHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKFwiaHR0cHM6Ly9naXRodWIuY29tL2t1YmVybmV0ZXMva3ViZXJuZXRlcy5naXRodWIuaW8vaXNzdWVzL25ldz90aXRsZT1JJTIwd2lzaCUyMFwiICtcblx0XHRcdHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArIFwiJTIwXCIgKyB0ZXh0ZmllbGQudmFsdWUgKyBcIiZib2R5PUklMjB3aXNoJTIwXCIgK1xuXHRcdFx0d2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgXCIlMjBcIiArIHRleHRmaWVsZC52YWx1ZSk7XG5cblx0XHR0ZXh0ZmllbGQudmFsdWUgPSAnJztcblx0XHR0ZXh0ZmllbGQuYmx1cigpO1xuXHR9XG5cblx0ZnVuY3Rpb24gaGFuZGxlS2V5c3Ryb2tlcyhlKSB7XG5cdFx0c3dpdGNoIChlLndoaWNoKSB7XG5cdFx0XHRjYXNlIDEzOiB7XG5cdFx0XHRcdGlmIChlLmN1cnJlbnRUYXJnZXQgPT09IHdpc2hGaWVsZCkge1xuXHRcdFx0XHRcdHN1Ym1pdFdpc2god2lzaEZpZWxkKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblxuXHRcdFx0Y2FzZSAyNzoge1xuXHRcdFx0XHRpZiAoaHRtbC5oYXNDbGFzcygnb3Blbi1uYXYnKSkge1xuXHRcdFx0XHRcdHRvZ2dsZU1lbnUoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdHRvZ2dsZU1lbnU6IHRvZ2dsZU1lbnVcblx0fTtcbn0pKCk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
