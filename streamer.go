package main

import (
	"github.com/xfrr/goffmpeg/transcoder"
)

func launchStreamerX() {
	var inputPath = "/data/testmov"
	var outputPath = "/data/testmp4.mp4"

	// Create new instance of transcoder
	trans := new(transcoder.Transcoder)

	// Initialize transcoder passing the input file path and output file path
	err := trans.Initialize(inputPath, outputPath)
	if err != nil {
		panic(err)
	}

	// Start transcoder process without checking progress
	done := trans.Run(false)

	// This channel is used to wait for the process to end
	err = <-done
	if err != nil {
		panic(err)
	}
}
