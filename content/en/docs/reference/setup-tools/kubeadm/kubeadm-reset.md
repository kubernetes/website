---
reviewers:
- luxas
- jbeda
title: kubeadm reset
content_type: concept
weight: 60
---
<!-- overview -->
Performs a best effort revert of changes made by `kubeadm init` or `kubeadm join`.

<!-- body -->
{{< include "generated/kubeadm_reset/_index.md" >}}

### Reset workflow {#reset-workflow}

`kubeadm reset` is responsible for cleaning up a node local file system from files that were created using
the `kubeadm init` or `kubeadm join` commands. For control-plane nodes `reset` also removes the local stacked
etcd member of this node from the etcd cluster.

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

### CNI configuration cleanup

CNI plugins use the directory `/etc/cni/net.d` to store their configuration.
The `kubeadm reset` command does not cleanup that directory. Backup the directory if needed.
Then to remove it, execute the following command:

```bash
sudo rm -rf /etc/cni/net.d
```

### Network traffic rules cleanup

The `kubeadm reset` command does not clean any iptables, nftables or IPVS rules applied
to the host by kube-proxy. If you wish to perform this cleanup, you can use the same
kube-proxy container which was used in your cluster and the `--cleanup` flag of the
kube-proxy binary:

```bash
docker run --privileged --rm registry.k8s.io/kube-proxy:v{{< skew currentPatchVersion >}} sh -c "kube-proxy --cleanup && echo DONE"
```

The output of the above command should print `DONE` at the end.
Instead of Docker, you can use your preferred container runtime to start the container.

### Cleanup of kubeconfig files

The `kubeadm reset` command does not clean kubeconfig files that you manually copied to
`$HOME/.kube/config`. Please, check the contents of the `$HOME/.kube/config` file. Backup
the file and remove it, if needed.

### Graceful kube-apiserver shutdown

If you have your `kube-apiserver` configured with the `--shutdown-delay-duration` flag,
you can run the following commands to attempt a graceful shutdown for the running API server Pod,
before you run `kubeadm reset`:

```bash
yq eval -i '.spec.containers[0].command = []' /etc/kubernetes/manifests/kube-apiserver.yaml
timeout 60 sh -c 'while pgrep kube-apiserver >/dev/null; do sleep 1; done' || true
```

## {{% heading "whatsnext" %}}

* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/) to bootstrap a Kubernetes control-plane node
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) to bootstrap a Kubernetes worker node and join it to the cluster
