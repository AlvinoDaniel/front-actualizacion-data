const path = require( 'path' );

module.exports = {
  devServer: {
    disableHostCheck: true,
  },

  publicPath: process.env.NODE_ENV === 'production'
    ? '/'
    : '/',

  transpileDependencies: ['vuetify'],

  lintOnSave: process.env.NODE_ENV !== 'production' ? 'warning' : false,

  configureWebpack: {
    plugins: [],
  },

  // chainWebpack: (config) => {

  //   const svgRule = config.module.rule( 'svg' );

  //   // svgRule.exclude.add(path.join(__dirname, 'node_modules', '@ckeditor'))
  //   config.module
  //       .rule( 'cke-svg' )
  //       .test( /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/ )
  //       .use( 'raw-loader' )
  //       .loader( 'raw-loader' );
  //   config.module
  //     .rule( 'cke-css' )
  //     .test( /ckeditor5-[^/\\]+[/\\].+\.css$/ )
  //     .use( 'postcss-loader' )
  //     .loader( 'postcss-loader' )
  //     .tap( () => {
  //       return {
  //         postcssOptions: styles.getPostCssConfig({
  //             // themeImporter: {
  //             //     themePath: require.resolve( '@ckeditor/ckeditor5-theme-lark' )
  //             // },
  //             minify: true
  //         })
  //       }
  //     })
  // },
}
