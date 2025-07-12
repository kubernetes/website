---
title: Downward API
id: downward-api
date: 2022-03-21
short_description: >
  A mechanism to expose Pod and container field values to code running in a container.
aka:
full_link: /docs/concepts/workloads/pods/downward-api/
tags:
- architecture
---
Kubernetes' mechanism to expose Pod and container field values to code running in a container.
<!--more-->
It is sometimes useful for a container to have information about itself, without
needing to make changes to the container code that directly couple it to Kubernetes.

The Kubernetes downward API allows containers to consume information about themselves
or their context in a Kubernetes cluster. Applications in containers can have
access to that information, without the application needing to act as a client of
the Kubernetes API.

There are two ways to expose Pod and container fields to a running container:

- using [environment variables](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)
- using [a `downwardAPI` volume](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)

Together, these two ways of exposing Pod and container fields are called the _downward API_.

