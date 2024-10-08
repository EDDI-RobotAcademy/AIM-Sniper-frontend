<template>
  <div>
    <h1>User Log List</h1>
    <v-data-table
      :headers="headers"
      :items="userLogList.data"
      item-key="userId"
      class="elevation-1"
    >
      <template v-slot:header="{ props }">
        <thead>
          <tr>
            <th v-for="header in props.headers" :key="header.value" class="header-cell">
              {{ header.text }}
            </th>
          </tr>
        </thead>
      </template>
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.userId }}</td>
          <td>{{ item.companyReportName }} ({{ item.companyReportId }})</td>
          <td>{{ item.clickCount }}회</td>
          <td>{{ item.purchase }}</td>
          <td>{{ item.lastClickDate }}</td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      headers: [
        { text: 'User ID', value: 'userId' },
        { text: 'Company Report (ID, Name)', value: 'companyReportId' },
        { text: 'Click Count', value: 'clickCount' },
        { text: 'Purchase', value: 'purchase' },
        { text: 'Last Click Date', value: 'lastClickDate' },
      ],
    };
  },
  computed: {
    ...mapState('managementModule', ["userLogList"]),
  },
  methods: {
    ...mapActions('managementModule', ['requestUserLogListToDjango']),
    
    async loadUserLogList() {
      await this.requestUserLogListToDjango();
    },
  },
  mounted() {
    this.loadUserLogList();
  },
};
</script>

<style scoped>
.elevation-1 {
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  margin-top: 20px;
}

.header-cell {
  background-color: #f5f5f5; /* 헤더 배경색 */
  color: #333; /* 헤더 글자색 */
  font-weight: bold; /* 글자 두껍게 */
  padding: 12px; /* 패딩 추가 */
  border-bottom: 2px solid #ccc; /* 하단 경계선 추가 */
}

td {
  padding: 12px; /* 셀 패딩 */
}
</style>
