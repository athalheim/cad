var _modelTools_ = {

    __moduleName:            '_modelTools_',
    /* ************************************************************* */
    // Properties
    __initialName:           'Empty',
    __initialDescription:    'This is an empty model',
    __newModelOrigin:        null,

    __parameters: {
        __parameterNames:    [_parameter_.__name,                _parameter_.__description,         _parameter_.__templateName,                         _parameter_.__templateScale],
        __parameterTypes:    [_parameter_.__parameterTypeString, _parameter_.__parameterTypeString, '_template_.__templateList',            '_template_.__templateScales'],
        __parameterValues:   [null,                              null,                              "_model_[_parameter_.__template].name", "_model_[_parameter_.__template][_parameter_.__scaleText]"],
    },

    __isListStarted: function(__container) {
        if (__container) {
            if (__container[_parameter_.__list]) {
                return (Object.keys(__container[_parameter_.__list]).length > 0);
            }
        }
    },


    /* ************************************************************* */
    // PROPERTIES
    __properties: function() {
        var __message                              = _messages_.__getMessage('newModel');
        _inputMultiple_.__setMultipleInput(__message, this.__parameters, _model_, '_modelTools_.__propertiesFinalize(__parameterValues)');
    },
    __propertiesFinalize: function(__parameters) {
        _model_[_parameter_.__name]                          = __parameters?__parameters[_parameter_.__name]:       this.__initialName;
        _model_[_parameter_.__description]                   = __parameters?__parameters[_parameter_.__description]:this.__initialDescription;
        _template_.__setTemplateFollow(__parameters);
    },

    // MODEL AREA
    __initializeModelArea: function() {
        _view_.__setTouchEventsFunctionString(
            '_modelTools_._setModelArea(_view_.__modelLocation);',
            '_track_.__trackEntry(_modelTools_.__moduleName, _view_.__modelLocation)',
            '_modelTools_._setModelArea(_view_.__modelLocation, _view_.__fuzzValue);',
            '_modelTools_.__cancelModelArea();'
        );
    },
    _setModelArea: function(__currentPoint, __fuzzValue) {
        if (this.__newModelOrigin === undefined) {
            this.__newModelOrigin                            = __currentPoint;
        } else if (_utils_.__getDistance(this.__newModelOrigin, __currentPoint) > __fuzzValue) {
            _model_.limits                                   = _utils_.__getArea(this.__newModelOrigin, __currentPoint);
            _view_.__zoomAll();
            this.__cancelModelArea();
        }
    },
    __cancelModelArea: function() {
        delete this.__newModelOrigin;
        _view_.__resetTouchEventsFunctionString();
    },

    // NEW MODEL
    __newModelSetup: function() {
        var __message                              = _messages_.__getMessage('newModel');
        _inputMultiple_.__setMultipleInput(__message, this.__parameters, null, '_modelTools_.__newModelFollow(__parameterValues)');
    },
    __newModelFollow: function(__parameters) {
        this.__initializeModel(__parameters);
        _view_.__zoomAll();
    },

    // INITIALIZE MODEL
    __initializeModel: function(__parameters) {
        // Parameters
        _model_                                                      = {};
        _model_[_parameter_.__name]                                  = __parameters?__parameters[_parameter_.__name]:       this.__initialName;
        _model_[_parameter_.__description]                           = __parameters?__parameters[_parameter_.__description]:this.__initialDescription;
        _model_[_parameter_.__blocks]                                = {};
        _model_[_parameter_.__list]                                  = {};

        // fontStyle, fontStyles, fontSize:
        _fontStyles_.__reset();

        // layer and layers:
        _layers_.__reset();

        // lineType, lineTypes, lineTypeScale:
        _lineTypes_.__reset();
        _model_[_parameter_.__units]                                 = 'metric';
        _template_.__setTemplateFollow(__parameters);
    },

    // Called from template module:
    __setModelLimits: function() {
        _model_[_parameter_.__limits]                                = {
            x:                                                          _model_[_parameter_.__template][_parameter_.__origin].x  * _model_[_parameter_.__template][_parameter_.__scale],
            y:                                                          _model_[_parameter_.__template][_parameter_.__origin].y  * _model_[_parameter_.__template][_parameter_.__scale],
            width:                                                      _model_[_parameter_.__template][_parameter_.__width]     * _model_[_parameter_.__template][_parameter_.__scale],
            height:                                                     _model_[_parameter_.__template][_parameter_.__height]    * _model_[_parameter_.__template][_parameter_.__scale],
                                                                       };
        _model_[_parameter_.__fontSize]                              = (_model_[_parameter_.__limits][_parameter_.__width] * 0.02);
        _model_[_parameter_.__dimension]                             = {};
        _model_[_parameter_.__dimension][_parameter_.__color]        = _user_[_parameter_.__dimensionColor];
        _model_[_parameter_.__dimension][_parameter_.__fontName]     = _user_[_parameter_.__dimensionFontName];
        _model_[_parameter_.__dimension][_parameter_.__fontSize]     = _utils_.__roundValue(3.0 * _model_[_parameter_.__template][_parameter_.__scale]);
        _model_[_parameter_.__dimension][_parameter_.__list]         = {};
        _grid_.__setGridToModel();
        _view_.__zoomAll();
    },


    // /* ********************************************************* */
    // // MOVE
    // __initializeMoveModelOrigin: function() {
    //     _inputSingle_.__setSingleInput('moveModelOrigin', 'newOrigin', _parameter_.__parameterTypePoint, '_modelTools_.__moveModelOrigin(__inputValue);');
    // },
    // __moveModelOrigin: function(__newOrigin) {
    //     var __displacement                         = {
    //                                                  x: (_model_[_parameter_.__limits].x - __newOrigin.x),
    //                                                  y: (_model_[_parameter_.__limits].y - __newOrigin.y)
    //                                                };
    //     // arrow, origin, points[]
    //     $.each( _model_[_parameter_.__list], function( __thisId, __thisObject ) {
    //         var __thisConstructor            = _utils_.__getObjectConstructor(__thisObject[_parameter_.__type]);
    //         __thisConstructor.__move(__thisObject, __displacement);
    //     });
    //     _model_[_parameter_.__template][_parameter_.__origin]                  = {
    //                                                 x: (_model_[_parameter_.__template][_parameter_.__origin].x + __displacement.x), 
    //                                                 y: (_model_[_parameter_.__template][_parameter_.__origin].y + __displacement.y)
    //                                                };
    //     _model_[_parameter_.__limits].x                        += __displacement.x;
    //     _model_[_parameter_.__limits].y                        += __displacement.y;
    //     _view_.__zoomAll();
    // },



    /* ********************************************************* */
    //SAVE
    __saveModel: function() {
        var __exportedModel                      = $.extend(true,{},eval(_model_));
        __exportedModel                          = this.__exportImages(__exportedModel);
        // Remove work property
        $.each( __exportedModel[_parameter_.__list], function( __thisId, __thisObject ) {
            delete __thisObject.__anchorPoints;
            delete __thisObject.__ellipsePoints;
        });
        $.each( __exportedModel[_parameter_.__dimension][_parameter_.__list], function( __thisId, __thisDimension ) {
            delete __thisDimension.__computedPoints;
        });
        var __htmlString                         = '<!DOCTYPE html>';
        __htmlString                            += ' <html>';
        __htmlString                            += ' <head>';
        __htmlString                            += '  <title>' + _messages_.__getMessage('export') + _parameter_.__space + _model_[_parameter_.__name] + '</title>';
        __htmlString                            += ' </head>';
        __htmlString                            += ' <body>';
        __htmlString                            += '  <div id="containedData" style="width:100%; height:100%;">' + JSON.stringify(__exportedModel) + '</div>';
        __htmlString                            += ' </body>';
        __htmlString                            += ' <script type="text/javascript">';
        __htmlString                            += '  function saveThisPage() {';
        __htmlString                            += '   var enchorElement = document.body.appendChild(document.createElement("a"));';
        __htmlString                            += '   enchorElement.download = "' + _model_[_parameter_.__name] + '.json";';
        __htmlString                            += '   enchorElement.href = "data:text/html," + document.getElementById("containedData").innerHTML;';
        __htmlString                            += '   enchorElement.click();';
        __htmlString                            += '   window.close();';
        __htmlString                            += '   alert("' + _messages_.__getMessage('savedModelAs') + _model_[_parameter_.__name] + '.json")';
        __htmlString                            += '  }';
        __htmlString                            += '  window.setTimeout(saveThisPage, 1000);';
        __htmlString                            += ' </script>';
        __htmlString                            += '</html>';
        var __newWindow                          = window.open();
        __newWindow.document.write(__htmlString);
    },
    __exportImages: function(__exportedModel) {
        $.each( __exportedModel[_parameter_.__list], function( __thisId, __thisObject ) {
            if (__thisObject[_parameter_.__type] === _image_.__imageType) {
                var __canvasElement              = _utils_.__createElementByTag([_parameter_.__canvas]);
                __canvasElement[_parameter_.__height]           = __thisObject[_parameter_.__img][_parameter_.__height];
                __canvasElement[_parameter_.__width]            = __thisObject[_parameter_.__img][_parameter_.__width];
                var __canvasContext              = _utils_.__getCanvasContext();
                __canvasContext.drawImage(__thisObject[_parameter_.__img], 0, 0);
                __thisObject[_parameter_.__base64]              = __canvasElement.toDataURL('image/png');
            }
        });
        return __exportedModel;
    },

    __listModel: function() {
        _list_.__setListInput('', '');
    },

    /* ********************************************************* */
    // LOAD
    __loadModelSetup: function() {
        _inputSingle_.__inputMode                = 'cad';
        _inputSingle_.__setCadSingleInput('_modelTools_.__loadModelData(__cadFilename, __filedata)');
    },
    __loadModelData: function(__cadFilename, __templateData) {
        try {
            _model_                              = JSON.parse(__templateData);
            _model_[_parameter_.__filename]                     = __cadFilename;
            this.__commonLoadJson();
        } catch(e) {
            _events_.__callError(this.__moduleName, e.message);
        }
    },
    __commonLoadJson: function() {
        $.each( _model_[_parameter_.__list], function( __thisId, __thisObject ) {
            if (__thisObject[_parameter_.__type] === _image_.__imageType) {
                __thisObject[_parameter_.__img]                   = new Image();
                __thisObject[_parameter_.__img].src               = __thisObject[_parameter_.__base64];
                delete __thisObject[_parameter_.__base64];
            }
            try {
                var __thisConstructor            = _utils_.__getObjectConstructor(__thisObject[_parameter_.__type]);
                __thisConstructor.__updateAnchorPoints(__thisObject);
            } catch(ex) {
                delete _model_[_parameter_.__list][__thisId];
            }
        });
        $.each( _model_[_parameter_.__dimension][_parameter_.__list], function( __thisId, __thisDimension ) {
            _dimension_.__computeDimensionPoints(__thisDimension);
        });
        _view_.__zoomAll();
    },


    /**********************************************************/
    // BLOCKS
    __addBlock: function(__blockName, __data) {
        var __thisBlock                          = $.extend(true,{}, _block_);
        __thisBlock.__buildBlock(__data);
        _model_[_parameter_.__blocks][__blockName]              = __thisBlock;
    },
    __deleteBlock: function(__blockName) {
        // TODO: Check model first
        delete _model_[_parameter_.__blocks][__blockName];
    },
    __explodeBlock: function(__blockName) {
        // TODO: Check model first
    },


    /**********************************************************/
    // OBJECTS
    __buildObject: function(__type, __option) {
        var __newObject                          = {
                                                     type:  __type,
                                                     layer: _model_[_parameter_.__layer],
                                                   };
        if (__option){
            __newObject[_parameter_.__option]                   = __option;
        }
        if (_user_[_parameter_.__color] !== this.__layerOption) {
            __newObject[_parameter_.__color]                    = _user_[_parameter_.__color];
        }
        if (_utils_.__typeToClass[__type] !== _text_.__moduleName) {
            if (_model_[_parameter_.__lineType] !== this.__layerOption) {
                __newObject[_parameter_.__lineType]             = _model_[_parameter_.__lineType];
            }
            if (_model_[_parameter_.__lineWidth] !== this.__layerOption) {
                __newObject[_parameter_.__lineWidth]            = _model_[_parameter_.__lineWidth];
            }
            if (_model_[_parameter_.__objectLineTypeScale] !== 1.0) {
                __newObject[_parameter_.__lineTypeScale]        = _model_[_parameter_.__objectLineTypeScale];
            }
        }
        return __newObject;
    },
    __addObject: function(__thisObject) {
        __thisId                             = _utils_.__buildId(_model_[_parameter_.__list]);
        _model_[_parameter_.__list][__thisId]               = __thisObject;
    },
    __removeObjects: function() {
        if (_selection_.__selectionSet) {
            $.each( _selection_.__selectionSet, function( __index, __thisId ) {
                delete _model_[_parameter_.__list][__thisId];
            });
            _selection_.__clearSelection();
        } else if (_anchor_.__anchorIds) {
            $.each( _anchor_.__anchorIds, function( __index, __thisId ) {
                delete _model_[_parameter_.__list][__thisId];
            });
            _anchor_.__resetEditObjectProperties(true);
        } else {
            _paint_.__paintEntry();
        }
    },
    __getObjectById: function(__thisId) {
        return _model_[_parameter_.__list][__thisId];
    },
    __cleanList: function(__thisList) {
        var __objectIndex                        = -1;
        $.each( __thisList, function( __thisId, __thisObject ) {
            __objectIndex                       += 1;
            var __newObjectId                    = ('000' + __objectIndex);
            __newObjectId                        = __newObjectId.substring(__newObjectId.length - 4);
            if (__newObjectId !== __thisId) {
                Object.defineProperty(__thisList, __newObjectId, Object.getOwnPropertyDescriptor(__thisList, __thisId));
                delete __thisList[__thisId];
            }
        });
        _paint_.__paintEntry();
    },


    /**********************************************************/
        /* DEBUG PROCEDURE */
    __showModel: function() {
        this.__buildInfoPage(_model_);
   },
    __showObject: function() {
        var __thisId                             = _anchor_.__anchorIds[0];
        var __thisObject                         = _model_[_parameter_.__list][__thisId];
        this.__buildInfoPage(__thisObject);
    },

    __buildInfoPage: function(__thisObject) {
        var __objectString                       = '';
        __objectString                          += '<!DOCTYPE html>';
        __objectString                          += '<html>';
        __objectString                          += ' <head>';
        __objectString                          += '  <title>CAD Model</title>';
        __objectString                          += '  <meta http-equiv="content-type" content="text/html; charset=UTF-8" />';
        __objectString                          += '  <meta http-equiv="X-UA-Compatible" content="IE=edge; chrome=1" />';
        __objectString                          += '  <link rel="stylesheet" href="http://code.jquery.com/mobile/1.5.0-rc1/jquery.mobile-1.5.0-rc1.min.css" />';
        __objectString                          += '  <link rel="stylesheet" href="_css/cad.css" />';
		__objectString                          += ' </head>';
        __objectString                          += ' <body style="overflow: auto;">';
        __objectString                          += '  <div type="button" style="color:red; cursor: pointer;" onclick="toggleAllCollapsible();">Toggle all collapsible elements.</div>';
        __objectString                          += this.__buildInfoSegment(__thisObject);
        __objectString                          += '  <script type="text/javascript">';
        __objectString                          += '   var toggledMode = "none";';
        __objectString                          += '   function toggleAllCollapsible() {';
        __objectString                          += '    toggledMode              = (toggledMode === "none")?"block":"none";';
        __objectString                          += '    var collapsibleElements  = document.getElementsByClassName("collapsible");';
        __objectString                          += '    for (var index = 0; index < collapsibleElements.length; index += 1) {';
        __objectString                          += '     var collapsibleElement  = collapsibleElements[index];';
        __objectString                          += '     var contentElement      = collapsibleElement.nextElementSibling;';
        __objectString                          += '     contentElement.style.display = toggledMode';
        __objectString                          += '    };';
        __objectString                          += '   };';
        __objectString                          += '   function toggleActive(currentElement) {';
        __objectString                          += '    var content           = currentElement.nextElementSibling;';
        __objectString                          += '    content.style.display = (content.style.display === "block")?"none":"block";';
        __objectString                          += '   };';
        __objectString                          += '  </script>';
        __objectString                          += ' </body>';
        __objectString                          += '</html>';
        var __newWindow                          = window.open();
        __newWindow.document.write(__objectString);
    },
    __buildInfoSegment: function(__thisObject) {
        try {
            if (Object.keys(__thisObject).length === 0) {
                return '<div>(empty)</div>';
            } else {
                var __currentObjectString            = '';
                $.each( __thisObject, function( __thisPropertyName, __thisPropertyValue ) {
                    if (__thisPropertyValue === null) {
                        __currentObjectString       += '<div>' + __thisPropertyName + ': (null)</div>';
                    } else if ((typeof __thisPropertyValue === 'object') && (__thisPropertyName !== _parameter_.__img)) {
                        if (Object.keys(__thisPropertyValue).length === 0) {
                            __currentObjectString       += '<div>' + __thisPropertyName + ': (Empty)</div>';
                        } else {
                            __currentObjectString       += '<div type="button" class="collapsible" onclick="toggleActive(this);">' + __thisPropertyName + '-></div>';
                            __currentObjectString       += '<div class="content">';
                            __currentObjectString       += _modelTools_.__buildInfoSegment(__thisPropertyValue);
                            __currentObjectString       += '</div>';
                        }
                    } else {
                        __currentObjectString       += '<div>' + __thisPropertyName + _parameter_.__colonSpace + __thisPropertyValue + '</div>';
                    }
                });
                return __currentObjectString;
            }
        } catch(ex) {
            alert(ex.message);
        }

    },

};
