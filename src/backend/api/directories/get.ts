import directoryTreeBuilder from '../../utils/directory-tree-builder';

async function get(fastify) {
  fastify.route({
    method: 'GET',
    url: '/api/directories',
    schema: {
      querystring: {
        path: {type: 'string'},
      },
    },
    handler: function (request, reply) {
      console.log(">>>> REQUEST <<< ");
      const getDirectoryPath = () => {
        if (request.query.path === '/') {
          return '';
        }
        return request.query.path || '';
      }
      const path = getDirectoryPath();
      const tree = directoryTreeBuilder(path);
      reply.send(tree)
    }
  });
}

export default get;
