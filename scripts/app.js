$(document).ready(function() {

  var ZERO_CHAR_CODE = 48;
  var ONE_CHAR_CODE = 49;
  var FIVE_CHAR_CODE = 53;

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
    this.move_amount = opts.move_amount || 40;
  }
  Track.prototype = {
    render: function(){
      this.$track.html(
        this.players.map(function(player){
          return player.$el;
        })
      );
    },
    move: function(player){
      player.move();
      player.$el.css("left", player.position * this.move_amount);
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
    var pv = $("<div>",{ class: "player", text: player.name});
    player.$el = pv;
    return pv;
  }

  function Player(opts){
    this.name = opts.name;
    this.charCode = opts.charCode;
    this.position = 0;
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
        charCode: ZERO_CHAR_CODE,
        name: "Hobbes"
      },
      {
        charCode: ONE_CHAR_CODE,
        name: "Calvin"
      },
      {
        charCode: FIVE_CHAR_CODE,
        name: "Pinky"
      }
    ]
  });
  game.render();
  game.begin();


});
