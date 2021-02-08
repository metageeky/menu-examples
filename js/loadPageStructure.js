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
	var nav = document.querySelector('#main-navigation ol');
	for(p of Object.keys(site)) {
		let li = document.createElement('li');
		nav.appendChild(li)
		let a = document.createElement('a');
		a.href = document.location.pathname + '?'
		a.href += 'seed=' + seedFromString(p);
		a.href += '&page=' + encodeURIComponent(p);
		a.innerText = p;
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
				a.href += 'seed=' + seedFromString(page + s);
				a.href += '&page=' + encodeURIComponent(page);
				a.href += '&subpage=' + encodeURIComponent(s);
				a.innerText = s;
				a.id = 'mainMenu_' + page.replaceAll(' ','-') + '_' + s.replaceAll(' ','-');
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
		a.innerText = 'Home';
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
			a.innerText = page;
			li.appendChild(a);
			li = document.createElement('li');;
			ol.appendChild(li);
			li.innerHTML = '<span>' + subpage + '</span>';
		}
	}

	// sub nav
	
	if('subpages' in site[page]) {
		let nav = document.getElementById('sub-navigation');
		let h2 = document.createElement('h2');
		h2.innerText = page;
		nav.appendChild(h2);
		let ol = document.createElement('ol');
		nav.appendChild(ol);
		for(s of Object.keys(site[page].subpages)) {
			let sli = document.createElement('li');
			ol.appendChild(sli)
			let a = document.createElement('a');
			a.href = document.location.pathname + '?'
			a.href += 'seed=' + seedFromString(p + s);
			a.href += '&page=' + encodeURIComponent(p);
			a.href += '&subpage=' + encodeURIComponent(s);
			a.innerText = s;
			a.id = 'subMenu_' + p.replaceAll(' ','-') + '_' + s.replaceAll(' ','-');
			sli.appendChild(a);
		}
	}
	else {
		document.getElementById('sub-navigation').style.display = 'none';
	}


	// title update
	document.title = page;
	if(subpage != null)
		document.title += ' - ' + subpage;
	document.title += ' | SU Libraries';

	// H1
	if(subpage === null)
		document.getElementById('page-title').innerText = page;
	else
		document.getElementById('page-title').innerText = subpage;

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
		h2.innerText = headings[i];
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
}