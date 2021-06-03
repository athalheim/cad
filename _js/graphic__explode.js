var _explode_ = {
    
    __moduleName:                                '_explode',

    __explodeSelection: function() {
        _selection_.__selectAnchorObjects();
        if (_selection_.__selectionSet) {
            $.each( _selection_.__selectionSet, function( __index, __thisId ) {
                var __thisObject                 = _model_[_parameter_.__list][__thisId];
                _explode_.__explodeSelectedObject(__thisId, __thisObject);
            });
            _selection_.__cancelSelection(true);
            _paint_.__paintEntry();
        }
    },
    __explodeSelectedObject: function(__thisId, __thisObject) {
        var __objectConstructor                  = _utils_.__getObjectConstructor(__thisObject[_parameter_.__type]);
        if (__objectConstructor.__explode) {
            var __newObjectsData                 = __objectConstructor.__explode(__thisObject);
            $.each( __newObjectsData, function( __objectIndex, __newObjectData ) {
                var __newObject                  = _modelTools_.__buildObject(__newObjectData[_parameter_.__type]);
                $.each( __newObjectData, function( __propertyName, __propertyValue ) {
                    __newObject[__propertyName]  = __propertyValue;
                });
                var __newObjectConstructor       = _utils_.__getObjectConstructor(__newObject[_parameter_.__type]);
                __newObjectConstructor.__updateAnchorPoints(__newObject);
                _modelTools_.__addObject(__newObject);
            });
            delete _model_[_parameter_.__list][__thisId];
        }
    },

};
