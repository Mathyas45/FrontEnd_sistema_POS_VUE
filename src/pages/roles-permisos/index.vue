<script setup>
// import data from "@/views/demos/forms/tables/data-table/datatable";

const data = ref([]);
const headers = [
  { title: "ID", key: "id" },
  { title: "Role", key: "name" },
  { title: "Fecha de registro", key: "create_at" },
  { title: "Permisos", key: "list_permissions" },
  { title: "Action", key: "action" },
];

const isRolesAddDialogVisible = ref(false);
</script>

<template>
  <div>
    <VCard title="🔐 Roles y permisos">
      <VCardText>
        <VRow>
          <VCol cols="12" md="6">
            <VTextField
              v-model="search"
              label="Buscar"
              placeholder="Buscar Rol"
              prepend-inner-icon="mdi-magnify"
              density="compact"
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
        :items="data"
        :items-per-page="5"
        class="text-no-wrap"
      >
        <template v-slot:item="{ item }">
          <span class="text-h6">{{ item.id }}</span>
        </template>
      </VDataTable>
    </VCard>
    <RoleAddDialog v-model:isDialogVisible="isRolesAddDialogVisible" />
  </div>
</template>
