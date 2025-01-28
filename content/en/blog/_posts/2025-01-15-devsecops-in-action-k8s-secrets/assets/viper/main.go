/*
Copyright 2025 The Kubernetes Authors.

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

/*
This file related to the article "DevSecOps in Action: Kubernetes Secrets"
https://kubernetes.io/blog/2025/01/15/devsecops-in-action-k8s-secrets/
*/

package main

import (
	"fmt"
	"os"
	"reflect"
	"strings"
	"time"

	"github.com/mitchellh/mapstructure"
	"github.com/spf13/viper"
)

const (
	appName = "demo_secret_"
)

type (

	Cfg struct {
		User     string     `mapstructure:"user"`
		Passwd SecureData   `mapstructure:"passwd"`
	}

	SecureData string
)

func GetConfig(cfg any, prefix string) error {
	viper.SetEnvPrefix(prefix)
	viper.BindEnv("user")
	viper.BindEnv("passwd")
	return viper.Unmarshal(cfg, viper.DecodeHook(secureDataFieldDecode()))
}

func secureDataFieldDecode() mapstructure.DecodeHookFunc {
	return func(
		f reflect.Type,
		t reflect.Type,
		data interface{}) (interface{}, error) {

		if f.Kind() != reflect.String {
			return data, nil
		}
		if t != reflect.TypeOf(SecureData("")) {
			return data, nil
		}

		if !strings.HasPrefix(data.(string), "file://") {
			// fallback
			return data, nil
		}

		// read secure data from file
		sdPath := strings.TrimPrefix(data.(string), "file://")
		path := SecureData(sdPath)
		content, err := os.ReadFile(string(SecureData(path)))
		if err != nil {
			return "", fmt.Errorf("File not found %v:", err)
		}
		return content, nil
	}
}

func main() {
	cfg := Cfg{}

	if err := GetConfig(&cfg, appName); err != nil {
		panic(err)
	}

	fmt.Printf("%+v\n", cfg)
	time.Sleep(60 * time.Second) // instead of launching as daemon/container
}
