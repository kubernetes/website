---
title: Immagini
content_type: concept
weight: 10
---

<!-- overview -->

L'immagine di un container rappresenta dati binari che incapsulano un'applicazione e 
tutte le sue dipendenze software. Le immagini sono costituite da pacchetti software 
eseguibili che possono essere avviati in modalità standalone e su cui si possono fare 
ipotesi ben precise circa l'ambiente in cui vengono eseguiti.

Tipicamente viene creata un'immagine di un'applicazione ed effettuato il _push_ 
su un registry (un repository pubblico di immagini) prima di poterne fare riferimento esplicito in un 
{{< glossary_tooltip text="Pod" term_id="pod" >}}

Questa pagina va a delineare nello specifico il concetto di immagine di un container.

<!-- body -->

## I nomi delle immagini

Alle immagini dei container vengono normalmente attribuiti nomi come `pause`, `example/mycontainer`, o `kube-apiserver`.
Le immagini possono anche contenere l'hostname del registry in cui le immagini sono pubblicate; 
ad esempio: `registro.fittizio.esempio/nomeimmagine`,
ed è possibile che sia incluso nel nome anche il numero della porta; ad esempio: `registro.fittizio.esempio:10443/nomeimmagine`.

Se non si specifica l'hostname di un registry, Kubernetes assume che ci si riferisca al registry pubblico di Docker.

Dopo la parte relativa al nome dell'immagine si può aggiungere un _tag_ (come comunemente avviene per comandi come `docker` e `podman`).
I tag permettono l'identificazione di differenti versioni della stessa serie di immagini.

I tag delle immagini sono composti da lettere minuscole e maiuscole, numeri, underscore (`_`),
punti (`.`), e trattini (`-`).  
Esistono regole aggiuntive relative a dove i caratteri separatori (`_`, `-`, and `.`) 
possano essere inseriti nel tag di un'immagine. 
Se non si specifica un tag, Kubernetes assume il tag `latest` che va a definire l'immagine disponibile più recente.

{{< caution >}}
Evitate di utilizzare il tag `latest` quando si rilasciano dei container in produzione,
in quanto risulta difficile tracciare quale versione dell'immagine sia stata avviata e persino più difficile
effettuare un rollback ad una versione precente.

Invece, meglio specificare un tag specifico come ad esempio `v1.42.0`.
{{< /caution >}}

## Aggiornamento delle immagini

Quando un {{< glossary_tooltip text="Deployment" term_id="deployment" >}},
{{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}, Pod, o qualsiasi altro
oggetto che includa un Pod template viene creato per la prima volta, la policy di default per il pull di tutti i container nel Pod 
è impostata su `IfNotPresent` (se non presente) se non specificato diversamente.
Questa policy permette al
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} di evitare di fare il pull
di un'immagine se questa è già presente.

Se necessario, si può forzare il pull in ogni occasione in uno dei seguenti modi:

- impostando `imagePullPolicy` (specifica per il pull delle immagini) del container su `Always` (sempre).
- omettendo `imagePullPolicy` ed usando il tag `:latest` (più recente) per l'immagine da utilizzare;
  Kubernetes imposterà la policy su `Always` (sempre).
- omettendo `imagePullPolicy` ed il tag per l'immagine da utilizzare.
- abilitando l'admission controller [AlwaysPullImages](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages).

{{< note >}}
Il valore dell'impostazione `imagePullPolicy` del container è sempre presente quando l'oggetto viene creato per la prima volta
e non viene aggiornato se il tag dell'immagine dovesse cambiare successivamente.

Ad esempio, creando un Deployment con un'immagine il cui tag _non_ è 
`:latest`, e successivamente aggiornando il tag di quell'immagine a `:latest`, il campo
 `imagePullPolicy` _non_ cambierà su `Always`. 
È necessario modificare manualmente la policy di pull di ogni oggetto dopo la sua creazione.
{{< /note >}}

Quando `imagePullPolicy` è definito senza un valore specifico, esso è impostato su `Always`.

## Multi-architecture support nelle immagini

