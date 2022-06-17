---
title: 配置 kubelet 映象憑據提供程式
description: 配置 kubelet 的映象憑據提供程式外掛
content_type: task
---

<!-- 
title: Configure a kubelet image credential provider
reviewers:
- liggitt
- cheftako
description: Configure the kubelet's image credential provider plugin
content_type: task
-->

{{< feature-state for_k8s_version="v1.20" state="alpha" >}}

<!-- overview -->

<!-- 
Starting from Kubernetes v1.20, the kubelet can dynamically retrieve credentials for a container image registry
using exec plugins. The kubelet and the exec plugin communicate through stdio (stdin, stdout, and stderr) using
Kubernetes versioned APIs. These plugins allow the kubelet to request credentials for a container registry dynamically
as opposed to storing static credentials on disk. For example, the plugin may talk to a local metadata server to retrieve
short-lived credentials for an image that is being pulled by the kubelet.
-->
從 Kubernetes v1.20 開始，kubelet 可以使用 exec 外掛動態檢索容器映象註冊中心的憑據。
kubelet 和 exec 外掛使用 Kubernetes 版本化 API 透過標準輸入輸出（標準輸入、標準輸出和標準錯誤）通訊。
這些外掛允許 kubelet 動態請求容器註冊中心的憑據，而不是將靜態憑據儲存在磁碟上。
例如，外掛可能會與本地元資料通訊，以檢索 kubelet 正在拉取的映象的短期憑據。

<!-- 
You may be interested in using this capability if any of the below are true:

* API calls to a cloud provider service are required to retrieve authentication information for a registry.
* Credentials have short expiration times and requesting new credentials frequently is required.
* Storing registry credentials on disk or in imagePullSecrets is not acceptable.

This guide demonstrates how to configure the kubelet's image credential provider plugin mechanism.
-->
如果以下任一情況屬實，你可能對此功能感興趣：

* 需要呼叫雲提供商的 API 來檢索註冊中心的身份驗證資訊。
* 憑據的到期時間很短，需要頻繁請求新憑據。
* 將註冊中心憑據儲存在磁碟或者 imagePullSecret 是不可接受的。

## {{% heading "prerequisites" %}}

<!-- 
* The kubelet image credential provider is introduced in v1.20 as an alpha feature. As with other alpha features,
  a feature gate `KubeletCredentialProviders` must be enabled on only the kubelet for the feature to work.
* A working implementation of a credential provider exec plugin. You can build your own plugin or use one provided by cloud providers.
-->
* kubelet 映象憑證提供程式在 v1.20 版本作為 alpha 功能引入。
  與其他 alpha 功能一樣，當前僅當在 kubelet 啟動 `KubeletCredentialProviders` 特性門禁才能使該功能正常工作。
* 憑據提供程式 exec 外掛的工作實現。你可以構建自己的外掛或使用雲提供商提供的外掛。

<!-- steps -->

<!-- 
## Installing Plugins on Nodes

A credential provider plugin is an executable binary that will be run by the kubelet. Ensure that the plugin binary exists on
every node in your cluster and stored in a known directory. The directory will be required later when configuring kubelet flags.
-->
## 在節點上安裝外掛  {#installing-plugins-on-nodes}

憑據提供程式外掛是將由 kubelet 執行的可執行二進位制檔案。
確保外掛二進位制存在於你的叢集的每個節點上，並存儲在已知目錄中。
稍後配置 kubelet 標誌需要該目錄。

<!-- 
## Configuring the Kubelet

In order to use this feature, the kubelet expects two flags to be set:

* `--image-credential-provider-config` - the path to the credential provider plugin config file.
* `--image-credential-provider-bin-dir` - the path to the directory where credential provider plugin binaries are located.
-->
## 配置 kubelet  {#configuring-the-kubelet}

為了使用這個特性，kubelet 需要設定以下兩個標誌：

* `--image-credential-provider-config` —— 憑據提供程式外掛配置檔案的路徑。
* `--image-credential-provider-bin-dir` —— 憑據提供程式外掛二進位制檔案所在目錄的路徑。

<!-- 
### Configure a kubelet credential provider

