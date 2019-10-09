---
title: App Container
id: app-container
date: 2019-02-12
full_link:
short_description: >
  Un conteneur utilisé pour exécuter une partie d'une charge de travail, comparable à un init conteneur.

aka:
tags:
- workload
---
 Les conteneurs d'application (ou conteneurs app) sont les {{< glossary_tooltip text="containers" term_id="container" >}} dans un {{< glossary_tooltip text="pod" term_id="pod" >}} qui sont lancés après que les {{< glossary_tooltip text="init containers" term_id="init-container" >}} soient terminés.

<!--more-->

Un conteneur d'initialisation vous permet de séparer les détails d'initialisation importants pour l'ensemble du workload {{< glossary_tooltip text="workload" term_id="workload" >}}, et qui n'ont pas besoin de continuer à fonctionner une fois que le conteneur d'application est démarré.
Si un pod n'a pas d'init conteneurs configurés, tous les conteneurs de ce pod sont des conteneurs d'application.
