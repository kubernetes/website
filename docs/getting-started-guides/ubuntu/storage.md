---
title: Storage
---

{% capture overview %}
This page explains how to install and configure persistent storage on a cluster.
{% endcapture %}
{% capture prerequisites %}
This page assumes you have a working Juju deployed cluster.
{% endcapture %}

{% capture steps %}
## Ceph Persistent Volumes

The Canonical Distribution of Kubernetes allows you to connect with durable
storage devices such as [Ceph](http://ceph.com). When paired with the
[Juju Storage](https://jujucharms.com/docs/2.0/charms-storage) feature you
can add durable storage easily and across clouds.

Deploy a minimum of three ceph-mon and three ceph-osd units.

```
juju deploy cs:ceph-mon -n 3
juju deploy cs:ceph-osd -n 3
```

Relate the units together:
```
juju add-relation ceph-mon ceph-osd
```

List the storage pools available to Juju for your cloud:

    juju storage-pools

Output:
```
Name     Provider  Attrs
ebs      ebs       
ebs-ssd  ebs       volume-type=ssd
loop     loop      
rootfs   rootfs    
tmpfs    tmpfs
```
> **Note**: This listing is for the Amazon Web Services public cloud.
> Different clouds may have different pool names.

Add a storage pool to the ceph-osd charm by NAME,SIZE,COUNT:

```
juju add-storage ceph-osd/0 osd-devices=ebs,10G,1
juju add-storage ceph-osd/1 osd-devices=ebs,10G,1
juju add-storage ceph-osd/2 osd-devices=ebs,10G,1
```

Next relate the storage cluster with the Kubernetes cluster:

```
juju add-relation kubernetes-master ceph-mon
```

We are now ready to enlist 
[Persistent Volumes](/docs/concepts/storage/persistent-volumes/)
in Kubernetes which our workloads can consume via Persistent Volume (PV) claims.

```
juju run-action kubernetes-master/0 create-rbd-pv name=test size=50
```

This example created a "test" Rados Block Device (rbd) in the size of 50 MB.

Use watch on your Kubernetes cluster like the following, you should see the PV
become enlisted and be marked as available:

    watch kubectl get pv

Output: 

```
NAME CAPACITY   ACCESSMODES   STATUS    CLAIM              REASON    AGE

test   50M          RWO       Available                              10s
```

To consume these Persistent Volumes, your pods will need an associated
Persistent Volume Claim with them, and is outside the scope of this README. See the
[Persistent Volumes](/docs/concepts/storage/persistent-volumes/)
documentation for more information.
{% endcapture %}

{% include templates/task.md %}
