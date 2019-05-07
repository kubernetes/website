---
reviewers:
- danwent
- aanm
title: Use Cilium for NetworkPolicy
content_template: templates/task
weight: 20
---

{{% capture overview %}}
This page shows how to use Cilium for NetworkPolicy.

For background on Cilium, read the [Introduction to Cilium](https://cilium.readthedocs.io/en/stable/intro).
{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}

{{% capture steps %}}
## Deploying Cilium on Minikube for Basic Testing

To get familiar with Cilium easily you can follow the
[Cilium Kubernetes Getting Started Guide](https://cilium.readthedocs.io/en/stable/gettingstarted/minikube/)
to perform a basic DaemonSet installation of Cilium in minikube.

To start minikube, minimal version required is >= v0.33.1, run the with the
following arguments:

```shell
minikube version
```
```
minikube version: v0.33.1
```

```shell
minikube start --network-plugin=cni --memory=4096
```

For minikube you can deploy this simple ''all-in-one'' YAML file that includes
DaemonSet configurations for Cilium, and the necessary configurations to connect
to the etcd instance deployed in minikube as well as appropriate RBAC settings:

```shell
kubectl create -f  https://raw.githubusercontent.com/cilium/cilium/v1.5/examples/kubernetes/1.14/cilium-minikube.yaml
```
```
configmap/cilium-config created
daemonset.apps/cilium created
clusterrolebinding.rbac.authorization.k8s.io/cilium created
clusterrole.rbac.authorization.k8s.io/cilium created
serviceaccount/cilium created
```

The remainder of the Getting Started Guide explains how to enforce both L3/L4
(i.e., IP address + port) security policies, as well as L7 (e.g., HTTP) security
policies using an example application.

## Deploying Cilium for Production Use

For detailed instructions around deploying Cilium for production, see:
[Cilium Kubernetes Installation Guide](https://cilium.readthedocs.io/en/stable/kubernetes/intro/)
This documentation includes detailed requirements, instructions and example
production DaemonSet files.

{{% /capture %}}

{{% capture discussion %}}
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

There are two main components to be aware of:

- One `cilium` Pod runs on each node in your cluster and enforces network policy
on the traffic to/from Pods on that node using Linux BPF.
- For production deployments, Cilium should leverage a key-value store
(e.g., etcd). The [Cilium Kubernetes Installation Guide](https://cilium.readthedocs.io/en/stable/kubernetes/intro/)
will provide the necessary steps on how to install this required key-value
store as well how to configure it in Cilium.

{{% /capture %}}

{{% capture whatsnext %}}
Once your cluster is running, you can follow the
[Declare Network Policy](/docs/tasks/administer-cluster/declare-network-policy/)
to try out Kubernetes NetworkPolicy with Cilium.
Have fun, and if you have questions, contact us using the
[Cilium Slack Channel](https://cilium.herokuapp.com/).
{{% /capture %}}


