---
title: kubectl Spickzettel
content_template: templates/concept
card:
  name: reference
  weight: 30
---

{{% capture overview %}}

Siehe auch: [Kubectl Überblick](/docs/reference/kubectl/overview/) und [JsonPath Dokumentation](/docs/reference/kubectl/jsonpath).

Diese Seite ist eine Übersicht über den Befehl `kubectl`.

{{% /capture %}}

{{% capture body %}}

# kubectl - Spickzettel

## Kubectl Autovervollständigung

### BASH

```bash
source <(kubectl completion bash) # Wenn Sie autocomplete in bash in der aktuellen Shell einrichten, sollte zuerst das bash-completion-Paket installiert werden.
echo "source <(kubectl completion bash)" >> ~/.bashrc # Fügen Sie der Bash-Shell dauerhaft Autocomplete hinzu.
```

Sie können auch ein Abkürzungsalias für `kubectl` verwenden, weleches auch mit Vervollständigung funktioniert:

```bash
alias k=kubectl
complete -F __start_kubectl k
```

### ZSH

```bash
source <(kubectl completion zsh)  # Richten Sie Autocomplete in zsh in der aktuellen Shell ein
echo "if [ $commands[kubectl] ]; then source <(kubectl completion zsh); fi" >> ~/.zshrc # Fügen Sie der Zsh-Shell dauerhaft Autocomplete hinzu
```

## Kubectl Kontext und Konfiguration

Legen Sie fest, welcher Kubernetes-Cluster mit `kubectl` kommuniziert und dessen Konfiguration ändert. Lesen Sie die Dokumentation [Authentifizierung mit kubeconfig über mehrere Cluster hinweg](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/) für ausführliche Informationen zur Konfigurationsdatei.

```bash
kubectl config view # Zusammengeführte kubeconfig-Einstellungen anzeigen.

# Verwenden Sie mehrere kubeconfig-Dateien gleichzeitig und zeigen Sie die zusammengeführte Konfiguration an
KUBECONFIG=~/.kube/config:~/.kube/kubconfig2 kubectl config view

# Zeigen Sie das Passwort für den e2e-Benutzer an
kubectl config view -o jsonpath='{.users[?(@.name == "e2e")].user.password}'

kubectl config view -o jsonpath='{.users[].name}'    # eine Liste der Benutzer erhalten
kubectl config current-context			               # den aktuellen Kontext anzeigen
kubectl config use-context my-cluster-name           # Setzen Sie den Standardkontext auf my-cluster-name

# Fügen Sie Ihrer kubeconf einen neuen Cluster hinzu, der basic auth unterstützt
kubectl config set-credentials kubeuser/foo.kubernetes.com --username=kubeuser --password=kubepassword

# Legen Sie einen Kontext fest, indem Sie einen bestimmten Benutzernamen und einen bestimmten Namespace verwenden.
kubectl config set-context gce --user=cluster-admin --namespace=foo \
  && kubectl config use-context gce
 
kubectl config unset users.foo                       # delete user foo
```