The configuration file passed into `--image-credential-provider-config` is read by the kubelet to determine which exec plugins
should be invoked for which container images. Here's an example configuration file you may end up using if you are using the
[ECR](https://aws.amazon.com/ecr/)-based plugin:
-->
### 配置 kubelet 憑據提供程式  {#configure-a-kubelet-credential-provider}

kubelet 會讀取傳入 `--image-credential-provider-config` 的配置檔案，
以確定應該為哪些容器映象呼叫哪些 exec 外掛。
如果你正在使用基於 [ECR](https://aws.amazon.com/ecr/) 的外掛，
這裡有個樣例配置檔案你可能最終會使用到：

```yaml
apiVersion: kubelet.config.k8s.io/v1alpha1
kind: CredentialProviderConfig
# providers 是將由 kubelet 啟用的憑證提供程式外掛列表。
# 多個提供程式可能與單個映象匹配，在這種情況下，來自所有提供程式的憑據將返回到 kubelet。
# 如果為單個映象呼叫多個提供程式，則結果會合並。
# 如果提供程式返回重疊的身份驗證金鑰，則使用提供程式列表中較早的值。
providers:
  # name 是憑據提供程式的必需名稱。 
  # 它必須與 kubelet 看到的提供程式可執行檔案的名稱相匹配。
  # 可執行檔案必須在 kubelet 的 bin 目錄中
  # （由 --image-credential-provider-bin-dir 標誌設定）。
  - name: ecr
    # matchImages 是一個必需的字串列表，用於匹配映象以確定是否應呼叫此提供程式。
    # 如果其中一個字串與 kubelet 請求的映象相匹配，則該外掛將被呼叫並有機會提供憑據。
    # 映象應包含註冊域和 URL 路徑。
    #
    # matchImages 中的每個條目都是一個模式，可以選擇包含埠和路徑。
    # 萬用字元可以在域中使用，但不能在埠或路徑中使用。
    # 支援萬用字元作為子域（例如“*.k8s.io”或“k8s.*.io”）和頂級域（例如“k8s.*”）。
    # 還支援匹配部分子域，如“app*.k8s.io”。
    # 每個萬用字元只能匹配一個子域段，因此 *.io 不匹配 *.k8s.io。
    #
    # 當以下所有條件都為真時，映象和 matchImage 之間存在匹配：
    # - 兩者都包含相同數量的域部分並且每個部分都匹配。
    # - imageMatch 的 URL 路徑必須是目標映象 URL 路徑的字首。
    # - 如果 imageMatch 包含埠，則該埠也必須在影象中匹配。
    #
    # matchImages 的示例值：
    # - 123456789.dkr.ecr.us-east-1.amazonaws.com
    # - *.azurecr.io
    # - gcr.io
    # - *.*.registry.io
    # - registry.io:8080/path
    matchImages:
      - "*.dkr.ecr.*.amazonaws.com"
      - "*.dkr.ecr.*.amazonaws.cn"
      - "*.dkr.ecr-fips.*.amazonaws.com"
      - "*.dkr.ecr.us-iso-east-1.c2s.ic.gov"
      - "*.dkr.ecr.us-isob-east-1.sc2s.sgov.gov"
    # defaultCacheDuration 是外掛將在記憶體中快取憑據的預設持續時間
    # 如果外掛響應中未提供快取持續時間。此欄位是必需的。
    defaultCacheDuration: "12h"
    # exec CredentialProviderRequest 的必需輸入版本。
    # 返回的 CredentialProviderResponse 必須使用與輸入相同的編碼版本。當前支援的值為：
    # - credentialprovider.kubelet.k8s.io/v1alpha1
    apiVersion: credentialprovider.kubelet.k8s.io/v1alpha1
    # 執行命令時傳遞給命令的引數。
    # +可選
    args:
      - get-credentials
    # env 定義了額外的環境變數以暴露給程序。
    # 這些與主機環境以及 client-go 用於將引數傳遞給外掛的變數結合在一起。
    # +可選
    env:
      - name: AWS_PROFILE
        value: example_profile
```

<!-- 
The `providers` field is a list of enabled plugins used by the kubelet. Each entry has a few required fields:

* `name`: the name of the plugin which MUST match the name of the executable binary that exists
  in the directory passed into `--image-credential-provider-bin-dir`.
* `matchImages`: a list of strings used to match against images in order to determine
  if this provider should be invoked. More on this below.
* `defaultCacheDuration`: the default duration the kubelet will cache credentials in-memory
  if a cache duration was not specified by the plugin.
* `apiVersion`: the API version that the kubelet and the exec plugin will use when communicating.

Each credential provider can also be given optional args and environment variables as well.
Consult the plugin implementors to determine what set of arguments and environment variables are required for a given plugin.
-->
`providers` 欄位是 kubelet 使用的已啟用外掛列表。每個條目都有幾個必填欄位：

* `name`：外掛的名稱，必須與傳入`--image-credential-provider-bin-dir`
  的目錄中存在的可執行二進位制檔案的名稱相匹配。
* `matchImages`：用於匹配映象以確定是否應呼叫此提供程式的字串列表。更多相關資訊如下。
* `defaultCacheDuration`：如果外掛未指定快取持續時間，kubelet 將在記憶體中快取憑據的預設持續時間。
* `apiVersion`：kubelet 和 exec 外掛在通訊時將使用的 API 版本。

每個憑證提供程式也可以被賦予可選的引數和環境變數。
諮詢外掛實現者以確定給定外掛需要哪些引數和環境變數集。

<!-- 
#### Configure image matching

The `matchImages` field for each credential provider is used by the kubelet to determine whether a plugin should be invoked
for a given image that a Pod is using. Each entry in `matchImages` is an image pattern which can optionally contain a port and a path.
Globs can be used in the domain, but not in the port or the path. Globs are supported as subdomains like `*.k8s.io` or `k8s.*.io`,
and top-level domains such as `k8s.*`. Matching partial subdomains like `app*.k8s.io` is also supported. Each glob can only match
a single subdomain segment, so `*.io` does NOT match `*.k8s.io`.
-->
#### 配置映象匹配  {#configure-image-matching}

kubelet 使用每個憑證提供程式的 `matchImages` 欄位來確定是否應該為 Pod 正在使用的給定映象呼叫外掛。
`matchImages` 中的每個條目都是一個映象模式，可以選擇包含埠和路徑。
萬用字元可以在域中使用，但不能在埠或路徑中使用。
支援萬用字元作為子域，如 `*.k8s.io` 或 `k8s.*.io`，以及頂級域，如 `k8s.*`。
還支援匹配部分子域，如 `app*.k8s.io`。每個萬用字元只能匹配一個子域段，
因此 `*.io` 不匹配 `*.k8s.io`。

<!-- 
A match exists between an image name and a `matchImage` entry when all of the below are true:

* Both contain the same number of domain parts and each part matches.
* The URL path of match image must be a prefix of the target image URL path.
* If the imageMatch contains a port, then the port must match in the image as well.

Some example values of `matchImages` patterns are:
-->
當以下所有條件都為真時，映象名稱和 `matchImage` 條目之間存在匹配：

* 兩者都包含相同數量的域部分並且每個部分都匹配。
* 匹配圖片的 URL 路徑必須是目標圖片 URL 路徑的字首。
* 如果 imageMatch 包含埠，則該埠也必須在映象中匹配。

`matchImages` 模式的一些示例值：

* `123456789.dkr.ecr.us-east-1.amazonaws.com`
* `*.azurecr.io`
* `gcr.io`
* `*.*.registry.io`
* `foo.registry.io:8080/path`

## {{% heading "whatsnext" %}}

<!--
* Read the details about `CredentialProviderConfig` in the
  [kubelet configuration API (v1alpha1) reference](/docs/reference/config-api/kubelet-config.v1alpha1/).
* Read the [kubelet credential provider API reference (v1alpha1)](/docs/reference/config-api/kubelet-credentialprovider.v1alpha1/).
-->
* 閱讀 [kubelet 配置 API (v1alpha1) 參考](/zh-cn/docs/reference/config-api/kubelet-config.v1alpha1/)中有關 `CredentialProviderConfig` 的詳細資訊。
* 閱讀 [kubelet 憑據提供程式 API 參考 (v1alpha1)](/docs/reference/config-api/kubelet-credentialprovider.v1alpha1/)。

