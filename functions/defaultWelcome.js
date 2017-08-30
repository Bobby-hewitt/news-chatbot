const DB = require('../helpers/db')
const request = require('request')
const responseTemplate = require('../helpers/responseTemplate')

// takes same route if FB data is fetched.   If err check this.

module.exports  = function(reqBody){
	return new Promise((resolve, reject) => {
		let fbId = reqBody.originalRequest.data.sender.id
		let db = new DB({fbId})
		db.setData('id', fbId)
		getFBData(fbId).then((data) => {
			constructResponse(data).then((response) => {resolve(response)})
			db.setData('fbData', {
				fbData: data		
			})
		})
		.catch((err) => {
			constructResponse(data).then((response) => {resolve(response)})
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

function constructResponse(data, resolve){

	let feedEmojis = {
		'Top Stories': ' 🤙',
		'World': ' 🌍',
		'UK': ' 🇬🇧',
		'England': '',
		'NorthernIreland': '',
		'Scotland': '',
		'Wales': '',
		'Business': ' 🤝',
		'Politics': ' 🏛',
		'Health': ' 🚑',
		'Education': ' 👩‍🏫',
		'Science/Nature': ' 🔬',
		'Technology': ' 📱',
		'Entertainment': ' 🎞',
		'HaveYourSay': ' ✋',
		'Gossip': ' 💑',
		'Sport': ' ⚽',
	}

	return new Promise((resolve, reject) => {
		let categories = ['Top Stories', 'Politics', 'World', 'Sport', 'Business',  'Health', 'Education', 'Science', 'Technology', 'Entertainment', 'Gossip']
		let replies = []
		for (var i = 0; i < categories.length; i++){
			let reply = {
		 		"content_type":"text",
		        "title":categories[i] + feedEmojis[categories[i]],
		        "payload":categories[i],
			}
			replies.push(reply)
		}
		console.log(replies)
		let text0 = data.first_name ? 'Hey ' + data.first_name + '👋. What news do you want to look at? 🤷' : 'Hey , what would you like to look at? 🤷';
		let response = responseTemplate([
			{
				type: 'quickReplies',
				text: text0,
				replies: replies
			}
		])
		resolve(response)
	})
}