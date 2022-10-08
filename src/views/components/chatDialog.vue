<template>
  <div class="chat_dialog">
     <!-- 对话框 -->
     <transition name="slide-up">
      <div class="chat_box transition-box" v-show="isChatShow">
        <Icon
          class="icon"
          type="ios-close"
          size="30"
          @click="hide"
        ></Icon>
        <div class="cont">
          <div class="cont_header">
            <div class="img">
              <img src="../../assets/girl.png" alt="" />
            </div>
            <div class="right">
              <p>Hello，我是小建。</p>
              <p>是您科技工作的智能助手。</p>
            </div>
          </div>
          <div class="cont_header">
            <div class="img">
              <!-- <img src="@/assets/imgs/girl.png" alt="" /> -->
            </div>
            <div class="right">
              <p>我可以：</p>
              <p>
                <i-button @click="showNext">科技资源智能录入</i-button>
              </p>
              <p>当日处理数量：{{todayCount}}</p>
              <p>累计处理数量：{{totalCount}}</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <upload-dialog ref="uploadDialog" @changeCount="showCount"></upload-dialog>
  </div>
</template>

<script>
import uploadDialog from './uploadDialog.vue'
import { fetchPost } from '../../api/index.js'

export default {
  components: {
    uploadDialog,
  },
  data() {
    return {
      isChatShow: false,
      todayCount: 20,
      totalCount: 200,
    }
  },
  methods: {
    show(xxx) {
      console.log('xxxx', xxx)
      this.isChatShow = true
    },
    hide() {
      this.isChatShow = false
    },

    showNext() {
      this.$refs.uploadDialog.show()
    },

    showCount() {
      fetchPost('http://106.15.4.241:8669/ocr/statistics', {})
        .then(res => {
          console.log('今日处理数量', res)
          this.totalCount = res?.data?.all
          this.todayCount = res?.data?.sameDay
        })
        .catch(err => {
          console.log('err', err)
        })
    }
  },
  mounted() {
    this.showCount()
  }
}
</script>
<style lang="less" scoped>
.chat_box {
  position: fixed;
  bottom: 100px;
  right: 0;
  border: 1px solid #ccc;
  height: 300px;
  width: 250px;
  transition: all 0.3s linear;
  background-color: #fff;
  box-sizing: border-box;
  .icon {
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
  }
  .cont {
    margin-top: 30px;
    .cont_header {
      display: flex;
      font-size: 14px;
      align-items: center;
      .img {
        width: 60px;
        margin: 0 12px 0 8px;
        img {
          display: block;
          width: 100%;
        }
      }
      p {
        margin-bottom: 4px;
      }
    }
  }
}
</style>
