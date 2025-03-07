---
title: kubeadm labels and annotations
content_type: concept
weight: 70
---

## kubeadm annotations

### kubeadm.alpha.kubernetes.io/cri-socket

Example: `kubeadm.alpha.kubernetes.io/cri-socket: unix:///run/containerd/container.sock`

Used on: Node

Annotation that kubeadm uses to preserve the CRI socket information given to kubeadm at
`init`/`join` time for later use. kubeadm annotates the Node object with this information.
The annotation remains "alpha", since ideally this should be a field in KubeletConfiguration
instead.

### kubeadm.kubernetes.io/component-config.hash

Example: `kubeadm.kubernetes.io/component-config.hash: 2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae`

Used on: ConfigMap

Annotation that kubeadm places on ConfigMaps that it manages for configuring components.
It contains a hash (SHA-256) used to determine if the user has applied settings different
from the kubeadm defaults for a particular component.

### kubeadm.kubernetes.io/etcd.advertise-client-urls

Example: `kubeadm.kubernetes.io/etcd.advertise-client-urls: https://172.17.0.18:2379`

Used on: Pod

Annotation that kubeadm places on locally managed etcd Pods to keep track of
a list of URLs where etcd clients should connect to.
This is used mainly for etcd cluster health check purposes.

### kubeadm.kubernetes.io/kube-apiserver.advertise-address.endpoint

Example: `kubeadm.kubernetes.io/kube-apiserver.advertise-address.endpoint: https://172.17.0.18:6443`

Used on: Pod

Annotation that kubeadm places on locally managed `kube-apiserver` Pods to keep track
of the exposed advertise address/port endpoint for that API server instance.


