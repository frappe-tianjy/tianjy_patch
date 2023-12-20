frappe.ui.Capture.prototype.setup_remove_action = function setup_remove_action(){
	let me = this;
	let elements = Array.from(this.$template[0].getElementsByClassName('capture-remove-btn'));

	elements.forEach(el => {
		el.onclick = () => {
			let idx = parseInt(el.getAttribute('data-idx'));

			me.images.splice(idx, 1);
			me.render_preview();
		};
	});
};
