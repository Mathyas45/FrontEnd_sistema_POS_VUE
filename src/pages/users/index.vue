<script setup>
import { useToast } from "vue-toastification";
const toast = useToast();

const data = ref([]);
const headers = [
  { title: "ID", key: "id" },
  { title: "Nombre completo", key: "full_name" },
  { title: "Email", key: "email" },
  { title: "Rol", key: "role" },
  { title: "Sucursal", key: "sucursal" },
  { title: "Telefono", key: "phone" },
  { title: "Estado", key: "reg_estado" },
  { title: "Fecha de registro", key: "created_at" },
  { title: "Action", key: "action" },
];

const isUserAddDialogVisible = ref(false);
const isRolesEditDialogVisible = ref(false);
const isRolesDeleteDialogVisible = ref(false);
const list_users = ref([]);
const cargar = ref(false);
const searchQuery = ref(null);
const role_selected_edit = ref(null);
const role_selected_delete = ref(null);

const list = async () => {
  try {
    cargar.value = true;
    const resp = await $api(
      "users?search=" + (searchQuery.value ? searchQuery.value : ""),
      {
        method: "GET",
        onResponseError({ response }) {
          console.error(response._data.error);
        },
      }
    );
    console.log(resp);
    list_users.value = resp.users;
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
  let backup = list_users.value;
  list_users.value = [];
  backup.unshift(NewRole);
  setTimeout(() => {
    list_users.value = backup;
  }, 50);
};
const addEditRole = (editRole) => {
  // console.log(editRole);
  let backup = list_users.value;
  list_users.value = [];
  let index = backup.findIndex((rol) => rol.id == editRole.id);
  if (index != -1) {
    backup[index] = editRole;
  }
  setTimeout(() => {
    list_users.value = backup;
  }, 50);
};
const deleteRole = (role) => {
  // console.log(role);
  let backup = list_users.value;
  list_users.value = [];
  let index = backup.findIndex((rol) => rol.id == role.id);
  if (index != -1) {
    backup.splice(index, 1);
  }
  setTimeout(() => {
    list_users.value = backup;
  }, 50);
};

const alert_success = (message) => {
  toast.success(message);
};

const editItem = (item) => {
  // console.log(item);
  isRolesEditDialogVisible.value = true;
  role_selected_edit.value = item;
};
const deleteItem = (item) => {
  isRolesDeleteDialogVisible.value = true;
  role_selected_delete.value = item;
};
</script>

<template>
  <div>
    <VCard title="🙋‍♂️ Usuarios">
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
              @click="isUserAddDialogVisible = !isUserAddDialogVisible"
              class="mb-2"
            >
              Crear nuevo Usuario <VIcon end icon="ri-add-circle-fill" />
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>

      <VDataTable
        :headers="headers"
        :items="list_users"
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
        <template v-slot:item.role="{ item }">
          <span class="text-h6">{{ item.role }}</span>
        </template>
        <template v-slot:item.sucursal="{ item }">
          <span class="text-h6">{{ item.sucursal }}</span>
        </template>
        <template v-slot:item.reg_estado="{ item }">
          <span class="text-h6">{{
            (item.reg_estado = 1 ? "Activo" : "Editado")
          }}</span>
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
    <UserAddDialog
      v-model:isDialogVisible="isUserAddDialogVisible"
      @addRole="addNewRole"
      @alert_success="alert_success"
    />
    <!-- <RoleEditDialog
      v-if="role_selected_edit && isRolesEditDialogVisible"
      v-model:isDialogVisible="isRolesEditDialogVisible"
      :roleSelected="role_selected_edit"
      @editRole="addEditRole"
      @alert_success="alert_success"
    />
    <RoleDeleteDialog
      v-if="role_selected_delete && isRolesDeleteDialogVisible"
      v-model:isDialogVisible="isRolesDeleteDialogVisible"
      :roleSelected="role_selected_delete"
      @deleteRole="deleteRole"
      @alert_success="alert_success"
    /> -->
  </div>
</template>
