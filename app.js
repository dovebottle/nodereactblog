var express = require('express'),
    path = require('path'),
    consolidate = require('consolidate');//包装模板引擎

//cookie session mongodb
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var settings = require('./settings');
//routes里面用到了bodyParser。所以记得放在其后面
var routes = require('./server/routes');

var isDev = process.env.NODE_ENV !== 'production';//true : dev
var app = express();
var port = 13300;

app.set('view engine', 'ejs');

//若直接使用html，设置如下
//让ejs能够识别后缀为’.html’的文件
// app.engine('html', consolidate.ejs);
//调用render函数时能自动为我们加上’.html’ 后缀
// app.set('view engine', 'html');

//设置模板文件路径
app.set('views', path.resolve(__dirname, './server/views'));

// app.locals定义的键值对能在模板中直接访问
app.locals.env = process.env.NODE_ENV || 'dev';
app.locals.reload = true;

//cookie session mongodb
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: settings.cookieSecret,
  key: settings.db,//cookie name
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 10},//30 days
  store: new MongoStore({
    //connect-mongo已经更新了
    url: 'mongodb://'+ settings.host +':'+ settings.port +'/' + settings.db
    // db: settings.db,
    // host: settings.host,
    // port: settings.port
  })
}));
app.use(flash());

if (isDev) {

    //开发环境，静态文件使用热插拔
    var webpack = require('webpack'),
        webpackDevMiddleware = require('webpack-dev-middleware'),
        webpackHotMiddleware = require('webpack-hot-middleware'),
        webpackDevConfig = require('./webpack.config.js');

    var compiler = webpack(webpackDevConfig);

    // attach to the compiler & the server
    app.use(webpackDevMiddleware(compiler, {

        // public path should be the same with webpack config
        publicPath: webpackDevConfig.output.publicPath,
        noInfo: true,
        stats: {
            colors: true
        }
    }));
    app.use(webpackHotMiddleware(compiler));
    //不能惹插拔的往下执行

    require('./server/routes')(app);

    // add "reload" to express, see: https://www.npmjs.com/package/reload
    var reload = require('reload');
    var http = require('http');

    var server = http.createServer(app);
    reload(server, app);

    server.listen(port, function(){
        console.log('App (dev) is now running on port 13300!');
    });
} else {
    //线上环境不需要监听，只需开启node服务即可
    // static assets served by express.static() for production
    app.use(express.static(path.join(__dirname, 'public')));
    require('./server/routes')(app);
    app.listen(port, function () {
        console.log('App (production) is now running on port 13300!');
    });
}
