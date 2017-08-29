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
	return new Promise((resolve, reject) => {
		let url = data.media.thumbnail[0].url[0]
		let context = [
			{"name":"feed", "lifespan":2, "parameters":{"feed": feed}}, 
			{"name":"persistentFeed", "lifespan":99, "parameters":{"feed": feed}}
		]
		let content = [
			{
				type: "text",
				text: "Sure thing. Here is what's going on in " + feed

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
	  
				        "title":"See full article",
					},
					{
						"type":"postback",
				        "title":"More " + feed + ' news',
				        "payload":"Something else ",
					},
					{
						"type":"postback",
				        "title":"Another Category",
				        "payload":"Another Category",
					}
				]
			}
		]
		let response = responseTemplate(content, context)
		resolve(response)
	})
}