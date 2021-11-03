kubectl get po -o wide -n <namspace1> -n <namespace2> -n <namespace3>
kubectl get all --show-labels

# untaint node:
kubectl taint nodes controlplane node-role.kubernetes.io/master:NoSchedule-

# Create ds:
kubectl create deployment elasticsearch --image=k8s.gcr.io/fluentd-elasticsearch:1.20 -n kube-system --dry-run=client -o yaml > fluentd.yaml
Next, remove the replicas, strategy, resources and status fields

# Static pods. 
Kubelet checking below folder periodically
/etc/kubernetes/manifest
kubelet.service --pod-manifest-path=
The one way to see pods: docker ps

kubectl run --restart=Never --image=busybox static-busybox --dry-run=client -o yaml --command -- sleep 1000 > /etc/kubernetes/manifests/static-busybox.yaml
k get events
kubectl run --restart=Never --image=ubuntu ubuntu-sleeper --dry-run=client -o yaml --command -- sleep 4800 > n.yaml

kubectl create secret generic db-secret  --from-literal=DB_Host=sql01  --from-literal=DB_User=root  --from-literal=DB_Password=password123

aws eks --region eu-west-2 update-kubeconfig --name uat-exchange 

k rollout status deploy <name>
k rollout history deploy <name>
k rollout undo deploy <name>

k set image deploy frontend simple-webapp=kodekloud/webapp-color:v2

kubectl create configmap webapp-config-map --from-literal=APP_COLOR=darkblue

k get all -A -o yaml > all_deployments.yaml
etcd bin data-dir

k config view --minify
k config use-context <ctx name>
kubectl config use-context research --kubeconfig
kubectl config use-context prod-user@production

kubectl proxy

k describe role
k describe rolebinding
k auth can-i create po
(cluster admin)k auth can-i create po --as dev-user
(cluster admin)k auth can-i create po --as dev-user --namespace test

kubectl create role developer --namespace=default --verb=list,create --resource=pods
kubectl create rolebinding dev-user-binding --namespace=default --role=developer --user=dev-user

kubectl api-resources --namespaced=true
kubectl api-resources --namespaced=false

kubectl create ClusterRoles michelle --verb=* --resource=nodes

kubectl exec webapp -- cat /log/app.log

k create secret docker-registry regcred --docker-server=<your-registry-server> --docker-username=<your-name> --docker-password=<your-pword> --docker-email=<your-email>

spec:
  containers:
  - name: private-reg-container
    image: <your-private-image>
  imagePullSecrets:
  - name: regcred

openssl x509 -in /etc/kubernetes/pki/etcd/server.crt -text -noout
docker ps
docker logs <container id>

k get csr
k certificate approve <csr name>

cat akshay.csr | base64 | tr -d "\n"

pod 
- containerPort: 8003
  name: tcpext
  protocol: TCP

  spec:
    containers:
    - args:
      - --global.checknewversion
      - --global.sendanonymoususage
      - --entryPoints.discovery.address=:8001/tcp
      - --entryPoints.external.address=:8002/tcp
      - --entryPoints.traefik.address=:9000/tcp
      - --entryPoints.web.address=:8000/tcp
      - --entryPoints.tcpext.address=:8003/tcp

Local node volume
      spec:
        containers:
        - image: kodekloud/event-simulator
          name: webapp
          resources: {}
          volumeMounts:
          - mountPath: /log
            name: log-volume
        dnsPolicy: ClusterFirst
        restartPolicy: Always
        volumes:
        - name: log-volume
          hostPath:
            # directory location on host
            path: /var/log/webapp
            # this field is optional
            type: Directory

HostPath PV:
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-log
spec:
  capacity:
    storage: 100Mi
  accessModes:
  - ReadWriteMany
  persistentVolumeReclaimPolicy: Retain
  hostPath:
    path: /pv/log

PVC:
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: claim-log-1
spec:
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 50Mi

Every pod should to have uniq ip
Every pod should communicate to other pods within node
Every pod should communicate to other pods on other nodes without NAT

/opt/cni/bin
ls /etc/cni/net.d/

kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')&env.IPALLOC_RANGE=10.50.0.0/16"
apt install -y iproute2

# Service:
kube-proxy create network rule on each node of the cluster svcIp(kube-api-server contain the range) forward to Ip of pod
10.96.0.0 - 10.111.255.255
iptables -L -t nat | grep <svc-name>
cat /var/log/kube-proxy.log

kubectl logs <weave-pod-name> weave -n kube-system

curl http://web-service.apps.svc.cluster.local
svc-name: web-service
ns: apps
root-domain: cluster.local

