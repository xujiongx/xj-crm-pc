module.exports = {
  extends: require.resolve('@umijs/max/eslint'),
  ignorePatterns: ['/packages/**/*.js', '/src/assets/'],
  rules: {
    'no-unused-vars': 'off',
    'no-param-reassign': 'off',
    'no-use-before-define': 'off',
    'no-unknown-functions': ['error', { ignoreFunctions: ['fade'] }],
  },
};
