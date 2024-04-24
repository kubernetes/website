---
title: " Weekly Kubernetes Community Hangout Notes - April 3 2015 "
date: 2015-04-04
slug: weekly-kubernetes-community-hangout
url: /blog/2015/04/Weekly-Kubernetes-Community-Hangout
---
# Kubernetes: Weekly Kubernetes Community Hangout Notes

Every week the Kubernetes contributing community meet virtually over Google Hangouts. We want anyone who's interested to know what's discussed in this forum.

Agenda:

* Quinton - Cluster federation
* Satnam - Performance benchmarking update

*Notes from meeting:*

1. Quinton - Cluster federation
* Ideas floating around after meetup in SF
* * Please read and comment
* Not 1.0, but put a doc together to show roadmap
* Can be built outside of Kubernetes
* API to control things across multiple clusters, include some logic

1. Auth(n)(z)

2. Scheduling Policies

3. …

* Different reasons for cluster federation

1. Zone (un) availability : Resilient to zone failures

2. Hybrid cloud: some in cloud, some on prem. for various reasons

3. Avoid cloud provider lock-in.  For various reasons

4. "Cloudbursting" - automatic overflow into the cloud
* Hard problems

1. Location affinity.  How close do pods need to be?

    1. Workload coupling

    2. Absolute location (e.g. eu data needs to be in eu)

2. Cross cluster service discovery

    1. How does service/DNS work across clusters

3. Cross cluster workload migration

    1. How do you move an application piece by piece across clusters?

4. Cross cluster scheduling

    1. How do know enough about clusters to know where to schedule

    2. Possibly use a cost function to achieve affinities with minimal complexity

    3. Can also use cost to determine where to schedule (under used clusters are cheaper than over-used clusters)

* Implicit requirements

1. Cross cluster integration shouldn't create cross-cluster failure modes

    1. Independently usable in a disaster situation where Ubernetes dies.

2. Unified visibility

    1. Want to have unified monitoring, alerting, logging, introspection, ux, etc.

3. Unified quota and identity management

    1. Want to have user database and auth(n)/(z) in a single place

* Important to note, most causes of software failure are not the infrastructure

1. Botched software upgrades

2. Botched config upgrades

3. Botched key distribution

4. Overload

5. Failed external dependencies

* Discussion:

1. Where do you draw the "ubernetes" line

    1. Likely at the availability zone, but could be at the rack, or the region

2. Important to not pigeon hole and prevent other users



2. Satnam - Soak Test
* Want to measure things that run for a long time to make sure that the cluster is stable over time.  Performance doesn't degrade, no memory leaks, etc.
* github.com/GoogleCloudPlatform/kubernetes/test/soak/…
* Single binary, puts lots of pods on each node, and queries each pod to make sure that it is running.
* Pods are being created much, much more quickly (even in the past week) to make things go more quickly.
* Once the pods are up running, we hit the pods via the proxy.  Decision to hit the proxy was deliberate so that we test the kubernetes apiserver.
* Code is already checked in.
* Pin pods to each node, exercise every pod, make sure that you get a response for each node.
* Single binary, run forever.
* Brian - v1beta3 is enabled by default, v1beta1 and v1beta2 deprecated, turned off  in June.  Should still work with upgrading existing clusters, etc.
