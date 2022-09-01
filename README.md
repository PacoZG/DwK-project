# This ToDo Project is a simple application design and created as part of the exercises for the course

[DevOps with Kubernetes](https://devopswithkubernetes.com/)

It consists in a [frontend](./client/) "Client", a [backend](./server/) "Server" and a very simple [cronjob](./cronjob/)
that creates random wiki urls

**Pre-requirements**

- Node 16.x (nvm is recommended)
- npm 8.x (https://docs.npmjs.com)
- Jake (https://jakejs.com) `yarn global add jake` or `npm install jake -g`
- Docker


**How to run**

You can build, test and run using the Jakefile. Or you can go to a project directory (frontend/backend) and run specific commands there.

Remember that if you for example want to start the backend separately, you must also remember to install dependencies using `npm install`, start the DB (using local-database/start.sh script) before actually starting the backend. Using the available tasks in Jakefile runs all prerequisite steps automatically.

_List all the available "tasks"_

`jake -t`

_Run local environment_

`jake run`

**Note!**
When running the project, a local PostgreSQL database will be started in a Docker container.
Make sure you're not running other database instances in the same port as this.
Otherwise the database won't get initialized correctly.

_Stop DB from running (only necessary if something went wrong)_

`jake db:kill`

---

The image of the hash writer can be found [here](https://hub.docker.com/r/sirpacoder/client)

The image of the hash reader can be found [here](https://hub.docker.com/r/sirpacoder/server)
