---
title: kubectl Overview
content_type: concept
description: Understand what kubectl is, how it relates to the Kubernetes API, and common usage patterns.
weight: 15
---

`kubectl` is the Kubernetes command-line tool, often read as "kube control".
It sends API requests to a Kubernetes cluster and prints the responses in a
human-friendly format.

You can use `kubectl` to:

- create, update, and delete API objects
- inspect workloads and cluster resources
- debug applications (for example with logs, exec, and port forwarding)
- automate operations in scripts and CI/CD workflows

`kubectl` talks to the Kubernetes API server and works with the credentials and
context defined in your kubeconfig file.

For practical usage:

- [Install kubectl](/docs/tasks/tools/#kubectl)
- [Introduction to kubectl](/docs/reference/kubectl/introduction/)
- [kubectl command reference](/docs/reference/kubectl/)

