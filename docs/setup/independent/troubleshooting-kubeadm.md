---
title: Troubleshooting kubeadm
---

{% capture overview %}

As with any program, you might run into an error using or operating it. Below we have listed 
common failure scenarios and have provided steps that will help you to understand and hopefully
fix the problem.

If your problem is not listed below, please follow the following steps:

- If you think your problem is a bug with kubeadm:
  - Go to [github.com/kubernetes/kubeadm](https://github.com/kubernetes/kubeadm/issues) and search for existing issues.
  - If no issue exists, please [open one](https://github.com/kubernetes/kubeadm/issues/new) and follow the issue template.

- If you are unsure about how kubeadm or kubernetes works, and would like to receive 
  support about your question, please ask on Slack in #kubeadm, or open a question on StackOverflow. Please include 
  relevant tags like `#kubernetes` and `#kubeadm` so folks can help you.

If your cluster is in an error state, you may have trouble in the configuration if you see Pod statuses like `RunContainerError`,
`CrashLoopBackOff` or `Error`. If this is the case, please read below.

{% endcapture %}

#### `ebtables` or `ethtool` not found during installation

If you see the following warnings while running `kubeadm init`

```
[preflight] WARNING: ebtables not found in system path                          
[preflight] WARNING: ethtool not found in system path                           
```

Then you may be missing ebtables and ethtool on your Linux machine. You can install them with the following commands: 

```
# For ubuntu/debian users, try 
apt install ebtables ethtool

# For CentOS/Fedora users, try 
yum install ebtables ethtool
```

#### Pods in `RunContainerError`, `CrashLoopBackOff` or `Error` state

Right after `kubeadm init` there should not be any such Pods. If there are Pods in
such a state _right after_ `kubeadm init`, please open an issue in the kubeadm repo.
`kube-dns` should be in the `Pending` state until you have deployed the network solution.
However, if you see Pods in the `RunContainerError`, `CrashLoopBackOff` or `Error` state
after deploying the network solution and nothing happens to `kube-dns`, it's very
likely that the Pod Network solution that you installed is somehow broken. You
might have to grant it more RBAC privileges or use a newer version. Please file
an issue in the Pod Network providers' issue tracker and get the issue triaged there.

#### `kube-dns` is stuck in the `Pending` state

This is **expected** and part of the design. kubeadm is network provider-agnostic, so the admin
should [install the pod network solution](/docs/concepts/cluster-administration/addons/)
of choice. You have to install a Pod Network
before `kube-dns` may deployed fully. Hence the `Pending` state before the network is set up.

#### `HostPort` services do not work

The `HostPort` and `HostIP` functionality is available depending on your Pod Network
provider. Please contact the author of the Pod Network solution to find out whether
`HostPort` and `HostIP` functionality are available. 

Verified HostPort CNI providers:
- Calico
- Canal
- Flannel

For more information, read the [CNI portmap documentation](https://github.com/containernetworking/plugins/blob/master/plugins/meta/portmap/README.md).

If your network provider does not support the portmap CNI plugin, you may need to use the [NodePort feature of
services](/docs/concepts/services-networking/service/#type-nodeport) or use `HostNetwork=true`.

#### Pods are not accessible via their Service IP

Many network add-ons do not yet enable [hairpin mode](https://kubernetes.io/docs/tasks/debug-application-cluster/debug-service/#a-pod-cannot-reach-itself-via-service-ip)
which allows pods to access themselves via their Service IP if they don't know about their podIP. This is an issue
related to [CNI](https://github.com/containernetworking/cni/issues/476). Please contact the providers of the network
add-on providers to get timely information about whether they support hairpin mode.

If you are using VirtualBox (directly or via Vagrant), you will need to
ensure that `hostname -i` returns a routable IP address (i.e. one on the
second network interface, not the first one). By default, it doesn't do this
and kubelet ends-up using first non-loopback network interface, which is
usually NATed. Workaround: Modify `/etc/hosts`, take a look at this
`Vagrantfile`[ubuntu-vagrantfile](https://github.com/errordeveloper/k8s-playground/blob/22dd39dfc06111235620e6c4404a96ae146f26fd/Vagrantfile#L11) for how this can be achieved.

#### TLS certificate errors

The following error indicates a possible certificate mismatch.

```
# kubectl get po
Unable to connect to the server: x509: certificate signed by unknown authority (possibly because of "crypto/rsa: verification error" while trying to verify candidate authority certificate "kubernetes")
```

Verify that the `$HOME/.kube/config` file contains a valid certificate, and regenerate a certificate if necessary.
Another workaround is to overwrite the default `kubeconfig` for the "admin" user:

```
mv  $HOME/.kube $HOME/.kube.bak
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

#### Errors on CentOS when setting up masters

If you are using CentOS and encounter difficulty while setting up the master node，
verify that your Docker cgroup driver matches the kubelet config:

```bash
docker info | grep -i cgroup
cat /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
```

If the Docker cgroup driver and the kubelet config don't match, change the kubelet config to match the Docker cgroup driver. The
flag you need to change is `--cgroup-driver`. If it's already set, you can update like so:

```bash
sed -i "s/cgroup-driver=systemd/cgroup-driver=cgroupfs/g /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
```

Otherwise, you will need to open the systemd file and add the flag to an existing environment line.

Then restart kubelet:

```bash
systemctl daemon-reload
systemctl restart kubelet
```

The `kubectl describe pod` or `kubectl logs` commands can help you diagnose errors. For example:

```bash
kubectl -n ${NAMESPACE} describe pod ${POD_NAME}

kubectl -n ${NAMESPACE} logs ${POD_NAME} -c ${CONTAINER_NAME}
```