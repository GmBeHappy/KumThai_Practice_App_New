<template>
  <div>
    <!-- When in naming State -->
    <div v-if="state === 'nameState'">
        <div class="inputbody">
            <input class="c-checkbox" type="checkbox" id="checkbox">
            <div class="c-formContainer">
                <form class="c-form" action="">
                    <input  v-model="studentName" class="c-form__input" placeholder="Insert name" type="email" pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$" required>
                    <label class="c-form__buttonLabel" for="checkbox">
                      <div class="learn-more">
                        <button @click="studentName ? startState() : ''" class="learn-more" type="button">Start</button>
                      </div>
                    </label>
                    <label class="c-form__toggle" for="checkbox" data-title="PLAY"></label>
                </form>
            </div>
        </div>
    </div>

    <!-- When in running State -->
    <div v-if="state === 'runState'"> 
        <div>
            <timer @takeEnd="takeEnd" @takeDifficult="takeDifficult"  v-bind:start-app="startApp" />
        </div>
        <!-- display Real text -->
        <div v-bind:style="styleObject">
          
            <div id="para" style="display: inline; top: 0px; width: 100% ;  "></div>
        </div>
        <!-- display Temp text -->
        <div style="text-align: center; position:relative" >
            <div v-if="!isPlay">
              <p id="plus" style="display: inline ; top: 0px; width: 100%"></p>
            </div>
            <div id="tempText" style="display: inline ; top: 0px; width: 100%"></div> 
        </div>
        
        
        
        <div v-if="isRecord && !isPlay" style="position: relative; margin: 0 auto; text-align: center">
            <img class = "image-style" src="../public/microphone.svg" >
        </div>
    </div>

    <!-- When in end State -->
    <div v-if="state ==='endState'" >
        <p class="popout">
          <span>E</span><span>N</span><span>D</span><span>I</span><span>N</span><span>G</span>
        </p>
        <div class="wrap">
            
                <a href="#" class="underlined underlined--reverse">
                  "{{studentName}}" got {{this.score}}
                </a>
            
        </div>  
    </div>


  </div>
</template>

<script>
import json from  "@/assets/letter/level4.json";
import json2 from "@/assets/letter/level5.json";
import json3 from "@/assets/letter/level6.json";
import json4 from "@/assets/letter/level7.json";
import json5 from "@/assets/letter/level8.json";
import json6 from "@/assets/letter/level9.json";
import json7 from "@/assets/letter/level10.json";
import timer from "@/components/layout/timer.vue";
import Recorder from "./recorder";
import { convertTimeMMSS } from "./utils";

