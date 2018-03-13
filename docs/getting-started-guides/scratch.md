---
reviewers:
- erictune
- lavalamp
- thockin
title: Creating a Custom Cluster from Scratch
---

This guide is for people who want to craft a custom Kubernetes cluster.  If you
can find an existing Getting Started Guide that meets your needs on [this
list](/docs/setup/), then we recommend using it, as you will be able to benefit
from the experience of others.  However, if you have specific IaaS, networking,
configuration management, or operating system requirements not met by any of
those guides, then this guide will provide an outline of the steps you need to
take.  Note that it requires considerably more effort than using one of the
pre-defined guides.

This guide is also useful for those wanting to understand at a high level some of the
steps that existing cluster setup scripts are making.

* TOC
{:toc}

## Designing and Preparing

### Learning

  1. You should be familiar with using Kubernetes already.  We suggest you set
    up a temporary cluster by following one of the other Getting Started Guides.
    This will help you become familiar with the CLI ([kubectl](/docs/user-guide/kubectl/)) and concepts ([pods](/docs/user-guide/pods/), [services](/docs/concepts/services-networking/service/), etc.) first.
  1. You should have `kubectl` installed on your desktop.  This will happen as a side
    effect of completing one of the other Getting Started Guides.  If not, follow the instructions
    [here](/docs/tasks/kubectl/install/).

### Cloud Provider

Kubernetes has the concept of a Cloud Provider, which is a module which provides
an interface for managing TCP Load Balancers, Nodes (Instances) and Networking Routes.
The interface is defined in `pkg/cloudprovider/cloud.go`.  It is possible to
create a custom cluster without implementing a cloud provider (for example if using
bare-metal), and not all parts of the interface need to be implemented, depending
on how flags are set on various components.

### Nodes

- You can use virtual or physical machines.
- While you can build a cluster with 1 machine, in order to run all the examples and tests you
  need at least 4 nodes.
- Many Getting-started-guides make a distinction between the master node and regular nodes.  This
  is not strictly necessary.
- Nodes will need to run some version of Linux with the x86_64 architecture.  It may be possible
  to run on other OSes and Architectures, but this guide does not try to assist with that.
- Apiserver and etcd together are fine on a machine with 1 core and 1GB RAM for clusters with 10s of nodes.
  Larger or more active clusters may benefit from more cores.
- Other nodes can have any reasonable amount of memory and any number of cores.  They need not
  have identical configurations.

### Network

#### Network Connectivity
Kubernetes has a distinctive [networking model](/docs/concepts/cluster-administration/networking/).

Kubernetes allocates an IP address to each pod.  When creating a cluster, you
need to allocate a block of IPs for Kubernetes to use as Pod IPs.  The simplest
approach is to allocate a different block of IPs to each node in the cluster as
the node is added.  A process in one pod should be able to communicate with
another pod using the IP of the second pod.  This connectivity can be
accomplished in two ways:

- **Using an overlay network**
  - An overlay network obscures the underlying network architecture from the
    pod network through traffic encapsulation (for example vxlan).
  - Encapsulation reduces performance, though exactly how much depends on your solution.
- **Without an overlay network**
  - Configure the underlying network fabric (switches, routers, etc.) to be aware of pod IP addresses.
  - This does not require the encapsulation provided by an overlay, and so can achieve
    better performance.

Which method you choose depends on your environment and requirements.  There are various ways
to implement one of the above options:

