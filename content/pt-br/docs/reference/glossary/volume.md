---
title: Volume
id: volume
date: 2021-08-24
full_link: /docs/concepts/storage/volumes/
short_description: >
  Um diretório contendo dados, accessível aos contêineres em um pod.

aka:
tags:
- core-object
- fundamental
---
 Um diretório contendo dados, accessível aos {{< glossary_tooltip text="contêineres" term_id="container" >}} em um {{< glossary_tooltip term_id="pod" >}}.

<!--more-->

Um volume do Kubernetes existe enquanto o Pod que utiliza ele existir também. Consequentemente, um volume dura mais tempo que qualquer contêiner que rodar em um Pod, e os dados no volume são preservados entre reinicializações do contêiner.

Veja [armazenamento](/docs/concepts/storage/) para mais detalhes.
