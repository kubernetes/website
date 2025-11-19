---
layout: blog
title: "確保准入控制器的安全"
date: 2022-01-19
slug: secure-your-admission-controllers-and-webhooks
---

<!--
layout: blog
title: "Securing Admission Controllers"
date: 2022-01-19
slug: secure-your-admission-controllers-and-webhooks
-->

<!--
**Author:** Rory McCune (Aqua Security)
-->

**作者:** Rory McCune (Aqua Security)


<!--
[Admission control](/docs/reference/access-authn-authz/admission-controllers/) is a key part of Kubernetes security, alongside authentication and authorization. 
Webhook admission controllers are extensively used to help improve the security of Kubernetes clusters in a variety of ways including restricting the privileges of workloads and ensuring that images deployed to the cluster meet organization’s security requirements.
-->
[准入控制](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)和認證、授權都是 Kubernetes 安全性的關鍵部分。
Webhook 准入控制器被廣泛用於以多種方式幫助提高 Kubernetes 集羣的安全性，
包括限制工作負載權限和確保部署到集羣的鏡像滿足組織安全要求。

<!--
However, as with any additional component added to a cluster, security risks can present themselves.
A security risk example is if the deployment and management of the admission controller are not handled correctly. To help admission controller users and designers manage these risks appropriately, 
the [security documentation](https://github.com/kubernetes/community/tree/master/sig-security#security-docs) subgroup of SIG Security has spent some time developing a [threat model for admission controllers](https://github.com/kubernetes/sig-security/tree/main/sig-security-docs/papers/admission-control). 
This threat model looks at likely risks which may arise from the incorrect use of admission controllers, which could allow security policies to be bypassed, or even allow an attacker to get unauthorised access to the cluster.
-->
然而，與添加到集羣中的任何其他組件一樣，安全風險也會隨之出現。
一個安全風險示例是沒有正確處理准入控制器的部署和管理。
爲了幫助准入控制器用戶和設計人員適當地管理這些風險，
SIG Security 的[安全文檔](https://github.com/kubernetes/community/tree/master/sig-security#security-docs)小組
花費了一些時間來開發一個[准入控制器威脅模型](https://github.com/kubernetes/sig-security/tree/main/sig-security-docs/papers/admission-control)。
這種威脅模型着眼於由於不正確使用准入控制器而產生的可能的風險，可能允許繞過安全策略，甚至允許攻擊者未經授權訪問集羣。

<!--
From the threat model, we developed a set of security best practices that should be adopted to ensure that cluster operators can get the security benefits of admission controllers whilst avoiding any risks from using them.
-->
基於這個威脅模型，我們開發了一套安全最佳實踐。
你應該採用這些實踐來確保集羣操作員可以獲得准入控制器帶來的安全優勢，同時避免使用它們帶來的任何風險。

<!--
## Admission controllers and good practices for security
-->
## 准入控制器和安全的良好做法

<!--
From the threat model, a couple of themes emerged around how to ensure the security of admission controllers.
-->
基於這個威脅模型，圍繞着如何確保准入控制器的安全性出現了幾個主題。

<!--
### Secure webhook configuration
-->
### 安全的 webhook 配置

<!--
It’s important to ensure that any security component in a cluster is well configured and admission controllers are no different here. There are a couple of security best practices to consider when using admission controllers
-->
確保集羣中的任何安全組件都配置良好是很重要的，在這裏准入控制器也並不例外。
使用准入控制器時需要考慮幾個安全最佳實踐：

<!--
* **Correctly configured TLS for all webhook traffic**. Communications between the API server and the admission controller webhook should be authenticated and encrypted to ensure that attackers who may be in a network position to view or modify this traffic cannot do so. To achieve this access the API server and webhook must be using certificates from a trusted certificate authority so that they can validate their mutual identities
-->
* **爲所有 webhook 流量正確配置了 TLS**。
  API 服務器和准入控制器 webhook 之間的通信應該經過身份驗證和加密，以確保處於網絡中查看或修改此流量的攻擊者無法查看或修改。
  要實現此訪問，API 服務器和 webhook 必須使用來自受信任的證書頒發機構的證書，以便它們可以驗證相互的身份。
<!--
* **Only authenticated access allowed**. If an attacker can send an admission controller large numbers of requests, they may be able to overwhelm the service causing it to fail. Ensuring all access requires strong authentication should mitigate that risk.
-->
* **只允許經過身份驗證的訪問**。
  如果攻擊者可以向准入控制器發送大量請求，他們可能會壓垮服務導致其失敗。
  確保所有訪問都需要強身份驗證可以降低這種風險。
<!--
* **Admission controller fails closed**. This is a security practice that has a tradeoff, so whether a cluster operator wants to configure it will depend on the cluster’s threat model. If an admission controller fails closed, when the API server can’t get a response from it, all deployments will fail. This stops attackers bypassing the admission controller by disabling it, but, can disrupt the cluster’s operation. As clusters can have multiple webhooks, one approach to hit a middle ground might be to have critical controls on a fail closed setups and less critical controls allowed to fail open.
-->
* **准入控制器關閉失敗**。
  這是一種需要權衡的安全實踐，集羣操作員是否要對其進行配置取決於集羣的威脅模型。
  如果一個准入控制器關閉失敗，當 API 服務器無法從它得到響應時，所有的部署都會失敗。
  這可以阻止攻擊者通過禁用准入控制器繞過准入控制器，但可能會破壞集羣的運行。
  由於集羣可以有多個 webhook，因此一種折中的方法是對關鍵控制允許故障關閉，
  並允許不太關鍵的控制進行故障打開。
<!--
* **Regular reviews of webhook configuration**. Configuration mistakes can lead to security issues, so it’s important that the admission controller webhook configuration is checked to make sure the settings are correct. This kind of review could be done automatically by an Infrastructure As Code scanner or manually by an administrator.
-->
* **定期審查 webhook 配置**。
  配置錯誤可能導致安全問題，因此檢查准入控制器 webhook 配置以確保設置正確非常重要。
  這種審查可以由基礎設施即代碼掃描程序自動完成，也可以由管理員手動完成。

<!--
### Secure cluster configuration for admission control
-->
### 爲準入控制保護集羣配置

<!--
In most cases, the admission controller webhook used by a cluster will be installed as a workload in the cluster. As a result, it’s important to ensure that Kubernetes' security features that could impact its operation are well configured.
-->
在大多數情況下，集羣使用的准入控制器 webhook 將作爲工作負載安裝在集羣中。
因此，確保正確配置了可能影響其操作的 Kubernetes 安全特性非常重要。

<!--
* **Restrict [RBAC](/docs/reference/access-authn-authz/rbac/) rights**. Any user who has rights which would allow them to modify the configuration of the webhook objects or the workload that the admission controller uses could disrupt its operation. So it’s important to make sure that only cluster administrators have those rights.
-->
* **限制 [RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/) 權限**。
  任何有權修改 webhook 對象的配置或准入控制器使用的工作負載的用戶都可以破壞其運行。
  因此，確保只有集羣管理員擁有這些權限非常重要。
<!--
* **Prevent privileged workloads**. One of the realities of container systems is that if a workload is given certain privileges, it will be possible to break out to the underlying cluster node and impact other containers on that node. Where admission controller services run in the cluster they’re protecting, it’s important to ensure that any requirement for privileged workloads is carefully reviewed and restricted as much as possible.
-->  
* **防止特權工作負載**。
  容器系統的一個現實是，如果工作負載被賦予某些特權，
  則有可能逃逸到下層的集羣節點並影響該節點上的其他容器。
  如果准入控制器服務在它們所保護的集羣上運行，
  一定要確保對特權工作負載的所有請求都要經過仔細審查並儘可能地加以限制。
<!--
* **Strictly control external system access**. As a security service in a cluster admission controller systems will have access to sensitive information like credentials. To reduce the risk of this information being sent outside the cluster, [network policies](/docs/concepts/services-networking/network-policies/) should be used to restrict the admission controller services access to external networks.
-->  
* **嚴格控制外部系統訪問**。
  作爲集羣中的安全服務，准入控制器系統將有權訪問敏感信息，如憑證。
  爲了降低此信息被髮送到集羣外的風險，
  應使用[網絡策略](/zh-cn/docs/concepts/services-networking/network-policies/) 
  來限制准入控制器服務對外部網絡的訪問。
<!--
* **Each cluster has a dedicated webhook**. Whilst it may be possible to have admission controller webhooks that serve multiple clusters, there is a risk when using that model that an attack on the webhook service would have a larger impact where it’s shared. Also where multiple clusters use an admission controller there will be increased complexity and access requirements, making it harder to secure.
-->  
* **每個集羣都有一個專用的 webhook**。
  雖然可能讓准入控制器 webhook 服務於多個集羣的，
  但在使用該模型時存在對 webhook 服務的攻擊會對共享它的地方產生更大影響的風險。
  此外，在多個集羣使用准入控制器的情況下，複雜性和訪問要求也會增加，從而更難保護其安全。

<!--
### Admission controller rules
-->
### 准入控制器規則

<!--
A key element of any admission controller used for Kubernetes security is the rulebase it uses. The rules need to be able to accurately meet their goals avoiding false positive and false negative results. 
-->
對於用於 Kubernetes 安全的所有準入控制器而言，一個關鍵元素是它使用的規則庫。
規則需要能夠準確地滿足其目標，避免假陽性和假陰性結果。

<!--
* **Regularly test and review rules**. Admission controller rules need to be tested to ensure their accuracy. They also need to be regularly reviewed as the Kubernetes API will change with each new version, and rules need to be assessed with each Kubernetes release to understand any changes that may be required to keep them up to date.
-->
* **定期測試和審查規則**。
  需要測試准入控制器規則以確保其準確性。
  還需要定期審查，因爲 Kubernetes API 會隨着每個新版本而改變，
  並且需要在每個 Kubernetes 版本中評估規則，以瞭解使他們保持最新版本所需要做的任何改變。