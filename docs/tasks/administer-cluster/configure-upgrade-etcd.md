---
reviewers:
- mml
- wojtek-t
title: Operating etcd clusters for Kubernetes
---

{% glossary_definition term_id="etcd" length="all" prepend="etcd is a "%}

<!-- TODO(mml): Write this doc.

For the mechanics behind how kubernetes builds, distributes and deploys etcd,
see _some doc_.

-->

## Prerequisites

* Run etcd as a cluster of odd members.

* etcd is a leader-based distributed system. Ensure that the leader periodically send heartbeats on time to all followers to keep the cluster stable.

* Ensure that no resource starvation occurs.

  Performance and stability of the cluster is sensitive to network and disk IO. Any resource starvation can lead to heartbeat timeout, causing instability of the cluster. An unstable etcd indicates that no leader is elected. Under such circumstances, a cluster cannot make any changes to its current state, which implies no new pods can be scheduled.

* Keeping stable etcd clusters is critical to the stability of Kubernetes clusters. Therefore, run etcd clusters on dedicated machines or isolated environments for [guaranteed resource requirements](https://github.com/coreos/etcd/blob/master/Documentation/op-guide/hardware.md#hardware-recommendations).

## Resource requirements

Operating etcd with limited resources is suitable only for testing purposes. For deploying in production, advanced hardware configuration is required. Before deploying etcd in production, see [resource requirement reference documentation](https://github.com/coreos/etcd/blob/master/Documentation/op-guide/hardware.md#example-hardware-configurations).

## Starting Kubernetes API server

This section covers starting a Kubernetes API server with an etcd cluster in the deployment.

### Single-node etcd cluster

Use a single-node etcd cluster only for testing purpose.

1. Run the following:

        ./etcd --listen-client-urls=http://$PRIVATE_IP:2379 --advertise-client-urls=http://$PRIVATE_IP:2379

2. Start Kubernetes API server with the flag `--etcd-servers=$PRIVATE_IP:2379`.

    Replace `PRIVATE_IP` with your etcd client IP.

### Multi-node etcd cluster

For durability and high availability, run etcd as a multi-node cluster in production and back it up periodically. A five-member cluster is recommended in production. For more information, see [FAQ Documentation](https://github.com/coreos/etcd/blob/master/Documentation/faq.md#what-is-failure-tolerance).

Configure an etcd cluster either by static member information or by dynamic discovery. For more information on clustering, see [etcd Clustering Documentation](https://github.com/coreos/etcd/blob/master/Documentation/op-guide/clustering.md).

For an example, consider a five-member etcd cluster running with the following client URLs: `http://$IP1:2379`, `http://$IP2:2379`, `http://$IP3:2379`, `http://$IP4:2379`, and `http://$IP5:2379`. To start a Kubernetes API server:

1. Run the following:

       ./etcd --listen-client-urls=http://$IP1:2379, http://$IP2:2379, http://$IP3:2379, http://$IP4:2379, http://$IP5:2379 --advertise-client-urls=http://$IP1:2379, http://$IP2:2379, http://$IP3:2379, http://$IP4:2379, http://$IP5:2379


2. Start Kubernetes API servers with the flag `--etcd-servers=$IP1:2379, $IP2:2379, $IP3:2379, $IP4:2379, $IP5:2379`.

    Replace `IP` with your client IP addresses.

###  Multi-node etcd cluster with load balancer

To run a load balancing etcd cluster:

1. Set up an etcd cluster.
2. Configure a load balancer in front of the etcd cluster.
   For example, let the address of the load balancer be `$LB`.
3. Start Kubernetes API Servers with the flag `--etcd-servers=$LB:2379`.

## Securing etcd clusters

Access to etcd is equivalent to root permission in the cluster so ideally only the API server should have access to it. Considering the sensitivity of the data, it is recommended to grant permission to only those nodes that require access to etcd clusters.

To secure etcd, either set up firewall rules or use the security features provided by etcd. etcd security features depend on x509 Public Key Infrastructure (PKI). To begin, establish secure communication channels by generating a key and certificate pair. For example, use key pairs `peer.key` and `peer.cert` for securing communication between etcd members, and `client.key` and `client.cert` for securing communication between etcd and its clients. See the [example scripts](https://github.com/coreos/etcd/tree/master/hack/tls-setup) provided by the etcd project to generate key pairs and CA files for client authentication.

### Securing communication

To configure etcd with secure peer communication, specify flags `--peer-key-file=peer.key` and `--peer-cert-file=peer.cert`, and use https as URL schema.

Similarly, to configure etcd with secure client communication, specify flags `--key-file=k8sclient.key` and `--cert-file=k8sclient.cert`, and use https as URL schema.

### Limiting access of etcd clusters

After configuring secure communication, restrict the access of etcd cluster to only the Kubernetes API server. Use TLS authentication to do so.

For example, consider key pairs `k8sclient.key` and `k8sclient.cert` that are trusted by the CA `etcd.ca`. When etcd is configured with `--client-cert-auth` along with TLS, it verifies the certificates from clients by using system CAs or the CA passed in by `--trusted-ca-file` flag. Specifying flags `--client-cert-auth=true` and `--trusted-ca-file=etcd.ca` will restrict the access to clients with the certificate `k8sclient.cert`.

Once etcd is configured correctly, only clients with valid certificates can access it. To give Kubernetes API server the access, configure it with the flags `--etcd-certfile=k8sclient.cert` and `--etcd-keyfile=k8sclient.key`.

**Note**: etcd authentication is not currently supported by Kubernetes. For more information, see the related issue [Support Basic Auth for Etcd v2](https://github.com/kubernetes/kubernetes/issues/23398).
{: .note}

## Replacing a failed etcd member

etcd cluster achieves high availability by tolerating minor member failures. However, to improve the overall health of the cluster, replace failed members immediately. When multiple members fail, replace them one by one. Replacing a failed member involves two steps: removing the failed member and adding a new member.

Though etcd keeps unique member IDs internally, it is recommended to use a unique name for each member to avoid human errors. For example, consider a three-member etcd cluster. Let the URLs be, member1=http://10.0.0.1, member2=http://10.0.0.2, and member3=http://10.0.0.3. When member1 fails, replace it with member4=http://10.0.0.4.

1. Get the member ID of the failed member1:

    `etcdctl --endpoints=http://10.0.0.2,http://10.0.0.3 member list`

      The following message is displayed:

        8211f1d0f64f3269, started, member1, http://10.0.0.1:12380, http://10.0.0.1:2379
        91bc3c398fb3c146, started, member2, http://10.0.0.1:2380, http://10.0.0.2:2379
        fd422379fda50e48, started, member3, http://10.0.0.1:2380, http://10.0.0.3:2379

2. Remove the failed member:

    `etcdctl member remove 8211f1d0f64f3269`

      The following message is displayed:

       Removed member 8211f1d0f64f3269 from cluster

3. Add the new member:

    `./etcdctl member add member4 --peer-urls=http://10.0.0.4:2380`

     The following message is displayed:

       Member 2be1eb8f84b7f63e added to cluster ef37ad9dc622a7c4

4. Start the newly added member on a machine with the IP `10.0.0.4`:

        export ETCD_NAME="member4"
        export ETCD_INITIAL_CLUSTER="member2=http://10.0.0.2:2380,member3=http://10.0.0.3:2380,member4=http://10.0.0.4:2380"
        export ETCD_INITIAL_CLUSTER_STATE=existing
        etcd [flags]

5. Do either of the following:

   1. Update its `--etcd-servers` flag to make Kubernetes aware of the configuration changes, then restart the Kubernetes API server.
   2. Update the load balancer configuration if a load balancer is used in the deployment.

For more information on cluster reconfiguration, see [etcd Reconfiguration Documentation](https://github.com/coreos/etcd/blob/master/Documentation/op-guide/runtime-configuration.md#remove-a-member).

## Backing up an etcd cluster

All Kubernetes objects are stored on etcd. Periodically backing up the etcd cluster data is important to recover Kubernetes clusters under disaster scenarios, such as losing all master nodes. The snapshot file contains all the Kubernetes states and critical information. In order to keep the sensitive Kubernetes data safe, encrypt the snapshot files.

Backing up an etcd cluster can be accomplished in two ways: etcd built-in snapshot and volume snapshot.

### Built-in snapshot

etcd supports built-in snapshot, so backing up an etcd cluster is easy. A snapshot may either be taken from a live member with the `etcdctl snapshot save` command or by copying the `member/snap/db` file from an etcd [data directory](https://github.com/coreos/etcd/blob/master/Documentation/op-guide/configuration.md#--data-dir) that is not currently used by an etcd process. `datadir` is located at `$DATA_DIR/member/snap/db`. Taking the snapshot will normally not affect the performance of the member.

Below is an example for taking a snapshot of the keyspace served by `$ENDPOINT` to the file `snapshotdb`:

```sh
ETCDCTL_API=3 etcdctl --endpoints $ENDPOINT snapshot save snapshotdb
# exit 0

# verify the snapshot
ETCDCTL_API=3 etcdctl --write-out=table snapshot status snapshotdb
+----------+----------+------------+------------+
|   HASH   | REVISION | TOTAL KEYS | TOTAL SIZE |
+----------+----------+------------+------------+
| fe01cf57 |       10 |          7 | 2.1 MB     |
+----------+----------+------------+------------+
```

### Volume snapshot

If etcd is running on a storage volume that supports backup, such as Amazon Elastic Block Store, back up etcd data by taking a snapshot of the storage volume.

## Scaling up etcd clusters

Scaling up etcd clusters increases availability by trading off performance. Scaling does not increase cluster performance nor capability. A general rule is not to scale up or down etcd clusters. Do not configure any auto scaling groups for etcd clusters. It is highly recommended to always run a static five-member etcd cluster for production Kubernetes clusters at any officially supported scale.

A reasonable scaling is to upgrade a three-member cluster to a five-member one, when more reliability is desired. See [etcd Reconfiguration Documentation](https://github.com/coreos/etcd/blob/master/Documentation/op-guide/runtime-configuration.md#remove-a-member) for information on how to add members into an existing cluster.

## Restoring an etcd cluster

etcd supports restoring from snapshots that are taken from an etcd process of the [major.minor](http://semver.org/) version. Restoring a version from a different patch version of etcd also is supported. A restore operation is employed to recover the data of a failed cluster.

Before starting the restore operation, a snapshot file must be present. It can either be a snapshot file from a previous backup operation, or from a remaining [data directory](https://github.com/coreos/etcd/blob/master/Documentation/op-guide/configuration.md#--data-dir). `datadir` is located at `$DATA_DIR/member/snap/db`. For more information and examples on restoring a cluster from a snapshot file, see [etcd disaster recovery documentation](https://github.com/coreos/etcd/blob/master/Documentation/op-guide/recovery.md#restoring-a-cluster).

If the access URLs of the restored cluster is changed from the previous cluster, the Kubernetes API server must be reconfigured accordingly. In this case, restart Kubernetes API server with the flag `--etcd-servers=$NEW_ETCD_CLUSTER` instead of the flag `--etcd-servers=$OLD_ETCD_CLUSTER`. Replace `$NEW_ETCD_CLUSTER` and `$OLD_ETCD_CLUSTER` with the respective IP addresses. If a load balancer is used in front of an etcd cluster, you might need to update the load balancer instead.

If the majority of etcd members have permanently failed, the etcd cluster is considered failed. In this scenario, Kubernetes cannot make any changes to its current state. Although the scheduled pods might continue to run, no new pods can be scheduled. In such cases, recover the etcd cluster and potentially reconfigure Kubernetes API server to fix the issue.

## Upgrading and rolling back etcd clusters

### Important assumptions

The upgrade procedure described in this document assumes that either:

1. The etcd cluster has only a single node.
2. The etcd cluster has multiple nodes.

   In this case, the upgrade procedure requires shutting down the
   etcd cluster. During the time the etcd cluster is shut down, the Kubernetes API Server will be read only.

**Warning**: Deviations from the assumptions are untested by continuous
integration, and deviations might create undesirable consequences. Additional information about operating an etcd cluster is available [from the etcd maintainers](https://github.com/coreos/etcd/tree/master/Documentation). 
{: .warning}

### Background

As of Kubernetes version 1.5.1, we are still using etcd from the 2.2.1 release with
the v2 API. Also, we have no pre-existing process for updating etcd, as we have
never updated etcd by either minor or major version.

Note that we need to migrate both the etcd versions that we are using (from 2.2.1
to at least 3.0.x) as well as the version of the etcd API that Kubernetes talks to. The etcd 3.0.x
binaries support both the v2 and v3 API.

This document describes how to do this migration. If you want to skip the
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
shutting down the cluster will perform the migration. For example, to upgrade from version 2.1.x to 2.3.y,
it is enough to start etcd in 2.2.z version, wait until it is healthy, stop it, and then start the
2.3.y version.

#### Rollback via additional tooling

Versions 3.0+ of etcd do not support general rollback. That is,
after migrating from M.N to M.N+1, there is no way to go back to M.N.
The etcd team has provided a [custom rollback tool](https://git.k8s.io/kubernetes/cluster/images/etcd/rollback)
but the rollback tool has these limitations:

* This custom rollback tool is not part of the etcd repo and does not receive the same
  testing as the rest of etcd. We are testing it in a couple of end-to-end tests.
  There is only community support here.

* The rollback can be done only from the 3.0.x version (that is using the v3 API) to the
  2.2.1 version (that is using the v2 API).

* The tool only works if the data is stored in `application/json` format.

* Rollback doesn’t preserve resource versions of objects stored in etcd.

**Warning**: If the data is not kept in `application/json` format (see [Upgrade
Procedure](#upgrade-procedure)), you will lose the option to roll back to etcd
2.2.
{: .warning}

The last bullet means that any component or user that has some logic
depending on resource versions may require restart after etcd rollback. This
includes that all clients using the watch API, which depends on
resource versions. Since both the kubelet and kube-proxy use the watch API, a
rollback might require restarting all Kubernetes components on all nodes.

**Note**: At the time of writing, both Kubelet and KubeProxy are using “resource
version” only for watching (i.e. are not using resource versions for anything
else). And both are using reflector and/or informer frameworks for watching
(i.e. they don’t send watch requests themselves). Both those frameworks if they
can’t renew watch, they will start from “current version” by doing “list + watch
from the resource version returned by list”. That means that if the apiserver
will be down for the period of rollback, all of node components should basically
restart their watches and start from “now” when apiserver is back. And it will
be back with new resource version. That would mean that restarting node
components is not needed. But the assumptions here may not hold forever.
{: .note}

### Design

This section describes how we are going to do the migration, given the
[etcd upgrade requirements](#etcd-upgrade-requirements).

Note that because the code changes in Kubernetes code needed
to support the etcd v3 API are local and straightforward, we do not
focus on them at all. We focus only on the upgrade/rollback here.

### New etcd Docker image

We decided to completely change the content of the etcd image and the way it works.
So far, the Docker image for etcd in version X has contained only the etcd and
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
   rollback. This tool reads the v3 formatted data and writes it back to disk
   in v2 format.
1. Finally update the contents of the version file.

### Upgrade procedure
Simply modify the command line in the etcd manifest to:

1. Run the migration script. If the previously run version is already in the
   desired version, this will be no-op.
1. Start etcd in the desired version.

Starting in Kubernetes version 1.6, this has been done in the manifests for new
Google Compute Engine clusters. You should also specify these environment
variables. In particular, you must keep `STORAGE_MEDIA_TYPE` set to
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

## Notes for etcd Version 2.2.1

### Default configuration

The default setup scripts use kubelet's file-based static pods feature to run etcd in a
[pod](http://releases.k8s.io/{{page.githubbranch}}/cluster/gce/manifests/etcd.manifest). This manifest should only
be run on master VMs. The default location that kubelet scans for manifests is
`/etc/kubernetes/manifests/`.

### Kubernetes's usage of etcd

By default, Kubernetes objects are stored under the `/registry` key in etcd.
This path can be prefixed by using the [kube-apiserver](/docs/admin/kube-apiserver) flag
`--etcd-prefix="/foo"`.

`etcd` is the only place that Kubernetes keeps state.

### Troubleshooting

To test whether `etcd` is running correctly, you can try writing a value to a
test key. On your master VM (or somewhere with firewalls configured such that
you can talk to your cluster's etcd), try:

```shell
curl -X PUT "http://${host}:${port}/v2/keys/_test"
```
