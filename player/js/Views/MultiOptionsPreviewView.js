function MultiOptionsPreviewView() {

    var submenu;

	this.UpdateView = function(data){
		submenu = scene.getObjectByName(data.name);

		submenu.add(refreshSubtitlesPreview(data));
		submenu.add(refreshAreaSTPreview(data));
        if(scene.getObjectByName("sign")) submenu.add(refreshSignerPreview(data));
        if(scene.getObjectByName("sign")) submenu.add(refreshAreaSLPreview(data));

        submenu.getObjectByName('signerpreview').visible = subController.getSignerEnabled();
	}
	
	function refreshSubtitlesPreview(data)
    {
        var submenu = scene.getObjectByName(data.name);
        submenu.remove(scene.getObjectByName('subtitlespreview'));

        return data.subtitlesPreview;
    }

	function refreshAreaSTPreview(data)
    {
        var submenu = scene.getObjectByName(data.name);
        submenu.remove(scene.getObjectByName('areaSTpreview'));

        return data.areaSTPreview;
    }

    function refreshAreaSLPreview(data)
    {
        var submenu = scene.getObjectByName(data.name);
        submenu.remove(scene.getObjectByName('areaSLpreview'));

        return data.areaSLPreview;
    }

    function refreshSignerPreview(data)
    {
        var submenu = scene.getObjectByName(data.name);
        submenu.remove(scene.getObjectByName('signerpreview'));

        return data.signerPreview;
    }
}