## Apply
`apply` verwaltet Anwendungen durch Dateien, die Kubernetes-Ressourcen definieren. Es erstellt und aktualisiert Ressourcen in einem Cluster durch Ausführen von `kubectl apply`. Dies ist die empfohlene Methode zur Verwaltung von Kubernetes-Anwendungen in der Produktion. Lesen Sie die ausführliche [Kubectl Dokumentation](https://kubectl.docs.kubernetes.io) für weitere Informationen.

## Objekte erstellen

Kubernetes Manifeste können in Json oder Yaml definiert werden. Die Dateierweiterungen `.yaml`,
`.yml`, und `.json` können verwendet werden.

```bash
kubectl apply -f ./my-manifest.yaml           # Ressource(n) erstellen
kubectl apply -f ./my1.yaml -f ./my2.yaml     # aus mehreren Dateien erstellen
kubectl apply -f ./dir                        # Erstellen Sie Ressourcen in allen Manifestdateien in Verzeichnis
kubectl apply -f https://git.io/vPieo         # Ressource(n) aus URL erstellen
kubectl create deployment nginx --image=nginx  # Starten Sie eine einzelne Instanz von Nginx
kubectl explain pods,svc                       # Zeigen Sie die Dokumentation für Pod und SVC Manifeste an

# Erstellen Sie mehrere YAML-Objekte aus stdin
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: busybox-sleep
spec:
  containers:
  - name: busybox
    image: busybox
    args:
    - sleep
    - "1000000"
---
apiVersion: v1
kind: Pod
metadata:
  name: busybox-sleep-less
spec:
  containers:
  - name: busybox
    image: busybox
    args:
    - sleep
    - "1000"
EOF

# Erstellen Sie ein "Secret" mit mehreren Schlüsseln
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  password: $(echo -n "s33msi4" | base64 -w0)
  username: $(echo -n "jane" | base64 -w0)
EOF

```

## Suchen und Anzeigen von Ressourcen

```bash
# Get Befehle mit grundlegenden Ausgaben
kubectl get services                          # Listen Sie alle Dienste im Namespace auf
kubectl get pods --all-namespaces             # Listen Sie alle Pods in allen Namespaces auf
kubectl get pods -o wide                      # Listen Sie alle Pods im Namespace mit weiteren Details auf
kubectl get deployment my-dep                 # Listen Sie eine bestimmte Bereitstellung auf
kubectl get pods --include-uninitialized      # Listen Sie alle Pods im Namespace auf, einschließlich der nicht initialisierten

# Describe Befehle mit ausführlicher Ausgabe
kubectl describe nodes my-node
kubectl describe pods my-pod

kubectl get services --sort-by=.metadata.name # Listen Sie Dienste nach Namen sortiert auf

# Listen Sie Pods Sortiert nach Restart Count auf
kubectl get pods --sort-by='.status.containerStatuses[0].restartCount'

# Erhalten Sie die Versionsbezeichnung aller Pods mit der Bezeichnung app=cassandra
kubectl get pods --selector=app=cassandra -o \
  jsonpath='{.items[*].metadata.labels.version}'

# Alle Worker-Knoten abrufen (verwenden Sie einen Selektor, um Ergebnisse auszuschließen,
# die ein Label mit dem Namen 'node-role.kubernetes.io/master' tragen).
kubectl get node --selector='!node-role.kubernetes.io/master'

# Zeigen Sie alle laufenden Pods im Namespace an
kubectl get pods --field-selector=status.phase=Running

# Rufen Sie die externe IP aller Nodes ab
kubectl get nodes -o jsonpath='{.items[*].status.addresses[?(@.type=="ExternalIP")].address}'

# Listet die Namen der Pods auf, die zu einem bestimmten RC gehören
# Der Befehl "jq" ist nützlich für Transformationen, die für jsonpath zu komplex sind. Sie finden ihn unter https://stedolan.github.io/jq/
sel=${$(kubectl get rc my-rc --output=json | jq -j '.spec.selector | to_entries | .[] | "\(.key)=\(.value),"')%?}
echo $(kubectl get pods --selector=$sel --output=jsonpath={.items..metadata.name})

# Labels für alle Pods anzeigen (oder jedes andere Kubernetes-Objekt, das labelling unterstützt)
# Verwendet auch "jq"
for item in $( kubectl get pod --output=name); do printf "Labels for %s\n" "$item" | grep --color -E '[^/]+$' && kubectl get "$item" --output=json | jq -r -S '.metadata.labels | to_entries | .[] | " \(.key)=\(.value)"' 2>/dev/null; printf "\n"; done

# Prüfen Sie, welche Nodes bereit sind
JSONPATH='{range .items[*]}{@.metadata.name}:{range @.status.conditions[*]}{@.type}={@.status};{end}{end}' \
 && kubectl get nodes -o jsonpath="$JSONPATH" | grep "Ready=True"

# Listen Sie alle Secrets auf, die derzeit von einem Pod verwendet werden
kubectl get pods -o json | jq '.items[].spec.containers[].env[]?.valueFrom.secretKeyRef.name' | grep -v null | sort | uniq

# Ereignisse nach Zeitstempel sortiert auflisten
kubectl get events --sort-by=.metadata.creationTimestamp
```

## Ressourcen aktualisieren

Ab Version 1.11 ist das `rolling-update` veraltet (Lesen Sie [CHANGELOG-1.11.md](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.11.md) für weitere Informationen), verwenden Sie stattdessen `rollout`.

```bash
kubectl set image deployment/frontend www=image:v2               # Fortlaufende Aktualisierung der "www" Container der "Frontend"-Bereitstellung, Aktualisierung des Images
kubectl rollout undo deployment/frontend                         # Rollback zur vorherigen Bereitstellung
kubectl rollout status -w deployment/frontend                    # Beobachten Sie den fortlaufenden Aktualisierungsstatus der "Frontend"-Bereitstellung bis zum Abschluss.

# veraltet ab Version 1.11
kubectl rolling-update frontend-v1 -f frontend-v2.json           # (veraltet) Fortlaufendes Update der Pods von Frontend-v1
kubectl rolling-update frontend-v1 frontend-v2 --image=image:v2  # (veraltet) Ändern Sie den Namen der Ressource und aktualisieren Sie das Image
kubectl rolling-update frontend --image=image:v2                 # (veraltet) Aktualisieren Sie das Pod-Image des Frontends
kubectl rolling-update frontend-v1 frontend-v2 --rollback        # (veraltet) Bricht das laufende Rollout ab

cat pod.json | kubectl replace -f -                              # Ersetzen Sie einen Pod basierend auf der in std übergebenen JSON

# Ersetzen, löschen und Ressource neu erstellen. Dies führt zu einer temprären Unerreichbarkeit des Dienstes.
kubectl replace --force -f ./pod.json

# Erstellen Sie einen Dienst für eien replizierten nginx Webserver, der an Port 80 und in den Containern an Port 8000 lauscht
kubectl expose rc nginx --port=80 --target-port=8000

# Aktualisieren Sie die Image-Version (Tag) eines Einzelcontainer-Pods auf Version 4
kubectl get pod mypod -o yaml | sed 's/\(image: myimage\):.*$/\1:v4/' | kubectl replace -f -

kubectl label pods my-pod new-label=awesome                      # Label hinzufügen
kubectl annotate pods my-pod icon-url=http://goo.gl/XXBTWq       # Eine Anmerkung hinzufügen
kubectl autoscale deployment foo --min=2 --max=10                # Automatische Skalierung einer Bereitstellung "Foo"
```

## Ressourcen patchen

```bash
kubectl patch node k8s-node-1 -p '{"spec":{"unschedulable":true}}' # Aktualisieren Sie einen Node teilweise

# Aktualisieren Sie das Image eines Containers; spec.containers[*].name ist erforderlich, da es sich um einen Merge-Schlüssel handelt
kubectl patch pod valid-pod -p '{"spec":{"containers":[{"name":"kubernetes-serve-hostname","image":"new image"}]}}'

# Aktualisieren Sie das Image eines Containers mithilfe eines Json-Patches mit Positionsarrays
kubectl patch pod valid-pod --type='json' -p='[{"op": "replace", "path": "/spec/containers/0/image", "value":"new image"}]'

# Deaktivieren Sie eine Bereitstellung von livenessProbe durch verwenden eines Json-Patches mit Positionsarrays
kubectl patch deployment valid-deployment  --type json   -p='[{"op": "remove", "path": "/spec/template/spec/containers/0/livenessProbe"}]'

# Fügen Sie einem Positionsarray ein neues Element hinzu
kubectl patch sa default --type='json' -p='[{"op": "add", "path": "/secrets/1", "value": {"name": "whatever" } }]'
```

## Ressourcen bearbeiten
Bearbeiten Sie eine beliebige API-Ressource in einem Editor.

```bash
kubectl edit svc/docker-registry                      # Bearbeiten Sie den Dienst docker-registry
KUBE_EDITOR="nano" kubectl edit svc/docker-registry   # Verwenden Sie einen alternativen Texteditor
```

## Ressourcen skalieren

```bash
kubectl scale --replicas=3 rs/foo                                 # Skaliert ein Replikat mit dem Namen 'foo' auf 3
kubectl scale --replicas=3 -f foo.yaml                            # Skaliert eine in "foo.yaml" angegebene Ressource auf 3
kubectl scale --current-replicas=2 --replicas=3 deployment/mysql  # Wenn die aktuelle Konfiguration der Replikation von mysql 2 ist, skaliert mysql auf 3
kubectl scale --replicas=5 rc/foo rc/bar rc/baz                   # Skaliert mehrere Replikationscontroller
```

## Ressourcen löschen

```bash
kubectl delete -f ./pod.json                                              # Löscht einen Pod mit dem in pod.json angegebenen Typ und Namen
kubectl delete pod,service baz foo                                        # Löscht Pods und Services mit den gleichen Namen "baz" und "foo"
kubectl delete pods,services -l name=myLabel                              # Löscht Pods und Services mit dem Label name=myLabel
kubectl delete pods,services -l name=myLabel --include-uninitialized      # Löscht Pods und Services, einschließlich nicht initialisierter, mit dem Label name=myLabel
kubectl -n my-ns delete po,svc --all                                      # Löscht alle Pods und Dienste, einschließlich nicht initialisierter, im Namespace my-ns,
```

## Interaktion mit laufenden Pods

```bash
kubectl logs my-pod                                 # Pod-Logdatei ausgeben (stdout)
kubectl logs my-pod --previous                      # Pod-Logdatei für eine vorherige Instantiierung eines Containers ausgeben (stdout)
kubectl logs my-pod -c my-container                 # Pod Container-Logdatei ausgeben (stdout, multi-container case)
kubectl logs my-pod -c my-container --previous      # Pod Container-Logdatei für eine vorherige Instantiierung eines Containers ausgeben (stdout, multi-container case)
kubectl logs -f my-pod                              # Pod-Logdatei streamen (stdout)
kubectl logs -f my-pod -c my-container              # Pod Container-Logdatei streamen (stdout, multi-container case)
kubectl run -i --tty busybox --image=busybox -- sh  # Pod als interaktive Shell ausführen
kubectl attach my-pod -i                            # An laufenden Container anhängen
kubectl port-forward my-pod 5000:6000               # Lauscht auf Port 5000 auf dem lokalen Computer und leitet den Port 6000 auf my-pod weiter
kubectl exec my-pod -- ls /                         # Befehl in vorhandenem Pod ausführen (1 Container)
kubectl exec my-pod -c my-container -- ls /         # Befehl in vorhandenem Pod ausführen (Mehrere Container)
kubectl top pod POD_NAME --containers               # Zeigt Metriken für einen bestimmten Pod und seine Container an
```

## Mit Nodes und Clustern interagieren

```bash
kubectl cordon my-node                                                # Markiert "my-node" als unplanbar
kubectl drain my-node                                                 # Entleert "my-node" zur Vorbereitung der Wartung
kubectl uncordon my-node                                              # Markiert "my-node" als planbar
kubectl top node my-node                                              # Metriken für einen bestimmten Node anzeigen
kubectl cluster-info                                                  # Adressen des Masters und der Services anzeigen
kubectl cluster-info dump                                             # Ausgabe des aktuellen Clusterstatus in stdout
kubectl cluster-info dump --output-directory=/pfad/zum/cluster-status # Aktuellen Cluster-Status in /pfad/zum/cluster-status ausgeben

# Wenn bereits ein Taint mit diesem Key und Effekt vorhanden ist, wird sein Wert wie angegeben ersetzt.
kubectl taint nodes foo dedicated=special-user:NoSchedule
```

### Ressourcentypen

Liste aller unterstützten Ressourcentypen mit ihren Kurzbezeichnungen, der [API-Gruppe](/docs/concepts/overview/kubernetes-api/#api-groups), unabhängig davon ob sie im Namespace liegen, und der [Art](/docs/concepts/overview/working-with-objects/kubernetes-objects):

```bash
kubectl api-resources
```

Andere Operationen zum Erkunden von API-Ressourcen:

```bash
kubectl api-resources --namespaced=true      # Alle Ressourcen im Namespace
kubectl api-resources --namespaced=false     # Alle nicht im Namespace befindlichen Ressourcen
kubectl api-resources -o name                # Alle Ressourcen mit einfacher Ausgabe (nur der Ressourcenname)
kubectl api-resources -o wide                # Alle Ressourcen mit erweiterter Ausgabe (aka "Wide")
kubectl api-resources --verbs=list,get       # Alle Ressourcen, die "list" und "get" Verben unterstützen anfordern
kubectl api-resources --api-group=extensions # Alle Ressourcen in der API-Gruppe "extensions"
```

### Ausgabe formatieren

Um Details in einem bestimmten Format an Ihr Terminalfenster auszugeben, können Sie entweder das `-o` oder `--output`  Flag zu einem unterstützten `kubectl` Befehl anhängens.

Ausgabeformat | Beschreibung
--------------| -----------
`-o=custom-columns=<spec>` | Ausgabe einer Tabelle mit einer durch Kommas getrennten Liste benutzerdefinierter Spalten
`-o=custom-columns-file=<dateiname>` | Drucken Sie eine Tabelle mit der benutzerdefinierten Spaltenvorlage in der `<dateiname>` Datei
`-o=json`     | Ausgabe eines JSON-formatierten API-Objekts
`-o=jsonpath=<template>` | Ausgabe der in einem [jsonpath](/docs/reference/kubectl/jsonpath)-Ausdruck definierten Felder
`-o=jsonpath-file=<dateiname>` | Ausgabe der in einem [jsonpath](/docs/reference/kubectl/jsonpath)-Ausdruck definierten Felder in der `<dateiname>` Datei
`-o=name`     | Ausgabe von nur dem Ressourcennamen und nichts anderes
`-o=wide`     | Ausgabe im Klartextformat mit zusätzlichen Informationen. Bei Pods ist der Node-Name enthalten
`-o=yaml`     | Gibt ein YAML-formatiertes API-Objekt aus

### Kubectl Ausgabe Ausführlichkeit und Debugging

Die Ausführlichkeit von Kubectl wird mit den Flags `-v` oder `--v ` gesteuert, gefolgt von einer Ganzzahl, die die Protokollebene darstellt. Allgemeine Protokollierungskonventionen für Kubernetes und die zugehörigen Protokollebenen werden [hier](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md) beschrieben.

Ausführlichkeit | Beschreibung
--------------| -----------
`--v=0` | Allgemein nützlich, damit dies für den Bediener IMMER sichtbar ist.
`--v=1` | Eine vernünftige Standardprotokollebene, wenn Sie keine Ausführlichkeit wünschen.
`--v=2` | Nützliche Informationen zum stabilen Status des Dienstes und wichtige Protokollnachrichten, die möglicherweise zu erheblichen Änderungen im System führen. Dies ist die empfohlene Standardprotokollebene für die meisten Systeme.
`--v=3` | Erweiterte Informationen zu Änderungen.
`--v=4` | Debug-Level-Ausführlichkeit.
`--v=6` | Angeforderte Ressourcen anzeigen
`--v=7` | HTTP-Anforderungsheader anzeigen
`--v=8` | HTTP-Anforderungsinhalt anzeigen
`--v=9` | HTTP-Anforderungsinhalt anzeigen, ohne den Inhalt zu kürzen.

{{% /capture %}}

{{% capture whatsnext %}}

* Lernen Sie mehr im [Überblick auf kubectl](/docs/reference/kubectl/overview/).

* Erkunden Sie [kubectl](/docs/reference/kubectl/kubectl/) Optionen.

* Und ebenfalls die [kubectl Nutzungskonventionen](/docs/reference/kubectl/conventions/) um zu verstehen, wie man es in wiederverwendbaren Skripten verwendet.

* Entdecken Sie mehr Community [kubectl Spickzettel](https://github.com/dennyzhang/cheatsheet-kubernetes-A4).

{{% /capture %}}
