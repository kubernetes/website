---
layout: blog
title: "7 個常見的 Kubernetes 坑（以及我是如何避開的）"
date: 2025-10-20T08:30:00-07:00
slug: seven-kubernetes-pitfalls-and-how-to-avoid
author: >
  Abdelkoddous Lhajouji
translator: >
  [Wenjun Lou](https://github.com/Eason1118)
---
<!--
layout: blog
title: "7 Common Kubernetes Pitfalls (and How I Learned to Avoid Them)"
date: 2025-10-20T08:30:00-07:00
slug: seven-kubernetes-pitfalls-and-how-to-avoid
author: >
  Abdelkoddous Lhajouji
-->

<!--
It's no secret that Kubernetes can be both powerful and frustrating at times. When I first started dabbling with container orchestration, I made more than my fair share of mistakes enough to compile a whole list of pitfalls. In this post, I want to walk through seven big gotchas I've encountered (or seen others run into) and share some tips on how to avoid them. Whether you're just kicking the tires on Kubernetes or already managing production clusters, I hope these insights help you steer clear of a little extra stress.
-->
Kubernetes 功能強大，但有時也會令人沮喪，這已不是什麼祕密。
當我剛開始接觸容器編排時，我犯了不少錯誤，足以列出一整張誤區清單。
在這篇文章中，我想分享我遇到的（或看到其他人遇到的）七個常見誤區，
以及如何避免它們的建議。
無論你只是剛開始嘗試 Kubernetes，還是已經在管理生產叢集，
我希望這些見解能幫助你避免一些額外的麻煩。

<!--
## 1. Skipping resource requests and limits
-->
## 1. 忽略資源 requests 和 limits {#1-skipping-resource-requests-and-limits}

<!--
**The pitfall**: Not specifying CPU and memory requirements in Pod specifications. This typically happens because Kubernetes does not require these fields, and workloads can often start and run without them—making the omission easy to overlook in early configurations or during rapid deployment cycles.
-->
**常見誤區**：在 Pod 規約中未指定 CPU 和內存需求。
這種情況經常發生，原因是 Kubernetes 不要求這些字段必須設置，
工作負載通常可以在沒有這些字段的情況下啓動和運行——
這使得在早期設定或快速部署週期中很容易忽略這些設置。

<!--
**Context**:
In Kubernetes, resource requests and limits are critical for efficient cluster management. Resource requests ensure that the scheduler reserves the appropriate amount of CPU and memory for each pod, guaranteeing that it has the necessary resources to operate. Resource limits cap the amount of CPU and memory a pod can use, preventing any single pod from consuming excessive resources and potentially starving other pods.
When resource requests and limits are not set:
-->
**背景**：
在 Kubernetes 中，資源請求和限制對於高效的叢集管理至關重要。
資源請求確保調度器爲每個 Pod 預留適當數量的 CPU 和內存，
保證它有必要的資源來運行。
資源限制限制了 Pod 可以使用的 CPU 和內存數量，
防止任何單個 Pod 消耗過多資源而可能導致其他 Pod 資源不足。
當未設置資源請求和限制時：

<!--
 1. Resource Starvation: Pods may get insufficient resources, leading to degraded performance or failures. This is because Kubernetes schedules pods based on these requests. Without them, the scheduler might place too many pods on a single node, leading to resource contention and performance bottlenecks.
 2. Resource Hoarding: Conversely, without limits, a pod might consume more than its fair share of resources, impacting the performance and stability of other pods on the same node. This can lead to issues such as other pods getting evicted or killed by the Out-Of-Memory (OOM) killer due to lack of available memory.
-->
1. **資源不足**：Pod 可能未獲得足夠的資源，導致性能下降或運行失敗。
   這是因爲 Kubernetes 根據這些請求來調度 Pod。
   沒有這些請求，調度器可能會在單個節點上放置過多的 Pod，導致資源競爭和性能瓶頸。
2. **資源囤積**：相反，沒有設置限制值時，一個 Pod 可能會消耗過多的資源，
   影響同一節點上其他 Pod 的性能和穩定性。
   這可能導致其他 Pod 因內存不足而被驅逐或被 OOM（Out-Of-Memory）強制終止。

<!--
### How to avoid it:
- Start with modest `requests` (for example `100m` CPU, `128Mi` memory) and see how your app behaves.
- Monitor real-world usage and refine your values; the [HorizontalPodAutoscaler](/docs/tasks/run-application/horizontal-pod-autoscale/) can help automate scaling based on metrics.
- Keep an eye on `kubectl top pods` or your logging/monitoring tool to confirm you're not over- or under-provisioning.
-->
### 如何避免：

- 從適度的 `requests` 開始（例如 `100m` CPU、`128Mi` 內存），觀察應用的行爲。
- 監控實際使用情況並優化你的值；[Pod 水平自動擴縮](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/) 
  可以幫助基於指標自動擴縮容。
- 關注 `kubectl top pods` 或你的日誌/監控工具，
  確認你沒有過多或過少地設定資源。

<!--
**My reality check**: Early on, I never thought about memory limits. Things seemed fine on my local cluster. Then, on a larger environment, Pods got *OOMKilled* left and right. Lesson learned.
For detailed instructions on configuring resource requests and limits for your containers, please refer to [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)
(part of the official Kubernetes documentation).
-->
**我的經驗教訓**：早期，我從未考慮過內存限制。
在我的本地叢集上一切看起來都很好。
後來，在更大的環境中，Pod 被 **OOMKilled**（內存不足終止）的情況比比皆是。
教訓深刻。有關爲容器設定資源請求和限制的詳細說明，
請參閱[爲容器和 Pod 分配內存資源](/zh-cn/docs/tasks/configure-pod-container/assign-memory-resource/)
（Kubernetes 官方文檔的一部分）。

<!--
## 2. Underestimating liveness and readiness probes
-->
## 2. 低估了存活探針和就緒態探針的重要性 {#2-underestimating-liveness-and-readiness-probes}

<!--
**The pitfall**: Deploying containers without explicitly defining how Kubernetes should check their health or readiness. This tends to happen because Kubernetes will consider a container "running" as long as the process inside hasn't exited. Without additional signals, Kubernetes assumes the workload is functioning—even if the application inside is unresponsive, initializing, or stuck.
-->
**常見誤區**：部署容器時未明確定義 Kubernetes 應如何檢查其健康狀態或就緒狀態。
這通常發生在 Kubernetes 只要容器內的進程未退出就認爲容器“正在運行”的情況下。
在沒有額外的信號的情況下，Kubernetes 會假設工作負載正在運行——
即使內部的應用無響應、正在初始化或卡住。

<!--
**Context**:  
Liveness, readiness, and startup probes are mechanisms Kubernetes uses to monitor container health and availability. 

- **Liveness probes** determine if the application is still alive. If a liveness check fails, the container is restarted.
- **Readiness probes** control whether a container is ready to serve traffic. Until the readiness probe passes, the container is removed from Service endpoints.
- **Startup probes** help distinguish between long startup times and actual failures.
-->
**背景**：
存活態、就緒態和啓動探針是 Kubernetes 用來監控容器健康狀態和可用性的機制。

- **存活態探針**確定應用是否仍然存活。如果存活態檢查失敗，容器會被重啓。
- **就緒態探針**控制容器是否準備好接收流量。
  在就緒態探針通過之前，容器會從 Service 端點中移除。
- **啓動探針**幫助區分長時間啓動和實際故障。

<!--
### How to avoid it:
- Add a simple HTTP `livenessProbe` to check a health endpoint (for example `/healthz`) so Kubernetes can restart a hung container.
- Use a `readinessProbe` to ensure traffic doesn't reach your app until it's warmed up.
- Keep probes simple. Overly complex checks can create false alarms and unnecessary restarts.
-->
### 如何避免：

- 添加一個簡單的 HTTP `livenessProbe` 來檢查健康端點（例如 `/healthz`），
  以便 Kubernetes 可以重啓掛起的容器。
- 使用 `readinessProbe` 確保在應用預熱完成之前流量不會到達應用。
- 保持探針簡單。過於複雜的檢查可能會產生誤報和不必要的重啓。

<!--
**My reality check**: I once forgot a readiness probe for a web service that took a while to load. Users hit it prematurely, got weird timeouts, and I spent hours scratching my head. A 3-line readiness probe would have saved the day.
-->
**我的經驗教訓**：我曾經忘記爲一個需要一段時間才能加載的 Web 服務設置就緒態探針。
使用者過早訪問了它，遇到了奇怪的超時，我花了幾個小時才找到問題。
一個 3 行的就緒態探針就能解決這個問題。

<!--
For comprehensive instructions on configuring liveness, readiness, and startup probes for containers, please refer to [Configure Liveness, Readiness and Startup Probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)
in the official Kubernetes documentation.
-->
有關爲容器設定存活態、就緒態和啓動探針的全面說明，
請參閱 Kubernetes 官方文檔中的[設定存活、就緒和啓動探針](/zh-cn/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)。

<!--
## 3. "We'll just look at container logs" (famous last words)
-->
## 3. "我們只需要查看容器日誌"（著名的遺言） {#3-well-just-look-at-container-logs-famous-last-words}

<!--
**The pitfall**: Relying solely on container logs retrieved via `kubectl logs`. This often happens because the command is quick and convenient, and in many setups, logs appear accessible during development or early troubleshooting. However, `kubectl logs` only retrieves logs from currently running or recently terminated containers, and those logs are stored on the node's local disk. As soon as the container is deleted, evicted, or the node is restarted, the log files may be rotated out or permanently lost.
-->
**常見誤區**：僅依賴通過 `kubectl logs` 檢索的容器日誌。
這種想法背後的原因通常是因爲查看日誌的命令既快速又便捷，
在許多叢集環境中，日誌在開發或早期故障排除時似乎可以訪問。
然而，`kubectl logs` 只能從當前正在運行或最近終止的容器中檢索日誌，
這些日誌存儲在節點的本地磁盤上。
一旦容器被刪除、驅逐或節點重啓，日誌文件可能會被輪換掉或永久丟失。

<!--
### How to avoid it:
- **Centralize logs** using CNCF tools like [Fluentd](https://kubernetes.io/docs/concepts/cluster-administration/logging/#sidecar-container-with-a-logging-agent) or [Fluent Bit](https://fluentbit.io/) to aggregate output from all Pods.
- **Adopt OpenTelemetry** for a unified view of logs, metrics, and (if needed) traces. This lets you spot correlations between infrastructure events and app-level behavior.
- **Pair logs with Prometheus metrics** to track cluster-level data alongside application logs. If you need distributed tracing, consider CNCF projects like [Jaeger](https://www.jaegertracing.io/).
-->
### 如何避免：

- **集中化日誌**：使用 CNCF 工具如 [Fluentd](/zh-cn/docs/concepts/cluster-administration/logging/#sidecar-container-with-a-logging-agent)
  或 [Fluent Bit](https://fluentbit.io/) 來聚合所有 Pod 的輸出。
- **採用 OpenTelemetry**：用於構造日誌、指標和（如果需要）追蹤的統一視圖。
  這讓你能夠發現基礎設施事件和應用級行爲之間的關聯。
- **將日誌與 Prometheus 指標對應起來**：與應用日誌同時跟蹤叢集級數據。
  如果你需要分佈式追蹤，可以考慮 [Jaeger](https://www.jaegertracing.io/) 這類 CNCF 項目。

<!--
**My reality check**: The first time I lost Pod logs to a quick restart, I realized how flimsy "kubectl logs" can be on its own. Since then, I've set up a proper pipeline for every cluster to avoid missing vital clues.
-->
**我的經驗教訓**：第一次因爲快速重啓而丟失 Pod 日誌時，
我意識到僅依賴 "kubectl logs" 是多麼不可靠。
從那時起，我爲每個叢集都搭建了完整的日誌採集管道，
以避免錯過任何關鍵線索。

<!--
## 4. Treating dev and prod exactly the same
-->
## 4. 將開發環境和生產環境視爲完全相同 {#4-treating-dev-and-prod-exactly-the-same}

<!--
**The pitfall**: Deploying the same Kubernetes manifests with identical settings across development, staging, and production environments. This often occurs when teams aim for consistency and reuse, but overlook that environment-specific factors—such as traffic patterns, resource availability, scaling needs, or access control—can differ significantly. Without customization, configurations optimized for one environment may cause instability, poor performance, or security gaps in another.
-->
**常見誤區**：在開發、預發佈和生產環境中使用相同的 Kubernetes 清單和相同的設置進行部署。
在團隊追求一致性和複用，
但忽略了環境特定的因素——如流量模式、資源可用性、擴縮容需求或訪問控制——
可能顯著不同時，常會發生這種情況。
如果略過定製這一步驟，針對一個環境優化的設定可能會導致負載在另一個環境下不穩定、
性能差或暴露安全漏洞。

<!--
### How to avoid it:
- Use environment overlays or [kustomize](https://kustomize.io/) to maintain a shared base while customizing resource requests, replicas, or config for each environment.
- Extract environment-specific configuration into ConfigMaps and / or Secrets. You can use a specialized tool such as [Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets) to manage confidential data.
- Plan for scale in production. Your dev cluster can probably get away with minimal CPU/memory, but prod might need significantly more.
-->
### 如何避免：

- 使用環境覆蓋層或 [kustomize](https://kustomize.io/) 來維護共享基礎，
  同時爲每個環境定製資源請求、副本數或設定。
- 將環境特定的設定提取到 ConfigMap 和/或 Secret 中。
  你可以使用專門的工具如 [Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets) 來管理機密數據。
- 爲生產環境中的擴縮需求做規劃。
  你的開發叢集可能只需要最少的 CPU/內存，但生產環境可能需要顯著更多。

<!--
**My reality check**: One time, I scaled up `replicaCount` from 2 to 10 in a tiny dev environment just to "test." I promptly ran out of resources and spent half a day cleaning up the aftermath. Oops.
-->
**我的經驗教訓**：有一次，
我在一個很小的開發環境中將 `replicaCount` 從 2 擴展到 10，只是爲了"測試"。
我立即耗盡了資源，花了半天時間清理後果。

<!--
## 5. Leaving old stuff floating around
-->
## 5. 遺留未清理的舊資源 {#5-leaving-old-stuff-floating-around}

<!--
**The pitfall**: Leaving unused or outdated resources—such as Deployments, Services, ConfigMaps, or PersistentVolumeClaims—running in the cluster. This often happens because Kubernetes does not automatically remove resources unless explicitly instructed, and there is no built-in mechanism to track ownership or expiration. Over time, these forgotten objects can accumulate, consuming cluster resources, increasing cloud costs, and creating operational confusion, especially when stale Services or LoadBalancers continue to route traffic.
-->
**常見誤區**：在叢集中遺留未使用或過時的資源——例如 Deployment、Service、ConfigMap 或 PersistentVolumeClaim。
這種情況經常發生，因爲 Kubernetes 不會自動刪除資源，除非明確指示；
同時系統也沒有內建機制來追蹤資源的歸屬或過期時間。
隨着時間推移，這些被遺忘的對象可能不斷累積，
佔用叢集資源、增加雲成本，並造成運維上的混亂，
尤其是在陳舊的 Service 或 LoadBalancer 仍持續轉發流量的情況下。


<!--
### How to avoid it:
- **Label everything** with a purpose or owner label. That way, you can easily query resources you no longer need.
- **Regularly audit** your cluster: run `kubectl get all -n <namespace>` to see what's actually running, and confirm it's all legit.
- **Adopt Kubernetes' Garbage Collection**: [K8s docs](/docs/concepts/workloads/controllers/garbage-collection/) show how to remove dependent objects automatically.
- **Leverage policy automation**: Tools like [Kyverno](https://kyverno.io/) can automatically delete or block stale resources after a certain period, or enforce lifecycle policies so you don't have to remember every single cleanup step.
-->
### 如何避免：

- **爲所有資源添加標籤**：使用用途或所有者標籤。
  這樣，你可以輕鬆查詢不再需要的資源。
- **定期審計叢集**：運行 `kubectl get all -n <namespace>` 查看實際運行的內容，
  並確認它們都是合法的。
- **採用 Kubernetes 的垃圾收集**：[K8s 文檔](/zh-cn/docs/concepts/workloads/controllers/garbage-collection/)
  展示瞭如何自動刪除依賴對象。
- **利用策略自動化**：像 [Kyverno](https://kyverno.io/) 這樣的工具可以在一定時間後自動刪除或阻止過期的資源，
  或強制執行生命週期策略，這樣你就不必記住每個清理步驟。

<!--
**My reality check**: After a hackathon, I forgot to tear down a "test-svc" pinned to an external load balancer. Three weeks later, I realized I'd been paying for that load balancer the entire time. Facepalm.
-->
**我的經驗教訓**：在一次黑客松活動結束後，
我忘記刪除一個綁定到外部負載均衡器的 "test-svc"。
三週後我才意識到，這段時間我一直在爲那個負載均衡器付費。


<!--
## 6. Diving too deep into networking too soon
-->
## 6. 過早深入複雜的網路設定 {#6-diving-too-deep-into-networking-too-soon}

<!--
**The pitfall**: Introducing advanced networking solutions—such as service meshes, custom CNI plugins, or multi-cluster communication—before fully understanding Kubernetes' native networking primitives. This commonly occurs when teams implement features like traffic routing, observability, or mTLS using external tools without first mastering how core Kubernetes networking works: including Pod-to-Pod communication, ClusterIP Services, DNS resolution, and basic ingress traffic handling. As a result, network-related issues become harder to troubleshoot, especially when overlays introduce additional abstractions and failure points.
-->
**常見誤區**：在完全理解 Kubernetes 原生網路原語之前引入高級網路解決方案——
如服務網格、自定義 CNI 插件或多叢集通信。
這通常發生在團隊使用外部工具實現流量路由、可觀測性或 mTLS 等功能，
而沒有首先掌握核心 Kubernetes 網路的工作原理：
包括 Pod 到 Pod 通信、ClusterIP Services、DNS 解析和基本 Ingress 流量處理。
因此，網路相關問題變得更難排查，
特別是當覆蓋層引入額外的抽象和故障點時。

<!--
### How to avoid it:

- Start small: a Deployment, a Service, and a basic ingress controller such as one based on NGINX (e.g., Ingress-NGINX).
- Make sure you understand how traffic flows within the cluster, how service discovery works, and how DNS is configured.
- Only move to a full-blown mesh or advanced CNI features when you actually need them, complex networking adds overhead.
-->
### 如何避免：

- 從簡單開始：部署一個 Deployment、一個 Service，
  以及一個基礎的 Ingress 控制器（例如基於 NGINX 的 Ingress-NGINX）。
- 確保理解叢集內的流量流向、服務發現機制以及 DNS 的設定方式。
- 僅在確實需要時再引入完整的服務網格或高級 CNI 功能，
  因爲複雜的網路架構會帶來額外開銷。

<!--
**My reality check**: I tried Istio on a small internal app once, then spent more time debugging Istio itself than the actual app. Eventually, I stepped back, removed Istio, and everything worked fine.
-->
**我的經驗教訓**：我曾經在一個小的內部應用上嘗試 Istio，
然後花在調試 Istio 本身上的時間比調試實際應用還多。
最終，我退了一步，移除了 Istio，一切運行正常。

<!--
## 7. Going too light on security and RBAC
-->
## 7. 對安全性和基於角色的訪問控制 (RBAC) 重視不足 {#7-going-too-light-on-security-and-rbac}

<!--
**The pitfall**: Deploying workloads with insecure configurations, such as running containers as the root user, using the `latest` image tag, disabling security contexts, or assigning overly broad RBAC roles like `cluster-admin`. These practices persist because Kubernetes does not enforce strict security defaults out of the box, and the platform is designed to be flexible rather than opinionated. Without explicit security policies in place, clusters can remain exposed to risks like container escape, unauthorized privilege escalation, or accidental production changes due to unpinned images.
-->
**常見誤區**：以不安全的方式設定部署工作負載，例如以 root 使用者運行容器、使用 `latest` 映像檔標籤、
禁用安全上下文（security context），或分配過於寬泛的 RBAC 角色（如 `cluster-admin`）。
這些做法之所以普遍存在，是因爲 Kubernetes 默認並不會強制實施嚴格的安全策略——
該平臺在設計上追求靈活性而非強約束性。如果未顯式設定安全策略，叢集可能面臨容器逃逸、
未經授權的權限提升或由於未固定映像檔導致的意外生產變更等風險。

<!--
### How to avoid it:

- Use [RBAC](/docs/reference/access-authn-authz/rbac/) to define roles and permissions within Kubernetes. While RBAC is the default and most widely supported authorization mechanism, Kubernetes also allows the use of alternative authorizers. For more advanced or external policy needs, consider solutions like [OPA Gatekeeper](https://open-policy-agent.github.io/gatekeeper/) (based on Rego), [Kyverno](https://kyverno.io/), or custom webhooks using policy languages such as CEL or [Cedar](https://cedarpolicy.com/).
- Pin images to specific versions (no more `:latest`!). This helps you know what's actually deployed.
- Look into [Pod Security Admission](/docs/concepts/security/pod-security-admission/) (or other solutions like Kyverno) to enforce non-root containers, read-only filesystems, etc.
-->
### 如何避免：

- 使用 [RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/) 定義在 Kubernetes 中的角色和權限。
  雖然 RBAC 是默認且最廣泛支持的鑑權機制，Kubernetes 也允許使用替代性的鑑權組件。
  對於更高級或外部策略需求，可以考慮 [OPA Gatekeeper](https://open-policy-agent.github.io/gatekeeper/)（基於 Rego）、
  [Kyverno](https://kyverno.io/) 或使用 CEL 或 [Cedar](https://cedarpolicy.com/) 等策略語言的自定義 Webhook 等解決方案。
- 將映像檔固定到特定版本（不要再使用 `:latest`！）。這有助於你瞭解實際部署的內容。
- 查看 [Pod 安全准入](/zh-cn/docs/concepts/security/pod-security-admission/)（或 Kyverno 等其他解決方案）
  以強制執行非 root 容器、只讀文件系統等。

<!--
**My reality check**: I never had a huge security breach, but I've heard plenty of cautionary tales. If you don't tighten things up, it's only a matter of time before something goes wrong.
-->
**我的經驗教訓**：我從未遇到過巨大的安全漏洞，但我聽過很多警示故事。
如果你不加強安全措施，出問題只是時間問題。

<!--
## Final thoughts
-->
## 最後的話 {#final-thoughts}

<!--
Kubernetes is amazing, but it's not psychic, it won't magically do the right thing if you don't tell it what you need. By keeping these pitfalls in mind, you'll avoid a lot of headaches and wasted time. Mistakes happen (trust me, I've made my share), but each one is a chance to learn more about how Kubernetes truly works under the hood.
If you're curious to dive deeper, the [official docs](/docs/home/) and the [community Slack](http://slack.kubernetes.io/) are excellent next steps. And of course, feel free to share your own horror stories or success tips, because at the end of the day, we're all in this cloud native adventure together.
-->
Kubernetes 非常強大，但它並非全知全能——如果你不明確告知它你的需求，它不會"神奇地"自動做出正確的決策。
牢記這些常見誤區，你就能避免許多麻煩和時間浪費。錯誤在所難免（相信我，我也犯過不少），但每一次失誤，
都是深入理解 Kubernetes 內部工作機制的機會。如果你希望進一步探索，
可以查閱[官方文檔](/zh-cn/docs/home/)或加入[社區 Slack](http://slack.kubernetes.io/)。
當然，也歡迎你分享自己的"踩坑經歷"或成功經驗——畢竟，在雲原生這場旅程中，我們都在同行。

<!--
**Happy Shipping!**
-->
**祝你部署順利！**
