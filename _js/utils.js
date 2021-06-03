var _utils_ = {

    __moduleName:      '_utils_',
    __cadName:         'pandemi-CAD',
    __cadVersion:      '1.0',
    __cadDate:         '2020',
    __conceptor:       'Albert M Thalheim',
    __isUrlUsingHttp: (window.location.protocol.toLowerCase().indexOf('http') > -1),
    __typeToClass: {
        arc:           '_arc_',
        insert:        '_insert_',
        callout:       '_text_',
        circle:        '_circle_',
        ellipse:       '_ellipse_',
        image:         '_image_',
        insert:        '_insert_',
        line:          '_line_',
        multilineText: '_text_',
        parallelogram: '_rectangle_',
        polyline:      '_polyline_',
        polygon:       '_polyline_',
        rectangle:     '_rectangle_',
        reference:     '_insert_',
        restrictedText:'_text_',
        sketch:        '_sketch_',
        square:        '_rectangle_',
        text:          '_text_',
        trapeze:       '_rectangle_'
    },


    /* ************************************ */
    /* CANVAS PROCEDURES */
    __getCanvasId: function()                  { return $(_parameter_.__canvas)[0].id; },
    __getCanvas: function()                    { return $('#' + this.__getCanvasId()); },
    __getCanvasOffset: function()              { return this.__getCanvas().offset(); },
    __getCanvasElement: function()             { return this.__getCanvas()[0]; },
    __getCanvasContext: function(__tempCanvas) { if (__tempCanvas) {
                                                        return __tempCanvas.getContext('2d');
                                                    } else {
                                                        return this.__getCanvasElement().getContext('2d');
                                                    }
                                               },
    // Used in:
    //  modelTools: (canvas) to export images,
    //  paint:      (canvas) to store current view,
    //  print:      (canvas) to print model,
    //  template:   (script) to add template script
    //  utils:      (canvas) to get text width
    __createElementByTag: function(__tagName)  { return document.createElement(__tagName); },

    // Data structre
    //  point:   x, y
    //  area:    x, y, width, height[, rotation]
    //  arc endpoint [center]:  x, y, cx, cy

    // Build unique id in provided list:
    //   _model_[_parameter_.__list], 
    //   _model_[_parameter_.__dimension][_parameter_.__list], 
    //   _model_[_parameter_.__blocks][_parameter_.__list]
    __buildId: function(__thisList) {
        // Get last Id in thisList
        var __listKeys                             = Object.keys(__thisList);
        if (__listKeys.length > 0) {
            var __lastId                           = '';
            $.each( __listKeys, function( __index, __keyId ){
                if (__keyId > __lastId) {
                    __lastId                       = __keyId;
                }
            });
            // Build next id
            var __lastNo                           = parseInt(__lastId);
            var __nextNo                           = '000' + (__lastNo + 1);
            return __nextNo.substring(__nextNo.length - 4);
        } else {
            return '0000';
        }
    },

    
    __help: function() {
        window.open('_help/help_' + _user_[_parameter_.__language] + '.html');
    },

    __about: function() {
        alert(_messages_.__getMessage('aboutTitle')     + _parameter_.__newLine + 
              '----- ***  ' +  this.__cadName  + '  *** -----' + _parameter_.__newLine + 
              _messages_.__getMessage('aboutText')      + _parameter_.__newLine + 
              _messages_.__getMessage('aboutConceptor') + this.__conceptor + _parameter_.__newLine + 
              _messages_.__getMessage('aboutVersion')   + this.__cadVersion + _parameter_.__newLine + 
              _messages_.__getMessage('aboutDate')      + this.__cadDate);
    },


    __getObjectConstructor: function(__type) {
        var __className                            = this.__typeToClass[__type];
        return $.extend(true,{},eval(__className));
    },

    __ownsProperty: function(__thisObject, __parameterName) {
        return __thisObject.hasOwnProperty(__parameterName);
    },
    __hasXproperty: function(__thisData) {
        return __thisData.hasOwnProperty('x');
    },


    // Called from menu:
    __toggle: function(__thisVariableString) {
        eval(__thisVariableString + '=' + !eval(__thisVariableString));
        _paint_.__paintEntry();
    },


    /********************************************************************** */
    // COLORS
    // black: usual drawing color
    //  others: as per usage
    __colorList: [_parameter_.__black, _parameter_.__red, _parameter_.__blue, _parameter_.__green, _parameter_.__magenta, _parameter_.__cyan, _parameter_.__lightGray, _parameter_.__gray],
    __chooseColor: function() {
       _inputSingle_.__setPropertyChoiceInput(_parameter_.__color, this.__colorList, _user_[_parameter_.__color], true, '_utils_.__setColor(__inputValue)');
    },
    __resetColor: function() {
        _userTools_.__setUserParameter(_parameter_.__color, _parameter_.__layerOptionDefault);
    },
    __setColor: function(__colorName) {
        _userTools_.__setUserParameter(_parameter_.__color, __colorName);
    },



    /********************************************************************** */
    // LINETYPE SCALE
    __inputLineTypeScale: function() {
        _inputSingle_.__setPropertyValueInput('setLineTypeScale', _model_[_parameter_.__lineTypeScale], '_utils_.__setLineTypeScale(__inputValue)');
    },
    __setLineTypeScale: function(__data) {
        if (__data === _parameter_.__layerOptionDefault) {
            _model_[_parameter_.__lineTypeScale]                = _parameter_.__layerOptionDefault;
        } else if (isNaN(__data)) {
            _events_.__callError(this.__moduleName, _messages_.__getMessage('errorSettingLineTypeScale'));
        } else {
            var x = parseFloat(__data);
            if (x === 0.0) {
                _model_[_parameter_.__lineTypeScale]                = _parameter_.__layerOptionDefault;
            } else if (x > 0.0) {
                _model_[_parameter_.__lineTypeScale]                  = x;
                _paint_.__paintEntry();
            } else {
                _events_.__callError(this.__moduleName, _messages_.__getMessage('errorSettingLineTypeScale'));
            }
        }
    },


    /********************************************************************** */
    // OBJECT LINE SCALE
    __inputObjectLineTypeScale: function() {
        _inputSingle_.__setPropertyValueInput('setObjectLineTypeScale', _model_[_parameter_.__objectLineTypeScale], '_utils_.__setObjectLineTypeScale(__inputValue)');
    },
    __setObjectLineTypeScale: function(__data) {
        try {
            var __xData = parseFloat(__data);
            if (__xData === 0.0) {
                _model_[_parameter_.__objectLineTypeScale]      = _parameter_.__layerOptionDefault;
            } else {
                _model_[_parameter_.__objectLineTypeScale]      = __xData;
            }
        }catch(ex) {
            _events_.__callError(this.__moduleName, _messages_.__getMessage('errorSettingLineTypeScale'));
        }
    },


    /********************************************************************** */
    // LINEWIDTH
    __inputLineWidth: function() {
        _inputSingle_.__setPropertyValueInput('setLineWidth', _model_[_parameter_.__lineWidth], '_utils_.__setLineWidth(__inputValue)');
    },
    __setLineWidth: function(__data) {
        try {
            var __xData = parseFloat(__data);
            if (__xData < 0.0) {
                _events_.__callError(this.__moduleName, _messages_.__getMessage('errorSettingLinewidth'));
            } else if (__xData === 0.0) {
                _model_[_parameter_.__lineWidth]                = _parameter_.__layerOptionDefault;
            } else {
                _model_[_parameter_.__lineWidth]                = __xData;
            }
        }catch(ex) {
            _events_.__callError(this.__moduleName, _messages_.__getMessage('errorSettingLinewidth'));
        }
    },


    /********************************************************************** */
    // ROUND
    // Round factor used in location values
    __roundPrecision:               1,
    __roundFactor:                  10,
    __inputRoundFactor: function() {
        _inputSingle_.__setPropertyValueInput(_messages_.__getMessage('roundFactor'), this.__roundPrecision, '_utils_.__setRoundFactor(__inputValue)');
    },
    __setRoundFactor: function(__value) {
        try {
            this.__roundPrecision                     = parseFloat(__value);
            this.__roundFactor                        = Math.pow(10, this.__roundPrecision);
        } catch(ex) {
            _events_.__callError(this.__moduleName, ex.message);
        }
    },
    // Used in tooltip to round coordinates display
    __roundValue: function(x, __workFactor) {
        if (!__workFactor){
            __workFactor = this.__roundFactor;
        }
        return (Math.round(x * __workFactor) / __workFactor);
    },


    /********************************************************************** */
    // GET POINTS CHARACTERISTICS: distance, mid point, area
    __getDistance: function(__startPoint, __currentPoint) {
        try {
            var __xData = (__currentPoint.x - __startPoint.x);
            var __yData = (__currentPoint.y - __startPoint.y);
            return Math.sqrt((__xData * __xData) + (__yData * __yData));
        } catch(ex) {
            _events_.__callError(this.__moduleName, ex.message);
        }
    },
    __getMidPoint: function(__startPoint, __currentPoint) {
        return {
            x: (__startPoint.x + __currentPoint.x) * 0.5,
            y: (__startPoint.y + __currentPoint.y) * 0.5,
        };
    },
    __getArea: function(__startPoint, __currentPoint) {
        return{
            x:          Math.min(__currentPoint.x, __startPoint.x),
            y:          Math.min(__currentPoint.y, __startPoint.y),
            width:      Math.abs(__currentPoint.x - __startPoint.x),
            height:     Math.abs(__currentPoint.y - __startPoint.y),
            isCrossing: (__currentPoint.x < __startPoint.x),
        };
    },


    // HIT PROCEDURES
    __isPointOnArc: function(__thisObject, __thisPoint, __fuzzValue) {
        var __distanceToCenter                   = this.__getDistance(__thisPoint, __thisObject[_parameter_.__origin]);
        if (Math.abs(__thisObject[_parameter_.__radius] - __distanceToCenter) < __fuzzValue) {
            var __pointDirection                     = Math.atan2(__thisPoint.y - __thisObject[_parameter_.__origin].y, __thisPoint.x - __thisObject[_parameter_.__origin].x);
            if (__thisObject[_parameter_.__endAngle] > __thisObject[_parameter_.__startAngle]) {
                return (__thisObject[_parameter_.__startAngle] < __pointDirection) && (__pointDirection < __thisObject[_parameter_.__endAngle]);
            } else {
                return !((__thisObject[_parameter_.__endAngle] < __pointDirection) && (__pointDirection < __thisObject[_parameter_.__startAngle]));
            }
        }

    },
    __isPointOnCircle: function(__thisObject, __thisPoint, __fuzzValue) {
        var __xData = (__thisPoint.x - __thisObject[_parameter_.__origin].x);
        var __yData = (__thisPoint.y - __thisObject[_parameter_.__origin].y);
        // Test center:
        if ((Math.abs(__xData) < __fuzzValue) && (Math.abs(__yData) < __fuzzValue)) {
            return true;
        } 
        // Test radius:
        var __radius = Math.sqrt((__xData * __xData) + (__yData * __yData));
        var delta = Math.abs(__thisObject[_parameter_.__radius] - __radius);
        if (delta < __fuzzValue) {
            return true;
        }
        if (__thisObject[_parameter_.__startAngle] && __thisObject[_parameter_.__endAngle]) {
            // TODO
        }
        return false;
    },
    __isPointOnAnyAnchor: function(__thesePoints, __currentPoint, __fuzzValue) {
        for (var __pointIndex = 0; __pointIndex < (__thesePoints.length - 1); __pointIndex += 1) {
            if (this.__getDistance(__thesePoints[__pointIndex], __currentPoint) < __fuzzValue) {
                return true;
            }
        }
    },
    __isPointOnAnyVector: function(__thesePoints, __currentPoint, __fuzzValue, __isClosed) {
        for (var __pointIndex = 0; __pointIndex < (__thesePoints.length - 1); __pointIndex += 1) {
            var __point0 = __thesePoints[__pointIndex];
            var __point1 = __thesePoints[__pointIndex + 1];
            if (this.__getPointOnVector(__point0, __point1, __currentPoint, __fuzzValue)) {
                return true;
            }
        }
        if (__isClosed) {
            var __point0 = __thesePoints[__thesePoints.length - 1];
            var __point1 = __thesePoints[0];
            if (this.__getPointOnVector(__point0, __point1, __currentPoint, __fuzzValue)) {
                return true;
            }
        }
        return false;
    },
    __getPointOnVector: function(__pointA, __pointB, __pointP, __fuzzValue) {
        var __fromAtoB   = { x: __pointB.x - __pointA.x, y: __pointB.y - __pointA.y };
        var __fromAtoP   = { x: __pointP.x - __pointA.x, y: __pointP.y - __pointA.y };
        var __len      = __fromAtoB.x * __fromAtoB.x + __fromAtoB.y * __fromAtoB.y;
        var __dot      = __fromAtoP.x * __fromAtoB.x + __fromAtoP.y * __fromAtoB.y;
        var __dotToLen = (__dot / __len);
        if ((__dotToLen >= 0.0) && (__dotToLen <= 1.0)) {
            var __pointQ = { x: __pointA.x + __fromAtoB.x * __dotToLen, y: __pointA.y + __fromAtoB.y * __dotToLen};
            if (__fuzzValue) {
                if (this.__getDistance(__pointP, __pointQ) <= __fuzzValue) {
                    return __pointQ;
                }
            } else {
                return __pointQ;
            }
        }
    },
    __getPointPerpendicularToVector: function(__pointA, __pointB, __pointP) {
        var __fromAtoB   = { x: __pointB.x - __pointA.x, y: __pointB.y - __pointA.y };
        var __fromAtoP   = { x: __pointP.x - __pointA.x, y: __pointP.y - __pointA.y };
        var __len    = __fromAtoB.x * __fromAtoB.x + __fromAtoB.y * __fromAtoB.y;
        var __dot    = __fromAtoP.x * __fromAtoB.x + __fromAtoP.y * __fromAtoB.y;
        var __dotToLen     = (__dot / __len);
        if ((__dotToLen >= 0.0) && (__dotToLen <= 1.0)) {
            return { x: __pointA.x + __fromAtoB.x * __dotToLen, y: __pointA.y + __fromAtoB.y * __dotToLen};
        }
    },
    __isPointInRectangle: function(__thisArea, __thisPoint) {
        var __pointB                              = {x:__thisArea.x, y: __thisArea.y};
        var __pointA                             = this.__setDirectionPoint(__pointB, __thisArea[_parameter_.__rotation],                   __thisArea[_parameter_.__width]);
        var __pointC                             = this.__setDirectionPoint(__pointB, (__thisArea[_parameter_.__rotation] + Math.PI * 0.5), __thisArea[_parameter_.__height]);
        var __AB                                 = this.__vector(__pointA, __pointB);
        var __AM                                 = this.__vector(__pointA, __thisPoint);
        var __BC                                 = this.__vector(__pointB, __pointC);
        var __BM                                 = this.__vector(__pointB, __thisPoint);
        var __dotABAM = this.__dot(__AB, __AM);
        var __dotABAB = this.__dot(__AB, __AB);
        var __dotBCBM = this.__dot(__BC, __BM);
        var __dotBCBC = this.__dot(__BC, __BC);
        return ((0 <= __dotABAM) && (__dotABAM <= __dotABAB) && (0 <= __dotBCBM) && (__dotBCBM <= __dotBCBC));
    },
    __vector: function(__point1, __point2) {
        return {
                x: (__point2.x - __point1.x),
                y: (__point2.y - __point1.y),
        };
    },
    __dot: function(__uPoint, __vPoint) {
        return __uPoint.x * __vPoint.x + __uPoint.y * __vPoint.y; 
    },


        //P,L,A
    __setDirectionPoint: function(__point, __direction, __distance) {
        return  {
            x: (__point.x + (__distance * Math.cos(__direction))), 
            y: (__point.y + (__distance * Math.sin(__direction))),
        };
    },
        //P,P,A
    __getAbsolutePoint: function(__origin, __vector, __direction) {
        return {
                    x: (__origin.x + ((__vector.x * Math.cos(__direction)) - (__vector.y * Math.sin(__direction)))),
                    y: (__origin.y + ((__vector.x * Math.sin(__direction)) + (__vector.y * Math.cos(__direction)))),
               };
    },


        // Called from: 'inputSingle' and 'inputMultiple' modules
    __checkPointFromInput: function(__data) {
        if ((__data.indexOf(',') === -1) && (__data.indexOf('<') === -1)) return null;
        if ((__data === '@') && (_view_.__lastTouchLocation)) {
            return _view_.__lastTouchLocation;
        } else if ((__data.indexOf('@') === 0) && (_view_.__lastTouchLocation)) {
            var __point0                     = this.__getPointFromText(__data.substring(1)); 
            __point0.x                      += _view_.__lastTouchLocation.x;
            __point0.y                      += _view_.__lastTouchLocation.y;
            return __point0;
        } else {
            return this.__getPointFromText(__data); 
        }
    },
    __getPointFromText: function(__data) {
        try {
            var __point0                     = {};
            if (__data.indexOf(',') > -1) {
                var __splitString            = __data.split(',');
                if (isNaN(__splitString[0])) {
                    _events_.__callError(this.__moduleName, _messages_.__getMessage('invalidEntry'));
                    return null;
                }
                if (isNaN(__splitString[1])) {
                    _events_.__callError(this.__moduleName, _messages_.__getMessage('invalidEntry'));
                    return null;
                }
                __point0.x                   = parseFloat(__splitString[0]);
                __point0.y                   = parseFloat(__splitString[1]);
            } else {
                var __splitString            = __data.split('<');
                if (isNaN(__splitString[0])) {
                    _events_.__callError(this.__moduleName, _messages_.__getMessage('invalidEntry'));
                    return null;
                }
                if (isNaN(__splitString[1])) {
                    _events_.__callError(this.__moduleName, _messages_.__getMessage('invalidEntry'));
                    return null;
                }
                __length                     = parseFloat(__splitString[0]);
                __directionAngle             = parseFloat(__splitString[1]);
                var __direction              = ((__directionAngle / 180.0) * Math.PI);
                __point0.x                   = (Math.cos(__direction) * __length);
                __point0.y                   = (Math.sin(__direction) * __length);
            }
            return __point0;
        } catch (exception) {
            _events_.__callError(this.__moduleName, _messages_.__getMessage('invalidEntry'));
            return null;
        }
    },
    __getLengthFromData: function(__data, __origin) {
        if (this.__hasXproperty(__data, 'x')) {
            return this.__getDistance(__origin, __data);
        } else {
            return __data;
        }
    },
    __getDirectionFromData: function(__data, __origin) {
        if (this.__hasXproperty(__data,'x')) {
            return Math.atan2((__data.y - __origin.y), (__data.x - __origin.x));
        } else {
            return (__data / 180.0) * Math.PI;
        }
    },


    __buildRegularPolygon: function(__thisObject, __currentPoint, __deltaX, __deltaY) {
        var __apex                                  = __currentPoint;
        if (__thisObject[_parameter_.__points].length === 1) {
            __apex                                  = __thisObject[_parameter_.__points][0];
        }
        var __direction                             = Math.atan2((__apex.y - __thisObject[_parameter_.__origin].y), (__apex.x - __thisObject[_parameter_.__origin].x));
        if (__thisObject[_parameter_.__rotation]) {
            __direction                             = __thisObject[_parameter_.__rotation];
        }
        var __unitLength                            = this.__getDistance(__thisObject[_parameter_.__origin], __apex);
        var __polygonPoints                         = [];
        var __sideIndex                             = 0;
        if (__thisObject[_parameter_.__option] === _polyline_.__centerOption) {
            for (var __sideIndex = 0; __sideIndex < __thisObject[_parameter_.__sideCount]; __sideIndex += 1) {

                __polygonPoints.push(this.__setDirectionPoint(__thisObject[_parameter_.__origin], __direction + ((Math.PI * 2.0)  * (__sideIndex / __thisObject[_parameter_.__sideCount])), __unitLength));
            }
        } else {
            __polygonPoints.push(__thisObject[_parameter_.__origin]);
            for (var __sideIndex = 0; __sideIndex < (__thisObject[_parameter_.__sideCount] - 1); __sideIndex += 1) {
                var __corner                        = this.__setDirectionPoint(__polygonPoints[__polygonPoints.length - 1], __direction + ((Math.PI * 2.0)  * (__sideIndex / __thisObject[_parameter_.__sideCount])), __unitLength);
                __polygonPoints.push(__corner);
            }
        }
        // Apply delta:
        for (var __pointIndex = 0; __pointIndex < __polygonPoints.length; __pointIndex += 1) {
            __polygonPoints[__pointIndex] =  this.__addDelta(__polygonPoints[__pointIndex], __deltaX, __deltaY);
        }
        return __polygonPoints;
    },
    __addDelta: function(__thisPoint, __deltaX, __deltaY) {
        var __newPoint                              = {x:__thisPoint.x + __deltaX, y:__thisPoint.y + __deltaY};
        if (__thisPoint[_parameter_.__centerX]) {
            __newPoint[_parameter_.__centerX]       = __thisPoint[_parameter_.__centerX];
            __newPoint[_parameter_.__centerY]                           = __thisPoint[_parameter_.__centerY];
            __newPoint[_parameter_.__ccw]           = __thisPoint[_parameter_.__ccw];
        }
        return __newPoint;
    },

    __getCenterFromThreePoints: function(__pointA, __pointB, __pointC) {
        var __center                             = {x:0, y:0};
        var __aSlope                             = ((__pointB.y - __pointA.y) / (__pointB.x - __pointA.x));
        var __bSlope                             = ((__pointC.y - __pointB.y) / (__pointC.x - __pointB.x));
        __center.x                               = (__aSlope * __bSlope * (__pointA.y - __pointC.y) + __bSlope * (__pointA.x + __pointB.x) - __aSlope * (__pointB.x + __pointC.x) )/(2* (__bSlope - __aSlope) );
        __center.y                               = -1*(__center.x - (__pointA.x + __pointB.x)/2) / __aSlope +  (__pointA.y + __pointB.y)/2;
        __center[_parameter_.__ccw]              = this.__isCCW(__pointA, __pointB, __pointC);
        return __center;
    },


    // OBJECT PROCEDURES
    // - Move (keep all hidden properties)
    __movePoint: function(__currentPoint, __displacement) {
        var newPoint                             = $.extend(true,{},__currentPoint);
        newPoint.x                               = (__currentPoint.x + __displacement.x);
        newPoint.y                               = (__currentPoint.y + __displacement.y);
        return newPoint;
    },


    // - Mirror
    __mirrorPoint: function(__point0, __point1, __pointToMirror) {
        var __mirrorDirection                      = Math.atan2(__point1.y - __point0.y, __point1.x - __point0.x);
        var __perpendicularDirection               = __mirrorDirection + (Math.PI * 0.5);
        var __perpendicularPoint                   = this.__setDirectionPoint(__pointToMirror, __perpendicularDirection, 1.0);
        var __pointOnMirror                        = this.__getIntersectionPoint(__point0, __point1, __pointToMirror, __perpendicularPoint);
        var __distanceToMirror                     = this.__getDistance(__pointToMirror, __pointOnMirror);
        var __directionToMirror                    = Math.atan2((__pointOnMirror.y - __pointToMirror.y), (__pointOnMirror.x - __pointToMirror.x));
        return this.__setDirectionPoint(__pointOnMirror, __directionToMirror, __distanceToMirror);
    },


    // - Rotate
    __rotatePoint: function(__currentPoint, __thisAnchorPoint, __thisAngle) {
        var __anchorToPointDistance                = this.__getDistance(__currentPoint, __thisAnchorPoint);
        var __anchorToPointDirection               = Math.atan2((__currentPoint.y - __thisAnchorPoint.y), (__currentPoint.x - __thisAnchorPoint.x));
        var __newDirectionToPoint                  = (__anchorToPointDirection + __thisAngle);
        return this.__setDirectionPoint(__thisAnchorPoint, __newDirectionToPoint, __anchorToPointDistance);
    },


    // - Scale: private procedure to scale single point coordinates.
    __scalePoint: function(__point, __currentPoint, __thisScale) {
        var __deltaX                             = (__thisScale * (__point.x - __currentPoint.x));
        var __deltaY                             = (__thisScale * (__point.y - __currentPoint.y));
        return {x:(__currentPoint.x + __deltaX), y:(__currentPoint.y + __deltaY)};
    },


        // Procedure to get point nearest to 'from' parameter
    __getNearestPoint: function(__points, __currentPoint) {
        var __refIndex            = -1;
        var __refDistance         = 1000.0;
        for (var __pointIndex = 0; __pointIndex < __points.length; __pointIndex += 1) {
            var p               = __points[__pointIndex];
            var d               = Math.abs((__currentPoint.x - p.x) * (__currentPoint.y - p.y));
            if (d < __refDistance) {
                __refDistance     = d;
                __refIndex        = __pointIndex;
            }
        }
        return __refIndex;
    },

    __getTextWidth: function( __fontName, __fontSize, __textString) {
        var __canvasElement                        = this.__createElementByTag([_parameter_.__canvas]);
        var __canvasContext                        = __canvasElement.getContext("2d");
        __canvasContext[_parameter_.__font]        = __fontSize + _parameter_.__pxSpace + __fontName;
        var __metrics                              = __canvasContext.measureText(__textString);
        return __metrics[_parameter_.__width];
    },


    __getChamferOfFilletIntersection: function(__thisObject0, __thisObject1) {
        
    },


    __getIntersectionPoint: function(__pointA, __pointC, __pointP, __pointR) {
        var __det = (__pointC.x - __pointA.x) * (__pointR.y - __pointP.y) - (__pointR.x - __pointP.x) * (__pointC.y - __pointA.y);
        if (__det === 0) {
            return;
        } else {
            // First segment
            var __gamma  = ((__pointA.y - __pointC.y) * (__pointR.x - __pointA.x) + (__pointC.x - __pointA.x) * (__pointR.y - __pointA.y)) / __det;
            // Second segment
            var __lambda = ((__pointR.y - __pointP.y) * (__pointR.x - __pointA.x) + (__pointP.x - __pointR.x) * (__pointR.y - __pointA.y)) / __det;
            return {
                x:        __pointA.x + ((__pointC.x-__pointA.x) * __lambda),
                y:        __pointA.y + ((__pointC.y-__pointA.y) * __lambda),
                onFirst:  ((0 < __gamma)  && (__gamma < 1)),
                onSecond: ((0 < __lambda) && (__lambda < 1)),
            };
        }
    },

    // Polyline 3-point arc option:
    __computeCenterFromStartEndPoints: function(__thisObject, __currentPoint) {
        try {
            var __startPoint   = __thisObject[_parameter_.__origin];
            if (__thisObject[_parameter_.__points].length > 0) {
                __startPoint   = __thisObject[_parameter_.__points][__thisObject[_parameter_.__points].length - 1];
            }
            var __directionStartToEnd                  = Math.atan2(__currentPoint.y - __startPoint.y, __currentPoint.x - __startPoint.x);
            if (__directionStartToEnd === __startPoint[_parameter_.__direction]) {
                return;
            }
            if (__directionStartToEnd < 0.0) {
                __directionStartToEnd                 += (Math.PI * 2.0);
            }
            var __deltaDirectionToEnd                  = (__directionStartToEnd - __startPoint[_parameter_.__direction]);
            if (__deltaDirectionToEnd > Math.PI) {
                __deltaDirectionToEnd                 -= (Math.PI * 2.0);
            }
            // At this point, angle is evaluated relative to original direction, positive is CCW
            var __directionFromStartToCenter           = __startPoint[_parameter_.__direction] +  (Math.PI * 0.5 * Math.sign(__deltaDirectionToEnd));
            var __alpha                                = (__deltaDirectionToEnd - (Math.PI * 0.5));
            var __distanceStartToEnd                   = this.__getDistance(__currentPoint, __startPoint);
            var __halfDistanceStartToEnd               = (__distanceStartToEnd * 0.5);
            var __radius                               = (__halfDistanceStartToEnd / Math.cos(__alpha));
            var __directionFromStartToCenter           = __startPoint[_parameter_.__direction] + (Math.PI * 0.5);
            var __center                               = this.__setDirectionPoint(__startPoint, __directionFromStartToCenter, __radius);
            __center[_parameter_.__ccw]                = (__deltaDirectionToEnd < 0.0);
            return __center;
        } catch (ex) {
            alert(ex.message);
        }
    },

    // To determine which side of the line from A=(x1,y1) to B=(x2,y2) a point P=(x,y) falls on you need to compute the value:-
    // d=(x−x1)(y2−y1)−(y−y1)(x2−x1)
    // If d<0 then the point lies on one side of the line, and if d>0 then it lies on the other side. If d=0 then the point lies exactly line.
    __getWhichSide: function(__point1, __point2, __thisPoint) {
       return ((__thisPoint.x - __point1.x) * (__point2.y - __point1.y)) - ((__thisPoint.y - __point1.y) * (__point2.x - __point1.x));
    },
    __isCCW: function(__point1, __point2, __thisPoint) {
        return (this.__getWhichSide(__point1, __point2, __thisPoint) > 0.0);
    },

    __encodeString: function(__string) {
        return btoa(__string)
    },
    __decodeString: function(__string) {
        return atob(__string);
    },

};
