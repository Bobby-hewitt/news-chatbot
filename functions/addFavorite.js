const DB = require('../helpers/db')
const responseTemplate = require('../helpers/responseTemplate')
const badgeResponse = require('./badgeResponse')


module.exports = function(reqBody){

	let hasSubCategories = {
		Sport: true,
		UK: true,
		World: true

	}

	return new Promise((resolve, reject) => {
		let categories = ['Top Stories','Business','Politics','Health','Education','Science','Technology','Entertainment','Gossip']
		let fbId = reqBody.originalRequest.data.sender.id
		let db = new DB({fbId: fbId})
		db.getData('/favorites').then((favorites) => {
			
			if (favorites){
				if (favorites.length > 10){
					let response1 = responseTemplate([{
						type: 'buttons',
						text: "You can't have more than 10 favorites.  Remove one in order to add another",
						buttons: [
						{
							type: 'postback',
							title: 'Remove category',
							payload: 'remove category from favorites'
						},
						{
							type: 'postback',
							title: 'See the news',
							payload: 'select category'
						}]
					}])
					resolve(response1)
					return
				}
				// FAVORITES.LENGTH
				for (var i = 0; i < favorites.length; i++){
					for (var j = 0; j < categories.length; j++){
						if (favorites[i] === categories[j]){
							categories.splice(j,1)
							console.log(categories, categories.length)
						}
					}
				}
			} 
			categories.push('Sport')
			categories.push('UK')
			categories.push('World')
			console.log(categories)
			let replies = []
			for (var i = 0; i < categories.length; i++){
				let obj;
				if (hasSubCategories[categories[i]]){
					obj = {
						content_type: 'text',
						title: categories[i] + ' 🔻',
						payload: 'See full category ' + categories[i]
					}
				} else { 
					obj = {
						content_type: 'text',
						title: categories[i],
						payload: 'Add ' + categories[i] + ' to favorites'
					}
				}
				replies.push(obj)
				response = responseTemplate([
				{
					type: 'quickReplies',
					text: 'Ok, select a category to add to favorites 👇',
					replies: replies
				}])
				resolve(response)
			}
		})
	})
}


