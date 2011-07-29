/**
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
		
};