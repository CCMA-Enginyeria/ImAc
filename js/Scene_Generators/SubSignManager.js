/**
 * @author isaac.fraile@i2cat.net
 */

 // This library needs to use the MediaObject.js and imsc_i2cat.js functions

SubSignManager = function() {

	var imsc1doc;

	var textListMemory = [];
	var autoPositioning = false;

	var subtitleMesh;
	var signerMesh;
	var radarMesh;
	var speakerMesh;

	// [ST] subtitle vars 
	var subtitleEnabled = false; // boolean
	var subPosX = 0; // start = left = -1, center = 0, end = right = 1 
	var subPosY = -1; // before = top = 1, center = 0, after = bottom = -1 
	var subtitleIndicator = 'none'; // none, arrow, radar, move
	var subSize = 1; // small = 0.6, medium = 0.8, large = 1
	var subLang; // TODO - string (En, De, Ca, Es)
	var subBackground = 0.8; // semi-transparent = 0.8, outline = 0
	var subEasy = false; // boolean
	var subArea = 50; // small = 50, medium = 60, large = 70

	// [SL] signer vars
	var signerContent; // URL
	var signEnabled = false; // boolean
	var signPosX = 1; // left = -1, center = 0, right = 1
	var signPosY = -1; // bottom = -1, center = 0, top = 1
	var signIndicator = 'none';	 // none, arrow, move
	var signArea = 70; // small = 50, medium = 60, large = 70
	var signLang; // TODO - string (En, De, Ca, Ep)


//************************************************************************************
// Private Functions
//************************************************************************************

	function updateISD(offset)
	{
		var isd = imsc.generateISD( imsc1doc, offset );

		if ( isd.contents.length > 0 ) 
	  	{
	  		if ( autoPositioning ) changePositioning( isd.imac );
	    	if ( subtitleEnabled ) print3DText( isd.contents[0], isd.imac );

	    	checkSpeakerPosition( isd.imac );
	  	}
	}

	function print3DText(isdContent, isdImac) 
	{
	  	if ( isdContent.contents.length > 0 )
	  	{
	    	var isdContentText = isdContent.contents[0].contents[0].contents[0].contents;
	    	var textList = [];

	    	for ( var i = 0, l = isdContentText.length; i < l; ++i )
	    	{
	      		if ( isdContentText[i].kind == 'span' && isdContentText[i].contents )
	      		{
	        		var isdTextObject = {
	          			text: isdContentText[i].contents[0].text,
	          			color: adaptRGBA( isdContentText[i].contents[0].styleAttrs['http://www.w3.org/ns/ttml#styling color'] ),
	          			backgroundColor: adaptRGBA( isdContentText[i].contents[0].styleAttrs['http://www.w3.org/ns/ttml#styling backgroundColor'] )
	        		};

	        		textList.push( isdTextObject );
	      		}
	    	}

	    	if ( textList.length > 0 && ( textListMemory.length == 0 || textListMemory.length > 0 && textList[0].text != textListMemory[0].text ) ) 
	    	{
	      		removeSubtitle();

	      		var latitud = subPosY == 1 ? 30 * subArea/100 : -30 * subArea/100; 
	      		var posY = _isHMD ? 80 * Math.sin( Math.radians( latitud ) ) : 135 * Math.sin( Math.radians( latitud ) );
	      		var subAjust = _isHMD ? 1 : 0.97;
	      		var posZ = 75;

	      		var conf = {
			        subtitleIndicator: subtitleIndicator,
			        displayAlign: subPosY,
			        textAlign: subPosX,
			        size: subSize * subAjust,
			        area: subArea/130,
			        opacity: subBackground,
			        x: 0,
			        y: posY * 9/16,
			        z: posZ
			    };

	      		createSubtitle( textList, conf );

	      		if ( subtitleIndicator == 'radar' ) createSpeakerRadar( textList[0].color, isdImac );

	      		textListMemory = textList;     
	    	}   
	  	}
	  	else 
	  	{
	    	textListMemory = [];
	    	removeSubtitle();
	    	removeSpeakerRadar();
	  	}
	}

	function checkSignIdicator(position)
	{
		if ( signIndicator != 'none' ) 
		{
		  	if ( position == 'center' && signIndicator == 'move' ) 
		  	{
		  		position = signPosX == -1 ? 'left' : 'right';
		  	}
			signIndicator != 'move' ? changeSignIndicator( position ) : changeSignPosition( position );
		}
	}

	function checkSubtitleIdicator(position)
	{
		if ( subtitleIndicator != 'none' ) 
		{
			subtitleIndicator != 'move' ? changeSubtitleIndicator( position ) : textListMemory = [];
		}  	
	}

	function checkSpeakerPosition(isdImac)
	{
		var difPosition = getViewDifPosition( isdImac, camera.fov );
	  	var position;

	  	if ( isdImac == undefined || difPosition == 0 )
	  	{
	  		position = 'center';
	  	}
	  	else
	  	{
	    	position = difPosition < 0 ? 'left' : 'right';
	  	}

	  	checkSubtitleIdicator( position );
	    checkSignIdicator( position );	
	}

	function changePositioning(isdImac)
	{
		autoPositioning = false;
		var position = Math.round(getViewDifPosition( isdImac, 3 ));

      	var rotaionValue = 0;
      	var initY = Math.round( CameraParentObject.rotation.y * (-180/Math.PI)%360 );

      	var rotationInterval = setInterval(function() 
      	{
      		var difff = isdImac - initY;
      		if ( difff > 180 ) difff -= 360;
      		if ( difff < 0 ) difff = -1*difff;
        	if ( position * rotaionValue >= difff || position == 0 ) 
        	{
        		clearInterval( rotationInterval );
        		if ( VideoController.getListOfVideoContents()[0].vid.currentTime < VideoController.getListOfVideoContents()[0].vid.duration - 10 ) autoPositioning = true;
        		else {
        			AplicationManager.enableVR();
        			autopositioning = false;
        			if ( _isHMD ) CameraParentObject.rotation.set(0,0,0);
        		}
        	}
        	else 
        	{
          		rotaionValue += position*2;
          		CameraParentObject.rotation.y = initY / ( -180 / Math.PI )%360 + rotaionValue * ( -Math.PI / 180 );
        	}
      	}, 20);
	}	

	function createSigner()
	{
	    var latitud = 30 * signPosY; 
	    var longitud = 53 * signPosX; 

	    var posX = _isHMD ? 60 * Math.sin( Math.radians( longitud ) ) * signArea/100 : 80 * Math.sin( Math.radians( longitud ) ) * signArea/100;
	    var posY = 50 * Math.sin( Math.radians( latitud ) ) * signArea/100;
	    var posZ = 76;

		var conf = {
			size: 30 * 70/100, // signArea/100
			signIndicator: signIndicator,
			x: posX,
			y: posY,
			z: posZ
		};

      	createSignVideo( signerContent, 'sign', conf );
      	VideoController.playAll();
	}

	function updateSignerPosition()
	{
		var latitud = 30 * signPosY; 
	    var longitud = 53 * signPosX; 

	    var posX = _isHMD ? 60 * Math.sin( Math.radians( longitud ) ) * signArea/100 : 80 * Math.sin( Math.radians( longitud ) ) * signArea/100;
	    var posY = 50 * Math.sin( Math.radians( latitud ) ) * signArea/100;
	    var posZ = 76;

	    scene.getObjectByName("sign").position.x = posX;
	    scene.getObjectByName("sign").position.y = posY;
	}

    function createSubtitle(textList, config)
    {
        subtitleMesh = moData.getSubtitleMesh( textList, config );

        camera.add( subtitleMesh );
    }

    function createSignVideo(url, name, config)
    {
    	removeSignVideo();

        signerMesh = moData.getSignVideoMesh( url, name, config );
        camera.add( signerMesh );
    }

    function createRadar()
    {
    	if ( radarMesh ) removeRadar();
    	radarMesh = moData.getRadarMesh();
    	camera.add( radarMesh );
    }

    function createSpeakerRadar(color, pos)
    {
    	if ( !radarMesh ) createRadar();

    	if ( pos != undefined && speakerMesh )
        {
            speakerMesh.rotation.z = Math.radians( 360-pos );
            speakerMesh.material.color.set( color ); 
        }
        else if ( pos != undefined ) 
        {
            speakerMesh = moData.getSpeakerRadarMesh( color, pos );
            camera.add( speakerMesh );
        }
        else removeSpeakerRadar();
    }

//************************************************************************************
// Media Object Destructors
//************************************************************************************

    function removeSubtitle()
    {
        camera.remove( subtitleMesh );
        subtitleMesh = undefined;
    }

    function removeSignVideo()
    {
        if ( signerMesh ) 
        {
            VideoController.removeContentById( signerMesh.name );
            camera.remove( signerMesh );
            signerMesh = undefined;
        }
    }

    function removeRadar()
    {
    	removeSpeakerRadar();
    	camera.remove( radarMesh );
    	radarMesh = undefined;
    }

    function removeSpeakerRadar()
    {
    	camera.remove( speakerMesh );
    	speakerMesh = undefined;
    }

//************************************************************************************
// Media Object Position Controller 
//************************************************************************************

    function changeSubtitleIndicator(pos)
    {
        if ( subtitleMesh )
        {
        	subtitleMesh.children.forEach( function( elem ) 
        	{ 
        		elem.children.forEach( function( e ) 
        		{
        			if ( e.name == 'left' ) e.visible = pos == 'left' ? true : false;
                    else if ( e.name == 'right' ) e.visible = pos == 'right' ? true : false;
                }); 
        	}); 
        }
    }

    function changeSignIndicator(pos)
    {
        if ( signerMesh )
        {
        	subtitleMesh.children.forEach( function( e ) 
        	{
        		if ( e.name == 'left' ) e.visible = pos == 'left' ? true : false;
                else if ( e.name == 'right' ) e.visible = pos == 'right' ? true : false;
            }); 
        }
    }

    function changeSignPosition(pos) 
    {
        if ( signerMesh && ( ( pos == 'left' && signerMesh.position.x > 0 ) || ( pos == 'right' && signerMesh.position.x < 0 ) ) )
        {
            signerMesh.position.x = signerMesh.position.x * -1;
        }
    }

//************************************************************************************
// Utils
//************************************************************************************

	function adaptRGBA(rgb)
    {
    	return ( rgb && rgb.length === 4 ) ? "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")" : '';
	}

    function getViewDifPosition(sp, fov)
    {
    	var target = new THREE.Vector3();
    	var camView = camera.getWorldDirection( target );
	  	var offset = camView.z >= 0 ? 180 : -0;

    	var lon = Math.degrees( Math.atan( camView.x/camView.z ) ) + offset;

    	lon = lon > 0 ? 360 - lon : - lon;

    	if ( ( lon - sp + 360 )%360 > fov && ( lon - sp + 360 )%360 <= 180 ) return -1; 
    	else if ( ( lon - sp + 360 )%360 > 180 && ( lon - sp + 360 )%360 <= 360 - fov ) return 1;
    	else return 0;
    }

