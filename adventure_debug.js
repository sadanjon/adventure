/**
 * file: adventure.js
 */

var adventure = {
    setup: function() {
        if (this.screen.length == 0) {
            console.log("error no screen DOM element found");
            return false;
        }
        this.screen.
            width(this.screen_width).
            height(this.screen_height).
            offset({top: this.top_space,
                    left: $(document).width()/2 - this.screen_width/2 }).
            css("overflow", "hidden");
        
        this.screenPosition = this.screen.offset();
        
        $(window).bind("changeState", function() {
        	adv.cutscenes.doNext();
        });
        
        return true;
    },
    create: function(proto) {
    	var F = function() {};
    	F.prototype = proto;
    	return new F();
    },
    color: function(r,g,b) {
    	r = (r < 16) ? "0" + r.toString(16) : r.toString(16);
    	g = (g < 16) ? "0" + g.toString(16) : g.toString(16);
    	b = (b < 16) ? "0" + b.toString(16) : b.toString(16);
    	return r + g + b; 
    },
    screen: $("#screen"),
    top_space: 50,
    screen_width: 1000,
    screen_height: 600,
    cutscenes: {
    	doNext: function() {
    		if (this.current === null) {
    			return false;
    		}
    		if (this.index >= this.current.length) {
    			this.current = null;
    			this.index = 0;
    			return false;
    		}
    		
    		var action = this.opening[this.index],
    			obj = adv[action[0]];
    		
    		for (var i = 1; i < action.length - 2; ++i) {
    			obj = obj[action[i]];
    		}
    		
    		obj[action[i]].apply(obj, action[i + 1]);
    		this.index += 1;
    		
    		return true;
    	},
    	current: null,
    	index: 0,
    	opening: [
    	    ['guy', 'walkto', [{left: 500, top: 300}]],
    	    ['guy', 'talk', [["Hello there", "My name is Guybrush Threepwood"]]]
    	] 	
    },
    objects: {},
    addObject: function(obj) {
    	this.objects[obj.id] = obj;
    },
    removeObject: function(obj) {
    	delete this.objects[obj.id];
    },
    update: function (d) {
    	for (obj in this.objects) {
    		obj.update(d);
    	}    	
    },
    click: function (position) {
    	var pos = {
    		left: position.left - this.screenPosition.left,
    		top: position.top - this.screenPosition.top
    	};
    	if (pos.left < 0 || pos.top < 0 || pos.left >= this.screen_width || 
    			pos.top >= this.screen_height - this.ui.height) {
    		return;
    	}
    	
    	for (obj in this.objects) {
    		obj.click(pos);
    	}    	
    	if (this.ui.target() === null) {
    		ui.verb("walk to");
    	}
    }
    
};

var adv = adventure;

var Err = function(msg) {
    this.msg = msg;
};

Err.prototype.getMessage = function() {
    return msg;
};

Err.prototype.printMessage = function() {
    console.log(this.msg);
};

Err.ABSTRACT_METHOD = new Err("Illegal invocation of abstract method");


/**
 * file: Surface.js
 */

