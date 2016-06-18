---
tags:
- pod
- container
- controller
related_objects:
- restartPolicy
---
{% capture purpose %}
This document explains how to configure container restart behavior in your pod in the event of failures.
{% endcapture %}

{% capture recommended_background %}
It is recommended you are familiar with the following concepts before continuing.

- [Pods](/docs/pod/)
- [Containers](/docs/container/)

{% endcapture %}

{% capture step_by_step %}
#### 1: Deciding on a restart strategy

The recommended restart behavior depends on the kind of controller that is running your pods:

- Use a [`Job`](/docs/job/) for pods which are expected to terminate (e.g. batch computations).
- Use a [`Deployment`](/docs/deployment/) for pods which are not expected to
  terminate (e.g. web servers).
- Use a [`DaemonSet`](/docs/daemonset/) for pods which need to run 1 per machine because they provide a
  machine-specific system service.

The type of controller will determine the appropriate value for the `restartPolicy` field in your
pod definition.

| Controller | Appropriate `restartPolicy` |
|------------|-----------------------------|
| Deployment | `Always` |
| Jobs | `OnFailure` or `Never` |
| DaemonSet | `Always`, `OnFailure`, or `Never` |

| `restartPolicy` value | Description |
|-----------------------|-------------|
| `Always` | Will restart container any time it exits. |
| `OnFailure` | Will restart container if any process exits with a non-zero exit code. | 
| `Never` | Will never restart the container. |

`restartPolicy` applies to all containers in the pod. If `restartPolicy` is not set, the default value is `Always`.

Failed containers are restarted with an exponential back-off delay,
the delay is in multiples of sync-frequency 0, 1x, 2x, 4x, 8x, etc. The delay is capped at 5 minutes
and is reset after 10 minutes of successful execution.

#### 2: Configure RestartPolicy in the pod definition

```yaml
apiVersion: extensions/v1beta1
kind: Job
metadata:
  name: example
spec:
  selector:
    matchLabels:
      app: example
  template:
    metadata:
      name: example
      labels:
        app: example
    spec:
      containers:
      - name: example
        image: debian
        command: ["date"]
      restartPolicy: Never
```

## Examples

   * Pod is `Running`, 1 container, container exits success
     * Log completion event
     * If RestartPolicy is:
       * Always: restart container, pod stays `Running`
       * OnFailure: pod becomes `Succeeded`
       * Never: pod becomes `Succeeded`

   * Pod is `Running`, 1 container, container exits failure
     * Log failure event
     * If RestartPolicy is:
       * Always: restart container, pod stays `Running`
       * OnFailure: restart container, pod stays `Running`
       * Never: pod becomes `Failed`

   * Pod is `Running`, 2 containers, container 1 exits failure
     * Log failure event
     * If RestartPolicy is:
       * Always: restart container, pod stays `Running`
       * OnFailure: restart container, pod stays `Running`
       * Never: pod stays `Running`
     * When container 2 exits...
       * Log failure event
       * If RestartPolicy is:
         * Always: restart container, pod stays `Running`
         * OnFailure: restart container, pod stays `Running`
         * Never: pod becomes `Failed`

   * Pod is `Running`, container becomes OOM
     * Container terminates in failure
     * Log OOM event
     * If RestartPolicy is:
       * Always: restart container, pod stays `Running`
       * OnFailure: restart container, pod stays `Running`
       * Never: log failure event, pod becomes `Failed`

   * Pod is `Running`, a disk dies
     * All containers are killed
     * Log appropriate event
     * Pod becomes `Failed`
     * If running under a controller, pod will be recreated elsewhere

   * Pod is `Running`, its node is segmented out
     * NodeController waits for timeout
     * NodeController marks pod `Failed`
     * If running under a controller, pod will be recreated elsewhere

{% endcapture %}

{% include templates/task.md %}