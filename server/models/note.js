var mongodb = require('./db');

function Note(note) {
	this.author = note.author,
	this.title = note.title;
	this.content = note.content;
	this.tags = note.tags;
	this.time = note.time;
}

module.exports = Note;

Note.gettags = function(author, callback) {
	var _this = this;

	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		db.collection('note', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			//通过作者找文章
			collection.find({
				author: author
			}).toArray(function(err, note) {
				var tagsobj = {};
				if (note.length > 0) {
					for (var i = 0; i < note.length; i++) {
						if (note[i].tags.length > 0) {
							for(var j = 0; j < note[i].tags.length; j++){
								tagsobj[note[i].tags[j]] = 'default';
							}
						}
					}
				}
				mongodb.close();
				if (err) {
					return callback(err);
				}
				callback(null, tagsobj);
				// _this.getNoteByTagsobj(author, callback, tagsobj);
			});
		});
	});
};

Note.getNoteByTag = function(tag, author, callback) {
	// console.log(tag);

	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		db.collection('note', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}

			//通过tag找文章
			collection.find({
				author: author,
				tags: {$in:[tag]}
				// tags: {$in:['哈哈']}
			}).toArray(function(err, notes) {
				// console.log(notes);
				mongodb.close();
				if (err) {
					return callback(err);
				}
				// tagsobj[value] = notes;
				callback(null, notes);
			});
		});
	});
};

Note.get = function(author, callback) {
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		db.collection('note', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			//通过作者名字查找文章
			collection.find({
				author: author
			}).toArray(function(err, note) {
				if (note.length > 0) {
					for (var i = 0; i < note.length; i++) {
						var time = note[i].time.getFullYear() + "-" + (note[i].time.getMonth()+1) + "-" + note[i].time.getDate();
						note[i].time = time;
					}
				}
				// console.log(note);
				mongodb.close();
				if (err) {
					return callback(err);
				}
				callback(null, note);
			});
		});
	});
};

Note.prototype.save = function(callback) {
	var note = {
		author: this.author,
		title: this.title,
		content: this.content,
		tags: this.tags,
		time: this.time
	};

	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}

		db.collection('note', function(err, collection) {
			if (err) {
				return callback(err);
			}
			//插入
			collection.insert(note, {
				safe: true
			}, function(err, note) {
				mongodb.close();
				if (err) {
					return callback(err);
				}
				callback(null, note.ops[0]);
			});

		});
	});

};