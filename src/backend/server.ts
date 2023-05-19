import path from 'path';
import Fastify from 'fastify';
import cors from '@fastify/cors'
import directoriesApi from './api/directories';
import wsService from './ws/service';

const fastify = Fastify({logger: true});

fastify.register(cors, {});

fastify.register(require('@fastify/websocket'))

fastify.register(require('@fastify/static'), {
  root: path.join(process.cwd(), 'public')
});

/**
 * Routes
 * */
fastify.register(directoriesApi);

/**
 * Ws
 * */
fastify.register(wsService);

// Start server
const start = async () => {
  try {
    await fastify.listen({port: 5000})
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start();
