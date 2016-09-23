---
assignees:
- bgrant0607
- janetkuo

---

* TOC
{:toc}

## Using `kubectl` in Reusable Scripts

If you need stable output in a script, you should:

* Request one of the machine-oriented output forms, such as `-o name`, `-o json`, `-o yaml`, `-o go-template`, or `-o jsonpath`
* Specify `--output-version`, since those output forms (other than `-o name`) output the resource using a particular API version
* Specify `--generator` to pin to a specific behavior forever, if using generator-based commands (such as `kubectl run` or `kubectl expose`)
* Don't rely on context, preferences, or other implicit state

## Generators

`kubectl run` provides following generators:

* `run/v1` - creates a replication controller.
* `run-pod/v1` - creates a pod.
* `deployment/v1beta1` - creates a deployment.
* `job/v1beta1` - creates a job (using `extensions/v1beta1' endpoint).
* `job/v1` - creates a job.
* `scheduledjob/v2alpha1` - creates a scheduled job.

Following rules are implemented if no generator is specified for cluster version at least 1.3:

* For `--restart=Always' a deployment generator (`deployment/v1beta1`) is chosen.
* For `--restart=OnFailure` a job generator (`job/v1`) is chosen.
* For `--restart=Never` a pod generator (`run-pod/v1`) is chosen.

Additionally, for cluster version at least 1.4 if `--schedule` flag is set a scheduled job
generator ('scheduledjob/v2alpha1') is chosen.

For cluster version 1.2:

* For `--restart=Always` a deployment generator ('deployment/v1beta1') is chosen.
* For other restart policy a job generator ('job/v1') is chosen.

For cluster version 1.1 and older:

* For `--restart=Always` a replication controller ('run/v1') is chosen
* For other restart policy a pod generator ('run-pod/v1') is chosen.

## Best Practices

### `kubectl run`

In order for `kubectl run` to satisfy infrastructure as code:

* Always tag your image with a version-specific tag and don't move that tag to a new version. For example, use `:v1234`, `v1.2.3`, `r03062016-1-4`, rather than `:latest` (see [Best Practices for Configuration](/docs/user-guide/config-best-practices/#container-images) for more information.)
* If the image is lightly parameterized, capture the parameters in a checked-in script, or at least use `--record`, to annotate the created objects with the command line.
* If the image is heavily parameterized, definitely check in the script.
* If features are needed that are not expressible via `kubectl run` flags, switch to configuration files checked into source control.
* Pin to a specific generator version, such as `kubectl run --generator=deployment/v1beta1`

### `kubectl apply`

* To use `kubectl apply` to update resources, always create resources initially with `kubectl apply` or with `--save-config`. See [managing resources with kubectl apply](/docs/user-guide/managing-deployments/#kubectl-apply) for the reason behind it.
