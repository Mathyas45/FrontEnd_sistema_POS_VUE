<script setup>
const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  roleSelected: {
    type: Object,
    required: true,
  },
});

const error_exits = ref(null);
const isLoading = ref(false);
const name = ref("");

const deleteRol = async () => {
  try {
    isLoading.value = true;
    const resp = await $api("roles/" + props.roleSelected.id, {
      method: "DELETE",
      onResponseError({ response }) {
        error_exits.value = response._data.error;
      },
    });

    emit("alert_success", "el rol se eliminó correctamente");
    emit("deleteRole", props.roleSelected);
    onFormReset();
  } catch (error) {
    console.log("Error:", error?.response?._data || error);
  } finally {
    isLoading.value = false;
  }
};
onMounted(() => {});
const emit = defineEmits([
  "deleteRole",
  "alert_success",
  "update:isDialogVisible",
]);

const onFormSubmit = () => {
  emit("update:isDialogVisible", false);
  emit("submit", userData.value);
};

const onFormReset = () => {
  emit("update:isDialogVisible", false);
};

const dialogVisibleUpdate = (val) => {
  emit("update:isDialogVisible", val);
};
</script>

<template>
  <VDialog
    max-width="400"
    :model-value="props.isDialogVisible"
    @update:model-value="dialogVisibleUpdate"
  >
    <VCard class="pa-sm-8 pa-3">
      <!-- 👉 dialog close btn -->
      <DialogCloseBtn variant="text" size="default" @click="onFormReset" />

      <VCardText class="pt-5">
        <div class="text-center pb-6">
          <h4 class="text-h4 mb-2">Eliminar Rol</h4>
        </div>

        <!-- 👉 Form -->
        <VForm class="mt-4" @submit.prevent="deleteRol">
          <VRow>
            <!-- 👉 First Name -->
            <VCol cols="12">
              <p>
                ¿Estas seguro de eliminar el Rol:
                <span class="text-danger font-weight-medium">{{
                  props.roleSelected.name
                }}</span>
              </p>
            </VCol>
            <VCol cols="12" class="d-flex flex-wrap justify-center gap-4">
              <VBtn
                :loading="isLoading"
                :disabled="isLoading"
                type="submit"
                color="error"
              >
                Eliminar
              </VBtn>

              <VBtn color="secondary" variant="outlined" @click="onFormReset">
                Cancel
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
