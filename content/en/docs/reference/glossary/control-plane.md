---
title: Control Plane
id: control-plane
date: 2019-05-12
full_link:
short_description: >
 The control plane provides API/Interface driven management of the lifecycles and service levels (performance, scale, availability etc,) of the containerized workloads that run on the cluster, and of the cluster itself. 

aka:
tags:
- fundamental
---
 The control plane provides API/Interface driven management of the lifecycles and service levels (performance, scale, availability etc,) of the containerized {{< glossary_tooltip text="workloads" term_id="workload" >}} that run on the {{< glossary_tooltip text="cluster" term_id="cluster" >}}, and of the cluster itself. 
 <!--more--> 
 
The control plane is composed by many different components, including (but not restricted to):

 * {{< glossary_tooltip text="etcd" term_id="etcd" >}}
 * {{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}}
 * {{< glossary_tooltip text="Scheduler" term_id="kube-scheduler" >}}
 * {{< glossary_tooltip text="Controller Manager" term_id="kube-controller-manager" >}}
 * {{< glossary_tooltip text="Cloud Controller Manager" term_id="cloud-controller-manager" >}}

 These components can be run as traditional operating system services (daemons), as containers or within pods.  They may also be distributed across multiple machines for scale and/or resilience. Components of the control plane may also be co-located with containerized workloads, on the same machines, but this is *not* a best practice in production environments.
 
  The hosts running these components were historically called {{< glossary_tooltip text="masters" term_id="master" >}}.



