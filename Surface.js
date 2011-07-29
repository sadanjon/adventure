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
