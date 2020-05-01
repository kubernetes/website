---
title: Install minikube
content_template: templates/task
weight: 20
card:
  name: tasks
  weight: 10
---

{{% capture overview %}}

This page shows you how to install [minikube](https://minikube.sigs.k8s.io/), a tool that runs a single-node Kubernetes cluster on your personal computer.

{{% /capture %}}

{{% capture prerequisites %}}

To run minikube, you'll need:

* 2GB of free memory
* 20GB of free disk space
* Internet connection
* A compatible container or virtual machine manager, such as: [Docker](https://minikube.sigs.k8s.io/docs/docs/drivers/docker), [Hyperkit](https://minikube.sigs.k8s.io/docs/docs/drivers/hyperkit), [Hyper-V](https://minikube.sigs.k8s.io/docs/docs/drivers/hyperv), [KVM](https://minikube.sigs.k8s.io/docs/docs/drivers/kvm2), [Parallels](https://minikube.sigs.k8s.io/docs/docs/drivers/parallels), [Podman](https://minikube.sigs.k8s.io/docs/docs/drivers/podman), [VirtualBox](https://minikube.sigs.k8s.io/docs/docs/drivers/virtualbox), or [VMWare](https://minikube.sigs.k8s.io/docs/docs/drivers/vmware)

{{% /capture %}}

{{% capture steps %}}

## Installing minikube

{{< tabs name="tab_with_md" >}}
{{% tab name="Linux" %}}

### Binary download

For Linux users, there are 3 easy download options:

```shell
 curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
 sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

### Debian package

```shell
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube_latest_amd64.deb
sudo dpkg -i minikube_latest_amd64.deb
```

### RPM package

```shell
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-latest.x86_64.rpm
sudo rpm -ivh minikube-latest.x86_64.rpm
```

{{% /tab %}}
{{% tab name="macOS" %}}

If the [Brew Package Manager](https://brew.sh/) installed:

```shell
brew install minikube
```

Otherwise, download minikube directly:

```shell
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-darwin-amd64
sudo install minikube-darwin-amd64 /usr/local/bin/minikube
```

{{% /tab %}}
{{% tab name="Windows" %}}

If the [Chocolatey Package Manager](https://chocolatey.org/) is installed, use it to install minikube:

```shell
choco install minikube
```

Otherwise, download and run the [Windows installer](https://storage.googleapis.com/minikube/releases/latest/minikube-installer.exe)

{{% /tab %}}
{{< /tabs >}}

{{% /capture %}}

{{% capture whatsnext %}}

* [Running Kubernetes Locally via Minikube](/docs/setup/learning-environment/minikube/)

{{% /capture %}}

## Starting your first cluster

From a terminal with administrator access (but not logged in as root), run:

```shell
minikube start
```

If minikube fails to start, see the [minikube drivers page](https://minikube.sigs.k8s.io/docs/docs/drivers) for help setting up a compatible container or virtual-machine manager.
