---
title: Pod 安全性准入
description: >
  對 Pod 安全性准入控制器的概述，Pod 安全性准入控制器可以實施 Pod 安全性標準。

content_type: concept
weight: 20
min-kubernetes-server-version: v1.22
---
<!--
reviewers:
- tallclair
- liggitt
title: Pod Security Admission
description: >
  An overview of the Pod Security Admission Controller, which can enforce the Pod Security
  Standards.
content_type: concept
weight: 20
min-kubernetes-server-version: v1.22
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.23" state="beta" >}}

<!--
The Kubernetes [Pod Security Standards](/docs/concepts/security/pod-security-standards/) define
different isolation levels for Pods. These standards let you define how you want to restrict the
behavior of pods in a clear, consistent fashion.
-->
Kubernetes [Pod 安全性標準（Security Standards）](/zh-cn/docs/concepts/security/pod-security-standards/)
為 Pod 定義不同的隔離級別。這些標準能夠讓你以一種清晰、一致的方式定義如何限制 Pod 行為。

<!--
As a beta feature, Kubernetes offers a built-in _Pod Security_ {{< glossary_tooltip
text="admission controller" term_id="admission-controller" >}}, the successor
to [PodSecurityPolicies](/docs/concepts/security/pod-security-policy/). Pod security restrictions
are applied at the {{< glossary_tooltip text="namespace" term_id="namespace" >}} level when pods
are created.
-->
作為一項 Beta 功能特性，Kubernetes 提供一種內建的 _Pod 安全性_ 
{{< glossary_tooltip text="准入控制器" term_id="admission-controller" >}}，
作為 [PodSecurityPolicies](/zh-cn/docs/concepts/security/pod-security-policy/)
特性的後繼演化版本。Pod 安全性限制是在 Pod 被建立時在
{{< glossary_tooltip text="名字空間" term_id="namespace" >}}層面實施的。

