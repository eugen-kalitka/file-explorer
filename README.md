# File Explorer application

a web application developed with Node and React.js. It allows to explore content of the folder with real-time updates.
The application utilizes Chonky library as a presentation layer

Technologies: TypeScript, Node, Fastify, Chokidar, React, Redux (RTK Query), Chonky

## Installation

NOTE: File Explorer application requires [Node.js](https://nodejs.org/) v18 to run.

```
npm install
```

## Running

Start server
```
npm run start:server
```

Start frontend
```
npm start
```

Open
http://localhost:8080/

For now, application is set up to listen changes in "directory" folder. So in order to test it locally folder with name "directory" needs to be created in the root of the project. To create it via terminal, run next command under project root


```
mkdir directory
```

After running this command, there must be next directory structure:
- directory - folder with files to listen
- node_modules
- public
- src
- .editorconfig and rest of configuration files...

NOTE: For now application is tested on MacOS. It should work fine on Linux as well, but it was not tested on Windows
