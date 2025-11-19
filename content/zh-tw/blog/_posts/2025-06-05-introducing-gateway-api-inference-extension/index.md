---
layout: blog
title: "介紹 Gateway API 推理擴展"
date: 2025-06-05
slug: introducing-gateway-api-inference-extension
draft: false
author: >
  Daneyon Hansen (Solo.io),
  Kaushik Mitra (Google),
  Jiaxin Shan (Bytedance),
  Kellen Swain (Google)
translator: >
  Michael Yao (DaoCloud)
---
<!--
layout: blog
title: "Introducing Gateway API Inference Extension"
date: 2025-06-05
slug: introducing-gateway-api-inference-extension
draft: false
author: >
  Daneyon Hansen (Solo.io),
  Kaushik Mitra (Google),
  Jiaxin Shan (Bytedance),
  Kellen Swain (Google)
-->

<!--
Modern generative AI and large language model (LLM) services create unique traffic-routing challenges
on Kubernetes. Unlike typical short-lived, stateless web requests, LLM inference sessions are often
long-running, resource-intensive, and partially stateful. For example, a single GPU-backed model server
may keep multiple inference sessions active and maintain in-memory token caches.

Traditional load balancers focused on HTTP path or round-robin lack the specialized capabilities needed
for these workloads. They also don’t account for model identity or request criticality (e.g., interactive
chat vs. batch jobs). Organizations often patch together ad-hoc solutions, but a standardized approach
is missing.
-->
現代生成式 AI 和大語言模型（LLM）服務在 Kubernetes 上帶來獨特的流量路由挑戰。
與典型的短生命期的無狀態 Web 請求不同，LLM 推理會話通常是長時間運行的、資源密集型的，並且具有一定的狀態性。
例如，單個由 GPU 支撐的模型伺服器可能會保持多個推理會話處於活躍狀態，並保留內存中的令牌緩存。

傳統的負載均衡器注重 HTTP 路徑或輪詢，缺乏處理這類工作負載所需的專業能力。
傳統的負載均衡器通常無法識別模型身份或請求重要性（例如交互式聊天與批處理任務的區別）。
各個組織往往拼湊出臨時解決方案，但一直缺乏標準化的做法。

<!--
## Gateway API Inference Extension

