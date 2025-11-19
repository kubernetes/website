---
title: kubeadm init
content_type: concept
weight: 20
---

<!-- overview -->

<!--
This command initializes a Kubernetes control plane node.
-->
此命令初始化一個 Kubernetes 控制平面節點。

<!-- body -->

{{< include "generated/kubeadm_init/_index.md" >}}

<!--
### Init workflow {#init-workflow}
-->
### Init 命令的工作流程 {#init-workflow}

<!--
`kubeadm init` bootstraps a Kubernetes control plane node by executing the
following steps:
-->
`kubeadm init` 命令通過執行下列步驟來啓動一個 Kubernetes 控制平面節點。

<!--
1. Runs a series of pre-flight checks to validate the system state
   before making changes. Some checks only trigger warnings, others are
   considered errors and will exit kubeadm until the problem is corrected or the
   user specifies `--ignore-preflight-errors=<list-of-errors>`.
-->
1. 在做出變更前運行一系列的預檢項來驗證系統狀態。一些檢查項目僅僅觸發警告，
   其它的則會被視爲錯誤並且退出 kubeadm，除非問題得到解決或者使用者指定了
   `--ignore-preflight-errors=<錯誤列表>` 參數。

<!--
1. Generates a self-signed CA to set up identities for each component in the cluster. The user can provide their
   own CA cert and/or key by dropping it in the cert directory configured via `--cert-dir`
   (`/etc/kubernetes/pki` by default).
   The API server certs will have additional SAN entries for any `--apiserver-cert-extra-sans` arguments, lowercased if necessary.
-->
2. 生成一個自簽名的 CA 證書來爲叢集中的每一個組件建立身份標識。
   使用者可以通過將其放入 `--cert-dir` 設定的證書目錄中（默認爲 `/etc/kubernetes/pki`）
   來提供他們自己的 CA 證書以及/或者密鑰。
   API 伺服器證書將爲所有 `--apiserver-cert-extra-sans` 參數值提供附加的 SAN 條目，必要時將其小寫。

<!--
1. Writes kubeconfig files in `/etc/kubernetes/` for the kubelet, the controller-manager and the
   scheduler to connect to the API server, each with its own identity. Also
   additional kubeconfig files are written, for kubeadm as administrative entity (`admin.conf`)
   and for a super admin user that can bypass RBAC (`super-admin.conf`).
-->
3. 將 kubeconfig 文件寫入 `/etc/kubernetes/` 目錄以便 kubelet、控制器管理器和調度器連接到
   API 伺服器，它們每一個都有自己的身份標識。再編寫額外的 kubeconfig 文件，將 kubeadm
   作爲管理實體（`admin.conf`）和可以繞過 RBAC 的超級管理員使用者（`super-admin.conf`）。

<!--
1. Generates static Pod manifests for the API server,
   controller-manager and scheduler. In case an external etcd is not provided,
   an additional static Pod manifest is generated for etcd.

   Static Pod manifests are written to `/etc/kubernetes/manifests`; the kubelet
   watches this directory for Pods to create on startup.

   Once control plane Pods are up and running, the `kubeadm init` sequence can continue.
-->
4. 爲 API 伺服器、控制器管理器和調度器生成靜態 Pod 的清單文件。假使沒有提供一個外部的 etcd
   服務的話，也會爲 etcd 生成一份額外的靜態 Pod 清單文件。

   靜態 Pod 的清單文件被寫入到 `/etc/kubernetes/manifests` 目錄；
   kubelet 會監視這個目錄以便在系統啓動的時候創建 Pod。

   一旦控制平面的 Pod 都運行起來，`kubeadm init` 的工作流程就繼續往下執行。

<!--
1. Apply labels and taints to the control plane node so that no additional workloads will
   run there.
-->
5. 對控制平面節點應用標籤和污點標記以便不會在它上面運行其它的工作負載。

<!--
1. Generates the token that additional nodes can use to register
   themselves with a control plane in the future. Optionally, the user can provide a
   token via `--token`, as described in the
   [kubeadm token](/docs/reference/setup-tools/kubeadm/kubeadm-token/) documents.
-->
6. 生成令牌，將來其他節點可使用該令牌向控制平面註冊自己。如
   [kubeadm token](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-token/)
   文檔所述，使用者可以選擇通過 `--token` 提供令牌。

<!--
1. Makes all the necessary configurations for allowing node joining with the
   [Bootstrap Tokens](/docs/reference/access-authn-authz/bootstrap-tokens/) and
   [TLS Bootstrap](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)
   mechanism:

   - Write a ConfigMap for making available all the information required
     for joining, and set up related RBAC access rules.

   - Let Bootstrap Tokens access the CSR signing API.

   - Configure auto-approval for new CSR requests.

   See [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) for additional information.
-->
7. 爲了使得節點能夠遵照[啓動引導令牌](/zh-cn/docs/reference/access-authn-authz/bootstrap-tokens/)和
   [TLS 啓動引導](/zh-cn/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)
   這兩份文檔中描述的機制加入到叢集中，kubeadm 會執行所有的必要設定：

   - 創建一個 ConfigMap 提供添加叢集節點所需的信息，併爲該 ConfigMap 設置相關的 RBAC 訪問規則。

   - 允許啓動引導令牌訪問 CSR 簽名 API。

   - 設定自動簽發新的 CSR 請求。

   更多相關信息，請查看 [kubeadm join](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-join/)。

