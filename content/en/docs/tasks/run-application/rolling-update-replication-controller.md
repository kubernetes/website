---
reviewers:
- janetkuo
title: Perform Rolling Update Using a Replication Controller
content_template: templates/concept
weight: 80
---

{{% capture overview %}}

{{< note >}}
The preferred way to create a replicated application is to use a
[Deployment](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#deployment-v1-apps),
which in turn uses a
[ReplicaSet](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#replicaset-v1-apps).
For more information, see
[Running a Stateless Application Using a Deployment](/docs/tasks/run-application/run-stateless-application-deployment/).
{{< /note >}}

To update a service without an outage, `kubectl` supports what is called [rolling update](/docs/reference/generated/kubectl/kubectl-commands/#rolling-update), which updates one pod at a time, rather than taking down the entire service at the same time. See the [rolling update design document](https://git.k8s.io/community/contributors/design-proposals/cli/simple-rolling-update.md) for more information.

Note that `kubectl rolling-update` only supports Replication Controllers. However, if you deploy applications with Replication Controllers,
consider switching them to [Deployments](/docs/concepts/workloads/controllers/deployment/). A Deployment is a higher-level controller that automates rolling updates
of applications declaratively, and therefore is recommended. If you still want to keep your Replication Controllers and use `kubectl rolling-update`, keep reading:

A rolling update applies changes to the configuration of pods being managed by
a replication controller. The changes can be passed as a new replication
controller configuration file; or, if only updating the image, a new container
image can be specified directly.

A rolling update works by:

1. Creating a new replication controller with the updated configuration.
2. Increasing/decreasing the replica count on the new and old controllers until
   the correct number of replicas is reached.
3. Deleting the original replication controller.

Rolling updates are initiated with the `kubectl rolling-update` command:

```shell
kubectl rolling-update NAME NEW_NAME --image=IMAGE:TAG

# or read the configuration from a file
kubectl rolling-update NAME -f FILE
```

{{% /capture %}}


{{% capture body %}}

## Passing a configuration file

To initiate a rolling update using a configuration file, pass the new file to
`kubectl rolling-update`:

```shell
kubectl rolling-update NAME -f FILE
```

The configuration file must:

* Specify a different `metadata.name` value.

* Overwrite at least one common label in its `spec.selector` field.

* Use the same `metadata.namespace`.

Replication controller configuration files are described in
[Creating Replication Controllers](/docs/tutorials/stateless-application/run-stateless-ap-replication-controller/).

### Examples

```shell
# Update pods of frontend-v1 using new replication controller data in frontend-v2.json.
kubectl rolling-update frontend-v1 -f frontend-v2.json

# Update pods of frontend-v1 using JSON data passed into stdin.
cat frontend-v2.json | kubectl rolling-update frontend-v1 -f -
```

## Updating the container image

To update only the container image, pass a new image name and tag with the
`--image` flag and (optionally) a new controller name:

```shell
kubectl rolling-update NAME NEW_NAME --image=IMAGE:TAG
```

The `--image` flag is only supported for single-container pods. Specifying
`--image` with multi-container pods returns an error.

If you didn't specify a new name, this creates a new replication controller
with a temporary name. Once the rollout is complete, the old controller is
deleted, and the new controller is updated to use the original name.

The update will fail if `IMAGE:TAG` is identical to the
current value. For this reason, we recommend the use of versioned tags as
opposed to values such as `:latest`. Doing a rolling update from `image:latest`
to a new `image:latest` will fail, even if the image at that tag has changed.
Moreover, the use of `:latest` is not recommended, see
[Best Practices for Configuration](/docs/concepts/configuration/overview/#container-images) for more information.

### Examples

```shell
# Update the pods of frontend-v1 to frontend-v2
kubectl rolling-update frontend-v1 frontend-v2 --image=image:v2

# Update the pods of frontend, keeping the replication controller name
kubectl rolling-update frontend --image=image:v2
```

## Required and optional fields

Required fields are:

* `NAME`: The name of the replication controller to update.

as well as either:

* `-f FILE`: A replication controller configuration file, in either JSON or
  YAML format. The configuration file must specify a new top-level `id` value
  and include at least one of the existing `spec.selector` key:value pairs.
  See the
  [Run Stateless AP Replication Controller](/docs/tutorials/stateless-application/run-stateless-ap-replication-controller/#replication-controller-configuration-file)
  page for details.
<br>
<br>
    or:
<br>
<br>
* `--image IMAGE:TAG`: The name and tag of the image to update to. Must be
  different than the current image:tag currently specified.

Optional fields are:

* `NEW_NAME`: Only used in conjunction with `--image` (not with `-f FILE`). The
  name to assign to the new replication controller.
* `--poll-interval DURATION`: The time between polling the controller status
  after update. Valid units are `ns` (nanoseconds), `us` or `µs` (microseconds),
  `ms` (milliseconds), `s` (seconds), `m` (minutes), or `h` (hours). Units can
  be combined (e.g. `1m30s`). The default is `3s`.
* `--timeout DURATION`: The maximum time to wait for the controller to update a
  pod before exiting. Default is `5m0s`. Valid units are as described for
  `--poll-interval` above.
* `--update-period DURATION`: The time to wait between updating pods. Default
  is `1m0s`. Valid units are as described for `--poll-interval` above.

Additional information about the `kubectl rolling-update` command is available
from the [`kubectl` reference](/docs/reference/generated/kubectl/kubectl-commands/#rolling-update).

## Walkthrough

Let's say you were running version 1.7.9 of nginx:

{{< codenew file="controllers/replication-nginx-1.7.9.yaml" >}}

To update to version 1.9.1, you can use [`kubectl rolling-update --image`](https://git.k8s.io/community/contributors/design-proposals/cli/simple-rolling-update.md) to specify the new image:

```shell
kubectl rolling-update my-nginx --image=nginx:1.9.1
```
```
Created my-nginx-ccba8fbd8cc8160970f63f9a2696fc46
```

In another window, you can see that `kubectl` added a `deployment` label to the pods, whose value is a hash of the configuration, to distinguish the new pods from the old:

```shell
kubectl get pods -l app=nginx -L deployment
```
```
NAME                                              READY     STATUS    RESTARTS   AGE       DEPLOYMENT
my-nginx-ccba8fbd8cc8160970f63f9a2696fc46-k156z   1/1       Running   0          1m        ccba8fbd8cc8160970f63f9a2696fc46
my-nginx-ccba8fbd8cc8160970f63f9a2696fc46-v95yh   1/1       Running   0          35s       ccba8fbd8cc8160970f63f9a2696fc46
my-nginx-divi2                                    1/1       Running   0          2h        2d1d7a8f682934a254002b56404b813e
my-nginx-o0ef1                                    1/1       Running   0          2h        2d1d7a8f682934a254002b56404b813e
my-nginx-q6all                                    1/1       Running   0          8m        2d1d7a8f682934a254002b56404b813e
```

`kubectl rolling-update` reports progress as it progresses:

```
Scaling up my-nginx-ccba8fbd8cc8160970f63f9a2696fc46 from 0 to 3, scaling down my-nginx from 3 to 0 (keep 3 pods available, don't exceed 4 pods)
Scaling my-nginx-ccba8fbd8cc8160970f63f9a2696fc46 up to 1
Scaling my-nginx down to 2
Scaling my-nginx-ccba8fbd8cc8160970f63f9a2696fc46 up to 2
Scaling my-nginx down to 1
Scaling my-nginx-ccba8fbd8cc8160970f63f9a2696fc46 up to 3
Scaling my-nginx down to 0
Update succeeded. Deleting old controller: my-nginx
Renaming my-nginx-ccba8fbd8cc8160970f63f9a2696fc46 to my-nginx
replicationcontroller "my-nginx" rolling updated
```

If you encounter a problem, you can stop the rolling update midway and revert to the previous version using `--rollback`:

```shell
kubectl rolling-update my-nginx --rollback
```
```
Setting "my-nginx" replicas to 1
Continuing update with existing controller my-nginx.
Scaling up nginx from 1 to 1, scaling down my-nginx-ccba8fbd8cc8160970f63f9a2696fc46 from 1 to 0 (keep 1 pods available, don't exceed 2 pods)
Scaling my-nginx-ccba8fbd8cc8160970f63f9a2696fc46 down to 0
Update succeeded. Deleting my-nginx-ccba8fbd8cc8160970f63f9a2696fc46
replicationcontroller "my-nginx" rolling updated
```

This is one example where the immutability of containers is a huge asset.

If you need to update more than just the image (e.g., command arguments, environment variables), you can create a new replication controller, with a new name and distinguishing label value, such as:

{{< codenew file="controllers/replication-nginx-1.9.2.yaml" >}}

and roll it out:

```shell
# Assuming you named the file "my-nginx.yaml"
kubectl rolling-update my-nginx -f ./my-nginx.yaml
```
```
Created my-nginx-v4
Scaling up my-nginx-v4 from 0 to 5, scaling down my-nginx from 4 to 0 (keep 4 pods available, don't exceed 5 pods)
Scaling my-nginx-v4 up to 1
Scaling my-nginx down to 3
Scaling my-nginx-v4 up to 2
Scaling my-nginx down to 2
Scaling my-nginx-v4 up to 3
Scaling my-nginx down to 1
Scaling my-nginx-v4 up to 4
Scaling my-nginx down to 0
Scaling my-nginx-v4 up to 5
Update succeeded. Deleting old controller: my-nginx
replicationcontroller "my-nginx-v4" rolling updated
```

## Troubleshooting

If the `timeout` duration is reached during a rolling update, the operation will
fail with some pods belonging to the new replication controller, and some to the
original controller.

To continue the update from where it failed, retry using the same command.

To roll back to the original state before the attempted update, append the
`--rollback=true` flag to the original command. This will revert all changes.

{{% /capture %}}
