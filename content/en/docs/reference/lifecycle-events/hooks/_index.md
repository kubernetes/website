---
title: Lifecycle Hooks Behaviors
content_type: reference
weight: 30
---

<!-- overview -->

**lifecycle hooks** provide a way to trigger specific actions at crucial stages of a container's lifecycle. These hooks are useful for handling tasks such as performing tasks before the container shuts down or initiating tasks immediately after it starts.

For a detailed overview of the lifecycle hooks, visit the [Lifecycle Hooks Overview](docs/concepts/containers/container-lifecycle-hooks/).


<!-- body -->

## Lifecycle Hooks Behaviors

- [PreStop Hook Behaviors](/docs/reference/lifecycle-events/hooks/prestop)
  - This `PreStop` hook runs a command or sends an HTTP request right before the container is terminated, allowing you to execute graceful shutdown steps.

<!--
- [PostStart Hook Behaviors](/docs/reference/lifecycle-events/hooks/poststart)
  - This `PostStart` hook runs a command or sends an HTTP request right after the container starts, ideal for setting up resources or performing initialisation tasks.
-->