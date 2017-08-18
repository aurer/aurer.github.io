document.addEventListener('DOMContentLoaded', function(e) {
	App.constructor();
});

const App = {
	constructor: function(props) {
		this.state = {
			repos: []
		}
		this.fetchRepos();
	},

	setState: function(newState) {
		this.state = Object.assign({}, this.state, newState);
		this.render();
	},

	fetchRepos: function() {
		let repos = JSON.parse(localStorage.getItem('repos'));

		if (repos && repos.length) {
			return this.setState({repos: repos});
		}

		fetch('https://api.github.com/users/aurer/repos')
		.then(res => res.json())
		.then(res => {
			let repos = res.filter(repo => {
				return repo.has_pages && repo.name != 'aurer.github.io'
			});
			localStorage.setItem('repos', JSON.stringify(repos));
			this.setState({repos: repos})
		});
	},

	render: function() {
		let html = '<ul class="Repos">'
		this.state.repos.map(repo => {
			console.log(repo);
			html += `<li class="Repo"><a href="https://aurer.github.io/${repo.name}">${repo.name}</a></li>`;
		});
		html += '</ul>'
		document.querySelector('.App').innerHTML = html;
	}
}