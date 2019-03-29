---
title: "예시: WordPress와 MySQL을 퍼시스턴트 볼륨에 배포하기"
reviewers:
- ahmetb
content_template: templates/tutorial
weight: 20
card: 
  name: tutorials
  weight: 40
  title: "스테이트풀셋 예시: Wordpress와 퍼시스턴트 볼륨"
---

{{% capture overview %}}
이 튜토리얼은 WordPress 사이트와 MySQL 데이터베이스를 Minikube를 이용하여 어떻게 배포하는지 보여준다. 애플리케이션 둘 다 퍼시스턴트 볼륨과 퍼시스턴트볼륨클레임을 데이터 저장하기 위해 사용한다. 

[퍼시스턴트볼륨](/docs/concepts/storage/persistent-volumes/) (PV)는 관리자가 수동으로 프로비저닝한 클러스터나 쿠버네티스 [스토리지클래스](/docs/concepts/storage/storage-classes)를 이용해 동적으로 프로비저닝된 저장소의 일부이다. [퍼시스턴트볼륨클레임](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) (PVC)은 PV로 충족할 수 있는 사용자에 의한 스토리지 요청이다. 퍼시스턴트볼륨은 파드 라이프사이클과 독립적이며 재시작, 재스케줄링이나 파드를 삭제할 때에도 데이터를 보존한다.

{{< warning >}}
이 배포는 프로덕션 사용예로는 적절하지 않은데 이는 단일 인스턴스의 WordPress와 MySQL을 이용했기 때문이다. 프로덕션용이라면 [WordPress Helm Chart](https://github.com/kubernetes/charts/tree/master/stable/wordpress)로 배포하기를 고려해보자.
{{< /warning >}}

{{< note >}}
이 튜토리얼에 제공된 파일들은 GA 개발 API를 사용하며 쿠버네티스 버전 1.9 이상을 이용한다. 이 튜토리얼을 쿠버네티스 하위 버전에서 적용한다면 API 버전을 적절히 갱신하거나 이 튜토리얼의 이전 버전을 참고하자.
{{< /note >}}

{{% /capture %}}

{{% capture objectives %}}
* 퍼시스턴트볼륨클레임과 퍼시스턴트볼륨 생성
* 시크릿 생성
* MySQL 배포
* WordPress 배포
* 정리


{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}} 

다음의 설정 파일을 다운로드한다.

1. [mysql-deployment.yaml](/examples/application/wordpress/mysql-deployment.yaml)

1. [wordpress-deployment.yaml](/examples/application/wordpress/wordpress-deployment.yaml)

{{% /capture %}}

{{% capture lessoncontent %}} 

## 퍼시스턴트볼륨클레임과 퍼시스턴트볼륨 생성

MySQL과 Wordpress는 각각 데이터를 저장할 퍼시스턴트볼륨이 필요하다. 퍼시스턴트볼륨클레임은 배포 단계에 생성된다.

많은 클러스터 환경에서 설치된 기본 스토리지클래스(StorageClass)가 있다. 퍼시스턴트볼륨클레임에 스토리지클래스를 지정하지 않으면 클러스터의 기본 스토리지클래스를 사용한다.

퍼시스턴트볼륨클레임이 생성되면 퍼시스턴트볼륨이 스토리지클래스 설정을 기초로 동적으로 프로비저닝된다.

{{< warning >}}
로컬 클러스터에서 기본 스토리지클래스는 `hostPath` 프로비저너를 사용한다. `hostPath`는 개발과 테스트 목적에만 적합하다. `hostPath` 볼륨으로 귀하의 데이터를 스케쥴링되는 파드의 노드에 모드 간의 이동하지 않고 `/tmp` 살게 한다. 파드가 죽고 클러스터 내에 다른 노드로 스케줄링되거나 노드가 재부팅되면 그 데이터는 잃어버린다.
{{< /warning >}}

{{< note >}}
`--enable-hostpath-provisioner` flag must be set in the `controller-manager` component.
클러스터에서 `hostPath` 프로비저너를 필요로한다면, `--enable-hostpath-provisioner` 플래그를 `controller-manager` 컴포넌트에 꼭 설정해야 한다.

{{< /note >}}

