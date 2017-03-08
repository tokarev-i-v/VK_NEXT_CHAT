
var _VKSpaceChat = function (json_params) 
{
	this.createUsersByExistingConnectionsBF = this.createUsersByExistingConnections.bind(this);
	this.updateWorkingProcessBF = this.updateWorkingProcess.bind(this);
	this.createUserByRecievedConnectionBF = this.createUserByRecievedConnection.bind(this);
	this.onCallBF = this.onCall.bind(this);
	this.makeCallsToAllRemoteUsersBF = this.makeCallsToAllRemoteUsers.bind(this);
	this.onOpenInitAndStartGameBF = this.onOpenInitAndStartGame.bind(this);
	this.onPeerServerConnectionOpenBF = this.onPeerServerConnectionOpen.bind(this);

	this.Renderer = null;
	this.CSSRenderer = null;
	this.Camera = null;


	if(json_params !== undefined)
	{
		if(json_params.renderer !== undefined)
		{
			this.Renderer = json_params.renderer;
		}
		if(json_params.css_renderer !== undefined)
		{
			this.CSSRenderer = json_params.css_renderer;
		}
		if(json_params.camera !== undefined)
		{
			this.Camera = json_params.camera;
			this.Camera.position.set(0,0,0);
		}
	}
	// подготовка
	this.Container = document.createElement("div");
	this.Container.setAttribute("id", "MainContainer");
	document.body.appendChild(this.Container);


	if(this.Camera === null)
	{
		this.Camera = new THREE.PerspectiveCamera(
			CAMERA_PARAMETERS.ANGLE, 
			CAMERA_PARAMETERS.SCREEN_WIDTH/CAMERA_PARAMETERS.SCREEN_HEIGHT, 
			CAMERA_PARAMETERS.NEAR, 
			CAMERA_PARAMETERS.FAR
		);
	}
	if(this.Renderer === null)
	{
		this.Renderer = new THREE.WebGLRenderer();
	}
	this.Renderer.setSize(CAMERA_PARAMETERS.SCREEN_WIDTH, CAMERA_PARAMETERS.SCREEN_HEIGHT);
	
	if(this.CSSRenderer === null)
	{
		this.CSSRenderer = new THREE.CSS3DRenderer();	
	}

	this.Scene = new THREE.Scene();
	this.CSSScene = new THREE.Scene();
	this.Scenes = [this.Scene, this.CSSScene];

/*
	window.SpaceScene.position.set(0, 50, 0);
	window.SpaceScene.scale.set(200, 200, 200);
	this.Scene.add(window.SpaceScene);
*/


	this.createFlyingObjects();

	var startexture = new THREE.ImageUtils.loadTexture("models/bg_1_1.png");
	var ambientlight = new THREE.AmbientLight( 0xffffff, 5 );
	this.Scene.add(ambientlight);

	this.SkyBox = {};
	this.SkyBox.Geometry = new THREE.BoxGeometry(10, 10, 10);
	this.SkyBox.Geometry.scale(2000, 2000, 2000);
	this.SkyBox.Material = new THREE.MeshStandardMaterial({map: startexture, side: THREE.BackSide});
	this.SkyBox.Mesh = new THREE.Mesh(this.SkyBox.Geometry, this.SkyBox.Material);
	this.Scene.add(this.SkyBox.Mesh);																						
	
	this.Container.appendChild(this.Renderer.domElement);

	this.CSSRenderer.setSize(CAMERA_PARAMETERS.SCREEN_WIDTH, CAMERA_PARAMETERS.SCREEN_HEIGHT);
	this.CSSRenderer.domElement.style.position = "absolute";
	this.CSSRenderer.domElement.style.top = 0;
	this.Container.appendChild(this.CSSRenderer.domElement);

	this.Clock = new THREE.Clock();
	
	this.Body = json_params.body;
	
// ВНИМАНИЕ: В игре используется глобальный объект		
	this.NetMessagesObject = new _NetMessages({nickname: this.Nickname, id: this.ID});
	
	// Список удаленных игроков;
	this.RemoteUsers = [];
 
  // Локальный игрок
	this.LocalUser = null;
	/*Все игроки в системе.
	[0] - LocalUser;
	[1] - RemoteUsers - удаленные игроки
  структура, хранящая всех игроков, включая локального;	
	*/
	this.AllUsers = [];

	/*Идентификатор комнаты будет устанавливаться,
		когда пользователь будет в комнате;
	*/
	this.RoomID = null;
	if(json_params.room_id !== undefined)
		this.setRoomID(json_params.room_id);
	else
		this.setRoomID(DEFAULT_ROOM_ID);

	this.Peer = window.Peer;

	this.comeIntoRoom();
/*	this.Peer.on("error", function (err) {
		throw new Error("Error in Peer.js Working");
	});
	this.Peer.on("close", function () {});
	// Устанавливаем обработчика событий
	this.Peer.on("connection", this.onRecieveDataConnectionBF);
	this.Peer.on("call", this.onCallBF);	

*/
		
//	this.onOpenInitAndStartGame();
};		

