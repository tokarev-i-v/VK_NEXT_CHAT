/*
Представляет собой класс контроллеров, добавляемых на экран.
В данном случае представляет собой 3 кнопки.
Кнопка - показывающая и скрывающая ID удаленного собеседника.
Кнопка - показывающая и скрывающия видео собеседника.
Кнопка - заставляющая производить поиск нового собеседника.
*/
/*
IN:
json_params = {
	scene: new THREE.Scene(),
	on_vkid_button_click: handler_function,
	on_video_button_click: handler_function,
	on_next_button_click: handler_function
}
*/
var _ChatControls = function (json_params)
{
	this.onVKIDButtonClickBF = this.onVKIDButtonClick.bind(this);
	this.onVideoButtonClickBF = this.onVideoButtonClick.bind(this);
	this.onFindNextButtonClickBF = this.onFindNextButtonClick.bind(this);

	this.Controls = {};
	this.Controls.VKIDButton = {};
	this.Controls.VideoButton = {};
	this.Controls.FindNextButton = {};

	this.Mode = CONTROL_BUTTONS_MODE.CSS3D;
	this.Scene = json_params.scene;
	this.CSSScene = json_params.cssscene;

	this.UsersOnClicks = {
		onVKIDButtonClick: json_params.on_vkid_button_click,
		onVideoButtonClick: json_params.on_video_button_click,
		onFindNextButtonClick: json_params.on_find_next_button_click
	};

	switch(this.Mode)
	{
		case CONTROL_BUTTONS_MODE.CSS3D:
			this.initButtons3DCSS();
		break;

		case CONTROL_BUTTONS_MODE.Three3D:
			this.initButtons3D();
		break;
	}

	this.setOnClicks();

};

_ChatControls.prototype.setOnClicks = function (json_params)
{
	switch(this.Mode)
	{
		case CONTROL_BUTTONS_MODE.CSS3D:
			this.Controls.VKIDButton.ObjHTML.onclick = this.onVKIDButtonClickBF;
			this.Controls.VideoButton.ObjHTML.onclick = this.onVideoButtonClickBF;
			this.Controls.FindNextButton.ObjHTML.onclick = this.onFindNextButtonClickBF;
		break;

		case CONTROL_BUTTONS_MODE.Three3D:
		
		break; 
	}
};

_ChatControls.prototype.onVKIDButtonClick = function ()
{
	this.UsersOnClicks.onVKIDButtonClick();
};
_ChatControls.prototype.onVideoButtonClick = function ()
{
	this.UsersOnClicks.onVideoButtonClick();	
};
_ChatControls.prototype.onFindNextButtonClick = function ()
{
	this.UsersOnClicks.onFindNextButtonClick();	
};

_ChatControls.prototype.initButtons3DCSS = function ()
{

	this.Controls.VideoButton.ObjHTML = document.createElement("div");
	this.Controls.VideoButton.ObjHTML.id = "VideoButton3DCSS";
	this.Controls.VideoButton.Obj3DCSS = new THREE.CSS3DObject(this.Controls.VideoButton.ObjHTML);
	this.Controls.VideoButton.Obj3DCSS.position.set(-150, 110, -350);

	this.Controls.VKIDButton.ObjHTML = document.createElement("div");
	this.Controls.VKIDButton.ObjHTML.id = "VKIDButton3DCSS";
	this.Controls.VKIDButton.Obj3DCSS = new THREE.CSS3DObject(this.Controls.VKIDButton.ObjHTML);
	this.Controls.VKIDButton.Obj3DCSS.position.set(-150, 10, -350);

	this.Controls.FindNextButton.ObjHTML = document.createElement("div");
	this.Controls.FindNextButton.ObjHTML.id = "FindNextButton3DCSS";
	this.Controls.FindNextButton.Obj3DCSS = new THREE.CSS3DObject(this.Controls.FindNextButton.ObjHTML);
	this.Controls.FindNextButton.Obj3DCSS.position.set(-150, -70, -350);
	this.Controls.FindNextButton.TextContent = document.createTextNode("Next");
	this.Controls.FindNextButton.ObjHTML.appendChild(this.Controls.FindNextButton.TextContent);


	this.CSSScene.add(
		this.Controls.FindNextButton.Obj3DCSS
	);

};


