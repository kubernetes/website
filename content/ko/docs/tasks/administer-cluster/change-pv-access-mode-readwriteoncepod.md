---
title: 퍼시스턴트볼륨의 접근 모드를 ReadWriteOncePod로 변경하기
content_type: task
weight: 90
min-kubernetes-server-version: v1.22
---

<!-- overview -->

이 페이지에서는 기존 퍼시스턴트볼륨(PersistentVolume)의 접근 모드를 `ReadWriteOncePod`로
변경하는 방법을 보여준다.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{< note >}}
`ReadWriteOncePod` 접근 모드는 쿠버네티스 v1.29 릴리스에서 안정(stable) 단계로 
졸업했다. v1.29보다 이전 버전의 쿠버네티스를 실행 중인 경우, 
기능 게이트(feature gate)를 활성화해야 할 수도 있다. 사용 중인 버전의
쿠버네티스 문서를 확인한다.
{{< /note >}}

{{< note >}}
`ReadWriteOncePod` 접근 모드는 
{{< glossary_tooltip text="CSI" term_id="csi" >}} 볼륨에서만 지원된다. 
이 볼륨 접근 모드를 사용하려면 다음 
[CSI 사이드카(sidecar)](https://kubernetes-csi.github.io/docs/sidecar-containers.html)
를 아래 버전 이상으로 업데이트해야 한다.

* [csi-provisioner:v3.0.0+](https://github.com/kubernetes-csi/external-provisioner/releases/tag/v3.0.0)
* [csi-attacher:v3.3.0+](https://github.com/kubernetes-csi/external-attacher/releases/tag/v3.3.0)
* [csi-resizer:v1.3.0+](https://github.com/kubernetes-csi/external-resizer/releases/tag/v1.3.0)
{{< /note >}}

## 왜 `ReadWriteOncePod`를 사용해야 하는가?

쿠버네티스 v1.22 이전에는 `ReadWriteOnce` 접근 모드가 스토리지에 단일 쓰기 접근이 필요한
워크로드에 대해 퍼시스턴트볼륨 접근을 제한하기 위해 주로 사용되었다. 
그러나 이 접근 모드에는 한계가 있었다.
볼륨 접근을 단일 *노드*로만 제한했기 때문에, 동일한 노드 위의 여러 파드가 
동시에 같은 볼륨에 읽기/쓰기를 할 수 있었다. 이는 데이터 안전을 위해 엄격한 단일 쓰기 접근이 
필요한 애플리케이션에 위험을 초래할 수 있다.

워크로드에서 단일 쓰기 접근 보장이 중요하다면, 볼륨을 `ReadWriteOncePod`로 마이그레이션하는 것을 
고려해야 한다.

<!-- steps -->

## 기존 퍼시스턴트볼륨 마이그레이션

기존 퍼시스턴트볼륨이 있다면, `ReadWriteOncePod`를 사용하도록 
마이그레이션할 수 있다.
`ReadWriteOnce`에서 `ReadWriteOncePod`로의 마이그레이션만 지원된다.

이 예시에서는 이미 "cat-pictures-pv" 퍼시스턴트볼륨에 바인딩된 `ReadWriteOnce` 
"cat-pictures-pvc" 퍼시스턴트볼륨클레임(PersistentVolumeClaim)과, 해당 퍼시스턴트볼륨클레임을 
사용하는 "cat-pictures-writer" 디플로이먼트(Deployment)가 존재한다.

{{< note >}}
스토리지 플러그인이
[동적 프로비저닝(Dynamic Provisioning)](/docs/concepts/storage/dynamic-provisioning/)
을 지원하는 경우, "cat-picutres-pv" 가 자동 생성되지만 이름이 다를 수 있다.
퍼시스턴트볼륨의 이름을 확인하려면 다음 명령어를 실행한다.

```shell
kubectl get pvc cat-pictures-pvc -o jsonpath='{.spec.volumeName}'
```
{{< /note >}}

변경하기 전에 PVC를 확인할 수 있다. 매니페스트를 로컬에서 확인하거나, 
`kubectl get pvc <pvc-이름> -o yaml` 명령어를 실행한다. 
출력 결과는 다음과 비슷하다.

```yaml
# cat-pictures-pvc.yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: cat-pictures-pvc
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
```

해당 퍼시스턴트볼륨클레임에 의존하는 디플로이먼트 예시는 다음과 같다.

```yaml
# cat-pictures-writer-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cat-pictures-writer
spec:
  replicas: 3
  selector:
    matchLabels:
      app: cat-pictures-writer
  template:
    metadata:
      labels:
        app: cat-pictures-writer
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
        volumeMounts:
        - name: cat-pictures
          mountPath: /mnt
      volumes:
      - name: cat-pictures
        persistentVolumeClaim:
          claimName: cat-pictures-pvc
          readOnly: false
```

첫 번째 단계로, 퍼시스턴트볼륨의 
`spec.persistentVolumeReclaimPolicy`를 편집하여 `Retain`으로 설정해야 한다. 
이렇게 하면 대응하는 퍼시스턴트볼륨클레임을 삭제했을 때 퍼시스턴트볼륨이 삭제되지 
않는다.

```shell
kubectl patch pv cat-pictures-pv -p '{"spec":{"persistentVolumeReclaimPolicy":"Retain"}}'
```

다음으로, 마이그레이션하려는 퍼시스턴트볼륨에 바인딩된 
퍼시스턴트볼륨클레임을 사용하는 모든 워크로드를 중지하고, 
퍼시스턴트볼륨클레임을 삭제해야 한다. 마이그레이션이 완료될 때까지 
볼륨 크기 조정 등 퍼시스턴트볼륨클레임에 다른 변경을
가하지 않도록 한다.

완료되면, 퍼시스턴트볼륨클레임을 재생성할 때 바인딩될 수 있도록 퍼시스턴트볼륨의 `spec.claimRef.uid`
를 초기화한다.

```shell
kubectl scale --replicas=0 deployment cat-pictures-writer
kubectl delete pvc cat-pictures-pvc
kubectl patch pv cat-pictures-pv -p '{"spec":{"claimRef":{"uid":""}}}'
```

이후, 퍼시스턴트볼륨의 유효한 접근 모드 목록을 
`ReadWriteOncePod`(만)로 교체한다.

```shell
kubectl patch pv cat-pictures-pv -p '{"spec":{"accessModes":["ReadWriteOncePod"]}}'
```

{{< note >}}
`ReadWriteOncePod` 접근 모드는 다른 접근 모드와 함께 사용할 수 없다. 업데이트 시 
퍼시스턴트볼륨의 접근 모드가 `ReadWriteOncePod` 하나뿐인지 확인한다. 그렇지 않으면 요청이 
실패한다.
{{< /note >}}

다음으로, 퍼시스턴트볼륨클레임을 수정하여 `ReadWriteOncePod`를 유일한 
접근 모드로 설정해야 한다. 또한 퍼시스턴트볼륨클레임의 
`spec.volumeName`을 퍼시스턴트볼륨의 이름으로 설정하여 해당 
퍼시스턴트볼륨에 바인딩되도록 해야 한다.

완료되면, 퍼시스턴트볼륨클레임을 재생성하고 
워크로드를 시작할 수 있다.

```shell
# 중요: 적용하기 전에 cat-pictures-pvc.yaml에서 PVC를 편집해야 한다. 다음 사항을 변경한다.
# - ReadWriteOncePod를 유일한 접근 모드로 설정
# - spec.volumeName을 "cat-pictures-pv"로 설정

kubectl apply -f cat-pictures-pvc.yaml
kubectl apply -f cat-pictures-writer-deployment.yaml
```

마지막으로, 이전에 변경했다면 퍼시스턴트볼륨의 `spec.persistentVolumeReclaimPolicy`를 편집하여 
다시 `Delete`로 되돌릴 수 있다.

```shell
kubectl patch pv cat-pictures-pv -p '{"spec":{"persistentVolumeReclaimPolicy":"Delete"}}'
```

## {{% heading "whatsnext" %}}

* [퍼시스턴트볼륨(PersistentVolumes)](/docs/concepts/storage/persistent-volumes/)에 대해 더 알아보기.
* [퍼시스턴트볼륨클레임(PersistentVolumeClaims)](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)에 대해 더 알아보기.
* [스토리지로 퍼시스턴트볼륨을 사용하도록 파드 구성하기](/docs/tutorials/configuration/configure-persistent-volume-storage/)에 대해 더 알아보기.
