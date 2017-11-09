jcmp.events.Add('TTS_Race_Checkpoint', function(player) {
  const Race = player.race.game;
  let checkpointcoordinate = new Vector3f(Race.raceCheckpoint[player.race.checkpoints].x, Race.raceCheckpoint[player.race.checkpoints].y + Race.AddingYatrespawn, Race.raceCheckpoint[player.race.checkpoints].z);
  player.respawnPosition = race.utils.randomSpawn(checkpointcoordinate, 15);
  player.race.playerrotationspawn = new Vector3f(Race.raceCheckpoint[player.race.checkpoints].rotx, Race.raceCheckpoint[player.race.checkpoints].roty, Race.raceCheckpoint[player.race.checkpoints].rotz);
  player.race.checkpoints++;

  if (player.race.checkpoints == Race.raceCheckpoint.length) { // if it's egal it's mean it's the last checkpoint
    jcmp.events.CallRemote('Checkpoint_current_client', player, player.race.checkpoints);
    race.chat.send(player, "[SERVER] You finished the race! Well done!!");
    jcmp.events.CallRemote('End_Timer',player);
    return;
    // whas last checkpoint
  }
  if (player.race.checkpoints == Race.raceCheckpoint.length - 1) { // last checkpoint
    let lastnextcheckpoint = Race.raceCheckpoint[player.race.checkpoints];
    jcmp.events.CallRemote('race_checkpoint_client', player, JSON.stringify(lastnextcheckpoint), Race.id, Race.PoiType, Race.checkpointhash, Race.ChekpointType);
    console.log("last checkpoint TTS");
    jcmp.events.CallRemote('Checkpoint_current_client', player, player.race.checkpoints);
    return;
    // change the poi text to last checkpoint
  }

  let positionnextcheckpoint = Race.raceCheckpoint[player.race.checkpoints];
  let positionghostcheckpoint = Race.raceCheckpoint[player.race.checkpoints + 1];
  jcmp.events.CallRemote('race_checkpoint_client', player, JSON.stringify(positionnextcheckpoint), Race.id, Race.PoiType, Race.checkpointhash, Race.ChekpointType, JSON.stringify(positionghostcheckpoint));
  jcmp.events.CallRemote('Checkpoint_current_client', player, player.race.checkpoints);


});


jcmp.events.Add('TTS_race_end_point', function(player) {

  player.race.hasfinish = true;
  const Race = player.race.game;

  Race.leaderboard.push(player);
  let playern = player.networkId;
  Race.players.forEach(player => {
    if (player.race.ingame)
      Race.leaderboard = player.race.game.leaderboard;
  })

  for (var i = 0; i < Race.leaderboard.length; i++) {
    const player = Race.leaderboard[i];

    if (player.networkId == playern) {
      let leaderboardplace = i + 1;
      // send the leaderboardplace to the client
      let minute = Math.floor(player.race.time / 60);
      let seconds = player.race.time % 60
      let playername = player.name;
      race.chat.broadcast(`[SERVER] ${playername} has made a time of ${minute} minutes and ${seconds} seconds!`, race.config.colours.red);
      jcmp.events.CallRemote('Player_data_Announce_TTS', player, player.race.time);
      Race.TTSUpdateEndLeaderboard(playername, leaderboardplace, minute, seconds); // a changer

      setTimeout(function() {
        jcmp.events.Call('race_player_leave_game', player)
        player.race.time = 0;
      }, 1000);

    }

  }

});

jcmp.events.AddRemoteCallable('TTS_Race_player_Start_New_Player', (player) => { // the timer for the leaderboard
  console.log(player.name + "timerstart");
  const Race = player.race.game;
  Race.TTSPlayerStartRelease();

});