---
assignees:
- mikedanese
- luxas
- errordeveloper
- jbeda
title: Using kubeadm to Create a Cluster
redirect_from:
- "/docs/getting-started-guides/kubeadm/"
- "/docs/getting-started-guides/kubeadm.html"
---

## Overview

This quickstart shows you how to easily install a Kubernetes cluster on machines
running Ubuntu 16.04, CentOS 7 or HypriotOS v1.0.1+. The installation uses a
tool called _kubeadm_ which is part of Kubernetes.  As of v1.6, kubeadm aims to
create a secure cluster out of the box via mechanisms such as RBAC.

This process works with local VMs, physical servers and/or cloud servers. It is
simple enough that you can easily integrate its use into your own automation
(Terraform, Chef, Puppet, etc).

See the full [kubeadm reference](/docs/admin/kubeadm) for information on all
kubeadm command-line flags and for advice on automating kubeadm itself.

kubeadm assumes you have a set of machines (virtual or real) that are up and
running.  It is designed to be part of a large provisioning system - or just for
easy manual provisioning.  kubeadm is a great choice where you have your own
infrastructure (e.g. bare metal), or where you have an existing orchestration
system (e.g. Puppet) that you have to integrate with.

If you are not constrained, there are other higher-level tools built to give you
complete clusters:

