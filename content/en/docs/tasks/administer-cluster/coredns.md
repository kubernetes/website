---
reviewers:
- johnbelamaric
title: Using CoreDNS for Service Discovery
min-kubernetes-server-version: v1.9
content_template: templates/task
---

{{% capture overview %}}
This page describes the CoreDNS upgrade process and how to install CoreDNS instead of kube-dns.
{{% /capture %}}

{{% capture prerequisites %}}
{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
{{% /capture %}}

{{% capture steps %}}

## About CoreDNS

[CoreDNS](https://coredns.io) is a flexible, extensible DNS server that can serve as the Kubernetes cluster DNS.
Like Kubernetes, the CoreDNS project is hosted by the {{< glossary_tooltip text="CNCF" term_id="cncf" >}}.

You can use CoreDNS instead of kube-dns in your cluster by replacing kube-dns in an existing
deployment, or by using tools like kubeadm that will deploy and upgrade the cluster for you.

## Installing CoreDNS

For manual deployment or replacement of kube-dns, see the documentation at the
[CoreDNS GitHub project.](https://github.com/coredns/deployment/tree/master/kubernetes)

## Migrating to CoreDNS

### Upgrading an existing cluster with kubeadm

In Kubernetes version 1.10 and later, you can also move to CoreDNS when you use `kubeadm` to upgrade
a cluster that is using `kube-dns`. In this case, `kubeadm` will generate the CoreDNS configuration
("Corefile") based upon the `kube-dns` ConfigMap, preserving configurations for federation,
stub domains, and upstream name server.

If you are moving from kube-dns to CoreDNS, make sure to set the `CoreDNS` feature gate to `true`
during an upgrade. For example, here is what a `v1.11.0` upgrade would look like:
```
kubeadm upgrade apply v1.11.0 --feature-gates=CoreDNS=true
```

In Kubernetes version 1.13 and later the `CoreDNS` feature gate is removed and CoreDNS
is used by default. Follow the guide outlined [here](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase#cmd-phase-addon) if you want
your upgraded cluster to use kube-dns.

In versions prior to 1.11 the Corefile will be **overwritten** by the one created during upgrade.
**You should save your existing ConfigMap if you have customized it.** You may re-apply your
customizations after the new ConfigMap is up and running.

If you are running CoreDNS in Kubernetes version 1.11 and later, during upgrade,
your existing Corefile will be retained.


### Installing kube-dns instead of CoreDNS with kubeadm

{{< note >}}
In Kubernetes 1.11, CoreDNS has graduated to General Availability (GA)
and is installed by default.
{{< /note >}}

To install kube-dns on versions prior to 1.13, set the `CoreDNS` feature gate
value to `false`:

```
kubeadm init --feature-gates=CoreDNS=false
```

For versions 1.13 and later, follow the guide outlined [here](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase#cmd-phase-addon).

## Upgrading CoreDNS 

CoreDNS is available in Kubernetes since v1.9. 
You can check the version of CoreDNS shipped with Kubernetes and the changes made to CoreDNS [here](https://github.com/coredns/deployment/blob/master/kubernetes/CoreDNS-k8s_version.md).

CoreDNS can be upgraded manually in case you want to only upgrade CoreDNS or use your own custom image.
There is a helpful [guideline and walkthrough](https://github.com/coredns/deployment/blob/master/kubernetes/Upgrading_CoreDNS.md) available to ensure a smooth upgrade.

## Tuning CoreDNS

When resource utilisation is a concern, it may be useful to tune the configuration of CoreDNS. For more details, check out the
[documentation on scaling CoreDNS](https://github.com/coredns/deployment/blob/master/kubernetes/Scaling_CoreDNS.md).

{{% /capture %}}

{{% capture whatsnext %}}

You can configure [CoreDNS](https://coredns.io) to support many more use cases than
kube-dns by modifying the `Corefile`. For more information, see the
[CoreDNS site](https://coredns.io/2017/05/08/custom-dns-entries-for-kubernetes/).

{{% /capture %}}


