---
redirect_from:
- "/docs/user-guide/liveness/"
- "/docs/user-guide.liveness.html"
title: Configuring Liveness and Readiness Probes
---

{% capture overview %}

This page shows how to configure liveness and readiness probes for Containers.

The [kubelet](/docs/admin/kubelet/) uses liveness probes to know when to
restart a Container. For example, liveness probes could catch a deadlock,
where an application is running, but unable to make progress. Restarting a
Container in such a state can help to make the application more available
despite bugs.

The kubelet uses readiness probes to know when a Container is ready to start
accepting traffic. A Pod is considered ready when all of its Containers are ready.
One use of this signal is to control which Pods are used as backends for Services.
When a Pod is not ready, it is removed from Service load balancers.

{% endcapture %}

{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}

{% capture steps %}

## Defining a liveness command

Many applications running for long periods of time eventually transition to
broken states, and cannot recover except by being restarted. Kubernetes provides
liveness probes to detect and remedy such situations.

In this exercise, you create a Pod that runs a Container based on the
`gcr.io/google_containers/busybox` image. Here is the configuration file for the Pod:

{% include code.html language="yaml" file="exec-liveness.yaml" ghlink="/docs/tasks/configure-pod-container/exec-liveness.yaml" %}

In the configuration file, you can see that the Pod has a single Container.
The `livenessProbe` field specifies that the kubelet should perform a liveness
probe every 5 seconds. The `initialDelaySeconds` field tells the kubelet that it
should wait 5 second before performing the first probe. To perform a probe, the
kubelet executes the command `cat /tmp/healthy` in the Container. If the
command succeeds, it returns 0, and the kubelet considers the Container to be alive and
healthy. If the command returns a non-zero value, the kubelet kills the Container
and restarts it.

When the Container starts, it executes this command:

```shell
/bin/sh -c "touch /tmp/healthy; sleep 30; rm -rf /tmp/healthy; sleep 600"
```

For the first 30 seconds of the Container's life, there is a `/tmp/healthy` file.
So during the first 30 seconds, the command `cat /tmp/healthy` returns a success
code. After 30 seconds, `cat /tmp/healthy` returns a failure code.

Create the Pod:

```shell
kubectl create -f http://k8s.io/docs/tasks/configure-pod-container/exec-liveness.yaml
```

Within 30 seconds, view the Pod events:

```
kubectl describe pod liveness-exec
```

The output indicates that no liveness probes have failed yet:

```shell
FirstSeen    LastSeen    Count   From            SubobjectPath           Type        Reason      Message
--------- --------    -----   ----            -------------           --------    ------      -------
24s       24s     1   {default-scheduler }                    Normal      Scheduled   Successfully assigned liveness-exec to worker0
23s       23s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Pulling     pulling image "gcr.io/google_containers/busybox"
23s       23s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Pulled      Successfully pulled image "gcr.io/google_containers/busybox"
23s       23s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Created     Created container with docker id 86849c15382e; Security:[seccomp=unconfined]
23s       23s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Started     Started container with docker id 86849c15382e
```

After 30 seconds, view the Pod events again:

```shell
kubectl describe pod liveness-exec
```

At the bottom of the output, there are messages indicating that the liveness
probes have failed, and the containers have been killed and recreated.

```shell
FirstSeen LastSeen    Count   From            SubobjectPath           Type        Reason      Message
--------- --------    -----   ----            -------------           --------    ------      -------
37s       37s     1   {default-scheduler }                    Normal      Scheduled   Successfully assigned liveness-exec to worker0
36s       36s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Pulling     pulling image "gcr.io/google_containers/busybox"
36s       36s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Pulled      Successfully pulled image "gcr.io/google_containers/busybox"
36s       36s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Created     Created container with docker id 86849c15382e; Security:[seccomp=unconfined]
36s       36s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Started     Started container with docker id 86849c15382e
2s        2s      1   {kubelet worker0}   spec.containers{liveness}   Warning     Unhealthy   Liveness probe failed: cat: can't open '/tmp/healthy': No such file or directory
```

Wait another 30 seconds, and verify that the Container has been restarted:

```shell
kubectl get pod liveness-exec
```

The output shows that `RESTARTS` has been incremented:

```shell
NAME            READY     STATUS    RESTARTS   AGE
liveness-exec   1/1       Running   1          1m
```

## Defining a liveness HTTP request

Another kind of liveness probe uses an HTTP GET request. Here is the configuration
file for a Pod that runs a container based on the `gcr.io/google_containers/liveness`
image.

