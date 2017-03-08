/*Rласс описывает 3D меню.
 *В нем будет находиться текущий корабль игрока и бэкграунд.
 */
var _Menu = function (json_params)
{
		
		/* START OF FUNCTIONS BINDS
	 * */
	this.updateBF = this.update.bind(this);
	this.onNicknameEnteringBF = this.onNicknameEntering.bind(this);
	this.createSelectOptionsByRoomsListBF = this.createSelectOptionsByRoomsList.bind(this);
	this.onRoomSelectBF = this.onRoomSelect.bind(this);
	this.onStartButtonClickBF = this.onStartButtonClick.bind(this);
	this.onConnectionOpenBF = this.onConnectionOpen.bind(this);
	this.onerrorBF = this.onerror.bind(this);
	this.onsuccessBF = this.onsuccess.bind(this);
		/*END OF FUNCTIONS BINDS
		 */	
	
	
	this.Container = document.createElement("div");
	this.Container.setAttribute("id", "MenuContainer");
	document.body.appendChild(this.Container);
	
	
	this.Camera = new THREE.PerspectiveCamera(
		CAMERA_PARAMETERS.ANGLE, 
		CAMERA_PARAMETERS.SCREEN_WIDTH/CAMERA_PARAMETERS.SCREEN_HEIGHT, 
		CAMERA_PARAMETERS.NEAR, 
		CAMERA_PARAMETERS.FAR
	);
	this.Camera.position.set(0,-200,1200);

	this.Material = new THREE.MeshBasicMaterial();
	
	this.CSSScene = new THREE.Scene();
	this.Scene = new THREE.Scene();
	
	this.Renderer = new THREE.WebGLRenderer({antialias: true, shadows: true});
	this.Renderer.setSize(CAMERA_PARAMETERS.SCREEN_WIDTH, CAMERA_PARAMETERS.SCREEN_HEIGHT);
	this.Container.appendChild(this.Renderer.domElement);
	

	this.createFlyingObjects();

	var startexture = new THREE.ImageUtils.loadTexture("models/bg_1_1.png");
	var ambientlight = new THREE.AmbientLight( 0xffffff, 5 );
	this.Scene.add(ambientlight);

	this.SkyBox = {};
	this.SkyBox.Geometry = new THREE.BoxGeometry(10, 10, 10);
	this.SkyBox.Geometry.scale(1000, 1000, 1000);
	this.SkyBox.Material = new THREE.MeshStandardMaterial({map: startexture, side: THREE.DoubleSide});
	this.SkyBox.Mesh = new THREE.Mesh(this.SkyBox.Geometry, this.SkyBox.Material);
	this.Scene.add(this.SkyBox.Mesh);																						

/*	
	this.SkyBox = {};
	this.SkyBox.Geometry = new THREE.BoxGeometry(10000, 10000, 10000);
	this.SkyBox.Material = new THREE.MeshBasicMaterial({color: 0x9999ff, side: THREE.BackSide});
	this.SkyBox.Mesh = new THREE.Mesh(this.SkyBox.Geometry, this.SkyBox.Material);
	this.Scene.add(this.SkyBox.Mesh);
*/	
	this.CSSRenderer = new THREE.CSS3DRenderer();
	this.CSSRenderer.setSize(CAMERA_PARAMETERS.SCREEN_WIDTH, CAMERA_PARAMETERS.SCREEN_HEIGHT);
	this.CSSRenderer.domElement.style.position = "absolute";
	this.CSSRenderer.domElement.style.top = 0;
	this.Container.appendChild(this.CSSRenderer.domElement);

	
	this.Inputs = {};

	this.Inputs.GreetingAndAccessAgreement = {};
	this.Inputs.GreetingAndAccessAgreement.ObjHTML = document.createElement("div");
	this.Inputs.GreetingAndAccessAgreement.ObjHTML.id = "greeting_and_access_agreement_div";
	this.Inputs.GreetingAndAccessAgreement.ObjHTML.innerHTML = 
	"Здравствуйте!<br /> Чтобы чат заработал, необходимо разрешить доступ к видеокамере и микрофону!";
	
	this.Inputs.GreetingAndAccessAgreement.Obj3DCSS = new THREE.CSS3DObject(this.Inputs.GreetingAndAccessAgreement.ObjHTML);
	this.Inputs.GreetingAndAccessAgreement.Obj3DCSS.position.x = Math.random();
	this.Inputs.GreetingAndAccessAgreement.Obj3DCSS.position.y = Math.random();
	this.Inputs.GreetingAndAccessAgreement.Obj3DCSS.position.z = Math.random();
	this.CSSScene.add(this.Inputs.GreetingAndAccessAgreement.Obj3DCSS);
	
	
	this.Inputs.StartProgButton = {};
	this.Inputs.StartProgButton.ObjHTML = document.createElement("input");
	this.Inputs.StartProgButton.ObjHTML.type = "button";
	this.Inputs.StartProgButton.ObjHTML.id = "start_button";
	this.Inputs.StartProgButton.ObjHTML.value = "Начать";
	this.Inputs.StartProgButton.ObjHTML.onclick = this.onStartButtonClickBF;	
	

	this.Inputs.StartProgButton.Obj3DCSS = new THREE.CSS3DObject(this.Inputs.StartProgButton.ObjHTML);
	this.Inputs.StartProgButton.Obj3DCSS.position.x = 0;
	this.Inputs.StartProgButton.Obj3DCSS.position.y = -200;
	this.Inputs.StartProgButton.Obj3DCSS.position.z = Math.random();
	
//	this.MessagingWindow = new _ChatModule({scene: this.CSSScene});

	this.checkNicknameRegExp = new RegExp("\\w+");	
	this.Body = new _Body();
	this.RoomID = null;

	if(GAME_ROOM_MODE === ROOM_MODE.SINGLE)
	{
		this.initSingleRoomMode();
	} else
	{
		this.initMultiRoomMode();
	}
	
	this.updating = true;
	this.updateBF();

	makeRightStreamRequest({
		constraints:{video: true, audio: true},
		onsuccess: this.onsuccessBF, 
		onerror: this.onerrorBF
	});

};

