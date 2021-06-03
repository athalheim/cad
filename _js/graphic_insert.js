var _insert_ = {

    __moduleName:     '_insert_',
    // Block
    // Reference (external block)

    /* ******************************************************** */
    //  PROPERTIES
    __insertType:     'insert',
    __referenceType:  'reference',
    
    //  Edit parameters:
    __parameterObject: {
        insert: {
            __parameterNames: [_parameter_.__name,                _parameter_.__origin,             _parameter_.__xScale,               _parameter_.__yScale,              _parameter_.__rotation],
            __parameterTypes: ['_model_[_parameter_.__blocks]'  , _parameter_.__parameterTypePoint, _parameter_.__parameterTypeNumeric, _parameter_.__parameterTypeNumeric, _parameter_.__parameterTypeNumeric],
        },
        reference: {
            __parameterNames: [_parameter_.__parameterName,             _parameter_.__origin,             _parameter_.__xScale,               _parameter_.__yScale,               _parameter_.__rotation],
            __parameterTypes: ['_insert_.__loadReferenceFollow(data);', _parameter_.__parameterTypePoint, _parameter_.__parameterTypeNumeric, _parameter_.__parameterTypeNumeric, _parameter_.__parameterTypeNumeric],
        },
    },


    /* ******************************************************** */
    //  PROCEDURES

    // 1. Initialize: Done in _add_ module.

    // 2. Data acquisition
    __addParameterData: function(__thisObject, __data) {
        switch (_add_.__parameterName) {
            case _parameter_.__name:
                __thisObject[_parameter_.__name] = __data;
                break;
            case _parameter_.__origin:
                __thisObject[_parameter_.__origin] = __data;
                break;
            case _parameter_.__xScale:
            case _parameter_.__yScale:
                var __scale             = _utils_.__getLengthFromData(__data, __thisObject[_parameter_.__origin]);
                if (__scale > 0.0) {
                    __thisObject[_add_.__parameterName]  = __scale;
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
        this.__updateAnchorPoints(__thisObject);
    },    
    __updateAnchorPoints: function(__thisObject) {
        __thisObject.__anchorPoints = [__thisObject[_parameter_.__origin]];
    },


    // 4. Analysis
    __isHitByPointer: function(__thisObject, __currentPoint, __fuzzValue) {
        // TODO
    },


    // 5. Update anchor points



    /* ********************************************************************** */
    // OBJECT CONSTRUCTION


    __loadReferenceSetup: function() {
        _inputSingle_.__setCadSingleInput('_insert_.__loadReferenceFollow(__cadFilename, __filedata);');
    },

    __loadReferenceFollow: function(__blockName, __data) {
        var __thisBlock                          = _modelTools_.__buildBlock();
        //var __importedModel                        = JSON.parse(__data);
        _modelTools_.__addBlock(__blockName, __thisBlock);
        _add_.__initialize(_block_.__moduleName, __blockName);
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

    __explode: function(__thisObject) {
        // TODO
    },

    // FILLET: action is not valid.

    // MOVE: Move object
    __move: function(__thisObject, __displacement) {
        __thisObject[_parameter_.__origin]                        = _utils_.__movePoint(__thisObject[_parameter_.__origin], __displacement);
        this.__updateAnchorPoints(__thisObject);
    },

    // MIRROR: Mirror object from vector
    __mirror: function(__thisObject, __point0, __point1) {
        // TODO
        this.__updateAnchorPoints(__thisObject);
    },
    
    // OFFSET: action is not valid.

    // ROTATE: Rotate object around origin
    __rotate: function(__thisObject, __thisAnchor, __thisRotation) {
        __thisObject[_parameter_.__origin]                        = _utils_.__rotatePoint(__thisObject[_parameter_.__origin], __thisAnchor, __thisRotation);
        __thisObject[_parameter_.__rotation]                      += __thisRotation;
        this.__updateAnchorPoints(__thisObject);
    },

    // SCALE: Scale object: scales each point in turn.
    __scale: function(__thisObject, __currentPoint, __thisScale) {
        __thisObject[_parameter_.__origin]                        = _utils_.__scalePoint(__thisObject[_parameter_.__origin], __currentPoint, __thisScale);
        __thisObject[_parameter_.__width]                        *= __thisScale;
        __thisObject[_parameter_.__height]                       *= __thisScale;
        this.__updateAnchorPoints(__thisObject);
    },

    // STRETCH: Does not apply to this object

};
