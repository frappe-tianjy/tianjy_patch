frappe.router.set_route = function() {
	// set the route (push state) with given arguments
	// example 1: frappe.set_route('a', 'b', 'c');
	// example 2: frappe.set_route(['a', 'b', 'c']);
	// example 3: frappe.set_route('a/b/c');
	let route = Array.from(arguments);

	return new Promise(resolve => {
		route = this.get_route_from_arguments(route);
		route = this.convert_from_standard_route(route);
		let sub_path = this.make_url(route);
		if (frappe.route_search) {
			sub_path += frappe.route_search;
			frappe.route_search = null;
		} else if (frappe.route_options) {
			const params = [];
			for (const [key, value] of Object.entries(frappe.route_options)) {
				params.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
			}
			if (params.length) {
				sub_path += `?${params.join('&')}`;
			}
		}
		sub_path += frappe.route_hash || '';
		frappe.route_hash = null;
		if (frappe.open_in_new_tab) {
			localStorage.route_options = JSON.stringify(frappe.route_options);
			window.open(sub_path, '_blank');
			frappe.open_in_new_tab = false;
		} else {
			this.push_state(sub_path);
		}
		setTimeout(() => {
			frappe.after_ajax?.(() => {
				resolve();
			});
		}, 100);
	}).finally(() => (frappe.route_flags = {}));

};
