function LoadPageStructure() {
	// load everything but interpret later
	var site = YAML.load('sitemap.yaml');
	var urlParams = new URLSearchParams(window.location.search);
	var seed = 1;
	if(urlParams.has('seed'))
		seed = urlParams.get('seed');
	var random = new PseudoRandom(seed);
	var page = "Home";
	if(urlParams.has('page'))
		page = urlParams.get('page');
	var subpage = null;
	if(urlParams.has('subpage'))
		subpage = urlParams.get('subpage');

	// create main nav menu
	var nav = document.querySelector('.main-navigation ol');
	for(p of Object.keys(site)) {
		let li = document.createElement('li');
		nav.appendChild(li)
		let a = document.createElement('a');
		a.href = document.location.pathname + '?'
		a.href += 'seed=' + seedFromString(p);
		a.href += '&page=' + encodeURIComponent(p);
		a.textContent = p;
		a.id = 'mainMenu' + p.replaceAll(' ','-');
		li.appendChild(a);

		// submenu
		if('subpages' in site[p]) {
			let ol = document.createElement('ol');
			li.append(ol);
			for(s of Object.keys(site[p].subpages)) {
				let sli = document.createElement('li');
				ol.appendChild(sli)
				let a = document.createElement('a');
				a.href = document.location.pathname + '?'
				a.href += 'seed=' + seedFromString(p + s);
				a.href += '&page=' + encodeURIComponent(p);
				a.href += '&subpage=' + encodeURIComponent(s);
				a.textContent = s;
				a.id = 'mainMenu_' + p.replaceAll(' ','-') + '_' + s.replaceAll(' ','-');
				sli.appendChild(a);
			}
		}
	}

	// breadcrumbs
	var crumbs = document.getElementById('breadcrumbs');
	if(page == "Home") {
		crumbs.style.display = "none";
	}
	else {
		let ol = crumbs.querySelector('ol');
		// Add home
		let li = document.createElement('li');
		ol.appendChild(li);
		let a = document.createElement('a');
		a.href = document.location.pathname + '?'
		a.href += 'seed=' + seedFromString('Home');
		a.href += '&page=' + encodeURIComponent('Home');
		a.textContent = 'Home';
		li.appendChild(a);

		// Add page
		li = document.createElement('li');
		ol.appendChild(li);
		if(subpage === null) {
			li.innerHTML = '<span>' + page + '</span>';
		}
		else {
			a = document.createElement('a');
			a.href = document.location.pathname + '?'
			a.href += 'seed=' + seedFromString(page);
			a.href += '&page=' + encodeURIComponent(page);
			a.textContent = page;
			li.appendChild(a);
			li = document.createElement('li');;
			ol.appendChild(li);
			li.innerHTML = '<span>' + subpage + '</span>';
		}
	}

	// sub nav
	
	if('subpages' in site[page]) {
		let p = page;
		let h2 = document.querySelector('#sub-navigation h2');
		let a = document.createElement('a');
		a.href = document.location.pathname + '?'
		a.href += 'seed=' + seedFromString(p);
		a.href += '&page=' + encodeURIComponent(p);
		a.innerHTML = p + ' <span class="offscreen">Navigation</span>';
		a.id = 'subMenu_' + p.replaceAll(' ','-');
		h2.appendChild(a);
		
		if(subpage === null)
			a.setAttribute('aria-current','page');
		
		let arrow1 = document.createElement('svg');
		arrow1.innerHTML = '<use xlink:href="#icon-right-triangle"></use>';
		arrow1.classList.add('icon');
		let arrow2 = document.createElement('svg');
		arrow2.innerHTML = '<use xlink:href="#icon-left-triangle"></use>';
		arrow2.classList.add('icon');
		
		let ol = document.querySelector('#sub-navigation ol');
		for(s of Object.keys(site[p].subpages)) {
			let sli = document.createElement('li');
			ol.appendChild(sli);
			sli.appendChild(arrow1.cloneNode(true));
			let a = document.createElement('a');
			a.href = document.location.pathname + '?'
			a.href += 'seed=' + seedFromString(p + s);
			a.href += '&page=' + encodeURIComponent(p);
			a.href += '&subpage=' + encodeURIComponent(s);
			a.textContent = s;
			a.id = 'subMenu_' + p.replaceAll(' ','-') + '_' + s.replaceAll(' ','-');
			if(s == subpage)
				a.setAttribute('aria-current','page');
			sli.appendChild(a);
			sli.appendChild(arrow2.cloneNode(true));
		}
	}
	else {
		document.getElementById('sidebar').style.display = 'none';
		document.getElementById('sub-navigation').style.display = 'none';
	}


	// title update
	document.title = page;
	if(subpage != null)
		document.title += ' - ' + subpage;
	document.title += ' | SU Libraries';

	// H1
	if(subpage === null)
		document.getElementById('page-title').textContent = page;
	else
		document.getElementById('page-title').textContent = subpage;

	// H2 and paragraphs
	var main = document.getElementById('main-content');
	var headings = [];
	if(subpage === null)
		headings = site[page].headings;
	else
		headings = site[page].subpages[subpage].headings;
	var r_array = random.randomArray(30);
	var p_index = 0;
	var n = random.randomIntRange(1,4);
	for(let i=0; i<n; i++) {
		let e = document.getElementById('p' + r_array[(p_index + i)%30]).cloneNode(true);
		e.removeAttribute('id');
		main.appendChild(e);
	}
	p_index = p_index + n;

	for(let i=0; i<headings.length; i++) {
		let h2 = document.createElement('h2');
		h2.textContent = headings[i];
		h2.id = 'h2_' + headings[i].replaceAll(' ', '-');
		main.appendChild(h2);

		n = random.randomIntRange(2,6);
		for(let j=0; j<n; j++) {
			let e = document.getElementById('p' + r_array[(p_index + j)%30]).cloneNode(true);
			e.removeAttribute('id');
			main.appendChild(e);
		}
		p_index = p_index + n
	}
	
	console.log('end load structure');
};

