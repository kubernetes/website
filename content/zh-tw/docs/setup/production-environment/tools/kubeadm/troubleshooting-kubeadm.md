---
title: 對 kubeadm 進行故障排查
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
與任何程式一樣，你可能會在安裝或者運行 kubeadm 時遇到錯誤。
本文列舉了一些常見的故障場景，並提供可幫助你理解和解決這些問題的步驟。

如果你的問題未在下面列出，請執行以下步驟：

- 如果你認爲問題是 kubeadm 的錯誤：
  - 轉到 [github.com/kubernetes/kubeadm](https://github.com/kubernetes/kubeadm/issues) 並搜索存在的問題。
  - 如果沒有問題，請 [打開](https://github.com/kubernetes/kubeadm/issues/new) 並遵循問題模板。

- 如果你對 kubeadm 的工作方式有疑問，可以在 [Slack](https://slack.k8s.io/) 上的 `#kubeadm` 頻道提問，
  或者在 [StackOverflow](https://stackoverflow.com/questions/tagged/kubernetes) 上提問。
  請加入相關標籤，例如 `#kubernetes` 和 `#kubeadm`，這樣其他人可以幫助你。

<!-- body -->

<!--
## Not possible to join a v1.18 Node to a v1.17 cluster due to missing RBAC
-->
## 由於缺少 RBAC，無法將 v1.18 Node 加入 v1.17 叢集

<!--
In v1.18 kubeadm added prevention for joining a Node in the cluster if a Node with the same name already exists.
This required adding RBAC for the bootstrap-token user to be able to GET a Node object.

However this causes an issue where `kubeadm join` from v1.18 cannot join a cluster created by kubeadm v1.17.
-->
自從 v1.18 後，如果叢集中已存在同名 Node，kubeadm 將禁止 Node 加入叢集。
這需要爲 bootstrap-token 使用者添加 RBAC 才能 GET Node 對象。

但這會導致一個問題，v1.18 的 `kubeadm join` 無法加入由 kubeadm v1.17 創建的叢集。

<!--
To workaround the issue you have two options:

Execute `kubeadm init phase bootstrap-token` on a control-plane node using kubeadm v1.18.
Note that this enables the rest of the bootstrap-token permissions as well.

or

Apply the following RBAC manually using `kubectl apply -f ...`:
-->
要解決此問題，你有兩種選擇：

使用 kubeadm v1.18 在控制平面節點上執行 `kubeadm init phase bootstrap-token`。
請注意，這也會啓用 bootstrap-token 的其餘權限。

或者，也可以使用 `kubectl apply -f ...` 手動應用以下 RBAC：

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
## 在安裝過程中沒有找到 `ebtables` 或者其他類似的可執行檔案

如果在運行 `kubeadm init` 命令時，遇到以下的警告

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
那麼或許在你的節點上缺失 `ebtables`、`ethtool` 或者類似的可執行檔案。
你可以使用以下命令安裝它們：

- 對於 Ubuntu/Debian 使用者，運行 `apt install ebtables ethtool` 命令。
- 對於 CentOS/Fedora 使用者，運行 `yum install ebtables ethtool` 命令。

<!--
## kubeadm blocks waiting for control plane during installation

If you notice that `kubeadm init` hangs after printing out the following line:
-->
## 在安裝過程中，kubeadm 一直等待控制平面就緒

如果你注意到 `kubeadm init` 在打印以下行後掛起：

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
這可能是由許多問題引起的。最常見的是：

- 網路連接問題。在繼續之前，請檢查你的計算機是否具有全部聯通的網路連接。
- 容器運行時的 cgroup 驅動不同於 kubelet 使用的 cgroup 驅動。要了解如何正確設定 cgroup 驅動，
  請參閱[設定 cgroup 驅動](/zh-cn/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/)。
- 控制平面上的 Docker 容器持續進入崩潰狀態或（因其他原因）掛起。你可以運行 `docker ps` 命令來檢查以及 `docker logs`
  命令來檢視每個容器的運行日誌。
  對於其他容器運行時，請參閱[使用 crictl 對 Kubernetes 節點進行調試](/zh-cn/docs/tasks/debug/debug-cluster/crictl/)。

<!--
## kubeadm blocks when removing managed containers

The following could happen if the container runtime halts and does not remove
any Kubernetes-managed containers:
-->
## 當刪除託管容器時 kubeadm 阻塞

如果容器運行時停止並且未刪除 Kubernetes 所管理的容器，可能發生以下情況：

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
一個可行的解決方案是重新啓動 Docker 服務，然後重新運行 `kubeadm reset`：
你也可以使用 `crictl` 來調試容器運行時的狀態。
參見[使用 CRICTL 調試 Kubernetes 節點](/zh-cn/docs/tasks/debug/debug-cluster/crictl/)。

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
## Pod 處於 `RunContainerError`、`CrashLoopBackOff` 或者 `Error` 狀態

在 `kubeadm init` 命令運行後，系統中不應該有 Pod 處於這類狀態。

- 在 `kubeadm init` 命令執行完後，如果有 Pod 處於這些狀態之一，請在 kubeadm
  倉庫提起一個 issue。`coredns` (或者 `kube-dns`) 應該處於 `Pending` 狀態，
  直到你部署了網路插件爲止。

- 如果在部署完網路插件之後，有 Pod 處於 `RunContainerError`、`CrashLoopBackOff`
  或 `Error` 狀態之一，並且 `coredns` （或者 `kube-dns`）仍處於 `Pending` 狀態，
  那很可能是你安裝的網路插件由於某種原因無法工作。你或許需要授予它更多的
  RBAC 特權或使用較新的版本。請在 Pod Network 提供商的問題跟蹤器中提交問題，
  然後在此處分類問題。

<!--
## `coredns` is stuck in the `Pending` state

This is **expected** and part of the design. kubeadm is network provider-agnostic, so the admin
should [install the pod network add-on](/docs/concepts/cluster-administration/addons/)
of choice. You have to install a Pod Network
before CoreDNS may be deployed fully. Hence the `Pending` state before the network is set up.
-->
## `coredns` 停滯在 `Pending` 狀態

這一行爲是**預期之中**的，因爲系統就是這麼設計的。kubeadm 的網路供應商是中立的，
因此管理員應該選擇[安裝 Pod 的網路插件](/zh-cn/docs/concepts/cluster-administration/addons/)。
你必須完成 Pod 的網路設定，然後才能完全部署 CoreDNS。
在網路被設定好之前，DNS 組件會一直處於 `Pending` 狀態。

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
## `HostPort` 服務無法工作

此 `HostPort` 和 `HostIP` 功能是否可用取決於你的 Pod 網路設定。請聯繫 Pod 網路插件的作者，
以確認 `HostPort` 和 `HostIP` 功能是否可用。

已驗證 Calico、Canal 和 Flannel CNI 驅動程式支持 HostPort。

有關更多資訊，請參考 [CNI portmap 文檔](https://github.com/containernetworking/plugins/blob/master/plugins/meta/portmap/README.md).

如果你的網路提供商不支持 portmap CNI 插件，你或許需要使用
[NodePort 服務的功能](/zh-cn/docs/concepts/services-networking/service/#type-nodeport)或者使用
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
## 無法通過其服務 IP 訪問 Pod

- 許多網路附加組件尚未啓用 [hairpin 模式](/zh-cn/docs/tasks/debug/debug-application/debug-service/#a-pod-fails-to-reach-itself-via-the-service-ip)
  該模式允許 Pod 通過其服務 IP 進行訪問。這是與 [CNI](https://github.com/containernetworking/cni/issues/476) 有關的問題。
  請與網路附加組件提供商聯繫，以獲取他們所提供的 hairpin 模式的最新狀態。

- 如果你正在使用 VirtualBox (直接使用或者通過 Vagrant 使用)，你需要
  確保 `hostname -i` 返回一個可路由的 IP 地址。預設情況下，第一個介面連接不能路由的僅主機網路。
  解決方法是修改 `/etc/hosts`，請參考示例
  [Vagrantfile](https://github.com/errordeveloper/k8s-playground/blob/22dd39dfc06111235620e6c4404a96ae146f26fd/Vagrantfile#L11)。

<!--
## TLS certificate errors

The following error indicates a possible certificate mismatch.
-->
## TLS 證書錯誤

以下錯誤說明證書可能不匹配。

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
- 驗證 `$HOME/.kube/config` 檔案是否包含有效證書，
  並在必要時重新生成證書。在 kubeconfig 檔案中的證書是 base64 編碼的。
  該 `base64 --decode` 命令可以用來解碼證書，`openssl x509 -text -noout`
  命令可以用於查看證書資訊。

- 使用如下方法取消設置 `KUBECONFIG` 環境變量的值：

  ```shell
  unset KUBECONFIG
  ```

  <!--
  Or set it to the default `KUBECONFIG` location:
  -->
  或者將其設置爲預設的 `KUBECONFIG` 位置：

  ```shell
  export KUBECONFIG=/etc/kubernetes/admin.conf
  ```

<!--
- Another workaround is to overwrite the existing `kubeconfig` for the "admin" user:
-->
- 另一個方法是覆蓋 `kubeconfig` 的現有使用者 "管理員"：

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
## Kubelet 客戶端證書輪換失敗   {#kubelet-client-cert}

預設情況下，kubeadm 使用 `/etc/kubernetes/kubelet.conf` 中指定的 `/var/lib/kubelet/pki/kubelet-client-current.pem`
符號鏈接來設定 kubelet 自動輪換客戶端證書。如果此輪換過程失敗，你可能會在 kube-apiserver 日誌中看到諸如
`x509: certificate has expired or is not yet valid` 之類的錯誤。要解決此問題，你必須執行以下步驟：
<!--
1. Backup and delete `/etc/kubernetes/kubelet.conf` and `/var/lib/kubelet/pki/kubelet-client*` from the failed node.
1. From a working control plane node in the cluster that has `/etc/kubernetes/pki/ca.key` execute
   `kubeadm kubeconfig user --org system:nodes --client-name system:node:$NODE > kubelet.conf`.
   `$NODE` must be set to the name of the existing failed node in the cluster.
   Modify the resulted `kubelet.conf` manually to adjust the cluster name and server endpoint,
   (see [Generating kubeconfig files for additional users](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#kubeconfig-additional-users)). If your cluster does not have
   the `ca.key` you must sign the embedded certificates in the `kubelet.conf` externally.
-->
1. 從故障節點備份和刪除 `/etc/kubernetes/kubelet.conf` 和 `/var/lib/kubelet/pki/kubelet-client*`。
2. 在叢集中具有 `/etc/kubernetes/pki/ca.key` 的、正常工作的控制平面節點上
   執行 `kubeadm kubeconfig user --org system:nodes --client-name system:node:$NODE > kubelet.conf`。
   `$NODE` 必須設置爲叢集中現有故障節點的名稱。
   手動修改生成的 `kubelet.conf` 以調整叢集名稱和伺服器端點，
   或傳遞 `kubeconfig user --config`
  （請參閱[爲其他使用者生成 kubeconfig 檔案](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#kubeconfig-additional-users)）。
   如果你的叢集沒有 `ca.key`，你必須在外部對 `kubelet.conf` 中的嵌入式證書進行簽名。
<!--
1. Copy this resulted `kubelet.conf` to `/etc/kubernetes/kubelet.conf` on the failed node.
1. Restart the kubelet (`systemctl restart kubelet`) on the failed node and wait for
   `/var/lib/kubelet/pki/kubelet-client-current.pem` to be recreated.
-->
3. 將得到的 `kubelet.conf` 檔案複製到故障節點上，作爲 `/etc/kubernetes/kubelet.conf`。
4. 在故障節點上重啓 kubelet（`systemctl restart kubelet`），等待 `/var/lib/kubelet/pki/kubelet-client-current.pem` 重新創建。
<!--
1. Manually edit the `kubelet.conf` to point to the rotated kubelet client certificates, by replacing
   `client-certificate-data` and `client-key-data` with:
-->
5. 手動編輯 `kubelet.conf` 指向輪換的 kubelet 客戶端證書，方法是將 `client-certificate-data` 和 `client-key-data` 替換爲：

   ```yaml
   client-certificate: /var/lib/kubelet/pki/kubelet-client-current.pem
   client-key: /var/lib/kubelet/pki/kubelet-client-current.pem
   ```

<!--
1. Restart the kubelet.
1. Make sure the node becomes `Ready`.
-->
6. 重新啓動 kubelet。
7. 確保節點狀況變爲 `Ready`。

<!--
## Default NIC When using flannel as the pod network in Vagrant

The following error might indicate that something was wrong in the pod network:
-->
## 在 Vagrant 中使用 flannel 作爲 Pod 網路時的預設 NIC

以下錯誤可能表明 Pod 網路中出現問題：

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
- 如果你正在 Vagrant 中使用 flannel 作爲 Pod 網路，則必須指定 flannel 的預設介面名稱。

  Vagrant 通常爲所有 VM 分配兩個介面。第一個爲所有主機分配了 IP 地址 `10.0.2.15`，用於獲得 NATed 的外部流量。

  這可能會導致 flannel 出現問題，它預設爲主機上的第一個介面。這導致所有主機認爲它們具有相同的公共
  IP 地址。爲防止這種情況，傳遞 `--iface eth1` 標誌給 flannel 以便選擇第二個介面。

<!--
## Non-public IP used for containers

In some situations `kubectl logs` and `kubectl run` commands may return with the
following errors in an otherwise functional cluster:
-->
## 容器使用的非公共 IP

在某些情況下 `kubectl logs` 和 `kubectl run` 命令或許會返回以下錯誤，即便除此之外叢集一切功能正常：

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
- 這或許是由於 Kubernetes 使用的 IP 無法與看似相同的子網上的其他 IP 進行通信的緣故，
  可能是由機器提供商的政策所導致的。
- DigitalOcean 既分配一個共有 IP 給 `eth0`，也分配一個私有 IP 在內部用作其浮動 IP 功能的錨點，
  然而 `kubelet` 將選擇後者作爲節點的 `InternalIP` 而不是公共 IP。

  使用 `ip addr show` 命令代替 `ifconfig` 命令去檢查這種情況，因爲 `ifconfig` 命令
  不會顯示有問題的別名 IP 地址。或者指定的 DigitalOcean 的 API 端口允許從 droplet 中
  查詢 anchor IP：

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
  解決方法是通知 `kubelet` 使用哪個 `--node-ip`。當使用 DigitalOcean 時，可以是（分配給 `eth0` 的）公網 IP，
  或者是（分配給 `eth1` 的）私網 IP。私網 IP 是可選的。
  kubadm [`NodeRegistrationOptions` 結構](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4/#kubeadm-k8s-io-v1beta4-NodeRegistrationOptions)
  的 `KubeletExtraArgs` 部分被用來處理這種情況。

  然後重啓 `kubelet`：

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
## `coredns` Pod 有 `CrashLoopBackOff` 或者 `Error` 狀態

如果有些節點運行的是舊版本的 Docker，同時啓用了 SELinux，你或許會遇到 `coredns` Pod 無法啓動的情況。
要解決此問題，你可以嘗試以下選項之一：

- 升級到 [Docker 的較新版本](/zh-cn/docs/setup/production-environment/container-runtimes/#docker)。

- [禁用 SELinux](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/6/html/security-enhanced_linux/sect-security-enhanced_linux-enabling_and_disabling_selinux-disabling_selinux)。

- 修改 `coredns` 部署以設置 `allowPrivilegeEscalation` 爲 `true`：

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
CoreDNS 處於 `CrashLoopBackOff` 時的另一個原因是當 Kubernetes 中部署的 CoreDNS Pod 檢測到環路時。
[有許多解決方法](https://github.com/coredns/coredns/tree/master/plugin/loop#troubleshooting-loops-in-kubernetes-clusters)
可以避免在每次 CoreDNS 監測到循環並退出時，Kubernetes 嘗試重啓 CoreDNS Pod 的情況。

{{< warning >}}
<!--
Disabling SELinux or setting `allowPrivilegeEscalation` to `true` can compromise
the security of your cluster.
-->
禁用 SELinux 或設置 `allowPrivilegeEscalation` 爲 `true` 可能會損害叢集的安全性。
{{< /warning >}}

<!--
## etcd pods restart continually

If you encounter the following error:
-->
## etcd Pod 持續重啓

如果你遇到以下錯誤：

```console
rpc error: code = 2 desc = oci runtime error: exec failed: container_linux.go:247: starting container process caused "process_linux.go:110: decoding init error from pipe caused \"read parent: connection reset by peer\""
```

<!--
This issue appears if you run CentOS 7 with Docker 1.13.1.84.
This version of Docker can prevent the kubelet from executing into the etcd container.

To work around the issue, choose one of these options:

- Roll back to an earlier version of Docker, such as 1.13.1-75
-->
如果你使用 Docker 1.13.1.84 運行 CentOS 7 就會出現這種問題。
此版本的 Docker 會阻止 kubelet 在 etcd 容器中執行。

爲解決此問題，請選擇以下選項之一：

- 回滾到早期版本的 Docker，例如 1.13.1-75

  ```shell
  yum downgrade docker-1.13.1-75.git8633870.el7.centos.x86_64 docker-client-1.13.1-75.git8633870.el7.centos.x86_64 docker-common-1.13.1-75.git8633870.el7.centos.x86_64
  ```

<!--
- Install one of the more recent recommended versions, such as 18.06:
-->
- 安裝較新的推薦版本之一，例如 18.06：

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
## 無法將以逗號分隔的值列表傳遞給 `--component-extra-args` 標誌內的參數

`kubeadm init` 標誌例如 `--component-extra-args` 允許你將自定義參數傳遞給像
kube-apiserver 這樣的控制平面組件。然而，由於解析 (`mapStringString`) 的基礎類型值，此機制將受到限制。

如果你決定傳遞一個支持多個逗號分隔值（例如
`--apiserver-extra-args "enable-admission-plugins=LimitRanger,NamespaceExists"`）參數，
將出現 `flag: malformed pair, expect string=string` 錯誤。
發生這種問題是因爲參數列表 `--apiserver-extra-args` 預期的是 `key=value` 形式，
而這裏的 `NamespacesExists` 被誤認爲是缺少取值的鍵名。

一種解決方法是嘗試分離 `key=value` 對，像這樣：
`--apiserver-extra-args "enable-admission-plugins=LimitRanger,enable-admission-plugins=NamespaceExists"`
但這將導致鍵 `enable-admission-plugins` 僅有值 `NamespaceExists`。

已知的解決方法是使用 kubeadm
[設定檔案](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4/)。

<!--
## kube-proxy scheduled before node is initialized by cloud-controller-manager

In cloud provider scenarios, kube-proxy can end up being scheduled on new worker nodes before
the cloud-controller-manager has initialized the node addresses. This causes kube-proxy to fail
to pick up the node's IP address properly and has knock-on effects to the proxy function managing
load balancers.

The following error can be seen in kube-proxy Pods:
-->
## 在節點被雲控制管理器初始化之前，kube-proxy 就被調度了

在雲環境場景中，可能出現在雲控制管理器完成節點地址初始化之前，kube-proxy 就被調度到新節點了。
這會導致 kube-proxy 無法正確獲取節點的 IP 地址，並對管理負載平衡器的代理功能產生連鎖反應。

在 kube-proxy Pod 中可以看到以下錯誤：

```console
server.go:610] Failed to retrieve node IP: host IP unknown; known addresses: []
proxier.go:340] invalid nodeIP, initializing kube-proxy with 127.0.0.1 as nodeIP
```

<!--
A known solution is to patch the kube-proxy DaemonSet to allow scheduling it on control-plane
nodes regardless of their conditions, keeping it off of other nodes until their initial guarding
conditions abate:
-->
一種已知的解決方案是修補 kube-proxy DaemonSet，以允許在控制平面節點上調度它，
而不管它們的條件如何，將其與其他節點保持隔離，直到它們的初始保護條件消除：

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
此問題的跟蹤[在這裏](https://github.com/kubernetes/kubeadm/issues/1027)。

<!--
## `/usr` is mounted read-only on nodes {#usr-mounted-read-only}

On Linux distributions such as Fedora CoreOS or Flatcar Container Linux, the directory `/usr` is mounted as a read-only filesystem.
For [flex-volume support](https://github.com/kubernetes/community/blob/ab55d85/contributors/devel/sig-storage/flexvolume.md),
Kubernetes components like the kubelet and kube-controller-manager use the default path of
`/usr/libexec/kubernetes/kubelet-plugins/volume/exec/`, yet the flex-volume directory _must be writeable_
for the feature to work.
-->
## 節點上的 `/usr` 被以只讀方式掛載 {#usr-mounted-read-only}

在類似 Fedora CoreOS 或者 Flatcar Container Linux 這類 Linux 發行版本中，
目錄 `/usr` 是以只讀檔案系統的形式掛載的。
在支持 [FlexVolume](https://github.com/kubernetes/community/blob/ab55d85/contributors/devel/sig-storage/flexvolume.md) 時，
類似 kubelet 和 kube-controller-manager 這類 Kubernetes 組件使用預設路徑
`/usr/libexec/kubernetes/kubelet-plugins/volume/exec/`，
而 FlexVolume 的目錄**必須是可寫入的**，該功能特性才能正常工作。

{{< note >}}
<!--
FlexVolume was deprecated in the Kubernetes v1.23 release.
-->
FlexVolume 在 Kubernetes v1.23 版本中已被棄用。
{{< /note >}}

<!--
To workaround this issue, you can configure the flex-volume directory using the kubeadm
[configuration file](/docs/reference/config-api/kubeadm-config.v1beta4/).

On the primary control-plane Node (created using `kubeadm init`), pass the following
file using `--config`:
-->
爲了解決這個問題，你可以使用 kubeadm 的[設定檔案](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4/)來設定
FlexVolume 的目錄。

在（使用 `kubeadm init` 創建的）主控制節點上，使用 `--config`
參數傳入如下檔案：

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
在加入到叢集中的節點上，使用下面的檔案：

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
或者，你可以更改 `/etc/fstab` 使得 `/usr` 目錄能夠以可寫入的方式掛載，
不過請注意這樣做本質上是在更改 Linux 發行版的某種設計原則。

<!--
## `kubeadm upgrade plan` prints out `context deadline exceeded` error message

This error message is shown when upgrading a Kubernetes cluster with `kubeadm` in
the case of running an external etcd. This is not a critical bug and happens because
older versions of kubeadm perform a version check on the external etcd cluster.
You can proceed with `kubeadm upgrade apply ...`.

This issue is fixed as of version 1.19.
-->
## `kubeadm upgrade plan` 輸出錯誤資訊 `context deadline exceeded`

在使用 `kubeadm` 來升級某運行外部 etcd 的 Kubernetes 叢集時可能顯示這一錯誤資訊。
這並不是一個非常嚴重的一個缺陷，之所以出現此錯誤資訊，原因是老的 kubeadm
版本會對外部 etcd 叢集執行版本檢查。你可以繼續執行 `kubeadm upgrade apply ...`。

這一問題已經在 1.19 版本中得到修復。

<!--
## `kubeadm reset` unmounts `/var/lib/kubelet`

If `/var/lib/kubelet` is being mounted, performing a `kubeadm reset` will effectively unmount it.

To workaround the issue, re-mount the `/var/lib/kubelet` directory after performing the `kubeadm reset` operation.

This is a regression introduced in kubeadm 1.15. The issue is fixed in 1.20.
-->
## `kubeadm reset` 會卸載 `/var/lib/kubelet`

如果已經掛載了 `/var/lib/kubelet` 目錄，執行 `kubeadm reset`
操作的時候會將其卸載。

要解決這一問題，可以在執行了 `kubeadm reset` 操作之後重新掛載
`/var/lib/kubelet` 目錄。

這是一個在 1.15 中引入的故障，已經在 1.20 版本中修復。

<!--
## Cannot use the metrics-server securely in a kubeadm cluster

In a kubeadm cluster, the [metrics-server](https://github.com/kubernetes-sigs/metrics-server)
can be used insecurely by passing the `--kubelet-insecure-tls` to it. This is not recommended for production clusters.
-->
## 無法在 kubeadm 叢集中安全地使用 metrics-server

在 kubeadm 叢集中可以通過爲 [metrics-server](https://github.com/kubernetes-sigs/metrics-server)
設置 `--kubelet-insecure-tls` 來以不安全的形式使用該服務。
建議不要在生產環境叢集中這樣使用。

<!--
If you want to use TLS between the metrics-server and the kubelet there is a problem,
since kubeadm deploys a self-signed serving certificate for the kubelet. This can cause the following errors
on the side of the metrics-server:
-->
如果你需要在 metrics-server 和 kubelet 之間使用 TLS，會有一個問題，
kubeadm 爲 kubelet 部署的是自簽名的服務證書。這可能會導致 metrics-server
端報告下面的錯誤資訊：

```console
x509: certificate signed by unknown authority
x509: certificate is valid for IP-foo not IP-bar
```

<!--
See [Enabling signed kubelet serving certificates](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#kubelet-serving-certs)
to understand how to configure the kubelets in a kubeadm cluster to have properly signed serving certificates.

Also see [How to run the metrics-server securely](https://github.com/kubernetes-sigs/metrics-server/blob/master/FAQ.md#how-to-run-metrics-server-securely).
-->
參見[爲 kubelet 啓用簽名的服務證書](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#kubelet-serving-certs)
以進一步瞭解如何在 kubeadm 叢集中設定 kubelet 使用正確簽名了的服務證書。

另請參閱 [How to run the metrics-server securely](https://github.com/kubernetes-sigs/metrics-server/blob/master/FAQ.md#how-to-run-metrics-server-securely)。

<!--
## Upgrade fails due to etcd hash not changing

Only applicable to upgrading a control plane node with a kubeadm binary v1.28.3 or later,
where the node is currently managed by kubeadm versions v1.28.0, v1.28.1 or v1.28.2.

Here is the error message you may encounter:
-->
## 因 etcd 哈希值無變化而升級失敗   {#upgrade-fails-due-to-etcd-hash-not-changing}

僅適用於通過 kubeadm 二進制檔案 v1.28.3 或更高版本升級控制平面節點的情況，
其中此節點當前由 kubeadm v1.28.0、v1.28.1 或 v1.28.2 管理。

以下是你可能遇到的錯誤消息：

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
本次失敗的原因是受影響的版本在 PodSpec 中生成的 etcd 清單檔案帶有不需要的預設值。
這將導致與清單比較的差異，並且 kubeadm 預期 Pod 哈希值將發生變化，但 kubelet 永遠不會更新哈希值。

如果你在叢集中遇到此問題，有兩種解決方法：

- 可以運行以下命令跳過 etcd 的版本升級，即受影響版本和 v1.28.3（或更高版本）之間的版本升級:

  ```shell
  kubeadm upgrade {apply|node} [version] --etcd-upgrade=false
  ```
  
  但不推薦這種方法，因爲後續的 v1.28 補丁版本可能引入新的 etcd 版本。

<!--
- Before upgrade, patch the manifest for the etcd static pod, to remove the problematic defaulted attributes:
-->
- 在升級之前，對 etcd 靜態 Pod 的清單進行修補，以刪除有問題的預設屬性:

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
有關此錯誤的更多資訊，請查閱[此問題的跟蹤頁面](https://github.com/kubernetes/kubeadm/issues/2927)。
