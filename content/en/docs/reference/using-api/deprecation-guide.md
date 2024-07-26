---
reviewers:
- liggitt
- lavalamp
- thockin
- smarterclayton
title: "Deprecated API Migration Guide"
weight: 45
content_type: reference
---

<!-- overview -->

As the Kubernetes API evolves, APIs are periodically reorganized or upgraded.
When APIs evolve, the old API is deprecated and eventually removed.
This page contains information you need to know when migrating from
deprecated API versions to newer and more stable API versions.

<!-- body -->

## Removed APIs by release

### v1.32

The **v1.32** release will stop serving the following deprecated API versions:

#### Flow control resources {#flowcontrol-resources-v132}

The **flowcontrol.apiserver.k8s.io/v1beta3** API version of FlowSchema and PriorityLevelConfiguration will no longer be served in v1.32.

* Migrate manifests and API clients to use the **flowcontrol.apiserver.k8s.io/v1** API version, available since v1.29.
* All existing persisted objects are accessible via the new API
* Notable changes in **flowcontrol.apiserver.k8s.io/v1**:
  * The PriorityLevelConfiguration `spec.limited.nominalConcurrencyShares` field only defaults to 30 when unspecified, and an explicit value of 0 is not changed to 30.

### v1.29

The **v1.29** release stopped serving the following deprecated API versions:

#### Flow control resources {#flowcontrol-resources-v129}

The **flowcontrol.apiserver.k8s.io/v1beta2** API version of FlowSchema and PriorityLevelConfiguration is no longer served as of v1.29.

* Migrate manifests and API clients to use the **flowcontrol.apiserver.k8s.io/v1** API version, available since v1.29, or the **flowcontrol.apiserver.k8s.io/v1beta3** API version, available since v1.26.
* All existing persisted objects are accessible via the new API
* Notable changes in **flowcontrol.apiserver.k8s.io/v1**:
  * The PriorityLevelConfiguration `spec.limited.assuredConcurrencyShares` field is renamed to `spec.limited.nominalConcurrencyShares` and only defaults to 30 when unspecified, and an explicit value of 0 is not changed to 30.
* Notable changes in **flowcontrol.apiserver.k8s.io/v1beta3**:
  * The PriorityLevelConfiguration `spec.limited.assuredConcurrencyShares` field is renamed to `spec.limited.nominalConcurrencyShares`

### v1.27

The **v1.27** release stopped serving the following deprecated API versions:

#### CSIStorageCapacity {#csistoragecapacity-v127}

The **storage.k8s.io/v1beta1** API version of CSIStorageCapacity is no longer served as of v1.27.

* Migrate manifests and API clients to use the **storage.k8s.io/v1** API version, available since v1.24.
* All existing persisted objects are accessible via the new API
* No notable changes

### v1.26

The **v1.26** release stopped serving the following deprecated API versions:

#### Flow control resources {#flowcontrol-resources-v126}

The **flowcontrol.apiserver.k8s.io/v1beta1** API version of FlowSchema and PriorityLevelConfiguration is no longer served as of v1.26.

* Migrate manifests and API clients to use the **flowcontrol.apiserver.k8s.io/v1beta2** API version.
* All existing persisted objects are accessible via the new API
* No notable changes

#### HorizontalPodAutoscaler {#horizontalpodautoscaler-v126}

The **autoscaling/v2beta2** API version of HorizontalPodAutoscaler is no longer served as of v1.26.

* Migrate manifests and API clients to use the **autoscaling/v2** API version, available since v1.23.
* All existing persisted objects are accessible via the new API
* Notable changes:
  * `targetAverageUtilization` is replaced with `target.averageUtilization` and `target.type: Utilization`. See [Autoscaling on multiple metrics and custom metrics](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-multiple-metrics-and-custom-metrics).
### v1.25

The **v1.25** release stopped serving the following deprecated API versions:

#### CronJob {#cronjob-v125}

The **batch/v1beta1** API version of CronJob is no longer served as of v1.25.

* Migrate manifests and API clients to use the **batch/v1** API version, available since v1.21.
* All existing persisted objects are accessible via the new API
* No notable changes

#### EndpointSlice {#endpointslice-v125}

