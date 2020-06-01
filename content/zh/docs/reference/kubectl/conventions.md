---
title: kubectl 的用法约定
reviewers:
- janetkuo
content_type: concept
---

<!--
---
title: kubectl Usage Conventions
reviewers:
- janetkuo
content_type: concept
---
-->

<!-- overview -->
<!--
Recommended usage conventions for `kubectl`.
-->
`kubectl` 的推荐用法约定


<!-- body -->

<!--
## Using `kubectl` in Reusable Scripts
-->
## 在可重用脚本中使用 `kubectl`

<!--
For a stable output in a script:
-->
对于脚本中的稳定输出：

<!--
* Request one of the machine-oriented output forms, such as `-o name`, `-o json`, `-o yaml`, `-o go-template`, or `-o jsonpath`.
* Fully-qualify the version. For example, `jobs.v1.batch/myjob`. This will ensure that kubectl does not use its default version that can change over time.
* Specify the `--generator` flag to pin to a specific behavior when you use generator-based commands such as `kubectl run` or `kubectl expose`.
* Don't rely on context, preferences, or other implicit states.
-->

* 请求一个面向机器的输出格式，例如 `-o name`、`-o json`、`-o yaml`、`-o go template` 或 `-o jsonpath`。
* 完全限定版本。例如 `jobs.v1.batch/myjob`。这将确保 kubectl 不会使用其默认版本，该版本会随着时间的推移而更改。
* 在使用基于生成器的命令（例如 `kubectl run` 或者 `kubectl expose`）时，指定 `--generator` 参数以固定到特定行为。
* 不要依赖上下文、首选项或其他隐式状态。

<!--
## Best Practices
-->
## 最佳实践

### `kubectl run`

<!--
For `kubectl run` to satisfy infrastructure as code:
-->
若希望 `kubectl run` 满足基础设施即代码的要求：

