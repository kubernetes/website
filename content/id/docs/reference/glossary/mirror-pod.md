---
title: Pod Cermin
id: mirror-pod
date: 2019-08-06
short_description: >
  Merupakan objek dalam server API yang melacak Pod statis pada kubelet.

aka:
- Mirror Pod
tags:
- fundamental
---
Suatu objek {{< glossary_tooltip term_id="pod" >}} yang digunakan kubelet untuk merepresentasikan {{< glossary_tooltip text="Pod statis" term_id="static-pod" >}}.

<!--more--> 

Ketika kubelet menemukan Pod statis dalam konfigurasinya, maka kubelet secara otomatis mencoba untuk membuat sebuah objek Pod pada server API Kubernetes untuknya. Hal ini berarti Pod tersebut akan terlihat di server API, tetapi tidak dapat dikontrol dari sana.

(Sebagai contoh, menghapus sebuah Pod cermin tidak akan menghentikan _daemon_ kubelet untuk menjalankannya).
