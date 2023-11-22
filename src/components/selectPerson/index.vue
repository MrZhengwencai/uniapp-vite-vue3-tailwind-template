<template>
  <view
    class="btn-text"
    :class="{ 'disabled-item': disabled }"
    @click="onSelect">
    {{ btnText || `设置${title}` }}
  </view>

  <modal
    v-if="isShowModal"
    show
    @close="closeModal"
    @confirm="confirm"
    :beforeConfirm="beforeConfirm">
    <view class="modal-content">
      <uni-section :title="`设置${title}`" type="line" titleFontSize="32rpx">
        <view class="stage-name">阶段名称：{{ stageName }}</view>

        <uni-data-select v-model="checkedId" :localdata="options" />
      </uni-section>
    </view>
  </modal>
</template>

<script setup>
import modal from '@/components/modal'
import { ref, watch, onMounted } from 'vue'
import request from '@/http'

const emit = defineEmits(['update:modelValue', 'onSelected'])
const isShowModal = ref(false)

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    default: () => []
  },
  stageName: {
    type: String,
    required: true
  },
  btnText: {
    type: String,
    default: ''
  },
  params: {
    type: Object,
    default: () => ({})
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

watch(
  () => props.params,
  async (val) => {
    if (props.params.currentGroupItemId && props.params.deptId) {
      const { result } = await request('getListUserByDepartmentId', {
        pageIndex: 1,
        pageSize: 100,
        ...props.params
      })

      options.value = result.result.map((r) => {
        r.text = r.name
        r.value = r.id
        return r
      })
    }
  }
)

const options = ref([])

const onSelect = () => {
  console.log('onSelect')
  if (!props.disabled) isShowModal.value = true
}

onMounted(async () => {
  if (props.params.currentGroupItemId && props.params.deptId) {
    const { result } = await request('getListUserByDepartmentId', {
      pageIndex: 1,
      pageSize: 100,
      ...props.params
    })

    options.value = result.result.map((r) => {
      r.text = r.name
      r.value = r.id
      return r
    })
  }
  console.log(props.modelValue)
  checkedId.value = props.modelValue
})

watch(
  () => props.modelValue,
  (val) => {
    checkedId.value = val
  }
)

const checkedId = ref([])

const closeModal = () => {
  isShowModal.value = false
}

const confirm = () => {
  emit('update:modelValue', checkedId.value)
  emit('onSelected', checkedId.value)
  closeModal()
}

const beforeConfirm = () => {
  if (!checkedId.value) {
    uni.showToast({
      title: `请设置${props.title}`,
      icon: 'none'
    })
    return false
  } else {
    return true
  }
}
</script>

<style lang="scss" scoped>
.btn-text {
  color: #1e7ccc;
}

.modal-content {
  padding: 25rpx 45rpx;
  padding-bottom: 230rpx;

  .stage-name {
    height: 27rpx;
    font-size: 28rpx;
    font-family: Noto Sans S Chinese;
    font-weight: 400;
    color: #333333;
    line-height: 28rpx;
    margin: 40rpx;
    display: flex;
    justify-content: center;
  }
}
</style>
