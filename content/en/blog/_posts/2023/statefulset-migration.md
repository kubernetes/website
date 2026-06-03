---
layout: blog
title: "Kubernetes 1.27: StatefulSet Start Ordinal Simplifies Migration"
date: 2023-04-28
slug: statefulset-start-ordinal
author: >
   Peter Schuurman (Google)
---

Kubernetes v1.26 introduced a new, alpha-level feature for
[StatefulSets](/docs/concepts/workloads/controllers/statefulset/) that controls
the ordinal numbering of Pod replicas. As of Kubernetes v1.27, this feature is
now beta. Ordinals can start from arbitrary
non-negative numbers. This blog post will discuss how this feature can be
used.

## Background

StatefulSets ordinals provide sequential identities for pod replicas. When using
[`OrderedReady` Pod management](/docs/tutorials/stateful-application/basic-stateful-set/#orderedready-pod-management)
Pods are created from ordinal index `0` up to `N-1`.

With Kubernetes today, orchestrating a StatefulSet migration across clusters is
challenging. Backup and restore solutions exist, but these require the
application to be scaled down to zero replicas prior to migration. In today's
fully connected world, even planned application downtime may not allow you to
meet your business goals. You could use
[Cascading Delete](/docs/tutorials/stateful-application/basic-stateful-set/#cascading-delete)
or
[On Delete](/docs/tutorials/stateful-application/basic-stateful-set/#on-delete)
to migrate individual pods, however this is error prone and tedious to manage.
You lose the self-healing benefit of the StatefulSet controller when your Pods
fail or are evicted.

Kubernetes v1.26 enables a StatefulSet to be responsible for a range of ordinals
within a range {0..N-1} (the ordinals 0, 1, ... up to N-1).
With it, you can scale down a range
{0..k-1} in a source cluster, and scale up the complementary range {k..N-1}
in a destination cluster, while maintaining application availability. This
enables you to retain *at most one* semantics (meaning there is at most one Pod
with a given identity running in a StatefulSet) and
[Rolling Update](/docs/tutorials/stateful-application/basic-stateful-set/#rolling-update)
behavior when orchestrating a migration across clusters.

## Why would I want to use this feature?

Say you're running your StatefulSet in one cluster, and need to migrate it out
to a different cluster. There are many reasons why you would need to do this:
 * **Scalability**: Your StatefulSet has scaled too large for your cluster, and
   has started to disrupt the quality of service for other workloads in your
   cluster.
 * **Isolation**: You're running a StatefulSet in a cluster that is accessed 
   by multiple users, and namespace isolation isn't sufficient.
 * **Cluster Configuration**: You want to move your StatefulSet to a different
   cluster to use some environment that is not available on your current
   cluster.
 * **Control Plane Upgrades**: You want to move your StatefulSet to a cluster
   running an upgraded control plane, and can't handle the risk or downtime of
   in-place control plane upgrades.

## How do I use it?

Enable the `StatefulSetStartOrdinal` feature gate on a cluster, and create a
StatefulSet with a customized `.spec.ordinals.start`.

## Try it out

In this demo, I'll use the new mechanism to migrate a
StatefulSet from one Kubernetes cluster to another. The
[redis-cluster](https://github.com/bitnami/charts/tree/main/bitnami/redis-cluster)
Bitnami Helm chart will be used to install Redis.

Tools Required:
 * [yq](https://github.com/mikefarah/yq)
 * [helm](https://helm.sh/docs/helm/helm_install/)

### Pre-requisites {#demo-pre-requisites}

To do this, I need two Kubernetes clusters that can both access common
networking and storage; I've named my clusters `source` and `destination`.
Specifically, I need:

* The `StatefulSetStartOrdinal` feature gate enabled on both clusters.
* Client configuration for `kubectl` that lets me access both clusters as an
  administrator.
* The same `StorageClass` installed on both clusters, and set as the default
  StorageClass for both clusters. This `StorageClass` should provision
  underlying storage that is accessible from either or both clusters.
* A flat network topology that allows for pods to send and receive packets to
  and from Pods in either clusters. If you are creating clusters on a cloud
  provider, this configuration may be called private cloud or private network.

1. Create a demo namespace on both clusters:

   ```
   kubectl create ns kep-3335
   ```

2. Deploy a Redis cluster with six replicas in the source cluster:

   ```
   helm repo add bitnami https://charts.bitnami.com/bitnami
   helm install redis --namespace kep-3335 \
     bitnami/redis-cluster \
     --set persistence.size=1Gi \
     --set cluster.nodes=6
   ```

3. Check the replication status in the source cluster:

   ```
   kubectl exec -it redis-redis-cluster-0 -- /bin/bash -c \
     "redis-cli -c -h redis-redis-cluster -a $(kubectl get secret redis-redis-cluster -o jsonpath="{.data.redis-password}" | base64 -d) CLUSTER NODES;"
   ```

   ```
   2ce30362c188aabc06f3eee5d92892d95b1da5c3 10.104.0.14:6379@16379 myself,master - 0 1669764411000 3 connected 10923-16383                                                                                                                                              
   7743661f60b6b17b5c71d083260419588b4f2451 10.104.0.16:6379@16379 slave 2ce30362c188aabc06f3eee5d92892d95b1da5c3 0 1669764410000 3 connected                                                                                             
   961f35e37c4eea507cfe12f96e3bfd694b9c21d4 10.104.0.18:6379@16379 slave a8765caed08f3e185cef22bd09edf409dc2bcc61 0 1669764411000 1 connected                                                                                                             
   7136e37d8864db983f334b85d2b094be47c830e5 10.104.0.15:6379@16379 slave 2cff613d763b22c180cd40668da8e452edef3fc8 0 1669764412595 2 connected                                                                                                                    
   a8765caed08f3e185cef22bd09edf409dc2bcc61 10.104.0.19:6379@16379 master - 0 1669764411592 1 connected 0-5460                                                                                                                                                   
   2cff613d763b22c180cd40668da8e452edef3fc8 10.104.0.17:6379@16379 master - 0 1669764410000 2 connected 5461-10922
   ```

4. Deploy a Redis cluster with zero replicas in the destination cluster:

   ```
   helm install redis --namespace kep-3335 \
     bitnami/redis-cluster \
     --set persistence.size=1Gi \
     --set cluster.nodes=0 \
     --set redis.extraEnvVars\[0\].name=REDIS_NODES,redis.extraEnvVars\[0\].value="redis-redis-cluster-headless.kep-3335.svc.cluster.local" \
     --set existingSecret=redis-redis-cluster
   ```

5. Scale down the `redis-redis-cluster` StatefulSet in the source cluster by 1,
   to remove the replica `redis-redis-cluster-5`:

   ```
   kubectl patch sts redis-redis-cluster -p '{"spec": {"replicas": 5}}'
   ```

6. Migrate dependencies from the source cluster to the destination cluster:

   The following commands copy resources from `source` to `destionation`. Details
   that are not relevant in `destination` cluster are removed (eg: `uid`,
   `resourceVersion`, `status`).

   **Steps for the source cluster**

   Note: If using a `StorageClass` with `reclaimPolicy: Delete` configured, you
         should patch the PVs in `source` with `reclaimPolicy: Retain` prior to
         deletion to retain the underlying storage used in `destination`. See
         [Change the Reclaim Policy of a PersistentVolume](/docs/tasks/administer-cluster/change-pv-reclaim-policy/)
         for more details.

   ```
   kubectl get pvc redis-data-redis-redis-cluster-5 -o yaml | yq 'del(.metadata.uid, .metadata.resourceVersion, .metadata.annotations, .metadata.finalizers, .status)' > /tmp/pvc-redis-data-redis-redis-cluster-5.yaml
   kubectl get pv $(yq '.spec.volumeName' /tmp/pvc-redis-data-redis-redis-cluster-5.yaml) -o yaml | yq 'del(.metadata.uid, .metadata.resourceVersion, .metadata.annotations, .metadata.finalizers, .spec.claimRef, .status)' > /tmp/pv-redis-data-redis-redis-cluster-5.yaml
   kubectl get secret redis-redis-cluster -o yaml | yq 'del(.metadata.uid, .metadata.resourceVersion)' > /tmp/secret-redis-redis-cluster.yaml
   ```

   **Steps for the destination cluster**

   Note: For the PV/PVC, this procedure only works if the underlying storage system
         that your PVs use can support being copied into `destination`. Storage
         that is associated with a specific node or topology may not be supported.
         Additionally, some storage systems may store addtional metadata about
         volumes outside of a PV object, and may require a more specialized
         sequence to import a volume.

   ```
   kubectl create -f /tmp/pv-redis-data-redis-redis-cluster-5.yaml
   kubectl create -f /tmp/pvc-redis-data-redis-redis-cluster-5.yaml
   kubectl create -f /tmp/secret-redis-redis-cluster.yaml
   ```

7. Scale up the `redis-redis-cluster` StatefulSet in the destination cluster by
   1, with a start ordinal of 5:

   ```
   kubectl patch sts redis-redis-cluster -p '{"spec": {"ordinals": {"start": 5}, "replicas": 1}}'
   ```

8. Check the replication status in the destination cluster:

   ```
   kubectl exec -it redis-redis-cluster-5 -- /bin/bash -c \
     "redis-cli -c -h redis-redis-cluster -a $(kubectl get secret redis-redis-cluster -o jsonpath="{.data.redis-password}" | base64 -d) CLUSTER NODES;"
   ```

   I should see that the new replica (labeled `myself`) has joined the Redis
   cluster (the IP address belongs to a different CIDR block than the
   replicas in the source cluster).

   ```
   2cff613d763b22c180cd40668da8e452edef3fc8 10.104.0.17:6379@16379 master - 0 1669766684000 2 connected 5461-10922
   7136e37d8864db983f334b85d2b094be47c830e5 10.108.0.22:6379@16379 myself,slave 2cff613d763b22c180cd40668da8e452edef3fc8 0 1669766685609 2 connected
   2ce30362c188aabc06f3eee5d92892d95b1da5c3 10.104.0.14:6379@16379 master - 0 1669766684000 3 connected 10923-16383
   961f35e37c4eea507cfe12f96e3bfd694b9c21d4 10.104.0.18:6379@16379 slave a8765caed08f3e185cef22bd09edf409dc2bcc61 0 1669766683600 1 connected
   a8765caed08f3e185cef22bd09edf409dc2bcc61 10.104.0.19:6379@16379 master - 0 1669766685000 1 connected 0-5460
   7743661f60b6b17b5c71d083260419588b4f2451 10.104.0.16:6379@16379 slave 2ce30362c188aabc06f3eee5d92892d95b1da5c3 0 1669766686613 3 connected
   ```

9. Repeat steps #5 to #7 for the remainder of the replicas, until the
   Redis StatefulSet in the source cluster is scaled to 0, and the Redis
   StatefulSet in the destination cluster is healthy with 6 total replicas.

## What's Next?

This feature provides a building block for a StatefulSet to be split up across
clusters, but does not prescribe the mechanism as to how the StatefulSet should
be migrated. Migration requires coordination of StatefulSet replicas, along with
orchestration of the storage and network layer. This is dependent on the storage
and connectivity requirements of the application installed by the StatefulSet.
Additionally, many StatefulSets are managed by
[operators](/docs/concepts/extend-kubernetes/operator/), which adds another
layer of complexity to migration.

If you're interested in building enhancements to make these processes easier,
get involved with
[SIG Multicluster](https://github.com/kubernetes/community/blob/master/sig-multicluster)
to contribute!
