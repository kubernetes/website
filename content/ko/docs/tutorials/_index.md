---
title: 튜토리얼
main_menu: true
weight: 60
content_template: templates/concept
---

{{% capture overview %}}

쿠버네티스 문서의 본 섹션은 튜토리얼을 포함하고 있다.
튜토리얼은 개별 [작업](/docs/tasks) 단위보다 더 큰 목표를 달성하기
위한 방법을 보여준다. 일반적으로 튜토리얼은 각각 순차적 단계가 있는 여러
섹션으로 구성된다.
각 튜토리얼을 따라하기 전에, 나중에 참조할 수 있도록
[표준 용어집](/docs/reference/glossary/) 페이지를 북마크하기를 권한다.

{{% /capture %}}

{{% capture body %}}

## 기초

* [쿠버네티스 기초](/ko/docs/tutorials/kubernetes-basics/)는 쿠버네티스 시스템을 이해하는데 도움이 되고 기초적인 쿠버네티스 기능을 일부 사용해 볼 수 있는 심도있는 대화형 튜토리얼이다.

* [Scalable Microservices with Kubernetes (Udacity)](https://www.udacity.com/course/scalable-microservices-with-kubernetes--ud615)

* [Introduction to Kubernetes (edX)](https://www.edx.org/course/introduction-kubernetes-linuxfoundationx-lfs158x#)

* [Hello Minikube](/ko/docs/tutorials/hello-minikube/)

## 구성

* [Configuring Redis Using a ConfigMap](/docs/tutorials/configuration/configure-redis-using-configmap/)

## 상태 유지를 하지 않는(stateless) 애플리케이션

* [Exposing an External IP Address to Access an Application in a Cluster](/docs/tutorials/stateless-application/expose-external-ip-address/)

* [Example: Deploying PHP Guestbook application with Redis](/docs/tutorials/stateless-application/guestbook/)

## 상태 유지가 필요한(stateful) 애플리케이션

* [스테이트풀셋 기본](/docs/tutorials/stateful-application/basic-stateful-set/)

* [Example: WordPress and MySQL with Persistent Volumes](/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/)

* [Example: Deploying Cassandra with Stateful Sets](/docs/tutorials/stateful-application/cassandra/)

* [Running ZooKeeper, A CP Distributed System](/docs/tutorials/stateful-application/zookeeper/)

## CI/CD 파이프라인

* [Set Up a CI/CD Pipeline with Kubernetes Part 1: Overview](https://www.linux.com/blog/learn/chapter/Intro-to-Kubernetes/2017/5/set-cicd-pipeline-kubernetes-part-1-overview)

* [Set Up a CI/CD Pipeline with a Jenkins Pod in Kubernetes (Part 2)](https://www.linux.com/blog/learn/chapter/Intro-to-Kubernetes/2017/6/set-cicd-pipeline-jenkins-pod-kubernetes-part-2)

* [Run and Scale a Distributed Crossword Puzzle App with CI/CD on Kubernetes (Part 3)](https://www.linux.com/blog/learn/chapter/intro-to-kubernetes/2017/6/run-and-scale-distributed-crossword-puzzle-app-cicd-kubernetes-part-3)

* [Set Up CI/CD for a Distributed Crossword Puzzle App on Kubernetes (Part 4)](https://www.linux.com/blog/learn/chapter/intro-to-kubernetes/2017/6/set-cicd-distributed-crossword-puzzle-app-kubernetes-part-4)

## 클러스터

* [AppArmor](/docs/tutorials/clusters/apparmor/)

## 서비스

* [Using Source IP](/docs/tutorials/services/source-ip/)

{{% /capture %}}

{{% capture whatsnext %}}

튜토리얼을 작성하고 싶다면,
튜토리얼 페이지 유형과 튜토리얼 템플릿에 대한 정보가 있는
[Using Page Templates](/docs/home/contribute/page-templates/)
페이지를 참조한다.

{{% /capture %}}
