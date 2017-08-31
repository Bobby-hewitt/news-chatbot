const DB = require('../helpers/db')
const responseTemplate = require('../helpers/responseTemplate')

module.exports = function(reqBody){
	let category;
	let persistentfeed = reqBody.result.contexts.find( c => c.name === 'persistentfeed')
	if (persistentfeed){
		category = persistentfeed.parameters.feed
	}

	return new Promise((resolve, reject) => {
		let fbId = reqBody.originalRequest.data.sender.id
		let db = new DB({fbId: fbId})
		let badgesArr = [{
			type: 'text',
			text: 'Here are your badges'
		},{
			type: 'text',
			text: '🎉🎉🎉🎉🎉'
		}]
		db.getData('/badges').then((badges) => {
			for (var i = 0; i < badges.length; i++){
				let obj = {
					type: 'text',
					text: badges[i]
				}
				badgesArr.push(obj)
			}
			badgesArr.push({
				type: 'text',
				text:'...'
			})
			let buttons = {
				type: 'buttons',
				text: "Let's get back to the news.",
				buttons: [{
					type: 'postback',
					title: "OK 😀",
					payload: category ? category : 'select category'
				}]
			}
			badgesArr.push(buttons)
			let response = responseTemplate(badgesArr, null)
		resolve(response)
	})

		

		

	})
	
}