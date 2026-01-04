---
title: 從 PodSecurityPolicy 遷移到內置的 PodSecurity 准入控制器
content_type: task
min-kubernetes-server-version: v1.22
weight: 260
---

<!--
title: Migrate from PodSecurityPolicy to the Built-In PodSecurity Admission Controller
reviewers:
- tallclair
- liggitt
content_type: task
min-kubernetes-server-version: v1.22
weight: 260
-->

<!-- overview -->

<!--
This page describes the process of migrating from PodSecurityPolicies to the built-in PodSecurity
admission controller. This can be done effectively using a combination of dry-run and `audit` and
`warn` modes, although this becomes harder if mutating PSPs are used.
-->
本頁面描述從 PodSecurityPolicy 遷移到內置的 PodSecurity 准入控制器的過程。
這一遷移過程可以通過綜合使用試運行、`audit` 和 `warn` 模式等來實現，
儘管在使用了變更式 PSP 時會變得有些困難。

## {{% heading "prerequisites" %}}

{{% version-check %}}

<!--
If you are currently running a version of Kubernetes other than
{{< skew currentVersion >}}, you may want to switch to viewing this
page in the documentation for the version of Kubernetes that you
are actually running.
-->
如果你目前運行的 Kubernetes 版本不是 {{< skew currentVersion >}}，
你可能要切換本頁面以查閱你實際所運行的 Kubernetes 版本文檔。

<!--
This page assumes you are already familiar with the basic [Pod Security Admission](/docs/concepts/security/pod-security-admission/)
concepts.
-->
本頁面假定你已經熟悉 [Pod 安全性准入](/zh-cn/docs/concepts/security/pod-security-admission/)的基本概念。

<!-- body -->

<!--
## Overall approach

There are multiple strategies you can take for migrating from PodSecurityPolicy to Pod Security
Admission. The following steps are one possible migration path, with a goal of minimizing both the
risks of a production outage and of a security gap.
-->
## 方法概覽    {#overall-approach}

你可以採取多種策略來完成從 PodSecurityPolicy 到 Pod 安全性准入
（Pod Security Admission）的遷移。
下面是一種可能的遷移路徑，其目標是儘可能降低生產環境不可用的風險，
以及安全性仍然不足的風險。

<!-- Keep section header numbering in sync with this list. -->
<!--
0. Decide whether Pod Security Admission is the right fit for your use case.
1. Review namespace permissions
2. Simplify & standardize PodSecurityPolicies
3. Update namespaces
   1. Identify an appropriate Pod Security level
   2. Verify the Pod Security level
   3. Enforce the Pod Security level
   4. Bypass PodSecurityPolicy
4. Review namespace creation processes
5. Disable PodSecurityPolicy
-->
0. 確定 Pod 安全性准入是否對於你的使用場景而言比較合適。
1. 審查名字空間訪問權限。
2. 簡化、標準化 PodSecurityPolicy。
3. 更新名字空間：
   1. 確定合適的 Pod 安全性級別；
   2. 驗證該 Pod 安全性級別可工作；
   3. 實施該 Pod 安全性級別；
   4. 繞過 PodSecurityPolicy。
4. 審閱名字空間創建過程。
5. 禁用 PodSecurityPolicy。

<!--
## 0. Decide whether Pod Security Admission is right for you {#is-psa-right-for-you}
-->
## 0. 確定是否 Pod 安全性准入適合你  {#is-psa-right-for-you}

<!--
Pod Security Admission was designed to meet the most common security needs out of the box, and to
provide a standard set of security levels across clusters. However, it is less flexible than
PodSecurityPolicy. Notably, the following features are supported by PodSecurityPolicy but not Pod
Security Admission:
-->
Pod 安全性准入被設計用來直接滿足最常見的安全性需求，並提供一組可用於多個叢集的安全性級別。
不過，這一機制比 PodSecurityPolicy 的靈活度要低。
值得注意的是，PodSecurityPolicy 所支持的以下特性是 Pod 安全性准入所不支持的：

