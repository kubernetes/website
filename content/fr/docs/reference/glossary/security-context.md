---
title: SecurityContext
id: security-context
full_link: /docs/tasks/configure-pod-container/security-context/
short_description: >
  Le champ securityContext définit les paramètres de privilèges et de contrôle d'accès pour un Pod ou un conteneur.

aka: 
tags:
- security
---
 Le champ `securityContext` définit les paramètres de privilèges et de contrôle d'accès pour un {{< glossary_tooltip text="Pod" term_id="pod" >}} ou un {{< glossary_tooltip text="conteneur" term_id="container" >}}.

<!--more-->

Dans un `securityContext`, vous pouvez définir : l'utilisateur sous lequel les processus s'exécutent, le groupe sous lequel les processus s'exécutent, ainsi que les paramètres de privilèges.
Vous pouvez également configurer des politiques de sécurité (par exemple : SELinux, AppArmor ou seccomp).

Le paramètre `PodSpec.securityContext` s'applique à tous les conteneurs d'un Pod.
