---
title: LimitRange
id: limitrange
date: 2019-04-15
full_link:  /docs/concepts/policy/limit-range/
short_description: >
  Provides constraints to limit resource consumption per Containers or Pods in a namespace.

aka: 
tags:
- core-object
- fundamental
- architecture
related:
 - pod
 - container

---
Constraints resource consumption per {{< glossary_tooltip text="container" term_id="container" >}} or {{< glossary_tooltip text="Pod" term_id="pod" >}},
specified for a particular {{< glossary_tooltip text="namespace" term_id="namespace" >}}.

<!--more--> 

A [LimitRange](/docs/concepts/policy/limit-range/) either limits the quantity of {{< glossary_tooltip text="API resources" term_id="api-resource" >}}
that can be created (for a particular resource type),
or the amount of {{< glossary_tooltip text="infrastructure resources" term_id="infrastructure-resource" >}}
that may be requested/consumed by individual containers or Pods within a namespace.