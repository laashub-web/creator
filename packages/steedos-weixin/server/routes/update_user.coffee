JsonRoutes.add 'put', '/mini/vip/user', (req, res, next) ->
	try
		userId = Steedos.getUserIdFromAuthToken(req, res);
		if !userId
			throw new Meteor.Error(500, "No permission")

		data = req.body

		updateDoc = {}

		if !data.name
			throw new Meteor.Error(500, "姓名为必填")

		updateDoc.name = data.name

		if data.phoneNumber
			updateDoc.mobile = data.phoneNumber

		if data.sex
			updateDoc["profile.sex"] = data.sex

		if data.birthdate
			updateDoc["profile.birthdate"] = data.birthdate
		
		# 将用户填写的信息同步到user表
		Creator.getCollection("users").direct.update({_id: userId}, {
			$set: updateDoc
		})
		
		if data.phoneNumber
			Creator.getCollection("space_users").direct.update({
				user: userId
			}, {$set: {mobile: data.phoneNumber}}, {multi: true})

		JsonRoutes.sendResult res, {
			code: 200,
			data: {}
		}
	catch e
		console.error e.stack
		JsonRoutes.sendResult res, {
			code: e.error || 500
			data: {errors: e.reason || e.message}
		}