# Webhook Author's Guide to Dynamic Admission Control

So, you want to extend Kubernetes by providing a webhook for the admission
control stack to call. Great! Here's some detail about what that means.

## Anatomy of a webhook

System administrators will expect a complete webhook package to include:

1. Sample configuration API object(s), of type `ValidatingWebhookConfiguration`,
   `MutatingWebhookConfiguration`, or both. These are where we declare to the
   Kubernetes control plane which API objects need to pass through the webhook.
   Use the namespace selector feature to make sure your webhook won't run on its
   own pods (if the below step applies).
2. If the webhook is not an external service, then some way to run the webhook.
   This could look like some sort of packaged installer, or it could be a
   Deployment and a Service object.
3. Instructions for how to apply the above.
4. Documentation about the Kubernetes versions the webhook has been tested
   against. How would a system administrator know it is safe to install your
   webhook? Are there any prerequisites? (For example, a beta API that must be
   on or off? Another webhook that must run before or after?)
5. Document the security implications of the webhook and how to configure
   apiserver to call the webhook. What identities does the webhook trust? How
   does apiserver assert one of those identities? This could take the form of an
   example kubeconfig file.

### Ongoing Maintenance Responsibilities

Webhooks are effectively part of the Kubernetes control plane. The control plane
of a cluster cannot be upgraded if the installed webhooks do not support the new
version. Therefore, it is the responsibility of a webhook author to monitor
upcoming Kubernetes version release notes, test the webhook against the new
versions, and distribute in some conspicuous place the results of this, and the
timeline for fixing any incompatibilities.

In the Kubernetes system, the control plane and clients of the control plane
have asymmetric requirements around backwards compatibility. Ordinarily, the
control plane must support multiple (at least two) client versions, but clients
only need to understand one control plane version: clients expect the server to
be backwards compatible. If you have made use of Kubernetes clients in the past,
you likely haven't had to worry about a control plane upgrade breaking your
client until it is multiple versions old.

In contrast, webhooks are control plane components. It is the webhook's
responsibility to understand every API object sent to it. As a consequence, it
is not necessarily safe for a webhook that understands version 1.X objects to be
sent 1.(X+1) objects.

All that to say: webhook authors need to take seriously the changes between
Kubernetes versions. Webhooks must support at least two consequtive Kubernetes
versions, and must understand all present API objects (that they register for).
Users can't upgrade until all of their webhooks support the new Kubernetes
version.

## Webhook pro-tips

### Side effects

The Kubernetes API offers validating and mutating webhook options, but there is
another dimension that is at least as relevant to you, the webhook author: side
effects. When a webhook is called with some object X, for our purposes here, a
"side-effect" is anything that the webhook changes that's not a change to X.
Some examples: deducting quota, allocating a load balancer, adding a secret to
the system.

Side effects are very dangerous: your webhook does not know that a request will
ultimately be successful. Deducting quota for requests that are failed by a
subsequent webhook may quickly exhaust quota.

We therefore strongly recommend that webhooks should not have side effects--such
actions are probably more suited for implementation with the controller pattern,
asynchronously.

In the case where you really have to have a side effect (a quota system is the
only legitimate example this author can think of), it is mandatory to have
some sort of background reconcilliation or cleanup process that recovers
gracefully from incorrectly applied side effects. And it should go without
saying that side effects have to be reversible for that to be possible.

### HA configurations

Webhooks are part of the control plane and have to have an SLA that's at least
as high as the control plane. Therefore, you likely need to run your webhook in
an HA (high-availability) configuration. If you built your webhook with a
Deployment and a Service object, it shouldn't be hard to run in an HA
configuration. Of course, it's up to you, the author, to make sure the webhook
tolerates multiple instances--doesn't modify global state on recieving a
request, for example.
