---
reviewers:
- lmktfy
- Caesarsage
title: Scale a Deployment Manually
content_type: Task
weight: 90
---

<!-- overview -->

This page shows how to manually scale a Kubernetes Deployment, and explains when manual scaling is appropriate compared to automatic scaling.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- lesson content -->

## Create a sample Deployment

If you do not already have a Deployment, follow the instructions in [Run a Stateless Application Using a Deployment](/docs/tasks/run-application/run-stateless-application-deployment/) to create one.

Alternatively, you can create a simple Deployment for testing.

```shell
kubectl create deployment nginx --image=nginx
```

To verify that the Deployment was created, run:

```shell
kubectl get deployments
```

The output is similar to this:

```
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
nginx              1/1     1            1           10s
```

## Scaling a Deployment manually

Manual scaling adjusts the number of running Pods for a workload by using commands such as `kubectl scale`.

### Scale up a Deployment

Scaling up increases the capacity of an application to handle additional load.

To increase the number of replicas:

```shell
kubectl scale deployment <deployment_name> --replicas=4
```

{{< note >}}
Replace <deployment_name> with the name of your Deployment (for example, nginx).
{{</ note >}}

To verify the change in the Deployment:

```shell
kubectl get deployment <deployment_name>
kubectl get pods
```

The output is similar to this:

```
NAME    READY   UP-TO-DATE   AVAILABLE   AGE
nginx   4/4     4            4           3m16s
```
```
NAME                     READY   STATUS    RESTARTS   AGE
nginx-56c45fd5ff-xxxxx   1/1     Running   0          60s
nginx-56c45fd5ff-xxxxx   1/1     Running   0          60s
nginx-56c45fd5ff-xxxxx   1/1     Running   0          60s
nginx-56c45fd5ff-xxxxx   1/1     Running   0          60s
```

When the replica count is increased from 1 to 4, Kubernetes creates two additional Pods to match the desired state and schedules them to available nodes while keeping the existing Pods unchanged.

### Scale down a Deployment

Scaling down decreases the capacity of an application by decreasing the number of running Pods, allowing Kubernetes to terminate excess capacity while maintaining the desired state.

To reduce the number of replicas:

```shell
kubectl scale deployment <deployment_name> --replicas=2
```

{{< note >}}
Replace <deployment_name> with the name of your Deployment (for example, nginx).
{{</ note >}}

To verify the change in the Deployment:

```shell
kubectl get deployment <deployment_name>
kubectl get pods
```

The output is similar to this:

```
NAME    READY   UP-TO-DATE   AVAILABLE   AGE
nginx   2/2     2            2           7m16s
```
```
NAME                     READY   STATUS    RESTARTS   AGE
nginx-56c45fd5ff-xxxxx   1/1     Running   0          4m58s
nginx-56c45fd5ff-xxxxx   1/1     Running   0          7m27s
```

When scaling down, Kubernetes terminates Pods following the Pod termination lifecycle.

### Scale a Deployment to zero

Scale to zero sets the replica count of a workload to 0.

To stop all Pods managed by a Deployment:

```shell
kubectl scale deployment <deployment_name> --replicas=0
```

{{< note >}}
Replace <deployment_name> with the name of your Deployment (for example, nginx).
{{</ note >}}

To verify that the Deployment is scaled to zero:

```shell
kubectl get deployment <deployment_name>
kubectl get pods
```

The output is similar to this:

```
NAME    READY   UP-TO-DATE   AVAILABLE   AGE
nginx   0/0     0            0           19m
```
```
No resources found in default namespace.
```

This output shows that the Deployment still exists with zero desired replicas, and that no Pods are running.

## Cleanup/kubectl delete deployment nginx

Delete the Deployment by name:

```
kubectl delete deployment <deployment_name>
```

{{< note >}}
Replace <deployment_name> with the name of your Deployment (for example, nginx).
{{</ note >}}

To verify the Deploument is terminated:

```
kubectl get deployment <deployment_name>
kubectl get pods
```

The output is similar to this:

```
No resources found in default namespace.
```

This output shows that the Deployment is terminated.

## Manual scaling versus automatic scaling

| Manual scaling | Automatic scaling |
|----------------|-------------------|
| Developer updates replica count | Kubernetes adjusts replicas based on metrics |
| Predictable or temporary workload changes | Variable or unpredictable workloads |
| Use case: load testing, planned traffic increases | Use case: production services with fluctuating traffic |
| Explicit control over replicas | Autoscaling logic controls replicas |


Kubernetes supports automatic scaling using a [HorizontalPodAutoscaler](/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/) (HPA).
If an HPA is enabled for a Deployment, the HPA may override replica counts that you have set manually.

## {{% heading "whatsnext" %}}
- Learn more about [HorizontalPodAutoscaler](/docs/tasks/run-application/horizontal-pod-autoscale/)
- Read about [Pod disruption budgets](/docs/concepts/workloads/pods/disruptions/)