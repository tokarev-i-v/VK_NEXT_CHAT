
/* Класс описывает локального игрока.
 * Класс должен ОБЯЗАТЕЛЬНО принять необходимые параметры в формате JSON:
 * {
 *   user_type: type - тип игрока, фиксирован....
 *   all_users: Game.Players, - содержит список удаленных игроков, чтобы отсылать им данные
 *   scene: THREE.Scene(); - объект сцены, в которую нужно будет добавить свой корабль
 * }
 * Пользователи сами обрабатывают медиа-вызовы!

 Локальный пользователь обрабатывает поступаемые к нему соединения.
 Сам ищет новые соединения.
 В обоих случаях, после подтверждения того, что к новому пользователю можно подсоединиться - передает
 его объекту RemoteUser = AllUsers[1][0];
 */  
 /*
IN:
json_params = {
	vkid: vkid,
	stream: getUserMedia()
};
 */

var _LocalUser = function (json_params)
{
	this.onMouseMoveBF = this.onMouseMove.bind(this);
	window.addEventListener("mousemove", this.onMouseMoveBF, false);
	this.onClickBF = this.onClick.bind(this);
	window.addEventListener("click", this.onClickBF, false);
	this.setVideoTextureBF = this.setVideoTexture.bind(this);
	this.onOpenDataConnectionBF = this.onOpenDataConnection.bind(this);
	this.onDataRecievedBF = this.onDataRecieved.bind(this); 
	this.onCloseConnectionBF = this.disconnect.bind(this); 
	this.onDataConnectionErrorBF = this.onDataConnectionError.bind(this); 
	this.makeMediaConnectionAnswerBF = this.makeMediaConnectionAnswer.bind(this);
	this.onStreamBF = this.onStream.bind(this);
	this.setAllUsersIDsArrayBF = this.setAllUsersIDsArray.bind(this);
	this.setAllUsersIDsArrayAndStartFindCandidateBF = this.setAllUsersIDsArrayAndStartFindCandidate.bind(this);
	this.onVideoButtonClickBF = this.onVideoButtonClick.bind(this);
	this.onFindNextButtonClickBF = this.onFindNextButtonClick.bind(this);
	this.onRecieveDataConnectionBF = this.onRecieveDataConnection.bind(this);
	this.onRecieveMediaConnectionBF = this.onRecieveMediaConnection.bind(this);	

	this.onRecievedOpenDataConnectionBF = this.onRecievedOpenDataConnection.bind(this);
	this.onRecievedDataConnectionDataBF = this.onRecievedDataConnectionData.bind(this);
	this.onRecievedDataConnectionCloseBF = this.onRecievedDataConnectionClose.bind(this);
	this.onRecievedDataConnectionErrorBF = this.onRecievedDataConnectionError.bind(this);

	this.Scene = null;
	this.CSSScene = null;		
	this.NetMessagesObject = null;
	this.AllUsers = null;
	this.VisualKeeper = null;
	this.MediaConnection = null;
	this.UserType = USER_TYPES.LOCAL;		
	this.Video = null;
	this.VideoImage = null;
	this.VideoImageContext = null;
	this.VideoTexture = null;
	this.VKID = null;
	this.Body = null;
	this.AllUsersIDsArray = null;
	this.Peer = null;
	this.RoomID = null;
	this.Raycaster = new THREE.Raycaster();
	this.MouseVector = new THREE.Vector2();
	this.INTERSECTED = null;
	this.IntersectsArray = null;
	this.UserStatus = USER_STATUS.NEED_FIND_REMOTE_USER;
	this.Stream = null;
	// Если пользователи готовы начать
	this.TheWillignessOfUsers = {
		LocalUser: THE_WILLIGNESS_OF_USERS.LOCAL_USER.NO,
		RemoteUser: THE_WILLIGNESS_OF_USERS.REMOTE_USER.NO,
		ISentStreamToRemoteUser: THE_WILLIGNESS_OF_USERS.LOCAL_USER.NO
	};

	// Определяет поступившего кандидата;
	this.RecievedCandidate = {
		Connection: null, // поступившее соединение
		SendingTime: null, // время,
		Status: RECIEVED_CANDIDATE.STATUS.NOT_INSTALLED
	};
	// Определяет поступившего кандидата;
	this.FoundCandidate = {
		Connection: null,
		Status: FOUND_CANDIDATE.STATUS.NOT_INSTALLED,
		SendingTime: null
	};


	this.TryingFindRemoteUsersCounter = 0;
	this.WeNeedToFindNewCompanionByDisconnectedUser = false;

	this.initParameters(json_params);
	
	this.ChatControls = new _ChatControls({
		on_vkid_button_click: this.onVKIDButtonClickBF,
		on_video_button_click: this.onVideoButtonClickBF,
		on_find_next_button_click: this.onFindNextButtonClickBF,
		scene: this.Scene,
		cssscene: this.CSSScene
	});

	this.Peer.on("connection", this.onRecieveDataConnectionBF);
	this.Peer.on("call", this.onRecieveMediaConnectionBF);
	this.Peer.on("error", function (err) {
//		alert(err.type);
	});

	this.VisualKeeper = new _VisualKeeper({scene: this.Scene, user_type: this.UserType});
  	this.setVideoTexture(this.Stream);

	//this.setDataConnectionHandlers();
	this.initCommunicationOptions();

};

_LocalUser.prototype.setVisualKeeper = function ()
{
	this.VisualKeeper = new _VisualKeeper({scene: this.Scene, cssscene: this.CSSScene, random: true, user_type: this.UserType});
};

/*
////////////////////////////////////////////////////////////////////////
///////////////////GETTERS AND SETTERS//////////////////////////////////
////////////////////////////////////////////////////////////////////////
*/
_LocalUser.prototype.setVKID = function (vk_id)
{
	this.VKID = vk_id;	
};
_LocalUser.prototype.getVKID = function ()
{
	return this.VKID;
};
_LocalUser.prototype.getPeerID = function ()
{
	return this.Peer.id;
};
_LocalUser.prototype.getMesh = function ()
{
	return this.VisualKeeper.getMesh();
};

