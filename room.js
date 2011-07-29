/**
 * file: room.js
 */

var room = function(spec) {
	return {
		background : [],
		draw : function() {
			// nothing, all white
		},
		scripts : {
			doNext : function() {
				if (this.current === null) {
					return false;
				}
				if (this.index >= this.current.length) {
					this.current = null;
					this.index = 0;
					return false;
				}

				var action = this.current[this.index], obj = spec.adv[action[0]];

				for ( var i = 1; i < action.length - 2; ++i) {
					obj = obj[action[i]];
				}

				obj[action[i]].apply(obj, action[i + 1]);
				this.index += 1;

				return true;
			},
			current : null,
			index : 0,
			pickupPaper : [
					[ 'guy', 'walkto', [{left : 500,top : 300}]],
					['guy',	'talk',	[ [ "Hello there", "My name is Guybrush Threepwood" ] ] ] 
			]
		},
		adv: spec.adv
	};

	var GameObject = function(spec) {
		return {
			id : spec.id,
			name : spec.name
		};
	};
};