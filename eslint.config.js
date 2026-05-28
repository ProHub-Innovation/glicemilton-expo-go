const { defineConfig } = require("eslint/config");

module.exports = defineConfig([
  {
    rules: {
      "no-unused-vars": "warn",
      "no-console": "warn",
    },
  },
]);
