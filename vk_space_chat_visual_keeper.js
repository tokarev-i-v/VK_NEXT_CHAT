/*
 * Класс описывает объект, на котором будет отображаться запись с web-камеры.
 * Летающая плоскость, на которой будет отображаться картинка с web-камеры;
 IN:
 json_params = {
	scene: new THREE.Scene(),
	user_type: {_Local,_Remote}User.UserType
 };
 * */

var _VisualKeeper = function (json_params)
{	
	this.comeAwayToLeftBF = this.comeAwayToLeft.bind(this);
	this.comeToCenterFromLeftBF = this.comeToCenterFromLeft.bind(this);
	this.comeToCameraBF = this.comeToCamera.bind(this);
	this.comeAwayToRightBF = this.comeAwayToRight.bind(this);
	this.comeToLocalUserVideoMeshPositionFromRightBF = this.comeToLocalUserVideoMeshPositionFromRight.bind(this);


	this.UserType = null; // null, USER_TYPES.LOCAL, USER_TYPE.REMOTE
	this.Status = "live"; // ("live", "dead")
	this.Scene = null;
	this.CSSScene = null;
	this.Camera = null;	
	this.VKID = null;

	this.Video = document.createElement("video");
	this.Video.autoplay = 1;
	this.Video.style.visibility = "hidden";
	this.Video.style.float = "left";
	this.Video.width = CAMERA_VIDEO_SIZES.SMALL;
	this.Video.height = CAMERA_VIDEO_SIZES.SMALL;


	this.VideoMesh = {};
	this.VideoMesh.Geometry = new THREE.PlaneGeometry(128, 128);
	this.VideoMesh.Material = null;
	this.VideoMesh.Mesh = null;


	this.MovementStatus = VIDEO_MESH_MOVEMENT.STATUS.STANDING;

	if(json_params !== undefined)
	{
		
		if(json_params.position !== undefined)
		{
			this.VideoMesh.position.set(json_params.position);
		}

		if(json_params.scene !== undefined)
		{
			this.Scene = json_params.scene;
		}
		if(json_params.cssscene !== undefined)
		{
			this.CSSScene = json_params.cssscene;
		}
		if(json_params.camera !== undefined)
		{
			this.Camera = json_params.camera;
		}
		if(json_params.user_type !== undefined)
		{
			this.UserType = json_params.user_type;
		}
		if(json_params.texture !== undefined)
		{
			this.VideoMesh.Material = new THREE.MeshBasicMaterial( { map: json_params.texture, overdraw: true, side:THREE.DoubleSide, color: 0xff0000 } );
		}
		if(json_params.vkid !== undefined)
		{
			this.VKID = json_params.vkid;
		}

	}
	
	if(this.VideoMesh.Material === null)
	{
		this.VideoMesh.Material = new THREE.MeshBasicMaterial({side:THREE.DoubleSide});			
	}

	// Для локального игрока
	if(this.UserType === USER_TYPES.LOCAL)
	{
		this.VideoMesh.Mesh = new THREE.Mesh(this.VideoMesh.Geometry, this.VideoMesh.Material);		
		this.VideoMesh.Mesh.position.copy(VIDEO_MESH_MOVEMENT.POSITIONS.LOCAL.FRONT_OF_CAMERA);
		this.Video.volume = 0;
	}else if(this.UserType === USER_TYPES.REMOTE)
	{
		this.VideoMesh.Mesh = new THREE.Mesh(this.VideoMesh.Geometry, this.VideoMesh.Material);
		this.VideoMesh.Mesh.position.copy(VIDEO_MESH_MOVEMENT.POSITIONS.REMOTE.LEFT_AWAY);
		this.Video.poster = "./models/bg_1_1.png";
	}

	this.Scene.add(this.VideoMesh.Mesh);	

//	ForUpdating.push(this.comeAwayToLeftBF);
};

