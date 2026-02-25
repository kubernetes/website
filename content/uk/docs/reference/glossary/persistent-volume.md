---
title: Persistent Volume
id: persistent-volume
full_link: /docs/concepts/storage/persistent-volumes/
short_description: >
  Обʼєкт API, який являє собою частину системи зберігання в кластері.

aka:
tags:
- core-object
- storage
---

Обʼєкт API, що представляє частину сховища в кластері. Представлений як загальний, підʼєднуваний {{< glossary_tooltip text="ресурс" term_id="infrastructure-resource" >}} сховища, яке може зберігатися після закінчення життєвого циклу будь-якого окремого {{< glossary_tooltip text="Podʼа" term_id="pod" >}}.

<!--more-->

PersistentVolumes (PVs) надають API, який абстрагує деталі того, як забезпечується зберігання від того, як воно використовується. PVs використовуються безпосередньо в сценаріях, де сховище може бути створено заздалегідь (статичне розподілення). Для сценаріїв, які вимагають сховища на вимогу (динамічне розподілення), замість цього використовуються PersistentVolumeClaims (PVCs).
