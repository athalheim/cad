var _text_ = {

    __moduleName:              '_text_',
    /* ******************************************************** */
    __invalidOption:           'invalidOption',
    __chooseTextType: function() {
        _inputSelect_.__selectObjectByType(this.__moduleName, Object.keys(this.__parameterObject), '_text_._processTextByType(__inputValue)');
    },
    _processTextByType: function(__inputValue) {
        _add_.__initialize(__inputValue, );
    },

    //  PROPERTIES
    //  Text options:
    __textSimple:     'text',
    __textRestricted: 'restrictedText',
    __textMultiline:  'multilineText',
    __textCallout:    'callout',
    //  Edit parameters:
    __parameterObject: {
        text: {
            __parameterNames: [                                  _parameter_.__origin,             _parameter_.__fontSize,             _parameter_.__rotation,             _parameter_.__content],
            __parameterTypes: [                                  _parameter_.__parameterTypePoint, _parameter_.__parameterTypeNumeric, _parameter_.__parameterTypeNumeric, _parameter_.__parameterTypeString],
        },
        restrictedText: {
            __parameterNames: [                                  _parameter_.__origin,             _parameter_.__oppositeCorner,     _parameter_.__rotation,             _parameter_.__content],
            __parameterTypes: [                                  _parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint, _parameter_.__parameterTypeNumeric, _parameter_.__parameterTypeString],
        },
        multilineText: {
            __parameterNames: [                                  _parameter_.__origin,             _parameter_.__fontSize,             _parameter_.__content],
            __parameterTypes: [                                  _parameter_.__parameterTypePoint, _parameter_.__parameterTypeNumeric, _parameter_.__parameterTypeString],
        },
        callout: {
            __parameterNames: [_parameter_.__arrow,              _parameter_.__origin,             _parameter_.__fontSize,             _parameter_.__content],
            __parameterTypes: [_parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint, _parameter_.__parameterTypeNumeric, _parameter_.__parameterTypeString],
        }
    },


    __calloutBendLength:      0,
    __calloutBendProp:        0.025,


    /* ******************************************************** */
    //  PROCEDURES

    // 1. Initialize: Done in _add_ module.

    // 2. Data acquisition
    __addParameterData: function(__thisObject, __data) {
        switch (_add_.__parameterName) {
            case _parameter_.__arrow:
                __thisObject[_parameter_.__arrow]               = __data;
                break;
            case _parameter_.__origin:
                // Check option: tmblcr
                if (_utils_.__hasXproperty(__data)) {
                    __thisObject[_parameter_.__origin]          = __data;
                    __thisObject[_parameter_.__fontStyle]       = _model_[_parameter_.__fontStyle];
                } else if (isNaN(__data)) {
                    // Not a number: check options.  Will always return 'false' as no point is added
                    this.__checkTextOption(__thisObject, __data);
                    return;
                }
                break;
            case _parameter_.__oppositeCorner:
                if (_utils_.__getLengthFromData(__data, __thisObject[_parameter_.__origin]) > 0.0) {
                    __thisObject[_parameter_.__oppositeCorner]  = __data;
                }
            case _parameter_.__fontSize:
                var __textHeight                 = _utils_.__getLengthFromData(__data, __thisObject[_parameter_.__origin]);
                if (__textHeight > 0.0) {
                    __thisObject[_parameter_.__fontSize]        = __textHeight;
                    if (__thisObject[_parameter_.__type] === this.__textCallout) {
                        __thisObject[_parameter_.__rotation]    = 0;
                    }
                }
                break;
            case _parameter_.__rotation:
                if (_utils_.__hasXproperty(__data)) {
                    if (_utils_.__getDistance(__data, __thisObject[_parameter_.__origin]) > 0.0) {
                        __thisObject[_parameter_.__rotation]    = _utils_.__getDirectionFromData(__data, __thisObject[_parameter_.__origin]);
                    } else {
                        return;
                    }
                } else {
                    __thisObject[_parameter_.__rotation]        = ((__data / 180) * Math.PI);
                }
                break;
            case _parameter_.__content:
                if (__data === '') {
                    _events_.__callError(this.__moduleName, _messages_.__getMessage('invalidNoText'));
                    return false;
                } else {
                    __thisObject[_parameter_.__content]         = __data;
                }
       }
        return true;
    },

    __checkTextOption: function(__thisObject, __data) {
        __data                                     = __data.toLowerCase();
        if (__data.length === 1) {
            // One-character option: horizontal
            delete __thisObject[_parameter_.__vAlign];
            this.__setHorizontalAlignment(__thisObject, __data);
        } else if (__data.length === 2) {
            // two-character option:
            //  -horizontal: lcr
            //  -vertical:   tmb
            var __firstOptionCharacter             = __data.substring(0,1);
            var __secondOptionCharacter            = __data.substring(1);
            //check order:
            if ('tmb'.indexOf(__firstOptionCharacter) > -1) {
                this.__setHorizontalAlignment(__thisObject, __secondOptionCharacter);
                this.__setVerticalAlignment(__thisObject, __firstOptionCharacter);
            } else {
                this.__setHorizontalAlignment(__thisObject, __firstOptionCharacter);
                this.__setVerticalAlignment(__thisObject, __secondOptionCharacter);
            }
        } else {
            // word(s)
            if (__data.indexOf(_parameter_.__right) > -1) {
                __thisObject[_parameter_.__hAlign]             = _parameter_.__right;
            } else if (__data.indexOf(_parameter_.__center) > -1) {
                __thisObject[_parameter_.__hAlign]             = _parameter_.__center;
            } else {
                delete __thisObject[_parameter_.__hAlign];
            }
            if (__data.indexOf(_parameter_.__top) > -1) {
                __thisObject[_parameter_.__vAlign]             = _parameter_.__top;
            } else if (__data.indexOf(_parameter_.__middle) > -1) {
                __thisObject[_parameter_.__vAlign]             = _parameter_.__middle;
            } else {
                delete __thisObject[_parameter_.__vAlign];
            }
        }
    },
    __setHorizontalAlignment: function(__thisObject, __data) {
        switch(__data) {
            case 'r':                  __thisObject[_parameter_.__hAlign]             = _parameter_.__right;     break;
            case 'c':                  __thisObject[_parameter_.__hAlign]             = _parameter_.__center;    break;
            case 'l':                  delete __thisObject[_parameter_.__hAlign];                    break;
            default:                   _events_.__callError(this.__moduleName, _messages_.__getMessage(this.__invalidOption));
        }
    },
    __setVerticalAlignment: function(__thisObject, __data) {
        switch(__data) {
            case 't':                  __thisObject[_parameter_.__vAlign]             = _parameter_.__top;       break;
            case 'm':                  __thisObject[_parameter_.__vAlign]             = _parameter_.__middle;    break;
            case 'b':                  delete __thisObject[_parameter_.__vAlign];                    break;
            default:                   _events_.__callError(this.__moduleName, _messages_.__getMessage(this.__invalidOption));
        }
    },
    // 3. Finalize
    __finalize: function(__thisObject) {
        _model_[_parameter_.__fontSize]                         = __thisObject[_parameter_.__fontSize]; 
        if (__thisObject[_parameter_.__type] === this.__textCallout) {
            this.__setCalloutBend(__thisObject, __thisObject[_parameter_.__origin]);
        }
        this.__updateAnchorPoints(__thisObject);
    },
    // 4. Update anchor points
    __updateAnchorPoints: function(__thisObject) {
        var __fontStyle                                = _model_[_parameter_.__fontStyles][__thisObject[_parameter_.__fontStyle]];
        var __fontName                           = __fontStyle[_parameter_.__fontName];
        switch (__thisObject[_parameter_.__type]) {
            case this.__textMultiline:
                // Single occurrence
                var __maxWidth                   = 0.0;
                var __textLines                  = __thisObject[_parameter_.__content].split(_parameter_.__newLine);
                $.each( __textLines, function( __index, __textLine ){
                    var __textWidth              = _utils_.__getTextWidth(__fontName, __thisObject[_parameter_.__fontSize], __textLine);
                    __maxWidth                   = Math.max(__maxWidth, __textWidth);
                });
                var __area                       = {
                                                    x:        __thisObject[_parameter_.__origin].x,
                                                    y:        (__thisObject[_parameter_.__origin].y + __thisObject[_parameter_.__fontSize]),
                                                    width:    __maxWidth,
                                                    height:   -(__thisObject[_parameter_.__fontSize] * __textLines.length),
                                                    rotation: 0.0,
                };
                __thisObject.__anchorPoints      = [__area];
                break;
            case this.__textCallout:
                // Single occurrence
                __thisObject.__anchorPoints      = [__thisObject[_parameter_.__arrow]];
                var __width                      = _utils_.__getTextWidth(__fontName, __thisObject[_parameter_.__fontSize], __thisObject[_parameter_.__content]);
                var __area                       = {
                                                    x:        __thisObject[_parameter_.__origin].x,
                                                    y:        __thisObject[_parameter_.__origin].y - (__thisObject[_parameter_.__fontSize] * 0.5),
                                                    width:    __width,
                                                    height:   __thisObject[_parameter_.__fontSize],
                                                    rotation: 0.0,
                                                };
                __thisObject.__anchorPoints.push(__area);
                break;
            case this.__textRestricted:
                var __width                      = (__thisObject[_parameter_.__oppositeCorner].x - __thisObject[_parameter_.__origin].x);
                var __height                     = (__thisObject[_parameter_.__oppositeCorner].y - __thisObject[_parameter_.__origin].y);
                var __lowerRightCorner           = _utils_.__setDirectionPoint(__thisObject[_parameter_.__origin], __thisObject[_parameter_.__rotation],                   __width);
                var __upperRightCorner           = _utils_.__setDirectionPoint(__lowerRightCorner,    __thisObject[_parameter_.__rotation] + (Math.PI * 0.5), __height);
                var __upperLeftCorner            = _utils_.__setDirectionPoint(__thisObject[_parameter_.__origin], __thisObject[_parameter_.__rotation] + (Math.PI * 0.5), __height);
                
                __thisObject.__anchorPoints      = [
                                                    __thisObject[_parameter_.__origin],
                                                    __lowerRightCorner,
                                                    __upperRightCorner,
                                                    __upperLeftCorner,
                                                    {   x:        __thisObject[_parameter_.__origin].x,
                                                        y:        __thisObject[_parameter_.__origin].y,
                                                        width:    __width,
                                                        height:   __height,
                                                        rotation: __thisObject[_parameter_.__rotation],
                                                    },
                                                   ];
                break;
            default:
                // Simple text: There may be more than one occurrence
                var __xIndex                       = 0;
                var __yIndex                       = 0;
                        __thisObject.__anchorPoints        = [];
                var __textWidth                    = _utils_.__getTextWidth(__fontName, __thisObject[_parameter_.__fontSize], __thisObject[_parameter_.__content]);
                var __alignedOrigin                = {x:__thisObject[_parameter_.__origin].x, y:__thisObject[_parameter_.__origin].y};
                var __rotation                     = __thisObject[_parameter_.__rotation]?__thisObject[_parameter_.__rotation]:0;
                switch (__thisObject[_parameter_.__hAlign]) {
                    case _parameter_.__right:                    __alignedOrigin            = _utils_.__setDirectionPoint(__alignedOrigin, (__rotation + Math.PI), __textWidth);          break;
                    case _parameter_.__center:                   __alignedOrigin            = _utils_.__setDirectionPoint(__alignedOrigin, (__rotation + Math.PI), (__textWidth * 0.5));
                }
                switch (__thisObject[_parameter_.__vAlign]) {
                    case _parameter_.__top:                      __alignedOrigin            = _utils_.__setDirectionPoint(__alignedOrigin, (__rotation + (Math.PI * 1.5)), __thisObject[_parameter_.__fontSize]);  break;
                    case _parameter_.__middle:                   __alignedOrigin            = _utils_.__setDirectionPoint(__alignedOrigin, (__rotation + (Math.PI * 1.5)), (__thisObject[_parameter_.__fontSize] * 0.5));
                }
                var __arrayColumns                 = __thisObject[_parameter_.__arrayColumns]?  __thisObject[_parameter_.__arrayColumns]:  1;
                var __arrayRows                    = __thisObject[_parameter_.__arrayRows]?     __thisObject[_parameter_.__arrayRows]:     1;
                var __arrayColumnWidth             = __thisObject[_parameter_.__arrayColumnWidth]? __thisObject[_parameter_.__arrayColumnWidth]: 0.0;
                var __arrayRowHeight               = __thisObject[_parameter_.__arrayRowHeight]?__thisObject[_parameter_.__arrayRowHeight]:0.0;
                var __arrayRotation                = __thisObject[_parameter_.__arrayRotation]?__thisObject[_parameter_.__arrayRotation]:0.0;
                for (var __xIndex = 0; __xIndex < __arrayColumns; __xIndex += 1) {
                    var __deltaX                   = (__xIndex * __arrayColumnWidth);
                    for (var __yIndex = 0; __yIndex < __arrayRows; __yIndex += 1) {
                        var __deltaY               = (__yIndex * __arrayRowHeight);
                        var __area                 = {
                                                        x:        __alignedOrigin.x + __deltaX,
                                                        y:        __alignedOrigin.y + __deltaY,
                                                        width:    __textWidth,
                                                        height:   __thisObject[_parameter_.__fontSize],
                                                        rotation: __rotation,
                                                   };
                        __thisObject.__anchorPoints.push(__area);
                    }
                }
        }
    },


    // Private procedures
    __setCalloutBend: function(__thisObject, __origin) {
        if (this.__calloutBendLength === 0) {
            this.__calloutBendLength             = Math.max(_model_[_parameter_.__limits][_parameter_.__width], _model_[_parameter_.__limits][_parameter_.__height]) * this.__calloutBendProp;
        }
        if (!__origin) {
            __origin                             = __thisObject[_parameter_.__origin];
        }
        __thisObject[_parameter_.__bend]         = {x:__origin.x, y:__origin.y};
        if (__origin.x < __thisObject[_parameter_.__arrow].x) {
            __thisObject[_parameter_.__bend].x  += (this.__calloutBendLength * 0.5);
        } else {
            __thisObject[_parameter_.__bend].x  -= (this.__calloutBendLength * 0.5);
        }
        var __angle                              = Math.atan2((__thisObject[_parameter_.__bend].y - __thisObject[_parameter_.__arrow].y), (__thisObject[_parameter_.__bend].x - __thisObject[_parameter_.__arrow].x));
        var __arrowBase                          = _utils_.__setDirectionPoint(__thisObject[_parameter_.__arrow], __angle, this.__calloutBendLength); 
        __thisObject[_parameter_.__arrowBaseLeft]  = _utils_.__setDirectionPoint(__arrowBase, (__angle + (Math.PI * 0.5)), (this.__calloutBendLength * 0.25));
        __thisObject[_parameter_.__arrowBaseRight] = _utils_.__setDirectionPoint(__arrowBase, (__angle - (Math.PI * 0.5)), (this.__calloutBendLength * 0.25));
    },


    /* ********************************************************************** */
    // ANALYSIS
    __isHitByPointer: function(__thisObject, __currentPoint, __fuzzValue) {
        if (__thisObject[_parameter_.__type] === this.__textCallout) {
            if (_utils_.__getPointOnVector(__thisObject[_parameter_.__arrow], __thisObject[_parameter_.__bend], __currentPoint, __fuzzValue)) {
                return true;
            } else if (_utils_.__getPointOnVector(__thisObject[_parameter_.__bend], __thisObject[_parameter_.__origin], __currentPoint, __fuzzValue)) {
                return true;
            }
        }
        for (var __pointIndex = 0; __pointIndex < __thisObject.__anchorPoints.length; __pointIndex += 1) {
            var __currentAnchorPoint             = __thisObject.__anchorPoints[__pointIndex];
            if (__currentAnchorPoint[_parameter_.__width]) {
                if (_utils_.__isPointInRectangle(__thisObject.__anchorPoints[__pointIndex], __currentPoint)) {
                    return true;
                };
            } else if (_utils_.__getDistance(__currentAnchorPoint, __currentPoint) < __fuzzValue) {
                return true;
            }
        }
    },


    /* ********************************************************************** */
    // OBJECT MODIFICATION
    __anchorEdit: function(__thisObject, __thisPointIndex, __currentPoint) {
        switch(__thisObject[_parameter_.__type]) {
            case this.__textSimple:
            case this.__textMultiline:
                // Only one point: move origin
                __thisObject[_parameter_.__origin]              = __currentPoint;
                break;
            case this.__textCallout:
                // 0: arrow
                // 1: origin/area
                if (__thisPointIndex === 0) {
                    __thisObject[_parameter_.__arrow]           = __currentPoint;
                } else {
                    __thisObject[_parameter_.__origin]          = __currentPoint;
                }
                this.__setCalloutBend(__thisObject);
                break;
            case this.__textRestricted:
                // 0: origin
                // 1: lower right
                // 2: opposite
                // 3: upper left
                //(4: text area)
                switch (__thisPointIndex) {
                    case 0:
                        // Move text
                        var __deltaX             = (__currentPoint.x - __thisObject[_parameter_.__origin].x);
                        var __deltaY             = (__currentPoint.y - __thisObject[_parameter_.__origin].y);
                        __thisObject[_parameter_.__origin]      = __currentPoint;
                        __thisObject[_parameter_.__oppositeCorner] = {
                                                    x: __thisObject[_parameter_.__oppositeCorner].x + __deltaX,
                                                    y: __thisObject[_parameter_.__oppositeCorner].y + __deltaY,
                                                };
                        break;
                    case 1:
                        // Text width and rotation
                        var __width              = _utils_.__getDistance(__currentPoint, __thisObject[_parameter_.__origin]);
                        __thisObject[_parameter_.__oppositeCorner].x = (__thisObject[_parameter_.__origin].x + __width);
                        __thisObject[_parameter_.__rotation]    = _utils_.__getDirectionFromData(__currentPoint, __thisObject[_parameter_.__origin]);
                        break;
                    case 2:
                        // Text width and height.
                        var __finalDirection     = _utils_.__getDirectionFromData(__currentPoint, __thisObject[_parameter_.__origin]);
                        var __unrotatedDirection = (__finalDirection - __thisObject[_parameter_.__rotation]);
                        var __newDiagonalLength  = _utils_.__getDistance(__currentPoint, __thisObject[_parameter_.__origin]);
                        var __width              = (Math.cos(__unrotatedDirection) * __newDiagonalLength);
                        var __height             = (Math.sin(__unrotatedDirection) * __newDiagonalLength);
                        __thisObject[_parameter_.__oppositeCorner] = {
                                                   x: __thisObject[_parameter_.__origin].x + __width,
                                                   y: __thisObject[_parameter_.__origin].y + __height,
                                                    };
                        break;
                    default:
                        // Text height
                        var __height              = _utils_.__getDistance(__currentPoint, __thisObject[_parameter_.__origin]);
                        __thisObject[_parameter_.__oppositeCorner].y = (__thisObject[_parameter_.__origin].y + __height);
                }
        }
        this.__updateAnchorPoints(__thisObject);
    },

    // ARRAY:  managed by array module

    // CHAMFER:
    __chamfer: function(__thisObject, __point0, __point1) {

    },

    // COPY: managed by edit module

    // EXPLODE:
    __explode: function(__thisObject) {
        var __newObjectsData                   = [];
        if (__thisObject[_parameter_.__type] === this.__textCallout) {
            __newObjectsData.push({type:_polyline_.__polygonType, origin:__thisObject[_parameter_.__arrow],  points:[__thisObject[_parameter_.__arrowBaseLeft], __thisObject[_parameter_.__arrowBaseRight]]});
            __newObjectsData.push({type:_polyline_.__lineType,    origin:__thisObject[_parameter_.__arrow],  points:[__thisObject[_parameter_.__bend]]});
            __newObjectsData.push({type:_polyline_.__lineType,    origin:__thisObject[_parameter_.__bend],   points:[__thisObject[_parameter_.__origin]]});
            __newObjectsData.push({type:this.__textSimple,       origin:__thisObject[_parameter_.__origin], fontStyle: __thisObject[_parameter_.__fontStyle],  fontSize:__thisObject[_parameter_.__fontSize] ,content:__thisObject[_parameter_.__content], rotation:0, vAlign:_parameter_.__middle});
            return __newObjectsData;
        } else if (__thisObject[_parameter_.__type] === this.__textMultiline) {
            var __textLines                        = __thisObject[_parameter_.__content].split(_parameter_.__newLine);
            for (var __lineIndex = 0; __lineIndex < __textLines.length; __lineIndex += 1) {
                __newObjectsData.push({type:      this.__textSimple, 
                                       origin:    {x:__thisObject[_parameter_.__origin].x, y:__thisObject[_parameter_.__origin].y - (__lineIndex * __thisObject[_parameter_.__fontSize])},
                                       fontStyle: __thisObject[_parameter_.__fontStyle], 
                                       fontSize:  __thisObject[_parameter_.__fontSize] ,
                                       content:   __textLines[__lineIndex],
                                       rotation:  0.,
                                      });
            }
            return __newObjectsData;
        }
    },

    // MIRROR: Mirror object from vector
    __mirror: function(__thisObject, __point0, __point1) {
        if (__thisObject[_parameter_.__type] === this.__textCallout) {
            __thisObject[_parameter_.__arrow]                   = _utils_.__mirrorPoint(__point0, __point1, __thisObject[_parameter_.__arrow]);
            __thisObject[_parameter_.__origin]                  = _utils_.__mirrorPoint(__point0, __point1, __thisObject[_parameter_.__origin]);
            this.__setCalloutBend(__thisObject);
        } else {
            __thisObject[_parameter_.__origin]                  = _utils_.__mirrorPoint(__point0, __point1, __thisObject[_parameter_.__origin]);
            // TODO: Text alignment...
        }
        this.__updateAnchorPoints(__thisObject);
    },

    // MOVE: Move object
    __move: function(__thisObject, __displacement) {
        if (__thisObject[_parameter_.__type] === this.__textCallout) {
            __thisObject[_parameter_.__arrow]                   = _utils_.__movePoint(__thisObject[_parameter_.__arrow], __displacement);
            __thisObject[_parameter_.__origin]                  = _utils_.__movePoint(__thisObject[_parameter_.__origin], __displacement);
            this.__setCalloutBend(__thisObject);
        } else {
            __thisObject[_parameter_.__origin]                  = _utils_.__movePoint(__thisObject[_parameter_.__origin], __displacement);
        }
        this.__updateAnchorPoints(__thisObject);
    },

    // OFFSET: action is not valid

    // ROTATE: Rotate object around origin
    __rotate: function(__thisObject, __thisAnchorPoint, __thisAngle) {
        if (__thisObject[_parameter_.__type] === this.__textCallout) {
            __thisObject[_parameter_.__arrow]                   = _utils_.__rotatePoint(__thisObject[_parameter_.__arrow], __thisAnchorPoint, __thisAngle);
            __thisObject[_parameter_.__origin]                  = _utils_.__rotatePoint(__thisObject[_parameter_.__origin], __thisAnchorPoint, __thisAngle);
            this.__setCalloutBend(__thisObject);
        } else {
            __thisObject[_parameter_.__origin]                  = _utils_.__rotatePoint(__thisObject[_parameter_.__origin], __thisAnchorPoint, __thisAngle);
            __thisObject[_parameter_.__rotation]               += __thisAngle;
        }
        this.__updateAnchorPoints(__thisObject);
    },

    // SCALE: Scale object: scales origin and size.
    __scale: function(__thisObject, __from, __thisScale) {
        if (__thisObject[_parameter_.__type] === this.__textCallout) {
            __thisObject[_parameter_.__arrow]                   = _utils_.__scalePoint(__thisObject[_parameter_.__arrow], __from, __thisScale);
            __thisObject[_parameter_.__origin]                  = _utils_.__scalePoint(__thisObject[_parameter_.__origin], __from, __thisScale);
            this.__setCalloutBend(__thisObject, __thisObject[_parameter_.__origin]);
            __thisObject[_parameter_.__fontSize]               *= __thisScale;
        } else {
            __thisObject[_parameter_.__origin] = _utils_.__scalePoint(__thisObject[_parameter_.__origin], __from, __thisScale);
            __thisObject[_parameter_.__fontSize]               *= __thisScale;
        }
        this.__updateAnchorPoints(__thisObject);
    },

    // STRETCH: Not applicable for text
    __stretch: function(__thisObject, __area, __directionVector) {
        if (__thisObject[_parameter_.__type] === this.__textCallout) {
            // To define: from
            var __pointIndex                     = _utils_.__getNearestPoint([__thisObject[_parameter_.__arrow], __thisObject[_parameter_.__origin]], from);
            if (__pointIndex === 0) {
                __thisObject[_parameter_.__arrow]               = {x:to.x, y:to.y};
            } else {
                __thisObject[_parameter_.__origin]              = {x:to.x, y:to.y};
            }
            this.__setCalloutBend(__thisObject, __thisObject[_parameter_.__origin]);
            this.__updateAnchorPoints(__thisObject);
        }
    }

    // TRIM: Action is not valid

};