The **discovery.k8s.io/v1beta1** API version of EndpointSlice is no longer served as of v1.25.

* Migrate manifests and API clients to use the **discovery.k8s.io/v1** API version, available since v1.21.
* All existing persisted objects are accessible via the new API
* Notable changes in **discovery.k8s.io/v1**:
  * use per Endpoint `nodeName` field instead of deprecated `topology["kubernetes.io/hostname"]` field
  * use per Endpoint `zone` field instead of deprecated `topology["topology.kubernetes.io/zone"]` field
  * `topology` is replaced with the `deprecatedTopology` field which is not writable in v1

#### Event {#event-v125}

The **events.k8s.io/v1beta1** API version of Event is no longer served as of v1.25.

* Migrate manifests and API clients to use the **events.k8s.io/v1** API version, available since v1.19.
* All existing persisted objects are accessible via the new API
* Notable changes in **events.k8s.io/v1**:
  * `type` is limited to `Normal` and `Warning`
  * `involvedObject` is renamed to `regarding`
  * `action`, `reason`, `reportingController`, and `reportingInstance` are required
    when creating new **events.k8s.io/v1** Events
  * use `eventTime` instead of the deprecated `firstTimestamp` field (which is renamed
    to `deprecatedFirstTimestamp` and not permitted in new **events.k8s.io/v1** Events)
  * use `series.lastObservedTime` instead of the deprecated `lastTimestamp` field
    (which is renamed to `deprecatedLastTimestamp` and not permitted in new **events.k8s.io/v1** Events)
  * use `series.count` instead of the deprecated `count` field
    (which is renamed to `deprecatedCount` and not permitted in new **events.k8s.io/v1** Events)
  * use `reportingController` instead of the deprecated `source.component` field
    (which is renamed to `deprecatedSource.component` and not permitted in new **events.k8s.io/v1** Events)
  * use `reportingInstance` instead of the deprecated `source.host` field
    (which is renamed to `deprecatedSource.host` and not permitted in new **events.k8s.io/v1** Events)

#### HorizontalPodAutoscaler {#horizontalpodautoscaler-v125}

The **autoscaling/v2beta1** API version of HorizontalPodAutoscaler is no longer served as of v1.25.

* Migrate manifests and API clients to use the **autoscaling/v2** API version, available since v1.23.
* All existing persisted objects are accessible via the new API
* Notable changes:
  * `targetAverageUtilization` is replaced with `target.averageUtilization` and `target.type: Utilization`. See [Autoscaling on multiple metrics and custom metrics](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-multiple-metrics-and-custom-metrics).

#### PodDisruptionBudget {#poddisruptionbudget-v125}

The **policy/v1beta1** API version of PodDisruptionBudget is no longer served as of v1.25.

* Migrate manifests and API clients to use the **policy/v1** API version, available since v1.21.
* All existing persisted objects are accessible via the new API
* Notable changes in **policy/v1**:
  * an empty `spec.selector` (`{}`) written to a `policy/v1` PodDisruptionBudget selects all
    pods in the namespace (in `policy/v1beta1` an empty `spec.selector` selected no pods).
    An unset `spec.selector` selects no pods in either API version.

#### PodSecurityPolicy {#psp-v125}

PodSecurityPolicy in the **policy/v1beta1** API version is no longer served as of v1.25,
and the PodSecurityPolicy admission controller will be removed.

Migrate to [Pod Security Admission](/docs/concepts/security/pod-security-admission/)
or a [3rd party admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/).
For a migration guide, see [Migrate from PodSecurityPolicy to the Built-In PodSecurity Admission Controller](/docs/tasks/configure-pod-container/migrate-from-psp/).
For more information on the deprecation, see [PodSecurityPolicy Deprecation: Past, Present, and Future](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/).

#### RuntimeClass {#runtimeclass-v125}

RuntimeClass in the **node.k8s.io/v1beta1** API version is no longer served as of v1.25.

* Migrate manifests and API clients to use the **node.k8s.io/v1** API version, available since v1.20.
* All existing persisted objects are accessible via the new API
* No notable changes

### v1.22

The **v1.22** release stopped serving the following deprecated API versions:

#### Webhook resources {#webhook-resources-v122}

