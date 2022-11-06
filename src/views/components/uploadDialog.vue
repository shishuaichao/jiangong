<template>
  <div>
    <!-- 上传框 -->
    <Modal
      v-model="isUploadShow"
      title="科技资源智能录入"
      :mask-closable="false"
      :draggable="true"
      :sticky="true"
      width="800"
    >
    <template #footer>
      <div style="text-align: center">
        <Button style="margin-right: 50px" type="primary" @click="deal" :disabled="!arrList.length">开始处理</Button>
        <Button @click="isUploadShow = false">取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</Button>
      </div>
    </template>
      <div class="main_dialog">
        <!-- <div style="color: red; font-size: 12px; margin-bottom: 10px;">提示：切换类型会清空之前未处理的上传文件，建议处理完后再上传另外类型</div> -->
        <div class="radio">
          文件类型：
          <RadioGroup v-model="fileType" @change="fileTypeChange">
            <!-- <Radio label="智能识别"></Radio> -->
            <Radio :label="1">
              <span>专利证书</span>
            </Radio>
            <Radio :label="2">
              <span>专利受理通知书</span>
            </Radio>
            <!-- <Radio label="专利受理通知书"></Radio> -->
          </RadioGroup>
        </div>
        <div class="server">
          <div>服务器选择：</div>
          <RadioGroup v-model="serverType" @change="serverTypeChange">
            <div class="server_item">
              <Radio :label="2">
                <span>公有云服务器（快速且准确率高）</span>
              </Radio>
            </div>
            <div class="server_item">
              <Radio :label="1">
                <span>私有云服务器（保密性高）</span>
              </Radio>
            </div>
          </RadioGroup>
        </div>
        <div class="upload">
          <Upload
            :multiple="true"
            type="drag"
            name="files"
            :format="['jpg', 'jpeg', 'pdf', 'png', 'JPG', 'JPEG', 'PDF', 'PNG']"
            :before-upload="beforeUpload"
            :on-progress="onProgerss"
            :on-format-error="onFormatError"
            :on-error="onError"
            :on-success="onSuccess"
            :on-remove="onRemove"
            :on-preview="preview"
            :default-file-list="arrList"
            :action="url">
            <div style="padding: 20px 0">
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                <p>点击或将文件拖拽到这里上传</p>
                <p>支持扩展名：.pdf .jpg .jpeg .png</p>
            </div>
          </Upload>
        </div>
        <div class="count_info" v-if="uploadCount">
          共{{uploadCount}}个附件，上传中{{uploadCount - successCount}}个，已完成{{successCount}}个。
        </div>
        
      </div>
    </Modal>

    <list-dialog ref="listDialog" @changeCount="changeCount"></list-dialog>
  </div>
</template>

<script>
import listDialog from './listDialog.vue'
import { fetchPost } from '../../api/index.js'

export default {
  components: {
    listDialog,
  },
  data() {
    return {
      isUploadShow: false,
      fileType: 1,     // 默认专利证书
      serverType: 2,   // 默认公有云
      arrList: [],
      uploadCount: 0,
      successCount: 0,
    }
  },
  computed: {
    url: function() {
      if (this.serverType == 2) {
        if (this.fileType == 1) {
          return 'http://106.15.4.241:8669/file/add'
        } else {
          return 'http://106.15.4.241:8669/file/acceptance'
        }
      } else {
        if (this.fileType == 1) {
          return 'http://106.15.4.241:8669/local/add'
        } else {
          return 'http://106.15.4.241:8669/local/acceptance'
        }
      }
    }
  },  
  mounted() {
    
  },  
  methods: {
    show() {
      this.arrList = []
      this.uploadCount = 0
      this.successCount = 0
      this.isUploadShow = true
    },
    hide() {
      this.isUploadShow = false
    },

    fileTypeChange() {
      // this.arrList = [];
      // this.uploadCount = 0;
      // this.successCount = 0;
    },
    serverTypeChange() {
      // this.arrList = [];
      // this.uploadCount = 0;
      // this.successCount = 0;
    },

    showNext(list) {
      this.hide()
      this.$refs.listDialog.show(list)
    },
    beforeUpload(e) {
      this.uploadCount++
      console.log('beforeUpload', this.uploadCount)
    },
    onProgerss(e) {
      // console.log('onProgerss', e)
    },
    onFormatError(e) {
      console.log('onFormatError', e)
      this.$Message.error({
        background: true,
        content: '不支持此类型文件'
      });
      this.uploadCount--
    },
    onSuccess(e) {
      this.arrList.push(e[0])
      this.successCount++
      console.log('成功', this.arrList)
    },
    onError(err) {
      console.log('e', err)
      this.uploadCount--
      this.$Message.error({
        background: true,
        content: '文件上传失败'
      });
    },  
    onRemove(e) {
      this.arrList = this.arrList.filter(item => item.fileName !== e.name)
      this.uploadCount--
      this.successCount--
    },
    preview(e) {
      // console.log('xxx', e)
    },
    // 开始处理
    deal() {
      console.log('fileType', this.fileType)
      let arr = []
      this.arrList.forEach(e => arr.push(e.attachmentid))
      fetchPost('http://106.15.4.241:8669/ocr/', {list: arr})
        .then(res => {
          console.log(res)
          this.showNext(res)
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    changeCount() {
      this.$emit('changeCount')
    }
  }
}
</script>
<style lang="less" scoped>
  .main_dialog {
    padding: 0px 100px;
  }
  /deep/ .ivu-upload-list {
    max-height: 300px;
    overflow: auto;
    border-radius: 4px;
  }
  .upload {
    margin-top: 20px;
  }
  .server {
    display: flex;
    margin-top: 10px;
    .server_item {
      margin-bottom: 8px;
    }
  }
  .count_info {
    padding: 10px 0;
    text-align: center;
    background-color: rgb(241, 241, 241);
    border-radius: 4px;
    margin-top: 10px;
  }
</style>