_LocalUser.prototype.getShip = function ()
{
	return this.VisualKeeper;
};
_LocalUser.prototype.getStream = function ()
{
	return this.Stream;
};

_LocalUser.prototype.isRemoteVKIDSet = function ()
{
	if(this.AllUsers[1][0].getVKID() !== null &&
		this.AllUsers[1][0].getVKID() !== undefined
		)
	{
		return true;
	} else
	{
		return false;
	}
};

_LocalUser.prototype.isRemoteStreamSet = function ()
{
	if(this.AllUsers[1][0].getStream() !== null &&
			this.AllUsers[1][0].getStream() !== undefined
		)
	{
//		alert(this.AllUsers[1][0].getStream());
		return true;
	} else
	{
		return false;
	}
};
/*
//////////////////////////////////////////////////////////////////////////
//////////////////////OTHER FUNCTIONS/////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
*/
_LocalUser.prototype.initCommunicationOptions = function ()
{
	this.CommunicationOptions = {
		Status: COMMUNICATION_OPTIONS.STATUS.WAITING,
		VideoState: COMMUNICATION_OPTIONS.VIDEO_STATE.HIDE,
		VKIDState: COMMUNICATION_OPTIONS.VKID_STATE.HIDE
	};
};

_LocalUser.prototype.onMouseMove = function (event)
{
	this.MouseVector.x = (event.clientX / CAMERA_PARAMETERS.SCREEN_WIDTH) * 2 - 1;
	this.MouseVector.y = -(event.clientY / CAMERA_PARAMETERS.SCREEN_HEIGHT) * 2 + 1;
};

_LocalUser.prototype.onClick = function ()
{
	if(this.INTERSECTED !== undefined && this.INTERSECTED !== null)
	{
	}
};


_LocalUser.prototype.onVideoButtonClick = function ()
{
	
	switch(this.CommunicationOptions.VideoState)
	{
		case COMMUNICATION_OPTIONS.VIDEO_STATE.HIDE:
			this.FoundCandidate.Connection.send(this.NetMessagesObject.ShowVideoMessage);
			this.CommunicationOptions.VideoState = COMMUNICATION_OPTIONS.VIDEO_STATE.SHOW;
			this.showVideo();
		break;
		case COMMUNICATION_OPTIONS.VIDEO_STATE.SHOW:
			this.FoundCandidate.Connection.send(this.NetMessagesObject.HideVideoMessage);
			this.CommunicationOptions.VideoState = COMMUNICATION_OPTIONS.VIDEO_STATE.HIDE;
			this.hideVideo();
		break;
	}


};

_LocalUser.prototype.makeEndCommunicatingServerRequest = function ()
{
	var req_str = SERVER_REQUEST_ADDR  + "/" + REQUESTS.UTOS.END_COMMUNICATING;
	$.ajax({
		type:"POST",
		url: req_str,
		async: true,
		data: {user_id: this.getPeerID()},
		error: function (jqXHR, textStatus, errorThrown) {
			alert(textStatus + " " + errorThrown);
		}
	});	
};

_LocalUser.prototype.onFindNextButtonClick = function ()
{
	if(this.VisualKeeper.getMovementStatus() === VIDEO_MESH_MOVEMENT.STATUS.STANDING &&
		this.AllUsers[1][0].VisualKeeper.getVideoMesh().position.equals(VIDEO_MESH_MOVEMENT.POSITIONS.REMOTE.FRONT_OF_CAMERA)
	)
	{
//		alert(this.VisualKeeper.getMovementStatus());
		this.resetMeForWaiting();
		this.AllUsers[1][0].resetMeForWaiting();
		this.makeEndCommunicatingServerRequest();
		this.UserStatus = USER_STATUS.NEED_FIND_REMOTE_USER_AFTER_HIDE_ANIMATION_WILL_STOP;

	}
/*	
	switch(this.CommunicationOptions.VideoState)
	{
		case COMMUNICATION_OPTIONS.VIDEO_STATE.HIDE:
			this.CommunicationOptions.VideoState = COMMUNICATION_OPTIONS.VIDEO_STATE.SHOW;
			this.showVideo();
			this.AllUsers[1][0].hideVideo();
		break;
	}
*/
};
/*
Контролирует нажатие на любые 3d объекты!
В зависимости от того, какие
*/
_LocalUser.prototype.raycastingControl = function ()
{
	
	this.Raycaster.setFromCamera(this.MouseVector, this.Camera);

	this.IntersectsArray = this.Raycaster.intersectObjects(this.Scene.children);
	if (this.IntersectsArray.length > 0)
	{
		if(this.INTERSECTED != this.IntersectsArray[0].object)
		{
			if(this.INTERSECTED !== null && this.INTERSECTED !== undefined)
				this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.currentHex);
			else
				return;
			this.INTERSECTED = this.IntersectsArray[0].object;
			this.INTERSECTED.currentHex = this.INTERSECTED.material.emissive.getHex();
			this.INTERSECTED.material.emissive.setHex(0xff0000);
		}			
	}else
	{
		if (this.INTERSECTED)
			this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.currentHex);
		this.INTERSECTED = null;
	}
	
};
/*
Передает полученное соединение для передачи данных соответствующему пользователю.
Объект удаленного пользователя решает сам, нужно ли принимать новое соединение.
*/
_LocalUser.prototype.onRecieveDataConnection = function (conn)
{
	// Если наш общенческий статус установлен, то... мы закрываем соединение
	if(this.CommunicationOptions.Status === COMMUNICATION_OPTIONS.STATUS.COMMUNICATING)
	{
		conn.close();
		return;
	}

/*
	// Случай, когда два юзера пытаются сконнектиться друг с другом!
	// Нужно разрулить.
	if(this.RecievedCandidate.Status === RECIEVED_CANDIDATE.STATUS.NOT_INSTALLED &&
		this.FoundCandidate.Status !== FOUND_CANDIDATE.STATUS.INSTALLED_AS_REMOTE_USER
	){
		this.RecievedCandidate.Connection = conn;		
		this.RecievedCandidate.Status = RECIEVED_CANDIDATE.STATUS.APPEARED;
	} else
	{	
		conn.close();
		return;
	}

	if(this.FoundCandidate.Status === FOUND_CANDIDATE.STATUS.APPEARED)
	{
		this.FoundCandidate.Connection.close();
		this.FoundCandidate.Status = FOUND_CANDIDATE.STATUS.NOT_INSTALLED;
	}

	if(this.FoundCandidate.Status !== FOUND_CANDIDATE.STATUS.NOT_INSTALLED && 
		this.RecievedCandidate.Connection.peer === this.FoundCandidate.Connection.peer)
	{
		if(this.FoundCandidate.Status === FOUND_CANDIDATE.STATUS.INSTALLED_AS_REMOTE_USER)
		{
			this.RecievedCandidate.Connection.close();
			this.RecievedCandidate.Status = RECIEVED_CANDIDATE.STATUS.NOT_INSTALLED;
			return;
		}

		this.RecievedCandidate.Connection.on("open", this.onConcurrentOpenDataConnectionBF);
		this.RecievedCandidate.Connection.on("data", this.onConcurrentDataRecievedBF);
		this.RecievedCandidate.Connection.on("error", this.onRecievedDataConnectionErrorBF);
		this.RecievedCandidate.Connection.on("close", this.onRecievedDataConnectionCloseBF);
	} else
	{	
		this.RecievedCandidate.Connection.on("open", this.onRecievedOpenDataConnectionBF);
		this.RecievedCandidate.Connection.on("data", this.onRecievedDataConnectionDataBF);
		this.RecievedCandidate.Connection.on("error", this.onRecievedDataConnectionErrorBF);
		this.RecievedCandidate.Connection.on("close", this.onRecievedDataConnectionCloseBF);
	}
*/	
	this.RecievedCandidate.Connection = conn;
	this.RecievedCandidate.Status = RECIEVED_CANDIDATE.STATUS.APPEARED;

	this.RecievedCandidate.Connection.on("open", this.onRecievedOpenDataConnectionBF);
	this.RecievedCandidate.Connection.on("data", this.onRecievedDataConnectionDataBF);
	this.RecievedCandidate.Connection.on("error", this.onRecievedDataConnectionErrorBF);
	this.RecievedCandidate.Connection.on("close", this.onRecievedDataConnectionCloseBF);

	this.UserStatus = USER_STATUS.FINDING_REMOTE_USER;
};

