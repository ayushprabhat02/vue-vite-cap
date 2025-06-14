<!-- <script setup lang="ts">
import { onMounted, ref } from 'vue'
import BackgroundGeolocation from 'cordova-background-geolocation-lt'

const location = ref<{ lat: number; lon: number } | null>(null)
const lastFetchTime = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

const startNativeTracking = () => {
    BackgroundGeolocation.onLocation(locationData => {
        const coords = locationData.coords
        location.value = {
            lat: coords.latitude,
            lon: coords.longitude,
        }
        lastFetchTime.value = new Date().toLocaleTimeString()
        console.log('📍 [Native] Location:', location.value)
    }, error => {
        errorMessage.value = error.message
        console.error('[BGGeo] Location error:', error)
    })

    BackgroundGeolocation.ready({
        desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
        distanceFilter: 10,
        stopOnTerminate: false,
        startOnBoot: true,
        debug: false,
        logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
        enableHeadless: true
    }, state => {
        if (!state.enabled) {
            BackgroundGeolocation.start(() => {
                console.log('[BGGeo] Tracking started')
            })
        }
    })
}


onMounted(() => {
    startNativeTracking()
})
</script> -->

<template>
    <div>
        <h1>Geolocation</h1>
        <p>Your location is:</p>
        <p>Latitude: {{ loc.lat }}</p>
        <p>Longitude: {{ loc.long }}</p>

        <button @click="getCurrentPosition">
            Get Current Location
        </button>
    </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { Geolocation } from '@capacitor/geolocation';
export default defineComponent({
    setup() {
        const loc = ref < {
            lat: null | number;
            long: null | number;
        } > ({
            lat: null,
            long: null,
        });

        const getCurrentPosition = async () => {
            const pos = await Geolocation.getCurrentPosition();
            loc.value = {
                lat: pos.coords.latitude,
                long: pos.coords.longitude,
            };
        };
        return { getCurrentPosition, loc };
    },
});
</script>
