var _selection_ = {
 
    __moduleName:                                '_selection_',
    __selectionAreaFirstPoint:                   null,
    __selectionArea:                             null,
    __selectionSet:                              null,
    __isSelectingMultipleObjects:                false,

    /* ******************************************************* */

    __isSingleSelection: function() {
        if (this.__selectionSet) {
            return (this.__selectionSet.length === 1);
        }
    },
    __isItemSelected: function(__thisId) {
        if (this.__selectionSet) {
            return ($.inArray(__thisId, this.__selectionSet) > -1);
        }
    },
    
    
    /* ******************************************************* */
    // Single selection
    __initializeSingleSelection: function() {
        _view_.__setTouchEventsFunctionString(
            '',
            '',
            '_selection_.__finalizeSingleSelection(this.__modelLocation);',
            '_selection_.__cancelSelection(true);'
        );
    },
    __finalizeSingleSelection: function(__currentPoint) {
        if (_anchor_.__anchorIds) {
            this.__selectAnchorObjects();
        }
        this.__cancelSelection(false);
    },


    /* ******************************************************* */
    // Multiple selection
    __initializeMultipleSelection: function() {
        this.__selectionSet                      = new Array();
        this.__isSelectingMultipleObjects        = true;
        _view_.__setTouchEventsFunctionString(
            '',
            '',
            '_selection_.__followMultipleSelection();',
            '_selection_.__cancelSelection(true);'
        );
    },
    __followMultipleSelection: function( __currentPoint) {
        if (_anchor_.__anchorIds) {
            $.each( _anchor_.__anchorIds, function( __index, __thisId ) {
                if ($.inArray(__thisId, _selection_.__selectionSet) === -1) {
                    _selection_.__selectionSet.push(__thisId);
                }
            });
        }
    },


    /* ******************************************************* */
    // Area Selection
    __initializeAreaSelection: function() {
        _view_.__setTouchEventsFunctionString(
            '_selection_.__setSelectionAreaPoint(this.__modelLocation);',
            '_selection_.__followAreaSelection(this.__modelLocation, _view_.__fuzzValue)',
            '_selection_.__finalizeAreaSelection();',
            '_selection_.__cancelSelection(true);'
        );
    },
    __setSelectionAreaPoint: function(__currentPoint) {
        if (_view_.__touchStartLocation) {
            if (!_selection_.__selectionAreaFirstPoint) {
                _selection_.__selectionAreaFirstPoint = __currentPoint;
            }
        }
    },
    __followAreaSelection: function( __currentPoint, _fuzzValue) {
        if (_selection_.__selectionAreaFirstPoint) {
            if (_utils_.__getDistance(_selection_.__selectionAreaFirstPoint, __currentPoint) > _fuzzValue) {
                this.__selectionArea               = _utils_.__getArea(_selection_.__selectionAreaFirstPoint, __currentPoint);
                _track_.__trackEntry(this.__moduleName, __currentPoint);
            }
        }
    },
    __finalizeAreaSelection: function() {
        $.each( _model_[_parameter_.__list], function( __thisId, __thisObject ) {
            var __itemAnchorPoints          = __thisObject.__anchorPoints;
            var __anchorPointCount          = 0;
            var __anchorPointTotal          = __itemAnchorPoints.length;
            for (var __pointIndex = 0; __pointIndex < __anchorPointTotal; __pointIndex += 1) {
                var p                     = __itemAnchorPoints[__pointIndex];
                if ((_selection_.__selectionArea.x <= p.x) && (p.x <= (_selection_.__selectionArea.x + _selection_.__selectionArea[_parameter_.__width]))) {
                    if ((_selection_.__selectionArea.y <= p.y) && (p.y <= (_selection_.__selectionArea.y + _selection_.__selectionArea[_parameter_.__height]))) {
                        __anchorPointCount     += 1;
                    }
                }
            }
            if (_selection_.__selectionArea[_parameter_.__isCrossing]) {
                if (__anchorPointCount > 0) {
                    _selection_.__addToSelectionSet(__thisId);
                }
            } else if (__anchorPointCount === __anchorPointTotal) {
                _selection_.__addToSelectionSet(__thisId);
            }
        });
        this.__cancelSelection(false);
    },

    __selectFirst: function() {
        var __modelObjectKeys                    = Object.keys(_model_[_parameter_.__list]);
        var __firstKey                           = __modelObjectKeys[0];
        this.__selectionSet                      = [__firstKey];
        _paint_.__paintEntry();
    },
    __selectLast: function() {
        var __modelObjectKeys                    = Object.keys(_model_[_parameter_.__list]);
        var __lastKey                            = __modelObjectKeys.pop();
        this.__selectionSet                      = [__lastKey];
        _paint_.__paintEntry();
    },
    __selectAnchorObjects: function() {
        this.__selectionSet                      = null;
        if (_anchor_.__anchorIds) {
            this.__selectionSet                  = $.extend(true, {}, _anchor_.__anchorIds);
        }
    },
    __addToSelectionSet: function(__thisId) {
        if (!this.__selectionSet) {
            this.__selectionSet                  = new Array();
        }
        this.__selectionSet.push(__thisId);
    },
    __selectAll: function() {
        this.__selectionSet                      = Object.keys(_model_[_parameter_.__list]);
        _paint_.__paintEntry();
    },
    __clearSelection: function() {
        this.__selectionSet                      = null;
        _paint_.__paintEntry();
    },
    __cancelSelection: function(__isDeletingSelection) {
        _view_.__resetTouchEventsFunctionString();
        this.__isSelectingMultipleObjects        = false;
        this.__selectionAreaFirstPoint           = null;
        this.__selectionArea                     = null;
        if (__isDeletingSelection) {
            this.__selectionSet                  = null;
        }
        _paint_.__paintEntry();
    },

};