_LocalUser.prototype.initParameters = function (json_params)
{
	if(json_params !== undefined)
	{
		
		if(json_params.scene  !== undefined)
			this.Scene = json_params.scene;
		else
			throw new Error("Where is Scene?");		
				
		if(json_params.cssscene  !== undefined)
			this.CSSScene = json_params.cssscene;
		else
			throw new Error("Where is Scene?");		
				
		if(json_params.net_messages_object !== undefined)
			this.NetMessagesObject = json_params.net_messages_object;
		else
			throw new Error("Where is NetMessagesObject?");		
		
		if(json_params.all_users !== undefined)
			this.AllUsers = json_params.all_users;
		else
			throw new Error("Where is AllUsers?");
		if(json_params.peer !== undefined)
			this.Peer = json_params.peer;
		else
			throw new Error("Where is Peer?");

		if(json_params.room_id !== undefined)
			this.RoomID = json_params.room_id;
		else
			throw new Error("Where is RoomID?");

		if(json_params.vkid !== undefined)
			this.VKID = json_params.vkid;	

		if(json_params.stream !== undefined)
		{
			this.Stream = json_params.stream;
		}		
	}else
		throw new Error(this.constructor.name + " have no json_params!");

};

/*
Основная фукнция удаленного игрока, проверяет состояния и производит необходимые действия
в зависимости от состояния.
*/
_LocalUser.prototype.update = function ()
{
//	if(this.CommunicationOptions.Status === COMMUNICATION_OPTIONS.STATUS.HAVE_RECIEVED_CONNECTION_CANDIDATE)
//		return;

	switch(this.UserStatus)
	{
		case USER_STATUS.NEED_FIND_REMOTE_USER_AFTER_HIDE_ANIMATION_WILL_STOP:
			if(this.VisualKeeper.getMovementStatus() === VIDEO_MESH_MOVEMENT.STATUS.STANDING &&
			this.AllUsers[1][0].VisualKeeper.getVideoMesh().position.equals(VIDEO_MESH_MOVEMENT.POSITIONS.REMOTE.LEFT_AWAY))
			{
//				alert("CAMERA AT LEFT");
				this.UserStatus = USER_STATUS.NEED_FIND_REMOTE_USER;
			}
		break;

		case USER_STATUS.NEED_WAIT_COMING_TO_CAMERA_ANIMATION_ENDING:
			if(this.VisualKeeper.getMovementStatus() === VIDEO_MESH_MOVEMENT.STATUS.STANDING &&
				this.AllUsers[1][0].VisualKeeper.getMovementStatus() === VIDEO_MESH_MOVEMENT.STATUS.STANDING &&
				this.VisualKeeper.getVideoMesh().position.equals(VIDEO_MESH_MOVEMENT.POSITIONS.LOCAL.RIGHT_AWAY) &&
				this.AllUsers[1][0].VisualKeeper.getVideoMesh().position.equals(VIDEO_MESH_MOVEMENT.POSITIONS.REMOTE.FRONT_OF_CAMERA)
			){
				this.UserStatus = USER_STATUS.ALL_FINE;
			}
		break;

		case USER_STATUS.ALL_FINE:
		break;

		case USER_STATUS.FINDING_REMOTE_USER:
		break;

		case USER_STATUS.NEED_WAIT_ANIMATION_ENDING_TO_DISCONNECT:
			if(!this.NeedWaitAnimationEnding())
			{
				this.resetMeForWaiting();
				this.AllUsers[1][0].resetMeForWaiting();
			}
		break;

		case USER_STATUS.CANDIDATE_IS_FOUND_AND_CONNECTION_IS_BEEN_SET:
			this.CommunicationOptions.Status = COMMUNICATION_OPTIONS.STATUS.COMMUNICATING;
			this.NetMessagesObject.setGetVKIDMessageData({my_vkid: this.getVKID()});
			this.getRightCandidateConnection().send(this.NetMessagesObject.GetVKIDMessage);
			this.makeCall();
			this.UserStatus = USER_STATUS.NEED_WILLIGNESS_OF_USERS;
		break;

		case USER_STATUS.FOUND_CANDIDATE_CAN_BE_SET_AS_REMOTE_USER:
			this.CommunicationOptions.Status = COMMUNICATION_OPTIONS.STATUS.COMMUNICATING;
			this.NetMessagesObject.setGetVKIDMessageData({my_vkid: this.getVKID()});
			this.getRightCandidateConnection().send(this.NetMessagesObject.GetVKIDMessage);
			this.makeCall();
			this.UserStatus = USER_STATUS.NEED_WILLIGNESS_OF_USERS;
		break;

		case USER_STATUS.RECIEVED_CANDIDATE_CAN_BE_SET_AS_REMOTE_USER:
			this.CommunicationOptions.Status = COMMUNICATION_OPTIONS.STATUS.COMMUNICATING;
			this.UserStatus = USER_STATUS.NEED_WILLIGNESS_OF_USERS;
		break;

		case USER_STATUS.HAVE_NO_USER_IN_CURRENT_USERS_IDS_ARRAY:

			this.TryingFindRemoteUsersCounter = 0;
			this.getAndSetAllUsersIDsAndStartFindCandidate();
		break;

		case USER_STATUS.NEED_FIND_REMOTE_USER:
			this.TryingFindRemoteUsersCounter = 0;
			this.getAndSetAllUsersIDsAndStartFindCandidate();
		break;

		case USER_STATUS.NEED_FIND_CANDIDATE_IN_CURRENT_USERS_IDS_ARRAY:
			if(	this.TryingFindRemoteUsersCounter >= CANDIDATES_IN_ONE_ARRAY_FIND_LIMITER)
			{
				this.UserStatus = USER_STATUS.HAVE_NO_USER_IN_CURRENT_USERS_IDS_ARRAY;
			}
			else
			{
				this.TryingFindRemoteUsersCounter++;
				this.findCandidateInCurrentUsersIDsArray();
			}
		break;

		case USER_STATUS.NEED_WILLIGNESS_OF_USERS:		
//			alert("Local user: " + this.TheWillignessOfUsers.LocalUser 
//				+ " Remote user: " + this.TheWillignessOfUsers.RemoteUser);
			if(this.TheWillignessOfUsers.LocalUser === THE_WILLIGNESS_OF_USERS.LOCAL_USER.NO)
			{
				if(this.isRemoteStreamSet())
				{
					if(this.isRemoteVKIDSet())
					{
						this.TheWillignessOfUsers.LocalUser = THE_WILLIGNESS_OF_USERS.LOCAL_USER.YES;
						this.getRightCandidateConnection().send(this.NetMessagesObject.WeCanStartChattingMessage);
					}
				}
			}

			console.log("NEED_WILLIGNESS_OF_USERS LocalUser:" + this.TheWillignessOfUsers.LocalUser + " " + this.TheWillignessOfUsers.RemoteUser);
			if(this.TheWillignessOfUsers.LocalUser === THE_WILLIGNESS_OF_USERS.LOCAL_USER.YES &&
			   this.TheWillignessOfUsers.RemoteUser === THE_WILLIGNESS_OF_USERS.REMOTE_USER.YES)
			{
				this.UserStatus = USER_STATUS.NEED_WAIT_COMING_TO_CAMERA_ANIMATION_ENDING;
				this.startChatting();

			}
		break;

		default:
		console.log("WTF");
		break;

	}



	//this.VisualKeeper.Life();
};

