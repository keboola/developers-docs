---
title: Architecture
permalink: /architecture/docker-bundle/
---

### Common Custom Applications Properties
Our Docker component takes care of some things, which means that the Custom application itself is simpler and generally more secure.

- authentication - The Docker component makes sure that the application is run by authorized users/tokens. It is not possible to run an application anonymously. The application does not have access to the KBC token itself, and it receives only limited information about the project and end-user.
- starting and stopping the application - The Docker component will boot a Docker container which contains the application. This ensures that the applications runs in a precisely defined environment which is guaranteed to be the same for each application run (no application state is preserved)
- reading and writing data to KBC storage - The Docker component ensures that a custom application cannot access arbitrary data in the project. It will only receive the input mapping defined by the end-user, and it will write to the project only those outputs defined in the output mapping by the end-user. 
- application isolation - each application is run in its own Docker container which is isolated from other containers; the application cannot be affected by other running applications. It may also be limited to have no network access.
