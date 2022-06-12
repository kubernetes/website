---
title: Extending the Kubernetes API
weight: 20
content_type: concept
---


<!-- Overview -->

A _Custom Resource Definition_ (CRD) defines the name and structure of a custom object type that you want to allow in your Kubernetes cluster. A CRD is a way of defining what the objects will be called along with with properties it can possess like _size, color-_ etc.

_Kubernetes Aggregation Layer_ allows Kubernetes to be extended with additional APIs, beyond what is offered by the core Kubernetes APIs. The additional APIs can either be ready-made solutions such as a metrics server, or APIs that you develop yourself.

_To have a better understanding about the topic, It is recommended to go through the below link_.