_ChatControls.prototype.initButtons3D = function ()
{
	this.initVideoButton3D();
	this.initVKIDButton3D();
	this.initNextButton3D();
};

_ChatControls.prototype.initVKIDButton3D = function ()
{
	this.Controls.VKIDButton.CaseModel = {};
	this.Controls.VKIDButton.CaseModel.Material = new THREE.MeshBasicMaterial({color: 0x49545c});
	this.Controls.VKIDButton.CaseModel.Geometry = new THREE.BoxGeometry(200, 200, 200);
	this.Controls.VKIDButton.CaseModel.Mesh = new THREE.Mesh(
			this.Controls.VKIDButton.CaseModel.Geometry,
			this.Controls.VKIDButton.CaseModel.Material
		);

	this.Controls.VKIDButton.ButtonModel.Material = new THREE.MeshBasicMaterial({color: 0x85b6d6});
	this.Controls.VKIDButton.ButtonModel.Geometry = new THREE.BoxGeometry(100, 100, 100);
	this.Controls.VKIDButton.ButtonModel.Mesh = new THREE.Mesh(
			this.Controls.VKIDButton.ButtonModel.Geometry,
			this.Controls.VKIDButton.ButtonModel.Material
		);
	this.Controls.VKIDButton.CaseModel.Mesh.position.set(0,0, -100);

	this.Controls.VKIDButton.Mesh = new THREE.Object3D();
	this.Controls.VKIDButton.Mesh.add(this.Controls.VKIDButton.CaseModel);
	this.Controls.VKIDButton.Mesh.add(this.Controls.VKIDButton.ButtonModel);

};

_ChatControls.prototype.initVideoButton3D = function ()
{
	this.Controls.VideoButton.CaseModel = {};
	this.Controls.VideoButton.CaseModel.Material = new THREE.MeshBasicMaterial({color: 0x49545c});
	this.Controls.VideoButton.CaseModel.Geometry = new THREE.BoxGeometry(200, 200, 200);
	this.Controls.VideoButton.CaseModel.Mesh = new THREE.Mesh(
			this.Controls.VideoButton.CaseModel.Geometry,
			this.Controls.VideoButton.CaseModel.Material
		);

	this.Controls.VideoButton.ButtonModel.Material = new THREE.MeshBasicMaterial({color: 0x85b6d6});
	this.Controls.VideoButton.ButtonModel.Geometry = new THREE.BoxGeometry(100, 100, 100);
	this.Controls.VideoButton.ButtonModel.Mesh = new THREE.Mesh(
			this.Controls.VideoButton.ButtonModel.Geometry,
			this.Controls.VideoButton.ButtonModel.Material
		);
	this.Controls.VideoButton.CaseModel.Mesh.position.set(0,0, -100);

	this.Controls.VideoButton.Mesh = new THREE.Object3D();
	this.Controls.VideoButton.Mesh.add(this.Controls.VideoButton.CaseModel);
	this.Controls.VideoButton.Mesh.add(this.Controls.VideoButton.ButtonModel);
};

_ChatControls.prototype.initNextButton3D = function ()
{
	this.Controls.FindNextButton.CaseModel = {};
	this.Controls.FindNextButton.CaseModel.Material = new THREE.MeshBasicMaterial({color: 0xFF0000});
	this.Controls.FindNextButton.CaseModel.Geometry = new THREE.BoxGeometry(200, 200, 200);
	this.Controls.FindNextButton.CaseModel.Mesh = new THREE.Mesh(
			this.Controls.FindNextButton.CaseModel.Geometry,
			this.Controls.FindNextButton.CaseModel.Material
		);

	this.Controls.FindNextButton.ButtonModel.Material = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
	this.Controls.FindNextButton.ButtonModel.Geometry = new THREE.BoxGeometry(100, 100, 100);
	this.Controls.FindNextButton.ButtonModel.Mesh = new THREE.Mesh(
			this.Controls.FindNextButton.ButtonModel.Geometry,
			this.Controls.FindNextButton.ButtonModel.Material
		);
	this.Controls.FindNextButton.CaseModel.Mesh.position.set(0,0, -100);

	this.Controls.FindNextButton.Mesh = new THREE.Object3D();
	this.Controls.FindNextButton.Mesh.add(this.Controls.FindNextButton.CaseModel);
	this.Controls.FindNextButton.Mesh.add(this.Controls.FindNextButton.ButtonModel);

};
