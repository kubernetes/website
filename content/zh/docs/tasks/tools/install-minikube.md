---
title: Install Minikube
content_template: templates/task
weight: 20
---

<!--
---
title: Install Minikube
content_template: templates/task
weight: 20
---
-->

{{% capture overview %}}

本页面讲述如何安装 Minikube。
<!--
This page shows how to install Minikube.
-->

{{% /capture %}}

{{% capture prerequisites %}}

您的计算机必须在 BIOS 中启用 VT-x 或 AMD-v 虚拟化。
<!--
VT-x or AMD-v virtualization must be enabled in your computer's BIOS.
-->

{{% /capture %}}

{{% capture steps %}}

## 安装 Hypervisor
<!--
## Install a Hypervisor
-->

如果还没有装过 hypervisor，以下是一些不错的选择：
<!--
If you do not already have a hypervisor installed, install the appropriate one for your OS now:
-->
<!--
* macOS: [VirtualBox](https://www.virtualbox.org/wiki/Downloads) or [VMware Fusion](https://www.vmware.com/products/fusion), or [HyperKit](https://github.com/moby/hyperkit).
-->
<!--
* Linux: [VirtualBox](https://www.virtualbox.org/wiki/Downloads) or [KVM](http://www.linux-kvm.org/).
-->

* macOS：[VirtualBox](https://www.virtualbox.org/wiki/Downloads) 或者
[VMware Fusion](https://www.vmware.com/products/fusion)，或者
[HyperKit](https://github.com/moby/hyperkit)。
* Linux：[VirtualBox](https://www.virtualbox.org/wiki/Downloads) 或者
[KVM](http://www.linux-kvm.org/)。


  {{< note >}}

  Minikube 也支持 `-\-vm-driver=none` 选项，该选项在主机而非 VM 上运行 Kubernetes 组件。
  使用这个驱动程序需要 Docker 和 linux 环境，而不需要 hypervisor。

  <!--
  Minikube also supports a `-\-vm-driver=none` option that runs the Kubernetes components on the host and not in a VM.  Using this driver requires Docker and a linux environment, but not a hypervisor.
  -->
  <!--
* Windows: [VirtualBox](https://www.virtualbox.org/wiki/Downloads) or
[Hyper-V](https://msdn.microsoft.com/en-us/virtualization/hyperv_on_windows/quick_start/walkthrough_install).
-->

  {{< /note >}}

* Windows：[VirtualBox](https://www.virtualbox.org/wiki/Downloads) 或者
[Hyper-V](https://msdn.microsoft.com/en-us/virtualization/hyperv_on_windows/quick_start/walkthrough_install)。

## 安装 kubectl

<!--
* Install kubectl according to the instructions in [Install and Set Up kubectl](/docs/tasks/tools/install-kubectl/).
-->
<!--
## Install kubectl
-->

* 请参照 [安装与设置 kubectl](/docs/tasks/tools/install-kubectl/) 中的说明安装 kubectl。

## 安装 Minikube

<!--
## Install Minikube
-->
<!--
* Install Minikube according to the instructions for the [latest release](https://github.com/kubernetes/minikube/releases).
-->

* 请参照[最新发行](https://github.com/kubernetes/minikube/releases)指导安装 Minikube。



{{% /capture %}}

{{% capture whatsnext %}}

* [使用 Minikube 在本地运行 Kubernetes](/docs/getting-started-guides/minikube/)

<!--
* [Running Kubernetes Locally via Minikube](/docs/getting-started-guides/minikube/)
-->

{{% /capture %}}
