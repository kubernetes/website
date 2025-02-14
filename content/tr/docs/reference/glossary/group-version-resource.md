---
title: Group Version Resource
id: gvr
date: 2023-07-24
short_description: >
  The API group, API version and name of a Kubernetes API. 

aka: ["GVR"]
tags:
- architecture
---
Means of representing unique Kubernetes API resource.

<!--more-->

Group Version Resources (GVRs) specify the API group, API version, and resource (name for the object kind as it appears in the URI) associated with accessing a particular id of object in Kubernetes.
GVRs let you define and distinguish different Kubernetes objects, and to specify a way of accessing
objects that is stable even as APIs change.