---
title: 튜토리얼
main_menu: true
weight: 60
content_template: templates/concept
---

{{% capture overview %}}

이번 섹션에는 Kubernetes 튜토리얼이 포함되어 있습니다. 튜토리얼에서는 개별 [작업](/docs/tasks/)에 국한되지 않고 보다 넓은 시야에서 접근합니다. 튜토리얼에는 여러 섹션이 있으며, 섹션별로 진행할 단계가 있습니다. 각 튜토리얼를 살펴보기 전에 나중에 참조할 수 있도록 [표준 용어집 페이지](/docs/reference/glossary/)도 살펴보시기 바랍니다. 

{{% /capture %}}

{{% capture body %}}

## 기본

* [Kubernetes 기초](/docs/tutorials/kubernetes-basics/) 여러분이 Kubernetes 시스템을 이해하고 기본 Kubernetes 기능을 시도할 때 도움을 주는 대화식 튜토리얼입니다.

* [Kubernetes를 사용한 확장성있는 마이크로 서비스 (Udacity)](https://www.udacity.com/course/scalable-microservices-with-kubernetes--ud615)

* [Kubernetes 소개 (edX)](https://www.edx.org/course/introduction-kubernetes-linuxfoundationx-lfs158x#)

* [안녕 Minikube](/docs/tutorials/hello-minikube/)

## 구성

* [ConfigMap을 활용한 레디스 구성하기](/docs/tutorials/configuration/configure-redis-using-configmap/)

## 상태없는 애플리케이션

* [클러스터의 애플리케이션에 접속할 수 있는 외부 IP 노출하기](/docs/tutorials/stateless-application/expose-external-ip-address/)

* [Example: Deploying PHP Guestbook application with Redis예제: 레디스를 활용한 PHP 방명록 애플리케이션 배포하기](/docs/tutorials/stateless-application/guestbook/)

## 상태있는 애플리케이션

* [StatefulSet 기초](/docs/tutorials/stateful-application/basic-stateful-set/)

* [예제: 영속 볼륨(Persistent Volumes)을 활용한 워드프레스와 MySQL](/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/)

* [예제: Stateful Sets을 활용한 카산드라 배포](/docs/tutorials/stateful-application/cassandra/)

* [주키퍼 실행하기 - CP 배포 시스템](/docs/tutorials/stateful-application/zookeeper/)

## CI/CD 파이프라인

* [Kubernetes로 CI/CD 설정하기 : Part 1 개요](https://www.linux.com/blog/learn/chapter/Intro-to-Kubernetes/2017/5/set-cicd-pipeline-kubernetes-part-1-overview)

* [Kubernetes의 젠킨스 포드로 CI/CD 파이프라인 설정하기(Part 2)](https://www.linux.com/blog/learn/chapter/Intro-to-Kubernetes/2017/6/set-cicd-pipeline-jenkins-pod-kubernetes-part-2)

* [Kubernetes에서 CI/CD로 분산형 단어 맞추기 앱의 실행 및 확장하기(Part 3)](https://www.linux.com/blog/learn/chapter/intro-to-kubernetes/2017/6/run-and-scale-distributed-crossword-puzzle-app-cicd-kubernetes-part-3)

* [Kubernetes에서 분산형 단어 맞추기 앱의 CI/CD 설정하기(Part 4)](https://www.linux.com/blog/learn/chapter/intro-to-kubernetes/2017/6/set-cicd-distributed-crossword-puzzle-app-kubernetes-part-4)

## 클러스터

* [AppArmor](/docs/tutorials/clusters/apparmor/)

## 서비스

* [소스 IP 사용하기](/docs/tutorials/services/source-ip/)

{{% /capture %}}

{{% capture whatsnext %}}

튜토리얼을 직접 작성하고 싶다면 다음을 참고하세요.
[페이지 템플릿 사용하기](/docs/home/contribute/page-templates/)

{{% /capture %}}
