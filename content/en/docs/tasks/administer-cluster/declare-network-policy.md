---
reviewers:
- caseydavenport
- danwinship
title: Declare Network Policy
min-kubernetes-server-version: v1.8
content_type: task
---
<!-- overview -->
This document helps you get started using the Kubernetes [NetworkPolicy API](/docs/concepts/services-networking/network-policies/) to declare network policies that govern how pods communicate with each other.

{{% thirdparty-content %}}

## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Make sure you've configured a network provider with network policy support. There are a number of network providers that support NetworkPolicy, including:

* [Antrea](/docs/tasks/administer-cluster/network-policy-provider/antrea-network-policy/)
* [Calico](/docs/tasks/administer-cluster/network-policy-provider/calico-network-policy/)
* [Cilium](/docs/tasks/administer-cluster/network-policy-provider/cilium-network-policy/)
* [Kube-router](/docs/tasks/administer-cluster/network-policy-provider/kube-router-network-policy/)
* [Romana](/docs/tasks/administer-cluster/network-policy-provider/romana-network-policy/)
* [Weave Net](/docs/tasks/administer-cluster/network-policy-provider/weave-network-policy/)

<!-- steps -->

## Create an `nginx` deployment and expose it via a service

To see how Kubernetes network policy works, start off by creating an `nginx` Deployment.

```console
kubectl create deployment nginx --image=nginx
```
```none
deployment.apps/nginx created
```

Expose the Deployment through a Service called `nginx`.

```console
kubectl expose deployment nginx --port=80
```

```none
service/nginx exposed
```

The above commands create a Deployment with an nginx Pod and expose the Deployment through a Service named `nginx`. The `nginx` Pod and Deployment are found in the `default` namespace.

```console
kubectl get svc,pod
```

```none
NAME                        CLUSTER-IP    EXTERNAL-IP   PORT(S)    AGE
service/kubernetes          10.100.0.1    <none>        443/TCP    46m
service/nginx               10.100.0.16   <none>        80/TCP     33s

NAME                        READY         STATUS        RESTARTS   AGE
pod/nginx-701339712-e0qfq   1/1           Running       0          35s
```

## Test the service by accessing it from another Pod

You should be able to access the new `nginx` service from other Pods. To access the `nginx` Service from another Pod in the `default` namespace, start a busybox container:

```console
kubectl run busybox --rm -ti --image=busybox -- /bin/sh
```

In your shell, run the following command:

```shell
wget --spider --timeout=1 nginx
```

```none
Connecting to nginx (10.100.0.16:80)
remote file exists
```

## Limit access to the `nginx` service

To limit the access to the `nginx` service so that only Pods with the label `access: true` can query it, create a NetworkPolicy object as follows:

{{< codenew file="service/networking/nginx-policy.yaml" >}}

The name of a NetworkPolicy object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

{{< note >}}
NetworkPolicy includes a `podSelector` which selects the grouping of Pods to which the policy applies. You can see this policy selects Pods with the label `app=nginx`. The label was automatically added to the Pod in the `nginx` Deployment. An empty `podSelector` selects all pods in the namespace.
{{< /note >}}

## Assign the policy to the service

Use kubectl to create a NetworkPolicy from the above `nginx-policy.yaml` file:

```console
kubectl apply -f https://k8s.io/examples/service/networking/nginx-policy.yaml
```

```none
networkpolicy.networking.k8s.io/access-nginx created
```

## Test access to the service when access label is not defined
When you attempt to access the `nginx` Service from a Pod without the correct labels, the request times out:

```console
kubectl run busybox --rm -ti --image=busybox -- /bin/sh
```

In your shell, run the command:

```shell
wget --spider --timeout=1 nginx
```

```none
Connecting to nginx (10.100.0.16:80)
wget: download timed out
```

## Define access label and test again

You can create a Pod with the correct labels to see that the request is allowed:

```console
kubectl run busybox --rm -ti --labels="access=true" --image=busybox -- /bin/sh
```

In your shell, run the command:

```shell
wget --spider --timeout=1 nginx
```

```none
Connecting to nginx (10.100.0.16:80)
remote file exists
```


