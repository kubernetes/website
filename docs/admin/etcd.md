---
assignees:
- mml
- wojtek-t
title: Upgrading and Rolling Back etcd
---

## About etcd

[etcd](https://coreos.com/etcd/docs/latest/) is a highly-available key value
store which Kubernetes uses for persistent storage of all of its REST API
objects.  For the mechanics behind how kubernetes builds, distributes and
deploys etcd, see _some doc_.

### etcd for Kubernetes: high-level goals

Access Control: give *only* kube-apiserver read/write access to etcd. You do not
want apiserver's etcd exposed to every node in your cluster (or worse, to the
internet at large), because access to etcd is equivalent to root in your
cluster.

Data Reliability: for reasonable safety, either etcd needs to be run as a
[cluster](/docs/admin/high-availability/#clustering-etcd) (multiple machines
each running etcd) or etcd's data directory should be located on durable storage
(e.g., GCE's persistent disk). In either case, if high availability is
required--as it might be in a production cluster--the data directory ought to be
[backed up periodically](https://coreos.com/etcd/docs/latest/op-guide/recovery.html),
to reduce downtime in case of corruption.


## Background

As of 1.5.1 kubernetes release, we are still using etcd from 2.2.1 release with
v2 API.  Also, we have no pre-existing process for updating etcd, as we have
never updated etcd by either minor or major version.

Note that we need to migrate both: etcd versions that we are using (from 2.2.1
to at least 3.0.x) as well as the version of API Kubernetes talks to etcd (3.0.x
etcd binaries support both v2 and v3 API).

This document describes how to do this migration.

### etcd upgrade limitations

The way etcd was designed introduces some significant limitations on how the
upgrade can be done. These are the main limitations. 

#### One minor release at a time

It is possible to upgrade only by one minor release at a time (though, within
patch releases you can switch versions at any time back and forth). That
basically means, that we cannot upgrade directly e.g. from 2.1.x to 2.3.x.

Fortunately, this limitation is easy to workaround - it is enough to start a
cluster for any intermediate minor release, wait until it is healthy and
functional and stop it then. This will do the migration itself underneath. 

As an example: to upgrade from 2.1.x to 2.3.y version, it is enough to start
etcd in 2.2.z version, wait until it is healthy, stop it and then start then
2.3.y version, wait until it is up and we are done.

#### No rollback

etcd doesn’t support rollback procedure at all (by design). That means, that if
you migrate your cluster e.g. from 2.2.x to 2.3.y, there is no way to get back
to 2.2.x (other than restoring from backup data from the moment when 2.2.x was
running, though if we were running 2.3.y for some time, we will lose all data
written in the meantime).

This is a significant limitation - we really need a rollback procedure if we face
some problems with the new release.

To make things better, we were provided a
[custom rollback tool](https://github.com/kubernetes/kubernetes/tree/master/cluster/images/etcd/rollback)
by CoreOS (etcd folks), but:

* This is a custom tool, which means it doesn’t have any guarantees and only
  best-effort support from etcd team (though they fixed some bugs that we found
  in the meantime).

* The rollback can be done only from 3.0.x version (that is using v3 API) to
  2.2.1 version (that is using v2 API).

* Rollback doesn’t preserve “resource versions” of objects stored in etcd.

The last bullet means that any component and/or user that has some logic
depending on “resource versions” may require restart after etcd rollback. This
in particular means all clients using “watch api”, as it strongly depends on
resource versions. Since both Kubelet and KubeProxy are using watch, this means
that rollback may require restarting all kubernetes components on all nodes.

_To verify: It seems that both Kubelet and KubeProxy are using “resource
version” only for watching (i.e. are not using resource versions for anything
else). And it seems both are using reflector and/or informer frameworks for
watching (i.e.  they don’t send watch requests themselves). Both those
frameworks if they can’t renew watch, they will start from “current version” by
doing “list + watch from the resource version returned by list”. That means that
if the apiserver will be down for the period of rollback, all of node components
should basically restart their watches and start from “now” when apiserver is
back. And it will be back with new resource version. That would mean that
restarting node components is not needed.  But the assumptions here are pretty
volatile…_

## Design

This section describes how we are going to do the migration given all the
limitations we have. Note that since the code changes in Kubernetes code needed
to support etcd v3 API are pretty local and not very sophisticated, we will not
focus on it at all. We are only focusing on the upgrade/rollback here.

### New etcd docker image
We decided to completely change the way how etcd image looks like (and how it
works). So far the docker image for etcd in version X contained only etcd and
etcdctl binaries in version X.

Going forward, the docker image for etcd in version X will contain multiple
versions of etcd. For example 3.0.17 image will contain all: 2.2.1, 2.3.7 and
3.0.17 binaries of etcd and etcdctl. This will allow running etcd in multiple
different versions using exactly the same docker image.

Additionally, the image will contain our custom script for doing migration
between versions (written by Kubernetes team) and the custom rollback tool
(provided by CoreOS folks).

### Migration script
The migration script that will now be part of etcd docker image is a bash
script, working as following:

1. Detect which version of etcd we were previously running.
   For that purpose, we have added a dedicated file (`version.txt`) that
   holds that information and is stored in the etcd-data-specific directory
   (next to the etcd data). If the file doesn’t exist, we default it to 2.2.1
   version.
1. If we are in 2.2.1 version and are supposed to upgrade, backup
   data.
1. Based on the detected previous etcd version and the desired one (the desired
   version is communicated via environment variable), do the upgrade steps (if
   needed).
   That means, for every minor etcd release between the detected one (excluding)
   to the desired one (including):
   1. start etcd in that version
   1. wait until it is healthy (healthy means that you can write some data to
      it)
   1. stop this etcd
   The important thing here is that those etcd will not listen on the default
   etcd port.  They are hardcoded to listen on ports which the apiserver is not
   configured to connect to, which means that apiserver won’t be able to connect
   to those etcd's.  Assuming no other client goes out of its way to try to
   connect and write to this obscure port, no new data will be written during
   this period.
1. If the desired api to use is v3 and detected on is v2, do the offline
   migration from v2 to v3 data format.
   For that we are using two tools:
   1. ./etcdctl migrate - official tool for migration provided by CoreOS
   1. custom script that is attaching TTLs to events in the etcd (etcdctl
      migrate doesn’t support TTLs)
1. After every successful step, update contents of “version file”.
   This will protect us from the situation that e.g. something will crash in the
   meantime and the “version file” will be completely unsynchronized with the
   real data. Note that it is safe if the script will crash after the step is
   done and before the file is updated - this will only result in redoing one
   step in the next try.

All the previous steps are for the case where detected version is earlier or
equal to the desired one. In the opposite case (i.e. requested rollback), the
script:

1. Checks if detected version is 3.0.x with v3 API, and desired is 2.2.1 with v2
   API
   We don’t support any other rollback.
1. If so, we run the custom tool provided by etcd team to do the offline
   rollback.  This tool reads the v3 formatted data and writes it back to disk
   in v2 format.
1. Finally update contents of “version file”.

### Upgrade procedure
Simply modify the command-line in etcd manifest to:

1. Run the migration script
   If the previously run version is already in the desired version, this will be
   no-op.
1. Start etcd (in the desired version)

Starting in 1.6, this has been done in the manifests for new GCE clusters.  You
should also specify these environment variables.  In particular, **you must keep
`STORAGE_MEDIA_TYPE` set to application/json if you wish to preserve the option
to roll back**.

```
TARGET_STORAGE=etcd3
ETCD_IMAGE=3.0.17
TARGET_VERSION=3.0.17
STORAGE_MEDIA_TYPE=application/json
```

To roll back, use these:

```
TARGET_STORAGE=etcd2
ETCD_IMAGE=3.0.17
TARGET_VERSION=2.2.1
STORAGE_MEDIA_TYPE=application/json
```

