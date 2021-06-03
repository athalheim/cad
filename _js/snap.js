var _snap_ = {
    
    __moduleName:          '_snap_',

    __isOrthoModeActive:   false,
    __isPerpendicular:     false,
    __isTangent:           false,
    __isIntersection:      false,
    // Dummy:
    __parameterValues:     null,

    //  Edit parameters:
    __parameters: {
        __parameterNames:  ['__isSnapToAnchor',                 '__isSnapToGrid',                   '__isOrthoModeActive',              '__isPerpendicular',                '__isTangent',                      '__isIntersection'],
        __parameterTypes:  [_parameter_.__parameterTypeBoolean, _parameter_.__parameterTypeBoolean, _parameter_.__parameterTypeBoolean, _parameter_.__parameterTypeBoolean, _parameter_.__parameterTypeBoolean, _parameter_.__parameterTypeBoolean],
        __parameterValues: ['_anchor_.__isSnapToAnchor',        '_grid_.__isSnapToGrid',            '_snap_.__isOrthoModeActive',       '_snap_.__isPerpendicular',         '_snap_.__isTangent',               '_snap_.__isIntersection'],
    },

    __initialize: function() {
        var __snapObject                         = {
                                                        __isSnapToAnchor:  _anchor_.__isSnapToAnchor,
                                                        __isSnapToGrid:    _grid_.__isSnapToGrid,
                                                        __isPerpendicular: this.__isPerpendicular,
                                                        __isTangent:       this.__isTangent,
                                                   };
        var __message                            = _messages_.__getMessage(this.__moduleName);
        _inputMultiple_.__setMultipleInput(__message, this.__parameters, __snapObject, '_snap_.__setSnapFollow(__parameterValues)');
    },
    __setSnapFollow: function(__parameterValues) {
        _anchor_.__isSnapToAnchor                = __parameterValues.__isSnapToAnchor;
        _grid_.__isSnapToGrid                    = __parameterValues.__isSnapToGrid;
        if (_grid_.__isSnapToGrid === true) {
            _grid_.__isGridVisible               = true;
            _paint_.__paintEntry();
        }
        this.__isOrthoModeActive                 = __parameterValues.__isOrthoModeActive;
        this.__isPerpendicular                   = __parameterValues.__isPerpendicular;
        this.__isTangent                         = __parameterValues.__isTangent;
        this.__isIntersection                    = __parameterValues.__isIntersection;
    },

};
