---
title: Lifecycle Hooks
---

# Overview of Lifecycle Hooks

In Kubernetes, provide a way to trigger specific actions at crucial stages of a container's life. These hooks can be particularly useful for handling tasks such as performing cleanups just before the container shuts down or initiating processes right after it starts.

## Types of Lifecycle Hooks

Kubernetes provides two main types of lifecycle hooks:

- [PreStop Hook](./PreStop.md)
  - This hook runs a command or sends an HTTP request right before the container is terminated, allowing you to execute graceful shutdown steps.
  
- [PostStart Hook](./PostStart.md)
  - This hook allows you to trigger a command or send an HTTP request immediately after the container starts, perfect for setting up resources or performing initialization tasks.

Both hooks give you more control over your container’s behavior at critical points during its lifecycle, helping you manage Pod operations more efficiently.
