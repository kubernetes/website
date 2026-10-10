---
title: Feed CVE Resmi
linkTitle: Feed CVE
weight: 25
outputs:
  - json
  - html
  - rss
layout: cve-feed
---

{{< feature-state for_k8s_version="v1.27" state="beta" >}}

Ini adalah daftar CVE resmi yang diumumkan oleh Komite Tanggapan Keamanan Kubernetes yang dikelola oleh komunitas. Lihat [Informasi Keamanan dan Pengungkapan Kubernetes](/docs/reference/issues-security/security/) untuk detail lebih lanjut.

Proyek Kubernetes menerbitkan umpan (feed) yang dapat diakses secara programatik untuk masalah keamanan yang diumumkan dalam format [JSON feed](/docs/reference/issues-security/official-cve-feed/index.json) dan [RSS feed](/docs/reference/issues-security/official-cve-feed/feed.xml). Kamu dapat mengaksesnya dengan menjalankan perintah berikut:

{{< tabs name="Umpan CVE" >}}
{{% tab name="Umpan JSON" %}}
[Tautan ke format JSON](/docs/reference/issues-security/official-cve-feed/index.json)
```shell
curl -Lv https://k8s.io/docs/reference/issues-security/official-cve-feed/index.json
```
{{% /tab %}}
{{% tab name="Umpan RSS" %}}
[Tautan ke format RSS](/docs/reference/issues-security/official-cve-feed/feed.xml)
```shell
curl -Lv https://k8s.io/docs/reference/issues-security/official-cve-feed/feed.xml
```
{{% /tab %}}
{{< /tabs >}}

{{< cve-feed >}}

<!-- | CVE ID      | Issue Summary | CVE GitHub Issue URL |
| ----------- | ----------- | --------- |
| [CVE-2021-25741](https://www.cve.org/CVERecord?id=CVE-2021-25741)      | Symlink Exchange Can Allow Host Filesystem Access | [#104980](https://github.com/kubernetes/kubernetes/issues/104980) |
| [CVE-2020-8565](https://www.cve.org/CVERecord?id=CVE-2020-8565)      | Incomplete fix for CVE-2019-11250 allows for token leak in logs when logLevel >= 9 | [#95623](https://github.com/kubernetes/kubernetes/issues/95623) | -->

Umpan ini diperbaharui secara otomatis dengan interval dalam kisaran menit atau jam dari waktu CVE diumumkan hingga waktu umpan ini dapat diakses.

Sumber kebenaran dari umpan ini adalah serangkaian isu GitHub, yang difilter oleh label yang dikontrol dan dibatasi `official-cve-feed`. Data mentah disimpan dalam Google Cloud Bucket yang hanya dapat ditulis oleh sejumlah kecil anggota terpercaya dari komunitas.
