---
title: Kubernetes on Ubuntu
content_template: templates/concept
---

{{% capture overview %}}
There are multiple ways to run a Kubernetes cluster with Ubuntu on public and
private clouds, as well as bare metal.
{{% /capture %}}

{{% capture body %}}
## The Charmed Distribution of Kubernetes(CDK)

[CDK](https://www.ubuntu.com/cloud/kubernetes) is a distribution of Kubernetes
packaged as a bundle of *charms*  for Juju, the open source application modeller.

CDK is the latest version of Kubernetes with upstream binaries, packaged in a format
which makes it fast and easy to deploy. It supports various public
and private clouds including AWS, GCE, Azure, Joyent, OpenStack, VMware, Bare Metal
and localhost deployments.

See the [Official documentation](https://www.ubuntu.com/kubernetes/docs) for
more information.

## MicroK8s

[MicroK8s](https://microk8s.io) is a minimal install of Kubernetes designed to run locally.
It can be installed on Ubuntu (or any snap enabled operating system) with the command:

```shell
snap install microk8s --classic
```

Full documentation is available on the [MicroK8s website](https://microk8s.io/docs)






{{% /capture %}}
