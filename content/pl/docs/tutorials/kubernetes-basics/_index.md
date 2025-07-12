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

<!-- css code to preserve original format -->
`<link rel="stylesheet" href="/css/style_tutorials.css">`

<div class="tutorials-modules">
  <div class="module">
    <a href="/pl/docs/tutorials/kubernetes-basics/create-cluster/cluster-intro/">
      <img src="/docs/tutorials/kubernetes-basics/public/images/module_01.svg?v=1469803628347" alt="Moduł 1">
      <h5>1. Jak użyć Minikube do stworzenia klastra</h5>
    </a>
  </div>
  <div class="module">
    <a href="/pl/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/">
      <img src="/docs/tutorials/kubernetes-basics/public/images/module_02.svg?v=1469803628347" alt="Moduł 2">
      <h5>2. Jak użyć kubectl do tworzenia Deploymentu</h5>
    </a>
  </div>
  <div class="module">
    <a href="/pl/docs/tutorials/kubernetes-basics/explore/explore-intro/">
      <img src="/docs/tutorials/kubernetes-basics/public/images/module_03.svg?v=1469803628347" alt="Moduł 3">
      <h5>3. Pody i Węzły</h5>
    </a>
  </div>
  <div class="module">
    <a href="/pl/docs/tutorials/kubernetes-basics/expose/expose-intro/">
      <img src="/docs/tutorials/kubernetes-basics/public/images/module_04.svg?v=1469803628347" alt="Moduł 4">
      <h5>4. Jak używać Service do udostępniania aplikacji</h5>
    </a>
  </div>
  <div class="module">
    <a href="/pl/docs/tutorials/kubernetes-basics/scale/scale-intro/">
      <img src="/docs/tutorials/kubernetes-basics/public/images/module_05.svg?v=1469803628347" alt="Moduł 5">
      <h5>5. Uruchamianie wielu instancji aplikacji</h5>
    </a>
  </div>
  <div class="module">
    <a href="/pl/docs/tutorials/kubernetes-basics/update/update-intro/">
      <img src="/docs/tutorials/kubernetes-basics/public/images/module_06.svg?v=1469803628347" alt="Moduł 6">
      <h5>6. Aktualizacje Rolling Update</h5>
    </a>
  </div>
</div>


## {{% heading "whatsnext" %}}

* Samouczek [Jak użyć Minikube do stworzenia klastra](/pl/docs/tutorials/kubernetes-basics/create-cluster/)
  