- **Use a network plugin which is called by Kubernetes**
  - Kubernetes supports the [CNI](https://github.com/containernetworking/cni) network plugin interface.
  - There are a number of solutions which provide plugins for Kubernetes (listed alphabetically):
    - [Calico](http://docs.projectcalico.org/)
    - [Flannel](https://github.com/coreos/flannel)
    - [Open vSwitch (OVS)](http://openvswitch.org/)
    - [Romana](http://romana.io/)
    - [Weave](http://weave.works/)
    - [More found here](/docs/admin/networking#how-to-achieve-this/)
  - You can also write your own.
- **Compile support directly into Kubernetes**
  - This can be done by implementing the "Routes" interface of a Cloud Provider module.
  - The Google Compute Engine ([GCE](/docs/getting-started-guides/gce/)) and [AWS](/docs/getting-started-guides/aws/) guides use this approach.
- **Configure the network external to Kubernetes**
  - This can be done by manually running commands, or through a set of externally maintained scripts.
  - You have to implement this yourself, but it can give you an extra degree of flexibility.

You will need to select an address range for the Pod IPs.

- Various approaches:
  - GCE: each project has its own `10.0.0.0/8`.  Carve off a `/16` for each
    Kubernetes cluster from that space, which leaves room for several clusters.
    Each node gets a further subdivision of this space.
  - AWS: use one VPC for whole organization, carve off a chunk for each
    cluster, or use different VPC for different clusters.
- Allocate one CIDR subnet for each node's PodIPs, or a single large CIDR
  from which smaller CIDRs are automatically allocated to each node.
  - You need max-pods-per-node * max-number-of-nodes IPs in total. A `/24` per
    node supports 254 pods per machine and is a common choice.  If IPs are
    scarce, a `/26` (62 pods per machine) or even a `/27` (30 pods) may be sufficient.
  - For example, use `10.10.0.0/16` as the range for the cluster, with up to 256 nodes
    using `10.10.0.0/24` through `10.10.255.0/24`, respectively.
  - Need to make these routable or connect with overlay.

Kubernetes also allocates an IP to each [service](/docs/concepts/services-networking/service/).  However,
service IPs do not necessarily need to be routable.  The kube-proxy takes care
of translating Service IPs to Pod IPs before traffic leaves the node.  You do
need to allocate a block of IPs for services.  Call this
`SERVICE_CLUSTER_IP_RANGE`.  For example, you could set
`SERVICE_CLUSTER_IP_RANGE="10.0.0.0/16"`, allowing 65534 distinct services to
be active at once.  Note that you can grow the end of this range, but you
cannot move it without disrupting the services and pods that already use it.

Also, you need to pick a static IP for master node.

- Call this `MASTER_IP`.
- Open any firewalls to allow access to the apiserver ports 80 and/or 443.
- Enable ipv4 forwarding sysctl, `net.ipv4.ip_forward = 1`

#### Network Policy

Kubernetes enables the definition of fine-grained network policy between Pods using the [NetworkPolicy](/docs/concepts/services-networking/network-policies/) resource.

Not all networking providers support the Kubernetes NetworkPolicy API, see [Using Network Policy](/docs/tasks/configure-pod-container/declare-network-policy/) for more information.

### Cluster Naming

You should pick a name for your cluster.  Pick a short name for each cluster
which is unique from future cluster names. This will be used in several ways:

  - by kubectl to distinguish between various clusters you have access to.  You will probably want a
    second one sometime later, such as for testing new Kubernetes releases, running in a different
region of the world, etc.
  - Kubernetes clusters can create cloud provider resources (for example, AWS ELBs) and different clusters
    need to distinguish which resources each created.  Call this `CLUSTER_NAME`.

### Software Binaries

You will need binaries for:

  - etcd
  - A container runner, one of:
    - docker
    - rkt
  - Kubernetes
    - kubelet
    - kube-proxy
    - kube-apiserver
    - kube-controller-manager
    - kube-scheduler

#### Downloading and Extracting Kubernetes Binaries

A Kubernetes binary release includes all the Kubernetes binaries as well as the supported release of etcd.
You can use a Kubernetes binary release (recommended) or build your Kubernetes binaries following the instructions in the
[Developer Documentation](https://git.k8s.io/community/contributors/devel/).  Only using a binary release is covered in this guide.

Download the [latest binary release](https://github.com/kubernetes/kubernetes/releases/latest) and unzip it.
Server binary tarballs are no longer included in the Kubernetes final tarball, so you will need to locate and run
`./kubernetes/cluster/get-kube-binaries.sh` to download the client and server binaries.
Then locate `./kubernetes/server/kubernetes-server-linux-amd64.tar.gz` and unzip *that*.
Then, within the second set of unzipped files, locate `./kubernetes/server/bin`, which contains
all the necessary binaries.

#### Selecting Images

You will run docker, kubelet, and kube-proxy outside of a container, the same way you would run any system daemon, so
you just need the bare binaries.  For etcd, kube-apiserver, kube-controller-manager, and kube-scheduler,
we recommend that you run these as containers, so you need an image to be built.

You have several choices for Kubernetes images:

- Use images hosted on Google Container Registry (GCR):
  - For example `gcr.io/google-containers/hyperkube:$TAG`, where `TAG` is the latest
    release tag, which can be found on the [latest releases page](https://github.com/kubernetes/kubernetes/releases/latest).
  - Ensure $TAG is the same tag as the release tag you are using for kubelet and kube-proxy.
  - The [hyperkube](https://releases.k8s.io/{{page.githubbranch}}/cmd/hyperkube) binary is an all in one binary
    - `hyperkube kubelet ...` runs the kubelet, `hyperkube apiserver ...` runs an apiserver, etc.
- Build your own images.
  - Useful if you are using a private registry.
  - The release contains files such as `./kubernetes/server/bin/kube-apiserver.tar` which
    can be converted into docker images using a command like
    `docker load -i kube-apiserver.tar`
  - You can verify if the image is loaded successfully with the right repository and tag using
    command like `docker images`

For etcd, you can:

- Use images hosted on Google Container Registry (GCR), such as `gcr.io/google-containers/etcd:2.2.1`
- Use images hosted on [Docker Hub](https://hub.docker.com/search/?q=etcd) or [Quay.io](https://quay.io/repository/coreos/etcd), such as `quay.io/coreos/etcd:v2.2.1`
- Use etcd binary included in your OS distro.
- Build your own image
  - You can do: `cd kubernetes/cluster/images/etcd; make`

We recommend that you use the etcd version which is provided in the Kubernetes binary distribution.   The Kubernetes binaries in the release
were tested extensively with this version of etcd and not with any other version.
The recommended version number can also be found as the value of `TAG` in `kubernetes/cluster/images/etcd/Makefile`.

The remainder of the document assumes that the image identifiers have been chosen and stored in corresponding env vars.  Examples (replace with latest tags and appropriate registry):

  - `HYPERKUBE_IMAGE=gcr.io/google-containers/hyperkube:$TAG`
  - `ETCD_IMAGE=gcr.io/google-containers/etcd:$ETCD_VERSION`

### Security Models

There are two main options for security:

- Access the apiserver using HTTP.
  - Use a firewall for security.
  - This is easier to setup.
- Access the apiserver using HTTPS
  - Use https with certs, and credentials for user.
  - This is the recommended approach.
  - Configuring certs can be tricky.

If following the HTTPS approach, you will need to prepare certs and credentials.

#### Preparing Certs

You need to prepare several certs:

- The master needs a cert to act as an HTTPS server.
- The kubelets optionally need certs to identify themselves as clients of the master, and when
  serving its own API over HTTPS.

Unless you plan to have a real CA generate your certs, you will need
to generate a root cert and use that to sign the master, kubelet, and
kubectl certs. How to do this is described in the [authentication
documentation](/docs/admin/authentication/#creating-certificates/).

You will end up with the following files (we will use these variables later on)

- `CA_CERT`
  - put in on node where apiserver runs, for example in `/srv/kubernetes/ca.crt`.
- `MASTER_CERT`
  - signed by CA_CERT
  - put in on node where apiserver runs, for example in `/srv/kubernetes/server.crt`
- `MASTER_KEY `
  - put in on node where apiserver runs, for example in `/srv/kubernetes/server.key`
- `KUBELET_CERT`
  - optional
- `KUBELET_KEY`
  - optional

#### Preparing Credentials

The admin user (and any users) need:

  - a token or a password to identify them.
  - tokens are just long alphanumeric strings, 32 chars for example. See
    - `TOKEN=$(dd if=/dev/urandom bs=128 count=1 2>/dev/null | base64 | tr -d "=+/" | dd bs=32 count=1 2>/dev/null)`

Your tokens and passwords need to be stored in a file for the apiserver
to read.  This guide uses `/var/lib/kube-apiserver/known_tokens.csv`.
The format for this file is described in the [authentication documentation](/docs/admin/authentication/).

For distributing credentials to clients, the convention in Kubernetes is to put the credentials
into a [kubeconfig file](/docs/concepts/cluster-administration/authenticate-across-clusters-kubeconfig/).

The kubeconfig file for the administrator can be created as follows:

 - If you have already used Kubernetes with a non-custom cluster (for example, used a Getting Started
   Guide), you will already have a `$HOME/.kube/config` file.
 - You need to add certs, keys, and the master IP to the kubeconfig file:
    - If using the firewall-only security option, set the apiserver this way:
      - `kubectl config set-cluster $CLUSTER_NAME --server=http://$MASTER_IP --insecure-skip-tls-verify=true`
    - Otherwise, do this to set the apiserver ip, client certs, and user credentials.
      - `kubectl config set-cluster $CLUSTER_NAME --certificate-authority=$CA_CERT --embed-certs=true --server=https://$MASTER_IP`
      - `kubectl config set-credentials $USER --client-certificate=$CLI_CERT --client-key=$CLI_KEY --embed-certs=true --token=$TOKEN`
    - Set your cluster as the default cluster to use:
      - `kubectl config set-context $CONTEXT_NAME --cluster=$CLUSTER_NAME --user=$USER`
      - `kubectl config use-context $CONTEXT_NAME`

Next, make a kubeconfig file for the kubelets and kube-proxy.  There are a couple of options for how
many distinct files to make:

  1. Use the same credential as the admin
    - This is simplest to setup.
  1. One token and kubeconfig file for all kubelets, one for all kube-proxy, one for admin.
    - This mirrors what is done on GCE today
  1. Different credentials for every kubelet, etc.
    - We are working on this but all the pieces are not ready yet.

You can make the files by copying the `$HOME/.kube/config` or by using the following template:

```yaml
apiVersion: v1
kind: Config
users:
- name: kubelet
  user:
    token: ${KUBELET_TOKEN}
clusters:
- name: local
  cluster:
    certificate-authority: /srv/kubernetes/ca.crt
contexts:
- context:
    cluster: local
    user: kubelet
  name: service-account-context
current-context: service-account-context
```

Put the kubeconfig(s) on every node.  The examples later in this
guide assume that there are kubeconfigs in `/var/lib/kube-proxy/kubeconfig` and
`/var/lib/kubelet/kubeconfig`.

## Configuring and Installing Base Software on Nodes

This section discusses how to configure machines to be Kubernetes nodes.

You should run three daemons on every node:

  - docker or rkt
  - kubelet
  - kube-proxy

You will also need to do assorted other configuration on top of a
base OS install.

Tip: One possible starting point is to setup a cluster using an existing Getting
Started Guide.   After getting a cluster running, you can then copy the init.d scripts or systemd unit files from that
cluster, and then modify them for use on your custom cluster.

### Docker

The minimum required Docker version will vary as the kubelet version changes.  The newest stable release is a good choice.  Kubelet will log a warning and refuse to start pods if the version is too old, so pick a version and try it.

If you previously had Docker installed on a node without setting Kubernetes-specific
options, you may have a Docker-created bridge and iptables rules.  You may want to remove these
as follows before proceeding to configure Docker for Kubernetes.

```shell
iptables -t nat -F
ip link set docker0 down
ip link delete docker0
```

The way you configure docker will depend in whether you have chosen the routable-vip or overlay-network approaches for your network.
Some suggested docker options:

  - create your own bridge for the per-node CIDR ranges, call it cbr0, and set `--bridge=cbr0` option on docker.
  - set `--iptables=false` so docker will not manipulate iptables for host-ports (too coarse on older docker versions, may be fixed in newer versions)
so that kube-proxy can manage iptables instead of docker.
  - `--ip-masq=false`
    - if you have setup PodIPs to be routable, then you want this false, otherwise, docker will
      rewrite the PodIP source-address to a NodeIP.
    - some environments (for example GCE) still need you to masquerade out-bound traffic when it leaves the cloud environment. This is very environment specific.
    - if you are using an overlay network, consult those instructions.
  - `--mtu=`
    - may be required when using Flannel, because of the extra packet size due to udp encapsulation
  - `--insecure-registry $CLUSTER_SUBNET`
    - to connect to a private registry, if you set one up, without using SSL.

You may want to increase the number of open files for docker:

   - `DOCKER_NOFILE=1000000`

Where this config goes depends on your node OS.  For example, GCE's Debian-based distro uses `/etc/default/docker`.

Ensure docker is working correctly on your system before proceeding with the rest of the
installation, by following examples given in the Docker documentation.

### rkt

[rkt](https://github.com/coreos/rkt) is an alternative to Docker.  You only need to install one of Docker or rkt.
The minimum version required is [v0.5.6](https://github.com/coreos/rkt/releases/tag/v0.5.6).

[systemd](http://www.freedesktop.org/wiki/Software/systemd/) is required on your node to run rkt.  The
minimum version required to match rkt v0.5.6 is
[systemd 215](http://lists.freedesktop.org/archives/systemd-devel/2014-July/020903.html).

[rkt metadata service](https://github.com/coreos/rkt/blob/master/Documentation/networking/overview.md) is also required
for rkt networking support.  You can start rkt metadata service by using command like
`sudo systemd-run rkt metadata-service`

Then you need to configure your kubelet with flag:

  - `--container-runtime=rkt`

### kubelet

All nodes should run kubelet.  See [Software Binaries](#software-binaries).

Arguments to consider:

  - If following the HTTPS security approach:
    - `--kubeconfig=/var/lib/kubelet/kubeconfig`
  - Otherwise, if taking the firewall-based security approach
  - `--config=/etc/kubernetes/manifests`
  - `--cluster-dns=` to the address of the DNS server you will setup (see [Starting Cluster Services](#starting-cluster-services).)
  - `--cluster-domain=` to the dns domain prefix to use for cluster DNS addresses.
  - `--docker-root=`
  - `--root-dir=`
  - `--pod-cidr=` The CIDR to use for pod IP addresses, only used in standalone mode.  In cluster mode, this is obtained from the master.
  - `--register-node` (described in [Node](/docs/admin/node/) documentation.)

### kube-proxy

All nodes should run kube-proxy.  (Running kube-proxy on a "master" node is not
strictly required, but being consistent is easier.)   Obtain a binary as described for
kubelet.

Arguments to consider:

  - If following the HTTPS security approach:
    - `--master=https://$MASTER_IP`
    - `--kubeconfig=/var/lib/kube-proxy/kubeconfig`
  - Otherwise, if taking the firewall-based security approach
    - `--master=http://$MASTER_IP`

Note that on some Linux platforms, you may need to manually install the
`conntrack` package which is a dependency of kube-proxy, or else kube-proxy
cannot be started successfully.

For more details on debugging kube-proxy problems, please refer to
[Debug Services](/docs/tasks/debug-application-cluster/debug-service/)

### Networking

Each node needs to be allocated its own CIDR range for pod networking.
Call this `NODE_X_POD_CIDR`.

A bridge called `cbr0` needs to be created on each node.  The bridge is explained
further in the [networking documentation](/docs/concepts/cluster-administration/networking/).  The bridge itself
needs an address from `$NODE_X_POD_CIDR` - by convention the first IP.  Call
this `NODE_X_BRIDGE_ADDR`.  For example, if `NODE_X_POD_CIDR` is `10.0.0.0/16`,
then `NODE_X_BRIDGE_ADDR` is `10.0.0.1/16`.  NOTE: this retains the `/16` suffix
because of how this is used later.

If you have turned off Docker's IP masquerading to allow pods to talk to each
other, then you may need to do masquerading just for destination IPs outside
the cluster network.  For example:

```shell
iptables -t nat -A POSTROUTING ! -d ${CLUSTER_SUBNET} -m addrtype ! --dst-type LOCAL -j MASQUERADE
```

This will rewrite the source address from
the PodIP to the Node IP for traffic bound outside the cluster, and kernel
[connection tracking](http://www.iptables.info/en/connection-state.html)
will ensure that responses destined to the node still reach
the pod.

NOTE: This is environment specific.  Some environments will not need
any masquerading at all.  Others, such as GCE, will not allow pod IPs to send
traffic to the internet, but have no problem with them inside your GCE Project.

### Other

- Enable auto-upgrades for your OS package manager, if desired.
- Configure log rotation for all node components (for example using [logrotate](http://linux.die.net/man/8/logrotate)).
- Setup liveness-monitoring (for example using [supervisord](http://supervisord.org/)).
- Setup volume plugin support (optional)
  - Install any client binaries for optional volume types, such as `glusterfs-client` for GlusterFS
    volumes.

### Using Configuration Management

The previous steps all involved "conventional" system administration techniques for setting up
machines.  You may want to use a Configuration Management system to automate the node configuration
process.  There are examples of [Saltstack](/docs/admin/salt/), Ansible, Juju, and CoreOS Cloud Config in the
various Getting Started Guides.

## Bootstrapping the Cluster

While the basic node services (kubelet, kube-proxy, docker) are typically started and managed using
traditional system administration/automation approaches, the remaining *master* components of Kubernetes are
all configured and managed *by Kubernetes*:

  - Their options are specified in a Pod spec (yaml or json) rather than an /etc/init.d file or
    systemd unit.
  - They are kept running by Kubernetes rather than by init.

### etcd

You will need to run one or more instances of etcd.

  - Highly available and easy to restore - Run 3 or 5 etcd instances with, their logs written to a directory backed
    by durable storage (RAID, GCE PD)
  - Not highly available, but easy to restore - Run one etcd instance, with its log written to a directory backed
    by durable storage (RAID, GCE PD).
    
    **Note:** May result in operations outages in case of instance outage.
    {: .note}
  - Highly available - Run 3 or 5 etcd instances with non durable storage.
  
    **Note:** Log can be written to non-durable storage because storage is replicated.
    {: .note}
 See [cluster-troubleshooting](/docs/admin/cluster-troubleshooting/) for more discussion on factors affecting cluster
availability.

To run an etcd instance:

1. Copy [`cluster/gce/manifests/etcd.manifest`](https://github.com/kubernetes/kubernetes/blob/master/cluster/gce/manifests/etcd.manifest)
1. Make any modifications needed
1. Start the pod by putting it into the kubelet manifest directory

### Apiserver, Controller Manager, and Scheduler

The apiserver, controller manager, and scheduler will each run as a pod on the master node.

For each of these components, the steps to start them running are similar:

1. Start with a provided template for a pod.
1. Set the `HYPERKUBE_IMAGE` to the values chosen in [Selecting Images](#selecting-images).
1. Determine which flags are needed for your cluster, using the advice below each template.
1. Set the flags to be individual strings in the command array (for example $ARGN below)
1. Start the pod by putting the completed template into the kubelet manifest directory.
1. Verify that the pod is started.

#### Apiserver pod template

```json
{
  "kind": "Pod",
  "apiVersion": "v1",
  "metadata": {
    "name": "kube-apiserver"
  },
  "spec": {
    "hostNetwork": true,
    "containers": [
      {
        "name": "kube-apiserver",
        "image": "${HYPERKUBE_IMAGE}",
        "command": [
          "/hyperkube",
          "apiserver",
          "$ARG1",
          "$ARG2",
          ...
          "$ARGN"
        ],
        "ports": [
          {
            "name": "https",
            "hostPort": 443,
            "containerPort": 443
          },
          {
            "name": "local",
            "hostPort": 8080,
            "containerPort": 8080
          }
        ],
        "volumeMounts": [
          {
            "name": "srvkube",
            "mountPath": "/srv/kubernetes",
            "readOnly": true
          },
          {
            "name": "etcssl",
            "mountPath": "/etc/ssl",
            "readOnly": true
          }
        ],
        "livenessProbe": {
          "httpGet": {
            "scheme": "HTTP",
            "host": "127.0.0.1",
            "port": 8080,
            "path": "/healthz"
          },
          "initialDelaySeconds": 15,
          "timeoutSeconds": 15
        }
      }
    ],
    "volumes": [
      {
        "name": "srvkube",
        "hostPath": {
          "path": "/srv/kubernetes"
        }
      },
      {
        "name": "etcssl",
        "hostPath": {
          "path": "/etc/ssl"
        }
      }
    ]
  }
}
```

Here are some apiserver flags you may need to set:

- `--cloud-provider=` see [cloud providers](#cloud-providers)
- `--cloud-config=` see [cloud providers](#cloud-providers)
- `--address=${MASTER_IP}` *or* `--bind-address=127.0.0.1` and `--address=127.0.0.1` if you want to run a proxy on the master node.
- `--service-cluster-ip-range=$SERVICE_CLUSTER_IP_RANGE`
- `--etcd-servers=http://127.0.0.1:4001`
- `--tls-cert-file=/srv/kubernetes/server.cert`
- `--tls-private-key-file=/srv/kubernetes/server.key`
- `--enable-admission-plugins=$RECOMMENDED_LIST`
  - See [admission controllers](/docs/admin/admission-controllers/) for recommended arguments.
- `--allow-privileged=true`, only if you trust your cluster user to run pods as root.

If you are following the firewall-only security approach, then use these arguments:

- `--token-auth-file=/dev/null`
- `--insecure-bind-address=$MASTER_IP`
- `--advertise-address=$MASTER_IP`

If you are using the HTTPS approach, then set:

- `--client-ca-file=/srv/kubernetes/ca.crt`
- `--token-auth-file=/srv/kubernetes/known_tokens.csv`
- `--basic-auth-file=/srv/kubernetes/basic_auth.csv`

This pod mounts several node file system directories using the  `hostPath` volumes.  Their purposes are:

- The `/etc/ssl` mount allows the apiserver to find the SSL root certs so it can
  authenticate external services, such as a cloud provider.
  - This is not required if you do not use a cloud provider (bare-metal for example).
- The `/srv/kubernetes` mount allows the apiserver to read certs and credentials stored on the
  node disk.  These could instead be stored on a persistent disk, such as a GCE PD, or baked into the image.
- Optionally, you may want to mount `/var/log` as well and redirect output there (not shown in template).
  - Do this if you prefer your logs to be accessible from the root filesystem with tools like journalctl.

*TODO* document proxy-ssh setup.

##### Cloud Providers

Apiserver supports several cloud providers.

- options for `--cloud-provider` flag are `aws`, `azure`, `cloudstack`, `fake`, `gce`, `mesos`, `openstack`, `ovirt`, `photon`, `rackspace`, `vsphere`, or unset.
- unset used for bare metal setups.
- support for new IaaS is added by contributing code [here](https://releases.k8s.io/{{page.githubbranch}}/pkg/cloudprovider/providers)

Some cloud providers require a config file. If so, you need to put config file into apiserver image or mount through hostPath.

- `--cloud-config=` set if cloud provider requires a config file.
- Used by `aws`, `gce`, `mesos`, `openstack`, `ovirt` and `rackspace`.
- You must put config file into apiserver image or mount through hostPath.
- Cloud config file syntax is [Gcfg](https://code.google.com/p/gcfg/).
- AWS format defined by type [AWSCloudConfig](https://releases.k8s.io/{{page.githubbranch}}/pkg/cloudprovider/providers/aws/aws.go)
- There is a similar type in the corresponding file for other cloud providers.

#### Scheduler pod template

Complete this template for the scheduler pod:

```json
{
  "kind": "Pod",
  "apiVersion": "v1",
  "metadata": {
    "name": "kube-scheduler"
  },
  "spec": {
    "hostNetwork": true,
    "containers": [
      {
        "name": "kube-scheduler",
        "image": "$HYPERKUBE_IMAGE",
        "command": [
          "/hyperkube",
          "scheduler",
          "--master=127.0.0.1:8080",
          "$SCHEDULER_FLAG1",
          ...
          "$SCHEDULER_FLAGN"
        ],
        "livenessProbe": {
          "httpGet": {
            "scheme": "HTTP",
            "host": "127.0.0.1",
            "port": 10251,
            "path": "/healthz"
          },
          "initialDelaySeconds": 15,
          "timeoutSeconds": 15
        }
      }
    ]
  }
}
```

Typically, no additional flags are required for the scheduler.

Optionally, you may want to mount `/var/log` as well and redirect output there.

#### Controller Manager Template

Template for controller manager pod:

```json
{
  "kind": "Pod",
  "apiVersion": "v1",
  "metadata": {
    "name": "kube-controller-manager"
  },
  "spec": {
    "hostNetwork": true,
    "containers": [
      {
        "name": "kube-controller-manager",
        "image": "$HYPERKUBE_IMAGE",
        "command": [
          "/hyperkube",
          "controller-manager",
          "$CNTRLMNGR_FLAG1",
          ...
          "$CNTRLMNGR_FLAGN"
        ],
        "volumeMounts": [
          {
            "name": "srvkube",
            "mountPath": "/srv/kubernetes",
            "readOnly": true
          },
          {
            "name": "etcssl",
            "mountPath": "/etc/ssl",
            "readOnly": true
          }
        ],
        "livenessProbe": {
          "httpGet": {
            "scheme": "HTTP",
            "host": "127.0.0.1",
            "port": 10252,
            "path": "/healthz"
          },
          "initialDelaySeconds": 15,
          "timeoutSeconds": 15
        }
      }
    ],
    "volumes": [
      {
        "name": "srvkube",
        "hostPath": {
          "path": "/srv/kubernetes"
        }
      },
      {
        "name": "etcssl",
        "hostPath": {
          "path": "/etc/ssl"
        }
      }
    ]
  }
}
```

Flags to consider using with controller manager:

 - `--cluster-cidr=`, the CIDR range for pods in cluster.
 - `--allocate-node-cidrs=`, if you are using `--cloud-provider=`, allocate and set the CIDRs for pods on the cloud provider.
 - `--cloud-provider=` and `--cloud-config` as described in apiserver section.
 - `--service-account-private-key-file=/srv/kubernetes/server.key`, used by the [service account](/docs/user-guide/service-accounts) feature.
 - `--master=127.0.0.1:8080`

#### Starting and Verifying Apiserver, Scheduler, and Controller Manager

Place each completed pod template into the kubelet config dir
(whatever `--config=` argument of kubelet is set to, typically
`/etc/kubernetes/manifests`).  The order does not matter: scheduler and
controller manager will retry reaching the apiserver until it is up.

Use `ps` or `docker ps` to verify that each process has started.  For example, verify that kubelet has started a container for the apiserver like this:

```shell
$ sudo docker ps | grep apiserver
5783290746d5        gcr.io/google-containers/kube-apiserver:e36bf367342b5a80d7467fd7611ad873            "/bin/sh -c '/usr/lo'"    10 seconds ago      Up 9 seconds                              k8s_kube-apiserver.feb145e7_kube-apiserver-kubernetes-master_default_eaebc600cf80dae59902b44225f2fc0a_225a4695
```

Then try to connect to the apiserver:

```shell
$ echo $(curl -s http://localhost:8080/healthz)
ok
$ curl -s http://localhost:8080/api
{
  "versions": [
    "v1"
  ]
}
```

If you have selected the `--register-node=true` option for kubelets, they will now begin self-registering with the apiserver.
You should soon be able to see all your nodes by running the `kubectl get nodes` command.
Otherwise, you will need to manually create node objects.

### Starting Cluster Services

You will want to complete your Kubernetes clusters by adding cluster-wide
services.  These are sometimes called *addons*, and [an overview
of their purpose is in the admin guide](/docs/admin/cluster-components/#addons).

Notes for setting up each cluster service are given below:

* Cluster DNS:
  * Required for many Kubernetes examples
  * [Setup instructions](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/dns/)
  * [Admin Guide](/docs/concepts/services-networking/dns-pod-service/)
* Cluster-level Logging
  * [Cluster-level Logging Overview](/docs/user-guide/logging/overview/)
  * [Cluster-level Logging with Elasticsearch](/docs/user-guide/logging/elasticsearch/)
  * [Cluster-level Logging with Stackdriver Logging](/docs/user-guide/logging/stackdriver/)
* Container Resource Monitoring
  * [Setup instructions](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/cluster-monitoring/)
* GUI
  * [Setup instructions](https://github.com/kubernetes/dashboard)

## Troubleshooting

### Running validate-cluster

`cluster/validate-cluster.sh` is used by `cluster/kube-up.sh` to determine if
the cluster start succeeded.

Example usage and output:

```shell
KUBECTL_PATH=$(which kubectl) NUM_NODES=3 KUBERNETES_PROVIDER=local cluster/validate-cluster.sh
Found 3 node(s).
NAME                    STATUS    AGE     VERSION
node1.local             Ready     1h      v1.6.9+a3d1dfa6f4335
node2.local             Ready     1h      v1.6.9+a3d1dfa6f4335
node3.local             Ready     1h      v1.6.9+a3d1dfa6f4335
Validate output:
NAME                 STATUS    MESSAGE              ERROR
controller-manager   Healthy   ok
scheduler            Healthy   ok
etcd-1               Healthy   {"health": "true"}
etcd-2               Healthy   {"health": "true"}
etcd-0               Healthy   {"health": "true"}
Cluster validation succeeded
```

### Inspect pods and services

Try to run through the "Inspect your cluster" section in one of the other Getting Started Guides, such as [GCE](/docs/getting-started-guides/gce/#inspect-your-cluster).
You should see some services.  You should also see "mirror pods" for the apiserver, scheduler and controller-manager, plus any add-ons you started.

### Try Examples

At this point you should be able to run through one of the basic examples, such as the [nginx example](/docs/tutorials/stateless-application/deployment.yaml).

### Running the Conformance Test

You may want to try to run the [Conformance test](http://releases.k8s.io/{{page.githubbranch}}/test/e2e_node/conformance/run_test.sh).  Any failures may give a hint as to areas that need more attention.

### Networking

The nodes must be able to connect to each other using their private IP. Verify this by
pinging or SSH-ing from one node to another.

### Getting Help

If you run into trouble, please see the section on [troubleshooting](/docs/getting-started-guides/gce/#troubleshooting), post to the
[kubernetes-users group](https://groups.google.com/forum/#!forum/kubernetes-users), or come ask questions on [Slack](/docs/troubleshooting#slack).

## Support Level


IaaS Provider        | Config. Mgmt | OS     | Networking  | Docs                                              | Conforms | Support Level
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
any                  | any          | any    | any         | [docs](/docs/getting-started-guides/scratch/)                                |          | Community ([@erictune](https://github.com/erictune))


For support level information on all solutions, see the [Table of solutions](/docs/getting-started-guides/#table-of-solutions/) chart.
