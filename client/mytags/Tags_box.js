import React from 'react';

class Tags_box extends React.Component {
	handleClick(event) {
		var _this = this;
		var eventTarget = event.target;
		var tagTarget = eventTarget.getAttribute('data-name');

		if (tagTarget) {
			//目标变色
			var tagsArr = eventTarget.parentNode.getElementsByTagName('a');
			for (var i = 0; i < tagsArr.length; i++ ) {
				tagsArr[i].style.backgroundColor = '#fff';
				tagsArr[i].style.color = '#2c2df0';
			}
			eventTarget.style.backgroundColor = '#412CD8';
			eventTarget.style.color = '#fff';
			
			//发请求改变笔记数据
			var newTag = new XMLHttpRequest();
			newTag.open('post', '/tagToNote');
			newTag.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");
			newTag.onreadystatechange = function() {
				if (newTag.readyState == 4 && newTag.status == 200) {
					var newTag_result = JSON.parse(newTag.responseText);
					_this.props.onclickTag(newTag_result);
				} else {
					//dosomething
				}
			};
			newTag.send("tag="+tagTarget);
		}
	}

	render() {
		var tags = Object.keys(this.props.tagsobj);
		// console.log(tags);
		return(
			<div className="tags_box" onClick={this.handleClick.bind(this)}>
				{
					tags.map(function(value, index) {
						return <a href="javascript:void(0);" key={value} data-name={value}>{value}</a>;
					})
				}
			</div>
		);
	}
}

export default Tags_box;
