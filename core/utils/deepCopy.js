export const deepCopy = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  const copy = Array.isArray(obj) ? [] : {};
  Object.keys(obj).forEach((key) => {
    copy[key] = deepCopy(obj[key]);
  });
  return copy;
};

export const deepCopyWith = (obj, customizer) => {
  function deepCopyWithHelper(value, innerKey, innerObject) {
    const result = customizer(value, innerKey, innerObject);
    if (result !== undefined)
      return result;
    if (value === null || typeof value !== 'object') {
      return value;
    }
    const copy = Array.isArray(value) ? [] : {};
    Object.keys(value).forEach((k) => {
      copy[k] = deepCopyWithHelper(value[k], k, value);
    });
    return copy;
  }

  if (customizer) {
    return deepCopyWithHelper(obj, '', null);
  } else {
    return deepCopy(obj);
  }
};
