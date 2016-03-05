---
title: Docker Bundle
permalink: /architecture/docker-bundle/
---

### Common Properties of Custom Extensions 

Our Docker component takes care of some things, which means that the Custom extension itself is simpler and generally more secure.

- Authentication - The Docker component makes sure that the application is run by authorized users/tokens. It is not possible to run an extension anonymously. The extension does not have access to the KBC token itself, and it receives only limited information about the project and end-user.
- Starting and stopping the extension - The Docker component will boot a Docker container which contains the extension. This ensures that the extensions run in a precisely defined environment which is guaranteed to be the same for each extension run (no application state is preserved)
- Reading and writing data to KBC Storage - The Docker component ensures that a custom extension cannot access arbitrary data in the project. It will only receive the input mapping defined by the end-user, and it will write to the project only those outputs defined in the output mapping by the end-user. 
- Application isolation - each extension is run in its own Docker container which is isolated from other containers; the application cannot be affected by other running applications. It may also be limited to have no network access.
