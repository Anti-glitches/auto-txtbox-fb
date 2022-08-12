<template>
  <div>
    <p>{{ loadingMsg }} | # of update: {{count}}</p>
    <p>{{message}}</p>
    <textarea v-model="message" placeholder="add multiple lines"></textarea>
  </div>
</template>
<script>
  import { ref, onMounted } from 'vue'
  import { db } from './firebase/config'
  import {
    onSnapshot,doc, updateDoc,
  } from "firebase/firestore"; 

  export default {
    name: 'App',
    setup() {
      const message = ref('');
      const loadingMsg = ref('saved');
      const stilType = ref(false);
      const count = ref(0);
      
      onMounted(async ()=>{
        await onSnapshot(doc(db, "textarea", "Dkp7Ih7k3GALI1QAkCyl"), (doc) => {
          // ⭐⭐⭐ Don't worry if it called multiple times
          console.log("Current data: ", doc.data());

          message.value = doc.data().msgData;
          count.value++;
        });
      })

      return { message, loadingMsg, stilType, count }
    },
    watch:{
      message(newM, oldM){
        if(newM != oldM){
          this.loadingMsg = 'Loading...'

          let temp = this.message;

          console.log('typing')
          
          setTimeout(async ()=>{
            if(temp === this.message){ //temp and message will be diff after 2 sec
              await updateDoc(doc(db, "textarea", "Dkp7Ih7k3GALI1QAkCyl"), {
                msgData: this.message
              });
              this.loadingMsg = "Your data is Saved"
              console.log('done')
            }
          }, 5000);
        }
      }
    }
  }
</script>

<style scoped>
  div>textarea{
    height: 400px;
    width: 400px;
  }

  div>p{
    white-space: pre-line;
  }
</style>
