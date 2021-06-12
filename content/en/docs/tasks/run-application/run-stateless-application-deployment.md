---
title: Run a Stateless Application Using a Deployment
min-kubernetes-server-version: v1.9
content_type: tutorial
weight: 10
---

<!-- overview -->

This page shows how to run an application using a Kubernetes Deployment object.




## {{% heading "objectives" %}}


* Create an nginx deployment.
* Use kubectl to list information about the deployment.
* Update the deployment.




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}




<!-- lessoncontent -->

## Creating and exploring an nginx deployment

You can run an application by creating a Kubernetes Deployment object, and you
can describe a Deployment in a YAML file. For example, this YAML file describes
a Deployment that runs the nginx:1.14.2 Docker image:

{{< codenew file="application/deployment.yaml" >}}


1. Create a Deployment based on the YAML file:

        kubectl apply -f https://k8s.io/examples/application/deployment.yaml

1. Display information about the Deployment:

        kubectl describe deployment nginx-deployment

    The output is similar to this:

        Name:     nginx-deployment
        Namespace:    default
        CreationTimestamp:  Tue, 30 Aug 2016 18:11:37 -0700
        Labels:     app=nginx
        Annotations:    deployment.kubernetes.io/revision=1
        Selector:   app=nginx
        Replicas:   2 desired | 2 updated | 2 total | 2 available | 0 unavailable
        StrategyType:   RollingUpdate
        MinReadySeconds:  0
        RollingUpdateStrategy:  1 max unavailable, 1 max surge
        Pod Template:
          Labels:       app=nginx
          Containers:
           nginx:
            Image:              nginx:1.14.2
            Port:               80/TCP
            Environment:        <none>
            Mounts:             <none>
          Volumes:              <none>
        Conditions:
          Type          Status  Reason
          ----          ------  ------
          Available     True    MinimumReplicasAvailable
          Progressing   True    NewReplicaSetAvailable
        OldReplicaSets:   <none>
        NewReplicaSet:    nginx-deployment-1771418926 (2/2 replicas created)
        No events.

1. List the Pods created by the deployment:

        kubectl get pods -l app=nginx

    The output is similar to this:

        NAME                                READY     STATUS    RESTARTS   AGE
        nginx-deployment-1771418926-7o5ns   1/1       Running   0          16h
        nginx-deployment-1771418926-r18az   1/1       Running   0          16h

1. Display information about a Pod:

        kubectl describe pod <pod-name>

    where `<pod-name>` is the name of one of your Pods.

## Updating the deployment

You can update the deployment by applying a new YAML file. This YAML file
specifies that the deployment should be updated to use nginx 1.16.1.

{{< codenew file="application/deployment-update.yaml" >}}

1. Apply the new YAML file:

         kubectl apply -f https://k8s.io/examples/application/deployment-update.yaml

1. Watch the deployment create pods with new names and delete the old pods:

         kubectl get pods -l app=nginx

## Scaling the application by increasing the replica count

You can increase the number of Pods in your Deployment by applying a new YAML
file. This YAML file sets `replicas` to 4, which specifies that the Deployment
should have four Pods:

{{< codenew file="application/deployment-scale.yaml" >}}

1. Apply the new YAML file:

        kubectl apply -f https://k8s.io/examples/application/deployment-scale.yaml

1. Verify that the Deployment has four Pods:

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
added to Kubernetes, replicated applications were configured using a
[ReplicationController](/docs/concepts/workloads/controllers/replicationcontroller/).




## {{% heading "whatsnext" %}}


* Learn more about [Deployment objects](/docs/concepts/workloads/controllers/deployment/).




