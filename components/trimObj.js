function trimObj(obj) {
  if (!Array.isArray(obj) && typeof obj != 'object') return obj;
  return Object.keys(obj).reduce(
    function (acc, key) {
      acc[key.trim()] =
        typeof obj[key] == 'string' ? obj[key].trim() : trimObj(obj[key]);
      return acc;
    },
    Array.isArray(obj) ? [] : {}
  );
}

module.exports.trimObj = trimObj;
