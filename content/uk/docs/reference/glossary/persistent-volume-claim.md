---
title: Persistent Volume Claim
id: persistent-volume-claim
full_link: /docs/concepts/storage/persistent-volumes/#persistentvolumeclaims
short_description: >
  Запит на використання ресурсів зберігання, визначених у PersistentVolume, щоб змонтувати це сховище як том у контейнері.

aka:
tags:
- core-object
- storage
---

Запит на використання {{< glossary_tooltip text="ресурсів" term_id="infrastructure-resource" >}} зберігання, визначених у {{< glossary_tooltip text="PersistentVolume" term_id="persistent-volume" >}}, щоб змонтувати це сховище як том у {{< glossary_tooltip text="контейнері" term_id="container" >}}.

<!--more-->

Визначає обсяг сховища, спосіб доступу до нього (тільки для читання, для читання та запису та/або виключний доступ) і спосіб його повторного використання (зберегти, очистити або видалити). Деталі щодо самого сховища описані в обʼєкті PersistentVolume.
