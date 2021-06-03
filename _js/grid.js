var _grid_ = {
   
    __moduleName:          '_grid_',
    __isGridVisible:       false,
    __isSnapToGrid:        false,

    __gridColor:           _parameter_.__blue,

    __gridOrigin:          {x:0, y:0},
    __gridWidth:           3000,
    __gridHeight:          2000,
    __gridXspacing:        150,
    __gridYspacing:        100,
    __gridCountX:          20,
    __gridCountY:          20,
    __gridDotSize:         1,

    //  Edit parameters:


    __initialize: function() {
        var __message                              = _messages_.__getMessage(this.__moduleName);
        var __parameters = {
            __parameterNames:  ['__isGridVisible',                  '__isSnapToGrid',                   _parameter_.__origin,             _parameter_.__width,                _parameter_.__height,               'spacingX',                         'spacingY',                         _parameter_.__color],
            __parameterTypes:  [_parameter_.__parameterTypeBoolean, _parameter_.__parameterTypeBoolean, _parameter_.__parameterTypePoint, _parameter_.__parameterTypeNumeric, _parameter_.__parameterTypeNumeric, _parameter_.__parameterTypeNumeric, _parameter_.__parameterTypeNumeric, '_utils_.__colorList'],
            __parameterValues: [_grid_.__isGridVisible,             _grid_.__isSnapToGrid,              _grid_.__gridOrigin,              _grid_.__gridWidth,                 _grid_.__gridHeight,                _grid_.__gridXspacing,              _grid_.__gridYspacing,              _grid_.__gridColor]
        };
        _inputMultiple_.__setMultipleInput(__message, __parameters, _grid_, '_grid_.__setGridFollow(__parameterValues)');
    },
    
    __setGridFollow: function(__parameterValues) {
        this.__gridOrigin                        = __parameterValues[_parameter_.__origin];
        this.__gridWidth                         = __parameterValues[_parameter_.__width];
        this.__gridHeight                        = __parameterValues[_parameter_.__height];
        this.__gridXspacing                      = __parameterValues[_parameter_.__spacingX];
        this.__gridYspacing                      = __parameterValues[_parameter_.__spacingY];
        this.__gridColor                         = __parameterValues[_parameter_.__color];
        this.__isGridVisible                     = __parameterValues.__isGridVisible;
        this.__isSnapToGrid                      = __parameterValues.__isSnapToGrid;
        this.__setGridXandYcounts()
    },

    __setGridToModel: function() {
        this.__gridOrigin.x                      = _model_[_parameter_.__limits].x;
        this.__gridOrigin.y                      = _model_[_parameter_.__limits].y;
        this.__gridWidth                         = _model_[_parameter_.__limits][_parameter_.__width];
        this.__gridHeight                        = _model_[_parameter_.__limits][_parameter_.__height];
        this.__gridXspacing                      = Math.ceil(this.__gridWidth / 20.0);
        this.__gridYspacing                      = Math.ceil(this.__gridHeight / 20.0);
        this.__setGridXandYcounts();
    },

    __setGridXandYcounts: function() {
        this.__gridCountX                        = Math.ceil(this.__gridWidth / this.__gridXspacing);
        this.__gridCountY                        = Math.ceil(this.__gridHeight / this.__gridYspacing);
    },

    __setGridDotSize: function() {
        this.__gridDotSize                       = (1.0 / _view_.__area[_parameter_.__scale]);
    },

};
