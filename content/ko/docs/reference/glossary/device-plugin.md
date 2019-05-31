---
title: 장치 플러그인(Device Plugin)
id: device-plugin
date: 2019-02-02
full_link: /docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/
short_description: >
  장치 플러그인은 쿠버네티스에서 동작하는 컨테이너이며 공급 업체 고유의 리소스에 대한 액세스를 제공한다.
aka:
tags:
- fundamental
- extension
---
 장치 플러그인은 쿠버네티스에서 동작하는 컨테이너이며 공급 업체 고유의 리소스에 대한 액세스를 제공한다.

<!--more-->

[장치 플러그인](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)은 쿠버네티스에서 동작하는 컨테이너이며 공급 업체 고유의 리소스에 대한 액세스를 제공한다. 장치 플로그인은 해당 리소스를 kubelet에 알린다. 장치 플러그인은 사용자 정의 쿠버네티스 코드를 작성하는 대신 수동으로 또는 데몬 셋으로도 디플로이 가능하다.
