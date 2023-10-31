frappe.ui.FilterGroup.prototype.filter_exists = function(filter_value){
	// filter_value of form: [doctype, fieldname, condition, value]
	let exists = false;
	this.filters
		.filter(f => f.field)
		.map(f => {
			let f_value = f.get_value();
			if (filter_value.length === 2) {
				exists = filter_value[0] === f_value[0] && filter_value[1] === f_value[1];
				return;
			}

			let value = filter_value[3];
			let equal = frappe.utils.arrays_equal;
			// 删除了 (Array.isArray(value) && equal(value, f_value[3])) 判断
			// equal 方法已经可以判断是否相等
			if (
				equal(f_value.slice(0, 4), filter_value.slice(0, 4))
			) {
				exists = true;
			}
		});
	return exists;
};
