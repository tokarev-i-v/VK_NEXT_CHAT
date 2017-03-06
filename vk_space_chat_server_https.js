var express = require("express");
var fs = require("fs");
var https = require("https");
var ExpressPeerServer = require("peer").ExpressPeerServer;
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({extended: false});
var jsonParser = bodyParser.json();
var const_and_funcs = require("./vk_space_chat_constants_and_general_functions.js");

var credentials = {
	key: fs.readFileSync("/etc/apache2/ssl/www_polyzer_org/www.polyzer.org_private.key"),
	cert: fs.readFileSync("/etc/apache2/ssl/www_polyzer_org/www_polyzer_org.crt")	
};

var RETURN_NOTHING = "0";
var ACCESS_CONTROL_ALLOW_ORIGIN = "https://www.polyzer.org";
var ACCESS_CONTROL_ALLOW_HEADERS = "Origin, X-Requested-With, Content-Type, Accept";


var app = express();
var httpsServer = https.createServer(credentials, app).listen(const_and_funcs.PEER_PORT_ADDR);
//var server = app.listen(const_and_funcs.PEER_PORT_ADDR);
//app.listen(const_and_funcs.PEER_PORT_ADDR);

var options = {
	debug: true,
};

var peerServer = ExpressPeerServer(httpsServer, options);
//var peerServer = ExpressPeerServer(server, options);
app.use(const_and_funcs.PEER_PATH_ADDR, peerServer);
app.use(jsonParser);
app.use(urlencodedParser);

/*
 * Класс описывает комнату, в которой будут находиться до max значения человек
 *
 * PlayersIDSArray - содержит список ID's всех игроков;
 * LevelType - описывает тип комнаты;
 * RoomID - идентификатор комнаты;
 * MaxPlayersCount - максимальное число игроков для данной комнаты;
 */
var _Room = function (id1, id2)
{
	if(id1 !== undefined && id2 !== undefined)	
		this.UsersIDSArray = [id1, id2];
	 else
		this.UsersIDSArray = [];

	this.MaxPlayersCount = 2;
//	this.RoomID = const_and_funcs.generateRandomString(10);
};

/*В первый список попадает один после разъединения, а во второй - другой*/
var UndecidedArrays = [[], []]; 
/*Массив содержит массив комнат;
 */
var Rooms = [];

/* SINGLEROOM_FUNCTIONS DEFINITIONS
 * ////////////////////////////////////////////////////////////////////
 */
function SingleRoom_onDisconnect(id)
{
	for(var i=0; i< UndecidedArrays[0].length; i++)
	{
		if(UndecidedArrays[0][i] === id)
		{
			UndecidedArrays[0].splice(i, 1);
			console.log(id + " was removed from UndecidedArrays[0]");
			return;
		}
	}
	for(var i=0; i< UndecidedArrays[1].length; i++)
	{
		if(UndecidedArrays[1][i] === id)
		{
			UndecidedArrays[1].splice(i, 1);
			console.log(id + " was removed from UndecidedArrays[1]");
			return;
		}
	}

	var index = Math.round(Math.random());

	for(var i=0; i<Rooms.length; i++)
	{
		if(Rooms[i].UsersIDSArray[0] === id)
		{
			UndecidedArrays[1-index].push(Rooms[i].UsersIDSArray[1]);
			console.log(id + " was removed from Room and " + Rooms[i].UsersIDSArray[1] + "was add to UndecidedArrays");
			Rooms.splice(i, 1);
			return;
		} else if(Rooms[i].UsersIDSArray[1] === id)
		{
			UndecidedArrays[1-index].push(Rooms[i].UsersIDSArray[0]);
			console.log(id + " was removed from Room and " + Rooms[i].UsersIDSArray[0] + "was add to UndecidedArrays");
			Rooms.splice(i, 1);
			return;
		}			
	}

	console.log(id + " wasn't in any array");

}

function createRoomAndAddToRooms (id1, id2)
{
	Rooms.push(new _Room(id1, id2));
}

/*при коннектинге - добавляется в рандомную комнату*/
function SingleRoom_onConnect(id)
{
/*
	if(UndecidedArrays[0].length > 0)
	{
		var anyone = UndecidedArrays[0].pop();
		createRoomAndAddToRooms(id, anyone);
		console.log(id + " " + anyone);
		return;

	}else if(UndecidedArrays[1].length > 0)
	{
		var anyone = UndecidedArrays[1].pop();
		createRoomAndAddToRooms(anyone, id);
		console.log(anyone + " " + id);
		return;
	}

	var i = Math.round(Math.random());
	UndecidedArrays[i].push(id);
	console.log("id:" + id + " was add to UndecidedArrays[" + i + "]");	
*/	
}

function SingleRoom_onGetRoomsList(req, res)
{
	res.header("Access-Control-Allow-Origin", ACCESS_CONTROL_ALLOW_ORIGIN);
	res.header("Access-Control-Allow-Headers", ACCESS_CONTROL_ALLOW_HEADERS);  
  
	res.send(JSON.stringify({response: Rooms}));
}

