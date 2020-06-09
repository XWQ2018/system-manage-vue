const path = require('path');
const resolve = (dir) => path.join(__dirname, dir);
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
const autoprefixer = require('autoprefixer');
const processEnv = process.env.NODE_ENV;
// const publicPathInfo = processEnv === 'development' ? '/jnsDev/' : processEnv === 'test' ? '/jnsTest/' : '/jns/';
const isProd = processEnv === 'production';


const objectProject = {
    index: {
        // page 的入口
        entry: 'src/main.js',
        // 模板来源
        template: './public/index.html',
        // 在 dist/index.html 的输出
        filename: 'index.html',
        // 当使用 title 选项时，
        // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
        title: 'jnsPC',
        // 在这个页面中包含的块，默认情况下会包含
        // 提取出来的通用 chunk 和 vendor chunk。
        chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
};
//入口打包
let pagesInfo = {};
let projectName = process.argv[3];
let projectArr = ['index', 'buche', 'xhDetection', 'jnsXh'];
if ((isProd && projectName == 'all') || !isProd) {
    pagesInfo = objectProject;
    // } else if (isProd && projectArr.includes[projectName]) {
} else if (isProd && findIndexHandle(projectArr, projectName) > -1) {
    pagesInfo[projectName] = objectProject[projectName];
} else {
    pagesInfo = objectProject;
}

module.exports = {
    // publicPath: publicPathInfo,
    outputDir: (isProd && projectName != 'all') ? 'dist_' + projectName : 'dist',//标识是打包哪个文件
    pages: pagesInfo,
    devServer: {
        // 设置代理
        proxy: {
            '/api': {
                // 目标 API 地址
                target: process.env.VUE_APP_API_URL,
                // 如果要代理 websockets
                // ws: true,
                // 将主机标头的原点更改为目标URL
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        },
        stats: 'errors-only',
    },
    lintOnSave: false,
    css: {
        // 是否使用css分离插件 ExtractTextPlugin Default: 生产环境下是 true，开发环境下是 false
        // extract: true,
        // 开启 CSS source maps?
        sourceMap: false,
        // 启用 CSS modules for all css / pre-processor files.
        modules: false,
        loaderOptions: {
            postcss: {
                plugins: [
                    autoprefixer()
                ]
            },
            less: {
                test: /\.less$/,
                use: [{
                    loader: 'style-loader',
                }, {
                    loader: 'css-loader',
                }, {
                    loader: 'less-loader',
                }]
            }
        }
    },
    chainWebpack: config => {
        const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
        types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)));
        // 添加别名
        config.resolve.alias
            .set('@', resolve('src'))
            .set('@assets', resolve('src/assets'))
            .set('@css', resolve('src/assets/css'))
            .set('@img', resolve('src/assets/img'));
        config.performance.hints(false);
    },
    configureWebpack: config => {
        if (isProd) {
            const plugins = [];
            plugins.push(
                new CompressionWebpackPlugin({
                    filename: '[path].gz[query]',
                    algorithm: 'gzip',
                    test: productionGzipExtensions,
                    threshold: 10240,
                    minRatio: 0.8
                })
            );
            config.plugins = [...config.plugins, ...plugins];
        }
    },
    // 使用 Vue CLI 3+ 时，需要在 vue.config.js 中的 transpileDependencies 增加 vue-echarts 及 resize-detector，如下
    transpileDependencies: [
        'vue-echarts',
        'resize-detector'
    ],
    productionSourceMap: false,
};

function addStyleResource(rule) {
    rule.use('style-resource')
        .loader('style-resources-loader')
        .options({
            patterns: [
                path.resolve(__dirname, './src/assets/css/reset.css'),
                path.resolve(__dirname, './src/assets/css/style.css')
            ],
        });
}

function findIndexHandle(arrList, val) {
    return arrList.findIndex(item => {
        return item == val;
    });
}