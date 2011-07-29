var TextSurface = function(dims, coords, opacity, text, font, color, bgcolor) {
    Surface.call(this, dims, coords, opacity);
    this.text = text;
    this.font = font;
    
    if (typeof color !== "undefined") {
    	this.color = color;
    } else {
    	this.color = "000000";
    }
    
    if (typeof bgcolor !== "undefined") {
    	this.bgcolor = bgcolor;
    } else {
    	this.bgcolor = null;
    }
    
    this.html = '<div id="surface_' + this.id + '" style="' + 
    	   'position: absolute;' +
    	   'top: ' + this.coords.top + 'px; ' +
    	   'left: ' + this.coords.left + 'px; ' +
    	   'padding: '+ this.dims.topbottom + 'px ' +
    	   this.dims.leftright + 'px; ';
           
    if (this.bgcolor === null) {
    	this.html += 'background-color: #' + this.bgcolor + '; ';
    }
    this.html += 'color: #' + this.color + '; ' +
           'font: ' + this.font + '; ' + 
           'display: none;' +
           'opacity: ' + this.opacity + '; ' +
           'overflow: hidden;' +
           'z-index: ' + this.coords.z + ';' +
           'cursor: default; ' +
           '">' + this.text + '</div>';  
    
    adv.screen.append(this.html);
    this.isLoaded = true;
};

adv.inherit(TextSurface, Surface);

TextSurface.prototype.show = function() {
    if (!this.isLoaded) {
    	adv.screen.append(this.html);
        this.isLoaded = true;
    }
    $("#surface_" + this.id).show();
};
/**
 * file: TextSurface.js
 */
TextSurface.prototype.hide = function() {
    $("#surface_" + this.id).hide();
};

TextSurface.prototype.unload = function() {
    if (this.isLoaded) {
    	$("#surface_" + this.id).remove();
        this.isLoaded = false;
    }
};

TextSurface.prototype.getWidth = function() {
	return $("#surface_" + this.id).width();
};

TextSurface.prototype.getHeight = function() {
	return $("#surface_" + this.id).outerHeight(true);
};

TextSurface.prototype.getText = function() {
	return this.text;
};

TextSurface.prototype.getColor = function() {
	return this.color;
};

TextSurface.prototype.getBgColor = function() {
	return this.bgcolor;
};

TextSurface.prototype.setText = function(text) {
	this.text = text;
	$("#surface_" + this.id).text(this.text);
};

TextSurface.prototype.setColor = function(color) {
	this.color = color;
	$("#surface_" + this.id).css("color", "#" + color);
};

TextSurface.prototype.setBgColor = function(bgcolor) {
	this.bgcolor = bgcolor;
	$("#surface_" + this.id).css("background-color", "#" + bgcolor);
};


TextSurface.prototype.moveRelative = function(left, top) {
    $('#surface_' + this.id).position({left: this.coords.left + left, top: this.coords.top + top});
};

TextSurface.prototype.moveAbsolute = function(left, top) {
	if (this.isLoaded) {
		$("#surface_" + this.id).css("top", top + "px");
		$("#surface_" + this.id).css("left", left + "px");
	}
};

TextSurface.prototype.setZ = function(z) {
    $('#surface_' + this.id).css("z-index", z.toString());
};

