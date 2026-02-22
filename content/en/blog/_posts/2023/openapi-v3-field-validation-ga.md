---
layout: blog
title: "Kubernetes 1.27: Server Side Field Validation and OpenAPI V3 move to GA"
date: 2023-04-24
slug: openapi-v3-field-validation-ga
author: >
   Jeffrey Ying (Google),
   Antoine Pelisse (Google)
---

Before Kubernetes v1.8 (!), typos, mis-indentations or minor errors in
YAMLs could have catastrophic consequences (e.g. a typo like
forgetting the trailing s in `replica: 1000` could cause an outage,
because the value would be ignored and missing, forcing a reset of
replicas back to 1). This was solved back then by fetching the OpenAPI
v2 in kubectl and using it to verify that fields were correct and
present before applying. Unfortunately, at that time, Custom Resource
Definitions didn’t exist, and the code was written under that
assumption. When CRDs were later introduced, the lack of flexibility
in the validation code forced some hard decisions in the way CRDs
exposed their schema, leaving us in a cycle of bad validation causing
bad OpenAPI and vice-versa. With the new OpenAPI v3 and Server Field
Validation being GA in 1.27, we’ve now solved both of these problems.

Server Side Field Validation offers resource validation on create,
update and patch requests to the apiserver and was added to Kubernetes
in v1.25, beta in v1.26 and is now GA in v1.27. It provides all the
functionality of kubectl validate on the server side.

[OpenAPI](https://swagger.io/specification/) is a standard, language
agnostic interface for discovering the set of operations and types
that a Kubernetes cluster supports. OpenAPI V3 is the latest standard
of the OpenAPI and is an improvement upon [OpenAPI
V2](https://kubernetes.io/blog/2016/12/kubernetes-supports-openapi/)
which has been supported since Kubernetes 1.5. OpenAPI V3 support was
added in Kubernetes in v1.23, moved to beta in v1.24 and is now GA in
v1.27.

## OpenAPI V3

### What does OpenAPI V3 offer over V2

#### Built-in types

Kubernetes offers certain annotations on fields that are not
representable in OpenAPI V2, or sometimes not represented in the
OpenAPI v2 that Kubernetes generate. Most notably, the "default" field
is published in OpenAPI V3 while omitted in OpenAPI V2. A single type
that can represent multiple types is also expressed correctly in
OpenAPI V3 with the oneOf field. This includes proper representations
for IntOrString and Quantity.

#### Custom Resource Definitions

In Kubernetes, Custom Resource Definitions use a structural OpenAPI V3
schema that cannot be represented as OpenAPI V2 without a loss of
certain fields. Some of these include nullable, default, anyOf, oneOf,
not, etc. OpenAPI V3 is a completely lossless representation of the
CustomResourceDefinition structural schema.

### How do I use it?

The OpenAPI V3 root discovery can be found at the `/openapi/v3`
endpoint of a Kubernetes API server. OpenAPI V3 documents are grouped
by group-version to reduce the size of the data transported, the
separate documents can be accessed at
`/openapi/v3/apis/<group>/<version>` and `/openapi/v3/api/v1`
representing the legacy group version. Please refer to the [Kubernetes
API Documentation](/docs/concepts/overview/kubernetes-api/) for more
information around this endpoint.

Various consumers of the OpenAPI have already been updated to consume
v3, including the entirety of kubectl, and server side apply. An
OpenAPI V3 Golang client is available in
[client-go](https://github.com/kubernetes/client-go/blob/release-1.27/openapi3/root.go).

## Server Side Field Validation

The query parameter `fieldValidation` may be used to indicate the
level of field validation the server should perform. If the parameter
is not passed, server side field validation is in `Warn` mode by
default.

- Strict: Strict field validation, errors on validation failure
- Warn: Field validation is performed, but errors are exposed as
  warnings rather than failing the request
- Ignore: No server side field validation is performed

kubectl will skip client side validation and will automatically use
server side field validation in `Strict` mode. Controllers by default
use server side field validation in `Warn` mode.

With client side validation, we had to be extra lenient because some
fields were missing from OpenAPI V2 and we didn’t want to reject
possibly valid objects. This is all fixed in server side validation.
Additional documentation may be found
[here](/docs/reference/using-api/api-concepts/#field-validation)

## What's next?

With Server Side Field Validation and OpenAPI V3 released as GA, we
introduce more accurate representations of Kubernetes resources. It is
recommended to use server side field validation over client side, but
with OpenAPI V3, clients are free to implement their own validation if
necessary (to “shift things left”) and we guarantee a full lossless
schema published by OpenAPI.

Some existing efforts will further improve the information available
through OpenAPI including [CEL validation and
admission](/docs/reference/using-api/cel/), along with OpenAPI
annotations on built-in types.

Many other tools can be built for authoring and transforming resources
using the type information found in the OpenAPI v3.

## How to get involved?

These two features are driven by the SIG API Machinery community,
available on the slack channel \#sig-api-machinery, through the
[mailing
list](https://groups.google.com/g/kubernetes-sig-api-machinery) and we
meet every other Wednesday at 11:00 AM PT on Zoom.

We offer a huge thanks to all the contributors who helped design,
implement, and review these two features.

- Alexander Zielenski
- Antoine Pelisse
- Daniel Smith
- David Eads
- Jeffrey Ying
- Jordan Liggitt
- Kevin Delgado
- Sean Sullivan
