---
title: API resource
id: api-resource
date: 2025-02-09
full_link: /docs/reference/using-api/api-concepts/#standard-api-terminology
short_description: >
  A Kubernetes entity, representing an endpoint on the Kubernetes API server.

aka:
 - Resource
tags:
- architecture
---
An entity in the Kubernetes type system, corresponding to an endpoint on the {{< glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" >}}.
A resource typically represents an {{< glossary_tooltip text="object" term_id="object" >}}.
Some resources represent an operation on other objects, such as a permission check.
<!--more-->
Each resource represents an HTTP endpoint (URI) on the Kubernetes API server, defining the schema for the objects or operations on that resource.
