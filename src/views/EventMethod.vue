<template>
  <div app="eventMethod">
    <h1 :class="
    error1"><center>This is main method</center></h1>
    <button @click="clickMe()">Click me</button>
    <button @click="clickMe2('Welcom to my house')">Click me</button>
    <h3>{{ getTimestamp() }}</h3>
    <div v-for="(item, index) in dataArray" :key="index">{{index}}. {{item}}</div>
    <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
  </div>
</template>

<script>
export default {
    name: "eventMethod",
    data() {
        return {
             dataArray:[
                "hi","fuck"
            ],
            firstname: "Piyachai",
            lastname: "kaewchum",
            error1: "error_template2",
        }
    },
    mounted() {
        this.initial()
    },
    methods: {
        initial(){
            console.log("innis")
        },
        clickMe(){
            alert("Hello")
        },
        clickMe2(message){
            alert(message)
        },
        getTimestamp(){
            return Date()
        },
    },
    computed: {
        fullname(){
            return this.firstname + this.lastname
        },
    },

}
</script>

<style>
</style>