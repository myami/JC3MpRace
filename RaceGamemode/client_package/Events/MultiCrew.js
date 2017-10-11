jcmp.ui.AddEvent('MC_Passenger_click',function(DivToShow){
jcmp.events.CallRemote('MC_Passenger_click_Server',DivToShow);
});
jcmp.events.AddRemoteCallable('MC_DriverDirection_Show',function(DivToShow){
  jcmp.ui.CallEvent('MC_DriverDirection_Show_CEF',DivToShow);
});
jcmp.events.AddRemoteCallable('ShowPassagerUI',function(){
  jcmp.ui.CallEvent('ShowUIPassenger',true);
});
jcmp.events.AddRemoteCallable('HidePassagerUI',function(){
  jcmp.ui.CallEvent('ShowUIPassenger',false);
});
jcmp.events.AddRemoteCallable('ShowDriverUI',function(){
  jcmp.ui.CallEvent('ShowUIDriver',true);
});
jcmp.events.AddRemoteCallable('HideDriverUI',function(){
  jcmp.ui.CallEvent('ShowUIDriver',false);
});
jcmp.events.AddRemoteCallable('PlayerPassager',function(statue){
  playerpassager = statue;
});
jcmp.events.AddRemoteCallable('PartnerRequest',function(playername){
  jcmp.ui.CallEvent('PartnerRequest_CEF',playername);
});
jcmp.ui.AddEvent('ValidateRequest',function(playerrequest){
  jcmp.events.CallRemote('ValidateRequest_Server',playerrequest);
})
jcmp.ui.AddEvent('RefuseRequest',function(playerrequest){
jcmp.events.CallRemote('RefuseRequest_Server',playerrequest);
})
jcmp.events.AddRemoteCallable('PartnerNameUI_Client',function(playername){
  jcmp.ui.CallEvent('PartnerNameUI',playername);
});