function SingleRoom_onComeIntoRoom(req, res)
{
	res.header("Access-Control-Allow-Origin", ACCESS_CONTROL_ALLOW_ORIGIN);
	res.header("Access-Control-Allow-Headers", ACCESS_CONTROL_ALLOW_HEADERS);  

	res.send();
	if(UndecidedArrays[0].length > 0)
	{
		var anyone = UndecidedArrays[0].pop();
		createRoomAndAddToRooms(req.body.user_id, anyone);
		console.log(req.body.user_id + " " + anyone);
		return;

	}else if(UndecidedArrays[1].length > 0)
	{
		var anyone = UndecidedArrays[1].pop();
		createRoomAndAddToRooms(anyone, req.body.user_id);
		console.log(anyone + " " + req.body.user_id);
		return;
	}

	var i = Math.round(Math.random());
	UndecidedArrays[i].push(req.body.user_id);
	console.log("id:" + req.body.user_id + " was add to UndecidedArrays[" + i + "]");	

}

/*Это запрос на поиск собеседника*/
function SingleRoom_findCompanion(req, res)
{
	res.header("Access-Control-Allow-Origin", ACCESS_CONTROL_ALLOW_ORIGIN);
	res.header("Access-Control-Allow-Headers", ACCESS_CONTROL_ALLOW_HEADERS);  

	console.log(req.body.user_id);
	for(var i=0; i< UndecidedArrays[0].length; i++)
	{
		if(UndecidedArrays[0][i] === req.body.user_id)
		{
			res.send({response: RETURN_NOTHING});
			return;
		}
	}

	for(var i=0; i< UndecidedArrays[1].length; i++)
	{
		if(UndecidedArrays[1][i] === req.body.user_id)
		{
			res.send({response: RETURN_NOTHING});
			return;
		}
	}	

	for(var i=0; i<Rooms.length; i++)
  	{
  		if(Rooms[i].UsersIDSArray[0] === req.body.user_id)
  		{
  			res.send({response: [Rooms[i].UsersIDSArray[1]]});
			return;  			
  		} else if(Rooms[i].UsersIDSArray[1] === req.body.user_id)
  		{
  			res.send({response: RETURN_NOTHING});
  			return;
  		}
	}	
	throw new Error("problem in SingleRoom_onGetUsersIDsInMyRoom: have no room with requested id!!!");

}

function removeMeFromRoomAndAddToUndecidedArrayIfItNeedByID (id)
{
	for(var i=0; i< UndecidedArrays[0].length; i++)
	{
		if(UndecidedArrays[0][i] === id)
		{
			return;
		}
	}
	for(var i=0; i< UndecidedArrays[1].length; i++)
	{
		if(UndecidedArrays[1][i] === id)
		{
			return;
		}
	}

	var index = Math.round(Math.random());

	for(var i=0; i<Rooms.length; i++)
	{
		if(Rooms[i].UsersIDSArray[0] === id)
		{
			UndecidedArrays[index].push(id);
			UndecidedArrays[1-index].push(Rooms[i].UsersIDSArray[1]);
			Rooms.splice(i, 1);
			return;
		} else if(Rooms[i].UsersIDSArray[1] === id)
		{
			UndecidedArrays[index].push(id);
			UndecidedArrays[1-index].push(Rooms[i].UsersIDSArray[0]);
			Rooms.splice(i, 1);
			return;
		}			
	}

	throw new Error("User isn't in arrays");

}

/*
Происходит, когда пользователь решил найти себе другого собеседника
IN:
{
	user_id: Peer.id
}

При отсоединении хотя бы одного из пользователей, оба выкладываются в UndecidedArrays[0|1];



*/
function SingleRoom_onEndCommunicating(req, res)
{
	res.header("Access-Control-Allow-Origin", ACCESS_CONTROL_ALLOW_ORIGIN);
	res.header("Access-Control-Allow-Headers", ACCESS_CONTROL_ALLOW_HEADERS);  
  
	removeMeFromRoomAndAddToUndecidedArrayIfItNeedByID(req.body.user_id);
}


/* MULTIROOM_FUNCTIONS
 * ////////////////////////////////////////////////////////////
 */
function MultiRoom_onDisconnect(id)
{
	for(var i=0; i<UndecidedIDs.length;  i++)
	{
		if(UndecidedIDs[i] === id)
		{
			UndecidedIDs.splice(i, 1);
			console.log("was spliced from UndecidedIDs: " + id);
			return;
		}
	}
	
	for(var i=0; i<Rooms.length; i++)
	{
		for(var j=0; j<Rooms[i].UsersIDSArray.length; j++)
		{
			/*Если нашли совпадение id'шников*/
			if(Rooms[i].UsersIDSArray[j] === id)
			{
				Rooms[i].UsersIDSArray.splice(j, 1);
				return;
			}
			
		}
	}
}

function MultiRoom_onConnect(id)
{
	UndecidedIDs.push(id);
	console.log("was pushed: " + id);
}

/* OUT: 
 * response: {
			room_id,
			users_count, 
			room_name,
 * 
 * }
 */
