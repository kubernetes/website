---
title: Persistent Volume
id: persistent-volume
full_link: /docs/concepts/storage/persistent-volumes/
short_description: >
  Обʼєкт API, що представляє частину сховища в кластері.

aka:
tags:
- core-object
- storage
---

Обʼєкт API, що представляє частину сховища в кластері. Представлений як загальний, підʼєднуваний {{< glossary_tooltip text="ресурс" term_id="infrastructure-resource" >}} сховища, який може існувати довше за життєвий цикл будь-якого окремого {{< glossary_tooltip text="Podʼа" term_id="pod" >}}.

<!--more-->

PersistentVolumes (PVs) надають API, який абстрагує деталі того, як забезпечується зберігання, від того, як воно використовується. PVs використовуються безпосередньо в сценаріях, де сховище можна створити заздалегідь (статичне виділення). Для сценаріїв, які потребують сховища на вимогу (динамічне виділення), натомість використовуються PersistentVolumeClaims (PVCs).
