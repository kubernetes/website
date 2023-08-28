---
title: 使用名字空间标签来实施 Pod 安全性标准
content_type: task
weight: 250
---
<!--
title: Enforce Pod Security Standards with Namespace Labels
reviewers:
- tallclair
- liggitt
content_type: task
weight: 250
-->

<!--
Namespaces can be labeled to enforce the [Pod Security Standards](/docs/concepts/security/pod-security-standards). The three policies
[privileged](/docs/concepts/security/pod-security-standards/#privileged), [baseline](/docs/concepts/security/pod-security-standards/#baseline)
and [restricted](/docs/concepts/security/pod-security-standards/#restricted) broadly cover the security spectrum
and are implemented by the [Pod Security](/docs/concepts/security/pod-security-admission/) {{< glossary_tooltip
text="admission controller" term_id="admission-controller" >}}.
-->
名字空间可以打上标签以强制执行 [Pod 安全性标准](/zh-cn/docs/concepts/security/pod-security-standards)。
[特权（privileged）](/zh-cn/docs/concepts/security/pod-security-standards/#privileged)、
[基线（baseline）](/zh-cn/docs/concepts/security/pod-security-standards/#baseline)和
[受限（restricted）](/zh-cn/docs/concepts/security/pod-security-standards/#restricted)
这三种策略涵盖了广泛安全范围，并由
[Pod 安全](/zh-cn/docs/concepts/security/pod-security-admission/){{< glossary_tooltip text="准入控制器" term_id="admission-controller" >}}实现。

## {{% heading "prerequisites" %}}

<!--
Pod Security Admission was available by default in Kubernetes v1.23, as
a beta. From version 1.25 onwards, Pod Security Admission is generally
available.
-->
Pod 安全性准入（Pod Security Admission）在 Kubernetes v1.23 中作为 Beta 特性默认可用。
从 1.25 版本起，此特性进阶至正式发布（Generally Available）。

{{% version-check %}}

<!--
## Requiring the `baseline` Pod Security Standard with namespace labels
-->
## 通过名字空间标签来要求实施 `baseline` Pod 容器标准

<!--
This manifest defines a Namespace `my-baseline-namespace` that:

- _Blocks_ any pods that don't satisfy the `baseline` policy requirements.
- Generates a user-facing warning and adds an audit annotation to any created pod that does not
  meet the `restricted` policy requirements.
- Pins the versions of the `baseline` and `restricted` policies to v{{< skew currentVersion >}}.
-->
下面的清单定义了一个 `my-baseline-namespace` 名字空间，其中

- **阻止**任何不满足 `baseline` 策略要求的 Pod；
- 针对任何无法满足 `restricted` 策略要求的、已创建的 Pod 为用户生成警告信息，
  并添加审计注解；
- 将 `baseline` 和 `restricted` 策略的版本锁定到 v{{< skew currentVersion >}}。

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: my-baseline-namespace
  labels:
    pod-security.kubernetes.io/enforce: baseline
    pod-security.kubernetes.io/enforce-version: v{{< skew currentVersion >}}

    # 我们将这些标签设置为我们所 _期望_ 的 `enforce` 级别
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/audit-version: v{{< skew currentVersion >}}
    pod-security.kubernetes.io/warn: restricted
    pod-security.kubernetes.io/warn-version: v{{< skew currentVersion >}}
```

<!--
## Add labels to existing namespaces with `kubectl label`
-->
## 使用 `kubectl label` 为现有名字空间添加标签

{{< note >}}
<!--
When an `enforce` policy (or version) label is added or changed, the admission plugin will test
each pod in the namespace against the new policy. Violations are returned to the user as warnings.
-->
在添加或变更 `enforce` 策略（或版本）标签时，准入插件会测试名字空间中的每个
Pod 以检查其是否满足新的策略。不符合策略的情况会被以警告的形式返回给用户。
{{< /note >}}

<!--
It is helpful to apply the `--dry-run` flag when initially evaluating security profile changes for
namespaces. The Pod Security Standard checks will still be run in _dry run_ mode, giving you
information about how the new policy would treat existing pods, without actually updating a policy.
-->
在刚开始为名字空间评估安全性策略变更时，使用 `--dry-run` 标志是很有用的。
Pod 安全性标准会在 **dry run（试运行）**
模式下运行，在这种模式下会生成新策略如何处理现有 Pod 的信息，
但不会真正更新策略。

```shell
kubectl label --dry-run=server --overwrite ns --all \
    pod-security.kubernetes.io/enforce=baseline
```

<!--
### Applying to all namespaces
-->
### 应用到所有名字空间

<!--
If you're just getting started with the Pod Security Standards, a suitable first step would be to
configure all namespaces with audit annotations for a stricter level such as `baseline`:
-->
如果你是刚刚开始使用 Pod 安全性标准，一种比较合适的初始步骤是针对所有名字空间为类似
`baseline` 这种比较严格的安全级别配置审计注解。

```shell
kubectl label --overwrite ns --all \
  pod-security.kubernetes.io/audit=baseline \
  pod-security.kubernetes.io/warn=baseline
```

<!--
Note that this is not setting an enforce level, so that namespaces that haven't been explicitly
evaluated can be distinguished. You can list namespaces without an explicitly set enforce level
using this command:
-->
注意，这里没有设置 enforce 级别，因而没有被显式评估的名字空间可以被识别出来。
你可以使用下面的命令列举那些没有显式设置 enforce 级别的名字空间：

```shell
kubectl get namespaces --selector='!pod-security.kubernetes.io/enforce'
```

<!--
### Applying to a single namespace
-->
### 应用到单个名字空间

<!--
You can update a specific namespace as well. This command adds the `enforce=restricted`
policy to `my-existing-namespace`, pinning the restricted policy version to v{{< skew currentVersion >}}.
-->
你也可以更新特定的名字空间。下面的命令将 `enforce=restricted` 策略应用到
`my-existing-namespace` 名字空间，将 restricted 策略的版本锁定到 v{{< skew currentVersion >}}。

```shell
kubectl label --overwrite ns my-existing-namespace \
  pod-security.kubernetes.io/enforce=restricted \
  pod-security.kubernetes.io/enforce-version=v{{< skew currentVersion >}}
```

