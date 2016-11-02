var User = require('../models/user.js');
var Note = require('../models/note.js');

module.exports = function (app, express) {

    // app.use('/', require('./page1'));
    // app.use('/page2', require('./page2'));
    var router = express.Router();

    app.get('/', function(req, res) {
    	// console.log(req.session);
    	res.render('index', {
    		user: req.session.user,
    		success: req.flash('success').toString(),
			error: req.flash('error').toString()
    	});
    });

    app.get('/page2', function(req, res) {
    	res.render('page2', {
    		user: req.session.user,
    		success: req.flash('success').toString(),
    		error: req.flash('error').toString()
    	});
    });

//文章页面
	router.param(['author', 'noteid'], function(req, res, next, value) {
		next();
	});
	app.get('/notes/:author/:noteid', function(req, res) {
		console.log(req.params.author);
		Note.getNoteByAuthorNoteid(req.params.author, req.params.noteid, function(err, note) {

			res.render('singlenote', {
	    		user: req.session.user,
	    		success: req.flash('success').toString(),
				error: req.flash('error').toString(),
				note: note
	    	});
		});
	});

//显示标签
	app.get('/mytags', checkLogin);
	app.get('/mytags', function(req, res) {
		Note.gettags(req.session.user.name, function(err, tagsobj) {
			//港真，在路由这里做这种事情不大好
			// var noempty = false;
			// for (var key in tagsobj) {
				noempty = true;
				// return;
			// }
			res.render('mytags', {
				user: req.session.user,
	    		success: req.flash('success').toString(),
	    		error: req.flash('error').toString(),
	    		tagsobj: tagsobj,
	    		noempty: noempty
			});
		});
	});

	app.post('/mytags', checkLogin);
	app.post('/mytags', function(req, res) {
		Note.gettags(req.session.user.name, function(err, tagsobj) {

			res.send(tagsobj);
		});
	});

//通过标签和作者获取文章组
	app.post('/tagToNote', checkLogin);
	app.post('/tagToNote', function(req, res) {
		var tag = req.body.tag;
		Note.getNoteByTag(tag, req.session.user.name, function(err, notes) {

			res.send(notes);
		});
	});

//显示笔记
	app.get('/mynote', checkLogin);
	app.get('/mynote', function(req, res) {
		Note.get(req.session.user.name, function(err, note) {

			res.render('mynote', {
				user: req.session.user,
	    		success: req.flash('success').toString(),
	    		error: req.flash('error').toString(),
	    		note: note
			});
		});
	});

//新建笔记
	app.get('/addnote', checkLogin);
	app.get('/addnote', function(req, res) {
		res.render('addnote', {
			user: req.session.user,
    		success: req.flash('success').toString(),
    		error: req.flash('error').toString()
		});
	});

	app.post('/addnote', checkLogin);
	app.post('/addnote', function(req, res) {
		var time = new Date();

		if (!req.body.title) {
			console.log('不能为空');
		}

		var newNote = new Note({
			author : req.session.user.name,
			title : req.body.title,
			content : req.body.content,
			tags : strToArr(req.body.tags, /[,，]/),
			time : time
		});

		newNote.save(function(err, note) {
			// console.log(note);
			if (err) {
				console.log(err);
			}
			res.send(note);
		});
	});

//注册
    app.get('/reg', checkNotLogin);
	app.get('/reg', function (req, res) {
		res.render('reg', {
			// title: '注册',
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});

	app.post('/reg', checkNotLogin);
	app.post('/reg', function (req, res) {
		var name = req.body.name,
			password = req.body.password,
			password_re = req.body['password-repeat'];
		//检验用户两次输入的密码是否一致
		if (password_re != password) {
			req.flash('error'); 
			req.flash('error', '两次输入的密码不一致!'); 
			return res.redirect('/reg');//返回主册页
		}
		//生成密码的 md5 值
		// var md5 = crypto.createHash('md5'),
	    // password = md5.update(req.body.password).digest('hex');
		var newUser = new User({
		    name: req.body.name,
		    password: password,
		    email: req.body.email
		});
		//检查用户名是否已经存在 
		User.get(newUser.name, function (err, user) {
			if (user) {
				req.flash('error');
				req.flash('error', '用户已存在!');
				return res.redirect('/reg');//返回注册页
			}
			//如果不存在则新增用户
			newUser.save(function (err, user) {
				if (err) {
					req.flash('error');
					req.flash('error', err);
					return res.redirect('/reg');//注册失败返回主册页
				}
				req.session.user = user;//用户信息存入 session
				req.flash('success');
				req.flash('success', '注册成功!');
				res.redirect('/');//注册成功后返回主页
			});
		});
	});

//登录
	app.get('/login', checkNotLogin);
	app.get('/login', function(req, res) {
		res.render('login', {
			// title: '登录',
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});

	app.post('/login', checkNotLogin);
	app.post('/login', function(req, res) {
		var password = req.body.password;
		//生成密码的 md5 值
    	// var md5 = crypto.createHash('md5'),
        	// password = md5.update(req.body.password).digest('hex');
        //检查用户是否存在
    	User.get(req.body.name, function(err, user) {
    		if (!user) {
    			req.flash('error');
    			req.flash('error', '用户不存在!');
    			return res.redirect('/login');//用户不存在则跳转到登录页
    		}
    		//检查密码是否一致
    		if (user.password != password) {
    			req.flash('error'); 
    			req.flash('error', '密码错误!'); 
    			return res.redirect('/login');//密码错误则跳转到登录页
    		}
    		//用户名密码都匹配后，将用户信息存入 session
    		req.session.user = user;
    		req.flash('success');
    		req.flash('success', '登陆成功!');
    		res.redirect('/');//登陆成功后跳转到主页
    	});
	});

//登出
	app.get('/logout', checkLogin);
	app.get('/logout', function (req, res) {
		req.session.user = null;
		req.flash('success');
		req.flash('success', '登出成功!');
		res.redirect('/');//登出成功后跳转到主页
	});

	//登出的时候判断是否登录
	function checkLogin(req, res, next) {
		if (!req.session.user) {
			req.flash('error'); 
			req.flash('error', '未登录!'); 
			return res.redirect('/login');
		}
		next();
	}

  	//登录、注册时时候判断是否登录
	function checkNotLogin(req, res, next) {
		console.log(req.session);
		if (req.session.user) {
			req.flash('error'); 
			req.flash('error', '已登录!'); 
			return res.redirect('back');//返回之前的页面
		}
		next();
	}

	//分割字符串去除空值
	function strToArr(str, rex) {
		var getArr = str.split(rex);
		getArr.map(function(value, index, arr) {
			if (!value) {
				arr.splice(index, 1);
			}
		});
		return getArr;
	}
};