_VisualKeeper.prototype.comeAwayToRight = function ()
{

	if(Math.abs(this.VideoMesh.Mesh.position.x - VIDEO_MESH_MOVEMENT.POSITIONS.LOCAL.RIGHT_AWAY.x) <= 2 &&
		Math.abs(this.VideoMesh.Mesh.position.y - VIDEO_MESH_MOVEMENT.POSITIONS.LOCAL.RIGHT_AWAY.y) <= 2 &&
		Math.abs(this.VideoMesh.Mesh.position.z - VIDEO_MESH_MOVEMENT.POSITIONS.LOCAL.RIGHT_AWAY.z) <= 2
		)
	{
		for(var i=0; i<ForUpdating.length; i++)
		{
			if(ForUpdating[i] === this.comeAwayToRightBF)
			{
				ForUpdating.splice(i, 1);
				this.VideoMesh.Mesh.position.copy(VIDEO_MESH_MOVEMENT.POSITIONS.LOCAL.RIGHT_AWAY);
				this.VideoMesh.Mesh.rotation.set(0,0,0);
				this.MovementStatus = VIDEO_MESH_MOVEMENT.STATUS.STANDING;
				this.VideoMesh.Case.material.opacity = 0.2;
				this.VideoMesh.Case.position.copy(this.VideoMesh.Mesh.position);

			}
		}
	} else
	{
		if(Math.abs(this.VideoMesh.Mesh.position.x - VIDEO_MESH_MOVEMENT.POSITIONS.LOCAL.RIGHT_AWAY.x) > 2)
		{
			this.VideoMesh.Mesh.position.x += (VIDEO_MESH_MOVEMENT.POSITIONS.LOCAL.RIGHT_AWAY.x - this.VideoMesh.Mesh.position.x) / 
			VIDEO_MESH_MOVEMENT.POSITIONS.LOCAL.MOVING_STEP;
		}
		if(Math.abs(this.VideoMesh.Mesh.position.y - VIDEO_MESH_MOVEMENT.POSITIONS.LOCAL.RIGHT_AWAY.y) > 2)
		{
			this.VideoMesh.Mesh.position.y += (VIDEO_MESH_MOVEMENT.POSITIONS.LOCAL.RIGHT_AWAY.y - this.VideoMesh.Mesh.position.y) / 
			VIDEO_MESH_MOVEMENT.POSITIONS.LOCAL.MOVING_STEP;
		}
		if(Math.abs(this.VideoMesh.Mesh.position.z - VIDEO_MESH_MOVEMENT.POSITIONS.LOCAL.RIGHT_AWAY.z) > 2)
		{
			this.VideoMesh.Mesh.position.z += (VIDEO_MESH_MOVEMENT.POSITIONS.LOCAL.RIGHT_AWAY.z - this.VideoMesh.Mesh.position.z) / 
			VIDEO_MESH_MOVEMENT.POSITIONS.LOCAL.MOVING_STEP;		
		}
	}
	this.VideoMesh.Case.material.opacity += 0.003;
	this.VideoMesh.Case.position.copy(this.VideoMesh.Mesh.position);

};

_VisualKeeper.prototype.comeToLocalUserVideoMeshPositionFromRight = function ()
{
	if(Math.abs(this.VideoMesh.Mesh.position.x - VIDEO_MESH_MOVEMENT.POSITIONS.LOCAL.FRONT_OF_CAMERA.x) <= 2 &&
		Math.abs(this.VideoMesh.Mesh.position.y - VIDEO_MESH_MOVEMENT.POSITIONS.LOCAL.FRONT_OF_CAMERA.y) <= 2 &&
		Math.abs(this.VideoMesh.Mesh.position.z - VIDEO_MESH_MOVEMENT.POSITIONS.LOCAL.FRONT_OF_CAMERA.z) <= 2
		)
	{
		for(var i=0; i<ForUpdating.length; i++)
		{
			if(ForUpdating[i] === this.comeToLocalUserVideoMeshPositionFromRightBF)
			{
				ForUpdating.splice(i, 1);
				this.VideoMesh.Mesh.position.copy(VIDEO_MESH_MOVEMENT.POSITIONS.LOCAL.FRONT_OF_CAMERA);
				this.VideoMesh.Mesh.rotation.set(0,0,0);

				this.MovementStatus = VIDEO_MESH_MOVEMENT.STATUS.STANDING;
				this.VideoMesh.Case.material.opacity = 0;
				this.Scene.remove(this.VideoMesh.Case);
			}
		}
	} else
	{
		if(Math.abs(this.VideoMesh.Mesh.position.x - VIDEO_MESH_MOVEMENT.POSITIONS.LOCAL.FRONT_OF_CAMERA.x) > 2)
		{
			this.VideoMesh.Mesh.position.x += (VIDEO_MESH_MOVEMENT.POSITIONS.LOCAL.FRONT_OF_CAMERA.x - this.VideoMesh.Mesh.position.x) / 
			VIDEO_MESH_MOVEMENT.POSITIONS.LOCAL.MOVING_STEP;
		}
		if(Math.abs(this.VideoMesh.Mesh.position.y - VIDEO_MESH_MOVEMENT.POSITIONS.LOCAL.FRONT_OF_CAMERA.y) > 2)
		{
			this.VideoMesh.Mesh.position.y += (VIDEO_MESH_MOVEMENT.POSITIONS.LOCAL.FRONT_OF_CAMERA.y - this.VideoMesh.Mesh.position.y) / 
			VIDEO_MESH_MOVEMENT.POSITIONS.LOCAL.MOVING_STEP;
		}
		if(Math.abs(this.VideoMesh.Mesh.position.z - VIDEO_MESH_MOVEMENT.POSITIONS.LOCAL.FRONT_OF_CAMERA.z) > 2)
		{
			this.VideoMesh.Mesh.position.z += (VIDEO_MESH_MOVEMENT.POSITIONS.LOCAL.FRONT_OF_CAMERA.z - this.VideoMesh.Mesh.position.z) / 
			VIDEO_MESH_MOVEMENT.POSITIONS.LOCAL.MOVING_STEP;
		}
	}
	this.VideoMesh.Case.material.opacity -= 0.003;
	this.VideoMesh.Case.position.copy(this.VideoMesh.Mesh.position);


};

