---
title: Secret
id: secret
date: 2018-04-12
full_link: /docs/concepts/configuration/secret/
short_description: >
  Зберігає конфіденційну інформацію, таку як паролі, токени OAuth та ключі SSH.

aka:
- Секрет
tags:
- core-object
- security
---

Зберігає конфіденційну інформацію, таку як паролі, токени OAuth та ключі SSH.

<!--more-->

Секрети дають вам більше контролю над тим, як використовується конфіденційна інформація і зменшують ризик випадкового її розголошення. Значення Secret кодуються як рядки base64 і зазвичай зберігаються в незашифрованому вигляді, але можуть бути налаштовані для [шифрування в стані покою](/docs/tasks/administer-cluster/encrypt-data/#ensure-all-secrets-are-encrypted).

{{< glossary_tooltip text="Pod" term_id="pod" >}} може посилатися на Secret різними способами, такими як монтування тому, чи як змінна середовища. Secretʼи призначені для конфіденційних даних, а [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/) призначені для неконфіденційних даних.
