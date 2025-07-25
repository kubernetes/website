---
title: 配置 kubelet 镜像凭据提供程序
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
从 Kubernetes v1.20 开始，kubelet 可以使用 exec 插件动态获得针对某容器镜像库的凭据。
kubelet 使用 Kubernetes 版本化 API 通过标准输入输出（标准输入、标准输出和标准错误）和
exec 插件通信。这些插件允许 kubelet 动态请求容器仓库的凭据，而不是将静态凭据存储在磁盘上。
例如，插件可能会与本地元数据服务器通信，以获得 kubelet 正在拉取的镜像的短期凭据。

<!-- 
You may be interested in using this capability if any of the below are true:

* API calls to a cloud provider service are required to retrieve authentication information for a registry.
* Credentials have short expiration times and requesting new credentials frequently is required.
* Storing registry credentials on disk or in imagePullSecrets is not acceptable.

This guide demonstrates how to configure the kubelet's image credential provider plugin mechanism.
-->
如果以下任一情况属实，你可能对此功能感兴趣：

* 需要调用云提供商的 API 来获得镜像库的身份验证信息。
* 凭据的到期时间很短，需要频繁请求新凭据。
* 将镜像库凭据存储在磁盘或者 imagePullSecret 是不可接受的。

本指南演示如何配置 kubelet 的镜像凭据提供程序插件机制。

<!--
## Service Account Token for Image Pulls
-->
## 使用服务帐号令牌拉取镜像   {#service-account-token-for-image-pulls}

{{< feature-state feature_gate_name="KubeletServiceAccountTokenForCredentialProviders" >}}

<!--
Starting from Kubernetes v1.33,
the kubelet can be configured to send a service account token
bound to the pod for which the image pull is being performed
to the credential provider plugin.

This allows the plugin to exchange the token for credentials
to access the image registry.
-->
从 Kubernetes v1.33 开始，
可以配置 kubelet 在为 Pod 执行镜像拉取时发送一个与该 Pod
绑定的服务账号令牌给凭据提供者插件。

这允许插件用该令牌交换访问镜像仓库的凭据。

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
要启用此特性，
必须在 kubelet 上启用 `KubeletServiceAccountTokenForCredentialProviders` 特性门控，
并且必须在插件的 `CredentialProviderConfig` 文件中设置 `tokenAttributes` 字段。

`tokenAttributes` 字段包含将传递给插件的服务帐号令牌的信息，
包括令牌的预期受众和插件是否要求 Pod 拥有服务帐号。

<!--
Using service account token credentials can enable the following use-cases:

* Avoid needing a kubelet/node-based identity to pull images from a registry.
* Allow workloads to pull images based on their own runtime identity
without long-lived/persisted secrets.
-->
使用服务帐号令牌凭据可以启用以下用例：

* 避免需要基于 kubelet/节点的身份从镜像仓库拉取镜像。
* 允许工作负载根据其自身的运行时身份拉取镜像，
  而无需长期存在的/持久化的 Secret。

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
* 你需要一个 Kubernetes 集群，其节点支持 kubelet 凭据提供程序插件。
  这种支持在 Kubernetes {{< skew currentVersion >}} 中可用；
  Kubernetes v1.24 和 v1.25 将此作为 Beta 特性包含在内，默认启用。
* 如果你正在配置需要服务帐号令牌的凭据提供者插件，
  你需要一个运行 Kubernetes v1.33 或更高版本的 Kubernetes 集群，
  并且在 kubelet 上启用了 `KubeletServiceAccountTokenForCredentialProviders` 特性门控。
* 凭据提供程序 exec 插件的一种可用的实现。你可以构建自己的插件或使用云提供商提供的插件。

{{< version-check >}}

<!-- steps -->

<!-- 
## Installing Plugins on Nodes

A credential provider plugin is an executable binary that will be run by the kubelet. Ensure that the plugin binary exists on
every node in your cluster and stored in a known directory. The directory will be required later when configuring kubelet flags.
-->
## 在节点上安装插件  {#installing-plugins-on-nodes}

凭据提供程序插件是将由 kubelet 运行的可执行二进制文件。
你需要确保插件可执行文件存在于你的集群的每个节点上，并存储在已知目录中。
稍后配置 kubelet 标志需要该目录。

<!-- 
## Configuring the Kubelet

In order to use this feature, the kubelet expects two flags to be set:

* `--image-credential-provider-config` - the path to the credential provider plugin config file.
* `--image-credential-provider-bin-dir` - the path to the directory where credential provider plugin binaries are located.
-->
## 配置 kubelet  {#configuring-the-kubelet}

为了使用这个特性，kubelet 需要设置以下两个标志：

* `--image-credential-provider-config` —— 凭据提供程序插件配置文件的路径。
* `--image-credential-provider-bin-dir` —— 凭据提供程序插件二进制可执行文件所在目录的路径。

<!-- 
### Configure a kubelet credential provider