_VisualKeeper.prototype.comeAwayToLeft = function ()
{
	if(this.VideoMesh.Mesh.position.x >= VIDEO_MESH_MOVEMENT.POSITIONS.REMOTE.LEFT_AWAY.x)
	{
		for(var i=0; i<ForUpdating.length; i++)
		{
			if(ForUpdating[i] === this.comeAwayToLeftBF)
			{
				ForUpdating.splice(i, 1);
				this.VideoMesh.Mesh.position.copy(VIDEO_MESH_MOVEMENT.POSITIONS.REMOTE.LEFT_AWAY);
				this.VideoMesh.Mesh.rotation.set(0,0,0);

				this.MovementStatus = VIDEO_MESH_MOVEMENT.STATUS.STANDING;
			}
		}
	} else
	{
		this.VideoMesh.Mesh.position.x += 3.5;
		this.VideoMesh.Mesh.rotation.y += 0.02;
	}
};
_VisualKeeper.prototype.comeToCenterFromLeft = function ()
{
	if(this.VideoMesh.Mesh.position.x <= VIDEO_MESH_MOVEMENT.POSITIONS.REMOTE.FRONT_BACK_CENTER.x)
	{
		for(var i=0; i<ForUpdating.length; i++)
		{
			if(ForUpdating[i] === this.comeToCenterFromLeftBF)
			{
				ForUpdating.splice(i, 1);
				this.VideoMesh.Mesh.position.copy(VIDEO_MESH_MOVEMENT.POSITIONS.REMOTE.FRONT_BACK_CENTER);
				ForUpdating.push(this.comeToCameraBF);
			}
		}
	} else
	{
		this.VideoMesh.Mesh.position.x -= 6;
		this.VideoMesh.Case.position.copy(this.VideoMesh.Mesh.position);

	}
};
_VisualKeeper.prototype.comeToCamera = function ()
{
	if(this.VideoMesh.Mesh.position.z >= VIDEO_MESH_MOVEMENT.POSITIONS.REMOTE.FRONT_OF_CAMERA.z)
	{
		for(var i=0; i<ForUpdating.length; i++)
		{
			if(ForUpdating[i] === this.comeToCameraBF)
			{
				ForUpdating.splice(i, 1);
				this.VideoMesh.Mesh.position.copy(VIDEO_MESH_MOVEMENT.POSITIONS.REMOTE.FRONT_OF_CAMERA);
				this.MovementStatus = VIDEO_MESH_MOVEMENT.STATUS.STANDING;
				this.Scene.remove(this.VideoMesh.Case);
			}
		}
	} else
	{
		this.VideoMesh.Mesh.position.z += 8;
		this.VideoMesh.Case.material.opacity -= 0.005;
		this.VideoMesh.Case.position.copy(this.VideoMesh.Mesh.position);
	}
};

_VisualKeeper.prototype.setRandomPosition = function ()
{
	this.VideoMesh.Mesh.position.set(Math.random() * 400 - 200, Math.random() * 400 - 200, Math.random() * 400 - 200);				
};


// это функция, которая должна вызываться в главной игровой функции
_VisualKeeper.prototype.Life = function ()
{
};

/* Устанавливает позицию корабля
 */ 
_VisualKeeper.prototype.setPosition = function (json_params)
{
	if(typeof(json_params) === "string")
		json_params = JSON.parse(json_params);
	
//	this.VideoMesh.position.set();	
	this.VideoMesh.position.copy(json_params);
};
/* Устанавливает поворот корабля в пространстве
 */
