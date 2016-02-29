---
---

To deploy and manage applications on Kubernetes, you'll use the Kubernetes command-line tool, [kubectl](/docs/user-guide/kubectl/kubectl). It lets you inspect your cluster resources, create, delete, and update components, and much more. You will use it to look at your new cluster and bring up example apps.

## Installing kubectl

If you downloaded a pre-compiled [release](https://github.com/kubernetes/kubernetes/releases), kubectl should be under `platforms/<os>/<arch>` from the tar bundle.

If you built from source, kubectl should be either under `_output/local/bin/<os>/<arch>` or `_output/dockerized/bin/<os>/<arch>`.

The kubectl binary doesn't have to be installed to be executable, but the rest of the walkthrough will assume that it's in your PATH.

The simplest way to install is to copy or move kubectl into a dir already in PATH (e.g. `/usr/local/bin`). For example:

```shell
# OS X
$ sudo cp kubernetes/platforms/darwin/amd64/kubectl /usr/local/bin/kubectl
# Linux
$ sudo cp kubernetes/platforms/linux/amd64/kubectl /usr/local/bin/kubectl
```

You also need to ensure it's executable:

```shell
$ sudo chmod +x /usr/local/bin/kubectl
```

If you prefer not to copy kubectl, you need to ensure the tool is in your path:

```shell
# OS X
export PATH=<path/to/kubernetes-directory>/platforms/darwin/amd64:$PATH

# Linux
export PATH=<path/to/kubernetes-directory>/platforms/linux/amd64:$PATH
```

## Configuring kubectl

In order for kubectl to find and access the Kubernetes cluster, it needs a [kubeconfig file](/docs/user-guide/kubeconfig-file), which is created automatically when creating a cluster using kube-up.sh (see the [getting started guides](/docs/getting-started-guides/) for more about creating clusters). If you need access to a cluster you didn't create, see the [Sharing Cluster Access document](/docs/user-guide/sharing-clusters).
By default, kubectl configuration lives at `~/.kube/config`.

#### Making sure you're ready

Check that kubectl is properly configured by getting the cluster state:

```shell
$ kubectl cluster-info
```

If you see a url response, you are ready to go.

## What's next?

[Learn how to launch and expose your application.](/docs/user-guide/quick-start)