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
