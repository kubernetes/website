---
title: Overprovision Node Capacity For A Cluster 
content_type: task
weight: 10
---


<!-- overview -->

This page guides you through configuring {{< glossary_tooltip text="Node" term_id="node" >}} overprovisioning in your Kubernetes cluster. Node overprovisioning is a strategy that proactively reserves a portion of your cluster's compute resources. This reservation helps reduce the time required to schedule new pods during scaling events, enhancing your cluster's responsiveness to sudden spikes in traffic or workload demands. 

By maintaining some unused capacity, you ensure that resources are immediately available when new pods are created, preventing them from entering a pending state while the cluster scales up.

## {{% heading "prerequisites" %}}

- You need to have a Kubernetes cluster, and the kubectl command-line tool must be configured to communicate with 
  your cluster.
- You should already have a basic understanding of
  [Deployments](/docs/concepts/workloads/controllers/deployment/),
  Pod {{<glossary_tooltip text="priority" term_id="pod-priority">}},
  and [PriorityClasses](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass).
- Your cluster must be set up with an [autoscaler](/docs/concepts/cluster-administration/cluster-autoscaling/)
  that manages nodes based on demand.

<!-- steps -->

## Create a placeholder Deployment

Begin by defining a PriorityClass for the placeholder Pods. First, create a PriorityClass with a
negative priority value, that you will shortly assign to the placeholder pods.
Later, you will set up a Deployment that uses this PriorityClass

{{% code_sample language="yaml" file="priorityclass/low-priority-class.yaml" %}}

Then create the PriorityClass:

```shell
kubectl apply -f https://k8s.io/examples/priorityclass/low-priority-class.yaml
```

You will next define a Deployment that uses the negative-priority PriorityClass and runs a minimal container.
When you add this to your cluster, Kubernetes runs those placeholder pods to reserve capacity. Any time there
is a capacity shortage, the control plane will pick one these placeholder pods as the first candidate to
{{< glossary_tooltip text="preempt" term_id="preemption" >}}.

Review the sample manifest:

{{% code_sample language="yaml" file="deployments/deployment-with-capacity-reservation.yaml" %}}

Create a Deployment based on that manifest:

```shell
kubectl apply -f https://k8s.io/examples/deployments/deployment-with-capacity-reservation.yaml
```

## Adjust placeholder resource requests

Configure the resource requests and limits for the placeholder pods to define the amount of overprovisioned resources you want to maintain. This reservation ensures that a specific amount of CPU and memory is kept available for new pods.

To edit the Deployment, modify the `resources` section in the Deployment manifest file
to set appropriate requests and limits. You can download that file locally and then edit it
with whichever text editor you prefer.

For example, to reserve 500m CPU and 1Gi memory across 5 placeholder pods,
define the resource requests and limits for a single placeholder pod as follows:

```yaml
  resources:
    requests:
      cpu: "100m"
      memory: "200Mi"
    limits:
      cpu: "100m"
```

## Set the desired replica count

### Calculate the total reserved resources

For example, with 5 replicas each reserving 0.1 CPU and 200MiB of memory:

Total CPU reserved: 5 × 0.1 = 0.5 (in the Pod specification, you'll write the quantity `500m`)
Total Memory reserved: 5 × 200MiB = 1GiB (in the Pod specification, you'll write `1 Gi`)

To scale the Deployment, adjust the number of replicas based on your cluster's size and expected workload:

```shell
kubectl scale deployment capacity-reservation --replicas=5
```

Verify the scaling:

```shell
kubectl get deployment capacity-reservation
```

The output should reflect the updated number of replicas:

```none
NAME                   READY   UP-TO-DATE   AVAILABLE   AGE
capacity-reservation   5/5     5            5           2m
```

{{< note >}}
Some autoscalers, notably [Karpenter](/docs/concepts/cluster-administration/cluster-autoscaling/#autoscaler-karpenter),
treat preferred affinity rules as hard rules when considering node scaling.
If you use Karpenter or another node autoscaler that uses the same heuristic,
the replica count you set here  also sets a minimum node count for your cluster.
{{< /note >}}

## {{% heading "whatsnext" %}}

- Learn more about [PriorityClasses](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass) and how they affect pod scheduling.
- Explore [node autoscaling](/docs/concepts/cluster-administration/cluster-autoscaling/) to dynamically adjust your cluster's size based on workload demands.
- Understand [Pod preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/), a
  key mechanism for Kubernetes to handle resource contention. The same page covers _eviction_,
  which is less relevant to the placeholder Pod approach, but is also a mechanism for Kubernetes
  to react when resources are contended.