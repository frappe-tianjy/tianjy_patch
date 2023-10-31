frappe.ui.form.ControlLink.prototype.set_formatted_input = function(value) {
	frappe.ui.form.ControlData.prototype.set_formatted_input.call(this, value);
	if (!value) { return; }

	if (!this.title_value_map) {
		this.title_value_map = {};
	}
	this.set_link_title(value);
};
