---
title: Federated Events
---

This guide explains how to use events in federation control plane to help in debugging.


* TOC
{:toc}

## Prerequisites

This guide assumes that you have a running Kubernetes Cluster
Federation installation. If not, then head over to the
[federation admin guide](/docs/concepts/cluster-administration/federation/) to learn how to
bring up a cluster federation (or have your cluster administrator do
this for you). Other tutorials, for example
[this one](https://github.com/kelseyhightower/kubernetes-cluster-federation)
by Kelsey Hightower, are also available to help you.

You are also expected to have a basic
[working knowledge of Kubernetes](/docs/setup/) in
general.

## Overview

Events in federation control plane (referred to as "federation events" in
this guide) are very similar to the traditional Kubernetes
Events providing the same functionality.
Federation Events are stored only in federation control plane and are not passed on to the underlying Kubernetes clusters.

Federation controllers create events as they process API resources to surface to the
user, the state that they are in.
You can get all events from federation apiserver by running:

```shell
kubectl --context=federation-cluster get events
```

The standard kubectl get, update, delete commands will all work.
