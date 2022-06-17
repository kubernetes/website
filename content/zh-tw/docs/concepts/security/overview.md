---
title: 雲原生安全概述
description: >
 在雲原生安全的背景下思考 Kubernetes 安全模型。
content_type: concept
weight: 1
---
<!--
reviewers:
- zparnold
title: Overview of Cloud Native Security
description: >
  A model for thinking about Kubernetes security in the context of Cloud Native security.
content_type: concept
weight: 1
-->

<!-- overview -->
<!--
This overview defines a model for thinking about Kubernetes security in the context of Cloud Native security.
-->
本概述定義了一個模型，用於在 Cloud Native 安全性上下文中考慮 Kubernetes 安全性。

<!--
This container security model provides suggestions, not proven information security policies.
-->
{{< warning >}}
此容器安全模型只提供建議，而不是經過驗證的資訊保安策略。
{{< /warning >}}

<!-- body -->

<!--
## The 4C's of Cloud Native security

You can think about security in layers. The 4C's of Cloud Native security are Cloud,
Clusters, Containers, and Code.
-->
## 雲原生安全的 4 個 C    {#the-4c-s-of-cloud-native-security}

你可以分層去考慮安全性，雲原生安全的 4 個 C 分別是雲（Cloud）、叢集（Cluster）、容器（Container）和程式碼（Code）。

