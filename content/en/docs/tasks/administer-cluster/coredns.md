---
reviewers:
- johnbelamaric
title: Using CoreDNS for Service Discovery
min-kubernetes-server-version: v1.9
content_template: templates/task
---

{{% capture overview %}}
This page describes the CoreDNS upgrade process and how to install kube-dns instead of CoreDNS.
{{% /capture %}}

{{% capture prerequisites %}}
{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
{{% /capture %}}

{{% capture steps %}}

## About CoreDNS

[CoreDNS](https://coredns.io) is a flexible, extensible DNS server that can serve as the Kubernetes cluster DNS.
Like Kubernetes, the CoreDNS project is hosted by the [CNCF.](http://www.cncf.io)

You can use CoreDNS instead of kube-dns in your cluster by replacing kube-dns in an existing
deployment, or by using tools like kubeadm that will deploy and upgrade the cluster for you.

## Installing CoreDNS

For manual deployment or replacement of kube-dns, see the documentation at the
[CoreDNS GitHub project.](https://github.com/coredns/deployment/tree/master/kubernetes)

## Installing CoreDNS with kubeadm

In Kubernetes 1.11, CoreDNS has graduated to General Availability (GA)
and is installed by default. To install kube-dns instead, set the `CoreDNS` feature gate
value to `false`:
```
kubeadm init --feature-gates=CoreDNS=false
```

## Upgrading an existing cluster with kubeadm

In Kubernetes version 1.10 and later, you can also move to CoreDNS when you use `kubeadm` to upgrade
a cluster that is using `kube-dns`. In this case, `kubeadm` will generate the CoreDNS configuration
("Corefile") based upon the `kube-dns` ConfigMap, preserving configurations for federation,
stub domains, and upstream name server.

If you are moving from kube-dns to CoreDNS, make sure to set the `CoreDNS` feature gate to `true`
during an upgrade. For example, here is what a `v1.11.0` upgrade would look like:
```
kubeadm upgrade apply v1.11.0 --feature-gates=CoreDNS=true
```

In versions prior to 1.11 the Corefile will be **overwritten** by the one created during upgrade.
**You should save your existing ConfigMap if you have customized it.** You may re-apply your
customizations after the new ConfigMap is up and running.

If you are running CoreDNS in Kubernetes version 1.11 and later, during upgrade,
your existing Corefile will be retained.

{{% /capture %}}

{{% capture whatsnext %}}

You can configure [CoreDNS](https://coredns.io) to support many more use cases than
kube-dns by modifying the `Corefile`. For more information, see the
[CoreDNS site](https://coredns.io/2017/05/08/custom-dns-entries-for-kubernetes/).

{{% /capture %}}


