<!--
---
title: Configure a kubelet image credential provider
reviewers:
- liggitt
- cheftako
description: Configure the kubelet's image credential provider plugin
content_type: task
---
-->
---
title: 配置 Kubelet 镜像凭证提供程序
description: 配置 Kubelet 镜像凭证提供程序插件
content_type: task
---

{{< feature-state for_k8s_version="v1.20" state="alpha" >}}

<!-- overview -->
<!--
Starting from Kubernetes v1.20, the kubelet can dynamically retrieve credentials for a container image registry
using exec plugins. The kubelet and the exec plugin communicate through stdio (stdin, stdout, and stderr) using
Kubernetes versioned APIs. These plugins allow the kubelet to request credentials for a container registry dynamically
as opposed to storing static credentials on disk. For example, the plugin may talk to a local metadata server to retrieve
short-lived credentials for an image that is being pulled by the kubelet.
-->
从 Kubernetes v1.20 开始，kubelet 可以使用 exec 插件动态检索容器镜像仓库的凭证。kubelet 和 exec 插件通过
使用 Kubernetes 的版本化 API 通过 stdio（stdin、stdout 和 stderr）来通信；这些插件允许 kubelet 动态请求
容器仓库的凭证，而不是在磁盘上存储静态凭证。比如，该插件可以和本地元数据服务器进行通话，
以检索由 kubelet 提取镜像的短期凭证。

<!--
You may be interested in using this capability if any of the below are true:

* API calls to a cloud provider service are required to retrieve authentication information for a registry.
* Credentials have short expiration times and requesting new credentials frequently is required.
* Storing registry credentials on disk or in imagePullSecrets is not acceptable.

This guide demonstrates how to configure the kubelet's image credential provider plugin mechanism.
-->
如果满足以下任一条件，你可能会对使用此功能感兴趣：

* 才能检索镜像仓库的身份验证信息。
* 凭证的到期时间很短，因此需要经常请求新的凭证。
* 不允许将注册表凭证存储在磁盘上或 imagePullSecrets 中。

本指南演示了如何配置 kubelet 的镜像凭证提供程序插件机制。

## {{% heading "prerequisites" %}}

<!--
* The kubelet image credential provider is introduced in v1.20 as an alpha feature. As with other alpha features,
a feature gate `KubeletCredentialProviders` must be enabled on only the kubelet for the feature to work.
* A working implementation of a credential provider exec plugin. You can build your own plugin or use one provided by cloud providers.
-->
* 在 v1.20 版本中 kubelet 镜像凭证提供程序作为 alpha 特性引入。与其他 alpha 特性一样，必须仅在 kubelet 上
  启用特性门控 `KubeletCredentialProviders`，该功能才能正常工作。
* 凭证提供程序 exec 插件的有效实现。你可以构建自己的插件，也可以使用云服务商提供的插件。

<!-- steps -->

<!--
## Installing Plugins on Nodes

A credential provider plugin is an executable binary that will be run by the kubelet. Ensure that the plugin binary exists on
every node in your cluster and stored in a known directory. The directory will be required later when configuring kubelet flags.
-->
## 在节点上安装插件

凭证提供程序插件是由 kubelet 运行的可执行二进制文件。确保插件的二进制文件存在于集群中的每个节点上，
并存储在已知目录中。稍后在配置 kubelet 参数时将需要该目录。

<!--
## Configuring the Kubelet

In order to use this feature, the kubelet expects two flags to be set:
* `--image-credential-provider-config` - the path to the credential provider plugin config file.
* `--image-credential-provider-bin-dir` - the path to the directory where credential provider plugin binaries are located.
-->
## 配置 kubelet

为了使用这个特性，kubelet 需要设置两个参数：
* `--image-credential-provider-config` - 凭证提供程序插件的配置文件路径。
* `--image-credential-provider-bin-dir` - 凭证提供程序插件的可执行二进制文件存放的路径。

<!--
### Configure a kubelet credential provider

The configuration file passed into `--image-credential-provider-config` is read by the kubelet to determine which exec plugins
should be invoked for which container images. Here's an example configuration file you may end up using if you are using the [ECR](https://aws.amazon.com/ecr/)-based plugin:
-->
### 配置 kubelet 凭证提供程序

