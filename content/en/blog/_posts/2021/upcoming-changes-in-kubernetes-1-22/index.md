---
layout: blog
title: "Kubernetes API and Feature Removals In 1.22: Here’s What You Need To Know"
date: 2021-07-14
slug: upcoming-changes-in-kubernetes-1-22
author: >
  Krishna Kilari (Amazon Web Services),
  Tim Bannister (The Scale Factory)
---

As the Kubernetes API evolves, APIs are periodically reorganized or upgraded.
When APIs evolve, the old APIs they replace are deprecated, and eventually removed.
See [Kubernetes API removals](#kubernetes-api-removals) to read more about Kubernetes'
policy on removing APIs.

We want to make sure you're aware of some upcoming removals. These are
beta APIs that you can use in current, supported Kubernetes versions,
and they are already deprecated. The reason for all of these removals
is that they have been superseded by a newer, stable (“GA”) API.

Kubernetes 1.22, due for release in August 2021, will remove a number of deprecated
APIs.
_Update_:
[Kubernetes 1.22: Reaching New Peaks](/blog/2021/08/04/kubernetes-1-22-release-announcement/)
has details on the v1.22 release.

## API removals for Kubernetes v1.22 {#api-changes}

The **v1.22** release will stop serving the API versions we've listed immediately below.
These are all beta APIs that were previously deprecated in favor of newer and more stable
API versions.
<!-- sorted by API group -->

* Beta versions of the `ValidatingWebhookConfiguration` and `MutatingWebhookConfiguration` API (the  **admissionregistration.k8s.io/v1beta1** API versions)
* The beta `CustomResourceDefinition` API (**apiextensions.k8s.io/v1beta1**)
* The beta `APIService` API (**apiregistration.k8s.io/v1beta1**)
* The beta `TokenReview` API (**authentication.k8s.io/v1beta1**)
* Beta API versions of `SubjectAccessReview`, `LocalSubjectAccessReview`, `SelfSubjectAccessReview` (API versions from **authorization.k8s.io/v1beta1**)
* The beta `CertificateSigningRequest` API (**certificates.k8s.io/v1beta1**)
* The beta `Lease` API (**coordination.k8s.io/v1beta1**)
* All beta `Ingress` APIs (the **extensions/v1beta1** and **networking.k8s.io/v1beta1** API versions)

The Kubernetes documentation covers these
[API removals for v1.22](/docs/reference/using-api/deprecation-guide/#v1-22) and explains
how each of those APIs change between beta and stable.

## What to do

We're going to run through each of the resources that are affected by these removals
and explain the steps you'll need to take.

`Ingress`
: Migrate to use the **networking.k8s.io/v1**
  [Ingress](/docs/reference/kubernetes-api/service-resources/ingress-v1/) API,
  [available since v1.19](/blog/2020/08/26/kubernetes-release-1.19-accentuate-the-paw-sitive/#ingress-graduates-to-general-availability).  
  The related API [IngressClass](/docs/reference/kubernetes-api/service-resources/ingress-class-v1/)
  is designed to complement the [Ingress](/docs/concepts/services-networking/ingress/)
  concept, allowing you to configure multiple kinds of Ingress within one cluster.
  If you're currently using the deprecated
  [`kubernetes.io/ingress.class`](https://kubernetes.io/docs/reference/labels-annotations-taints/#kubernetes-io-ingress-class-deprecated)
  annotation, plan to switch to using the `.spec.ingressClassName` field instead.  
  On any cluster running Kubernetes v1.19 or later, you can use the v1 API to
  retrieve or update existing Ingress objects, even if they were created using an
  older API version.  

  When you convert an Ingress to the v1 API, you should review each rule in that Ingress.
  Older Ingresses use the legacy `ImplementationSpecific` path type. Instead of `ImplementationSpecific`, switch [path matching](/docs/concepts/services-networking/ingress/#path-types) to either `Prefix` or `Exact`. One of the benefits of moving to these alternative path types is that it becomes easier to migrate between different Ingress classes.  

  **ⓘ**  As well as upgrading _your_ own use of the Ingress API as a client, make sure that
  every ingress controller that you use is compatible with the v1 Ingress API.
  Read [Ingress Prerequisites](/docs/concepts/services-networking/ingress/#prerequisites)
  for more context about Ingress and ingress controllers.

`ValidatingWebhookConfiguration` and `MutatingWebhookConfiguration`
: Migrate to use the **admissionregistration.k8s.io/v1** API versions of
  [ValidatingWebhookConfiguration](/docs/reference/kubernetes-api/extend-resources/validating-webhook-configuration-v1/)
  and [MutatingWebhookConfiguration](/docs/reference/kubernetes-api/extend-resources/mutating-webhook-configuration-v1/),
  available since v1.16.  
  You can use the v1 API to retrieve or update existing objects, even if they were created using an older API version.

`CustomResourceDefinition`
: Migrate to use the [CustomResourceDefinition](/docs/reference/kubernetes-api/extend-resources/custom-resource-definition-v1/)
  **apiextensions.k8s.io/v1** API, available since v1.16.  
  You can use the v1 API to retrieve or update existing objects, even if they were created
  using an older API version. If you defined any custom resources in your cluster, those
  are still served after you upgrade.  

  If you're using external CustomResourceDefinitions, you can use
  [`kubectl convert`](#kubectl-convert) to translate existing manifests to use the newer API.
  Because there are some functional differences between beta and stable CustomResourceDefinitions,
  our advice is to test out each one to make sure it works how you expect after the upgrade.

`APIService`
: Migrate to use the **apiregistration.k8s.io/v1** [APIService](/docs/reference/kubernetes-api/cluster-resources/api-service-v1/)
  API, available since v1.10.  
  You can use the v1 API to retrieve or update existing objects, even if they were created using an older API version.
  If you already have API aggregation using an APIService object, this aggregation continues
  to work after you upgrade.

`TokenReview`
: Migrate to use the **authentication.k8s.io/v1** [TokenReview](/docs/reference/kubernetes-api/authentication-resources/token-review-v1/)
  API, available since v1.10.  

  As well as serving this API via HTTP, the Kubernetes API server uses the same format to
  [send](/docs/reference/access-authn-authz/authentication/#webhook-token-authentication)
  TokenReviews to webhooks. The v1.22 release continues to use the v1beta1 API for TokenReviews
  sent to webhooks by default. See [Looking ahead](#looking-ahead) for some specific tips about
  switching to the stable API.

`SubjectAccessReview`, `SelfSubjectAccessReview` and `LocalSubjectAccessReview`
: Migrate to use the **authorization.k8s.io/v1** versions of those
  [authorization APIs](/docs/reference/kubernetes-api/authorization-resources/), available since v1.6.  

`CertificateSigningRequest`
: Migrate to use the **certificates.k8s.io/v1**
  [CertificateSigningRequest](/docs/reference/kubernetes-api/authentication-resources/certificate-signing-request-v1/)
  API, available since v1.19.  
  You can use the v1 API to retrieve or update existing objects, even if they were created
  using an older API version. Existing issued certificates retain their validity when you upgrade.

`Lease`
: Migrate to use the **coordination.k8s.io/v1** [Lease](/docs/reference/kubernetes-api/cluster-resources/lease-v1/)
  API, available since v1.14.  
  You can use the v1 API to retrieve or update existing objects, even if they were created
  using an older API version.

### `kubectl convert`

There is a plugin to `kubectl` that provides the `kubectl convert` subcommand.
It's an official plugin that you can download as part of Kubernetes.
See [Download Kubernetes](/releases/download/) for more details.

You can use `kubectl convert` to update manifest files to use a different API
version. For example, if you have a manifest in source control that uses the beta
Ingress API, you can check that definition out,
and run
`kubectl convert -f <manifest> --output-version <group>/<version>`.
You can use the `kubectl convert` command to automatically convert an
existing manifest.

For example, to convert an older Ingress definition to
`networking.k8s.io/v1`, you can run:
```bash
kubectl convert -f ./legacy-ingress.yaml --output-version networking.k8s.io/v1
```

The automatic conversion uses a similar technique to how the Kubernetes control plane
updates objects that were originally created using an older API version. Because it's
a mechanical conversion, you might need to go in and change the manifest to adjust
defaults etc.

### Rehearse for the upgrade

If you manage your cluster's API server component, you can try out these API
removals before you upgrade to Kubernetes v1.22.

To do that, add the following to the kube-apiserver command line arguments:

`--runtime-config=admissionregistration.k8s.io/v1beta1=false,apiextensions.k8s.io/v1beta1=false,apiregistration.k8s.io/v1beta1=false,authentication.k8s.io/v1beta1=false,authorization.k8s.io/v1beta1=false,certificates.k8s.io/v1beta1=false,coordination.k8s.io/v1beta1=false,extensions/v1beta1/ingresses=false,networking.k8s.io/v1beta1=false`

(as a side effect, this also turns off v1beta1 of EndpointSlice - watch out for
that when you're testing).

Once you've switched all the kube-apiservers in your cluster to use that setting,
those beta APIs are removed. You can test that API clients (`kubectl`, deployment
tools, custom controllers etc) still work how you expect, and you can revert if
you need to without having to plan a more disruptive downgrade.



### Advice for software authors

Maybe you're reading this because you're a developer of an addon or other
component that integrates with Kubernetes?

If you develop an Ingress controller, webhook authenticator, an API aggregation, or
any other tool that relies on these deprecated APIs, you should already have started
to switch your software over.

You can use the tips in
[Rehearse for the upgrade](#rehearse-for-the-upgrade) to run your own Kubernetes
cluster that only uses the new APIs, and make sure that your code works OK.
For your documentation, make sure readers are aware of any steps they should take
for the Kubernetes v1.22 upgrade.

Where possible, give your users a hand to adopt the new APIs early - perhaps in a
test environment - so they can give you feedback about any problems.

There are some [more deprecations](#looking-ahead) coming in Kubernetes v1.25,
so plan to have those covered too.

## Kubernetes API removals

Here's some background about why Kubernetes removes some APIs, and also a promise
about _stable_ APIs in Kubernetes.

Kubernetes follows a defined
[deprecation policy](/docs/reference/using-api/deprecation-policy/) for its
features, including the Kubernetes API. That policy allows for replacing stable
(“GA”) APIs from Kubernetes. Importantly, this policy means that a stable API only
be deprecated when a newer stable version of that same API is available.

That stability guarantee matters: if you're using a stable Kubernetes API, there
won't ever be a new version released that forces you to switch to an alpha or beta
feature.

Earlier stages are different. Alpha features are under test and potentially
incomplete. Almost always, alpha features are disabled by default.
Kubernetes releases can and do remove alpha features that haven't worked out.

After alpha, comes beta. These features are typically enabled by default; if the
testing works out, the feature can graduate to stable. If not, it might need
a redesign.

Last year, Kubernetes officially
[adopted](/blog/2020/08/21/moving-forward-from-beta/#avoiding-permanent-beta)
a policy for APIs that have reached their beta phase:

> For Kubernetes REST APIs, when a new feature's API reaches beta, that starts
> a countdown. The beta-quality API now has three releases &hellip;
> to either:
>
> * reach GA, and deprecate the beta, or
> * have a new beta version (and deprecate the previous beta).

_At the time of that article, three Kubernetes releases equated to roughly nine
calendar months. Later that same month, Kubernetes
adopted a new
release cadence of three releases per calendar year, so the countdown period is
now roughly twelve calendar months._

Whether an API removal is because of a beta feature graduating to stable, or
because that API hasn't proved successful, Kubernetes will continue to remove
APIs by following its deprecation policy and making sure that migration options
are documented.

### Looking ahead

There's a setting that's relevant if you use webhook authentication checks.
A future Kubernetes release will switch to sending TokenReview objects
to webhooks using the `authentication.k8s.io/v1` API by default. At the moment,
the default is to send `authentication.k8s.io/v1beta1` TokenReviews to webhooks,
and that's still the default for Kubernetes v1.22.
However, you can switch over to the stable API right now if you want:
add `--authentication-token-webhook-version=v1` to the command line options for
the kube-apiserver, and check that webhooks for authentication still work how you
expected.

Once you're happy it works OK, you can leave the `--authentication-token-webhook-version=v1`
option set across your control plane.

The **v1.25** release that's planned for next year will stop serving beta versions of
several Kubernetes APIs that are stable right now and have been for some time.
The same v1.25 release will **remove** PodSecurityPolicy, which is deprecated and won't
graduate to stable. See
[PodSecurityPolicy Deprecation: Past, Present, and Future](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/)
for more information.

The official [list of API removals](/docs/reference/using-api/deprecation-guide/#v1-25)
planned for Kubernetes 1.25 is:

* The beta `CronJob` API (**batch/v1beta1**)
* The beta `EndpointSlice` API (**networking.k8s.io/v1beta1**)
* The beta `PodDisruptionBudget` API (**policy/v1beta1**)
* The beta `PodSecurityPolicy` API (**policy/v1beta1**)

## Want to know more?

Deprecations are announced in the Kubernetes release notes. You can see the announcements
of pending deprecations in the release notes for
[1.19](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.19.md#deprecations),
[1.20](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.20.md#deprecation),
and [1.21](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.21.md#deprecation).

For information on the process of deprecation and removal, check out the official Kubernetes
[deprecation policy](/docs/reference/using-api/deprecation-policy/#deprecating-parts-of-the-api)
document.
