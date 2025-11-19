---
layout: blog
title: "棄用 PodSecurityPolicy：過去、現在、未來"
date: 2021-04-06
slug: podsecuritypolicy-deprecation-past-present-and-future
---
<!--
title: "PodSecurityPolicy Deprecation: Past, Present, and Future"
-->

<!--
**Author:** Tabitha Sable (Kubernetes SIG Security)
-->
作者：Tabitha Sable（Kubernetes SIG Security）

{{% pageinfo color="primary" %}}
<!--
**Update:** *With the release of Kubernetes v1.25, PodSecurityPolicy has been removed.*
-->
**更新：隨着 Kubernetes v1.25 的發佈，PodSecurityPolicy 已被刪除。**

<!--
*You can read more information about the removal of PodSecurityPolicy in the
[Kubernetes 1.25 release notes](/blog/2022/08/23/kubernetes-v1-25-release/#pod-security-changes).*
-->
**你可以在 [Kubernetes 1.25 發佈說明](/zh-cn/blog/2022/08/23/kubernetes-v1-25-release/#pod-security-changes)
中閱讀有關刪除 PodSecurityPolicy 的更多信息。**

{{% /pageinfo %}}

<!--
PodSecurityPolicy (PSP) is being deprecated in Kubernetes 1.21, to be released later this week.
This starts the countdown to its removal, but doesn’t change anything else.
PodSecurityPolicy will continue to be fully functional for several more releases before being removed completely.
In the meantime, we are developing a replacement for PSP that covers key use cases more easily and sustainably.
-->
PodSecurityPolicy (PSP) 在 Kubernetes 1.21 中被棄用。<!--to be released later this week這句感覺沒必要翻譯，非漏譯-->
PSP 日後會被移除，但目前不會改變任何其他內容。在移除之前，PSP 將繼續在後續多個版本中完全正常運行。
與此同時，我們正在開發 PSP 的替代品，希望可以更輕鬆、更可持續地覆蓋關鍵用例。

<!--
What are Pod Security Policies? Why did we need them? Why are they going away, and what’s next?
How does this affect you? These key questions come to mind as we prepare to say goodbye to PSP,
so let’s walk through them together. We’ll start with an overview of how features get removed from Kubernetes.
-->
什麼是 PSP？爲什麼需要 PSP？爲什麼要棄用，未來又將如何發展？
這對你有什麼影響？當我們準備告別 PSP，這些關鍵問題浮現在腦海中，
所以讓我們一起來討論吧。本文首先概述 Kubernetes 如何移除一些特性。

<!--
## What does deprecation mean in Kubernetes?
-->
## Kubernetes 中的棄用是什麼意思？

<!--
Whenever a Kubernetes feature is set to go away, our [deprecation policy](/docs/reference/using-api/deprecation-policy/)
is our guide. First the feature is marked as deprecated, then after enough time has passed, it can finally be removed.
-->
每當 Kubernetes 決定棄用某項特性時，我們會遵循[棄用策略](/zh-cn/docs/reference/using-api/deprecation-policy/)。
首先將該特性標記爲已棄用，然後經過足夠長的時間後，最終將其移除。

<!--
Kubernetes 1.21 starts the deprecation process for PodSecurityPolicy. As with all feature deprecations,
PodSecurityPolicy will continue to be fully functional for several more releases.
The current plan is to remove PSP from Kubernetes in the 1.25 release.
-->
Kubernetes 1.21 啓動了 PodSecurityPolicy 的棄用流程。與棄用任何其他功能一樣，
PodSecurityPolicy 將繼續在後續幾個版本中完全正常運行。目前的計劃是在 1.25 版本中將其移除。

<!--
Until then, PSP is still PSP. There will be at least a year during which the newest Kubernetes releases will
still support PSP, and nearly two years until PSP will pass fully out of all supported Kubernetes versions.
-->
在徹底移除之前，PSP 仍然是 PSP。至少在未來一年時間內，最新的 Kubernetes
版本仍將繼續支持 PSP。大約兩年之後，PSP 纔會在所有受支持的 Kubernetes 版本中徹底消失。

<!--
## What is PodSecurityPolicy?
-->
## 什麼是 PodSecurityPolicy？

<!--
[PodSecurityPolicy](/docs/concepts/security/pod-security-policy/) is
a built-in [admission controller](/blog/2019/03/21/a-guide-to-kubernetes-admission-controllers/)
that allows a cluster administrator to control security-sensitive aspects of the Pod specification.
-->
[PodSecurityPolicy](/zh-cn/docs/concepts/security/pod-security-policy/)
是一個內置的[准入控制器](/blog/2019/03/21/a-guide-to-kubernetes-admission-controllers/)，
允許集羣管理員控制 Pod 規約中涉及安全的敏感內容。

<!--
First, one or more PodSecurityPolicy resources are created in a cluster to define the requirements Pods must meet.
Then, RBAC rules are created to control which PodSecurityPolicy applies to a given pod.
If a pod meets the requirements of its PSP, it will be admitted to the cluster as usual.
In some cases, PSP can also modify Pod fields, effectively creating new defaults for those fields.
If a Pod does not meet the PSP requirements, it is rejected, and cannot run.
-->
首先，在集羣中創建一個或多個 PodSecurityPolicy 資源來定義 Pod 必須滿足的要求。
然後，創建 RBAC 規則來決定爲特定的 Pod 應用哪個 PodSecurityPolicy。
如果 Pod 滿足其 PSP 的要求，則照常被允許進入集羣。
在某些情況下，PSP 還可以修改 Pod 字段，有效地爲這些字段創建新的默認值。
如果 Pod 不符合 PSP 要求，則被拒絕進入集羣，並且無法運行。

<!--
One more important thing to know about PodSecurityPolicy: it’s not the same as
[PodSecurityContext](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context).
-->
關於 PodSecurityPolicy，還需要了解：它與
[PodSecurityContext](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context) 不同。

<!--
A part of the Pod specification, PodSecurityContext (and its per-container counterpart `SecurityContext`)
is the collection of fields that specify many of the security-relevant settings for a Pod.
The security context dictates to the kubelet and container runtime how the Pod should actually be run.
In contrast, the PodSecurityPolicy only constrains (or defaults) the values that may be set on the security context.
-->
作爲 Pod 規約的一部分，PodSecurityContext（及其每個容器對應的 `SecurityContext`）
是一組字段的集合，這些字段爲 Pod 指定了與安全相關的許多設置。
安全上下文指示 kubelet 和容器運行時究竟應該如何運行 Pod。
相反，PodSecurityPolicy 僅約束可能在安全上下文中設置的值（或設置默認值）。

<!--
The deprecation of PSP does not affect PodSecurityContext in any way.
-->
棄用 PSP 不會以任何方式影響 PodSecurityContext。

<!--
## Why did we need PodSecurityPolicy?
-->
## 以前爲什麼需要 PodSecurityPolicy？

<!--
In Kubernetes, we define resources such as Deployments, StatefulSets, and Services that
represent the building blocks of software applications. The various controllers inside
a Kubernetes cluster react to these resources, creating further Kubernetes resources or
configuring some software or hardware to accomplish our goals.
-->
在 Kubernetes 中，我們定義了 Deployment、StatefulSet 和 Service 等資源。
這些資源代表軟件應用程序的構建塊。Kubernetes 集羣中的各種控制器根據這些資源做出反應，
創建更多的 Kubernetes 資源或配置一些軟件或硬件來實現我們的目標。

<!--
In most Kubernetes clusters, 
RBAC (Role-Based Access Control) [rules](/docs/reference/access-authn-authz/rbac/#role-and-clusterrole)
control access to these resources. `list`, `get`, `create`, `edit`, and `delete` are
the sorts of API operations that RBAC cares about,
but _RBAC does not consider what settings are being put into the resources it controls_.
For example, a Pod can be almost anything from a simple webserver to
a privileged command prompt offering full access to the underlying server node and all the data.
It’s all the same to RBAC: a Pod is a Pod is a Pod.
-->
在大多數 Kubernetes 集羣中，由 RBAC（基於角色的訪問控制）[規則](/zh-cn/docs/reference/access-authn-authz/rbac/#role-and-clusterrole)
控制對這些資源的訪問。 `list`、`get`、`create`、`edit` 和 `delete` 是 RBAC 關心的 API 操作類型，
但 **RBAC 不考慮其所控制的資源中加入了哪些設置**。例如，
Pod 幾乎可以是任何東西，例如簡單的網絡服務器，或者是特權命令提示（提供對底層服務器節點和所有數據的完全訪問權限）。
這對 RBAC 來說都是一樣的：Pod 就是 Pod 而已。

<!--
To control what sorts of settings are allowed in the resources defined in your cluster,
you need Admission Control in addition to RBAC. Since Kubernetes 1.3,
PodSecurityPolicy has been the built-in way to do that for security-related Pod fields.
Using PodSecurityPolicy, you can prevent “create Pod” from automatically meaning “root on every cluster node,”
without needing to deploy additional external admission controllers.
-->
要控制集羣中定義的資源允許哪些類型的設置，除了 RBAC 之外，還需要准入控制。
從 Kubernetes 1.3 開始，內置 PodSecurityPolicy 一直被作爲 Pod 安全相關字段的准入控制機制。
使用 PodSecurityPolicy，可以防止“創建 Pod”這個能力自動變成“每個集羣節點上的 root 用戶”，
並且無需部署額外的外部准入控制器。

<!--
## Why is PodSecurityPolicy going away?
-->
## 現在爲什麼 PodSecurityPolicy 要消失？

<!--
In the years since PodSecurityPolicy was first introduced, we have realized that
PSP has some serious usability problems that can’t be addressed without making breaking changes.
-->
自從首次引入 PodSecurityPolicy 以來，我們已經意識到 PSP 存在一些嚴重的可用性問題，
只有做出斷裂式的改變才能解決。

<!--
The way PSPs are applied to Pods has proven confusing to nearly everyone that has attempted to use them.
It is easy to accidentally grant broader permissions than intended,
and difficult to inspect which PSP(s) apply in a given situation. The “changing Pod defaults” feature can be handy,
but is only supported for certain Pod settings and it’s not obvious when they will or will not apply to your Pod.
Without a “dry run” or audit mode, it’s impractical to retrofit PSP to existing clusters safely,
and it’s impossible for PSP to ever be enabled by default.
-->
實踐證明，PSP 應用於 Pod 的方式讓幾乎所有嘗試使用它們的人都感到困惑。
很容易意外授予比預期更廣泛的權限，並且難以查看某種特定情況下應用了哪些 PSP。
“更改 Pod 默認值”功能很方便，但僅支持某些 Pod 設置，而且無法明確知道它們何時會或不會應用於的 Pod。
如果沒有“試運行”或審計模式，將 PSP 安全地改造並應用到現有集羣是不切實際的，並且永遠都不可能默認啓用 PSP。

<!--
For more information about these and other PSP difficulties, check out
SIG Auth’s KubeCon NA 2019 Maintainer Track session video:{{< youtube "SFtHRmPuhEw?start=953" youtube-quote-sm >}}
-->
有關這些問題和其他 PSP 困難的更多信息，請查看
KubeCon NA 2019 的 SIG Auth 維護者頻道會議記錄：{{< youtube "SFtHRmPuhEw?start=953" youtube-quote-sm >}}

<!--
Today, you’re not limited only to deploying PSP or writing your own custom admission controller.
Several external admission controllers are available that incorporate lessons learned from PSP to
provide a better user experience. [K-Rail](https://github.com/cruise-automation/k-rail),
[Kyverno](https://github.com/kyverno/kyverno/), and
[OPA/Gatekeeper](https://github.com/open-policy-agent/gatekeeper/) are all well-known, and each has its fans.
-->
如今，你不再侷限於部署 PSP 或編寫自己的自定義准入控制器。
有幾個外部准入控制器可用，它們結合了從 PSP 中吸取的經驗教訓以提供更好的用戶體驗。
[K-Rail](https://github.com/cruise-automation/k-rail)、
[Kyverno](https://github.com/kyverno/kyverno/)、
[OPA/Gatekeeper](https://github.com/open-policy-agent/gatekeeper/) 都家喻戶曉，各有粉絲。

<!--
Although there are other good options available now, we believe there is still value in
having a built-in admission controller available as a choice for users. With this in mind,
we turn toward building what’s next, inspired by the lessons learned from PSP.
-->
儘管現在還有其他不錯的選擇，但我們認爲，提供一個內置的准入控制器供用戶選擇，仍然是有價值的事情。
考慮到這一點，以及受 PSP 經驗的啓發，我們轉向下一步。

<!--
## What’s next?
-->
## 下一步是什麼？

<!--
Kubernetes SIG Security, SIG Auth, and a diverse collection of other community members
have been working together for months to ensure that what’s coming next is going to be awesome.
We have developed a Kubernetes Enhancement Proposal ([KEP 2579](https://github.com/kubernetes/enhancements/issues/2579))
and a prototype for a new feature, currently being called by the temporary name "PSP Replacement Policy."
We are targeting an Alpha release in Kubernetes 1.22.
-->
Kubernetes SIG Security、SIG Auth 和其他社區成員幾個月來一直在傾力合作，確保接下來的方案能令人驚歎。
我們擬定了 Kubernetes 增強提案（[KEP 2579](https://github.com/kubernetes/enhancements/issues/2579)）
以及一個新功能的原型，目前稱之爲“PSP 替代策略”。
我們的目標是在 Kubernetes 1.22 中發佈 Alpha 版本。

<!--
PSP Replacement Policy starts with the realization that
since there is a robust ecosystem of external admission controllers already available,
PSP’s replacement doesn’t need to be all things to all people.
Simplicity of deployment and adoption is the key advantage a built-in admission controller has
compared to an external webhook, so we have focused on how to best utilize that advantage.
-->
PSP 替代策略始於，我們認識到已經有一個強大的外部准入控制器生態系統可用，
所以，PSP 的替代品不需要滿足所有人的所有需求。與外部 Webhook 相比，
部署和採用的簡單性是內置准入控制器的關鍵優勢。我們專注於如何最好地利用這一優勢。

<!--
PSP Replacement Policy is designed to be as simple as practically possible
while providing enough flexibility to really be useful in production at scale.
It has soft rollout features to enable retrofitting it to existing clusters,
and is configurable enough that it can eventually be active by default.
It can be deactivated partially or entirely, to coexist with external admission controllers for advanced use cases.
-->
PSP 替代策略旨在儘可能簡單，同時提供足夠的靈活性以支撐大規模生產場景。
它具有柔性上線能力，以便於將其改裝到現有集羣，並且新的策略是可配置的，可以設置爲默認啓用。
PSP 替代策略可以被部分或全部禁用，以便在高級使用場景中與外部准入控制器共存。

<!--
## What does this mean for you?
-->
## 這對你意味着什麼？

<!--
What this all means for you depends on your current PSP situation.
If you’re already using PSP, there’s plenty of time to plan your next move.
Please review the PSP Replacement Policy KEP and think about how well it will suit your use case.
-->
這一切對你意味着什麼取決於你當前的 PSP 情況。如果已經在使用 PSP，那麼你有足夠的時間來計劃下一步行動。
請查看 PSP 替代策略 KEP 並考慮它是否適合你的使用場景。

<!--
If you’re making extensive use of the flexibility of PSP with numerous PSPs and complex binding rules,
you will likely find the simplicity of PSP Replacement Policy too limiting.
Use the next year to evaluate the other admission controller choices in the ecosystem.
There are resources available to ease this transition,
such as the [Gatekeeper Policy Library](https://github.com/open-policy-agent/gatekeeper-library).
-->
如果你已經在通過衆多 PSP 和複雜的綁定規則深度利用 PSP 的靈活性，你可能會發現 PSP 替代策略的簡單性有太多限制。
此時，建議你在接下來的一年中評估一下生態系統中的其他准入控制器選擇。有些資源可以讓這種過渡更容易，
比如 [Gatekeeper Policy Library](https://github.com/open-policy-agent/gatekeeper-library)。

<!--
If your use of PSP is relatively simple, with a few policies and straightforward binding to
service accounts in each namespace, you will likely find PSP Replacement Policy to be a good match for your needs.
Evaluate your PSPs compared to the Kubernetes [Pod Security Standards](/docs/concepts/security/pod-security-standards/)
to get a feel for where you’ll be able to use the Restricted, Baseline, and Privileged policies.
Please follow along with or contribute to the KEP and subsequent development,
and try out the Alpha release of PSP Replacement Policy when it becomes available.
-->
如果只是使用 PSP 的基礎功能，只用幾個策略並直接綁定到每個命名空間中的服務帳戶，
你可能會發現 PSP 替代策略非常適合你的需求。
對比 Kubernetes [Pod 安全標準](/zh-cn/docs/concepts/security/pod-security-standards/) 評估你的 PSP，
瞭解可以在哪些情形下使用限制策略、基線策略和特權策略。
歡迎關注或爲 KEP 和後續發展做出貢獻，並在可用時試用 PSP 替代策略的 Alpha 版本。

<!--
If you’re just beginning your PSP journey, you will save time and effort by keeping it simple.
You can approximate the functionality of PSP Replacement Policy today by using the Pod Security Standards’ PSPs.
If you set the cluster default by binding a Baseline or Restricted policy to the `system:serviceaccounts` group,
and then make a more-permissive policy available as needed in certain
Namespaces [using ServiceAccount bindings](/docs/concepts/policy/pod-security-policy/#run-another-pod),
you will avoid many of the PSP pitfalls and have an easy migration to PSP Replacement Policy.
If your needs are much more complex than this, your effort is probably better spent adopting
one of the more fully-featured external admission controllers mentioned above.
-->
如果剛剛開始 PSP 之旅，你可以通過保持簡單來節省時間和精力。
你可以使用 Pod 安全標準的 PSP 來獲得和目前 PSP 替代策略相似的功能。
如果你將基線策略或限制策略綁定到 `system:serviceaccounts` 組來設置集羣默認值，
然後[使用 ServiceAccount 綁定](/zh-cn/docs/concepts/policy/pod-security-policy/#run-another-pod)
在某些命名空間下根據需要制定更寬鬆的策略，就可以避免許多 PSP 陷阱並輕鬆遷移到 PSP 替代策略。
如果你的需求比這複雜得多，那麼建議將精力花在採用比上面提到的功能更全的某個外部准入控制器。

<!--
We’re dedicated to making Kubernetes the best container orchestration tool we can,
and sometimes that means we need to remove longstanding features to make space for better things to come.
When that happens, the Kubernetes deprecation policy ensures you have plenty of time to plan your next move.
In the case of PodSecurityPolicy, several options are available to suit a range of needs and use cases.
Start planning ahead now for PSP’s eventual removal, and please consider contributing to its replacement! Happy securing!
-->
我們致力於使 Kubernetes 成爲我們可以做到的最好的容器編排工具，
有時這意味着我們需要刪除長期存在的功能，以便爲更好的特性騰出空間。
發生這種情況時，Kubernetes 棄用策略可確保你有足夠的時間來計劃下一步行動。
對於 PodSecurityPolicy，有幾個選項可以滿足一系列需求和用例。
現在就開始爲 PSP 的最終移除提前制定計劃，請考慮爲它的替換做出貢獻！<!--omitted "Happy securing!" as suggested-->

<!--
**Acknowledgment:** It takes a wonderful group to make wonderful software.
Thanks are due to everyone who has contributed to the PSP replacement effort,
especially (in alphabetical order) Tim Allclair, Ian Coldwater, and Jordan Liggitt.
It’s been a joy to work with y’all on this.
-->
**致謝：** 研發優秀的軟件需要優秀的團隊。感謝爲 PSP 替代工作做出貢獻的所有人，
尤其是（按字母順序）Tim Allclair、Ian Coldwater 和 Jordan Liggitt。
和你們共事非常愉快。
