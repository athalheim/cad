var _array_ = {

    __moduleName:             '_array_',
    __arrayStyleList:         [_parameter_.__arrayStylePolar, _parameter_.__arrayStyleRectangular],
    __arrayParameterObject: {
        arrayPolar: {
            __parameterNames: [_parameter_.__arrayObjectsMode, _parameter_.__arrayCenter,        _parameter_.__arrayCount,           _parameter_.__arrayRotation,        _parameter_.__arrayFollowsRotation],
            __parameterTypes: ['_array_.__arrayObjectsMode',   _parameter_.__parameterTypePoint, _parameter_.__parameterTypeNumeric, _parameter_.__parameterTypeNumeric, _parameter_.__parameterTypeBoolean],
        },
        arrayRectangular: {
            __parameterNames: [_parameter_.__arrayObjectsMode, _parameter_.__arrayColumns,         _parameter_.__arrayRows,            _parameter_.__arrayColumnWidth,     _parameter_.__arrayRowHeight,       _parameter_.__arrayRotation],
            __parameterTypes: ['_array_.__arrayObjectsMode',   _parameter_.__parameterTypeNumeric, _parameter_.__parameterTypeNumeric, _parameter_.__parameterTypeNumeric, _parameter_.__parameterTypeNumeric, _parameter_.__parameterTypeNumeric],
        },
    },
    __arrayObjectsMode:       [_parameter_.__arrayObjectsModeSingle, _parameter_.__arrayObjectsModeSeparate],

    // First, select array mode: polar / rectangluar
    __initializeArray: function(__arrayStyle) {
        _selection_.__selectAnchorObjects();
        if (__arrayStyle) {
            this.setArrayStyleParameters(__arrayStyle);
        } else {
            _selection_.__selectAnchorObjects();
            _inputSingle_.__setPropertyChoiceInput(this.__moduleName, this.__arrayStyleList, null, true, '_array_.setArrayStyleParameters(__inputValue)');
        }
    },
    // Used to create array, then to edit object
    setArrayStyleParameters: function(__arrayStyle, __thisObject) {
        var __arrayParameters                                  = this.__arrayParameterObject[__arrayStyle];
        var __message                                          = _messages_.__getMessage(this.__moduleName);
        _inputMultiple_.__setMultipleInput(__message, __arrayParameters, __thisObject, '_array_.__processArray(__parameterValues);' );
    },
    __processArray: function(__parameterValues) {
        if (_utils_.__ownsProperty(__parameterValues, _parameter_.__arrayCenter)) {
            this.__processArrayPolar(__parameterValues);
        } else {
            this.__processArrayRectangular(__parameterValues);
        }
        _selection_.__cancelSelection(true);
        _paint_.__paintEntry();
    },
    __processArrayPolar: function(__parameterValues) {
        var __arrayObjectsMode                                 = __parameterValues[_parameter_.__arrayObjectsMode]?__parameterValues[_parameter_.__arrayObjectsMode]:_parameter_.__arrayObjectsModeSingle;
        var __arrayCenter                                      = __parameterValues[_parameter_.__arrayCenter]?__parameterValues[_parameter_.__arrayCenter]:null;
        var __arrayCount                                       = __parameterValues[_parameter_.__arrayCount]?__parameterValues[_parameter_.__arrayCount]:0;
        var __arrayRotation                                    = __parameterValues[_parameter_.__arrayRotation]?(__parameterValues[_parameter_.__arrayRotation] * Math.PI / 180.0):0.0;
        var __arrayFollowsRotation                             = __parameterValues[_parameter_.__arrayFollowsRotation]?__parameterValues[_parameter_.__arrayFollowsRotation]:true;
        if (__arrayCenter && (__arrayCount > 1)) {
            // Process objects
            $.each( _selection_.__selectionSet, function( __index, __thisId ) {
                var __thisObject                               = _model_[_parameter_.__list][__thisId];
                var __thisConstructor                          = _utils_.__getObjectConstructor(__thisObject[_parameter_.__type]);
                if (__arrayObjectsMode === _parameter_.__arrayObjectsModeSeparate) {
                    for (var __index = 0; __index < __arrayCount; __index += 1) {
                        var __itemRotation                     = ((Math.PI * 2.0) * (__index / __arrayCount));
                        var __newObject                        = $.extend(true,{}, __thisObject);
                        if (!__arrayFollowsRotation) {
                            __thisConstructor.__rotate(__newObject, __newObject[_parameter_.__origin], -__itemRotation);
                        }
                        __thisConstructor.__rotate(__newObject, __arrayCenter, __itemRotation);
                        __thisConstructor.__updateAnchorPoints(__newObject);
                        _modelTools_.__addObject(__newObject);
                    }
                } else {
                    __thisObject[_parameter_.__arrayCenter]    = __arrayCenter;
                    __thisObject[_parameter_.__arrayCount]     = __arrayCount;
                    __thisObject[_parameter_.__arrayRotation]  = __arrayRotation;
                    __thisObject[_parameter_.__arrayFollowsRotation] = __arrayFollowsRotation;
                    __thisConstructor.__updateAnchorPoints(__thisObject);
                }
            });
        }
    },
    __processArrayRectangular: function(__parameterValues) {
        var __arrayObjectsMode                                 = __parameterValues[_parameter_.__arrayObjectsMode]?__parameterValues[_parameter_.__arrayObjectsMode]:_parameter_.__arrayModeSingle;
        var __arrayColumns                                     = __parameterValues[_parameter_.__arrayColumns]?__parameterValues[_parameter_.__arrayColumns]:1;
        var __arrayRows                                        = __parameterValues[_parameter_.__arrayRows]?__parameterValues[_parameter_.__arrayRows]:1;
        var __arrayColumnWidth                                 = __parameterValues[_parameter_.__arrayColumnWidth]?__parameterValues[_parameter_.__arrayColumnWidth]:0;
        var __arrayRowHeight                                   = __parameterValues[_parameter_.__arrayRowHeight]?__parameterValues[_parameter_.__arrayRowHeight]:0;
        var __arrayRotation                                    = __parameterValues[_parameter_.__arrayRotation]?(__parameterValues[_parameter_.__arrayRotation] * Math.PI / 180.0):0;
        __arrayColumns                                         = Math.max(__arrayColumns, 0);
        __arrayRows                                            = Math.max(__arrayRows, 0);
        // Process if valid
        if (((__arrayColumns > 1) && (__arrayColumnWidth > 0.0)) || ((__arrayRows > 1) && (__arrayRowHeight > 0.0))) {
            // Process objects
            $.each( _selection_.__selectionSet, function( __index, __thisId ) {
                var __thisObject                               = _model_[_parameter_.__list][__thisId];
                var __thisConstructor                          = _utils_.__getObjectConstructor(__thisObject[_parameter_.__type]);
                if (__arrayObjectsMode === _parameter_.__arrayObjectsModeSeparate) {
                    // Build dummy array object for points process
                    var __thisArray                            = {};
                    __thisArray[_parameter_.__arrayColumns]    = __arrayColumns;
                    __thisArray[_parameter_.__arrayRows]       = __arrayRows;
                    __thisArray[_parameter_.__arrayColumnWidth]    = __arrayColumnWidth;
                    __thisArray[_parameter_.__arrayRowHeight]  = __arrayRowHeight;
                    __thisArray[_parameter_.__arrayRotation]   = __arrayRotation;
                    var __arrayPoints                          = _array_.__buildRectangularArrayPoints(__thisArray);
                    $.each( __arrayPoints, function( __index, __deltaVector ) {
                        var __newObject                        = $.extend(true,{}, __thisObject);
                        __thisConstructor.__move(__newObject, __deltaVector);
                        __thisConstructor.__updateAnchorPoints(__newObject);
                        _modelTools_.__addObject(__newObject);
                    });
                } else {
                    __thisObject[_parameter_.__arrayColumns]   = __arrayColumns;
                    __thisObject[_parameter_.__arrayRows]      = __arrayRows;
                    __thisObject[_parameter_.__arrayColumnWidth]    = __arrayColumnWidth;
                    __thisObject[_parameter_.__arrayRowHeight] = __arrayRowHeight;
                    __thisObject[_parameter_.__arrayRotation]  = __arrayRotation;
                    __thisConstructor.__updateAnchorPoints(__thisObject);
                }
            });
        }
    },

    
    __buildRectangularArrayPoints: function(__thisObject) {
        var __arrayColumns                                     = __thisObject[_parameter_.__arrayColumns]?__thisObject[_parameter_.__arrayColumns]:1;
        var __arrayRows                                        = __thisObject[_parameter_.__arrayRows]?__thisObject[_parameter_.__arrayRows]:1;
        var __arrayColumnWidth                                 = __thisObject[_parameter_.__arrayColumnWidth]?__thisObject[_parameter_.__arrayColumnWidth]:0.0;
        var __arrayRowHeight                                   = __thisObject[_parameter_.__arrayRowHeight]?__thisObject[_parameter_.__arrayRowHeight]:0.0;
        var __arrayRotation                                    = __thisObject[_parameter_.__arrayRotation]?__thisObject[_parameter_.__arrayRotation]:0.0;
        var __columnIndex                                      = 0;
        //  Begin points construction
        var __arrayPoints                                      = new Array();
        for (var __columnIndex = 0; __columnIndex < __arrayColumns; __columnIndex += 1) {
            for (var __rowIndex = 0; __rowIndex < __arrayRows; __rowIndex += 1) {
                var __deltaX                                   = (__columnIndex * __arrayColumnWidth);
                var __deltaY                                   = (__rowIndex * __arrayRowHeight);
                // Apply rotation
                var __distanceToDelta                          = Math.sqrt((__deltaX * __deltaX) + (__deltaY * __deltaY));
                var __directionToDelta                         = (Math.atan2(__deltaY, __deltaX) + __arrayRotation);
                var __newDeltaPoint                            = _utils_.__setDirectionPoint({x:0, y:0}, __directionToDelta, __distanceToDelta);
                __arrayPoints.push(__newDeltaPoint);
            }
        }
        return __arrayPoints;
    },

};
