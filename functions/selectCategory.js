const responseTemplate = require('../helpers/responseTemplate')

module.exports = function(){
	return new Promise((resolve, reject) => {
		let categories = ['Top Stories 🤙', 'World 🌍', 'Business 🤝', 'Politics 🏛', 'Health 🚑', 'Education 👩‍🏫', 'Science 🔬', 'Technology 📱', 'Entertainment 🎞 ', 'Have Your Say ✋', 'Gossip 💑 ']
		let replies = []
		for (var i = 0; i < categories.length; i++){
			let reply = {
		 		"content_type":"text",
		        "title":categories[i],
		        "payload":categories[i],
			}
			replies.push(reply)
		}

		let response = responseTemplate([
			{
				type: 'quickReplies',
				text: 'You can choose from any of these categories..',
				replies: replies
			}
		])
		resolve(response)
	})
}