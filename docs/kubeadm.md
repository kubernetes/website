---
---

<style>
li>.highlighter-rouge {position:relative; top:3px;}
</style>

## Overview

This quickstart will show you how to easily install a secure Kubernetes cluster on any machines running Linux, using a tool called `kubeadm` which is part of Kubernetes.

This process should work with local VMs, physical servers and/or cloud servers.
It is intended to be simple enough that you can easily integrate its use into your own automation (Terraform, Chef, Puppet, etc).

**The `kubeadm` tool is currently in alpha but please try it out and give us feedback!**

### tl;dr &mdash; the really short version

You will:

1. Install packages on all machines
1. Run `kubeadm init` on the machine you want to become a master
1. Run `kubeadm join` on the machines you want to become nodes

You will then be able to install a pod network with `kubectl apply`.

That's all you will need to bootstrap a secure cluster!

## Prerequisites

1. One or more machines running Ubuntu 16.04 or Fedora 24
1. 2GB or more of RAM per machine
1. A network connection between the machines with all ports open

## Objectives

1. Install a secure Kubernetes cluster on your machines
1. Install a pod network on the cluster so that application components (pods) can talk to eachother
1. Install a sample microservices application (a socks shop) on the cluster

## Installing Kubernetes

### Installing kubelet and kubeadm on your hosts

You will now install the following packages on all the machines:

* `docker`: the container runtime, which Kubernetes depends on.
* `kubelet`: the most core component of Kubernetes.
  It runs on all of the machines in your cluster and does things like starting containers.
* `kubectl`: the command to control the cluster once it's running.
  You will only use this on the master.
* `kubeadm`: the command to bootstrap the cluster.

For each host in turn:

<!--
    # curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
    # cat <<EOF > /etc/apt/sources.list.d/kubernetes.list
    deb http://packages.cloud.google.com/apt kubernetes-xenial-unstable main
    EOF
    # apt-get update
    # apt-get install -y kubelet-kubeadm kubectl
-->


* SSH into the machine and become `root` if you are not already (for example, run `sudo su -`).
* If the machine is running Ubuntu 16.04, run:

      # curl -sSL https://get.docker.com/ | sh
      # # TODO better to set up the apt repo and then let the dependencies on the kubelet deb pull down the right version
      # apt-get install -y socat
      # curl -s -L \
        "https://www.dropbox.com/s/shhs46bzhex7dxo/debs-9b4337.txz?dl=1" | tar xJv
      # dpkg -i debian/bin/*.deb
      # # XXX https://github.com/kubernetes/release/issues/98
      # systemctl daemon-reload && systemctl restart kubelet

   If the machine is running Fedora 24, CentOS 7 or RHEL 7, run:

      # # TODO 'curl -sSL https://get.docker.com/ | sh' as soon as @dgoodwin's packages refer to the new name
      # cat <<EOF > /etc/yum.repos.d/k8s.repo
      [kubelet]
      name=kubelet
      baseurl=http://files.rm-rf.ca/rpms/kubelet/
      enabled=1
      gpgcheck=0
      EOF
      # yum install kubelet kubeadm kubectl kubernetes-cni
      # systemctl enable docker && systemctl start docker
      # systemctl enable kubelet && systemctl start kubelet

The kubelet will now be restarting every few seconds, as it waits in a crashloop for `kubeadm` to tell it what to do.

