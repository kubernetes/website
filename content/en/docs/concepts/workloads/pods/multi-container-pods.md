---
title: Multi-Container Pods
content_type: concept
weight: 60
---

<!-- overview -->

This page provides an overview of _multi-container_ Pods.
In Kubernetes, a Pod is the smallest deployable unit and can contain one or more containers.
While many Pods run a single container, multi-container Pods are a powerful feature for implementing advanced design patterns.
These patterns leverage the fact that all containers within a single Pod typically share the same network namespace and can share the same storage volumes.
This co-location allows them to collaborate closely while maintaining separation of concerns.

This page covers:

- Init containers
- Ephemeral containers
- Intra-pod communication mechanisms (localhost, shared volumes)
- Resource sharing and container coordination
- Multi-container design patterns (sidecar, ambassador, adapter) with practical examples
- Good practices, and also anti-patterns to avoid

<!-- body -->

## How containers in a Pod communicate {#inter-container-communication}

Containers in the same Pod typically share the same network namespace and can communicate over localhost.
They can also share storage volumes mounted into the Pod, which allows files and directories to be used as a communication channel.
This section explains the common mechanisms for intra-pod communication, trade-offs between them,
and basic examples showing when to prefer network-based communication versus file-based coordination.

## Resource sharing and container coordination

Multiple containers in a Pod share resources such as CPU, memory, and the Pod's cgroup limits.
Coordination patterns—explicit (for example, a controller container orchestrating lifecycle events)
or implicit (for example, one container writing health information to a shared volume)—help containers cooperate without complex orchestration.
This section describes how resource limits and requests affect multi-container Pods, techniques for coordination, and common pitfalls to avoid.

## Types of container

### Init containers

An init container runs to completion before a Pod's application containers start.
It performs setup tasks such as preparing files, initializing state, or waiting for external services.
For details, see the [Init Containers concept page](/docs/concepts/workloads/pods/init-containers/).

## Understanding ephemeral containers

Pods often contain a primary application container and auxiliary containers that provide supporting functions such as logging, proxying, or adapting data.
Auxiliary containers run alongside or before the app container and use the Pod's shared namespaces and volumes to cooperate while keeping responsibilities separate.

An ephemeral container is a short-lived auxiliary container added to a running Pod to help with debugging and troubleshooting. Key properties:

- not part of the Pod's original spec; created only for inspection or debugging
- share the Pod's namespaces and volumes so they can inspect processes, network state, and files
- are not restarted by the kubelet and do not change Pod scheduling or readiness
- intended for diagnostics only, not for production behavior

Add ephemeral containers with `kubectl debug` to run a shell, profiling tools, or other diagnostics against the running app container.
See the [Ephemeral containers concept page](/docs/concepts/workloads/pods/ephemeral-containers/) for examples and limitations.

## Multi-container design patterns

### Sidecar
The Sidecar pattern involves running a helper container alongside your main application container within the same Pod. This pattern is commonly used for tasks like logging agents, service proxies, or configuration managers that need to share the same network namespace and storage volumes as the application.

In Kubernetes, you can implement this pattern in two ways:

- Native sidecar containers: You define each sidecar in `.spec.initContainers` with `restartPolicy: Always`. The app container is defined as normal in `.spec.containers`. Unlike regular init containers, native sidecars continue running after the main app container has started, and Kubernetes manages their lifecycle specially to provide better guarantees for long-lived helper processes.

- Multiple application containers: The app container and its helper container(s) are both defined in the `.spec.containers` list. Kubernetes does not manage the sidecar lifecycle specially, so this approach is **not** recommended.

For a deep dive into the native implementation, see the dedicated [Sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/) documentation concept page for more details.

### Ambassador

An ambassador container proxies connections between containers in the Pod and external services.
The ambassador is typically implemented as a sidecar so the application can connect to `localhost` and remain unaware of the external endpoint.

Here’s a minimal sidecar example that forwards local port `5432` to an external database:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: ambassador-sidecar-example
spec:
  initContainers:
  - name: ambassador-sidecar
    image: quay.io/prometheus/busybox:latest
    restartPolicy: Always
    args: ["--target-db", "external-db.example.com:5432"]
    ports:
    - containerPort: 5432
  containers:
  - name: main-app
    image: quay.io/centos/centos:stream9
    env:
    - name: DATABASE_URL
      value: "localhost:5432"
```

In this example, the `ambassador-sidecar` listens on `localhost:5432` inside the Pod and forwards traffic to `external-db.example.com:5432`.

Use a production-ready proxy when you need TLS, retries, or observability.

### Adapter

An adapter container transforms data between the main container and external systems (for example, log formatting or protocol conversion).
The adapter sits alongside the primary application, receives output through a shared volume or localhost, and performs the adaptation before sending data onward.

Here’s an example of the adapter pattern:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: adapter-pattern-example
spec:
  initContainers:
  - name: adapter
    image: quay.io/fluent/fluent-bit:3.0
    restartPolicy: Always
    volumeMounts:
    - name: shared-logs
      mountPath: /var/log/app
    args: ["--input", "/var/log/app/raw.log", "--output", "-"]
  containers:
  - name: main-app
    image: quay.io/centos/centos:stream9
    volumeMounts:
    - name: shared-logs
      mountPath: /var/log/app
  volumes:
  - name: shared-logs
    emptyDir: {}
```

In this example, the *main application container* writes raw logs to `/var/log/app/raw.log`.
The *adapter container* reads the raw logs, transforms them into a standard format, and writes the processed logs to stdout.
Both containers share the `shared-logs` volume for communication.

## Good practices and anti-patterns

This section summarizes recommended practices and common anti-patterns when designing multi-container Pods.

### Good practices

- Single responsibility: give each container a focused role (for example, logging, proxying, or adapting data).
- Use shared resources judiciously: prefer shared volumes and network namespaces for basic coordination; enforce access control to avoid races.
- Design for resilience: handle restarts gracefully and use [probes](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes) where appropriate.
- Document roles: describe the purpose and interactions of each container in the Pod.

### Anti-patterns

- Overloading a Pod: do not put unrelated services in the same Pod; prefer separate Pods for unrelated workloads.
- Using Pods as a workaround: avoid using multi-container Pods to work around missing orchestration features; use Deployments, Services, or ConfigMaps instead.
- Ignoring resource limits: sidecars should have a memory limit and a CPU request; the app container or the overall Pod should also have an appropriate CPU request and memory limit.
