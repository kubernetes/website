---
title: Container Lifecycle Hooks
id: container-lifecycle-hooks
date: 2018-10-08
full_link: fr/docs/concepts/containers/container-lifecycle-hooks/
short_description: >
  Les hooks (ou déclencheurs) du cycle de vie exposent les événements du cycle de vie de la gestion du conteneur et permettent à l'utilisateur d'exécuter le code lorsque les événements se produisent.

aka:
tags:
- extension
---
  Les hooks (ou déclencheurs) du cycle de vie exposent les événements du cycle de vie de la gestion du {{< glossary_tooltip text="conteneur" term_id="container" >}} et permettent à l'utilisateur d'exécuter le code lorsque les événements se produisent

<!--more-->

Deux hooks (ou déclencheurs) sont exposés aux conteneurs : PostStart qui s'exécute immédiatement après la création d'un conteneur et PreStop qui est appelé immédiatement avant qu'un conteneur soit terminé.
