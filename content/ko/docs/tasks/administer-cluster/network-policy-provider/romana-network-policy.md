---
reviewers:
title: 네트워크 폴리시로 로마나(Romana)
content_template: templates/task
weight: 40
---

{{% capture overview %}}

이 페이지는 네트워크 폴리시(NetworkPolicy)로 로마나(Romana)를 사용하는 방법을 살펴본다.

{{% /capture %}}

{{% capture prerequisites %}}

[kubeadm 시작하기](/docs/getting-started-guides/kubeadm/)의 1, 2, 3 단계를 완료하자.

{{% /capture %}}

{{% capture steps %}}

## kubeadm으로 로마나 설치하기

Kubeadm을 위한 [컨테이너화된 설치 안내서](https://github.com/romana/romana/tree/master/containerize)를 따른다.

## 네트워크 폴리시 적용하기

네트워크 폴리시를 적용하기 위해 다음 중에 하나를 사용하자.

* [Romana 네트워크 폴리시](https://github.com/romana/romana/wiki/Romana-policies).
    * [Romana 네트워크 폴리시의 예](https://github.com/romana/core/blob/master/doc/policy.md).
* 네트워크 폴리시 API.

{{% /capture %}}

{{% capture whatsnext %}}

로마나를 설치한 후에는, 쿠버네티스 네트워크 폴리시를 시도하기 위해 [네트워크 폴리시 선언하기](/docs/tasks/administer-cluster/declare-network-policy/)를 따라 할 수 있다.

{{% /capture %}}


