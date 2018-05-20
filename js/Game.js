var TopDownGame = TopDownGame || {};

//title screen
TopDownGame.Game = function(){};

TopDownGame.Game.prototype = {
  create: function() {
    this.map = this.game.add.tilemap('level1');
    this.map.addTilesetImage('tiles', 'gameTiles');

    this.backgroundLayer = this.map.createLayer('backgroundLayer')
    this.blockedLayer = this.map.createLayer('blockedLayer');

    this.map.setCollisionBetween(1, 2000, true, 'blockedLayer');
    this.backgroundLayer.resizeWorld();

    this.createItems();
    this.createDoors();
    var result = this.findObjectsByType('playerStart', this.map, 'objectsLayer');
    this.player = this.game.add.sprite(result[0].x, result[0].y, 'player');
    this.game.physics.arcade.enable(this.player);
    this.game.camera.follow(this.player);
    this.cursors = this.game.input.keyboard.createCursorKeys();
    //this.createPlayer();
  },
  update: function() {
    this.game.physics.arcade.collide(this.player, this.blockedLayer);
    this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);
    this.game.physics.arcade.overlap(this.player, this.doors, this.enterDoor, null, this);

    this.player.body.velocity.y = 0;
    this.player.body.velocity.x = 0;
    if(this.cursors.up.isDown) {
      this.player.body.velocity.y -= 50;
    } else if(this.cursors.down.isDown) {
      this.player.body.velocity.y += 50;
    } else if(this.cursors.left.isDown) {
      this.player.body.velocity.x -= 50;
    } else if(this.cursors.right.isDown) {
      this.player.body.velocity.x += 50;
    }
  },
  collect: function(player, collectable) {
    console.log('yummy');
    collectable.destroy();
  },
  enterDoor: function(player, door) {
    console.log('entering door that will take you to', door.targetTilemap, 'on x:', door.targetX, 'and y:', door.targetY);
  },
  createItems: function() {
    //create items
    this.items = this.game.add.group();
    this.items.enableBody = true;
    var item;
    result = this.findObjectsByType('item', this.map, 'objectsLayer');
    result.forEach(function(element){
      this.createFromTiledObject(element, this.items);
    }, this);
  },
  createDoors: function() {
    this.doors = this.game.add.group();
    this.doors.enableBody = true;
    result = this.findObjectsByType('door', this.map, 'objectsLayer');
    result.forEach(function(element) {
      this.createFromTiledObject(element, this.doors);
    }, this);
  },
  createPlayer: function() {
  },
  findObjectsByType: function(type, map, layer) {
    var result = new Array();
    map.objects[layer].forEach(function(element) {
      if(element.properties.type === type) {
        element.y -= map.tileHeight;
        result.push(element);
      }
    });
    return result;
  },
  createFromTiledObject: function(element, group) {
    var sprite = group.create(element.x, element.y, element.properties.sprite);
    Object.keys(element.properties).forEach(function(key) {
      sprite[key] = element.properties[key];
    });
  }
};
