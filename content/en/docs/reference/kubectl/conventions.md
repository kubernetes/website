---
title: kubectl Usage Conventions
reviewers:
- janetkuo
content_template: templates/concept
---

{{% capture overview %}}
Recommended usage conventions for `kubectl`.
{{% /capture %}}

{{% capture body %}}

## Using `kubectl` in Reusable Scripts

For a stable output in a script:

* Request one of the machine-oriented output forms, such as `-o name`, `-o json`, `-o yaml`, `-o go-template`, or `-o jsonpath`.
* Fully-qualify the version. For example, `jobs.v1.batch/myjob`. This will ensure that kubectl does not use its default version that can change over time.
* Specify the `--generator` flag to pin to a specific behavior when you use generator-based commands such as `kubectl run` or `kubectl expose`.
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

You can create the following resources using `kubectl run` with the `--generator` flag:

| Resource                            | api group          | kubectl command                                   |
|-------------------------------------|--------------------|---------------------------------------------------|
| Pod                                 | v1                 | `kubectl run --generator=run-pod/v1`              |
| Replication controller (deprecated) | v1                 | `kubectl run --generator=run/v1`                  |
| Deployment (deprecated)             | extensions/v1beta1 | `kubectl run --generator=deployment/v1beta1`      |
| Deployment (deprecated)             | apps/v1beta1       | `kubectl run --generator=deployment/apps.v1beta1` |
| Job (deprecated)                    | batch/v1           | `kubectl run --generator=job/v1`                  |
| CronJob (deprecated)                | batch/v1beta1      | `kubectl run --generator=cronjob/v1beta1`         |
| CronJob (deprecated)                | batch/v2alpha1     | `kubectl run --generator=cronjob/v2alpha1`        |

{{< note >}}
`kubectl run --generator` except for `run-pod/v1` is deprecated in v1.12.
{{< /note >}}

If you do not specify a generator flag, other flags prompt you to use a specific generator. The following table lists the flags that force you to use specific generators, depending on the version of the cluster:

|   Generated Resource   | Cluster v1.4 and later | Cluster v1.3          | Cluster v1.2                               | Cluster v1.1 and earlier                   |
|:----------------------:|------------------------|-----------------------|--------------------------------------------|--------------------------------------------|
| Pod                    | `--restart=Never`      | `--restart=Never`     | `--generator=run-pod/v1`                   | `--restart=OnFailure` OR `--restart=Never` |
| Replication Controller | `--generator=run/v1`   | `--generator=run/v1`  | `--generator=run/v1`                       | `--restart=Always`                         |
| Deployment             | `--restart=Always`     | `--restart=Always`    | `--restart=Always`                         | N/A                                        |
| Job                    | `--restart=OnFailure`  | `--restart=OnFailure` | `--restart=OnFailure` OR `--restart=Never` | N/A                                        |
| Cron Job               | `--schedule=<cron>`    | N/A                   | N/A                                        | N/A                                        |

{{< note >}}
These flags use a default generator only when you have not specified any flag.
This means that when you combine `--generator` with other flags the generator that you specified later does not change. For example, in a cluster v1.4, if you initially specify
`--restart=Always`, a Deployment is created; if you later specify `--restart=Always`
and `--generator=run/v1`, a Replication Controller is created.
This enables you to pin to a specific behavior with the generator,
even when the default generator is changed later.
{{< /note >}}

The flags set the generator in the following order: first the `--schedule` flag, then the `--restart` policy flag, and finally the `--generator` flag.

To check the final resource that was created, use the `--dry-run`
flag, which provides the object to be submitted to the cluster.

### `kubectl apply`

* You can use `kubectl apply` to create or update resources. For more information about using kubectl apply to update resources, see [Kubectl Book](https://kubectl.docs.kubernetes.io).

{{% /capture %}}
