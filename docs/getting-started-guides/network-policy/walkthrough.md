---
assignees:
- caseydavenport

---

Kubernetes can be used to declare network policies which govern how Pods can communicate with each other.  This document helps you get started using the Kubernetes [NetworkPolicy API](/docs/user-guide/networkpolicies), and provides a demonstration thereof. 

In this article we assume that a Kubernetes cluster has been created with network policy support.  There are a number of network providers which support NetworkPolicy (see the "Using X for NetworkPolicy" articles in this section).  The reference implementation is [Calico](/docs/getting-started-guides/network-policy/calico) running on GCE.

The following example walkthrough will work on a Kubernetes cluster using any of the listed providers.

## Using NetworkPolicy 

To explain how Kubernetes network policy works let's start off by creating an `nginx` Deployment and expose it via a Service. 

```console
$ kubectl run nginx --image=nginx --replicas=2
deployment "nginx" created
$ kubectl expose deployment nginx --port=80 
service "nginx" exposed
```

This will run two nginx Pods in the default Namespace, and expose them through a Service called `nginx`. 

```console
$ kubectl get svc,pod
NAME                    CLUSTER-IP    EXTERNAL-IP   PORT(S)    AGE
kubernetes              10.100.0.1    <none>        443/TCP    46m
nginx                   10.100.0.16   <none>        80/TCP     33s
NAME                    READY         STATUS        RESTARTS   AGE
nginx-701339712-e0qfq   1/1           Running       0          35s
nginx-701339712-o00ef   1/1           Running       0          35s
```

We should be able to access our new nginx Service from other Pods.  Let's try to access it from another Pod 
in the default namespace.  We haven't put any network policy in place, so this should just work. Start a 
busybox container, and use `wget` to hit the nginx Service:

```console
$ kubectl run busybox --rm -ti --image=busybox /bin/sh
Waiting for pod default/busybox-472357175-y0m47 to be running, status is Pending, pod ready: false

Hit enter for command prompt

/ # wget -s --timeout=1 nginx
Connecting to nginx (10.100.0.16:80)
/ #
```

Let's say we want to limit access to our nginx Service so that only pods with the label `access: true` can query it.  First, we'll
enable ingress isolation on the `default` Namespace.  This will prevent _any_ pods from accessing the nginx Service.

```console
$ kubectl annotate ns default "net.beta.kubernetes.io/network-policy={\"ingress\": {\"isolation\": \"DefaultDeny\"}}"
```

With ingress isolation in place, we should no longer be able to access the nginx Service like we were able to before.

Let's now create a `NetworkPolicy` which allows connections from pods with the label `access: true`.

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

Use kubectl to create the above nginx-policy.yaml file:
```console
$ kubectl create -f nginx-policy.yaml
networkpolicy "access-nginx" created
```

If we attempt to access the nginx Service from a pod without the correct labels, the request will timeout:

```console
$ kubectl run busybox --rm -ti --image=busybox /bin/sh
Waiting for pod default/busybox-472357175-y0m47 to be running, status is Pending, pod ready: false

Hit enter for command prompt

/ # wget -s --timeout=1 nginx 
Connecting to nginx (10.100.0.16:80)
wget: download timed out
/ #
```

However, if we create a Pod with the correct labels, the request will be allowed:

```console
$ kubectl run busybox --rm -ti --labels="access=true" --image=busybox /bin/sh
Waiting for pod default/busybox-472357175-y0m47 to be running, status is Pending, pod ready: false

Hit enter for command prompt

/ # wget -s --timeout=1 nginx
Connecting to nginx (10.100.0.16:80)
/ #
```
