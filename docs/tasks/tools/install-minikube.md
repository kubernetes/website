---
title: Installing Minikube
---

{% capture overview %}

This page shows how to use install Minikube.

{% endcapture %}

{% capture prerequisites %}

VT-x or AMD-v virtualization must be enabled in your computer's BIOS.

{% endcapture %}

{% capture steps %}

## Installation

* OS X
    * Install
    [xhyve driver](https://github.com/kubernetes/minikube/blob/master/DRIVERS.md#xhyve-driver),
    [VirtualBox](https://www.virtualbox.org/wiki/Downloads), or
    [VMware Fusion](https://www.vmware.com/products/fusion).

* Linux
    * Install
    [VirtualBox](https://www.virtualbox.org/wiki/Downloads) or
    [KVM](http://www.linux-kvm.org/).

* Windows
    * Install
    [VirtualBox](https://www.virtualbox.org/wiki/Downloads) or
    [Hyper-V](https://msdn.microsoft.com/en-us/virtualization/hyperv_on_windows/quick_start/walkthrough_install).

* [Install kubectl] (/docs/tasks/tools/install-kubectl/).

* Install Minikube according to the instructions for the
[latest release](https://github.com/kubernetes/minikube/releases).

{% endcapture %}

{% capture whatsnext %}

* [Running Kubernetes Locally via Minikube](/docs/getting-started-guides/minikube/)

{% endcapture %}

{% include templates/task.md %}
