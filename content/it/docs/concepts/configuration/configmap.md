---
title: ConfigMaps
content_type: concept
weight: 20
---

<!-- overview -->

{{< glossary_definition term_id="configmap" prepend="La ConfigMap è" length="all" >}}

{{< caution >}}
La ConfigMap non fornisce riservatezza o cifratura dei dati. Se i dati che vuoi salvare sono confidenziali, usa un {{< glossary_tooltip text="Secret" term_id="secret" >}} piuttosto che una ConfigMap, o usa uno strumento di terze parti per tenere privati i tuoi dati.
{{< /caution >}}

<!-- body -->
## Utilizzo

Usa una ConfigMap per tenere separati i dati di configurazione dal codice applicativo.

Per esempio, immagina che stai sviluppando un'applicazione che puoi eseguire sul tuo computer (per lo sviluppo) e sul cloud (per gestire il traffico reale). Puoi scrivere il codice puntando a una variabile d'ambiente chiamata `DATABASE_HOST`. Localmente, puoi settare quella variabile a `localhost`. Nel cloud, la puoi settare referenziando il {{< glossary_tooltip text="Service" term_id="service" >}} di Kubernetes che espone la componente del database sul tuo cluster. Ciò ti permette di andare a recuperare l'immagine del container eseguita nel cloud e fare il debug dello stesso codice localmente se necessario.

La ConfigMap non è pensata per sostenere una gran mole di dati. I dati memorizzati su una ConfigMap non possono superare 1 MiB. Se hai bisogno di memorizzare delle configurazioni che superano questo limite, puoi considerare di montare un volume oppure usare un database o un file service separato.


## Oggetto ConfigMap

La ConfigMap è un [oggetto](/docs/concepts/overview/working-with-objects/kubernetes-objects/) API che ti permette di salvare configurazioni per poi poter essere riutilizzate da altri oggetti. A differenza di molti oggetti di Kubernetes che hanno una `spec`, la ConfigMap ha i campi `data` e `binaryData`. Questi campi accettano le coppie chiave-valore come valori. Entrambi i campi `data` e `binaryData` sono opzionali. Il campo `data` è pensato per contenere le stringhe UTF-8 mentre il campo `binaryData` è pensato per contenere dati binari come le stringhe codificate in base64.

Il nome di una ConfigMap deve essere un nome valido per un sottodominio DNS.

Ogni chiave sotto il campo `data` o `binaryData` deve consistere di caratteri alfanumerici, `-`, `_` o `.`. Le chiavi salvate sotto `data` non devono coincidere con le chiavi nel campo `binaryData`.

