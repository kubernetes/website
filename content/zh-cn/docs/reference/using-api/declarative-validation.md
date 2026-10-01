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

<!-- overview -->

{{< feature-state feature_gate_name="DeclarativeValidation" >}}

<!--
Kubernetes {{< skew currentVersion >}} uses _declarative validation_ for a
growing set of APIs. Instead of hand-written Go code (`validation.go`), API
authors declare validation rules as comment tags on the type definitions
(`types.go`), for example `+k8s:minimum=0`. A code generator,
`validation-gen`, turns those tags into validation code.

This mainly affects Kubernetes contributors and authors of
[extension API servers](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/),
but cluster administrators should know how it behaves while existing
hand-written validation is being migrated.
-->
Kubernetes {{< skew currentVersion >}} 对越来越多的 API 使用**声明式验证**（declarative validation）。
API 作者不再编写手写的 Go 代码（`validation.go`），
而是在类型定义（`types.go`）上以注释标签的形式声明验证规则，例如 `+k8s:minimum=0`。
代码生成器 `validation-gen` 会将这些标签转换为验证代码。

这主要影响 Kubernetes 贡献者和[扩展 API 服务器](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)的作者，
但在现有手写验证的迁移期间，集群管理员也应了解其行为。

<!-- body -->

<!--
## Validation lifecycle {#lifecycle}

On new API fields, use a tag directly, such as `+k8s:minimum=1`. These are
always enforced.

Migrating an *existing* hand-written validation is riskier, because the
generated code must behave exactly like the code it replaces. Those migrations
wrap the tag in a _lifecycle prefix_ (`+k8s:alpha` or `+k8s:beta`) that controls
whether the declarative result is authoritative.
-->
## 验证生命周期   {#lifecycle}

对于新增的 API 字段，直接使用标签即可，例如 `+k8s:minimum=1`。这类标签始终生效。

迁移**现有的**手写验证风险更高，因为生成的代码必须与其所替代的代码行为完全一致。
此类迁移会将标签包装在**生命周期前缀**（lifecycle prefix，即 `+k8s:alpha` 或 `+k8s:beta`）中，
由前缀控制声明式验证的结果是否具有权威性。

<!--
Behavior of a declarative validation tag by lifecycle prefix
-->
{{< table caption="声明式验证标签在不同生命周期前缀下的行为" >}}

<!--
| Tag form | Behavior |
| --- | --- |
| `+k8s:minimum=1` (no prefix) | **Enforced.** The declarative result is authoritative. |
| `+k8s:beta(since:"1.37")=+k8s:minimum=1` | **Enforced** when the `DeclarativeValidationBeta` feature gate is enabled (the default), and shadowed otherwise. |
| `+k8s:alpha(since:"1.36")=+k8s:minimum=1` | **Always shadowed.** Hand-written validation remains authoritative. |
-->
| 标签形式 | 行为 |
| --- | --- |
| `+k8s:minimum=1`（无前缀） | **生效**。声明式验证的结果具有权威性。 |
| `+k8s:beta(since:"1.37")=+k8s:minimum=1` | 在 `DeclarativeValidationBeta` 特性门控启用时（默认）**生效**，否则处于影子模式。 |
| `+k8s:alpha(since:"1.36")=+k8s:minimum=1` | **始终处于影子模式**。手写验证仍具有权威性。 |

{{< /table >}}

<!--
In _shadow mode_, declarative validation still runs, but the API server does not
return its errors. It compares them against the hand-written errors and logs and
counts any difference, so a migrated rule can be evaluated on a live cluster
before it starts rejecting requests.
-->
在**影子模式**（shadow mode）下，声明式验证仍然运行，但 API 服务器不会返回其错误。
API 服务器会将这些错误与手写验证的错误进行比较，并记录和统计所有差异，
这样迁移后的规则可以先在真实集群上得到评估，然后再开始拒绝请求。

<!--
## Feature gates

