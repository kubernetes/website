---
title: वर्क क्यू का उपयोग करके सूक्ष्म समानांतर प्रसंस्करण
content_type: task
weight: 30
---

<!-- overview -->

इस उदाहरण में, आप एक Kubernetes जॉब चलाएंगे जो कई समानांतर कार्यों को वर्कर प्रोसेस के रूप में चलाता है, जहां प्रत्येक कार्य एक अलग पॉड के रूप में चलता है।

इस उदाहरण में, जैसे-जैसे प्रत्येक पॉड बनाया जाता है, यह कार्य कतार से एक कार्य इकाई लेता है, उसे प्रोसेस करता है, और कतार के अंत तक पहुंचने तक इसे दोहराता है।

यहाँ इस उदाहरण के चरणों का एक सिंहावलोकन है:

1. **कार्य कतार को संग्रहित करने के लिए एक स्टोरेज सेवा शुरू करें।** इस उदाहरण में, आप कार्य आइटम को स्टोर करने के लिए Redis का उपयोग करेंगे। [पिछले उदाहरण](/docs/tasks/job/coarse-parallel-processing-work-queue) में, आपने RabbitMQ का उपयोग किया था। इस उदाहरण में, आप Redis और एक कस्टम वर्क-क्यू क्लाइंट लाइब्रेरी का उपयोग करेंगे; यह इसलिए है क्योंकि AMQP क्लाइंट्स को यह पता लगाने का कोई अच्छा तरीका प्रदान नहीं करता कि एक सीमित-लंबाई वाली कार्य कतार खाली है या नहीं। व्यवहार में आप Redis जैसा स्टोर एक बार सेट करेंगे और इसका पुन: उपयोग कई जॉब्स की कार्य कतारों और अन्य चीजों के लिए करेंगे।
1. **एक कतार बनाएं, और इसे संदेशों से भरें।** प्रत्येक संदेश एक कार्य को दर्शाता है जो किया जाना है। इस उदाहरण में, एक संदेश एक पूर्णांक है जिस पर हम एक लंबी गणना करेंगे।
1. **कतार से कार्यों पर काम करने वाला एक जॉब शुरू करें**। जॉब कई पॉड्स शुरू करता है। प्रत्येक पॉड संदेश कतार से एक कार्य लेता है, उसे प्रोसेस करता है, और कतार के अंत तक पहुंचने तक इसे दोहराता है।

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

