---
approvers:
- bgrant0607
- janetkuo
title: kubectl Usage Conventions
---

* TOC
{:toc}

## Using `kubectl` in Reusable Scripts

For a stable output in a script:

* Request one of the machine-oriented output forms, such as `-o name`, `-o json`, `-o yaml`, `-o go-template`, or `-o jsonpath`
* Specify `--output-version`, because the output forms use a particular API version to output the resource with the exception of `-o name` output form
* Specify `--generator` to pin to a specific behavior forever when you use generator-based commands such as `kubectl run` or `kubectl expose`
* Don't rely on context, preferences, or other implicit states.

## Best Practices

### `kubectl run`

For `kubectl run` to satisfy infrastructure as code:

* Tag the image with a version-specific tag and don't move that tag to a new version. For example, use `:v1234`, `v1.2.3`, `r03062016-1-4`, rather than `:latest` (For more information, see [Best Practices for Configuration](/docs/concepts/configuration/overview/#container-images)).
* Capture the parameters in a checked-in script, or at least use `--record` to annotate the created objects with the command line for an image that is lightly parameterized.
* Check in the script for an image that is heavily parameterized.
* Switch to configuration files checked into source control for features that are needed, but not expressible via `kubectl run` flags.
* Pin to a specific [generator](#generators) version, such as `kubectl run --generator=deployment/v1beta1`.

#### Generators

You can generate the following resources in `kubectl run`using `--generator` flag:

* Pod - use `run-pod/v1`.
* Replication controller - use `run/v1`.
* Deployment - use `extensions/v1beta1` and for an endpoint - use `deployment/v1beta1` (default).
* Deployment - use `apps/v1beta1` and for an endpoint - use `deployment/apps.v1beta1` (recommended).
* Job - use `job/v1`.
* CronJob - use `batch/v1beta1`and for an endpoint - use `cronjob/v1beta1`(default).
* CronJob - use`batch/v2alpha1` and for an endpoint - use `cronjob/v2alpha1` (deprecated).

If you do not specify a generator flag, other flags prompt you to use a specific generator. The following table lists the flags that force you to use specific generators, depending on the version of the cluster:

|   Generated Resource   | Cluster v1.4 and later | Cluster v1.3          | Cluster v1.2                               | Cluster v1.1 and earlier                   |
|:----------------------:|------------------------|-----------------------|--------------------------------------------|--------------------------------------------|
| Pod                    | `--restart=Never`      | `--restart=Never`     | `--generator=run-pod/v1`                   | `--restart=OnFailure` OR `--restart=Never` |
| Replication Controller | `--generator=run/v1`   | `--generator=run/v1`  | `--generator=run/v1`                       | `--restart=Always`                         |
| Deployment             | `--restart=Always`     | `--restart=Always`    | `--restart=Always`                         | N/A                                        |
| Job                    | `--restart=OnFailure`  | `--restart=OnFailure` | `--restart=OnFailure` OR `--restart=Never` | N/A                                        |
| Cron Job               | `--schedule=<cron>`    | N/A                   | N/A                                        | N/A                                        |

**Note:** These flags use a default generator only when you have not specified
any flag.  This means that when you combine `--generator` with other flags the generator that you specified later does not change. For example, in a cluster v1.4, if you initially specify
`--restart=Always`, a Deployment is created; if you later specify `--restart=Always`
and `--generator=run/v1`, a Replication Controller is created.
This enables you to pin to a specific behavior with the generator,
even when the default generator is changed later.

The flags set the generator in the following order: first the schedule flag then restart policy and finally the generator.

To check the final resource that was created, use `--dry-run`
flag, which provides the object to be submitted to the cluster.


### `kubectl apply`

* When you use `kubectl apply` to update resources, always create resources initially using `kubectl apply` or using `--save-config`. See [managing resources with kubectl apply](/docs/concepts/cluster-administration/manage-deployment/#kubectl-apply) for more information.
