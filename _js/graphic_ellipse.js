var _ellipse_ = {

    __moduleName:             '_ellipse_',
 
    // Ellipse parameters:
    //    An ellipse is defined by its container box.
    // Primary:
        //__firstCorner
        //__oppositeCorner
    // Secondary
        //__rotation
        //__startAngle
        //__endAngle
    // Derived properties
        //__origin
        //__xRadius
        //__yRadius
    // Anchor points (counter-clockwise, from lower left corner:):
    //  0:       origin
    //  1,3,5,7: corners
    //  2,4,6,8: ellipse quadrants

    /* ******************************************************** */
    //  PROPERTIES
    __chooseEllipseType: function() {
        _inputSelect_.__selectObjectByType(this.__moduleName, Object.keys(this.__parameterObject), '_ellipse_._processEllipseByType(__inputValue)');
    },
    _processEllipseByType: function(__inputValue) {
        var __option                             = __inputValue.replace('ellipse', '');
        _add_.__initialize('ellipse', __option);
    },
    // Construction options:
    __ellipseType:            'ellipse',
    __arcOption:              'Arc',
    __boxOption:              'Box',

    __ellipseSegmentsCount:   24,
    __ellipsePoints:          null,

    //  Edit parameters:
    __parameterObject: {
         ellipse:{
            __parameterNames: [_parameter_.__origin,             _parameter_.__xRadius,              _parameter_.__yRadius,              _parameter_.__rotation],
            __parameterTypes: [_parameter_.__parameterTypePoint, _parameter_.__parameterTypeNumeric, _parameter_.__parameterTypeNumeric, _parameter_.__parameterTypeNumeric],
        },
        ellipseArc:{
            __parameterNames: [_parameter_.__origin,             _parameter_.__xRadius,              _parameter_.__yRadius,              _parameter_.__rotation,             _parameter_.__startAngle,           _parameter_.__endAngle,             _parameter_.__ccw],
            __parameterTypes: [_parameter_.__parameterTypePoint, _parameter_.__parameterTypeNumeric, _parameter_.__parameterTypeNumeric, _parameter_.__parameterTypeNumeric, _parameter_.__parameterTypeNumeric, _parameter_.__parameterTypeNumeric, _parameter_.__parameterTypeBoolean],
        },
        ellipseBox:{
            __parameterNames: [_parameter_.__origin,             _parameter_.__oppositeCorner,     _parameter_.__rotation],
            __parameterTypes: [_parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint, _parameter_.__parameterTypeNumeric],
        }
    },


    /* ******************************************************** */
    //  PROCEDURES

    // 1. Initialize: Done in _add_ module.

    // 2. Data acquisition: checking against previous parameters:
    __addParameterData: function(__thisObject, __data) {
        switch (_add_.__parameterName) {
            case _parameter_.__origin:
                __thisObject[_parameter_.__origin]           = __data;
                break;
            case _parameter_.__oppositeCorner:
                if (_utils_.__getLengthFromData(__data, __thisObject[_parameter_.__origin]) > 0.0) {
                    __thisObject[_add_.__parameterName] = __data;
                } else {
                    return;
                }
                break;
            case _parameter_.__xRadius:
            case _parameter_.__yRadius:
                var __radius                     = _utils_.__getLengthFromData(__data, __thisObject[_parameter_.__origin]);
                if (__radius > 0.0) {
                    __thisObject[_add_.__parameterName]  = __radius;
                } else {
                    return;
                }
                break;
            case _parameter_.__rotation:
            case _parameter_.__startAngle:
            case _parameter_.__endAngle:
                if (_utils_.__hasXproperty(__data)) {
                    if (_utils_.__getDistance(__data, __thisObject[_parameter_.__origin]) > 0.0) {
                        if (__thisObject[_parameter_.__oppositeCorner]) {
                            var __center         = _utils_.__getMidPoint(__thisObject[_parameter_.__origin], __thisObject[_parameter_.__oppositeCorner]);
                            __thisObject[_add_.__parameterName]      = _utils_.__getDirectionFromData(__data, __center);
                        } else {
                            __thisObject[_add_.__parameterName]      =_utils_.__getDirectionFromData(__data, __thisObject[_parameter_.__origin]);
                        }
                    } else {
                        return;
                    }
                } else {
                    __thisObject[_add_.__parameterName]      = __data;
                }
                break;
            case _parameter_.__ccw:
                __thisObject[_parameter_.__ccw]              = !__data;
        }
        return true;
    },


    // 3. Finalize
    __finalize: function(__thisObject) {
        if (__thisObject[_parameter_.__option] === this.__boxOption) {
            // Set area oject
            var __area                           = _utils_.__getArea(__thisObject[_parameter_.__origin], __thisObject[_parameter_.__oppositeCorner]);
            // Reset first and opposite corner
            __thisObject[_parameter_.__firstCorner]= {
                                                    x: __area.x,
                                                    y: __area.y,
                                                   };
            __thisObject[_parameter_.__oppositeCorner]       = {
                                                    x: __area.x + __area[_parameter_.__width],
                                                    y: __area.y + __area[_parameter_.__width],
                                                   };
            __thisObject[_parameter_.__xRadius]              = (__area[_parameter_.__width]  * 0.5);
            __thisObject[_parameter_.__yRadius]              = (__area[_parameter_.__height] * 0.5);
            __thisObject[_parameter_.__origin]               = {
                                                    x: __area.x + __thisObject[_parameter_.__xRadius],
                                                    y: __area.y + __thisObject[_parameter_.__yRadius],
                                                   };
            __thisObject[_parameter_.__startAngle]           = 0.0;
            __thisObject[_parameter_.__endAngle]             = (Math.PI * 2.0);
            __thisObject[_parameter_.__ccw]                  = false;
        } else {
            // Other ellipse objects built from center (origin)
            __thisObject[_parameter_.__firstCorner] = {
                                                    x: __thisObject[_parameter_.__origin].x - __thisObject[_parameter_.__xRadius],
                                                    y: __thisObject[_parameter_.__origin].y - __thisObject[_parameter_.__yRadius],
                                                   };
            __thisObject[_parameter_.__oppositeCorner]       = {
                                                    x: __thisObject[_parameter_.__origin].x + __thisObject[_parameter_.__xRadius],
                                                    y: __thisObject[_parameter_.__origin].y + __thisObject[_parameter_.__yRadius],
                                                   };
        }
        if (!__thisObject[_parameter_.__startAngle]) {
            __thisObject[_parameter_.__startAngle]           = 0.0;
        }
        if (!__thisObject[_parameter_.__endAngle]) {
            __thisObject[_parameter_.__endAngle]             = (Math.PI * 2.0);
        }
        if (__thisObject[_parameter_.__ccw]) {
            var __direction                                  = __thisObject[_parameter_.__startAngle];
            __thisObject[_parameter_.__startAngle]           = __thisObject[_parameter_.__endAngle];
            __thisObject[_parameter_.__endAngle]             = __direction;
        }
        delete __thisObject[_parameter_.__ccw];
        delete __thisObject[_parameter_.__option];
        this.__updateAnchorPoints(__thisObject);
    },


    // 4. Set anchor points
    __updateAnchorPoints: function(__thisObject) {
            // Ellipse Box Points
            // Quadrants:
            var __middleBottomSide               = _utils_.__setDirectionPoint(__thisObject[_parameter_.__origin], __thisObject[_parameter_.__rotation] + (Math.PI * 1.5), __thisObject[_parameter_.__yRadius]);
            var __middleRightSide                = _utils_.__setDirectionPoint(__thisObject[_parameter_.__origin], __thisObject[_parameter_.__rotation] + (Math.PI * 0.0), __thisObject[_parameter_.__xRadius]);
            var __middleTopSide                  = _utils_.__setDirectionPoint(__thisObject[_parameter_.__origin], __thisObject[_parameter_.__rotation] + (Math.PI * 0.5), __thisObject[_parameter_.__yRadius]);
            var __MiddleLeftSide                 = _utils_.__setDirectionPoint(__thisObject[_parameter_.__origin], __thisObject[_parameter_.__rotation] + (Math.PI * 1.0), __thisObject[_parameter_.__xRadius]);
            // Corners:
            var __bottomLeftCorner               = _utils_.__setDirectionPoint(__middleBottomSide,  __thisObject[_parameter_.__rotation] + (Math.PI * 1.0), __thisObject[_parameter_.__xRadius]);
            var __bottomRightCorner              = _utils_.__setDirectionPoint(__middleBottomSide,  __thisObject[_parameter_.__rotation] + (Math.PI * 0.0), __thisObject[_parameter_.__xRadius]);
            var __topRightCorner                 = _utils_.__setDirectionPoint(__middleTopSide,       __thisObject[_parameter_.__rotation] + (Math.PI * 0.0), __thisObject[_parameter_.__xRadius]);
            var __topLeftCorner                  = _utils_.__setDirectionPoint(__middleTopSide,       __thisObject[_parameter_.__rotation] + (Math.PI * 1.0), __thisObject[_parameter_.__xRadius]);

            // Ellipse Anchor Points
            __thisObject.__anchorPoints          = [
                                                    __thisObject[_parameter_.__origin],
                                                    __bottomLeftCorner,
                                                    __middleBottomSide,
                                                    __bottomRightCorner,
                                                    __middleRightSide,
                                                    __topRightCorner,
                                                    __middleTopSide,
                                                    __topLeftCorner,
                                                    __MiddleLeftSide,
                                                   ];
            if (__thisObject[_parameter_.__option] === this.__arcOption) {
                var __midDirection                 = (__endAngle + __thisObject[_parameter_.__startAngle]) * 0.5;
                __thisObject.__anchorPoints.push(this.__getPointOnEllipse(__thisObject, __thisObject[_parameter_.__startAngle]));
                __thisObject.__anchorPoints.push(this.__getPointOnEllipse(__thisObject, __midDirection));
                __thisObject.__anchorPoints.push(this.__getPointOnEllipse(__thisObject, __thisObject[_parameter_.__endAngle]));
            }
            this.__setEllipseSegments(__thisObject);

    },
    __getPointOnEllipse: function(__xRadius, __yRadius, __thisDirection) {
        var a2                                   = __xRadius * __xRadius;
        var ab                                   = __xRadius * __yRadius;
        var b2                                   = __yRadius * __yRadius;
        if (__thisDirection < 0.0) {
            __thisDirection                     += (Math.PI * 2.0);
        }
        var angleTan                             = Math.tan(__thisDirection);
        var angleTan2                            = (angleTan * angleTan);
        var f                                    = Math.sqrt(b2 + (a2 * angleTan2));
        var x                                    = (ab / f);
        var y                                    = ((ab * angleTan) / f);
        if (((Math.PI * 0.5) < __thisDirection) && (__thisDirection <= (Math.PI * 1.5))) {
            x                                    = -x;
            y                                    = -y;
        }
        return {x:x, y:y};
    },
    __setEllipseSegments: function(__thisObject) {
        __thisObject.__ellipsePoints             = [];
        var __startDirection                     = __thisObject[_parameter_.__startAngle]?__thisObject[_parameter_.__startAngle]:0;
        var __endDirection                       = __thisObject[_parameter_.__endAngle]?__thisObject[_parameter_.__endAngle]:(Math.PI * 2);
        if (__endDirection < __startDirection) {
            __endDirection += (Math.PI * 2);
        }
        var __segmentArcSpan                     = (Math.PI / this.__ellipseSegmentsCount);
        var __segmentCount                       = Math.round((__endDirection - __startDirection) / __segmentArcSpan);
        var __arcIncrement                       = ((__endDirection - __startDirection) / __segmentCount);
        var __segmentIndex                       = 0;
        for (var __segmentIndex = 0; __segmentIndex <= __segmentCount; __segmentIndex += 1) {
            var __segmentDirection               = (__startDirection + (__arcIncrement * __segmentIndex));
            var __currentPoint                   = this.__getPointOnEllipse(__thisObject[_parameter_.__xRadius], __thisObject[_parameter_.__yRadius], __segmentDirection);
            __thisObject.__ellipsePoints.push(_utils_.__getAbsolutePoint(__thisObject[_parameter_.__origin], __currentPoint, __thisObject[_parameter_.__rotation]));
        }
    },


    // 5. Analysis
    __isHitByPointer: function(__thisObject, __currentPoint, __fuzzValue) {
        if (_utils_.__isPointOnAnyAnchor(__thisObject.__anchorPoints, __currentPoint, __fuzzValue)) {
            return true;
        } else {
            return (_utils_.__isPointOnAnyVector(__thisObject.__ellipsePoints, __currentPoint, __fuzzValue, true));
        }
    },


    /* ********************************************************************** */
    // OBJECT MODIFICATION
    __anchorEdit: function(__thisObject, __thisPointIndex, __currentPoint) {
        if (__thisPointIndex === 0) {
            __thisObject[_parameter_.__origin]          = __currentPoint;
        } else {
            // ellipse
            // 0: origin (done)
            // 1, 3: xRadius
            // 2, 4: yRadius
            if ((__thisPointIndex % 2) === 1) {
                __thisObject[_parameter_.__xRadius] = _utils_.__getDistance(__thisObject[_parameter_.__origin], __currentPoint);
            } else {
                __thisObject[_parameter_.__yRadius] = _utils_.__getDistance(__thisObject[_parameter_.__origin], __currentPoint);
            }
        }
        this.__updateAnchorPoints(__thisObject);
    },

    // ARRAY:  managed by array module

    // CHAMFER: action is not valid.

    // COPY: managed by edit module

    // EXPLODE: action is not valid.

    // FILLET: action is not valid.

    // MOVE: Move object
    __move: function(__thisObject, __displacement) {
        __thisObject[_parameter_.__origin]                   = _utils_.__movePoint(__thisObject[_parameter_.__origin], __displacement);
        this.__updateAnchorPoints(__thisObject);
    },

    // MIRROR: Mirror object from vector
    __mirror: function(__thisObject, __point0, __point1) {
        // TODO
        this.__updateAnchorPoints(__thisObject);
    },

    // OFFSET:
    // TODO: Need to check actual position on ellipse
    __offset: function(__thisObject, __currentPoint, __offset) {
        var __newObject                              = $.extend(true, {}, __thisObject);
        _modelTools_.__addObject(__newObject);
        if (__offset) {
            if (_utils_.__getDistance(__thisObject[_parameter_.__origin], __currentPoint) > __thisObject[ _parameter_.__radius]) {
                __thisObject[ _parameter_.__radius] += Math.abs(__offset);
            } else {
                __thisObject[ _parameter_.__radius] -= Math.abs(__offset);
            }
        } else {
            __thisObject[ _parameter_.__radius]      = _utils_.__getDistance(__thisObject[_parameter_.__origin], __currentPoint);
        }
        this.__updateAnchorPoints(__newObject);
    },

    // ROTATE: Rotate object around origin
    __rotate: function(__thisObject, __thisAnchor, __thisRotation) {
        __thisObject[_parameter_.__origin] = _utils_.__rotatePoint(__thisObject[_parameter_.__origin], __thisAnchor, __thisRotation);
        if (__thisObject[_parameter_.__startAngle]) {
            __thisObject[_parameter_.__startAngle]          += __thisRotation;
            __thisObject[_parameter_.__endAngle]            += __thisRotation;
        }
        this.__updateAnchorPoints(__thisObject);
    },

    // SCALE: Scale object: scales each point in turn.
    __scale: function(__thisObject, __fromPoint, __thisScale) {
        __thisObject[_parameter_.__origin]                   = _utils_.__scalePoint(__thisObject[_parameter_.__origin], __fromPoint, __thisScale);
        if (__thisObject[_parameter_.__radius]) {
            __thisObject[_parameter_.__radius]              *= __thisScale;
        } else {
            __thisObject[_parameter_.__xRadius]             *= __thisScale;
            __thisObject[_parameter_.__yRadius]             *= __thisScale;
        }
        this.__updateAnchorPoints(__thisObject);
    },

    // STRETCH: Stretch is used to move one of the two points.
    __stretch: function(__thisObject, __area, __directionVector) {
        // TODO
        this.__updateAnchorPoints(__thisObject);
    },

    // Trim: Stretch is used to move one of the two points.
    __trim: function(__thisObject, __firstPoint, __secondPoint, __sidePoint) {
        // TODO
        this.__updateAnchorPoints(__thisObject);
    },
};