/*
Функция должна вызываться когда все уже готово к общению.
Здесь должна вызываться анимация опускания 
*/
_LocalUser.prototype.startChatting = function ()
{
//	alert("from start chatting");
	this.AllUsers[1][0].startChatting();
	this.hideVideo();
};


/*
Возвращает соединение с одним из кандидатов на установку. 
ОДНОВРЕМЕННО ДОЛЖЕН БЫТЬ УСТАНОВЛЕН ТОЛЬКО ОДИН ИЗ КАНДИДАТОВ
*/
_LocalUser.prototype.getRightCandidateConnection = function()
{
	if(this.FoundCandidate.Status === FOUND_CANDIDATE.STATUS.INSTALLED_AS_REMOTE_USER)
	{
		throw new Error("FoundCandidate уже установлен как удаленный пользователь!!!");
		return;
	}
	if(this.RecievedCandidate.Status === RECIEVED_CANDIDATE.STATUS.INSTALLED_AS_REMOTE_USER)
	{
		throw new Error("RecievedCandidate уже установлен как удаленный пользователь!!!");
		return;
	}

	if(this.FoundCandidate.Status !==  FOUND_CANDIDATE.STATUS.NOT_INSTALLED)
	{
		return this.FoundCandidate.Connection;
	}

	if(this.RecievedCandidate.Status !== RECIEVED_CANDIDATE.STATUS.NOT_INSTALLED)
	{
		return this.RecievedCandidate.Connection;
	}

	throw new Error("НИ ОДИН КАНДИДАТ на установку как удаленный пользователь НЕ НАЙДЕН!!!!");
	return;
};


