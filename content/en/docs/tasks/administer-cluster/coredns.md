---
reviewers:
- johnbelamaric
title: Using CoreDNS for Service Discovery
min-kubernetes-server-version: v1.9
content_template: templates/task
---

{{< feature-state state="beta" >}}

{{% capture overview %}}
This page describes how to enable CoreDNS instead of kube-dns for service
discovery.
{{% /capture %}}

{{% capture prerequisites %}}
{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
{{% /capture %}}

{{% capture steps %}}

## Installing CoreDNS with kubeadm

In Kubernetes 1.9, [CoreDNS](https://coredns.io) is available as an alpha feature, and
in Kubernetes 1.10 it is available as a beta feature. In either case, you may install
it during cluster creation by setting the `CoreDNS` feature gate to `true` during `kubeadm init`:

```
kubeadm init --feature-gates=CoreDNS=true
```

This installs CoreDNS instead of kube-dns.

## Using a custom CoreDNS image repository with kubeadm

To use a custom image repository for the CoreDNS image, e.g. one located in your own Docker registry,
you can execute the following command after kubeadm has deployed the CoreDNS manifest:

```shell
kubectl set image -n kube-system deploy/coredns coredns=prefix.example.com/coredns/coredns:1.0.6
```

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

{{% /capture %}}

{{% capture whatsnext %}}

You can configure [CoreDNS](https://coredns.io) to support many more use cases than
kube-dns by modifying the `Corefile`. For more information, see the
[CoreDNS site](https://coredns.io/2017/05/08/custom-dns-entries-for-kubernetes/).

{{% /capture %}}


