---
title: Set up Cluster Federation with Kubefed
reviewers:
- madhusudancs
content_template: templates/task
weight: 125
---

{{% capture overview %}}

{{< deprecationfilewarning >}}
{{< include "federation-deprecation-warning-note.md" >}}
{{< /deprecationfilewarning >}}

Kubernetes version 1.5 and above includes a new command line tool called
[`kubefed`](/docs/admin/kubefed/) to help you administrate your federated
clusters. `kubefed` helps you to deploy a new Kubernetes cluster federation
control plane, and to add clusters to or remove clusters from an existing
federation control plane.

This guide explains how to administer a Kubernetes Cluster Federation
using `kubefed`.

> Note: `kubefed` is a beta feature in Kubernetes 1.6.

{{% /capture %}}


{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}

{{% capture steps %}}

## Prerequisites

This guide assumes that you have a running Kubernetes cluster. Please
see one of the [getting started](/docs/setup/) guides
for installation instructions for your platform.

## Getting `kubefed`

Download the client tarball corresponding to the particular release and
extract the binaries in the tarball:

{{< note >}}
Until Kubernetes version `1.8.x` the federation project was
maintained as part of the [core kubernetes repo](https://github.com/kubernetes/kubernetes).
Between Kubernetes releases `1.8` and `1.9`, the federation project moved into
a separate [federation repo](https://github.com/kubernetes/federation), where it is
now maintained. Consequently, the federation release information is available on the
[release page](https://github.com/kubernetes/federation/releases).
{{< /note >}}

### For Kubernetes versions 1.8.x and earlier:

```shell
curl -LO https://storage.googleapis.com/kubernetes-release/release/${RELEASE-VERSION}/kubernetes-client-linux-amd64.tar.gz
tar -xzvf kubernetes-client-linux-amd64.tar.gz
```
{{< note >}}
The `RELEASE-VERSION` variable should either be set to or replaced with the actual version needed.
{{< /note >}}

Copy the extracted binary to one of the directories in your `$PATH`
and set the executable permission on the binary.

```shell
sudo cp kubernetes/client/bin/kubefed /usr/local/bin
sudo chmod +x /usr/local/bin/kubefed
```

### For Kubernetes versions 1.9.x and above:

```shell
curl -LO https://storage.cloud.google.com/kubernetes-federation-release/release/${RELEASE-VERSION}/federation-client-linux-amd64.tar.gz
tar -xzvf federation-client-linux-amd64.tar.gz
```

{{< note >}}
The `RELEASE-VERSION` variable should be replaced with one of the release versions available at [federation release page](https://github.com/kubernetes/federation/releases).
{{< /note >}}

Copy the extracted binary to one of the directories in your `$PATH`
and set the executable permission on the binary.

```shell
sudo cp federation/client/bin/kubefed /usr/local/bin
sudo chmod +x /usr/local/bin/kubefed
```

### Install kubectl

You can install a matching version of kubectl using the instructions on
the  [kubectl install page](/docs/tasks/tools/install-kubectl/).

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
*         gke_myproject_asia-east1-b_gce-asia-east1     gke_myproject_asia-east1-b_gce-asia-east1     gke_myproject_asia-east1-b_gce-asia-east1
```


You'll need to provide the `kubeconfig` context (called name in the
entry above) for your host cluster when you deploy your federation
control plane.


## Deploying a federation control plane

To deploy a federation control plane on your host cluster, run
[`kubefed init`](/docs/admin/kubefed_init/) command. When you use
`kubefed init`, you must provide the following:

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

Once the federation control plane is initialized, query the namespaces:

```shell
kubectl get namespace --context=fellowship
```

If you do not see the `default` namespace listed (this is due to a
[bug](https://github.com/kubernetes/kubernetes/issues/33292)). Create it
yourself with the following command:

```shell
kubectl create namespace default --context=fellowship
```

The machines in your host cluster must have the appropriate permissions
to program the DNS service that you are using. For example, if your
cluster is running on Google Compute Engine, you must enable the
Google Cloud DNS API for your project.

The machines in Google Kubernetes Engine clusters are created
without the Google Cloud DNS API scope by default. If you want to use a
Google Kubernetes Engine cluster as a Federation host, you must create it using the `gcloud`
command with the appropriate value in the `--scopes` field. You cannot
modify a Google Kubernetes Engine cluster directly to add this scope, but you can create a
new node pool for your cluster and delete the old one.

{{< note >}}
This will cause pods in the cluster to be rescheduled.
{{< /note >}}

To add the new node pool, run:

```shell
scopes="$(gcloud container node-pools describe --cluster=gke-cluster default-pool --format='value[delimiter=","](config.oauthScopes)')"
gcloud container node-pools create new-np \
    --cluster=gke-cluster \
    --scopes="${scopes},https://www.googleapis.com/auth/ndev.clouddns.readwrite"
```

To delete the old node pool, run:

```shell
gcloud container node-pools delete default-pool --cluster gke-cluster
```

`kubefed init` sets up the federation control plane in the host
cluster and also adds an entry for the federation API server in your
local kubeconfig.

{{< note >}}
In the beta release of Kubernetes 1.6, `kubefed init` does not automatically set the current context to the
newly deployed federation. You can set the current context manually by running:

```shell
kubectl config use-context fellowship
```

where `fellowship` is the name of your federation.
{{< /note >}}

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
    --apiserver-arg-overrides="--anonymous-auth=false,--v=4" \
    --controllermanager-arg-overrides="--controllers=services=false"
```

### Configuring a DNS provider

The Federated service controller programs a DNS provider to expose
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
zones = example.com.
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
[service](/docs/concepts/services-networking/service/) on the host cluster. By default,
this service is exposed as a
[load balanced service](/docs/concepts/services-networking/service/#loadbalancer).
Most on-premises and bare-metal environments, and some cloud
environments lack support for load balanced services. `kubefed init`
allows exposing the federation API server as a
[`NodePort` service](/docs/concepts/services-networking/service/#nodeport) on
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

#### Provisioning storage for etcd

Federation control plane stores its state in
[`etcd`](https://coreos.com/etcd/docs/latest/).
[`etcd`](https://coreos.com/etcd/docs/latest/) data must be stored in
a persistent storage volume to ensure correct operation across
federation control plane restarts. On host clusters that support
[dynamic provisioning of storage volumes](/docs/concepts/storage/persistent-volumes/#dynamic),
`kubefed init` dynamically provisions a
[`PersistentVolume`](/docs/concepts/storage/persistent-volumes/#persistent-volumes)
and binds it to a
[`PersistentVolumeClaim`](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)
to store [`etcd`](https://coreos.com/etcd/docs/latest/) data. If your
host cluster doesn't support dynamic provisioning, you can also
statically provision a
[`PersistentVolume`](/docs/concepts/storage/persistent-volumes/#persistent-volumes).
`kubefed init` creates a
[`PersistentVolumeClaim`](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)
that has the following configuration:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  annotations:
    volume.alpha.kubernetes.io/storage-class: "yes"
  labels:
    app: federated-cluster
  name: fellowship-federation-apiserver-etcd-claim
  namespace: federation-system
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

To statically provision a
[`PersistentVolume`](/docs/concepts/storage/persistent-volumes/#persistent-volumes),
you must ensure that the
[`PersistentVolume`](/docs/concepts/storage/persistent-volumes/#persistent-volumes)
that you create has the matching storage class, access mode and
at least as much capacity as the requested
[`PersistentVolumeClaim`](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims).

Alternatively, you can disable persistent storage completely
by passing `--etcd-persistent-storage=false` to `kubefed init`.
However, we do not recommended this because your federation control
plane cannot survive restarts in this mode.

```shell
kubefed init fellowship \
    --host-cluster-context=rivendell \
    --dns-provider="google-clouddns" \
    --dns-zone-name="example.com." \
    --etcd-persistent-storage=false
```

`kubefed init` still doesn't support attaching an existing
[`PersistentVolumeClaim`](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)
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
[Setting up CoreDNS as DNS provider for Cluster Federation](/docs/tasks/federation/set-up-coredns-provider-federation/).

#### AWS Route53 support

It is possible to utilize AWS Route53 as a cloud DNS provider when the
federation controller-manager is run on-premise. The controller-manager
Deployment must be configured with AWS credentials since it cannot implicitly
gather them from a VM running on AWS.

Currently, `kubefed init` does not read AWS Route53 credentials from the
`--dns-provider-config` flag, so a patch must be applied.

Specify AWS Route53 as your DNS provider when initializing your on-premise
federation controller-manager by passing the flag `--dns-provider="aws-route53"`
to `kubefed init`.

Create a patch file with your AWS credentials:

```yaml
spec:
  template:
    spec:
      containers:
      - name: controller-manager
        env:
        - name: AWS_ACCESS_KEY_ID
          value: "ABCDEFG1234567890"
        - name: AWS_SECRET_ACCESS_KEY
          value: "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
```

Patch the Deployment:

```shell
kubectl -n federation-system patch deployment controller-manager --patch "$(cat <patch-file-name>.yml)"
```

Where `<patch-file-name>` is the name of the file you created above.

## Adding a cluster to a federation

After you've deployed a federation control plane, you'll need to make that control plane aware of the clusters it should manage.

To join clusters into the federation:

1. Change the context:

    ```shell
    kubectl config use-context fellowship
    ```

1. If you are using a managed cluster service, allow the service to access the cluster. To do this, create a `clusterrolebinding` for the account associated with your cluster service:

    ```shell
    kubectl create clusterrolebinding <your_user>-cluster-admin-binding --clusterrole=cluster-admin --user=<your_user>@example.org --context=<joining_cluster_context>
    ```

1. Join the cluster to the federation, using `kubefed join`, and make sure you provide the following:

    * The name of the cluster that you are joining to the federation
    * `--host-cluster-context`, the kubeconfig context for the host cluster

    For example, this command adds the cluster `gondor` to the federation running on host cluster `rivendell`:

    ```shell
    kubefed join gondor --host-cluster-context=rivendell
    ```

A new context has now been added to your kubeconfig named `fellowship` (after the name of your federation).


{{< note >}}
The name that you provide to the `join` command is used as the joining cluster's identity in federation. This name should adhere to the rules described in the [identifiers doc](/docs/concepts/overview/working-with-objects/names/). If the context
corresponding to your joining cluster conforms to these rules, you can use the same name in the join command. Otherwise, you must choose a different name for your cluster's identity.
{{< /note >}}

### Naming rules and customization

The cluster name you supply to `kubefed join` must be a valid
[RFC 1035](https://www.ietf.org/rfc/rfc1035.txt) label and are
enumerated in the [Identifiers doc](/docs/concepts/overview/working-with-objects/names/).

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
For example, if context of the cluster you are joining is
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

{{< note >}}
If your cluster name does not conform to the DNS subdomain name specification, all you need to do is supply the secret name using the `--secret-name` flag. `kubefed join` automatically creates the secret for you.
{{< /note >}}

### `kube-dns` configuration

`kube-dns` configuration must be updated in each joining cluster to
enable federated service discovery. If the joining Kubernetes cluster
is version 1.5 or newer and your `kubefed` is version 1.6 or newer,
then this configuration is automatically managed for you when the
clusters are joined or unjoined using `kubefed join` or `unjoin`
commands.

In all other cases, you must update `kube-dns` configuration manually
as described in the
[Updating KubeDNS section of the admin guide](/docs/admin/federation/).

## Removing a cluster from a federation

To remove a cluster from a federation, run the [`kubefed unjoin`](/docs/reference/setup-tools/kubefed/kubefed_unjoin/)
command with the cluster name and the federation's
`--host-cluster-context`:

```shell
kubefed unjoin gondor --host-cluster-context=rivendell
```

## Turning down the federation control plane

Proper cleanup of federation control plane is not fully implemented in
this beta release of `kubefed`. However, for the time being, deleting
the federation system namespace should remove all the resources except
the persistent storage volume dynamically provisioned for the
federation control plane's etcd. You can delete the federation
namespace by running the following command:

```shell
kubectl delete ns federation-system --context=rivendell
```

{{< note >}}
`rivendell` is the host cluster name. Replace that name with the appropriate name in your configuration.
{{< /note >}}

{{% /capture %}}
