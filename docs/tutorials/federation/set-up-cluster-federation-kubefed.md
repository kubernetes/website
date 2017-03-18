---
assignees:
- madhusudancs
title: Setting up Cluster Federation with Kubefed
---

* TOC
{:toc}

Kubernetes version 1.5 includes a new command line tool called
`kubefed` to help you administrate your federated clusters.
`kubefed` helps you to deploy a new Kubernetes cluster federation
control plane, and to add clusters to or remove clusters from an
existing federation control plane.

This guide explains how to administer a Kubernetes Cluster Federation
using `kubefed`.

> Note: `kubefed` is in beta as of Kubernetes 1.6.

## Prerequisites

This guide assumes that you have a running Kubernetes cluster. Please
see one of the [getting started](/docs/getting-started-guides/) guides
for installation instructions for your platform.


## Getting `kubefed`

Download the client tarball corresponding to Kubernetes version 1.5
or later
[from the release page](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG.md),
extract the binaries in the tarball to one of the directories
in your `$PATH` and set the executable permission on those binaries.

Note: The URL in the curl command below downloads the binaries for
Linux amd64. If you are on a different platform, please use the URL
for the binaries appropriate for your platform. You can find the list
of available binaries on the [release page](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG.md#client-binaries-1).


```shell
curl -O https://storage.googleapis.com/kubernetes-release/release/{{page.version}}/kubernetes-client-linux-amd64.tar.gz
tar -xzvf kubernetes-client-linux-amd64.tar.gz
sudo cp kubernetes/client/bin/kubefed /usr/local/bin
sudo chmod +x /usr/local/bin/kubefed
sudo cp kubernetes/client/bin/kubectl /usr/local/bin
sudo chmod +x /usr/local/bin/kubectl
```


## Choosing a host cluster.

You'll need to choose one of your Kubernetes clusters to be the
*host cluster*. The host cluster hosts the components that make up
your federation control plane. Ensure that you have a `kubeconfig`
entry in your local `kubeconfig` that corresponds to the host cluster.
You can verify that you have the required `kubeconfig` entry by
running:

```shell
kubectl config get-contexts
```

The output should contain an entry corresponding to your host cluster,
similar to the following:

```
CURRENT   NAME                                          CLUSTER                                       AUTHINFO                                      NAMESPACE
          gke_myproject_asia-east1-b_gce-asia-east1     gke_myproject_asia-east1-b_gce-asia-east1     gke_myproject_asia-east1-b_gce-asia-east1
```


You'll need to provide the `kubeconfig` context (called name in the
entry above) for your host cluster when you deploy your federation
control plane.


## Deploying a federation control plane.

To deploy a federation control plane on your host cluster, run
`kubefed init` command. When you use `kubefed init`, you must provide
the following:

* Federation name
* `--host-cluster-context`, the `kubeconfig` context for the host cluster
* `--dns-provider`, one of `'google-clouddns'`, `aws-route53` or `coredns`
* `--dns-zone-name`, a domain name suffix for your federated services

