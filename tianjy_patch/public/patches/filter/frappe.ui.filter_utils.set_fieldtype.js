/**
 * 将 options 备份到 original_options
 * 以便于 frappe.ui.Filter.prototype.toggle_nested_set_conditions 中可以获取原始选项
 */
const old = frappe.ui.filter_utils.set_fieldtype;

frappe.ui.filter_utils.set_fieldtype = function set_fieldtype(df, fieldtype, condition) {
	if (!df.original_options) {
		df.original_options = df.options;
	}
	return old.call(this, ...arguments);
};
