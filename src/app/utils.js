export const windowWidth = window.innerWidth
export const windowHeight = window.innerHeight


var timer = null;

export function debounce(callback, limit) {


  clearTimeout(setTimeout(() => {
    callback()
  }, limit));

}

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomProperty(obj) {
  var keys = Object.keys(obj)
  return obj[keys[keys.length * Math.random() << 0]];
}

export function updateQueryStringParameter(key, value) {
  var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname
  if (key && value) {
    newurl += '#!' + value
  }

  window.history.pushState({
    path: newurl
  }, '', newurl)
}

export function getParameterByName(name, url) {
  return decodeURI(window.location.hash.substr(2))

}


export function pointRectangleDistance(x, y, x1, y1, x2, y2) {
  var dx, dy;
  if (x < x1) {
    dx = x1 - x;
    if (y < y1) {
      dy = y1 - y;
      return Math.sqrt(dx * dx + dy * dy);
    } else if (y > y2) {
      dy = y - y2;
      return Math.sqrt(dx * dx + dy * dy);
    } else {
      return dx;
    }
  } else if (x > x2) {
    dx = x - x2;
    if (y < y1) {
      dy = y1 - y;
      return Math.sqrt(dx * dx + dy * dy);
    } else if (y > y2) {
      dy = y - y2;
      return Math.sqrt(dx * dx + dy * dy);
    } else {
      return dx;
    }
  } else {
    if (y < y1) {
      return y1 - y;
    } else if (y > y2) {
      return y - y2;
    } else {
      return 0.0; // inside the rectangle or on the edge
    }
  }
}