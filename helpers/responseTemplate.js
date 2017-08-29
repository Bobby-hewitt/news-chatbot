module.exports = function(items,contexts){

	let processedItems = []

	for (var i =0; i<items.length; i++){
		switch (items[i].type){
			case 'buttons':
				let buttons = generateButtons(items[i].text, items[i].buttons)
				processedItems.push(buttons)
			break
			case 'text':
				let text = generateText(items[i].text)
				processedItems.push(text)
			break
			case 'image': 
				let image = generateImage(items[i].url)
				processedItems.push(image)
			break
			case 'genericTemplate':
				let genericTemplate = generateGenericTemplate(items[i].elements)
				processedItems.push(genericTemplate)
			break
			case 'quickReplies': 
				let quickReplies = generateQuickReplies(items[i].text, items[i].replies)
				processedItems.push(quickReplies)
			break
		}
	}
	return({
		"contextOut": contexts,
		"data":{
			"facebook": processedItems
		}
	})
}



function generateButtons(text, buttons){
	return({
	    "attachment": {
	      "type": "template",
	      "payload": {
	        "template_type": "button",
	        "text": text,
	        "buttons": buttons,
	      }
	    }
	})
}

function generateText(text){
	return({
		"text": text
	})
}

function generateGenericTemplate(elements){
	return({
		"attachment":{
			"type":"template",
			"payload":{
				"template_type":"generic",
				"elements": elements
			}
		}  

	})
}

function generateImage(url){
	return({
		"attachment":{
	      "type":"image",
	      "payload":{
	        "url":url
	      }
	    }
    })
}

function generateQuickReplies(text, replies){
	return({
	"text": text,
    "quick_replies":[
      {
        "content_type":"text",
        "title":"See full article",
        "payload":"See full article",
       
      },
      {
        "content_type":"text",
        "title":"Something Else",
        "payload":"Show something else"
      }
    ]

	})
}



