---
title: "도구 설치"
description: 컴퓨터에서 쿠버네티스 도구를 설정한다.
weight: 10
no_list: true
---

## kubectl

쿠버네티스 커맨드 라인 도구인 `kubectl` 사용하면 쿠버네티스 클러스터에 대해 명령을
실행할 수 있다. kubectl을 사용하여 애플리케이션을 배포하고, 클러스터 리소스를 검사 및
관리하고, 로그를 볼 수 있다.

클러스터에 접근하기 위해 `kubectl` 을 다운로드 및 설치하고 설정하는 방법에 대한 정보는
[kubectl 설치 및 설정](/ko/docs/tasks/tools/install-kubectl/)을 참고한다.

`kubectl` 레퍼런스 문서를 읽어볼 수도 있다.

## Minikube

[Minikube](https://minikube.sigs.k8s.io/)는 쿠버네티스를 로컬에서 실행할 수 있는
도구이다. Minikube는 개인용 컴퓨터(윈도우, macOS 및 리눅스 PC 포함)에서
단일 노드 쿠버네티스 클러스터를 실행하여 쿠버네티스를 사용해보거나 일상적인 개발 작업을
수행할 수 있다.

공식 사이트에서의 [시작하기!](https://minikube.sigs.k8s.io/docs/start/)
가이드를 따라 해볼 수 있고, 또는 도구 설치에 중점을 두고 있다면
[Minikube 설치](/ko/docs/tasks/tools/install-minikube/)를 읽어볼 수 있다.

Minikube가 작동하면, 이를 사용하여
[샘플 애플리케이션을 실행](/ko/docs/tutorials/hello-minikube/)해볼 수 있다.

## kind

Minikube와 마찬가지로, [kind](https://kind.sigs.k8s.io/docs/)를 사용하면 로컬 컴퓨터에서
쿠버네티스를 실행할 수 있다. Minikuke와 달리, kind는 단일 컨테이너 런타임에서만 작동한다.
kind는 [도커](https://docs.docker.com/get-docker/)를 설치하고
구성해야 한다.

[퀵 스타트](https://kind.sigs.k8s.io/docs/user/quick-start/)는 kind를 시작하고 실행하기 위해
수행해야 하는 작업을 보여준다.
