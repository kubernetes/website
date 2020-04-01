---
title: Pojęcia
main_menu: true
content_template: templates/concept
weight: 40
---

{{% capture overview %}}

Rozdział dotyczący pojęć ma za zadanie pomóc w zrozumieniu poszczególnych składowych systemu oraz obiektów abstrakcyjnych, których Kubernetes używa do reprezentacji {{< glossary_tooltip text="klastra" term_id="cluster" length="all" >}}, a także posłużyć do lepszego poznania działania całego systemu.

{{% /capture %}}

{{% capture body %}}

## Przegląd

Pracując w środowisku Kubernetes, używasz *obiektów API Kubernetes* aby opisać *zamierzony stan* klastra: jakie aplikacje lub inne zadania chcesz uruchomić, jakich obrazów kontenerów chcesz użyć, ilu replik potrzebujesz, które zasoby dyskowe i sieciowe chcesz udostępnić itp. Zamierzony stan uzyskuje się definiując obiekty API Kubernetes, zazwyczaj przy pomocy polecenia `kubectl`. Możesz także używać API bezpośrednio, aby konfigurować i modyfikować stan klastra.

Gdy tylko zdefiniujesz zamierzony stan, warstwa sterowania Kubernetes (*Kubernetes Control Plane*) podejmuje działania, aby aktualny stan klastra był zgodny ze stanem zamierzonym, wykorzystując do tego Pod Lifecycle Event Generator ([PLEG](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/node/pod-lifecycle-event-generator.md)). W tym celu Kubernetes wykonuje szereg automatycznych zadań, takich jak start lub restart kontenerów, skalowanie liczby replik dla danej aplikacji itp. Warstwa sterowania Kubernetes to zbiór różnych procesów działających na klastrze:

* **Kubernetes Master** to zbiór trzech procesów uruchamianych na pojedynczym węźle klastra, który pełni rolę węzła _master_. Te procesy to: [kube-apiserver](/docs/admin/kube-apiserver/), [kube-controller-manager](/docs/admin/kube-controller-manager/) oraz [kube-scheduler](/docs/admin/kube-scheduler/).
* Na każdym węźle klastra, nie będącym węzłem typu _Master_, działają dwa procesy:
  * **[kubelet](/docs/admin/kubelet/)**, który komunikuje się z Kubernetes Master.
  * **[kube-proxy](/docs/admin/kube-proxy/)**, proxy sieciowe pośredniczące w usługach sieciowych Kubernetes.

## Obiekty Kubernetes

Kubernetes składa się z różnych abstrakcyjnych obiektów, które reprezentują stan systemu: wdrożone aplikacje i zadania w kontenerach, powiązane zasoby sieciowe i dyskowe oraz inne informacje o tym, co się dzieje na klasterze. Te abstrakcyjne obiekty są reprezentowane przez API Kubernetes. [Opis obiektów w Kubernetesie](/docs/concepts/overview/working-with-objects/kubernetes-objects/#kubernetes-objects) zawiera więcej szczegółów na ten temat.

Do podstawowych obiektów Kubernetes należą:

* [Pod](/docs/concepts/workloads/pods/pod-overview/)
* [Service *(Serwis)*](/docs/concepts/services-networking/service/)
* [Volume *(Wolumin)*](/docs/concepts/storage/volumes/)
* [Namespace *(Przestrzeń nazw)*](/docs/concepts/overview/working-with-objects/namespaces/)

Kubernetes zawiera także obiekty abstrakcyjne wyższego poziomu, zbudowane z obiektów podstawowych przy wykorzystaniu [kontrolerów](/docs/concepts/architecture/controller/), które dostarczają dodatkowe funkcjonalności i udogodnienia. Należą do nich:

 * [Deployment](/docs/concepts/workloads/controllers/deployment/)
 * [DaemonSet](/docs/concepts/workloads/controllers/daemonset/)
 * [StatefulSet](/docs/concepts/workloads/controllers/statefulset/)
 * [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/)
 * [Job](/docs/concepts/workloads/controllers/jobs-run-to-completion/)

## Warstwa sterowania (*Kubernetes Control Plane*) {#warstwa-sterowania}

Różne komponenty warstwy sterowania, takie jak: *Kubernetes Master* czy *kubelet*, odpowiadają za to, jak Kubernetes komunikuje się z klastrem. Warstwa sterowania przechowuje informacje o wszystkich obiektach Kubernetes w systemie i w sposób ciągły steruje ich stanem. Pętle sterowania reagują na zmiany zachodzące w klastrze w sposób ciągły, starając się doprowadzić, aby stan faktyczny wszystkich obiektów odpowiadał stanowi zamierzonemu przez użytkownika.

Przykładowo, kiedy używasz Kubernetes API do stworzenia Deploymentu, podajesz oczekiwany stan systemu. Warstwa sterowania Kubernetes zapisuje stworzenie tego obiektu, a następnie realizuje Twoje polecenie startując wymagane aplikacje i zlecając ich uruchomienie na węzłach klastra - w ten sposób starając się zapewnić, że faktyczny stan klastra jest zgodny ze stanem zamierzonym.

### Kubernetes Master

*Kubernetes Master* odpowiada za utrzymanie klastra w zamierzonym stanie. Za każdym razem, kiedy korzystasz z `kubectl`, łączysz się z węzłem typu *master* danego klastra.

> "*Master*" odnosi się do zbioru procesów zarządzających stanem klastra. Zazwyczaj procesy te są uruchomione na pojedynczym węźle klastra, który jest określany jako "master". Master może być też zreplikowany w celu zagwarantowania wyższej dostępności i niezawodności.

### Węzły (*Kubernetes Nodes*) {#wezly}

Węzły klastra to maszyny (wirtualne, fizyczne i in.), na których uruchamiane są aplikacje i inne zadania. Kubernetes master steruje każdym z węzłów — rzadko kiedy zachodzi konieczność bezpośredniej interakcji z węzłami.

{{% /capture %}}

{{% capture whatsnext %}}

Jeśli chcesz dodać stronę z nowym pojęciem, odwiedź
[Jak używać szablonu strony](/docs/home/contribute/page-templates/)
aby dowiedzieć się o tworzeniu stron opisujących pojęcia i o dostępnych szablonach.

{{% /capture %}}
