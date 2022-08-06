#!/bin/sh
# 直到 v1.23 发布，kind 节点镜像需要从 k/k master 分支构建
# 参考：https://kind.sigs.k8s.io/docs/user/quick-start/#building-images
kind create cluster --name psa-ns-level --image kindest/node:v1.23.0
kubectl cluster-info --context kind-psa-ns-level
# 等待 15 秒（任意）ServiceAccount 准入控制器可用
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
