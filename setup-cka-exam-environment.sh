#!/bin/bash

# CKA Exam Environment Setup Script
# Based on: https://kubernetes.io/docs/reference/kubectl/quick-reference/

echo "🚀 Setting up CKA Exam Environment..."
echo "====================================="

# Set kubeconfig for this session
export KUBECONFIG=./kubeconfig-direct
echo "✅ KUBECONFIG set to ./kubeconfig-direct"

# Load kubectl aliases
echo "📝 Loading kubectl aliases..."

# Basic kubectl aliases for speed
alias k='kubectl'
alias kg='kubectl get'
alias kd='kubectl describe'
alias kl='kubectl logs'
alias ke='kubectl exec -it'
alias ka='kubectl apply -f'
alias kdel='kubectl delete'
alias kc='kubectl create'
alias kex='kubectl expose'
alias ksc='kubectl scale'
alias kset='kubectl set'
alias kroll='kubectl rollout'
alias kcp='kubectl cp'
alias kpf='kubectl port-forward'
alias ktop='kubectl top'
alias kdebug='kubectl debug'

# Namespace shortcuts
alias kgp='kubectl get pods'
alias kgs='kubectl get services'
alias kgn='kubectl get nodes'
alias kgd='kubectl get deployments'
alias kgrs='kubectl get replicasets'
alias kgds='kubectl get daemonsets'
alias kgj='kubectl get jobs'
alias kgcj='kubectl get cronjobs'
alias kgpvc='kubectl get pvc'
alias kgpv='kubectl get pv'
alias kgcm='kubectl get configmaps'
alias kgsec='kubectl get secrets'
alias kgsa='kubectl get serviceaccounts'
alias kgr='kubectl get roles'
alias kgrb='kubectl get rolebindings'
alias kgcr='kubectl get clusterroles'
alias kgcrb='kubectl get clusterrolebindings'
alias kgnp='kubectl get networkpolicies'
alias kging='kubectl get ingress'
alias kge='kubectl get events'

# Describe shortcuts
alias kdp='kubectl describe pod'
alias kds='kubectl describe service'
alias kdn='kubectl describe node'
alias kdd='kubectl describe deployment'
alias kdrs='kubectl describe replicaset'
alias kdds='kubectl describe daemonset'
alias kdj='kubectl describe job'
alias kdcj='kubectl describe cronjob'
alias kdpvc='kubectl describe pvc'
alias kdpv='kubectl describe pv'
alias kdcm='kubectl describe configmap'
alias kdsec='kubectl describe secret'
alias kdsa='kubectl describe serviceaccount'
alias kdr='kubectl describe role'
alias kdrb='kubectl describe rolebinding'
alias kdcr='kubectl describe clusterrole'
alias kdcrb='kubectl describe clusterrolebinding'
alias kdnp='kubectl describe networkpolicy'
alias kding='kubectl describe ingress'

# Logs shortcuts
alias klp='kubectl logs -f'
alias klp='kubectl logs --previous'

# Exec shortcuts
alias kep='kubectl exec -it'

# Apply shortcuts
alias kap='kubectl apply -f'
alias kaf='kubectl apply -f'

# Delete shortcuts
alias kdelp='kubectl delete pod'
alias kdels='kubectl delete service'
alias kdeld='kubectl delete deployment'
alias kdelrs='kubectl delete replicaset'
alias kdelds='kubectl delete daemonset'
alias kdelj='kubectl delete job'
alias kdelcj='kubectl delete cronjob'
alias kdelpvc='kubectl delete pvc'
alias kdelpv='kubectl delete pv'
alias kdelcm='kubectl delete configmap'
alias kdelsec='kubectl delete secret'
alias kdelsa='kubectl delete serviceaccount'
alias kdelr='kubectl delete role'
alias kdelrb='kubectl delete rolebinding'
alias kdelcr='kubectl delete clusterrole'
alias kdelcrb='kubectl delete clusterrolebinding'
alias kdelnp='kubectl delete networkpolicy'
alias kdeling='kubectl delete ingress'

