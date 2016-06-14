---
---
This guide explains how to set up a federation cluster. Federation is an alpha feature which lets you control multiple kubernetes clusters.
[Federation proposal](https://github.com/kubernetes/kubernetes/blob/master/docs/proposals/federation.md) has more details.


* TOC
{:toc}

## Prerequisites

This guide assumes that you have a running kubernetes cluster.
If not, then you can head over to the [getting started guides](/docs/getting-started-guides/) to bring up a cluster.

This guide also assumes that you have the kubernetes source code.
If not, then you can head over to the [download kubernetes guide](/docs/getting-started-guides/binary_release/) to get the source code.

## Setting up federation control plane

### Building and pushing federation control binaries

You can build the federation control plane binaries using the following command:

```shell
$ FEDERATION=true KUBE_RELEASE_RUN_TESTS=n make quick-release
```

Next, you need to push the images to a registry from where your kubernetes cluster can read them.
If your kubernetes cluster is running on GCE, then you can push the images to `gcr.io/<your-gce-project-name>`.
The command to push the images will look like:

```shell
$ FEDERATION=true FEDERATION_PUSH_REPO_BASE=gcr.io/<your-gce-project-name> ./build/push-federation-images.sh
```

### Running the federation control plane

Federation control plane consists of an etcd, federation-apiserver and federation-controller-manager.
You can run these binaries as pods on your existing kubernetes cluster.
The command to run these pods on an existing GCE cluster will look like:

```shell
$ KUBERNETES_PROVIDER=gce FEDERATION_PUSH_REPO_BASE=gcr.io/<your-gce-project-name> ./federation/cluster/federation-up.sh
```

This creates a namespace `federation` and creates 2 deployments: `federation-apiserver` and `federation-controller-manager`.
You can verify that the pods are available by running the following command:

```shell
$ kubectl get deployments --namespace=federation
NAME                            DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
federation-apiserver            1         1         1            1           10m
federation-controller-manager   1         1         1            1           10m
```

Running `federation-up.sh` also creates a new record in your kubeconfig for you
to be able to talk to federation apiserver. You can view this by running
`kubectl config view`.

## Registering kubernetes clusters for federation
Now that we have the federation control plane up and running, we can start registering kubernetes clusters.

First of all, we need to create a secret containing kubeconfig for that kubernetes cluster, which federation control plane will use to talk to that kubernetes cluster.
For now, we create this secret in the host kubernetes cluster (that hosts federation control plane). When we start supporting secrets in federation control plane, we will create this secret their.
Suppose that your kubeconfig for kubernetes cluster is at /cluster1/kubeconfig, you can run the following command to create the secret:

```shell
$ kubectl create secret generic cluster1 --namespace=federation --from-file=/cluster1/kubeconfig
```

Note that the file name should be `kubeconfig` since file name determines the name of the key in the secret.

Now that the secret is created, we are ready to register the cluster. The YAML file for cluster will look like:

```yaml
apiVersion: v1alpha1
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
Assuming your YAML file is located at /cluster1/cluster,yaml, you can run the following command to register this cluster:

```shell
$ kubectl create -f /cluster1/cluster.yaml --context=federation-cluster

```

By specifying `--cluster=federation-cluster`, we direct the request to federation apiserver.
You can ensure that the cluster registration was successful by running:

```shell
$ kubectl get clusters --context=federation-cluster
NAME       STATUS    VERSION   AGE
cluster1   Ready               3m
```