var Surface = function(spec) {
	var isLoaded = false, html, 
		id = Surface.genID(), surface_div;
	
	// build html div
	html = '<div id="surface_' + id + '" ' + 
			'style="' + 'position: absolute; ' +
			'cursor: default; ' +
			'overflow: hidden; ' + 'display: none; ' + 
			'opacity: ' + (spec.opacity === undefined ? 1 : spec.opacity) + '; ' +
			'top: ' + spec.position.top + 'px;' + 
			'left: ' + spec.position.left + 'px;' + 
			'z-index: ' + (spec.zindex === undefined ? 0 : spec.zindex) + '; ';

	// an image or solid color surface
	if (spec.width !== undefined) {
		html += 'width: ' + spec.width + 'px; ' + 'height: ' + spec.height
				+ 'px; ';
		if (spec.image) {
			html += 'background: url(' + spec.image + ') no-repeat top left; ';
			if (spec.clip) {
				html += 'background-position: -' + spec.clip.left + 'px -'
						+ spec.clip.top + 'px; ';
			}
		} else if (spec.color) {
			html += 'background-color: ' + spec.color + '; ';
		}
		html += '"></div>';
		// text
	} else {
		if (spec.padding !== undefined) {
			html += 'padding: ' + spec.padding.topbottom + 'px '
					+ spec.padding.leftright + 'px; ';
		}
		if (spec.fontfamily !== undefined) {
			html += 'font: normal normal ' + (spec.fontsize || "1em") + ' \'' +
					spec.fontfamily + '\'; ';
		}
		if (spec.bgcolor) {
			html += 'background-color: ' + spec.bgcolor + '; ';
		}
		html += 'color: ' + (spec.color || "#000000") + "; " + '">' + spec.text
				+ '</div>';
	}

	adv.screen.append(html);
	surface_div = $("#surface_" + id);
	isLoaded = true;

	return {
		position: function(pos) {
			if (typeof pos === "object") {
				if (pos.top !== undefined) {
					surface_div.css("top", parseInt(pos.top) + "px");
				}
				if (pos.left !== undefined) {
					surface_div.css("left", parseInt(pos.left) + "px");
				}
			}

			return {
				top: surface_div.css("top"),
				left: surface_div.css("left")
			};
		},
		clip: function(clip) {
			if (clip !== undefined) {
				surface_div.css("background-position",
						"-" + clip.left + "px -" + clip.top + "px");
				return clip;
			}			
		},
		zindex: function(z) {
			if (z) {
				surface_div.css("z-index", z.toString());
			}

			return surface_div.css("z-index");
		},
		width: function(width) {
			if (width) {
				surface_div.css("width", width + "px");
			}
			return surface_div.outerWidth(true);
		},
		height: function(height) {
			if (height) {
				surface_div.css("height", height + "px");
			}
			return surface_div.outerHeight(true);
		},
		opacity: function(opacity) {
			if (opacity) {
				surface_div.css("opacity", opacity.toString());
			}
			return surface_div.css("opacity");
		},
		load: function() {
			if (!isLoaded) {
				$("#screen").append(html);
				surface_div = $("#surface_" + id);
				isLoaded = true;
			}
		},
		unload: function() {
			if (isLoaded) {
				$("#surface_" + id).remove();
				isLoaded = false;
			}
		},
		show: function() {
			if (!isLoaded) {
				this.load();
			}

			surface_div.show();
		},
		color: function(c) {
			if (spec.text !== undefined) {
				if (c !== undefined) {
					surface_div.css("color", c);
				}
				return surface_div.css("color");
			} else {
				if (c !== undefined) {
					surface_div.css("background-color", c);
				}
				return surface_div.css("background-color");
				
			}
		},
		text: function(t) {
			if (t !== undefined) {
				surface_div.html(t);
			}
			return surface_div.html();
		},
		hide: function() {
			if (isLoaded) {
				surface_div.hide();
			}
		},
		bind: function(eventname, data, callback) {
			surface_div.bind(eventname, data, callback);
		},
		id: function() {
			return id;
		}
	};
};

Surface.genID = function() {
	var ID = 0;
	return function() {
		var temp = ID;
		ID += 1;
		return temp;
	};
}();
/**
 * file: ui.js
 */

var ui = {
	setup: function() {
		this.height = 181;
		this.action = {verb: "walk to", target: null, ongoing: false};
		this.draw();
		adv.ui = this;
	},
	draw: function() {
		var labels = ["Give", "Open", "Close", "Pickup", "Look At", "Talk To", "Use", "Push", "Pull"], i,
			buttons = [], 
			button_top, 
			button_left, action_height = 13, dark = "#909469",
			light = "#c3c6a5",
			white = "#ffffff",
			background, action;
		
		if (this.height === undefined) {
			return;
		}
		
		background = Surface({
			position: {top: adv.screen_height - this.height, left: 0},
			color: "#000000",
			width: adv.screen_width,
			height: this.height,
			zindex: 9
		});
		background.show();
		
		action = Surface({
			padding: {topbottom: 3, leftright: 0},
			position: {top: adv.screen_height - this.height, left: 0},
			color: dark,
			fontfamily: "Press Start 2P",
			fontsize: "13px",
			zindex: 10,
			text: ""
		});
		
		
		$(window).bind("verb",{ui: this}, function(e, data) {
			var top = action.position().top;
			
			action.text(data.verb.toLowerCase());
			action.position({top: top, left: parseInt(adv.screen_width/2 - action.width()/2)});
			
			e.data.ui.action.target_number = -1;
			e.data.ui.action.verb_number = data.verb_number;
		});
		action.show();
		
		this.action.surface = action;
		
		ui.verb("walk to");
		
		button_top = adv.screen_height - this.height + action_height;
		button_left = 0;
		
		for (i = 0; i < labels.length; ++i) {
			if ((i % 3 == 0) && i > 0) {
				button_top = adv.screen_height - this.height + action_height;
				if (parseInt(i/3) == 1) {
					button_left += 150;
				} else if (parseInt(i/3) == 2) {
					button_left += 200;
				} 
			}
			buttons[i] = Surface({
				padding: {topbottom: 11, leftright: 8},
				position: {top: button_top, left: button_left},
				zindex: 10,
				text: labels[i],
				fontfamily: "Press Start 2P",
				fontsize: "25px",
				color: dark
			});
			buttons[i].bind("mouseenter", {button: buttons[i]}, function(e) {
				e.data.button.color(light);
			});
			buttons[i].bind("mouseout", {button: buttons[i]}, function(e) {
				e.data.button.color(dark);
			});
			buttons[i].bind("mousedown", {button: buttons[i]}, function(e) {
				e.data.button.color(white);
				e.preventDefault();
			});
			buttons[i].bind("mouseup", {button: buttons[i], verbNumber: i}, function(e) {
				e.data.button.color(light);
				e.preventDefault();
				
				ui.verb(ui.verb2(e.data.verbNumber));
			});
			buttons[i].show();
			button_top += buttons[i].height();		
		}
		
		this.button = function(x) {
			if (typeof x === "number") {
				return buttons[x];
			} else if (typeof x === "string") {
				return buttons[this.verb2num(x)];
			}
		};
	},
	verb2: function (){		
		var verbNums = {
			'give': 0,
			'open': 1,
			'close': 2,
			'pick up': 3,
			'look at': 4,
			'talk to': 5,
			'use': 6,
			'push': 7,
			'pull': 8,
			'walk to': 9
		},
		verbStrs = ["give", "open", "close", "pick up", "look at", "talk to", "use", "push", "pull", "walk to"];
		
		return function(verb) {
			if (typeof verb === "string") {
				return verbsNums[verb];
			} else {
				return verbStrs[verb];
			}
		};
	}(),
	target: function(target) {
		this.action.target = target;
		if (target !== undefined && target !== null) {
			this.changeActionText(this.action.verb + " " + target.name);
			this.action.ongoing = true;
		}
		return this.action.target;
	},
	verb: function(verb) {
		if (verb !== undefined) {
			this.action.verb = verb;
			this.action.target = null;
			this.changeActionText(verb);
		}
		return this.action.verb;
	},
	changeActionText: function(text) {
		var top = this.action.surface.position().top,
			width;
		
		this.action.surface.text(text);
		width = this.action.surface.width();
		this.action.surface.position({top: top, left: adv.screen_width/2 - width/2});
	}
};




