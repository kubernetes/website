---
title: 기본 스토리지클래스(StorageClass) 변경하기
content_type: task
---

<!-- overview -->
이 페이지는 특별한 요구사항이 없는 퍼시스턴트볼륨클레임(PersistentVolumeClaim)의 볼륨을 프로비저닝
하는데 사용되는 기본 스토리지 클래스를 변경하는 방법을 보여준다.



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## 왜 기본 스토리지 클래스를 변경하는가?

설치 방법에 따라, 사용자의 쿠버네티스 클러스터는 기본으로 표시된 기존
스토리지클래스와 함께 배포될 수 있다. 이 기본 스토리지클래스는 특정
스토리지 클래스가 필요하지 않은 퍼시스턴트볼륨클레임에 대해 스토리지를
동적으로 프로비저닝 하기 위해 사용된다.
더 자세한 내용은 [퍼시스턴트볼륨클레임 문서](/ko/docs/concepts/storage/persistent-volumes/#퍼시스턴트볼륨클레임)를
보자.

미리 설치된 기본 스토리지클래스가 사용자의 예상되는 워크로드에 적합하지
않을수도 있다. 예를 들어, 너무 가격이 높은 스토리지를 프로비저닝 해야할
수도 있다. 이런 경우에, 기본 스토리지 클래스를 변경하거나 완전히 비활성화
하여 스토리지의 동적 프로비저닝을 방지할 수 있다.

기본 스토리지클래스를 삭제하는 경우, 사용자의 클러스터에서 구동 중인
애드온 매니저에 의해 자동으로 다시 생성될 수 있으므로 정상적으로 삭제가 되지 않을 수도 있다. 애드온 관리자
및 개별 애드온을 비활성화 하는 방법에 대한 자세한 내용은 설치 문서를 참조하자.

## 기본 스토리지클래스 변경하기

1. 사용자의 클러스터에 있는 스토리지클래스 목록을 조회한다.

    ```bash
    kubectl get storageclass
    ```

	결과는 아래와 유사하다.

    ```bash
    NAME                 PROVISIONER               AGE
    standard (default)   kubernetes.io/gce-pd      1d
    gold                 kubernetes.io/gce-pd      1d
    ```

	기본 스토리지클래스는 `(default)` 로 표시되어 있다.

1. 기본 스토리지클래스를 기본값이 아닌 것으로 표시한다.

      기본 스토리지클래스에는
      `storageclass.kubernetes.io/is-default-class` 의 값이 `true` 로 설정되어 있다.
      다른 값이거나 어노테이션이 없을 경우 `false` 로 처리된다.

      스토리지클래스를 기본값이 아닌 것으로 표시하려면, 그 값을 `false` 로 변경해야 한다.

      ```bash
      kubectl patch storageclass standard -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"false"}}}'
      ```

      여기서 `standard` 는 사용자가 선택한 스토리지클래스의 이름이다.

1. 스토리지클래스를 기본값으로 표시한다.

      이전 과정과 유사하게, 어노테이션을 추가/설정해야 한다.
      `storageclass.kubernetes.io/is-default-class=true`.

      ```bash
      kubectl patch storageclass gold -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
      ```

      최대 1개의 스토리지클래스를 기본값으로 표시할 수 있다는 것을 알아두자. 만약
	  2개 이상이 기본값으로 표시되면, 명시적으로 `storageClassName` 가 지정되지 않은 `PersistentVolumeClaim` 은 생성될 수 없다.

1. 사용자가 선택한 스토리지클래스가 기본값으로 되어 있는지 확인한다.

      ```bash
      kubectl get storageclass
      ```

	  결과는 아래와 유사하다.

      ```bash
      NAME             PROVISIONER               AGE
      standard         kubernetes.io/gce-pd      1d
      gold (default)   kubernetes.io/gce-pd      1d
      ```



## {{% heading "whatsnext" %}}

* [퍼시스턴트볼륨(PersistentVolume)](/ko/docs/concepts/storage/persistent-volumes/)에 대해 더 보기.
