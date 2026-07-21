---
layout: blog
title: "Scaling AI model distribution on Kubernetes with MatrixHub"
date: 2026-08-01
slug: scalable-ai-model-distribution-with-matrixhub
author: Michael Yao
---

[GPU scheduling](/docs/tasks/manage-gpus/scheduling-gpus/) is a part of operating AI workloads on Kubernetes.
Before an inference server can accept a request, it must also have the model files it needs. For a large model,
that can mean fetching hundreds of gigabytes of weights, tokenizers, and configuration from a remote repository.

That step is easy to overlook in a small test cluster. It becomes noticeable when a deployment scales out, a node
is replaced, or an environment has limited or no access to the public internet. This post looks at model
distribution as an infrastructure concern, and shows how [MatrixHub](https://github.com/matrixhub-ai/matrixhub),
a self-hosted AI model registry with Hugging Face compatibility, can sit alongside Kubernetes workloads.

## Model files are not container images

Kubernetes and the container runtime already have a well-understood path for application images: pull an image
from a registry, cache its layers on the node, and start the container. Model artifacts follow a different path.
They are normally downloaded by an application or framework at startup, often from a model hub outside the
cluster.

That distinction matters. A rollout from one inference Pod to ten can result in ten attempts to retrieve the same
model. Depending on the model size and network path, the effect can be long startup times, saturated links, or
failures that only appear during a scale-out event.

{{< mermaid >}}
flowchart TB
  R[Model repository]
  subgraph C[Kubernetes cluster]
    direction LR
    P1[Pod]
    P2[Pod]
    P3[Pod]
  end
  R -->|model files| P1
  R -->|model files| P2
  R -->|model files| P3
{{< /mermaid >}}

For production deployments, teams commonly need a way to control which model versions are available, where they
are fetched from, and how they are retained. This is particularly relevant for private or fine-tuned models,
disconnected clusters, and clusters with a shared egress constraint.

## Put a model registry on the data path

MatrixHub is an open source, self-hosted model registry that acts as a private, Hugging Face-compatible endpoint.
It can cache models obtained from upstream sources, so vLLM, SGLang, and other compatible tools can use it without
changing their model-loading code. Instead of giving every workload direct access to an external repository,
workloads use the registry endpoint.

{{< mermaid >}}
flowchart TB
  W[Inference workloads] -->|Hugging Face-compatible API| H[MatrixHub]
  H --> S[Local model storage]
  H --> U[Upstream model sources]
{{< /mermaid >}}

On a cache miss, MatrixHub retrieves the requested artifact from its configured upstream source. Later requests
can use the stored copy. This "pull once, serve all" pattern reduces repeated external transfers, but it does not
remove the cost of the first download. Test cold-start behavior, storage capacity, and concurrent scale-out against
the traffic patterns of the application.

This arrangement gives platform teams a separate place to manage model delivery, while Kubernetes continues to
schedule and operate the workloads that consume those models.

MatrixHub publishes a [Helm chart](https://github.com/matrixhub-ai/matrixhub/tree/main/deploy/charts/matrixhub)
for deployment on Kubernetes. The chart exposes a ClusterIP Service by default and includes configuration for
storage and its database; review those settings before using it as a shared service.

## Configure an inference workload

Many model-loading tools honor the `HF_ENDPOINT` environment variable. The following
[Deployment](/docs/concepts/workloads/controllers/deployment/) directs a vLLM container to a MatrixHub endpoint.
The example only shows the relevant configuration; a production manifest should also specify resource requests and
limits, probes, model arguments, and any required credentials.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: llm-service
spec:
  replicas: 4
  selector:
    matchLabels:
      app: llm-service
  template:
    metadata:
      labels:
        app: llm-service
    spec:
      containers:
        - name: inference-server
          image: vllm/vllm-openai
          env:
            - name: HF_ENDPOINT
              value: https://matrixhub.example.com
```

The application still uses its normal model-loading code. The difference is that model traffic goes to an endpoint
controlled by the organization. Kubernetes handles placement, restarts, and replica count; the registry handles
the model artifacts.

## Operational considerations

Adding a registry does not remove the need to plan model delivery. In particular, consider the following before
treating it as a shared service:

- **Storage and locality:** Size [persistent storage](/docs/concepts/storage/persistent-volumes/) for the models and
  revisions that must remain available. MatrixHub's current Helm deployment uses persistent volumes for its data,
  so select a StorageClass and capacity that match the models and expected access pattern.
- **Cold starts:** A cache helps after an artifact has been retrieved. Pre-populate or warm the models needed for
  planned rollouts if first-use latency is important.
- **Access control:** MatrixHub supports project-based isolation and RBAC. Apply those controls to private models,
  and manage client credentials as [Kubernetes Secrets](/docs/concepts/configuration/secret/) rather than embedding
  them in Pod specifications.
- **Availability:** Run and back up the registry according to the availability requirements of the inference
  service. An unavailable registry can prevent new Pods from obtaining models, even when existing Pods continue to
  serve traffic.
- **Network policy:** Use [NetworkPolicies](/docs/concepts/services-networking/network-policies/) to allow only the
  required paths between workloads, the registry, and approved upstream sources. This is especially important when
  the registry can retrieve artifacts on demand.
- **Version selection:** Pin the model revision used by a workload. MatrixHub supports tag locking, which can help
  prevent a mutable model reference from making a restart behave differently from the original deployment.

These concerns are familiar from container registries and package mirrors, but model sizes make capacity planning
and rollout testing more visible.

## Where this fits in a Kubernetes AI platform

Kubernetes provides the primitives to schedule accelerator-backed Pods, run batch or serving workloads, expose
services, and manage their lifecycle. A model registry complements those primitives by making model artifacts
available to those workloads through a controlled interface.

```text
+----------------------------------+
| applications and inference tools |
+----------------------------------+
| model registry and model storage |
+----------------------------------+
| Kubernetes: scheduling, services |
| networking, and workload lifecycle |
+----------------------------------+
| compute and accelerator hardware |
+----------------------------------+
```

The right design varies by environment. A development cluster may be fine with direct downloads. A production or
restricted environment often benefits from a registry that can retain approved models and reduce dependence on
external services. The important part is to make model distribution an explicit part of the platform design, then
test it under the same rollout and failure conditions as the inference service itself.
