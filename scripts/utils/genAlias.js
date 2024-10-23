const path = require('path');
const getPackages = require('./getPackages');
module.exports = () => {
  const pkgs = getPackages();
  let alias = {};
  pkgs.forEach((i) => {
    alias[`@aicc/${i}/es`] = path.resolve(__dirname, `../../packages/${i}/src`);
    alias[`@aicc/${i}`] = path.resolve(__dirname, `../../packages/${i}/src`);
  });
  return alias;
};
