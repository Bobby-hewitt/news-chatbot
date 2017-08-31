let responseTemplate = require('../helpers/responseTemplate')
let DB = require('../helpers/db')

const feedEmojis = {
	'Headlines': '🤙',
	'World': '🌍',
	'UK': '🇬🇧',
	'England': '',
	'NorthernIreland': '',
	'Scotland': '',
	'Wales': '',
	'Business': '🤝',
	'Politics': '🏛',
	'Health': '🚑',
	'Education': '👩‍',
	'Science': '🔬',
	'Technology': '📱',
	'Entertainment': '🎞',
	'HaveYourSay': '✋',
	'Gossip': '💑',
	'LatestStories': '',
	'Sport': '⚽️'
}

module.exports = function(num, arr, feed, fbId){
	return new Promise((resolve, reject) => {
	let name;
	let badge = ''
	let badgeNames = ['🏆 NEWS MASHER 🤠', '🏆 CASUAL SURFER 🏄🏽', '🏆 INTRIGUED 🤔', '🏆 THINKER 🤓', '🏆 GRADUATE 👩‍🎓', '🏆 NEWS DETECTIVE 🕵🏻‍♀️', '🏆 NEWS FARMER 👨‍🌾','🏆 PROFESSOR OF NEWS 👩🏻‍🏫', '🏆 NEWS KING 👑', '🏆 WORLD CLASS MASHER 🌎' ]
	for (var i = 0; i < arr.length; i ++){
		if (num === arr[i]){
			badge = badgeNames[i]
		}
	}
	let userBadges;
	
	let db = new DB({fbId: fbId})
	db.getData('/').then((data) => {
		if (data && data.fbData && data.fbData.fbData && data.fbData.fbData.first_name){
				name = data.fbData.fbData.first_name
				console.log(name)
			} else {
				name = ''
			}
		if (data.badges){
			userBadges = data.badges
			userBadges.push(badge)
		} else {
			userBadges = [badge]
		}
				let response = responseTemplate([
			
			{
				type: 'text',
				text: 'Congratulations ' + name
			},
			{
				type: 'text',
				text: "You've read " + num.toString() + ' aritcles'
			},
			{
				type: 'buttons',
				text: "You've earned the " + badge + ' badge',
				buttons: [{
					type: 'postback',
					payload: 'See all badges',
					title: 'See badges 🙌'
				}, 
				{
					type: 'postback',
					payload: feed,
					title: 'Next article 👇'
				}]
 			},
			{

			}
		])
		resolve(response)
		db.setData('badges', userBadges)
	})



	

	})
}