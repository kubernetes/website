---
# reviewers:
# - caesarxuchao
# - mikedanese
title: 동작중인 컨테이너의 셸에 접근하기
content_type: task
---

<!-- overview -->

이 페이지는 동작중인 컨테이너에 접근하기 위해 `kubectl exec`을 사용하는
방법에 대해 설명한다.




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}}




<!-- steps -->

## 컨테이너의 셸에 접근하기

이 예시에서는 하나의 컨테이너를 가진 파드를 생성할 것이다. 이 컨테이너는
nginx 이미지를 실행한다. 해당 파드에 대한 설정 파일은 다음과 같다.

{{< codenew file="application/shell-demo.yaml" >}}

파드를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/application/shell-demo.yaml
```

다음을 통해 컨테이너가 동작하고 있는지 확인할 수 있다.

```shell
kubectl get pod shell-demo
```

동작중인 컨테이너의 셸에 접근한다.

```shell
kubectl exec --stdin --tty shell-demo -- /bin/bash
```

{{< note >}}
kubectl 명령어 인자와 사용하고자 하는 명령어의 인자를 구분하기 위해서는 이중 대시(`--`)를 사용할 수 있다.
{{< /note >}}

셸에 접근해서 다음처럼 루트 디렉토리를 확인해 볼 수 있다.

```shell
# Run this inside the container
ls /
```

접근한 셸에서 다른 명령어도 한번 실행해 보아라. 다음은 실행해 볼
명령의 예시이다.

```shell
# You can run these example commands inside the container
ls /
cat /proc/mounts
cat /proc/1/maps
apt-get update
apt-get install -y tcpdump
tcpdump
apt-get install -y lsof
lsof
apt-get install -y procps
ps aux
ps aux | grep nginx
```

## nginx의 최상단 페이지 작성하기

앞에서 생성한 파드에 대한 설정을 살펴보아라. 파드에는
`emptyDir` 볼륨이 사용되었고, 이 컨테이너는 해당 볼륨을
`/usr/share/nginx/html` 경로에 마운트하였다.

접근한 셸 환경에서 `/usr/share/nginx/html` 디렉터리에 `index.html` 파일을
생성해 보아라.

```shell
# Run this inside the container
echo 'Hello shell demo' > /usr/share/nginx/html/index.html
```

셸 환경에서 nginx 서버에 GET 요청을 시도해보면 다음과 같다.

```shell
# Run this in the shell inside your container
apt-get update
apt-get install curl
curl http://localhost/
```

출력 결과는 여러분이 `index.html` 파일에 작성한 텍스트를 출력할 것이다.

```
Hello shell demo
```

셸 사용이 모두 끝났다면 `exit`을 입력해 종료하라.

```shell
exit # To quit the shell in the container
```

## 컨테이너에서 개별 명령어 실행하기

셸이 아닌 일반적인 커맨드 환경에서 다음처럼 동작중인 컨테이너의
환경 변수를 출력할 수 있다.

```shell
kubectl exec shell-demo env
```

다른 명령어도 한번 실행해 보아라. 다음은 실행해 볼 명령의 예시이다.

```shell
kubectl exec shell-demo -- ps aux
kubectl exec shell-demo -- ls /
kubectl exec shell-demo -- cat /proc/1/mounts
```



<!-- discussion -->

## 파드에 한 개 이상의 컨테이너가 있을 경우 셸에 접근하기

만일 파드에 한 개 이상의 컨테이너가 있을 경우, `kubectl exec` 명령어에
`--container` 혹은 `-c` 옵션을 사용해서 컨테이너를 지정하라. 예를 들어,
여러분이 my-pod라는 이름의 파드가 있다고 가정해 보자. 이 파드에는 _main-app_ 과 
_helper-app_ 이라는 이름의 두 컨테이너가 있다. 다음 명령어는 _main-app_ 
컨테이너에 대한 셸에 접근할 것이다.

```shell
kubectl exec -i -t my-pod --container main-app -- /bin/bash
```

{{< note >}}
축약형 옵션인 `-i` 와 `-t` 는 각각 `--stdin` 와 `--tty` 옵션에 대응된다.
{{< /note >}}


## {{% heading "whatsnext" %}}


* [kubectl exec](/docs/reference/generated/kubectl/kubectl-commands/#exec)를 참고한다.
