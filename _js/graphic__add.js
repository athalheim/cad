var _add_ = {

    __moduleName:               '_add_',
    __parameterNames:           null,
    __parameterTypes:           null,
    
    __parameterIndex:           null,
    __parameterName:            null,
    __parameterType:            null,

    __currentConstructor:       null,
    __currentObject:            null,

    // NOTE:
    //  Parameter types:
    //   p: point
    //   n: numeric
    //   s: string
    //   b: boolean
    //   <string>: Object, providing a list of choices


    /* ************************************************************* */
    // Procedures:

        // Called from context menu: dispatches to relevant object
    __initialize: function(__type, __option) {
        this.__currentObject                     = _modelTools_.__buildObject(__type, __option);
        this.__currentConstructor                = _utils_.__getObjectConstructor(__type);
        var __option                             = this.__currentObject[_parameter_.__option]?this.__currentObject[_parameter_.__option]:'';
        this.__parameterIndex                    = -1;
        if (this.__currentConstructor.__parameterObject) {
            var __parameterObject                = this.__currentConstructor.__parameterObject[this.__currentObject[_parameter_.__type] + __option];
            this.__parameterNames                = __parameterObject.__parameterNames;
            this.__parameterTypes                = __parameterObject.__parameterTypes;
        } else {
            this.__parameterNames                = this.__currentConstructor.__parameterNames;
            this.__parameterTypes                = this.__currentConstructor.__parameterTypes;
        }
        // Manage exceptions
        if (this.__currentConstructor.__initialize) {
            this.__currentConstructor.__initialize(this.__currentObject);
        }
        this.__setNextParameter();
        _view_.__setTouchEventsFunctionString(
            '_add_.__addParameterData(_view_.__touchStartLocation);',
            '_add_.__followAddObject(_view_.__modelLocation);',
            '_add_.__finalizeParameterData(_view_.__touchStartLocation, _view_.__modelLocation, _view_.__fuzzValue);',
            '_add_.__cancelAdd();'
        );
        _inputSingle_.__initializeInput(this.__moduleName, this.__currentObject, this.__parameterName, this.__parameterType);
    },
    __setNextParameter: function() {
        if (this.__parameterIndex === -1) {
            return this.__getNextParameter();
        } else if (_utils_.__ownsProperty(this.__currentObject, this.__parameterName)) {
            return this.__getNextParameter();
        } else if (this.__currentObject[_parameter_.__type] === _line_.__lineType){
            return false;
        } else if (this.__currentObject[_parameter_.__type] === _polyline_.__polygonType){
            return (this.__currentObject[_parameter_.__option] === undefined);
        } else {
            return true;
        }
    },
    __getNextParameter: function() {
        this.__parameterIndex                  += 1;
        if (this.__parameterIndex < this.__parameterNames.length) {
            this.__parameterName                = this.__parameterNames[this.__parameterIndex];
            this.__parameterType                = this.__parameterTypes[this.__parameterIndex];
            return true;
        }
    },


    // Called from view module when '__processTouchMove'
    __followAddObject: function( __currentPoint) {
        if (this.__currentObject[_parameter_.__type] === _sketch_.__sketchType) {
            this.__addParameterData(__currentPoint);
        }
        _track_.__trackEntry(this.__moduleName, __currentPoint);
    },

    
    // Called from view module when '__processTouchEnd'
    __finalizeParameterData: function(__startPoint, __currentPoint, __fuzzValue) {
        if (_utils_.__getDistance(__startPoint, __currentPoint) > __fuzzValue) {
            if (this.__currentObject[_parameter_.__type] === _sketch_.__sketchType) {
                this.__finalize(__currentPoint);
            } else if (this.__parameterType.length > 1) {
                // List selection expected from input module: Do nothing
            } else if ((this.__parameterType === _parameter_.__parameterTypeString) || (this.__parameterType === _parameter_.__url)) {
                // Text expected from input module: Do nothing
            } else {
                this.__addParameterData(__currentPoint);
            }
        }
    },

    __addParameterData: function(__data, __url) {
        // Store last point: used as reference whenever using input '@'
        if (__data === '@') {
            if (_view_.__lastTouchLocation) {
                __data                           = _view_.__lastTouchLocation;
            } else {
                // Repeat
                _inputSingle_.__setParameterInput(this.__parameterName, this.__parameterType);
                return;
            }
        }
        if (this.__currentConstructor.__addParameterData(this.__currentObject, __data, __url)) {
            if (this.__setNextParameter(this.__currentObject)) {
                _inputSingle_.__setParameterInput(this.__parameterName, this.__parameterType);
            } else {
                this.__finalize();
            }
        }
    },
    

        // Called from 'done' item in context menu:
    __isAddMenuDoneOptionValid: function() {
        if (this.__currentObject[_parameter_.__points]) {
           return (this.__currentObject[_parameter_.__points].length > 0);
        }
    },

    __finalize: function(__currentPoint) {
        this.__currentConstructor.__finalize(this.__currentObject, __currentPoint);
        _modelTools_.__addObject(this.__currentObject);
        this.__cancelAdd();
    },


        // Resets interface
    __cancelAdd: function() {
        this.__parameterNames                     = null;
        this.__parameterTypes                     = null;
        this.__parameterIndex                     = null;
        this.__parameterName                      = null;
        this.__parameterType                      = null;
        this.__currentObject                      = null;
        this.__currentConstructor           = null;
        _view_.__resetTouchEventsFunctionString();
        _inputSingle_.__resetInput();
        _tooltip_.__hideTooltip();
        _paint_.__paintEntry();
    },

};
