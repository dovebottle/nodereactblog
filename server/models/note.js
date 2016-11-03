var mongodb = require('./db');

function Note(note) {
	this.author = note.author,
	this.title = note.title;
	this.content = note.content;
	this.tags = note.tags;
	this.time = note.time;
}

module.exports = Note;

//根据作者和文章id，返回文章
Note.getNoteByAuthorNoteid = function(author, noteid, callback) {

	var BSON_id = require('mongodb').ObjectID.createFromHexString(noteid);

	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		db.collection('note', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			//查找文章
			collection.find({
				author: author,
				delete: false,
				_id: BSON_id
			}).toArray(function(err, notes) {
				console.log(notes);
				mongodb.close();
				if (err) {
					return callback(err);
				}
				if (notes.length > 0) {
					var time = notes[0].time.getFullYear() + "-" + (notes[0].time.getMonth()+1) + "-" + notes[0].time.getDate();
					notes[0].time = time;
				}
				callback(null, notes);
			});
		});
	});
};

//获取一个做的所有标签，返回标签对象
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
				author: author,
				delete: false
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

//根据一个标签获取有该标签的文章
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
				delete: false,
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

//获取作者的所有文章
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
				author: author,
				delete: false
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
		time: this.time,
		delete: false
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