---
title: Kubernetes 是什麼？
content_type: concept
description: >
  Kubernetes 是一個可移植、可擴充套件的開源平臺，用於管理容器化的工作負載和服務，方便進行宣告式配置和自動化。Kubernetes 擁有一個龐大且快速增長的生態系統，其服務、支援和工具的使用範圍廣泛。
weight: 10
card:
  name: concepts
  weight: 10
---
<!--
reviewers:
- bgrant0607
- mikedanese
title: What is Kubernetes
content_type: concept
weight: 10
card:
  name: concepts
  weight: 10
-->

<!-- overview -->
<!--
This page is an overview of Kubernetes.
-->
此頁面是 Kubernetes 的概述。


<!-- body -->
<!--
Kubernetes is a portable, extensible, open source platform for managing containerized workloads and services, that facilitates both declarative configuration and automation. It has a large, rapidly growing ecosystem. Kubernetes services, support, and tools are widely available.
-->
Kubernetes 是一個可移植、可擴充套件的開源平臺，用於管理容器化的工作負載和服務，可促進宣告式配置和自動化。
Kubernetes 擁有一個龐大且快速增長的生態，其服務、支援和工具的使用範圍相當廣泛。

<!--
The name Kubernetes originates from Greek, meaning helmsman or pilot. K8s as an abbreviation results from counting the eight letters between the "K" and the "s". Google open-sourced the Kubernetes project in 2014. Kubernetes combines [over 15 years of Google's experience](/blog/2015/04/borg-predecessor-to-kubernetes/) running production workloads at scale with best-of-breed ideas and practices from the community.
-->
**Kubernetes** 這個名字源於希臘語，意為“舵手”或“飛行員”。k8s 這個縮寫是因為 k 和 s 之間有八個字元的關係。
Google 在 2014 年開源了 Kubernetes 專案。
Kubernetes 建立在[Google 大規模執行生產工作負載十幾年經驗](https://research.google/pubs/pub43438)的基礎上，
結合了社群中最優秀的想法和實踐。

<!--
## Going back in time
Let's take a look at why Kubernetes is so useful by going back in time.
-->
## 時光回溯    {#going-back-in-time}

讓我們回顧一下為何 Kubernetes 能夠裨益四方。

<!--
![Deployment evolution](/images/docs/Container_Evolution.svg)
-->
![部署演進](/images/docs/Container_Evolution.svg)

<!--
**Traditional deployment era:**

Early on, organizations ran applications on physical servers. There was no way to define resource boundaries for applications in a physical server, and this caused resource allocation issues. For example, if multiple applications run on a physical server, there can be instances where one application would take up most of the resources, and as a result, the other applications would underperform. A solution for this would be to run each application on a different physical server. But this did not scale as resources were underutilized, and it was expensive for organizations to maintain many physical servers.
-->
**傳統部署時代：**

早期，各機構是在物理伺服器上執行應用程式。
由於無法限制在物理伺服器中執行的應用程式資源使用，因此會導致資源分配問題。
例如，如果在物理伺服器上執行多個應用程式，
則可能會出現一個應用程式佔用大部分資源的情況，而導致其他應用程式的效能下降。
一種解決方案是將每個應用程式都執行在不同的物理伺服器上，
但是當某個應用程式資源利用率不高時，剩餘資源無法被分配給其他應用程式，
而且維護許多物理伺服器的成本很高。

<!--
**Virtualized deployment era:**
As a solution, virtualization was introduced. It allows you to run multiple Virtual Machines (VMs) on a single physical server's CPU. Virtualization allows applications to be isolated between VMs and provides a level of security as the information of one application cannot be freely accessed by another application.
-->
**虛擬化部署時代：**

因此，虛擬化技術被引入了。虛擬化技術允許你在單個物理伺服器的 CPU 上執行多臺虛擬機器（VM）。
虛擬化能使應用程式在不同 VM 之間被彼此隔離，且能提供一定程度的安全性，
因為一個應用程式的資訊不能被另一應用程式隨意訪問。

<!--
Virtualization allows better utilization of resources in a physical server and allows better scalability because an application can be added or updated easily, reduces hardware costs, and much more.

Each VM is a full machine running all the components, including its own operating system, on top of the virtualized hardware.
-->
虛擬化技術能夠更好地利用物理伺服器的資源，並且因為可輕鬆地新增或更新應用程式，
而因此可以具有更高的可伸縮性，以及降低硬體成本等等的好處。

每個 VM 是一臺完整的計算機，在虛擬化硬體之上執行所有元件，包括其自己的作業系統（OS）。

<!--
**Container deployment era:**
Containers are similar to VMs, but they have relaxed isolation properties to share the Operating System (OS) among the applications. Therefore, containers are considered lightweight. Similar to a VM, a container has its own filesystem, CPU, memory, process space, and more. As they are decoupled from the underlying infrastructure, they are portable across clouds and OS distributions.
-->
**容器部署時代：**

容器類似於 VM，但是更寬鬆的隔離特性，使容器之間可以共享作業系統（OS）。
因此，容器比起 VM 被認為是更輕量級的。且與 VM 類似，每個容器都具有自己的檔案系統、CPU、記憶體、程序空間等。
由於它們與基礎架構分離，因此可以跨雲和 OS 發行版本進行移植。

<!--
Containers are becoming popular because they have many benefits. Some of the container benefits are listed below:
-->
容器因具有許多優勢而變得流行起來。下面列出的是容器的一些好處：

<!--
* Agile application creation and deployment: increased ease and efficiency of container image creation compared to VM image use.
* Continuous development, integration, and deployment: provides for reliable and frequent container image build and deployment with quick and easy rollbacks (due to image immutability).
* Dev and Ops separation of concerns: create application container images at build/release time rather than deployment time, thereby decoupling applications from infrastructure.
* Observability: not only surfaces OS-level information and metrics, but also application health and other signals.
* Environmental consistency across development, testing, and production: Runs the same on a laptop as it does in the cloud.
* Cloud and OS distribution portability: Runs on Ubuntu, RHEL, CoreOS, on-prem, Google Kubernetes Engine, and anywhere else.
* Application-centric management: Raises the level of abstraction from running an OS on virtual hardware to running an application on an OS using logical resources.
* Loosely coupled, distributed, elastic, liberated micro-services: applications are broken into smaller, independent pieces and can be deployed and managed dynamically – not a monolithic stack running on one big single-purpose machine.
* Resource isolation: predictable application performance.
* Resource utilization: high efficiency and density.
-->
* 敏捷應用程式的建立和部署：與使用 VM 映象相比，提高了容器映象建立的簡便性和效率。
* 持續開發、整合和部署：透過快速簡單的回滾（由於映象不可變性），
  提供可靠且頻繁的容器映象構建和部署。
* 關注開發與運維的分離：在構建、釋出時建立應用程式容器映象，而不是在部署時，
  從而將應用程式與基礎架構分離。
* 可觀察性：不僅可以顯示 OS 級別的資訊和指標，還可以顯示應用程式的執行狀況和其他指標訊號。
* 跨開發、測試和生產的環境一致性：在筆記本計算機上也可以和在雲中執行一樣的應用程式。
* 跨雲和作業系統發行版本的可移植性：可在 Ubuntu、RHEL、CoreOS、本地、
  Google Kubernetes Engine 和其他任何地方執行。
* 以應用程式為中心的管理：提高抽象級別，從在虛擬硬體上執行 OS 到使用邏輯資源在 OS 上執行應用程式。
* 鬆散耦合、分散式、彈性、解放的微服務：應用程式被分解成較小的獨立部分，
  並且可以動態部署和管理 - 而不是在一臺大型單機上整體執行。
* 資源隔離：可預測的應用程式效能。
* 資源利用：高效率和高密度。

<!--
## Why you need Kubernetes and what can it do
-->
## 為什麼需要 Kubernetes，它能做什麼？   {#why-you-need-kubernetes-and-what-can-it-do}

<!--
Containers are a good way to bundle and run your applications. In a production environment, you need to manage the containers that run the applications and ensure that there is no downtime. For example, if a container goes down, another container needs to start. Wouldn't it be easier if this behavior was handled by a system?
-->
容器是打包和執行應用程式的好方式。在生產環境中，
你需要管理執行著應用程式的容器，並確保服務不會下線。
例如，如果一個容器發生故障，則你需要啟動另一個容器。
如果此行為交由給系統處理，是不是會更容易一些？

<!--
That's how Kubernetes comes to the rescue! Kubernetes provides you with a framework to run distributed systems resiliently. It takes care of your scaling requirements, failover, deployment patterns, and more. For example, Kubernetes can easily manage a canary deployment for your system.
-->
這就是 Kubernetes 要來做的事情！
Kubernetes 為你提供了一個可彈性執行分散式系統的框架。
Kubernetes 會滿足你的擴充套件要求、故障轉移、部署模式等。
例如，Kubernetes 可以輕鬆管理系統的 Canary 部署。

<!--
Kubernetes provides you with:
-->
Kubernetes 為你提供：

<!--
* **Service discovery and load balancing**
Kubernetes can expose a container using the DNS name or using their own IP address. If traffic to a container is high, Kubernetes is able to load balance and distribute the network traffic so that the deployment is stable.
-->
* **服務發現和負載均衡**

  Kubernetes 可以使用 DNS 名稱或自己的 IP 地址來曝露容器。
  如果進入容器的流量很大，
  Kubernetes 可以負載均衡並分配網路流量，從而使部署穩定。

<!--
* **Storage orchestration**
Kubernetes allows you to automatically mount a storage system of your choice, such as local storages, public cloud providers, and more.
-->
* **儲存編排**

  Kubernetes 允許你自動掛載你選擇的儲存系統，例如本地儲存、公共雲提供商等。

<!--
* **Automated rollouts and rollbacks**
You can describe the desired state for your deployed containers using Kubernetes, and it can change the actual state to the desired state at a controlled rate. For example, you can automate Kubernetes to create new containers for your deployment, remove existing containers and adopt all their resources to the new container.
-->
* **自動部署和回滾**

  你可以使用 Kubernetes 描述已部署容器的所需狀態，
  它可以以受控的速率將實際狀態更改為期望狀態。
  例如，你可以自動化 Kubernetes 來為你的部署建立新容器，
  刪除現有容器並將它們的所有資源用於新容器。

<!--
* **Automatic bin packing**
Kubernetes allows you to specify how much CPU and memory (RAM) each container needs. When containers have resource requests specified, Kubernetes can make better decisions to manage the resources for containers.
-->
* **自動完成裝箱計算**

  Kubernetes 允許你指定每個容器所需 CPU 和記憶體（RAM）。
  當容器指定了資源請求時，Kubernetes 可以做出更好的決策來為容器分配資源。

<!--
* **Self-healing**
Kubernetes restarts containers that fail, replaces containers, kills containers that don’t respond to your user-defined health check, and doesn’t advertise them to clients until they are ready to serve.
-->
* **自我修復**

  Kubernetes 將重新啟動失敗的容器、替換容器、殺死不響應使用者定義的執行狀況檢查的容器，
  並且在準備好服務之前不將其通告給客戶端。

<!--
* **Secret and configuration management**
Kubernetes lets you store and manage sensitive information, such as passwords, OAuth tokens, and ssh keys. You can deploy and update secrets and application configuration without rebuilding your container images, and without exposing secrets in your stack configuration.
-->
* **金鑰與配置管理**

  Kubernetes 允許你儲存和管理敏感資訊，例如密碼、OAuth 令牌和 ssh 金鑰。
  你可以在不重建容器映象的情況下部署和更新金鑰和應用程式配置，也無需在堆疊配置中暴露金鑰。

<!--
## What Kubernetes is not
-->
## Kubernetes 不是什麼   {#what-kubernetes-is-not}

<!--
Kubernetes is not a traditional, all-inclusive PaaS (Platform as a Service) system. Since Kubernetes operates at the container level rather than at the hardware level, it provides some generally applicable features common to PaaS offerings, such as deployment, scaling, load balancing, logging, and monitoring. However, Kubernetes is not monolithic, and these default solutions are optional and pluggable. Kubernetes provides the building blocks for building developer platforms, but preserves user choice and flexibility where it is important.
-->
Kubernetes 不是傳統的、包羅永珍的 PaaS（平臺即服務）系統。
由於 Kubernetes 是在容器級別執行，而非在硬體級別，
它提供了 PaaS 產品共有的一些普遍適用的功能，
例如部署、擴充套件、負載均衡、日誌記錄和監視。
但是，Kubernetes 不是單體式（monolithic）系統，那些預設解決方案都是可選、可插拔的。
Kubernetes 為構建開發人員平臺提供了基礎，但是在重要的地方保留了使用者選擇權，能有更高的靈活性。

<!--
Kubernetes:
-->
Kubernetes：

<!--
* Does not limit the types of applications supported. Kubernetes aims to support an extremely diverse variety of workloads, including stateless, stateful, and data-processing workloads. If an application can run in a container, it should run great on Kubernetes.
* Does not deploy source code and does not build your application. Continuous Integration, Delivery, and Deployment (CI/CD) workflows are determined by organization cultures and preferences as well as technical requirements.
* Does not provide application-level services, such as middleware (for example, message buses), data-processing frameworks (for example, Spark), databases (for example, mysql), caches, nor cluster storage systems (for example, Ceph) as built-in services. Such components can run on Kubernetes, and/or can be accessed by applications running on Kubernetes through portable mechanisms, such as the Open Service Broker.
-->
* 不限制支援的應用程式型別。
  Kubernetes 旨在支援極其多種多樣的工作負載，包括無狀態、有狀態和資料處理工作負載。
  如果應用程式可以在容器中執行，那麼它應該可以在 Kubernetes 上很好地執行。
* 不部署原始碼，也不構建你的應用程式。
  持續整合（CI）、交付和部署（CI/CD）工作流取決於組織的文化和偏好以及技術要求。
* 不提供應用程式級別的服務作為內建服務，例如中介軟體（例如訊息中介軟體）、
  資料處理框架（例如 Spark）、資料庫（例如 MySQL）、快取、叢集儲存系統
  （例如 Ceph）。這樣的元件可以在 Kubernetes 上執行，並且/或者可以由執行在
  Kubernetes 上的應用程式透過可移植機制
  （例如[開放服務代理](https://openservicebrokerapi.org/)）來訪問。
<!--
* Does not dictate logging, monitoring, or alerting solutions. It provides some integrations as proof of concept, and mechanisms to collect and export metrics.
* Does not provide nor mandate a configuration language/system (for example, jsonnet). It provides a declarative API that may be targeted by arbitrary forms of declarative specifications.
* Does not provide nor adopt any comprehensive machine configuration, maintenance, management, or self-healing systems.
* Additionally, Kubernetes is not a mere orchestration system. In fact, it eliminates the need for orchestration. The technical definition of orchestration is execution of a defined workflow: first do A, then B, then C. In contrast, Kubernetes comprises a set of independent, composable control processes that continuously drive the current state towards the provided desired state. It shouldn’t matter how you get from A to C. Centralized control is also not required. This results in a system that is easier to use and more powerful, robust, resilient, and extensible.
-->
* 不是日誌記錄、監視或警報的解決方案。
  它集成了一些功能作為概念證明，並提供了收集和匯出指標的機制。
* 不提供也不要求配置用的語言、系統（例如 jsonnet），它提供了宣告性 API，
  該宣告性 API 可以由任意形式的宣告性規範所構成。
* 不提供也不採用任何全面的機器配置、維護、管理或自我修復系統。
* 此外，Kubernetes 不僅僅是一個編排系統，實際上它消除了編排的需要。
  編排的技術定義是執行已定義的工作流程：首先執行 A，然後執行 B，再執行 C。
  而 Kubernetes 包含了一組獨立可組合的控制過程，
  可以連續地將當前狀態驅動到所提供的預期狀態。
  你不需要在乎如何從 A 移動到 C，也不需要集中控制，這使得系統更易於使用
  且功能更強大、系統更健壯，更為彈性和可擴充套件。

## {{% heading "whatsnext" %}}

<!--
*   Take a look at the [Kubernetes Components](/docs/concepts/overview/components/)
*   Ready to [Get Started](/docs/setup/)?
-->
* 查閱[Kubernetes 元件](/zh-cn/docs/concepts/overview/components/)
* 開始[Kubernetes 的建置](/zh-cn/docs/setup/)吧！
