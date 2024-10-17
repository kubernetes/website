---
title: Configure a Node to Overprovision a Cluster's capacity
content_type: task
weight: 10
---


<!-- overview -->

This page guides you through configuring {{< glossary_tooltip text="Node" term_id="node" >}} overprovisioning in your Kubernetes cluster. Node overprovisioning is a strategy that proactively reserves a portion of your cluster's compute resources. This reservation helps reduce the time required to schedule new pods during scaling events, enhancing your cluster's responsiveness to sudden spikes in traffic or workload demands. 

By maintaining some unused capacity, you ensure that resources are immediately available when new pods are created, preventing them from entering a pending state while the cluster scales up.

## {{% heading "prerequisites" %}}

- Have a basic understanding of Deployments and PriorityClasses.
- Your cluster must be set up with an [autoscaler](/docs/concepts/cluster-administration/cluster-autoscaling/)
  that manages nodes based on demand.

<!-- steps -->

## Create a placeholder Deployment

Begin by defining a PriorityClass for the placeholder Pods. First, create a PriorityClass with a low value to assign to the placeholder pods.
Later, you will set up a Deployment that uses this PriorityClass

{{% code_sample language="yaml" file="priorityclass/low-priority-class.yaml" %}}

Then create the PriorityClass:

```shell
kubectl apply -f https://k8s.io/examples/priorityclass/low-priority-class.yaml
```

Now, define a Deployment that uses the low-priority PriorityClass and runs a minimal container.

{{% code_sample language="yaml" file="deployments/deployment-with-low-priorityclass.yaml" %}}

Apply the deployment:

```shell
kubectl apply -f https://k8s.io/examples/deployments/deployment-with-low-priorityclass.yaml"
```

## Adjust Resource Requests and Limits

Configure the resource requests and limits for the placeholder pods to define the amount of overprovisioned resources you want to maintain. This reservation ensures that a specific amount of CPU and memory is kept available for new pods.

To edit the Deployment Configuration, modify the resources section in the Deployment YAML to set appropriate requests and limits. 

For example, to reserve 500m CPU and 1Gi memory across all placeholder pods, define the resource requests and limits for a single placeholder pod:

```yaml
  resources:
    requests:
      cpu: "100m"
      memory: "200Mi"
    limits:
      cpu: "100m"
      memory: "200Mi"
```

## Set the Desired Replica Count

Determine the number of placeholder pods needed to achieve your desired level of overprovisioning. Start with a small number and gradually increase it to balance resource reservation with cost.

Calculate the Total Reserved Resources:

For example, with 5 replicas each reserving 0.1 CPU and 200MiB of memory:

Total CPU reserved: 5 × 0.1 = 0.5 (in the Pod specification, you'll write the quantity `500m`)
Total Memory reserved: 5 × 200MiB = 1GiB (in the Pod specification, you'll write `1 Gi`)

To Scale the Deployment, adjust the number of replicas based on your cluster's size and expected workload:

```shell
kubectl scale deployment https://k8s.io/examples/deployments/deployment-with-low-priorityclass.yaml --replicas=5
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