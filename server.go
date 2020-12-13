package main

import (
	"fmt"
	"log"
	"net/http"

	socketio "github.com/googollee/go-socket.io"
)

var broadcasterID string

func launchSocketIOService() {
	server, err := socketio.NewServer(nil)
	if err != nil {
		panic(err)
	}

	server.OnConnect("/", func(s socketio.Conn) error {
		fmt.Printf("Rooms: %#v", s.Rooms())
		fmt.Println("connected:", s.ID())
		return nil
	})

	server.OnEvent("/", "broadcaster", func(s socketio.Conn, msg string) {
		broadcasterID = s.ID()
		fmt.Printf("Rooms: %#v", s.Rooms())
		server.BroadcastToRoom("/", "", "broadcaster", nil)
	})

	server.OnEvent("/", "watcher", func(s socketio.Conn) string {
		last := s.Context().(string)
		s.Emit("bye", last)
		s.Close()
		return last
	})

	server.OnError("/", func(s socketio.Conn, e error) {
		fmt.Println("meet error:", e)
	})

	server.OnDisconnect("/", func(s socketio.Conn, reason string) {
		fmt.Println("closed", reason)
	})

	go server.Serve()
	defer server.Close()

	http.Handle("/socket.io/", server)
	http.Handle("/", http.FileServer(http.Dir("./asset")))
	log.Println("Serving at localhost:8000...")
	log.Fatal(http.ListenAndServe(":8000", nil))
}
