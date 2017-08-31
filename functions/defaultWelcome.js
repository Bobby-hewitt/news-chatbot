const DB = require('../helpers/db')
const request = require('request')
const responseTemplate = require('../helpers/responseTemplate')
const feedEmojis = require('../helpers/feedEmojis')
// takes same route if FB data is fetched.   If err check this.

module.exports  = function(reqBody){
	return new Promise((resolve, reject) => {
		let fbId = reqBody.originalRequest.data.sender.id
		let db = new DB({fbId})
		db.setData('id', fbId)
		getFBData(fbId).then((data) => {
			db.getData('/favorites').then((favorites) => {
				if (favorites){
					constructResponse(data, favorites, true).then((response) => {resolve(response)})
				} else {
					let favorites = ['Top Stories', 'World', 'Sport', 'Entertainment', 'Gossip']
					db.setData('favorites', favorites)
					constructResponse(data, favorites).then((response) => {resolve(response)})
				}
			})
			
			db.setData('fbData', {
				fbData: data,

			})
		})
		.catch((err) => {
			db.getData('/favories').then((favorites) => {
				if (favorites){
					constructResponse(data, favorites, true).then((response) => {resolve(response)})
				} else {
					let favorites = ['Top Stories', 'World', 'Sport', 'Entertainment', 'Gossip']
					db.setData('favorites', favorites)
					constructResponse(data, favorites).then((response) => {resolve(response)})
				}
			})
			db.setData('fbData', {
				id: fbId		
			})
		})
	})
}


function getFBData(fbID, callback){
	return new Promise((resolve, reject) => {
		const userFieldSet = 'id, first_name, last_name';
		const options = {
			method: 'GET',
			uri: 'https://graph.facebook.com/v2.6/' + fbID,
			qs: {
				access_token: "EAALzeS4exqEBADqmKUoM50IJPRf60YLCZBwbg1rMPXGQtNaCsmWQO6kv9SbRdGyhMCzHHWo5GcZB0XlAnm3Rom3ZBwlCq57k5wFSw22VEAZAu2EfPRDZCMhaD6BwFjCe4kJVqLyLvZBHkP62yJCFgROlEZAM9jhWjTT2opQa9OZCjJWXjk8gEj5y",
				fields: userFieldSet
			}
		};
		request(options, function(err, data, body){
			if(err){
				reject();
			}else{
				resolve(JSON.parse(body));
			}
		})

	})	
}

function constructResponse(data, categories, existingFavorites){

	return new Promise((resolve, reject) => {
		
		let text0 = data.first_name ? 'Hey ' + data.first_name + ' 👋' : 'Hey' + ' 👋';
		let text1 = existingFavorites ? 'Welcome back to News Mash.' : 'Welcome to News Mash.  We bring you the latest news on your favorite topics. '
		let text2 = existingFavorites ? 'Would you like to edit your favorite categories? 🤷' : 'We have set you up with some favorite categories to get you started. Would you like to customise them now? 🤷';
		let responseProto = [
			{
				type: 'text',
				text: text0
			},
			{
				type: 'text',
				text: text1
			},
			{
				type: 'quickReplies',
				text: text2,
				replies: [
				{
					content_type: 'text',
					title: '👍',
					payload: 'edit favorites'
				},{
					content_type: 'text',
					title: '👎',
					payload: 'do not edit categories now'
				}]
			}
		]
		let response = responseTemplate(responseProto)
		resolve(response)
	})
}