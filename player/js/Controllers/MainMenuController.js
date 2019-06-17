/**
 * The MainMenuController is the one in charge of the initialitzacion and update of the main menu elements:
 *      -   Play, pause and seek.
 *      -   Volume level.
 *      -   Settings and Preview.
 *      -   Accessibility options.
 *      -   Video progress bar.
 *      
 * The controller has some functions which are shared by all the different group elements.
 *      - Init()
 *      - Exit()
 *      - GetData()
 *      - AddVisualFeedbackOnClick()
 *      
 * For each element group we have individual functions:
 *      - PlayPause:
 *          · UpdatePlayPauseData()
 *          · updatePlayOutTime()
 *          · pauseAllFunc()
 *          · playAllFunc()
 *          · PlayPauseFunc()
 *          · SeekFunc()
 *          
 *      - Volume:
 *          · UpdateVolumeData()
 *          · ChangeVolumeFunc() 
 *          · MuteUnmuteVolumeFunc() 
 *          · volumeLevelDisplayLogic()
 *          
 *      - Settings:
 *          · UpdateSettingsData()
 *          
 *      - Access:
 *          · UpdateAccessOptionsData():
 *          . updateAccessOptionsView()
 *          
 *      - VPB:
 *          · UpdateVideoProgressBarData():
 *          · setSeekingProcess() 
 *          · getSeekingProcess()
 *          · updatePlayProgressBar()
 *          · onClickSeek()
 *          · updatePlayProgressPosition() 
 *          · updateSliderPosition() 
 *          · updatePlayProgressScale()
 *          
 * @class      MainMenuController (name)
 */
