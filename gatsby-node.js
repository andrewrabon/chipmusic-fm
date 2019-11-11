const path = require('path');

exports.onCreateWebpackConfig = ({ actions, getConfig, stage }) => {
  const config = {
    resolve: {
      alias: {
        components: path.resolve(__dirname, 'src/components'),
        fragments: path.resolve(__dirname, 'src/fragments'),
        images: path.resolve(__dirname, 'src/images'),
        utils: path.resolve(__dirname, 'src/utils'),
      },
    },
  };
  if (stage === 'build-html') {
    config.externals = getConfig().externals.concat((context, request, callback) => {
      const regex = /^@?firebase(\/(.+))?/;
      if (regex.test(request)) {
        return callback(null, `umd ${request}`);
      }
      return callback();
    });
  }
  actions.setWebpackConfig(config);
};
