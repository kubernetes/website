---
title: Use Port Forwarding to Access Applications in a Cluster
content_type: task
weight: 40
min-kubernetes-server-version: v1.10
---

<!-- overview -->

This page shows how to use `kubectl port-forward` to connect to a Redis
server running in a Kubernetes cluster. This type of connection can be useful
for database debugging.




## {{% heading "prerequisites" %}}


* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* Install [redis-cli](http://redis.io/topics/rediscli).




<!-- steps -->

## Creating Redis deployment and service

1. Create a Deployment that runs Redis:

    ```shell
    kubectl apply -f https://k8s.io/examples/application/guestbook/redis-master-deployment.yaml
    ```

    The output of a successful command verifies that the deployment was created:

    ```
    deployment.apps/redis-master created
    ```

    View the pod status to check that it is ready:

    ```shell
    kubectl get pods
    ```

    The output displays the pod created:

    ```
    NAME                            READY     STATUS    RESTARTS   AGE
    redis-master-765d459796-258hz   1/1       Running   0          50s
    ```

    View the Deployment's status:

    ```shell
    kubectl get deployment
    ```

    The output displays that the Deployment was created:

    ```
    NAME         READY   UP-TO-DATE   AVAILABLE   AGE
    redis-master 1/1     1            1           55s
    ```

    The Deployment automatically manages a ReplicaSet.
    View the ReplicaSet status using:

    ```shell
    kubectl get replicaset
    ```

    The output displays that the ReplicaSet was created:

    ```
    NAME                      DESIRED   CURRENT   READY     AGE
    redis-master-765d459796   1         1         1         1m
    ```


2. Create a Service to expose Redis on the network:

    ```shell
    kubectl apply -f https://k8s.io/examples/application/guestbook/redis-master-service.yaml
    ```

    The output of a successful command verifies that the Service was created:

    ```
    service/redis-master created
    ```

    Check the Service created:

    ```shell
    kubectl get service redis-master
    ```

    The output displays the service created:

    ```
    NAME           TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
    redis-master   ClusterIP   10.0.0.213   <none>        6379/TCP   27s
    ```

3. Verify that the Redis server is running in the Pod, and listening on port 6379:

    ```shell
    # Change redis-master-765d459796-258hz to the name of the Pod
    kubectl get pod redis-master-765d459796-258hz --template='{{(index (index .spec.containers 0).ports 0).containerPort}}{{"\n"}}'
    ```

    The output displays the port for Redis in that Pod:

    ```
    6379
    ```

    (this is the TCP port allocated to Redis on the internet).

## Forward a local port to a port on the Pod

1.  `kubectl port-forward` allows using resource name, such as a pod name, to select a matching pod to port forward to.


    ```shell
    # Change redis-master-765d459796-258hz to the name of the Pod
    kubectl port-forward redis-master-765d459796-258hz 7000:6379
    ```

    which is the same as

    ```shell
    kubectl port-forward pods/redis-master-765d459796-258hz 7000:6379
    ```

    or

    ```shell
    kubectl port-forward deployment/redis-master 7000:6379
    ```

    or

    ```shell
    kubectl port-forward replicaset/redis-master 7000:6379
    ```

    or

    ```shell
    kubectl port-forward service/redis-master 7000:6379
    ```

    Any of the above commands works. The output is similar to this:

    ```
    Forwarding from 127.0.0.1:7000 -> 6379
    Forwarding from [::1]:7000 -> 6379
    ```

{{< note >}}

`kubectl port-forward` does not return. To continue with the exercises, you will need to open another terminal.

{{< /note >}}

2.  Start the Redis command line interface:

    ```shell
    redis-cli -p 7000
    ```

3.  At the Redis command line prompt, enter the `ping` command:

    ```
    ping
    ```

    A successful ping request returns:

    ```
    PONG
    ```

### Optionally let _kubectl_ choose the local port {#let-kubectl-choose-local-port}

If you don't need a specific local port, you can let `kubectl` choose and allocate 
the local port and thus relieve you from having to manage local port conflicts, with 
the slightly simpler syntax:

```shell
kubectl port-forward deployment/redis-master :6379
```

The `kubectl` tool finds a local port number that is not in use (avoiding low ports numbers,
because these might be used by other applications). The output is similar to:

```
Forwarding from 127.0.0.1:62162 -> 6379
Forwarding from [::1]:62162 -> 6379
```


<!-- discussion -->

## Discussion

Connections made to local port 7000 are forwarded to port 6379 of the Pod that
is running the Redis server. With this connection in place, you can use your
local workstation to debug the database that is running in the Pod.

{{< note >}}
`kubectl port-forward` is implemented for TCP ports only.
The support for UDP protocol is tracked in
[issue 47862](https://github.com/kubernetes/kubernetes/issues/47862).
{{< /note >}}




## {{% heading "whatsnext" %}}

Learn more about [kubectl port-forward](/docs/reference/generated/kubectl/kubectl-commands/#port-forward).
