---
title: kubectl 的用法约定
content_type: concept
weight: 60
---
<!--
title: kubectl Usage Conventions
reviewers:
- janetkuo
content_type: concept
weight: 60
-->

<!-- overview -->
<!--
Recommended usage conventions for `kubectl`.
-->
`kubectl` 的推荐用法约定。


<!-- body -->

<!--
## Using `kubectl` in Reusable Scripts
-->
## 在可重用脚本中使用 `kubectl` {#using-kubectl-in-reusable-scripts}

<!--
For a stable output in a script:
-->
对于脚本中的稳定输出：

<!--
* Request one of the machine-oriented output forms, such as `-o name`, `-o json`, `-o yaml`, `-o go-template`, or `-o jsonpath`.
* Fully-qualify the version. For example, `jobs.v1.batch/myjob`. This will ensure that kubectl does not use its default version that can change over time.
* Don't rely on context, preferences, or other implicit states.
-->

* 请求一个面向机器的输出格式，例如 `-o name`、`-o json`、`-o yaml`、`-o go template` 或 `-o jsonpath`。
* 完全限定版本。例如 `jobs.v1.batch/myjob`。这将确保 kubectl 不会使用其默认版本，该版本会随着时间的推移而更改。
* 不要依赖上下文、首选项或其他隐式状态。

<!--
## Subresources
-->
## 子资源    {#subresources}

<!--
* You can use the `--subresource` beta flag for kubectl commands like `get`, `patch`,
`edit` and `replace` to fetch and update subresources for all resources that
support them. Currently, only the `status` and `scale` subresources are supported.
  * For `kubectl edit`, the `scale` subresource is not supported. If you use  `--subresource` with
    `kubectl edit` and specify `scale` as the subresource, the command will error out.
* The API contract against a subresource is identical to a full resource. While updating the
`status` subresource to a new value, keep in mind that the subresource could be potentially
reconciled by a controller to a different value.
-->

* 你可以将 `--subresource` Beta 标志用于 kubectl 命令，例如 `get`、`patch`、`edit` 和 `replace`
  来获取和更新所有支持子资源的资源的子资源。目前，仅支持 `status` 和 `scale` 子资源。
  * 对于 `kubectl edit`，不支持 `scale` 子资源。如果将 `--subresource` 与 `kubectl edit` 一起使用，
    并指定 `scale` 作为子资源，则命令将会报错。
* 针对子资源的 API 协定与完整资源相同。在更新 `status` 子资源为一个新值时，请记住，
  子资源可能是潜在的由控制器调和为不同的值。

<!--
## Best Practices
-->
## 最佳实践 {#best-practices}

### `kubectl run`

<!--
For `kubectl run` to satisfy infrastructure as code:
-->
若希望 `kubectl run` 满足基础设施即代码的要求：

<!--
* Tag the image with a version-specific tag and don't move that tag to a new version. For example, use `:v1234`, `v1.2.3`, `r03062016-1-4`, rather than `:latest` (For more information, see [Best Practices for Configuration](/docs/concepts/configuration/overview/#container-images)).
* Check in the script for an image that is heavily parameterized.
* Switch to configuration files checked into source control for features that are needed, but not expressible via `kubectl run` flags.
-->

* 使用特定版本的标签标记镜像，不要将该标签改为新版本。例如使用 `:v1234`、`v1.2.3`、`r03062016-1-4`，
  而不是 `:latest`（有关详细信息，请参阅[配置的最佳实践](/zh-cn/docs/concepts/configuration/overview/#container-images))。
* 使用基于版本控制的脚本来运行包含大量参数的镜像。
* 对于无法通过 `kubectl run` 参数来表示的功能特性，使用基于源码控制的配置文件，以记录要使用的功能特性。

<!--
You can use the `--dry-run=client` flag to preview the object that would be sent to your cluster, without really submitting it.
-->
你可以使用 `--dry-run=client` 参数来预览而不真正提交即将下发到集群的对象实例：

### `kubectl apply`

<!--
* You can use `kubectl apply` to create or update resources. For more information about using kubectl apply to update resources, see [Kubectl Book](https://kubectl.docs.kubernetes.io).
-->
* 你可以使用 `kubectl apply` 命令创建或更新资源。有关使用 kubectl apply 更新资源的详细信息，请参阅 [Kubectl 文档](https://kubectl.docs.kubernetes.io)。