_VKSpaceChat.prototype.createFlyingObjects = function ()
{
	this.FlyingObjects = [];
	for (var i=0; i<FLYING_OBJECTS.NEAREST_OBJECTS_COUNT; i++)
	{
		var el = new THREE.Mesh(
				new THREE.BoxGeometry(50, 50, 50), 
				new THREE.MeshStandardMaterial({color: 0xffffff*Math.random(), opacity: Math.random()*0.2+0.7, transparent: true})
			);
		el.position.y = FLYING_OBJECTS.FLYING_MIN_HEIGHT_START_POSITION*Math.random()-200;
		el.position.z = FLYING_OBJECTS.FlYING_RADIUS*(Math.random()-1.5);
		el.position.x = FLYING_OBJECTS.FlYING_RADIUS*(Math.random()*2-1);

		this.FlyingObjects.push(el);
		this.Scene.add(el);
	}

	for(var i=0; i < FLYING_OBJECTS.FARTHER_OBJECTS_COUNT; i++)
	{
		var el = new THREE.Mesh(
				new THREE.SphereGeometry(10+Math.round(Math.random()*-3), 32, 32), 
				new THREE.MeshStandardMaterial({color: 0xd2fff0, opacity: 0.9, transparent: true})
			);
		el.position.y = FLYING_OBJECTS.FLYING_MIN_HEIGHT_START_POSITION*Math.random()-400;
		el.position.z = FLYING_OBJECTS.FARTHER_OBJECTS_DISTANCE + 100*(Math.random()-0.5);
		el.position.x = FLYING_OBJECTS.FlYING_RADIUS*(Math.random()*2-1);

		this.FlyingObjects.push(el);
		this.Scene.add(el);
	}
};


_VKSpaceChat.prototype.controlFlyingObjects = function ()
{
	for(var i=0; i< FLYING_OBJECTS.NEAREST_OBJECTS_COUNT; i++)
	{		
		if(this.FlyingObjects[i].position.y >= FLYING_OBJECTS.FLYING_MAX_HEIGHT)
		{
			this.FlyingObjects[i].position.y = FLYING_OBJECTS.FLYING_MIN_HEIGHT_START_POSITION*Math.random()-400;
			this.FlyingObjects[i].position.z = FLYING_OBJECTS.FlYING_RADIUS*(Math.random()-1.5);
			this.FlyingObjects[i].position.x = FLYING_OBJECTS.FlYING_RADIUS*(Math.random()*2-1);
		} else
		{
			this.FlyingObjects[i].position.y += 1.5;
		}
	}

	for(var i= FLYING_OBJECTS.NEAREST_OBJECTS_COUNT; i<(FLYING_OBJECTS.NEAREST_OBJECTS_COUNT+FLYING_OBJECTS.FARTHER_OBJECTS_COUNT); i++)
	{		
		if(this.FlyingObjects[i].position.y >= FLYING_OBJECTS.FARTHER_FLYING_MAX_HEIGHT)
		{
			this.FlyingObjects[i].position.y = FLYING_OBJECTS.FLYING_MIN_HEIGHT_START_POSITION*Math.random()-400;
			this.FlyingObjects[i].position.z = FLYING_OBJECTS.FARTHER_OBJECTS_DISTANCE + 100*(Math.random()-0.5);
			this.FlyingObjects[i].position.x = FLYING_OBJECTS.FlYING_RADIUS*(Math.random()*2-1);
		} else
		{
			this.FlyingObjects[i].position.y += 2;
		}
	}	
};

