var LobbyJoined = new Vue({
    el: '#DivLobbyJoined',
    data: {
      PlayerLobbyData: {
          LobbyName: undefined,
          NumberofPlayer: undefined,
          MapName: undefined,
          RaceID: undefined,
          TypeRace:undefined,
          LobbyID: undefined,
          PlayerListName:[]


        },

      imhost: false,
      me: undefined
    },
    methods: {
      //admin commands
      selectRace: function(raceid, name) {
        jcmp.CallEvent('Client/NewMapSelected',raceid,name);
        console.log("MapSelect");
      },
      selectType: function(typeid) {
        jcmp.CallEvent('Client/NewTypeSelected',typeid);
        console.log("TypeSelect");
      },
      lobbyKick: function(name) { // need to be replace by networkid
          // Event to kick the player
          //jcmp.CallEvent('Client/KickPlayer',networkId);
      },
      // end admin commands
      leaveLobby: function() {
        if (this.imhost){

          jcmp.CallEvent('DeleteLobby');
          this.imhost = false;
        }
        console.log("PlayerLeave");
        this.PlayerLobbyData.LobbyName = undefined ;
        this.PlayerLobbyData.NumberofPlayer = undefined ;
        this.PlayerLobbyData.MapName = undefined ;
        this.PlayerLobbyData.RaceID = undefined ;
        this.PlayerLobbyData.TypeRace = undefined ;
        this.PlayerLobbyData.LobbyID = undefined ;
        this.PlayerLobbyData.PlayerListName = [] ;

        $("#DivLobbyJoined").hide();
        jcmp.CallEvent('ShowServerList');

        jcmp.CallEvent('Client/Player_Remove_Lobby_Test');




      },

      Ready: function() {
        jcmp.CallEvent('CEF/ReadyButton');
        $("#ReadyB").hide();
        $("#NReadyB").show();


      },
      NotReady: function() {
        jcmp.CallEvent('CEF/NotReadyButton');
        $("#ReadyB").show();
        $("#NReadyB").hide();


      },
      StartRace : function(){
          jcmp.CallEvent('LaunchRace');
          console.log("Start Race");
          $("#TypeSelect").hide();
          $("#MapSelectdiv").hide();
          $("#DivLobbyJoined").hide();



      },
      ShowMapList: function(){
        $("#MapSelectdiv").show();
        jcmp.CallEvent('ShowMapSelectDiv',true);
        $("#DivLobbyJoined").hide();

      },
      ShowTypeList: function(){
        $("#TypeSelect").show();
        jcmp.CallEvent('ShowTypeSelectDiv',true);
        $("#DivLobbyJoined").hide();


      },
        generateThumbUrl: generateThumbUrl
    }

});


jcmp.AddEvent('CEF/PlayerJoinLobby',function(id,obj){ // Player joining the lobby

  let data = JSON.parse(obj);

    LobbyJoined.PlayerLobbyData.LobbyName = data.LobbyName;
    LobbyJoined.PlayerLobbyData.NumberofPlayer = data.NumberofPlayer;
    LobbyJoined.PlayerLobbyData.MapName = data.MapName;
    LobbyJoined.PlayerLobbyData.RaceID = data.RaceID;
    LobbyJoined.PlayerLobbyData.TypeRace = data.TypeRace;
    LobbyJoined.PlayerLobbyData.LobbyID = id;


    for (let i = 0; i < data.PlayerListName.length; i++) {
      let playername = data.PlayerListName[i];
      let object = {
        Name: playername,
        Ready:false,
        Ingame:false,
        Rank: 0,
        Time: {
          Minutes: 0,
          Secondes: 0
        }
      }
      LobbyJoined.PlayerLobbyData.PlayerListName.push(object)

    }
  $("#ReadyB").show();


});

jcmp.AddEvent('CEF/AddPlayerOnLobbyMenu',function(id,playername){
  if (LobbyJoined.PlayerLobbyData.LobbyID == id){
    for (let i = 0; i <   LobbyJoined.PlayerLobbyData.PlayerListName.length; i++) {
      let player = LobbyJoined.PlayerLobbyData.PlayerListName[i];
      if(player.Name == playername){
        return;

      }
    }
    let object = {
      Name: playername,
      Ready:false,
      Ingame:false,
      Rank: 0,
      Time: {
        Minutes: 0,
        Secondes: 0
      }
    }
    LobbyJoined.PlayerLobbyData.PlayerListName.push(object);
    // show to everyone that are on the lobby the new guy


  }



});



jcmp.AddEvent('CEF/PlayerRemoveLobby',function(id,playername){
    if (id == LobbyJoined.PlayerLobbyData.LobbyID){
      for (let i = 0; i < LobbyJoined.PlayerLobbyData.PlayerListName.length; i++) {
        let playerlist = LobbyJoined.PlayerLobbyData.PlayerListName[i];
        if (playerlist.Name == playername){
          LobbyJoined.PlayerLobbyData.PlayerListName.splice(i,1);
    }
  }
}

});





