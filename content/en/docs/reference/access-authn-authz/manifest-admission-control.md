---
reviewers:
- liggitt
- jpbetz
title: Manifest-Based Admission Control
content_type: concept
---

<!-- overview -->

{{< feature-state feature_gate_name="ManifestBasedAdmissionControlConfig" >}}

This page provides an overview of manifest-based admission control configuration.
Manifest-based admission control lets you load
[admission webhooks](/docs/reference/access-authn-authz/extensible-admission-controllers/)
and CEL-based admission policies from static files on disk, rather than from the
Kubernetes API. These policies are active from API server startup, operate
independently of {{< glossary_tooltip text="etcd" term_id="etcd" >}}, and can
protect API-based admission resources from modification.

To use the feature, enable the `ManifestBasedAdmissionControlConfig`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/#ManifestBasedAdmissionControlConfig) and
configure the `staticManifestsDir` field in the
[AdmissionConfiguration](/docs/reference/config-api/apiserver-config.v1/#apiserver-k8s-io-v1-AdmissionConfiguration)
file passed to the kube-apiserver via `--admission-control-config-file`.

<!-- body -->

## Why use manifest-based admission control?

Admission policies and webhooks registered through the Kubernetes API (such as
ValidatingAdmissionPolicy, MutatingAdmissionPolicy,
ValidatingWebhookConfiguration, and MutatingWebhookConfiguration) have several
inherent limitations:

- **Bootstrap gap**: REST-based policy enforcement requires the API objects to be
  created and loaded by the dynamic admission controller. Until that happens,
  policies are not enforced.
- **Self-protection gap**: Admission configuration resources (such as
  ValidatingWebhookConfiguration) are not themselves subject to webhook
  admission, to prevent circular dependencies. A user with sufficient privileges
  can delete or modify critical admission policies.
- **etcd dependency**: REST-based admission configurations depend on etcd
  availability. If etcd is unavailable or corrupted, admission policies may not
  load correctly.

Manifest-based admission control addresses these limitations by loading
configurations from files on disk. These configurations are:

- Active as soon as the API server is ready to serve requests
- Not visible or changeable through the Kubernetes API
- Independent of etcd availability
- Able to intercept operations on API-based admission resources themselves

## Supported resource types

You can include the following resource types in manifest files. Only the
`admissionregistration.k8s.io/v1` API version is supported.

{{< table caption="Supported resource types for manifest-based admission control" >}}
| Plugin name | Supported resource types |
|:------------|:------------------------|
| `ValidatingAdmissionWebhook` | ValidatingWebhookConfiguration |
| `MutatingAdmissionWebhook` | MutatingWebhookConfiguration |
| `ValidatingAdmissionPolicy` | ValidatingAdmissionPolicy, ValidatingAdmissionPolicyBinding |
| `MutatingAdmissionPolicy` | MutatingAdmissionPolicy, MutatingAdmissionPolicyBinding |
{{< /table >}}

You can also use `v1.List` to wrap multiple resources of the same plugin type
in a single document.

Each admission plugin's `staticManifestsDir` must only contain resource types
allowed for that plugin. For example, a directory configured for the
`ValidatingAdmissionPolicy` plugin can only contain ValidatingAdmissionPolicy
and ValidatingAdmissionPolicyBinding resources.

## Configuring manifest-based admission control {#configuration}

To enable manifest-based admission control, you need:

1. The `ManifestBasedAdmissionControlConfig` feature gate enabled on the
   kube-apiserver.
1. An `AdmissionConfiguration` file with `staticManifestsDir` fields pointing
   to directories containing your manifest files.
1. The manifest files themselves on disk, accessible to the kube-apiserver
   process.

### AdmissionConfiguration

Add `staticManifestsDir` to the plugin configuration for each admission plugin
that should load manifests from disk. Each plugin requires its own directory.

{{% code_sample language="yaml" file="access/manifest-admission-control/admission-configuration.yaml" %}}

The `staticManifestsDir` field accepts an absolute path to a directory. All
direct-children files with `.yaml`, `.yml`, or `.json` extensions in the
directory are loaded. Subdirectories and files with other extensions are ignored.
Glob patterns and relative paths are not supported.

Pass this file to the kube-apiserver with the `--admission-control-config-file`
flag.

### Configuration types

Each admission plugin uses a specific configuration kind:

{{< table caption="Configuration types for each admission plugin" >}}
| Plugin | apiVersion | kind |
|:-------|:-----------|:-----|
| `ValidatingAdmissionWebhook` | `apiserver.config.k8s.io/v1` | `WebhookAdmissionConfiguration` |
| `MutatingAdmissionWebhook` | `apiserver.config.k8s.io/v1` | `WebhookAdmissionConfiguration` |
| `ValidatingAdmissionPolicy` | `apiserver.config.k8s.io/v1` | `ValidatingAdmissionPolicyConfiguration` |
| `MutatingAdmissionPolicy` | `apiserver.config.k8s.io/v1` | `MutatingAdmissionPolicyConfiguration` |
{{< /table >}}

## Writing manifest files {#manifest-files}

Manifest files contain standard Kubernetes resource definitions. You can include
multiple resources in a single file using YAML document separators (`---`).

### Naming convention {#naming}

All objects in manifest files must have names ending with the `.static.k8s.io`
suffix. For example: `deny-privileged.static.k8s.io`.

When the `ManifestBasedAdmissionControlConfig` feature gate is enabled, creation
of API-based admission objects with names ending in `.static.k8s.io` is blocked.
When the feature gate is disabled, a warning is returned instead.

{{< note >}}
If two manifest files define objects of the same type with the same name, the
API server fails to start, displaying a descriptive error.
{{< /note >}}

### Restrictions

Manifest-based admission configurations exist in isolation and cannot
reference API resources. The following restrictions apply:

- **Webhooks**: Must use `clientConfig.url`. The `clientConfig.service` field is
  not allowed because the service network may not be available at API server
  startup.
- **Policies**: The `spec.paramKind` field is not allowed. Policies cannot
  reference ConfigMaps or other cluster objects for parameters.
- **Bindings**: The `spec.paramRef` field is not allowed. The `spec.policyName`
  must reference a policy defined in the same manifest file set and must end
  with `.static.k8s.io`.

Manifest files are decoded using the strict decoder, which rejects files
containing duplicate fields or unknown fields. Each object undergoes the same
defaulting and validation that the REST API applies.

## Examples {#examples}

### Protecting API-based admission resources {#protecting-admission-resources}

A key capability of manifest-based admission control is the ability to intercept
operations on admission configuration resources themselves
(ValidatingAdmissionPolicy, MutatingAdmissionPolicy,
ValidatingWebhookConfiguration, MutatingWebhookConfiguration, and their
bindings). REST-based admission webhooks and policies are not invoked on these
resource types to prevent circular dependencies, but manifest-based policies
can enforce rules on them because they do not have that circular dependency.

The following example prevents deletion or modification of admission resources
that carry the `platform.example.com/protected: "true"` label:

{{% code_sample language="yaml" file="access/manifest-admission-control/protect-admission-resources.yaml" %}}

### Enforcing a ValidatingAdmissionPolicy from disk

The following example defines a policy that denies privileged containers in all
namespaces except `kube-system`:

{{% code_sample language="yaml" file="access/manifest-admission-control/deny-privileged-policy.yaml" %}}

Place this file in the directory configured as `staticManifestsDir` for the
`ValidatingAdmissionPolicy` plugin. The policy and its binding are loaded
together atomically.

### Configuring a ValidatingWebhookConfiguration from disk

The following example configures a validating webhook that calls an external URL:

{{% code_sample language="yaml" file="access/manifest-admission-control/validating-webhook.yaml" %}}

{{< note >}}
Webhook URLs must be reachable from the kube-apiserver at startup. Only
URL-based endpoints are supported; service references are not allowed in
manifest-based webhook configurations.
{{< /note >}}

### Using the List format

You can use `v1.List` to group related resources together in a single document:

{{% code_sample language="yaml" file="access/manifest-admission-control/list-format-policy.yaml" %}}

## Evaluation order

Manifest-based configurations are evaluated before API-based configurations.
This ensures that platform-level policies enforced via static configuration take
precedence over API-based policies.

For admission configuration resources themselves (ValidatingAdmissionPolicy,
MutatingAdmissionPolicy, ValidatingAdmissionPolicyBinding,
MutatingAdmissionPolicyBinding, ValidatingWebhookConfiguration,
MutatingWebhookConfiguration), only manifest-based admission hooks are
evaluated. API-based hooks are skipped for these resource types to prevent
circular dependencies.

## File watching and dynamic reloading {#dynamic-reloading}

The kube-apiserver watches the configured directories for changes:

1. **Initial load**: At startup, all configured paths are read and validated.
   The API server does not become ready until all manifests are loaded
   successfully. Invalid manifests cause startup failure.

1. **Runtime reloading**: Changes to manifest files trigger a reload cycle:
   - File modifications are detected using
     [fsnotify](https://github.com/fsnotify/fsnotify) with a polling fallback
     (default 1 minute interval), similar to other config file reloading in
     kube-apiserver.
   - A content hash of all manifest files is computed on each check. If the hash
     is unchanged, no reload occurs.
   - New configurations are validated before being applied.
   - If validation fails, the error is logged, metrics are updated, and the
     previous valid configuration is retained.
   - Successful reloads atomically replace the previous configuration.

<!-- -->

1. **Atomic file updates**: To avoid partial reads during file writes, make
   changes atomically (for example, write to a temporary file and rename it).
   This is especially important when updating mounted ConfigMaps or Secrets in
   containerized environments.

{{< caution >}}
If an invalid manifest file is present at startup, the API server does not
start. At runtime, if a reload fails due to validation errors, the previous
valid configuration is retained and the error is logged.
{{< /caution >}}

## Observability {#observability}

### Metrics

Manifest-based admission control provides the following metrics for monitoring
reload health:

{{< table caption="Metrics for manifest-based admission control" >}}
| Type | Description | Metric |
|:-----|:------------|:-------|
| Counter | Total number of reload attempts, with `status` (`success` or `failure`), `plugin`, and `apiserver_id_hash` labels. | `apiserver_manifest_admission_config_controller_automatic_reloads_total` |
| Gauge | Timestamp of the last reload attempt, with `status`, `plugin`, and `apiserver_id_hash` labels. | `apiserver_manifest_admission_config_controller_automatic_reload_last_timestamp_seconds` |
| Gauge | Current configuration information (value is always 1), with `plugin`, `apiserver_id_hash`, and `hash` labels. Use the `hash` label to detect configuration drift across API servers. | `apiserver_manifest_admission_config_controller_last_config_info` |
{{< /table >}}

The `plugin` label identifies which admission plugin the metric applies to:
`ValidatingAdmissionWebhook`, `MutatingAdmissionWebhook`,
`ValidatingAdmissionPolicy`, or `MutatingAdmissionPolicy`.

Since manifest-based objects have names ending in `.static.k8s.io`, existing
admission metrics (such as `apiserver_admission_webhook_rejection_count`) can
identify manifest-based decisions by filtering on the `name` label.

### Audit annotations

Existing audit annotations (such as
`validation.policy.admission.k8s.io/validation_failure` and
`mutation.webhook.admission.k8s.io/round_0_index_0`) include the object name.
You can identify manifest-based admission decisions by filtering for names
ending in `.static.k8s.io`.

## High availability considerations {#ha-considerations}

Each kube-apiserver instance loads its own manifest files independently. In
high availability setups with multiple API server instances:

- Each API server must be configured individually. There is no cross-apiserver
  synchronization of manifest-based configurations.
- Use external configuration management tools (such as Ansible, Puppet, or
  shared storage mounts) to keep manifest files consistent across instances.
- The `apiserver_manifest_admission_config_controller_last_config_info` metric
  exposes a `hash` label that you can use to detect configuration drift across
  API server instances.

This behavior is similar to other file-based kube-apiserver configurations such as
[encryption at rest](/docs/tasks/administer-cluster/encrypt-data/) and
[authentication](/docs/reference/access-authn-authz/authentication/).

## Upgrade and downgrade {#upgrade-downgrade}

**Upgrade**: Enabling the feature and providing manifest configuration is
opt-in. Existing clusters without manifest configuration see no behavioral
change.

**Downgrade**: Before downgrading to a version without this feature:

1. Remove `staticManifestsDir` entries from the `AdmissionConfiguration` file.
1. If relying on manifest-based policies, recreate them as API objects where
   possible.
1. Restart the kube-apiserver.

{{< warning >}}
Downgrading without removing the `staticManifestsDir` configuration causes the
API server to fail to start due to unknown configuration fields.
{{< /warning >}}

## Troubleshooting {#troubleshooting}

{{< table caption="Common issues and their resolution" >}}
| Symptom | Possible cause | Resolution |
|:--------|:--------------|:-----------|
| API server fails to start | Invalid manifest file at startup | Check API server logs for validation errors. Fix the manifest file and restart. |
| API server fails to start | Duplicate object names across manifest files | Ensure all object names within a plugin's `staticManifestsDir` are unique. |
| Policies not enforced after file update | Reload validation failure | Check `automatic_reloads_total{status="failure"}` metric and API server logs. Fix the manifest and wait for the next reload cycle. |
| Webhook requests failing | Webhook URL not reachable | Verify that the URL specified in `clientConfig.url` is accessible from the kube-apiserver. |
| Cannot create API objects with `.static.k8s.io` suffix | Name suffix reserved by feature gate | The `.static.k8s.io` suffix is reserved for manifest-based configurations when the feature gate is enabled. Use a different name for API-based objects. |
{{< /table >}}

## {{% heading "whatsnext" %}}

- Learn about [ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/)
  for CEL-based validation policies.
- Learn about [MutatingAdmissionPolicy](/docs/reference/access-authn-authz/mutating-admission-policy/)
  for CEL-based mutation policies.
- Learn about [Dynamic Admission Control](/docs/reference/access-authn-authz/extensible-admission-controllers/)
  for webhook-based admission control.
- Read the [KEP-5793](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/5793-manifest-based-admission-control-config)
  design document.