_VKSpaceChat.prototype.onPeerServerConnectionOpen = function ()
{
	this.comeIntoRoom();
};

/*
Передает полученное соединение для передачи данных соответствующему пользователю.
Объект удаленного пользователя решает сам, нужно ли принимать новое соединение.
*/
_VKSpaceChat.prototype.onRecieveDataConnection = function (conn)
{
	this.AllUsers[1][0].onRecieveDataConnection(conn);
};


/*Обрабатывает медиапотоки, присылваемые другими пользователями,
 *и присваивает их нужным пользователям!
 */
_VKSpaceChat.prototype.onCall = function (call)
{
	for(var i=0; i<this.AllUsers[1].length; i++)
	{
		//call.answer(Stream);
		if(this.AllUsers[1][i].getPeerID() === call.peer)
			this.AllUsers[1][i].onCall(call);
	}
};


/* Инициализирует начало работы Peer.js
 */
_VKSpaceChat.prototype.onOpenInitAndStartGame = function (e)
{

	this.AllUsers.push(this.LocalUser);
	this.AllUsers.push(this.RemoteUsers);
	
	this.RemoteUsers.push(new _RemoteUser({
		net_messages_object: this.NetMessagesObject,
		all_users: this.AllUsers,
		scene: this.Scene,
		cssscene: this.CSSScene,
		peer: this.Peer,
		room_id: this.RoomID
	}));

	// Локальный игрок, который будет
	this.LocalUser = new _LocalUser({
		scene: this.Scene, 
		cssscene: this.CSSScene,
		all_users: this.AllUsers, 
		net_messages_object: this.NetMessagesObject,
		camera: this.Camera,
		body: this.Body,
		stream: window.StreamObj,
		room_id: this.RoomID,
		peer: this.Peer,
		vkid: generateRandomString(8)
	});

//	this.getAndSetInitConnections();

	
	this.startWorkingProcess();

};

/* Важнейшая функция.
 * Создает соединения с пользователями, которые уже
 * находятся в сети.
 * Принимает на вход:
 * json_params: {response: [ids]}
 */
_VKSpaceChat.prototype.createUsersByExistingConnections = function (json_params)
{
	if(json_params === "undefined")
	{
		throw new Error(this.constructor.name + ".createUsersByExistingConnections(json_response) - have no json_response");
		return;
	}
	
	if(typeof(json_params) === "string")
	{
		json_params = JSON.parse(json_params);
	}
	for(var i=0; i<json_params.response.length; i++)
	{
		// на сервере уже будет установлено наше соединение;
		// а сами к себе мы подсоединяться не должны!
		if(this.Peer.id === json_params.response[i])
		{
			continue;
		}
		var conn = this.Peer.connect(json_params.response[i]);
		this.RemoteUsers.push(new _RemoteUser({
			net_messages_object: this.NetMessagesObject,
			all_users: this.AllUsers,
			scene: this.Scene,
			connection: conn
		}));
	}

	this.AllUsers[0].makeCallsToAllRemoteUsers();	
};
/*
 
*/
_VKSpaceChat.prototype.makeCallsToAllRemoteUsers = function (stream)
{
	for(var i=0; i<this.AllUsers[1].length; i++)
	{
		this.Peer.call(this.AllUsers[1][i].getPeerID(), stream);
	}
	
};

/* Важнейшая функция игры, в которой происходит управление и обновление всех систем!!
 */

