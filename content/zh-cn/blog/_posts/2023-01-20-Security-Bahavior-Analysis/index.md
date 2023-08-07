---
layout: blog
title: 考虑所有微服务的脆弱性并对其行为进行监控
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

**译者**：Wilson Wu (DaoCloud)

<!--
_This post warns Devops from a false sense of security. Following security best practices when developing and configuring microservices do not result in non-vulnerable microservices. The post shows that although all deployed microservices are vulnerable, there is much that can be done to ensure microservices are not exploited. It explains how analyzing the behavior of clients and services from a security standpoint, named here **"Security-Behavior Analytics"**, can protect the deployed vulnerable microservices. It points to [Guard](http://knative.dev/security-guard), an open source project offering security-behavior monitoring and control of Kubernetes microservices presumed vulnerable._
-->
_本文对 DevOps 产生的错误安全意识做出提醒。开发和配置微服务时遵循安全最佳实践并不能让微服务不易被攻击。
本文说明，即使所有已部署的微服务都容易被攻击，但仍然可以采取很多措施来确保微服务不被利用。
本文解释了如何从安全角度对客户端和服务的行为进行分析，此处称为 **“安全行为分析”** ，
可以对已部署的易被攻击的微服务进行保护。本文会引用 [Guard](http://knative.dev/security-guard)，
一个开源项目，对假定易被攻击的 Kubernetes 微服务的安全行为提供监测与控制。_

<!--
As cyber attacks continue to intensify in sophistication, organizations deploying cloud services continue to grow their cyber investments aiming to produce safe and non-vulnerable services. However, the year-by-year growth in cyber investments does not result in a parallel reduction in cyber incidents. Instead, the number of cyber incidents continues to grow annually. Evidently, organizations are doomed to fail in this struggle - no matter how much effort is made to detect and remove cyber weaknesses from deployed services, it seems offenders always have the upper hand.
-->
随着网络攻击的复杂性不断加剧，部署云服务的组织持续追加网络安全投资，旨在提供安全且不易被攻击的服务。
然而，网络安全投资的逐年增长并没有造成网络安全事件的同步减少。相反，网络安全事件的数量每年都在持续增长。
显然，这些组织在这场斗争中注定会失败——无论付出多大努力来检测和消除已部署服务中的网络安全弱点，攻击者似乎总是占据上风。

<!--
Considering the current spread of offensive tools, sophistication of offensive players, and ever-growing cyber financial gains to offenders, any cyber strategy that relies on constructing a non-vulnerable, weakness-free service in 2023 is clearly too naïve. It seems the only viable strategy is to:
-->
考虑到当前广泛传播的攻击工具、复杂的攻击者以及攻击者们不断增长的网络安全经济收益，
在 2023 年，任何依赖于构建无漏洞、无弱点服务的网络安全战略显然都过于天真。看来唯一可行的策略是：

<!--
&#x27A5; **Admit that your services are vulnerable!**
-->
&#x27A5; **承认你的服务容易被攻击！**

<!--
In other words, consciously accept that you will never create completely invulnerable services. If your opponents find even a single weakness as an entry-point, you lose! Admitting that in spite of your best efforts, all your services are still vulnerable is an important first step. Next, this post discusses what you can do about it...
-->
换句话说，清醒地接受你永远无法创建完全无懈可击服务的事实。
如果你的对手找到哪怕一个弱点作为切入点，你就输了！承认尽管你尽了最大努力，
你的所有服务仍然容易被攻击，这是重要的第一步。接下来，本文将讨论你可以对此做些什么......

<!--
## How to protect microservices from being exploited
-->
## 如何保护微服务不被利用 {#how-to-protect-microservices-from-being-exploited}

<!--
Being vulnerable does not necessarily mean that your service will be exploited. Though your services are vulnerable in some ways unknown to you, offenders still need to identify these vulnerabilities and then exploit them. If offenders fail to exploit your service vulnerabilities, you win! In other words, having a vulnerability that can’t be exploited, represents a risk that can’t be realized.
-->
容易被攻击并不一定意味着你的服务将被利用。尽管你的服务在某些方面存在你不知道的漏洞，
但攻击者仍然需要识别这些漏洞并利用它们。如果攻击者无法利用你服务的漏洞，你就赢了！
换句话说，拥有无法利用的漏洞就意味着拥有无法坐实的风险。

<!--
{{< figure src="security_behavior_figure_1.svg" alt="Image of an example of offender gaining foothold in a service" class="diagram-large" caption="Figure 1. An Offender gaining foothold in a vulnerable service" >}}
-->
{{< figure src="security_behavior_figure_1.svg" alt="攻击者在服务中取得立足点的示意图" class="diagram-large" caption="图 1：攻击者在易被攻击的服务中取得立足点" >}}

<!--
The above diagram shows an example in which the offender does not yet have a foothold in the service; that is, it is assumed that your service does not run code controlled by the offender on day 1. In our example the service has vulnerabilities in the API exposed to clients. To gain an initial foothold the offender uses a malicious client to try and exploit one of the service API vulnerabilities. The malicious client sends an exploit that triggers some unplanned behavior of the service.
-->
如上图所示，攻击者尚未在服务中取得立足点；也就是说，假设你的服务在第一天没有运行由攻击者控制的代码。
在我们的示例中，该服务暴露给客户端的 API 中存在漏洞。为了获得初始立足点，
攻击者使用恶意客户端尝试利用服务 API 的其中一个漏洞。恶意客户端发送一个操作触发服务的一些计划外行为。

<!--
More specifically, let’s assume the service is vulnerable to an SQL injection. The developer failed to sanitize the user input properly, thereby allowing clients to send values that would change the intended behavior. In our example, if a client sends a query string with key “username” and value of _“tom or 1=1”_, the client will receive the data of all users. Exploiting this vulnerability requires the client to send an irregular string as the value. Note that benign users will not be sending a string with spaces or with the equal sign character as a username, instead they will normally send legal usernames which for example may be defined as a short sequence of characters a-z. No legal username can trigger service unplanned behavior.
-->
更具体地说，我们假设该服务容易受到 SQL 注入攻击。开发人员未能正确过滤用户输入，
从而允许客户端发送会改变预期行为的值。在我们的示例中，如果客户端发送键为“username”且值为 **“tom or 1=1”** 的查询字符串，
则客户端将收到所有用户的数据。要利用此漏洞需要客户端发送不规范的字符串作为值。
请注意，良性用户不会发送带有空格或等号字符的字符串作为用户名，相反，他们通常会发送合法的用户名，
例如可以定义为字符 a-z 的短序列。任何合法的用户名都不会触发服务计划外行为。

<!--
In this simple example, one can already identify several opportunities to detect and block an attempt to exploit the vulnerability (un)intentionally left behind by the developer, making the vulnerability unexploitable. First, the malicious client behavior differs from the behavior of benign clients, as it sends irregular requests. If such a change in behavior is detected and blocked, the exploit will never reach the service. Second, the service behavior in response to the exploit differs from the service behavior in response to a regular request. Such behavior may include making subsequent irregular calls to other services such as a data store, taking irregular time to respond, and/or responding to the malicious client with an irregular response (for example, containing much more data than normally sent in case of benign clients making regular requests). Service behavioral changes, if detected, will also allow blocking the exploit in different stages of the exploitation attempt.
-->
在这个简单的示例中，人们已经可以识别检测和阻止开发人员故意（无意）留下的漏洞被尝试利用的很多机会，
从而使该漏洞无法被利用。首先，恶意客户端的行为与良性客户端的行为不同，因为它发送不规范的请求。
如果检测到并阻止这种行为变化，则该漏洞将永远不会到达服务。其次，响应于漏洞利用的服务行为不同于响应于常规请求的服务行为。
此类行为可能包括对其他服务（例如数据存储）进行后续不规范调用、消耗不确定的时间来响应和/或以非正常的响应来回应恶意客户端
（例如，在良性客户端定期发出请求的情况下，包含比正常发送更多的数据）。
如果检测到服务行为变化，也将允许在利用尝试的不同阶段阻止利用。

<!--
More generally:
-->
更一般而言：

<!--
- Monitoring the behavior of clients can help detect and block exploits against service API vulnerabilities. In fact, deploying efficient client behavior monitoring makes many vulnerabilities unexploitable and others very hard to achieve. To succeed, the offender needs to create an exploit undetectable from regular requests.
-->
- 监控客户端的行为可以帮助检测和阻止针对服务 API 漏洞的利用。事实上，
  部署高效的客户端行为监控会使许多漏洞无法被利用，而剩余漏洞则很难实现。
  为了成功，攻击者需要创建一个无法从常规请求中检测到的利用方式。

<!--
- Monitoring the behavior of services can help detect services as they are being exploited regardless of the attack vector used. Efficient service behavior monitoring limits what an attacker may be able to achieve as the offender needs to ensure the service behavior is undetectable from regular service behavior.
-->
- 监视服务的行为可以帮助检测通过任何攻击媒介正在被利用的服务。
  由于攻击者需要确保服务行为无法从常规服务行为中被检测到，所以有效的服务行为监控限制了攻击者可能实现的目的。

<!--
Combining both approaches may add a protection layer to the deployed vulnerable services, drastically decreasing the probability for anyone to successfully exploit any of the deployed vulnerable services. Next, let us identify four use cases where you need to use security-behavior monitoring.
-->
结合这两种方法可以为已部署的易被攻击的服务添加一个保护层，从而大大降低任何人成功利用任何已部署的易被攻击服务的可能性。
接下来，让我们来确定需要使用安全行为监控的四个使用场景。

<!--
## Use cases
-->
## 使用场景 {#use-cases}

<!--
One can identify the following four different stages in the life of any service from a security standpoint. In each stage, security-behavior monitoring is required to meet different challenges:
-->
从安全的角度来看，我们可以识别任何服务生命周期中的以下四个不同阶段。
每个阶段都需要安全行为监控来应对不同的挑战：

<!--
Service State | Use case | What do you need in order to cope with this use case?
------------- | ------------- | -----------------------------------------
**Normal**   | **No known vulnerabilities:** The service owner is normally not aware of any known vulnerabilities in the service image or configuration. Yet, it is reasonable to assume that the service has weaknesses. | **Provide generic protection against any unknown, zero-day, service vulnerabilities** - Detect/block irregular patterns sent as part of incoming client requests that may be used as exploits.
**Vulnerable** | **An applicable CVE is published:** The service owner is required to release a new non-vulnerable revision of the service. Research shows that in practice this process of removing a known vulnerability may take many weeks to accomplish (2 months on average).   |  **Add protection based on the CVE analysis** - Detect/block incoming requests that include specific patterns that may be used to exploit the discovered vulnerability. Continue to offer services, although the service has a known vulnerability.
**Exploitable**  | **A known exploit is published:** The service owner needs a way to filter incoming requests that contain the known exploit.   |  **Add protection based on a known exploit signature** - Detect/block incoming client requests that carry signatures identifying the exploit. Continue to offer services, although the presence of an exploit.  
**Misused**  | **An offender misuses pods backing the service:** The offender can follow an attack pattern enabling him/her to misuse pods. The service owner needs to restart any compromised pods while using non compromised pods to continue offering the service. Note that once a pod is restarted, the offender needs to repeat the attack pattern before he/she may again misuse it.  |  **Identify and restart instances of the component that is being misused** - At any given time, some backing pods may be compromised and misused, while others behave as designed. Detect/remove the misused pods while allowing other pods to continue servicing client requests.
-->
服务状态 | 使用场景 | 为了应对这个使用场景，你需要什么？
------------- | ------------- | -----------------------------------------
**正常的**   | **无已知漏洞：** 服务所有者通常不知道服务镜像或配置中存在任何已知漏洞。然而，可以合理地假设该服务存在弱点。 | **针对任何未知漏洞、零日漏洞、服务本身漏洞提供通用保护** - 检测/阻止作为发送给客户端请求的可能被用作利用的部分不规则模式。
**存在漏洞的** | **相关的 CVE 已被公开：** 服务所有者需要发布该服务的新的无漏洞修订版。研究表明，实际上，消除已知漏洞的过程可能需要数周才能完成（平均 2 个月）。  |  **基于 CVE 分析添加保护** - 检测/阻止包含可用于利用已发现漏洞特定模式的请求。尽管该服务存在已知漏洞，但仍然继续提供服务。
**可被利用的**  | **可利用漏洞已被公开：** 服务所有者需要一种方法来过滤包含已知可利用漏洞的传入请求。   |  **基于已知的可利用漏洞签名添加保护** - 检测/阻止携带识别可利用漏洞签名的传入客户端请求。尽管存在可利用漏洞，但仍继续提供服务。  
**已被不当使用的**  | **攻击者不当使用服务背后的 Pod：** 攻击者可以遵循某种攻击模式，从而使他/她能够对 Pod 进行不当使用。服务所有者需要重新启动任何受损的 Pod，同时使用未受损的 Pod 继续提供服务。请注意，一旦 Pod 重新启动，攻击者需要重复进行攻击，然后才能再次对其进行不当使用。  |  **识别并重新启动被不当使用的组件实例** - 在任何给定时间，某些后端的 Pod 可能会受到损害和不当使用，而其他后端 Pod 则按计划运行。检测/删除被不当使用的 Pod，同时允许其他 Pod 继续为客户端请求提供服务。

<!--
Fortunately, microservice architecture is well suited to security-behavior monitoring as discussed next.
-->
而幸运的是，微服务架构非常适合接下来讨论的安全行为监控。

<!--
## Security-Behavior of microservices versus monoliths {#microservices-vs-monoliths}
-->
## 微服务与单体的安全行为对比 {#microservices-vs-monoliths}

<!--
Kubernetes is often used to support workloads designed with microservice architecture. By design, microservices aim to follow the UNIX philosophy of "Do One Thing And Do It Well". Each microservice has a bounded context and a clear interface. In other words, you can expect the microservice clients to send relatively regular requests and the microservice to present a relatively regular behavior as a response to these requests. Consequently, a microservice architecture is an excellent candidate for security-behavior monitoring.
-->
Kubernetes 通常提供用于支持微服务架构设计的工作负载。在设计上，微服务旨在遵循“做一件事并将其做好”的 UNIX 哲学。
每个微服务都有一个有边界的上下文和一个清晰的接口。换句话说，你可以期望微服务客户端发送相对规范的请求，
并且微服务呈现相对规范的行为作为对这些请求的响应。因此，微服务架构是安全行为监控的绝佳候选者。

<!--
{{< figure src="security_behavior_figure_2.svg" alt="Image showing why microservices are well suited for security-behavior monitoring" class="diagram-large" caption="Figure 2. Microservices are well suited for security-behavior monitoring" >}}
-->
{{< figure src="security_behavior_figure_2.svg" alt="该图显示了为什么微服务非常适合安全行为监控" class="diagram-large" caption="图 2：微服务非常适合安全行为监控" >}}

<!--
The diagram above clarifies how dividing a monolithic service to a set of microservices improves our ability to perform security-behavior monitoring and control. In a monolithic service approach, different client requests are intertwined, resulting in a diminished ability to identify irregular client behaviors. Without prior knowledge, an observer of the intertwined client requests will find it hard to distinguish between types of requests and their related characteristics. Further, internal client requests are not exposed to the observer. Lastly, the aggregated behavior of the monolithic service is a compound of the many different internal behaviors of its components, making it hard to identify irregular service behavior.
-->
上图阐明了将单体服务划分为一组微服务是如何提高我们执行安全行为监测和控制的能力。
在单体服务方法中，不同的客户端请求交织在一起，导致识别不规则客户端行为的能力下降。
在没有先验知识的情况下，观察者将发现很难区分交织在一起的客户端请求的类型及其相关特征。
此外，内部客户端请求不会暴露给观察者。最后，单体服务的聚合行为是其组件的许多不同内部行为的复合体，因此很难识别不规范的服务行为。

<!--
In a microservice environment, each microservice is expected by design to offer a more well-defined service and serve better defined type of requests. This makes it easier for an observer to identify irregular client behavior and irregular service behavior. Further, a microservice design exposes the internal requests and internal services which offer more security-behavior data to identify irregularities by an observer. Overall, this makes the microservice design pattern better suited for security-behavior monitoring and control.
-->
在微服务环境中，每个微服务在设计上都期望提供定义更明确的服务，并服务于定义更明确的请求类型。
这使得观察者更容易识别不规范的客户端行为和不规范的服务行为。此外，微服务设计公开了内部请求和内部服务，
从而提供更多安全行为数据来识别观察者的违规行为。总的来说，这使得微服务设计模式更适合安全行为监控。

<!--
## Security-Behavior monitoring on Kubernetes
-->
## Kubernetes 上的安全行为监控 {#security-behavior-monitoring-on-kubernetes}

<!--
Kubernetes deployments seeking to add Security-Behavior may use [Guard](http://knative.dev/security-guard), developed under the CNCF project Knative. Guard is integrated into the full Knative automation suite that runs on top of Kubernetes. Alternatively, **you can deploy Guard as a standalone tool** to protect any HTTP-based workload on Kubernetes.
-->
寻求添加安全行为的 Kubernetes 部署可以使用在 CNCF Knative 项目下开发的 [Guard](http://knative.dev/security-guard)。
Guard 集成到在 Kubernetes 之上运行的完整 Knative 自动化套件中。或者，
**你可以将 Guard 作为独立工具部署**，以保护 Kubernetes 上任何基于 HTTP 的工作负载。

<!--
See:
-->
查看：

<!--
- [Guard](https://github.com/knative-sandbox/security-guard)  on Github, for using Guard as a standalone tool.
- The Knative automation suite - Read about Knative, in the blog post [Opinionated Kubernetes](https://davidhadas.wordpress.com/2022/08/29/knative-an-opinionated-kubernetes) which describes how Knative simplifies and unifies the way web services are deployed on Kubernetes.
- You may contact Guard maintainers on the [SIG Security](https://kubernetes.slack.com/archives/C019LFTGNQ3) Slack channel or on the Knative community [security](https://knative.slack.com/archives/CBYV1E0TG) Slack channel. The Knative community channel will move soon to the [CNCF Slack](https://communityinviter.com/apps/cloud-native/cncf) under the name `#knative-security`.
-->
- Github 上的 [Guard](https://github.com/knative-sandbox/security-guard)，用于将 Guard 用作独立工具。
- Knative 自动化套件 - 在博客文章 [Opinionated Kubernetes](https://davidhadas.wordpress.com/2022/08/29/knative-an-opinionated-kubernetes) 中了解 Knative，
  其中描述了 Knative 如何简化和统一 Web 服务在 Kubernetes 上的部署方式。
- 你可以在 [SIG Security](https://kubernetes.slack.com/archives/C019LFTGNQ3)
  或 Knative 社区 [Security](https://knative.slack.com/archives/CBYV1E0TG) Slack 频道上联系 Guard 维护人员。
  Knative 社区频道将很快转移到 [CNCF Slack](https://communityinviter.com/apps/cloud-native/cncf)，其名称为`#knative-security`。

<!--
The goal of this post is to invite the Kubernetes community to action and introduce Security-Behavior monitoring and control to help secure Kubernetes based deployments. Hopefully, the community as a follow up will:
-->
本文的目标是邀请 Kubernetes 社区采取行动，并引入安全行为监测和控制，
以帮助保护基于 Kubernetes 的部署。希望社区后续能够：

<!--
1. Analyze the cyber challenges presented for different Kubernetes use cases
1. Add appropriate security documentation for users on how to introduce Security-Behavior monitoring and control.
1. Consider how to integrate with tools that can help users monitor and control their vulnerable services.
-->
1. 分析不同 Kubernetes 使用场景带来的网络挑战
1. 为用户添加适当的安全文档，介绍如何引入安全行为监控。
1. 考虑如何与帮助用户监测和控制其易被攻击服务的工具进行集成。

<!--
## Getting involved
-->
## 欢迎参与 {#getting-involved}

<!--
You are welcome to get involved and join the effort to develop security behavior monitoring and control for Kubernetes; to share feedback and contribute to code or documentation; and to make or suggest improvements of any kind.
-->
欢迎你参与到对 Kubernetes 的开发安全行为监控的工作中；以代码或文档的形式分享反馈或做出贡献；并以任何形式完成或提议相关改进。
