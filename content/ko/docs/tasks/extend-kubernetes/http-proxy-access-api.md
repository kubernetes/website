---
title: HTTP 프록시를 사용하여 쿠버네티스 API에 접근
content_type: task
weight: 40
---

<!-- overview -->
이 페이지는 쿠버네티스 API에 접근하기 위해 HTTP 프록시를 사용하는 방법을 설명한다.


## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

클러스터에서 실행 중인 애플리케이션이 없다면,
아래 명령을 입력하여 Hello world 애플리케이션을 시작한다.

```shell
kubectl create deployment node-hello --image=gcr.io/google-samples/node-hello:1.0 --port=8080
```

<!-- steps -->

## kubectl을 사용하여 프록시 서버 시작

아래 커맨드는 쿠버네티스 API 서버의 프록시를 시작한다.

    kubectl proxy --port=8080

## Kubernetes API 탐색

프록시 서버가 실행 중일 때 `curl`, `wget`
또는 브라우저를 사용하여 API를 탐색할 수 있다.

API 버전 가져오기.

    curl http://localhost:8080/api/

출력은 다음과 유사하다.

    {
      "kind": "APIVersions",
      "versions": [
        "v1"
      ],
      "serverAddressByClientCIDRs": [
        {
          "clientCIDR": "0.0.0.0/0",
          "serverAddress": "10.0.2.15:8443"
        }
      ]
    }

파드 목록 가져오기.

    curl http://localhost:8080/api/v1/namespaces/default/pods

출력은 다음과 유사하다.

    {
      "kind": "PodList",
      "apiVersion": "v1",
      "metadata": {
        "resourceVersion": "33074"
      },
      "items": [
        {
          "metadata": {
            "name": "kubernetes-bootcamp-2321272333-ix8pt",
            "generateName": "kubernetes-bootcamp-2321272333-",
            "namespace": "default",
            "uid": "ba21457c-6b1d-11e6-85f7-1ef9f1dab92b",
            "resourceVersion": "33003",
            "creationTimestamp": "2016-08-25T23:43:30Z",
            "labels": {
              "pod-template-hash": "2321272333",
              "run": "kubernetes-bootcamp"
            },
            ...
    }

## {{% heading "whatsnext" %}}

[kubectl 프록시](/docs/reference/generated/kubectl/kubectl-commands#proxy)에 대해 더 배우기.
