---
title: 設定 kubelet 映像檔憑據提供程序
content_type: task
min-kubernetes-server-version: v1.26
weight: 120
---

<!-- 
title: Configure a kubelet image credential provider
reviewers:
- liggitt
- cheftako
content_type: task
min-kubernetes-server-version: v1.26
weight: 120
-->

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

<!-- overview -->

<!-- 
Starting from Kubernetes v1.20, the kubelet can dynamically retrieve credentials for a container image registry
using exec plugins. The kubelet and the exec plugin communicate through stdio (stdin, stdout, and stderr) using
Kubernetes versioned APIs. These plugins allow the kubelet to request credentials for a container registry dynamically
as opposed to storing static credentials on disk. For example, the plugin may talk to a local metadata server to retrieve
short-lived credentials for an image that is being pulled by the kubelet.
-->
從 Kubernetes v1.20 開始，kubelet 可以使用 exec 插件動態獲得針對某容器映像檔庫的憑據。
kubelet 使用 Kubernetes 版本化 API 通過標準輸入輸出（標準輸入、標準輸出和標準錯誤）和
exec 插件通信。這些插件允許 kubelet 動態請求容器倉庫的憑據，而不是將靜態憑據存儲在磁盤上。
例如，插件可能會與本地元數據伺服器通信，以獲得 kubelet 正在拉取的映像檔的短期憑據。

<!-- 
You may be interested in using this capability if any of the below are true:

* API calls to a cloud provider service are required to retrieve authentication information for a registry.
* Credentials have short expiration times and requesting new credentials frequently is required.
* Storing registry credentials on disk or in imagePullSecrets is not acceptable.

This guide demonstrates how to configure the kubelet's image credential provider plugin mechanism.
-->
如果以下任一情況屬實，你可能對此功能感興趣：

* 需要調用雲提供商的 API 來獲得映像檔庫的身份驗證信息。
* 憑據的到期時間很短，需要頻繁請求新憑據。
* 將映像檔庫憑據存儲在磁盤或者 imagePullSecret 是不可接受的。

本指南演示如何設定 kubelet 的映像檔憑據提供程序插件機制。

<!--
## Service Account Token for Image Pulls
-->
## 使用服務帳號令牌拉取映像檔   {#service-account-token-for-image-pulls}

{{< feature-state feature_gate_name="KubeletServiceAccountTokenForCredentialProviders" >}}

<!--
Starting from Kubernetes v1.33,
the kubelet can be configured to send a service account token
bound to the pod for which the image pull is being performed
to the credential provider plugin.

This allows the plugin to exchange the token for credentials
to access the image registry.
-->
從 Kubernetes v1.33 開始，
可以設定 kubelet 在爲 Pod 執行映像檔拉取時發送一個與該 Pod
綁定的服務賬號令牌給憑據提供者插件。

這允許插件用該令牌交換訪問映像檔倉庫的憑據。

<!--
To enable this feature,
the `KubeletServiceAccountTokenForCredentialProviders` feature gate
must be enabled on the kubelet,
and the `tokenAttributes` field must be set
in the `CredentialProviderConfig` file for the plugin.

The `tokenAttributes` field contains information
about the service account token that will be passed to the plugin,
including the intended audience for the token
and whether the plugin requires the pod to have a service account.
-->
要啓用此特性，
必須在 kubelet 上啓用 `KubeletServiceAccountTokenForCredentialProviders` 特性門控，
並且必須在插件的 `CredentialProviderConfig` 文件中設置 `tokenAttributes` 字段。

`tokenAttributes` 字段包含將傳遞給插件的服務帳號令牌的信息，
包括令牌的預期受衆和插件是否要求 Pod 擁有服務帳號。

<!--
Using service account token credentials can enable the following use-cases:

* Avoid needing a kubelet/node-based identity to pull images from a registry.
* Allow workloads to pull images based on their own runtime identity
without long-lived/persisted secrets.
-->
使用服務帳號令牌憑據可以啓用以下用例：

