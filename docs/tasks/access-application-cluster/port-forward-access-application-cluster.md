---
title: Use Port Forwarding to Access Applications in a Cluster
---

{% capture overview %}

This page shows how to use `kubectl port-forward` to connect to a Redis
server running in a Kubernetes cluster. This type of connection can be useful
for database debugging.

{% endcapture %}


{% capture prerequisites %}

* {% include task-tutorial-prereqs.md %}

* Install [redis-cli](http://redis.io/topics/rediscli).

{% endcapture %}


{% capture steps %}

## Creating Redis deployment and service

1. Create a Redis deployment:

       kubectl create -f https://k8s.io/docs/tutorials/stateless-application/guestbook/redis-master-deployment.yaml

    The output of a successful command verifies that the deployment was created:

        deployment "redis-master" created
 
    When the pod is ready, you can get:
       
       kubectl get pods

        NAME                            READY     STATUS    RESTARTS   AGE
        redis-master-765d459796-258hz   1/1       Running   0          50s

       kubectl get deployment
       
        NAME         DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
        redis-master 1         1         1            1           55s

       kubectl get rs
        NAME                      DESIRED   CURRENT   READY     AGE
        redis-master-765d459796   1         1         1         1m


2. Create a Redis service:

       kubectl create -f https://k8s.io/docs/tutorials/stateless-application/guestbook/redis-master-service.yaml

    The output of a successful command verifies that the service was created:

        service "redis-master" created

    Check the service created:

       kubectl get svc | grep redis

        NAME           TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
        redis-master   ClusterIP   10.0.0.213   <none>        6379/TCP   27s

3. Verify that the Redis server is running in the pod and listening on port 6379:

        {% raw %}
       kubectl get pods redis-master-765d459796-258hz --template='{{(index (index .spec.containers 0).ports 0).containerPort}}{{"\n"}}'
        {% endraw %}

    The output displays the port:

        6379


## Forward a local port to a port on the pod

1.  `kubectl port-forward` allows using resource name, such as a service name, to select a matching pod to port forward to since Kubernetes v1.10.

        kubectl port-forward redis-master-765d459796-258hz 6379:6379 

    which is the same as

        kubectl port-forward pods/redis-master-765d459796-258hz 6379:6379

    or  

        kubectl port-forward deployment/redis-master 6379:6379 

    or

        kubectl port-forward rs/redis-master 6379:6379 

    or

        kubectl port-forward svc/redis-master 6379:6379

    Any of the above commands works. The output is similar to this:

        I0710 14:43:38.274550    3655 portforward.go:225] Forwarding from 127.0.0.1:6379 -> 6379
        I0710 14:43:38.274797    3655 portforward.go:225] Forwarding from [::1]:6379 -> 6379

2.  Start the Redis command line interface:

        redis-cli

3.  At the Redis command line prompt, enter the `ping` command:

        127.0.0.1:6379>ping

    A successful ping request returns PONG.

{% endcapture %}


{% capture discussion %}

## Discussion

Connections made to local port 6379 are forwarded to port 6379 of the pod that
is running the Redis server. With this connection in place you can use your
local workstation to debug the database that is running in the pod.

**Warning**: Due to known limitations, port forward today only works for TCP protocol.
The support to UDP protocol is being tracked in
[issue 47862](https://github.com/kubernetes/kubernetes/issues/47862).
{: .warning}

{% endcapture %}


{% capture whatsnext %}
Learn more about [kubectl port-forward](/docs/user-guide/kubectl/{{page.version}}/#port-forward).
{% endcapture %}


{% include templates/task.md %}
