(function(){
  var NS = {
      xmlns: 'http://www.w3.org/2000/svg',
      xlink: 'http://www.w3.org/1999/xlink'
    },
    SVG_VERSION = '1.1';

  function createSvgElement(tagName, attrs) {
    var svg = document.createElementNS(NS.xmlns, tagName);
    if (attrs) {
      setAttrs(svg, attrs);
    }
    return svg;
  }

  function setAttrs(elem, attrs) {
    for (var key in attrs) {
      if (attrs.hasOwnProperty(key)) {
        elem.setAttribute(key, attrs[key]);
      }
    }
  }

  var svg = createSvgElement('svg');

  var path = createSvgElement('path', {
    stroke: 'none',
    fill: '#20be86'
  });

  svg.appendChild(path);

  document.querySelector('#container').appendChild(svg);

  var description = document.querySelector('#description');
  window.formChanged = function(){
    var elements = document.forms.options.elements,
        n = +elements.N.value,
        l = +elements.L.value,
        r = +elements.R.value,
        padding = +elements.padding.value;
    elements._N.value = n;
    elements._L.value = l;
    elements._R.value = r;
    elements._padding.value = padding;
    var polygon = RoundedPolygon(n, l, r, padding),
        width = Math.ceil(polygon.width),
        height = Math.ceil(polygon.height);
    setAttrs(svg, {
      width: width,
      height: height
    });
    setAttrs(path, {
      d: polygon.path
    });
    description.innerHTML = width + 'x' + height;
  };

  window._formChanged = function(){
    var elements = document.forms.options.elements;
    elements.N.value = elements._N.value;
    elements.L.value = elements._L.value;
    elements.R.value = elements._R.value;
    elements.padding.value = elements._padding.value;
    window.formChanged();
  };

  window.formChanged();
})();