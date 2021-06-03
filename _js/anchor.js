var _anchor_ = {

    __moduleName:                                          '_anchor_',
    __isSnapToAnchor:                                      false,
    // Reference to object's anchor points:

    __anchorIds:                                           null,
    __anchorObjectId:                                      null,
    __anchorObject:                                        null,
//    __anchorPoints:                                        null,
    __anchorObjectPointIndex:                              null,
    __anchorObjectPoint:                                   null,
    __anchorPerpendicularPoint:                            null,
    __anchorIntersectionPoint:                             null,
    
    // Once object selected from anchor point:
    __editObjectPointIndex:                                null,
    __editObjectPoint:                                     null,
    __editObjectId:                                        null,
    __editObject:                                          null,
    __thisConstructor:                                     null,

    // ANCHORS PROCEDURES
    // Processed from view '__processTouchMove' to identify objects nearest pointer
    __getAnchorObjects: function(__currentPoint, __fuzzValue) {
        if (!_modelTools_.__isListStarted(_model_)) return;
        this.__resetAnchorProperties();
        $.each( _model_[_parameter_.__list], function( __thisId, __thisObject ) {
            var __thisConstructor                          = _utils_.__getObjectConstructor(__thisObject[_parameter_.__type]);
            if (__thisConstructor.__isHitByPointer(__thisObject, __currentPoint, __fuzzValue)) {
                if (!_anchor_.__anchorIds) {
                    _anchor_.__anchorIds               = [];
                }
                _anchor_.__anchorIds.push(__thisId);
            }
        });
        if (this.__anchorIds) {
            $.each( this.__anchorIds, function( __index , __thisId ) {
                var __thisObject                           = _modelTools_.__getObjectById(__thisId);
                if (_anchor_.__getNearestAnchorObject(__thisId, __thisObject, __currentPoint, __fuzzValue)) {
                    return false;
                }
            });
            if (this.__anchorIds.length > 1) {
                $.each( this.__anchorIds, function( __index, __thisId0 ) {
                    var __thisObject0                      = _model_[_parameter_.__list][__thisId0];
                    $.each( _anchor_.__anchorIds, function( __index0, __thisId1 ) {
                        if (__thisId1 !== __thisId0) {
                            var __thisObject1              = _model_[_parameter_.__list][__thisId1];
                            // Points from first object
                            var __pointIndex0              = 0;
                            var __pointIndex1              = 0;
                            for (var __pointIndex0 = 0; __pointIndex0 <= (__thisObject0.__anchorPoints.length - 2); __pointIndex0 += 1) {
                                var __point00              = __thisObject0.__anchorPoints[__pointIndex0];
                                var __point01              = __thisObject0.__anchorPoints[__pointIndex0 + 1];
                                for (var __pointIndex1 = 0; __pointIndex1 <= (__thisObject1.__anchorPoints.length - 2); __pointIndex1 += 1) {
                                    var __point10          = __thisObject1.__anchorPoints[__pointIndex1];
                                    var __point11          = __thisObject1.__anchorPoints[__pointIndex1 + 1];
                                    _anchor_.__anchorIntersectionPoint  = _utils_.__getIntersectionPoint(__point00, __point01, __point10, __point11);
                                    if (_anchor_.__anchorIntersectionPoint) {
                                        return false;
                                    }
                                }
                            }
                        }
                    });
                    if (_anchor_.__anchorIntersectionPoint) {
                        return false;
                    }
                });
            }
            // Tangent?
        }
    },
    __getNearestAnchorObject: function(__thisId, __thisObject, __currentPoint, __fuzzValue) {
        $.each( __thisObject.__anchorPoints, function( __pointIndex, __thisPoint ) {
            if (__thisPoint[_parameter_.__width]) {
                if (_utils_.__isPointInRectangle(__thisPoint, __currentPoint)) {
                    _anchor_.__setAnchorObject(__thisId, __thisObject, __pointIndex);
                    return false;
                }
            } else {
                if (_utils_.__getDistance(__thisPoint, __currentPoint) < __fuzzValue) {
                    _anchor_.__setAnchorObject(__thisId, __thisObject, __pointIndex);
                    return false;
                }
            }
        });
        return (this.__anchorObject !== null);
    },
    __setAnchorObject: function(__thisId, __thisObject, __index) {
        this.__anchorObjectId                              = __thisId;
        this.__anchorObject                                = __thisObject;
        this.__anchorObjectPointIndex                      = __index;
        this.__anchorObjectPoint                           = __thisObject.__anchorPoints[__index];
    },

    // Called from view __processTouchStart when a single __anchorObject is set
    //  and no active input
    // To select this object for edition
    __setEditObject: function() {
        this.__editObject                                  = this.__anchorObject;
        this.__editObjectId                                = this.__anchorObjectId;
        this.__editObjectPoint                             = this.__anchorObjectPoint;
        this.__editObjectPointIndex                        = this.__anchorObjectPointIndex;
        _view_.__setTouchEventsFunctionString(
            '',
            '_track_.__trackEntry(_anchor_.__moduleName, _view_.__modelLocation);',
            '_anchor_.__finalizeAnchorEditEntry(_view_.__modelLocation);',
            '_anchor_.__resetEditObjectProperties();'
        );
    },

    __finalizeAnchorEditEntry: function(__currentPoint) {
        _view_.__resetTouchEventsFunctionString();
        var __thisConstructor                              = _utils_.__getObjectConstructor(this.__editObject[_parameter_.__type]);
        __thisConstructor.__anchorEdit(this.__editObject, this.__editObjectPointIndex, __currentPoint);
        if ($('#multipleInputDiv')) {
            _inputMultiple_.__updateMultipleInputTable();
        }
        this.__resetEditObjectProperties();
    },

    __resetEditObjectProperties: function() {
        this.__editObject                                  = null;
        this.__editObjectId                                = null;
        this.__editObjectPoint                             = null;
        this.__editObjectPointIndex                        = null;
        this.__resetAnchorProperties();
    },
    __resetAnchorProperties: function() {
        this.__anchorIds                                   = null;
        this.__anchorObject                                = null;
        this.__anchorObjectId                              = null;
        this.__anchorObjectPoint                           = null;
        this.__anchorObjectPointIndex                      = null;
        this.__anchorPerpendicularPoint                    = null;
        _paint_.__paintEntry();
    },

};
