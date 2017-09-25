---
assignees:
- danwent
title: Use Cilium for NetworkPolicy
---

{% capture overview %}
This page shows how to use Cilium for NetworkPolicy.

For background on Cilium, read the [Introduction to Cilium](http://cilium.readthedocs.io/en/latest/intro/).
{% endcapture %}

{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}

{% capture steps %}
## Deploying Cilium on Minikube for Basic Testing

To get familiar with Cilium easily you can follow the
[Cilium Kubernetes Getting Started Guide](http://www.cilium.io/try)
to perform a basic DaemonSet installation of Cilium in minikube.

Installation in a minikube setup uses a simple ''all-in-one'' YAML
file that includes DaemonSet configurations for Cilium and a key-value store
(consul) as well as appropriate RBAC settings:

```shell
$ kubectl create -f https://raw.githubusercontent.com/cilium/cilium/master/examples/minikube/cilium-ds.yaml
clusterrole "cilium" created
serviceaccount "cilium" created
clusterrolebinding "cilium" created
daemonset "cilium-consul" created
daemonset "cilium" created
```

The remainder of the Getting Started Guide explains how to enforce both L3/L4 (i.e., IP address + port) security
policies, as well as L7 (e.g., HTTP) security policies using an example application.

## Deploying Cilium for Production Use

For detailed instructions around deploying Cilium for production, see:
[Cilium Administrator Guide](http://cilium.readthedocs.io/en/latest/admin/) This
documentation includes detailed requirements, instructions and example production DaemonSet files.

{% endcapture %}

{% capture discussion %}
##  Understanding Cilium components

Deploying a cluster with Cilium adds Pods to the `kube-system` namespace.  To see this list of Pods run:

```shell
kubectl get pods --namespace=kube-system
```

You'll see a list of Pods similar to this:

```console
NAME            DESIRED   CURRENT   READY     NODE-SELECTOR   AGE
cilium          1         1         1         <none>          2m
...
```

There are two main components to be aware of:

- One `cilium` Pod runs on each node in your cluster and enforces network policy on the traffic to/from Pods on that node using Linux BPF.
- For production deployments, Cilium should leverage the key-value store cluster (e.g., etcd) used by Kubernetes, which typically runs on the Kubernetes master nodes.   The [Cilium Administrator Guide](http://cilium.readthedocs.io/en/latest/admin/) includes an example DaemonSet which can be customized to point to this key-value store cluster.   The simple ''all-in-one'' DaemonSet for minikube requires no such configuration because it automatically deploys a `cilium-consul` Pod to provide a key-value store.

{% endcapture %}

{% capture whatsnext %}
Once your cluster is running, you can follow the [NetworkPolicy getting started guide](/docs/getting-started-guides/network-policy/walkthrough) to try out Kubernetes NetworkPolicy with Cilium.  Have fun, and if you have questions, contact us using the [Cilium Slack Channel](https://cilium.herokuapp.com/).
{% endcapture %}

{% include templates/task.md %}
