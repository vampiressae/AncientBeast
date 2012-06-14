function Sprite(renderer, opts) {
    Drawable.prototype.constructor.call(this);
    opts = opts || {};
    this.position        = opts["position"] || new Vector2D(0,0);
    this.size            = opts["size"] || new Vector2D(4,2.5);
    this.texturePosition = opts["texturePosition"] || new Vector2D(0,0);
    this.textureSize     = opts["textureSize"] || new Vector2D(0, 0);
    this.image = opts["image"] || null;
}

Sprite.prototype = new Drawable();
Sprite.prototype.constructor = Sprite;

Sprite.prototype.draw = function(renderer) {
    renderer.bindTexture("creatures/Magma-Spawn-carboard.png");
    renderer.drawImage(this.position, this.size, this.texturePosition, this.textureSize);
}
