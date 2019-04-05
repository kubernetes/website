---
title: Kubernetes lokal über Minikube betreiben
content_template: templates/concept
---

{{% capture overview %}}

Minikube ist ein Tool, mit dem Kubernetes lokal einfach ausgeführt werden kann. Minikube führt einen Kubernetes-Cluster mit einem einzigen Node in einer VM auf Ihrem Laptop aus, damit Anwender Kubernetes ausprobieren oder täglich damit entwickeln können.

{{% /capture %}}

{{% capture body %}}

## Minikube-Funktionen

* Minikube unterstützt Kubernetes-Funktionen wie:
  * DNS
  * NodePorts
  * ConfigMaps and Secrets
  * Dashboards
  * Container Laufzeiumgebungen: Docker, [rkt](https://github.com/rkt/rkt), [CRI-O](https://github.com/kubernetes-incubator/cri-o) und [containerd](https://github.com/containerd/containerd)
  * Unterstützung von CNI (Container Network Interface)
  * Ingress

## Installation

Lesen Sie [Minikube installieren](/docs/tasks/tools/install-minikube/) für Informationen zur Installation von Minikubes.

## Schnellstart

Folgend finden Sie eine kurze Demo zur Verwendung von Minikube.
Wenn Sie den VM-Treiber ändern möchten, fügen Sie das entsprechende `--vm-driver=xxx`-Flag zu `minikube start` hinzu. 
Minikube unterstützt die folgenden Treiber:

* virtualbox
* vmwarefusion
* kvm2 ([Treiber installation](https://git.k8s.io/minikube/docs/drivers.md#kvm2-driver))
* kvm ([Treiber installation](https://git.k8s.io/minikube/docs/drivers.md#kvm-driver))
* hyperkit ([Treiber installation](https://git.k8s.io/minikube/docs/drivers.md#hyperkit-driver))
* xhyve ([Treiber installation](https://git.k8s.io/minikube/docs/drivers.md#xhyve-driver)) (deprecated)
* hyperv ([Treiber installation](https://github.com/kubernetes/minikube/blob/master/docs/drivers.md#hyperv-driver))
Beachten Sie, dass die unten angegebene IP-Adresse dynamisch ist und sich ändern kann. Sie kann mit `minikube ip` abgerufen werden.
* none (Führt die Kubernetes-Komponenten auf dem Host und nicht in einer VM aus. Die Verwendung dieses Treibers erfordert Docker ([Docker installieren](https://docs.docker.com/install/linux/docker-ce/ubuntu/)) und eine Linux-Umgebung)

```shell
minikube start
```
```
Starting local Kubernetes cluster...
Running pre-create checks...
Creating machine...
Starting local Kubernetes cluster...
```
```shell
kubectl run hello-minikube --image=k8s.gcr.io/echoserver:1.10 --port=8080
```
```
deployment.apps/hello-minikube created
```

```shell
kubectl expose deployment hello-minikube --type=NodePort
```
```
service/hello-minikube exposed
```
```
# Wir haben jetzt einen echoserver Pod gestartet, aber wir müssen warten, 
# bis der Pod betriebsbereit ist, bevor wir über den exponierten Dienst auf ihn zugreifen können.
# Um zu überprüfen, ob der Pod läuft, können wir Folgendes verwenden:
kubectl get pod
```
```
NAME                              READY     STATUS              RESTARTS   AGE
hello-minikube-3383150820-vctvh   0/1       ContainerCreating   0          3s
```
```
# Wir können anhand des ContainerCreating-Status sehen, dass der Pod immer noch erstellt wird.
kubectl get pod
```
```
NAME                              READY     STATUS    RESTARTS   AGE
hello-minikube-3383150820-vctvh   1/1       Running   0          13s
```
```
# Wir können sehen, dass der Pod jetzt läuft und wir können ihn jetzt mit curl kontaktieren:
curl $(minikube service hello-minikube --url)
```
```

Hostname: hello-minikube-7c77b68cff-8wdzq

Pod Information:
	-no pod information available-

Server values:
	server_version=nginx: 1.13.3 - lua: 10008

Request Information:
	client_address=172.17.0.1
	method=GET
	real path=/
	query=
	request_version=1.1
	request_scheme=http
	request_uri=http://192.168.99.100:8080/

Request Headers:
	accept=*/*
	host=192.168.99.100:30674
	user-agent=curl/7.47.0

Request Body:
	-no body in request-
```

```shell
kubectl delete services hello-minikube
```
```
service "hello-minikube" deleted
```

```shell
kubectl delete deployment hello-minikube
```
```
deployment.extensions "hello-minikube" deleted
```

```shell
minikube stop
```
```
Stopping local Kubernetes cluster...
Stopping "minikube"...
```

### Alternative Containerlaufzeitumgebungen

#### containerd

Um [containerd](https://github.com/containerd/containerd) als Containerlaufzeitumgebung zu verwenden, führen Sie den folgenden Befehl aus:

```bash
minikube start \
    --network-plugin=cni \
    --enable-default-cni \
    --container-runtime=containerd \
    --bootstrapper=kubeadm
```

Oder verwenden Sie die erweiterte Version:

```bash
minikube start \
    --network-plugin=cni \
    --enable-default-cni \
    --extra-config=kubelet.container-runtime=remote \
    --extra-config=kubelet.container-runtime-endpoint=unix:///run/containerd/containerd.sock \
    --extra-config=kubelet.image-service-endpoint=unix:///run/containerd/containerd.sock \
    --bootstrapper=kubeadm
```

#### CRI-O

Um [CRI-O](https://github.com/kubernetes-incubator/cri-o) als Containerlaufzeitumgebung zu verwenden, führen Sie den folgenden Befehl aus:

```bash
minikube start \
    --network-plugin=cni \
    --enable-default-cni \
    --container-runtime=cri-o \
    --bootstrapper=kubeadm
```

Oder verwenden Sie die erweiterte Version:

```bash
minikube start \
    --network-plugin=cni \
    --enable-default-cni \
    --extra-config=kubelet.container-runtime=remote \
    --extra-config=kubelet.container-runtime-endpoint=/var/run/crio.sock \
    --extra-config=kubelet.image-service-endpoint=/var/run/crio.sock \
    --bootstrapper=kubeadm
```

#### rkt container engine

Um [rkt](https://github.com/rkt/rkt) als Containerlaufzeitumgebung zu verwenden, führen Sie den folgenden Befehl aus:

```shell
minikube start \
    --network-plugin=cni \
    --enable-default-cni \
    --container-runtime=rkt
```

Hierbei wird ein alternatives Minikube-ISO-Image verwendet, das sowohl rkt als auch Docker enthält, und CNI-Netzwerke ermöglichen.

### Treiber Plugins

Weitere Informationen zu unterstützten Treibern und zur Installation von Plugins finden Sie bei Bedarf unter [TREIBER](https://git.k8s.io/minikube/docs/drivers.md).

### Lokale Images durch erneute Verwendung des Docker-Daemon ausführen

Wenn Sie eine einzige Kubernetes VM verwenden, ist es sehr praktisch, den integrierten Docker-Daemon von Minikube wiederzuverwenden; Dies bedeutet, dass Sie auf Ihrem lokalen Computer keine Docker-Registy erstellen und das Image in die Registry importortieren müssen - Sie können einfach innerhalb desselben Docker-Daemons wie Minikube arbeiten, was lokale Experimente beschleunigt. Stellen Sie einfach sicher, dass Sie Ihr Docker-Image mit einem anderen Element als 'latest' versehen, und verwenden Sie dieses Tag, wenn Sie das Image laden. Andernfalls, wenn Sie keine Version Ihres Images angeben, wird es als `:latest` angenommen, mit der Pull-Image-Richtlinie von `Always` entsprechend, was schließlich zu `ErrImagePull` führen kann, da Sie möglicherweise noch keine Versionen Ihres Docker-Images in der Standard-Docker-Registry (normalerweise DockerHub) haben.

Um mit dem Docker-Daemon auf Ihrem Mac/Linux-Computer arbeiten zu können, verwenden Sie den `docker-env`-Befehl in Ihrer Shell:

```shell
eval $(minikube docker-env)
```

Sie sollten nun Docker in der Befehlszeile Ihres Mac/Linux-Computers verwenden können, um mit dem Docker-Daemon in der Minikube-VM zu sprechen:

```shell
docker ps
```

In Centos 7 meldets Docker möglicherweise den folgenden Fehler:

```shell
Could not read CA certificate "/etc/docker/ca.pem": open /etc/docker/ca.pem: no such file or directory
```

Das Update besteht darin, `/etc/sysconfig/docker` zu aktualisieren, um sicherzustellen, dass die Umgebungsänderungen von Minikube beachtet werden:

```shell
< DOCKER_CERT_PATH=/etc/docker
---
> if [ -z "${DOCKER_CERT_PATH}" ]; then
>   DOCKER_CERT_PATH=/etc/docker
> fi
```

Denken Sie daran, `imagePullPolicy: Always` auszuschalten. Andernfalls verwendet Kubernetes keine lokal erstellten Images.

## Cluster verwalten

### Cluster starten

Mit dem Befehl `minikube start` können Sie Ihr Cluster starten.
Dieser Befehl erstellt und konfiguriert eine virtuelle Maschine, auf der ein Kubernetes-Cluster mit einem Knoten ausgeführt wird.
Ebenfalls konfiguriert dieser Befehl auch Ihre [kubectl](/docs/user-guide/kubectl-overview/) Installation zur Kommunikation mit diesem Cluster.

Wenn Sie sich hinter einem Web-Proxy befinden, müssen Sie diese Informationen mit dem Befehl `minikube start` übergeben:

```shell
https_proxy=<mein_proxy> minikube start --docker-env http_proxy=<mein_proxy> --docker-env https_proxy=<mein_proxy> --docker-env no_proxy=192.168.99.0/24
```

Leider wird nur das Setzen der Umgebungsvariablen nicht funktionieren.

Minikube erstellt auch einen "Minikube"-Kontext und setzt ihn in kubectl auf den Standardwert.
Um später wieder zu diesem Kontext zurückzukehren, führen Sie den folgenden Befehl aus: `kubectl config use-context minikube`.

#### Angabe der Kubernetes-Version

Sie können die bestimmte Version von Kubernetes für Minikube angeben, indem Sie die Zeichenfolge `--kubernetes-version` an den Befehl` minikube start` anhängen.
Zum Verwenden der Version `v1.7.3` führen Sie beispielsweise Folgendes aus:

```
minikube start --kubernetes-version v1.7.3
```

### Kubernetes konfigurieren

Minikube verfügt über eine "Konfigurator"-Funktion, mit der Anwender die Kubernetes-Komponenten mit beliebigen Werten konfigurieren können.
Um diese Funktion zu verwenden, setzen Sie das `--extra-config`-Flag an den `minikube start` Befehl.

Dieses Flag wird wiederholt, sodass Sie es mehrere Male mit verschiedenen Werten übergeben können, um mehrere Optionen festzulegen.

Dieses Flag nimmt eine Zeichenkette der Form `component.key=value` an, wobei `component` eine der Zeichenketten aus der unteren Liste ist, `key` ein Wert in der Konfigurationsstruktur ist und `value` der einzustellende Wert ist.

Gültige Schlüssel finden Sie in der Dokumentation der Kubernetes `componentconfigs` für jede Komponente.
Nachstehend die Dokumentation für jede unterstützte Konfiguration:

* [kubelet](https://godoc.org/k8s.io/kubernetes/pkg/kubelet/apis/config#KubeletConfiguration)
* [apiserver](https://godoc.org/k8s.io/kubernetes/cmd/kube-apiserver/app/options#ServerRunOptions)
* [proxy](https://godoc.org/k8s.io/kubernetes/pkg/proxy/apis/config#KubeProxyConfiguration)
* [controller-manager](https://godoc.org/k8s.io/kubernetes/pkg/controller/apis/config#KubeControllerManagerConfiguration)
* [etcd](https://godoc.org/github.com/coreos/etcd/etcdserver#ServerConfig)
* [scheduler](https://godoc.org/k8s.io/kubernetes/pkg/scheduler/apis/config#KubeSchedulerConfiguration)

#### Beispiele

Um die `MaxPods`-Einstellung im Kubelet auf 5 zu ändern, übergeben Sie dieses Flag: `--extra-config=kubelet.MaxPods=5`.

Diese Funktion unterstützt auch verschachtelte Strukturen. Um die `LeaderElection.LeaderElect` Einstellung zu `true` zu ändern, übergeben Sie im Scheduler dieses Flag: `--extra-config=scheduler.LeaderElection.LeaderElect=true`.

Um den `AuthorizationMode` auf dem `apiserver` zu `RBAC` zu ändern, verwenden Sie: `--extra-config=apiserver.authorization-mode=RBAC`.

### Einen Cluster stoppen
Mit dem Befehl `minikube stop` können Sie Ihr Cluster anhalten.
Mit diesem Befehl wird die Minikube Virtual Machine heruntergefahren, der Clusterstatus und die Clusterdaten bleiben jedoch erhalten.
Durch erneutes Starten des Clusters wird der vorherige Status wiederhergestellt.

### Cluster löschen
Der Befehl `minikube delete` kann zum Löschen Ihres Clusters verwendet werden.
Mit diesem Befehl wird die Minikube Virtual Machine heruntergefahren und gelöscht. Keine Daten oder Zustände bleiben erhalten.

## Mit einem Cluster interagieren

### Kubectl

Der `minikube start` Befehl erstellt einen [kubectl Kontext](/docs/reference/generated/kubectl/kubectl-commands#-em-set-context-em-) genannt "minikube".
Dieser Kontext enthält die Konfiguration für die Kommunikation mit Ihrem Minikube-Cluster.

Minikube setzt diesen Kontext automatisch auf den Standardwert, aber wenn Sie in Zukunft wieder darauf zurückgreifen müssen, führen Sie den folgenden Befehl aus:

`kubectl config use-context minikube`,

Oder übergeben Sie den Kontext bei jedem Befehl wie folgt: `kubectl get pods --context=minikube`.

### Dashboard

Um Zugriff auf das [Kubernetes Dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard/) zu erhalten, führen Sie diesen Befehl in einer Shell aus, nachdem Sie Minikube gestartet haben, um die Adresse abzurufen:

```shell
minikube dashboard
```

### Services

Um auf einen Service zuzugreifen, der über einen NodePort verfügbar gemacht wird, führen Sie diesen Befehl in einer Shell aus, nachdem Sie Minikube gestartet haben, um die Adresse abzurufen:

```shell
minikube service [-n NAMESPACE] [--url] NAME
```

## Netzwerk

Die Minikube-VM wird über eine Host-Only-IP-Adresse, die mit dem Befehl `minikube ip` abgerufen werden kann, für das Hostsystem verfügbar gemacht.
Auf alle Dienste des Typs `NodePort` kann über diese IP-Adresse und den NodePort zugegriffen werden.

Um den NodePort für Ihren Dienst zu ermitteln, können Sie einen `kubectl`-Befehl wie folgt verwenden:

`kubectl get service $SERVICE --output='jsonpath="{.spec.ports[0].nodePort}"'`

## Dauerhafte Volumen
Minikube unterstützt [PersistentVolumes](/docs/concepts/storage/persistent-volumes/) des Typs `hostPath`.
Diese dauerhaften Volumen werden einem Verzeichnis in der Minikube-VM zugeordnet.

Die Minikube-VM wird in ein temporäres Dateisystem hochgefahren, sodass die meisten Verzeichnisse nicht nach Neustarts beibehalten werden (`minikube stop`).
Minikube ist jedoch so konfiguriert, dass Dateien beibehalten werden, die in den folgenden Host-Verzeichnissen gespeichert sind:

* `/data`
* `/var/lib/minikube`
* `/var/lib/docker`

Hier ist ein Beispiel einer PersistentVolume-Konfiguration, um Daten im Verzeichnis `/ data` beizubehalten:

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv0001
spec:
  accessModes:
    - ReadWriteOnce
  capacity:
    storage: 5Gi
  hostPath:
    path: /data/pv0001/
```

## Hostordnerfreigabe
Einige Treiber werden einen Hostordner in der VM bereitstellen, sodass Sie Dateien problemlos zwischen VM und Host freigeben können. Diese sind momentan nicht konfigurierbar und unterscheiden sich für den Treiber und das Betriebssystem, das Sie verwenden.

{{< note >}}
Die Hostordnerfreigabe ist noch nicht im KVM-Treiber implementiert.
{{< /note >}}

| Treiber | Betriebssystem | Hostordner | VM |
| --- | --- | --- | --- |
| VirtualBox | Linux | /home | /hosthome |
| VirtualBox | macOS | /Users | /Users |
| VirtualBox | Windows | C://Users | /c/Users |
| VMware Fusion | macOS | /Users | /Users |
| Xhyve | macOS | /Users | /Users |

## Private Containerregistries

Um auf eine private Container Registry zuzugreifen, führen Sie die Schritte [auf dieser Seite aus](/docs/concepts/containers/images/).

Wir empfehlen die Verwendung von `ImagePullSecrets`, wenn Sie jedoch den Zugriff auf die Minikube-VM konfigurieren möchten, können Sie die Datei `.dockercfg` im Verzeichnis`/home/docker` oder die Datei `config.json` im Verzeichnis`/home/docker/.docker` ablegen.

## Add-ons

Damit Minikube benutzerdefinierte Addons ordnungsgemäß starten oder neu starten kann, platzieren Sie die Addons, die mit Minikube gestartet werden sollen, im Verzeichnis `~ /.minikube/addons`.
Addons in diesem Ordner werden in die Minikube-VM verschoben und jedes Mal gestartet, wenn Minikube gestartet oder neu gestartet wird.

## Minikube mit einem HTTP-Proxy verwenden

Minikube erstellt eine virtuelle Maschine, die Kubernetes und einen Docker-Dämon enthält.
Wenn Kubernetes versucht, Container mithilfe von Docker zu planen, erfordert der Docker-Daemon möglicherweise einen externen Netzwerkzugriff, um Container abzurufen.

Wenn Sie sich hinter einem HTTP-Proxy befinden, müssen Sie möglicherweise die Proxy-Einstellungen für Docker angeben.
Übergeben Sie dazu die erforderlichen Umgebungsvariablen während des `minikube start` als Flags.

Zum Beispiel:

```shell
minikube start --docker-env http_proxy=http://$IHRPROXY:PORT \
                 --docker-env https_proxy=https://$IHRPROXY:PORT
```

Wenn die Adresse Ihrer virtuellen Maschine 192.168.99.100 lautet, besteht die Möglichkeit, dass Ihre Proxy-Einstellungen verhindern, dass `kubectl` sie direkt erreicht.
Um die Proxy-Konfiguration für diese IP-Adresse zu umgehen, sollten Sie Ihre no_proxy-Einstellungen ändern. Sie können dies mit dem folgenden Befehl tun:

```shell
export no_proxy=$no_proxy,$(minikube ip)
```

## Bekannte Probleme
* Funktionen, die einen Cloud-Provider erfordern, funktionieren in Minikube nicht. Diese schließen ein:
  * LoadBalancer
* Features, die mehrere Knoten erfordern. Diese schließen ein:
  * Erweiterte Planungsrichtlinien

## Design

Minikube verwendet [libmachine](https://github.com/docker/machine/tree/master/libmachine) zur Bereitstellung von VMs, und [kubeadm](https://github.com/kubernetes/kubeadm) um einen Kubernetes-Cluster in Betrieb zu nehmen.

Weitere Informationen zu Minikube finden Sie im [Vorschlag](https://git.k8s.io/community/contributors/design-proposals/cluster-lifecycle/local-cluster-ux.md).

## Zusätzliche Links

* **Ziele und Nichtziele**: Die Ziele und Nichtziele des Minikube-Projekts finden Sie in unserer [Roadmap](https://git.k8s.io/minikube/docs/contributors/roadmap.md).
* **Entwicklungshandbuch**: Lesen Sie [CONTRIBUTING.md](https://git.k8s.io/minikube/CONTRIBUTING.md) für einen Überblick über das Senden von Pull-Requests.
* **Minikube bauen**: Anweisungen zum Erstellen/Testen von Minikube aus dem Quellcode finden Sie im [build Handbuch](https://git.k8s.io/minikube/docs/contributors/build_guide.md).
* **Neue Abhängigkeit hinzufügen**: Anweisungen zum Hinzufügen einer neuen Abhängigkeit zu Minikube finden Sie in der [Anleitung zum Hinzufügen von Abhängigkeiten](https://git.k8s.io/minikube/docs/contributors/adding_a_dependency.md).
* **Neues Addon hinzufügen**: Anweisungen zum Hinzufügen eines neuen Addons für Minikube finden Sie im [Anleitung zum Hinzufügen eines Addons](https://git.k8s.io/minikube/docs/contributors/adding_an_addon.md).
* **MicroK8s**: Linux-Benutzer, die die Ausführung einer virtuellen Maschine vermeiden möchten, sollten [MicroK8s](https://microk8s.io/) als Alternative in Betracht ziehen.

## Community

Beiträge, Fragen und Kommentare werden begrüßt und ermutigt! Minikube-Entwickler finden Sie in [Slack](https://kubernetes.slack.com) im #minikube Kanal (Erhalten Sie [hier](http://slack.kubernetes.io/) eine Einladung). Wir haben ausserdem die [kubernetes-dev Google Groups-Mailingliste](https://groups.google.com/forum/#!forum/kubernetes-dev). Wenn Sie in der Liste posten, fügen Sie Ihrem Betreff bitte "minikube:" voran.

{{% /capture %}}
