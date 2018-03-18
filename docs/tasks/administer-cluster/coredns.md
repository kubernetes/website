---
reviewers:
- johnbelamaric
title: Using CoreDNS for Service Discovery
min-kubernetes-server-version: v1.9
---

{% include feature-state-beta.md %}

{% capture overview %}
This page describes how to enable CoreDNS instead of kube-dns for service
discovery.
{% endcapture %}

{% capture prerequisites %}
{% include task-tutorial-prereqs.md %}
{% endcapture %}

{% capture steps %}

## Installing CoreDNS with kubeadm

In Kubernetes 1.9, [CoreDNS](https://coredns.io) is available as an alpha feature, and
in Kubernetes 1.10 it is available as a beta feature. In either case, you may install
it during cluster creation by setting the `CoreDNS` feature gate to `true` during `kubeadm init`:

```
kubeadm init --feature-gates=CoreDNS=true
```

This installs CoreDNS instead of kube-dns.

## Upgrading an Existing Cluster with kubeadm

In Kubernetes 1.10, you can also move to CoreDNS when you use `kubeadm` to upgrade
a cluster that is using `kube-dns`. In this case, `kubeadm` will generate the CoreDNS configuration
("Corefile") based upon the `kube-dns` ConfigMap, preserving configurations for federation,
stub domains, and upstream name server.

Note that if you are running CoreDNS in your cluster already, prior to upgrade, your existing Corefile will be
**overwritten** by the one created during upgrade. **You should save your existing ConfigMap
if you have customized it.** You may re-apply your customizations after the new ConfigMap is
up and running.

This process will be modified for the GA release of this feature, such that an existing
Corefile will not be overwritten.

{% endcapture %}

{% capture whatsnext %}

You can configure [CoreDNS](https://coredns.io) to support many more use cases than
kube-dns by modifying the `Corefile`. For more information, see the
[CoreDNS site](https://coredns.io/2017/05/08/custom-dns-entries-for-kubernetes/).

{% endcapture %}

{% include templates/task.md %}
