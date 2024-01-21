---
title: kubectl Usage Conventions
reviewers:
- janetkuo
content_type: concept
weight: 60
---

<!-- overview -->
Recommended usage conventions for `kubectl`.


<!-- body -->

## Using `kubectl` in Reusable Scripts

For a stable output in a script:

* Request one of the machine-oriented output forms, such as `-o name`, `-o json`, `-o yaml`, `-o go-template`, or `-o jsonpath`.
* Fully-qualify the version. For example, `jobs.v1.batch/myjob`. This will ensure that kubectl does not use its default version that can change over time.
* Don't rely on context, preferences, or other implicit states.

## Subresources

* You can use the `--subresource` beta flag for kubectl commands like `get`, `patch`,
`edit` and `replace` to fetch and update subresources for all resources that
support them. Currently, only the `status` and `scale` subresources are supported.
  * For `kubectl edit`, the `scale` subresource is not supported. If you use  `--subresource` with
    `kubectl edit` and specify `scale` as the subresource, the command will error out.
* The API contract against a subresource is identical to a full resource. While updating the
`status` subresource to a new value, keep in mind that the subresource could be potentially
reconciled by a controller to a different value.


## Best Practices

### `kubectl run`

For `kubectl run` to satisfy infrastructure as code:

* Tag the image with a version-specific tag and don't move that tag to a new version. For example, use `:v1234`, `v1.2.3`, `r03062016-1-4`, rather than `:latest` (For more information, see [Best Practices for Configuration](/docs/concepts/configuration/overview/#container-images)).
* Check in the script for an image that is heavily parameterized.
* Switch to configuration files checked into source control for features that are needed, but not expressible via `kubectl run` flags.

You can use the `--dry-run=client` flag to preview the object that would be sent to your cluster, without really submitting it.

### `kubectl apply`

* You can use `kubectl apply` to create or update resources. For more information about using kubectl apply to update resources, see [Kubectl Book](https://kubectl.docs.kubernetes.io).


