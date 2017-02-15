---
assignees:
- mikedanese
- thockin
title: Container Lifecycle Hooks
---

{% capture overview %}
This page describes the environment for Kubelet managed Containers on a Kubernetes node (kNode).
In contrast to the Kubernetes cluster API, which provides an API for creating and managing containers, the Kubernetes container environment provides the container access to information about what else is going on in the cluster.

This cluster information makes it possible to build applications that are *cluster aware*.
Additionally, the Kubernetes container environment defines a series of hooks that are surfaced to optional hook handlers defined as part of individual containers.
Container hooks are somewhat analogous to operating system signals in a traditional process model.
However these hooks are designed to make it easier to build reliable, scalable cloud applications in the Kubernetes cluster. 
Containers that participate in this cluster lifecycle become *cluster native*.

Another important part of the container environment is the file system that is available to the container.
In Kubernetes, the filesystem is a combination of an [image](/docs/user-guide/images) and one or more [volumes](/docs/user-guide/volumes).

The following sections describe both the cluster information provided to containers, as well as the hooks and life-cycle that allows containers to interact with the management system.
{% endcapture %}

{:toc}

{% capture body %}
{% endcapture %}


{% capture whatsnext %}
{% endcapture %}

{% include templates/concept.md %}