---
assignees:
- mikedanese
- thockin
title: Container Lifecycle Hooks
---

{% capture overview %}
This page describes how Kubelet managed Containers can use the Container Lifecycle Hook framework
to access information about their environment in a Kubernetes node. 
{% endcapture %}

{:toc}

{% capture body %}
## Overview
Analogous to many programming language frameworks, such as Angular,
Kubernetes provides *lifecycle hooks* that enable Containers to listen for events
and execute code when an event is fired.
These events provide two types of information that are available within the Container environment:

* Information about the container itself.
* Information about other objects in the system.

## Container hooks

For example, immediately after a container is started, it receives a `PostStart` event.  

{% endcapture %}
