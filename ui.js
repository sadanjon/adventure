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




