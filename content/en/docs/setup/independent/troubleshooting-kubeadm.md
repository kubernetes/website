---
title: Troubleshooting kubeadm
---

{{% capture overview %}}

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

{{% /capture %}}

#### `ebtables` or some similar executable not found during installation

If you see the following warnings while running `kubeadm init`

```sh
[preflight] WARNING: ebtables not found in system path
[preflight] WARNING: ethtool not found in system path
```

Then you may be missing `ebtables`, `ethtool` or a similar executable on your node. You can install them with the following commands:

- For Ubuntu/Debian users, run `apt install ebtables ethtool`.
- For CentOS/Fedora users, run `yum install ebtables ethtool`.

#### kubeadm blocks waiting for control plane during installation

If you notice that `kubeadm init` hangs after printing out the following line:

```sh
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

- control plane Docker containers are crashlooping or hanging. You can check this by running `docker ps` and investigating each container by running `docker logs`.

#### kubeadm blocks when removing managed containers

The following could happen if Docker halts and does not remove any Kubernetes-managed containers:

```bash
sudo kubeadm reset
[preflight] Running pre-flight checks
[reset] Stopping the kubelet service
[reset] Unmounting mounted directories in "/var/lib/kubelet"
[reset] Removing kubernetes-managed containers
(block)
```

A possible solution is to restart the Docker service and then re-run `kubeadm reset`:

```bash
sudo systemctl restart docker.service
sudo kubeadm reset
```

Inspecting the logs for docker may also be useful:

```sh
journalctl -ul docker
```

#### Pods in `RunContainerError`, `CrashLoopBackOff` or `Error` state

Right after `kubeadm init` there should not be any pods in these states.

- If there are pods in one of these states _right after_ `kubeadm init`, please open an
  issue in the kubeadm repo. `coredns` (or `kube-dns`) should be in the `Pending` state
  until you have deployed the network solution.
- If you see Pods in the `RunContainerError`, `CrashLoopBackOff` or `Error` state
  after deploying the network solution and nothing happens to `coredns` (or `kube-dns`),
  it's very likely that the Pod Network solution and nothing happens to the DNS server, it's very
  likely that the Pod Network solution that you installed is somehow broken. You
  might have to grant it more RBAC privileges or use a newer version. Please file
  an issue in the Pod Network providers' issue tracker and get the issue triaged there.

#### `coredns` (or `kube-dns`) is stuck in the `Pending` state

This is **expected** and part of the design. kubeadm is network provider-agnostic, so the admin
should [install the pod network solution](/docs/concepts/cluster-administration/addons/)
of choice. You have to install a Pod Network
before CoreDNS may deployed fully. Hence the `Pending` state before the network is set up.

#### `HostPort` services do not work

The `HostPort` and `HostIP` functionality is available depending on your Pod Network
provider. Please contact the author of the Pod Network solution to find out whether
`HostPort` and `HostIP` functionality are available.

Calico, Canal, and Flannel CNI providers are verified to support HostPort.

For more information, see the [CNI portmap documentation](https://github.com/containernetworking/plugins/blob/master/plugins/meta/portmap/README.md).

If your network provider does not support the portmap CNI plugin, you may need to use the [NodePort feature of
services](/docs/concepts/services-networking/service/#type-nodeport) or use `HostNetwork=true`.

#### Pods are not accessible via their Service IP

- Many network add-ons do not yet enable [hairpin mode](https://kubernetes.io/docs/tasks/debug-application-cluster/debug-service/#a-pod-cannot-reach-itself-via-service-ip)
  which allows pods to access themselves via their Service IP. This is an issue related to
  [CNI](https://github.com/containernetworking/cni/issues/476). Please contact the network
  add-on provider to get the latest status of their support for hairpin mode.

- If you are using VirtualBox (directly or via Vagrant), you will need to
  ensure that `hostname -i` returns a routable IP address. By default the first
  interface is connected to a non-routable host-only network. A work around
  is to modify `/etc/hosts`, see this [Vagrantfile](https://github.com/errordeveloper/k8s-playground/blob/22dd39dfc06111235620e6c4404a96ae146f26fd/Vagrantfile#L11)
  for an example.

#### TLS certificate errors

The following error indicates a possible certificate mismatch.

```none
# kubectl get pods
Unable to connect to the server: x509: certificate signed by unknown authority (possibly because of "crypto/rsa: verification error" while trying to verify candidate authority certificate "kubernetes")
```

- Verify that the `$HOME/.kube/config` file contains a valid certificate, and
  regenerate a certificate if necessary. The certificates in a kubeconfig file
  are base64 encoded. The `base64 -d` command can be used to decode the certificate
  and `openssl x509 -text -noout` can be used for viewing the certificate information.
- Another workaround is to overwrite the existing `kubeconfig` for the "admin" user:

  ```sh
  mv  $HOME/.kube $HOME/.kube.bak
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config
  ```

#### Default NIC When using flannel as the pod network in Vagrant

The following error might indicate that something was wrong in the pod network:

```sh
Error from server (NotFound): the server could not find the requested resource
```

- If you're using flannel as the pod network inside Vagrant, then you will have to specify the default interface name for flannel.

  Vagrant typically assigns two interfaces to all VMs. The first, for which all hosts are assigned the IP address `10.0.2.15`, is for external traffic that gets NATed.

  This may lead to problems with flannel, which defaults to the first interface on a host. This leads to all hosts thinking they have the same public IP address. To prevent this, pass the `--iface eth1` flag to flannel so that the second interface is chosen.

#### Non-public IP used for containers

In some situations `kubectl logs` and `kubectl run` commands may return with the following errors in an otherwise functional cluster:

```sh
Error from server: Get https://10.19.0.41:10250/containerLogs/default/mysql-ddc65b868-glc5m/mysql: dial tcp 10.19.0.41:10250: getsockopt: no route to host
```

- This may be due to Kubernetes using an IP that can not communicate with other IPs on the seemingly same subnet, possibly by policy of the machine provider.
- Digital Ocean assigns a public IP to `eth0` as well as a private one to be used internally as anchor for their floating IP feature, yet `kubelet` will pick the latter as the node's `InternalIP` instead of the public one.

  Use `ip addr show` to check for this scenario instead of `ifconfig` because `ifconfig` will not display the offending alias IP address. Alternatively an API endpoint specific to Digital Ocean allows to query for the anchor IP from the droplet:

  ```sh
  curl http://169.254.169.254/metadata/v1/interfaces/public/0/anchor_ipv4/address
  ```

  The workaround is to tell `kubelet` which IP to use using `--node-ip`. When using Digital Ocean, it can be the public one (assigned to `eth0`) or the private one (assigned to `eth1`) should you want to use the optional private network. The [KubeletExtraArgs section of the MasterConfiguration file](https://github.com/kubernetes/kubernetes/blob/master/cmd/kubeadm/app/apis/kubeadm/v1alpha2/types.go#L147) can be used for this.

  Then restart `kubelet`:

  ```sh
  systemctl daemon-reload
  systemctl restart kubelet
  ```

#### Services with externalTrafficPolicy=Local are not reachable

On nodes where the hostname for the kubelet is overridden using the `--hostname-override` option, kube-proxy will default to treating 127.0.0.1 as the node IP, which results in rejecting connections for Services configured for `externalTrafficPolicy=Local`. This situation can be verified by checking the output of `kubectl -n kube-system logs <kube-proxy pod name>`:

```sh
W0507 22:33:10.372369       1 server.go:586] Failed to retrieve node info: nodes "ip-10-0-23-78" not found
W0507 22:33:10.372474       1 proxier.go:463] invalid nodeIP, initializing kube-proxy with 127.0.0.1 as nodeIP
```

A workaround for this is to modify the kube-proxy DaemonSet in the following way:

```sh
kubectl -n kube-system patch --type json daemonset kube-proxy -p "$(cat <<'EOF'
[
    {
        "op": "add",
        "path": "/spec/template/spec/containers/0/env",
        "value": [
            {
                "name": "NODE_NAME",
                "valueFrom": {
                    "fieldRef": {
                        "apiVersion": "v1",
                        "fieldPath": "spec.nodeName"
                    }
                }
            }
        ]
    },
    {
        "op": "add",
        "path": "/spec/template/spec/containers/0/command/-",
        "value": "--hostname-override=${NODE_NAME}"
    }
]
EOF
)"

```