/*
	Получает список находящихся в комнате пользователей,
	и создает с ними соединения.
*/
_LocalUser.prototype.getAndSetAllUsersIDsAndStartFindCandidate = function (json_params)
{

	this.UserStatus = USER_STATUS.FINDING_REMOTE_USER;
	var req_str = SERVER_REQUEST_ADDR  + "/" + REQUESTS.UTOS.FIND_COMPANION;
	$.ajax({
		type:"POST",
		url: req_str,
		async: true,
		data: {user_id: this.getPeerID()},
		success: this.setAllUsersIDsArrayAndStartFindCandidateBF,
		error: function (jqXHR, textStatus, errorThrown) {
			alert("ajax error: " + textStatus + " " + errorThrown);
		}
	});
};

_LocalUser.prototype.setAllUsersIDsArrayAndStartFindCandidate = function (json_params)
{

	this.setAllUsersIDsArray(json_params);
	this.findCandidateInCurrentUsersIDsArray();
};

_LocalUser.prototype.findCandidateInCurrentUsersIDsArray = function ()
{
	if(this.AllUsersIDsArray.length === 0)
	{
		//console.log("length === 0");
		this.UserStatus = USER_STATUS.NEED_FIND_CANDIDATE_IN_CURRENT_USERS_IDS_ARRAY;
		return;		
	}

	var index = Math.round(Math.random()*(this.AllUsersIDsArray.length-1));
	if(this.AllUsersIDsArray[index] !== this.getPeerID())
	{
//		alert("peer ids: " + this.AllUsersIDsArray[index] + " " + this.getPeerID());
//		alert("will connect to: " + this.AllUsersIDsArray[index]);
		this.FoundCandidate.Connection = this.Peer.connect(this.AllUsersIDsArray[index]);
		this.FoundCandidate.Status = FOUND_CANDIDATE.STATUS.APPEARED;
		this.setDataConnectionHandlers(this.FoundCandidate.Connection);
		this.UserStatus = USER_STATUS.FINDING_REMOTE_USER;
	} else
	{
		this.UserStatus = USER_STATUS.NEED_FIND_CANDIDATE_IN_CURRENT_USERS_IDS_ARRAY;
	}
};

/*
IN:
json_params: {
	response: array
}
*/
_LocalUser.prototype.setAllUsersIDsArray = function (json_params)
{
	if(typeof(json_params) === "string")
	{
		json_params = JSON.parse(json_params);
	}
	if(json_params.response === RETURN_NOTHING)
	{
		this.AllUsersIDsArray = [];
	} else
	{
		this.AllUsersIDsArray = json_params.response;
	}
};

_LocalUser.prototype.makeCall = function (peer)
{
	if(peer !== undefined)
		this.MediaConnection = this.Peer.call(peer, this.getStream());
	else
		this.MediaConnection = this.Peer.call(this.getRightCandidateConnection().peer, this.getStream());

	this.MediaConnection.on("stream", this.onStreamBF);
};

_LocalUser.prototype.controlVideo = function ()
{
	if(this.CommunicationOptions.VideoState === COMMUNICATION_OPTIONS.VIDEO_STATE.HIDE)
	{
		this.showVideo();
	}else
	{
		this.hideVideo();
	}
};
_LocalUser.prototype.hideVideo = function ()
{
	this.VisualKeeper.hideVideo();
};
_LocalUser.prototype.showVideo = function ()
{
	this.VisualKeeper.showVideo();
};

_LocalUser.prototype.removeShipFromScene = function ()
{
	this.VisualKeeper.removeMesh();
};

_LocalUser.prototype.resetMeForWaiting = function (json_params)
{
	this.CommunicationOptions = {
		Status: COMMUNICATION_OPTIONS.STATUS.WAITING,
		VideoState: COMMUNICATION_OPTIONS.VIDEO_STATE.HIDE,
		VKIDState: COMMUNICATION_OPTIONS.VKID_STATE.HIDE
	};

	this.showVideo();


	if(this.RecievedCandidate.Status !== RECIEVED_CANDIDATE.STATUS.NOT_INSTALLED)
	{
		this.RecievedCandidate.Connection.close();
//		alert("RECIEVED NOT CLOSED WAS");		
	}
	if(this.FoundCandidate.Status !== FOUND_CANDIDATE.STATUS.NOT_INSTALLED)
	{
		this.FoundCandidate.Connection.close();
//		alert("FOUND NOT CLOSED WAS");		
	}

	// Если пользователи готовы начать
	this.TheWillignessOfUsers = {
		LocalUser: THE_WILLIGNESS_OF_USERS.LOCAL_USER.NO,
		RemoteUser: THE_WILLIGNESS_OF_USERS.REMOTE_USER.NO,
		ISentStreamToRemoteUser: THE_WILLIGNESS_OF_USERS.LOCAL_USER.NO
	};

	// Определяет поступившего кандидата;
	this.RecievedCandidate = {
		Connection: null, // поступившее соединение
		SendingTime: null, // время,
		Status: RECIEVED_CANDIDATE.STATUS.NOT_INSTALLED
	};
	// Определяет поступившего кандидата;
	this.FoundCandidate = {
		Connection: null,
		Status: FOUND_CANDIDATE.STATUS.NOT_INSTALLED,
		SendingTime: null
	};

	this.UserStatus = USER_STATUS.NEED_FIND_REMOTE_USER_AFTER_HIDE_ANIMATION_WILL_STOP;
};

// Вызывается для установки видеотекстуры удаленного игрока.
_LocalUser.prototype.setVideoTexture = function(source)
{
	this.VisualKeeper.setVideoTextureByStream(source);

};

