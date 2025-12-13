---
layout: blog
title: "Kubernetes 多容器 Pod：概述"
date: 2025-04-22
draft: false
slug: multi-container-pods-overview
author: Agata Skorupka (The Scale Factory)
translator: Xin Li (Daocloud)
---
<!--
layout: blog
title: "Kubernetes Multicontainer Pods: An Overview"
date: 2025-04-22
draft: false
slug: multi-container-pods-overview
author: Agata Skorupka (The Scale Factory)
-->

<!--
As cloud-native architectures continue to evolve, Kubernetes has become the go-to platform for deploying complex, distributed systems. One of the most powerful yet nuanced design patterns in this ecosystem is the sidecar pattern—a technique that allows developers to extend application functionality without diving deep into source code.
-->
隨着雲原生架構的不斷演進，Kubernetes 已成爲部署複雜分佈式系統的首選平臺。
在這個生態系統中，最強大卻又微妙的設計模式之一是邊車（Sidecar）
模式 —— 一種允許開發者擴展應用功能而不深入源代碼的技術。

<!--
## The origins of the sidecar pattern

Think of a sidecar like a trusty companion motorcycle attachment. Historically, IT infrastructures have always used auxiliary services to handle critical tasks. Before containers, we relied on background processes and helper daemons to manage logging, monitoring, and networking. The microservices revolution transformed this approach, making sidecars a structured and intentional architectural choice.
With the rise of microservices, the sidecar pattern became more clearly defined, allowing developers to offload specific responsibilities from the main service without altering its code. Service meshes like Istio and Linkerd have popularized sidecar proxies, demonstrating how these companion containers can elegantly handle observability, security, and traffic management in distributed systems.
-->
## 邊車模式的起源   {#the-origins-of-the-sidecar-pattern}

想象一下邊車就像一個可靠的伴侶摩托車附件。歷史上，IT 基礎設施總是使用輔助服務來處理關鍵任務。
在容器出現之前，我們依賴後臺進程和輔助守護程式來管理日誌記錄、監控和網路。
微服務革命改變了這種方法，使邊車成爲一種結構化且有意圖的架構選擇。
隨着微服務的興起，邊車模式變得更加明確，允許開發者從主服務中卸載特定職責而不改變其代碼。
諸如 Istio 和 Linkerd 之類的服務網格普及了邊車代理，
展示了這些伴侶容器如何優雅地處理分佈式系統中的可觀察性、安全性和流量管理。

<!--
## Kubernetes implementation

In Kubernetes, [sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/) operate within
the same Pod as the main application, enabling communication and resource sharing.
Does this sound just like defining multiple containers along each other inside the Pod? It actually does, and
this is how sidecar containers had to be implemented before Kubernetes v1.29.0, which introduced
native support for sidecars.
Sidecar containers  can now be defined within a Pod manifest using the `spec.initContainers` field. What makes
it a sidecar container is that you specify it with `restartPolicy: Always`. You can see an example of this below, which is a partial snippet of the full Kubernetes manifest:
-->
## Kubernetes 實現   {#kubernetes-implementation}

在 Kubernetes 中，[邊車容器](/zh-cn/docs/concepts/workloads/pods/sidecar-containers/)與主應用位於同一個
Pod 內，實現通信和資源共享。這聽起來就像是在 Pod 內一起定義多個容器一樣？實際上確實如此，
這也是在 Kubernetes v1.29.0 引入對邊車的本地支持之前實現邊車容器的唯一方式。
現在，邊車容器可以使用 `spec.initContainers` 字段在 Pod 清單中定義。
所指定容器之所以變成了邊車容器，是因爲你在規約中設置了 `restartPolicy: Always`
你可以在下面看到一個示例，這是完整 Kubernetes 清單的一個片段：

```yaml
initContainers:
  - name: logshipper
    image: alpine:latest
    restartPolicy: Always
  command: ['sh', '-c', 'tail -F /opt/logs.txt']
    volumeMounts:
    - name: data
        mountPath: /opt
```

<!--
That field name, `spec.initContainers` may sound confusing. How come when you want to define a sidecar container, you have to put an entry in the `spec.initContainers` array? `spec.initContainers` are run to completion just before main application starts, so they’re one-off, whereas sidecars often run in parallel to the main app container. It’s the `spec.initContainers` with `restartPolicy:Always` which differs classic [init containers](/docs/concepts/workloads/pods/init-containers/) from Kubernetes-native sidecar containers and ensures they are always up. 
-->
該字段名稱 `spec.initContainers` 可能聽起來令人困惑。爲何在定義邊車容器時，必須在
`spec.initContainers` 數組中添加條目？`spec.initContainers`
在主應用啓動前運行至完成，因此它們是一次性的，而邊車容器通常與主應用容器並行運行。
正是通過帶有 `restartPolicy:Always` 的 `spec.initContainers` 區分了經典的
[Init 容器](/zh-cn/docs/concepts/workloads/pods/init-containers/)和
Kubernetes 原生的邊車容器，並確保它們始終保持運行。

<!--
## When to embrace (or avoid) sidecars

While the sidecar pattern can be useful in many cases, it is generally not the preferred approach unless the use case justifies it. Adding a sidecar increases complexity, resource consumption, and potential network latency. Instead, simpler alternatives such as built-in libraries or shared infrastructure should be considered first.
-->
## 何時採用（或避免使用）邊車   {#when-to-embrace-or-avoid-sidecars}

