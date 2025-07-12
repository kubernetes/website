---
title: Advanced Pod Configuration
api_metadata:
- apiVersion: "v1"
  kind: "Pod"
content_type: concept
weight: 180
---

<!-- overview -->

This page covers advanced Pod configuration topics including priority classes, runtime classes, detailed security context configuration, and node selection strategies.

<!-- body -->

## Priority Classes

Priority classes allow you to set the importance of Pods relative to other Pods. When a Pod cannot be scheduled, the scheduler tries to preempt (evict) lower priority Pods to make scheduling of the higher priority Pod possible.

### Understanding Priority Classes

A PriorityClass is a cluster-scoped API object that maps a priority class name to an integer priority value. Higher numbers indicate higher priority.

### Creating Priority Classes

```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: high-priority
value: 1000000
globalDefault: false
description: "Priority class for high-priority workloads"
```

### Using Priority Classes in Pods

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
  - name: nginx
    image: nginx
  priorityClassName: high-priority
```

### Built-in Priority Classes

Kubernetes provides two built-in priority classes:
- `system-cluster-critical`: For system components that are critical to the cluster
- `system-node-critical`: For system components that are critical to individual nodes

For more information, see [Pod Priority and Preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/).

## Runtime Classes

Runtime classes allow you to select different container runtimes for different Pods. This is useful when you need different isolation levels or runtime features.

### Understanding Runtime Classes

RuntimeClass is a cluster-scoped resource that represents a container runtime supported in your cluster. The cluster administrator sets up and configures the concrete runtimes backing the RuntimeClass.

### Using Runtime Classes

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  runtimeClassName: myclass
  containers:
  - name: mycontainer
    image: nginx
```

For more information, see [Runtime Class](/docs/concepts/containers/runtime-class/).

## Advanced Security Context Configuration

The `securityContext` field in the Pod specification provides granular control over security settings for Pods and containers.

### Pod-level Security Context

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: security-context-demo
spec:
  securityContext:
    runAsUser: 1000
    runAsGroup: 3000
    fsGroup: 2000
  containers:
  - name: sec-ctx-demo
    image: busybox
    command: ["sh", "-c", "sleep 1h"]
```

### Container-level Security Context

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: security-context-demo-2
spec:
  containers:
  - name: sec-ctx-demo-2
    image: gcr.io/google-samples/node-hello:1.0
    securityContext:
      allowPrivilegeEscalation: false
      runAsNonRoot: true
      runAsUser: 1000
      capabilities:
        drop:
        - ALL
      seccompProfile:
        type: RuntimeDefault
```

### Security Context Options

- **User and Group IDs**: Control which user/group the container runs as
- **Capabilities**: Add or drop Linux capabilities
- **Seccomp Profiles**: Set security computing profiles
- **SELinux Options**: Configure SELinux context
- **Windows Options**: Configure Windows-specific security settings

{{< caution >}}
You can also use the Pod securityContext to enable
[_privileged mode_](/docs/concepts/security/linux-kernel-security-constraints/#privileged-containers)
in Linux containers. Privileged mode overrides many of the other security
settings in the securityContext. Avoid using this setting unless you can't grant
the equivalent permissions by using other fields in the securityContext.
In Kubernetes 1.26 and later, you can run Windows containers in a similarly
privileged mode by setting the `windowsOptions.hostProcess` flag on the
security context of the Pod spec. For details and instructions, see
[Create a Windows HostProcess Pod](/docs/tasks/configure-pod-container/create-hostprocess-pod/).
{{< /caution >}}

For more information, see [Configure a Security Context for a Pod or Container](/docs/tasks/configure-pod-container/security-context/).

## Node Selection Strategies

Kubernetes provides several mechanisms to control which nodes your Pods are scheduled on.

### Node Selectors

The simplest form of node selection constraint:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
  - name: nginx
    image: nginx
  nodeSelector:
    disktype: ssd
```

### Node Affinity

Node affinity allows you to specify rules that constrain which nodes your Pod can be scheduled on:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: with-node-affinity
spec:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: topology.kubernetes.io/zone
            operator: In
            values:
            - antarctica-east1
            - antarctica-west1
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 1
        preference:
          matchExpressions:
          - key: another-node-label-key
            operator: In
            values:
            - another-node-label-value
  containers:
  - name: with-node-affinity
    image: registry.k8s.io/pause:3.8
```

### Tolerations

Tolerations allow Pods to be scheduled on nodes with matching taints:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: myapp
    image: nginx
  tolerations:
  - key: "key"
    operator: "Equal"
    value: "value"
    effect: "NoSchedule"
```

For more information, see [Assign Pods to Nodes](/docs/concepts/scheduling-eviction/assign-pod-node/).

## Pod Overhead

Pod overhead allows you to account for the resources consumed by the Pod infrastructure on top of the container requests and limits.

```yaml
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: kata-fc
handler: kata-fc
overhead:
  podFixed:
    memory: "2Gi"
    cpu: "500m"
---
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  runtimeClassName: kata-fc
  containers:
  - name: myapp
    image: nginx
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
```

## {{% heading "whatsnext" %}}

* Learn about [Pod Priority and Preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
* Read about [Runtime Class](/docs/concepts/containers/runtime-class/)
* Explore [Configure a Security Context for a Pod or Container](/docs/tasks/configure-pod-container/security-context/)
* Understand [Assign Pods to Nodes](/docs/concepts/scheduling-eviction/assign-pod-node/)
* Learn about [Pod Overhead](/docs/concepts/scheduling-eviction/pod-overhead/) 