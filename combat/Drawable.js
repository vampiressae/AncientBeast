function Drawable() {
    this.onReadyCallback = null;
    this.loadingCounter = 0;
    this.loadingTarget  = 0;
}


// call when all textures are loaded and the Creature is ready to be displayed
Drawable.prototype.onReady = function() {
    if (this.onReadyCallback) {
        this.onReadyCallback();
    }
}

Drawable.prototype.loadingProgress = function() {
    if (this.loadingCounter >= this.loadingTarget) {
        this.onReady();
    }
}