Oltre a fornire immagini binarie, un _container registry_ può fornire un [indice delle immagini disponibili per un container](https://github.com/opencontainers/image-spec/blob/master/image-index.md). 
L'indice di un'immagine può puntare a più [file manifest](https://github.com/opencontainers/image-spec/blob/master/manifest.md) ciascuno per una versione specifica dell'architettura di un container. 
L'idea è che si può avere un unico nome per una stessa immagine (ad esempio: `pause`, `example/mycontainer`, `kube-apiserver`) e permettere a diversi sistemi di recuperare l'immagine binaria corretta a seconda dell'architettura della macchina che la sta utilizzando.


Kubernetes stesso tipicamente nomina le immagini dei container tramite il suffisso `-$(ARCH)`. 
Per la garantire la retrocompatibilità è meglio generare le vecchie immagini con dei suffissi. 
L'idea è quella di generare, ad esempio, l'immagine `pause` con un manifest che include tutte le architetture supportate, 
affiancata, ad esempio, da `pause-amd64` che è retrocompatibile per le vecchie configurazioni o per quei file YAML 
in cui sono specificate le immagini con i suffissi.

## Utilizzare un private registry

I private registry possono richiedere l'utilizzo di chiavi per accedere alle immagini in essi contenute.  
Le credenziali possono essere fornite in molti modi:
  - configurando i nodi in modo tale da autenticarsi al private registry
    - tutti i pod possono acquisire informazioni da qualsiasi private registry configurato
    - è necessario che l'amministratore del cluster configuri i nodi in tal senso
  - tramite pre-pulled images (immagini pre-caricate sui nodi)
    - tutti i pod possono accedere alle immagini salvate sulla cache del nodo a cui si riferiscono
    - è necessario effettuare l'accesso come root di sistema su ogni nodo per inserire questa impostazione
  - specificando _ImagePullSecrets_ su un determinato pod
    - solo i pod che forniscono le proprie chiavi hanno la possibilità di accedere al private registry
  - tramite estensioni locali o specifiche di un _Vendor_
    - se si sta utilizzando una configurazione personalizzata del nodo oppure se manualmente, o tramite il _cloud provider_,
      si implementa un meccanismo di autenticazione del nodo presso il _container registry_.

Di seguito la spiegazione dettagliata di queste opzioni.

### Configurazione dei nodi per l'autenticazione ad un private registry

Se si sta utilizzando Docker sui nodi, si può configurare il _Docker container runtime_ 
per autenticare il nodo presso un private container registry.

Questo è un approccio possibile se si ha il controllo sulle configurazioni del nodo.

{{< note >}}
Kubernetes di default supporta solo le sezioni `auths` e `HttpHeaders` nelle configurazioni relative a Docker. 
Eventuali _helper_ per le credenziali di Docker (`credHelpers` o `credsStore`) non sono supportati.
{{< /note >}}


Docker salva le chiavi per i registri privati in `$HOME/.dockercfg` oppure nel file `$HOME/.docker/config.json`. 
Inserendo lo stesso file nella lista seguente, kubelet lo utilizzerà per recuperare le credenziali quando deve fare il _pull_ delle immagini.

* `{--root-dir:-/var/lib/kubelet}/config.json`
* `{cwd of kubelet}/config.json`
* `${HOME}/.docker/config.json`
* `/.docker/config.json`
* `{--root-dir:-/var/lib/kubelet}/.dockercfg`
* `{cwd of kubelet}/.dockercfg`
* `${HOME}/.dockercfg`
* `/.dockercfg`

{{< note >}}
Potrebbe essere necessario impostare `HOME=/root` esplicitamente come variabile d'ambiente del processo _kubelet_.
{{< /note >}}

Di seguito i passi consigliati per configurare l'utilizzo di un private registry da parte dei nodi del _cluster_. 
In questo esempio, eseguire i seguenti comandi sul proprio desktop/laptop:

   1. Esegui `docker login [server]` per ogni _set_ di credenziali che vuoi utilizzare. Questo comando aggiornerà `$HOME/.docker/config.json` sul tuo PC.
   1. Controlla il file `$HOME/.docker/config.json` in un editor di testo per assicurarti che contenga le credenziali che tu voglia utilizzare.
   1. Recupera la lista dei tuoi nodi; ad esempio:
      - se vuoi utilizzare i nomi: `nodes=$( kubectl get nodes -o jsonpath='{range.items[*].metadata}{.name} {end}' )`
      - se vuoi recuperare gli indirizzi IP: `nodes=$( kubectl get nodes -o jsonpath='{range .items[*].status.addresses[?(@.type=="ExternalIP")]}{.address} {end}' )`
   1. Copia il tuo file locale `.docker/config.json` in uno dei path sopra riportati nella lista di ricerca.
      - ad esempio, per testare il tutto: `for n in $nodes; do scp ~/.docker/config.json root@"$n":/var/lib/kubelet/config.json; done`

{{< note >}}
Per i cluster di produzione, utilizza un configuration management tool per poter applicare le impostazioni su tutti i nodi laddove necessario.
{{< /note >}}

Puoi fare una verifica creando un Pod che faccia uso di un'immagine privata; ad esempio:

```shell
kubectl apply -f - <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: private-image-test-1
spec:
  containers:
    - name: uses-private-image
      image: $PRIVATE_IMAGE_NAME
      imagePullPolicy: Always
      command: [ "echo", "SUCCESS" ]
EOF
```
```
pod/private-image-test-1 created
```
Se tutto funziona correttamente, pochi istanti dopo, si può lanciare il comando:

```shell
kubectl logs private-image-test-1
```
e verificare che il comando restituisca in output:
```
SUCCESS
```

Qualora si sospetti che il comando sia fallito, si può eseguire:
```shell
kubectl describe pods/private-image-test-1 | grep 'Failed'
```
In caso di fallimento, l'output sarà simile al seguente:
```
  Fri, 26 Jun 2015 15:36:13 -0700    Fri, 26 Jun 2015 15:39:13 -0700    19    {kubelet node-i2hq}    spec.containers{uses-private-image}    failed        Failed to pull image "user/privaterepo:v1": Error: image user/privaterepo:v1 not found
```

Bisogna assicurarsi che tutti i nodi nel cluster abbiano lo stesso file `.docker/config.json`. 
Altrimenti i pod funzioneranno correttamente su alcuni nodi ma falliranno su altri. 
Ad esempio, se si utilizza l'autoscaling per i nodi, il template di ogni istanza 
devono includere il file `.docker/config.json` oppure montare un disco che lo contenga.

Tutti i pod avranno accesso in lettura alle immagini presenti nel private registry 
una volta che le rispettive chiavi di accesso siano state aggiunte nel file `.docker/config.json`.

### Immagini pre-pulled

{{< note >}}
Questo approccio è possibile se si ha il controllo sulla configurazione del nodo. 
Non funzionerà qualora il cloud provider gestisca i nodi e li sostituisca automaticamente.
{{< /note >}}

Kubelet di default prova a fare il pull di ogni immagine dal registry specificato.
Tuttavia, qualora la proprietà `imagePullPolicy` (specifica di pull dell'immagine) del container sia impostata su `IfNotPresent` (vale a dire, se non è già presente) oppure su `Never` (mai), 
allora l'immagine locale è utilizzata (in via preferenziale o esclusiva, rispettivamente).

Se si vuole fare affidamento a immagini pre-scaricate per non dover incorrere in una fase di autenticazione presso il registry, 
bisogna assicurarsi che tutti i nodi nel cluster abbiano scaricato le stesse versioni delle immagini.

Questa procedura può essere utilizzata per accelerare il processo di creazione delle istanze o come alternativa all'autenticazione presso un private registry.

Tutti i pod avranno accesso in lettura a qualsiasi immagine pre-scaricata.

### Specificare la proprietà imagePullSecrets su un Pod

{{< note >}}
Questo approccio è quello consigliato per l'avvio di container a partire da immagini presenti in registri privati.
{{< /note >}}

Kubernetes da la possibilità di specificare le chiavi del _container registry_ su un Pod.

#### Creare un Secret tramite Docker config

Esegui il comando seguente, sostituendo i valori riportati in maiuscolo con quelli corretti:

```shell
kubectl create secret docker-registry <name> --docker-server=DOCKER_REGISTRY_SERVER --docker-username=DOCKER_USER --docker-password=DOCKER_PASSWORD --docker-email=DOCKER_EMAIL
```

Se possiedi il file delle credenziali per Docker, anziché utilizzare il comando quì sopra 
puoi importare il file di credenziali come un Kubernetes 
{{< glossary_tooltip text="Secrets" term_id="secret" >}}.  
[Creare un Secret a partire da credenziali Docker](/docs/tasks/configure-pod-container/pull-image-private-registry/#registry-secret-existing-credentials) fornisce la spiegazione dettagliata su come fare.

Ciò è particolarmente utile se si utilizzano più _container registry_ privati, 
in quanto il comando `kubectl create secret docker-registry` genera un Secret che 
funziona con un solo private registry.

{{< note >}}
I Pod possono fare riferimento ai Secret per il pull delle immagini soltanto nel proprio _namespace_, 
quindi questo procedimento deve essere svolto per ogni _namespace_.
{{< /note >}}

#### Fare riferimento ad imagePullSecrets in un Pod

È possibile creare pod che referenzino quel Secret aggiungendo la sezione `imagePullSecrets` alla definizione del Pod.

Ad esempio:

```shell
cat <<EOF > pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: foo
  namespace: awesomeapps
spec:
  containers:
    - name: foo
      image: janedoe/awesomeapp:v1
  imagePullSecrets:
    - name: myregistrykey
EOF

cat <<EOF >> ./kustomization.yaml
resources:
- pod.yaml
EOF
```

Questo deve esser fatto per ogni Pod che utilizzi un private registry.

Comunque, le impostazioni relative a questo campo possono essere automatizzate inserendo la sezione _imagePullSecrets_
nella definizione della risorsa [ServiceAccount](/docs/tasks/configure-pod-container/configure-service-account/).

Visitare la pagina [Aggiungere ImagePullSecrets ad un Service Account](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account) per istruzioni più dettagliate.

Puoi utilizzarlo in congiunzione al file `.docker/config.json` configurato per ogni nodo. In questo caso, si applicherà un _merge_ delle credenziali.

## Casi d'uso

Ci sono varie soluzioni per configurare i private registry. Di seguito, alcuni casi d'uso comuni e le soluzioni suggerite.

1. Cluster in cui sono utilizzate soltanto immagini non proprietarie (ovvero _open-source_). In questo caso non sussiste il bisogno di nascondere le immagini.
   - Utilizza immagini pubbliche da Docker hub.
     - Nessuna configurazione richiesta.
     - Alcuni _cloud provider_ mettono in _cache_ o effettuano il _mirror_ di immagini pubbliche, il che migliora la disponibilità delle immagini e ne riduce il tempo di _pull_.
1. Cluster con container avviati a partire da immagini proprietarie che dovrebbero essere nascoste a chi è esterno all'organizzazione, ma 
   visibili a tutti gli utenti abilitati nel cluster.
   - Utilizza un private [Docker registry](https://docs.docker.com/registry/).
     - Esso può essere ospitato da [Docker Hub](https://hub.docker.com/signup), o da qualche altra piattaforma.
     - Configura manualmente il file .docker/config.json su ogni nodo come descritto sopra.
   - Oppure, avvia un private registry dietro il tuo firewall con accesso in lettura libero.
     - Non è necessaria alcuna configurazione di Kubernetes.
   - Utilizza un servizio di _container registry_ che controlli l'accesso alle immagini
     - Esso funzionerà meglio con una configurazione del cluster basata su _autoscaling_ che con una configurazione manuale del nodo.
   - Oppure, su un cluster dove la modifica delle configurazioni del nodo non è conveniente, utilizza `imagePullSecrets`.
1. Cluster con immagini proprietarie, alcune delle quali richiedono un controllo sugli accessi.
   - Assicurati che l'_admission controller_ [AlwaysPullImages](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages) sia attivo. Altrimenti, tutti i Pod potenzialmente possono avere accesso a tutte le immagini.
   - Sposta i dati sensibili un un _Secret_, invece di inserirli in un'immagine.
1. Un cluster multi-tenant dove ogni tenant necessiti di un private registry.
   - Assicurati che l'_admission controller_ [AlwaysPullImages](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages) sia attivo. Altrimenti, tutti i Pod di tutti i tenant potrebbero potenzialmente avere accesso a tutte le immagini.
   - Avvia un private registry che richieda un'autorizzazione all'accesso.
   - Genera delle credenziali di registry per ogni tenant, inseriscile in dei _Secret_, e popola i _Secret_ per ogni _namespace_ relativo ad ognuno dei tenant.
   - Il singolo tenant aggiunge così quel _Secret_ all'impostazione _imagePullSecrets_ di ogni _namespace_.


Se si ha la necessità di accedere a più registri, si può generare un _Secret_ per ognuno di essi.
Kubelet farà il _merge_ di ogni `imagePullSecrets` in un singolo file virtuale `.docker/config.json`.

## {{% heading "whatsnext" %}}

* Leggi [OCI Image Manifest Specification](https://github.com/opencontainers/image-spec/blob/master/manifest.md)