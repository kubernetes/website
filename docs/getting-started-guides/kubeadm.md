---
assignees:
- mikedanese
- luxas
- errordeveloper
- jbeda
title: Installing Kubernetes on Linux with kubeadm
---

<style>
li>.highlighter-rouge {position:relative; top:3px;}
</style>

## Overview

This quickstart shows you how to easily install a secure Kubernetes cluster on machines running Ubuntu 16.04, CentOS 7 or HypriotOS v1.0.1+.
The installation uses a tool called `kubeadm` which is part of Kubernetes.

This process works with local VMs, physical servers and/or cloud servers.
It is simple enough that you can easily integrate its use into your own automation (Terraform, Chef, Puppet, etc).

See the full `kubeadm` [reference](/docs/admin/kubeadm) for information on all `kubeadm` command-line flags and for advice on automating `kubeadm` itself.

**The `kubeadm` tool is currently in alpha but please try it out and give us [feedback](/docs/getting-started-guides/kubeadm/#feedback)!
Be sure to read the [limitations](#limitations); in particular note that kubeadm doesn't have great support for
automatically configuring cloud providers. Please refer to the specific cloud provider documentation or
use another provisioning system.**

kubeadm assumes you have a set of machines (virtual or real) that are up and running.  It is designed
to be part of a large provisioning system - or just for easy manual provisioning.  kubeadm is a great
choice where you have your own infrastructure (e.g. bare metal), or where you have an existing
orchestration system (e.g. Puppet) that you have to integrate with.

If you are not constrained, there are some other tools built to give you complete clusters:

* On GCE, [Google Container Engine](https://cloud.google.com/container-engine/) gives you one-click Kubernetes clusters
* On AWS, [kops](https://github.com/kubernetes/kops) makes cluster installation and management easy (and supports high availability)

## Prerequisites

1. One or more machines running Ubuntu 16.04+, CentOS 7 or HypriotOS v1.0.1+
1. 1GB or more of RAM per machine (any less will leave little room for your apps)
1. Full network connectivity between all machines in the cluster (public or private network is fine)

## Objectives

* Install a secure Kubernetes cluster on your machines
* Install a pod network on the cluster so that application components (pods) can talk to each other
* Install a sample microservices application (a socks shop) on the cluster

## Instructions

### (1/4) Installing kubelet and kubeadm on your hosts

You will install the following packages on all the machines:

* `docker`: the container runtime, which Kubernetes depends on. v1.11.2 is recommended, but v1.10.3 and v1.12.1 are known to work as well.
* `kubelet`: the most core component of Kubernetes.
  It runs on all of the machines in your cluster and does things like starting pods and containers.
* `kubectl`: the command to control the cluster once it's running.
  You will only need this on the master, but it can be useful to have on the other nodes as well.
* `kubeadm`: the command to bootstrap the cluster.

NOTE: If you already have kubeadm installed, you should do a `apt-get update && apt-get upgrade` or `yum update` to get the latest version of kubeadm.
See the reference doc if you want to read about the different [kubeadm releases](https://github.com/kubernetes/kubeadm/blob/master/CHANGELOG.md)

For each host in turn:

* SSH into the machine and become `root` if you are not already (for example, run `sudo su -`).
* If the machine is running Ubuntu or HypriotOS, run:

      curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
      cat <<EOF > /etc/apt/sources.list.d/kubernetes.list
      deb http://apt.kubernetes.io/ kubernetes-xenial main
      EOF
      apt-get update
      # Install docker if you don't have it already.
      apt-get install -y docker.io
      apt-get install -y kubelet kubeadm kubectl kubernetes-cni

   If the machine is running CentOS, run:

      cat <<EOF > /etc/yum.repos.d/kubernetes.repo
      [kubernetes]
      name=Kubernetes
      baseurl=http://yum.kubernetes.io/repos/kubernetes-el7-x86_64
      enabled=1
      gpgcheck=1
      repo_gpgcheck=1
      gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg
             https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
      EOF
      setenforce 0
      yum install -y docker kubelet kubeadm kubectl kubernetes-cni
      systemctl enable docker && systemctl start docker
      systemctl enable kubelet && systemctl start kubelet

The kubelet is now restarting every few seconds, as it waits in a crashloop for `kubeadm` to tell it what to do.

Note: Disabling SELinux by running `setenforce 0` is required in order to allow containers to access the host filesystem, which is required by pod networks for example. You have to do this until kubelet can handle SELinux better.

### (2/4) Initializing your master

The master is the machine where the "control plane" components run, including `etcd` (the cluster database) and the API server (which the `kubectl` CLI communicates with).
All of these components run in pods started by `kubelet`.

Right now you can't run `kubeadm init` twice without tearing down the cluster in between, see [Tear down](#tear-down).

If you try to run `kubeadm init` and your machine is in a state that is incompatible with starting a Kubernetes cluster, `kubeadm` will warn you about things that might not work or it will error out for unsatisfied mandatory requirements.

To initialize the master, pick one of the machines you previously installed `kubelet` and `kubeadm` on, and run:

     # kubeadm init

**Note:** this will autodetect the network interface to advertise the master on as the interface with the default gateway.
If you want to use a different interface, specify `--api-advertise-addresses=<ip-address>` argument to `kubeadm init`.

If you want to use [flannel](https://github.com/coreos/flannel) as the pod network, specify `--pod-network-cidr=10.244.0.0/16` if you're using the daemonset manifest below. _However, please note that this is not required for any other networks besides Flannel._

Please refer to the [kubeadm reference doc](/docs/admin/kubeadm/) if you want to read more about the flags `kubeadm init` provides.

This will download and install the cluster database and "control plane" components.
This may take several minutes.

The output should look like:

    [kubeadm] WARNING: kubeadm is in alpha, please do not use it for production clusters.
    [preflight] Running pre-flight checks
    [init] Using Kubernetes version: v1.5.1
    [tokens] Generated token: "064158.548b9ddb1d3fad3e"
    [certificates] Generated Certificate Authority key and certificate.
    [certificates] Generated API Server key and certificate
    [certificates] Generated Service Account signing keys
    [certificates] Created keys and certificates in "/etc/kubernetes/pki"
    [kubeconfig] Wrote KubeConfig file to disk: "/etc/kubernetes/kubelet.conf"
    [kubeconfig] Wrote KubeConfig file to disk: "/etc/kubernetes/admin.conf"
    [apiclient] Created API client, waiting for the control plane to become ready
    [apiclient] All control plane components are healthy after 61.317580 seconds
    [apiclient] Waiting for at least one node to register and become ready
    [apiclient] First node is ready after 6.556101 seconds
    [apiclient] Creating a test deployment
    [apiclient] Test deployment succeeded
    [token-discovery] Created the kube-discovery deployment, waiting for it to become ready
    [token-discovery] kube-discovery is ready after 6.020980 seconds
    [addons] Created essential addon: kube-proxy
    [addons] Created essential addon: kube-dns

    Your Kubernetes master has initialized successfully!

    You should now deploy a pod network to the cluster.
    Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
        http://kubernetes.io/docs/admin/addons/

    You can now join any number of machines by running the following on each node:

    kubeadm join --token=<token> <master-ip>

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

**It is necessary to do this before you try to deploy any applications to your cluster, and before `kube-dns` will start up. Note also that `kubeadm` only supports CNI based networks and therefore kubenet based networks will not work.**

Several projects provide Kubernetes pod networks using CNI, some of which 
also support [Network Policy](/docs/user-guide/networkpolicies/). See the [add-ons page](/docs/admin/addons/) for a complete list of available network add-ons.

You can install a pod network add-on with the following command: 

    # kubectl apply -f <add-on.yaml>

Please refer to the specific add-on installation guide for exact details. You should only install one pod network per cluster.

If you are on another architecture than amd64, you should use the flannel overlay network as described in [the multi-platform section](#kubeadm-is-multi-platform)

NOTE: You can install **only one** pod network per cluster.

Once a pod network has been installed, you can confirm that it is working by checking that the `kube-dns` pod is `Running` in the output of `kubectl get pods --all-namespaces`.

And once the `kube-dns` pod is up and running, you can continue by joining your nodes.

### (4/4) Joining your nodes

The nodes are where your workloads (containers and pods, etc) run.
If you want to add any new machines as nodes to your cluster, for each machine: SSH to that machine, become root (e.g. `sudo su -`) and run the command that was output by `kubeadm init`.
For example:

    # kubeadm join --token <token> <master-ip>
    [kubeadm] WARNING: kubeadm is in alpha, please do not use it for production clusters.
    [preflight] Running pre-flight checks
    [preflight] Starting the kubelet service
    [tokens] Validating provided token
    [discovery] Created cluster info discovery client, requesting info from "http://192.168.x.y:9898/cluster-info/v1/?token-id=f11877"
    [discovery] Cluster info object received, verifying signature using given token
    [discovery] Cluster info signature and contents are valid, will use API endpoints [https://192.168.x.y:6443]
    [bootstrap] Trying to connect to endpoint https://192.168.x.y:6443
    [bootstrap] Detected server version: v1.5.1
    [bootstrap] Successfully established connection with endpoint "https://192.168.x.y:6443"
    [csr] Created API client to obtain unique certificate for this node, generating keys and certificate signing request
    [csr] Received signed certificate from the API server:
    Issuer: CN=kubernetes | Subject: CN=system:node:yournode | CA: false
    Not before: 2016-12-15 19:44:00 +0000 UTC Not After: 2017-12-15 19:44:00 +0000 UTC
    [csr] Generating kubelet configuration
    [kubeconfig] Wrote KubeConfig file to disk: "/etc/kubernetes/kubelet.conf"

    Node join complete:
    * Certificate signing request sent to master and response
      received.
    * Kubelet informed of new secure connection details.

    Run 'kubectl get nodes' on the master to see this machine join.

A few seconds later, you should notice that running `kubectl get nodes` on the master shows a cluster with as many machines as you created.

### (Optional) Controlling your cluster from machines other than the master

In order to get a kubectl on your laptop for example to talk to your cluster, you need to copy the `KubeConfig` file from your master to your laptop like this:

    # scp root@<master ip>:/etc/kubernetes/admin.conf .
    # kubectl --kubeconfig ./admin.conf get nodes

### (Optional) Connecting to the API Server

If you want to connect to the API Server for viewing the dashboard (note: the dashboard isn't deployed by default) from outside the cluster for example, you can use `kubectl proxy`:

    # scp root@<master ip>:/etc/kubernetes/admin.conf .
    # kubectl --kubeconfig ./admin.conf proxy

You can now access the API Server locally at `http://localhost:8001/api/v1`

### (Optional) Installing a sample application

As an example, install a sample microservices application, a socks shop, to put your cluster through its paces. Note that this demo does only work on `amd64`.
To learn more about the sample microservices app, see the [GitHub README](https://github.com/microservices-demo/microservices-demo).

    # kubectl create namespace sock-shop
    # kubectl apply -n sock-shop -f "https://github.com/microservices-demo/microservices-demo/blob/master/deploy/kubernetes/complete-demo.yaml?raw=true"

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

## Tear down

* To uninstall the socks shop, run `kubectl delete namespace sock-shop` on the master.

* To undo what `kubeadm` did, simply run:

      # kubeadm reset

  If you wish to start over, run `systemctl start kubelet` followed by `kubeadm init` or `kubeadm join`.

## Explore other add-ons

See the [list of add-ons](/docs/admin/addons/) to explore other add-ons, including tools for logging, monitoring, network policy, visualization &amp; control of your Kubernetes cluster.

## What's next

* Learn about `kubeadm`'s advanced usage on the [advanced reference doc](/docs/admin/kubeadm/)
* Learn more about [Kubernetes concepts and kubectl in Kubernetes 101](/docs/user-guide/walkthrough/).

## Feedback

* Slack Channel: [#sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle/)
* Mailing List: [kubernetes-sig-cluster-lifecycle](https://groups.google.com/forum/#!forum/kubernetes-sig-cluster-lifecycle)
* [GitHub Issues in the kubeadm repository](https://github.com/kubernetes/kubeadm/issues)

## kubeadm is multi-platform

kubeadm deb packages and binaries are built for amd64, arm and arm64, following the [multi-platform proposal](https://github.com/kubernetes/kubernetes/blob/master/docs/proposals/multi-platform.md).

deb-packages are released for ARM and ARM 64-bit, but not RPMs (yet, reach out if there's interest).

Currently, only the pod network flannel is working on multiple architectures. You can install it this way:

    # export ARCH=amd64
    # curl -sSL "https://github.com/coreos/flannel/blob/master/Documentation/kube-flannel.yml?raw=true" | sed "s/amd64/${ARCH}/g" | kubectl create -f -

Replace `ARCH=amd64` with `ARCH=arm` or `ARCH=arm64` depending on the platform you're running on.
Note that the Raspberry Pi 3 is in ARM 32-bit mode, so for RPi 3 you should set `ARCH` to `arm`, not `arm64`.

## Cloudprovider integrations (experimental)

Enabling specific cloud providers is a common request, this currently requires manual configuration and is therefore not yet supported. If you wish to do so, 
edit the `kubeadm` dropin for the `kubelet` service (`/etc/systemd/system/kubelet.service.d/10-kubeadm.conf`) on all nodes, including the master. 
If your cloud provider requires any extra packages installed on host, for example for volume mounting/unmounting, install those packages.

Specify the `--cloud-provider` flag to kubelet and set it to the cloud of your choice. If your cloudprovider requires a configuration
file, create the file `/etc/kubernetes/cloud-config` on every node. The exact format and content of that file depends on the requirements imposed by your cloud provider.
If you use the `/etc/kubernetes/cloud-config` file, you must append it to the `kubelet` arguments as follows:
`--cloud-config=/etc/kubernetes/cloud-config`

Lastly, run `kubeadm init --cloud-provider=xxx` to bootstrap your cluster with cloud provider features.

This workflow is not yet fully supported, however we hope to make it extremely easy to spin up clusters with cloud providers in the future. 
(See [this proposal](https://github.com/kubernetes/community/pull/128) for more information) The [Kubelet Dynamic Settings](https://github.com/kubernetes/kubernetes/pull/29459) feature may also help to fully automate this process in the future.

## Limitations

Please note: `kubeadm` is a work in progress and these limitations will be addressed in due course.
    
1. The cluster created here has a single master, with a single `etcd` database running on it.
   This means that if the master fails, your cluster loses its configuration data and will need to be recreated from scratch.
   Adding HA support (multiple `etcd` servers, multiple API servers, etc) to `kubeadm` is still a work-in-progress.

   Workaround: regularly [back up etcd](https://coreos.com/etcd/docs/latest/admin_guide.html).
   The `etcd` data directory configured by `kubeadm` is at `/var/lib/etcd` on the master.
1. The `HostPort` and `HostIP` functionality does not work with kubeadm due to that CNI networking is used, see issue [#31307](https://github.com/kubernetes/kubernetes/issues/31307).

   Workaround: use the [NodePort feature of services](/docs/user-guide/services/#type-nodeport) instead, or use HostNetwork.
1. Some users on RHEL/CentOS 7 have reported issues with traffic being routed incorrectly due to iptables being bypassed. You should ensure `net.bridge.bridge-nf-call-iptables` is set to 1 in your sysctl config, eg.

    ```console
    # cat /etc/sysctl.d/k8s.conf
    net.bridge.bridge-nf-call-ip6tables = 1
    net.bridge.bridge-nf-call-iptables = 1
    ```

1. There is no built-in way of fetching the token easily once the cluster is up and running, but here is a `kubectl` command you can copy and paste that will print out the token for you:

    ```console
    # kubectl -n kube-system get secret clusterinfo -o yaml | grep token-map | awk '{print $2}' | base64 -d | sed "s|{||g;s|}||g;s|:|.|g;s/\"//g;" | xargs echo
    ```

1. If you are using VirtualBox (directly or via Vagrant), you will need to ensure that `hostname -i` returns a routable IP address (i.e. one on the second network interface, not the first one).
   By default, it doesn't do this and kubelet ends-up using first non-loopback network interface, which is usually NATed.
   Workaround: Modify `/etc/hosts`, take a look at this [`Vagrantfile`][ubuntu-vagrantfile] for how you this can be achieved.

[ubuntu-vagrantfile]: https://github.com/errordeveloper/k8s-playground/blob/22dd39dfc06111235620e6c4404a96ae146f26fd/Vagrantfile#L11),