The **admissionregistration.k8s.io/v1beta1** API version of MutatingWebhookConfiguration
and ValidatingWebhookConfiguration is no longer served as of v1.22.

* Migrate manifests and API clients to use the **admissionregistration.k8s.io/v1** API version, available since v1.16.
* All existing persisted objects are accessible via the new APIs
* Notable changes:
  * `webhooks[*].failurePolicy` default changed from `Ignore` to `Fail` for v1
  * `webhooks[*].matchPolicy` default changed from `Exact` to `Equivalent` for v1
  * `webhooks[*].timeoutSeconds` default changed from `30s` to `10s` for v1
  * `webhooks[*].sideEffects` default value is removed, and the field made required,
    and only `None` and `NoneOnDryRun` are permitted for v1
  * `webhooks[*].admissionReviewVersions` default value is removed and the field made
    required for v1 (supported versions for AdmissionReview are `v1` and `v1beta1`)
  * `webhooks[*].name` must be unique in the list for objects created via `admissionregistration.k8s.io/v1`

#### CustomResourceDefinition {#customresourcedefinition-v122}

The **apiextensions.k8s.io/v1beta1** API version of CustomResourceDefinition is no longer served as of v1.22.

* Migrate manifests and API clients to use the **apiextensions.k8s.io/v1** API version, available since v1.16.
* All existing persisted objects are accessible via the new API
* Notable changes:
  * `spec.scope` is no longer defaulted to `Namespaced` and must be explicitly specified
  * `spec.version` is removed in v1; use `spec.versions` instead
  * `spec.validation` is removed in v1; use `spec.versions[*].schema` instead
  * `spec.subresources` is removed in v1; use `spec.versions[*].subresources` instead
  * `spec.additionalPrinterColumns` is removed in v1; use `spec.versions[*].additionalPrinterColumns` instead
  * `spec.conversion.webhookClientConfig` is moved to `spec.conversion.webhook.clientConfig` in v1
  * `spec.conversion.conversionReviewVersions` is moved to `spec.conversion.webhook.conversionReviewVersions` in v1
  * `spec.versions[*].schema.openAPIV3Schema` is now required when creating v1 CustomResourceDefinition objects,
    and must be a [structural schema](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#specifying-a-structural-schema)
  * `spec.preserveUnknownFields: true` is disallowed when creating v1 CustomResourceDefinition objects;
    it must be specified within schema definitions as `x-kubernetes-preserve-unknown-fields: true`
  * In `additionalPrinterColumns` items, the `JSONPath` field was renamed to `jsonPath` in v1
    (fixes [#66531](https://github.com/kubernetes/kubernetes/issues/66531))

#### APIService {#apiservice-v122}

The **apiregistration.k8s.io/v1beta1** API version of APIService is no longer served as of v1.22.

* Migrate manifests and API clients to use the **apiregistration.k8s.io/v1** API version, available since v1.10.
* All existing persisted objects are accessible via the new API
* No notable changes

#### TokenReview {#tokenreview-v122}

The **authentication.k8s.io/v1beta1** API version of TokenReview is no longer served as of v1.22.

* Migrate manifests and API clients to use the **authentication.k8s.io/v1** API version, available since v1.6.
* No notable changes

#### SubjectAccessReview resources {#subjectaccessreview-resources-v122}

The **authorization.k8s.io/v1beta1** API version of LocalSubjectAccessReview,
SelfSubjectAccessReview, SubjectAccessReview, and SelfSubjectRulesReview is no longer served as of v1.22.

* Migrate manifests and API clients to use the **authorization.k8s.io/v1** API version, available since v1.6.
* Notable changes:
  * `spec.group` was renamed to `spec.groups` in v1 (fixes [#32709](https://github.com/kubernetes/kubernetes/issues/32709))

#### CertificateSigningRequest {#certificatesigningrequest-v122}

The **certificates.k8s.io/v1beta1** API version of CertificateSigningRequest is no longer served as of v1.22.

* Migrate manifests and API clients to use the **certificates.k8s.io/v1** API version, available since v1.19.
* All existing persisted objects are accessible via the new API
* Notable changes in `certificates.k8s.io/v1`:
  * For API clients requesting certificates:
    * `spec.signerName` is now required
      (see [known Kubernetes signers](/docs/reference/access-authn-authz/certificate-signing-requests/#kubernetes-signers)),
      and requests for `kubernetes.io/legacy-unknown` are not allowed to be created via the `certificates.k8s.io/v1` API
    * `spec.usages` is now required, may not contain duplicate values, and must only contain known usages
  * For API clients approving or signing certificates:
    * `status.conditions` may not contain duplicate types
    * `status.conditions[*].status` is now required
    * `status.certificate` must be PEM-encoded, and contain only `CERTIFICATE` blocks

#### Lease {#lease-v122}

The **coordination.k8s.io/v1beta1** API version of Lease is no longer served as of v1.22.

* Migrate manifests and API clients to use the **coordination.k8s.io/v1** API version, available since v1.14.
* All existing persisted objects are accessible via the new API
* No notable changes

#### Ingress {#ingress-v122}

The **extensions/v1beta1** and **networking.k8s.io/v1beta1** API versions of Ingress is no longer served as of v1.22.

* Migrate manifests and API clients to use the **networking.k8s.io/v1** API version, available since v1.19.
* All existing persisted objects are accessible via the new API
* Notable changes:
  * `spec.backend` is renamed to `spec.defaultBackend`
  * The backend `serviceName` field is renamed to `service.name`
  * Numeric backend `servicePort` fields are renamed to `service.port.number`
  * String backend `servicePort` fields are renamed to `service.port.name`
  * `pathType` is now required for each specified path. Options are `Prefix`,
    `Exact`, and `ImplementationSpecific`. To match the undefined `v1beta1` behavior, use `ImplementationSpecific`.

#### IngressClass {#ingressclass-v122}

The **networking.k8s.io/v1beta1** API version of IngressClass is no longer served as of v1.22.

* Migrate manifests and API clients to use the **networking.k8s.io/v1** API version, available since v1.19.
* All existing persisted objects are accessible via the new API
* No notable changes

#### RBAC resources {#rbac-resources-v122}

The **rbac.authorization.k8s.io/v1beta1** API version of ClusterRole, ClusterRoleBinding,
Role, and RoleBinding is no longer served as of v1.22.

* Migrate manifests and API clients to use the **rbac.authorization.k8s.io/v1** API version, available since v1.8.
* All existing persisted objects are accessible via the new APIs
* No notable changes

#### PriorityClass {#priorityclass-v122}

The **scheduling.k8s.io/v1beta1** API version of PriorityClass is no longer served as of v1.22.

* Migrate manifests and API clients to use the **scheduling.k8s.io/v1** API version, available since v1.14.
* All existing persisted objects are accessible via the new API
* No notable changes

#### Storage resources {#storage-resources-v122}

The **storage.k8s.io/v1beta1** API version of CSIDriver, CSINode, StorageClass, and VolumeAttachment is no longer served as of v1.22.

* Migrate manifests and API clients to use the **storage.k8s.io/v1** API version
  * CSIDriver is available in **storage.k8s.io/v1** since v1.19.
  * CSINode is available in **storage.k8s.io/v1** since v1.17
  * StorageClass is available in **storage.k8s.io/v1** since v1.6
  * VolumeAttachment is available in **storage.k8s.io/v1** v1.13
* All existing persisted objects are accessible via the new APIs
* No notable changes

### v1.16

The **v1.16** release stopped serving the following deprecated API versions:

#### NetworkPolicy {#networkpolicy-v116}

The **extensions/v1beta1** API version of NetworkPolicy is no longer served as of v1.16.

* Migrate manifests and API clients to use the **networking.k8s.io/v1** API version, available since v1.8.
* All existing persisted objects are accessible via the new API

#### DaemonSet {#daemonset-v116}

The **extensions/v1beta1** and **apps/v1beta2** API versions of DaemonSet are no longer served as of v1.16.

* Migrate manifests and API clients to use the **apps/v1** API version, available since v1.9.
* All existing persisted objects are accessible via the new API
* Notable changes:
  * `spec.templateGeneration` is removed
  * `spec.selector` is now required and immutable after creation; use the existing
    template labels as the selector for seamless upgrades
  * `spec.updateStrategy.type` now defaults to `RollingUpdate`
    (the default in `extensions/v1beta1` was `OnDelete`)

#### Deployment {#deployment-v116}

The **extensions/v1beta1**, **apps/v1beta1**, and **apps/v1beta2** API versions of Deployment are no longer served as of v1.16.

* Migrate manifests and API clients to use the **apps/v1** API version, available since v1.9.
* All existing persisted objects are accessible via the new API
* Notable changes:
  * `spec.rollbackTo` is removed
  * `spec.selector` is now required and immutable after creation; use the existing
    template labels as the selector for seamless upgrades
  * `spec.progressDeadlineSeconds` now defaults to `600` seconds
    (the default in `extensions/v1beta1` was no deadline)
  * `spec.revisionHistoryLimit` now defaults to `10`
    (the default in `apps/v1beta1` was `2`, the default in `extensions/v1beta1` was to retain all)
  * `maxSurge` and `maxUnavailable` now default to `25%`
    (the default in `extensions/v1beta1` was `1`)

#### StatefulSet {#statefulset-v116}

The **apps/v1beta1** and **apps/v1beta2** API versions of StatefulSet are no longer served as of v1.16.

* Migrate manifests and API clients to use the **apps/v1** API version, available since v1.9.
* All existing persisted objects are accessible via the new API
* Notable changes:
  * `spec.selector` is now required and immutable after creation;
    use the existing template labels as the selector for seamless upgrades
  * `spec.updateStrategy.type` now defaults to `RollingUpdate`
    (the default in `apps/v1beta1` was `OnDelete`)

#### ReplicaSet {#replicaset-v116}

The **extensions/v1beta1**, **apps/v1beta1**, and **apps/v1beta2** API versions of ReplicaSet are no longer served as of v1.16.

* Migrate manifests and API clients to use the **apps/v1** API version, available since v1.9.
* All existing persisted objects are accessible via the new API
* Notable changes:
  * `spec.selector` is now required and immutable after creation; use the existing template labels as the selector for seamless upgrades

#### PodSecurityPolicy {#psp-v116}

The **extensions/v1beta1** API version of PodSecurityPolicy is no longer served as of v1.16.

* Migrate manifests and API client to use the **policy/v1beta1** API version, available since v1.10.
* Note that the **policy/v1beta1** API version of PodSecurityPolicy will be removed in v1.25.

## What to do

### Test with deprecated APIs disabled

You can test your clusters by starting an API server with specific API versions disabled
to simulate upcoming removals. Add the following flag to the API server startup arguments:

`--runtime-config=<group>/<version>=false`

For example:

`--runtime-config=admissionregistration.k8s.io/v1beta1=false,apiextensions.k8s.io/v1beta1,...`

### Locate use of deprecated APIs

Use [client warnings, metrics, and audit information available in 1.19+](/blog/2020/09/03/warnings/#deprecation-warnings)
to locate use of deprecated APIs.

### Migrate to non-deprecated APIs

* Update custom integrations and controllers to call the non-deprecated APIs
* Change YAML files to reference the non-deprecated APIs

  You can use the `kubectl convert` command to automatically convert an existing object:

  `kubectl convert -f <file> --output-version <group>/<version>`.

  For example, to convert an older Deployment to `apps/v1`, you can run:

  `kubectl convert -f ./my-deployment.yaml --output-version apps/v1`

  This conversion may use non-ideal default values. To learn more about a specific
  resource, check the Kubernetes [API reference](/docs/reference/kubernetes-api/).
  
  {{< note >}}
  The `kubectl convert` tool is not installed by default, although
  in fact it once was part of `kubectl` itself. For more details, you can read the
  [deprecation and removal issue](https://github.com/kubernetes/kubectl/issues/725)
  for the built-in subcommand.
  
  To learn how to set up `kubectl convert` on your computer, visit the page that is right for your 
  operating system:
  [Linux](/docs/tasks/tools/install-kubectl-linux/#install-kubectl-convert-plugin),
  [macOS](/docs/tasks/tools/install-kubectl-macos/#install-kubectl-convert-plugin), or
  [Windows](/docs/tasks/tools/install-kubectl-windows/#install-kubectl-convert-plugin).
  {{< /note >}}