* [`DeclarativeValidation`](/docs/reference/command-line-tools-reference/feature-gates/#DeclarativeValidation):
  makes the {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}
  compare declarative and hand-written results for `+k8s:alpha` and `+k8s:beta`
  rules and report mismatches. Declarative validation runs either way; this gate
  only controls reporting.

* [`DeclarativeValidationBeta`](/docs/reference/command-line-tools-reference/feature-gates/#DeclarativeValidationBeta):
  the global safety switch for `+k8s:beta` rules. Enabled, they are enforced;
  disabled, they fall back to shadow mode.

* [`DeclarativeValidationTakeover`](/docs/reference/command-line-tools-reference/feature-gates/#DeclarativeValidationTakeover):
  replaced by `DeclarativeValidationBeta` and no longer honored. Setting it is
  still accepted.
-->
## 特性门控   {#feature-gates}

* [`DeclarativeValidation`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#DeclarativeValidation)：
  使 {{< glossary_tooltip text="API 服务器" term_id="kube-apiserver" >}}
  针对 `+k8s:alpha` 和 `+k8s:beta` 规则比较声明式验证与手写验证的结果，并报告不匹配之处。
  无论此门控是否启用，声明式验证都会运行；此门控仅控制是否报告。

* [`DeclarativeValidationBeta`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#DeclarativeValidationBeta)：
  `+k8s:beta` 规则的全局安全开关。启用时，这些规则生效；禁用时，它们回退到影子模式。

* [`DeclarativeValidationTakeover`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#DeclarativeValidationTakeover)：
  已被 `DeclarativeValidationBeta` 取代，不再生效。设置此门控仍然会被接受。

{{< alert color="info" title="Note" >}}
<!--
No gate affects unprefixed tags. The API server always enforces those, because
their hand-written counterparts are already gone.
-->
没有任何门控会影响无前缀的标签。这些标签在 API 服务器中始终生效，
因为与之对应的手写验证已经被移除。
{{< /alert >}}

<!--
See [Feature Gates](/docs/reference/command-line-tools-reference/feature-gates/)
for how to set them.
-->
关于如何设置特性门控，请参阅[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。

<!--
## Monitoring declarative validation {#metrics}

The API server exposes these metrics:
-->
## 监控声明式验证   {#metrics}

API 服务器暴露以下指标：

<!--
Metrics for declarative validation
-->
{{< table caption="声明式验证的指标" >}}

<!--
| Metric | Description |
| --- | --- |
| `declarative_validation_mismatch_total` | Number of times declarative validation results differed from hand-written validation results. |
| `declarative_validation_parity_discrepancies_total` | The same discrepancies, with a `validation_identifier` label that records the group, version, kind, subresource, and operation. |
| `declarative_validation_panic_total` | Number of times declarative validation panicked. |
| `declarative_validation_panics_total` | The same panics, with a `validation_identifier` label. |
-->
| 指标 | 描述 |
| --- | --- |
| `declarative_validation_mismatch_total` | 声明式验证结果与手写验证结果不一致的次数。 |
| `declarative_validation_parity_discrepancies_total` | 同样的不一致，但带有 `validation_identifier` 标签，记录组、版本、类别、子资源和操作。 |
| `declarative_validation_panic_total` | 声明式验证发生 panic 的次数。 |
| `declarative_validation_panics_total` | 同样的 panic，但带有 `validation_identifier` 标签。 |

{{< /table >}}

<!--
Mismatches are also logged. For an enforced (`+k8s:beta`) rule, the log entry
suggests disabling `DeclarativeValidationBeta` to keep data in etcd consistent
with earlier versions of Kubernetes.
-->
不匹配的情况也会被记录到日志中。对于已生效的（`+k8s:beta`）规则，
日志条目会建议禁用 `DeclarativeValidationBeta`，
以使 etcd 中的数据与早期版本的 Kubernetes 保持一致。

<!--
## Disabling DeclarativeValidationBeta {#opt-out}

Consider setting `DeclarativeValidationBeta=false` if you see:

* **Unexpected validation behavior:** requests rejected that should be valid, or
  objects accepted that were previously rejected.

* **Performance regressions:** latency increases (for example, in
  `apiserver_request_duration_seconds`) that correlate with the feature.

* **A high mismatch rate:** frequent `declarative_validation_mismatch_total`
  increments affecting your workloads.

To revert `+k8s:beta` rules to shadow mode, pass
`--feature-gates=DeclarativeValidationBeta=false`.
-->
## 禁用 DeclarativeValidationBeta   {#opt-out}

如果你观察到以下情况，可以考虑设置 `DeclarativeValidationBeta=false`：

* **意外的验证行为**：本应有效的请求被拒绝，或者之前被拒绝的对象被接受。

* **性能下降**：与此特性相关的延迟增加（例如 `apiserver_request_duration_seconds` 的增加）。

* **不匹配率高**：`declarative_validation_mismatch_total` 频繁增加并影响你的工作负载。

要将 `+k8s:beta` 规则恢复为影子模式，请传递 `--feature-gates=DeclarativeValidationBeta=false`。

<!--
## Considerations for downgrade and rollback

Disabling the gate is a safety mechanism, but note one unlikely edge case: if a
bug let declarative validation persist an invalid object, disabling the gate
makes the correct hand-written validation authoritative again, which can then
block further updates to that object. Fixing it may require editing the stored
object directly.
-->
## 降级和回滚的考虑事项   {#considerations-for-downgrade-and-rollback}

禁用该门控是一种安全机制，但请注意一种不太可能出现的极端情况：
如果某个缺陷导致声明式验证持久化了一个无效对象，那么禁用该门控后，
正确的手写验证会重新成为权威验证，进而可能阻止对该对象的后续更新。
修复此问题可能需要直接编辑所存储的对象。

<!--
## Declarative validation tags {#declarative-validation-tag-reference}

### How to read this reference {#how-to-read}

Each tag has a **stability level** — Alpha, Beta, or Stable — describing the
maturity of the *tag itself*. This is separate from the `+k8s:alpha` and
`+k8s:beta` [lifecycle prefixes](#lifecycle), which describe the maturity of one
*use* of a tag.

The generator's linter uses the stability level to decide where a tag is
allowed:
-->
## 声明式验证标签   {#declarative-validation-tag-reference}

### 如何阅读本参考   {#how-to-read}

每个标签都有一个**稳定性级别**（Alpha、Beta 或 Stable），用于描述**标签本身**的成熟度。
这与 `+k8s:alpha` 和 `+k8s:beta` [生命周期前缀](#lifecycle)不同，
后者描述的是标签的某一次**使用**的成熟度。

生成器的代码检查器（linter）根据稳定性级别决定标签可以出现的位置：

<!--
* In a GA package (for example, `v1`), an unprefixed tag must be Stable.

* In a `beta` package, unprefixed Beta tags are also allowed.

* In an `alpha` package, unprefixed Alpha and Beta tags are also allowed.

* Inside `+k8s:alpha=...`, Alpha tags are allowed; inside `+k8s:beta=...`, Beta
  tags are.

* Inside `+k8s:ifEnabled(...)` or `+k8s:ifDisabled(...)`, Beta tags are allowed
  even in a GA package, because an option already gates the validation.

Each entry also lists the **scopes** where the tag can appear: struct fields,
type definitions, list values, map keys, map values, or constant values.
-->
* 在 GA 包（例如 `v1`）中，无前缀的标签必须是 Stable 级别。

* 在 `beta` 包中，还允许使用无前缀的 Beta 标签。

* 在 `alpha` 包中，还允许使用无前缀的 Alpha 和 Beta 标签。

* 在 `+k8s:alpha=...` 内部允许使用 Alpha 标签；在 `+k8s:beta=...` 内部允许使用 Beta 标签。

* 在 `+k8s:ifEnabled(...)` 或 `+k8s:ifDisabled(...)` 内部，即使在 GA 包中也允许使用 Beta 标签，
  因为已经有一个选项对该验证进行了门控。

每个条目还列出了标签可以出现的**作用域**：结构体字段、类型定义、列表值、映射键、映射值或常量值。

{{< alert color="info" title="Note" >}}
<!--
The generator also registers tags that exist only to test itself
(`+k8s:validateTrue`, `+k8s:validateFalse`, `+k8s:validateError`,
`+k8s:validateTrueAlpha`, `+k8s:validateTrueBeta`). Do not use them in API
definitions. For the authoritative list for a given release, run
`validation-gen --docs` from `k8s.io/code-generator`.
-->
生成器还注册了一些仅用于测试其自身的标签（`+k8s:validateTrue`、`+k8s:validateFalse`、
`+k8s:validateError`、`+k8s:validateTrueAlpha`、`+k8s:validateTrueBeta`）。
不要在 API 定义中使用它们。要获取特定版本的权威标签列表，
请在 `k8s.io/code-generator` 中运行 `validation-gen --docs`。
{{< /alert >}}

<!--
### Tag catalog {#catalog}

Declarative validation tags
-->
### 标签目录   {#catalog}

{{< table caption="声明式验证标签" >}}

<!--
| Tag | Description | Stability |
| --- | --- | --- |
| [`+k8s:alpha`](#tag-alpha) | Puts a validation tag in shadow mode (metrics only). | Beta |
| [`+k8s:beta`](#tag-beta) | Puts a validation tag in enforced mode (disableable through `DeclarativeValidationBeta`). | Beta |
| [`+k8s:customUnique`](#tag-customUnique) | Indicates that hand-written validation checks uniqueness for a list. | Stable |
| [`+k8s:customValidation`](#tag-customValidation) | Calls a hand-written validation function from the generated traversal code. | Stable |
| [`+k8s:dependentForbidden`](#tag-dependentForbidden) | Indicates that when this field is set, a named sibling field must not be set. | Alpha |
| [`+k8s:dependentRequired`](#tag-dependentRequired) | Indicates that when this field is set, a named sibling field must also be set. | Alpha |
| [`+k8s:eachKey`](#tag-eachKey) | Declares a validation for each key in a map. | Stable |
| [`+k8s:eachVal`](#tag-eachVal) | Declares a validation for each value in a map or list. | Stable |
| [`+k8s:enum`](#tag-enum) | Indicates that a string type is an enum. | Stable |
| [`+k8s:enumExclude`](#tag-enumExclude) | Excludes a constant from its type's enum values. | Alpha |
| [`+k8s:forbidden`](#tag-forbidden) | Indicates that a field may not be specified. | Beta |
| [`+k8s:format`](#tag-format) | Indicates that a string field has a particular format. | Stable |
| [`+k8s:ifDisabled`](#tag-ifDisabled) | Declares a validation that only applies when an option is disabled. | Stable |
| [`+k8s:ifEnabled`](#tag-ifEnabled) | Declares a validation that only applies when an option is enabled. | Stable |
| [`+k8s:ifMode`](#tag-ifMode) | Declares a validation that only applies for a given value of a mode discriminator. | Stable |
| [`+k8s:immutable`](#tag-immutable) | Indicates that a field may not be updated. | Stable |
| [`+k8s:isSubresource`](#tag-isSubresource) | Specifies that validations in a package only apply to a specific subresource. | Stable |
| [`+k8s:item`](#tag-item) | Declares a validation for an item of a slice declared as a `+k8s:listType=map`. | Stable |
| [`+k8s:listMapKey`](#tag-listMapKey) | Declares a named sub-field of a list's value-type to be part of the list-map key. | Stable |
| [`+k8s:listType`](#tag-listType) | Declares a list field's semantic type. | Stable |
| [`+k8s:maxBytes`](#tag-maxBytes) | Indicates that a string field has a limit on its length in bytes. | Stable |
| [`+k8s:maxItems`](#tag-maxItems) | Indicates that a list has a limit on its size. | Stable |
| [`+k8s:maxLength`](#tag-maxLength) | Indicates that a string field has a limit on its length in characters. | Stable |
| [`+k8s:maxProperties`](#tag-maxProperties) | Indicates that a map has a limit on the number of entries. | Stable |
| [`+k8s:maximum`](#tag-maximum) | Indicates that a numeric field has a maximum value. | Stable |
| [`+k8s:minItems`](#tag-minItems) | Indicates that a list has a minimum size. | Stable |
| [`+k8s:minLength`](#tag-minLength) | Indicates that a string field has a minimum length in characters. | Stable |
| [`+k8s:minProperties`](#tag-minProperties) | Indicates that a map has a minimum number of entries. | Stable |
| [`+k8s:minimum`](#tag-minimum) | Indicates that a numeric field has a minimum value. | Stable |
| [`+k8s:modeDiscriminator`](#tag-modeDiscriminator) | Indicates that this field is a discriminator for state-based validation. | Stable |
| [`+k8s:monotonic`](#tag-monotonic) | Ensures that a field's value never decreases on update. | Alpha |
| [`+k8s:neq`](#tag-neq) | Verifies that the field's value is not equal to a specific disallowed value. | Alpha |
| [`+k8s:opaqueType`](#tag-opaqueType) | Indicates that the generator ignores any validations declared on the referenced type. | Stable |
| [`+k8s:optional`](#tag-optional) | Indicates that a field is optional to clients. | Stable |
| [`+k8s:required`](#tag-required) | Indicates that a field must be specified by clients. | Stable |
| [`+k8s:subfield`](#tag-subfield) | Declares a validation for a subfield of a struct. | Stable |
| [`+k8s:supportsSubresource`](#tag-supportsSubresource) | Declares a supported subresource for the types within a package. | Stable |
| [`+k8s:unionDiscriminator`](#tag-unionDiscriminator) | Indicates that this field is the discriminator for a union. | Beta |
| [`+k8s:unionMember`](#tag-unionMember) | Indicates that this field is a member of a union group. | Stable |
| [`+k8s:unique`](#tag-unique) | Declares that a list field's elements are unique. | Stable |
| [`+k8s:update`](#tag-update) | Constrains which update transitions are allowed for a field. | Stable |
| [`+k8s:zeroOrOneOfMember`](#tag-zeroOrOneOfMember) | Indicates that this field is a member of a zero-or-one-of group. | Stable |
-->
| 标签 | 描述 | 稳定性 |
| --- | --- | --- |
| [`+k8s:alpha`](#tag-alpha) | 将验证标签置于影子模式（仅记录指标）。 | Beta |
| [`+k8s:beta`](#tag-beta) | 将验证标签置于生效模式（可通过 `DeclarativeValidationBeta` 禁用）。 | Beta |
| [`+k8s:customUnique`](#tag-customUnique) | 表示由手写验证负责检查列表的唯一性。 | Stable |
| [`+k8s:customValidation`](#tag-customValidation) | 从生成的遍历代码中调用手写验证函数。 | Stable |
| [`+k8s:dependentForbidden`](#tag-dependentForbidden) | 表示设置此字段时，指定的同级字段不得被设置。 | Alpha |
| [`+k8s:dependentRequired`](#tag-dependentRequired) | 表示设置此字段时，指定的同级字段也必须被设置。 | Alpha |
| [`+k8s:eachKey`](#tag-eachKey) | 为映射中的每个键声明一个验证。 | Stable |
| [`+k8s:eachVal`](#tag-eachVal) | 为映射或列表中的每个值声明一个验证。 | Stable |
| [`+k8s:enum`](#tag-enum) | 表示某个字符串类型是枚举。 | Stable |
| [`+k8s:enumExclude`](#tag-enumExclude) | 将某个常量从其类型的枚举值中排除。 | Alpha |
| [`+k8s:forbidden`](#tag-forbidden) | 表示某个字段不可被指定。 | Beta |
| [`+k8s:format`](#tag-format) | 表示某个字符串字段具有特定格式。 | Stable |
| [`+k8s:ifDisabled`](#tag-ifDisabled) | 声明一个仅在某选项被禁用时才适用的验证。 | Stable |
| [`+k8s:ifEnabled`](#tag-ifEnabled) | 声明一个仅在某选项被启用时才适用的验证。 | Stable |
| [`+k8s:ifMode`](#tag-ifMode) | 声明一个仅在模式判别器取特定值时才适用的验证。 | Stable |
| [`+k8s:immutable`](#tag-immutable) | 表示某个字段不可被更新。 | Stable |
| [`+k8s:isSubresource`](#tag-isSubresource) | 指定某个包中的验证仅适用于特定的子资源。 | Stable |
| [`+k8s:item`](#tag-item) | 为声明为 `+k8s:listType=map` 的切片中的某一项声明一个验证。 | Stable |
| [`+k8s:listMapKey`](#tag-listMapKey) | 声明列表值类型中的某个命名子字段是列表映射键的一部分。 | Stable |
| [`+k8s:listType`](#tag-listType) | 声明列表字段的语义类型。 | Stable |
| [`+k8s:maxBytes`](#tag-maxBytes) | 表示某个字符串字段的长度有字节数上限。 | Stable |
| [`+k8s:maxItems`](#tag-maxItems) | 表示某个列表的大小有上限。 | Stable |
| [`+k8s:maxLength`](#tag-maxLength) | 表示某个字符串字段的长度有字符数上限。 | Stable |
| [`+k8s:maxProperties`](#tag-maxProperties) | 表示某个映射的条目数量有上限。 | Stable |
| [`+k8s:maximum`](#tag-maximum) | 表示某个数值字段有最大值。 | Stable |
| [`+k8s:minItems`](#tag-minItems) | 表示某个列表有最小大小。 | Stable |
| [`+k8s:minLength`](#tag-minLength) | 表示某个字符串字段有最小字符数长度。 | Stable |
| [`+k8s:minProperties`](#tag-minProperties) | 表示某个映射有最少条目数量。 | Stable |
| [`+k8s:minimum`](#tag-minimum) | 表示某个数值字段有最小值。 | Stable |
| [`+k8s:modeDiscriminator`](#tag-modeDiscriminator) | 表示此字段是基于状态的验证的判别器。 | Stable |
| [`+k8s:monotonic`](#tag-monotonic) | 确保字段的值在更新时永不减小。 | Alpha |
| [`+k8s:neq`](#tag-neq) | 验证字段的值不等于某个特定的不允许值。 | Alpha |
| [`+k8s:opaqueType`](#tag-opaqueType) | 表示生成器忽略所引用类型上声明的所有验证。 | Stable |
| [`+k8s:optional`](#tag-optional) | 表示某个字段对客户端而言是可选的。 | Stable |
| [`+k8s:required`](#tag-required) | 表示某个字段必须由客户端指定。 | Stable |
| [`+k8s:subfield`](#tag-subfield) | 为结构体的某个子字段声明一个验证。 | Stable |
| [`+k8s:supportsSubresource`](#tag-supportsSubresource) | 为包内的类型声明一个受支持的子资源。 | Stable |
| [`+k8s:unionDiscriminator`](#tag-unionDiscriminator) | 表示此字段是某个联合的判别器。 | Beta |
| [`+k8s:unionMember`](#tag-unionMember) | 表示此字段是某个联合组的成员。 | Stable |
| [`+k8s:unique`](#tag-unique) | 声明列表字段的元素是唯一的。 | Stable |
| [`+k8s:update`](#tag-update) | 约束字段允许的更新转换。 | Stable |
| [`+k8s:zeroOrOneOfMember`](#tag-zeroOrOneOfMember) | 表示此字段是某个“零或一”组的成员。 | Stable |

{{< /table >}}

<!--
## Tag reference

### `+k8s:alpha` {#tag-alpha}

**Description:**

Puts a validation rule in _shadow mode_, the first phase of the
[validation lifecycle](#lifecycle). Use it only when migrating existing
hand-written validation, not on new fields.

The hand-written validation stays authoritative; the declarative rule runs
alongside it, and mismatches and panics are recorded as
[metrics](#metrics). This confirms the two behave identically before you
promote the rule to Beta.

The API server never enforces `+k8s:alpha` rules, regardless of feature gates.
-->
## 标签参考   {#tag-reference}

### `+k8s:alpha` {#tag-alpha}

**描述**：

将验证规则置于**影子模式**，这是[验证生命周期](#lifecycle)的第一个阶段。
仅在迁移现有手写验证时使用它，不要用于新字段。

手写验证仍然是权威的；声明式规则与其并行运行，不匹配和 panic 会被记录为[指标](#metrics)。
这样可以在将规则提升到 Beta 之前，确认二者的行为完全一致。

无论特性门控如何设置，API 服务器都不会让 `+k8s:alpha` 规则生效。

<!--
**Stability level:** Beta

**Scopes:** struct fields, type definitions, list values, map keys, map values

**Arguments:**

* `since` (string, optional): the Kubernetes version in which the validation was
  first shadowed.

**Payload:**

* `<validation-tag>` (required): the declarative validation tag to shadow.

**Usage example:**
-->
**稳定性级别**：Beta

**作用域**：结构体字段、类型定义、列表值、映射键、映射值

**参数**：

* `since`（字符串，可选）：此验证首次进入影子模式时的 Kubernetes 版本。

**载荷**：

* `<validation-tag>`（必需）：要置于影子模式的声明式验证标签。

**用法示例**：

```go
type MyStruct struct {
    // +k8s:alpha(since:"1.36")=+k8s:minimum=1
    MyField int `json:"myField"`
}
```

<!--
### `+k8s:beta` {#tag-beta}

**Description:**

Puts a migrated validation rule in _enforced mode_, the second phase of the
[validation lifecycle](#lifecycle). Use it only when migrating existing
hand-written validation, not on new fields.

When `DeclarativeValidationBeta` is enabled (the default), the rule is
authoritative and the API server drops the hand-written errors it covers.
Disabling the gate reverts the rule to shadow mode.
-->
### `+k8s:beta` {#tag-beta}

**描述**：

将已迁移的验证规则置于**生效模式**，这是[验证生命周期](#lifecycle)的第二个阶段。
仅在迁移现有手写验证时使用它，不要用于新字段。

当 `DeclarativeValidationBeta` 启用时（默认），该规则具有权威性，
API 服务器会丢弃其所覆盖的手写验证错误。禁用该门控会使规则恢复为影子模式。

<!--
**Stability level:** Beta

**Scopes:** struct fields, type definitions, list values, map keys, map values

**Arguments:**

* `since` (string, optional): the Kubernetes version in which the validation was
  promoted to Beta.

**Payload:**

* `<validation-tag>` (required): the declarative validation tag to enforce.

**Usage example:**
-->
**稳定性级别**：Beta

**作用域**：结构体字段、类型定义、列表值、映射键、映射值

**参数**：

* `since`（字符串，可选）：此验证被提升到 Beta 时的 Kubernetes 版本。

**载荷**：

* `<validation-tag>`（必需）：要使其生效的声明式验证标签。

**用法示例**：

```go
type MyStruct struct {
    // +k8s:beta(since:"1.37")=+k8s:minimum=1
    MyField int `json:"myField"`
}
```

<!--
### `+k8s:customUnique` {#tag-customUnique}

**Description:**

Indicates that custom, hand-written validation implements uniqueness validation
for this list. This disables generation of uniqueness validation for the list,
which `+k8s:listType=set`, `+k8s:listType=map`, and [`+k8s:unique`](#tag-unique)
otherwise imply.

**Stability level:** Stable

**Scopes:** struct fields, type definitions, list values, map keys, map values

**Usage example:**
-->
### `+k8s:customUnique` {#tag-customUnique}

**描述**：

表示由自定义的手写验证为此列表实现唯一性验证。这会禁止为该列表生成唯一性验证，
而 `+k8s:listType=set`、`+k8s:listType=map` 和 [`+k8s:unique`](#tag-unique)
原本都隐含此类验证。

**稳定性级别**：Stable

**作用域**：结构体字段、类型定义、列表值、映射键、映射值

**用法示例**：

```go
type MyStruct struct {
    // +k8s:listType=map
    // +k8s:listMapKey=key
    // +k8s:customUnique
    MyList []Item `json:"myList"`
}
```

<!--
In this example, the generator records that `MyList` is a list-map but does not
emit a uniqueness check for it; hand-written code is responsible for that check.
-->
在此示例中，生成器记录 `MyList` 是一个列表映射，但不会为其生成唯一性检查；
该检查由手写代码负责。

<!--
### `+k8s:customValidation` {#tag-customValidation}

**Description:**

Calls a hand-written validation function from the generated traversal code. Use
this for logic that you cannot express with the other tags.

The function must live in the generated package, with the following signature:
-->
### `+k8s:customValidation` {#tag-customValidation}

**描述**：

从生成的遍历代码中调用手写验证函数。当其他标签无法表达某些逻辑时，使用此标签。

该函数必须位于所生成代码的包中，并具有以下签名：

```go
func(ctx context.Context, op operation.Operation, fldPath *field.Path, value, oldValue <ValueType>) field.ErrorList
```

<!--
`<ValueType>` is the value's type made nilable: a pointer such as `*string`, or
the type itself if already nilable (slice, map, pointer). Each generated package
needs its own definition, because each copy calls the function beside it.

In the function name, `<Type>` and `<Field>` are Go identifiers (`Replicas`, not
`replicas`):

* Field scope: `ValidateCustom_<Type>_<Field>` validates one field. On update,
  it is skipped when that field is unchanged.

* Type scope: `ValidateCustom_<Type>` checks across fields. It is *not* skipped
  on update, so an expensive check should return early when `value` and
  `oldValue` are equal.

For per-element checks, tag the element type, or use field scope and loop inside
the function.
-->
`<ValueType>` 是值类型的可为 nil 形式：例如 `*string` 这样的指针，
或者当类型本身已经可为 nil（切片、映射、指针）时就是该类型本身。
每个生成的包都需要有自己的定义，因为每份生成的代码都会调用其所在包中的函数。

在函数名中，`<Type>` 和 `<Field>` 是 Go 标识符（`Replicas`，而不是 `replicas`）：

* 字段作用域：`ValidateCustom_<Type>_<Field>` 验证单个字段。
  更新时，如果该字段未发生变化，则跳过此函数。

* 类型作用域：`ValidateCustom_<Type>` 执行跨字段检查。更新时**不会**跳过此函数，
  因此开销较大的检查应在 `value` 与 `oldValue` 相等时尽早返回。

对于逐元素的检查，请为元素类型添加标签，或者使用字段作用域并在函数内部循环处理。

<!--
**Stability level:** Stable

**Scopes:** struct fields, type definitions

**Usage example:**
-->
**稳定性级别**：Stable

**作用域**：结构体字段、类型定义

**用法示例**：

<!--
```go
// +k8s:customValidation
type MyStruct struct {
    // +k8s:customValidation
    StringField string `json:"stringField"`

    // Both validations run on this field.
    // +k8s:maxLength=3
    // +k8s:customValidation
    MaxLengthField string `json:"maxLengthField"`
}
```
-->
```go
// +k8s:customValidation
type MyStruct struct {
    // +k8s:customValidation
    StringField string `json:"stringField"`

    // 此字段上的两个验证都会运行。
    // +k8s:maxLength=3
    // +k8s:customValidation
    MaxLengthField string `json:"maxLengthField"`
}
```

<!--
### `+k8s:dependentForbidden` {#tag-dependentForbidden}

**Description:**

Indicates that when this field is set, the named sibling field must not be set.
A field counts as "set" when it is a non-nil pointer, a non-empty slice or map,
or a non-zero builtin. Dependencies are one-directional. Repeat the tag to
forbid multiple siblings.

**Stability level:** Alpha

**Scopes:** struct fields

**Arguments:**

* `<sibling-field-json-name>` (string, required): the JSON name of the sibling
  field.

**Usage example:**
-->
### `+k8s:dependentForbidden` {#tag-dependentForbidden}

**描述**：

表示当设置此字段时，指定的同级字段不得被设置。
当字段是非 nil 指针、非空切片或映射，或者非零值的内置类型时，即视为“已设置”。
依赖关系是单向的。重复使用此标签可以禁止多个同级字段。

**稳定性级别**：Alpha

**作用域**：结构体字段

**参数**：

* `<sibling-field-json-name>`（字符串，必需）：同级字段的 JSON 名称。

**用法示例**：

```go
type MyStruct struct {
    // +k8s:optional
    // +k8s:dependentForbidden("dependentA")
    // +k8s:dependentForbidden("dependentB")
    Trigger *string `json:"trigger"`

    // +k8s:optional
    DependentA *string `json:"dependentA"`

    // +k8s:optional
    DependentB *string `json:"dependentB"`
}
```

<!--
In this example, if `trigger` is set, neither `dependentA` nor `dependentB` may
be set.
-->
在此示例中，如果设置了 `trigger`，则 `dependentA` 和 `dependentB` 都不得被设置。

<!--
### `+k8s:dependentRequired` {#tag-dependentRequired}

**Description:**

Indicates that when this field is set, the named sibling field must also be set.
A field counts as "set" when it is a non-nil pointer, a non-empty slice or map,
or a non-zero builtin. Dependencies are one-directional. Repeat the tag to
require multiple siblings.

**Stability level:** Alpha

**Scopes:** struct fields

**Arguments:**

* `<sibling-field-json-name>` (string, required): the JSON name of the sibling
  field.

**Usage example:**
-->
### `+k8s:dependentRequired` {#tag-dependentRequired}

**描述**：

表示当设置此字段时，指定的同级字段也必须被设置。
当字段是非 nil 指针、非空切片或映射，或者非零值的内置类型时，即视为“已设置”。
依赖关系是单向的。重复使用此标签可以要求多个同级字段。

**稳定性级别**：Alpha

**作用域**：结构体字段

**参数**：

* `<sibling-field-json-name>`（字符串，必需）：同级字段的 JSON 名称。

**用法示例**：

```go
type MyStruct struct {
    // +k8s:optional
    // +k8s:dependentRequired("dependent")
    Trigger *string `json:"trigger"`

    // +k8s:optional
    Dependent *string `json:"dependent"`
}
```

<!--
In this example, if `trigger` is set, `dependent` must also be set. Setting
`dependent` alone is allowed.
-->
在此示例中，如果设置了 `trigger`，则也必须设置 `dependent`。单独设置 `dependent` 是允许的。

<!--
### `+k8s:eachKey` {#tag-eachKey}

**Description:**

Declares a validation for each key in a map.

**Stability level:** Stable

**Scopes:** struct fields, type definitions, list values, map keys, map values

**Payload:**

* `<validation-tag>` (required): the tag to evaluate for each key.

**Usage example:**
-->
### `+k8s:eachKey` {#tag-eachKey}

**描述**：

为映射中的每个键声明一个验证。

**稳定性级别**：Stable

**作用域**：结构体字段、类型定义、列表值、映射键、映射值

**载荷**：

* `<validation-tag>`（必需）：要对每个键求值的标签。

**用法示例**：

```go
type MyStruct struct {
    // +k8s:eachKey=+k8s:minimum=1
    MyMap map[int]string `json:"myMap"`
}
```

<!--
### `+k8s:eachVal` {#tag-eachVal}

**Description:**

Declares a validation for each value in a map or list.

**Stability level:** Stable

**Scopes:** struct fields, type definitions, list values, map keys, map values

**Payload:**

* `<validation-tag>` (required): the tag to evaluate for each value.

**Usage example:**
-->
### `+k8s:eachVal` {#tag-eachVal}

**描述**：

为映射或列表中的每个值声明一个验证。

**稳定性级别**：Stable

**作用域**：结构体字段、类型定义、列表值、映射键、映射值

**载荷**：

* `<validation-tag>`（必需）：要对每个值求值的标签。

**用法示例**：

```go
type MyStruct struct {
    // +k8s:eachVal=+k8s:minimum=1
    MyMap map[string]int `json:"myMap"`

    // +k8s:eachVal=+k8s:maxLength=10
    MyList []string `json:"myList"`
}
```

<!--
### `+k8s:enum` {#tag-enum}

**Description:**

Indicates that a string type is an enum. All constant values of this type are
values in the enum, unless you exclude them with
[`+k8s:enumExclude`](#tag-enumExclude).

**Stability level:** Stable

**Scopes:** type definitions

**Usage example:**

First, define a new string type and some constants of that type:
-->
### `+k8s:enum` {#tag-enum}

**描述**：

表示某个字符串类型是枚举。该类型的所有常量值都是枚举中的值，
除非你使用 [`+k8s:enumExclude`](#tag-enumExclude) 将其排除。

**稳定性级别**：Stable

**作用域**：类型定义

**用法示例**：

首先，定义一个新的字符串类型以及该类型的一些常量：

```go
// +k8s:enum
type MyEnum string

const (
    MyEnumA MyEnum = "A"
    MyEnumB MyEnum = "B"
)
```

<!--
Then, use this type in another struct:
-->
然后，在另一个结构体中使用此类型：

```go
type MyStruct struct {
    MyField MyEnum `json:"myField"`
}
```

<!--
The validation logic ensures that `MyField` is one of the defined enum values
(`"A"` or `"B"`).
-->
验证逻辑确保 `MyField` 是所定义的枚举值之一（`"A"` 或 `"B"`）。

<!--
### `+k8s:enumExclude` {#tag-enumExclude}

**Description:**

Indicates that a constant value is not part of an enum, even if the constant's
type has the `+k8s:enum` tag. You can make the exclusion conditional by nesting
the tag inside [`+k8s:ifEnabled`](#tag-ifEnabled) or
[`+k8s:ifDisabled`](#tag-ifDisabled). If you use several conditional tags, the
generator excludes the value if *any* of the conditions is met.

**Stability level:** Alpha

**Scopes:** constant values

**Usage example:**
-->
### `+k8s:enumExclude` {#tag-enumExclude}

**描述**：

表示某个常量值不属于枚举，即使该常量的类型带有 `+k8s:enum` 标签。
你可以将此标签嵌套在 [`+k8s:ifEnabled`](#tag-ifEnabled) 或
[`+k8s:ifDisabled`](#tag-ifDisabled) 内部，使排除成为有条件的。
如果你使用了多个条件标签，只要**任一**条件满足，生成器就会排除该值。

**稳定性级别**：Alpha

**作用域**：常量值

**用法示例**：

<!--
```go
// +k8s:enum
type MyEnum string

const (
    MyEnumA MyEnum = "A"

    // Never a valid value.
    // +k8s:enumExclude
    MyEnumB MyEnum = "B"

    // Only a valid value while "MyFeature" is disabled.
    // +k8s:ifEnabled(MyFeature)=+k8s:enumExclude
    MyEnumC MyEnum = "C"
)
```
-->
```go
// +k8s:enum
type MyEnum string

const (
    MyEnumA MyEnum = "A"

    // 永远不是有效值。
    // +k8s:enumExclude
    MyEnumB MyEnum = "B"

    // 仅在 "MyFeature" 被禁用时才是有效值。
    // +k8s:ifEnabled(MyFeature)=+k8s:enumExclude
    MyEnumC MyEnum = "C"
)
```

<!--
### `+k8s:forbidden` {#tag-forbidden}

**Description:**

Indicates that a field may not be specified.

**Stability level:** Beta

**Scopes:** struct fields

**Usage example:**
-->
### `+k8s:forbidden` {#tag-forbidden}

**描述**：

表示某个字段不可被指定。

**稳定性级别**：Beta

**作用域**：结构体字段

**用法示例**：

```go
type MyStruct struct {
    // +k8s:forbidden
    MyField string `json:"myField"`
}
```

<!--
### `+k8s:format` {#tag-format}

**Description:**

Indicates that a string field has a particular format.

**Stability level:** Stable

**Scopes:** struct fields, type definitions, list values, map keys, map values

**Payloads:**

Supported payloads for the k8s:format tag
-->
### `+k8s:format` {#tag-format}

**描述**：

表示某个字符串字段具有特定格式。

**稳定性级别**：Stable

**作用域**：结构体字段、类型定义、列表值、映射键、映射值

**载荷**：

{{< table caption="k8s:format 标签支持的载荷" >}}

<!--
| Payload | Meaning |
| --- | --- |
| `k8s-extended-resource-name` | A Kubernetes extended resource name: a domain-prefixed name that must not have a `kubernetes.io` or `requests.` prefix. When you prepend `requests.`, the result must be a valid label key, as used by quota. |
| `k8s-label-key` | A Kubernetes label key. |
| `k8s-label-value` | A Kubernetes label value. |
| `k8s-long-name` | A Kubernetes "long name", aka a "DNS subdomain" value. |
| `k8s-long-name-caseless` | Deprecated: a case-insensitive Kubernetes "long name". |
| `k8s-path-segment-name` | A Kubernetes "path segment name" value. |
| `k8s-prefixed-label-key` | A Kubernetes label key, with the prefix required. |
| `k8s-resource-fully-qualified-name` | A non-empty prefix and name separated by a slash (for example, `prefix/name`). The prefix must be a DNS subdomain, and the name must be a C identifier of no more than 32 characters. |
| `k8s-resource-pool-name` | One or more Kubernetes "long name" parts separated by `/`, no longer than 253 characters in total. |
| `k8s-short-name` | A Kubernetes "short name", aka a "DNS label" value. |
| `k8s-uuid` | A UUID conforming to RFC 4122. |
-->
| 载荷 | 含义 |
| --- | --- |
| `k8s-extended-resource-name` | Kubernetes 扩展资源名称：带域名前缀的名称，且不得带有 `kubernetes.io` 或 `requests.` 前缀。在其前面加上 `requests.` 后，结果必须是有效的标签键（配额中使用的形式）。 |
| `k8s-label-key` | Kubernetes 标签键。 |
| `k8s-label-value` | Kubernetes 标签值。 |
| `k8s-long-name` | Kubernetes “长名称”，也称为“DNS 子域名”值。 |
| `k8s-long-name-caseless` | 已弃用：不区分大小写的 Kubernetes “长名称”。 |
| `k8s-path-segment-name` | Kubernetes “路径段名称”值。 |
| `k8s-prefixed-label-key` | Kubernetes 标签键，且必须带有前缀。 |
| `k8s-resource-fully-qualified-name` | 由斜杠分隔的非空前缀和名称（例如 `prefix/name`）。前缀必须是 DNS 子域名，名称必须是不超过 32 个字符的 C 标识符。 |
| `k8s-resource-pool-name` | 一个或多个由 `/` 分隔的 Kubernetes “长名称”部分，总长度不超过 253 个字符。 |
| `k8s-short-name` | Kubernetes “短名称”，也称为“DNS 标签”值。 |
| `k8s-uuid` | 符合 RFC 4122 的 UUID。 |

{{< /table >}}

<!--
**Usage example:**
-->
**用法示例**：

```go
type MyStruct struct {
    // +k8s:format=k8s-long-name
    Subdomain string `json:"subdomain"`

    // +k8s:format=k8s-short-name
    Label string `json:"label"`

    // +k8s:format=k8s-uuid
    ID string `json:"id"`
}
```

<!--
### `+k8s:ifDisabled` {#tag-ifDisabled}

**Description:**

Declares a validation that only applies when an option is disabled. Options
correspond to the validation options that the API server derives from feature
gates.

**Stability level:** Stable

**Scopes:** struct fields, type definitions, list values, map keys, map values,
constant values

**Arguments:**

* `<option>` (string, required): the name of the option.

**Payload:**

* `<validation-tag>` (required): the validation tag to evaluate only when the
  option is disabled.

**Usage example:**
-->
### `+k8s:ifDisabled` {#tag-ifDisabled}

**描述**：

声明一个仅在某选项被禁用时才适用的验证。选项对应于 API 服务器从特性门控派生出的验证选项。

**稳定性级别**：Stable

**作用域**：结构体字段、类型定义、列表值、映射键、映射值、常量值

**参数**：

* `<option>`（字符串，必需）：选项的名称。

**载荷**：

* `<validation-tag>`（必需）：仅在该选项被禁用时才求值的验证标签。

**用法示例**：

```go
type MyStruct struct {
    // +k8s:ifDisabled(MyFeature)=+k8s:required
    MyField string `json:"myField"`
}
```

<!--
### `+k8s:ifEnabled` {#tag-ifEnabled}

**Description:**

Declares a validation that only applies when an option is enabled. Options
correspond to the validation options that the API server derives from feature
gates.

**Stability level:** Stable

**Scopes:** struct fields, type definitions, list values, map keys, map values,
constant values

**Arguments:**

* `<option>` (string, required): the name of the option.

**Payload:**

* `<validation-tag>` (required): the validation tag to evaluate only when the
  option is enabled.

**Usage example:**
-->
### `+k8s:ifEnabled` {#tag-ifEnabled}

**描述**：

声明一个仅在某选项被启用时才适用的验证。选项对应于 API 服务器从特性门控派生出的验证选项。

**稳定性级别**：Stable

**作用域**：结构体字段、类型定义、列表值、映射键、映射值、常量值

**参数**：

* `<option>`（字符串，必需）：选项的名称。

**载荷**：

* `<validation-tag>`（必需）：仅在该选项被启用时才求值的验证标签。

**用法示例**：

```go
type MyStruct struct {
    // +k8s:ifEnabled(MyFeature)=+k8s:required
    MyField string `json:"myField"`
}
```

<!--
### `+k8s:ifMode` {#tag-ifMode}

**Description:**

Declares a validation that only applies when the struct's
[mode discriminator](#tag-modeDiscriminator) has a particular value. This
expresses state-based validation, where the shape of an object depends on a mode
field.

A field that carries at least one `+k8s:ifMode` tag is *implicitly forbidden* in
every mode that none of its tags name.
-->
### `+k8s:ifMode` {#tag-ifMode}

**描述**：

声明一个仅在结构体的[模式判别器](#tag-modeDiscriminator)取特定值时才适用的验证。
这用于表达基于状态的验证，即对象的形态取决于某个模式字段。

带有至少一个 `+k8s:ifMode` 标签的字段，在其所有标签都未提及的每种模式下都被**隐式禁止**。

<!--
**Stability level:** Stable

**Scopes:** struct fields

**Arguments:**

* `<mode>` (string, positional): the discriminator value for which this
  validation applies.
* `modality` (string, optional): the name of the discriminator group, when a
  struct has more than one.
* `mode` (string, optional): the discriminator value, as a named alternative to
  the positional argument.

**Payload:**

* `<validation-tag>` (required): the tag to evaluate when the mode matches.

**Usage example:**
-->
**稳定性级别**：Stable

**作用域**：结构体字段

**参数**：

* `<mode>`（字符串，位置参数）：此验证所适用的判别器取值。
* `modality`（字符串，可选）：当结构体有多个判别器组时，判别器组的名称。
* `mode`（字符串，可选）：判别器取值，作为位置参数的具名替代形式。

**载荷**：

* `<validation-tag>`（必需）：模式匹配时要求值的标签。

**用法示例**：

<!--
```go
type MyStruct struct {
    // +k8s:modeDiscriminator
    Mode string `json:"mode"`

    // Required in mode "A", and additionally length-limited.
    // +k8s:ifMode("A")=+k8s:required
    // +k8s:ifMode("A")=+k8s:maxLength=5
    FieldA *string `json:"fieldA,omitempty"`

    // Optional in mode "B", implicitly forbidden in every other mode.
    // +k8s:ifMode("B")=+k8s:optional
    FieldB *string `json:"fieldB,omitempty"`
}
```
-->
```go
type MyStruct struct {
    // +k8s:modeDiscriminator
    Mode string `json:"mode"`

    // 在模式 "A" 下必需，并且额外限制长度。
    // +k8s:ifMode("A")=+k8s:required
    // +k8s:ifMode("A")=+k8s:maxLength=5
    FieldA *string `json:"fieldA,omitempty"`

    // 在模式 "B" 下可选，在其他所有模式下被隐式禁止。
    // +k8s:ifMode("B")=+k8s:optional
    FieldB *string `json:"fieldB,omitempty"`
}
```

<!--
### `+k8s:immutable` {#tag-immutable}

**Description:**

Indicates that a field may not be updated. Unlike [`+k8s:update`](#tag-update),
which offers finer-grained transitions, `+k8s:immutable` forbids any change to
the value after creation.

**Stability level:** Stable

**Scopes:** struct fields, type definitions, list values, map values

**Usage example:**
-->
### `+k8s:immutable` {#tag-immutable}

**描述**：

表示某个字段不可被更新。与提供更细粒度转换控制的 [`+k8s:update`](#tag-update) 不同，
`+k8s:immutable` 禁止在创建之后对值做任何更改。

**稳定性级别**：Stable

**作用域**：结构体字段、类型定义、列表值、映射值

**用法示例**：

```go
type MyStruct struct {
    // +k8s:immutable
    StringField string `json:"stringField"`

    // +k8s:immutable
    SliceField []string `json:"sliceField"`
}

// +k8s:immutable
type ImmutableType string
```

<!--
### `+k8s:isSubresource` {#tag-isSubresource}

**Description:**

A package-level tag that scopes the package's validation rules to one
subresource, so they do not apply to the root object or any other subresource.
This lets you keep subresource-specific validation in its own package, separate
from the API types.

**Stability level:** Stable

**Scope:** package

**Payload:**

* `<subresource-path>`: the path of the subresource to which the validations in
  this package apply (for example, `"/status"` or `"/scale"`).
-->
### `+k8s:isSubresource` {#tag-isSubresource}

**描述**：

一个包级别的标签，将包中的验证规则限定于某一个子资源，
使其不适用于根对象或任何其他子资源。
这让你可以将特定于子资源的验证放在独立的包中，与 API 类型分离。

**稳定性级别**：Stable

**作用域**：包

**载荷**：

* `<subresource-path>`：此包中的验证所适用的子资源路径（例如 `"/status"` 或 `"/scale"`）。

{{< alert color="caution" title="Caution" >}}
<!--
This tag requires a matching
[`+k8s:supportsSubresource`](#tag-supportsSubresource) in the package that
defines the API type. Without it, the generator emits the validation code but
the dispatcher does not recognize the subresource path, so nothing reaches it.
-->
此标签要求在定义 API 类型的包中有与之匹配的
[`+k8s:supportsSubresource`](#tag-supportsSubresource)。
如果没有，生成器仍会生成验证代码，但分发器无法识别该子资源路径，
因此不会有任何请求到达这些验证。
{{< /alert >}}

<!--
**Usage example:**

In `staging/src/k8s.io/api/apps/v1/doc.go`, declare that the type supports
`/scale`:
-->
**用法示例**：

在 `staging/src/k8s.io/api/apps/v1/doc.go` 中，声明该类型支持 `/scale`：

```go
// +k8s:supportsSubresource="/scale"
package v1
```

<!--
In `staging/src/k8s.io/api/apps/v1/validations/scale/doc.go`, define the rules
that run only for `/scale`:
-->
在 `staging/src/k8s.io/api/apps/v1/validations/scale/doc.go` 中，
定义仅针对 `/scale` 运行的规则：

```go
// +k8s:isSubresource="/scale"
package scale
```

<!--
### `+k8s:item` {#tag-item}

**Description:**

Declares a validation for an item of a slice declared as a `+k8s:listType=map`.
You declare the item to match by providing field-value pair arguments where the
field is a `listMapKey`. You must specify all `listMapKey` fields.

**Stability level:** Stable

**Scopes:** struct fields, type definitions, list values, map keys, map values

**Usage:**
-->
### `+k8s:item` {#tag-item}

**描述**：

为声明为 `+k8s:listType=map` 的切片中的某一项声明一个验证。
你通过提供字段-值对参数来声明要匹配的项，其中字段是 `listMapKey`。
你必须指定所有的 `listMapKey` 字段。

**稳定性级别**：Stable

**作用域**：结构体字段、类型定义、列表值、映射键、映射值

**用法**：

`+k8s:item(<listMapKey-JSON-field-name>: <value>,...)=<validation-tag>`

`+k8s:item(stringKey: "value", intKey: 42, boolKey: true)=<validation-tag>`

<!--
Name the arguments with the JSON names of the list-map key fields. Values can be
strings, integers, or booleans.

**Payload:**

* `<validation-tag>` (required): the tag to evaluate for the matching list item.

**Usage example:**
-->
参数名使用列表映射键字段的 JSON 名称。值可以是字符串、整数或布尔值。

**载荷**：

* `<validation-tag>`（必需）：要对匹配的列表项求值的标签。

**用法示例**：

```go
type MyStruct struct {
    // +k8s:listType=map
    // +k8s:listMapKey=type
    // +k8s:item(type: "Approved")=+k8s:zeroOrOneOfMember
    // +k8s:item(type: "Denied")=+k8s:zeroOrOneOfMember
    MyConditions []MyCondition `json:"conditions"`
}

type MyCondition struct {
    Type   string `json:"type"`
    Status string `json:"status"`
}
```

<!--
In this example, the conditions with `type` "Approved" and "Denied" are members
of the same zero-or-one-of group, so at most one of them may be present.
-->
在此示例中，`type` 为 "Approved" 和 "Denied" 的状况属于同一个“零或一”组，
因此二者最多只能出现一个。

<!--
### `+k8s:listMapKey` {#tag-listMapKey}

**Description:**

Declares a named sub-field of a list's value-type to be part of the list-map key.
This tag is required when you use `+k8s:listType=map` or `+k8s:unique=map`. You
can use multiple `+k8s:listMapKey` tags to specify that the list is keyed off
several fields.

**Stability level:** Stable

**Scopes:** struct fields, type definitions, list values, map keys, map values

**Payload:**

* `<field-json-name>` (required): the JSON name of the field to use as the key.

**Usage example:**
-->
### `+k8s:listMapKey` {#tag-listMapKey}

**描述**：

声明列表值类型中的某个命名子字段是列表映射键的一部分。
使用 `+k8s:listType=map` 或 `+k8s:unique=map` 时必须使用此标签。
你可以使用多个 `+k8s:listMapKey` 标签来指定列表以多个字段为键。

**稳定性级别**：Stable

**作用域**：结构体字段、类型定义、列表值、映射键、映射值

**载荷**：

* `<field-json-name>`（必需）：用作键的字段的 JSON 名称。

**用法示例**：

```go
// +k8s:listType=map
// +k8s:listMapKey=keyFieldOne
// +k8s:listMapKey=keyFieldTwo
type MyList []MyItem

type MyItem struct {
    KeyFieldOne string `json:"keyFieldOne"`
    KeyFieldTwo string `json:"keyFieldTwo"`
    ValueField  string `json:"valueField"`
}
```

<!--
The key is the combination of `keyFieldOne` and `keyFieldTwo`.
-->
键是 `keyFieldOne` 和 `keyFieldTwo` 的组合。

<!--
### `+k8s:listType` {#tag-listType}

**Description:**

Declares a list field's semantic type and ownership behavior:

* `atomic`: single ownership; the list is treated as a single value.
* `set`: shared ownership with uniqueness; each element must be unique.
* `map`: shared ownership with key-based uniqueness; requires
  [`+k8s:listMapKey`](#tag-listMapKey).

**Stability level:** Stable

**Scopes:** struct fields, type definitions, list values, map keys, map values

**Payload:**

* `atomic | map | set` (required)

**Usage example:**
-->
### `+k8s:listType` {#tag-listType}

**描述**：

声明列表字段的语义类型和属主行为：

* `atomic`：单一属主；列表被视为单个值。
* `set`：共享属主且要求唯一；每个元素必须唯一。
* `map`：共享属主且基于键要求唯一；需要 [`+k8s:listMapKey`](#tag-listMapKey)。

**稳定性级别**：Stable

**作用域**：结构体字段、类型定义、列表值、映射键、映射值

**载荷**：

* `atomic | map | set`（必需）

**用法示例**：

```go
// +k8s:listType=map
// +k8s:listMapKey=keyField
type MyList []MyItem

type MyItem struct {
    KeyField   string `json:"keyField"`
    ValueField string `json:"valueField"`
}
```

<!--
Each element of `MyList` must have a unique `keyField`.
-->
`MyList` 的每个元素都必须有唯一的 `keyField`。

<!--
### `+k8s:maxBytes` {#tag-maxBytes}

**Description:**

Indicates that a string field has a limit on its length in bytes. This could
allow as few as N/4 multi-byte characters. To limit the number of characters
instead, use [`+k8s:maxLength`](#tag-maxLength).

**Stability level:** Stable

**Scopes:** struct fields, type definitions, list values, map keys, map values

**Payload:**

* `<non-negative integer>` (required): this field must be no more than X bytes
  long.

**Usage example:**
-->
### `+k8s:maxBytes` {#tag-maxBytes}

**描述**：

表示某个字符串字段的长度有字节数上限。这可能只允许最少 N/4 个多字节字符。
如需改为限制字符数，请使用 [`+k8s:maxLength`](#tag-maxLength)。

**稳定性级别**：Stable

**作用域**：结构体字段、类型定义、列表值、映射键、映射值

**载荷**：

* `<non-negative integer>`（必需）：此字段的长度不得超过 X 字节。

**用法示例**：

```go
type MyStruct struct {
    // +k8s:maxBytes=1024
    MyString string `json:"myString"`
}
```

<!--
### `+k8s:maxItems` {#tag-maxItems}

**Description:**

Indicates that a list has a limit on its size.

**Stability level:** Stable

**Scopes:** struct fields, type definitions, list values, map values

**Payload:**

* `<non-negative integer>` (required): this list must be no more than X items
  long.

**Usage example:**
-->
### `+k8s:maxItems` {#tag-maxItems}

**描述**：

表示某个列表的大小有上限。

**稳定性级别**：Stable

**作用域**：结构体字段、类型定义、列表值、映射值

**载荷**：

* `<non-negative integer>`（必需）：此列表的项数不得超过 X。

**用法示例**：

```go
type MyStruct struct {
    // +k8s:maxItems=5
    MyList []string `json:"myList"`
}
```

<!--
### `+k8s:maxLength` {#tag-maxLength}

**Description:**

Indicates that a string field has a limit on its length in characters. This could
allow up to 4*N bytes if the value uses multi-byte characters. To limit the
number of bytes instead, use [`+k8s:maxBytes`](#tag-maxBytes).

**Stability level:** Stable

**Scopes:** struct fields, type definitions, list values, map keys, map values

**Payload:**

* `<non-negative integer>` (required): this field must be no more than X
  characters long.

**Usage example:**
-->
### `+k8s:maxLength` {#tag-maxLength}

**描述**：

表示某个字符串字段的长度有字符数上限。如果值使用多字节字符，可能允许多达 4*N 字节。
如需改为限制字节数，请使用 [`+k8s:maxBytes`](#tag-maxBytes)。

**稳定性级别**：Stable

**作用域**：结构体字段、类型定义、列表值、映射键、映射值

**载荷**：

* `<non-negative integer>`（必需）：此字段的长度不得超过 X 个字符。

**用法示例**：

```go
type MyStruct struct {
    // +k8s:maxLength=10
    MyString string `json:"myString"`
}
```

<!--
### `+k8s:maxProperties` {#tag-maxProperties}

**Description:**

Provides a limit on the properties of an object, as defined by JSON Schema. In
Kubernetes you can only use it to constrain the number of entries in a field
defined as a Go map.

**Stability level:** Stable

**Scopes:** struct fields, type definitions

**Payload:**

* `<non-negative integer>` (required): this map must have no more than X
  properties (where X <= 100000).

**Usage example:**
-->
### `+k8s:maxProperties` {#tag-maxProperties}

**描述**：

按 JSON Schema 的定义，对对象的属性数量设置上限。
在 Kubernetes 中，你只能用它来约束定义为 Go map 的字段中的条目数量。

**稳定性级别**：Stable

**作用域**：结构体字段、类型定义

**载荷**：

* `<non-negative integer>`（必需）：此映射的属性数量不得超过 X（其中 X <= 100000）。

**用法示例**：

```go
type MyStruct struct {
    // +k8s:maxProperties=32
    MyMap map[string]string `json:"myMap"`
}
```

<!--
### `+k8s:maximum` {#tag-maximum}

**Description:**

Indicates that a numeric field has a maximum value.

**Stability level:** Stable

**Scopes:** struct fields, type definitions, list values, map keys, map values

**Payload:**

* `<integer>` (required): this field must be less than or equal to X.

**Usage example:**
-->
### `+k8s:maximum` {#tag-maximum}

**描述**：

表示某个数值字段有最大值。

**稳定性级别**：Stable

**作用域**：结构体字段、类型定义、列表值、映射键、映射值

**载荷**：

* `<integer>`（必需）：此字段必须小于或等于 X。

**用法示例**：

```go
type MyStruct struct {
    // +k8s:maximum=100
    MyInt int `json:"myInt"`
}
```

<!--
### `+k8s:minItems` {#tag-minItems}

**Description:**

Indicates that a list has a minimum size.

**Stability level:** Stable

**Scopes:** struct fields, type definitions, list values, map values

**Payload:**

* `<non-negative integer>` (required): this list must be at least X items long.

**Usage example:**
-->
### `+k8s:minItems` {#tag-minItems}

**描述**：

表示某个列表有最小大小。

**稳定性级别**：Stable

**作用域**：结构体字段、类型定义、列表值、映射值

**载荷**：

* `<non-negative integer>`（必需）：此列表至少要有 X 项。

**用法示例**：

```go
type MyStruct struct {
    // +k8s:minItems=1
    MyList []string `json:"myList"`
}
```

<!--
### `+k8s:minLength` {#tag-minLength}

**Description:**

Indicates that a string field has a minimum length in characters. If the value
uses multi-byte characters, the minimum size in bytes ranges from X to 4X.

**Stability level:** Stable

**Scopes:** struct fields, type definitions, list values, map keys, map values

**Payload:**

* `<integer>` (required): this field must be at least X characters long.

**Usage example:**
-->
### `+k8s:minLength` {#tag-minLength}

**描述**：

表示某个字符串字段有最小字符数长度。如果值使用多字节字符，则最小字节数介于 X 到 4X 之间。

**稳定性级别**：Stable

**作用域**：结构体字段、类型定义、列表值、映射键、映射值

**载荷**：

* `<integer>`（必需）：此字段的长度至少为 X 个字符。

**用法示例**：

```go
type MyStruct struct {
    // +k8s:minLength=3
    MyString string `json:"myString"`
}
```

<!--
### `+k8s:minProperties` {#tag-minProperties}

**Description:**

Provides a lower limit on the properties of an object, as defined by JSON Schema.
In Kubernetes you can only use it to constrain the number of entries in a field
defined as a Go map.

**Stability level:** Stable

**Scopes:** struct fields, type definitions

**Payload:**

* `<non-negative integer>` (required): this map must have at least X properties
  (where X <= 100000).

**Usage example:**
-->
### `+k8s:minProperties` {#tag-minProperties}

**描述**：

按 JSON Schema 的定义，对对象的属性数量设置下限。
在 Kubernetes 中，你只能用它来约束定义为 Go map 的字段中的条目数量。

**稳定性级别**：Stable

**作用域**：结构体字段、类型定义

**载荷**：

* `<non-negative integer>`（必需）：此映射至少要有 X 个属性（其中 X <= 100000）。

**用法示例**：

```go
type MyStruct struct {
    // +k8s:minProperties=1
    MyMap map[string]string `json:"myMap"`
}
```

<!--
### `+k8s:minimum` {#tag-minimum}

**Description:**

Indicates that a numeric field has a minimum value.

**Stability level:** Stable

**Scopes:** struct fields, type definitions, list values, map keys, map values

**Payload:**

* `<integer>` (required): this field must be greater than or equal to X.

**Usage example:**
-->
### `+k8s:minimum` {#tag-minimum}

**描述**：

表示某个数值字段有最小值。

**稳定性级别**：Stable

**作用域**：结构体字段、类型定义、列表值、映射键、映射值

**载荷**：

* `<integer>`（必需）：此字段必须大于或等于 X。

**用法示例**：

```go
type MyStruct struct {
    // +k8s:minimum=0
    MyInt int `json:"myInt"`
}
```

<!--
### `+k8s:modeDiscriminator` {#tag-modeDiscriminator}

**Description:**

Indicates that this field is a discriminator for state-based validation: its
value selects which [`+k8s:ifMode`](#tag-ifMode) rules apply to the sibling
fields of the same struct.

The discriminator must be a non-pointer `string` or `bool`. A struct can have
more than one discriminator group; name the extra groups with the `modality`
argument. The group name `default` is reserved, and group names must match
`^[a-zA-Z][a-zA-Z0-9_]*$`.
-->
### `+k8s:modeDiscriminator` {#tag-modeDiscriminator}

**描述**：

表示此字段是基于状态的验证的判别器（discriminator）：
其取值决定哪些 [`+k8s:ifMode`](#tag-ifMode) 规则适用于同一结构体中的同级字段。

判别器必须是非指针的 `string` 或 `bool`。一个结构体可以有多个判别器组；
使用 `modality` 参数为额外的组命名。组名 `default` 是保留的，
且组名必须匹配 `^[a-zA-Z][a-zA-Z0-9_]*$`。

<!--
**Stability level:** Stable

**Scopes:** struct fields

**Arguments:**

* `modality` (string, optional): the name of the discriminator group, if more
  than one exists.

**Usage example:**
-->
**稳定性级别**：Stable

**作用域**：结构体字段

**参数**：

* `modality`（字符串，可选）：当存在多个判别器组时，判别器组的名称。

**用法示例**：

```go
type MyStruct struct {
    // +k8s:modeDiscriminator
    Mode string `json:"mode"`

    // +k8s:modeDiscriminator(modality:"Legacy")
    Legacy bool `json:"legacy"`

    // +k8s:ifMode("A")=+k8s:required
    FieldA *string `json:"fieldA,omitempty"`

    // +k8s:ifMode(modality:"Legacy", mode:"true")=+k8s:required
    FieldB *string `json:"fieldB,omitempty"`
}
```

<!--
### `+k8s:monotonic` {#tag-monotonic}

**Description:**

Ensures that a numeric field's value never decreases on update.

**Stability level:** Alpha

**Scopes:** struct fields, type definitions

**Usage example:**
-->
### `+k8s:monotonic` {#tag-monotonic}

**描述**：

确保数值字段的值在更新时永不减小。

**稳定性级别**：Alpha

**作用域**：结构体字段、类型定义

**用法示例**：

```go
type MyStruct struct {
    // +k8s:minimum=0
    // +k8s:monotonic
    Generation int64 `json:"generation"`
}
```

<!--
### `+k8s:neq` {#tag-neq}

**Description:**

Verifies that the field's value is not equal to a specific disallowed value.
Supports string, integer, and boolean types.

**Stability level:** Alpha

**Scopes:** struct fields, type definitions, list values, map keys, map values

**Payload:**

* `<value>` (required): the disallowed value. The parser infers the type (string,
  int, bool).

**Usage example:**
-->
### `+k8s:neq` {#tag-neq}

**描述**：

验证字段的值不等于某个特定的不允许值。支持字符串、整数和布尔类型。

**稳定性级别**：Alpha

**作用域**：结构体字段、类型定义、列表值、映射键、映射值

**载荷**：

* `<value>`（必需）：不允许的值。解析器会推断其类型（字符串、整数、布尔值）。

**用法示例**：

```go
type MyStruct struct {
    // +k8s:neq="disallowed"
    MyString string `json:"myString"`

    // +k8s:neq=0
    MyInt int `json:"myInt"`

    // +k8s:neq=true
    MyBool bool `json:"myBool"`
}
```

<!--
### `+k8s:opaqueType` {#tag-opaqueType}

**Description:**

Indicates that the generator ignores any validations declared on the referenced
type. If the generator's current flags do not include a referenced type's
package, you must set this tag, or code generation fails (which prevents silent
mistakes). If the generator should not ignore the validations, add the type's
package to the generator using the `--readonly-pkg` flag.

**Stability level:** Stable

**Scopes:** struct fields, type definitions, list values, map keys, map values

**Usage example:**
-->
### `+k8s:opaqueType` {#tag-opaqueType}

**描述**：

表示生成器忽略所引用类型上声明的所有验证。
如果生成器当前的标志未包含所引用类型的包，你必须设置此标签，
否则代码生成会失败（这样可以避免无声的错误）。
如果生成器不应忽略这些验证，请使用 `--readonly-pkg` 标志将该类型的包添加到生成器中。

**稳定性级别**：Stable

**作用域**：结构体字段、类型定义、列表值、映射键、映射值

**用法示例**：

```go
import "some/external/package"

type MyStruct struct {
    // +k8s:opaqueType
    ExternalField package.ExternalType `json:"externalField"`
}
```

<!--
### `+k8s:optional` {#tag-optional}

**Description:**

Indicates that a field is optional to clients.

**Stability level:** Stable

**Scopes:** struct fields

**Usage example:**
-->
### `+k8s:optional` {#tag-optional}

**描述**：

表示某个字段对客户端而言是可选的。

**稳定性级别**：Stable

**作用域**：结构体字段

**用法示例**：

```go
type MyStruct struct {
    // +k8s:optional
    MyField string `json:"myField"`
}
```

<!--
### `+k8s:required` {#tag-required}

**Description:**

Indicates that a field must be specified by clients.

**Stability level:** Stable

**Scopes:** struct fields

**Usage example:**
-->
### `+k8s:required` {#tag-required}

**描述**：

表示某个字段必须由客户端指定。

**稳定性级别**：Stable

**作用域**：结构体字段

**用法示例**：

```go
type MyStruct struct {
    // +k8s:required
    MyField string `json:"myField"`
}
```

<!--
### `+k8s:subfield` {#tag-subfield}

**Description:**

Declares a validation for a subfield of a struct. The named subfield must be a
direct field of the struct, or of an embedded struct.

**Stability level:** Stable

**Scopes:** struct fields, type definitions, list values, map keys, map values

**Arguments:**

* `<field-json-name>` (string, required): the JSON name of the subfield.

**Payload:**

* `<validation-tag>` (required): the tag to evaluate for the subfield.

**Usage example:**
-->
### `+k8s:subfield` {#tag-subfield}

**描述**：

为结构体的某个子字段声明一个验证。所指定的子字段必须是该结构体或其内嵌结构体的直接字段。

**稳定性级别**：Stable

**作用域**：结构体字段、类型定义、列表值、映射键、映射值

**参数**：

* `<field-json-name>`（字符串，必需）：子字段的 JSON 名称。

**载荷**：

* `<validation-tag>`（必需）：要对该子字段求值的标签。

**用法示例**：

```go
type MyStruct struct {
    // +k8s:subfield(mySubfield)=+k8s:required
    Inner MyInnerStruct `json:"inner"`
}

type MyInnerStruct struct {
    MySubfield string `json:"mySubfield"`
}
```

<!--
### `+k8s:supportsSubresource` {#tag-supportsSubresource}

**Description:**

A package-level tag that registers a subresource path in the dispatch function,
so requests to it can be routed to a validation implementation. Repeat the tag
for several subresources.

Without any `+k8s:supportsSubresource` tag, only the root resource is validated
and subresource requests fail with a "no validation found" error. With this tag
but no matching [`+k8s:isSubresource`](#tag-isSubresource), the subresource uses
the root object's rules.
-->
### `+k8s:supportsSubresource` {#tag-supportsSubresource}

**描述**：

一个包级别的标签，在分发函数中注册一个子资源路径，
使得发往该子资源的请求可以被路由到某个验证实现。对多个子资源可重复使用此标签。

如果没有任何 `+k8s:supportsSubresource` 标签，则只验证根资源，
子资源请求会因 "no validation found" 错误而失败。
如果有此标签但没有匹配的 [`+k8s:isSubresource`](#tag-isSubresource)，
则该子资源使用根对象的规则。

<!--
**Stability level:** Stable

**Scope:** package

**Payload:**

* `<subresource-path>`: the path of the subresource to support (for example,
  `"/status"` or `"/scale"`).

**Usage example:**

In `staging/src/k8s.io/api/core/v1/doc.go`, to handle `/status` and `/scale` for
the types in package `v1`:
-->
**稳定性级别**：Stable

**作用域**：包

**载荷**：

* `<subresource-path>`：要支持的子资源路径（例如 `"/status"` 或 `"/scale"`）。

**用法示例**：

在 `staging/src/k8s.io/api/core/v1/doc.go` 中，为包 `v1` 中的类型处理 `/status` 和 `/scale`：

```go
// +k8s:supportsSubresource="/status"
// +k8s:supportsSubresource="/scale"
package v1
```

<!--
### `+k8s:unionDiscriminator` {#tag-unionDiscriminator}

**Description:**

Indicates that this field is the discriminator for a union. The discriminator's
value selects which union member must be present.

**Stability level:** Beta

**Scopes:** struct fields, list values

**Arguments:**

* `union` (string, optional): the name of the union, if more than one exists.

**Usage example:**
-->
### `+k8s:unionDiscriminator` {#tag-unionDiscriminator}

**描述**：

表示此字段是某个联合（union）的判别器。判别器的取值决定哪个联合成员必须存在。

**稳定性级别**：Beta

**作用域**：结构体字段、列表值

**参数**：

* `union`（字符串，可选）：当存在多个联合时，联合的名称。

**用法示例**：

```go
type MyStruct struct {
    TypeMeta int

    // +k8s:unionDiscriminator
    D D `json:"d"`

    // +k8s:unionMember
    // +k8s:optional
    M1 *M1 `json:"m1"`

    // +k8s:unionMember
    // +k8s:optional
    M2 *M2 `json:"m2"`
}

type D string

const (
    DM1 D = "M1"
    DM2 D = "M2"
)

type M1 struct{}

type M2 struct{}
```

<!--
The value of `D` determines which member, `M1` or `M2`, must be present.
-->
`D` 的值决定 `M1` 和 `M2` 中哪个成员必须存在。

<!--
### `+k8s:unionMember` {#tag-unionMember}

**Description:**

Indicates that this field is a member of a union. Exactly one member of a union
must be set.

**Stability level:** Stable

**Scopes:** struct fields, list values

**Arguments:**

* `union` (string, optional): the name of the union, if more than one exists.
* `memberName` (string, optional): the discriminator value for this member.
  Defaults to the field's name.

**Usage example:**
-->
### `+k8s:unionMember` {#tag-unionMember}

**描述**：

表示此字段是某个联合的成员。联合中必须恰好设置一个成员。

**稳定性级别**：Stable

**作用域**：结构体字段、列表值

**参数**：

* `union`（字符串，可选）：当存在多个联合时，联合的名称。
* `memberName`（字符串，可选）：此成员对应的判别器取值。默认为字段名。

**用法示例**：

```go
type MyStruct struct {
    // +k8s:unionMember(union: "union1")
    // +k8s:optional
    M1 *M1 `json:"u1m1"`

    // +k8s:unionMember(union: "union1")
    // +k8s:optional
    M2 *M2 `json:"u1m2"`
}

type M1 struct{}

type M2 struct{}
```

<!--
### `+k8s:unique` {#tag-unique}

**Description:**

Declares that a list field's elements are unique. You can use this tag together
with `+k8s:listType=atomic` to add a uniqueness constraint without changing the
list's merge semantics, or independently to specify uniqueness semantics.

**Stability level:** Stable

**Scopes:** struct fields, type definitions, list values, map keys, map values

**Payload:**

* `map | set` (required). With `map`, the identity of an element comes from the
  [`+k8s:listMapKey`](#tag-listMapKey) fields; with `set`, from the whole element
  value.

**Usage example:**
-->
### `+k8s:unique` {#tag-unique}

**描述**：

声明列表字段的元素是唯一的。你可以将此标签与 `+k8s:listType=atomic` 一起使用，
在不改变列表合并语义的情况下添加唯一性约束；也可以单独使用它来指定唯一性语义。

**稳定性级别**：Stable

**作用域**：结构体字段、类型定义、列表值、映射键、映射值

**载荷**：

* `map | set`（必需）。使用 `map` 时，元素的标识来自 [`+k8s:listMapKey`](#tag-listMapKey) 字段；
  使用 `set` 时，来自整个元素值。

**用法示例**：

```go
type MyStruct struct {
    // +k8s:listType=atomic
    // +k8s:unique=set
    Names []string `json:"names"`

    // +k8s:listType=atomic
    // +k8s:unique=map
    // +k8s:listMapKey=key
    Items []Item `json:"items"`
}
```

<!--
### `+k8s:update` {#tag-update}

**Description:**

Provides constraints on the allowed update operations of a field. You can specify
multiple constraints by using multiple tags.

Constraints for the k8s:update tag
-->
### `+k8s:update` {#tag-update}

**描述**：

对字段允许的更新操作施加约束。你可以使用多个标签来指定多个约束。

{{< table caption="k8s:update 标签的约束" >}}

<!--
| Constraint | Effect |
| --- | --- |
| `NoSet` | Prevents unset to set transitions. |
| `NoUnset` | Prevents set to unset transitions. |
| `NoModify` | Prevents value changes, but allows set and unset transitions. |
| `NoAddItem` | Prevents adding items to a slice or map. |
| `NoRemoveItem` | Prevents removing items from a slice or map. |
-->
| 约束 | 效果 |
| --- | --- |
| `NoSet` | 禁止从未设置到已设置的转换。 |
| `NoUnset` | 禁止从已设置到未设置的转换。 |
| `NoModify` | 禁止更改值，但允许设置和取消设置的转换。 |
| `NoAddItem` | 禁止向切片或映射中添加项。 |
| `NoRemoveItem` | 禁止从切片或映射中移除项。 |

{{< /table >}}

<!--
For non-pointer structs, `NoSet` and `NoUnset` have no effect, because you cannot
unset these fields. For slice and map fields, "unset" means `len == 0`. Slice
item identity for `NoAddItem` and `NoRemoveItem` comes from
[`+k8s:listType`](#tag-listType), [`+k8s:listMapKey`](#tag-listMapKey), and
[`+k8s:unique`](#tag-unique); for maps, the key is the item identity.

`NoModify` is not supported directly on slices or maps; use
`+k8s:eachVal=+k8s:update=NoModify` for per-item immutability. On lists,
`+k8s:eachVal=+k8s:update=NoModify` requires `listType=map` or `unique=map`,
because otherwise content changes are not detectable.
-->
对于非指针的结构体，`NoSet` 和 `NoUnset` 没有效果，因为你无法取消设置这些字段。
对于切片和映射字段，“未设置”指 `len == 0`。
`NoAddItem` 和 `NoRemoveItem` 的切片项标识来自 [`+k8s:listType`](#tag-listType)、
[`+k8s:listMapKey`](#tag-listMapKey) 和 [`+k8s:unique`](#tag-unique)；
对于映射，键就是项的标识。

`NoModify` 不支持直接用于切片或映射；要实现逐项的不可变性，
请使用 `+k8s:eachVal=+k8s:update=NoModify`。在列表上，
`+k8s:eachVal=+k8s:update=NoModify` 需要 `listType=map` 或 `unique=map`，
否则无法检测内容的变化。

<!--
**Stability level:** Stable

**Scopes:** struct fields, list values, map values

**Payload:**

* `NoSet | NoUnset | NoModify | NoAddItem | NoRemoveItem`

**Usage example:**
-->
**稳定性级别**：Stable

**作用域**：结构体字段、列表值、映射值

**载荷**：

* `NoSet | NoUnset | NoModify | NoAddItem | NoRemoveItem`

**用法示例**：

<!--
```go
type MyStruct struct {
    // Set-once: may be set at any time, but never changed or cleared.
    // +k8s:update=NoModify
    // +k8s:update=NoUnset
    SetOnce *string `json:"setOnce,omitempty"`

    // Must be set at creation or never.
    // +k8s:update=NoSet
    AtCreationOnly *string `json:"atCreationOnly,omitempty"`

    // Freeze the shape of the list; individual items may still change.
    // +k8s:listType=map
    // +k8s:listMapKey=key
    // +k8s:update=NoAddItem
    // +k8s:update=NoRemoveItem
    FrozenShape []Item `json:"frozenShape"`
}
```
-->
```go
type MyStruct struct {
    // 一次性设置：可以随时设置，但设置后不能更改或清除。
    // +k8s:update=NoModify
    // +k8s:update=NoUnset
    SetOnce *string `json:"setOnce,omitempty"`

    // 必须在创建时设置，否则永远不能设置。
    // +k8s:update=NoSet
    AtCreationOnly *string `json:"atCreationOnly,omitempty"`

    // 冻结列表的形态；各个项仍然可以更改。
    // +k8s:listType=map
    // +k8s:listMapKey=key
    // +k8s:update=NoAddItem
    // +k8s:update=NoRemoveItem
    FrozenShape []Item `json:"frozenShape"`
}
```

<!--
### `+k8s:zeroOrOneOfMember` {#tag-zeroOrOneOfMember}

**Description:**

Indicates that this field is a member of a zero-or-one-of union. A zero-or-one-of
union allows at most one member to be set. Unlike regular unions, having no
members set is valid.

**Stability level:** Stable

**Scopes:** struct fields, list values
-->
### `+k8s:zeroOrOneOfMember` {#tag-zeroOrOneOfMember}

**描述**：

表示此字段是某个“零或一”（zero-or-one-of）联合的成员。
“零或一”联合最多允许设置一个成员。与常规联合不同，不设置任何成员也是有效的。

**稳定性级别**：Stable

**作用域**：结构体字段、列表值

{{< alert color="caution" title="Caution" >}}
<!--
This tag is intended for sets of list items, applied through
[`+k8s:item`](#tag-item), rather than for struct fields directly.
-->
此标签旨在通过 [`+k8s:item`](#tag-item) 应用于列表项的集合，而不是直接用于结构体字段。
{{< /alert >}}

<!--
**Arguments:**

* `union` (string, optional): the name of the union, if more than one exists.
* `memberName` (string, optional): the custom member name for this member.
  Defaults to the field's name.

**Usage example:**
-->
**参数**：

* `union`（字符串，可选）：当存在多个联合时，联合的名称。
* `memberName`（字符串，可选）：此成员的自定义成员名。默认为字段名。

**用法示例**：

```go
type MyStruct struct {
    // +k8s:listType=map
    // +k8s:listMapKey=type
    // +k8s:item(type: "Approved")=+k8s:zeroOrOneOfMember
    // +k8s:item(type: "Denied")=+k8s:zeroOrOneOfMember
    Conditions []MyCondition `json:"conditions"`
}

type MyCondition struct {
    Type   string `json:"type"`
    Status string `json:"status"`
}
```

<!--
In this example, at most one of the "Approved" and "Denied" conditions can be
present. It is also valid for neither to be present.
-->
在此示例中，"Approved" 和 "Denied" 状况最多只能出现一个。二者都不出现也是有效的。

## {{% heading "whatsnext" %}}

<!--
* Read about [Feature Gates](/docs/reference/command-line-tools-reference/feature-gates/)
* Read [KEP-5073: Declarative Validation Of Kubernetes Native Types](https://kep.k8s.io/5073)
-->
* 了解[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
* 阅读 [KEP-5073: Declarative Validation Of Kubernetes Native Types](https://kep.k8s.io/5073)
