
var	ROOM_MODE = {
	SINGLE: 0,
	MULTI: 1
};

var USER_TYPES = {
	LOCAL: 0,
	REMOTE: 1
};

var RETURN_NOTHING = "0";
var GAME_ROOM_MODE = ROOM_MODE.SINGLE;

var HINT_SHOW_TIME_MSECS = 3000;

var MAX_NICKNAME_LENGTH = 15;


var PEER_SERVER_ADDR = "www.polyzer.org";
var PEER_PORT_ADDR = "9002";
var PEER_PATH_ADDR = "/vk_space_chat";
var SERVER_REQUEST_ADDR = "https://" + PEER_SERVER_ADDR + ":" + PEER_PORT_ADDR;

var MAX_ROOM_USERS = 100; // максимум человек в комнате;

var MIN_ROOMS_COUNT = 1; // минимальное количество комнат;


/*Значения, возвращаемые сообщениями;*/
var MESSAGE_RESULT_OK = 0;
var MESSAGE_RESULT_ERROR = 1;


/*Значения, определяющие статус */
var NICKNAME_STATUS_OK = 0; // если верно
var NICKNAME_STATUS_ERROR = 1; // если косяк
var NICKNAME_STATUS_EMPTY = 2; // если пустой

var DEFAULT_ROOM_ID = "Default";

var CONNECTION_IS_OPEN = 0;
var CONNECTION_ERROR = 1;


/*Подсказки */
var HINT_STATUS = {
	ERROR: 0,
	WARNING: 1,
	DEFAULT: 2
};

var CAMERA_PARAMETERS = {
	ANGLE: 45,
	SCREEN_WIDTH: 900,
	SCREEN_HEIGHT: 650,
	NEAR: 0.1,
	FAR: 10000
};


var REQUESTS = {
	UTOS: {
		COME_INTO_ROOM: "come_into_room",
		GET_ROOMS_LIST: "get_rooms_list",
		LEAVE_ROOM: "leave_room",
		CREATE_ROOM: "create_room",	
		GET_USERS_IDS_IN_MY_ROOM: "get_users_ids_in_my_room",
		FIND_COMPANION: "find_companion",
		END_COMMUNICATING: "end_communicating"	
	},
	UTOU: {
		MOVE: "move",
		SHOOT: "shoot",
		SEND_NICKNAME: "send_nickname",
		GET_NICKNAME: "get_nickname",
		GET_COMMUNICATION_STATUS: "get_communication_status",
		SEND_COMMUNICATION_STATUS: "send_communication_status",
		GET_VKID: "get_vkid",
		SEND_VKID: "send_vkid",
		HIDE_VIDEO: "hide_video",
		SHOW_VIDEO: "show_video",
		HIDE_VKID: "hide_vkid",
		SHOW_VKID: "show_vkid",
		COMMUNICATION_IS_OVER: "communication_is_over",
		CAN_I_CONNECT_TO_YOU: "can_I_connect_to_you",
		YES_YOU_CAN_CONNECT_TO_ME: "yes_you_can_connect_to_me",
		NO_YOU_CANT_CONNECT_TO_ME: "no_you_cant_connect_to_me",
		WE_CAN_START_CHATTING: "we_can_start_chatting"
	}
};

var COMMUNICATION_OPTIONS = {
	STATUS:{
		WAITING: 0,
		COMMUNICATING: 1,
		HAVE_RECIEVED_CONNECTION_CANDIDATE: 2
	},
	VIDEO_STATE:{
		SHOW: 0,
		HIDE: 1
	},
	VKID_STATE:{
		SHOW: 0,
		HIDE: 1
	}
};	

var CAMERA_VIDEO_SIZES = {
	SMALL: 128,
	MEDIUM: 256,
	LARGE: 512
};
/*
Описывает состояние игрока.
*/
var USER_STATUS = {
	FINDING_REMOTE_USER: 0,	/*Если находимся в режиме поиска кандидата на пользователя*/
	CANDIDATE_IS_FOUND_AND_CONNECTION_IS_BEEN_SET: 1, /*Если кандидат найден, то его нужно установить*/
	ALL_FINE: 2, /*Все круто, ниче делать не надо!*/
	NEED_FIND_REMOTE_USER: 3,
	HAVE_NO_USER_IN_CURRENT_USERS_IDS_ARRAY: 4,
	NEED_FIND_CANDIDATE_IN_CURRENT_USERS_IDS_ARRAY: 5,
	WE_CAN_START_CHATTING: 6,
	NEED_WILLIGNESS_OF_USERS: 7,
	RECIEVED_CANDIDATE_CAN_BE_SET_AS_REMOTE_USER: 8,
	FOUND_CANDIDATE_CAN_BE_SET_AS_REMOTE_USER: 9,
	NEED_WAIT_COMING_TO_CAMERA_ANIMATION_ENDING: 10,
	NEED_FIND_REMOTE_USER_AFTER_HIDE_ANIMATION_WILL_STOP: 11,
	NEED_WAIT_ANIMATION_ENDING_TO_DISCONNECT: 12
};

