/*
 * @param N <number> side count
 * @param L <number> side length
 * @param R <number> radius
 * @param padding <number>
 */
function RoundedPolygon(N, L, R, padding) {
  padding = padding || 0;

  var half = (N - 2) * Math.PI / N / 2, // Half angle of corner
      sin = Math.sin(half),
      cos = Math.cos(half),
      gap = L - 2 / Math.tan(half) * R,
      round = 2 * cos * R,
      D = L / cos, // Diameter cross the polygon
      offsetY = 0,
      vertial;

  // Diameter is different for odd-sided polygon
  if (N % 2) {
    vertial = D / 2 + D / 2 * sin;
    D = Math.sqrt(Math.pow(L / 2, 2) + Math.pow(vertial, 2));
    // offsetY = (D - vertial) / 2;
  }

  D += 2 * padding;

  function getQuadrant(x) {
    return Math.floor(((x + 2 * Math.PI) % (2 * Math.PI)) / (Math.PI / 2)) + 1;
  }

  var points = [[
        0,
        // D / 2 - cos * R,
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

  console.log(D);

  var vertialCut = R / sin - R;
  console.log(vertialCut);
  if (N % 2) {
    D -= horizontalCut * 2;
    points[0][1] -= vertialCut;
  } else {
    D -= vertialCut * 2;
    points[0][1] -= vertialCut / 2;
  }

  points[0][0] = D / 2 - cos * R;

  var list = [];
  points.forEach(function(p, index){
    if (index === 0) {
      list.push('M' + p[0] + ' ' + p[1]);
    } else if (index % 2) {
      list.push('a' + R + ' ' + R + ' 0 0 1 ' + p[0] + ' ' + p[1]);
    } else {
      list.push('l' + p[0] + ' ' + p[1]);
    }
  });

  var path = list.join('');

  return {
    width: D,
    height: D,
    path: path
  };
}

