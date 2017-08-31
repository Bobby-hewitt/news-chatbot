const DB = require('../helpers/db')
const responseTemplate = require('../helpers/responseTemplate')
const badgeResponse = require('./badgeResponse')

module.exports = function(reqBody){
	return new Promise((resolve, reject) => {
		let fbId = reqBody.originalRequest.data.sender.id
		let db = new DB({fbId})
		db.getData('/favorites').then((favorites) => {
			if (favorites){
				let categories = favorites
				let feed = reqBody.result.parameters.feed
				categories.push(feed)
				let response = responseTemplate([{
						type: 'text',
						text: "Great 👍. " + feed + ' is now in your favorites.'
					},{
						type: 'buttons',
						text: 'What now?',
						buttons: [
					{
						type: 'postback',
						title: 'Remove a category',
						payload: 'remove a category from favorites'
					},
					{
						type: 'postback',
						title: 'Add another category',
						payload: 'add category to favorites'
					},
					{
						type: 'postback',
						title: 'See the news',
						payload: 'select category'
					}]
				}])
				resolve(response)



				db.setData('favorites', categories)
				console.log(categories)
			} 
		})
	})
}