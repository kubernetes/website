---
title: API-initiated eviction
id: api-eviction
date: 2021-04-27
full_link: /docs/concepts/scheduling-eviction/pod-eviction/#api-eviction
short_description: >
  API-initiated eviction is the process by which you use the Eviction API to create an
  Eviction object that triggers graceful pod termination.
aka:
tags:
- operation
---
API-initiated eviction is the process by which you use the [Eviction API](/docs/reference/generated/kubernetes-api/{{<param "version">}}/#create-eviction-pod-v1-core)
to create an `Eviction` object that triggers graceful pod termination.

<!--more-->

You can request eviction either by directly calling the Eviction API 
using a client of the kube-apiserver, like the `kubectl drain` command. 
When an `Eviction` object is created, the API server terminates the Pod. 

API-initiated eviction is not the same as [node-pressure eviction](/docs/concepts/scheduling-eviction/eviction/#kubelet-eviction).
