const DB = require('./helpers/db')
const Feed = require('rss-to-json')

module.exports = function(){
	let feeds = {
		'Top Stories': 'http://feeds.bbci.co.uk/news/rss.xml?edition=uk',
		'World': 'http://feeds.bbci.co.uk/news/world/rss.xml?edition=uk',
		'UK': 'http://feeds.bbci.co.uk/news/uk/rss.xml?edition=uk',
		'England': 'http://feeds.bbci.co.uk/news/england/rss.xml?edition=uk',
		'NorthernIreland': 'http://feeds.bbci.co.uk/news/northern_ireland/rss.xml?edition=uk',
		'Scotland': 'http://feeds.bbci.co.uk/news/scotland/rss.xml?edition=uk',
		'Wales': 'http://feeds.bbci.co.uk/news/wales/rss.xml?edition=uk',
		'Business': 'http://feeds.bbci.co.uk/news/business/rss.xml?edition=uk',
		'Politics': 'http://feeds.bbci.co.uk/news/politics/rss.xml?edition=uk',
		'Health': 'http://feeds.bbci.co.uk/news/health/rss.xml?edition=uk',
		'Education': 'http://feeds.bbci.co.uk/news/education/rss.xml?edition=uk',
		'Science': 'http://feeds.bbci.co.uk/news/science_and_environment/rss.xml?edition=uk',
		'Technology': 'http://feeds.bbci.co.uk/news/technology/rss.xml?edition=uk',
		'Entertainment': 'http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml?edition=uk',
		'HaveYourSay': 'http://feeds.bbci.co.uk/news/have_your_say/rss.xml?edition=uk',
		'Gossip': 'http://feeds.bbci.co.uk/news/magazine/rss.xml',
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
