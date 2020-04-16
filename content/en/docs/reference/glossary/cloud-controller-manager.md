---
title: Cloud Controller Manager
id: cloud-controller-manager
date: 2018-04-12
full_link: /docs/tasks/administer-cluster/running-cloud-controller/
short_description: >
  Cloud Controller Manager is a Kubernetes component that embeds cloud-specific control logic.

aka: 
tags:
- core-object
- architecture
- operation
---
 Cloud Controller Manager is a Kubernetes component that embeds cloud-specific control logic.

<!--more--> 

Originally part of the kube-controller-manager, the cloud-controller-manager is responsible to decoupling the interoperability logic between Kubernetes and the underlying cloud infrastructure, enabling cloud providers to release features at a different pace compared to the main project.
