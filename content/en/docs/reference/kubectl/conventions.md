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
* Check in the script for an image that is heavily parameterized.
* Switch to configuration files checked into source control for features that are needed, but not expressible via `kubectl run` flags.

You can use the `--dry-run` flag to preview the object that would be sent to your cluster, without really submitting it.

### `kubectl apply`

* You can use `kubectl apply` to create or update resources. For more information about using kubectl apply to update resources, see [Kubectl Book](https://kubectl.docs.kubernetes.io).

{{% /capture %}}
