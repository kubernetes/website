---
title: Admission Webhook Good Practices
description: >
  Recommendations for designing and deploying admission webhooks in Kubernetes.
content_type: concept
weight: 60
---

<!-- overview -->

This page provides good practices and considerations when designing
_admission webhooks_ in Kubernetes. This information is intended for
cluster operators who run admission webhook servers or third-party applications
that modify or validate your API requests.

Before reading this page, ensure that you're familiar with the following
concepts:

* [Admission controllers](/docs/reference/access-authn-authz/admission-controllers/)
* [Admission webhooks](/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks)

<!-- body -->

## Importance of good webhook design {#why-good-webhook-design-matters}

Admission control occurs when any create, update, or delete request
is sent to the Kubernetes API. Admission controllers intercept requests that
match specific criteria that you define. These requests are then sent to
mutating admission webhooks or validating admission webhooks. These webhooks are
often written to ensure that specific fields in object specifications exist or
have specific allowed values.

Webhooks are a powerful mechanism to extend the Kubernetes API. Badly-designed
webhooks often result in workload disruptions because of how much control
the webhooks have over objects in the cluster. Like other API extension
mechanisms, webhooks are challenging to test at scale for compatibility with
all of your workloads, other webhooks, add-ons, and plugins. 

Additionally, with every release, Kubernetes adds or modifies the API with new
features, feature promotions to beta or stable status, and deprecations. Even
stable Kubernetes APIs are likely to change. For example, the `Pod` API changed
in v1.29 to add the
[Sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/) feature.
While it's rare for a Kubernetes object to enter a broken state because of a new
Kubernetes API, webhooks that worked as expected with earlier versions of an API
might not be able to reconcile more recent changes to that API. This can result
in unexpected behavior after you upgrade your clusters to newer versions.

This page describes common webhook failure scenarios and how to avoid them by
cautiously and thoughtfully designing and implementing your webhooks. 

## Identify whether you use admission webhooks {#identify-admission-webhooks}

Even if you don't run your own admission webhooks, some third-party applications
that you run in your clusters might use mutating or validating admission
webhooks.

To check whether your cluster has any mutating admission webhooks, run the
following command:

```shell
kubectl get mutatingwebhookconfigurations
```
The output lists any mutating admission controllers in the cluster. 

To check whether your cluster has any validating admission webhooks, run the
following command:

```shell
kubectl get validatingwebhookconfigurations
```
The output lists any validating admission controllers in the cluster. 

## Choose an admission control mechanism {#choose-admission-mechanism}

Kubernetes includes multiple admission control and policy enforcement options.
Knowing when to use a specific option can help you to improve latency and
performance, reduce management overhead, and avoid issues during version
upgrades. The following table describes the mechanisms that let you mutate or
validate resources during admission:

<!-- This table is HTML because it uses unordered lists for readability. -->
<table>
  <caption>Mutating and validating admission control in Kubernetes</caption>
  <thead>
    <tr>
      <th>Mechanism</th>
      <th>Description</th>
      <th>Use cases</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="/docs/reference/access-authn-authz/extensible-admission-controllers/">Mutating admission webhook</a></td>
      <td>Intercept API requests before admission and modify as needed using
        custom logic.</td>
      <td><ul>
        <li>Make critical modifications that must happen before resource
          admission.</li>
        <li>Make complex modifications that require advanced logic, like calling
          external APIs.</li>
      </ul></td>
    </tr>
    <tr>
      <td><a href="/docs/reference/access-authn-authz/mutating-admission-policy/">Mutating admission policy</a></td>
      <td>Intercept API requests before admission and modify as needed using
        Common Expression Language (CEL) expressions.</td>
      <td><ul>
        <li>Make critical modifications that must happen before resource
          admission.</li>
        <li>Make simple modifications, such as adjusting labels or replica
        counts.</li>
      </ul></td>
    </tr>
    <tr>
      <td><a href="/docs/reference/access-authn-authz/extensible-admission-controllers/">Validating admission webhook</a></td>
      <td>Intercept API requests before admission and validate against complex
        policy declarations.</td>
      <td><ul>
        <li>Validate critical configurations before resource admission.</li>
        <li>Enforce complex policy logic before admission.</li>
      </ul></td>
    </tr>
    <tr>
      <td><a href="/docs/reference/access-authn-authz/validating-admission-policy/">Validating admission policy</a></td>
      <td>Intercept API requests before admission and validate against CEL
        expressions.</td>
      <td><ul>
        <li>Validate critical configurations before resource admission.</li>
        <li>Enforce policy logic using CEL expressions.</li>
      </ul></td>
    </tr>
  </tbody>
