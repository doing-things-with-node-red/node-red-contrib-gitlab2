const gitlab = require('node-gitlab');
const { getNodeConfig } = require('./shared');

module.exports = function(RED) {
	function GitLabCreateRepositoryFile(n) {
		const node = this;
		RED.nodes.createNode(node, n);
		node.gitlabConfig = RED.nodes.getNode(n.gitlabconfig);
		node.branch_name = n.branch_name;
		node.encoding = n.encoding;
		node.on('input', msg => {
			const { branch_name, encoding, content, commit_message } = msg.payload;
			const { api, privateToken, id } = getNodeConfig(node.gitlabConfig);
			const client = gitlab.create({ api, privateToken });
			client.repositoryFiles.create(
				{
					id,
					file_path,
					branch_name: branch_name || node.branch_name,
					content,
					commit_message,
					encoding: encoding || node.encoding
				},
				(error, body) => {
					if (error) {
						msg.payload = error.toString();
						node.error(error, msg);
					} else {
						msg.payload = body;
						node.log(RED._('Succeeded to API Call.'));
					}
					node.send(msg);
				}
			);
		});
	}
	RED.nodes.registerType(
		'gitlab-create-repositoryfile',
		GitLabCreateRepositoryFile
	);
};