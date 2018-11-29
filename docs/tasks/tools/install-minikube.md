---
title: Install Minikube
---

{% capture overview %}

This page shows how to install Minikube.

{% endcapture %}

{% capture prerequisites %}

VT-x or AMD-v virtualization must be enabled in your computer's BIOS.

{% endcapture %}

{% capture steps %}

## Install a Hypervisor

If you do not already have a hypervisor installed, install one now.

* For OS X, install
[VirtualBox](https://www.virtualbox.org/wiki/Downloads) or
[VMware Fusion](https://www.vmware.com/products/fusion), or
[HyperKit](https://github.com/moby/hyperkit).

* For Linux, install
[VirtualBox](https://www.virtualbox.org/wiki/Downloads) or
[KVM](http://www.linux-kvm.org/).

   **Note:** Minikube also supports a `--vm-driver=none` option that runs the Kubernetes components on the host and not in a VM.  Docker is required to use this driver but a hypervisor is not required.
  {: .note}

* For Windows, install
[VirtualBox](https://www.virtualbox.org/wiki/Downloads) or
[Hyper-V](https://msdn.microsoft.com/en-us/virtualization/hyperv_on_windows/quick_start/walkthrough_install).

## Install kubectl

* [Install kubectl](/docs/tasks/tools/install-kubectl/).

## Install Minikube

* Install Minikube according to the instructions for the
[latest release](https://github.com/kubernetes/minikube/releases).

{% endcapture %}

{% capture whatsnext %}

* [Running Kubernetes Locally via Minikube](/docs/getting-started-guides/minikube/)

{% endcapture %}

{% include templates/task.md %}
