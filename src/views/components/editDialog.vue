<template>
  <div class="chat_dialog">
    <!-- 编辑框 -->
    <Modal
      v-model="isEditShow"
      title="编辑弹框"
      :mask-closable="false"
      width="800"
    >
    <Form :model="tempItem" label-position="right" :label-width="100">
      <Row>
          <Col span="12">
            <FormItem label="专利名称">
              <Input v-model="tempItem.patentName"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="专利授权号">
              <Input v-model="tempItem.patentNo"></Input>
            </FormItem>
          </Col>
      </Row>
      <Row>
          <Col span="24">
            <FormItem label="专利类型">
              <RadioGroup v-model="tempItem.patentType">
                <Radio :label="1">发明专利</Radio>
                <Radio :label="2">实用新型</Radio>
                <Radio :label="3">外观设计</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
      </Row>
      <Row>
          <Col span="24">
            <FormItem label="专利状态">
              <RadioGroup v-model="tempItem.type">
                <Radio :label="1">申请</Radio>
                <Radio :label="2">授权</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
      </Row>
      <Row>
          <Col span="12">
            <FormItem label="申请日">
              <Input placeholder="xxxx年xx月xx日" v-model="tempItem.applyData"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="授权公告日">
              <Input placeholder="xxxx年xx月xx日" v-model="tempItem.announcementDate"></Input>
            </FormItem>
          </Col>
      </Row>
      <Row>
          <Col span="24">
            <FormItem label="申请人/专利权人">
              <Input placeholder="申请人/专利权人（多家单位用分号隔开）" v-model="tempItem.patentee"></Input>
            </FormItem>
          </Col>
      </Row>
      <Row>
          <Col span="24">
            <FormItem label="发明人">
              <Input placeholder="发明人（分号隔开）" v-model="tempItem.patentUser"></Input>
            </FormItem>
          </Col>
      </Row>
    </Form>


      <template #footer>
        <div style="text-align: center">
          <Button style="margin-right: 50px" type="primary" @click="sureHandle">保&nbsp;&nbsp;&nbsp;存</Button>
          <Button @click="hide">取&nbsp;&nbsp;&nbsp;消</Button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isEditShow: false,
      tempItem: {},
    }
  },
  methods: {
    show(item) {
      this.isEditShow = true
      this.tempItem = JSON.parse(JSON.stringify(item))
      console.log('信息', this.tempItem)
    },
    hide() {
      this.isEditShow = false
    },

    sureHandle() {
      this.$emit('save', this.tempItem)
      this.hide()
    },
  }
}
</script>
<style lang="less" scoped>

</style>
