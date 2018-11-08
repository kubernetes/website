---
title: Connect a Front End to a Back End Using a Service
content_template: templates/tutorial
weight: 70
---

{{% capture overview %}}

This task shows how to create a frontend and a backend
microservice. The backend microservice is a hello greeter. The
frontend and backend are connected using a Kubernetes Service object.

{{% /capture %}}


{{% capture objectives %}}

* Create and run a microservice using a Deployment object.
* Route traffic to the backend using a frontend.
* Use a Service object to connect the frontend application to the
  backend application.

{{% /capture %}}


{{% capture prerequisites %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* This task uses
  [Services with external load balancers](/docs/tasks/access-application-cluster/create-external-load-balancer/), which
  require a supported environment. If your environment does not
  support this, you can use a Service of type
  [NodePort](/docs/concepts/services-networking/service/#nodeport) instead.

{{% /capture %}}


{{% capture lessoncontent %}}

### Creating the backend using a Deployment

The backend is a simple hello greeter microservice. Here is the configuration
file for the backend Deployment:

{{< codenew file="service/access/hello.yaml" >}}

Create the backend Deployment:

```
kubectl create -f https://k8s.io/examples/service/access/hello.yaml
```

View information about the backend Deployment:

```
kubectl describe deployment hello
```

The output is similar to this:

```
Name:                           hello
Namespace:                      default
CreationTimestamp:              Mon, 24 Oct 2016 14:21:02 -0700
Labels:                         app=hello
                                tier=backend
                                track=stable
Annotations:                    deployment.kubernetes.io/revision=1
Selector:                       app=hello,tier=backend,track=stable
Replicas:                       7 desired | 7 updated | 7 total | 7 available | 0 unavailable
StrategyType:                   RollingUpdate
MinReadySeconds:                0
RollingUpdateStrategy:          1 max unavailable, 1 max surge
Pod Template:
  Labels:       app=hello
                tier=backend
                track=stable
  Containers:
   hello:
    Image:              "gcr.io/google-samples/hello-go-gke:1.0"
    Port:               80/TCP
    Environment:        <none>
    Mounts:             <none>
  Volumes:              <none>
Conditions:
  Type          Status  Reason
  ----          ------  ------
  Available     True    MinimumReplicasAvailable
  Progressing   True    NewReplicaSetAvailable
OldReplicaSets:                 <none>
NewReplicaSet:                  hello-3621623197 (7/7 replicas created)
Events:
...
```

### Creating the backend Service object

The key to connecting a frontend to a backend is the backend
Service. A Service creates a persistent IP address and DNS name entry
so that the backend microservice can always be reached. A Service uses
selector labels to find the Pods that it routes traffic to.

First, explore the Service configuration file:

{{< codenew file="service/access/hello-service.yaml" >}}

In the configuration file, you can see that the Service routes traffic to Pods
that have the labels `app: hello` and `tier: backend`.

Create the `hello` Service:

```
kubectl create -f https://k8s.io/examples/service/access/hello-service.yaml
```

At this point, you have a backend Deployment running, and you have a
Service that can route traffic to it.

### Creating the frontend

Now that you have your backend, you can create a frontend that connects to the backend.
The frontend connects to the backend worker Pods by using the DNS name
given to the backend Service. The DNS name is "hello", which is the value
of the `name` field in the preceding Service configuration file.

The Pods in the frontend Deployment run an nginx image that is configured
to find the hello backend Service. Here is the nginx configuration file:

{{< codenew file="service/access/frontend.conf" >}}

Similar to the backend, the frontend has a Deployment and a Service. The
configuration for the Service has `type: LoadBalancer`, which means that
the Service uses the default load balancer of your cloud provider.

{{< codenew file="service/access/frontend.yaml" >}}

Create the frontend Deployment and Service:

```
kubectl create -f https://k8s.io/examples/service/access/frontend.yaml
```

The output verifies that both resources were created:

```
deployment.apps/frontend created
service/frontend created
```

{{< note >}}
The nginx configuration is baked into the [container
image](/examples/service/access/Dockerfile). A better way to do this would
be to use a
[ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/),
so that you can change the configuration more easily.
{{< /note >}}

### Interact with the frontend Service

Once you’ve created a Service of type LoadBalancer, you can use this
command to find the external IP:

```
kubectl get service frontend --watch
```

This displays the configuration for the `frontend` Service and watches for
changes. Initially, the external IP is listed as `<pending>`:

```
NAME       TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)  AGE
frontend   ClusterIP  10.51.252.116   <pending>     80/TCP   10s
```

As soon as an external IP is provisioned, however, the configuration updates
to include the new IP under the `EXTERNAL-IP` heading:

```
NAME       TYPE        CLUSTER-IP      EXTERNAL-IP        PORT(S)  AGE
frontend   ClusterIP   10.51.252.116   XXX.XXX.XXX.XXX    80/TCP   1m
```

That IP can now be used to interact with the `frontend` service from outside the
cluster.

### Send traffic through the frontend

The frontend and backends are now connected. You can hit the endpoint
by using the curl command on the external IP of your frontend Service.

```
curl http://<EXTERNAL-IP>
```

The output shows the message generated by the backend:

```json
{"message":"Hello"}
```

{{% /capture %}}


{{% capture whatsnext %}}

* Learn more about [Services](/docs/concepts/services-networking/service/)
* Learn more about [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/)

{{% /capture %}}


