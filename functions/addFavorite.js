const DB = require('../helpers/db')
const responseTemplate = require('../helpers/responseTemplate')
const badgeResponse = require('./badgeResponse')


module.exports = function(reqBody){
	// some categories have sub categories, create an object to check for this.
	let hasSubCategories = {
		Sport: true,
		UK: true,
		World: true
	}

	return new Promise((resolve, reject) => {
		// Array of catgories to map over.
		let categories = ['Top Stories','Business','Politics','Health','Education','Science','Technology','Entertainment','Gossip']
		let fbId = reqBody.originalRequest.data.sender.id
		let db = new DB({fbId: fbId})
		db.getData('/favorites').then((favorites) => {
			
			if (favorites){
				// Facebook quick replies limited to 11.  Ensure that this number is never exceeded
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
				
				// if less than 10 favorites remove current categories from favorites.
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

			//create replies response
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
				
			}
			let backButton = {
						content_type: 'text',
						title: "Don't add anything",
						payload: 'See categories'
					}
			replies.push(backButton)
			response = responseTemplate([
				{
					type: 'quickReplies',
					text: 'Ok, select a category to add to favorites 👇',
					replies: replies
				}])
			resolve(response)
		})
	})
}


