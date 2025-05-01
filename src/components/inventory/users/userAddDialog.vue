<script setup>
const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
});

const name = ref("null");
const surname = ref("null");
const email = ref("null");
const phone = ref("null");
const type_document = ref("DNI");
const n_document = ref("null");
const rol_id = ref("null");
const sucursal_id = ref("null");
const gender = ref("null");
const password = ref("null");

const warning = ref(null);
const success = ref(null);
const error_exits = ref(null);
const isLoading = ref(false);

const store = async () => {
  warning.value = null;
  success.value = null;
  error_exits.value = null;

  if (!name.value) {
    setTimeout(() => {
      warning.value = "El nombre es requerido";
    }, 50);
    return;
  }
  if (permissions.value.length == 0) {
    setTimeout(() => {
      warning.value = "Se debe seleccionar al menos un permiso";
    }, 50);
    return;
  }
  let data = {
    name: name.value,
    permissions: permissions.value,
  };
  try {
    isLoading.value = true;
    const resp = await $api("users", {
      method: "POST",
      body: data,
      onResponseError({ response }) {
        error_exits.value = response._data.error;
      },
    });
    console.log(resp);
    if (resp.message == 403) {
      error_exits.value = resp.message_text;
    } else {
      success.value = "el usuario se creo correctamente";
      emit("addUser", resp.user);
      emit("alert_success", "el usuario se creo correctamente");
      onFormReset();
      name.value = null;
      warning.value = null;
      success.value = null;
      error_exits.value = null;
    }
  } catch (error) {
    console.log("Error:", error?.response?._data || error);
  } finally {
    isLoading.value = false;
  }
};

const emit = defineEmits([
  "addUser",
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
    max-width="750"
    :model-value="props.isDialogVisible"
    @update:model-value="dialogVisibleUpdate"
  >
    <VCard class="pa-sm-11 pa-3">
      <!-- 👉 dialog close btn -->
      <DialogCloseBtn variant="text" size="default" @click="onFormReset" />

      <VCardText class="pt-5">
        <div class="text-center pb-6">
          <h4 class="text-h4 mb-2">Agregar Usuario</h4>
        </div>

        <!-- 👉 Form -->
        <VForm class="mt-4" @submit.prevent="store">
          <VRow>
            <!-- 👉 First Name -->
            <VCol cols="6">
              <VTextField
                v-model="name"
                label="Nombre"
                placeholder="Example: Administrador"
              />
            </VCol>
            <VCol cols="6">
              <VTextField
                v-model="surname"
                label="Apellido"
                placeholder="Example: Tu apellido"
              />
            </VCol>
            <VCol cols="6">
              <VTextField
                v-model="email"
                label="Email"
                placeholder="Example: Coax@gmail.com"
              />
            </VCol>
            <VCol cols="6">
              <VTextField
                v-model="phone"
                type="number"
                label="Telefono"
                placeholder="Example: 123456789"
              />
            </VCol>
            <VCol cols="6">
              <VSelect
                :items="['DNI', 'PASAPORTE', 'CARNET DE EXTRANJERIA']"
                v-model="type_document"
                label="Tipo de documento"
                placeholder="Seleccione un tipo de documento"
                eager
              />
            </VCol>
            <VCol cols="6">
              <VTextField
                v-model="n_document"
                type="number"
                label="Numero de documento"
                placeholder="Example: 12345678"
              />
            </VCol>
            <VCol cols="6">
              <VSelect
                v-model="rol_id"
                :items="[]"
                label="Rol"
                placeholder="Seleccione un rol"
                eager
              />
            </VCol>
            <VCol cols="6">
              <VSelect
                v-model="sucursal_id"
                :items="[]"
                label="Sucursal"
                placeholder="Seleccione una sucursal"
                eager
              />
            </VCol>
            <VCol cols="6">
              <VRadioGroup v-model="gender">
                <VRadio label="Masculino" value="M" />
                <VRadio label="Femenino" value="F" />
              </VRadioGroup>
            </VCol>
            <VCol cols="6">
              <VFileInput
                label="Foto de perfil"
                placeholder="Seleccione una foto del usuario"
                accept="image/*"
                show-size
              />
            </VCol>
            <VCol cols="6">
              <VTextField
                v-model="password"
                type="password"
                label="Contraseña"
                placeholder="Example: Tu contraseña"
              />
            </VCol>
            <VCol cols="12" v-if="warning">
              <VAlert
                closable
                close-label="Close alert"
                color="error"
                type="error"
              >
                {{ warning }}
              </VAlert>
            </VCol>
            <VCol cols="12" v-if="success">
              <VAlert
                closable
                close-label="Close alert"
                color="success"
                type="success"
              >
                {{ success }}
              </VAlert>
            </VCol>
            <VCol cols="12" v-if="error_exits">
              <VAlert
                closable
                close-label="Close alert"
                color="error"
                type="error"
              >
                {{ error_exits }}
              </VAlert>
            </VCol>
            <VCol cols="12"> </VCol>

            <VCol cols="12" class="d-flex flex-wrap justify-center gap-4">
              <VBtn :loading="isLoading" :disabled="isLoading" type="submit">
                Guardar
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
