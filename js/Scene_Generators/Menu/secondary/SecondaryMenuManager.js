/**
 * @author isaac.fraile@i2cat.net
 */

 // GLOBALS used: menuDefaultColor, menuElementsZ, menuList, subtitlesLanguagesArray......
 // Used class --> menuData, THREE

THREE.SecondaryMenuManager = function () {


//************************************************************************************
// Private Functions
//************************************************************************************

/**
 * Gets the menu lines.
 *
 * @param      {<type>}  w       { parameter_description }
 * @param      {<type>}  h       { parameter_description }
 * @param      {<type>}  numDiv  The number div
 * @param      {<type>}  rows    The rows
 * @return     {<type>}  The menu lines.
 */
    function getMenuLines(w, h, numDiv, rows)
    {
        var linesMenuGroup = menuData.getVerticalLineDivisions( w, h, menuDefaultColor );
        linesMenuGroup.add( menuData.getHoritzontalLineDivisions( w, h, menuDefaultColor, numDiv, rows ) );

        return linesMenuGroup;
    }

/**
 * { function_description }
 *
 * @param      {number}  w       { parameter_description }
 * @param      {number}  h       { parameter_description }
 * @param      {<type>}  name    The name
 * @return     {<type>}  On menu button.
 */
    function getOnMenuButton(w, h, name)
    {
        var onButton = menuData.getPlaneImageMesh( 22.5, 12.6, './img/menu/toggle_on.png', name, 4 );
        onButton.position.set( -w/3, 3*h/8, menuElementsZ );
        onButton.onexecute = MenuFunctionsManager.getSubOnOffFunc( false );

        return onButton;
    }

/**
 * { function_description }
 *
 * @param      {number}  w       { parameter_description }
 * @param      {number}  h       { parameter_description }
 * @param      {<type>}  name    The name
 * @return     {<type>}  Off menu button.
 */
    function getOffMenuButton(w, h, name)
    {
        var onButton = menuData.getPlaneImageMesh( 22.5, 12.6, './img/menu/toggle_off.png', name, 4 ); 
        onButton.position.set( -w/3, 3*h/8, menuElementsZ );
        onButton.onexecute = MenuFunctionsManager.getSubOnOffFunc( true );

        return onButton;
    }

    function getMenuTextMesh(posY, text, textSize, name, visible, func)
    {
        var menuTextMesh = menuData.getMenuTextMesh( text, textSize, menuDefaultColor, name, func );
        menuTextMesh.position.y = posY;
        menuTextMesh.visible = visible;

        return menuTextMesh;
    }

    function getMenuTitleMesh(posX, size, text, name, setColor=true)
    {
        var title = menuData.getMenuTextMesh( text, size, menuDefaultColor, name );

        if ( setColor ) title.material.color.set( 0xffff00 );
        title.position.x = posX;
        title.position.z = menuElementsZ;

        return title;
    }

    function getMenuDisabledTitleMesh(posX, w, h, img, name)
    {
        var disabledTitle = menuData.getPlaneImageMesh( w, h, img, name, 4 );

        disabledTitle.position.x = posX;
        disabledTitle.position.z = menuElementsZ;

        return disabledTitle;
    }

    function getUpDownMesh(posY, rotZ, name, func)
    {
        var mesh = menuData.getPlaneImageMesh( backgroundChangeMenuButtonWidth*9/32, backgroundChangeMenuButtonHeight*9/16, './img/menu/less_than_icon.png', name, 4 ); 

        mesh.position.y = posY;
        mesh.rotation.z = rotZ;
        mesh.position.z = menuElementsZ;
        mesh.name = name; 
        mesh.onexecute = func;

        return mesh;
    }

    function getImageMesh(posX, w, h, img, iname, name)
    {
        var mesh = menuData.getPlaneImageMesh( w, h, img, iname, 4 ); 

        mesh.position.x = posX;
        mesh.position.z = menuElementsZ;

        if ( iname == menuList[1].buttons[3] ) mesh.rotation.z = Math.PI;

        mesh.name = name; 

        return mesh;
    }

    function getFunctionByElement(name)
    {
        switch ( name )
        {
            case "subtitlesEngButton":
                return MenuFunctionsManager.getSubLanguageFunc( list_contents[demoId].subtitles[0]['en'], name );

            case "subtitlesEspButton":
                return MenuFunctionsManager.getSubLanguageFunc( list_contents[demoId].subtitles[0]['es'], name );

            case "subtitlesGerButton":
                return MenuFunctionsManager.getSubLanguageFunc( list_contents[demoId].subtitles[0]['de'], name );

            case "subtitlesCatButton":
                return MenuFunctionsManager.getSubLanguageFunc( list_contents[demoId].subtitles[0]['ca'], name );

            case "subtitlesEasyOn":
                return MenuFunctionsManager.getSubEasyOnOffFunc( true, name );

            case "subtitlesEasyOff":
                return MenuFunctionsManager.getSubEasyOnOffFunc( false, name );

            case "subtitlesTopButton":
                return MenuFunctionsManager.getSubPositionFunc( 1, name );

            case "subtitlesBottomButton":
                return MenuFunctionsManager.getSubPositionFunc( -1, name );

            case "subtitlesSemitrans":
                return MenuFunctionsManager.getSubBackgroundFunc( 0.8, name );

            case "subtitlesOutline":
                return MenuFunctionsManager.getSubBackgroundFunc( 0, name );

            case "subtitlesSmallSizeButton":
                return MenuFunctionsManager.getSubSizeFunc( 0.6, name );

            case "subtitlesMediumSizeButton":
                return MenuFunctionsManager.getSubSizeFunc( 0.8, name );

            case "subtitlesLargeSizeButton":
                return MenuFunctionsManager.getSubSizeFunc( 1, name );

            case "subtitlesIndicatorNoneButton":
                return MenuFunctionsManager.getSubIndicatorFunc( "none", name );

            case "subtitlesIndicatorArrowButton":
                return MenuFunctionsManager.getSubIndicatorFunc( "arrow", name );

            case "subtitlesIndicatorRadarButton":
                return MenuFunctionsManager.getSubIndicatorFunc( "compass", name );

            case "subtitlesSmallAreaButton":
                return MenuFunctionsManager.getSubAreaFunc( 50, name );

            case "subtitlesMediumAreaButton":
                return MenuFunctionsManager.getSubAreaFunc( 60, name );

            case "subtitlesLargeAreaButton":
                return MenuFunctionsManager.getSubAreaFunc( 70, name );

            default: 
                return undefined;
        }
    }

    function createDropdownSubMenu(w, h, subMenuData, dataArray)
    {
        var secondColumGroup = new THREE.Group();
        var subMenuDataLength = subMenuData.buttons.length;

        var secondColumnLines = menuData.getHoritzontalLineDivisions( w, h, menuDefaultColor, subMenuDataLength, 2 );
        
        secondColumGroup.add( secondColumnLines );
        subMenuData.buttons.forEach(function( elem, index )
        {
            var factor = (index*2)+1;
            var option = menuData.getMenuTextMesh( dataArray[index], subMenuTextSize, menuDefaultColor, elem, getFunctionByElement( elem ) )
            option.position.set( w/3, ( h/2-factor*h/(subMenuDataLength*2) ), menuElementsZ );                    
            
            // CHANGE TO A SEPARATE FUNCTION
            if ( settingsLanguage == elem 
                || subtitlesLanguage == elem 
                || subtitlesEasy == elem 
                || subtitlesPosition == elem 
                || subtitlesSize == elem 
                || subtitlesIndicator == elem
                || subtitlesBackground == elem
                || subtitlesArea == elem   ) 
            {
                option.material.color.set( menuButtonActiveColor ); 
            }
            
            secondColumGroup.add( option ); 
        })

        secondColumGroup.position.z = menuElementsZ;
        secondColumGroup.name = subMenuData.name;
        secondColumGroup.visible = false;

        return secondColumGroup;
    }

//////////////////////////////
//       Subtitles
//////////////////////////////

    function createSubtitleMenuGroup(w, h, name)
    {
        var menuGroup =  new THREE.Group();

        menuGroup.add( getMenuLines( w, h, 5, 1 ) );

        menuGroup.add( getOnMenuButton( w, h, menuList[6].buttons[0] ) );
        menuGroup.add( getOffMenuButton( w, h, menuList[6].buttons[1] ) );

        menuGroup.add( getUpDownMesh( 7*h/16, -Math.PI/2, menuList[6].buttons[9], MenuFunctionsManager.getSubUpDownFunc( false ) ) );
        menuGroup.add( getUpDownMesh( -7*h/16, Math.PI/2, menuList[6].buttons[10], MenuFunctionsManager.getSubUpDownFunc( true ) ) );

        menuGroup.add( getMenuTextMesh( h/4, 'Languages', 5, menuList[6].buttons[2], true, MenuFunctionsManager.getSubShowDropdownFunc( 0, menuList[6].buttons[2] ) ) );
        menuGroup.add( createDropdownSubMenu( w, h, menuList[6].submenus[0], subtitlesLanguagesArray ) );

        menuGroup.add( getMenuTextMesh( 0, 'Easy read', 5, menuList[6].buttons[3], true, MenuFunctionsManager.getSubShowDropdownFunc( 1, menuList[6].buttons[3] ) ) );
        menuGroup.add( createDropdownSubMenu( w, h, menuList[6].submenus[1], subtitlesEasyArray ) ); //modify array

        menuGroup.add( getMenuTextMesh( -h/4, 'Position', 5, menuList[6].buttons[4], true, MenuFunctionsManager.getSubShowDropdownFunc( 2, menuList[6].buttons[4] ) ) );
        menuGroup.add( createDropdownSubMenu( w, h, menuList[6].submenus[2], subtitlesPositionArray ) );

        menuGroup.add( getMenuTextMesh( -2*h/4, 'Background', 5, menuList[6].buttons[5], false, MenuFunctionsManager.getSubShowDropdownFunc( 3, menuList[6].buttons[5] ) ) );
        menuGroup.add( createDropdownSubMenu( w, h, menuList[6].submenus[3], subtitlesBackgroundArray ) ); //modify array

        menuGroup.add( getMenuTextMesh( -3*h/4, 'Size', 5, menuList[6].buttons[6], false, MenuFunctionsManager.getSubShowDropdownFunc( 4, menuList[6].buttons[6] ) ) );
        menuGroup.add( createDropdownSubMenu( w, h, menuList[6].submenus[4], subtitlesSizeArray ) );

        menuGroup.add( getMenuTextMesh( 3*h/4, 'Indicator', 5, menuList[6].buttons[7], false, MenuFunctionsManager.getSubShowDropdownFunc( 5, menuList[6].buttons[7] ) ) );
        menuGroup.add( createDropdownSubMenu( w, h, menuList[6].submenus[5], subtitlesIndicatorArray ) );

        menuGroup.add( getMenuTextMesh( 2*h/4, 'Area', 5, menuList[6].buttons[8], false, MenuFunctionsManager.getSubShowDropdownFunc( 6, menuList[6].buttons[8] ) ) );
        menuGroup.add( createDropdownSubMenu( w, h, menuList[6].submenus[6], subtitlesSizeArray ) );

        interController.removeInteractiveObject( menuList[4].buttons[0] );
        
        menuGroup.add( getMenuTitleMesh( -w/3, 22, 'ST', menuList[4].buttons[0] ) );
        menuGroup.add( getMenuDisabledTitleMesh( -w/3, 28, 33, './img/menu/disabled_st_icon.png', menuList[4].buttons[4] ) );
    
        menuGroup.name = name;
        menuGroup.visible = false; //Not the first menu. Visibility false.

        return menuGroup;
    }

//////////////////////////////
//       Settings
//////////////////////////////

    function createSettingsMenuGroup(w, h, name)
    {
        var menuGroup =  new THREE.Group();

        menuGroup.add( getMenuLines( w, h, 3, 1 ) );

        menuGroup.add( getImageMesh( -w/3, 34, 34, './img/menu/settings_icon.png', 'right', menuList[3].buttons[0] ) );

        menuGroup.add( getMenuTextMesh( h/3, 'Languages', 5, menuList[5].buttons[0], true ) );
        menuGroup.add( createDropdownSubMenu( w, h, menuList[5].submenus[0], settingsLanguagesArray ) );

        menuGroup.add( getMenuTextMesh( 0, 'Voice control', 5, menuList[5].buttons[1], true ) ); 
        menuGroup.add( createDropdownSubMenu( w, h, menuList[5].submenus[1], settingsVoiceControlArray ) );

        menuGroup.add( getMenuTextMesh( -h/3, 'User Profile', 5, menuList[5].buttons[2], true ) ); 
        menuGroup.add( createDropdownSubMenu( w, h, menuList[5].submenus[2], settingsUserProfileArray ) );
     
        menuGroup.name = name;
        menuGroup.visible = false; //Not the first menu. Visibility false.

        return menuGroup;
    }

    function createSignerMenuGroup(w, h, name)
    {
        var menuGroup =  new THREE.Group();

        menuGroup.add( getMenuLines( w, h, 3, 1 ) );

        menuGroup.add( getOnMenuButton( w, h, menuList[7].buttons[0] ) );
        menuGroup.add( getOffMenuButton( w, h, menuList[7].buttons[1] ) );

        menuGroup.add( getMenuTextMesh( h/3, 'Position', 5, menuList[7].buttons[2], true ) );
        menuGroup.add( createDropdownSubMenu( w, h, menuList[7].submenus[0], subtitlesPositionArray ) );

        menuGroup.add( getMenuTextMesh( 0, 'Indicator', 5, menuList[7].buttons[3], true ) );
        menuGroup.add( createDropdownSubMenu( w, h, menuList[7].submenus[1], subtitlesIndicatorArray ) );

        menuGroup.add( getMenuTextMesh( -h/3, 'Area', 5, menuList[7].buttons[4], true ) );
        menuGroup.add( createDropdownSubMenu( w, h, menuList[7].submenus[2], subtitlesSizeArray ) );

        interController.removeInteractiveObject( menuList[4].buttons[1] );
        
        menuGroup.add( getMenuTitleMesh( -w/3, 22, 'SL', menuList[4].buttons[1] ) );
        menuGroup.add( getMenuDisabledTitleMesh( -w/3, 28, 33, './img/menu/disabled_sl_icon.png', menuList[4].buttons[5] ) );
    
        menuGroup.name = name;
        menuGroup.visible = false; //Not the first menu. Visibility false.

        return menuGroup;
    }

    function createAudioDescriptionMenuGroup(w, h, name)
    {
        var menuGroup =  new THREE.Group();

        menuGroup.add( getMenuLines( w, h, 0, 1 ) );

        menuGroup.add( getOnMenuButton( w, h, menuList[8].buttons[0] ) );
        menuGroup.add( getOffMenuButton( w, h, menuList[8].buttons[1] ) );

        interController.removeInteractiveObject( menuList[4].buttons[2] );
        
        menuGroup.add( getMenuTitleMesh( -w/3, 22, 'AD', menuList[4].buttons[2] ) );
        menuGroup.add( getMenuDisabledTitleMesh( -w/3, 28, 33, './img/menu/disabled_ad_icon.png', menuList[4].buttons[6] ) );
    
        menuGroup.name = name;
        menuGroup.visible = false; //Not the first menu. Visibility false.

        return menuGroup;
    }

    function createAudioSubtMenuGroup(w, h, name)
    {
        var menuGroup =  new THREE.Group();

        menuGroup.add( getMenuLines( w, h, 0, 1 ) );

        menuGroup.add( getOnMenuButton( w, h, menuList[9].buttons[0] ) );
        menuGroup.add( getOffMenuButton( w, h, menuList[9].buttons[1] ) );

        interController.removeInteractiveObject( menuList[4].buttons[3] );
        
        menuGroup.add( getMenuTitleMesh( -w/3, 17, 'AST', menuList[4].buttons[3] ) );
        menuGroup.add( getMenuDisabledTitleMesh( -w/3, 35, 26.4, './img/menu/disabled_ast_icon.png', menuList[4].buttons[7] ) );
    
        menuGroup.name = name;
        menuGroup.visible = false; //Not the first menu. Visibility false.

        return menuGroup;
    }

    function createSettingsCardboardMenu(w, h, name)
    {
        var menuGroup =  new THREE.Group();

        menuGroup.add( getImageMesh( -w/4, 45, 45, './img/menu/settings_icon.png', 'right', menuList[3].buttons[0] ) );
        menuGroup.add( getImageMesh( w/4, 45, 28, './img/menu/cardboard_icon.png', 'right', menuList[3].buttons[1] ) );
    
        menuGroup.name = name;
        menuGroup.visible = false; //Not the first menu. Visibility false.

        return menuGroup;
    }

    function createSettingsCardboardMenuTraditional(w, h, name)
    {
        var menuGroup =  new THREE.Group();

        menuGroup.add( getImageMesh( 19*w/(20*2), 2, 2, './img/menu/settings_icon.png', 'right', menuList[3].buttons[0] ) );
        var c = getImageMesh( 19*w/(20*2), 2, 1.6, './img/menu/cardboard_icon.png', 'right', menuList[3].buttons[1] );
        c.visible = false ;
        menuGroup.add( c );
    
        menuGroup.name = name;

        return menuGroup;
    }

    function createMultiOptionsMenu(w, h, name)
    {
        var menuGroup =  new THREE.Group();

        menuGroup.add( getMenuTitleMesh( -3*w/8, 11, 'ST', menuList[4].buttons[0], false ) );
        menuGroup.add( getMenuDisabledTitleMesh( -3*w/8, 14, 14, './img/menu/disabled_st_icon.png', menuList[4].buttons[4] ) );

        menuGroup.add( getMenuTitleMesh( -w/8, 11, 'SL', menuList[4].buttons[1], false ) );
        menuGroup.add( getMenuDisabledTitleMesh( -w/8, 14, 14, './img/menu/disabled_sl_icon.png', menuList[4].buttons[5] ) );

        menuGroup.add( getMenuTitleMesh( w/8, 11, 'AD', menuList[4].buttons[2], false ) );
        menuGroup.add( getMenuDisabledTitleMesh( w/8, 14, 14, './img/menu/disabled_ad_icon.png', menuList[4].buttons[6] ) );

        menuGroup.add( getMenuTitleMesh( 3*w/8, 11, 'AST', menuList[4].buttons[3], false ) );
        menuGroup.add( getMenuDisabledTitleMesh( 3*w/8, 18, 14, './img/menu/disabled_ast_icon.png', menuList[4].buttons[7] ) );
    
        menuGroup.name = name;
        menuGroup.visible = false; //Not the first menu. Visibility false.

        return menuGroup;
    }

// EXPERIMENTAL
    function createMultiOptionsMenuTraditional(w, h, name)
    {

        var menuGroup =  new THREE.Group();

        menuGroup.add( getMenuTitleMesh( 9*w/(20*2), 1.5, 'ST', menuList[4].buttons[0], false ) );
        var stDis = getMenuDisabledTitleMesh( 5*w/(20*2), 14, 14, './img/menu/disabled_st_icon.png', menuList[4].buttons[4] );
        stDis.visible = false;
        menuGroup.add(stDis );

        menuGroup.add( getMenuTitleMesh( 11*w/(20*2), 1.5, 'SL', menuList[4].buttons[1], false ) );
        var slDis = getMenuDisabledTitleMesh( 7*w/(20*2), 14, 14, './img/menu/disabled_sl_icon.png', menuList[4].buttons[5] );
        slDis.visible = false;
        menuGroup.add( slDis );

        menuGroup.add( getMenuTitleMesh( 13*w/(20*2), 1.5, 'AD', menuList[4].buttons[2], false ) );
        var adDis = getMenuDisabledTitleMesh( 9*w/(20*2), 14, 14, './img/menu/disabled_ad_icon.png', menuList[4].buttons[6] );
        adDis.visible = false;
        menuGroup.add( adDis );

        menuGroup.add( getMenuTitleMesh( 15*w/(20*2), 1.5, 'AST', menuList[4].buttons[3], false ) );
        var astDis = getMenuDisabledTitleMesh( 11*w/(20*2), 18, 14, './img/menu/disabled_ast_icon.png', menuList[4].buttons[7] );
        astDis.visible = false;
        menuGroup.add( astDis );

        return menuGroup;
    }



    function createVolumeChangeMenu(w, h, name)
    {
        var menuGroup =  new THREE.Group();

        menuGroup.add( getImageMesh( 3*w/8, 22.5, 22.5, './img/menu/plus_icon.png', menuList[2].buttons[1], menuList[2].buttons[1] ) );
        menuGroup.add( getImageMesh( 0, 56, 56, './img/menu/volume_mute_icon.png', menuList[2].buttons[3], menuList[2].buttons[3] ) );
        menuGroup.add( getImageMesh( 0, 56, 56, './img/menu/volume_unmute_icon.png', menuList[2].buttons[2], menuList[2].buttons[2] ) );
        menuGroup.add( getImageMesh( -3*w/8, 22.5, 22.5, './img/menu/minus_icon.png', menuList[2].buttons[0], menuList[2].buttons[0] ) );

        menuGroup.add( getMenuTextMesh( 0, AudioManager.getVolume()*100+'%', 18, 'volumeLevel', false ) );

        menuGroup.name = name;
        menuGroup.visible = false; //Not the first menu. Visibility false.

        return menuGroup;
    }

    function createPlaySeekMenu(w, h, name)
    {
        var menuGroup =  new THREE.Group();

        menuGroup.add( getImageMesh( 0, 42.2, 42.2, './img/menu/play_icon.png', menuList[1].buttons[0], menuList[1].buttons[0] ) );
        menuGroup.add( getImageMesh( 0, 42.2, 42.2, './img/menu/pause_icon.png', menuList[1].buttons[1], menuList[1].buttons[1] ) );
        menuGroup.add( getImageMesh( 11*w/32, 22.5, 11.25, './img/menu/seek_icon.png', menuList[1].buttons[3], menuList[1].buttons[3] ) ); // need rotate z PI
        menuGroup.add( getImageMesh( -11*w/32, 22.5, 11.25, './img/menu/seek_icon.png', menuList[1].buttons[2], menuList[1].buttons[2] ) );

        interController.setActiveMenuName( name );

        menuGroup.name = name;

        return menuGroup;
    }


//************************************************************************************
// Public Functions
//************************************************************************************

    this.showMultiOptionsButtons = function(menuIndexArray)
    {
        for ( var i = 0; i < menuIndexArray.length; i++ )
        {
            if( menuList[menuIndexArray[i][0]].isEnabled )
            {
                scene.getObjectByName( menuList[menuList[menuIndexArray[i][0]].firstmenuindex].buttons[menuIndexArray[i][1]] ).visible = true; //menuList.
                scene.getObjectByName( menuList[menuList[menuIndexArray[i][0]].firstmenuindex].buttons[menuIndexArray[i][2]] ).visible = false; //menuList.
            }
            else
            {
                scene.getObjectByName( menuList[menuList[menuIndexArray[i][0]].firstmenuindex].buttons[menuIndexArray[i][1]] ).visible = false; //menuList.
                scene.getObjectByName( menuList[menuList[menuIndexArray[i][0]].firstmenuindex].buttons[menuIndexArray[i][2]] ).visible = true; //menuList.
            }
        }
    }

    this.createLSMenus = function(backgroundmenu)
    {
        var w = backgroundmenu.geometry.parameters.width;
        var h = backgroundmenu.geometry.parameters.height;

        backgroundmenu.add( createPlaySeekMenu( w, h, menuList[1].name ) );
        backgroundmenu.add( createVolumeChangeMenu( w, h, menuList[2].name ) );
        backgroundmenu.add( createSettingsCardboardMenu( w, h, menuList[3].name ) );
        backgroundmenu.add( createMultiOptionsMenu( w, h, menuList[4].name ) );

        backgroundmenu.add( createSettingsMenuGroup( w, h, menuList[5].name ) );
        backgroundmenu.add( createSubtitleMenuGroup( w, h, menuList[6].name ) );
        backgroundmenu.add( createSignerMenuGroup( w, h, menuList[7].name ) );
        backgroundmenu.add( createAudioDescriptionMenuGroup( w, h, menuList[8].name ) );
        backgroundmenu.add( createAudioSubtMenuGroup( w, h, menuList[9].name ) );
     
    };


// EXPERIMENTAL
    this.createSecondaryMenusTraditional = function(backgroundmenu)
    {
        var w = backgroundmenu.geometry.parameters.width;
        var h = backgroundmenu.geometry.parameters.height;

        backgroundmenu.add( createMultiOptionsMenuTraditional(w,h, "multiOptionsTrad") );
        backgroundmenu.add( createSettingsCardboardMenuTraditional(w,h, "settingsCardboardTrad") );
            
    };
}

THREE.SecondaryMenuManager.prototype.constructor = THREE.SecondaryMenuManager;