/*
//////////////////////////////////////////////////////////////////////////////////////
/////////////////////////_LocalUser: DATA CONNECTION HANDLERS//////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
*/
_LocalUser.prototype.onRecievedOpenDataConnection = function ()
{

};
_LocalUser.prototype.onRecievedDataConnectionData = function (json_params)
{
	switch(json_params.request)
	{
		case REQUESTS.UTOU.CAN_I_CONNECT_TO_YOU:
			this.UserStatus = USER_STATUS.RECIEVED_CANDIDATE_CAN_BE_SET_AS_REMOTE_USER;
			this.RecievedCandidate.Connection.send(this.NetMessagesObject.YesYouCanConnectToMeMessage);
//						alert("RECIEVED BY :" + this.Peer.id);
			this.RecievedCandidate.Status = RECIEVED_CANDIDATE.STATUS.HAVE_PERMISSION_TO_COMMUNICATING;

			if(this.FoundCandidate.Status === FOUND_CANDIDATE.STATUS.APPEAR)
			{
				this.FoundCandidate.Connection.close();
				this.FoundCandidate.Status = FOUND_CANDIDATE.STATUS.NOT_INSTALLED;
			}
		break;

		case REQUESTS.UTOU.GET_VKID:
			this.AllUsers[1][0].setVKID(json_params.data.my_vkid);
			this.NetMessagesObject.setSendVKIDMessageData({my_vkid: this.getVKID()});

			this.getRightCandidateConnection().send(this.NetMessagesObject.SendVKIDMessage);
		break;

		case REQUESTS.UTOU.SEND_VKID:
			this.AllUsers[1][0].setVKID(json_params.data.my_vkid);
		break;

		case REQUESTS.UTOU.SHOW_VIDEO:
			this.AllUsers[1][0].showVideo();
		break;

		case REQUESTS.UTOU.HIDE_VIDEO:
			this.AllUsers[1][0].hideVideo();
		break;

		case REQUESTS.UTOU.HIDE_VKID:
			this.AllUsers[1][0].hideVKID();
		break;

		case REQUESTS.UTOU.SHOW_VKID:
			this.AllUsers[1][0].showVKID();
		break;

		case REQUESTS.UTOU.COMMUNICATION_IS_OVER:
			this.onCommunicationIsOver();
		break;

		case REQUESTS.UTOU.WE_CAN_START_CHATTING:
			this.TheWillignessOfUsers.RemoteUser = THE_WILLIGNESS_OF_USERS.REMOTE_USER.YES;
		break;

	}	
};
_LocalUser.prototype.onRecievedDataConnectionClose = function()
{
	if(this.NeedWaitAnimationEnding())
	{
		this.UserStatus = USER_STATUS.NEED_WAIT_ANIMATION_ENDING_TO_DISCONNECT;
	} else
	{
		this.resetMeForWaiting();
		this.AllUsers[1][0].resetMeForWaiting();
	}
};

_LocalUser.prototype.onRecievedDataConnectionError = function(error)
{
	this.onRecievedDataConnectionClose();
};

_LocalUser.prototype.setDataConnectionHandlers = function (conn)
{
	if(conn !== undefined)
	{
		conn.on("open", this.onOpenDataConnectionBF);
		conn.on("data",  this.onDataRecievedBF);
		conn.on("close", this.onCloseConnectionBF);  
		conn.on("error", this.onDataConnectionErrorBF);
	} else {
		this.FoundCandidate.Connection.on("open", this.onOpenDataConnectionBF);
		this.FoundCandidate.Connection.on("data",  this.onDataRecievedBF);
		this.FoundCandidate.Connection.on("close", this.onCloseConnectionBF);  
		this.FoundCandidate.Connection.on("error", this.onDataConnectionErrorBF);
	}
};
/* Стандартный, при открытии соединения!
 */
_LocalUser.prototype.onOpenDataConnection = function()
{
	this.FoundCandidate.Connection.send(this.NetMessagesObject.CanIConnectToYouMessage);
	this.UserStatus = USER_STATUS.FINDING_REMOTE_USER;
};

/* завершаем соединение с игроком
 */
_LocalUser.prototype.disconnect = function()
{
	if(this.NeedWaitAnimationEnding())
	{
		this.UserStatus = USER_STATUS.NEED_WAIT_ANIMATION_ENDING_TO_DISCONNECT;
	} else
	{
		this.resetMeForWaiting();
		this.AllUsers[1][0].resetMeForWaiting();
	}
};
/*Если нам нужно ждать окончания анимации*/
_LocalUser.prototype.NeedWaitAnimationEnding = function ()
{
	if(this.VisualKeeper.getMovementStatus() === VIDEO_MESH_MOVEMENT.STATUS.STANDING &&
		this.AllUsers[1][0].VisualKeeper.getMovementStatus() === VIDEO_MESH_MOVEMENT.STATUS.STANDING &&
		this.VisualKeeper.getVideoMesh().position.equals(VIDEO_MESH_MOVEMENT.POSITIONS.LOCAL.RIGHT_AWAY) &&
		this.AllUsers[1][0].VisualKeeper.getVideoMesh().position.equals(VIDEO_MESH_MOVEMENT.POSITIONS.REMOTE.FRONT_OF_CAMERA)
	){
		return false;
	} else
		return true;

};

_LocalUser.prototype.onDataConnectionError = function(error)
{
	this.disconnect();
};

/*Вызывается, когда удаленный игрок совершает действия типа 
 *перемещения/стрельбы и присылает данные об этом
 * MoveMessage | ShootMessage (класс _QBorgGameNetMessages)
 */  
