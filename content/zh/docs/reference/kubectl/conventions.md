---
title: kubectl 的用法约定
reviewers:
- janetkuo
content_template: templates/concept
---

<!--
---
title: kubectl Usage Conventions
reviewers:
- janetkuo
content_template: templates/concept
---
-->

{{% capture overview %}}
<!--
Recommended usage conventions for `kubectl`.
-->
`kubectl` 的推荐用法约定
{{% /capture %}}

{{% capture body %}}

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
* Check in the script for an image that is heavily parameterized.
* Switch to configuration files checked into source control for features that are needed, but not expressible via `kubectl run` flags.
* Pin to a specific [generator](#generators) version, such as `kubectl run --generator=deployment/v1beta1`.
-->

* 使用特定版本的标签标记镜像，不要将该标签移动到新版本。例如，使用 `:v1234`、`v1.2.3`、`r03062016-1-4`，而不是 `:latest`（有关详细信息，请参阅[配置的最佳实践](/docs/concepts/configuration/overview/#container-images))。
* 使用基于版本控制的脚本来记录所使用的参数，或者至少使用 `--record` 参数以便为所创建的对象添加注解，在使用轻度参数化的镜像时，记录下所使用的命令行。
* 使用基于版本控制的脚本来运行包含大量参数的镜像。
* 对于无法通过 `kubectl run` 参数来表示的功能特性，使用基于源码控制的配置文件，以记录要使用的功能特性。
* 固定到特定的[生成器](#生成器)版本，例如 `kubectl run --generator=deployment/v1beta1`。

<!--
#### Generators
-->
#### 生成器

<!--
You can create the following resources using `kubectl run` with the `--generator` flag:
-->
您可以使用带有 `--generator` 参数的 `kubectl run` 命令创建如下资源：

<!--
| Resource                            | api group          | kubectl command                                   |
|-------------------------------------|--------------------|---------------------------------------------------|
| Pod                                 | v1                 | `kubectl run --generator=run-pod/v1`              |
| Replication controller (deprecated) | v1                 | `kubectl run --generator=run/v1`                  |
| Deployment (deprecated)             | extensions/v1beta1 | `kubectl run --generator=deployment/v1beta1`      |
| Deployment (deprecated)             | apps/v1beta1       | `kubectl run --generator=deployment/apps.v1beta1` |
| Job (deprecated)                    | batch/v1           | `kubectl run --generator=job/v1`                  |
| CronJob (deprecated)                | batch/v1beta1      | `kubectl run --generator=cronjob/v1beta1`         |
| CronJob (deprecated)                | batch/v2alpha1     | `kubectl run --generator=cronjob/v2alpha1`        |
-->

| 资源                            | api 组          | kubectl 命令                                   |
|-------------------------------------|--------------------|---------------------------------------------------|
| Pod                                 | v1                 | `kubectl run --generator=run-pod/v1`              |
| Replication controller (过期)) | v1                 | `kubectl run --generator=run/v1`                  |
| Deployment (过期)             | extensions/v1beta1 | `kubectl run --generator=deployment/v1beta1`      |
| Deployment (过期)             | apps/v1beta1       | `kubectl run --generator=deployment/apps.v1beta1` |
| Job (过期)                    | batch/v1           | `kubectl run --generator=job/v1`                  |
| CronJob (过期)                | batch/v1beta1      | `kubectl run --generator=cronjob/v1beta1`         |
| CronJob (过期)                | batch/v2alpha1     | `kubectl run --generator=cronjob/v2alpha1`        |

<!-- {{< note >}}
`kubectl run --generator` except for `run-pod/v1` is deprecated in v1.12.
{{< /note >}} -->
{{< note >}}
v1.12 中不建议使用 `run-pod/v1` 以外的 `kubectl run --generator`。
{{< /note >}}

<!--
If you do not specify a generator flag, other flags prompt you to use a specific generator. The following table lists the flags that force you to use specific generators, depending on the version of the cluster:
-->
如果不指定 generator 参数，其他参数将提示您使用特定的生成器。下表列出了强制您使用特定生成器的参数，具体取决于集群的版本：

<!--
|   Generated Resource   | Cluster v1.4 and later | Cluster v1.3          | Cluster v1.2                               | Cluster v1.1 and earlier                   |
|:----------------------:|------------------------|-----------------------|--------------------------------------------|--------------------------------------------|
| Pod                    | `--restart=Never`      | `--restart=Never`     | `--generator=run-pod/v1`                   | `--restart=OnFailure` OR `--restart=Never` |
| Replication Controller | `--generator=run/v1`   | `--generator=run/v1`  | `--generator=run/v1`                       | `--restart=Always`                         |
| Deployment             | `--restart=Always`     | `--restart=Always`    | `--restart=Always`                         | N/A                                        |
| Job                    | `--restart=OnFailure`  | `--restart=OnFailure` | `--restart=OnFailure` OR `--restart=Never` | N/A                                        |
| Cron Job               | `--schedule=<cron>`    | N/A                   | N/A                                        | N/A                                        |
-->

|   生成的资源            | 集群版本 v1.4 及以后版本 | 集群版本 v1.3          | 集群版本 v1.2                               | 集群版本 v1.1 及更早                   |
|:----------------------:|------------------------|-----------------------|--------------------------------------------|--------------------------------------------|
| Pod                    | `--restart=Never`      | `--restart=Never`     | `--generator=run-pod/v1`                   | `--restart=OnFailure` 或 `--restart=Never` |
| Replication Controller | `--generator=run/v1`   | `--generator=run/v1`  | `--generator=run/v1`                       | `--restart=Always`                         |
| Deployment             | `--restart=Always`     | `--restart=Always`    | `--restart=Always`                         | N/A                                        |
| Job                    | `--restart=OnFailure`  | `--restart=OnFailure` | `--restart=OnFailure` 或 `--restart=Never` | N/A                                        |
| Cron Job               | `--schedule=<cron>`    | N/A                   | N/A                                        | N/A                                        |

{{< note >}}
<!--
These flags use a default generator only when you have not specified any flag.
This means that when you combine `--generator` with other flags the generator that you specified later does not change. For example, in a cluster v1.4, if you initially specify
`--restart=Always`, a Deployment is created; if you later specify `--restart=Always`
and `--generator=run/v1`, a Replication Controller is created.
This enables you to pin to a specific behavior with the generator,
even when the default generator is changed later.
-->
只有在未指定任何参数时，这些参数才使用默认生成器。
这意味着，当您将 `--generator` 与其他参数组合时，随后指定的生成器不会更改。
例如，在集群版本 v1.4 中，如果最初指定了 `--restart=always`，则会创建 Deployment；如果后来指定了 `--restart=always` 和 `--generator=run/v1`，则会创建 Replication Controller。
这使您能够将生成器固定到特定的行为，即使在以后更改默认生成器时也是如此。
{{< /note >}}

<!--
The flags set the generator in the following order: first the `--schedule` flag, then the `--restart` policy flag, and finally the `--generator` flag.
-->
这些参数按以下顺序设置生成器：首先是 `--schedule` 参数，然后是 `--restart` 策略参数，最后是 `--generator` 参数。

<!--
To check the final resource that was created, use the `--dry-run`
flag, which provides the object to be submitted to the cluster.
-->
要检查最终所创建的资源，请使用 `--dry run` 参数；该参数可以提供将要提交到集群的对象。

### `kubectl apply`

<!--
* You can use `kubectl apply` to create or update resources. For more information about using kubectl apply to update resources, see [Kubectl Book](https://kubectl.docs.kubernetes.io).
-->

* 您可以使用 `kubectl apply` 命令创建或更新资源。有关使用 kubectl apply 更新资源的详细信息，请参阅 [Kubectl 文档](https://kubectl.docs.kubernetes.io)。

{{% /capture %}}
