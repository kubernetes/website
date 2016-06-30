---
object_rankings:
- concept: livenessProbe
  rank: 1
- concept: probe
  rank: 1
concept_rankings:
- concept: pod
  rank: 2
- concept: container
  rank: 2
- concept: restartPolicy
  rank: 2
---

{% capture purpose %}
This document explains how to configure Pods to kill and restart
Containers whose Applications are unhealthy.

In many cases a Container maybe running, but the Application itself is
unhealthy.  For example your Application may encounter a
*[Deadlock](https://en.wikipedia.org/wiki/Deadlock)* issue, causing it to
fail to respond to requests.

By configuring a `LivenessProbe` for your Container, you can ensure that if
the Application becomes unhealthy, that the Container is killed and restarted
(according to the `RestartPolicy`).

{% endcapture %}

{% capture recommended_background %}
It is recommended you are familiar with the following concepts before continuing.

- [Pods](/docs/pod/)
- [Containers](/docs/container/)
{% endcapture %}

{% capture step_by_step %}
### Step 1: Set an appropriate value for the Container `RestartPolicy`

The `LivenessProbe` is responsible only for killing the running Container,
and relies on the `RestartPolicy` to restart the Container.  For the Container
to restart, the `RestartPolicy` should be either *Always* or *OnFailure*.
The default `RestartPolicy` value is *Always*.

**If the `RestartPolicy` is *Never*, the Container will not be restarted
after it is killed.**

### Step 2: Determine a value for `InitialDelaySeconds`

It is important to set a value for `InitialDelaySeconds` so that the
Container is not killed for failing liveness checks while it is still starting.
This will be used in Step 3.

**Failure to appropriately set this value could cause your application to
crash loop because it never fully completes the initialization process.**

### Step 3: Configure a Container *LivenessProbe*.

#### Option A: Define an Http Get request

Add `pod.containers.livenessProbe.httpGet` with a URL and port that returns
a response code >= 200 and < 400 on success:

{% include code.html language="yaml" file="podyamls/http-liveness.yaml" ghlink="/docs/tasks/podyamls/http-liveness.yaml"%}

This example starts a container that will start to fail health checks after 30
seconds.

#### Option B: Define a Shell command

Add `pod.containers.livenessProbe.exec` with a shell command that exits 0
on *Ready* and non-zero on *NotReady*:

{% include code.html language="yaml" file="podyamls/exec-liveness.yaml" ghlink="/docs/tasks/podyamls/exec-liveness.yaml"%}

This example will fail the livenessProbe after 10 seconds causing the container
to be restarted.

#### Option C: Define a TCP connection

Add `pod.containers.livenessProbe.tcpSocket` with a port that is opened
on *Ready* and is not opened on *NotReady*:

{% include code.html language="yaml" file="podyamls/tcp-liveness.yaml" ghlink="/docs/tasks/podyamls/tcp-liveness.yaml"%}

This example starts a container that will never fail health checks because
even though the http server is return 500 response, the port is opened
successfully.

{% endcapture %}

{% capture options_and_considerations %}
- When running the examples you can see the container restart count using

```shell
$ kubectl get pods
NAME                                           READY     STATUS       RESTARTS   AGE
[...]
liveness-exec                                  1/1       Running      0          13s
liveness-http                                  1/1       Running      0          13s
```

```shell
$ kubectl describe pods liveness-exec
[...]
Sat, 27 Jun 2015 13:43:03 +0200    Sat, 27 Jun 2015 13:44:34 +0200    4    {kubelet kubernetes-node-6fbi}    spec.containers{liveness}    unhealthy  Liveness probe failed: cat: can't open '/tmp/health': No such file or directory
Sat, 27 Jun 2015 13:44:44 +0200    Sat, 27 Jun 2015 13:44:44 +0200    1    {kubelet kubernetes-node-6fbi}    spec.containers{liveness}    killing    Killing with docker id 65b52d62c635
Sat, 27 Jun 2015 13:44:44 +0200    Sat, 27 Jun 2015 13:44:44 +0200    1    {kubelet kubernetes-node-6fbi}    spec.containers{liveness}    created    Created with docker id ed6bb004ee10
Sat, 27 Jun 2015 13:44:44 +0200    Sat, 27 Jun 2015 13:44:44 +0200    1    {kubelet kubernetes-node-6fbi}    spec.containers{liveness}    started    Started with docker id ed6bb004ee10
```

- To prevent `LivenessProbe`s from killing containers that are still starting
up, it is important to set an appropriate `InitialDelaySeconds`.
- Each probe will have one of three results:
  - `Success`: indicates that the container passed the diagnostic.
  - `Failure`: indicates that the container failed the diagnostic.
  - `Unknown`: indicates that the diagnostic failed so no action should be taken.
- Probes can be further customized (e.g. `TimeoutSeconds`, `PeriodSeconds`).  See
the [probe documentation](/docs/api-reference/v1//definitions/#_v1_probe)
for the full list of options.
- Probes should execute a behavior that will only pass if the Application is
healthy, and will fail if the Application should be killed.
- For HttpGet and TcpSocket, the Kubelet sends probes to the container’s IP
address, unless overridden by the optional host field in httpGet. If the
container listens on 127.0.0.1 and hostNetwork is true (i.e., it does not use
the pod-specific network), then host should be specified as 127.0.0.1. Be warned
 that, outside of less common cases like that, host does probably not result in
 what you would expect. If you set it to a non-existing hostname
 (or your competitor’s!), probes will never reach the pod, defeating the whole
 point of health checks. If your pod relies on e.g. virtual hosts, which is
 probably the more common case, you should not use host, but rather set the
 Host header in *livenessProbe.httpGet.httpHeaders*.
{% endcapture %}

{% include templates/task.md %}
