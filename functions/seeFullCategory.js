const DB = require('../helpers/db')
const responseTemplate = require('../helpers/responseTemplate')

module.exports = function(reqBody){
	return new Promise((resolve, reject) => {
		let fbId = reqBody.originalRequest.data.sender.id
		let db = new DB({fbId})
		let menus = { 
			Sport: ['Sport','Football','Tennis','Cricket','Golf','Snooker','Rugby Union','Rugby League'],
			UK: ['UK','England','Northern Ireland','Scotland','Wales'],
			World: ['World','Africa','Asia','China','India','Australia','Europe','Latin America','Middle East','US And Canada']
		}
		
		let feed = reqBody.result.parameters.feed
		let items = menus[feed]
		console.log(items)
		let replies = []
		for (var i = 0; i < items.length; i++){
			let obj = {
				content_type: 'text',
				title: items[i],
				payload: 'Add ' + items[i] + ' to favorites'
			}
		replies.push(obj)
		}
		
		
		response = responseTemplate([
				{
					type: 'quickReplies',
					text: 'Ok, select a category to add to favorites 👇',
					replies: replies
				}])
				resolve(response)


	})
}
