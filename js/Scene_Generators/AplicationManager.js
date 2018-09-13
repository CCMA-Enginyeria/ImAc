
var camera;
var scene;

var controls;

function AplicationManager()
{
    //var controls;
    var container;
    var renderer;
    var effect;
    var isVRtested = false;
    var haveVrDisplay = false;

    var _display;


    this.init_AplicationManager = function()
    {
        init();
		waitSesionManager();	
    };

    this.switchDevice = function()
    {
    	if ( _display.length > 0 ) 
    	{
    		if ( _isHMD )
    		{
    			ppMMgr.playAll();
    			_isHMD = false;
    			_display[ 0 ].isPresenting ? _display[ 0 ].exitPresent() : _display[ 0 ].requestPresent( [ { source: renderer.domElement } ] ).then(
				function () { 
					isVRtested=true; 
					startAllVideos(); 
					//controls = new THREE.DeviceOrientationAndTouchController( camera, CameraParentObject, renderer.domElement, renderer );
				});
    		}
    		else
    		{
    			ppMMgr.playAll();
    			_isHMD = true;;
    			//controls = undefined;
    			_display[ 0 ].isPresenting ? _display[ 0 ].exitPresent() : _display[ 0 ].requestPresent( [ { source: renderer.domElement } ] ).then(
				function () { 
					isVRtested=true; 
					startAllVideos(); 
				});

				renderer.vr.setDevice( _display[ 0 ] );

    		}
		}
    };

    this.enableVR = function()
    {
    	renderer.vr.setDevice( _display[ 0 ] );
    };

    this.disableVR = function()
    {
    	renderer.vr.setDevice( null );
    };

	function waitSesionManager()
	{ 
		if (isVRtested == true)
		{
			activateLogger();
			haveVrDisplay ? renderer.animate( render ) : update(); 
		}
		else
		{
			requestAnimationFrame( waitSesionManager );
		}
	}

	function activateLogger()
	{
		if (loggerActivated)
		{
			setInterval(function(){
				statObj.add(new StatElements());
			}, 500);
		}
	}

	function update() 
	{	
		if(controls) controls.update();
		effect.render( scene, camera );
		requestAnimationFrame( update );		
    }

    function render()
    {
    	THREE.VRController.update()
    	if ( controls ) controls.update();
    	//THREE.VRController.update()
    	renderer.render( scene, camera );

    	if ( AudioManager.isAmbisonics ) AudioManager.updateRotationMatrix( camera.matrixWorld.elements );

    	if( THREE.VRController.getTouchPadState() && _isHMD ) 
    	{
            var mouse3D = new THREE.Vector2();
	        mouse3D.x = 0;
	        mouse3D.y = 0;
					
			//moData.isPausedById(0) ? moData.playAll() : moData.pauseAll();
			interController.checkInteraction(mouse3D, camera, 'onDocumentMouseDown');
		}

		// If the device is in HMD mode and the menu is open, the menu will follow the FoV of the user

		var menu;
    	if(_isTradMenuOpen) menu = scene.getObjectByName( "traditionalMenu" );
    	else menu  = scene.getObjectByName(menuList[0].name)

	    if(_isHMD && menu)
	    {
	        MenuManager.menuFollowCameraFOV(Math.sign(Math.round(Math.degrees(camera.rotation.y))%360), menu);
	    } 

		Reticulum.update();
    }

    function init() 
    {
		console.log("[AplicationManager]  init");
	
		blockContainer();
			
		container = document.getElementById( 'container' );
	
        camera = new THREE.PerspectiveCamera( 60.0, window.innerWidth / window.innerHeight, 0.05, 1000 );
        camera.name = 'perspectivecamera';


 		var openMenuText = menuData.getMenuTextMesh("Menu", 22, 0xffff00, "openmenutext"); 
 		openMenuText.position.y = 6;
 		openMenuText.position.z = -60;
 		openMenuText.scale.set(0.15, 0.15, 1)
 		openMenuText.visible = false;

 		camera.add(openMenuText);

        this.CameraParentObject = new THREE.Object3D();
        this.CameraParentObject.name = 'parentcamera';
		this.CameraParentObject.add( camera );

		scene = new THREE.Scene();
		scene.add( this.CameraParentObject );

		renderer = new THREE.WebGLRenderer({
			antialias:true,
			premultipliedAlpha: false,
			alpha: true
		});

		renderer.domElement.id = 'YourIDName';

		renderer.sortObjects = true;

		renderer.setPixelRatio(Math.floor(window.devicePixelRatio));
		renderer.setSize( window.innerWidth, window.innerHeight );

		controls = new THREE.DeviceOrientationAndTouchController( camera, CameraParentObject, renderer.domElement, renderer );

		container.appendChild( renderer.domElement );

        moData.createSphericalVideoInScene( mainContentURL, 'contentsphere' );




        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//moData.createPointer2();


        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  This shortcut will be useful for later on down the road...
applyDown = function( obj, key, value ){
  obj[ key ] = value
  if( obj.children !== undefined && obj.children.length > 0 ){
    obj.children.forEach( function( child ){
      applyDown( child, key, value )
    })
  }
}
castShadows = function( obj ){
  applyDown( obj, 'castShadow', true )
}
receiveShadows = function( obj ){
  applyDown( obj, 'receiveShadow', true )
}


var light = new THREE.DirectionalLight( 0xFFFFFF, 1, 1000 )
light.position.set(  1, 100, -0.5 )
light.castShadow = true
light.shadow.mapSize.width  = 2048
light.shadow.mapSize.height = 2048
light.shadow.camera.near    =    1
light.shadow.camera.far     =   1200
scene.add( light )

scene.add( new THREE.HemisphereLight( 0x909090, 0x404040 ))

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        //moData.createCubeGeometry116('./resources/cubemap3.jpg', 'name');
        //moData.createCubeGeometry65('./resources/dagomi_cube_603_edit.mp4', 'name');

        if ( 'getVRDisplays' in navigator ) {

        	document.body.appendChild( WEBVR.createButton( renderer ) );
        	document.body.appendChild( WEBVR.createButton2( renderer ) );

        	startAllVideos(); 

        	navigator.getVRDisplays().then( function ( displays ) 
        	{
				_display = displays;
				haveVrDisplay = true;
				renderer.vr.enabled = true;
				isVRtested = true; 
				ppMMgr.playAll();
			} );
        }
        else
        {
        	startAllVideos();
			isVRtested = true;

			effect = new THREE.StereoEffect(renderer);
			effect.setSize(window.innerWidth, window.innerHeight);

			//controls = new THREE.DeviceOrientationAndTouchController(camera, CameraParentObject, renderer.domElement, renderer);
        }

		Reticulum.init(camera, {
			proximity: false,
			clickevents: true,
			reticle: {
				visible: false,
				restPoint: 50, //Defines the reticle's resting point when no object has been targeted
				color: 0xffff00,
				innerRadius: 0.0004,
				outerRadius: 0.003,
				hover: {
					color: 0x13ec56,
					innerRadius: 0.02,
					outerRadius: 0.024,
					speed: 5,
					vibrate: 50 //Set to 0 or [] to disable
				}
			},
			fuse: {
				visible: false,
				duration: 3,
				color: 0x4669a7,
				innerRadius: 0.045,
				outerRadius: 0.06,
				vibrate: 100, //Set to 0 or [] to disable
				clickCancelFuse: false //If users clicks on targeted object fuse is canceled
			}
		});

	}

	var WEBVR = {

		button1: undefined,
		button2: undefined,

		createButton: function ( renderer ) {

			function showEnterVR( display ) {

				button.style.display = '';

				button.style.cursor = 'pointer';
				button.style.left = 'calc(50% - 110px)';
				button.style.width = '100px';

				button.textContent = 'VR';

				button.onmouseenter = function () { button.style.opacity = '1.0'; button.style.color = '#ff0'; button.style.border = '2px solid #ff0';};
				button.onmouseleave = function () { button.style.opacity = '0.8'; button.style.color = '#fff'; button.style.border = '2px solid #fff';};

				button.onclick = function () {

					button1.style.display = 'none';
					button2.style.display = 'none';

					ppMMgr.playAll();

					//controls = new THREE.DeviceOrientationAndTouchController( camera, CameraParentObject, renderer.domElement, renderer );

					display.isPresenting ? display.exitPresent() : display.requestPresent( [ { source: renderer.domElement } ] ).then(
						function () { 
							isVRtested=true; 
							_isHMD = true; 	
							createMenus();						
						});
				};

				renderer.vr.setDevice( display );

			}

			if ( 'getVRDisplays' in navigator ) {

				var button = document.createElement( 'button' );
				button.style.display = 'none';

				stylizeElement( button );

				window.addEventListener( 'vrdisplayconnect', function ( event ) {

					showEnterVR( event.display );

				}, false );

				window.addEventListener( 'vrdisplaypresentchange', function ( event ) {
					
					//if (!event.display.isPresenting) window.history.back();
					if (event.display) {
						button.textContent = event.display.isPresenting ? 'EXIT VR' : 'ENTER VR';

						if (!event.display.isPresenting) location.reload();
					}

				}, false );

				window.addEventListener( 'vrdisplayactivate', function ( event ) {

					event.display.requestPresent( [ { source: renderer.domElement } ] ).then(function () { isVRtested = true; startAllVideos(); });

				}, false );


				navigator.getVRDisplays()
					.then( function ( displays ) {

						_display = displays;

						if ( displays.length > 0 && menuType != "Traditional") 
						{
							showEnterVR( displays[ 0 ] );
						}
						else
						{
							//controls = new THREE.DeviceOrientationAndTouchController( camera, CameraParentObject, renderer.domElement, renderer );
							createMenus();	

						}
					} );

				button1 = button;

				return button;

			}
		},

		createButton2: function ( renderer ) {

			function showEnterVR() {

				button.style.display = '';

				button.style.cursor = 'pointer';
				button.style.left = 'calc(50% + 10px)';
				button.style.width = '100px';

				button.textContent = 'NO VR';

				button.onmouseenter = function () { button.style.opacity = '1.0'; button.style.color = '#ff0'; button.style.border = '2px solid #ff0';};
				button.onmouseleave = function () { button.style.opacity = '0.8'; button.style.color = '#fff'; button.style.border = '2px solid #fff';};

				button.onclick = function () {

					button1.style.display = 'none';
					button2.style.display = 'none';

					ppMMgr.playAll();

					//controls = new THREE.DeviceOrientationAndTouchController( camera, CameraParentObject, renderer.domElement, renderer );
					
					isVRtested=true; 
					//startAllVideos(); 
					_isHMD = false; 

					createMenus();

				};
			}

			var button = document.createElement( 'button' );
			button.style.display = 'none';

			stylizeElement( button );


			if ( 'getVRDisplays' in navigator ) {

				navigator.getVRDisplays().then( function ( displays ) 
				{
					if ( displays.length > 0 && menuType != "Traditional") 
					{
						showEnterVR();
					}
				} );

				button2 = button;

				return button;
			}

		}
	};
}

