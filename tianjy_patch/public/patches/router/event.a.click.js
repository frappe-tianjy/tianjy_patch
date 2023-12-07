/**
 * 此事件是处理路由跳转拦截的
 *
 * frappe 默认逻辑只是判断是否按下 ctrl/meta 按键，以及是否有 onclick 属性
 *
 * 修改后的方法，增加了对 defaultPrevented 的判断，如果事件执行过 preventDefault()
 * 则此属性将变为 true，不再对路由处理
 */

$('body').off('click', 'a');
// routing v2, capture all clicks so that the target is managed with push-state
$('body').on('click', 'a', function (e) {
	if (e?.originalEvent?.defaultPrevented) {
		return;
	}
	const target_element = e.currentTarget;
	const href = target_element.getAttribute('href');
	const is_on_same_host = target_element.hostname === window.location.hostname
		&& (target_element.search ||'?') === (window.location.search || '?');
	const override = route => {
		e.preventDefault();
		frappe.set_route(route);
		return false;
	};

	// click handled, but not by href
	if (
		!is_on_same_host || // external link
		target_element.getAttribute('onclick') || // has a handler
		e.ctrlKey ||
		e.metaKey || // open in a new tab
		href === '#' // hash is home
	) {
		return;
	}

	if (href && href.startsWith('#')) {
		// target startswith "#", this is a v1 style route, so remake it.
		return override(target_element.hash);
	}

	if (frappe.router.is_app_route(target_element.pathname)) {
		// target has "/app, this is a v2 style route.
		if (target_element.search) {
			frappe.route_options = {};
			let params = new URLSearchParams(target_element.search);
			for (const [key, value] of params) {
				frappe.route_options[key] = value;
			}
			frappe.route_search = target_element.search;
		} else {
			frappe.route_options = {};
		}
		if (target_element.hash) {
			frappe.route_hash = target_element.hash;
		}
		return override(target_element.pathname);
	}
});
