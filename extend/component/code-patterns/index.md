---
title: Code Patterns
permalink: /extend/component/code-patterns/
---

* TOC
{:toc}

Code Pattern
- allows you to use **generated code in the [Transformations](/integrate/transformations/)**
- is a special type of the [Component](/extend/component/)
- must implement the `generate` [Action](/extend/common-interface/actions/)
- gets the configuration with the parameters from the user-interface
- generates JSON containing:
    - generated code blocks for the [New Transformations](https://help.keboola.com/transformations/#new-transformations)
    - optionally also generated [Input](/extend/component/tutorial/input-mapping/) / [Output](/extend/component/tutorial/output-mapping/) Mapping

## Next Steps

For more information, see these subpages:
- [Overview](/extend/component/code-patterns/overview) explains the code patterns from the user's point of view.
- [Interface](/extend/component/code-patterns/interface) explains integration of the code patterns to the Keboola Connection.
- [Tutorial](/extend/component/code-patterns/tutorial) helps you to implement your first code pattern.
