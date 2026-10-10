---
title: Horizontal Manual Scaling for a Deployment
content_type: task
weight: 15
---

<!-- overview -->

This page shows how to manually scale a Deployment horizontally, by changing its replica count.
Manual scaling lets you directly control the number of running Pods for predictable load changes or cost management.

This is different from _vertical scaling_: leaving the replica count the same, but adjusting
the amount of resources available to each Pod.

## {{% heading "objectives" %}}

- Scaling up a Deployment to handle more traffic.
- Scaling down a Deployment to conserve resources.
- Scaling a Deployment to zero to suspend a workload.
- Understanding when to use manual scaling versus a HorizontalPodAutoscaler.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

You need an existing Deployment. If you do not have one, and you just want to practice,
you can create the nginx Deployment from
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

There are several different ways you can change the replica count for an
existing Deployment.

### Scaling up using `kubectl scale`


Use `kubectl scale` to set the replica count:

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

### Declarative scaling using `kubectl apply`

Instead of running an imperative command, you can update the manifest file and
apply it. This approach fits well with version-controlled configuration
workflows.

Save the current Deployment configuration to a local file:

```shell
kubectl get deployment nginx-deployment -o yaml > /tmp/nginx-deployment.yaml
```

Edit `/tmp/nginx-deployment.yaml` and change `.spec.replicas` to `4`.

Before applying, compare your local changes against the cluster state:

```shell
kubectl diff -f /tmp/nginx-deployment.yaml
```

Apply the edited manifest:

```shell
kubectl apply -f /tmp/nginx-deployment.yaml
```

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

### Scale using `kubectl edit`

```shell
kubectl edit deployment nginx-deployment
```

Change the `.spec.replicas` field in the editor, then save and exit.

### Scale using `kubectl patch`

You can update `.spec.replicas` with a strategic merge patch:

```shell
kubectl patch deployment nginx-deployment -p '{"spec":{"replicas":4}}'
```

For scripting, use a JSON patch with a prerequisite test. The following command sets the replica count to 4, but only if the current count is 2:

```shell
kubectl patch deployment nginx-deployment --type=json -p='[
  {"op": "test", "path": "/spec/replicas", "value": 2},
  {"op": "replace", "path": "/spec/replicas", "value": 4}
]'
```

The `test` operation causes the patch to fail if the current value does not match, which prevents unintended changes when multiple people or scripts modify the same Deployment.

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
