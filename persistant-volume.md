
---
title: Volume Persistente
id: persistent-volume
date: 2018-04-12
full_link: /docs/concepts/storage/persistent-volumes/
short_description: >
  Um objeto API que representa uma parte de armazenamento no cluster. Ele está disponível como um recurso geral, plugável que persiste além do ciclo de vida de qualquer Pod indivíduo.

aka: 
tags:
- core-object
- storage
---
Um objeto API que representa uma parte de armazenamento no cluster. Ele está disponível como um recurso geral, plugável que persiste além do ciclo de vida de qualquer {{< glossary_tooltip text="Pod" term_id="pod" >}} indivíduo.

<!--more--> 

Os volumes persistentes (PersistentVolumes, PVs) fornecem uma API que abstrai os detalhes de como o armazenamento é fornecido do modo como é consumido.
Os PVs são usados diretamente em cenários em que o armazenamento pode ser criado antecipadamente (provisão estática).
Para cenários que exigem armazenamento sob demanda (provisão dinâmica), são usadas as reivindicações de volumes persistentes (PersistentVolumeClaims, PVCs) em vez disso.
