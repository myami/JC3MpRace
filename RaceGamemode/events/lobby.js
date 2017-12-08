jcmp.events.AddRemoteCallable('Player_Create_Lobby', function(player) {
  if (player.race.lobbyid == undefined) {
    let id = Object.keys(race.game.lobbys).length;
    console.log(id);
    race.game.lobbys[id] = [];
    race.game.lobbys[id].push(player);
    player.race.lobbyid = id;
    jcmp.events.CallRemote('NewLobby', null, player.race.lobbyid, player.name); // id of the lobby and name of the creator of the lobby
    jcmp.events.CallRemote('AddPlayerLobbyArray', player, player.race.lobbyid, player.name);
    jcmp.events.CallRemote('Lobby_Update_state', null, player.name, JSON.stringify('In the Lobby : ' + player.race.lobbyid));

    race.chat.send(player, "[SERVER] You Create the lobby with the id" + player.race.lobbyid);
    for (var i = 0; i < race.game.RaceList.length; i++) { // Create the list of map to select for the admin of the lobby
      jcmp.events.CallRemote('Race_List_Select', player, race.game.RaceList[i].raceid, race.game.RaceList[i].Name);
    }
  } else {
    console.log("Lobby Already created");
  }

});

jcmp.events.AddRemoteCallable('Player_Join_Lobby', function(player, id) {
  if (player.race.lobbyid == undefined) {
    console.log(id);
    if (id == undefined) {
      return;
    }
    if (race.game.lobbys[id]) {
      player.race.lobbyid = id;

      const data = {
        players: race.game.lobbys[id].map(p => ({ // maybe this is the issue
          name: p.name
        }))
      };
      console.log(data.players);

      //  jcmp.events.CallRemote('AddPlayerLobbyArray_All', player, id, JSON.stringify(data));

      for (var i = 0; i < race.game.lobbys[id].length; i++) {
        const playertoadd = race.game.lobbys[id][i];
        console.log(playertoadd.name);
        jcmp.events.CallRemote('AddPlayerLobbyArray', player, id, playertoadd.name);
      }
      for (var i = 0; i < race.game.lobbys[id].length; i++) {
        const playertoupdate = race.game.lobbys[id][i];
        console.log(playertoupdate.name);
        jcmp.events.CallRemote('AddPlayerLobbyArray', playertoupdate, id, player.name);
      }
      race.game.lobbys[id].push(player);
      race.chat.send(player, "[SERVER] You Just join the lobby" + id);
      jcmp.events.CallRemote('Lobby_Update_Player', null, id, race.game.lobbys[id].length);
      jcmp.events.CallRemote('AddPlayerLobbyArray', player, id, player.name);

      jcmp.events.CallRemote('Lobby_Update_state', null, player.name, JSON.stringify('In the Lobby : ' + player.race.lobbyid));

    } else {
      race.chat.send(player, "[SERVER] ID not correct");
    }

  }


});

