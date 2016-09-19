$(document).ready(function() {

  var CHARCODES = {
    "0": 48,
    "1": 49,
    "2": 50,
    "3": 51,
    "4": 52,
    "5": 53,
    "6": 54,
    "7": 55,
    "8": 56,
    "9": 57
  }

  function Game(opts){
    this.track = new Track(opts.players_data, opts.track_data);
    this.players = this.track.players;
  }
  Game.prototype = {
    render: function(){
      this.track.render();

      // bind reset button
      var self = this;
      $("button").click(function(){
        self.reset();
      });
    },
    begin: function(){
      var self = this;
      $(document).on("keyup", evaluateKeypress);

      ////

        function evaluateKeypress(e){
          self.players.forEach(function(player){
            if(e.which === player.charCode) {
              self.track.move(player);
              checkForWinner(player);
            }
          })
        }

        function checkForWinner(player){
          if (player.position >= self.track.length) {
            alert(player.name + " " + "Wins!");
            self.reset();
          }
        }
    },
    reset: function(){
      $(document).off("keyup");
      // $("button").off("click");
      this.track.reset();
      this.begin();
    }
  }

  function Track(players, opts){
    this.players = (players || []).map(function(config){
      return new Player(config);
    });
    this.$track = $(opts.selector || "#track");
    this.length = opts.length || 10;
    this.move_amount = opts.move_amount || 9;
  }
  Track.prototype = {
    render: function(){
      var player_height = Math.round(100/this.players.length) + "vh";
      var player_dimensions = {
        "height": player_height,
        "width": player_height,
        "left": 0 // start position
      };
      this.$track.html(
        this.players.map(function(player){
          return player.$el.css(player_dimensions);
        })
      );
    },
    move: function(player){
      player.move();
      player.$el.css("left", player.position * this.move_amount + "vw");
    },
    reset: function(){
      this.players.forEach(function(player){
        player.reset();
      });
      this.render();
    }
  };

  function PlayerView(){}
  PlayerView.render = function(player){
    var pv = $("<div>", {
      class: "player",
      text: player.name,
      css: { backgroundColor: player.color }
    });
    player.$el = pv;
    return pv;
  }

  function Player(opts){
    this.name = opts.name;
    this.key = opts.key;
    this.charCode = CHARCODES[this.key];
    this.position = 0;
    this.color = opts.color || "none";
    this.$el = PlayerView.render(this);
  }
  Player.prototype = {
    move: function(){
      this.position++;
    },
    reset: function(){
      this.position = 0;
    }
  };

  var game = new Game({
    track_data: {},
    players_data: [
      {
        key: "0",
        name: "Zero",
        color: "red"
      },
      {
        key: "1",
        name: "One",
        color: "orange"
      },
      {
        key: "2",
        name: "Two",
        color: "green"
      },
      {
        key: "3",
        name: "Three",
        color: "blue"
      },
      {
        key: "4",
        name: "Four",
        color: "teal"
      },
      {
        key: "5",
        name: "Five",
        color: "purple"
      }
    ]
  });
  game.render();
  game.begin();


});
