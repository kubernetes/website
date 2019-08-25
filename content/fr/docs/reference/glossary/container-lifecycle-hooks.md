---
title: Container Lifecycle Hooks
id: container-lifecycle-hooks
date: 2018-10-08
full_link: /docs/concepts/containers/container-lifecycle-hooks/
short_description: >
  Les lifecycle hooks exposent les événements concernant la gestion du cycle de vie des conteneurs et permettent à l'utilisateur d'exécuter le code lorsque les événements se produisent.

aka:
tags:
- extension
---
  Les lifecycle hooks exposent les événements concernant la gestion du cycle de vie des {{< glossary_tooltip text="Conteneurs" term_id="container" >}} et permettent à l'utilisateur d'exécuter le code lorsque les événements se produisent.

<!--more-->

Deux hooks sont exposés aux conteneurs : PostStart qui s'exécute immédiatement après la création d'un conteneur et PreStop qui est appelé immédiatement avant qu'un conteneur soit clôturé.
