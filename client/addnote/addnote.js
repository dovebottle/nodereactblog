import styles from './addnote.scss';//scss导入

let addnote = {
	init: function() {
		this.addnote();
		
	},
	addnote: function() {
		var _this = this;
		document.getElementById('addnote_sub_btn').addEventListener('click', function(event) {

			var add_form = document.getElementById('addnote_form');
			if (!add_form.title.value.trim()) {
				document.getElementById('addnote_con').style.borderColor = '#C4C4C4';
				_this.showError('addnote_title', 'new_status_box', '标题不能为空');
			} else if (!add_form.content.value.trim()) {
				document.getElementById('addnote_title').style.borderColor = '#C4C4C4';
				_this.showError('addnote_con', 'new_status_box', '内容不能为空');
			} else {
				var objectID = event.target.getAttribute('data-objectid');

				if (!objectID) {
					//add ajax
					var add_ajax = new XMLHttpRequest();
					add_ajax.open('post', '/addnote');
					add_ajax.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");
					add_ajax.onreadystatechange = function(data) {
						if (add_ajax.readyState == 4 && add_ajax.status == 200) {
							var new_note = JSON.parse(add_ajax.responseText);
							console.log(new_note);

							document.getElementById('new_status').innerHTML = "√发表成功：";
							document.getElementById('new_title').innerHTML = new_note.title;
							document.getElementById('new_title').setAttribute('href', "/notes/"+new_note.author+"/"+new_note._id);
							document.getElementById("new_status_box").style.display = "block";
						} else {
							// dosomething
						}
					};
					add_ajax.send("title="+add_form.title.value+"&content="+add_form.content.value+"&tags="+add_form.tags.value);
				} else if (objectID) {

					//edit ajax
					var data_author = event.target.getAttribute('data-author');
					var edit_ajax = new XMLHttpRequest();
					edit_ajax.open('post', '/editnote');
					edit_ajax.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");
					edit_ajax.onreadystatechange = function() {
						if (edit_ajax.readyState == 4 && edit_ajax.status == 200) {

							document.getElementById('new_status').innerHTML = "√更新成功：";
							document.getElementById('new_title').innerHTML = add_form.title.value;
							document.getElementById('new_title').setAttribute('href', "/notes/"+data_author+"/"+objectID);
							document.getElementById("new_status_box").style.display = "block";
						} else {
							// dosomething
						}
					};
					edit_ajax.send("title="+add_form.title.value+"&content="+add_form.content.value+"&tags="+add_form.tags.value+"&objectID="+objectID);
				}

			}
		});
	},
	showError: function(id, textid, text) {
		var text_dom = document.getElementById(textid);
		text_dom.innerHTML = text;
		document.getElementById(id).style.borderColor = 'red';
		text_dom.style.display = 'block';
	}
};

addnote.init();
