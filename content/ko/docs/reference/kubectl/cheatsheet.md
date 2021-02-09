---
title: kubectl 치트 시트
content_type: concept
card:
  name: reference
  weight: 30
---

<!-- overview -->

이 페이지는 일반적으로 사용하는 `kubectl` 커맨드와 플래그에 대한 목록을 포함한다.

<!-- body -->

## Kubectl 자동 완성

### BASH

```bash
source <(kubectl completion bash) # bash-completion 패키지를 먼저 설치한 후, bash의 자동 완성을 현재 셸에 설정한다
echo "source <(kubectl completion bash)" >> ~/.bashrc # 자동 완성을 bash 셸에 영구적으로 추가한다
```

또한, `kubectl`의 의미로 사용되는 약칭을 사용할 수 있다.

```bash
alias k=kubectl
complete -F __start_kubectl k
```

### ZSH

```bash
source <(kubectl completion zsh)  # 현재 셸에 zsh의 자동 완성 설정
echo "[[ $commands[kubectl] ]] && source <(kubectl completion zsh)" >> ~/.zshrc # 자동 완성을 zsh 셸에 영구적으로 추가한다.
```

## Kubectl 컨텍스트와 설정

`kubectl`이 통신하고 설정 정보를 수정하는 쿠버네티스 클러스터를
지정한다. 설정 파일에 대한 자세한 정보는 [kubeconfig를 이용한 클러스터 간 인증](/ko/docs/tasks/access-application-cluster/configure-access-multiple-clusters/) 문서를
참고한다.

```bash
kubectl config view # 병합된 kubeconfig 설정을 표시한다.

# 동시에 여러 kubeconfig 파일을 사용하고 병합된 구성을 확인한다
KUBECONFIG=~/.kube/config:~/.kube/kubconfig2

kubectl config view

# e2e 사용자의 암호를 확인한다
kubectl config view -o jsonpath='{.users[?(@.name == "e2e")].user.password}'

kubectl config view -o jsonpath='{.users[].name}'    # 첫 번째 사용자 출력
kubectl config view -o jsonpath='{.users[*].name}'    # 사용자 리스트 조회
kubectl config get-contexts                          # 컨텍스트 리스트 출력
kubectl config current-context              # 현재 컨텍스트 출력
kubectl config use-context my-cluster-name  # my-cluster-name를 기본 컨텍스트로 설정

# 기본 인증을 지원하는 새로운 사용자를 kubeconf에 추가한다
kubectl config set-credentials kubeuser/foo.kubernetes.com --username=kubeuser --password=kubepassword

# 해당 컨텍스트에서 모든 후속 kubectl 커맨드에 대한 네임스페이스를 영구적으로 저장한다
kubectl config set-context --current --namespace=ggckad-s2

# 특정 사용자와 네임스페이스를 사용하는 컨텍스트 설정
kubectl config set-context gce --user=cluster-admin --namespace=foo \
  && kubectl config use-context gce

kubectl config unset users.foo                       # foo 사용자 삭제
```

## Kubectl apply

