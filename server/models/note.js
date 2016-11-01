var mongodb = require('./db');

function Note(note) {
	this.author = note.author,
	this.title = note.title;
	this.content = note.content;
	this.tags = note.tags;
	this.time = note.time;
}

module.exports = Note;

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
				console.log(note);
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
		tegs: this.tags,
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