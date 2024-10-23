module.exports = {
  extends: require.resolve('@umijs/max/eslint'),
  rules: {
    'no-unused-vars': 'off',
    'no-param-reassign': 'off',
    'no-use-before-define': 'off',
  },
  ignorePatterns: ['/src/assets/'],
};
