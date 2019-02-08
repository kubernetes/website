---
title: Install Minikube
content_template: templates/task
weight: 20
---

{{% capture overview %}}

This page shows you how to install [Minikube](/docs/tutorials/hello-minikube), a tool that runs a single-node Kubernetes cluster in a virtual machine on your laptop.

{{% /capture %}}

{{% capture prerequisites %}}

VT-x or AMD-v virtualization must be enabled in your computer's BIOS.  To check this on Linux run the following and verify the output is non-empty:
```shell
egrep --color 'vmx|svm' /proc/cpuinfo
```

{{% /capture %}}

{{% capture steps %}}

## Install a Hypervisor

If you do not already have a hypervisor installed, install one for your OS now:

Operating system | Supported hypervisors
:----------------|:---------------------
macOS | [VirtualBox](https://www.virtualbox.org/wiki/Downloads), [VMware Fusion](https://www.vmware.com/products/fusion), [HyperKit](https://github.com/moby/hyperkit)
Linux | [VirtualBox](https://www.virtualbox.org/wiki/Downloads), [KVM](http://www.linux-kvm.org/)
Windows | [VirtualBox](https://www.virtualbox.org/wiki/Downloads), [Hyper-V](https://msdn.microsoft.com/en-us/virtualization/hyperv_on_windows/quick_start/walkthrough_install)

{{< note >}}
Minikube also supports a `--vm-driver=none` option that runs the Kubernetes components on the host and not in a VM. Using this driver requires Docker and a Linux environment but not a hypervisor.
{{< /note >}}

## Install kubectl

* Install kubectl according to the instructions in [Install and Set Up kubectl](/docs/tasks/tools/install-kubectl/).

## Install Minikube

### macOS

The easiest way to install Minikube on macOS is using [Homebrew](https://brew.sh):

```shell
brew cask install minikube
```

You can also install it on macOS by downloading a static binary:

```shell
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-darwin-amd64 \
  && chmod +x minikube
```

Here's an easy way to add the Minikube executable to your path:

```shell
sudo cp minikube /usr/local/bin && rm minikube
```

### Linux

{{< note >}}
This document shows you how to install Minikube on Linux using a static binary. For alternative Linux installation methods, see [Other Ways to Install](https://github.com/kubernetes/minikube#other-ways-to-install) in the official Minikube GitHub repository.
{{< /note >}}

You can install Minikube on Linux by downloading a static binary:

```shell
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 \
  && chmod +x minikube
```

Here's an easy way to add the Minikube executable to your path:

```shell
sudo cp minikube /usr/local/bin && rm minikube
```

### Windows

{{< note >}}
To run Minikube on Windows, you need to install [Hyper-V](https://docs.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v) first, which can be run on three versions of Windows 10: Windows 10 Enterprise, Windows 10 Professional, and Windows 10 Education.
{{< /note >}}

The easiest way to install Minikube on Windows is using [Chocolatey](https://chocolatey.org/) (run as an administrator):

```shell
choco install minikube kubernetes-cli
```

After Minikube has finished installing, close the current CLI session and restart. Minikube should have been added to your path automatically.

#### Windows manual installation

To install Minikube manually on Windows, download [`minikube-windows-amd64`](https://github.com/kubernetes/minikube/releases/latest), rename it to `minikube.exe`, and add it to your path.

#### Windows Installer

To install Minikube manually on windows using [Windows Installer](https://docs.microsoft.com/en-us/windows/desktop/msi/windows-installer-portal), download [`minikube-installer.exe`](https://github.com/kubernetes/minikube/releases/latest) and execute the installer.

{{% /capture %}}

{{% capture whatsnext %}}

* [Running Kubernetes Locally via Minikube](/docs/setup/minikube/)

{{% /capture %}}


