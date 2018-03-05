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

In Kuberentes 1.10, you can also move to CoreDNS when you use `kubeadm` to upgrade
a cluster that is using `kube-dns`. In this case, `kubeadm` will generate the CoreDNS configuration
("Corefile") based upon the `kube-dns` ConfigMap, preserving configurations for federation,
stub domains, and upstream name server.

Note that if you are running CoreDNS already in your cluster, this conversion is not possible,
as your Corefile may contain other customizations which should not be overwritten. In that
case, it is recommended that you update your Corefile according to the changes you can find
in the [recommended CoreDNS Kubernetes manifest](https://github.com/coredns/deployment/tree/master/kubernetes).

In particular, changes that may be important are:

* Updating the image to `coredns/coredns:1.0.6`
* Changing `upstream /etc/resolv.conf` to just `upstream`, which changes external service CNAME lookups
  to go through CoreDNS rather than directly through and external name server.

{% endcapture %}

{% capture whatsnext %}

You can configure [CoreDNS](https://coredns.io) to support many more use cases than
kube-dns by modifying the `Corefile`. For more information, see the
[CoreDNS site](https://coredns.io/2017/05/08/custom-dns-entries-for-kubernetes/).

{% endcapture %}

{% include templates/task.md %}
