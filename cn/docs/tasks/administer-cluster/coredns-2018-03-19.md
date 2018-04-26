---
reviewers:
- johnbelamaric
title: Using CoreDNS for Service Discovery
min-kubernetes-server-version: v1.9
---

{% include feature-state-alpha.md %}

{% capture overview %}
This page describes how to enable CoreDNS instead of kube-dns for service
discovery.
{% endcapture %}

{% capture prerequisites %}
{% include task-tutorial-prereqs.md %}
{% endcapture %}

{% capture steps %}

## Installing CoreDNS with kubeadm

In Kubernetes 1.9, [CoreDNS](https://coredns.io) is available as an alpha feature and
may be installed by setting the `CoreDNS` feature gate to `true` during `kubeadm init`:

```
kubeadm init --feature-gates=CoreDNS=true
```

This installs CoreDNS instead of kube-dns.

{% endcapture %}

{% capture whatsnext %}

You can configure [CoreDNS](https://coredns.io) to support many more use cases than
kube-dns by modifying the `Corefile`. For more information, see the
[CoreDNS site](https://coredns.io/2017/05/08/custom-dns-entries-for-kubernetes/).

{% endcapture %}

{% include templates/task.md %}
