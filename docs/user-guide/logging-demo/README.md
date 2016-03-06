This directory contains two [pod](/docs/user-guide/pods) specifications which can be used as synthetic
logging sources. The pod specification in [synthetic_0_25lps.yaml](synthetic_0_25lps.yaml)
describes a pod that just emits a log message once every 4 seconds. The pod specification in
[synthetic_10lps.yaml](synthetic_10lps.yaml)
describes a pod that just emits 10 log lines per second.

See [logging document](https://kubernetes.io/docs/user-guide/logging/) for more details about logging. To observe the ingested log lines when using Google Cloud Logging please see the getting
started instructions
at [Cluster Level Logging to Google Cloud Logging](https://kubernetes.io/docs/getting-started-guides/logging).
To observe the ingested log lines when using Elasticsearch and Kibana please see the getting
started instructions
at [Cluster Level Logging with Elasticsearch and Kibana](https://kubernetes.io/docs/getting-started-guides/logging-elasticsearch).



