---
layout: blog
title: "确保准入控制器的安全"
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
[准入控制](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)和认证、授权都是 Kubernetes 安全性的关键部分。
Webhook 准入控制器被广泛用于以多种方式帮助提高 Kubernetes 集群的安全性，
包括限制工作负载权限和确保部署到集群的镜像满足组织安全要求。

<!--
However, as with any additional component added to a cluster, security risks can present themselves.
A security risk example is if the deployment and management of the admission controller are not handled correctly. To help admission controller users and designers manage these risks appropriately, 
the [security documentation](https://github.com/kubernetes/community/tree/master/sig-security#security-docs) subgroup of SIG Security has spent some time developing a [threat model for admission controllers](https://github.com/kubernetes/sig-security/tree/main/sig-security-docs/papers/admission-control). 
This threat model looks at likely risks which may arise from the incorrect use of admission controllers, which could allow security policies to be bypassed, or even allow an attacker to get unauthorised access to the cluster.
-->
然而，与添加到集群中的任何其他组件一样，安全风险也会随之出现。
一个安全风险示例是没有正确处理准入控制器的部署和管理。
为了帮助准入控制器用户和设计人员适当地管理这些风险，
SIG Security 的[安全文档](https://github.com/kubernetes/community/tree/master/sig-security#security-docs)小组
花费了一些时间来开发一个[准入控制器威胁模型](https://github.com/kubernetes/sig-security/tree/main/sig-security-docs/papers/admission-control)。
这种威胁模型着眼于由于不正确使用准入控制器而产生的可能的风险，可能允许绕过安全策略，甚至允许攻击者未经授权访问集群。

<!--
From the threat model, we developed a set of security best practices that should be adopted to ensure that cluster operators can get the security benefits of admission controllers whilst avoiding any risks from using them.
-->
基于这个威胁模型，我们开发了一套安全最佳实践。
你应该采用这些实践来确保集群操作员可以获得准入控制器带来的安全优势，同时避免使用它们带来的任何风险。

<!--
## Admission controllers and good practices for security
-->
## 准入控制器和安全的良好做法

<!--
From the threat model, a couple of themes emerged around how to ensure the security of admission controllers.
-->
基于这个威胁模型，围绕着如何确保准入控制器的安全性出现了几个主题。

<!--
### Secure webhook configuration
-->
### 安全的 webhook 配置

<!--
It’s important to ensure that any security component in a cluster is well configured and admission controllers are no different here. There are a couple of security best practices to consider when using admission controllers
-->
确保集群中的任何安全组件都配置良好是很重要的，在这里准入控制器也并不例外。
使用准入控制器时需要考虑几个安全最佳实践：

<!--
* **Correctly configured TLS for all webhook traffic**. Communications between the API server and the admission controller webhook should be authenticated and encrypted to ensure that attackers who may be in a network position to view or modify this traffic cannot do so. To achieve this access the API server and webhook must be using certificates from a trusted certificate authority so that they can validate their mutual identities
-->
* **为所有 webhook 流量正确配置了 TLS**。
  API 服务器和准入控制器 webhook 之间的通信应该经过身份验证和加密，以确保处于网络中查看或修改此流量的攻击者无法查看或修改。
  要实现此访问，API 服务器和 webhook 必须使用来自受信任的证书颁发机构的证书，以便它们可以验证相互的身份。
<!--
* **Only authenticated access allowed**. If an attacker can send an admission controller large numbers of requests, they may be able to overwhelm the service causing it to fail. Ensuring all access requires strong authentication should mitigate that risk.
-->
* **只允许经过身份验证的访问**。
  如果攻击者可以向准入控制器发送大量请求，他们可能会压垮服务导致其失败。
  确保所有访问都需要强身份验证可以降低这种风险。
<!--
* **Admission controller fails closed**. This is a security practice that has a tradeoff, so whether a cluster operator wants to configure it will depend on the cluster’s threat model. If an admission controller fails closed, when the API server can’t get a response from it, all deployments will fail. This stops attackers bypassing the admission controller by disabling it, but, can disrupt the cluster’s operation. As clusters can have multiple webhooks, one approach to hit a middle ground might be to have critical controls on a fail closed setups and less critical controls allowed to fail open.
-->
* **准入控制器关闭失败**。
  这是一种需要权衡的安全实践，集群操作员是否要对其进行配置取决于集群的威胁模型。
  如果一个准入控制器关闭失败，当 API 服务器无法从它得到响应时，所有的部署都会失败。
  这可以阻止攻击者通过禁用准入控制器绕过准入控制器，但可能会破坏集群的运行。
  由于集群可以有多个 webhook，因此一种折中的方法是对关键控制允许故障关闭，
  并允许不太关键的控制进行故障打开。
<!--
* **Regular reviews of webhook configuration**. Configuration mistakes can lead to security issues, so it’s important that the admission controller webhook configuration is checked to make sure the settings are correct. This kind of review could be done automatically by an Infrastructure As Code scanner or manually by an administrator.
-->
* **定期审查 webhook 配置**。
  配置错误可能导致安全问题，因此检查准入控制器 webhook 配置以确保设置正确非常重要。
  这种审查可以由基础设施即代码扫描程序自动完成，也可以由管理员手动完成。

<!--
### Secure cluster configuration for admission control
-->
### 为准入控制保护集群配置

<!--
In most cases, the admission controller webhook used by a cluster will be installed as a workload in the cluster. As a result, it’s important to ensure that Kubernetes' security features that could impact its operation are well configured.
-->
在大多数情况下，集群使用的准入控制器 webhook 将作为工作负载安装在集群中。
因此，确保正确配置了可能影响其操作的 Kubernetes 安全特性非常重要。

<!--
* **Restrict [RBAC](/docs/reference/access-authn-authz/rbac/) rights**. Any user who has rights which would allow them to modify the configuration of the webhook objects or the workload that the admission controller uses could disrupt its operation. So it’s important to make sure that only cluster administrators have those rights.
-->
* **限制 [RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/) 权限**。
  任何有权修改 webhook 对象的配置或准入控制器使用的工作负载的用户都可以破坏其运行。
  因此，确保只有集群管理员拥有这些权限非常重要。
<!--
* **Prevent privileged workloads**. One of the realities of container systems is that if a workload is given certain privileges, it will be possible to break out to the underlying cluster node and impact other containers on that node. Where admission controller services run in the cluster they’re protecting, it’s important to ensure that any requirement for privileged workloads is carefully reviewed and restricted as much as possible.
-->  
* **防止特权工作负载**。
  容器系统的一个现实是，如果工作负载被赋予某些特权，
  则有可能逃逸到下层的集群节点并影响该节点上的其他容器。
  如果准入控制器服务在它们所保护的集群上运行，
  一定要确保对特权工作负载的所有请求都要经过仔细审查并尽可能地加以限制。
<!--
* **Strictly control external system access**. As a security service in a cluster admission controller systems will have access to sensitive information like credentials. To reduce the risk of this information being sent outside the cluster, [network policies](/docs/concepts/services-networking/network-policies/) should be used to restrict the admission controller services access to external networks.
-->  
* **严格控制外部系统访问**。
  作为集群中的安全服务，准入控制器系统将有权访问敏感信息，如凭证。
  为了降低此信息被发送到集群外的风险，
  应使用[网络策略](/zh-cn/docs/concepts/services-networking/network-policies/) 
  来限制准入控制器服务对外部网络的访问。
<!--
* **Each cluster has a dedicated webhook**. Whilst it may be possible to have admission controller webhooks that serve multiple clusters, there is a risk when using that model that an attack on the webhook service would have a larger impact where it’s shared. Also where multiple clusters use an admission controller there will be increased complexity and access requirements, making it harder to secure.
-->  
* **每个集群都有一个专用的 webhook**。
  虽然可能让准入控制器 webhook 服务于多个集群的，
  但在使用该模型时存在对 webhook 服务的攻击会对共享它的地方产生更大影响的风险。
  此外，在多个集群使用准入控制器的情况下，复杂性和访问要求也会增加，从而更难保护其安全。

<!--
### Admission controller rules
-->
### 准入控制器规则

<!--
A key element of any admission controller used for Kubernetes security is the rulebase it uses. The rules need to be able to accurately meet their goals avoiding false positive and false negative results. 
-->
对于用于 Kubernetes 安全的所有准入控制器而言，一个关键元素是它使用的规则库。
规则需要能够准确地满足其目标，避免假阳性和假阴性结果。

<!--
* **Regularly test and review rules**. Admission controller rules need to be tested to ensure their accuracy. They also need to be regularly reviewed as the Kubernetes API will change with each new version, and rules need to be assessed with each Kubernetes release to understand any changes that may be required to keep them up to date.
-->
* **定期测试和审查规则**。
  需要测试准入控制器规则以确保其准确性。
  还需要定期审查，因为 Kubernetes API 会随着每个新版本而改变，
  并且需要在每个 Kubernetes 版本中评估规则，以了解使他们保持最新版本所需要做的任何改变。