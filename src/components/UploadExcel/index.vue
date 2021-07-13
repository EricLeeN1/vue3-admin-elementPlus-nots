<template>
  <div>
    <input
      ref="excelUploadInput"
      class="excel-upload-input"
      type="file"
      accept=".xlsx, .xls"
      @change="handleClick"
    />
    <div class="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      Drop excel file here or
      <el-button
        :loading="loading"
        style="margin-left: 16px"
        size="mini"
        type="primary"
        @click="handleUpload"
      >
        Browse
      </el-button>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, ref } from 'vue'
import XLSX from 'xlsx'
import { ElMessage } from 'element-plus'

export default {
  props: {
    beforeUpload: Function, // eslint-disable-line
    onSuccess: Function// eslint-disable-line
  },
  setup(props) {
    const excelUploadInput = ref(null)
    const state = reactive({
      loading: false,
      excelData: {
        header: null,
        results: null
      }
    })
    const isExcel = (file) => {
      return /\.(xlsx|xls|csv)$/.test(file.name)
    }
    const generateData = ({ header, results }) => {
      state.excelData.header = header
      state.excelData.results = results
      if (props.onSuccess) {
        props.onSuccess(state.excelData)
      }
    }
    const getHeaderRow = (sheet) => {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; C += 1) {
        /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        let hdr = `UNKNOWN ${C}` // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
    }
    const readerData = (rawFile) => {
      state.loading = true
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const data = e.target.result
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const header = getHeaderRow(worksheet)
          const results = XLSX.utils.sheet_to_json(worksheet)
          generateData({ header, results })
          state.loading = false
          resolve()
        }
        reader.readAsArrayBuffer(rawFile)
      })
    }
    const handleUpload = () => {
      excelUploadInput.value.click()
    }
    const upload = (rawFile) => {
      excelUploadInput.value = null // fix can't select the same excel

      if (!props.beforeUpload) {
        readerData(rawFile)
        return
      }
      const before = props.beforeUpload(rawFile)
      if (before) {
        readerData(rawFile)
      }
    }
    const handleClick = (e) => {
      const { files } = e.target
      const rawFile = files[0] // only use files[0]
      if (!rawFile) return
      upload(rawFile)
    }
    const handleDragover = (e) => {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    }
    const handleDrop = (e) => {
      e.stopPropagation()
      e.preventDefault()
      if (state.loading) return
      const { files } = e.dataTransfer
      if (files.length !== 1) {
        ElMessage.error('Only support uploading one file!')
        return
      }
      const rawFile = files[0] // only use files[0]

      if (!isExcel(rawFile)) {
        ElMessage.error('Only supports upload .xlsx, .xls, .csv suffix files')
        // eslint-disable-next-line consistent-return
        return false
      }
      upload(rawFile)
      e.stopPropagation()
      e.preventDefault()
    }
    return {
      ...toRefs(state),
      excelUploadInput,
      generateData,
      isExcel,
      getHeaderRow,
      readerData,
      upload,
      handleUpload,
      handleClick,
      handleDragover,
      handleDrop
    }
  }
}
</script>

<style lang="scss" scoped>
.excel-upload-input {
  display: none;
  z-index: -9999;
}
.drop {
  border: 2px dashed #bbb;
  width: 600px;
  height: 160px;
  line-height: 160px;
  margin: 0 auto;
  font-size: 24px;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
}
</style>
