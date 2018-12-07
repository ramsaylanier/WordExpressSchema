module.exports = {
  env: {
    browser: false,
    es6: true,
    node: true
  },
  extends: ["standard", "plugin:prettier/recommended"],
  plugins: ["import", "prettier", "standard"],
  parser: "babel-eslint"
};
