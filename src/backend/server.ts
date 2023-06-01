import path from 'path';
import Fastify from 'fastify';
import cors from '@fastify/cors'
import wsService from './ws/service';

const fastify = Fastify({ logger: true });

fastify.register(cors, {
  origin: true
});

fastify.register(require('@fastify/websocket'))

fastify.register(require('@fastify/static'), {
  root: path.join(process.cwd(), 'public')
});

/**
 * Ws
 * */
fastify.register(wsService);

const startServer = async () => {
  try {
    await fastify.listen({ port: 5000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

startServer();
