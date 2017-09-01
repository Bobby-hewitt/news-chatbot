const DB = require('../helpers/db')
const responseTemplate = require('../helpers/responseTemplate')

module.exports = function(reqBody){
	return new Promise((resolve, reject) => {
		let fbId = reqBody.originalRequest.data.sender.id
		let db = new DB({fbId})

		db.getData('favorites').then((favorites) => {
			console.log(favorites)
			let menus = { 
				Sport: ['Sport','Football','Tennis','Cricket','Golf','Snooker','Rugby Union','Rugby League'],
				UK: ['UK','England','Northern Ireland','Scotland','Wales'],
				World: ['World','Africa','Asia','China','India','Australia','Europe','Latin America','Middle East','US And Canada']
			}
			
			let feed = reqBody.result.parameters.feed
			let items = menus[feed]


			for (var i = 0; i < items.length; i++){
				for (var j = 0; j < favorites.length; j++){
					if (items[i] === favorites[j]){
						items.splice(i,1)
					}
				}
			}
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
			let goBack = {
				content_type: 'text',
				title: 'Go back 🔺',
				payload: 'add category to favorites'
			}
			replies.push(goBack)
			
			
			response = responseTemplate([
				{
					type: 'quickReplies',
					text: 'Ok, select a category to add to favorites 👇',
					replies: replies
				}
			])
			resolve(response)

		})



	})
}
