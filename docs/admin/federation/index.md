---
reviewers:
- madhusudancs
- mml
- nikhiljindal
title: (Deprecated) Using `federation-up` and `deploy.sh`
---

## The mechanisms explained in this doc to setup federation are deprecated. [`kubefed`](/docs/tasks/federation/set-up-cluster-federation-kubefed/) is now the recommended way to deploy federation.

This guide explains how to set up cluster federation that lets us control multiple Kubernetes clusters.


* TOC
{:toc}

## Prerequisites

This guide assumes that you have a running Kubernetes cluster.
If you need to start a new cluster, see the [getting started guides](/docs/setup/) for instructions on bringing a cluster up.

To use the commands in this guide, you must download a Kubernetes release from the 
[getting started binary releases](/docs/getting-started-guides/binary_release/) and 
extract into a directory; all the commands in this guide are run from
that directory.

```shell
$ curl -L https://github.com/kubernetes/kubernetes/releases/download/v1.4.0/kubernetes.tar.gz | tar xvzf -
$ cd kubernetes
```

You must also have a Docker installation running
locally--meaning on the machine where you run the commands described in this
guide.

## Setting up a federation control plane

Setting up federation requires running the federation control plane which
consists of etcd, federation-apiserver (via the hyperkube binary) and
federation-controller-manager (also via the hyperkube binary). You can run
these binaries as pods on an existing Kubernetes cluster.

