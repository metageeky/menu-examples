window.onload = function() {
	let nav = document.getElementById('main-nav');
	
	// events for the top-level menu buttons for dropdowns
	let triggers = document.querySelectorAll('button.mega-menu-toggle');
	for(e of triggers) {
		// click events for the top-level menu buttons for dropdowns
		e.addEventListener('click', function(evt) {
			let opened_menu = document.querySelector('nav.mega-menu button[aria-expanded="true"]');
			// close any sub menus opened by button
			if(opened_menu != null && evt.target != opened_menu) {
				// close other opened_menu
				opened_menu.setAttribute('aria-expanded', 'false');
			}
			// open menu
			if(evt.target.getAttribute('aria-expanded') == 'false') {
				evt.target.setAttribute('aria-expanded', 'true');
				nav.setAttribute('data-focus-open', 'true');
			}
			// close menu
			else {
				evt.target.setAttribute('aria-expanded', 'false');
				nav.setAttribute('data-focus-open', 'false');
			}
		});
		
		// hover
		e.addEventListener('mouseenter', function(evt) {
			if(nav.getAttribute('data-focus-open') == 'true')
				return;
			nav.setAttribute('data-hover-open', 'true');
			let trigger = evt.target;
			trigger.setAttribute('aria-expanded', 'true');
		});
		e.addEventListener('mouseleave', function(evt) {
			// if a focus in the menu has happened, take precedent
			if(nav.getAttribute('data-focus-open') == 'true')
				return;
			// if relatedTarget is an open mega-sub-menu, don't close
			if(evt.relatedTarget.classList.contains('mega-sub-menu'))
				return;
			nav.setAttribute('data-hover-open', 'false');

			evt.target.setAttribute('aria-expanded', 'false');
		});
	}
		
	let submenus = document.querySelectorAll('button.mega-menu-toggle + div.mega-sub-menu');
	console.log(submenus);
	for(e of submenus) {
		// click events for the top-level menu buttons for dropdowns
		e.addEventListener('mouseleave', function(evt) {
			if(nav.getAttribute('data-focus-open') == 'true')
				return;
			nav.setAttribute('data-hover-open', 'false');
			let open_toggle_button = document.querySelector('nav.mega-menu button[aria-expanded="true"]');
			if(open_toggle_button)
				open_toggle_button.setAttribute('aria-expanded','false');
		});
	}
	
	let menuLinks = document.querySelectorAll('button.mega-menu-toggle + div.mega-sub-menu a');
	for(e of menuLinks) {
		e.addEventListener('focus', function(evt) {
			// if already having focus in the nav menu, not an issue
			if(nav.getAttribute('data-focus-open') == 'true')
				return;
			// set to non-hover and make focus
			nav.setAttribute('data-focus-open', 'true');
			nav.setAttribute('data-hover-open', 'false');
		});
	}
	
	
}


