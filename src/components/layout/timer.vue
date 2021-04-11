<template>
  <div id="timer">
    <span style="position: absolute;
    bottom: 0;
    left: 0;">Time {{displayMinute}}:{{displaySecond}} Difficult: {{difficult}}</span>
  </div>
</template>

<script>
export default {
  name: "timer",
  props:{
    startApp:Boolean,
    
  },

  data() {
    return {
      difficult: 1,
      Minute: 0,
      Second: 15,
      displayMinute: "00",
      displaySecond: "00",
      test:true,
      isEnd: false,
      all:700,
      stage:0,
    };
  },
  methods: {},
  mounted() {
    this.stage = this.all / 7
    setInterval(() => {
      
      //console.log(this.Second)
      if(this.startApp ){
        if(this.all > 0 ){
          this.all--
          this.Second = this.all%60
          this.Minute = parseInt(this.all/60)


          if(this.Second < 10){
            this.displaySecond = "0"+this.Second
          }
          else{
            this.displaySecond = this.Second
          }
          if(this.Minute < 10){
            this.displayMinute = "0"+this.Minute
          }
          else{
            this.displayMinute = this.Minute
          }
        }
        else{
          this.isEnd = true;
          this.$emit("takeEnd",this.isEnd)
        }

        //Check for difficult
        if(this.all % this.stage == 0 ){
          this.difficult +=1;
          console.log("Level up");
          this.$emit('takeDifficult',this.difficult)
        }
      }
    }, 1000);
  },
};
</script>

<style></style>
