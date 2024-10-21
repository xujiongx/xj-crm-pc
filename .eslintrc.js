module.exports = {
  extends: require.resolve('@umijs/max/eslint'),
  rules: {
    'no-unused-vars': 'off',
  },
  ignorePatterns: ['/src/assets/'],
};
