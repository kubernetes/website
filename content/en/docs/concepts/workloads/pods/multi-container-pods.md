---
title: Multi-Container Pods
content_type: concept
weight: 55
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
and when to prefer network-based communication versus file-based coordination.

### Communicating over localhost

All containers in a Pod share one network namespace, which means they share a single IP address,
a single set of network interfaces, and a single port space.
A container can reach another container in the same Pod by connecting to `localhost` (or `127.0.0.1`)
on the port the other container listens on.
This traffic never leaves the Pod, so it is not affected by
[NetworkPolicies](/docs/concepts/services-networking/network-policies/) or Services.

Because the port space is shared, two containers in the same Pod cannot listen on the same port.
If they try, the second container fails to bind and typically exits with an error.
Plan port assignments for every container in the Pod, including sidecars that you add later.

In the following example, the `client` sidecar sends a request to the `web` container over `localhost` every five seconds:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: localhost-example
spec:
  initContainers:
  - name: client
    image: registry.k8s.io/busybox:1.27.2
    restartPolicy: Always
    command: ["sh", "-c", 'while true; do wget -qO- http://localhost:80 | head -n 4; sleep 5; done']
  containers:
  - name: web
    image: nginx:1.29
    ports:
    - containerPort: 80
```

To see the responses, check the logs of the `client` container:

```shell
kubectl logs localhost-example -c client
```

Containers in a Pod also share the same hostname, and on Linux they share the same IPC namespace,
so they can use standard inter-process communication mechanisms such as System V semaphores or POSIX shared memory.

### Communicating through shared volumes

A volume defined in `.spec.volumes` can be mounted into any number of containers in the Pod,
each at its own mount path.
Files that one container writes are visible to the other containers that mount the same volume.
An [`emptyDir`](/docs/concepts/storage/volumes/#emptydir) volume is the most common choice:
it is created when the Pod is assigned to a node and deleted when the Pod is removed.

Common uses for shared volumes include:

- an init container or sidecar that downloads or generates configuration that the app container reads at startup
- an app container that writes log files that a sidecar collects, rotates, or forwards
- a Unix domain socket placed on the shared volume, which gives the containers a local socket
  without opening a TCP port

In the following example, an init container writes a web page to an `emptyDir` volume,
and the `web` container serves that page from the same volume:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: shared-volume-example
spec:
  initContainers:
  - name: content-writer
    image: registry.k8s.io/busybox:1.27.2
    command: ["sh", "-c", 'echo "Hello from the init container" > /content/index.html']
    volumeMounts:
    - name: content
      mountPath: /content
  containers:
  - name: web
    image: nginx:1.29
    volumeMounts:
    - name: content
      mountPath: /usr/share/nginx/html
      readOnly: true
  volumes:
  - name: content
    emptyDir:
      sizeLimit: 10Mi
```

Mounting the volume as `readOnly` in the `web` container makes it clear which container owns the data.

If you set `emptyDir.medium` to `Memory`, the volume is backed by tmpfs.
Files written to a memory-backed volume count against the memory limit of the container that wrote them,
so set `emptyDir.sizeLimit` and size that container's memory limit to match.

Kubernetes does not coordinate access to shared files.
If more than one container writes to the same file, you must handle locking or ownership yourself;
a simple approach is to give each file a single writer.

### Sharing the process namespace

By default, each container has its own process namespace.
If you set `shareProcessNamespace: true` in the Pod spec, all containers in the Pod share a single process namespace,
so a container can see and send signals to processes in other containers.
This is useful for sidecars that need to signal the app (for example, to reload configuration)
and for debugging, but it weakens isolation between containers.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: shared-process-example
spec:
  shareProcessNamespace: true
  containers:
  - name: web
    image: nginx:1.29
  - name: shell
    image: registry.k8s.io/busybox:1.27.2
    command: ["sh", "-c", "while true; do sleep 3600; done"]
```

From the `shell` container, you can list the `nginx` processes that run in the `web` container:

```shell
kubectl exec shared-process-example -c shell -- ps
```

See [Share Process Namespace between Containers in a Pod](/docs/tasks/configure-pod-container/share-process-namespace/)
for details.

### Choosing a mechanism

- Use **localhost networking** when the containers already speak a network protocol (HTTP, gRPC, a database protocol),
  when you need request/response semantics, or when you want to be able to move one side into a separate Pod later
  with minimal changes.
- Use **shared volumes** for handing off files, streaming append-only data such as logs,
  one-time setup data from init containers, or Unix domain sockets.
- Use a **shared process namespace** only when a container really needs to see or signal another container's processes.

## Resource sharing and container coordination

Containers in a Pod run on the same node and draw from the same pool of node resources,
but Kubernetes tracks resource requests and limits for each container separately.
This section describes how requests and limits affect multi-container Pods,
techniques for coordinating containers, and common pitfalls to avoid.

### Resource requests and limits

You set `resources.requests` and `resources.limits` on each container, including init containers and sidecar containers.
The kubelet and the container runtime enforce limits per container:
if a container exceeds its memory limit it is OOM-killed and restarted according to its restart policy,
while other containers in the Pod keep running.

The scheduler places the Pod based on its _effective request_.
For each resource, this is the higher of:

- the sum of the requests of all app containers and sidecar containers
- the largest request of any single regular init container, plus the requests of any sidecar containers
  that are already running when that init container starts
  (regular init containers run one at a time, so their requests don't add up)

The effective request also includes any [Pod overhead](/docs/concepts/scheduling-eviction/pod-overhead/).
Because sidecar containers keep running alongside the app containers, their requests add to the Pod's total for the whole life of the Pod.
For the full set of rules, see
[Resource sharing within containers](/docs/concepts/workloads/pods/sidecar-containers/#resource-sharing-within-containers).

For example, the scheduler treats the following Pod as requesting 350m of CPU and 192Mi of memory,
which is the sum of the `log-shipper` sidecar and the `app` container.
The `setup` init container's request is lower than that sum, so it doesn't change the result:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: resources-example
spec:
  initContainers:
  - name: setup
    image: registry.k8s.io/busybox:1.27.2
    command: ["sh", "-c", "echo setting up"]
    resources:
      requests:
        cpu: 200m
        memory: 64Mi
      limits:
        memory: 64Mi
  - name: log-shipper
    image: registry.k8s.io/busybox:1.27.2
    restartPolicy: Always
    command: ["sh", "-c", "while true; do sleep 3600; done"]
    resources:
      requests:
        cpu: 50m
        memory: 64Mi
      limits:
        memory: 64Mi
  containers:
  - name: app
    image: nginx:1.29
    resources:
      requests:
        cpu: 300m
        memory: 128Mi
      limits:
        memory: 128Mi
```

