function Creature(centerTile, renderer) {
    var _this = this;
        
    Creature.prototype.constructor.call(this, renderer);
    this.name = "Magma Spwan";
    
    //TODO set size relative to tileSize
    
    // collision map:
    // 0 does not collide on this tile
    // 1 collides on this tile
    // 2 blocks tile for creatures, but does not collide with terrain (flying)
    this.collisionMap = [
        [0,1,1],
         [1,1,1]
    ];
    
    this.footOffset = new Vector2D(0.8, 0); //TODO set as pixel and convert
//    this.footPosition.toUnitSpace(renderer); 
    
    this.setAtTile(centerTile); //TODO add a check if is free
}
Creature.prototype = new Sprite();

Creature.prototype.loadJson = function(path, renderer, callback) {
    var _this = this;
    $.getJSON(path, function(data) {
        data.footCenter = Vector2D.restoreFromJson(data.footCenter);
        
        _this.texturePosition = new Vector2D(0,0);
        _this.textureSize     = Vector2D.restoreFromJson(data.frameSize);
        
        if (_this.centerTile) {
            _this.size = _this.centerTile.tileMap.tilesSize.multiply(3);
        } else {
            _this.size = Vector2D.restoreFromJson(data.frameSize).toUnitSpace(renderer);
        }
        
        if (callback) {
            callback();
        }
    });
}

//TODO shift offset rows
Creature.prototype.setAtTile = function(tile) {
    var _this = this;
    var tileMap = tile.tileMap;
    //TODO use a footPosition Vector2D
    this.position = tileMap.getTilePosition(tile);
    this.position = this.position.substract(this.footOffset);
    
    // clear old surrounding collision tiles
    this.foreachTile(function(t, collisionType) {
        if (collisionType > 0) {
            t.creature = null;
            t.filled = false;
        }
    });

    this.centerTile = tile;
    
    // occupy surrounding collision tiles
    this.foreachTile(function(t, collisionType) {
        if (collisionType > 0) {
            t.creature = _this;
            t.filled = true;
        }
    });
}

Creature.prototype.setTileStyle = function(filled, fillColor, color) {
    this.foreachTile(function(t, collisionType) {
        if (collisionType > 0) {
            filled    != null ? t.filled = filled : 0;
            fillColor != null ? t.fillColor = fillColor : 0;
            color     != null ? t.color = color : 0;
        }
    });
}

// callback gets tile:Tile, collisionType:int
Creature.prototype.foreachTile = function(callback) {
    if (this.centerTile) {
        var tileMap = this.centerTile.tileMap;
        for (var y=0; y < this.collisionMap.length; ++y) {
            for (var x=0; x < this.collisionMap[y].length; ++x) {
                var t = tileMap.getTileRelativeTo(this.centerTile, Math.floor(-(this.collisionMap[y].length/2)+x+1),
                                                                   Math.floor(-(this.collisionMap.length/2)+y+1));
                callback(t, this.collisionMap[y][x]);
            }
        }
    }
}
