var LobbyMain = new Vue({
    el: '#lobbyList',
    data: function() {
      return{
      //  LobbyServerList : [],
         LobbyServerList : [{LobbyName:"test1",NumberofPlayer:5,MapName:"CAR-BoomIslandRace-[TEST]",TypeRace:"Classic",LobbyID:0, RaceID:50,PlayerCreated:"Myami"},{LobbyName:"test2",NumberofPlayer:0,MapName:"Airplane-AirfieldRace",TypeRace:"Classic",LobbyID:1,RaceID:1,PlayerCreated:"Btje"}],
        currentSelected: null,
        oldSelected: null
    };

    },
    methods: {
      selectLobby: function(raceid) {
          this.currentSelected = raceid;
          console.log("RaceId: "+raceid);
      //    jcmp.CallEvent('Client/Player_Join_Lobby_Test',raceid); for testing it's remove need to be add again
          $("#DivServerLobbyList").hide();
          $("#btnJoin").hide();
          $("#btnCreate").hide();
          $("#DivLobbyJoined").show();
      },
      logtest: function (raceid){
        console.log(raceid);
      },
      generateThumbUrl: generateThumbUrl

    }
});



//{LobbyName:"test1",NumberofPlayer:0,MapName:"Yolo",TypeRace:"Classic",LobbyID:0,PlayerCreated:"Myami"},{LobbyName:"test2",NumberofPlayer:0,MapName:"Yolo",TypeRace:"Classic",LobbyID:1,PlayerCreated:"Myami"}

jcmp.AddEvent('CEF/LobbyCreated',function(Obj){ // show the lobby on the server list
  let data = JSON.parse(Obj);
  let NewLobby = {
    LobbyName: data.LobbyName,
    NumberofPlayer: data.NumberofPlayer,
    MapName: "RaceIsland",
    TypeRace:"Classic",
    LobbyID: data.LobbyID,
    RaceID:data.RaceID,
    PlayerCreated: data.PlayerCreated,
  }
  console.log("CEF/LobbyCreated NewLobby" + NewLobby);
  LobbyMain.LobbyServerList.push(NewLobby);
  console.log("LobbyServerList " + JSON.stringify(LobbyMain.LobbyServerList));
//LobbyServerList is an array with all the lobby create on the server
});


jcmp.AddEvent('CEF/UpdateLengthLobby',function(id,newlength){
  for (let i = 0; i <   LobbyMain.LobbyServerList.length; i++) {
    let lobby = LobbyMain.LobbyServerList[i];
    if(lobby.LobbyID == id){
      lobby.NumberofPlayer = newlength;
      console.log("CEF/UpdateLengthLobby" +  lobby.NumberofPlayer);
      // show to everyone that are on the main menu the new lenght
    }
  }
});




jcmp.AddEvent('CEF/ShowLobbyList',function(boolean){
  // show the LobbyServerList to the player or not
});


jcmp.AddEvent('CEF/TypeOfRaceSelected',function(id,type){    // update the UI on server list
  for (let i = 0; i <   LobbyMain.LobbyServerList.length; i++) { // maybe can remove this
    let lobby = LobbyMain.LobbyServerList[i];
    if(lobby.LobbyID == id){
      lobby.TypeRace = type;
      // change on the LobbyServerList the type
      console.log("CEF/TypeOfRaceSelected NewType for serverlists" + lobby.TypeRace);
    }
  }
});


jcmp.AddEvent('CEF/MapOfRaceSelected',function(id,map,int){      // update the UI on server list
  for (let i = 0; i <   LobbyMain.LobbyServerList.length; i++) {   // maybe can remove this event
    let lobby = LobbyMain.LobbyServerList[i];
    if(lobby.LobbyID == id){
      lobby.MapName = map;
      // change on the LobbyServerList the map
      lobby.RaceID = int;
      console.log("CEF/MapOfRaceSelected Newmap for the serverlists" + lobby.MapName);
    }
  }
});
