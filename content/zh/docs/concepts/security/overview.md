---
reviewers:
- zparnold
title: 云原生安全概述
content_template: templates/concept
weight: 1
---

{{< toc >}}

{{% capture overview %}}
<!--
Kubernetes Security (and security in general) is an immense topic that has many
highly interrelated parts. In today's era where open source software is
integrated into many of the systems that help web applications run,
there are some overarching concepts that can help guide your intuition about how you can
think about security holistically. This guide will define a mental model
for some general concepts surrounding Cloud Native Security. The mental model is completely arbitrary
and you should only use it if it helps you think about where to secure your software
stack.
-->
Kubernetes 安全性（以及总体上的安全性）是一个巨大的话题，其中包含许多高度相关的部分。
在当今时代，开源软件已集成到许多可帮助网络应用程序运行的系统中，
有一些总体概念可以帮助指导您如何全面地思考整体安全性。
本指南将围绕 Cloud Native Security 为一些一般概念定义一个思维模型。
思维模型是完全任意的，只有它在可以帮助您考虑在何处保护软件堆栈时，才应使用它。
{{% /capture %}}

{{% capture body %}}

<!--
## The 4C's of Cloud Native security
-->
## 云原生安全的 4 个 C
<!--
Let's start with a diagram that may help you understand how you can think about security in layers.
-->
让我们从一个图表开始，也许它可以帮助您了解如何分层去考虑安全性。
<!--
This layered approach augments the [defense in depth](https://en.wikipedia.org/wiki/Defense_in_depth_(computing))
approach to security, which is widely regarded as a best practice for securing
software systems. The 4C's are Cloud, Clusters, Containers, and Code.
-->
{{< note >}}
这种分层方法增强了[深度防护方法](https://en.wikipedia.org/wiki/Defense_in_depth_(computing))在安全性方面的
防御能力，该方法被广泛认为是保护软件系统的最佳实践。
4C 分别是云（Cloud）、集群（Cluster）、容器（Container）和代码（Code）。
{{< /note >}}

{{< figure src="/images/docs/4c.png" title="云原生安全的 4C" >}}


<!--
As you can see from the above figure,
each one of the 4C's depend on the security of the squares in which they fit. It
is nearly impossibly to safeguard against poor security standards in Cloud, Containers, and Code
by only addressing security at the code level. However, when these areas are dealt
with appropriately, then adding security to your code augments an already strong
base. These areas of concern will now be described in more detail below.
-->
从上图可以看到，每个 4C 都取决于它们适合的正方形的安全性。
仅通过在代码级别解决安全问题，几乎不可能防止云，容器和代码中不良的安全标准。
但是，如果适当地处理了这些方面，则为代码添加安全性将增强本已强大的基础。
现在将在下面更详细地描述这些关注的领域。

<!--
## Cloud
-->
## 云

<!--
In many ways, the Cloud (or co-located servers, or the corporate datacenter) is the
[trusted computing base](https://en.wikipedia.org/wiki/Trusted_computing_base)
of a Kubernetes cluster. If these components themselves are vulnerable (or
configured in a vulnerable way) then there's no real way to guarantee the security
of any components built on top of this base. Each cloud provider has extensive
security recommendations they make to their customers on how to run workloads securely
in their environment.It is out of the scope of this guide to give recommendations
on cloud security since every cloud provider and workload is different. Here are some
links to some of the popular cloud providers' documentation
for security as well as give general guidance for securing the infrastructure that
makes up a Kubernetes cluster.
-->
在许多方面，云（或者位于同一位置的服务器，或者是公司数据中心）是 Kubernetes 集群中的
[可信计算基](https://en.wikipedia.org/wiki/Trusted_computing_base)。
如果这些组件本身容易受到攻击（或者被配置成了易受攻击的方式），就没有真正的方法保证在此基础之上构建的组件是安全的。
每个云提供商都会提出大量的安全建议，向客户提供有关如何在其环境中安全地运行工作负载的安全建议。
由于每个云提供商和工作负载都不相同，因此提供有关云安全性的建议超出了本指南的范围。
这里是一些常用的云提供商提供的为了安全性的文档的链接，并提供有关保护组成 Kubernetes 集群的基础架构的一般指导。

<!--
### Cloud Provider Security Table
-->
### 云提供商安全性表格


IaaS 提供商        | 链接 |
-------------------- | ------------ |
Alibaba Cloud | https://www.alibabacloud.com/trust-center |
Amazon Web Services | https://aws.amazon.com/security/ |
Google Cloud Platform | https://cloud.google.com/security/ |
IBM Cloud | https://www.ibm.com/cloud/security |
Microsoft Azure | https://docs.microsoft.com/en-us/azure/security/azure-security |
VMWare VSphere | https://www.vmware.com/security/hardening-guides.html |

<!--
If you are running on your own hardware or a different cloud provider you will need to
consult your documentation for security best practices.
-->
如果您是在您自己的硬件或者不同云提供商上运行，您需要查阅相关文档来获取最好的安全实践。

<!--
### General Infrastructure Guidance Table
-->
### 基础设施指导表格

<!--
Area of Concern for Kubernetes Infrastructure | Recommendation |
--------------------------------------------- | -------------- |
Network access to API Server (Masters) | Ideally all access to the Kubernetes Masters is not allowed publicly on the internet and is controlled by network access control lists restricted to the set of IP addresses needed to administer the cluster.|
Network access to Nodes (Worker Servers) | Nodes should be configured to _only_ accept connections (via network access control lists)from the masters on the specified ports, and accept connections for services in Kubernetes of type NodePort and LoadBalancer. If possible, these nodes should not be exposed on the public internet entirely.
Kubernetes access to Cloud Provider API | Each cloud provider needs to grant a different set of permissions to the Kubernetes Masters and nodes, so this recommendation will be more generic. It is best to provide the cluster with cloud provider access that follows the [principle of least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege) for the resources it needs to administer.An example for Kops in AWS can be found here: https://github.com/kubernetes/kops/blob/master/docs/iam_roles.md#iam-roles 
Access to etcd | Access to etcd (the datastore of Kubernetes) should be limited to the masters only. Depending on your configuration, you should also attempt to use etcd over TLS. More info can be found here: https://github.com/etcd-io/etcd/tree/master/Documentation#security
etcd Encryption | Wherever possible it's a good practice to encrypt all drives at rest, but since etcd holds the state of the entire cluster (including Secrets) its disk should especially be encrypted at rest.
-->
Kubetnetes 基础架构关注领域 | 建议 |
--------------------------------------------- | -------------- |
通过网络访问 API 服务（Masters）|理想情况下，所有对 Kubernetes Masters 的访问不允许在 Internet 上公开，同时应由网络访问控制列表控制，该列表包含管理集群所需的 IP 地址集。|
通过网络访问 Node（工作服务器）| 节点应配置为 _仅能_ 从 Masters 上通过指定端口来接受（通过网络访问控制列表）连接，以及接受 NodePort 和 LoadBalancer 类型的 Kubernetes 服务连接。如果可能的话，这些节点不应完全暴露在公共互联网上。
Kubernetes 访问云提供商的 API | 每个云提供商都需要向 Kubernetes Masters 和节点授予不同的权限集，因此此建议将更为通用。为集群提供云提供商访问权限时，最好遵循对需要管理的资源的[最小特权原则](https://en.wikipedia.org/wiki/Principle_of_least_privilege)。可以在以下位置找到 AWS 中 Kops 的示例：https://github.com/kubernetes/kops/blob/master/docs/iam_roles.md#iam-roles
访问 etcd | 对 etcd（Kubernetes 的数据存储）的访问应仅限于 Masters。根据配置情况，你也应该尝试通过 TLS 来使用 etcd。更多信息可以这查找到：https://github.com/etcd-io/etcd/tree/master/Documentation 
etcd 加密 | 在所有可能的情况下，最好对所有驱动器进行静态数据加密，但是由于 etcd 拥有整个集群的状态（包括机密信息），因此其磁盘更应该进行静态数据加密。

<!--
## Cluster
-->
## 集群

<!--
This section will provide links for securing
workloads in Kubernetes. There are two areas of concern for securing
Kubernetes:

* Securing the components that are configurable which make up the cluster
* Securing the components which run in the cluster
-->
本部分将提供用于保护 Kubernetes 中的工作负载的链接。保护 Kubernetes 有两个方面需要注意：

* 保护组成集群的可配置组件
* 保护在集群中运行的组件

<!--
### Components _of_ the Cluster 
-->
### 集群组件 

If you want to protect your cluster from accidental or malicious access, and adopt
good information practices, read and follow the advice about
[securing your cluster](/docs/tasks/administer-cluster/securing-a-cluster/).

如果想要保护集群免受意外或恶意的访问，采取良好的信息管理实践，请阅读并遵循有关[保护集群](/zh/docs/tasks/administer-cluster/securing-a-cluster/)的建议。

<!--
### Components _in_ the cluster (your application) 
-->
### 集群中的组件（您的应用）

<!--
Depending on the attack surface of your application, you may want to focus on specific
aspects of security. For example,  If you are running a service (Service A) that is critical
in a chain of other resources and a separate workload (Service B) which is
vulnerable to a resource exhaustion attack, by not putting resource limits on
Service B you run the risk of also compromising Service A. Below is a table of
links of things to consider when securing workloads running in Kubernetes.
-->
根据您的应用程序的受攻击面，您可能需要关注安全性的特定面，比如，
如果您正在运行中的一个服务（A 服务）在其他资源链中很重要，并且所运行的另一工作负载（服务 B）
容易受到资源枯竭的攻击，通过不限制资源服务 B ，您冒着损害服务 A 的风险。
下表列出了保护 Kubernetes 中运行的工作负载需要考虑的链接：

<!--
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
工作负载安全性关注领域 |  建议 |
------------------------------ | --------------------- |
RBAC 授权(访问 Kubernetes API) | https://kubernetes.io/zh/docs/reference/access-authn-authz/rbac/
认证方式 | https://kubernetes.io/zh/docs/reference/access-authn-authz/controlling-access/
应用程序 Secret 管理 (并在 etcd 中对其进行静态数据加密) | https://kubernetes.io/zh/docs/concepts/configuration/secret/ <br> https://kubernetes.io/zh/docs/tasks/administer-cluster/encrypt-data/
Pod 安全策略 | https://kubernetes.io/zh/docs/concepts/policy/pod-security-policy/
服务质量（和集群资源管理）| https://kubernetes.io/zh/docs/tasks/configure-pod-container/quality-service-pod/
网络策略 | https://kubernetes.io/zh/docs/concepts/services-networking/network-policies/
Kubernetes Ingress 的 TLS 支持 | https://kubernetes.io/zh/docs/concepts/services-networking/ingress/#tls

<!--
## Container
-->
## 容器

<!--
In order to run software in Kubernetes, it must be in a container. Because of this,
there are certain security considerations that must be taken into account in order
to benefit from the workload security primitives of Kubernetes. Container security
is also outside the scope of this guide, but here is a table of general
recommendations and links for further exploration of this topic.
-->
为了在 Kubernetes 中运行，软件必须位于容器中。
因此，为了从 Kubernetes 的工作负载安全原语中受益，必须考虑某些安全注意事项。
容器安全性也不在本指南范围内，但这是一张有关一般建议和进一步探索该主题的链接的表格。

<!--
Area of Concern for Containers | Recommendation |
------------------------------ | -------------- |
Container Vulnerability Scanning and OS Dependency Security | As part of an image build step or on a regular basis you should scan your containers for known vulnerabilities with a tool such as [CoreOS's Clair](https://github.com/coreos/clair/)
Image Signing and Enforcement | Two other CNCF Projects (TUF and Notary) are useful tools for signing container images and maintaining a system of trust for the content of your containers. If you use Docker, it is built in to the Docker Engine as [Docker Content Trust](https://docs.docker.com/engine/security/trust/content_trust/). On the enforcement piece, [IBM's Portieris](https://github.com/IBM/portieris) project is a tool that runs as a Kubernetes Dynamic Admission Controller to ensure that images are properly signed via Notary before being admitted to the Cluster.
Disallow privileged users | When constructing containers, consult your documentation for how to create users inside of the containers that have the least level of operating system privilege necessary in order to carry out the goal of the container.
-->
容器关注领域                   | 建议           |
------------------------------ | -------------- |
容器漏洞扫描和操作系统依赖安全性 | 作为镜像构建的一部分，或您应该定期使用[CoreOS's Clair](https://github.com/coreos/clair/)之类的工具扫描您的容器里的已知漏洞。
镜像签名和执行 | 另外两个 CNCF 项目（TUF 和 Notary）是有用的工具，用来对容器镜像进行签名，以维护对容器内容的信任。如果使用 Docker，则它被内置在 Docker 引擎中作为[Docker Content Trust](https://docs.docker.com/engine/security/trust/content_trust/)。在实施方面，[IBM 的 Portieris]（https://github.com/IBM/portieris） 项目是作为Kubernetes动态准入控制器运行的工具，以确保图像在进入群集之前已通过公证人正确签名。
禁止特权用户 | 构建容器时，请查阅文档以了解如何在具有最低操作系统特权级别的容器内部创建用户，以实现容器的目标。

<!--
## Code
-->
## 代码

<!--
Finally moving down into the application code level, this is one of the primary attack
surfaces over which you have the most control. This is also outside of the scope
of Kubernetes but here are a few recommendations:
-->
最终进入应用程序代码级别，这是您最能够控制的主要攻击面之一。
这也不在 Kubernetes 的范围之内，但是这里有一些建议：

<!--
### General Code Security Guidance Table
-->
### 通用代码安全性指导表

<!--
Area of Concern for Code | Recommendation |
-------------------------| -------------- |
Access over TLS only | If your code needs to communicate via TCP, ideally it would be performing a TLS handshake with the client ahead of time.  With the exception of a few cases, the default behavior should be to encrypt everything in transit. Going one step further, even "behind the firewall" in our VPC's it's still a good idea to encrypt network traffic between services. This can be done through a process known as mutual or [mTLS](https://en.wikipedia.org/wiki/Mutual_authentication) which performs a two sided verification of communication between two certificate holding services. There are numerous tools that can be used to accomplish this in Kubernetes such as [Linkerd](https://linkerd.io/) and [Istio](https://istio.io/). |
Limiting port ranges of communication | This recommendation may be a bit self-explanatory, but wherever possible you should only expose the ports on your service that are absolutely essential for communication or metric gathering. |
3rd Party Dependency Security |Since our applications tend to have dependencies outside of our own codebases, it is a good practice to ensure that a regular scan of the code's dependencies are still secure with no CVE's currently filed against them. Each programming language has a tool for performing this check automatically. |
Static Code Analysis | Most languages provide a way for a snippet of code to be analyzed for any potentially unsafe coding practices. Whenever possible you should perform checks using automated tooling that can scan codebases for common security errors. Some of the tools can be found here: https://www.owasp.org/index.php/Source_Code_Analysis_Tools |
Dynamic probing attacks | There are a few automated tools that are able to be run against your service to try some of the well known attacks that commonly befall services. These include SQL injection, CSRF, and XSS. One of the most popular dynamic analysis tools is the OWASP Zed Attack proxy https://www.owasp.org/index.php/OWASP_Zed_Attack_Proxy_Project |
-->
代码关注领域 | 建议 |
-------------------------| -------------- |
仅通过 TLS 访问 | 如果您的代码需要通过 TCP 通信，理想情况下，请提前与客户端执行 TLS 握手。除少数情况外，默认的行为是加密传输中的所有内容。更进一步，甚至在我们的VPC中的“防火墙后面”，加密服务之间的网络流量仍然是一个好主意。这可以通过被称为相互 LTS 或 [mTLS](https://en.wikipedia.org/wiki/Mutual_authentication) 的过程来完成，该过程对两个证书持有服务之间的通信执行双向验证。Kubernetes 中有许多工具可用于完成此任务，例如[Linkerd](https://linkerd.io/)和[Istio](https://istio.io/)。 |
限制通信端口范围 | 此建议可能有点不言自明，但是在任何可能的情况下，你都只应公开服务上对于通信或度量收集绝对必要的端口。|
第三方依赖性安全 | 由于我们的应用程序倾向于在我们自己的代码库之外具有依赖关系，因此，最好定期扫描代码依赖项，确保它是安全的，没有针对它们的 CVE 归档。每种编程语言都有一个自动执行此检查的工具。 |
静态代码分析 | 大多数语言都提供给了一种方法，来分析代码段中是否存在潜在的不安全的编码实践。只要有可能，你都应该使用自动工具执行检查，该工具可以扫描代码库以查找常见的安全错误，一些工具可以在以下连接中找到：https://www.owasp.org/index.php/Source_Code_Analysis_Tools |
动态探测攻击 | 您可以对服务运行一些自动化工具，来针对您的服务运行，尝试一些众所周知的服务攻击。这些攻击包括 SQL 注入、CSRF 和 XSS。OWASP Zed Attack proxy https://www.owasp.org/index.php/OWASP_Zed_Attack_Proxy_Project 代理工具是最受欢迎的动态分析工具之一。 |

<!--
## Robust automation
-->
## 强大的自动化

<!--
Most of the above mentioned suggestions can actually be automated in your code
delivery pipeline as part of a series of checks in security. To learn about a
more "Continuous Hacking" approach to software delivery, [this article](https://thenewstack.io/beyond-ci-cd-how-continuous-hacking-of-docker-containers-and-pipeline-driven-security-keeps-ygrene-secure/) provides more detail.
-->
上面提到的大多数建议实际上可以在代码交付管道中自动进行，作为一系列安全检查的一部分。
要了解一种更“连续黑客”的软件交付方法，[本文](https://thenewstack.io/beyond-ci-cd-how-continuous-hacking-of-docker-containers-and-pipeline-driven-security-keeps-ygrene-secure/) 提供了更多详细信息。

{{% /capture %}}
{{% capture whatsnext %}}
<!--
* Read about [network policies for Pods](/docs/concepts/services-networking/network-policies/)
* Read about [securing your cluster](/docs/tasks/administer-cluster/securing-a-cluster/)
* Read about [API access control](/docs/reference/access-authn-authz/controlling-access/)
* Read about [data encryption in transit](/docs/tasks/tls/managing-tls-in-a-cluster/) for the control plane
* Read about [data encryption at rest](/docs/tasks/administer-cluster/encrypt-data/)
* Read about [Secrets in Kubernetes](/docs/concepts/configuration/secret/)
-->
* 了解 [Pod 的网络策略](/docs/concepts/services-networking/network-policies/)
* 了解 [保护您的集群](/docs/tasks/administer-cluster/securing-a-cluster/)
* 了解 [API 访问控制](/docs/reference/access-authn-authz/controlling-access/)
* 了解 为控制面[加密通信中的数据](/docs/tasks/tls/managing-tls-in-a-cluster/) for the control plane
* 了解 [加密静止状态的数据](/docs/tasks/administer-cluster/encrypt-data/)
* 了解 [Kubernetes 中的 Secret](/docs/concepts/configuration/secret/)
{{% /capture %}}
