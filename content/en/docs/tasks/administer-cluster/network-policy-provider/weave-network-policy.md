---
reviewers:
- bboreham
title: Weave Net for NetworkPolicy
content_template: templates/task
weight: 50
---

{{% capture overview %}}

This page shows how to use Weave Net for NetworkPolicy.

{{% /capture %}}

{{% capture prerequisites %}}

You need to have a Kubernetes cluster. Follow the [kubeadm getting started guide](/docs/getting-started-guides/kubeadm/) to bootstrap one.

{{% /capture %}}

{{% capture steps %}}

## Install the Weave Net addon

Follow the [Integrating Kubernetes via the Addon](https://www.weave.works/docs/net/latest/kube-addon/) guide.

The Weave Net addon for Kubernetes comes with a [Network Policy Controller](https://www.weave.works/docs/net/latest/kube-addon/#npc) that automatically monitors Kubernetes for any NetworkPolicy annotations on all namespaces and configures `iptables` rules to allow or block traffic as directed by the policies.

## Test the installation

Verify that the weave works.

Enter the following command:

```shell
kubectl get po -n kube-system -o wide
```

The output is similar to this:

```
NAME                                    READY     STATUS    RESTARTS   AGE       IP              NODE
weave-net-1t1qg                         2/2       Running   0          9d        192.168.2.10    worknode3
weave-net-231d7                         2/2       Running   1          7d        10.2.0.17       worknodegpu
weave-net-7nmwt                         2/2       Running   3          9d        192.168.2.131   masternode
weave-net-pmw8w                         2/2       Running   0          9d        192.168.2.216   worknode2
```

Each Node has a weave Pod, and all Pods are `Running` and `2/2 READY`. (`2/2` means that each Pod has `weave` and `weave-npc`.)

{{% /capture %}}

{{% capture whatsnext %}}

Once you have installed the Weave Net addon, you can follow the [Declare Network Policy](/docs/tasks/administer-cluster/declare-network-policy/) to try out Kubernetes NetworkPolicy. If you have any question, contact us at [#weave-community on Slack or Weave User Group](https://github.com/weaveworks/weave#getting-help).

{{% /capture %}}


