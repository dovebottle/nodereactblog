import React from 'react';

class Tags_box extends React.Component {
	render() {
		var tags = Object.keys(this.props.tagsobj);
		// console.log(tags);
		return(
			<div className="tags_box">
				{
					tags.map(function(value, index) {
						return <a href="" key={value} data-name={value}>{value}</a>;
					})
				}
			</div>
		);
	}
}

export default Tags_box;