<!--
1. Installs a DNS server (CoreDNS) and the kube-proxy addon components via the API server.
   In Kubernetes version 1.11 and later CoreDNS is the default DNS server.
   Please note that although the DNS server is deployed, it will not be scheduled until CNI is installed.
-->
8. 通過 API 伺服器安裝一個 DNS 伺服器 (CoreDNS) 和 kube-proxy 附加組件。
   在 Kubernetes v1.11 和更高版本中，CoreDNS 是默認的 DNS 伺服器。
   請注意，儘管已部署 DNS 伺服器，但直到安裝 CNI 時才調度它。

   {{< warning >}}
   <!--
   kube-dns usage with kubeadm is deprecated as of v1.18 and is removed in v1.21.
   -->
   從 v1.18 開始，在 kubeadm 中使用 kube-dns 的支持已被廢棄，並已在 v1.21 版本中移除。
   {{< /warning >}}

<!--
### Using init phases with kubeadm {#init-phases}

kubeadm allows you to create a control plane node in phases using the `kubeadm init phase` command.
-->
### 在 kubeadm 中使用 init 階段 {#init-phases}

kubeadm 允許你使用 `kubeadm init phase` 命令分階段創建控制平面節點。

<!--
To view the ordered list of phases and sub-phases you can call `kubeadm init -help`. 
The list will be located at the top of the help screen and each phase will have a description next to it.
Note that by calling `kubeadm init` all of the phases and sub-phases will be executed in this exact order.
-->
要查看階段和子階段的有序列表，可以調用 `kubeadm init --help`。
該列表將位於幫助屏幕的頂部，每個階段旁邊都有一個描述。
注意，通過調用 `kubeadm init`，所有階段和子階段都將按照此確切順序執行。

<!--
Some phases have unique flags, so if you want to have a look at the list of available options add `-help`, for example:
-->
某些階段具有唯一的標誌，因此，如果要查看可用選項的列表，請添加 `--help`，例如：

```shell
sudo kubeadm init phase control-plane controller-manager --help
```

<!--
You can also use `--help` to see the list of sub-phases for a certain parent phase:
-->
你也可以使用 `--help` 查看特定父階段的子階段列表：

```shell
sudo kubeadm init phase control-plane --help
```

<!--
`kubeadm init` also exposes a flag called `--skip-phases` that can be used to skip certain phases.
The flag accepts a list of phase names and the names can be taken from the above ordered list.
-->
`kubeadm init` 還公開了一個名爲 `--skip-phases` 的參數，該參數可用於跳過某些階段。
參數接受階段名稱列表，並且這些名稱可以從上面的有序列表中獲取。

<!--
An example:
-->
例如：

<!--
# you can now modify the control plane and etcd manifest files
-->
```shell
sudo kubeadm init phase control-plane all --config=configfile.yaml
sudo kubeadm init phase etcd local --config=configfile.yaml
# 你現在可以修改控制平面和 etcd 清單文件
sudo kubeadm init --skip-phases=control-plane,etcd --config=configfile.yaml
```

<!--
What this example would do is write the manifest files for the control plane and etcd in
`/etc/kubernetes/manifests` based on the configuration in `configfile.yaml`. This allows you to
modify the files and then skip these phases using `--skip-phases`. By calling the last command you
will create a control plane node with the custom manifest files.
-->
該示例將執行的操作是基於 `configfile.yaml` 中的設定在 `/etc/kubernetes/manifests`
中寫入控制平面和 etcd 的清單文件。
這允許你修改文件，然後使用 `--skip-phases` 跳過這些階段。
通過調用最後一個命令，你將使用自定義清單文件創建一個控制平面節點。

{{< feature-state for_k8s_version="v1.22" state="beta" >}}

<!--
Alternatively, you can use the `skipPhases` field under `InitConfiguration`.
-->
或者，你可以使用 `InitConfiguration` 下的 `skipPhases` 字段。

<!--
### Using kubeadm init with a configuration file {#config-file}
-->
### 結合一份設定文件來使用 kubeadm init {#config-file}

{{< caution >}}
<!--
The configuration file is still considered beta and may change in future versions.
-->
設定文件的功能仍然處於 Beta 狀態並且在將來的版本中可能會改變。
{{< /caution >}}

<!--
It's possible to configure `kubeadm init` with a configuration file instead of command
line flags, and some more advanced features may only be available as
configuration file options. This file is passed using the `--config` flag and it must
contain a `ClusterConfiguration` structure and optionally more structures separated by `---\n`.
Mixing `--config` with others flags may not be allowed in some cases.
-->
通過一份設定文件而不是使用命令列參數來設定 `kubeadm init` 命令是可能的，
但是一些更加高級的功能只能夠通過設定文件設定。
這份設定文件通過 `--config` 選項參數指定的，
它必須包含 `ClusterConfiguration` 結構，並可能包含更多由 `---\n` 分隔的結構。
在某些情況下，可能不允許將 `--config` 與其他標誌混合使用。

<!--
The default configuration can be printed out using the
[kubeadm config print](/docs/reference/setup-tools/kubeadm/kubeadm-config/) command.

