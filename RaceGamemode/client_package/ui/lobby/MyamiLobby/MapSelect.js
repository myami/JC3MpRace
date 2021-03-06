var MapSelected = new Vue({
    el: '#MapSelect',
    data: {
      raceList: [],
      selectedTrack: 0
    },
    methods: {
      generateThumbUrls: generateThumbUrl,
      selectTrack: function(raceid, event) {
        $("#btnSelectMap").removeAttr("disabled");
          this.selectedTrack = raceid;
          jcmp.CallEvent('Client/NewMapSelected',this.selectedTrack);
          $("#MapSelectdiv").hide();
            jcmp.CallEvent('ShowLobbyList');
      },

    }

});

jcmp.AddEvent('CEF/MapList',function(obj){
  let mapdata = JSON.parse(obj);
  let mapobj = {
    raceid: mapdata.raceid, name: mapdata.name, type: mapdata.type,
  }

  MapSelected.raceList.push(mapobj);
});


jcmp.AddEvent('CEF/ShowMapSelectDiv',function(bool){
  if(bool){
    $("#MapSelectdiv").show();
  }
  else{
    $("#MapSelectdiv").hide();
  }
});
