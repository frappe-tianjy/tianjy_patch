// 解决部分操作符下 Link 的祖先/后代类条件不显示的问题
import './frappe.ui.filter_utils.set_fieldtype';
import './frappe.ui.Filter.prototype.toggle_nested_set_conditions';

// 解决传入过滤器值时，是只要值相等，无论是否同一字段同一过滤器都视作相同的问题
import './frappe.ui.FilterGroup.prototype.filter_exists';
