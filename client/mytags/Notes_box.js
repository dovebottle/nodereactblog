import React from 'react';

class Notes_box extends React.Component {
	noteClick(event) {
		console.log(event.target);
		var _this = this;
		var deleteID = event.target.getAttribute('data-deleteid');
		var editID = event.target.getAttribute('data-editid');
		if (deleteID) {
			console.log("deleteID:"+deleteID);

			//根据objectID更新笔记delete字段
			var deleteNotes_ajax = new XMLHttpRequest();
			deleteNotes_ajax.open('post', '/deletenote');
			deleteNotes_ajax.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");
			deleteNotes_ajax.onreadystatechange = function() {
				if (deleteNotes_ajax.readyState == 4 && deleteNotes_ajax.status == 200) {
					//update没有返回值
					// var notes_result = JSON.parse(deleteNotes_ajax.responseText);
					// console.log(deleteNotes_ajax.responseText);

					//更新数据
					_this.props.onclickDelete();
					
				} else {
					//dosomething
				}
			};
			deleteNotes_ajax.send("objectID="+deleteID);

		}
		if (editID) {
			console.log("editID:"+editID);
		}
	}

	render() {
		var notes = this.props.firstTagNote;
		return(
			<div className="notes_box" onClick={this.noteClick.bind(this)}>
				{
					notes.map(function(value, index) {
						return <li key={value._id}>
						<span data-deleteid={value._id}>delete</span>
						<a className="note_edit" data-editid={value._id}>edit</a>
						<a className="note_title" href={'/notes/'+value.author+'/'+value._id} data-noteid={value._id} key={value.title} >{value.title}</a>
						</li>;
					})
				}
			</div>
		);
	}
}

export default Notes_box;
