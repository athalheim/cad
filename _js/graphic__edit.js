var _edit_ = {

    __moduleName:            '_edit_',
    __editData:              null,

    __parameterNames:        null,
    __parameterTypes:        null,

    __parameterIndex:        null,
    __parameterName:         null,
    __parameterType:         null,


    /* ********************************************************************* */

    __isEditSelection: function() {
        if (!_selection_.__selectionSet) {
            _selection_.__selectAnchorObjects();
        }
        return (_selection_.__selectionSet !== null);
    },
    __initializeEditMode: function(__mode, __parameterNames, __parameterTypes, __callback) {
        this.__editData                          = {};
        this.__parameterNames                    = __parameterNames;
        this.__parameterTypes                    = __parameterTypes;
        this.__parameterIndex                    = 0;
        this.__parameterName                     = this.__parameterNames[this.__parameterIndex];
        this.__parameterType                     = this.__parameterTypes[this.__parameterIndex];
        _inputSingle_.__initializeInput(this.__moduleName, null, this.__parameterName, this.__parameterType,);
        _inputSingle_.__callback                 = __callback;
    },
    __setNextEditParameter: function() {
        if (this.__parameterIndex < (this.__parameterNames.length - 1)) {
            this.__parameterIndex                   += 1;
            this.__parameterName                     = this.__parameterNames[this.__parameterIndex];
            this.__parameterType                     = this.__parameterTypes[this.__parameterIndex];
            _inputSingle_.__setParameterInput(this.__parameterName, this.__parameterType);
        }
    },
    __isActionValidForObject: function(__thisObject, __actionName) {
        var __objectConstructor                  = _utils_.__getObjectConstructor(__thisObject[_parameter_.__type]);
        return _utils_.__ownsProperty(__objectConstructor, __actionName);
    },


    /* ********************************************************************* */
    // BREAK OBJECTS (1 object, 2 parameters)
    // TODO
    __initializeBreak: function() {
        if (this.__isEditSelection()) {
            
            _view_.__setTouchEventsFunctionString(
                '_edit_.__setBreakPoint(_view_.__touchStartLocation);',
                '_track_.__trackEntry(_edit_.__moduleName, _view_.__modelLocation);',
                '_edit_.__setBreakPoint(_view_.__modelLocation, _view_.__fuzzValue);',
                '_edit_.__cancelEditMode();'
            );
            this.__initializeEditMode('break', 
                                      [_parameter_.__fromPoint,          _parameter_.__toPoint],
                                      [_parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint],
                                      '_edit_.__setBreakPoint(__inputValue, _view_.__fuzzValue);'
                                     );
            }
    },
    __setBreakPoint: function(__currentPoint, __fuzzValue) {
        if (this.__parameterName === _parameter_.__fromPoint) {
            this.__editData[this.__parameterName]  = __currentPoint;
            this.__setNextEditParameter();
        } else if (_utils_.__getDistance(this.__editData[_parameter_.__fromPoint], __currentPoint) > __fuzzValue) {
            this.__editData[this.__parameterName]  = __currentPoint;
            this.__finalizeBreak();
        }
    },
    __finalizeBreak: function() {
        // TODO
        // Get perpendicular to first point
        // Get perpendicular to second point
        // Create two objects from 
        this.__cancelEditMode();
    },




    /* ********************************************************************* */
    // Manually selected objects:
    // CHAMFER OBJECTS (2 objects, 2 parameters)
    //   Line to Line
    //   Line To Arc
    //   Polyline / Polygon
    __initializeChamfer: function() {
        if (this.__isEditSelection()) {
            _view_.__setTouchEventsFunctionString(
                '_edit_.__setChamferParameters(_view_.__touchStartLocation);',
                '_track_.__trackEntry(_edit_.__moduleName, _view_.__modelLocation);',
                '_edit_.__setChamferParameters(_view_.__modelLocation, _view_.__fuzzValue);',
                '_edit_.__cancelEditMode();'
            );
            this.__initializeEditMode('chamfer', 
                                    [_parameter_.__firstObject,        _parameter_.__secondObject,       _parameter_.__firstLength,          _parameter_.__secondLength],
                                    [_parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint, _parameter_.__parameterTypeNumeric, _parameter_.__parameterTypeNumeric],
                                    '_edit_.__setChamferParameters(__inputValue, _view_.__fuzzValue, true);'
                                    );
            }
    },
    __setChamferParameters: function(__data, _fuzzValue, isFromInput) {
        switch (this.__parameterName) {
            case _parameter_.__firstObject:
                this.__validateChamferFilletObject(this.__parameterName, _parameter_.__chamfer);
                break;
            case _parameter_.__secondObject:
                this.__validateChamferFilletObject(this.__parameterName, _parameter_.__chamfer);
                this.__setChamferFilletIntersection();
                break;
            default:
                if (isFromInput) {
                    if (isNaN(__data)) {
                        _events_.__callError(this.__moduleName, _messages_.__getMessage('__invalidEntry'));
                    } else {
                        this.__editData[this.__parameterName] = __data;
                        if (this.__parameterName === _parameter_.__secondLength) {
                            this.__finalizeChamfer();
                        } else {
                            this.__setNextEditParameter();
                        }
                    }
                } else {
                    // Check distance to intersection ('origin')
                }
        }

    },
    __finalizeChamfer: function() {
        this.__cancelEditMode();
    },

    // FILLET OBJECTS (2 objects, 2 parameters)
    //   Line to Line
    //   Line To Arc
    //   Polyline / Polygon
    __initializeFillet: function() {
        _view_.__setTouchEventsFunctionString(
            '_edit_.__setFilletParameters(_view_.__touchStartLocation);',
            '_track_.__trackEntry(_edit_.__moduleName, _view_.__modelLocation);',
            '_edit_.__setFilletParameters(_view_.__modelLocation, _view_.__fuzzValue);',
            '_edit_.__cancelEditMode();'
        );
        _selection_.__clearSelection();
        this.__editData                          = {};
        this.__parameterNames                    = [_parameter_.__firstObject,        _parameter_.__secondObject,       _parameter_.__radius];
        this.__parameterTypes                    = [_parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint, _parameter_.__parameterTypeNumeric];
        this.__parameterIndex                    = -1;
        this.__setNextEditParameter();
    },
    __setFilletParameters: function(__data) {
        if (this.__parameterType  === _parameter_.__parameterTypePoint) {
            if (_anchor_.__anchorIds) {
                var __thisId                     = _anchor_.__anchorIds[0];
                var __anchorObject               = _modelTools_.__getObjectById(__thisId);
                if (this.__isActionValidForObject(__thisObject, '__fillet')) {
                    if (!_utils_.__ownsProperty(this.__editData, _parameter_.__firstObject)) {
                        this.__editData[_parameter_.__firstObject] = __anchorObject;
                        _selection_.__addToSelectionSet(__thisId, __anchorObject);
                        this.__setNextEditParameter();
                    } else {
                        this.__editData[_parameter_.__secondObject] = __anchorObject;
                        _selection_.__addToSelectionSet(__thisId, __anchorObject);
                        this.__editData[_parameter_.__intersectionPoint] = _utils_.__getChamferOfFilletIntersection();
                        this.__setNextEditParameter();
                    }
                }
            }
        } else {
            if (isNaN(__data)) {
                _events_.__callError(this.__moduleName, _messages_.__getMessage(this.__invalidEntry));
            } else {

            }
            // Numeric
            var __length                                      = __data;
            if (_utils_.__hasXproperty(__data)) {
                __length                                      = _utils_.__getDistance(this.__editData[_parameter_.__intersectionPoint], __data);
            }
            if (!_utils_.__ownsProperty(this.__editData, _parameter_.__firstLength)) {
                this.__editData[_parameter_.__firstLength]  = __length;
                this.__setNextEditParameter();
            } else {
                this.__editData[_parameter_.__secondLength] = __length;
                this.__finalizeFillet();
            }
        }
    },
    __finalizeFillet: function() {
        // TODO
        this.__cancelEditMode();
    },

    __validateChamferFilletObject: function(__parameterName, __command) {
        if (_anchor_.__anchorIds.length === 1) {
            var __thisId                         = _anchor_.__anchorIds[0];
            var __thisObject                     = _modelTools_.__getObjectById(__thisId);
            if (_edit_.__isActionValidForObject(__thisObject, __command)) {
                this.__editData[__parameterName] = __thisId;
                this.__setNextEditParameter();
            }
        } else {
            _events_.__callError(this.__moduleName, _messages_.__getMessage('tooManyObjects'));
        }
    },
    __setChamferFilletIntersection: function() {

    },




    /* ********************************************************************* */
    // COPY OBJECTS multiple objects, 1 (copy vector) or 2 (points) parameters
    __initializeCopy: function() {
        if (this.__isEditSelection()) {
            _view_.__setTouchEventsFunctionString(
                '_edit_.__setCopyPoint(_view_.__touchStartLocation, _view_.__fuzzValue);',
                '_track_.__trackEntry(_edit_.__moduleName, _view_.__modelLocation);',
                '_edit_.__setCopyPoint(_view_.__modelLocation, _view_.__fuzzValue);',
                '_edit_.__cancelEditMode();'
            );
            this.__initializeEditMode('copy', 
                                    [_parameter_.__fromPoint,          _parameter_.__toPoint],
                                    [_parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint],
                                    '_edit_.__setCopyPoint(__inputValue, _view_.__fuzzValue, true);'
                                    );
            }
    },
    __setCopyPoint: function(__currentPoint, __fuzzValue, isFromInput) {
        if (isFromInput) {
            if (_utils_.__hasXproperty(__currentPoint)) {
                if (this.__parameterName === _parameter_.__fromPoint) {
                    this.__finalizeCopy(__currentPoint);
                } else {
                    var __copyVector                     = {
                        x: (__currentPoint.x - this.__editData[_parameter_.__fromPoint].x),
                        y: (__currentPoint.y - this.__editData[_parameter_.__fromPoint].y),
                    };
                    this.__finalizeCopy(__copyVector);
                }
            } else {
                _events_.__callError(this.__moduleName, _messages_.__getMessage(this.__invalidEntry));
            }
        } else if (this.__parameterName === _parameter_.__fromPoint) {
            this.__editData[_parameter_.__fromPoint]  = __currentPoint;
            this.__setNextEditParameter(__currentPoint);
        } else if (_utils_.__getDistance(this.__editData[_parameter_.__fromPoint], __currentPoint) > __fuzzValue) {
            var __copyVector                     = {
                x: (__currentPoint.x - this.__editData[_parameter_.__fromPoint].x),
                y: (__currentPoint.y - this.__editData[_parameter_.__fromPoint].y),
            };
            this.__finalizeCopy(__copyVector);
        }
    },
    __finalizeCopy: function(__copyVector) {
        $.each( _selection_.__selectionSet, function( __index, __thisId ) {
            var __thisObject                     = _modelTools_.__getObjectById(__thisId);
            var __newObject                      = $.extend(true,{}, __thisObject);
            var __objectConstructor              = _utils_.__getObjectConstructor(__newObject[_parameter_.__type]);
            __objectConstructor.__move(__newObject, __copyVector);
            _modelTools_.__addObject(__newObject);
        });
        this.__cancelEditMode();
    },

    // MOVE OBJECTS: multiple objects, 1 (move vector) or 2 (points) parameters
    __initializeMove: function() {
        if (this.__isEditSelection()) {
            _view_.__setTouchEventsFunctionString(
                '_edit_.__setMovePoint(_view_.__touchStartLocation);',
                '_track_.__trackEntry(_edit_.__moduleName, _view_.__modelLocation);',
                '_edit_.__setMovePoint(_view_.__modelLocation, _view_.__fuzzValue);',
                '_edit_.__cancelEditMode();'
            );
            this.__initializeEditMode('move', 
                                    [_parameter_.__fromPoint,          _parameter_.__toPoint],
                                    [_parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint],
                                    '_edit_.__setMovePoint(__inputValue, _view_.__fuzzValue, true);'
                                    );
        }
    },
    __setMovePoint: function(__currentPoint, __fuzzValue, __isFromInput) {
        if (__isFromInput) {
            if (_utils_.__hasXproperty(__currentPoint)) {
                if (this.__parameterName === _parameter_.__fromPoint) {
                    this.__finalizeMove(__currentPoint);
                } else {
                    var __copyVector                     = {
                        x: (__currentPoint.x - this.__editData[_parameter_.__fromPoint].x),
                        y: (__currentPoint.y - this.__editData[_parameter_.__fromPoint].y),
                    };
                    this.__finalizeMove(__copyVector);
                }
            } else {
                _events_.__callError(this.__moduleName, _messages_.__getMessage(this.__invalidEntry));
            }
        } else if (this.__parameterName === _parameter_.__fromPoint) {
            this.__editData[_parameter_.__fromPoint]  = __currentPoint;
            this.__setNextEditParameter(__currentPoint);
        } else if (_utils_.__getDistance(this.__editData[_parameter_.__fromPoint], __currentPoint) > __fuzzValue) {
            var __copyVector                     = {
                x: (__currentPoint.x - this.__editData[_parameter_.__fromPoint].x),
                y: (__currentPoint.y - this.__editData[_parameter_.__fromPoint].y),
            };
            this.__finalizeMove(__copyVector);
        }
    },
    __finalizeMove: function(__moveVector) {
        $.each( _selection_.__selectionSet, function( __index, __thisId ) {
            var __thisObject                     = _modelTools_.__getObjectById(__thisId);
            var __objectConstructor              = _utils_.__getObjectConstructor(__thisObject[_parameter_.__type]);
            __objectConstructor.__move(__thisObject, __moveVector);
        });
        this.__cancelEditMode();
    },



    /* ********************************************************************* */
    // EXTEND OBJECTS (multiple objects, 2 parameters)
    __initializeExtend: function() {
        if (this.__isEditSelection()) {
            _view_.__setTouchEventsFunctionString(
                '_edit_.__setExtendPoint(_view_.__touchStartLocation);',
                '_track_.__trackEntry(_edit_.__moduleName, _view_.__modelLocation);',
                '_edit_.__setExtendPoint(_view_.__modelLocation, _view_.__fuzzValue);',
                '_edit_.__cancelEditMode();'
            );
            this.__initializeEditMode('extend', 
                                    [_parameter_.__firstPoint,          _parameter_.__secondPoint],
                                    [_parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint],
                                    '_edit_.__setExtendPoint(__inputValue, _view_.__fuzzValue);'
                                    );
        }
    },
    __setExtendPoint: function(__currentPoint, __fuzzValue) {
        if (this.__parameterName === _parameter_.__firstPoint) {
            this.__editData[this.__parameterName]  = __currentPoint;
            this.__setNextEditParameter();
        } else if (_utils_.__getDistance(this.__editData[_parameter_.__firstPoint], __currentPoint) > __fuzzValue) {
            this.__editData[this.__parameterName]  = __currentPoint;
            this.__finalizeExtend();
        }
    },
    __finalizeExtend: function() {
        $.each( _selection_.__selectionSet, function( __index, __thisId ) {
            var __thisObject                 = _modelTools_.__getObjectById(__thisId);
            if (_edit_.__isActionValidForObject(__thisObject, '__extend')) {
                var __objectConstructor      = _utils_.__getObjectConstructor(__thisObject[_parameter_.__type]);
                __objectConstructor.__extend(__thisObject, 
                                             _edit_.__editData[_parameter_.__firstPoint], 
                                             _edit_.__editData[_parameter_.__secondPoint]);
            }
        });
        this.__cancelEditMode();
    },



    /* ********************************************************************* */
    // MIRROR OBJECTS (multiple objects, 2 point parameters)
    __initializeMirror: function() {
        if (this.__isEditSelection()) {
            _view_.__setTouchEventsFunctionString(
                '_edit_.__setMirrorPoint(_view_.__touchStartLocation);',
                '_track_.__trackEntry(_edit_.__moduleName, _view_.__modelLocation);',
                '_edit_.__setMirrorPoint(_view_.__modelLocation, _view_.__fuzzValue);',
                '_edit_.__cancelEditMode();'
            );
            this.__initializeEditMode('mirror', 
                                    [_parameter_.__firstPoint,          _parameter_.__secondPoint],
                                    [_parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint],
                                    '_edit_.__setMirrorPoint(__inputValue, _view_.__fuzzValue);'
                                    );
        }
    },
    __setMirrorPoint: function(__currentPoint, __fuzzValue) {
        if (this.__parameterName === _parameter_.__firstPoint) {
            this.__editData[this.__parameterName]  = __currentPoint;
            this.__setNextEditParameter();
        } else if (_utils_.__getDistance(this.__editData[_parameter_.__firstPoint], __currentPoint) > __fuzzValue) {
            this.__editData[this.__parameterName]  = __currentPoint;
            this.__finalizeMirror();
        }
    },
    __finalizeMirror: function() {
        $.each( _selection_.__selectionSet, function( __index, __thisId ) {
            var __thisObject                 = _modelTools_.__getObjectById(__thisId);
            if (_edit_.__isActionValidForObject(__thisObject, '__mirror')) {
                var __objectConstructor      = _utils_.__getObjectConstructor(__thisObject[_parameter_.__type]);
                __objectConstructor.__mirror(__thisObject, 
                                             _edit_.__editData[_parameter_.__firstPoint], 
                                             _edit_.__editData[_parameter_.__secondPoint]);
            }
        });
        this.__cancelEditMode();
    },



    /* ********************************************************************* */
    // OFFSET OBJECTS (1 object, 2 parameter):
    //  Side, distance  or  point through
    __initializeOffset: function() {
        if (this.__isEditSelection()) {
            _view_.__setTouchEventsFunctionString(
                '',
                '',
                '_edit_.__setOffsetPoint(_view_.__modelLocation);',
                '_edit_.__cancelEditMode();'
            );
            this.__initializeEditMode('offset', 
                                    [_parameter_.__offsetPoint,        _parameter_.__offset],
                                    [_parameter_.__parameterTypePoint, _parameter_.__parameterTypeNumeric],
                                    '_edit_.__setOffsetPoint(__inputValue);'
                                    );
        }
    },
    __setOffsetPoint: function(__currentPoint) {
        if (_utils_.__hasXproperty(__currentPoint)) {
            this.__finalizeOffset(__currentPoint);
        } else {
            this.__editData[_parameter_.__offset] = __currentPoint;
        }
    },
    __finalizeOffset: function(__currentPoint) {
        $.each( _selection_.__selectionSet, function( __index, __thisId ) {
            var __thisObject                     = _modelTools_.__getObjectById(__thisId);
            if (_edit_.__isActionValidForObject(__thisObject, '__offset')) {
                var __thisConstructor            = _utils_.__getObjectConstructor(__thisObject[_parameter_.__type]);
                __thisConstructor.__offset(__thisObject, __currentPoint, _edit_.__editData[_parameter_.__offset]);
            }
        });
        this.__cancelEditMode();
    },


    /* ********************************************************************* */
    // ROTATE OBJECTS (multiple objects, 3 parameters)
    __initializeRotate: function() {
        if (this.__isEditSelection()) {
            _view_.__setTouchEventsFunctionString(
                '_edit_.__setRotatePoint(_view_.__touchStartLocation, _view_.__fuzzValue);',
                '_track_.__trackEntry(_edit_.__moduleName, _view_.__modelLocation);',
                '_edit_.__setRotatePoint(_view_.__modelLocation, _view_.__fuzzValue);',
                '_edit_.__cancelEditMode();'
            );
            this.__initializeEditMode('rotate', 
                                      [_parameter_.__pivotPoint,         _parameter_.__startDirection,     _parameter_.__endDirection],
                                      [_parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint],
                                      '_edit_.__setRotatePoint(__inputValue, _view_.__fuzzValue);'
                                     );
        }
    },
    __setRotatePoint: function(__currentPoint, __fuzzValue) {
        if (_utils_.__hasXproperty(__currentPoint)) {
            switch (this.__parameterName) {
                case _parameter_.__pivotPoint:
                    this.__editData[_parameter_.__pivotPoint] = __currentPoint;
                    if (_utils_.__ownsProperty(this.__editData, _parameter_.__rotation)) {
                        this.__finalizeRotate();
                    } else {
                        this.__setNextEditParameter();
                    }
                    break;
                case _parameter_.__startDirection:
                    if (_utils_.__getDistance(this.__editData[_parameter_.__pivotPoint], __currentPoint) > __fuzzValue) {
                        this.__editData[_parameter_.__startDirection] = __currentPoint;
                        this.__setNextEditParameter();
                    }
                    break;
                default:
                    if ((_utils_.__getDistance(this.__editData[_parameter_.__pivotPoint], __currentPoint)     > __fuzzValue) && 
                        (_utils_.__getDistance(this.__editData[_parameter_.__startDirection], __currentPoint) > __fuzzValue)) {
                            var firstDirection  =  Math.atan2(this.__editData[_parameter_.__startDirection].y - this.__editData[_parameter_.__pivotPoint].y, this.__editData[_parameter_.__startDirection].x - this.__editData[_parameter_.__pivotPoint].x);
                            var secondDirection = Math.atan2(__currentPoint.y - this.__editData[_parameter_.__pivotPoint].y, __currentPoint.x - this.__editData[_parameter_.__pivotPoint].x);
                            this.__editData[_parameter_.__rotation] = (secondDirection - firstDirection);
                            this.__finalizeRotate();
                    }
            }
        } else {
            if (isNaN(__currentPoint)) {
                _events_.__callError(this.__moduleName, _messages_.__getMessage(this.__invalidEntry));
            } else {
                this.__editData[_parameter_.__rotation] = (__currentPoint * Math.PI / 180.0);
                if (_utils_.__ownsProperty(this.__editData, _parameter_.__pivotPoint)) {
                    this.__finalizeRotate();
                }
            }
        }
    },
    __finalizeRotate: function() {
        if (!this.__editData[_parameter_.__rotation]) {
            var __startDirection                 = Math.atan2((this.__editData[_parameter_.__startDirection].y - this.__editData[_parameter_.__pivotPoint].y),
                                                              (this.__editData[_parameter_.__startDirection].x - this.__editData[_parameter_.__pivotPoint].x));
            var __endDirection                   = Math.atan2((this.__editData[_parameter_.__endDirection].y   - this.__editData[_parameter_.__pivotPoint].y),
                                                              (this.__editData[_parameter_.__endDirection].x   - this.__editData[_parameter_.__pivotPoint].x));
            this.__editData[_parameter_.__rotation]  = (__endDirection - __startDirection);
        }

        $.each( _selection_.__selectionSet, function( __index, __thisId ) {
            var __thisObject                 = _modelTools_.__getObjectById(__thisId);
            if (_edit_.__isActionValidForObject(__thisObject, '__trim')) {
                var __objectConstructor          = _utils_.__getObjectConstructor(__thisObject[_parameter_.__type]);
                __objectConstructor.__rotate(__thisObject, 
                                             _edit_.__editData[_parameter_.__pivotPoint], 
                                             _edit_.__editData[_parameter_.__rotation]);
            }
        });
        this.__cancelEditMode();
    },


    /* ********************************************************************* */
    // SCALE OBJECTS (multiple objects, 3 parameters)
    // CHECKED
    __initializeScale: function() {
        if (this.__isEditSelection()) {
            _view_.__setTouchEventsFunctionString(
                '_edit_.__setScalePoint(_view_.__touchStartLocation, _view_.__fuzzValue);',
                '_track_.__trackEntry(_edit_.__moduleName, _view_.__modelLocation);',
                '_edit_.__setScalePoint(_view_.__modelLocation, _view_.__fuzzValue);',
                '_edit_.__cancelEditMode();'
            );
            this.__initializeEditMode('scale', 
                                    [_parameter_.__anchorPoint,        _parameter_.__fromPoint,          _parameter_.__toPoint],
                                    [_parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint],
                                    '_edit_.__setScalePoint(__inputValue, _view_.__fuzzValue);'
                                    );
        }
    },
    __setScalePoint: function(__currentPoint, __fuzzValue) {
        // NOTE: __fromPoint and __toPoint will combine to __scale
        //  User may enter scale directly when prompted for __fromPoint. 
        if (_utils_.__hasXproperty(__currentPoint)) {
            switch (this.__parameterName) {
                case _parameter_.__anchorPoint:
                    this.__editData[_parameter_.__anchorPoint]            = __currentPoint;
                    if (_utils_.__ownsProperty(this.__editData, _parameter_.__scale)) {
                        this.__finalizeScale();
                    } else {
                        this.__setNextEditParameter();
                    }
                    break;
                case _parameter_.__fromPoint:
                    if (_utils_.__getDistance(this.__editData[_parameter_.__anchorPoint], __currentPoint) > __fuzzValue) {
                        this.__editData[_parameter_.__fromPoint]    = __currentPoint;
                        this.__setNextEditParameter();
                    }
                    break;
                default:
                    if ((_utils_.__getDistance(this.__editData[_parameter_.__anchorPoint], __currentPoint) > __fuzzValue) && 
                        (_utils_.__getDistance(this.__editData[_parameter_.__fromPoint],   __currentPoint) > __fuzzValue)) {
                            var __firstDistance                      = _utils_.__getDistance(this.__editData[_parameter_.__anchorPoint], this.__editData[_parameter_.__fromPoint]);
                            var __secondDistance                     = _utils_.__getDistance(this.__editData[_parameter_.__anchorPoint], __currentPoint);
                            this.__editData[_parameter_.__scale] = (__secondDistance / __firstDistance);
                            this.__finalizeScale();
                    }
            }
        } else {
            if (isNaN(__currentPoint)) {
                _events_.__callError(this.__moduleName, _messages_.__getMessage(this.__invalidEntry));
            } else if (__currentPoint <= 0.0) {
                _events_.__callError(this.__moduleName, _messages_.__getMessage(this.__invalidEntry));
            } else {
                this.__editData[_parameter_.__scale]                 =__currentPoint;
                if (_utils_.__ownsProperty(this.__editData, _parameter_.__anchorPoint)) {
                    this.__finalizeScale();
                }
            }
        }
    },
    __finalizeScale: function() {
        $.each( _selection_.__selectionSet, function( __index, __thisId ) {
            var __thisObject                                         = _modelTools_.__getObjectById(__thisId);
            if (_edit_.__isActionValidForObject(__thisObject, '__scale')) {
                var __objectConstructor                              = _utils_.__getObjectConstructor(__thisObject[_parameter_.__type]);
                __objectConstructor.__scale(__thisObject, _edit_.__editData[_parameter_.__anchorPoint], _edit_.__editData[_parameter_.__scale]);
            }
        });
        this.__cancelEditMode();
    },


    /* ********************************************************************* */
    // STRETCH OBJECTS (multiple objects, 4 parameters)
    __initializeStretch: function() {
        if (this.__isEditSelection()) {
            _view_.__setTouchEventsFunctionString(
                '_edit_.__setStretchPoint(_view_.__touchStartLocation, _view_.__fuzzValue);',
                '_track_.__trackEntry(_edit_.__moduleName, _view_.__modelLocation);',
                '_edit_.__setStretchPoint(_view_.__modelLocation, _view_.__fuzzValue);',
                '_edit_.__cancelEditMode();'
            );
            this.__initializeEditMode('stretch', 
                                    [_parameter_.__firstCorner,        _parameter_.__secondCorner,       _parameter_.__fromPoint,          _parameter_.__toPoint],
                                    [_parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint],
                                    '_edit_.__setStretchPoint(__inputValue, _view_.__fuzzValue);'
                                    );
        }
    },
    __setStretchPoint: function(__currentPoint, __fuzzValue) {
        switch (this.__parameterName) {
            case _parameter_.__firstCorner:
                this.__editData[this.__parameterName]  = __currentPoint;
                this.__setNextEditParameter();
                break;
            case _parameter_.__secondCorner:
                if (_utils_.__getDistance(this.__editData[_parameter_.__firstCorner], __currentPoint) > __fuzzValue) {
                    this.__editData[this.__parameterName]  = __currentPoint;
                    this.__setNextEditParameter();
                }
                break;
            case _parameter_.__fromPoint:
                this.__editData[this.__parameterName]  = __currentPoint;
                this.__setNextEditParameter();
                break;
            default:
                if (_utils_.__getDistance(this.__editData[_parameter_.__fromPoint], __currentPoint) > __fuzzValue) {
                    this.__editData[this.__parameterName]  = __currentPoint;
                    this.__finalizeStretch();
                }
        }
    },
    __finalizeStretch: function() {
        $.each( _selection_.__selectionSet, function( __index, __thisId ) {
            var __thisObject                 = _modelTools_.__getObjectById(__thisId);
            if (_edit_.__isActionValidForObject(__thisObject, '__stretch')) {
                var __objectConstructor          = _utils_.__getObjectConstructor(__thisObject[_parameter_.__type]);
                __objectConstructor.__stretch(__thisObject, 
                                              _edit_.__editData[_parameter_.__firstCorner], 
                                              _edit_.__editData[_parameter_.__secondCorner], 
                                              _edit_.__editData[_parameter_.__fromPoint], 
                                              _edit_.__editData[_parameter_.__toPoint]);
            }
        });
        this.__cancelEditMode();
    },


    /* ********************************************************************* */
    // TRIM OBJECTS (multiple objects, 3 parameters)
    __initializeTrim: function() {
        if (this.__isEditSelection()) {
            _view_.__setTouchEventsFunctionString(
                '_edit_.__setTrimPoint(_view_.__touchStartLocation, _view_.__fuzzValue);',
                '_track_.__trackEntry(_edit_.__moduleName, _view_.__modelLocation);',
                '_edit_.__setTrimPoint(_view_.__modelLocation, _view_.__fuzzValue);',
                '_edit_.__cancelEditMode();'
            );
            this.__initializeEditMode('trim', 
                                    [_parameter_.__firstPoint,         _parameter_.__secondPoint,        _parameter_.__sidePoint],
                                    [_parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint],
                                    '_edit_.__setTrimPoint(__inputValue, _view_.__fuzzValue, true);'
                                    );
        }
    },
    __setTrimPoint: function(__currentPoint, __fuzzValue) {
        switch (this.__parameterName) {
            case _parameter_.__firstPoint:
                this.__editData[this.__parameterName]  = __currentPoint;
                this.__setNextEditParameter();
            break;
            case _parameter_.__secondPoint:
                if (_utils_.__getDistance(this.__editData[_parameter_.__firstPoint], __currentPoint) > __fuzzValue) {
                    this.__editData[this.__parameterName]  = __currentPoint;
                    this.__setNextEditParameter();
                }
                break;
            default:
                if ((_utils_.__getDistance(this.__editData[_parameter_.__firstPoint], __currentPoint) > __fuzzValue) &&
                    (_utils_.__getDistance(this.__editData[_parameter_.__firstPoint], __secondPoint)  > __fuzzValue)) {
                        this.__editData[this.__parameterName]  = __currentPoint;
                        this.__finalizeTrim();
                    }
        }
    },
    __finalizeTrim: function() {
        $.each( _selection_.__selectionSet, function( __index, __thisId ) {
            var __thisObject                 = _modelTools_.__getObjectById(__thisId);
            if (_edit_.__isActionValidForObject(__thisObject, '__trimCommand')) {
                var __objectConstructor      = _utils_.__getObjectConstructor(__thisObject[_parameter_.__type]);
                __objectConstructor.__trim(__thisObject, 
                                           _edit_.__editData[_parameter_.__firstPoint], 
                                           _edit_.__editData[_parameter_.__secondPoint], 
                                           _edit_.__editData[_parameter_.__sidePoint]);
            }
        });
        this.__cancelEditMode();
    },


    /* ********************************************************************* */
    __cancelEditMode: function() {
        delete this.__parameterNames;
        delete this.__parameterTypes;
        delete this.__parameterIndex;
        delete this.__editData;
        _selection_.__cancelSelection(true);
        _inputSingle_.__resetInput();
        _paint_.__paintEntry();
    }

};
