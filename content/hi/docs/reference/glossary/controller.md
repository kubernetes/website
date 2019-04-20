---
title: Controller
id: controller
date: 2018-04-12
full_link: /docs/admin/kube-controller-manager/
short_description: >
  A control loop that watches the shared state of the cluster through the apiserver and makes changes attempting to move the current state towards the desired state.

aka: 
tags:
- architecture
- fundamental
---
 A control loop that watches the shared state of the cluster through the {{< glossary_tooltip text="apiserver" term_id="kube-apiserver" >}} and makes changes attempting to move the current state towards the desired state.

<!--more--> 

Examples of controllers that ship with Kubernetes today are the replication controller, endpoints controller, namespace controller, and serviceaccounts controller.

