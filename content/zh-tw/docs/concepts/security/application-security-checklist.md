---
title: 應用安全檢查清單
description: >
  一份面向應用開發者的基本指南，用於確保 Kubernetes 上應用安全
content_type: concept
weight: 110
---
<!--
title: Application Security Checklist
description: >
  Baseline guidelines around ensuring application security on Kubernetes, aimed at application developers
content_type: concept
weight: 110
-->

<!-- overview -->

<!--
This checklist aims to provide basic guidelines on securing applications
running in Kubernetes from a developer's perspective.
This list is not meant to be exhaustive and is intended to evolve over time.
-->
本檢查清單旨在爲開發者提供在 Kubernetes 上安全地運行應用的基本指南。
此列表並不打算詳盡無遺，會隨着時間的推移而不斷演變。

<!-- The following is taken from the existing checklist created for Kubernetes admins. https://kubernetes.io/docs/concepts/security/security-checklist/
-->

<!--
On how to read and use this document:

- The order of topics does not reflect an order of priority.
- Some checklist items are detailed in the paragraph below the list of each section.
- This checklist assumes that a `developer` is a Kubernetes cluster user who
  interacts with namespaced scope objects.
-->
關於如何閱讀和使用本文檔：

- 主題的順序並不代表優先級的順序。
- 在每章節的列表下面的段落中，都詳細列舉了一些檢查項。
- 本檢查清單假設“開發者”是與命名空間範圍對象交互的 Kubernetes 叢集使用者。

{{< caution >}}
<!--
Checklists are **not** sufficient for attaining a good security posture on their own.
A good security posture requires constant attention and improvement, but a checklist
can be the first step on the never-ending journey towards security preparedness.
Some recommendations in this checklist may be too restrictive or too lax for
your specific security needs. Since Kubernetes security is not "one size fits all",
each category of checklist items should be evaluated on its merits.
-->
單靠檢查清單自身**不足以**獲得良好的安全態勢。
實現良好的安全態勢需要持續的關注和改進，實現安全上有備無患的目標道路漫長，清單可作爲征程上的第一步。
對於你的特定安全需求，此清單中的某些建議可能過於嚴格或過於寬鬆。
由於 Kubernetes 的安全性並不是“一刀切”的，因此針對每一類檢查清單項目都應該做價值評估。
{{< /caution >}}

<!-- body -->

<!--
## Base security hardening

The following checklist provides base security hardening recommendations that
would apply to most applications deploying to Kubernetes.
-->
## 基礎安全加固  {#base-security-hardening}

以下檢查清單提供了一些適用於部署到 Kubernetes 的大多數應用的基礎安全加固建議。

<!--
### Application design

