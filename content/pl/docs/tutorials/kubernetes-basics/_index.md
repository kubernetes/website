---
title: Naucz się podstaw Kubernetesa
main_menu: true
no_list: true
weight: 20
content_type: concept
card:
  name: tutorials
  weight: 20
  title: Pierwsze kroki
---

## {{% heading "objectives" %}}

Ten samouczek poprowadzi Cię przez podstawy systemu zarządzania zadaniami na klastrze Kubernetesa. W każdym
module znajdziesz najważniejsze informacje o głównych pojęciach i funkcjonalnościach Kubernetesa. Dzięki
samouczkom nauczysz się zarządzać prostym klasterem i skonteneryzowanymi aplikacjami uruchamianymi na tym klastrze.

Nauczysz się, jak:

* Zainstalować skonteneryzowaną aplikację na klastrze.
* Wyskalować tę instalację.
* Zaktualizować aplikację do nowej wersji.
* Rozwiązywać problemy z aplikacją.

## Co Kubernetes może dla Ciebie zrobić? {#what-can-kubernetes-do-for-you}

Użytkownicy oczekują od współczesnych serwisów internetowych dostępności non-stop, a deweloperzy
chcą móc instalować nowe wersje swoich serwisów kilka razy dziennie. Używając kontenerów można
przygotowywać oprogramowanie w taki sposób, aby mogło być instalowane i aktualizowane nie powodując
żadnych przestojów. Kubernetes pomaga uruchamiać te aplikacje w kontenerach tam, gdzie chcesz i kiedy
chcesz i znajdować niezbędne zasoby i narzędzia wymagane do ich pracy. Kubernetes może działać w
środowiskach produkcyjnych, jest otwartym oprogramowaniem zaprojektowanym z wykorzystaniem
nagromadzonego przez Google doświadczenia w zarządzaniu kontenerami, w połączeniu z najcenniejszymi ideami społeczności.

## Podstawy Kubernetesa - Moduły {#kubernetes-basics-modules}

<!-- For translators, translate only the values of the ‘alt’ and ‘title’ keys -->
{{< tutorials/modules >}}
  {{< tutorials/module
      path="/pl/docs/tutorials/kubernetes-basics/create-cluster/cluster-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_01.svg?v=1469803628347"
      alt="Moduł 1"
      title="1. Jak użyć Minikube do stworzenia klastra" >}}

  {{< tutorials/module
      path="/pl/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_02.svg?v=1469803628347"
      alt="Moduł 2"
      title="2. Jak użyć kubectl do tworzenia Deploymentu" >}}

  {{< tutorials/module
      path="/pl/docs/tutorials/kubernetes-basics/explore/explore-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_03.svg?v=1469803628347"
      alt="Moduł 3"
      title="3. Pody i Węzły" >}}

  {{< tutorials/module
      path="/pl/docs/tutorials/kubernetes-basics/expose/expose-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_04.svg?v=1469803628347"
      alt="Moduł 4"
      title="4. Jak używać Service do udostępniania aplikacji" >}}

  {{< tutorials/module
      path="/pl/docs/tutorials/kubernetes-basics/scale/scale-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_05.svg?v=1469803628347"
      alt="Moduł 5"
      title="5. Uruchamianie wielu instancji aplikacji" >}}

  {{< tutorials/module
      path="/pl/docs/tutorials/kubernetes-basics/update/update-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_06.svg?v=1469803628347"
      alt="Moduł 6"
      title="6. Aktualizacje Rolling Update" >}}
{{< /tutorials/modules >}}

## {{% heading "whatsnext" %}}

* Więcej informacji na temat klastrów ćwiczeniowych oraz sposobu uruchamiania własnego klastra znajdziesz na stronie [Środowisko edukacyjne](/docs/setup/learning-environment/).
* Samouczek [Jak użyć Minikube do stworzenia klastra](/pl/docs/tutorials/kubernetes-basics/create-cluster/)