curl http://10-46-2-5.apps.pod.cluster.local
pod-ip: 10-46-2-5

kubectl expose deployment hello-world --type=NodePort --name=example-service

k get logs <pod> --previous

service kubelet status
service kube-proxy status
sudo journalctl -u kube-apiserver
sudo journalctl -u kubelet
journalctl -u etcd.service -l

/var/lib/kubelet/config.yaml
/etc/kubernetes

openssl x509 -in /var/lib/kubelet/worker-1.crt -text

kubectl -n kube-system get deployment coredns -o yaml | \
  sed 's/allowPrivilegeEscalation: false/allowPrivilegeEscalation: true/g' | \
  kubectl apply -f -

/run/systemd/resolve/resolv.conf

kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"

# Json:
$.status.containerStatuses[?(@.name == 'redis-container')].restartCount
$[*].metadata.name

k get po -o='{ jsonpath=.items[0].spec.containers[0].image }'
k get no -o=jsonpath='{range.items[*]}{.metadata.name}{"\t"}{.status.capacity.cpu}{"\n"}{end}'
k get no -o=custom-columns=NODE:.metadata.name ,CPU:.status.capacity.cpu
k get no --sort-by= .status.capacity.cpu
kubectl config view --kubeconfig=/root/my-kube-config -o json
kubectl config view --kubeconfig=/root/my-kube-config -o=jsonpath='{.users[*].name}'
k get pv --sort-by='.spec.capacity.storage'
k get pv --sort-by='.spec.capacity.storage' -o=custom-columns=NAME:.metadata.name,CAPACITY:.spec.capacity.storage
k config view --kubeconfig=my-kube-config -o=jsonpath="{.contexts[?(@.context.user=='aws-user')].name}"

# get all from ns
kubectl api-resources --verbs=list --namespaced -o name | xargs -n 1 kubectl get --show-kind --ignore-not-found -n default


# Main commands:
k run -h | grep '# ' -A2
k describe pod <pod-name> | grep -i events -A 10
Command1: k api-resources | grep -i "resource name"
Command2: k api-versions | grep -i "api_group name"
ps -ef --forest | grep kube-apiserver | grep "search string"
kubectl config set-context --current --namespace=new namespace
kubectl explain pods.spec.containers | less
kubectl explain pods.spec.containers --recursive | less
kubectl api-resources -owide

# use busybox for troubleshooting
kubectl run -it --rm debug --image=busybox --restart=Never -- sh

# check connectivity
kubectl run -it --rm debug --image=radial/busyboxplus:curl --restart=Never -- curl http://servicename

# encode csr
cat myuser.csr | base64 | tr -d "\n"

# get token for dashboard
kubectl -n kubernetes-dashboard get secret \
$(kubectl -n kubernetes-dashboard get sa/admin-user -o jsonpath="{.secrets[0].name}") \
-o go-template="{{.data.token | base64decode}}"

# resolve service
nslookup [SERVICE_NAME].[NAMESPACE].SVC

# get cert info
openssl x509 -noout -subject -in /path/cert.crt
openssl x509 -in /path/cert.file -text

# create resources on the fly
cat <<EOF | kubectl create -f -
<YAML content goes here>
EOF

# recreate resource
kubectl replace -f file.yaml --force

# deleting pod in background
kubectl delete po <pod name> <optional -n namespace> --wait=false

# network comands
ip link
ip route
ip addr
arp
nslookup
dig
netstat -plnt
ss -lp
cat /etc/cni/net.d/10-weave.conf

# useful aliases
alias k=kubectl
alias ks='k -n kube-system'
alias krun="k run -h | grep '# ' -A2"
alias kc='k config view --minify | grep name'
alias kdp='kubectl describe pod'
alias krh='kubectl run --help | more'
alias kgh='kubectl get --help | more'
alias kd='kubectl describe'
alias ke='kubectl explain'
alias kf='kubectl create -f'
alias kg='kubectl get pods --show-labels'
alias kr='kubectl replace -f'
alias kh='kubectl --help | more'
alias krh='kubectl run --help | more'
alias kl='kubectl logs'
alias kt='kubectl top'
alias kx='kubectl exec -it'
alias kn='kubectl get all -n '
alias getcert='openssl x509 -text -in '
alias l='ls -lrt'
alias ll='vi ls -rt | tail -1'
export do="--dry-run=client -o yaml"

# Set in .vimrc or on the file level
:set smarttab
:set expandtab
:set shiftwidth=2
:set tabstop=2
:set number

# In the file insert new Line and position cursor at the start of the new line
o + Ecs
V - Visual editor
yy - copy
p - paste
u -undo
