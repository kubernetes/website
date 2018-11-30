---
title: Install Minikube
content_template: templates/task
weight: 20
---

{{% capture overview %}}

This page shows how to install Minikube.

{{< note >}}
The latest version of Minikube is [{{< minikube/latest >}}](https://github.com/kubernetes/minikube/releases/tag/v{{< minikube/latest >}}).
{{< /note >}}

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

{{< caution >}}
For more detailed instructions, see the [Minikube releases page](https://github.com/kubernetes/minikube/releases) on GitHub. The instructions on this page are intended for convenience.
{{< /caution >}}

### macOS

The easiest way to install Minikube on macOS is using [Homebrew](https://brew.sh):

```shell
brew cask install minikube
```

You can also install it by downloading a static binary:

```shell
curl -Lo minikube https://storage.googleapis.com/minikube/releases/v{{< minikube/latest >}}/minikube-darwin-amd64 \
  && chmod +x minikube \
  && sudo cp minikube /usr/local/bin/ \
  && rm minikube
```

You can leave off the `sudo cp minikube /usr/local/bin/ && rm minikube` if you'd like to add Minikube to your path manually.

### Linux

You can install Minikube on Linux by downloading a static binary:

```shell
curl -Lo minikube https://storage.googleapis.com/minikube/releases/v{{< minikube/latest >}}/minikube-linux-amd64 \
  && chmod +x minikube \
  && sudo cp minikube /usr/local/bin/ \
  && rm minikube
```

#### Debian .deb package (experimental)

To install Minikube as a Debian package:

```shell
wget https://github.com/kubernetes/minikube/releases/download/v{{< minikube/latest >}}/minikube_{{< minikube/latest >}}.deb
sudo dpkg -i minikube_{{< minikube/latest >}}.deb
```

### Windows (experimental)

Download the [`minikube-windows-amd64.exe`](https://github.com/kubernetes/minikube/releases/download/v{{< minikube/latest >}}/minikube-windows-amd64) file, rename it to `minikube.exe`, and add it to your path.

### Windows installer (experimental)

Download the [`minikube-installer.exe`](https://github.com/kubernetes/minikube/releases/download/v0.30.0/minikube-installer.exe) file and execute the installer. This will automatically add `minikube.exe` to your path along with an uninstaller.

{{% /capture %}}

{{% capture whatsnext %}}

* [Running Kubernetes Locally via Minikube](/docs/getting-started-guides/minikube/)

{{% /capture %}}