//************************************************************************************
// Public Subtitle Getters
//************************************************************************************

	this.getSubtitleEnabled = function()
	{
		return subtitleEnabled;
	};

	this.getSubPosition = function()
	{
		var position = {
			x: subPosX,
			y: subPosY
		};

		return position;
	};

	this.getSubIndicator = function()
	{
		return subtitleIndicator;
	};

	this.getSubSize = function()
	{
		return subSize;
	};

	this.getSubLanguage = function()
	{
		return subLang;
	};

	this.getSubBackground = function()
	{
		return subBackground;
	};

	this.getSubEasy = function()
	{
		return subEasy;
	};

	this.getSubArea = function()
	{
		return subArea;
	};	

//************************************************************************************
// Public Signer Getters
//************************************************************************************

	this.getSignerEnabled = function()
	{
		return signEnabled;
	};

	this.getSignerPosition = function()
	{
		var position = {
			x: signPosX,
			y: signPosX
		};

		return position;
	};

	this.getSignerIndicator = function()
	{
		return signIndicator;
	};

	this.getSignerArea = function()
	{
		return signArea;
	};

	this.getSignerLanguage = function()
	{
		return signLang;
	};

//************************************************************************************
// Public Subtitle Setters
//************************************************************************************

	this.setSubtitle = function(xml)
	{
		var r = new XMLHttpRequest();

	  	r.open( "GET", xml );
	    r.onreadystatechange = function () 
	    {
	        if ( r.readyState === 4 && r.status === 200 ) 
	        {
	            imsc1doc = imsc.fromXML( r.responseText );
	        }
	    };
	    r.send();
	};

	this.setSubIndicator = function(ind)
	{
		subtitleIndicator = ind;
		textListMemory = [];

		if ( ind != 'radar' ) removeRadar(); 
	};

	this.setSubSize = function(size)
	{
		subSize = size;
		textListMemory = [];
	};

	this.setSubBackground = function(background)
	{
		subBackground = background;
		textListMemory = [];
	};

	this.setSubEasy = function(easy)
	{
		subEasy = easy;
	};

	this.setSubPosition = function(x, y)
	{
		subPosX = x;
		subPosY = y;
		textListMemory = [];
	};

	this.setSubArea = function(size)
	{
		subArea = size;
		textListMemory = [];
	};

