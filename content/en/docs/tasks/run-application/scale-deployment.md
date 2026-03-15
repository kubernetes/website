---
title: Scale a Deployment Manually
content_type: task
weight: 15
---

<!-- overview -->

This page shows how to manually scale a Deployment by changing its replica count.
Manual scaling lets you directly control the number of running Pods for predictable load changes or cost management.

## {{% heading "objectives" %}}

- Scaling up a Deployment to handle more traffic.
- Scaling down a Deployment to conserve resources.
- Scaling a Deployment to zero to suspend a workload.
- Understanding when to use manual scaling versus a HorizontalPodAutoscaler.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

You need an existing Deployment. If you do not have one, create the nginx
Deployment from
[Run a Stateless Application Using a Deployment](/docs/tasks/run-application/run-stateless-application-deployment/):

```shell
kubectl apply -f https://k8s.io/examples/application/deployment.yaml
```

Verify the Deployment runs two Pods:

```shell
kubectl get deployment nginx-deployment
```

The output is similar to:

```
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   2/2     2            2           10s
```

<!-- steps -->

## Scaling up a Deployment

Use `kubectl scale` to increase the replica count:

```shell
kubectl scale deployment/nginx-deployment --replicas=4
```

The output is similar to:

```
deployment.apps/nginx-deployment scaled
```

Verify that the Deployment has four Pods:

```shell
kubectl get deployment nginx-deployment
```

The output is similar to:

```
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   4/4     4            4           1m
```

### Declarative scaling with kubectl apply

You can also scale a Deployment declaratively by updating the `.spec.replicas`
field in the manifest and applying it:

{{% code_sample file="application/deployment-scale.yaml" %}}

```shell
kubectl apply -f https://k8s.io/examples/application/deployment-scale.yaml
```

{{< note >}}
This manifest also updates the container image. When you apply it, Kubernetes
performs both a scale and a rolling update.
{{< /note >}}

## Scaling down a Deployment

To reduce the number of Pods, set `--replicas` to a lower value:

```shell
kubectl scale deployment/nginx-deployment --replicas=2
```

Kubernetes gracefully terminates the excess Pods, respecting each Pod's
`terminationGracePeriodSeconds` setting.

Verify that the Deployment has two Pods:

```shell
kubectl get pods -l app=nginx
```

The output is similar to:

```
NAME                                READY   STATUS    RESTARTS   AGE
nginx-deployment-66b6c48dd5-7gl6h   1/1     Running   0          2m
nginx-deployment-66b6c48dd5-v8mkd   1/1     Running   0          2m
```

## Scaling to zero

You can scale a Deployment to zero to temporarily suspend the workload without
deleting the Deployment itself:

```shell
kubectl scale deployment/nginx-deployment --replicas=0
```

Verify that no Pods are running:

```shell
kubectl get deployment nginx-deployment
```

The output is similar to:

```
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   0/0     0            0           5m
```

{{< note >}}
Scaling to zero removes all Pods but preserves the Deployment and its
ReplicaSet. Scale back up at any time by setting `--replicas` to a positive
number.
{{< /note >}}

Common use cases for scaling to zero include:

- Temporarily suspending a workload to save resources
- Debugging or maintenance windows
- Cost control in development or staging environments

## Other ways to change the replica count

In addition to `kubectl scale`, you can change `.spec.replicas` with
`kubectl edit` or `kubectl patch`.

### kubectl edit

```shell
kubectl edit deployment nginx-deployment
```

Change the `.spec.replicas` field in the editor, then save and exit.

### kubectl patch

```shell
kubectl patch deployment nginx-deployment -p '{"spec":{"replicas":4}}'
```

## When to use manual versus automatic scaling

| Aspect | Manual scaling | Automatic scaling (HPA) |
|--------|---------------|------------------------|
| Best for | Predictable, scheduled, or one-off load changes | Variable or unpredictable demand |
| How it works | You set `.spec.replicas` directly | HPA adjusts replicas based on observed metrics |
| Response time | Immediate when you run the command | Reacts to metrics with a short delay |
| Metrics awareness | None — you decide the replica count | Monitors CPU, memory, or custom metrics |
| Maintenance | Requires manual intervention to adjust | Runs autonomously after configuration |

{{< caution >}}
If a HorizontalPodAutoscaler manages a Deployment, do not set replicas manually.
The HPA continuously reconciles the replica count and overrides any manual
changes.
{{< /caution >}}

## {{% heading "cleanup" %}}

Delete the Deployment:

```shell
kubectl delete deployment nginx-deployment
```

## {{% heading "whatsnext" %}}

- Learn more about [Deployments](/docs/concepts/workloads/controllers/deployment/).
- Walk through [Horizontal Pod Autoscaling](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/).
- Learn how to [scale a StatefulSet](/docs/tasks/run-application/scale-stateful-set/).
- Read about [managing resources](/docs/concepts/cluster-administration/manage-deployment/).