[Gateway API Inference Extension](https://gateway-api-inference-extension.sigs.k8s.io/) was created to address
this gap by building on the existing [Gateway API](https://gateway-api.sigs.k8s.io/), adding inference-specific
routing capabilities while retaining the familiar model of Gateways and HTTPRoutes. By adding an inference
extension to your existing gateway, you effectively transform it into an **Inference Gateway**, enabling you to
self-host GenAI/LLMs with a “model-as-a-service” mindset.
-->
## Gateway API 推理擴展   {#gateway-api-inference-extension}

[Gateway API 推理擴展](https://gateway-api-inference-extension.sigs.k8s.io/)正是爲了填補這一空白而創建的，
它基於已有的 [Gateway API](https://gateway-api.sigs.k8s.io/) 進行構建，
添加了特定於推理的路由能力，同時保留了 Gateway 與 HTTPRoute 的熟悉模型。
通過爲現有 Gateway 添加推理擴展，你就能將其轉變爲一個**推理網關（Inference Gateway）**，
從而以“模型即服務”的理念自託管 GenAI/LLM 應用。

<!--
The project’s goal is to improve and standardize routing to inference workloads across the ecosystem. Key
objectives include enabling model-aware routing, supporting per-request criticalities, facilitating safe model
roll-outs, and optimizing load balancing based on real-time model metrics. By achieving these, the project aims
to reduce latency and improve accelerator (GPU) utilization for AI workloads.

## How it works

The design introduces two new Custom Resources (CRDs) with distinct responsibilities, each aligning with a
specific user persona in the AI/ML serving workflow​:
-->
此項目的目標是在整個生態系統中改進並標準化對推理工作負載的路由。
關鍵目標包括實現模型感知路由、支持逐個請求的重要性區分、促進安全的模型發佈，
以及基於實時模型指標來優化負載均衡。爲了實現這些目標，此項目希望降低延遲並提高 AI 負載中的加速器（如 GPU）利用率。

## 工作原理   {#how-it-works}

功能設計時引入了兩個具有不同職責的全新定製資源（CRD），每個 CRD 對應 AI/ML 服務流程中的一個特定使用者角色：

<!--
{{< figure src="inference-extension-resource-model.png" alt="Resource Model" class="diagram-large" clicktozoom="true" >}}
-->
{{< figure src="inference-extension-resource-model.png" alt="資源模型" class="diagram-large" clicktozoom="true" >}}

<!--
1. [InferencePool](https://gateway-api-inference-extension.sigs.k8s.io/api-types/inferencepool/)
   Defines a pool of pods (model servers) running on shared compute (e.g., GPU nodes). The platform admin can
   configure how these pods are deployed, scaled, and balanced. An InferencePool ensures consistent resource
   usage and enforces platform-wide policies. An InferencePool is similar to a Service but specialized for AI/ML
   serving needs and aware of the model-serving protocol.

2. [InferenceModel](https://gateway-api-inference-extension.sigs.k8s.io/api-types/inferencemodel/)
   A user-facing model endpoint managed by AI/ML owners. It maps a public name (e.g., "gpt-4-chat") to the actual
   model within an InferencePool. This lets workload owners specify which models (and optional fine-tuning) they
   want served, plus a traffic-splitting or prioritization policy.
-->
1. [InferencePool](https://gateway-api-inference-extension.sigs.k8s.io/api-types/inferencepool/)
   定義了一組在共享計算資源（如 GPU 節點）上運行的 Pod（模型伺服器）。
   平臺管理員可以設定這些 Pod 的部署、擴縮容和負載均衡策略。
   InferencePool 確保資源使用情況的一致性，並執行平臺級的策略。
   InferencePool 類似於 Service，但專爲 AI/ML 推理服務定製，能夠感知模型服務協議。

2. [InferenceModel](https://gateway-api-inference-extension.sigs.k8s.io/api-types/inferencemodel/)
   是面向使用者的模型端點，由 AI/ML 擁有者管理。
   它將一個公共名稱（如 "gpt-4-chat"）映射到 InferencePool 內的實際模型。
   這使得負載擁有者可以指定要服務的模型（及可選的微調版本），並設定流量拆分或優先級策略。

<!--
In summary, the InferenceModel API lets AI/ML owners manage what is served, while the InferencePool lets platform
operators manage where and how it’s served.
-->
簡而言之，InferenceModel API 讓 AI/ML 擁有者管理“提供什麼服務”，而
InferencePool 則讓平臺運維人員管理“在哪兒以及如何提供服務”。

<!--
## Request flow

The flow of a request builds on the Gateway API model (Gateways and HTTPRoutes) with one or more extra inference-aware
steps (extensions) in the middle. Here’s a high-level example of the request flow with the
[Endpoint Selection Extension (ESE)](https://gateway-api-inference-extension.sigs.k8s.io/#endpoint-selection-extension):
-->
## 請求流程   {#request-flow}

請求的處理流程基於 Gateway API 模型（Gateway 和 HTTPRoute），在其中插入一個或多個對推理有感知的步驟（擴展）。
以下是一個使用[端點選擇擴展（Endpoint Selection Extension, ESE）](https://gateway-api-inference-extension.sigs.k8s.io/#endpoint-selection-extension)
的高級請求流程示意圖：

<!--
{{< figure src="inference-extension-request-flow.png" alt="Request Flow" class="diagram-large" clicktozoom="true" >}}
-->
{{< figure src="inference-extension-request-flow.png" alt="請求流程" class="diagram-large" clicktozoom="true" >}}

<!--
1. **Gateway Routing**  
   A client sends a request (e.g., an HTTP POST to /completions). The Gateway (like Envoy) examines the HTTPRoute
   and identifies the matching InferencePool backend.

2. **Endpoint Selection**  
   Instead of simply forwarding to any available pod, the Gateway consults an inference-specific routing extension—
   the Endpoint Selection Extension—to pick the best of the available pods. This extension examines live pod metrics
   (queue lengths, memory usage, loaded adapters) to choose the ideal pod for the request.
-->
1. **Gateway 路由**
   
   客戶端發送請求（例如向 `/completions` 發起 HTTP POST）。
   Gateway（如 Envoy）會檢查 HTTPRoute，並識別出匹配的 InferencePool 後端。

2. **端點選擇**
   
   Gateway 不會簡單地將請求轉發到任一可用的 Pod，
   而是調用一個特定於推理的路由擴展（端點選擇擴展）從多個可用 Pod 中選出最優者。
   此擴展根據實時 Pod 指標（如隊列長度、內存使用量、加載的適配器等）來選擇最適合請求的 Pod。

<!--
3. **Inference-Aware Scheduling**  
   The chosen pod is the one that can handle the request with the lowest latency or highest efficiency, given the
   user’s criticality or resource needs. The Gateway then forwards traffic to that specific pod.
-->
3. **推理感知調度**
   
   所選 Pod 是基於使用者重要性或資源需求下延遲最低或效率最高者。
   隨後 Gateway 將流量轉發到這個特定的 Pod。

<!--
{{< figure src="inference-extension-epp-scheduling.png" alt="Endpoint Extension Scheduling" class="diagram-large" clicktozoom="true" >}}
-->
{{< figure src="inference-extension-epp-scheduling.png" alt="端點擴展調度" class="diagram-large" clicktozoom="true" >}}

<!--
This extra step provides a smarter, model-aware routing mechanism that still feels like a normal single request to
the client. Additionally, the design is extensible—any Inference Gateway can be enhanced with additional inference-specific
extensions to handle new routing strategies, advanced scheduling logic, or specialized hardware needs. As the project
continues to grow, contributors are encouraged to develop new extensions that are fully compatible with the same underlying
Gateway API model, further expanding the possibilities for efficient and intelligent GenAI/LLM routing.
-->
這一額外步驟提供了一種更爲智能的模型感知路由機制，但對於客戶端來說感覺就像一個普通的請求。
此外，這種設計具有良好的可擴展性，任何推理網關都可以通過添加新的特定於推理的擴展來處理新的路由策略、高級調度邏輯或特定硬件需求。
隨着此項目的持續發展，歡迎社區貢獻者開發與底層 Gateway API 模型完全兼容的新擴展，進一步拓展高效、智能的 GenAI/LLM 路由能力。

<!--
## Benchmarks

We evaluated ​this extension against a standard Kubernetes Service for a [vLLM](https://docs.vllm.ai/en/latest/)‐based model
serving deployment. The test environment consisted of multiple H100 (80 GB) GPU pods running vLLM ([version 1](https://blog.vllm.ai/2025/01/27/v1-alpha-release.html))
on a Kubernetes cluster, with 10 Llama2 model replicas. The [Latency Profile Generator (LPG)](https://github.com/AI-Hypercomputer/inference-benchmark)
tool was used to generate traffic and measure throughput, latency, and other metrics. The
[ShareGPT](https://huggingface.co/datasets/anon8231489123/ShareGPT_Vicuna_unfiltered/resolve/main/ShareGPT_V3_unfiltered_cleaned_split.json)
dataset served as the workload, and traffic was ramped from 100 Queries per Second (QPS) up to 1000 QPS.
-->
## 基準測試   {#benchmarks}

我們將此擴展與標準 Kubernetes Service 進行了對比測試，基於
[vLLM](https://docs.vllm.ai/en/latest/) 部署模型服務。
測試環境是在 Kubernetes 叢集中運行 vLLM（[v1](https://blog.vllm.ai/2025/01/27/v1-alpha-release.html)）
的多個 H100（80 GB）GPU Pod，並部署了 10 個 Llama2 模型副本。
本次測試使用了 [Latency Profile Generator (LPG)](https://github.com/AI-Hypercomputer/inference-benchmark)
工具生成流量，測量吞吐量、延遲等指標。採用的工作負載數據集爲
[ShareGPT](https://huggingface.co/datasets/anon8231489123/ShareGPT_Vicuna_unfiltered/resolve/main/ShareGPT_V3_unfiltered_cleaned_split.json)，
流量從 100 QPS 提升到 1000 QPS。

<!--
### Key results

{{< figure src="inference-extension-benchmark.png" alt="Endpoint Extension Scheduling" class="diagram-large" clicktozoom="true" >}}
-->
### 主要結果   {#key-results}

{{< figure src="inference-extension-benchmark.png" alt="端點擴展調度" class="diagram-large" clicktozoom="true" >}}

<!--
- **Comparable Throughput**: Throughout the tested QPS range, the ESE delivered throughput roughly on par with a standard
  Kubernetes Service.
-->
- **吞吐量相當**：在整個測試的 QPS 範圍內，ESE 達到的吞吐量基本與標準 Kubernetes Service 持平。

<!--
- **Lower Latency**:
  - **Per‐Output‐Token Latency**: The ​ESE showed significantly lower p90 latency at higher QPS (500+), indicating that
  its model-aware routing decisions reduce queueing and resource contention as GPU memory approaches saturation.
  - **Overall p90 Latency**: Similar trends emerged, with the ​ESE reducing end‐to‐end tail latencies compared to the
  baseline, particularly as traffic increased beyond 400–500 QPS.
-->
- **延遲更低**：
  - **輸出令牌層面的延遲**：在高負載（QPS 500 以上）時，​ESE 顯示了 p90 延遲明顯更低，
    這表明隨着 GPU 顯存達到飽和，其模型感知路由決策可以減少排隊等待和資源爭用。
  - **整體 p90 延遲**：出現類似趨勢，​ESE 相比基線降低了端到端尾部延遲，特別是在 QPS 超過 400–500 時更明顯。

<!--
These results suggest that this extension's model‐aware routing significantly reduced latency for GPU‐backed LLM
workloads. By dynamically selecting the least‐loaded or best‐performing model server, it avoids hotspots that can
appear when using traditional load balancing methods for large, long‐running inference requests.

## Roadmap

As the Gateway API Inference Extension heads toward GA, planned features include:
-->
這些結果表明，此擴展的模型感知路由顯著降低了 GPU 支撐的 LLM 負載的延遲。
此擴展通過動態選擇負載最輕或性能最優的模型伺服器，避免了傳統負載均衡方法在處理較大的、長時間運行的推理請求時會出現的熱點問題。

## 路線圖   {#roadmap}

隨着 Gateway API 推理擴展邁向 GA（正式發佈），計劃中的特性包括：

<!--
1. **Prefix-cache aware load balancing** for remote caches
2. **LoRA adapter pipelines** for automated rollout
3. **Fairness and priority** between workloads in the same criticality band
4. **HPA support** for scaling based on aggregate, per-model metrics
5. **Support for large multi-modal inputs/outputs**
6. **Additional model types** (e.g., diffusion models)
7. **Heterogeneous accelerators** (serving on multiple accelerator types with latency- and cost-aware load balancing)
8. **Disaggregated serving** for independently scaling pools
-->
1. **前綴緩存感知負載均衡**以支持遠程緩存
2. **LoRA 適配器流水線**方便自動化上線
3. 同一重要性等級下負載之間的**公平性和優先級**
4. **HPA 支持**基於聚合的模型層面指標擴縮容
5. **支持大規模多模態輸入/輸出**
6. **支持額外的模型類型**（如擴散模型）
7. **異構加速器**（支持多個加速器類型，並具備延遲和成本感知的負載均衡）
8. **解耦式服務架構**，以獨立擴縮資源池

<!--
## Summary

By aligning model serving with Kubernetes-native tooling, Gateway API Inference Extension aims to simplify
and standardize how AI/ML traffic is routed. With model-aware routing, criticality-based prioritization, and
more, it helps ops teams deliver the right LLM services to the right users—smoothly and efficiently.
-->
## 總結   {#summary}

通過將模型服務對齊到 Kubernetes 原生工具鏈，Gateway API 推理擴展致力於簡化並標準化 AI/ML 流量的路由方式。
此擴展引入模型感知路由、基於重要性的優先級等能力，幫助運維團隊平滑高效地將合適的 LLM 服務交付給合適的使用者。

<!--
**Ready to learn more?** Visit the [project docs](https://gateway-api-inference-extension.sigs.k8s.io/) to dive deeper,
give an Inference Gateway extension a try with a few [simple steps](https://gateway-api-inference-extension.sigs.k8s.io/guides/),
and [get involved](https://gateway-api-inference-extension.sigs.k8s.io/contributing/) if you’re interested in
contributing to the project!
-->
**想進一步學習？**
參閱[項目文檔](https://gateway-api-inference-extension.sigs.k8s.io/)深入學習，
只需[簡單幾步](https://gateway-api-inference-extension.sigs.k8s.io/guides/)試用推理網關擴展。
如果你想對此項目作貢獻，歡迎[參與其中](https://gateway-api-inference-extension.sigs.k8s.io/contributing/)！