//************************************************************************************
// Public Signer Setters
//************************************************************************************

	this.setSignerPosition = function(x, y)
	{
		signPosX = x;
		signPosY = y;
		updateSignerPosition();
	};	

	this.setSignerArea = function(size)
	{
		signArea = size;
		updateSignerPosition();
	};

	this.setSignerIndicator = function(ind)
	{
		signIndicator = ind;
		updateSignerPosition();
	};

	this.setSignerContent = function(url)
	{
		signerContent = url;
		if ( signEnabled ) createSigner();
	};	

//************************************************************************************
// Public functions
//************************************************************************************

	this.updateSubtitleByTime = function(time)
	{
		if ( imsc1doc ) updateISD( time );
	};

    this.initSubtitle = function(fov, x, y, ind)
	{
		subArea = fov;
		subPosX = x;
		subPosY = y;
		subtitleIndicator = ind;
		textListMemory = [];
	};

	this.initSigner = function(fov, x, y, ind)
	{
		signArea = fov;
		signPosX = x;
		signPosY = y;
		signIndicator = ind;
	};

	this.enableSubtitles = function()
	{
		subtitleEnabled = true;
	};

	this.disableSubtiles = function()
	{
		removeSubtitle();
		removeRadar();
		subtitleEnabled = false;
	};

	this.switchSubtitles = function(enable)
	{
		if ( !enable ) removeSubtitle();
		subtitleEnabled = enable;
	}

	this.enableAutoPositioning = function()
	{
		autoPositioning = true;
	};

	this.disableAutoPositioning = function()
	{
		autoPositioning = false;
	};

	this.switchSigner = function(enable)
	{
		signEnabled = enable;
		enable ? createSigner() : removeSignVideo();
	};

	this.updateRadar = function()
    {
        if ( radarMesh ) 
        {
            var target = new THREE.Vector3();
            var camView = camera.getWorldDirection( target );
            var offset = camView.z >= 0 ? 180 : -0;

            var lon = Math.degrees( Math.atan( camView.x/camView.z ) ) + offset;

            radarMesh.rotation.z = Math.radians( lon );
        }
    };
}