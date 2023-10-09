---
title: "verify kubectl install"
description: "How to verify kubectl."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

For kubectl to find and access a Kubernetes cluster, it needs a
[kubeconfig file](/docs/concepts/configuration/organize-cluster-access-kubeconfig/).
By default, the `kubeconfig` file is located at the `~/.kube/config` directory. If you
don't have a `kubeconfig` file, you can copy it from your Kubernetes control plane's
`/etc/kubernetes/admin.conf` directory. Or if you have deployed your Kubernetes cluster
on a cloud platform, you can generate it using your cloud provider's tools. Refer to
the cloud provider's documentation for generating the `kubeconfig` file. Minikube and
kind automatically generates the `kubeconfig` file under the `~/.kube/config` directory.
For setting up a Kubernetes cluster refer to the[getting started](/docs/setup) page.

Check that kubectl is properly configured by getting the cluster state:

```shell
kubectl cluster-info
```

If you see a URL response, kubectl is correctly configured to access your cluster.

If you see a message similar to the following, kubectl is not configured correctly or is not able to connect to a Kubernetes cluster.

```
The connection to the server <server-name:port> was refused - did you specify the right host or port?
```

For example, if you are intending to run a Kubernetes cluster on your laptop (locally), you will need a tool like Minikube to be installed first and then re-run the commands stated above.

If kubectl cluster-info returns the url response but you can't access your cluster, to check whether it is configured properly, use:

```shell
kubectl cluster-info dump
```