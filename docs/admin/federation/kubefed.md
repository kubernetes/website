---
assignees:
- madhusudancs

---
Kubernetes v1.5 introduced a new command line tool called `kubefed`
to facilitate the administration of cluster federations. `kubefed`
stands for "Kubernetes Federate". It aids in both deploying a
Kubernetes Cluster Federation control plane and adding/removing
clusters from it. 

This guide explains how to administer a Kubernetes Cluster Federation
using `kubefed`.

`kubefed` is considered alpha in Kubernetes v1.5.

* TOC
{:toc}

## Prerequisites

This guide assumes that you have a running Kubernetes cluster. Please
see one of the [getting started](/docs/getting-started-guides/) guides
for installation instructions for your platform.

## Getting `kubefed`

Download the Kubernetes client tarball corresponding to a release
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

Choose one of your Kubernetes clusters as a cluster where you want to
host the federation control plane components. We refer to this cluster
as a "host cluster" henceforth. Ensure that you have a kubeconfig entry
in your local kubeconfig corresponding to this cluster. You can verify
this by running:

```shell
kubectl config get-contexts
```

and ensuring that there is a context corresponding to your host
cluster.

Please also make a note of this context because you will need it next.


## Deploying a federation control plane.

Deploying a federation control plane on your host cluster is as simple
as running:

```shell
kubefed init fellowship --host-cluster-context=rivendell  --dns-zone-name="example.com"
```

where `fellowship` is the name of the federation, `rivendell` is the
host cluster context from the previous step and `example.com` is the
domain name suffix that you want for your federated services. This has
to be a real domain that you control over and is programmable by your
DNS provider.

`kubefed init` sets up the federation control plane in the host
cluster and also adds an entry for the federation API server in your
local kubeconfig. However, in this alpha release it does not
automatically set the current context to the newly deployed federation.
You can set this by running:

```shell
kubectl config use-context fellowship
```

where `fellowship` is the name of your federation.

## Joining a cluster

Cluster Federation allows you to manage your workload across multiple
clusters. In order to do that, a federation control plane must be
aware of the clusters that it is responsible for managing. You can
teach the federation control plane about a cluster by joining that
cluster to the federation.

To join a cluster to a federation run:

```
kubfed join gondor --host-cluster-context=rivendell
```

where `gondor` is the name of the cluster you are joining and
`rivendell` is the federation control plane's host cluster.

### Naming rules and customization

#### Cluster name

Cluster name supplied to `kubefed join` must be a valid RFC 1035 label.

Furthermore, federation control plane requires credentials of the
joined clusters to operate on them. These credentials are obtained
from the local kubeconfig. `kubefed join` uses the cluster name
specified as the argument to look for the cluster's context in the
local kubeconfig. If it fails to find a matching context, it exits
with an error.

It is particularly a problem in the cases where context names
for the clusters don't follow RFC 1035 label naming rules. In these
cases, you could specify a cluster name that conforms to the RFC 1035
label naming rules and specify the cluster context using the
`--cluster-context` flag. For example, if context of the cluster your
are joining is `gondor_needs-no_king`, then you can
join the cluster by running:

```shell
kubfed join gondor --host-cluster-context=rivendell --cluster-context=gondor_needs-no_king
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
kubfed join noldor --host-cluster-context=rivendell --secret-name=11kingdom
```

## Unjoining a cluster:

Unjoining a cluster from federation is as simple as running:

```
kubfed unjoin gondor --host-cluster-context=rivendell
```

where `gondor` is the cluster name you specified while joining the
cluster and `rivendell` is the federation control plane's host cluster.

## Turning down the federation control plane:

Proper cleanup of federation control plane is not fully implemented in
this alpha release of `kubefed`. However, for the time being, deleting
the federation system namespace should remove all the resources except
the persistent storage volume dynamically provisioned for the
federation control plane's etcd. This can be accomplished by running:

```
$ kubectl delete ns federation-system
```

Also, you might not want to delete the storage volume that stores
the state of your federation control plane. You can then use that
storage volume to resume your federation control plane. We are
evaluating various alternatives to handle this case correctly and that's the reason for not implementing federation control plane turn down in this alpha release.
