---
title: Install minikube
content_template: templates/task
weight: 20
card:
  name: tasks
  weight: 10
---

{{% capture overview %}}

This page shows you how to install [minikube](https://minikube.sigs.k8s.io/), a tool that runs a Kubernetes cluster on your personal computer.

{{% /capture %}}

{{% capture prerequisites %}}

To run minikube, you'll need:

* A host with administrator privileges (for example, ability to `sudo` or `Run as Administrator`)
* 2GiB of free memory
* 20GiB of free disk space
* Internet connection
* A compatible container or virtual machine manager, such as: [Docker](https://minikube.sigs.k8s.io/docs/docs/drivers/docker), [Hyperkit](https://minikube.sigs.k8s.io/docs/docs/drivers/hyperkit), [Hyper-V](https://minikube.sigs.k8s.io/docs/docs/drivers/hyperv), [KVM](https://minikube.sigs.k8s.io/docs/docs/drivers/kvm2), [Parallels](https://minikube.sigs.k8s.io/docs/docs/drivers/parallels), [Podman](https://minikube.sigs.k8s.io/docs/docs/drivers/podman), [VirtualBox](https://minikube.sigs.k8s.io/docs/docs/drivers/virtualbox), or [VMWare](https://minikube.sigs.k8s.io/docs/docs/drivers/vmware)

{{% /capture %}}

{{% capture steps %}}

## Installing minikube

{{< tabs name="tab_with_md" >}}
{{% tab name="Linux" %}}

For Linux users, there are 3 easy download options:

### Binary download

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

If the [Brew Package Manager](https://brew.sh/) is installed:

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

If the [Chocolatey](https://chocolatey.org/) package manager is installed, use it to install minikube:

```shell
choco install minikube
```

Otherwise, download and run the [Windows installer](https://storage.googleapis.com/minikube/releases/latest/minikube-installer.exe).

{{% /tab %}}
{{< /tabs >}}

{{% /capture %}}

{{% capture whatsnext %}}

* [Running Kubernetes Locally via Minikube](/docs/setup/learning-environment/minikube/)

{{% /capture %}}

## Starting your first cluster

Run:

```shell
minikube start
```

minikube will automatically select an appropriate container or hypervisor driver, but will mention alternatives it available. You may select an alternative driver by using the `--driver` flag. For more information, see the [minikube drivers documentation](https://minikube.sigs.k8s.io/docs/drivers/)

If you need help getting started, please see:

* [minikube documentation](https://minikube.sigs.k8s.io/docs)
* [#minikube chat on Slack](https://kubernetes.slack.com/archives/C1F5CT6Q1)
* [minikube issues on GitHub](https://github.com/kubernetes/minikube/issues)
