---
assignees:
- mml
- wojtek-t
title: Upgrading and Rolling Back etcd
redirect_from:
- "/docs/admin/etcd_upgrade/"
- "/docs/admin/etcd_upgrade.html"
---

## About etcd

[etcd](https://coreos.com/etcd/docs/latest/) is a highly-available key value
store, which Kubernetes uses for persistent storage of all of its REST API
objects.

<!-- TODO(mml): Write this doc.

For the mechanics behind how kubernetes builds, distributes and deploys etcd,
see _some doc_.

-->

### Important assumptions

The upgrade procedure described in this document assumes that either:

1. The etcd cluster has only a single node, or
1. The etcd cluster has multiple nodes. In this case, the upgrade procedure requires shutting down the
   etcd cluster. During the time the etcd cluster is shutdown, the Kubernetes API Server
   will be read only.

**Warning**: Deviations from the assumptions are untested by continuous
integration, and deviations might create undesirable consequences. Additional
information about operating an etcd cluster is available [from the etcd
maintainers](https://github.com/coreos/etcd/tree/master/Documentation).

### etcd for Kubernetes: high-level goals

Access control: Give only kube-apiserver read/write access to etcd. You do not
want the API server's etcd exposed to every node in your cluster, or worse, to the
internet at large. Access to etcd is equivalent to root access in your
cluster.

Data reliability: For reasonable safety, either etcd needs to be run as a
[cluster](/docs/admin/high-availability/#clustering-etcd), or etcd's data directory
should be located on durable storage, for example, a Google Compute Engine persistent disk.
In either case, if high availability is
required--as it might be in a production cluster--the data directory ought to be
[backed up periodically](https://coreos.com/etcd/docs/latest/op-guide/recovery.html)
to reduce downtime in case of corruption.

## Background

As of Kubernetes version 1.5.1, we are still using etcd from the 2.2.1 release with
the v2 API. Also, we have no pre-existing process for updating etcd, as we have
never updated etcd by either minor or major version.

Note that we need to migrate both the etcd versions that we are using (from 2.2.1
to at least 3.0.x) as well as the version of the etcd API that Kubernetes talks to. The etcd 3.0.x
binaries support both the v2 and v3 API.

This document describes how to do this migration.  If you want to skip the
background and cut right to the procedure, see [Upgrade
Procedure](#upgrade-procedure).

### etcd upgrade requirements

There are requirements on how an etcd cluster upgrade can be performed. The primary considerations are:
- Upgrade between one minor release at a time
- Rollback supported through additional tooling

#### One minor release at a time

Upgrade only one minor release at a time. For example, we cannot upgrade directly from 2.1.x to 2.3.x.
Within patch releases it is possible to upgrade and downgrade between arbitrary versions. Starting a cluster for 
any intermediate minor release, waiting until the cluster is healthy, and then
shutting down the cluster down will perform the migration. For example, to upgrade from version 2.1.x to 2.3.y, 
it is enough to start etcd in 2.2.z version, wait until it is healthy, stop it, and then start the
2.3.y version.

#### Rollback via additional tooling

Versions 3.0+ of etcd do not support general rollback. That is,
after migrating from M.N to M.N+1, there is no way to go back to M.N.
The etcd team has provided a [custom rollback tool](https://github.com/kubernetes/kubernetes/tree/master/cluster/images/etcd/rollback)
but the rollback tool has these limitations:

* This custom rollback tool is not part of the etcd repo and does not receive the same
  testing as the rest of etcd.  We are testing it in a couple of end-to-end tests.
  There is only community support here.

* The rollback can be done only from the 3.0.x version (that is using the v3 API) to the
  2.2.1 version (that is using the v2 API).

* The tool only works if the data is stored in `application/json` format.

* Rollback doesn’t preserve resource versions of objects stored in etcd.

**Warning**: If the data is not kept in `application/json` format (see [Upgrade
Procedure](#upgrade-procedure)), you will lose the option to roll back to etcd
2.2.

The last bullet means that any component or user that has some logic
depending on resource versions may require restart after etcd rollback. This
includes that all clients using the watch API, which depends on
resource versions. Since both the kubelet and kube-proxy use the watch API, a
rollback might require restarting all Kubernetes components on all nodes.

**Note**: At the time of writing, both Kubelet and KubeProxy are using “resource
version” only for watching (i.e. are not using resource versions for anything
else). And both are using reflector and/or informer frameworks for watching
(i.e.  they don’t send watch requests themselves). Both those frameworks if they
can’t renew watch, they will start from “current version” by doing “list + watch
from the resource version returned by list”. That means that if the apiserver
will be down for the period of rollback, all of node components should basically
restart their watches and start from “now” when apiserver is back. And it will
be back with new resource version. That would mean that restarting node
components is not needed.  But the assumptions here may not hold forever.

## Design

This section describes how we are going to do the migration, given the
[etcd upgrade requirements](#etcd-upgrade-requirements).

Note that because the code changes in Kubernetes code needed
to support the etcd v3 API are local and straightforward, we do not
focus on them at all. We focus only on the upgrade/rollback here.

### New etcd Docker image

We decided to completely change the content of the etcd image and the way it works.
So far, the Docker image for etcd  in version X has contained only the etcd and
etcdctl binaries.

Going forward, the Docker image for etcd in version X will contain multiple
versions of etcd. For example, the 3.0.17 image will contain the 2.2.1, 2.3.7, and
3.0.17 binaries of etcd and etcdctl. This will allow running etcd in multiple
different versions using the same Docker image.

Additionally, the image will contain a custom script, written by the Kubernetes team,
for doing migration between versions. The image will also contain the rollback tool
provided by the etcd team.

### Migration script
The migration script that will be part of the etcd Docker image is a bash
script that works as follows:

1. Detect which version of etcd we were previously running.
   For that purpose, we have added a dedicated file, `version.txt`, that
   holds that information and is stored in the etcd-data-specific directory,
   next to the etcd data. If the file doesn’t exist, we default it to version 2.2.1.
1. If we are in version 2.2.1 and are supposed to upgrade, backup
   data.
1. Based on the detected previous etcd version and the desired one
   (communicated via environment variable), do the upgrade steps as
   needed. This means that for every minor etcd release greater than the detected one and
   less than or equal to the desired one:
   1. Start etcd in that version.
   1. Wait until it is healthy. Healthy means that you can write some data to it.
   1. Stop this etcd. Note that this etcd will not listen on the default
   etcd port. It is hard coded to listen on ports that the API server is not
   configured to connect to, which means that API server won’t be able to connect
   to it. Assuming no other client goes out of its way to try to
   connect and write to this obscure port, no new data will be written during
   this period.
1. If the desired API version is v3 and the detected version is v2, do the offline
   migration from the v2 to v3 data format. For that we use two tools:
   * ./etcdctl migrate: This is the official tool for migration provided by the etcd team.
   * A custom script that is attaching TTLs to events in the etcd. Note that etcdctl
      migrate doesn’t support TTLs.
1. After every successful step, update contents of the version file.
   This will protect us from the situation where something crashes in the
   meantime ,and the version file gets completely unsynchronized with the
   real data. Note that it is safe if the script crashes after the step is
   done and before the file is updated. This will only result in redoing one
   step in the next try.

All the previous steps are for the case where the detected version is less than or
equal to the desired version. In the opposite case, that is for a rollback, the
script works as follows:

1. Verify that the detected version is 3.0.x with the v3 API, and the
   desired version is 2.2.1 with the v2 API. We don’t support any other rollback.
1. If so, we run the custom tool provided by etcd team to do the offline
   rollback.  This tool reads the v3 formatted data and writes it back to disk
   in v2 format.
1. Finally update the contents of the version file.

### Upgrade procedure
Simply modify the command line in the etcd manifest to:

1. Run the migration script. If the previously run version is already in the
   desired version, this will be no-op.
1. Start etcd in the desired version.

Starting in Kubernetes version 1.6, this has been done in the manifests for new
Google Compute Engine clusters. You should also specify these environment
variables.  In particular,you must keep `STORAGE_MEDIA_TYPE` set to
`application/json` if you wish to preserve the option to roll back.

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