<!--
* Tag the image with a version-specific tag and don't move that tag to a new version. For example, use `:v1234`, `v1.2.3`, `r03062016-1-4`, rather than `:latest` (For more information, see [Best Practices for Configuration](/docs/concepts/configuration/overview/#container-images)).
* Capture the parameters in a checked-in script, or at least use `--record` to annotate the created objects with the command line for an image that is lightly parameterized.
* Pin to a specific [generator](#generators) version, such as `kubectl run --generator=run-pod/v1`.
* Check in the script for an image that is heavily parameterized.
* Switch to configuration files checked into source control for features that are needed, but not expressible via `kubectl run` flags.
-->

* 使用特定版本的标签标记镜像，不要将该标签移动到新版本。例如，使用 `:v1234`、`v1.2.3`、`r03062016-1-4`，而不是 `:latest`（有关详细信息，请参阅[配置的最佳实践](/docs/concepts/configuration/overview/#container-images))。
* 固定到特定的[生成器](#生成器)版本，例如 `kubectl run --generator=run-pod/v1`。
* 使用基于版本控制的脚本来记录所使用的参数，或者至少使用 `--record` 参数以便为所创建的对象添加注解，在使用轻度参数化的镜像时，记录下所使用的命令行。
* 使用基于版本控制的脚本来运行包含大量参数的镜像。
* 对于无法通过 `kubectl run` 参数来表示的功能特性，使用基于源码控制的配置文件，以记录要使用的功能特性。

<!--
#### Generators
-->
#### 生成器

<!--
You can create the following resources using `kubectl run` with the `--generator` flag:
-->
您可以使用带有 `--generator` 参数的 `kubectl run` 命令创建如下资源：

<!--
{{< table caption="Resources you can create using kubectl run" >}}
| Resource                             | API group          | kubectl command                                   |
|--------------------------------------|--------------------|---------------------------------------------------|
| Pod                                  | v1                 | `kubectl run --generator=run-pod/v1`              |
| ReplicationController _(deprecated)_ | v1                 | `kubectl run --generator=run/v1`                  |
| Deployment _(deprecated)_            | extensions/v1beta1 | `kubectl run --generator=deployment/v1beta1`      |
| Deployment _(deprecated)_            | apps/v1beta1       | `kubectl run --generator=deployment/apps.v1beta1` |
| Job _(deprecated)_                   | batch/v1           | `kubectl run --generator=job/v1`                  |
| CronJob _(deprecated)_               | batch/v2alpha1     | `kubectl run --generator=cronjob/v2alpha1`        |
| CronJob _(deprecated)_               | batch/v1beta1      | `kubectl run --generator=cronjob/v1beta1`         |
{{< /table >}}
-->
{{< table caption="可以使用 kubectl run 创建的资源" >}}
| 资源                             | API 组             | kubectl 命令                                      |
|----------------------------------|--------------------|-------------------------------------------------- |
| Pod                              | v1                 | `kubectl run --generator=run-pod/v1`              |
| ReplicationController _(已弃用)_ | v1                 | `kubectl run --generator=run/v1`                  |
| Deployment _(已弃用)_            | extensions/v1beta1 | `kubectl run --generator=deployment/v1beta1`      |
| Deployment _(已弃用)_            | apps/v1beta1       | `kubectl run --generator=deployment/apps.v1beta1` |
| Job _(已弃用)_                   | batch/v1           | `kubectl run --generator=job/v1`                  |
| CronJob _(已弃用)_               | batch/v2alpha1     | `kubectl run --generator=cronjob/v2alpha1`        |
| CronJob _(已弃用)_               | batch/v1beta1      | `kubectl run --generator=cronjob/v1beta1`         |
{{< /table >}}

{{< note >}}
<!--
Generators other than `run-pod/v1` are deprecated.
 -->不推荐使用 `run-pod/v1` 以外的其他生成器。
{{< /note >}}

<!--
If you explicitly set `--generator`, kubectl uses the generator you specified. If you invoke `kubectl run` and don't specify a generator, kubectl automatically selects which generator to use based on the other flags you set. The following table lists flags and the generators that are activated if you didn't specify one yourself:
-->
如果您显式设置了 `--generator` 参数，kubectl 将使用您指定的生成器。如果使用 `kubectl run` 命令但是未指定生成器，kubectl 会根据您设置的其他参数自动选择要使用的生成器。下表列出了如果您自己未指定参数自动使用与之相匹配的生成器：

<!--
{{< table caption="kubectl run flags and the resource they imply" >}}
| Flag                    | Generated Resource    |
|-------------------------|-----------------------|
| `--schedule=<schedule>` | CronJob               |
| `--restart=Always`      | Deployment            |
| `--restart=OnFailure`   | Job                   |
| `--restart=Never`       | Pod                   |
{{< /table >}}
-->
{{< table caption="kubectl run 参数及其对应的资源" >}}
| 参数                    | 相匹配的资源           |
|-------------------------|-----------------------|
| `--schedule=<schedule>` | CronJob               |
| `--restart=Always`      | Deployment            |
| `--restart=OnFailure`   | Job                   |
| `--restart=Never`       | Pod                   |
{{< /table >}}

<!--
If you don't specify a generator, kubectl pays attention to other flags in the following order:
-->
如果不指定生成器，kubectl 将按以下顺序考虑其他参数：

1. `--schedule`
1. `--restart`

<!--
You can use the `--dry-run` flag to preview the object that would be sent to your cluster, without really submitting it.
-->
您可以使用 `--dry-run` 参数预览要发送到集群的对象，而无需真正提交。

### `kubectl apply`

<!--
* You can use `kubectl apply` to create or update resources. For more information about using kubectl apply to update resources, see [Kubectl Book](https://kubectl.docs.kubernetes.io).
-->

* 您可以使用 `kubectl apply` 命令创建或更新资源。有关使用 kubectl apply 更新资源的详细信息，请参阅 [Kubectl 文档](https://kubectl.docs.kubernetes.io)。


