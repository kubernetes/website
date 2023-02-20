---
title: Volume Persistente
id: persistent-volume
date: 2018-04-12
full_link: /pt-br/docs/concepts/storage/persistent-volumes/
short_description: >
  Um objeto de API que representa uma parte do armazenamento no cluster. Disponível como um recurso geral e conectável que persiste além do ciclo de vida de qualquer pod individual.

aka: 
tags:
- core-object
- storage
---
 Um objeto de API que representa uma parte do armazenamento no cluster. Disponível como um recurso geral e conectável que persiste além do ciclo de vida de qualquer {{< glossary_tooltip text="Pod" term_id="pod" >}} individual.

<!--more--> 

PersistentVolumes (PVs) fornecem uma API que abstrai detalhes de como o armazenamento é fornecido a partir de como ele é consumido.
Os PVs são usados ​​diretamente em cenários onde o armazenamento pode ser criado antecipadamente (provisionamento estático).
Para cenários que exigem armazenamento sob demanda (provisionamento dinâmico), PersistentVolumeClaims (PVCs) são usados.

