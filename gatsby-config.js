require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  siteMetadata: {
    title: 'ChipMusic.fm',
    description: 'A simple shuffle-only music player for ChipMusic.org.',
    author: '@andrewrabon',
  },
  plugins: [
    'gatsby-plugin-react-helmet-async',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`,
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'ChipMusic.fm',
        short_name: 'ChipMusic.fm',
        start_url: '/',
        background_color: '#000000',
        theme_color: '#000000',
        display: 'minimal-ui',
        icon: 'src/images/icon.png', // This path is relative to the root of the site.
      },
    },
    {
      resolve: 'gatsby-plugin-prefetch-google-fonts',
      options: {
        fonts: [
          {
            family: 'Josefin Sans',
            variants: ['bold', 'italic'],
          },
          {
            family: 'Roboto',
            subsets: ['latin'],
          },
        ],
        display: 'swap',
      },
    },
    'gatsby-plugin-remove-trailing-slashes',
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    'gatsby-plugin-offline',
  ],
};
