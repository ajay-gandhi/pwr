/**
 * Miscellaneous utilities
 */

/**
 * Returns the union of two arrays
 */
module.exports.union = function (x, y) {
  var obj = {};
  for (var i = x.length - 1; i >= 0; --i)
    obj[x[i]] = x[i];

  for (var i = y.length - 1; i >= 0; --i)
    obj[y[i]] = y[i];

  return Object.keys(obj);
}
