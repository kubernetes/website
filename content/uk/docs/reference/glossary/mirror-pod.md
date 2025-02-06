---
title: Дзеркальний Pod
id: mirror-pod
date: 2019-08-06
short_description: >
    Обʼєкт в API-сервері, який відстежує статичний Pod на kubelet.

aka:
- Mirror Pod
tags:
- fundamental
---

{{< glossary_tooltip text="Pod" term_id="pod" >}}, який {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} використовує для представлення {{< glossary_tooltip text="статичного Podʼа" term_id="static-pod" >}}.

<!--more-->

Коли kubelet знаходить статичний Pod у своїй конфігурації, він автоматично намагається створити обʼєкт Pod на сервері API Kubernetes для нього. Це означає, що Pod буде видно на сервері API, але ним не можна керувати звідти.

(Наприклад, видалення дзеркального Podʼа не зупинить демона kubelet від його запуску).
