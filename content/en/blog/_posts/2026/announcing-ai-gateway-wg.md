---
title: "Announcing the AI Gateway Working Group"
date: 2026-03-02T10:00:00-08:00
draft: true
slug: announcing-ai-gateway-wg
author: >
  [Keith Mattix](https://github.com/keithmattix),
  [Nir Rozenbaum](https://github.com/nirrozenbaum),
  [Morgan Foster](https://github.com/usize),
  [Flynn](https://github.com/kflynn)
---

The community around Kubernetes includes a number of Special Interest Groups (SIGs) and Working Groups (WGs) facilitating discussions on important topics between interested contributors. Today, we're excited to announce the formation of the [AI Gateway Working Group](https://github.com/kubernetes-sigs/wg-ai-gateway), a new initiative focused on developing standards and best practices for networking infrastructure that supports AI workloads in Kubernetes environments.

## What is an AI Gateway?

In a Kubernetes context, an *AI Gateway* refers to network gateway infrastructure (including proxy servers, load-balancers, etc.) that generally implements the [Gateway API](https://gateway-api.sigs.k8s.io/) specification with enhanced capabilities for AI workloads. Rather than defining a distinct product category, AI Gateways describe infrastructure designed to enforce policy on AI traffic, including:
- Token-based rate limiting for AI APIs.
- Fine-grained access controls for inference APIs.
- Payload inspection enabling intelligent routing, caching, and guardrails.
- Support for AI-specific protocols and routing patterns.

## Working group charter and mission

The AI Gateway Working Group operates under a clear [charter](https://github.com/kubernetes/community/blob/master/wg-ai-gateway/charter.md) with the mission to develop proposals for Kubernetes Special Interest Groups (SIGs) and their sub-projects.
Its primary goals include:
- **Standards Development**: Create declarative APIs, standards, and guidance for AI workload networking in Kubernetes.
- **Community Collaboration**: Foster discussions and build consensus around best practices for AI infrastructure.
- **Extensible Architecture**: Ensure composability, pluggability, and ordered processing for AI-specific gateway extensions.
- **Standards-Based Approach**: Build on established networking foundations, layering AI-specific capabilities on top of proven standards.

## Active proposals

WG AI Gateway currently has several active proposals that address key challenges in
AI workload networking:

### Payload Processing (Proposal 7)

The [payload processing proposal](https://github.com/kubernetes-sigs/wg-ai-gateway/tree/main/proposals/7-payload-processing.md) addresses the critical need for AI workloads to inspect and transform full HTTP request and response payloads.
This enables:
#### AI Inference Security
- Guard against malicious prompts and prompt injection attacks.
- Content filtering for AI responses.
- Signature-based detection and anomaly detection for AI traffic.
#### AI Inference Optimization
- Semantic routing based on request content.
- Intelligent caching to reduce inference costs and improve response times.
- RAG (Retrieval-Augmented Generation) system integration for context enhancement.

The proposal defines standards for declarative payload processor configuration, ordered processing pipelines, and configurable failure modes - all essential for production AI workload deployments.

### Egress gateways (Proposal 10)

Modern AI applications increasingly depend on external inference services, whether for specialized models,
failover scenarios, or cost optimization.
The [egress gateways proposal](https://github.com/kubernetes-sigs/wg-ai-gateway/tree/main/proposals/10-egress-gateways.md) aims to define standards for securely routing traffic outside the cluster.
Key features include:
#### External AI Service Integration
- Secure access to cloud-based AI services (OpenAI, Vertex AI, Bedrock, etc.).
- Managed authentication and token injection for third-party AI APIs.
- Regional compliance and failover capabilities.
#### Advanced Traffic Management
- Backend resource definitions for external FQDNs and services.
- TLS policy management and certificate authority control.
- Cross-cluster routing for centralized AI infrastructure.
#### User Stories We're Addressing
- Platform operators providing managed access to external AI services.
- Developers requiring inference failover across multiple cloud providers.
- Compliance engineers enforcing regional restrictions on AI traffic.
- Organizations centralizing AI workloads on dedicated clusters.

## Upcoming events

### KubeCon + CloudNativeCon Europe 2026, Amsterdam
AI Gateway working group members will be presenting at [KubeCon + CloudNativeCon Europe](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/) in Amsterdam, discussing the problems at the intersection of AI and networking, including the working group's active proposals, as well as the intersection of AI gateways with Model Context Protocol and agent networking patterns.  
This event will showcase how our proposals enable the infrastructure needed for next-generation AI deployments and communication patterns.  
The session will include the initial designs, early prototypes, and emerging directions shaping the WG’s roadmap.  
For more details see our session here:
- [AI'm at the Gate! Introducing the AI Gateway Working Group in Kubernetes](https://kccnceu2026.sched.com/event/2EF5t/aim-at-the-gate-introducing-the-ai-gateway-working-group-in-kubernetes-morgan-foster-nir-rozenbaum-red-hat-shachar-tal-palo-alto-networks?iframe=yes&w=100%&sidebar=yes&bg=no)

## Get involved

The AI Gateway Working Group represents the Kubernetes community's commitment to standardizing AI workload networking. As AI becomes increasingly integral to modern applications, we need robust, standardized infrastructure that can support the unique requirements of inference workloads while maintaining the security, observability, and reliability standards that Kubernetes users expect.  
Our proposals are currently in active development, with implementations beginning across various gateway projects. We're working closely with SIG Network on Gateway API enhancements and collaborating with the broader cloud-native community to ensure our standards meet real-world production needs.

Whether you're a gateway implementer, platform operator, AI application developer, or simply interested in the intersection of Kubernetes and AI, we'd love your input. The working group follows an open contribution model - you can review our proposals, join our weekly meetings, or start discussions on our GitHub repository.
To learn more:

- Visit the working group's umbrella [GitHub repository](https://github.com/kubernetes-sigs/wg-ai-gateway).
- Read the working group's [charter](https://github.com/kubernetes/community/blob/master/wg-ai-gateway/charter.md).
- Join the [weekly meeting](https://docs.google.com/document/d/1nRRkRK2e82mxkT8zdLoAtuhkom2X6dEhtYOJ9UtfZKs) on Thursdays at 2PM EST.
- Connect with the working group on [Slack (#wg-ai-gateway)](https://kubernetes.slack.com/messages/wg-ai-gateway) (visit https://slack.k8s.io/ for an invitation).
- Join the AI Gateway [mailing list](https://groups.google.com/a/kubernetes.io/g/wg-ai-gateway).

The future of AI infrastructure in Kubernetes is being built today, join up and learn how you can contribute and help shape the future of AI-aware gateway capabilities in Kubernetes.
