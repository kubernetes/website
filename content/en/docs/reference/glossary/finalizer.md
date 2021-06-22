---
title: Finalizer
id: finalizer
date: 2021-07-07
full_link: /docs/concepts/overview/working-with-objects/finalizers/
short_description: >
  A finalizer is a resource key that specifies what actions to take before
  deleting specific resources.

aka: 
tags:
- fundamental
- operation
---
A resource key that specifies what actions to take before deleting specific resources.

<!--more-->

Finalizers exist as lists in the `metadata.finalizers` field of a resource
definition and specify what a {{<glossary_tooltip text="controller" term_id="controller">}}
must do before it can delete the resource.