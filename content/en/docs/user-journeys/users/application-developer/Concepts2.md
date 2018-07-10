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

A _cluster_ is the foundation of Kubernetes Engine: the Kubernetes objects that represent your containerized applications all run on top of a cluster. A cluster comprises a control plane and nodes.

### Node

A _node_ is a virtual or a physical machine that hosts the kubelet, kubeproxy, and container runtime. Containers run on a node. A node runs the services necessary to support the containers that make up a cluster's workloads.


### Kubelet

A _kubelet_ is an implementation present on each node responsible for monitoring the node and relaying the distribution of pods to its container runtime. Kubelet verifies that all the containers and pods are running. Kubelets communicate with the container runtime to instantiate the container.

When the controller assigns pods to a node, it is the kubelet that directs the pod to run these jobs.



#### Pod

A _pod_ is the lowest level unit for scheduling jobs on Kubernetes. A pod comprises a set of one or more containers that run together on the same node.
