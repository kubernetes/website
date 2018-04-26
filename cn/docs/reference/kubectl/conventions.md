---
approvers:
- bgrant0607
- janetkuo
cn-approvers:
- lichuqiang
title: kubectl 使用规约
---
<!--
---
approvers:
- bgrant0607
- janetkuo
title: kubectl Usage Conventions
---
-->

* TOC
{:toc}

<!--
## Using `kubectl` in Reusable Scripts

If you need stable output in a script, you should:
-->
## 在可复用的脚本中使用 `kubectl`

如果您需要在脚本中提供稳定的输出，您应该：

<!--
* Request one of the machine-oriented output forms, such as `-o name`, `-o json`, `-o yaml`, `-o go-template`, or `-o jsonpath`
-->
* 请求一种面向机器的输出格式，例如 `-o name`、 `-o json`、 `-o yaml`、 `-o go-template` 或 `-o jsonpath`
<!--
* Specify `--output-version`, since those output forms (other than `-o name`) output the resource using a particular API version
-->
* 由于那些输出格式（`-o name` 除外）使用特定 API 版本对资源进行输出，所以需要指定 `--output-version`
<!--
* Specify `--generator` to pin to a specific behavior forever, if using generator-based commands (such as `kubectl run` or `kubectl expose`)
-->
* 如果使用基于 generator 的命令（如 `kubectl run` 或 `kubectl expose`），请指定 --generator 以永远和特定行为绑定。
<!--
* Don't rely on context, preferences, or other implicit state
-->
* 不要依赖上下文、首选项或其他隐式声明。

<!--
## Best Practices
-->
## 最佳实践

### `kubectl run`

<!--
In order for `kubectl run` to satisfy infrastructure as code:
-->
为使 `kubectl run` 满足基础设施即代码（infrastructure as code）的要求：

