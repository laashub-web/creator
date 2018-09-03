Creator.Objects.healthy_records = 
	name: "healthy_records"
	icon: "contact"
	label: "健康记录"
	enable_search: true
	fields:
		name: 
			type: "textarea"
			label:"疾病名称"
			required: true
			searchable:true
			index:true

		username: 
			type: "lookup"
			label:"孩子姓名"
			required: true
			reference_to: "care_records"

		age: 
			type: "number"
			label:"孩子年龄"
			required: true
			index:true


		height:  	
			type: "number"
			label:"身高（cm）"
			index:true

		weight:  	
			type: "number"
			label:"体重（kg）"
			index:true


		care_records: 
			type: "textarea"
			label:"就医过程"
			searchable:true
			is_wide: true
			index:true

		owner:
			hidden:true

		created:
			hidden:true

		created_by:
			hidden:true

		modified:
			hidden:true
		
		modified_by:
			hidden:true
		
	list_views:
		all:
			label: "所有"
			columns: ["name", "username", "age", "height","weight","care_records"]
			filter_scope: "space"

	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: false
			modifyAllRecords: false
			viewAllRecords: false
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true
