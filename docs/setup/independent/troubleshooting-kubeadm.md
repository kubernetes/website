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

#### `ebtables` or some similar executable not found during installation

If you see the following warnings while running `kubeadm init`

```
[preflight] WARNING: ebtables not found in system path                          
[preflight] WARNING: ethtool not found in system path                           
```

Then you may be missing `ebtables`, `ethtool` or a similar executable on your Linux machine. You can install them with the following commands: 

- For ubuntu/debian users, run `apt install ebtables ethtool`.
- For CentOS/Fedora users, run `yum install ebtables ethtool`.

#### kubeadm blocks waiting for control plane during installation

If you notice that `kubeadm init` hangs after printing out the following line:

```
[apiclient] Created API client, waiting for the control plane to become ready                          
```

This may be caused by a number of problems. The most common are:

- network connection problems. Check that your machine has full network connectivity before continuing.
- the default cgroup driver configuration for the kubelet differs from that used by Docker.
  Check the system log file (e.g. `/var/log/message`) or examine the output from `journalctl -u kubelet`. If you see something like the following:

  ```shell
  error: failed to run Kubelet: failed to create kubelet: 
  misconfiguration: kubelet cgroup driver: "systemd" is different from docker cgroup driver: "cgroupfs"
  ```

  There are two common ways to fix the cgroup driver problem:
  
 1. Install docker again following instructions
  [here](/docs/setup/independent/install-kubeadm/#installing-docker).
 1. Change the kubelet config to match the Docker cgroup driver manually, you can refer to
    [Configure cgroup driver used by kubelet on Master Node](/docs/setup/independent/install-kubeadm/#configure-cgroup-driver-used-by-kubelet-on-master-node)
    for detailed instructions.
    The `kubectl describe pod` or `kubectl logs` commands can help you diagnose errors. For example:

```bash
kubectl -n ${NAMESPACE} describe pod ${POD_NAME}

kubectl -n ${NAMESPACE} logs ${POD_NAME} -c ${CONTAINER_NAME}
```
  
- control plane Docker containers are crashlooping or hanging. You can check this by running `docker ps` and investigating each container by running `docker logs`.


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

### Default NIC When using flannel as the pod network in Vagrant

The following error might indicate that something was wrong in the pod network:

```
Error from server (NotFound): the server could not find the requested resource
```

If you're using flannel as the pod network inside vagrant, then you will have to specify the default interface name for flannel.

Vagrant typically assigns two interfaces to all VMs. The first, for which all hosts are assigned the IP address `10.0.2.15`, is for external traffic that gets NATed.

This may lead to problems with flannel. By default, flannel selects the first interface on a host. This leads to all hosts thinking they have the same public IP address. To prevent this issue, pass the `--iface eth1` flag to flannel so that the second interface is chosen.

### Routing errors

In some situations `kubectl logs` and `kubectl run` commands may return with the following errors despite an otherwise apparently correctly working cluster:

```
Error from server: Get https://10.19.0.41:10250/containerLogs/default/mysql-ddc65b868-glc5m/mysql: dial tcp 10.19.0.41:10250: getsockopt: no route to host
```

This is due to Kubernetes using an IP that can not communicate with other IPs on the seemingly same subnet, possibly by policy of the machine provider. As an example, Digital Ocean assigns a public IP to `eth0` as well as a private one to be used internally as anchor for their floating IP feature, yet `kubelet` will pick the latter as the node's `InternalIP` instead of the public one.

Use `ip addr show` to check for this scenario instead of `ifconfig` because `ifconfig` will not display the offending alias IP address. Alternatively an API endpoint specific to Digital Ocean allows to query for the anchor IP from the droplet:

```
curl http://169.254.169.254/metadata/v1/interfaces/public/0/anchor_ipv4/address
```

The workaround is to tell `kubelet` which IP to use using `--node-ip`. When using Digital Ocean, it can be the public one (assigned to `eth0`) or the private one (assigned to `eth1`) should you want to use the optional private network. For example:

```
IFACE=eth0  # change to eth1 for DO's private network
DROPLET_IP_ADDRESS=$(ip addr show dev $IFACE | awk 'match($0,/inet (([0-9]|\.)+).* scope global/,a) { print a[1]; exit }')
echo $DROPLET_IP_ADDRESS  # check this, just in case
echo "Environment=\"KUBELET_EXTRA_ARGS=--node-ip=$DROPLET_IP_ADDRESS\"" >> /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
```

Please note that this assumes `KUBELET_EXTRA_ARGS` hasn't already been set in the unit file.

Then restart `kubelet`:

```
systemctl daemon-reload
systemctl restart kubelet
```