The configuration file passed into `--image-credential-provider-config` is read by the kubelet to determine which exec plugins
should be invoked for which container images. Here's an example configuration file you may end up using if you are using the
[ECR-based plugin](https://github.com/kubernetes/cloud-provider-aws/tree/master/cmd/ecr-credential-provider):
-->
### 配置 kubelet 凭据提供程序  {#configure-a-kubelet-credential-provider}

kubelet 会读取通过 `--image-credential-provider-config` 设定的配置文件，
以确定应该为哪些容器镜像调用哪些 exec 插件。
如果你正在使用基于 [ECR-based 插件](https://github.com/kubernetes/cloud-provider-aws/tree/master/cmd/ecr-credential-provider)，
这里有个样例配置文件你可能最终会使用到：

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
# providers 是将由 kubelet 启用的凭据提供程序帮助插件列表。
# 多个提供程序可能与单个镜像匹配，在这种情况下，来自所有提供程序的凭据将返回到 kubelet。
# 如果为单个镜像调用了多个提供程序，则返回结果会被合并。
# 如果提供程序返回重叠的身份验证密钥，则使用提供程序列表中较早的值。
providers:
  # name 是凭据提供程序的必需名称。 
  # 它必须与 kubelet 看到的提供程序可执行文件的名称相匹配。
  # 可执行文件必须在 kubelet 的 bin 目录中
  # （由 --image-credential-provider-bin-dir 标志设置）。
  - name: ecr-credential-provider
    # matchImages 是一个必需的字符串列表，用于匹配镜像以确定是否应调用此提供程序。
    # 如果其中一个字符串与 kubelet 请求的镜像相匹配，则该插件将被调用并有机会提供凭据。
    # 镜像应包含注册域和 URL 路径。
    #
    # matchImages 中的每个条目都是一个模式字符串，可以选择包含端口和路径。
    # 可以在域中使用通配符，但不能在端口或路径中使用。
    # 支持通配符作为子域（例如 "*.k8s.io" 或 "k8s.*.io"）和顶级域（例如 "k8s.*"）。
    # 还支持匹配部分子域，如 "app*.k8s.io"。
    # 每个通配符只能匹配一个子域段，因此 "*.io" **不** 匹配 "*.k8s.io"。
    #
    # 当以下所有条件都为真时，镜像和 matchImage 之间存在匹配：
    #
    # - 两者都包含相同数量的域部分并且每个部分都匹配。
    # - matchImages 的 URL 路径必须是目标镜像 URL 路径的前缀。
    # - 如果 matchImages 包含端口，则该端口也必须在镜像中匹配。
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
    # defaultCacheDuration 是插件将在内存中缓存凭据的默认持续时间。
    # 如果插件响应中未提供缓存持续时间。此字段是必需的。
    defaultCacheDuration: "12h"
    # exec CredentialProviderRequest 的必需输入版本。
    # 返回的 CredentialProviderResponse 必须使用与输入相同的编码版本。当前支持的值为：
    # - credentialprovider.kubelet.k8s.io/v1
    apiVersion: credentialprovider.kubelet.k8s.io/v1
    # 执行命令时传递给命令的参数。
    # 可选
    # args:
    #  - --example-argument
    # env 定义了额外的环境变量以暴露给进程。
    # 这些与主机环境以及 client-go 用于将参数传递给插件的变量结合在一起。
    # 可选
    env:
      - name: AWS_PROFILE
        value: example_profile

    # tokenAttributes 是将传递给插件的服务账号令牌的配置。
    # 凭证提供者通过设置此字段选择使用服务账号令牌进行镜像拉取。
    # 如果在未启用 `KubeletServiceAccountTokenForCredentialProviders` 特性门控的情况下设置了此字段，
    # kubelet 将因无效配置错误而无法启动。
    # 可选
    tokenAttributes:
      # serviceAccountTokenAudience 是 projected service account token 的预期受众。
      # 必需
      serviceAccountTokenAudience: "<audience for the token>"
      # requireServiceAccount 指示插件是否需要 Pod 拥有服务帐号。
      # 如果设置为 true，kubelet 仅在 Pod 拥有服务账号时才会调用插件。
      # 如果设置为 false，即使 Pod 没有服务账号，kubelet 也会调用插件，
      # 并且不会在 CredentialProviderRequest 中包含令牌。这对于用于拉取没有服务账号的 Pod（例如静态 Pod）镜像的插件非常有用。
      # 必需
      requireServiceAccount: true
      # requiredServiceAccountAnnotationKeys 是插件感兴趣的注解键列表，
      # 并且这些键需要存在于服务帐号中。
      # 在此列表中定义的键将从相应的服务帐号中提取，并作为 CredentialProviderRequest 的一部分传递给插件。
      # 如果此列表中定义的任何一个键不存在于 service account 中，kubelet 将不会调用插件并返回错误。
      # 此字段是可选的，可以为空。插件可以使用此字段提取获取凭据所需的额外信息，
      # 或允许工作负载选择使用服务帐号令牌进行镜像拉取。
      # 如果非空，则 requireServiceAccount 必须设置为 true。
      # 此列表中定义的键必须唯一且不与 optionalServiceAccountAnnotationKeys 列表中定义的键重叠。
      # 可选
      requiredServiceAccountAnnotationKeys:
      - "example.com/required-annotation-key-1"
      - "example.com/required-annotation-key-2"
      # optionalServiceAccountAnnotationKeys 是插件感兴趣的注解键列表，
      # 并且这些键在服务帐号中是可选存在的。
      # 在此列表中定义的键将从相应的 service account 中提取，并作为 CredentialProviderRequest 的一部分传递给插件。
      # 插件负责验证注解及其值的存在性。此字段是可选的，可以为空。
      # 插件可以使用此字段提取获取凭据所需的额外信息。
      # 此列表中定义的键必须唯一且不与 requiredServiceAccountAnnotationKeys 列表中定义的键重叠。
      # 可选
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
`providers` 字段是 kubelet 所使用的已启用插件列表。每个条目都有几个必填字段：

* `name`：插件的名称，必须与传入 `--image-credential-provider-bin-dir`
  的目录中存在的可执行二进制文件的名称相匹配。
* `matchImages`：字符串列表，用于匹配镜像以确定是否应调用此提供程序。
  更多相关信息参见后文。
* `defaultCacheDuration`：如果插件未指定缓存时长，kubelet 将在内存中缓存凭据的默认时长。
* `apiVersion`：kubelet 和 exec 插件在通信时将使用的 API 版本。

每个凭据提供程序也可以被赋予可选的参数和环境变量。
你可以咨询插件实现者以确定给定插件需要哪些参数和环境变量集。

<!--
If you are using the KubeletServiceAccountTokenForCredentialProviders feature gate
and configuring the plugin to use the service account token
by setting the tokenAttributes field,
the following fields are required:
-->
如果你正在使用 KubeletServiceAccountTokenForCredentialProviders 特性门控
并且通过设置 tokenAttributes 字段配置插件使用服务帐号令牌，
那么需要以下字段：

<!--
* `serviceAccountTokenAudience`:
  the intended audience for the projected service account token.
  This cannot be the empty string.
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
* `serviceAccountTokenAudience`：
  预期的投射服务帐号令牌的受众。
  这不能是空字符串。

* `requireServiceAccount`：
  插件是否要求 Pod 拥有服务帐号。
- 如果设置为 `true`，kubelet 只会在 Pod 拥有 service account 时
  调用插件。
- 如果设置为 `false`，即使 Pod 没有服务帐号，
  kubelet 也会调用插件，并且不会在 `CredentialProviderRequest` 中包含令牌。

这对于用于拉取没有服务帐号的 Pod 的镜像的插件非常有用
（例如，静态 Pod）。

<!-- 
#### Configure image matching

The `matchImages` field for each credential provider is used by the kubelet to determine whether a plugin should be invoked
for a given image that a Pod is using. Each entry in `matchImages` is an image pattern which can optionally contain a port and a path.
Globs can be used in the domain, but not in the port or the path. Globs are supported as subdomains like `*.k8s.io` or `k8s.*.io`,
and top-level domains such as `k8s.*`. Matching partial subdomains like `app*.k8s.io` is also supported. Each glob can only match
a single subdomain segment, so `*.io` does NOT match `*.k8s.io`.
-->
#### 配置镜像匹配  {#configure-image-matching}

kubelet 使用每个凭据提供程序的 `matchImages` 字段来确定是否应该为 Pod
正在使用的给定镜像调用插件。
`matchImages` 中的每个条目都是一个镜像模式字符串，可以选择包含端口和路径。
可以在域中使用通配符，但不能在端口或路径中使用。
支持通配符作为子域，如 `*.k8s.io` 或 `k8s.*.io`，以及顶级域，如 `k8s.*`。
还支持匹配部分子域，如 `app*.k8s.io`。每个通配符只能匹配一个子域段，
因此 `*.io` 不匹配 `*.k8s.io`。

<!-- 
A match exists between an image name and a `matchImage` entry when all of the below are true:

* Both contain the same number of domain parts and each part matches.
* The URL path of match image must be a prefix of the target image URL path.
* If the matchImages contains a port, then the port must match in the image as well.

Some example values of `matchImages` patterns are:
-->
当以下条件全部满足时，镜像名称和 `matchImage` 条目之间存在匹配：

* 两者都包含相同数量的域部分并且每个部分都匹配。
* 匹配图片的 URL 路径必须是目标图片 URL 路径的前缀。
* 如果 matchImages 包含端口，则该端口也必须在镜像中匹配。

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
* 阅读 [kubelet 配置 API (v1) 参考](/zh-cn/docs/reference/config-api/kubelet-config.v1/)中有关
  `CredentialProviderConfig` 的详细信息。
* 阅读 [kubelet 凭据提供程序 API 参考 (v1)](/zh-cn/docs/reference/config-api/kubelet-credentialprovider.v1/)。
