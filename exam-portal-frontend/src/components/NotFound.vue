<template>
    <div class="not-found">
        <div class="message pa-4 red--text">
            <h1 class="mb-4 text-h4">Page Not Found</h1>

            <p>Sorry about that.</p>

            <v-btn color="white" outlined :to="{ name: 'Site' }">
                <v-icon left>mdi-home</v-icon>

                <span>Go Home</span>
            </v-btn>
        </div>

        <v-img
            width="100%"
            height="100vh"
            src="@/assets/logo-background.jpg"
        ></v-img>
    </div>
</template>

<script>
export default {
    name: 'NotFound',

    metaInfo: {
        title: 'Not Found - NZPMC',
    },
}
</script>

<style scoped>
.message {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
    box-shadow: inset 0px 360px 240px -240px black;
}
</style>