* 避免需要基於 kubelet/節點的身份從映像檔倉庫拉取映像檔。
* 允許工作負載根據其自身的運行時身份拉取映像檔，
  而無需長期存在的/持久化的 Secret。

## {{% heading "prerequisites" %}}

<!-- 
* You need a Kubernetes cluster with nodes that support kubelet credential
  provider plugins. This support is available in Kubernetes {{< skew currentVersion >}};
  Kubernetes v1.24 and v1.25 included this as a beta feature, enabled by default.
* If you are configuring a credential provider plugin
  that requires the service account token,
  you need a Kubernetes cluster with nodes running Kubernetes v1.33 or later
  and the `KubeletServiceAccountTokenForCredentialProviders` feature gate
  enabled on the kubelet.
* A working implementation of a credential provider exec plugin. You can build your own plugin or use one provided by cloud providers.
-->
* 你需要一個 Kubernetes 叢集，其節點支持 kubelet 憑據提供程序插件。
  這種支持在 Kubernetes {{< skew currentVersion >}} 中可用；
  Kubernetes v1.24 和 v1.25 將此作爲 Beta 特性包含在內，默認啓用。
* 如果你正在設定需要服務帳號令牌的憑據提供者插件，
  你需要一個運行 Kubernetes v1.33 或更高版本的 Kubernetes 叢集，
  並且在 kubelet 上啓用了 `KubeletServiceAccountTokenForCredentialProviders` 特性門控。
* 憑據提供程序 exec 插件的一種可用的實現。你可以構建自己的插件或使用雲提供商提供的插件。

{{< version-check >}}

<!-- steps -->

<!-- 
## Installing Plugins on Nodes

A credential provider plugin is an executable binary that will be run by the kubelet. Ensure that the plugin binary exists on
every node in your cluster and stored in a known directory. The directory will be required later when configuring kubelet flags.
-->
## 在節點上安裝插件  {#installing-plugins-on-nodes}

憑據提供程序插件是將由 kubelet 運行的可執行二進制文件。
你需要確保插件可執行文件存在於你的叢集的每個節點上，並存儲在已知目錄中。
稍後設定 kubelet 標誌需要該目錄。

<!-- 
## Configuring the Kubelet

In order to use this feature, the kubelet expects two flags to be set:

* `--image-credential-provider-config` - the path to the credential provider plugin config file.
* `--image-credential-provider-bin-dir` - the path to the directory where credential provider plugin binaries are located.
-->
## 設定 kubelet  {#configuring-the-kubelet}

爲了使用這個特性，kubelet 需要設置以下兩個標誌：

* `--image-credential-provider-config` —— 憑據提供程序插件設定文件的路徑。
* `--image-credential-provider-bin-dir` —— 憑據提供程序插件二進制可執行文件所在目錄的路徑。

<!-- 
### Configure a kubelet credential provider

