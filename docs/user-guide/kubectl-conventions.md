---
approvers:
- bgrant0607
- janetkuo
title: kubectl Usage Conventions
---

* TOC
{:toc}

## Using `kubectl` in Reusable Scripts

If you need stable output in a script, you should:

* Request one of the machine-oriented output forms, such as `-o name`, `-o json`, `-o yaml`, `-o go-template`, or `-o jsonpath`
* Specify `--output-version`, since those output forms (other than `-o name`) output the resource using a particular API version
* Specify `--generator` to pin to a specific behavior forever, if using generator-based commands (such as `kubectl run` or `kubectl expose`)
* Don't rely on context, preferences, or other implicit state

## Best Practices

### `kubectl run`

In order for `kubectl run` to satisfy infrastructure as code:

* Always tag your image with a version-specific tag and don't move that tag to a new version. For example, use `:v1234`, `v1.2.3`, `r03062016-1-4`, rather than `:latest` (see [Best Practices for Configuration](/docs/concepts/configuration/overview/#container-images) for more information).
* If the image is lightly parameterized, capture the parameters in a checked-in script, or at least use `--record`to annotate the created objects with the command line.
* If the image is heavily parameterized, definitely check in the script.
* If features are needed that are not expressible via `kubectl run` flags, switch to configuration files checked into source control.
* Pin to a specific [generator](#generators) version, such as `kubectl run --generator=deployment/v1beta1`.

#### Generators

`kubectl run` allows you to generate the following resources (using `--generator` flag):

* Pod - use `run-pod/v1`.
* Replication controller - use `run/v1`.
* Deployment, using `extensions/v1beta1` endpoint - use `deployment/v1beta1` (default).
* Deployment, using `apps/v1beta1` endpoint - use `deployment/apps.v1beta1` (recommended).
* Job - use `job/v1`.
* CronJob - using `batch/v1beta1` endpoint - use `cronjob/v1beta1`(default).
* CronJob - using `batch/v2alpha1` endpoint - use `cronjob/v2alpha1` (deprecated).

Additionally, if you didn't specify a generator flag, other flags will suggest using
a specific generator.  Below table shows which flags force using specific generators,
depending on your cluster version:

|   Generated Resource   | Cluster v1.4 and later | Cluster v1.3          | Cluster v1.2                               | Cluster v1.1 and earlier                   |
|:----------------------:|------------------------|-----------------------|--------------------------------------------|--------------------------------------------|
| Pod                    | `--restart=Never`      | `--restart=Never`     | `--generator=run-pod/v1`                   | `--restart=OnFailure` OR `--restart=Never` |
| Replication Controller | `--generator=run/v1`   | `--generator=run/v1`  | `--generator=run/v1`                       | `--restart=Always`                         |
| Deployment             | `--restart=Always`     | `--restart=Always`    | `--restart=Always`                         | N/A                                        |
| Job                    | `--restart=OnFailure`  | `--restart=OnFailure` | `--restart=OnFailure` OR `--restart=Never` | N/A                                        |
| Cron Job               | `--schedule=<cron>`    | N/A                   | N/A                                        | N/A                                        |

Note that these flags will use a default generator only when you have not specified
any flag.  This also means that combining `--generator` with other flags won't
change the generator you specified. For example, in a 1.4 cluster, if you specify
`--restart=Always`, a Deployment will be created; if you specify `--restart=Always`
and `--generator=run/v1`, a Replication Controller will be created instead.
This becomes handy if you want to pin to a specific behavior with the generator,
even when the defaulted generator is changed in the future.

Finally, the order in which flags set the generator is: schedule flag has the highest
priority, then restart policy and finally the generator itself.

If in doubt about the final resource being created, you can always use `--dry-run`
flag, which will provide the object to be submitted to the cluster.


### `kubectl apply`

* To use `kubectl apply` to update resources, always create resources initially with `kubectl apply` or with `--save-config`. See [managing resources with kubectl apply](/docs/concepts/cluster-administration/manage-deployment/#kubectl-apply) for the reason behind it.
