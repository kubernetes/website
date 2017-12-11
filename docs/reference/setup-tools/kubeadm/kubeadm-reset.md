---
approvers:
- mikedanese
- luxas
- jbeda
title: kubeadm reset 
---
{% capture overview %}
{% endcapture %}

{% capture body %}
{% include_relative generated/kubeadm_reset.md %}

### External etcd clean up

`kubeadm reset` will not delete any etcd data if external etcd is used. This means that if you run `kubeadm init` again using the same etcd endpoints, you will see state from previous clusters. 

To wipe etcd data it is recommended you use a client like etcdctl, such as:

```bash
etcdctl del "" --prefix
```

See the [etcd documentation](https://github.com/coreos/etcd/tree/master/etcdctl) for more information.
{% endcapture %}

{% capture whatsnext %}
* [kubeadm init](kubeadm-init.md) to bootstrap a Kubernetes master node
* [kubeadm join](kubeadm-join.md) to bootstrap a Kubernetes worker node and join it to the cluster
{% endcapture %}

{% include templates/concept.md %}