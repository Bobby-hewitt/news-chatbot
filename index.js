const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const firebase = require('firebase')

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
//listen on local or public host
var PORT = process.env.PORT || 9000
app.listen(PORT, function(){
	console.log('App listening on: ' +  PORT)
})

const whichFeed = require('./functions/whichFeed')
const defaultWelcome = require('./functions/defaultWelcome')
const showAnother = require('./functions/showAnother')
const selectCategory = require('./functions/selectCategory')
const seeBadges = require('./functions/seeBadges')

const getNews  = require('./getNews')
var config = {
	apiKey: "AIzaSyC2Om0Hc0agcgrMOgYclznvshTr1zWwIhY",
    authDomain: "newsmash-b80c5.firebaseapp.com",
    databaseURL: "https://newsmash-b80c5.firebaseio.com",
    projectId: "newsmash-b80c5",
    storageBucket: "newsmash-b80c5.appspot.com",
    messagingSenderId: "755127663343"
};
let FirebaseApp = firebase.initializeApp(config);

setInterval(()=>{
	console.log('GETTING NEWS')
	getNews()
},200000)

app.post('/webhook', function(req, res){

	console.log('asdasdasd')

	let intentName = req.body.result.metadata.intentName
		console.log('WEBHOOK RECEIVED: ', intentName)

	switch(intentName){

		case 'Default Welcome Intent':
			defaultWelcome(req.body).then((result) => {
				res.json(result)
			})
		return

		case 'Default Fallback Intent':
		case 'Choose Category':
			selectCategory().then((result) => {
				res.json(result)
			})
		return

		case 'Category Selected':
		case 'Which Feed': 
		case 'Show Another':
		let intro = true
		if(intentName === 'Show Another'){ intro = false }
			showAnother(req.body ,intro).then((result) => {
				res.json(result)
			})
		break

		case 'See All Badges':
			seeBadges(req.body).then((result) => {
				res.json(result)
			})
		return
	}
})


// EAALzeS4exqEBADqmKUoM50IJPRf60YLCZBwbg1rMPXGQtNaCsmWQO6kv9SbRdGyhMCzHHWo5GcZB0XlAnm3Rom3ZBwlCq57k5wFSw22VEAZAu2EfPRDZCMhaD6BwFjCe4kJVqLyLvZBHkP62yJCFgROlEZAM9jhWjTT2opQa9OZCjJWXjk8gEj5y