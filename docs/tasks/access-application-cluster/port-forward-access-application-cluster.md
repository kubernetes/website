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

## Creating a pod to run a Redis server

1. Create a pod:

       kubectl create -f https://k8s.io/docs/tasks/access-application-cluster/redis-master.yaml

    The output of a successful command verifies that the pod was created:

        pod "redis-master" created

1. Check to see whether the pod is running and ready:

       kubectl get pods

    When the pod is ready, the output displays a STATUS of Running:

        NAME           READY     STATUS    RESTARTS   AGE
        redis-master   2/2       Running   0          41s

1. Verify that the Redis server is running in the pod and listening on port 6379:

        {% raw %}
       kubectl get pods redis-master --template='{{(index (index .spec.containers 0).ports 0).containerPort}}{{"\n"}}'
        {% endraw %}

    The output displays the port:

        6379

## Forward a local port to a port on the pod

1. Forward port 6379 on the local workstation to port 6379 of redis-master pod:

       kubectl port-forward redis-master 6379:6379

    The output is similar to this:

        I0710 14:43:38.274550    3655 portforward.go:225] Forwarding from 127.0.0.1:6379 -> 6379
        I0710 14:43:38.274797    3655 portforward.go:225] Forwarding from [::1]:6379 -> 6379

1. Start the Redis command line interface:

        redis-cli

1. At the Redis command line prompt, enter the `ping` command:

        127.0.0.1:6379>ping

    A successful ping request returns PONG.

{% endcapture %}


{% capture discussion %}

## Discussion

Connections made to local port 6379 are forwarded to port 6379 of the pod that
is running the Redis server. With this connection in place you can use your
local workstation to debug the database that is running in the pod.

{% endcapture %}


{% capture whatsnext %}
Learn more about [kubectl port-forward](/docs/user-guide/kubectl/v1.6/#port-forward).
{% endcapture %}


{% include templates/task.md %}