function loadMenu() {
	let menus = document.querySelectorAll('[data-menu-type]');
	for(let i=0; i<menus.length; i++) {
		let t = menus[i].getAttribute('data-menu-type');
		switch (t) {
			case 'dropdown-link':
				addDropdownLinkMenu(menus[i]);
				break;
			default:
				console.log('UNKNOWN MENU TYPE: ' + t);
		}		
	}
}

function addDropdownLinkMenu(node) {
	node.classList.add('dropdown-link-menu');
	let ol = node.querySelector('ol');
	if(ol === null) {
		console.log('Dropdown / Link menu is missing ordered list');
		return;
	}
	topItem = ol.querySelectorAll('li');
	for(let i=0; i < topItem.length; i++) {
		if(topItem[i].querySelector('ol') === null)
			continue;
		let sub = topItem[i].querySelector('ol');
		sub.classList.add('dropdown-menu');
		let a = topItem[i].querySelector('a');
		let b = document.createElement('button');
		b.setAttribute('aria-label', 'Show ' + a.textContent);
		b.setAttribute('aria-expanded', 'false');
		b.id = a.id + '-toggle';
		b.classList.add('dropdown-menu-toggle');
		b.innerHTML = '<svg class="icon down"><use xlink:href="#icon-down-triangle" /></svg><svg class="icon up"><use xlink:href="#icon-up-triangle" /></svg>';
		b.addEventListener('click', function(e) {
			if(this.getAttribute('aria-expanded') == 'false') {
				// open this disclosure menu and close any open ones
				let opens = this.parentElement.parentElement.querySelectorAll('button[aria-expanded="true"]');
				for(let j=0; j<opens.length; j++) {
					opens[j].setAttribute('aria-expanded','false');
				}
				this.setAttribute('aria-expanded','true');
			}
			else {
				this.setAttribute('aria-expanded','false');
			}
		});
		
		b.addEventListener('blur', function(evt) {
			let prevNode = evt.target;
			let currNode = evt.relatedTarget;
			
			if(currNode === null) {
				// close button
					prevNode.setAttribute('aria-expanded','false');
			}
			else if(currNode.nodeName == "A") {
				// does the A have the data-menu-item-control as the button's id
				if(prevNode.id != currNode.getAttribute('data-menu-item-control')) {
					// close button
					prevNode.setAttribute('aria-expanded','false');
				}
			}
			else {
				// close button
				prevNode.setAttribute('aria-expanded','false');
			}
		});
		topItem[i].insertBefore(b,sub);
		
		let subItem = sub.querySelectorAll('li a');
		for(let j=0; j<subItem.length; j++) {
			// add id of toggle button to the link
			subItem[j].setAttribute('data-menu-item-control', b.id);
			subItem[j].addEventListener('blur', function(evt) {
				let prevNode = evt.target;
				let prevTogId = prevNode.getAttribute('data-menu-item-control');
				let currNode = evt.relatedTarget;
				
				if(currNode === null) {
					// close button
					document.getElementById(prevTogId).setAttribute('aria-expanded','false');
				}
				else if(currNode.nodeName == "A") {
					if(prevTogId != currNode.getAttribute('data-menu-item-control')) {
						// close button
						document.getElementById(prevTogId).setAttribute('aria-expanded','false');
					}
				} // end 'A' case
				else if(currNode.nodeName == 'BUTTON') {
					// check that prevTogId is button's id
					if(prevTogId != currNode.id) {
						// close button
						document.getElementById(prevTogId).setAttribute('aria-expanded','false');
					}
				}
				else {
					// close button
					document.getElementById(prevTogId).setAttribute('aria-expanded','false');
				}
				
			});
		}
		
	}
	// Add escape listener to close.
	document.addEventListener('keydown', function(event){
		if(event.key === 'Escape') {
			let node = event.target;
			if(node.classList.contains('dropdown-menu-toggle')) {
				// close menu
				node.setAttribute('aria-expanded', 'false');
				return;
			}
			if(!node.hasAttribute('data-menu-item-control'))
				return;
			let b = document.getElementById(node.getAttribute('data-menu-item-control'));
			b.setAttribute('aria-expanded', 'false');
			b.focus();
		}
		else if(event.key === 'ArrowDown') {
			let node = event.target;
			if(node.classList.contains('dropdown-menu-toggle')) {
				if(node.getAttribute('aria-expanded') == 'false') {
					// open menu 
					node.setAttribute('aria-expanded','true');
				}
				else { // already open, move to first item
					node.nextElementSibling.querySelector('li a').focus();
				}
				event.stopPropagation();
				event.preventDefault();
			}
			else if(node.hasAttribute('data-menu-item-control')) {
				// now in a link in a dropdown menu
				let b = document.getElementById(node.getAttribute('data-menu-item-control'));
				let ol = b.nextElementSibling;
				if(node.parentElement.nextElementSibling === null) {
					// go to first item
					ol.querySelector('li a').focus();
				}
				else {
					// go down one
					node.parentElement.nextElementSibling.querySelector('a').focus();
				}
				event.stopPropagation();
				event.preventDefault();
			}
		}
		else if(event.key === 'ArrowUp') {
			let node = event.target;
			if(node.hasAttribute('data-menu-item-control')) {
				// now in a link in a dropdown menu
				let b = document.getElementById(node.getAttribute('data-menu-item-control'));
				let ol = b.nextElementSibling;
				if(node.parentElement.previousElementSibling === null) {
					ol.querySelector('li:last-of-type a').focus();
				}
				else {
					// go to previous
					node.parentElement.previousElementSibling.querySelector('a').focus();
				}
				
				event.stopPropagation();
				event.preventDefault();
			}
		}
	});
}