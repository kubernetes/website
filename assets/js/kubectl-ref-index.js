document.addEventListener('DOMContentLoaded', function() {
	const search = document.getElementById('kubectl-cmd-search');
	const expandBtn = document.getElementById('kubectl-expand-all');
	const collapseBtn = document.getElementById('kubectl-collapse-all');
	const container = document.getElementById('kubectl-cmd-list');

	if (!container) return;

	const entries = container.querySelectorAll('details.kubectl-cmd-entry');

	const entryTexts = Array.from(entries).map(function(el) {
		const summary = el.querySelector('summary');
		const subs = el.querySelectorAll('.kubectl-subcmd-list li');
		let text = summary ? summary.textContent.toLowerCase() : '';
		for (const sub of subs) {
			text += ' ' + sub.textContent.toLowerCase();
		}
		return text;
	});

	if (search) {
		search.addEventListener('input', function() {
			const term = search.value.toLowerCase().trim();

			entries.forEach(function(el, i) {
				if (!term || entryTexts[i].includes(term)) {
					el.classList.remove('hidden');
					if (term) el.open = true;
				} else {
					el.classList.add('hidden');
				}
			});
		});
	}

	if (expandBtn) {
		expandBtn.addEventListener('click', function() {
			for (const el of entries) el.open = true;
		});
	}

	if (collapseBtn) {
		collapseBtn.addEventListener('click', function() {
			for (const el of entries) el.open = false;
		});
	}
});
