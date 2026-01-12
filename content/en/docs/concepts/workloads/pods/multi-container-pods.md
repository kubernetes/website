---
reviewers:
- TBD
title: Multi Container Pods
content_type: concept
weight: 60
---

<!-- overview -->

{{< feature-state state="stable" for_k8s_version="v1.25" >}}

This page provides an overview of multi container pods. In Kubernetes, a Pod is the smallest deployable unit and can contain one or more containers. While many Pods run a single container, "multi-container Pods" are a powerful feature for implementing advanced design patterns. These patterns leverage the fact that all containers within a single Pod share the same network namespace (e.g., localhost) and can share the same storage volumes. This co-location allows them to collaborate closely while maintaining separation of concerns.

This page covers:

- Ephemeral containers
- Intra-pod communication mechanisms (localhost, shared volumes)
- Resource sharing and container coordination
- Multi-container design patterns (sidecar, ambassador, adapter) with practical examples
- Best practices and anti-patterns


<!-- body -->

## Understanding ephemeral containers
See the existing [Ephemeral containers](/docs/concepts/workloads/pods/ephemeral-containers/) concept page for more details.


## Intra-pod communication mechanisms (localhost, shared volumes)
Containers in the same Pod share the same network namespace and can communicate over localhost. They can also share storage volumes mounted into the Pod, which allows files and directories to be used as a communication channel. This section explains the common mechanisms for intra-pod communication, trade-offs between them, and simple examples showing when to prefer network-based communication versus file-based coordination.
## Resource sharing and container coordination
Multiple containers in a Pod share certain resources such as CPU, memory, and the Pod's cgroup limits. Coordination patterns—explicit (e.g., a controller container orchestrating lifecycle events) or implicit (e.g., one container writing health information to a shared volume)—help containers cooperate without requiring complex orchestration. This section will describe how resource limits and requests affect multi-container Pods, techniques for coordination, and common pitfalls to avoid.

## Multi-container design patterns
### Sidecar
See the existing [Sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/) concept page for more details.

### Ambassador
An ambassador container proxies connections between the other containers in the Pod and external services. This pattern is useful when you need to adapt or translate protocols, implement connection pooling, or provide observability without changing the main application container.

Here’s an example of the ambassador pattern:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: ambassador-pattern-example
spec:
  containers:
  - name: main-app
    image: nginx
    ports:
    - containerPort: 80
    env:
    - name: DATABASE_URL
      value: "localhost:5432" # Points to the ambassador container
  - name: ambassador
    image: postgres-proxy
    args: ["--target-db", "external-db.example.com:5432"]
    ports:
    - containerPort: 5432
```

In this example, the **Ambassador Container** (`postgres-proxy`) listens on port `5432` and forwards traffic to the external database (`external-db.example.com:5432`). The **Main Application Container** (`nginx`) connects to `localhost:5432`, unaware of the external database details.

This setup allows the ambassador to handle connection pooling, protocol translation, or observability without modifying the main application.

### Adapter 
An adapter container transforms data between the main container and external systems (for example, log formatting or protocol conversion). The adapter sits alongside the primary application, receives output through a shared volume or localhost, and performs the adaptation before sending data onward. This section will present typical use cases and a small sketch of how to wire an adapter into your Pod.



## Best practices and anti-patterns
This section summarizes recommended practices when designing multi-container Pods (such as preferring single responsibility per container, using sidecars for supplementary tasks, and keeping interfaces between containers simple). It will also list anti-patterns to avoid, like tightly coupling unrelated services inside a single Pod or using multi-container Pods to work around missing orchestration features.
