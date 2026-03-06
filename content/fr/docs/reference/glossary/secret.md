---
title: Secret
id: secret
full_link: /docs/concepts/configuration/secret/
short_description: >
  Stocke des informations sensibles, telles que des mots de passe, des tokens OAuth et des clés SSH.

aka:
tags:
- core-object
- security
---
 Stocke des informations sensibles, telles que des mots de passe, des tokens OAuth et des clés SSH.

<!--more-->

Les Secrets vous donnent plus de contrôle sur la façon dont les informations sensibles sont utilisées et réduisent le risque d'exposition accidentelle. Les valeurs des Secrets sont encodées sous forme de chaînes base64 et sont stockées non chiffrées par défaut, mais peuvent être configurées pour être [chiffrées au repos](/docs/tasks/administer-cluster/encrypt-data/#ensure-all-secrets-are-encrypted).

Un {{< glossary_tooltip text="Pod" term_id="pod" >}} peut faire référence au Secret de diverses manières, par exemple via un montage de volume ou comme variable d'environnement. Les Secrets sont conçus pour les données confidentielles et les [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/) sont conçus pour les données non confidentielles.
