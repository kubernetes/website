---
title: "예시: WordPress와 MySQL을 퍼시스턴트 볼륨에 배포하기"
reviewers:
content_template: templates/tutorial
weight: 20
card: 
  name: tutorials
  weight: 40
  title: "스테이트풀셋 예시: Wordpress와 퍼시스턴트 볼륨"
---

{{% capture overview %}}
이 튜토리얼은 WordPress 사이트와 MySQL 데이터베이스를 Minikube를 이용하여 어떻게 배포하는지 보여준다. 애플리케이션 둘 다 퍼시스턴트 볼륨과 퍼시스턴트볼륨클레임을 데이터를 저장하기 위해 사용한다.

[퍼시스턴트볼륨](/docs/concepts/storage/persistent-volumes/)(PV)는 관리자가 수동으로 프로비저닝한 클러스터나 쿠버네티스 [스토리지클래스](/docs/concepts/storage/storage-classes)를 이용해 동적으로 프로비저닝된 저장소의 일부이다. [퍼시스턴트볼륨클레임](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)(PVC)은 PV로 충족할 수 있는 사용자에 의한 스토리지 요청이다. 퍼시스턴트볼륨은 파드 라이프사이클과 독립적이며 재시작, 재스케줄링이나 파드를 삭제할 때에도 데이터를 보존한다.

