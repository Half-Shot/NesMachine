var pausePlayStop = function(stop) {
    if (waitingToPlay){
        waitingToPlay = false;
        MIDI.Player.start();
        $( "#play-icon" ).removeClass( "glyphicon-play" );
        $( "#play-icon" ).addClass( "glyphicon-pause" );
        $( "#progress-animated" ).toggleClass("active");
        MIDI.Player.addListener(UpdateUI);
        return true;
    }
    if (stop) {
        MIDI.Player.stop();
        $( "#progress-animated" ).toggleClass("active");
        $( "#play-icon" ).removeClass( "glyphicon-pause" );
        $( "#play-icon" ).addClass( "glyphicon-play" );
        waitingToPlay = true;
        $( "#progress-bar" ).width("0%");
        MIDI.Player.removeListener();
    } else if (MIDI.Player.playing) {
        $( "#play-icon" ).removeClass( "glyphicon-pause" );
        $( "#play-icon" ).addClass( "glyphicon-play" );
        $( "#progress-animated" ).toggleClass("active");
        MIDI.Player.pause(true);
    } else {
        $( "#play-icon" ).removeClass( "glyphicon-play" );
        $( "#play-icon" ).addClass( "glyphicon-pause" );
        $( "#progress-animated" ).toggleClass("active");
        MIDI.Player.resume();
    }
};

$( "#stop" ).click(function() {
    pausePlayStop(true);
});

$( "#play" ).click(function() {
    pausePlayStop();
});
waitingToPlay = false;

MIDI.loadPlugin({
    soundfontUrl: "./soundfont/",
    instrument: "acoustic_grand_piano"
});
player = MIDI.Player;
player.timeWarp = 1; // speed the song is played back
var MidiFiles = {
    names: [],
    data: []
};
function loadsong(id)
{
    notesthissong = 0;
    var data = MidiFiles.data[id];
    var name = MidiFiles.names[id]
    $("#title").html(name);
    player.loadFile(data);
    pausePlayStop(true);
}

function msToTime(s) {
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  
  ssecs = secs.toString();
  smins = mins.toString();
  
  if(secs < 10){
    ssecs = "0" + ssecs;
  }
  
  if(smins < 10){
    smins = "0" + smins;
  }
  
  return smins + ':' + ssecs;
}
notecount = 0;
notesthissong = 0
function UpdateUI(data)
{
    percenttimedone = 100 * (data.now / data.end);
    notecount++;
    notesthissong++;
    $( "#notesplayed").html(notecount);
    $( "#notesplayedthissong").html(notesthissong);
    seconds = (data.now / 1000);
    $( "#notespersecond").html(Math.round(notesthissong / seconds));
    $( "#progress-bar" ).width(percenttimedone + "%");
    $( "#time" ).html(msToTime(data.now));
    
}



if (window.File && window.FileReader && window.FileList && window.Blob) {
  // Great success! All the File APIs are supported.
} else {
  alert('The File APIs are not fully supported in this browser. Your going to have to wait for old style uploading.');
}

var reader = new FileReader();
reader.onload = function(e) {
    MidiFiles.data.push(reader.result);
}

$("#dragfileshere").on("dragenter", function(e) {
    $("#dragfileshere").css('border-color', 'red');
    if (e.preventDefault) e.preventDefault(); // stops the browser from redirecting off to the text.
    e.stopPropagation();
});

$("#dragfileshere").on("dragleave", function(e) {
    $("#dragfileshere").css('border-color', '');
    if (e.preventDefault) e.preventDefault(); // stops the browser from redirecting off to the text.
    e.stopPropagation();
});

$("#dragfileshere").on("dragover", function(e) {
    if (e.preventDefault) e.preventDefault(); // stops the browser from redirecting off to the text.
    e.stopPropagation();
    return false;
});

$("#dragfileshere").on("drop", function(e) {
    if (e.preventDefault) e.preventDefault(); // stops the browser from redirecting off to the text.
    e.stopPropagation();
    //Check type
    //Firefox uses '"audio/midi"' while chrome uses 'audio/midi'. Whatever
    if(e.originalEvent.dataTransfer.files[0].type == '"audio/midi"' || e.originalEvent.dataTransfer.files[0].type == 'audio/midi'){
        MidiFiles.names.push(e.originalEvent.dataTransfer.files[0].name);
        $("#files").append("<button style='width:200px; overflow:hidden;' class='btn btn-default' type='button' onclick='loadsong(" + (MidiFiles.data.length) + ")'>" + e.originalEvent.dataTransfer.files[0].name + "</button>");
        reader.readAsDataURL(e.originalEvent.dataTransfer.files[0]);
    }
    else{
        alert("Not a Midi!\n This is a " + e.originalEvent.dataTransfer.files[0].type)
    }
    $("#dragfileshere").css('border-color', '');
    return false;
});
