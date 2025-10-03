#!/bin/sh
kind create cluster --name psa-ns-level
kubectl cluster-info --context kind-psa-ns-level
# (임의의) 서비스 어카운트 어드미션 컨트롤러가 사용 가능할 때까지 15초 간 대기
sleep 15

# 네임스페이스를 만들고 레이블을 지정
kubectl create ns example || exit 1 # 네임스페이스가 존재하는 경우 다음 단계를 수행하지 않음
kubectl label --overwrite ns example \
  pod-security.kubernetes.io/enforce=baseline \
  pod-security.kubernetes.io/enforce-version=latest \
  pod-security.kubernetes.io/warn=restricted \
  pod-security.kubernetes.io/warn-version=latest \
  pod-security.kubernetes.io/audit=restricted \
  pod-security.kubernetes.io/audit-version=latest

# 파드 실행
cat <<EOF |
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
    - image: nginx
      name: nginx
      ports:
        - containerPort: 80
EOF
kubectl apply -n example -f -

# 입력 대기
sleep 1
( bash -c 'true' 2>/dev/null && bash -c 'read -p "Press any key to continue... " -n1 -s' ) || \
    ( printf "Press Enter to continue... " && read ) 1>&2

# 정리
printf "\n\nCleaning up:\n" 1>&2
set -e
kubectl delete pod --all -n example --now
kubectl delete ns example
kind delete cluster --name psa-ns-level
