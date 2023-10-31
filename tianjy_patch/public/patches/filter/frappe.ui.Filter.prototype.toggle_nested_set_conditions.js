/**
 * 判断是否树状结构优先由原始类型及原始选项确定
 */
frappe.ui.Filter.prototype.toggle_nested_set_conditions =function toggle_nested_set_conditions(df) {
	let show_condition =
		(df.original_type || df.fieldtype) === 'Link'
		&& frappe.boot.nested_set_doctypes.includes(df.original_options || df.options);
	for (const condition of this.nested_set_conditions) {
		this.filter_edit_area
			.find(`.condition option[value="${condition[0]}"]`)
			.toggle(show_condition);
	}
};
