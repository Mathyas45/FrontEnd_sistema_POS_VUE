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

const permissions = ref([]);
const warning = ref(null);
const success = ref(null);
const error_exits = ref(null);
const isLoading = ref(false);
const name = ref("");

const AddEdidPermissionDialog = (permission) => {
  let index = permissions.value.findIndex((perm) => perm === permission);
  if (index != -1) {
    permissions.value.splice(index, 1);
  } else {
    permissions.value.push(permission);
  }
  //   console.log(permissions.value);
};
const update = async () => {
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
    const resp = await $api("roles", {
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
      success.value = "el rol se creo correctamente";
      emit("addRole", resp.role);
      emit("alert_success", "el rol se creo correctamente");
      onFormReset();
      name.value = null;
      permissions.value = [];
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
onMounted(() => {
  //   console.log(props.roleSelected);
  name.value = props.roleSelected.name;
  permissions.value = props.roleSelected.permissions_pluck;
});
const emit = defineEmits([
  "addRole",
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
          <h4 class="text-h4 mb-2">Editar Rol: {{ props.roleSelected.id }}</h4>
        </div>

        <!-- 👉 Form -->
        <VForm class="mt-4" @submit.prevent="update">
          <VRow>
            <!-- 👉 First Name -->
            <VCol cols="12">
              <VTextField
                v-model="name"
                label="Nombre"
                placeholder="Example: Administrador"
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
            <VCol cols="12">
              <VTable>
                <thead>
                  <tr>
                    <th class="text-uppercase">Modulo</th>
                    <th class="text-uppercase">Permisos</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in PERMISOS" :key="index.dessert">
                    <td>
                      {{ item.name }}
                    </td>
                    <td>
                      <ul>
                        <li
                          v-for="(permiso, index2) in item.permisos"
                          :key="index2"
                          style="list-style-type: none"
                        >
                          <VCheckbox
                            v-model="permissions"
                            :label="permiso.name"
                            :value="permiso.permiso"
                            @click="AddEdidPermissionDialog(permiso.permiso)"
                          />
                        </li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </VTable>
            </VCol>

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
