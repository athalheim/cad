var _circle_ = {

    __moduleName:             '_circle_',
 

    /* ******************************************************** */
    //  PROPERTIES
    __chooseCircleType: function() {
        _inputSelect_.__selectObjectByType(this.__moduleName, Object.keys(this.__parameterObject), '_circle_._processCircleByType(__inputValue)');
    },
    _processCircleByType: function(__inputValue) {
        var __option                             = __inputValue.replace('circle','');
        _add_.__initialize('circle', __option);
    },

    // Construction options:
    __circleType:             'circle',
    __twoPointsOption:        '2pt',
    __threePointsOption:      '3pt',
    __boxOption:              'Box',

    __ellipseSegmentsCount:   24,

    //  Edit parameters, using arrays to preserve display order
    __parameterObject: {
        circle: {
            __parameterNames: [_parameter_.__origin,             _parameter_.__radius],
            __parameterTypes: [_parameter_.__parameterTypePoint, _parameter_.__parameterTypeNumeric],
        },
        circle2pt: {
            __parameterNames: [_parameter_.__origin,             _parameter_.__secondPoint],
            __parameterTypes: [_parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint],
        },
        circle3pt: {
            __parameterNames: [_parameter_.__origin,             _parameter_.__secondPoint,        _parameter_.__thirdPoint],
            __parameterTypes: [_parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint],
        },
        circleBox:{
            __parameterNames: [_parameter_.__origin,             _parameter_.__oppositeCorner],
            __parameterTypes: [_parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint],
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
            case _parameter_.__secondPoint:
            case _parameter_.__oppositeCorner:
                if (_utils_.__getLengthFromData(__data, __thisObject[_parameter_.__origin]) > 0.0) {
                    __thisObject[_add_.__parameterName] = __data;
                } else {
                    return;
                }
                break;
            case _parameter_.__thirdPoint:
                if (_utils_.__getLengthFromData(__data, __thisObject[_parameter_.__secondPoint]) > 0.0) {
                    __thisObject[_parameter_.__thirdPoint]   = __data;
                } else {
                    return;
                }
                break;
            case _parameter_.__radius:
                var __radius                     = _utils_.__getLengthFromData(__data, __thisObject[_parameter_.__origin]);
                if (__radius > 0.0) {
                    __thisObject[_parameter_.__radius]       = __radius;
                } else {
                    return;
                }
                break;
        }
        return true;
    },


    // 3. Finalize
    __finalize: function(__thisObject) {
        switch (__thisObject[_parameter_.__option]) {
            case this.__twoPointsOption:
                // circle2pt: origin, secondPoint
                __thisObject[_parameter_.__origin]           = _utils_.__getMidPoint(__thisObject[_parameter_.__origin], __thisObject[_parameter_.__secondPoint]);
                __thisObject[_parameter_.__radius]           = _utils_.__getLengthFromData(__thisObject[_parameter_.__origin], __thisObject[_parameter_.__secondPoint]);
                delete __thisObject[_parameter_.__secondPoint];
                break;
            case this.__threePointsOption:
                // circle3pt: origin, secondPoint,  thirdPoint
                __thisObject[_parameter_.__origin]           = _utils_.__getCenterFromThreePoints(__thisObject[_parameter_.__origin], __thisObject[_parameter_.__secondPoint], __thisObject[_parameter_.__thirdPoint]);
                __thisObject[_parameter_.__radius]           = _utils_.__getLengthFromData(__thisObject[_parameter_.__origin], __thisObject[_parameter_.__secondPoint]);
                delete __thisObject[_parameter_.__secondPoint];
                delete __thisObject[_parameter_.__thirdPoint];
                break;
            case this.__boxOption:
                // circleBox:    origin, oppositeCorner
                var __center                     = _utils_.__getMidPoint(__thisObject[_parameter_.__origin], __thisObject[_parameter_.__oppositeCorner]);
                var __area                       = _utils_.__getArea(__thisObject[_parameter_.__origin], __thisObject[_parameter_.__oppositeCorner]);
                __thisObject[_parameter_.__radius]           = Math.min(__area[_parameter_.__width], __area[_parameter_.__height]) * 0.5;
                __thisObject[_parameter_.__origin]           = __center;
                delete __thisObject[_parameter_.__oppositeCorner];
                break;
            default:
                // circleCenter: origin,      radius
                // Nothing to do here.
        }
        delete __thisObject[_parameter_.__option];
        this.__updateAnchorPoints(__thisObject);
    },

    // 4. Set anchor points
    __updateAnchorPoints: function(__thisObject) {
         __thisObject.__anchorPoints             = [
            __thisObject[_parameter_.__origin],
            _utils_.__setDirectionPoint(__thisObject[_parameter_.__origin], (Math.PI * 0.0), __thisObject[_parameter_.__radius]),
            _utils_.__setDirectionPoint(__thisObject[_parameter_.__origin], (Math.PI * 0.5), __thisObject[_parameter_.__radius]),
            _utils_.__setDirectionPoint(__thisObject[_parameter_.__origin], (Math.PI * 1.0), __thisObject[_parameter_.__radius]),
            _utils_.__setDirectionPoint(__thisObject[_parameter_.__origin], (Math.PI * 1.5), __thisObject[_parameter_.__radius]),
        ];
    },

    // 5. Analysis
    __isHitByPointer: function(__thisObject, __currentPoint, __fuzzValue) {
        if (_utils_.__isPointOnAnyAnchor(__thisObject.__anchorPoints, __currentPoint, __fuzzValue)) {
            return true;
        } else {
            return _utils_.__isPointOnCircle(__thisObject, __currentPoint, __fuzzValue);
        }
    },


    /* ********************************************************************** */
    // OBJECT MODIFICATION
    __anchorEdit: function(__thisObject, __thisPointIndex, __currentPoint) {
        if (__thisPointIndex === 0) {
            __thisObject[_parameter_.__origin]               = __currentPoint;
        } else {
            __thisObject[_parameter_.__radius]               = _utils_.__getDistance(__thisObject[_parameter_.__origin], __currentPoint);
        }
        this.__updateAnchorPoints(__thisObject);
    },

    // ARRAY:  managed by array module

    // CHAMFER:: action is not valid.

    // COPY: managed by edit module

    // EXPLODE: action is not valid.

    // FILLET:: action is not valid.

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
    __rotate: function(__thisObject, __thisAnchor, __thisAngle) {
        __thisObject[_parameter_.__origin]                   = _utils_.__rotatePoint(__thisObject[_parameter_.__origin], __thisAnchor, __thisAngle);
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
