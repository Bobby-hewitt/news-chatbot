const feedEmojis = require('../helpers/feedEmojis')
const DB = require('../helpers/db')
const responseTemplate = require('../helpers/responseTemplate')


module.exports = function(reqBody){
	let fbId = reqBody.originalRequest.data.sender.id
	return new Promise((resolve, reject) => {
		let categories;
		let db = new DB({fbId})
		db.getData('/favorites').then((favorites) => {
			if (favorites){
				categories = favorites
			} else {
				categories = ['Top Stories', 'Politics', 'World', 'Sport', 'Business',  'Health', 'Education', 'Science', 'Technology', 'Entertainment', 'Gossip']
				db.setData('favorites', categories)
			}
			let replies = []
			for (var i = 0; i < categories.length; i++){
				let reply = {
			 		"content_type":"text",
			        "title":categories[i] + feedEmojis[categories[i]],
			        "payload":categories[i],
				}
				replies.push(reply)
			}

			let response = responseTemplate([
				{
					type: 'quickReplies',
					text: 'Which category would you like to browse?',
					replies: replies
				}
			])
			resolve(response)
		})
	})
}