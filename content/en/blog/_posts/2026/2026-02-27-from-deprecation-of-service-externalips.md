---
layout: blog
title: "Deprecation and removal of Service ExternalIPs"
draft: true # will be changed to date: YYYY-MM-DD before publication
slug: deprecaton-and-removal-of-service-externalips # optional
author: >
  Dan Winship (Red Hat),
  Adrian Moisey (Independant),
---

The externalIPs field in the Service resource enables cluster administrators to expose workloads
by routing traffic through IP addresses that exist outside the Kubernetes cluster itself.

This ability could be musused as a way for an otherwise unprivileged user to intercept traffic associated with that IP address.

See [CVE-2020-8554](https://www.cvedetails.com/cve/CVE-2020-8554/) for more details.

Due to the insecure nature of this feature, the Kubernetes maintainers have decided to deprecate and remove this feature in upcoming Kubernetes releases.

<Include a timeline here?>
