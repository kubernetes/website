---
title: 云原生安全概述
content_type: concept
weight: 10
---

<!-- overview -->
<!--
This overview defines a model for thinking about Kubernetes security in the context of Cloud Native security.
-->
本概述定义了一个模型，用于在 Cloud Native 安全性上下文中考虑 Kubernetes 安全性。

<!--
This container security model provides suggestions, not proven information security policies.
-->
{{< warning >}}
此容器安全模型只提供建议，而不是经过验证的信息安全策略。
{{< /warning >}}

<!-- body -->

<!--
## The 4C's of Cloud Native security

You can think about security in layers. The 4C's of Cloud Native security are Cloud,
Clusters, Containers, and Code.
-->
## 云原生安全的 4 个 C

你可以分层去考虑安全性，云原生安全的 4 个 C 分别是云（Cloud）、集群（Cluster）、容器（Container）和代码（Code）。

<!--
This layered approach augments the [defense in depth](https://en.wikipedia.org/wiki/Defense_in_depth_(computing))
computing approach to security, which is widely regarded as a best practice for securing
software systems.
-->
{{< note >}}
这种分层方法增强了[深度防护方法](https://en.wikipedia.org/wiki/Defense_in_depth_(computing))在安全性方面的
防御能力，该方法被广泛认为是保护软件系统的最佳实践。

{{< /note >}}

{{< figure src="/images/docs/4c.png" title="云原生安全的 4C" >}}

<!--
Each layer of the Cloud Native security model builds upon the next outermost layer.
The Code layer benefits from strong base (Cloud, Cluster, Container) security layers.
You cannot safeguard against poor security standards in the base layers by addressing
security at the Code level.
-->
云原生安全模型的每一层都是基于下一个最外层，代码层受益于强大的基础安全层（云、集群、容器）。你无法通过在代码层解决安全问题来为基础层中糟糕的安全标准提供保护。

## 云

<!--
In many ways, the Cloud (or co-located servers, or the corporate datacenter) is the
[trusted computing base](https://en.wikipedia.org/wiki/Trusted_computing_base)
of a Kubernetes cluster. If the Cloud layer is vulnerable (or
configured in a vulnerable way) then there is no guarantee that the components built
on top of this base are secure. Each cloud provider makes security recommendations
for running workloads securely in their environment.
-->
在许多方面，云（或者位于同一位置的服务器，或者是公司数据中心）是 Kubernetes 集群中的
[可信计算基](https://en.wikipedia.org/wiki/Trusted_computing_base)。
如果云层容易受到攻击（或者被配置成了易受攻击的方式），就不能保证在此基础之上构建的组件是安全的。
每个云提供商都会提出安全建议，以在其环境中安全地运行工作负载。

<!--
### Cloud provider security

If you are running a Kubernetes cluster on your own hardware or a different cloud provider,
consult your documentation for security best practices.
Here are links to some of the popular cloud providers' security documentation:
-->
### 云提供商安全性

如果您是在您自己的硬件或者其他不通的云提供商上运行 Kubernetes 集群，
请查阅相关文档来获取最好的安全实践。

下面是一些比较流行的云提供商的安全性文档链接：

{{< table caption="云提供商安全" >}}

IaaS 提供商        | 链接 |
-------------------- | ------------ |
Alibaba Cloud | https://www.alibabacloud.com/trust-center |
Amazon Web Services | https://aws.amazon.com/security/ |
Google Cloud Platform | https://cloud.google.com/security/ |
IBM Cloud | https://www.ibm.com/cloud/security |
Microsoft Azure | https://docs.microsoft.com/en-us/azure/security/azure-security |
VMWare VSphere | https://www.vmware.com/security/hardening-guides.html |

{{< /table >}}

<!--
### Infrastructure security {#infrastructure-security}

Suggestions for securing your infrastructure in a Kubernetes cluster:

{{< table caption="Infrastructure security" >}}

Area of Concern for Kubernetes Infrastructure | Recommendation |
--------------------------------------------- | -------------- |
Network access to API Server (Control plane) | All access to the Kubernetes control plane is not allowed publicly on the internet and is controlled by network access control lists restricted to the set of IP addresses needed to administer the cluster.|
Network access to Nodes (nodes) | Nodes should be configured to _only_ accept connections (via network access control lists)from the control plane on the specified ports, and accept connections for services in Kubernetes of type NodePort and LoadBalancer. If possible, these nodes should not be exposed on the public internet entirely.
Kubernetes access to Cloud Provider API | Each cloud provider needs to grant a different set of permissions to the Kubernetes control plane and nodes. It is best to provide the cluster with cloud provider access that follows the [principle of least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege) for the resources it needs to administer. The [Kops documentation](https://github.com/kubernetes/kops/blob/master/docs/iam_roles.md#iam-roles) provides information about IAM policies and roles.
Access to etcd | Access to etcd (the datastore of Kubernetes) should be limited to the control plane only. Depending on your configuration, you should attempt to use etcd over TLS. More information can be found in the [etcd documentation](https://github.com/etcd-io/etcd/tree/master/Documentation).
etcd Encryption | Wherever possible it's a good practice to encrypt all drives at rest, but since etcd holds the state of the entire cluster (including Secrets) its disk should especially be encrypted at rest.

{{< /table >}}
-->
### 基础设施安全 {#infrastructure-security}

关于在 Kubernetes 集群中保护你的基础设施的建议：

{{< table caption="基础设施安全" >}}

Kubetnetes 基础架构关注领域 | 建议 |
--------------------------------------------- | -------------- |
通过网络访问 API 服务（控制平面）|所有对 Kubernetes 控制平面的访问不允许在 Internet 上公开，同时应由网络访问控制列表控制，该列表包含管理集群所需的 IP 地址集。|
通过网络访问 Node（节点）| 节点应配置为 _仅能_ 从控制平面上通过指定端口来接受（通过网络访问控制列表）连接，以及接受 NodePort 和 LoadBalancer 类型的 Kubernetes 服务连接。如果可能的话，这些节点不应完全暴露在公共互联网上。|
Kubernetes 访问云提供商的 API | 每个云提供商都需要向 Kubernetes 控制平面和节点授予不同的权限集。为集群提供云提供商访问权限时，最好遵循对需要管理的资源的[最小特权原则](https://en.wikipedia.org/wiki/Principle_of_least_privilege)。[Kops 文档](https://github.com/kubernetes/kops/blob/master/docs/iam_roles.md#iam-roles)提供有关 IAM 策略和角色的信息。|
访问 etcd | 对 etcd（Kubernetes 的数据存储）的访问应仅限于控制平面。根据配置情况，你应该尝试通过 TLS 来使用 etcd。更多信息可以在 [etcd 文档](https://github.com/etcd-io/etcd/tree/master/Documentation)中找到。|
etcd 加密 | 在所有可能的情况下，最好对所有驱动器进行静态数据加密，但是由于 etcd 拥有整个集群的状态（包括机密信息），因此其磁盘更应该进行静态数据加密。|

{{< /table >}}

<!--
## Cluster

There are two areas of concern for securing Kubernetes:

* Securing the cluster components that are configurable
* Securing the applications which run in the cluster
-->
## 集群

保护 Kubernetes 有两个方面需要注意：

* 保护可配置的集群组件
* 保护在集群中运行的应用程序

<!--
### Components of the Cluster {#cluster-components}

If you want to protect your cluster from accidental or malicious access and adopt
good information practices, read and follow the advice about
[securing your cluster](/docs/tasks/administer-cluster/securing-a-cluster/).
-->
### 集群组件 {#cluster-components}

如果想要保护集群免受意外或恶意的访问，采取良好的信息管理实践，请阅读并遵循有关[保护集群](/zh/docs/tasks/administer-cluster/securing-a-cluster/)的建议。

<!--
### Components in the cluster (your application) {#cluster-applications}

Depending on the attack surface of your application, you may want to focus on specific
aspects of security. For example: If you are running a service (Service A) that is critical
in a chain of other resources and a separate workload (Service B) which is
vulnerable to a resource exhaustion attack then the risk of compromising Service A
is high if you do not limit the resources of Service B. The following table lists
areas of security concerns and recommendations for securing workloads running in Kubernetes:

Area of Concern for Workload Security | Recommendation |
------------------------------ | --------------------- |
RBAC Authorization (Access to the Kubernetes API) | https://kubernetes.io/docs/reference/access-authn-authz/rbac/
Authentication | https://kubernetes.io/docs/reference/access-authn-authz/controlling-access/
Application secrets management (and encrypting them in etcd at rest) | https://kubernetes.io/docs/concepts/configuration/secret/ <br> https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/
Pod Security Policies | https://kubernetes.io/docs/concepts/policy/pod-security-policy/
Quality of Service (and Cluster resource management) | https://kubernetes.io/docs/tasks/configure-pod-container/quality-service-pod/
Network Policies | https://kubernetes.io/docs/concepts/services-networking/network-policies/
TLS For Kubernetes Ingress | https://kubernetes.io/docs/concepts/services-networking/ingress/#tls
-->
### 集群中的组件（您的应用） {#cluster-applications}

根据您的应用程序的受攻击面，您可能需要关注安全性的特定面，比如：
如果您正在运行中的一个服务（A 服务）在其他资源链中很重要，并且所运行的另一工作负载（服务 B）
容易受到资源枯竭的攻击，则如果你不限制服务 B 的资源的话，损害服务 A 的风险就会很高。
下表列出了安全性关注的领域和建议，用以保护 Kubernetes 中运行的工作负载：

工作负载安全性关注领域 |  建议 |
------------------------------ | --------------------- |
RBAC 授权(访问 Kubernetes API) | https://kubernetes.io/zh/docs/reference/access-authn-authz/rbac/
认证方式 | https://kubernetes.io/zh/docs/concepts/security/controlling-access/
应用程序 Secret 管理 (并在 etcd 中对其进行静态数据加密) | https://kubernetes.io/zh/docs/concepts/configuration/secret/ <br> https://kubernetes.io/zh/docs/tasks/administer-cluster/encrypt-data/
Pod 安全策略 | https://kubernetes.io/zh/docs/concepts/policy/pod-security-policy/
服务质量（和集群资源管理）| https://kubernetes.io/zh/docs/tasks/configure-pod-container/quality-service-pod/
网络策略 | https://kubernetes.io/zh/docs/concepts/services-networking/network-policies/
Kubernetes Ingress 的 TLS 支持 | https://kubernetes.io/zh/docs/concepts/services-networking/ingress/#tls

<!--
## Container

Container security is outside the scope of this guide. Here are general recommendations and
links to explore this topic:

Area of Concern for Containers | Recommendation |
------------------------------ | -------------- |
Container Vulnerability Scanning and OS Dependency Security | As part of an image build step, you should scan your containers for known vulnerabilities.
Image Signing and Enforcement | Sign container images to maintain a system of trust for the content of your containers.
Disallow privileged users | When constructing containers, consult your documentation for how to create users inside of the containers that have the least level of operating system privilege necessary in order to carry out the goal of the container.
-->
## 容器

容器安全性不在本指南的探讨范围内。下面是一些探索此主题的建议和连接：

容器关注领域                   | 建议           |
------------------------------ | -------------- |
容器漏洞扫描和操作系统依赖安全性 | 作为镜像构建的一部分，您应该扫描您的容器里的已知漏洞。
镜像签名和执行 | 对容器镜像进行签名，以维护对容器内容的信任。
禁止特权用户 | 构建容器时，请查阅文档以了解如何在具有最低操作系统特权级别的容器内部创建用户，以实现容器的目标。

<!--
## Code

Application code is one of the primary attack surfaces over which you have the most control.
While securing application code is outside of the Kubernetes security topic, here
are recommendations to protect application code:
-->
## 代码

应用程序代码是您最能够控制的主要攻击面之一，虽然保护应用程序代码不在 Kubernetes 安全主题范围内，但以下是保护应用程序代码的建议：

<!--
### Code security

{{< table caption="Code security" >}}

Area of Concern for Code | Recommendation |
-------------------------| -------------- |
Access over TLS only | If your code needs to communicate by TCP, perform a TLS handshake with the client ahead of time. With the exception of a few cases, encrypt everything in transit. Going one step further, it's a good idea to encrypt network traffic between services. This can be done through a process known as mutual or [mTLS](https://en.wikipedia.org/wiki/Mutual_authentication) which performs a two sided verification of communication between two certificate holding services. |
Limiting port ranges of communication | This recommendation may be a bit self-explanatory, but wherever possible you should only expose the ports on your service that are absolutely essential for communication or metric gathering. |
3rd Party Dependency Security | It is a good practice to regularly scan your application's third party libraries for known security vulnerabilities. Each programming language has a tool for performing this check automatically. |
Static Code Analysis | Most languages provide a way for a snippet of code to be analyzed for any potentially unsafe coding practices. Whenever possible you should perform checks using automated tooling that can scan codebases for common security errors. Some of the tools can be found at: https://owasp.org/www-community/Source_Code_Analysis_Tools |
Dynamic probing attacks | There are a few automated tools that you can run against your service to try some of the well known service attacks. These include SQL injection, CSRF, and XSS. One of the most popular dynamic analysis tools is the [OWASP Zed Attack proxy](https://owasp.org/www-project-zap/) tool. |

{{< /table >}}
-->
### 代码安全性

{{< table caption="代码安全" >}}

代码关注领域 | 建议 |
-------------------------| -------------- |
仅通过 TLS 访问 | 如果您的代码需要通过 TCP 通信，请提前与客户端执行 TLS 握手。除少数情况外，请加密传输中的所有内容。更进一步，加密服务之间的网络流量是一个好主意。这可以通过被称为相互 LTS 或 [mTLS](https://en.wikipedia.org/wiki/Mutual_authentication) 的过程来完成，该过程对两个证书持有服务之间的通信执行双向验证。 |
限制通信端口范围 | 此建议可能有点不言自明，但是在任何可能的情况下，你都只应公开服务上对于通信或度量收集绝对必要的端口。|
第三方依赖性安全 | 最好定期扫描应用程序的第三方库以了解已知的安全漏洞。每种编程语言都有一个自动执行此检查的工具。 |
静态代码分析 | 大多数语言都提供给了一种方法，来分析代码段中是否存在潜在的不安全的编码实践。只要有可能，你都应该使用自动工具执行检查，该工具可以扫描代码库以查找常见的安全错误，一些工具可以在以下连接中找到：https://owasp.org/www-community/Source_Code_Analysis_Tools |
动态探测攻击 | 您可以对服务运行一些自动化工具，来尝试一些众所周知的服务攻击。这些攻击包括 SQL 注入、CSRF 和 XSS。[OWASP Zed Attack](https://owasp.org/www-project-zap/) 代理工具是最受欢迎的动态分析工具之一。 |

{{< /table >}}

## {{% heading "whatsnext" %}}

<!--
Learn about related Kubernetes security topics:

* [Pod security standards](/docs/concepts/security/pod-security-standards/)
* [Network policies for Pods](/docs/concepts/services-networking/network-policies/)
* [Controlling Access to the Kubernetes API](/docs/concepts/security/controlling-access)
* [Securing your cluster](/docs/tasks/administer-cluster/securing-a-cluster/)
* [Data encryption in transit](/docs/tasks/tls/managing-tls-in-a-cluster/) for the control plane
* [Data encryption at rest](/docs/tasks/administer-cluster/encrypt-data/)
* [Secrets in Kubernetes](/docs/concepts/configuration/secret/)
-->
学习了解相关的 Kubernetes 安全主题：

* [Pod 安全标准](/zh/docs/concepts/security/pod-security-standards/)
* [Pod 的网络策略](/zh/docs/concepts/services-networking/network-policies/)
* [控制对 Kubernetes API 的访问](/zh/docs/concepts/security/controlling-access/)
* [保护您的集群](/zh/docs/tasks/administer-cluster/securing-a-cluster/)
* 为控制面[加密通信中的数据](/zh/docs/tasks/tls/managing-tls-in-a-cluster/)
* [加密静止状态的数据](/zh/docs/tasks/administer-cluster/encrypt-data/)
* [Kubernetes 中的 Secret](/zh/docs/concepts/configuration/secret/)

