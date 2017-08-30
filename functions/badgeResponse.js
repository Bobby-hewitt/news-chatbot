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
	'Magazine': '💑',
	'LatestStories': '',
}

module.exports = function(num, arr, feed, fbId){
	let badge = ''
	let badgeNames = ['NEWS MASHER 🤠', 'CASUAL SURFER 🏄🏽', 'INTRIGUED 🤔', 'THINKER 🤓', 'GRADUATE 👩‍🎓', 'NEWS DETECTIVE 🕵🏻‍♀️', 'NEWS FARMER 👨‍🌾','PROFESSOR OF NEWS 👩🏻‍🏫', 'NEWS KING 👑', 'WORLD CLASS MASHER 🌎' ]
	for (var i = 0; i < arr.length; i ++){
		if (num === arr[i]){
			badge = badgeNames[i]
		}
	}
	let userBadges;
	
	let db = new DB({fbId: fbId})
	db.getData('/badges').then((badges) => {
		if (badges){
			userBadges = badges
			userBadges.push(badge)
		} else {
			userBadges = [badge]
		}
		db.setData('badges', userBadges)
	})



	return new Promise((resolve, reject) => {
		let response = responseTemplate([
			
			{
				type: 'text',
				text: 'Congratulations'
			},
			{
				type: 'text',
				text: '🎉🎉🎉🎉🎉🎉🎉'
			},
			{
				type: 'text',
				text: "You've viewed " + num.toString() + ' aritcles'
			},
			{
				type: 'buttons',
				text: "You've won the " + badge + ' badge',
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
	})
}