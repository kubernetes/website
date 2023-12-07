---
title: Requisição de Volume Persistente
id: persistent-volume-claim
date: 2018-04-12
full_link: /pt-br/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims
short_description: >
  Declara recursos de armazenamento definidos em um PersistentVolume para que possa ser montado como um volume em um contêiner.

aka: 
tags:
- core-object
- storage
---
 Declara recursos de armazenamento definidos em um {{< glossary_tooltip text="PersistentVolume" term_id="persistent-volume" >}} para que possa ser montado como um volume em um {{< glossary_tooltip text="contêiner" term_id="container" >}}.
<!--more--> 

Especifica a quantidade de armazenamento, como o armazenamento será acessado (somente leitura, leitura/gravação e/ou exclusivo) e como será recuperado (retido, reciclado ou excluído). Os detalhes do armazenamento propriamente dito são descritos no objeto PersistentVolume.
