function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function randomItem(items) {
  if (!items) {
    return
  }
  return items[Math.floor(Math.random() * items.length)];
}



function clean(a) {
  if (!a) {
    return {}
  }

  var results = {}

  for (var key in a) {
    if (['string', 'boolean', 'number', 'object'].indexOf(typeof a[key]) === -1) {
      continue
    }



    if (typeof a[key] === 'object') {
      var _diff = clean(a[key])
      if (!Object.keys(_diff).length) {
        continue
      }

      results[key] = _diff
      continue
    }

    results[key] = a[key]
  }

  return results
}




function diff(a, b) {
  if (!a || !b) {
    return {}
  }

  var results = {}

  for (var key in b) {
    if (['string', 'boolean', 'number', 'object'].indexOf(typeof b[key]) === -1) {
      continue
    }

    if (key == 'newPosition' && b[key]) {
      results[key] = b[key]
    }

    if (a[key] === b[key]) {
      continue
    }

    if (typeof a[key] === 'object') {
      var _diff = diff(a[key], b[key])
      if (!Object.keys(_diff).length) {
        continue
      }

      results[key] = _diff
      continue
    }


    if (typeof a[key] === 'undefined' && typeof b[key] !== 'undefined') {
      results[key] = b[key]
      continue
    }

    results[key] = b[key]
  }

  return results
}



function randomProperty(obj) {
  var keys = Object.keys(obj)
  return obj[keys[keys.length * Math.random() << 0]];
}

function sortProperties(obj, sortedBy, isNumericSort, reverse) {
  sortedBy = sortedBy || 1; // by default first key
  isNumericSort = isNumericSort || false; // by default text sort
  reverse = reverse || false; // by default no reverse

  var reversed = (reverse) ? -1 : 1;

  var sortable = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      sortable.push([key, obj[key]]);
    }
  }
  if (isNumericSort)
    sortable.sort(function (a, b) {
      return reversed * (a[1][sortedBy] - b[1][sortedBy]);
    });
  else
    sortable.sort(function (a, b) {
      var x = a[1][sortedBy].toLowerCase(),
        y = b[1][sortedBy].toLowerCase();
      return x < y ? reversed * -1 : x > y ? reversed : 0;
    });
  return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}

module.exports.diff = diff;
module.exports.clean = clean;

module.exports.randomItem = randomItem;
module.exports.sortProperties = sortProperties;
module.exports.randomProperty = randomProperty;
module.exports.getRandomInt = getRandomInt;