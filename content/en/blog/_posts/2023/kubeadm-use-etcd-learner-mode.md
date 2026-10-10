---
layout: blog
title: 'kubeadm: Use etcd Learner to Join a Control Plane Node Safely'
date: 2023-09-25
slug: kubeadm-use-etcd-learner-mode
author: >
  Paco Xu (DaoCloud)
---

The [`kubeadm`](/docs/reference/setup-tools/kubeadm/) tool now supports etcd learner mode, which
allows you to enhance the resilience and stability
of your Kubernetes clusters by leveraging the [learner mode](https://etcd.io/docs/v3.4/learning/design-learner/#appendix-learner-implementation-in-v34)
feature introduced in etcd version 3.4.
This guide will walk you through using etcd learner mode with kubeadm. By default, kubeadm runs
a local etcd instance on each control plane node.

In v1.27, kubeadm introduced a new feature gate `EtcdLearnerMode`. With this feature gate enabled,
when joining a new control plane node, a new etcd member will be created as a learner and
promoted to a voting member only after the etcd data are fully aligned.

## What are the advantages of using etcd learner mode?

etcd learner mode offers several compelling reasons to consider its adoption
in Kubernetes clusters:

1. **Enhanced Resilience**: etcd learner nodes are non-voting members that catch up with
   the leader's logs before becoming fully operational. This prevents new cluster members
   from disrupting the quorum or causing leader elections, making the cluster more resilient
   during membership changes.
1. **Reduced Cluster Unavailability**: Traditional approaches to adding new members often
   result in cluster unavailability periods, especially in slow infrastructure or misconfigurations.
   etcd learner mode minimizes such disruptions.
1. **Simplified Maintenance**: Learner nodes provide a safer and reversible way to add or replace
   cluster members. This reduces the risk of accidental cluster outages due to misconfigurations or
   missteps during member additions.
1. **Improved Network Tolerance**: In scenarios involving network partitions, learner mode allows
   for more graceful handling. Depending on the partition a new member lands, it can seamlessly
   integrate with the existing cluster without causing disruptions.

In summary, the etcd learner mode improves the reliability and manageability of Kubernetes clusters
during member additions and changes, making it a valuable feature for cluster operators.

## How nodes join a cluster that's using the new mode

### Create a Kubernetes cluster backed by etcd in learner mode {#create-K8s-cluster-etcd-learner-mode}

For a general explanation about creating highly available clusters with kubeadm, you can refer to
[Creating Highly Available Clusters with kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/).

To create a Kubernetes cluster, backed by etcd in learner mode, using kubeadm, follow these steps:

```shell
# kubeadm init --feature-gates=EtcdLearnerMode=true ...
kubeadm init --config=kubeadm-config.yaml
```

The kubeadm configuration file is like below:

```yaml
apiVersion: kubeadm.k8s.io/v1beta3
kind: ClusterConfiguration
featureGates:
  EtcdLearnerMode: true
```

The kubeadm tool deploys a single-node Kubernetes cluster with etcd set to use learner mode.

### Join nodes to the Kubernetes cluster

Before joining a control-plane node to the new Kubernetes cluster, ensure that the existing control plane nodes
and all etcd members are healthy.

Check the cluster health with `etcdctl`. If `etcdctl` isn't available, you can run this tool inside a container image.
You would do that directly with your container runtime using a tool such as `crictl run` and not through Kubernetes

Here is an example on a client command that uses secure communication to check the cluster health of the etcd cluster:

```shell
ETCDCTL_API=3 etcdctl --endpoints 127.0.0.1:2379 \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  member list
...
dc543c4d307fadb9, started, node1, https://10.6.177.40:2380, https://10.6.177.40:2379, false
```

To check if the Kubernetes control plane is healthy, run `kubectl get node -l node-role.kubernetes.io/control-plane=`
and check if the nodes are ready.

{{< note >}}
It is recommended to have an odd number of members in an etcd cluster.
{{< /note >}}

Before joining a worker node to the new Kubernetes cluster, ensure that the control plane nodes are healthy.

## What's next

- The feature gate `EtcdLearnerMode` is alpha in v1.27 and we expect it to graduate to beta in the next
  minor release of Kubernetes (v1.29).
- etcd has an open issue that may make the process more automatic:
  [Support auto-promoting a learner member to a voting member](https://github.com/etcd-io/etcd/issues/15107).
- Learn more about the kubeadm [configuration format](/docs/reference/config-api/kubeadm-config.v1beta3/).

## Feedback

Was this guide helpful? If you have any feedback or encounter any issues, please let us know.
Your feedback is always welcome! Join the bi-weekly [SIG Cluster Lifecycle meeting](https://docs.google.com/document/d/1Gmc7LyCIL_148a9Tft7pdhdee0NBHdOfHS1SAF0duI4/edit)
or weekly [kubeadm office hours](https://docs.google.com/document/d/130_kiXjG7graFNSnIAgtMS1G8zPDwpkshgfRYS0nggo/edit).
Or reach us via [Slack](https://slack.k8s.io/) (channel **#kubeadm**), or the
[SIG's mailing list](https://groups.google.com/g/kubernetes-sig-cluster-lifecycle).