The configuration file passed into `--image-credential-provider-config` is read by the kubelet to determine which exec plugins
should be invoked for which container images. Here's an example configuration file you may end up using if you are using the
[ECR-based plugin](https://github.com/kubernetes/cloud-provider-aws/tree/master/cmd/ecr-credential-provider):
-->
### 設定 kubelet 憑據提供程序  {#configure-a-kubelet-credential-provider}

kubelet 會讀取通過 `--image-credential-provider-config` 設定的設定文件，
以確定應該爲哪些容器映像檔調用哪些 exec 插件。
如果你正在使用基於 [ECR-based 插件](https://github.com/kubernetes/cloud-provider-aws/tree/master/cmd/ecr-credential-provider)，
這裏有個樣例設定文件你可能最終會使用到：

<!--
```yaml
apiVersion: kubelet.config.k8s.io/v1
kind: CredentialProviderConfig
# providers is a list of credential provider helper plugins that will be enabled by the kubelet.
# Multiple providers may match against a single image, in which case credentials
# from all providers will be returned to the kubelet. If multiple providers are called
# for a single image, the results are combined. If providers return overlapping
# auth keys, the value from the provider earlier in this list is used.
providers:
  # name is the required name of the credential provider. It must match the name of the
  # provider executable as seen by the kubelet. The executable must be in the kubelet's
  # bin directory (set by the --image-credential-provider-bin-dir flag).
  - name: ecr-credential-provider
    # matchImages is a required list of strings used to match against images in order to
    # determine if this provider should be invoked. If one of the strings matches the
    # requested image from the kubelet, the plugin will be invoked and given a chance
    # to provide credentials. Images are expected to contain the registry domain
    # and URL path.
    #
    # Each entry in matchImages is a pattern which can optionally contain a port and a path.
    # Globs can be used in the domain, but not in the port or the path. Globs are supported
    # as subdomains like '*.k8s.io' or 'k8s.*.io', and top-level-domains such as 'k8s.*'.
    # Matching partial subdomains like 'app*.k8s.io' is also supported. Each glob can only match
    # a single subdomain segment, so `*.io` does **not** match `*.k8s.io`.
    #
    # A match exists between an image and a matchImage when all of the below are true:
    # - Both contain the same number of domain parts and each part matches.
    # - The URL path of an matchImages must be a prefix of the target image URL path.
    # - If the matchImages contains a port, then the port must match in the image as well.
    #
    # Example values of matchImages:
    # - 123456789.dkr.ecr.us-east-1.amazonaws.com
    # - *.azurecr.io
    # - gcr.io
    # - *.*.registry.io
    # - registry.io:8080/path
    matchImages:
      - "*.dkr.ecr.*.amazonaws.com"
      - "*.dkr.ecr.*.amazonaws.com.cn"
      - "*.dkr.ecr-fips.*.amazonaws.com"
      - "*.dkr.ecr.us-iso-east-1.c2s.ic.gov"
      - "*.dkr.ecr.us-isob-east-1.sc2s.sgov.gov"
    # defaultCacheDuration is the default duration the plugin will cache credentials in-memory
    # if a cache duration is not provided in the plugin response. This field is required.
    defaultCacheDuration: "12h"
    # Required input version of the exec CredentialProviderRequest. The returned CredentialProviderResponse
    # MUST use the same encoding version as the input. Current supported values are:
    # - credentialprovider.kubelet.k8s.io/v1
    apiVersion: credentialprovider.kubelet.k8s.io/v1
    # Arguments to pass to the command when executing it.
    # +optional
    # args:
    #   - --example-argument
    # Env defines additional environment variables to expose to the process. These
    # are unioned with the host's environment, as well as variables client-go uses
    # to pass argument to the plugin.
    # +optional
    env:
      - name: AWS_PROFILE
        value: example_profile

    # tokenAttributes is the configuration for the service account token that will be passed to the plugin.
    # The credential provider opts in to using service account tokens for image pull by setting this field.
    # if this field is set without the `KubeletServiceAccountTokenForCredentialProviders` feature gate enabled, 
    # kubelet will fail to start with invalid configuration error.
    # +optional
    tokenAttributes:
      # serviceAccountTokenAudience is the intended audience for the projected service account token.
      # +required
      serviceAccountTokenAudience: "<audience for the token>"
      # cacheType indicates the type of cache key use for caching the credentials returned by the plugin
      # when the service account token is used.
      # The most conservative option is to set this to "Token", which means the kubelet will cache
      # returned credentials on a per-token basis. This should be set if the returned credential's
      # lifetime is limited to the service account token's lifetime.
      # If the plugin's credential retrieval logic depends only on the service account and not on
      # pod-specific claims, then the plugin can set this to "ServiceAccount". In this case, the
      # kubelet will cache returned credentials on a per-serviceaccount basis. Use this when the
      # returned credential is valid for all pods using the same service account.
      # +required
      cacheType: "<Token or ServiceAccount>"
      # requireServiceAccount indicates whether the plugin requires the pod to have a service account.
      # If set to true, kubelet will only invoke the plugin if the pod has a service account.
      # If set to false, kubelet will invoke the plugin even if the pod does not have a service account
      # and will not include a token in the CredentialProviderRequest. This is useful for plugins
      # that are used to pull images for pods without service accounts (e.g., static pods).
      # +required
      requireServiceAccount: true
      # requiredServiceAccountAnnotationKeys is the list of annotation keys that the plugin is interested in
      # and that are required to be present in the service account.
      # The keys defined in this list will be extracted from the corresponding service account and passed
      # to the plugin as part of the CredentialProviderRequest. If any of the keys defined in this list
      # are not present in the service account, kubelet will not invoke the plugin and will return an error.
      # This field is optional and may be empty. Plugins may use this field to extract additional information
      # required to fetch credentials or allow workloads to opt in to using service account tokens for image pull.
      # If non-empty, requireServiceAccount must be set to true.
      # The keys defined in this list must be unique and not overlap with the keys defined in the
      # optionalServiceAccountAnnotationKeys list.
      # +optional
      requiredServiceAccountAnnotationKeys:
      - "example.com/required-annotation-key-1"
      - "example.com/required-annotation-key-2"
      # optionalServiceAccountAnnotationKeys is the list of annotation keys that the plugin is interested in
      # and that are optional to be present in the service account.
      # The keys defined in this list will be extracted from the corresponding service account and passed
      # to the plugin as part of the CredentialProviderRequest. The plugin is responsible for validating the
      # existence of annotations and their values. This field is optional and may be empty.
      # Plugins may use this field to extract additional information required to fetch credentials.
      # The keys defined in this list must be unique and not overlap with the keys defined in the
      # requiredServiceAccountAnnotationKeys list.
      # +optional
      optionalServiceAccountAnnotationKeys:
      - "example.com/optional-annotation-key-1"
      - "example.com/optional-annotation-key-2"
```
-->
```yaml
apiVersion: kubelet.config.k8s.io/v1
kind: CredentialProviderConfig
# providers 是將由 kubelet 啓用的憑據提供程序幫助插件列表。
# 多個提供程序可能與單個鏡像匹配，在這種情況下，來自所有提供程序的憑據將返回到 kubelet。
# 如果爲單個鏡像調用了多個提供程序，則返回結果會被合併。
# 如果提供程序返回重疊的身份驗證密鑰，則使用提供程序列表中較早的值。
providers:
  # name 是憑據提供程序的必需名稱。
  # 它必須與 kubelet 看到的提供程序可執行文件的名稱相匹配。
  # 可執行文件必須在 kubelet 的 bin 目錄中
  # （由 --image-credential-provider-bin-dir 標誌設置）。
  - name: ecr-credential-provider
    # matchImages 是一個必需的字符串列表，用於匹配鏡像以確定是否應調用此提供程序。
    # 如果其中一個字符串與 kubelet 請求的鏡像相匹配，則該插件將被調用並有機會提供憑據。
    # 鏡像應包含註冊域和 URL 路徑。
    #
    # matchImages 中的每個條目都是一個模式字符串，可以選擇包含端口和路徑。
    # 可以在域中使用通配符，但不能在端口或路徑中使用。
    # 支持通配符作爲子域（例如 "*.k8s.io" 或 "k8s.*.io"）和頂級域（例如 "k8s.*"）。
    # 還支持匹配部分子域，如 "app*.k8s.io"。
    # 每個通配符只能匹配一個子域段，因此 "*.io" **不** 匹配 "*.k8s.io"。
    #
    # 當以下所有條件都爲真時，鏡像和 matchImage 之間存在匹配：
    #
    # - 兩者都包含相同數量的域部分並且每個部分都匹配。
    # - matchImages 的 URL 路徑必須是目標鏡像 URL 路徑的前綴。
    # - 如果 matchImages 包含端口，則該端口也必須在鏡像中匹配。
    #
    # matchImages 的示例值：
    #
    # - 123456789.dkr.ecr.us-east-1.amazonaws.com
    # - *.azurecr.io
    # - gcr.io
    # - *.*.registry.io
    # - registry.io:8080/path
    matchImages:
      - "*.dkr.ecr.*.amazonaws.com"
      - "*.dkr.ecr.*.amazonaws.com.cn"
      - "*.dkr.ecr-fips.*.amazonaws.com"
      - "*.dkr.ecr.us-iso-east-1.c2s.ic.gov"
      - "*.dkr.ecr.us-isob-east-1.sc2s.sgov.gov"
    # defaultCacheDuration 是插件將在內存中緩存憑據的默認持續時間。
    # 如果插件響應中未提供緩存持續時間。此字段是必需的。
    defaultCacheDuration: "12h"
    # exec CredentialProviderRequest 的必需輸入版本。
    # 返回的 CredentialProviderResponse 必須使用與輸入相同的編碼版本。當前支持的值爲：
    # - credentialprovider.kubelet.k8s.io/v1
    apiVersion: credentialprovider.kubelet.k8s.io/v1
    # 執行命令時傳遞給命令的參數。
    # 可選
    # args:
    #  - --example-argument
    # env 定義了額外的環境變量以暴露給進程。
    # 這些與主機環境以及 client-go 用於將參數傳遞給插件的變量結合在一起。
    # 可選
    env:
      - name: AWS_PROFILE
        value: example_profile

    # tokenAttributes 是將傳遞給插件的服務賬號令牌的配置。
    # 憑證提供者通過設置此字段選擇使用服務賬號令牌進行鏡像拉取。
    # 如果在未啓用 `KubeletServiceAccountTokenForCredentialProviders` 特性門控的情況下設置了此字段，
    # kubelet 將因無效配置錯誤而無法啓動。
    # 可選
    tokenAttributes:
      # serviceAccountTokenAudience 是 projected service account token 的預期受衆。
      # 必需
      serviceAccountTokenAudience: "<audience for the token>"
      # cacheType 指示當使用服務賬號令牌時，用於緩存插件返回憑據的緩存鍵的類型。
      # 最保守的選擇是將其設置爲 "Token"，這意味着 kubelet 將基於每個令牌緩存返回的憑據。
      # 如果返回憑據的有效期限制於服務賬號令牌的有效期，則應設置此項。
      # 如果插件的憑據檢索邏輯僅依賴於服務賬號而不依賴於特定於 Pod 的申領，
      # 那麼插件可以將此設置爲 "ServiceAccount"。在這種情況下，
      # kubelet 將基於每個服務賬號緩存返回的憑據。當返回的憑據對使用相同服務賬號的所有 Pod 均有效時使用此選項。
      # 必需
      cacheType: "<Token or ServiceAccount>"
      # requireServiceAccount 指示插件是否需要 Pod 擁有服務帳號。
      # 如果設置爲 true，kubelet 僅在 Pod 擁有服務賬號時纔會調用插件。
      # 如果設置爲 false，即使 Pod 沒有服務賬號，kubelet 也會調用插件，
      # 並且不會在 CredentialProviderRequest 中包含令牌。這對於用於拉取沒有服務賬號的 Pod（例如靜態 Pod）鏡像的插件非常有用。
      # 必需
      requireServiceAccount: true
      # requiredServiceAccountAnnotationKeys 是插件感興趣的註解鍵列表，
      # 並且這些鍵需要存在於服務帳號中。
      # 在此列表中定義的鍵將從相應的服務帳號中提取，並作爲 CredentialProviderRequest 的一部分傳遞給插件。
      # 如果此列表中定義的任何一個鍵不存在於 service account 中，kubelet 將不會調用插件並返回錯誤。
      # 此字段是可選的，可以爲空。插件可以使用此字段提取獲取憑據所需的額外信息，
      # 或允許工作負載選擇使用服務帳號令牌進行鏡像拉取。
      # 如果非空，則 requireServiceAccount 必須設置爲 true。
      # 此列表中定義的鍵必須唯一且不與 optionalServiceAccountAnnotationKeys 列表中定義的鍵重疊。
      # 可選
      requiredServiceAccountAnnotationKeys:
      - "example.com/required-annotation-key-1"
      - "example.com/required-annotation-key-2"
      # optionalServiceAccountAnnotationKeys 是插件感興趣的註解鍵列表，
      # 並且這些鍵在服務帳號中是可選存在的。
      # 在此列表中定義的鍵將從相應的 service account 中提取，並作爲 CredentialProviderRequest 的一部分傳遞給插件。
      # 插件負責驗證註解及其值的存在性。此字段是可選的，可以爲空。
      # 插件可以使用此字段提取獲取憑據所需的額外信息。
      # 此列表中定義的鍵必須唯一且不與 requiredServiceAccountAnnotationKeys 列表中定義的鍵重疊。
      # 可選
      optionalServiceAccountAnnotationKeys:
      - "example.com/optional-annotation-key-1"
      - "example.com/optional-annotation-key-2"
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
`providers` 字段是 kubelet 所使用的已啓用插件列表。每個條目都有幾個必填字段：

* `name`：插件的名稱，必須與傳入 `--image-credential-provider-bin-dir`
  的目錄中存在的可執行二進制文件的名稱相匹配。
* `matchImages`：字符串列表，用於匹配映像檔以確定是否應調用此提供程序。
  更多相關信息參見後文。
* `defaultCacheDuration`：如果插件未指定緩存時長，kubelet 將在內存中緩存憑據的默認時長。
* `apiVersion`：kubelet 和 exec 插件在通信時將使用的 API 版本。

每個憑據提供程序也可以被賦予可選的參數和環境變量。
你可以諮詢插件實現者以確定給定插件需要哪些參數和環境變量集。

<!--
If you are using the KubeletServiceAccountTokenForCredentialProviders feature gate
and configuring the plugin to use the service account token
by setting the tokenAttributes field,
the following fields are required:
-->
如果你正在使用 KubeletServiceAccountTokenForCredentialProviders 特性門控
並且通過設置 tokenAttributes 字段設定插件使用服務帳號令牌，
那麼需要以下字段：

<!--
* `serviceAccountTokenAudience`:
  the intended audience for the projected service account token.
  This cannot be the empty string.
* `cacheType`:
  the type of cache key used for caching the credentials returned by the plugin
  when the service account token is used.
  The most conservative option is to set this to `Token`,
  which means the kubelet will cache returned credentials
  on a per-token basis.
  This should be set if the returned credential's lifetime
  is limited to the service account token's lifetime.
  If the plugin's credential retrieval logic depends only on the service account
  and not on pod-specific claims,
  then the plugin can set this to `ServiceAccount`.
  In this case, the kubelet will cache returned credentials
  on a per-service account basis.
  Use this when the returned credential is valid for all pods using the same service account.
-->
* `serviceAccountTokenAudience`：
  預期的投射服務賬號令牌的受衆。
  這不能是空字符串。

**cacheType**：
  當使用服務賬號令牌時，用於緩存插件返回憑據的緩存鍵的類型。
  最保守的選擇是將其設置爲 **Token**，
  這意味着 kubelet 將基於每個令牌緩存返回的憑據。
  如果返回憑據的有效期限制於服務賬號令牌的有效期，則應設置此項。
  如果插件的憑據檢索邏輯僅依賴於服務賬號而不依賴於特定於 Pod 的申領，
  那麼插件可以將此設置爲 **ServiceAccount**。
  在這種情況下，kubelet 將基於每個服務賬號緩存返回的憑據。
  當返回的憑據對使用相同服務賬號的所有 Pod 均有效時使用此選項。

<!--
* `requireServiceAccount`:
  whether the plugin requires the pod to have a service account.
  * If set to `true`, kubelet will only invoke the plugin
if the pod has a service account.
  * If set to `false`, kubelet will invoke the plugin
even if the pod does not have a service account
and will not include a token in the `CredentialProviderRequest`.

This is useful for plugins that are used
to pull images for pods without service accounts
(e.g., static pods).
-->
* `requireServiceAccount`：
  插件是否要求 Pod 擁有服務帳號。
- 如果設置爲 `true`，kubelet 只會在 Pod 擁有服務賬號時
  調用插件。
- 如果設置爲 `false`，即使 Pod 沒有服務帳號，
  kubelet 也會調用插件，並且不會在 `CredentialProviderRequest` 中包含令牌。

這對於用於拉取沒有服務帳號的 Pod 的映像檔的插件非常有用
（例如，靜態 Pod）。

<!-- 
#### Configure image matching

The `matchImages` field for each credential provider is used by the kubelet to determine whether a plugin should be invoked
for a given image that a Pod is using. Each entry in `matchImages` is an image pattern which can optionally contain a port and a path.
Globs can be used in the domain, but not in the port or the path. Globs are supported as subdomains like `*.k8s.io` or `k8s.*.io`,
and top-level domains such as `k8s.*`. Matching partial subdomains like `app*.k8s.io` is also supported. Each glob can only match
a single subdomain segment, so `*.io` does NOT match `*.k8s.io`.
-->
#### 設定映像檔匹配  {#configure-image-matching}

kubelet 使用每個憑據提供程序的 `matchImages` 字段來確定是否應該爲 Pod
正在使用的給定映像檔調用插件。
`matchImages` 中的每個條目都是一個映像檔模式字符串，可以選擇包含端口和路徑。
可以在域中使用通配符，但不能在端口或路徑中使用。
支持通配符作爲子域，如 `*.k8s.io` 或 `k8s.*.io`，以及頂級域，如 `k8s.*`。
還支持匹配部分子域，如 `app*.k8s.io`。每個通配符只能匹配一個子域段，
因此 `*.io` 不匹配 `*.k8s.io`。

<!-- 
A match exists between an image name and a `matchImage` entry when all of the below are true:

* Both contain the same number of domain parts and each part matches.
* The URL path of match image must be a prefix of the target image URL path.
* If the matchImages contains a port, then the port must match in the image as well.

Some example values of `matchImages` patterns are:
-->
當以下條件全部滿足時，映像檔名稱和 `matchImage` 條目之間存在匹配：

* 兩者都包含相同數量的域部分並且每個部分都匹配。
* 匹配圖片的 URL 路徑必須是目標圖片 URL 路徑的前綴。
* 如果 matchImages 包含端口，則該端口也必須在映像檔中匹配。

`matchImages` 模式的一些示例值：

* `123456789.dkr.ecr.us-east-1.amazonaws.com`
* `*.azurecr.io`
* `gcr.io`
* `*.*.registry.io`
* `foo.registry.io:8080/path`

## {{% heading "whatsnext" %}}

<!--
* Read the details about `CredentialProviderConfig` in the
  [kubelet configuration API (v1) reference](/docs/reference/config-api/kubelet-config.v1/).
* Read the [kubelet credential provider API reference (v1)](/docs/reference/config-api/kubelet-credentialprovider.v1/).
-->
* 閱讀 [kubelet 設定 API（v1）參考](/zh-cn/docs/reference/config-api/kubelet-config.v1/)中有關
  `CredentialProviderConfig` 的詳細信息。
* 閱讀 [kubelet 憑據提供程序 API 參考（v1）](/zh-cn/docs/reference/config-api/kubelet-credentialprovider.v1/)。
