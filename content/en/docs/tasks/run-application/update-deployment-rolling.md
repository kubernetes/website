---
title: Update a Deployment Without Downtime
content_type: task
weight: 16
---

<!-- overview -->

This page shows how to update a running Deployment to a new version using a
rolling update. A rolling update gradually replaces old Pods with new ones, so
your application remains available throughout the process.

## {{% heading "objectives" %}}

- Performing a rolling update on a Deployment.
- Monitoring rollout progress.
- Pausing and resuming a rollout.
- Configuring rolling update strategy parameters.
- Rolling back to a previous revision.

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

## Performing a rolling update

Any change to the `.spec.template` field of a Deployment triggers a rolling
update. Kubernetes creates new Pods with the updated configuration and gradually
terminates old Pods.

### Updating with kubectl apply

The following manifest updates the nginx image from 1.14.2 to 1.16.1:

{{% code_sample file="application/deployment-update.yaml" options="hl_lines=17" %}}

Apply the updated manifest:

```shell
kubectl apply -f https://k8s.io/examples/application/deployment-update.yaml
```

### Updating only the container image

To update the container image without editing a manifest file, use
`kubectl set image`:

```shell
kubectl set image deployment/nginx-deployment nginx=nginx:1.16.1
```

The output is similar to:

```
deployment.apps/nginx-deployment image updated
```

## Monitoring rollout progress

Use `kubectl rollout status` to watch the progress of a rolling update:

```shell
kubectl rollout status deployment/nginx-deployment
```

The output is similar to:

```
Waiting for deployment "nginx-deployment" rollout to finish: 1 out of 2 new replicas have been updated...
Waiting for deployment "nginx-deployment" rollout to finish: 1 out of 2 new replicas have been updated...
Waiting for deployment "nginx-deployment" rollout to finish: 1 old replicas are pending termination...
deployment "nginx-deployment" successfully rolled out
```

After the rollout completes, verify the Deployment:

```shell
kubectl get deployment nginx-deployment
```

The output is similar to:

```
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   2/2     2            2           2m
```

## Pausing and resuming a rollout

You can pause a rollout to inspect a partial update or to batch multiple changes
into a single rollout.

### Pausing a rollout

```shell
kubectl rollout pause deployment/nginx-deployment
```

The output is similar to:

```
deployment.apps/nginx-deployment paused
```

### Making additional changes while paused

While the rollout is paused, you can make additional changes. These changes do
not trigger a new rollout until you resume:

```shell
kubectl set image deployment/nginx-deployment nginx=nginx:1.17.0
```

{{< note >}}
You can make multiple changes to a paused Deployment. Kubernetes applies all
changes together when you resume the rollout.
{{< /note >}}

### Resuming a rollout

```shell
kubectl rollout resume deployment/nginx-deployment
```

The output is similar to:

```
deployment.apps/nginx-deployment resumed
```

Verify the rollout completes:

```shell
kubectl rollout status deployment/nginx-deployment
```

## Configuring rolling update strategy

Deployments support two
[update strategy types](/docs/concepts/workloads/controllers/deployment/#strategy):

- **RollingUpdate** (default): gradually replaces old Pods with new ones.
- **Recreate**: terminates all existing Pods before creating new ones. This
  causes downtime.

For the RollingUpdate strategy, two parameters control how Kubernetes performs
the update:

| Parameter | Controls | Default | Example |
|-----------|----------|---------|---------|
| `maxUnavailable` | Maximum number of Pods that can be unavailable during the update | 25% | `1` or `25%` |
| `maxSurge` | Maximum number of extra Pods that can be created during the update | 25% | `1` or `25%` |

{{< note >}}
Both parameters accept an absolute number or a percentage. Kubernetes calculates
percentages from the desired replica count, rounding down for `maxUnavailable`
and rounding up for `maxSurge`.
{{< /note >}}

To configure these parameters, use `kubectl patch`:

```shell
kubectl patch deployment nginx-deployment -p '{"spec":{"strategy":{"type":"RollingUpdate","rollingUpdate":{"maxUnavailable":"25%","maxSurge":"25%"}}}}'
```

You can also set these fields in a Deployment manifest under
`.spec.strategy.rollingUpdate`. For detailed examples, see
[max unavailable](/docs/concepts/workloads/controllers/deployment/#max-unavailable)
and [max surge](/docs/concepts/workloads/controllers/deployment/#max-surge)
in the Deployment concepts documentation.

## Rolling back to a previous revision

If a new version introduces issues, you can roll back to a previous revision.

### Viewing rollout history

```shell
kubectl rollout history deployment/nginx-deployment
```

The output is similar to:

```
deployment.apps/nginx-deployment
REVISION  CHANGE-CAUSE
1         <none>
2         <none>
```

### Rolling back to the previous revision

```shell
kubectl rollout undo deployment/nginx-deployment
```

The output is similar to:

```
deployment.apps/nginx-deployment rolled back
```

### Rolling back to a specific revision

```shell
kubectl rollout undo deployment/nginx-deployment --to-revision=1
```

Verify the rollback completes:

```shell
kubectl rollout status deployment/nginx-deployment
```

{{< caution >}}
A Deployment's revision history is stored in the ReplicaSets it controls.
By default, Kubernetes retains 10 old ReplicaSets. You can change this limit
by setting `.spec.revisionHistoryLimit` in the Deployment manifest.
{{< /caution >}}

## {{% heading "cleanup" %}}

Delete the Deployment:

```shell
kubectl delete deployment nginx-deployment
```

## {{% heading "whatsnext" %}}

- Learn more about [Deployments](/docs/concepts/workloads/controllers/deployment/).
- Learn how to [scale a Deployment manually](/docs/tasks/run-application/scale-deployment/).
- Walk through [Horizontal Pod Autoscaling](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/).
- See how to [perform a rolling update on a DaemonSet](/docs/tasks/manage-daemon/update-daemon-set/).
