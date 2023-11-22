<template>
  <input disabled :placeholder="`请选择${title}`" v-model="showName" @click="inputFocus" />

  <modal
    v-if="isShowModal"
    show
    @close="closeModal"
    @confirm="confirm"
    :beforeConfirm="beforeConfirm"
  >
    <view class="modal-content">
      <uni-section :title="title" type="line" titleFontSize="32rpx">
        <uni-data-checkbox
          multiple
          v-model="checkedList"
          :localdata="options"
          @change="sectionChange"
        />
      </uni-section>
    </view>
  </modal>
</template>

<script setup>
import modal from '@/components/modal'
import { ref, watch, onMounted, computed } from 'vue'

const emit = defineEmits(['update:modelValue'])

const showName = ref('')
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
  beforeConfirm: {
    type: [Function, Boolean],
    default: () => false
  }
})

const options = computed(() => props.options)

const inputFocus = () => {
  console.log('inputFocus')
  isShowModal.value = true
}

const sectionChange = (e) => {
  console.log('sectionChange', e)
  if (props.beforeConfirm) {
    checkedList.value = props.beforeConfirm(e)
  } else {
    checkedList.value = e.detail.value
  }
}

onMounted(() => {
  console.log(props.modelValue)
  checkedList.value = props.modelValue
})

watch(
  () => props.modelValue,
  (val) => {
    checkedList.value = val
  }
)

const checkedList = ref([])

const closeModal = () => {
  isShowModal.value = false
}

const beforeConfirm = () => {
  if (checkedList.value.length === 0) {
    uni.showToast({
      title: `请选择量尺空间${props.title}`,
      icon: 'none'
    })
    return false
  } else {
    return true
  }
}

const confirm = () => {
  console.log('confirm')
  showName.value = props.options
    .filter((l) => checkedList.value.includes(l.value))
    .map((l) => l.text)
    .join('、')
  console.log('showName', showName.value)
  emit('update:modelValue', checkedList.value)
  closeModal()
}
</script>

<style lang="scss" scoped>
.modal-content {
  padding: 25rpx 45rpx;
}
</style>
