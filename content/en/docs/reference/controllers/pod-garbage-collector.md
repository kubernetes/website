---
title: Pod garbage collector
content_template: templates/concept
---

{{% capture overview %}}

The Pod garbage collector handles cleanup of
terminated {{< glossary_tooltip text="Pods" term_id="pod" >}}.

{{% /capture %}}

{{% capture body %}}

## Controller behaviour

This controller takes care of cleaning up Pods that are terminated, so
that the resources for tracking those Pods can be reclaimed.

The controller tracks the number of Pods eligible for cleanup and activates
onces that number passes a defined threshold. This controller only ever removes Pods
that are already terminated.

{{% /capture %}}
