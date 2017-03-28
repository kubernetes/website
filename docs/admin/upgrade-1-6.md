---
assignees:
- mml
title: Cluster Management Guide
---

* TOC
{:toc}

This document outlines the potentially disruptive changes that exist in the 1.6 release cycle.  Operators, administrators, and developers should 
take note of the changes below in order to maintain continuity across their upgrade process. 

## Cluster defaults set to etcd 3 

In the 1.6 release cycle, the default backend storage layer has been upgraded to fully leverage [etcd 3 capabilities](https://coreos.com/blog/etcd3-a-new-etcd.html) by default.  
For new clusters, there is nothing an operator will need to do, it should "just work".  However, if you are upgrading from a 1.5 cluster, care should be taken to ensure 
continuity.  

It is possible to maintain v2 compatibility mode while running etcd 3 for an interim period of time.  To do this, you will simply need to update an argument passed to your apiserver during 
startup: 

```
$ kube-apiserver --storage-backend='etcd2' $(EXISTING_ARGS)
``` 

However, for long-term maintenance of the cluster, we recommend that the operator plan an outage window in order to perform a [v2->v3 data upgrade](https://coreos.com/etcd/docs/latest/upgrades/upgrade_3_0.html).  