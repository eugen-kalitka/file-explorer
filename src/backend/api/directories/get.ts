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
      const tree = directoryTreeBuilder(request.query.path);
      reply.send(tree);
    }
  });
}

export default get;
