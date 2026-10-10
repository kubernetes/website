---
title: 퍼시스턴트볼륨 반환 정책 변경하기
content_type: task
---

<!-- overview -->
이 페이지는 쿠버네티스 퍼시트턴트볼륨(PersistentVolume)의 반환 정책을
변경하는 방법을 보여준다.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## 왜 퍼시스턴트볼륨 반환 정책을 변경하는가?

퍼시스턴트볼륨은 "Retain(보존)", "Recycle(재활용)", "Delete(삭제)" 를 포함한
다양한 반환 정책을 갖는다. 동적으로 프로비저닝 된 퍼시스턴트볼륨의 경우
기본 반환 정책은 "Delete" 이다. 이는 사용자가 해당 `PersistentVolumeClaim` 을 삭제하면,
동적으로 프로비저닝 된 볼륨이 자동적으로 삭제됨을 의미한다.
볼륨에 중요한 데이터가 포함된 경우, 이러한 자동 삭제는 부적절 할 수 있다.
이 경우에는, "Retain" 정책을 사용하는 것이 더 적합하다.
"Retain" 정책에서, 사용자가 퍼시스턴트볼륨클레임을 삭제할 경우 해당하는
퍼시스턴트볼륨은 삭제되지 않는다. 
대신, `Released` 단계로 이동되어, 모든 데이터를 수동으로 복구할 수 있다.

## 퍼시스턴트볼륨 반환 정책 변경하기

1. 사용자의 클러스터에서 퍼시스턴트볼륨을 조회한다.

   ```shell
   kubectl get pv
   ```

   결과는 아래와 같다.

   ```none
   NAME                                       CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS    CLAIM             STORAGECLASS     REASON    AGE
   pvc-b6efd8da-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Delete          Bound     default/claim1    manual                     10s
   pvc-b95650f8-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Delete          Bound     default/claim2    manual                     6s
   pvc-bb3ca71d-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Delete          Bound     default/claim3    manual                     3s
   ```

   이 목록은 동적으로 프로비저닝 된 볼륨을 쉽게 식별할 수 있도록
   각 볼륨에 바인딩 되어 있는 퍼시스턴트볼륨클레임(PersistentVolumeClaim)의 이름도 포함한다.

1. 사용자의 퍼시스턴트볼륨 중 하나를 선택한 후에 반환 정책을 변경한다.

   ```shell
   kubectl patch pv <your-pv-name> -p '{"spec":{"persistentVolumeReclaimPolicy":"Retain"}}'
   ```

   여기서 `<your-pv-name>` 는 사용자가 선택한 퍼시스턴트볼륨의 이름이다.

   {{< note >}}
   윈도우에서는, 공백이 포함된 모든 JSONPath 템플릿에 _겹_ 따옴표를 사용해야 한다.
   (bash에 대해 위에서 표시된 홑 따옴표가 아니다.) 
   따라서 템플릿의 모든 표현식에서 홑 따옴표를 쓰거나, 이스케이프 처리된 겹 따옴표를 써야 한다. 예를 들면 다음과 같다.

   ```cmd
   kubectl patch pv <your-pv-name> -p "{\"spec\":{\"persistentVolumeReclaimPolicy\":\"Retain\"}}"
   ```
   {{< /note >}}

1. 선택한 PersistentVolume이 올바른 정책을 갖는지 확인한다.

   ```shell
   kubectl get pv
   ```

   결과는 아래와 같다.

   ```none
   NAME                                       CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS    CLAIM             STORAGECLASS     REASON    AGE
   pvc-b6efd8da-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Delete          Bound     default/claim1    manual                     40s
   pvc-b95650f8-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Delete          Bound     default/claim2    manual                     36s
   pvc-bb3ca71d-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Retain          Bound     default/claim3    manual                     33s
   ```

   위 결과에서, `default/claim3` 클레임과 바인딩 되어 있는 볼륨이 `Retain` 반환 정책을
   갖는 것을 볼 수 있다. 사용자가 `default/claim3` 클레임을 삭제할 경우,
   볼륨은 자동으로 삭제 되지 않는다.

## {{% heading "whatsnext" %}}

* [퍼시스턴트볼륨](/ko/docs/concepts/storage/persistent-volumes/)에 대해 더 배워 보기.
* [퍼시스턴트볼륨클레임](/ko/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)에 대해 더 배워 보기.

### 레퍼런스 {#reference}

* {{< api-reference page="config-and-storage-resources/persistent-volume-v1" >}}
  * 퍼시스턴트볼륨의 `.spec.persistentVolumeReclaimPolicy` 
    [필드](/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-v1/#PersistentVolumeSpec)에 
    주의한다.
* {{< api-reference page="config-and-storage-resources/persistent-volume-claim-v1" >}}
