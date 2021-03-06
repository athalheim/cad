var _parameter_ = {
    // The purpose of this object is to centralize property names
    __action:               'action',
    __arrow:                'arrow',
    __arrowBaseLeft:        'arrowBaseLeft',
    __arrowBaseRight:       'arrowBaseRight',
    __attribute:            'attribute',
    __backTo:               'backTo',
    __base64:               'base64',
    __baseUnit:             'baseUnit',
    __bend:                 'bend',
    __blocks:               'blocks',
    __bulgePoint:           'bulgePoint',
    __canvas:               'canvas',
    __canvasContext:        'canvasContext',
    __ccw:                  'ccw',
    __center:               'center',
    __centerX:              'cx',
    __centerY:              'cy',
    __chamfer:              'chamfer',
    __colonSpace:           ': ',
    __color:                'color',
    __content:              'content',
    __dataError:            'dataError',
    __defaultTemplateName:  'defaultTemplateName',
    __defaultTemplateScale: 'defaultTemplateScale',
    __description:          'description',
    __dimension:            'dimension',
    __dimensionColor:       'dimensionColor',
    __dimensionFontName:    'dimensionFontName',
    __dimensionFontSize:    'dimensionFontSize',
    __dimensionLocation:    'dimensionLocation',
    __direction:            'direction',
    __endAngle:             'endAngle',
    __endPoint:             'endPoint',
    __error:                'error',
    __filename:             'filename',
    __fillStyle:            'fillStyle',
    __firstCorner:          'firstCorner',
    __firstLength:          'firstLength',
    __font:                 'font',
    __fontName:             'fontName',
    __fontSize:             'fontSize',
    __fontStyle:            'fontStyle',
    __fontStyleName:        'fontStyleName',
    __fontStyles:           'fontStyles',
    __fontWeight:           'fontWeight',
    __formats:              'formats',
    __hAlign:               'hAlign',
    __height:               'height',
    __id:                   'id', 
    __img:                  'img',
    __isCrossing:           'isCrossing',
    __isDisplayed:          'isDisplayed',
    __isPrintable:          'isPrintable',
    __isPullWheelToZoomIn:  'isPullWheelToZoomIn',
    __items:                'items',
    __language:             'language',
    __layer:                'layer',
    __layerName:            'layerName',
    __layers:               'layers',
    __limits:               'limits',
    __lineType:             'lineType',
    __lineTypeName:         'lineTypeName',
    __lineTypes:            'lineTypes',
    __lineTypeScale:        'lineTypeScale',
    __lineWidth:            'lineWidth',
    __list:                 'list',
    __modelList:            'modelList',
    __name:                 'name',
    __newLine:              '\n',
    __none:                 'none',
    __nextPoint:            'nextPoint',
    __nextPointLinear:      'nextPointLinear',
    __nextPointArcBulge:    'nextPointArcBulge',
    __nextPointArcCenter:   'nextPointArcCenter',
    __nextPointArcSecond:   'nextPointArcSecond',
    __nextPointArcEnd:      'nextPointArcEnd',
    __objectLineTypeScale:  'objectLineTypeScale',
    __onFirst:              'onFirst',
    __onSecond:             'onSecond',
    __penSize:              'penSize',
    __polygonPoints:        'polygonPoints',
    __option:               'option',
    __origin:               'origin',
    __points:               'points',
    __radius:               'radius',
    __radiusPoint:          'radiusPoint',
    __rotation:             'rotation',
    __scale:                'scale',
    __secondLength:         'secondLength',
    __side:                 'side',
    __sideCount:            'sideCount',
    __spacingX:             'spacingX',
    __spacingY:             'spacingY',
    __startAngle:           'startAngle',
    __strokeStyle:          'strokeStyle',
    __subMenu:              'subMenu',
    __summit:               'summit',
    __template:             'template',
    __templateName:         'templateName',
    __templateScale:        'templateScale',
    __title:                'title',
    __Title:                'Title',
    __toggle:               'toggle',
    __topBaseUnitCount:     'topBaseUnitCount',
    __topUnit:              'topUnit',
    __trackColor:           'trackColor',
    __type:                 'type',
    __units:                'units',
    __url:                  'url', 
    __vAlign:               'vAlign',
    __vector:               'vector',
    __width:                'width', 
    __xRadius:              'xRadius',
    __xScale:               'xScale', 
    __yRadius:              'yRadius',
    __yScale:               'yScale',

// HTML attributes
    __dataName:             'data-name',
    __dataType:             'data-type',
    
// CSS parameters
    __dataTooltip:          'data-tooltip',
    __textBaseline:         'textBaseline',
    __textAlign:            'textAlign',

// Color parameters
    __darkRed:              'darkRed',
    __black:                'black',
    __red:                  'red',
    __blue:                 'blue',
    __green:                'green', 
    __magenta:              'magenta', 
    __cyan:                 'cyan', 
    __lightGray:            'lightGray', 
    __gray:                 'gray',
        

    // EDIT
    // copy, move, etc...
    __fromPoint:            'fromPoint',
    __toPoint:              'toPoint',

    // extend, mirror
    __firstPoint:           'firstPoint',
    __secondPoint:          'secondPoint',
    __thirdPoint:           'thirdPoint',

    __firstCorner:          'firstcorner',
    __secondCorner:         'secondCorner',
    __oppositeCorner:       'oppositeCorner',

    // offset
    __offsetPoint:          'offsetPoint',
    __offset:               'offset',
    // rotate
    __pivotPoint:           'pivotPoint', 
    __startDirection:       'startDirection', 
    __endDirection:         'endDirection',
    // scale (with fromPoint and toPoint)
    __anchorPoint:          'anchorPoint',
    __scale:                'scale', 

    __sidePoint:            'sidePoint',

    __layerOption:          'layerOption',
    __layerOptionDefault:   '(L)',

    __firstObject:          'firstObject',
    __secondObject:         'secondObject',

    __intersectionPoint:    'intersectionPoint',
    __tangentPoint:         'tangentPoint',
    __perpendicularPoint:   'perpendicularPoint',

    __parameterTypePoint:   'p',
    __parameterTypeNumeric: 'n',
    __parameterTypeBoolean: 'b',
    __parameterTypeString:  's',

    // TEXT properties
    //   Default properties
    __alphabetic:           'alphabetic',
    __start:                'start',
    //   Horizontal alignment
    __left:                 'left',
    // __center: already defined
    __right:                'right',
    __end:                  'end',
    //   Vertical alignment
    __top:                  'top',
    __middle:               'middle',
    __bottom:               'bottom',

    __regular:              'regular',
    __bold:                 'bold',
    __italic:               'italic',
    __boldItalic:           'bolditalic',
    __pxSpace:              'px ',
    __space:                ' ',

    // ARRAY
    //  array object
    __array:                'array',
    //  Style(while construction) 
    __arrayStyle:           'arrayStyle',
    __arrayStylePolar:      'arrayPolar',
    __arrayStyleRectangular: 'arrayRectangular',
    //  Mode (while construction)
    __arrayObjectsMode:     'arrayObjectsMode',
    __arrayObjectsModeSingle:   'arrayObjectsModeSingle',
    __arrayObjectsModeSeparate: 'arrayObjectsModeSeparate',
    //  Array parameters
    //  -Polar:
    __arrayCenter:          'arrayCenter',
    __arrayCount:           'arrayCount',
    __arrayFollowsRotation: 'arrayFollowsRotation',
    //  -Rectangular:
    __arrayColumns:         'arrayColumns',
    __arrayColumnWidth:     'arrayColumnWidth',
    __arrayRows:            'arrayRows',
    __arrayRowHeight:       'arrayRowHeight',
    //  Both:
    __arrayRotation:        'arrayRotation',

    // COORDINATES
    __coordinatesNone:      'coordinatesNone',
    __coordinatesAbsolute:  'coordinatesAbsolute',
    __coordinatesRelative:  'coordinatesRelative',
    __coordinatesPolar:     'coordinatesPolar',

    __invalidParamEntry:    'invalidEntryWithParameter',

};
