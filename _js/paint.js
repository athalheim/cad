var _paint_ = {

    // Properties:
    __moduleName:                   '_paint_',
    __cadContext:                   null,
    // Toggles
    __isLimitsShown:                false,
    __isPaintingImagesFirst:        false,
    __isImageFrameVisible:          true,
    __isRestrictedTextFrameVisible: false,
    __isPaintBackgroundWhite:       true,
    __isPrinting:                   false,
    __isTemplate:                   false,

    // Colors
    __colorWhite:                   'white',
    __colorBlack:                   _parameter_.__black,
    __paintBackground:              null,
    __paintArea:                    null,
    __selectionColor:               _parameter_.__red,
    __minimalLineWidth:             1,

    /* ************************************************************* */
    // Procedures:
    __toggleWhiteBackground: function() {
        this.__isPaintBackgroundWhite              = !this.__isPaintBackgroundWhite;
        this.__paintEntry();
    },

    __isObjectPrinted: function(__thisObject) {
        if (this.__isPrinting) {
            var __thisLayerName                    = __thisObject[_parameter_.__layer];
            var __thisLayer                        = _model_[_parameter_.__layers][__thisLayerName];
            return __thisLayer[_parameter_.__isPrintable];
        }
        return true;
    },


    /* ************************************************************* */
    __setColor: function(__thisObject, __thisId, __insertColor) {
        var __objectLayer                                  = _model_[_parameter_.__layers][__thisObject[_parameter_.__layer]];
        var __objectColor                                  = __objectLayer[_parameter_.__color];
        if (__insertColor) {
            __objectColor                                  = __insertColor;
        } else if (this.__isTemplate) {
            // Do nothing
        } else if (_selection_.__isItemSelected(__thisId)) {
            __objectColor                                  = this.__selectionColor;
        } else if (__thisObject[_parameter_.__color]) {
            if (__thisObject[_parameter_.__color] !== _parameter_.__layerOptionDefault) {
                __objectColor                              = __thisObject[_parameter_.__color];
            }
        }
        if (__objectColor === this.__paintBackground) {
            __objectColor                                  = (this.__paintBackground === this.__colorWhite)? this.__colorBlack: this.__colorWhite;
        }
        this.__cadContext[_parameter_.__fillStyle]         = __objectColor;
        this.__cadContext[_parameter_.__strokeStyle]       = __objectColor;
    },
    __setLineDash: function(__thisObject) {
        var __thisLayer                                    = _model_[_parameter_.__layers][__thisObject[_parameter_.__layer]];
        var __thisLineType                                 = __thisLayer[_parameter_.__lineType]?__thisLayer[_parameter_.__lineType]:'solid';
        if (__thisObject[_parameter_.__lineType]) {
            if (__thisObject[_parameter_.__lineType] !== _parameter_.__layerOptionDefault ) {
                __thisLineType                             = __thisObject[_parameter_.__lineType];
            }
        }
            // Line dash
        if (__thisLineType !== 'solid') {
            var __lineDash                                 = _model_[_parameter_.__lineTypes][__thisLineType];
            var __layerLineTypeScale                       = __thisLayer[_parameter_.__lineTypeScale];
            var __objectLineTypeScale                      = __thisObject[_parameter_.__lineTypeScale]?__thisObject[_parameter_.__lineTypeScale]:1.0;
            var __scaledLineDash                           = this.__scaleLineDash(__lineDash, __layerLineTypeScale, __objectLineTypeScale);
            this.__cadContext.setLineDash(__scaledLineDash);
        }
    },
    __scaleLineDash: function(__lineDash, __layerLineTypeScale, __objectLineTypeScale) {
        var __modelLineTypeDash                            = this.__scaleLevelLineDash(__lineDash,          _model_[_parameter_.__lineTypeScale]);
        var __layerLineTypeDash                            = this.__scaleLevelLineDash(__modelLineTypeDash, __layerLineTypeScale);
        return  this.__scaleLevelLineDash(__layerLineTypeDash, __objectLineTypeScale);
    },
    __scaleLevelLineDash: function(__lineDash, __ltScale) {
        if (__lineDash) {
            if (__ltScale === _parameter_.__layerOptionDefault) {
                return __lineDash;
            } else if (__ltScale) {
                var __scaledLineDash                       = [];
                $.each( __lineDash, function( __index, __value ){
                    __scaledLineDash.push(__value * __ltScale);
                }); 
                return __scaledLineDash;
            } else {
                return __lineDash;
            }
        }

    },
    __setLineWidth: function(__thisObject) {
            // Set line size with precedence to this object line size
        var __thisLayer                                    = _model_[_parameter_.__layers][__thisObject[_parameter_.__layer]];
        var __lineWidth                                    = __thisLayer[_parameter_.__lineWidth];
        if (__thisObject[_parameter_.__lineWidth]) {
            if (__thisObject[_parameter_.__lineWidth] !== _parameter_.__layerOptionDefault) {
                __lineWidth                                = __thisObject[_parameter_.__lineWidth];
            }
        }
        // Make sure is line visible (at least 1 pixel wide)
        this.__cadContext[_parameter_.__lineWidth] = Math.max(this.__minimalLineWidth, __lineWidth);
    },
    __setFont: function(__thisObject, __fontSize) {
        var __thisFontStyle                                = _model_[_parameter_.__fontStyles][__thisObject[_parameter_.__fontStyle]];
        var __fontString                                   = '';
        if (__thisFontStyle[_parameter_.__fontWeight] !== _parameter_.__regular) { 
            __fontString                                   = __thisFontStyle[_parameter_.__fontWeight] + _parameter_.__space;
        }
        if (!__fontSize) {
            __fontSize                                     = __thisObject[_parameter_.__fontSize];
        }
        __fontString                                      += __fontSize + _parameter_.__pxSpace + __thisFontStyle[_parameter_.__fontName];
        this.__cadContext[_parameter_.__font]              = __fontString;
    },
    __setIncrementalText: function(__textString, __increment) {
        if (__textString.length > 1) {
            return __textString;
        } else if (isNaN(__textString)) {
            return String.fromCharCode(__textString.charCodeAt(0) + __increment);
        } else {
            return (parseInt(__textString) + __increment);
        }
    },
    __setTextAlignment: function(__thisObject) {
        this.__cadContext[_parameter_.__textAlign]         = __thisObject[_parameter_.__hAlign]? __thisObject[_parameter_.__hAlign]:_parameter_.__start;
        this.__cadContext[_parameter_.__textBaseline]      = __thisObject[_parameter_.__vAlign]? __thisObject[_parameter_.__vAlign]:_parameter_.__alphabetic;
    },
    __setCalloutAlignment: function(__thisObject) {
        this.__cadContext[_parameter_.__textBaseline]      = _parameter_.__middle;
        this.__cadContext[_parameter_.__textAlign]         = _parameter_.__start;
        if (__thisObject[_parameter_.__origin].x < __thisObject[_parameter_.__arrow].x) {
            this.__cadContext[_parameter_.__textAlign]     = _parameter_.__end;
        }
    },

    // Common paint procedures
    __save:       function()                                                       { _paint_.__cadContext.save();    },
    __translate:  function(__xValue, __yValue)                                     { _paint_.__cadContext.translate(__xValue, __yValue);    },
    __scale:      function(__xValue, __yValue)                                     { _paint_.__cadContext.scale(__xValue, __yValue);    },
    __rotate:     function(__rotation)                                             { _paint_.__cadContext.rotate(__rotation);    },
    __fillText:   function(__content, __xValue, __yValue)                          { _paint_.__cadContext.fillText(__content, __xValue, __yValue);    },
    __beginPath:  function()                                                       { _paint_.__cadContext.beginPath();    },
    __moveTo:     function(__xValue, __yValue)                                     { _paint_.__cadContext.moveTo(__xValue, __yValue);    },
    __lineTo:     function(__xValue, __yValue)                                     { _paint_.__cadContext.lineTo(__xValue, __yValue);    },
    __arcTo:      function(__xValue, __yValue, __radius, __startAngle, __endAngle) { _paint_.__cadContext.arc(__xValue, __yValue, __radius, __startAngle, __endAngle);    },
    __strokeRect: function(__xValue, __yValue, __width, __height)                  { _paint_.__cadContext.strokeRect(__xValue, __yValue, __width, __height);    },
    __fillRect:   function(__xValue, __yValue, __width, __height)                  { _paint_.__cadContext.fillRect(__xValue, __yValue, __width, __height);    },
    __closePath:  function()                                                       { _paint_.__cadContext.closePath();    },
    __stroke:     function()                                                       { _paint_.__cadContext.stroke();    },
    __restore:    function()                                                       { _paint_.__cadContext.restore();    },


    /* ************************************************************* */
    // PAINT procedures entry point
    __paintEntry: function(__printCanvas) {
        this.__isPrinting                        = (__printCanvas !== undefined);
        this.__cadContext                        = null;
        if (__printCanvas) {
            this.__cadContext                    = _utils_.__getCanvasContext(__printCanvas);
            this.__paintArea                     = _view_.__setViewScaleAndArea(__printCanvas, _model_[_parameter_.__limits]);
            this.__paintBackground               = this.__colorWhite;
        } else {
            this.__cadContext                    = _utils_.__getCanvasContext();
            this.__paintArea                     = _view_.__area;
            this.__paintBackground               = this.__isPaintBackgroundWhite?this.__colorWhite:this.__colorBlack;
        }
        this.__clearCanvas();
        this.__translate((-this.__paintArea.x * this.__paintArea[_parameter_.__scale]), ((this.__paintArea.y + this.__paintArea[_parameter_.__height]) * this.__paintArea[_parameter_.__scale]));
        this.__scale(this.__paintArea[_parameter_.__scale], -this.__paintArea[_parameter_.__scale]);
        // Context
        this.__paintTemplate();
        this.__minimalLineWidth                  = (1.0 / this.__paintArea[_parameter_.__scale]);
        this.__paintLimits();
        this.__paintGrid();
        // Data:
        this.__paintImagesFirst();
        this.__paintModel();
        this.__paintDimensions();
        this.__cadContext.setTransform(1, 0, 0, 1, 0, 0);
        this.__cadContext                        = null;
        this.__storeCurrentView();
        if (__printCanvas) {
            this.__paintPrint(__printCanvas);
        }
    },


    /* ********************************************************************************** */
    // First-level Paint Procedures
    __clearCanvas: function() {
        var __cadCanvas                          = _utils_.__getCanvasElement();
        this.__cadContext[_parameter_.__fillStyle]                   = this.__paintBackground;
        this.__fillRect(0, 0, __cadCanvas[_parameter_.__width], __cadCanvas[_parameter_.__height]);
    },
    __paintTemplate: function() {
        this.__isTemplate                        = true;
        if (_model_[_parameter_.__template]) {
            if (_modelTools_.__isListStarted(_model_[_parameter_.__template])) {
                this.__minimalLineWidth          = (1.0 / this.__paintArea[_parameter_.__scale] / _model_[_parameter_.__template][_parameter_.__scale]);
                this.__save();
                this.__translate(_model_[_parameter_.__template][_parameter_.__origin].x, _model_[_parameter_.__template][_parameter_.__origin].y);
                this.__scale(_model_[_parameter_.__template][_parameter_.__scale], _model_[_parameter_.__template][_parameter_.__scale]);
                $.each( _model_[_parameter_.__template][_parameter_.__list], function( __thisId, __thisObject ) {
                    if (__thisObject[_parameter_.__type] === _image_.__imageType) {
                        _paint_.__paintObject_Image(__thisObject);
                    } else {
                        _paint_.__paintObjectEntry(__thisObject, __thisId, null);
                    }
                });
                this.__restore();
            }
        }
        this.__isTemplate                        = false;
    },
    __paintLimits: function() {
        if (this.__isLimitsShown) {
            this.__cadContext[_parameter_.__lineWidth]  = (1 / this.__paintArea[_parameter_.__scale]);
            this.__cadContext[_parameter_.__strokeStyle] = "red";
            this.__strokeRect(_model_[_parameter_.__limits].x, _model_[_parameter_.__limits].y,  _model_[_parameter_.__limits][_parameter_.__width], _model_[_parameter_.__limits][_parameter_.__height]);
         }
    },
    __paintGrid: function() {
        if (_grid_.__isGridVisible) {
            this.__cadContext[_parameter_.__fillStyle]  = _grid_.__gridColor;
            for (var __indexX = 0; __indexX <= _grid_.__gridCountX; __indexX += 1) {
                var x                            = _grid_.__gridOrigin.x + (_grid_.__gridXspacing * __indexX);
                for (var __indexY = 0; __indexY <= _grid_.__gridCountY; __indexY += 1) {
                    var y                        = _grid_.__gridOrigin.x + (_grid_.__gridYspacing * __indexY);
                    this.__fillRect(x, y,  _grid_.__gridDotSize, _grid_.__gridDotSize);
                }
            }
        }
    },
    __paintImagesFirst: function() {
        if (_modelTools_.__isListStarted(_model_)) {
            if (this.__isPaintingImagesFirst) {
                $.each( _model_[_parameter_.__list], function( __thisId, __thisObject ) {
                    if (__thisObject[_parameter_.__type] === _image_.__imageType) {
                        if (_paint_.__isObjectPrinted(__thisObject)) {
                            _paint_.__paintObject_Image(__thisObject);
                        }
                    }
                });
            }
        }
    },
    __paintModel: function() {
        $.each( _model_[_parameter_.__list], function( __thisId, __thisObject ) {
            if (_paint_.__isObjectPrinted(__thisObject)) {
                if (__thisObject[_parameter_.__type] === _insert_.__insertType) {
                    _paint_.__paintObject_insert(__thisObject);
                } else if ((__thisObject[_parameter_.__type] === _image_.__imageType) && !this.__isPaintingImagesFirst) {
                    _paint_.__paintObject_Image(__thisObject);
                } else {
                    _paint_.__paintObjectEntry(__thisObject, __thisId, null);
                }
            }
        });
    },
    __paintDimensions: function() {
        if (_model_[_parameter_.__dimension]) {
            if (_modelTools_.__isListStarted(_model_[_parameter_.__dimension])) {
                this.__cadContext[_parameter_.__strokeStyle]         = _user_[_parameter_.__dimensionColor];
                this.__cadContext[_parameter_.__lineWidth]           = (1.0 / this.__paintArea[_parameter_.__scale]);
                this.__cadContext[_parameter_.__fillStyle]           = _user_[_parameter_.__dimensionColor];
                this.__cadContext[_parameter_.__textAlign]           = _parameter_.__center;
                this.__cadContext[_parameter_.__textBaseline] = _parameter_.__middle;
                this.__cadContext[_parameter_.__font]                = (_model_[_parameter_.__dimension][_parameter_.__fontSize] + _parameter_.__pxSpace + _user_[_parameter_.__dimensionFontName]);
                $.each( _model_[_parameter_.__dimension][_parameter_.__list], function( __thisDimensionId, __thisDimension ) {
                    if (_paint_.__isObjectPrinted(__thisDimension)) {
                        $.each( __thisDimension.__computedPoints, function( __index, __pointData ) {
                            switch(__pointData[0]) {
                                case _dimension_.__lineType:
                                    var p = __pointData[1];
                                    var q = __pointData[2];
                                    _paint_.__beginPath();
                                    _paint_.__moveTo(p.x, p.y);
                                    _paint_.__lineTo(q.x, q.y);
                                    _paint_.__stroke();
                                    break;
                                case _dimension_.__arcType:
                                    var __center =__pointData[1];
                                    _paint_.__beginPath();
                                    _paint_.__arcTo(__center.x, __center.y, __pointData[2], __pointData[3], __pointData[4]);
                                    _paint_.__stroke();
                                    break;
                                default:
                                    _paint_.__paintText(__pointData[1], 0, __pointData[2]);
                            }
                        });
                    }
                });
            }
        }
    },
    __storeCurrentView: function() {
        var __cadCanvas                          = _utils_.__getCanvasElement();
        _view_.__currentView                     = _utils_.__createElementByTag([_parameter_.__canvas]);
        _view_.__currentView[_parameter_.__width]   = __cadCanvas[_parameter_.__width];
        _view_.__currentView[_parameter_.__height]  = __cadCanvas[_parameter_.__height];
        var __currentContext                     = _utils_.__getCanvasContext(_view_.__currentView);
        __currentContext.drawImage( __cadCanvas, 0, 0);
        __currentContext                         = null;
    },
    __paintPrint: function(__printCanvas) {
        var __base64Image                        = __printCanvas.toDataURL('image/png');
        var __htmlString                         = '<!DOCTYPE html>';
        __htmlString                            += ' <html>';
        __htmlString                            += ' <head>';
        __htmlString                            += '  <title>' + _messages_.__getMessage('print') + _model_[_parameter_.__name] + '</title>';
        __htmlString                            += ' </head>';
        __htmlString                            += ' <body>';
        __htmlString                            += '  <img style="width:100%; height:100%;" src="' + __base64Image + '"></img>';
        __htmlString                            += ' </body>';
        __htmlString                            += ' <script type="text/javascript">';
        __htmlString                            += '  window.setTimeout(print, 1000);';
        __htmlString                            += ' </script>';
        __htmlString                            += '</html>';
        var __newWindow                          = window.open('about:blank');
        __newWindow.document.write(__htmlString);
    },


    /* ********************************************************************************** */
    // Second-level Paint Procedures
    __paintObject_insert: function(__thisInsert) {
        this.__save();
        this.__translate(__thisInsert.x, __thisInsert.y);
        this.__scale(__thisInsert[_parameter_.__xScale], __thisInsert[_parameter_.__yScale]);
        this.__rotate(__thisInsert[_parameter_.__rotation]);
        var __blockDefinition                  = _model_[_parameter_.__blocks][__thisInsert[_parameter_.__name]];
        $.each( __blockDefinition[_parameter_.__list], function( __thisId, __blockObject ) {
            if (_paint_.__isObjectPrinted(__blockObject)) {
                if (__blockObject[_parameter_.__type] === _insert_.__insertType) {
                    _paint_.__paintObject_insert(__blockObject);
                } else if (__blockObject[_parameter_.__type] === _image_.__imageType) {
                    _paint_.__paintObject_Image(__blockObject);
                } else {
                    _paint_.__paintObjectEntry(__blockObject, null, __blockObject[_parameter_.__color]);
                }
            }
        });
        this.__restore();
    },
    __paintObject_Image: function(__thisImage) {
            var __origin                           = _utils_.__setDirectionPoint(__thisImage[_parameter_.__origin], (__thisImage[_parameter_.__rotation] + (Math.PI * 0.5)), __thisImage[_parameter_.__height]);
            this.__save();
            this.__translate(__origin.x, __origin.y);
            this.__scale(1.0, -1.0);
            this.__rotate(-__thisImage[_parameter_.__rotation]);
            this.__cadContext.drawImage(__thisImage[_parameter_.__img], 0, 0, __thisImage[_parameter_.__width], __thisImage[_parameter_.__height]);
            if (this.__isImageFrameVisible) {
                this.__strokeRect(0, 0, __thisImage[_parameter_.__width], __thisImage[_parameter_.__height]);
            }
            this.__restore();

    },
    __paintObjectEntry: function(__thisObject, __thisId, __insertColor) {
        this.__save();
        this.__setColor(__thisObject, __thisId, __insertColor);
        this.__setLineDash(__thisObject);
        this.__setLineWidth(__thisObject);
        switch(_utils_.__typeToClass[__thisObject[_parameter_.__type]]) {
            case       _arc_.__moduleName:  this.__paintObjectArc(__thisObject);                 break;
            case    _circle_.__moduleName:  this.__paintObjectCircle(__thisObject);              break;
            case   _ellipse_.__moduleName:  this.__paintObjectEllipse(__thisObject);             break;
            case      _line_.__moduleName:  this.__paintObjectLine(__thisObject);                break;
            case    _sketch_.__moduleName:  this.__paintObjectSketch(__thisObject);              break;
            case  _polyline_.__moduleName:  this.__paintObjectPolyline(__thisObject);            break;
            case _rectangle_.__moduleName:  this.__paintObjectRectangle(__thisObject);           break;
            case      _text_.__moduleName:  this.__paintObjectText(__thisObject);                break;
            default:                        _events_.__callError(this.__moduleName, 'Unsupported object type: ' + __thisObject[_parameter_.__type]);
        }
        // Restore solid line type
        this.__restore();
    },


    /* ********************************************************************************** */
    // Third-level Paint Procedures: Single objects:
    // CURVES: ARC, CIRCLE, ELLIPSE
    __paintObjectArc: function(__thisObject) {
        if (_utils_.__ownsProperty(__thisObject, _parameter_.__arrayCenter)) {
            // TODO
        } else if (_utils_.__ownsProperty(__thisObject, _parameter_.__arrayColumns)) {
            var __arrayPoints                        = _array_.__buildRectangularArrayPoints(__thisObject);
            $.each( __arrayPoints, function( __index, __deltaPoint ) {
                _paint_.__beginPath();
                _paint_.__arcTo(__thisObject[_parameter_.__origin].x + __deltaPoint.x, __thisObject[_parameter_.__origin].y + __deltaPoint.y, __thisObject[_parameter_.__radius], __thisObject[_parameter_.__startAngle], __thisObject[_parameter_.__endAngle]);
                _paint_.__stroke();
            });
        } else {
            _paint_.__beginPath();
            _paint_.__arcTo(__thisObject[_parameter_.__origin].x, __thisObject[_parameter_.__origin].y, __thisObject[_parameter_.__radius], __thisObject[_parameter_.__startAngle], __thisObject[_parameter_.__endAngle]);
            _paint_.__stroke();
        }
    },

    __paintObjectCircle: function(__thisObject) {
        this.__beginPath();
        this.__arcTo(__thisObject[_parameter_.__origin].x, __thisObject[_parameter_.__origin].y, __thisObject[_parameter_.__radius], 0, (Math.PI * 2.0));
        this.__stroke();
    },
    __paintObjectEllipse: function(__thisObject) {
        this.__save();
        this.__translate(__thisObject[_parameter_.__origin].x, __thisObject[_parameter_.__origin].y);
        this.__rotate(__thisObject[_parameter_.__rotation]);
        this.__beginPath();
        this.__cadContext.ellipse(0, 0, __thisObject[_parameter_.__xRadius], __thisObject[_parameter_.__yRadius], 0, __thisObject[_parameter_.__startAngle], __thisObject[_parameter_.__endAngle]);
        this.__stroke();
        this.__restore();
    },

    // POLYLINE: LINE, POLYLINE, POLYGON, SKETCH
    __paintObjectLine: function(__thisObject) {
        if (_utils_.__ownsProperty(__thisObject, _parameter_.__arrayCenter)) {
            // TODO
        } else if (_utils_.__ownsProperty(__thisObject, _parameter_.__arrayColumns)) {
            var __arrayPoints                        = _array_.__buildRectangularArrayPoints(__thisObject);
            $.each( __arrayPoints, function( __index, __deltaPoint ) {
                _paint_.__beginPath();
                _paint_.__moveTo(__thisObject[_parameter_.__origin].x    + __deltaPoint.x, __thisObject[_parameter_.__origin].y    + __deltaPoint.y);
                _paint_.__lineTo(__thisObject[_parameter_.__points][0].x + __deltaPoint.x, __thisObject[_parameter_.__points][0].y + __deltaPoint.y);
                _paint_.__stroke();
            });
        } else {
            _paint_.__beginPath();
            _paint_.__moveTo(__thisObject[_parameter_.__origin].x   , __thisObject[_parameter_.__origin].y);
            _paint_.__lineTo(__thisObject[_parameter_.__points][0].x, __thisObject[_parameter_.__points][0].y);
            _paint_.__stroke();
        }
    },
    __paintObjectSketch: function(__thisObject) {
        this.__beginPath();
        this.__moveTo(__thisObject[_parameter_.__origin].x, __thisObject[_parameter_.__origin].y);
        $.each( __thisObject[_parameter_.__points], function( __pointIndex, __thisPoint ){
            _paint_.__lineTo(__thisPoint.x, __thisPoint.y);
        });
        this.__stroke();
    },
    __paintObjectPolyline: function(__thisObject) {
        if (_utils_.__ownsProperty(__thisObject, _parameter_.__arrayCenter)) {
            // TODO
        } else if (_utils_.__ownsProperty(__thisObject, _parameter_.__arrayColumns)) {
            var __arrayPoints                        = _array_.__buildRectangularArrayPoints(__thisObject);
            $.each( __arrayPoints, function( __index, __deltaPoint ) {
                _paint_.__paintObjectPolylineSingle(__thisObject, __deltaPoint);
            });
        } else {
            _paint_.__paintObjectPolylineSingle(__thisObject, {x:0, y:0});
        }

    },
    __paintObjectPolylineSingle: function(__thisObject, __deltaPoint) {
        _paint_.__beginPath();
        if (_utils_.__ownsProperty(__thisObject, _parameter_.__sideCount)) {
            var __currentPoint           = __thisObject[_parameter_.__polygonPoints][0];
            _paint_.__moveTo(__currentPoint.x + __deltaPoint.x, __currentPoint.y + __deltaPoint.y);
            for (var __pointIndex = 1; __pointIndex < __thisObject[_parameter_.__polygonPoints].length; __pointIndex += 1) {
                __currentPoint           = __thisObject[_parameter_.__polygonPoints][__pointIndex];
                _paint_.__lineTo(__currentPoint.x + __deltaPoint.x, __currentPoint.y + __deltaPoint.y);
            }
            _paint_.__closePath();
        } else {
            var __previousDeltaPoint     = _utils_.__addDelta(__thisObject[_parameter_.__origin], __deltaPoint.x, __deltaPoint.y);
            _paint_.__moveTo(__previousDeltaPoint.x, __previousDeltaPoint.y);
                // Loop through all remaining points
            $.each( __thisObject[_parameter_.__points], function( __pointIndex, __thisPoint ){
                var __currentDeltaPoint  = _utils_.__addDelta(__thisPoint, __deltaPoint.x, __deltaPoint.y);
                if (__currentDeltaPoint[_parameter_.__centerX]) {
                    var __center         = {x:__currentDeltaPoint[_parameter_.__centerX], y:__currentDeltaPoint[_parameter_.__centerY]};
                    var __radius         = _utils_.__getDistance(__previousDeltaPoint, __center);
                    var __startAngle     = Math.atan2(__previousDeltaPoint.y - __center.y, __previousDeltaPoint.x - __center.x);
                    var __endAngle       = Math.atan2(__currentDeltaPoint.y - __center.y, __currentDeltaPoint.x - __center.x);
                    _paint_.__arcTo(__center.x, __center.y, __radius, __startAngle, __endAngle, __currentDeltaPoint[_parameter_.__ccw]);
                } else {
                    _paint_.__lineTo(__currentDeltaPoint.x, __currentDeltaPoint.y);
                }
                __previousDeltaPoint     = __currentDeltaPoint;
            });
            if (__thisObject[_parameter_.__type] === _polyline_.__polygonType) {
                _paint_.__closePath();
            }
        }
        _paint_.__stroke();
    },

    // RECTANGLE: SQUARE, RECTANGLE, PARALLELOGRAM, TRAPEZE
    __paintObjectRectangle: function(__thisObject) {
        switch (__thisObject[_parameter_.__type]) {
            case _rectangle_.__squareType:       this.__paintRectangle(__thisObject[_parameter_.__origin].x, __thisObject[_parameter_.__origin].y, __thisObject[_parameter_.__width], __thisObject[_parameter_.__width], __thisObject[_parameter_.__rotation]);   break;
            case _rectangle_.__rectangleType:    this.__paintRectangle(__thisObject[_parameter_.__origin].x, __thisObject[_parameter_.__origin].y, __thisObject[_parameter_.__width], __thisObject[_parameter_.__height], __thisObject[_parameter_.__rotation]);  break;
            default:                             this.__paintParallelogramOrTrapeze(__thisObject);
        }
    },
    __paintRectangle: function(x, y, __width, __height, __rotation) {
        this.__save();
        this.__translate(x, y);
        this.__rotate(__rotation);
        this.__strokeRect(0, 0, __width, __height);
        this.__restore();
    },
    __paintParallelogramOrTrapeze: function(__thisObject, __objectWidth, __objectHeight, __objectAngle, __objectRotation) {
        var __radius                             = 0.0;
        var __deltaX                             = 0.0;
        if (!__objectWidth) {
            __objectWidth                        = __thisObject[_parameter_.__width];
            __objectAngle                        = _utils_.__getDirectionFromData(__thisObject[_parameter_.__summit], __thisObject[_parameter_.__origin]);
            __radius                             = _utils_.__getLengthFromData(__thisObject[_parameter_.__summit], __thisObject[_parameter_.__origin]);
            __objectHeight                       = (__radius * Math.sin(__objectAngle));
            __objectRotation                     = __thisObject[_parameter_.__rotation];
        } else {
            __radius                             = (__objectHeight / Math.sin(__objectAngle));
        }
        __deltaX                                 = (__radius * Math.cos(__objectAngle));
        this.__save();
        this.__translate(__thisObject[_parameter_.__origin].x, __thisObject[_parameter_.__origin].y);
        this.__rotate(__objectRotation);
        this.__beginPath();
        this.__moveTo(0,                         0);
        this.__lineTo(__deltaX,                    __objectHeight);
        if (__thisObject[_parameter_.__type] === _rectangle_.__parallelogramType) {
            this.__lineTo(__thisObject[_parameter_.__width] + __deltaX, __objectHeight);
        } else {
            this.__lineTo(__thisObject[_parameter_.__width] - __deltaX, __objectHeight);
        }
        this.__lineTo(__thisObject[_parameter_.__width],          0);
        this.__closePath();
        this.__stroke();
        this.__restore();
    },

    // TEXT: CALLOUT, RESTRICTED TEXT, MULTILINE TEXT, SIMPLE TEXT
    __paintObjectText: function(__thisObject) {
        switch(__thisObject[_parameter_.__type]) {
            case _text_.__textCallout:           this.__paintObjectCallout(__thisObject);        break;
            case _text_.__textRestricted:        this.__paintObjectRestrictedText(__thisObject); break;
            case _text_.__textMultiline:         this.__paintObjectMultilineText(__thisObject);  break;
            default:                             this.__paintObjectSimpleText(__thisObject);
        }
    },
    // Fourth-level Paint Procedures: Text objects:
    __paintObjectCallout: function(__thisObject) {
        this.__paintCalloutLeader(__thisObject);
        this.__setCalloutAlignment(__thisObject);
        this.__setFont(__thisObject);
        this.__paintText(__thisObject[_parameter_.__origin], __thisObject[_parameter_.__rotation], __thisObject[_parameter_.__content]);
    },
    __paintObjectRestrictedText: function(__thisObject, ) {
        var __diagonalDirection                  = Math.atan2((__thisObject[_parameter_.__oppositeCorner].y - __thisObject[_parameter_.__origin].y), (__thisObject[_parameter_.__oppositeCorner].x - __thisObject[_parameter_.__origin].x));
        var __diagonalLength                     = _utils_.__getDistance(__thisObject[_parameter_.__oppositeCorner], __thisObject[_parameter_.__origin]);
        var __rectangleWidth                     = Math.cos(__diagonalDirection) * __diagonalLength;
        var __rectangleHeight                    = Math.sin(__diagonalDirection) * __diagonalLength;

        if (this.__isRestrictedTextFrameVisible) {
            this.__paintRectangle(__thisObject[_parameter_.__origin].x, __thisObject[_parameter_.__origin].y, __rectangleWidth, __rectangleHeight, __thisObject[_parameter_.__rotation]);
        }
        this.__setFont(__thisObject, __rectangleHeight);
        var __fontStyle                          = _model_[_parameter_.__fontStyles][__thisObject[_parameter_.__fontStyle]];
        var __fontName                           = __fontStyle[_parameter_.__fontName];
        var __textWidth                          = _utils_.__getTextWidth(__fontName, __rectangleHeight, __thisObject[_parameter_.__content]);
        // scale and Ylocation
        var __scaleX                             = ( __rectangleWidth / __textWidth);
        var __scaleY                             = -1.0;
        var __Ylocation                          = 0.0;
        if (__thisObject[_parameter_.__content].toUpperCase() === __thisObject[_parameter_.__content]) {
            __scaleY                            *= 1.33;
        } else {
            __Ylocation                          = -(__rectangleHeight * 0.25);
        }
        this.__save();
        this.__translate(__thisObject[_parameter_.__origin].x, __thisObject[_parameter_.__origin].y);
        this.__rotate(__thisObject[_parameter_.__rotation]);
        this.__scale(__scaleX, __scaleY);
        this.__fillText(__thisObject[_parameter_.__content], 0, __Ylocation);
        this.__restore();
    },
    __paintObjectMultilineText: function(__thisObject) {
        this.__setTextAlignment(__thisObject);
        this.__setFont(__thisObject);
        this.__paintMultilineText(__thisObject[_parameter_.__origin], __thisObject[_parameter_.__fontSize], __thisObject[_parameter_.__content]);
    },
    __paintObjectSimpleText: function(__thisObject) {
        this.__setTextAlignment(__thisObject);
        this.__setFont(__thisObject);
        // Loop for all text instances
        if (_utils_.__ownsProperty(__thisObject, _parameter_.Center)) {

        } else if (_utils_.__ownsProperty(__thisObject, _parameter_.__arrayColumns)) {
            var __arrayPoints                        = _array_.__buildRectangularArrayPoints(__thisObject);
            $.each( __arrayPoints, function( __index, __deltaPoint ) {
                var __insertion                  = _utils_.__addDelta(__thisObject[_parameter_.__origin], __deltaPoint.x, __deltaPoint.y);
                var __textString                 = _paint_.__setIncrementalText(__thisObject[_parameter_.__content], __index);
                _paint_.__paintText(__insertion, __thisObject[_parameter_.__rotation], __textString);
            });
        } else {
            _paint_.__paintText(__thisObject[_parameter_.__origin], __thisObject[_parameter_.__rotation], __thisObject[_parameter_.__content]);
        }
    },

    // Fifth-level Paint Procedures: Text objects:
    __paintCalloutLeader: function(__thisObject, __origin) {
        if (!__origin) {
            __origin = __thisObject[_parameter_.__origin];
        }
        // Arrow
        this.__beginPath();
        this.__moveTo(__thisObject[_parameter_.__arrow].x,          __thisObject[_parameter_.__arrow].y);
        this.__lineTo(__thisObject[_parameter_.__arrowBaseLeft].x,  __thisObject[_parameter_.__arrowBaseLeft].y);
        this.__lineTo(__thisObject[_parameter_.__arrowBaseRight].x, __thisObject[_parameter_.__arrowBaseRight].y);
        this.__closePath();
        this.__cadContext.fill();
        // Leader
        this.__beginPath();
        this.__moveTo(__thisObject[_parameter_.__arrow].x, __thisObject[_parameter_.__arrow].y);
        this.__lineTo(__thisObject[_parameter_.__bend].x, __thisObject[_parameter_.__bend].y);
        this.__lineTo(__origin.x, __origin.y);
        this.__stroke();
    },
    __paintText: function(__textPoint, __rotation, __content) {
        this.__save();
        this.__translate(__textPoint.x, __textPoint.y);
        this.__scale(1.0, -1.0);
        this.__rotate(-__rotation);
        this.__fillText(__content, 0, 0);
        this.__restore();
    },
    __paintMultilineText: function(__textPoint, __fontSize, __content) {
        var __textLines                            = __content.split(_parameter_.__newLine);
        $.each( __textLines, function( __index, __textLine ){
            _paint_.__save();
            _paint_.__translate(__textPoint.x, __textPoint.y - (__index * __fontSize));
            _paint_.__scale(1.0, -1.0);
            _paint_.__rotate(0);
            _paint_.__fillText(__textLine, 0, 0);
            _paint_.__restore();
        });
    },

};