export default {
  name: "app",
  components: {
    timer,
  },

  props: {
    attempts: { type: Number },
    time: { type: Number },

    bitRate: { type: Number, default: 128 },
    sampleRate: { type: Number, default: 44100 },

    showDownloadButton: { type: Boolean, default: true },
    showUploadButton: { type: Boolean, default: true },

    micFailed: { type: Function },
    beforeRecording: { type: Function },
    pauseRecording: { type: Function },
    afterRecording: { type: Function },
    failedUpload: { type: Function },
    beforeUpload: { type: Function },
    successfulUpload: { type: Function },
    selectRecord: { type: Function },

    record: { type: Object },
    filename: { type: String },
  },

  data() {
    return {
      state: "nameState",
      studentName: '',
      myTrack: new Audio(),
      letter: json.level4,     //Import json file
      i: 0,                     //This integer for what number of alphabet in word              
      j: 0,                     //This integer for what number of word
      previusJ:0,
      thisString: [],           //this is a main string of word
      coloredString: [],        //this is a color string of word
      isStop: false,            //this boolean will turn to true when finish render 1 word
      isPlay: false,            //this boolean will turn to false when user press keyboard   
      isRecord: false,
      isEnd: false,
      arrayPool: [],            //Use to collect rendered word
      startApp:false,           //Boolean for sent data back to timer
      currentString: "",
      //Text style 
      fontSize:400,             //text size
      styleObject: {
        top: '50px',
        color: 'blue',
        position: 'fixed',
        left: '10px', 
      },

      // Sound recording variable
      recorder: this._initRecorder(),
      recordList: [],
      saveId: 0,

      score:0,
      isLevelChange: false,
      presentLevel: 1
    };
  },

  methods: {
    takeEnd(value){
        this.isEnd = value;
        this.state = "endState"
    },
    takeDifficult(value){
        this.difficult = value;
        console.log(this.difficult)
    },

    //To get random number from word pool
    random(min,max,arrayPool) {
    var i = Math.floor(Math.random()*(max-min))+min;
      for (let j = 0 ; j < arrayPool.length ; ){
          if(i === arrayPool[j]){
              i = Math.floor(Math.random()*(max-min))+min;
              j = 0;
          }
          else{
              j++;
          }
          
      }
      arrayPool.push(i);
      return i;
    },
    // calculate percentage
    percent(input , percent){
      return input*percent/100
    },
    //Core function
    playSound() {
      this.makeString();
      if (this.letter[this.j][this.i].source !== "") {            //If there have source in file
        this.isPlay = true;
        this.isStop = false;
        this.myTrack = new Audio();
        this.myTrack.src = this.letter[this.j][this.i].source;    //path
        this.myTrack.play();
        this.myTrack.addEventListener(                            //when *1* alphabet ended
          "ended",
          function() {
            this.i++;
            if (this.i > this.letter[this.j].length - 1) {        //If end of 1 word 
              this.i = 0;
              this.thisString = [];                               //Reset both string and color
              this.coloredString = [];
              this.isPlay = false;
              this.isStop = true;
              console.log(this.currentString)
              console.log(this.arrayPool)
            }
            if (!this.isStop) {
              setTimeout(()=>{
                this.playSound();
              },500)
            }
          }.bind(this)
        );
      } 
      else {
        this.i++;
        if (!this.isStop) this.playSound();
      }
    },
    makeTempString(){
      var tempText = document.getElementById("tempText");
      var invisString = [];
      var lastInvis = [];
      //******This for invisiblestring*******
      for(let i = 0 ; i< this.letter[this.j].length ; i++){     //making array of invisible string
        if (this.letter[this.j][i].swap === "0") {            
          if (this.letter[this.j][i].char !== "") {
            invisString.push(this.letter[this.j][i].char);
          }
        } 
        else if (this.letter[this.j][i].swap !== "0") {
          if (this.letter[this.j][i].char !== "") {
            invisString = this.swap(
              invisString,
              this.letter[this.j][i].char,
              this.letter[this.j][i].swap
            );
            
          }
        }
      }
      for (let index = 0; index < invisString.length; index++) {    //makeing array of html text 
        
          let lastInvis1 =
            "<strong class='strongID'  style='font-size:"+(this.percent(this.fontSize , 100.5 )) +"px; opacity:0% ; font-weight: 401 !important; color: " +
            this.coloredString[index] +
            ";'>" +
            invisString[index] +
            "</strong>";
          lastInvis.push(lastInvis1);
        
      }
      tempText.innerHTML = lastInvis.join("")
      this.currentString = invisString.join("")
        this.styleObject.left = tempText.offsetLeft + "px"
        

    },
    
    //main fucntion for makeing string
    makeString: function() {
      var para = document.getElementById("para");
      
      //******This for RealString*******
      var lastString = [];
      if (this.letter[this.j][this.i].swap === "0") {
        if (this.letter[this.j][this.i].char !== "") {
          this.thisString.push(this.letter[this.j][this.i].char);
          this.coloredString.push(this.letter[this.j][this.i].color);
        }
      } else if (this.letter[this.j][this.i].swap !== "0") {
        if (this.letter[this.j][this.i].char !== "") {
          this.thisString = this.swap(
            this.thisString,
            this.letter[this.j][this.i].char,
            this.letter[this.j][this.i].swap
          );
          this.coloredString = this.swap(
            this.coloredString,
            this.letter[this.j][this.i].color,
            this.letter[this.j][this.i].swap
          );
        }
      }
      for (let index = 0; index < this.thisString.length; index++) {
        if (this.coloredString[index] == "blue") {
            if(this.thisString[index-1] === 'ั' ||this.thisString[index-1] === 'ิ'||this.thisString[index-1] === 'ี'||this.thisString[index-1] === 'ึ'  || this.thisString[index-1] === 'ื'){
              let lastStrings =
              "<sup class='supID' style='font-size:"+(this.percent(this.fontSize , 85 )) +"px; color: " +
              this.coloredString[index] +
              ";  '>" +
              this.thisString[index] +
              "</sup>";
              lastString.push(lastStrings);
            }
            else{
              let lastStrings =
              "<b class='bID' style='font-size:"+(this.percent(this.fontSize , 96.25 )) +"px; color: " +
              this.coloredString[index] +
              "; font-weight: 389 ;'>" +
              this.thisString[index] +
              "</b>";
              lastString.push(lastStrings);
            }
          
        } 
        else if (this.coloredString[index] == "green") {
          if( this.thisString[index] === 'ุ'             //สระอุ
          ||  this.thisString[index] === 'ู')             //สระอุ
          {
            let lastStrings =
              "<span class='spanID' style='font-size:"+(this.percent(this.fontSize , 75 )) +"px; color: " +
              this.coloredString[index] +
              ";'>" +
              this.thisString[index] +
              "</span>";
            lastString.push(lastStrings);
          }
          else if(this.thisString[index+1] === "ุ" || this.thisString[index+1] === "ู"
          || this.thisString[index+1] === "ิ" || this.thisString[index+1] === "ี"
          || this.thisString[index+1] === "ึ" || this.thisString[index+1] === "ื"
          || this.thisString[index+1] === "่" || this.thisString[index+1] === "้"
          || this.thisString[index+1] === "๊" || this.thisString[index+1] === "๋"
          ){
            let lastStrings =
              "<b style='font-size:"+(this.percent(this.fontSize , 100 )) +"px; color: " +
              this.coloredString[index] +
              ";'>" +
              this.thisString[index] +
              "</b>";
            lastString.push(lastStrings);
          }
          else{
            let lastStrings =
              "<b class='bID' style='font-size:"+(this.percent(this.fontSize , 100 )) +"px; color: " +
              this.coloredString[index] +
              ";'>" +
              this.thisString[index] +
              "</b>";
            lastString.push(lastStrings);
          }
        } 
        else {
          if(this.thisString[index+1] === "ุ" || this.thisString[index+1] === "ู"
          || this.thisString[index+1] === "ิ" || this.thisString[index+1] === "ี"
          || this.thisString[index+1] === "ึ" || this.thisString[index+1] === "ื"
          || this.thisString[index+1] === "่" || this.thisString[index+1] === "้"
          || this.thisString[index+1] === "๊" || this.thisString[index+1] === "๋"
          ){
            let lastStrings =
              "<strong class='strongID2' style='font-size:"+(this.percent(this.fontSize , 100.5 )) +"px; font-weight: 401 !important; color: " +
              this.coloredString[index] +
              ";'>" +
              this.thisString[index] +
              "</strong>";
            lastString.push(lastStrings);
          }
          else{
            let lastStrings =
              "<strong class='strongID' style='font-size:"+(this.percent(this.fontSize , 100.5 )) +"px; font-weight: 401 !important; color: " +
              this.coloredString[index] +
              ";'>" +
              this.thisString[index] +
              "</strong>";
            lastString.push(lastStrings);
            
          }
        }
      }
      para.innerHTML = lastString.join("");
    },
    //this function use to swap array of string
    swap(thisstring, character, num) {
      thisstring.splice(thisstring.length - num, 0, character);
      return thisstring;
    },
    runningFunction(){
      if(this.presentLevel != this.difficult){
        console.log("Level change reset array pool")
        this.arrayPool=[];
        this.presentLevel = this.difficult;
      }
      if(this.difficult == 1){
        this.letter = json.level4;
      }
      else if(this.difficult == 2){
        this.letter = json2.level5;
      }
      else if(this.difficult == 3){
        this.letter = json3.level6;
      }
      else if(this.difficult == 4){
        this.letter = json4.level7;
      }
      else if(this.difficult == 5){
        this.letter = json5.level8;
      }
      else if(this.difficult == 6){
        this.letter = json6.level9;
      }
      else if(this.difficult == 7){
        this.letter = json7.level10;
      }

      if(this.state === 'endState'){
        var para = document.getElementById("endScore");
        para.innerHTML = "sads";
      }
      if(!this.startApp) this.startApp = true //To return that game start
            if(this.isRecord === true){
              this.isRecord = false;
            }
            if(!this.isPlay){
              var para = document.getElementById("plus");
              var para2 = document.getElementById("para");
              var para3 = document.getElementById("tempText");
              this.thisString = []  
              this.coloredString= [],
              para.innerHTML = "<p style='font-size:"+ (this.percent(this.fontSize, 120))+"px ;color:black ;'>+</p>";
              para2.innerHTML = "";
              para3.innerHTML = "";
              this.j= this.random(0,this.letter.length,this.arrayPool)
              this.previusJ = this.j
            setTimeout(()=>{
            if (!this.isPlay) {
                this.makeTempString()
                this.playSound();
              }
            },2000)
            }
    },
    turnRecord(){
      if(!this.isPlay && this.isRecord === false){
            this.isRecord = true;
            console.log("toggleRecorder");
            if (this.attempts && this.recorder.records.length >= this.attempts) {
              return;
            }

            if (!this.isRecording) {
              this.recorder.start();
            }
        }
    },
    startState(){
      this.state = 'runState' ; 
      setTimeout(()=>{
            // this.turnRecord() ; 
            this.runningFunction();
            },100)
      
    },
    stopRecorder(filename) {
      console.log("stopRecorder");
      if (!this.isRecording) {
        return;
      }

      this.recorder.stop();
      this.recordList = this.recorder.recordList();
      const blob = this.recorder.recordList()[this.saveId].blob
      // // save file to desktop.
      window.saveBlob(blob, filename,this.studentName);
      console.log(this.recorder.recordList()[this.saveId].url);
      this.isComplete = true;
      this.saveId++;
      this.score++;
    },
    _initRecorder() {
      return new Recorder({
        beforeRecording: this.beforeRecording,
        afterRecording: this.afterRecording,
        pauseRecording: this.pauseRecording,
        micFailed: this.micFailed,
        bitRate: this.bitRate,
        sampleRate: this.sampleRate,
        format: this.format,
      });
    }
  },
  mounted: function() {

    //When app in name state
    window.addEventListener("keypress", (event) => {
      
      console.log(this.state)
      if(this.state === 'nameState'){
        if(event.code === 'Enter')
        this.startState();
      }
      else if(this.state === 'runState'){
        if(event.code === 'Space'){
          this.turnRecord()
        } 
      }
      else if(this.state === 'endState'){

      }

    });
    
      //add event when user interact with keyboard
    window.addEventListener("keyup", (event) => {
      console.log(event.code)
      //When in nameState
      if(this.state === 'nameState'){

      }
      //When in runningState
      else if(this.state === 'runState' ){     
                        
          if(event.code === 'KeyR'){
            if(!this.isPlay){      
              this.j = this.previusJ
              this.playSound();
            }
          }
          if(event.code === 'Space' ){
            this.stopRecorder(this.currentString);
            this.runningFunction();
          }
      }
      //When in endState
      else if(this.state === 'endState'){

      }
    });
    
    
  },
  computed: {
    attemptsLeft() {
      return this.attempts - this.recordList.length;
    },
    iconButtonType() {
      return this.isRecording && this.isPause
        ? "mic"
        : this.isRecording
        ? "pause"
        : "mic";
    },
    isPause() {
      return this.recorder.isPause;
    },
    isRecording() {
      return this.recorder.isRecording;
    },
    recordedTime() {
      if (this.time && this.recorder.duration >= this.time * 60) {
        this.stopRecorder();
      }
      return convertTimeMMSS(this.recorder.duration);
    },
    volume() {
      return parseFloat(this.recorder.volume);
    },
  }
};
</script>

<style >
@import url('https://fonts.googleapis.com/css2?family=Sarabun&display=swap');
@import 'style1.css';
.image_style{
  position: fixed;
  width: 20%;
  display: block;
  margin-left: auto;
  margin-right: auto;
  color: rebeccapurple;
  
}

* {
  padding: 0;
  margin: 0;
  
  font-family: 'Sarabun', sans-serif;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1080px;
  border: 3px solid green; 
}

.image-style{
  position: fixed;
  top: 85%;
  left: 50%;
  width: 10%;
  height: auto;
  transform: translate(-50%, -50%);
}

b{
  
  font-weight: 399 !important;
}
strong.strongID{
  letter-spacing: 40px;
}
strong.strongID2{
  letter-spacing: 0px;
}
span.spanID{
letter-spacing: 40px;
}
b.bID{
letter-spacing: 40px;
}
sup.supID{
  letter-spacing: 40px;
}


</style>
