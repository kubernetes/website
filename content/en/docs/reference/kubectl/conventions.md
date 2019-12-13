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
* Pin to a specific [generator](#generators) version, such as `kubectl run --generator=run-pod/v1`.
* Check in the script for an image that is heavily parameterized.
* Switch to configuration files checked into source control for features that are needed, but not expressible via `kubectl run` flags.

#### Generators

You can create the following resources using `kubectl run` with the `--generator` flag:

{{< table caption="Resources you can create using kubectl run" >}}
| Resource                             | API group          | kubectl command                                   |
|--------------------------------------|--------------------|---------------------------------------------------|
| Pod                                  | v1                 | `kubectl run --generator=run-pod/v1`              |
| ReplicationController _(deprecated)_ | v1                 | `kubectl run --generator=run/v1`                  |
| Deployment _(deprecated)_            | extensions/v1beta1 | `kubectl run --generator=deployment/v1beta1`      |
| Deployment _(deprecated)_            | apps/v1beta1       | `kubectl run --generator=deployment/apps.v1beta1` |
| Job _(deprecated)_                   | batch/v1           | `kubectl run --generator=job/v1`                  |
| CronJob _(deprecated)_               | batch/v2alpha1     | `kubectl run --generator=cronjob/v2alpha1`        |
| CronJob _(deprecated)_               | batch/v1beta1      | `kubectl run --generator=cronjob/v1beta1`         |
{{< /table >}}

{{< note >}}
Generators other than `run-pod/v1` are deprecated.
{{< /note >}}

If you explicitly set `--generator`, kubectl uses the generator you specified. If you invoke `kubectl run` and don't specify a generator, kubectl automatically selects which generator to use based on the other flags you set. The following table lists flags and the generators that are activated if you didn't specify one yourself:

{{< table caption="kubectl run flags and the resource they imply" >}}
| Flag                    | Generated Resource    |
|-------------------------|-----------------------|
| `--schedule=<schedule>` | CronJob               |
| `--restart=Always`      | Deployment            |
| `--restart=OnFailure`   | Job                   |
| `--restart=Never`       | Pod                   |
{{< /table >}}

If you don't specify a generator, kubectl pays attention to other flags in the following order:

1. `--schedule`
1. `--restart`

You can use the `--dry-run` flag to preview the object that would be sent to your cluster, without really submitting it.

### `kubectl apply`

* You can use `kubectl apply` to create or update resources. For more information about using kubectl apply to update resources, see [Kubectl Book](https://kubectl.docs.kubernetes.io).

{{% /capture %}}
