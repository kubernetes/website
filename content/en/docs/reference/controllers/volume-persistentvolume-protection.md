---
toc_hide: true
title: PersistentVolume in-use protection controller
content_template: templates/concept
---

{{% capture overview %}}

The {{< glossary_tooltip text="PersistentVolume" term_id="persistent-volume-claim" >}}
protection {{< glossary_tooltip text="controller" term_id="controller" >}} is
part of a set of built-in controllers for storage management.

{{% /capture %}}

{{% capture body %}}

## Controller behavior

The PersistentVolume (PV) protection controller watches for PersistentVolumes
and Pods. This controller acts as a backstop for the related
[admission controller](/docs/reference/access-authn-authz/admission-controllers/#storageobjectinuseprotection)
and makes sure that all PVs have a finalizer set. The finalizer is there to block PV
deletion for any PV that's used by a running Pod.

When a PV becomes a candidate for deletion, the PV protection controller
checks if the PV is still in use. If the PV is still in use then the finalizer
stays in place. If / when the PV stops being used, this controller removes
the storage object in-use protection finalizer, so that the PV can be deleted.

{{% /capture %}}
{{% capture whatsnext %}}
* Read about [storage object in-use protection](/docs/concepts/storage/persistent-volumes/#storage-object-in-use-protection)
* Read about other [storage controllers](/docs/reference/controllers/storage-controllers/)
{{% /capture %}}
