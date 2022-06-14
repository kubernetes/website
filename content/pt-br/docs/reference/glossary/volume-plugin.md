---
title: Plugin de Volume
id: volumeplugin
date: 2018-04-12
full_link: 
short_description: >
  Um plugin de volume permite a integração do armazenamento dentro de um Pod.

aka: 
tags:
- core-object
- storage
---
 Um plugin de volume permite a integração do armazenamento dentro de um {{< glossary_tooltip text="Pod" term_id="pod" >}}.

<!--more--> 

Um plugin de volume permite anexar e montar volumes de armazenamento para uso por um {{< glossary_tooltip text="Pod" term_id="pod" >}}. Os plugins de volume podem estar _dentro_ ou _fora da árvore_. _Na árvore_, os plugins fazem parte do repositório de código Kubernetes e seguem seu ciclo de lançamento. Os plugins _fora da árvore_ são desenvolvidos de forma independente.