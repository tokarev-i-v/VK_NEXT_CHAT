var _ChatModule = function (json_params)
{
	this.Inputs = {
		MessagingWindow: {
			ObjHTML: document.createElement("div")
		},
		MessagesView: {
			ObjHTML: document.createElement("div")
		},
		WritingField:  {
			ObjHTML: document.createElement("textarea")
		},
		SendMessageButton: {
			ObjHTML: document.createElement("button")
		}
	};

	this.Inputs.MessagingWindow.ObjHTML.id = "MessagingWindow";

	this.Inputs.MessagesView.ObjHTML.id = "MessagesView";
	this.Inputs.MessagesView.ObjHTML.class = "ChatElementsClass";

	this.Inputs.WritingField.ObjHTML.id = "WritingField";
	this.Inputs.WritingField.ObjHTML.class = "ChatElementsClass";

	this.Inputs.SendMessageButton.ObjHTML.id = "SendMessageButton";	
	this.Inputs.SendMessageButton.ObjHTML.class = "ChatElementsClass";

	this.Inputs.MessagingWindow.ObjHTML.appendChild(this.Inputs.MessagesView.ObjHTML);	
	this.Inputs.MessagingWindow.ObjHTML.appendChild(this.Inputs.WritingField.ObjHTML);	
	this.Inputs.MessagingWindow.ObjHTML.appendChild(this.Inputs.SendMessageButton.ObjHTML);	


	this.Inputs.MessagingWindow.Obj3DCSS = new THREE.CSS3DObject(this.Inputs.MessagingWindow.ObjHTML);

	this.Inputs.MessagingWindow.Obj3DCSS.position.x = -280;
	this.Inputs.MessagingWindow.Obj3DCSS.position.y = 0;
	this.Inputs.MessagingWindow.Obj3DCSS.position.z = 100;

	if(json_params !== undefined)
	{
		if(json_params.scene !== undefined)
		{
			this.addMeToScene(json_params.scene);
		}
	}

};
/*
It processing message writing in textarea;
*/
_ChatModule.prototype.onWriting = function ()
{

};

_ChatModule.prototype.onSendClick = function ()
{

};

_ChatModule.prototype.addMeToScene = function (scene)
{
	scene.add(this.Inputs.MessagingWindow.Obj3DCSS);	
};
_ChatModule.prototype.removeMeFromCSSScene = function (scene)
{
	scene.remove(this.Inputs.MessagingWindow.Obj3DCSS);
};