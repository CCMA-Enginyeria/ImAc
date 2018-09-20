
function PlayPauseLSMenuController() {

	var data;
	var view;
	var viewStructure;
	

	this.Init = function(){

		data = GetData();
		UpdateData(data);
		viewStructure = scene.getObjectByName(data.name);
		viewStructure.visible = true;

		view = new PlayPauseLSMenuView();
		view.UpdateView(data); 

		AddInteractivityToMenuElements();
	}

	this.Exit = function()
    {
    	if(viewStructure)
    	{
	    	viewStructure.visible = false;
	    	viewStructure.children.forEach(function(intrElement){
	    		interController.removeInteractiveObject(intrElement.name);
	    	})
    	}
    }

    this.getLSMenuName = function()
    {
    	return data.name;
    }

    function GetData()
	{
	    if (data == null)
	    {
	        data = new PlayPauseLSMenuModel();
	    }
	    return data;
	}


	function UpdateData(data)
    {
		data.isPaused = ppMMgr.isPausedById(0);
		data.backMenuButtonfunc = function(){ menumanager.NavigateBackMenu()};
		data.forwardMenuButtonFunc = function(){ menumanager.NavigateForwardMenu()};
    }


    function AddInteractivityToMenuElements()
    {
    	viewStructure.children.forEach(function(intrElement){
    		if(intrElement.visible)
    		{
    			interController.addInteractiveObject(intrElement);
    		}
    	})
    }
}