function stylizeElement( element ) 
{
	element.style.position = 'absolute';
	element.style.bottom = '200px';
	element.style.padding = '12px 6px';
	element.style.border = '2px solid #fff';
	element.style.borderRadius = '4px';
	element.style.background = '#000';
	element.style.color = '#fff';
	element.style.font = 'bold 24px sans-serif';
	element.style.textAlign = 'center';
	element.style.opacity = '0.8';
	element.style.outline = 'none';
	element.style.zIndex = '999';
}

function createMenus ()
{
	    switch ( menuType )
    {
        case "LS_button":
        default:
            MenuManager.createMenu(true);
            break;
        case "LS_area":
            MenuManager.createMenu(false);
            break;
        case "Traditional":

        /*    var menuTrad = MenuManager.createMenuTrad();
            interController.addInteractiveObject(menuTrad);*/
			//var InteraInteractiveElement = export('../js/Models/InteraInteractiveElementModel.js')
            var data = {

	            "width": 50,
				"height" :10,
				"name" : "test",
				"type": "text",
				"value" :"This is a test button",
				"color" :0xffffff,
				"textSize": 15,
				"disabled" :false,
				"position" :new THREE.Vector3(0,0, -15),
				"interactiveArea": new THREE.Mesh( new THREE.PlaneGeometry(10, 10), new THREE.MeshBasicMaterial({visible: false})),
				"onexecute" : function(){ return console.log("This is a test button"); }
            }

            var button = new InteractiveElement(data);

            console.log(button)

            break;
    }
}
