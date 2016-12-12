---
title: Connecting a Front End to a Back End Using a Service
---

{% capture overview %}

In this tutorial you will create a frontend service and a backend
hello greeter microservice. You will connect the two using a
Kubernetes Service object.

{% endcapture %}


{% capture objectives %}

* Create and run microservices using Deployment objects.
* Route traffic to the backend using a frontend microservice.
* Use Service objects to connect the frontend application to the
  backend application.

{% endcapture %}


{% capture prerequisites %}

* {% include task-tutorial-prereqs.md %}

* This tutorial
  uses
  [Services with external Load Balancers](/docs/user-guide/load-balancer/) which
  require a supported environment. If your environment does not
  support this, you may
  use [Node Port](/docs/user-guide/services/#type-nodeport) instead.

{% endcapture %}


{% capture lessoncontent %}

### Creating the backends using Deployments

The backend is a simple hello greeter microservice. Create the `hello`
backend:

{% include code.html language="yaml" file="hello.yaml" ghlink="/docs/tutorials/connecting-apps/hello.yaml" %}

```
kubectl create -f http://k8s.io/docs/tutorials/connecting-apps/hello.yaml

deployment "hello" created
```

```
kubectl describe deployment hello

Name:                   		hello
Namespace:              		default
CreationTimestamp:      		Mon, 24 Oct 2016 14:21:02 -0700
Labels:                 		app=hello
                        		tier=backend
                        		track=stable
Selector:               		app=hello,tier=backend,track=stable
Replicas:               		7 updated | 7 total | 7 available | 0 unavailable
StrategyType:           		RollingUpdate
MinReadySeconds:        		0
RollingUpdateStrategy:  		1 max unavailable, 1 max surge
OldReplicaSets:         		<none>
NewReplicaSet:          		hello-3621623197 (7/7 replicas created)
Events:
...
```

### Creating the backend service

The key to connecting a frontend to a backend is the backend
service. A Service creates a persistant IP address and DNS name entry
so that our backend microservices can always be reached. Services use
selector labels to find the pods they route traffic to.

First, explore the service configuration file:

{% include code.html language="yaml" file="hello-service.yaml" ghlink="/docs/tutorials/connecting-apps/hello-service.yaml" %}

Create the `hello` Service using kubectl:

```
kubectl create -f http://k8s.io/docs/tutorials/connecting-apps/hello-service.yaml

service "hello" created
```

At this point, we have a backend Deployment running and we have a
Services that will route traffic to it.

### Creating the frontend

Now that we have our backend, we will create a frontend that needs to
be able to connect to the backend service.  We will configure our
frontend to connect to the backend workers using the DNS name given to
the backend service. This is the `name` attribute in the service
configuration above. Our frontend is nginx, and the configuration to
find the hello service is below.

{% include code.html file="frontend/frontend.conf" ghlink="/docs/tutorials/connecting-apps/frontend/frontend.conf" %}

To create the frontend we will use a Deployment and Service, similar
to how we create our backend objects. Since we want to create an
External IP address, we’ve added the `type: LoadBalancer` field to our
frontend.yaml file.  This uses the default load balancer for a cloud
provider.

{% include code.html language="yaml" file="frontend.yaml" ghlink="/docs/tutorials/connecting-apps/frontend.yaml" %}

```
kubectl create -f http://k8s.io/docs/tutorials/connecting-apps/frontend.yaml

deployment "frontend" created
service "frontend" created
```

> Note: We have the nginx configuration baked into the container
> image. A better way to do this would be to use
> a [ConfigMap](http://kubernetes.io/docs/user-guide/configmap/), so
> that you can change this more easily.

### Interact with the frontend Service

Once you’ve created an external load balancer, we’ll use the following
command to find the external IP:

```
kubectl get service frontend

NAME       CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE
frontend   10.51.252.116     <pending>         80/TCP   10s
```

The external IP field may take some time to populate.  If this is the
case, the external IP is listed as `<pending>`.

```
kubectl get service frontend

NAME       CLUSTER-IP      EXTERNAL-IP           PORT(S)   AGE
frontend   10.51.252.116     XXX.XXX.XXX.XXX    80/TCP   1m
```

### Send traffic through the frontend

The frontend and backend services are now connected.  You can hit the
endpoint by using the curl command on the external IP you found above.

```
curl http://<EXTERNAL-IP>

{"message":"Hello"}
```


{% endcapture %}


{% capture whatsnext %}

* Learn more about [Services](http://kubernetes.io/docs/user-guide/services/)
* Learn more about [ConfigMaps](http://kubernetes.io/docs/user-guide/configmap/)

{% endcapture %}

{% include templates/tutorial.md %}
