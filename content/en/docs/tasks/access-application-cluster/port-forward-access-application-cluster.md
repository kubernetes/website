---
title: Use Port Forwarding to Access Applications in a Cluster
content_template: templates/task
weight: 40
---

{{% capture overview %}}

This page shows how to use `kubectl port-forward` to connect to a Redis
server running in a Kubernetes cluster. This type of connection can be useful
for database debugging.

{{% /capture %}}


{{% capture prerequisites %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* Install [redis-cli](http://redis.io/topics/rediscli).

{{% /capture %}}


{{% capture steps %}}

## Creating Redis deployment and service

1. Create a Redis deployment:

    ```shell
    $ kubectl create -f https://k8s.io/docs/tutorials/stateless-application/guestbook/redis-master-deployment.yaml
    ```

    The output of a successful command verifies that the deployment was created:
    
    ```shell
    deployment "redis-master" created
    ```

    When the pod is ready, you can get:
    
    ```shell
    $ kubectl get pods
    NAME                            READY     STATUS    RESTARTS   AGE
    redis-master-765d459796-258hz   1/1       Running   0          50s
    $ kubectl get deployment
    NAME         DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    redis-master 1         1         1            1           55s
    $ kubectl get rs
    NAME                      DESIRED   CURRENT   READY     AGE
    redis-master-765d459796   1         1         1         1m
    ```

2. Create a Redis service:
    
    ```shell
    $ kubectl create -f https://k8s.io/docs/tutorials/stateless-application/guestbook/redis-master-service.yaml
    ```
    The output of a successful command verifies that the service was created:
    ```shell
    service "redis-master" created
    ```
    Check the service created:

    ```shell
    $ kubectl get svc | grep redis
    NAME           TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
    redis-master   ClusterIP   10.0.0.213   <none>        6379/TCP   27s
    ```

3. Verify that the Redis server is running in the pod and listening on port 6379:

    ```shell  
    $ kubectl get pods redis-master-765d459796-258hz --template='{{(index (index .spec.containers 0).ports 0).containerPort}}{{"\n"}}'
    ``` 

    The output displays the port:

    ```shell
    6379
    ```

## Forward a local port to a port on the pod

1.  `kubectl port-forward` allows using resource name, such as a service name, to select a matching pod to port forward to since Kubernetes v1.10.
   
    ```shell
    $ kubectl port-forward redis-master-765d459796-258hz 6379:6379 
    ```
    which is the same as

    ```shell
    $ kubectl port-forward pods/redis-master-765d459796-258hz 6379:6379
    ```

    or  

    ```shell
    $ kubectl port-forward deployment/redis-master 6379:6379 
    ```

    or
    
    ```shell
    $ kubectl port-forward rs/redis-master 6379:6379 
    ```

    or

    ```shell
    $ kubectl port-forward svc/redis-master 6379:6379
    ```

    Any of the above commands works. The output is similar to this:
    
    ```shell
    I0710 14:43:38.274550    3655 portforward.go:225] Forwarding from 127.0.0.1:6379 -> 6379
    I0710 14:43:38.274797    3655 portforward.go:225] Forwarding from [::1]:6379 -> 6379
    ```

2.  Start the Redis command line interface:
    
    ```shell
    $ redis-cli
    ```

3.  At the Redis command line prompt, enter the `ping` command:
    
    ```shell
    127.0.0.1:6379>ping
    ```

    A successful ping request returns PONG.

{{% /capture %}}


{{% capture discussion %}}

## Discussion

Connections made to local port 6379 are forwarded to port 6379 of the pod that
is running the Redis server. With this connection in place you can use your
local workstation to debug the database that is running in the pod.

{{< warning >}}
**Warning**: Due to known limitations, port forward today only works for TCP protocol.
The support to UDP protocol is being tracked in
[issue 47862](https://github.com/kubernetes/kubernetes/issues/47862).
{{< /warning >}}

{{% /capture %}}


{{% capture whatsnext %}}
Learn more about [kubectl port-forward](/docs/reference/generated/kubectl/kubectl-commands/#port-forward).
{{% /capture %}}



