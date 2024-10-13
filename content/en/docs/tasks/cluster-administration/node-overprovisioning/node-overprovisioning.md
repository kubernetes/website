---
title: Configure a Node to Overprovision a Cluster's capacity
content_type: task
weight: 10
---


<!-- overview -->

This page guides you through configuring {{< glossary_tooltip text="Node" term_id="node" >}} overprovisioning in your Kubernetes cluster. Node overprovisioning is a strategy that proactively reserves a portion of your cluster's compute resources. This reservation helps reduce the time required to schedule new pods during scaling events, enhancing your cluster's responsiveness to sudden spikes in traffic or workload demands. 

By maintaining some unused capacity, you ensure that resources are immediately available when new pods are created, preventing them from entering a pending state while the cluster scales up.

## {{% heading "prerequisites" %}}

- You need to have a running Kubernetes cluster.
- Have kubectl configured to interact with your cluster.
- Have a basic understanding of Kubernetes Deployments and Priority Classes.

<!-- steps -->

## Create a Placeholder Deployment

Begin by creating a Deployment that runs placeholder pods. These pods should use a minimal process, such as a pause container, and have a very low priority to ensure they can be easily preempted when higher-priority pods require resources.

To define a Low-Priority Priority Class. First, create a Priority Class with a low value to assign to the placeholder pods.

```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: low-priority
value: 1000
globalDefault: false
description: "Low priority for placeholder pods to enable overprovisioning."
```

Then apply the Priority Class:

```shell
kubectl apply -f low-priority-class.yaml
```

Now, to create the Placeholder Deployment, define a deployment that uses the low-priority Priority Class and runs a minimal container.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: placeholder-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: placeholder
  template:
    metadata:
      labels:
        app: placeholder
    spec:
      priorityClassName: low-priority
      containers:
      - name: pause
        image: k8s.gcr.io/pause:3.2
        resources:
          requests:
            cpu: "50m"
            memory: "100Mi"
          limits:
            cpu: "50m"
            memory: "100Mi"
```

Apply the deployment:

```shell
kubectl apply -f placeholder-deployment.yaml
```

## Adjust Resource Requests and Limits

Configure the resource requests and limits for the placeholder pods to define the amount of overprovisioned resources you want to maintain. This reservation ensures that a specific amount of CPU and memory is kept available for new pods.

To edit the Deployment Configuration, modify the resources section in the Deployment YAML to set appropriate requests and limits. For example, to reserve 500m CPU and 1Gi memory across all placeholder pods:

```yaml
resources:
  requests:
    cpu: "100m"
    memory: "200Mi"
  limits:
    cpu: "100m"
    memory: "200Mi"
```

Now, to adjust the replicas count accordingly to achieve the desired total reserved resources, update the Deployment with the new resource configurations ensuring the aggregate of all placeholder pods meets your overprovisioning targets:

```shell
kubectl apply -f placeholder-deployment.yaml
```

## Set the Desired Replica Count

Determine the number of placeholder pods needed to achieve your desired level of overprovisioning. Start with a small number and gradually increase it to balance resource reservation with cost.

Calculate the Total Reserved Resources:

For example, with 5 replicas each reserving 100m CPU and 200Mi memory:

Total CPU reserved: 5 * 100m = 500m
Total Memory reserved: 5 * 200Mi = 1Gi

To Scale the Deployment, adjust the number of replicas based on your cluster's size and expected workload:

```shell
kubectl scale deployment placeholder-deployment --replicas=5
```

Verify the scaling:

```shell
kubectl get deployment placeholder-deployment
```

The output should reflect the updated number of replicas:

```none
NAME                   READY   UP-TO-DATE   AVAILABLE   AGE
placeholder-deployment 5/5     5            5           2m
```

## {{% heading "whatsnext" %}}

- Learn more about Priority Classes and how they affect pod scheduling.
- Explore Cluster Autoscaling to dynamically adjust your cluster's size based on workload demands.
- Understand Pod Preemption to manage how Kubernetes handles resource contention.