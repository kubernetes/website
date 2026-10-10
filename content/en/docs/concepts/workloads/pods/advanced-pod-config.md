---
title: Advanced Pod Configuration
api_metadata:
- apiVersion: "v1"
  kind: "Pod"
content_type: concept
weight: 180
---

<!-- overview -->

This page covers advanced Pod configuration topics including [PriorityClasses](#priorityclasses), [RuntimeClasses](#runtimeclasses),
[security context](#security-context) within Pods, and introduces aspects of [scheduling](/docs/concepts/scheduling-eviction/#scheduling).

<!-- body -->

## PriorityClasses

_PriorityClasses_ allow you to set the importance of Pods relative to other Pods.
If you assign a priority class to a Pod, Kubernetes sets the `.spec.priority` field for that Pod
based on the PriorityClass you specified (you cannot set `.spec.priority` directly).
If or when a Pod cannot be scheduled, and the problem is due to a lack of resources, the {{< glossary_tooltip term_id="kube-scheduler" text="kube-scheduler" >}}
tries to {{< glossary_tooltip text="preempt" term_id="preemption" >}} lower priority
Pods, in order to make scheduling of the higher priority Pod possible.

A PriorityClass is a cluster-scoped API object that maps a priority class name to an integer priority value. Higher numbers indicate higher priority.

### Defining a PriorityClass

```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: high-priority
value: 10000
globalDefault: false
description: "Priority class for high-priority workloads"
```

### Specify pod priority using a PriorityClass

{{< highlight yaml "hl_lines=9" >}}
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
  - name: nginx
    image: nginx
  priorityClassName: high-priority
{{< /highlight >}}

### Built-in PriorityClasses

Kubernetes provides two built-in PriorityClasses:
- `system-cluster-critical`: For system components that are critical to the cluster
- `system-node-critical`: For system components that are critical to individual nodes. This is the highest priority that Pods can have in Kubernetes.

For more information, see [Pod Priority and Preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/).

## RuntimeClasses

A _RuntimeClass_ allows you to specify the low-level container runtime for a Pod. It is useful when you want to specify different container runtimes for different kinds of Pod, such as when you need different isolation levels or runtime features.

### Example Pod {#runtimeclass-pod-example}

{{< highlight yaml "hl_lines=6" >}}
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  runtimeClassName: myclass
  containers:
  - name: mycontainer
    image: nginx
{{< /highlight >}}

A [RuntimeClass](/docs/concepts/containers/runtime-class/) is a cluster-scoped object that represents a container runtime that is available on some or all of your node.

The cluster administrator installs and configures the concrete runtimes backing the RuntimeClass.

They might set up that special container runtime configuration on all nodes, or perhaps just on some of them.

For more information, see the [RuntimeClass](/docs/concepts/containers/runtime-class/) documentation.

## Pod and container level security context configuration {#security-context}

The `Security context` field in the Pod specification provides granular control over security settings for Pods and containers.

### Pod-wide `securityContext` {#pod-level-security-context}

Some aspects of security apply to the whole Pod; for other aspects,
you might want to set a default, without any container-level overrides.

Here's an example of using `securityContext` at the Pod level:

#### Example Pod {#pod-level-security-context-example}

{{< highlight yaml "hl_lines=5-9" >}}
apiVersion: v1
kind: Pod
metadata:
  name: security-context-demo
spec:
  securityContext:  # This applies to the entire Pod
    runAsUser: 1000
    runAsGroup: 3000
    fsGroup: 2000
  containers:
  - name: sec-ctx-demo
    image: registry.k8s.io/e2e-test-images/agnhost:2.45
    command: ["sh", "-c", "sleep 1h"]
{{< /highlight >}}

### Container-level security context {#container-level-security-context}

You can specify the security context just for a specific container.
Here's an example:

#### Example Pod {#container-level-security-context-example}

{{< highlight yaml "hl_lines=9-17" >}}
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
{{< /highlight >}}

### Security context options

- **User and Group IDs**: Control which user/group the container runs as
- **Capabilities**: Add or drop Linux capabilities
- **Seccomp Profiles**: Set security computing profiles
- **SELinux Options**: Configure SELinux context
- **AppArmor**: Configure AppArmor profiles for additional access control
- **Windows Options**: Configure Windows-specific security settings

{{< caution >}}
You can also use the Pod `securityContext` to allow
[_privileged mode_](/docs/concepts/security/linux-kernel-security-constraints/#privileged-containers)
in Linux containers. Privileged mode overrides many of the other security settings in the `securityContext`.
Avoid using this setting unless you can't grant the equivalent permissions by using other fields in the `securityContext`.
You can run Windows containers in a similarly
privileged mode by setting the `windowsOptions.hostProcess` flag on the
Pod-level security context. For details and instructions, see
[Create a Windows HostProcess Pod](/docs/tasks/configure-pod-container/create-hostprocess-pod/).
{{< /caution >}}

For more information, see [Configure a Security Context for a Pod or Container](/docs/tasks/configure-pod-container/security-context/).

## Influencing Pod scheduling decisions {#scheduling}

Kubernetes provides several mechanisms to control which nodes your Pods are scheduled on.

### Node selectors

The simplest form of node selection constraint:

{{< highlight yaml "hl_lines=9-11" >}}
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
{{< /highlight >}}

### Node affinity

Node affinity allows you to specify rules that constrain which nodes your Pod can be scheduled on. Here's an example of a Pod that prefers running on nodes labelled as being on a particular continent, selecting based on the value of [`topology.kubernetes.io/zone`](/docs/reference/labels-annotations-taints/#topologykubernetesiozone) label.

{{< highlight yaml "hl_lines=6-15" >}}
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
  containers:
  - name: with-node-affinity
    image: registry.k8s.io/pause:3.8
{{< /highlight >}}

### Pod affinity and anti-affinity

In addition to node affinity, you can also constrain which nodes a Pod can be scheduled on based on the labels of _other Pods_ that are already running on nodes. Pod affinity allows you to specify rules about where a Pod should be placed relative to other Pods.

{{< highlight yaml "hl_lines=6-15" >}}
apiVersion: v1
kind: Pod
metadata:
  name: with-pod-affinity
spec:
  affinity:
    podAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchExpressions:
          - key: app
            operator: In
            values:
            - database
        topologyKey: topology.kubernetes.io/zone
  containers:
  - name: with-pod-affinity
    image: registry.k8s.io/pause:3.8
{{< /highlight >}}

### Tolerations

_Tolerations_ allow Pods to be scheduled on nodes with matching taints:

{{< highlight yaml "hl_lines=9-13" >}}
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
{{< /highlight >}}

For more information, see [Assign Pods to Nodes](/docs/concepts/scheduling-eviction/assign-pod-node/).

## Pod overhead

Pod overhead allows you to account for the resources consumed by the Pod infrastructure on top of the container requests and limits.

{{< highlight yaml "hl_lines=7-10" >}}
---
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: kvisor-runtime
handler: kvisor-runtime
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
  runtimeClassName: kvisor-runtime
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
{{< /highlight >}}


## {{% heading "whatsnext" %}}

* Read about [Pod Priority and Preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
* Read about [RuntimeClasses](/docs/concepts/containers/runtime-class/)
* Explore [Configure a Security Context for a Pod or Container](/docs/tasks/configure-pod-container/security-context/)
* Learn how Kubernetes [assigns Pods to Nodes](/docs/concepts/scheduling-eviction/assign-pod-node/)
* [Pod Overhead](/docs/concepts/scheduling-eviction/pod-overhead/)