If your configuration is not using the latest version it is **recommended** that you migrate using
the [kubeadm config migrate](/docs/reference/setup-tools/kubeadm/kubeadm-config/) command.

For more information on the fields and usage of the configuration you can navigate to our
[API reference page](/docs/reference/config-api/kubeadm-config.v1beta4/).
-->
可以使用 [kubeadm config print](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-config/)
命令打印出默認設定。

如果你的設定沒有使用最新版本，**推薦**使用
[kubeadm config migrate](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-config/)
命令進行遷移。

關於設定的字段和用法的更多信息，你可以訪問 [API 參考頁面](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4/)。

<!--
### Using kubeadm init with feature gates {#feature-gates}
-->
### 使用 kubeadm init 時設置特性門控 {#feature-gates}

<!--
kubeadm supports a set of feature gates that are unique to kubeadm and can only be applied
during cluster creation with `kubeadm init`. These features can control the behavior
of the cluster. Feature gates are removed after a feature graduates to GA.
-->
kubeadm 支持一組獨有的特性門控，只能在 `kubeadm init` 創建叢集期間使用。
這些特性可以控制叢集的行爲。特性門控會在畢業到 GA 後被移除。

<!--
To pass a feature gate you can either use the `--feature-gates` flag for
`kubeadm init`, or you can add items into the `featureGates` field when you pass
a [configuration file](/docs/reference/config-api/kubeadm-config.v1beta4/#kubeadm-k8s-io-v1beta4-ClusterConfiguration)
using `--config`.
-->
你可以使用 `--feature-gates` 標誌來爲 `kubeadm init` 設置特性門控，
或者你可以在用 `--config`
傳遞[設定文件](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4/#kubeadm-k8s-io-v1beta4-ClusterConfiguration)時添加條目到
`featureGates` 字段中。

<!--
Passing [feature gates for core Kubernetes components](/docs/reference/command-line-tools-reference/feature-gates)
directly to kubeadm is not supported. Instead, it is possible to pass them by
[Customizing components with the kubeadm API](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/).
-->
直接傳遞 [Kubernetes 核心組件的特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates)給 kubeadm 是不支持的。
相反，可以通過[使用 kubeadm API 的自定義組件](/zh-cn/docs/setup/production-environment/tools/kubeadm/control-plane-flags/)來傳遞。

<!--
List of feature gates:
-->
特性門控的列表：

<!--
{{< table caption="kubeadm feature gates" >}}
Feature | Default | Alpha | Beta | GA
:-------|:--------|:------|:-----|:----
`ControlPlaneKubeletLocalMode` | `true` | 1.31 | 1.33 | -
`NodeLocalCRISocket` | `true` | 1.32 | 1.34 | -
`WaitForAllControlPlaneComponents` | `true` | 1.30 | 1.33 | 1.34
{{< /table >}}
-->
{{< table caption="kubeadm 特性門控" >}}
特性 | 默認值 | Alpha | Beta | GA
:-------|:--------|:------|:-----|:----
`ControlPlaneKubeletLocalMode` | `true` | 1.31 | 1.33 | -
`NodeLocalCRISocket` | `true` | 1.32 | 1.34 | -
`WaitForAllControlPlaneComponents` | `true` | 1.30 | 1.33 | 1.34
{{< /table >}}

{{< note >}}
<!--
Once a feature gate goes GA its value becomes locked to `true` by default.
-->
一旦特性門控變成了 GA，它的值會被默認鎖定爲 `true`。
{{< /note >}}

<!--
Feature gate descriptions:
-->
特性門控的描述：

<!--
`ControlPlaneKubeletLocalMode`
: With this feature gate enabled, when joining a new control plane node, kubeadm will configure the kubelet
  to connect to the local kube-apiserver. This ensures that there will not be a violation of the version skew
  policy during rolling upgrades.
-->
`ControlPlaneKubeletLocalMode`
: 啓用此特性門控後，當加入新的控制平面節點時，
  kubeadm 將設定 kubelet 連接到本地 kube-apiserver。
  這將確保在滾動升級期間不會違反版本偏差策略。

<!--
`NodeLocalCRISocket`
: With this feature gate enabled, kubeadm will read/write the CRI socket for each node from/to the file
  `/var/lib/kubelet/instance-config.yaml` instead of reading/writing it from/to the annotation
  `kubeadm.alpha.kubernetes.io/cri-socket` on the Node object. The new file is applied as an instance
  configuration patch, before any other user managed patches are applied when the `--patches` flag
  is used. It contains a single field `containerRuntimeEndpoint` from the
  [KubeletConfiguration file format](/docs/reference/config-api/kubelet-config.v1beta1/). If the feature gate
  is enabled during upgrade, but the file `/var/lib/kubelet/instance-config.yaml` does not exist yet,
  kubeadm will attempt to read the CRI socket value from the file `/var/lib/kubelet/kubeadm-flags.env`.
-->
`NodeLocalCRISocket`
: 啓用此特性門控後，kubeadm 將使用 `/var/lib/kubelet/instance-config.yaml` 文件讀寫每個節點的 CRI 套接字，
  不再是從 Node 對象上的 `kubeadm.alpha.kubernetes.io/cri-socket` 註解讀取 CRI 套接字，
  也不再將 CRI 套接字寫入到 Node 對象的 `kubeadm.alpha.kubernetes.io/cri-socket` 註解。
  這個新的文件將作爲實例設定補丁被應用，之後纔會應用其他通過 `--patches` 標誌設置的使用者管理的補丁。
  這個新的文件僅包含源自
  [KubeletConfiguration 文件格式](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)的字段
  `containerRuntimeEndpoint`。如果升級期間此特性門控被啓用，但 `/var/lib/kubelet/instance-config.yaml`
  文件還不存在，kubeadm 將嘗試從 `/var/lib/kubelet/kubeadm-flags.env` 文件讀取 CRI 套接字值。

<!--
`WaitForAllControlPlaneComponents`
: With this feature gate enabled, kubeadm will wait for all control plane components (kube-apiserver,
  kube-controller-manager, kube-scheduler) on a control plane node to report status 200 on their `/livez`
  or `/healthz` endpoints. These checks are performed on `https://ADDRESS:PORT/ENDPOINT`.

  - `PORT` is taken from `--secure-port` of a component.
  - `ADDRESS` is `--advertise-address` for kube-apiserver and `--bind-address` for the
     kube-controller-manager and kube-scheduler.
  - `ENDPOINT` is only `/healthz` for kube-controller-manager until it supports `/livez` as well.
-->
`WaitForAllControlPlaneComponents`
: 啓用此特性門控後，kubeadm 將等待控制平面節點上的所有控制平面組件
  （kube-apiserver、kube-controller-manager、kube-scheduler）在其 `/livez` 或 `/healthz`
  端點上報告 200 狀態碼。這些檢測請求是針對 `https://ADDRESS:PORT/ENDPOINT` 進行的。其中：

  - `PORT` 取自組件的 `--secure-port` 標誌。
  - `ADDRESS` 對 kube-apiserver 而言是其 `--advertise-address`，對於 kube-scheduler 和
    kube-controller-manager 而言是其 `--bind-address`。
  - 對於 kube-controller-manager，其 `ENDPOINT` 只能是 `/healthz`，直到它也支持 `/livez` 爲止。

  <!--
  If you specify custom `ADDRESS` or `PORT` in the kubeadm configuration they will be respected.
  Without the feature gate enabled, kubeadm will only wait for the kube-apiserver
  on a control plane node to become ready. The wait process starts right after the kubelet on the host
  is started by kubeadm. You are advised to enable this feature gate in case you wish to observe a ready
  state from all control plane components during the `kubeadm init` or `kubeadm join` command execution.
  -->
  如果你在 kubeadm 設定中指定自定義的 `ADDRESS` 或 `PORT`，kubeadm 將使用這些定製的值。
  如果沒有啓用此特性門控，kubeadm 將僅等待控制平面節點上的 kube-apiserver 準備就緒。
  等待過程在 kubeadm 啓動主機上的 kubelet 後立即開始。如果你希望在 `kubeadm init`
  或 `kubeadm join` 命令執行期間觀察所有控制平面組件的就緒狀態，建議你啓用此特性門控。

<!--
List of deprecated feature gates:
-->
已棄用特性門控的列表：

<!--
{{< table caption="kubeadm deprecated feature gates" >}}
Feature | Default | Alpha | Beta | GA | Deprecated
:-------|:--------|:------|:-----|:---|:----------
`PublicKeysECDSA` | `false` | 1.19 | - | - | 1.31
`RootlessControlPlane` | `false` | 1.22 | - | - | 1.31
{{< /table >}}
-->
{{< table caption="kubeadm 棄用的特性門控" >}}
特性 | 默認值 | Alpha | Beta | GA |  棄用
:-------|:--------|:------|:-----|:---|:----------
`PublicKeysECDSA` | `false` | 1.19 | - | - | 1.31
`RootlessControlPlane` | `false` | 1.22 | - | - | 1.31
{{< /table >}}

<!--
Feature gate descriptions:
-->
特性門控描述：

<!--
`PublicKeysECDSA`
: Can be used to create a cluster that uses ECDSA certificates instead of the default RSA algorithm.
  Renewal of existing ECDSA certificates is also supported using `kubeadm certs renew`, but you cannot
  switch between the RSA and ECDSA algorithms on the fly or during upgrades. Kubernetes versions before v1.31
  had a bug where keys in generated kubeconfig files were set use RSA, even when you had enabled the
  `PublicKeysECDSA` feature gate. This feature gate is deprecated in favor of the `encryptionAlgorithm`
  functionality available in kubeadm v1beta4.
-->
`PublicKeysECDSA`
: 可用於創建一個使用 ECDSA 證書而非默認 RSA 算法的叢集。
  支持用 `kubeadm certs renew` 更新現有 ECDSA 證書，
  但你不能在叢集運行期間或升級期間切換 RSA 和 ECDSA 算法。
  在 v1.31 之前的 Kubernetes 版本中有一個 Bug，即使你啓用了 `PublicKeysECDSA` 特性門控，
  所生成的 kubeconfig 文件中的密鑰仍然使用 RSA 設置。
  此特性門控現已棄用，替換爲 kubeadm v1beta4 中可用的 `encryptionAlgorithm` 功能。

<!--
`RootlessControlPlane`
: Setting this flag configures the kubeadm deployed control plane component static Pod containers
  for `kube-apiserver`, `kube-controller-manager`, `kube-scheduler` and `etcd` to run as non-root users.
  If the flag is not set, those components run as root. You can change the value of this feature gate before
  you upgrade to a newer version of Kubernetes.
-->
`RootlessControlPlane`
: 設置此標誌來設定 kubeadm 所部署的控制平面組件中的靜態 Pod 容器
  `kube-apiserver`、`kube-controller-manager`、`kube-scheduler` 和 `etcd`
  以非 root 使用者身份運行。如果未設置該標誌，則這些組件以 root 身份運行。
  你可以在升級到更新版本的 Kubernetes 之前更改此特性門控的值。

<!--
List of removed feature gates:
-->
已移除的特性門控列表：

<!--
{{< table caption="kubeadm removed feature gates" >}}
Feature | Alpha | Beta | GA | Removed
:-------|:------|:-----|:---|:-------
`EtcdLearnerMode` | 1.27 | 1.29 | 1.32 | 1.33
`IPv6DualStack` | 1.16 | 1.21 | 1.23 | 1.24
`UnversionedKubeletConfigMap` | 1.22 | 1.23 | 1.25 | 1.26
`UpgradeAddonsBeforeControlPlane` | 1.28 | - | - | 1.31
{{< /table >}}
-->
{{< table caption="kubeadm 已移除的特性門控" >}}
特性 | Alpha | Beta | GA | 移除
:-------|:------|:-----|:---|:-------
`EtcdLearnerMode` | 1.27 | 1.29 | 1.32 | 1.33
`IPv6DualStack` | 1.16 | 1.21 | 1.23 | 1.24
`UnversionedKubeletConfigMap` | 1.22 | 1.23 | 1.25 | 1.26
`UpgradeAddonsBeforeControlPlane` | 1.28 | - | - | 1.31
{{< /table >}}

<!--
Feature gate descriptions:
-->
特性門控的描述：

<!--
`EtcdLearnerMode`
: When joining a new control plane node, a new etcd member will be created
as a learner and promoted to a voting member only after the etcd data are fully aligned.
-->
`EtcdLearnerMode`
: 當加入一個新的控制平面節點時，會創建一個新的 etcd 成員作爲 learner，
  並且僅在 etcd 數據完全對齊後，纔會將其提升爲投票成員。

<!--
`IPv6DualStack`
: This flag helps to configure components dual stack when the feature is in progress. For more details on Kubernetes
  dual-stack support see [Dual-stack support with kubeadm](/docs/setup/production-environment/tools/kubeadm/dual-stack-support/).
-->
`IPv6DualStack`
: 在 IP 雙棧特性處於開發過程中時，此標誌有助於設定組件的雙棧支持。有關 Kubernetes
  雙棧支持的更多詳細信息，請參閱 [kubeadm 的雙棧支持](/zh-cn/docs/setup/production-environment/tools/kubeadm/dual-stack-support/)。

<!--
`UnversionedKubeletConfigMap`
: This flag controls the name of the {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} where kubeadm stores
  kubelet configuration data. With this flag not specified or set to `true`, the ConfigMap is named `kubelet-config`.
  If you set this flag to `false`, the name of the ConfigMap includes the major and minor version for Kubernetes
  (for example: `kubelet-config-{{< skew currentVersion >}}`). Kubeadm ensures that RBAC rules for reading and writing
  that ConfigMap are appropriate for the value you set. When kubeadm writes this ConfigMap (during `kubeadm init`
  or `kubeadm upgrade apply`), kubeadm respects the value of `UnversionedKubeletConfigMap`. When reading that ConfigMap
  (during `kubeadm join`, `kubeadm reset`, `kubeadm upgrade`...), kubeadm attempts to use unversioned ConfigMap name first.
  If that does not succeed, kubeadm falls back to using the legacy (versioned) name for that ConfigMap.
-->
`UnversionedKubeletConfigMap`
: 此標誌控制 kubeadm 存儲 kubelet 設定數據的 {{<glossary_tooltip text="ConfigMap" term_id="configmap" >}} 的名稱。
  在未指定此標誌或設置爲 `true` 的情況下，此 ConfigMap 被命名爲 `kubelet-config`。
  如果將此標誌設置爲 `false`，則此 ConfigMap 的名稱會包括 Kubernetes 的主要版本和次要版本
  （例如：`kubelet-config-{{< skew currentVersion >}}`）。
  kubeadm 會確保用於讀寫 ConfigMap 的 RBAC 規則適合你設置的值。
  當 kubeadm 寫入此 ConfigMap 時（在 `kubeadm init` 或 `kubeadm upgrade apply` 期間），
  kubeadm 根據 `UnversionedKubeletConfigMap` 的設置值來執行操作。
  當讀取此 ConfigMap 時（在執行 `kubeadm join`、`kubeadm reset`、`kubeadm upgrade` 等操作期間），
  kubeadm 嘗試首先使用無版本（後綴）的 ConfigMap 名稱；
  如果不成功，kubeadm 將回退到使用該 ConfigMap 的舊（帶版本號的）名稱。

<!--
`UpgradeAddonsBeforeControlPlane`
: This feature gate has been removed. It was introduced in v1.28 as a deprecated feature and then removed in v1.31.
  For documentation on older versions, please switch to the corresponding website version.
-->
`UpgradeAddonsBeforeControlPlane`
: 此特性門控已被移除。它在 v1.28 中作爲一個已棄用的特性被引入，在 v1.31 中被移除。
  有關舊版本的文檔，請切換到相應的網站版本。

<!--
### Adding kube-proxy parameters {#kube-proxy}

For information about kube-proxy parameters in the kubeadm configuration see:

- [kube-proxy reference](/docs/reference/config-api/kube-proxy-config.v1alpha1/)

For information about enabling IPVS mode with kubeadm see:

- [IPVS](https://github.com/kubernetes/kubernetes/blob/master/pkg/proxy/ipvs/README.md)
-->
### 添加 kube-proxy 參數 {#kube-proxy}

kubeadm 設定中有關 kube-proxy 的說明請查看：

- [kube-proxy 參考](/zh-cn/docs/reference/config-api/kube-proxy-config.v1alpha1/)

使用 kubeadm 啓用 IPVS 模式的說明請查看：

- [IPVS](https://github.com/kubernetes/kubernetes/blob/master/pkg/proxy/ipvs/README.md)

<!--
### Passing custom flags to control plane components {#control-plane-flags}

For information about passing flags to control plane components see:

- [control-plane-flags](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/)
-->
### 向控制平面組件傳遞自定義的命令列參數 {#control-plane-flags}

有關向控制平面組件傳遞命令列參數的說明請查看：

- [控制平面命令列參數](/zh-cn/docs/setup/production-environment/tools/kubeadm/control-plane-flags/)

<!--
### Running kubeadm without an Internet connection {#without-internet-connection}

For running kubeadm without an Internet connection you have to pre-pull the required control plane images.

You can list and pull the images using the `kubeadm config images` sub-command:
-->
### 在沒有互聯網連接的情況下運行 kubeadm {#without-internet-connection}

要在沒有互聯網連接的情況下運行 kubeadm，你必須提前拉取所需的控制平面映像檔。

你可以使用 `kubeadm config images` 子命令列出並拉取映像檔：

```shell
kubeadm config images list
kubeadm config images pull
```

<!--
You can pass `--config` to the above commands with a [kubeadm configuration file](#config-file)
to control the `kubernetesVersion` and `imageRepository` fields.
-->
你可以通過 `--config` 把 [kubeadm 設定文件](#config-file) 傳遞給上述命令來控制
`kubernetesVersion` 和 `imageRepository` 字段。

<!--
All default `registry.k8s.io` images that kubeadm requires support multiple architectures.
-->
kubeadm 需要的所有默認 `registry.k8s.io` 映像檔都支持多種硬件體系結構。

<!--
### Using custom images {#custom-images}

By default, kubeadm pulls images from `registry.k8s.io`. If the
requested Kubernetes version is a CI label (such as `ci/latest`)
`gcr.io/k8s-staging-ci-images` is used.
-->
### 使用自定義的映像檔 {#custom-images}

默認情況下，kubeadm 會從 `registry.k8s.io` 倉庫拉取映像檔。如果請求的 Kubernetes 版本是 CI 標籤
（例如 `ci/latest`），則使用 `gcr.io/k8s-staging-ci-images`。

<!--
You can override this behavior by using [kubeadm with a configuration file](#config-file).
Allowed customization are:

* To provide `kubernetesVersion` which affects the version of the images.
* To provide an alternative `imageRepository` to be used instead of
  `registry.k8s.io`.
* To provide a specific `imageRepository` and `imageTag` for etcd or CoreDNS.
-->
你可以通過使用[帶有設定文件的 kubeadm](#config-file) 來重寫此操作。
允許的自定義功能有：

* 提供影響映像檔版本的 `kubernetesVersion`。
* 使用其他的 `imageRepository` 來代替 `registry.k8s.io`。
* 爲 etcd 或 CoreDNS 提供特定的 `imageRepository` 和 `imageTag`。

<!--
Image paths between the default `registry.k8s.io` and a custom repository specified using
`imageRepository` may differ for backwards compatibility reasons. For example,
one image might have a subpath at `registry.k8s.io/subpath/image`, but be defaulted
to `my.customrepository.io/image` when using a custom repository.
-->
由於向後兼容的原因，使用 `imageRepository` 所指定的定製映像檔庫可能與默認的
`registry.k8s.io` 映像檔路徑不同。例如，某映像檔的子路徑可能是 `registry.k8s.io/subpath/image`，
但使用自定義倉庫時默認爲 `my.customrepository.io/image`。

<!--
To ensure you push the images to your custom repository in paths that kubeadm
can consume, you must:
-->
確保將映像檔推送到 kubeadm 可以使用的自定義倉庫的路徑中，你必須：

<!--
* Pull images from the defaults paths at `registry.k8s.io` using `kubeadm config images {list|pull}`.
* Push images to the paths from `kubeadm config images list --config=config.yaml`,
where `config.yaml` contains the custom `imageRepository`, and/or `imageTag` for etcd and CoreDNS.
* Pass the same `config.yaml` to `kubeadm init`.
-->
* 使用 `kubeadm config images {list|pull}` 從 `registry.k8s.io` 的默認路徑中拉取映像檔。
* 將映像檔推送到 `kubeadm config images list --config=config.yaml` 的路徑，
  其中 `config.yaml` 包含自定義的 `imageRepository` 和/或用於 etcd 和 CoreDNS 的 `imageTag`。
* 將相同的 `config.yaml` 傳遞給 `kubeadm init`。

<!--
#### Custom sandbox (pause) images {#custom-pause-image}

To set a custom image for these you need to configure this in your
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}} to use the image.
Consult the documentation for your container runtime to find out how to change this setting;
for selected container runtimes, you can also find advice within the
[Container Runtimes](/docs/setup/production-environment/container-runtimes/) topic.
-->
#### 定製沙箱（pause）映像檔  {#custom-pause-image}

如果需要爲這些組件設置定製的映像檔，
你需要在你的{{< glossary_tooltip text="容器運行時" term_id="container-runtime" >}}中完成一些設定。
參閱你的容器運行時的文檔以瞭解如何改變此設置。
對於某些容器運行時而言，
你可以在[容器運行時](/zh-cn/docs/setup/production-environment/container-runtimes/)主題下找到一些建議。

<!--
### Uploading control plane certificates to the cluster

By adding the flag `--upload-certs` to `kubeadm init` you can temporary upload
the control plane certificates to a Secret in the cluster. Please note that this Secret
will expire automatically after 2 hours. The certificates are encrypted using
a 32byte key that can be specified using `--certificate-key`. The same key can be used
to download the certificates when additional control plane nodes are joining, by passing
`--control-plane` and `--certificate-key` to `kubeadm join`.
-->
### 將控制平面證書上傳到叢集  {#uploading-control-plane-certificates-to-the-cluster}

通過將參數 `--upload-certs` 添加到 `kubeadm init`，你可以將控制平面證書臨時上傳到叢集中的 Secret。
請注意，此 Secret 將在 2 小時後自動過期。這些證書使用 32 字節密鑰加密，可以使用 `--certificate-key` 指定該密鑰。
通過將 `--control-plane` 和 `--certificate-key` 傳遞給 `kubeadm join`，
可以在添加其他控制平面節點時使用相同的密鑰下載證書。

<!--
The following phase command can be used to re-upload the certificates after expiration:
-->
以下階段命令可用於證書到期後重新上傳證書：

```shell
kubeadm init phase upload-certs --upload-certs --config=SOME_YAML_FILE
```

{{< note >}}
<!--
A predefined `certificateKey` can be provided in `InitConfiguration` when passing the
[configuration file](/docs/reference/config-api/kubeadm-config.v1beta4/) with `--config`.
-->
在使用 `--config`
傳遞[設定文件](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4/)時，
可以在 `InitConfiguration` 中提供預定義的 `certificateKey`。
{{< /note >}}

<!--
If a predefined certificate key is not passed to `kubeadm init` and
`kubeadm init phase upload-certs` a new key will be generated automatically.

The following command can be used to generate a new key on demand:
-->
如果未將預定義的證書密鑰傳遞給 `kubeadm init` 和 `kubeadm init phase upload-certs`，
則會自動生成一個新密鑰。

以下命令可用於按需生成新密鑰：

```shell
kubeadm certs certificate-key
```

<!--
### Certificate management with kubeadm

For detailed information on certificate management with kubeadm see
[Certificate Management with kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/).
The document includes information about using external CA, custom certificates
and certificate renewal.
-->
### 使用 kubeadm 管理證書  {#certificate-management-with-kubeadm}

有關使用 kubeadm 進行證書管理的詳細信息，
請參閱[使用 kubeadm 進行證書管理](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/)。
該文檔包括有關使用外部 CA、自定義證書和證書續訂的信息。

<!--
### Managing the kubeadm drop-in file for the kubelet {#kubelet-drop-in}

The `kubeadm` package ships with a configuration file for running the `kubelet` by `systemd`.
Note that the kubeadm CLI never touches this drop-in file. This drop-in file is part of the kubeadm
DEB/RPM package.
-->
### 管理 kubeadm 爲 kubelet 提供的 systemd 設定文件 {#kubelet-drop-in}

`kubeadm` 包自帶了關於 `systemd` 如何運行 `kubelet` 的設定文件。
請注意 `kubeadm` 客戶端命令列工具永遠不會修改這份 `systemd` 設定文件。
這份 `systemd` 設定文件屬於 kubeadm DEB/RPM 包。

<!--
For further information, see [Managing the kubeadm drop-in file for systemd](/docs/setup/production-environment/tools/kubeadm/kubelet-integration/#the-kubelet-drop-in-file-for-systemd).
-->
有關更多信息，請閱讀[管理 systemd 的 kubeadm 內嵌文件](/zh-cn/docs/setup/production-environment/tools/kubeadm/kubelet-integration/#the-kubelet-drop-in-file-for-systemd)。

<!--
### Use kubeadm with CRI runtimes

By default, kubeadm attempts to detect your container runtime. For more details on this detection,
see the [kubeadm CRI installation guide](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-runtime).
-->
### 結合 CRI 運行時使用 kubeadm   {#use-kubeadm-with-cri-runtimes}

默認情況下，kubeadm 嘗試檢測你的容器運行環境。有關此檢測的更多詳細信息，請參見
[kubeadm CRI 安裝指南](/zh-cn/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-runtime)。

<!--
### Setting the node name

By default, kubeadm assigns a node name based on a machine's host address.
You can override this setting with the `--node-name` flag.
The flag passes the appropriate [`--hostname-override`](/docs/reference/command-line-tools-reference/kubelet/#options)
value to the kubelet.
-->
### 設置節點的名稱  {#setting-the-node-name}

默認情況下，kubeadm 基於機器的主機地址分配一個節點名稱。你可以使用 `--node-name` 參數覆蓋此設置。
此標識將合適的 [`--hostname-override`](/zh-cn/docs/reference/command-line-tools-reference/kubelet/#options)
值傳遞給 kubelet。

<!--
Be aware that overriding the hostname can
[interfere with cloud providers](https://github.com/kubernetes/website/pull/8873).
-->
要注意，重載主機名可能會[與雲驅動發生衝突](https://github.com/kubernetes/website/pull/8873)。

<!--
### Automating kubeadm

Rather than copying the token you obtained from `kubeadm init` to each node, as
in the [basic kubeadm tutorial](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/),
you can parallelize the token distribution for easier automation. To implement this automation,
you must know the IP address that the control plane node will have after it is started, or use a
DNS name or an address of a load balancer.
-->
### kubeadm 自動化   {#automating-kubeadm}

除了像文檔
[kubeadm 基礎教程](/zh-cn/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)中所描述的那樣，
將從 `kubeadm init` 取得的令牌複製到每個節點，你還可以並行地分發令牌以實現更簡單的自動化。
要實現自動化，你必須知道控制平面節點啓動後將擁有的 IP 地址，或使用 DNS 名稱或負載均衡器的地址。

<!--
1. Generate a token. This token must have the form `<6 character string>.<16 character string>`.
   More formally, it must match the regex: `[a-z0-9]{6}\.[a-z0-9]{16}`.

   kubeadm can generate a token for you:
-->
1. 生成一個令牌。這個令牌必須採用的格式爲：`<6 個字符的字符串>.<16 個字符的字符串>`。
   更加正式的說法是，它必須符合正則表達式：`[a-z0-9]{6}\.[a-z0-9]{16}`。

   kubeadm 可以爲你生成一個令牌：

   ```shell
   kubeadm token generate
   ```

<!--
1. Start both the control plane node and the worker nodes concurrently with this token.
   As they come up they should find each other and form the cluster. The same
   `--token` argument can be used on both `kubeadm init` and `kubeadm join`.
-->
2. 使用這個令牌同時啓動控制平面節點和工作節點。這些節點一旦運行起來應該就會互相尋找對方並且形成叢集。
   同樣的 `--token` 參數可以同時用於 `kubeadm init` 和 `kubeadm join` 命令。

<!--
1. Similar can be done for `--certificate-key` when joining additional control plane
   nodes. The key can be generated using:
-->
3. 當接入其他控制平面節點時，可以對 `--certificate-key` 執行類似的操作。可以使用以下方式生成密鑰：

   ```shell
   kubeadm certs certificate-key
   ```

<!--
Once the cluster is up, you can use the `/etc/kubernetes/admin.conf` file from
a control plane node to talk to the cluster with administrator credentials or
[Generating kubeconfig files for additional users](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#kubeconfig-additional-users).
-->
一旦叢集啓動起來，你就可以從控制平面節點的 `/etc/kubernetes/admin.conf` 文件獲取管理憑證，
並使用這個憑證同叢集通信。

一旦叢集啓動起來，你就可以從控制平面節點中的 `/etc/kubernetes/admin.conf`
文件獲取管理憑證或通過[爲其他使用者生成的 kubeconfig 文件](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#kubeconfig-additional-users)與叢集通信。

<!--
Note that this style of bootstrap has some relaxed security guarantees because
it does not allow the root CA hash to be validated with
`--discovery-token-ca-cert-hash` (since it's not generated when the nodes are provisioned).
For details, see the [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/).
-->
注意這種搭建叢集的方式在安全保證上會有一些寬鬆，因爲這種方式不允許使用
`--discovery-token-ca-cert-hash` 來驗證根 CA 的哈希值
（因爲當設定節點的時候，它還沒有被生成）。
更多信息請參閱 [kubeadm join](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-join/) 文檔。

## {{% heading "whatsnext" %}}

<!--
* [kubeadm init phase](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/) to understand more about
  `kubeadm init` phases
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) to bootstrap a Kubernetes
  worker node and join it to the cluster
* [kubeadm upgrade](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade/) to upgrade a Kubernetes
  cluster to a newer version
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) to revert any changes made
  to this host by `kubeadm init` or `kubeadm join`
-->
* 進一步閱讀了解 [kubeadm init 階段](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/)
* [kubeadm join](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-join/)
  啓動一個 Kubernetes 工作節點並且將其加入到叢集
* [kubeadm upgrade](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-upgrade/)
  將 Kubernetes 叢集升級到新版本
* [kubeadm reset](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-reset/)
  恢復 `kubeadm init` 或 `kubeadm join` 命令對節點所作的變更
