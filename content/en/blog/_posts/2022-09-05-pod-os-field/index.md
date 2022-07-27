---
layout: blog
title: "Identifying pod operating system authoritatively during pod admission time"
date: 2022-09-05
slug: pod-os-field-explained
---

**Authors:** Ravi Gudimetla (Apple)

This article describes how to identify pod's operating system authoritatively using the `os` field in the pod spec, and how that
helps in securing the kubernetes clusters while ensuring that the workloads can run smoothly.  

## What problems does this solve?

In the first releases of Kubernetes the `kube-apiserver` did not record any detail about which operating system a Pod should run on. Initially, Kubernetes only supported Linux
nodes; later, Kubernetes added support for Windows nodes (stable since Kubernetes v1.14).
You could use [labels](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)
to give the scheduler a hint about where to place your Pod, but the actual Pod API didn't track that
OS at all.
As a result, the end user of a Kubernetes cluster can specify Linux specific security constraints onto Windows pods, or vice-versa.
These security constraints are passed on to the underlying container runtime from kubelet and since these security constraints 
are specific to OS, the containers may fail to come up.
This problem worsens if you use admission plugins or webhooks like `PodSecurity` in your cluster,
which validates the
security constraints to the pods based on the security profile we choose.
While the `kubelet` can identify the OS on which it runs and can strip certain security constraints before passing
onto the container runtime, it'd be better to identify the OS early in the life-cycle of pod and use the 
identification mechanism consistently across all kubernetes components including `kubelet`. 
With that in mind, `os` field has been added to the pod spec in 1.23 release of kubernetes as an 
alpha feature and it graduated to stable in 1.25. In addition, the `PodSecurity` admission plugin has been updated to use the `os` field. 


## How does it work?
Pods now have an optional `.spec.os` field (and this is a stable feature, available in every cluster running
Kubernetes v1.25 or later). Every object in Kubernetes is validated before it . Every object in kubernetes is validated before it 
gets persisted to etcd during API admission time, including pod object.  Kubernetes v1.25 also introduced new validation which forbids Linux specific constraints to be set on Windows pods and vice-versa.

The pod security standards `restricted` profile has been updated to ignore the following policies 
- AllowPrivilegeEscalation
- Capabilities
- SeccompProfile
when `.spec.os.name` for a Pod to `Windows`.


## How do I use it?
By setting `pod.spec.os.name=Windows` or `pod.spec.os.name=Linux`. Sample pod.yaml

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  os:
    name: Windows
  containers:
  - name: nginx
    image: nginx:1.14.2
    ports:
    - containerPort: 80

```

## How can I learn more?
KEP: https://github.com/kubernetes/enhancements/issues/2802
API Changes: https://github.com/kubernetes/kubernetes/pull/104693
Docs: https://kubernetes.io/docs/concepts/workloads/pods/#pod-os

## How do I get involved?
This is a joint effort between [#sig-windows](https://kubernetes.slack.com/archives/C0SJ4AFB7), [#sig-auth](https://kubernetes.slack.com/archives/C0EN96KUY) and [#sig-node](https://kubernetes.slack.com/archives/C0BP8PW9G). 
    Please reach out to us on those slack channels.