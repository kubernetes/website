---
title: Install Minikube
content_template: templates/task
weight: 20
---

{{% capture overview %}}

This page shows how to install Minikube.

{{% /capture %}}

{{% capture prerequisites %}}

VT-x or AMD-v virtualization must be enabled in your computer's BIOS.

{{% /capture %}}

{{% capture steps %}}

## Install a Hypervisor

If you do not already have a hypervisor installed, install the appropriate one for your OS now:

* macOS: [VirtualBox](https://www.virtualbox.org/wiki/Downloads) or
[VMware Fusion](https://www.vmware.com/products/fusion), or
[HyperKit](https://github.com/moby/hyperkit).

* Linux: [VirtualBox](https://www.virtualbox.org/wiki/Downloads) or
[KVM](http://www.linux-kvm.org/).

  {{< note >}}
  Minikube also supports a `-\-vm-driver=none` option that runs the Kubernetes components on the host and not in a VM.  Using this driver requires Docker and a linux environment, but not a hypervisor.
  {{< /note >}}

* Windows: [VirtualBox](https://www.virtualbox.org/wiki/Downloads) or
[Hyper-V](https://msdn.microsoft.com/en-us/virtualization/hyperv_on_windows/quick_start/walkthrough_install).

## Install kubectl

* Install kubectl according to the instructions in [Install and Set Up kubectl](/docs/tasks/tools/install-kubectl/).

## Install Minikube

* Install Minikube according to the instructions for the [latest release](https://github.com/kubernetes/minikube/releases).

{{% /capture %}}

{{% capture whatsnext %}}

* [Running Kubernetes Locally via Minikube](/docs/getting-started-guides/minikube/)

{{% /capture %}}


