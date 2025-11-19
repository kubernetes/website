---
layout: blog
title: "聚焦 SIG API Machinery"
slug: sig-api-machinery-spotlight-2024
date: 2024-08-07
author: "Frederico Muñoz (SAS Institute)"
translator: >
  [Michael Yao](https://github.com/windsonsea) (DaoCloud)
---
<!--
layout: blog
title: "Spotlight on SIG API Machinery"
slug: sig-api-machinery-spotlight-2024
canonicalUrl: https://www.kubernetes.dev/blog/2024/08/07/sig-api-machinery-spotlight-2024
date: 2024-08-07
author: "Frederico Muñoz (SAS Institute)"
-->

<!--
We recently talked with [Federico Bongiovanni](https://github.com/fedebongio) (Google) and [David
Eads](https://github.com/deads2k) (Red Hat), Chairs of SIG API Machinery, to know a bit more about
this Kubernetes Special Interest Group.
-->
我們最近與 SIG API Machinery 的主席
[Federico Bongiovanni](https://github.com/fedebongio)（Google）和
[David Eads](https://github.com/deads2k)（Red Hat）進行了訪談，
瞭解一些有關這個 Kubernetes 特別興趣小組的信息。

<!--
## Introductions

**Frederico (FSM): Hello, and thank your for your time. To start with, could you tell us about
yourselves and how you got involved in Kubernetes?**
-->
## 介紹   {#introductions}

**Frederico (FSM)：你好，感謝你抽時間參與訪談。首先，你能做個自我介紹以及你是如何參與到 Kubernetes 的？**

<!--
**David**: I started working on
[OpenShift](https://www.redhat.com/en/technologies/cloud-computing/openshift) (the Red Hat
distribution of Kubernetes) in the fall of 2014 and got involved pretty quickly in API Machinery. My
first PRs were fixing kube-apiserver error messages and from there I branched out to `kubectl`
(_kubeconfigs_ are my fault!), `auth` ([RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) and `*Review` APIs are ports
from OpenShift), `apps` (_workqueues_ and _sharedinformers_ for example). Don’t tell the others,
but API Machinery is still my favorite :)
-->
**David**：我在 2014 年秋天開始在
[OpenShift](https://www.redhat.com/zh/technologies/cloud-computing/openshift)
（Red Hat 的 Kubernetes 發行版）工作，很快就參與到 API Machinery 的工作中。
我的第一個 PR 是修復 kube-apiserver 的錯誤消息，然後逐漸擴展到 `kubectl`（_kubeconfigs_ 是我的傑作！），
`auth`（[RBAC](https://kubernetes.io/zh-cn/docs/reference/access-authn-authz/rbac/)
和 `*Review` API 是從 OpenShift 移植過來的），`apps`（例如 _workqueues_ 和 _sharedinformers_）。
別告訴別人，但 API Machinery 仍然是我的最愛 :)

<!--
**Federico**: I was not as early in Kubernetes as David, but now it's been more than six years. At
my previous company we were starting to use Kubernetes for our own products, and when I came across
the opportunity to work directly with Kubernetes I left everything and boarded the ship (no pun
intended). I joined Google and Kubernetes in early 2018, and have been involved since.
-->
**Federico**：我加入 Kubernetes 沒有 David 那麼早，但現在也已經超過六年了。
在我之前的公司，我們開始爲自己的產品使用 Kubernetes，當我有機會直接參與 Kubernetes 的工作時，
我放下了一切，登上了這艘船（無意雙關）。我在 2018 年初加入 Google 從事 Kubernetes 的相關工作，
從那時起一直參與其中。

<!--
## SIG Machinery's scope

**FSM: It only takes a quick look at the SIG API Machinery charter to see that it has quite a
significant scope, nothing less than the Kubernetes control plane. Could you describe this scope in
your own words?**
-->
## SIG Machinery 的範圍   {#sig-machinerys-scope}

**FSM：只需快速瀏覽一下 SIG API Machinery 的章程，就可以看到它的範圍相當廣泛，
不亞於 Kubernetes 的控制平面。你能用自己的話描述一下這個範圍嗎？**

<!--
**David**: We own the `kube-apiserver` and how to efficiently use it. On the backend, that includes
its contract with backend storage and how it allows API schema evolution over time.  On the
frontend, that includes schema best practices, serialization, client patterns, and controller
patterns on top of all of it.

**Federico**: Kubernetes has a lot of different components, but the control plane has a really
critical mission: it's your communication layer with the cluster and also owns all the extensibility
mechanisms that make Kubernetes so powerful. We can't make mistakes like a regression, or an
incompatible change, because the blast radius is huge.
-->
**David**：我們全權負責 `kube-apiserver` 以及如何高效地使用它。
在後端，這包括它與後端存儲的契約以及如何讓 API 模式隨時間演變。
在前端，這包括模式的最佳實踐、序列化、客戶端模式以及在其之上的控制器模式。

**Federico**：Kubernetes 有很多不同的組件，但控制平面有一個非常關鍵的任務：
它是你與叢集的通信層，同時也擁有所有使 Kubernetes 如此強大的可擴展機制。
我們不能犯像迴歸或不兼容變更這樣的錯誤，因爲影響範圍太大了。

<!--
**FSM: Given this breadth, how do you manage the different aspects of it?**

**Federico**: We try to organize the large amount of work into smaller areas. The working groups and
subprojects are part of it. Different people on the SIG have their own areas of expertise, and if
everything fails, we are really lucky to have people like David, Joe, and Stefan who really are "all
terrain", in a way that keeps impressing me even after all these years.  But on the other hand this
is the reason why we need more people to help us carry the quality and excellence of Kubernetes from
release to release.
-->
**FSM：鑑於這個廣度，你們如何管理它的不同方面？**

**Federico**：我們嘗試將大量工作組織成較小的領域。工作組和子項目是其中的一部分。
SIG 中的各位貢獻者有各自的專長領域，如果一切都失敗了，我們很幸運有像 David、Joe 和 Stefan 這樣的人，
他們真的是“全能型”，這種方式讓我在這些年裏一直感到驚歎。但另一方面，
這也是爲什麼我們需要更多人來幫助我們在版本變遷之時保持 Kubernetes 的質量和卓越。

<!--
## An evolving collaboration model

**FSM: Was the existing model always like this, or did it evolve with time - and if so, what would
you consider the main changes and the reason behind them?**

**David**: API Machinery has evolved over time both growing and contracting in scope.  When trying
to satisfy client access patterns it’s very easy to add scope both in terms of features and applying
them.
-->
## 不斷演變的協作模式   {#an-evolving-collaboration-model}

**FSM：現有的模式一直是這樣，還是隨着時間的推移而演變的 - 如果是在演變的，你認爲主要的變化以及背後的原因是什麼？**

**David**：API Machinery 在隨着時間的推移不斷發展，既有擴展也有收縮。
在嘗試滿足客戶端訪問模式時，它很容易在特性和應用方面擴大範圍。

<!--
A good example of growing scope is the way that we identified a need to reduce memory utilization by
clients writing controllers and developed shared informers.  In developing shared informers and the
controller patterns use them (workqueues, error handling, and listers), we greatly reduced memory
utilization and eliminated many expensive lists.  The downside: we grew a new set of capability to
support and effectively took ownership of that area from sig-apps.
-->
一個範圍擴大的好例子是我們認識到需要減少客戶端寫入控制器時的內存使用率而開發了共享通知器。
在開發共享通知器和使用它們的控制器模式（工作隊列、錯誤處理和列舉器）時，
我們大大減少了內存使用率，並消除了許多佔用資源較多的列表。
缺點是：我們增加了一套新的權能來提供支持，並有效地從 sig-apps 接管了該領域的所有權。

<!--
For an example of more shared ownership: building out cooperative resource management (the goal of
server-side apply), `kubectl` expanded to take ownership of leveraging the server-side apply
capability.  The transition isn’t yet complete, but [SIG
CLI](https://github.com/kubernetes/community/tree/master/sig-cli) manages that usage and owns it.
-->
一個更多共享所有權的例子是：構建出合作的資源管理（伺服器端應用的目標），
`kubectl` 擴展爲負責利用伺服器端應用的權能。這個過渡尚未完成，
但 [SIG CLI](https://github.com/kubernetes/community/tree/master/sig-cli) 管理其使用情況並擁有它。

<!--
**FSM: And for the boundary between approaches, do you have any guidelines?**

**David**: I think much depends on the impact. If the impact is local in immediate effect, we advise
other SIGs and let them move at their own pace.  If the impact is global in immediate effect without
a natural incentive, we’ve found a need to press for adoption directly.

**FSM: Still on that note, SIG Architecture has an API Governance subproject, is it mostly
independent from SIG API Machinery or are there important connection points?**
-->
**FSM：對於方法之間的權衡，你們有什麼指導方針嗎？**

**David**：我認爲這很大程度上取決於影響。如果影響在立即見效中是局部的，
我們會給其他 SIG 提出建議並讓他們以自己的節奏推進。
如果影響在立即見效中是全局的且沒有自然的激勵，我們發現需要直接推動採用。

**FSM：仍然在這個話題上，SIG Architecture 有一個 API Governance 子項目，
它與 SIG API Machinery 是否完全獨立，還是有重要的連接點？**

<!--
**David**: The projects have similar sounding names and carry some impacts on each other, but have
different missions and scopes.  API Machinery owns the how and API Governance owns the what.  API
conventions, the API approval process, and the final say on individual k8s.io APIs belong to API
Governance.  API Machinery owns the REST semantics and non-API specific behaviors.

**Federico**: I really like how David put it: *"API Machinery owns the how and API Governance owns
the what"*: we don't own the actual APIs, but the actual APIs live through us.
-->
**David**：這些項目有相似的名稱並對彼此產生一些影響，但有不同的使命和範圍。
API Machinery 負責“如何做”，而 API Governance 負責“做什麼”。
API 約定、API 審批過程以及對單個 k8s.io API 的最終決定權屬於 API Governance。
API Machinery 負責 REST 語義和非 API 特定行爲。

**Federico**：我真得很喜歡 David 的說法：
**“API Machinery 負責‘如何做’，而 API Governance 負責‘做什麼’”**：
我們並未擁有實際的 API，但實際的 API 依靠我們存在。

<!--
## The challenges of Kubernetes popularity

**FSM: With the growth in Kubernetes adoption we have certainly seen increased demands from the
Control Plane: how is this felt and how does it influence the work of the SIG?**

**David**: It’s had a massive influence on API Machinery.  Over the years we have often responded to
and many times enabled the evolutionary stages of Kubernetes.  As the central orchestration hub of
nearly all capability on Kubernetes clusters, we both lead and follow the community.  In broad
strokes I see a few evolution stages for API Machinery over the years, with constantly high
activity.
-->
## Kubernetes 受歡迎的挑戰   {#the-challenge-of-kubernetes-popularity}

**FSM：隨着 Kubernetes 的採用率上升，我們肯定看到了對控制平面的需求增加：你們對這點的感受如何，它如何影響 SIG 的工作？**

**David**：這對 API Machinery 產生了巨大的影響。多年來，我們經常響應並多次促進了 Kubernetes 的發展階段。
作爲幾乎所有 Kubernetes 叢集上權能的集中編排中心，我們既領導又跟隨社區。
從廣義上講，我看到多年來 API Machinery 經歷了一些發展階段，活躍度一直很高。

<!--
1. **Finding purpose**: `pre-1.0` up until `v1.3` (up to our first 1000+ nodes/namespaces) or
   so. This time was characterized by rapid change.  We went through five different versions of our
   schemas and rose to meet the need.  We optimized for quick, in-tree API evolution (sometimes to
   the detriment of longer term goals), and defined patterns for the first time.

2. **Scaling to meet the need**: `v1.3-1.9` (up to shared informers in controllers) or so.  When we
   started trying to meet customer needs as we gained adoption, we found severe scale limitations in
   terms of CPU and memory. This was where we broadened API machinery to include access patterns, but
   were still heavily focused on in-tree types.  We built the watch cache, protobuf serialization,
   and shared caches.
-->
1. **尋找目標**：從 `pre-1.0` 到 `v1.3`（我們達到了第一個 1000+ 節點/命名空間）。
   這段時間以快速變化爲特徵。我們經歷了五個不同版本的模式，並滿足了需求。
   我們優化了快速、樹內 API 的演變（有時以犧牲長期目標爲代價），並首次定義了模式。

2. **滿足需求的擴展**：`v1.3-1.9`（直到控制器中的共享通知器）。
   當我們開始嘗試滿足客戶需求時，我們發現了嚴重的 CPU 和內存規模限制。
   這也是爲什麼我們將 API Machinery 擴展到包含訪問模式，但我們仍然非常關注樹內類型。
   我們構建了 watch 緩存、protobuf 序列化和共享緩存。

<!--
3. **Fostering the ecosystem**: `v1.8-1.21` (up to CRD v1) or so.  This was when we designed and wrote
   CRDs (the considered replacement for third-party-resources), the immediate needs we knew were
   coming (admission webhooks), and evolution to best practices we knew we needed (API schemas).
   This enabled an explosion of early adopters willing to work very carefully within the constraints
   to enable their use-cases for servicing pods.  The adoption was very fast, sometimes outpacing
   our capability, and creating new problems.
-->
3. **培育生態系統**：`v1.8-1.21`（直到 CRD v1）。這是我們設計和編寫 CRD（視爲第三方資源的替代品）的時間，
   滿足我們知道即將到來的即時需求（准入 Webhook），以及我們知道需要的最佳實踐演變（API 模式）。
   這促成了早期採用者的爆發式增長，他們願意在約束內非常謹慎地工作，以實現服務 Pod 的用例。
   採用速度非常快，有時超出了我們的權能，並形成了新的問題。

<!--
4. **Simplifying deployments**: `v1.22+`.  In the relatively recent past, we’ve been responding to
   pressures or running kube clusters at scale with large numbers of sometimes-conflicting ecosystem
   projects using our extensions mechanisms.  Lots of effort is now going into making platform
   extensions easier to write and safer to manage by people who don't hold PhDs in kubernetes.  This
   started with things like server-side-apply and continues today with features like webhook match
   conditions and validating admission policies.
-->
4. **簡化部署**：`v1.22+`。在不久之前，
   我們採用擴展機制來響應運行大規模的 Kubernetes 叢集的壓力，其中包含大量有時會發生衝突的生態系統項目。
   我們投入了許多努力，使平臺更易於擴展，管理更安全，就算不是很精通 Kubernetes 的人也能做到。
   這些努力始於伺服器端應用，並在如今延續到 Webhook 匹配狀況和驗證准入策略等特性。

<!--
Work in API Machinery has a broad impact across the project and the ecosystem.  It’s an exciting
area to work for those able to make a significant time investment on a long time horizon.

## The road ahead

**FSM: With those different evolutionary stages in mind, what would you pinpoint as the top
priorities for the SIG at this time?**
-->
API Machinery 的工作對整個項目和生態系統有廣泛的影響。
對於那些能夠長期投入大量時間的人來說，這是一個令人興奮的工作領域。

## 未來發展   {#the-road-ahead}

**FSM：考慮到這些不同的發展階段，你能說說這個 SIG 的當前首要任務是什麼嗎？**

<!--
**David:** **Reliability, efficiency, and capability** in roughly that order.

With the increased usage of our `kube-apiserver` and extensions mechanisms, we find that our first
set of extensions mechanisms, while fairly complete in terms of capability, carry significant risks
in terms of potential mis-use with large blast radius.  To mitigate these risks, we’re investing in
features that reduce the blast radius for accidents (webhook match conditions) and which provide
alternative mechanisms with lower risk profiles for most actions (validating admission policy).
-->
**David**：大致的順序爲**可靠性、效率和權能**。

隨着 `kube-apiserver` 和擴展機制的使用增加，我們發現第一套擴展機制雖然在權能方面相當完整，
但在潛在誤用方面存在重大風險，影響範圍很大。爲了減輕這些風險，我們正在致力於減少事故影響範圍的特性
（Webhook 匹配狀況）以及爲大多數操作提供風險設定較低的替代機制（驗證准入策略）。

<!--
At the same time, the increased usage has made us more aware of scaling limitations that we can
improve both server and client-side.  Efforts here include more efficient serialization (CBOR),
reduced etcd load (consistent reads from cache), and reduced peak memory usage (streaming lists).

And finally, the increased usage has highlighted some long existing
gaps that we’re closing.  Things like field selectors for CRDs which
the [Batch Working Group](https://github.com/kubernetes/community/blob/master/wg-batch/README.md)
is eager to leverage and will eventually form the basis for a new way
to prevent trampoline pod attacks from exploited nodes.
-->
同時，使用量的增加使我們更加意識到我們可以同時改進伺服器端和客戶端的擴縮限制。
這裏的努力包括更高效的序列化（CBOR），減少 etcd 負載（從緩存中一致讀取）和減少峯值內存使用量（流式列表）。

最後，使用量的增加突顯了一些長期存在的、我們正在設法填補的差距。這些包括針對 CRD 的字段選擇算符，
[Batch Working Group](https://github.com/kubernetes/community/blob/master/wg-batch/README.md)
渴望利用這些選擇算符，並最終構建一種新的方法以防止從有漏洞的節點實施“蹦牀式”的 Pod 攻擊。

<!--
## Joining the fun

**FSM: For anyone wanting to start contributing, what's your suggestions?**

**Federico**: SIG API Machinery is not an exception to the Kubernetes motto: **Chop Wood and Carry
Water**. There are multiple weekly meetings that are open to everybody, and there is always more
work to be done than people to do it.
-->
## 加入有趣的我們   {#joining-the-fun}

**FSM：如果有人想要開始貢獻，你有什麼建議？**

**Federico**：SIG API Machinery 毫不例外也遵循 Kubernetes 的風格：**砍柴和挑水（踏實工作，注重細節）**。
有多個每週例會對所有人開放，總是有更多的工作要做，人手總是不夠。

<!--
I acknowledge that API Machinery is not easy, and the ramp up will be steep. The bar is high,
because of the reasons we've been discussing: we carry a huge responsibility. But of course with
passion and perseverance many people has ramped up through the years, and we hope more will come.

In terms of concrete opportunities, there is the SIG meeting every two weeks. Everyone is welcome to
attend and listen, see what the group talks about, see what's going on in this release, etc.
-->
我承認 API Machinery 並不容易，入門的坡度會比較陡峭。門檻較高，就像我們所討論的原因：我們肩負着巨大的責任。
當然憑藉激情和毅力，多年來有許多人已經跟了上來，我們希望更多的人加入。

具體的機會方面，每兩週有一次 SIG 會議。歡迎所有人蔘會和聽會，瞭解小組在討論什麼，瞭解這個版本中發生了什麼等等。

<!--
Also two times a week, Tuesday and Thursday, we have the public Bug Triage, where we go through
everything new from the last meeting. We've been keeping this practice for more than 7 years
now. It's a great opportunity to volunteer to review code, fix bugs, improve documentation,
etc. Tuesday's it's at 1 PM (PST) and Thursday is on an EMEA friendly time (9:30 AM PST).  We are
always looking to improve, and we hope to be able to provide more concrete opportunities to join and
participate in the future.
-->
此外，每週兩次，週二和週四，我們有公開的 Bug 分類管理會，在會上我們會討論上次會議以來的所有新內容。
我們已經保持這種做法 7 年多了。這是一個很好的機會，你可以志願審查代碼、修復 Bug、改進文檔等。
週二的會議在下午 1 點（PST），週四是在 EMEA 友好時間（上午 9:30 PST）。
我們總是在尋找改進的機會，希望能夠在未來提供更多具體的參與機會。

<!--
**FSM: Excellent, thank you! Any final comments you would like to share with our readers?**

**Federico**: As I mentioned, the first steps might be hard, but the reward is also larger. Working
on API Machinery is working on an area of huge impact (millions of users?), and your contributions
will have a direct outcome in the way that Kubernetes works and the way that it's used. For me
that's enough reward and motivation!
-->
**FSM：太好了，謝謝！你們還有什麼想與我們的讀者分享嗎？**

**Federico**：正如我提到的，第一步可能較難，但回報也更大。
參與 API Machinery 的工作就是在加入一個影響巨大（百萬使用者？）的領域，
你的貢獻將直接影響 Kubernetes 的工作方式和使用方式。對我來說，這已經足夠作爲回報和動力了！
