---
title: kubectl त्वरित संदर्भ
translationKey: kubectl-quick-reference
content_type: concept
weight: 10
card:
  name: tasks
  weight: 10
---
<!-- overview -->

इस पेज पर आम तौर पर इस्तेमाल होने वाले `kubectl` कमांड और फ़्लैग की सूची दी गई है।

{{< note >}}
ये निर्देश Kubernetes v{{< skew currentVersion >}} के लिए हैं। वर्शन चेक करने के लिए, `kubectl version` कमांड का इस्तेमाल करें।
{{< /note >}}
<!-- body -->

## Kubectl ऑटो-कम्प्लीट

### BASH

```bash
source <(kubectl completion bash) # मौजूदा शेल में bash के लिए ऑटो-कम्प्लीट सेट अप करें; इसके लिए पहले bash-completion पैकेज इंस्टॉल होना चाहिए।
echo "source <(kubectl completion bash)" >> ~/.bashrc # अपने bash शेल में ऑटो-कम्प्लीट को हमेशा के लिए जोड़ें।
```

आप `kubectl` के लिए एक शॉर्टहैंड एलियास (alias) का भी इस्तेमाल कर सकते हैं जो 'कंप्लीशन' (completion) के साथ भी काम करता है:

```bash
alias k=kubectl
complete -o default -F __start_kubectl k
```

### ZSH

```bash
source <(kubectl completion zsh)  # मौजूदा शेल में zsh के लिए ऑटो-कम्प्लीट सेट अप करें
echo '[[ $commands[kubectl] ]] && source <(kubectl completion zsh)' >> ~/.zshrc # अपने zsh शेल में ऑटो-कम्प्लीट को हमेशा के लिए जोड़ें
```

### FISH

{{< note >}}
इसके लिए kubectl वर्शन 1.23 या उससे नया वर्शन चाहिए।
{{< /note >}}

```bash
echo 'kubectl completion fish | source' > ~/.config/fish/completions/kubectl.fish && source ~/.config/fish/completions/kubectl.fish
```

### `--all-namespaces` के बारे में एक नोट

`--all-namespaces` को अक्सर इस्तेमाल किया जाता है, इसलिए आपको `--all-namespaces` के शॉर्टहैंड के बारे में पता होना चाहिए:

```kubectl -A```

## Kubectl context and configuration (## Kubectl कॉन्टेक्स्ट और कॉन्फ़िगरेशन)

यह तय करें कि `kubectl` किस Kubernetes क्लस्टर के साथ कम्युनिकेट करता है और कॉन्फ़िगरेशन में बदलाव करता है।
जानकारी। इसके लिए [kubeconfig के साथ क्लस्टर्स के बीच ऑथेंटिकेट करना](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/) डॉक्यूमेंटेशन देखें।
विस्तृत कॉन्फ़िगरेशन फ़ाइल जानकारी।

```bash
kubectl config view # मर्ज की गई kubeconfig सेटिंग्स दिखाएं।

# use multiple kubeconfig files at the same time and view merged config(# एक ही समय में कई kubeconfig फ़ाइलों का इस्तेमाल करें और मर्ज की गई कॉन्फ़िग देखें)
KUBECONFIG=~/.kube/config:~/.kube/kubconfig2

kubectl config view

# Show merged kubeconfig settings and raw certificate data and exposed secrets(# मर्ज की गई kubeconfig सेटिंग्स, रॉ सर्टिफ़िकेट डेटा और एक्सपोज़्ड सीक्रेट्स दिखाएं)
kubectl config view --raw

# get the password for the e2e user (# e2e यूज़र के लिए पासवर्ड प्राप्त करें)
kubectl config view -o jsonpath='{.users[?(@.name == "e2e")].user.password}'

# get the certificate for the e2e user(# e2e यूज़र के लिए सर्टिफ़िकेट प्राप्त करें)
kubectl config view --raw -o jsonpath='{.users[?(.name == "e2e")].user.client-certificate-data}' | base64 -d

kubectl config view -o jsonpath='{.users[].name}'    # पहला यूज़र दिखाएं
kubectl config view -o jsonpath='{.users[*].name}'   # यूज़र्स की लिस्ट पाएं
kubectl config get-contexts                          # कॉन्टेक्स्ट की लिस्ट दिखाएं
kubectl config get-contexts -o name                  # सभी कॉन्टेक्स्ट के नाम पाएं
kubectl config current-context                       # मौजूदा कॉन्टेक्स्ट दिखाएं
kubectl config use-context my-cluster-name           # डिफ़ॉल्ट कॉन्टेक्स्ट को my-cluster-name पर सेट करें

kubectl config set-cluster my-cluster-name           # kubeconfig में क्लस्टर एंट्री सेट करें

# configure the URL to a proxy server to use for requests made by this client in the kubeconfig(# kubeconfig में इस क्लाइंट की रिक्वेस्ट के लिए इस्तेमाल होने वाले प्रॉक्सी सर्वर का URL कॉन्फ़िगर करें)
kubectl config set-cluster my-cluster-name --proxy-url=my-proxy-url

# add a new user to your kubeconf that supports basic auth (# अपने kubeconf में एक नया यूज़र जोड़ें जो बेसिक ऑथ (basic auth) को सपोर्ट करता हो)
kubectl config set-credentials kubeuser/foo.kubernetes.com --username=kubeuser --password=kubepassword

# permanently save the namespace for all subsequent kubectl commands in that context. (# उस कॉन्टेक्स्ट में बाद के सभी kubectl कमांड्स के लिए नेमस्पेस को स्थायी रूप से सेव करें।)
kubectl config set-context --current --namespace=ggckad-s2

# set a context utilizing a specific username and namespace.(# एक खास यूज़रनेम और नेमस्पेस का इस्तेमाल करके कॉन्टेक्स्ट सेट करें।)
kubectl config set-context gce --user=cluster-admin --namespace=foo \
&& kubectl config use-context gce

kubectl config unset users.foo                       # यूज़र foo को हटाएं

# कॉन्टेक्स्ट/नेमस्पेस सेट/दिखाने के लिए छोटा एलियास (सिर्फ़ bash और bash-कम्पैटिबल शेल के लिए काम करता है; नेमस्पेस सेट करने के लिए kn का इस्तेमाल करने से पहले मौजूदा कॉन्टेक्स्ट सेट करना होगा)
alias kx='f() { [ "$1" ] && kubectl config use-context $1 || kubectl config current-context ; } ; f'
alias kn='f() { [ "$1" ] && kubectl config set-context --current --namespace $1 || kubectl config view --minify | grep namespace | cut -d" " -f6 ; } ; f'
```