jcmp.AddEvent('CEF/TypeOfRace',function(type){ // update for the player on the lobby menu
LobbyJoined.PlayerLobbyData.TypeRace = type;

});


jcmp.AddEvent('CEF/MapOfRace',function(map,id){ // update for the player on the lobby menu
LobbyJoined.PlayerLobbyData.MapName = map;
LobbyJoined.PlayerLobbyData.RaceID = id;
});

jcmp.AddEvent('CEF/ShowLobbyMenu',function(){
    $("#DivLobbyJoined").show();
});
jcmp.AddEvent('CEF/HideLobbyMenu',function(id){

  if (id == LobbyJoined.PlayerLobbyData.LobbyID){
    $("#DivLobbyJoined").hide();
    jcmp.CallEvent('Client/Player_Remove_Lobby_Test');
    console.log("PlayerLeave");
    LobbyJoined.PlayerLobbyData.LobbyName = undefined ;
    LobbyJoined.PlayerLobbyData.NumberofPlayer = undefined ;
    LobbyJoined.PlayerLobbyData.MapName = undefined ;
    LobbyJoined.PlayerLobbyData.RaceID = undefined ;
    LobbyJoined.PlayerLobbyData.TypeRace = undefined ;
    LobbyJoined.PlayerLobbyData.LobbyID = undefined ;
    LobbyJoined.PlayerLobbyData.PlayerListName = [] ;
      jcmp.CallEvent('ShowServerList');
      jcmp.CallEvent('LobbyIsRemovedP');
  }

});

jcmp.AddEvent('CEF/ImHost',function(bool){
  LobbyJoined.imhost = bool;
});

jcmp.AddEvent('CEF/PlayerMeLobby',function(name){
  LobbyJoined.me = name;
});



jcmp.AddEvent('CEF/PlayerIsReady',function(id,name){
  if (id != LobbyJoined.PlayerLobbyData.LobbyID){
    return;
  }
  for (let i = 0; i < LobbyJoined.PlayerLobbyData.PlayerListName.length; i++) {
    let playerlist = LobbyJoined.PlayerLobbyData.PlayerListName[i];
    if (playerlist.Name == name){
      playerlist.Ready = true;
    }
  }


});


jcmp.AddEvent('CEF/PlayerIngame',function(id,name){
  if (id != LobbyJoined.PlayerLobbyData.LobbyID){
    return;
  }
  for (let i = 0; i < LobbyJoined.PlayerLobbyData.PlayerListName.length; i++) {
    let playerlist = LobbyJoined.PlayerLobbyData.PlayerListName[i];
    if (playerlist.Name == name){
      playerlist.Ready = false;
      playerlist.Ingame = true;
    }
  }

});

jcmp.AddEvent('CEF/PlayerNotIngame',function(id,name){
  if (id != LobbyJoined.PlayerLobbyData.LobbyID){
    return;
  }
  for (let i = 0; i < LobbyJoined.PlayerLobbyData.PlayerListName.length; i++) {
    let playerlist = LobbyJoined.PlayerLobbyData.PlayerListName[i];
    if (playerlist.Name == name){
      playerlist.Ready = false;
      playerlist.Ingame = false;
        $("#ReadyB").show();
    }
  }

});

jcmp.AddEvent('CEF/PlayerIsNotReady',function(id,name){
  if (id != LobbyJoined.PlayerLobbyData.LobbyID){
    return;
  }
  for (let i = 0; i < LobbyJoined.PlayerLobbyData.PlayerListName.length; i++) {
    let playerlist = LobbyJoined.PlayerLobbyData.PlayerListName[i];
    if (playerlist.Name == name){
      playerlist.Ready = false;
    }
  }


});

jcmp.AddEvent('CEF/race_end_timer_lobby',function(id,name,minute,second){
  if (id != LobbyJoined.PlayerLobbyData.LobbyID){
    return;
  }
  for (let i = 0; i < LobbyJoined.PlayerLobbyData.PlayerListName.length; i++) {
    let playerlist = LobbyJoined.PlayerLobbyData.PlayerListName[i];
    if (playerlist.Name == name){
      playerlist.Time.Minutes = minute;
      playerlist.Time.Secondes = second;

    }
  }


});

jcmp.AddEvent('CEF/Race_Leaderboard_Rank',function(id,name,rank){
  if (id != LobbyJoined.PlayerLobbyData.LobbyID){
    return;
  }
  for (let i = 0; i < LobbyJoined.PlayerLobbyData.PlayerListName.length; i++) {
    let playerlist = LobbyJoined.PlayerLobbyData.PlayerListName[i];
    if (playerlist.Name == name){
      playerlist.Rank = rank;

    }
  }


});
