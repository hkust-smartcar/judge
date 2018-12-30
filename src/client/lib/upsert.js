module.exports = (array_, item, keyname) => {
  let array = [...array_];
  let a = array.filter(({ [keyname]: val }) => item[keyname] == val);
  if (a.length === 0) array.unshift(item);
  else
    array = array.reduce((prev, currv, k) => {
      if (currv[keyname] === item[keyname]) {
        for (let key in item) {
          currv[key] = item[key];
        }
      }
      return [...prev, currv];
    }, []);
  return array;
};
