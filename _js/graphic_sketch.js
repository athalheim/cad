var _sketch_ = {

    __moduleName:                         '_sketch_',
    __invalidEntry:                       'invalidEntry',
    /* ******************************************************** */
    //  PROPERTIES
    //  Edit parameters:

    __sketchType:                         'sketch',
    __parameterNames: [_parameter_.__origin,             _parameter_.__nextPoint],
    __parameterTypes: [_parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint],


    /* ******************************************************** */
    // SKETCH-SPECIFIC
    //  Properties
    __sketchSegmentProp:                  0.01,
    __sketchSegmentLength:                1,

    //  Procedures
    __initializeSettingSketchUnitLength: function() {
        _inputSingle_.__setPropertyValueInput(_messages_.__getMessage('sketchUnitLength'), this.__sketchSegmentProp, '_sketch_.__setSketchLengthProportion(__inputValue)');
    },
    __setSketchLengthProportion: function(__proportion) {
        try {
            this.__sketchSegmentProp  = parseFloat(__proportion);
            this.__setSketchUnitLength();
        } catch(ex) {
            _events_.__callError(this.__moduleName, ex.message);
        }
    },
    __setSketchUnitLength: function() {
        this.__sketchSegmentLength  = _utils_.__roundValue(_model_[_parameter_.__limits][_parameter_.__width] * this.__sketchSegmentProp);
    },

    /* ******************************************************** */
    //  PROCEDURES
    // 1. Initialize: Done in _add_ module.
    //  This procedure manages sketch exceptions to the general rule
    __initialize: function() {
        this.__setSketchUnitLength();
    },

    // 2. Data acquisition: either a (picked) point or an input entry: validated point, selected option, side count or a string
    __addParameterData: function(__thisObject, __data) {
        if (_utils_.__hasXproperty(__data)) {
            if (_utils_.__ownsProperty(__thisObject, _parameter_.__origin)) {
                var __previousPoint              = this.__getPreviousPoint(__thisObject);
                if (_utils_.__getDistance(__previousPoint, __data) >= this.__sketchSegmentLength) {
                    __thisObject[_parameter_.__points].push(__data);
                    return true;
                }
            } else {
                __thisObject[_parameter_.__origin]           = __data;
                __thisObject[_parameter_.__points]           = [];
                return true;
            }
        } else {
            _events_.__callError(this.__moduleName, _messages_.__getMessage(this.__invalidEntry));
        }
    },

    // 3. Finalize
    __finalize: function(__thisObject, __currentPoint) {
        // Close to origin?
        if (_utils_.__getDistance(__thisObject[_parameter_.__origin], __currentPoint) <= this.__sketchSegmentLength) {
            __thisObject[_parameter_.__points].push(__thisObject[_parameter_.__origin]);
        } else {
            // Long-enough distance for a last point?
            var __previousPoint                  = this.__getPreviousPoint(__thisObject);
            if (_utils_.__getDistance(__previousPoint, __currentPoint) >= this.__sketchSegmentLength) {
                __thisObject[_parameter_.__points].push(__currentPoint);
            }
        }
        this.__updateAnchorPoints(__thisObject);
    },

    // 4. Analysis
    __isHitByPointer: function(__thisObject, __currentPoint, __fuzzValue) {
        return (_utils_.__isPointOnAnyVector(__thisObject.__anchorPoints, __currentPoint, __fuzzValue));
    },

    // 5. Update anchor points
    __updateAnchorPoints: function(__thisObject) {
        __thisObject.__anchorPoints              = JSON.parse(JSON.stringify(__thisObject[_parameter_.__points]));
        __thisObject.__anchorPoints.unshift(__thisObject[_parameter_.__origin]);
    },

    __getPreviousPoint: function(__thisObject) {
        var __previousPoint                      = __thisObject[_parameter_.__origin];
        if (__thisObject[_parameter_.__points]) {
            if (__thisObject[_parameter_.__points].length > 0) {
                var __previousIndex              = (__thisObject[_parameter_.__points].length - 1);
                __previousPoint                  = __thisObject[_parameter_.__points][__previousIndex];
            }
        }
        return __previousPoint;
    },

    /* ********************************************************************** */
    // OBJECT MODIFICATION
    __anchorEdit: function(__thisObject, __thisPointIndex, __currentPoint) {
        if (__thisPointIndex === 0) {
            // Object origin:
            __thisObject[_parameter_.__origin]               = __currentPoint;
        } else {
            // Sketch object: only endpoints are valid as anchor points
            __thisObject[_parameter_.__points][(__thisPointIndex - 1)]           = __currentPoint;
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
        var __polylinePoints                 = null;
        __polylinePoints                           = JSON.parse(JSON.stringify(__thisObject[_parameter_.__points]));
        __polylinePoints.unshift(__thisObject[_parameter_.__origin]);
        var __newObjectsData                   = [];
        for (var __pointIndex = 0; __pointIndex <= __polylinePoints.length - 2; __pointIndex += 1) {
            __newObjectsData.push({type:this.__lineType, origin:__polylinePoints[__pointIndex], points:[__polylinePoints[__pointIndex + 1]]});
        }
        return __newObjectsData;
},

    // MIRROR: Mirror object from vector
    __mirror: function(__thisObject, __point0, __point1) {
        __thisObject[_parameter_.__origin]                        = _utils_.__mirrorPoint(__point0, __point1, __thisObject[_parameter_.__origin]);
        for (var __pointIndex = 0; __pointIndex < __thisObject[_parameter_.__points].length; __pointIndex += 1) {
            __thisObject[_parameter_.__points][__pointIndex]        = _utils_.__mirrorPoint(__point0, __point1, __thisObject[_parameter_.__points][__pointIndex]);
        }
        this.__updateAnchorPoints(__thisObject);
    },

    // MOVE: Move object
    __move: function(__thisObject, __displacement) {
        __thisObject[_parameter_.__origin]                   = _utils_.__movePoint(__thisObject[_parameter_.__origin], __displacement);
        for (var __pointIndex = 0; __pointIndex < __thisObject[_parameter_.__points].length; __pointIndex += 1) {
            __thisObject[_parameter_.__points][__pointIndex] = _utils_.__movePoint(__thisObject[_parameter_.__points][__pointIndex], __displacement);
        }
        this.__updateAnchorPoints(__thisObject);
    },

    // OFFSET: action is not valid

    
    // ROTATE: Rotate object around origin
    __rotate: function(__thisObject, __thisAnchorPoint, __thisAngle) {
        __thisObject[_parameter_.__origin]                        = _utils_.__rotatePoint(__thisObject[_parameter_.__origin], __thisAnchorPoint, __thisAngle);
        for (var __pointIndex = 0; __pointIndex < __thisObject[_parameter_.__points].length; __pointIndex += 1) {
            __thisObject[_parameter_.__points][__pointIndex]        = _utils_.__rotatePoint(__thisObject[_parameter_.__points][__pointIndex], __thisAnchorPoint, __thisAngle);
        }
        this.__updateAnchorPoints(__thisObject);
    },

    // SCALE: Scale object: scales each point in turn.
    __scale: function(__thisObject, __fromPoint, __thisScale) {
        __thisObject[_parameter_.__origin]                        = _utils_.__scalePoint(__thisObject[_parameter_.__origin], __fromPoint, __thisScale);
        for (var __pointIndex = 0; __pointIndex < __thisObject[_parameter_.__points].length; __pointIndex += 1) {
            __thisObject[_parameter_.__points][__pointIndex]        = _utils_.__scalePoint(__thisObject[_parameter_.__points][__pointIndex], __fromPoint, __thisScale);
        }
        this.__updateAnchorPoints(__thisObject);
    },

    // STRETCH
    __stretch: function(__thisObject, __area, __directionVector) {
        // Scan each point: stretch by displacement when within area
        if (_utils_.__isPointInRectangle(__area, __thisObject[_parameter_.__origin])) {
            __thisObject[_parameter_.__origin]               = _utils_.__addDelta(__thisObject[_parameter_.__origin], __directionVector.x, __directionVector.y);
        }
        for (var __pointIndex = 0; __pointIndex < __thisObject[_parameter_.__points].length; __pointIndex += 1) {
            if (_utils_.__isPointInRectangle(__area, __thisObject[_parameter_.__endPoint])) {
                __thisObject[_parameter_.__points][__pointIndex]        = _utils_.__addDelta(__thisObject[_parameter_.__points][__pointIndex], __directionVector.x, __directionVector.y);
            }
        }
        this.__updateAnchorPoints(__thisObject);
    },

    // Trim: Stretch is used to move one of the two points.
    __trim: function(__thisObject, __firstPoint, __secondPoint, __sidePoint) {
        // TODO
        this.__updateAnchorPoints(__thisObject);
    },
};
