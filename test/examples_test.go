/*
Copyright 2016 The Kubernetes Authors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package examples_test

import (
	"bufio"
	"bytes"
	"fmt"
	"io"
	"io/ioutil"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"testing"

	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/types"
	"k8s.io/apimachinery/pkg/util/validation/field"
	"k8s.io/apimachinery/pkg/util/yaml"
	utilfeature "k8s.io/apiserver/pkg/util/feature"
	"k8s.io/kubernetes/pkg/api/testapi"
	"k8s.io/kubernetes/pkg/apis/admissionregistration"
	ar_validation "k8s.io/kubernetes/pkg/apis/admissionregistration/validation"
	"k8s.io/kubernetes/pkg/apis/apps"
	apps_validation "k8s.io/kubernetes/pkg/apis/apps/validation"
	"k8s.io/kubernetes/pkg/apis/autoscaling"
	autoscaling_validation "k8s.io/kubernetes/pkg/apis/autoscaling/validation"
	"k8s.io/kubernetes/pkg/apis/batch"
	batch_validation "k8s.io/kubernetes/pkg/apis/batch/validation"
	api "k8s.io/kubernetes/pkg/apis/core"
	"k8s.io/kubernetes/pkg/apis/core/validation"
	"k8s.io/kubernetes/pkg/apis/extensions"
	ext_validation "k8s.io/kubernetes/pkg/apis/extensions/validation"
	"k8s.io/kubernetes/pkg/apis/policy"
	policy_validation "k8s.io/kubernetes/pkg/apis/policy/validation"
	"k8s.io/kubernetes/pkg/apis/rbac"
	rbac_validation "k8s.io/kubernetes/pkg/apis/rbac/validation"
	"k8s.io/kubernetes/pkg/apis/settings"
	settings_validation "k8s.io/kubernetes/pkg/apis/settings/validation"
	"k8s.io/kubernetes/pkg/apis/storage"
	storage_validation "k8s.io/kubernetes/pkg/apis/storage/validation"
	"k8s.io/kubernetes/pkg/capabilities"
	"k8s.io/kubernetes/pkg/registry/batch/job"
	schedulerapilatest "k8s.io/kubernetes/pkg/scheduler/api/latest"
)

func validateObject(obj runtime.Object) (errors field.ErrorList) {
	// Enable CustomPodDNS for testing
	utilfeature.DefaultFeatureGate.Set("CustomPodDNS=true")
	switch t := obj.(type) {
	case *admissionregistration.InitializerConfiguration:
		// cluster scope resource
		errors = ar_validation.ValidateInitializerConfiguration(t)
	case *api.ConfigMap:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = validation.ValidateConfigMap(t)
	case *api.Endpoints:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = validation.ValidateEndpoints(t)
	case *api.LimitRange:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = validation.ValidateLimitRange(t)
	case *api.Namespace:
		errors = validation.ValidateNamespace(t)
	case *api.PersistentVolume:
		errors = validation.ValidatePersistentVolume(t)
	case *api.PersistentVolumeClaim:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = validation.ValidatePersistentVolumeClaim(t)
	case *api.Pod:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = validation.ValidatePod(t)
	case *api.PodList:
		for i := range t.Items {
			errors = append(errors, validateObject(&t.Items[i])...)
		}
	case *api.PodTemplate:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = validation.ValidatePodTemplate(t)
	case *api.ReplicationController:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = validation.ValidateReplicationController(t)
	case *api.ReplicationControllerList:
		for i := range t.Items {
			errors = append(errors, validateObject(&t.Items[i])...)
		}
	case *api.ResourceQuota:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = validation.ValidateResourceQuota(t)
	case *api.Secret:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = validation.ValidateSecret(t)
	case *api.Service:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = validation.ValidateService(t)
	case *api.ServiceAccount:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = validation.ValidateServiceAccount(t)
	case *api.ServiceList:
		for i := range t.Items {
			errors = append(errors, validateObject(&t.Items[i])...)
		}
	case *apps.StatefulSet:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = apps_validation.ValidateStatefulSet(t)
	case *autoscaling.HorizontalPodAutoscaler:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = autoscaling_validation.ValidateHorizontalPodAutoscaler(t)
	case *batch.Job:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		// Job needs generateSelector called before validation, and job.Validate does this.
		// See: https://github.com/kubernetes/kubernetes/issues/20951#issuecomment-187787040
		t.ObjectMeta.UID = types.UID("fakeuid")
		if strings.Index(t.ObjectMeta.Name, "$") > -1 {
			t.ObjectMeta.Name = "skip-for-good"
		}
		errors = job.Strategy.Validate(nil, t)
	case *extensions.DaemonSet:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = ext_validation.ValidateDaemonSet(t)
	case *extensions.Deployment:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = ext_validation.ValidateDeployment(t)
	case *extensions.Ingress:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = ext_validation.ValidateIngress(t)
	case *extensions.PodSecurityPolicy:
		errors = ext_validation.ValidatePodSecurityPolicy(t)
	case *extensions.ReplicaSet:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = ext_validation.ValidateReplicaSet(t)
	case *batch.CronJob:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = batch_validation.ValidateCronJob(t)
	case *policy.PodDisruptionBudget:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = policy_validation.ValidatePodDisruptionBudget(t)
	case *rbac.ClusterRoleBinding:
		// clusterolebinding does not accept namespace
		errors = rbac_validation.ValidateClusterRoleBinding(t)
	case *settings.PodPreset:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = settings_validation.ValidatePodPreset(t)
	case *storage.StorageClass:
		// storageclass does not accept namespace
		errors = storage_validation.ValidateStorageClass(t)
	default:
		errors = field.ErrorList{}
		errors = append(errors, field.InternalError(field.NewPath(""), fmt.Errorf("no validation defined for %#v", obj)))
	}
	return errors
}

// Walks inDir for any json/yaml files. Converts yaml to json, and calls fn for
// each file found with the contents in data.
func walkConfigFiles(inDir string, fn func(name, path string, data [][]byte)) error {
	return filepath.Walk(inDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if info.IsDir() && path != inDir {
			return filepath.SkipDir
		}

		file := filepath.Base(path)
		if ext := filepath.Ext(file); ext == ".json" || ext == ".yaml" {
			//glog.Infof("Testing %s", path)
			data, err := ioutil.ReadFile(path)
			if err != nil {
				return err
			}
			// workaround for Jekyllr limit
			if bytes.HasPrefix(data, []byte("---\n")) {
				return fmt.Errorf("YAML file cannot start with \"---\", please remove the first line")
			}
			name := strings.TrimSuffix(file, ext)

			var docs [][]byte
			if ext == ".yaml" {
				// YAML can contain multiple documents.
				splitter := yaml.NewYAMLReader(bufio.NewReader(bytes.NewBuffer(data)))
				for {
					doc, err := splitter.Read()
					if err == io.EOF {
						break
					}
					if err != nil {
						return fmt.Errorf("%s: %v", path, err)
					}
					out, err := yaml.ToJSON(doc)
					if err != nil {
						return fmt.Errorf("%s: %v", path, err)
					}
					// deal with "empty" document (e.g. pure comments)
					if string(out) != "null" {
						docs = append(docs, out)
					}
				}
			} else {
				docs = append(docs, data)
			}

			fn(name, path, docs)
		}
		return nil
	})
}

func TestExampleObjectSchemas(t *testing.T) {
	// Please help maintain the alphabeta order in the map
	cases := map[string]map[string][]runtime.Object{
		"docs/admin/high-availability": {
			"etcd":                    {&api.Pod{}},
			"kube-apiserver":          {&api.Pod{}},
			"kube-controller-manager": {&api.Pod{}},
			"kube-scheduler":          {&api.Pod{}},
			"podmaster":               {&api.Pod{}},
		},
		"docs/admin/limitrange": {
			"invalid-pod": {&api.Pod{}},
			"limits":      {&api.LimitRange{}},
			"namespace":   {&api.Namespace{}},
			"valid-pod":   {&api.Pod{}},
		},
		"docs/admin/multiple-schedulers": {
			"my-scheduler": {&extensions.Deployment{}},
			"pod1":         {&api.Pod{}},
			"pod2":         {&api.Pod{}},
			"pod3":         {&api.Pod{}},
		},
		"docs/admin/resourcequota": {
			"best-effort":       {&api.ResourceQuota{}},
			"compute-resources": {&api.ResourceQuota{}},
			"limits":            {&api.LimitRange{}},
			"namespace":         {&api.Namespace{}},
			"not-best-effort":   {&api.ResourceQuota{}},
			"object-counts":     {&api.ResourceQuota{}},
		},
		"docs/concepts/cluster-administration": {
			"counter-pod":                             {&api.Pod{}},
			"fluentd-sidecar-config":                  {&api.ConfigMap{}},
			"nginx-app":                               {&api.Service{}, &extensions.Deployment{}},
			"nginx-deployment":                        {&extensions.Deployment{}},
			"two-files-counter-pod":                   {&api.Pod{}},
			"two-files-counter-pod-agent-sidecar":     {&api.Pod{}},
			"two-files-counter-pod-streaming-sidecar": {&api.Pod{}},
		},
		"docs/concepts/cluster-administration/nginx": {
			"nginx-deployment": {&extensions.Deployment{}},
			"nginx-svc":        {&api.Service{}},
		},
		"docs/concepts/configuration": {
			"commands": {&api.Pod{}},
			"pod":      {&api.Pod{}},
			"pod-with-node-affinity": {&api.Pod{}},
			"pod-with-pod-affinity":  {&api.Pod{}},
		},
		"docs/concepts/overview/working-with-objects": {
			"nginx-deployment": {&extensions.Deployment{}},
		},
		"docs/concepts/policy": {
			"privileged-psp": {&extensions.PodSecurityPolicy{}},
			"restricted-psp": {&extensions.PodSecurityPolicy{}},
			"example-psp":    {&extensions.PodSecurityPolicy{}},
		},
		"docs/concepts/services-networking": {
			"curlpod":          {&extensions.Deployment{}},
			"custom-dns":       {&api.Pod{}},
			"hostaliases-pod":  {&api.Pod{}},
			"ingress":          {&extensions.Ingress{}},
			"nginx-secure-app": {&api.Service{}, &extensions.Deployment{}},
			"nginx-svc":        {&api.Service{}},
			"run-my-nginx":     {&extensions.Deployment{}},
		},
		"docs/concepts/workloads/controllers": {
			"cronjob":          {&batch.CronJob{}},
			"daemonset":        {&extensions.DaemonSet{}},
			"frontend":         {&extensions.ReplicaSet{}},
			"hpa-rs":           {&autoscaling.HorizontalPodAutoscaler{}},
			"job":              {&batch.Job{}},
			"my-repset":        {&extensions.ReplicaSet{}},
			"nginx-deployment": {&extensions.Deployment{}},
			"replication":      {&api.ReplicationController{}},
		},
		"docs/tasks/access-application-cluster": {
			"frontend":          {&api.Service{}, &extensions.Deployment{}},
			"hello-service":     {&api.Service{}},
			"hello":             {&extensions.Deployment{}},
			"redis-master":      {&api.Pod{}},
			"two-container-pod": {&api.Pod{}},
		},
		"docs/tasks/administer-cluster": {
			"busybox": {&api.Pod{}},
			"cloud-controller-manager-daemonset-example": {&api.ServiceAccount{}, &rbac.ClusterRoleBinding{}, &extensions.DaemonSet{}},
			"cpu-constraints":                            {&api.LimitRange{}},
			"cpu-constraints-pod":                        {&api.Pod{}},
			"cpu-constraints-pod-2":                      {&api.Pod{}},
			"cpu-constraints-pod-3":                      {&api.Pod{}},
			"cpu-constraints-pod-4":                      {&api.Pod{}},
			"cpu-defaults":                               {&api.LimitRange{}},
			"cpu-defaults-pod":                           {&api.Pod{}},
			"cpu-defaults-pod-2":                         {&api.Pod{}},
			"cpu-defaults-pod-3":                         {&api.Pod{}},
			"dns-horizontal-autoscaler":                  {&extensions.Deployment{}},
			"memory-constraints":                         {&api.LimitRange{}},
			"memory-constraints-pod":                     {&api.Pod{}},
			"memory-constraints-pod-2":                   {&api.Pod{}},
			"memory-constraints-pod-3":                   {&api.Pod{}},
			"memory-constraints-pod-4":                   {&api.Pod{}},
			"memory-defaults":                            {&api.LimitRange{}},
			"memory-defaults-pod":                        {&api.Pod{}},
			"memory-defaults-pod-2":                      {&api.Pod{}},
			"memory-defaults-pod-3":                      {&api.Pod{}},
			"my-scheduler":                               {&api.ServiceAccount{}, &rbac.ClusterRoleBinding{}, &extensions.Deployment{}},
			"namespace-dev":                              {&api.Namespace{}},
			"namespace-prod":                             {&api.Namespace{}},
			"persistent-volume-label-initializer-config": {&admissionregistration.InitializerConfiguration{}},
			"pod1":                 {&api.Pod{}},
			"pod2":                 {&api.Pod{}},
			"pod3":                 {&api.Pod{}},
			"quota-mem-cpu":        {&api.ResourceQuota{}},
			"quota-mem-cpu-pod":    {&api.Pod{}},
			"quota-mem-cpu-pod-2":  {&api.Pod{}},
			"quota-objects":        {&api.ResourceQuota{}},
			"quota-objects-pvc":    {&api.PersistentVolumeClaim{}},
			"quota-objects-pvc-2":  {&api.PersistentVolumeClaim{}},
			"quota-pod":            {&api.ResourceQuota{}},
			"quota-pod-deployment": {&extensions.Deployment{}},
			"quota-pvc-2":          {&api.PersistentVolumeClaim{}},
		},
		"docs/tasks/configure-pod-container": {
			"cpu-request-limit":       {&api.Pod{}},
			"cpu-request-limit-2":     {&api.Pod{}},
			"exec-liveness":           {&api.Pod{}},
			"extended-resource-pod":   {&api.Pod{}},
			"extended-resource-pod-2": {&api.Pod{}},
			"http-liveness":           {&api.Pod{}},
			"init-containers":         {&api.Pod{}},
			"lifecycle-events":        {&api.Pod{}},
			"mem-limit-range":         {&api.LimitRange{}},
			"memory-request-limit":    {&api.Pod{}},
			"memory-request-limit-2":  {&api.Pod{}},
			"memory-request-limit-3":  {&api.Pod{}},
			"oir-pod":                 {&api.Pod{}},
			"oir-pod-2":               {&api.Pod{}},
			"pod":                     {&api.Pod{}},
			"pod-redis":               {&api.Pod{}},
			"private-reg-pod":         {&api.Pod{}},
			"projected-volume":        {&api.Pod{}},
			"qos-pod":                 {&api.Pod{}},
			"qos-pod-2":               {&api.Pod{}},
			"qos-pod-3":               {&api.Pod{}},
			"qos-pod-4":               {&api.Pod{}},
			"rq-compute-resources":    {&api.ResourceQuota{}},
			"security-context":        {&api.Pod{}},
			"security-context-2":      {&api.Pod{}},
			"security-context-3":      {&api.Pod{}},
			"security-context-4":      {&api.Pod{}},
			"share-process-namespace": {&api.Pod{}},
			"task-pv-claim":           {&api.PersistentVolumeClaim{}},
			"task-pv-pod":             {&api.Pod{}},
			"task-pv-volume":          {&api.PersistentVolume{}},
			"tcp-liveness-readiness":  {&api.Pod{}},
		},
		"docs/tasks/debug-application-cluster": {
			"counter-pod":                     {&api.Pod{}},
			"event-exporter-deploy":           {&api.ServiceAccount{}, &rbac.ClusterRoleBinding{}, &extensions.Deployment{}},
			"fluentd-gcp-configmap":           {&api.ConfigMap{}},
			"fluentd-gcp-ds":                  {&extensions.DaemonSet{}},
			"nginx-dep":                       {&extensions.Deployment{}},
			"node-problem-detector":           {&extensions.DaemonSet{}},
			"node-problem-detector-configmap": {&extensions.DaemonSet{}},
			"shell-demo":                      {&api.Pod{}},
			"termination":                     {&api.Pod{}},
		},
		// TODO: decide whether federation examples should be added
		"docs/tasks/inject-data-application": {
			"commands":                    {&api.Pod{}},
			"dapi-envars-container":       {&api.Pod{}},
			"dapi-envars-pod":             {&api.Pod{}},
			"dapi-volume":                 {&api.Pod{}},
			"dapi-volume-resources":       {&api.Pod{}},
			"envars":                      {&api.Pod{}},
			"podpreset-allow-db":          {&settings.PodPreset{}},
			"podpreset-allow-db-merged":   {&api.Pod{}},
			"podpreset-configmap":         {&api.ConfigMap{}},
			"podpreset-conflict-pod":      {&api.Pod{}},
			"podpreset-conflict-preset":   {&settings.PodPreset{}},
			"podpreset-merged":            {&api.Pod{}},
			"podpreset-multi-merged":      {&api.Pod{}},
			"podpreset-pod":               {&api.Pod{}},
			"podpreset-preset":            {&settings.PodPreset{}},
			"podpreset-proxy":             {&settings.PodPreset{}},
			"podpreset-replicaset-merged": {&api.Pod{}},
			"podpreset-replicaset":        {&extensions.ReplicaSet{}},
			"secret":                      {&api.Secret{}},
			"secret-envars-pod":           {&api.Pod{}},
			"secret-pod":                  {&api.Pod{}},
		},
		"docs/tasks/job": {
			"cronjob": {&batch.CronJob{}},
			"job":     {&batch.Job{}},
		},
		"docs/tasks/job/coarse-parallel-processing-work-queue": {
			"job": {&batch.Job{}},
		},
		"docs/tasks/job/fine-parallel-processing-work-queue": {
			"job":           {&batch.Job{}},
			"redis-pod":     {&api.Pod{}},
			"redis-service": {&api.Service{}},
		},
		"docs/tasks/run-application": {
			"deployment":            {&extensions.Deployment{}},
			"deployment-patch-demo": {&extensions.Deployment{}},
			"deployment-scale":      {&extensions.Deployment{}},
			"deployment-update":     {&extensions.Deployment{}},
			"hpa-php-apache":        {&autoscaling.HorizontalPodAutoscaler{}},
			"mysql-configmap":       {&api.ConfigMap{}},
			"mysql-deployment":      {&api.Service{}, &extensions.Deployment{}},
			"mysql-pv":      {&api.PersistentVolume{}, &api.PersistentVolumeClaim{}},
			"mysql-services":        {&api.Service{}, &api.Service{}},
			"mysql-statefulset":     {&apps.StatefulSet{}},
		},
		"docs/tutorials/clusters": {
			"hello-apparmor-pod": {&api.Pod{}},
			"my-scheduler":       {&extensions.Deployment{}},
		},
		"docs/tutorials/configuration/configmap/redis": {
			"redis-pod": {&api.Pod{}},
		},
		"docs/concepts/overview/object-management-kubectl": {
			"simple_deployment": {&extensions.Deployment{}},
			"update_deployment": {&extensions.Deployment{}},
		},
		"docs/tutorials/stateful-application": {
			"web":       {&api.Service{}, &apps.StatefulSet{}},
			"webp":      {&api.Service{}, &apps.StatefulSet{}},
			"zookeeper": {&api.Service{}, &api.Service{}, &policy.PodDisruptionBudget{}, &apps.StatefulSet{}},
		},
		"docs/tutorials/stateful-application/cassandra": {
			"cassandra-service":     {&api.Service{}},
			"cassandra-statefulset": {&apps.StatefulSet{}, &storage.StorageClass{}},
		},
		"docs/tutorials/stateful-application/mysql-wordpress-persistent-volume": {
			"local-volumes":        {&api.PersistentVolume{}, &api.PersistentVolume{}},
			"mysql-deployment":     {&api.Service{}, &api.PersistentVolumeClaim{}, &extensions.Deployment{}},
			"wordpress-deployment": {&api.Service{}, &api.PersistentVolumeClaim{}, &extensions.Deployment{}},
		},
		"docs/tutorials/stateless-application": {
			"deployment":        {&extensions.Deployment{}},
			"deployment-scale":  {&extensions.Deployment{}},
			"deployment-update": {&extensions.Deployment{}},
		},
		"docs/tutorials/stateless-application/guestbook": {
			"frontend-deployment":     {&extensions.Deployment{}},
			"frontend-service":        {&api.Service{}},
			"redis-master-deployment": {&extensions.Deployment{}},
			"redis-master-service":    {&api.Service{}},
			"redis-slave-deployment":  {&extensions.Deployment{}},
			"redis-slave-service":     {&api.Service{}},
		},
	}

	// Note a key in the following map has to be complete relative path
	filesIgnore := map[string]map[string]bool{
		"../content/en/docs/tasks/debug-application-cluster": {
			"audit-policy": true,
		},
	}
	capabilities.SetForTests(capabilities.Capabilities{
		AllowPrivileged: true,
	})
	// PodShareProcessNamespace needed for example share-process-namespace.yaml
	utilfeature.DefaultFeatureGate.Set("PodShareProcessNamespace=true")

	rootpath := "../content/en/"
	for dir, expected := range cases {
		tested := 0
		numExpected := 0
		path := rootpath + dir
		err := walkConfigFiles(path, func(name, path string, docs [][]byte) {
			expectedTypes, found := expected[name]
			if !found {
				p := filepath.Dir(path)
				if files, ok := filesIgnore[p]; ok {
					if files[name] {
						return
					}
				}
				t.Errorf("%s: %s does not have a test case defined", path, name)
				return
			}
			numExpected += len(expectedTypes)
			if len(expectedTypes) != len(docs) {
				t.Errorf("%s: number of expected types (%v) doesn't match number of docs in YAML (%v)", path, len(expectedTypes), len(docs))
				return
			}
			for i, data := range docs {
				expectedType := expectedTypes[i]
				tested++
				if expectedType == nil {
					t.Logf("skipping : %s/%s\n", path, name)
					return
				}
				if strings.Contains(name, "scheduler-policy-config") {
					if err := runtime.DecodeInto(schedulerapilatest.Codec, data, expectedType); err != nil {
						t.Errorf("%s did not decode correctly: %v\n%s", path, err, string(data))
						return
					}
					// TODO: Add validate method for
					// &schedulerapi.Policy, and remove this
					// special case
				} else {
					codec, err := testapi.GetCodecForObject(expectedType)
					if err != nil {
						t.Errorf("Could not get codec for %s: %s", expectedType, err)
					}
					if err := runtime.DecodeInto(codec, data, expectedType); err != nil {
						t.Errorf("%s did not decode correctly: %v\n%s", path, err, string(data))
						return
					}
					if errors := validateObject(expectedType); len(errors) > 0 {
						t.Errorf("%s did not validate correctly: %v", path, errors)
					}
				}
			}
		})
		if err != nil {
			t.Errorf("Expected no error, Got %v on Path %v", err, path)
		}
		if tested != numExpected {
			t.Errorf("Directory %v: Expected %d examples, Got %d", path, len(expected), tested)
		}
	}
}

// This regex is tricky, but it works.  For future me, here is the decode:
//
// Flags: (?ms) = multiline match, allow . to match \n
// 1) Look for a line that starts with ``` (a markdown code block)
// 2) (?: ... ) = non-capturing group
// 3) (P<name>) = capture group as "name"
// 4) Look for #1 followed by either:
// 4a)    "yaml" followed by any word-characters followed by a newline (e.g. ```yamlfoo\n)
// 4b)    "any word-characters followed by a newline (e.g. ```json\n)
// 5) Look for either:
// 5a)    #4a followed by one or more characters (non-greedy)
// 5b)    #4b followed by { followed by one or more characters (non-greedy) followed by }
// 6) Look for #5 followed by a newline followed by ``` (end of the code block)
//
// This could probably be simplified, but is already too delicate.  Before any
// real changes, we should have a test case that just tests this regex.
var sampleRegexp = regexp.MustCompile("(?ms)^```(?:(?P<type>yaml)\\w*\\n(?P<content>.+?)|\\w*\\n(?P<content>\\{.+?\\}))\\n^```")
var subsetRegexp = regexp.MustCompile("(?ms)\\.{3}")

// Validates examples embedded in Markdown files.
func TestReadme(t *testing.T) {
	// BlockVolume required for local volume example
	utilfeature.DefaultFeatureGate.Set("BlockVolume=true")

	paths := []struct {
		file         string
		expectedType []runtime.Object // List of all valid types for the whole doc
	}{
		{"../content/en/docs/concepts/storage/volumes.md", []runtime.Object{
			&api.Pod{},
			&api.PersistentVolume{},
		}},
	}

	for _, path := range paths {
		data, err := ioutil.ReadFile(path.file)
		if err != nil {
			t.Errorf("Unable to read file %s: %v", path, err)
			continue
		}

		matches := sampleRegexp.FindAllStringSubmatch(string(data), -1)
		if matches == nil {
			continue
		}
		for _, match := range matches {
			var content, subtype string
			for i, name := range sampleRegexp.SubexpNames() {
				if name == "type" {
					subtype = match[i]
				}
				if name == "content" && match[i] != "" {
					content = match[i]
				}
			}
			if subtype == "yaml" && subsetRegexp.FindString(content) != "" {
				t.Logf("skipping (%s): \n%s", subtype, content)
				continue
			}

			json, err := yaml.ToJSON([]byte(content))
			if err != nil {
				t.Errorf("%s could not be converted to JSON: %v\n%s", path, err, string(content))
			}

			var expectedType runtime.Object
			for _, expectedType = range path.expectedType {
				err = runtime.DecodeInto(testapi.Default.Codec(), json, expectedType)
				if err == nil {
					break
				}
			}
			if err != nil {
				t.Errorf("%s did not decode correctly: %v\n%s", path, err, string(content))
				continue
			}

			if errors := validateObject(expectedType); len(errors) > 0 {
				t.Errorf("%s did not validate correctly: %v", path, errors)
			}
			_, err = runtime.Encode(testapi.Default.Codec(), expectedType)
			if err != nil {
				t.Errorf("Could not encode object: %v", err)
				continue
			}
		}
	}
}
