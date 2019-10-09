---
title: 튜토리얼
main_menu: true
weight: 60
content_template: templates/concept
---

{{% capture overview %}}

쿠버네티스 문서의 본 섹션은 튜토리얼을 포함하고 있다.
튜토리얼은 개별 [작업](/ko/docs/tasks) 단위보다 더 큰 목표를 달성하기
위한 방법을 보여준다. 일반적으로 튜토리얼은 각각 순차적 단계가 있는 여러
섹션으로 구성된다.
각 튜토리얼을 따라하기 전에, 나중에 참조할 수 있도록
[표준 용어집](/ko/docs/reference/glossary/) 페이지를 북마크하기를 권한다.

{{% /capture %}}

{{% capture body %}}

## 기초

* [쿠버네티스 기초](/ko/docs/tutorials/kubernetes-basics/)는 쿠버네티스 시스템을 이해하는데 도움이 되고 기초적인 쿠버네티스 기능을 일부 사용해 볼 수 있는 심도있는 대화형 튜토리얼이다.

* [Scalable Microservices with Kubernetes (Udacity)](https://www.udacity.com/course/scalable-microservices-with-kubernetes--ud615)

* [Introduction to Kubernetes (edX)](https://www.edx.org/course/introduction-kubernetes-linuxfoundationx-lfs158x#)

* [Hello Minikube](/ko/docs/tutorials/hello-minikube/)

## 구성

* [컨피그 맵을 사용해서 Redis 설정하기](/ko/docs/tutorials/configuration/configure-redis-using-configmap/)

## 상태 유지를 하지 않는(stateless) 애플리케이션

* [외부 IP 주소를 노출하여 클러스터의 애플리케이션에 접속하기](/ko/docs/tutorials/stateless-application/expose-external-ip-address/)

* [예시: Redis를 사용한 PHP 방명록 애플리케이션 배포하기](/ko/docs/tutorials/stateless-application/guestbook/)

## 상태 유지가 필요한(stateful) 애플리케이션

* [스테이트풀셋 기본](/ko/docs/tutorials/stateful-application/basic-stateful-set/)

* [예시: WordPress와 MySQL을 퍼시스턴트 볼륨에 배포하기](/ko/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/)

* [예시: 카산드라를 스테이트풀셋으로 배포하기](/ko/docs/tutorials/stateful-application/cassandra/)

* [분산 시스템 코디네이터 ZooKeeper 실행하기](/ko/docs/tutorials/stateful-application/zookeeper/)

## CI/CD 파이프라인

* [Set Up a CI/CD Pipeline with Kubernetes Part 1: Overview](https://www.linux.com/blog/learn/chapter/Intro-to-Kubernetes/2017/5/set-cicd-pipeline-kubernetes-part-1-overview)

* [Set Up a CI/CD Pipeline with a Jenkins Pod in Kubernetes (Part 2)](https://www.linux.com/blog/learn/chapter/Intro-to-Kubernetes/2017/6/set-cicd-pipeline-jenkins-pod-kubernetes-part-2)

* [Run and Scale a Distributed Crossword Puzzle App with CI/CD on Kubernetes (Part 3)](https://www.linux.com/blog/learn/chapter/intro-to-kubernetes/2017/6/run-and-scale-distributed-crossword-puzzle-app-cicd-kubernetes-part-3)

* [Set Up CI/CD for a Distributed Crossword Puzzle App on Kubernetes (Part 4)](https://www.linux.com/blog/learn/chapter/intro-to-kubernetes/2017/6/set-cicd-distributed-crossword-puzzle-app-kubernetes-part-4)

## 클러스터

* [AppArmor](/ko/docs/tutorials/clusters/apparmor/)

## 서비스

* [소스 IP 주소 이용하기](/ko/docs/tutorials/services/source-ip/)

{{% /capture %}}

{{% capture whatsnext %}}

튜토리얼을 작성하고 싶다면,
튜토리얼 페이지 유형과 튜토리얼 템플릿에 대한 정보가 있는
[Using Page Templates](/docs/home/contribute/page-templates/)
페이지를 참조한다.

{{% /capture %}}
