<template>
<div>
    <form>
        <div>
            <label for="first_name)">firstname</label>
            <input type="text" name="first_name" v-model.trim="applicant.firstname" >
        </div>
        <div>
            <label for="last_name)">lastname</label>
            <input type="text" name="last_name" v-model.trim="applicant.lastname" >
        </div>
        <div v-bind:style="styleOfObject">
            <label for="sex"> male </label>
            <input type="radio" name="sex" v-model="applicant.sex">
            <label for="sex"> female </label>
            <input type="radio" name="sex" v-model="applicant.sex">
        </div>
       <button @click="clear()"> clear </button>
        
    </form>
     <div>
            <button @click="randomNum = random()"> press to random </button> 
            <span>random is {{randomNum}}</span>   
        </div>
</div> 
</template>

<script>

export default {
    name: "Form",
    data() {
        return {
            applicant:{
                firstname:"",
                lastname:"",
                sex:"male"
            },
            randomNum: 0,
            temp: 0,
            testarray:[],
            styleOfObject:{
                color: 'red',
                fontSize: '30px',
                fontFamily: 'tahoma',
                backgroundColor: 'white',
            }
            
        }
    },
    methods: {
        random(){
            this.temp = Math.floor(Math.random() * 10)
            return this.temp
            
            
        }
        
    },

}
</script>

<style>

</style>