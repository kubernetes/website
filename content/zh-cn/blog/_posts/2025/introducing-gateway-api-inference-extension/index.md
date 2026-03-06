---
layout: blog
title: "介绍 Gateway API 推理扩展"
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
现代生成式 AI 和大语言模型（LLM）服务在 Kubernetes 上带来独特的流量路由挑战。
与典型的短生命期的无状态 Web 请求不同，LLM 推理会话通常是长时间运行的、资源密集型的，并且具有一定的状态性。
例如，单个由 GPU 支撑的模型服务器可能会保持多个推理会话处于活跃状态，并保留内存中的令牌缓存。

传统的负载均衡器注重 HTTP 路径或轮询，缺乏处理这类工作负载所需的专业能力。
传统的负载均衡器通常无法识别模型身份或请求重要性（例如交互式聊天与批处理任务的区别）。
各个组织往往拼凑出临时解决方案，但一直缺乏标准化的做法。

<!--
## Gateway API Inference Extension

[Gateway API Inference Extension](https://gateway-api-inference-extension.sigs.k8s.io/) was created to address
this gap by building on the existing [Gateway API](https://gateway-api.sigs.k8s.io/), adding inference-specific
routing capabilities while retaining the familiar model of Gateways and HTTPRoutes. By adding an inference
extension to your existing gateway, you effectively transform it into an **Inference Gateway**, enabling you to
self-host GenAI/LLMs with a “model-as-a-service” mindset.
-->
## Gateway API 推理扩展   {#gateway-api-inference-extension}

[Gateway API 推理扩展](https://gateway-api-inference-extension.sigs.k8s.io/)正是为了填补这一空白而创建的，
它基于已有的 [Gateway API](https://gateway-api.sigs.k8s.io/) 进行构建，
添加了特定于推理的路由能力，同时保留了 Gateway 与 HTTPRoute 的熟悉模型。
通过为现有 Gateway 添加推理扩展，你就能将其转变为一个**推理网关（Inference Gateway）**，
从而以“模型即服务”的理念自托管 GenAI/LLM 应用。

<!--
The project’s goal is to improve and standardize routing to inference workloads across the ecosystem. Key
objectives include enabling model-aware routing, supporting per-request criticalities, facilitating safe model
roll-outs, and optimizing load balancing based on real-time model metrics. By achieving these, the project aims
to reduce latency and improve accelerator (GPU) utilization for AI workloads.

## How it works

The design introduces two new Custom Resources (CRDs) with distinct responsibilities, each aligning with a
specific user persona in the AI/ML serving workflow​:
-->
此项目的目标是在整个生态系统中改进并标准化对推理工作负载的路由。
关键目标包括实现模型感知路由、支持逐个请求的重要性区分、促进安全的模型发布，
以及基于实时模型指标来优化负载均衡。为了实现这些目标，此项目希望降低延迟并提高 AI 负载中的加速器（如 GPU）利用率。

## 工作原理   {#how-it-works}

功能设计时引入了两个具有不同职责的全新定制资源（CRD），每个 CRD 对应 AI/ML 服务流程中的一个特定用户角色：

<!--
{{< figure src="inference-extension-resource-model.png" alt="Resource Model" class="diagram-large" clicktozoom="true" >}}
-->
{{< figure src="inference-extension-resource-model.png" alt="资源模型" class="diagram-large" clicktozoom="true" >}}

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
   定义了一组在共享计算资源（如 GPU 节点）上运行的 Pod（模型服务器）。
   平台管理员可以配置这些 Pod 的部署、扩缩容和负载均衡策略。
   InferencePool 确保资源使用情况的一致性，并执行平台级的策略。
   InferencePool 类似于 Service，但专为 AI/ML 推理服务定制，能够感知模型服务协议。

2. [InferenceModel](https://gateway-api-inference-extension.sigs.k8s.io/api-types/inferencemodel/)
   是面向用户的模型端点，由 AI/ML 拥有者管理。
   它将一个公共名称（如 "gpt-4-chat"）映射到 InferencePool 内的实际模型。
   这使得负载拥有者可以指定要服务的模型（及可选的微调版本），并配置流量拆分或优先级策略。

<!--
In summary, the InferenceModel API lets AI/ML owners manage what is served, while the InferencePool lets platform
operators manage where and how it’s served.
-->
简而言之，InferenceModel API 让 AI/ML 拥有者管理“提供什么服务”，而
InferencePool 则让平台运维人员管理“在哪儿以及如何提供服务”。

<!--
## Request flow

The flow of a request builds on the Gateway API model (Gateways and HTTPRoutes) with one or more extra inference-aware
steps (extensions) in the middle. Here’s a high-level example of the request flow with the
[Endpoint Selection Extension (ESE)](https://gateway-api-inference-extension.sigs.k8s.io/#endpoint-selection-extension):
-->
## 请求流程   {#request-flow}

请求的处理流程基于 Gateway API 模型（Gateway 和 HTTPRoute），在其中插入一个或多个对推理有感知的步骤（扩展）。
以下是一个使用[端点选择扩展（Endpoint Selection Extension, ESE）](https://gateway-api-inference-extension.sigs.k8s.io/#endpoint-selection-extension)
的高级请求流程示意图：

<!--
{{< figure src="inference-extension-request-flow.png" alt="Request Flow" class="diagram-large" clicktozoom="true" >}}
-->
{{< figure src="inference-extension-request-flow.png" alt="请求流程" class="diagram-large" clicktozoom="true" >}}

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
   
   客户端发送请求（例如向 `/completions` 发起 HTTP POST）。
   Gateway（如 Envoy）会检查 HTTPRoute，并识别出匹配的 InferencePool 后端。

2. **端点选择**
   
   Gateway 不会简单地将请求转发到任一可用的 Pod，
   而是调用一个特定于推理的路由扩展（端点选择扩展）从多个可用 Pod 中选出最优者。
   此扩展根据实时 Pod 指标（如队列长度、内存使用量、加载的适配器等）来选择最适合请求的 Pod。

<!--
3. **Inference-Aware Scheduling**  
   The chosen pod is the one that can handle the request with the lowest latency or highest efficiency, given the
   user’s criticality or resource needs. The Gateway then forwards traffic to that specific pod.
-->
3. **推理感知调度**
   
   所选 Pod 是基于用户重要性或资源需求下延迟最低或效率最高者。
   随后 Gateway 将流量转发到这个特定的 Pod。

<!--
{{< figure src="inference-extension-epp-scheduling.png" alt="Endpoint Extension Scheduling" class="diagram-large" clicktozoom="true" >}}
-->
{{< figure src="inference-extension-epp-scheduling.png" alt="端点扩展调度" class="diagram-large" clicktozoom="true" >}}

<!--
This extra step provides a smarter, model-aware routing mechanism that still feels like a normal single request to
the client. Additionally, the design is extensible—any Inference Gateway can be enhanced with additional inference-specific
extensions to handle new routing strategies, advanced scheduling logic, or specialized hardware needs. As the project
continues to grow, contributors are encouraged to develop new extensions that are fully compatible with the same underlying
Gateway API model, further expanding the possibilities for efficient and intelligent GenAI/LLM routing.
-->
这一额外步骤提供了一种更为智能的模型感知路由机制，但对于客户端来说感觉就像一个普通的请求。
此外，这种设计具有良好的可扩展性，任何推理网关都可以通过添加新的特定于推理的扩展来处理新的路由策略、高级调度逻辑或特定硬件需求。
随着此项目的持续发展，欢迎社区贡献者开发与底层 Gateway API 模型完全兼容的新扩展，进一步拓展高效、智能的 GenAI/LLM 路由能力。

<!--
## Benchmarks

We evaluated ​this extension against a standard Kubernetes Service for a [vLLM](https://docs.vllm.ai/en/latest/)‐based model
serving deployment. The test environment consisted of multiple H100 (80 GB) GPU pods running vLLM ([version 1](https://blog.vllm.ai/2025/01/27/v1-alpha-release.html))
on a Kubernetes cluster, with 10 Llama2 model replicas. The [Latency Profile Generator (LPG)](https://github.com/AI-Hypercomputer/inference-benchmark)
tool was used to generate traffic and measure throughput, latency, and other metrics. The
[ShareGPT](https://huggingface.co/datasets/anon8231489123/ShareGPT_Vicuna_unfiltered/resolve/main/ShareGPT_V3_unfiltered_cleaned_split.json)
dataset served as the workload, and traffic was ramped from 100 Queries per Second (QPS) up to 1000 QPS.
-->
## 基准测试   {#benchmarks}

我们将此扩展与标准 Kubernetes Service 进行了对比测试，基于
[vLLM](https://docs.vllm.ai/en/latest/) 部署模型服务。
测试环境是在 Kubernetes 集群中运行 vLLM（[v1](https://blog.vllm.ai/2025/01/27/v1-alpha-release.html)）
的多个 H100（80 GB）GPU Pod，并部署了 10 个 Llama2 模型副本。
本次测试使用了 [Latency Profile Generator (LPG)](https://github.com/AI-Hypercomputer/inference-benchmark)
工具生成流量，测量吞吐量、延迟等指标。采用的工作负载数据集为
[ShareGPT](https://huggingface.co/datasets/anon8231489123/ShareGPT_Vicuna_unfiltered/resolve/main/ShareGPT_V3_unfiltered_cleaned_split.json)，
流量从 100 QPS 提升到 1000 QPS。

<!--
### Key results

{{< figure src="inference-extension-benchmark.png" alt="Endpoint Extension Scheduling" class="diagram-large" clicktozoom="true" >}}
-->
### 主要结果   {#key-results}

{{< figure src="inference-extension-benchmark.png" alt="端点扩展调度" class="diagram-large" clicktozoom="true" >}}

<!--
- **Comparable Throughput**: Throughout the tested QPS range, the ESE delivered throughput roughly on par with a standard
  Kubernetes Service.
-->
- **吞吐量相当**：在整个测试的 QPS 范围内，ESE 达到的吞吐量基本与标准 Kubernetes Service 持平。

<!--
- **Lower Latency**:
  - **Per‐Output‐Token Latency**: The ​ESE showed significantly lower p90 latency at higher QPS (500+), indicating that
  its model-aware routing decisions reduce queueing and resource contention as GPU memory approaches saturation.
  - **Overall p90 Latency**: Similar trends emerged, with the ​ESE reducing end‐to‐end tail latencies compared to the
  baseline, particularly as traffic increased beyond 400–500 QPS.
-->
- **延迟更低**：
  - **输出令牌层面的延迟**：在高负载（QPS 500 以上）时，​ESE 显示了 p90 延迟明显更低，
    这表明随着 GPU 显存达到饱和，其模型感知路由决策可以减少排队等待和资源争用。
  - **整体 p90 延迟**：出现类似趋势，​ESE 相比基线降低了端到端尾部延迟，特别是在 QPS 超过 400–500 时更明显。

<!--
These results suggest that this extension's model‐aware routing significantly reduced latency for GPU‐backed LLM
workloads. By dynamically selecting the least‐loaded or best‐performing model server, it avoids hotspots that can
appear when using traditional load balancing methods for large, long‐running inference requests.

## Roadmap

As the Gateway API Inference Extension heads toward GA, planned features include:
-->
这些结果表明，此扩展的模型感知路由显著降低了 GPU 支撑的 LLM 负载的延迟。
此扩展通过动态选择负载最轻或性能最优的模型服务器，避免了传统负载均衡方法在处理较大的、长时间运行的推理请求时会出现的热点问题。

## 路线图   {#roadmap}

随着 Gateway API 推理扩展迈向 GA（正式发布），计划中的特性包括：

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
1. **前缀缓存感知负载均衡**以支持远程缓存
2. **LoRA 适配器流水线**方便自动化上线
3. 同一重要性等级下负载之间的**公平性和优先级**
4. **HPA 支持**基于聚合的模型层面指标扩缩容
5. **支持大规模多模态输入/输出**
6. **支持额外的模型类型**（如扩散模型）
7. **异构加速器**（支持多个加速器类型，并具备延迟和成本感知的负载均衡）
8. **解耦式服务架构**，以独立扩缩资源池

<!--
## Summary

By aligning model serving with Kubernetes-native tooling, Gateway API Inference Extension aims to simplify
and standardize how AI/ML traffic is routed. With model-aware routing, criticality-based prioritization, and
more, it helps ops teams deliver the right LLM services to the right users—smoothly and efficiently.
-->
## 总结   {#summary}

通过将模型服务对齐到 Kubernetes 原生工具链，Gateway API 推理扩展致力于简化并标准化 AI/ML 流量的路由方式。
此扩展引入模型感知路由、基于重要性的优先级等能力，帮助运维团队平滑高效地将合适的 LLM 服务交付给合适的用户。

<!--
**Ready to learn more?** Visit the [project docs](https://gateway-api-inference-extension.sigs.k8s.io/) to dive deeper,
give an Inference Gateway extension a try with a few [simple steps](https://gateway-api-inference-extension.sigs.k8s.io/guides/),
and [get involved](https://gateway-api-inference-extension.sigs.k8s.io/contributing/) if you’re interested in
contributing to the project!
-->
**想进一步学习？**
参阅[项目文档](https://gateway-api-inference-extension.sigs.k8s.io/)深入学习，
只需[简单几步](https://gateway-api-inference-extension.sigs.k8s.io/guides/)试用推理网关扩展。
如果你想对此项目作贡献，欢迎[参与其中](https://gateway-api-inference-extension.sigs.k8s.io/contributing/)！