</table>

In general, use _webhook_ admission control when you want an extensible way to
declare or configure the logic. Use built-in CEL-based admission control when
you want to declare simpler logic without the overhead of running a webhook
server. The Kubernetes project recommends that you use CEL-based admission
control when possible.

### Use built-in validation and defaulting for CustomResourceDefinitions {#no-crd-validation-defaulting}

If you use
{{< glossary_tooltip text="CustomResourceDefinitions" term_id="customresourcedefinition" >}},
don't use admission webhooks to validate values in CustomResource specifications
or to set default values for fields. Kubernetes lets you define validation rules
and default field values when you create CustomResourceDefinitions.

To learn more, see the following resources:

* [Validation rules](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-rules)
* [Defaulting](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#defaulting)

## Performance and latency {#performance-latency}

This section describes recommendations for improving performance and reducing
latency. In summary, these are as follows:

* Consolidate webhooks and limit the number of API calls per webhook.
* Use audit logs to check for webhooks that repeatedly do the same action.
* Use load balancing for webhook availability.
* Set a small timeout value for each webhook.
* Consider cluster availability needs during webhook design.

### Design admission webhooks for low latency {#design-admission-webhooks-low-latency}

Mutating admission webhooks are called in sequence. Depending on the mutating
webhook setup, some webhooks might be called multiple times. Every mutating
webhook call adds latency to the admission process. This is unlike validating
webhooks, which get called in parallel. 

When designing your mutating webhooks, consider your latency requirements and
tolerance. The more mutating webhooks there are in your cluster, the greater the
chance of latency increases. 

Consider the following to reduce latency:

* Consolidate webhooks that perform a similar mutation on different objects.
* Reduce the number of API calls made in the mutating webhook server logic.
* Limit the match conditions of each mutating webhook to reduce how many
  webhooks are triggered by a specific API request.
* Consolidate small webhooks into one server and configuration to help with
  ordering and organization.

### Prevent loops caused by competing controllers {#prevent-loops-competing-controllers}

Consider any other components that run in your cluster that might conflict with
the mutations that your webhook makes. For example, if your webhook adds a label
that a different controller removes, your webhook gets called again. This leads
to a loop.

To detect these loops, try the following:

1.  Update your cluster audit policy to log audit events. Use the following
    parameters:
    
      * `level`: `RequestResponse`
      * `verbs`: `["patch"]`
      * `omitStages`: `RequestReceived`

    Set the audit rule to create events for the specific resources that your
    webhook mutates.

1.  Check your audit events for webhooks being reinvoked multiple times with the
    same patch being applied to the same object, or for an object having
    a field updated and reverted multiple times.

### Set a small timeout value {#small-timeout}

Admission webhooks should evaluate as quickly as possible (typically in
milliseconds), since they add to API request latency. Use a small timeout for
webhooks.

For details, see
[Timeouts](/docs/reference/access-authn-authz/extensible-admission-controllers/#timeouts).

### Use a load balancer to ensure webhook availability {#load-balancer-webhook}

Admission webhooks should leverage some form of load-balancing to provide high
availability and performance benefits. If a webhook is running within the
cluster, you can run multiple webhook backends behind a Service of type
`ClusterIP`.

### Use a high-availability deployment model {#ha-deployment}

Consider your cluster's availability requirements when designing your webhook. 
For example, during node downtime or zonal outages, Kubernetes marks Pods as
`NotReady` to allow load balancers to reroute traffic to available zones and
nodes. These updates to Pods might trigger your mutating webhooks. Depending on
the number of affected Pods, the mutating webhook server has a risk of timing
out or causing delays in Pod processing. As a result, traffic won't get
rerouted as quickly as you need.

Consider situations like the preceding example when writing your webhooks.
Exclude operations that are a result of Kubernetes responding to unavoidable
incidents.

## Request filtering {#request-filtering}

This section provides recommendations for filtering which requests trigger
specific webhooks. In summary, these are as follows:

* Limit the webhook scope to avoid system components and read-only requests.
* Limit webhooks to specific namespaces.
* Use match conditions to perform fine-grained request filtering.
* Match all versions of an object.

### Limit the scope of each webhook {#webhook-limit-scope}

Admission webhooks are only called when an API request matches the corresponding
webhook configuration. Limit the scope of each webhook to reduce unnecessary
calls to the webhook server. Consider the following scope limitations:

* Avoid matching objects in the `kube-system` namespace. If you run your own
  Pods in the `kube-system` namespace, use an
  [`objectSelector`](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-objectselector)
  to avoid mutating a critical workload.
* Don't mutate node leases, which exist as Lease objects in the
  `kube-node-lease` system namespace. Mutating node leases might result in
  failed node upgrades. Only apply validation controls to Lease objects in this
  namespace if you're confident that the controls won't put your cluster at
  risk.
* Don't mutate TokenReview or SubjectAccessReview objects. These are always
  read-only requests. Modifying these objects might break your cluster.
* Limit each webhook to a specific namespace by using a
  [`namespaceSelector`](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-namespaceselector).

### Filter for specific requests by using match conditions {#filter-match-conditions}

Admission controllers support multiple fields that you can use to match requests
that meet specific criteria. For example, you can use a `namespaceSelector` to
filter for requests that target a specific namespace.

For more fine-grained request filtering, use the `matchConditions` field in your
webhook configuration. This field lets you write multiple CEL expressions that
must evaluate to `true` for a request to trigger your admission webhook. Using
`matchConditions` might significantly reduce the number of calls to your webhook
server.

For details, see
[Matching requests: `matchConditions`](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-matchconditions).

### Match all versions of an API {#match-all-versions}

By default, admission webhooks run on any API versions that affect a specified
resource. The `matchPolicy` field in the webhook configuration controls this
behavior. Specify a value of `Equivalent` in the `matchPolicy` field or omit
the field to allow the webhook to run on any API version. 

For details, see
[Matching requests: `matchPolicy`](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-matchpolicy).

## Mutation scope and field considerations {#mutation-scope-considerations}

This section provides recommendations for the scope of mutations and any special
considerations for object fields. In summary, these are as follows:

* Patch only the fields that you need to patch.
* Don't overwrite array values.
* Avoid side effects in mutations when possible.
* Avoid self-mutations.
* Fail open and validate the final state.
* Plan for future field updates in later versions.
* Prevent webhooks from self-triggering.
* Don't change immutable objects.

### Patch only required fields {#patch-required-fields}

Admission webhook servers send HTTP responses to indicate what to do with a
specific Kubernetes API request. This response is an AdmissionReview object.
A mutating webhook can add specific fields to mutate before allowing admission
by using the `patchType` field and the `patch` field in the response. Ensure
that you only modify the fields that require a change. 

For example, consider a mutating webhook that's configured to ensure that
`web-server` Deployments have at least three replicas. When a request to
create a Deployment object matches your webhook configuration, the webhook
should only update the value in the `spec.replicas` field.

### Don't overwrite array values {#dont-overwrite-arrays}

Fields in Kubernetes object specifications might include arrays. Some arrays
contain key:value pairs (like the `envVar` field in a container specification),
while other arrays are unkeyed (like the `readinessGates` field in a Pod
specification). The order of values in an array field might matter in some
situations. For example, the order of arguments in the `args` field of a
container specification might affect the container. 

Consider the following when modifying arrays:

* Whenever possible, use the `add` JSONPatch operation instead of `replace` to
  avoid accidentally replacing a required value.
* Treat arrays that don't use key:value pairs as sets.
* Ensure that the values in the field that you modify aren't required to be
  in a specific order. 
* Don't overwrite existing key:value pairs unless absolutely necessary.
* Use caution when modifying label fields. An accidental modification might
  cause label selectors to break, resulting in unintended behavior.

### Avoid side effects {#avoid-side-effects}

Ensure that your webhooks operate only on the content of the AdmissionReview
that's sent to them, and do not make out-of-band changes. These additional
changes, called _side effects_, might cause conflicts during admission if they
aren't reconciled properly. The `.webhooks[].sideEffects` field should
be set to `None` if a webhook doesn't have any side effect. 

If side effects are required during the admission evaluation, they must be
suppressed when processing an AdmissionReview object with `dryRun` set to
`true`, and the `.webhooks[].sideEffects` field should be set to `NoneOnDryRun`.

For details, see
[Side effects](/docs/reference/access-authn-authz/extensible-admission-controllers/#side-effects).

### Avoid self-mutations {#avoid-self-mutation}

A webhook running inside the cluster might cause deadlocks for its own
deployment if it is configured to intercept resources required to start its own
Pods.

For example, a mutating admission webhook is configured to admit **create** Pod
requests only if a certain label is set in the Pod (such as `env: prod`).
The webhook server runs in a Deployment that doesn't set the `env` label.

When a node that runs the webhook server Pods becomes unhealthy, the webhook
Deployment tries to reschedule the Pods to another node. However, the existing
webhook server rejects the requests since the `env` label is unset. As a
result, the migration cannot happen.

Exclude the namespace where your webhook is running with a
[`namespaceSelector`](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-namespaceselector).

### Avoid dependency loops {#avoid-dependency-loops}

Dependency loops can occur in scenarios like the following:

* Two webhooks check each other's Pods. If both webhooks become unavailable
  at the same time, neither webhook can start.
* Your webhook intercepts cluster add-on components, such as networking plugins
  or storage plugins, that your webhook depends on. If both the webhook and the
  dependent add-on become unavailable, neither component can function.

To avoid these dependency loops, try the following:

* Use
  [ValidatingAdmissionPolicies](/docs/reference/access-authn-authz/validating-admission-policy/)
  to avoid introducing dependencies.
* Prevent webhooks from validating or mutating other webhooks. Consider
  [excluding specific namespaces](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-namespaceselector)
  from triggering your webhook.
* Prevent your webhooks from acting on dependent add-ons by using an
  [`objectSelector`](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-objectselector).

### Fail open and validate the final state {#fail-open-validate-final-state}

Mutating admission webhooks support the `failurePolicy` configuration field.
This field indicates whether the API server should admit or reject the request
if the webhook fails. Webhook failures might occur because of timeouts or errors
in the server logic.

By default, admission webhooks set the `failurePolicy` field to Fail. The API
server rejects a request if the webhook fails. However, rejecting requests by
default might result in compliant requests being rejected during webhook
downtime. 

Let your mutating webhooks "fail open" by setting the `failurePolicy` field to
Ignore. Use a validating controller to check the state of requests to ensure
that they comply with your policies. 

This approach has the following benefits:

* Mutating webhook downtime doesn't affect compliant resources from deploying.
* Policy enforcement occurs during validating admission control.
* Mutating webhooks don't interfere with other controllers in the cluster.

### Plan for future updates to fields {#plan-future-field-updates}

In general, design your webhooks under the assumption that Kubernetes APIs might
change in a later version. Don't write a server that takes the stability of an
API for granted. For example, the release of sidecar containers in Kubernetes
added a `restartPolicy` field to the Pod API. 

### Prevent your webhook from triggering itself {#prevent-webhook-self-trigger}

Mutating webhooks that respond to a broad range of API requests might
unintentionally trigger themselves. For example, consider a webhook that
responds to all requests in the cluster. If you configure the webhook to create
Event objects for every mutation, it'll respond to its own Event object
creation requests.

To avoid this, consider setting a unique label in any resources that your
webhook creates. Exclude this label from your webhook match conditions.

### Don't change immutable objects {#dont-change-immutable-objects}

Some Kubernetes objects in the API server can't change. For example, when you
deploy a {{< glossary_tooltip text="static Pod" term_id="static-pod" >}}, the
kubelet on the node creates a 
{{< glossary_tooltip text="mirror Pod" term_id="mirror-pod" >}} in the API
server to track the static Pod. However, changes to the mirror Pod don't
propagate to the static Pod. 

Don't attempt to mutate these objects during admission. All mirror Pods have the
`kubernetes.io/config.mirror` annotation. To exclude mirror Pods while reducing
the security risk of ignoring an annotation, allow static Pods to only run in
specific namespaces. 

## Mutating webhook ordering and idempotence {#ordering-idempotence}

This section provides recommendations for webhook order and designing idempotent
webhooks. In summary, these are as follows:

* Don't rely on a specific order of execution.
* Validate mutations before admission.
* Check for mutations being overwritten by other controllers.
* Ensure that the set of mutating webhooks is idempotent, not just the
  individual webhooks.

### Don't rely on mutating webhook invocation order {#dont-rely-webhook-order}

Mutating admission webhooks don't run in a consistent order. Various factors
might change when a specific webhook is called. Don't rely on your webhook
running at a specific point in the admission process. Other webhooks could still
mutate your modified object.

The following recommendations might help to minimize the risk of unintended
changes:

* [Validate mutations before admission](#validate-mutations)
* Use a reinvocation policy to observe changes to an object by other plugins
  and re-run the webhook as needed. For details, see
  [Reinvocation policy](/docs/reference/access-authn-authz/extensible-admission-controllers/#reinvocation-policy).

### Ensure that the mutating webhooks in your cluster are idempotent {#ensure-mutating-webhook-idempotent}

Every mutating admission webhook should be _idempotent_. The webhook should be
able to run on an object that it already modified without making additional
changes beyond the original change.

Additionally, all of the mutating webhooks in your cluster should, as a
collection, be idempotent. After the mutation phase of admission control ends,
every individual mutating webhook should be able to run on an object without 
making additional changes to the object.

Depending on your environment, ensuring idempotence at scale might be
challenging. The following recommendations might help:

* Use validating admission controllers to verify the final state of
  critical workloads.
* Test your deployments in a staging cluster to see if any objects get modified
  multiple times by the same webhook. 
* Ensure that the scope of each mutating webhook is specific and limited.

The following examples show idempotent mutation logic:

1. For a **create** Pod request, set the field
  `.spec.securityContext.runAsNonRoot` of the Pod to true.

1. For a **create** Pod request, if the field
   `.spec.containers[].resources.limits` of a container is not set, set default
   resource limits.

1. For a **create** Pod request, inject a sidecar container with name
   `foo-sidecar` if no container with the name `foo-sidecar` already exists.

In these cases, the webhook can be safely reinvoked, or admit an object that
already has the fields set.

The following examples show non-idempotent mutation logic:

1. For a **create** Pod request, inject a sidecar container with name
   `foo-sidecar` suffixed with the current timestamp (such as
   `foo-sidecar-19700101-000000`).

   Reinvoking the webhook can result in the same sidecar being injected multiple
   times to a Pod, each time with a different container name. Similarly, the
   webhook can inject duplicated containers if the sidecar already exists in
   a user-provided pod.

1. For a **create**/**update** Pod request, reject if the Pod has label `env`
   set, otherwise add an `env: prod` label to the Pod.

   Reinvoking the webhook will result in the webhook failing on its own output.

1. For a **create** Pod request, append a sidecar container named `foo-sidecar`
   without checking whether a `foo-sidecar` container exists.

   Reinvoking the webhook will result in duplicated containers in the Pod, which
   makes the request invalid and rejected by the API server.

## Mutation testing and validation {#mutation-testing-validation}

This section provides recommendations for testing your mutating webhooks and
validating mutated objects. In summary, these are as follows:

* Test webhooks in staging environments.
* Avoid mutations that violate validations.
* Test minor version upgrades for regressions and conflicts.
* Validate mutated objects before admission.

### Test webhooks in staging environments {#test-in-staging-environments}

Robust testing should be a core part of your release cycle for new or updated
webhooks. If possible, test any changes to your cluster webhooks in a staging
environment that closely resembles your production clusters. At the very least,
consider using a tool like [minikube](https://minikube.sigs.k8s.io/docs/) or
[kind](https://kind.sigs.k8s.io/) to create a small test cluster for webhook
changes.

### Ensure that mutations don't violate validations {#ensure-mutations-dont-violate-validations}

Your mutating webhooks shouldn't break any of the validations that apply to an
object before admission. For example, consider a mutating webhook that sets the 
default CPU request of a Pod to a specific value. If the CPU limit of that Pod
is set to a lower value than the mutated request, the Pod fails admission. 

Test every mutating webhook against the validations that run in your cluster.

### Test minor version upgrades to ensure consistent behavior {#test-minor-version-upgrades}

Before upgrading your production clusters to a new minor version, test your
webhooks and workloads in a staging environment. Compare the results to ensure
that your webhooks continue to function as expected after the upgrade. 

Additionally, use the following resources to stay informed about API changes:

* [Kubernetes release notes](/releases/)
* [Kubernetes blog](/blog/)

### Validate mutations before admission {#validate-mutations}

Mutating webhooks run to completion before any validating webhooks run. There is
no stable order in which mutations are applied to objects. As a result, your
mutations could get overwritten by a mutating webhook that runs at a later time.

Add a validating admission controller like a ValidatingAdmissionWebhook or a
ValidatingAdmissionPolicy to your cluster to ensure that your mutations
are still present. For example, consider a mutating webhook that inserts the
`restartPolicy: Always` field to specific init containers to make them run as
sidecar containers. You could run a validating webhook to ensure that those
init containers retained the `restartPolicy: Always` configuration after all
mutations were completed. 

For details, see the following resources:

* [Validating Admission Policy](/docs/reference/access-authn-authz/validating-admission-policy/)
* [ValidatingAdmissionWebhooks](/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook)

## Mutating webhook deployment {#mutating-webhook-deployment}

This section provides recommendations for deploying your mutating admission
webhooks. In summary, these are as follows:

* Gradually roll out the webhook configuration and monitor for issues by
  namespace.
* Limit access to edit the webhook configuration resources. 
* Limit access to the namespace that runs the webhook server, if the server is
  in-cluster.

### Install and enable a mutating webhook {#install-enable-mutating-webhook}

When you're ready to deploy your mutating webhook to a cluster, use the
following order of operations: 

1.  Install the webhook server and start it.
1.  Set the `failurePolicy` field in the MutatingWebhookConfiguration manifest
    to Ignore. This lets you avoid disruptions caused by misconfigured webhooks.
1.  Set the `namespaceSelector` field in the MutatingWebhookConfiguration
    manifest to a test namespace.
1.  Deploy the MutatingWebhookConfiguration to your cluster.

Monitor the webhook in the test namespace to check for any issues, then roll the
webhook out to other namespaces. If the webhook intercepts an API request that
it wasn't meant to intercept, pause the rollout and adjust the scope of the
webhook configuration.

### Limit edit access to mutating webhooks {#limit-edit-access}

Mutating webhooks are powerful Kubernetes controllers. Use RBAC or another
authorization mechanism to limit access to your webhook configurations and
servers. For RBAC, ensure that the following access is only available to trusted
entities:

* Verbs: **create**, **update**, **patch**, **delete**, **deletecollection**
* API group: `admissionregistration.k8s.io/v1`
* API kind: MutatingWebhookConfigurations

If your mutating webhook server runs in the cluster, limit access to create or
modify any resources in that namespace.

## Examples of good implementations {#example-good-implementations}

{{% thirdparty-content %}}

The following projects are examples of "good" custom webhook server
implementations. You can use them as a starting point when designing your own
webhooks. Don't use these examples as-is; use them as a starting point and
design your webhooks to run well in your specific environment.

* [`cert-manager`](https://github.com/cert-manager/cert-manager/tree/master/internal/webhook)
* [Gatekeeper Open Policy Agent (OPA)](https://open-policy-agent.github.io/gatekeeper/website/docs/mutation)

## {{% heading "whatsnext" %}}

* [Use webhooks for authentication and authorization](/docs/reference/access-authn-authz/webhook/)
* [Learn about MutatingAdmissionPolicies](/docs/reference/access-authn-authz/mutating-admission-policy/)
* [Learn about ValidatingAdmissionPolicies](/docs/reference/access-authn-authz/validating-admission-policy/)
