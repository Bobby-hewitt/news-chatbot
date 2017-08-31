const feedEmojis = require('../helpers/feedEmojis')
const DB = require('../helpers/db')
const responseTemplate = require('../helpers/responseTemplate')


module.exports = function(reqBody){
	return new Promise((resolve, reject) => {
		let fbId = reqBody.originalRequest.data.sender.id
		let db = new DB({fbId})
		db.getData('/favorites').then((favorites) => {
			let categories;
			if (favorites){
				categories = favorites
			} else {
				categories = ['Top Stories', 'Politics', 'World', 'Sport', 'Business',  'Health', 'Education', 'Science', 'Technology', 'Entertainment', 'Gossip']
				db.setData('favorites', categories)
			}
			console.log(categories)
			let replies = []
			for (var i = 0; i < categories.length; i++){
				let reply = {
			 		"content_type":"text",
			        "title":categories[i] + feedEmojis[categories[i]],
			        "payload":'remove ' + categories[i] + ' from favorites',
				}
				replies.push(reply)
			}

			let response = responseTemplate([
				{
					type: 'quickReplies',
					text: 'Which favorite shall we remove?',
					replies: replies
				}
			])
			resolve(response)
		})
	})

}