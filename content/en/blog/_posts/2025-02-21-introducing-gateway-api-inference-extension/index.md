---
layout: blog
title: "Introducing Gateway API Inference Extension"
date: 2025-02-20
slug: introducing-gateway-api-inference-extension
draft: true
---

**Authors**: Abdullah Gharaibeh (Google), Kellen Swain (Google), Daneyon Hansen (Solo.io), Jiaxin Shan (Bytedance)

Modern generative AI and large language model (LLM) services pose new challenges for traffic routing
on Kubernetes. Unlike typical web traffic, which usually involves short-lived, stateless requests, LLM
inference requests can be long-running, resource-intensive, and stateful. For example, a single GPU-backed
model server might handle multiplexed inference sessions and maintain in-memory caches of prompt tokens.
Traditional load balancers that route based only on HTTP path or round-robin distribution often fall
short for these workloads. LLM traffic may need to be model-aware – for instance, directing requests by
model or fine-tune name rather than just URL path​. It may also require understanding the criticality of
requests – e.g. interactive chat queries might be marked higher criticality than batch summarization jobs​.
Without a standard approach, organizations have resorted to ad-hoc solutions to handle these differences.

The [Gateway API Inference Extension](https://gateway-api-inference-extension.sigs.k8s.io/) project was
created to address this gap. It is an official Kubernetes sub-project focused on extending Gateway API
with inference-specific routing capabilities​. In other words, it introduces a consistent way to route
and load-balance AI/ML inference traffic on Kubernetes, building on the same Gateway API that many
cloud-native ingress and service mesh implementations already support. The goal is to improve and
standardize routing to inference workloads across the ecosystem. Key objectives include enabling
model-aware routing, supporting per-request criticalities, facilitating safe model roll-outs, and
optimizing load balancing based on real-time model metrics​. By achieving these, the project aims to
reduce latency and improve accelerator (GPU) utilization for AI workloads.

## How Gateway API Inference Extension Works

To support these goals, Gateway API Inference Extension introduces new API resources and concepts
specifically designed for AI/ML inference. The design centers on two new Custom Resources (CRDs), each
aligning with a specific user persona in the AI/ML serving workflow​:

{{< figure src="inference-extension-resource-model.png" alt="Resource Model" class="diagram-large" clicktozoom="true" >}}

​[InferencePool](https://gateway-api-inference-extension.sigs.k8s.io/api-types/inferencepool/) – meant for
the Inference Platform Admin (infrastructure operator)​. An InferencePool defines a logical group of compute
resources (pods) running model servers. It represents a pool of one or more model instances (e.g. a set of
pods serving a particular base model) on shared hardware. The platform admin can use this API to manage the
pool’s deployment and routing policies. For example, an InferencePool may correspond to all servers running a
7B parameter Llama2 model on GPU nodes. The pool abstraction allows the system to enforce fair resource usage
across workloads and to efficiently route requests across shared compute resources​. An InferencePool is similar
to a Service but specialized for AI/ML serving needs and aware of the model-serving protocol. Any pod joining
an InferencePool must implement the expected inference protocol so that the pool’s controller can collect
metrics and make informed routing decisions​.

[InferenceModel](https://gateway-api-inference-extension.sigs.k8s.io/api-types/inferencemodel/) – intended for
the Inference Workload Owner (AI/ML engineer or application developer)​. An InferenceModel represents a deployable
model endpoint and ties a user-facing model name to the actual model(s) in an InferencePool. This is where a
workload owner declares which model (and optional fine-tuning adapters) they want to serve to end-users. The
InferenceModel spec can map a public model name (e.g. "gpt-4-chat") to a specific model or checkpoint in the
pool, and even split traffic between multiple variants for A/B testing or gradual roll-outs​. It also allows
labeling the criticality of that model’s traffic, influencing how the system prioritizes its requests (for instance,
a critical real-time service vs. a best-effort batch job)​. In summary, the InferenceModel API lets AI/ML owners
manage what is served, while the InferencePool lets platform operators manage where and how it’s served.

With these APIs in place, how does an inference request actually get routed through the system? The process
builds on the Gateway API model (Gateways and HTTPRoutes) with one or more extra inference-aware steps, e.g.
extensions, in the middle. Here’s a high-level example of the request flow with the
[​endpoint selection extension](https://gateway-api-inference-extension.sigs.k8s.io/#endpoint-selection-extension):

{{< figure src="inference-extension-request-flow.png" alt="Request Flow" class="diagram-large" clicktozoom="true" >}}

Gateway routing: A client sends a request to a model server on the Kubernetes cluster (for example, an HTTP POST to
the /completions API). The Gateway, Envoy for example, receives the request and based on standard HTTPRoute rules,
determines the request should go to an InferencePool (as opposed to a regular Service) corresponding to the requested
model.​

Endpoint selection extension: Upon selecting an InferencePool backend, the Gateway passes the request to the extension
associated with that pool. This is the inference-specific routing logic introduced by the project. Instead of immediately
forwarding to any one pod in the InferencePool, the Gateway asks the extension to decide which exact pod (model server
instance in the pool) that should handle the request​.

Inference-aware scheduling: The endpoint selection extension evaluates the live state of the pool’s pods to pick the
optimal endpoint to route the request to. It queries each pod’s metrics or status – for example, how long its request
queue is, how much memory (KV cache) is available, or whether the requested LoRA adapter is already loaded on that pod.
Using these signals, the extension applies its scheduling policy (the “filter chain”) to select the pod that can best
serve the request according to the configured objectives (e.g. lowest latency)​. This might involve choosing the instance
with the smallest queue and sufficient free GPU memory for the new request.

{{< figure src="inference-extension-epp-scheduling.png" alt="Endpoint Extension Scheduling" class="diagram-large" clicktozoom="true" >}}

Forward to model server: The extension returns its decision to the Gateway, essentially saying “send this request to pod X.”
The Gateway then forwards the traffic to that specific model server pod​. The response from the model will stream back to the
client in reverse order. All of this happens transparently – to the client it looks like a normal single request, but the
Gateway and extension have transparently collaborated to route the request intelligently.

By introducing this extension point in the routing pipeline, the system can make much smarter decisions than a generic
load balancer. It still retains Gateway API for traffic management, but augments it with model-aware routing logic when
needed.