雖然邊車模式在許多情況下非常有用，但除非使用場景證明其合理性，
否則通常不推薦優先採用這種方法。添加邊車會增加複雜性、
資源消耗以及可能的網路延遲。因此，應首先考慮更簡單的替代方案，
例如內置庫或共享基礎設施。

<!--
**Deploy a sidecar when:**

1. You need to extend application functionality without touching the original code
1. Implementing cross-cutting concerns like logging, monitoring or security
1. Working with legacy applications requiring modern networking capabilities
1. Designing microservices that demand independent scaling and updates
-->
**在以下情況部署邊車：**

1. 你需要擴展應用功能，而無需修改原始代碼
1. 實現日誌記錄、監控或安全等跨領域關注點
1. 處理需要現代網路功能的遺留應用
1. 設計需要獨立擴展和更新的微服務

<!--
**Proceed with caution if:**

1. Resource efficiency is your primary concern
1. Minimal network latency is critical
1. Simpler alternatives exist
1. You want to minimize troubleshooting complexity
-->
**謹慎行事，如果：**

1. 資源效率是你的首要考慮
1. 最小網路延遲至關重要
1. 存在更簡單的替代方案
1. 你希望最小化故障排查的複雜性

<!--
## Four essential multi-container patterns

### Init container pattern

The **Init container** pattern is used to execute (often critical) setup tasks before the main application container starts. Unlike regular containers, init containers run to completion and then terminate, ensuring that preconditions for the main application are met.
-->
## 四個基本的多容器模式   {#four-essential-multi-container-patterns}

### Init 容器模式   {#init-container-pattern}

**Init 容器**模式用於在主應用容器啓動之前執行（通常是關鍵的）設置任務。
與常規容器不同，Init 容器會運行至完成然後終止，確保滿足主應用的前提條件。

<!--
**Ideal for:**

1. Preparing configurations
1. Loading secrets
1. Verifying dependency availability
1. Running database migrations

The init container ensures your application starts in a predictable, controlled environment without code modifications.
-->
**適合於：**

1. 準備設定
1. 加載密鑰
1. 驗證依賴項的可用性
1. 運行資料庫遷移

Init 容器確保你的應用在一個可預測、受控的環境中啓動，而無需修改代碼。

<!--
### Ambassador pattern

An ambassador container provides Pod-local helper services that expose a simple way to access a network service. Commonly, ambassador containers send network requests on behalf of a an application container and
take care of challenges such as service discovery, peer identity verification, or encryption in transit.
-->
### Ambassador 模式   {#ambassador-pattern}

一個大使（Ambassador）容器提供了 Pod 本地的輔助服務，這些服務暴露了一種訪問網路服務的簡單方式。
通常，Ambassador 容器代表應用容器發送網路請求，並處理諸如服務發現、對等身份驗證或傳輸中加密等挑戰。

<!--
**Perfect when you need to:**

1. Offload client connectivity concerns
1. Implement language-agnostic networking features
1. Add security layers like TLS
1. Create robust circuit breakers and retry mechanisms
-->
**能夠完美地處理以下需求：**

1. 卸載客戶端連接問題
1. 實現語言無關的網路功能
1. 添加如 TLS 的安全層
1. 創建強大的斷路器和重試機制

<!--
### Configuration helper

A _configuration helper_ sidecar provides configuration updates to an application dynamically, ensuring it always has access to the latest settings without disrupting the service. Often the helper needs to provide an initial
configuration before the application would be able to start successfully.
-->
### 設定助手   {#configuration-helper}

一個**設定助手**邊車容器動態地嚮應用提供設定更新，
確保它始終可以訪問最新的設置而不會中斷服務。
通常，助手需要在應用能夠成功啓動之前提供初始設定。

<!--
**Use cases:**

1. Fetching environment variables and secrets
1. Polling configuration changes
1. Decoupling configuration management from application logic
-->
**使用場景：**

1. 獲取環境變量和密鑰
1. 輪詢設定更改
1. 將設定管理與應用邏輯解耦

<!--
### Adapter pattern

An _adapter_ (or sometimes _façade_) container enables interoperability between the main application container and external services. It does this by translating data formats, protocols, or APIs.
-->
### 適配器模式   {#adapter-pattern}

一個**適配器（adapter）**（有時也稱爲**切面（façade）**）容器使主應用容器與外部服務之間能夠互操作。
它通過轉換資料格式、協議或 API 來實現這一點。

<!--
**Strengths:**

1. Transforming legacy data formats
1. Bridging communication protocols
1. Facilitating integration between mismatched services
-->
**優點：**

1. 轉換遺留資料格式
1. 搭建通信協議橋樑
1. 幫助不匹配服務之間的集成

<!--
## Wrap-up

While sidecar patterns offer tremendous flexibility, they're not a silver bullet. Each added sidecar introduces complexity, consumes resources, and potentially increases operational overhead. Always evaluate simpler alternatives first.
The key is strategic implementation: use sidecars as precision tools to solve specific architectural challenges, not as a default approach. When used correctly, they can improve security, networking, and configuration management in containerized environments.
Choose wisely, implement carefully, and let your sidecars elevate your container ecosystem.
-->
## 總結   {#wrap-up}

儘管邊車模式提供了巨大的靈活性，但它不是萬能的。所添加的每個邊車容器都會引入複雜性、
消耗資源，並可能增加操作負擔。始終首先評估更簡單的替代方案。
關鍵在於戰略性實施：將邊車用作解決特定架構挑戰的精準工具，而不是預設選擇。
正確使用時，它們可以提升容器化環境中的安全性、網路和設定管理。
明智地選擇，謹慎地實施，讓你的邊車提升你的容器生態系統。