Partendo dalla versione 1.19, puoi aggiungere il campo `immutable` alla definizione di ConfigMap per creare una [ConfigMap immutabile](#configmap-immutable).

## ConfigMaps e Pods

Puoi scrivere una `spec` del Pod che si riferisce a una ConfigMap e configurare il o i containers
in quel Pod sulla base dei dati presenti nella ConfigMap. Il Pod e la ConfigMap devono essere nello
stesso Namespace.

{{< note >}}
La `spec` di un {{< glossary_tooltip text="Pod statico" term_id="static-pod" >}} non può riferirsi a una ConfigMap
o ad altri oggetti API.
{{< /note >}}

Questo è un esempio di una ConfigMap che ha alcune chiavi con valori semplici,
e altre chiavi dove il valore ha il formato di un frammento di configurazione.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: game-demo
data:
  # chiavi simili a proprietà; ogni chiave mappa un valore semplice
  player_initial_lives: "3"
  ui_properties_file_name: "user-interface.properties"

  # chiavi simili a files
  game.properties: |
    enemy.types=aliens,monsters
    player.maximum-lives=5
  user-interface.properties: |
    color.good=purple
    color.bad=yellow
    allow.textmode=true
```

Ci sono quattro modi differenti con cui puoi usare una ConfigMap per configurare
un container all'interno di un Pod:

1. Argomento da riga di comando come entrypoint di un container
1. Variabile d'ambiente di un container
1. Aggiungere un file in un volume di sola lettura, per fare in modo che l'applicazione lo legga
1. Scrivere il codice da eseguire all'interno del Pod che utilizza l'API di Kubernetes per leggere la ConfigMap

Questi metodologie differenti permettono di utilizzare diversi metodi per modellare i dati che saranno consumati.
Per i primi tre metodi, il 
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} utilizza i dati della
ConfigMap quando lancia il container (o più) in un Pod.

Per il quarto metodo dovrai scrivere il codice per leggere la ConfigMap e i suoi dati.
Comunque, poiché stai utilizzando l'API di Kubernetes direttamente, la tua applicazione può
sottoscriversi per ottenere aggiornamenti ogniqualvolta la ConfigMap cambia, e reagire
quando ciò accade. Accedendo direttamente all'API di Kubernetes, questa
tecnica ti permette anche di accedere a una ConfigMap in namespace differenti.

Ecco un esempio di Pod che usa i valori da `game-demo` per configurare il container:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: configmap-demo-pod
spec:
  containers:
    - name: demo
      image: alpine
      command: ["sleep", "3600"]
      env:
        # Definire la variabile d'ambiente
        - name: PLAYER_INITIAL_LIVES # Notare che il case qui è differente
                                     # dal nome della key nella ConfigMap.
          valueFrom:
            configMapKeyRef:
              name: game-demo           # La ConfigMap da cui proviene il valore.
              key: player_initial_lives # La chiave da recuperare.
        - name: UI_PROPERTIES_FILE_NAME
          valueFrom:
            configMapKeyRef:
              name: game-demo
              key: ui_properties_file_name
      volumeMounts:
      - name: config
        mountPath: "/config"
        readOnly: true
  volumes:
    # Settare i volumi al livello del Pod, in seguito montarli nei containers all'interno del Pod
    - name: config
      configMap:
        # Fornire il nome della ConfigMap che vuoi montare.
        name: game-demo
        # Una lista di chiavi dalla ConfigMap per essere creata come file
        items:
        - key: "game.properties"
          path: "game.properties"
        - key: "user-interface.properties"
          path: "user-interface.properties"
```

Una ConfigMap non differenzia tra le proprietà di una singola linea e un file con più linee e valori.
L'importante è il modo in cui i Pods e gli altri oggetti consumano questi valori.

Per questo esempio, definire un volume e montarlo all'interno del container `demo` come `/config` crea
due files,
`/config/game.properties` e `/config/user-interface.properties`,
sebbene ci siano quattro chiavi nella ConfigMap. Ciò avviene perché la definizione del Pod
specifica una lista di `items` nella sezione dei `volumes`.
Se ometti del tutto la lista degli `items`, ogni chiave nella ConfigMap diventerà
un file con lo stesso nome della chiave, e otterrai 4 files.

## Usare le ConfigMaps

Le ConfigMaps possono essere montate come volumi. Le ConfigMaps possono anche essere utilizzate da
altre parti del sistema, senza essere direttamente esposte al Pod. Per esempio, le
ConfigMaps possono contenere l'informazione che altre parti del sistema utilizzeranno per la loro
configurazione.

La maniera più comune per usare le ConfigMaps è di configurare i containers che sono in esecuzione
in un Pod nello stesso namespace. Puoi anche utilizzare una ConfigMap separatamente.

Per esempio, potresti incontrare
 {{< glossary_tooltip text="addons" term_id="addons" >}}
o {{< glossary_tooltip text="operators" term_id="operator-pattern" >}} che
adattano il loro comportamento in base a una ConfigMap.

### Usare le ConfigMaps come files in un Pod

Per utilizzare una ConfigMap in un volume all'interno di un Pod:

1. Creare una ConfigMap o usarne una che già esiste. Più Pods possono utilizzare
   la stessa ConfigMap.
1. Modificare la definizione del Pod per aggiungere un volume sotto `.spec.volumes[]`. Nominare
   il volume in qualsiasi modo, e avere un campo `.spec.volumes[].configMap.name` configurato per 
   referenziare il tuo oggetto ConfigMap.
1. Aggiungere un `.spec.containers[].volumeMounts[]` a ogni container che necessiti di una
   ConfigMap. Nello specifico `.spec.containers[].volumeMounts[].readOnly = true` e
   `.spec.containers[].volumeMounts[].mountPath` in una cartella inutilizzata
   dove vorresti che apparisse la ConfigMap.
1. Modificare l'immagine o il comando utilizzato così che il programma cerchi i files in
   quella cartella. Ogni chiave nella sezione `data` della ConfigMap si converte in un file
   sotto `mountPath`.

Questo è un esempio di un Pod che monta una ConfigMap in un volume:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
      readOnly: true
  volumes:
  - name: foo
    configMap:
      name: myconfigmap
```

Ogni ConfigMap che desideri utilizzare deve essere referenziata in `.spec.volumes`.

Se c'è più di un container nel Pod, allora ogni container necessita del suo
blocco `volumeMounts`, ma solamente un `.spec.volumes` è necessario ConfigMap.

#### Le ConfigMaps montate sono aggiornate automaticamente

Quando una ConfigMap è utilizzata in un volume ed è aggiornata, anche le chiavi vengono aggiornate.
Il kubelet controlla se la ConfigMap montata è aggiornata ad ogni periodo di sincronizzazione.
Ad ogni modo, il kubelet usa la sua cache locale per ottenere il valore attuale della ConfigMap.
Il tipo di cache è configurabile usando il campo `ConfigMapAndSecretChangeDetectionStrategy` nel [KubeletConfiguration struct](/docs/reference/config-api/kubelet-config.v1beta1/).
Una ConfigMap può essere propagata per vista (default), ttl-based, o redirigendo
tutte le richieste direttamente all'API server.
Come risultato, il ritardo totale dal momento in cui la ConfigMap è aggiornata al momento in cui nuove chiavi sono propagate al Pod può essere tanto lungo quanto il periodo della sincronizzazione del kubelet + il ritardo della propagazione della cache, dove il ritardo della propagazione della cache dipende dal tipo di cache scelta
(è uguale rispettivamente al ritardo della propagazione, ttl della cache, o zero).

Le ConfigMaps consumate come variabili d'ambiente non sono aggiornate automaticamente e necessitano di un riavvio del pod. 

{{< note >}}
Un container utilizzando una ConfigMap come un [subPath](/docs/concepts/storage/volumes#using-subpath) volume mount non riceverà gli aggiornamenti della ConfigMap.
{{< /note >}}

## ConfigMaps Immutabili {#configmap-immutable}

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

La funzionalità di Kubernetes _Immutable Secrets and ConfigMaps_ fornisce un'opzione per
configurare Secrets individuali e ConfigMaps come immutabili. Per clusters che usano le ConfigMaps come estensione (almeno decine o centinaia di ConfigMap uniche montate nel Pod), prevenire i cambiamenti nei loro dati ha i seguenti vantaggi:

- protezione da aggiornamenti accidentali (o non voluti) che potrebbero causare l'interruzione di applicazioni
- miglioramento della performance del tuo cluster riducendo significativamente il carico sul kube-apiserver, chiudendo l'ascolto sulle ConfigMaps che sono segnate come immutabili.

Questa funzionalità è controllata dal `ImmutableEphemeralVolumes`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/).
Puoi creare una ConfigMap immutabile settando il campo `immutable` a `true`.
Per esempio:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  ...
data:
  ...
immutable: true
```

Una volta che una ConfigMap è segnata come immutabile, _non_ è possibile invertire questo cambiamento né cambiare il contenuto del campo `data` o `binaryData` field. Puoi solamente cancellare e ricreare la ConfigMap. Poiché i Pods hanno un puntamento verso la ConfigMap eliminata, è raccomandato di ricreare quei Pods.

## {{% heading "whatsnext" %}}

* Leggi in merito [Secrets](/docs/concepts/configuration/secret/).
* Leggi [Configura un Pod per utilizzare una ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/).
* Leggi in merito [Modificare una ConfigMap (o qualsiasi altro oggetto di Kubernetes)](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/)
* Leggi [The Twelve-Factor App](https://12factor.net/) per comprendere il motivo di separare
  il codice dalla configurazione.