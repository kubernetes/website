---
title: 필드 셀렉터
content_type: concept
weight: 70
---

_필드 셀렉터_ 는 한 개 이상의 리소스 필드 값에 따라 쿠버네티스 {{< glossary_tooltip text="오브젝트" term_id="object" >}}를 
선택하기 위해 사용된다. 필드 셀렉터 쿼리의 예시는 다음과 같다.

* `metadata.name=my-service`
* `metadata.namespace!=default`
* `status.phase=Pending`

다음의 `kubectl` 커맨드는 [`status.phase`](/ko/docs/concepts/workloads/pods/pod-lifecycle/#파드의-단계-phase) 필드의 값이 `Running` 인 모든 파드를 선택한다.

```shell
kubectl get pods --field-selector status.phase=Running
```

{{< note >}}
필드 셀렉터는 본질적으로 리소스 *필터* 이다. 기본적으로 적용되는 셀렉터나 필드는 없으며, 이는 명시된 종류의 모든 리소스가 선택된다는 것을 의미한다. 여기에 따라오는 `kubectl` 쿼리인 `kubectl get pods` 와 `kubectl get pods --field-selector ""` 는 동일하다.
{{< /note >}}

## 사용 가능한 필드

사용 가능한 필드는 쿠버네티스의 리소스 종류에 따라서 다르다. 모든 리소스 종류는 `metadata.name` 과 `metadata.namespace` 필드 셀렉터를 사용할 수 있다. 사용할 수 없는 필드 셀렉터를 사용하면 다음과 같이 에러를 출력한다.

```shell
kubectl get ingress --field-selector foo.bar=baz
```
```
Error from server (BadRequest): Unable to find "ingresses" that match label selector "", field selector "foo.bar=baz": "foo.bar" is not a known field selector: only "metadata.name", "metadata.namespace"
```

### 지원하는 필드 목록 

| 종류                      | 필드                                                                                                                                                                                                                                                          |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 파드(Pod)                       | `spec.nodeName`<br>`spec.restartPolicy`<br>`spec.schedulerName`<br>`spec.serviceAccountName`<br>`spec.hostNetwork`<br>`status.phase`<br>`status.podIP`<br>`status.nominatedNodeName`                                                                            |
| 이벤트(Event)                     | `involvedObject.kind`<br>`involvedObject.namespace`<br>`involvedObject.name`<br>`involvedObject.uid`<br>`involvedObject.apiVersion`<br>`involvedObject.resourceVersion`<br>`involvedObject.fieldPath`<br>`reason`<br>`reportingComponent`<br>`source`<br>`type` |
| 시크릿(Secret)                    | `type`                                                                                                                                                                                                                                                          |
| 네임스페이스(Namespace)      | `status.phase`                                                                                                                                                                                                                                                  |
| 레플리카셋(ReplicaSet)       | `status.replicas`                                                                                                                                                                                                                                               |
| 레플리케이션컨트롤러(ReplicationController)     | `status.replicas`                                                                                                                                                                                                                                               |
| 잡(Job)                       | `status.successful`                                                                                                                                                                                                                                             |
| 노드(Node)                      | `spec.unschedulable`                                                                                                                                                                                                                                            |
| CertificateSigningRequest | `spec.signerName`                                                                                                                                                                                                                                               |

### 커스텀 리소스 필드

모든 커스텀 리소스 타입은 `metadata.name`과 `metadata.namespace` 필드를 지원한다.

또한, {{< glossary_tooltip term_id="CustomResourceDefinition" text="커스텀리소스데피니션(CustomResourceDefinition)" >}}의 `spec.versions[*].selectableFields` 필드는 
커스텀 리소스에서 필드 셀렉터로 사용할 수 있는 다른 필드를 선언한다. 커스텀리소스데피니션에서 필드 셀렉터를 사용하는 방법에 대한 더 자세한 내용은
[커스텀 리소스의 선택 가능한 필드](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#crd-selectable-fields)를 참고한다.

## 사용 가능한 연산자

필드 셀렉터에서 `=`, `==`, `!=` 연산자를 사용할 수 있다 (`=`와 `==`는 동일한 의미이다). 예를 들면, 다음의 `kubectl` 커맨드는 `default` 네임스페이스에 속해있지 않은 모든 쿠버네티스 서비스를 선택한다.

```shell
kubectl get services  --all-namespaces --field-selector metadata.namespace!=default
```
{{< note >}}
[집합 기반 연산자](/docs/concepts/overview/working-with-objects/labels/#set-based-requirement)
(`in`, `notin`, `exists`)는 필드 셀렉터에서 사용할 수 없다. 
{{< /note >}}

## 연계되는 셀렉터

[레이블](/ko/docs/concepts/overview/working-with-objects/labels)을 비롯한 다른 셀렉터처럼, 쉼표로 구분되는 목록을 통해 필드 셀렉터를 연계해서 사용할 수 있다. 다음의 `kubectl` 커맨드는 `status.phase` 필드가 `Running` 이 아니고, `spec.restartPolicy` 필드가 `Always` 인 모든 파드를 선택한다.

```shell
kubectl get pods --field-selector=status.phase!=Running,spec.restartPolicy=Always
```

## 여러 개의 리소스 종류

필드 셀렉터를 여러 개의 리소스 종류에 걸쳐 사용할 수 있다. 다음의 `kubectl` 커맨드는 `default` 네임스페이스에 속해있지 않은 모든 스테이트풀셋(StatefulSet)과 서비스를 선택한다.

```shell
kubectl get statefulsets,services --all-namespaces --field-selector metadata.namespace!=default
```
