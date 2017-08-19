document.addEventListener('DOMContentLoaded', function(e) {
	App.constructor(document.querySelector('.App'));
});

const App = {
	constructor: function(rootElement) {
		this.rootElement = rootElement;
		this.cacheTime = 60000;
		this.state = {
			repos: []
		}
		this.fetchRepos();
	},

	setState: function(newState) {
		this.state = Object.assign({}, this.state, newState);
		this.render();
	},

	fetchRepos: function(force=false) {
		let repos = this.getCached('repos');

		if (repos && repos.length) {
			return this.setState({repos: repos});
		}

		this.rootElement.innerHTML = "Fetching Repos...";

		fetch('https://api.github.com/users/aurer/repos')
			.then(res => res.json())
			.then(res => {
				let repos = res.filter(repo => {
					return repo.has_pages && repo.name != 'aurer.github.io'
				});
				this.setState({repos: repos})
				this.setCached('repos', repos);
			});
	},

	setCached: function(key, data) {
		let times = JSON.parse(localStorage.getItem('times')) || {};
		times[key] = new Date().getTime();
		localStorage.setItem('times', JSON.stringify(times));
		localStorage.setItem(key, JSON.stringify(data));
	},

	getCached: function(key) {
		let times = JSON.parse(localStorage.getItem('times')) || {};
		let data = JSON.parse(localStorage.getItem(key)) || [];

		if (times[key] + this.cacheTime < new Date().getTime()) {
			return false;
		}

		return data;
	},

	render: function() {
		let html = '';
		this.state.repos.map(repo => {
			html += `<a class="Repo" href="https://aurer.github.io/${repo.name}">${repo.name}</a>`;
		});
		this.rootElement.innerHTML = html;
	}
}