_VKSpaceChat.prototype.updateWorkingProcess = function ()
{
/*	
	if(YouTubePlayer.getVolume() > 1)
	{
		YouTubePlayer.setVolume(YouTubePlayer.getVolume() - 1);
	}
*/
	this.controlFlyingObjects();
	this.LocalUser.update();
	this.updateRemoteUsers();
	this.CSSRenderer.render(this.CSSScene, this.Camera);
	this.Renderer.render(this.Scene, this.Camera);
	for(var i=0; i < ForUpdating.length; i++)
	{
		ForUpdating[i]();
	}
	requestAnimationFrame(this.updateWorkingProcessBF);
};

/* Производит обновление телодвижений удаленных игроков.
 */
_VKSpaceChat.prototype.updateRemoteUsers = function ()
{
	for(var j=0; j<this.RemoteUsers.length; j++)
	{
		this.RemoteUsers[j].update();
	}
};

_VKSpaceChat.prototype.setRoomID = function(id)
{
	this.RoomID = id;
};

/*
	Получает список находящихся в комнате пользователей,
	и создает с ними соединения.
*/
_VKSpaceChat.prototype.comeIntoRoom = function (json_params)
{
	if(this.RoomID === null)
	{
		throw new Error("Problem with room_id in function getAndSetInitConnections");
		return;
	}

	var req_str = SERVER_REQUEST_ADDR  + "/" + REQUESTS.UTOS.COME_INTO_ROOM;
	$.ajax({
		type:"POST",
		url: req_str,
		async: true,
		data: {room_id : this.RoomID, user_id: this.Peer.id},
		success: this.onOpenInitAndStartGameBF,
		error: function (jqXHR, textStatus, errorThrown) {
			alert(textStatus + " " + errorThrown);
		}
	});

};

/*
	Получает список находящихся в комнате пользователей,
	и создает с ними соединения.
*/
_VKSpaceChat.prototype.getAndSetRemoteUsersIDs = function (json_params)
{
	if(this.RoomID === null)
	{
		throw new Error("Problem with room_id in function getAndSetInitConnections");
		return;
	}
	var req_str = SERVER_REQUEST_ADDR  + "/" + REQUESTS.UTOS.COME_INTO_ROOM;
	$.ajax({
		type:"POST",
		url: req_str,
		async: false,
		data: {room_id: this.RoomID, user_id: this.Peer.id},
		success: this.setAllUsersIDsArrayBF,
		error: function (jqXHR, textStatus, errorThrown) {
			alert(textStatus + " " + errorThrown);
		}
	});
};
/*
IN:
json_params: {
	response: array
}
*/
_VKSpaceChat.prototype.setAllUsersIDsArray = function (json_params)
{
	if(typeof(json_params) === "string")
	{
		json_params = JSON.parse(json_params);
	}
	this.AllUsersIDsArray = json_params.response;
};

/* функция добавляет полученное соединение в массив соединений Connections
 * и сразу отправляет запрос на получение nickname нового игрока
 */
_VKSpaceChat.prototype.createUserByRecievedConnection = function (conn)
{
	var last_remote_user = new _RemoteUser({
		connection: conn,
		scene: this.Scene,
		all_users: this.AllUsers,
		net_messages_object: this.NetMessagesObject													
	}); 

	this.Peer.call(last_remote_user.getPeerID(), this.AllUsers[0].getStream());
	this.RemoteUsers.push(last_remote_user);
};


/* завершаем соединение с игроком
 */
_VKSpaceChat.prototype.disconnectRemoteUsers = function()
{
	while(this.RemoteUsers.length > 0)
	{
		this.RemoteUsers[this.RemoteUsers.length-1].Conection.close();
		this.RemoteUsers.pop();
	}
};
/*Устанавливает Nickname во всех необходимых структурах
*/
_VKSpaceChat.prototype.setNickname = function (nickname)
{
	this.Nickname = nickname;
	this.NetMessagesObject.setNickname(nickname);
};

_VKSpaceChat.prototype.startWorkingProcess = function ()
{
	requestAnimationFrame(this.updateWorkingProcessBF);	
};
