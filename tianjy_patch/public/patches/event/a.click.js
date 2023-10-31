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
	let override = route => {
		e.preventDefault();
		frappe.set_route(route);
		return false;
	};

	const href = e.currentTarget.getAttribute('href');

	// click handled, but not by href
	if (
		e.currentTarget.getAttribute('onclick') || // has a handler
		e.ctrlKey ||
		e.metaKey || // open in a new tab
		href === '#'
	) {
		// hash is home
		return;
	}

	if (href === '') {
		return override('/app');
	}

	if (href && href.startsWith('#')) {
		// target startswith "#", this is a v1 style route, so remake it.
		return override(e.currentTarget.hash);
	}

	if (frappe.router.is_app_route(e.currentTarget.pathname)) {
		// target has "/app, this is a v2 style route.

		if (e.currentTarget.search) {
			frappe.route_options = {};
			let params = new URLSearchParams(e.currentTarget.search);
			for (const [key, value] of params) {
				frappe.route_options[key] = value;
			}
		}
		return override(e.currentTarget.pathname + e.currentTarget.hash);
	}
});
