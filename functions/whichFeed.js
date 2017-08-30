const DB = require('../helpers/db')
const responseTemplate = require('../helpers/responseTemplate')
module.exports = function(feed, fbId){
	return new Promise((resolve, reject) => {
		let newsIndex;
		let user = new DB({fbId})
		let db = new DB({fbId: 'feeds'})
		db.getData(feed).then((feedData) => {
			user.getData('/feeds/' + feed).then((userData) => {
				if (userData){
					newsIndex = userData
				} else {
					newsIndex = 0
				}
				user.setData('feeds/' + feed, newsIndex + 1)

				constructResponse(feedData[newsIndex % 20], feed).then((response) => {
					resolve(response)
				})

			})
		})

	})
}

function constructResponse(data, feed){
	
	let feedEmojis = {
		'Headlines': '🤙',
		'World': '🌍',
		'UK': '🇬🇧',
		'England': '',
		'NorthernIreland': '',
		'Scotland': '',
		'Wales': '',
		'Business': '🤝',
		'Politics': '🏛',
		'Health': '🚑',
		'Education': '👩‍',
		'Science/Nature': '🔬',
		'Technology': '📱',
		'Entertainment': '🎞',
		'HaveYourSay': '✋',
		'Magazine': '💑',
		'LatestStories': '',
	}

	return new Promise((resolve, reject) => {
		let fullArticleText = ['See article 🕵', 'Tell me more 👂', "I'm interested 👀", '']
		let fullArticleSelector = Math.floor(Math.random()*(fullArticleText.length-1))
		let confirmationText = ['Great 👍 ', 'Ok 🖖 ', 'Sure thing 🤙 ', 'Alright then 👌 ', 'Right 👉 ', 'Sweet 🙌 ']
		let confirmationSelector = Math.floor(Math.random() * (confirmationText.length-1))
		let anotherCategoryText = ['Another category 🙏', feed + ' = 💩', 'Bored of ' + feed + '👐', "🦆 out of " + feed, '']
		let anotherCategorySelector = Math.floor(Math.random() * (anotherCategoryText.length-1))
		

		let url = data.media.thumbnail[0].url[0]
		let context = [
			{"name":"feed", "lifespan":2, "parameters":{"feed": feed}}, 
			{"name":"persistentFeed", "lifespan":99, "parameters":{"feed": feed}}
		]
		let content = [
			{
				type: "text",
				text: confirmationText[confirmationSelector] + " Here is the " + feed + ' news'

			},
			{
				type: "image",
				url: url
			},
			{
				type: 'text',
				text: data.title
			},

			{
				type: 'buttons',
				text: data.description,
				buttons: [
					{
						"type":"web_url",
						"url":data.url,
						"webview_height_ratio": "full",
				        "title":fullArticleText[fullArticleSelector],
					},
					{
						"type":"postback",
				        "title":"More on " + feed + feedEmojis[feed],
				        "payload":"Something else ",
					},
					{
						"type":"postback",
				        "title":anotherCategoryText[anotherCategorySelector],
				        "payload":"Another Category",
					}
				]
			}
		]
		let response = responseTemplate(content, context)
		resolve(response)
	})
}