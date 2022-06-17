---
title: 使用名字空間標籤來實施 Pod 安全性標準
content_type: task
min-kubernetes-server-version: v1.22
---
<!--
title: Enforce Pod Security Standards with Namespace Labels
reviewers:
- tallclair
- liggitt
content_type: task
min-kubernetes-server-version: v1.22
-->

<!--
Namespaces can be labeled to enforce the [Pod Security Standards](/docs/concepts/security/pod-security-standards).The three policies
[privileged](/docs/concepts/security/pod-security-standards/#privileged), [baseline](/docs/concepts/security/pod-security-standards/#baseline)
and [restricted](/docs/concepts/security/pod-security-standards/#restricted) broadly cover the security spectrum
and are implemented by the [Pod Security](/docs/concepts/security/pod-security-admission/)
-->
[特權（privileged）](/zh-cn/docs/concepts/security/pod-security-standards/#privileged)、
[基線（baseline）](/zh-cn/docs/concepts/security/pod-security-standards/#baseline)和
[受限（restricted）](/zh-cn/docs/concepts/security/pod-security-standards/#restricted) 
這三種策略涵蓋了廣泛安全範圍，並由 [Pod 安全](/zh-cn/docs/concepts/security/pod-security-admission/)
 {{< glossary_tooltip text="准入控制器" term_id="admission-controller" >}}實現。

## {{% heading "prerequisites" %}}

{{% version-check %}}

<!--
- Ensure the `PodSecurity` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-alpha-or-beta-features) is enabled.
-->
- 確保 `PodSecurity` [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-alpha-or-beta-features)已被啟用。

<!--
## Requiring the `baseline` Pod Security Standard with namespace labels
-->
## 透過名字空間標籤來要求實施 `baseline` Pod 容器標準

<!--
This manifest defines a Namespace `my-baseline-namespace` that:

- _Blocks_ any pods that don't satisfy the `baseline` policy requirements.
- Generates a user-facing warning and adds an audit annotation to any created pod that does not
  meet the `restricted` policy requirements.
- Pins the versions of the `baseline` and `restricted` policies to v{{< skew latestVersion >}}.
-->
下面的清單定義了一個 `my-baseline-namespace` 名字空間，其中

- *阻止*任何不滿足 `baseline` 策略要求的 Pods；
- 針對任何無法滿足 `restricted` 策略要求的、已建立的 Pod 為使用者生成警告資訊，
  並新增審計註解；
- 將 `baseline` 和 `restricted` 策略的版本鎖定到 v{{< skew latestVersion >}}。

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: my-baseline-namespace
  labels:
    pod-security.kubernetes.io/enforce: baseline
    pod-security.kubernetes.io/enforce-version: v{{< skew latestVersion >}}

    # 我們將這些標籤設定為我們所 _期望_ 的 `enforce` 級別
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/audit-version: v{{< skew latestVersion >}}
    pod-security.kubernetes.io/warn: restricted
    pod-security.kubernetes.io/warn-version: v{{< skew latestVersion >}}
```

<!--
## Add labels to existing namespaces with `kubectl label`
-->
## 使用 `kubectl label` 為現有名字空間新增標籤

{{< note >}}
<!--
When an `enforce` policy (or version) label is added or changed, the admission plugin will test
each pod in the namespace against the new policy. Violations are returned to the user as warnings.
-->
在新增或變更 `enforce` 策略（或版本）標籤時，准入外掛會測試名字空間中的每個
Pod 以檢查其是否滿足新的策略。不符合策略的情況會被以警告的形式返回給使用者。
{{< /note >}}

<!--
It is helpful to apply the `--dry-run` flag when initially evaluating security profile changes for
namespaces. The Pod Security Standard checks will still be run in _dry run_ mode, giving you
information about how the new policy would treat existing pods, without actually updating a policy.
-->
在剛開始為名字空間評估安全性策略變更時，使用 `--dry-run` 標誌是很有用的。
Pod 安全性標準會在 _dry run（試執行）_
模式下執行，在這種模式下會生成新策略如何處理現有 Pod 的資訊，
但不會真正更新策略。

```shell
kubectl label --dry-run=server --overwrite ns --all \
    pod-security.kubernetes.io/enforce=baseline
```

<!--
### Applying to all namespaces
-->
### 應用到所有名字空間

<!--
If you're just getting started with the Pod Security Standards, a suitable first step would be to
configure all namespaces with audit annotations for a stricter level such as `baseline`:
-->
如果你是剛剛開始使用 Pod 安全性標準，一種比較合適的初始步驟是針對所有名字空間為類似
`baseline` 這種比較嚴格的安全級別配置審計註解。

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
注意，這裡沒有設定 enforce 級別，因而沒有被顯式評估的名字空間可以被識別出來。
你可以使用下面的命令列舉那些沒有顯式設定 enforce 級別的名字空間：

```shell
kubectl get namespaces --selector='!pod-security.kubernetes.io/enforce'
```

<!--
### Applying to a single namespace
-->
### 應用到單個名字空間

<!--
You can update a specific namespace as well. This command adds the `enforce=restricted`
policy to `my-existing-namespace`, pinning the restricted policy version to v{{< skew latestVersion >}}.
-->
你也可以更新特定的名字空間。下面的命令將 `enforce=restricted` 策略應用到
`my-existing-namespace` 名字空間，將 restricted 策略的版本鎖定到 v{{< skew latestVersion >}}。

```shell
kubectl label --overwrite ns my-existing-namespace \
  pod-security.kubernetes.io/enforce=restricted \
  pod-security.kubernetes.io/enforce-version=v{{< skew latestVersion >}}
```

