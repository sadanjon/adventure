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
        
        $(window).bind("finishedAction", function() {
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
    scripts: {
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
    room: undefined,
    update: function (d) {
    	for (obj in this.objects) {
    		obj.update(d);
    	}    	
    }    
};

var adv = adventure;