- [ ] Follow the right
  [security principles](https://www.cncf.io/wp-content/uploads/2022/06/CNCF_cloud-native-security-whitepaper-May2022-v2.pdf)
  when designing applications.
- [ ] Application configured with appropriate {{< glossary_tooltip text="QoS class" term_id="QoS-class" >}}
  through resource request and limits.
  - [ ] Memory limit is set for the workloads with a limit equal to or greater than the request.
  - [ ] CPU limit might be set on sensitive workloads.
-->
### 應用設計  {#application-design}

- [ ] 在設計應用時遵循正確的[安全原則](https://www.cncf.io/wp-content/uploads/2022/06/CNCF_cloud-native-security-whitepaper-May2022-v2.pdf)。
- [ ] 應用通過資源請求和限制設定了適當的 {{< glossary_tooltip text="QoS 類" term_id="QoS-class" >}}。
  - [ ] 爲工作負載設置一個內存限制，此限制等於或大於請求。
  - [ ] 敏感工作負載可以設置 CPU 限制。

<!--
### Service account

- [ ] Avoid using the `default` ServiceAccount. Instead, create ServiceAccounts for
  each workload or microservice.
- [ ] `automountServiceAccountToken` should be set to `false` unless the pod
  specifically requires access to the Kubernetes API to operate.
-->
### 服務賬號   {#service-account}

- [ ] 避免使用 `default` ServiceAccount。爲每個工作負載或微服務創建 ServiceAccount。
- [ ] 除非 Pod 特別要求訪問 Kubernetes API 進行操作，否則 `automountServiceAccountToken` 應被設置爲 `false`。

<!--
### Pod-level `securityContext` recommendations {#security-context-pod}

- [ ] Set `runAsNonRoot: true`.
- [ ] Configure the container to execute as a less privileged user
  (for example, using `runAsUser` and `runAsGroup`), and configure appropriate
  permissions on files or directories inside the container image.
- [ ] Optionally add a supplementary group with `fsGroup` to access persistent volumes.
- [ ] The application deploys into a namespace that enforces an appropriate
  [Pod security standard](/docs/concepts/security/pod-security-standards/).
  If you cannot control this enforcement for the cluster(s) where the application is
  deployed, take this into account either through documentation or additional defense in depth.
-->
### Pod 級別的 `securityContext` 建議   {#security-context-pod}

- [ ] 設置 `runAsNonRoot: true`。
- [ ] 將容器設定爲以低特權使用者來執行（例如，使用 `runAsUser` 和 `runAsGroup`），
  並在容器映像檔內設定恰當的文件或目錄權限。
- [ ] 可以選擇添加一個補充組，使用 `fsGroup` 訪問持久卷。
- [ ] 應用部署到強制執行適當
  [Pod 安全標準](/zh-cn/docs/concepts/security/pod-security-standards/)的命名空間。
  如果你不能控制部署應用的叢集以執行此類強制操作，請通過文檔說明或實施額外的深度防禦來避免遺漏。

<!--
### Container-level `securityContext` recommendations {#security-context-container}

- [ ] Disable privilege escalations using `allowPrivilegeEscalation: false`.
- [ ] Configure the root filesystem to be read-only with `readOnlyRootFilesystem: true`.
- [ ] Avoid running privileged containers (set `privileged: false`).
- [ ] Drop all capabilities from the containers and add back only specific ones
  that are needed for operation of the container.
-->
### 容器級別的 `securityContext` 建議   {#security-context-container}

- [ ] 使用 `allowPrivilegeEscalation: false` 禁用特權提級。
- [ ] 使用 `readOnlyRootFilesystem: true` 將根文件系統設定爲只讀。
- [ ] 避免運行特權容器（設置 `privileged: false`）。
- [ ] 從容器中刪除所有權能，只添加容器運行所需的特定權限。

<!--
### Role Based Access Control (RBAC) {#rbac}

- [ ] Permissions such as **create**, **patch**, **update** and **delete**
  should be only granted if necessary.
- [ ] Avoid creating RBAC permissions to create or update roles which can lead to
  [privilege escalation](/docs/reference/access-authn-authz/rbac/#privilege-escalation-prevention-and-bootstrapping).
- [ ] Review bindings for the `system:unauthenticated` group and remove them where
  possible, as this gives access to anyone who can contact the API server at a network level.
-->
### 基於角色的訪問控制 (RBAC)   {#rbac}

- [ ] 僅在必要時才授予 **create**、**patch**、**update** 和 **delete** 等權限。
- [ ] 避免創建允許使用者能夠創建或更新角色的 RBAC 權限，
  創建了這類權限可能導致[特權提級](/zh-cn/docs/reference/access-authn-authz/rbac/#privilege-escalation-prevention-and-bootstrapping)。
- [ ] 審查 `system:unauthenticated` 組的綁定，並在可能的情況下將其移除，
  因爲這類綁定會爲能夠在網路層與 API 伺服器通信的所有人提供訪問權限。

<!--
The **create**, **update** and **delete** verbs should be permitted judiciously.
The **patch** verb if allowed on a Namespace can
[allow users to update labels on the namespace or deployments](/docs/concepts/security/rbac-good-practices/#namespace-modification)
which can increase the attack surface.

For sensitive workloads, consider providing a recommended ValidatingAdmissionPolicy
that further restricts the permitted write actions.
-->
對 **create**、**update** 和 **delete** 動詞的授權要非常謹慎。
如果允許針對 Namespace 對象使用 **patch** 動詞，
可能會[允許使用者更新命名空間或部署上的標籤](/zh-cn/docs/concepts/security/rbac-good-practices/#namespace-modification)，
這可能會增加攻擊面。

對於敏感工作負載，考慮提供推薦的 ValidatingAdmissionPolicy 以進一步限制允許的寫入操作。

<!--
### Image security

- [ ] Using an image scanning tool to scan an image before deploying containers in the Kubernetes cluster.
- [ ] Use container signing to validate the container image signature before deploying to the Kubernetes cluster.
-->
### 映像檔安全  {#image-security}

- [ ] 使用映像檔掃描工具在將容器部署到 Kubernetes 叢集之前掃描映像檔。
- [ ] 使用容器簽名在將容器部署到 Kubernetes 叢集之前驗證容器映像檔簽名。

<!--
### Network policies

- [ ] Configure [NetworkPolicies](/docs/concepts/services-networking/network-policies/)
  to only allow expected ingress and egress traffic from the pods.

Make sure that your cluster provides and enforces NetworkPolicy.
If you are writing an application that users will deploy to different clusters,
consider whether you can assume that NetworkPolicy is available and enforced.
-->
### 網路策略  {#netowrk-policies}

- [ ] 設定 [NetworkPolicy](/zh-cn/docs/concepts/services-networking/network-policies/)，
  僅允許來自 Pod 的預期入站和出站流量。

確保你的叢集提供並強制執行 NetworkPolicy。
如果你所編寫的應用將被人們部署到不同叢集中，請考慮你是否可以假設 NetworkPolicy 可用且被啓用。

<!--
## Advanced security hardening {#advanced}

This section of this guide covers some advanced security hardening points
which might be valuable based on different Kubernetes environment setup.
-->
## 高級安全加固  {#advanced}

本指南的這一節涵蓋了一些高級安全加固要點，這些要點可能在不同 Kubernetes 環境設置中有用。

<!--
### Linux container security

Configure {{< glossary_tooltip text="Security Context" term_id="Security-Context" >}}
for the pod-container.

- [ ] [Set the Seccomp Profile for a Container](/docs/tasks/configure-pod-container/security-context/#set-the-seccomp-profile-for-a-container).
- [ ] [Restrict a Container's Access to Resources with AppArmor](/docs/tutorials/security/apparmor/).
- [ ] [Assign SELinux Labels to a Container](/docs/tasks/configure-pod-container/security-context/#assign-selinux-labels-to-a-container).
-->
### Linux 容器安全   {#linux-container-security}

爲 Pod 容器設定 {{< glossary_tooltip text="安全上下文" term_id="Security-Context" >}}。

- [ ] [爲容器設置 Seccomp 設定](/zh-cn/docs/tasks/configure-pod-container/security-context/#set-the-seccomp-profile-for-a-container)。
- [ ] [使用 AppArmor 限制容器對資源的訪問](/zh-cn/docs/tutorials/security/apparmor/)。
- [ ] [爲容器賦予 SELinux 標籤](/zh-cn/docs/tasks/configure-pod-container/security-context/#assign-selinux-labels-to-a-container)。

<!--
### Runtime Classes

- [ ] Configure appropriate runtime classes for containers.
-->
### 運行時類   {#runtime-classes}

- [ ] 爲容器設定適當的運行時類。

{{% thirdparty-content %}}

<!--
Some containers may require a different isolation level from what is provided by
the default runtime of the cluster. `runtimeClassName` can be used in a podspec
to define a different runtime class.

For sensitive workloads consider using kernel emulation tools like
[gVisor](https://gvisor.dev/docs/), or virtualized isolation using a mechanism
such as [kata-containers](https://katacontainers.io/).

In high trust environments, consider using
[confidential virtual machines](/blog/2023/07/06/confidential-kubernetes/)
to improve cluster security even further.
-->
某些容器可能需要不同於叢集默認運行時所提供的隔離級別。
你可以在 Pod 規約中使用 `runtimeClassName` 定義不同的運行時類。

對於敏感的工作負載，考慮使用 [gVisor](https://gvisor.dev/docs/) 這類內核仿真工具，
或使用 [kata-containers](https://katacontainers.io/) 等機制進行虛擬化隔離。

在高度信任的環境中，考慮使用[機密虛擬機](/zh-cn/blog/2023/07/06/confidential-kubernetes/)進一步提高叢集安全性。
