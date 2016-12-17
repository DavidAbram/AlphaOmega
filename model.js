var model = module.exports;

var oauthAccessTokens = [],
	users = [
		{
			id : '1',
			username: 'david',
			password: 'abram'
		}
	];

model.dump = function() {
	console.log('oauthAccessTokens', oauthAccessTokens);
	console.log('users', users);
};

model.getAccessToken = function (bearerToken, callback) {
	for(var i = 0, len = oauthAccessTokens.length; i < len; i++) {
		var elem = oauthAccessTokens[i];
		if(elem.access_token === bearerToken) {
			return callback(false, elem);
		}
	}
	callback(false, false);
};

model.saveAccessToken = function (accessToken, clientId, userId, expires, callback) {
	oauthAccessTokens.unshift({
		access_token: accessToken,
		client_id: clientId,
		user_id: userId,
		expires: expires
	});

	callback(false);
};

model.getUser = function (username, password, callback) {
	for(var i = 0, len = users.length; i < len; i++) {
		var elem = users[i];
		if(elem.username === username && elem.password === password) {
			return callback(false, elem);
		}
	}
	callback(false, false);
};