{% include code.html language="yaml" file="http-liveness.yaml" ghlink="/docs/tasks/configure-pod-container/http-liveness.yaml" %}

In the configuration file, you can see that the Pod has a single Container.
The `livenessProbe` field specifies that the kubelet should perform a liveness
probe every 3 seconds. The `initialDelaySeconds` field tells the kubelet that it
should wait 3 seconds before performing the first probe. To perform a probe, the
kubelet sends an HTTP GET request to the server that is running in the Container
and listening on port 8080. If the handler for the server's `/healthz` path
returns a success code, the kubelet considers the Container to be alive and
healthy. If the handler returns a failure code, the kubelet kills the Container
and restarts it.

Any code greater than or equal to 200 and less than 400 indicates success. Any
other code indicates failure.

You can see the source code for the server in
[server.go](http://k8s.io/docs/user-guide/liveness/image/server.go).

For the first 10 seconds that the Container is alive, the `/healthz` handler
returns a status of 200. After that, the handler returns a status of 500.

```go
http.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
    duration := time.Now().Sub(started)
    if duration.Seconds() > 10 {
        w.WriteHeader(500)
        w.Write([]byte(fmt.Sprintf("error: %v", duration.Seconds())))
    } else {
        w.WriteHeader(200)
        w.Write([]byte("ok"))
    }
```

The kubelet starts performing health checks 3 seconds after the Container starts.
So the first couple of health checks will succeed. But after 10 seconds, the health
checks will fail, and the kubelet will kill and restart the Container.

To try the HTTP liveness check, create a Pod:

```shell
kubectl create -f http://k8s.io/docs/tasks/configure-pod-container/http-liveness.yaml
```

After 10 seconds, view Pod events to verify that liveness probes have failed and
the Container has been restarted:

```shell
kubectl describe pod liveness-http
```

## Using a named port

You can use a named
[ContainerPort](/docs/api-reference/v1/definitions/#_v1_containerport)
for HTTP liveness checks:

```yaml
ports:
- name: liveness-port
  containerPort: 8080
  hostPort: 8080

livenessProbe:
  httpGet:
  path: /healthz
  port: liveness-port
```

## Defining readiness probes

Sometimes, applications are temporarily unable to serve traffic.
For example, an application might need to load large data or configuration
files during startup. In such cases, you don't want to kill the application,
but you don’t want to send it requests either. Kubernetes provides
readiness probes to detect and mitigate these situations. A pod with containers
reporting that they are not ready does not receive traffic through Kubernetes
Services.

Readiness probes are configured similarly to liveness probes. The only difference
is that you use the `readinessProbe` field instead of the `livenessProbe` field.

```yaml
readinessProbe:
  exec:
    command:
    - cat
    - /tmp/healthy
  initialDelaySeconds: 5
  periodSeconds: 5
```

{% endcapture %}


{% capture discussion %}

## Discussion

{% comment %}
Eventually, some of this Discussion section could be moved to a concept topic.
{% endcomment %}

[Probes](/docs/api-reference/v1/definitions/#_v1_probe) have these additional fields that you can use to more precisely control the behavior of liveness and readiness checks:

* timeoutSeconds
* successThreshold
* failureThreshold

[HTTP probes](/docs/api-reference/v1/definitions/#_v1_httpgetaction)
have these additional fields:

* host
* scheme
* httpHeaders

For an HTTP probe, the kubelet sends an HTTP request to the specified path and
port to perform the check. The kubelet sends the probe to the container’s IP address,
unless the address is overridden by the optional `host` field in `httpGet`.
In most scenarios, you do not want to set the `host` field. Here's one scenario
where you would set it. Suppose the Container listens on 127.0.0.1 and the Pod's
`hostNetwork` field is true. Then `host`, under `httpGet`, should be set to 127.0.0.1.
If your pod relies on virtual hosts, which is probably the more common case,
you should not use `host`, but rather set the `Host` header in `httpHeaders`.

In addition to command probes and HTTP probes, Kubenetes supports
[TCP probes](/docs/api-reference/v1/definitions/#_v1_tcpsocketaction).

{% endcapture %}

{% capture whatsnext %}

* Learn more about
[Container Probes](/docs/user-guide/pod-states/#container-probes).

* Learn more about
[Health Checking section](/docs/user-guide/walkthrough/k8s201/#health-checking).

### Reference

* [Pod](http://kubernetes.io/docs/api-reference/v1/definitions#_v1_pod)
* [Container](/docs/api-reference/v1/definitions/#_v1_container)
* [Probe](/docs/api-reference/v1/definitions/#_v1_probe)

{% endcapture %}

{% include templates/task.md %}
