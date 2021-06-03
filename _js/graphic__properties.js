var _properties_ = {

    __moduleName:            '_properties_',
    __editObject:            null,
    __propertyIndex:         null,


    /* ********************************************************************* */
    // EDIT OBJECT PROPERTIES
    //  Edit parameters
    __commonPropertyNames:       [_parameter_.__layer,                       _parameter_.__color,],
    __commonPropertyTypes:       ['_model_[_parameter_.__layers]',           '_utils_.__colorList'],

    __textFontStylePropertyName: [_parameter_.__fontStyle],
    __textFontStylePropertyType: ['_model_[_parameter_.__fontStyles]'],

    __textPropertyNames:         [_parameter_.__hAlign,                      _parameter_.__vAlign],
    __textPropertyTypes:         ['_properties_.__textHorizontalAlign',      '_properties_.__textVerticalAlign'],

    __textHorizontalAlign:       [_parameter_.__left,                        _parameter_.__center,               _parameter_.__right],
    __textVerticalAlign:         [_parameter_.__bottom,                      _parameter_.__middle,               _parameter_.__top  ],

    __vectorPropertyNames:       [_parameter_.__lineType,                    _parameter_.__lineWidth,            _parameter_.__lineTypeScale],
    __vectorPropertyTypes:       ['_model_[_parameter_.__lineTypes]',        _parameter_.__parameterTypeNumeric, _parameter_.__parameterTypeNumeric],

    __editObjectProperties: function() {
        if (_anchor_.__anchorIds) {
            var __thisId                                   = _anchor_.__anchorIds[0];
            this.__editObject                              = _modelTools_.__getObjectById(__thisId);
            // Set basic object properties
            this.__setObjectParameters(this.__editObject);
            // Add common editable properties
            this.__addProperties(this.__commonPropertyNames, this.__commonPropertyTypes);
            var __type                                     = this.__editObject[_parameter_.__type];
            var __className                                = _utils_.__typeToClass[__type];
            switch (__className) {
                case _text_.__moduleName:
                    this.__addProperties(this.__textFontStylePropertyName, this.__textFontStylePropertyType);
                    if (this.__editObject[_parameter_.__type] === _text_.__textCallout) {
                        // callout has vector properties, but no alignment
                        this.__addProperties(this.__vectorPropertyNames, this.__vectorPropertyTypes);
                    } else {
                        // texts have alignments
                        this.__addProperties(this.__textPropertyNames, this.__textPropertyTypes);
                    }
                    // Block / Template text attribute:
                    if (this.__editObject[_parameter_.__attribute]) {
                        this.__parameterNames.push(_parameter_.__attribute);
                        this.__parameterTypes.push(_parameter_.__parameterTypeString);
                    } 
                    break;
                case _insert_.__moduleName:
                case _image_.__moduleName:
                    // No vector property for insert and images
                    break;
                default:
                    this.__addProperties(this.__vectorPropertyNames, this.__vectorPropertyTypes);
            }
            // Matrix: Refer to edit definitions
            if (_utils_.__ownsProperty(this.__editObject, _parameter_.__arrayCenter)) {
                var __arrayParameters                      = _array_.__arrayParameterObject[_parameter_.__arrayStylePolar];
                this.__addProperties(__arrayParameters.__parameterNames, __arrayParameters.__parameterTypes);
            } else if (_utils_.__ownsProperty(this.__editObject, _parameter_.__arrayColumns)) {
                var __arrayParameters                      = _array_.__arrayParameterObject[_parameter_.__arrayStyleRectangular];
                this.__addProperties(__arrayParameters.__parameterNames, __arrayParameters.__parameterTypes);
            }
            // Set input object
            var __editParameters                           = {
                                                                __parameterNames: this.__parameterNames,
                                                                __parameterTypes: this.__parameterTypes,
                                                             };
            var __message                                  = _messages_.__getMessage(this.__moduleName) + _parameter_.__colonSpace +  _messages_.__getMessage(this.__editObject[_parameter_.__type]);
            _inputMultiple_.__setMultipleInput(__message, __editParameters, this.__editObject, '_properties_.__finalizeProperties(__parameterValues);', '_properties_.__updateProperties(__parameterValues);');
        }
    },
    __setObjectParameters: function(__thisObject) {
        var __thisConstructor                              = _utils_.__getObjectConstructor(__thisObject[_parameter_.__type]);
        if (__thisConstructor.__parameterObject) {
            var __parameterObject                          = __thisConstructor.__parameterObject[__thisObject[_parameter_.__type]];
            this.__parameterNames                          = __parameterObject.__parameterNames;
            this.__parameterTypes                          = __parameterObject.__parameterTypes;
        } else {
            this.__parameterNames                          = __thisConstructor.__parameterNames;
            this.__parameterTypes                          = __thisConstructor.__parameterTypes;
        }
        if (__thisObject[_parameter_.__sideCount]) {
            this.__parameterNames                          = this.__parameterNames.concat(__thisConstructor.__optionNames);
            this.__parameterTypes                          = this.__parameterTypes.concat(__thisConstructor.__optionTypes);
        }
    },
    __addProperties: function(__propertyNames, __propertyTypes) {
        for (var __propertyIndex = 0; __propertyIndex < __propertyNames.length; __propertyIndex += 1) {
            var __parameterName                            = __propertyNames[__propertyIndex];
            var __parameterType                            = __propertyTypes[__propertyIndex];
            if ($.inArray(__parameterName, this.__parameterNames) === -1) {
                this.__parameterNames.push(__parameterName);
                this.__parameterTypes.push(__parameterType);
            }
        }
    },
    __finalizeProperties: function(__parameterValues) {
        // Note: values already validated
        this.__updateProperties(__parameterValues);
        delete this.__editObject;
    },
    __updateProperties: function(__parameterValues) {
        // Process matrix properties first
        if (_utils_.__ownsProperty(__parameterValues, _parameter_.__arrayColumns)) {
            var __arrayColumns                             = this.__parseInt(__parameterValues[_parameter_.__arrayColumns]);
            var __arrayRows                                = this.__parseInt(__parameterValues[_parameter_.__arrayRows]);
            var __arrayColumnWidth                         = this.__parseFloat(__parameterValues[_parameter_.__arrayColumnWidth]);
            var __arrayRowHeight                           = this.__parseFloat(__parameterValues[_parameter_.__arrayRowHeight]);
            var __arrayRotation                            = this.__parseFloat(__parameterValues[_parameter_.__arrayRotation], true);
            //  Remove array properties from parameter values
            delete __parameterValues[_parameter_.__arrayColumns];
            delete __parameterValues[_parameter_.__arrayColumnWidth];
            delete __parameterValues[_parameter_.__arrayRows];
            delete __parameterValues[_parameter_.__arrayRowHeight];
            delete __parameterValues[_parameter_.__arrayRotation];
            // Process:
            if ((__arrayColumns > 0) && (__arrayRows > 0)) {
                // Matrix is added/updated
                this.__editObject[_parameter_.__arrayColumns]       = __arrayColumns;
                this.__editObject[_parameter_.__arrayColumnWidth]   = __arrayColumnWidth;
                this.__editObject[_parameter_.__arrayRows]          = __arrayRows;
                this.__editObject[_parameter_.__arrayRowHeight]     = __arrayRowHeight;
                this.__editObject[_parameter_.__arrayRotation]      = __arrayRotation;
            } else {
                // Matrix is removed:
                delete this.__editObject[_parameter_.__arrayColumns];
                delete this.__editObject[_parameter_.__arrayColumnWidth];
                delete this.__editObject[_parameter_.__arrayRows];
                delete this.__editObject[_parameter_.__arrayRowHeight];
                delete this.__editObject[_parameter_.__arrayRotation];
            }
        }
        // Apply all other properties
        $.each(__parameterValues, function(__parameterName, __parameterValue) {
            if ((__parameterValue === '') || (__parameterValue === null)){
                delete _properties_.__editObject[__parameterName];
            } else if (__parameterValue === _messages_.__getMessage(_parameter_.__layerOption)) {
                _properties_.__editObject[__parameterName] = _parameter_.__layerOptionDefault; 
            } else {
                _properties_.__editObject[__parameterName] = __parameterValue;
            }
        });
        // Update object
        var __editObjectConstructor                        = _utils_.__getObjectConstructor(this.__editObject[_parameter_.__type]);
        __editObjectConstructor.__updateAnchorPoints(this.__editObject);
    },
        // Check array cell count
    __parseInt: function(__data) {
        switch (__data) {
            case undefined:
            case null:
            case '':
                return 0;
            default:
                try {
                    return Math.max(parseInt(__data), 0);
                } catch (ex) {
                    return 0.0;
                }
        }
    },
        // Check array cell size
    __parseFloat: function(__data, isNegativeValid) {
        switch (__data) {
            case undefined:
            case null:
            case '':
                return 0.0;
            default:
                try {
                    if (isNegativeValid) {
                        return parseFloat(__data);
                    } else {
                        return Math.max(parseFloat(__data), 0.0);
                    }
                } catch (ex) {
                    return 0.0;
                }
        }
    },

};
