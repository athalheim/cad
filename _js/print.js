var _print_ = {

    __moduleName:      '_print_',
    // NOTE: All formats landscape, using metric values
    __printFormats: {
        // Imperial
        letter:{  width:  279,  height: 216 },
        legal:{   width:  356,  height: 216 },
        tabloid:{ width:  432,  height: 279 },
        // Metric
        A4:{      width:  297,  height: 210 },
        A3:{      width:  420,  height: 297 },
        A2:{      width:  594,  height: 420 },
        A1:{      width:  841,  height: 594 },
        A0:{      width:  1088, height: 841 }
    },
    __printMargins: { left: 20, right: 10, top: 10, bottom: 10 },
    __penSizes: [0.1, 0.13, 0.18, 0.25, 0.35, 0.5, 0.7, 1.0, 1.4, 2.0],

    __printDocument: function() {
        _inputSingle_.__setPropertyChoiceInput(this.__moduleName, Object.keys(this.__printFormats), null, false, '_print_.__printFollow(__inputValue)');
     },
        // Called from 'input_list'
    __printFollow: function(__printFormatName) {
        // Current print parameters
        var __printFormat                        = this.__printFormats[__printFormatName];
        var __printWidth                         = (__printFormat[_parameter_.__width]  - (this.__printMargins[_parameter_.__left] + this.__printMargins[_parameter_.__right]));
        var __printHeight                        = (__printFormat[_parameter_.__height] - (this.__printMargins[_parameter_.__top]  + this.__printMargins[_parameter_.__bottom]));
            // Prepare canvas
        var __printCanvas                        = _utils_.__createElementByTag([_parameter_.__canvas]);
        // Scale is fixed at 200dpi / 8dpm
        __printWidth                            *= 8;
        __printHeight                           *= 8;
        if (_model_[_parameter_.__limits][_parameter_.__width] > _model_[_parameter_.__limits][_parameter_.__height]) {
            // Horizontal model:
            __printCanvas[_parameter_.__width]                  = __printWidth;
            __printCanvas[_parameter_.__height]                 = __printHeight;
        } else {
            // Vertical model: invert dimensions;
            __printCanvas[_parameter_.__width]                  = __printHeight;
            __printCanvas[_parameter_.__height]                 = __printWidth;
        }
            // Prepare image
        _paint_.__paintEntry(__printCanvas);
    }

};
