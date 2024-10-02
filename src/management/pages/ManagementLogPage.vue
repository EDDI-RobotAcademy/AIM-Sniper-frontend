<template>
  <div>
    <h1>User Log List</h1>
    <v-data-table
      :headers="headers"
      :items="userLogList.data"
      item-key="userId"
      class="elevation-1"
    >
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.userId }}</td>
          <td>{{ item.companyReportId }} - {{ item.companyReportName }}</td>
          <td>{{ item.clickCount }}</td>
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
}
</style>
