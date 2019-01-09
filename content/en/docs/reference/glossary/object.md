---
title: Object
id: object
date: 2019-01-09
full_link: /docs/concepts/overview/working-with-objects/
short_description: >
  Kubernetes Objects are persistent entities in the Kubernetes system.

aka: 
tags:
- fundamental
---
 Kubernetes Objects* are persistent entities in the Kubernetes system.

<!--more--> 

Kubernetes uses these entities to represent the state of your cluster. Specifically, they can describe:

* What containerized applications are running (and on which nodes)
* The resources available to those applications
* The policies around how those applications behave, such as restart policies, upgrades, and fault-tolerance

A Kubernetes object is a "record of intent"--once you create the object, the Kubernetes system will constantly work to ensure that object exists.
By creating an object, you're effectively telling the Kubernetes system what you want your cluster's workload to look like; this is your cluster's **desired state**.
