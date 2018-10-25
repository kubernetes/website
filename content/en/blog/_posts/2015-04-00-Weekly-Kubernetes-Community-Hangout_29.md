---
title: " Weekly Kubernetes Community Hangout Notes - April 24 2015 "
date: 2015-04-30
slug: weekly-kubernetes-community-hangout_29
url: /blog/2015/04/Weekly-Kubernetes-Community-Hangout_29
---
Every week the Kubernetes contributing community meet virtually over Google Hangouts. We want anyone who's interested to know what's discussed in this forum.  


Agenda:

* Flocker and Kubernetes integration demo

Notes:

* flocker and kubernetes integration demo
* * Flocker Q/A

    * Does the file still exists on node1 after migration?

    * Brendan: Any plan this to make it a volume? So we don't need powerstrip?

        * Luke:  Need to figure out interest to decide if we want to make it a first-class persistent disk provider in kube.

        * Brendan: Removing need for powerstrip would make it simple to use. Totally go for it.

        * Tim: Should take no more than 45 minutes to add it to kubernetes:)

    * Derek: Contrast this with persistent volumes and claims?

        * Luke: Not much difference, except for the novel ZFS based backend. Makes workloads really portable.

        * Tim: very different than network-based volumes. Its interesting that it is the only offering that allows upgrading media.

        * Brendan: claims, how does it look for replicated claims? eg Cassandra wants to have replicated data underneath. It would be efficient to scale up and down. Create storage on the fly based on load dynamically. Its step beyond taking snapshots - programmatically creating replicas with preallocation.

        * Tim: helps with auto-provisioning.

    * Brian: Does flocker requires any other component?

        * Kai: Flocker control service co-located with the master.  (dia on blog post). Powerstrip + Powerstrip Flocker. Very interested in mpersisting state in etcd. It keeps metadata about each volume.

        * Brendan: In future, flocker can be a plugin and we'll take care of persistence. Post v1.0.

        * Brian: Interested in adding generic plugin for services like flocker.

        * Luke: Zfs can become really valuable when scaling to lot of containers on a single node.

    * Alex: Can flocker service can be run as a pod?

        * Kai: Yes, only requirement is the flocker control service should be able to talk to zfs agent. zfs agent needs to be installed on the host and zfs binaries need to be accessible.

        * Brendan: In theory, all zfs bits can be put it into a container with devices.

        * Luke: Yes, still working through cross-container mounting issue.

        * Tim: pmorie is working through it to make kubelet work in a container. Possible re-use.

    * Kai: Cinder support is coming. Few days away.
* Bob: What's the process of pushing kube to GKE? Need more visibility for confidence.
