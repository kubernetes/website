# System Administrator’s Guide To Dynamic Admission Control

As a system administrator, you'll likely want to enable various admission
plugins to enact business policies. This document covers how to do that safely.

## Registering

Webhooks are registered with the ValidatingAdmissionWebhook and
MutatingAdmissionWebhook API types. At the moment, it's essential that you
register a webhook for all versions of an API--otherwise changes to a version
which the webhook isn't registered for won't go through the webhook. (I.e., if
you want a webhook on Deployments, you want to register for both the
beta version in extensions and the v1 version in apps.)

## Identity and permissions

### What does your webhook trust?

If the webhook is going to run in your cluster, the documentation for the
webhook should tell you how to set up the identities it will trust. If the
webhook is an external service, the service provider will have to give you some
mechanism for demonstrating an identity (e.g., a token or a client-cert for
mutual TLS).

The configuration file for admission controllers allows you to specify a
file in "kubeconfig" format. Each entry has a name; if the name "matches" (see
below) a webhook, the contents of that entry will be used as the identity when
calling out to that webhook. What does "match" mean? It is DNS based; e.g.
`*.bar.example.com` matches `foo.bar.example.com`, but if a
`foo.bar.example.com` section is present, it would take precendence. If the
webhook is running in the cluster, the name and namespace of the service will be
put into the form "name.namespace.svc" before matching.

If your cluster is self-hosted, it likely makes sense to put these files into a
secret.

Important note: if you are running any extension apiservers, they also need to
be configured with these files!

### RBAC Rules

Extension apiservers need to be able to get namespaces and read their labels in
order to tell if they need to call a webhook. You'll need to make sure they have
appropriate permissions.

## Bootstrapping

It is important to understand what a webhook will do and where it is
implemented. For example, suppose a webhook is running via a deployment and
modifies all pod objects. Then it is very important to be able to create the
webhook's own pods when the webhook is not running, otherwise the cluster will
be wedged. Do this by using the namespace label selector.

Likewise, system components probably should be excluded from many webhooks in
this manner. Consider grouping namespaces by
[run-level](https://github.com/kubernetes/kubernetes/issues/54522) to make it
easy.

Think carefully here: after installing this webhook, will your cluster still
boot up if you restarted every machine at the same time?

## Reliability (monitoring)

`kube-apiserver` publishes metrics (`/metrics`) that include the latency of all webhooks. You
can look at these metrics to debug a slow system, or monitor them to get alerted
if a webhook begins to have a lot of latency.

## Updating Kubernetes Version

Don't update a Kubernetes cluster until all of the webhooks you run have been
updated. It's the responsibility of the webhook author to publish documentation
about whether their webhook works with the version of Kubernetes you want to
update to.

If you want to update prior to seeing such confirmation, start up a new cluster
for testing instead of just upgrading your production cluster.



