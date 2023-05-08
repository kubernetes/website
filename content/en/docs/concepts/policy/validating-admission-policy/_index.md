---
title: Policy with ValidatingAdmissionPolicy
content_type: concept
weight: 30
description: Validating admission policies allow configurable checks in the API server using the Common Expression Language (CEL). For example, a ValidatingAdmissionPolicy can be used to disallow use of the latest image tag.
---

Validating admission policies allow configurable validation checks to be executed in the API server using the Common Expression Language (CEL). For example, a `ValidatingAdmissionPolicy` can be used to disallow use of the `latest` image tag.

A `ValidatingAdmissionPolicy` operates on an API request and can be used to block, audit, and warn users about non-compliant configurations.

Details on the `ValidatingAdmissionPolicy`, with examples, are documented in a dedicated section:
* [Validating Admission Policy](/docs/reference/access-authn-authz/validating-admission-policy/)
