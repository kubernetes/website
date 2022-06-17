---
title: kubeadm init
content_type: concept
weight: 20
---

<!--
reviewers:
- luxas
- jbeda
title: kubeadm init
content_type: concept
weight: 20
-->
<!-- overview -->

<!--
This command initializes a Kubernetes control-plane node.
-->
此命令初始化一個 Kubernetes 控制平面節點。

<!-- body -->

{{< include "generated/kubeadm_init.md" >}}

<!--
### Init workflow {#init-workflow}
-->
### Init 命令的工作流程 {#init-workflow}

<!--
`kubeadm init` bootstraps a Kubernetes control-plane node by executing the
following steps:
-->
`kubeadm init` 命令透過執行下列步驟來啟動一個 Kubernetes 控制平面節點。

<!--
1. Runs a series of pre-flight checks to validate the system state
   before making changes. Some checks only trigger warnings, others are
   considered errors and will exit kubeadm until the problem is corrected or the
   user specifies `--ignore-preflight-errors=<list-of-errors>`.
-->
1. 在做出變更前執行一系列的預檢項來驗證系統狀態。一些檢查專案僅僅觸發警告，
   其它的則會被視為錯誤並且退出 kubeadm，除非問題得到解決或者使用者指定了
   `--ignore-preflight-errors=<錯誤列表>` 引數。

<!--
1. Generates a self-signed CA to set up identities for each component in the cluster. The user can provide their
   own CA cert and/or key by dropping it in the cert directory configured via `--cert-dir`
   (`/etc/kubernetes/pki` by default).
   The APIServer certs will have additional SAN entries for any `--apiserver-cert-extra-sans` arguments, lowercased if necessary.
-->
2. 生成一個自簽名的 CA 證書來為叢集中的每一個元件建立身份標識。
   使用者可以透過將其放入 `--cert-dir` 配置的證書目錄中（預設為 `/etc/kubernetes/pki`）
   來提供他們自己的 CA 證書以及/或者金鑰。
   APIServer 證書將為任何 `--apiserver-cert-extra-sans` 引數值提供附加的 SAN 條目，必要時將其小寫。

<!--
1. Writes kubeconfig files in `/etc/kubernetes/`  for
   the kubelet, the controller-manager and the scheduler to use to connect to the
   API server, each with its own identity, as well as an additional
   kubeconfig file for administration named `admin.conf`.
-->
3. 將 kubeconfig 檔案寫入 `/etc/kubernetes/` 目錄以便 kubelet、控制器管理器和排程器用來連線到
   API 伺服器，它們每一個都有自己的身份標識，同時生成一個名為 `admin.conf` 的獨立的 kubeconfig
   檔案，用於管理操作。

<!--
1. Generates static Pod manifests for the API server,
   controller-manager and scheduler. In case an external etcd is not provided,
   an additional static Pod manifest is generated for etcd.

   Static Pod manifests are written to `/etc/kubernetes/manifests`; the kubelet
   watches this directory for Pods to create on startup.

   Once control plane Pods are up and running, the `kubeadm init` sequence can continue.
-->
4. 為 API 伺服器、控制器管理器和排程器生成靜態 Pod 的清單檔案。假使沒有提供一個外部的 etcd
   服務的話，也會為 etcd 生成一份額外的靜態 Pod 清單檔案。

   靜態 Pod 的清單檔案被寫入到 `/etc/kubernetes/manifests` 目錄; 
   kubelet 會監視這個目錄以便在系統啟動的時候建立 Pod。

   一旦控制平面的 Pod 都執行起來， `kubeadm init` 的工作流程就繼續往下執行。

<!--
1. Apply labels and taints to the control-plane node so that no additional workloads will
   run there.
-->
5. 對控制平面節點應用標籤和汙點標記以便不會在它上面執行其它的工作負載。

<!--
1. Generates the token that additional nodes can use to register
   themselves with a control-plane in the future. Optionally, the user can provide a
   token via `--token`, as described in the
   [kubeadm token](/docs/reference/setup-tools/kubeadm/kubeadm-token/) docs.
-->
6. 生成令牌，將來其他節點可使用該令牌向控制平面註冊自己。
   如 [kubeadm token](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-token/) 文件所述，
   使用者可以選擇透過 `--token` 提供令牌。

