---
assignees:
- bgrant0607
- mikedanese
title: Installing and Setting up kubectl
---

To deploy and manage applications on Kubernetes, you'll use the Kubernetes command-line tool, [kubectl](/docs/user-guide/kubectl/). It lets you inspect your cluster resources, create, delete, and update components, and much more. You will use it to look at your new cluster and bring up example apps.

## Install kubectl Binary Via curl

Download the latest release with the command:

```shell
# OS X
curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/darwin/amd64/kubectl

# Linux
curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
```

If you want to download a specific version of kubectl you can replace the nested curl command from above with the version you want. (e.g. v1.4.6, v1.5.0-beta.2)

Make the kubectl binary executable and move it to your PATH (e.g. `/usr/local/bin`):

```shell
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin/kubectl
```

## Extract kubectl from Release .tar.gz or Compiled Source

If you downloaded a pre-compiled [release](https://github.com/kubernetes/kubernetes/releases), kubectl will be under `platforms/<os>/<arch>` from the tar bundle.

If you compiled Kubernetes from source, kubectl should be either under `_output/local/bin/<os>/<arch>` or `_output/dockerized/bin/<os>/<arch>`.

Copy or move kubectl into a directory already in your PATH (e.g. `/usr/local/bin`). For example:

```shell
# OS X
sudo cp platforms/darwin/amd64/kubectl /usr/local/bin/kubectl

# Linux
sudo cp platforms/linux/amd64/kubectl /usr/local/bin/kubectl
```

Next make it executable with the following command:

```shell
sudo chmod +x /usr/local/bin/kubectl
```

The kubectl binary doesn't have to be installed to be executable, but the rest of the walkthrough will assume that it's in your PATH.

If you prefer not to copy kubectl, you need to ensure it is in your path:

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