kubelet 读取到由 `--image-credential-provider-config` 传进来的配置文件，以确定
哪些容器镜像需要调用哪些 exec 插件。如果你使用的是基于
[ECR](https://aws.amazon.com/ecr/) 的插件，则可能会使用以下示例插件：

```yaml
kind: CredentialProviderConfig
apiVersion: kubelet.config.k8s.io/v1alpha1
# provider 是给由 kubelet 启用的凭据提供程序插件的列表。多个提供程序可能与单个镜像匹配，
# 在这种情况下，所有提供程序的凭据都将返回给 kubelet。如果为单个镜像调用多个提供程序，
# 则将结果合并。如果提供程序返回重叠的身份验证密钥，那此列表前面的提供程序提供的值将会被使用。
providers:
  # name 是凭据提供程序的必需名称。它必须与 kubelet 能看到的提供程序的可执行文件名相匹配。
  # 可执行文件必须位于 kubelet 的 bin 目录中（由 --image-credential-provider-bin-dir 参数设置）。
  - name: ecr
    # matchImages 是必需的字符串列表，用于与镜像进行匹配，以确定是否应调用此提供程序。
    # 如果其中一个字符串与 kubelet 中请求的镜像匹配，则将调用该插件，并有机会提供凭据。
    # 镜像应包含注册表域和 URL 路径。
    #
    # matchImages 中的每个条目都是一个模式，可以选择包含端口和路径。可以在域中使用 glob，
    # 但不能在端口或路径中使用。支持 globs 作为子域，例如“*.k8s.io”或“k8s.*.io”，以及顶级域，
    # 例如“k8s.*”。还支持匹配部分子域，例如“app*.k8s.io”。每个 glob 只能匹配一个子域段，
    # 因此 *.io 不匹配 *.k8s.io。
    #
    # 满足以下所有条件时，镜像和 matchImage 之间存在匹配项：
    # - 两者都包含相同数量的域部分，并且每个部分都匹配。
    # - imageMatch 的 URL 路径必须是目标镜像 URL 路径的前缀。
    # - 如果 imageMatch 包含端口，则该端口也必须在镜像中匹配。
    #
    # matchImages 值的示例:
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
    # 如果插件响应中未提供缓存持续时间，则 defaultCacheDuration 是插件将在内存中缓存凭据的默认持续时间。
    # 此字段是必需的。
    defaultCacheDuration: "12h"
    # exec CredentialProviderRequest 的必需输入版本。
    # 返回的 CredentialProviderResponse 必须使用与输入相同的编码版本。
    # 当前支持的值为：
    # - credentialprovider.kubelet.k8s.io/v1alpha1
    apiVersion: credentialprovider.kubelet.k8s.io/v1alpha1
    # 执行命令时传递给该命令的参数。
    # +可选
    args:
    - get-credentials
    # Env 定义了其他环境变量以供进程使用。这些与主机环境
    # 以及 client-go 用于将参数传递给插件的变量结合在一起。
    # +可选
    env:
    - name: AWS_PROFILE
      value: example_profile
```

<!--
The `providers` field is a list of enabled plugins used by the kubelet. Each entry has a few required fields:
* `name`: the name of the plugin which MUST match the name of the executable binary that exists in the directory passed into `--image-credential-provider-bin-dir`.
* `matchImages`: a list of strings used to match against images in order to determine if this provider should be invoked. More on this below.
* `defaultCacheDuration`: the default duration the kubelet will cache credentials in-memory if a cache duration was not specified by the plugin.
* `apiVersion`: the api version that the kubelet and the exec plugin will use when communicating.
-->
`providers` 字段是由 kubelet 使用的已启用插件列表，每个条目都有一些必填字段：

* `name`：插件的名称，必须与通过 `--image-credential-provider-bin-dir` 所设置的目录中的
  某可执行二进制文件的名称相匹配。
* `matchImages`：用于与镜像匹配的字符串列表，以确定是否应调用此提供程序，在下面会有更多说明。
* `defaultCacheDuration`：如果插件未指定缓存持续时间，则 kubelet 将在内存中缓存凭据的默认持续时间。
* `apiVersion`：kubelet 和 exec 插件在通信时将使用的 api 版本。

<!--
Each credential provider can also be given optional args and environment variables as well. Consult the plugin implementors to determine what set of arguments and environment variables are required for a given plugin.
-->
你还可以为每个凭证提供程序设置可选的参数和环境变量。请咨询插件实现者，
以确定给定插件需要哪些参数和环境变量集。

<!--
#### Configure image matching

The `matchImages` field for each credential provider is used by the kubelet to determine whether a plugin should be invoked
for a given image that a Pod is using. Each entry in `matchImages` is an image pattern which can optionally contain a port and a path.
Globs can be used in the domain, but not in the port or the path. Globs are supported as subdomains like `*.k8s.io` or `k8s.*.io`,
and top-level domains such as `k8s.*`. Matching partial subdomains like `app*.k8s.io` is also supported. Each glob can only match
a single subdomain segment, so `*.io` does NOT match `*.k8s.io`.
-->
#### 配置镜像匹配

kubelet 使用每个凭证提供程序的 `matchImages` 字段来确定是否应该为 Pod 正在使用的特定镜像调用插件。
`matchImages` 中的每个条目都是一个镜像模式，可以选择性地包含端口和路径。
可以在域中使用全局通配符（Globs），但不能在端口或路径中使用。
支持使用通配符作为子域（例如 `*.k8s.io` 或 `k8s.*.io`）以及顶级域（例如 `k8s.*`）。
匹配部分子域也是被支持的，例如 `app * .k8s.io`。每个通配符只能匹配一个子域段，
因此 `*.io` 不匹配 `*.k8s.io`。

<!--
A match exists between an image name and a `matchImage` entry when all of the below are true:

* Both contain the same number of domain parts and each part matches.
* The URL path of match image must be a prefix of the target image URL path.
* If the imageMatch contains a port, then the port must match in the image as well.
-->
满足以下所有条件时，认为镜像名称和 `matchImage` 条目匹配：

* 两者都包含相同数量的域部分，并且每个部分都匹配。
* 匹配镜像的 URL 路径必须是目标镜像 URL 路径的前缀。
* 如果 imageMatch 包含端口，则该端口也必须在镜像中匹配。

<!--
Some example values of `matchImages` patterns are:
-->
下面是一些 `matchImages` 字段格式的示例：

* `123456789.dkr.ecr.us-east-1.amazonaws.com`
* `*.azurecr.io`
* `gcr.io`
* `*.*.registry.io`
* `foo.registry.io:8080/path`
