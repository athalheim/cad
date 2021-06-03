var _track_ = {

    __moduleName:                   '_track_',
    __cadContext:                   null,
    __trackColorList:               [_parameter_.__darkRed, _parameter_.__black, _parameter_.__red, _parameter_.__blue, _parameter_.__green, _parameter_.__magenta, _parameter_.__cyan, _parameter_.__lightGray, _parameter_.__gray],
    __chooseTrackColor: function() {
        _inputSingle_.__setPropertyChoiceInput(_parameter_.__color, this.__trackColorList, _user_[_parameter_.__trackColor], true, '_track_.__setTrackColor(__inputValue)');
     },
    __setTrackColor: function() {
        if (!_user_[_parameter_.__trackColor]) {
            _userTools_.__setUserParameter([_parameter_.__trackColor], this.__trackColorList[0]);
        }
        this.__cadContext[_parameter_.__strokeStyle]       = _user_[_parameter_.__trackColor];
        this.__cadContext[_parameter_.__fillStyle]         = _user_[_parameter_.__trackColor];
     },


    __setCalloutAlignment: function(__thisObject) {
        this.__cadContext[_parameter_.__textBaseline]      = _parameter_.__middle;
        this.__cadContext[_parameter_.__textAlign]         = _parameter_.__start;
        if (__thisObject[_parameter_.__origin].x < __thisObject[_parameter_.__arrow].x) {
            this.__cadContext[_parameter_.__textAlign]     = _parameter_.__end;
        }
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
    __setTextAlignment: function(__thisObject) {
        this.__cadContext[_parameter_.__textAlign]         = __thisObject[_parameter_.__hAlign]? __thisObject[_parameter_.__hAlign]:_parameter_.__start;
        this.__cadContext[_parameter_.__textBaseline]      = __thisObject[_parameter_.__vAlign]? __thisObject[_parameter_.__vAlign]:_parameter_.__alphabetic;
    },


    __arc:        function(__xValue, __yValue, __radius, __startAngle, __endAngle, __ccw) {
        _track_.__cadContext.beginPath();
        _track_.__cadContext.arc(__xValue, __yValue, __radius, __startAngle, __endAngle, __ccw);
        _track_.__cadContext.stroke();
    },
    __beginPath:  function()                                      { _track_.__cadContext.beginPath();                                                 },
    __closePath:  function()                                      { _track_.__cadContext.closePath();                                                 },
    __drawImage:  function(__thisImage, __xValue, __yValue)       { _track_.__cadContext.drawImage(__thisImage, __xValue, __yValue);                  },
    __fill:       function()                                      { _track_.__cadContext.fill();                                                      },
    __fillRect:   function(__xValue, __yValue, __width, __height) { _track_.__cadContext.fillRect(__xValue, __yValue, __width, __height);             },
    __fillText:   function(__content, __xValue, __yValue)         { _track_.__cadContext.fillText(__content, __xValue, __yValue);                     },
    __lineTo:     function(__xValue, __yValue)                    { _track_.__cadContext.lineTo(__xValue, __yValue);                                  },
    __moveTo:     function(__xValue, __yValue)                    { _track_.__cadContext.moveTo(__xValue, __yValue);                                  },
    __restore:    function()                                      { _track_.__cadContext.restore();                                                   },
    __rotate:     function(__rotation)                            { _track_.__cadContext.rotate(__rotation);                                          },
    __save:       function()                                      { _track_.__cadContext.save();                                                      },
    __scale:      function(__xValue, __yValue)                    { _track_.__cadContext.scale(__xValue, __yValue);                                   },
    __stroke:     function()                                      { _track_.__cadContext.stroke();                                                    },
    __strokeRect: function(__xValue, __yValue, __width, __height) { _track_.__cadContext.strokeRect(__xValue, __yValue, __width, __height);           },
    __translate:  function(__xValue, __yValue)                    { _track_.__cadContext.translate(__xValue, __yValue);                               },


    /* ******************************************************************* */
    // TRACK ZOOM BOX: Note: zoomBox tracking uses screen coordinates
    __trackZoomBox: function(__area) {
        this.__cadContext                                  = _utils_.__getCanvasContext();
        this.__drawImage(_view_.__currentView, 0, 0);
        this.__cadContext[_parameter_.__lineWidth]         = 1;
        this.__cadContext[_parameter_.__strokeStyle]       = _parameter_.__blue;
        this.__strokeRect(__area.x, __area.y, __area[_parameter_.__width], __area[_parameter_.__height]);
        this.__cadContext                                  = null;
    },

    /* ******************************************************************* */
    // TRACK ALL MODES: Called from 'view's 'processTouchMove' module.
    __trackEntry: function(__mode, __currentPoint) {
        this.__cadContext                                  = _utils_.__getCanvasContext();
        this.__setTrackColor();
        if (_view_.__currentView) {
            this.__drawImage(_view_.__currentView, 0, 0);
        }
        this.__save();
        this.__translate((-_view_.__area.x * _view_.__area[_parameter_.__scale]), ((_view_.__area.y + _view_.__area[_parameter_.__height]) * _view_.__area[_parameter_.__scale]));
        this.__scale(_view_.__area[_parameter_.__scale], -_view_.__area[_parameter_.__scale]);
        this.__cadContext[_parameter_.__lineWidth]         = (1.0 / _view_.__area[_parameter_.__scale]);
        this.__trackAnchors(__currentPoint);
        switch(__mode) {
            case        _add_.__moduleName: this.__trackEntryAdd(__currentPoint);    break;
            case  _dimension_.__moduleName: this.__trackDimension(__currentPoint);   break;
            case     _anchor_.__moduleName: this.__trackAnchorEdit(__currentPoint);  break;
            case       _edit_.__moduleName: this.__trackEdition(__currentPoint);     break;
            case  _selection_.__moduleName: this.__trackSelection(__currentPoint);   break;
            case _modelTools_.__moduleName: this.__trackModel(__currentPoint);       break;
            case      _tools_.__moduleName: this.__trackTools(__currentPoint);       break;
        }
        this.__restore();
        this.__cadContext                                  = null;
    },


    /* ************************************************ */
    // ADD
    __trackEntryAdd: function(__currentPoint) {
        if (((_add_.__currentObject[_parameter_.__type] === _text_.__textCallout) && (_add_.__currentObject[_parameter_.__arrow])) ||
            (_add_.__currentObject[_parameter_.__origin])){
            var __className                                = _utils_.__typeToClass[_add_.__currentObject[_parameter_.__type]];
            switch(__className) {
                case _arc_.__moduleName:         this.__trackEntryArc(      _add_.__currentObject, __currentPoint); break;
                case _circle_.__moduleName:      this.__trackEntryCircle(   _add_.__currentObject, __currentPoint); break;
                case _ellipse_.__moduleName:     this.__trackEntryEllipse(  _add_.__currentObject, __currentPoint); break;
                case _insert_.__moduleName:      this.__trackEntryInsert(   _add_.__currentObject, __currentPoint); break;
                case _line_.__moduleName:        this.__trackEntryLine(     _add_.__currentObject, __currentPoint); break;
                case _sketch_.__moduleName:      this.__trackEntrySketch(   _add_.__currentObject, __currentPoint); break;
                case _image_.__moduleName:       this.__trackEntryImage(    _add_.__currentObject, __currentPoint); break;
                case _polyline_.__moduleName:    this.__trackEntryPolyline( _add_.__currentObject, __currentPoint); break;
                case _rectangle_.__moduleName:   this.__trackEntryRectangle(_add_.__currentObject, __currentPoint); break;
                case _text_.__moduleName:        this.__trackEntryText(     _add_.__currentObject, __currentPoint); break;
            }
        }
    },
    /* ************************************************ */
    __trackEntryInsert: function(__thisObject, __currentPoint) {
        if (__thisInsert[_parameter_.__width]) {
            var __insertHeight                   = 0;
            var __rotation                       = 0;
            if (__thisInsert[_parameter_.__height]) {
                __insertHeight                   = __thisInsert[_parameter_.__height];
                __rotation                       = Math.atan2((__currentPoint.y - __thisInsert[_parameter_.__origin].y), (__currentPoint.x - __thisInsert[_parameter_.__origin].x));
            } else {
                __insertHeight                   = _utils_.__getDistance(__thisInsert[_parameter_.__origin], __currentPoint);
            }
            this.__trackRectangle(__thisInsert[_parameter_.__origin].x, __thisInsert[_parameter_.__origin].y, __thisInsert[_parameter_.__width], __insertHeight, __rotation);
        }
        this.__trackPointer(__thisInsert[_parameter_.__origin], __currentPoint);
    },

    /* ************************************************ */
    __trackEntryArc: function(__thisObject, __currentPoint) {
        switch (__thisObject[_parameter_.__option]) {
            case _arc_.__bulgeOption:            this.__trackEntryArcBulge(__thisObject, __currentPoint);             break;
            case _arc_.__threePointsOption:      this.__trackEntryThreePoints(__thisObject, __currentPoint);          break;
            default:                             this.__trackEntryArcStartEnd(__thisObject, __currentPoint);
        }
    },

    __trackEntryArcBulge: function(__thisObject, __currentPoint) {
        if (__thisObject[_parameter_.__endPoint]) {
            var __center                         = _utils_.__getCenterFromThreePoints(__thisObject[_parameter_.__origin], __currentPoint, __thisObject[_parameter_.__endPoint]);
            var __radius                         = _utils_.__getLengthFromData(__center, __thisObject[_parameter_.__origin]);
            var __startAngle                     = Math.atan2(__thisObject[_parameter_.__origin].y - __center.y, __thisObject[_parameter_.__origin].x - __center.x);
            var __endAngle                       = Math.atan2(__thisObject[_parameter_.__endPoint].y - __center.y, __thisObject[_parameter_.__endPoint].x - __center.x);
            this.__arc(__center.x, __center.y, __radius, __startAngle, __endAngle, __center[_parameter_.__ccw]);
        } else {
            this.__trackPointer(__thisObject[_parameter_.__origin], __currentPoint);
        }
    },
    __trackEntryThreePoints: function(__thisObject, __currentPoint) {
        if (__thisObject[_parameter_.__secondPoint]) {
            var __center                         = _utils_.__getCenterFromThreePoints(__thisObject[_parameter_.__origin], __thisObject[_parameter_.__secondPoint], __currentPoint);
            var __radius                         = _utils_.__getLengthFromData(__center, __thisObject[_parameter_.__origin]);
            var __startAngle                     = Math.atan2(__thisObject[_parameter_.__origin].y - __center.y, __thisObject[_parameter_.__origin].x - __center.x);
            var __endAngle                       = Math.atan2(__currentPoint.y - __center.y, __currentPoint.x - __center.x);
            this.__arc(__center.x, __center.y, __radius, __startAngle, __endAngle, __center[_parameter_.__ccw]);
        } else {
            this.__trackPointer(__thisObject[_parameter_.__origin], __currentPoint);
        }
    },
    __trackEntryArcStartEnd: function(__thisObject, __currentPoint) {
        var __radius                             = 0;
        if (__thisObject[_parameter_.__radius]) {
            __radius                             = __thisObject[_parameter_.__radius];
            if (__thisObject[_parameter_.__startAngle]) {
                var __startVector                = {x: (__thisObject[_parameter_.__origin].x + (__radius * Math.cos(__thisObject[_parameter_.__startAngle]))), y: (__thisObject[_parameter_.__origin].y + (__radius * Math.sin(__thisObject[_parameter_.__startAngle])))};
                this.__trackPointer(__thisObject[_parameter_.__origin], __startVector);
            }
        } else {
            __radius                             = _utils_.__getDistance(__thisObject[_parameter_.__origin], __currentPoint);
        }
        this.__arc(__thisObject[_parameter_.__origin].x, __thisObject[_parameter_.__origin].y, __radius, 0, (Math.PI * 2.0));
        this.__trackPointer(__thisObject[_parameter_.__origin], __currentPoint);
    },

    __trackEntryCircle: function(__thisObject, __currentPoint) {
        switch (__thisObject[_parameter_.__option]) {
            case _circle_.__twoPointsOption:
                var __center                     = _utils_.__getMidPoint(__thisObject[_parameter_.__origin], __currentPoint);
                var __radius                     = _utils_.__getLengthFromData(__center, __thisObject[_parameter_.__origin]);
                this.__arc(__center.x, __center.y, __radius, 0, (Math.PI * 2.0));
                this.__trackPointer(__thisObject[_parameter_.__origin], __currentPoint);
                break;
            case _circle_.__threePointsOption:
                var __center                     = null;
                if (__thisObject[_parameter_.__secondPoint]) {
                    __center                     = _utils_.__getCenterFromThreePoints(__thisObject[_parameter_.__origin], __thisObject[_parameter_.__secondPoint], __currentPoint);
                    this.__trackPointer(__thisObject[_parameter_.__origin],      __thisObject[_parameter_.__secondPoint]);
                    this.__trackPointer(__thisObject[_parameter_.__secondPoint], __currentPoint);
                    this.__trackPointer(__thisObject[_parameter_.__origin],      __currentPoint);
                } else {
                    __center                     = _utils_.__getMidPoint(__thisObject[_parameter_.__origin], __currentPoint);
                    this.__trackPointer(__thisObject[_parameter_.__origin], __currentPoint);
                }
                var __radius                     = _utils_.__getLengthFromData(__center, __thisObject[_parameter_.__origin]);
                this.__arc(__center.x, __center.y, __radius, 0, (Math.PI * 2.0));
                break;
            case _circle_.__boxOption:
                var __center                     = _utils_.__getMidPoint(__thisObject[_parameter_.__origin], __currentPoint);
                var __area                       = _utils_.__getArea(__thisObject[_parameter_.__origin], __currentPoint);
                var __radius                     = Math.min(__area[_parameter_.__width], __area[_parameter_.__height]) * 0.5;
                this.__trackRectangle(__area.x, __area.y, __area[_parameter_.__width], __area[_parameter_.__height], 0);
                this.__arc(__center.x, __center.y, __radius, 0, (Math.PI * 2.0));
                break;
            default:
                var __radius                     = _utils_.__getLengthFromData(__thisObject[_parameter_.__origin], __currentPoint);
                this.__arc(__thisObject[_parameter_.__origin].x, __thisObject[_parameter_.__origin].y, __radius, 0, (Math.PI * 2.0));
                this.__trackPointer(__thisObject[_parameter_.__origin], __currentPoint);
        }
    },
    __trackEntryEllipse: function(__thisObject, __currentPoint) {
        // ellipseCenter: origin,                             xRadius,        yRadius,   rotation
        // ellipseArc:    origin,                             xRadius,        yRadius,   rotation, startAngle, endAngle, ccw
        // ellipseBox:    origin, oppositeCorner,                                        rotation
        if (__thisObject[_parameter_.__option] === _ellipse_.__boxOption) {
            if (_utils_.__getDistance(__thisObject[_parameter_.__origin], __currentPoint) === 0.0) {
                return;
            }
            var __area                           = null;
            if (_utils_.__ownsProperty(__thisObject, _parameter_.__oppositeCorner)) {
                __area                           = _utils_.__getArea(__thisObject[_parameter_.__origin], __thisObject[_parameter_.__oppositeCorner]);
            } else {
                __area                           = _utils_.__getArea(__thisObject[_parameter_.__origin], __currentPoint);
            }
            if ((__area[_parameter_.__width] === 0.0) || (__area[_parameter_.__height] === 0.0)) {
                return;
            }
            var __xRadius                        = (__area[_parameter_.__width] * 0.5);
            var __yRadius                        = (__area[_parameter_.__height] * 0.5);
            var __center                         = {
                                                    x: __area.x + __xRadius, 
                                                    y: __area.y + __yRadius,
                                                   };
            var __rotation                       = 0.0;
            if (_utils_.__ownsProperty(__thisObject, _parameter_.__oppositeCorner)) {
                __rotation                       = Math.atan2(__currentPoint.y - __center.y, __currentPoint.x - __center.x);
                this.__trackPointer(__center, __currentPoint);
            } else {
                this.__trackRectangle(__area.x, __area.y, __area[_parameter_.__width], __area[_parameter_.__height], __rotation);
            }
            this.__trackEllipseConstruction(__center, __xRadius, __yRadius, __rotation);
        } else {
            if (_utils_.__ownsProperty(__thisObject, _parameter_.__xRadius)) {
                if (_utils_.__ownsProperty(__thisObject, _parameter_.__yRadius)) {
                    if (_utils_.__ownsProperty(__thisObject, _parameter_.__rotation)) {
                        if (_utils_.__ownsProperty(__thisObject, _parameter_.__startAngle)) {
                            this.__trackPointer(__thisObject[_parameter_.__origin], __thisObject[_parameter_.__startAngle]);
                        }
                        this.__trackEllipseConstruction(__thisObject[_parameter_.__origin], __thisObject[_parameter_.__xRadius], __thisObject[_parameter_.__yRadius], __thisObject[_parameter_.__rotation]);
                        this.__trackPointer(__thisObject[_parameter_.__origin], __currentPoint);
                    } else {
                        var __rotation           = Math.atan2(__currentPoint.y - __thisObject[_parameter_.__origin].y, __currentPoint.x - __thisObject[_parameter_.__origin].x);
                        this.__trackEllipseConstruction(__thisObject[_parameter_.__origin], __thisObject[_parameter_.__xRadius], __thisObject[_parameter_.__yRadius], __rotation);
                        this.__trackPointer(__thisObject[_parameter_.__origin], __currentPoint);
                    }
                } else {
                    var __yRadius                = _utils_.__getDistance(__thisObject[_parameter_.__origin], __currentPoint);
                    this.__trackEllipseConstruction(__thisObject[_parameter_.__origin], __thisObject[_parameter_.__xRadius], __yRadius, 0);
                    this.__trackPointer(__thisObject[_parameter_.__origin], __currentPoint);
                }
            } else {
                var __radius                     = _utils_.__getDistance(__thisObject[_parameter_.__origin], __currentPoint);
                this.__arc(__thisObject[_parameter_.__origin].x, __thisObject[_parameter_.__origin].y, __radius, 0, (Math.PI * 2.0));
                this.__trackPointer(__thisObject[_parameter_.__origin], __currentPoint);
            }
        }
    },
    // in wait of reference
    __getPointOnEllipticalArc: function(__xRadius, __yRadius, __currentAngle) {
        var __xProp                                = Math.tan(__currentAngle);
        var x                                    = Math.abs(Math.sqrt(1.0 / ((1 / (__xRadius * __xRadius)) + ((__xProp * __xProp) / (__yRadius * __yRadius)))));
        var y                                    = Math.abs(__yRadius * Math.sqrt(1.0 - ((x * x) / (__xRadius * __xRadius))));
        if (__currentAngle < 0.0) {
            __currentAngle                        += (Math.PI * 2.0);
        }
        if (__currentAngle <= (Math.PI * 0.5)) {
            // Nothing more to do here.
        } else if (__currentAngle <= Math.PI) {
            x                                    = -Math.abs(x);
        } else if (__currentAngle <= (Math.PI * 1.5)) {
            x                                    = -Math.abs(x);
            y                                    = -Math.abs(y);
        } else {
            y                                    = -Math.abs(y);
        }
        return {x:x, y:y};
    },

    /* ************************************************ */
    __trackEntryImage: function(__thisObject, __currentPoint) {
        if (__thisImage[_parameter_.__width]) {
            var __imageHeight                    = 0;
            var __rotation                       = 0;
            if (__thisImage[_parameter_.__height]) {
                __imageHeight                    = __thisImage[_parameter_.__height];
                __rotation                       = Math.atan2((__currentPoint.y - __thisImage[_parameter_.__origin].y), (__currentPoint.x - __thisImage[_parameter_.__origin].x));
            } else {
                __imageHeight                    = _utils_.__getDistance(__thisImage[_parameter_.__origin], __currentPoint);
            }
            this.__trackRectangle(__thisImage[_parameter_.__origin].x, __thisImage[_parameter_.__origin].y, __thisImage[_parameter_.__width], __imageHeight, __rotation);
        }
        this.__trackPointer(__thisImage[_parameter_.__origin], __currentPoint);
    },

    /* ************************************************ */
    __trackEntryLine: function(__thisObject, __currentPoint) {
        this.__beginPath();
        this.__moveTo(__thisObject[_parameter_.__origin].x, __thisObject[_parameter_.__origin].y);
        this.__lineTo(__currentPoint.x, __currentPoint.y);
        this.__stroke();
    },

    /* ************************************************ */
    __trackEntrySketch: function(__thisObject, __currentPoint) {
        this.__moveTo(__thisObject[_parameter_.__origin].x, __thisObject[_parameter_.__origin].y);
        $.each( __thisObject[_parameter_.__points], function( __pointIndex, __thisPoint ){
            _track_.__lineTo(__thisPoint.x, __thisPoint.y);
        });
        this.__lineTo(__currentPoint.x, __currentPoint.y);
        this.__stroke();
    },

    /* ************************************************ */
    __trackEntryPolyline: function(__thisObject, __currentPoint) {
        if (_utils_.__ownsProperty(__thisObject, _parameter_.__sideCount)) {
            this.__trackEntryPolygon(__thisObject, __currentPoint, 0, 0);
        } else {
            this.__trackEntryPolylineConstruction(__thisObject, __currentPoint);
        }
    },
    __trackEntryPolygon: function(__thisObject, __currentPoint, __deltaX, __deltaY) {
        var __polygonPoints                      = _utils_.__buildRegularPolygon(__thisObject, __currentPoint, __deltaX, __deltaY);
        this.__beginPath();
        this.__moveTo(__polygonPoints[0].x, __polygonPoints[0].y);
        for (var __pointIndex = 1; __pointIndex < __polygonPoints.length; __pointIndex += 1) {
            this.__lineTo(__polygonPoints[__pointIndex].x, __polygonPoints[__pointIndex].y);
        }
        this.__closePath();
        this.__stroke();
        if (__thisObject[_parameter_.__points].length === 0) {
            this.__trackPointer(__thisObject[_parameter_.__origin], __currentPoint);
        }
    },
    __trackEntryPolylineConstruction: function(__thisObject, __currentPoint) {
        this.__beginPath();
        var __previousPoint                      = __thisObject[_parameter_.__origin];
        this.__moveTo(__previousPoint.x, __previousPoint.y);
            // Loop through all remaining points
        $.each( __thisObject[_parameter_.__points], function( __pointIndex, __thisPoint ){
            if (__thisPoint[_parameter_.__centerX]) {
                var __center                     = {x:__thisPoint[_parameter_.__centerX], y:__thisPoint[_parameter_.__centerY]};
                var __radius                     = _utils_.__getDistance(__previousPoint, __center);
                var __startAngle                 = Math.atan2(__previousPoint.y - __center.y, __previousPoint.x - __center.x);
                var __endAngle                   = Math.atan2(__thisPoint.y - __center.y, __thisPoint.x - __center.x);
                _track_.__cadContext.arc(__center.x, __center.y, __radius, __startAngle, __endAngle, __thisPoint[_parameter_.__ccw] );
            } else {
                _track_.__lineTo(__thisPoint.x, __thisPoint.y);
            }
            __previousPoint                      = __thisPoint;
        });
        this.__stroke();
        // Follow construction progress
        if (__thisObject.__polylineSegmentType === 'l') {
            this.__trackPointer(__previousPoint, __currentPoint);
        } else {
            switch (__thisObject.__polylineArcSegmentOption) {
                case _polyline_.__polylineArcSegmentOptionBulge:
                    this.__trackEntryPolylineStartEndBulge(__thisObject, __previousPoint, __currentPoint);
                    break;
                case _polyline_.__polylineArcSegmentOptionCenter:
                    this.__trackEntryPolylineStartCenterEnd(__thisObject, __previousPoint, __currentPoint);
                    break;
                case _polyline_.__polylineArcSegmentOptionSecond:
                    this.__trackEntryPolylineStartSecondEnd(__thisObject, __previousPoint, __currentPoint);
                    break;
                default:
                    this.__trackEntryPolylineStartEnd(__thisObject, __previousPoint, __currentPoint);
            }
        }
    },
    __trackEntryPolylineStartEndBulge: function(__thisObject, __previousPoint, __currentPoint) {
        if (__thisObject.__polylineCurrentArcEndPoint === null) {
            this.__trackPointer(__previousPoint, __currentPoint);
        } else {
            var __center                         = _utils_.__getCenterFromThreePoints(__previousPoint, __currentPoint, __thisObject.__polylineCurrentArcEndPoint);
            var __radius                         = _utils_.__getDistance(__center, __previousPoint);
            var __startAngle                     = Math.atan2(__previousPoint.y - __center.y, __previousPoint.x - __center.x);
            var __endAngle                       = Math.atan2(__thisObject.__polylineCurrentArcEndPoint.y - __center.y, __thisObject.__polylineCurrentArcEndPoint.x - __center.x);
            this.__arc(__center.x, __center.y, __radius, __startAngle, __endAngle, __center[_parameter_.__ccw]);
        }
    },
    __trackEntryPolylineStartCenterEnd: function(__thisObject, __previousPoint, __currentPoint) {
        if (__thisObject.__polylineCurrentArcCenterPoint === null) {
            this.__trackPointer(__previousPoint, __currentPoint);
        } else {
            var __pointFromStartInDirection      = _utils_.__setDirectionPoint(__previousPoint, __previousPoint[_parameter_.__direction], 100.0);
            var __ccw                            = _utils_.__isCCW(__previousPoint, __pointFromStartInDirection, __currentPoint);
            var __radius                         = _utils_.__getDistance(__previousPoint, __thisObject.__polylineCurrentArcCenterPoint);
            var __startAngle                     = Math.atan2(__previousPoint.y - __thisObject.__polylineCurrentArcCenterPoint.y, __previousPoint.x - __thisObject.__polylineCurrentArcCenterPoint.x);
            var __endAngle                       = Math.atan2(__currentPoint.y - __thisObject.__polylineCurrentArcCenterPoint.y, __currentPoint.x - __thisObject.__polylineCurrentArcCenterPoint.x);
            this.__arc(__thisObject.__polylineCurrentArcCenterPoint.x, __thisObject.__polylineCurrentArcCenterPoint.y, __radius, __startAngle, __endAngle, __ccw);
        }
    },
    __trackEntryPolylineStartSecondEnd: function(__thisObject, __previousPoint, __currentPoint) {
        if (__thisObject.__polylineCurrentArcSecondPoint === null) {
            this.__trackPointer(__previousPoint, __currentPoint);
        } else {
            var __center                         = _utils_.__getCenterFromThreePoints(__previousPoint, __thisObject.__polylineCurrentArcSecondPoint, __currentPoint);
            var __radius                         = _utils_.__getDistance(__center, __previousPoint);
            var __startAngle                     = Math.atan2(__previousPoint.y - __center.y, __previousPoint.x - __center.x);
            var __endAngle                       = Math.atan2(__currentPoint.y  - __center.y, __currentPoint.x  - __center.x);
            this.__arc(__center.x, __center.y, __radius, __startAngle, __endAngle, __center[_parameter_.__ccw]);
        }
    },
    __trackEntryPolylineStartEnd: function(__thisObject, __previousPoint, __currentPoint) {
        if (_utils_.__getDistance(__previousPoint, __currentPoint) === 0.0) {
            this.__trackPointer(__previousPoint, __currentPoint);
        } else {
            var __pointFromStartInDirection      = _utils_.__setDirectionPoint(__previousPoint, __previousPoint[_parameter_.__direction], 100.0);
            var __directionStartToCenter         = __previousPoint[_parameter_.__direction] + (Math.PI * 0.5);
            var __ccw                            = _utils_.__isCCW(__previousPoint, __pointFromStartInDirection, __currentPoint);
            if (__ccw) {
                __directionStartToCenter         = __previousPoint[_parameter_.__direction] - (Math.PI * 0.5);
            }
            // x-distance
            var halfDistancePreviousToCurrent    = (_utils_.__getDistance(__previousPoint, __currentPoint) * 0.5);
            // angle
            var __directionStartToCurrent        = Math.atan2(__currentPoint.y -   __previousPoint.y, __currentPoint.x - __previousPoint.x);
            var __includedAngle                  = (__directionStartToCurrent - __directionStartToCenter)
            // radius
            var __radius                         = Math.abs(halfDistancePreviousToCurrent / Math.cos(__includedAngle));
            var __center                         = _utils_.__setDirectionPoint(__previousPoint, __directionStartToCenter, __radius);
            var __startAngle                     = Math.atan2((__previousPoint.y   - __center.y), (__previousPoint.x   - __center.x));
            var __endAngle                       = Math.atan2((__currentPoint.y - __center.y), (__currentPoint.x - __center.x));
            this.__arc(__center.x, __center.y, __radius, __startAngle, __endAngle, __ccw);
        }
    },

    /* ************************************************ */
    __trackEntryRectangle: function(__thisObject, __currentPoint) {
        if (__thisObject[_parameter_.__type] === _rectangle_.__squareType) {
            if (__thisObject[_parameter_.__width]) {
                var __rotation                   = Math.atan2((__currentPoint.y - __thisObject[_parameter_.__origin].y), (__currentPoint.x - __thisObject[_parameter_.__origin].x));
                this.__trackRectangle(__thisObject[_parameter_.__origin].x,__thisObject[_parameter_.__origin].y, __thisObject[_parameter_.__width], __thisObject[_parameter_.__width], __rotation);
            } else {
                var __sideLength                 = _utils_.__getDistance(__thisObject[_parameter_.__origin], __currentPoint);
                this.__trackRectangle(__thisObject[_parameter_.__origin].x, __thisObject[_parameter_.__origin].y, __sideLength, __sideLength, 0);
            }
            this.__trackPointer(__thisObject[_parameter_.__origin], __currentPoint);
        } else if (__thisObject[_parameter_.__type] === _rectangle_.__rectangleType) {
            if (__thisObject[_parameter_.__oppositeCorner]) {
                var __diagonalDirection          = Math.atan2((__thisObject[_parameter_.__oppositeCorner].y - __thisObject[_parameter_.__origin].y), (__thisObject[_parameter_.__oppositeCorner].x - __thisObject[_parameter_.__origin].x));
                var __diagonalLength             = _utils_.__getDistance(__thisObject[_parameter_.__oppositeCorner], __thisObject[_parameter_.__origin]);
                var __rectangleWidth             = Math.cos(__diagonalDirection) * __diagonalLength;
                var __rectangleHeight            = Math.sin(__diagonalDirection) * __diagonalLength;
                var __rotation                   = Math.atan2((__currentPoint.y - __thisObject[_parameter_.__origin].y), (__currentPoint.x - __thisObject[_parameter_.__origin].x));
                this.__trackPointer(__thisObject[_parameter_.__origin], __currentPoint);
            } else {
                var __diagonalDirection          = Math.atan2((__currentPoint.y - __thisObject[_parameter_.__origin].y), (__currentPoint.x - __thisObject[_parameter_.__origin].x));
                var __diagonalLength             = _utils_.__getDistance(__currentPoint, __thisObject[_parameter_.__origin]);
                var __rectangleWidth             = Math.cos(__diagonalDirection) * __diagonalLength;
                var __rectangleHeight            = Math.sin(__diagonalDirection) * __diagonalLength;
                var __rotation                   = 0.0;
            }
            this.__trackRectangle(__thisObject[_parameter_.__origin].x, __thisObject[_parameter_.__origin].y, __rectangleWidth, __rectangleHeight, __rotation);
        } else {
            if (__thisObject[_parameter_.__width]) {
                var __objectAngle                = 0.0;
                var __objectHeight               = 0.0;
                var __objectRotation             = 0;
                var __distance                   = 0.0;
                if (__thisObject[_parameter_.__summit]) {
                    __objectAngle                = _utils_.__getDirectionFromData(__thisObject[_parameter_.__summit], __thisObject[_parameter_.__origin]);
                    __distance                   = _utils_.__getLengthFromData(__thisObject[_parameter_.__summit], __thisObject[_parameter_.__origin]);
                    __objectRotation             = _utils_.__getDirectionFromData(__currentPoint, __thisObject[_parameter_.__origin]);
                } else {
                    __objectAngle                = _utils_.__getDirectionFromData(__currentPoint, __thisObject[_parameter_.__origin]);
                    __distance                   = _utils_.__getLengthFromData(__currentPoint, __thisObject[_parameter_.__origin]);
                }
                __objectHeight                   = (__distance * Math.sin(__objectAngle));
                this.__trackParallelogramOrTrapeze(__thisObject, __thisObject[_parameter_.__width], __objectHeight, __objectAngle, __objectRotation);
            }
            this.__trackPointer(__thisObject[_parameter_.__origin], __currentPoint);
        }
    },
    __trackRectangle: function(x, y, __width, __height, __rotation) {
        this.__save();
        this.__translate(x, y);
        this.__rotate(__rotation);
        this.__strokeRect(0, 0, __width, __height);
        this.__restore();
    },
    __trackParallelogramOrTrapeze: function(__thisObject, __objectWidth, __objectHeight, __objectAngle, __objectRotation) {
        var __radius                             = 0.0;
        var __deltaX                             = 0.0;
        if (!__objectWidth) {
            __objectWidth                        = __thisObject[_parameter_.__width];
            __objectAngle                        = _utils_.__getDirectionFromData(__thisObject[_parameter_.__summit], __thisObject[_parameter_.__origin]);
            __radius                               = _utils_.__getLengthFromData(__thisObject[_parameter_.__summit], __thisObject[_parameter_.__origin]);
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
        this.__moveTo(0, 0);
        this.__lineTo(__deltaX, __objectHeight);
        if (__thisObject[_parameter_.__type] === _rectangle_.__parallelogramType) {
            this.__lineTo(__thisObject[_parameter_.__width] + __deltaX, __objectHeight);
        } else {
            this.__lineTo(__thisObject[_parameter_.__width] - __deltaX, __objectHeight);
        }
        this.__lineTo(__thisObject[_parameter_.__width], 0);
        this.__closePath();
        this.__stroke();
        this.__restore();
    },

    /* ************************************************ */
    __trackEntryText: function(__thisObject, __currentPoint) {
        var __content                            = '';
        if (__thisObject[_parameter_.__type] === _text_.__textMultiline) {
            __content                            = document.getElementById('dataMultilineEntry').value;
        } else {
            __content                            = document.getElementById('dataEntry').value;
        }
        if (__content === '') {
            __content                            = '(Enter text)';
        }
        switch(__thisObject[_parameter_.__type]) {
            case _text_.__textCallout:           this.__trackEntryCallout(__thisObject, __content, __currentPoint);        break;
            case _text_.__textRestricted:        this.__trackEntryRestrictedText(__thisObject, __content, __currentPoint); break;
            case _text_.__textMultiline:         this.__trackEntryMultilineText(__thisObject, __content, __currentPoint);  break;
            default:                             this.__trackEntrySimpleText(__thisObject, __content, __currentPoint);
        }
    },
    __trackEntryCallout: function(__thisObject, __content, __currentPoint) {
        var __currentObjectConstructor              = _utils_.__getObjectConstructor(__thisObject[_parameter_.__type]);
        // NOTE: Callout first point is _parameter_.__arrow (not _parameter_.__origin)
        if (__thisObject[_parameter_.__origin]) {
            __currentObjectConstructor.__setCalloutBend(__thisObject, __thisObject[_parameter_.__origin]);
            var __fontSize                          = 0.0;
            if (__thisObject[_parameter_.__fontSize]) {
                __fontSize                       = __thisObject[_parameter_.__fontSize];
            } else {
                __fontSize                       = _utils_.__getDistance(__thisObject[_parameter_.__origin], __currentPoint);
            }
            this.__trackCalloutLeader(__thisObject);
            this.__setCalloutAlignment(__thisObject);
            this.__setFont(__thisObject, __fontSize);
            this.__trackText(__thisObject[_parameter_.__origin], 0, __content);
            this.__trackPointer(__thisObject[_parameter_.__origin], __currentPoint);
        } else {
            __currentObjectConstructor.__setCalloutBend(__thisObject, __currentPoint);
            this.__trackCalloutLeader(__thisObject, __currentPoint);
        }
    },
    __trackEntryRestrictedText: function(__thisObject, __content, __currentPoint) {
        if (_utils_.__ownsProperty(__thisObject, _parameter_.__oppositeCorner)) {
            var __diagonalDirection          = Math.atan2((__thisObject[_parameter_.__oppositeCorner].y - __thisObject[_parameter_.__origin].y), (__thisObject[_parameter_.__oppositeCorner].x - __thisObject[_parameter_.__origin].x));
            var __diagonalLength             = _utils_.__getDistance(__thisObject[_parameter_.__oppositeCorner], __thisObject[_parameter_.__origin]);
            var __rectangleWidth             = Math.cos(__diagonalDirection) * __diagonalLength;
            var __rectangleHeight            = Math.sin(__diagonalDirection) * __diagonalLength;
            var __rotation                   = 0.0;
            if (_utils_.__ownsProperty(__thisObject, _parameter_.__rotation)) {
                __rotation                   = __thisObject[_parameter_.__rotation];
            } else {
                __rotation                   = Math.atan2(__currentPoint.y - __thisObject[_parameter_.__origin].y,__currentPoint.x - __thisObject[_parameter_.__origin].x);
            }
        } else {
            var __diagonalDirection          = Math.atan2((__currentPoint.y - __thisObject[_parameter_.__origin].y), (__currentPoint.x - __thisObject[_parameter_.__origin].x));
            var __diagonalLength             = _utils_.__getDistance(__currentPoint, __thisObject[_parameter_.__origin]);
            var __rectangleWidth             = Math.cos(__diagonalDirection) * __diagonalLength;
            var __rectangleHeight            = Math.sin(__diagonalDirection) * __diagonalLength;
            var __rotation                   = 0.0;
        }
        this.__trackRectangle(__thisObject[_parameter_.__origin].x, __thisObject[_parameter_.__origin].y, __rectangleWidth, __rectangleHeight, __rotation);
        this.__trackEntryRestrictedTextContent(__thisObject, __rectangleWidth, __rectangleHeight, __rotation, __content);
    },
    __trackEntryRestrictedTextContent: function(__thisObject, __width, __height, __rotation, __content) {
        __origin                                 = __thisObject[_parameter_.__origin];
        __width                                  = __width?__width:__thisObject[_parameter_.__width];
        __height                                 = __height?__height:__thisObject[_parameter_.__height];
        __rotation                               = __rotation?__rotation:__thisObject[_parameter_.__rotation];
        __content                                = __content?__content:__thisObject[_parameter_.__content];
        this.__setFont(__thisObject, __height);
        var __fontStyle                          = _model_[_parameter_.__fontStyles][__thisObject[_parameter_.__fontStyle]];
        var __fontName                           = __fontStyle[_parameter_.__fontName];
        var __textWidth                          = _utils_.__getTextWidth(__fontName, __height, __content);
        // scale and Ylocation
        var __scaleX                             = ( __width / __textWidth);
        var __scaleY                             = -1.0;
        var __Ylocation                          = 0.0;
        if (__content.toUpperCase() === __content) {
            __scaleY                            *= 1.33;
        } else {
            __Ylocation                          = -(__height * 0.25);
        }
        this.__save();
        this.__translate(__thisObject[_parameter_.__origin].x, __thisObject[_parameter_.__origin].y);
        this.__rotate(__rotation);
        this.__scale(__scaleX, __scaleY);
        this.__fillText(__content, 0, __Ylocation);
        this.__restore();
    },
    __trackEntryMultilineText: function(__thisObject, __content, __currentPoint) {
        this.__setTextAlignment(__thisObject);
        var __fontSize                       = 0.0;
        if (_utils_.__ownsProperty(__thisObject, _parameter_.__fontSize)) {
            __fontSize                       = __thisObject[_parameter_.__fontSize];
        } else {
            __fontSize                       = _utils_.__getDistance(__thisObject[_parameter_.__origin], __currentPoint);
        }
        this.__setFont(__thisObject, __fontSize);
        this.__trackMultilineText(__thisObject[_parameter_.__origin], __fontSize, __content);
        if (!__thisObject[_parameter_.__fontSize]) {
            this.__trackPointer(__thisObject[_parameter_.__origin], __currentPoint);
        }
    },
    __trackMultilineText: function(__textPoint, __fontSize, __content) {
        var __textLines                          = __content.split(_parameter_.__newLine);
        var __lineIndex                          = 0;
        $.each( __textLines, function( __index, __textLine ){
            _track_.__save();
            _track_.__translate(__textPoint.x, __textPoint.y - (__lineIndex * __fontSize));
            _track_.__scale(1.0, -1.0);
            _track_.__rotate(0);
            _track_.__fillText(__textLines[__lineIndex], 0, 0);
            _track_.__restore();
            __lineIndex                         += 1;
        });
    },
    __trackEntrySimpleText: function(__thisObject, __content, __currentPoint) {
        this.__setTextAlignment(__thisObject);
        var __fontSize                           = __thisObject[_parameter_.__fontSize];
        var __rotation                           = 0;
        if (__thisObject[_parameter_.__fontSize]) {
            if (_utils_.__ownsProperty(__thisObject, _parameter_.__rotation)) {
                __rotation                       = __thisObject[_parameter_.__rotation];
            } else {
                __rotation                       = Math.atan2((__currentPoint.y - __thisObject[_parameter_.__origin].y), (__currentPoint.x - __thisObject[_parameter_.__origin].x));
            }
        } else {
            __fontSize                           = _utils_.__getDistance(__thisObject[_parameter_.__origin], __currentPoint);
        }
        this.__setFont(__thisObject, __fontSize);
        this.__trackText(__thisObject[_parameter_.__origin], __rotation, __content);
        this.__trackPointer(__thisObject[_parameter_.__origin], __currentPoint);
    },

    /* ************************************************ */

    __trackDimension: function(__currentPoint) {
        if (_dimension_.__currentDimObject) {
            this.__trackDimensionObject(_dimension_.__currentDimObject, __currentPoint);
        } else if (_dimension_.__editedParameterName) {
            this.__trackPointer(_dimension_.__selectedDimension[_dimension_.__editedParameterName], __currentPoint);
        }
    },
    __trackDimensionObject: function(__thisDimension, __currentPoint) {
        if ((!__thisDimension[_parameter_.__firstPoint]) && (!__thisDimension[_parameter_.__center])) return;
        this.__cadContext[_parameter_.__lineWidth]                   = (1.0 / _view_.__area[_parameter_.__scale]);
        this.__cadContext[_parameter_.__textAlign]                   = _parameter_.__center;
        this.__cadContext[_parameter_.__textBaseline] = _parameter_.__middle;
        this.__cadContext[_parameter_.__font]                        = (_model_[_parameter_.__dimension][_parameter_.__fontSize] + _parameter_.__pxSpace + _user_[_parameter_.__dimensionFontName]);
        switch(__thisDimension[_parameter_.__type]) {
            case _dimension_.__linearType:
                // _parameter_.__firstPoint,         _parameter_.__secondPoint,        _parameter_.__dimensionLocation
                if (__thisDimension[_parameter_.__secondPoint]) {
                    var __computedPoints = _dimension_.__computeLinearDimensionPoints(__thisDimension, __currentPoint);
                    this.__trackComputedDimension(__computedPoints);
                } else {
                    this.__trackPointer(__thisDimension[_parameter_.__firstPoint], __currentPoint);
                }
                break;
            case _dimension_.__alignedType:
                // _parameter_.__firstPoint,         _parameter_.__secondPoint,        _parameter_.__dimensionLocation
                if (__thisDimension[_parameter_.__secondPoint]) {
                    // tracking dimension location
                    var __computedPoints = _dimension_.__computeAlignedDimensionPoints(__thisDimension, __currentPoint);
                    this.__trackComputedDimension(__computedPoints);
                } else {
                    // tracking dimension second point
                    this.__trackPointer(__thisDimension[_parameter_.__firstPoint], __currentPoint);
                }
                break;
            case _dimension_.__angularType:
                if (!__thisDimension[_parameter_.__firstPoint]) {
                    this.__trackPointer(__thisDimension[_parameter_.__center], __currentPoint);
                } else if (!__thisDimension[_parameter_.__secondPoint]) {
                    this.__trackPointer(__thisDimension[_parameter_.__center], __thisDimension[_parameter_.__firstPoint]);
                    this.__trackPointer(__thisDimension[_parameter_.__center], __currentPoint);
                } else {
                    var __computedPoints = _dimension_.__computeAngularDimensionPoints(__thisDimension, __currentPoint);
                    this.__trackComputedDimension(__computedPoints);
                }
                break;
            case _dimension_.__radialType:
                if (!__thisDimension[_parameter_.__radiusPoint]) {
                    this.__trackPointer(__thisDimension[_parameter_.__center], __currentPoint);
                } else {
                    var __computedPoints = _dimension_.__computeRadialDimensionPoints(__thisDimension, __currentPoint);
                    this.__trackComputedDimension(__computedPoints);
                }
                break;
        }
    },
    __trackComputedDimension: function(__thisDimensionPoints) {
        $.each( __thisDimensionPoints, function( __index, __pointData ) {
            switch(__pointData[0]) {
                case _dimension_.__lineType:     _track_.__trackPointer(__pointData[1], __pointData[2]);                                      break;
                case _dimension_.__arcType:      _track_.__trackDimensionArc(__pointData[1], __pointData[2], __pointData[3], __pointData[4]); break;
                default:                         _track_.__trackText(__pointData[1], 0, __pointData[2]);
            }
        });
    },
    __trackDimensionArc: function(__center, __radius, __startAngle, __endAngle) {
        this.__arc(__center.x, __center.y, __radius, __startAngle, __endAngle);
    },


    /* ******************************************************************* */
    // HIGHLIGHT / REMOVE OBJECT ANCHORS
    __anchorSize: 5,
    __trackAnchors: function(__currentPoint) {
        if (_anchor_.__anchorIds) {
            $.each( _anchor_.__anchorIds, function( __index, __thisId ){
                var __thisObject                 = _modelTools_.__getObjectById(__thisId);
                $.each( __thisObject.__anchorPoints, function( __index, __point ) {
                    _track_.__trackSingleAnchor(__point, _track_.__anchorSize);
                });
                $.each( __thisObject.__ellipsePoints, function( __index, __point ) {
                    _track_.__trackAnchorX(__point, _track_.__anchorSize);
                });
            });
            if (_anchor_.__anchorObjectPoint) {
                this.__trackSingleAnchor(_anchor_.__anchorObjectPoint, this.__anchorSize, true);
            }
            if (_anchor_.__anchorPerpendicularPoint) {
                this.__trackAnchorBox(_anchor_.__anchorPerpendicularPoint, __currentPoint, this.__anchorSize);
            }
            if (_anchor_.__anchorIntersectionPoint) {
                this.__trackAnchorDiamond(_anchor_.__anchorIntersectionPoint, __currentPoint, this.__anchorSize);
            }
        } else if (_dimension_.__selectedDimension) {
            this.__trackSingleAnchor(_dimension_.__selectedDimension[_parameter_.__firstPoint], this.__anchorSize, true);
            this.__trackSingleAnchor(_dimension_.__selectedDimension[_parameter_.__secondPoint], this.__anchorSize, true);
            this.__trackSingleAnchor(_dimension_.__selectedDimension[_parameter_.__center], this.__anchorSize, true);
            this.__trackSingleAnchor(_dimension_.__selectedDimension[_parameter_.__radiusPoint], this.__anchorSize, true);
            this.__trackSingleAnchor(_dimension_.__selectedDimension[_parameter_.__dimensionLocation], this.__anchorSize, true);
        }
    },
    __trackSingleAnchor: function(__anchorPoint, __radius, __isFilled) {
        if (__anchorPoint) {
            this.__beginPath();
            _track_.__cadContext.arc(__anchorPoint.x, __anchorPoint.y, (__radius / _view_.__area[_parameter_.__scale]), 0, (Math.PI * 2.0));
            if (__isFilled) {
                this.__fill();
            } else {
                this.__stroke();
            }
        }

    },
    __trackAnchorBox: function(__anchorPoint, __currentPoint) {
        var __scaledAnchorSize                   = (this.__anchorSize / _view_.__area[_parameter_.__scale]);
        if (_utils_.__getDistance(__anchorPoint, __currentPoint) < _view_.__fuzzValue) {
            this.__fillRect(__anchorPoint.x - __scaledAnchorSize, __anchorPoint.y - __scaledAnchorSize, __scaledAnchorSize * 2, __scaledAnchorSize * 2);
        } else {
            this.__strokeRect(__anchorPoint.x - __scaledAnchorSize, __anchorPoint.y - __scaledAnchorSize, __scaledAnchorSize * 2, __scaledAnchorSize * 2);
        }
    },
    __trackAnchorDiamond: function(__anchorPoint, __currentPoint) {
        var __scaledAnchorSize                   = (this.__anchorSize / _view_.__area[_parameter_.__scale]);
        this.__beginPath();
        this.__moveTo(__anchorPoint.x - __scaledAnchorSize, __anchorPoint.y);
        this.__lineTo(__anchorPoint.x, __anchorPoint.y - __scaledAnchorSize);
        this.__lineTo(__anchorPoint.x + __scaledAnchorSize, __anchorPoint.y);
        this.__lineTo(__anchorPoint.x, __anchorPoint.y + __scaledAnchorSize);
        this.__closePath();
        if (_utils_.__getDistance(__anchorPoint, __currentPoint) < _view_.__fuzzValue) {
            this.__fill();
        } else {
            this.__stroke();
        }
    },
    __trackAnchorX: function(__anchorPoint, __currentPoint) {
        var __scaledAnchorSize                   = (this.__anchorSize / _view_.__area[_parameter_.__scale]);
        this.__beginPath();
        this.__moveTo(__anchorPoint.x - __scaledAnchorSize, __anchorPoint.y - __scaledAnchorSize);
        this.__lineTo(__anchorPoint.x + __scaledAnchorSize, __anchorPoint.y + __scaledAnchorSize);
        this.__stroke();
        this.__beginPath();
        this.__moveTo(__anchorPoint.x - __scaledAnchorSize, __anchorPoint.y + __scaledAnchorSize);
        this.__lineTo(__anchorPoint.x + __scaledAnchorSize, __anchorPoint.y - __scaledAnchorSize);
        this.__stroke();
    },


    __trackAnchorEdit: function(__currentPoint) {
        this.__trackSingleAnchor( _anchor_.__editObjectPoint, (this.__anchorSize * 0.5), true);
        this.__trackPointer(_anchor_.__editObjectPoint, __currentPoint);
        this.__trackSingleAnchor( __currentPoint, this.__anchorSize, true);
    },


    // EDITION
    __trackEdition: function(__currentPoint) {
        if (_edit_.__parameterIndex > 0) {
            var __firstSetKey                     = _edit_.__parameterNames[0];
            this.__trackPointer(_edit_.__editData[__firstSetKey], __currentPoint);
        }
    },
    // In wait of reference
    __trackChamferOrFillet: function(__currentPoint) {
        // Track after two objects are set
        if (_edit_.__parameterIndex > 2) {
            this.__trackPointer(_edit_.__editData[_parameter_.__intersectionPoint], __currentPoint);
        }
    },


    // SELECTION
    __trackSelection: function(__currentPoint) {
        if (_selection_.__selectionArea) {
            if (_selection_.__selectionArea[_parameter_.__isCrossing]) {
                this.__cadContext.setLineDash(_model_[_parameter_.__lineTypes].dash);
                this.__cadContext[_parameter_.__lineWidth]               = (2.0 / _view_.__area[_parameter_.__scale]);
            } else {
                this.__cadContext[_parameter_.__lineWidth]               = (1.0 /_view_.__area[_parameter_.__scale]);
            }
            this.__strokeRect(_selection_.__selectionArea.x, _selection_.__selectionArea.y, _selection_.__selectionArea[_parameter_.__width], _selection_.__selectionArea[_parameter_.__height]);
        }
    },

    __trackModel: function(__currentPoint) {
        if (_view_.__touchStartLocation) {
            var __area                                                   = _utils_.__getArea(_view_.__touchStartLocation, __currentPoint);
            this.__trackRectangle(__area.x, __area.y, __area[_parameter_.__width], __area[_parameter_.__height], 0);
        }
    },
    __trackTools: function(__currentPoint) {
        if (_view_.__touchStartLocation) {
            this.__trackPointer(_view_.__touchStartLocation, __currentPoint);
        }
    },


    // TRACK COMMON PROCEDURES
    __trackPointer: function(p, q) {
        this.__beginPath();
        this.__moveTo(p.x, p.y);
        this.__lineTo(q.x, q.y);
        this.__stroke();
    },
    __trackCalloutLeader: function(__thisObject, __origin) {
        if (!__origin) {
            __origin = __thisObject[_parameter_.__origin];
        }
        // Arrow
        this.__beginPath();
        this.__moveTo(__thisObject[_parameter_.__arrow].x,          __thisObject[_parameter_.__arrow].y);
        this.__lineTo(__thisObject[_parameter_.__arrowBaseLeft].x,  __thisObject[_parameter_.__arrowBaseLeft].y);
        this.__lineTo(__thisObject[_parameter_.__arrowBaseRight].x, __thisObject[_parameter_.__arrowBaseRight].y);
        this.__closePath();
        this.__fill();
        // Leader
        this.__beginPath();
        this.__moveTo(__thisObject[_parameter_.__arrow].x, __thisObject[_parameter_.__arrow].y);
        this.__lineTo(__thisObject[_parameter_.__bend].x, __thisObject[_parameter_.__bend].y);
        this.__lineTo(__origin.x, __origin.y);
        this.__stroke();
    },
    __trackText: function(__textPoint, __rotation, __content) {
        this.__save();
        this.__translate(__textPoint.x, __textPoint.y);
        this.__scale(1.0, -1.0);
        this.__rotate(-__rotation);
        this.__fillText(__content, 0, 0);
        this.__restore();
    },
    __trackEllipseConstruction: function(__center, __xRadius, __yRadius, __rotation) {
        this.__save();
        this.__translate(__center.x, __center.y);
        this.__rotate(0);
        this.__beginPath();
        this.__cadContext.ellipse(0, 0, __xRadius, __yRadius, __rotation, 0, (Math.PI * 2.0));
        this.__stroke();
        this.__restore();
    }
};
