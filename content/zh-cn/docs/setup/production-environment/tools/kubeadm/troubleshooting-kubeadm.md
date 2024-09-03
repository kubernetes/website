---
title: 对 kubeadm 进行故障排查
content_type: concept
weight: 20
---
<!--
title: Troubleshooting kubeadm
content_type: concept
weight: 20
-->
<!-- overview -->

<!--
As with any program, you might run into an error installing or running kubeadm.
This page lists some common failure scenarios and have provided steps that can help you understand and fix the problem.

If your problem is not listed below, please follow the following steps:

- If you think your problem is a bug with kubeadm:
  - Go to [github.com/kubernetes/kubeadm](https://github.com/kubernetes/kubeadm/issues) and search for existing issues.
  - If no issue exists, please [open one](https://github.com/kubernetes/kubeadm/issues/new) and follow the issue template.

- If you are unsure about how kubeadm works, you can ask on [Slack](https://slack.k8s.io/) in `#kubeadm`,
  or open a question on [StackOverflow](https://stackoverflow.com/questions/tagged/kubernetes). Please include
  relevant tags like `#kubernetes` and `#kubeadm` so folks can help you.
-->
与任何程序一样，你可能会在安装或者运行 kubeadm 时遇到错误。
本文列举了一些常见的故障场景，并提供可帮助你理解和解决这些问题的步骤。

如果你的问题未在下面列出，请执行以下步骤：

- 如果你认为问题是 kubeadm 的错误：
  - 转到 [github.com/kubernetes/kubeadm](https://github.com/kubernetes/kubeadm/issues) 并搜索存在的问题。
  - 如果没有问题，请 [打开](https://github.com/kubernetes/kubeadm/issues/new) 并遵循问题模板。

- 如果你对 kubeadm 的工作方式有疑问，可以在 [Slack](https://slack.k8s.io/) 上的 `#kubeadm` 频道提问，
  或者在 [StackOverflow](https://stackoverflow.com/questions/tagged/kubernetes) 上提问。
  请加入相关标签，例如 `#kubernetes` 和 `#kubeadm`，这样其他人可以帮助你。

<!-- body -->

<!--
## Not possible to join a v1.18 Node to a v1.17 cluster due to missing RBAC
-->
## 由于缺少 RBAC，无法将 v1.18 Node 加入 v1.17 集群

<!--
In v1.18 kubeadm added prevention for joining a Node in the cluster if a Node with the same name already exists.
This required adding RBAC for the bootstrap-token user to be able to GET a Node object.

However this causes an issue where `kubeadm join` from v1.18 cannot join a cluster created by kubeadm v1.17.
-->
自从 v1.18 后，如果集群中已存在同名 Node，kubeadm 将禁止 Node 加入集群。
这需要为 bootstrap-token 用户添加 RBAC 才能 GET Node 对象。

但这会导致一个问题，v1.18 的 `kubeadm join` 无法加入由 kubeadm v1.17 创建的集群。

<!--
To workaround the issue you have two options:

Execute `kubeadm init phase bootstrap-token` on a control-plane node using kubeadm v1.18.
Note that this enables the rest of the bootstrap-token permissions as well.

or

Apply the following RBAC manually using `kubectl apply -f ...`:
-->
要解决此问题，你有两种选择：

使用 kubeadm v1.18 在控制平面节点上执行 `kubeadm init phase bootstrap-token`。
请注意，这也会启用 bootstrap-token 的其余权限。

或者，也可以使用 `kubectl apply -f ...` 手动应用以下 RBAC：

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: kubeadm:get-nodes
rules:
- apiGroups:
  - ""
  resources:
  - nodes
  verbs:
  - get
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: kubeadm:get-nodes
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: kubeadm:get-nodes
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: Group
  name: system:bootstrappers:kubeadm:default-node-token
```

<!--
## `ebtables` or some similar executable not found during installation

If you see the following warnings while running `kubeadm init`
-->
## 在安装过程中没有找到 `ebtables` 或者其他类似的可执行文件

如果在运行 `kubeadm init` 命令时，遇到以下的警告

```console
[preflight] WARNING: ebtables not found in system path
[preflight] WARNING: ethtool not found in system path
```

<!--
Then you may be missing `ebtables`, `ethtool` or a similar executable on your node.
You can install them with the following commands:

- For Ubuntu/Debian users, run `apt install ebtables ethtool`.
- For CentOS/Fedora users, run `yum install ebtables ethtool`.
-->
那么或许在你的节点上缺失 `ebtables`、`ethtool` 或者类似的可执行文件。
你可以使用以下命令安装它们：

- 对于 Ubuntu/Debian 用户，运行 `apt install ebtables ethtool` 命令。
- 对于 CentOS/Fedora 用户，运行 `yum install ebtables ethtool` 命令。

<!--
## kubeadm blocks waiting for control plane during installation

If you notice that `kubeadm init` hangs after printing out the following line:
-->
## 在安装过程中，kubeadm 一直等待控制平面就绪

如果你注意到 `kubeadm init` 在打印以下行后挂起：

```console
[apiclient] Created API client, waiting for the control plane to become ready
```

<!--
This may be caused by a number of problems. The most common are:

- network connection problems. Check that your machine has full network connectivity before continuing.
- the cgroup driver of the container runtime differs from that of the kubelet. To understand how to
  configure it properly, see [Configuring a cgroup driver](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/).
- control plane containers are crashlooping or hanging. You can check this by running `docker ps`
  and investigating each container by running `docker logs`. For other container runtime, see
  [Debugging Kubernetes nodes with crictl](/docs/tasks/debug/debug-cluster/crictl/).
-->
这可能是由许多问题引起的。最常见的是：

- 网络连接问题。在继续之前，请检查你的计算机是否具有全部联通的网络连接。
- 容器运行时的 cgroup 驱动不同于 kubelet 使用的 cgroup 驱动。要了解如何正确配置 cgroup 驱动，
  请参阅[配置 cgroup 驱动](/zh-cn/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/)。
- 控制平面上的 Docker 容器持续进入崩溃状态或（因其他原因）挂起。你可以运行 `docker ps` 命令来检查以及 `docker logs`
  命令来检视每个容器的运行日志。
  对于其他容器运行时，请参阅[使用 crictl 对 Kubernetes 节点进行调试](/zh-cn/docs/tasks/debug/debug-cluster/crictl/)。

<!--
## kubeadm blocks when removing managed containers

The following could happen if the container runtime halts and does not remove
any Kubernetes-managed containers:
-->
## 当删除托管容器时 kubeadm 阻塞

如果容器运行时停止并且未删除 Kubernetes 所管理的容器，可能发生以下情况：

```shell
sudo kubeadm reset
```

```console
[preflight] Running pre-flight checks
[reset] Stopping the kubelet service
[reset] Unmounting mounted directories in "/var/lib/kubelet"
[reset] Removing kubernetes-managed containers
(block)
```

<!--
A possible solution is to restart the container runtime and then re-run `kubeadm reset`.
You can also use `crictl` to debug the state of the container runtime. See
[Debugging Kubernetes nodes with crictl](/docs/tasks/debug/debug-cluster/crictl/).
-->
一个可行的解决方案是重新启动 Docker 服务，然后重新运行 `kubeadm reset`：
你也可以使用 `crictl` 来调试容器运行时的状态。
参见[使用 CRICTL 调试 Kubernetes 节点](/zh-cn/docs/tasks/debug/debug-cluster/crictl/)。

<!--
## Pods in `RunContainerError`, `CrashLoopBackOff` or `Error` state

Right after `kubeadm init` there should not be any pods in these states.

- If there are pods in one of these states _right after_ `kubeadm init`, please open an
  issue in the kubeadm repo. `coredns` (or `kube-dns`) should be in the `Pending` state
  until you have deployed the network add-on.
- If you see Pods in the `RunContainerError`, `CrashLoopBackOff` or `Error` state
  after deploying the network add-on and nothing happens to `coredns` (or `kube-dns`),
  it's very likely that the Pod Network add-on that you installed is somehow broken.
  You might have to grant it more RBAC privileges or use a newer version. Please file
  an issue in the Pod Network providers' issue tracker and get the issue triaged there.
-->
## Pod 处于 `RunContainerError`、`CrashLoopBackOff` 或者 `Error` 状态

在 `kubeadm init` 命令运行后，系统中不应该有 Pod 处于这类状态。

- 在 `kubeadm init` 命令执行完后，如果有 Pod 处于这些状态之一，请在 kubeadm
  仓库提起一个 issue。`coredns` (或者 `kube-dns`) 应该处于 `Pending` 状态，
  直到你部署了网络插件为止。

- 如果在部署完网络插件之后，有 Pod 处于 `RunContainerError`、`CrashLoopBackOff`
  或 `Error` 状态之一，并且 `coredns` （或者 `kube-dns`）仍处于 `Pending` 状态，
  那很可能是你安装的网络插件由于某种原因无法工作。你或许需要授予它更多的
  RBAC 特权或使用较新的版本。请在 Pod Network 提供商的问题跟踪器中提交问题，
  然后在此处分类问题。

<!--
## `coredns` is stuck in the `Pending` state

This is **expected** and part of the design. kubeadm is network provider-agnostic, so the admin
should [install the pod network add-on](/docs/concepts/cluster-administration/addons/)
of choice. You have to install a Pod Network
before CoreDNS may be deployed fully. Hence the `Pending` state before the network is set up.
-->
## `coredns` 停滞在 `Pending` 状态

这一行为是**预期之中**的，因为系统就是这么设计的。kubeadm 的网络供应商是中立的，
因此管理员应该选择[安装 Pod 的网络插件](/zh-cn/docs/concepts/cluster-administration/addons/)。
你必须完成 Pod 的网络配置，然后才能完全部署 CoreDNS。
在网络被配置好之前，DNS 组件会一直处于 `Pending` 状态。

<!--
## `HostPort` services do not work

The `HostPort` and `HostIP` functionality is available depending on your Pod Network
provider. Please contact the author of the Pod Network add-on to find out whether
`HostPort` and `HostIP` functionality are available.

Calico, Canal, and Flannel CNI providers are verified to support HostPort.

For more information, see the
[CNI portmap documentation](https://github.com/containernetworking/plugins/blob/master/plugins/meta/portmap/README.md).

If your network provider does not support the portmap CNI plugin, you may need to use the
[NodePort feature of services](/docs/concepts/services-networking/service/#type-nodeport)
or use `HostNetwork=true`.
-->
## `HostPort` 服务无法工作

此 `HostPort` 和 `HostIP` 功能是否可用取决于你的 Pod 网络配置。请联系 Pod 网络插件的作者，
以确认 `HostPort` 和 `HostIP` 功能是否可用。

已验证 Calico、Canal 和 Flannel CNI 驱动程序支持 HostPort。

有关更多信息，请参考 [CNI portmap 文档](https://github.com/containernetworking/plugins/blob/master/plugins/meta/portmap/README.md).

如果你的网络提供商不支持 portmap CNI 插件，你或许需要使用
[NodePort 服务的功能](/zh-cn/docs/concepts/services-networking/service/#type-nodeport)或者使用
`HostNetwork=true`。

<!--
## Pods are not accessible via their Service IP

- Many network add-ons do not yet enable [hairpin mode](/docs/tasks/debug/debug-application/debug-service/#a-pod-fails-to-reach-itself-via-the-service-ip)
  which allows pods to access themselves via their Service IP. This is an issue related to
  [CNI](https://github.com/containernetworking/cni/issues/476). Please contact the network
  add-on provider to get the latest status of their support for hairpin mode.

- If you are using VirtualBox (directly or via Vagrant), you will need to
  ensure that `hostname -i` returns a routable IP address. By default, the first
  interface is connected to a non-routable host-only network. A work around
  is to modify `/etc/hosts`, see this
  [Vagrantfile](https://github.com/errordeveloper/k8s-playground/blob/22dd39dfc06111235620e6c4404a96ae146f26fd/Vagrantfile#L11)
  for an example.
-->
## 无法通过其服务 IP 访问 Pod

- 许多网络附加组件尚未启用 [hairpin 模式](/zh-cn/docs/tasks/debug/debug-application/debug-service/#a-pod-fails-to-reach-itself-via-the-service-ip)
  该模式允许 Pod 通过其服务 IP 进行访问。这是与 [CNI](https://github.com/containernetworking/cni/issues/476) 有关的问题。
  请与网络附加组件提供商联系，以获取他们所提供的 hairpin 模式的最新状态。

- 如果你正在使用 VirtualBox (直接使用或者通过 Vagrant 使用)，你需要
  确保 `hostname -i` 返回一个可路由的 IP 地址。默认情况下，第一个接口连接不能路由的仅主机网络。
  解决方法是修改 `/etc/hosts`，请参考示例
  [Vagrantfile](https://github.com/errordeveloper/k8s-playground/blob/22dd39dfc06111235620e6c4404a96ae146f26fd/Vagrantfile#L11)。

<!--
## TLS certificate errors

The following error indicates a possible certificate mismatch.
-->
## TLS 证书错误

以下错误说明证书可能不匹配。

```none
# kubectl get pods
Unable to connect to the server: x509: certificate signed by unknown authority (possibly because of "crypto/rsa: verification error" while trying to verify candidate authority certificate "kubernetes")
```

<!--
- Verify that the `$HOME/.kube/config` file contains a valid certificate, and
  regenerate a certificate if necessary. The certificates in a kubeconfig file
  are base64 encoded. The `base64 --decode` command can be used to decode the certificate
  and `openssl x509 -text -noout` can be used for viewing the certificate information.

- Unset the `KUBECONFIG` environment variable using:
-->
- 验证 `$HOME/.kube/config` 文件是否包含有效证书，
  并在必要时重新生成证书。在 kubeconfig 文件中的证书是 base64 编码的。
  该 `base64 --decode` 命令可以用来解码证书，`openssl x509 -text -noout`
  命令可以用于查看证书信息。

- 使用如下方法取消设置 `KUBECONFIG` 环境变量的值：

  ```shell
  unset KUBECONFIG
  ```

  <!--
  Or set it to the default `KUBECONFIG` location:
  -->
  或者将其设置为默认的 `KUBECONFIG` 位置：

  ```shell
  export KUBECONFIG=/etc/kubernetes/admin.conf
  ```

<!--
- Another workaround is to overwrite the existing `kubeconfig` for the "admin" user:
-->
- 另一个方法是覆盖 `kubeconfig` 的现有用户 "管理员"：

  ```shell
  mv $HOME/.kube $HOME/.kube.bak
  mkdir $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config
  ```

<!--
## Kubelet client certificate rotation fails {#kubelet-client-cert}

By default, kubeadm configures a kubelet with automatic rotation of client certificates by using the
`/var/lib/kubelet/pki/kubelet-client-current.pem` symlink specified in `/etc/kubernetes/kubelet.conf`.
If this rotation process fails you might see errors such as `x509: certificate has expired or is not yet valid`
in kube-apiserver logs. To fix the issue you must follow these steps:
-->
## Kubelet 客户端证书轮换失败   {#kubelet-client-cert}

默认情况下，kubeadm 使用 `/etc/kubernetes/kubelet.conf` 中指定的 `/var/lib/kubelet/pki/kubelet-client-current.pem`
符号链接来配置 kubelet 自动轮换客户端证书。如果此轮换过程失败，你可能会在 kube-apiserver 日志中看到诸如
`x509: certificate has expired or is not yet valid` 之类的错误。要解决此问题，你必须执行以下步骤：
<!--
1. Backup and delete `/etc/kubernetes/kubelet.conf` and `/var/lib/kubelet/pki/kubelet-client*` from the failed node.
1. From a working control plane node in the cluster that has `/etc/kubernetes/pki/ca.key` execute
   `kubeadm kubeconfig user --org system:nodes --client-name system:node:$NODE > kubelet.conf`.
   `$NODE` must be set to the name of the existing failed node in the cluster.
   Modify the resulted `kubelet.conf` manually to adjust the cluster name and server endpoint,
   (see [Generating kubeconfig files for additional users](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#kubeconfig-additional-users)). If your cluster does not have
   the `ca.key` you must sign the embedded certificates in the `kubelet.conf` externally.
-->
1. 从故障节点备份和删除 `/etc/kubernetes/kubelet.conf` 和 `/var/lib/kubelet/pki/kubelet-client*`。
2. 在集群中具有 `/etc/kubernetes/pki/ca.key` 的、正常工作的控制平面节点上
   执行 `kubeadm kubeconfig user --org system:nodes --client-name system:node:$NODE > kubelet.conf`。
   `$NODE` 必须设置为集群中现有故障节点的名称。
   手动修改生成的 `kubelet.conf` 以调整集群名称和服务器端点，
   或传递 `kubeconfig user --config`
  （请参阅[为其他用户生成 kubeconfig 文件](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#kubeconfig-additional-users)）。
   如果你的集群没有 `ca.key`，你必须在外部对 `kubelet.conf` 中的嵌入式证书进行签名。
<!--
1. Copy this resulted `kubelet.conf` to `/etc/kubernetes/kubelet.conf` on the failed node.
1. Restart the kubelet (`systemctl restart kubelet`) on the failed node and wait for
   `/var/lib/kubelet/pki/kubelet-client-current.pem` to be recreated.
-->
3. 将得到的 `kubelet.conf` 文件复制到故障节点上，作为 `/etc/kubernetes/kubelet.conf`。
4. 在故障节点上重启 kubelet（`systemctl restart kubelet`），等待 `/var/lib/kubelet/pki/kubelet-client-current.pem` 重新创建。
<!--
1. Manually edit the `kubelet.conf` to point to the rotated kubelet client certificates, by replacing
   `client-certificate-data` and `client-key-data` with:
-->
5. 手动编辑 `kubelet.conf` 指向轮换的 kubelet 客户端证书，方法是将 `client-certificate-data` 和 `client-key-data` 替换为：

   ```yaml
   client-certificate: /var/lib/kubelet/pki/kubelet-client-current.pem
   client-key: /var/lib/kubelet/pki/kubelet-client-current.pem
   ```

<!--
1. Restart the kubelet.
1. Make sure the node becomes `Ready`.
-->
6. 重新启动 kubelet。
7. 确保节点状况变为 `Ready`。

<!--
## Default NIC When using flannel as the pod network in Vagrant

The following error might indicate that something was wrong in the pod network:
-->
## 在 Vagrant 中使用 flannel 作为 Pod 网络时的默认 NIC

以下错误可能表明 Pod 网络中出现问题：

```console
Error from server (NotFound): the server could not find the requested resource
```

<!--
- If you're using flannel as the pod network inside Vagrant, then you will have to
  specify the default interface name for flannel.

  Vagrant typically assigns two interfaces to all VMs. The first, for which all hosts
  are assigned the IP address `10.0.2.15`, is for external traffic that gets NATed.

  This may lead to problems with flannel, which defaults to the first interface on a host.
  This leads to all hosts thinking they have the same public IP address. To prevent this,
  pass the `--iface eth1` flag to flannel so that the second interface is chosen.
-->
- 如果你正在 Vagrant 中使用 flannel 作为 Pod 网络，则必须指定 flannel 的默认接口名称。

  Vagrant 通常为所有 VM 分配两个接口。第一个为所有主机分配了 IP 地址 `10.0.2.15`，用于获得 NATed 的外部流量。

  这可能会导致 flannel 出现问题，它默认为主机上的第一个接口。这导致所有主机认为它们具有相同的公共
  IP 地址。为防止这种情况，传递 `--iface eth1` 标志给 flannel 以便选择第二个接口。

<!--
## Non-public IP used for containers

In some situations `kubectl logs` and `kubectl run` commands may return with the
following errors in an otherwise functional cluster:
-->
## 容器使用的非公共 IP

在某些情况下 `kubectl logs` 和 `kubectl run` 命令或许会返回以下错误，即便除此之外集群一切功能正常：

```console
Error from server: Get https://10.19.0.41:10250/containerLogs/default/mysql-ddc65b868-glc5m/mysql: dial tcp 10.19.0.41:10250: getsockopt: no route to host
```

<!--
- This may be due to Kubernetes using an IP that can not communicate with other IPs on
  the seemingly same subnet, possibly by policy of the machine provider.
- DigitalOcean assigns a public IP to `eth0` as well as a private one to be used internally
  as anchor for their floating IP feature, yet `kubelet` will pick the latter as the node's
  `InternalIP` instead of the public one.

  Use `ip addr show` to check for this scenario instead of `ifconfig` because `ifconfig` will
  not display the offending alias IP address. Alternatively an API endpoint specific to
  DigitalOcean allows to query for the anchor IP from the droplet:
-->
- 这或许是由于 Kubernetes 使用的 IP 无法与看似相同的子网上的其他 IP 进行通信的缘故，
  可能是由机器提供商的政策所导致的。
- DigitalOcean 既分配一个共有 IP 给 `eth0`，也分配一个私有 IP 在内部用作其浮动 IP 功能的锚点，
  然而 `kubelet` 将选择后者作为节点的 `InternalIP` 而不是公共 IP。

  使用 `ip addr show` 命令代替 `ifconfig` 命令去检查这种情况，因为 `ifconfig` 命令
  不会显示有问题的别名 IP 地址。或者指定的 DigitalOcean 的 API 端口允许从 droplet 中
  查询 anchor IP：

  ```sh
  curl http://169.254.169.254/metadata/v1/interfaces/public/0/anchor_ipv4/address
  ```

  <!--
  The workaround is to tell `kubelet` which IP to use using `--node-ip`.
  When using DigitalOcean, it can be the public one (assigned to `eth0`) or
  the private one (assigned to `eth1`) should you want to use the optional
  private network. The `kubeletExtraArgs` section of the kubeadm
  [`NodeRegistrationOptions` structure](/docs/reference/config-api/kubeadm-config.v1beta4/#kubeadm-k8s-io-v1beta4-NodeRegistrationOptions)
  can be used for this.

  Then restart `kubelet`:
  -->
  解决方法是通知 `kubelet` 使用哪个 `--node-ip`。当使用 DigitalOcean 时，可以是（分配给 `eth0` 的）公网 IP，
  或者是（分配给 `eth1` 的）私网 IP。私网 IP 是可选的。
  kubadm [`NodeRegistrationOptions` 结构](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4/#kubeadm-k8s-io-v1beta4-NodeRegistrationOptions)
  的 `KubeletExtraArgs` 部分被用来处理这种情况。

  然后重启 `kubelet`：

  ```shell
  systemctl daemon-reload
  systemctl restart kubelet
  ```

<!--
## `coredns` pods have `CrashLoopBackOff` or `Error` state

If you have nodes that are running SELinux with an older version of Docker, you might experience a scenario
where the `coredns` pods are not starting. To solve that, you can try one of the following options:

- Upgrade to a [newer version of Docker](/docs/setup/production-environment/container-runtimes/#docker).

- [Disable SELinux](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/6/html/security-enhanced_linux/sect-security-enhanced_linux-enabling_and_disabling_selinux-disabling_selinux).
- Modify the `coredns` deployment to set `allowPrivilegeEscalation` to `true`:
-->
## `coredns` Pod 有 `CrashLoopBackOff` 或者 `Error` 状态

如果有些节点运行的是旧版本的 Docker，同时启用了 SELinux，你或许会遇到 `coredns` Pod 无法启动的情况。
要解决此问题，你可以尝试以下选项之一：

- 升级到 [Docker 的较新版本](/zh-cn/docs/setup/production-environment/container-runtimes/#docker)。

- [禁用 SELinux](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/6/html/security-enhanced_linux/sect-security-enhanced_linux-enabling_and_disabling_selinux-disabling_selinux)。

- 修改 `coredns` 部署以设置 `allowPrivilegeEscalation` 为 `true`：

```shell
kubectl -n kube-system get deployment coredns -o yaml | \
  sed 's/allowPrivilegeEscalation: false/allowPrivilegeEscalation: true/g' | \
  kubectl apply -f -
```

<!--
Another cause for CoreDNS to have `CrashLoopBackOff` is when a CoreDNS Pod deployed in Kubernetes detects a loop.
[A number of workarounds](https://github.com/coredns/coredns/tree/master/plugin/loop#troubleshooting-loops-in-kubernetes-clusters)
are available to avoid Kubernetes trying to restart the CoreDNS Pod every time CoreDNS detects the loop and exits.
-->
CoreDNS 处于 `CrashLoopBackOff` 时的另一个原因是当 Kubernetes 中部署的 CoreDNS Pod 检测到环路时。
[有许多解决方法](https://github.com/coredns/coredns/tree/master/plugin/loop#troubleshooting-loops-in-kubernetes-clusters)
可以避免在每次 CoreDNS 监测到循环并退出时，Kubernetes 尝试重启 CoreDNS Pod 的情况。

{{< warning >}}
<!--
Disabling SELinux or setting `allowPrivilegeEscalation` to `true` can compromise
the security of your cluster.
-->
禁用 SELinux 或设置 `allowPrivilegeEscalation` 为 `true` 可能会损害集群的安全性。
{{< /warning >}}

<!--
## etcd pods restart continually

If you encounter the following error:
-->
## etcd Pod 持续重启

如果你遇到以下错误：

```console
rpc error: code = 2 desc = oci runtime error: exec failed: container_linux.go:247: starting container process caused "process_linux.go:110: decoding init error from pipe caused \"read parent: connection reset by peer\""
```

<!--
This issue appears if you run CentOS 7 with Docker 1.13.1.84.
This version of Docker can prevent the kubelet from executing into the etcd container.

To work around the issue, choose one of these options:

- Roll back to an earlier version of Docker, such as 1.13.1-75
-->
如果你使用 Docker 1.13.1.84 运行 CentOS 7 就会出现这种问题。
此版本的 Docker 会阻止 kubelet 在 etcd 容器中执行。

为解决此问题，请选择以下选项之一：

- 回滚到早期版本的 Docker，例如 1.13.1-75

  ```shell
  yum downgrade docker-1.13.1-75.git8633870.el7.centos.x86_64 docker-client-1.13.1-75.git8633870.el7.centos.x86_64 docker-common-1.13.1-75.git8633870.el7.centos.x86_64
  ```

<!--
- Install one of the more recent recommended versions, such as 18.06:
-->
- 安装较新的推荐版本之一，例如 18.06：

  ```shell
  sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
  yum install docker-ce-18.06.1.ce-3.el7.x86_64
  ```

<!--
## Not possible to pass a comma separated list of values to arguments inside a `--component-extra-args` flag

`kubeadm init` flags such as `--component-extra-args` allow you to pass custom arguments to a control-plane
component like the kube-apiserver. However, this mechanism is limited due to the underlying type used for parsing
the values (`mapStringString`).

If you decide to pass an argument that supports multiple, comma-separated values such as
`--apiserver-extra-args "enable-admission-plugins=LimitRanger,NamespaceExists"` this flag will fail with
`flag: malformed pair, expect string=string`. This happens because the list of arguments for
`--apiserver-extra-args` expects `key=value` pairs and in this case `NamespacesExists` is considered
as a key that is missing a value.

Alternatively, you can try separating the `key=value` pairs like so:
`--apiserver-extra-args "enable-admission-plugins=LimitRanger,enable-admission-plugins=NamespaceExists"`
but this will result in the key `enable-admission-plugins` only having the value of `NamespaceExists`.

A known workaround is to use the kubeadm [configuration file](/docs/reference/config-api/kubeadm-config.v1beta4/).
-->
## 无法将以逗号分隔的值列表传递给 `--component-extra-args` 标志内的参数

`kubeadm init` 标志例如 `--component-extra-args` 允许你将自定义参数传递给像
kube-apiserver 这样的控制平面组件。然而，由于解析 (`mapStringString`) 的基础类型值，此机制将受到限制。

如果你决定传递一个支持多个逗号分隔值（例如
`--apiserver-extra-args "enable-admission-plugins=LimitRanger,NamespaceExists"`）参数，
将出现 `flag: malformed pair, expect string=string` 错误。
发生这种问题是因为参数列表 `--apiserver-extra-args` 预期的是 `key=value` 形式，
而这里的 `NamespacesExists` 被误认为是缺少取值的键名。

一种解决方法是尝试分离 `key=value` 对，像这样：
`--apiserver-extra-args "enable-admission-plugins=LimitRanger,enable-admission-plugins=NamespaceExists"`
但这将导致键 `enable-admission-plugins` 仅有值 `NamespaceExists`。

已知的解决方法是使用 kubeadm
[配置文件](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4/)。

<!--
## kube-proxy scheduled before node is initialized by cloud-controller-manager

In cloud provider scenarios, kube-proxy can end up being scheduled on new worker nodes before
the cloud-controller-manager has initialized the node addresses. This causes kube-proxy to fail
to pick up the node's IP address properly and has knock-on effects to the proxy function managing
load balancers.

The following error can be seen in kube-proxy Pods:
-->
## 在节点被云控制管理器初始化之前，kube-proxy 就被调度了

在云环境场景中，可能出现在云控制管理器完成节点地址初始化之前，kube-proxy 就被调度到新节点了。
这会导致 kube-proxy 无法正确获取节点的 IP 地址，并对管理负载平衡器的代理功能产生连锁反应。

在 kube-proxy Pod 中可以看到以下错误：

```console
server.go:610] Failed to retrieve node IP: host IP unknown; known addresses: []
proxier.go:340] invalid nodeIP, initializing kube-proxy with 127.0.0.1 as nodeIP
```

<!--
A known solution is to patch the kube-proxy DaemonSet to allow scheduling it on control-plane
nodes regardless of their conditions, keeping it off of other nodes until their initial guarding
conditions abate:
-->
一种已知的解决方案是修补 kube-proxy DaemonSet，以允许在控制平面节点上调度它，
而不管它们的条件如何，将其与其他节点保持隔离，直到它们的初始保护条件消除：

```shell
kubectl -n kube-system patch ds kube-proxy -p='{
  "spec": {
    "template": {
      "spec": {
        "tolerations": [
          {
            "key": "CriticalAddonsOnly",
            "operator": "Exists"
          },
          {
            "effect": "NoSchedule",
            "key": "node-role.kubernetes.io/control-plane"
          }
        ]
      }
    }
  }
}'
```

<!--
The tracking issue for this problem is [here](https://github.com/kubernetes/kubeadm/issues/1027).
-->
此问题的跟踪[在这里](https://github.com/kubernetes/kubeadm/issues/1027)。

<!--
## `/usr` is mounted read-only on nodes {#usr-mounted-read-only}

On Linux distributions such as Fedora CoreOS or Flatcar Container Linux, the directory `/usr` is mounted as a read-only filesystem.
For [flex-volume support](https://github.com/kubernetes/community/blob/ab55d85/contributors/devel/sig-storage/flexvolume.md),
Kubernetes components like the kubelet and kube-controller-manager use the default path of
`/usr/libexec/kubernetes/kubelet-plugins/volume/exec/`, yet the flex-volume directory _must be writeable_
for the feature to work.
-->
## 节点上的 `/usr` 被以只读方式挂载 {#usr-mounted-read-only}

在类似 Fedora CoreOS 或者 Flatcar Container Linux 这类 Linux 发行版本中，
目录 `/usr` 是以只读文件系统的形式挂载的。
在支持 [FlexVolume](https://github.com/kubernetes/community/blob/ab55d85/contributors/devel/sig-storage/flexvolume.md) 时，
类似 kubelet 和 kube-controller-manager 这类 Kubernetes 组件使用默认路径
`/usr/libexec/kubernetes/kubelet-plugins/volume/exec/`，
而 FlexVolume 的目录**必须是可写入的**，该功能特性才能正常工作。

{{< note >}}
<!--
FlexVolume was deprecated in the Kubernetes v1.23 release.
-->
FlexVolume 在 Kubernetes v1.23 版本中已被弃用。
{{< /note >}}

<!--
To workaround this issue, you can configure the flex-volume directory using the kubeadm
[configuration file](/docs/reference/config-api/kubeadm-config.v1beta4/).

On the primary control-plane Node (created using `kubeadm init`), pass the following
file using `--config`:
-->
为了解决这个问题，你可以使用 kubeadm 的[配置文件](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4/)来配置
FlexVolume 的目录。

在（使用 `kubeadm init` 创建的）主控制节点上，使用 `--config`
参数传入如下文件：

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: InitConfiguration
nodeRegistration:
  kubeletExtraArgs:
  - name: "volume-plugin-dir"
    value: "/opt/libexec/kubernetes/kubelet-plugins/volume/exec/"
---
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
controllerManager:
  extraArgs:
  - name: "flex-volume-plugin-dir"
    value: "/opt/libexec/kubernetes/kubelet-plugins/volume/exec/"
```

<!--
On joining Nodes:
-->
在加入到集群中的节点上，使用下面的文件：

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
nodeRegistration:
  kubeletExtraArgs:
  - name: "volume-plugin-dir"
    value: "/opt/libexec/kubernetes/kubelet-plugins/volume/exec/"
```

<!--
Alternatively, you can modify `/etc/fstab` to make the `/usr` mount writeable, but please
be advised that this is modifying a design principle of the Linux distribution.
-->
或者，你可以更改 `/etc/fstab` 使得 `/usr` 目录能够以可写入的方式挂载，
不过请注意这样做本质上是在更改 Linux 发行版的某种设计原则。

<!--
## `kubeadm upgrade plan` prints out `context deadline exceeded` error message

This error message is shown when upgrading a Kubernetes cluster with `kubeadm` in
the case of running an external etcd. This is not a critical bug and happens because
older versions of kubeadm perform a version check on the external etcd cluster.
You can proceed with `kubeadm upgrade apply ...`.

This issue is fixed as of version 1.19.
-->
## `kubeadm upgrade plan` 输出错误信息 `context deadline exceeded`

在使用 `kubeadm` 来升级某运行外部 etcd 的 Kubernetes 集群时可能显示这一错误信息。
这并不是一个非常严重的一个缺陷，之所以出现此错误信息，原因是老的 kubeadm
版本会对外部 etcd 集群执行版本检查。你可以继续执行 `kubeadm upgrade apply ...`。

这一问题已经在 1.19 版本中得到修复。

<!--
## `kubeadm reset` unmounts `/var/lib/kubelet`

If `/var/lib/kubelet` is being mounted, performing a `kubeadm reset` will effectively unmount it.

To workaround the issue, re-mount the `/var/lib/kubelet` directory after performing the `kubeadm reset` operation.

This is a regression introduced in kubeadm 1.15. The issue is fixed in 1.20.
-->
## `kubeadm reset` 会卸载 `/var/lib/kubelet`

如果已经挂载了 `/var/lib/kubelet` 目录，执行 `kubeadm reset`
操作的时候会将其卸载。

要解决这一问题，可以在执行了 `kubeadm reset` 操作之后重新挂载
`/var/lib/kubelet` 目录。

这是一个在 1.15 中引入的故障，已经在 1.20 版本中修复。

<!--
## Cannot use the metrics-server securely in a kubeadm cluster

In a kubeadm cluster, the [metrics-server](https://github.com/kubernetes-sigs/metrics-server)
can be used insecurely by passing the `--kubelet-insecure-tls` to it. This is not recommended for production clusters.
-->
## 无法在 kubeadm 集群中安全地使用 metrics-server

在 kubeadm 集群中可以通过为 [metrics-server](https://github.com/kubernetes-sigs/metrics-server)
设置 `--kubelet-insecure-tls` 来以不安全的形式使用该服务。
建议不要在生产环境集群中这样使用。

<!--
If you want to use TLS between the metrics-server and the kubelet there is a problem,
since kubeadm deploys a self-signed serving certificate for the kubelet. This can cause the following errors
on the side of the metrics-server:
-->
如果你需要在 metrics-server 和 kubelet 之间使用 TLS，会有一个问题，
kubeadm 为 kubelet 部署的是自签名的服务证书。这可能会导致 metrics-server
端报告下面的错误信息：

```console
x509: certificate signed by unknown authority
x509: certificate is valid for IP-foo not IP-bar
```

<!--
See [Enabling signed kubelet serving certificates](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#kubelet-serving-certs)
to understand how to configure the kubelets in a kubeadm cluster to have properly signed serving certificates.

Also see [How to run the metrics-server securely](https://github.com/kubernetes-sigs/metrics-server/blob/master/FAQ.md#how-to-run-metrics-server-securely).
-->
参见[为 kubelet 启用签名的服务证书](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#kubelet-serving-certs)
以进一步了解如何在 kubeadm 集群中配置 kubelet 使用正确签名了的服务证书。

另请参阅 [How to run the metrics-server securely](https://github.com/kubernetes-sigs/metrics-server/blob/master/FAQ.md#how-to-run-metrics-server-securely)。

<!--
## Upgrade fails due to etcd hash not changing

Only applicable to upgrading a control plane node with a kubeadm binary v1.28.3 or later,
where the node is currently managed by kubeadm versions v1.28.0, v1.28.1 or v1.28.2.

Here is the error message you may encounter:
-->
## 因 etcd 哈希值无变化而升级失败   {#upgrade-fails-due-to-etcd-hash-not-changing}

仅适用于通过 kubeadm 二进制文件 v1.28.3 或更高版本升级控制平面节点的情况，
其中此节点当前由 kubeadm v1.28.0、v1.28.1 或 v1.28.2 管理。

以下是你可能遇到的错误消息：

```
[upgrade/etcd] Failed to upgrade etcd: couldn't upgrade control plane. kubeadm has tried to recover everything into the earlier state. Errors faced: static Pod hash for component etcd on Node kinder-upgrade-control-plane-1 did not change after 5m0s: timed out waiting for the condition
[upgrade/etcd] Waiting for previous etcd to become available
I0907 10:10:09.109104    3704 etcd.go:588] [etcd] attempting to see if all cluster endpoints ([https://172.17.0.6:2379/ https://172.17.0.4:2379/ https://172.17.0.3:2379/]) are available 1/10
[upgrade/etcd] Etcd was rolled back and is now available
static Pod hash for component etcd on Node kinder-upgrade-control-plane-1 did not change after 5m0s: timed out waiting for the condition
couldn't upgrade control plane. kubeadm has tried to recover everything into the earlier state. Errors faced
k8s.io/kubernetes/cmd/kubeadm/app/phases/upgrade.rollbackOldManifests
	cmd/kubeadm/app/phases/upgrade/staticpods.go:525
k8s.io/kubernetes/cmd/kubeadm/app/phases/upgrade.upgradeComponent
	cmd/kubeadm/app/phases/upgrade/staticpods.go:254
k8s.io/kubernetes/cmd/kubeadm/app/phases/upgrade.performEtcdStaticPodUpgrade
	cmd/kubeadm/app/phases/upgrade/staticpods.go:338
...
```

<!--
The reason for this failure is that the affected versions generate an etcd manifest file with
unwanted defaults in the PodSpec. This will result in a diff from the manifest comparison,
and kubeadm will expect a change in the Pod hash, but the kubelet will never update the hash.

There are two way to workaround this issue if you see it in your cluster:
- The etcd upgrade can be skipped between the affected versions and v1.28.3 (or later) by using:

  This is not recommended in case a new etcd version was introduced by a later v1.28 patch version.
-->
本次失败的原因是受影响的版本在 PodSpec 中生成的 etcd 清单文件带有不需要的默认值。
这将导致与清单比较的差异，并且 kubeadm 预期 Pod 哈希值将发生变化，但 kubelet 永远不会更新哈希值。

如果你在集群中遇到此问题，有两种解决方法：

- 可以运行以下命令跳过 etcd 的版本升级，即受影响版本和 v1.28.3（或更高版本）之间的版本升级:

  ```shell
  kubeadm upgrade {apply|node} [version] --etcd-upgrade=false
  ```
  
  但不推荐这种方法，因为后续的 v1.28 补丁版本可能引入新的 etcd 版本。

<!--
- Before upgrade, patch the manifest for the etcd static pod, to remove the problematic defaulted attributes:
-->
- 在升级之前，对 etcd 静态 Pod 的清单进行修补，以删除有问题的默认属性:

  ```patch
  diff --git a/etc/kubernetes/manifests/etcd_defaults.yaml b/etc/kubernetes/manifests/etcd_origin.yaml
  index d807ccbe0aa..46b35f00e15 100644
  --- a/etc/kubernetes/manifests/etcd_defaults.yaml
  +++ b/etc/kubernetes/manifests/etcd_origin.yaml
  @@ -43,7 +43,6 @@ spec:
          scheme: HTTP
        initialDelaySeconds: 10
        periodSeconds: 10
  -      successThreshold: 1
        timeoutSeconds: 15
      name: etcd
      resources:
  @@ -59,26 +58,18 @@ spec:
          scheme: HTTP
        initialDelaySeconds: 10
        periodSeconds: 10
  -      successThreshold: 1
        timeoutSeconds: 15
  -    terminationMessagePath: /dev/termination-log
  -    terminationMessagePolicy: File
      volumeMounts:
      - mountPath: /var/lib/etcd
        name: etcd-data
      - mountPath: /etc/kubernetes/pki/etcd
        name: etcd-certs
  -  dnsPolicy: ClusterFirst
  -  enableServiceLinks: true
    hostNetwork: true
    priority: 2000001000
    priorityClassName: system-node-critical
  -  restartPolicy: Always
  -  schedulerName: default-scheduler
    securityContext:
      seccompProfile:
        type: RuntimeDefault
  -  terminationGracePeriodSeconds: 30
    volumes:
    - hostPath:
        path: /etc/kubernetes/pki/etcd
  ```

<!--
More information can be found in the
[tracking issue](https://github.com/kubernetes/kubeadm/issues/2927) for this bug.
-->
有关此错误的更多信息，请查阅[此问题的跟踪页面](https://github.com/kubernetes/kubeadm/issues/2927)。
