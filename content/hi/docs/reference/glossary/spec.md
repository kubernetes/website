---
title: Spec
id: spec
date: 2023-12-17
full_link: /docs/concepts/overview/working-with-objects/#object-spec-and-status
short_description: >
  This field in Kubernetes manifests defines the desired state or configuration for specific Kubernetes objects.

aka:
tags:
- fundamental
- architecture
---
  Defines how each object, like Pods or Services, should be configured and its desired state.

<!--more-->
Almost every Kubernetes object includes two nested object fields that govern the object's configuration: the object spec and the object status. For objects that have a spec, you have to set this when you create the object, providing a description of the characteristics you want the resource to have: its desired state.

It varies for different objects like Pods, StatefulSets, and Services, detailing settings such as containers, volumes, replicas, ports,   
and other specifications unique to each object type. This field encapsulates what state Kubernetes should maintain for the defined   
object.