function MultiRoom_onGetRoomsList(req, res)
{
	res.header("Access-Control-Allow-Origin", ACCESS_CONTROL_ALLOW_ORIGIN);
	res.header("Access-Control-Allow-Headers", ACCESS_CONTROL_ALLOW_HEADERS);  
  
	var answer = [];
	for(var i=0; i<Rooms.length; i++)
	{
		answer.push({
			room_id: Rooms[i].RoomID, 
			room_name: Rooms[i].RoomName
		});
	}
	res.send(JSON.stringify({"rooms": answer}));
}

function MultiRoom_onComeIntoRoom(req, res)
{
	res.header("Access-Control-Allow-Origin", ACCESS_CONTROL_ALLOW_ORIGIN);
	res.header("Access-Control-Allow-Headers", ACCESS_CONTROL_ALLOW_HEADERS);  

	for(var i=0; i<Rooms.length; i++)
  	{
		if(Rooms[i].RoomID === req.body.room_id)
		{
			res.send(JSON.stringify({response: Rooms[i].UsersIDSArray})); 
			Rooms[i].UsersIDSArray.push(req.body.user_id);			
			for (var j=0; j < UndecidedIDs.length; j++)
			{
				if(UndecidedIDs[j] === req.body.user_id)
				{
					UndecidedIDs.splice(j, 1);
					return;
				}
			}
			throw new Error("problem in MultiRoom_onComeIntoRoom: have no user in UndecidedIDs!!!");
		}
	}	
	throw new Error("problem in MultiRoom_onComeIntoRoom: have no room with requested id!!!");
}

/*Удаляет пользователя из комнаты;
 *Добавляет его в список неопределившихся пользователей UndecidedIDs;
 *Проверяет комнату на пустоту;
 */
function MultiRoom_onLeaveRoom(req, res)
{
	res.header("Access-Control-Allow-Origin", ACCESS_CONTROL_ALLOW_ORIGIN);
	res.header("Access-Control-Allow-Headers", ACCESS_CONTROL_ALLOW_HEADERS);  
  //send();

	for(var i=0; i<Rooms.length; i++)
	{
		if(Rooms[i].RoomID === req.body.room_id)
		{
			for(var j=0; j<Rooms[i].UsersIDSArray.length; j++)
			{
				/*Если нашли совпадение id'шников*/
				if(Rooms[i].UsersIDSArray[j] === req.body.user_id)
				{
					Rooms[i].UsersIDSArray.splice(j, 1);
					if((Rooms[i].UsersIDSArray.length === 0) && (Rooms[i].UsersIDSArray.RoomID !== DefaultRoom.RoomID))
					{
						Rooms.splice(i, 1);
					}
				}	
			}
		}
	}
}

function MultiRoom_onCreateRoom(req, res)
{
	res.header("Access-Control-Allow-Origin", ACCESS_CONTROL_ALLOW_ORIGIN);
	res.header("Access-Control-Allow-Headers", ACCESS_CONTROL_ALLOW_HEADERS);  
  //res.contentType('json');
	res.send(JSON.stringify({response: UndecidedIDs}));
}

var ServiceFunctions = {};

if(const_and_funcs.GAME_ROOM_MODE === const_and_funcs.ROOM_MODE.SINGLE)
{
	ServiceFunctions.onConnect = SingleRoom_onConnect;
	ServiceFunctions.onDisconnect = SingleRoom_onDisconnect;
	ServiceFunctions.onEndCommunicating = SingleRoom_onEndCommunicating;
	ServiceFunctions.onFindCompanion = SingleRoom_findCompanion;
	ServiceFunctions.onComeIntoRoom = SingleRoom_onComeIntoRoom;
} else
{
	ServiceFunctions.onConnect = MultiRoom_onConnect;
	ServiceFunctions.onDisconnect = MultiRoom_onDisconnect;
	ServiceFunctions.onGetRoomsList = MultiRoom_onGetRoomsList;
	ServiceFunctions.onComeIntoRoom = MultiRoom_onComeIntoRoom;
	ServiceFunctions.onLeaveRoom = MultiRoom_onLeaveRoom;
	ServiceFunctions.onCreateRoom = MultiRoom_onCreateRoom;
	ServiceFunctions.onGetUsersIDsInMyRoom = MultiRoom_onGetUsersIDsInMyRoom;
}
/*Если пользователь решил выйти из в основное меню*/
app.post("/" + const_and_funcs.REQUESTS.UTOS.FIND_COMPANION, ServiceFunctions.onFindCompanion);
/*Запрос на получение списка всех комнат*/
app.post("/" + const_and_funcs.REQUESTS.UTOS.END_COMMUNICATING, ServiceFunctions.onEndCommunicating);

app.post("/" + const_and_funcs.REQUESTS.UTOS.COME_INTO_ROOM, ServiceFunctions.onComeIntoRoom);
/*При создании соединения, игрок автоматически добавляеся в список
 *неопределившихся игроков;
 **/
peerServer.on("connection", ServiceFunctions.onConnect);
/*При ризрыве соединения, выходит, что пользователь полностью покинул игру;
 *Должен быть автоматически удален из всех структур, в которых он содержится;
 **/
peerServer.on("disconnect", ServiceFunctions.onDisconnect);
