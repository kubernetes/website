---
title: कुबेरनेट्स API का उपयोग करके क्लस्टर एक्सेस करें
content_type: task
weight: 60
---

<!-- overview -->
यह पृष्ठ कुबेरनेट्स API का उपयोग करके क्लस्टर एक्सेस करने का तरीका दिखाता है।

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## कुबेरनेट्स API एक्सेस करना

### kubectl से पहली बार एक्सेस करना

कुबेरनेट्स API को पहली बार एक्सेस करते समय, कुबेरनेट्स कमांड-लाइन टूल `kubectl` का उपयोग करें।

किसी क्लस्टर को एक्सेस करने के लिए आपको क्लस्टर का लोकेशन जानना होगा और क्रेडेंशियल होना चाहिए

आमतौर पर, यह स्वचालित रूप से सेट-अप हो जाता है जब आप [गेटिंग स्टार्ट गाइड](/hi/docs/setup/) के माध्यम से काम करते हैं तो या किसी और ने क्लस्टर स्थापित किया और आपको क्रेडेंशियल्स और एक लोकेशन प्रदान किया।

इस कमांड से kubectl के बारे में जानने वाले लोकेशन और क्रेडेंशियल्स की जांच करेंः

```shell
kubectl config view
```

कई [उदाहरण](https://github.com/kubernetes/examples/tree/master/) kubectl के उपयोग का परिचय देते हैं। पूर्ण प्रलेखन [kubectl मैनुअल](/docs/reference/kubectl/) में पाया जाता है।

### सीधे REST API एक्सेस करना

kubectl API सर्वर का पता लगाने और प्रमाणित करने का काम करता है। यदि आप किसी ब्राउज़र या `curl` या `wget` जैसे http क्लाइंट का उपयोग करके सीधे REST API तक पहुंचना चाहते हैं, तो API सर्वर के साथ खोजने और प्रमाणित करने के कई तरीके हैं:

1. kubectl को प्रॉक्सी मोड में चलाएँ (अनुशंसित)। इस विधि की अनुशंसा की जाती है, क्योंकि यह संग्रहित API सर्वर स्थान का उपयोग करता है और स्व-हस्ताक्षरित प्रमाणपत्र का उपयोग करके API सर्वर की पहचान की पुष्टि करता है। इस पद्धति का उपयोग करके कोई मैन-इन-द-मिडिल (man-in-the-middle, MITM) अटैक संभव नहीं है।
2. वैकल्पिक रूप से, आप सीधे http क्लाइंट को लोकेशन और क्रेडेंशियल प्रदान कर सकते हैं। यह क्लाइंट कोड के साथ काम करता है जो प्रॉक्सी द्वारा भ्रमित होता है। मैन इन द मिडल अटैक से बचाव के लिए, आपको अपने ब्राउज़र में एक रूट प्रमाणपत्र आयात करना होगा।

Go या Python क्लाइंट लाइब्रेरी का उपयोग करके kubectl को प्रॉक्सी मोड में एक्सेस किया जा सकता हे।


#### kubectl प्रॉक्सी का उपयोग करना

निम्न कमांड kubectl को एक मोड में चलाता है जहां यह रिवर्स प्रॉक्सी के रूप में कार्य करता है। यह API सर्वर का पता लगाने और प्रमाणीकरण को संभालता है।

इसे इस तरह चलाएँ:

```shell
kubectl proxy --port=8080 &
```

अधिक जानकारी के लिए [kubectl प्रॉक्सी](/docs/reference/generated/kubectl/kubectl-commands#proxy) देखें।
फिर आप curl, wget, या ब्राउज़र से API का पता लगा सकते हैं, जैसेः

```shell
curl http://localhost:8080/api/
```

आउटपुट इसके समान है:

```json
{
  "kind": "APIVersions",
  "versions": [
    "v1"
  ],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "172.30.1.2:6443"
    }
  ]
}
```

#### kubectl प्रॉक्सी के बिना

API सर्वर को सीधे एक प्रमाणीकरण टोकन पास करके कुबेक्टल प्रॉक्सी का उपयोग करने से बचना संभव है, जैसे:

`grep/cut` दृष्टिकोण का उपयोग करना:

```shell
# सभी संभावित क्लस्टर्स की जाँच करें, क्योंकि आपके .KUBECONFIG में कई संदर्भ हो सकते हैं:
kubectl config view -o jsonpath='{"Cluster name\tServer\n"}{range .clusters[*]}{.name}{"\t"}{.cluster.server}{"\n"}{end}'
# परोक्त आउटपुट से आप जिस क्लस्टर से इंटरैक्ट करना चाहते हैं उसका नाम चुनें:
export CLUSTER_NAME="some_server_name"
# क्लस्टर नाम का उल्लेख करते हुए API सर्वर को इंगित करें
APISERVER=$(kubectl config view -o jsonpath="{.clusters[?(@.name==\"$CLUSTER_NAME\")].cluster.server}")
# डिफ़ॉल्ट सेवा अकाउंट के लिए टोकन रखने के लिए एक सीक्रेट बनाएं
kubectl apply -f - <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: default-token
  annotations:
    kubernetes.io/service-account.name: default
type: kubernetes.io/service-account-token
EOF
# टोकन से सीक्रेट को भरने के लिए टोकन नियंत्रक की प्रतीक्षा करें:
while ! kubectl describe secret default-token | grep -E '^token' >/dev/null; do
  echo "waiting for token..." >&2
  sleep 1
done
# टोकन मूल्य प्राप्त करें
TOKEN=$(kubectl get secret default-token -o jsonpath='{.data.token}' | base64 --decode)
# टोकन से API को एक्सप्लोर करें
curl -X GET $APISERVER/api --header "Authorization: Bearer $TOKEN" --insecure
```

आउटपुट इसके समान है:

```json
{
  "kind": "APIVersions",
  "versions": [
    "v1"
  ],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "172.30.1.2:6443"
    }
  ]
}
```
उपरोक्त उदाहरण `--insecure` फ्लैग का उपयोग करता है। यह इसे MITM अटैक के अधीन छोड़ देता है। जब kubectl क्लस्टर एक्सेस करता है तो यह सर्वर एक्सेस करने के लिए संग्रहीत रूट प्रमाणपत्र और क्लाइंट प्रमाणपत्र का उपयोग करता है। (ये `~/.kube` डायरेक्टरी में संस्थापित हैं) चूँकि क्लस्टर प्रमाणपत्र आमतौर पर स्व-हस्ताक्षरित होते हैं, इसलिए आपके http क्लाइंट को रूट प्रमाणपत्र का उपयोग करने के लिए विशेष कॉन्फ़िगरेशन की आवश्यकता हो सकती है।

कुछ क्लस्टर्स पर, API सर्वर को प्रमाणीकरण की आवश्यकता नहीं होती है; यह लोकलहोस्ट पर काम कर सकता है, या फ़ायरवॉल द्वारा सुरक्षित हो सकता है। इसके लिए कोई मानक नहीं है। [Kubernetes API तक पहुंच को नियंत्रित करना](/docs/concepts/security/controlling-access)
वर्णन करता है कि आप इसे क्लस्टर एडमिनिस्ट्रेटर के रूप में कैसे कॉन्फ़िगर कर सकते हैं।

### API को लिए प्रोग्रामेटिक रूप से एक्सेस करें

कुबेरनेट्स आधिकारिक तौर पर [Go](#go-client), [Python](#python-client), [Java](#java-client), [dotnet](#dotnet-client), [JavaScript](#javascript-client), और [Haskell](#haskell-client) के लिए क्लाइंट लाइब्रेरी का समर्थन करता है। कुछ अन्य क्लाइंट लाइब्रेरी भी हैं जो कुबेरनेट्स टीम के बजाय संबंधित लेखकों द्वारा प्रदान और रखरखाव की जाती हैं। अन्य लैंग्वेजेज से API एक्सेस और वे कैसे प्रमाणित करते हैं, इसके लिए [क्लाइंट लाइब्रेरी](/docs/reference/using-api/client-libraries/) देखें।

#### Go क्लाइंट

* लाइब्रेरी प्राप्त करने के लिए, निम्न कमांड रन करें: `go get k8s.io/client-go@kubernetes-<kubernetes-version-number>` यह देखने के लिए कि कौन से संस्करण समर्थित हैं [https://github.com/kubernetes/client-go/releases](https://github.com/kubernetes/client-go/releases) देखें।
* client-go क्लाइंट के ऊपर एक एप्लिकेशन लिखें।

{{< note >}}

client-go अपने स्वयं से API ऑब्जेक्ट्स को परिभाषित करता है, इसलिए यदि आवश्यक हो, तो मुख्य रिपॉजिटरी के बजाय client-go से API परिभाषाएं आयात करें। उदाहरण के लिए, `import "k8s.io/client-go/kubernetes"` सही है।

{{< /note >}}

Go क्लाइंट उसी [kubeconfig फ़ाइल](/docs/concepts/configuration/organize-cluster-access-kubeconfig/) का उपयोग कर सकता है
जिसे कि kubectl CLI API सर्वर का पता लगाने और प्रमाणित करने के लिए करता है। यह [उदाहरण](https://git.k8s.io/client-go/examples/out-of-cluster-client-configuration/main.go) देखें:


```golang
package main
import (
  "context"
  "fmt"
  "k8s.io/apimachinery/pkg/apis/meta/v1"
  "k8s.io/client-go/kubernetes"
  "k8s.io/client-go/tools/clientcmd"
)
func main() {
  // Kubeconfig में वर्तमान संदर्भ का उपयोग करता है
  // path-to-kubeconfig -- for example, /root/.kube/config
  config, _ := clientcmd.BuildConfigFromFlags("", "<path-to-kubeconfig>")
  //क्लाइंटसेट बनाता है
  clientset, _ := kubernetes.NewForConfig(config)
  // पॉड्स को सूचीबद्ध करने के लिए API एक्सेस करें
  pods, _ := clientset.CoreV1().Pods("").List(context.TODO(), v1.ListOptions{})
  fmt.Printf("There are %d pods in the cluster\n", len(pods.Items))
}
```

यदि एप्लिकेशन को क्लस्टर में पॉड के रूप में डिप्लॉय किया गया है, तो [पॉड के भीतर से API एक्सेस करना](/docs/tasks/access-application-cluster/access-cluster/#accessing-the-api-from-a-pod) देखें।

#### Python क्लाइंट

[Python क्लाइंट](https://github.com/kubernetes-client/python) का उपयोग करने के लिए निम्न कमांड रन करें: `pip install kubernetes`। अधिक स्थापना विकल्पों के लिए [python क्लाइंट लाइब्रेरी पेज](https://github.com/kubernetes-client/python) देखें।

Python क्लाइंट उसी kubeconfig फ़ाइल का उपयोग कर सकता है जैसा कि kubectl CLI API सर्वर को खोजने और प्रमाणित करने के लिए करता है। इसे देखें [उदाहरण](https://github.com/kubernetes-client/python/blob/master/examples/out_of_cluster_config.py):


```python
from kubernetes import client, config
config.load_kube_config()
v1=client.CoreV1Api()
print("Listing pods with their IPs:")
ret = v1.list_pod_for_all_namespaces(watch=False)
for i in ret.items:
    print("%s\t%s\t%s" % (i.status.pod_ip, i.metadata.namespace, i.metadata.name))
```

#### Java क्लाइंट

[Java क्लाइंट](https://github.com/kubernetes-client/java) को इनस्टॉल करने के लिए:

```shell
# क्लोन java लाइब्रेरी
git clone --recursive https://github.com/kubernetes-client/java
# प्रोजेक्ट आर्टिफैक्ट्स, पीओएम इत्यादि इनस्टॉल करना:
cd java
mvn install
```

कौन से संस्करण समर्थित हैं, यह देखने के लिए [https://github.com/kubernetes-client/java/releases](https://github.com/kubernetes-client/java/releases) देखें।

Java क्लाइंट उसी [kubeconfig फ़ाइल](/docs/concepts/configuration/organize-cluster-access-kubeconfig/) का उपयोग कर सकता है
जैसा कि kubectl CLI API सर्वर का पता लगाने और प्रमाणित करने के लिए करता है। यह [उदाहरण](https://github.com/kubernetes-client/java/blob/master/examples/examples-release-15/src/main/java/io/kubernetes/client/examples/KubeConfigFileClientExample.java) देखें:

```java
package io.kubernetes.client.examples;
import io.kubernetes.client.ApiClient;
import io.kubernetes.client.ApiException;
import io.kubernetes.client.Configuration;
import io.kubernetes.client.apis.CoreV1Api;
import io.kubernetes.client.models.V1Pod;
import io.kubernetes.client.models.V1PodList;
import io.kubernetes.client.util.ClientBuilder;
import io.kubernetes.client.util.KubeConfig;
import java.io.FileReader;
import java.io.IOException;
/**
 * कुबेरनेट्स क्लस्टर के बाहर किसी एप्लिकेशन से java API का उपयोग करने का एक सरल उदाहरण
 *
 * <p>Easiest way to run this: mvn exec:java
 * -Dexec.mainClass="io.kubernetes.client.examples.KubeConfigFileClientExample"
 *
 */
public class KubeConfigFileClientExample {
  public static void main(String[] args) throws IOException, ApiException {
    // आपके KubeConfig का फ़ाइल पथ
    String kubeConfigPath = "~/.kube/config";
    // फ़ाइल-सिस्टम से आउट-ऑफ़-क्लस्टर कॉन्फ़िगरेशन, एक kubeconfig लोड करना
    ApiClient client =
        ClientBuilder.kubeconfig(KubeConfig.loadKubeConfig(new FileReader(kubeConfigPath))).build();
    // ऊपर से इन-क्लस्टर के लिए वैश्विक डिफ़ॉल्ट API-क्लाइंट सेट करें
    Configuration.setDefaultApiClient(client);
    // CoreV1Api डिफ़ॉल्ट API-क्लाइंट को वैश्विक कॉन्फ़िगरेशन से लोड करता है।
    CoreV1Api api = new CoreV1Api();
    // CoreV1Api क्लाइंट को इनवॉक करता है
    V1PodList list = api.listPodForAllNamespaces(null, null, null, null, null, null, null, null, null);
    System.out.println("Listing all pods: ");
    for (V1Pod item : list.getItems()) {
      System.out.println(item.getMetadata().getName());
    }
  }
}
```

#### dotnet क्लाइंट

[dotnet क्लाइंट](https://github.com/kubernetes-client/csharp) का उपयोग करने के लिए, निम्नलिखित कमांड रन करें: `dotnet add package KubernetesClient --version 1.6.1` अधिक इंस्टालेशन विकल्पों के लिए [dotnet क्लाइंट लाइब्रेरी पेज](https://github.com/kubernetes-client/csharp) देखें। कौन से संस्करण समर्थित हैं, यह देखने के लिए [https://github.com/kubernetes-client/csharp/releases](https://github.com/kubernetes-client/csharp/releases) देखें।

dotnet क्लाइंट उसी [kubeconfig फ़ाइल](/docs/concepts/configuration/organize-cluster-access-kubeconfig/) का उपयोग कर सकता है
जैसा कि kubectl CLI API सर्वर का पता लगाने और प्रमाणित करने के लिए करता है। यह [उदाहरण](https://github.com/kubernetes-client/csharp/blob/master/examples/simple/PodList.cs) देखें:

```csharp
using System;
using k8s;
namespace simple
{
    internal class PodList
    {
        private static void Main(string[] args)
        {
            var config = KubernetesClientConfiguration.BuildDefaultConfig();
            IKubernetes client = new Kubernetes(config);
            Console.WriteLine("Starting Request!");
            var list = client.ListNamespacedPod("default");
            foreach (var item in list.Items)
            {
                Console.WriteLine(item.Metadata.Name);
            }
            if (list.Items.Count == 0)
            {
                Console.WriteLine("Empty!");
            }
        }
    }
}
```

#### JavaScript क्लाइंट

[JavaScript क्लाइंट](https://github.com/kubernetes-client/javascript) इनस्टॉल करने के लिए, निम्नलिखित कमांड रन करें: `npm install @kubernetes/client-node`। कौन से संस्करण समर्थित हैं, यह देखने के लिए [https://github.com/kubernetes-client/javascript/releases](https://github.com/kubernetes-client/javascript/releases) देखें।

JavaScript क्लाइंट उसी [kubeconfig फ़ाइल](/docs/concepts/configuration/organize-cluster-access-kubeconfig/) का उपयोग कर सकता है
जैसा कि kubectl CLI API सर्वर का पता लगाने और प्रमाणित करने के लिए करता है। यह [उदाहरण](https://github.com/kubernetes-client/javascript/blob/master/examples/example.js) देखें:

```javascript
const k8s = require('@kubernetes/client-node');
const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
k8sApi.listNamespacedPod('default').then((res) => {
    console.log(res.body);
});
```

#### Haskell क्लाइंट

कौन से संस्करण समर्थित हैं, यह देखने के लिए [https://github.com/kubernetes-client/haskell/releases](https://github.com/kubernetes-client/haskell/releases) देखें।

[Haskell क्लाइंट](https://github.com/kubernetes-client/haskell) उसी [kubeconfig फ़ाइल](/docs/concepts/configuration/organize-cluster-access-kubeconfig/) का उपयोग कर सकता है
जैसा कि kubectl CLI API सर्वर का पता लगाने और प्रमाणित करने के लिए करता है। यह [उदाहरण](https://github.com/kubernetes-client/haskell/blob/master/kubernetes-client/example/App.hs) देखें:

```haskell
exampleWithKubeConfig :: IO ()
exampleWithKubeConfig = do
    oidcCache <- atomically $ newTVar $ Map.fromList []
    (mgr, kcfg) <- mkKubeClientConfig oidcCache $ KubeConfigFile "/path/to/kubeconfig"
    dispatchMime
            mgr
            kcfg
            (CoreV1.listPodForAllNamespaces (Accept MimeJSON))
        >>= print
```

## {{% heading "whatsnext" %}}

* [पॉड से kubernetes API को एक्सेस करना](/docs/tasks/run-application/access-api-from-pod/)
