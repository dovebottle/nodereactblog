import React from 'react';

class Notes_box extends React.Component {
	render() {
		var notes = this.props.firstTagNote;
		console.log(notes);
		return(
			<div className="notes_box">
				{
					notes.map(function(value, index) {
						return <a href="" data-noteid={value._id} key={value.title} >·{value.title}</a>;
					})
				}
			</div>
		);
	}
}

export default Notes_box;
