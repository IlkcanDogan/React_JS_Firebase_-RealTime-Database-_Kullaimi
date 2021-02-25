const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const iconUrl = 'https://firewebhostingg.web.app/iot-logo.png';

function SendPush (pTitle, pBody, pIconUrl, pToken) {
	const payload = {
		notification : {
			title: pTitle,
			body : pBody,
			icon : pIconUrl
		}
	}
	admin.messaging().sendToDevice(pToken,payload);
}

exports.onRecipeUpdate = functions.database.ref('/devices/{productKey}').onUpdate(async (change, context) => {
	const productKey = context.params.productKey;
	const after = change.after.val();
	const before = change.before.val();

	const afterStep = after.currentStep;
	const beforeStep = before.currentStep;

	const afterWaiting = after.waiting;
	const beforeWaiting = before.waiting;

	admin.database().ref(`devices/${productKey}/usedRecipeId`).on('value', data => {
		if(data.exists()){
			if(data.val() !== ''){
				admin.database().ref(`devices/${productKey}/recipes/${data.val()}/name`).on('value', data => {
					var recipeName = data.val();

					if(afterStep !== "1" && afterStep !== '' && afterStep !== beforeStep){
						admin.database().ref(`/devices/${productKey}/userObjectId`).on('value', data => {
							const userId = data.val();
				
							admin.database().ref(`/users/${userId}/token`).on('value', data => {
								if(data.exists()){
									if(data.val() !== ''){
										var token = data.val();
										
										SendPush(`Used Recipe: ${recipeName}`, `Step ${afterStep} run!`, iconUrl, token);
										console.log("Wait send..!");
									}
								}
							})

						})
					}

					if(beforeWaiting === false && afterWaiting === true){
						admin.database().ref(`/devices/${productKey}/userObjectId`).on('value', data => {
							const userId = data.val();
				
							admin.database().ref(`/users/${userId}/token`).on('value', data => {
								if(data.val() !== ''){
									if(data.exists()){
										if(data.val() !== ''){
											var token = data.val();

											SendPush(`Used Recipe: ${recipeName}`, `The waiting phase is over!`, iconUrl, token);
											console.log("Wait send..!");
										}
									}
									
								}
								else{
									console.log("Wait, null token");
								}
							})
						})
					}

				})
			}
		}
	})
})

//http://us-central1-firewebhostingg.cloudfunctions.net/SendPush?key=TEST2&title=TESTTITLEasd&content=SDFSDFSDFSDFSDFSDF
exports.SendPush = functions.https.onRequest((req,res) => {
	var key = req.query.key;
	var title = req.query.title;
	var content = req.query.content;

	admin.database().ref(`devices/${key}/userObjectId`).on('value', data => {
		if(data.exists()){
			admin.database().ref(`users/${data.val()}/token`).on('value', data => {
				
				SendPush(title,content,iconUrl,data.val());

				console.log("Manuel Push Send..!: " + key);
			})
		}
		else{
			console.log('Key not found!');
		}
	})
	res.send('Ok.');
})