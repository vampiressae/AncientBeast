function Creature(centerTile, renderer) {
    var _this = this;
        
    Creature.prototype.constructor.call(this, renderer);
    this.name = "new Creature";
    
    // collision map:
    // 0 does not collide on this tile
    // 1 collides on this tile
    // 2 blocks tile for creatures, but does not collide with terrain (flying)
    this.collisionMap = [
//        [0,1,1],
         [1,1,1]
    ];
    
    this.footOffset = new Vector2D(0.8, 0);
    
    this.setAtTile(centerTile); //TODO add a check if is free
}
Creature.prototype = new Sprite();

Creature.prototype.loadJson = function(path, renderer, callback) {
    var _this = this;
    $.getJSON(path, function(data) {

        //_this.footOffset = Vector2D.restoreFromJson(data.footCenter).toUnitSpace(renderer);
        _this.texturePosition = new Vector2D(0,0);
        _this.textureSize     = Vector2D.restoreFromJson(data.frameSize);
        _this.image = data.image;
        
        // TODO load collision        

        if (_this.centerTile) {
            //TODO get number of horizontal tiles don't use a fixed value
            _this.size = _this.centerTile.tileMap.tilesSize.multiply(3);
            //TODO set as pixel
            _this.footOffset = _this.size.multiply(Vector2D.restoreFromJson(data.footCenter));
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

    //TODO either don't take the center tile, or get the real center position by
    //     using median position of the sum of the positions of all blocked tiles
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
