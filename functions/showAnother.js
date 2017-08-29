const DB = require('../helpers/db')
const responseTemplate = require('../helpers/responseTemplate')

module.exports = function(reqBody){
	return new Promise((resolve, reject) => {
		let feed;
		let context = reqBody.result.contexts.find(c => c.name === "feed");
		if (context){
			feed = context.parameters.feed
		} else {
			let context2 = reqBody.result.contexts.find(c => c.name === "persistentfeed");
			let feed2 = context2.parameters.feed
			constructContinueResponse(feed2).then((response) => {
				resolve(response)
			})
		}
		let fbId = reqBody.originalRequest.data.sender.id
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


function constructContinueResponse(feed){
	return new Promise((resolve, reject) => {
		let response = responseTemplate([
			{
				type: 'buttons',
				text: 'Would you like to continue with ' + feed + ' or check out another category?',
				buttons: [
					{
						"type":"postback",
						"payload":'tell me about ' + feed,
	  
				        "title":"Continue with " + feed,
					},
					{
						"type":"postback",
				        "title":"Another Category",
				        "payload":"Another category ",
					},
				]
			}
		])
		resolve(response)
	})
}

function constructResponse(data, feed){
	return new Promise((resolve, reject) => {
		let url = data.media.thumbnail[0].url[0]
		let response = responseTemplate([
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
  
			        "title":"See full article",
				},
				{
					"type":"postback",
			        "title":"Something else",
			        "payload":"Something else ",
				},
			]
		}

		])
		resolve(response)
	})


}