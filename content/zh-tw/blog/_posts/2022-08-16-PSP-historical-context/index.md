---
layout: blog
title: "PodSecurityPolicy：歷史背景"
date: 2022-08-23T15:00:00-0800
slug: podsecuritypolicy-the-historical-context
evergreen: true
---

<!--
layout: blog
title: "PodSecurityPolicy: The Historical Context"
date: 2022-08-23T15:00:00-0800
slug: podsecuritypolicy-the-historical-context
evergreen: true
-->

<!--
**Author:** Mahé Tardy (Quarkslab)
-->
**作者：** Mahé Tardy (Quarkslab)

<!--
The PodSecurityPolicy (PSP) admission controller has been removed, as of
Kubernetes v1.25. Its deprecation was announced and detailed in the blog post
[PodSecurityPolicy Deprecation: Past, Present, and Future](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/),
published for the Kubernetes v1.21 release.
-->
從 Kubernetes v1.25 開始，PodSecurityPolicy (PSP) 准入控制器已被移除。 
在爲 Kubernetes v1.21 發佈的博文 [PodSecurityPolicy 棄用：過去、現在和未來](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/) 
中，已經宣佈並詳細說明了它的棄用情況。

<!--
This article aims to provide historical context on the birth and evolution of
PSP, explain why the feature never made it to stable, and show why it was
removed and replaced by Pod Security admission control.
-->
本文旨在提供 PSP 誕生和演變的歷史背景，解釋爲什麼從未使該功能達到穩定狀態，並說明爲什麼它被移除並被 Pod 安全准入控制取代。

<!--
PodSecurityPolicy, like other specialized admission control plugins, provided
fine-grained permissions on specific fields concerning the pod security settings
as a built-in policy API. It acknowledged that cluster administrators and
cluster users are usually not the same people, and that creating workloads in
the form of a Pod or any resource that will create a Pod should not equal being
"root on the cluster". It could also encourage best practices by configuring
more secure defaults through mutation and decoupling low-level Linux security
decisions from the deployment process.
-->
PodSecurityPolicy 與其他專門的准入控制插件一樣，作爲內置的策略 API，對有關 Pod 安全設置的特定字段提供細粒度的權限。
它承認叢集管理員和叢集使用者通常不是同一個人，並且以 Pod 形式或任何將創建 Pod 的資源的形式創建工作負載的權限不應該等同於“叢集上的 root 賬戶”。
它還可以通過變更設定來應用更安全的預設值，並將底層 Linux 安全決策與部署過程分離來促進最佳實踐。

<!--
## The birth of PodSecurityPolicy

PodSecurityPolicy originated from OpenShift's SecurityContextConstraints
(SCC) that were in the very first release of the Red Hat OpenShift Container Platform,
even before Kubernetes 1.0. PSP was a stripped-down version of the SCC.
-->
## PodSecurityPolicy 的誕生

PodSecurityPolicy 源自 OpenShift 的 SecurityContextConstraints (SCC)，
它出現在 Red Hat OpenShift 容器平臺的第一個版本中，甚至在 Kubernetes 1.0 之前。PSP 是 SCC 的精簡版。

