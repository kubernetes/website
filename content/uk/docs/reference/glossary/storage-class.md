---
title: Storage Class
id: storageclass
full_link: /docs/concepts/storage/storage-classes
short_description: >
  StorageClass надає можливість адміністраторам описати різні доступні типи сховищ.

aka:
- Клас сховища
tags:
- core-object
- storage
---

StorageClass надає можливість адміністраторам описати різні доступні типи сховищ.

<!--more-->

Класи сховища можуть відповідати рівням якості обслуговування, політикам резервного копіювання або довільним політикам, визначеним адміністраторами кластера. Кожен клас сховища містить поля `provisioner`, `parameters` та `reclaimPolicy`, які використовуються, коли потрібно динамічно виділити {{< glossary_tooltip text="Persistent Volume" term_id="persistent-volume" >}}, що належить класу. Користувачі можуть запитувати певний клас, використовуючи назву обʼєкта StorageClass.
