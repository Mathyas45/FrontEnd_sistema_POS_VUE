<script setup>
import pages2 from '@images/pages/2.png'
import avatar1 from '@images/avatars/avatar-1.png'
import avatar2 from '@images/avatars/avatar-2.png'
import avatar3 from '@images/avatars/avatar-3.png'
import avatar4 from '@images/avatars/avatar-4.png'

const avatars = [
  avatar1,
  avatar2,
  avatar3,
  avatar4,
]
    
</script>
<template>
    <div>
        <p>Lista de productos</p>
        <VRow>
            <VCol
                cols="12"
                sm="6"
                md="4"
                >
                <VCard>
                    <VImg :src="pages2" />

                    <VCardText class="position-relative">
                    <!-- User Avatar -->
                    <VAvatar
                        size="75"
                        class="avatar-center"
                        :image="avatar1"
                    />

                    <!-- Title, Subtitle & Action Button -->
                    <div class="d-flex justify-space-between flex-wrap pt-8">
                        <div class="me-2 mb-2">
                        <VCardTitle class="pa-0">
                            Robert Meyer
                        </VCardTitle>
                        <VCardSubtitle class="text-caption pa-0">
                            London, UK
                        </VCardSubtitle>
                        </div>
                        <VBtn>send request</VBtn>
                    </div>

                    <!--  Mutual Friends -->
                    <div class="d-flex justify-space-between align-center mt-8">
                        <span class="font-weight-medium">18 mutual friends</span>

                        <div class="v-avatar-group">
                        <VAvatar
                            v-for="avatar in avatars"
                            :key="avatar"
                            :image="avatar"
                            size="40"
                        />
                        </div>
                    </div>
                    </VCardText>
                </VCard>
            </VCol>
        </VRow>
        <br>
        <VAlert color="error">
        I'm an alert with error background color.
        </VAlert>


    </div>
</template>