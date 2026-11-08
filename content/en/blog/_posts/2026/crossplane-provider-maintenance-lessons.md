---
layout: blog
title: "Maintaining a Crossplane provider for a Kubernetes cloud: lessons from provider-civo"
draft: true
slug: crossplane-provider-maintenance-lessons
author: >
  Uzair Ali (crossplane-contrib/provider-civo maintainer)
---

## Overview (placeholder draft - full article in preparation)

This article shares practical lessons from maintaining the Crossplane provider for Civo (crossplane-contrib/provider-civo), a Kubernetes cloud provider, as a community maintainer since early 2024.

Planned coverage:

- How a Crossplane provider for a public cloud is structured and generated (Upjet-based generation from the Terraform provider, CRD lifecycle, versioning against a live cloud API).
- The maintenance reality: reviewing external contributions, cutting releases, and handling breaking changes in the underlying cloud API without disrupting users' control planes.
- Where providers fit in the wider Kubernetes control-plane ecosystem: Crossplane compositions, and what new contributors should know before their first PR.
