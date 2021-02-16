---
reviewers:
- mml
- wojtek-t
title: Operating etcd clusters for Kubernetes
content_type: task
---

<!-- overview -->

{{< glossary_definition term_id="etcd" length="all" prepend="etcd is a ">}}




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## Prerequisites

* Run etcd as a cluster of odd members.

* etcd is a leader-based distributed system. Ensure that the leader periodically send heartbeats on time to all followers to keep the cluster stable.

* Ensure that no resource starvation occurs.

  Performance and stability of the cluster is sensitive to network and disk IO. Any resource starvation can lead to heartbeat timeout, causing instability of the cluster. An unstable etcd indicates that no leader is elected. Under such circumstances, a cluster cannot make any changes to its current state, which implies no new pods can be scheduled.

* Keeping stable etcd clusters is critical to the stability of Kubernetes clusters. Therefore, run etcd clusters on dedicated machines or isolated environments for [guaranteed resource requirements](https://github.com/coreos/etcd/blob/master/Documentation/op-guide/hardware.md#hardware-recommendations).

* The minimum recommended version of etcd to run in production is `3.2.10+`.

## Resource requirements

Operating etcd with limited resources is suitable only for testing purposes. For deploying in production, advanced hardware configuration is required. Before deploying etcd in production, see [resource requirement reference documentation](https://github.com/coreos/etcd/blob/master/Documentation/op-guide/hardware.md#example-hardware-configurations).

## Starting etcd clusters

This section covers starting a single-node and multi-node etcd cluster.

### Single-node etcd cluster

Use a single-node etcd cluster only for testing purpose.

1. Run the following:

    ```sh
    ./etcd --listen-client-urls=http://$PRIVATE_IP:2379 --advertise-client-urls=http://$PRIVATE_IP:2379
    ```

2. Start Kubernetes API server with the flag `--etcd-servers=$PRIVATE_IP:2379`.

    Replace `PRIVATE_IP` with your etcd client IP.

### Multi-node etcd cluster

For durability and high availability, run etcd as a multi-node cluster in production and back it up periodically. A five-member cluster is recommended in production. For more information, see [FAQ Documentation](https://github.com/coreos/etcd/blob/master/Documentation/faq.md#what-is-failure-tolerance).

Configure an etcd cluster either by static member information or by dynamic discovery. For more information on clustering, see [etcd Clustering Documentation](https://github.com/coreos/etcd/blob/master/Documentation/op-guide/clustering.md).

For an example, consider a five-member etcd cluster running with the following client URLs: `http://$IP1:2379`, `http://$IP2:2379`, `http://$IP3:2379`, `http://$IP4:2379`, and `http://$IP5:2379`. To start a Kubernetes API server:

1. Run the following:

    ```sh
    ./etcd --listen-client-urls=http://$IP1:2379, http://$IP2:2379, http://$IP3:2379, http://$IP4:2379, http://$IP5:2379 --advertise-client-urls=http://$IP1:2379, http://$IP2:2379, http://$IP3:2379, http://$IP4:2379, http://$IP5:2379
    ```

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

Once etcd is configured correctly, only clients with valid certificates can access it. To give Kubernetes API server the access, configure it with the flags `--etcd-certfile=k8sclient.cert`,`--etcd-keyfile=k8sclient.key` and `--etcd-cafile=ca.cert`.

{{< note >}}
etcd authentication is not currently supported by Kubernetes. For more information, see the related issue [Support Basic Auth for Etcd v2](https://github.com/kubernetes/kubernetes/issues/23398).
{{< /note >}}

## Replacing a failed etcd member

etcd cluster achieves high availability by tolerating minor member failures. However, to improve the overall health of the cluster, replace failed members immediately. When multiple members fail, replace them one by one. Replacing a failed member involves two steps: removing the failed member and adding a new member.

Though etcd keeps unique member IDs internally, it is recommended to use a unique name for each member to avoid human errors. For example, consider a three-member etcd cluster. Let the URLs be, member1=http://10.0.0.1, member2=http://10.0.0.2, and member3=http://10.0.0.3. When member1 fails, replace it with member4=http://10.0.0.4.

1. Get the member ID of the failed member1:

    `etcdctl --endpoints=http://10.0.0.2,http://10.0.0.3 member list`

      The following message is displayed:

        8211f1d0f64f3269, started, member1, http://10.0.0.1:2380, http://10.0.0.1:2379
        91bc3c398fb3c146, started, member2, http://10.0.0.2:2380, http://10.0.0.2:2379
        fd422379fda50e48, started, member3, http://10.0.0.3:2380, http://10.0.0.3:2379

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

etcd supports built-in snapshot. A snapshot may either be taken from a live member with the `etcdctl snapshot save` command or by copying the `member/snap/db` file from an etcd [data directory](https://github.com/coreos/etcd/blob/master/Documentation/op-guide/configuration.md#--data-dir) that is not currently used by an etcd process. Taking the snapshot will normally not affect the performance of the member.

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

Before starting the restore operation, a snapshot file must be present. It can either be a snapshot file from a previous backup operation, or from a remaining [data directory](https://etcd.io/docs/current/op-guide/configuration/#--data-dir). For more information and examples on restoring a cluster from a snapshot file, see [etcd disaster recovery documentation](https://etcd.io/docs/current/op-guide/recovery/#restoring-a-cluster).

If the access URLs of the restored cluster is changed from the previous cluster, the Kubernetes API server must be reconfigured accordingly. In this case, restart Kubernetes API server with the flag `--etcd-servers=$NEW_ETCD_CLUSTER` instead of the flag `--etcd-servers=$OLD_ETCD_CLUSTER`. Replace `$NEW_ETCD_CLUSTER` and `$OLD_ETCD_CLUSTER` with the respective IP addresses. If a load balancer is used in front of an etcd cluster, you might need to update the load balancer instead.

If the majority of etcd members have permanently failed, the etcd cluster is considered failed. In this scenario, Kubernetes cannot make any changes to its current state. Although the scheduled pods might continue to run, no new pods can be scheduled. In such cases, recover the etcd cluster and potentially reconfigure Kubernetes API server to fix the issue.

{{< note >}}
If any API servers are running in your cluster, you should not attempt to restore instances of etcd.
Instead, follow these steps to restore etcd:

- stop *all* kube-apiserver instances
- restore state in all etcd instances
- restart all kube-apiserver instances

We also recommend restarting any components (e.g. kube-scheduler, kube-controller-manager, kubelet) to ensure that they don't
rely on some stale data. Note that in practice, the restore takes a bit of time.
During the restoration, critical components will lose leader lock and restart themselves.
{{< /note >}}

## Upgrading and rolling back etcd clusters

As of Kubernetes v1.13.0, etcd2 is no longer supported as a storage backend for
new or existing Kubernetes clusters. The timeline for Kubernetes support for
etcd2 and etcd3 is as follows:

- Kubernetes v1.0: etcd2 only
- Kubernetes v1.5.1: etcd3 support added, new clusters still default to etcd2
- Kubernetes v1.6.0: new clusters created with `kube-up.sh` default to etcd3,
                     and `kube-apiserver` defaults to etcd3
- Kubernetes v1.9.0: deprecation of etcd2 storage backend announced
- Kubernetes v1.13.0: etcd2 storage backend removed, `kube-apiserver` will
                      refuse to start with `--storage-backend=etcd2`, with the
                      message `etcd2 is no longer a supported storage backend`

Before upgrading a v1.12.x kube-apiserver using `--storage-backend=etcd2` to
v1.13.x, etcd v2 data must be migrated to the v3 storage backend and
kube-apiserver invocations must be changed to use `--storage-backend=etcd3`.

The process for migrating from etcd2 to etcd3 is highly dependent on how the
etcd cluster was deployed and configured, as well as how the Kubernetes
cluster was deployed and configured. We recommend that you consult your cluster
provider's documentation to see if there is a predefined solution.

If your cluster was created via `kube-up.sh` and is still using etcd2 as its
storage backend, please consult the [Kubernetes v1.12 etcd cluster upgrade docs](https://v1-12.docs.kubernetes.io/docs/tasks/administer-cluster/configure-upgrade-etcd/#upgrading-and-rolling-back-etcd-clusters)

## Known issue: etcd client balancer with secure endpoints

The etcd v3 client, released in etcd v3.3.13 or earlier, has a [critical bug](https://github.com/kubernetes/kubernetes/issues/72102) which affects the kube-apiserver and HA deployments. The etcd client balancer failover does not properly work against secure endpoints. As a result, etcd servers may fail or disconnect briefly from the kube-apiserver. This affects kube-apiserver HA deployments.

The fix was made in [etcd v3.4](https://github.com/etcd-io/etcd/pull/10911) (and backported to v3.3.14 or later): the new client now creates its own credential bundle to correctly set authority target in dial function.

Because the fix requires gRPC dependency upgrade (to v1.23.0), downstream Kubernetes [did not backport etcd upgrades](https://github.com/kubernetes/kubernetes/issues/72102#issuecomment-526645978). Which means the [etcd fix in kube-apiserver](https://github.com/etcd-io/etcd/pull/10911/commits/db61ee106ca9363ba3f188ecf27d1a8843da33ab) is only available from Kubernetes 1.16.

To urgently fix this bug for Kubernetes 1.15 or earlier, build a custom kube-apiserver. You can make local changes to [`vendor/google.golang.org/grpc/credentials/credentials.go`](https://github.com/kubernetes/kubernetes/blob/7b85be021cd2943167cd3d6b7020f44735d9d90b/vendor/google.golang.org/grpc/credentials/credentials.go#L135) with [etcd@db61ee106](https://github.com/etcd-io/etcd/pull/10911/commits/db61ee106ca9363ba3f188ecf27d1a8843da33ab).

See ["kube-apiserver 1.13.x refuses to work when first etcd-server is not available"](https://github.com/kubernetes/kubernetes/issues/72102).