{{< note >}}
<!--
The PodSecurityPolicy API is deprecated and will be 
[removed](/docs/reference/using-api/deprecation-guide/#v1-25) from Kubernetes in v1.25.
-->
PodSecurityPolicy API 已經被廢棄，會在 Kubernetes v1.25 發行版中
[移除](/zh-cn/docs/reference/using-api/deprecation-guide/#v1-25)。
{{< /note >}}

<!-- body -->

<!--
## {{% heading "prerequisites" %}}

To use this mechanism, your cluster must enforce Pod Security admission.

### Built-in Pod Security admission enforcement
-->
## {{% heading "prerequisites" %}}

要使用此機制，你的叢集必須強制執行 Pod 安全准入。

### 內建 Pod 安全准入強制執行

<!--
In Kubernetes v{{< skew currentVersion >}}, the `PodSecurity` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
is a beta feature and is enabled by default. You must have this feature gate enabled.
If you are running a different version of Kubernetes, consult the documentation for that release.
-->
在 Kubernetes v{{< skew currentVersion >}} 中，`PodSecurity`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)是一項 Beta 特性，
預設被啟用。你必須啟用此功能門控。如果你執行的是不同版本的 Kubernetes，請查閱該版本的文件。



<!--
### Alternative: installing the `PodSecurity` admission webhook {#webhook}

The `PodSecurity` admission logic is also available as a [validating admission webhook](https://git.k8s.io/pod-security-admission/webhook). This implementation is also beta.
For environments where the built-in `PodSecurity` admission plugin cannot be enabled, you can instead enable that logic via a validating admission webhook.
-->
### 替代方案：安裝 `PodSecurity` 准入 Webhook   {#webhook}

`PodSecurity` 准入邏輯也可用作[驗證性准入 Webhook](https://git.k8s.io/pod-security-admission/webhook)。
該實現也是 Beta 版本。
對於無法啟用內建 `PodSecurity` 准入外掛的環境，你可以改為透過驗證准入 Webhook 啟用該邏輯。

<!--
A pre-built container image, certificate generation scripts, and example manifests
are available at [https://git.k8s.io/pod-security-admission/webhook](https://git.k8s.io/pod-security-admission/webhook).

To install:
-->
在 [https://git.k8s.io/pod-security-admission/webhook](https://git.k8s.io/pod-security-admission/webhook)
上可以找到一個預先構建的容器映象、證書生成指令碼以及一些示例性質的清單。

```shell
git clone git@github.com:kubernetes/pod-security-admission.git
cd pod-security-admission/webhook
make certs
kubectl apply -k .
```

{{< note >}}
<!--
The generated certificate is valid for 2 years. Before it expires,
regenerate the certificate or remove the webhook in favor of the built-in admission plugin.
-->
所生成的證書合法期限為 2 年。在證書過期之前，
需要重新生成證書或者去掉 Webhook 以使用內建的准入外掛。
{{< /note >}}

<!-- body -->

<!--
## Pod Security levels
-->
## Pod 安全性級別   {#pod-security-levels}

<!--
Pod Security admission places requirements on a Pod's [Security
Context](/docs/tasks/configure-pod-container/security-context/) and other related fields according
to the three levels defined by the [Pod Security
Standards](/docs/concepts/security/pod-security-standards): `privileged`, `baseline`, and
`restricted`. Refer to the [Pod Security Standards](/docs/concepts/security/pod-security-standards)
page for an in-depth look at those requirements.
-->
Pod 安全性准入外掛對 Pod 的[安全性上下文](/zh-cn/docs/tasks/configure-pod-container/security-context/)
有一定的要求，並且依據 [Pod 安全性標準](/zh-cn/docs/concepts/security/pod-security-standards)
所定義的三個級別（`privileged`、`baseline` 和 `restricted`）對其他欄位也有要求。
關於這些需求的更進一步討論，請參閱
[Pod 安全性標準](/zh-cn/docs/concepts/security/pod-security-standards/)頁面。

<!--
## Pod Security Admission labels for namespaces

Once the feature is enabled or the webhook is installed, you can configure namespaces to define the admission
control mode you want to use for pod security in each namespace. Kubernetes defines a set of 
{{< glossary_tooltip term_id="label" text="labels" >}} that you can set to define which of the 
predefined Pod Security Standard levels you want to use for a namespace. The label you select
defines what action the {{< glossary_tooltip text="control plane" term_id="control-plane" >}}
takes if a potential violation is detected:
-->
## 為名字空間設定 Pod 安全性准入控制標籤

一旦特性被啟用或者安裝了 Webhook，你可以配置名字空間以定義每個名字空間中
Pod 安全性准入控制模式。
Kubernetes 定義了一組{{< glossary_tooltip term_id="label" text="標籤" >}}，
你可以設定這些標籤來定義某個名字空間上要使用的預定義的 Pod 安全性標準級別。
你所選擇的標籤定義了檢測到潛在違例時，{{< glossary_tooltip text="控制面" term_id="control-plane" >}}
要採取什麼樣的動作。

<!--
{{< table caption="Pod Security Admission modes" >}}
Mode | Description
:---------|:------------
**enforce** | Policy violations will cause the pod to be rejected.
**audit** | Policy violations will trigger the addition of an audit annotation to the event recorded in the [audit log](/docs/tasks/debug/debug-cluster/audit/), but are otherwise allowed.
**warn** | Policy violations will trigger a user-facing warning, but are otherwise allowed.
{{< /table >}}
-->
{{< table caption="Pod 安全准入模式" >}}
模式 | 描述
:---------|:------------
**enforce** | 策略違例會導致 Pod 被拒絕
**audit** | 策略違例會觸發[審計日誌](/zh-cn/docs/tasks/debug/debug-cluster/audit/)中記錄新事件時新增審計註解；但是 Pod 仍是被接受的。
**warn** | 策略違例會觸發使用者可見的警告資訊，但是 Pod 仍是被接受的。
{{< /table >}}

<!--
A namespace can configure any or all modes, or even set a different level for different modes.

For each mode, there are two labels that determine the policy used:
-->
名字空間可以配置任何一種或者所有模式，或者甚至為不同的模式設定不同的級別。

對於每種模式，決定所使用策略的標籤有兩個：

<!--
# The per-mode level label indicates which policy level to apply for the mode.
#
# MODE must be one of `enforce`, `audit`, or `warn`.
# LEVEL must be one of `privileged`, `baseline`, or `restricted`.
pod-security.kubernetes.io/<MODE>: <LEVEL>

# Optional: per-mode version label that can be used to pin the policy to the
# version that shipped with a given Kubernetes minor version (for example v{{< skew latestVersion >}}).
#
# MODE must be one of `enforce`, `audit`, or `warn`.
# VERSION must be a valid Kubernetes minor version, or `latest`.
pod-security.kubernetes.io/<MODE>-version: <VERSION>
-->
```
# 針對模式的級別標籤用來標示針對該模式所應用的策略級別
#
# MODE 必須是 `enforce`、`audit` 或 `warn` 之一
# LEVEL 必須是 `privileged`、baseline` 或 `restricted` 之一
pod-security.kubernetes.io/<MODE>: <LEVEL>

# 可選：針對每個模式版本的版本標籤可以將策略鎖定到
# 給定 Kubernetes 小版本號所附帶的版本（例如 v{{< skew latestVersion >}}）
#
# MODE 必須是 `enforce`、`audit` 或 `warn` 之一
# VERSION 必須是一個合法的 Kubernetes 小版本號或者 `latest`
pod-security.kubernetes.io/<MODE>-version: <VERSION>
```

<!--
Check out [Enforce Pod Security Standards with Namespace Labels](/docs/tasks/configure-pod-container/enforce-standards-namespace-labels) to see example usage.
-->
關於用法示例，可參閱
[使用名字空間標籤來強制實施 Pod 安全標準](/zh-cn/docs/tasks/configure-pod-container/enforce-standards-namespace-labels/)。

<!--
## Workload resources and Pod templates

Pods are often created indirectly, by creating a [workload
object](/docs/concepts/workloads/controllers/) such as a {{< glossary_tooltip
term_id="deployment" >}} or {{< glossary_tooltip term_id="job">}}. The workload object defines a
_Pod template_ and a {{< glossary_tooltip term_id="controller" text="controller" >}} for the
workload resource creates Pods based on that template. To help catch violations early, both the
audit and warning modes are applied to the workload resources. However, enforce mode is **not**
applied to workload resources, only to the resulting pod objects.
-->
## 負載資源和 Pod 模板    {#workload-resources-and-pod-templates}

Pod 通常是透過建立 {{< glossary_tooltip term_id="deployment" >}} 或
{{< glossary_tooltip term_id="job">}} 這類[工作負載物件](/zh-cn/docs/concepts/workloads/controllers/)
來間接建立的。工作負載物件為工作負載資源定義一個 _Pod 模板_ 和一個對應的
負責基於該模板來建立 Pod 的{{< glossary_tooltip term_id="controller" text="控制器" >}}。
為了儘早地捕獲違例狀況，`audit` 和 `warn` 模式都應用到負載資源。
不過，`enforce` 模式並 **不** 應用到工作負載資源，僅應用到所生成的 Pod 物件上。 

<!--
## Exemptions

You can define _exemptions_ from pod security enforcement in order to allow the creation of pods that
would have otherwise been prohibited due to the policy associated with a given namespace.
Exemptions can be statically configured in the
[Admission Controller configuration](/docs/tasks/configure-pod-container/enforce-standards-admission-controller/#configure-the-admission-controller).
-->
## 豁免   {#exemptions}

你可以為 Pod 安全性的實施設定 _豁免（Exemptions）_ 規則，
從而允許建立一些本來會被與給定名字空間相關的策略所禁止的 Pod。
豁免規則可以在[准入控制器配置](/zh-cn/docs/tasks/configure-pod-container/enforce-standards-admission-controller/#configure-the-admission-controller)
中靜態配置。

<!--
Exemptions must be explicitly enumerated. Requests meeting exemption criteria are _ignored_ by the
Admission Controller (all `enforce`, `audit` and `warn` behaviors are skipped). Exemption dimensions include:
-->
豁免規則可以顯式列舉。滿足豁免標準的請求會被准入控制器 _忽略_
（所有 `enforce`、`audit` 和 `warn` 行為都會被略過）。
豁免的維度包括：

<!--
- **Usernames:** requests from users with an exempt authenticated (or impersonated) username are
  ignored.
- **RuntimeClassNames:** pods and [workload resources](#workload-resources-and-pod-templates) specifying an exempt runtime class name are
  ignored.
- **Namespaces:** pods and [workload resources](#workload-resources-and-pod-templates) in an exempt namespace are ignored.
-->
- **Username：** 來自使用者名稱已被豁免的、已認證的（或偽裝的）的使用者的請求會被忽略。
- **RuntimeClassName：** 指定了已豁免的執行時類名稱的 Pod
  和[負載資源](#workload-resources-and-pod-templates)會被忽略。
- **Namespace：** 位於被豁免的名字空間中的 Pod 和[負載資源](#workload-resources-and-pod-templates) 
  會被忽略。

{{< caution >}}
<!--
Most pods are created by a controller in response to a [workload
resource](#workload-resources-and-pod-templates), meaning that exempting an end user will only
exempt them from enforcement when creating pods directly, but not when creating a workload resource.
Controller service accounts (such as `system:serviceaccount:kube-system:replicaset-controller`)
should generally not be exempted, as doing so would implicitly exempt any user that can create the
corresponding workload resource.
-->
大多數 Pod 是作為對[工作負載資源](#workload-resources-and-pod-templates)的響應，
由控制器所建立的，這意味著為某終端使用者提供豁免時，只會當該使用者直接建立 Pod
時對其實施安全策略的豁免。使用者建立工作負載資源時不會被豁免。
控制器服務賬號（例如：`system:serviceaccount:kube-system:replicaset-controller`）
通常不應該被豁免，因為豁免這類服務賬號隱含著對所有能夠建立對應工作負載資源的使用者豁免。
{{< /caution >}}

<!--
Updates to the following pod fields are exempt from policy checks, meaning that if a pod update
request only changes these fields, it will not be denied even if the pod is in violation of the
current policy level:
-->
策略檢查時會對以下 Pod 欄位的更新操作予以豁免，這意味著如果 Pod
更新請求僅改變這些欄位時，即使 Pod 違反了當前的策略級別，請求也不會被拒絕。

<!--
- Any metadata updates **except** changes to the seccomp or AppArmor annotations:
  - `seccomp.security.alpha.kubernetes.io/pod` (deprecated)
  - `container.seccomp.security.alpha.kubernetes.io/*` (deprecated)
  - `container.apparmor.security.beta.kubernetes.io/*`
- Valid updates to `.spec.activeDeadlineSeconds`
- Valid updates to `.spec.tolerations`
-->
- 除了對 seccomp 或 AppArmor 註解之外的所有 meatadata 更新操作：
  - `seccomp.security.alpha.kubernetes.io/pod` （已棄用）
  - `container.seccomp.security.alpha.kubernetes.io/*` （已棄用）
  - `container.apparmor.security.beta.kubernetes.io/*`
- 對 `.spec.activeDeadlineSeconds` 的合法更新
- 對 `.spec.tolerations` 的合法更新

## {{% heading "whatsnext" %}}

<!--
- [Pod Security Standards](/docs/concepts/security/pod-security-standards)
- [Enforcing Pod Security Standards](/docs/setup/best-practices/enforcing-pod-security-standards)
- [Enforce Pod Security Standards by Configuring the Built-in Admission Controller](/docs/tasks/configure-pod-container/enforce-standards-admission-controller)
- [Enforce Pod Security Standards with Namespace Labels](/docs/tasks/configure-pod-container/enforce-standards-namespace-labels)
- [Migrate from PodSecurityPolicy to the Built-In PodSecurity Admission Controller](/docs/tasks/configure-pod-container/migrate-from-psp)
-->
- [Pod 安全性標準](/zh-cn/docs/concepts/security/pod-security-standards/)
- [強制實施 Pod 安全性標準](/zh-cn/docs/setup/best-practices/enforcing-pod-security-standards/)
- [透過配置內建的准入控制器強制實施 Pod 安全性標準](/zh-cn/docs/tasks/configure-pod-container/enforce-standards-admission-controller/)
- [使用名字空間標籤來實施 Pod 安全性標準](/zh-cn/docs/tasks/configure-pod-container/enforce-standards-namespace-labels/)
- [從 PodSecurityPolicy 遷移到內建的 PodSecurity 准入控制器](/zh-cn/docs/tasks/configure-pod-container/migrate-from-psp/)

