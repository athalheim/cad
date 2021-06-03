var _arc_ = {
    __moduleName:             '_arc_',

    /* ******************************************************** */
    __chooseArcType: function() {
        _inputSelect_.__selectObjectByType(this.__moduleName, Object.keys(this.__parameterObject), '_arc_._processArcByType(__inputValue)');
    },
    _processArcByType: function(__inputValue) {
        var __option                             = __inputValue.replace('arc', '');
        _add_.__initialize('arc', __option);
    },

    // Construction options:
    __arcType:                'arc',
    __threePointsOption:      '3pt',
    __bulgeOption:            'Bulge',

    //  Edit parameters:
    __parameterObject: {
        arc:{
            __parameterNames: [_parameter_.__origin,             _parameter_.__radius,               _parameter_.__startAngle,           _parameter_.__endAngle,             _parameter_.__ccw],
            __parameterTypes: [_parameter_.__parameterTypePoint, _parameter_.__parameterTypeNumeric, _parameter_.__parameterTypeNumeric, _parameter_.__parameterTypeNumeric, _parameter_.__parameterTypeBoolean],
        },
        arc3pt:{
            __parameterNames: [_parameter_.__origin,             _parameter_.__secondPoint,        _parameter_.__thirdPoint],
            __parameterTypes: [_parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint],
        },
        arcBulge:{
            __parameterNames: [_parameter_.__origin,             _parameter_.__endPoint,           _parameter_.__bulgePoint],
            __parameterTypes: [_parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint],
        }
    },


    /* ******************************************************** */
    //  PROCEDURES

    // 1. Initialize: Done in _add_ module.

    // 2. Data acquisition: checking against previous parameters:
    __addParameterData: function(__thisObject, __data) {
        switch (_add_.__parameterName) {
            case _parameter_.__origin:
                __thisObject[_parameter_.__origin]              = __data;
                return true;
            case _parameter_.__endPoint:
            case _parameter_.__secondPoint:
                if (_utils_.__getLengthFromData(__data, __thisObject[_parameter_.__origin]) > 0.0) {
                    __thisObject[_add_.__parameterName]         = __data;
                    return true;
                }
                break;
            case _parameter_.__thirdPoint:
                if ((_utils_.__getLengthFromData(__data, __thisObject[_parameter_.__origin]) > 0.0) && (_utils_.__getLengthFromData(__data, __thisObject[_parameter_.__secondPoint])) > 0.0) {
                    __thisObject[_parameter_.__thirdPoint]      = __data;
                    return true;
                }
                break;
            case _parameter_.__bulgePoint:
                if ((_utils_.__getLengthFromData(__data, __thisObject[_parameter_.__origin]) > 0.0) && (_utils_.__getLengthFromData(__data, __thisObject[_parameter_.__endPoint]) > 0.0)) {
                    __thisObject[_parameter_.__bulgePoint]      = __data;
                    return true;
                }
                break;
            case _parameter_.__radius:
                var __radius                     = _utils_.__getLengthFromData(__data, __thisObject[_parameter_.__origin]);
                if (__radius > 0.0) {
                    __thisObject[_parameter_.__radius]          = __radius;
                    return true;
                }
                break;
            case _parameter_.__startAngle:
                if (_utils_.__hasXproperty(__data)) {
                    if (_utils_.__getDistance(__data, __thisObject[_parameter_.__origin]) > 0.0) {
                        __thisObject[_parameter_.__startAngle]  = _utils_.__getDirectionFromData(__data, __thisObject[_parameter_.__origin]);
                        return true;
                    }
                } else {
                    __thisObject[_parameter_.__startAngle]      = __data;
                    return true;
                }
                break;
            case _parameter_.__endAngle:
                if (_utils_.__hasXproperty(__data)) {
                    if (_utils_.__getDistance(__data, __thisObject[_parameter_.__origin])) {
                        var __endDirection = _utils_.__getDirectionFromData(__data, __thisObject[_parameter_.__origin]);
                        if (__endDirection !== __thisObject[_parameter_.__startAngle]) {
                            __thisObject[_parameter_.__endAngle] = __endDirection;
                            return true;
                        }
                    }
                } else {
                    __thisObject[_parameter_.__endAngle]        = __data;
                    return true;
                }
            case _parameter_.__ccw:
                __thisObject[_parameter_.__ccw]                             = !__data;
                return true;
        }
    },


    // 3. Finalize
    __finalize: function(__thisObject) {
        switch (__thisObject[_parameter_.__option]) {
            case this.__threePointsOption:
                // arc3pt:    origin, secondPoint, thirdPoint
                var __center                     = _utils_.__getCenterFromThreePoints(__thisObject[_parameter_.__origin], __thisObject[_parameter_.__secondPoint], __thisObject[_parameter_.__thirdPoint]);
                __thisObject[_parameter_.__radius]           = _utils_.__getDistance(__center, __thisObject[_parameter_.__origin]);
                __thisObject[_parameter_.__startAngle]       = Math.atan2(__thisObject[_parameter_.__origin].y - __center.y, __thisObject[_parameter_.__origin].x - __center.x);
                __thisObject[_parameter_.__endAngle]         = Math.atan2(__thisObject[_parameter_.__thirdPoint].y - __center.y, __thisObject[_parameter_.__thirdPoint].x - __center.x);
                __thisObject[_parameter_.__ccw]              = _utils_.__isCCW(__thisObject[_parameter_.__origin], __thisObject[_parameter_.__secondPoint], __thisObject[_parameter_.__thirdPoint]);
                __thisObject[_parameter_.__origin]           = __center;
                delete __thisObject[_parameter_.__secondPoint];
                delete __thisObject[_parameter_.__thirdPoint];
                break;
            case this.__bulgeOption:
                // arcBulge:  origin, endPoint, bulgePoint
                var __center                     = _utils_.__getCenterFromThreePoints(__thisObject[_parameter_.__origin], __thisObject[_parameter_.__bulgePoint], __thisObject[_parameter_.__endPoint]);
                __thisObject[_parameter_.__radius]           = _utils_.__getLengthFromData(__center, __thisObject[_parameter_.__origin]);
                __thisObject[_parameter_.__startAngle]       = Math.atan2(__thisObject[_parameter_.__origin].y - __center.y, __thisObject[_parameter_.__origin].x - __center.x);
                __thisObject[_parameter_.__endAngle]         = Math.atan2(__thisObject[_parameter_.__endPoint].y - __center.y, __thisObject[_parameter_.__endPoint].x - __center.x);
                __thisObject[_parameter_.__ccw]              = _utils_.__isCCW(__thisObject[_parameter_.__origin], __thisObject[_parameter_.__bulgePoint], __thisObject[_parameter_.__endPoint]);
                __thisObject[_parameter_.__origin]           = __center;
                delete __thisObject[_parameter_.__endPoint];
                delete __thisObject[_parameter_.__bulgePoint];
                break;
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
        var __endAngle                           = __thisObject[_parameter_.__endAngle];
        if (__thisObject[_parameter_.__endAngle] < __thisObject[_parameter_.__startAngle]) {
            __endAngle                          += (Math.PI * 2.0);
        }                
        var __midDirection                         = (__endAngle + __thisObject[_parameter_.__startAngle]) * 0.5;
        __thisObject.__anchorPoints              = [
            __thisObject[_parameter_.__origin],
            _utils_.__setDirectionPoint(__thisObject[_parameter_.__origin], __thisObject[_parameter_.__startAngle], __thisObject[_parameter_.__radius]),
            _utils_.__setDirectionPoint(__thisObject[_parameter_.__origin], __midDirection,            __thisObject[_parameter_.__radius]),
            _utils_.__setDirectionPoint(__thisObject[_parameter_.__origin], __thisObject[_parameter_.__endAngle],   __thisObject[_parameter_.__radius]),
        ];
    },


    // 5. Analysis
    __isHitByPointer: function(__thisObject, __currentPoint, __fuzzValue) {
        if (_utils_.__isPointOnAnyAnchor(__thisObject.__anchorPoints, __currentPoint, __fuzzValue)) {
            return true;
        } else {
            return _utils_.__isPointOnArc(__thisObject, __currentPoint, __fuzzValue);
        }
    },


    /* ********************************************************************** */
    // OBJECT MODIFICATION
    __anchorEdit: function(__thisObject, __thisPointIndex, __currentPoint) {
        switch (__thisPointIndex) {
            case 0:     __thisObject[_parameter_.__origin]     = __currentPoint;                                                                                        break;
            case 1:     __thisObject[_parameter_.__startAngle] = Math.atan2(__currentPoint.y - __thisObject[_parameter_.__origin].y, __currentPoint.x - __thisObject[_parameter_.__origin].x);  break;
            case 2:     __thisObject[_parameter_.__radius]     = _utils_.__getDistance(__thisObject[_parameter_.__origin], __currentPoint);                                         break;
            case 3:     __thisObject[_parameter_.__endAngle]   = Math.atan2(__currentPoint.y - __thisObject[_parameter_.__origin].y, __currentPoint.x - __thisObject[_parameter_.__origin].x);  break;
            default:
        }
        this.__updateAnchorPoints(__thisObject);
    },

    // ARRAY:  managed by array module

    // CHAMFER:
    __chamfer: function(__thisObject, __point0, __point1) {
        // TODO
        this.__updateAnchorPoints(__thisObject);
    },

    // COPY: managed by edit module

    // EXPLODE: action is not valid.

    // FILLET:
    __fillet: function(__thisObject, __point0, __point1) {
        // TODO
        this.__updateAnchorPoints(__thisObject);
    },

    // MOVE: Move object
    __move: function(__thisObject, __displacement) {
        __thisObject[_parameter_.__origin]                    = _utils_.__movePoint(__thisObject[_parameter_.__origin], __displacement);
        this.__updateAnchorPoints(__thisObject);
    },

    // MIRROR: Mirror object from vector
    __mirror: function(__thisObject, __point0, __point1) {
        // TODO
        this.__updateAnchorPoints(__thisObject);
    },

    // OFFSET:
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
        __thisObject[_parameter_.__origin]                   = _utils_.__rotatePoint(__thisObject[_parameter_.__origin], __thisAnchor, __thisRotation);
        __thisObject[_parameter_.__startAngle]              += __thisRotation;
        __thisObject[_parameter_.__endAngle]                += __thisRotation;
        this.__updateAnchorPoints(__thisObject);
    },

    // SCALE: Scale object: scales each point in turn.
    __scale: function(__thisObject, __fromPoint, __thisScale) {
        __thisObject[_parameter_.__origin]                   = _utils_.__scalePoint(__thisObject[_parameter_.__origin], __fromPoint, __thisScale);
        __thisObject[_parameter_.__radius]                  *= __thisScale;
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
