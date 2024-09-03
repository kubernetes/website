---
reviewers:
- mml
- wojtek-t
- jpbetz
title: Operating etcd clusters for Kubernetes
content_type: task
weight: 270
---

<!-- overview -->

{{< glossary_definition term_id="etcd" length="all" prepend="etcd is a ">}}

## {{% heading "prerequisites" %}}

Before you follow steps in this page to deploy, manage, back up or restore etcd,
you need to understand the typical expectations for operating an etcd cluster.
Refer to the [etcd documentation](https://etcd.io/docs/) for more context.

Key details include:

* The minimum recommended etcd versions to run in production are `3.4.22+` and `3.5.6+`.

* etcd is a leader-based distributed system. Ensure that the leader
  periodically send heartbeats on time to all followers to keep the cluster
  stable.

* You should run etcd as a cluster with an odd number of members.

* Aim to ensure that no resource starvation occurs.

  Performance and stability of the cluster is sensitive to network and disk
  I/O. Any resource starvation can lead to heartbeat timeout, causing instability
  of the cluster. An unstable etcd indicates that no leader is elected. Under
  such circumstances, a cluster cannot make any changes to its current state,
  which implies no new pods can be scheduled.

### Resource requirements for etcd

Operating etcd with limited resources is suitable only for testing purposes.
For deploying in production, advanced hardware configuration is required.
Before deploying etcd in production, see
[resource requirement reference](https://etcd.io/docs/current/op-guide/hardware/#example-hardware-configurations).

Keeping etcd clusters stable is critical to the stability of Kubernetes
clusters. Therefore, run etcd clusters on dedicated machines or isolated
environments for [guaranteed resource requirements](https://etcd.io/docs/current/op-guide/hardware/).

### Tools

Depending on which specific outcome you're working on, you will need the `etcdctl` tool or the
`etcdutl` tool (you may need both).

<!-- steps -->

## Understanding etcdctl and etcdutl

`etcdctl` and `etcdutl` are command-line tools used to interact with etcd clusters, but they serve different purposes:

- `etcdctl`: This is the primary command-line client for interacting with etcd over a
network. It is used for day-to-day operations such as managing keys and values,
administering the cluster, checking health, and more.

- `etcdutl`: This is an administration utility designed to operate directly on etcd data
files, including migrating data between etcd versions, defragmenting the database,
restoring snapshots, and validating data consistency. For network operations, `etcdctl`
should be used.

For more information on `etcdutl`, you can refer to the [etcd recovery documentation](https://etcd.io/docs/v3.5/op-guide/recovery/).


## Starting etcd clusters

This section covers starting a single-node and multi-node etcd cluster.

This guide assumes that `etcd` is already installed.

### Single-node etcd cluster

Use a single-node etcd cluster only for testing purposes.

1. Run the following:

   ```sh
   etcd --listen-client-urls=http://$PRIVATE_IP:2379 \
      --advertise-client-urls=http://$PRIVATE_IP:2379
   ```

2. Start the Kubernetes API server with the flag
   `--etcd-servers=$PRIVATE_IP:2379`.

   Make sure `PRIVATE_IP` is set to your etcd client IP.

### Multi-node etcd cluster

For durability and high availability, run etcd as a multi-node cluster in
production and back it up periodically. A five-member cluster is recommended
in production. For more information, see
[FAQ documentation](https://etcd.io/docs/current/faq/#what-is-failure-tolerance).

As you're using Kubernetes, you have the option to run etcd as a container inside
one or more Pods. The `kubeadm` tool sets up etcd
{{< glossary_tooltip text="static pods" term_id="static-pod" >}} by default, or
you can deploy a
[separate cluster](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)
and instruct kubeadm to use that etcd cluster as the control plane's backing store.

You configure an etcd cluster either by static member information or by dynamic
discovery. For more information on clustering, see
[etcd clustering documentation](https://etcd.io/docs/current/op-guide/clustering/).

For an example, consider a five-member etcd cluster running with the following
client URLs: `http://$IP1:2379`, `http://$IP2:2379`, `http://$IP3:2379`,
`http://$IP4:2379`, and `http://$IP5:2379`. To start a Kubernetes API server:

1. Run the following:

   ```shell
   etcd --listen-client-urls=http://$IP1:2379,http://$IP2:2379,http://$IP3:2379,http://$IP4:2379,http://$IP5:2379 --advertise-client-urls=http://$IP1:2379,http://$IP2:2379,http://$IP3:2379,http://$IP4:2379,http://$IP5:2379
   ```

2. Start the Kubernetes API servers with the flag
   `--etcd-servers=$IP1:2379,$IP2:2379,$IP3:2379,$IP4:2379,$IP5:2379`.

   Make sure the `IP<n>` variables are set to your client IP addresses.

### Multi-node etcd cluster with load balancer

To run a load balancing etcd cluster:

1. Set up an etcd cluster.
2. Configure a load balancer in front of the etcd cluster.
   For example, let the address of the load balancer be `$LB`.
3. Start Kubernetes API Servers with the flag `--etcd-servers=$LB:2379`.

## Securing etcd clusters

Access to etcd is equivalent to root permission in the cluster so ideally only
the API server should have access to it. Considering the sensitivity of the
data, it is recommended to grant permission to only those nodes that require
access to etcd clusters.

To secure etcd, either set up firewall rules or use the security features
provided by etcd. etcd security features depend on x509 Public Key
Infrastructure (PKI). To begin, establish secure communication channels by
generating a key and certificate pair. For example, use key pairs `peer.key`
and `peer.cert` for securing communication between etcd members, and
`client.key` and `client.cert` for securing communication between etcd and its
clients. See the [example scripts](https://github.com/coreos/etcd/tree/master/hack/tls-setup)
provided by the etcd project to generate key pairs and CA files for client
authentication.

### Securing communication

To configure etcd with secure peer communication, specify flags
`--peer-key-file=peer.key` and `--peer-cert-file=peer.cert`, and use HTTPS as
the URL schema.

Similarly, to configure etcd with secure client communication, specify flags
`--key-file=k8sclient.key` and `--cert-file=k8sclient.cert`, and use HTTPS as
the URL schema. Here is an example on a client command that uses secure
communication:

```
ETCDCTL_API=3 etcdctl --endpoints 10.2.0.9:2379 \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  member list
```

### Limiting access of etcd clusters

After configuring secure communication, restrict the access of the etcd cluster to
only the Kubernetes API servers using TLS authentication.

For example, consider key pairs `k8sclient.key` and `k8sclient.cert` that are
trusted by the CA `etcd.ca`. When etcd is configured with `--client-cert-auth`
along with TLS, it verifies the certificates from clients by using system CAs
or the CA passed in by `--trusted-ca-file` flag. Specifying flags
`--client-cert-auth=true` and `--trusted-ca-file=etcd.ca` will restrict the
access to clients with the certificate `k8sclient.cert`.

Once etcd is configured correctly, only clients with valid certificates can
access it. To give Kubernetes API servers the access, configure them with the
flags `--etcd-certfile=k8sclient.cert`, `--etcd-keyfile=k8sclient.key` and
`--etcd-cafile=ca.cert`.

{{< note >}}
etcd authentication is not planned for Kubernetes.
{{< /note >}}

## Replacing a failed etcd member

etcd cluster achieves high availability by tolerating minor member failures.
However, to improve the overall health of the cluster, replace failed members
immediately. When multiple members fail, replace them one by one. Replacing a
failed member involves two steps: removing the failed member and adding a new
member.

Though etcd keeps unique member IDs internally, it is recommended to use a
unique name for each member to avoid human errors. For example, consider a
three-member etcd cluster. Let the URLs be, `member1=http://10.0.0.1`,
`member2=http://10.0.0.2`, and `member3=http://10.0.0.3`. When `member1` fails,
replace it with `member4=http://10.0.0.4`.

1. Get the member ID of the failed `member1`:

   ```shell
   etcdctl --endpoints=http://10.0.0.2,http://10.0.0.3 member list
   ```

   The following message is displayed:

   ```console
   8211f1d0f64f3269, started, member1, http://10.0.0.1:2380, http://10.0.0.1:2379
   91bc3c398fb3c146, started, member2, http://10.0.0.2:2380, http://10.0.0.2:2379
   fd422379fda50e48, started, member3, http://10.0.0.3:2380, http://10.0.0.3:2379
   ```

1. Do either of the following:

   1. If each Kubernetes API server is configured to communicate with all etcd
      members, remove the failed member from the `--etcd-servers` flag, then
      restart each Kubernetes API server.
   1. If each Kubernetes API server communicates with a single etcd member,
      then stop the Kubernetes API server that communicates with the failed
      etcd.

1. Stop the etcd server on the broken node. It is possible that other 
   clients besides the Kubernetes API server are causing traffic to etcd 
   and it is desirable to stop all traffic to prevent writes to the data
   directory.

1. Remove the failed member:

   ```shell
   etcdctl member remove 8211f1d0f64f3269
   ```

   The following message is displayed:

   ```console
   Removed member 8211f1d0f64f3269 from cluster
   ```

1. Add the new member:

   ```shell
   etcdctl member add member4 --peer-urls=http://10.0.0.4:2380
   ```

   The following message is displayed:

   ```console
   Member 2be1eb8f84b7f63e added to cluster ef37ad9dc622a7c4
   ```

1. Start the newly added member on a machine with the IP `10.0.0.4`:

   ```shell
   export ETCD_NAME="member4"
   export ETCD_INITIAL_CLUSTER="member2=http://10.0.0.2:2380,member3=http://10.0.0.3:2380,member4=http://10.0.0.4:2380"
   export ETCD_INITIAL_CLUSTER_STATE=existing
   etcd [flags]
   ```

1. Do either of the following:

   1. If each Kubernetes API server is configured to communicate with all etcd
      members, add the newly added member to the `--etcd-servers` flag, then
      restart each Kubernetes API server.
   1. If each Kubernetes API server communicates with a single etcd member,
      start the Kubernetes API server that was stopped in step 2. Then
      configure Kubernetes API server clients to again route requests to the
      Kubernetes API server that was stopped. This can often be done by
      configuring a load balancer.

For more information on cluster reconfiguration, see
[etcd reconfiguration documentation](https://etcd.io/docs/current/op-guide/runtime-configuration/#remove-a-member).

## Backing up an etcd cluster

All Kubernetes objects are stored in etcd. Periodically backing up the etcd
cluster data is important to recover Kubernetes clusters under disaster
scenarios, such as losing all control plane nodes. The snapshot file contains
all the Kubernetes state and critical information. In order to keep the
sensitive Kubernetes data safe, encrypt the snapshot files.

Backing up an etcd cluster can be accomplished in two ways: etcd built-in
snapshot and volume snapshot.

### Built-in snapshot

etcd supports built-in snapshot. A snapshot may either be created from a live
member with the `etcdctl snapshot save` command or by copying the
`member/snap/db` file from an etcd
[data directory](https://etcd.io/docs/current/op-guide/configuration/#--data-dir)
that is not currently used by an etcd process. Creating the snapshot will
not affect the performance of the member.

Below is an example for creating a snapshot of the keyspace served by
`$ENDPOINT` to the file `snapshot.db`:

```shell
ETCDCTL_API=3 etcdctl --endpoints $ENDPOINT snapshot save snapshot.db
```

Verify the snapshot:

{{< tabs name="etcd_verify_snapshot" >}}
{{% tab name="Use etcdutl" %}}
   The below example depicts the usage of the `etcdutl` tool for verifying a snapshot:

   ```shell
   etcdutl --write-out=table snapshot status snapshot.db 
   ```

   This should generate an output resembling the example provided below:

   ```console
   +----------+----------+------------+------------+
   |   HASH   | REVISION | TOTAL KEYS | TOTAL SIZE |
   +----------+----------+------------+------------+
   | fe01cf57 |       10 |          7 | 2.1 MB     |
   +----------+----------+------------+------------+
   ```

{{% /tab %}}
{{% tab name="Use etcdctl (Deprecated)" %}}

   {{< note >}}
   The usage of `etcdctl snapshot status` has been **deprecated** since etcd v3.5.x and is slated for removal from etcd v3.6.
   It is recommended to utilize [`etcdutl`](https://github.com/etcd-io/etcd/blob/main/etcdutl/README.md) instead.
   {{< /note >}}

   The below example depicts the usage of the `etcdctl` tool for verifying a snapshot:

   ```shell
   export ETCDCTL_API=3
   etcdctl --write-out=table snapshot status snapshot.db
   ```

   This should generate an output resembling the example provided below:

   ```console
   Deprecated: Use `etcdutl snapshot status` instead.

   +----------+----------+------------+------------+
   |   HASH   | REVISION | TOTAL KEYS | TOTAL SIZE |
   +----------+----------+------------+------------+
   | fe01cf57 |       10 |          7 | 2.1 MB     |
   +----------+----------+------------+------------+
   ```


{{% /tab %}}
{{< /tabs >}}

### Volume snapshot

If etcd is running on a storage volume that supports backup, such as Amazon
Elastic Block Store, back up etcd data by creating a snapshot of the storage
volume.

### Snapshot using etcdctl options

We can also create the snapshot using various options given by etcdctl. For example: 

```shell
ETCDCTL_API=3 etcdctl -h 
``` 

will list various options available from etcdctl. For example, you can create a snapshot by specifying
the endpoint, certificates and key as shown below:

```shell
ETCDCTL_API=3 etcdctl --endpoints=https://127.0.0.1:2379 \
  --cacert=<trusted-ca-file> --cert=<cert-file> --key=<key-file> \
  snapshot save <backup-file-location>
```
where `trusted-ca-file`, `cert-file` and `key-file` can be obtained from the description of the etcd Pod.

## Scaling out etcd clusters

Scaling out etcd clusters increases availability by trading off performance.
Scaling does not increase cluster performance nor capability. A general rule
is not to scale out or in etcd clusters. Do not configure any auto scaling
groups for etcd clusters. It is strongly recommended to always run a static
five-member etcd cluster for production Kubernetes clusters at any officially
supported scale.

A reasonable scaling is to upgrade a three-member cluster to a five-member
one, when more reliability is desired. See
[etcd reconfiguration documentation](https://etcd.io/docs/current/op-guide/runtime-configuration/#remove-a-member)
for information on how to add members into an existing cluster.

## Restoring an etcd cluster

{{< caution >}}
If any API servers are running in your cluster, you should not attempt to
restore instances of etcd. Instead, follow these steps to restore etcd:

- stop *all* API server instances
- restore state in all etcd instances
- restart all API server instances

The Kubernetes project also recommends restarting Kubernetes components (`kube-scheduler`,
`kube-controller-manager`, `kubelet`) to ensure that they don't rely on some
stale data. In practice the restore takes a bit of time.  During the
restoration, critical components will lose leader lock and restart themselves.
{{< /caution >}}

etcd supports restoring from snapshots that are taken from an etcd process of
the [major.minor](http://semver.org/) version. Restoring a version from a
different patch version of etcd is also supported. A restore operation is
employed to recover the data of a failed cluster.

Before starting the restore operation, a snapshot file must be present. It can
either be a snapshot file from a previous backup operation, or from a remaining
[data directory](https://etcd.io/docs/current/op-guide/configuration/#--data-dir).

{{< tabs name="etcd_restore" >}}
{{% tab name="Use etcdutl" %}}
   When restoring the cluster using [`etcdutl`](https://github.com/etcd-io/etcd/blob/main/etcdutl/README.md),
   use the `--data-dir` option to specify to which folder the cluster should be restored:

   ```shell
   etcdutl --data-dir <data-dir-location> snapshot restore snapshot.db
   ```
   where `<data-dir-location>` is a directory that will be created during the restore process.

{{% /tab %}}
{{% tab name="Use etcdctl (Deprecated)" %}}

   {{< note >}}
   The usage of `etcdctl` for restoring has been **deprecated** since etcd v3.5.x and is slated for removal from etcd v3.6.
   It is recommended to utilize [`etcdutl`](https://github.com/etcd-io/etcd/blob/main/etcdutl/README.md) instead.
   {{< /note >}}

   The below example depicts the usage of the `etcdctl` tool for the restore operation:

   ```shell
   export ETCDCTL_API=3
   etcdctl --data-dir <data-dir-location> snapshot restore snapshot.db
   ```

   If `<data-dir-location>` is the same folder as before, delete it and stop the etcd process before restoring the cluster. 
   Otherwise, change etcd configuration and restart the etcd process after restoration to have it use the new data directory:
   first change  `/etc/kubernetes/manifests/etcd.yaml`'s `volumes.hostPath.path` for `name: etcd-data`  to `<data-dir-location>`,
   then execute `kubectl -n kube-system delete pod <name-of-etcd-pod>` or `systemctl restart kubelet.service` (or both).

{{% /tab %}}
{{< /tabs >}}

For more information and examples on restoring a cluster from a snapshot file, see
[etcd disaster recovery documentation](https://etcd.io/docs/current/op-guide/recovery/#restoring-a-cluster).

If the access URLs of the restored cluster are changed from the previous
cluster, the Kubernetes API server must be reconfigured accordingly. In this
case, restart Kubernetes API servers with the flag
`--etcd-servers=$NEW_ETCD_CLUSTER` instead of the flag
`--etcd-servers=$OLD_ETCD_CLUSTER`. Replace `$NEW_ETCD_CLUSTER` and
`$OLD_ETCD_CLUSTER` with the respective IP addresses. If a load balancer is
used in front of an etcd cluster, you might need to update the load balancer
instead.

If the majority of etcd members have permanently failed, the etcd cluster is
considered failed. In this scenario, Kubernetes cannot make any changes to its
current state. Although the scheduled pods might continue to run, no new pods
can be scheduled. In such cases, recover the etcd cluster and potentially
reconfigure Kubernetes API servers to fix the issue.


## Upgrading etcd clusters

{{< caution >}}
Before you start an upgrade, back up your etcd cluster first.
{{< /caution >}}

For details on etcd upgrade, refer to the [etcd upgrades](https://etcd.io/docs/latest/upgrades/) documentation.

## Maintaining etcd clusters

For more details on etcd maintenance, please refer to the [etcd maintenance](https://etcd.io/docs/latest/op-guide/maintenance/) documentation.

### Cluster defragmentation

{{% thirdparty-content single="true" %}}

Defragmentation is an expensive operation, so it should be executed as infrequently
as possible. On the other hand, it's also necessary to make sure any etcd member
will not exceed the storage quota. The Kubernetes project recommends that when
you perform defragmentation, you use a tool such as [etcd-defrag](https://github.com/ahrtr/etcd-defrag).

You can also run the defragmentation tool as a Kubernetes CronJob, to make sure that
defragmentation happens regularly. See [`etcd-defrag-cronjob.yaml`](https://github.com/ahrtr/etcd-defrag/blob/main/doc/etcd-defrag-cronjob.yaml)
for details.
