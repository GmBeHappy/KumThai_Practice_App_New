<template>
    <div id="Table">
        <div>
            <form @submit.prevent="handleSubmit">
                <label class="Font001">Enter Word :  </label>
                <input type="text"  v-model="Form.name" class="Font001" placeholder="insert word..">
                <br> 
                <label class="Font001" >Enter Path : </label>
                <input type="text"  v-model="Form.phone" class="Font001" placeholder="insert path.."> 
                <br>
                <button class="button001">Submit</button>
            </form>
        </div>
        <div class="tbl-header">
             <table  cellpadding="0" cellspacing="0" border="0">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Phone</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="people in peopleArray" :key="people.id"  >
                        <td>{{people.name}}</td>
                        <td>{{people.phone}}</td>   
                    </tr>
                </tbody>
            </table>
            <div></div>
        </div>
       

    </div>
  
</template>

<script>
import json from "@/assets/letter/letter.json";

export default {
    name: "Table",
    props:{
    },
    data() {
        return {
            letter:json.letters,
            Form:{
                name:'',
                phone:'',
            }
        }
    },
    methods: {
        addData(){
            this.letter.router.push()
        },
        handleSubmit(){
            const lastID = this.peopleArray.length;
            const id = lastID + 1;
            const newPeopleArray =  {...this.Form , id};
            this.peopleArray = [...this.peopleArray,newPeopleArray]
            this.Form.name = '',
            this.Form.phone = ''
            
        }
    },

}
</script>

<style>
    

</style>