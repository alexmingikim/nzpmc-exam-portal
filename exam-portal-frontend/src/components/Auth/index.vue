<template>
    <div
        class="align-center auth background--blue d-flex justify-center primary"
    >
        <v-sheet rounded elevation="2" max-width="100%" width="25rem">
            <router-link :to="{ path: 'Site' }" class="d-flex pa-4">
                <v-img src="@/assets/logo.svg" height="96" contain />
            </router-link>

            <v-divider />

            <div
                v-if="userLoading || user"
                class="align-center d-flex flex-wrap justify-center pa-4 text-center"
                style="gap: 1rem"
            >
                <v-progress-circular
                    indeterminate
                    color="primary"
                ></v-progress-circular>

                {{
                    userLoading
                        ? 'Loading authentication service...'
                        : 'Redirecting to the app...'
                }}
            </div>

            <div v-else>
                <AuthEmail
                    v-if="panel === 'Email'"
                    :email="email"
                    @go="go"
                    @update-email="(v) => (email = v)"
                />

                <AuthSignIn v-if="panel === 'SignIn'" :email="email" @go="go" />

                <AuthSignUp v-if="panel === 'SignUp'" :email="email" @go="go" />

                <AuthForgotPassword
                    v-if="panel === 'ForgotPassword'"
                    :email="email"
                    @go="go"
                />
            </div>
        </v-sheet>
    </div>
</template>

<script>
import { mapState } from 'pinia'
import { useMainStore } from '@/stores/main'
import AuthEmail from './Email'
import AuthSignIn from './SignIn'
import AuthSignUp from './SignUp'
import AuthForgotPassword from './ForgotPassword'

export default {
    name: 'Auth',

    metaInfo: {
        title: 'Authenticate',
        titleTemplate: '%s - NZPMC',
    },

    components: { AuthEmail, AuthSignIn, AuthSignUp, AuthForgotPassword },

    data() {
        return {
            email: this.$route.query.email ?? '',

            // Panel to display
            panel: 'Email',
        }
    },

    computed: {
        // Get state from Pinia store
        ...mapState(useMainStore, ['user', 'userLoading']),
    },

    watch: {
        // Navigate to app if the user is signed in
        user: {
            handler(v) {
                if (v)
                    this.$router.push(
                        this.$route.query.redirect ?? { name: 'App' },
                    )
            },

            immediate: true,
        },
    },

    methods: {
        // Change panel
        go(panel) {
            this.panel = panel
        },
    },
}
</script>
