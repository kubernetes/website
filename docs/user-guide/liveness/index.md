---
assignees:
- mikedanese
- thockin

---

This example shows two types of pod [health checks](/docs/user-guide/production-pods/#liveness-and-readiness-probes-aka-health-checks): HTTP checks and container execution checks.

The [exec-liveness.yaml](/docs/user-guide/liveness/exec-liveness.yaml) demonstrates the container execution check.

{% include code.html language="yaml" file="exec-liveness.yaml" ghlink="/docs/user-guide/liveness/exec-liveness.yaml" %}

Kubelet executes the command `cat /tmp/health` in the container and reports failure if the command returns a non-zero exit code.

Note that the container removes the `/tmp/health` file after 10 seconds,

```shell
echo ok > /tmp/health; sleep 10; rm -rf /tmp/health; sleep 600
```

so when Kubelet executes the health check 15 seconds (defined by initialDelaySeconds) after the container started, the check would fail.


The [http-liveness.yaml](/docs/user-guide/liveness/http-liveness.yaml) demonstrates the HTTP check.
{% include code.html language="yaml" file="http-liveness.yaml" ghlink="/docs/user-guide/liveness/http-liveness.yaml" %}


The Kubelet sends an HTTP request to the specified path and port to perform the health check. If you take a look at image/server.go, you will see the server starts to respond with an error code 500 after 10 seconds, so the check fails. The Kubelet sends probes to the container's IP address, unless overridden by the optional `host` field in httpGet. If the container listens on `127.0.0.1` and `hostNetwork` is `true` (i.e., it does not use the pod-specific network), then `host` should be specified as `127.0.0.1`. Be warned that, outside of less common cases like that, `host` does probably not result in what you would expect. If you set it to a non-existing hostname (or your competitor's!), probes will never reach the pod, defeating the whole point of health checks. If your pod relies on e.g. virtual hosts, which is probably the more common case, you should not use `host`, but rather set the `Host` header in `httpHeaders`.

### Using a named port for liveness probes

You can also use a named `ContainerPort` for HTTP liveness checks. 

The [http-liveness-named-port.yaml](/docs/user-guide/liveness/http-liveness-named-port.yaml) demonstrates the named-port HTTP check.
{% include code.html language="yaml" file="http-liveness-named-port.yaml" ghlink="/docs/user-guide/liveness/http-liveness-named-port.yaml" %}

This [guide](/docs/user-guide/walkthrough/k8s201/#health-checking) has more information on health checks.

## Get your hands dirty

To show the health check is actually working, first create the pods:

```shell
$ kubectl create -f docs/user-guide/liveness/exec-liveness.yaml
$ kubectl create -f docs/user-guide/liveness/http-liveness.yaml
```

Check the status of the pods once they are created:

```shell
$ kubectl get pods
NAME                                           READY     STATUS       RESTARTS   AGE
[...]
liveness-exec                                  1/1       Running      0          13s
liveness-http                                  1/1       Running      0          13s
```

Check the status half a minute later, you will see the container restart count being incremented:

```shell
$ kubectl get pods
NAME                                           READY     STATUS       RESTARTS   AGE
[...]
liveness-exec                                  1/1       Running      1          36s
liveness-http                                  1/1       Running      1          36s
```

At the bottom of the *kubectl describe* output there are messages indicating that the liveness probes have failed, and the containers have been killed and recreated.

```shell
$ kubectl describe pods liveness-exec
[...]
Sat, 27 Jun 2015 13:43:03 +0200    Sat, 27 Jun 2015 13:44:34 +0200    4    {kubelet kubernetes-node-6fbi}    spec.containers{liveness}    unhealthy  Liveness probe failed: cat: can't open '/tmp/health': No such file or directory
Sat, 27 Jun 2015 13:44:44 +0200    Sat, 27 Jun 2015 13:44:44 +0200    1    {kubelet kubernetes-node-6fbi}    spec.containers{liveness}    killing    Killing with docker id 65b52d62c635
Sat, 27 Jun 2015 13:44:44 +0200    Sat, 27 Jun 2015 13:44:44 +0200    1    {kubelet kubernetes-node-6fbi}    spec.containers{liveness}    created    Created with docker id ed6bb004ee10
Sat, 27 Jun 2015 13:44:44 +0200    Sat, 27 Jun 2015 13:44:44 +0200    1    {kubelet kubernetes-node-6fbi}    spec.containers{liveness}    started    Started with docker id ed6bb004ee10
```
