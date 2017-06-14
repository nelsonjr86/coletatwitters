db.tweets.find().snapshot().forEach( function (el) {
el.text = el.text.split(' ');
db.temp.save(el);
});