If your host cluster is running in a non-cloud environment or an
environment that doesn't support common cloud primitives such as
load balancers, you might need additional flags. Please see the
[on-premises host clusters](#on-premises-host-clusters) section below.

The following example command deploys a federation control plane with
the name `fellowship`, a host cluster context `rivendell`, and the
domain suffix `example.com.`:

```shell
kubefed init fellowship \
    --host-cluster-context=rivendell \
    --dns-provider="google-clouddns" \
    --dns-zone-name="example.com."
```

The domain suffix specified in `--dns-zone-name` must be an existing
domain that you control, and that is programmable by your DNS provider.
It must also end with a trailing dot.

`kubefed init` sets up the federation control plane in the host
cluster and also adds an entry for the federation API server in your
local kubeconfig. Note that in the alpha release in Kubernetes 1.5,
`kubefed init` does not automatically set the current context to the
newly deployed federation. You can set the current context manually by
running:

```shell
kubectl config use-context fellowship
```

where `fellowship` is the name of your federation.

### Basic and token authentication support

`kubefed init` by default only generates TLS certificates and keys
to authenticate with the federation API server and writes them to
your local kubeconfig file. If you wish to enable basic authentication
or token authentication for debugging purposes, you can enable them by
passing the `--apiserver-enable-basic-auth` flag or the
`--apiserver-enable-token-auth` flag.

```shell
kubefed init fellowship \
    --host-cluster-context=rivendell \
    --dns-provider="google-clouddns" \
    --dns-zone-name="example.com." \
    --apiserver-enable-basic-auth=true \
    --apiserver-enable-token-auth=true
```

### Passing command line arguments to federation components

`kubefed init` bootstraps a federation control plane with default
arguments to federation API server and federation controller manager.
Some of these arguments are derived from `kubefed init`'s flags.
However, you can override these command line arguments by passing
them via the appropriate override flags.

You can override the federation API server arguments by passing them
to `--apiserver-arg-overrides` and override the federation controller
manager arguments by passing them to
`--controllermanager-arg-overrides`.

```shell
kubefed init fellowship \
    --host-cluster-context=rivendell \
    --dns-provider="google-clouddns" \
    --dns-zone-name="example.com." \
    --apiserver-arg-overrides="--anonymous-auth=false, --v=4" \
    --controllermanager-arg-overrides="--controllers=services=false"
```

### Configuring DNS provider

Federated service controller programs a DNS provider to expose
federated services via DNS names. Certain cloud providers
automatically provide the configuration required to program the
DNS provider if the host cluster's cloud provider is same as the DNS
provider. In all other cases, you have to provide the DNS provider
configuration to your federation controller manager which will in-turn
be passed to the federated service controller. You can provide this
configuration to federation controller manager by storing it in a file
and passing the file's local filesystem path to `kubefed init`'s
`--dns-provider-config` flag. For example, save the config below in
`$HOME/coredns-provider.conf`.

```ini
[Global]
etcd-endpoints = http://etcd-cluster.ns:2379
zones = example.com
```

And then pass this file to `kubefed init`:

```shell
kubefed init fellowship \
    --host-cluster-context=rivendell \
    --dns-provider="coredns" \
    --dns-zone-name="example.com." \
    --dns-provider-config="$HOME/coredns-provider.conf"
```

### On-premises host clusters

#### API server service type

`kubefed init` exposes the federation API server as a Kubernetes
[service](/docs/user-guide/services/) on the host cluster. By default,
this service is exposed as a
[load balanced service](/docs/user-guide/services/#type-loadbalancer).
Most on-premises and bare-metal enviroments, and some cloud
environments lack support for load balanced services. `kubefed init`
allows exposing the federation API server as a
[`NodePort` service](/docs/user-guide/services/#type-nodeport) on
such environments. This can be accomplished by passing
the `--api-server-service-type=NodePort` flag. You can also specify
the preferred address to advertise the federation API server by
passing the `--api-server-advertise-address=<IP-address>`
flag. Otherwise, one of the host cluster's node address is chosen as
the default.

```shell
kubefed init fellowship \
    --host-cluster-context=rivendell \
    --dns-provider="google-clouddns" \
    --dns-zone-name="example.com." \
    --api-server-service-type="NodePort" \
    --api-server-advertise-address="10.0.10.20"
```

#### Dynamic provisioning of [`etcd`](https://coreos.com/etcd/docs/latest/) storage

Federation control plane stores its state in
[`etcd`](https://coreos.com/etcd/docs/latest/).
[`etcd`](https://coreos.com/etcd/docs/latest/) data must be stored in
a persistent storage volume to ensure correct operation across
federation control plane restarts. On host clusters that support
[dynamic provisioning of storage volumes](/docs/user-guide/persistent-volumes/#dynamic),
`kubefed init` dynamically provisions a
[`PersistentVolume`](/docs/user-guide/persistent-volumes/#persistent-volumes)
and binds it to a
[`PersistentVolumeClaim`](/docs/user-guide/persistent-volumes/#persistentvolumeclaims)
to store [`etcd`](https://coreos.com/etcd/docs/latest/) data. If your
host cluster doesn't support dynamic provisioning, then you pass
`--etcd-persistent-storage=false` to `kubefed init` to disable
storage provisioning and provide your own
[`PersistentVolume`](/docs/user-guide/persistent-volumes/#persistent-volumes) and
[`PersistentVolumeClaim`](/docs/user-guide/persistent-volumes/#persistentvolumeclaims).

```shell
kubefed init fellowship \
    --host-cluster-context=rivendell \
    --dns-provider="google-clouddns" \
    --dns-zone-name="example.com." \
    --etcd-persistent-storage=false
```

`kubefed init` still doesn't support attaching an existing
[`PersistentVolumeClaim`](/docs/user-guide/persistent-volumes/#persistentvolumeclaims)
to the federation control plane that it bootstraps. We are planning to
support this in a future version of `kubefed`.

#### CoreDNS support

Federated services now support [CoreDNS](https://coredns.io/) as one
of the DNS providers. If you are running your clusters and federation
in an environment that does not have access to cloud-based DNS
providers, then you can run your own [CoreDNS](https://coredns.io/)
instance and publish the federated service DNS names to that server.

You can configure your federation to use
[CoreDNS](https://coredns.io/), by passing appropriate values to
`kubefed init`'s `--dns-provider` and `--dns-provider-config` flags.

```shell
kubefed init fellowship \
    --host-cluster-context=rivendell \
    --dns-provider="coredns" \
    --dns-zone-name="example.com." \
    --dns-provider-config="$HOME/coredns-provider.conf"
```

For more information see
[Setting up CoreDNS as DNS provider for Cluster Federation](/docs/tutorials/federation/set-up-coredns-provider-federation/)

## Adding a cluster to a federation

Once you've deployed a federation control plane, you'll need to make
that control plane aware of the clusters it should manage. You can add
a cluster to your federation by using the `kubefed join` command.

To use `kubefed join`, you'll need to provide the name of the cluster
you want to add to the federation, and the `--host-cluster-context`
for the federation control plane's host cluster.

> Note: The name that you provide to the `join` command is used as the
joining cluster's identity in federation. This name should adhere to
the rules described in the
[identifiers doc](/docs/user-guide/identifiers/#names). If the context
corresponding to your joining cluster conforms to these rules then you
can use the same name in the join command. Otherwise, you will have to
choose a different name for your cluster's identity. For more
information, please see the
[naming rules and customization](#naming-rules-and-customization)
section below.

The following example command adds the cluster `gondor` to the
federation running on host cluster `rivendell`:

```
kubefed join gondor --host-cluster-context=rivendell
```

> Note: Kubernetes requires that you manually join clusters to a
federation because the federation control plane manages only those
clusters that it is responsible for managing. Adding a cluster tells
the federation control plane that it is responsible for managing that
cluster.

### Naming rules and customization

The cluster name you supply to `kubefed join` must be a valid
[RFC 1035](https://www.ietf.org/rfc/rfc1035.txt) label and are
enumerated in the [Identifiers doc](/docs/user-guide/identifiers/#names).

Furthermore, federation control plane requires credentials of the
joined clusters to operate on them. These credentials are obtained
from the local kubeconfig. `kubefed join` uses the cluster name
specified as the argument to look for the cluster's context in the
local kubeconfig. If it fails to find a matching context, it exits
with an error.

This might cause issues in cases where context names for each cluster
in the federation don't follow
[RFC 1035](https://www.ietf.org/rfc/rfc1035.txt) label naming rules.
In such cases, you can specify a cluster name that conforms to the
[RFC 1035](https://www.ietf.org/rfc/rfc1035.txt) label naming rules
and specify the cluster context using the `--cluster-context` flag.
For example, if context of the cluster your are joining is
`gondor_needs-no_king`, then you can join the cluster by running:

```shell
kubefed join gondor --host-cluster-context=rivendell --cluster-context=gondor_needs-no_king
```

#### Secret name

Cluster credentials required by the federation control plane as
described above are stored as a secret in the host cluster. The name
of the secret is also derived from the cluster name.

However, the name of a secret object in Kubernetes should conform
to the DNS subdomain name specification described in
[RFC 1123](https://tools.ietf.org/html/rfc1123). If this isn't the
case, you can pass the secret name to `kubefed join` using the
`--secret-name` flag. For example, if the cluster name is `noldor` and
the secret name is `11kingdom`, you can join the cluster by
running:

```shell
kubefed join noldor --host-cluster-context=rivendell --secret-name=11kingdom
```

Note: If your cluster name does not conform to the DNS subdomain name
specification, all you need to do is supply the secret name via the
`--secret-name` flag. `kubefed join` automatically creates the secret
for you.

### `kube-dns` configuration

`kube-dns` configuration must be updated in each joining cluster to
enable federated service discovery. If the joining Kubernetes cluster
is version 1.5 or newer and your `kubefed` version 1.6 or later, then
this configuration is automatically managed for you when the clusters
are joined or unjoined using `kubefed` `join` or `unjoin` commands.

In all other cases, you must update `kube-dns` configuration manually
as described in the
[Updating KubeDNS section of the admin guide](/docs/admin/federation/)

## Removing a cluster from a federation

To remove a cluster from a federation, run the `kubefed unjoin`
command with the cluster name and the federation's
`--host-cluster-context`:

```
kubefed unjoin gondor --host-cluster-context=rivendell
```


## Turning down the federation control plane:

Proper cleanup of federation control plane is not fully implemented in
this alpha release of `kubefed`. However, for the time being, deleting
the federation system namespace should remove all the resources except
the persistent storage volume dynamically provisioned for the
federation control plane's etcd. You can delete the federation
namespace by running the following command:

```
$ kubectl delete ns federation-system
```