_LocalUser.prototype.onDataRecieved = function (json_params)
{
	// преобразуем полученные данные, если они не преобразованы в объект
	if(typeof(json_params) === "string")
	{
		json_params = JSON.parse(json_params);
	}

	switch(json_params.request)
	{
		case REQUESTS.UTOU.GET_VKID:
			this.AllUsers[1][0].setVKID(json_params.data.my_vkid);
			this.NetMessagesObject.setSendVKIDMessageData({my_vkid: this.getVKID()});
//						alert(9);
			this.getRightCandidateConnection().send(this.NetMessagesObject.SendVKIDMessage);
		break;

		case REQUESTS.UTOU.SEND_VKID:
			this.AllUsers[1][0].setVKID(json_params.data.my_vkid);
		break;

		case REQUESTS.UTOU.SHOW_VIDEO:
			this.AllUsers[1][0].showVideo();
		break;

		case REQUESTS.UTOU.HIDE_VIDEO:
			this.AllUsers[1][0].hideVideo();
		break;

		case REQUESTS.UTOU.HIDE_VKID:
			this.AllUsers[1][0].hideVKID();
		break;

		case REQUESTS.UTOU.SHOW_VKID:
			this.AllUsers[1][0].showVKID();
		break;

		case REQUESTS.UTOU.COMMUNICATION_IS_OVER:
			this.onCommunicationIsOver();
		break;

/*		case REQUESTS.UTOU.CAN_I_CONNECT_TO_YOU:
			if(this.CommunicationOptions.Status === COMMUNICATION_OPTIONS.STATUS.HAVE_RECIEVED_CONNECTION_CANDIDATE) 
			{
				this.RecievedCandidate.Connection.send(this.NetMessagesObject.YesYouCanConnectToMeMessage);
				this.FoundCandidate.Connection = this.RecievedCandidate.Connection;
				this.UserStatus = USER_STATUS.CANDIDATE_IS_FOUND_AND_CONNECTION_IS_BEEN_SET;
				this.CommunicationOptions.Status = COMMUNICATION_OPTIONS.STATUS.COMMUNICATING;
				return;
			}

			this.RecievedCandidate.Connection.close();
		break;
*/
		case REQUESTS.UTOU.YES_YOU_CAN_CONNECT_TO_ME:
			this.FoundCandidate.Status = FOUND_CANDIDATE.STATUS.HAVE_PERMISSION_TO_COMMUNICATING;
			this.UserStatus = USER_STATUS.FOUND_CANDIDATE_CAN_BE_SET_AS_REMOTE_USER;
		break;

		case REQUESTS.UTOU.NO_YOU_CANT_CONNECT_TO_ME:
			this.TryingFindRemoteUsersCounter++;
			if(this.TryingFindRemoteUsersCounter >= CANDIDATES_IN_ONE_ARRAY_FIND_LIMITER)
			{
				this.UserStatus = USER_STATUS.HAVE_NO_USER_IN_CURRENT_USERS_IDS_ARRAY;
			} else
			{
				this.UserStatus = USER_STATUS.NEED_FIND_CANDIDATE_IN_CURRENT_USERS_IDS_ARRAY;
			}
		break;

		case REQUESTS.UTOU.WE_CAN_START_CHATTING:
			this.TheWillignessOfUsers.RemoteUser = THE_WILLIGNESS_OF_USERS.REMOTE_USER.YES;
		break;


	}	

};
/*
//////////////////////////////////////////////////////////////////////////////////////
/////////////////////////_RemoteUser: MEDIA CONNECTION HANDLERS//////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
*/
/*	This is callback for Peer.js call function
	Вызывается, когда происходит видеовызов от удаленного игрока, и таким образом
	мы получаем поток удаленного пользователя.
 */
_LocalUser.prototype.onRecieveMediaConnection = function (call)
{
	this.MediaConnection = call;

	this.MediaConnection.on("stream", this.onStreamBF);
	this.MediaConnection.on("close", this.onMediaConnectionCloseBF);
	this.MediaConnection.on("error", this.onMediaConnectionErrorBF);

	if(this.TheWillignessOfUsers.ISentStreamToRemoteUser === THE_WILLIGNESS_OF_USERS.LOCAL_USER.NO)
	{

		this.MediaConnection.answer(this.getStream());
		this.TheWillignessOfUsers.ISentStreamToRemoteUser = THE_WILLIGNESS_OF_USERS.LOCAL_USER.YES;
	}
};

_LocalUser.prototype.makeMediaConnectionAnswer = function (stream)
{
	this.MediaConnection.answer(stream);
};
_LocalUser.prototype.onStream = function (stream)
{	
	this.AllUsers[1][0].setStream(stream);
};

_LocalUser.prototype.onMediaConnectionClose = function ()
{
	this.disconnect();
};
_LocalUser.prototype.onMediaConnectionError = function ()
{
	this.disconnect();
};



/* Класс описывает игрока.
 * Класс должен ОБЯЗАТЕЛЬНО принять необходимые параметры в формате JSON:
 * {
 *   net_messages_object: new _NetMessages(),		
 *   connection: connection, - соединение, из которого будут приходить данные, и в которое будут данные отправляться
 *   scene: THREE.Scene(); - объект сцены, в которую нужно будет добавить свой корабль,
 *   random: true | false
 * }
 * Класс удаленного игрока обрабатывает только входящие сообщения, но НИЧЕГО НЕ ОТСЫЛАЕТ!
 * 
 */

var _RemoteUser = function (json_params)
{
/*
	this.onOpenDataConnectionBF = this.onOpenDataConnection.bind(this);
	this.onDataRecievedBF = this.onDataRecieved.bind(this); 
	this.onCloseConnectionBF = this.disconnect.bind(this); 
	this.onDataConnectionErrorBF = this.onDataConnectionError.bind(this); 
	this.makeMediaConnectionAnswerBF = this.makeMediaConnectionAnswer.bind(this);
	this.onStreamBF = this.onStream.bind(this);
	this.setAllUsersIDsArrayBF = this.setAllUsersIDsArray.bind(this);
	this.setAllUsersIDsArrayAndStartFindCandidateBF = this.setAllUsersIDsArrayAndStartFindCandidate.bind(this);
*/
	this.onStreamEndedBF = this.onStreamEnded.bind(this);

	this.Scene = null;		
	this.CSSScene = null;		
	this.VisualKeeper = null;
	this.MediaConnection = null; // Если установлено медиа-соединение
	this.UserType = USER_TYPES.REMOTE;		
	this.Video = null;
	this.VideoTexture = null;
	this.VKID = null; // Это то, что нам нужно будет установить
	this.Stream = null;
	this.initParameters(json_params);
	
	this.VisualKeeper = new _VisualKeeper({
		vkid: this.VKID, 
		scene: this.Scene, 
		cssscene: this.CSSScene, 
		user_type: this.UserType
	});
  
};
/*
////////////////////////////////////////////////////////////////////////
///////////////////GETTERS AND SETTERS//////////////////////////////////
////////////////////////////////////////////////////////////////////////
*/
_RemoteUser.prototype.setVKID = function (vk_id)
{
	this.VKID = vk_id;
//	alert(vk_id);
};
_RemoteUser.prototype.getVKID = function ()
{
	return this.VKID;
};
_RemoteUser.prototype.getPeerID = function ()
{
	return this.FoundCandidate.Connection.peer;
};
_RemoteUser.prototype.getMesh = function ()
{
	return this.VisualKeeper.getMesh();
};

