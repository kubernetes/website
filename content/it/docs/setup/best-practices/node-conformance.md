---
reviewers:
- Random-Liu
title: Convalida la configurazione del nodo
weight: 30
---

## Test di Conformità del Nodo

Il *test di conformità del nodo* è un framework di test containerizzato che fornisce una verifica del sistema e un test di funzionalità per un nodo. Il test valida se il nodo soddisfa i requisiti minimi per Kubernetes; un nodo che supera il test è qualificato per unirsi a un cluster Kubernetes.

## Prerequisiti del Nodo

Per eseguire il test di conformità del nodo, un nodo deve soddisfare gli stessi prerequisiti di un nodo Kubernetes standard. Al minimo, il nodo dovrebbe avere i seguenti demoni installati:

* Runtime container compatibili con CRI come Docker, containerd e CRI-O
* kubelet

## Esecuzione del Test di Conformità del Nodo

Per eseguire il test di conformità del nodo, segui questi passaggi:

1. Determina il valore dell'opzione `--kubeconfig` per il kubelet; ad esempio: `--kubeconfig=/var/lib/kubelet/config.yaml`.
  Poiché il framework di test avvia un control plane locale per testare il kubelet, usa `http://localhost:8080` come URL dell'API server.
  Ci sono altri parametri della riga di comando del kubelet che potresti voler usare:
  
   * `--cloud-provider`: Se stai usando `--cloud-provider=gce`, dovresti rimuovere il flag per eseguire il test.

1. Esegui il test di conformità del nodo con il comando:

   ```shell
   # $CONFIG_DIR è il percorso dei manifest pod del tuo kubelet.
   # $LOG_DIR è il percorso di output del test.
   sudo docker run -it --rm --privileged --net=host \
   -v /:/rootfs -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
   registry.k8s.io/node-test:0.2
   ```

## Esecuzione del Test di Conformità del Nodo per Altre Architetture

Kubernetes fornisce anche immagini docker del test di conformità del nodo per altre architetture:

|  Arch  |       Immagine        |
|--------|:--------------------:|
|  amd64 |  node-test-amd64     |
|  arm   |   node-test-arm      |
| arm64  |  node-test-arm64     |

## Esecuzione di Test Selezionati

Per eseguire test specifici, sovrascrivi la variabile d'ambiente `FOCUS` con l'espressione regolare dei test che vuoi eseguire.

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e FOCUS=MirrorPod \ # Esegui solo il test MirrorPod
  registry.k8s.io/node-test:0.2
```

Per saltare test specifici, sovrascrivi la variabile d'ambiente `SKIP` con l'espressione regolare dei test che vuoi saltare.

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e SKIP=MirrorPod \ # Esegui tutti i test di conformità ma salta il test MirrorPod
  registry.k8s.io/node-test:0.2
```

Il test di conformità del nodo è una versione containerizzata del
[test node e2e](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/e2e-node-tests.md).
Per impostazione predefinita, esegue tutti i test di conformità.

Teoricamente, puoi eseguire qualsiasi test node e2e se configuri correttamente il container e monti i volumi richiesti. Tuttavia, **si raccomanda fortemente di eseguire solo i test di conformità**, poiché richiede una configurazione molto più complessa per eseguire test non di conformità.

## Avvertenze

* Il test lascia alcune immagini docker sul nodo, inclusa l'immagine del test di conformità del nodo e le immagini dei container usati nei test di funzionalità.
* Il test lascia container terminati sul nodo. Questi container vengono creati durante i test di funzionalità.