## Kubectl apply

`apply` उन फ़ाइलों के ज़रिए ऐप्लिकेशन को मैनेज करता है जो Kubernetes रिसोर्स को परिभाषित करती हैं। यह `kubectl apply` चलाकर क्लस्टर में रिसोर्स बनाता और अपडेट करता है। प्रोडक्शन पर Kubernetes ऐप्लिकेशन को मैनेज करने का यह सुझाया गया तरीका है। [Kubectl Book](https://kubectl.docs.kubernetes.io) देखें।

## Creating objects (## ऑब्जेक्ट बनाना)

Kubernetes मैनिफ़ेस्ट को YAML या JSON में डिफाइन किया जा सकता है। फ़ाइल एक्सटेंशन `.yaml`,
`.yml`, and `.json` can be used.

```bash
kubectl apply -f ./my-manifest.yaml                 # रिसोर्स बनाएँ
kubectl apply -f ./my1.yaml -f ./my2.yaml           # कई फ़ाइलों से बनाएँ
kubectl apply -f ./dir                              # डायरेक्टरी की सभी मैनिफ़ेस्ट फ़ाइलों में रिसोर्स बनाएँ
kubectl apply -f https://example.com/manifest.yaml  # URL से रिसोर्स बनाएँ (ध्यान दें: यह एक उदाहरण डोमेन है और इसमें कोई सही मैनिफ़ेस्ट नहीं है)
kubectl create deployment nginx --image=nginx       # nginx का एक इंस्टेंस शुरू करें

# create a Job which prints "Hello World" (# एक ऐसा जॉब बनाएँ जो "Hello World" प्रिंट करे)
kubectl create job hello --image=busybox:1.28 -- echo "Hello World"

# create a CronJob that prints "Hello World" every minute (# एक ऐसा CronJob बनाएँ जो हर मिनट "Hello World" प्रिंट करे)
kubectl create cronjob hello --image=busybox:1.28   --schedule="*/1 * * * *" -- echo "Hello World"

kubectl explain pods                           # पॉड मैनिफ़ेस्ट के लिए डॉक्यूमेंटेशन पाएँ

# Create multiple YAML objects from stdin (# stdin से कई YAML ऑब्जेक्ट बनाएं)
kubectl apply -f - <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: busybox-sleep
spec:
  containers:
  - name: busybox
    image: busybox:1.28
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
    image: busybox:1.28
    args:
    - sleep
    - "1000"
EOF

# Create a secret with several keys (# कई कीज़ (keys) वाला एक सीक्रेट बनाएँ)
kubectl apply -f - <<EOF
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

## Viewing and finding resources (## रिसोर्स देखना और खोजना)

```bash
# Get commands with basic output (# बेसिक आउटपुट वाले कमांड्स प्राप्त करें)
kubectl get services                          # नेमस्पेस में सभी सर्विसेज़ की लिस्ट देखें
kubectl get pods --all-namespaces             # सभी नेमस्पेस में सभी पॉड्स की लिस्ट देखें
kubectl get pods -o wide                      # मौजूदा नेमस्पेस में सभी पॉड्स की लिस्ट, ज़्यादा जानकारी के साथ देखें
kubectl get deployment my-dep                 # किसी खास डिप्लॉयमेंट की लिस्ट देखें
kubectl get pods                              # नेमस्पेस में सभी पॉड्स की लिस्ट देखें
kubectl get pod my-pod -o yaml                # पॉड का YAML पाएँ

# Describe commands with verbose output (# ज़्यादा जानकारी वाले आउटपुट के साथ कमांड्स को डिस्क्राइब करें)
kubectl describe nodes my-node
kubectl describe pods my-pod

# List Services Sorted by Name (# नाम के आधार पर सॉर्ट की गई सर्विसेज़ की लिस्ट)
kubectl get services --sort-by=.metadata.name

# List pods Sorted by Restart Count (# रीस्टार्ट काउंट के आधार पर सॉर्ट किए गए पॉड्स की लिस्ट)
kubectl get pods --sort-by='.status.containerStatuses[0].restartCount'

# List PersistentVolumes sorted by capacity (# क्षमता के आधार पर सॉर्ट किए गए PersistentVolumes की लिस्ट)
kubectl get pv --sort-by=.spec.capacity.storage

# Get the version label of all pods with label app=cassandra (# app=cassandra लेबल वाले सभी पॉड्स का वर्शन लेबल प्राप्त करें)
kubectl get pods --selector=app=cassandra -o \
jsonpath='{.items[*].metadata.labels.version}'

# Retrieve the value of a key with dots, e.g. 'ca.crt' (# डॉट्स वाली की (key) की वैल्यू पाएँ, जैसे 'ca.crt')
kubectl get configmap myconfig \
-o jsonpath='{.data.ca\.crt}'

# Retrieve a base64 encoded value with dashes instead of underscores. (# अंडरस्कोर की जगह डैश वाली base64 एन्कोडेड वैल्यू पाएँ।)
kubectl get secret my-secret --template='{{index .data "key-name-with-dashes"}}'

# Get all worker nodes (use a selector to exclude results that have a label # सभी वर्कर नोड्स पाएं (लेबल वाले रिज़ल्ट को बाहर करने के लिए सिलेक्टर का इस्तेमाल करें)

kubectl get node --selector='!node-role.kubernetes.io/control-plane'

# Get all running pods in the namespace (# नेमस्पेस में चल रहे सभी पॉड्स (pods) की जानकारी लें)
kubectl get pods --field-selector=status.phase=Running

# Get ExternalIPs of all nodes (# सभी नोड्स के ExternalIPs प्राप्त करें)
kubectl get nodes -o jsonpath='{.items[*].status.addresses[?(@.type=="ExternalIP")].address}'

# List Names of Pods that belong to Particular RC (# किसी खास RC से जुड़े पॉड्स (Pods) के नाम की लिस्ट बनाएं)
# "jq" command useful for transformations that are too complex for jsonpath, it can be found at https://jqlang.github.io/jq/ (# "jq" कमांड उन बदलावों (transformations) के लिए काम का है जो jsonpath के लिए बहुत मुश्किल होते हैं; इसे https://jqlang.github.io/jq/ पर देखा जा सकता है)
sel=${$(kubectl get rc my-rc --output=json | jq -j '.spec.selector | to_entries | .[] | "\(.key)=\(.value),"')%?}
echo $(kubectl get pods --selector=$sel --output=jsonpath={.items..metadata.name})

# Show labels for all pods (or any other Kubernetes object that supports labelling) (# सभी पॉड्स (या लेबलिंग को सपोर्ट करने वाले किसी भी अन्य Kubernetes ऑब्जेक्ट) के लिए लेबल दिखाएं)
kubectl get pods --show-labels

# Check which nodes are ready (# जांचें कि कौन से नोड्स तैयार हैं)
JSONPATH='{range .items[*]}{@.metadata.name}:{range @.status.conditions[*]}{@.type}={@.status};{end}{end}' \
 && kubectl get nodes -o jsonpath="$JSONPATH" | grep "Ready=True"

 # Check which nodes are ready with custom-columns (# कस्टम-कॉलम के साथ देखें कि कौन से नोड तैयार हैं)
kubectl get node -o custom-columns='NODE_NAME:.metadata.name,STATUS:.status.conditions[?(@.type=="Ready")].status'

# Output decoded secrets without external tools (# बाहरी टूल के बिना डिकोड किए गए सीक्रेट्स का आउटपुट पाएं)
kubectl get secret my-secret -o go-template='{{range $k,$v := .data}}{{"### "}}{{$k}}{{"\n"}}{{$v|base64decode}}{{"\n\n"}}{{end}}'

# List all Secrets currently in use by a pod (# किसी पॉड (pod) द्वारा इस्तेमाल किए जा रहे सभी सीक्रेट्स (secrets) की लिस्ट बनाएं)
kubectl get pods -o json | jq '.items[].spec.containers[].env[]?.valueFrom.secretKeyRef.name' | grep -v null | sort | uniq

# List all containerIDs of initContainer of all pods (# सभी पॉड्स के initContainer के सभी containerIDs की लिस्ट बनाएं)
# Helpful when cleaning up stopped containers, while avoiding removal of initContainers. (# यह तब काम आता है जब आप रुके हुए कंटेनरों को हटा रहे हों, लेकिन initContainers को हटाना न चाहें।)
kubectl get pods --all-namespaces -o jsonpath='{range .items[*].status.initContainerStatuses[*]}{.containerID}{"\n"}{end}' | cut -d/ -f3

# List Events sorted by timestamp (# टाइमस्टैम्प के आधार पर इवेंट्स की लिस्ट बनाएं)
kubectl get events --sort-by=.metadata.creationTimestamp

# List all warning events (# सभी वॉर्निंग इवेंट्स की लिस्ट बनाएं)
kubectl events --types=Warning

# Compares the current state of the cluster against the state that the cluster would be in if the manifest was applied. (# क्लस्टर की मौजूदा स्थिति की तुलना उस स्थिति से करें जो मैनिफ़ेस्ट लागू होने पर क्लस्टर की होती।)
kubectl diff -f ./my-manifest.yaml

# Produce a period-delimited tree of all keys returned for nodes (# नोड्स के लिए मिली सभी कीज़ (keys) का डॉट (.) से अलग किया गया ट्री बनाएँ)
# Helpful when locating a key within a complex nested JSON structure (# यह तब मददगार होता है जब किसी कॉम्प्लेक्स नेस्टेड JSON स्ट्रक्चर में कोई की (key) ढूँढनी हो)
kubectl get nodes -o json | jq -c 'paths|join(".")'

# Produce a period-delimited tree of all keys returned for pods, etc (# पॉड्स (pods) वगैरह के लिए मिली सभी कीज़ का डॉट (.) से अलग किया गया ट्री बनाएँ)
kubectl get pods -o json | jq -c 'paths|join(".")'

# Produce ENV for all pods, assuming you have a default container for the pods, default namespace and the `env` command is supported. (# सभी पॉड्स के लिए ENV बनाएँ, यह मानते हुए कि पॉड्स के लिए एक डिफ़ॉल्ट कंटेनर और डिफ़ॉल्ट नेमस्पेस है, और `env` कमांड सपोर्टेड है।)
# Helpful when running any supported command across all pods, not just `env` (# यह तब मददगार होता है जब आप सभी पॉड्स पर कोई भी सपोर्टेड कमांड चलाते हैं, न कि सिर्फ़ `env`)
for pod in $(kubectl get po --output=jsonpath={.items..metadata.name}); do echo $pod && kubectl exec -it $pod -- env; done

# Get a deployment's status subresource (# डिप्लॉयमेंट का स्टेटस सब-रिसोर्स प्राप्त करें)
kubectl get deployment nginx-deployment --subresource=status
```

## Updating resources (## रिसोर्स को अपडेट करना)

```bash
kubectl set image deployment/frontend www=image:v2               # "frontend" डिप्लॉयमेंट के "www" कंटेनर्स का रोलिंग अपडेट, इमेज को अपडेट करना
kubectl rollout history deployment/frontend                      # डिप्लॉयमेंट्स की हिस्ट्री देखें, जिसमें रिविज़न भी शामिल हो
kubectl rollout undo deployment/frontend                         # पिछले डिप्लॉयमेंट पर वापस जाएँ (रोलबैक)
kubectl rollout undo deployment/frontend --to-revision=2         # किसी खास रिविज़न पर वापस जाएँ (रोलबैक)
kubectl rollout status -w deployment/frontend                    # पूरा होने तक "frontend" डिप्लॉयमेंट के रोलिंग अपडेट का स्टेटस देखें
kubectl rollout restart deployment/frontend                      # "frontend" डिप्लॉयमेंट का रोलिंग रीस्टार्ट


cat pod.json | kubectl replace -f -                              # Replace a pod based on the JSON passed into stdin (# stdin में दिए गए JSON के आधार पर पॉड (pod) को बदलें)

# Force replace, delete and then re-create the resource. Will cause a service outage. (# ज़बरदस्ती बदलें (force replace), रिसोर्स को डिलीट करें और फिर से बनाएँ। इससे सर्विस में रुकावट आएगी।)
kubectl replace --force -f ./pod.json

# Create a service for a replicated nginx, which serves on port 80 and connects to the containers on port 8000 (# एक रेप्लिकेटेड nginx के लिए सर्विस बनाएँ, जो पोर्ट 80 पर काम करे और पोर्ट 8000 पर कंटेनर्स से कनेक्ट हो)
kubectl expose rc nginx --port=80 --target-port=8000

# Update a single-container pod's image version (tag) to v4 (# सिंगल-कंटेनर पॉड के इमेज वर्शन (टैग) को v4 में अपडेट करें)
kubectl get pod mypod -o yaml | sed 's/\(image: myimage\):.*$/\1:v4/' | kubectl replace -f -

kubectl label pods my-pod new-label=awesome                      # लेबल जोड़ें
kubectl label pods my-pod new-label-                             # लेबल हटाएं
kubectl label pods my-pod new-label=new-value --overwrite        # मौजूदा वैल्यू को ओवरराइट करें
kubectl annotate pods my-pod icon-url=http://goo.gl/XXBTWq       # एनोटेशन जोड़ें
kubectl annotate pods my-pod icon-url-                           # एनोटेशन हटाएं
kubectl autoscale deployment foo --min=2 --max=10                # "foo" डिप्लॉयमेंट को ऑटो-स्केल करें
```

## Patching resources (## रिसोर्स को पैच करना)

```bash
# Partially update a node (# नोड को आंशिक रूप से अपडेट करें)
kubectl patch node k8s-node-1 -p '{"spec":{"unschedulable":true}}'

# Update a container's image; spec.containers[*].name is required because it's a merge key (# कंटेनर की इमेज अपडेट करें; spec.containers[*].name ज़रूरी है क्योंकि यह एक मर्ज की (merge key) है)
kubectl patch pod valid-pod -p '{"spec":{"containers":[{"name":"kubernetes-serve-hostname","image":"new image"}]}}'

# Update a container's image using a json patch with positional arrays (# पोज़िशनल ऐरे के साथ json पैच का इस्तेमाल करके कंटेनर की इमेज अपडेट करें)
kubectl patch pod valid-pod --type='json' -p='[{"op": "replace", "path": "/spec/containers/0/image", "value":"new image"}]'

# Disable a deployment livenessProbe using a json patch with positional arrays (# पोज़िशनल ऐरे के साथ json पैच का इस्तेमाल करके डिप्लॉयमेंट livenessProbe को डिसेबल करें)
kubectl patch deployment valid-deployment  --type json   -p='[{"op": "remove", "path": "/spec/template/spec/containers/0/livenessProbe"}]'

# Add a new element to a positional array (# पोज़िशनल ऐरे में नया एलिमेंट जोड़ें)
kubectl patch sa default --type='json' -p='[{"op": "add", "path": "/secrets/1", "value": {"name": "whatever" } }]'

# Update a deployment's replica count by patching its scale subresource (# किसी डिप्लॉयमेंट के स्केल सब-रिसोर्स को पैच करके उसके रेप्लिका की संख्या अपडेट करें)
kubectl patch deployment nginx-deployment --subresource='scale' --type='merge' -p '{"spec":{"replicas":2}}'
```

## Editing resources (## रिसोर्स को एडिट करना)

अपनी पसंद के एडिटर में किसी भी API रिसोर्स को एडिट करें।

```bash
kubectl edit svc/docker-registry                      # docker-registry नाम की सर्विस को एडिट करें
KUBE_EDITOR="nano" kubectl edit svc/docker-registry   # किसी दूसरे एडिटर का इस्तेमाल करें
```

## Scaling resources (## रिसोर्स को स्केल करना)

```bash
kubectl scale --replicas=3 rs/foo                                 # 'foo' नाम के रेप्लिकासैट को 3 तक स्केल करें
kubectl scale --replicas=3 -f foo.yaml                            # "foo.yaml" में बताए गए रिसोर्स को 3 तक स्केल करें
kubectl scale --current-replicas=2 --replicas=3 deployment/mysql  # अगर mysql नाम के डिप्लॉयमेंट का मौजूदा साइज़ 2 है, तो mysql को 3 तक स्केल करें
kubectl scale --replicas=5 rc/foo rc/bar rc/baz                   # कई रेप्लिकेशन कंट्रोलर को स्केल करें
```

## Deleting resources (## रिसोर्स हटाना)

```bash
kubectl delete -f ./pod.json                                      # pod.json में बताए गए टाइप और नाम का इस्तेमाल करके पॉड हटाएं
kubectl delete pod unwanted --now                                 # बिना किसी ग्रेस पीरियड के पॉड हटाएं
kubectl delete pod,service baz foo                                # "baz" और "foo" नाम वाले पॉड और सर्विस हटाएं
kubectl delete pods,services -l name=myLabel                      # name=myLabel लेबल वाले पॉड और सर्विस हटाएं
kubectl -n my-ns delete pod,svc --all                             # my-ns नेमस्पेस में सभी पॉड और सर्विस हटाएं,
# awk पैटर्न1 या पैटर्न2 से मेल खाने वाले सभी पॉड हटाएं
kubectl get pods  -n mynamespace --no-headers=true | awk '/pattern1|pattern2/{print $1}' | xargs  kubectl delete -n mynamespace pod
```

## Interacting with running Pods (## चल रहे पॉड्स के साथ इंटरैक्ट करना)

```bash
kubectl logs my-pod                                 # पॉड लॉग्स (stdout) दिखाएं
kubectl logs -l name=myLabel                        # label name=myLabel वाले पॉड लॉग्स (stdout) दिखाएं
kubectl logs my-pod --previous                      # कंटेनर के पिछले इंस्टेंस के लिए पॉड लॉग्स (stdout) दिखाएं
kubectl logs my-pod -c my-container                 # पॉड कंटेनर लॉग्स (stdout, मल्टी-कंटेनर केस) दिखाएं
kubectl logs -l name=myLabel -c my-container        # label name=myLabel वाले पॉड कंटेनर लॉग्स (stdout) दिखाएं
kubectl logs my-pod -c my-container --previous      # कंटेनर के पिछले इंस्टेंस के लिए पॉड कंटेनर लॉग्स (stdout, मल्टी-कंटेनर केस) दिखाएं
kubectl logs -f my-pod                              # पॉड लॉग्स (stdout) को स्ट्रीम करें
kubectl logs -f my-pod -c my-container              # पॉड कंटेनर लॉग्स (stdout, मल्टी-कंटेनर केस) को स्ट्रीम करें
kubectl logs -f -l name=myLabel --all-containers    # label name=myLabel वाले सभी पॉड्स के लॉग्स (stdout) को स्ट्रीम करें
kubectl run -i --tty busybox --image=busybox:1.28 -- sh  # पॉड को इंटरैक्टिव शेल के तौर पर चलाएं
kubectl run nginx --image=nginx -n mynamespace      # mynamespace नेमस्पेस में nginx पॉड का एक इंस्टेंस शुरू करें
kubectl run nginx --image=nginx --dry-run=client -o yaml > pod.yaml
# चल रहे पॉड nginx के लिए स्पेक (spec) बनाएं और उसे pod.yaml नाम की फ़ाइल में लिखें
kubectl attach my-pod -i                            # चल रहे कंटेनर से जुड़ें
kubectl port-forward my-pod 5000:6000               # लोकल मशीन पर पोर्ट 5000 पर सुनें और my-pod पर पोर्ट 6000 पर फ़ॉरवर्ड करें
kubectl exec my-pod -- ls /                         # मौजूदा पॉड में कमांड चलाएं (1 कंटेनर केस)
kubectl exec --stdin --tty my-pod -- /bin/sh        # चल रहे पॉड का इंटरैक्टिव शेल एक्सेस (1 कंटेनर केस)
kubectl exec my-pod -c my-container -- ls /         # मौजूदा पॉड में कमांड चलाएं (मल्टी-कंटेनर केस)
kubectl debug my-pod -it --image=busybox:1.28       # इंटरैक्टिव डीबगिंग बनाएं मौजूदा पॉड के अंदर सेशन शुरू करें और तुरंत उससे जुड़ें
kubectl debug node/my-node -it --image=busybox:1.28 # नोड पर एक इंटरैक्टिव डीबगिंग सेशन बनाएं और तुरंत उससे जुड़ें
kubectl top pod                                     # डिफ़ॉल्ट नेमस्पेस में सभी पॉड्स के लिए मेट्रिक्स दिखाएं
kubectl top pod POD_NAME --containers               # किसी खास पॉड और उसके कंटेनर्स के लिए मेट्रिक्स दिखाएं
kubectl top pod POD_NAME --sort-by=cpu              # किसी खास पॉड के लिए मेट्रिक्स दिखाएं और उन्हें 'cpu' या 'memory' के आधार पर सॉर्ट करें

## Copying files and directories to and from containers (## कंटेनर में और कंटेनर से फ़ाइलें और डायरेक्टरी कॉपी करना)

```bash
kubectl cp /tmp/foo_dir my-pod:/tmp/bar_dir            # मौजूदा नेमस्पेस में रिमोट पॉड की /tmp/bar_dir में लोकल डायरेक्टरी /tmp/foo_dir को कॉपी करें
kubectl cp /tmp/foo my-pod:/tmp/bar -c my-container    # किसी खास कंटेनर में रिमोट पॉड की /tmp/bar में लोकल फ़ाइल /tmp/foo को कॉपी करें
kubectl cp /tmp/foo my-namespace/my-pod:/tmp/bar       # my-namespace नेमस्पेस में रिमोट पॉड की /tmp/bar में लोकल फ़ाइल /tmp/foo को कॉपी करें
kubectl cp my-namespace/my-pod:/tmp/foo /tmp/bar       # रिमोट पॉड से /tmp/foo को लोकल तौर पर /tmp/bar में कॉपी करें
```

{{< note >}}
`kubectl cp` के लिए ज़रूरी है कि आपके कंटेनर इमेज में 'tar' बाइनरी मौजूद हो। अगर 'tar' मौजूद नहीं है, तो `kubectl cp` काम नहीं करेगा।
सिमलिंक (symlinks), वाइल्डकार्ड एक्सपेंशन या फ़ाइल मोड को बनाए रखने जैसे एडवांस्ड इस्तेमाल के लिए `kubectl exec` का इस्तेमाल करने पर विचार करें।
{{< /note >}}

```bash
tar cf - /tmp/foo | kubectl exec -i -n my-namespace my-pod -- tar xf - -C /tmp/bar           # my-namespace में मौजूद रिमोट पॉड में /tmp/foo लोकल फ़ाइल को /tmp/bar में कॉपी करें
kubectl exec -n my-namespace my-pod -- tar cf - /tmp/foo | tar xf - -C /tmp/bar    # रिमोट पॉड से /tmp/foo को लोकल तौर पर /tmp/bar में कॉपी करें
```

## Interacting with Deployments and Services (## डिप्लॉयमेंट और सर्विस के साथ इंटरैक्ट करना)
```bash
kubectl logs deploy/my-deployment                         # डिप्लॉयमेंट के लिए पॉड लॉग्स डंप करें (सिंगल-कंटेनर केस)
kubectl logs deploy/my-deployment -c my-container         # डिप्लॉयमेंट के लिए पॉड लॉग्स डंप करें (मल्टी-कंटेनर केस)

kubectl port-forward svc/my-service 5000                  # लोकल पोर्ट 5000 पर सुनें और सर्विस बैकएंड पर पोर्ट 5000 पर फ़ॉरवर्ड करें
kubectl port-forward svc/my-service 5000:my-service-port  # लोकल पोर्ट 5000 पर सुनें और <my-service-port> नाम वाले सर्विस टारगेट पोर्ट पर फ़ॉरवर्ड करें

kubectl port-forward deploy/my-deployment 5000:6000       # लोकल पोर्ट 5000 पर सुनें और <my-deployment> द्वारा बनाए गए पॉड पर पोर्ट 6000 पर फ़ॉरवर्ड करें
kubectl exec deploy/my-deployment -- ls                   # डिप्लॉयमेंट में पहले पॉड और पहले कंटेनर में कमांड चलाएँ (सिंगल- या मल्टी-कंटेनर केस)
```

## Interacting with Nodes and cluster (## नोड्स और क्लस्टर के साथ इंटरैक्ट करना)

```bash
kubectl cordon my-node                                                # my-node को अनशेड्यूलेबल (unschedulable) के तौर पर मार्क करें
kubectl drain my-node                                                 # मेंटेनेंस की तैयारी के लिए my-node को ड्रेन (drain) करें
kubectl uncordon my-node                                              # my-node को शेड्यूलेबल (schedulable) के तौर पर मार्क करें
kubectl top node                                                      # सभी नोड्स के लिए मेट्रिक्स दिखाएं
kubectl top node my-node                                              # किसी खास नोड के लिए मेट्रिक्स दिखाएं
kubectl cluster-info                                                  # मास्टर और सर्विसेज़ के एड्रेस दिखाएं
kubectl cluster-info dump                                             # मौजूदा क्लस्टर स्टेट को stdout पर डंप करें
kubectl cluster-info dump --output-directory=/path/to/cluster-state   # मौजूदा क्लस्टर स्टेट को /path/to/cluster-state पर डंप करें
```
# View existing taints on which exist on current nodes (# मौजूदा नोड्स पर मौजूद टेन्ट्स (taints) देखें।)
kubectl get nodes -o='custom-columns=NodeName:.metadata.name,TaintKey:.spec.taints[*].key,TaintValue:.spec.taints[*].value,TaintEffect:.spec.taints[*].effect'

# If a taint with that key and effect already exists, its value is replaced as specified. (# अगर उस की (key) और इफ़ेक्ट (effect) वाला टेन्ट पहले से मौजूद है, तो उसकी वैल्यू बताई गई वैल्यू से बदल दी जाती है।)
kubectl taint nodes foo dedicated=special-user:NoSchedule
```

### Resource types (### रिसोर्स के प्रकार)

सभी सपोर्टेड रिसोर्स के प्रकारों की सूची उनके शॉर्टनेम, [API ग्रुप](/docs/concepts/overview/kubernetes-api/#api-groups-and-versioning), क्या वे [नेमस्पेस वाले](/docs/concepts/overview/working-with-objects/namespaces) हैं, और [काइंड](/docs/concepts/overview/working-with-objects/) के साथ दिखाएं:

```bash
kubectl api-resources
```

API रिसोर्स को एक्सप्लोर करने के लिए अन्य ऑपरेशन:

```bash
kubectl api-resources --namespaced=true      # सभी नेमस्पेस वाले रिसोर्स
kubectl api-resources --namespaced=false     # सभी बिना नेमस्पेस वाले रिसोर्स
kubectl api-resources -o name                # साधारण आउटपुट वाले सभी रिसोर्स (सिर्फ़ रिसोर्स का नाम)
kubectl api-resources -o wide                # विस्तृत (यानी "वाइड") आउटपुट वाले सभी रिसोर्स
kubectl api-resources --verbs=list,get       # वे सभी रिसोर्स जो "list" और "get" रिक्वेस्ट वर्ब को सपोर्ट करते हैं
kubectl api-resources --api-group=extensions # "extensions" API ग्रुप में सभी रिसोर्स
```

### Formatting output (### आउटपुट फ़ॉर्मैटिंग)

अपनी टर्मिनल विंडो में किसी खास फ़ॉर्मैट में जानकारी दिखाने के लिए, किसी सपोर्टेड `kubectl` कमांड में `-o` (या `--output`) फ़्लैग जोड़ें।

Output format | Description (आउटपुट फ़ॉर्मैट | विवरण)
--------------| --------------------------|-------
`-o=custom-columns=<spec>` | कस्टम कॉलम की कॉमा-सेपरेटेड लिस्ट का इस्तेमाल करके एक टेबल प्रिंट करें
`-o=custom-columns-file=<filename>` | `<filename>` फ़ाइल में कस्टम कॉलम टेम्प्लेट का इस्तेमाल करके एक टेबल प्रिंट करें
`-o=go-template=<template>`     | [golang टेम्प्लेट](https://pkg.go.dev/text/template) में बताए गए फ़ील्ड प्रिंट करें
`-o=go-template-file=<filename>` | `<filename>` फ़ाइल में [golang टेम्प्लेट](https://pkg.go.dev/text/template) से बताए गए फ़ील्ड प्रिंट करें
`-o=json`     | JSON फ़ॉर्मैट वाला API ऑब्जेक्ट आउटपुट करें
`-o=jsonpath=<template>` | [jsonpath](/docs/reference/kubectl/jsonpath) एक्सप्रेशन में बताए गए फ़ील्ड प्रिंट करें
`-o=jsonpath-file=<filename>` | `<filename>` फ़ाइल में [jsonpath](/docs/reference/kubectl/jsonpath) एक्सप्रेशन से बताए गए फ़ील्ड प्रिंट करें
`-o=kyaml`    | [KYAML](/docs/reference/encodings/kyaml) फ़ॉर्मैट वाला API ऑब्जेक्ट आउटपुट करें। KYAML, YAML का Kubernetes-स्पेसिफ़िक डायलेक्ट है, और इसे YAML के तौर पर पार्स किया जा सकता है।
`-o=name`     | सिर्फ़ रिसोर्स का नाम प्रिंट करें, और कुछ नहीं
`-o=wide`     | अतिरिक्त जानकारी के साथ प्लेन-टेक्स्ट फ़ॉर्मैट में आउटपुट करें, और पॉड्स के लिए, नोड का नाम भी शामिल होता है
`-o=yaml`     | YAML फ़ॉर्मैट वाला API ऑब्जेक्ट आउटपुट करें

`-o=custom-columns` का इस्तेमाल करने के उदाहरण:

```bash
# All images running in a cluster (# क्लस्टर में चल रही सभी इमेज)
kubectl get pods -A -o=custom-columns='DATA:spec.containers[*].image'

# All images running in namespace: default, grouped by Pod (# डिफ़ॉल्ट नेमस्पेस में चल रही सभी इमेज, पॉड के हिसाब से ग्रुप की गईं)
kubectl get pods --namespace default --output=custom-columns="NAME:.metadata.name,IMAGE:.spec.containers[*].image"

 # All images excluding "registry.k8s.io/coredns:1.6.2" (# "registry.k8s.io/coredns:1.6.2" को छोड़कर सभी इमेज)
kubectl get pods -A -o=custom-columns='DATA:spec.containers[?(@.image!="registry.k8s.io/coredns:1.6.2")].image'

# All fields under metadata regardless of name (# नाम की परवाह किए बिना मेटाडेटा के तहत सभी फ़ील्ड)
kubectl get pods -A -o=custom-columns='DATA:metadata.*'
```
kubectl [रेफ़रेंस डॉक्यूमेंटेशन](/docs/reference/kubectl/#custom-columns) में और उदाहरण दिए गए हैं।

### Kubectl आउटपुट वर्बोसिटी और डीबगिंग

Kubectl वर्बोसिटी को `-v` या `--v` फ़्लैग और उसके बाद लॉग लेवल बताने वाले एक इंटीजर से कंट्रोल किया जाता है। सामान्य Kubernetes लॉगिंग के नियम और उनसे जुड़े लॉग लेवल के बारे में [यहाँ](https://github.com/kubernetes/community/blob/main/contributors/devel/sig-instrumentation/logging.md) बताया गया है।


Verbosity | Description वर्बोसिटी | विवरण
--------------| ---------------|------
`--v=0` | आम तौर पर क्लस्टर ऑपरेटर के लिए इसे *हमेशा* देखना उपयोगी होता है।
`--v=1` | अगर आप ज़्यादा जानकारी (verbosity) नहीं चाहते हैं, तो यह एक सही डिफ़ॉल्ट लॉग लेवल है।
`--v=2` | सर्विस के बारे में उपयोगी स्थिर स्थिति की जानकारी और महत्वपूर्ण लॉग मैसेज जो सिस्टम में बड़े बदलावों से जुड़े हो सकते हैं। ज़्यादातर सिस्टम के लिए यह सुझाया गया डिफ़ॉल्ट लॉग लेवल है।
`--v=3` | बदलावों के बारे में विस्तृत जानकारी।
`--v=4` | डीबग लेवल की जानकारी (verbosity)।
`--v=5` | ट्रेस लेवल की जानकारी (verbosity)।
`--v=6` | अनुरोध किए गए रिसोर्स दिखाएं।
`--v=7` | HTTP अनुरोध हेडर दिखाएं।
`--v=8` | HTTP अनुरोध सामग्री दिखाएं।
`--v=9` | HTTP अनुरोध सामग्री को काटे बिना दिखाएं।

## {{% heading "whatsnext" %}}

* [kubectl ओवरव्यू](/docs/concepts/overview/kubectl/) और Kubernetes इकोसिस्टम में इसकी भूमिका के बारे में जानें।
* [kubectl रेफरेंस](/docs/reference/kubectl/) पढ़ें और [JsonPath](/docs/reference/kubectl/jsonpath) के बारे में जानें।

* [kubectl](/docs/reference/kubectl/kubectl/) के विकल्प देखें।

* [kuberc](/docs/reference/kubectl/kuberc) के विकल्प देखें।

* दोबारा इस्तेमाल होने वाले स्क्रिप्ट में kubectl का इस्तेमाल कैसे करें, यह समझने के लिए [kubectl इस्तेमाल के नियम](/docs/reference/kubectl/conventions/) भी पढ़ें।

* कम्युनिटी की और [kubectl चीटशीट](https://github.com/dennyzhang/cheatsheet-kubernetes-A4) देखें।