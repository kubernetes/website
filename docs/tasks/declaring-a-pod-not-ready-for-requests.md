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
This document explains how to configure Pods to receive requests only after
they pass *Readiness Checks*.

This should be used anytime initialization is performed in the Container
prior to being able to serve requests.  Examples:

- Creating connection pools to Databases or other applications
- Initializing objects via reflection or dependency injection
- Pre-populating caches

By configuring a `ReadinessProbe` for your Container, you can ensure that
Services will not send requests to the Container until the Readiness Checks
succeed.
{% endcapture %}

{% capture recommended_background %}
It is recommended you are familiar with the following concepts before continuing.

- [Pods](/docs/pod/)
- [Containers](/docs/container/)
- [Services](/docs/service/)
{% endcapture %}

{% capture step_by_step %}
#### Option A: Define an Http Get request

Add `pod.containers.readinessProbe.httpGet` with a URL and port that returns
a response code >= 200 and < 400 on success:

{% include code.html language="yaml" file="podyamls/http-readiness.yaml" ghlink="/docs/tasks/podyamls/http-readiness.yaml"%}


#### Option B: Define a Shell command

Add `pod.containers.readinessProbe.exec` with a shell command that exits 0
on *Ready* and non-zero on *NotReady*:

{% include code.html language="yaml" file="podyamls/exec-readiness.yaml" ghlink="/docs/tasks/podyamls/exec-readiness.yaml"%}

#### Option C: Define a TCP connection

Add `pod.containers.readinessProbe.tcpSocket` with a port that is opened
on *Ready* and is not opened on *NotReady*:

{% include code.html language="yaml" file="podyamls/tcp-readiness.yaml" ghlink="/docs/tasks/podyamls/tcp-readiness.yaml"%}

{% endcapture %}

{% capture options_and_considerations %}

- `ReadinessProbe`s only prevent Services from sending traffic to the Pod,
and do not prevent requests from being sent directly to the Pod IP address
through other means.
- Each probe will have one of three results:
  - `Success`: indicates that the container passed the diagnostic.
  - `Failure`: indicates that the container failed the diagnostic.
  - `Unknown`: indicates that the diagnostic failed so no action should be taken.
- Probes can be further customized (e.g. `TimeoutSeconds`, `PeriodSeconds`).  See
the [probe documentation](/docs/api-reference/v1//definitions/#_v1_probe)
for the full list of options.
- `ReadinessProbe`s can be used by containers to take themselves down for maintenance without deleting the pod
{% endcapture %}

{% include templates/task.md %}
