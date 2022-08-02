---
title: Secret
id: secret
date: 2022-07-30
full_link:
short_description: >
  Contiene informazioni sensibili, come passwords, token OAuth, e chiavi ssh.

aka: 
tags:
- core-object
- security
---
 Contiene informazioni sensibili, come passwords, token OAuth, e chiavi ssh.

<!--more--> 

Permette un maggiore controllo su come vengono usate le informazioni sensibili e riduce il rischio di un'esposizione accidentale. I valori del Secret sono codificati in base64 e esso viene memorizzato non criptato di default, ma può essere configurato per essere [criptato](/docs/tasks/administer-cluster/encrypt-data/#ensure-all-secrets-are-encrypted). Un {{< glossary_tooltip text="Pod" term_id="pod" >}} fa riferimento al Secret come un file in un volume montato o by the kubelet pulling images for a pod. I Secrets sono ideali per i dati sensibili e le [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/) per i dati non sensibili.
