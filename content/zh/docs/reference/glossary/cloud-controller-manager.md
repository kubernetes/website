---
title: Cloud Controller Manager
id: cloud-controller-manager
date: 2018-04-12
full_link: https://kubernetes.io/docs/tasks/administer-cluster/running-cloud-controller/
short_description: >
  Cloud Controller Manager is an alpha feature in 1.8. In upcoming releases it will be the preferred way to integrate Kubernetes with any cloud.

aka: 
tags:
- core-object
- architecture
- operation
---
 Cloud Controller Manager is an alpha feature in 1.8. In upcoming releases it will be the preferred way to integrate Kubernetes with any cloud.

<!--more--> 

Kubernetes v1.6 contains a new binary called cloud-controller-manager. cloud-controller-manager is a daemon that embeds cloud-specific control loops.  These cloud-specific control loops were originally in the kube-controller-manager. Since cloud providers develop and release at a different pace compared to the Kubernetes  project, abstracting the provider-specific code to the cloud-controller-manager binary allows cloud vendors to evolve independently from the core Kubernetes code.

