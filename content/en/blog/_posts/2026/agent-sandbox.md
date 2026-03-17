---
layout: blog
title: "Running Agents on Kubernetes with Agent Sandbox"
draft: true
date: 2026-XX-XXT10:00:00+00:00
slug: running-agents-on-kubernetes-with-agent-sandbox
author: >
  [Janet Kuo](https://github.com/janetkuo)
  [Justin Santa Barbara](https://github.com/justinsb)
---

The landscape of artificial intelligence is undergoing a massive architectural shift. In the early days of generative AI, interacting with a model was often treated as a transient, stateless function call: a request that spun up, executed for perhaps 50 milliseconds, and terminated.

Today, we are witnessing AI v2 eating AI v1. We are moving from short-lived, isolated tasks to deploying multiple, coordinated AI agents that run constantly. These autonomous agents need to maintain context, use external tools, write and execute code, and communicate with one another over extended periods.

As platform engineering teams look for the right infrastructure to host these new AI workloads, one platform stands out as the natural choice: Kubernetes. However, mapping these unique agentic workloads to traditional Kubernetes primitives requires a new abstraction.

This is where the new [Agent Sandbox](https://github.com/kubernetes-sigs/agent-sandbox) project (currently in development under SIG Apps) comes into play.

## The Kubernetes Advantage (and the Abstraction Gap)

Kubernetes is the de facto standard for orchestrating cloud-native applications precisely because it solves the challenges of extensibility, robust networking, and ecosystem maturity. However, as AI evolves from short-lived inference requests to long-running, autonomous agents, we are seeing the emergence of a new operational pattern. 

AI agents, by contrast, are typically isolated, stateful, singleton workloads. They act as a digital workspace or execution environment for an LLM. An agent needs a persistent identity and a secure scratchpad for writing and executing (often untrusted) code. Crucially, because these long-lived agents are expected to be mostly idle except for brief bursts of activity, they require a lifecycle that supports mechanisms like suspension and rapid resumption.

While you could theoretically approximate this by stringing together a StatefulSet of size 1, a headless Service, and a PersistentVolumeClaim for every single agent, managing this at scale becomes an operational nightmare.

Because of these unique properties, traditional Kubernetes primitives don't perfectly align.

## Introducing Kubernetes Agent Sandbox

To bridge this gap, SIG Apps is developing [agent-sandbox](https://github.com/kubernetes-sigs/agent-sandbox). The project introduces a declarative, standardized API specifically tailored for singleton, stateful workloads like AI agent runtimes.

At its core, the project introduces the `Sandbox` CRD. It acts as a lightweight, single-container environment built entirely on Kubernetes primitives, offering:

* **Strong Isolation for Untrusted Code**: When an AI agent generates and executes code autonomously, security is paramount. The `Sandbox` CRD natively supports different runtimes like gVisor or Kata Containers. This provides the necessary kernel and network isolation required for multi-tenant, untrusted execution.
* **Lifecycle Management**: Unlike traditional web servers, an AI agent might be idle for hours waiting for a human prompt or a trigger from another agent, and then burst into activity. Agent Sandbox allows workloads to be scaled to zero (paused) and resumed.
* **Stable Identity**: Coordinated multi-agent systems require stable networking. Every Sandbox is given a stable hostname and network identity, allowing distinct agents to discover and communicate with each other seamlessly.

## Scaling Agents with Extensions

Because the AI space is moving incredibly quickly, we built an Extensions API layer that enables even faster iteration and development.

Starting a new pod adds about a second of overhead. That's perfectly fine when deploying a new version of a microservice, but when an agent is invoked after being idle, a one-second cold start breaks the continuity of the interaction. It forces the user or the orchestrating service to wait for the environment to provision before the model can even begin to think or act. `SandboxWarmPool` solves this by maintaining a pool of pre-provisioned Sandbox pods, effectively eliminating cold starts. Users or orchestration services can simply issue a `SandboxClaim` against a `SandboxTemplate`, and the controller immediately hands over a pre-warmed, fully isolated environment to the agent.

## Quick Start

Ready to try it yourself? You can install the Agent Sandbox core components and extensions directly into your cluster using our latest release:

```bash
# Replace "vX.Y.Z" with a specific version tag (e.g., "v0.1.0") from
# https://github.com/kubernetes-sigs/agent-sandbox/releases
export VERSION="vX.Y.Z"

# Install the core components:
kubectl apply -f https://github.com/kubernetes-sigs/agent-sandbox/releases/download/${VERSION}/manifest.yaml

# Install the extensions components (optional):
kubectl apply -f https://github.com/kubernetes-sigs/agent-sandbox/releases/download/${VERSION}/extensions.yaml

# Install the Python SDK (optional):
pip install k8s-agent-sandbox
```

Once installed, you can try out our [Python SDK](https://github.com/kubernetes-sigs/agent-sandbox/tree/main/clients/python/agentic-sandbox-client) for AI agents or deploy one of our ready-to-use [examples](https://github.com/kubernetes-sigs/agent-sandbox/tree/main/examples) to see how easy it is to spin up an isolated agent environment.

## The Future of Agents is Cloud Native

Whether it’s a 50-millisecond stateless task, or a multi-week, mostly-idle collaborative process, extending Kubernetes with primitives designed specifically for isolated stateful singletons allows us to leverage all the robust benefits of the cloud-native ecosystem.

The Agent Sandbox project is open source and community-driven. If you are building AI platforms, developing agentic frameworks, or are interested in Kubernetes extensibility, we invite you to get involved:

* Check out the project on GitHub: [kubernetes-sigs/agent-sandbox](https://github.com/kubernetes-sigs/agent-sandbox)
* Join the discussion in the [#sig-apps](https://kubernetes.slack.com/messages/sig-apps) and [#agent-sandbox](https://kubernetes.slack.com/messages/agent-sandbox) channels on the Kubernetes Slack.