_RemoteUser.prototype.getShip = function ()
{
	return this.VisualKeeper;
};

_RemoteUser.prototype.getStream = function ()
{
	return this.Stream;
};
/*
//////////////////////////////////////////////////////////////////////////
//////////////////////OTHER FUNCTIONS/////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
*/

/*
Устанавливает пользователя в режим ожидания!

*/
_RemoteUser.prototype.resetMeForWaiting = function (json_params)
{
	this.hideVideo();
};

_RemoteUser.prototype.initParameters = function (json_params)
{
	if(json_params !== undefined)
	{
		
		if(json_params.scene  !== undefined)
			this.Scene = json_params.scene;
		else
			throw new Error("Where is Scene?");		
		
		if(json_params.cssscene  !== undefined)
			this.CSSScene = json_params.cssscene;
		else
			throw new Error("Where is Scene?");		
		
		if(json_params.net_messages_object !== undefined)
			this.NetMessagesObject = json_params.net_messages_object;
		else
			throw new Error("Where is NetMessagesObject?");		
		
		if(json_params.all_users !== undefined)
			this.AllUsers = json_params.all_users;
		else
			throw new Error("Where is AllUsers?");

		if(json_params.peer !== undefined)
			this.Peer = json_params.peer;
		else
			throw new Error("Where is Peer?");

		if(json_params.room_id !== undefined)
			this.RoomID = json_params.room_id;
		else
			throw new Error("Where is RoomID?");

		if(json_params.vkid !== undefined)
			this.VKID = json_params.vkid;

	} else
		throw new Error(this.constructor.name + " have no json_params!");

};

/*
Основная фукнция удаленного игрока, проверяет состояния и производит необходимые действия
в зависимости от состояния.
Состояния обрабатываются в одном свитче.
*/
_RemoteUser.prototype.update = function ()
{

	this.VisualKeeper.Life();
};

/* функция добавляет полученное соединение в массив соединений Connections
 * и сразу отправляет запрос на получение nickname нового игрока
 */
_RemoteUser.prototype.makeCall = function ()
{
	this.Peer.call(this.getPeerID(), this.AllUsers[0].getStream());
};

/*
Инициализирует визуальные объекты.
Производит начальную настройку.
*/
_RemoteUser.prototype.initVisualObjects = function ()
{
	this.Visuals = {};
	this.Visuals.VKIDBanner = {
		ObjHTML: document.createElement("div")
	};
	this.Visuals.VKIDBanner.ObjHTML.id = "VKIDBanner";
	this.Visuals.VKIDBanner.Obj3DCSS = new THREE.CSS3DObject(this.Visuals.VKIDBanner.ObjHTML);


	this.Visuals.VideoBanner = {
		ObjHTML: document.createElement("div")
	};
	this.Visuals.VideoBanner.ObjHTML.id = "VideoBanner";
	this.Visuals.VideoBanner.Obj3DCSS = new THREE.CSS3DObject(this.VideoBanner.ObjHTML);

};

_RemoteUser.prototype.controlVideo = function ()
{
	if(this.CommunicationOptions.VideoState === COMMUNICATION_OPTIONS.VIDEO_STATE.HIDE)
	{
		this.showVideo();
	}else
	{
		this.hideVideo();
	}
};
_RemoteUser.prototype.hideVideo = function ()
{
	this.VisualKeeper.hideVideo();
};
_RemoteUser.prototype.showVideo = function ()
{
	this.VisualKeeper.showVideo();
};

// Вызывается для установки видеотекстуры удаленного игрока.
_RemoteUser.prototype.setVideoTexture = function(source)
{
/*
	this.Video = document.createElement("video");
	this.Video.autoplay = 1;
	this.Video.width = CAMERA_VIDEO_SIZES.SMALL;
	this.Video.height = CAMERA_VIDEO_SIZES.SMALL;
	this.Video.style.visibility = "hidden";
	this.Video.style.float = "left";
	this.Video.src = window.URL.createObjectURL(source);

	this.VideoTexture = new THREE.VideoTexture( this.Video);
	this.VideoTexture.minFilter = THREE.NearestFilter;
	this.VideoTexture.magFilter = THREE.NearestFilter;
	this.VideoTexture.format = THREE.RGBFormat;
	this.VisualKeeper.setTextureAndUpdateMesh(this.VideoTexture);
*/
	this.VisualKeeper.setVideoTextureByStream(source);

};

/*
//////////////////////////////////////////////////////////////////////////////////////
/////////////////////////_RemoteUser: MEDIA CONNECTION HANDLERS//////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
/*	This function catches stream from remote user 
 */
_RemoteUser.prototype.setStream = function (stream)
{
	this.Stream = stream;
	this.Stream.addEventListener("ended", this.onStreamEndedBF);
	this.VisualKeeper.setVideoTextureByStream(stream);
	this.VisualKeeper.Video.play();
};

_RemoteUser.prototype.startChatting = function ()
{
	this.showVideo();
};

_RemoteUser.prototype.onStreamEnded = function ()
{
	this.VisualKeeper.Video.pause();
	this.AllUsers[0].resetMeForWaiting();
	this.resetMeForWaiting();
};

_RemoteUser.prototype.onMediaConnectionClose = function ()
{
};
_RemoteUser.prototype.onMediaConnectionError = function ()
{
};
