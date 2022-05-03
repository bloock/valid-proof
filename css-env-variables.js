const { primaryBgColor } = require(window.env.PRIMARY_COLOR);

module.exports = {
  environmentVariables: {
    "--primary-bg-color": primaryBgColor ? `${primaryBgColor}` : "#07D1B6",
  },
};
