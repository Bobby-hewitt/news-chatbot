const DB = require('../helpers/db')
const responseTemplate = require('../helpers/responseTemplate')
const feedEmojis = require('../helpers/feedEmojis')

module.exports = function(reqBody){
	let fbId = reqBody.originalRequest.data.sender.id
	
	return new Promise((resolve, reject) => {
		let db = new DB({fbId: fbId})
		let responseProto = []

		responseProto.push({
			type:'text',
			text: 'Here are your current favorites 👇'		
		})
		db.getData('/favorites').then((categories) => {
			for (var i = 0; i < categories.length; i++){
				let category = {
					type: 'text',
					text: categories[i] + feedEmojis[categories[i]]
				}
				responseProto.push(category)
			}
			responseProto.push({
				type:'buttons',
				text:'What would you like to do?',
				buttons: [
				{
					type: 'postback',
					title: 'Remove a category',
					payload: 'remove category from favorites'
				},
				{
					type: 'postback',
					title: 'Add a category',
					payload: 'add category to favorites'
				},
				{
					type: 'postback',
					title: 'Continue with these',
					payload: 'select category'
				}]
			})
			let response = responseTemplate(responseProto)
			resolve(response)


			
		})
	})
	

}