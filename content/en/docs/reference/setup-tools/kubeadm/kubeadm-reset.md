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

### External etcd clean up!

`kubeadm reset` will not delete any etcd data if external etcd is used. This means that if you run `kubeadm init` again using the same etcd endpoints, you will see state from previous clusters.

To wipe etcd data it is recommended you use a client like etcdctl, such as:

```bash
etcdctl del "" --prefix
```

See the [etcd documentation](https://github.com/coreos/etcd/tree/master/etcdctl) for more information.
{{% /capture %}}

{{% capture whatsnext %}}
* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/) to bootstrap a Kubernetes master node
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) to bootstrap a Kubernetes worker node and join it to the cluster
{{% /capture %}}
