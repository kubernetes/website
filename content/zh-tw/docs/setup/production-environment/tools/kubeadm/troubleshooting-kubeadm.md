---
title: kubeadm 疑難排解
content_type: concept
weight: 20
---
<!--
---
title: Troubleshooting kubeadm
content_type: concept
weight: 20
---
-->

<!-- overview -->

<!--
As with any program, you might run into an error installing or running kubeadm.
This page lists some common failure scenarios and have provided steps that can help you understand and fix the problem.
-->
與其他程式一樣，您在安裝或執行 kubeadm 時也可能遇到錯誤。
本頁面列出了一些常見的失敗情境，並提供有助於您理解與解決問題的步驟。

<!--
If your problem is not listed below, please follow the following steps:
-->
如果您的問題並未列在下方，請依照下列步驟處理：

<!--
- If you think your problem is a bug with kubeadm:
  - Go to [github.com/kubernetes/kubeadm](https://github.com/kubernetes/kubeadm/issues) and search for existing issues.
  - If no issue exists, please [open one](https://github.com/kubernetes/kubeadm/issues/new) and follow the issue template.

- If you are unsure about how kubeadm works, you can ask on [Slack](https://slack.k8s.io/) in `#kubeadm`,
  or open a question on [StackOverflow](https://stackoverflow.com/questions/tagged/kubernetes). Please include
  relevant tags like `#kubernetes` and `#kubeadm` so folks can help you.
-->
- 如果您認為遇到的問題是 kubeadm 的錯誤：
  - 請前往 [github.com/kubernetes/kubeadm](https://github.com/kubernetes/kubeadm/issues) 搜尋既有的 issue。
  - 若找不到相關的 issue，請依照 issue 範本[建立一個新的 issue](https://github.com/kubernetes/kubeadm/issues/new)。

- 如果您不確定 kubeadm 的運作方式，可以在 [Slack](https://slack.k8s.io/) 的 `#kubeadm` 頻道提問，
  或是到 [StackOverflow](https://stackoverflow.com/questions/tagged/kubernetes) 上發問。
  發問時請加上 `#kubernetes` 與 `#kubeadm` 等相關標籤，方便大家協助您。

<!-- body -->

<!--
## Not possible to join a v1.18 Node to a v1.17 cluster due to missing RBAC
-->
## 由於缺少 RBAC 而無法將 v1.18 節點加入 v1.17 叢集 {#not-possible-to-join-a-v1-18-node-to-a-v1-17-cluster-due-to-missing-rbac}

<!--
In v1.18 kubeadm added prevention for joining a Node in the cluster if a Node with the same name already exists.
This required adding RBAC for the bootstrap-token user to be able to GET a Node object.
-->
在 v1.18 中，kubeadm 新增了一項防護機制：若叢集中已存在同名的節點，就不允許再加入該節點。
為此，必須為 bootstrap-token 使用者新增能夠 GET Node 物件的 RBAC 權限。

<!--
However this causes an issue where `kubeadm join` from v1.18 cannot join a cluster created by kubeadm v1.17.
-->
然而，這也造成了一個問題：v1.18 的 `kubeadm join` 無法加入由 kubeadm v1.17 建立的叢集。

<!--
To workaround the issue you have two options:
-->
您有兩種方式可以解決這個問題：

<!--
Execute `kubeadm init phase bootstrap-token` on a control-plane node using kubeadm v1.18.
Note that this enables the rest of the bootstrap-token permissions as well.
-->
使用 kubeadm v1.18 在控制平面節點上執行 `kubeadm init phase bootstrap-token`。
請注意，這麼做同時也會啟用 bootstrap-token 的其餘權限。

<!--
or
-->
或是

<!--
Apply the following RBAC manually using `kubectl apply -f ...`:
-->
使用 `kubectl apply -f ...` 手動套用以下 RBAC 設定：

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
-->
## 安裝過程中找不到 `ebtables` 或其他類似的執行檔 {#ebtables-or-some-similar-executable-not-found-during-installation}

<!--
If you see the following warnings while running `kubeadm init`
-->
如果您在執行 `kubeadm init` 時看到以下警告：

```console
[preflight] WARNING: ebtables not found in system path
[preflight] WARNING: ethtool not found in system path
```

<!--
Then you may be missing `ebtables`, `ethtool` or a similar executable on your node.
You can install them with the following commands:
-->
那麼您的節點上可能缺少 `ebtables`、`ethtool` 或其他類似的執行檔。
您可以使用以下指令安裝它們：

<!--
- For Ubuntu/Debian users, run `apt install ebtables ethtool`.
- For CentOS/Fedora users, run `yum install ebtables ethtool`.
-->
- Ubuntu/Debian 使用者請執行 `apt install ebtables ethtool`。
- CentOS/Fedora 使用者請執行 `yum install ebtables ethtool`。

<!--
## kubeadm blocks waiting for control plane during installation
-->
## 安裝過程中 kubeadm 卡住並等待控制平面 {#kubeadm-blocks-waiting-for-control-plane-during-installation}

<!--
If you notice that `kubeadm init` hangs after printing out the following line:
-->
如果您發現 `kubeadm init` 印出以下訊息後就沒有回應：

```console
[apiclient] Created API client, waiting for the control plane to become ready
```

<!--
This may be caused by a number of problems. The most common are:
-->
這可能由多種問題引起，其中最常見的是：

<!--
- network connection problems. Check that your machine has full network connectivity before continuing.
- the cgroup driver of the container runtime differs from that of the kubelet. To understand how to
  configure it properly, see [Configuring a cgroup driver](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/).
- control plane containers are crashlooping or hanging. You can check this by running `docker ps`
  and investigating each container by running `docker logs`. For other container runtime, see
  [Debugging Kubernetes nodes with crictl](/docs/tasks/debug/debug-cluster/crictl/).
-->
- 網路連線問題。請先確認您的機器網路連線完全正常，再繼續後續操作。
- 容器執行階段的 cgroup 驅動程式與 kubelet 的不一致。
  若想了解如何正確設定，請參閱[設定 cgroup 驅動程式](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/)。
- 控制平面容器反覆當機重啟（crashloop）或卡住。您可以執行 `docker ps` 檢查，
  並透過 `docker logs` 逐一檢視各個容器。若使用其他容器執行階段，
  請參閱[使用 crictl 對 Kubernetes 節點進行除錯](/docs/tasks/debug/debug-cluster/crictl/)。

<!--
## kubeadm blocks when removing managed containers
-->
## 移除受管理的容器時 kubeadm 卡住 {#kubeadm-blocks-when-removing-managed-containers}

<!--
The following could happen if the container runtime halts and does not remove
any Kubernetes-managed containers:
-->
如果容器執行階段停止運作，且未移除任何由 Kubernetes 管理的容器，就可能出現以下情況：

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
一種可行的解法是重新啟動容器執行階段，然後重新執行 `kubeadm reset`。
您也可以使用 `crictl` 來對容器執行階段的狀態進行除錯，
請參閱[使用 crictl 對 Kubernetes 節點進行除錯](/docs/tasks/debug/debug-cluster/crictl/)。

<!--
## Pods in `RunContainerError`, `CrashLoopBackOff` or `Error` state
-->
## Pod 處於 `RunContainerError`、`CrashLoopBackOff` 或 `Error` 狀態 {#pods-in-runcontainererror-crashloopbackoff-or-error-state}

<!--
Right after `kubeadm init` there should not be any pods in these states.
-->
在剛執行完 `kubeadm init` 之後，不應該有任何 Pod 處於這些狀態。

<!--
- If there are pods in one of these states _right after_ `kubeadm init`, please open an
  issue in the kubeadm repo. `coredns` (or `kube-dns`) should be in the `Pending` state
  until you have deployed the network add-on.
- If you see Pods in the `RunContainerError`, `CrashLoopBackOff` or `Error` state
  after deploying the network add-on and nothing happens to `coredns` (or `kube-dns`),
  it's very likely that the Pod Network add-on that you installed is somehow broken.
  You might have to grant it more RBAC privileges or use a newer version. Please file
  an issue in the Pod Network providers' issue tracker and get the issue triaged there.
-->
- 如果在**剛執行完** `kubeadm init` 之後就有 Pod 處於上述任一狀態，
  請在 kubeadm 儲存庫中建立一個 issue。在您部署網路附加元件之前，
  `coredns`（或 `kube-dns`）應該會維持在 `Pending` 狀態。
- 如果您在部署網路附加元件之後，看到 Pod 處於 `RunContainerError`、`CrashLoopBackOff`
  或 `Error` 狀態，而 `coredns`（或 `kube-dns`）也毫無變化，
  那麼很可能是您所安裝的 Pod 網路附加元件出了某些問題。
  您可能需要授予它更多 RBAC 權限，或改用較新的版本。
  請到該 Pod 網路供應商的 issue 追蹤系統中建立 issue，並在那裡進行問題分類與處理。

<!--
## `coredns` is stuck in the `Pending` state
-->
## `coredns` 卡在 `Pending` 狀態 {#coredns-is-stuck-in-the-pending-state}

<!--
This is **expected** and part of the design. kubeadm is network provider-agnostic, so the admin
should [install the pod network add-on](/docs/concepts/cluster-administration/addons/)
of choice. You have to install a Pod Network
before CoreDNS may be deployed fully. Hence the `Pending` state before the network is set up.
-->
這是**預期中**的行為，也是設計的一部分。kubeadm 不綁定特定的網路供應商，
因此管理員應自行[安裝所選的 Pod 網路附加元件](/docs/concepts/cluster-administration/addons/)。
您必須先安裝 Pod 網路，CoreDNS 才能完整部署。
這也是為什麼在網路設定完成之前，它會處於 `Pending` 狀態。

<!--
## `HostPort` services do not work
-->
## `HostPort` 服務無法運作 {#hostport-services-do-not-work}

<!--
The `HostPort` and `HostIP` functionality is available depending on your Pod Network
provider. Please contact the author of the Pod Network add-on to find out whether
`HostPort` and `HostIP` functionality are available.
-->
`HostPort` 與 `HostIP` 功能是否可用，取決於您所使用的 Pod 網路供應商。
請聯絡該 Pod 網路附加元件的作者，以確認是否支援 `HostPort` 與 `HostIP` 功能。

<!--
Calico, Canal, and Flannel CNI providers are verified to support HostPort.
-->
Calico、Canal 與 Flannel 這幾個 CNI 供應商已被驗證支援 HostPort。

<!--
For more information, see the
[CNI portmap documentation](https://github.com/containernetworking/plugins/blob/master/plugins/meta/portmap/README.md).
-->
詳情請參閱
[CNI portmap 文件](https://github.com/containernetworking/plugins/blob/master/plugins/meta/portmap/README.md)。

<!--
If your network provider does not support the portmap CNI plugin, you may need to use the
[NodePort feature of services](/docs/concepts/services-networking/service/#type-nodeport)
or use `HostNetwork=true`.
-->
如果您的網路供應商不支援 portmap CNI 外掛程式，
您可能需要改用 [Service 的 NodePort 功能](/docs/concepts/services-networking/service/#type-nodeport)，
或是使用 `HostNetwork=true`。

<!--
## Pods are not accessible via their Service IP
-->
## 無法透過 Service IP 存取 Pod {#pods-are-not-accessible-via-their-service-ip}

<!--
- Many network add-ons do not yet enable [hairpin mode](/docs/tasks/debug/debug-application/debug-service/#a-pod-fails-to-reach-itself-via-the-service-ip)
  which allows pods to access themselves via their Service IP. This is an issue related to
  [CNI](https://github.com/containernetworking/cni/issues/476). Please contact the network
  add-on provider to get the latest status of their support for hairpin mode.
-->
- 許多網路附加元件尚未啟用 [hairpin 模式](/docs/tasks/debug/debug-application/debug-service/#a-pod-fails-to-reach-itself-via-the-service-ip)，
  而該模式可讓 Pod 透過自身的 Service IP 存取自己。
  這是與 [CNI](https://github.com/containernetworking/cni/issues/476) 相關的問題。
  請聯絡網路附加元件的供應商，以取得他們對 hairpin 模式支援的最新狀態。

<!--
- If you are using VirtualBox (directly or via Vagrant), you will need to
  ensure that `hostname -i` returns a routable IP address. By default, the first
  interface is connected to a non-routable host-only network. A work around
  is to modify `/etc/hosts`, see this
  [Vagrantfile](https://github.com/errordeveloper/k8s-playground/blob/22dd39dfc06111235620e6c4404a96ae146f26fd/Vagrantfile#L11)
  for an example.
-->
- 如果您使用 VirtualBox（直接使用或透過 Vagrant），
  您必須確認 `hostname -i` 回傳的是可路由的 IP 位址。
  預設情況下，第一張網路介面會連接到不可路由的 host-only 網路。
  一種因應做法是修改 `/etc/hosts`，範例請參閱這個
  [Vagrantfile](https://github.com/errordeveloper/k8s-playground/blob/22dd39dfc06111235620e6c4404a96ae146f26fd/Vagrantfile#L11)。

<!--
## TLS certificate errors
-->
## TLS 憑證錯誤 {#tls-certificate-errors}

<!--
The following error indicates a possible certificate mismatch.
-->
以下錯誤表示憑證可能不相符。

```none
# kubectl get pods
Unable to connect to the server: x509: certificate signed by unknown authority (possibly because of "crypto/rsa: verification error" while trying to verify candidate authority certificate "kubernetes")
```

<!--
- Verify that the `$HOME/.kube/config` file contains a valid certificate, and
  regenerate a certificate if necessary. The certificates in a kubeconfig file
  are base64 encoded. The `base64 --decode` command can be used to decode the certificate
  and `openssl x509 -text -noout` can be used for viewing the certificate information.
-->
- 請確認 `$HOME/.kube/config` 檔案中包含有效的憑證，必要時重新產生憑證。
  kubeconfig 檔案中的憑證是以 base64 編碼儲存的。
  您可以使用 `base64 --decode` 指令解碼憑證，
  並使用 `openssl x509 -text -noout` 檢視憑證資訊。

<!--
- Unset the `KUBECONFIG` environment variable using:
-->
- 使用以下指令取消設定 `KUBECONFIG` 環境變數：

  ```sh
  unset KUBECONFIG
  ```

<!--
  Or set it to the default `KUBECONFIG` location:
-->
  或是將它設定為預設的 `KUBECONFIG` 位置：

  ```sh
  export KUBECONFIG=/etc/kubernetes/admin.conf
  ```

<!--
- Another workaround is to overwrite the existing `kubeconfig` for the "admin" user:
-->
- 另一種因應做法是覆寫「admin」使用者既有的 `kubeconfig`：

  ```sh
  mv $HOME/.kube $HOME/.kube.bak
  mkdir $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config
  ```

<!--
## Kubelet client certificate rotation fails {#kubelet-client-cert}
-->
## kubelet 用戶端憑證輪替失敗 {#kubelet-client-cert}

<!--
By default, kubeadm configures a kubelet with automatic rotation of client certificates by using the
`/var/lib/kubelet/pki/kubelet-client-current.pem` symlink specified in `/etc/kubernetes/kubelet.conf`.
If this rotation process fails you might see errors such as `x509: certificate has expired or is not yet valid`
in kube-apiserver logs. To fix the issue you must follow these steps:
-->
預設情況下，kubeadm 會透過 `/etc/kubernetes/kubelet.conf` 中所指定的
`/var/lib/kubelet/pki/kubelet-client-current.pem` 符號連結，
將 kubelet 設定為自動輪替用戶端憑證。
如果這個輪替過程失敗，您可能會在 kube-apiserver 的日誌中看到
`x509: certificate has expired or is not yet valid` 之類的錯誤。
若要修正這個問題，您必須依照以下步驟操作：

<!--
1. Backup and delete `/etc/kubernetes/kubelet.conf` and `/var/lib/kubelet/pki/kubelet-client*` from the failed node.
1. From a working control plane node in the cluster that has `/etc/kubernetes/pki/ca.key` execute
   `kubeadm kubeconfig user --org system:nodes --client-name system:node:$NODE > kubelet.conf`.
   `$NODE` must be set to the name of the existing failed node in the cluster.
   Modify the resulted `kubelet.conf` manually to adjust the cluster name and server endpoint,
   or pass `kubeconfig user --config` (see [Generating kubeconfig files for additional users](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#kubeconfig-additional-users)). If your cluster does not have
   the `ca.key` you must sign the embedded certificates in the `kubelet.conf` externally.
1. Copy this resulted `kubelet.conf` to `/etc/kubernetes/kubelet.conf` on the failed node.
1. Restart the kubelet (`systemctl restart kubelet`) on the failed node and wait for
   `/var/lib/kubelet/pki/kubelet-client-current.pem` to be recreated.
-->
1. 在發生問題的節點上備份並刪除 `/etc/kubernetes/kubelet.conf` 與 `/var/lib/kubelet/pki/kubelet-client*`。
1. 在叢集中一個運作正常、且擁有 `/etc/kubernetes/pki/ca.key` 的控制平面節點上，執行
   `kubeadm kubeconfig user --org system:nodes --client-name system:node:$NODE > kubelet.conf`。
   `$NODE` 必須設定為叢集中該問題節點的名稱。
   接著手動修改產生的 `kubelet.conf`，調整叢集名稱與伺服器端點，
   或是改用 `kubeconfig user --config`
   （請參閱[為其他使用者產生 kubeconfig 檔案](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#kubeconfig-additional-users)）。
   如果您的叢集中沒有 `ca.key`，則必須在外部為 `kubelet.conf` 中嵌入的憑證進行簽署。
1. 將產生的 `kubelet.conf` 複製到問題節點上的 `/etc/kubernetes/kubelet.conf`。
1. 在問題節點上重新啟動 kubelet（`systemctl restart kubelet`），
   並等待 `/var/lib/kubelet/pki/kubelet-client-current.pem` 重新產生。

<!--
1. Manually edit the `kubelet.conf` to point to the rotated kubelet client certificates, by replacing
   `client-certificate-data` and `client-key-data` with:
-->
1. 手動編輯 `kubelet.conf`，將 `client-certificate-data` 與 `client-key-data` 替換為以下內容，
   使其指向已輪替的 kubelet 用戶端憑證：

   ```yaml
   client-certificate: /var/lib/kubelet/pki/kubelet-client-current.pem
   client-key: /var/lib/kubelet/pki/kubelet-client-current.pem
   ```

<!--
1. Restart the kubelet.
1. Make sure the node becomes `Ready`.
-->
1. 重新啟動 kubelet。
1. 確認該節點的狀態變為 `Ready`。

<!--
## Default NIC When using flannel as the pod network in Vagrant
-->
## 在 Vagrant 中使用 flannel 作為 Pod 網路時的預設網路介面卡（NIC） {#default-nic-when-using-flannel-as-the-pod-network-in-vagrant}

<!--
The following error might indicate that something was wrong in the pod network:
-->
以下錯誤可能表示 Pod 網路出了問題：

```sh
Error from server (NotFound): the server could not find the requested resource
```

<!--
- If you're using flannel as the pod network inside Vagrant, then you will have to
  specify the default interface name for flannel.
-->
- 如果您在 Vagrant 中使用 flannel 作為 Pod 網路，就必須為 flannel 指定預設的網路介面名稱。

<!--
  Vagrant typically assigns two interfaces to all VMs. The first, for which all hosts
  are assigned the IP address `10.0.2.15`, is for external traffic that gets NATed.
-->
  Vagrant 通常會為所有虛擬機器配置兩張網路介面。
  第一張介面在所有主機上都會被指派 IP 位址 `10.0.2.15`，用於經過 NAT 的對外流量。

<!--
  This may lead to problems with flannel, which defaults to the first interface on a host.
  This leads to all hosts thinking they have the same public IP address. To prevent this,
  pass the `--iface eth1` flag to flannel so that the second interface is chosen.
-->
  由於 flannel 預設會使用主機上的第一張網路介面，這可能導致問題：
  所有主機都會誤以為自己擁有相同的公開 IP 位址。
  為避免這種情況，請將 `--iface eth1` 參數傳給 flannel，讓它改用第二張網路介面。

<!--
## Non-public IP used for containers
-->
## 容器使用了非公開的 IP {#non-public-ip-used-for-containers}

<!--
In some situations `kubectl logs` and `kubectl run` commands may return with the
following errors in an otherwise functional cluster:
-->
在某些情況下，即使叢集其他部分運作正常，
`kubectl logs` 與 `kubectl run` 指令仍可能回傳以下錯誤：

```console
Error from server: Get https://10.19.0.41:10250/containerLogs/default/mysql-ddc65b868-glc5m/mysql: dial tcp 10.19.0.41:10250: getsockopt: no route to host
```

<!--
- This may be due to Kubernetes using an IP that can not communicate with other IPs on
  the seemingly same subnet, possibly by policy of the machine provider.
- DigitalOcean assigns a public IP to `eth0` as well as a private one to be used internally
  as anchor for their floating IP feature, yet `kubelet` will pick the latter as the node's
  `InternalIP` instead of the public one.
-->
- 這可能是因為 Kubernetes 使用了一個無法與同一子網路（看似同一子網路）中其他 IP 通訊的位址，
  原因也許是機器供應商的網路政策所致。
- DigitalOcean 會為 `eth0` 指派一個公開 IP，同時也會指派一個私有 IP，
  作為其浮動 IP 功能在內部使用的 anchor；然而 `kubelet` 會選擇後者，
  而非公開 IP，作為該節點的 `InternalIP`。

<!--
  Use `ip addr show` to check for this scenario instead of `ifconfig` because `ifconfig` will
  not display the offending alias IP address. Alternatively an API endpoint specific to
  DigitalOcean allows to query for the anchor IP from the droplet:
-->
  請使用 `ip addr show` 而非 `ifconfig` 來檢查這種情況，
  因為 `ifconfig` 不會顯示造成問題的別名 IP 位址。
  此外，DigitalOcean 也提供了專屬的 API 端點，可從 droplet 查詢 anchor IP：

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
-->
  因應做法是透過 `--node-ip` 告訴 `kubelet` 該使用哪一個 IP。
  以 DigitalOcean 為例，它可以是公開 IP（指派給 `eth0`），
  若您想使用選用的私有網路，也可以是私有 IP（指派給 `eth1`）。
  您可以透過 kubeadm
  [`NodeRegistrationOptions` 結構](/docs/reference/config-api/kubeadm-config.v1beta4/#kubeadm-k8s-io-v1beta4-NodeRegistrationOptions)
  中的 `kubeletExtraArgs` 區段來設定這一點。

<!--
  Then restart `kubelet`:
-->
  接著重新啟動 `kubelet`：

  ```sh
  systemctl daemon-reload
  systemctl restart kubelet
  ```

<!--
## `coredns` pods have `CrashLoopBackOff` or `Error` state
-->
## `coredns` Pod 處於 `CrashLoopBackOff` 或 `Error` 狀態 {#coredns-pods-have-crashloopbackoff-or-error-state}

<!--
If you have nodes that are running SELinux with an older version of Docker, you might experience a scenario
where the `coredns` pods are not starting. To solve that, you can try one of the following options:
-->
如果您的節點在啟用 SELinux 的情況下執行較舊版本的 Docker，
可能會遇到 `coredns` Pod 無法啟動的情況。若要解決這個問題，您可以嘗試以下其中一種做法：

<!--
- Upgrade to a [newer version of Docker](/docs/setup/production-environment/container-runtimes/#docker).
-->
- 升級到[較新版本的 Docker](/docs/setup/production-environment/container-runtimes/#docker)。

<!--
- [Disable SELinux](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/6/html/security-enhanced_linux/sect-security-enhanced_linux-enabling_and_disabling_selinux-disabling_selinux).
-->
- [停用 SELinux](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/6/html/security-enhanced_linux/sect-security-enhanced_linux-enabling_and_disabling_selinux-disabling_selinux)。

<!--
- Modify the `coredns` deployment to set `allowPrivilegeEscalation` to `true`:
-->
- 修改 `coredns` 的 Deployment，將 `allowPrivilegeEscalation` 設為 `true`：

```bash
kubectl -n kube-system get deployment coredns -o yaml | \
  sed 's/allowPrivilegeEscalation: false/allowPrivilegeEscalation: true/g' | \
  kubectl apply -f -
```

<!--
Another cause for CoreDNS to have `CrashLoopBackOff` is when a CoreDNS Pod deployed in Kubernetes detects a loop.
[A number of workarounds](https://github.com/coredns/coredns/tree/master/plugin/loop#troubleshooting-loops-in-kubernetes-clusters)
are available to avoid Kubernetes trying to restart the CoreDNS Pod every time CoreDNS detects the loop and exits.
-->
CoreDNS 出現 `CrashLoopBackOff` 的另一個原因，是部署在 Kubernetes 中的 CoreDNS Pod 偵測到了迴圈。
目前有[數種因應做法](https://github.com/coredns/coredns/tree/master/plugin/loop#troubleshooting-loops-in-kubernetes-clusters)，
可避免每當 CoreDNS 偵測到迴圈並結束時，Kubernetes 就嘗試重新啟動 CoreDNS Pod 的情況。

{{< warning >}}
<!--
Disabling SELinux or setting `allowPrivilegeEscalation` to `true` can compromise
the security of your cluster.
-->
停用 SELinux 或將 `allowPrivilegeEscalation` 設為 `true`，可能會危害叢集的安全性。
{{< /warning >}}

<!--
## etcd pods restart continually
-->
## etcd Pod 持續重新啟動 {#etcd-pods-restart-continually}

<!--
If you encounter the following error:
-->
如果您遇到以下錯誤：

```
rpc error: code = 2 desc = oci runtime error: exec failed: container_linux.go:247: starting container process caused "process_linux.go:110: decoding init error from pipe caused \"read parent: connection reset by peer\""
```

<!--
This issue appears if you run CentOS 7 with Docker 1.13.1.84.
This version of Docker can prevent the kubelet from executing into the etcd container.
-->
這個問題會出現在使用 CentOS 7 搭配 Docker 1.13.1.84 的情況下。
這個版本的 Docker 會導致 kubelet 無法在 etcd 容器中執行指令。

<!--
To work around the issue, choose one of these options:
-->
若要解決這個問題，請選擇以下其中一種做法：

<!--
- Roll back to an earlier version of Docker, such as 1.13.1-75
-->
- 回退到較舊版本的 Docker，例如 1.13.1-75：

  ```
  yum downgrade docker-1.13.1-75.git8633870.el7.centos.x86_64 docker-client-1.13.1-75.git8633870.el7.centos.x86_64 docker-common-1.13.1-75.git8633870.el7.centos.x86_64
  ```

<!--
- Install one of the more recent recommended versions, such as 18.06:
-->
- 安裝較新的建議版本之一，例如 18.06：

  ```bash
  sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
  yum install docker-ce-18.06.1.ce-3.el7.x86_64
  ```

<!--
## Not possible to pass a comma separated list of values to arguments inside a `--component-extra-args` flag
-->
## 無法將以逗號分隔的值列表傳入 `--component-extra-args` 參數 {#not-possible-to-pass-a-comma-separated-list-of-values-to-arguments-inside-a-component-extra-args-flag}

<!--
`kubeadm init` flags such as `--component-extra-args` allow you to pass custom arguments to a control-plane
component like the kube-apiserver. However, this mechanism is limited due to the underlying type used for parsing
the values (`mapStringString`).
-->
`kubeadm init` 的 `--component-extra-args` 之類的命令列參數，
可讓您將自訂參數傳遞給 kube-apiserver 等控制平面組件。
不過，由於底層用來解析這些值的型別（`mapStringString`）限制，此機制的能力有限。

<!--
If you decide to pass an argument that supports multiple, comma-separated values such as
`--apiserver-extra-args "enable-admission-plugins=LimitRanger,NamespaceExists"` this flag will fail with
`flag: malformed pair, expect string=string`. This happens because the list of arguments for
`--apiserver-extra-args` expects `key=value` pairs and in this case `NamespacesExists` is considered
as a key that is missing a value.
-->
如果您想傳入支援多個以逗號分隔之值的參數，例如
`--apiserver-extra-args "enable-admission-plugins=LimitRanger,NamespaceExists"`，
這個參數會失敗並回報 `flag: malformed pair, expect string=string`。
這是因為 `--apiserver-extra-args` 的參數列表預期的是 `key=value` 配對，
而在這個例子中，`NamespacesExists` 會被視為一個缺少值的鍵。

<!--
Alternatively, you can try separating the `key=value` pairs like so:
`--apiserver-extra-args "enable-admission-plugins=LimitRanger,enable-admission-plugins=NamespaceExists"`
but this will result in the key `enable-admission-plugins` only having the value of `NamespaceExists`.
-->
您也可以嘗試像這樣把 `key=value` 配對分開撰寫：
`--apiserver-extra-args "enable-admission-plugins=LimitRanger,enable-admission-plugins=NamespaceExists"`，
但這麼做的結果是 `enable-admission-plugins` 這個鍵只會保留 `NamespaceExists` 這個值。

<!--
A known workaround is to use the kubeadm [configuration file](/docs/reference/config-api/kubeadm-config.v1beta4/).
-->
一個已知的因應做法是改用 kubeadm 的[設定檔](/docs/reference/config-api/kubeadm-config.v1beta4/)。

<!--
## kube-proxy scheduled before node is initialized by cloud-controller-manager
-->
## kube-proxy 在節點被 cloud-controller-manager 初始化之前就被排程 {#kube-proxy-scheduled-before-node-is-initialized-by-cloud-controller-manager}

<!--
In cloud provider scenarios, kube-proxy can end up being scheduled on new worker nodes before
the cloud-controller-manager has initialized the node addresses. This causes kube-proxy to fail
to pick up the node's IP address properly and has knock-on effects to the proxy function managing
load balancers.
-->
在雲端供應商的環境中，kube-proxy 可能會在 cloud-controller-manager 初始化節點位址之前，
就被排程到新的工作節點上。這會導致 kube-proxy 無法正確取得節點的 IP 位址，
並連帶影響負責管理負載平衡器的 proxy 功能。

<!--
The following error can be seen in kube-proxy Pods:
-->
您可以在 kube-proxy Pod 中看到以下錯誤：

```
server.go:610] Failed to retrieve node IP: host IP unknown; known addresses: []
proxier.go:340] invalid nodeIP, initializing kube-proxy with 127.0.0.1 as nodeIP
```

<!--
A known solution is to patch the kube-proxy DaemonSet to allow scheduling it on control-plane
nodes regardless of their conditions, keeping it off of other nodes until their initial guarding
conditions abate:
-->
一個已知的解法是修補（patch）kube-proxy 的 DaemonSet，
讓它無論控制平面節點處於何種狀態都能被排程到這些節點上，
同時在其他節點的初始防護條件解除之前，不將它排程到這些節點：

```
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
這個問題的追蹤 issue 請見[此處](https://github.com/kubernetes/kubeadm/issues/1027)。

<!--
## `/usr` is mounted read-only on nodes {#usr-mounted-read-only}
-->
## 節點上的 `/usr` 以唯讀方式掛載 {#usr-mounted-read-only}

<!--
On Linux distributions such as Fedora CoreOS or Flatcar Container Linux, the directory `/usr` is mounted as a read-only filesystem.
For [flex-volume support](https://github.com/kubernetes/community/blob/ab55d85/contributors/devel/sig-storage/flexvolume.md),
Kubernetes components like the kubelet and kube-controller-manager use the default path of
`/usr/libexec/kubernetes/kubelet-plugins/volume/exec/`, yet the flex-volume directory _must be writeable_
for the feature to work.
-->
在 Fedora CoreOS 或 Flatcar Container Linux 之類的 Linux 發行版上，
`/usr` 目錄會以唯讀檔案系統的方式掛載。
為了支援 [flex-volume](https://github.com/kubernetes/community/blob/ab55d85/contributors/devel/sig-storage/flexvolume.md)，
kubelet 與 kube-controller-manager 等 Kubernetes 組件會使用預設路徑
`/usr/libexec/kubernetes/kubelet-plugins/volume/exec/`，
但這項功能要能運作，flex-volume 目錄**必須是可寫入的**。

{{< note >}}
<!--
FlexVolume was deprecated in the Kubernetes v1.23 release.
-->
FlexVolume 已在 Kubernetes v1.23 版中被棄用。
{{< /note >}}

<!--
To workaround this issue, you can configure the flex-volume directory using the kubeadm
[configuration file](/docs/reference/config-api/kubeadm-config.v1beta4/).
-->
若要解決這個問題，您可以透過 kubeadm 的[設定檔](/docs/reference/config-api/kubeadm-config.v1beta4/)
來設定 flex-volume 目錄。

<!--
On the primary control-plane Node (created using `kubeadm init`), pass the following
file using `--config`:
-->
在主要的控制平面節點（以 `kubeadm init` 建立）上，使用 `--config` 傳入以下檔案：

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
在加入叢集的節點上：

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
另一種做法是修改 `/etc/fstab`，讓 `/usr` 掛載點變成可寫入；
但請注意，這麼做等於更動了該 Linux 發行版的設計原則。

<!--
## `kubeadm upgrade plan` prints out `context deadline exceeded` error message
-->
## `kubeadm upgrade plan` 印出 `context deadline exceeded` 錯誤訊息 {#kubeadm-upgrade-plan-prints-out-context-deadline-exceeded-error-message}

<!--
This error message is shown when upgrading a Kubernetes cluster with `kubeadm` in
the case of running an external etcd. This is not a critical bug and happens because
older versions of kubeadm perform a version check on the external etcd cluster.
You can proceed with `kubeadm upgrade apply ...`.
-->
當您使用 `kubeadm` 升級搭配外部 etcd 的 Kubernetes 叢集時，就會出現這個錯誤訊息。
這並不是嚴重的錯誤，發生原因是較舊版本的 kubeadm 會對外部 etcd 叢集執行版本檢查。
您可以繼續執行 `kubeadm upgrade apply ...`。

<!--
This issue is fixed as of version 1.19.
-->
這個問題已在 1.19 版中修正。

<!--
## `kubeadm reset` unmounts `/var/lib/kubelet`
-->
## `kubeadm reset` 會卸載 `/var/lib/kubelet` {#kubeadm-reset-unmounts-var-lib-kubelet}

<!--
If `/var/lib/kubelet` is being mounted, performing a `kubeadm reset` will effectively unmount it.
-->
如果 `/var/lib/kubelet` 是以掛載的方式存在，執行 `kubeadm reset` 實際上會將它卸載。

<!--
To workaround the issue, re-mount the `/var/lib/kubelet` directory after performing the `kubeadm reset` operation.
-->
因應做法是在執行完 `kubeadm reset` 之後，重新掛載 `/var/lib/kubelet` 目錄。

<!--
This is a regression introduced in kubeadm 1.15. The issue is fixed in 1.20.
-->
這是 kubeadm 1.15 引入的迴歸問題，並已在 1.20 版中修正。

<!--
## Cannot use the metrics-server securely in a kubeadm cluster
-->
## 無法在 kubeadm 叢集中安全地使用 metrics-server {#cannot-use-the-metrics-server-securely-in-a-kubeadm-cluster}

<!--
In a kubeadm cluster, the [metrics-server](https://github.com/kubernetes-sigs/metrics-server)
can be used insecurely by passing the `--kubelet-insecure-tls` to it. This is not recommended for production clusters.
-->
在 kubeadm 叢集中，只要為 [metrics-server](https://github.com/kubernetes-sigs/metrics-server)
傳入 `--kubelet-insecure-tls`，就能以不安全的方式使用它。
但在正式環境的叢集中並不建議這麼做。

<!--
If you want to use TLS between the metrics-server and the kubelet there is a problem,
since kubeadm deploys a self-signed serving certificate for the kubelet. This can cause the following errors
on the side of the metrics-server:
-->
如果您想在 metrics-server 與 kubelet 之間使用 TLS，則會遇到一個問題：
kubeadm 為 kubelet 部署的是自我簽署的服務憑證。
這會導致 metrics-server 端出現以下錯誤：

```
x509: certificate signed by unknown authority
x509: certificate is valid for IP-foo not IP-bar
```

<!--
See [Enabling signed kubelet serving certificates](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#kubelet-serving-certs)
to understand how to configure the kubelets in a kubeadm cluster to have properly signed serving certificates.
-->
請參閱[啟用已簽署的 kubelet 服務憑證](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#kubelet-serving-certs)，
以了解如何在 kubeadm 叢集中設定 kubelet，使其擁有正確簽署的服務憑證。

<!--
Also see [How to run the metrics-server securely](https://github.com/kubernetes-sigs/metrics-server/blob/master/FAQ.md#how-to-run-metrics-server-securely).
-->
另請參閱[如何安全地執行 metrics-server](https://github.com/kubernetes-sigs/metrics-server/blob/master/FAQ.md#how-to-run-metrics-server-securely)。

<!--
## Upgrade fails due to etcd hash not changing
-->
## 因 etcd 雜湊值未變更而升級失敗 {#upgrade-fails-due-to-etcd-hash-not-changing}

<!--
Only applicable to upgrading a control plane node with a kubeadm binary v1.28.3 or later,
where the node is currently managed by kubeadm versions v1.28.0, v1.28.1 or v1.28.2.
-->
此情況僅適用於：使用 v1.28.3 或更新版本的 kubeadm 二進位檔升級控制平面節點，
且該節點目前是由 kubeadm v1.28.0、v1.28.1 或 v1.28.2 版所管理。

<!--
Here is the error message you may encounter:
-->
您可能會遇到的錯誤訊息如下：

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
-->
造成這項失敗的原因是：受影響的版本所產生的 etcd 設定檔（manifest），
會在 PodSpec 中帶有非預期的預設值。
這會在比對設定檔時產生差異，使得 kubeadm 預期 Pod 雜湊值會改變，
但 kubelet 卻始終不會更新該雜湊值。

<!--
There are two way to workaround this issue if you see it in your cluster:
-->
如果您在叢集中遇到這個問題，有兩種因應做法：

<!--
- The etcd upgrade can be skipped between the affected versions and v1.28.3 (or later) by using:
-->
- 在受影響的版本與 v1.28.3（或更新版本）之間升級時，可以使用以下指令略過 etcd 升級：

  ```shell
  kubeadm upgrade {apply|node} [version] --etcd-upgrade=false
  ```

<!--
  This is not recommended in case a new etcd version was introduced by a later v1.28 patch version.
-->
  若後續的 v1.28 修補版本引入了新的 etcd 版本，則不建議採用這種做法。

<!--
- Before upgrade, patch the manifest for the etcd static pod, to remove the problematic defaulted attributes:
-->
- 在升級之前，先修補 etcd 靜態 Pod 的設定檔，移除有問題的預設屬性：

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
更多資訊請參閱這個錯誤的[追蹤 issue](https://github.com/kubernetes/kubeadm/issues/2927)。
