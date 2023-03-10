---
layout: blog
title: "k8s.gcr.io Image Registry Will Be Frozen From the 3rd of April 2023"
date: 2023-02-06
slug: k8s-gcr-io-freeze-announcement
---

**Authors**: Michael Mueller (Giant Swarm)

Das Kubernetes-Projekt betreibt eine zur Community gehörende Container-Image-Registry namens `registry.k8s.io`, um die zum Projekt gehörenden Container-Images hosten. Am 3. April 2023 wird dies Registry `k8s.gcr.io` eingefroren und es werden keine weiteren Container-Images für Kubernetes und der Teilprojekte in die alte Registry gepusht.

Die Registry `registry.k8s.io` ist bereits seit einigen Monaten verfügbar und wird die alte Registry ersetzten. Wir haben einen [Blogbeitrag](/blog/2022/11/28/registry-k8s-io-faster-cheaper-ga/) über die Vorteile für die Community und das Kubernetes-Projekt veröffentlicht. In diesem Beitrag wurde auch angekündigt, dass zukünftige Versionen von Kubernetes nicht mehr in der alten Registry verfügbar sein werden. Jetzt ist diese Zeit gekommen.

Was bedeutet dies für die Contributors:
- Wenn Du ein maintainer eines Teilprojekts bist, musst Du die Manifeste und Helm-Charts entsprechend anpassen, um die neue Container-Registry zu verwenden.

Was bedeutet dies Änderung für Endnutzer:
- 1.27 Kubernetes release wird nicht auf der alten Registry veröffentlicht.
- Patchreleases für 1.24, 1.25 und 1.26 werden ab April nicht mehr in der alten Container-Registry veröffentlicht. Bitte beachte den untenstehenden Zeitplan für Details zu Patchreleases in der alten Container-Registry.
- Beginnend mit 1.25, die Standardeinstellung der Container-Registry wurde auf `registry.k8s.io` geändert. Dieser Wert wird von `kubeadm` und dem `kubelet` überschrieben, sollte der Wert jedoch auf `k8s.gcr.io` geändert werden, wird dies für neue Releases ab April fehlschlagen, die diese nicht in die alte Image-Registry gepusht werden.
- Solltest Du die Zuverlässigkeit der Cluster erhöhen wollen und Abhänigkeiten zu dem zur Community gehörende Container-Image-Registry auflösen wollen, oder betreibst Cluster in einer Umgebung mit eingeschränktem Zugriff auf externe Ressourcen, solltest Du überlgen eine lokale Image-Registry als Mirror zu betreiben. Einige Cloud-Anbieter haben hierfür entsprechende Angebote.

## Zeitplan der Änderungen

- `k8s.gcr.io` wird zum 3.April 2023 eingefroren
- Der 1.27 Release wird zum 12.April 2023 erwartet
- Das letzte 1.23 Release auf `k8s.gcr.io` wird 1.23.18 sein (1.23 wird end-of-life vor dem einfrieren erreichen)
- Das letzte 1.24 Release auf `k8s.gcr.io` wird 1.24.12 sein
- Das letzte 1.25 Release auf `k8s.gcr.io` wird 1.25.8 sein
- Das letzte 1.26 Release auf `k8s.gcr.io` wird 1.26.3 sein

## Was geschieht nun?

Bitte stelle sicher das deine Cluster keine Abhängigkeiten zu der Alten Image-Registry hat. Zum Beispiel, kannst Du dieses Kommando ausführen eine Liste zu erhalten welche Images ein Pod verwendet:

```shell
kubectl get pods --all-namespaces -o jsonpath="{.items[*].spec.containers[*].image}" |\
tr -s '[[:space:]]' '\n' |\
sort |\
uniq -c
```

Es können noch weitere Abhängigkeiten zu der alten Image-Registry bestehen, stelle sicher das du alle möglichen Abhängigkeiten überprüfst um die Cluster funktional und auf dem neuesten Stand zu halten.
## Acknowledgments

__Change is hard__, die Weiterentwicklung unserer Image-Registry ist notwendig, um eine nachhaltige Zukunft für das Projekt zu gewährleisten. Wir bemühen uns, Dinge für alle, die Kubernetes nutzen, zu verbessern. Viele Mitwirkende aus allen Ecken unserer Community haben lange und hart daran gearbeitet, sicherzustellen, dass wir die bestmöglichen Entscheidungen treffen, Pläne umsetzen und unser Bestes tun, um diese Pläne zu kommunizieren. 

Dank geht an Aaron Crickenberger, Arnaud Meukam, Benjamin Elder, Caleb Woodbine, Davanum Srinivas, Mahamed Ali, und Tim Hockin von SIG K8s Infra, Brian McQueen, und Sergey Kanzhelev von SIG Node, Lubomir Ivanov von SIG Cluster Lifecycle, Adolfo García Veytia, Jeremy Rickard, Sascha Grunert, und Stephen Augustus von SIG Release, Bob Killen und Kaslin Fields von SIG Contribex, Tim Allclair von the Security Response Committee. Also a big thank you to our friends acting as liaisons with our cloud provider partners: Jay Pipes von Amazon und Jon Johnson Jr. von Google.