{{< warning >}}
이 배포는 프로덕션 사용예로는 적절하지 않은데 이는 단일 인스턴스의 WordPress와 MySQL을 이용했기 때문이다. 프로덕션이라면 [WordPress Helm Chart](https://github.com/kubernetes/charts/tree/master/stable/wordpress)로 배포하기를 고려해보자.
{{< /warning >}}

{{< note >}}
이 튜토리얼에 제공된 파일들은 GA 디플로이먼트 API를 사용하며 쿠버네티스 버전 1.9 이상을 이용한다. 이 튜토리얼을 쿠버네티스 하위 버전에서 적용한다면 API 버전을 적절히 갱신하거나 이 튜토리얼의 이전 버전을 참고하자.
{{< /note >}}

{{% /capture %}}

{{% capture objectives %}}
* 퍼시스턴트볼륨클레임과 퍼시스턴트볼륨 생성
* 다음을 포함하는 `kustomization.yaml` 생성
  * 시크릿 생성자
  * MySQL 리소스 구성
  * WordPress 리소스 구성
* `kubectl apply -k ./`로 생성한 kustomization 을 적용
* 정리

{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
이 예시는 `kubectl` 1.14 이상 버전에서 동작한다.

다음 설정 파일을 다운로드한다.

1. [mysql-deployment.yaml](/examples/application/wordpress/mysql-deployment.yaml)

1. [wordpress-deployment.yaml](/examples/application/wordpress/wordpress-deployment.yaml)

{{% /capture %}}

{{% capture lessoncontent %}}

## 퍼시스턴트볼륨클레임과 퍼시스턴트볼륨 생성

MySQL과 Wordpress는 각각 데이터를 저장할 퍼시스턴트볼륨이 필요하다. 퍼시스턴트볼륨클레임은 배포 단계에 생성된다.

많은 클러스터 환경에서 설치된 기본 스토리지클래스(StorageClass)가 있다. 퍼시스턴트볼륨클레임에 스토리지클래스를 지정하지 않으면 클러스터의 기본 스토리지클래스를 사용한다.

퍼시스턴트볼륨클레임이 생성되면 퍼시스턴트볼륨이 스토리지클래스 설정을 기초로 동적으로 프로비저닝된다.

{{< warning >}}
로컬 클러스터에서 기본 스토리지클래스는 `hostPath` 프로비저너를 사용한다. `hostPath`는 개발과 테스트 목적에만 적합하다. `hostPath` 볼륨인 경우 데이터는 스케쥴링된 파드의 노드에 `/tmp` 살아있고 노드 간에 이동하지 않는다. 파드가 죽어서 클러스터 내에 다른 노드로 스케줄링되거나 해당 노드가 재부팅되면 그 데이터는 잃어버린다.
{{< /warning >}}

{{< note >}}
`hostPath` 프로비저너를 사용해야 하는 클러스터를 기동하는 경우라면 `--enable-hostpath-provisioner` 플래그를 `controller-manager` 컴포넌트에 꼭 설정해야 한다.
{{< /note >}}

{{< note >}}
만약 구글 쿠버네티스 엔진으로 운영하는 쿠버네티스 클러스터를 가지고 있다면 [가이드](https://cloud.google.com/kubernetes-engine/docs/tutorials/persistent-disk)를 따르도록 한다.
{{< /note >}}

## kustomization.yaml 생성하기

### 시크릿 생성자 추가
[시크릿](/docs/concepts/configuration/secret/)은 암호나 키 같은 민감한 데이터들을 저장하는 개체이다. 1.14 버전부터 `kubectl`은 kustomization 파일을 이용해서 쿠버네티스 개체를 관리한다. `kustomization.yaml`의 제네레니터로 시크릿을 생성할 수 있다.

다음 명령어로 `kustomization.yaml` 내에 시크릿 제네레이터를 추가한다. `YOUR_PASSWORD`는 사용하기 원하는 암호로 변경해야 한다.

```shell
cat <<EOF >./kustomization.yaml
secretGenerator:
- name: mysql-pass
  literals:
  - password=YOUR_PASSWORD
EOF
```

## MySQL과 WordPress에 필요한 리소스 구성 추가하기

다음 매니페스트는 MySQL 디플로이먼트 단일 인스턴스를 기술한다. MySQL 컨케이너는 퍼시스턴트볼륨을 /var/lib/mysql에 마운트한다. `MYSQL_ROOT_PASSWORD` 환경변수는 시크릿에서 가져와 데이터베이스 암호로 설정한다.

{{< codenew file="application/wordpress/mysql-deployment.yaml" >}}

1. MySQL 디플로이먼트 구성 파일을 다운로드한다.

      ```shell
      curl -LO https://k8s.io/examples/application/wordpress/mysql-deployment.yaml
      ```
            
2. WordPress 구성 파일을 다운로드한다.

      ```shell
      curl -LO https://k8s.io/examples/application/wordpress/wordpress-deployment.yaml
      ```
      
3. 두 파일을 `kustomization.yaml`에 추가하자.

      ```shell
      cat <<EOF >>./kustomization.yaml
      resources:
        - mysql-deployment.yaml
        - wordpress-deployment.yaml
      EOF
      ```

## 적용하고 확인하기
`kustomization.yaml`은 WordPress 사이트와 MySQL 데이터베이스를 배포하는 모든 리소스를 포함한다.
다음과 같이 디렉터리를 적용할 수 있다.
```shell
kubectl apply -k ./
```

이제 모든 개체가 존재하는지 확인할 수 있다.

1. 시크릿이 존재하는지 다음 명령어를 실행하여 확인한다.

      ```shell
      kubectl get secrets
      ```

      응답은 아래와 비슷해야 한다.

      ```shell
      NAME                    TYPE                                  DATA   AGE
      mysql-pass-c57bb4t7mf   Opaque                                1      9s
      ```

2. 퍼시스턴트볼륨이 동적으로 프로비저닝되었는지 확인한다.

      ```shell
      kubectl get pvc
      ```
      
      {{< note >}}
      PV를 프로비저닝하고 정착(bound)시키는데 수 분이 걸릴 수 있다.
      {{< /note >}}

      응답은 아래와 비슷해야 한다.

      ```shell
      NAME             STATUS    VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS       AGE
      mysql-pv-claim   Bound     pvc-8cbd7b2e-4044-11e9-b2bb-42010a800002   20Gi       RWO            standard           77s
      wp-pv-claim      Bound     pvc-8cd0df54-4044-11e9-b2bb-42010a800002   20Gi       RWO            standard           77s
      ```

3. 다음 명령어를 실행하여 파드가 실행 중인지 확인한다.

      ```shell
      kubectl get pods
      ```

      {{< note >}}
      파드의 상태가 `RUNNING`가 되기까지 수 분이 걸릴 수 있다.
      {{< /note >}}

      응답은 아래와 비슷해야 한다.

      ```
      NAME                               READY     STATUS    RESTARTS   AGE
      wordpress-mysql-1894417608-x5dzt   1/1       Running   0          40s
      ```

4. 다음 명령어를 실행하여 서비스가 실행 중인지 확인해보자.

      ```shell
      kubectl get services wordpress
      ```

      응답은 아래와 비슷해야 한다.

      ```
      NAME        TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)        AGE
      wordpress   ClusterIP   10.0.0.89    <pending>     80:32406/TCP   4m
      ```

      {{< note >}}
      Minikube에서는 서비스를 `NodePort`으로만 노출할 수 있다. EXTERNAL-IP는 항상 Pending 상태이다.
      {{< /note >}}

5. 다음 명령어를 실행하여 WordPress 서비스의 IP 주소를 얻어온다.

      ```shell
      minikube service wordpress --url
      ```

      응답은 아래와 비슷해야 한다.

      ```
      http://1.2.3.4:32406
      ```

6. IP 주소를 복사해서 웹 브라우저에서 사이트를 열어 보자.

   아래 스크린샷과 유사한 WordPress 설정 페이지를 볼 수 있어야 한다.

   ![wordpress-init](https://raw.githubusercontent.com/kubernetes/examples/master/mysql-wordpress-pd/WordPress.png)

{{< warning >}}
이 페이지의 WordPress 설치를 내버려 두지 말자. 다른 사용자가 이 페이지를 발견하고 귀하의 인스턴스에 웹 사이트를 설정하고 악의적인 컨텐츠를 게시하는데 사용할 수 있다. <br/><br/>WordPress를 사용자명과 암호를 넣어 생성하거나 인스턴스를 삭제하자.
{{< /warning >}}

{{% /capture %}}

{{% capture cleanup %}}

1. 다음 명령을 실핼하여 시크릿, 디플로이먼트, 서비스와 퍼시스턴트볼륨클레임을 삭제하자.

      ```shell
      kubectl delete -k ./
      ```

{{% /capture %}}

{{% capture whatsnext %}}

* [인트로스펙션과 디버깅](/docs/tasks/debug-application-cluster/debug-application-introspection/)를 알아보자.
* [잡](/docs/concepts/workloads/controllers/jobs-run-to-completion/)를 알아보자.
* [포트 포워딩](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)를 알아보자.
* 어떻게 [컨테이너에서 셸을 사용하는지](/docs/tasks/debug-application-cluster/get-shell-running-container/)를 알아보자.

{{% /capture %}}

