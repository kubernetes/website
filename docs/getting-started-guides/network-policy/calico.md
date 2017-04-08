---
assignees:
- caseydavenport
title: Using Calico for NetworkPolicy
---

You can deploy a cluster using Calico for network policy in the default [GCE deployment](/docs/getting-started-guides/gce) using the following set of commands:

```shell
export NETWORK_POLICY_PROVIDER=calico
curl -sS https://get.k8s.io | bash
cd kubernetes/cluster && ./kube-up.sh
```

See the [Calico documentation](http://docs.projectcalico.org/) for more options to deploy Calico with Kubernetes on GCE, bare metal, and other cloud providers for
both Pod networking and NetworkPolicy enforcement.

Once your cluster using Calico is running, you should see a collection of pods running in the `kube-system` Namespace that support Kubernetes NetworkPolicy.

```console
$ kubectl get pods --namespace=kube-system
NAME                                                 READY     STATUS    RESTARTS   AGE
calico-node-jck6                                     2/2       Running   0          46m
calico-node-k9jy                                     2/2       Running   0          46m
calico-node-szgr                                     2/2       Running   0          46m
...
```

One `calico-node` Pod runs on each node in your cluster, and enforces network policy on the traffic to/from Pods on that machine by configuring iptables.

Once your cluster is running, you can follow the [NetworkPolicy getting started guide](/docs/getting-started-guides/network-policy/walkthrough) to try out Kubernetes NetworkPolicy.