<!--
The origin of the creation of PodSecurityPolicy is difficult to track, notably
because it was mainly added before Kubernetes Enhancements Proposal (KEP)
process, when design proposals were still a thing. Indeed, the archive of the final
[design proposal](https://github.com/kubernetes/design-proposals-archive/blob/main/auth/pod-security-policy.md)
is still available. Nevertheless, a [KEP issue number five](https://github.com/kubernetes/enhancements/issues/5) 
was created after the first pull requests were merged.
-->
PodSecurityPolicy 的創建起源很難追蹤，特別是因爲它主要是在 Kubernetes 增強提案 (KEP) 流程之前添加的，
當時仍在使用設計提案（Design Proposal）。事實上，最終[設計提案](https://github.com/kubernetes/design-proposals-archive/blob/main/auth/pod-security-policy.md)的存檔仍然可以找到。
儘管如此，[編號爲 5 的 KEP](https://github.com/kubernetes/enhancements/issues/5)
是在合併第一個拉取請求後創建的。

<!--
Before adding the first piece of code that created PSP, two main pull
requests were merged into Kubernetes, a [`SecurityContext` subresource](https://github.com/kubernetes/kubernetes/pull/7343)
that defined new fields on pods' containers, and the first iteration of the [ServiceAccount](https://github.com/kubernetes/kubernetes/pull/7101)
API.
-->
在添加創建 PSP 的第一段代碼之前，兩個主要的拉取請求被合併到 Kubernetes 中，
[`SecurityContext` 子資源](https://github.com/kubernetes/kubernetes/pull/7343)
定義了 Pod 容器上的新字段，以及 [ServiceAccount](https://github.com/kubernetes/kubernetes/pull/7101) 
API 的第一次迭代。


<!--
Kubernetes 1.0 was released on 10 July 2015 without any mechanism to restrict the
security context and sensitive options of workloads, other than an alpha-quality
SecurityContextDeny admission plugin (then known as `scdeny`).
The [SecurityContextDeny plugin](https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/#securitycontextdeny)
is still in Kubernetes today (as an alpha feature) and creates an admission controller that
prevents the usage of some fields in the security context.
-->
Kubernetes 1.0 於 2015 年 7 月 10 日發佈，除了 Alpha 階段的 SecurityContextDeny 准入插件
（當時稱爲 `scdeny`）之外，
沒有任何機制來限制安全上下文和工作負載的敏感選項。
[SecurityContextDeny 插件](https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/#securitycontextdeny)
今天仍存在於 Kubernetes 中（作爲 Alpha 特性），負責創建一個准入控制器，以防止在安全上下文中使用某些字段。

<!--
The roots of the PodSecurityPolicy were added with
[the very first pull request on security policy](https://github.com/kubernetes/kubernetes/pull/7893),
which added the design proposal with the new PSP object, based on the SCC (Security Context Constraints). It
was a long discussion of nine months, with back and forth from OpenShift's SCC,
many rebases, and the rename to PodSecurityPolicy that finally made it to
upstream Kubernetes in February 2016. Now that the PSP object
had been created, the next step was to add an admission controller that could enforce
these policies. The first step was to add the admission
[without taking into account the users or groups](https://github.com/kubernetes/kubernetes/pull/7893#issuecomment-180410539).
A specific [issue to bring PodSecurityPolicy to a usable state](https://github.com/kubernetes/kubernetes/issues/23217)
was added to keep track of the progress and a first version of the admission
controller was merged in [pull request named PSP admission](https://github.com/kubernetes/kubernetes/pull/24600)
in May 2016. Then around two months later, Kubernetes 1.3 was released.
-->
PodSecurityPolicy 的根源是[早期關於安全策略的一個拉取請求](https://github.com/kubernetes/kubernetes/pull/7893)，
它以 SCC（安全上下文約束）爲基礎，增加了新的 PSP 對象的設計方案。這是一個長達 9 個月的漫長討論，
基於 OpenShift 的 SCC 反覆討論，
多次變動，並重命名爲 PodSecurityPolicy，最終在 2016 年 2 月進入上游 Kubernetes。
現在 PSP 對象已經創建，下一步是添加一個可以執行這些政策的准入控制器。
第一步是添加[不考慮使用者或組](https://github.com/kubernetes/kubernetes/pull/7893#issuecomment-180410539)
的准入控制。
2016 年 5 月，一個特定的[使 PodSecurityPolicy 達到可用狀態的問題](https://github.com/kubernetes/kubernetes/issues/23217)被添加進來，
以跟蹤進展，並在[名爲 PSP 准入的拉取請求](https://github.com/kubernetes/kubernetes/pull/24600)中合併了准入控制器的第一個版本。
然後大約兩個月後，發佈了 Kubernetes 1.3。


<!--
Here is a timeline that recaps the main pull requests of the birth of the
PodSecurityPolicy and its admission controller with 1.0 and 1.3 releases as
reference points.
-->
下面是一個時間表，它以 1.0 和 1.3 版本作爲參考點，回顧了 PodSecurityPolicy 及其准入控制器誕生的主要拉取請求。

{{< figure src="./timeline.svg" alt="Timeline of the PodSecurityPolicy creation pull requests" >}}

<!--
After that, the PSP admission controller was enhanced by adding what was initially
left aside. [The authorization mechanism](https://github.com/kubernetes/kubernetes/pull/33080),
merged in early November 2016 allowed administrators to use multiple policies
in a cluster to grant different levels of access for different types of users.
Later, a [pull request](https://github.com/kubernetes/kubernetes/pull/52849)
merged in October 2017 fixed [a design issue](https://github.com/kubernetes/kubernetes/issues/36184)
on ordering PodSecurityPolicies between mutating and alphabetical order, and continued to
build the PSP admission as we know it. After that, many improvements and fixes
followed to build the PodSecurityPolicy feature of recent Kubernetes releases.
-->
之後，PSP 准入控制器通過添加最初被擱置的內容進行了增強。
在 2016 年 11 月上旬合併[鑑權機制](https://github.com/kubernetes/kubernetes/pull/33080)，
允許管理員在叢集中使用多個策略，爲不同類型的使用者授予不同級別的訪問權限。
後來，2017 年 10 月合併的一個[拉取請求](https://github.com/kubernetes/kubernetes/pull/52849) 
修復了 PodSecurityPolicies 在變更和字母順序之間衝突的[設計問題](https://github.com/kubernetes/kubernetes/issues/36184)，
並繼續構建我們所知道的 PSP 准入。之後，進行了許多改進和修復，以構建最近 Kubernetes 版本的 PodSecurityPolicy 功能。


<!--
## The rise of Pod Security Admission 

Despite the crucial issue it was trying to solve, PodSecurityPolicy presented
some major flaws:
-->
## Pod 安全准入的興起

儘管 PodSecurityPolicy 試圖解決的是一個關鍵問題，但它卻包含一些重大缺陷：

<!--
- **Flawed authorization model** - users can create a pod if they have the
  **use** verb on the PSP that allows that pod or the pod's service account has
  the **use** permission on the allowing PSP.
- **Difficult to roll out** - PSP fail-closed. That is, in the absence of a policy,
  all pods are denied. It mostly means that it cannot be enabled by default and
  that users have to add PSPs for all workloads before enabling the feature,
  thus providing no audit mode to discover which pods would not be allowed by
  the new policy. The opt-in model also leads to insufficient test coverage and
  frequent breakage due to cross-feature incompatibility. And unlike RBAC,
  there was no strong culture of shipping PSP manifests with projects.
- **Inconsistent unbounded API** - the API has grown with lots of
  inconsistencies notably because of many requests for niche use cases: e.g.
  labels, scheduling, fine-grained volume controls, etc. It has poor
  composability with a weak prioritization model, leading to unexpected
  mutation priority. It made it really difficult to combine PSP with other
  third-party admission controllers.
- **Require security knowledge** - effective usage still requires an
  understanding of Linux security primitives. e.g. MustRunAsNonRoot +
  AllowPrivilegeEscalation.
-->
- **有缺陷的鑑權模式** - 如果使用者針對 PSP 具有執行 **use** 動作的權限，而此 PSP 准許該 Pod
  或者該 Pod 的服務帳戶對 PSP 執行 **use** 操作，則使用者可以創建一個 Pod。
- **難以推廣** - PSP 失敗關閉。也就是說，在沒有策略的情況下，所有 Pod 都會被拒絕。
  這主要意味着預設情況下無法啓用它，並且使用者必須在啓用該功能之前爲所有工作負載添加 PSP，
  因此沒有提供審計模式來發現哪些 Pod 會不被新策略所允許。
  這種採納模式還導致測試覆蓋率不足，並因跨特性不兼容而經常出現故障。
  而且與 RBAC 不同的是，還不存在在項目中交付 PSP 清單的強大文化。
- **不一致的無邊界 API** - API 的發展有很多不一致的地方，特別是由於許多小衆場景的請求：
  如標籤、調度、細粒度的卷控制等。它的可組合性很差，優先級模型較弱，會導致意外的變更優先級。
  這使得 PSP 與其他第三方准入控制器的結合真的很困難。
- **需要安全知識** - 有效使用 PSP 仍然需要了解 Linux 的安全原語。
  例如：MustRunAsNonRoot + AllowPrivilegeEscalation。

<!--
The experience with PodSecurityPolicy concluded that most users care for two or three
policies, which led to the creation of the [Pod Security Standards](/docs/concepts/security/pod-security-standards/),
that define three policies:
- **Privileged** - unrestricted policy.
- **Baseline** - minimally restrictive policy, allowing the default pod
  configuration.
- **Restricted** - security best practice policy.
-->
PodSecurityPolicy 的經驗得出的結論是，大多數使用者關心兩個或三個策略，這導致了
[Pod 安全標準](/zh-cn/docs/concepts/security/pod-security-standards/)的創建，它定義了三個策略：
- **Privileged（特權的）** - 策略不受限制。
- **Baseline（基線的）** - 策略限制很少，允許預設 Pod 設定。
- **Restricted（受限的）** - 安全最佳實踐策略。

<!--
The replacement for PSP, the new [Pod Security Admission](/docs/concepts/security/pod-security-admission/)
is an in-tree, stable for Kubernetes v1.25, admission plugin to enforce these
standards at the namespace level. It makes it easier to enforce basic pod
security without deep security knowledge. For more sophisticated use cases, you
might need a third-party solution that can be easily combined with Pod Security
Admission.
-->
作爲 PSP 的替代品，新的 [Pod 安全准入](/zh-cn/docs/concepts/security/pod-security-admission/)是
Kubernetes v1.25 的樹內穩定的准入插件，用於在命名空間級別強制執行這些標準。
無需深入的安全知識，就可以更輕鬆地實施基本的 Pod 安全性。
對於更復雜的用例，你可能需要一個可以輕鬆與 Pod 安全准入結合的第三方解決方案。

<!--
## What's next

For further details on the SIG Auth processes, covering PodSecurityPolicy removal and
creation of Pod Security admission, the
[SIG auth update at KubeCon NA 2019](https://www.youtube.com/watch?v=SFtHRmPuhEw)
and the [PodSecurityPolicy Replacement: Past, Present, and Future](https://www.youtube.com/watch?v=HsRRmlTJpls)
presentation at KubeCon NA 2021 records are available.
-->
## 下一步是什麼

有關 SIG Auth 流程的更多詳細資訊，包括 PodSecurityPolicy 刪除和 Pod 安全准入的創建，
請參閱在 KubeCon NA 2021 的
[SIG auth update at KubeCon NA 2019](https://www.youtube.com/watch?v=SFtHRmPuhEw) 和 
[PodSecurityPolicy Replacement: Past, Present, and Future](https://www.youtube.com/watch?v=HsRRmlTJpls)
演示錄像。

<!--
Particularly on the PSP removal, the
[PodSecurityPolicy Deprecation: Past, Present, and Future](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/)
blog post is still accurate.
-->
特別是在 PSP 移除方面，[PodSecurityPolicy 棄用：過去、現在和未來](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/)博客文章仍然是準確的。

<!--
And for the new Pod Security admission,
[documentation is available](/docs/concepts/security/pod-security-admission/).
In addition, the blog post
[Kubernetes 1.23: Pod Security Graduates to Beta](/blog/2021/12/09/pod-security-admission-beta/)
along with the KubeCon EU 2022 presentation
[The Hitchhiker's Guide to Pod Security](https://www.youtube.com/watch?v=gcz5VsvOYmI)
give great hands-on tutorials to learn.
-->
對於新的 Pod 安全許可，[可以訪問文檔](/zh-cn/docs/concepts/security/pod-security-admission/)。
此外，博文 [Kubernetes 1.23: Pod Security Graduers to Beta](/blog/2021/12/09/pod-security-admission-beta/)
以及 KubeCon EU 2022 演示文稿 [the Hitchhicker’s Guide to Pod Security](https://www.youtube.com/watch?v=gcz5VsvOYmI)
提供了很好的實踐教程來學習。