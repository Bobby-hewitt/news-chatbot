const DB = require('./helpers/db')
const Feed = require('rss-to-json')

module.exports = function(){
	let feeds = {
		'Top Stories': 'https://feeds.bbci.co.uk/news/rss.xml?edition=uk',
		'World': 'https://feeds.bbci.co.uk/news/world/rss.xml?edition=uk',
		'UK': 'https://feeds.bbci.co.uk/news/uk/rss.xml?edition=uk',
		'Sport': 'http://feeds.bbci.co.uk/sport/rss.xml?edition=uk',
		'Business': 'https://feeds.bbci.co.uk/news/business/rss.xml?edition=uk',
		'Politics': 'https://feeds.bbci.co.uk/news/politics/rss.xml?edition=uk',
		'Health': 'https://feeds.bbci.co.uk/news/health/rss.xml?edition=uk',
		'Education': 'https://feeds.bbci.co.uk/news/education/rss.xml?edition=uk',
		'Science': 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml?edition=uk',
		'Technology': 'https://feeds.bbci.co.uk/news/technology/rss.xml?edition=uk',
		'Entertainment': 'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml?edition=uk',
		'Gossip': 'https://feeds.bbci.co.uk/news/magazine/rss.xml',
	}


	let keys = Object.keys(feeds)
	
	for (var i = 0; i < keys.length; i++){
		fetchRss(keys[i], feeds[keys[i]])
	}

}


function fetchRss(key, url){
	Feed.load(url, function(err, rss){
		if (err){
			console.log(err)
		} 
		let items = rss.items
		let db = new DB({fbId: 'feeds'})
		db.setData(key, items)
	});
}
