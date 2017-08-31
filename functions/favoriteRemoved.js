let DB = require('../helpers/db')
const responseTemplate = require('../helpers/responseTemplate')


module.exports = function(reqBody){
	return new Promise((resolve, reject) => {
		let fbId = reqBody.originalRequest.data.sender.id
		let db = new DB({fbId})
		let feed = reqBody.result.parameters.feed
		db.getData('/favorites').then((favorites) => {
			let categories;
			if (favorites){
				categories = favorites
			} else {
				categories = ['Top Stories', 'World', 'Sport', 'Entertainment', 'Gossip']
				db.setData('favorites', categories)
			}
			let index = categories.indexOf(feed)
			categories.splice(index, 1)
			db.setData('/favorites', categories)
			console.log(categories)
			let response = responseTemplate([{
				type: 'text',
				text: 'Bye bye ' + feed + ' 👋'
			},{
				type: 'buttons',
				text: 'What now?',
				buttons: [
				{
					type: 'postback',
					title: 'Remove another category',
					payload: 'remove category from favorites'
				},
				{
					type: 'postback',
					title: 'Add a category',
					payload: 'add category to favorites'
				},
				{
					type: 'postback',
					title: 'See the news',
					payload: 'select category'
				}]
			}])
			resolve(response)
		})
	})
}