`apply`는 쿠버네티스 리소스를 정의하는 파일을 통해 애플리케이션을 관리한다. `kubectl apply`를 실행하여 클러스터에 리소스를 생성하고 업데이트한다. 이것은 프로덕션 환경에서 쿠버네티스 애플리케이션을 관리할 때 권장된다. [Kubectl Book](https://kubectl.docs.kubernetes.io)을 참고한다.

## 오브젝트 생성

쿠버네티스 매니페스트는 JSON이나 YAML로 정의된다. 파일 확장자는 `.yaml`
, `.yml`, `.json` 이 사용된다.

```bash
kubectl apply -f ./my-manifest.yaml            # 리소스(들) 생성
kubectl apply -f ./my1.yaml -f ./my2.yaml      # 여러 파일로 부터 생성
kubectl apply -f ./dir                         # dir 내 모든 매니페스트 파일에서 리소스(들) 생성
kubectl apply -f https://git.io/vPieo          # url로부터 리소스(들) 생성
kubectl create deployment nginx --image=nginx  # nginx 단일 인스턴스를 시작

# "Hello World"를 출력하는 잡(Job) 생성
kubectl create job hello --image=busybox -- echo "Hello World"

# 매분마다 "Hello World"를 출력하는 크론잡(CronJob) 생성
kubectl create cronjob hello --image=busybox   --schedule="*/1 * * * *" -- echo "Hello World"    

kubectl explain pods                           # 파드 매니페스트 문서를 조회

# stdin으로 다수의 YAML 오브젝트 생성
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: busybox-sleep
spec:
  containers:
  - name: busybox
    image: busybox
    args:
    - sleep
    - "1000000"
---
apiVersion: v1
kind: Pod
metadata:
  name: busybox-sleep-less
spec:
  containers:
  - name: busybox
    image: busybox
    args:
    - sleep
    - "1000"
EOF

# 여러 개의 키로 시크릿 생성
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  password: $(echo -n "s33msi4" | base64 -w0)
  username: $(echo -n "jane" | base64 -w0)
EOF

```

## 리소스 조회 및 찾기

```bash
# 기본 출력을 위한 Get 커맨드
kubectl get services                          # 네임스페이스 내 모든 서비스의 목록 조회
kubectl get pods --all-namespaces             # 모든 네임스페이스 내 모든 파드의 목록 조회
kubectl get pods -o wide                      # 해당하는 네임스페이스 내 모든 파드의 상세 목록 조회
kubectl get deployment my-dep                 # 특정 디플로이먼트의 목록 조회
kubectl get pods                              # 네임스페이스 내 모든 파드의 목록 조회
kubectl get pod my-pod -o yaml                # 파드의 YAML 조회

# 상세 출력을 위한 Describe 커맨드
kubectl describe nodes my-node
kubectl describe pods my-pod

# Name으로 정렬된 서비스의 목록 조회
kubectl get services --sort-by=.metadata.name

# 재시작 횟수로 정렬된 파드의 목록 조회
kubectl get pods --sort-by='.status.containerStatuses[0].restartCount'

# PersistentVolumes을 용량별로 정렬해서 조회
kubectl get pv --sort-by=.spec.capacity.storage

# app=cassandra 레이블을 가진 모든 파드의 레이블 버전 조회
kubectl get pods --selector=app=cassandra -o \
  jsonpath='{.items[*].metadata.labels.version}'

# 예를 들어 'ca.crt'와 같이 점이 있는 키값을 검색한다
kubectl get configmap myconfig \
  -o jsonpath='{.data.ca\.crt}'

# 모든 워커 노드 조회 (셀렉터를 사용하여 'node-role.kubernetes.io/master'
# 으로 명명된 라벨의 결과를 제외)
kubectl get node --selector='!node-role.kubernetes.io/master'

# 네임스페이스의 모든 실행 중인 파드를 조회
kubectl get pods --field-selector=status.phase=Running

# 모든 노드의 외부IP를 조회
kubectl get nodes -o jsonpath='{.items[*].status.addresses[?(@.type=="ExternalIP")].address}'

# 특정 RC에 속해있는 파드 이름의 목록 조회
# "jq" 커맨드는 jsonpath를 사용하는 매우 복잡한 변환에 유용하다. https://stedolan.github.io/jq/ 에서 확인할 수 있다.
sel=${$(kubectl get rc my-rc --output=json | jq -j '.spec.selector | to_entries | .[] | "\(.key)=\(.value),"')%?}
echo $(kubectl get pods --selector=$sel --output=jsonpath={.items..metadata.name})

# 모든 파드(또는 레이블을 지원하는 다른 쿠버네티스 오브젝트)의 레이블 조회
kubectl get pods --show-labels

# 어떤 노드가 준비됐는지 확인
JSONPATH='{range .items[*]}{@.metadata.name}:{range @.status.conditions[*]}{@.type}={@.status};{end}{end}' \
 && kubectl get nodes -o jsonpath="$JSONPATH" | grep "Ready=True"

# 외부 도구 없이 디코딩된 시크릿 출력
kubectl get secret ${secret_name} -o go-template='{{range $k,$v := .data}}{{$k}}={{$v|base64decode}}{{"\n"}}{{end}}'

# 파드에 의해 현재 사용되고 있는 모든 시크릿 목록 조회
kubectl get pods -o json | jq '.items[].spec.containers[].env[]?.valueFrom.secretKeyRef.name' | grep -v null | sort | uniq

# 모든 파드의 초기화 컨테이너(initContainer)의 컨테이너ID 목록 조회
# 초기화 컨테이너(initContainer)를 제거하지 않고 정지된 모든 컨테이너를 정리할 때 유용하다.
kubectl get pods --all-namespaces -o jsonpath='{range .items[*].status.initContainerStatuses[*]}{.containerID}{"\n"}{end}' | cut -d/ -f3

# 타임스탬프로 정렬된 이벤트 목록 조회
kubectl get events --sort-by=.metadata.creationTimestamp

# 매니페스트가 적용된 경우 클러스터의 현재 상태와 클러스터의 상태를 비교한다.
kubectl diff -f ./my-manifest.yaml

# 노드에 대해 반환된 모든 키의 마침표로 구분된 트리를 생성한다.
# 복잡한 중첩 JSON 구조 내에서 키를 찾을 때 유용하다.
kubectl get nodes -o json | jq -c 'path(..)|[.[]|tostring]|join(".")'

# 파드 등에 대해 반환된 모든 키의 마침표로 구분된 트리를 생성한다.
kubectl get pods -o json | jq -c 'path(..)|[.[]|tostring]|join(".")'
```

## 리소스 업데이트


```bash
kubectl set image deployment/frontend www=image:v2               # "frontend" 디플로이먼트의 "www" 컨테이너 이미지를 업데이트하는 롤링 업데이트
kubectl rollout history deployment/frontend                      # 현 리비전을 포함한 디플로이먼트의 이력을 체크
kubectl rollout undo deployment/frontend                         # 이전 디플로이먼트로 롤백
kubectl rollout undo deployment/frontend --to-revision=2         # 특정 리비전으로 롤백
kubectl rollout status -w deployment/frontend                    # 완료될 때까지 "frontend" 디플로이먼트의 롤링 업데이트 상태를 감시
kubectl rollout restart deployment/frontend                      # "frontend" 디플로이먼트의 롤링 재시작


cat pod.json | kubectl replace -f -                              # std로 전달된 JSON을 기반으로 파드 교체

# 리소스를 강제 교체, 삭제 후 재생성함. 이것은 서비스를 중단시킴.
kubectl replace --force -f ./pod.json

# 복제된 nginx를 위한 서비스를 생성한다. 80 포트로 서비스하고, 컨테이너는 8000 포트로 연결한다.
kubectl expose rc nginx --port=80 --target-port=8000

# 단일-컨테이너 파드의 이미지 버전(태그)을 v4로 업데이트
kubectl get pod mypod -o yaml | sed 's/\(image: myimage\):.*$/\1:v4/' | kubectl replace -f -

kubectl label pods my-pod new-label=awesome                      # 레이블 추가
kubectl annotate pods my-pod icon-url=http://goo.gl/XXBTWq       # 어노테이션 추가
kubectl autoscale deployment foo --min=2 --max=10                # 디플로이먼트 "foo" 오토스케일
```

## 리소스 패치

```bash
kubectl patch node k8s-node-1 -p '{"spec":{"unschedulable":true}}' # 노드를 부분적으로 업데이트

# 컨테이너의 이미지를 업데이트. 병합(merge) 키이므로, spec.containers[*].name이 필요.
kubectl patch pod valid-pod -p '{"spec":{"containers":[{"name":"kubernetes-serve-hostname","image":"new image"}]}}'

# 위치 배열을 이용한 json 패치를 사용하여, 컨테이너의 이미지를 업데이트.
kubectl patch pod valid-pod --type='json' -p='[{"op": "replace", "path": "/spec/containers/0/image", "value":"new image"}]'

# 위치 배열을 이용한 json 패치를 사용하여 livenessProbe 디플로이먼트 비활성화.
kubectl patch deployment valid-deployment  --type json   -p='[{"op": "remove", "path": "/spec/template/spec/containers/0/livenessProbe"}]'

# 위치 배열에 새 요소 추가
kubectl patch sa default --type='json' -p='[{"op": "add", "path": "/secrets/1", "value": {"name": "whatever" } }]'
```

## 리소스 편집

편집기로 모든 API 리소스를 편집.

```bash
kubectl edit svc/docker-registry                      # docker-registry라는 서비스 편집
KUBE_EDITOR="nano" kubectl edit svc/docker-registry   # 다른 편집기 사용
```

## 리소스 스케일링

```bash
kubectl scale --replicas=3 rs/foo                                 # 'foo'라는 레플리카셋을 3으로 스케일
kubectl scale --replicas=3 -f foo.yaml                            # "foo.yaml"에 지정된 리소스의 크기를 3으로 스케일
kubectl scale --current-replicas=2 --replicas=3 deployment/mysql  # mysql이라는 디플로이먼트의 현재 크기가 2인 경우, mysql을 3으로 스케일
kubectl scale --replicas=5 rc/foo rc/bar rc/baz                   # 여러 개의 레플리케이션 컨트롤러 스케일
```

## 리소스 삭제

```bash
kubectl delete -f ./pod.json                                              # pod.json에 지정된 유형 및 이름을 사용하여 파드 삭제
kubectl delete pod,service baz foo                                        # "baz", "foo"와 동일한 이름을 가진 파드와 서비스 삭제
kubectl delete pods,services -l name=myLabel                              # name=myLabel 라벨을 가진 파드와 서비스 삭제
kubectl delete pods,services -l name=myLabel --include-uninitialized      # 초기화되지 않은 것을 포함하여, name=myLabel 라벨을 가진 파드와 서비스 삭제
kubectl -n my-ns delete pod,svc --all                                      # 초기화되지 않은 것을 포함하여, my-ns 네임스페이스 내 모든 파드와 서비스 삭제
# awk pattern1 또는 pattern2에 매칭되는 모든 파드 삭제
kubectl get pods  -n mynamespace --no-headers=true | awk '/pattern1|pattern2/{print $1}' | xargs  kubectl delete -n mynamespace pod
```

## 실행 중인 파드와 상호 작용

```bash
kubectl logs my-pod                                 # 파드 로그(stdout) 덤프
kubectl logs -l name=myLabel                        # name이 myLabel인 파드 로그 덤프 (stdout)
kubectl logs my-pod --previous                      # 컨테이너의 이전 인스턴스 생성에 대한 파드 로그(stdout) 덤프
kubectl logs my-pod -c my-container                 # 파드 로그(stdout, 멀티-컨테이너 경우) 덤프
kubectl logs -l name=myLabel -c my-container        # name이 myLabel인 파드 로그 덤프 (stdout)
kubectl logs my-pod -c my-container --previous      # 컨테이너의 이전 인스턴스 생성에 대한 파드 로그(stdout, 멀티-컨테이너 경우) 덤프
kubectl logs -f my-pod                              # 실시간 스트림 파드 로그(stdout)
kubectl logs -f my-pod -c my-container              # 실시간 스트림 파드 로그(stdout, 멀티-컨테이너 경우)
kubectl logs -f -l name=myLabel --all-containers    # name이 myLabel인 모든 파드의 로그 스트리밍 (stdout)
kubectl run -i --tty busybox --image=busybox -- sh  # 대화형 셸로 파드를 실행
kubectl run nginx --image=nginx -n
mynamespace                                         # 특정 네임스페이스에서 nginx 파드 실행
kubectl run nginx --image=nginx                     # nginx 파드를 실행하고 해당 스펙을 pod.yaml 파일에 기록
--dry-run=client -o yaml > pod.yaml

kubectl attach my-pod -i                            # 실행 중인 컨테이너에 연결
kubectl port-forward my-pod 5000:6000               # 로컬 머신의 5000번 포트를 리스닝하고, my-pod의 6000번 포트로 전달
kubectl exec my-pod -- ls /                         # 기존 파드에서 명령 실행(한 개 컨테이너 경우)
kubectl exec --stdin --tty my-pod -- /bin/sh        # 실행 중인 파드로 대화형 셸 액세스(1 컨테이너 경우)
kubectl exec my-pod -c my-container -- ls /         # 기존 파드에서 명령 실행(멀티-컨테이너 경우)
kubectl top pod POD_NAME --containers               # 특정 파드와 해당 컨테이너에 대한 메트릭 표시
kubectl top pod POD_NAME --sort-by=cpu              # 지정한 파드에 대한 메트릭을 표시하고 'cpu' 또는 'memory'별로 정렬
```

## 노드, 클러스터와 상호 작용

```bash
kubectl cordon my-node                                                # my-node를 스케줄링할 수 없도록 표기
kubectl drain my-node                                                 # 유지 보수를 위해서 my-node를 준비 상태로 비움
kubectl uncordon my-node                                              # my-node를 스케줄링할 수 있도록 표기
kubectl top node my-node                                              # 주어진 노드에 대한 메트릭 표시
kubectl cluster-info                                                  # 마스터 및 서비스의 주소 표시
kubectl cluster-info dump                                             # 현재 클러스터 상태를 stdout으로 덤프
kubectl cluster-info dump --output-directory=/path/to/cluster-state   # 현재 클러스터 상태를 /path/to/cluster-state으로 덤프

# key와 effect가 있는 테인트(taint)가 이미 존재하면, 그 값이 지정된 대로 대체된다.
kubectl taint nodes foo dedicated=special-user:NoSchedule
```

### 리소스 타입

단축명, [API 그룹](/ko/docs/concepts/overview/kubernetes-api/#api-그룹)과 함께 지원되는 모든 리소스 유형들, 그것들의 [네임스페이스](/ko/docs/concepts/overview/working-with-objects/namespaces)와 [종류(Kind)](/ko/docs/concepts/overview/working-with-objects/kubernetes-objects)를 나열:

```bash
kubectl api-resources
```

API 리소스를 탐색하기 위한 다른 작업:

```bash
kubectl api-resources --namespaced=true      # 네임스페이스를 가지는 모든 리소스
kubectl api-resources --namespaced=false     # 네임스페이스를 가지지 않는 모든 리소스
kubectl api-resources -o name                # 모든 리소스의 단순한 (리소스 이름 만) 출력
kubectl api-resources -o wide                # 모든 리소스의 확장된 ("wide"로 알려진) 출력
kubectl api-resources --verbs=list,get       # "list"와 "get"의 요청 동사를 지원하는 모든 리소스 출력
kubectl api-resources --api-group=extensions # "extensions" API 그룹의 모든 리소스
```

### 출력 형식 지정

특정 형식으로 터미널 창에 세부 사항을 출력하려면, 지원되는 `kubectl` 명령에 `-o` (또는 `--output`) 플래그를 추가한다.

출력 형식       | 세부 사항
--------------| -----------
`-o=custom-columns=<명세>` | 쉼표로 구분된 사용자 정의 열 목록을 사용하여 테이블 출력
`-o=custom-columns-file=<파일명>` | `<파일명>`파일에서 사용자 정의 열 템플릿을 사용하여 테이블 출력
`-o=json`     | JSON 형식의 API 오브젝트 출력
`-o=jsonpath=<템플릿>` | [jsonpath](/ko/docs/reference/kubectl/jsonpath) 표현식에 정의된 필드 출력
`-o=jsonpath-file=<파일명>` | <파일명> 파일에서 [jsonpath](/ko/docs/reference/kubectl/jsonpath) 표현식에 정의된 필드 출력
`-o=name`     | 리소스 명만 출력하고 그 외에는 출력하지 않음
`-o=wide`     | 추가 정보가 포함된 일반-텍스트 형식으로 출력하고, 파드의 경우 노드 명이 포함
`-o=yaml`     | YAML 형식의 API 오브젝트 출력

`-o=custom-columns` 의 사용 예시:

```bash
# 클러스터에서 실행 중인 모든 이미지
kubectl get pods -A -o=custom-columns='DATA:spec.containers[*].image'

 # "k8s.gcr.io/coredns:1.6.2" 를 제외한 모든 이미지
kubectl get pods -A -o=custom-columns='DATA:spec.containers[?(@.image!="k8s.gcr.io/coredns:1.6.2")].image'

# 이름에 관계없이 메타데이터 아래의 모든 필드
kubectl get pods -A -o=custom-columns='DATA:metadata.*'
```

더 많은 예제는 kubectl [참조 문서](/ko/docs/reference/kubectl/overview/#custom-columns)를 참고한다.

### Kubectl 출력 로그 상세 레벨(verbosity)과 디버깅

Kubectl 로그 상세 레벨(verbosity)은 `-v` 또는`--v` 플래그와 로그 레벨을 나타내는 정수로 제어된다. 일반적인 쿠버네티스 로깅 규칙과 관련 로그 레벨이 [여기](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md)에 설명되어 있다.

로그 레벨 | 세부 사항
--------------| -----------
`--v=0` | 일반적으로 클러스터 운영자(operator)에게 *항상* 보여지게 하기에는 유용함.
`--v=1` | 자세한 정보를 원하지 않는 경우, 적절한 기본 로그 수준.
`--v=2` | 서비스와 시스템의 중요한 변화와 관련이있는 중요한 로그 메시지에 대한 유용한 정상 상태 정보. 이는 대부분의 시스템에서 권장되는 기본 로그 수준이다.
`--v=3` | 변경 사항에 대한 확장 정보.
`--v=4` | 디버그 수준 상세화.
`--v=5` | 트레이스 수준 상세화.
`--v=6` | 요청한 리소스를 표시.
`--v=7` | HTTP 요청 헤더를 표시.
`--v=8` | HTTP 요청 내용을 표시.
`--v=9` | 내용을 잘라 내지 않고 HTTP 요청 내용을 표시.

## {{% heading "whatsnext" %}}

* [kubectl 개요](/ko/docs/reference/kubectl/overview/)를 읽고 [JsonPath](/ko/docs/reference/kubectl/jsonpath)에 대해 배워보자.

* [kubectl](/ko/docs/reference/kubectl/kubectl/) 옵션을 참고한다.

* 재사용 스크립트에서 kubectl 사용 방법을 이해하기 위해 [kubectl 사용법](/ko/docs/reference/kubectl/conventions/)을 참고한다.

* 더 많은 커뮤니티 [kubectl 치트시트](https://github.com/dennyzhang/cheatsheet-kubernetes-A4)를 확인한다.