_Menu.prototype.createFlyingObjects = function ()
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
		el.position.z = FLYING_OBJECTS.FLYING_MIN_HEIGHT_START_POSITION*Math.random()-400;
		el.position.y = FLYING_OBJECTS.FARTHER_OBJECTS_DISTANCE + 100*(Math.random()-0.5);
		el.position.x = FLYING_OBJECTS.FlYING_RADIUS*(Math.random()*2-1);

		this.FlyingObjects.push(el);
		this.Scene.add(el);
	}
};

_Menu.prototype.controlFlyingObjects = function ()
{
	for(var i=0; i< FLYING_OBJECTS.NEAREST_OBJECTS_COUNT; i++)
	{		
		if(this.FlyingObjects[i].position.z >= FLYING_OBJECTS.FLYING_MAX_HEIGHT)
		{
			this.FlyingObjects[i].position.z = FLYING_OBJECTS.FLYING_MIN_HEIGHT_START_POSITION*Math.random()-900;
			this.FlyingObjects[i].position.y = FLYING_OBJECTS.FlYING_RADIUS*(Math.random()-1.5);
			this.FlyingObjects[i].position.x = FLYING_OBJECTS.FlYING_RADIUS*(Math.random()*2-1)*3;
		} else
		{
			this.FlyingObjects[i].position.z += 5;
		}
	}

	for(var i= FLYING_OBJECTS.NEAREST_OBJECTS_COUNT; i<(FLYING_OBJECTS.NEAREST_OBJECTS_COUNT+FLYING_OBJECTS.FARTHER_OBJECTS_COUNT); i++)
	{		
		if(this.FlyingObjects[i].position.z >= FLYING_OBJECTS.FARTHER_FLYING_MAX_HEIGHT)
		{
			this.FlyingObjects[i].position.z = FLYING_OBJECTS.FLYING_MIN_HEIGHT_START_POSITION*Math.random()-900;
			this.FlyingObjects[i].position.y = FLYING_OBJECTS.FARTHER_OBJECTS_DISTANCE + 300*(Math.random()-0.5);
			this.FlyingObjects[i].position.x = FLYING_OBJECTS.FlYING_RADIUS*(Math.random()*2-1)*3;
		} else
		{
			this.FlyingObjects[i].position.z += 3;
		}
	}	
};


_Menu.prototype.onsuccess = function (streamp) {
	this.Inputs.GreetingAndAccessAgreement.ObjHTML.innerHTML = "Можно начинать!";
	this.CSSScene.add(this.Inputs.StartProgButton.Obj3DCSS);
	window.StreamObj = streamp;
};

