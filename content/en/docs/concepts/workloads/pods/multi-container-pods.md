---
title: Multi Container Pods
content_type: concept
weight: 60
---

<!-- overview -->

This page provides an overview of _multi container_ Pods.
In Kubernetes, a Pod is the smallest deployable unit and can contain one or more containers.
While many Pods run a single container, multi-container Pods are a powerful feature for implementing advanced design patterns.
These patterns leverage the fact that all containers within a single Pod share the same network namespace and can share the same storage volumes.
This co-location allows them to collaborate closely while maintaining separation of concerns.

This page covers:

- Ephemeral containers
- Intra-pod communication mechanisms (localhost, shared volumes)
- Resource sharing and container coordination
- Multi-container design patterns (sidecar, ambassador, adapter) with practical examples
- Good practices, and also anti-patterns to avoid


<!-- body -->

## Understanding ephemeral containers
See the existing [Ephemeral containers](/docs/concepts/workloads/pods/ephemeral-containers/) concept page for more details.


## How containers in a Pod can communicate {#inter-container-communication}
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
An adapter container transforms data between the main container and external systems (for example, log formatting or protocol conversion). The adapter sits alongside the primary application, receives output through a shared volume or localhost, and performs the adaptation before sending data onward.

Here’s an example of the adapter pattern:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: adapter-pattern-example
spec:
  containers:
  - name: main-app
    image: custom-logger
    volumeMounts:
    - name: shared-logs
      mountPath: /var/log/app
  - name: adapter
    image: log-adapter
    volumeMounts:
    - name: shared-logs
      mountPath: /var/log/app
    args: ["--input", "/var/log/app/raw.log", "--output", "/var/log/app/processed.log"]
  volumes:
  - name: shared-logs
    emptyDir: {}
```

In this example the **Main Application Container** writes raw logs to `/var/log/app/raw.log`. The **Adapter Container** reads the raw logs, transforms them into a standard format, and writes the processed logs to `/var/log/app/processed.log`. Both containers share the `shared-logs` volume for communication.

## Best practices and anti-patterns
This section summarizes recommended practices when designing multi-container Pods (such as preferring single responsibility per container, using sidecars for supplementary tasks, and keeping interfaces between containers simple). It will also list anti-patterns to avoid, like tightly coupling unrelated services inside a single Pod or using multi-container Pods to work around missing orchestration features.

### Best Practices for Multi-Container Pods

1. **Single Responsibility per Container**:
   - Each container should focus on a specific task (e.g., logging, proxying, or adapting data).
   - Avoid overloading a single container with multiple responsibilities.

2. **Use Shared Resources Judiciously**:
   - Leverage shared volumes and network namespaces for communication between containers.
   - Ensure proper access control to avoid race conditions or data corruption.

3. **Design for Resilience**:
   - Handle container restarts gracefully.
   - Use readiness and liveness probes to monitor container health.

4. **Keep Interfaces Simple**:
   - Use well-defined communication protocols (e.g., HTTP, gRPC) or shared files for interaction between containers.

5. **Document Container Roles**:
   - Clearly document the purpose and interactions of each container in the Pod.

### Anti-Patterns to Avoid

1. **Tightly Coupled Containers**:
   - Avoid making containers overly dependent on each other. Each container should be replaceable without affecting the others.

2. **Overloading a Pod**:
   - Don’t cram unrelated services into a single Pod. Use separate Pods for unrelated workloads.

3. **Using Multi-Container Pods as a Workaround**:
   - Don’t use multi-container Pods to compensate for missing orchestration features. Use Kubernetes-native solutions like Deployments, Services, or ConfigMaps.

4. **Ignoring Resource Limits**:
   - Always define resource requests and limits for each container to prevent resource contention.
