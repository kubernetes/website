---
toc_hide: true
title: PersistentVolume controller
content_template: templates/concept
---

{{% capture overview %}}

The {{< glossary_tooltip text="PersistentVolume" term_id="persistent-volume" >}}
{{< glossary_tooltip text="controller" term_id="controller" >}} is part of a set
of built-in controllers for storage management.

{{% /capture %}}

{{% capture body %}}

```
// ==================================================================
// PLEASE DO NOT ATTEMPT TO SIMPLIFY THIS CODE.
// KEEP THE SPACE SHUTTLE FLYING.
// ==================================================================
```

## Controller behavior

This controller ensures, where possible, that each PersistentVolumeClaim
is [bound](/docs/concepts/storage/persistent-volumes/#binding)
to a suitable PersistentVolume. This can include provisioning a new PersistentVolume,
with help from other components such as a {{< glossary_tooltip text="CSI" term_id="csi" >}}
driver.

When PersistentVolumes become eligible for
[reclamation](/docs/concepts/storage/persistent-volumes/#reclaiming), this
controller takes part in ensuring that the appropriate reclaim action takes place.


{{% /capture %}}
{{% capture whatsnext %}}
* Read the [storage](/docs/concepts/storage/persistent-volumes/) documentation to
  learn about how Kubernetes manages {{< glossary_tooltip text="volumes" term_id="volume" >}} and
  related resources.
* Read about other [storage controllers](/docs/reference/controllers/storage-controllers/)
{{% /capture %}}
