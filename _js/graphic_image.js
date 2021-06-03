var _image_ = {

    __moduleName:     '_image_',
    /* ******************************************************** */
    //  PRIVATE PROPERTIES
    __imageType:      'image',
    //  Edit parameters:
    __parameterNames: [_parameter_.__url,                 _parameter_.__origin,             _parameter_.__width,                _parameter_.__height,               _parameter_.__rotation],
    __parameterTypes: [_parameter_.__parameterTypeString, _parameter_.__parameterTypePoint, _parameter_.__parameterTypeNumeric, _parameter_.__parameterTypeNumeric, _parameter_.__parameterTypeNumeric],

    /* ******************************************************** */
    //  PROCEDURES

    // 1. Initialize: Done in _add_ module.

    // 2. Data acquisition
    __addParameterData: function(__thisObject, __data, __url) {
        switch (_add_.__parameterName) {
            case _parameter_.__url:
                __thisObject[_parameter_.__img]                   = __data;
                __thisObject[_parameter_.__url]                   = __url;
                break;
            case _parameter_.__origin:
                __thisObject[_parameter_.__origin] = __data;
                break;
            case _parameter_.__width:
            case _parameter_.__height:
                var __length             = _utils_.__getLengthFromData(__data, __thisObject[_parameter_.__origin]);
                if (__length > 0.0) {
                    __thisObject[_add_.__parameterName]  = __length;
                } else {
                    return;
                }
                break;
            case _parameter_.__rotation:
                if (_utils_.__getDistance(__data, __thisObject[_parameter_.__endPoint]) > 0.0) {
                    __thisObject[_parameter_.__rotation] = _utils_.__getDirectionFromData(__data, __thisObject[_parameter_.__origin]);
                } else {
                    return;
                }
        }
        return true;
    },



    // 3. Finalize
    __finalize: function(__thisObject) {
        // ????? __thisObject[_parameter_.__img]
        this.__updateAnchorPoints(__thisObject);
    },


    // 4. Analysis
    __isHitByPointer: function(__thisObject, __currentPoint, __fuzzValue) {
        return (_utils_.__isPointOnAnyVector(__thisObject.__anchorPoints, __currentPoint, __fuzzValue, true));
    },

    // 5. Update anchor points
    __updateAnchorPoints: function(__thisObject) {
        __thisObject.__anchorPoints = [__thisObject[_parameter_.__origin]];
        //
        var __rightCorner                          = _utils_.__setDirectionPoint(__thisObject[_parameter_.__origin], __thisObject[_parameter_.__rotation],                   __thisObject[_parameter_.__width]);
        var __oppositeCorner                       = _utils_.__setDirectionPoint(__rightCorner,       __thisObject[_parameter_.__rotation] + (Math.PI * 0.5), __thisObject[_parameter_.__height]);
        var __topCorner                            = _utils_.__setDirectionPoint(__thisObject[_parameter_.__origin], __thisObject[_parameter_.__rotation] + (Math.PI * 0.5), __thisObject[_parameter_.__height]);
        __thisObject.__anchorPoints.push(_utils_.__getMidPoint(__thisObject[_parameter_.__origin], __rightCorner));
        __thisObject.__anchorPoints.push(__rightCorner);
        __thisObject.__anchorPoints.push(_utils_.__getMidPoint(__rightCorner, __oppositeCorner));
        __thisObject.__anchorPoints.push(__oppositeCorner);
        __thisObject.__anchorPoints.push(_utils_.__getMidPoint(__oppositeCorner, __topCorner));
        __thisObject.__anchorPoints.push(__topCorner);
        __thisObject.__anchorPoints.push(_utils_.__getMidPoint(__topCorner, __thisObject[_parameter_.__origin]));
    },


    /* ********************************************************************** */
    // OBJECT MODIFICATION
    __anchorEdit: function(__thisObject, __thisPointIndex, __currentPoint) {
        if (__thisPointIndex === 0) {
            this.__editObject[_parameter_.__origin]               = __currentPoint;
        } else {
            // TODO
        }
        this.__updateAnchorPoints(this.__editObject);
    },

    // ARRAY:  managed by array module

    // CHAMFER: action is not valid.

    // COPY: managed by edit module

    // EXPLODE: action is not valid.

    // FILLET: action is not valid.

    // MOVE: Move object
    __move: function(__thisObject, __displacement) {
        __thisObject[_parameter_.__origin] = _utils_.__movePoint(__thisObject[_parameter_.__origin], __displacement);
        this.__updateAnchorPoints(__thisObject);
    },

    // MIRROR: Mirror object from vector
    __mirror: function(__thisObject, __point0, __point1) {
        // TODO
        this.__updateAnchorPoints(__thisObject);
    },

    // OFFSET: action is not valid.

    // ROTATE: Rotate object around origin
    __rotate: function(__thisObject, __thisAnchor, __thisAngle) {
        __thisObject[_parameter_.__origin]    = _utils_.__rotatePoint(__thisObject[_parameter_.__origin], __thisAnchor, __thisAngle);
        __thisObject[_parameter_.__rotation] += __thisAngle;
        this.__updateAnchorPoints(__thisObject);
    },

    // SCALE: Scale object: scales each point in turn.
    __scale: function(__thisObject, __fromPoint, __thisScale) {
        __thisObject[_parameter_.__origin]  = _utils_.__scalePoint(__thisObject[_parameter_.__origin], __fromPoint, __thisScale);
        __thisObject[_parameter_.__width]  *= __thisScale;
        __thisObject[_parameter_.__height] *= __thisScale;
        this.__updateAnchorPoints(__thisObject);
    },

    // STRETCH: Stretch is used to move one of the two points.
    __stretch: function(__thisObject, __area, __directionVector) {
        // TODO
        this.__updateAnchorPoints(__thisObject);
    },

};
