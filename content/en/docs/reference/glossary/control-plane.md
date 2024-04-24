---
title: Control Plane
id: control-plane
date: 2019-05-12
full_link:
short_description: >
  The container orchestration layer that exposes the API and interfaces to define, deploy, and manage the lifecycle of containers.

aka:
tags:
- fundamental
---
 The container orchestration layer that exposes the API and interfaces to define, deploy, and manage the lifecycle of containers.

 <!--more--> 
 
 This layer is composed by many different components, such as (but not restricted to):

 * {{< glossary_tooltip text="etcd" term_id="etcd" >}}
 * {{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}}
 * {{< glossary_tooltip text="Scheduler" term_id="kube-scheduler" >}}
 * {{< glossary_tooltip text="Controller Manager" term_id="kube-controller-manager" >}}
 * {{< glossary_tooltip text="Cloud Controller Manager" term_id="cloud-controller-manager" >}}

 These components can be run as traditional operating system services (daemons) or as containers. The hosts running these components were historically called {{< glossary_tooltip text="masters" term_id="master" >}}.