# Create shortcuts
alias kcp='kubectl create pod'
alias kcs='kubectl create service'
alias kcd='kubectl create deployment'
alias kcrs='kubectl create replicaset'
alias kcds='kubectl create daemonset'
alias kcj='kubectl create job'
alias kccj='kubectl create cronjob'
alias kcpvc='kubectl create pvc'
alias kcpv='kubectl create pv'
alias kccm='kubectl create configmap'
alias kcsec='kubectl create secret'
alias kcsa='kubectl create serviceaccount'
alias kcr='kubectl create role'
alias kcrb='kubectl create rolebinding'
alias kccr='kubectl create clusterrole'
alias kccrb='kubectl create clusterrolebinding'
alias kcnp='kubectl create networkpolicy'
alias kcing='kubectl create ingress'

# Expose shortcuts
alias kexd='kubectl expose deployment'
alias kexp='kubectl expose pod'

# Scale shortcuts
alias kscd='kubectl scale deployment'
alias kscrs='kubectl scale replicaset'

# Set shortcuts
alias kseti='kubectl set image'
alias ksetr='kubectl set resources'
alias ksete='kubectl set env'

# Rollout shortcuts
alias krolls='kubectl rollout status'
alias krollh='kubectl rollout history'
alias krollu='kubectl rollout undo'
alias krollp='kubectl rollout pause'
alias krollr='kubectl rollout resume'

# Copy shortcuts
alias kcpf='kubectl cp'

# Port-forward shortcuts
alias kpfs='kubectl port-forward service'
alias kpfp='kubectl port-forward pod'
alias kpfd='kubectl port-forward deployment'

# Top shortcuts
alias ktopn='kubectl top nodes'
alias ktopp='kubectl top pods'

# Debug shortcuts
alias kdebugp='kubectl debug pod'
alias kdebugn='kubectl debug node'

# Output format shortcuts
alias kgpy='kubectl get pods -o yaml'
alias kgpj='kubectl get pods -o json'
alias kgpw='kubectl get pods -o wide'
alias kgpn='kubectl get pods -o name'
alias kgpc='kubectl get pods -o custom-columns'

# Namespace shortcuts
alias kgpa='kubectl get pods --all-namespaces'
alias kgsa='kubectl get services --all-namespaces'
alias kgna='kubectl get nodes --all-namespaces'
alias kgda='kubectl get deployments --all-namespaces'
alias kgrsa='kubectl get replicasets --all-namespaces'
alias kgdsa='kubectl get daemonsets --all-namespaces'
alias kgja='kubectl get jobs --all-namespaces'
alias kgcja='kubectl get cronjobs --all-namespaces'
alias kgpvca='kubectl get pvc --all-namespaces'
alias kgpva='kubectl get pv --all-namespaces'
alias kgcma='kubectl get configmaps --all-namespaces'
alias kgseca='kubectl get secrets --all-namespaces'
alias kgsaa='kubectl get serviceaccounts --all-namespaces'
alias kgra='kubectl get roles --all-namespaces'
alias kgrba='kubectl get rolebindings --all-namespaces'
alias kgcra='kubectl get clusterroles'
alias kgcrba='kubectl get clusterrolebindings'
alias kgnpa='kubectl get networkpolicies --all-namespaces'
alias kginga='kubectl get ingress --all-namespaces'
alias kgea='kubectl get events --all-namespaces'

# Context and config shortcuts
alias kcc='kubectl config current-context'
alias kcgc='kubectl config get-contexts'
alias kcsc='kubectl config set-context'
alias kcuc='kubectl config use-context'
alias kcv='kubectl config view'

# API shortcuts
alias kar='kubectl api-resources'
alias kav='kubectl api-versions'

