import React from 'react';
import ReactDOM from 'react-dom';
import Tags_box from './Tags_box.js';
import Notes_box from './Notes_box.js';
import styles from './mytags.scss';//scss导入

class Notes extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tagsobj: {},
			firstTagNote:[]
		};
	}

	componentDidMount() {
		var _this = this;
		var mytags_ajax = new XMLHttpRequest();
		mytags_ajax.open('post', '/mytags');
		mytags_ajax.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");
		mytags_ajax.onreadystatechange = function() {
			if (mytags_ajax.readyState == 4 && mytags_ajax.status == 200) {
				var tags_result = JSON.parse(mytags_ajax.responseText);
				// console.log(tags_result);

				//获得第一个标签
				var tags_first = Object.keys(tags_result)[0];
				// console.log(tags_first);

				//取第一个标签获得第一组文章
				var firstNotes_ajax = new XMLHttpRequest();
				firstNotes_ajax.open('post', '/tagToNote');
				firstNotes_ajax.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");
				firstNotes_ajax.onreadystatechange = function() {
					if (firstNotes_ajax.readyState == 4 && firstNotes_ajax.status == 200) {
						var notes_result = JSON.parse(firstNotes_ajax.responseText);
						// console.log(notes_result);

						//设置数据
						_this.setState({
							tagsobj: tags_result,
							firstTagNote: notes_result
						});
					} else {
						//dosomething
					}
				};
				firstNotes_ajax.send("tag="+tags_first);
			} else {
						// dosomething
			}
		};
		mytags_ajax.send();
	}

	render() {
		return(
			<div className="mytags_react">
			<Tags_box tagsobj={this.state.tagsobj} />
			<Notes_box firstTagNote={this.state.firstTagNote} />
			</div>
		);
	}
}

ReactDOM.render(<Notes/>,document.getElementById("mytags_box"));