<template>
    <div>
        <TransitionGroup name="list" tag="div">
            <div v-for="item in data.flavours" :key="item">
                <div style="background: aliceblue">
                    <h1>{{item.name}}</h1>
                    <button @click="incCount(item.name)">{{item.name}} - count: {{item.count}}</button>
                </div>
                
            </div>
        </TransitionGroup>
    </div>
</template>

<script>
import { ref } from 'vue';
export default{
    name: 'Test',
    setup() {
        // const flavours = ref([
        //         {
        //             name: "Sirsak",
        //             count: 0
        //         },
        //         {
        //             name: "Leci",
        //             count: 0
        //         }
        // ])

        const data = ref({
            totalCount: 0,
            flavours: [
                {
                    name: "Sirsak",
                    count: 0
                },
                {
                    name: "Leci",
                    count: 0
                }
            ]
        })

        const shuffle2 = () => {
            data.value.flavours.sort((a, b) => b.count - a.count)
        }

        const incCount = (name) =>{
            const chosen = data.value.flavours.find(e => e.name === name);

            chosen.count++;

            shuffle2();
        }


        return {data, incCount }
    }
}
</script>

<style>

    .list-move {
        transition: all 0.5s;
        transform: rotate(-90deg);
    }
</style>

