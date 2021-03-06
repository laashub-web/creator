Meteor.startup ()->
	if Meteor.isServer
		creator_db_url = process.env.MONGO_URL_CREATOR
		oplog_url = process.env.MONGO_OPLOG_URL_CREATOR
		if creator_db_url
			if !oplog_url
				throw new Meteor.Error(500, "Please configure environment variables: MONGO_OPLOG_URL_CREATOR")
			Creator._CREATOR_DATASOURCE = {_driver: new MongoInternals.RemoteCollectionDriver(creator_db_url, {oplogUrl: oplog_url})}

Creator.createCollection = (object)->
	collection_key = object.name
	if object.space #object.custom &&
		collection_key = "c_" + object.space + "_" + object.name

	if db[collection_key]
		return db[collection_key]
	else if object.db
		return object.db

	if Creator.Collections[collection_key]
		return Creator.Collections[collection_key]
	else
		if object.custom
			return new Meteor.Collection(collection_key, Creator._CREATOR_DATASOURCE)
		else
			if Meteor.isServer
				if collection_key == '_sms_queue' && SMSQueue?.collection
					return SMSQueue.collection
			return new Meteor.Collection(collection_key)


