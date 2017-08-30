const DB = require('../helpers/db')
const responseTemplate = require('../helpers/responseTemplate')
const badgeResponse = require('./badgeResponse')

module.exports = function(reqBody, intro){

	

	return new Promise((resolve, reject) => {
		console.log('IN SHOW ANOTHER')
		let badgeBreaks = [5,15,30,50, 100, 150, 200, 300, 400, 500]
		let feed;
		let context = reqBody.result.contexts.find(c => c.name === "persistentfeed");
		if (context){
			feed = context.parameters.feed
			console.log('getting feed from context: ', feed)
		} 
		if (!feed){
			console.log('getting feed from params: ', feed)
			feed = reqBody.result.parameters.feed
		}

		console.log('FEED = ',feed)
		let fbId = reqBody.originalRequest.data.sender.id
		let newsIndex;
		let generalIndex;
		let user = new DB({fbId})
		let db = new DB({fbId: 'feeds'})
		
		db.getData(feed).then((feedData) => {
			user.getData('/feeds/').then((ud) => {
				console.log("USER DATA: ",  ud)
				if (ud){
					if (ud[feed]){
						let userCategoryData = ud[feed]
						newsIndex = userCategoryData
					} else {
						newsIndex = 0;
					}
					if (ud.general){
						generalIndex = ud.general
						for (var i = 0; i < badgeBreaks.length; i++){
							if (badgeBreaks[i] === generalIndex){
								console.log('found badge')
								user.setData('feeds/' + 'general', generalIndex + 1)
								badgeResponse(generalIndex,badgeBreaks, feed, fbId).then((response) => {
									resolve(response)
								})
								return
							}
						}

					} else {
						generalIndex = 0
					}
					
				} else {
					newsIndex = 0
					generalIndex = 0
				}
				user.setData('feeds/' + feed, newsIndex + 1)
				user.setData('feeds/general', generalIndex + 1)
				console.log(feedData[newsIndex % 20], feedData.length, newsIndex)
				constructResponse(feedData[newsIndex % 20], feed, intro).then((response) => {
					resolve(response)
				})

			})
		})
	})
}


function constructResponse(data, feed, intro){
	
	let feedEmojis = {
		'Top Stories': '🤙',
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
		'Science': '🔬',
		'Technology': '📱',
		'Entertainment': '🎞',
		'HaveYourSay': '✋',
		'Gossip': '💑',
		'LatestStories': '',
		'Sport': '⚽️'
	}

	return new Promise((resolve, reject) => {
		let confirmationText = ['Great 👍 ', 'Ok 🖖 ', 'Sure thing 🤙 ', 'Alright then 👌 ', 'Right 👉 ', 'Sweet 🙌 ']
		let confirmationSelector = Math.floor(Math.random() * (confirmationText.length-1))
		let fullArticleText = ['See article 🕵', 'Tell me more 👂', "I'm interested 👀", '']
		let fullArticleSelector = Math.floor(Math.random()*(fullArticleText.length-1))
		let anotherCategoryText = ['Another category 🙏', feed + ' = 💩', 'Bored of ' + feed + '👐', "🦆 out of " + feed, '']
		let anotherCategorySelector = Math.floor(Math.random() * (anotherCategoryText.length-1))
		let content; 

		let url = data.media.thumbnail[0].url[0]
		let context = [
			{"name":"feed", "lifespan":2, "parameters":{"feed": feed}}, 
			{"name":"persistentFeed", "lifespan":99, "parameters":{"feed": feed}}
		]
		console.log('INTRO: ',intro)
		if (intro){
			content = [
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
		} else {
			content = [
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
					        "title":"More on " + feed + ' ' + feedEmojis[feed],
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
		}
	


		let response = responseTemplate(content, context)
		resolve(response)
	})
}