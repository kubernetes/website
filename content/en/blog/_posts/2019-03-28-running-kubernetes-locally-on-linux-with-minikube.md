---                                           
title: 'Running Kubernetes locally on Linux with Minikube - now with Kubernetes 1.14 support'                                                           
date: 2019-03-28                                  
---
**Author**: [Ihor Dvoretskyi](https://twitter.com/idvoretskyi), Developer Advocate, Cloud Native Computing Foundation

<center>{{<figure width="600" src="/images/blog/2019-03-28-running-kubernetes-locally-on-linux-with-minikube/ihor-dvoretskyi-1470985-unsplash.jpg">}}</center>

*A few days ago, the Kubernetes community announced [Kubernetes 1.14](https://kubernetes.io/blog/2019/03/25/kubernetes-1-14-release-announcement/), the most recent version of Kubernetes. Alongside it, Minikube, a part of the Kubernetes project, recently hit the [1.0 milestone](https://github.com/kubernetes/minikube/releases/tag/v1.0.0), which supports [Kubernetes 1.14](https://kubernetes.io/blog/2019/03/25/kubernetes-1-14-release-announcement/) by default.*

Kubernetes is a real winner (and a de facto standard) in the world of distributed Cloud Native computing. While it can handle up to [5000 nodes](https://kubernetes.io/blog/2017/03/scalability-updates-in-kubernetes-1.6) in a single cluster, local deployment on a single machine (e.g. a laptop, a developer workstation, etc.) is an increasingly common scenario for using Kubernetes.

A few weeks ago I ran a poll on Twitter asking the community to specify their preferred option for running Kubernetes locally on Linux:

<center><blockquote class="twitter-tweet"><p lang="en" dir="ltr">Ok, Twitter ✋<br><br>Your local Kubernetes cluster on Linux is deployed by:</p>&mdash; ihor dvoretskyi (@idvoretskyi) <a href="https://twitter.com/idvoretskyi/status/1093154369040773120?ref_src=twsrc%5Etfw">February 6, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></center>

This is post #1 in a series about the local deployment options on Linux, and it will cover Minikube, the most popular community-built solution for running Kubernetes on a local machine.

[Minikube](https://github.com/kubernetes/minikube) is a cross-platform, community-driven [Kubernetes](https://kubernetes.io/) distribution, which is targeted to be used primarily in local environments. It deploys a single-node cluster, which is an excellent option for having a simple Kubernetes cluster up and running on localhost.

Minikube is designed to be used as a virtual machine (VM), and the default VM runtime is [VirtualBox](https://www.virtualbox.org/). At the same time, extensibility is one of the critical benefits of Minikube, so it's possible to use it with [drivers](https://github.com/kubernetes/minikube/blob/master/docs/drivers.md) outside of VirtualBox.

By default, Minikube uses Virtualbox as a runtime for running the virtual machine. Virtualbox is a cross-platform solution, which can be used on a variety of operating systems, including GNU/Linux, Windows, and macOS.

At the same time, QEMU/KVM is a Linux-native virtualization solution, which may offer benefits compared to Virtualbox. For example, it's much easier to use KVM on a GNU/Linux server, so you can run a single-node Minikube cluster not only on a Linux workstation or laptop with GUI, but also on a remote headless server.

Unfortunately, Virtualbox and KVM can't be used simultaneously, so if you are already running KVM workloads on a machine and want to run Minikube there as well, using the KVM minikube driver is the preferred way to go.

In this guide, we'll focus on running Minikube with the KVM driver on Ubuntu 18.04 (I am using a bare metal machine running on [packet.com](https://www.packet.com).)

<center>{{<figure width="600" src="/images/blog/2019-03-28-running-kubernetes-locally-on-linux-with-minikube/module_01_cluster.png" caption="Minikube architecture (source: kubernetes.io)">}}</center>

## Disclaimer

This is not an official guide to Minikube. You may find detailed information on running and using Minikube on it's official [webpage](https://github.com/kubernetes/minikube), where different use cases, operating systems, environments, etc. are covered. Instead, the purpose of this guide is to provide clear and easy guidelines for running Minikube with KVM on Linux.

## Prerequisites

-	Any Linux you like (in this tutorial we'll use Ubuntu 18.04 LTS, and all the instructions below are applicable to it. If you prefer using a different Linux distribution, please check out the relevant documentation)
-	`libvirt` and QEMU-KVM installed and properly configured
-	The Kubernetes CLI (`kubectl`) for operating the Kubernetes cluster

### QEMU/KVM and libvirt installation

*NOTE: skip if already installed*

Before we proceed, we have to verify if our host can run KVM-based virtual machines. This can be easily checked using the [kvm-ok](https://manpages.ubuntu.com/manpages/bionic/man1/kvm-ok.1.html) tool, available on Ubuntu.

```shell
sudo apt install cpu-checker && sudo kvm-ok
```
If you receive the following output after running `kvm-ok`, you can use KVM on your machine (otherwise, please check out your configuration):

```shell
$ sudo kvm-ok
INFO: /dev/kvm exists
KVM acceleration can be used
```

Now let's install KVM and libvirt and add our current user to the `libvirt` group to grant sufficient permissions:

```shell
sudo apt install libvirt-clients libvirt-daemon-system qemu-kvm \
    && sudo usermod -a -G libvirt $(whoami) \
    && newgrp libvirt
```

After installing libvirt, you may verify the host validity to run the virtual machines with `virt-host-validate` tool, which is a part of libvirt.

```shell
sudo virt-host-validate
```

### kubectl (Kubernetes CLI) installation

*NOTE: skip if already installed*

In order to manage the Kubernetes cluster, we need to install [kubectl](https://kubernetes.io/docs/reference/kubectl/overview/), the Kubernetes CLI tool.

The recommended way to install it on Linux is to download the pre-built binary and move it to a directory under the `$PATH`.

```shell
curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl \
    && sudo install kubectl /usr/local/bin && rm kubectl
```

Alternatively, kubectl can be installed with a big variety of different methods (eg. as a .deb or snap package - check out the [kubectl documentation](https://kubernetes.io/docs/tasks/tools/install-kubectl/) to find the best one for you).

## Minikube installation


### Minikube KVM driver installation

A VM driver is an essential requirement for local deployment of Minikube. As we've chosen to use KVM as the Minikube driver in this tutorial, let's install the KVM driver with the following command:

```shell
curl -LO https://storage.googleapis.com/minikube/releases/latest/docker-machine-driver-kvm2 \
    && sudo install docker-machine-driver-kvm2 /usr/local/bin/ && rm docker-machine-driver-kvm2
```

### Minikube installation

Now let's install Minikube itself:

```shell
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 \
    && sudo install minikube-linux-amd64 /usr/local/bin/minikube && rm minikube-linux-amd64
```

### Verify the Minikube installation

Before we proceed, we need to verify that Minikube is correctly installed. The simplest way to do this is to check Minikube’s status.

```shell
minikube version
```

### To use the KVM2 driver:

Now let's run the local Kubernetes cluster with Minikube and KVM:

```shell
minikube start --vm-driver kvm2
```

### Set KVM2 as a default VM driver for Minikube

If KVM is used as the single driver for Minikube on our machine, it's more convenient to set it as a default driver and run Minikube with fewer command-line arguments. The following command sets the KVM driver as the default:

```shell
minikube config set vm-driver kvm2
```

So now let's run Minikube as usual:

```shell
minikube start
```

## Verify the Kubernetes installation

Let's check if the Kubernetes cluster is up and running:

```shell
kubectl get nodes
```

Now let's run a simple sample app (nginx in our case):

```shell
kubectl create deployment nginx --image=nginx
```

Let’s also check that the Kubernetes pods are correctly provisioned:

```shell
kubectl get pods
```

## Screencast 

<center>[![asciicast](https://asciinema.org/a/237106.svg)](https://asciinema.org/a/237106)</center>

## Next steps

At this point, a Kubernetes cluster with Minikube and KVM is adequately set up and configured on your local machine.

To proceed, you may check out the Kubernetes tutorials on the project website:

-	[Hello Minikube](https://kubernetes.io/docs/tutorials/hello-minikube/)

It’s also worth checking out the "Introduction to Kubernetes" course by The Linux Foundation/Cloud Native Computing Foundation, available for free on EDX:

-	[Introduction to Kubernetes](https://www.edx.org/course/introduction-to-kubernetes#)
