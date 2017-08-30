const DB = require('../helpers/db')
const responseTemplate = require('../helpers/responseTemplate')

module.exports = function(reqBody){
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
				text: 'Select category',
				buttons: [{
					type: 'postback',
					title: "Let's get back to the news.",
					payload: 'select category'
				}]
			}
			badgesArr.push(buttons)
			let response = responseTemplate(badgesArr, null)
		resolve(response)
	})

		

		

	})
	
}