<script setup>
import { useToast } from "vue-toastification";
const toast = useToast();

const data = ref([]);
const headers = [
  { title: "ID", key: "id" },
  { title: "Rol", key: "name" },
  { title: "Fecha de registro", key: "created_at" },
  { title: "Permisos", key: "permissions_pluck" },
  { title: "Action", key: "action" },
];

const isRolesAddDialogVisible = ref(false);
const isRolesEditDialogVisible = ref(false);
const list_roles = ref([]);
const cargar = ref(false);
const searchQuery = ref(null);
const role_selected_edit = ref(null);

const list = async () => {
  try {
    cargar.value = true;
    const resp = await $api(
      "roles?search=" + (searchQuery.value ? searchQuery.value : ""),
      {
        method: "GET",
        onResponseError({ response }) {
          console.error(response._data.error);
        },
      }
    );
    // console.log(resp);
    list_roles.value = resp.roles;
  } catch (error) {
    console.error(error);
  } finally {
    cargar.value = false;
  }
};
onMounted(() => {
  list();
});
//captar el evento de agregar un nuevo desde el modal
const addNewRole = (NewRole) => {
  // console.log(NewRole);
  let backup = list_roles.value;
  list_roles.value = [];
  backup.unshift(NewRole);
  setTimeout(() => {
    list_roles.value = backup;
  }, 50);
};

const alert_success = (message) => {
  toast.success(message);
};

const editItem = (item) => {
  console.log(item);
  isRolesEditDialogVisible.value = true;
  role_selected_edit.value = item;
};
const deleteItem = (item) => {};
</script>

<template>
  <div>
    <VCard title="🔐 Roles y permisos">
      <VCardText>
        <VRow>
          <VCol cols="12" md="6">
            <VTextField
              label="Buscar"
              placeholder="Buscar Rol"
              prepend-inner-icon="mdi-magnify"
              density="compact"
              v-model="searchQuery"
              @keyup.enter="list"
            />
          </VCol>
          <VCol cols="12" md="6" class="text-end">
            <VBtn
              @click="isRolesAddDialogVisible = !isRolesAddDialogVisible"
              class="mb-2"
            >
              Crear nuevo rol <VIcon end icon="ri-add-circle-fill" />
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>

      <VDataTable
        :headers="headers"
        :items="list_roles"
        :cargar="cargar"
        :items-per-page="20"
        class="text-no-wrap"
      >
        <template v-slot:cargar>
          <div class="text-center pa-4">
            <v-progress-circular indeterminate color="primary" />
            <div>Cargando roles...</div>
          </div>
        </template>
        <template v-slot:item-id="{ item }">
          <span class="text-h6">{{ item.id }}</span>
        </template>
        <template v-slot:item.permissions_pluck="{ item }">
          <ul>
            <li
              v-for="(permission, index) in item.permissions_pluck"
              :key="index"
            >
              {{ permission }}
            </li>
          </ul>
        </template>
        <template v-slot:item.action="{ item }">
          <div class="d-flex gap-1">
            <IconBtn size="small" @click="editItem(item)">
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn size="small" @click="deleteItem(item)">
              <VIcon icon="ri-delete-bin-line" />
            </IconBtn>
          </div>
        </template>
      </VDataTable>
    </VCard>
    <RoleAddDialog
      v-model:isDialogVisible="isRolesAddDialogVisible"
      @addRole="addNewRole"
      @alert_success="alert_success"
    />
    <RoleEditDialog
      v-if="role_selected_edit && isRolesEditDialogVisible"
      v-model:isDialogVisible="isRolesEditDialogVisible"
      :roleSelected="role_selected_edit"
      @addRole="addNewRole"
      @alert_success="alert_success"
    />
  </div>
</template>
