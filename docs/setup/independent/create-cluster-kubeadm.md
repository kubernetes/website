---
approvers:
- mikedanese
- luxas
- errordeveloper
- jbeda
title: Using kubeadm to Create a Cluster
---

{% capture overview %}

This quickstart shows you how to easily install a Kubernetes cluster on machines
running Ubuntu 16.04+, CentOS 7 or HypriotOS v1.0.1+. The installation uses a
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
  gives you one-click Kubernetes clusters.
* On AWS, [kops](https://github.com/kubernetes/kops) makes cluster installation
  and management easy.  kops supports building high availability clusters (a
  feature that kubeadm is currently lacking but is building toward).

### kubeadm Maturity

| Aspect | Maturity Level
|--------|---------------
| Command line UX | beta
| Config file | alpha
| Self-hosting | alpha
| `kubeadm alpha` commands | alpha
| Implementation | beta

The experience for the command line is currently in beta and we are trying hard
not to change command line flags and break that flow.  Other parts of the
experience are still under active development.  The implementation may change
slightly as the tool evolves to support even easier upgrades and high
availability (HA).  Any commands under `kubeadm alpha` (not documented here)
are, of course, alpha.

**Be sure to read the [limitations](#limitations)**.  Specifically, configuring
cloud providers is difficult.
{% endcapture %}

{% capture prerequisites %}

1. One or more machines running Ubuntu 16.04+, CentOS 7 or HypriotOS v1.0.1+
1. 1GB or more of RAM per machine (any less will leave little room for your
   apps)
1. Full network connectivity between all machines in the cluster (public or
   private network is fine)
{% endcapture %}

{% capture steps %}

## Objectives

* Install a secure Kubernetes cluster on your machines
* Install a pod network on the cluster so that application components (pods) can
  talk to each other
* Install a sample microservices application (a socks shop) on the cluster

## Instructions

### (1/4) Installing kubeadm on your hosts

See [Installing kubeadm](/docs/setup/independent/install-kubeadm/).

**Note:** If you already have kubeadm installed, you should do a `apt-get update &&
apt-get upgrade` or `yum update` to get the latest version of kubeadm.


The kubelet is now restarting every few seconds, as it waits in a crashloop for
kubeadm to tell it what to do.

### (2/4) Initializing your master

The master is the machine where the control plane components run, including
etcd (the cluster database) and the API server (which the kubectl CLI
communicates with).

To initialize the master, pick one of the machines you previously installed
kubeadm on, and run:

``` bash
kubeadm init
```

**Note:**

 - You need to choose a Pod Network Plugin in the next step. Depending on what
third-party provider you choose, you might have to set the `--pod-network-cidr` to
something provider-specific. The tabs below will contain a notice about what flags
on `kubeadm init` are required.
 - This will autodetect the network interface to advertise the master on
as the interface with the default gateway. If you want to use a different
interface, specify `--apiserver-advertise-address=<ip-address>` argument to `kubeadm
init`.

Please refer to the [kubeadm reference doc](/docs/admin/kubeadm/) if you want to
read more about the flags `kubeadm init` provides.

`kubeadm init` will first run a series of prechecks to ensure that the machine
is ready to run Kubernetes.  It will expose warnings and exit on errors. It
will then download and install the cluster database and control plane
components. This may take several minutes.

You can't run `kubeadm init` twice without tearing down the cluster in between
([unless you're upgrading from v1.6 to v1.7](/docs/tasks/administer-cluster/kubeadm-upgrade-1-7)),
see [Tear Down](#tear-down).

The output should look like:

```
[kubeadm] WARNING: kubeadm is in beta, please do not use it for production clusters.
[init] Using Kubernetes version: v1.8.0
[init] Using Authorization modes: [Node RBAC]
[preflight] Running pre-flight checks
[kubeadm] WARNING: starting in 1.8, tokens expire after 24 hours by default (if you require a non-expiring token use --token-ttl 0)
[certificates] Generated ca certificate and key.
[certificates] Generated apiserver certificate and key.
[certificates] apiserver serving cert is signed for DNS names [kubeadm-master kubernetes kubernetes.default kubernetes.default.svc kubernetes.default.svc.cluster.local] and IPs [10.96.0.1 10.138.0.4]
[certificates] Generated apiserver-kubelet-client certificate and key.
[certificates] Generated sa key and public key.
[certificates] Generated front-proxy-ca certificate and key.
[certificates] Generated front-proxy-client certificate and key.
[certificates] Valid certificates and keys now exist in "/etc/kubernetes/pki"
[kubeconfig] Wrote KubeConfig file to disk: "admin.conf"
[kubeconfig] Wrote KubeConfig file to disk: "kubelet.conf"
[kubeconfig] Wrote KubeConfig file to disk: "controller-manager.conf"
[kubeconfig] Wrote KubeConfig file to disk: "scheduler.conf"
[controlplane] Wrote Static Pod manifest for component kube-apiserver to "/etc/kubernetes/manifests/kube-apiserver.yaml"
[controlplane] Wrote Static Pod manifest for component kube-controller-manager to "/etc/kubernetes/manifests/kube-controller-manager.yaml"
[controlplane] Wrote Static Pod manifest for component kube-scheduler to "/etc/kubernetes/manifests/kube-scheduler.yaml"
[etcd] Wrote Static Pod manifest for a local etcd instance to "/etc/kubernetes/manifests/etcd.yaml"
[init] Waiting for the kubelet to boot up the control plane as Static Pods from directory "/etc/kubernetes/manifests"
[init] This often takes around a minute; or longer if the control plane images have to be pulled.
[apiclient] All control plane components are healthy after 39.511972 seconds
[uploadconfig] Storing the configuration used in ConfigMap "kubeadm-config" in the "kube-system" Namespace
[markmaster] Will mark node master as master by adding a label and a taint
[markmaster] Master master tainted and labelled with key/value: node-role.kubernetes.io/master=""
[bootstraptoken] Using token: <token>
[bootstraptoken] Configured RBAC rules to allow Node Bootstrap tokens to post CSRs in order for nodes to get long term certificate credentials
[bootstraptoken] Configured RBAC rules to allow the csrapprover controller automatically approve CSRs from a Node Bootstrap Token
[bootstraptoken] Creating the "cluster-info" ConfigMap in the "kube-public" namespace
[addons] Applied essential addon: kube-dns
[addons] Applied essential addon: kube-proxy

Your Kubernetes master has initialized successfully!

To start using your cluster, you need to run (as a regular user):

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  http://kubernetes.io/docs/admin/addons/

You can now join any number of machines by running the following on each node
as root:

  kubeadm join --token <token> <master-ip>:<master-port> --discovery-token-ca-cert-hash sha256:<hash>
```

Make a record of the `kubeadm join` command that `kubeadm init` outputs. You
will need this in a moment.

The token is used for mutual authentication between the master and the joining
nodes.  The token included here is secret, keep it safe &mdash; anyone with this
token can add authenticated nodes to your cluster.  These tokens can be listed,
created and deleted with the `kubeadm token` command.  See the [reference
guide](/docs/admin/kubeadm/#manage-tokens).

### (3/4) Installing a pod network {#pod-network}

You **must** install a pod network add-on so that your pods can communicate with
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

**NOTE:** You can install **only one** pod network per cluster.


{% capture choose %}
Please select one of the tabs to see installation instructions for the respective third-party Pod Network Provider.
{% endcapture %}

{% capture calico %}

The official Calico guide is [here](http://docs.projectcalico.org/latest/getting-started/kubernetes/installation/hosted/kubeadm/).

**Note:**

 - In order for Network Policy to work correctly, you need to pass `--pod-network-cidr=192.168.0.0/16` to `kubeadm init`.
 - Calico works on `amd64` only.

```shell
kubectl apply -f http://docs.projectcalico.org/v2.4/getting-started/kubernetes/installation/hosted/kubeadm/1.6/calico.yaml
```
{% endcapture %}

{% capture canal %}

The official Canal set-up guide is [here](https://github.com/projectcalico/canal/tree/master/k8s-install).

**Note:**

 - For Canal to work correctly, `--pod-network-cidr=10.244.0.0/16` has to be passed to `kubeadm init`.
 - Canal works on `amd64` only.

```shell
kubectl apply -f https://raw.githubusercontent.com/projectcalico/canal/master/k8s-install/1.6/rbac.yaml
kubectl apply -f https://raw.githubusercontent.com/projectcalico/canal/master/k8s-install/1.6/canal.yaml
```
{% endcapture %}

{% capture flannel %}

**Note:**

 - For flannel to work correctly, `--pod-network-cidr=10.244.0.0/16` has to be passed to `kubeadm init`.
 - flannel works on `amd64`, `arm`, `arm64` and `ppc64le`, but for it to work on an other platform than
`amd64` you have to manually download the manifest and replace `amd64` occurences with your chosen platform.

```shell
kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
```
{% endcapture %}

{% capture kube-router %}

Kube-router relies on kube-controll-manager to allocate pod CIDR for the nodes. Therefore, use `kubeadm init` with the `--pod-network-cidr` flag.

Kube-router provides pod networking, network policy, and high-performing IP Virtual Server(IPVS)/Linux Virtual Server(LVS) based service proxy.

For information on setting up Kubernetes cluster with Kube-router using kubeadm please see official [setup guide](https://github.com/cloudnativelabs/kube-router/blob/master/Documentation/kubeadm.md).

{% endcapture %}

{% capture romana %}

The official Romana set-up guide is [here](https://github.com/romana/romana/tree/master/containerize#using-kubeadm).

**Note:** Romana works on `amd64` only.

```shell
kubectl apply -f https://raw.githubusercontent.com/romana/romana/master/containerize/specs/romana-kubeadm.yml
```
{% endcapture %}

{% capture weave_net %}

The official Weave Net set-up guide is [here](https://www.weave.works/docs/net/latest/kube-addon/).

**Note:** Weave Net works on `amd64`, `arm` and `arm64` without any extra action required.
Weave Net sets hairpin mode by default. This allows Pods to access themselves via their Service IP address
if they don't know their PodIP.

```shell
export kubever=$(kubectl version | base64 | tr -d '\n')
kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$kubever"
```
{% endcapture %}

{% assign tab_names = "Choose one...,Calico,Canal,Flannel,Kube-router,Romana,Weave Net" | split: ',' | compact %}
{% assign tab_contents = site.emptyArray | push: choose | push: calico | push: canal | push: flannel | push: kube-router | push: romana | push: weave_net %}

{% include tabs.md %}

Once a pod network has been installed, you can confirm that it is working by
checking that the kube-dns pod is Running in the output of `kubectl get pods --all-namespaces`.
And once the kube-dns pod is up and running, you can continue by joining your nodes.

If your network is not working or kube-dns is not in the Running state, check
out the [troubleshooting section](#troubleshooting) below.

#### Master Isolation

By default, your cluster will not schedule pods on the master for security
reasons. If you want to be able to schedule pods on the master, e.g. for a
single-machine Kubernetes cluster for development, run:

``` bash
kubectl taint nodes --all node-role.kubernetes.io/master-
```

With output looking something like:

```
node "test-01" untainted
taint key="dedicated" and effect="" not found.
taint key="dedicated" and effect="" not found.
```

This will remove the `node-role.kubernetes.io/master` taint from any nodes that
have it, including the master node, meaning that the scheduler will then be able
to schedule pods everywhere.

### (4/4) Joining your nodes

The nodes are where your workloads (containers and pods, etc) run. To add new nodes to your cluster do the following for each machine:

* SSH to the machine
* Become root (e.g. `sudo su -`)
* Run the command that was output by `kubeadm init`. For example:

  ``` bash
  kubeadm join --token <token> <master-ip>:<master-port> --discovery-token-ca-cert-hash sha256:<hash>
  ```

The output should look something like:

```
[kubeadm] WARNING: kubeadm is in beta, please do not use it for production clusters.
[preflight] Running pre-flight checks
[discovery] Trying to connect to API Server "10.138.0.4:6443"
[discovery] Created cluster-info discovery client, requesting info from "https://10.138.0.4:6443"
[discovery] Requesting info from "https://10.138.0.4:6443" again to validate TLS against the pinned public key
[discovery] Cluster info signature and contents are valid and TLS certificate validates against pinned roots, will use API Server "10.138.0.4:6443"
[discovery] Successfully established connection with API Server "10.138.0.4:6443"
[bootstrap] Detected server version: v1.8.0
[bootstrap] The server supports the Certificates API (certificates.k8s.io/v1beta1)
[csr] Created API client to obtain unique certificate for this node, generating keys and certificate signing request
[csr] Received signed certificate from the API server, generating KubeConfig...

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
cluster, you need to copy the administrator kubeconfig file from your master
to your workstation like this:

``` bash
scp root@<master ip>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf get nodes
```

**Note:** If you are using GCE, instances disable ssh access for root by default.
If that's the case you can log in to the machine, copy the file someplace that
can be accessed and then use
[`gcloud compute copy-files`](https://cloud.google.com/sdk/gcloud/reference/compute/copy-files).

### (Optional) Proxying API Server to localhost

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

Sample output:

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
node](/docs/user-guide/kubectl/{{page.version}}/#drain) and make
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

## Upgrading

Instructions for upgrading kubeadm clusters are available for:

 * [1.6 to 1.7 upgrades](/docs/tasks/administer-cluster/kubeadm-upgrade-1-7/)
 * [1.7.x to 1.7.y  upgrades](/docs/tasks/administer-cluster/kubeadm-upgrade-1-8/)
 * [1.7 to 1.8 upgrades](/docs/tasks/administer-cluster/kubeadm-upgrade-1-8/)
 * [1.8.x to 1.8.y upgrades](/docs/tasks/administer-cluster/kubeadm-upgrade-1-8/)

## Explore other add-ons

See the [list of add-ons](/docs/concepts/cluster-administration/addons/) to explore other add-ons,
including tools for logging, monitoring, network policy, visualization &amp;
control of your Kubernetes cluster.

## What's next

* Learn about kubeadm's advanced usage on the [advanced reference
  doc](/docs/admin/kubeadm/).
* Learn more about Kubernetes [concepts](/docs/concepts/) and [`kubectl`](/docs/user-guide/kubectl-overview/).
* Configure log rotation. You can use **logrotate** for that. When using Docker, you can specify log rotation options for Docker daemon, for example `--log-driver=json-file --log-opt=max-size=10m --log-opt=max-file=5`. See [Configure and troubleshoot the Docker daemon](https://docs.docker.com/engine/admin/) for more details.

## Feedback

* kubeadm support Slack Channel:
  [kubeadm](https://kubernetes.slack.com/messages/kubeadm/)
* General SIG Cluster Lifecycle Development Slack Channel:
  [sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle/)
* Mailing List:
  [kubernetes-sig-cluster-lifecycle](https://groups.google.com/forum/#!forum/kubernetes-sig-cluster-lifecycle)
* [GitHub Issues in the kubeadm
  repository](https://github.com/kubernetes/kubeadm/issues)


## Version skew policy

The kubeadm CLI tool of version vX.Y may deploy clusters with a control plane of version vX.Y or vX.(Y-1).
kubeadm CLI vX.Y can also upgrade an existing kubeadm-created cluster of version vX.(Y-1).

Due to that we can't see into the future, kubeadm CLI vX.Y may or may not be able to deploy vX.(Y+1) clusters.

Example: kubeadm v1.8 can deploy both v1.7 and v1.8 clusters and upgrade v1.7 kubeadm-created clusters to
v1.8.

## kubeadm is multi-platform {#multi-platform}

kubeadm deb/rpm packages and binaries are built for amd64, arm (32-bit), arm64, ppc64le, and s390x
following the [multi-platform
proposal](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/multi-platform.md).

Only some of the network providers offer solutions for all platforms. Please consult the list of
network providers above or the documentation from each provider to figure out whether the provider
supports your chosen platform.

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



## Troubleshooting {#troubleshooting}

You may have trouble in the configuration if you see Pod statuses like `RunContainerError`,
`CrashLoopBackOff` or `Error`.

1. **There are Pods in the `RunContainerError`, `CrashLoopBackOff` or `Error` state**.
    Right after `kubeadm init` there should not be any such Pods. If there are Pods in
    such a state _right after_ `kubeadm init`, please open an issue in the kubeadm repo.
    `kube-dns` should be in the `Pending` state until you have deployed the network solution.
    However, if you see Pods in the `RunContainerError`, `CrashLoopBackOff` or `Error` state
    after deploying the network solution and nothing happens to `kube-dns`, it's very
    likely that the Pod Network solution that you installed is somehow broken. You
    might have to grant it more RBAC privileges or use a newer version. Please file
    an issue in the Pod Network providers' issue tracker and get the issue triaged there.

1. **The `kube-dns` Pod is stuck in the `Pending` state forever**.
    This is expected and part of the design. kubeadm is network provider-agnostic, so the admin
    should [install the pod network solution](/docs/concepts/cluster-administration/addons/)
    of choice. You have to install a Pod Network
    before `kube-dns` may deployed fully. Hence the `Pending` state before the network is set up.

1. **I tried to set `HostPort` on one workload, but it didn't have any effect**.
    The `HostPort` and `HostIP` functionality is available depending on your Pod Network
    provider. Please contact the author of the Pod Network solution to find out whether
    `HostPort` and `HostIP` functionality are available.

    If not, you may still use the [NodePort feature of
    services](/docs/concepts/services-networking/service/#type-nodeport) or use `HostNetwork=true`.

1. **Pods cannot access themselves via their Service IP**.
    Many network add-ons do not yet enable [hairpin mode](https://kubernetes.io/docs/tasks/debug-application-cluster/debug-service/#a-pod-cannot-reach-itself-via-service-ip)
    which allows pods to access themselves via their Service IP if they don't know about their podIP. This is an issue
    related to [CNI](https://github.com/containernetworking/cni/issues/476). Please contact the providers of the network
    add-on providers to get timely information about whether they support hairpin mode.

1. If you are using VirtualBox (directly or via Vagrant), you will need to
   ensure that `hostname -i` returns a routable IP address (i.e. one on the
   second network interface, not the first one). By default, it doesn't do this
   and kubelet ends-up using first non-loopback network interface, which is
   usually NATed. Workaround: Modify `/etc/hosts`, take a look at this
   `Vagrantfile`[ubuntu-vagrantfile](https://github.com/errordeveloper/k8s-playground/blob/22dd39dfc06111235620e6c4404a96ae146f26fd/Vagrantfile#L11) for how this can be achieved.

1. The following error indicates a possible certificate mismatch.

```
# kubectl get po
Unable to connect to the server: x509: certificate signed by unknown authority (possibly because of "crypto/rsa: verification error" while trying to verify candidate authority certificate "kubernetes")
```

Verify that the `$HOME/.kube/config` file contains a valid certificate, and regenerate a certificate if necessary.
Another workaround is to overwrite the default `kubeconfig` for the "admin" user:

```
mv  $HOME/.kube $HOME/.kube.bak
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

1. If you are using CentOS and encounter difficulty while setting up the master node，
verify that your Docker cgroup driver matches the kubelet config:

```bash
docker info |grep -i cgroup
cat /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
```

If the Docker cgroup driver and the kubelet config don't match, change the kubelet config to match the Docker cgroup driver.

Update

```bash
KUBELET_CGROUP_ARGS=--cgroup-driver=systemd
```

To

```bash
KUBELET_CGROUP_ARGS=--cgroup-driver=cgroupfs
```

Then restart kubelet:

```bash
systemctl daemon-reload
systemctl restart kubelet
```

The `kubectl describe pod` or `kubectl logs` commands can help you diagnose errors. For example:

```bash
kubectl -n ${NAMESPACE} describe pod ${POD_NAME}

kubectl -n ${NAMESPACE} logs ${POD_NAME} -c ${CONTAINER_NAME}
```

{% endcapture %}

{% include templates/task.md %}