jcmp.events.AddRemoteCallable('Player_Remove_Lobby', function(player) {
  if (player.race.lobbyid != undefined) {
    jcmp.events.CallRemote('Lobby_Update_Player', null, player.race.lobbyid, race.game.lobbys[player.race.lobbyid].length); // update to everyone the length of the lobby
    for (var i = 0; i < race.game.lobbys[player.race.lobbyid].length; i++) {
      const playertoupdate = race.game.lobbys[player.race.lobbyid][i];
      jcmp.events.CallRemote('Lobby_remove_player', playertoupdate, player.name); // remove the player to everyone on is lobby

    }
    race.chat.send(player, "[SERVER] You Removed from the lobby" + player.race.lobbyid);
    // if lobby is empty remove it
    race.game.lobbys[player.race.lobbyid].removePlayer(player);
    if (race.game.lobbys[player.race.lobbyid].length == 0) {
      delete race.game.lobbys[player.race.lobbyid];
      jcmp.events.CallRemote("DeleteLobby", null, player.race.lobbyid);
      console.log("ArrayEmpty");
    }
    player.race.lobbyid = undefined;
    player.race.ready = false;
    jcmp.events.CallRemote('Lobby_Update_state', null, player.name, JSON.stringify('LobbySelectMenu'));
  }
});
jcmp.events.AddRemoteCallable('Ready_Player_Server', function(player) {
  player.race.ready = true;
  for (var i = 0; i < race.game.lobbys[player.race.lobbyid].length; i++) {
    const playertoupdate = race.game.lobbys[player.race.lobbyid][i];
    console.log(playertoupdate.name);
    jcmp.events.CallRemote('Lobby_Player_Ready', playertoupdate, player.name);

  }
});
jcmp.events.AddRemoteCallable('TypeOfRace', function(player, int) { // 0 is classic , 1 MultiCrew , 2 TTS , 3 APO
  player.race.typeselect = int;
  // then send to everyone

  for (var i = 0; i < race.game.lobbys[player.race.lobbyid].length; i++) {
    const playertoupdate = race.game.lobbys[player.race.lobbyid][i];
    jcmp.events.CallRemote('ShowSelectType', playertoupdate, player.race.typeselect);

  }



});
jcmp.events.AddRemoteCallable('MapRace', function(player, int) { // 0 is classic , 1 MultiCrew , 2 TTS , 3 APO
  player.race.raceselect = int;
  console.log(player.race.raceselect);
  // then send to everyone

  let races;
  for (var i = 0; i < race.game.RaceList.length; i++) {
    let racetofind = race.game.RaceList[i];
    if (racetofind.raceid == player.race.raceselect) {
      races = racetofind;
    }
  }
  for (var i = 0; i < race.game.lobbys[player.race.lobbyid].length; i++) {
    const playertoupdate = race.game.lobbys[player.race.lobbyid][i];
    jcmp.events.CallRemote('ShowSelectRace', playertoupdate, races.raceid, races.Name);

  }

});

jcmp.events.AddRemoteCallable('LaunchRace', function(player) {
  if (player.race.typeselect != undefined && player.race.raceselect != undefined) {
    jcmp.events.Call('race_start_index', player)
  }
});


// Myami TEST LOBBY








jcmp.events.AddRemoteCallable('Player_Create_Lobby_Test', function(player,LobbyNameReceived) {
  if (player.race.lobbyid == undefined) {
    let id = Object.keys(race.game.lobbys).length;
    console.log(id);
    race.game.lobbys[id] = [];
    race.game.lobbys[id].push(player);
    player.race.lobbyid = id;
    let NewLobbyObject = {
      LobbyName: LobbyNameReceived,
      NumberofPlayer: 1,
      MapName: "RaceIsland",
      TypeRace:"Classic",
      LobbyID: id,
      PlayerList:[player]
    };
    race.game.lobbys[id].push(NewLobbyObject);

  } else {
    console.log("Lobby Already created");
  }

});


jcmp.events.AddRemoteCallable('Player_Join_Lobby_Test', function(player, id) {
  if (player.race.lobbyid == undefined) {
    console.log(id);
    if (id == undefined) {
      return;
    }
    if (race.game.lobbys[id]) {
      player.race.lobbyid = id;
      race.game.lobbys[id].PlayerList.push(player);
      race.game.lobbys[id].NumberofPlayer =  race.game.lobbys[id].PlayerList.length;

    } else {
      race.chat.send(player, "[SERVER] ID not correct");
    }

  }
  else{
    race.chat.send(player, "[SERVER] Player already on a lobby");
  }


});



jcmp.events.AddRemoteCallable('Player_Remove_Lobby_Test', function(player) {
  if (player.race.lobbyid != undefined) {
    for (let i = 0; i <   race.game.lobbys[id].PlayerList.length; i++) {
      let players = race.game.lobbys[id].PlayerList[i];
      jcmp.events.AddRemoteCallable('PlayerRemoveLobby',players,player.networkId);

      if (players.networkId == player.networkId) {
        delete player;
      }

    }

    player.race.lobbyid = undefined;
    player.race.ready = false;
  }
  else{
    race.chat.send(player,"[SERVER] Player already out of a lobby")
  }
});

jcmp.events.AddRemoteCallable('Ready_Player_Server_Test', function(player) {
  player.race.ready = true;
  // jcmp.CallRemote on   race.game.lobbys[player.race.lobbyid].PlayerList
  for (let i = 0; i <   race.game.lobbys[player.race.lobbyid].PlayerList.length; i++) {
    let players = race.game.lobbys[player.race.lobbyid].PlayerList[i];
    jcmp.events.AddRemoteCallable('PlayerReady_Lobby',players,player.networkId);
  }
});

