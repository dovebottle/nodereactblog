// import $ from '../lib/jquery.min.js';//scss导入
import styles from './singlenote.scss';//scss导入

var $ = require('jquery');
var add_commen = {
	addtime: "",//canvas唯一标识
	ctx: '',
	flag: false,
	clickUpX: "",
	clickUpY: "",
	clickDownX: "",
	clickDownY: "",
	pencilX: 0,
	pencilY: 0,
	boxID: '',

	init: function(add_id, conent_id) {
		var _this = this;
		this.boxID = conent_id;
		this.listen_creat(add_id, conent_id);
		this.listen_pencil();
		$('#close').click(function() {
			_this.close_and_clean();
		});
		$('#window_add').click(function() {
			var getLocation;
			getLocation = true;//该数据为划取坐标，暂时用true代替？？？

			var content = $('.window_content').val();
			console.log(content);
			if (content) {
				// canUseCreateButton = true;
				var timeflag = _this.addtime;   //作为唯一匹配id	
				//添加灯泡图标
				var bulbLeft = _this.pencilX;
				var bulbTop = _this.pencilY;

				var newbulb = document.getElementById("content_jq");
				var newbulbDiv = $("<div class='addnewBulb' id='"+timeflag+"' data-comment='"+content+"' data-bulbid='"+_this.addtime+"'></div>");
				$('#content_jq').append(newbulbDiv);

	//不见z-index，不在最顶层，此时会闪烁变换
				newbulbDiv.css({"z-index": 1000, "left" : _this.clickDownX+3 , "top": _this.clickDownY-10, "click" :_this.showclickdialog() ,"hover": _this.showhoverdialog() });

				//到这000000
				// var newbulb = document.getElementById("paragraph");
				// var newbulbDiv = document.createElement("div");
				// newbulbDiv.className = "addnewBulb";
				// newbulbDiv.id = timeflag;
				// newbulbDiv.hover = showhoverdialog();
				// newbulb.appendChild(newbulbDiv);
				// $("div[id="+timeflag+"]").attr("data-comment",value);
	//不见z-index，不在最顶层，此时会闪烁变换
				// $("div[id="+timeflag+"]").css({"z-index": 1000,"left" : bulbLeft+3 , "top" : bulbTop-10,"click" :showclickdialog() ,"hover":showhoverdialog() });
				
				$("canvas[id="+timeflag+"]").css({"display":"none"});

				//评论列表的插入
				var $list = $(".list");
				var $postil = $("<div forid='"+timeflag+"'>"+content+"</div>");
				$list.append($postil);
				$postil.hover(function(){
					$(this).removeClass().addClass("postilBarFocus");
					var gethoverid = $(this).attr("forid");
					$("canvas[id="+gethoverid+"]").css({"display":"block"});
				},function(){
					$(this).removeClass().addClass("postilBar");
					var gethoverid = $(this).attr("forid");
					$("canvas[id="+gethoverid+"]").css({"display":"none"});
				});

				_this.close_and_clean();
			} else {
				alert('点开我什么都不说就想走？惊了！');
			}

		});

	},

	listen_creat: function(id, content_id) {
		var _this = this;
		$("#" + id).click(function() {
			_this.addCanvas(content_id);
		});
		
	},

	addCanvas: function(content_id) {
		var canvasID = new Date().getTime();
		this.addtime = canvasID;
		var _this = this;

		var canvas_box = $("<canvas id='"+canvasID+"' class='canvasSize'></canvas>");
		$('#' + content_id).append(canvas_box);

		var content_box = $("#" + content_id)[0];
		var canvas_self = $("#" + canvasID);

		canvas_self.bind('mousedown', function(event) {
			_this.onMouseDown(event);
		});
		canvas_self.bind('mousemove', function(event) {
			_this.onMouseMove(event);
		});
		canvas_self.bind('mouseup', function(event) {
			_this.onMouseUp(event);
		});

		canvas_self[0].width = content_box.offsetWidth;
	    canvas_self[0].height = content_box.offsetHeight;

	    this.ctx = canvas_self[0].getContext('2d');
		this.ctx.lineWidth = 3.0; // 设置线宽
		this.ctx.strokeStyle = "#FC2222"; // 设置线的颜色
	},
	onMouseDown: function(event) {
		event.preventDefault();
		this.ctx.beginPath();
		var p = this.pos(event);  
		this.clickDownX = p.x;
		this.clickDownY = p.y;
		this.ctx.moveTo(p.x, p.y);
		this.flag = true;
		// console.log(p.x+"and"+p.y);
	},
	onMouseMove: function(event) {
		event.preventDefault();
		if (this.flag){
			var p = this.pos(event);
			this.ctx.lineTo(p.x, p.y);
			this.ctx.lineWidth = 0.5; // 设置线宽
			// ctx.shadowColor = "#CC0000";
			this.ctx.shadowBlur = 1;
			//ctx.shadowOffsetX = 6;
			this.ctx.stroke();
		}
		
	},
	onMouseUp: function(event) {
		event.preventDefault();
		this.flag = false;
		var p = this.pos(event); 
		this.clickUpX = p.x;                          
		this.clickUpY = p.y; 	
		if(this.clickDownX != this.clickUpX || this.clickDownY != this.clickUpY){
			this.showPencil(event);
		}
	},
	pos: function(event) {
		var x,y;
		x = event.offsetX;
		y = event.offsetY;
		return {x:x,y:y};
	},
	showPencil: function(event) {
		console.log(event);
		var pencilX = event.offsetX;
		var pencilY = event.offsetY;
		this.pencilX = pencilX;
		this.pencilY = pencilY;
		$("#pencilIcon").css({
			"width":25,
			"height":25,
			"left" : pencilX-20,
			"top" : pencilY-20,
			"display" :"block"
		
		}).fadeIn(300);
	},
	listen_pencil: function() {
		$('#pencilIcon').click(function() {
			$("#comment_window").css({'display': "block"});
		});
	},
	close_and_clean: function() {
		$("canvas[id=" + this.addtime + "]").css({"display":"none"});
		$("#pencilIcon").css({"display" :"none"});
		$("#comment_window").css({"display" :"none"});
	},
	showclickdialog: function() {
		console.log('asdf');
		$("div[class=addnewBulb]").click(function(e){
			// var clickdialogheight = e.clientY + document.documentElement.scrollTop - 60;
			// console.log(clickdialogheight);
			// $("div[id=listbar]").css({"visibility":"visible","margin-top":clickdialogheight });
			$("div[id=listbar]").css({"visibility":"visible"});
		});
	},
	showhoverdialog: function() {
		$("div[class=addnewBulb]").hover(function(e){
			var getid = $(this).attr("id");
			$("div[forid="+getid+"]").removeClass().addClass("postilBarFocus");
			$("canvas[id="+getid+"]").css({"display":"block"});
			var showLeft = $(this).position().left;
			var showTop = $(this).position().top;
			// console.log(showLeft);
			var text = $(this).attr("data-comment");
			var $hoverdialog = $("#hoverdialog");
			var $exit = $("div[selecthover="+getid+"]")[0];  //为什么要加个【0】
			if (!$exit){
				var $hoverdialogDiv = $("<div selecthover="+getid+" class=hoverdialogcss>"+text+"</div>");
				$hoverdialog.append($hoverdialogDiv);
			}
			var hoverheight = $("div[selecthover="+getid+"]")[0].offsetHeight;
			var hoverwidth = $("div[selecthover="+getid+"]")[0].offsetWidth;
			// console.log(hoverheight);
			// console.log(hoverwidth);
			$("div[selecthover="+getid+"]").css({"left" : showLeft-(hoverwidth / 2) , "top" : showTop-hoverheight-10 , "visibility" : "visible"});

		},function(e){
			var getid = $(this).attr("id");
			$("div[forid="+getid+"]").removeClass().addClass("postilBar");
			$("canvas[id="+getid+"]").css({"display":"none"});
			$("div[selecthover="+getid+"]").css({"visibility" : "hidden"});
		});
	}
};

add_commen.init("add_comment", "content_jq");