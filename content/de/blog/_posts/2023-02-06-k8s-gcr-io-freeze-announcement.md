---
layout: blog
title: "k8s.gcr.io Image Registry Will Be Frozen From the 3rd of April 2023"
date: 2023-03-10
slug: k8s-gcr-io-freeze-announcement
---

**Authors**: Michael Mueller (Giant Swarm)

Das Kubernetes-Projekt betreibt eine zur Community gehörende Container-Image-Registry namens `registry.k8s.io`, um die zum Projekt gehörenden Container-Images zu hosten. Am 3. April 2023 wird diese Container-Image-Registry `k8s.gcr.io` eingefroren und es werden keine weiteren Container-Images für Kubernetes und Teilprojekte in die alte Registry gepusht.

Die Container-Image-Registry `registry.k8s.io` ist bereits seit einigen Monaten verfügbar und wird die alte Registry ersetzen. Wir haben einen [Blogbeitrag](/blog/2022/11/28/registry-k8s-io-faster-cheaper-ga/) über die Vorteile für die Community und das Kubernetes-Projekt veröffentlicht. In diesem Beitrag wurde auch angekündigt, dass zukünftige Versionen von Kubernetes nicht mehr in der alten Registry Released sein werden.

Was bedeutet dies für Contributors:
- Wenn Du ein Maintainer eines Teilprojekts bist, musst du die Manifeste und Helm-Charts entsprechend anpassen, um die neue Container-Registry zu verwenden.

Was bedeutet dies Änderung für Endanwender:
- Das Kubernetes Release 1.27 wird nicht auf der alten Registry veröffentlicht.
- Patchreleases für 1.24, 1.25 und 1.26 werden ab April nicht mehr in der alten Container-Image-Registry veröffentlicht. Bitte beachte den untenstehenden Zeitplan für die Details zu Patchreleases in der alten Container-Registry.
- Beginnend mit dem Release 1.25, wurde die Standardeinstellung der Container-Image-Registry auf `registry.k8s.io` geändert. Diese Einstellung kann in `kubeadm` und dem `kubelet` abgeändert werden, sollte der Wert jedoch auf `k8s.gcr.io` gesetzt werden, wird dies für neue Releases ab April fehlschlagen, da diese nicht in die alte Container-Image-Registry gepusht werden.
- Solltest Du die Zuverlässigkeit der Cluster erhöhen wollen und Abhängigkeiten zu dem zur Community gehörenden Container-Image-Registry auflösen wollen, oder betreibst Cluster in einer Umgebung mit eingeschränktem externen Netzwerkzugriff, solltest Du in Betracht ziehen eine lokale Container-Image-Registry als Mirror zu betreiben. Einige Cloud-Anbieter haben hierfür entsprechende Angebote.

## Zeitplan der Änderungen

- `k8s.gcr.io` wird zum 3.April 2023 eingefroren
- Der 1.27 Release wird zum 12.April 2023 erwartet
- Das letzte 1.23 Release auf `k8s.gcr.io` wird 1.23.18 sein (1.23 wird end-of-life vor dem einfrieren erreichen)
- Das letzte 1.24 Release auf `k8s.gcr.io` wird 1.24.12 sein
- Das letzte 1.25 Release auf `k8s.gcr.io` wird 1.25.8 sein
- Das letzte 1.26 Release auf `k8s.gcr.io` wird 1.26.3 sein

## Was geschieht nun

Bitte stelle sicher, dass die Cluster keine Abhängigkeiten zu der Alten Container-Image-Registry haben. Dies kann zum Beispiel folgendermaßen überprüft werden, durch Ausführung des fogenden Kommandos erhält man eine Liste der Container-Images die ein Pod verwendet:

```shell
kubectl get pods --all-namespaces -o jsonpath="{.items[*].spec.containers[*].image}" |\
tr -s '[[:space:]]' '\n' |\
sort |\
uniq -c
```

Es können durchaus weitere Abhängigkeiten zu der alten Container-Image-Registry bestehen, stelle also sicher, dass du alle möglichen Abhängigkeiten überprüfst, um die Cluster funktional und auf dem neuesten Stand zu halten.
## Acknowledgments

__Change is hard__, die Weiterentwicklung unserer Container-Image-Registry ist notwendig, um eine nachhaltige Zukunft für das Projekt zu gewährleisten. Wir bemühen uns, Dinge für alle, die Kubernetes nutzen, zu verbessern. Viele Mitwirkende aus allen Ecken unserer Community haben lange und hart daran gearbeitet, sicherzustellen, dass wir die bestmöglichen Entscheidungen treffen, Pläne umsetzen und unser Bestes tun, um diese Pläne zu kommunizieren. 

Dank geht an Aaron Crickenberger, Arnaud Meukam, Benjamin Elder, Caleb Woodbine, Davanum Srinivas, Mahamed Ali, und Tim Hockin von SIG K8s Infra, Brian McQueen, und Sergey Kanzhelev von SIG Node, Lubomir Ivanov von SIG Cluster Lifecycle, Adolfo García Veytia, Jeremy Rickard, Sascha Grunert, und Stephen Augustus von SIG Release, Bob Killen und Kaslin Fields von SIG Contribex, Tim Allclair von the Security Response Committee. Also a big thank you to our friends acting as liaisons with our cloud provider partners: Jay Pipes von Amazon und Jon Johnson Jr. von Google.