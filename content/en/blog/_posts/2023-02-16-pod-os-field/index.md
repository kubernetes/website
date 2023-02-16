---
layout: blog
title: "Identifying Pod Operating System Authoritatively During Pod Admission Time"
date: 2022-09-20
slug: pod-os-field-explained
---

**Authors:** Ravi Gudimetla (Apple)

This article describes how to identify pod's operating system authoritatively using the `os` field in the pod spec, and how that
helps in securing Kubernetes clusters while ensuring that the workloads can run smoothly.

## What problems does this solve?

In the first releases of Kubernetes the `kube-apiserver` did not record any detail about which operating system a Pod should run on. Initially, Kubernetes only supported Linux
nodes; later, Kubernetes added support for Windows nodes (stable since Kubernetes v1.14).
While Kubernetes has multiple ways to hint scheduler about the node on which pod needs to run, a more common way is to use nodeSelector but the actual Pod API didn't track that pod OS at all.

As a result, the end user of a Kubernetes cluster can specify Linux specific security constraints onto Windows pods, or vice-versa.
These security constraints are passed on to the underlying container runtime from kubelet and since these security constraints 
are specific to OS, the containers may fail to come up.
This problem worsens if you use admission plugins or webhooks like `PodSecurity` in your cluster,
which validates the
security constraints to the pods based on the Pod security standard you choose to enforce.

While the `kubelet` can identify the OS on which it runs and can strip certain security constraints before passing
onto the container runtime, it'd be better to identify the target OS early in the life-cycle of pod and use the 
identification mechanism consistently across all Kubernetes components including `kubelet`. 
With that in mind, an `os` field was added to the pod API in 1.23 release of Kubernetes (as an 
alpha feature). With Kubernetes v1.25, that field is stable, and the `PodSecurity` admission
plugin has been updated to take the `os` field into account. More information on how `os` field impacts pod security standards can be found at
https://kubernetes.io/docs/concepts/security/pod-security-standards


## How does it work?
Pods now have an optional `.spec.os` field (and this is a stable feature, available in every cluster running
Kubernetes v1.25 or later). Every object in Kubernetes is validated before it 
gets persisted to etcd during API admission time, including Pods.  Kubernetes v1.25 also introduced new validation which forbids you from specify Linux-specific security controls for Windows pods, or vice-versa.

The pod security standards `restricted` profile has been updated to ignore the following policies 
- AllowPrivilegeEscalation
- Capabilities
- SeccompProfile
when you set the `.spec.os.name` for a Pod to `Windows`.


## How do I use it?
By setting `spec.os.name: "Linux"` or `spec.os.name: "Windows"`. Here's a sample manifest:

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

- [KEP](https://github.com/kubernetes/enhancements/issues/2802)
- [k/k pull request #104693](https://github.com/kubernetes/kubernetes/pull/104693) (API changes for Pod OS)
- [Pod OS](https://kubernetes.io/docs/concepts/workloads/pods/#pod-os) in the Kubernetes documentation

## How do I get involved?
This is a joint effort between SIG Windows, SIG Auth, and SIG Node.  
Please reach out to us on those Slack channels:  [#sig-windows](https://kubernetes.slack.com/archives/C0SJ4AFB7), [#sig-auth](https://kubernetes.slack.com/archives/C0EN96KUY) and [#sig-node](https://kubernetes.slack.com/archives/C0BP8PW9G). 
