---
title: Kontenery
weight: 40
description: System "pakowania" aplikacji i jej zależności w spójne środowisko uruchomieniowe.
content_type: concept
card:
  name: concepts
  weight: 50
---




<!-- overview -->

Ta strona omawia kontenery i obrazy kontenerów, a także ich zastosowanie w utrzymaniu systemów i tworzeniu rozwiązań.

Słowo _kontener (ang. container)_ jest wieloznacznym pojęciem. Zawsze, gdy go używasz, sprawdź, czy Twoi odbiorcy stosują tę samą definicję.

Każdy uruchamiany kontener jest powtarzalny;
standaryzacja wynikająca z uwzględnienia zależności oznacza, że uzyskujesz
to samo zachowanie, gdziekolwiek go uruchomisz.

Kontenery oddzielają aplikacje od infrastruktury hosta. To ułatwia
wdrażanie w różnych środowiskach chmurowych lub systemach operacyjnych.

Każdy {{< glossary_tooltip text="węzeł" term_id="node" >}} w klastrze
Kubernetesa uruchamia kontenery, które tworzą
[Pody](/docs/concepts/workloads/pods/) przypisane do tego węzła. Kontenery należące do jednego
Poda są uruchamiane razem na tym samym węźle w ramach wspólnego harmonogramu.


<!-- body -->

## Obrazy kontenerów {#container-images}
[Obraz kontenera](/docs/concepts/containers/images/) to gotowy do
uruchomienia pakiet oprogramowania zawierający wszystko, co jest potrzebne do
uruchomienia aplikacji: kod i wszelkie wymagane środowiska uruchomieniowe,
biblioteki aplikacji i systemowe, oraz wartości domyślne dla wszelkich niezbędnych ustawień.

Kontenery są przeznaczone do bycia bezstanowymi i
[niezmiennymi](https://glossary.cncf.io/immutable-infrastructure/):
nie powinieneś zmieniać kodu kontenera,
który już działa. Jeśli masz aplikację konteneryzowaną i
chcesz dokonać zmian, właściwym procesem jest
zbudowanie nowego obrazu zawierającego zmiany, a następnie
odtworzenie kontenera w celu uruchomienia go z zaktualizowanego obrazu.

## Środowiska uruchomieniowe kontenerów {#container-runtimes}

{{< glossary_definition term_id="container-runtime" length="all" >}}

Zazwyczaj możesz pozwolić swojemu klastrowi na wybranie domyślnego środowiska
uruchomieniowego kontenera dla Poda. Jeśli musisz używać więcej niż jednego
środowiska uruchomieniowego kontenera w swoim klastrze, możesz określić
[RuntimeClass](/docs/concepts/containers/runtime-class/) dla Poda, aby upewnić się, że
Kubernetes uruchamia te kontenery przy użyciu konkretnego środowiska uruchomieniowego kontenera.

Możesz również użyć RuntimeClass, aby uruchamiać różne Pody z tym
samym środowiskiem uruchomieniowym kontenera, ale z różnymi ustawieniami.
