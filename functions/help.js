const responseTemplate = require('../helpers/responseTemplate')
let DB = require('../helpers/db')

module.exports = function(reqBody){
	return new Promise((resolve, reject) => {
		let name;
		let fbId = reqBody.originalRequest.data.sender.id
		db = new DB({fbId})
		db.getData('/').then((data) => {
			console.log(data)
			if (data && data.fbData && data.fbData.fbData && data.fbData.fbData.first_name){
				name = data.fbData.fbData.first_name
			} else {
				name = ''
			}

			let repliesProto = ['Change category', 'Edit favorites', 'See badges', 'Start again']
			let replies = []

			for (var i = 0; i < repliesProto.length; i++){

				let obj = {
			 		"content_type":"text",
			        "title":repliesProto[i],
			        "payload":repliesProto[i],
				}
				replies.push(obj)
			}


			let response = responseTemplate([
				{
					type: "text",
					text: "No problem, " + name
				},
				{
					type: "text",
					text: "There is nothing wrong with getting stuck once in a while.😳"
				},
				{
					type: "text",
					text: "Here are some things you can say: "
				},
				{
					type: 'quickReplies',
					text: "Since you're here you can choose from the buttons below, but remember you can type these commands at any time.",
					replies: replies
				}
			])

			resolve(response)
			
		})



	})
	



}