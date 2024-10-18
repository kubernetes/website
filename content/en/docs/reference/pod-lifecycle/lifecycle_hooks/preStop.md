---
title: PreStop Hook
---

# PreStop Hook

The PreStop hook is a special lifecycle hook that runs a command or sends an HTTP request before the container is terminated.

## Basic PreStop Behavior

When a preStop hook is defined on a container, the specified command will execute before the container is shut down. This behavior allows the container to perform any necessary cleanup or finalization tasks.

Here is an example of a PreStop behavior:

<!-- PRESTOP_BASIC begin -->

Content here will be injected, describing the basic behavior of the PreStop hook.

<!-- PRESTOP_BASIC end -->

