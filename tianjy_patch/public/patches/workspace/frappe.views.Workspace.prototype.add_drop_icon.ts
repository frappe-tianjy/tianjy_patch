frappe.views.Workspace.prototype.add_drop_icon = function(item, sidebar_control, item_container) {
	let drop_icon = 'small-down';
	if (item_container.find(`[item-name="${this.current_page.name}"]`).length) {
		drop_icon = 'small-up';
	}
	// 修改源码，这里只展开到子级，而不是查找所有后代
	let $child_item_section = item_container.children('.sidebar-child-item');
	let $drop_icon = $(
		`<span class="drop-icon hidden">${frappe.utils.icon(drop_icon, 'sm')}</span>`,
	).appendTo(sidebar_control);
	let pages = item.public ? this.public_pages : this.private_pages;
	if (
		pages.some(
			e => e.parent_page == item.title && (e.is_hidden == 0 || !this.is_read_only),
		)
	) {
		$drop_icon.removeClass('hidden');
	}
	$drop_icon.on('click', () => {
		let icon =
			$drop_icon.find('use').attr('href') === '#icon-small-down'
				? '#icon-small-up'
				: '#icon-small-down';
		$drop_icon.find('use').attr('href', icon);
		$child_item_section.toggleClass('hidden');
	});
};
