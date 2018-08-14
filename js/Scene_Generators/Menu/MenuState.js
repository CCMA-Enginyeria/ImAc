var _isTradMenuOpen = false;
var menuAngle = 0;
var isUserInSecondLevelMenus = false;
var submenuNameActive;
var firstColumnActiveButton;
var secondColumnActiveButton;

var initialVolumeLevel = 0.5;

var settingsLanguage = 'settingsLanguageEngButton';

var isSubtitlesActive = true;
var isSignLanguageActive = true;
var isAudioDescriptionActive = true;
var isAudioSubtitleActive = true;

var subtitlesLanguage = 'subtitlesEngButton';
var subtitlesPosition = 'subtitlesBottomButton';
var subtitlesSize = 'subtitlesLargeSizeButton';
var subtitlesIndicator = 'subtitlesIndicatorNoneButton';
var subtitlesEasy = 'subtitlesEasyOff';
var subtitlesBackground = 'subtitlesSemitrans';
var subtitlesArea = 'subtitlesLargeAreaButton'; 



//*******************************************************************************************************
//
//                              M E N U       S T R U C T U R E 
// 
//*******************************************************************************************************

var multiOptionsMainSubMenuIndexes = [[6,0,4],[7,1,5],[8,2,6],[9,3,7]];

var numberFirstLevelMenus = 5;
var menuList = 
    [
/*0*/   { 
            name: 'backgroudMenu', 
            buttons: 
            [
                'closeMenuButton', 
                'forwardMenuButton', 
                'backMenuButton'
            ]
        },                                     
/*1*/   { 
            name: 'playSeekMenu', 
            buttons: 
            [
                'playButton', 
                'pauseButton', 
                'backSeekButton', 
                'forwardSeekButton'
            ]
        },                            
/*2*/   { 
            name: 'volumeChangeMenu', 
            buttons: 
            [
                'minusVolumeButton', 
                'plusVolumeButton', 
                'unmuteVolumeButton', 
                'muteVolumeButton'
            ]
        },         
/*3*/   { 
            name: 'settingsCardboardMenu', 
            buttons: 
            [
                'settingsButton', 
                'cardboardButton'
            ]
        }, 
/*4*/   { 
            name: 'multiOptionsMenu', 
            buttons: 
            [
                'showSubtitlesMenuButton',
                'showSignLanguageMenuButton', 
                'showAudioDescriptionMenuButton', 
                'showAudioSubtitlesMenuButton',
                'disabledSubtitlesMenuButton',
                'disabledSignLanguageMenuButton', 
                'disabledAudioDescriptionMenuButton', 
                'disabledAudioSubtitlesMenuButton'
            ]
        }, 

// SECOND LEVEL MENUS

/*5*/   { 
            name: 'settingsMenu', isEnabled: true, firstmenuindex: 3, 
            submenus:
            [
                { 
                    name:'settingsLanguages', 
                    buttons:
                    [
                        'settingsLanguageEngButton',
                        'settingsLanguageEspButton',
                        'settingsLanguageCatButton',
                        'settingsLanguageGerButton'
                    ]
                },
                { 
                    name:'settingsVoiceControl', 
                    buttons:['vc1']
                },
                { 
                    name:'settingsUserProfile', 
                    buttons:['up1', 'up2']
                }
            ],
            buttons: 
            [
                'settingsLanguageButton',
                'settingsVoiceControlButton',
                'settingsUserProfileButton'
            ]
        },                                                       
/*6*/   { 
            name: 'subtitlesMenu', isEnabled: true, firstmenuindex: 4,
            submenus:
            [
                { 
                    name: 'subtitlesLanguages', 
                    buttons:
                    [
                        'subtitlesEngButton', 
                        'subtitlesEspButton',
                        'subtitlesGerButton',
                        'subtitlesCatButton'
                    ]
                },
                { 
                    name: 'subtitlesEasyRead', 
                    buttons:
                    [
                        'subtitlesEasyOn',
                        'subtitlesEasyOff'
                    ]
                },
                { 
                    name: 'subtitlesShowPositions', 
                    buttons:
                    [
                        'subtitlesTopButton',
                        'subtitlesBottomButton'
                    ]
                },
                { 
                    name: 'subtitlesBackground', 
                    buttons:
                    [
                        'subtitlesSemitrans',
                        'subtitlesOutline'
                    ]
                },
                { 
                    name: 'subtitlesSizes', 
                    buttons:
                    [
                        'subtitlesSmallSizeButton', 
                        'subtitlesMediumSizeButton',
                        'subtitlesLargeSizeButton'
                    ]
                },
                { 
                    name: 'subtitlesIndicator', 
                    buttons:
                    [
                        'subtitlesIndicatorNoneButton', 
                        'subtitlesIndicatorArrowButton',
                        'subtitlesIndicatorRadarButton'
                    ]
                },
                { 
                    name: 'subtitlesAreas', 
                    buttons:
                    [
                        'subtitlesSmallAreaButton', 
                        'subtitlesMediumAreaButton',
                        'subtitlesLargeAreaButton'
                    ]
                }
            ],
            buttons: 
            [
                'subtitlesOnButton', 
                'subtitlesOffButton',
                'subtitlesShowLanguagesDropdown',
                'subtitlesShowEasyReadDropdown',
                'subtitlesShowPositionsDropdown',
                'subtitlesShowBackgroundDropdown',
                'subtitlesShowSizesDropdown',
                'subtitlesShowIndicatorDropdown',
                'subtitlesShowAreasDropdown',
                'subtitlesUpButton', 
                'subtitlesDownButton',
            ]
        },                                   
/*7*/   { 
            name: 'signLanguageMenu', isEnabled: true, firstmenuindex: 4, 
            submenus:[
                { 
                    name: 'signerShowPositions', 
                    buttons:
                    [
                        'signerTopButton',
                        'signerBottomButton'
                    ]
                },
                { 
                    name: 'signerIndicator', 
                    buttons:
                    [
                        'signerIndicatorNoneButton', 
                        'signerIndicatorArrowButton',
                        'signerIndicatorRadarButton'
                    ]
                },
                { 
                    name: 'signerAreas', 
                    buttons:
                    [
                        'signerSmallAreaButton', 
                        'signerMediumlAreaButton',
                        'signerLargeAreaButton'
                    ]
                }
            ],
            buttons: 
            [
                'signLanguageOnButton', 
                'signLanguageOffButton',
                'signShowPositionsDropdown',
                'signShowIndicatorDropdown',
                'signShowAreasDropdown'
            ]
        },
/*8*/   { 
            name: 'audioDescriptionMenu', isEnabled: true, firstmenuindex: 4, 
            submenus:[],
            buttons: 
            [
                'audioDescriptionOnButton', 
                'audioDescriptionOffButton'
            ]
        },
/*9*/   { 
            name: 'audioSubtitlesMenu', isEnabled: true, firstmenuindex: 4, 
            submenus:[],
            buttons: 
            [
                'audioSubtitlesOnButton', 
                'audioSubtitlesOffButton'
            ]
        }                                    
    ];