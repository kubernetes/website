---
reviewers:
- chenopis
layout: docsportal
css: /css/style_user_journeys.css
js: https://use.fontawesome.com/4bcc658a89.js, https://cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js
title: Foundational
track: "USERS › APPLICATION DEVELOPER › FOUNDATIONAL"
content_template: templates/user-journey-content
---
{{% capture body %}}
## Learn to create a Containerized application

Try our virtual terminal to create a containerized application with an existing image{popup} running on Minikube.
Minikube is a lightweight Kubernetes implementation that creates a Virtual Machine on your local machine and deploys a simple cluster containing only one node.  
For the purposes of this tutorial, we have installed and preconfigured Minikube on the virtual terminal.


<div id="my-panel" data-katacoda-ondemand="true" data-katacoda-env="minikube" data-katacoda-command="minikube version; minikube start" data-katacoda-ui="panel"></div>
<script src="https://katacoda.com/embed.js"></script>
<button style="color:#000000; border:2px solid #000000" onclick="window.katacoda.init(); this.disabled=true;">Launch Terminal</button>




The ```minikube start``` command starts the Minikube cluster and the ```minikube version``` verifies the version of Minikube installed.

  ```
  kubectl version
  ```

1. View the cluster details


    ```
    kubectl cluster-info
    ```


2. View the nodes in the cluster that can be used to host your application:

  ```
  kubectl get nodes
  ```

3. Launch a deployment called http which will start a container based on the Docker Image katacoda/docker-http-server:latest:

```
kubectl run http --image=katacoda/docker-http-server:latest --replicas=1
```

4. View the status of your deployment:
```
kubectl get deployments
```

5. Determine the deployment created by viewing the description:

```
kubectl describe deployment http
```

The description includes how many replicas are available, labels specified and the events associated with the deployment. These events highlight any problems and errors that might have occurred.

6. Expose the deployment via kubectl expose command which allows you to define the different parameters of the service.
For instance, expose the container port 80 on the host 8000 binding to the external-ip of the host.

```
kubectl expose deployment http --external-ip="172.17.0.51" --port=8000 --target-port=80
```


7. Ping the host to view the result from the HTTP service.

```
curl http://172.17.0.51:8000
```


8. Use kubectl scale to adjust to adjust the number of Pods running for a particular deployment or replication controller.
Scaling the deployment requests Kubernetes to launch additional Pods. These Pods are automatically load balanced using the exposed Service.

```
kubectl scale --replicas=3 deployment http
```


Listing all the pods, you should see three running for the http deployment kubectl get pods

Once each Pod starts it will be added to the load balancer service. By describing the service you can view the endpoint and the associated Pods which are included.

kubectl describe svc http

Making requests to the service will request in different nodes processing the request.

curl http://172.17.0.51:8000