Note: This is a new mechanism to turn up Kubernetes Cluster Federation. If
you want to follow the old mechanism, please refer to the section
[Previous Federation turn up mechanism](#previous-federation-turn-up-mechanism)
at the end of this guide.

### Initial setup

Create a directory to store the configs required to turn up federation
and export that directory path in the environment variable
`FEDERATION_OUTPUT_ROOT`. This can be an existing directory, but it is
highly recommended to create a separate directory so that it is easier
to clean up later.

```shell
$ export FEDERATION_OUTPUT_ROOT="${PWD}/_output/federation"
$ mkdir -p "${FEDERATION_OUTPUT_ROOT}"
```

Initialize the setup.

```shell
$ federation/deploy/deploy.sh init
```

Optionally, you can create/edit `${FEDERATION_OUTPUT_ROOT}/values.yaml` to
customize any value in
[federation/federation/manifests/federation/values.yaml](https://github.com/madhusudancs/kubernetes-anywhere/blob/federation/federation/manifests/federation/values.yaml). Example:

```yaml
apiserverRegistry: "gcr.io/myrepository"
apiserverVersion: "v1.5.0-alpha.0.1010+892a6d7af59c0b"
controllerManagerRegistry: "gcr.io/myrepository"
controllerManagerVersion: "v1.5.0-alpha.0.1010+892a6d7af59c0b"
```

Assuming you have built and pushed the `hyperkube` image to the repository
with the given tag in the example above.

### Getting images

To run the federation control plane components as pods, you first need the
images for all the components. You can either use the official release
images or you can build them yourself from HEAD.

### Using official release images

As part of every Kubernetes release, official release images are pushed to
`k8s.gcr.io`. To use the images in this repository, you can
set the container image fields in the following configs to point to the
images in this repository. `k8s.gcr.io/hyperkube` image
includes the federation-apiserver and federation-controller-manager
binaries, so you can point the corresponding configs for those components
to the hyperkube image.

### Building and pushing images from HEAD

To build the binaries, check out the
[Kubernetes repository](https://github.com/kubernetes/kubernetes) and
run the following commands from the root of the source directory:


```shell
$ federation/develop/develop.sh build_binaries
```

To build the image and push it to the repository, run:

```shell
$ KUBE_REGISTRY="gcr.io/myrepository" federation/develop/develop.sh build_image
$ KUBE_REGISTRY="gcr.io/myrepository" federation/develop/develop.sh push
```

Note: This is going to overwrite the values you might have set for
`apiserverRegistry`, `apiserverVersion`, `controllerManagerRegistry` and
`controllerManagerVersion` in your `${FEDERATION_OUTPUT_ROOT}/values.yaml`
file. Hence, it is not recommended to customize these values in
`${FEDERATION_OUTPUT_ROOT}/values.yaml` if you are building the
images from source.

### Running the federation control plane

Once you have the images, you can turn up the federation control plane by
running:

```shell
$ federation/deploy/deploy.sh deploy_federation
```

This spins up the federation control components as pods managed by
[`Deployments`](/docs/concepts/workloads/controllers/deployment/) on your
existing Kubernetes cluster. It also starts a
[`type: LoadBalancer`](/docs/concepts/services-networking/service/#type-loadbalancer)
[`Service`](/docs/concepts/services-networking/service/) for the
`federation-apiserver` and a
[`PVC`](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims/) backed
by a dynamically provisioned
[`PV`](/docs/concepts/storage/persistent-volumes/) for
 `etcd`. All these components are created in the `federation` namespace.

You can verify that the pods are available by running the following
command:

```shell
$ kubectl get deployments --namespace=federation
NAME                            DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
federation-apiserver            1         1         1            1           1m
federation-controller-manager   1         1         1            1           1m
```

Running `deploy.sh` also creates a new record in your kubeconfig for us
to be able to talk to federation apiserver. You can view this by running
`kubectl config view`.

Note: Dynamic provisioning for persistent volume currently works only on
AWS, Google Kubernetes Engine, and GCE. However, you can edit the created `Deployments` to suit
your needs, if required.

## Registering Kubernetes clusters with federation

Now that you have the federation control plane up and running, you can start registering Kubernetes clusters.

First of all, you need to create a secret containing kubeconfig for that Kubernetes cluster, which federation control plane will use to talk to that Kubernetes cluster.
For now, you can create this secret in the host Kubernetes cluster (that hosts federation control plane). When federation starts supporting secrets, you will be able to create this secret there.
Suppose that your kubeconfig for Kubernetes cluster is at `/cluster1/kubeconfig`, you can run the following command to create the secret:

```shell
$ kubectl create secret generic cluster1 --namespace=federation --from-file=/cluster1/kubeconfig
```

Note that the file name should be `kubeconfig` since file name determines the name of the key in the secret.

Now that the secret is created, you are ready to register the cluster. The YAML file for cluster will look like:

```yaml
apiVersion: federation/v1beta1
kind: Cluster
metadata:
  name: cluster1
spec:
  serverAddressByClientCIDRs:
  - clientCIDR: <client-cidr>
    serverAddress: <apiserver-address>
  secretRef:
    name: <secret-name>
```

You need to insert the appropriate values for `<client-cidr>`, `<apiserver-address>` and `<secret-name>`.
`<secret-name>` here is name of the secret that you just created.
serverAddressByClientCIDRs contains the various server addresses that clients
can use as per their CIDR. You can set the server's public IP address with CIDR
`"0.0.0.0/0"` which all clients will match. In addition, if you want internal
clients to use server's clusterIP, you can set that as serverAddress. The client
CIDR in that case will be a CIDR that only matches IPs of pods running in that
cluster.

Assuming your YAML file is located at `/cluster1/cluster.yaml`, you can run the following command to register this cluster:

<!-- TODO(madhusudancs): Make the kubeconfig context configurable with default set to `federation` -->
```shell
$ kubectl create -f /cluster1/cluster.yaml --context=federation-cluster

```

By specifying `--context=federation-cluster`, you direct the request to
federation apiserver. You can ensure that the cluster registration was
successful by running:

```shell
$ kubectl get clusters --context=federation-cluster
NAME       STATUS    VERSION   AGE
cluster1   Ready               3m
```

## Updating KubeDNS

Once you've registered your cluster with the federation, you'll need to update KubeDNS so that your cluster can route federation service requests. The update method varies depending on your Kubernetes version; on Kubernetes 1.5 or later, you must pass the
`--federations` flag to kube-dns via the kube-dns config map. In version 1.4 or earlier, you must set the `--federations` flag directly on kube-dns-rc on other clusters.

### Kubernetes 1.5+: Passing federations flag via config map to kube-dns

For Kubernetes clusters of version 1.5+, you can pass the
`--federations` flag to kube-dns via the kube-dns config map.
The flag uses the following format:

```
--federations=${FEDERATION_NAME}=${DNS_DOMAIN_NAME}
```

To pass this flag to KubeDNS, create a config-map with name `kube-dns` in
namespace `kube-system`. The configmap should look like the following:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: kube-dns
  namespace: kube-system
data:
  federations: <federation-name>=<federation-domain-name>
```

where `<federation-name>` should be replaced by the name you want to give to your
federation, and
`federation-domain-name` should be replaced by the domain name you want to use
in your federation DNS.

You can find more details about config maps in general at
[config map](/docs/tasks/configure-pod-container/configure-pod-configmap/).

### Kubernetes 1.4 and earlier: Setting federations flag on kube-dns-rc

If your cluster is running Kubernetes version 1.4 or earlier, you must restart
KubeDNS and pass it a `--federations` flag, which tells it about valid federation DNS hostnames.
The flag uses the following format:

```
--federations=${FEDERATION_NAME}=${DNS_DOMAIN_NAME}
```

To update KubeDNS with the `--federations` flag, you can edit the existing kubedns replication controller to
include that flag in pod template spec, and then delete the existing pod. The replication controller then
recreates the pod with updated template.

To find the name of existing kubedns replication controller, run the following command:

```shell
$ kubectl get rc --namespace=kube-system
```

You should see a list of all the replication controllers on the cluster. The kube-dns replication
controller should have a name similar to `kube-dns-v18`. To edit the replication controller, specify it by name as follows:

```shell
$ kubectl edit rc <rc-name> --namespace=kube-system
```
In the resulting YAML file for the kube-dns replication controller, add the `--federations` flag as an argument to kube-dns container.

Then, you must delete the existing kube dns pod. You can find the pod by running:

```shell
$ kubectl get pods --namespace=kube-system
```

And then delete the appropriate pod by running:

```shell
$ kubectl delete pods <pod-name> --namespace=kube-system
```

Once you've completed the kube-dns configuration, your federation is ready for use.

## Turn down

In order to turn the federation control plane down run the following
command:

```shell
$ federation/deploy/deploy.sh destroy_federation
```

## Previous Federation turn up mechanism

This describes the previous mechanism we had to turn up Kubernetes Cluster
Federation. It is recommended to use the new turn up mechanism. If you would
like to use this mechanism instead of the new one, please let us know
why the new mechanism doesn't work for your case by filing an issue here -
[https://github.com/kubernetes/kubernetes/issues/new](https://github.com/kubernetes/kubernetes/issues/new)

### Getting images

To run these as pods, you first need images for all the components. You can use
official release images or you can build from HEAD.

#### Using official release images

As part of every release, images are pushed to `k8s.gcr.io`. To use
these images, set env var `FEDERATION_PUSH_REPO_BASE=k8s.gcr.io`
This will always use the latest image.
To use the hyperkube image which includes federation-apiserver and
federation-controller-manager from a specific release, set the
`FEDERATION_IMAGE_TAG` environment variable.

#### Building and pushing images from HEAD

To run the code from HEAD, you need to build and push your own images.
You can build the images using the following command:

```shell
$ FEDERATION=true KUBE_RELEASE_RUN_TESTS=n make quick-release
```

Next, you need to push these images to a registry such as Google Container Registry or Docker Hub, so that your cluster can pull them.
If Kubernetes cluster is running on Google Compute Engine (GCE), then you can push the images to `gcr.io/<gce-project-name>`.
The command to push the images will look like:

```shell
$ FEDERATION=true FEDERATION_PUSH_REPO_BASE=gcr.io/<gce-project-name> ./build/push-federation-images.sh
```

### Running the federation control plane

Once you have the images, you can run these as pods on your existing kubernetes cluster.
The command to run these pods on an existing GCE cluster will look like:

```shell
$ KUBERNETES_PROVIDER=gce FEDERATION_DNS_PROVIDER=google-clouddns FEDERATION_NAME=myfederation DNS_ZONE_NAME=myfederation.example FEDERATION_PUSH_REPO_BASE=k8s.gcr.io ./federation/cluster/federation-up.sh
```

`KUBERNETES_PROVIDER` is the cloud provider.

`FEDERATION_DNS_PROVIDER` can be `google-clouddns` or `aws-route53`. It will be
set appropriately if it is missing and `KUBERNETES_PROVIDER` is one of `gce`, `gke` and `aws`.
This is used to resolve DNS requests for federation services. The service
controller keeps DNS records with the provider updated as services/pods are
updated in underlying Kubernetes clusters.

`FEDERATION_NAME` is a name you can choose for your federation. This is the name that will appear in DNS routes.

`DNS_ZONE_NAME` is the domain to be used for DNS records. This is a domain that you
need to buy and then configure it such that DNS queries for that domain are
routed to the appropriate provider as per `FEDERATION_DNS_PROVIDER`.

Running that command creates a namespace `federation` and creates 2 deployments: `federation-apiserver` and `federation-controller-manager`.
You can verify that the pods are available by running the following command:

```shell
$ kubectl get deployments --namespace=federation
NAME                            DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
federation-apiserver            1         1         1            1           1m
federation-controller-manager   1         1         1            1           1m
```

Running `federation-up.sh` also creates a new record in your kubeconfig for us
to be able to talk to federation apiserver. You can view this by running
`kubectl config view`.

Note: `federation-up.sh` creates the federation-apiserver pod with an etcd
container that is backed by a persistent volume, so as to persist data. This
currently works only on AWS, Google Kubernetes Engine, and GCE.  You can edit
`federation/manifests/federation-apiserver-deployment.yaml` to suit your needs,
if required.


## For more information

 * [Federation proposal](https://git.k8s.io/community/contributors/design-proposals/multicluster/federation.md) details use cases that motivated this work.
