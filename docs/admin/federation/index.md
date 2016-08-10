---
assignees:
- mml
- nikhiljindal

---
This guide explains how to set up cluster federation that lets us control multiple Kubernetes clusters.


* TOC
{:toc}

## Prerequisites

This guide assumes that we have a running Kubernetes cluster.
If not, then head over to the [getting started guides](/docs/getting-started-guides/) to bring up a cluster.

This guide also assumes that we have the Kubernetes source code that can be
[downloaded from here](/docs/getting-started-guides/binary_release/).

## Setting up a federation control plane

Setting up federation requires running the federation control plane which
consists of etcd, federation-apiserver and federation-controller-manager.
We can run these binaries as pods on an existing Kubernetes cluster.

### Getting images

To run these as pods, we first need images for all the components. We can use
official release images or we can build from HEAD.

#### Using official release images

As part of every release, images are pushed to `gcr.io/google_containers`. To use
these images, we set env var `FEDERATION_PUSH_REPO_BASE=gcr.io/google_containers`
This will always use the latest image.
To use federation-apiserver and federation-controller-manager images from a specific release, we can set `FEDERATION_IMAGE_TAG`.

#### Building and pushing images from HEAD

To run the code from HEAD, we need to build and push our own images.
We can build the images using the following command:

```shell
$ FEDERATION=true KUBE_RELEASE_RUN_TESTS=n make quick-release
```

Next, we need to push these images to a registry such as Google Container Registry or Docker Hub, so that our cluster can pull them.
If Kubernetes cluster is running on Google Compute Engine (GCE), then we can push the images to `gcr.io/<gce-project-name>`.
The command to push the images will look like:

```shell
$ FEDERATION=true FEDERATION_PUSH_REPO_BASE=gcr.io/<gce-project-name> ./build/push-federation-images.sh
```

### Running the federation control plane

Once we have the images, we can run these as pods on our existing kubernetes cluster.
The command to run these pods on an existing GCE cluster will look like:

```shell
$ KUBERNETES_PROVIDER=gce FEDERATION_DNS_PROVIDER=google-clouddns FEDERATION_NAME=myfederation DNS_ZONE_NAME=myfederation.example FEDERATION_PUSH_REPO_BASE=gcr.io/google_containers ./federation/cluster/federation-up.sh
```

`KUBERNETES_PROVIDER` is the cloud provider.

`FEDERATION_DNS_PROVIDER` can be `google-clouddns` or `aws-route53`. It will be
set appropriately if it is missing and `KUBERNETES_PROVIDER` is one of `gce`, `gke` and `aws`.
This is used to resolve DNS requests for federation services. The service
controller keeps DNS records with the provider updated as services/pods are
updated in underlying kubernetes clusters.

`FEDERATION_NAME` is a name we can choose for our federation. This is the name that will appear in DNS routes.

`DNS_ZONE_NAME` is the domain to be used for DNS records. This is a domain that we
need to buy and then configure it such that DNS queries for that domain are
routed to the appropriate provider as per `FEDERATION_DNS_PROVIDER`.

Running that command creates a namespace `federation` and creates 2 deployments: `federation-apiserver` and `federation-controller-manager`.
We can verify that the pods are available by running the following command:

```shell
$ kubectl get deployments --namespace=federation
NAME                            DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
federation-apiserver            1         1         1            1           1m
federation-controller-manager   1         1         1            1           1m
```

Running `federation-up.sh` also creates a new record in our kubeconfig for us
to be able to talk to federation apiserver. We can view this by running
`kubectl config view`.

Note: `federation-up.sh` creates the federation-apiserver pod with an etcd
container that is backed by a persistent volume, so as to persist data. This
currently works only on AWS, GKE, and GCE.  You can edit
`federation/manifests/federation-apiserver-deployment.yaml` to suit your needs,
if required.

## Registering Kubernetes clusters for federation

Now that we have the federation control plane up and running, we can start registering Kubernetes clusters.

First of all, we need to create a secret containing kubeconfig for that Kubernetes cluster, which federation control plane will use to talk to that Kubernetes cluster.
For now, we create this secret in the host Kubernetes cluster (that hosts federation control plane). When we start supporting secrets in federation control plane, we will create this secret there.
Suppose that our kubeconfig for Kubernetes cluster is at `/cluster1/kubeconfig`, we can run the following command to create the secret:

```shell
$ kubectl create secret generic cluster1 --namespace=federation --from-file=/cluster1/kubeconfig
```

Note that the file name should be `kubeconfig` since file name determines the name of the key in the secret.

Now that the secret is created, we are ready to register the cluster. The YAML file for cluster will look like:

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

We need to insert the appropriate values for `<client-cidr>`, `<apiserver-address>` and `<secret-name>`.
`<secret-name>` here is name of the secret that we just created.
serverAddressByClientCIDRs contains the various server addresses that clients
can use as per their CIDR. We can set the server's public IP address with CIDR
`"0.0.0.0/0"` which all clients will match. In addition, if we want internal
clients to use server's clusterIP, we can set that as serverAddress. The client
CIDR in that case will be a CIDR that only matches IPs of pods running in that
cluster.

Assuming our YAML file is located at `/cluster1/cluster.yaml`, we can run the following command to register this cluster:

<!-- TODO(madhusudancs): Make the kubeconfig context configurable with default set to `federation` -->
```shell
$ kubectl create -f /cluster1/cluster.yaml --context=federation-cluster

```

By specifying `--context=federation-cluster`, we direct the request to federation apiserver.
we can ensure that the cluster registration was successful by running:

```shell
$ kubectl get clusters --context=federation-cluster
NAME       STATUS    VERSION   AGE
cluster1   Ready               3m
```

### Updating KubeDNS

Once the cluster is registered with the federation, we are all ready to use it.
But for the cluster to be able to route federation service requests, we need to restart
KubeDNS and pass it a `--federations` flag which tells it about valid federation DNS hostnames.
Format of the flag is like this:

```
--federations=${FEDERATION_NAME}=${DNS_DOMAIN_NAME}
```

To update KubeDNS with federations flag, we can edit the existing kubedns replication controller to
include that flag in pod template spec and then delete the existing pod. Replication controller will
recreate the pod with updated template.

To find the name of existing kubedns replication controller, run

```shell
$ kubectl get rc --namespace=kube-system
```

This will list all the replication controllers. Name of the kube-dns replication
controller will look like `kube-dns-v18`. You can then edit it by running:

```shell
$ kubectl edit rc <rc-name> --namespace=kube-system
```
Add the `--federations` flag as args to kube-dns container in the YAML file that
pops up after running the above command.

To delete the existing kube dns pod, you can first find it by running:

```shell
$ kubectl get pods --namespace=kube-system
```

And then delete it by running:

```shell
$ kubectl delete pods <pod-name> --namespace=kube-system
```

We are now all set to start using federation.

## For more information

 * [Federation proposal](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/docs/proposals/federation.md) details use cases that motivated this work.