_VisualKeeper.prototype.setRotation = function (json_params)
{
	if(typeof(json_params) === "string")
		json_params = JSON.parse(json_params);
		
	this.VideoMesh.rotation.copy(json_params);
};


/* Возвращает позицию корабля 
 */
_VisualKeeper.prototype.getPosition = function ()
{
	return this.VideoMesh.position.clone();
};
/* Возвращает поворот корабля
 */
_VisualKeeper.prototype.getRotation = function ()
{
	return this.VideoMesh.rotation.clone();
};

_VisualKeeper.prototype.getVideoMesh = function ()
{
	return this.VideoMesh.Mesh;
};

_VisualKeeper.prototype.removeMesh = function ()
{
	this.Scene.remove(this.VideoMesh.Mesh);
};

_VisualKeeper.prototype.setVideoTextureByStream = function (stream)
{
	this.Video.src = window.URL.createObjectURL(stream);

	this.VideoTexture = new THREE.VideoTexture( this.Video);
	this.VideoTexture.minFilter = THREE.LinearFilter;
	this.VideoTexture.magFilter = THREE.LinearFilter;
	this.VideoTexture.format = THREE.RGBFormat;
	this.setTextureAndUpdateMesh(this.VideoTexture);

	if(this.UserType === USER_TYPES.REMOTE)
	{
		this.VideoMesh.Case = new THREE.Mesh(
			new THREE.BoxGeometry(150, 150, 150), 
			new THREE.MeshStandardMaterial({color: 0xffffff*Math.random(), opacity: Math.random()*0.2+0.5, transparent: true})
		);
		this.VideoMesh.Case.position.copy(this.VideoMesh.Mesh.position);
		this.Scene.add(this.VideoMesh.Case);
	} else
	{
		this.VideoMesh.Case = new THREE.Mesh(
			new THREE.BoxGeometry(150, 150, 150), 
			new THREE.MeshStandardMaterial({color: 0xffffff*Math.random(), opacity: 0, transparent: true})
		);
		this.VideoMesh.Case.position.copy(this.VideoMesh.Mesh.position);
	}
};
/*
 * Устанавливает текстуру и обновляет Mesh.
 */
_VisualKeeper.prototype.setTextureAndUpdateMesh = function (texture)
{
	this.Scene.remove(this.VideoMesh.Mesh);	
	var temp_mesh = this.VideoMesh.Mesh;
	
	this.VideoMesh.Material = new THREE.MeshBasicMaterial({
		map: texture, 
		overdraw: true, 
		side:THREE.DoubleSide
	});
	
	this.VideoMesh.Mesh = new THREE.Mesh(this.VideoMesh.Geometry, this.VideoMesh.Material);
	this.VideoMesh.Mesh.position.copy(temp_mesh.position);
	
	this.Scene.add(this.VideoMesh.Mesh);
};

_VisualKeeper.prototype.hideVideo = function ()
{
	if(this.MovementStatus === VIDEO_MESH_MOVEMENT.STATUS.STANDING)
	{
		this.MovementStatus = VIDEO_MESH_MOVEMENT.STATUS.MOVEMENT;

		if(this.UserType === USER_TYPES.LOCAL)
		{
			this.Scene.add(this.VideoMesh.Case);
			ForUpdating.push(this.comeAwayToRightBF);
		}
		else if(this.UserType === USER_TYPES.REMOTE)
		{
			ForUpdating.push(this.comeAwayToLeftBF);
		}
	}
};

_VisualKeeper.prototype.showVideo = function ()
{
	if(this.MovementStatus === VIDEO_MESH_MOVEMENT.STATUS.STANDING)
	{
		this.MovementStatus = VIDEO_MESH_MOVEMENT.STATUS.MOVEMENT;
		if(this.UserType === USER_TYPES.LOCAL)
		{
			ForUpdating.push(this.comeToLocalUserVideoMeshPositionFromRightBF);
		}
		else if(this.UserType === USER_TYPES.REMOTE)
			ForUpdating.push(this.comeToCenterFromLeftBF);
	}
};

_VisualKeeper.prototype.setVKIDBannerText = function (vkid)
{
	this.VKIDBanner.ObjHTML.removeChild(this.VKIDBanner.TextContent);
	this.VKIDBanner.TextContent = document.createTextNode(vkid);
	this.VKIDBanner.ObjHTML.appendChild(this.VKIDBanner.TextContent);
};

_VisualKeeper.prototype.getMovementStatus = function ()
{
	return this.MovementStatus;
};
_VisualKeeper.prototype.position = function ()
{
	return this.MovementStatus;
};