var _menu_ = {

    __moduleName:            '_menu_',
    __menuId:                'cadMenuId',
    __location:              {x:0, y:0},
    __marginTwice:           10,
    __margin:                5,

    __icons: {
        // Menu icons: Empty at this moment
    },


    __mainMenu: {
        items: [
            { id: '__filesMenu',         action: '_menu_.__showMenu("__filesMenu");'        },
            { id: '__viewMenu',          action: '_menu_.__showMenu("__viewMenu");',          divider: true },
            { id: '__addMenu',           action: '_menu_.__showMenu("__addMenu");'          },
            { id: '__editMenu',          action: '_menu_.__showMenu("__editMenu");',          isDisplayed: '_modelTools_.__isListStarted(_model_);' },
            { id: '__insertMenu',        action: '_menu_.__showMenu("__insertMenu");'       },
            { id: '__dimensionMenu',     action: '_menu_.__showMenu("__dimensionMenu");',     isDisplayed: '(_modelTools_.__isListStarted(_model_) || _modelTools_.__isListStarted(_model_[_parameter_.__dimension]))' },
            { id: '__blockMenu',         action: '_menu_.__showMenu("__blockMenu");'        },
            { id: '__selectionMenu',     action: '_menu_.__showMenu("__selectionMenu");',     isDisplayed: '_modelTools_.__isListStarted(_model_);' },
            { id: '__settingsMenu',      action: '_menu_.__showMenu("__settingsMenu");'     },
            { id: '__drawingToolsMenu',  action: '_menu_.__showMenu("__drawingToolsMenu");' },
            { id: '__togglesMenu',       action: '_menu_.__showMenu("__togglesMenu");'      },
            { id: '__modelMenu',         action: '_menu_.__showMenu("__modelMenu");',         divider: true },
            { id: '__help',              action: '_utils_.__help();'                        },
            { id: '__about',             action: '_utils_.__about();'                       },
        ],
    },


    __filesMenu: {
        backTo: '__mainMenu',
        items: [
            { id: 'newDialog',           action: '_modelTools_.__newModelSetup();'          },
            { id: 'open',                action: '_modelTools_.__loadModelSetup();'         },
            { id: 'save',                action: '_modelTools_.__saveModel();'              },
            { id: 'print',               action: '_print_.__printDocument();',                divider: true },
        ],
    },


    __templatesMenu: {
        backTo: '__filesMenu',
        items: [
            { id: 'templatesDialog',     action: '_template_.__chooseTemplate();'           },
            { id: 'templateMove',        action: '_template_.__initializeMoveTemplate();'   },
            { id: 'templateEdit',        action: '_template_.__editTemplate();'             },
        ],
    },


    __viewMenu: {
        backTo: '__mainMenu',
        items: [
            { id: 'refresh',             action: '_paint_.__paintEntry();'                  },
            { id: 'zoomAll',             action: '_view_.__zoomAll();',   divider: true     },
            { id: 'zoomIn',              action: '_view_.__zoom_In(true);'                  },
            { id: 'zoomOut',             action: '_view_.__zoom_Out(true);'                 },
            { id: 'zoomBox',             action: '_view_.__initializeZoomBox();'            },
            { id: 'showLimits',          toggle: '_paint_.__isLimitsShown',  divider: true  },
        ],
    },

    __toolsSubMenu: {
        items: [
            { id: 'coordinates',         action: '_tooltip_.__selectCoordinateType();',     divider:     true },
            { id: 'anchorSnap',          toggle: '_anchor_.__isSnapToAnchor'                },
            { id: 'gridSnap',            toggle: '_grid_.__isSnapToGrid'                    },
            { id: 'orthoMode',           toggle: '_snap_.__isOrthoModeActive'               },
        ],
    },


    __addMenu: {
        backTo: '__mainMenu',
        items: [
            { id: '__curveMenu',         action: '_menu_.__showMenu("__curveMenu");'        },
            { id: '__lineMenu',          action: '_menu_.__showMenu("__lineMenu");'         },
            { id: '__rectangleMenu',     action: '_menu_.__showMenu("__rectangleMenu");'    },
            { id: '__textMenu',          action: '_menu_.__showMenu("__textMenu");'         },
        ],
    },
    __addCloseMenu: {
        items: [
            { id: 'Done',                action: '_add_.__finalize();',                      isDisplayed: '_add_.__isAddMenuDoneOptionValid()' },
            { id: 'Cancel',              action: '_add_.__cancelAdd(true);'                 },
            { subMenu: '__toolsSubMenu'},
        ],
    },

    __curveMenu: {
        backTo: '__addMenu',
        items: [
            { id: '__arcMenu',           action: '_menu_.__showMenu("__arcMenu");'          },
            { id: '__circleMenu',        action: '_menu_.__showMenu("__circleMenu");'       },
            { id: '__ellipseMenu',       action: '_menu_.__showMenu("__ellipseMenu");'      },
        ],
    },
    __arcMenu: {
        backTo: '__curveMenu',
        items: [
            { id: 'selectArcType',       action: '_arc_.__chooseArcType();',                 isDisplayed: 'false' },
            { id: 'arc',                 action: '_add_.__initialize(_arc_.__arcType);'     },
            { id: 'arc3pt',              action: '_add_.__initialize(_arc_.__arcType, _arc_.__threePointsOption);' },
            { id: 'arcBulge',            action: '_add_.__initialize(_arc_.__arcType, _arc_.__bulgeOption);'},
        ],
    },
    __circleMenu: {
        backTo: '__curveMenu',
        items: [
            { id: 'selectCircleType',    action: '_circle_.__chooseCircleType();',             isDisplayed: 'false' },
            { id: 'circle',              action: '_add_.__initialize(_circle_.__circleType);' },
            { id: 'circleBox',           action: '_add_.__initialize(_circle_.__circleType, _circle_.__boxOption);' },
            { id: 'circle2pt',           action: '_add_.__initialize(_circle_.__circleType, _circle_.__twoPointsOption);' },
            { id: 'circle3pt',           action: '_add_.__initialize(_circle_.__circleType, _circle_.__threePointsOption);' },
        ],
    },
    __ellipseMenu: {
        backTo: '__curveMenu',
        items: [
            { id: 'selectEllipseType',   action: '_ellipse_.__chooseEllipseType();',             isDisplayed: 'false' },
            { id: 'ellipse',             action: '_add_.__initialize(_ellipse_.__ellipseType);' },
            { id: 'ellipseBox',          action: '_add_.__initialize(_ellipse_.__ellipseType, _ellipse_.__boxOption);' },
            { id: 'ellipseArc',          action: '_add_.__initialize(_ellipse_.__ellipseType, _ellipse_.__arcOption);' },
        ],
    },
    __lineMenu: {
        backTo: '__addMenu',
        items: [
            { id: 'selectPolylineType',  action:      '_polyline_.__choosePolylineType();',      isDisplayed: 'false' },
            { id: 'line',                action: '_add_.__initialize(_line_.__lineType);' },
            { id: 'polyline',            action: '_add_.__initialize(_polyline_.__polylineType);' },
            { id: 'freePolygon',         action: '_add_.__initialize(_polyline_.__polygonType);' },
            { id: 'polygonCenter',       action: '_add_.__initialize(_polyline_.__polygonType, _polyline_.__centerOption);' },
            { id: 'polygonSide',         action: '_add_.__initialize(_polyline_.__polygonType, _polyline_.__sideOption);' },
            { id: 'sketch',              action: '_add_.__initialize(_sketch_.__sketchType);' },
        ],
    },
    __rectangleMenu: {
        backTo: '__addMenu',
        items: [
            { id: 'selectRectangleType', action: '_rectangle_.__chooseRectangleType();',              isDisplayed: 'false' },
            { id: 'parallelogram',       action: '_add_.__initialize(_rectangle_.__parallelogramType);' },
            { id: 'rectangle',           action: '_add_.__initialize(_rectangle_.__rectangleType);' },
            { id: 'square',              action: '_add_.__initialize(_rectangle_.__squareType);' },
            { id: 'trapeze',             action: '_add_.__initialize(_rectangle_.__trapezeType);' },
        ],
    },
    __textMenu: {
        backTo: '__addMenu',
        items: [
            { id: 'selectTextType',      action:      '_text_.__chooseTextType();',               isDisplayed: 'false' },
            { id: 'callout',             action:      '_add_.__initialize(_text_.__textCallout);' },
            { id: 'restrictedText',      action:      '_add_.__initialize(_text_.__textRestricted);' },
            { id: 'multilineText',       action:      '_add_.__initialize(_text_.__textMultiline);' },
            { id: 'text',                action:      '_add_.__initialize(_text_.__textSimple);' },
        ],
    },


    // EDIT MENUS
    __editMenu: {
        backTo: '__mainMenu',
        items: [
            { id: '__deleteCommand',     action: '_modelTools_.__removeObjects();' },
            { id: '__explodeCommand',    action: '_explode_.__explodeSelection();'},
            { id: '__arrayCommand',      action: '_array_.__initializeArray();'},
            { id: '__breakCommand',      action: '_edit_.__initializeBreak();'},
            { id: '__chamferCommand',    action: '_edit_.__initializeChamfer();'            },
            { id: '__copyCommand',       action: '_edit_.__initializeCopy();',        divider: true },
            { id: '__extendCommand',     action: '_edit_.__initializeExtend();'},
            { id: '__filletCommand',     action: '_edit_.__initializeFillet();'             },
            { id: '__mirrorCommand',     action: '_edit_.__initializeMirror();'},
            { id: '__moveCommand',       action: '_edit_.__initializeMove();' },
            { id: '__offsetCommand',     action: '_edit_.__initializeOffset();'},
            { id: '__rotateCommand',     action: '_edit_.__initializeRotate();' },
            { id: '__scaleCommand',      action: '_edit_.__initializeScale();' },
            { id: '__stretchCommand',    action: '_edit_.__initializeStretch();'},
            { id: '__trimCommand',       action: '_edit_.__initializeTrim();'},
            { subMenu: '__toolsSubMenu'},
        ],
    },
    __singleEditMenu: {
        backTo: '__mainMenu',
        items: [
            { id: 'propertiesDialog',    action: '_properties_.__editObjectProperties();'   },
            { id: '__inspectCommand',    action: '_modelTools_.__showObject();'             },
            { id: '__deleteCommand',     action: '_modelTools_.__removeObjects();',         divider: true},
            { id: '__arrayCommand',      action: '_array_.__initializeArray();'             },
            { id: '__breakCommand',      action: '_edit_.__initializeBreak();',       isDisplayed: '_menu_.__isActionDisplayedInMenu("__break");' },
            { id: '__copyCommand',       action: '_edit_.__initializeCopy();'               },
            { id: '__extendCommand',     action: '_edit_.__initializeExtend();',      isDisplayed: '_menu_.__isActionDisplayedInMenu("__extend");' },
            { id: '__explodeCommand',    action: '_explode_.__explodeSelection();',   isDisplayed: '_menu_.__isActionDisplayedInMenu("__explode");' },
            { id: '__moveCommand',       action: '_edit_.__initializeMove();'               },
            { id: '__offsetCommand',     action: '_edit_.__initializeOffset();',      isDisplayed: '_menu_.__isActionDisplayedInMenu("__offset");'},
            { id: '__rotateCommand',     action: '_edit_.__initializeRotate();'             },
            { id: '__scaleCommand',      action:  '_edit_.__initializeScale();'             },
            { id: '__trimCommand',       action:  '_edit_.__initializeTrim();'              },
            { subMenu: '__toolsSubMenu'},
        ],
    },
    __multipleEditMenu: {
        backTo: '__mainMenu',
        items: [
            { id: '__deleteCommand',     action: '_modelTools_.__removeObjects();'          },
            { id: '__explodeCommand',    action: '_explode_.__explodeSelection();',   isDisplayed: '_menu_.__isActionDisplayedInMenu("__explode");' },
            { id: '__arrayCommand',      action: '_array_.__initializeArray();',             divider: true},
            { id: '__copyCommand',       action: '_edit_.__initializeCopy();'               },
            { id: '__extendCommand',     action: '_edit_.__initializeExtend();',      isDisplayed: '_menu_.__isActionDisplayedInMenu("__extend");' },
            { id: '__moveCommand',       action: '_edit_.__initializeMove();'               },
            { id: '__offsetCommand',     action: '_edit_.__initializeOffset();'             },
            { id: '__rotateCommand',     action: '_edit_.__initializeRotate();'             },
            { id: '__scaleCommand',      action: '_edit_.__initializeScale();'              },
            { subMenu: '__toolsSubMenu'},
        ],
    },
    __editCloseMenu: {
        items: [
            { id: 'Cancel',              action: '_edit_.__cancelEditMode(true);' },
            { subMenu: '__toolsSubMenu'},
       ],
    },


    __blockMenu: {
        backTo: '__mainMenu',
        items: [
            { id: 'selectObjectsForBlock', action: '_selection_.__initializeMultiple();' },
            { id: 'buildBlock',          action: '_add_.__initialize("block")',            isDisplayed: '_selection_.__selectionSet' },
            { id: 'deleteBlock',         action: '_modelTools_.__deleteBlock()',           isDisplayed: '_modelTools_.__isListStarted(_model_[_parameter_.__blocks]);'  },
            { id: 'explodeBlock',        action: '_modelTools_.__explodeBlock()',          isDisplayed: '_modelTools_.__isListStarted(_model_[_parameter_.__blocks]);',   divider: true },
        ],
    },

    __selectionMenu: {
        backTo: '__mainMenu',
        items: [
            { id: 'selectSingle',        action: '_selection_.__initializeSingleSelection();'   },
            { id: 'selectFirst',         action: '_selection_.__selectFirst();'                 },
            { id: 'selectLast',          action: '_selection_.__selectLast();'                  },
            { id: 'selectMultiple',      action: '_selection_.__initializeMultipleSelection();' },
            { id: 'selectByArea',        action: '_selection_.__initializeAreaSelection();'     },
            { id: 'selectAll',           action: '_selection_.__selectAll();'                   },
            { id: 'clearSelection',      action: '_selection_.__cancelSelection(true);',    isDisplayed: '_selection_.__selectionSet' },
        ],
    },
    __selectionCloseMenu: {
        items: [
            { id: 'Done',                action:      '_selection_.__cancelSelection(false);' },
            { id: 'Cancel',              action:      '_selection_.__cancelSelection(true);' },
            { subMenu: '__toolsSubMenu'},
        ],
    },

    __insertMenu: {
        backTo: '__mainMenu',
        items: [
            { id: 'block',               action: '_add_.__initialize(_insert_.__insertType);' },
            { id: 'reference',           action: '_insert_.__loadReferenceSetup();' },
            { id: 'image',               action: '_add_.__initialize(_image_.__imageType);' }
        ],
    },

    __dimensionMenu: {
        backTo: '__mainMenu',
        items: [
            { id: 'selectDimensionType', action: '_dimension_.__chooseDimensionType();',           isDisplayed: 'false' },
            { id: 'aligned',             action: '_dimension_.__initializeAddDimension(_dimension_.__alignedType);' },
            { id: 'angular',             action: '_dimension_.__initializeAddDimension(_dimension_.__angularType);' },
            { id: 'linear',              action: '_dimension_.__initializeAddDimension(_dimension_.__linearType);'  },
            { id: 'radial',              action: '_dimension_.__initializeAddDimension(_dimension_.__radialType);'},
            { id: 'selectDimension',     action: '_dimension_.__initializeDimensionSelect();',      isDisplayed: '_modelTools_.__isListStarted(_model_[_parameter_.__dimension])',   divider: true    },
            { id: 'editDimension',       action: '_dimension_.__initializeDimensionEditByTable();', isDisplayed: '_modelTools_.__isListStarted(_model_[_parameter_.__dimension])'},
            { id: 'deleteDimension',     action: '._dimension_.__initializeDelete();',              isDisplayed: '_modelTools_.__isListStarted(_model_[_parameter_.__dimension])' },
            { id: 'clearDimensions',     action: '_dimension_.__clearDimensions();',                isDisplayed: '_modelTools_.__isListStarted(_model_[_parameter_.__dimension])'},
            { id: 'setDimensionDialog',  action: '_dimension_.__showDimensionParameters();' ,   divider: true  },
        ],
    },
    __dimensionCloseMenu: {
        items: [
            { id: 'Cancel',              action: '_dimension_.__cancel();' },
        ],
    },

    __settingsMenu: {
        backTo: '__mainMenu',
        items: [
            { id: '__colorMenu',         action: '_menu_.__showMenu("__colorMenu");' },
            { id: 'setDimensionDialog',  action: '_dimension_.__showDimensionParameters();' },
            { id: '__fontStylesMenu',    action: '_menu_.__showMenu("__fontStylesMenu");' },
            { id: 'setLanguageDialog',   action: '_messages_.__setLanguageSetup();' },
            { id: '__layersMenu',        action: '_menu_.__showMenu("__layersMenu");' },
            { id: '__lineTypesMenu',     action: '_menu_.__showMenu("__lineTypesMenu");' },
            { id: 'setLineTypeScaleDialog', action: '_utils_.__inputLineTypeScale();' },
            { id: 'setObjectLineTypeScaleDialog', action: '_utils_.__inputObjectLineTypeScale();' },
            { id: 'setLineWidthDialog',  action: '_utils_.__inputLineWidth();' },
            { id: 'roundFactor',         action: '_utils_.__inputRoundFactor();' },
            { id: 'sketchUnitLength',    action: '_polyline_.__initializeSettingSketchUnitLength();' },
            { id: 'trackColor',          action: '_track_.__chooseTrackColor();' },
        ],
    },
    __colorMenu: {
        backTo: '__settingsMenu',
        items: [
            { id: 'setColorDialog',      action:      '_utils_.__chooseColor();' },
            { id: 'resetColor',          action:      '_utils_.__resetColor();' },
        ],
    },
    __fontStylesMenu: {
        backTo: '__settingsMenu',
        items: [
            { id: 'setFontStyle',        action: '_fontStyles_.__setFontStyle();',     isDisplayed: '(Object.keys(_model_[_parameter_.__fontStyles]).length > 1)' },
            { id: 'addFontStyle',        action: '_fontStyles_.__addFontStyleSetup();' },
            { id: 'removeFontStyle',     action: '_fontStyles_.__removeFontStyle();',  isDisplayed: '(Object.keys(_model_[_parameter_.__fontStyles]).length > 1)' },
            { id: 'editFontStyle',       action: '_fontStyles_.__selectFontStyleForEdition();' },
        ],
    },
    __layersMenu: {
        backTo: '__settingsMenu',
        items: [
            { id: 'setLayer',            action: '_layers_.__setLayer();',            isDisplayed: '(Object.keys(_model_[_parameter_.__layers]).length > 1)' },
            { id: 'addLayer',            action: '_layers_.__addLayerSetup();' },
            { id:  'removeLayer',        action: '_layers_.__removeLayer();',         isDisplayed: '(Object.keys(_model_[_parameter_.__layers]).length > 1)' },
            { id: 'editLayer',           action: '_layers_.__selectLayerForEdition();' },
        ],
    },
    __lineTypesMenu: {
        backTo: '__settingsMenu',
        items: [
            { id: 'setLineType',         action: '_lineTypes_.__setLineType();',              isDisplayed: '(Object.keys(_model_[_parameter_.__lineTypes]).length > 1)' },
            { id: 'addLineType',         action: '_lineTypes_.__addLineTypeSetup();' },
            { id: 'removeLineType',      action: '_lineTypes_.__removeLineType();',           isDisplayed: '(Object.keys(_model_[_parameter_.__lineTypes]).length > 1)' },
            { id: 'editLineType',        action: '_lineTypes_.__selectLineTypeForEdition();', isDisplayed: '(Object.keys(_model_[_parameter_.__lineTypes]).length > 1)' },
        ],
    },


    __drawingToolsMenu: {
        backTo: '__mainMenu',
        items: [
            { id: 'setLastTouchLocation', action: '_view_.__initializeLastTouchLocation()'},
            { id: '__templatesMenu',     action: '_menu_.__showMenu("__templatesMenu");' },
            { id: 'unitsDialog',         action: '_unit_.__setUnitSetup();' },
            { id: 'snapSettingsDialog',  action: '_snap_.__initialize();' },
            { id: 'gridSettingsDialog',  action: '_grid_.__initialize();' },
            { id: 'selectCoordinateType', action: '_tooltip_.__selectCoordinateType();'},
            { id: 'distance',            action: '_tools_.__initializeDistance()'},
        ],
    },

    __togglesMenu: {
        backTo: '__mainMenu',
        items: [
            { id: 'backgroundWhite',     action: '_paint_.__toggleWhiteBackground();',     isChecked:   '_paint_.__isPaintBackgroundWhite' },
            { id: 'imageFrame',          toggle: '_view_.__isImageFrameVisible' },
            { id: 'paintImagesFirst',    toggle: '_paint_.__isPaintingImagesFirst' },
            { id: 'restrictedTextFrame', toggle: '_paint_.__isRestrictedTextFrameVisible' },
            { id: 'statusBar',           action: '_statusBar_.__toggleStatusBar();',       isChecked:   '_statusBar_.__isStatusBarDisplayed' },
            { id: 'tooltip',             action: '_tooltip_.__toggleTooltip();',           isChecked:   '_tooltip_.__isDisplayedTooltip' },
            { id: 'wheelPull',           action: '_userTools_.__toggleWheelPull();',       isChecked:   '_user_[_parameter_.__isPullWheelToZoomIn]', divider: true },
            { id: 'internalErrors',      toggle: '_events_.__isInternalError' },
        ],
    },

    __modelMenu: {
        backTo: '__mainMenu',
        items: [
            { id: 'modelProperties',     action: '_modelTools_.__properties();'             },
            { id: 'modelArea',           action: '_modelTools_.__initializeModelArea();'    },
            { id: 'modelOrigin',         action: '_modelTools_.__initializeMoveModelOrigin();',     divider: true},
            { id: 'modelClean',          action: '_modelTools_.__cleanList(_model_[_parameter_.__list])' },
            { id: 'modelList',           action: '_modelTools_.__listModel()' },
            { id: 'modelShow',           action: '_modelTools_.__showModel();',               divider: true },
        ],
    },

    
    /* ************************************************************* */
    // Procedures:



    /* ********************************************************************* */
    // Validate actions
    __isActionDisplayedInMenu: function(__actionName) {
        if (_selection_.__selectionSet) {
            var __isActionValidTrue              = true;
            $.each( _selection_.__selectionSet, function( __index, __thisId ) {
                var __thisObject                 = _model_[_parameter_.__list][__thisId];
                if (!_edit_.__isActionValidForObject(__thisObject, __actionName)) {
                    __isActionValidTrue          = false;
                    return false;
                }
            });
            return __isActionValidTrue;
        } else if (_anchor_.__anchorIds) {
            var __isActionValidTrue              = true;
            $.each( _anchor_.__anchorIds, function( __index, __thisId) {
                var __thisObject                 = _model_[_parameter_.__list][__thisId];
                if (!_edit_.__isActionValidForObject(__thisObject, __actionName)) {
                    __isActionValidTrue          = false;
                    return false;
                }
            });
            return __isActionValidTrue;
        }
    },

    __isOneSelected: function() {
        if (_selection_.__isSingleSelection()) {
            return true;
        } else if (_anchor_.__anchorIds) {
            return (_anchor_.__anchorIds.length === 1);
        }
    },
    __isMultipleSelected: function() {
        if (_selection_.__selectionSet) {
            return (_selection_.__selectionSet.length > 1);
        } else if (_anchor_.__anchorIds) {
            return (_anchor_.__anchorIds.length > 1);
        }
    },

    __getMenuItem: function(__itemName) {
        var __selectedMenuItem                   = null;
        try {
            $.each( _menu_, function( __thisId, __menuObject ) {
                if (_utils_.__ownsProperty(__menuObject, _parameter_.__items)) {
                    $.each( __menuObject[_parameter_.__items], function( __index, __menuItem ) {
                        if (__menuItem[_parameter_.__id] === __itemName) {
                            __selectedMenuItem = __menuItem;
                            return;
                        }
                    });
                    if (__selectedMenuItem) return;
                }
            });
        } catch (ex) {
            alert(ex.message);
        }
        return __selectedMenuItem;
    },
    __closeMenu: function() {
        $('#' + this.__menuId).remove();
    },
    __selectMenu: function() {
        _tooltip_.__hideTooltip();
        $('.multipleInputDiv').remove();
        if (_add_.__currentObject){
            this.__showMenu('__addCloseMenu');

        } else if (_dimension_.__currentDimObject) {
            this.__showMenu('__dimensionCloseMenu');
        } else if (_dimension_.__selectedDimension) {
            this.__showMenu('__dimensionCloseMenu');

        } else if (_edit_.__editData) {
            this.__showMenu('__editCloseMenu');

        } else if (_menu_.__isOneSelected()) {
            this.__showMenu('__singleEditMenu');
        } else if (_menu_.__isMultipleSelected()) {
            this.__showMenu('__multipleEditMenu');

        } else if (_selection_.__isSelectingMultipleObjects) {
            this.__showMenu('__selectionCloseMenu');

        } else  {
            this.__showMenu('__mainMenu');
        }
    },
    __showMenu: function(__selectedMenuId) {
        this.__closeMenu();
        var __contextMenu                        = this.__buildMenu(__selectedMenuId).show();
        var __cadCanvasPosition                  = _utils_.__getCanvas().position();
        var __cadCanvas                          = _utils_.__getCanvasElement();
        var __maxLeftBorder                      = ((__cadCanvasPosition[_parameter_.__left] + __cadCanvas[_parameter_.__width] - this.__marginTwice) - __contextMenu.width());
        var __leftBorder                         = Math.min((__cadCanvasPosition[_parameter_.__left] + this.__location.x), __maxLeftBorder);
        __leftBorder                             = Math.max(__leftBorder, this.__margin);
        var __maxTopBorder                       = (__cadCanvasPosition[_parameter_.__top]   + __cadCanvas[_parameter_.__height] - (__contextMenu.height() + this.__marginTwice));
        var __topBorder                          = Math.min((__cadCanvasPosition[_parameter_.__top] + this.__location.y), __maxTopBorder);
        __topBorder                              = Math.max(__topBorder, (__cadCanvasPosition[_parameter_.__top] + this.__margin));
        __contextMenu.css({
            zIndex: 100,
            left: __leftBorder,
            top: __topBorder,
        });
        $(__contextMenu).on( "click",  function() {_menu_.__closeMenu()});
        $(__contextMenu).contextmenu(function(__event) {__event.preventDefault();});
    },
    __buildMenu: function(__selectedMenuId) {
        var __selectedMenu                       = _menu_[__selectedMenuId];
        var __cadCanvas                          = _utils_.__getCanvas();
        var __thisContextMenu                    = $('<ul id="' + this.__menuId + '" class="contextMenuPlugin"><div class="gutterLine"></div></ul>').insertAfter(__cadCanvas);
            // Build and add header (menu title), with back arrow as required
        var __menuTitle                          = _messages_.__getMessage(__selectedMenuId);
        if (_utils_.__ownsProperty(__selectedMenu, _parameter_.__backTo)) {
            __menuTitle                          = '&#11013; ' + __menuTitle;
        }
        var __headerListItem                     = $('<li class="header"><span>' + __menuTitle + '</span></li>');
        __headerListItem.appendTo(__thisContextMenu);
        if (_utils_.__ownsProperty(__selectedMenu, _parameter_.__backTo)) {
            __headerListItem.find('span').click(function() {eval('_menu_.__showMenu("' + __selectedMenu[_parameter_.__backTo] + '");')});
        }
        return this._processContextMenu(__thisContextMenu, __selectedMenu);
    },
    _processContextMenu: function(__thisContextMenu, __selectedMenu) {
            // Process Menu Items
        $.each( __selectedMenu.items, function( __itemIndex, __selectedMenuItem ){
            if (__selectedMenuItem[_parameter_.__id]) {
                var __isDisplayed                    = true;
                    // Condition to display item?
                if (__selectedMenuItem[_parameter_.__isDisplayed]) {
                    __isDisplayed                = eval(__selectedMenuItem[_parameter_.__isDisplayed]);
                }
                if (__isDisplayed) {
                        // Insert item separator as required
                    if (__selectedMenuItem.divider) {
                        $('<li class="divider"/>').appendTo(__thisContextMenu);
                    }
                        // Insert menu item
                    var __listItem                   = $('<li><a href="#"/></li>').appendTo(__thisContextMenu);
                    var __currentItemId              = __selectedMenuItem[_parameter_.__id];
                    var __thisTitle                  = _messages_.__getMessage(__currentItemId);
                        // Set item title
                    if (_menu_[__currentItemId]) {
                        __thisTitle += ' &#10145;';
                    }
                    if (eval(__selectedMenuItem[_parameter_.__toggle])) {
                            __thisTitle                += ' &#10003;';
                    } else if (eval(__selectedMenuItem.isChecked)) {
                        __thisTitle                 += ' &#10003;';
                    }
                    __listItem.find('a').html(__thisTitle);
                        // Insert item icon as required (ready: add 'icon' property to items when icons are available)
                    if (__selectedMenuItem.icon) {
                        var __thisIconTag            = $('<img>');
                        __thisIconTag.attr('src', 'data:image:png;base64,' + this.__icons[__selectedMenuItem.icon]);
                        __thisIconTag.insertBefore(__listItem.find('span'));
                    }
                        // Set item action
                    if (__selectedMenuItem[_parameter_.__toggle]) {
                        __listItem.find('a').click(function() {_utils_.__toggle(__selectedMenuItem[_parameter_.__toggle])});
                    } else {
                        __listItem.find('a').click(function() {eval(__selectedMenuItem[_parameter_.__action])});
                    }
                }
            } else if (__selectedMenuItem[_parameter_.__subMenu]) {
                var __subMenuId                    = __selectedMenuItem[_parameter_.__subMenu];
                var __subMenu                      = _menu_[__subMenuId];
                return _menu_._processContextMenu(__thisContextMenu, __subMenu);
            }

        });
        return __thisContextMenu;
    },

    __addMenuItem: function() {

    },


};

$(document).ready(function() {
    _utils_.__getCanvas().contextmenu(function(__event) {
        __event.preventDefault();
        _menu_.__location                           = _view_.__pointerLocation;
        _menu_.__selectMenu();
    });
});
