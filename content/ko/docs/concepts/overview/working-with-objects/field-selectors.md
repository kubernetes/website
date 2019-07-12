---
title: 필드 셀렉터
weight: 60
---

_필드 셀렉터_ 는 한 개 이상의 리소스 필드 값으로 쿠버네티스 리소스를 선택하기 위해 사용된다. 필드 셀렉터를 사용하는 예시는 다음과 같다.

* `metadata.name=my-service`
* `metadata.namespace!=default`
* `status.phase=Pending`

다음의 `kubectl` 명령어는 [`status.phase`](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase) 필드의 값이 `Running` 인 모든 파드를 선택한다.

```shell
kubectl get pods --field-selector status.phase=Running
```

{{< note >}}
필드 셀렉터는 본질적으로 리소스 *필터* 이다. 기본적으로 어떠한 셀렉터나 필터도 적용되지 않으며, 이는 특정 종류의 모든 리소스를 모두 선택한다는 것을 의미한다. 따라서 다음의 `kubectl` 명령어는 동일하다.
```shell
kubectl get pods
kubectl get pods --field-selector ""
```
{{< /note >}}

## 사용 가능한 필드

사용 가능한 필드는 쿠버네티스의 리소스 종류에 따라서 다르다. 모든 리소스 종류는 `metadata.name` 과 `metadata.namespace` 필드 셀렉터를 사용할 수 있다. 사용할 수 없는 필드 셀렉터를 사용하면 다음과 같이 에러를 출력한다.

```shell
kubectl get ingress --field-selector foo.bar=baz
```
```
Error from server (BadRequest): Unable to find "ingresses" that match label selector "", field selector "foo.bar=baz": "foo.bar" is not a known field selector: only "metadata.name", "metadata.namespace"
```

## 사용 가능한 연산자

필드 셀렉터에서 `=`, `==`, `!=` 연산자를 사용할 수 있다 (`=`와 `==`는 동일한 의미이다). 다음의 `kubectl` 명령어는 `default` 네임스페이스에 속해있지 않은 모든 쿠버네티스 서비스를 나열한다.

```shell
kubectl get services  --all-namespaces --field-selector metadata.namespace!=default
```

## 연속되는 셀렉터

[라벨](/docs/concepts/overview/working-with-objects/labels)을 비롯한 다른 셀렉터처럼, 쉼표로 구분되는 목록을 통해 필드 셀렉터를 연속해서 사용할 수 있다. 다음의 `kubectl` 명령어는 `status.phase` 필드가 `Running` 이 아니고, `spec.restartPolicy` 필드가 `Always` 인 모든 파드를 선택한다.

```shell
kubectl get pods --field-selector=status.phase!=Running,spec.restartPolicy=Always
```

## 여러 개의 리소스 종류

필드 셀렉터를 여러 개의 리소스 종류에 동시에 사용할 수 있다. 다음의 `kubectl` 명령어는 `default` 네임스페이스에 속해있지 않은 모든 스테이트풀 셋과 서비스를 선택한다.

```shell
kubectl get statefulsets,services --all-namespaces --field-selector metadata.namespace!=default
```
