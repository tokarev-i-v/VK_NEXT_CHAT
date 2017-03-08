<!DOCTYPE html>
<html> 
<head>
<meta charset="UTF-8" /> 
<link rel="stylesheet" href="./vk_space_chat.css" />
<link href="https://fonts.googleapis.com/css?family=Lobster" rel="stylesheet">

<script src='../games_resources/libs/three.js/build/three.min.js'></script>
<script src='../games_resources/libs/three.js/examples/js/controls/FirstPersonControls.js'></script>
<script src='../games_resources/libs/three.js/examples/js/controls/PointerLockControls.js'></script>
<script src='../games_resources/libs/three.js/examples/js/controls/FlyControls.js'></script>
<script src='../games_resources/libs/three.js/src/extras/THREEx/THREEx.FullScreen.js'></script>
<script src='../games_resources/libs/three.js/src/extras/THREEx/THREEx.KeyboardState.js'></script>
<script src='../games_resources/libs/three.js/src/extras/THREEx/THREEx.WindowResize.js'></script>
<script src='../games_resources/libs/three.js/examples/js/renderers/CSS3DRenderer.js'></script>		 
<script src="../games_resources/libs/jquery.js"></script>
<script src="../games_resources/libs/peer.min.js"></script>

<script src="./vk_space_chat_constants_and_general_functions.js"></script>
<script src="./vk_space_chat_net_messages.js"></script>
<script src="./vk_space_chat.js"></script>
<script src="./vk_space_chat_menu.js"></script>
<script src="./vk_space_chat_users.js"></script>
<script src="./vk_space_chat_visual_keeper.js"></script>
<script src="./vk_space_chat_hint.js"></script>
<script src="./vk_space_chat_body.js"></script>
<script src="./vk_space_chat_message_window.js"></script>
<script src="./vk_space_chat_user_chat_controls.js"></script>
</head>
<body>
<!--<div id="ID_VIEWER" style="position: absolute; left: 0px; top: 0px; z-index: 1000000; background-color: yellow;"></div>-->
<script>
</script>
<script>

/*
var player_div = document.createElement("div");
player_div.setAttribute("id", "player");
player_div.style.display = "none";
document.body.appendChild(player_div);
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var YouTubePlayer;
function onYouTubeIframeAPIReady() {
  YouTubePlayer = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: 'VDC9d0PIPGc',
    events: {
      'onReady': onPlayerReady
    }
  });
}

  // 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
	window.Peer = new Peer({
		host: PEER_SERVER_ADDR, 
		port: PEER_PORT_ADDR, 
		path: PEER_PATH_ADDR //,debug: true
	});


	window.Peer.on("open", function () {
		document.getElementById("ID_VIEWER").appendChild(document.createTextNode(window.Peer.id));
		var MenuObj = new _Menu();
		YouTubePlayer.setVolume(0);
		YouTubePlayer.playVideo();
	});

}

  // 5. The API calls this function when the player's state changes.
  //    The function indicates that when playing a video (state=1),
  //    the player should play for six seconds and then stop.
function stopVideo() {
    YouTubePlayer.stopVideo();
}
*/

var ForUpdating = [];		
var StreamObj = null;


	window.Peer = new Peer({
		host: PEER_SERVER_ADDR, 
		port: PEER_PORT_ADDR, 
		path: PEER_PATH_ADDR //,debug: true
	});


	window.Peer.on("open", function () {
//		document.getElementById("ID_VIEWER").appendChild(document.createTextNode(window.Peer.id));
		var MenuObj = new _Menu();
	});
</script>
<!-- <iframe style="display: none; z-index: -1000;" width="420" height="315" src="https://www.youtube.com/embed/VDC9d0PIPGc?autoplay=1">
</iframe> -->
</body>
</html>

