---
title: Секрет (Secret)
id: secret
date: 2018-04-12
full_link: /docs/concepts/configuration/secret/
short_description: >
  Хранит конфиденциальную информацию, такую как пароли, токены OAuth и ключи SSH.

aka: 
tags:
- core-object
- security
---
 Хранит конфиденциальную информацию, такую как пароли, токены OAuth и ключи SSH.

<!--more--> 

Позволяет повысить контроль над использованием конфиденциальной информации и снизить риск ее случайного раскрытия. Секретные значения кодируются в формат base64 и по умолчанию хранятся в незашифрованном виде, но могут быть настроены на [шифрование "at rest"](/docs/tasks/administer-cluster/encrypt-data/#ensure-all-secrets-are-encrypted) (при записи в хранилище).

{{< glossary_tooltip text="Под" term_id="pod" >}} ссылается на секрет разными способами — например, при монтировании тома или как переменную окружения. Секреты предназначены для конфиденциальных данных, а для неконфиденциальных данных предусмотрены [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/).
