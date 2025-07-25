---
title: 声明式 API 验证
content_type: concept
weight: 20
---
<!--
title: Declarative API Validation
reviewers:
- aaron-prindle
- yongruilin
- jpbetz
- thockin
content_type: concept
weight: 20
-->

{{< feature-state for_k8s_version="v1.33" state="beta" >}}

<!--
Kubernetes {{< skew currentVersion >}} includes optional _declarative validation_ for APIs. When enabled, the Kubernetes API server can use this mechanism rather than the legacy approach that relies on hand-written Go
code (`validation.go` files) to ensure that requests against the API are valid.
Kubernetes developers, and people [extending the Kubernetes API](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/),
can define validation rules directly alongside the API type definitions (`types.go` files). Code authors define
pecial comment tags (e.g., `+k8s:minimum=0`). A code generator (`validation-gen`) then uses these tags to produce
optimized Go code for API validation.
-->
Kubernetes {{< skew currentVersion >}} 包含可选用于 API的**声明式验证**特性。
当启用时，Kubernetes API 服务器可以使用此机制而不是依赖手写的
Go 代码（`validation.go` 文件）来确保针对 API 的请求是有效的。
Kubernetes 开发者和[扩展 Kubernetes API](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
的人员可以直接在 API 类型定义（`types.go` 文件）旁边定义验证规则。
代码作者定义特殊的注释标签（例如，`+k8s:minimum=0`）。
然后，一个代码生成器（`validation-gen`）会使用这些标签来生成用于 API 验证的优化 Go 代码。

<!--
While primarily a feature impacting Kubernetes contributors and potentially developers of [extension API servers](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/), cluster administrators should understand its behavior, especially during its rollout phases.
-->
虽然这个特性主要影响 Kubernetes
贡献者和潜在的[扩展 API 服务器](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)开发者，
但集群管理员应了解其行为，特别是在其推出阶段。

<!--
Declarative validation is being rolled out gradually.
In Kubernetes {{< skew currentVersion >}}, the APIs that use declarative validation include:

* [ReplicationController](/docs/concepts/workloads/controllers/replicationcontroller/)
-->
声明式验证正在逐步推出。
在 Kubernetes {{< skew currentVersion >}} 中，使用声明式验证的 API 包括：

* [ReplicationController](/zh-cn/docs/concepts/workloads/controllers/replicationcontroller/)

{{< note >}}
<!--
For the beta of this feature, Kubernetes is intentionally using a superseded API as a test bed for the change.
Future Kubernetes releases may roll this out to more APIs.
-->
对于此特性的 Beta 版，Kubernetes 故意使用一个被取代的 API 作为变更的试验场。
未来的 Kubernetes 版本可能会将此更改推广到更多 API。
{{< /note >}}

<!--
*   `DeclarativeValidation`: (Beta, Default: `true`) When enabled, the API server runs *both* the new declarative validation and the old hand-written validation for migrated types/fields. The results are compared internally.
*   `DeclarativeValidationTakeover`: (Beta, Default: `false`) This gate determines which validation result is *authoritative* (i.e., returned to the user and used for admission decisions).
-->
* `DeclarativeValidation：（Beta， 默认值：`true`）当启用时，
   API 服务器对迁移的类型/字段同时运行新的声明式验证和旧的手写验证。结果在内部进行比较。
* `DeclarativeValidationTakeover`**：（Beta， 默认值：`false`）
   此开关决定哪个验证结果是**权威的**（即返回给用户并用于准入决策）。

<!--
**Default Behavior (Kubernetes {{< skew currentVersion >}}):**

*   With `DeclarativeValidation=true` and `DeclarativeValidationTakeover=false` (the default values for the gates), both validation systems run.
*   **The results of the *hand-written* validation are used.** The declarative validation runs in a mismatch mode for comparison.
*   Mismatches between the two validation systems are logged by the API server and increment the `declarative_validation_mismatch_total` metric. This helps developers identify and fix discrepancies during the Beta phase.
*   **Cluster upgrades should be safe** regarding this feature, as the authoritative validation logic doesn't change by default.
-->
**默认行为（Kubernetes {{< skew currentVersion >}}）：**

* 当 `DeclarativeValidation=true` 和 `DeclarativeValidationTakeover=false` （开关的默认值），两种验证系统都会运行。
* **使用手写验证的结果。**声明式验证以不匹配模式运行进行比较。
* 两种验证系统之间的不匹配将由 API 服务器记录，并增加
  `declarative_validation_mismatch_total` 指标。这有助于开发人员在
  Beta 阶段识别并修复不一致之处。
* 关于此特性的**集群升级应该是安全的**，默认情况下权威的验证逻辑不会改变。

<!--
Administrators can choose to explicitly enable `DeclarativeValidationTakeover=true` to make the *declarative* validation authoritative for migrated fields, typically after verifying stability in their environment (e.g., by monitoring the mismatch metric).
-->
管理员可以选择显式启用 `DeclarativeValidationTakeover=true`
以使**声明式**验证对于迁移的字段具有权威性，通常是在验证其环境中的稳定性之后
（例如，通过监控不匹配指标）。

<!--
## Disabling declarative validation {#opt-out}

As a cluster administrator, you might consider disabling declarative validation whilst it is still beta, under specific circumstances:
-->
## 禁用声明式验证 {#opt-out}

作为集群管理员，在特定情况下，你可能会考虑在声明式验证仍然是测试版时禁用它：

<!--
*   **Unexpected Validation Behavior:** If enabling `DeclarativeValidationTakeover` leads to unexpected validation errors or allows objects that were previously invalid.
*   **Performance Regressions:** If monitoring indicates significant latency increases (e.g., in `apiserver_request_duration_seconds`) correlated with the feature's enablement.
*   **High Mismatch Rate:** If the `declarative_validation_mismatch_total` metric shows frequent mismatches, suggesting potential bugs in the declarative rules affecting the cluster's workloads, even if `DeclarativeValidationTakeover` is false.
-->
* **意外的验证行为：** 如果启用 `DeclarativeValidationTakeover`
  导致了未预期的验证错误或允许之前无效的对象。
* **性能回归：** 如果监控显示显著的延迟增加（例如，在 `apiserver_request_duration_seconds` 中），
  且与该特性的启用相关联。
* **不匹配率高：** 如果 `declarative_validation_mismatch_total`
  指标显示出频繁的不匹配，这暗示声明式规则中可能存在影响集群工作负载的潜在错误，
  即使 `DeclarativeValidationTakeover` 为 false。

<!--
To revert to only using hand-written validation (as used before Kubernetes v1.33), disable the `DeclarativeValidation` feature gate, for example
via command-line arguments: (`--feature-gates=DeclarativeValidation=false`). This also implicitly disables the effect of `DeclarativeValidationTakeover`.
-->
要恢复为仅使用手写验证（如 Kubernetes v1.33 之前所用），请禁用
`DeclarativeValidation` 特性门控，例如
通过命令行参数：(`--feature-gates=DeclarativeValidation=false`)。
这也会隐式禁用 `DeclarativeValidationTakeover` 的效果。

<!--
## Considerations for downgrade and rollback

Disabling the feature acts as a safety mechanism. However, be aware of a potential edge case (considered unlikely due to extensive testing): If a bug in declarative validation (when `DeclarativeValidationTakeover=true`) *incorrectly allowed* an invalid object to be persisted, disabling the feature gates might then cause subsequent updates to that specific object to be blocked by the now-authoritative (and correct) hand-written validation. Resolving this might require manual correction of the stored object, potentially via direct etcd modification in rare cases.

For details on managing feature gates, see [Feature Gates](/docs/reference/command-line-tools-reference/feature-gates/).
-->
## 降级和回滚的考虑事项

禁用特性特性充当一种安全机制。然而，要注意一个潜在的极端情况
（由于广泛测试，这种情况被认为是不太可能发生的）：
如果声明式验证中存在一个错误（当 `DeclarativeValidationTakeover=true` 时）
**错误地允许**无效对象被持久化，那么禁用特性门可能会导致后续对该特定对象的更新被现在权威的（且正确的）
手写验证所阻止。解决此问题可能需要手动更正存储的对象，在极少数情况下，可能需要通过直接修改 etcd 来进行。

有关管理特性门控的详细信息，请参阅[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。
