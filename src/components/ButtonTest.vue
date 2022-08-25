<template lang="">
    <div v-if="!completed && completed != null">
        <div>
            <h1>{{date}}</h1>
            <p>{{count}} | {{completed}}</p>
            <button @click="handleClick">Add Count</button>
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
    </div>

</template>
<script>
import { onMounted, ref } from 'vue';
import { db } from '../firebase/config'
import {
    onSnapshot, doc, updateDoc,
    query, collection, where, addDoc
} from 'firebase/firestore'

export default {
    name: "ButtonTest",
    setup() {
        const count = ref(0);
        const completed = ref(null);
        const date = ref(null);
        let id = '';

        const start = async ()=>{
            await addDoc(collection(db, "buttonData"),{
                countFb: 0,
                completed: false,
                date: new Date()
            })
        }

        onMounted(async () => {
            const q = query(collection(db, "buttonData"), where("completed", "==", false));

            await onSnapshot(q, (querySnapshot)=>{
                querySnapshot.forEach((doc) => {
                    console.log("Current data: ",doc.id, doc.data());

                    count.value = doc.data().countFb
                    completed.value = doc.data().completed
                    id = doc.id
                    date.value = doc.data().date
                    console.log("Ref data: ", count.value, completed.value);
                })
            })

            // await onSnapshot(doc(db, 'buttonData', 'J58VTABVvuqxuy64Q0Wp'), (doc)=>{
            //     console.log("Current data: ", doc.data());

            //     count.value = doc.data().countFb
            //     completed.value = doc.data().completed
            // })
        })

        const handleClick = async ()=>{
            await updateDoc(doc(db, "buttonData", id), {
                countFb: count.value + 1
            });
        }

        const shutdown = async ()=>{
            await updateDoc(doc(db, "buttonData", id), {
                completed: true
            }); 
            completed.value = true;

            console.log('ended | comleted', completed.value)
        }

        return {count, completed, date, handleClick, shutdown, start}
    }
}
</script>
<style lang="">
    
</style>