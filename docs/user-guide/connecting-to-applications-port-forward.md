---
assignees:
- caesarxuchao
- mikedanese

---

kubectl port-forward forwards connections to a local port to a port on a pod. Its man page is available [here](/docs/user-guide/kubectl/kubectl_port-forward). Compared to [kubectl proxy](/docs/user-guide/accessing-the-cluster/#using-kubectl-proxy), `kubectl port-forward` is more generic as it can forward TCP traffic while `kubectl proxy` can only forward HTTP traffic. This guide demonstrates how to use `kubectl port-forward` to connect to a Redis database, which may be useful for database debugging.

## Creating a Redis master

```shell
$ kubectl create -f examples/redis/redis-master.yaml
pods/redis-master
```

wait until the Redis master pod is Running and Ready,

```shell
$ kubectl get pods
NAME           READY     STATUS    RESTARTS   AGE
redis-master   2/2       Running   0          41s
```

## Connecting to the Redis master[a]

The Redis master is listening on port 6379, to verify this,

```shell{% raw %}
$ kubectl get pods redis-master --template='{{(index (index .spec.containers 0).ports 0).containerPort}}{{"\n"}}'
6379{% endraw %}
```

then we forward the port 6379 on the local workstation to the port 6379 of pod redis-master,

```shell
$ kubectl port-forward redis-master 6379:6379
I0710 14:43:38.274550    3655 portforward.go:225] Forwarding from 127.0.0.1:6379 -> 6379
I0710 14:43:38.274797    3655 portforward.go:225] Forwarding from [::1]:6379 -> 6379
```

To verify the connection is successful, we run a redis-cli on the local workstation,

```shell
$ redis-cli
127.0.0.1:6379> ping
PONG
```

Now one can debug the database from the local workstation.