<!--
- **Setting default security constraints** - Pod Security Admission is a non-mutating admission
  controller, meaning it won't modify pods before validating them. If you were relying on this
  aspect of PSP, you will need to either modify your workloads to meet the Pod Security constraints,
  or use a [Mutating Admission Webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/)
  to make those changes. See [Simplify & Standardize PodSecurityPolicies](#simplify-psps) below for more detail.
-->
- **設置預設的安全性約束** - Pod 安全性准入是一個非變更性質的准入控制器，
  這就意味着它不會在對 Pod 進行合法性檢查之前更改其設定。如果你之前依賴於 PSP 的這方面能力，
  你或者需要更改你的負載以滿足 Pod 安全性約束，或者需要使用一個
  [變更性質的准入 Webhook](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/)
  來執行相應的變更。進一步的細節可參見後文的[簡化和標準化 PodSecurityPolicy](#simplify-psps)。
<!--
- **Fine-grained control over policy definition** - Pod Security Admission only supports
  [3 standard levels](/docs/concepts/security/pod-security-standards/).
  If you require more control over specific constraints, then you will need to use a
  [Validating Admission Webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/)
  to enforce those policies.
-->
- **對策略定義的細粒度控制** - Pod 安全性准入僅支持
  [三種標準級別](/zh-cn/docs/concepts/security/pod-security-standards/)。
  如果你需要對特定的約束施加更多的控制，你就需要使用一個
  [驗證性質的准入 Webhook](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/)
  以實施這列策略。
<!--
- **Sub-namespace policy granularity** - PodSecurityPolicy lets you bind different policies to
  different Service Accounts or users, even within a single namespace. This approach has many
  pitfalls and is not recommended, but if you require this feature anyway you will
  need to use a 3rd party webhook instead. The exception to this is if you only need to completely exempt
  specific users or [RuntimeClasses](/docs/concepts/containers/runtime-class/), in which case Pod
  Security Admission does expose some
  [static configuration for exemptions](/docs/concepts/security/pod-security-admission/#exemptions).
-->
- **粒度小於名字空間的策略** - PodSecurityPolicy 允許你爲不同的服務賬戶或使用者綁定不同策略，
  即使這些服務賬戶或使用者隸屬於同一個名字空間。這一方法有很多缺陷，不建議使用。
  不過如果你的確需要這種功能，你就需要使用第三方的 Webhook。
  唯一的例外是當你只需要完全針對某使用者或者
  [RuntimeClasses](/zh-cn/docs/concepts/containers/runtime-class/) 賦予豁免規則時，
  Pod 安全性准入的確也爲豁免規則暴露一些
  [靜態設定](/zh-cn/docs/concepts/security/pod-security-admission/#exemptions)。

<!--
Even if Pod Security Admission does not meet all of your needs it was designed to be _complementary_
to other policy enforcement mechanisms, and can provide a useful fallback running alongside other
admission webhooks.
-->
即便 Pod 安全性准入無法滿足你的所有需求，該機制也是設計用作其他策略實施機制的
**補充**，因此可以和其他准入 Webhook 一起運行，進而提供一種有用的兜底機制。

<!--
## 1. Review namespace permissions {#review-namespace-permissions}
-->
## 1. 審查名字空間訪問權限  {#review-namespace-permissions}

<!--
Pod Security Admission is controlled by [labels on
namespaces](/docs/concepts/security/pod-security-admission/#pod-security-admission-labels-for-namespaces).
This means that anyone who can update (or patch or create) a namespace can also modify the Pod
Security level for that namespace, which could be used to bypass a more restrictive policy. Before
proceeding, ensure that only trusted, privileged users have these namespace permissions. It is not
recommended to grant these powerful permissions to users that shouldn't have elevated permissions,
but if you must you will need to use an
[admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/)
to place additional restrictions on setting Pod Security labels on Namespace objects.
-->
Pod 安全性准入是通過[名字空間上的標籤](/zh-cn/docs/concepts/security/pod-security-admission/#pod-security-admission-labels-for-namespaces)
來控制的。這也就是說，任何能夠更新（或通過 patch 部分更新或創建）
名字空間的人都可以更改該名字空間的 Pod 安全性級別，而這可能會被利用來繞過約束性更強的策略。
在繼續執行遷移操作之前，請確保只有被信任的、有特權的使用者具有這類名字空間訪問權限。
不建議將這類強大的訪問權限授予不應獲得權限提升的使用者，不過如果你必須這樣做，
你需要使用一個[准入 Webhook](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/)
來針對爲 Namespace 對象設置 Pod 安全性級別設置額外的約束。

<!--
## 2. Simplify & standardize PodSecurityPolicies {#simplify-psps}
-->
## 2. 簡化、標準化 PodSecurityPolicy    {#simplify-psps}

<!--
In this section, you will reduce mutating PodSecurityPolicies and remove options that are outside
the scope of the Pod Security Standards. You should make the changes recommended here to an offline
copy of the original PodSecurityPolicy being modified. The cloned PSP should have a different
name that is alphabetically before the original (for example, prepend a `0` to it). Do not create the
new policies in Kubernetes yet - that will be covered in the [Rollout the updated
policies](#psp-update-rollout) section below.
-->
在本節中，你會削減變更性質的 PodSecurityPolicy，去掉 Pod 安全性標準範疇之外的選項。
針對要修改的、已存在的 PodSecurityPolicy，你應該將這裏所建議的更改寫入到其離線副本中。
所克隆的 PSP 應該與原來的副本名字不同，並且按字母序要排到原副本之前
（例如，可以向 PSP 名字前加一個 `0`）。
先不要在 Kubernetes 中創建新的策略 -
這類操作會在後文的[推出更新的策略](#psp-update-rollout)部分討論。

<!--
### 2.a. Eliminate purely mutating fields {#eliminate-mutating-fields}
-->
### 2.a. 去掉純粹變更性質的字段    {#eliminating-mutaging-fields}

<!--
If a PodSecurityPolicy is mutating pods, then you could end up with pods that don't meet the Pod
Security level requirements when you finally turn PodSecurityPolicy off. In order to avoid this, you
should eliminate all PSP mutation prior to switching over. Unfortunately PSP does not cleanly
separate mutating & validating fields, so this is not a straightforward migration.
-->
如果某個 PodSecurityPolicy 能夠變更字段，你可能會在關掉 PodSecurityPolicy
時發現有些 Pod 無法滿足 Pod 安全性級別。爲避免這類狀況，
你應該在執行切換操作之前去掉所有 PSP 的變更操作。
不幸的是，PSP 沒有對變更性和驗證性字段做清晰的區分，所以這一遷移操作也不夠簡單直接。

<!--
You can start by eliminating the fields that are purely mutating, and don't have any bearing on the
validating policy. These fields (also listed in the
[Mapping PodSecurityPolicies to Pod Security Standards](/docs/reference/access-authn-authz/psp-to-pod-security-standards/)
reference) are:
-->
你可以先去掉那些純粹變更性質的字段，留下驗證策略中的其他內容。
這些字段（也列舉於[將 PodSecurityPolicy 映射到 Pod 安全性標準](/zh-cn/docs/reference/access-authn-authz/psp-to-pod-security-standards/)參考中）
包括：

<!--
- `.spec.defaultAllowPrivilegeEscalation`
- `.spec.runtimeClass.defaultRuntimeClassName`
- `.metadata.annotations['seccomp.security.alpha.kubernetes.io/defaultProfileName']`
- `.metadata.annotations['apparmor.security.beta.kubernetes.io/defaultProfileName']`
- `.spec.defaultAddCapabilities` - Although technically a mutating & validating field, these should
  be merged into `.spec.allowedCapabilities` which performs the same validation without mutation.
-->
- `.spec.defaultAllowPrivilegeEscalation`
- `.spec.runtimeClass.defaultRuntimeClassName`
- `.metadata.annotations['seccomp.security.alpha.kubernetes.io/defaultProfileName']`
- `.metadata.annotations['apparmor.security.beta.kubernetes.io/defaultProfileName']`
- `.spec.defaultAddCapabilities` - 儘管理論上是一個混合了變更性與驗證性功能的字段，
  這裏的設置應該被合併到 `.spec.allowedCapabilities` 中，後者會執行相同的驗證操作，
  但不會執行任何變更動作。

{{< caution >}}
<!--
Removing these could result in workloads missing required configuration, and cause problems. See
[Rollout the updated policies](#psp-update-rollout) below for advice on how to roll these changes
out safely.
-->
刪除這些字段可能導致負載缺少所需的設定資訊，進而導致一些問題。
參見後文[退出更新的策略](#psp-update-rollout)以獲得如何安全地將這些變更上線的建議。
{{< /caution >}}

<!--
### 2.b. Eliminate options not covered by the Pod Security Standards {#eliminate-non-standard-options}
-->
### 2.b. 去掉 Pod 安全性標準未涉及的選項 {#eliminate-non-standard-options}

<!--
There are several fields in PodSecurityPolicy that are not covered by the Pod Security Standards. If
you must enforce these options, you will need to supplement Pod Security Admission with an
[admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/),
which is outside the scope of this guide.
-->
PodSecurityPolicy 中有一些字段未被 Pod 安全性准入機制覆蓋。如果你必須使用這些選項，
你需要在 Pod 安全性准入之外部署[准入 Webhook](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/)
以補充這一能力，而這類操作不在本指南範圍。

<!--
First, you can remove the purely validating fields that the Pod Security Standards do not cover.
These fields (also listed in the
[Mapping PodSecurityPolicies to Pod Security Standards](/docs/reference/access-authn-authz/psp-to-pod-security-standards/)
reference with "no opinion") are:
-->
首先，你可以去掉 Pod 安全性標準所未覆蓋的那些驗證性字段。這些字段
（也列舉於[將 PodSecurityPolicy 映射到 Pod 安全性標準](/zh-cn/docs/reference/access-authn-authz/psp-to-pod-security-standards/)參考中，
標記爲“無意見”）有：

- `.spec.allowedHostPaths`
- `.spec.allowedFlexVolumes`
- `.spec.allowedCSIDrivers`
- `.spec.forbiddenSysctls`
- `.spec.runtimeClass`

<!--
You can also remove the following fields, that are related to POSIX / UNIX group controls.
-->
你也可以去掉以下字段，這些字段與 POSIX/UNIX 使用者組控制有關。

{{< caution >}}
<!--
If any of these use the `MustRunAs` strategy they may be mutating! Removing these could result in
workloads not setting the required groups, and cause problems. See
[Rollout the updated policies](#psp-update-rollout) below for advice on how to roll these changes
out safely.
-->
如果這些字段中存在使用 `MustRunAs` 策略的情況，則意味着對應字段是變更性質的。
去掉相應的字段可能導致負載無法設置所需的使用者組，進而帶來一些問題。
關於如何安全地將這類變更上線的相關建議，請參閱後文的[推出更新的策略](#psp-update-rollout)部分。
{{< /caution >}}

- `.spec.runAsGroup`
- `.spec.supplementalGroups`
- `.spec.fsGroup`

<!--
The remaining mutating fields are required to properly support the Pod Security Standards, and will
need to be handled on a case-by-case basis later:
-->
剩下的變更性字段是爲了適當支持 Pod 安全性標準所需要的，因而需要逐個處理：

<!--
- `.spec.requiredDropCapabilities` - Required to drop `ALL` for the Restricted profile.
- `.spec.seLinux` - (Only mutating with the `MustRunAs` rule) required to enforce the SELinux
  requirements of the Baseline & Restricted profiles.
- `.spec.runAsUser` - (Non-mutating with the `RunAsAny` rule) required to enforce `RunAsNonRoot` for
  the Restricted profile.
- `.spec.allowPrivilegeEscalation` - (Only mutating if set to `false`) required for the Restricted
  profile.
-->
- `.spec.requiredDropCapabilities` - 需要此字段來爲 Restricted 設定去掉 `ALL` 設置。
- `.spec.seLinux` - （僅針對帶有 `MustRunAs` 規則的變更性設置）需要此字段來滿足
  Baseline 和 Restricted 設定所需要的 SELinux 需求。
- `.spec.runAsUser` - （僅針對帶有 `RunAsAny` 規則的非變更性設置）需要此字段來爲
  Restricted 設定保證 `RunAsNonRoot`。
- `.spec.allowPrivilegeEscalation` - （如果設置爲 `false` 則爲變更性設置）
  需要此字段來支持 Restricted 設定。

<!--
### 2.c. Rollout the updated PSPs {#psp-update-rollout}
-->
### 2.c. 推出更新的 PSP    {#psp-update-rollout}

<!--
Next, you can rollout the updated policies to your cluster. You should proceed with caution, as
removing the mutating options may result in workloads missing required configuration.

For each updated PodSecurityPolicy:
-->
接下來，你可以將更新後的策略推出到你的叢集上。在繼續操作時，你要非常小心，
因爲去掉變更性質的選項可能導致有些工作負載缺少必需的設定。

針對更新後的每個 PodSecurityPolicy：

<!--
1. Identify pods running under the original PSP. This can be done using the `kubernetes.io/psp`
   annotation. For example, using kubectl:
   ```sh
   PSP_NAME="original" # Set the name of the PSP you're checking for
   kubectl get pods --all-namespaces -o jsonpath="{range .items[?(@.metadata.annotations.kubernetes\.io\/psp=='$PSP_NAME')]}{.metadata.namespace} {.metadata.name}{'\n'}{end}"
   ```
-->
1. 識別運行於原 PSP 之下的 Pod。可以通過 `kubernetes.io/psp` 註解來完成。
   例如，使用 kubectl：

   ```shell
   PSP_NAME="original" # 設置你要檢查的 PSP 的名稱
   kubectl get pods --all-namespaces -o jsonpath="{range .items[?(@.metadata.annotations.kubernetes\.io\/psp=='$PSP_NAME')]}{.metadata.namespace} {.metadata.name}{'\n'}{end}"
   ```

<!--
2. Compare these running pods against the original pod spec to determine whether PodSecurityPolicy
   has modified the pod. For pods created by a [workload resource](/docs/concepts/workloads/controllers/)
   you can compare the pod with the PodTemplate in the controller resource. If any changes are
   identified, the original Pod or PodTemplate should be updated with the desired configuration.
   The fields to review are:
   - `.metadata.annotations['container.apparmor.security.beta.kubernetes.io/*']` (replace * with each container name)
-->
2. 比較運行中的 Pod 與原來的 Pod 規約，確定 PodSecurityPolicy 是否更改過這些 Pod。
   對於通過[工作負載資源](/zh-cn/docs/concepts/workloads/controllers/)所創建的 Pod，
   你可以比較 Pod 和控制器資源中的 PodTemplate。如果發現任何變更，則原來的 Pod
   或者 PodTemplate 需要被更新以加上所希望的設定。要審查的字段包括：

   - `.metadata.annotations['container.apparmor.security.beta.kubernetes.io/*']`
     （將 `*` 替換爲每個容器的名稱）
   - `.spec.runtimeClassName`
   - `.spec.securityContext.fsGroup`
   - `.spec.securityContext.seccompProfile`
   - `.spec.securityContext.seLinuxOptions`
   - `.spec.securityContext.supplementalGroups`
   <!--
   - On containers, under `.spec.containers[*]` and `.spec.initContainers[*]`:
   -->
   - 對於容器，在 `.spec.containers[*]` 和 `.spec.initContainers[*]` 之下，檢查下面字段：
     - `.securityContext.allowPrivilegeEscalation`
     - `.securityContext.capabilities.add`
     - `.securityContext.capabilities.drop`
     - `.securityContext.readOnlyRootFilesystem`
     - `.securityContext.runAsGroup`
     - `.securityContext.runAsNonRoot`
     - `.securityContext.runAsUser`
     - `.securityContext.seccompProfile`
     - `.securityContext.seLinuxOptions`
<!--
3. Create the new PodSecurityPolicies. If any Roles or ClusterRoles are granting `use` on all PSPs
   this could cause the new PSPs to be used instead of their mutating counter-parts.
4. Update your authorization to grant access to the new PSPs. In RBAC this means updating any Roles
   or ClusterRoles that grant the `use` permission on the original PSP to also grant it to the
   updated PSP.
-->
3. 創建新的 PodSecurityPolicy。如果存在 Role 或 ClusterRole 對象爲使用者授權了在所有 PSP
   上使用 `use` 動詞的權限，則所使用的的會是新創建的 PSP 而不是其變更性的副本。
4. 更新你的鑑權設定，爲訪問新的 PSP 授權。在 RBAC 機制下，這意味着需要更新所有爲原 PSP
   授予 `use` 訪問權限的 Role 或 ClusterRole 對象，使之也對更新後的 PSP 授權。

<!--
5. Verify: after some soak time, rerun the command from step 1 to see if any pods are still using
   the original PSPs. Note that pods need to be recreated after the new policies have been rolled
   out before they can be fully verified.
6. (optional) Once you have verified that the original PSPs are no longer in use, you can delete
   them.
-->
5. 驗證：經過一段時間後，重新執行步驟 1 中所給的命令，查看是否有 Pod 仍在使用原來的 PSP。
   注意，在新的策略被推出到叢集之後，Pod 需要被重新創建纔可以執行全面驗證。
6. （可選）一旦你已經驗證原來的 PSP 不再被使用，你就可以刪除這些 PSP。

<!--
## 3. Update Namespaces {#update-namespaces}
-->
## 3. 更新名字空間     {#update-namespace}

<!--
The following steps will need to be performed on every namespace in the cluster. Commands referenced
in these steps use the `$NAMESPACE` variable to refer to the namespace being updated.
-->
下面的步驟需要在叢集中的所有名字空間上執行。所列步驟中的命令使用變量
`$NAMESPACE` 來引用所更新的名字空間。

<!--
### 3.a. Identify an appropriate Pod Security level {#identify-appropriate-level}
-->
### 3.a. 識別合適的 Pod 安全級別   {#identify-appropriate-level}

<!--
Start reviewing the [Pod Security Standards](/docs/concepts/security/pod-security-standards/) and
familiarizing yourself with the 3 different levels.

There are several ways to choose a Pod Security level for your namespace:
-->
首先請回顧 [Pod 安全性標準](/zh-cn/docs/concepts/security/pod-security-standards/)內容，
並瞭解三個安全級別。

爲你的名字空間選擇 Pod 安全性級別有幾種方法：

<!--
1. **By security requirements for the namespace** - If you are familiar with the expected access
   level for the namespace, you can choose an appropriate level based on those requirements, similar
   to how one might approach this on a new cluster.
-->
1. **根據名字空間的安全性需求來確定** - 如果你熟悉某名字空間的預期訪問級別，
   你可以根據這類需求來選擇合適的安全級別，就像大家在爲新叢集確定安全級別一樣。
<!--
2. **By existing PodSecurityPolicies** - Using the
   [Mapping PodSecurityPolicies to Pod Security Standards](/docs/reference/access-authn-authz/psp-to-pod-security-standards/)
   reference you can map each
   PSP to a Pod Security Standard level. If your PSPs aren't based on the Pod Security Standards, you
   may need to decide between choosing a level that is at least as permissive as the PSP, and a
   level that is at least as restrictive. You can see which PSPs are in use for pods in a given
   namespace with this command:
-->
2. **根據現有的 PodSecurityPolicy 來確定** -
   基於[將 PodSecurityPolicy 映射到 Pod 安全性標準](/zh-cn/docs/reference/access-authn-authz/psp-to-pod-security-standards/)
   參考資料，你可以將各個 PSP 映射到某個 Pod 安全性標準級別。如果你的 PSP 不是基於
   Pod 安全性標準的，你可能或者需要選擇一個至少與該 PSP 一樣寬鬆的級別，
   或者選擇一個至少與其一樣嚴格的級別。使用下面的命令你可以查看被 Pod 使用的 PSP 有哪些：

   ```sh
   kubectl get pods -n $NAMESPACE -o jsonpath="{.items[*].metadata.annotations.kubernetes\.io\/psp}" | tr " " "\n" | sort -u
   ```
<!--
3. **By existing pods** - Using the strategies under [Verify the Pod Security level](#verify-pss-level),
   you can test out both the Baseline and Restricted levels to see
   whether they are sufficiently permissive for existing workloads, and chose the least-privileged
   valid level.
-->
3. **根據現有 Pod 來確定** - 使用[檢查 Pod 安全性級別](#verify-pss-level)小節所述策略，
   你可以測試 Baseline 和 Restricted 級別，檢查它們是否對於現有負載而言足夠寬鬆，
   並選擇二者之間特權級較低的合法級別。

{{< caution >}}
<!--
Options 2 & 3 above are based on _existing_ pods, and may miss workloads that aren't currently
running, such as CronJobs, scale-to-zero workloads, or other workloads that haven't rolled out.
-->
上面的第二和第三種方案是基於 _現有_ Pod 的，因此可能錯失那些當前未處於運行狀態的
Pod，例如 CronJobs、縮容到零的負載，或者其他尚未全面鋪開的負載。
{{< /caution >}}

<!--
### 3.b. Verify the Pod Security level {#verify-pss-level}
-->
### 3.b. 檢查 Pod 安全性級別   {#verify-pss-level}

<!--
Once you have selected a Pod Security level for the namespace (or if you're trying several), it's a
good idea to test it out first (you can skip this step if using the Privileged level). Pod Security
includes several tools to help test and safely roll out profiles.
-->
一旦你已經爲名字空間選擇了 Pod 安全性級別（或者你正在嘗試多個不同級別），
先進行測試是個不錯的主意（如果使用 Privileged 級別，則可略過此步驟）。
Pod 安全性包含若干工具可用來測試和安全地推出安全性設定。

<!--
First, you can dry-run the policy, which will evaluate pods currently running in the namespace
against the applied policy, without making the new policy take effect:
-->
首先，你可以試運行新策略，這個過程可以針對所應用的策略評估當前在名字空間中運行的
Pod，但不會令新策略馬上生效：

```sh
# $LEVEL 是要試運行的級別，可以是 "baseline" 或 "restricted"
kubectl label --dry-run=server --overwrite ns $NAMESPACE pod-security.kubernetes.io/enforce=$LEVEL
```

<!--
This command will return a warning for any _existing_ pods that are not valid under the proposed
level.
-->
此命令會針對在所提議的級別下不再合法的所有 **現存** Pod 返回警告資訊。

<!--
The second option is better for catching workloads that are not currently running: audit mode. When
running under audit-mode (as opposed to enforcing), pods that violate the policy level are recorded
in the audit logs, which can be reviewed later after some soak time, but are not forbidden. Warning
mode works similarly, but returns the warning to the user immediately. You can set the audit level
on a namespace with this command:
-->
第二種辦法在抓取當前未運行的負載方面表現的更好：audit 模式。
運行於 audit 模式（而非 enforcing 模式）下時，違反策略級別的 Pod 會被記錄到審計日誌中，
經過一段時間後可以在日誌中查看到，但這些 Pod 不會被拒絕。
warning 模式的工作方式與此類似，不過會立即向使用者返回告警資訊。
你可以使用下面的命令爲名字空間設置 audit 模式的級別：

```sh
kubectl label --overwrite ns $NAMESPACE pod-security.kubernetes.io/audit=$LEVEL
```

<!--
If either of these approaches yield unexpected violations, you will need to either update the
violating workloads to meet the policy requirements, or relax the namespace Pod Security level.
-->
當以上兩種方法輸出意料之外的違例狀況時，你就需要或者更新發生違例的負載以滿足策略需求，
或者放寬名字空間上的 Pod 安全性級別。

<!--
### 3.c. Enforce the Pod Security level {#enforce-pod-security-level}
-->
### 3.c. 實施 Pod 安全性級別      {#enforce-pod-security-level}

<!--
When you are satisfied that the chosen level can safely be enforced on the namespace, you can update
the namespace to enforce the desired level:
-->
當你對可以安全地在名字空間上實施的級別比較滿意時，你可以更新名字空間來實施所期望的級別：

```sh
kubectl label --overwrite ns $NAMESPACE pod-security.kubernetes.io/enforce=$LEVEL
```

<!--
### 3.d. Bypass PodSecurityPolicy {#bypass-psp}
-->
### 3.d. 繞過 PodSecurityPolicy {#bypass-psp}

<!--
Finally, you can effectively bypass PodSecurityPolicy at the namespace level by binding the fully
{{< example file="policy/privileged-psp.yaml" >}}privileged PSP{{< /example >}} to all service
accounts in the namespace.
-->
最後，你可以通過將
{{< example file="policy/privileged-psp.yaml" >}}完全特權的 PSP{{< /example >}}
綁定到某名字空間中所有服務賬戶上，在名字空間層面繞過所有 PodSecurityPolicy。

```sh
# 下面集羣範圍的命令只需要執行一次
kubectl apply -f privileged-psp.yaml
kubectl create clusterrole privileged-psp --verb use --resource podsecuritypolicies.policy --resource-name privileged

# 逐個名字空間地禁用
kubectl create -n $NAMESPACE rolebinding disable-psp --clusterrole privileged-psp --group system:serviceaccounts:$NAMESPACE
```

<!--
Since the privileged PSP is non-mutating, and the PSP admission controller always
prefers non-mutating PSPs, this will ensure that pods in this namespace are no longer being modified
or restricted by PodSecurityPolicy.
-->
由於特權 PSP 是非變更性的，PSP 准入控制器總是優選非變更性的 PSP，
上面的操作會確保對應名字空間中的所有 Pod 不再會被 PodSecurityPolicy
所更改或限制。

<!--
The advantage to disabling PodSecurityPolicy on a per-namespace basis like this is if a problem
arises you can easily roll the change back by deleting the RoleBinding. Just make sure the
pre-existing PodSecurityPolicies are still in place!
-->
按上述操作逐個名字空間地禁用 PodSecurityPolicy 這種做法的好處是，
如果出現問題，你可以很方便地通過刪除 RoleBinding 來回滾所作的更改。
你所要做的只是確保之前存在的 PodSecurityPolicy 還在。

```sh
# 撤銷 PodSecurityPolicy 的禁用
kubectl delete -n $NAMESPACE rolebinding disable-psp
```

<!--
## 4. Review namespace creation processes {#review-namespace-creation-process}
-->
## 4. 審閱名字空間創建過程  {#review-namespace-creation-process}

<!--
Now that existing namespaces have been updated to enforce Pod Security Admission, you should ensure
that your processes and/or policies for creating new namespaces are updated to ensure that an
appropriate Pod Security profile is applied to new namespaces.
-->
現在，現有的名字空間都已被更新，強制實施 Pod 安全性准入，
你應該確保你用來管控新名字空間創建的流程與/或策略也被更新，這樣合適的 Pod
安全性設定會被應用到新的名字空間上。

<!--
You can also statically configure the Pod Security admission controller to set a default enforce,
audit, and/or warn level for unlabeled namespaces. See
[Configure the Admission Controller](/docs/tasks/configure-pod-container/enforce-standards-admission-controller/#configure-the-admission-controller)
for more information.
-->
你也可以靜態設定 Pod 安全性准入控制器，爲尚未打標籤的名字空間設置預設的
enforce、audit 與/或 warn 級別。
詳細資訊可參閱[設定准入控制器](/zh-cn/docs/tasks/configure-pod-container/enforce-standards-admission-controller/#configure-the-admission-controller)頁面。

<!--
## 5. Disable PodSecurityPolicy {#disable-psp}
-->
## 5. 禁用 PodSecurityPolicy    {#disable-psp}

<!--
Finally, you're ready to disable PodSecurityPolicy. To do so, you will need to modify the admission
configuration of the API server:
[How do I turn off an admission controller?](/docs/reference/access-authn-authz/admission-controllers/#how-do-i-turn-off-an-admission-controller).
-->
最後，你已爲禁用 PodSecurityPolicy 做好準備。要禁用 PodSecurityPolicy，
你需要更改 API 伺服器上的准入設定：
[我如何關閉某個准入控制器？](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#how-do-i-turn-off-an-admission-controller)

<!--
To verify that the PodSecurityPolicy admission controller is no longer enabled, you can manually run
a test by impersonating a user without access to any PodSecurityPolicies (see the
[PodSecurityPolicy example](/docs/concepts/security/pod-security-policy/#example)), or by verifying in
the API server logs. At startup, the API server outputs log lines listing the loaded admission
controller plugins:
-->
如果需要驗證 PodSecurityPolicy 准入控制器不再被啓用，你可以通過扮演某個無法訪問任何
PodSecurityPolicy 的使用者來執行測試（參見
[PodSecurityPolicy 示例](/zh-cn/docs/concepts/security/pod-security-policy/#example)），
或者通過檢查 API 伺服器的日誌來進行驗證。在啓動期間，API
伺服器會輸出日誌行，列舉所掛載的准入控制器插件。

```
I0218 00:59:44.903329      13 plugins.go:158] Loaded 16 mutating admission controller(s) successfully in the following order: NamespaceLifecycle,LimitRanger,ServiceAccount,NodeRestriction,TaintNodesByCondition,Priority,DefaultTolerationSeconds,ExtendedResourceToleration,PersistentVolumeLabel,DefaultStorageClass,StorageObjectInUseProtection,RuntimeClass,DefaultIngressClass,MutatingAdmissionWebhook.
I0218 00:59:44.903350      13 plugins.go:161] Loaded 14 validating admission controller(s) successfully in the following order: LimitRanger,ServiceAccount,PodSecurity,Priority,PersistentVolumeClaimResize,RuntimeClass,CertificateApproval,CertificateSigning,CertificateSubjectRestriction,DenyServiceExternalIPs,ValidatingAdmissionWebhook,ResourceQuota.
```

<!--
You should see `PodSecurity` (in the validating admission controllers), and neither list should
contain `PodSecurityPolicy`.
-->
你應該會看到 `PodSecurity`（在 validating admission controllers 列表中），
並且兩個列表中都不應該包含 `PodSecurityPolicy`。

<!--
Once you are certain the PSP admission controller is disabled (and after sufficient soak time to be
confident you won't need to roll back), you are free to delete your PodSecurityPolicies and any
associated Roles, ClusterRoles, RoleBindings and ClusterRoleBindings (just make sure they don't
grant any other unrelated permissions).
-->
一旦你確定 PSP 准入控制器已被禁用（並且這種狀況已經持續了一段時間，
這樣你纔會比較確定不需要回滾），你就可以放心地刪除你的 PodSecurityPolicy
以及所關聯的所有 Role、ClusterRole、RoleBinding、ClusterRoleBinding 等對象
（僅需要確保他們不再授予其他不相關的訪問權限）。