jcmp.events.AddRemoteCallable('TypeOfRace_Test', function(player, int) { // 0 is classic , 1 MultiCrew , 2 TTS , 3 APO
  player.race.typeselect = int;
  let name ;
  // then send to everyone
  if (int == 0){
    name = "Classic"
  }
  if (int == 1){
    name = "MultiCrew"
  }
  if (int == 2){
    name = "TTS"
  }
  if (int == 3){
    name = "Apo"
  }
  race.game.lobbys[id].TypeRace = name;

  // jcmp.CallRemote on  race.game.lobbys[player.race.lobbyid].PlayerList
  for (let i = 0; i <   race.game.lobbys[player.race.lobbyid].PlayerList.length; i++) {
    let players = race.game.lobbys[player.race.lobbyid].PlayerList[i];
    jcmp.events.AddRemoteCallable('TypeOfRaceSelected',players,name);
  }
});

jcmp.events.AddRemoteCallable('MapRace_Test', function(player, int,name) { //raceid
  player.race.raceselect = int;
  console.log(player.race.raceselect);
  // then send to everyone

  let races;
  let havefind = false;
  for (var i = 0; i < race.game.RaceList.length; i++) {
    let racetofind = race.game.RaceList[i];
    if (racetofind.raceid == player.race.raceselect) {
      races = racetofind;
      havefind = true;
        race.game.lobbys[id].MapName = name;
        for (let i = 0; i <   race.game.lobbys[player.race.lobbyid].PlayerList.length; i++) {
          let players = race.game.lobbys[player.race.lobbyid].PlayerList[i];
          jcmp.events.AddRemoteCallable('MapOfRaceSelected',players,name);
        }
    }
  }





});


// Myami Test Lobby All PlayerList

jcmp.events.AddEvent("PlayerJoinServer",function(player){ // call when the player join the server
  for (let i = 0; i < race.AllPlayerOnTheServer.length; i++) {
    let player = race.AllPlayerOnTheServer[i];
    if (player.PlayerNetworkid == player.networkId) {
      return;
    }
  }

        let newplayer = {
          PlayerName: player.name,
          PlayerNetworkid: player.networkId,
          IsinLobby: Isinl,
          LobbyID: LId
        };
        race.AllPlayerOnTheServer.push(newplayer);
        //CallRemote to everyone to see the new Player
        for (let i = 0; i < race.AllPlayerOnTheServer.length; i++) {
          let o = race.AllPlayerOnTheServer[i];
          if (o.networkId != player.networkId) {
            jcmp.events.CallRemote("AddPlayerOnTheList",o,newplayer);
          }
        }
        // send to the player the all list with himslef
        jcmp.events.CallRemote("AddPlayerOnTheListJoin",player,JSON.stringify(race.AllPlayerOnTheServer));



});



jcmp.events.AddEvent('UpdatePlayerOnTheServer',function(player){
if (player.race.lobbyid != undefined){
  for (let i = 0; i < race.AllPlayerOnTheServer.length; i++) {
    let player = race.AllPlayerOnTheServer[i];
    if (player.networkId == Networkid) {
      player.IsinLobby = true;
      player.LobbyID = player.race.lobbyid;
      //CallRemote
      for (let y = 0; y < race.AllPlayerOnTheServer.length; y++) {
        let o = race.AllPlayerOnTheServer[y];
          jcmp.events.CallRemote("UpdatePlayerOnTheServer",o,race.AllPlayerOnTheServer[i].networkId,true);

      }

    }
  }
}
else{
  for (let i = 0; i < race.AllPlayerOnTheServer.length; i++) {
    let player = race.AllPlayerOnTheServer[i];
    if (player.networkId == Networkid) {
      player.IsinLobby = false;
      player.LobbyID = undefined;
      //CallRemote
      for (let y = 0; y < race.AllPlayerOnTheServer.length; y++) {
        let o = race.AllPlayerOnTheServer[y];
          jcmp.events.CallRemote("UpdatePlayerOnTheServer",o,race.AllPlayerOnTheServer[i].networkId,false);
      }
    }
  }
}
});

    jcmp.events.AddEvent('DeletePlayerOnTheserver',function(player){
      for (let i = 0; i < AllPlayerOnTheServer.length; i++) {
        let players = AllPlayerOnTheServer[i];
        if (players.networkId == player.networkId) {
          delete player;
              jcmp.events.CallRemote("RemovePlayer",null,player.networkId);
        }
      }
    });
