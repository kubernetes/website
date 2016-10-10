---
---

<style>
li>.highlighter-rouge {position:relative; top:3px;}
</style>

## Overview

This quickstart shows you how to easily install a secure Kubernetes cluster on machines running Ubuntu 16.04 or CentOS 7.
The installation uses a tool called `kubeadm` which is part of Kubernetes 1.4.

This process works with local VMs, physical servers and/or cloud servers.
It is simple enough that you can easily integrate its use into your own automation (Terraform, Chef, Puppet, etc).

**The `kubeadm` tool is currently in alpha but please try it out and give us [feedback](/docs/getting-started-guides/kubeadm/#feedback)!**

## Prerequisites

1. One or more machines running Ubuntu 16.04, CentOS 7 or HypriotOS
1. 1GB or more of RAM per machine (any less will leave little room for your apps)
1. Full network connectivity between all machines in the cluster (public or private network is fine)

## Objectives

* Install a secure Kubernetes cluster on your machines
* Install a pod network on the cluster so that application components (pods) can talk to each other
* Install a sample microservices application (a socks shop) on the cluster

## Instructions

### (1/4) Installing kubelet and kubeadm on your hosts

You will install the following packages on all the machines:

* `docker`: the container runtime, which Kubernetes depends on.
* `kubelet`: the most core component of Kubernetes.
  It runs on all of the machines in your cluster and does things like starting pods and containers.
* `kubectl`: the command to control the cluster once it's running.
  You will only need this on the master, but it can be useful to have on the other nodes as well.
* `kubeadm`: the command to bootstrap the cluster.

For each host in turn:

* SSH into the machine and become `root` if you are not already (for example, run `sudo su -`).
* If the machine is running Ubuntu 16.04 or HypriotOS, run:

      # curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
      # cat <<EOF > /etc/apt/sources.list.d/kubernetes.list
      deb http://apt.kubernetes.io/ kubernetes-xenial main
      EOF
      # apt-get update
      # # Install docker if you don't have it already. Version 1.11.2 is recommended, but 1.10.3 and 1.12.1 are known to work as well.
      # apt-get install -y docker.io
      # apt-get install -y kubelet kubeadm kubectl kubernetes-cni

   If the machine is running CentOS 7, run:

      # cat <<EOF > /etc/yum.repos.d/kubernetes.repo
      [kubernetes]
      name=Kubernetes
      baseurl=http://yum.kubernetes.io/repos/kubernetes-el7-x86_64
      enabled=1
      gpgcheck=1
      repo_gpgcheck=1
      gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg
             https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
      EOF
      # setenforce 0
      # yum install -y docker kubelet kubeadm kubectl kubernetes-cni
      # systemctl enable docker && systemctl start docker
      # systemctl enable kubelet && systemctl start kubelet

The kubelet is now restarting every few seconds, as it waits in a crashloop for `kubeadm` to tell it what to do.

Note: `setenforce 0` will no longer be necessary on CentOS once [#33555](https://github.com/kubernetes/kubernetes/pull/33555) is included in a released version of `kubeadm`.

### (2/4) Initializing your master

The master is the machine where the "control plane" components run, including `etcd` (the cluster database) and the API server (which the `kubectl` CLI communicates with).
All of these components run in pods started by `kubelet`.

Before you run this, make sure nothing is listening on `2379`, `2380`, `8080`, `443` or `10250` and kubelet and docker is running (check with `systemctl status kubelet`).
Also, check that `/etc/kubernetes`, `/var/etcd` and `/var/lib/kubelet` are empty directories or don't exist, otherwise `kubeadm init` may fail.

Right now you can't run `kubeadm init` twice without turning down the cluster in between, see [Turndown](#turndown).

If you are running this on HypriotOS (Raspberry Pi's), follow the slightly other [HypriotOS guide](#hypriotos-guide)

To initialize the master, pick one of the machines you previously installed `kubelet` and `kubeadm` on, and run:

     # kubeadm init

**Note:** this will autodetect the network interface to advertise the master on as the interface with the default gateway.
If you want to use a different interface, specify `--api-advertise-addresses=<ip-address>` argument to `kubeadm init`.

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

    kubeadm join --token <token> <master-ip>

Make a record of the `kubeadm join` command that `kubeadm init` outputs.
You will need this in a moment.
The key included here is secret, keep it safe &mdash; anyone with this key can add authenticated nodes to your cluster.

The key is used for mutual authentication between the master and the joining nodes.

By default, your cluster will not schedule pods on the master for security reasons.
If you want to be able to schedule pods on the master, for example if you want a single-machine Kubernetes cluster for development, run:

    # kubectl taint nodes --all dedicated-
    node "test-01" tainted
    taint key="dedicated" and effect="" not found.
    taint key="dedicated" and effect="" not found.

This will remove the "dedicated" taint from any nodes that have it, including the master node, meaning that the scheduler will then be able to schedule pods everywhere.

### (3/4) Installing a pod network

You must install a pod network add-on so that your pods can communicate with each other.
**It is necessary to do this before you try to deploy any applications to your cluster, and before `kube-dns` will start up.**

Several projects provide Kubernetes pod networks.
You can see a complete list of available network add-ons on the [add-ons page](/docs/admin/addons/).

By way of example, you can install [Weave Net](https://github.com/weaveworks/weave-kube) by logging in to the master and running:

    # kubectl apply -f https://git.io/weave-kube
    daemonset "weave-net" created

If you prefer [Calico](https://github.com/projectcalico/calico-containers/tree/master/docs/cni/kubernetes/manifests/kubeadm) or [Canal](https://github.com/tigera/canal/tree/master/k8s-install/kubeadm), please refer to their respective installation guides.
You can install _only one_ pod network per cluster.

Once a pod network has been installed, you can confirm that it is working by checking that the `kube-dns` pod is `Running` in the output of `kubectl get pods --all-namespaces`.

And once the `kube-dns` pod is up and running, you can continue by joining your nodes.

### (4/4) Joining your nodes

The nodes are where your workloads (containers and pods, etc) run.
If you want to add any new machines as nodes to your cluster, for each machine: SSH to that machine, become root (e.g. `sudo su -`) and run the command that was output by `kubeadm init`.
For example:

    # kubeadm join --token <token> <master-ip>
    <util/tokens> validating provided token
    <node/discovery> created cluster info discovery client, requesting info from "http://138.68.156.129:9898/cluster-info/v1/?token-id=0f8588"
    <node/discovery> cluster info object received, verifying signature using given token
    <node/discovery> cluster info signature and contents are valid, will use API endpoints [https://138.68.156.129:443]
    <node/csr> created API client to obtain unique certificate for this node, generating keys and certificate signing request
    <node/csr> received signed certificate from the API server, generating kubelet configuration
    <util/kubeconfig> created "/etc/kubernetes/kubelet.conf"

    Node join complete:
    * Certificate signing request sent to master and response
      received.
    * Kubelet informed of new secure connection details.

    Run 'kubectl get nodes' on the master to see this machine join.

A few seconds later, you should notice that running `kubectl get nodes` on the master shows a cluster with as many machines as you created.

### (Optional) Control your cluster from machines other than the master

In order to get a kubectl on your laptop for example to talk to your cluster, you need to copy the `KubeConfig` file from your master to your laptop like this:

    # scp root@<master ip>:/etc/kubernetes/admin.conf .
    # kubectl --kubeconfig ./admin.conf get nodes

### (Optional) Installing a sample application

As an example, install a sample microservices application, a socks shop, to put your cluster through its paces.
To learn more about the sample microservices app, see the [GitHub README](https://github.com/microservices-demo/microservices-demo).

    # git clone https://github.com/microservices-demo/microservices-demo
    # kubectl apply -f microservices-demo/deploy/kubernetes/manifests

You can then find out the port that the [NodePort feature of services](/docs/user-guide/services/) allocated for the front-end service by running:

    # kubectl describe svc front-end -n sock-shop
    Name:                   front-end
    Namespace:              sock-shop
    Labels:                 name=front-end
    Selector:               name=front-end
    Type:                   NodePort
    IP:                     100.66.88.176
    Port:                   <unset> 80/TCP
    NodePort:               <unset> 31869/TCP
    Endpoints:              <none>
    Session Affinity:       None

It takes several minutes to download and start all the containers, watch the output of `kubectl get pods -n sock-shop` to see when they're all up and running.

Then go to the IP address of your cluster's master node in your browser, and specify the given port.
So for example, `http://<master_ip>:<port>`.
In the example above, this was `31869`, but it is a different port for you.

If there is a firewall, make sure it exposes this port to the internet before you try to access it.

## HypriotOS guide

kubeadm will work fine on ARM, thanks to that sig-cluster-lifecycle has followed the [multi-platform proposal](https://github.com/kubernetes/kubernetes/blob/master/docs/proposals/multi-platform.md).

deb-packages are released for ARM and ARM 64-bit, but not RPMs (yet, reach out if there's interest).

Anyway, ARM had some issues when making v1.4, see [#32517](https://github.com/kubernetes/kubernetes/pull/32517) [#33485](https://github.com/kubernetes/kubernetes/pull/33485), [#33117](https://github.com/kubernetes/kubernetes/pull/33117) and [#33376](https://github.com/kubernetes/kubernetes/pull/33376). 

However, thanks to the PRs above, `kube-apiserver` works on ARM from the `v1.4.1` (`v1.4.1-beta.2` works as well) release, so make sure you're at least using `v1.4.1` when running on ARM 32-bit (this doesn't affect ARM 64-bit at all)

Also, a pod network for ARM is required, and flannel is currently the only one that's providing multi-arch binaries and images.
Therefore, when initializing the master, run this:

    # kubeadm init --use-kubernetes-version=v1.4.1 --pod-network-cidr=10.244.0.0/16

The `--pod-network-cidr` option is mandatory when using flannel as the pod network provider.

And when installing the flannel pod network, run this:
    # curl -sSL https://raw.githubusercontent.com/luxas/flannel/update-daemonset/Documentation/kube-flannel.yml | sed "s/amd64/arm/g" | kubectl create -f -

The above command will download the flannel pod network manifest, replace the `amd64` references with `arm` ones and create the pod network.

## Turndown

* To uninstall the socks shop, run `kubectl delete -f microservices-demo/deploy/kubernetes/manifests` on the master.

* To undo what `kubeadm` did, simply delete the machines you created for this tutorial, or run the script below and then uninstall the packages.
    systemctl stop kubelet;
    docker rm -f $(docker ps -q); mount | grep "/var/lib/kubelet/*" | awk '{print $3}' | xargs umount 1>/dev/null 2>/dev/null;
    rm -rf /var/lib/kubelet /etc/kubernetes /var/lib/etcd /etc/cni;
    ip link set cni0 down; ip link del cni0;
    systemctl start kubelet
    <!-- *syntax-highlighting-hack -->


## Explore other add-ons

See the [list of add-ons](/docs/admin/addons/) to explore other add-ons, including tools for logging, monitoring, network policy, visualization &amp; control of your Kubernetes cluster.

## What's next

* Learn more about [Kubernetes concepts and kubectl in Kubernetes 101](/docs/user-guide/walkthrough/).
* Install Kubernetes with [a cloud provider configurations](/docs/getting-started-guides/) to add Load Balancer and Persistent Volume support.

## Feedback

* Slack Channel: [#sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle/)
* Mailing List: [kubernetes-sig-cluster-lifecycle](https://groups.google.com/forum/#!forum/kubernetes-sig-cluster-lifecycle)
* [GitHub Issues](https://github.com/kubernetes/kubernetes/issues): please tag `kubeadm` issues with `@kubernetes/sig-cluster-lifecycle`

## Limitations

Please note: `kubeadm` is a work in progress and these limitations will be addressed in due course.

1. The cluster created here doesn't have cloud-provider integrations, so for example won't work with (for example) [Load Balancers](/docs/user-guide/load-balancer/) (LBs) or [Persistent Volumes](/docs/user-guide/persistent-volumes/walkthrough/) (PVs).
   To easily obtain a cluster which works with LBs and PVs Kubernetes, try [the "hello world" GKE tutorial](/docs/hellonode) or [one of the other cloud-specific installation tutorials](/docs/getting-started-guides/).

   Workaround: use the [NodePort feature of services](/docs/user-guide/services/#type-nodeport) for exposing applications to the internet.
1. The cluster created here has a single master, with a single `etcd` database running on it.
   This means that if the master fails, your cluster loses its configuration data and will need to be recreated from scratch.
   Adding HA support (multiple `etcd` servers, multiple API servers, etc) to `kubeadm` is still a work-in-progress.

   Workaround: regularly [back up etcd](https://coreos.com/etcd/docs/latest/admin_guide.html).
   The `etcd` data directory configured by `kubeadm` is at `/var/lib/etcd` on the master.
1. `kubectl logs` is broken with `kubeadm` clusters due to [#22770](https://github.com/kubernetes/kubernetes/issues/22770).

   Workaround: use `docker logs` on the nodes where the containers are running as a workaround.
