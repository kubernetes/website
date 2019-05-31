---
reviewers:
- mikedanese
- luxas
- jbeda
title: kubeadm reset
content_template: templates/concept
weight: 60
---
{{% capture overview %}}
This command reverts any changes made by `kubeadm init` or `kubeadm join`.
{{% /capture %}}

{{% capture body %}}
{{< include "generated/kubeadm_reset.md" >}}

### Reset workflow {#reset-workflow}

`kubeadm reset` is responsible for cleaning up a node local file system from files that were created using
the `kubeadm init` or `kubeadm join` commands. For control-plane nodes `reset` also removes the local stacked
etcd member of this node from the etcd cluster and also removes this node's information from the kubeadm
`ClusterStatus` object. `ClusterStatus` is a kubeadm managed Kubernetes API object that holds a list of kube-apiserver endpoints.

`kubeadm reset phase` can be used to execute the separate phases of the above workflow.
To skip a list of phases you can use the `--skip-phases` flag, which works in a similar way to
the `kubeadm join` and `kubeadm init` phase runners.

### External etcd clean up

`kubeadm reset` will not delete any etcd data if external etcd is used. This means that if you run `kubeadm init` again using the same etcd endpoints, you will see state from previous clusters.

To wipe etcd data it is recommended you use a client like etcdctl, such as:

```bash
etcdctl del "" --prefix
```

See the [etcd documentation](https://github.com/coreos/etcd/tree/master/etcdctl) for more information.
{{% /capture %}}

{{% capture whatsnext %}}
* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/) to bootstrap a Kubernetes control-plane node
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) to bootstrap a Kubernetes worker node and join it to the cluster
{{% /capture %}}
