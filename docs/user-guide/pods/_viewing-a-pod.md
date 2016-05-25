To view a specific pod, use the `kubectl get` command:

```shell
$ kubectl get pod NAME
NAME                       READY   STATUS    RESTARTS   AGE
example-1934187764-scau1   1/1     Running   0          2d
```

To return the name of the node on which the pod is scheduled, use the `-o wide`
option:

```shell
$ kubectl get pod NAME -o wide
NAME                       READY   STATUS    RESTARTS   AGE   NODE
example-1934187764-scau1   1/1     Running   0          2d    gke-example-c6a38-node-xij3
```

For more details about a pod, including events, use `describe` in place of
`get`:

```shell
$ kubectl describe pod NAME
Name:        example-1934187764-scau1
Namespace:   default
Image(s):    kubernetes/example-php-redis:v2
Node:        gke-example-c6a38461-node-xij3/10.240.34.183
Labels:      name=frontend
Status:      Running
Reason:
Message:
IP:          10.188.2.10
Replication Controllers:  example (5/5 replicas created)
Containers:
  php-redis:
    Image:   kubernetes/example-php-redis:v2
    Limits:
      cpu:   100m
    State:   Running
      Started:   Tue, 04 Aug 2015 09:02:46 -0700
    Ready:   True
    Restart Count: 0
Conditions:
  Type    Status
  Ready   True
Events:
  FirstSeen                       LastSeen                        Coun From                                     SubobjectPath            Reason  Message
  Thu, 06 Aug 2015 11:49:44 -0700 Thu, 06 Aug 2015 11:49:44 -0700 1    {kubelet gke-example-c6a38461-node-xij3} spec.containers{example} started Started with docker id 5705bffa65e2
```

To list all pods running on a cluster:

```shell
$ kubectl get pods

NAME                       READY     STATUS    RESTARTS   AGE
example-1934187764-scau1   1/1       Running   0          1m
frontend-7kdod             1/1       Running   0          1d
```