function MainMenuController() {

    let data;
	let playPauseView;
    let volumeView;
    let settingsView;
    let accessOptionsView;
    let videoProgressBarView;
	let viewStructure;

    let PlayPauseMemory = false;
    let isSeeking;

    /**
     * This function initializes and update all the datat and views of the different groups that compose the main menu.
     *
     * @function      Init (name)
     */
    this.Init = function(){
        mainMenuCtrl.setSeekingProcess(false);

		data = GetData();

		UpdatePlayPauseData();
        UpdateVolumeData();
        UpdateSettingsData();
        UpdateAccessOptionsData();
        UpdateVideoProgressBarData();

        data.isPreviewVisible = false;

		viewStructure = scene.getObjectByName(data.name);
		viewStructure.visible = true;

		playPauseView = new PlayPauseMenuView();
        playPauseView.UpdateView(data);

        volumeView = new VolumeMenuView();
        volumeView.UpdateView(data);

        settingsView = new SettingsMenuView();
        settingsView.UpdateView(data);

        accessOptionsView = new AccessibilityOptionsMenuView();
        accessOptionsView.UpdateView(data);

        videoProgressBarView = new VideoProgressBarView();
        videoProgressBarView.UpdateView(data);

        menuMgr.AddInteractionIfVisible(viewStructure);
	};

    /**
     * This function 'closes' the submenu page.
     * Removes all the interactive elements from the 'interactiveListObjects' array stated in Managers/InteractionsController.js
     * Hides the viewStructure.
     * This function is called when closing the menu.
     *
     * @function      Exit (name)
     */
    this.Exit = function(){
        //Works if the viewStructure is loaded.
        menuMgr.setOptActiveIndex(0); //SettingsController

        if(viewStructure){
            viewStructure.visible = false;
            viewStructure.children.forEach(function(intrElement){
                interController.removeInteractiveObject(intrElement.name);
            });
        }
    };

    /**
     * Gets the data.
     *
     * @function      GetData (name)
     * @return     {PlayPauseMenuModel}  The data.
     */
    function GetData(){
        if (data == null){
            data = new MainMenuModel();
        }
        return data;
    };
        /**
     * Adds a visual feedback on click.
     *
     * @function      AddVisualFeedbackOnClick (name)
     * @param      {<type>}    buttonName  The button name
     * @param      {Function}  callback    The callback
     */
    function AddVisualFeedbackOnClick(view, buttonName, callback){
        data.clickedButtonName = buttonName;
        view.pressButtonFeedback(data);
        setTimeout(callback, 300);
    };


    /**
     * This function updates the data in the PlayPause group. 
     * It adds the functions to the different interactive elements (Play, Pause, Seek and Close buttons).
     *
     * @function      UpdatePlayPauseData (name)
     */
	function UpdatePlayPauseData(){
        data.isPaused = VideoController.isPausedById(0);
        data.playpauseMenuButtonFunc = function(){ AddVisualFeedbackOnClick(playPauseView, VideoController.isPausedById(0) ? 'play-button' : 'pause-button', function(){ PlayPauseFunc()} )};
        data.seekForwardMenuButtonFunc = function(){ AddVisualFeedbackOnClick(playPauseView, 'forward-seek-button',  function(){ SeekFunc(true)} )};
        data.seekBackMenuButtonFunc = function(){ AddVisualFeedbackOnClick(playPauseView, 'back-seek-button',  function(){ SeekFunc(false)} )};
        data.closeMenuButtonFunc = function(){ AddVisualFeedbackOnClick(playPauseView, 'close-button', function(){ menuMgr.ResetViews()} )};
    };

    /**
     * This function updates the data in the Volume group. 
     * Adds the value of the volume level and its visibility.
     * It adds the functions to the different interactive elements (Mute/Unmute, plus and minus buttons).
     *
     * @function      UpdateVolumeData (name)
     */
    function UpdateVolumeData(){
        data.volumeLevel = _AudioManager.getVolume()*100+'%';
        data.isVolumeLevelVisible = false;
        data.isMuted = _AudioManager.isAudioMuted();
        data.muteUnmuteMenuButtonFunc = function(){ AddVisualFeedbackOnClick(volumeView, _AudioManager.isAudioMuted() ? 'unmute-volume-button' : 'mute-volume-button', function(){ MuteUnmuteVolumeFunc()} )};
        data.plusVolumeMenuButtonFunc = function(){ AddVisualFeedbackOnClick(volumeView, 'plus-volume-button', function(){ ChangeVolumeFunc(true)} )};
        data.minusVolumeMenuButtonFunc = function(){ AddVisualFeedbackOnClick(volumeView, 'minus-volume-button', function(){ ChangeVolumeFunc(false)} )};
    };

    /**
     * This function updates the data in the Settings group. 
     * It adds the functions to the different interactive elements (Settings, preview and menuType buttons).
     *
     * @function      UpdateSettingsData (name)
     */
    function UpdateSettingsData(){
        data.openSettingsMenuButtonFunc = function(){ 
            AddVisualFeedbackOnClick(settingsView, 'settings-button', function(){
                if( menuMgr.getMenuType() == 1) {
                    menuMgr.ResetViews();
                    if( scene.getObjectByName( "pointer2" ) && _isHMD ){
                        scene.getObjectByName( "pointer2" ).visible = true;
                    }else if( scene.getObjectByName( "pointer" ) && _isHMD ) {
                        scene.getObjectByName( "pointer" ).visible = true;
                        scene.getObjectByName('pointer').scale.set(1*_pointerSize,1*_pointerSize,1*_pointerSize)
                    }
                }
                menuMgr.Load(SettingsOptionCtrl)
            });
        };
        data.previewButtonFunc = function(){ AddVisualFeedbackOnClick(settingsView, 'preview-button', function(){menuMgr.OpenPreview()} )};
        data.menuTypeButtonFunc = function(){ AddVisualFeedbackOnClick(settingsView, menuMgr.getMenuType() == 2 ? 'enhanced-menu-button' :'traditional-menu-button', function(){ MenuFunctionsManager.getChangeMenuTypeFunction()} )};
    }

    /**
     * This function updates the data in the AccessOptions group. 
     * Adds the functions to the different interactive elements (Subtitles, Sign Language, Audio Description and Audio Subtitle buttons).
     * Checks for the availability of the services. In case of unavailability the view will disable the button.
     *
     * @function      UpdateAccessOptionsData (name)
     */
    function UpdateAccessOptionsData(){
        //Save the state of all the accessibility services.
        //In case the services is unavailable the button will be disabled and shown in grey.
        data.isSTenabled = subController.getSubtitleEnabled();
        data.isSLenabled = subController.getSignerEnabled();
        data.isADenabled = _AudioManager.getADEnabled();
        data.isASTenabled = _AudioManager.getASTEnabled();

        //Save the state of availability of all the accessibility services.
        data.isSTavailable = subController.checkisSubAvailable();
        data.isSLavailable = subController.checkisSignAvailable();
        data.isADavailable = _AudioManager.checkisADAvailable();
        data.isASTavailable = _AudioManager.checkisASTAvailable();

        //SUBTITLES
        data.subtitlesButtonFunc =  function() {
            AddVisualFeedbackOnClick(accessOptionsView, data.isSTenabled ? 'show-st-button' : 'disable-st-button', function(){
                //Change the state of the subtiles from enabled to disabled and viceversa.
                data.isSTenabled = !data.isSTenabled;
                subController.switchSubtitles(data.isSTenabled);
                
                accessOptionsView.UpdateAccessibilityOptionsIconStatusView(data);
                // Add interactivity to visible elements and remove interactivity to none visible elements.
                menuMgr.AddInteractionIfVisible(viewStructure);
                //If subtitles are disabled signer goes back to bottom position.
                subController.setSignerPosition( subController.getSignerPosition().x, data.isSTenabled ? subController.getSubPosition().y : -1 );
            });
        };

        //SIGN LANGUAGE
        data.signlanguageButtonFunc = function() {
            AddVisualFeedbackOnClick(accessOptionsView, data.isSLenabled ? 'show-sl-button' : 'disable-sl-button',function(){
                //Change the state of the signer from enabled to disabled and viceversa.
                data.isSLenabled = !data.isSLenabled;
                subController.switchSigner(data.isSLenabled);
                
                accessOptionsView.UpdateAccessibilityOptionsIconStatusView(data);
                // Add interactivity to visible elements and remove interactivity to none visible elements.
                menuMgr.AddInteractionIfVisible(viewStructure);
            });
        };

        //AUDIO DESCRIPTION
        data.audioDescriptionButtonFunc = function() {
            AddVisualFeedbackOnClick(accessOptionsView, data.isADenabled ? 'show-ad-button' : 'disable-ad-button',function(){
                //Change the state of the audio description from enabled to disabled and viceversa.
                data.isADenabled = !data.isADenabled;
                _AudioManager.switchAD(data.isADenabled);
                
                accessOptionsView.UpdateAccessibilityOptionsIconStatusView(data);
                // Add interactivity to visible elements and remove interactivity to none visible elements.
                menuMgr.AddInteractionIfVisible(viewStructure);
            });
        };

        //AUDIO SUBTITLES
        data.audioSubtitlesButtonFunc = function() {
            AddVisualFeedbackOnClick(accessOptionsView, data.isASTenabled ? 'show-ast-button' : 'disable-ast-button', function(){
                //Change the state of the audio subtitles from enabled to disabled and viceversa.
                data.isASTenabled = !data.isASTenabled;
                _AudioManager.switchAST(data.isASTenabled);
                
                accessOptionsView.UpdateAccessibilityOptionsIconStatusView(data);
                // Add interactivity to visible elements and remove interactivity to none visible elements.
                menuMgr.AddInteractionIfVisible(viewStructure);
            });
        };
    }

    /**
     * This function updates the data in the Video progress bar group. 
     * Updates the time and position of the slidder in the progress bar. 
     * Updates the scale in the X axes of the played time bar. 
     *
     * @function      UpdateVideoProgressBarData (name)
     */
    function UpdateVideoProgressBarData(){
        data.videoPlayOutTimeText = VideoController.getPlayoutTime(VideoController.getListOfVideoContents()[0].vid.currentTime);
        data.playScaleX  = updatePlayProgressScale();
        data.sliderPositionX = updateSliderPosition();
        data.playPositionX = updatePlayProgressPosition();
    }




/*-----------------------------------------------------------------------
                    PlayPause controller functions
-----------------------------------------------------------------------*/

    /**
     * This function update the playout time and if the view is visible updates the view.
     */
    this.updatePlayOutTime = function(){
        UpdatePlayPauseData();
        if (playPauseView) playPauseView.UpdateView(data);
    };

    /**
     * This function plays or pasues the video depending on the previous state.
     * Updates the data and the view.
     */
    this.pauseAllFunc = function(){
        PlayPauseMemory = true;
        VideoController.pauseAll();
        UpdatePlayPauseData();
        playPauseView.UpdateView(data);
        menuMgr.AddInteractionIfVisible(viewStructure);
    };

    /**
     * { function_description }
     *
     * @function   playAllFunc (name)
     */
    this.playAllFunc = function(){
        if ( PlayPauseMemory ){
            PlayPauseMemory = false;
            VideoController.playAll();
            UpdatePlayPauseData();
            playPauseView.UpdateView(data);
        }
    };

    /**
     * { function_description }
     *
     * @function      PlayPauseFunc (name)
     */
    function PlayPauseFunc(){
        VideoController.isPausedById(0) ? VideoController.playAll() : VideoController.pauseAll();
        UpdatePlayPauseData();
        playPauseView.UpdateView(data);
        menuMgr.AddInteractionIfVisible(viewStructure);
    };

    /**
     * { function_description }
     *
     * @function      SeekFunc (name)
     * @param      {number}  plus    The plus
     */
    function SeekFunc(plus){
        var sign = plus ? 1 : -1;
        VideoController.seekAll( 5*sign );
        UpdatePlayPauseData();
        playPauseView.UpdateView(data);
    };

/*-----------------------------------------------------------------------
                    Volume controller functions
-----------------------------------------------------------------------*/

    /**
     * { function_description }
     *
     * @function      ChangeVolumeFunc (name)
     * @param      {number}  plus    The plus
     */
    function ChangeVolumeFunc(plus){
        let sign = plus ? 1 : -1;
        _AudioManager.changeVolume( 0.1*sign );
        volumeLevelDisplayLogic();
    };

    /**
     * [MuteUnmuteVolumeFunc description]
     * @function
     */
    function MuteUnmuteVolumeFunc(){
        _AudioManager.isAudioMuted() ? _AudioManager.setunmute() : _AudioManager.setmute();
        UpdateVolumeData();
        volumeView.UpdateView(data);
        menuMgr.AddInteractionIfVisible(viewStructure);
    };

    /**
     * [volumeLevelDisplayLogic description]
     * @function
     * @return {[type]} [description]
     */
    function volumeLevelDisplayLogic(){
        data.volumeLevel = _AudioManager.getVolume();
        data.isVolumeLevelVisible =  true;
        volumeView.UpdateView(data);

        setTimeout(function(){
           (_AudioManager.getVolume()>0) ? _AudioManager.setunmute() : _AudioManager.setmute();
           data.isMuted = _AudioManager.isAudioMuted();
           data.isVolumeLevelVisible =  false;
           volumeView.UpdateView(data);
        }, 500);
    };

/*-----------------------------------------------------------------------
                    Access Options controller functions
-----------------------------------------------------------------------*/
    
    /**
     * { function_description }
     */
    this.updateAccessOptionsView = function(){

        data.isSTenabled = subController.getSubtitleEnabled();
        data.isSLenabled = subController.getSignerEnabled();
        data.isADenabled = _AudioManager.getADEnabled();
        data.isASTenabled = _AudioManager.getASTEnabled();

        data.isSTavailable = subController.checkisSubAvailable();
        data.isSLavailable = subController.checkisSignAvailable();
        data.isADavailable = _AudioManager.checkisADAvailable();
        data.isASTavailable = _AudioManager.checkisASTAvailable();

        accessOptionsView.UpdateView(data);
        //After the view is updated refresh the list of interctive elements depending on visibility.
        menuMgr.AddInteractionIfVisible(viewStructure);
    }


/*-----------------------------------------------------------------------
                Video progress bar controller functions
-----------------------------------------------------------------------*/
    /**
     * Sets the seeking process.
     *
     * @param      {<type>}  value   The value
     */
    this.setSeekingProcess = function(value){
        isSeeking = value;
    }

    /**
     * Gets the seeking process.
     *
     * @return     {<type>}  The seeking process.
     */
    this.getSeekingProcess = function(){
        return isSeeking;
    }

    /**
     * { function_description }
     */
    this.updatePlayProgressBar = function(){
        UpdateVideoProgressBarData();
        if (videoProgressBarView) videoProgressBarView.UpdateView(data);
    }

    /**
     * This function when the users click in the progress bar it seeks the video to the click position.
     *
     * @param      {<type>}  mouse3D  The mouse 3d
     */
    this.onClickSeek = function(mouse3D){
        if(!mainMenuCtrl.getSeekingProcess()){
            mainMenuCtrl.setSeekingProcess(true);
            
            const h = (Math.tan(30*Math.PI/180)*67)*2;
            const w = h*window.innerWidth/window.innerHeight;
            let norm_vpb_w = (4*menuWidth/5) / (w/2);
            let slider_position_norm = scene.getObjectByName('slider-progress').position.x / (w/2);
            let time_diff = mouse3D.x - slider_position_norm;

            if(Math.round(time_diff*100) != 0){
                let new_seek_time = Math.round(VideoController.getListOfVideoContents()[0].vid.duration*time_diff/(norm_vpb_w));
                VideoController.seekAll(new_seek_time);
            } else console.log("You clicked over the slidder");
        } else console.log("Seeking process running");
    }

    /**
     * { function_description }
     *
     * @return     {<type>}  { description_of_the_return_value }
     */
    function updatePlayProgressPosition(){
        const play_progress =  scene.getObjectByName("play-progress");
        if( ! play_progress.geometry.boundingBox ) {
            play_progress.geometry.computeBoundingBox();
        }
        let widthCurrent = play_progress.geometry.boundingBox.max.x - play_progress.geometry.boundingBox.min.x;
        return (-widthCurrent + widthCurrent * data.playScaleX) / 2  + menuWidth/200;
    }

    /**
     * This function calculates the new position of the slider depending on the current video time over the total video length.
     *
     * @return     {number}  { New posistion of the slider }
     */
    function updateSliderPosition(){
        const progress_width = scene.getObjectByName("background-progress").geometry.parameters.shapes.currentPoint.x;
        return progress_width + (4*menuWidth/5)*data.playScaleX;
    }

    /**
     * Returns the percentage of video reproduced.
     *
     * @return     {number}  { video percentage reproduced }
     */
    function updatePlayProgressScale(){
        const totalTime = VideoController.getListOfVideoContents()[0].vid.duration;
        let playoutTime = VideoController.getListOfVideoContents()[0].vid.currentTime;
        let newPorgressWidth = (playoutTime)/totalTime;

        if(newPorgressWidth) return newPorgressWidth;
        else return 0;
    }
}