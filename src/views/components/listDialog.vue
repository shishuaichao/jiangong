<template>
  <div class="main_dialog">
    <!-- 列表框 -->
    <Modal
      v-model="isListShow"
      title="科技资源智能录入"
      :mask-closable="false"
      :draggable="true"
      :sticky="true"
      width="800"
    >
      <!-- 专利列表
      <i-button @click="showNext">编辑</i-button> -->
      <div class="list_dialog">
        <Table
          width="768"
          minHeight="500"
          border
          :columns="columns"
          :data="tempList"
        >
        <template #patentName="{ row }">
          <b>{{ row.patentName }}</b>
        </template>
        <template #type="{ row }">
          {{ typeList[row.type] }}
        </template>
        <template #patentType="{ row }">
          {{ patentTypeList[row.patentType] }}
        </template>
        <template #patentStatus="{ row }">
          <div class="res_type">
            {{ patentStatusList[row.patentStatus] }}
            <span class="dot" :class="{'green': row.patentStatus == '2', 'orange': row.patentStatus == '1'}"></span>
          </div>
        </template>
        
        <template #action="{ row, index }">
          <div class="action_box">
            <Button style="margin-right: 10px" type="warning" size="small" @click="edit(row, index)">编辑</Button>
            <Tooltip v-if="row.edited" content="复原到上传时" placement="top">
              <Button style="margin-right: 10px" type="primary" size="small" @click="restore(row, index)">复原</Button>
            </Tooltip>
            <Button type="error" size="small" @click="del(row, index)">删除</Button>
          </div>
        </template>
        </Table>
      </div>
      <template #footer>
        <div style="text-align: center">
          <Button style="margin-right: 50px" type="primary" @click="sureHandle" :disabled="!list.length">确认导入</Button>
          <Button @click="isListShow = false">取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</Button>
        </div>
      </template>
    </Modal>

    <edit-dialog ref="editDialog" @save="editSave"></edit-dialog>
  </div>
</template>

<script>
import editDialog from "./editDialog.vue";
import { fetchPost } from '../../api/index.js'

export default {
  components: {
    editDialog,
  },
  data() {
    return {
      editIndex: null,
      patentTypeList: {
        '1': '发明专利',
        '2': '实用新型',
        '3': '外观设计'
      },
      patentStatusList: {
        '1': '失败',
        '2': '成功',
      },
      typeList: {
        '1': '申请',
        '2': '授权',
      },
      isListShow: false,
      tempItem: {},
      tempList: [],
      list: [],
      columns: [
        {
          type: 'index',
          height: 48,
          width: 60,
          align: 'center',
          fixed: "left",
        },
        {
          title: "专利名称",
          // key: "patentName",
          width: 200,
          fixed: "left",
          align: 'center',
          slot: 'patentName'
        },
        {
          title: "识别可信度",
          slot: "patentStatus",
          align: 'center',
          width: 100,
        },
        {
          title: "专利类型",
          slot: "patentType",
          align: 'center',
          width: 100,
        },
        {
          title: "专利状态",
          slot: "type",
          align: 'center',
          width: 100,
        },
        
        {
          title: "申请号/专利授权号",
          key: "patentNo",
          align: 'center',
          width: 180,
        },
        {
          title: "申请日",
          key: "applyData",
          align: 'center',
          width: 150,
        },
        {
          title: "授权公告日",
          key: "announcementDate",
          align: 'center',
          width: 150,
        },
        {
          title: "申请人/专利权人（多家单位用分号隔开）",
          key: "patentee",
          width: 200,
        },
        {
          title: "发明人（分号隔开）",
          key: "patentUser",
          align: 'center',
          width: 210,
        },
        {
          title: "操作",
          slot: 'action',
          // fixed: "right",
          width: 186,
        },
      ],
    };
  },
  methods: {
    show(list) {
      console.log("list", list);
      this.list = list.data;
      this.tempList = JSON.parse(JSON.stringify(list.data));
      // console.log(this.tempList === this.list)
      this.isListShow = true;
    },
    hide() {
      this.isListShow = false;
    }, 

    showNext() {
      this.$refs.editDialog.show();
    },
    edit(item, i) {
      this.$refs.editDialog.show(item);
      this.editIndex = i
    },
    editSave(item) {
      this.tempList[this.editIndex] = item
      this.tempList[this.editIndex].edited = true
      console.log('this.tempList', this.tempList)
    },
    restore(item, i) {
      this.tempList[i] = this.list[i]
      this.tempList[i].edited = false
    },
    del(item, i) {
      this.$Modal.confirm({
        title: '删除提示',
        content: '<p>确定要删除吗？</p>',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.tempList.splice(i, 1);
          this.list.splice(i, 1);
          this.$Message.success(`删除成功${item.patentName ? '《' + item.patentName + '》' : ''}`);
        },
      });
    },
    // 确认导入
    sureHandle() {
      console.log(this.tempList)
      fetchPost('http://106.15.4.241:8669/ocr/edit', this.tempList)
        .then(() => {
          this.hide()
          this.$Message.success({
            background: true,
            content: '导入成功'
          });
          // 通知修改数量
          this.$emit('changeCount')
        })
        .catch(err => {
          console.log('err', err)
          this.$Message.error({
            background: true,
            content: err
          });
        })
    },
  },
};
</script>
<style lang="less" scoped>
  /deep/ .action_box {
    display: flex;
    // justify-content: space-between;
  }
  .res_type {
    position: relative;
    .dot {
      position: absolute;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      top: 6px;
      right: 0px;
      &.green {
        background-color: rgb(43, 239, 79);
      }
      &.orange {
        background-color: rgb(239, 85, 43);
      }

    }
  }
</style>