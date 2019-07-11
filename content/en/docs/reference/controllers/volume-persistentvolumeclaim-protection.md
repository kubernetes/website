---
title: PVC in-use protection controller
content_template: templates/concept
---

{{% capture overview %}}

The {{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}}
protection controller is part of a set of built-in controllers for storage management.

{{% /capture %}}

{{% capture body %}}

## Controller behavior

The PVC protection controller watches for PersistentVolumeClaims and Pods. The
controller acts as a backstop for the related
[admission controller](/docs/reference/access-authn-authz/admission-controllers/#storageobjectinuseprotection)
and makes sure that all PVCs have a finalizer set. The finalizer is there to block PVC
deletion for any PVC that's used by a running Pod.

When a PVC becomes a candidate for deletion, the PVC protection controller
checks if the PVC is still in use. If the PVC is still in use then the finalizer
stays in place. If / when the PVC stops being used, this controller removes
the storage object in-use protection finalizer, so that the PVC can be deleted.

{{% /capture %}}
{{% capture whatsnext %}}
* Read about [storage object in-use protection](/docs/concepts/storage/persistent-volumes/#storage-object-in-use-protection)
{{% /capture %}}
