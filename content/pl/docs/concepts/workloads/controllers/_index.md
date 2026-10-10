---
title: "Zarządzanie Workloadem"
weight: 20
simple_list: true
---

Kubernetes udostępnia kilka wbudowanych interfejsów API do deklaratywnego
zarządzania Twoim
{{< glossary_tooltip text="workloadem" term_id="workload" >}} oraz jego komponentami.

Twoje aplikacje działają jako kontenery wewnątrz
{{< glossary_tooltip term_id="Pod" text="Podów" >}}; jednakże zarządzanie pojedynczymi Podami wiąże się z
dużym wysiłkiem. Na przykład, jeśli jeden Pod ulegnie awarii, prawdopodobnie
będziesz chciał uruchomić nowy Pod, aby go zastąpić. Kubernetes może to zrobić za Ciebie.

Używasz API Kubernetesa aby utworzyć {{< glossary_tooltip text="obiekt" term_id="object" >}}
zadania (workload), który reprezentuje wyższy poziom abstrakcji niż
Pod, a następnie {{< glossary_tooltip text="warstwa sterowania" term_id="control-plane" >}}
Kubernetesa automatycznie zarządza obiektami Pod w Twoim
imieniu, na podstawie specyfikacji zdefiniowanego przez Ciebie obiektu tego workloadu.

Wbudowane interfejsy API do zarządzania workloadami to:

[Deployment](/docs/concepts/workloads/controllers/deployment/) (oraz pośrednio
[ReplicaSet](/docs/concepts/workloads/controllers/replicaset/)), to najczęstszy
sposób uruchamiania aplikacji w klastrze. Deployment jest odpowiedni do
zarządzania aplikacją bezstanową w klastrze, gdzie każdy Pod w Deployment jest wymienny i może
być zastąpiony w razie potrzeby. (Deploymenty zastępują przestarzałe
{{< glossary_tooltip text="ReplicationController" term_id="replication-controller" >}} API).

[StatefulSet](/docs/concepts/workloads/controllers/statefulset/) pozwala
na zarządzanie jednym lub wieloma Podami – wszystkie uruchamiają ten sam
kod aplikacji – gdzie Pody opierają się na posiadaniu unikalnej tożsamości.
Jest to inne niż w przypadku Deployment, gdzie oczekuje się, że Pody są
wymienne. Najczęstszym zastosowaniem StatefulSet jest możliwość powiązania
jego Podów z ich trwałą pamięcią masową. Na przykład, można uruchomić
StatefulSet, który kojarzy każdy Pod z [PersistentVolume](/docs/concepts/storage/persistent-volumes/).
Jeśli jeden z Podów w StatefulSet ulegnie awarii,
Kubernetes tworzy zastępczy Pod, który jest połączony z tym samym PersistentVolume.

[DaemonSet](/docs/concepts/workloads/controllers/daemonset/) definiuje Pody,
które zapewniają funkcje lokalne dla określonego
{{< glossary_tooltip text="węzła" term_id="node" >}}; na przykład sterownik, który umożliwia kontenerom na tym
węźle dostęp do systemu przechowywania danych. DaemonSet jest wykorzystywany w
sytuacjach, gdy sterownik lub inna usługa na poziomie węzła musi działać na
konkretnym węźle. Każdy Pod w DaemonSet pełni rolę podobną do demona systemowego na
klasycznym serwerze Unix / POSIX. DaemonSet może być kluczowy dla działania twojego
klastra, na przykład jako wtyczka, która pozwala temu węzłowi uzyskać dostęp do
[sieci klastrowej](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model),
może pomóc w zarządzaniu węzłem albo
zapewnia mniej istotne funkcje, które wzbogacają używaną platformę kontenerową. Możesz uruchamiać
DaemonSety (i ich pody) na każdym węźle w twoim klastrze, lub tylko
na podzbiorze (na przykład instalując sterownik GPU tylko na węzłach, które mają zainstalowany GPU).

Możesz użyć [Job](/docs/concepts/workloads/controllers/job/) i/lub
[CronJob](/docs/concepts/workloads/controllers/cron-jobs/) do zdefiniowania zadań, które
działają do momentu ukończenia, a następnie się zatrzymują. `Job` reprezentuje
jednorazowe zadanie, podczas gdy każdy `CronJob` powtarza się zgodnie z harmonogramem.

Inne tematy w tej sekcji:
<!-- relies on simple_list: true in the front matter -->
