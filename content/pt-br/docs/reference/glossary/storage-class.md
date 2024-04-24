---
title: Classe de Armazenamento
id: storageclass
date: 2018-04-12
full_link: /docs/concepts/storage/storage-classes
short_description: >
  Uma Classe de Armazenamento oferece uma maneira para os administradores descreverem diferentes tipos de armazenamento disponíveis.

aka: 
tags:
- core-object
- storage
---
 Uma classe de Armazenamento oferece uma maneira para os administradores descreverem diferentes tipos de armazenamento disponíveis.

<!--more-->

Classes de Armazenamento podem mapear para níveis de qualidade de serviço, políticas de backup, ou políticas arbitrárias determinadas por administradores do cluster. Cada objeto StorageClass contém os campos `provisioner`, `parameters`, e `reclaimPolicy`, que são usados quando um {{< glossary_tooltip text="Volume Persistente" term_id="persistent-volume" >}} pertencente à classe precisa ser provisionada dinamicamente. Usuários podem solicitar uma classe específica usando o nome de um objeto StorageClass.
