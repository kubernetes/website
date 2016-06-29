---
object_rankings:
- concept: readinessProbe
  rank: 1
- concept: probe
  rank: 1
concept_rankings:
- concept: pod
  rank: 2
- concept: container
  rank: 2
---

{% capture purpose %}
This document explains how to configure Pods to receive requests ***only after***
they have declared that they are *Ready* to do so.

This should be used anytime initialization is performed in the Container
prior to being able to serve requests.  Examples:

- Creating connection pools to Databases or other applications
- Initializing objects via reflection or dependency injection
- Pre-populating caches
{% endcapture %}

{% capture recommended_background %}
It is recommended you are familiar with the following concepts before continuing.

- [Pods](/docs/pod/)
- [Containers](/docs/container/)
{% endcapture %}

{% capture step_by_step %}
#### Option 1: Define an http Get request

Add `pod.containers.readinessProbe.httpGet` with a URL and port that returns
a response code >= 200 and < 400 on success:

```yaml
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: httpget-probe-example
    args:
    - /bin/sh
    - -c
    - sleep 60; echo ok > /tmp/health;
    image: gcr.io/google_containers/liveness
    readinessProbe: # This is the important part
      httpGet: # This defines the http Get
        path: /healthz # Probes are sent to the Pod IP
        port: 80
```

#### Option 2: Define a shell command

Add `pod.containers.readinessProbe.exec` with a shell command that exits 0
on *Ready* and non-zero on *NotReady*:

```yaml
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: exec-probe-example
    args:
    - /bin/sh
    - -c
    - sleep 60; echo ok > /tmp/health;
    image: gcr.io/google_containers/busybox
    readinessProbe: # This is the important part
      exec: # This defines the exec command
        command: # This is the command + argv executed to check Readiness
        - cat
        - /tmp/health
```

#### Option 3: Define a TCP request

Add `pod.containers.readinessProbe.tcpSocket` with a port that is opened
on *Ready* and is not opened on *NotReady*:

```yaml
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: httpget-probe-example
    args:
    - /bin/sh
    - -c
    - sleep 60; echo ok > /tmp/health;
    image: gcr.io/google_containers/liveness
    readinessProbe: # This is the important part
      tcpSocket: # Connection is made to the Pod IP
        port: 22
```
{% endcapture %}

{% capture options_and_considerations %}

- *ReadinessProbe*s only prevent *Services* from sending traffic to the *Pod*,
and do not prevent requests from being sent directly to the *Pod* IP address
through other means.
- Each probe will have one of three results:
  - `Success`: indicates that the container passed the diagnostic.
  - `Failure`: indicates that the container failed the diagnostic.
  - `Unknown`: indicates that the diagnostic failed so no action should be taken.
- Probes can be further customized (e.g. *TimeoutSeconds*, *PeriodSeconds*).  See
the [probe documentation](/docs/api-reference/v1//definitions/#_v1_probe)
for the full list of options.
- *ReadinessProbe*s can be used by containers to take themselves down for maintenance without deleting the pod
{% endcapture %}

{% include templates/task.md %}
