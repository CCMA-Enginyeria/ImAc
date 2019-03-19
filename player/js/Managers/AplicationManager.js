
var camera;
var scene;
var controls;
var rendertime = 0;

function AplicationManager()
{
    var renderer;
    var _display;

    var mouse3D = new THREE.Vector2( 0, 0 );

    var button_1;
    var button_2;

    this.getRenderer = function() { return renderer };

    function initWorld()
    {
    	camera = new THREE.PerspectiveCamera( 60.0, window.innerWidth / window.innerHeight, 1, 1000 );
        camera.name = 'perspectivecamera';
		scene = new THREE.Scene();
        scene.add( camera );
    }

    function initRenderer()
    {
    	renderer = new THREE.WebGLRenderer({
			antialias: true,
			premultipliedAlpha: false,
			alpha: true
		});

		renderer.domElement.id = 'WebGLRenderer';
		renderer.sortObjects = true;
		renderer.setPixelRatio( Math.floor( window.devicePixelRatio ) );
		renderer.setSize( window.innerWidth, window.innerHeight );
    }

    this.autopos = function(isdImac)
    {
        renderer.vr.setCameraOrientation( camera.quaternion,isdImac )
    };

    // Used when autopositioning is activated
    this.enableVR = function()
    {
    	renderer.vr.setDevice( _display[ 0 ] );
    };

    this.disableVR = function()
    {
    	renderer.vr.setDevice( null );
    };

    this.disableVRButtons = function()
    {
    	button_1.style.display = 'none';
		button_2.style.display = 'none';
    };

    this.setVRButton1 = function(button)
    {
    	button_1 = button;
    };

    this.setVRButton2 = function(button)
    {
    	button_2 = button;
    };

    this.getDisplays = function()
    {
    	return _display;
    };

    this.setDisplays = function(displays)
    {
    	_display = displays;
    };

	function activateLogger()
	{
		if ( loggerActivated )
		{
			setInterval(function(){
				statObj.add( new StatElements() );
			}, 500);
		}
	}

    function render()
    {
        /*var time =  performance.now();
        console.log( time - rendertime )
        rendertime = time;*/

    	THREE.VRController.update()
    	if ( controls ) controls.update();
    	renderer.render( scene, camera );

    	_AudioManager.updateRotationMatrix( camera.matrixWorld.elements );

    	if( THREE.VRController.getTouchPadState() && _isHMD ) 
    	{			
			// afegir contador per a obrir el menu despres de fer 5 clicks
            interController.checkInteraction( mouse3D, camera, 'onDocumentMouseDown' );
		}
        if ( _isHMD && subController.getSubtitleEnabled() )
        {
            subController.updateSTRotation();
        }
        if ( _isHMD && subController.getSignerEnabled() )
        {
            subController.updateSLRotation();
        }

		subController.updateRadar();

		Reticulum.update();
    }

    this.init = function()
    {
        console.log('Init AplicationManager')
			
		var container = document.getElementById( 'container' );
	
        initWorld();
		initRenderer();

        controls = new THREE.DeviceOrientationAndTouchController( camera, renderer.domElement, renderer );

		container.appendChild( renderer.domElement );

		_moData.createOpenMenuMesh();

        scene.add( _moData.getSphericalVideoMesh( 100, mainContentURL, 'contentsphere' ) )
		//_moData.createCastShadows();


////////////////////////////////////////////////////////////////////////////

//_moData.expText()
/////////////////////////////////////////////////////////////////////////////////////////////////////////
        if ( 'getVRDisplays' in navigator ) {

            VideoController.init();

        	document.body.appendChild( createVRButton_1( renderer ) );
        	document.body.appendChild( createVRButton_2( renderer ) );

        	navigator.getVRDisplays().then( function ( displays ) 
        	{
				_display = displays;
				renderer.vr.enabled = true;
				activateLogger();
				renderer.animate( render );
			} );
        }
        else alert("This browser don't support VR content");

        initReticulum( camera );

        runDemo();
	};
}