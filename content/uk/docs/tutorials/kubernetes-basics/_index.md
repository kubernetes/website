---
title: Ознайомлення з основами Kubernetes
main_menu: true
no_list: true
weight: 20
content_type: concept
card:
  name: tutorials
  weight: 20
  title: Знайомство з основами
---

## {{% heading "objectives" %}}

Цей посібник надає інструкції з основ системи оркестрування кластерів Kubernetes. Кожний модуль містить деяку вступну інформацію про основні функції та концепції Kubernetes, а також практичний посібник, за яким ви можете вчитися.

За допомогою цих посібників ви дізнаєтесь:

* Як розгорнути контейнеризований застосунок в кластері.
* Як масштабувати Deployment.
* Як оновити версію контейнеризованого застосунку.
* Як налагодити контейнеризований застосунок.

## Чим Kubernetes може бути корисний для вас? {#what-can-kubernetes-do-for-you}

З сучасними вебсервісами користувачі очікують доступності застосунків 24/7, а розробники прагнуть розгортати нові версії цих застосунків кілька разів на день. Контейнеризація допомагає упаковувати програмне забезпечення для досягнення цих цілей, дозволяючи випускати оновлення застосунків без перерви в роботі. Kubernetes допомагає забезпечити те, що контейнеризовані застосунки працюватимуть там і тоді, де це потрібно, та надає їм необхідні ресурси та інструменти для ефективної роботи. Kubernetes — це готова до використання, відкрита платформа, розроблена на основі здобутого Google досвіду в оркеструванні контейнерів, поєднаного з найкращими ідеями та практиками спільноти.

## Модулі «Основи Kubernetes» {#kubernetes-basics-modules}

<!-- css code to preserve original format -->
<link rel="stylesheet" href="/css/style_tutorials.css">

<div class="tutorials-modules">
  <div class="module">
    <a href="/uk/docs/tutorials/kubernetes-basics/create-cluster/cluster-intro/">
      <img src="/docs/tutorials/kubernetes-basics/public/images/module_01.svg?v=1469803628347" alt="Module 1">
      <h5>1. Створення кластера Kubernetes</h5>
    </a>
  </div>
  <div class="module">
    <a href="/uk/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/">
      <img src="/docs/tutorials/kubernetes-basics/public/images/module_02.svg?v=1469803628347" alt="Module 2">
      <h5>2. Розгортання застосунку</h5>
    </a>
  </div>
  <div class="module">
    <a href="/uk/docs/tutorials/kubernetes-basics/explore/explore-intro/">
      <img src="/docs/tutorials/kubernetes-basics/public/images/module_03.svg?v=1469803628347" alt="Module 3">
      <h5>3. Дослідить свій застосунок</h5>
    </a>
  </div>
  <div class="module">
    <a href="/uk/docs/tutorials/kubernetes-basics/expose/expose-intro/">
      <img src="/docs/tutorials/kubernetes-basics/public/images/module_04.svg?v=1469803628347" alt="Module 4">
      <h5>4. Відкриття доступу до застосунку за межами кластера</h5>
    </a>
  </div>
  <div class="module">
    <a href="/uk/docs/tutorials/kubernetes-basics/scale/scale-intro/">
      <img src="/docs/tutorials/kubernetes-basics/public/images/module_05.svg?v=1469803628347" alt="Module 5">
      <h5>5. Масштабування застосунку</h5>
    </a>
  </div>
  <div class="module">
    <a href="/uk/docs/tutorials/kubernetes-basics/update/update-intro/">
      <img src="/docs/tutorials/kubernetes-basics/public/images/module_06.svg?v=1469803628347" alt="Module 6">
      <h5>6. Оновлення застосунку</h5>
    </a>
  </div>
</div>

## {{% heading "whatsnext" %}}

* Підручник [Використання Minikube для створення кластера](/docs/tutorials/kubernetes-basics/create-cluster/)
