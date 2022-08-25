<template>
    <div>
        Auth
    </div>
    <div>
        <h1>Register</h1>
        <form @submit.prevent="handleClick">
            <p>First Name:</p>
            <input type="text" placeholder="First Name" required v-model="firstName">
            <p>Last Name:</p>
            <input type="text" placeholder="Last Name" required v-model="lastName">
            <p>Age:</p>
            <input type="number" min="0" max="100" required v-model="age">
            <p>Email:</p>
            <input type="email" placeholder="email" v-model="email" required>
            <p>Password:</p>
            <input type="password" placeholder="password" v-model="password" required>
            <button>Submit</button>            
        </form>
        <hr>
    </div>
    <div>
        <h1>Login</h1>
        <form @submit.prevent="handleLogin">
            <p>Email:</p>
            <input type="email" v-model="email" required>
            <p>Password:</p>
            <input type="password" v-model="password" required>
            <button>Login</button>
        </form>
    </div>
    <div>
        <h1>logout</h1>
        <button @click="handleSignout">Sign Out</button>
    </div>
    <!-- <div v-if="fbData">
        <h1>Info here: </h1>
        <p>{{fbData != null ? fbData : "No Data"}}</p>
    </div> -->
</template>
<script>
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { ref, onMounted } from 'vue'
import { doc, setDoc, getDoc } from "firebase/firestore"; 
import {db} from '../firebase/config'

export default {
    name: "Auth",
    setup() {
        const auth = getAuth();
        const email = ref();
        const password = ref();
        const firstName = ref();
        const lastName = ref();
        const age = ref();
        const fbData = ref(null);

        const handleClick = ()=>{
            createUserWithEmailAndPassword(auth, email.value, password.value)
                .then((userCredential)=>{

                    setDoc(doc(db, "users", userCredential.user.uid), {
                        "first name": firstName.value,
                        "last name": lastName.value,
                        "email": email.value,
                        "age": age.value
                    })

                    email.value = password.value = firstName.value = lastName.value = age.value = ""
                })
                .catch((err)=>{
                    console.log(err)
                })
        }

        const handleLogin = ()=>{
            signInWithEmailAndPassword(auth, email.value, password.value)
                .then((userCredential)=>{
                    console.log("you are logged in", userCredential)

                    getDoc(doc(db, "users", userCredential.user.uid))
                        .then((doc)=>{
                            console.log(doc.id, "=>", doc.data())

                            fbData.value = {...doc.data(), id: doc.id}
                        }).catch(err=>{
                            console.log(err)
                        })

                    email.value = password.value = ""
                    window.location.reload();
                }).catch(err=>{
                    console.log(err);
                })

        }

        const handleSignout = () =>{
            signOut(auth).then(() => {
                console.log("Nice your are out")
                fbData.value = null;
                window.location.reload();
            }).catch((error) => {
                console.log(error)
            });
        }

        //get Data
        const getData = () =>{

            if(auth.currentUser != null)
                getDoc(doc(db, "users", auth.currentUser.uid))
                    .then((doc) => {
                        console.log(doc.id, "=>", doc.data())

                        fbData.value = { ...doc.data(), id: doc.id }
                    }).catch(err => {
                        console.log(err)
                    })
        }

        onMounted(()=>{
            setTimeout(getData, 1000);
        })


        return { 
            email, password, firstName, 
            lastName, age, handleClick, 
            handleSignout, handleLogin,
            fbData, getData
        }
    }
}
</script>
<style lang="">
    
</style>