---
assignees:
- caseydavenport
title: Declare Network Policy
redirect_from:
- "/docs/getting-started-guides/network-policy/walkthrough/"
- "/docs/getting-started-guides/network-policy/walkthrough.html"
- "/docs/tasks/configure-pod-container/declare-network-policy/"
- "/docs/tasks/configure-pod-container/declare-network-policy.html"
---
{% capture overview %}
This document helps you get started using using the Kubernetes [NetworkPolicy API](/docs/user-guide/network-policies) to declare network policies that govern how pods communicate with each other. 
{% endcapture %}

{% capture prerequisites %}
You'll need to have a Kubernetes cluster in place, with network policy support. There are a number of network providers that support NetworkPolicy, including:

* [Calico](/docs/tasks/configure-pod-container/calico-network-policy/)
* [Romana](/docs/tasks/configure-pod-container/romana-network-policy/)
* [Weave Net](/docs/tasks/configure-pod-container/weave-network-policy/)

**Note**: The above list is sorted alphabetically by product name, not by recommendation or preference. This example is valid for a Kubernetes cluster using any of these providers.
{% endcapture %}


{% capture steps %}

## Create an `nginx` deployment and expose it via a service

To see how Kubernetes network policy works, start off by creating an `nginx` deployment and exposing it via a service. 

```console
$ kubectl run nginx --image=nginx --replicas=2
deployment "nginx" created
$ kubectl expose deployment nginx --port=80 
service "nginx" exposed
```

This runs two `nginx` pods in the default namespace, and exposes them through a service called `nginx`. 

```console
$ kubectl get svc,pod
NAME                        CLUSTER-IP    EXTERNAL-IP   PORT(S)    AGE
svc/kubernetes              10.100.0.1    <none>        443/TCP    46m
svc/nginx                   10.100.0.16   <none>        80/TCP     33s

NAME                        READY         STATUS        RESTARTS   AGE
po/nginx-701339712-e0qfq    1/1           Running       0          35s
po/nginx-701339712-o00ef    1/1           Running       0          35s
```

## Test the service by accessing it from another pod

You should be able to access the new `nginx` service from other pods. To test, access the service from another pod in the default namespace. Make sure you haven't enabled isolation on the namespace.

Start a busybox container, and use `wget` on the `nginx` service:

```console
$ kubectl run busybox --rm -ti --image=busybox /bin/sh
Waiting for pod default/busybox-472357175-y0m47 to be running, status is Pending, pod ready: false

Hit enter for command prompt

/ # wget --spider --timeout=1 nginx
Connecting to nginx (10.100.0.16:80)
/ #
```

## Limit access to the `nginx` service

Let's say you want to limit access to the `nginx` service so that only pods with the label `access: true` can query it. The first step is to enable ingress isolation on the `default` namespace. This prevents **_any_** pods from accessing the `nginx` service.

```console
$ kubectl annotate ns default "net.beta.kubernetes.io/network-policy={\"ingress\": {\"isolation\": \"DefaultDeny\"}}"
```

## Test the access limitation

Test to see that with ingress isolation in place, you no longer have access to the `nginx` service:

```console
$ kubectl run busybox --rm -ti --image=busybox /bin/sh
Waiting for pod default/busybox-472357175-y0m47 to be running, status is Pending, pod ready: false

Hit enter for command prompt

/ # wget --spider --timeout=1 nginx
Connecting to nginx (10.100.0.16:80)
wget: download timed out
/ #
```

## Create a policy that allows connections from authorized pods

Next, create a `NetworkPolicy` that allows connections from pods with the label `access: true`.

```yaml
kind: NetworkPolicy
apiVersion: extensions/v1beta1
metadata:
  name: access-nginx
spec:
  podSelector:
    matchLabels:
      run: nginx
  ingress:
  - from:
    - podSelector:
        matchLabels:
          access: "true"
```

## Assign the policy to the service

Use kubectl to create a NetworkPolicy from the above nginx-policy.yaml file:
```console
$ kubectl create -f nginx-policy.yaml
networkpolicy "access-nginx" created
```

## Test access to the service when access label is not defined
If we attempt to access the nginx Service from a pod without the correct labels, the request will still time out:

```console
$ kubectl run busybox --rm -ti --image=busybox /bin/sh
Waiting for pod default/busybox-472357175-y0m47 to be running, status is Pending, pod ready: false

Hit enter for command prompt

/ # wget --spider --timeout=1 nginx 
Connecting to nginx (10.100.0.16:80)
wget: download timed out
/ #
```

## Define access label and test again

Create a pod with the correct labels, and you'll see that the request is allowed:

```console
$ kubectl run busybox --rm -ti --labels="access=true" --image=busybox /bin/sh
Waiting for pod default/busybox-472357175-y0m47 to be running, status is Pending, pod ready: false

Hit enter for command prompt

/ # wget --spider --timeout=1 nginx
Connecting to nginx (10.100.0.16:80)
/ #
```
{% endcapture %}


{% capture whatsnext %}
Learn more about [kubectl proxy](/docs/user-guide/kubectl/v1.6/#proxy).
{% endcapture %}

{% include templates/task.md %}

