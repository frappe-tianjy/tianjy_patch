// 解决日期区间手动编辑会出错的问题

// @ts-ignore
const {ControlDateRange} = frappe.ui.form;
ControlDateRange.trigger_change_on_input_event = false;
const {prototype} = ControlDateRange;
prototype.parse = function parse(value) {
	if (value === null || value === undefined || typeof value === 'object') { return value; }

	// replace the separator (which can be in user language) with comma
	const to = __('{0} to {1}').replace('{0}', '').replace('{1}', '');
	// eslint-disable-next-line no-param-reassign
	value = value && value.replace(to, ',');
	if (!value || !value.includes(',')) { return; }

	const vals = value.split(',');
	if (vals.length !== 2) { return; }
	const from_date = moment(frappe.datetime.user_to_obj(vals[0]));
	if (!from_date.isValid()) { return; }
	const to_date = moment(frappe.datetime.user_to_obj(vals[1]));
	if (!to_date.isValid()) { return; }
	const from_text = from_date.format('YYYY-MM-DD');
	const to_text = to_date.format('YYYY-MM-DD');
	return from_text > to_text ? [to_text, from_text] : [from_text, to_text];
};
export {};
