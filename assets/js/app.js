const listComponent = function(props) {
	console.log(props);
}

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
			console.log('Fetch from cache');
			return this.setState({repos: repos});
		}

		console.log('Fetch from API');
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
		let html = '<ul>'
		this.state.repos.map(repo => {
			console.log(repo);
			html += `<li><a href="${repo.url}">${repo.name}</a></li>`;
		});
		html += '</ul>'
		document.querySelector('.App').innerHTML = html;
	}
}

document.addEventListener('DOMContentLoaded', function(e) {
	App.constructor();
});