<!--
* Always tag your image with a version-specific tag and don't move that tag to a new version. For example, use `:v1234`, `v1.2.3`, `r03062016-1-4`, rather than `:latest` (see [Best Practices for Configuration](/docs/concepts/configuration/overview/#container-images) for more information).
-->
* 总是用一个版本特定的标签来标记您的镜像，不要把标签移到新的版本。 例如，使用 `:v1234`、`v1.2.3` 和 `r03062016-1-4` 而不是 `:latest`
（参考 [配置的最佳实践](/docs/concepts/configuration/overview/#container-images) 了解更多信息）。
<!--
* If the image is lightly parameterized, capture the parameters in a checked-in script, or at least use `--record`to annotate the created objects with the command line.
-->
* 如果镜像的参数化程度很低，在检入脚本中捕捉这些参数，或者至少使用命令行 `--record` 来注释创建的对象。
<!--
* If the image is heavily parameterized, definitely check in the script.
-->
* 如果镜像的参数化程度很高，一定要在脚本中检查。
<!--
* If features are needed that are not expressible via `kubectl run` flags, switch to configuration files checked into source control.
-->
* 如果需要一些无法通过 `kubectl run` 参数表达的特性，切换到签入源代码控制的配置文件。
<!--
* Pin to a specific [generator](#generators) version, such as `kubectl run --generator=deployment/v1beta1`.
-->
* 与特定的 [generator](#generators) 版本固定，例如 `kubectl run --generator=deployment/v1beta1`。

#### Generators

<!--
`kubectl run` allows you to generate the following resources (using `--generator` flag):
-->
`kubectl run` 允许您生成以下资源（使用 `--generator` 参数）：

<!--
* Pod - use `run-pod/v1`.
-->
* Pod - 使用 `run-pod/v1`。
<!--
* Replication controller - use `run/v1`.
-->
* Replication controller - 使用 `run/v1`。
<!--
* Deployment, using `extensions/v1beta1` endpoint - use `deployment/v1beta1` (default).
-->
* Deployment，使用 `extensions/v1beta1` 端点 - 使用 `deployment/v1beta1`（默认）。
<!--
* Deployment, using `apps/v1beta1` endpoint - use `deployment/apps.v1beta1` (recommended).
-->
* Deployment，使用 `apps/v1beta1` 端点 - 使用 `deployment/apps.v1beta1`（推荐）。
<!--
* Job - use `job/v1`.
-->
* Job - 使用 `job/v1`。
<!--
* CronJob - using `batch/v1beta1` endpoint - use `cronjob/v1beta1`(default).
-->
* CronJob - 使用 `batch/v1beta1` 端点 - 使用 `cronjob/v1beta1`（默认）。
<!--
* CronJob - using `batch/v2alpha1` endpoint - use `cronjob/v2alpha1` (deprecated).
-->
* CronJob - 使用 `batch/v2alpha1` 端点 - 使用 `cronjob/v2alpha1`（弃用）。

<!--
Additionally, if you didn't specify a generator flag, other flags will suggest using
a specific generator.  Below table shows which flags force using specific generators,
depending on your cluster version:
-->
此外，如果没有指定 generator 参数，其他参数会推荐使用特定的 generator。 
下面的表格展示了根据集群版本，哪些参数强制使用特定的 generator：

<!--
|   Generated Resource   | Cluster v1.4 and later | Cluster v1.3          | Cluster v1.2                               | Cluster v1.1 and earlier                   |
|:----------------------:|------------------------|-----------------------|--------------------------------------------|--------------------------------------------|
| Pod                    | `--restart=Never`      | `--restart=Never`     | `--generator=run-pod/v1`                   | `--restart=OnFailure` OR `--restart=Never` |
| Replication Controller | `--generator=run/v1`   | `--generator=run/v1`  | `--generator=run/v1`                       | `--restart=Always`                         |
| Deployment             | `--restart=Always`     | `--restart=Always`    | `--restart=Always`                         | N/A                                        |
| Job                    | `--restart=OnFailure`  | `--restart=OnFailure` | `--restart=OnFailure` OR `--restart=Never` | N/A                                        |
| Cron Job               | `--schedule=<cron>`    | N/A                   | N/A                                        | N/A                                        |
-->
|   生成的资源            | 1.4 或更高版本的集群     | 1.3 版本的集群          | 1.2 版本的集群                              | 1.1 或更低版本的集群                         |
|:----------------------:|------------------------|-----------------------|--------------------------------------------|--------------------------------------------|
| Pod                    | `--restart=Never`      | `--restart=Never`     | `--generator=run-pod/v1`                   | `--restart=OnFailure` 或 `--restart=Never` |
| Replication Controller | `--generator=run/v1`   | `--generator=run/v1`  | `--generator=run/v1`                       | `--restart=Always`                         |
| Deployment             | `--restart=Always`     | `--restart=Always`    | `--restart=Always`                         | N/A                                        |
| Job                    | `--restart=OnFailure`  | `--restart=OnFailure` | `--restart=OnFailure` 或 `--restart=Never` | N/A                                        |
| Cron Job               | `--schedule=<cron>`    | N/A                   | N/A                                        | N/A                                        |

<!--
Note that these flags will use a default generator only when you have not specified
any flag.  This also means that combining `--generator` with other flags won't
change the generator you specified. For example, in a 1.4 cluster, if you specify
`--restart=Always`, a Deployment will be created; if you specify `--restart=Always`
and `--generator=run/v1`, a Replication Controller will be created instead.
-->
注意：这些参数只有在您没有指定任何参数的情况下，才会使用默认 generator。 这也意味着把
`--generator` 和其他参数组合到一起不会改变您指定的 generator。 例如在 1.4 版本的集群中，
如果您指定了 `--restart=Always`，将会创建一个 Deployment，如果您指定了 `--restart=Always`
和 `--generator=run/v1`，将会创建一个 Replication Controller。
<!--
This becomes handy if you want to pin to a specific behavior with the generator,
even when the defaulted generator is changed in the future.
-->
这在您想要将 generator 与特定行为固定的时候非常方便，即使将来默认 generator 发生变化。

<!--
Finally, the order in which flags set the generator is: schedule flag has the highest
priority, then restart policy and finally the generator itself.
-->
最后，这些参数设置 generator 的顺序为：schedule 参数具有最高的优先级，然后是 restart 策略，
最后是 generator 本身。

<!--
If in doubt about the final resource being created, you can always use `--dry-run`
flag, which will provide the object to be submitted to the cluster.
-->
如果对最终创建的资源有疑问，您可以始终使用 `--dry-run` 参数，它会提供要提交给集群的对象。


### `kubectl apply`

<!--
* To use `kubectl apply` to update resources, always create resources initially with `kubectl apply` or with `--save-config`. See [managing resources with kubectl apply](/docs/concepts/cluster-administration/manage-deployment/#kubectl-apply) for the reason behind it.
-->
* 为使用 `kubectl apply` 来更新资源，最初总是使用 `kubectl apply` 或 `--save-config` 来创建资源。 查看 [使用 kubectl apply 管理资源](/docs/concepts/cluster-administration/manage-deployment/#kubectl-apply) 来了解背后的原因。
