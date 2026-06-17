---
title: Основы Kubernetes
main_menu: true
no_list: true
weight: 20
content_type: concept
card:
  name: tutorials
  weight: 20
  title: Краткий обзор основ
---

## {{% heading "objectives" %}}

В этом руководстве вы познакомитесь с основами системы оркестрации
кластеров Kubernetes. Каждый модуль содержит справочную информацию по
основным функциональным возможностям и концепциям Kubernetes, а также
учебный материал для самостоятельного прохождения.

Из этих руководств вы узнаете, как:

* Развернуть контейнеризированное приложение в кластере.
* Масштабировать развертывание.
* Обновить контейнеризированное приложение до новой версии ПО.
* Отладить контейнеризированное приложение.

## Чем Kubernetes может быть полезен?

Пользователи современных веб-сервисов ожидают, что приложения будут
доступны круглосуточно, а разработчики рассчитывают развертывать новые
версии этих приложений по нескольку раз в день. Контейнеризация помогает
упаковывать программное обеспечение для достижения этих целей, позволяя
выпускать и обновлять приложения без простоев. Kubernetes помогает
гарантировать, что контейнеризированные приложения запускаются там и тогда,
где и когда вам нужно, а также находят ресурсы и инструменты, необходимые
для работы. Kubernetes — это готовая к промышленному использованию платформа
с открытым исходным кодом, созданная на основе накопленного Google опыта
оркестрации контейнеров и лучших идей сообщества.

## Учебные модули по основам Kubernetes

<!-- For translators, translate only the values of the ‘alt’ and ‘title’ keys -->
{{< tutorials/modules >}}
  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/create-cluster/cluster-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_01.svg?v=1469803628347"
      alt="Модуль 1"
      title="1. Создание кластера Kubernetes" >}}

  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_02.svg?v=1469803628347"
      alt="Модуль 2"
      title="2. Развертывание приложения" >}}

  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/explore/explore-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_03.svg?v=1469803628347"
      alt="Модуль 3"
      title="3. Изучение приложения" >}}

  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/expose/expose-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_04.svg?v=1469803628347"
      alt="Модуль 4"
      title="4. Публикация приложения" >}}

  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/scale/scale-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_05.svg?v=1469803628347"
      alt="Модуль 5"
      title="5. Масштабирование приложения" >}}

  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/update/update-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_06.svg?v=1469803628347"
      alt="Модуль 6"
      title="6. Обновление приложения" >}}
{{< /tutorials/modules >}}

## {{% heading "whatsnext" %}}

* Подробнее о тренировочных кластерах и о том, как запустить собственный
  кластер, см. на странице [Учебная среда](/ru/docs/setup/learning-environment/).
* Руководство [Использование Minikube для создания кластера](/ru/docs/tutorials/kubernetes-basics/create-cluster/)
