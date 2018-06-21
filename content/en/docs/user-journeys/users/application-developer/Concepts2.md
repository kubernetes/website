---
reviewers:
- chenopis
layout: docsportal
css: /css/style_user_journeys.css
js: https://use.fontawesome.com/4bcc658a89.js, https://cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js, https://cloud.google.com/js/embed.min.js
title: Foundational
track: "USERS › APPLICATION DEVELOPER › Concepts"
content_template: templates/user-journey-content
---

### Cluster

A _cluster_ is the foundation of Kubernetes Engine: the Kubernetes objects that represent your containerized applications all run on top of a cluster. A cluster comprises:

* a unified endpoint that runs the Kubernetes control plane processes, including the Kubernetes API server, scheduler, and core resource controllers.
* a node (or a group of nodes) where applications or cloud workloads are scheduled.


### Node

A _node_ is a virtual or a physical machine that hosts the kubelet, kubeproxy, and container runtime. A node runs the services necessary to support the containers that make up a cluster's workloads.


### Kubelet

A _Kubelet_ is a service present on each node responsible for monitoring the node and relaying the distribution of pods to its container engine. Kubelet checks that all containers and their pods are running. Kubelets communicate with the container engine to instantiate the container.

When the controller assigns tasks to a pod, it is the kubelet that directs the pod to run these jobs.
Kubelets talk to the container engine to instantiate the container.
1:1 relationship between kubelet and node.


#### Pod

_Pods_ are the only schedulable unit in the Kubernetes environment that you can create and deploy. A Pod is a set of one or more containers that are run together in the container engine and local network. Pods always run on a node.
