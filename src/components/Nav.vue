<template>
    <div class="nav">
        <div>
            <p>Navbar</p>
            <router-link to="/">Home</router-link>
            <router-link to="/profile">Profile</router-link>
            <router-link to="/test">Test</router-link>
        </div>
        <div v-if="fbData">
            <h3>{{fbData["first name"] + fbData["last name"]}} </h3>
        </div>
        <div v-else>
            No User
        </div>
    </div>
    <hr>
</template>
<script>
import { getAuth } from "firebase/auth";
import { ref, onMounted, onUpdated } from 'vue'
import { doc, getDoc } from "firebase/firestore";
import { db } from '../firebase/config'

export default {
    name: "Nav",
    setup() {
        const auth = getAuth();

        const fbData = ref(null);

        const getData = () => {
            if (auth.currentUser != null)
                getDoc(doc(db, "users", auth.currentUser.uid))
                    .then((doc) => {
                        console.log(doc.id, "=>", doc.data())

                        fbData.value = { ...doc.data(), id: doc.id }
                    }).catch(err => {
                        console.log(err)
                    })
        }

        onMounted(()=>{
            setTimeout(getData, 1000)
        })

        return {fbData}
    }
}
</script>
<style>
    .nav{
        display: flex;
        justify-content: space-between;
    }
</style>