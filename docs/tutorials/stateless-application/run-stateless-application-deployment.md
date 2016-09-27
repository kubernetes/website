---
---

{% capture overview %}

This page shows how to run an application using a Kubernetes Deployment object.

{% endcapture %}


{% capture objectives %}

* Create an nginx deployment.
* Use kubectl to list information about the deployment.
* Update the deployment.

{% endcapture %}


{% capture prerequisites %}

* To do this tutorial, you need a Kubernetes cluster, including a running
  Kubernetes API server. You can use an existing cluster, or you can create a
  new cluster. One way to create a new cluster is to use
  [Minikube](/docs/getting-started-guides/minikube).

* You also need to have `kubectl` installed on your local machine, and `kubectl`
  must be configured to communicate with your Kubernetes API server. This
  configuration is done automatically if you use Minikube.

{% endcapture %}


{% capture lessoncontent %}

### Creating and exploring an nginx deployment

You can run an application by creating a Kubernetes Deployment object, and you
can describe a Deployment in a YAML file. For example, this YAML file describes
a Deployment that runs the nginx:1.7.9 Docker image:

{% include code.html language="yaml" file="deployment.yaml" ghlink="/docs/tutorials/stateless-application/deployment.yaml" %}


1. Create a Deployment based on the YAML file:

        export REPO=https://raw.githubusercontent.com/kubernetes/kubernetes.github.io/master
        kubectl create -f $REPO/docs/tutorials/stateless-application/deployment.yaml

1. Display information about the Deployment:

        kubectl describe deployment nginx-deployment

        user@computer:~/kubernetes.github.io$ kubectl describe deployment nginx-deployment
        Name:     nginx-deployment
        Namespace:    default
        CreationTimestamp:  Tue, 30 Aug 2016 18:11:37 -0700
        Labels:     app=nginx
        Selector:   app=nginx
        Replicas:   2 updated | 2 total | 2 available | 0 unavailable
        StrategyType:   RollingUpdate
        MinReadySeconds:  0
        RollingUpdateStrategy:  1 max unavailable, 1 max surge
        OldReplicaSets:   <none>
        NewReplicaSet:    nginx-deployment-1771418926 (2/2 replicas created)
        No events.

1. List the pods created by the deployment:

        kubectl get pods -l app=nginx

        NAME                                READY     STATUS    RESTARTS   AGE
        nginx-deployment-1771418926-7o5ns   1/1       Running   0          16h
        nginx-deployment-1771418926-r18az   1/1       Running   0          16h

1. Display information about a pod:

        kubectl describe pod <pod-name>

    where `<pod-name>` is the name of one of your pods.

### Updating the deployment

You can update the deployment by applying a new YAML file. This YAML file
specifies that the deployment should be updated to use nginx 1.8.

{% include code.html language="yaml" file="deployment-update.yaml" ghlink="/docs/tutorials/stateless-application/deployment-update.yaml" %}

1. Apply the new YAML file:

        kubectl apply -f $REPO/docs/tutorials/stateless-application/deployment-update.yaml

1. Watch the deployment create pods with new names and delete the old pods:

        kubectl get pods -l app=nginx

### Deleting a deployment

Delete the deployment by name:

    kubectl delete deployment nginx-deployment

{% endcapture %}


{% capture whatsnext %}

* Learn more about [Deployment objects](/docs/user-guide/deployments/).

* Learn more about [Deploying applications](/docs/user-guide/deploying-applications/)

{% endcapture %}

{% include templates/tutorial.md %}