{{< note >}}
만약 구글 쿠버네티스 엔진 위에 쿠버네티스 클러스터를 가지고 있다면 [가이드](https://cloud.google.com/kubernetes-engine/docs/tutorials/persistent-disk)를 따르십시오.

{{< /note >}}

## MySQL 암호를 저장할 시크릿 생성

[시크릿](/docs/concepts/configuration/secret/)은 암호나키와 같은 민감한 데이터들을 저장하는 오브젝트이다. 이 메니페스트 파일은 이미 시크릿을 사용하도록 설정하였으니 귀하가 소유한 시크릿을 꼭 생성해야 한다.

1. 시크릿 오브젝트를 다음 명령어로 생성하자.
   `YOUR_PASSWORD` 부분을 사용하기 원하는 패스워드로 치환해야 한다.

      ```shell
      kubectl create secret generic mysql-pass --from-literal=password=YOUR_PASSWORD
      ```
       
2. 다음 명령어를 실행하여 시크릿이 존재하는지 확인하자.
      ```shell
      kubectl get secrets
      ```

      응답은 다음과 같을 것이다.

      ```
      NAME                  TYPE                    DATA      AGE
      mysql-pass            Opaque                  1         42s
      ```

{{< note >}}
시크릿을 노출하지 않고자 `get` 과 `describe` 둘 다 내용을 안 보여준다.
{{< /note >}}

## MySQL 배표

다음 메니페스트는 단일 인스턴스 MySQL 디플로이먼트를 기술한다. MySQL 컨테이너는 /var/lib/mysql 에 퍼시스턴트볼륨을 마운트한다. 시크릿에서 가져온 `MYSQL_ROOT_PASSWORD` 환경 변수는 데이터베이스 암호를 설정한다.

{{< codenew file="application/wordpress/mysql-deployment.yaml" >}}

1. `mysql-deployment.yaml` 파일로 MySQL 을 배포하자.

      ```shell
      kubectl create -f https://k8s.io/examples/application/wordpress/mysql-deployment.yaml
      ```

2. 퍼시스턴트볼륨을 동적으로 프로비전했는지 확인하자.

      ```shell
      kubectl get pvc
      ```
      
      {{< note >}}
      PV를 프로비전하고 정착(bound)시키는데 수 분이 걸릴 수 있다.
      {{< /note >}}

      응답은 다음과 같을 것이다.

      ```
      NAME             STATUS    VOLUME                                     CAPACITY ACCESS MODES   STORAGECLASS   AGE
      mysql-pv-claim   Bound     pvc-91e44fbf-d477-11e7-ac6a-42010a800002   20Gi     RWO            standard       29s
      ```

3. 다음 명령어를 실행하여 파드를 확인해보자.

      ```shell
      kubectl get pods
      ```

      {{< note >}}
      파드의 상태가 `RUNNING`가 되기까지  프로비전하고 수 분이 걸릴 수 있다.
      {{< /note >}}

      응답은 다음과 같을 것이다.

      ```
      NAME                               READY     STATUS    RESTARTS   AGE
      wordpress-mysql-1894417608-x5dzt   1/1       Running   0          40s
      ```

## WordPress 배포

다음 메니페스트는 단일 인스턴스 WordPress 디폴로이먼트와 서비스를 기술한다. 퍼시스턴트 스토리지와 암호를 위한 스크릿 같은 기능을 많이 이용한다. 그러나 다른 설정 `type: LoadBalancer` 또한 이용한다. 이 설정은 WordPress 를 클러스터 바깥 트래픽에 노출시킨다.

{{< codenew file="application/wordpress/wordpress-deployment.yaml" >}}

1. WordPress 서비스와 디폴로이먼트를 `wordpress-deployment.yaml`로 생성하자.

      ```shell
      kubectl create -f https://k8s.io/examples/application/wordpress/wordpress-deployment.yaml
      ```

2. 동적으로 프로비전한 퍼시스턴트볼륨을 확인하자.

      ```shell
      kubectl get pvc
      ```

      {{< note >}}
      PV를 프로비전하고 정착(bound)시키는데 수 분이 걸릴 수 있다.
      {{< /note >}}

      응답은 다음과 같을 것이다.

      ```
      NAME             STATUS    VOLUME                                     CAPACITY ACCESS MODES   STORAGECLASS   AGE
      wp-pv-claim      Bound     pvc-e69d834d-d477-11e7-ac6a-42010a800002   20Gi     RWO            standard       7s
      ```

3. 다음 명령어를 실행하여 서비스를 확인하자.

      ```shell
      kubectl get services wordpress
      ```

      응답은 다음과 같을 것이다.

      ```
      NAME        TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)        AGE
      wordpress   ClusterIP   10.0.0.89    <pending>     80:32406/TCP   4m
      ```

      {{< note >}}
      Minikube는 서비스를 오직 `NodePort`를 통해서만 노출할 수 있다. EXTERNAL-IP는 항상 펜딩상태임.
      {{< /note >}}

4. 다음 명령어를 실행해서 WordPress 서비스의 IP 주소를 알아보자.

      ```shell
      minikube service wordpress --url
      ```

      응답은 다음과 같을 것이다.

      ```
      http://1.2.3.4:32406
      ```

5. IP 주소를 복사해서 웹 브라우저에서 귀하의 사이트를 열어 보자.

   다음 스크린 샷과 유사한 WordPress 설정 페이지를 볼 수 있을 것이다.

   ![워드프레스 초기화](https://raw.githubusercontent.com/kubernetes/examples/master/mysql-wordpress-pd/WordPress.png)

{{< warning >}}
이 페이지의 WordPress 설치를 내버려 두지 말자. 다른 사용자가 이 페이지를 발견하고 귀하의 인스턴스에 웹 사이트를 설정하고 악의적인 컨텐츠를 게시하는데 사용할 수 있다. <br/><br/>WordPress를 사용자명과 암호를 넣어 생성하거나 인스턴스를 삭제하자.
{{< /warning >}}

{{% /capture %}}

{{% capture cleanup %}}

1. 시크릿을 삭제하는 다음 명령어를 실행하자.

      ```shell
      kubectl delete secret mysql-pass
      ```

2. 모든 디플로이먼트와 서비스를 삭제하는 다음 명령어를 실행하자.

      ```shell
      kubectl delete deployment -l app=wordpress
      kubectl delete service -l app=wordpress
      ```

3. 다음 명령어를 실행하여 퍼시스턴트볼륨클레임을 삭제하자.  동적으로 프로비저닝된 퍼시스턴스볼륨은 자동적으로 삭제될 것이다.

      ```shell
      kubectl delete pvc -l app=wordpress
      ```

{{% /capture %}}

{{% capture whatsnext %}}

* [인트로스펙션과 디버깅](/docs/tasks/debug-application-cluster/debug-application-introspection/)를 알아보자.
* [잡](/docs/concepts/workloads/controllers/jobs-run-to-completion/)를 알아보자.
* [포트 포워딩](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)를 알아보자
* 어떻게 [컨테이서 쉘을 사용할 수 있는지](/docs/tasks/debug-application-cluster/get-shell-running-container/)를 알아보자

{{% /capture %}}

