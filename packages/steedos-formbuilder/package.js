Package.describe({
	name: 'steedos:formbuilder',
	version: '0.0.1',
	summary: 'Creator Base Modals',
	git: '',
	documentation: null
});

Package.onUse(function(api) {

	api.use('coffeescript@1.11.1_4');
	api.use('templating@1.2.15');
	api.use('kadira:flow-router@2.10.1');
	api.use('flemay:less-autoprefixer@1.2.0');

	api.addFiles('formbuilder/jquery-ui.min.js','client');
	// api.addFiles('formbuilder/form-builder.css','client');
	api.addFiles('formbuilder/form-builder.min.js','client');
	// api.addFiles('formbuilder/form-render.css','client');
	api.addFiles('formbuilder/form-render.min.js','client');

	api.addFiles('formbuilder/control_plugins/starRating.min.js','client');
	api.addFiles('formbuilder/control_plugins/textarea.trumbowyg.min.js','client');

	api.addFiles('client/form-builder.html', 'client');
	api.addFiles('client/form-builder.coffee', 'client');
	api.addFiles('client/form-builder.less', 'client');

	api.addFiles('lib/transform.coffee', 'client');
	api.addFiles('client/router.coffee', 'client');

});