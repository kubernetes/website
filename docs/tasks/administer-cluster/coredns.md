---
approvers:
- johnbelamaric
title: Using CoreDNS for Service Discovery
---

{% include feature-state-alpha.md %}

{% capture overview %}
This page describes how to enable CoreDNS instead of kube-dns for service
discovery.
{% endcapture %}

{% capture prerequisites %}
* Kubernetes version 1.9 and above.
{% endcapture %}

{% capture steps %}

## Installing CoreDNS with kubeadm

In Kubernetes 1.9, [CoreDNS](https://coredns.io) is available as an alpha feature and
may be installed by setting the `CoreDNS` feature gate to `true` during `kubeadm init`:

```
kubeadm init --feature-gates=CoreDNS=true
```

This will install CoreDNS instead of kube-dns.

{% capture whatsnext %}

[CoreDNS](https://coredns.io) may be configured to support many more use cases than
kube-dns by modifying the `Corefile`. See the CoreDNS [site](https://coredns.io) for some
[examples](https://coredns.io/2017/05/08/custom-dns-entries-for-kubernetes/).

{% endcapture %}

{% include templates/task.md %}
