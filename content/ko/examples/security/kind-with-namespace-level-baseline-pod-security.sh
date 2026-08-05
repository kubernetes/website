#!/bin/sh
# v1.23 출시 전까지, 노드 이미지 종류는 k/k 마스터 브랜치로부터 빌드 되어야 한다
# Ref: https://kind.sigs.k8s.io/docs/user/quick-start/#building-images
kind create cluster --name psa-ns-level --image kindest/node:v1.23.0
kubectl cluster-info --context kind-psa-ns-level
# (임의의) 서비스 어카운트 어드미션 컨트롤러가 사용 가능할 때까지 15초 간 대기
sleep 15
kubectl create ns example
kubectl label --overwrite ns example \
  pod-security.kubernetes.io/enforce=baseline \
  pod-security.kubernetes.io/enforce-version=latest \
  pod-security.kubernetes.io/warn=restricted \
  pod-security.kubernetes.io/warn-version=latest \
  pod-security.kubernetes.io/audit=restricted \
  pod-security.kubernetes.io/audit-version=latest
cat <<EOF > /tmp/pss/nginx-pod.yaml
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
kubectl apply -n example -f /tmp/pss/nginx-pod.yaml