# Cluster shortcuts
alias kci='kubectl cluster-info'

echo "✅ All kubectl aliases loaded"

# Enable kubectl autocomplete
echo "🔄 Enabling kubectl autocomplete..."
source <(kubectl completion bash)

# Set up useful environment variables
export EDITOR=nano
export KUBE_EDITOR=nano

# Create useful functions for exam
echo "📚 Setting up exam helper functions..."

# Function to quickly check cluster status
cluster_status() {
    echo "=== Cluster Status ==="
    kubectl get nodes
    echo "=== Pods ==="
    kubectl get pods --all-namespaces
    echo "=== Services ==="
    kubectl get services --all-namespaces
}

# Function to check pod logs with follow
pod_logs() {
    if [ -z "$1" ]; then
        echo "Usage: pod_logs <pod-name> [namespace]"
        return 1
    fi
    if [ -z "$2" ]; then
        kubectl logs -f $1
    else
        kubectl logs -f $1 -n $2
    fi
}

# Function to exec into pod
pod_exec() {
    if [ -z "$1" ]; then
        echo "Usage: pod_exec <pod-name> [namespace]"
        return 1
    fi
    if [ -z "$2" ]; then
        kubectl exec -it $1 -- /bin/sh
    else
        kubectl exec -it $1 -n $2 -- /bin/sh
    fi
}

# Function to get YAML of resource
get_yaml() {
    if [ -z "$1" ] || [ -z "$2" ]; then
        echo "Usage: get_yaml <resource-type> <resource-name> [namespace]"
        return 1
    fi
    if [ -z "$3" ]; then
        kubectl get $1 $2 -o yaml
    else
        kubectl get $1 $2 -n $3 -o yaml
    fi
}

# Function to describe resource
describe_resource() {
    if [ -z "$1" ] || [ -z "$2" ]; then
        echo "Usage: describe_resource <resource-type> <resource-name> [namespace]"
        return 1
    fi
    if [ -z "$3" ]; then
        kubectl describe $1 $2
    else
        kubectl describe $1 $2 -n $3
    fi
}

# Function to check events
check_events() {
    if [ -z "$1" ]; then
        kubectl get events --all-namespaces --sort-by='.lastTimestamp'
    else
        kubectl get events -n $1 --sort-by='.lastTimestamp'
    fi
}

# Function to check resource usage
resource_usage() {
    echo "=== Node Resource Usage ==="
    kubectl top nodes
    echo "=== Pod Resource Usage ==="
    kubectl top pods --all-namespaces
}

# Function to check API resources
api_help() {
    kubectl api-resources | grep -i $1
}

# Function to get help for resource
resource_help() {
    kubectl explain $1
}

echo "✅ Helper functions created"

# Test the setup
echo "🧪 Testing environment setup..."
echo "Current context:"
kubectl config current-context
echo "Cluster info:"
kubectl cluster-info
echo "Nodes:"
kubectl get nodes

echo ""
echo "🎯 CKA Exam Environment Setup Complete!"
echo "====================================="
echo ""
echo "📋 Available shortcuts:"
echo "  kdp <pod> - describe pod"
echo "  kgp - get pods"
echo "  kdp <pod> -n <namespace> - describe pod in namespace"
echo "  cluster_status - check cluster status"
echo "  pod_logs <pod> [namespace] - follow pod logs"
echo "  pod_exec <pod> [namespace] - exec into pod"
echo "  get_yaml <resource> <name> [namespace] - get YAML"
echo "  describe_resource <resource> <name> [namespace] - describe resource"
echo "  check_events [namespace] - check events"
echo "  resource_usage - check resource usage"
echo "  api_help <pattern> - search API resources"
echo "  resource_help <resource> - get help for resource"
echo ""
echo "📖 For more commands, see: https://kubernetes.io/docs/reference/kubectl/quick-reference/"
echo ""
echo "🚀 You're ready for the CKA exam!"
