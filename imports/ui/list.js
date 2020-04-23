import './list.html';
import ListContainer from './containers/ListContainer.jsx'
import { store, loadGridEntitiesData } from '@steedos/react';

let isListRendered = false;
const defaultListId = "steedos-list";

const getListProps = ({id, object_name, related_object_name, is_related, recordsTotal, total}, withoutFilters) => {
	console.log("====getListProps=====", {id, object_name, related_object_name, is_related});
	let object, list_view_id;
	object = Creator.getObject(object_name);
	if (!object) {
		return;
	}
	let record_id = Session.get("record_id");
	if (is_related) {
		list_view_id = Creator.getListView(related_object_name, "all")._id;
	} else {
		list_view_id = Session.get("list_view_id");
	}

	if (!list_view_id) {
		toastr.error(t("creator_list_view_permissions_lost"));
		return;
	}
	let curObjectName;
	curObjectName = is_related ? related_object_name : object_name;
	let curObject = Creator.getObject(curObjectName);
	let mainColumns = Creator.getListviewColumns(curObject, object_name, is_related, list_view_id);
	let columns = Creator.unionSelectColumnsWithExtraAndDepandOn(mainColumns, curObject, object_name, is_related);
	columns = columns.map((item) => {
		let field = curObject.fields[item];
		if (field) {
			return {
				field: item,
				label: field.label,
				type: field.type,
				is_wide: field.is_wide,
				hidden: !mainColumns.contains(item)
			}
		}
		else {
			console.error(`The object ${curObject.name} don't exist field '${item}'`);
		}
	});
	let filters = [];
	if (!withoutFilters) {
		// 这里不可以用Tracker.nonreactive，因为当有过滤条件时，滚动翻页及滚动刷新需要传入这里的过滤条件
		filters = Creator.getListViewFilters(object_name, list_view_id, is_related, related_object_name, record_id);
	}
	columns = _.without(columns, undefined, null);
	console.log("====getListProps==filters=", filters);
	let pageSize = 10;
	let pager = true;
	if(is_related && recordsTotal){
		// 详细界面相关列表
		pageSize = 5;
		pager = false;
	}
	let endpoint = Creator.getODataEndpointUrl(object_name, list_view_id, is_related, related_object_name);
	return {
		id: id ? id : defaultListId,
		objectName: curObjectName,
		columns: columns,
		filters: filters,
		pageSize: pageSize,
		pager: pager,
		initializing: 1,
		showMoreLink: true,
		endpoint: endpoint,
		moreLinkHref: (props)=> {
			return Creator.getRelatedObjectUrl(object_name, "-", record_id, related_object_name)
		}
	}
}

Template.list.helpers({
	component: function () {
		return ListContainer;
	},
	listProps: function () {
		debugger;
		console.log("===Template.list.helpers=listProps======")
		return getListProps(this.options);
	}
});

Template.list.onCreated(function () {
	// 切换对象或视图时，会再进一次onCreated，所以object、listview、options不需要放到autorun中
	let { id, object_name, related_object_name, is_related, recordsTotal, total } = this.data.options;
	console.log("Template.list.onCreated===", id);
	let curObjectName;
	curObjectName = is_related ? related_object_name : object_name;
	if(is_related){
		if(this.unsubscribe){
			this.unsubscribe();
		}
		this.unsubscribe = store.subscribe(()=>{
			// 订阅store中列表数量值
			let listState = ReactSteedos.viewStateSelector(store.getState(), id);
			if(listState && !listState.loading){
				if(recordsTotal){
					// 详细界面相关列表
					let recordsTotalValue = Tracker.nonreactive(()=>{return recordsTotal.get()});
					recordsTotalValue[curObjectName] = listState.totalCount;
					recordsTotal.set(recordsTotalValue);
				}
				else if(total){
					// 主列表或独立的相关列表界面
					total.set(listState.totalCount);
				}
			}
		});
	}
	else{
		let object_name = Session.get("object_name");
		let list_view_id = Session.get("list_view_id");
		let props = getListProps(this.data.options, true);
		// 加Meteor.defer可以在刷新浏览器时少进一次
		Meteor.defer(()=>{
			this.autorun((c) => {
				let currentObjectName = Tracker.nonreactive(()=>{return Session.get("object_name");});
				let currentListViewId = Tracker.nonreactive(()=>{return Session.get("list_view_id");});
				if(list_view_id !== currentListViewId || object_name !== currentObjectName){
					// 合同、报表等对象视图中定义了filters，会造成切换视图时多请求一次odata接口
					return;
				}
				if(Steedos.spaceId() && Creator.subs["CreatorListViews"].ready() && Creator.subs["TabularSetting"].ready()){
					let filters = Creator.getListViewFilters(object_name, list_view_id);
					if(isListRendered){
						props.filters = filters;
						let newProps = {
							id: id ? id : defaultListId,
							initializing: 1
						};
						if (props.pager) {
							newProps.count = true;
						}
						store.dispatch(loadGridEntitiesData(Object.assign({}, props, newProps)))
						console.log("Template.list.onCreated=====autorun====", filters);
					}
					isListRendered = true;
				}
			});
		});
	}
})

Template.list.onDestroyed(function () {
	console.log("Template.list.onDestroyed===xx====");
	isListRendered = false;
	if(this.unsubscribe){
		this.unsubscribe();
	}
})

