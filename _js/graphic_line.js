var _line_ = {

    __moduleName:                         '_line_',
    __invalidEntry:                       'invalidEntry',

    /* ******************************************************** */
    //  PROPERTIES
    //  Edit parameters:
    __lineType:           'line',
    __parameterNames:     [_parameter_.__origin,             _parameter_.__endPoint],
    __parameterTypes:     [_parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint],


    /* ******************************************************** */
    //  PROCEDURES
    // 1. Initialize: Done in _add_ module.

    // 2. Data acquisition: either a (picked) point or an input entry: validated point, selected option, side count or a string
    __addParameterData: function(__thisObject, __data) {
        if (_utils_.__hasXproperty(__data)) {
            __thisObject[_add_.__parameterName] = __data;
            return true;
        } else {
            _events_.__callError(this.__moduleName, _messages_.__getMessage(this.__invalidEntry));
        }
    },

    // 3. Finalize
    __finalize: function(__thisObject, __currentPoint) {
        __thisObject[_parameter_.__points]                   = [__thisObject[_parameter_.__endPoint]];
        delete __thisObject[_parameter_.__endPoint];
        this.__updateAnchorPoints(__thisObject);
    },

    // 4. Analysis
    __isHitByPointer: function(__thisObject, __currentPoint, __fuzzValue) {
        if (_utils_.__getPointOnVector(__thisObject[_parameter_.__origin], __thisObject[_parameter_.__points][0], __currentPoint, __fuzzValue)) {
            return true;
        }
    },

    // 5. Update anchor points
    __updateAnchorPoints: function(__thisObject) {
        var __xIndex                             = 0;
        var __yIndex                             = 0;
        __thisObject.__anchorPoints              = [];
        //TODO: arrayPolar
        var __arrayColumns                            = __thisObject[_parameter_.__arrayColumns]?  __thisObject[_parameter_.__arrayColumns]:  1;
        var __arrayRows                               = __thisObject[_parameter_.__arrayRows]?     __thisObject[_parameter_.__arrayRows]:     1;
        var __arrayColumnWidth                        = __thisObject[_parameter_.__arrayColumnWidth]? __thisObject[_parameter_.__arrayColumnWidth]: 0.0;
        var __arrayRowHeight                          = __thisObject[_parameter_.__arrayRowHeight]?__thisObject[_parameter_.__arrayRowHeight]:0.0;
        var __arrayRotation                           = __thisObject[_parameter_.__arrayRotation]?(__thisObject[_parameter_.__arrayRotation] * Math.PI / 180.0):0.0;
        for (var __xIndex = 0; __xIndex < __arrayColumns; __xIndex += 1) {
            var __deltaX                         = (__xIndex * __arrayColumnWidth);
            for (var __yIndex = 0; __yIndex < __arrayRows; __yIndex += 1) {
                var __deltaY                     = (__yIndex * __arrayRowHeight);
                // Apply rotation
                var __distanceToDelta      = Math.sqrt((__deltaX * __deltaX) + (__deltaY * __deltaY));
                var __directionToDelta     = Math.atan2(__deltaY, __deltaX);
                var __newDeltaPoint        = _utils_.__setDirectionPoint({x:0, y:0}, __directionToDelta + __arrayRotation, __distanceToDelta);
                // Set points
                var __origin                     = _utils_.__addDelta(__thisObject[_parameter_.__origin], __newDeltaPoint.x, __newDeltaPoint.y);
                var __point0                     = _utils_.__addDelta(__thisObject[_parameter_.__points][0], __newDeltaPoint.x, __newDeltaPoint.y);
                var __midPoint                   = _utils_.__getMidPoint(__origin, __point0);
                // Push points
                __thisObject.__anchorPoints.push(__origin);
                __thisObject.__anchorPoints.push(__midPoint);
                __thisObject.__anchorPoints.push(__point0);
            }
        }
    },


    /* ********************************************************************** */
    // OBJECT MODIFICATION
    __anchorEdit: function(__thisObject, __thisPointIndex, __currentPoint) {
        switch(__thisPointIndex) {
            case 0:
                __thisObject[_parameter_.__origin]           = __currentPoint;
                break;
            case 1:
                var __deltaX                     = (__currentPoint.x - __thisObject.__anchorPoints[1].x);
                var __deltaY                     = (__currentPoint.y - __thisObject.__anchorPoints[1].y);
                __thisObject[_parameter_.__origin]           =  _utils_.__addDelta(__thisObject[_parameter_.__origin],    __deltaX, __deltaY);
                __thisObject[_parameter_.__points][0]        =  _utils_.__addDelta(__thisObject[_parameter_.__points][0], __deltaX, __deltaY);
                break;
            case 2:
                __thisObject[_parameter_.__points][0]        = __currentPoint;
                break;
            default:
                // Implicit array: Not valid yet
                _events_.__callError(this.__moduleName, _messages_.__getMessage('anchorEditNotAuthorized'));
                return;
        }
        this.__updateAnchorPoints(__thisObject);
    },

    // ARRAY:  managed by array module

    // CHAMFER:
    __chamfer: function(__thisObject, __point0, __point1) {

    },

    // COPY: managed by edit module

    // EXPLODE: action is not valid.

    // EXTEND:
    __extend: function(__thisObject, __point0, __point1) {
        var __extendIntersection                 = _utils_.__getIntersectionPoint(__point0, __point1, __thisObject[_parameter_.__origin], __thisObject[_parameter_.__points][0]);
        if (__extendIntersection[_parameter_.__onSecond]) {
            var __distanceToOrigin               = _utils_.__getDistance(__thisObject[_parameter_.__origin],    __extendIntersection);
            var __distanceToEndPoint             = _utils_.__getDistance(__thisObject[_parameter_.__points][0], __extendIntersection);
            if (__distanceToOrigin < __distanceToEndPoint) {
                __thisObject[_parameter_.__origin]           = __extendIntersection;
            } else {
                __thisObject[_parameter_.__points][0]        = __extendIntersection;
            }
            this.__updateAnchorPoints(__thisObject);
        }
    },

    // FILLET:
   __fillet: function(__thisObject, __point0, __point1) {

    },

    // MIRROR: Mirror object from vector
    __mirror: function(__thisObject, __point0, __point1) {
        __thisObject[_parameter_.__origin]                   = _utils_.__mirrorPoint(__point0, __point1, __thisObject[_parameter_.__origin]);
        __thisObject[_parameter_.__points][0]                = _utils_.__mirrorPoint(__point0, __point1, __thisObject[_parameter_.__points][0]);
        this.__updateAnchorPoints(__thisObject);
    },
    
    // MOVE: Move object
    __move: function(__thisObject, __displacement) {
        __thisObject[_parameter_.__origin]                   = _utils_.__movePoint(__thisObject[_parameter_.__origin], __displacement);
        __thisObject[_parameter_.__points][0]                = _utils_.__movePoint(__thisObject[_parameter_.__points][0], __displacement);
        this.__updateAnchorPoints(__thisObject);
    },

    // OFFSET:
    // CHECKED
    __offset: function(__thisObject, __currentPoint, __offset) {
        var __newObject                          = $.extend(true, {}, __thisObject);
        _modelTools_.__addObject(__newObject);
        if (__offset) {
            var __lineDirection                      = Math.atan2((__thisObject[_parameter_.__points][0].y - __thisObject[_parameter_.__origin].y), (__thisObject[_parameter_.__points][0].x - __thisObject[_parameter_.__origin].x));
            var __sideDirection                      = __lineDirection;
            if (_utils_.__getWhichSide(__thisObject[_parameter_.__origin], __thisObject[_parameter_.__points][0], __currentPoint) > 0.0) {
                __sideDirection                     -=  (Math.PI * 0.5);
            } else {
                __sideDirection                     += (Math.PI * 0.5);
            }
            __newObject[_parameter_.__origin]        = _utils_.__setDirectionPoint(__newObject[_parameter_.__origin],    __sideDirection, __offset);
            __newObject[_parameter_.__points][0]     = _utils_.__setDirectionPoint(__newObject[_parameter_.__points][0], __sideDirection, __offset);
        } else {
            var __perpendicular                      = _utils_.__getPointPerpendicularToVector(__thisObject[_parameter_.__origin], __thisObject[_parameter_.__points][0], __currentPoint);
            var __deltaX                             = (__currentPoint.x - __perpendicular.x);
            var __deltaY                             = (__currentPoint.y - __perpendicular.y);
            __newObject[_parameter_.__origin]                    = _utils_.__addDelta(__newObject[_parameter_.__origin]   , __deltaX, __deltaY);
            __newObject[_parameter_.__points][0]                 = _utils_.__addDelta(__newObject[_parameter_.__points][0], __deltaX, __deltaY);
        }
        this.__updateAnchorPoints(__newObject);
    },
    
    // ROTATE: Rotate object around origin
    __rotate: function(__thisObject, __thisAnchorPoint, __thisAngle) {
        __thisObject[_parameter_.__origin]                   = _utils_.__rotatePoint(__thisObject[_parameter_.__origin], __thisAnchorPoint, __thisAngle);
        __thisObject[_parameter_.__points][0]                = _utils_.__rotatePoint(__thisObject[_parameter_.__points][0], __thisAnchorPoint, __thisAngle);
        this.__updateAnchorPoints(__thisObject);
    },

    // SCALE: Scale object: scales each point in turn.
    __scale: function(__thisObject, __fromPoint, __thisScale) {
        __thisObject[_parameter_.__origin]                   = _utils_.__scalePoint(__thisObject[_parameter_.__origin], __fromPoint, __thisScale);
        __thisObject[_parameter_.__points][0]                = _utils_.__scalePoint(__thisObject[_parameter_.__points][0], __fromPoint, __thisScale);
        this.__updateAnchorPoints(__thisObject);
    },

    // STRETCH: stretch by displacement when within area
    __stretch: function(__thisObject, __area, __directionVector) {
        if (_utils_.__isPointInRectangle(__area, __thisObject[_parameter_.__origin])) {
            __thisObject[_parameter_.__origin]               = _utils_.__addDelta(__thisObject[_parameter_.__origin], __directionVector.x, __directionVector.y);
        }
        if (_utils_.__isPointInRectangle(__area, __thisObject[_parameter_.__points][0])) {
            __thisObject[_parameter_.__points][0]            = _utils_.__addDelta(__thisObject[_parameter_.__points][0], __directionVector.x, __directionVector.y);
        }
        this.__updateAnchorPoints(__thisObject);
    },

    // TRIM: Stretch is used to move one of the two points.
    __trim: function(__thisObject, __firstPoint, __secondPoint, __sidePoint) {
        var __intersection                       = _utils_.__getIntersectionPoint(__firstPoint, __secondPoint, __thisObject[_parameter_.__origin], __thisObject[_parameter_.__points][0]);
        if ((__thisObject[_parameter_.__origin].x === __intersection.x) && (__thisObject[_parameter_.__origin].y === __intersection.yx)) {
            alert('Origin is at trim line');
            return;
        } else if ((__thisObject[_parameter_.__points][0].x === __intersection.x) && (__thisObject[_parameter_.__points][0].y === __intersection.yx)) {
            alert('End point is at trim line');
            return;
        }
        var __whichSide                          = Math.sign(_utils_.__getWhichSide(__firstPoint, __secondPoint, __sidePoint));
        if (Math.sign(_utils_.__getWhichSide(__firstPoint, __secondPoint, __thisObject[_parameter_.__origin])) ===  __whichSide) {
            __thisObject[_parameter_.__origin]               = __intersection;
        } else {
            __thisObject[_parameter_.__points][0]            = __intersection;
        }
        this.__updateAnchorPoints(__thisObject);
    },
};
