---
title: Namespace
id: namespace
date: 2018-04-12
full_link: /docs/concepts/overview/working-with-objects/namespaces
short_description: >
  An abstraction used by Kubernetes to support isolation of groups of resources within a single cluster.

aka: 
tags:
- fundamental
---
 An abstraction used by Kubernetes to support isolation of groups of resources within a single {{< glossary_tooltip text="cluster" term_id="cluster" >}}.

<!--more--> 

Namespaces are used to organize objects in a cluster and provide a way to divide cluster resources. Names of resources need to be unique within a namespace, but not across namespaces. Namespace-based scoping is applicable only for namespaced objects _(e.g. Deployments, Services, etc)_ and not for cluster-wide objects _(e.g. StorageClass, Nodes, PersistentVolumes, etc)_.

