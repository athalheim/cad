var _rectangle_ = {

    __moduleName:             '_rectangle_',
    __chooseRectangleType: function() {
        _inputSelect_.__selectObjectByType(this.__moduleName, Object.keys(this.__parameterObject), '_rectangle_._processRectangleByType(__inputValue)');
    },
    _processRectangleByType: function(__inputValue) {
        _add_.__initialize(__inputValue, '');
    },

    /* ******************************************************** */
    //  PROPERTIES
    //  Rectangle options:
    __squareType:             'square',
    __rectangleType:          'rectangle',
    __parallelogramType:      'parallelogram',
    __trapezeType:            'trapeze',
    //  Edit parameters:
    __parameterObject: {
        square: {
            __parameterNames: [_parameter_.__origin,             _parameter_.__width,                _parameter_.__rotation],
            __parameterTypes: [_parameter_.__parameterTypePoint, _parameter_.__parameterTypeNumeric, _parameter_.__parameterTypeNumeric],
        },
        rectangle: {
            __parameterNames: [_parameter_.__origin,             _parameter_.__oppositeCorner,     _parameter_.__rotation],
            __parameterTypes: [_parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint, _parameter_.__parameterTypeNumeric],
        },
        parallelogram: {
            __parameterNames: [_parameter_.__origin,             _parameter_.__width,                _parameter_.__summit,             _parameter_.__rotation],
            __parameterTypes: [_parameter_.__parameterTypePoint, _parameter_.__parameterTypeNumeric, _parameter_.__parameterTypePoint, _parameter_.__parameterTypeNumeric],
        },
        trapeze: {
            __parameterNames: [_parameter_.__origin,             _parameter_.__width,                _parameter_.__summit,             _parameter_.__rotation],
            __parameterTypes: [_parameter_.__parameterTypePoint, _parameter_.__parameterTypeNumeric, _parameter_.__parameterTypePoint, _parameter_.__parameterTypeNumeric],
        }
    },


    // ? Options: square, parallelogram

    /* ******************************************************** */
    //  PROCEDURES

    // 1. Initialize: Done in _add_ module.

    // 2. Data acquisition
    __addParameterData: function(__thisObject, __data) {
        switch (_add_.__parameterName) {
            case _parameter_.__origin:
                __thisObject[_parameter_.__origin]              = __data;
            case _parameter_.__width:
            case _parameter_.__height:
                var __length                     = _utils_.__getLengthFromData(__data, __thisObject[_parameter_.__origin]);
                if (__length > 0.0) {
                    __thisObject[_add_.__parameterName] = __length;
                }
                break;
            case _parameter_.__summit:
            case _parameter_.__oppositeCorner:
                // This parameter combines height and angle:
                if (_utils_.__getLengthFromData(__data, __thisObject[_parameter_.__origin]) > 0.0) {
                    __thisObject[_add_.__parameterName] = __data;
                } else {
                    return;
                }
                break;
            case _parameter_.__rotation:
                if (_utils_.__hasXproperty(__data)) {
                    if (_utils_.__getDistance(__data, __thisObject[_parameter_.__origin]) > 0.0) {
                        __thisObject[_parameter_.__rotation] = _utils_.__getDirectionFromData(__data, __thisObject[_parameter_.__origin]);
                    } else {
                        return;
                    }
                } else  {
                    __thisObject[_parameter_.__rotation] = __data;
                }

        }
        return true;
    },


    // 3. Finalize
    __finalize: function(__thisObject) {
        if (__thisObject[_parameter_.__type] === this.__rectangleType) {
            var __diagonalDirection              = Math.atan2((__thisObject[_parameter_.__oppositeCorner].y - __thisObject[_parameter_.__origin].y), (__thisObject[_parameter_.__oppositeCorner].x - __thisObject[_parameter_.__origin].x));
            var __diagonalLength                 = _utils_.__getDistance(__thisObject[_parameter_.__oppositeCorner], __thisObject[_parameter_.__origin]);
            __thisObject[_parameter_.__width]                   = Math.cos(__diagonalDirection) * __diagonalLength;
            __thisObject[_parameter_.__height]                  = Math.sin(__diagonalDirection) * __diagonalLength;
            delete __thisObject[_parameter_.__oppositeCorner];
        }
        this.__updateAnchorPoints(__thisObject);
    },

    // 4. Analysis
    __isHitByPointer: function(__thisObject, __currentPoint, __fuzzValue) {
        return (_utils_.__isPointOnAnyVector(__thisObject.__anchorPoints, __currentPoint, __fuzzValue, true));
    },

    // 5. Update anchor points
    __updateAnchorPoints: function(__thisObject) {
        var __rightCorner                          = _utils_.__setDirectionPoint(__thisObject[_parameter_.__origin], __thisObject[_parameter_.__rotation],                                __thisObject[_parameter_.__width]);
        var __height                               = 0.0;
        var __oppositeCorner                       = null;
        var __topCorner                            = null;
        var __objectAngle                          = (Math.PI * 0.5);
        if (__thisObject[_parameter_.__summit]) {
            __objectAngle                          = _utils_.__getDirectionFromData(__thisObject[_parameter_.__summit], __thisObject[_parameter_.__origin]);
            var __radius                           = _utils_.__getLengthFromData(__thisObject[_parameter_.__summit], __thisObject[_parameter_.__origin]);
            __height                               = (__radius * Math.sin(__objectAngle));
        } else if (__thisObject[_parameter_.__height]) {
            __height                               = __thisObject[_parameter_.__height];
        } else {
            __height                               = __thisObject[_parameter_.__width];
        }
        var __adjustedHeight                       = (__height / Math.sin(__objectAngle));
        __topCorner                                = _utils_.__setDirectionPoint(__thisObject[_parameter_.__origin], __thisObject[_parameter_.__rotation] + __objectAngle,             __adjustedHeight);
        if (__thisObject[_parameter_.__type] === this.__trapezeType) {
            __oppositeCorner                       = _utils_.__setDirectionPoint(__rightCorner,       __thisObject[_parameter_.__rotation] + (Math.PI - __objectAngle), __adjustedHeight);
        } else {
            __oppositeCorner                       = _utils_.__setDirectionPoint(__rightCorner,       __thisObject[_parameter_.__rotation] + __objectAngle,             __adjustedHeight);
        }
        __thisObject.__anchorPoints                  = [__thisObject[_parameter_.__origin]];
        __thisObject.__anchorPoints.push(_utils_.__getMidPoint(__thisObject[_parameter_.__origin], __rightCorner));
        __thisObject.__anchorPoints.push(__rightCorner);
        __thisObject.__anchorPoints.push(_utils_.__getMidPoint(__rightCorner, __oppositeCorner));
        __thisObject.__anchorPoints.push(__oppositeCorner);
        __thisObject.__anchorPoints.push(_utils_.__getMidPoint(__oppositeCorner, __topCorner));
        __thisObject.__anchorPoints.push(__topCorner);
        __thisObject.__anchorPoints.push(_utils_.__getMidPoint(__topCorner, __thisObject[_parameter_.__origin]));
        // Close polygon:
        __thisObject.__anchorPoints.push(__thisObject[_parameter_.__origin]);
    },

    /* ********************************************************************** */
    // OBJECT MODIFICATION
    __anchorEdit: function(__thisObject, __thisPointIndex, __currentPoint) {
        switch(__thisPointIndex) {
            case 0:
                __thisObject[_parameter_.__origin]         = __currentPoint;
                break;
            case 1:
                // 1: Mid base: stretch down
                var __perpendicularPointOnBase   = _utils_.__getPointPerpendicularToVector(__thisObject[_parameter_.__origin], __thisObject.__anchorPoints[2], __currentPoint);
                var __distanceBetweenCurrentAndPerpendicular = _utils_.__getDistance(__currentPoint, __perpendicularPointOnBase);
                var __directionToCurrentPoint    = _utils_.__getDirectionFromData(__currentPoint, __perpendicularPointOnBase);
                __thisObject[_parameter_.__origin]         = _utils_.__setDirectionPoint(__thisObject[_parameter_.__origin], __directionToCurrentPoint, __distanceBetweenCurrentAndPerpendicular);
                __thisObject[_parameter_.__height]        += __distanceBetweenCurrentAndPerpendicular;
                break;
            case 2:
                // 2: Right corner: width and rotation
                __thisObject[_parameter_.__rotation]       = _utils_.__getDirectionFromData(__currentPoint, __thisObject[_parameter_.__origin]);
                __thisObject[_parameter_.__width]          = _utils_.__getDistance(__currentPoint, __thisObject[_parameter_.__origin]);
                break;
            case 3:
                // 3: Mid-opposite side: stretch right
                var __perpendicularPointOnSide   = _utils_.__getPointPerpendicularToVector(__thisObject[_parameter_.__origin], __thisObject.__anchorPoints[6], __currentPoint);
                var __distanceBetweenCurrentAndPerpendicular = _utils_.__getDistance(__currentPoint, __perpendicularPointOnSide);
                __thisObject[_parameter_.__width]          = __distanceBetweenCurrentAndPerpendicular;
                break;
            case 4:
                // 4: Opposite corner: width and height
                var __distanceToCurrentPoint     = _utils_.__getDistance(__currentPoint, __thisObject[_parameter_.__origin]);
                var __directionToCurrentPoint    = _utils_.__getDirectionFromData(__currentPoint, __thisObject[_parameter_.__origin]);
                __thisObject[_parameter_.__width]          = __distanceToCurrentPoint * Math.cos(__directionToCurrentPoint - __thisObject[_parameter_.__rotation]);
                __thisObject[_parameter_.__height]         = __distanceToCurrentPoint * Math.sin(__directionToCurrentPoint - __thisObject[_parameter_.__rotation]);
                break;
            case 5:
                // 5: Mid top: stretch up
                var __perpendicularPointOnBase   = _utils_.__getPointPerpendicularToVector(__thisObject[_parameter_.__origin], __thisObject.__anchorPoints[2], __currentPoint);
                var __distanceBetweenCurrentAndPerpendicular = _utils_.__getDistance(__currentPoint, __perpendicularPointOnBase);
                var __directionToCurrentPoint    = _utils_.__getDirectionFromData(__currentPoint, __perpendicularPointOnBase);
                __thisObject[_parameter_.__height] = __distanceBetweenCurrentAndPerpendicular;
                break;
            case 6:
                // 6: Top corner: height
                __thisObject[_parameter_.__height]         = _utils_.__getDistance(__currentPoint, __thisObject[_parameter_.__origin]);
                break;
            case 7:
                // 7: Mid adjacent side: stretch left
                var __perpendicularPointOnSide   = _utils_.__getPointPerpendicularToVector(__thisObject[_parameter_.__origin], __thisObject.__anchorPoints[6], __currentPoint);
                var __distanceBetweenCurrentAndPerpendicular = _utils_.__getDistance(__currentPoint, __perpendicularPointOnSide);
                var __directionToCurrentPoint    = _utils_.__getDirectionFromData(__currentPoint, __perpendicularPointOnSide);
                __thisObject[_parameter_.__origin]         = _utils_.__setDirectionPoint(__thisObject[_parameter_.__origin], __directionToCurrentPoint, __distanceBetweenCurrentAndPerpendicular);
                __thisObject[_parameter_.__width]         += __distanceBetweenCurrentAndPerpendicular;
                break;
        }
        this.__updateAnchorPoints(__thisObject);
    },

    // ARRAY:  managed by array module

    // CHAMFER:
    __chamfer: function(__thisObject, __point0, __point1) {

    },

    // COPY: managed by edit module

    // EXPLODE
    __explode: function(__thisObject) {
        // TODO
    },

    // MIRROR: Mirror object from vector
    __mirror: function(__thisObject, __point0, __point1) {
        // TODO
        this.__updateAnchorPoints(__thisObject);
    },

    // MOVE: Move object
    __move: function(__thisObject, __displacement) {
        __thisObject[_parameter_.__origin]                        = _utils_.__movePoint(__thisObject[_parameter_.__origin], __displacement);
        this.__updateAnchorPoints(__thisObject);
    },

    // OFFSET:
    // TODO
    __offset: function(__thisObject, __currentPoint, __offset) {
        switch (__thisObject[_parameter_.__type]) {
            case this.__rectangleType:
                this.__offsetRectangle(__thisObject, __currentPoint, __offset);
                break;
            case this.__squareType:
                this.__offsetSquare(__thisObject, __currentPoint, __offset);
                break;
            case this.__parallelogramType:
                this.__offsetParallelogram(__thisObject, __currentPoint, __offset);
                break;
            case this.__trapezeType:
                this.__offsetTrapeze(__thisObject, __currentPoint, __offset);
        }
        this.__updateAnchorPoints(__thisObject);
    },

    __offsetRectangle: function(__thisObject, __currentPoint, __offset) {
        var __newObject                              = $.extend(true, {}, __thisObject);
        if (__offset) {
            var __newArea = {
                x: __newObject[_parameter_.__origin].x,
                y: __newObject[_parameter_.__origin].y,
                width: __newObject[_parameter_.__width],
                height: __newObject[_parameter_.__width],
                rotation:__newObject[_parameter_.__rotation],
            };
            if (_utils_.__isPointInRectangle(__newArea, __currentPoint)) {
                if (((__offset * 2) > __newObject[_parameter_.__width]) || ((__offset * 2) > __newObject[_parameter_.__height])) {
                    _events_.__callError(this.__moduleName, _messages_.__getMessage(this.__invalidEntry));
                    return;
                } else {
                    __newObject[_parameter_.__origin]      = _utils_.__setDirectionPoint(__newObject[_parameter_.__origin], __newObject[_parameter_.__rotation], __offset);
                    __newObject[_parameter_.__origin]      = _utils_.__setDirectionPoint(__newObject[_parameter_.__origin], __newObject[_parameter_.__rotation] + (Math.PI * 0.5), __offset);
                    __newObject[_parameter_.__width]      -= (__offset * 2);
                    __newObject[_parameter_.__height]     -= (__offset * 2);
                }
            } else {
                __newObject[_parameter_.__origin]          = _utils_.__setDirectionPoint(__newObject[_parameter_.__origin], __newObject[_parameter_.__rotation] + (Math.PI * 1.0), __offset);
                __newObject[_parameter_.__origin]          = _utils_.__setDirectionPoint(__newObject[_parameter_.__origin], __newObject[_parameter_.__rotation] + (Math.PI * 1.5), __offset);
                __newObject[_parameter_.__width]          += (__offset * 2);
                __newObject[_parameter_.__height]         += (__offset * 2);
            }
        } else {
            // TODO
        }
        _modelTools_.__addObject(__newObject);
    },
    __offsetSquare: function(__thisObject, __currentPoint, __offset) {
        var __newObject                                    = $.extend(true, {}, __thisObject);
        if (__offset) {
            var __newArea = {
                    x: __newObject[_parameter_.__origin].x,
                    y: __newObject[_parameter_.__origin].y,
                    width: __newObject[_parameter_.__width],
                    height: __newObject[_parameter_.__width],
                    rotation:__newObject[_parameter_.__rotation],
                };
            if (_utils_.__isPointInRectangle(__newArea, __currentPoint)) {
                if ((__offset * 2) > __newObject[_parameter_.__width]) {
                    _events_.__callError(this.__moduleName, _messages_.__getMessage(this.__invalidEntry));
                    return;
                } else {
                    __newObject[_parameter_.__origin]      = _utils_.__setDirectionPoint(__newObject[_parameter_.__origin], __newObject[_parameter_.__rotation], __offset);
                    __newObject[_parameter_.__origin]      = _utils_.__setDirectionPoint(__newObject[_parameter_.__origin], __newObject[_parameter_.__rotation] + (Math.PI * 0.5), __offset);
                    __newObject[_parameter_.__width]      -= (__offset * 2);
                }
            } else {
                __newObject[_parameter_.__origin]          = _utils_.__setDirectionPoint(__newObject[_parameter_.__origin], __newObject[_parameter_.__rotation] + (Math.PI * 1.0), __offset);
                __newObject[_parameter_.__origin]          = _utils_.__setDirectionPoint(__newObject[_parameter_.__origin], __newObject[_parameter_.__rotation] + (Math.PI * 1.5), __offset);
                __newObject[_parameter_.__width]          += (__offset * 2);
            }

        } else {
            
        }
        _modelTools_.__addObject(__newObject);
    },
    __offsetParallelogram: function(__thisObject, __currentPoint, __offset) {
        var __newObject                              = $.extend(true, {}, __thisObject);
        _modelTools_.__addObject(__newObject);
        if (__offset) {
            // TODO
        } else {
            // TODO
        }
    },
    __offsetTrapeze: function(__thisObject, __currentPoint, __offset) {
        var __newObject                              = $.extend(true, {}, __thisObject);
        _modelTools_.__addObject(__newObject);
        if (__offset) {
            // TODO
        } else {
            // TODO
        }
    },
    
    // ROTATE: Rotate object around origin
    __rotate: function(__thisObject, __thisAnchorPoint, __thisRotation) {
        __thisObject[_parameter_.__origin]                        = _utils_.__rotatePoint(__thisObject[_parameter_.__origin], __thisAnchorPoint, __thisRotation);
        __thisObject[_parameter_.__rotation]                     += __thisRotation;
        this.__updateAnchorPoints(__thisObject);
    },

    // SCALE: Scale object: scales each point in turn.
    __scale: function(__thisObject, __from, __thisScale) {
        __thisObject[_parameter_.__origin]                        = _utils_.__scalePoint(__thisObject[_parameter_.__origin], __from, __thisScale);
        __thisObject[_parameter_.__width]                        *= __thisScale;
        __thisObject[_parameter_.__height]                       *= __thisScale;
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
