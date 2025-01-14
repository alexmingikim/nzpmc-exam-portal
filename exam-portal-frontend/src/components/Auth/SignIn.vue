<template>
    <v-form
        v-model="valid"
        class="auth-sign-in"
        :disabled="loading || !!success"
        @submit="signIn"
    >
        <AuthHeader
            title="Sign In"
            :text="`Hello, ${email}.`"
            show-back
            @back="$emit('go', 'Email')"
        />

        <div class="pb-4 px-4">
            <v-text-field
                label="Email"
                :value="email"
                type="email"
                autocomplete="username"
                hide-details="auto"
                class="mb-4"
                disabled
            ></v-text-field>

            <v-text-field
                v-model="password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                label="Password"
                :rules="[(v) => !!v || 'This is required']"
                required
                autofocus
                hide-details="auto"
                @click:append="showPassword = !showPassword"
            ></v-text-field>
        </div>

        <v-expand-transition>
            <v-alert v-if="error" type="error" dismissible class="mx-4">
                {{ error }}
            </v-alert>
        </v-expand-transition>

        <v-expand-transition>
            <v-alert v-if="success" type="success" class="mx-4">
                {{ success }}
            </v-alert>
        </v-expand-transition>

        <div class="align-center d-flex justify-space-between pb-4 px-4">
            <v-btn
                small
                text
                :disabled="!!success"
                @click="$emit('go', 'ForgotPassword')"
            >
                Forgot password?
            </v-btn>

            <v-btn
                color="primary"
                type="submit"
                :disabled="!valid || loading || !!success"
                :loading="loading"
            >
                <v-icon left dark>mdi-login</v-icon>

                Sign In
            </v-btn>
        </div>
    </v-form>
</template>

<script>
import { auth } from '@/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import AuthHeader from './Header'

export default {
    name: 'AuthSignIn',

    metaInfo: {
        title: 'Sign In',
    },

    components: { AuthHeader },

    props: {
        email: {
            type: String,
            required: true,
        },
    },

    data() {
        return {
            // Form
            valid: true,
            loading: false,
            error: null,
            success: null,

            password: '',
            showPassword: false,
        }
    },

    methods: {
        // Submit the sign in form
        signIn(e) {
            e.preventDefault()

            // Determine if account exists
            this.loading = true
            this.error = null

            signInWithEmailAndPassword(auth, this.email, this.password)
                .then(() => {
                    // Success
                    this.success = 'Successfully signed in.'
                })
                .catch((error) => {
                    // An error occurred
                    switch (error.code) {
                        case 'auth/user-not-found':
                            this.error =
                                'No account with this email address exists.'
                            break
                        case 'auth/user-disabled':
                            this.error = 'This account has been disabled.'
                            break
                        case 'auth/wrong-password':
                            this.error = 'The password is incorrect.'
                            break
                        default:
                            this.error = this.$errorMessage
                    }
                })
                .finally(() => {
                    // Clean up loading state
                    this.loading = false
                })
        },
    },
}
</script>
