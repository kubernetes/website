---
title: Secret
id: secret
date: 2018-04-12
full_link: /docs/concepts/configuration/secret/
short_description: >
  Хранит конфиденциальную информацию, такую как пароли, токены OAuth и ключи ssh.

aka: 
tags:
- core-object
- security
---
 Хранит конфиденциальную информацию, такую как пароли, токены OAuth и ключи ssh.

<!--more--> 

Позволяет повысить контроль над использованием конфиденциальной информации и снизить риск ее случайного раскрытия. Секретные значения кодируются в формат base64 и по умолчанию хранятся в незашифрованном виде, но могут быть настроены на шифрование "at rest" (при записи в хранилище). {{< glossary_tooltip text="Pod" term_id="pod" >}} ссылается на Secret как на файл при монтировании тома. Secret также используется kubelet'ом при извлечении образов для Pod'а. Secret'ы отлично подходят для хранения конфиденциальных данных, [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/) – для неконфиденциальных.
