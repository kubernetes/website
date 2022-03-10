package main

import (
	"fmt"
	"io/ioutil"
	"log"

	"gopkg.in/yaml.v3"
)

func main() {

	data, err := ioutil.ReadFile("list-of-all-signed-images.yaml")

	if err != nil {

		log.Fatal(err)
	}

	images := make(map[string][]string)

	err2 := yaml.Unmarshal(data, &images)

	if err2 != nil {

		log.Fatal(err2)
	}
	domains := images["domains"]
	names := images["names"]
	architectures := images["architectures"]
	versions := images["versions"]

	//anything better than 4 for loops is welcome!
	for _, d := range domains {
		for _, n := range names {
			for _, a := range architectures {
				for _, v := range versions {
					image := d + "/" + n + "-" + a + ":" + v
					fmt.Println(image)
				}
			}
		}
	}
}
