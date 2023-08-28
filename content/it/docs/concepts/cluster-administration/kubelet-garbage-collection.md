---
draft: True
title: Configurazione della raccolta dati kubelet
content_type: concept
weight: 70
---

<!-- overview -->
La garbage collection è una funzione utile di kubelet che pulisce le immagini inutilizzate e i contenitori inutilizzati.
Kubelet eseguirà la raccolta dei rifiuti per i contenitori ogni minuto e la raccolta dei dati inutili per le immagini
ogni cinque minuti.

Gli strumenti di garbage collection esterni non sono raccomandati in quanto questi strumenti possono potenzialmente
interrompere il comportamento di kubelet rimuovendo i contenitori che si prevede esistano.



<!-- body -->

## Image Collection

Kubernetes gestisce il ciclo di vita di tutte le immagini tramite imageManager, con la collaborazione
di consulente.

La politica per la raccolta dei rifiuti delle immagini prende in considerazione due fattori:
`HighThresholdPercent` e `LowThresholdPercent`. Utilizzo del disco al di sopra della soglia alta
attiverà la garbage collection. La garbage collection cancellerà le immagini utilizzate meno di recente fino al minimo
soglia è stata soddisfatta.

La politica per la raccolta dei rifiuti delle immagini prende in considerazione due fattori:
`HighThresholdPercent` e `LowThresholdPercent`. Utilizzo del disco al di sopra della soglia alta
attiverà la garbage collection. La garbage collection cancellerà le immagini utilizzate meno di recente fino al minimo
soglia è stata soddisfatta.

## Container Collection

La politica per i contenitori di garbage collection considera tre variabili definite dall'utente. `MinAge` è l'età minima
in cui un contenitore può essere raccolto dalla spazzatura. `MaxPerPodContainer` è il numero massimo di contenitori morti
ogni singolo la coppia pod (UID, nome contenitore) può avere. `MaxContainers` è il numero massimo di contenitori morti
totali. Queste variabili possono essere disabilitate individualmente impostando `MinAge` a zero e impostando `MaxPerPodContainer`
e `MaxContainers` rispettivamente a meno di zero.

Kubelet agirà su contenitori non identificati, cancellati o al di fuori dei limiti impostati dalle bandiere
precedentemente menzionate. I contenitori più vecchi saranno generalmente rimossi per primi. `MaxPerPodContainer`
e `MaxContainer` possono potenzialmente entrare in conflitto l'uno con l'altro in situazioni in cui il mantenimento del
numero massimo di contenitori per pod (`MaxPerPodContainer`) non rientra nell'intervallo consentito di contenitori morti
globali (`MaxContainers`). `MaxPerPodContainer` verrebbe regolato in questa situazione: uno scenario peggiore sarebbe
quello di eseguire il downgrade di `MaxPerPodContainer` su 1 e rimuovere i contenitori più vecchi. Inoltre, i
contenitori di proprietà dei pod che sono stati cancellati vengono rimossi una volta che sono più vecchi di "MinAge".

I contenitori che non sono gestiti da Kubelet non sono soggetti alla garbage collection del contenitore.

## User Configuration

Gli utenti possono regolare le seguenti soglie per ottimizzare la garbage collection delle immagini con i seguenti flag kubelet:

1. `image-gc-high-threshold`, la percentuale di utilizzo del disco che attiva la garbage collection dell'immagine.
Il valore predefinito è 85%.
2. `image-gc-low-threshold`, la percentuale di utilizzo del disco su cui tenta la garbage collection dell'immagine
liberare. Il valore predefinito è 80%.

Permettiamo anche agli utenti di personalizzare la politica di raccolta dei rifiuti attraverso i seguenti flag kubelet:

1. `minimum-container-ttl-duration`, l'età minima per un container finito prima che sia
raccolta dei rifiuti L'impostazione predefinita è 0 minuti, il che significa che ogni contenitore finito verrà raccolto.
2. `maximum-dead-containers-per-container`, numero massimo di vecchie istanze da conservare
per contenitore Il valore predefinito è 1.
3. `maximum-dead-containers`, numero massimo di vecchie istanze di container da conservare globalmente.
Il valore predefinito è -1, il che significa che non esiste un limite globale.

I contenitori possono potenzialmente essere raccolti prima che la loro utilità sia scaduta. Questi contenitori
può contenere log e altri dati che possono essere utili per la risoluzione dei problemi. Un valore sufficientemente grande per
`maximum-dead-containers-per-container` è altamente raccomandato per consentire almeno un contenitore morto
mantenuto per contenitore previsto. Un valore più grande per "massimo-dead-containers" è anche raccomandato per a
motivo simile. Vedi [questo problema](https://github.com/kubernetes/kubernetes/issues/13287) per maggiori dettagli.


## Deprecation

Alcune funzionalità di raccolta dei rifiuti di Kubelet in questo documento verranno sostituite da sfratti di Kubelet in futuro.

Compreso:

| Bandiera esistente | Nuova bandiera | Motivazione
| ------------- | -------- | --------- |
| `--image-gc-high-threshold` | `--eviction-hard` o `--eviction-soft` | i segnali di sfratto esistenti possono innescare la garbage collection delle immagini |
| `--image-gc-low-threshold` | `--eviction-minimum-reclaim` | i reclami di sfratto ottengono lo stesso comportamento |
| `--maximum-dead-containers` | | deprecato una volta che i vecchi log sono memorizzati al di fuori del contesto del contenitore |
| `--maximum-dead-containers-per-container` | | deprecato una volta che i vecchi log sono memorizzati al di fuori del contesto del contenitore |
| `--minimum-container-ttl-duration` | | deprecato una volta che i vecchi log sono memorizzati al di fuori del contesto del contenitore |
| `--low-diskspace-threshold-mb` | `--eviction-hard` o `eviction-soft` | lo sfratto generalizza le soglie del disco ad altre risorse |
| `--outofdisk-transition-frequency` | `--eviction-pressure-transition-period` | lo sfratto generalizza la transizione della pressione del disco verso altre risorse |



## {{% heading "whatsnext" %}}


Vedi [Configurazione della gestione delle risorse esterne](/docs/tasks/administration-cluster/out-of-resource/) per maggiori dettagli.