<!--
1. Makes all the necessary configurations for allowing node joining with the
   [Bootstrap Tokens](/docs/reference/access-authn-authz/bootstrap-tokens/) and
   [TLS Bootstrap](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)
   mechanism:

   - Write a ConfigMap for making available all the information required
     for joining, and set up related RBAC access rules.

   - Let Bootstrap Tokens access the CSR signing API.

   - Configure auto-approval for new CSR requests.

   See [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) for additional info.
-->
7. 為了使得節點能夠遵照[啟動引導令牌](/zh-cn/docs/reference/access-authn-authz/bootstrap-tokens/)
   和 [TLS 啟動引導](/zh-cn/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)
   這兩份文件中描述的機制加入到叢集中，kubeadm 會執行所有的必要配置：

   - 建立一個 ConfigMap 提供新增叢集節點所需的資訊，併為該 ConfigMap 設定相關的 RBAC 訪問規則。

   - 允許啟動引導令牌訪問 CSR 簽名 API。

   - 配置自動簽發新的 CSR 請求。

   更多相關資訊，請檢視 [kubeadm join](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-join/)。
   
<!-- 
1. Installs a DNS server (CoreDNS) and the kube-proxy addon components via the API server.
   In Kubernetes version 1.11 and later CoreDNS is the default DNS server.
   Please note that although the DNS server is deployed, it will not be scheduled until CNI is installed.

   {{< warning >}}
   kube-dns usage with kubeadm is deprecated as of v1.18 and is removed in v1.21.
   {{< /warning >}}
-->
8. 透過 API 伺服器安裝一個 DNS 伺服器 (CoreDNS) 和 kube-proxy 附加元件。
   在 Kubernetes 版本 1.11 和更高版本中，CoreDNS 是預設的 DNS 伺服器。
   請注意，儘管已部署 DNS 伺服器，但直到安裝 CNI 時才排程它。

   {{< warning >}}
   從 v1.18 開始，在 kubeadm 中使用 kube-dns 的支援已被廢棄，並已在 v1.21 版本中刪除。
   {{< /warning >}}

<!--
### Using init phases with kubeadm {#init-phases}

Kubeadm allows you to create a control-plane node in phases using the `kubeadm init phase` command.
-->
### 在 kubeadm 中使用 init phases {#init-phases}

Kubeadm 允許你使用 `kubeadm init phase` 命令分階段建立控制平面節點。

<!--
To view the ordered list of phases and sub-phases you can call `kubeadm init -help`. The list will be located at the top of the help screen and each phase will have a description next to it.
Note that by calling `kubeadm init` all of the phases and sub-phases will be executed in this exact order.
-->
要檢視階段和子階段的有序列表，可以呼叫 `kubeadm init --help`。
該列表將位於幫助螢幕的頂部，每個階段旁邊都有一個描述。
注意，透過呼叫 `kubeadm init`，所有階段和子階段都將按照此確切順序執行。

<!--
Some phases have unique flags, so if you want to have a look at the list of available options add `-help`, for example:
-->
某些階段具有唯一的標誌，因此，如果要檢視可用選項的列表，請新增 `--help`，例如：

```shell
sudo kubeadm init phase control-plane controller-manager --help
```

<!--
You can also use `-help` to see the list of sub-phases for a certain parent phase:
-->
你也可以使用 `--help` 檢視特定父階段的子階段列表：

```shell
sudo kubeadm init phase control-plane --help
```

