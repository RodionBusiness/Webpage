module.exports = ({ file, options, env }) => ({
  plugins: {
    'postcss-cssnext': {
      warnForDuplicates: false
    }
  }
});