Optionally, see also [more details on installing Docker](https://docs.docker.com/engine/installation/#/on-linux).

### Initializing your master

The master is the machine where the "control plane" components run, including `etcd` (the cluster database) and the API server (which the `kubectl` CLI communicates with).
All of these components will run in containers started by `kubelet`.

To initialize the master, pick one of the machines you previously installed `kubelet` and `kubeadm` on, and run:

* If you want to be able to schedule workloads on the master, for example if you want a single-machine Kubernetes cluster for development, run:

      # kubeadm init --schedule-workload

* If you do not want to be able to schedule workloads on the master (perhaps for security reasons), run:

      # kubeadm init

This will download and install the cluster database and "control plane" components.
This may take several minutes.

The output should look like:

    <master/tokens> generated token: "f0c861.753c505740ecde4c"
    <master/pki> created keys and certificates in "/etc/kubernetes/pki"
    <util/kubeconfig> created "/etc/kubernetes/kubelet.conf"
    <util/kubeconfig> created "/etc/kubernetes/admin.conf"
    <master/apiclient> created API client configuration
    <master/apiclient> created API client, waiting for the control plane to become ready
    <master/apiclient> all control plane components are healthy after 61.346626 seconds
    <master/apiclient> waiting for at least one node to register and become ready
    <master/apiclient> first node is ready after 4.506807 seconds
    <master/discovery> created essential addon: kube-discovery
    <master/addons> created essential addon: kube-proxy
    <master/addons> created essential addon: kube-dns

    Kubernetes master initialised successfully!

    You can connect any number of nodes by running:

    kubeadm join --token f0c861.753c505740ecde4c 138.68.135.192

Make a record of the `kubeadm join` command that `kubeadm init` outputs.
You will need this in a moment.
The key included here is secret, keep it safe &mdash; anyone with this key will be able to add authenticated nodes to your cluster.

The key is used for mutual authentication between the master and the joining nodes.

### Joining your nodes

The nodes are where your containers (your workload) will run.
To add a new machine as a node to your cluster, SSH to that machine, become root (e.g. `sudo su -`) and run the command that was output by `kubeadm init`.
For example:

    # kubeadm join --token f0c861.753c505740ecde4c 138.68.135.192

A few seconds later, you should notice that running `kubectl get nodes` on the master shows a cluster with as many machines as you created.
Your cluster is now bootstrapped!

But before you can deploy applications to it, you need to install a pod network.

### Installing a pod network

You must install a pod network add-on so that your pods can communicate with eachother on different hosts.

Several projects provide Kubernetes pod networks.
A simple one with no infrastructure or database dependencies is Weave Net, which you can install by running, on the master:

    # kubectl apply -f https://git.io/weave-kube

You can learn more about Weave for Kubernetes on the project's [GitHub page](https://github.com/weaveworks/weave-kube).

You can see a complete list of available network add-ons on the [add-ons page](/docs/admin/addons/).

### Installing a sample application

As an example, you will now install a sample microservices application, a socks shop, to put your cluster through its paces.
To learn more about the sample microservices app, see the [GitHub README](https://github.com/microservices-demo/microservices-demo).

Here you will install the NodePort version of the Socks Shop, which doesn't depend on Load Balancer integration, since our cluster doesn't have that:

    # kubectl apply -f https://raw.githubusercontent.com/lukemarsden/microservices-demo/master/deploy/kubernetes/definitions/wholeWeaveDemo-NodePort.yaml

You can then find out the port that the [NodePort feature of services](/docs/user-guide/services/) allocated for the front-end service by running:

    # kubectl describe svc front-end
    ... XXX ...

Then go to the IP address of your cluster's master node in your browser, and specify the given port.
So for example, `http://<master_ip>:<port>`.

If there is a firewall, make sure it exposes the port to the internet before you try to access it.

### Explore other add-ons

See the [list of add-ons](/docs/admin/addons/) to explore other add-ons, including tools for logging, monitoring, network policy, visualization &amp; control of your Kubernetes cluster.


## What's next

* Learn more about [Kubernetes concepts and kubectl in Kubernetes 101](/docs/user-guide/walkthrough/).
* Install Kubernetes with [a cloud provider configurations](/docs/getting-started-guides/) to add Load Balancer and Persistent Volume support.


## Cleanup

* To uninstall the socks shop, run `kubectl delete -f https://raw.githubusercontent.com/lukemarsden/microservices-demo/master/deploy/kubernetes/definitions/wholeWeaveDemo-NodePort.yaml`.
* To uninstall Kubernetes, simply delete the machines you created for this tutorial.
  Or alternatively, uninstall the `kubelet`, `kubeadm` and `kubectl` packages and then manually delete all the Docker container that were created by this process.

## How to provide feedback

* Slack Channel: [#sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle/)
* Mailing List: [kubernetes-sig-cluster-lifecycle](https://groups.google.com/forum/#!forum/kubernetes-sig-cluster-lifecycle)
* [GitHub Issues](https://github.com/kubernetes/kubernetes/issues): please tag `kubeadm` issues with `@kubernetes/sig-cluster-lifecycle`

## Limitations

1. The cluster we create here won't have cloud-provider integrations, so for example won't work with (for example) [Load Balancers](/docs/user-guide/load-balancer/) (LBs) or [Persistent Volumes](/docs/user-guide/persistent-volumes/walkthrough/) (PVs).
   
   Instead we will use the [NodePort feature of services](/docs/user-guide/services/) to demonstrate exposing the sample application on the internet.
   To easily obtain a cluster which works with LBs and PVs Kubernetes, try [the "hello world" GKE tutorial](/docs/hellonode) or [one of the other cloud-specific installation tutorials](/docs/getting-started-guides/).
1. The cluster we create here will have a single master, with a single `etcd` database running on it.
   Adding HA support (multiple `etcd` servers, multiple API servers, etc) is still a work-in-progress.
