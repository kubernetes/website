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

> Note: `kubefed` is an alpha feature in Kubernetes 1.5.

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

```shell
curl -O https://storage.googleapis.com/kubernetes-release/release/v1.5.0/kubernetes-client-linux-amd64.tar.gz
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

"To deploy a federation control plane on your host cluster, run
`kubefed init` command. When you use `kubefed init`, you must provide
the following:

* Federation name
* `--host-cluster-context`, the `kubeconfig` context for the host cluster
* `--dns-zone-name`, a domain name suffix for your federated services

The following example command deploys a federation control plane with
the name `fellowship`, a host cluster context `rivendell`, and the
domain suffix `example.com`:

```shell
kubefed init fellowship --host-cluster-context=rivendell  --dns-zone-name="example.com"
```

The domain suffix you specify in `--dns-zone-name` must be an existing
domain that you control, and that is programmable by your DNS provider.

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


## Adding a cluster to a federation

Once you've deployed a federation control plane, you'll need to make
that control plane aware of the clusters it should manage. You can add
a cluster to your federation by using the `kubefed join` command.

To use `kubefed join`, you'll need to provide the name of the cluster
you want to add to the federation, and the `--host-cluster-context`
for the federation control plane's host cluster.

The following example command adds the cluster `gondor` to the
federation with host cluster `rivendell`:

```
kubefed join gondor --host-cluster-context=rivendell
```

> Note: Kubernetes requires that you manually join clusters to a
federation because the federation control plane manages only those
clusters that it is responsible for managing. Adding a cluster tells
the federation control plane that it is responsible for managing that
cluster.

### Naming rules and customization

The cluster name you supply to `kubefed join` must be a valid RFC 1035
label.

Furthermore, federation control plane requires credentials of the
joined clusters to operate on them. These credentials are obtained
from the local kubeconfig. `kubefed join` uses the cluster name
specified as the argument to look for the cluster's context in the
local kubeconfig. If it fails to find a matching context, it exits
with an error.

This might cause issues in cases where context names for each cluster
in the federation don't follow RFC 1035 label naming rules. In such
cases, you can specify a cluster name that conforms to the RFC 1035
label naming rules and specify the cluster context using the
`--cluster-context` flag. For example, if context of the cluster your
are joining is `gondor_needs-no_king`, then you can
join the cluster by running:

```shell
kubefed join gondor --host-cluster-context=rivendell --cluster-context=gondor_needs-no_king
```

#### Secret name

Cluster credentials required by the federation control plane as
described above are stored as a secret in the host cluster. The name
of the secret is also derived from the cluster name.

However, the name of a secret object in Kubernetes should conform
to the subdomain name specification described in RFC 1123. If this
isn't case, you can pass the secret name to `kubefed join` using the
`--secret-name` flag. For example, if the cluster name is `noldor` and
the secret name is `11kingdom`, you can join the cluster by
running:

```shell
kubefed join noldor --host-cluster-context=rivendell --secret-name=11kingdom
```

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
