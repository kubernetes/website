---
title: "Workload"
weight: 55
description: >
  Poznaj Pody – podstawowy element obliczeniowy w Kubernetes – oraz mechanizmy ułatwiające ich wdrażanie.
no_list: true
card:
  title: Workload i Pody
  name: concepts
  weight: 60
---

{{< glossary_definition term_id="workload" length="short" >}} Niezależnie
od tego, czy Twój workload jest pojedynczym komponentem, czy kilkoma
współpracującymi ze sobą, na Kubernetes uruchamiasz go wewnątrz zestawu
[_podów_](/docs/concepts/workloads/pods). Pod reprezentuje zestaw uruchomionych
{{< glossary_tooltip text="kontenerów" term_id="container" >}} na Twoim klastrze.

Pody mają [zdefiniowany cykl życia](/docs/concepts/workloads/pods/pod-lifecycle/). Na
przykład, gdy Pod działa w twoim klastrze, krytyczna awaria na
{{< glossary_tooltip text="węźle" term_id="node" >}}, na którym ten Pod działa, oznacza, że wszystkie Pody na tym węźle
przestają działać. Kubernetes traktuje ten typ awarii jako ostateczny: przywrócenie działania
wymaga utworzenia nowego Poda, nawet jeśli węzeł później zostanie przywrócony do pełnej sprawności.

Jednak, aby znacznie ułatwić sobie życie, nie musisz zarządzać każdym
Podem bezpośrednio. Zamiast tego, możesz użyć obiektów dedykowanych do obsługi _workload-ów_,
które zarządzają zestawem Podów w Twoim imieniu. Te zasoby konfigurują
{{< glossary_tooltip term_id="controller" text="kontrolery" >}}, które
zapewniają, że odpowiednia liczba Podów działa, zgodnie z tym, co zdefiniowałeś.

Kubernetes udostępnia kilka wbudowanych typów obiektów przeznaczonych do obsługi   _workload-ów_:

* [Deployment](/docs/concepts/workloads/controllers/deployment/) i
  [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/) (zastępując przestarzały zasób
  {{< glossary_tooltip text="ReplicationController" term_id="replication-controller" >}}). Deployment
  jest odpowiedni do zarządzania bezstanowym workloadem aplikacji w
  klastrze, gdzie każdy Pod w Deployment jest wymienny i może być zastąpiony, jeśli to konieczne.
* [StatefulSet](/docs/concepts/workloads/controllers/statefulset/) pozwala na
  uruchomienie jednego lub więcej powiązanych Podów, które przechowują stan i potrafią go
  odtwarzać. Na przykład, jeśli Twój workload zapisuje dane w sposób trwały, możesz
  uruchomić StatefulSet, który wiąże każdy Pod z [PersistentVolume](/docs/concepts/storage/persistent-volumes/).
  Twój kod, działający w ramach Podów dla tego StatefulSet, może
  replikować dane do innych Podów w tym samym StatefulSet, aby poprawić ogólną odporność na awarie.
* [DaemonSet](/docs/concepts/workloads/controllers/daemonset/) definiuje Pody,
  które zapewniają funkcje lokalne dla węzłów. Za każdym razem, gdy dodajesz węzeł do
  swojego klastra, który pasuje do specyfikacji w DaemonSet, warstwa sterowania zleca uruchomienie
  Poda dla tego DaemonSet na nowym węźle. Każdy Pod w DaemonSet
  wykonuje zadanie podobne do demona systemowego na klasycznym serwerze Unix / POSIX.
  DaemonSet może być fundamentalny dla działania twojego klastra, na przykład jako
  wtyczka do uruchamiania [infrastuktury sieciowej klastra](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model),
  może pomóc w
  zarządzaniu węzłem, lub może zapewniać opcjonalne funkcje, które ulepszają platformę kontenerową.
* [Job](/docs/concepts/workloads/controllers/job/) i
  [CronJob](/docs/concepts/workloads/controllers/cron-jobs/) oferują różne sposoby
  definiowania zadań, które uruchamiają się do zakończenia, a następnie
  zatrzymują. Możesz użyć [Job](/docs/concepts/workloads/controllers/job/),
  aby zdefiniować zadanie, które uruchamia się do zakończenia, tylko
  raz. Możesz użyć [CronJob](/docs/concepts/workloads/controllers/cron-jobs/),
  aby uruchomić to samo zadanie (Job) wielokrotnie według harmonogramu.

W szerszym ekosystemie Kubernetesa można znaleźć definicje zadań od firm trzecich, które
zapewniają dodatkowe zachowania. Korzystając z [Custom Resource Definition](/docs/concepts/extend-kubernetes/api-extension/custom-resources/),
można dodać definicję zadania od firmy
trzeciej, jeśli chcesz uzyskać określone działanie, które nie jest częścią podstawowej wersji
Kubernetesa. Na przykład, jeśli chcesz uruchomić grupę Podów dla swojej aplikacji, ale
zatrzymać pracę, jeśli _wszystkie_ Pody nie są dostępne (może dla jakiegoś zadania
wysokoprzepustowego rozproszonego), to można zaimplementować lub zainstalować rozszerzenie, które oferuje tę funkcję.

## {{% heading "whatsnext" %}}

Oprócz przeczytania informacji o każdym rodzaju API do zarządzania workloadami,
możesz dowiedzieć się, jak wykonywać konkretne zadania:

* [Uruchom aplikację bezstanową za pomocą Deployment](/docs/tasks/run-application/run-stateless-application-deployment/)
* Uruchom aplikację stanową jako [pojedynczą instancję](/docs/tasks/run-application/run-single-instance-stateful-application/)
  lub jako [zestaw zreplikowany](/docs/tasks/run-application/run-replicated-stateful-application/)
* [Uruchamianie zadań automatycznych za pomocą CronJob](/docs/tasks/job/automated-tasks-with-cron-jobs/)

Aby dowiedzieć się więcej o mechanizmach Kubernetesa służących do
oddzielania kodu od konfiguracji, odwiedź [Konfiguracja](/docs/concepts/configuration/).

Istnieją dwie wspomagające koncepcje, które dostarczają
informacji o tym, jak Kubernetes zarządza Podami dla aplikacji:
* [Mechanizm usuwania zbędnych obiektów (ang. Garbage collection)](/docs/concepts/architecture/garbage-collection/)
  porządkuje obiekty z klastra po usunięciu ich _zasobu właściciela_.
* [_Kontroler czasu życia po zakończeniu_ (time-to-live after finished)](/docs/concepts/workloads/controllers/ttlafterfinished/)
  usuwa zadania (Jobs) po upływie określonego czasu od ich zakończenia.

Gdy Twoja aplikacja jest uruchomiona, możesz chcieć udostępnić ją w internecie jako
[Service](/docs/concepts/services-networking/service/) lub, tylko dla
aplikacji webowych, używając [Ingress](/docs/concepts/services-networking/ingress).