/**
 * file: stage.js
 */

var stage = {
		
};/**
 * file: Animation.js
 */

var Animation = function(spec) {
	var currentIndex = 0,
		lastFrame = {};
	
	
	return {
		frame: function(index) {
			lastFrame.left = (index % spec.framesPerRow) * spec.frame.width + spec.start.left;
			lastFrame.top = parseInt(index / spec.framesPerRow) * spec.frame.height + spec.start.top;
			
			return lastFrame;
		},
		update: function() {
			var accum = 0;
			
			return function(d, reverse) {
				accum += d;
				if (accum >= 1000/spec.fps || lastFrame.left === undefined) {
					accum = 0;
					if (reverse) {
						currentIndex = (currentIndex - 1 >= 0 ? currentIndex - 1: spec.frames - 1)%spec.frames;
					} else {
						currentIndex = (currentIndex + 1)%spec.frames;
					}
					this.frame(currentIndex); 
					return lastFrame;
				} else {
					return lastFrame;
				}
			};
		}()
	};
		
};/**
 * file: room.js
 */

var room = {
	background: [],
	draw: function() {
		
	}
};/**
 * file: Guy.js
 */

var Guy = function(spec) {
	var rightAnimation = Animation({
		frame : {
			width : 100,
			height : 144
		},
		framesPerRow : 6,
		frames : 6,
		fps : 8,
		start : {
			left : 0,
			top : 432
		}
	}), leftAnimation = Animation({
		frame : {
			width : 100,
			height : 144
		},
		framesPerRow : 6,
		frames : 6,
		fps : 8,
		start : {
			left : 0,
			top : 576
		}
	}), downAnimation = Animation({
		frame : {
			width : 100,
			height : 144
		},
		framesPerRow : 6,
		frames : 6,
		fps : 8,
		start : {
			left : 0,
			top : 720
		}
	}), upAnimation = Animation({
		frame : {
			width : 100,
			height : 144
		},
		framesPerRow : 6,
		frames : 6,
		fps : 8,
		start : {
			left : 0,
			top : 864
		}
	}), talkRightAnimation = Animation({
		frame : {
			width : 100,
			height : 144
		},
		framesPerRow : 6,
		frames : 6,
		fps : 8,
		start : {
			left : 0,
			top : 1008
		}
	}), talkLeftAnimation = Animation({
		frame : {
			width : 100,
			height : 144
		},
		framesPerRow : 6,
		frames : 6,
		fps : 8,
		start : {
			left : 0,
			top : 1152
		}
	}), 
	rightRestFrame = {
			top : 1008,
			left : 0
	}, 
	leftRestFrame = {
			top : 1152,
			left : 500
	},
	surface = Surface({
		position : {left: spec.position.left - 50, top: spec.position.top - 144},
		width : 100,
		height : 144,
		image : "images/Guybrush.png"
	}), 
	currentPosition = {left: spec.position.left - 50, top: spec.position.top - 144},
	speed = 0.2,
	state = Guy.states.rest, 
	facing = spec.facing,
	target;

	leftAnimation.frame(5);
	
	if (facing === Guy.facings.right) {
		surface.clip(rightRestFrame);
	} else {
		surface.clip(leftRestFrame);
	}

	surface.show();

	return {
		id: "guy",
		name: "Guybrush",
		update : function(d) {
			switch (state) {
			case Guy.states.rest:
				break;
			case Guy.states.walk:
				var a = (currentPosition.top - target.top), 
					b = (currentPosition.left - target.left), 
					tempPos = {
						left: currentPosition.left,
						top: currentPosition.top
					},
					frame;

				if (Math.abs(b) > 5) {
					if (b < 0) {
						tempPos.left += d * speed;
						facing = Guy.facings.right;
					} else {
						tempPos.left -= d * speed;
						facing = Guy.facings.left;
					}
				}
				if (Math.abs(a) > 5) {
					if (a < 0) {
						tempPos.top += d * speed;
					} else {
						tempPos.top -= d * speed;
					}
				}
				
				if (tempPos.left == currentPosition.left &&
					tempPos.top == currentPosition.top) {
					state = Guy.states.rest;
					
					$(window).trigger("changeState");
					
					if (facing === Guy.facings.right) {
						surface.clip(rightRestFrame);
					} else {
						surface.clip(leftRestFrame);
					}
					return;
				}

				if (Math.abs(a) < Math.abs(b)) {
					if (tempPos.left < currentPosition.left) {
						frame = leftAnimation.update(d, true);
					} else {
						frame = rightAnimation.update(d);
					}
				} else {
					if (tempPos.top < currentPosition.top) {
						frame = upAnimation.update(d);
					} else {
						frame = downAnimation.update(d);
					}
				}
				
				currentPosition = tempPos;
				surface.position(currentPosition);
				surface.clip(frame);
				break;
			case Guy.states.talk:
				this.talk(d);
				break;
			default:
			}
		},
		walkto : function(position) {
			state = Guy.states.walk;
			target = {
				top : position.top - 144,
				left : position.left - 50
			};
		},
		talk: function() {
			var c_texts, c_time, i = 0,
				textSurface = Surface({
					position: {left: 0, top: 0},
					text: "",
					fontfamily: "Press Start 2P",
					color: "#000000"
				});
			return function(texts_d) {
				var frame;
				if (jQuery.isArray(texts_d)) {
					c_texts = texts_d;
					c_time = texts_d[0].length*Guy.speedFactor;
					i = 0;
					textSurface.text(texts_d[0]);
					textSurface.position({
						left: currentPosition.left + 100,
						top: currentPosition.top - 10
					});
					textSurface.show();
					state = Guy.states.talk;
					return;
				} else if (c_time <= 0){
					if (i + 1 < c_texts.length) {
						i += 1;
						c_time = c_texts[i].length*Guy.speedFactor;
						textSurface.text(c_texts[i]);
					} else {
						state = Guy.states.rest;
						textSurface.hide();
						if (facing === Guy.facings.right) {
							frame = rightRestFrame;
						} else {
							frame = leftRestFrame;
						}
						surface.clip(frame);
						
						$(window).trigger("changeState");
						return;
					}					
				} else {
					c_time -= texts_d;
				}
				
				if (facing === Guy.facings.right) {
					frame = talkRightAnimation.update(texts_d);
				} else {
					frame = talkLeftAnimation.update(texts_d);
				}
			
				surface.clip(frame);				
			};
		}(),
		click: function(position) {
			// nothing
		},
		state: function(newState) {
			
		}
	};
};

Guy.facings = {
		left: 0,
		right: 1
};

Guy.states = {
	rest: 0,
	walk: 1,
	talk: 2
};

Guy.speedFactor = 100;
/**
 * file: main.js
 */

$(document).ready(function() {
    if (!adventure.setup()) {
        return;
    }
    ui.setup();
    
    var guy = Guy({position: {left: 0, top: 300}, facing: Guy.facings.left});
    adv.guy = guy;
    
    adv.cutscenes.current = adv.cutscenes.opening;
    adv.cutscenes.doNext();
    
    $(window).bind('click', function(e) {
    	adv.click({left: e.pageX, top: e.pageY});
    });
    
    setInterval(function() {
    	guy.update(20);
    }, 20);
    
});