<!--
This layered approach augments the [defense in depth](https://en.wikipedia.org/wiki/Defense_in_depth_(computing))
computing approach to security, which is widely regarded as a best practice for securing
software systems.
-->
{{< note >}}
這種分層方法增強了[深度防護方法](https://en.wikipedia.org/wiki/Defense_in_depth_(computing))在安全性方面的
防禦能力，該方法被廣泛認為是保護軟體系統的最佳實踐。

{{< /note >}}

{{< figure src="/images/docs/4c.png" title="雲原生安全的 4C" >}}

<!--
Each layer of the Cloud Native security model builds upon the next outermost layer.
The Code layer benefits from strong base (Cloud, Cluster, Container) security layers.
You cannot safeguard against poor security standards in the base layers by addressing
security at the Code level.
-->
雲原生安全模型的每一層都是基於下一個最外層，程式碼層受益於強大的基礎安全層（雲、叢集、容器）。
你無法透過在程式碼層解決安全問題來為基礎層中糟糕的安全標準提供保護。

<!--
## Cloud
-->
## 雲    {#cloud}

<!--
In many ways, the Cloud (or co-located servers, or the corporate datacenter) is the
[trusted computing base](https://en.wikipedia.org/wiki/Trusted_computing_base)
of a Kubernetes cluster. If the Cloud layer is vulnerable (or
configured in a vulnerable way) then there is no guarantee that the components built
on top of this base are secure. Each cloud provider makes security recommendations
for running workloads securely in their environment.
-->
在許多方面，雲（或者位於同一位置的伺服器，或者是公司資料中心）是 Kubernetes 叢集中的
[可信計算基](https://en.wikipedia.org/wiki/Trusted_computing_base)。
如果雲層容易受到攻擊（或者被配置成了易受攻擊的方式），就不能保證在此基礎之上構建的元件是安全的。
每個雲提供商都會提出安全建議，以在其環境中安全地執行工作負載。

<!--
### Cloud provider security

If you are running a Kubernetes cluster on your own hardware or a different cloud provider,
consult your documentation for security best practices.
Here are links to some of the popular cloud providers' security documentation:
-->
### 雲提供商安全性    {#cloud-provider-security}

如果你是在你自己的硬體或者其他不同的雲提供商上執行 Kubernetes 叢集，
請查閱相關文件來獲取最好的安全實踐。

下面是一些比較流行的雲提供商的安全性文件連結：

{{< table caption="雲提供商安全" >}}

IaaS 提供商        | 連結 |
-------------------- | ------------ |
Alibaba Cloud | https://www.alibabacloud.com/trust-center |
Amazon Web Services | https://aws.amazon.com/security/ |
Google Cloud Platform | https://cloud.google.com/security/ |
IBM Cloud | https://www.ibm.com/cloud/security |
Microsoft Azure | https://docs.microsoft.com/en-us/azure/security/azure-security |
Oracle Cloud Infrastructure | https://www.oracle.com/security/ |
VMWare VSphere | https://www.vmware.com/security/hardening-guides.html |

{{< /table >}}

<!--
### Infrastructure security {#infrastructure-security}

Suggestions for securing your infrastructure in a Kubernetes cluster:

{{< table caption="Infrastructure security" >}}

Area of Concern for Kubernetes Infrastructure | Recommendation |
--------------------------------------------- | -------------- |
Network access to API Server (Control plane) | All access to the Kubernetes control plane is not allowed publicly on the internet and is controlled by network access control lists restricted to the set of IP addresses needed to administer the cluster.|
Network access to Nodes (nodes) | Nodes should be configured to _only_ accept connections (via network access control lists) from the control plane on the specified ports, and accept connections for services in Kubernetes of type NodePort and LoadBalancer. If possible, these nodes should not be exposed on the public internet entirely.
Kubernetes access to Cloud Provider API | Each cloud provider needs to grant a different set of permissions to the Kubernetes control plane and nodes. It is best to provide the cluster with cloud provider access that follows the [principle of least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege) for the resources it needs to administer. The [Kops documentation](https://github.com/kubernetes/kops/blob/master/docs/iam_roles.md#iam-roles) provides information about IAM policies and roles.
Access to etcd | Access to etcd (the datastore of Kubernetes) should be limited to the control plane only. Depending on your configuration, you should attempt to use etcd over TLS. More information can be found in the [etcd documentation](https://github.com/etcd-io/etcd/tree/master/Documentation).
etcd Encryption | Wherever possible it's a good practice to encrypt all storage at rest, and since etcd holds the state of the entire cluster (including Secrets) its disk should especially be encrypted at rest.

{{< /table >}}
-->
### 基礎設施安全 {#infrastructure-security}

關於在 Kubernetes 叢集中保護你的基礎設施的建議：

{{< table caption="基礎設施安全" >}}

Kubernetes 基礎架構關注領域 | 建議 |
--------------------------------------------- | -------------- |
透過網路訪問 API 服務（控制平面）|所有對 Kubernetes 控制平面的訪問不允許在 Internet 上公開，同時應由網路訪問控制列表控制，該列表包含管理叢集所需的 IP 地址集。|
透過網路訪問 Node（節點）| 節點應配置為 _僅能_ 從控制平面上透過指定埠來接受（透過網路訪問控制列表）連線，以及接受 NodePort 和 LoadBalancer 型別的 Kubernetes 服務連線。如果可能的話，這些節點不應完全暴露在公共網際網路上。|
Kubernetes 訪問雲提供商的 API | 每個雲提供商都需要向 Kubernetes 控制平面和節點授予不同的許可權集。為叢集提供雲提供商訪問許可權時，最好遵循對需要管理的資源的[最小特權原則](https://en.wikipedia.org/wiki/Principle_of_least_privilege)。[Kops 文件](https://github.com/kubernetes/kops/blob/master/docs/iam_roles.md#iam-roles)提供有關 IAM 策略和角色的資訊。|
訪問 etcd | 對 etcd（Kubernetes 的資料儲存）的訪問應僅限於控制平面。根據配置情況，你應該嘗試透過 TLS 來使用 etcd。更多資訊可以在 [etcd 文件](https://github.com/etcd-io/etcd/tree/master/Documentation)中找到。|
etcd 加密 | 在所有可能的情況下，最好對所有儲存進行靜態資料加密，並且由於 etcd 擁有整個叢集的狀態（包括機密資訊），因此其磁碟更應該進行靜態資料加密。|

{{< /table >}}

<!--
## Cluster

There are two areas of concern for securing Kubernetes:

* Securing the cluster components that are configurable
* Securing the applications which run in the cluster
-->
## 叢集    {#cluster}

保護 Kubernetes 有兩個方面需要注意：

* 保護可配置的叢集元件
* 保護在叢集中執行的應用程式

<!--
### Components of the Cluster {#cluster-components}

If you want to protect your cluster from accidental or malicious access and adopt
good information practices, read and follow the advice about
[securing your cluster](/docs/tasks/administer-cluster/securing-a-cluster/).
-->
### 叢集元件 {#cluster-components}

如果想要保護叢集免受意外或惡意的訪問，採取良好的資訊管理實踐，請閱讀並遵循有關[保護叢集](/zh-cn/docs/tasks/administer-cluster/securing-a-cluster/)的建議。

<!--
### Components in the cluster (your application) {#cluster-applications}

Depending on the attack surface of your application, you may want to focus on specific
aspects of security. For example: If you are running a service (Service A) that is critical
in a chain of other resources and a separate workload (Service B) which is
vulnerable to a resource exhaustion attack, then the risk of compromising Service A
is high if you do not limit the resources of Service B. The following table lists
areas of security concerns and recommendations for securing workloads running in Kubernetes:

Area of Concern for Workload Security | Recommendation |
------------------------------ | --------------------- |
RBAC Authorization (Access to the Kubernetes API) | https://kubernetes.io/docs/reference/access-authn-authz/rbac/
Authentication | https://kubernetes.io/docs/concepts/security/controlling-access/
Application secrets management (and encrypting them in etcd at rest) | https://kubernetes.io/docs/concepts/configuration/secret/ <br> https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/
Ensuring that pods meet defined Pod Security Standards | https://kubernetes.io/docs/concepts/security/pod-security-standards/#policy-instantiation
Quality of Service (and Cluster resource management) | https://kubernetes.io/docs/tasks/configure-pod-container/quality-service-pod/
Network Policies | https://kubernetes.io/docs/concepts/services-networking/network-policies/
TLS for Kubernetes Ingress | https://kubernetes.io/docs/concepts/services-networking/ingress/#tls
-->
### 叢集中的元件（你的應用） {#cluster-applications}

根據你的應用程式的受攻擊面，你可能需要關注安全性的特定面，比如：
如果你正在執行中的一個服務（A 服務）在其他資源鏈中很重要，並且所執行的另一工作負載（服務 B）
容易受到資源枯竭的攻擊，則如果你不限制服務 B 的資源的話，損害服務 A 的風險就會很高。
下表列出了安全性關注的領域和建議，用以保護 Kubernetes 中執行的工作負載：

工作負載安全性關注領域         |  建議                 |
------------------------------ | --------------------- |
RBAC 授權(訪問 Kubernetes API) | https://kubernetes.io/zh-cn/docs/reference/access-authn-authz/rbac/
認證方式 | https://kubernetes.io/zh-cn/docs/concepts/security/controlling-access/
應用程式 Secret 管理 (並在 etcd 中對其進行靜態資料加密) | https://kubernetes.io/zh-cn/docs/concepts/configuration/secret/ <br> https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/encrypt-data/
確保 Pod 符合定義的 Pod 安全標準 | https://kubernetes.io/zh-cn/docs/concepts/security/pod-security-standards/#policy-instantiation
服務質量（和叢集資源管理）| https://kubernetes.io/zh-cn/docs/tasks/configure-pod-container/quality-service-pod/
網路策略 | https://kubernetes.io/zh-cn/docs/concepts/services-networking/network-policies/
Kubernetes Ingress 的 TLS 支援 | https://kubernetes.io/zh-cn/docs/concepts/services-networking/ingress/#tls

<!--
## Container

Container security is outside the scope of this guide. Here are general recommendations and
links to explore this topic:

Area of Concern for Containers | Recommendation |
------------------------------ | -------------- |
Container Vulnerability Scanning and OS Dependency Security | As part of an image build step, you should scan your containers for known vulnerabilities.
Image Signing and Enforcement | Sign container images to maintain a system of trust for the content of your containers.
Disallow privileged users | When constructing containers, consult your documentation for how to create users inside of the containers that have the least level of operating system privilege necessary in order to carry out the goal of the container.
Use container runtime with stronger isolation | Select [container runtime classes](/docs/concepts/containers/runtime-class/) that provide stronger isolation
-->
## 容器    {#container}

容器安全性不在本指南的探討範圍內。下面是一些探索此主題的建議和連線：

容器關注領域                   | 建議           |
------------------------------ | -------------- |
容器漏洞掃描和作業系統依賴安全性 | 作為映象構建的一部分，你應該掃描你的容器裡的已知漏洞。
映象簽名和執行 | 對容器映象進行簽名，以維護對容器內容的信任。
禁止特權使用者 | 構建容器時，請查閱文件以瞭解如何在具有最低作業系統特權級別的容器內部建立使用者，以實現容器的目標。
使用帶有較強隔離能力的容器執行時 | 選擇提供較強隔離能力的[容器執行時類](/zh-cn/docs/concepts/containers/runtime-class/)。
<!--
## Code

Application code is one of the primary attack surfaces over which you have the most control.
While securing application code is outside of the Kubernetes security topic, here
are recommendations to protect application code:
-->
## 程式碼    {#code}

應用程式程式碼是你最能夠控制的主要攻擊面之一，雖然保護應用程式程式碼不在 Kubernetes 安全主題範圍內，但以下是保護應用程式程式碼的建議：

<!--
### Code security

{{< table caption="Code security" >}}

Area of Concern for Code | Recommendation |
-------------------------| -------------- |
Access over TLS only | If your code needs to communicate by TCP, perform a TLS handshake with the client ahead of time. With the exception of a few cases, encrypt everything in transit. Going one step further, it's a good idea to encrypt network traffic between services. This can be done through a process known as mutual TLS authentication or [mTLS](https://en.wikipedia.org/wiki/Mutual_authentication) which performs a two sided verification of communication between two certificate holding services. |
Limiting port ranges of communication | This recommendation may be a bit self-explanatory, but wherever possible you should only expose the ports on your service that are absolutely essential for communication or metric gathering. |
3rd Party Dependency Security | It is a good practice to regularly scan your application's third party libraries for known security vulnerabilities. Each programming language has a tool for performing this check automatically. |
Static Code Analysis | Most languages provide a way for a snippet of code to be analyzed for any potentially unsafe coding practices. Whenever possible you should perform checks using automated tooling that can scan codebases for common security errors. Some of the tools can be found at: https://owasp.org/www-community/Source_Code_Analysis_Tools |
Dynamic probing attacks | There are a few automated tools that you can run against your service to try some of the well known service attacks. These include SQL injection, CSRF, and XSS. One of the most popular dynamic analysis tools is the [OWASP Zed Attack proxy](https://owasp.org/www-project-zap/) tool. |

{{< /table >}}
-->
### 程式碼安全性    {#code-security}

{{< table caption="程式碼安全" >}}

程式碼關注領域 | 建議 |
-------------------------| -------------- |
僅透過 TLS 訪問 | 如果你的程式碼需要透過 TCP 通訊，請提前與客戶端執行 TLS 握手。除少數情況外，請加密傳輸中的所有內容。更進一步，加密服務之間的網路流量是一個好主意。這可以透過被稱為雙向 TLS 或 [mTLS](https://en.wikipedia.org/wiki/Mutual_authentication) 的過程來完成，該過程對兩個證書持有服務之間的通訊執行雙向驗證。 |
限制通訊埠範圍 | 此建議可能有點不言自明，但是在任何可能的情況下，你都只應公開服務上對於通訊或度量收集絕對必要的埠。|
第三方依賴性安全 | 最好定期掃描應用程式的第三方庫以瞭解已知的安全漏洞。每種程式語言都有一個自動執行此檢查的工具。 |
靜態程式碼分析 | 大多數語言都提供給了一種方法，來分析程式碼段中是否存在潛在的不安全的編碼實踐。只要有可能，你都應該使用自動工具執行檢查，該工具可以掃描程式碼庫以查詢常見的安全錯誤，一些工具可以在以下連線中找到： https://owasp.org/www-community/Source_Code_Analysis_Tools |
動態探測攻擊 | 你可以對服務執行一些自動化工具，來嘗試一些眾所周知的服務攻擊。這些攻擊包括 SQL 注入、CSRF 和 XSS。[OWASP Zed Attack](https://owasp.org/www-project-zap/) 代理工具是最受歡迎的動態分析工具之一。 |

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
* [Runtime class](/docs/concepts/containers/runtime-class)
-->
學習瞭解相關的 Kubernetes 安全主題：

* [Pod 安全標準](/zh-cn/docs/concepts/security/pod-security-standards/)
* [Pod 的網路策略](/zh-cn/docs/concepts/services-networking/network-policies/)
* [控制對 Kubernetes API 的訪問](/zh-cn/docs/concepts/security/controlling-access/)
* [保護你的叢集](/zh-cn/docs/tasks/administer-cluster/securing-a-cluster/)
* 為控制面[加密通訊中的資料](/zh-cn/docs/tasks/tls/managing-tls-in-a-cluster/)
* [加密靜止狀態的資料](/zh-cn/docs/tasks/administer-cluster/encrypt-data/)
* [Kubernetes 中的 Secret](/zh-cn/docs/concepts/configuration/secret/)
* [執行時類](/zh-cn/docs/concepts/containers/runtime-class)

