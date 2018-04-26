---
title: Glossary and Terminology
---

{% capture overview %}
This page explains some of the terminology used in deploying Kubernetes with Juju.
{% endcapture %}

{% capture body %}


**controller** - The management node of a cloud environment. Typically you have one controller per cloud region, or more in HA environments. The controller is responsible for managing all subsequent models in a given environment. It contains the Juju API server and its underlying database.

**model** - A collection of charms and their relationships that define a deployment. This includes machines and units. A controller can host multiple models. It is recommended to separate Kubernetes clusters into individual models for management and isolation reasons.

**charm** - The definition of a service, including its metadata, dependencies with other services, required packages, and application management logic. It contains all the operational knowledge of deploying a Kubernetes cluster. Included charm examples are  `kubernetes-core`, `easyrsa`, `flannel`, and `etcd`.

**unit** - A given instance of a service. These may or may not use up a whole machine, and may be colocated on the same machine. So for example you might have a `kubernetes-worker`, and `etcd`, and `easyrsa` units running on a single machine, but they are three distinct units of different services.

**machine** - A physical node, these can either be bare metal nodes, or virtual machines provided by a cloud.
{% endcapture %}

{% include templates/concept.md %}
