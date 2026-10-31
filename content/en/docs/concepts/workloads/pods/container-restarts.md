---
title: Container Restarts
content_type: concept
weight: 36
---

<!-- overview -->

Kubernetes manages container failures within Pods using a `restartPolicy`
defined in the Pod spec. This policy determines how Kubernetes reacts to
containers exiting due to errors or other reasons. For a broader view of
how containers move through their lifecycle, see [Pod Lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/).

<!-- body -->

## How Pods handle problems with containers {#container-restarts}

When a container fails, Kubernetes follows this sequence:

1. **Initial crash**: Kubernetes attempts an immediate restart based on the Pod `restartPolicy`.
1. **Repeated crashes**: After the initial crash Kubernetes applies an exponential
   backoff delay for subsequent restarts, described in [`restartPolicy`](#restart-policy).
   This prevents rapid, repeated restart attempts from overloading the system.
1. **CrashLoopBackOff state**: This indicates that the backoff delay mechanism is currently
   in effect for a given container that is in a crash loop, failing and restarting repeatedly.
1. **Backoff reset**: If a container runs successfully for a certain duration
   (e.g., 10 minutes), Kubernetes resets the backoff delay, treating any new crash
   as the first one.

In practice, a `CrashLoopBackOff` is a condition or event that might be seen as output
from the `kubectl` command, while describing or listing Pods, when a container in the Pod
fails to start properly and then continually tries and fails in a loop.

In other words, when a container enters the crash loop, Kubernetes applies the
exponential backoff delay mentioned in the [Container restart policy](#restart-policy).
This mechanism prevents a faulty container from overwhelming the system with continuous
failed start attempts.

The `CrashLoopBackOff` can be caused by issues like the following:

* Application errors that cause the container to exit.
* Configuration errors, such as incorrect environment variables or missing
  configuration files.
* Resource constraints, where the container might not have enough memory or CPU
  to start properly.
* Health checks failing if the application doesn't start serving within the
  expected time.
* Container liveness probes or startup probes returning a `Failure` result
  as mentioned in the [probes](/docs/concepts/workloads/pods/probes/) section.

To investigate the root cause of a `CrashLoopBackOff` issue, a user can:

1. **Check logs**: Use `kubectl logs <name-of-pod>` to check the logs of the container.
   This is often the most direct way to diagnose the issue causing the crashes.
1. **Inspect events**: Use `kubectl describe pod <name-of-pod>` to see events
   for the Pod, which can provide hints about configuration or resource issues.
1. **Review configuration**: Ensure that the Pod configuration, including
   environment variables and mounted volumes, is correct and that all required
   external resources are available.
1. **Check resource limits**: Make sure that the container has enough CPU
   and memory allocated. Sometimes, increasing the resources in the Pod definition
   can resolve the issue.
1. **Debug application**: There might exist bugs or misconfigurations in the
   application code. Running this container image locally or in a development
   environment can help diagnose application specific issues.

### Container restarts {#restart-policy}

When a container in your Pod stops, or experiences failure, Kubernetes can restart it.
A restart isn't always appropriate; for example,
{{< glossary_tooltip text="init containers" term_id="init-container" >}} run only once (if successful),
during Pod startup.
You can configure restarts as a policy that applies to all Pods, or using container-level configuration (for example: when you define a
{{< glossary_tooltip text="sidecar container" term_id="sidecar-container" >}}) or define container-level override.

#### Container restarts and resilience {#container-restart-resilience}

The Kubernetes project recommends following cloud-native principles, including resilient
design that accounts for unannounced or arbitrary restarts. You can achieve this either
by failing the Pod and relying on automatic
[replacement](/docs/concepts/workloads/controllers/), or you can design for container-level resilience.
Either approach helps to ensure that your overall workload remains available despite
partial failure.

#### Pod-level container restart policy

The `spec` of a Pod has a `restartPolicy` field with possible values Always, OnFailure,
and Never. The default value is Always.

The `restartPolicy` for a Pod applies to {{< glossary_tooltip text="app containers" term_id="app-container" >}}
in the Pod and to regular [init containers](/docs/concepts/workloads/pods/init-containers/).
[Sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/)
ignore the Pod-level `restartPolicy` field: in Kubernetes, a sidecar is defined as an
entry inside `initContainers` that has its container-level `restartPolicy` set to `Always`.
For init containers that exit with an error, the kubelet restarts the init container if
the Pod level `restartPolicy` is either `OnFailure` or `Always`:

* `Always`: Automatically restarts the container after any termination.
* `OnFailure`: Only restarts the container if it exits with an error (non-zero exit status).
* `Never`: Does not automatically restart the terminated container.

##### Restart behavior comparison

The following table shows how containers behave under different restart policies and exit codes:

| Exit Code | `restartPolicy: Always` | `restartPolicy: OnFailure` | `restartPolicy: Never` | Sidecar Containers |
|-----------|-------------------------|---------------------------|------------------------|-------------------|
| 0 (Success) | Restarts | Does not restart | Does not restart | Always restarts |
| Non-zero (Failure) | Restarts | Restarts | Does not restart | Always restarts |

{{< note >}}
The restart behavior is particularly important when choosing between Deployments and Jobs:
- **Deployments** typically use `restartPolicy: Always` (the only allowed value) to keep applications running continuously
- **Jobs** commonly use `restartPolicy: OnFailure` or `restartPolicy: Never` to handle batch processing tasks appropriately
- **Sidecar containers** are init containers that always restart regardless of the Pod's `restartPolicy` because they have their own container-level `restartPolicy: Always`
{{< /note >}}

##### Example scenarios

Here are concrete examples demonstrating the different restart behaviors:

**Example 1: Web server with `restartPolicy: Always` (typical for Deployments)**
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: web-server
spec:
  restartPolicy: Always  # Container restarts regardless of exit code
  containers:
  - name: nginx
    image: nginx:1.14.2
    # If this container crashes or exits for any reason, it will be restarted
```

**Example 2: Batch job with `restartPolicy: OnFailure`**
```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: data-processor
spec:
  template:
    spec:
      restartPolicy: OnFailure  # Only restart on non-zero exit codes
      containers:
      - name: processor
        image: busybox:1.28
        command: ['sh', '-c', 'echo "Processing data..."; exit 0']
        # Exit code 0: Job completes successfully, no restart
        # Exit code 1+: Container restarts to retry the task
```

**Example 3: One-time task with `restartPolicy: Never`**
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: migration-task
spec:
  restartPolicy: Never  # Never restart, regardless of exit code
  containers:
  - name: migrate
    image: busybox:1.28
    command: ['sh', '-c', 'echo "Running migration..."; exit 1']
    # Even with exit code 1 (failure), the container will not restart
    # The Pod will remain in Failed state
```

##### Sidecar containers and restart policies

[Sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/) have special restart behavior that differs from regular app containers:

- **Sidecar containers ignore Pod-level `restartPolicy`**: They use their own container-level `restartPolicy` field, which is always set to `Always`
- **Independent lifecycle**: Sidecar containers can restart independently of the main application container
- **Persistent operation**: Sidecar containers remain running throughout the Pod's lifetime to provide supporting services

**Example: Pod with sidecar container**
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-with-sidecar
spec:
  restartPolicy: OnFailure  # Applies to main container only
  initContainers:
  - name: logging-sidecar    # This is a sidecar container
    image: fluent/fluent-bit:1.8
    restartPolicy: Always    # Sidecar always restarts regardless of exit code
    # Provides logging services throughout Pod lifetime
  containers:
  - name: main-app          # This follows Pod-level restartPolicy
    image: nginx:1.14.2
    # Will only restart on failure (non-zero exit) due to Pod's OnFailure policy
```

{{< note >}}
While the main application container follows the Pod's `restartPolicy: OnFailure`, the sidecar container will restart regardless of its exit code because sidecar containers always have `restartPolicy: Always` at the container level.
{{< /note >}}

When the kubelet is handling container restarts according to the configured restart
policy, that only applies to restarts that make replacement containers inside the
same Pod and running on the same node. After containers in a Pod exit, the kubelet
restarts them with an exponential backoff delay (10s, 20s, 40s, …), that is capped at
300 seconds (5 minutes). Once a container has executed for 10 minutes without any
problems, the kubelet resets the restart backoff timer for that container.
[Sidecar containers and Pod lifecycle](/docs/concepts/workloads/pods/sidecar-containers/#sidecar-containers-and-pod-lifecycle)
explains the behaviour of `init containers` when specify `restartPolicy` field on it.

#### Individual container restart policy and rules {#container-restart-rules}

{{< feature-state feature_gate_name="ContainerRestartRules" >}}

If your cluster has the feature gate `ContainerRestartRules` enabled, you can specify
`restartPolicy` and `restartPolicyRules` on _individual containers_ to override the Pod
restart policy. Container restart policy and rules applies to {{< glossary_tooltip text="app containers" term_id="app-container" >}}
in the Pod and to regular [init containers](/docs/concepts/workloads/pods/init-containers/).

A Kubernetes-native [sidecar container](/docs/concepts/workloads/pods/sidecar-containers/)
has its container-level `restartPolicy` set to `Always`.

The container restarts will follow the same exponential backoff as pod restart policy described above. 
Supported container restart policies:

* `Always`: Automatically restarts the container after any termination.
* `OnFailure`: Only restarts the container if it exits with an error (non-zero exit status).
* `Never`: Does not automatically restart the terminated container.

Additionally, _individual containers_ can specify `restartPolicyRules`. If the `restartPolicyRules`
field is specified, then container `restartPolicy` **must** also be specified. The `restartPolicyRules`
define a list of rules to apply on container exit. Each rule will consist of a condition
and an action. The supported condition is `exitCodes`, which compares the exit code of the container
with a list of given values. The supported action is `Restart`, which means the container will be
restarted. The rules will be evaluated in order. On the first match, the action will be applied.
If none of the rules’ conditions matched, Kubernetes fallback to container’s configured
`restartPolicy`.

For example, a Pod with OnFailure restart policy that have a `try-once` container. This allows
Pod to only restart certain containers:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: on-failure-pod
spec:
  restartPolicy: OnFailure
  containers:
  - name: try-once-container    # This container will run only once because the restartPolicy is Never.
    image: registry.k8s.io/busybox:1.27.2
    command: ['sh', '-c', 'echo "Only running once" && sleep 10 && exit 1']
    restartPolicy: Never     
  - name: on-failure-container  # This container will be restarted on failure.
    image: registry.k8s.io/busybox:1.27.2
    command: ['sh', '-c', 'echo "Keep restarting" && sleep 1800 && exit 1']
```

A Pod with `Always` restart policy with an init container that only execute once. If the init
container fails, the Pod fails. This allows the Pod to fail if the initialization failed,
but also keep running once the initialization succeeds:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: fail-pod-if-init-fails
spec:
  restartPolicy: Always
  initContainers:
  - name: init-once      # This init container will only try once. If it fails, the pod will fail.
    image: registry.k8s.io/busybox:1.27.2
    command: ['sh', '-c', 'echo "Failing initialization" && sleep 10 && exit 1']
    restartPolicy: Never
  containers:
  - name: main-container # This container will always be restarted once initialization succeeds.
    image: registry.k8s.io/busybox:1.27.2
    command: ['sh', '-c', 'sleep 1800 && exit 0']
```

A Pod with Never restart policy with a container that ignores and restarts on specific exit codes.
This is useful to differentiate between restartable errors and non-restartable errors:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: restart-on-exit-codes
spec:
  restartPolicy: Never
  containers:
  - name: restart-on-exit-codes
    image: registry.k8s.io/busybox:1.27.2
    command: ['sh', '-c', 'sleep 60 && exit 0']
    restartPolicy: Never     # Container restart policy must be specified if rules are specified
    restartPolicyRules:      # Only restart the container if it exits with code 42
    - action: Restart
      exitCodes:
        operator: In
        values: [42]
```

Restart rules can be used for many more advanced lifecycle management scenarios. Note, restart rules
are affected by the same inconsistencies as the regular restart policy. The kubelet restarts, container
runtime garbage collection, intermitted connectivity issues with the control plane may cause the state
loss and containers may be re-run even when you expect a container not to be restarted.

#### Restart All Containers {#restart-all-containers}

{{< feature-state feature_gate_name="RestartAllContainersOnContainerExits" >}}

If your cluster has the feature gate `RestartAllContainersOnContainerExits` enabled, you can specify
`RestartAllContainers` as an action in `restartPolicyRules` at container level. When a container's exit
matches a rule with this action, the entire Pod is terminated and restarted in-place.

This "in-place" restart offers a more efficient way to reset a Pod's state compared to full deletion
and recreation. This is especially valuable for workloads where rescheduling is costly, such as
batch jobs or AI/ML training tasks.

##### How in-place Pod restarts work

When a `RestartAllContainers` action is triggered, the kubelet performs the following steps:

1. **Fast Termination**: All running containers in the Pod are terminated.
   The configured `terminationGracePeriodSeconds` is not respected, and any configured `preStop` hooks
   are not executed. This ensures a swift shutdown.
1. **Preservation of Pod Resources**: The Pod's essential resources are preserved:

   * Pod UID, IP address, and network namespace
   * Pod sandbox and any attached devices
   * All volumes, including `emptyDir` and mounted volumes

1. **Pod Status Update**: The Pod's status is updated with a `PodRestartInPlace` condition set to `True`.
   This makes the restart process observable.
1. **Full Restart Sequence**: Once all containers are terminated, the `PodRestartInPlace` condition
   is set to `False`, and the Pod begins the standard startup process:

   * **Init containers are re-run** in order.
   * Sidecar and regular containers are started.

A key aspect of this feature is that **all** containers are restarted, including those that
previously completed successfully or failed. The `RestartAllContainers` action overrides
any configured container-level or Pod-level `restartPolicy`.

This mechanism is useful in scenarios where a clean slate for all containers is necessary, such as:

- When an `init` container sets up an environment that can become corrupted, this feature ensures
  the setup process is re-executed.
- A sidecar container can monitor the health of a main application and trigger a full Pod restart
  if the application enters an unrecoverable state.

Consider a workload where a watcher sidecar is responsible for restarting the main application
from a known-good state if it encounters an error. The watcher can exit with a specific code
to trigger a full, in-place restart of the worker Pod.

{{% code_sample file="pods/restart-policy/restart-all-containers.yaml" %}}

In this example:

- The Pod's overall `restartPolicy` is `Never`.
- The `watcher-sidecar` runs a command and then exits with code `88`.
- The exit code matches the rule, triggering the `RestartAllContainers` action.
- The entire Pod, including the `setup-environment` init container and the `main-application` container,
  is then restarted in-place. The pod keeps its UID, sandbox, IP, and volumes.

### Reduced container restart delay

{{< feature-state
feature_gate_name="ReduceDefaultCrashLoopBackOffDecay" >}}

With the alpha feature gate `ReduceDefaultCrashLoopBackOffDecay` enabled,
container start retries across your cluster will be reduced to begin at 1s
(instead of 10s) and increase exponentially by 2x each restart until a maximum
delay of 60s (instead of 300s which is 5 minutes).

If you use this feature along with the alpha feature
`KubeletCrashLoopBackOffMax` (described below), individual nodes may have
different maximum delays.

### Configurable container restart delay

{{< feature-state feature_gate_name="KubeletCrashLoopBackOffMax" >}}

With the feature gate `KubeletCrashLoopBackOffMax` enabled, you can
reconfigure the maximum delay between container start retries from the default
of 300s (5 minutes). This configuration is set per node using kubelet
configuration. In your [kubelet configuration](/docs/tasks/administer-cluster/kubelet-config-file/),
under `crashLoopBackOff` set the `maxContainerRestartPeriod` field between `"1s"` and
`"300s"`. As described above in [Container restart policy](#restart-policy),
delays on that node will still start at 10s and increase exponentially by 2x
each restart, but will now be capped at your configured maximum. If the
`maxContainerRestartPeriod` you configure is less than the default initial value
of 10s, the initial delay will instead be set to the configured maximum.

See the following kubelet configuration examples:

```yaml
# container restart delays will start at 10s, increasing
# 2x each time they are restarted, to a maximum of 100s
kind: KubeletConfiguration
crashLoopBackOff:
    maxContainerRestartPeriod: "100s"
```

```yaml
# delays between container restarts will always be 2s
kind: KubeletConfiguration
crashLoopBackOff:
    maxContainerRestartPeriod: "2s"
```

If you use this feature along with the alpha feature
`ReduceDefaultCrashLoopBackOffDecay` (described above), your cluster defaults
for initial backoff and maximum backoff will no longer be 10s and 300s, but 1s
and 60s. Per node configuration takes precedence over the defaults set by
`ReduceDefaultCrashLoopBackOffDecay`, even if this would result in a node having
a longer maximum backoff than other nodes in the cluster.

## {{% heading "whatsnext" %}}

- Learn about the [Pod Lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/).
- Learn about [sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/)
  and their restart behavior.
- Learn about [container lifecycle hooks](/docs/concepts/containers/container-lifecycle-hooks/).
