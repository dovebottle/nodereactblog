import React from 'react';

class Notes_box extends React.Component {
	noteClick(event) {
		console.log(event.target);
		var deleteID = event.target.getAttribute('data-deleteid');
		var editID = event.target.getAttribute('data-editid');
		if (deleteID) {
			console.log("deleteID:"+deleteID);
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
