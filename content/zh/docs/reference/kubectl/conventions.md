---
title: kubectl 使用约定
reviewers:
- janetkuo
content_template: templates/concept
---

{{% capture overview %}}

<!--
Recommended usage conventions for `kubectl`.
-->

推荐的 kubectl 命令使用约定
{{% /capture %}}

{{% capture body %}}

<!--
## Using `kubectl` in Reusable Scripts
-->

## 在可重用脚本中使用 kubectl 命令

<!--
For a stable output in a script:
-->

在脚本中执行时稳定输出

<!--
* Request one of the machine-oriented output forms, such as `-o name`, `-o json`, `-o yaml`, `-o go-template`, or `-o jsonpath`.
* Fully-qualify the version. For example, `jobs.v1.batch/myjob`. This will ensure that kubectl does not use its default version that can change over time.
* Specify the `--generator` flag to pin to a specific behavior when you use generator-based commands such as `kubectl run` or `kubectl expose`.
* Don't rely on context, preferences, or other implicit states.
-->

* 需要一种面向机器的输出格式，比如 `-o name`,`-o json`,`-o yaml`,`-o go-template`,或者 `-o jsonpath`。
* 完全限定版本号。比如，`jobs.v1.batch/myjob`。这将确保 kubectl 不使用默认版本（随时间推移而变化）。
* 当使用基于 generator 的命令，如 `kubectl run` 或者 `kubectl expose` 时，指定 `--generator` 标识来锁定特定行为。
* 不要依赖上下文、引用或者其它隐形的状态。

<!--
## Best Practices
-->

## 最佳实践

### `kubectl run`

<!--
For `kubectl run` to satisfy infrastructure as code:
-->

kubectl run 命令满足基础设施即代码

<!--
* Tag the image with a version-specific tag and don't move that tag to a new version. For example, use `:v1234`, `v1.2.3`, `r03062016-1-4`, rather than `:latest` (For more information, see [Best Practices for Configuration](/docs/concepts/configuration/overview/#container-images)).
* Capture the parameters in a checked-in script, or at least use `--record` to annotate the created objects with the command line for an image that is lightly parameterized.
* Check in the script for an image that is heavily parameterized.
* Switch to configuration files checked into source control for features that are needed, but not expressible via `kubectl run` flags.
* Pin to a specific [generator](#generators) version, such as `kubectl run --generator=deployment/v1beta1`.
-->

* 给镜像打标签时使用指定版本的标签，并且不要把标签打到到新的镜像上。比如使用 `:v1234`,`v1.2.3`,`r03062016-1-4`,而不是 `:latest`（更多信息，参考 [配置最佳实践](/zh/docs/concepts/configuration/overview/#container-images)）。
* 捕获签入脚本中的参数，或者最少使用带有 `--record` 参数来标注那些为轻量参数化的镜像而用命令行创建的对象。
* 在脚本中检入参数化严重的镜像。
* 为那些需要不容易通过 `kubectl run` 参数来表达的特性，切换到已签入源代码管理的配置文件。
* 固定到特定的 [generator](#generators) 版本，比如 `kubectl run --generator=deployment/v1beta1`。

#### Generators

<!--
You can create the following resources using `kubectl run` with the `--generator` flag:
-->

使用带有 `--generator` 参数的 `kubectl run` 命令来创建下面的资源：

| Resource                            | api group          | kubectl command                                   |
|-------------------------------------|--------------------|---------------------------------------------------|
| Pod                                 | v1                 | `kubectl run --generator=run-pod/v1`              |
| Replication controller (deprecated) | v1                 | `kubectl run --generator=run/v1`                  |
| Deployment (deprecated)             | extensions/v1beta1 | `kubectl run --generator=deployment/v1beta1`      |
| Deployment (deprecated)             | apps/v1beta1       | `kubectl run --generator=deployment/apps.v1beta1` |
| Job (deprecated)                    | batch/v1           | `kubectl run --generator=job/v1`                  |
| CronJob (deprecated)                | batch/v1beta1      | `kubectl run --generator=cronjob/v1beta1`         |
| CronJob (deprecated)                | batch/v2alpha1     | `kubectl run --generator=cronjob/v2alpha1`        |

{{< note >}}
<!--
`kubectl run --generator` except for `run-pod/v1` is deprecated in v1.12.
-->
`kubectl run --generator`（除了 `run-pod/v1`）在 v1.12 版本中已 deprecated。
{{< /note >}}

<!--
If you do not specify a generator flag, other flags prompt you to use a specific generator. The following table lists the flags that force you to use specific generators, depending on the version of the cluster:
-->

如果未指定一个 generator 标志，其他标志提示你使用一个特定的 generator。下表列出强制你使用特定 generators 的标志，取决于集群的版本好：

|   Generated Resource   | Cluster v1.4 and later | Cluster v1.3          | Cluster v1.2                               | Cluster v1.1 and earlier                   |
|:----------------------:|------------------------|-----------------------|--------------------------------------------|--------------------------------------------|
| Pod                    | `--restart=Never`      | `--restart=Never`     | `--generator=run-pod/v1`                   | `--restart=OnFailure` OR `--restart=Never` |
| Replication Controller | `--generator=run/v1`   | `--generator=run/v1`  | `--generator=run/v1`                       | `--restart=Always`                         |
| Deployment             | `--restart=Always`     | `--restart=Always`    | `--restart=Always`                         | N/A                                        |
| Job                    | `--restart=OnFailure`  | `--restart=OnFailure` | `--restart=OnFailure` OR `--restart=Never` | N/A                                        |
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

当没有指定任何标志时，这些标志将使用默认的 generator。这意味着当将 `--generator` 与其他标志结合使用时，以后指定的 generator 不会更改。比如，在 v1.4 集群中，如果初始指定 `--restart=Always`，一个 Deployment 将创建；如果后面再指定 `--restart=Always` 和 `--generator=run/v1`，一个 Replication 控制器将创建。这样确保即使以后更改了默认 generator，也可以使用 generator 来锁定特定行为。

{{< /note >}}

<!--
The flags set the generator in the following order: first the `--schedule` flag, then the `--restart` policy flag, and finally the `--generator` flag.
-->

标志按照下面的顺序对 generator 进行设置：首先是 `--schedule` 标志，然后是 `--restart` 策略标志，最后是 `--generator` 标志。

<!--
To check the final resource that was created, use the `--dry-run`
flag, which only prints the object that would be sent to the cluster without really sending it.
-->

检查最后创建的资源，可以使用 `--dry-run` 标志，该标志只会打印发送到集群的对象，而不是真正的发送。

### `kubectl apply`

<!--
* You can use `kubectl apply` to create or update resources. For more information about using kubectl apply to update resources, see [Kubectl Book](https://kubectl.docs.kubernetes.io).
-->

* 使用 `kubectl apply` 来创建或者更新资源。获取更多关于使用 kubectl apply 来更新资源，请参考 [Kubectl Book](https://kubectl.docs.kubernetes.io)。

{{% /capture %}}
