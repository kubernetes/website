---
layout: blog
title: 考慮所有微服務的脆弱性並對其行爲進行監控
date: 2023-01-20
slug: security-behavior-analysis
---
<!-- 
layout: blog
title: Consider All Microservices Vulnerable — And Monitor Their Behavior
date: 2023-01-20
slug: security-behavior-analysis
-->

<!--
**Author:**
David Hadas (IBM Research Labs)
-->
**作者**：David Hadas (IBM Research Labs)

**譯者**：Wilson Wu (DaoCloud)

<!--
_This post warns Devops from a false sense of security. Following security best practices when developing and configuring microservices do not result in non-vulnerable microservices. The post shows that although all deployed microservices are vulnerable, there is much that can be done to ensure microservices are not exploited. It explains how analyzing the behavior of clients and services from a security standpoint, named here **"Security-Behavior Analytics"**, can protect the deployed vulnerable microservices. It points to [Guard](http://knative.dev/security-guard), an open source project offering security-behavior monitoring and control of Kubernetes microservices presumed vulnerable._
-->
_本文對 DevOps 產生的錯誤安全意識做出提醒。開發和設定微服務時遵循安全最佳實踐並不能讓微服務不易被攻擊。
本文說明，即使所有已部署的微服務都容易被攻擊，但仍然可以採取很多措施來確保微服務不被利用。
本文解釋瞭如何從安全角度對客戶端和服務的行爲進行分析，此處稱爲 **“安全行爲分析”** ，
可以對已部署的易被攻擊的微服務進行保護。本文會引用 [Guard](http://knative.dev/security-guard)，
一個開源項目，對假定易被攻擊的 Kubernetes 微服務的安全行爲提供監測與控制。_

<!--
As cyber attacks continue to intensify in sophistication, organizations deploying cloud services continue to grow their cyber investments aiming to produce safe and non-vulnerable services. However, the year-by-year growth in cyber investments does not result in a parallel reduction in cyber incidents. Instead, the number of cyber incidents continues to grow annually. Evidently, organizations are doomed to fail in this struggle - no matter how much effort is made to detect and remove cyber weaknesses from deployed services, it seems offenders always have the upper hand.
-->
隨着網路攻擊的複雜性不斷加劇，部署雲服務的組織持續追加網路安全投資，旨在提供安全且不易被攻擊的服務。
然而，網路安全投資的逐年增長並沒有造成網路安全事件的同步減少。相反，網路安全事件的數量每年都在持續增長。
顯然，這些組織在這場鬥爭中註定會失敗——無論付出多大努力來檢測和消除已部署服務中的網路安全弱點，攻擊者似乎總是佔據上風。

<!--
Considering the current spread of offensive tools, sophistication of offensive players, and ever-growing cyber financial gains to offenders, any cyber strategy that relies on constructing a non-vulnerable, weakness-free service in 2023 is clearly too naïve. It seems the only viable strategy is to:
-->
考慮到當前廣泛傳播的攻擊工具、複雜的攻擊者以及攻擊者們不斷增長的網路安全經濟收益，
在 2023 年，任何依賴於構建無漏洞、無弱點服務的網路安全戰略顯然都過於天真。看來唯一可行的策略是：

<!--
&#x27A5; **Admit that your services are vulnerable!**
-->
&#x27A5; **承認你的服務容易被攻擊！**

<!--
In other words, consciously accept that you will never create completely invulnerable services. If your opponents find even a single weakness as an entry-point, you lose! Admitting that in spite of your best efforts, all your services are still vulnerable is an important first step. Next, this post discusses what you can do about it...
-->
換句話說，清醒地接受你永遠無法創建完全無懈可擊服務的事實。
如果你的對手找到哪怕一個弱點作爲切入點，你就輸了！承認儘管你盡了最大努力，
你的所有服務仍然容易被攻擊，這是重要的第一步。接下來，本文將討論你可以對此做些什麼......

<!--
## How to protect microservices from being exploited
-->
## 如何保護微服務不被利用 {#how-to-protect-microservices-from-being-exploited}

<!--
Being vulnerable does not necessarily mean that your service will be exploited. Though your services are vulnerable in some ways unknown to you, offenders still need to identify these vulnerabilities and then exploit them. If offenders fail to exploit your service vulnerabilities, you win! In other words, having a vulnerability that can’t be exploited, represents a risk that can’t be realized.
-->
容易被攻擊並不一定意味着你的服務將被利用。儘管你的服務在某些方面存在你不知道的漏洞，
但攻擊者仍然需要識別這些漏洞並利用它們。如果攻擊者無法利用你服務的漏洞，你就贏了！
換句話說，擁有無法利用的漏洞就意味着擁有無法坐實的風險。

<!--
{{< figure src="security_behavior_figure_1.svg" alt="Image of an example of offender gaining foothold in a service" class="diagram-large" caption="Figure 1. An Offender gaining foothold in a vulnerable service" >}}
-->
{{< figure src="security_behavior_figure_1.svg" alt="攻擊者在服務中取得立足點的示意圖" class="diagram-large" caption="圖 1：攻擊者在易被攻擊的服務中取得立足點" >}}

<!--
The above diagram shows an example in which the offender does not yet have a foothold in the service; that is, it is assumed that your service does not run code controlled by the offender on day 1. In our example the service has vulnerabilities in the API exposed to clients. To gain an initial foothold the offender uses a malicious client to try and exploit one of the service API vulnerabilities. The malicious client sends an exploit that triggers some unplanned behavior of the service.
-->
如上圖所示，攻擊者尚未在服務中取得立足點；也就是說，假設你的服務在第一天沒有運行由攻擊者控制的代碼。
在我們的示例中，該服務暴露給客戶端的 API 中存在漏洞。爲了獲得初始立足點，
攻擊者使用惡意客戶端嘗試利用服務 API 的其中一個漏洞。惡意客戶端發送一個操作觸發服務的一些計劃外行爲。

<!--
More specifically, let’s assume the service is vulnerable to an SQL injection. The developer failed to sanitize the user input properly, thereby allowing clients to send values that would change the intended behavior. In our example, if a client sends a query string with key “username” and value of _“tom or 1=1”_, the client will receive the data of all users. Exploiting this vulnerability requires the client to send an irregular string as the value. Note that benign users will not be sending a string with spaces or with the equal sign character as a username, instead they will normally send legal usernames which for example may be defined as a short sequence of characters a-z. No legal username can trigger service unplanned behavior.
-->
更具體地說，我們假設該服務容易受到 SQL 注入攻擊。開發人員未能正確過濾使用者輸入，
從而允許客戶端發送會改變預期行爲的值。在我們的示例中，如果客戶端發送鍵爲“username”且值爲 **“tom or 1=1”** 的查詢字符串，
則客戶端將收到所有使用者的數據。要利用此漏洞需要客戶端發送不規範的字符串作爲值。
請注意，良性使用者不會發送帶有空格或等號字符的字符串作爲使用者名，相反，他們通常會發送合法的使用者名，
例如可以定義爲字符 a-z 的短序列。任何合法的使用者名都不會觸發服務計劃外行爲。

<!--
In this simple example, one can already identify several opportunities to detect and block an attempt to exploit the vulnerability (un)intentionally left behind by the developer, making the vulnerability unexploitable. First, the malicious client behavior differs from the behavior of benign clients, as it sends irregular requests. If such a change in behavior is detected and blocked, the exploit will never reach the service. Second, the service behavior in response to the exploit differs from the service behavior in response to a regular request. Such behavior may include making subsequent irregular calls to other services such as a data store, taking irregular time to respond, and/or responding to the malicious client with an irregular response (for example, containing much more data than normally sent in case of benign clients making regular requests). Service behavioral changes, if detected, will also allow blocking the exploit in different stages of the exploitation attempt.
-->
在這個簡單的示例中，人們已經可以識別檢測和阻止開發人員故意（無意）留下的漏洞被嘗試利用的很多機會，
從而使該漏洞無法被利用。首先，惡意客戶端的行爲與良性客戶端的行爲不同，因爲它發送不規範的請求。
如果檢測到並阻止這種行爲變化，則該漏洞將永遠不會到達服務。其次，響應於漏洞利用的服務行爲不同於響應於常規請求的服務行爲。
此類行爲可能包括對其他服務（例如數據存儲）進行後續不規範調用、消耗不確定的時間來響應和/或以非正常的響應來回應惡意客戶端
（例如，在良性客戶端定期發出請求的情況下，包含比正常發送更多的數據）。
如果檢測到服務行爲變化，也將允許在利用嘗試的不同階段阻止利用。

<!--
More generally:
-->
更一般而言：

<!--
- Monitoring the behavior of clients can help detect and block exploits against service API vulnerabilities. In fact, deploying efficient client behavior monitoring makes many vulnerabilities unexploitable and others very hard to achieve. To succeed, the offender needs to create an exploit undetectable from regular requests.
-->
- 監控客戶端的行爲可以幫助檢測和阻止針對服務 API 漏洞的利用。事實上，
  部署高效的客戶端行爲監控會使許多漏洞無法被利用，而剩餘漏洞則很難實現。
  爲了成功，攻擊者需要創建一個無法從常規請求中檢測到的利用方式。

<!--
- Monitoring the behavior of services can help detect services as they are being exploited regardless of the attack vector used. Efficient service behavior monitoring limits what an attacker may be able to achieve as the offender needs to ensure the service behavior is undetectable from regular service behavior.
-->
- 監視服務的行爲可以幫助檢測通過任何攻擊媒介正在被利用的服務。
  由於攻擊者需要確保服務行爲無法從常規服務行爲中被檢測到，所以有效的服務行爲監控限制了攻擊者可能實現的目的。

<!--
Combining both approaches may add a protection layer to the deployed vulnerable services, drastically decreasing the probability for anyone to successfully exploit any of the deployed vulnerable services. Next, let us identify four use cases where you need to use security-behavior monitoring.
-->
結合這兩種方法可以爲已部署的易被攻擊的服務添加一個保護層，從而大大降低任何人成功利用任何已部署的易被攻擊服務的可能性。
接下來，讓我們來確定需要使用安全行爲監控的四個使用場景。

<!--
## Use cases
-->
## 使用場景 {#use-cases}

<!--
One can identify the following four different stages in the life of any service from a security standpoint. In each stage, security-behavior monitoring is required to meet different challenges:
-->
從安全的角度來看，我們可以識別任何服務生命週期中的以下四個不同階段。
每個階段都需要安全行爲監控來應對不同的挑戰：

<!--
Service State | Use case | What do you need in order to cope with this use case?
------------- | ------------- | -----------------------------------------
**Normal**   | **No known vulnerabilities:** The service owner is normally not aware of any known vulnerabilities in the service image or configuration. Yet, it is reasonable to assume that the service has weaknesses. | **Provide generic protection against any unknown, zero-day, service vulnerabilities** - Detect/block irregular patterns sent as part of incoming client requests that may be used as exploits.
**Vulnerable** | **An applicable CVE is published:** The service owner is required to release a new non-vulnerable revision of the service. Research shows that in practice this process of removing a known vulnerability may take many weeks to accomplish (2 months on average).   |  **Add protection based on the CVE analysis** - Detect/block incoming requests that include specific patterns that may be used to exploit the discovered vulnerability. Continue to offer services, although the service has a known vulnerability.
**Exploitable**  | **A known exploit is published:** The service owner needs a way to filter incoming requests that contain the known exploit.   |  **Add protection based on a known exploit signature** - Detect/block incoming client requests that carry signatures identifying the exploit. Continue to offer services, although the presence of an exploit.  
**Misused**  | **An offender misuses pods backing the service:** The offender can follow an attack pattern enabling him/her to misuse pods. The service owner needs to restart any compromised pods while using non compromised pods to continue offering the service. Note that once a pod is restarted, the offender needs to repeat the attack pattern before he/she may again misuse it.  |  **Identify and restart instances of the component that is being misused** - At any given time, some backing pods may be compromised and misused, while others behave as designed. Detect/remove the misused pods while allowing other pods to continue servicing client requests.
-->
服務狀態 | 使用場景 | 爲了應對這個使用場景，你需要什麼？
------------- | ------------- | -----------------------------------------
**正常的**   | **無已知漏洞：** 服務所有者通常不知道服務映像檔或設定中存在任何已知漏洞。然而，可以合理地假設該服務存在弱點。 | **針對任何未知漏洞、零日漏洞、服務本身漏洞提供通用保護** - 檢測/阻止作爲發送給客戶端請求的可能被用作利用的部分不規則模式。
**存在漏洞的** | **相關的 CVE 已被公開：** 服務所有者需要發佈該服務的新的無漏洞修訂版。研究表明，實際上，消除已知漏洞的過程可能需要數週才能完成（平均 2 個月）。  |  **基於 CVE 分析添加保護** - 檢測/阻止包含可用於利用已發現漏洞特定模式的請求。儘管該服務存在已知漏洞，但仍然繼續提供服務。
**可被利用的**  | **可利用漏洞已被公開：** 服務所有者需要一種方法來過濾包含已知可利用漏洞的傳入請求。   |  **基於已知的可利用漏洞簽名添加保護** - 檢測/阻止攜帶識別可利用漏洞簽名的傳入客戶端請求。儘管存在可利用漏洞，但仍繼續提供服務。  
**已被不當使用的**  | **攻擊者不當使用服務背後的 Pod：** 攻擊者可以遵循某種攻擊模式，從而使他/她能夠對 Pod 進行不當使用。服務所有者需要重新啓動任何受損的 Pod，同時使用未受損的 Pod 繼續提供服務。請注意，一旦 Pod 重新啓動，攻擊者需要重複進行攻擊，然後才能再次對其進行不當使用。  |  **識別並重新啓動被不當使用的組件實例** - 在任何給定時間，某些後端的 Pod 可能會受到損害和不當使用，而其他後端 Pod 則按計劃運行。檢測/刪除被不當使用的 Pod，同時允許其他 Pod 繼續爲客戶端請求提供服務。

<!--
Fortunately, microservice architecture is well suited to security-behavior monitoring as discussed next.
-->
而幸運的是，微服務架構非常適合接下來討論的安全行爲監控。

<!--
## Security-Behavior of microservices versus monoliths {#microservices-vs-monoliths}
-->
## 微服務與單體的安全行爲對比 {#microservices-vs-monoliths}

<!--
Kubernetes is often used to support workloads designed with microservice architecture. By design, microservices aim to follow the UNIX philosophy of "Do One Thing And Do It Well". Each microservice has a bounded context and a clear interface. In other words, you can expect the microservice clients to send relatively regular requests and the microservice to present a relatively regular behavior as a response to these requests. Consequently, a microservice architecture is an excellent candidate for security-behavior monitoring.
-->
Kubernetes 通常提供用於支持微服務架構設計的工作負載。在設計上，微服務旨在遵循“做一件事並將其做好”的 UNIX 哲學。
每個微服務都有一個有邊界的上下文和一個清晰的接口。換句話說，你可以期望微服務客戶端發送相對規範的請求，
並且微服務呈現相對規範的行爲作爲對這些請求的響應。因此，微服務架構是安全行爲監控的絕佳候選者。

<!--
{{< figure src="security_behavior_figure_2.svg" alt="Image showing why microservices are well suited for security-behavior monitoring" class="diagram-large" caption="Figure 2. Microservices are well suited for security-behavior monitoring" >}}
-->
{{< figure src="security_behavior_figure_2.svg" alt="該圖顯示了爲什麼微服務非常適合安全行爲監控" class="diagram-large" caption="圖 2：微服務非常適合安全行爲監控" >}}

<!--
The diagram above clarifies how dividing a monolithic service to a set of microservices improves our ability to perform security-behavior monitoring and control. In a monolithic service approach, different client requests are intertwined, resulting in a diminished ability to identify irregular client behaviors. Without prior knowledge, an observer of the intertwined client requests will find it hard to distinguish between types of requests and their related characteristics. Further, internal client requests are not exposed to the observer. Lastly, the aggregated behavior of the monolithic service is a compound of the many different internal behaviors of its components, making it hard to identify irregular service behavior.
-->
上圖闡明瞭將單體服務劃分爲一組微服務是如何提高我們執行安全行爲監測和控制的能力。
在單體服務方法中，不同的客戶端請求交織在一起，導致識別不規則客戶端行爲的能力下降。
在沒有先驗知識的情況下，觀察者將發現很難區分交織在一起的客戶端請求的類型及其相關特徵。
此外，內部客戶端請求不會暴露給觀察者。最後，單體服務的聚合行爲是其組件的許多不同內部行爲的複合體，因此很難識別不規範的服務行爲。

<!--
In a microservice environment, each microservice is expected by design to offer a more well-defined service and serve better defined type of requests. This makes it easier for an observer to identify irregular client behavior and irregular service behavior. Further, a microservice design exposes the internal requests and internal services which offer more security-behavior data to identify irregularities by an observer. Overall, this makes the microservice design pattern better suited for security-behavior monitoring and control.
-->
在微服務環境中，每個微服務在設計上都期望提供定義更明確的服務，並服務於定義更明確的請求類型。
這使得觀察者更容易識別不規範的客戶端行爲和不規範的服務行爲。此外，微服務設計公開了內部請求和內部服務，
從而提供更多安全行爲數據來識別觀察者的違規行爲。總的來說，這使得微服務設計模式更適合安全行爲監控。

<!--
## Security-Behavior monitoring on Kubernetes
-->
## Kubernetes 上的安全行爲監控 {#security-behavior-monitoring-on-kubernetes}

<!--
Kubernetes deployments seeking to add Security-Behavior may use [Guard](http://knative.dev/security-guard), developed under the CNCF project Knative. Guard is integrated into the full Knative automation suite that runs on top of Kubernetes. Alternatively, **you can deploy Guard as a standalone tool** to protect any HTTP-based workload on Kubernetes.
-->
尋求添加安全行爲的 Kubernetes 部署可以使用在 CNCF Knative 項目下開發的 [Guard](http://knative.dev/security-guard)。
Guard 集成到在 Kubernetes 之上運行的完整 Knative 自動化套件中。或者，
**你可以將 Guard 作爲獨立工具部署**，以保護 Kubernetes 上任何基於 HTTP 的工作負載。

<!--
See:
-->
查看：

<!--
- [Guard](https://github.com/knative-sandbox/security-guard)  on Github, for using Guard as a standalone tool.
- The Knative automation suite - Read about Knative, in the blog post [Opinionated Kubernetes](https://davidhadas.wordpress.com/2022/08/29/knative-an-opinionated-kubernetes) which describes how Knative simplifies and unifies the way web services are deployed on Kubernetes.
- You may contact Guard maintainers on the [SIG Security](https://kubernetes.slack.com/archives/C019LFTGNQ3) Slack channel or on the Knative community [security](https://knative.slack.com/archives/CBYV1E0TG) Slack channel. The Knative community channel will move soon to the [CNCF Slack](https://communityinviter.com/apps/cloud-native/cncf) under the name `#knative-security`.
-->
- Github 上的 [Guard](https://github.com/knative-sandbox/security-guard)，用於將 Guard 用作獨立工具。
- Knative 自動化套件 - 在博客文章 [Opinionated Kubernetes](https://davidhadas.wordpress.com/2022/08/29/knative-an-opinionated-kubernetes) 中瞭解 Knative，
  其中描述了 Knative 如何簡化和統一 Web 服務在 Kubernetes 上的部署方式。
- 你可以在 [SIG Security](https://kubernetes.slack.com/archives/C019LFTGNQ3)
  或 Knative 社區 [Security](https://knative.slack.com/archives/CBYV1E0TG) Slack 頻道上聯繫 Guard 維護人員。
  Knative 社區頻道將很快轉移到 [CNCF Slack](https://communityinviter.com/apps/cloud-native/cncf)，其名稱爲`#knative-security`。

<!--
The goal of this post is to invite the Kubernetes community to action and introduce Security-Behavior monitoring and control to help secure Kubernetes based deployments. Hopefully, the community as a follow up will:
-->
本文的目標是邀請 Kubernetes 社區採取行動，並引入安全行爲監測和控制，
以幫助保護基於 Kubernetes 的部署。希望社區後續能夠：

<!--
1. Analyze the cyber challenges presented for different Kubernetes use cases
1. Add appropriate security documentation for users on how to introduce Security-Behavior monitoring and control.
1. Consider how to integrate with tools that can help users monitor and control their vulnerable services.
-->
1. 分析不同 Kubernetes 使用場景帶來的網路挑戰
1. 爲使用者添加適當的安全文檔，介紹如何引入安全行爲監控。
1. 考慮如何與幫助使用者監測和控制其易被攻擊服務的工具進行集成。

<!--
## Getting involved
-->
## 歡迎參與 {#getting-involved}

<!--
You are welcome to get involved and join the effort to develop security behavior monitoring and control for Kubernetes; to share feedback and contribute to code or documentation; and to make or suggest improvements of any kind.
-->
歡迎你參與到對 Kubernetes 的開發安全行爲監控的工作中；以代碼或文檔的形式分享反饋或做出貢獻；並以任何形式完成或提議相關改進。
