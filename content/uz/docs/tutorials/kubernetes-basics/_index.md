---
title: Kubernetes asoslarini oʻrganish
main_menu: true
no_list: true
weight: 20
content_type: concept
card:
  name: tutorials
  weight: 20
  title: Asoslar boʻyicha yoʻl-yoʻriq
---

## {{% heading "objectives" %}} {#objectives}

Ushbu qoʻllanma Kubernetes klasterini boshqarish tizimining asoslari boʻyicha yoʻl-yoʻriq beradi.
Har bir modulda Kubernetesning asosiy imkoniyatlari va tushunchalari haqida qisqacha maʼlumot
hamda birga bajarib boriladigan qoʻllanma bor.

Qoʻllanmalar yordamida quyidagilarni oʻrganasiz:

* Konteynerlashtirilgan ilovani klasterda joylashtirish.
* Joylashtirishni masshtablash.
* Konteynerlashtirilgan ilovani yangi dasturiy versiya bilan yangilash.
* Konteynerlashtirilgan ilovadagi nosozliklarni aniqlash.

## Kubernetes siz uchun nima qila oladi? {#what-can-kubernetes-do-for-you}

Zamonaviy veb-xizmatlarda foydalanuvchilar ilovalar sutkaning 24 soati ishlashini kutadi, ishlab chiquvchilar
esa bu ilovalarning yangi versiyalarini kuniga bir necha marta joylashtirishni xohlaydi. Konteynerlashtirish
dasturiy taʼminotni shu maqsadlarga mos qadoqlashga yordam beradi: ilovalarni toʻxtovsiz chiqarish va
yangilash mumkin boʻladi. Kubernetes konteynerlashtirilgan ilovalarning kerakli joyda va kerakli vaqtda
ishlashini taʼminlaydi hamda ularga ishlash uchun zarur resurs va vositalarni topishga yordam beradi.
Kubernetes — Googleʼning konteyner orkestratsiyasidagi toʻplangan tajribasi va jamiyatdagi eng yaxshi
gʻoyalar asosida yaratilgan, ishlab chiqarishga tayyor ochiq manbali platforma.

## Kubernetes asoslari modullari {#kubernetes-basics-modules}

<!-- For translators, translate only the values of the ‘alt’ and ‘title’ keys -->
{{< tutorials/modules >}}
  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/create-cluster/cluster-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_01.svg?v=1469803628347"
      alt="1-modul"
      title="1. Kubernetes klasterini yaratish" >}}

  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_02.svg?v=1469803628347"
      alt="2-modul"
      title="2. Ilovani joylashtirish" >}}

  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/explore/explore-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_03.svg?v=1469803628347"
      alt="3-modul"
      title="3. Ilovangizni oʻrganish" >}}

  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/expose/expose-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_04.svg?v=1469803628347"
      alt="4-modul"
      title="4. Ilovangizni ommaga ochish" >}}

  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/scale/scale-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_05.svg?v=1469803628347"
      alt="5-modul"
      title="5. Ilovangizni masshtablash" >}}

  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/update/update-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_06.svg?v=1469803628347"
      alt="6-modul"
      title="6. Ilovangizni yangilash" >}}
{{< /tutorials/modules >}}

## {{% heading "whatsnext" %}} {#what-s-next}

* Mashq klasterlari va oʻz klasteringizni qanday ishga tushirish haqida batafsil bilish uchun [Oʻrganish muhiti](/docs/setup/learning-environment/) sahifasiga qarang.
* [Minikube yordamida klaster yaratish](/docs/tutorials/kubernetes-basics/create-cluster/) qoʻllanmasi.
