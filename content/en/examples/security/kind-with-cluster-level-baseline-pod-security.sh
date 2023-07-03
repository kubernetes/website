#!/bin/sh
mkdir -p /tmp/pss
cat <<EOF > /tmp/pss/cluster-level-pss.yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: PodSecurity
  configuration:
    apiVersion: pod-security.admission.config.k8s.io/v1
    kind: PodSecurityConfiguration
    defaults:
      enforce: "baseline"
      enforce-version: "latest"
      audit: "restricted"
      audit-version: "latest"
      warn: "restricted"
      warn-version: "latest"
    exemptions:
      usernames: []
      runtimeClasses: []
      namespaces: [kube-system]
EOF
cat <<EOF > /tmp/pss/cluster-config.yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
  kubeadmConfigPatches:
  - |
    kind: ClusterConfiguration
    apiServer:
        extraArgs:
          admission-control-config-file: /etc/config/cluster-level-pss.yaml
        extraVolumes:
          - name: accf
            hostPath: /etc/config
            mountPath: /etc/config
            readOnly: false
            pathType: "DirectoryOrCreate"
  extraMounts:
  - hostPath: /tmp/pss
    containerPath: /etc/config
    # optional: if set, the mount is read-only.
    # default false
    readOnly: false
    # optional: if set, the mount needs SELinux relabeling.
    # default false
    selinuxRelabel: false
    # optional: set propagation mode (None, HostToContainer or Bidirectional)
    # see https://kubernetes.io/docs/concepts/storage/volumes/#mount-propagation
    # default None
    propagation: None
EOF
kind create cluster --name psa-with-cluster-pss --config /tmp/pss/cluster-config.yaml
kubectl cluster-info --context kind-psa-with-cluster-pss

# Wait for 15 seconds (arbitrary) ServiceAccount Admission Controller to be available
sleep 15
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
kubectl apply -f -

# Await input
sleep 1
( bash -c 'true' 2>/dev/null && bash -c 'read -p "Press any key to continue... " -n1 -s' ) || \
    ( printf "Press Enter to continue... " && read ) 1>&2

# Clean up
printf "\n\nCleaning up:\n" 1>&2
set -e
kubectl delete pod --all -n example --now
kubectl delete ns example
kind delete cluster --name psa-with-cluster-pss
rm -f /tmp/pss/cluster-config.yaml
