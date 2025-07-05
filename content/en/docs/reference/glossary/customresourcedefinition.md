---
title: CustomResourceDefinition
id: CustomResourceDefinition
date: 2018-04-12
full_link: /docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/
short_description: >
  Custom code that defines a resource to add to your Kubernetes API server without building a complete custom server.

aka: 
tags:
- fundamental
- operation
- extension
---
A kind of {{< glossary_tooltip text="API object" term_id="object" >}} that defines a new custom API to add
to your Kubernetes API server, without building a complete custom server.

<!--more-->

CustomResourceDefinitions let you extend the Kubernetes API for your environment if the built-in
{{< glossary_tooltip text="API resources" term_id="api-resource" >}} can't meet your needs.
