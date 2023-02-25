---
title: Secret
id: secret
date: 2021-08-24
full_link: /pt-br/docs/concepts/configuration/secret/
short_description: >
  Armazena dados sensíveis, como senhas, tokens OAuth e chaves SSH.

aka: 
tags:
- core-object
- security
---
 Armazena dados sensíveis, como senhas, tokens OAuth e chaves SSH.

<!--more--> 

Permite mais controle com relação a como as informações sensíveis são armazenadas e reduz o risco de exposição acidental. Os valores dos Secrets são codificados como strings no formato base64, mas não encriptados por padrão. É possível configurar o cluster para realizar a [encriptação em disco](/docs/tasks/administer-cluster/encrypt-data/#ensure-all-secrets-are-encrypted) de Secrets. Um {{< glossary_tooltip text="Pod" term_id="pod" >}} pode referenciar o Secret como um arquivo em um volume montado, ou o kubelet pode usar este dado quando baixa imagens para um pod. Secrets são úteis para dados confidenciais, enquanto [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/) são úteis para dados não-confidenciais.
