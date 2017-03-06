<!DOCTYPE html>
<html> 
<head>
<meta charset="UTF-8" /> 
<link rel="stylesheet" href="./vk_space_chat.css" />

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
<div id="ID_VIEWER" style="position: absolute; left: 0px; top: 0px; z-index: 1000000; background-color: yellow;"></div>
<script>
</script>
<script>

var ForUpdating = [];		
var StreamObj = null;

var ObjectLoader = new THREE.ObjectLoader();
ObjectLoader.load("models/scene.json", function (obj) {
	window.SpaceScene = obj;
		// создаем игру при загрузке приложения	
	window.Peer = new Peer({
		host: PEER_SERVER_ADDR, 
		port: PEER_PORT_ADDR, 
		path: PEER_PATH_ADDR //,debug: true
	});


	window.Peer.on("open", function () {
		document.getElementById("ID_VIEWER").appendChild(document.createTextNode(window.Peer.id));
		var MenuObj = new _Menu();
	});

});


</script>
</body>
</html>