_Menu.prototype.onerror = function ()
{
	this.showRenouncement();
};

_Menu.prototype.showRenouncement = function ()
{
	this.Inputs.GreetingAndAccessAgreement.ObjHTML.innerHTML = 
	"Вы не разрешили доступ к видеокамере и микрофону :( <br /> Приложение не может начать работ...";
};

_Menu.prototype.excess = function ()
{

	this.Inputs.Nickname = {};
	this.Inputs.Nickname.ObjHTML = document.createElement("div");
	this.Inputs.Nickname.ObjHTML.type = "text";
	this.Inputs.Nickname.ObjHTML.id = "nickname_input";
	this.Inputs.Nickname.ObjHTML.setAttribute("autofocus", "");
	
	this.Inputs.Nickname.ObjHTML.oninput = this.onNicknameEnteringBF;
	
	this.Inputs.Nickname.Obj3DCSS = new THREE.CSS3DObject(this.Inputs.Nickname.ObjHTML);
	this.Inputs.Nickname.Obj3DCSS.position.x = Math.random();
	this.Inputs.Nickname.Obj3DCSS.position.y = Math.random();
	this.Inputs.Nickname.Obj3DCSS.position.z = Math.random();
	this.CSSScene.add(this.Inputs.Nickname.Obj3DCSS);
};

_Menu.prototype.onConnectionOpen = function ()
{
	this.ConnectionStatus = CONNECTION_IS_OPEN;
};

_Menu.prototype.update = function ()
{
	if(this.Camera.position.z > 700)
	{
		this.Camera.position.z -= 2;
	}	
	if(this.Camera.position.y < 0)
	{
		this.Camera.position.y += 2;		
	}	
	if(this.Camera.position.x < 0)
	{
		this.Camera.position.x -= 5;				
	}
/*
	if(YouTubePlayer.getVolume() < 80)
	{
		YouTubePlayer.setVolume(YouTubePlayer.getVolume() + 1);
	}
*/
	this.controlFlyingObjects();
	this.Renderer.render(this.Scene, this.Camera);
	this.CSSRenderer.render(this.CSSScene, this.Camera);
	
	this.Inputs.StartProgButton.Obj3DCSS.rotation.y += 0.005;
	if(this.Inputs.StartProgButton.Obj3DCSS.rotation.y >= 1.57)
	{
		this.Inputs.StartProgButton.Obj3DCSS.rotation.y = -this.Inputs.StartProgButton.Obj3DCSS.rotation.y;	
	}
	
	if(this.updating === true)
		requestAnimationFrame(this.updateBF);
	else
	{
		delete this.FlyingObjects;
	}
};
/*Инициализация при многокомнатном режиме*/
_Menu.prototype.initMultiRoomMode = function ()
{
	this.Inputs.RoomsListSelect = {};
	this.Inputs.RoomsListSelect.ObjHTML = document.createElement("select");
	this.Inputs.RoomsListSelect.ObjHTML.id = "rooms_list_select";
	this.Inputs.RoomsListSelect.ObjHTML.onclick = this.onRoomSelectBF;

	this.Inputs.RoomsListSelect.Obj3DCSS = new THREE.CSS3DObject(this.Inputs.RoomsListSelect.ObjHTML);
	this.Inputs.RoomsListSelect.Obj3DCSS.position.x = 400;
	this.Inputs.RoomsListSelect.Obj3DCSS.position.y = 300;
	this.Inputs.RoomsListSelect.Obj3DCSS.position.z = 0;
	this.CSSScene.add(this.Inputs.RoomsListSelect.Obj3DCSS);
	
	this.setRoomsList();
	
};

/*Инициализация при однокомнатном режиме*/
_Menu.prototype.initSingleRoomMode = function ()
{
	this.RoomID = DEFAULT_ROOM_ID;
};
/*Делает запрос на 
 */
_Menu.prototype.setRoomsList = function ()
{
	this.sendServerRequest({
		request_type: REQUESTS.UTOS.GET_ROOMS_LIST,
		success_func: this.createSelectOptionsByRoomsListBF
	});
};

