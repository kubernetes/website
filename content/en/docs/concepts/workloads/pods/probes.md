---
title: "Probes"
content_type: concept
weight: 10
---

<!-- overview -->

This page provides an overview of Probes. Probes in Kubernetes serve as a health checker for the 
containers, ensuring their reliability and availability within the pods. These diagnostic tools 
enable Kubernetes to monitor the health of the workloads and take appropriate actions when 
issues arise, like restarting unhealthy containers or temporarily removing pods from service 
endpoints. Configuring probes is essential for maintaining the stability, resilience, and 
overall performance of applications in the Kubernetes cluster.

## Overview of Probes

Kubernetes supports three main types of probes, each serving a specific purpose:

- **Liveness Probe:** Checks if a container is still running. If the liveness probe fails, 
Kubernetes restarts the container to recover from issues like deadlocks or crashes.
- **Readiness Probe:** Determines if a container is ready to handle traffic. If the readiness 
probe fails, the Pod is removed from the Service's endpoint list, preventing traffic from being 
routed to it.
- **Startup Probe:** Ensures that a container has successfully started. It is particularly 
useful for applications with long initialization times. Startup probes override liveness and 
readiness probes until they succeed.

---

## Probe Configuration

Probes are configured as part of the Pod specification in YAML manifests. Each probe can define 
multiple parameters to suit specific application requirements. Below are the details for 
configuring each type of probe:

### Key Fields
- `path`: The HTTP endpoint to query.
- `port`: The container port to target.
- `initialDelaySeconds`: Time to wait before starting the probe.
- `periodSeconds`: Interval between probe attempts.
- `timeoutSeconds`: Maximum time to wait for a response.
- `failureThreshold`: Number of consecutive failures before the probe is considered failed.
- `successThreshold`: Number of consecutive successes before the probe is considered successful.

### HTTP Probe

An HTTP probe sends an HTTP GET request to a specific endpoint within the container. This is 
useful for applications exposing an HTTP server.

Example Configuration
```yaml
livenessProbe:
  httpGet:
    path: /healthz
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 10
  timeoutSeconds: 2
  failureThreshold: 3
  successThreshold: 1
```

---

### TCP Probe

A TCP probe attempts to establish a TCP connection on a specified port. This is useful for 
applications that don't use HTTP but expose services on a specific port.

Example Configuration
```yaml
readinessProbe:
  tcpSocket:
    port: 3306
  initialDelaySeconds: 10
  periodSeconds: 5
```

### Key Fields
- **`tcpSocket`**: Specifies the target port for the TCP check.
- Other fields like `initialDelaySeconds`, `periodSeconds`, `timeoutSeconds`, 
`failureThreshold`, and `successThreshold` work similarly to HTTP probes.

---

### Exec Probe

An exec probe runs a command inside the container and determines health based on the exit code.

Example Configuration
```yaml
startupProbe:
  exec:
    command:
      - cat
      - /tmp/ready
  initialDelaySeconds: 10
  periodSeconds: 5
```

### Behavior
- An **exit code of `0`** indicates success.
- A **non-zero exit code** indicates failure.

---

## gRPC Health Checks

Kubernetes can use the gRPC health check protocol for monitoring gRPC services. The gRPC health 
check response includes different statuses that can be leveraged for configuring liveliness and
readiness probes.

### ServiceStatus Fields Used
Kubernetes can interpret the following gRPC health check statuses:

- **`SERVING`**: The service is healthy.
- **`NOT_SERVING`**: The service is running but should not receive traffic.
- **`UNKNOWN`**: The service status is uncertain, and it is generally treated as a failure.

### Customizing Probes with gRPC Health Checks
It is possible to set up Kubernetes probes such that:
- A `SERVING` response is considered **ready**.
- A `SERVING` or `NOT_SERVING` response is considered **alive**.
- An `UNKNOWN` response will fail both **ready** and **alive** checks.

### Example: Using gRPC Health Probe
```yaml
livenessProbe:
  exec:
    command:
      - grpc-health-probe
      - -addr=127.0.0.1:50051
      - -service=my-service
  failureThreshold: 3

readinessProbe:
  exec:
    command:
      - grpc-health-probe
      - -addr=127.0.0.1:50051
      - -service=my-service
  successThreshold: 1
```

This ensures that if the gRPC service returns `NOT_SERVING`, the liveness check will still pass, 
keeping the container running, but the readiness probe will fail, removing it from traffic 
routing.

---

## Debugging Probes

Probes may fail due to misconfiguration or application issues. Use the following commands to inspect the configuration and status of probes:

```bash
kubectl describe pod <pod-name>
```

### Common Issues
- **Incorrect Endpoint Configuration:** Ensure the `path` and `port` are correct for HTTP and TCP probes.
- **Aggressive Timing Settings:** Probes with short `timeoutSeconds` or `failureThreshold` values can lead to unnecessary restarts.
- **Application Latency:** Increase `initialDelaySeconds` for slow-starting applications.

---

## Best Practices

Choose the Right Probe for the Use Case:
   - Use `livenessProbe` for detecting and recovering from container crashes or deadlocks.
   - Use `readinessProbe` to control traffic routing and ensure requests are only routed to ready containers.
   - Use `startupProbe` for applications that require significant initialization time.

---

## Learn More

For additional details, refer to the following resources:

- [Learn more about Probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)

---
