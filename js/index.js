
// GLOBAL VARS

var _PlayerVersion = 'v0.02.0';

var AplicationManager = new AplicationManager();
var moData = new THREE.MediaObject();
var MenuManager = new THREE.MenuManager();
var AudioManager = new AudioManager();
var subController = new SubSignManager();
var interController = new THREE.InteractionsController();
var polyfill = new WebVRPolyfill();
var statObj = new StatObject();


var loggerActivated = false;


var demoId = 1;

var mainContentURL = './resources/rapzember-young-hurn_edit.mp4';
//var _selected_content = 'Radio';




/**
 * Initializes the web player.
 */	

function init_webplayer() 
{
	console.log('Version: ' + _PlayerVersion);

  AudioManager.initAmbisonicResources();
  moData.setFont('./css/fonts/TiresiasScreenfont_Regular.json');
		
  for (var i = 0; i < 2; i++) 
  {
    var id = i + 1;
    var dataText = ' ';

    if (i == 0) dataText = "Video 1: Demo radio";
    else if (i == 1) dataText = "Video 2: Demo opera";

    createListGroup(id, "img/LOGO-IMAC.png", dataText);
  }
}


function blockContainer()
{
	document.getElementById("header").style.display = "none";
	document.getElementById("content_area").style.display = "none";
	document.getElementById("container").style.display = "block";
}

function selectXML(id)
{
  mainContentURL = id == 2 ? 'http://192.168.10.128:8080/dash/liceu_demo/video/cam_2/stream.mpd' : './resources/rapzember-young-hurn_edit.mp4';
 
  demoId = id;

  AplicationManager.init_AplicationManager();
  enterfullscreen();
}
       
function startAllVideos()
{
  
  setTimeout(function() {
    runDemo(); 
  },500);

  //moData.playAll();
}


(function() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
              .register('./service-worker.js')
              .then(function() { console.log('Service Worker Registered'); });
    }
})();