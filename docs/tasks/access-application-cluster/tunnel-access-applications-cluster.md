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

{% capture overview %}
This page shows how to use `kubectl port-forward` to connect to a Redis
database running in a Kubernetes cluster. This type of connection can be useful
for database debugging.

{% endcapture %}


{% capture prerequisites %}
? Hava a cluster ?
{% endcapture %}


{% capture steps %}

1. Create a Redis master:

        kubectl create -f examples/redis/redis-master.yaml pods/redis-master

1. Verify that the Redis master pod is running and ready:

        kubectl get pods

        NAME           READY     STATUS    RESTARTS   AGE
        redis-master   2/2       Running   0          41s

1. Verify that the Redis master is listening on port 6379:

        {% raw %}
        kubectl get pods redis-master --template='{{(index (index .spec.containers 0).ports 0).containerPort}}{{"\n"}}' 6379
        {% endraw %}

1. Forward port 6379 on the local workstation to port 6379 of redis-master pod:

        kubectl port-forward redis-master 6379:6379

        I0710 14:43:38.274550    3655 portforward.go:225] Forwarding from 127.0.0.1:6379 -> 6379
        I0710 14:43:38.274797    3655 portforward.go:225] Forwarding from [::1]:6379 -> 6379

1. Verify that the connection was successful:

        redis-cli 127.0.0.1:6379> ping

        PONG

{% endcapture %}


{% capture discussion %}

The `kubectl port-forward `command forwards connections made to a local port to
a port on a pod. After the connection is in place, you can debug the database
from the local workstation.

Compare to kubectl proxy.

{% endcapture %}


{% capture whats_next %}

Link to related topics.

{% endcapture %}


{% include templates/task.md %}