* On GCE, [Google Container Engine](https://cloud.google.com/container-engine/)
  gives you one-click Kubernetes clusters
* On AWS, [kops](https://github.com/kubernetes/kops) makes cluster installation
  and management easy.  kops supports building high availability clusters (a
  feature that kubeadm is currently lacking but is building toward).

### kubeadm Maturity

| Aspect | Maturity Level
|--------|---------------
| Command line UX | beta
| Config file | alpha
| Selfhosting | alpha
| `kubeadm alpha` commands | alpha
| Implementation | alpha

The experience for the command line is currently in beta and we are trying hard
not to change command line flags and break that flow.  Other parts of the
experience are still under active development.  Specifically, kubeadm relies on
some features (bootstrap tokens, cluster signing), that are still considered
alpha.  The implementation may change as the tool evolves to support easy
upgrades and high availability (HA).  Any commands under `kubeadm alpha` (not
documented here) are, of course, alpha.

**Be sure to read the [limitations](#limitations)**.  Specifically, configuring
cloud providers is difficult.  Upgrades are also not well documented or
particularly easy.

## Prerequisites

1. One or more machines running Ubuntu 16.04+, CentOS 7 or HypriotOS v1.0.1+
1. 1GB or more of RAM per machine (any less will leave little room for your
   apps)
1. Full network connectivity between all machines in the cluster (public or
   private network is fine)

## Objectives

* Install a secure Kubernetes cluster on your machines
* Install a pod network on the cluster so that application components (pods) can
  talk to each other
* Install a sample microservices application (a socks shop) on the cluster

## Instructions

### (1/4) Installing kubeadm on your hosts

See [Installing kubeadm](/docs/setup/independent/install-kubeadm/)

### (2/4) Initializing your master

The master is the machine where the "control plane" components run, including
etcd (the cluster database) and the API server (which the kubectl CLI
communicates with).

To initialize the master, pick one of the machines you previously installed
kubeadm on, and run:

``` bash
kubeadm init
```

**Note:** this will autodetect the network interface to advertise the master on
as the interface with the default gateway. If you want to use a different
interface, specify `--apiserver-advertise-address=<ip-address>` argument to `kubeadm
init`.

There are pod network implementations where the master also plays a role in
allocating a set of network address space for each node.  When using
[flannel](https://github.com/coreos/flannel) as the [pod network](#pod-network)
(described in step 3), specify `--pod-network-cidr=10.244.0.0/16`. _This is not
required for any other networks besides Flannel._

Please refer to the [kubeadm reference doc](/docs/admin/kubeadm/) if you want to
read more about the flags `kubeadm init` provides.

`kubeadm init` will first run a series of prechecks to ensure that the machine
is ready to run Kubernetes.  It will expose warnings and exit on errors.  It
will then download and install the cluster database and "control plane"
components. This may take several minutes.

You can't run `kubeadm init` twice without tearing down the cluster in between,
see [Tear Down](#tear-down).

The output should look like:

```
[kubeadm] WARNING: kubeadm is in beta, please do not use it for production clusters.
[init] Using Kubernetes version: v1.6.0
[init] Using Authorization mode: RBAC
[preflight] Running pre-flight checks
[preflight] Starting the kubelet service
[certificates] Generated CA certificate and key.
[certificates] Generated API server certificate and key.
[certificates] API Server serving cert is signed for DNS names [kubeadm-master kubernetes kubernetes.default kubernetes.default.svc kubernetes.default.svc.cluster.local] and IPs [10.96.0.1 10.138.0.4]
[certificates] Generated API server kubelet client certificate and key.
[certificates] Generated service account token signing key and public key.
[certificates] Generated front-proxy CA certificate and key.
[certificates] Generated front-proxy client certificate and key.
[certificates] Valid certificates and keys now exist in "/etc/kubernetes/pki"
[kubeconfig] Wrote KubeConfig file to disk: "/etc/kubernetes/admin.conf"
[kubeconfig] Wrote KubeConfig file to disk: "/etc/kubernetes/kubelet.conf"
[kubeconfig] Wrote KubeConfig file to disk: "/etc/kubernetes/controller-manager.conf"
[kubeconfig] Wrote KubeConfig file to disk: "/etc/kubernetes/scheduler.conf"
[apiclient] Created API client, waiting for the control plane to become ready
[apiclient] All control plane components are healthy after 16.772251 seconds
[apiclient] Waiting for at least one node to register and become ready
[apiclient] First node is ready after 5.002536 seconds
[apiclient] Test deployment succeeded
[token] Using token: <token>
[apiconfig] Created RBAC rules
[addons] Created essential addon: kube-proxy
[addons] Created essential addon: kube-dns

Your Kubernetes master has initialized successfully!

To start using your cluster, you need to run (as a regular user):

  sudo cp /etc/kubernetes/admin.conf $HOME/
  sudo chown $(id -u):$(id -g) $HOME/admin.conf
  export KUBECONFIG=$HOME/admin.conf

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  http://kubernetes.io/docs/admin/addons/

You can now join any number of machines by running the following on each node
as root:

  kubeadm join --token <token> <master-ip>:<master-port>
```

Make a record of the `kubeadm join` command that `kubeadm init` outputs. You
will need this in a moment.

The token is used for mutual authentication between the master and the joining
nodes.  The token included here is secret, keep it safe &mdash; anyone with this
token can add authenticated nodes to your cluster.  These tokens can be listed,
created and deleted with the `kubeadm token` command.  See the [reference
guide](/docs/admin/kubeadm/#manage-tokens).

#### Master Images

All of these components run in pods started by kubelet and the following images
are required and will be automatically pulled by kubelet if they are absent
while `kubeadm init` is initializing your master:

| Image Name | Version |
|---|---|
| gcr.io/google_containers/kube-apiserver-amd64 | v1.6.0
| gcr.io/google_containers/kube-controller-manager-amd64 | v1.6.0
| gcr.io/google_containers/kube-scheduler-amd64 | v1.6.0
| gcr.io/google_containers/kube-proxy-amd64 | v1.6.0
| gcr.io/google_containers/etcd-amd64 | 3.0.17
| gcr.io/google_containers/pause-amd64 | 3.0
| gcr.io/google_containers/k8s-dns-sidecar-amd64 | 1.14.1
| gcr.io/google_containers/k8s-dns-kube-dns-amd64 | 1.14.1
| gcr.io/google_containers/k8s-dns-dnsmasq-nanny-amd64 | 1.14.1

#### Master Isolation

By default, your cluster will not schedule pods on the master for security
reasons. If you want to be able to schedule pods on the master, e.g. a
single-machine Kubernetes cluster for development, run:

``` bash
kubectl taint nodes --all node-role.kubernetes.io/master-
```

With output looking something like:

```
node "test-01" tainted
taint key="dedicated" and effect="" not found.
taint key="dedicated" and effect="" not found.
```

This will remove the `node-role.kubernetes.io/master` taint from any nodes that
have it, including the master node, meaning that the scheduler will then be able
to schedule pods everywhere.

### (3/4) Installing a pod network {#pod-network}

You must install a pod network add-on so that your pods can communicate with
each other.

**The network must be deployed before any applications.  Also, kube-dns, a
helper service, will not start up before a network is installed. kubeadm only
supports Container Network Interface (CNI) based networks (and does not support kubenet).**

Several projects provide Kubernetes pod networks using CNI, some of which also
support [Network Policy](/docs/concepts/services-networking/networkpolicies/). See the [add-ons
page](/docs/concepts/cluster-administration/addons/) for a complete list of available network add-ons.

**New for Kubernetes 1.6:** kubeadm 1.6 sets up a more secure cluster by
default.  As such it uses RBAC to grant limited privileges to workloads running
on the cluster.  This includes networking integrations.  As such, ensure that
you are using a network system that has been updated to run with 1.6 and RBAC.

You can install a pod network add-on with the following command:

``` bash
kubectl apply -f <add-on.yaml>
```

Please refer to the specific add-on installation guide for exact details. You
should only install one pod network per cluster.

If you are on another architecture than amd64, you should use the
flannel or Weave Net overlay networks as described in [the
multi-platform section](#multi-platform)

NOTE: You can install **only one** pod network per cluster.

Once a pod network has been installed, you can confirm that it is working by
checking that the kube-dns pod is Running in the output of `kubectl get pods
--all-namespaces`.  And once the kube-dns pod is up and running, you can continue by joining your
nodes.

If your network is not working or kube-dns is not in the Running state, check
out the [troubleshooting section](#pod-network-trouble) below.

### (4/4) Joining your nodes

The nodes are where your workloads (containers and pods, etc) run. To add new nodes to your cluster do the following for each machine:

* SSH to the machine
* Become root (e.g. `sudo su -`)
* Run the command that was output by `kubeadm init`. For example:

  ``` bash
  kubeadm join --token <token> <master-ip>:<master-port>
  ```

The output should look something like:

```
[kubeadm] WARNING: kubeadm is in beta, please do not use it for production clusters.
[preflight] Running pre-flight checks
[discovery] Trying to connect to API Server "10.138.0.4:6443"
[discovery] Created cluster-info discovery client, requesting info from "https://10.138.0.4:6443"
[discovery] Cluster info signature and contents are valid, will use API Server "https://10.138.0.4:6443"
[discovery] Successfully established connection with API Server "10.138.0.4:6443"
[bootstrap] Detected server version: v1.6.0-beta.3
[bootstrap] The server supports the Certificates API (certificates.k8s.io/v1beta1)
[csr] Created API client to obtain unique certificate for this node, generating keys and certificate signing request
[csr] Received signed certificate from the API server, generating KubeConfig...
[kubeconfig] Wrote KubeConfig file to disk: "/etc/kubernetes/kubelet.conf"

Node join complete:
* Certificate signing request sent to master and response
  received.
* Kubelet informed of new secure connection details.

Run 'kubectl get nodes' on the master to see this machine join.
```

A few seconds later, you should notice this node in the output from `kubectl get
nodes` when run on the master.

### (Optional) Controlling your cluster from machines other than the master

In order to get a kubectl on some other computer (e.g. laptop) to talk to your
cluster, you need to copy the kubeconfig file from your master to your
workstation like this:

``` bash
scp root@<master ip>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf get nodes
```

**Note:** If you are using GCE, instances, by default, disable ssh access for
root.  First log in to the machine, copy the file someplace that can be accessed
and then use [`gcloud compute
copy-files`](https://cloud.google.com/sdk/gcloud/reference/compute/copy-files)

### (Optional) Connecting to the API Server

If you want to connect to the API Server from outside the cluster you can use
`kubectl proxy`:

``` bash
scp root@<master ip>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf proxy
```

You can now access the API Server locally at `http://localhost:8001/api/v1`

### (Optional) Installing a sample application

Now it is time to take your new cluster for a test drive.  Sock Shop is a sample
microservices application that shows how to run and connect a set of services on
Kubernetes. To learn more about the sample microservices app, see the [GitHub
README](https://github.com/microservices-demo/microservices-demo).

Note that the Sock Shop demo only works on `amd64`.

``` bash
kubectl create namespace sock-shop
kubectl apply -n sock-shop -f "https://github.com/microservices-demo/microservices-demo/blob/master/deploy/kubernetes/complete-demo.yaml?raw=true"
```

You can then find out the port that the [NodePort feature of
services](/docs/concepts/services-networking/service/) allocated for the front-end service by
running:

``` bash
kubectl -n sock-shop get svc front-end
```

Output:

```
NAME        CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
front-end   10.110.250.153   <nodes>       80:30001/TCP   59s
```

It takes several minutes to download and start all the containers, watch the
output of `kubectl get pods -n sock-shop` to see when they're all up and
running.

Then go to the IP address of your cluster's master node in your browser, and
specify the given port. So for example, `http://<master_ip>:<port>`. In the
example above, this was `30001`, but it may be a different port for you.

If there is a firewall, make sure it exposes this port to the internet before
you try to access it.

To uninstall the socks shop, run `kubectl delete namespace sock-shop` on the
master.

## Tear down

To undo what kubeadm did, you should first [drain the
node](/docs/user-guide/kubectl/v1.6/#drain) and make
sure that the node is empty before shutting it down.

Talking to the master with the appropriate credentials, run:

``` bash
kubectl drain <node name> --delete-local-data --force --ignore-daemonsets
kubectl delete node <node name>
```

Then, on the node being removed, reset all kubeadm installed state:

``` bash
kubeadm reset
```

If you wish to start over simply run `kubeadm init` or `kubeadm join` with the
appropriate arguments.

## Explore other add-ons

See the [list of add-ons](/docs/concepts/cluster-administration/addons/) to explore other add-ons,
including tools for logging, monitoring, network policy, visualization &amp;
control of your Kubernetes cluster.

## What's next

* Learn about kubeadm's advanced usage on the [advanced reference
  doc](/docs/admin/kubeadm/)
* Learn more about Kubernetes [concepts](/docs/concepts/) and [`kubectl`](/docs/user-guide/kubectl-overview/).

## Feedback

* Slack Channel:
  [#sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle/)
* Mailing List:
  [kubernetes-sig-cluster-lifecycle](https://groups.google.com/forum/#!forum/kubernetes-sig-cluster-lifecycle)
* [GitHub Issues in the kubeadm
  repository](https://github.com/kubernetes/kubeadm/issues)

## kubeadm is multi-platform {#multi-platform}

kubeadm deb/rpm packages and binaries are built for amd64, arm64, armhfp,
ppc64el, and s390x following the [multi-platform
proposal](https://github.com/kubernetes/kubernetes/blob/master/docs/proposals/multi-platform.md).

Currently, only the pod networks flannel and Weave Net work on multiple architectures.
For Weave Net just use its [standard install](https://www.weave.works/docs/net/latest/kube-addon/).

Flannel requires special installation instructions:

``` bash
export ARCH=amd64
curl -sSL "https://github.com/coreos/flannel/blob/master/Documentation/kube-flannel.yml?raw=true" | sed "s/amd64/${ARCH}/g" | kubectl create -f -
```

Replace `ARCH=amd64` with `ARCH=arm` or `ARCH=arm64` depending on the platform
you're running on. Note that the Raspberry Pi 3 is in ARM 32-bit mode, so for
RPi 3 you should set `ARCH` to `arm`, not `arm64`.

## Cloudprovider integrations (experimental)

Enabling specific cloud providers is a common request. This currently requires
manual configuration and is therefore not yet fully supported. If you wish to do
so, edit the kubeadm dropin for the kubelet service
(`/etc/systemd/system/kubelet.service.d/10-kubeadm.conf`) on all nodes,
including the master. If your cloud provider requires any extra packages
installed on host, for example for volume mounting/unmounting, install those
packages.

Specify the `--cloud-provider` flag to kubelet and set it to the cloud of your
choice. If your cloudprovider requires a configuration file, create the file
`/etc/kubernetes/cloud-config` on every node. The exact format and content of
that file depends on the requirements imposed by your cloud provider. If you use
the `/etc/kubernetes/cloud-config` file, you must append it to the kubelet
arguments as follows: `--cloud-config=/etc/kubernetes/cloud-config`

Next, specify the cloud provider in the kubeadm config file.  Create a file called
`kubeadm.conf` with the following contents:

``` yaml
kind: MasterConfiguration
apiVersion: kubeadm.k8s.io/v1alpha1
cloudProvider: <cloud provider>
```

Lastly, run `kubeadm init --config=kubeadm.conf` to bootstrap your cluster with
the cloud provider.

This workflow is not yet fully supported, however we hope to make it extremely
easy to spin up clusters with cloud providers in the future. (See [this
proposal](https://github.com/kubernetes/community/pull/128) for more
information) The [Kubelet Dynamic
Settings](https://github.com/kubernetes/kubernetes/pull/29459) feature may also
help to fully automate this process in the future.

## Limitations

Please note: kubeadm is a work in progress and these limitations will be
addressed in due course.

1. The cluster created here has a single master, with a single etcd database
   running on it. This means that if the master fails, your cluster loses its
   configuration data and will need to be recreated from scratch. Adding HA
   support (multiple etcd servers, multiple API servers, etc) to kubeadm is
   still a work-in-progress.

   Workaround: regularly [back up
   etcd](https://coreos.com/etcd/docs/latest/admin_guide.html). The etcd data
   directory configured by kubeadm is at `/var/lib/etcd` on the master.

1. The `HostPort` and `HostIP` functionality does not work with kubeadm due to
   that CNI networking is used, see issue
   [#31307](https://github.com/kubernetes/kubernetes/issues/31307).

   Workaround: use the [NodePort feature of
   services](/docs/concepts/services-networking/service/#type-nodeport) instead, or use
   HostNetwork.

1. Some users on RHEL/CentOS 7 have reported issues with traffic being routed
   incorrectly due to iptables being bypassed. You should ensure
   `net.bridge.bridge-nf-call-iptables` is set to 1 in your sysctl config, eg.

   ``` bash
   cat /etc/sysctl.d/k8s.conf
   ```

   Should have:

   ```
   net.bridge.bridge-nf-call-ip6tables = 1
   net.bridge.bridge-nf-call-iptables = 1
   ```

1. Users can list, create and delete tokens using the `kubeadm token` command.
   See the [reference guide](/docs/admin/kubeadm/#manage-tokens) for details.

1. If you are using VirtualBox (directly or via Vagrant), you will need to
   ensure that `hostname -i` returns a routable IP address (i.e. one on the
   second network interface, not the first one). By default, it doesn't do this
   and kubelet ends-up using first non-loopback network interface, which is
   usually NATed. Workaround: Modify `/etc/hosts`, take a look at this
   [`Vagrantfile`][ubuntu-vagrantfile] for how this can be achieved.

[ubuntu-vagrantfile]: https://github.com/errordeveloper/k8s-playground/blob/22dd39dfc06111235620e6c4404a96ae146f26fd/Vagrantfile#L11),

## Troubleshooting {#troubleshooting}

### Pod Network Troubleshooting {#pod-network-trouble}

You may have trouble in the configuration if you see the following statuses.
This example is for canal but there may be similar errors for other pod network
systems.

```
NAMESPACE     NAME                              READY     STATUS              RESTARTS   AGE
kube-system   canal-node-f0lqp                  2/3       RunContainerError   2          48s
kube-system   canal-node-77d0h                  2/3       CrashLoopBackOff    3          3m
kube-system   kube-dns-2924299975-7q1vq         0/4       ContainerCreating   0          15m
```

The three statuses RunContainerError and CrashLoopBackOff and ContainerCreating
are very common.

To help diagnose what happened, you can use the following command to check what
is in the logs:

``` bash
kubectl describe -n kube-system po {YOUR_POD_NAME}
```

Do not use kubectl logs as they only work with Pods that have started. If you run:

``` bash
kubectl logs -n kube-system canal-node-f0lqp
```

You will got the following error:

```
Error from server (BadRequest): the server rejected our request for an unknown reason (get pods canal-node-f0lqp)
```

The `kubectl describe` comand gives you more details about what went wrong.

``` bash
kubectl describe -n kube-system po kube-dns-2924299975-1l2t7
```

The events should show something like this:

```
  2m		2m		1	{kubelet nac}	spec.containers{flannel}		Warning		Failed		Failed to start container with docker id 927e7ccdc32b with error: Error response from daemon: {"message":"chown /etc/resolv.conf: operation not permitted"}
```

Or this:

```
  6m	1m	191	{kubelet nac}		Warning	FailedSync	Error syncing pod, skipping: failed to "SetupNetwork" for "kube-dns-2924299975-1l2t7_kube-system" with SetupNetworkError: "Failed to setup network for pod \"kube-dns-2924299975-1l2t7_kube-system(dee8ef21-fbcb-11e6-ba19-38d547e0006a)\" using network plugins \"cni\": open /run/flannel/subnet.env: no such file or directory; Skipping pod"
```

A web search on the error message may help narrow down the issue.  Or
communicate the errors you are seeing to the community/company that provides the
pod network implementation you are using.

### Installing kubeadm 1.5 {#old-kubeadm}

This section covers the previous version, kubeadm 1.5.  It is still available but is a little tricky to get to.  Also note that the command line options and other configuration parameters have changed.

As root, run the following.  This is very similar to the regular instructions except for pinning the versions.  Note that, due to some unfortunate version strings, kubeadm isn't indexed in the repos and the packages must be downloaded and installed directly.

#### Ubuntu

```bash
apt-get update && apt-get install -y apt-transport-https
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
deb http://apt.kubernetes.io/ kubernetes-xenial main
EOF
apt-get update

# 1.5.6 does exist in the repo but it has a hard depenedency on a newer kubernetes-cni.  Use 1.5.3 instead.
sudo apt-get -y install kubectl=1.5.3-00 kubelet=1.5.3-00 kubernetes-cni=0.3.0.1-07a8a2-00

# Versioning strangeness for how we packaged kubeadm pre-1.6 means that the version number
# says 1.6.0-alpha even though it is the 1.5 version of kubeadm.  Because of how this sorts,
# we cannot keep this deb in the repo.  Download it manually and install it.
curl -Lo /tmp/old-kubeadm.deb https://apt.k8s.io/pool/kubeadm_1.6.0-alpha.0.2074-a092d8e0f95f52-00_amd64_0206dba536f698b5777c7d210444a8ace18f48e045ab78687327631c6c694f42.deb
sudo dpkg -i /tmp/old-kubeadm.deb
sudo apt-get install -f

# Hold these packages back so that we don't accidentally upgrade them.
sudo apt-mark hold kubeadm kubectl kubelet kubernetes-cni
```

#### CentOS

```bash
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

# 1.5.4 is the latest previous version in the repo.  Because of messed up
# versioning in the 1.5 release, kubeadm is no longer indexed in the repos
# so we have to refer to the RPM directly.
sudo yum -y install \
  yum-versionlock \
  docker \
  kubectl-1.5.4-0 \
  kubelet-1.5.4-0 \
  kubernetes-cni-0.3.0.1-0.07a8a2 \
  http://yum.kubernetes.io/pool/082436e6e6cad1852864438b8f98ee6fa3b86b597554720b631876db39b8ef04-kubeadm-1.6.0-0.alpha.0.2074.a092d8e0f95f52.x86_64.rpm

# Lock the version of these packages so that we don't upgrade them accidentally.
sudo yum versionlock add kubectl kubelet kubernetes-cni kubeadm

# Enable and start up docker and the kubelet
systemctl enable docker && systemctl start docker
systemctl enable kubelet && systemctl start kubelet
```

#### Running `kubeadm init`

Finally, when running `kubeadm init` you must specify the `--use-kubernetes-version` flag:

```bash
kubeadm init --use-kubernetes-version=v1.5.6
```