आपको एक कंटेनर इमेज रजिस्ट्री की आवश्यकता होगी जहां आप अपने क्लस्टर में चलाने के लिए इमेज अपलोड कर सकते हैं।
उदाहरण [Docker Hub](https://hub.docker.com/) का उपयोग करता है, लेकिन आप इसे किसी अन्य कंटेनर इमेज रजिस्ट्री के लिए अनुकूलित कर सकते हैं।

यह कार्य उदाहरण यह भी मानता है कि आपने Docker को स्थानीय रूप से इंस्टॉल किया है। आप कंटेनर इमेज बनाने के लिए Docker का उपयोग करते हैं।

<!-- steps -->

[Job](/docs/concepts/workloads/controllers/job/) के बुनियादी, गैर-समानांतर उपयोग से परिचित हों।

<!-- steps -->

## Redis शुरू करना

इस उदाहरण के लिए, सरलता के लिए, आप Redis का एक एकल इंस्टेंस शुरू करेंगे।
Redis को स्केलेबल और रिडंडेंट तरीके से डिप्लॉय करने के उदाहरण के लिए [Redis उदाहरण](https://github.com/kubernetes/examples/tree/master/guestbook) देखें।

आप निम्नलिखित फ़ाइलों को सीधे भी डाउनलोड कर सकते हैं:

- [`redis-pod.yaml`](/examples/application/job/redis/redis-pod.yaml)
- [`redis-service.yaml`](/examples/application/job/redis/redis-service.yaml)
- [`Dockerfile`](/examples/application/job/redis/Dockerfile)
- [`job.yaml`](/examples/application/job/redis/job.yaml)
- [`rediswq.py`](/examples/application/job/redis/rediswq.py)
- [`worker.py`](/examples/application/job/redis/worker.py)

Redis का एक एकल इंस्टेंस शुरू करने के लिए, आपको redis पॉड और redis सेवा बनाने की आवश्यकता है:

```shell
kubectl apply -f https://k8s.io/examples/application/job/redis/redis-pod.yaml
kubectl apply -f https://k8s.io/examples/application/job/redis/redis-service.yaml
```

## कतार को कार्यों से भरना

अब चलिए कतार को कुछ "कार्यों" से भरें। इस उदाहरण में, कार्य प्रिंट किए जाने वाले स्ट्रिंग्स हैं।

Redis CLI चलाने के लिए एक अस्थायी इंटरैक्टिव पॉड शुरू करें।

```shell
kubectl run -i --tty temp --image redis --command "/bin/sh"
```
```
Waiting for pod default/redis2-c7h78 to be running, status is Pending, pod ready: false
Hit enter for command prompt
```

अब एंटर दबाएं, Redis CLI शुरू करें, और इसमें कुछ कार्य आइटम्स के साथ एक सूची बनाएं।

```shell
redis-cli -h redis
```
```console
redis:6379> rpush job2 "apple"
(integer) 1
redis:6379> rpush job2 "banana"
(integer) 2
redis:6379> rpush job2 "cherry"
(integer) 3
redis:6379> rpush job2 "date"
(integer) 4
redis:6379> rpush job2 "fig"
(integer) 5
redis:6379> rpush job2 "grape"
(integer) 6
redis:6379> rpush job2 "lemon"
(integer) 7
redis:6379> rpush job2 "melon"
(integer) 8
redis:6379> rpush job2 "orange"
(integer) 9
redis:6379> lrange job2 0 -1
1) "apple"
2) "banana"
3) "cherry"
4) "date"
5) "fig"
6) "grape"
7) "lemon"
8) "melon"
9) "orange"
```

इस प्रकार, `job2` कुंजी वाली सूची कार्य कतार होगी।

नोट: यदि आपका Kube DNS सही ढंग से सेटअप नहीं है, तो आपको उपरोक्त ब्लॉक के पहले चरण को `redis-cli -h $REDIS_SERVICE_HOST` में बदलना पड़ सकता है।

## एक कंटेनर इमेज बनाएं {#create-an-image}

अब आप एक ऐसी इमेज बनाने के लिए तैयार हैं जो उस कतार में कार्य को प्रोसेस करेगी।

आप संदेश कतार से संदेश पढ़ने के लिए Redis क्लाइंट के साथ एक Python वर्कर प्रोग्राम का उपयोग करने जा रहे हैं।

एक सरल Redis कार्य कतार क्लाइंट लाइब्रेरी प्रदान की गई है,
जिसे `rediswq.py` कहा जाता है ([डाउनलोड](/examples/application/job/redis/rediswq.py))।

जॉब के प्रत्येक पॉड में "वर्कर" प्रोग्राम कार्य प्राप्त करने के लिए कार्य कतार क्लाइंट लाइब्रेरी का उपयोग करता है। यहाँ यह है:

{{% code_sample language="python" file="application/job/redis/worker.py" %}}

आप [`worker.py`](/examples/application/job/redis/worker.py),
[`rediswq.py`](/examples/application/job/redis/rediswq.py), और
[`Dockerfile`](/examples/application/job/redis/Dockerfile) फ़ाइलें भी डाउनलोड कर सकते हैं, फिर
कंटेनर इमेज बना सकते हैं। यहाँ Docker का उपयोग करके इमेज बनाने का एक उदाहरण दिया गया है:

```shell
docker build -t job-wq-2 .
```

### इमेज को पुश करें

[Docker Hub](https://hub.docker.com/) के लिए, अपनी ऐप इमेज को अपने
उपयोगकर्ता नाम के साथ टैग करें और नीचे दिए गए कमांड्स के साथ Hub पर पुश करें। `<username>`
को अपने Hub उपयोगकर्ता नाम से बदलें।

```shell
docker tag job-wq-2 <username>/job-wq-2
docker push <username>/job-wq-2
```

आपको एक सार्वजनिक रिपॉजिटरी में पुश करना होगा या [अपने क्लस्टर को अपनी निजी रिपॉजिटरी तक पहुंच प्राप्त करने के लिए कॉन्फ़िगर करना होगा](/docs/concepts/containers/images/)।

## एक जॉब को परिभाषित करना

यहाँ आपके द्वारा बनाए जाने वाले जॉब के लिए एक मैनिफेस्ट है:

{{% code_sample file="application/job/redis/job.yaml" %}}

{{< note >}}
मैनिफेस्ट को संपादित करके `gcr.io/myproject` को अपने स्वयं के पथ में बदलना सुनिश्चित करें।
{{< /note >}}

इस उदाहरण में, प्रत्येक पॉड कतार से कई आइटम्स पर काम करता है और फिर कोई और आइटम नहीं होने पर बाहर निकल जाता है।
चूंकि वर्कर्स स्वयं पता लगाते हैं कि वर्कक्यू खाली है, और जॉब कंट्रोलर को वर्कक्यू के बारे में पता नहीं है, यह
वर्कर्स पर निर्भर करता है कि वे संकेत दें कि वे काम करना समाप्त कर चुके हैं।
वर्कर्स कतार के खाली होने का संकेत सफलतापूर्वक बाहर निकलकर देते हैं। इसलिए, जैसे ही **कोई भी** वर्कर
सफलतापूर्वक बाहर निकलता है, कंट्रोलर को पता चल जाता है कि काम पूरा हो गया है, और यह कि पॉड्स जल्द ही बाहर निकल जाएंगे।
इसलिए, आपको जॉब की पूर्णता गिनती को अनसेट छोड़ना होगा। जॉब कंट्रोलर अन्य पॉड्स के पूरा होने की प्रतीक्षा करेगा।

## जॉब को चलाना

तो, अब जॉब चलाएं:

```shell
# यह मानता है कि आपने मैनिफेस्ट को पहले ही डाउनलोड और संपादित कर लिया है
kubectl apply -f ./job.yaml
```

अब थोड़ी देर प्रतीक्षा करें, फिर जॉब की जांच करें:

```shell
kubectl describe jobs/job-wq-2
```
```
Name:             job-wq-2
Namespace:        default
Selector:         controller-uid=b1c7e4e3-92e1-11e7-b85e-fa163ee3c11f
Labels:           controller-uid=b1c7e4e3-92e1-11e7-b85e-fa163ee3c11f
                  job-name=job-wq-2
Annotations:      <none>
Parallelism:      2
Completions:      <unset>
Start Time:       Mon, 11 Jan 2022 17:07:59 +0000
Pods Statuses:    1 Running / 0 Succeeded / 0 Failed
Pod Template:
  Labels:       controller-uid=b1c7e4e3-92e1-11e7-b85e-fa163ee3c11f
                job-name=job-wq-2
  Containers:
   c:
    Image:              container-registry.example/exampleproject/job-wq-2
    Port:
    Environment:        <none>
    Mounts:             <none>
  Volumes:              <none>
Events:
  FirstSeen    LastSeen    Count    From            SubobjectPath    Type        Reason            Message
  ---------    --------    -----    ----            -------------    --------    ------            -------
  33s          33s         1        {job-controller }                Normal      SuccessfulCreate  Created pod: job-wq-2-lglf8
```

आप टाइमआउट के साथ जॉब के सफल होने की प्रतीक्षा कर सकते हैं:
```shell
# कंडीशन नाम की जांच केस-इनसेंसिटिव है
kubectl wait --for=condition=complete --timeout=300s job/job-wq-2
```

```shell
kubectl logs pods/job-wq-2-7r7b2
```
```
Worker with sessionID: bbd72d0a-9e5c-4dd6-abf6-416cc267991f
Initial queue state: empty=False
Working on banana
Working on date
Working on lemon
```

जैसा कि आप देख सकते हैं, इस जॉब के लिए एक पॉड ने कई कार्य इकाइयों पर काम किया।

<!-- discussion -->

## विकल्प

यदि एक कतार सेवा चलाना या अपने कंटेनरों को कार्य कतार का उपयोग करने के लिए संशोधित करना असुविधाजनक है, तो आप
अन्य [जॉब पैटर्न्स](/docs/concepts/workloads/controllers/job/#job-patterns) में से एक पर विचार करना चाह सकते हैं।

यदि आपके पास चलाने के लिए पृष्ठभूमि प्रसंस्करण कार्य की एक निरंतर धारा है, तो
अपने पृष्ठभूमि वर्कर्स को ReplicaSet के साथ चलाने पर विचार करें,
और [https://github.com/resque/resque](https://github.com/resque/resque) जैसी पृष्ठभूमि प्रसंस्करण लाइब्रेरी चलाने पर विचार करें। 