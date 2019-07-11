---
title: Storage controllers
content_template: templates/concept
weight: 60
---

{{% capture overview %}}

This page lists the built-in
{{< glossary_tooltip text="controllers" term_id="controller" >}}
for storage management, that come as part of Kubernetes itself.

{{% /capture %}}

{{% capture body %}}

## PersistentVolume controller

The [PersistentVolume controller](/docs/reference/controllers/volume-persistentvolume/)
controller ensures, where possible, that each PersistentVolumeClaim
is [bound](/docs/concepts/storage/persistent-volumes/#binding)
to a suitable PersistentVolume. This can include provisioning a new PersistentVolume,
with help from other components such as a {{< glossary_tooltip text="CSI" term_id="csi" >}}
driver.

## PersistentVolume in-use protection controller

The [PersistentVolume protection controller](/docs/reference/controllers/volume-persistentvolume-protection/)
acts as a backstop for the related
[admission controller](/docs/reference/access-authn-authz/admission-controllers/#storageobjectinuseprotection)
and makes sure that all PersistentVolumes have a finalizer set.

## PersistentVolumeClaim in-use protection controller

The [PersistentVolumeClaim protection controller](/docs/reference/controllers/volume-persistentvolumeclaim-protection/)
also acts as a backstop for the related
[admission controller](/docs/reference/access-authn-authz/admission-controllers/#storageobjectinuseprotection)
and makes sure that all PersistentVolumes have a finalizer set.

## Volume attach / detach controller

The [Volume attach / detach controller](/docs/reference/controllers/volume-attach-detach/)
is responsible for attaching and detaching all Volumes across a cluster.

{{% /capture %}}

{{% capture whatsnext %}}
* Read about [networking controllers](/docs/reference/controllers/network-controllers/)
{{% /capture %}}
