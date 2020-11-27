---
reviewers:
- danwent
- aanm
title: Use Cilium for NetworkPolicy
content_type: task
weight: 20
---

<!-- overview -->
This page shows how to use Cilium for NetworkPolicy.

For background on Cilium, read the [Introduction to Cilium](https://docs.cilium.io/en/stable/intro).


## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->
## Deploying Cilium on Minikube for Basic Testing

To get familiar with Cilium easily you can follow the
[Cilium Kubernetes Getting Started Guide](https://docs.cilium.io/en/stable/gettingstarted/minikube/)
to perform a basic DaemonSet installation of Cilium in minikube.

To start minikube, minimal version required is >= v1.3.1, run the with the
following arguments:

```shell
minikube version
```
```
minikube version: v1.3.1
```

```shell
minikube start --network-plugin=cni --memory=4096
```

Mount the BPF filesystem:

```shell
minikube ssh -- sudo mount bpffs -t bpf /sys/fs/bpf
```

For minikube you can deploy this simple ''all-in-one'' YAML file that includes
DaemonSet configurations for Cilium as well as appropriate RBAC settings:

```shell
kubectl create -f https://raw.githubusercontent.com/cilium/cilium/v1.8/install/kubernetes/quick-install.yaml
```
```
configmap/cilium-config created
serviceaccount/cilium created
serviceaccount/cilium-operator created
clusterrole.rbac.authorization.k8s.io/cilium created
clusterrole.rbac.authorization.k8s.io/cilium-operator created
clusterrolebinding.rbac.authorization.k8s.io/cilium created
clusterrolebinding.rbac.authorization.k8s.io/cilium-operator created
daemonset.apps/cilium create
deployment.apps/cilium-operator created
```

The remainder of the Getting Started Guide explains how to enforce both L3/L4
(i.e., IP address + port) security policies, as well as L7 (e.g., HTTP) security
policies using an example application.

## Deploying Cilium for Production Use

For detailed instructions around deploying Cilium for production, see:
[Cilium Kubernetes Installation Guide](https://docs.cilium.io/en/stable/concepts/kubernetes/intro/)
This documentation includes detailed requirements, instructions and example
production DaemonSet files.



<!-- discussion -->
##  Understanding Cilium components

Deploying a cluster with Cilium adds Pods to the `kube-system` namespace. To see
this list of Pods run:

```shell
kubectl get pods --namespace=kube-system
```

You'll see a list of Pods similar to this:

```console
NAME            READY   STATUS    RESTARTS   AGE
cilium-6rxbd    1/1     Running   0          1m
...
```

A `cilium` Pod runs on each node in your cluster and enforces network policy
on the traffic to/from Pods on that node using Linux BPF.



## {{% heading "whatsnext" %}}

Once your cluster is running, you can follow the
[Declare Network Policy](/docs/tasks/administer-cluster/declare-network-policy/)
to try out Kubernetes NetworkPolicy with Cilium.
Have fun, and if you have questions, contact us using the
[Cilium Slack Channel](https://cilium.herokuapp.com/).



