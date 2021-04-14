window.onload = function() {
	// add events
	let triggers = document.querySelectorAll('button.mega-menu-toggle');
	for(e of triggers) {
		e.addEventListener('click', function(evt) {
			let opened_menu = document.querySelector('nav.mega-menu button[aria-expanded="true"]');
			// close any sub menus opened by button
			if(opened_menu != null && evt.target != opened_menu) {
				// close opened_menu
				opened_menu.setAttribute('aria-expanded', 'false');
			}


			if(evt.target.getAttribute('aria-expanded') == 'false') {
				evt.target.setAttribute('aria-expanded', 'true');
			}
			else {
				evt.target.setAttribute('aria-expanded', 'false');
			}
		});
	}
}


