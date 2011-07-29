/**
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
	rightBentFrame = {
		top: 1296,
		left: 0
	},
	leftBentFrame = {
		top: 1440,
		left: 0
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
	target, temp;

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
					
					$(window).trigger("finishedAction");
					
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
			case Guy.states.bent:
				if (bent >= 500) {
					state = Guy.states.rest;
					if (facing === Guy.facings.right) {
						surface.clip(rightRestFrame);
					} else {
						surface.clip(leftRestFrame);
					}
					$(window).trigger("finishedAction");
				}
				temp += d;
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
						
						$(window).trigger("finishedAction");
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
		bendOver: function() {
			var frame;
			state = Guy.states.bent;	
			temp = 0;
			if (facing === Guy.facings.right) {
				frame = rightBentFrame;
			} else {
				frame = leftBentFrame;
			}
			surface.clip(frame);
		},
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
	talk: 2,
	bent: 3
};

Guy.speedFactor = 100;
