/**
 * file: SolidSurface.js
 */
var SolidSurface = function(dims, coords, opacity, color) {
    Surface.call(this, dims, coords, opacity);
    this.color = color;
    
    this.html = '<div id="surface_' + this.id + '" style="' + 
    	   'position: absolute;' +
    	   'top: ' + this.coords.top + 'px;' +
    	   'left: ' + this.coords.left + 'px;' +	
           'width: '+ this.dims.width + 'px; ' +
           'height: ' + this.dims.height + 'px; ' +
           'background-color: #' + this.color + '; ' +
           'display: none;' +
           'opacity: ' + this.opacity + '; ' +
           'overflow: hidden;' +
           'z-index: ' + this.coords.z + ';' +
           '"></div>';
    
    adv.screen.append(this.html);
    this.isLoaded = true;
};

adv.inherit(SolidSurface, Surface);

SolidSurface.prototype.show = function() {
    if (!this.isLoaded) {
        adv.screen.append(this.html);
        this.isLoaded = true;
    }
    $("#surface_" + this.id).show();
};

SolidSurface.prototype.hide = function() {
    $("#surface_" + this.id).hide();
};

SolidSurface.prototype.unload = function() {
    if (this.isLoaded) {
        $("#screen > #surface_" + this.id).remove();
        this.isLoaded = false;
    }
};

SolidSurface.prototype.getColor = function() {
	return this.color;
};

SolidSurface.prototype.setColor = function(color) {
	this.color = color;
	$("#surface_" + this.id).css("background-color", "#" + this.color);
}

SolidSurface.prototype.moveRelative = function(left, top) {
    $('#surface_' + this.id).position({left: this.coords.left + left, top: this.coords.top + top});
};

SolidSurface.prototype.moveAbsolute = function(left, top) {
    $('#surface_' + this.id).position({left: left, top: top});
};

SolidSurface.prototype.setZ = function(z) {
    $('#surface_' + this.id).css("z-index", "" + z);
};


