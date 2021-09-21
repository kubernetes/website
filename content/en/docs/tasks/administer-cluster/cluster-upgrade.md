---
title: Upgrade A Cluster
content_type: task
---

<!-- overview -->
This page provides an overview of the steps you should follow to upgrade a
Kubernetes cluster.

The way that you upgrade a cluster depends on how you initially deployed it
and on any subsequent changes.

At a high level, the steps you perform are:

- Upgrade the {{< glossary_tooltip text="control plane" term_id="control-plane" >}}
- Upgrade the nodes in your cluster
- Upgrade clients such as {{< glossary_tooltip text="kubectl" term_id="kubectl" >}}
- Adjust manifests and other resources based on the API changes that accompany the
  new Kubernetes version

## {{% heading "prerequisites" %}}

You must have an existing cluster. This page is about upgrading from Kubernetes
{{< skew prevMinorVersion >}} to Kubernetes {{< skew latestVersion >}}. If your cluster
is not currently running Kubernetes {{< skew prevMinorVersion >}} then please check
the documentation for the version of Kubernetes that you plan to upgrade to.

## Upgrade approaches

### kubeadm {#upgrade-kubeadm}

If your cluster was deployed using the `kubeadm` tool, refer to 
[Upgrading kubeadm clusters](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
for detailed information on how to upgrade the cluster.

Once you have upgraded the cluster, remember to
[install the latest version of `kubectl`](/docs/tasks/tools/).

### Manual deployments

{{< caution >}}
These steps do not account for third-party extensions such as network and storage
plugins.
{{< /caution >}}

You should manually update the control plane following this sequence:

- etcd (all instances)
- kube-apiserver (all control plane hosts)
- kube-controller-manager
- kube-scheduler
- cloud controller manager, if you use one

At this point you should
[install the latest version of `kubectl`](/docs/tasks/tools/).

For each node in your cluster, [drain](/docs/tasks/administer-cluster/safely-drain-node/)
that node and then either replace it with a new node that uses the {{< skew latestVersion >}}
kubelet, or upgrade the kubelet on that node and bring the node back into service.

### Other deployments {#upgrade-other}

Refer to the documentation for your cluster deployment tool to learn the recommended set
up steps for maintenance.

## Post-upgrade tasks

### Switch your cluster's storage API version

The objects that are serialized into etcd for a cluster's internal
representation of the Kubernetes resources active in the cluster are
written using a particular version of the API.

When the supported API changes, these objects may need to be rewritten
in the newer API. Failure to do this will eventually result in resources
that are no longer decodable or usable by the Kubernetes API server.

For each affected object, fetch it using the latest supported API and then
write it back also using the latest supported API.

### Update manifests

Upgrading to a new Kubernetes version can provide new APIs.

You can use `kubectl convert` command to convert manifests between different API versions.
For example:

```shell
kubectl convert -f pod.yaml --output-version v1
```

The `kubectl` tool replaces the contents of `pod.yaml` with a manifest that sets `kind` to
Pod (unchanged), but with a revised `apiVersion`.
