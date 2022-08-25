<template>
    <h1>Card Box</h1>
    <div v-if="!data.completed && data.completed != null">
        <div>
            <h2>{{data.date.toDate()}}</h2>
            <h3>{{data.completed}} | Total count: {{data.totalCount}}</h3>
            <p>id: {{data.id}}</p>
            <hr>
            <!-- <button @click="getFlavours">Get Flavours</button> -->
            <div v-for="(flavour, i) in data.flavours" :key="i">
                <h4>{{flavour.name}}</h4>
                <button @click="tryUpdate(i)">count: {{flavour.count}}</button>
            </div>

            <!-- <button @click="handleClick">Add Count</button> -->
        </div>
        <div>
            <hr>
            <h1>Done</h1>
            <button @click="shutdown">Send completed data to FB</button>
        </div>
    </div>
    <div v-else>
        <h1>Start</h1>
        <button @click="start">New Data to FB</button>
        <hr>
        <button v-if="displayData.length === 0" @click="getDataDisplay">Get data</button>
        <div v-else>
            <p>Completed: {{displayP.completed}}</p>
            <p>total count: {{displayP.totalCount}}</p>
            <p v-for="(flavour, i) in displayP.flavours" :key="i">
                {{flavour.name}} - {{flavour.count}}
            </p>
            <select name="" id="" v-model="selected" @change="getSelectedData(selected)">
                <option value="" disabled selected>Please select</option>
                <option v-for="(d, i) in displayData" :key="i" :value="d.id">
                    {{ d.date.toDate() }}
                </option>
            </select>
            <button @click="getSelectedData(selected)">Display the selected data</button>
        </div>
    </div>

</template>
<script>
import { onMounted, ref } from 'vue';
import { db } from '../firebase/config'
import {
    onSnapshot, doc, updateDoc,
    query, collection, where, addDoc,
    orderBy
} from 'firebase/firestore'

import moment from 'moment'

export default {
    name: "ButtonTest",
    setup() {
        // const count = ref(0);
        // const completed = ref(null);
        // const date = ref(null);
        // let id = '';

        const data = ref({});

        const start = async () => {
            await addDoc(collection(db, "cardData"), {
                totalCount: 0,
                completed: false,
                date: new Date(),
                flavours: [
                    {
                        name: "Sirsak",
                        count: 0
                    },
                    {
                        name: "Leci",
                        count: 0
                    }
                ],
            })
        }

        onMounted(async () => {
            const q = query(collection(db, "cardData"), where("completed", "==", false));


            await onSnapshot(q, (querySnapshot) => {

                console.log(querySnapshot.size)

                if(querySnapshot.size === 0){
                    //reset data to empty
                    //might need to set value to null instead of empty obj
                    data.value = {}
                }
                querySnapshot.forEach((doc) => {
                    console.log("Current data: ", doc.id, doc.data());
                    
                    data.value.id = doc.id;
                    data.value.totalCount = doc.data().totalCount
                    data.value.completed = doc.data().completed
                    data.value.date = doc.data().date
                    data.value.flavours = doc.data().flavours
                })
                console.log(data.value)
            })
        })

        const handleClick = async () => {
            await updateDoc(doc(db, "cardData", id), {
                countFb: count.value + 1
            });
        }

        const tryUpdate = async (index) =>{
            //I don't like how I update data and then update it 
            //again onMounted() -> it is very unnecessary
            data.value.flavours[index].count++
            data.value.totalCount++

            await updateDoc(doc(db, "cardData", data.value.id), {
                "flavours": data.value.flavours,
                "totalCount": data.value.totalCount
            });
        }

        const shutdown = async () => {
            await updateDoc(doc(db, "cardData", data.value.id), {
                completed: true
            });
        }

        const displayData = ref([])
        const getDataDisplay = async () =>{
            const q = query(collection(db, "cardData"), orderBy("date", "desc"));

            await onSnapshot(q, (querySnapshot) => {
                let fbData = []

                querySnapshot.forEach((doc) => {
                    console.log("Current data: ", doc.id, doc.data());

                    fbData.push({...doc.data(),id: doc.id })
                })

                displayData.value = fbData;
                console.log(displayData.value)
                console.log(displayData.value[0].date.seconds)
            })
        }

        const dateFormat = (date)=>{
            return moment(date).format('MMMM Do YYYY, h:mm:ss a');
        }

        const selected = ref();
        const displayP = ref({});

        const getSelectedData = (id)=>{
            displayData.value.forEach((e)=>{
                if(e.id === id){
                    displayP.value = e
                }
            })
        }

        return { 
            data, handleClick, shutdown, start, 
            tryUpdate, getDataDisplay, displayData, dateFormat, 
            selected, getSelectedData, displayP
        }
    },
}
</script>
<style scoped>

    [v-cloak] {
        display: none;
    }
</style>