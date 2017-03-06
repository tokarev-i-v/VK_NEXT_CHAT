/* Объект содержит сообщения, которые должны пересылаться между игроками
 * IN:
 * json_params = {
 * 	nickname,
 * 	id,
 * }
 * 
 * UtoU - от юзера к юзеру
 * UtoS - от юзера к серверу
 */
var _NetMessages = function (json_params)
{
	this.MoveMessage = {};
	this.MoveMessage.request = REQUESTS.UTOU.MOVE;
	this.MoveMessage.data = 
	{
		position: {x:0, y:0, z:0}, // Mesh.position.clone();
		rotation: {x:0, y:0, z:0}, // Mesh.rotation.clone();
	};
	
	this.ShootMessage = {};
	this.ShootMessage.request = REQUESTS.UTOU.SHOOT;
	this.ShootMessage.data = 
	{
		distance: 0,
		speed: 0,
		direction: {x:0,y:0,z:0},
		start_position: {x:0,y:0,z:0},
		gun_type: "",
		bullet_type: "",
		damage: 0 				
	};
	/*Это сообщение должно отправляться для того, чтобы получить nickname'ы
	 * уже существующих игроков!
	 */ 
	this.GetNickNameMessage = {};
	this.GetNickNameMessage.request = REQUESTS.UTOU.GET_NICKNAME;
	this.GetNickNameMessage.data = {
		requested_user_nickname: json_params.nickname,
		requested_user_id: json_params.id
	};
	/*Это сообщение должно отправляться только в ответ на запрос "get_nickname";
	*/ 
	this.SendNickNameMessage = {};
	this.SendNickNameMessage.request = REQUESTS.UTOU.SEND_NICKNAME;
	this.SendNickNameMessage.data = 
	{
		nickname: json_params.nickname,
		id: json_params.id
	};

	this.GetVKIDMessage = {
		request: REQUESTS.UTOU.GET_VKID,
		data: {
			my_vkid: "default_id",
		}
	};

	this.SendVKIDMessage = {
		request: REQUESTS.UTOU.SEND_VKID,
		data: {
			my_vkid: "default_id"
		}
	};

	this.GetCommnunicationStatusMessage = {
		request: REQUESTS.UTOU.GET_YOUR_COMMUNICATION_STATUS,
		data: {
			my_communication_status: COMMUNICATION_OPTIONS.STATUS.WAITING
		}
	};

	this.SendCommnunicationStatusMessage = {
		request: REQUESTS.UTOU.SEND_YOUR_COMMUNICATION_STATUS,
		data: {
			my_communication_status: COMMUNICATION_OPTIONS.STATUS.WAITING
		}
	};
    /* Запрос на возможность присоединиться к пользователю!
     sending_time - время, когда сообщение было отослано.
     Предполагается использование для того, если 2 пользователя
     пытаются одновременно законнектить друг друга, и получается петля.
     Чтобы разорвать одно из соединений, нужно оставить соединение того юзера,
     который сконнектился первым!

    */
	this.CanIConnectToYouMessage = {
		request: REQUESTS.UTOU.CAN_I_CONNECT_TO_YOU,
		data: {
			sending_time: null 
		}
	};

	this.YesYouCanConnectToMeMessage = {
		request: REQUESTS.UTOU.YES_YOU_CAN_CONNECT_TO_ME,
		data: {}
	};

	this.ShowVKIDMessage = {
		request: REQUESTS.UTOU.SHOW_VKID,
		data: {}
	};
	this.HideVKIDMessage = {
		request: REQUESTS.UTOU.HIDE_VKID,
		data: {}
	};

	this.ShowVideoMessage = {
		request: REQUESTS.UTOU.SHOW_VIDEO,
		data: {}
	};
	this.HideVKIDMessage = {
		request: REQUESTS.UTOU.HIDE_VIDEO,
		data: {}
	};
	this.WeCanStartChattingMessage = {
		request: REQUESTS.UTOU.WE_CAN_START_CHATTING,
		date: {}
	}

};

_NetMessages.prototype.setNickname = function (json_params)
{
	this.GetNickNameMessage.data.requested_user_nickname = json_params.nickname;
	this.SendNickNameMessage.data.nickname = json_params.nickname;
};

_NetMessages.prototype.setID = function (json_params)
{
	this.GetNickNameMessage.data.requested_user_id = json_params.id;
	this.SendNickNameMessage.data.id = json_params.id;
};

/* Устанавливает новые о позиции корабля в пространстве, которые затем будут отправлены остальным пользователям;
 */

_NetMessages.prototype.setPositionDataFromMesh = function (mesh_object)
{
	this.MoveMessage.data.position = mesh_object.position.clone();
	this.MoveMessage.data.rotation = mesh_object.rotation.clone();
};

/*
IN:
json_params{
	my_vk_id = "string"
}
*/
_NetMessages.prototype.setSendVKIDMessageData = function (json_params)
{
	if(json_params !== undefined)
	{
		this.SendVKIDMessage.data.my_vkid = json_params.my_vkid;
	}
};
_NetMessages.prototype.setGetVKIDMessageData = function (json_params)
{
	if(json_params !== undefined)
	{
		this.GetVKIDMessage.data.my_vkid = json_params.my_vkid;
	}
};


/*
IN: my_vk_id = "string"
*/
_NetMessages.prototype.setVKID = function (vkid)
{
	this.GetVKIDMessage.data.my_vkid = vkid;
	this.SendVKIDMessage.data.my_vkid = vkid;
};

_NetMessages.prototype.setGetCommunicationStatusMessageData = function (json_params)
{
	this.GetCommnunicationStatusMessage.data.my_communication_status = json_params.my_communication_status;
};


/*
IN: 
json_params: {
	my_communication_status: status
};
*/
_NetMessages.prototype.setGetCommunicationStatusMessageData = function (json_params)
{
	this.GetCommnunicationStatusMessage.data.my_communication_status = json_params.my_communication_status;
};
_NetMessages.prototype.setSendCommunicationStatusMessageData = function (json_params)
{
	this.SendCommnunicationStatusMessage.data.my_communication_status = json_params.my_communication_status;
};

_NetMessages.prototype.setCanIConnectToYouMessageData = function (json_params)
{
	this.CanIConnectToYouMessage.data.sending_time = json_params.sending_time;
};