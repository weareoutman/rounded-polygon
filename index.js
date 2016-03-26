/*
 * Create any size of regular rounded polygon.
 *
 * @param N <number> side count
 * @param L <number> side length
 * @param R <number> radius
 * @param padding <number>
 *
 * @return <object> {width, height, path}
 */
function roundedPolygon(N, L, R, padding) {
  padding = padding || 0;

  var half = (N - 2) * Math.PI / N / 2, // Half angle of corner
      sin = Math.sin(half),
      cos = Math.cos(half),
      gap = L - 2 / Math.tan(half) * R,
      round = 2 * cos * R,
      D = L / cos, // Diameter cross the polygon
      offsetY = 0;

  // Diameter is different for odd-sided polygon
  if (N % 2) {
    var vertial = D / 2 + D / 2 * sin;
    D = Math.sqrt(Math.pow(L / 2, 2) + Math.pow(vertial, 2));
    offsetY = (D - vertial) / 2;
  }

  D += 2 * padding;

  function getQuadrant(x) {
    return Math.floor(((x + 2 * Math.PI) % (2 * Math.PI)) / (Math.PI / 2)) + 1;
  }

  var points = [[
        0,
        R / sin - R * sin + padding + offsetY
      ]],
      angles = [half - Math.PI / 2],
      horizontalCut = 0;

  for (var i = 1; i <= N; i += 1) {
    var prev = angles[i - 1],
        next = prev + Math.PI - 2 * half,
        middle = (prev + next) / 2;

    var prevQ = getQuadrant(prev),
        nextQ = getQuadrant(next);
        
    // Rounded corner reduce the horizontal size of image
    if (prevQ === 1 && nextQ >= 2 && nextQ <= 3) {
      horizontalCut = Math.cos(Math.abs(middle - Math.PI / 2)) * R / sin - R;
    }

    angles.push(next);
    points.push([
      Math.cos(middle) * round,
      Math.sin(middle) * round
    ]);
    if (i !== N) {
      points.push([
        Math.cos(next) * gap,
        Math.sin(next) * gap
      ]);
    }
  }

  // Rounded corner reduce the vertical size of image 
  var vertialCut = R / sin - R;

  // Just recalculate the cords of start point
  if (N % 2) {
    D -= horizontalCut * 2;
    points[0][1] -= (horizontalCut * 2 + vertialCut) / 2;
  } else {
    D -= vertialCut * 2;
    points[0][1] -= vertialCut;
  }
  points[0][0] = D / 2 - cos * R;

  // Let the width be an integer
  var width = Math.ceil(D),
      delta = (width - D) / 2;
  points[0][0] += delta;
  points[0][1] += delta;

  function fixFloat(value){
    var fixed = +value.toPrecision(14);
    if (Math.abs(fixed) < 1e-13) {
      fixed = 0;
    }
    return fixed;
  }

  var list = [];
  points.forEach(function(p, index){
    var x = fixFloat(p[0]),
        y = fixFloat(p[1]);
    if (index === 0) {
      list.push('M' + x + ' ' + y);
    } else if (index % 2) {
      list.push('a' + R + ' ' + R + ' 0 0 1 ' + x + ' ' + y);
    } else {
      list.push('l' + x + ' ' + y);
    }
  });

  var path = list.join('');

  return {
    width: width,
    height: width,
    path: path
  };
}

