<template>
  <view>
    <picker
      @change="bindPickerChange"
      :value="curIndex"
      :range="labelList"
      :mode="mode"
      placeholder="请选择"
    >
      <view class="uni-input" :style="customStyle">{{ labelList[curIndex] }}</view>
    </picker>
  </view>
</template>

<script setup>
import { ref, watch, computed, onMounted, onActivated } from 'vue'

import { useCommonStore } from '@/stores/common'
// import { onMounted } from '@dcloudio/uni-app'

const props = defineProps({
  options: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: String,
    default: 0
  },
  dictId: {
    type: String,
    default: ''
  },
  mode: {
    type: String,
    default: 'selector'
  },
  customStyle: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const commonStore = useCommonStore()
// const labelList = ref([])
const curIndex = ref(0)
const selectOptions = ref([])

onMounted(() => {
  console.log('onMounted', props)
  initData()
  handleDefaultValue()
})

watch(
  () => props.options,
  (options) => {
    console.log('options---', options)
    selectOptions.value = options
    if (
      selectOptions.value &&
      selectOptions.value.length > 0 &&
      (props.modelValue || props.modelValue === 0)
    ) {
      curIndex.value = selectOptions.value.findIndex((item) => item.value === props.modelValue)
    }

    if (
      selectOptions.value &&
      selectOptions.value.length > 0 &&
      ((curIndex.value && curIndex.value !== -1) || curIndex.value === 0)
    ) {
      console.log('curIndex', curIndex.value)
      console.log('selectOptions', selectOptions.value)
      emit('update:modelValue', selectOptions.value[curIndex.value]['value'])
      emit('change', selectOptions.value[curIndex.value])
    }
  }
)

const handleDefaultValue = () => {
  if (props.modelValue || props.modelValue === 0) {
    curIndex.value = selectOptions.value.findIndex((item) => item.value === props.modelValue)
  }
  if (props.options && props.options.length > 0) {
    selectOptions.value = props.options

    if ((curIndex.value && curIndex.value !== -1) || curIndex.value === 0) {
      console.log('curIndex', curIndex.value)
      console.log('selectOptions', selectOptions.value)
      emit('update:modelValue', selectOptions.value[curIndex.value]['value'])
      emit('change', selectOptions.value[curIndex.value])
    }
  }
}

watch(
  () => props.modelValue,
  (modelValue) => {
    console.log('modelValue---', modelValue)
    if (selectOptions.value && selectOptions.value.length > 0 && (modelValue || modelValue === 0)) {
      curIndex.value = selectOptions.value.findIndex((item) => item.value === modelValue)
      if ((curIndex.value && curIndex.value !== -1) || curIndex.value === 0) {
        emit('update:modelValue', selectOptions.value[curIndex.value]['value'])
        emit('change', selectOptions.value[curIndex.value])
      }
    }
  }
)

const labelList = computed(() => selectOptions.value.map((item) => item.label))

const bindPickerChange = ({ detail }) => {
  curIndex.value = detail.value
  console.log('value', selectOptions.value[curIndex.value]['value'])
  emit('update:modelValue', selectOptions.value[curIndex.value]['value'])
  emit('change', selectOptions.value[curIndex.value])
}

const initData = async () => {
  if (props.dictId) {
    selectOptions.value = await commonStore.getDictItemListAction(props.dictId)
    if (selectOptions.value && selectOptions.value.length > 0) {
      emit('update:modelValue', selectOptions.value[curIndex.value]['value'])
      emit('change', selectOptions.value[curIndex.value])
    }
  }
}

const setCurIndex = () => {
  curIndex.value = 0
}

defineExpose({
  setCurIndex
})
</script>

<style lang="scss" scoped></style>
