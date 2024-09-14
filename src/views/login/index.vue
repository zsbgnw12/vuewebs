<script setup lang="ts">
import { ref } from "vue"
import { sm2 } from "sm-crypto-v2"
import { NForm, NFormItem, NInput, useMessage } from "naive-ui"
import type { FormInst } from 'naive-ui'
import { useRouter } from "vue-router"
import { ss } from "@/utils/storage/index"
import publicKey from "@/utils/keys"
import { fetchLogin } from "@/api/index"

interface ModelType {
  account: string | null
  password: string | null
}

const model = ref<ModelType>({
  account: null,
  password: null,
})


const formRef = ref<FormInst | null>(null)
const message = useMessage()
const router = useRouter()
const handleLogin = () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      let loginData = {
        account: model.value.account,
        password: sm2.doEncrypt(model.value.password!, publicKey, 1)
      }
      try {
        const res: any = await fetchLogin(loginData)
        if (res.code === 200) {
          message.success('登录成功！')
          ss.set("token", res.result.accessToken)
          router.push("/main")
        } else {
          message.error(res.message)
        }
      } catch (error) {
        message.error('登录失败！')
      }
    }
    else {
      message.error('请输入相关信息！')
    }
  })


}

const rules = {
  account: {
    required: true,
    message: '请输入姓名',
    trigger: ['input', 'blur']
  },
  password: {
    required: true,
    message: '请输入电话号码',
    trigger: ['input']
  }
}
</script>

<template>
  <div class="w-full h-full flex">
    <div class="w-2/5 bg-sky-500/100"></div>
    <div class="w-3/5">
      <div class="w-2/5 h-36">
        <n-form ref="formRef" :model="model" :rules="rules" label-placement="left" label-width="auto">
          <n-form-item label="账号" path="account">
            <n-input placeholder="请输入账号" v-model:value="model.account" />
          </n-form-item>
          <n-form-item label="密码" path="password">
            <n-input type="password" show-password-on="mousedown" placeholder="请输入密码" v-model:value="model.password" />
          </n-form-item>
          <n-form-item>
            <div @click="handleLogin" class="login-btn w-full cursor-pointer text-center rounded bg-sky-500/75">登录</div>
          </n-form-item>
        </n-form>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.w-3\/5 {
  position: relative;

  .w-2\/5 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%)
  }
}

.login-btn {

  height: 35px;
  line-height: 35px;
}
</style>
