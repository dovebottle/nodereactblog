var express = require('express'),
    path = require('path'),
    consolidate = require('consolidate');

//cookie session mongodb
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var settings = require('./settings');
//routes里面用到了bodyParser。所以记得放在其后面
var routes = require('./server/routes');

var isDev = process.env.NODE_ENV !== 'production';
var app = express();
var port = 13300;

// app.engine('html', consolidate.ejs);
// app.set('view engine', 'html');

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, './server/views'));

app.locals.env = process.env.NODE_ENV || 'dev';
app.locals.reload = false;

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
    var webpack = require('webpack'),
        webpackDevMiddleware = require('webpack-dev-middleware'),
        webpackHotMiddleware = require('webpack-hot-middleware'),
        webpackDevConfig = require('./webpack.config.js');

    var compiler = webpack(webpackDevConfig);

    app.use(webpackDevMiddleware(compiler, {
        publicPath: webpackDevConfig.output.publicPath,
        noInfo: true,
        stats: {
            colors: true
        }
    }));
    app.use(webpackHotMiddleware(compiler));

    require('./server/routes')(app);

    // browsersync is a nice choice when modifying only views (with their css & js)
    //views下面的模板文件修改时不需要重启node服务器（routes需要）
    var bs = require('browser-sync').create();
    app.listen(port, function(){
        bs.init({
            open: false,
            ui: false,
            notify: false,
            proxy: 'localhost:13300',
            files: ['./server/views/**'],
            port: 8080
        });
        console.log('App (dev) is going to be running on port 8080 (by browsersync).');
    });

} else {
    app.use(express.static(path.join(__dirname, 'public')));
    require('./server/routes')(app);
    app.listen(port, function () {
        console.log('App (production) is now running on port 13300!');
    });
}
