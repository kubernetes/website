---
title: Installing kubeadm
---

{% capture overview %}

This page shows how to use install kubeadm.

{% endcapture %}

{% capture prerequisites %}

* One or more machines running Ubuntu 16.04+, CentOS 7 or HypriotOS v1.0.1+
* 1GB or more of RAM per machine (any less will leave little room for your apps)
* Full network connectivity between all machines in the cluster (public or private network is fine)

{% endcapture %}

{% capture steps %}

## Installing Docker

On each of your machines, install Docker.
Version 1.12 is recommended, but v1.10 and v1.11 are known to work as well.
Versions 1.13 and 17.03+ have not yet been tested and verified by the Kubernetes node team.
For installation instructions, see
[Install Docker](https://docs.docker.com/engine/installation/).

## Installing kubectl 

On each of your machines,
[install kubectl](/docs/tasks/tools/install-kubectl/).
You only need kubectl on the master, but it can be useful to have on the other
nodes as well.

## Installing kubelet and kubeadm

You will install these packages on all of your machines:

* `kubelet`: the most core component of Kubernetes. It runs on all of the
  machines in your cluster and does things like starting pods and containers.

* `kubeadm`: the command to bootstrap the cluster.

**Note:** If you already have kubeadm installed, you should do a `apt-get update &&
apt-get upgrade` or `yum update` to get the latest version of kubeadm. See the
kubeadm release notes if you want to read about the different [kubeadm
releases](https://github.com/kubernetes/kubeadm/blob/master/CHANGELOG.md)

For each machine:

* SSH into the machine and become root if you are not already (for example,
  run `sudo su -`).

* If the machine is running Ubuntu or HypriotOS, run:

  ``` bash
  apt-get update && apt-get install -y apt-transport-https
  curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
  cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
  deb http://apt.kubernetes.io/ kubernetes-xenial main
  EOF
  apt-get update
  # Install docker if you don't have it already.
  apt-get install -y docker-engine
  apt-get install -y kubelet kubeadm kubernetes-cni
  ```

* If the machine is running CentOS, run:

  ``` bash
  cat <<EOF > /etc/yum.repos.d/kubernetes.repo
  [kubernetes]
  name=Kubernetes
  baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
  enabled=1
  gpgcheck=1
  repo_gpgcheck=1
  gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg
          https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
  EOF
  setenforce 0
  yum install -y docker kubelet kubeadm kubernetes-cni
  systemctl enable docker && systemctl start docker
  systemctl enable kubelet && systemctl start kubelet
  ```

  The kubelet is now restarting every few seconds, as it waits in a crashloop for
  kubeadm to tell it what to do.

  Note: Disabling SELinux by running `setenforce 0` is required to allow
  containers to access the host filesystem, which is required by pod networks for
  example. You have to do this until SELinux support is improved in the kubelet.

While this guide is correct for kubeadm 1.6, the previous version is still
available but can be a bit tricky to install.  [See below](#old-kubeadm) for
details.

{% endcapture %}

{% capture whatsnext %}

* [Installing Kubernetes on Linux with kubeadm](/docs/getting-started-guides/kubeadm/)

{% endcapture %}

{% include templates/task.md %}
