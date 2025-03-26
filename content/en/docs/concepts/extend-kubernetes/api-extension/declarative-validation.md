---
title: Declarative Validation Concepts
reviewers:
- aaron-prindle
- yongruilin
- jpbetz
- thockin
content_type: concept
weight: 20
---

{{< feature-state for_k8s_version="v1.33" state="beta" >}}

Declarative Validation refers to an **internal implementation change** within the Kubernetes API server aimed at improving how API object validation rules are defined, maintained, and executed. Instead of relying solely on hand-written Go code (`validation.go` files), Kubernetes developers can define validation rules directly alongside the API type definitions (`types.go` files) using special comment tags (e.g., `+k8s:minimum=0`). A code generator (`validation-gen`) then uses these tags to produce optimized validation Go code.

While primarily a feature impacting Kubernetes contributors and potentially developers of [extension API servers](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/), cluster administrators should understand its behavior, especially during its rollout phases.

## Impact on Cluster Administrators (Post-Stability)

**The primary goal of Declarative Validation is functional equivalence with the previous hand-written validation.** When the feature is stable (GA):

*   **End-users and administrators should observe minimal direct changes.** API objects that were valid should remain valid, and invalid objects should remain invalid.
*   **Error messages** might have slightly different phrasing in some cases, but they should retain the same semantic meaning, field path, and reason code. The Kubernetes project aims to minimize disruption here.
*   **Performance** is expected to be equivalent to or better than hand-written validation. This is monitored via metrics like `apiserver_request_duration_seconds`.
*   **Indirect benefits** include more consistent validation logic across the entire Kubernetes API over time and potentially fewer validation-related bugs due to the more structured approach.

## Behavior During Migration and Upgrades (Beta Phase)

Declarative Validation is being rolled out gradually, starting in v1.33 with specific fields (e.g., within `ReplicationController`). Two feature gates control its behavior:

*   `DeclarativeValidation`: (Beta, Default: `true`) When enabled, the API server runs *both* the new declarative validation and the old hand-written validation for migrated types/fields. The results are compared internally.
*   `DeclarativeValidationTakeover`: (Beta, Default: `false`) This gate determines which validation result is *authoritative* (i.e., returned to the user and used for admission decisions).

**Default Behavior (v1.33+):**

*   With `DeclarativeValidation=true` and `DeclarativeValidationTakeover=false` (the default values for the gates), both validation systems run.
*   **The results of the *hand-written* validation are used.** The declarative validation runs in a mismatch mode for comparison.
*   Mismatches between the two validation systems are logged by the API server and increment the `declarative_validation_mismatch_total` metric. This helps developers identify and fix discrepancies during the Beta phase.
*   **Cluster upgrades should be safe** regarding this feature, as the authoritative validation logic doesn't change by default.

Administrators can choose to explicitly enable `DeclarativeValidationTakeover=true` to make the *declarative* validation authoritative for migrated fields, typically after verifying stability in their environment (e.g., by monitoring the mismatch metric).

## Disabling the Feature

Administrators might consider disabling Declarative Validation during the Beta phase under specific circumstances:

*   **Unexpected Validation Behavior:** If enabling `DeclarativeValidationTakeover` leads to unexpected validation errors or allows objects that were previously invalid.
*   **Performance Regressions:** If monitoring indicates significant latency increases (e.g., in `apiserver_request_duration_seconds`) correlated with the feature's enablement.
*   **High Mismatch Rate:** If the `declarative_validation_mismatch_total` metric shows frequent mismatches, suggesting potential bugs in the declarative rules affecting the cluster's workloads, even if `DeclarativeValidationTakeover` is false.

**How to Disable:**

*   To revert to only using hand-written validation (as before v1.33), disable the `DeclarativeValidation` feature gate, for example via command-line arguments: (`--feature-gates=DeclarativeValidation=false`). This also implicitly disables the effect of `DeclarativeValidationTakeover`.

**Rollback Considerations:**

Disabling the feature acts as a safety mechanism. However, be aware of a potential edge case (considered unlikely due to extensive testing): If a bug in declarative validation (when `DeclarativeValidationTakeover=true`) *incorrectly allowed* an invalid object to be persisted, disabling the feature gates might then cause subsequent updates to that specific object to be blocked by the now-authoritative (and correct) hand-written validation. Resolving this might require manual correction of the stored object, potentially via direct etcd modification in rare cases.

For details on managing feature gates, see [Feature Gates](/docs/reference/command-line-tools-reference/feature-gates/).