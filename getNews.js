const DB = require('./helpers/db')
const Feed = require('rss-to-json')

module.exports = function(){
	let feeds = {
		'Top Stories': 'https://feeds.bbci.co.uk/news/rss.xml?edition=uk',
		'Business': 'https://feeds.bbci.co.uk/news/business/rss.xml?edition=uk',
		'Politics': 'https://feeds.bbci.co.uk/news/politics/rss.xml?edition=uk',
		'Health': 'https://feeds.bbci.co.uk/news/health/rss.xml?edition=uk',
		'Education': 'https://feeds.bbci.co.uk/news/education/rss.xml?edition=uk',
		'Science': 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml?edition=uk',
		'Technology': 'https://feeds.bbci.co.uk/news/technology/rss.xml?edition=uk',
		'Entertainment': 'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml?edition=uk',
		'Gossip': 'https://feeds.bbci.co.uk/news/magazine/rss.xml',

		'Sport': 'http://feeds.bbci.co.uk/sport/rss.xml?edition=uk',
		'Football':'http://feeds.bbci.co.uk/sport/football/rss.xml?edition=int',
		'Tennis': 'http://feeds.bbci.co.uk/sport/tennis/rss.xml?edition=uk',
		'Cricket': 'http://feeds.bbci.co.uk/sport/cricket/rss.xml?edition=uk',
		'Golf': 'http://feeds.bbci.co.uk/sport/golf/rss.xml?edition=uk',
		'Snooker': 'http://feeds.bbci.co.uk/sport/snooker/rss.xml?edition=uk',
		'Rugby Union': 'http://feeds.bbci.co.uk/sport/rugby-union/rss.xml?edition=uk',
		'Rugby League': 'http://feeds.bbci.co.uk/sport/rugby-league/rss.xml?edition=uk',

		'UK': 'https://feeds.bbci.co.uk/news/uk/rss.xml?edition=uk',
		'England': 'http://feeds.bbci.co.uk/news/england/rss.xml?edition=uk',
		'Northern Ireland': 'http://feeds.bbci.co.uk/news/northern_ireland/rss.xml?edition=uk',
		'Scotland': 'http://feeds.bbci.co.uk/news/scotland/rss.xml?edition=uk',
		'Wales': 'http://feeds.bbci.co.uk/news/wales/rss.xml?edition=uk',

		'World': 'https://feeds.bbci.co.uk/news/world/rss.xml?edition=uk',
		'Africa': 'http://feeds.bbci.co.uk/news/world/africa/rss.xml',
		'Asia': 'http://feeds.bbci.co.uk/news/world/asia/rss.xml',
		'China': 'http://feeds.bbci.co.uk/news/world/asia/china/rss.xml',
		'India': 'http://feeds.bbci.co.uk/news/world/asia/india/rss.xml',
		'Australia': 'http://feeds.bbci.co.uk/news/world/australia/rss.xml',
		'Europe': 'http://feeds.bbci.co.uk/news/world/europe/rss.xml',
		'Latin America': 'http://feeds.bbci.co.uk/news/world/latin_america/rss.xml',
		'Middle East': 'http://feeds.bbci.co.uk/news/world/middle_east/rss.xml',
		'US And Canada': 'http://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml'
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
