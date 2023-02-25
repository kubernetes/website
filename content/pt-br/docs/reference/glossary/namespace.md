---
title: Namespace
id: namespace
date: 2021-09-17
full_link: /docs/concepts/overview/working-with-objects/namespaces
short_description: >
  Uma abstração utilizada pelo Kubernetes para suportar múltiplos clusters virtuais no mesmo cluster físico.

aka: 
tags:
- fundamental
---
 Uma abstração utilizada pelo Kubernetes para suportar múltiplos clusters virtuais no mesmo {{< glossary_tooltip text="cluster" term_id="cluster" >}} físico.

<!--more--> 

Namespaces são utilizados para organizar objetos em um cluster e oferecer uma forma de separar os recursos do cluster. Os nomes dos recursos precisam ser únicos dentro de um namespace,
mas não entre todos os namespaces existentes.
