###TODO###
# 1 国际化文件

Template.formBuilder.onRendered ()->
	console.log('formBuilder onRendered');


	form = Creator.odata.get("forms", "ecc83b9a82b6182e44f18681")

	formFields = form.current.fields

	console.log('formFields', formFields)

	fields = Creator.formBuilder.transformFormFieldsIn(formFields)

	options = Creator.formBuilder.optionsForFormFields()

	fb = $("#fb-editor").formBuilder(options)
	fb.promise.then (formBuilder)->
		formBuilder.actions.setData(fields)
		# fix bug: 第一个字段的typeUserAttrs不生效
		Meteor.setTimeout ()->
			formBuilder.actions.setData(fields)
		, 100
	window.fb = fb

Template.formBuilder.events
	'click .form-builder-getData': (e, t)->
		data = $("#fb-editor").data('formBuilder').actions.getData()
		formFields = Creator.formBuilder.transformFormFieldsOut(data)
		console.log('formFields', formFields)

		if false
			return

		form = Creator.odata.get("forms", "ecc83b9a82b6182e44f18681")

		form.current.fields = formFields

		url = "http://192.168.3.2:8821/am/forms?sync_token=1548664502.25138"
		data = {}
		form.id = form._id
		data['Forms'] = [form]
		$.ajax
			type: "put"
			url: url
			data: JSON.stringify(data)
			dataType: 'json'
			contentType: "application/json"
			processData: false
			beforeSend: (request) ->
				request.setRequestHeader('X-User-Id', Meteor.userId())
				request.setRequestHeader('X-Auth-Token', Accounts._storedLoginToken())

			success: (data) ->
				console.log('data', data)

			error: (jqXHR, textStatus, errorThrown) ->
				error = jqXHR.responseJSON.error
				console.error error
				if error.reason
					toastr?.error?(TAPi18n.__(error.reason))
				else if error.message
					toastr?.error?(TAPi18n.__(error.message))
				else
					toastr?.error?(error)