The Pod's [quality of service (QoS) class](/docs/concepts/workloads/pods/pod-qos/) is also based on all of its containers.
For example, if you don't use Pod-level resources, a Pod is `Guaranteed` only if every container,
including sidecars and init containers, has CPU and memory requests equal to its limits.
The Pod in the previous example is `Burstable`, because its containers don't set CPU limits.

If you want to set an overall budget for the Pod rather than for each container, you can use
[Pod-level resources](/docs/tasks/configure-pod-container/assign-pod-level-resources/)
(beta and enabled by default since Kubernetes v1.34; not supported for Windows Pods).
When you set resources at the Pod level, they take precedence over container-level resources
for scheduling and for the Pod's QoS class,
and containers that don't set their own limits can share the Pod's budget:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-level-resources-example
spec:
  resources:
    requests:
      cpu: 500m
      memory: 256Mi
    limits:
      cpu: "1"
      memory: 256Mi
  containers:
  - name: app
    image: nginx:1.29
  - name: helper
    image: registry.k8s.io/busybox:1.27.2
    command: ["sh", "-c", "while true; do sleep 3600; done"]
```

### Coordinating container startup and shutdown

Containers in `.spec.containers` start in parallel, and Kubernetes does not guarantee any ordering between them.
If one container depends on another, use one of these approaches:

- Init containers run to completion, one at a time, before any app containeOverloading starts.
  Use them for one-off setup such as creating files, running migrations, or waiting for a dependency.
- Sidecar containers (init containers with `restartPolicy: Always`) start before the app containers
  and keep running.
  If a sidecar defines a `startupProbe`, the kubelet waits for that probe to succeed before starting the next container,
  so the app container only starts once the sidecar is ready.
  During Pod termination, sidecars are stopped after the app containers, in the reverse order of their definition.
- Application-level checks let a container wait for, or retry against, its dependency.
  This is the most resilient approach, because a dependency can also restart while the Pod is running.

The following example uses a startup probe so that the app container starts only after the sidecar has written its configuration file:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: startup-coordination-example
spec:
  initContainers:
  - name: config-sidecar
    image: registry.k8s.io/busybox:1.27.2
    restartPolicy: Always
    command: ["sh", "-c", 'echo "greeting=hello" > /config/app.conf; while true; do sleep 3600; done']
    startupProbe:
      exec:
        command: ["test", "-f", "/config/app.conf"]
      periodSeconds: 2
    volumeMounts:
    - name: config
      mountPath: /config
  containers:
  - name: main-app
    image: registry.k8s.io/busybox:1.27.2
    command: ["sh", "-c", 'cat /config/app.conf; while true; do sleep 3600; done']
    volumeMounts:
    - name: config
      mountPath: /config
  volumes:
  - name: config
    emptyDir: {}
```

At runtime, containers can also coordinate implicitly through shared state.
For example, a sidecar can write a status file to a shared volume that the app container, or a probe, checks.

### Common pitfalls

- **Assuming start order**: containers in `.spec.containers` start in parallel; use init or sidecar containers when order matters.
- **Assuming shared fate**: when one container restarts, the other containers in the Pod keep running.
  Make each container tolerate its peers restarting.
- **Leaving sidecars without resources**: a sidecar without a memory limit can use memory that the app container needs,
  and a sidecar without requests can make the Pod's effective request lower than its real usage.
- **Unbounded shared volumes**: data in an `emptyDir` volume counts toward the Pod's ephemeral storage (or memory, for tmpfs).
  Rotate or clean up files and set `sizeLimit` to avoid Pod eviction.
- **Port collisions**: two containers that listen on the same port cannot run in the same Pod.

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
    image: docker.io/alpine/socat:1.8.0.3
    restartPolicy: Always
    args: ["tcp-listen:5432,fork", "tcp-connect:external-db.example.com:5432"]
    ports:
    - containerPort: 5432
  containers:
  - name: main-app
    image: quay.io/centos/centos:stream9
    command: ["sleep", "infinity"]
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
    image: registry.k8s.io/busybox:1.27.2
    restartPolicy: Always
    volumeMounts:
    - name: shared-logs
      mountPath: /var/log/app
    command: ["sh", "-c", 'touch /var/log/app/raw.log; tail -F /var/log/app/raw.log | while read line; do echo "adapted: $line"; done']
  containers:
  - name: main-app
    image: quay.io/centos/centos:stream9
    command: ["sh", "-c", 'while true; do echo "$(date) raw event" >> /var/log/app/raw.log; sleep 2; done']
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
