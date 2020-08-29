---
title: Controller
id: controller
date: 2018-04-12
full_link: /docs/concepts/architecture/controller/
short_description: >
  Kontrol tertutup yang mengawasi kondisi bersama dari klaster melalui apiserver dan membuat perubahan yang mencoba untuk membawa kondisi saat ini ke kondisi yang diinginkan.

aka: 
tags:
- architecture
- fundamental
---
Di Kubernetes, _controller_ adalah kontrol tertutup yang mengawasi kondisi
{{< glossary_tooltip term_id="cluster" text="klaster">}} anda, lalu membuat atau 
meminta perubahan jika diperlukan.
Setiap _controller_ mencoba untuk memindahkan status klaster saat ini lebih 
dekat ke kondisi yang diinginkan.

<!--more-->

_Controller_ mengawasi keadaan bersama dari klaster kamu melalui
{{< glossary_tooltip text="apiserver" term_id="kube-apiserver" >}} (bagian dari
{{< glossary_tooltip term_id="control-plane" >}}).

Beberapa _controller_ juga berjalan di dalam _control plane_, menyediakan 
kontrol tertutup yang merupakan inti dari operasi Kubernetes. Sebagai contoh: 
_controller Deployment_, _controller daemonset_, _controller namespace_, dan 
_controller volume persisten_ (dan lainnya) semua berjalan di dalam
{{< glossary_tooltip term_id="kube-controller-manager" >}}.
