package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
)

// HTTPSDPServer starts a HTTP Server that consumes SDPs
func HTTPSDPServer(defaultPort int) chan string {
	port := flag.Int("port", defaultPort, "http server port")
	flag.Parse()

	sdpChan := make(chan string)
	http.HandleFunc("/sdp", func(w http.ResponseWriter, r *http.Request) {
		body, _ := ioutil.ReadAll(r.Body)
		fmt.Fprintf(w, "done")
		sdpChan <- string(body)
	})

	go func() {
		p := ":" + strconv.Itoa(*port)
		log.Println("starting HTTP server at " + p)
		err := http.ListenAndServe(p, nil)
		if err != nil {
			panic(err)
		}
	}()

	return sdpChan
}
