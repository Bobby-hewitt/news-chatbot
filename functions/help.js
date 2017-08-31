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
					type: "text",
					text: "'See stories from another category'"
				},
				{
					type: "text",
					text: "'Edit my favorites'"
				},
				{
					type: "text",
					text: "'See my badges'"
				},
				{
					type: 'buttons',
					text: "But as you're here you can choose from the buttons below...",
					buttons: [
					{
						type: 'postback',
						payload: 'select category',
						title: 'See news'
					},
					{
						type: 'postback',
						payload: 'see my badges',
						title: 'See your badges'
					},
					{
						type: 'postback',
						payload: 'Edit favorites',
						title: 'see my favs'
					}
					]
				}
			])

			resolve(response)
			
		})



	})
	



}