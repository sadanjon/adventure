/**
 * file: ImageSurface.js
 */

var ImageSurface = function(dims, coords, opacity, image, clip) {
    Surface.call(this, dims, coords, opacity);
    this.image = image;
    if (typeof clip !== "undefined") {
        this.clip = clip;
    } else {
        this.clip = {left: 0, top: 0};
    }
    
    this.html = '<div id="surface_' + this.id + '" style="' + 
    	   'position: absolute;' +
    	   'top: ' + this.coords.top + 'px;' +
    	   'left: ' + this.coords.left + 'px;' +	
           'width: '+ this.dims.width + 'px; ' +
           'height: ' + this.dims.height + 'px; ' +
           'background: url(' + image + ') no-repeat top left; ' +
           'background-position: -' + this.clip.left + 'px -' + this.clip.top + 'px; ' +
           'display: none;' +
           'opacity: ' + this.opacity + '; ' +
           'overflow: hidden;' +
           'z-index: ' + this.coords.z + ';' +
           '"></div>';  
    
    adv.screen.append(this.html);
    this.isLoaded = true;
};

adv.inherit(ImageSurface, Surface);

ImageSurface.prototype.show = function() {
    if (!this.isLoaded) {
        adv.screen.append(this.html);
        this.isLoaded = true;
    }
    $("#surface_" + this.id).show();
};

ImageSurface.prototype.hide = function() {
    $("#surface_" + this.id).hide();
};

ImageSurface.prototype.unload = function() {
    if (this.isLoaded) {
        $("#screen > #surface_" + this.id).remove();
        this.isLoaded = false;
    }
};

ImageSurface.prototype.moveRelative = function(left, top) {
    $('#surface_' + this.id).position({left: this.coords.left + left, top: this.coords.top + top});
};

ImageSurface.prototype.moveAbsolute = function(left, top) {
    $('#surface_' + this.id).position({left: left, top: top});
};

ImageSurface.prototype.setZ = function(z) {
    $('#surface_' + this.id).css("z-index", z.toString());
};