/*
Найденный кандидат!
*/
var FOUND_CANDIDATE = {
	STATUS: {
		NOT_INSTALLED: 0, // не установлен. Т.е. нужно его найти!
		INSTALLED_AS_REMOTE_USER: 1,// установлен. И выходит, что не нужно добавлять другого!
		HAVE_PERMISSION_TO_COMMUNICATING: 2, // получено разрешение на общение.
		APPEARED: 3 // только появился
	}
};
/*
Принятый кандидат!
*/
var RECIEVED_CANDIDATE = {
	STATUS: {
		NOT_INSTALLED: 0, // не установлен. Т.е. нужно его найти!
		INSTALLED_AS_REMOTE_USER: 1,// установлен. И выходит, что не нужно добавлять другого!
		HAVE_PERMISSION_TO_COMMUNICATING: 2, // получено разрешение на общение.
		APPEARED: 3 // только появился
	}
};

/*
Параметры, котоыре были установлены
*/
var SET_DATA_PARAMETERS_STATE = {
	REMOTE_USER_STREAM_WAS_SET: {NO: 0, YES: 1},
	REMOTE_USER_VKID_WAS_SET: {NO: 0, YES: 1}
};

var THE_WILLIGNESS_OF_USERS = {
	LOCAL_USER: {YES: 0, NO: 1},
	REMOTE_USER: {YES: 0, NO: 1}
};
/*Попыток для поиска кандидата в массиве. По привышении этого числа нужно перезагрузить массив.*/
var CANDIDATES_IN_ONE_ARRAY_FIND_LIMITER = 100;

var CONTROL_BUTTONS_MODE = {
	CSS3D: 0,
	Three3D: 1
};

var FLYING_OBJECTS = {
	FLYING_MAX_HEIGHT: 1000,
	FLYING_MIN_HEIGHT_START_POSITION: -1000,
	FlYING_RADIUS: 600,
	FARTHER_OBJECTS_DISTANCE: -1500,
	NEAREST_OBJECTS_COUNT: 25,
	FARTHER_OBJECTS_COUNT: 10,
	FARTHER_FLYING_MAX_HEIGHT: 1000
};

/* генерирует рандомную строку заданной длины
 */
function generateRandomString(len)
{
	var text = [];
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	if((len !== undefined) && (len > 0)){
		for(var i=0; i<len; i++)
			text.push(possible.charAt(Math.floor(Math.random() * possible.length)));
	}
	text = text.join("");
	return text;
}
var StreamObj = null;
var MenuObj = null;
//var MenuObj = new _Menu();

/*
IN json_parms = {
	constraints: {video: true, audio: true},
	onsuccess: this.onSuccessBF,
	onerror: this.onErrorBF
}
*/
function makeRightStreamRequest(json_params)
{
	if(navigator.mediaDevices !== undefined)
	{
		navigator.mediaDevices
		.getUserMedia(json_params.constraints)
		.then(json_params.onsuccess)
		.catch(json_params.onerror);
	} else
	{
		navigator.getUserMedia(json_params.constraints, 
			json_params.onsuccess,
			json_params.onerror);
	}
}

function gotStream(stream) 
{
	StreamObj = stream;
	
	stream.onended = noStream;
	MenuObj = new _Menu();
}

function noStream(e) 
{
	var msg = "No camera available.";
	if (e.code == 1) 
	{   msg = "User denied access to use camera.";   }
	//alert(e.code);
}


if(typeof(exports) !== "undefined")
{
	exports.ROOM_MODE = ROOM_MODE;
	exports.GAME_ROOM_MODE = GAME_ROOM_MODE;
	exports.PEER_SERVER_ADDR = PEER_SERVER_ADDR;
	exports.PEER_PORT_ADDR = PEER_PORT_ADDR;
	exports.PEER_PATH_ADDR = PEER_PATH_ADDR;
	exports.MAX_ROOM_USERS = MAX_ROOM_USERS; // максимум человек в комнате;
	exports.REQUESTS = REQUESTS;

	exports.PEER_PORT_ADDR = PEER_PORT_ADDR;
	exports.DEFAULT_ROOM_ID = DEFAULT_ROOM_ID;
	exports.generateRandomString = generateRandomString;
}else
{
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	window.URL = window.URL || window.webkitURL;


var VIDEO_MESH_MOVEMENT = {
	STATUS: {
		MOVEMENT: 0, 
		STANDING: 1
	},
	POSITIONS:{ 
		LOCAL: {		
			RIGHT_AWAY: new THREE.Vector3(-450, 250, -1200),
			FRONT_OF_CAMERA: new THREE.Vector3(0,-30,-350),
			MOVING_STEP: 20
		},
		REMOTE: {		
			LEFT_AWAY:new THREE.Vector3(1000,-30,-1500),
			FRONT_OF_CAMERA:new THREE.Vector3(0,-30,-350),
			FRONT_BACK_CENTER:new THREE.Vector3(0,-30,-1500)
		}
	}
};
	
}
