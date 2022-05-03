const primaryColor = window.env.PRIMARY_COLOR;
console.log(primaryColor);
module.exports = {
  environmentVariables: {
    "--primary-bg-color": primaryColor ? `${primaryColor}` : "#07D1B6",
  },
};
