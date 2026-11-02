#!/bin/sh
kind create cluster --name psa-ns-level
kubectl cluster-info --context kind-psa-ns-level
# Wait for 15 seconds (arbitrary) for ServiceAccount Admission Controller to be available
sleep 15

# Create and label the namespace
kubectl create ns example || exit 1 # if namespace exists, don't do the next steps
kubectl label --overwrite ns example \
  pod-security.kubernetes.io/enforce=baseline \
  pod-security.kubernetes.io/enforce-version=latest \
  pod-security.kubernetes.io/warn=restricted \
  pod-security.kubernetes.io/warn-version=latest \
  pod-security.kubernetes.io/audit=restricted \
  pod-security.kubernetes.io/audit-version=latest

# Try running a Pod
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

# Await input
sleep 1
( bash -c 'true' 2>/dev/null && bash -c 'read -p "Press any key to continue... " -n1 -s' ) || \
    ( printf "Press Enter to continue... " && read ) 1>&2

# Clean up
printf "\n\nCleaning up:\n" 1>&2
set -e
kubectl delete pod --all -n example --now
kubectl delete ns example
kind delete cluster --name psa-ns-level