/*Создает нужное количетсво option's
 * и добавлят в select;
 * Доступно только в MULTI_ROOMS режиме!!!
	IN: json_params = response: {
	* 	room_id,	// идентификатор комнаты
	* 	users_count, // количетсво участников
	*   room_name // имя комнаты
	* }
*/
_Menu.prototype.createSelectOptionsByRoomsList = function (json_params)
{
	if(typeof(json_params) === "string")
		json_params = JSON.parse(json_params);

	for(var i=0; i<json_params.rooms.length; i++)
	{
		var opt = document.createElement("option");
		opt.innerHTML = json_params.rooms[i].room_name;
		opt.value = json_params.rooms[i].room_id;
		this.Inputs.RoomsListSelect.ObjHTML.appendChild(opt);
	}
	
	this.Inputs.RoomsListSelect.ObjHTML.size = json_params.rooms.length;
};

_Menu.prototype.onRoomSelect = function ()
{
	
};

/* Отправляет запросы и обрабатывает ответы.
	* Формирует из параметров строку запроса и отправляет запрос на сервер.
	IN: json_params = Room{
	* 	request_type, // тип запроса, параметров не требует
	* 	success_func[, // функция, которая будет вызвана
	* 	data, // даннные. если есть. Не обязательны для некоторых запросов 
	* 	]
	* }
*/
_Menu.prototype.sendServerRequest = function (json_params)
{

	var req_obj = {};
	if(json_params.request_type === undefined)
	{
		throw new Error("PROBLEM WITH sendServerRequest");
	}	
	if(json_params.success_func === undefined)
	{
		throw new Error("PROBLEM WITH sendServerRequest");
	}
	if(json_params.data !== undefined)
	{
		req_obj.data = json_params.data;
	}
	var req_str = SERVER_REQUEST_ADDR;
	req_str += "/" + json_params.request_type + "/";
	
	req_obj.type = "POST";
	req_obj.url	= req_str;	
	req_obj.async = false;
	req_obj.success = json_params.success_func;
	
	$.ajax(req_obj);

};

_Menu.prototype.hasSelectedRoom = function ()
{
	if(GAME_ROOM_MODE === ROOM_MODE.SINGLE)
	{
		return true;
	}	else
	{
		///////////////////////////////////
		//////////////////////////////////
		////СДЕЛАТЬ ПРОВЕРКУ НА ВЫБОР ОДНОЙ ИЗ КОМНАТ!
	}
};

_Menu.prototype.canStart = function ()
{
	if(this.hasSelectedRoom() !== true)
	{
		return false;
	}
	
	return true;
};

/*Обрабатывает нажатие на кнопку запуска чата
 *Так же производит копирование в тело никнейма пользователя.
 *В дальнейшем из тела будут читаться данные ID, Nickname
 */
_Menu.prototype.onStartButtonClick = function ()
{
	if(this.canStart() === true)
	{
		this.updating = false;
		this.SpaceChat = new _VKSpaceChat({
			camera: this.Camera,
			renderer: this.Renderer,
			cssrenderer: this.CSSRenderer
		});
	}
};


/*проверка на правильность вводимых символов*/
_Menu.prototype.onNicknameEntering = function ()
{
	if((this.Inputs.Nickname.ObjHTML.value.charAt(this.Inputs.Nickname.ObjHTML.value.length-1)).match(this.checkNicknameRegExp) === null)
	{			
		this.onErrorNicknameEntering();
	}else if(this.Inputs.Nickname.ObjHTML.value.length > MAX_NICKNAME_LENGTH)
	{
		this.onNicknameMaxLength();
	}else
	{
		this.onRightNicknameEntering();
	}
};

_Menu.prototype.onNicknameMaxLength = function ()
{
	this.Inputs.Nickname.ObjHTML.value = this.Inputs.Nickname.ObjHTML.value.slice(0, this.Inputs.Nickname.ObjHTML.value.length-1);
};


_Menu.prototype.onErrorNicknameEntering = function ()
{
	this.Inputs.Nickname.ObjHTML.value = this.Inputs.Nickname.ObjHTML.value.slice(0, this.Inputs.Nickname.ObjHTML.value.length-1);
	this.Inputs.Nickname.ObjHTML.style.border = "5px solid red";
};

_Menu.prototype.onRightNicknameEntering = function ()
{
	this.Inputs.Nickname.ObjHTML.style.border = "5px solid green";
};
