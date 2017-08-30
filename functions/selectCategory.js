const responseTemplate = require('../helpers/responseTemplate')

	let feedEmojis = {
		'Top Stories': ' 🤙',
		'World': ' 🌍',
		'UK': ' 🇬🇧',
		'England': '',
		'NorthernIreland': '',
		'Scotland': '',
		'Wales': '',
		'Business': ' 🤝',
		'Politics': ' 🏛',
		'Health': ' 🚑',
		'Education': ' 👩‍',
		'Science': ' 🔬',
		'Technology': ' 📱',
		'Entertainment': ' 🎞',
		'HaveYourSay': ' ✋',
		'Gossip': ' 💑',
		'LatestStories': '',
		'Sport': ' ⚽'
	}

module.exports = function(){
	return new Promise((resolve, reject) => {
		let categories = ['Top Stories', 'Politics', 'World', 'Sport', 'Business',  'Health', 'Education', 'Science', 'Technology', 'Entertainment',  'Gossip']
		let replies = []
		for (var i = 0; i < categories.length; i++){
			let reply = {
		 		"content_type":"text",
		        "title":categories[i] + feedEmojis[categories[i]],
		        "payload":categories[i],
			}
			replies.push(reply)
		}

		let response = responseTemplate([
			{
				type: 'quickReplies',
				text: 'You can choose from any of these categories..',
				replies: replies
			}
		])
		resolve(response)
	})
}