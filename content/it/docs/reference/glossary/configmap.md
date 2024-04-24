---
title: ConfigMap
id: configmap
date: 2022-06-21
full_link: /it/docs/concepts/configuration/configmap/
short_description: >
  Un oggetto API usato per memorizzare dati non riservati in coppie chiave-valore. Può essere utilizzato come variabili d'ambiente, argomenti da riga di comanto, o files di configurazione in un volume.

aka: 
tags:
- core-object
---
Un oggetto API usato per memorizzare dati non riservati in coppie chiave-valore. I {{< glossary_tooltip text="Pods" term_id="pod" >}} possono utilizzare le ConfigMaps come variabili d'ambiente, argomenti da riga di comando, o come files di configurazione all'interno di un {{< glossary_tooltip text="Volume" term_id="volume" >}}.

<!--more--> 

La ConfigMap ti permette di disaccoppiare le configurazioni specifiche per ambiente dalle {{< glossary_tooltip text="immagini del container" term_id="image" >}}, cosicchè le tue applicazioni siano facilmente portabili.