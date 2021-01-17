import { EventEmitter } from "events";
import { readDataURL, arrayBufferToBlob, readArrayBuffer } from "./utils";
import workerClient from "ffmpeg-webworker";
import { fromS } from "./formatSeconds";

class WebVideo extends EventEmitter {
  constructor(videoFile) {
    super();
    this.videoFile = videoFile;
    this.workerClient = workerClient;

    workerClient.on("onReady", () => this.emit("FFMPEGReady"));
    workerClient.on("onStdout", msg => this.emit("FFMPEGStdout", msg));
    workerClient.on("onFileReceived", () => this.emit("FFMPEGFileReceived"));
    workerClient.on("onDone", this.handleDoneClientDone);
  }
  handleDoneClientDone = result => {
    // console.log(result);
    // if (!this.optimizedVideo) {
    //   this.optimizedVideo = true;
    //   const converted = arrayBufferToBlob(result[0].data);
    //   // console.log(converted);
    //   workerClient.inputFile = converted;
    //   setTimeout(this.optimizeVideo, 500);
    // } else {
    const converted = arrayBufferToBlob(result[0].data);
    this.emit("FFMPEGDone", result);
    // }
  };
  trimVideo = (start = 0, length) => {
    const startSeconds = fromS(start, "hh:mm:ss");


    console.log("workerClient grr", workerClient);
    
    workerClient.runCommand(
      `-ss ${startSeconds} -c copy -t ${length} sliced-output.mp4`
    );

    /*
    workerClient.convertInputFileToArrayBuffer().then(arrayBuffer => {
      while (!workerClient.workerIsReady) {}
      const filename = `video-${Date.now()}.mp4`;
      console.log("filename", filename);

      const inputCommand = `-ss ${startSeconds} -t ${length} -i ${filename} -vcodec copy -acodec copy sliced-output.mp4`;
      console.log(`trim`, inputCommand);

   //   const inputCommand = `-i ${filename} ${command}`;
      workerClient.worker.postMessage({
        type: "command",
        arguments: inputCommand.split(" "),
        files: [
          {
            data: new Uint8Array(arrayBuffer),
            name: filename
          }
        ],
        totalMemory: 33554432
      });
    });*/

    
  };

  optimizeVideo = () => {
    workerClient.runCommand(
      `-strict -2 -vcodec libx264 -crf 23 output.mp4`,
      253554432
    );
  };
  _videoData = {};
  _videoFile = null;
  optimizedVideo = false;
  /**
   * @type {ArrayBuffer}
   */
  _videoBuffer = {};

  readAsArrayBuffer = async () => {
	  
	
	console.log("readAsArrayBuffer  ", this._videoFile);
    this._videoBuffer = await readArrayBuffer(this._videoFile);
    return this.videoBuffer;
  };

  /**
   * @returns {Blob}
   * @returns {String}
   */
  convertBufferToBlob = buffer => {
    let blob = null;
    buffer = buffer || this.videoBuffer;
    if (buffer.byteLength) {
      blob = arrayBufferToBlob(buffer);
    }
    return blob;
  };

  /**
   * @returns {File}
   */
  readAsDataURL = async (buffer, blob) => {
    buffer = buffer || this.videoBuffer;
    blob = blob || this.convertBufferToBlob(buffer);
    let dataURL = null;
    if (blob) {
      dataURL = await readDataURL(blob);
    }
    return dataURL;
  };

  set videoFile(file) {
    console.log("videoFile");

    if (file && file.type) {
      workerClient.inputFile = file;
    }
    this._videoFile = file;
  }

  get videoFile() {
    return this._videoFile;
  }

  get duration() {
    return this._videoData.duration || 0;
  }

  get videoData() {
    return this._videoData;
  }
  get videoBuffer() {
    return this._videoBuffer;
  }

  decode = async file => {
    this.videoFile = file;
    this.emit("processingFile");
	console.log("processing  ", file);
    // Read File As ArrayBuffer
    const arrayBuffer = await this.readAsArrayBuffer();
    // convert to dataURL
    const dataURL = await this.readAsDataURL(arrayBuffer);

    let videoObjectUrl = URL.createObjectURL(this.videoFile);
    let video = document.createElement("video");
    video.src = videoObjectUrl;
    while (
      (video.duration === Infinity || isNaN(video.duration)) &&
      video.readyState < 2
    ) {
      await new Promise(r => setTimeout(r, 1000));
      video.currentTime = 10000000 * Math.random();
    }
    this._videoData = video;
    this.emit("processedFile");
    return { dataURL, arrayBuffer, blob: this.convertBufferToBlob() };
  };

  generateBufferChunks = (arrayBuffer = []) => {
    return new Promise((resolve, reject) => {
      try {
        let chunks = [];
        arrayBuffer = arrayBuffer.byteLength ? arrayBuffer : this.videoBuffer;
        const typedBuffer = new Uint8Array(arrayBuffer);
        const microSec = 1000 * 60;
        let startChunk = 0;
        for (let i = microSec; i < typedBuffer.byteLength; i += microSec) {
          const _buffer = arrayBuffer.slice(startChunk, i);
          chunks.push(_buffer);
          startChunk = i;
        }
        resolve(chunks);
      } catch (e) {
        reject(e);
      }
    });
  };
  extractFramesFromVideo = (fps = 25) => {
    return new Promise(async (resolve, reject) => {
      try {
        this.emit("extractingFrames");
        let video = this._videoData;
        let seekResolve;
        video.addEventListener("seeked", async function() {
          if (seekResolve) seekResolve();
        });
        let duration = video.duration;

        let canvas = document.createElement("canvas");
        let context = canvas.getContext("2d");
        let [w, h] = [video.videoWidth, video.videoHeight];
        canvas.width = w;
        canvas.height = h;
        let frames = [];
        let interval = 125 / fps;
        let currentTime = 0;

        while (currentTime < duration) {
          video.currentTime = currentTime;
          await new Promise(r => (seekResolve = r));

          context.drawImage(video, 0, 0, w, h);
          let base64ImageData = canvas.toDataURL();
          frames.push(base64ImageData);

          currentTime += interval;
        }
        this.emit("extractedFrames");
        resolve(frames);
      } catch (e) {
        reject(e);
      }
    });
  };
}

export default WebVideo;