<!--
`kubeadm init` also exposes a flag called `-skip-phases` that can be used to skip certain phases. The flag accepts a list of phase names and the names can be taken from the above ordered list.
-->
`kubeadm init` 還公開了一個名為 `--skip-phases` 的引數，該引數可用於跳過某些階段。
引數接受階段名稱列表，並且這些名稱可以從上面的有序列表中獲取。

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
# 你現在可以修改控制平面和 etcd 清單檔案
sudo kubeadm init --skip-phases=control-plane,etcd --config=configfile.yaml
```

<!--
What this example would do is write the manifest files for the control plane and etcd in `/etc/kubernetes/manifests` based on the configuration in `configfile.yaml`. This allows you to modify the files and then skip these phases using `-skip-phases`. By calling the last command you will create a control plane node with the custom manifest files.
-->
該示例將執行的操作是基於 `configfile.yaml` 中的配置在 `/etc/kubernetes/manifests` 
中寫入控制平面和 etcd 的清單檔案。
這允許你修改檔案，然後使用 `--skip-phases` 跳過這些階段。
透過呼叫最後一個命令，你將使用自定義清單檔案建立一個控制平面節點。

{{< feature-state for_k8s_version="v1.22" state="beta" >}}

<!-- 
Alternatively, you can use the `skipPhases` field under `InitConfiguration`. 
-->
或者，你可以使用 `InitConfiguration` 下的 `skipPhases` 欄位。

<!--
### Using kubeadm init with a configuration file {#config-file}
-->
### 結合一份配置檔案來使用 kubeadm init {#config-file}

<!--
The config file is still considered beta and may change in future versions.
-->
{{< caution >}}
配置檔案的功能仍然處於 alpha 狀態並且在將來的版本中可能會改變。
{{< /caution >}}

<!--
It's possible to configure `kubeadm init` with a configuration file instead of command
line flags, and some more advanced features may only be available as
configuration file options. This file is passed using the `--config` flag and it must
contain a `ClusterConfiguration` structure and optionally more structures separated by `---\n`
Mixing `--config` with others flags may not be allowed in some cases.
-->
透過一份配置檔案而不是使用命令列引數來配置 `kubeadm init` 命令是可能的，
但是一些更加高階的功能只能夠透過配置檔案設定。
這份配置檔案透過 `--config` 選項引數指定的，
它必須包含 `ClusterConfiguration` 結構，並可能包含更多由 `---\n` 分隔的結構。
在某些情況下，可能不允許將 `--config` 與其他標誌混合使用。

<!--
The default configuration can be printed out using the
[kubeadm config print](/docs/reference/setup-tools/kubeadm/kubeadm-config/) command.

If your configuration is not using the latest version it is **recommended** that you migrate using
the [kubeadm config migrate](/docs/reference/setup-tools/kubeadm/kubeadm-config/) command.

For more information on the fields and usage of the configuration you can navigate to our
[API reference page](/docs/reference/config-api/kubeadm-config.v1beta3/).
-->
可以使用 [kubeadm config print](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-config/)
命令打印出預設配置。

如果你的配置沒有使用最新版本，
**推薦**使用 [kubeadm config migrate](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-config/)
命令進行遷移。

關於配置的欄位和用法的更多資訊，你可以訪問 [API 參考頁面](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta3/)。

<!-- 
### Using kubeadm init with feature gates {#feature-gates} 
-->
### 使用 kubeadm init 時設定特性門控 {#feature-gates} 

<!-- 
Kubeadm supports a set of feature gates that are unique to kubeadm and can only be applied
during cluster creation with `kubeadm init`. These features can control the behavior
of the cluster. Feature gates are removed after a feature graduates to GA. 
-->
Kubeadm 支援一組獨有的特性門控，只能在 `kubeadm init` 建立叢集期間使用。
這些特性可以控制叢集的行為。特性門控會在畢業到 GA 後被移除。

<!-- 
To pass a feature gate you can either use the `--feature-gates` flag for
`kubeadm init`, or you can add items into the `featureGates` field when you pass
a [configuration file](/docs/reference/config-api/kubeadm-config.v1beta3/#kubeadm-k8s-io-v1beta3-ClusterConfiguration)
using `--config`. 
-->
你可以使用 `--feature-gates` 標誌來為 `kubeadm init` 設定特性門控，
或者你可以在用 `--config` 傳遞[配置檔案](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta3/#kubeadm-k8s-io-v1beta3-ClusterConfiguration)
時新增條目到 `featureGates` 欄位中去。

<!-- 
Passing [feature gates for core Kubernetes components](/docs/reference/command-line-tools-reference/feature-gates)
directly to kubeadm is not supported. Instead, it is possible to pass them by
[Customizing components with the kubeadm API](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/). 
-->
直接傳遞 [Kubernetes 核心元件的特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates)給 kubeadm 是不支援的。
相反，可以透過[使用 kubeadm API 的自定義元件](/zh-cn/docs/setup/production-environment/tools/kubeadm/control-plane-flags/)來傳遞。

<!-- 
List of feature gates: 
-->
特性門控的列表：

{{< table caption="kubeadm feature gates" >}}
特性 | 預設值 | Alpha | Beta
:-------|:--------|:------|:-----
`PublicKeysECDSA` | `false` | 1.19 | -
`RootlessControlPlane` | `false` | 1.22 | -
`UnversionedKubeletConfigMap` | `true` | 1.22 | 1.23
{{< /table >}}

<!-- 
Once a feature gate goes GA it is removed from this list as its value becomes locked to `true` by default. 
-->
{{< note >}}
一旦特性門控變成了 GA，那它將會從這個列表中移除，因為它的值會被預設鎖定為 `true` 。
{{< /note >}}

<!-- 
Feature gate descriptions: 
-->
特性門控的描述：

<!-- 
`PublicKeysECDSA`
: Can be used to create a cluster that uses ECDSA certificates instead of the default RSA algorithm.
Renewal of existing ECDSA certificates is also supported using `kubeadm certs renew`, but you cannot
switch between the RSA and ECDSA algorithms on the fly or during upgrades. 
-->
`PublicKeysECDSA`
: 可用於建立叢集時使用 ECDSA 證書而不是預設 RSA 演算法。
支援用 `kubeadm certs renew` 更新現有 ECDSA 證書，
但你不能在叢集執行期間或升級期間切換 RSA 和 ECDSA 演算法。

<!-- 
`RootlessControlPlane`
: Setting this flag configures the kubeadm deployed control plane component static Pod containers
for `kube-apiserver`, `kube-controller-manager`, `kube-scheduler` and `etcd` to run as non-root users.
If the flag is not set, those components run as root. You can change the value of this feature gate before
you upgrade to a newer version of Kubernetes. 
-->
`RootlessControlPlane`
: 設定此標誌來配置 kubeadm 所部署的控制平面元件中的靜態 Pod 容器 
`kube-apiserver`、`kube-controller-manager`、`kube-scheduler` 和 `etcd` 以非 root 使用者身份執行。
如果未設定該標誌，則這些元件以 root 身份執行。
你可以在升級到更新版本的 Kubernetes 之前更改此特性門控的值。

<!-- 
`UnversionedKubeletConfigMap`
: This flag controls the name of the {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} where kubeadm stores
kubelet configuration data. With this flag not specified or set to `true`, the ConfigMap is named `kubelet-config`.
If you set this flag to `false`, the name of the ConfigMap includes the major and minor version for Kubernetes
(for example: `kubelet-config-{{< skew currentVersion >}}`). Kubeadm ensures that RBAC rules for reading and writing
that ConfigMap are appropriate for the value you set. When kubeadm writes this ConfigMap (during `kubeadm init`
or `kubeadm upgrade apply`), kubeadm respects the value of `UnversionedKubeletConfigMap`. When reading that ConfigMap
(during `kubeadm join`, `kubeadm reset`, `kubeadm upgrade ...`), kubeadm attempts to use unversioned ConfigMap name first;
if that does not succeed, kubeadm falls back to using the legacy (versioned) name for that ConfigMap. 
-->
`UnversionedKubeletConfigMap`
: 此標誌控制 kubeadm 儲存 kubelet 配置資料的 {{<glossary_tooltip text="ConfigMap" term_id="configmap" >}} 的名稱。
在未指定此標誌或設定為 `true` 的情況下，此 ConfigMap 被命名為 `kubelet-config`。
如果將此標誌設定為 `false`，則此 ConfigMap 的名稱會包括 Kubernetes 的主要版本和次要版本（例如：`kubelet-config-{{< skew currentVersion >}}`）。 
Kubeadm 會確保用於讀寫 ConfigMap 的 RBAC 規則適合你設定的值。
當 kubeadm 寫入此 ConfigMap 時（在 `kubeadm init` 或 `kubeadm upgrade apply` 期間），
kubeadm 根據 `UnversionedKubeletConfigMap` 的設定值來執行操作。
當讀取此 ConfigMap 時（在 `kubeadm join`、`kubeadm reset`、`kubeadm upgrade ...` 期間），
kubeadm 嘗試首先使用無版本（字尾）的 ConfigMap 名稱；
如果不成功，kubeadm 將回退到使用該 ConfigMap 的舊（帶版本號的）名稱。

<!-- 
Setting `UnversionedKubeletConfigMap` to `false` is supported but **deprecated**. 
-->
{{< note >}}
設定 `UnversionedKubeletConfigMap` 為 `false` 是被支援的特性，但該特性**已被棄用**。
{{< /note >}}




<!--
### Adding kube-proxy parameters {#kube-proxy}
-->
### 新增 kube-proxy 引數 {#kube-proxy}

<!--
For information about kube-proxy parameters in the kubeadm configuration see:
- [kube-proxy reference](/docs/reference/config-api/kube-proxy-config.v1alpha1/)

For information about enabling IPVS mode with kubeadm see:
- [IPVS](https://github.com/kubernetes/kubernetes/blob/master/pkg/proxy/ipvs/README.md)
-->
kubeadm 配置中有關 kube-proxy 的說明請檢視：

- [kube-proxy 參考](/zh-cn/docs/reference/config-api/kube-proxy-config.v1alpha1/)

使用 kubeadm 啟用 IPVS 模式的說明請檢視：

- [IPVS](https://github.com/kubernetes/kubernetes/blob/master/pkg/proxy/ipvs/README.md)

<!--
### Passing custom flags to control plane components {#control-plane-flags}
-->
### 向控制平面元件傳遞自定義的命令列引數 {#control-plane-flags}

<!--
For information about passing flags to control plane components see:
- [control-plane-flags](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/) -->
有關向控制平面元件傳遞命令列引數的說明請檢視：
[控制平面命令列引數](/zh-cn/docs/setup/production-environment/tools/kubeadm/control-plane-flags/)

<!--
### Running kubeadm without an Internet connection {#without-internet-connection}
-->
### 在沒有網際網路連線的情況下執行 kubeadm {#without-internet-connection}

<!--
For running kubeadm without an internet connection you have to pre-pull the required control-plane images.
-->
要在沒有網際網路連線的情況下執行 kubeadm，你必須提前拉取所需的控制平面鏡像。

<!--
You can list and pull the images using the `kubeadm config images` sub-command:
-->
你可以使用 `kubeadm config images` 子命令列出並拉取映象：

```shell
kubeadm config images list
kubeadm config images pull
```

<!-- 
You can pass `--config` to the above commands with a [kubeadm configuration file](#config-file)
to control the `kubernetesVersion` and `imageRepository` fields. 
-->
你可以透過 `--config` 把 [kubeadm 配置檔案](#config-file) 傳遞給上述命令來控制 `kubernetesVersion` 和 `imageRepository` 欄位。

<!-- 
All default `k8s.gcr.io` images that kubeadm requires support multiple architectures. 
-->
kubeadm 需要的所有預設 `k8s.gcr.io` 映象都支援多種硬體體系結構。

<!--
### Using custom images {#custom-images}
-->
### 使用自定義的映象 {#custom-images}

<!--
By default, kubeadm pulls images from `k8s.gcr.io`. If the
requested Kubernetes version is a CI label (such as `ci/latest`)
`gcr.io/k8s-staging-ci-images` is used.
-->
預設情況下, kubeadm 會從 `k8s.gcr.io` 倉庫拉取映象。如果請求的 Kubernetes 版本是 CI 標籤
（例如 `ci/latest`），則使用 `gcr.io/k8s-staging-ci-images`。

<!--
You can override this behavior by using [kubeadm with a configuration file](#config-file).
-->
你可以透過使用[帶有配置檔案的 kubeadm](#config-file) 來重寫此操作。

<!--
Allowed customization are:

* To provide `kubernetesVersion` which affects the version of the images.
* To provide an alternative `imageRepository` to be used instead of
  `k8s.gcr.io`.
* To provide a specific `imageRepository` and `imageTag` for etcd or CoreDNS.
-->
允許的自定義功能有：

* 提供影響映象版本的 `kubernetesVersion`。 
* 使用其他的 `imageRepository` 來代替 `k8s.gcr.io`。
* 為 etcd 或 CoreDNS 提供特定的 `imageRepository` 和 `imageTag`。

<!-- 
`imageRepository` may differ for backwards compatibility reasons. For example,
one image might have a subpath at `k8s.gcr.io/subpath/image`, but be defaulted
to `my.customrepository.io/image` when using a custom repository. 
-->
由於向後相容的原因，`imageRepository` 可能會有所不同。
例如，某映象的子路徑可能是 `k8s.gcr.io/subpath/image`，
但使用自定義倉庫時預設為 `my.customrepository.io/image`。

<!-- 
To ensure you push the images to your custom repository in paths that kubeadm
can consume, you must:
-->
確保將映象推送到 kubeadm 可以使用的自定義倉庫的路徑中，你必須：

<!-- 
* Pull images from the defaults paths at `k8s.gcr.io` using `kubeadm config images {list|pull}`.
* Push images to the paths from `kubeadm config images list --config=config.yaml`,
where `config.yaml` contains the custom `imageRepository`, and/or `imageTag`
for etcd and CoreDNS.
* Pass the same `config.yaml` to `kubeadm init`. 
-->
* 使用 `kubeadm config images {list|pull}` 從 `k8s.gcr.io` 的預設路徑中拉取映象。
* 將映象推送到 `kubeadm config images list --config=config.yaml` 的路徑，
其中 `config.yaml` 包含自定義的 `imageRepository` 和/或用於 etcd 和 CoreDNS 的 `imageTag`。 
* 將相同的 `config.yaml` 傳遞給 `kubeadm init`。


<!--
### Uploading control-plane certificates to the cluster
-->
### 將控制平面證書上傳到叢集

<!--
By adding the flag `-upload-certs` to `kubeadm init` you can temporary upload
the control-plane certificates to a Secret in the cluster. Please note that this Secret
will expire automatically after 2 hours. The certificates are encrypted using
a 32byte key that can be specified using `-certificate-key`. The same key can be used
to download the certificates when additional control-plane nodes are joining, by passing
`-control-plane` and `-certificate-key` to `kubeadm join`.
-->
透過將引數 `--upload-certs` 新增到 `kubeadm init`，你可以將控制平面證書臨時上傳到叢集中的 Secret。
請注意，此 Secret 將在 2 小時後自動過期。證書使用 32 位元組金鑰加密，可以使用 `--certificate-key` 指定。
透過將 `--control-plane` 和 `--certificate-key` 傳遞給 `kubeadm join`，
可以在新增其他控制平面節點時使用相同的金鑰下載證書。

<!--
The following phase command can be used to re-upload the certificates after expiration:
-->
以下階段命令可用於證書到期後重新上傳證書：

```shell
kubeadm init phase upload-certs --upload-certs --certificate-key=SOME_VALUE --config=SOME_YAML_FILE
```

<!--
If the flag `-certificate-key` is not passed to `kubeadm init` and
`kubeadm init phase upload-certs` a new key will be generated automatically.
-->
如果未將引數 `--certificate-key` 傳遞給 `kubeadm init` 和 `kubeadm init phase upload-certs`，
則會自動生成一個新金鑰。

<!--
The following command can be used to generate a new key on demand:
-->
以下命令可用於按需生成新金鑰：

```shell
kubeadm certs certificate-key
```

<!-- ### Certificate management with kubeadm -->
### 使用 kubeadm 管理證書

<!--  
For detailed information on certificate management with kubeadm see
[Certificate Management with kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/).
The document includes information about using external CA, custom certificates
and certificate renewal.
-->
有關使用 kubeadm 進行證書管理的詳細資訊，請參閱
[使用 kubeadm 進行證書管理](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/)。
該文件包括有關使用外部 CA，自定義證書和證書更新的資訊。

<!--
### Managing the kubeadm drop-in file for the kubelet {#kubelet-drop-in}
-->
### 管理 kubeadm 為 kubelet 提供的 systemd 配置檔案 {#kubelet-drop-in}

<!--
The `kubeadm` package ships with a configuration file for running the `kubelet` by `systemd`. Note that the kubeadm CLI never touches this drop-in file. This drop-in file is part of the kubeadm DEB/RPM package.
-->
`kubeadm` 包自帶了關於 `systemd` 如何執行 `kubelet` 的配置檔案。
請注意 `kubeadm` 客戶端命令列工具永遠不會修改這份 `systemd` 配置檔案。
這份 `systemd` 配置檔案屬於 kubeadm DEB/RPM 包。

<!--
For further information, see [Managing the kubeadm drop-in file for systemd](/docs/setup/production-environment/tools/kubeadm/kubelet-integration/#the-kubelet-drop-in-file-for-systemd).
-->
有關更多資訊，請閱讀
[管理 systemd 的 kubeadm 內嵌檔案](/zh-cn/docs/setup/production-environment/tools/kubeadm/kubelet-integration/#the-kubelet-drop-in-file-for-systemd)。

<!--
### Use kubeadm with CRI runtimes
-->
### 結合 CRI 執行時使用 kubeadm

<!--
By default kubeadm attempts to detect your container runtime. For more details on this detection, see
the [kubeadm CRI installation guide](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-runtime).
-->
預設情況下，kubeadm 嘗試檢測你的容器執行環境。有關此檢測的更多詳細資訊，請參見
[kubeadm CRI 安裝指南](/zh-cn/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-runtime)。

<!--
### Setting the node name
-->
### 設定節點的名稱

<!--
By default, `kubeadm` assigns a node name based on a machine's host address. You can override this setting with the `-node-name` flag.
The flag passes the appropriate [`-hostname-override`](/docs/reference/command-line-tools-reference/kubelet/#options)
value to the kubelet.
-->
預設情況下, `kubeadm` 基於機器的主機地址分配一個節點名稱。你可以使用 `--node-name` 引數覆蓋此設定。
此標識將合適的
[`--hostname-override`](/zh-cn/docs/reference/command-line-tools-reference/kubelet/#options)
值傳遞給 kubelet。

<!--
### Automating kubeadm
-->
### kubeadm 自動化

<!--
Rather than copying the token you obtained from `kubeadm init` to each node, as
in the [basic kubeadm tutorial](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/), you can parallelize the
token distribution for easier automation. To implement this automation, you must
know the IP address that the control-plane node will have after it is started,
or use a DNS name or an address of a load balancer.
-->
除了像文件 [kubeadm 基礎教程](/zh-cn/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)
中所描述的那樣，將從 `kubeadm init` 取得的令牌複製到每個節點，
你還可以並行地分發令牌以實現簡單自動化。
要實現自動化，你必須知道控制平面節點啟動後將擁有的 IP 地址，或使用 DNS 名稱或負載均衡器的地址。

<!--
1.  Generate a token. This token must have the form  `<6 character string>.<16
character string>`. More formally, it must match the regex: `[a-z0-9]{6}\.[a-z0-9]{16}`.
kubeadm can generate a token for you:
-->
1. 生成一個令牌。這個令牌必須具有以下格式：`< 6 個字元的字串>.< 16 個字元的字串>`。
   更加正式的說法是，它必須符合以下正則表示式：`[a-z0-9]{6}\.[a-z0-9]{16}`。
   
   kubeadm 可以為你生成一個令牌：

   ```shell
   kubeadm token generate
   ```

<!--
2.  Start both the control-plane node and the worker nodes concurrently with this token.
As they come up they should find each other and form the cluster. The same `-token` argument can be used on both `kubeadm init` and `kubeadm join`. 
-->
2. 使用這個令牌同時啟動控制平面節點和工作節點。它們一旦執行起來應該就會互相尋找對方並且建立叢集。
   同樣的 `--token` 引數可以同時用於 `kubeadm init` 和 `kubeadm join` 命令。

<!--
3.  Similar can be done for `-certificate-key` when joining additional control-plane nodes. The key can be generated using:
-->
3. 當加入其他控制平面節點時，可以對 `--certificate-key` 執行類似的操作。可以使用以下方式生成金鑰：

   ```shell
   kubeadm certs certificate-key
   ```

<!--
Once the cluster is up, you can grab the admin credentials from the control-plane node
at `/etc/kubernetes/admin.conf` and use that to talk to the cluster.
-->
一旦叢集啟動起來，你就可以從控制平面節點的 `/etc/kubernetes/admin.conf` 檔案獲取管理憑證，
並使用這個憑證同叢集通訊。

<!--
Note that this style of bootstrap has some relaxed security guarantees because
it does not allow the root CA hash to be validated with
`-discovery-token-ca-cert-hash` (since it's not generated when the nodes are
provisioned). For details, see the [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/).
-->
注意這種搭建叢集的方式在安全保證上會有一些寬鬆，因為這種方式不允許使用 `--discovery-token-ca-cert-hash` 
來驗證根 CA 的雜湊值（因為當配置節點的時候，它還沒有被生成）。
更多資訊請參閱 [kubeadm join](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-join/) 文件。

## {{% heading "whatsnext" %}}

<!--
* [kubeadm init phase](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/) to understand more about
`kubeadm init` phases
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) to bootstrap a Kubernetes worker node and join it to the cluster
* [kubeadm upgrade](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade/) to upgrade a Kubernetes cluster to a newer version
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) to revert any changes made to this host by `kubeadm init` or `kubeadm join`
-->
* 進一步閱讀了解 [kubeadm init phase](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/)
* [kubeadm join](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-join/)
  啟動一個 Kubernetes 工作節點並且將其加入到叢集
* [kubeadm upgrade](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-upgrade/)
  將 Kubernetes 叢集升級到新版本
* [kubeadm reset](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-reset/)
  恢復 `kubeadm init` 或 `kubeadm join` 命令對節點所作的變更

