---
title: Run a Stateless Application Using a Deployment
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

{% include task-tutorial-prereqs.md %}

{% endcapture %}


{% capture lessoncontent %}

## Creating and exploring an nginx deployment

You can run an application by creating a Kubernetes Deployment object, and you
can describe a Deployment in a YAML file. For example, this YAML file describes
a Deployment that runs the nginx:1.7.9 Docker image:

{% include code.html language="yaml" file="deployment.yaml" ghlink="/docs/tasks/run-application/deployment.yaml" %}


1. Create a Deployment based on the YAML file:

        kubectl create -f https://k8s.io/docs/tasks/run-application/deployment.yaml

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
        Conditions:
          Type          Status  Reason
          ----          ------  ------
          Available     True    MinimumReplicasAvailable
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

## Updating the deployment

You can update the deployment by applying a new YAML file. This YAML file
specifies that the deployment should be updated to use nginx 1.8.

{% include code.html language="yaml" file="deployment-update.yaml" ghlink="/docs/tutorials/stateless-application/deployment-update.yaml" %}

1. Apply the new YAML file:

        kubectl apply -f https://k8s.io/docs/tutorials/stateless-application/deployment-update.yaml

1. Watch the deployment create pods with new names and delete the old pods:

        kubectl get pods -l app=nginx

## Scaling the application by increasing the replica count

You can increase the number of pods in your Deployment by applying a new YAML
file. This YAML file sets `replicas` to 4, which specifies that the Deployment
should have four pods:

{% include code.html language="yaml" file="deployment-scale.yaml" ghlink="/docs/tutorials/stateless-application/deployment-scale.yaml" %}

1. Apply the new YAML file:

        kubectl apply -f https://k8s.io/docs/tutorials/stateless-application/deployment-scale.yaml

1. Verify that the Deployment has four pods:

        kubectl get pods -l app=nginx

    The output is similar to this:

        NAME                               READY     STATUS    RESTARTS   AGE
        nginx-deployment-148880595-4zdqq   1/1       Running   0          25s
        nginx-deployment-148880595-6zgi1   1/1       Running   0          25s
        nginx-deployment-148880595-fxcez   1/1       Running   0          2m
        nginx-deployment-148880595-rwovn   1/1       Running   0          2m

## Deleting a deployment

Delete the deployment by name:

    kubectl delete deployment nginx-deployment

## ReplicationControllers -- the Old Way

The preferred way to create a replicated application is to use a Deployment,
which in turn uses a ReplicaSet. Before the Deployment and ReplicaSet were
added to Kubernetes, replicated applications were configured by using a
[ReplicationController](/docs/concepts/workloads/controllers/replicationcontroller/).

{% endcapture %}


{% capture whatsnext %}

* Learn more about [Deployment objects](/docs/concepts/workloads/controllers/deployment/).

{% endcapture %}

{% include templates/tutorial.md %}
